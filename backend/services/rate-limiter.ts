import { logger } from './logger';
import { cache } from './cache';

// Rate limit configuration
export interface RateLimitConfig {
  windowMs: number;        // Time window in milliseconds
  maxRequests: number;     // Maximum requests per window
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: any) => string;
  onLimitReached?: (req: any, res: any) => void;
}

// Rate limit result
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

// Rate limit store interface
export interface RateLimitStore {
  get(key: string): Promise<{ count: number; resetTime: number } | null>;
  set(key: string, count: number, ttl: number): Promise<void>;
  increment(key: string, ttl: number): Promise<{ count: number; resetTime: number }>;
  reset(key: string): Promise<void>;
}

// Memory-based rate limit store
export class MemoryRateLimitStore implements RateLimitStore {
  private store = new Map<string, { count: number; resetTime: number }>();

  async get(key: string): Promise<{ count: number; resetTime: number } | null> {
    const item = this.store.get(key);
    if (!item) return null;
    
    if (Date.now() > item.resetTime) {
      this.store.delete(key);
      return null;
    }
    
    return item;
  }

  async set(key: string, count: number, ttl: number): Promise<void> {
    const resetTime = Date.now() + ttl;
    this.store.set(key, { count, resetTime });
  }

  async increment(key: string, ttl: number): Promise<{ count: number; resetTime: number }> {
    const existing = await this.get(key);
    
    if (existing) {
      const newCount = existing.count + 1;
      await this.set(key, newCount, existing.resetTime - Date.now());
      return { count: newCount, resetTime: existing.resetTime };
    } else {
      const resetTime = Date.now() + ttl;
      await this.set(key, 1, ttl);
      return { count: 1, resetTime };
    }
  }

  async reset(key: string): Promise<void> {
    this.store.delete(key);
  }
}

// Cache-based rate limit store
export class CacheRateLimitStore implements RateLimitStore {
  constructor(private cache: any) {}

  async get(key: string): Promise<{ count: number; resetTime: number } | null> {
    const item = await this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.resetTime) {
      await this.cache.delete(key);
      return null;
    }
    
    return item;
  }

  async set(key: string, count: number, ttl: number): Promise<void> {
    const resetTime = Date.now() + ttl;
    await this.cache.set(key, { count, resetTime }, ttl);
  }

  async increment(key: string, ttl: number): Promise<{ count: number; resetTime: number }> {
    const existing = await this.get(key);
    
    if (existing) {
      const newCount = existing.count + 1;
      await this.set(key, newCount, existing.resetTime - Date.now());
      return { count: newCount, resetTime: existing.resetTime };
    } else {
      const resetTime = Date.now() + ttl;
      await this.set(key, 1, ttl);
      return { count: 1, resetTime };
    }
  }

  async reset(key: string): Promise<void> {
    await this.cache.delete(key);
  }
}

// Rate limiter class
export class RateLimiter {
  private store: RateLimitStore;

  constructor(store?: RateLimitStore) {
    this.store = store || new MemoryRateLimitStore();
  }

  async checkLimit(
    key: string,
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    const { windowMs, maxRequests } = config;
    
    try {
      const result = await this.store.increment(key, windowMs);
      const remaining = Math.max(0, maxRequests - result.count);
      const allowed = result.count <= maxRequests;
      
      const rateLimitResult: RateLimitResult = {
        allowed,
        remaining,
        resetTime: result.resetTime,
      };
      
      if (!allowed) {
        rateLimitResult.retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
      }
      
      logger.debug('Rate limit check', {
        key,
        count: result.count,
        maxRequests,
        allowed,
        remaining,
      });
      
      return rateLimitResult;
    } catch (error) {
      logger.error('Rate limit check error', error instanceof Error ? error : new Error(String(error)), { key });
      
      // Fail open - allow request if rate limiting fails
      return {
        allowed: true,
        remaining: maxRequests,
        resetTime: Date.now() + windowMs,
      };
    }
  }

  async resetLimit(key: string): Promise<void> {
    await this.store.reset(key);
    logger.debug('Rate limit reset', { key });
  }
}

// Rate limiter factory
export function createRateLimiter(store?: RateLimitStore): RateLimiter {
  return new RateLimiter(store);
}

// Default rate limiter instance
export const rateLimiter = createRateLimiter();

// Rate limit middleware factory
export function createRateLimitMiddleware(config: RateLimitConfig) {
  return async (req: any, res: any, next: any) => {
    try {
      const key = config.keyGenerator ? config.keyGenerator(req) : getDefaultKey(req);
      const result = await rateLimiter.checkLimit(key, config);
      
      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', config.maxRequests);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', new Date(result.resetTime).toISOString());
      
      if (!result.allowed) {
        if (result.retryAfter) {
          res.setHeader('Retry-After', result.retryAfter);
        }
        
        logger.warn('Rate limit exceeded', {
          key,
          ip: req.ip,
          userAgent: req.headers['user-agent'],
          retryAfter: result.retryAfter,
        });
        
        if (config.onLimitReached) {
          config.onLimitReached(req, res);
        } else {
          res.status(429).json({
            error: 'Rate limit exceeded',
            message: 'Too many requests',
            retryAfter: result.retryAfter,
          });
        }
        return;
      }
      
      next();
    } catch (error) {
      logger.error('Rate limit middleware error', error instanceof Error ? error : new Error(String(error)));
      next();
    }
  };
}

// Default key generator
function getDefaultKey(req: any): string {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  return `rate_limit:${ip}:${userAgent}`;
}

// User-based key generator
export function createUserKeyGenerator() {
  return (req: any): string => {
    const userId = req.user?.id || req.headers['x-user-id'] || 'anonymous';
    return `rate_limit:user:${userId}`;
  };
}

// IP-based key generator
export function createIPKeyGenerator() {
  return (req: any): string => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    return `rate_limit:ip:${ip}`;
  };
}

// Endpoint-based key generator
export function createEndpointKeyGenerator() {
  return (req: any): string => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const endpoint = req.path || req.url;
    return `rate_limit:endpoint:${endpoint}:${ip}`;
  };
}

// Predefined rate limit configurations
export const RateLimitConfigs = {
  // Strict rate limiting
  strict: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },
  
  // Standard rate limiting
  standard: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000,
  },
  
  // Lenient rate limiting
  lenient: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10000,
  },
  
  // API endpoint rate limiting
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 500,
  },
  
  // Search endpoint rate limiting
  search: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
  },
  
  // Upload endpoint rate limiting
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
  },
  
  // Authentication rate limiting
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },
  
  // Password reset rate limiting
  passwordReset: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
  },
};

// Rate limit bypass for trusted sources
export function createBypassMiddleware(bypassKeys: string[]) {
  return (req: any, res: any, next: any) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey && bypassKeys.includes(apiKey)) {
      logger.debug('Rate limit bypassed', { apiKey: apiKey.substring(0, 8) + '...' });
      return next();
    }
    next();
  };
}

// Rate limit analytics
export class RateLimitAnalytics {
  private metrics = new Map<string, { requests: number; blocked: number; lastReset: number }>();

  recordRequest(key: string, allowed: boolean): void {
    const existing = this.metrics.get(key) || { requests: 0, blocked: 0, lastReset: Date.now() };
    existing.requests++;
    if (!allowed) {
      existing.blocked++;
    }
    this.metrics.set(key, existing);
  }

  getMetrics(): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [key, metrics] of this.metrics.entries()) {
      result[key] = {
        ...metrics,
        blockRate: metrics.requests > 0 ? (metrics.blocked / metrics.requests) * 100 : 0,
      };
    }
    return result;
  }

  resetMetrics(): void {
    this.metrics.clear();
  }
}

// Global rate limit analytics
export const rateLimitAnalytics = new RateLimitAnalytics();

// Enhanced rate limiter with analytics
export class EnhancedRateLimiter extends RateLimiter {
  async checkLimit(
    key: string,
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    const result = await super.checkLimit(key, config);
    rateLimitAnalytics.recordRequest(key, result.allowed);
    return result;
  }
}

// Enhanced rate limiter instance
export const enhancedRateLimiter = new EnhancedRateLimiter();

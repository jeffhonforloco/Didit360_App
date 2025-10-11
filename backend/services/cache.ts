import { logger } from './logger';

// Cache interface
export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlMs?: number): Promise<void>;
  delete(key: string): Promise<boolean>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
  keys(): Promise<string[]>;
  size(): Promise<number>;
}

// In-memory cache implementation
export class MemoryCache implements CacheService {
  private cache = new Map<string, { value: any; expires: number }>();
  private maxSize: number;
  private cleanupInterval: NodeJS.Timeout;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000); // Cleanup every minute
  }

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    
    if (!item) {
      logger.debug('Cache miss', { key });
      return null;
    }
    
    if (item.expires > 0 && Date.now() > item.expires) {
      this.cache.delete(key);
      logger.debug('Cache expired', { key });
      return null;
    }
    
    logger.debug('Cache hit', { key });
    return item.value as T;
  }

  async set<T>(key: string, value: T, ttlMs: number = 300000): Promise<void> { // 5 minutes default
    const expires = ttlMs > 0 ? Date.now() + ttlMs : 0;
    
    // Check if we need to evict items
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }
    
    this.cache.set(key, { value, expires });
    logger.debug('Cache set', { key, ttlMs });
  }

  async delete(key: string): Promise<boolean> {
    const deleted = this.cache.delete(key);
    logger.debug('Cache delete', { key, deleted });
    return deleted;
  }

  async clear(): Promise<void> {
    this.cache.clear();
    logger.debug('Cache cleared');
  }

  async has(key: string): Promise<boolean> {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (item.expires > 0 && Date.now() > item.expires) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  async keys(): Promise<string[]> {
    this.cleanup();
    return Array.from(this.cache.keys());
  }

  async size(): Promise<number> {
    this.cleanup();
    return this.cache.size;
  }

  private evictLRU(): void {
    // Simple LRU eviction - remove oldest item
    const oldestKey = this.cache.keys().next().value;
    if (oldestKey) {
      this.cache.delete(oldestKey);
      logger.debug('Cache evicted LRU item', { key: oldestKey });
    }
  }

  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (item.expires > 0 && now > item.expires) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      logger.debug('Cache cleanup completed', { cleaned });
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
  }
}

// Redis cache implementation (placeholder)
export class RedisCache implements CacheService {
  private redis: any;

  constructor(redisUrl: string) {
    // Initialize Redis connection
    logger.info('Redis cache initialized', { redisUrl: redisUrl.replace(/\/\/.*@/, '//***@') });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      logger.debug('Redis cache get', { key });
      // Implement Redis get
      return null;
    } catch (error) {
      logger.error('Redis cache get error', error instanceof Error ? error : new Error(String(error)), { key });
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlMs: number = 300000): Promise<void> {
    try {
      logger.debug('Redis cache set', { key, ttlMs });
      // Implement Redis set
    } catch (error) {
      logger.error('Redis cache set error', error instanceof Error ? error : new Error(String(error)), { key, ttlMs });
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      logger.debug('Redis cache delete', { key });
      // Implement Redis delete
      return true;
    } catch (error) {
      logger.error('Redis cache delete error', error instanceof Error ? error : new Error(String(error)), { key });
      return false;
    }
  }

  async clear(): Promise<void> {
    try {
      logger.debug('Redis cache clear');
      // Implement Redis clear
    } catch (error) {
      logger.error('Redis cache clear error', error instanceof Error ? error : new Error(String(error)));
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      logger.debug('Redis cache has', { key });
      // Implement Redis exists
      return false;
    } catch (error) {
      logger.error('Redis cache has error', error instanceof Error ? error : new Error(String(error)), { key });
      return false;
    }
  }

  async keys(): Promise<string[]> {
    try {
      logger.debug('Redis cache keys');
      // Implement Redis keys
      return [];
    } catch (error) {
      logger.error('Redis cache keys error', error instanceof Error ? error : new Error(String(error)));
      return [];
    }
  }

  async size(): Promise<number> {
    try {
      logger.debug('Redis cache size');
      // Implement Redis dbsize
      return 0;
    } catch (error) {
      logger.error('Redis cache size error', error instanceof Error ? error : new Error(String(error)));
      return 0;
    }
  }
}

// Cache factory
export function createCacheService(): CacheService {
  const redisUrl = process.env.REDIS_URL;
  
  if (redisUrl) {
    logger.info('Using Redis cache');
    return new RedisCache(redisUrl);
  } else {
    logger.info('Using memory cache (no REDIS_URL configured)');
    return new MemoryCache();
  }
}

// Cache service singleton
export const cache = createCacheService();

// Cache utility functions
export class CacheUtils {
  constructor(private cache: CacheService) {}

  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttlMs: number = 300000
  ): Promise<T> {
    const cached = await this.cache.get<T>(key);
    if (cached !== null) {
      return cached;
    }
    
    const value = await factory();
    await this.cache.set(key, value, ttlMs);
    return value;
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.cache.keys();
    const regex = new RegExp(pattern);
    
    for (const key of keys) {
      if (regex.test(key)) {
        await this.cache.delete(key);
        logger.debug('Cache invalidated by pattern', { key, pattern });
      }
    }
  }

  async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.cache.keys();
    
    for (const key of keys) {
      if (key.startsWith(prefix)) {
        await this.cache.delete(key);
        logger.debug('Cache invalidated by prefix', { key, prefix });
      }
    }
  }

  async warmup<T>(key: string, factory: () => Promise<T>, ttlMs: number = 300000): Promise<void> {
    try {
      const value = await factory();
      await this.cache.set(key, value, ttlMs);
      logger.debug('Cache warmed up', { key });
    } catch (error) {
      logger.error('Cache warmup failed', error instanceof Error ? error : new Error(String(error)), { key });
    }
  }

  async getStats(): Promise<{
    size: number;
    keys: string[];
    hitRate?: number;
  }> {
    const size = await this.cache.size();
    const keys = await this.cache.keys();
    
    return {
      size,
      keys,
    };
  }
}

// Cache service instance
export const cacheUtils = new CacheUtils(cache);

// Cache decorators
export function cached(ttlMs: number = 300000, keyGenerator?: (...args: any[]) => string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const key = keyGenerator ? keyGenerator(...args) : `${target.constructor.name}:${propertyName}:${JSON.stringify(args)}`;
      
      const cached = await cache.get(key);
      if (cached !== null) {
        return cached;
      }
      
      const result = await method.apply(this, args);
      await cache.set(key, result, ttlMs);
      return result;
    };
  };
}

export function cacheInvalidate(pattern: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const result = await method.apply(this, args);
      await cacheUtils.invalidatePattern(pattern);
      return result;
    };
  };
}

// Cache key generators
export const CacheKeys = {
  track: (id: string) => `track:${id}`,
  artist: (id: string) => `artist:${id}`,
  album: (id: string) => `album:${id}`,
  playlist: (id: string) => `playlist:${id}`,
  user: (id: string) => `user:${id}`,
  search: (query: string, type?: string) => `search:${type || 'all'}:${query}`,
  featured: (type?: string) => `featured:${type || 'all'}`,
  trending: (type?: string) => `trending:${type || 'all'}`,
  recommendations: (userId: string, type?: string) => `recommendations:${userId}:${type || 'all'}`,
};

// Cache TTL constants
export const CacheTTL = {
  SHORT: 60000,      // 1 minute
  MEDIUM: 300000,    // 5 minutes
  LONG: 1800000,     // 30 minutes
  VERY_LONG: 3600000, // 1 hour
  PERSISTENT: 0,      // No expiration
};

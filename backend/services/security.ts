import { logger } from './logger';
import { createHash, randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

// Security configuration
export interface SecurityConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  bcryptRounds: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  sessionTimeout: number;
  corsOrigins: string[];
  rateLimitEnabled: boolean;
}

// Security service class
export class SecurityService {
  private config: SecurityConfig;
  private loginAttempts = new Map<string, { count: number; lastAttempt: number; lockedUntil?: number }>();

  constructor(config: SecurityConfig) {
    this.config = config;
  }

  // Password hashing
  async hashPassword(password: string): Promise<string> {
    try {
      const salt = randomBytes(16);
      const hash = await scryptAsync(password, salt, 64) as Buffer;
      return salt.toString('hex') + ':' + hash.toString('hex');
    } catch (error) {
      logger.error('Password hashing error', error instanceof Error ? error : new Error(String(error)));
      throw new Error('Password hashing failed');
    }
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      const [salt, hash] = hashedPassword.split(':');
      const hashBuffer = Buffer.from(hash, 'hex');
      const derivedKey = await scryptAsync(password, Buffer.from(salt, 'hex'), 64) as Buffer;
      return timingSafeEqual(hashBuffer, derivedKey);
    } catch (error) {
      logger.error('Password verification error', error instanceof Error ? error : new Error(String(error)));
      return false;
    }
  }

  // JWT token generation and verification
  generateToken(payload: Record<string, any>): string {
    try {
      const header = {
        alg: 'HS256',
        typ: 'JWT',
      };

      const now = Math.floor(Date.now() / 1000);
      const tokenPayload = {
        ...payload,
        iat: now,
        exp: now + this.parseExpiresIn(this.config.jwtExpiresIn),
      };

      const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
      const encodedPayload = this.base64UrlEncode(JSON.stringify(tokenPayload));
      const signature = this.createSignature(encodedHeader + '.' + encodedPayload);

      return `${encodedHeader}.${encodedPayload}.${signature}`;
    } catch (error) {
      logger.error('Token generation error', error instanceof Error ? error : new Error(String(error)));
      throw new Error('Token generation failed');
    }
  }

  verifyToken(token: string): Record<string, any> | null {
    try {
      const [header, payload, signature] = token.split('.');
      
      if (!header || !payload || !signature) {
        return null;
      }

      const expectedSignature = this.createSignature(header + '.' + payload);
      if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
        return null;
      }

      const decodedPayload = JSON.parse(this.base64UrlDecode(payload));
      
      if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }

      return decodedPayload;
    } catch (error) {
      logger.error('Token verification error', error instanceof Error ? error : new Error(String(error)));
      return null;
    }
  }

  // Login attempt tracking
  recordLoginAttempt(identifier: string, success: boolean): void {
    const now = Date.now();
    const attempts = this.loginAttempts.get(identifier) || { count: 0, lastAttempt: now };

    if (success) {
      this.loginAttempts.delete(identifier);
      logger.info('Successful login', { identifier });
      return;
    }

    attempts.count++;
    attempts.lastAttempt = now;

    if (attempts.count >= this.config.maxLoginAttempts) {
      attempts.lockedUntil = now + this.config.lockoutDuration;
      logger.warn('Account locked due to too many failed attempts', {
        identifier,
        attempts: attempts.count,
        lockedUntil: new Date(attempts.lockedUntil).toISOString(),
      });
    }

    this.loginAttempts.set(identifier, attempts);
  }

  isAccountLocked(identifier: string): boolean {
    const attempts = this.loginAttempts.get(identifier);
    if (!attempts || !attempts.lockedUntil) {
      return false;
    }

    if (Date.now() > attempts.lockedUntil) {
      this.loginAttempts.delete(identifier);
      return false;
    }

    return true;
  }

  getRemainingLockoutTime(identifier: string): number {
    const attempts = this.loginAttempts.get(identifier);
    if (!attempts || !attempts.lockedUntil) {
      return 0;
    }

    return Math.max(0, attempts.lockedUntil - Date.now());
  }

  // Input sanitization
  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/['"]/g, '') // Remove quotes
      .replace(/[;\\]/g, '') // Remove semicolons and backslashes
      .trim();
  }

  // SQL injection prevention
  sanitizeSQL(input: string): string {
    return input
      .replace(/['"]/g, '') // Remove quotes
      .replace(/[;\\]/g, '') // Remove semicolons and backslashes
      .replace(/--/g, '') // Remove SQL comments
      .replace(/\/\*/g, '') // Remove block comment starts
      .replace(/\*\//g, '') // Remove block comment ends
      .trim();
  }

  // XSS prevention
  sanitizeHTML(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // CSRF token generation
  generateCSRFToken(): string {
    return randomBytes(32).toString('hex');
  }

  // CSRF token verification
  verifyCSRFToken(token: string, sessionToken: string): boolean {
    return timingSafeEqual(Buffer.from(token), Buffer.from(sessionToken));
  }

  // API key generation
  generateAPIKey(): string {
    return randomBytes(32).toString('hex');
  }

  // API key hashing
  hashAPIKey(apiKey: string): string {
    return createHash('sha256').update(apiKey).digest('hex');
  }

  // Session management
  createSession(userId: string): string {
    const sessionId = randomBytes(32).toString('hex');
    const expiresAt = Date.now() + this.config.sessionTimeout;
    
    logger.info('Session created', { userId, sessionId, expiresAt: new Date(expiresAt).toISOString() });
    return sessionId;
  }

  validateSession(sessionId: string, userId: string): boolean {
    // In a real implementation, this would check against a session store
    // For now, we'll just validate the format
    return /^[a-f0-9]{64}$/.test(sessionId);
  }

  // Security headers
  getSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
    };
  }

  // CORS configuration
  getCORSConfig(): any {
    return {
      origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || this.config.corsOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      optionsSuccessStatus: 200,
    };
  }

  // Rate limiting configuration
  getRateLimitConfig(): any {
    return {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    };
  }

  // Private helper methods
  private base64UrlEncode(str: string): string {
    return Buffer.from(str).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private base64UrlDecode(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
      str += '=';
    }
    return Buffer.from(str, 'base64').toString();
  }

  private createSignature(data: string): string {
    return createHash('sha256')
      .update(data + this.config.jwtSecret)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 3600; // Default to 1 hour
    }

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 3600;
      case 'd': return value * 86400;
      default: return 3600;
    }
  }
}

// Security middleware
export function createSecurityMiddleware(securityService: SecurityService) {
  return (req: any, res: any, next: any) => {
    // Set security headers
    const headers = securityService.getSecurityHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // Sanitize request body
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body, securityService);
    }

    // Log security events
    if (req.path.includes('login') || req.path.includes('auth')) {
      logger.info('Authentication attempt', {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path,
      });
    }

    next();
  };
}

// Object sanitization
function sanitizeObject(obj: any, securityService: SecurityService): any {
  if (typeof obj === 'string') {
    return securityService.sanitizeInput(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, securityService));
  }

  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value, securityService);
    }
    return sanitized;
  }

  return obj;
}

// Security configuration factory
export function createSecurityConfig(): SecurityConfig {
  return {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5'),
    lockoutDuration: parseInt(process.env.LOCKOUT_DURATION || '900000'), // 15 minutes
    sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '3600000'), // 1 hour
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    rateLimitEnabled: process.env.RATE_LIMIT_ENABLED !== 'false',
  };
}

// Security service singleton
export const securityService = new SecurityService(createSecurityConfig());

// Security utilities
export const SecurityUtils = {
  // Generate secure random string
  generateSecureRandom(length: number = 32): string {
    return randomBytes(length).toString('hex');
  },

  // Generate secure password
  generateSecurePassword(length: number = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  },

  // Validate password strength
  validatePasswordStrength(password: string): { valid: boolean; score: number; feedback: string[] } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length < 8) {
      feedback.push('Password must be at least 8 characters long');
    } else {
      score += 1;
    }

    if (!/[a-z]/.test(password)) {
      feedback.push('Password must contain at least one lowercase letter');
    } else {
      score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      feedback.push('Password must contain at least one uppercase letter');
    } else {
      score += 1;
    }

    if (!/[0-9]/.test(password)) {
      feedback.push('Password must contain at least one number');
    } else {
      score += 1;
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      feedback.push('Password must contain at least one special character');
    } else {
      score += 1;
    }

    return {
      valid: score >= 4,
      score,
      feedback,
    };
  },

  // Check for common passwords
  isCommonPassword(password: string): boolean {
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey',
    ];
    return commonPasswords.includes(password.toLowerCase());
  },
};

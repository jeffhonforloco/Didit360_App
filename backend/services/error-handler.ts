import { TRPCError } from '@trpc/server';
import { logger } from './logger';

// Custom error types
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Insufficient permissions') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error {
  constructor(resource: string, id?: string) {
    super(`${resource}${id ? ` with id ${id}` : ''} not found`);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends Error {
  constructor(message: string = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class ExternalServiceError extends Error {
  constructor(service: string, message: string) {
    super(`${service} service error: ${message}`);
    this.name = 'ExternalServiceError';
  }
}

export class DatabaseError extends Error {
  constructor(message: string, public query?: string) {
    super(`Database error: ${message}`);
    this.name = 'DatabaseError';
  }
}

// Error handler class
export class ErrorHandler {
  static handle(error: unknown, context?: Record<string, any>): TRPCError {
    logger.error('Error occurred', error instanceof Error ? error : new Error(String(error)), context);

    if (error instanceof TRPCError) {
      return error;
    }

    if (error instanceof ValidationError) {
      return new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message,
        cause: error,
      });
    }

    if (error instanceof AuthenticationError) {
      return new TRPCError({
        code: 'UNAUTHORIZED',
        message: error.message,
        cause: error,
      });
    }

    if (error instanceof AuthorizationError) {
      return new TRPCError({
        code: 'FORBIDDEN',
        message: error.message,
        cause: error,
      });
    }

    if (error instanceof NotFoundError) {
      return new TRPCError({
        code: 'NOT_FOUND',
        message: error.message,
        cause: error,
      });
    }

    if (error instanceof ConflictError) {
      return new TRPCError({
        code: 'CONFLICT',
        message: error.message,
        cause: error,
      });
    }

    if (error instanceof RateLimitError) {
      return new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: error.message,
        cause: error,
      });
    }

    if (error instanceof ExternalServiceError) {
      return new TRPCError({
        code: 'BAD_GATEWAY',
        message: error.message,
        cause: error,
      });
    }

    if (error instanceof DatabaseError) {
      return new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Database operation failed',
        cause: error,
      });
    }

    // Handle specific error types
    if (error instanceof Error) {
      // Network errors
      if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
        return new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'Service temporarily unavailable',
          cause: error,
        });
      }

      // Timeout errors
      if (error.message.includes('timeout')) {
        return new TRPCError({
          code: 'TIMEOUT',
          message: 'Request timeout',
          cause: error,
        });
      }

      // JSON parsing errors
      if (error.message.includes('JSON') || error.message.includes('parse')) {
        return new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid JSON format',
          cause: error,
        });
      }

      // File system errors
      if (error.message.includes('ENOENT') || error.message.includes('file')) {
        return new TRPCError({
          code: 'NOT_FOUND',
          message: 'Resource not found',
          cause: error,
        });
      }
    }

    // Generic error fallback
    return new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      cause: error,
    });
  }

  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      throw this.handle(error, context);
    }
  }

  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000,
    context?: Record<string, any>
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          logger.error(`Operation failed after ${maxRetries} attempts`, error instanceof Error ? error : new Error(String(error)), {
            ...context,
            attempts: maxRetries,
          });
          break;
        }

        logger.warn(`Operation failed, retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`, {
          ...context,
          attempt,
          maxRetries,
          error: error instanceof Error ? error.message : String(error),
        });

        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }

    throw this.handle(lastError, context);
  }

  static async withTimeout<T>(
    operation: () => Promise<T>,
    timeoutMs: number = 5000,
    context?: Record<string, any>
  ): Promise<T> {
    return Promise.race([
      operation(),
      new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Operation timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      }),
    ]);
  }

  static async withCircuitBreaker<T>(
    operation: () => Promise<T>,
    failureThreshold: number = 5,
    timeoutMs: number = 60000,
    context?: Record<string, any>
  ): Promise<T> {
    // Simple circuit breaker implementation
    const key = JSON.stringify(context);
    const state = circuitBreakerState.get(key) || { failures: 0, lastFailure: 0, isOpen: false };

    if (state.isOpen && Date.now() - state.lastFailure < timeoutMs) {
      throw new TRPCError({
        code: 'SERVICE_UNAVAILABLE',
        message: 'Service temporarily unavailable',
      });
    }

    try {
      const result = await operation();
      // Reset on success
      circuitBreakerState.set(key, { failures: 0, lastFailure: 0, isOpen: false });
      return result;
    } catch (error) {
      state.failures++;
      state.lastFailure = Date.now();
      
      if (state.failures >= failureThreshold) {
        state.isOpen = true;
        logger.warn('Circuit breaker opened', { ...context, failures: state.failures });
      }
      
      circuitBreakerState.set(key, state);
      throw error;
    }
  }
}

// Circuit breaker state storage
const circuitBreakerState = new Map<string, {
  failures: number;
  lastFailure: number;
  isOpen: boolean;
}>();

// Validation utilities
export function validateRequired(value: any, fieldName: string): void {
  if (value === undefined || value === null || value === '') {
    throw new ValidationError(`${fieldName} is required`, fieldName);
  }
}

export function validateString(value: any, fieldName: string, minLength?: number, maxLength?: number): void {
  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`, fieldName);
  }
  
  if (minLength !== undefined && value.length < minLength) {
    throw new ValidationError(`${fieldName} must be at least ${minLength} characters`, fieldName);
  }
  
  if (maxLength !== undefined && value.length > maxLength) {
    throw new ValidationError(`${fieldName} must be at most ${maxLength} characters`, fieldName);
  }
}

export function validateNumber(value: any, fieldName: string, min?: number, max?: number): void {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new ValidationError(`${fieldName} must be a number`, fieldName);
  }
  
  if (min !== undefined && value < min) {
    throw new ValidationError(`${fieldName} must be at least ${min}`, fieldName);
  }
  
  if (max !== undefined && value > max) {
    throw new ValidationError(`${fieldName} must be at most ${max}`, fieldName);
  }
}

export function validateEmail(value: any, fieldName: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    throw new ValidationError(`${fieldName} must be a valid email address`, fieldName);
  }
}

export function validateUrl(value: any, fieldName: string): void {
  try {
    new URL(value);
  } catch {
    throw new ValidationError(`${fieldName} must be a valid URL`, fieldName);
  }
}

export function validateArray(value: any, fieldName: string, minLength?: number, maxLength?: number): void {
  if (!Array.isArray(value)) {
    throw new ValidationError(`${fieldName} must be an array`, fieldName);
  }
  
  if (minLength !== undefined && value.length < minLength) {
    throw new ValidationError(`${fieldName} must have at least ${minLength} items`, fieldName);
  }
  
  if (maxLength !== undefined && value.length > maxLength) {
    throw new ValidationError(`${fieldName} must have at most ${maxLength} items`, fieldName);
  }
}

// Rate limiting utilities
export function createRateLimiter(maxRequests: number, windowMs: number) {
  const requests = new Map<string, number[]>();

  return (key: string): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    const userRequests = requests.get(key) || [];
    const recentRequests = userRequests.filter(time => time > windowStart);
    
    if (recentRequests.length >= maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    requests.set(key, recentRequests);
    return true;
  };
}

// Error recovery utilities
export async function withFallback<T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T>,
  context?: Record<string, any>
): Promise<T> {
  try {
    return await primary();
  } catch (error) {
    logger.warn('Primary operation failed, using fallback', {
      ...context,
      error: error instanceof Error ? error.message : String(error),
    });
    return await fallback();
  }
}

export async function withCache<T>(
  key: string,
  operation: () => Promise<T>,
  ttlMs: number = 300000, // 5 minutes
  context?: Record<string, any>
): Promise<T> {
  const cache = new Map<string, { value: T; expires: number }>();
  
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    logger.debug('Cache hit', { key, ...context });
    return cached.value;
  }
  
  logger.debug('Cache miss', { key, ...context });
  const result = await operation();
  cache.set(key, { value: result, expires: Date.now() + ttlMs });
  return result;
}

import { z } from 'zod';

// Log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

// Log entry schema
const LogEntrySchema = z.object({
  timestamp: z.string(),
  level: z.nativeEnum(LogLevel),
  message: z.string(),
  context: z.record(z.any()).optional(),
  error: z.object({
    name: z.string(),
    message: z.string(),
    stack: z.string().optional(),
  }).optional(),
  metadata: z.record(z.any()).optional(),
});

export type LogEntry = z.infer<typeof LogEntrySchema>;

// Logger interface
export interface Logger {
  debug(message: string, context?: Record<string, any>): void;
  info(message: string, context?: Record<string, any>): void;
  warn(message: string, context?: Record<string, any>): void;
  error(message: string, error?: Error, context?: Record<string, any>): void;
  fatal(message: string, error?: Error, context?: Record<string, any>): void;
}

// Console logger implementation
export class ConsoleLogger implements Logger {
  private minLevel: LogLevel;
  private serviceName: string;

  constructor(serviceName: string = 'app', minLevel: LogLevel = LogLevel.INFO) {
    this.serviceName = serviceName;
    this.minLevel = minLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  private formatMessage(level: LogLevel, message: string, context?: Record<string, any>): string {
    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${this.serviceName}] [${levelName}] ${message}${contextStr}`;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, context);
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
      case LogLevel.FATAL:
        console.error(`🚨 FATAL: ${formattedMessage}`);
        break;
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    const errorContext = error ? {
      ...context,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    } : context;
    this.log(LogLevel.ERROR, message, errorContext);
  }

  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    const errorContext = error ? {
      ...context,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    } : context;
    this.log(LogLevel.FATAL, message, errorContext);
  }
}

// Structured logger for production
export class StructuredLogger implements Logger {
  private minLevel: LogLevel;
  private serviceName: string;

  constructor(serviceName: string = 'app', minLevel: LogLevel = LogLevel.INFO) {
    this.serviceName = serviceName;
    this.minLevel = minLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  private createLogEntry(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : undefined,
      metadata: {
        service: this.serviceName,
        environment: process.env.NODE_ENV || 'development',
      },
    };
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, context, error);
    console.log(JSON.stringify(entry));
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.FATAL, message, context, error);
  }
}

// Factory function to create appropriate logger
export function createLogger(serviceName: string = 'app'): Logger {
  const isProduction = process.env.NODE_ENV === 'production';
  const logLevel = process.env.LOG_LEVEL ? 
    LogLevel[process.env.LOG_LEVEL as keyof typeof LogLevel] || LogLevel.INFO : 
    LogLevel.INFO;

  if (isProduction) {
    return new StructuredLogger(serviceName, logLevel);
  } else {
    return new ConsoleLogger(serviceName, logLevel);
  }
}

// Global logger instance
export const logger = createLogger('didit360-api');

// Request logging middleware
export function createRequestLogger() {
  return (req: any, res: any, next: any) => {
    const start = Date.now();
    const requestId = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    req.requestId = requestId;
    res.setHeader('x-request-id', requestId);

    logger.info('Request started', {
      requestId,
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });

    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info('Request completed', {
        requestId,
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration,
      });
    });

    next();
  };
}

// Error logging utility
export function logError(error: Error, context?: Record<string, any>): void {
  logger.error('Unhandled error', error, context);
}

// Performance logging utility
export function logPerformance(operation: string, duration: number, context?: Record<string, any>): void {
  logger.info('Performance metric', {
    operation,
    duration,
    ...context,
  });
}

// Business logic logging utilities
export function logUserAction(userId: string, action: string, context?: Record<string, any>): void {
  logger.info('User action', {
    userId,
    action,
    ...context,
  });
}

export function logAPICall(endpoint: string, method: string, statusCode: number, duration: number, context?: Record<string, any>): void {
  logger.info('API call', {
    endpoint,
    method,
    statusCode,
    duration,
    ...context,
  });
}

export function logDatabaseQuery(query: string, duration: number, context?: Record<string, any>): void {
  logger.info('Database query', {
    query,
    duration,
    ...context,
  });
}

export function logCacheHit(key: string, context?: Record<string, any>): void {
  logger.debug('Cache hit', { key, ...context });
}

export function logCacheMiss(key: string, context?: Record<string, any>): void {
  logger.debug('Cache miss', { key, ...context });
}

export function logSecurityEvent(event: string, context?: Record<string, any>): void {
  logger.warn('Security event', { event, ...context });
}

export function logBusinessMetric(metric: string, value: number, context?: Record<string, any>): void {
  logger.info('Business metric', { metric, value, ...context });
}

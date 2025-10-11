import { logger } from './logger';
import { database } from './database';
import { cache } from './cache';

// Health check interface
export interface HealthCheck {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  message?: string;
  details?: Record<string, any>;
  responseTime?: number;
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  uptime: number;
  checks: HealthCheck[];
  summary: {
    total: number;
    healthy: number;
    unhealthy: number;
    degraded: number;
  };
}

// Health check base class
export abstract class BaseHealthCheck {
  abstract name: string;
  abstract check(): Promise<HealthCheck>;
}

// Database health check
export class DatabaseHealthCheck extends BaseHealthCheck {
  name = 'database';

  async check(): Promise<HealthCheck> {
    const start = Date.now();
    
    try {
      // Test database connection
      await database.query('SELECT 1');
      const responseTime = Date.now() - start;
      
      return {
        name: this.name,
        status: 'healthy',
        message: 'Database connection successful',
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - start;
      
      return {
        name: this.name,
        status: 'unhealthy',
        message: 'Database connection failed',
        details: {
          error: error instanceof Error ? error.message : String(error),
        },
        responseTime,
      };
    }
  }
}

// Cache health check
export class CacheHealthCheck extends BaseHealthCheck {
  name = 'cache';

  async check(): Promise<HealthCheck> {
    const start = Date.now();
    
    try {
      // Test cache operations
      const testKey = 'health-check';
      const testValue = 'test';
      
      await cache.set(testKey, testValue, 1000);
      const retrieved = await cache.get(testKey);
      await cache.delete(testKey);
      
      const responseTime = Date.now() - start;
      
      if (retrieved === testValue) {
        return {
          name: this.name,
          status: 'healthy',
          message: 'Cache operations successful',
          responseTime,
        };
      } else {
        return {
          name: this.name,
          status: 'degraded',
          message: 'Cache operations inconsistent',
          responseTime,
        };
      }
    } catch (error) {
      const responseTime = Date.now() - start;
      
      return {
        name: this.name,
        status: 'unhealthy',
        message: 'Cache operations failed',
        details: {
          error: error instanceof Error ? error.message : String(error),
        },
        responseTime,
      };
    }
  }
}

// Memory health check
export class MemoryHealthCheck extends BaseHealthCheck {
  name = 'memory';

  async check(): Promise<HealthCheck> {
    const start = Date.now();
    
    try {
      const memUsage = process.memoryUsage();
      const totalMemory = memUsage.heapTotal;
      const usedMemory = memUsage.heapUsed;
      const externalMemory = memUsage.external;
      const rssMemory = memUsage.rss;
      
      const memoryUsagePercent = (usedMemory / totalMemory) * 100;
      const responseTime = Date.now() - start;
      
      let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
      let message = 'Memory usage normal';
      
      if (memoryUsagePercent > 90) {
        status = 'unhealthy';
        message = 'Memory usage critically high';
      } else if (memoryUsagePercent > 80) {
        status = 'degraded';
        message = 'Memory usage high';
      }
      
      return {
        name: this.name,
        status,
        message,
        details: {
          heapTotal: totalMemory,
          heapUsed: usedMemory,
          external: externalMemory,
          rss: rssMemory,
          usagePercent: Math.round(memoryUsagePercent * 100) / 100,
        },
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - start;
      
      return {
        name: this.name,
        status: 'unhealthy',
        message: 'Memory check failed',
        details: {
          error: error instanceof Error ? error.message : String(error),
        },
        responseTime,
      };
    }
  }
}

// Disk space health check
export class DiskHealthCheck extends BaseHealthCheck {
  name = 'disk';

  async check(): Promise<HealthCheck> {
    const start = Date.now();
    
    try {
      // Simple disk space check (mock implementation)
      const responseTime = Date.now() - start;
      
      return {
        name: this.name,
        status: 'healthy',
        message: 'Disk space available',
        details: {
          freeSpace: 'N/A', // Would implement real disk space check
          totalSpace: 'N/A',
        },
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - start;
      
      return {
        name: this.name,
        status: 'unhealthy',
        message: 'Disk space check failed',
        details: {
          error: error instanceof Error ? error.message : String(error),
        },
        responseTime,
      };
    }
  }
}

// External service health check
export class ExternalServiceHealthCheck extends BaseHealthCheck {
  name = 'external-services';

  async check(): Promise<HealthCheck> {
    const start = Date.now();
    
    try {
      const services = [
        { name: 'OpenAI API', url: 'https://api.openai.com/v1/models', required: false },
        { name: 'Catalog API', url: process.env.CATALOG_API_URL, required: false },
        { name: 'Redis', url: process.env.REDIS_URL, required: false },
      ];
      
      const results = await Promise.allSettled(
        services.map(async (service) => {
          if (!service.url) {
            return { name: service.name, status: 'not-configured' };
          }
          
          try {
            const response = await fetch(service.url, { 
              method: 'HEAD',
              signal: AbortSignal.timeout(5000) 
            });
            return { 
              name: service.name, 
              status: response.ok ? 'healthy' : 'unhealthy' 
            };
          } catch {
            return { name: service.name, status: 'unhealthy' };
          }
        })
      );
      
      const responseTime = Date.now() - start;
      const serviceResults = results.map((result, index) => ({
        ...services[index],
        status: result.status === 'fulfilled' ? result.value.status : 'unhealthy',
      }));
      
      const unhealthyServices = serviceResults.filter(s => s.status === 'unhealthy');
      const requiredUnhealthy = serviceResults.filter(s => s.required && s.status === 'unhealthy');
      
      let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
      let message = 'All external services healthy';
      
      if (requiredUnhealthy.length > 0) {
        status = 'unhealthy';
        message = 'Required external services unavailable';
      } else if (unhealthyServices.length > 0) {
        status = 'degraded';
        message = 'Some external services unavailable';
      }
      
      return {
        name: this.name,
        status,
        message,
        details: {
          services: serviceResults,
        },
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - start;
      
      return {
        name: this.name,
        status: 'unhealthy',
        message: 'External services check failed',
        details: {
          error: error instanceof Error ? error.message : String(error),
        },
        responseTime,
      };
    }
  }
}

// Health service
export class HealthService {
  private checks: BaseHealthCheck[] = [];
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
    this.initializeChecks();
  }

  private initializeChecks(): void {
    this.checks = [
      new DatabaseHealthCheck(),
      new CacheHealthCheck(),
      new MemoryHealthCheck(),
      new DiskHealthCheck(),
      new ExternalServiceHealthCheck(),
    ];
  }

  async getHealthStatus(): Promise<HealthStatus> {
    const timestamp = new Date().toISOString();
    const uptime = Date.now() - this.startTime;
    
    logger.info('Health check started');
    
    const checkResults = await Promise.allSettled(
      this.checks.map(check => check.check())
    );
    
    const checks: HealthCheck[] = checkResults.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          name: this.checks[index].name,
          status: 'unhealthy' as const,
          message: 'Health check failed',
          details: {
            error: result.reason instanceof Error ? result.reason.message : String(result.reason),
          },
        };
      }
    });
    
    const summary = {
      total: checks.length,
      healthy: checks.filter(c => c.status === 'healthy').length,
      unhealthy: checks.filter(c => c.status === 'unhealthy').length,
      degraded: checks.filter(c => c.status === 'degraded').length,
    };
    
    let overallStatus: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
    if (summary.unhealthy > 0) {
      overallStatus = 'unhealthy';
    } else if (summary.degraded > 0) {
      overallStatus = 'degraded';
    }
    
    const healthStatus: HealthStatus = {
      status: overallStatus,
      timestamp,
      version: process.env.npm_package_version || '1.0.0',
      uptime,
      checks,
      summary,
    };
    
    logger.info('Health check completed', {
      status: overallStatus,
      summary,
    });
    
    return healthStatus;
  }

  async getDetailedHealth(): Promise<HealthStatus & { environment: any; system: any }> {
    const basicHealth = await this.getHealthStatus();
    
    return {
      ...basicHealth,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        env: process.env.NODE_ENV,
      },
      system: {
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        cpuUsage: process.cpuUsage(),
      },
    };
  }

  addCheck(check: BaseHealthCheck): void {
    this.checks.push(check);
  }

  removeCheck(name: string): void {
    this.checks = this.checks.filter(check => check.name !== name);
  }
}

// Health service singleton
export const healthService = new HealthService();

// Health check endpoints
export async function getHealthStatus(): Promise<HealthStatus> {
  return await healthService.getHealthStatus();
}

export async function getDetailedHealth(): Promise<HealthStatus & { environment: any; system: any }> {
  return await healthService.getDetailedHealth();
}

// Health check middleware
export function createHealthCheckMiddleware() {
  return async (req: any, res: any, next: any) => {
    if (req.path === '/health' || req.path === '/health/status') {
      try {
        const health = await getHealthStatus();
        const statusCode = health.status === 'healthy' ? 200 : 503;
        res.status(statusCode).json(health);
        return;
      } catch (error) {
        logger.error('Health check endpoint error', error instanceof Error ? error : new Error(String(error)));
        res.status(500).json({
          status: 'unhealthy',
          message: 'Health check failed',
          error: error instanceof Error ? error.message : String(error),
        });
        return;
      }
    }
    
    if (req.path === '/health/detailed') {
      try {
        const health = await getDetailedHealth();
        const statusCode = health.status === 'healthy' ? 200 : 503;
        res.status(statusCode).json(health);
        return;
      } catch (error) {
        logger.error('Detailed health check endpoint error', error instanceof Error ? error : new Error(String(error)));
        res.status(500).json({
          status: 'unhealthy',
          message: 'Detailed health check failed',
          error: error instanceof Error ? error.message : String(error),
        });
        return;
      }
    }
    
    next();
  };
}

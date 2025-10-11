import { logger } from './logger';

// API documentation interface
export interface APIDocumentation {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
    contact?: {
      name: string;
      email: string;
      url: string;
    };
    license?: {
      name: string;
      url: string;
    };
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
    securitySchemes: Record<string, any>;
  };
  security: Array<Record<string, string[]>>;
}

// API endpoint documentation
export interface APIEndpoint {
  path: string;
  method: string;
  summary: string;
  description: string;
  tags: string[];
  parameters?: Array<{
    name: string;
    in: 'query' | 'path' | 'header' | 'cookie';
    required: boolean;
    schema: any;
    description?: string;
  }>;
  requestBody?: {
    required: boolean;
    content: Record<string, any>;
  };
  responses: Record<string, {
    description: string;
    content?: Record<string, any>;
  }>;
  security?: Array<Record<string, string[]>>;
}

// API documentation generator
export class APIDocumentationGenerator {
  private endpoints: APIEndpoint[] = [];
  private schemas: Record<string, any> = {};
  private securitySchemes: Record<string, any> = {};

  constructor() {
    this.initializeDefaultSchemas();
    this.initializeSecuritySchemes();
  }

  private initializeDefaultSchemas(): void {
    this.schemas = {
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' },
          code: { type: 'string' },
        },
        required: ['error', 'message'],
      },
      Track: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          artist: { type: 'string' },
          album: { type: 'string' },
          duration: { type: 'number' },
          artwork: { type: 'string' },
          audioUrl: { type: 'string' },
          type: { type: 'string', enum: ['song', 'video', 'podcast', 'audiobook'] },
          explicit: { type: 'boolean' },
          genre: { type: 'string' },
        },
        required: ['id', 'title', 'artist', 'duration', 'type'],
      },
      Artist: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          image: { type: 'string' },
          followers: { type: 'string' },
          verified: { type: 'boolean' },
          genre: { type: 'string' },
          bio: { type: 'string' },
        },
        required: ['id', 'name'],
      },
      Album: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          artist: { type: 'string' },
          releaseDate: { type: 'string' },
          genre: { type: 'string' },
          trackCount: { type: 'number' },
          coverImage: { type: 'string' },
        },
        required: ['id', 'title', 'artist'],
      },
      Playlist: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          userId: { type: 'string' },
          isPublic: { type: 'boolean' },
          trackCount: { type: 'number' },
          duration: { type: 'number' },
          coverImage: { type: 'string' },
        },
        required: ['id', 'name', 'userId'],
      },
      SearchResult: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          title: { type: 'string' },
          subtitle: { type: 'string' },
          artwork: { type: 'string' },
          version: { type: 'number' },
        },
        required: ['id', 'type', 'title'],
      },
      HealthStatus: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['healthy', 'unhealthy', 'degraded'] },
          timestamp: { type: 'string' },
          version: { type: 'string' },
          uptime: { type: 'number' },
          checks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                status: { type: 'string' },
                message: { type: 'string' },
                responseTime: { type: 'number' },
              },
            },
          },
        },
        required: ['status', 'timestamp', 'version', 'uptime'],
      },
    };
  }

  private initializeSecuritySchemes(): void {
    this.securitySchemes = {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
      },
    };
  }

  addEndpoint(endpoint: APIEndpoint): void {
    this.endpoints.push(endpoint);
    logger.debug('API endpoint added', { path: endpoint.path, method: endpoint.method });
  }

  addSchema(name: string, schema: any): void {
    this.schemas[name] = schema;
    logger.debug('API schema added', { name });
  }

  generateDocumentation(): APIDocumentation {
    const paths: Record<string, any> = {};

    // Group endpoints by path
    const pathGroups = new Map<string, APIEndpoint[]>();
    for (const endpoint of this.endpoints) {
      if (!pathGroups.has(endpoint.path)) {
        pathGroups.set(endpoint.path, []);
      }
      pathGroups.get(endpoint.path)!.push(endpoint);
    }

    // Generate OpenAPI paths
    for (const [path, endpoints] of pathGroups) {
      paths[path] = {};
      for (const endpoint of endpoints) {
        const method = endpoint.method.toLowerCase();
        paths[path][method] = {
          summary: endpoint.summary,
          description: endpoint.description,
          tags: endpoint.tags,
          parameters: endpoint.parameters,
          requestBody: endpoint.requestBody,
          responses: endpoint.responses,
          security: endpoint.security,
        };
      }
    }

    return {
      openapi: '3.0.0',
      info: {
        title: 'Didit360 API',
        version: '1.0.0',
        description: 'Comprehensive music streaming, podcast, audiobooks and AI DJ platform API',
        contact: {
          name: 'Didit360 Support',
          email: 'support@didit360.com',
          url: 'https://didit360.com/support',
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      servers: [
        {
          url: 'https://api.didit360.com',
          description: 'Production server',
        },
        {
          url: 'https://staging-api.didit360.com',
          description: 'Staging server',
        },
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
      paths,
      components: {
        schemas: this.schemas,
        securitySchemes: this.securitySchemes,
      },
      security: [
        { BearerAuth: [] },
        { ApiKeyAuth: [] },
      ],
    };
  }

  generateMarkdown(): string {
    let markdown = '# Didit360 API Documentation\n\n';
    markdown += '## Overview\n\n';
    markdown += 'The Didit360 API provides comprehensive access to music streaming, podcast, audiobooks and AI DJ features.\n\n';
    markdown += '## Base URL\n\n';
    markdown += '```\nhttps://api.didit360.com\n```\n\n';
    markdown += '## Authentication\n\n';
    markdown += 'The API uses JWT tokens for authentication. Include the token in the Authorization header:\n\n';
    markdown += '```\nAuthorization: Bearer <your-token>\n```\n\n';
    markdown += '## Endpoints\n\n';

    // Group endpoints by tag
    const tagGroups = new Map<string, APIEndpoint[]>();
    for (const endpoint of this.endpoints) {
      for (const tag of endpoint.tags) {
        if (!tagGroups.has(tag)) {
          tagGroups.set(tag, []);
        }
        tagGroups.get(tag)!.push(endpoint);
      }
    }

    // Generate markdown for each tag
    for (const [tag, endpoints] of tagGroups) {
      markdown += `### ${tag}\n\n`;
      
      for (const endpoint of endpoints) {
        markdown += `#### ${endpoint.method.toUpperCase()} ${endpoint.path}\n\n`;
        markdown += `${endpoint.description}\n\n`;
        
        if (endpoint.parameters && endpoint.parameters.length > 0) {
          markdown += '**Parameters:**\n\n';
          markdown += '| Name | Type | Required | Description |\n';
          markdown += '|------|------|----------|-------------|\n';
          for (const param of endpoint.parameters) {
            markdown += `| ${param.name} | ${param.schema.type} | ${param.required ? 'Yes' : 'No'} | ${param.description || ''} |\n`;
          }
          markdown += '\n';
        }

        if (endpoint.requestBody) {
          markdown += '**Request Body:**\n\n';
          markdown += '```json\n';
          markdown += JSON.stringify(endpoint.requestBody.content, null, 2);
          markdown += '\n```\n\n';
        }

        markdown += '**Responses:**\n\n';
        for (const [statusCode, response] of Object.entries(endpoint.responses)) {
          markdown += `- **${statusCode}**: ${response.description}\n`;
        }
        markdown += '\n';
      }
    }

    return markdown;
  }
}

// API documentation service
export class APIDocumentationService {
  private generator: APIDocumentationGenerator;

  constructor() {
    this.generator = new APIDocumentationGenerator();
    this.initializeEndpoints();
  }

  private initializeEndpoints(): void {
    // Health endpoints
    this.generator.addEndpoint({
      path: '/health',
      method: 'GET',
      summary: 'Health Check',
      description: 'Check the health status of the API',
      tags: ['Health'],
      responses: {
        '200': {
          description: 'API is healthy',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/HealthStatus' },
            },
          },
        },
        '503': {
          description: 'API is unhealthy',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
      },
    });

    // Track endpoints
    this.generator.addEndpoint({
      path: '/tracks',
      method: 'GET',
      summary: 'Get Tracks',
      description: 'Retrieve a list of tracks',
      tags: ['Tracks'],
      parameters: [
        {
          name: 'limit',
          in: 'query',
          required: false,
          schema: { type: 'number', default: 20 },
          description: 'Number of tracks to return',
        },
        {
          name: 'offset',
          in: 'query',
          required: false,
          schema: { type: 'number', default: 0 },
          description: 'Number of tracks to skip',
        },
        {
          name: 'genre',
          in: 'query',
          required: false,
          schema: { type: 'string' },
          description: 'Filter by genre',
        },
      ],
      responses: {
        '200': {
          description: 'List of tracks',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  tracks: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Track' },
                  },
                  total: { type: 'number' },
                  limit: { type: 'number' },
                  offset: { type: 'number' },
                },
              },
            },
          },
        },
      },
    });

    // Artist endpoints
    this.generator.addEndpoint({
      path: '/artists',
      method: 'GET',
      summary: 'Get Artists',
      description: 'Retrieve a list of artists',
      tags: ['Artists'],
      parameters: [
        {
          name: 'limit',
          in: 'query',
          required: false,
          schema: { type: 'number', default: 20 },
          description: 'Number of artists to return',
        },
        {
          name: 'offset',
          in: 'query',
          required: false,
          schema: { type: 'number', default: 0 },
          description: 'Number of artists to skip',
        },
      ],
      responses: {
        '200': {
          description: 'List of artists',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  artists: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Artist' },
                  },
                  total: { type: 'number' },
                  limit: { type: 'number' },
                  offset: { type: 'number' },
                },
              },
            },
          },
        },
      },
    });

    // Search endpoints
    this.generator.addEndpoint({
      path: '/search',
      method: 'GET',
      summary: 'Search',
      description: 'Search for tracks, artists, albums, and more',
      tags: ['Search'],
      parameters: [
        {
          name: 'q',
          in: 'query',
          required: true,
          schema: { type: 'string' },
          description: 'Search query',
        },
        {
          name: 'type',
          in: 'query',
          required: false,
          schema: { type: 'string', enum: ['track', 'artist', 'album', 'all'], default: 'all' },
          description: 'Type of content to search for',
        },
        {
          name: 'limit',
          in: 'query',
          required: false,
          schema: { type: 'number', default: 20 },
          description: 'Number of results to return',
        },
      ],
      responses: {
        '200': {
          description: 'Search results',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  results: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/SearchResult' },
                  },
                  total: { type: 'number' },
                },
              },
            },
          },
        },
      },
    });

    // AI DJ endpoints
    this.generator.addEndpoint({
      path: '/dj-instinct/live/start',
      method: 'POST',
      summary: 'Start AI DJ Session',
      description: 'Start a new AI DJ live session',
      tags: ['AI DJ'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                vibe: { type: 'string' },
                genres: { type: 'array', items: { type: 'string' } },
                mood: { type: 'string', enum: ['chill', 'groove', 'hype', 'ecstatic'] },
                energy: { type: 'number', minimum: 0, maximum: 100 },
                durationMinutes: { type: 'number', minimum: 10, maximum: 600 },
              },
              required: ['vibe', 'genres', 'mood', 'energy', 'durationMinutes'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'AI DJ session started successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  sessionId: { type: 'string' },
                  message: { type: 'string' },
                  nowPlaying: { $ref: '#/components/schemas/Track' },
                  nextUp: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Track' },
                  },
                },
              },
            },
          },
        },
        '400': {
          description: 'Invalid request parameters',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
      },
    });
  }

  getOpenAPIDocumentation(): APIDocumentation {
    return this.generator.generateDocumentation();
  }

  getMarkdownDocumentation(): string {
    return this.generator.generateMarkdown();
  }

  getJSONDocumentation(): string {
    return JSON.stringify(this.generator.generateDocumentation(), null, 2);
  }
}

// API documentation service singleton
export const apiDocumentationService = new APIDocumentationService();

import { logger } from './logger';
import { realDatabaseService } from './database-real';

// Enhanced database service that uses the real database service
export class DatabaseService {
  private realDb = realDatabaseService;

  constructor() {
    logger.info('DatabaseService initialized');
  }

  async find<T>(collection: string, options: {
    limit?: number;
    offset?: number;
    orderBy?: string;
    orderDirection?: 'ASC' | 'DESC';
    where?: Record<string, any>;
  } = {}): Promise<T[]> {
    logger.info(`Finding documents in ${collection}`, options);
    
    try {
      return await this.realDb.find<T>(collection, options);
    } catch (error) {
      logger.error(`Error finding documents in ${collection}`, error);
      throw error;
    }
  }

  async findById<T>(collection: string, id: string): Promise<T | null> {
    logger.info(`Finding document by ID in ${collection}`, { id });
    
    try {
      return await this.realDb.findById<T>(collection, id);
    } catch (error) {
      logger.error(`Error finding document by ID in ${collection}`, error);
      throw error;
    }
  }

  async create<T>(collection: string, data: T): Promise<T> {
    logger.info(`Creating document in ${collection}`, { data });
    
    try {
      return await this.realDb.create<T>(collection, data);
    } catch (error) {
      logger.error(`Error creating document in ${collection}`, error);
      throw error;
    }
  }

  async update<T>(collection: string, id: string, data: Partial<T>): Promise<T | null> {
    logger.info(`Updating document in ${collection}`, { id, data });
    
    try {
      return await this.realDb.update<T>(collection, id, data);
    } catch (error) {
      logger.error(`Error updating document in ${collection}`, error);
      throw error;
    }
  }

  async delete(collection: string, id: string): Promise<boolean> {
    logger.info(`Deleting document in ${collection}`, { id });
    
    try {
      return await this.realDb.delete(collection, id);
    } catch (error) {
      logger.error(`Error deleting document in ${collection}`, error);
      throw error;
    }
  }

  async count(collection: string, where?: Record<string, any>): Promise<number> {
    logger.info(`Counting documents in ${collection}`, { where });
    
    try {
      return await this.realDb.count(collection, where);
    } catch (error) {
      logger.error(`Error counting documents in ${collection}`, error);
      throw error;
    }
  }

  async isConnected(): Promise<boolean> {
    return this.realDb.isConnected();
  }

  // Specialized methods for common operations
  async findTracks(options: {
    limit?: number;
    offset?: number;
    genre?: string;
    artistId?: string;
    albumId?: string;
  } = {}): Promise<any[]> {
    const where: Record<string, any> = {};
    if (options.genre) where.genre = options.genre;
    if (options.artistId) where.artistId = options.artistId;
    if (options.albumId) where.albumId = options.albumId;

    return this.find('tracks', {
      limit: options.limit,
      offset: options.offset,
      where,
      orderBy: 'popularity',
      orderDirection: 'DESC',
    });
  }

  async findArtists(options: {
    limit?: number;
    offset?: number;
    genre?: string;
  } = {}): Promise<any[]> {
    const where: Record<string, any> = {};
    if (options.genre) where.genre = options.genre;

    return this.find('artists', {
      limit: options.limit,
      offset: options.offset,
      where,
      orderBy: 'popularity',
      orderDirection: 'DESC',
    });
  }

  async findAlbums(options: {
    limit?: number;
    offset?: number;
    artistId?: string;
    genre?: string;
  } = {}): Promise<any[]> {
    const where: Record<string, any> = {};
    if (options.artistId) where.artistId = options.artistId;
    if (options.genre) where.genre = options.genre;

    return this.find('albums', {
      limit: options.limit,
      offset: options.offset,
      where,
      orderBy: 'popularity',
      orderDirection: 'DESC',
    });
  }

  async findUsers(options: {
    limit?: number;
    offset?: number;
  } = {}): Promise<any[]> {
    return this.find('users', {
      limit: options.limit,
      offset: options.offset,
      orderBy: 'createdAt',
      orderDirection: 'DESC',
    });
  }

  // Search functionality
  async search(collection: string, query: string, options: {
    limit?: number;
    offset?: number;
    fields?: string[];
  } = {}): Promise<any[]> {
    logger.info(`Searching in ${collection}`, { query, options });
    
    try {
      const allResults = await this.find(collection, {
        limit: 1000, // Get more results for search
        offset: 0,
      });

      // Simple text search across specified fields
      const searchFields = options.fields || ['title', 'name', 'artistName', 'albumName'];
      const searchResults = allResults.filter(item => {
        return searchFields.some(field => {
          const value = (item as any)[field];
          return value && value.toString().toLowerCase().includes(query.toLowerCase());
        });
      });

      // Apply pagination
      const offset = options.offset || 0;
      const limit = options.limit || 20;
      return searchResults.slice(offset, offset + limit);
    } catch (error) {
      logger.error(`Error searching in ${collection}`, error);
      throw error;
    }
  }

  // Analytics methods
  async getStats(): Promise<{
    tracks: number;
    artists: number;
    albums: number;
    users: number;
  }> {
    logger.info('Getting database statistics');
    
    try {
      const [tracks, artists, albums, users] = await Promise.all([
        this.count('tracks'),
        this.count('artists'),
        this.count('albums'),
        this.count('users'),
      ]);

      return { tracks, artists, albums, users };
    } catch (error) {
      logger.error('Error getting database statistics', error);
      throw error;
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();

import { logger } from './logger';
import { ErrorHandler, DatabaseError } from './error-handler';

// Database connection interface
export interface DatabaseConnection {
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;
  execute(sql: string, params?: any[]): Promise<{ affectedRows: number; insertId?: number }>;
  transaction<T>(callback: (tx: DatabaseTransaction) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}

export interface DatabaseTransaction {
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;
  execute(sql: string, params?: any[]): Promise<{ affectedRows: number; insertId?: number }>;
}

// Mock database implementation for development
export class MockDatabase implements DatabaseConnection {
  private data = new Map<string, any[]>();
  private transactionData = new Map<string, any[]>();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize with some mock data
    this.data.set('tracks', [
      {
        id: 1,
        title: 'Sunset Dreams',
        artist_id: 1,
        album_id: 1,
        duration_ms: 240000,
        genre: 'Electronic',
        explicit: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        title: 'Midnight City',
        artist_id: 2,
        album_id: 2,
        duration_ms: 300000,
        genre: 'Synthwave',
        explicit: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    this.data.set('artists', [
      {
        id: 1,
        name: 'Electronic Waves',
        bio: 'Electronic music producer',
        genre: 'Electronic',
        followers: 125000,
        verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Neon Lights',
        bio: 'Synthwave artist',
        genre: 'Synthwave',
        followers: 98000,
        verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    this.data.set('albums', [
      {
        id: 1,
        title: 'Neon Nights',
        artist_id: 1,
        release_date: '2024-01-15',
        genre: 'Electronic',
        track_count: 12,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        title: 'Urban Dreams',
        artist_id: 2,
        release_date: '2024-02-20',
        genre: 'Synthwave',
        track_count: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
  }

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    logger.debug('Database query', { sql, params });
    
    try {
      // Simple SQL parsing for mock data
      const tableName = this.extractTableName(sql);
      const data = this.data.get(tableName) || [];
      
      // Apply simple WHERE conditions
      let filteredData = data;
      if (params && params.length > 0) {
        filteredData = data.filter((row: any) => {
          return params.every((param, index) => {
            const columnName = this.extractColumnName(sql, index);
            return row[columnName] === param;
          });
        });
      }
      
      return filteredData as T[];
    } catch (error) {
      logger.error('Database query error', error instanceof Error ? error : new Error(String(error)), { sql, params });
      throw new DatabaseError('Query failed', sql);
    }
  }

  async execute(sql: string, params?: any[]): Promise<{ affectedRows: number; insertId?: number }> {
    logger.debug('Database execute', { sql, params });
    
    try {
      const tableName = this.extractTableName(sql);
      const data = this.data.get(tableName) || [];
      
      if (sql.toLowerCase().includes('insert')) {
        const newId = data.length + 1;
        const newRecord = { id: newId, ...params?.[0] };
        data.push(newRecord);
        this.data.set(tableName, data);
        return { affectedRows: 1, insertId: newId };
      }
      
      if (sql.toLowerCase().includes('update')) {
        // Simple update logic
        return { affectedRows: 1 };
      }
      
      if (sql.toLowerCase().includes('delete')) {
        // Simple delete logic
        return { affectedRows: 1 };
      }
      
      return { affectedRows: 0 };
    } catch (error) {
      logger.error('Database execute error', error instanceof Error ? error : new Error(String(error)), { sql, params });
      throw new DatabaseError('Execute failed', sql);
    }
  }

  async transaction<T>(callback: (tx: DatabaseTransaction) => Promise<T>): Promise<T> {
    logger.debug('Database transaction started');
    
    try {
      const tx = new MockTransaction(this.data);
      const result = await callback(tx);
      logger.debug('Database transaction committed');
      return result;
    } catch (error) {
      logger.error('Database transaction error', error instanceof Error ? error : new Error(String(error)));
      throw new DatabaseError('Transaction failed');
    }
  }

  async close(): Promise<void> {
    logger.info('Database connection closed');
  }

  private extractTableName(sql: string): string {
    const match = sql.match(/FROM\s+(\w+)/i) || sql.match(/INSERT\s+INTO\s+(\w+)/i) || sql.match(/UPDATE\s+(\w+)/i) || sql.match(/DELETE\s+FROM\s+(\w+)/i);
    return match ? match[1].toLowerCase() : 'unknown';
  }

  private extractColumnName(sql: string, paramIndex: number): string {
    // Simple column name extraction
    const columns = ['id', 'title', 'artist_id', 'album_id', 'name', 'genre'];
    return columns[paramIndex] || 'id';
  }
}

class MockTransaction implements DatabaseTransaction {
  constructor(private data: Map<string, any[]>) {}

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    // Same logic as MockDatabase.query but within transaction
    const tableName = this.extractTableName(sql);
    const data = this.data.get(tableName) || [];
    return data as T[];
  }

  async execute(sql: string, params?: any[]): Promise<{ affectedRows: number; insertId?: number }> {
    // Same logic as MockDatabase.execute but within transaction
    return { affectedRows: 1 };
  }

  private extractTableName(sql: string): string {
    const match = sql.match(/FROM\s+(\w+)/i) || sql.match(/INSERT\s+INTO\s+(\w+)/i) || sql.match(/UPDATE\s+(\w+)/i) || sql.match(/DELETE\s+FROM\s+(\w+)/i);
    return match ? match[1].toLowerCase() : 'unknown';
  }
}

// Real database implementation (placeholder for production)
export class RealDatabase implements DatabaseConnection {
  private connection: any;

  constructor(connectionString: string) {
    // Initialize real database connection
    logger.info('Real database connection initialized', { connectionString: connectionString.replace(/\/\/.*@/, '//***@') });
  }

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    logger.debug('Database query', { sql, params });
    
    try {
      // Implement real database query
      return [];
    } catch (error) {
      logger.error('Database query error', error instanceof Error ? error : new Error(String(error)), { sql, params });
      throw new DatabaseError('Query failed', sql);
    }
  }

  async execute(sql: string, params?: any[]): Promise<{ affectedRows: number; insertId?: number }> {
    logger.debug('Database execute', { sql, params });
    
    try {
      // Implement real database execute
      return { affectedRows: 0 };
    } catch (error) {
      logger.error('Database execute error', error instanceof Error ? error : new Error(String(error)), { sql, params });
      throw new DatabaseError('Execute failed', sql);
    }
  }

  async transaction<T>(callback: (tx: DatabaseTransaction) => Promise<T>): Promise<T> {
    logger.debug('Database transaction started');
    
    try {
      // Implement real database transaction
      const result = await callback(this as any);
      logger.debug('Database transaction committed');
      return result;
    } catch (error) {
      logger.error('Database transaction error', error instanceof Error ? error : new Error(String(error)));
      throw new DatabaseError('Transaction failed');
    }
  }

  async close(): Promise<void> {
    logger.info('Database connection closed');
  }
}

// Database service factory
export function createDatabaseService(): DatabaseConnection {
  const connectionString = process.env.DATABASE_URL;
  
  if (connectionString) {
    logger.info('Using real database connection');
    return new RealDatabase(connectionString);
  } else {
    logger.info('Using mock database (no DATABASE_URL configured)');
    return new MockDatabase();
  }
}

// Database service singleton
export const database = createDatabaseService();

// Database utility functions
export class DatabaseService {
  constructor(private db: DatabaseConnection) {}

  async findById<T>(table: string, id: number | string): Promise<T | null> {
    try {
      const results = await this.db.query<T>(`SELECT * FROM ${table} WHERE id = ?`, [id]);
      return results[0] || null;
    } catch (error) {
      logger.error('Database findById error', error instanceof Error ? error : new Error(String(error)), { table, id });
      throw new DatabaseError('Find by ID failed');
    }
  }

  async findAll<T>(table: string, limit?: number, offset?: number): Promise<T[]> {
    try {
      let sql = `SELECT * FROM ${table}`;
      const params: any[] = [];
      
      if (limit) {
        sql += ' LIMIT ?';
        params.push(limit);
      }
      
      if (offset) {
        sql += ' OFFSET ?';
        params.push(offset);
      }
      
      return await this.db.query<T>(sql, params);
    } catch (error) {
      logger.error('Database findAll error', error instanceof Error ? error : new Error(String(error)), { table, limit, offset });
      throw new DatabaseError('Find all failed');
    }
  }

  async create<T>(table: string, data: Partial<T>): Promise<number> {
    try {
      const columns = Object.keys(data);
      const values = Object.values(data);
      const placeholders = columns.map(() => '?').join(', ');
      
      const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
      const result = await this.db.execute(sql, values);
      
      return result.insertId || 0;
    } catch (error) {
      logger.error('Database create error', error instanceof Error ? error : new Error(String(error)), { table, data });
      throw new DatabaseError('Create failed');
    }
  }

  async update<T>(table: string, id: number | string, data: Partial<T>): Promise<boolean> {
    try {
      const columns = Object.keys(data);
      const values = Object.values(data);
      const setClause = columns.map(col => `${col} = ?`).join(', ');
      
      const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
      const result = await this.db.execute(sql, [...values, id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      logger.error('Database update error', error instanceof Error ? error : new Error(String(error)), { table, id, data });
      throw new DatabaseError('Update failed');
    }
  }

  async delete(table: string, id: number | string): Promise<boolean> {
    try {
      const sql = `DELETE FROM ${table} WHERE id = ?`;
      const result = await this.db.execute(sql, [id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      logger.error('Database delete error', error instanceof Error ? error : new Error(String(error)), { table, id });
      throw new DatabaseError('Delete failed');
    }
  }

  async count(table: string, where?: string, params?: any[]): Promise<number> {
    try {
      let sql = `SELECT COUNT(*) as count FROM ${table}`;
      if (where) {
        sql += ` WHERE ${where}`;
      }
      
      const results = await this.db.query<{ count: number }>(sql, params);
      return results[0]?.count || 0;
    } catch (error) {
      logger.error('Database count error', error instanceof Error ? error : new Error(String(error)), { table, where, params });
      throw new DatabaseError('Count failed');
    }
  }

  async search<T>(table: string, searchTerm: string, columns: string[], limit?: number, offset?: number): Promise<T[]> {
    try {
      const whereClause = columns.map(col => `${col} LIKE ?`).join(' OR ');
      const searchParams = columns.map(() => `%${searchTerm}%`);
      
      let sql = `SELECT * FROM ${table} WHERE ${whereClause}`;
      const params = [...searchParams];
      
      if (limit) {
        sql += ' LIMIT ?';
        params.push(limit);
      }
      
      if (offset) {
        sql += ' OFFSET ?';
        params.push(offset);
      }
      
      return await this.db.query<T>(sql, params);
    } catch (error) {
      logger.error('Database search error', error instanceof Error ? error : new Error(String(error)), { table, searchTerm, columns, limit, offset });
      throw new DatabaseError('Search failed');
    }
  }
}

// Database service instance
export const dbService = new DatabaseService(database);

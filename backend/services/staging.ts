import { z } from "zod";

// Staging schemas for raw ingested data
export const StagingRecordSchema = z.object({
  id: z.string(),
  source: z.string(),
  source_id: z.string(),
  entity_type: z.string(),
  raw_data: z.record(z.string(), z.any()),
  checksum: z.string(),
  received_at: z.string(),
  processed_at: z.string().optional(),
  status: z.enum(['pending', 'processing', 'normalized', 'failed']),
  error: z.string().optional(),
  version: z.string().optional(),
});

// Normalization mapping schemas
export const FieldMappingSchema = z.object({
  source_field: z.string(),
  target_field: z.string(),
  transform: z.enum(['direct', 'split', 'join', 'lookup', 'custom']).optional(),
  transform_config: z.record(z.string(), z.any()).optional(),
});

export const EntityMappingSchema = z.object({
  source: z.string(),
  entity_type: z.string(),
  field_mappings: z.array(FieldMappingSchema),
  deduplication_fields: z.array(z.string()),
  quality_rules: z.array(z.object({
    field: z.string(),
    rule: z.string(),
    weight: z.number(),
  })),
});

// Canonical ID generation schemas
export const CanonicalIdSchema = z.object({
  entity_type: z.string(),
  canonical_id: z.string(),
  source_ids: z.array(z.object({
    source: z.string(),
    source_id: z.string(),
  })),
  created_at: z.string(),
  updated_at: z.string(),
});

export type StagingRecord = z.infer<typeof StagingRecordSchema>;
export type FieldMapping = z.infer<typeof FieldMappingSchema>;
export type EntityMapping = z.infer<typeof EntityMappingSchema>;
export type CanonicalId = z.infer<typeof CanonicalIdSchema>;

// Staging and normalization service interface
export interface StagingService {
  // Staging operations
  stageRecord(source: string, sourceId: string, entityType: string, rawData: Record<string, any>, checksum: string): Promise<StagingRecord>;
  getStagingRecord(id: string): Promise<StagingRecord | null>;
  getStagingRecords(status?: StagingRecord['status'], limit?: number): Promise<StagingRecord[]>;
  
  // Normalization operations
  normalizeRecord(stagingId: string): Promise<void>;
  normalizeRecords(limit?: number): Promise<void>;
  
  // Mapping management
  registerEntityMapping(mapping: EntityMapping): Promise<void>;
  getEntityMapping(source: string, entityType: string): Promise<EntityMapping | null>;
  
  // Canonical ID management
  generateCanonicalId(entityType: string, data: Record<string, any>): Promise<string>;
  findCanonicalId(source: string, sourceId: string, entityType: string): Promise<string | null>;
  linkSourceId(canonicalId: string, source: string, sourceId: string): Promise<void>;
  
  // Deduplication
  findDuplicates(entityType: string, data: Record<string, any>): Promise<string[]>;
  mergeEntities(canonicalIds: string[]): Promise<string>;
}

// Mock implementation for development
export class MockStagingService implements StagingService {
  private stagingRecords = new Map<string, StagingRecord>();
  private entityMappings = new Map<string, EntityMapping>();
  private canonicalIds = new Map<string, CanonicalId>();
  private recordCounter = 1;

  constructor() {
    // Register default mappings
    this.registerDefaultMappings();
  }

  async stageRecord(
    source: string,
    sourceId: string,
    entityType: string,
    rawData: Record<string, any>,
    checksum: string
  ): Promise<StagingRecord> {
    const id = `staging_${this.recordCounter++}_${Date.now()}`;
    
    const record: StagingRecord = {
      id,
      source,
      source_id: sourceId,
      entity_type: entityType,
      raw_data: rawData,
      checksum,
      received_at: new Date().toISOString(),
      status: 'pending',
    };
    
    this.stagingRecords.set(id, record);
    console.log(`[staging] Staged record ${id} from ${source}:${sourceId} (${entityType})`);
    
    return record;
  }

  async getStagingRecord(id: string): Promise<StagingRecord | null> {
    return this.stagingRecords.get(id) || null;
  }

  async getStagingRecords(status?: StagingRecord['status'], limit = 100): Promise<StagingRecord[]> {
    const records = Array.from(this.stagingRecords.values());
    const filtered = status ? records.filter(r => r.status === status) : records;
    return filtered.slice(0, limit);
  }

  async normalizeRecord(stagingId: string): Promise<void> {
    const record = this.stagingRecords.get(stagingId);
    if (!record) {
      throw new Error(`Staging record ${stagingId} not found`);
    }
    
    if (record.status !== 'pending') {
      console.log(`[staging] Record ${stagingId} already processed (${record.status})`);
      return;
    }
    
    console.log(`[staging] Normalizing record ${stagingId}`);
    record.status = 'processing';
    
    try {
      // Get entity mapping
      const mapping = await this.getEntityMapping(record.source, record.entity_type);
      if (!mapping) {
        throw new Error(`No mapping found for ${record.source}:${record.entity_type}`);
      }
      
      // Apply field mappings
      const normalizedData = await this.applyFieldMappings(record.raw_data, mapping.field_mappings);
      
      // Generate or find canonical ID
      const canonicalId = await this.generateCanonicalId(record.entity_type, normalizedData);
      
      // Check for duplicates
      const duplicates = await this.findDuplicates(record.entity_type, normalizedData);
      if (duplicates.length > 0) {
        console.log(`[staging] Found ${duplicates.length} potential duplicates for ${canonicalId}`);
        // TODO: Implement merge logic
      }
      
      // Link source ID to canonical ID
      await this.linkSourceId(canonicalId, record.source, record.source_id);
      
      // Calculate quality score
      const qualityScore = this.calculateQualityScore(normalizedData, mapping.quality_rules);
      
      console.log(`[staging] Normalized ${record.entity_type} ${canonicalId} (quality: ${qualityScore})`);
      
      record.status = 'normalized';
      record.processed_at = new Date().toISOString();
      
      // TODO: Upsert to catalog database
      // TODO: Trigger enrichment pipeline
      // TODO: Publish update event
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`[staging] Failed to normalize record ${stagingId}:`, errorMsg);
      record.status = 'failed';
      record.error = errorMsg;
    }
  }

  async normalizeRecords(limit = 10): Promise<void> {
    const pendingRecords = await this.getStagingRecords('pending', limit);
    console.log(`[staging] Normalizing ${pendingRecords.length} pending records`);
    
    for (const record of pendingRecords) {
      await this.normalizeRecord(record.id);
    }
  }

  async registerEntityMapping(mapping: EntityMapping): Promise<void> {
    const key = `${mapping.source}:${mapping.entity_type}`;
    this.entityMappings.set(key, mapping);
    console.log(`[staging] Registered mapping for ${key}`);
  }

  async getEntityMapping(source: string, entityType: string): Promise<EntityMapping | null> {
    const key = `${source}:${entityType}`;
    return this.entityMappings.get(key) || null;
  }

  async generateCanonicalId(entityType: string, data: Record<string, any>): Promise<string> {
    // Generate deterministic canonical ID based on key fields
    const keyFields = this.getKeyFields(entityType);
    const keyValues = keyFields.map(field => data[field] || '').join('|');
    const hash = this.simpleHash(keyValues);
    const canonicalId = `${entityType}:${hash}`;
    
    console.log(`[staging] Generated canonical ID: ${canonicalId}`);
    return canonicalId;
  }

  async findCanonicalId(source: string, sourceId: string, entityType: string): Promise<string | null> {
    for (const [, canonicalIdRecord] of this.canonicalIds) {
      if (canonicalIdRecord.entity_type === entityType) {
        const sourceIdMatch = canonicalIdRecord.source_ids.find(
          sid => sid.source === source && sid.source_id === sourceId
        );
        if (sourceIdMatch) {
          return canonicalIdRecord.canonical_id;
        }
      }
    }
    return null;
  }

  async linkSourceId(canonicalId: string, source: string, sourceId: string): Promise<void> {
    let canonicalIdRecord = Array.from(this.canonicalIds.values())
      .find(record => record.canonical_id === canonicalId);
    
    if (!canonicalIdRecord) {
      // Create new canonical ID record
      canonicalIdRecord = {
        entity_type: canonicalId.split(':')[0],
        canonical_id: canonicalId,
        source_ids: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.canonicalIds.set(canonicalId, canonicalIdRecord);
    }
    
    // Add source ID if not already present
    const existingSourceId = canonicalIdRecord.source_ids.find(
      sid => sid.source === source && sid.source_id === sourceId
    );
    
    if (!existingSourceId) {
      canonicalIdRecord.source_ids.push({ source, source_id: sourceId });
      canonicalIdRecord.updated_at = new Date().toISOString();
      console.log(`[staging] Linked ${source}:${sourceId} to ${canonicalId}`);
    }
  }

  async findDuplicates(entityType: string, data: Record<string, any>): Promise<string[]> {
    // Simple duplicate detection based on key fields
    const keyFields = this.getKeyFields(entityType);
    const duplicates: string[] = [];
    
    for (const [canonicalId, record] of this.canonicalIds) {
      if (record.entity_type === entityType) {
        // TODO: Implement proper similarity matching
        // For now, just return empty array
      }
    }
    
    return duplicates;
  }

  async mergeEntities(canonicalIds: string[]): Promise<string> {
    if (canonicalIds.length < 2) {
      throw new Error('Need at least 2 entities to merge');
    }
    
    const primaryId = canonicalIds[0];
    console.log(`[staging] Merging entities into ${primaryId}`);
    
    // TODO: Implement entity merging logic
    // 1. Combine source IDs
    // 2. Merge data with quality-based precedence
    // 3. Update references
    // 4. Mark other entities as tombstoned
    
    return primaryId;
  }

  // Private helper methods
  private async applyFieldMappings(
    rawData: Record<string, any>,
    mappings: FieldMapping[]
  ): Promise<Record<string, any>> {
    const normalizedData: Record<string, any> = {};
    
    for (const mapping of mappings) {
      const sourceValue = rawData[mapping.source_field];
      if (sourceValue !== undefined) {
        normalizedData[mapping.target_field] = await this.transformValue(
          sourceValue,
          mapping.transform,
          mapping.transform_config
        );
      }
    }
    
    return normalizedData;
  }

  private async transformValue(
    value: any,
    transform?: FieldMapping['transform'],
    config?: Record<string, any>
  ): Promise<any> {
    switch (transform) {
      case 'split':
        return typeof value === 'string' ? value.split(config?.delimiter || ',') : value;
      case 'join':
        return Array.isArray(value) ? value.join(config?.delimiter || ',') : value;
      case 'lookup':
        // TODO: Implement lookup transformation
        return value;
      case 'custom':
        // TODO: Implement custom transformation
        return value;
      default:
        return value;
    }
  }

  private calculateQualityScore(
    data: Record<string, any>,
    rules: EntityMapping['quality_rules']
  ): number {
    let totalWeight = 0;
    let weightedScore = 0;
    
    for (const rule of rules) {
      const fieldValue = data[rule.field];
      let score = 0;
      
      switch (rule.rule) {
        case 'required':
          score = fieldValue !== undefined && fieldValue !== null && fieldValue !== '' ? 1 : 0;
          break;
        case 'length':
          score = typeof fieldValue === 'string' && fieldValue.length > 0 ? 1 : 0;
          break;
        case 'format':
          // TODO: Implement format validation
          score = 0.5;
          break;
        default:
          score = 0.5;
      }
      
      weightedScore += score * rule.weight;
      totalWeight += rule.weight;
    }
    
    return totalWeight > 0 ? weightedScore / totalWeight : 0.5;
  }

  private getKeyFields(entityType: string): string[] {
    const keyFieldsMap: Record<string, string[]> = {
      track: ['title', 'isrc'],
      artist: ['name', 'mbid'],
      release: ['title', 'upc'],
      video: ['title'],
      podcast: ['title', 'rss_url'],
      episode: ['title', 'podcast_id'],
      book: ['title', 'isbn'],
      audiobook: ['title', 'book_id'],
    };
    
    return keyFieldsMap[entityType] || ['title'];
  }

  private simpleHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private registerDefaultMappings(): void {
    // DDEX Release mapping
    this.entityMappings.set('ddex:release', {
      source: 'ddex',
      entity_type: 'release',
      field_mappings: [
        { source_field: 'title', target_field: 'title' },
        { source_field: 'upc', target_field: 'upc' },
        { source_field: 'label', target_field: 'label' },
        { source_field: 'release_type', target_field: 'release_type' },
        { source_field: 'date_released', target_field: 'date_released' },
        { source_field: 'territories', target_field: 'territories' },
      ],
      deduplication_fields: ['upc', 'title'],
      quality_rules: [
        { field: 'title', rule: 'required', weight: 1.0 },
        { field: 'upc', rule: 'required', weight: 0.8 },
        { field: 'label', rule: 'required', weight: 0.6 },
      ],
    });
    
    // MusicBrainz Artist mapping
    this.entityMappings.set('musicbrainz:artist', {
      source: 'musicbrainz',
      entity_type: 'artist',
      field_mappings: [
        { source_field: 'name', target_field: 'name' },
        { source_field: 'sort_name', target_field: 'sort_name' },
        { source_field: 'mbid', target_field: 'mbid' },
        { source_field: 'ipi', target_field: 'ipi' },
        { source_field: 'bio', target_field: 'bio' },
        { source_field: 'genres', target_field: 'genres' },
      ],
      deduplication_fields: ['mbid', 'name'],
      quality_rules: [
        { field: 'name', rule: 'required', weight: 1.0 },
        { field: 'mbid', rule: 'required', weight: 0.9 },
        { field: 'sort_name', rule: 'required', weight: 0.5 },
      ],
    });
    
    // RSS Podcast mapping
    this.entityMappings.set('rss:podcast', {
      source: 'rss',
      entity_type: 'podcast',
      field_mappings: [
        { source_field: 'title', target_field: 'title' },
        { source_field: 'description', target_field: 'description' },
        { source_field: 'language', target_field: 'language' },
        { source_field: 'publisher', target_field: 'publisher' },
        { source_field: 'categories', target_field: 'categories' },
      ],
      deduplication_fields: ['title', 'rss_url'],
      quality_rules: [
        { field: 'title', rule: 'required', weight: 1.0 },
        { field: 'description', rule: 'length', weight: 0.7 },
        { field: 'publisher', rule: 'required', weight: 0.6 },
      ],
    });
  }
}

// Singleton instance
export const stagingService = new MockStagingService();
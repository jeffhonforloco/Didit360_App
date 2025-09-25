import { z } from "zod";

// Ingest job schemas
export const IngestJobSchema = z.object({
  id: z.string(),
  source: z.string(),
  source_id: z.string(),
  entity_type: z.string(),
  op: z.enum(['create', 'update', 'delete']),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  payload: z.record(z.string(), z.any()),
  checksum: z.string().optional(),
  version: z.string().optional(),
  received_at: z.string(),
  processed_at: z.string().optional(),
  error: z.string().optional(),
  retry_count: z.number().default(0),
  max_retries: z.number().default(3),
});

export const IngestSourceSchema = z.object({
  name: z.string(),
  type: z.enum(['ddex', 'rss', 'musicbrainz', 'openlibrary', 'manual']),
  priority: z.number().default(50),
  config: z.record(z.string(), z.any()),
  is_active: z.boolean().default(true),
  last_sync: z.string().optional(),
});

// DDEX specific schemas
export const DDEXReleaseSchema = z.object({
  upc: z.string().optional(),
  title: z.string(),
  label: z.string().optional(),
  release_type: z.string().default('album'),
  date_released: z.string().optional(),
  territories: z.array(z.string()).default([]),
  cover_art: z.object({
    uri: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
  }).optional(),
  tracks: z.array(z.object({
    isrc: z.string().optional(),
    title: z.string(),
    duration_ms: z.number().optional(),
    explicit: z.boolean().default(false),
    track_no: z.number(),
    disc_no: z.number().default(1),
    artists: z.array(z.object({
      name: z.string(),
      role: z.string().default('primary'),
    })),
  })),
  artists: z.array(z.object({
    name: z.string(),
    ipi: z.string().optional(),
    role: z.string().default('primary'),
  })),
  rights: z.object({
    p_line: z.string().optional(),
    c_line: z.string().optional(),
    territorial_rights: z.record(z.string(), z.boolean()).default({}),
    streaming_allowed: z.boolean().default(true),
    download_allowed: z.boolean().default(false),
  }).optional(),
});

// RSS/Podcast specific schemas
export const RSSFeedSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  language: z.string().default('en'),
  publisher: z.string().optional(),
  categories: z.array(z.string()).default([]),
  image: z.object({
    uri: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
  }).optional(),
  episodes: z.array(z.object({
    guid: z.string(),
    title: z.string(),
    description: z.string().optional(),
    episode_no: z.number().optional(),
    season_no: z.number().optional(),
    duration_ms: z.number().optional(),
    pub_date: z.string(),
    audio_uri: z.string(),
    explicit: z.boolean().default(false),
  })),
});

// MusicBrainz specific schemas
export const MusicBrainzArtistSchema = z.object({
  mbid: z.string(),
  name: z.string(),
  sort_name: z.string().optional(),
  ipi: z.string().optional(),
  bio: z.string().optional(),
  genres: z.array(z.string()).default([]),
  aliases: z.array(z.string()).default([]),
});

export type IngestJob = z.infer<typeof IngestJobSchema>;
export type IngestSource = z.infer<typeof IngestSourceSchema>;
export type DDEXRelease = z.infer<typeof DDEXReleaseSchema>;
export type RSSFeed = z.infer<typeof RSSFeedSchema>;
export type MusicBrainzArtist = z.infer<typeof MusicBrainzArtistSchema>;

// Ingest service interface
export interface IngestService {
  // Job management
  createJob(source: string, sourceId: string, entityType: string, op: 'create' | 'update' | 'delete', payload: Record<string, any>, checksum?: string): Promise<IngestJob>;
  getJob(jobId: string): Promise<IngestJob | null>;
  updateJobStatus(jobId: string, status: IngestJob['status'], error?: string): Promise<void>;
  
  // Source management
  registerSource(source: IngestSource): Promise<void>;
  getSource(name: string): Promise<IngestSource | null>;
  
  // Processing
  processJob(jobId: string): Promise<void>;
  processJobs(limit?: number): Promise<void>;
  
  // DDEX processing
  processDDEXRelease(deliveryId: string, release: DDEXRelease): Promise<string>;
  
  // RSS processing
  processRSSFeed(feedUrl: string, feed: RSSFeed): Promise<string>;
  
  // MusicBrainz processing
  processMusicBrainzArtist(mbid: string, artist: MusicBrainzArtist): Promise<string>;
}

// Mock implementation for development
export class MockIngestService implements IngestService {
  private jobs = new Map<string, IngestJob>();
  private sources = new Map<string, IngestSource>();
  private jobCounter = 1;

  constructor() {
    // Register default sources
    this.sources.set('ddex', {
      name: 'ddex',
      type: 'ddex',
      priority: 90,
      config: { endpoint: 'https://ddex.example.com' },
      is_active: true,
    });
    
    this.sources.set('musicbrainz', {
      name: 'musicbrainz',
      type: 'musicbrainz',
      priority: 70,
      config: { dump_url: 'https://musicbrainz.org/dumps' },
      is_active: true,
    });
    
    this.sources.set('podcast-index', {
      name: 'podcast-index',
      type: 'rss',
      priority: 60,
      config: { api_key: 'xxx' },
      is_active: true,
    });
  }

  async createJob(
    source: string,
    sourceId: string,
    entityType: string,
    op: 'create' | 'update' | 'delete',
    payload: Record<string, any>,
    checksum?: string
  ): Promise<IngestJob> {
    const jobId = `job_${this.jobCounter++}_${Date.now()}`;
    
    const job: IngestJob = {
      id: jobId,
      source,
      source_id: sourceId,
      entity_type: entityType,
      op,
      status: 'pending',
      payload,
      checksum,
      received_at: new Date().toISOString(),
      retry_count: 0,
      max_retries: 3,
    };
    
    this.jobs.set(jobId, job);
    console.log(`[ingest] Created job ${jobId} for ${source}:${sourceId} (${entityType})`);
    
    return job;
  }

  async getJob(jobId: string): Promise<IngestJob | null> {
    return this.jobs.get(jobId) || null;
  }

  async updateJobStatus(jobId: string, status: IngestJob['status'], error?: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }
    
    job.status = status;
    if (error) {
      job.error = error;
    }
    if (status === 'completed' || status === 'failed') {
      job.processed_at = new Date().toISOString();
    }
    
    console.log(`[ingest] Updated job ${jobId} status to ${status}`);
  }

  async registerSource(source: IngestSource): Promise<void> {
    this.sources.set(source.name, source);
    console.log(`[ingest] Registered source ${source.name} (${source.type})`);
  }

  async getSource(name: string): Promise<IngestSource | null> {
    return this.sources.get(name) || null;
  }

  async processJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }
    
    if (job.status !== 'pending') {
      console.log(`[ingest] Job ${jobId} already processed (${job.status})`);
      return;
    }
    
    console.log(`[ingest] Processing job ${jobId}`);
    await this.updateJobStatus(jobId, 'processing');
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Mock processing logic based on entity type
      switch (job.entity_type) {
        case 'release':
          await this.processReleaseJob(job);
          break;
        case 'track':
          await this.processTrackJob(job);
          break;
        case 'artist':
          await this.processArtistJob(job);
          break;
        case 'podcast':
          await this.processPodcastJob(job);
          break;
        case 'episode':
          await this.processEpisodeJob(job);
          break;
        default:
          throw new Error(`Unknown entity type: ${job.entity_type}`);
      }
      
      await this.updateJobStatus(jobId, 'completed');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`[ingest] Job ${jobId} failed:`, errorMsg);
      
      job.retry_count++;
      if (job.retry_count >= job.max_retries) {
        await this.updateJobStatus(jobId, 'failed', errorMsg);
      } else {
        await this.updateJobStatus(jobId, 'pending', errorMsg);
      }
    }
  }

  async processJobs(limit = 10): Promise<void> {
    const pendingJobs = Array.from(this.jobs.values())
      .filter(job => job.status === 'pending')
      .slice(0, limit);
    
    console.log(`[ingest] Processing ${pendingJobs.length} pending jobs`);
    
    for (const job of pendingJobs) {
      await this.processJob(job.id);
    }
  }

  async processDDEXRelease(deliveryId: string, release: DDEXRelease): Promise<string> {
    console.log(`[ingest] Processing DDEX release: ${deliveryId}`);
    
    const job = await this.createJob(
      'ddex',
      deliveryId,
      'release',
      'create',
      release
    );
    
    // Process immediately for demo
    await this.processJob(job.id);
    
    return job.id;
  }

  async processRSSFeed(feedUrl: string, feed: RSSFeed): Promise<string> {
    console.log(`[ingest] Processing RSS feed: ${feedUrl}`);
    
    const job = await this.createJob(
      'rss',
      feedUrl,
      'podcast',
      'create',
      feed
    );
    
    // Process immediately for demo
    await this.processJob(job.id);
    
    return job.id;
  }

  async processMusicBrainzArtist(mbid: string, artist: MusicBrainzArtist): Promise<string> {
    console.log(`[ingest] Processing MusicBrainz artist: ${mbid}`);
    
    const job = await this.createJob(
      'musicbrainz',
      mbid,
      'artist',
      'create',
      artist
    );
    
    // Process immediately for demo
    await this.processJob(job.id);
    
    return job.id;
  }

  // Private processing methods
  private async processReleaseJob(job: IngestJob): Promise<void> {
    console.log(`[ingest] Processing release job ${job.id}`);
    // TODO: Implement actual release processing
    // This would involve:
    // 1. Validate payload against schema
    // 2. Check for duplicates using canonical_id
    // 3. Upsert to database
    // 4. Trigger enrichment pipeline
    // 5. Publish update event
  }

  private async processTrackJob(job: IngestJob): Promise<void> {
    console.log(`[ingest] Processing track job ${job.id}`);
    // TODO: Implement actual track processing
  }

  private async processArtistJob(job: IngestJob): Promise<void> {
    console.log(`[ingest] Processing artist job ${job.id}`);
    // TODO: Implement actual artist processing
  }

  private async processPodcastJob(job: IngestJob): Promise<void> {
    console.log(`[ingest] Processing podcast job ${job.id}`);
    // TODO: Implement actual podcast processing
  }

  private async processEpisodeJob(job: IngestJob): Promise<void> {
    console.log(`[ingest] Processing episode job ${job.id}`);
    // TODO: Implement actual episode processing
  }
}

// Singleton instance
export const ingestService = new MockIngestService();
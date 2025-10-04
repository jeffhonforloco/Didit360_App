import { z } from "zod";
import { AudioFeatures } from "./catalog";

// Enrichment job schemas
export const EnrichmentJobSchema = z.object({
  id: z.string(),
  entity_type: z.string(),
  entity_id: z.number(),
  enrichment_type: z.enum(['audio_features', 'embeddings', 'genre_classification', 'mood_analysis', 'similarity']),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  priority: z.number().default(50),
  input_data: z.record(z.string(), z.any()),
  output_data: z.record(z.string(), z.any()).optional(),
  created_at: z.string(),
  started_at: z.string().optional(),
  completed_at: z.string().optional(),
  error: z.string().optional(),
  retry_count: z.number().default(0),
  max_retries: z.number().default(3),
});

// Audio analysis schemas
export const AudioAnalysisSchema = z.object({
  tempo: z.number(),
  key: z.string(),
  mode: z.string(),
  energy: z.number().min(0).max(1),
  danceability: z.number().min(0).max(1),
  valence: z.number().min(0).max(1),
  loudness: z.number(),
  speechiness: z.number().min(0).max(1),
  instrumentalness: z.number().min(0).max(1),
  acousticness: z.number().min(0).max(1),
  liveness: z.number().min(0).max(1),
  time_signature: z.number(),
  duration_ms: z.number(),
  segments: z.array(z.object({
    start: z.number(),
    duration: z.number(),
    confidence: z.number(),
    loudness_start: z.number(),
    loudness_max: z.number(),
    pitches: z.array(z.number()),
    timbre: z.array(z.number()),
  })).optional(),
});

// Embedding schemas
export const EmbeddingSchema = z.object({
  entity_type: z.string(),
  entity_id: z.number(),
  embedding_type: z.string(),
  vector: z.array(z.number()),
  model_version: z.string(),
  dimensions: z.number(),
  created_at: z.string(),
});

// Genre classification schema
export const GenreClassificationSchema = z.object({
  genres: z.array(z.object({
    name: z.string(),
    confidence: z.number().min(0).max(1),
  })),
  primary_genre: z.string(),
  subgenres: z.array(z.string()),
  confidence_score: z.number().min(0).max(1),
});

// Mood analysis schema
export const MoodAnalysisSchema = z.object({
  primary_mood: z.string(),
  moods: z.array(z.object({
    name: z.string(),
    confidence: z.number().min(0).max(1),
  })),
  energy_level: z.enum(['low', 'medium', 'high']),
  emotional_valence: z.enum(['negative', 'neutral', 'positive']),
  arousal_level: z.enum(['calm', 'moderate', 'energetic']),
});

// Similarity analysis schema
export const SimilarityAnalysisSchema = z.object({
  similar_tracks: z.array(z.object({
    track_id: z.number(),
    similarity_score: z.number().min(0).max(1),
    similarity_type: z.enum(['audio', 'metadata', 'collaborative', 'hybrid']),
  })),
  clusters: z.array(z.object({
    cluster_id: z.string(),
    center_distance: z.number(),
    cluster_size: z.number(),
  })),
});

export type EnrichmentJob = z.infer<typeof EnrichmentJobSchema>;
export type AudioAnalysis = z.infer<typeof AudioAnalysisSchema>;
export type Embedding = z.infer<typeof EmbeddingSchema>;
export type GenreClassification = z.infer<typeof GenreClassificationSchema>;
export type MoodAnalysis = z.infer<typeof MoodAnalysisSchema>;
export type SimilarityAnalysis = z.infer<typeof SimilarityAnalysisSchema>;

// Enrichment service interface
export interface EnrichmentService {
  // Job management
  createEnrichmentJob(entityType: string, entityId: number, enrichmentType: EnrichmentJob['enrichment_type'], inputData: Record<string, any>): Promise<EnrichmentJob>;
  getEnrichmentJob(jobId: string): Promise<EnrichmentJob | null>;
  processEnrichmentJob(jobId: string): Promise<void>;
  processEnrichmentJobs(limit?: number): Promise<void>;
  
  // Audio analysis
  analyzeAudio(audioUri: string): Promise<AudioAnalysis>;
  extractAudioFeatures(entityType: string, entityId: number, audioUri: string): Promise<AudioFeatures>;
  
  // Embeddings
  generateEmbedding(entityType: string, entityId: number, content: string, embeddingType: string): Promise<Embedding>;
  findSimilarByEmbedding(vector: number[], limit?: number): Promise<Array<{ entity_type: string; entity_id: number; similarity: number }>>;
  
  // Genre classification
  classifyGenre(audioUri: string, metadata?: Record<string, any>): Promise<GenreClassification>;
  
  // Mood analysis
  analyzeMood(audioUri: string, lyrics?: string): Promise<MoodAnalysis>;
  
  // Similarity analysis
  findSimilarTracks(trackId: number, limit?: number): Promise<SimilarityAnalysis>;
  updateSimilarityIndex(entityType: string, entityId: number): Promise<void>;
}

// Mock implementation for development
export class MockEnrichmentService implements EnrichmentService {
  private jobs = new Map<string, EnrichmentJob>();
  private jobCounter = 1;

  async createEnrichmentJob(
    entityType: string,
    entityId: number,
    enrichmentType: EnrichmentJob['enrichment_type'],
    inputData: Record<string, any>
  ): Promise<EnrichmentJob> {
    const jobId = `enrich_${this.jobCounter++}_${Date.now()}`;
    
    const job: EnrichmentJob = {
      id: jobId,
      entity_type: entityType,
      entity_id: entityId,
      enrichment_type: enrichmentType,
      status: 'pending',
      priority: 50,
      input_data: inputData,
      created_at: new Date().toISOString(),
      retry_count: 0,
      max_retries: 3,
    };
    
    this.jobs.set(jobId, job);
    console.log(`[enrichment] Created job ${jobId} for ${entityType}:${entityId} (${enrichmentType})`);
    
    return job;
  }

  async getEnrichmentJob(jobId: string): Promise<EnrichmentJob | null> {
    return this.jobs.get(jobId) || null;
  }

  async processEnrichmentJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error(`Enrichment job ${jobId} not found`);
    }
    
    if (job.status !== 'pending') {
      console.log(`[enrichment] Job ${jobId} already processed (${job.status})`);
      return;
    }
    
    console.log(`[enrichment] Processing enrichment job ${jobId} (${job.enrichment_type})`);
    job.status = 'processing';
    job.started_at = new Date().toISOString();
    
    try {
      // Simulate processing time based on enrichment type
      const processingTime = this.getProcessingTime(job.enrichment_type);
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      // Generate mock output based on enrichment type
      job.output_data = await this.generateMockOutput(job);
      
      job.status = 'completed';
      job.completed_at = new Date().toISOString();
      
      console.log(`[enrichment] Completed job ${jobId}`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`[enrichment] Job ${jobId} failed:`, errorMsg);
      
      job.retry_count++;
      if (job.retry_count >= job.max_retries) {
        job.status = 'failed';
        job.error = errorMsg;
      } else {
        job.status = 'pending';
      }
    }
  }

  async processEnrichmentJobs(limit = 10): Promise<void> {
    const pendingJobs = Array.from(this.jobs.values())
      .filter(job => job.status === 'pending')
      .sort((a, b) => b.priority - a.priority)
      .slice(0, limit);
    
    console.log(`[enrichment] Processing ${pendingJobs.length} pending enrichment jobs`);
    
    for (const job of pendingJobs) {
      await this.processEnrichmentJob(job.id);
    }
  }

  async analyzeAudio(audioUri: string): Promise<AudioAnalysis> {
    console.log(`[enrichment] Analyzing audio: ${audioUri}`);
    
    // Simulate audio analysis
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      tempo: 128.0 + Math.random() * 40,
      key: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][Math.floor(Math.random() * 12)],
      mode: Math.random() > 0.5 ? 'major' : 'minor',
      energy: Math.random(),
      danceability: Math.random(),
      valence: Math.random(),
      loudness: -20 + Math.random() * 15,
      speechiness: Math.random() * 0.3,
      instrumentalness: Math.random(),
      acousticness: Math.random(),
      liveness: Math.random() * 0.5,
      time_signature: Math.random() > 0.8 ? 3 : 4,
      duration_ms: 180000 + Math.random() * 120000,
    };
  }

  async extractAudioFeatures(entityType: string, entityId: number, audioUri: string): Promise<AudioFeatures> {
    console.log(`[enrichment] Extracting audio features for ${entityType}:${entityId}`);
    
    const analysis = await this.analyzeAudio(audioUri);
    
    return {
      entity_type: entityType,
      entity_id: entityId,
      tempo: analysis.tempo,
      key: analysis.key,
      mode: analysis.mode,
      energy: analysis.energy,
      danceability: analysis.danceability,
      valence: analysis.valence,
      loudness: analysis.loudness,
      speechiness: analysis.speechiness,
      instrumentalness: analysis.instrumentalness,
      acousticness: analysis.acousticness,
      liveness: analysis.liveness,
      time_signature: analysis.time_signature,
      updated_at: new Date().toISOString(),
    };
  }

  async generateEmbedding(entityType: string, entityId: number, content: string, embeddingType: string): Promise<Embedding> {
    console.log(`[enrichment] Generating embedding for ${entityType}:${entityId} (${embeddingType})`);
    
    // Simulate embedding generation
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Generate mock 768-dimensional embedding
    const vector = Array.from({ length: 768 }, () => Math.random() * 2 - 1);
    
    return {
      entity_type: entityType,
      entity_id: entityId,
      embedding_type: embeddingType,
      vector,
      model_version: 'mock-v1',
      dimensions: 768,
      created_at: new Date().toISOString(),
    };
  }

  async findSimilarByEmbedding(vector: number[], limit = 10): Promise<Array<{ entity_type: string; entity_id: number; similarity: number }>> {
    console.log(`[enrichment] Finding similar items by embedding (limit: ${limit})`);
    
    // Simulate similarity search
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
      entity_type: 'track',
      entity_id: i + 1,
      similarity: 0.9 - (i * 0.1) + Math.random() * 0.05,
    }));
  }

  async classifyGenre(audioUri: string, metadata?: Record<string, any>): Promise<GenreClassification> {
    console.log(`[enrichment] Classifying genre for: ${audioUri}`);
    
    // Simulate genre classification
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const genres = ['electronic', 'rock', 'pop', 'jazz', 'classical', 'hip-hop', 'country', 'folk'];
    const primaryGenre = genres[Math.floor(Math.random() * genres.length)];
    
    return {
      genres: [
        { name: primaryGenre, confidence: 0.8 + Math.random() * 0.2 },
        { name: genres[Math.floor(Math.random() * genres.length)], confidence: 0.3 + Math.random() * 0.4 },
      ],
      primary_genre: primaryGenre,
      subgenres: [primaryGenre + '-subgenre'],
      confidence_score: 0.7 + Math.random() * 0.3,
    };
  }

  async analyzeMood(audioUri: string, lyrics?: string): Promise<MoodAnalysis> {
    console.log(`[enrichment] Analyzing mood for: ${audioUri}`);
    
    // Simulate mood analysis
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const moods = ['happy', 'sad', 'energetic', 'calm', 'aggressive', 'romantic', 'melancholic', 'uplifting'];
    const primaryMood = moods[Math.floor(Math.random() * moods.length)];
    
    return {
      primary_mood: primaryMood,
      moods: [
        { name: primaryMood, confidence: 0.8 + Math.random() * 0.2 },
        { name: moods[Math.floor(Math.random() * moods.length)], confidence: 0.3 + Math.random() * 0.4 },
      ],
      energy_level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      emotional_valence: ['negative', 'neutral', 'positive'][Math.floor(Math.random() * 3)] as 'negative' | 'neutral' | 'positive',
      arousal_level: ['calm', 'moderate', 'energetic'][Math.floor(Math.random() * 3)] as 'calm' | 'moderate' | 'energetic',
    };
  }

  async findSimilarTracks(trackId: number, limit = 10): Promise<SimilarityAnalysis> {
    console.log(`[enrichment] Finding similar tracks for track ${trackId}`);
    
    // Simulate similarity analysis
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      similar_tracks: Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
        track_id: trackId + i + 1,
        similarity_score: 0.9 - (i * 0.1) + Math.random() * 0.05,
        similarity_type: ['audio', 'metadata', 'collaborative', 'hybrid'][Math.floor(Math.random() * 4)] as 'audio' | 'metadata' | 'collaborative' | 'hybrid',
      })),
      clusters: [
        {
          cluster_id: `cluster_${Math.floor(Math.random() * 100)}`,
          center_distance: Math.random() * 0.5,
          cluster_size: 10 + Math.floor(Math.random() * 50),
        },
      ],
    };
  }

  async updateSimilarityIndex(entityType: string, entityId: number): Promise<void> {
    console.log(`[enrichment] Updating similarity index for ${entityType}:${entityId}`);
    
    // Simulate index update
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Private helper methods
  private getProcessingTime(enrichmentType: EnrichmentJob['enrichment_type']): number {
    const times = {
      audio_features: 500,
      embeddings: 200,
      genre_classification: 300,
      mood_analysis: 400,
      similarity: 200,
    };
    return times[enrichmentType] || 300;
  }

  private async generateMockOutput(job: EnrichmentJob): Promise<Record<string, any>> {
    switch (job.enrichment_type) {
      case 'audio_features':
        return await this.analyzeAudio(job.input_data.audio_uri || '');
      case 'embeddings':
        const embedding = await this.generateEmbedding(job.entity_type, job.entity_id, job.input_data.content || '', job.input_data.embedding_type || 'content');
        return { embedding: embedding.vector };
      case 'genre_classification':
        return await this.classifyGenre(job.input_data.audio_uri || '');
      case 'mood_analysis':
        return await this.analyzeMood(job.input_data.audio_uri || '', job.input_data.lyrics);
      case 'similarity':
        return await this.findSimilarTracks(job.entity_id);
      default:
        return {};
    }
  }
}

// Real API implementation
export class APIEnrichmentService implements EnrichmentService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.EXPO_PUBLIC_ENRICHMENT_API_URL || process.env.ENRICHMENT_API_URL || '';
    this.apiKey = process.env.EXPO_PUBLIC_ENRICHMENT_API_KEY || process.env.ENRICHMENT_API_KEY || '';
    
    if (!this.baseUrl) {
      console.warn('[enrichment] API URL not configured, using mock service');
    }
    if (!this.apiKey) {
      console.warn('[enrichment] API key not configured, using mock service');
    }
  }

  private async fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    console.log(`[enrichment] Fetching: ${url}`);
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      throw new Error(`Enrichment API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async createEnrichmentJob(
    entityType: string,
    entityId: number,
    enrichmentType: EnrichmentJob['enrichment_type'],
    inputData: Record<string, any>
  ): Promise<EnrichmentJob> {
    return await this.fetchAPI<EnrichmentJob>('/jobs', {
      method: 'POST',
      body: JSON.stringify({ entity_type: entityType, entity_id: entityId, enrichment_type: enrichmentType, input_data: inputData }),
    });
  }

  async getEnrichmentJob(jobId: string): Promise<EnrichmentJob | null> {
    try {
      return await this.fetchAPI<EnrichmentJob>(`/jobs/${jobId}`);
    } catch (error) {
      console.error(`[enrichment] Error fetching job ${jobId}:`, error);
      return null;
    }
  }

  async processEnrichmentJob(jobId: string): Promise<void> {
    await this.fetchAPI(`/jobs/${jobId}/process`, { method: 'POST' });
  }

  async processEnrichmentJobs(limit = 10): Promise<void> {
    await this.fetchAPI(`/jobs/process?limit=${limit}`, { method: 'POST' });
  }

  async analyzeAudio(audioUri: string): Promise<AudioAnalysis> {
    return await this.fetchAPI<AudioAnalysis>('/audio/analyze', {
      method: 'POST',
      body: JSON.stringify({ audio_uri: audioUri }),
    });
  }

  async extractAudioFeatures(entityType: string, entityId: number, audioUri: string): Promise<AudioFeatures> {
    return await this.fetchAPI<AudioFeatures>('/audio/features', {
      method: 'POST',
      body: JSON.stringify({ entity_type: entityType, entity_id: entityId, audio_uri: audioUri }),
    });
  }

  async generateEmbedding(entityType: string, entityId: number, content: string, embeddingType: string): Promise<Embedding> {
    return await this.fetchAPI<Embedding>('/embeddings', {
      method: 'POST',
      body: JSON.stringify({ entity_type: entityType, entity_id: entityId, content, embedding_type: embeddingType }),
    });
  }

  async findSimilarByEmbedding(vector: number[], limit = 10): Promise<Array<{ entity_type: string; entity_id: number; similarity: number }>> {
    return await this.fetchAPI(`/embeddings/similar?limit=${limit}`, {
      method: 'POST',
      body: JSON.stringify({ vector }),
    });
  }

  async classifyGenre(audioUri: string, metadata?: Record<string, any>): Promise<GenreClassification> {
    return await this.fetchAPI<GenreClassification>('/genre/classify', {
      method: 'POST',
      body: JSON.stringify({ audio_uri: audioUri, metadata }),
    });
  }

  async analyzeMood(audioUri: string, lyrics?: string): Promise<MoodAnalysis> {
    return await this.fetchAPI<MoodAnalysis>('/mood/analyze', {
      method: 'POST',
      body: JSON.stringify({ audio_uri: audioUri, lyrics }),
    });
  }

  async findSimilarTracks(trackId: number, limit = 10): Promise<SimilarityAnalysis> {
    return await this.fetchAPI<SimilarityAnalysis>(`/similarity/tracks/${trackId}?limit=${limit}`);
  }

  async updateSimilarityIndex(entityType: string, entityId: number): Promise<void> {
    await this.fetchAPI(`/similarity/index`, {
      method: 'POST',
      body: JSON.stringify({ entity_type: entityType, entity_id: entityId }),
    });
  }
}

// Factory function to create the appropriate service
function createEnrichmentService(): EnrichmentService {
  const apiUrl = process.env.EXPO_PUBLIC_ENRICHMENT_API_URL || process.env.ENRICHMENT_API_URL;
  const apiKey = process.env.EXPO_PUBLIC_ENRICHMENT_API_KEY || process.env.ENRICHMENT_API_KEY;
  
  if (apiUrl && apiKey) {
    console.log('[enrichment] Using real API service');
    return new APIEnrichmentService();
  } else {
    console.log('[enrichment] Using mock service (no API credentials configured)');
    return new MockEnrichmentService();
  }
}

// Singleton instance
export const enrichmentService = createEnrichmentService();
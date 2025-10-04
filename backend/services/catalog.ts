import { z } from "zod";

// Core entity schemas
export const ArtistSchema = z.object({
  id: z.number(),
  canonical_id: z.string(),
  name: z.string(),
  sort_name: z.string().optional(),
  mbid: z.string().optional(),
  ipi: z.string().optional(),
  bio: z.string().optional(),
  genres: z.array(z.string()),
  images: z.array(z.object({
    uri: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
    purpose: z.string().optional(),
  })),
  external_ids: z.record(z.string(), z.string()),
  metadata: z.record(z.string(), z.any()),
  created_at: z.string(),
  updated_at: z.string(),
  version: z.number(),
  etag: z.string().optional(),
  is_active: z.boolean(),
  quality_score: z.number(),
  source_priority: z.number().optional(),
  last_enriched_at: z.string().optional(),
});

export const ReleaseSchema = z.object({
  id: z.number(),
  canonical_id: z.string(),
  upc: z.string().optional(),
  title: z.string(),
  label: z.string().optional(),
  release_type: z.string(),
  date_released: z.string().optional(),
  territories: z.array(z.string()),
  cover_uri: z.string().optional(),
  genres: z.array(z.string()),
  external_ids: z.record(z.string(), z.string()),
  metadata: z.record(z.string(), z.any()),
  created_at: z.string(),
  updated_at: z.string(),
  version: z.number(),
  etag: z.string().optional(),
  is_active: z.boolean(),
  quality_score: z.number(),
  source_priority: z.number().optional(),
  last_enriched_at: z.string().optional(),
});

export const TrackSchema = z.object({
  id: z.number(),
  canonical_id: z.string(),
  isrc: z.string().optional(),
  title: z.string(),
  release_id: z.number().optional(),
  duration_ms: z.number().optional(),
  explicit: z.boolean(),
  track_no: z.number().optional(),
  disc_no: z.number(),
  preview_uri: z.string().optional(),
  stream_uri: z.string().optional(),
  media_type: z.string(),
  genres: z.array(z.string()),
  external_ids: z.record(z.string(), z.string()),
  metadata: z.record(z.string(), z.any()),
  created_at: z.string(),
  updated_at: z.string(),
  version: z.number(),
  etag: z.string().optional(),
  is_active: z.boolean(),
  quality_score: z.number(),
});

export const VideoSchema = z.object({
  id: z.number(),
  canonical_id: z.string(),
  title: z.string(),
  release_id: z.number().optional(),
  duration_ms: z.number().optional(),
  aspect_ratio: z.string(),
  preview_uri: z.string().optional(),
  stream_uri: z.string().optional(),
  media_type: z.string(),
  genres: z.array(z.string()),
  external_ids: z.record(z.string(), z.string()),
  metadata: z.record(z.string(), z.any()),
  created_at: z.string(),
  updated_at: z.string(),
  version: z.number(),
  etag: z.string().optional(),
  is_active: z.boolean(),
  quality_score: z.number(),
});

export const PodcastSchema = z.object({
  id: z.number(),
  canonical_id: z.string(),
  title: z.string(),
  publisher: z.string().optional(),
  rss_url: z.string().optional(),
  description: z.string().optional(),
  language: z.string(),
  categories: z.array(z.string()),
  images: z.array(z.object({
    uri: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
  })),
  external_ids: z.record(z.string(), z.string()),
  metadata: z.record(z.string(), z.any()),
  created_at: z.string(),
  updated_at: z.string(),
  version: z.number(),
  etag: z.string().optional(),
  is_active: z.boolean(),
  quality_score: z.number(),
});

export const EpisodeSchema = z.object({
  id: z.number(),
  canonical_id: z.string(),
  podcast_id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  episode_no: z.number().optional(),
  season_no: z.number().optional(),
  duration_ms: z.number().optional(),
  pub_date: z.string().optional(),
  audio_uri: z.string().optional(),
  stream_uri: z.string().optional(),
  explicit: z.boolean(),
  external_ids: z.record(z.string(), z.string()),
  metadata: z.record(z.string(), z.any()),
  created_at: z.string(),
  updated_at: z.string(),
  version: z.number(),
  etag: z.string().optional(),
  is_active: z.boolean(),
  quality_score: z.number(),
});

export const BookSchema = z.object({
  id: z.number(),
  canonical_id: z.string(),
  isbn: z.string().optional(),
  title: z.string(),
  author: z.string().optional(),
  publisher: z.string().optional(),
  date_published: z.string().optional(),
  cover_uri: z.string().optional(),
  description: z.string().optional(),
  language: z.string(),
  genres: z.array(z.string()),
  external_ids: z.record(z.string(), z.string()),
  metadata: z.record(z.string(), z.any()),
  created_at: z.string(),
  updated_at: z.string(),
  version: z.number(),
  etag: z.string().optional(),
  is_active: z.boolean(),
  quality_score: z.number(),
});

export const AudiobookSchema = z.object({
  id: z.number(),
  canonical_id: z.string(),
  book_id: z.number(),
  narrator: z.string().optional(),
  duration_ms: z.number().optional(),
  audio_uri: z.string().optional(),
  stream_uri: z.string().optional(),
  chapters: z.array(z.object({
    title: z.string(),
    start_ms: z.number(),
    duration_ms: z.number(),
  })),
  external_ids: z.record(z.string(), z.string()),
  metadata: z.record(z.string(), z.any()),
  created_at: z.string(),
  updated_at: z.string(),
  version: z.number(),
  etag: z.string().optional(),
  is_active: z.boolean(),
  quality_score: z.number(),
});

// Update event schema
export const UpdateEventSchema = z.object({
  id: z.number(),
  entity_type: z.enum(['track', 'video', 'artist', 'release', 'podcast', 'episode', 'book', 'audiobook', 'image']),
  entity_id: z.number(),
  op: z.enum(['upsert', 'delete']),
  version: z.number(),
  updated_at: z.string(),
});

// Rights schema
export const RightsSchema = z.object({
  id: z.number(),
  entity_type: z.string(),
  entity_id: z.number(),
  p_line: z.string().optional(),
  c_line: z.string().optional(),
  territorial_rights: z.record(z.string(), z.boolean()),
  window: z.object({
    start: z.string().optional(),
    end: z.string().optional(),
  }),
  streaming_allowed: z.boolean(),
  download_allowed: z.boolean(),
  sync_allowed: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Audio features schema
export const AudioFeaturesSchema = z.object({
  entity_type: z.string(),
  entity_id: z.number(),
  tempo: z.number().optional(),
  key: z.string().optional(),
  mode: z.string().optional(),
  energy: z.number().optional(),
  danceability: z.number().optional(),
  valence: z.number().optional(),
  loudness: z.number().optional(),
  speechiness: z.number().optional(),
  instrumentalness: z.number().optional(),
  acousticness: z.number().optional(),
  liveness: z.number().optional(),
  time_signature: z.number().optional(),
  updated_at: z.string(),
});

// Type exports
export type Artist = z.infer<typeof ArtistSchema>;
export type Release = z.infer<typeof ReleaseSchema>;
export type Track = z.infer<typeof TrackSchema>;
export type Video = z.infer<typeof VideoSchema>;
export type Podcast = z.infer<typeof PodcastSchema>;
export type Episode = z.infer<typeof EpisodeSchema>;
export type Book = z.infer<typeof BookSchema>;
export type Audiobook = z.infer<typeof AudiobookSchema>;
export type UpdateEvent = z.infer<typeof UpdateEventSchema>;
export type Rights = z.infer<typeof RightsSchema>;
export type AudioFeatures = z.infer<typeof AudioFeaturesSchema>;

// Catalog service interface
export interface CatalogService {
  // Entity retrieval
  getTrack(id: string): Promise<Track | null>;
  getVideo(id: string): Promise<Video | null>;
  getArtist(id: string): Promise<Artist | null>;
  getRelease(id: string): Promise<Release | null>;
  getPodcast(id: string): Promise<Podcast | null>;
  getEpisode(id: string): Promise<Episode | null>;
  getBook(id: string): Promise<Book | null>;
  getAudiobook(id: string): Promise<Audiobook | null>;
  
  // Search
  search(query: string, type?: string, limit?: number, offset?: number): Promise<{
    results: Array<{
      id: string;
      type: string;
      title: string;
      subtitle?: string;
      artwork?: string;
      version: number;
    }>;
    total: number;
  }>;
  
  // Updates feed
  getUpdates(since: string, until: string, limit: number): Promise<{
    events: UpdateEvent[];
    next_since: string;
  }>;
  
  // Rights checking
  checkRights(entityType: string, entityId: string, country: string, explicitOk: boolean): Promise<{
    allowed: boolean;
    reason?: string;
  }>;
  
  // Audio features
  getAudioFeatures(entityType: string, entityId: string): Promise<AudioFeatures | null>;
}

// Mock implementation for development
export class MockCatalogService implements CatalogService {
  private mockTracks = new Map<string, Track>();
  
  constructor() {
    this.initializeMockData();
  }
  
  private initializeMockData() {
    const mockUITracks = [
      {
        id: "1",
        title: "Midnight Dreams",
        artist: "Luna Echo",
        album: "Celestial Vibes",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        duration: 225,
        type: "song",
      },
      {
        id: "2",
        title: "Electric Pulse",
        artist: "Neon Waves",
        album: "Digital Horizon",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        duration: 198,
        type: "song",
      },
      {
        id: "3",
        title: "Golden Hour",
        artist: "Sunset Boulevard",
        album: "California Dreams",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        duration: 242,
        type: "song",
      },
      {
        id: "4",
        title: "Lost in Tokyo",
        artist: "Urban Nights",
        album: "City Lights",
        artwork: "https://via.placeholder.com/400x400/f7dc6f/ffffff?text=🎵",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        duration: 186,
        type: "song",
      },
      {
        id: "5",
        title: "Ocean Waves",
        artist: "Coastal Breeze",
        album: "Seaside Sessions",
        artwork: "https://via.placeholder.com/400x400/bb8fce/ffffff?text=🎵",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        duration: 210,
        type: "song",
      },
    ];
    
    mockUITracks.forEach((uiTrack, index) => {
      const track: Track = {
        id: index + 1,
        canonical_id: `track:${uiTrack.id}`,
        title: uiTrack.title,
        duration_ms: uiTrack.duration * 1000,
        explicit: false,
        track_no: 1,
        disc_no: 1,
        preview_uri: uiTrack.audioUrl,
        stream_uri: uiTrack.audioUrl,
        media_type: 'audio' as const,
        genres: ['pop', 'electronic'],
        external_ids: {},
        metadata: {
          artist: uiTrack.artist,
          album: uiTrack.album,
          artwork: uiTrack.artwork,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: 1,
        etag: `"${uiTrack.id}"`,
        is_active: true,
        quality_score: 0.85,
      };
      
      this.mockTracks.set(`track:${uiTrack.id}`, track);
      this.mockTracks.set(uiTrack.id, track);
    });
  }

  private mockVideos = new Map<string, Video>([
    ['video-1', {
      id: 1,
      canonical_id: 'video:sunset-mv',
      title: 'Sunset (Music Video)',
      duration_ms: 240000,
      aspect_ratio: '16:9',
      preview_uri: 'https://example.com/preview/sunset-mv.mp4',
      media_type: 'video' as const,
      genres: ['synthwave', 'electronic'],
      external_ids: {},
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      version: 1,
      etag: '"video123"',
      is_active: true,
      quality_score: 0.8,
    }],
  ]);

  async getTrack(id: string): Promise<Track | null> {
    console.log(`[catalog] Getting track: ${id}`);
    return this.mockTracks.get(id) || null;
  }

  async getVideo(id: string): Promise<Video | null> {
    console.log(`[catalog] Getting video: ${id}`);
    return this.mockVideos.get(id) || null;
  }

  async getArtist(id: string): Promise<Artist | null> {
    console.log(`[catalog] Getting artist: ${id}`);
    return null; // TODO: Implement
  }

  async getRelease(id: string): Promise<Release | null> {
    console.log(`[catalog] Getting release: ${id}`);
    return null; // TODO: Implement
  }

  async getPodcast(id: string): Promise<Podcast | null> {
    console.log(`[catalog] Getting podcast: ${id}`);
    return null; // TODO: Implement
  }

  async getEpisode(id: string): Promise<Episode | null> {
    console.log(`[catalog] Getting episode: ${id}`);
    return null; // TODO: Implement
  }

  async getBook(id: string): Promise<Book | null> {
    console.log(`[catalog] Getting book: ${id}`);
    return null; // TODO: Implement
  }

  async getAudiobook(id: string): Promise<Audiobook | null> {
    console.log(`[catalog] Getting audiobook: ${id}`);
    return null; // TODO: Implement
  }

  async search(query: string, type = 'all', limit = 20, offset = 0): Promise<{
    results: Array<{
      id: string;
      type: string;
      title: string;
      subtitle?: string;
      artwork?: string;
      version: number;
    }>;
    total: number;
  }> {
    console.log(`[catalog] Searching: ${query} (type: ${type})`);
    
    const results = query ? [
      {
        id: 'track-1',
        type: type === 'all' ? 'track' : type,
        title: `Result for "${query}"`,
        artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
        version: 1,
      },
    ] : [];
    
    return { results, total: results.length };
  }

  async getUpdates(since: string, until: string, limit: number): Promise<{
    events: UpdateEvent[];
    next_since: string;
  }> {
    console.log(`[catalog] Getting updates: ${since} to ${until} (limit: ${limit})`);
    
    const events: UpdateEvent[] = [
      {
        id: 1,
        entity_type: 'track',
        entity_id: 1,
        op: 'upsert',
        version: 1,
        updated_at: new Date().toISOString(),
      },
    ];
    
    return { events, next_since: until };
  }

  async checkRights(entityType: string, entityId: string, country: string, explicitOk: boolean): Promise<{
    allowed: boolean;
    reason?: string;
  }> {
    console.log(`[catalog] Checking rights: ${entityType}:${entityId} in ${country}`);
    
    const reasons: string[] = [];
    if (!explicitOk && (entityType === 'track' || entityType === 'episode')) {
      reasons.push('explicit_not_allowed');
    }
    if (country === 'KP') {
      reasons.push('country_blocked');
    }
    
    return { allowed: reasons.length === 0, reason: reasons[0] };
  }

  async getAudioFeatures(entityType: string, entityId: string): Promise<AudioFeatures | null> {
    console.log(`[catalog] Getting audio features: ${entityType}:${entityId}`);
    
    if (entityType === 'track' && entityId === '1') {
      return {
        entity_type: 'track',
        entity_id: 1,
        tempo: 128.0,
        key: 'C',
        mode: 'major',
        energy: 0.8,
        danceability: 0.7,
        valence: 0.6,
        loudness: -5.2,
        speechiness: 0.05,
        instrumentalness: 0.9,
        acousticness: 0.1,
        liveness: 0.2,
        time_signature: 4,
        updated_at: new Date().toISOString(),
      };
    }
    
    return null;
  }
}

// Real API implementation
export class APICatalogService implements CatalogService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.EXPO_PUBLIC_CATALOG_API_URL || process.env.CATALOG_API_URL || '';
    this.apiKey = process.env.EXPO_PUBLIC_CATALOG_API_KEY || process.env.CATALOG_API_KEY || '';
    
    if (!this.baseUrl) {
      console.warn('[catalog] API URL not configured, using mock service');
    }
    if (!this.apiKey) {
      console.warn('[catalog] API key not configured, using mock service');
    }
  }

  private async fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    console.log(`[catalog] Fetching: ${url}`);
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      throw new Error(`Catalog API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getTrack(id: string): Promise<Track | null> {
    try {
      return await this.fetchAPI<Track>(`/tracks/${id}`);
    } catch (error) {
      console.error(`[catalog] Error fetching track ${id}:`, error);
      return null;
    }
  }

  async getVideo(id: string): Promise<Video | null> {
    try {
      return await this.fetchAPI<Video>(`/videos/${id}`);
    } catch (error) {
      console.error(`[catalog] Error fetching video ${id}:`, error);
      return null;
    }
  }

  async getArtist(id: string): Promise<Artist | null> {
    try {
      return await this.fetchAPI<Artist>(`/artists/${id}`);
    } catch (error) {
      console.error(`[catalog] Error fetching artist ${id}:`, error);
      return null;
    }
  }

  async getRelease(id: string): Promise<Release | null> {
    try {
      return await this.fetchAPI<Release>(`/releases/${id}`);
    } catch (error) {
      console.error(`[catalog] Error fetching release ${id}:`, error);
      return null;
    }
  }

  async getPodcast(id: string): Promise<Podcast | null> {
    try {
      return await this.fetchAPI<Podcast>(`/podcasts/${id}`);
    } catch (error) {
      console.error(`[catalog] Error fetching podcast ${id}:`, error);
      return null;
    }
  }

  async getEpisode(id: string): Promise<Episode | null> {
    try {
      return await this.fetchAPI<Episode>(`/episodes/${id}`);
    } catch (error) {
      console.error(`[catalog] Error fetching episode ${id}:`, error);
      return null;
    }
  }

  async getBook(id: string): Promise<Book | null> {
    try {
      return await this.fetchAPI<Book>(`/books/${id}`);
    } catch (error) {
      console.error(`[catalog] Error fetching book ${id}:`, error);
      return null;
    }
  }

  async getAudiobook(id: string): Promise<Audiobook | null> {
    try {
      return await this.fetchAPI<Audiobook>(`/audiobooks/${id}`);
    } catch (error) {
      console.error(`[catalog] Error fetching audiobook ${id}:`, error);
      return null;
    }
  }

  async search(query: string, type = 'all', limit = 20, offset = 0): Promise<{
    results: Array<{
      id: string;
      type: string;
      title: string;
      subtitle?: string;
      artwork?: string;
      version: number;
    }>;
    total: number;
  }> {
    try {
      const params = new URLSearchParams({
        q: query,
        type,
        limit: limit.toString(),
        offset: offset.toString(),
      });
      return await this.fetchAPI(`/search?${params}`);
    } catch (error) {
      console.error('[catalog] Error searching:', error);
      return { results: [], total: 0 };
    }
  }

  async getUpdates(since: string, until: string, limit: number): Promise<{
    events: UpdateEvent[];
    next_since: string;
  }> {
    try {
      const params = new URLSearchParams({
        since,
        until,
        limit: limit.toString(),
      });
      return await this.fetchAPI(`/updates?${params}`);
    } catch (error) {
      console.error('[catalog] Error fetching updates:', error);
      return { events: [], next_since: until };
    }
  }

  async checkRights(entityType: string, entityId: string, country: string, explicitOk: boolean): Promise<{
    allowed: boolean;
    reason?: string;
  }> {
    try {
      const params = new URLSearchParams({
        entity_type: entityType,
        entity_id: entityId,
        country,
        explicit_ok: explicitOk.toString(),
      });
      return await this.fetchAPI(`/rights/check?${params}`);
    } catch (error) {
      console.error('[catalog] Error checking rights:', error);
      return { allowed: false, reason: 'api_error' };
    }
  }

  async getAudioFeatures(entityType: string, entityId: string): Promise<AudioFeatures | null> {
    try {
      return await this.fetchAPI<AudioFeatures>(`/audio-features/${entityType}/${entityId}`);
    } catch (error) {
      console.error('[catalog] Error fetching audio features:', error);
      return null;
    }
  }
}

// Factory function to create the appropriate service
function createCatalogService(): CatalogService {
  const apiUrl = process.env.EXPO_PUBLIC_CATALOG_API_URL || process.env.CATALOG_API_URL;
  const apiKey = process.env.EXPO_PUBLIC_CATALOG_API_KEY || process.env.CATALOG_API_KEY;
  
  if (apiUrl && apiKey) {
    console.log('[catalog] Using real API service');
    return new APICatalogService();
  } else {
    console.log('[catalog] Using mock service (no API credentials configured)');
    return new MockCatalogService();
  }
}

// Singleton instance
export const catalogService = createCatalogService();
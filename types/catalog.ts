// Core catalog entity types
export interface BaseEntity {
  id: string;
  canonical_id: string;
  created_at: string;
  updated_at: string;
  version: number;
  etag?: string;
  is_active: boolean;
  quality_score: number;
  external_ids: Record<string, string>;
  metadata: Record<string, any>;
}

export interface Artist extends BaseEntity {
  name: string;
  sort_name?: string;
  mbid?: string;
  ipi?: string;
  bio?: string;
  genres: string[];
  images: Image[];
}

export interface Release extends BaseEntity {
  upc?: string;
  title: string;
  label?: string;
  release_type: 'album' | 'single' | 'ep' | 'compilation' | 'soundtrack' | 'live' | 'remix';
  date_released?: string;
  territories: string[];
  cover_uri?: string;
  genres: string[];
  artists?: Artist[];
  tracks?: CatalogTrack[];
}

export interface CatalogTrack extends BaseEntity {
  isrc?: string;
  title: string;
  release_id?: string;
  duration_ms?: number;
  explicit: boolean;
  track_no?: number;
  disc_no: number;
  preview_uri?: string;
  stream_uri?: string;
  media_type: 'audio';
  genres: string[];
  artists?: Artist[];
  release?: Release;
  audio_features?: AudioFeatures;
}

export interface Video extends BaseEntity {
  title: string;
  release_id?: string;
  duration_ms?: number;
  aspect_ratio: string;
  preview_uri?: string;
  stream_uri?: string;
  media_type: 'video';
  genres: string[];
  artists?: Artist[];
  release?: Release;
}

export interface Podcast extends BaseEntity {
  title: string;
  publisher?: string;
  rss_url?: string;
  description?: string;
  language: string;
  categories: string[];
  images: Image[];
  episodes?: Episode[];
}

export interface Episode extends BaseEntity {
  podcast_id: string;
  title: string;
  description?: string;
  episode_no?: number;
  season_no?: number;
  duration_ms?: number;
  pub_date?: string;
  audio_uri?: string;
  stream_uri?: string;
  explicit: boolean;
  podcast?: Podcast;
}

export interface Book extends BaseEntity {
  isbn?: string;
  title: string;
  author?: string;
  publisher?: string;
  date_published?: string;
  cover_uri?: string;
  description?: string;
  language: string;
  genres: string[];
  audiobook?: Audiobook;
}

export interface Audiobook extends BaseEntity {
  book_id: string;
  narrator?: string;
  duration_ms?: number;
  audio_uri?: string;
  stream_uri?: string;
  chapters: Chapter[];
  book?: Book;
}

export interface Chapter {
  id: string;
  title: string;
  start_time_ms: number;
  end_time_ms: number;
  duration_ms: number;
}

export interface Contributor {
  id: string;
  canonical_id: string;
  name: string;
  ipi?: string;
  ipn?: string;
  mbid?: string;
  bio?: string;
  external_ids: Record<string, string>;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  version: number;
  is_active: boolean;
}

export interface Credit {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  contributor_id: string;
  role: string;
  percentage?: number;
  created_at: string;
  contributor?: Contributor;
}

export interface Work {
  id: string;
  canonical_id: string;
  iswc?: string;
  title: string;
  writers: Contributor[];
  publishers: string[];
  external_ids: Record<string, string>;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  version: number;
  is_active: boolean;
}

export interface Rights {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  p_line?: string;
  c_line?: string;
  territorial_rights: Record<string, any>;
  window: Record<string, any>;
  streaming_allowed: boolean;
  download_allowed: boolean;
  sync_allowed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Image {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  purpose: 'cover' | 'banner' | 'thumbnail' | 'profile' | 'background';
  uri: string;
  width?: number;
  height?: number;
  format?: string;
  size_bytes?: number;
  hash?: string;
  created_at: string;
}

export interface AudioFeatures {
  entity_type: EntityType;
  entity_id: string;
  tempo?: number;
  key?: string;
  mode?: string;
  energy?: number;
  danceability?: number;
  valence?: number;
  loudness?: number;
  speechiness?: number;
  instrumentalness?: number;
  acousticness?: number;
  liveness?: number;
  time_signature?: number;
  updated_at: string;
}

export interface Embedding {
  entity_type: EntityType;
  entity_id: string;
  embedding_type: 'content' | 'audio' | 'visual' | 'semantic';
  vector: number[];
  model_version: string;
  updated_at: string;
}

// Ingest and versioning types
export interface SourceMapping {
  source: string;
  source_id: string;
  entity_type: EntityType;
  entity_id: string;
}

export interface IngestLog {
  id: string;
  source: string;
  source_id: string;
  entity_type: EntityType;
  op: 'create' | 'update' | 'delete';
  version: string;
  checksum: string;
  received_at: string;
  processed_at?: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  error?: string;
}

export interface UpdateEvent {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  op: 'upsert' | 'delete';
  version: number;
  updated_at: string;
}

export interface Tombstone {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  source: string;
  at: string;
  reason: string;
}

// Utility types
export type EntityType = 
  | 'artist'
  | 'release'
  | 'track'
  | 'video'
  | 'podcast'
  | 'episode'
  | 'book'
  | 'audiobook'
  | 'contributor'
  | 'work'
  | 'image';

export type MediaEntity = CatalogTrack | Video | Episode | Audiobook;
export type CatalogEntity = Artist | Release | CatalogTrack | Video | Podcast | Episode | Book | Audiobook;

// Search and API types
export interface SearchResult {
  id: string;
  type: EntityType;
  title: string;
  subtitle?: string;
  artwork?: string;
  version: number;
  relevance_score?: number;
}

export interface SearchRequest {
  q: string;
  type?: EntityType | 'all';
  limit?: number;
  offset?: number;
  filters?: SearchFilters;
}

export interface SearchFilters {
  genres?: string[];
  explicit?: boolean;
  language?: string;
  date_range?: {
    start?: string;
    end?: string;
  };
  duration_range?: {
    min_ms?: number;
    max_ms?: number;
  };
  quality_threshold?: number;
}

export interface CatalogResponse<T> {
  id: string;
  version: number;
  etag?: string;
  updated_at: string;
  data: T;
}

export interface UpdatesResponse {
  since: string;
  until: string;
  events: UpdateEvent[];
  next_since: string;
}

export interface RightsCheckRequest {
  entity_type: EntityType;
  id: string;
  country?: string;
  explicit_ok?: boolean;
  user_id?: string;
}

export interface RightsCheckResponse {
  allowed: boolean;
  reason?: string;
  expires_at?: string;
}

// Ingest API types
export interface IngestRequest {
  source: string;
  data: any;
  checksum?: string;
  force?: boolean;
}

export interface IngestResponse {
  job_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  entities_processed?: number;
  errors?: string[];
}

// Audio analysis types
export interface AudioAnalysisRequest {
  entity_type: 'track' | 'episode' | 'audiobook';
  entity_id: string;
  audio_uri: string;
  features?: ('tempo' | 'key' | 'energy' | 'danceability' | 'valence')[];
  embeddings?: ('content' | 'audio')[];
}

export interface AudioAnalysisResponse {
  entity_type: EntityType;
  entity_id: string;
  features?: AudioFeatures;
  embeddings?: Embedding[];
  processing_time_ms: number;
}

// Similarity and recommendation types
export interface SimilarityRequest {
  entity_type: EntityType;
  entity_id: string;
  limit?: number;
  threshold?: number;
  include_features?: boolean;
}

export interface SimilarityResponse {
  similar_entities: {
    entity: CatalogEntity;
    similarity_score: number;
    matching_features?: string[];
  }[];
}
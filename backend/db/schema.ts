export const ddl = {
  core: `
-- Master catalog tables with versioning and deduplication
-- Artists table
CREATE TABLE IF NOT EXISTS artist (
  id BIGSERIAL PRIMARY KEY,
  canonical_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  sort_name TEXT,
  mbid UUID,
  ipi TEXT,
  bio TEXT,
  genres JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  external_ids JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  version INT DEFAULT 1,
  etag TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  quality_score NUMERIC DEFAULT 0.5,
  source_priority INT DEFAULT 50,
  last_enriched_at TIMESTAMPTZ
);

-- Releases table
CREATE TABLE IF NOT EXISTS "release" (
  id BIGSERIAL PRIMARY KEY,
  canonical_id TEXT UNIQUE NOT NULL,
  upc TEXT,
  title TEXT NOT NULL,
  label TEXT,
  release_type TEXT DEFAULT 'album',
  date_released DATE,
  territories JSONB DEFAULT '[]',
  cover_uri TEXT,
  genres JSONB DEFAULT '[]',
  external_ids JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  version INT DEFAULT 1,
  etag TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  quality_score NUMERIC DEFAULT 0.5,
  source_priority INT DEFAULT 50,
  last_enriched_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS track (
  id BIGSERIAL PRIMARY KEY,
  canonical_id TEXT UNIQUE NOT NULL,
  isrc TEXT,
  title TEXT NOT NULL,
  release_id BIGINT REFERENCES "release"(id),
  duration_ms INT,
  explicit BOOLEAN DEFAULT FALSE,
  track_no INT,
  disc_no INT DEFAULT 1,
  preview_uri TEXT,
  stream_uri TEXT,
  media_type TEXT DEFAULT 'audio',
  genres JSONB DEFAULT '[]',
  external_ids JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  version INT DEFAULT 1,
  etag TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  quality_score NUMERIC DEFAULT 0.5
);

CREATE TABLE IF NOT EXISTS video (
  id BIGSERIAL PRIMARY KEY,
  canonical_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  release_id BIGINT REFERENCES "release"(id),
  duration_ms INT,
  aspect_ratio TEXT DEFAULT '16:9',
  preview_uri TEXT,
  stream_uri TEXT,
  media_type TEXT DEFAULT 'video',
  genres JSONB DEFAULT '[]',
  external_ids JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  version INT DEFAULT 1,
  etag TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  quality_score NUMERIC DEFAULT 0.5
);

CREATE TABLE IF NOT EXISTS podcast (
  id BIGSERIAL PRIMARY KEY,
  canonical_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  publisher TEXT,
  rss_url TEXT,
  description TEXT,
  language TEXT DEFAULT 'en',
  categories JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  external_ids JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  version INT DEFAULT 1,
  etag TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  quality_score NUMERIC DEFAULT 0.5
);

CREATE TABLE IF NOT EXISTS episode (
  id BIGSERIAL PRIMARY KEY,
  canonical_id TEXT UNIQUE NOT NULL,
  podcast_id BIGINT REFERENCES podcast(id),
  title TEXT NOT NULL,
  description TEXT,
  episode_no INT,
  season_no INT,
  duration_ms INT,
  pub_date TIMESTAMPTZ,
  audio_uri TEXT,
  stream_uri TEXT,
  explicit BOOLEAN DEFAULT FALSE,
  external_ids JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  version INT DEFAULT 1,
  etag TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  quality_score NUMERIC DEFAULT 0.5
);

CREATE TABLE IF NOT EXISTS book (
  id BIGSERIAL PRIMARY KEY,
  canonical_id TEXT UNIQUE NOT NULL,
  isbn TEXT,
  title TEXT NOT NULL,
  author TEXT,
  publisher TEXT,
  date_published DATE,
  cover_uri TEXT,
  description TEXT,
  language TEXT DEFAULT 'en',
  genres JSONB DEFAULT '[]',
  external_ids JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  version INT DEFAULT 1,
  etag TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  quality_score NUMERIC DEFAULT 0.5
);

CREATE TABLE IF NOT EXISTS audiobook (
  id BIGSERIAL PRIMARY KEY,
  canonical_id TEXT UNIQUE NOT NULL,
  book_id BIGINT REFERENCES book(id),
  narrator TEXT,
  duration_ms INT,
  audio_uri TEXT,
  stream_uri TEXT,
  chapters JSONB DEFAULT '[]',
  external_ids JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  version INT DEFAULT 1,
  etag TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  quality_score NUMERIC DEFAULT 0.5
);

CREATE TABLE IF NOT EXISTS contributor (
  id BIGSERIAL PRIMARY KEY,
  canonical_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  ipi TEXT,
  ipn TEXT,
  mbid UUID,
  bio TEXT,
  external_ids JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  version INT DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS credit (
  id BIGSERIAL PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id BIGINT NOT NULL,
  contributor_id BIGINT REFERENCES contributor(id),
  role TEXT NOT NULL,
  percentage NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS work (
  id BIGSERIAL PRIMARY KEY,
  canonical_id TEXT UNIQUE NOT NULL,
  iswc TEXT,
  title TEXT NOT NULL,
  writers JSONB DEFAULT '[]',
  publishers JSONB DEFAULT '[]',
  external_ids JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  version INT DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS rights (
  id BIGSERIAL PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id BIGINT NOT NULL,
  p_line TEXT,
  c_line TEXT,
  territorial_rights JSONB DEFAULT '{}',
  window JSONB DEFAULT '{}',
  streaming_allowed BOOLEAN DEFAULT TRUE,
  download_allowed BOOLEAN DEFAULT FALSE,
  sync_allowed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS images (
  id BIGSERIAL PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id BIGINT NOT NULL,
  purpose TEXT DEFAULT 'cover',
  uri TEXT NOT NULL,
  width INT,
  height INT,
  format TEXT,
  size_bytes INT,
  hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audio_features (
  entity_type TEXT NOT NULL,
  entity_id BIGINT NOT NULL,
  tempo NUMERIC,
  key TEXT,
  mode TEXT,
  energy NUMERIC,
  danceability NUMERIC,
  valence NUMERIC,
  loudness NUMERIC,
  speechiness NUMERIC,
  instrumentalness NUMERIC,
  acousticness NUMERIC,
  liveness NUMERIC,
  time_signature INT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY(entity_type, entity_id)
);

-- Vector embeddings for similarity matching
CREATE TABLE IF NOT EXISTS embeddings (
  entity_type TEXT NOT NULL,
  entity_id BIGINT NOT NULL,
  embedding_type TEXT DEFAULT 'content',
  vector VECTOR(768),
  model_version TEXT DEFAULT 'v1',
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY(entity_type, entity_id, embedding_type)
);
`,
  ingest: `
-- Ingest ops
CREATE TABLE IF NOT EXISTS source_mapping (
  source TEXT,
  source_id TEXT,
  entity_type TEXT,
  entity_id BIGINT,
  UNIQUE(source, source_id, entity_type)
);

CREATE TABLE IF NOT EXISTS ingest_log (
  id BIGSERIAL PRIMARY KEY,
  source TEXT,
  source_id TEXT,
  entity_type TEXT,
  op TEXT,
  version TEXT,
  checksum TEXT,
  received_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ,
  status TEXT,
  error TEXT
);

CREATE TABLE IF NOT EXISTS tombstone (
  id BIGSERIAL PRIMARY KEY,
  entity_type TEXT,
  entity_id BIGINT,
  source TEXT,
  at TIMESTAMPTZ,
  reason TEXT,
  UNIQUE(entity_type, entity_id)
);

CREATE TABLE IF NOT EXISTS update_event (
  id BIGSERIAL PRIMARY KEY,
  entity_type TEXT,
  entity_id BIGINT,
  op TEXT,
  version INT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
`,
  indexes: `
-- Core entity indexes
CREATE INDEX IF NOT EXISTS idx_artist_canonical ON artist(canonical_id);
CREATE INDEX IF NOT EXISTS idx_artist_mbid ON artist(mbid) WHERE mbid IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_artist_name ON artist(name);
CREATE INDEX IF NOT EXISTS idx_artist_active ON artist(is_active) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_release_canonical ON "release"(canonical_id);
CREATE INDEX IF NOT EXISTS idx_release_upc ON "release"(upc) WHERE upc IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_release_date ON "release"(date_released);
CREATE INDEX IF NOT EXISTS idx_release_active ON "release"(is_active) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_track_canonical ON track(canonical_id);
CREATE INDEX IF NOT EXISTS idx_track_isrc ON track(isrc) WHERE isrc IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_track_release ON track(release_id);
CREATE INDEX IF NOT EXISTS idx_track_title ON track(title);
CREATE INDEX IF NOT EXISTS idx_track_active ON track(is_active) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_video_canonical ON video(canonical_id);
CREATE INDEX IF NOT EXISTS idx_video_release ON video(release_id);
CREATE INDEX IF NOT EXISTS idx_video_active ON video(is_active) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_podcast_canonical ON podcast(canonical_id);
CREATE INDEX IF NOT EXISTS idx_podcast_rss ON podcast(rss_url) WHERE rss_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_podcast_active ON podcast(is_active) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_episode_canonical ON episode(canonical_id);
CREATE INDEX IF NOT EXISTS idx_episode_podcast ON episode(podcast_id);
CREATE INDEX IF NOT EXISTS idx_episode_pub_date ON episode(pub_date);
CREATE INDEX IF NOT EXISTS idx_episode_active ON episode(is_active) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_book_canonical ON book(canonical_id);
CREATE INDEX IF NOT EXISTS idx_book_isbn ON book(isbn) WHERE isbn IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_book_active ON book(is_active) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_audiobook_canonical ON audiobook(canonical_id);
CREATE INDEX IF NOT EXISTS idx_audiobook_book ON audiobook(book_id);
CREATE INDEX IF NOT EXISTS idx_audiobook_active ON audiobook(is_active) WHERE is_active = TRUE;

-- Search and metadata indexes
CREATE INDEX IF NOT EXISTS idx_artist_genres ON artist USING GIN(genres);
CREATE INDEX IF NOT EXISTS idx_release_genres ON "release" USING GIN(genres);
CREATE INDEX IF NOT EXISTS idx_track_genres ON track USING GIN(genres);
CREATE INDEX IF NOT EXISTS idx_video_genres ON video USING GIN(genres);
CREATE INDEX IF NOT EXISTS idx_book_genres ON book USING GIN(genres);

CREATE INDEX IF NOT EXISTS idx_artist_external_ids ON artist USING GIN(external_ids);
CREATE INDEX IF NOT EXISTS idx_release_external_ids ON "release" USING GIN(external_ids);
CREATE INDEX IF NOT EXISTS idx_track_external_ids ON track USING GIN(external_ids);

-- Full text search indexes
CREATE INDEX IF NOT EXISTS idx_artist_name_trgm ON artist USING GIN(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_release_title_trgm ON "release" USING GIN(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_track_title_trgm ON track USING GIN(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_podcast_title_trgm ON podcast USING GIN(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_episode_title_trgm ON episode USING GIN(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_book_title_trgm ON book USING GIN(title gin_trgm_ops);

-- Rights and images
CREATE INDEX IF NOT EXISTS idx_rights_entity ON rights(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_rights_streaming ON rights(streaming_allowed) WHERE streaming_allowed = TRUE;
CREATE INDEX IF NOT EXISTS idx_images_entity ON images(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_images_purpose ON images(purpose);

-- Credits and contributors
CREATE INDEX IF NOT EXISTS idx_credit_entity ON credit(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_credit_contributor ON credit(contributor_id);
CREATE INDEX IF NOT EXISTS idx_credit_role ON credit(role);
CREATE INDEX IF NOT EXISTS idx_contributor_canonical ON contributor(canonical_id);
CREATE INDEX IF NOT EXISTS idx_contributor_mbid ON contributor(mbid) WHERE mbid IS NOT NULL;

-- Audio features and embeddings
CREATE INDEX IF NOT EXISTS idx_audio_features_tempo ON audio_features(tempo) WHERE tempo IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_audio_features_key ON audio_features(key) WHERE key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_audio_features_energy ON audio_features(energy) WHERE energy IS NOT NULL;

-- Vector similarity search (requires pgvector)
CREATE INDEX IF NOT EXISTS idx_embeddings_vector ON embeddings USING ivfflat (vector vector_cosine_ops) WITH (lists = 100);

-- Ingest and updates
CREATE INDEX IF NOT EXISTS idx_source_mapping_source ON source_mapping(source, source_id);
CREATE INDEX IF NOT EXISTS idx_source_mapping_entity ON source_mapping(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_ingest_log_source ON ingest_log(source, received_at);
CREATE INDEX IF NOT EXISTS idx_ingest_log_status ON ingest_log(status, received_at);
CREATE INDEX IF NOT EXISTS idx_update_event_time ON update_event(updated_at);
CREATE INDEX IF NOT EXISTS idx_update_event_entity ON update_event(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_tombstone_entity ON tombstone(entity_type, entity_id);

-- Quality and versioning
CREATE INDEX IF NOT EXISTS idx_artist_quality ON artist(quality_score);
CREATE INDEX IF NOT EXISTS idx_release_quality ON "release"(quality_score);
CREATE INDEX IF NOT EXISTS idx_track_quality ON track(quality_score);
CREATE INDEX IF NOT EXISTS idx_video_quality ON video(quality_score);
CREATE INDEX IF NOT EXISTS idx_podcast_quality ON podcast(quality_score);
CREATE INDEX IF NOT EXISTS idx_episode_quality ON episode(quality_score);
CREATE INDEX IF NOT EXISTS idx_book_quality ON book(quality_score);
CREATE INDEX IF NOT EXISTS idx_audiobook_quality ON audiobook(quality_score);
`,
};

export const fullDDL = `${ddl.core}\n${ddl.ingest}\n${ddl.indexes}`;

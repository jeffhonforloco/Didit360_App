export const ddl = {
  core: `
-- Core tables
CREATE TABLE IF NOT EXISTS artist (
  id BIGSERIAL PRIMARY KEY,
  canonical_id TEXT UNIQUE,
  name TEXT,
  sort_name TEXT,
  mbid UUID,
  ipi TEXT,
  images JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  version INT DEFAULT 1,
  etag TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS "release" (
  id BIGSERIAL PRIMARY KEY,
  canonical_id TEXT UNIQUE,
  upc TEXT,
  title TEXT,
  label TEXT,
  release_type TEXT,
  date_released DATE,
  territories JSONB,
  cover_uri TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  version INT DEFAULT 1,
  etag TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS track (
  id BIGSERIAL PRIMARY KEY,
  canonical_id TEXT UNIQUE,
  isrc TEXT,
  title TEXT NOT NULL,
  release_id BIGINT REFERENCES "release"(id),
  duration_ms INT,
  explicit BOOLEAN,
  track_no INT,
  disc_no INT,
  preview_uri TEXT,
  media_type TEXT DEFAULT 'audio',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  version INT DEFAULT 1,
  etag TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS video (
  id BIGSERIAL PRIMARY KEY,
  canonical_id TEXT UNIQUE,
  title TEXT NOT NULL,
  release_id BIGINT REFERENCES "release"(id),
  duration_ms INT,
  aspect_ratio TEXT,
  preview_uri TEXT,
  media_type TEXT DEFAULT 'video',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  version INT DEFAULT 1,
  etag TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS podcast (
  id BIGSERIAL PRIMARY KEY,
  canonical_id TEXT UNIQUE,
  title TEXT,
  publisher TEXT,
  rss_url TEXT,
  description TEXT,
  images JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  version INT DEFAULT 1,
  etag TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS episode (
  id BIGSERIAL PRIMARY KEY,
  canonical_id TEXT UNIQUE,
  podcast_id BIGINT REFERENCES podcast(id),
  title TEXT,
  episode_no INT,
  season_no INT,
  duration_ms INT,
  pub_date TIMESTAMPTZ,
  audio_uri TEXT,
  explicit BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  version INT DEFAULT 1,
  etag TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS book (
  id BIGSERIAL PRIMARY KEY,
  canonical_id TEXT UNIQUE,
  isbn TEXT,
  title TEXT,
  author TEXT,
  publisher TEXT,
  date_published DATE,
  cover_uri TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  version INT DEFAULT 1,
  etag TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS audiobook (
  id BIGSERIAL PRIMARY KEY,
  canonical_id TEXT UNIQUE,
  book_id BIGINT REFERENCES book(id),
  narrator TEXT,
  duration_ms INT,
  audio_uri TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  version INT DEFAULT 1,
  etag TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS contributor (
  id BIGSERIAL PRIMARY KEY,
  canonical_id TEXT UNIQUE,
  name TEXT,
  ipi TEXT,
  ipn TEXT,
  mbid UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS credit (
  id BIGSERIAL PRIMARY KEY,
  entity_type TEXT,
  entity_id BIGINT,
  contributor_id BIGINT REFERENCES contributor(id),
  role TEXT
);

CREATE TABLE IF NOT EXISTS work (
  id BIGSERIAL PRIMARY KEY,
  canonical_id TEXT UNIQUE,
  iswc TEXT,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rights (
  id BIGSERIAL PRIMARY KEY,
  entity_type TEXT,
  entity_id BIGINT,
  p_line TEXT,
  c_line TEXT,
  territorial_rights JSONB,
  window JSONB,
  streaming_allowed BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS images (
  id BIGSERIAL PRIMARY KEY,
  entity_type TEXT,
  entity_id BIGINT,
  purpose TEXT,
  uri TEXT,
  width INT,
  height INT,
  hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audio_features (
  entity_type TEXT,
  entity_id BIGINT,
  tempo NUMERIC,
  key TEXT,
  mode TEXT,
  energy NUMERIC,
  danceability NUMERIC,
  valence NUMERIC,
  loudness NUMERIC,
  speechiness NUMERIC,
  instrumentalness NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY(entity_type, entity_id)
);

-- VECTOR requires pgvector extension; included for completeness
CREATE TABLE IF NOT EXISTS embeddings (
  entity_type TEXT,
  entity_id BIGINT,
  vector VECTOR(768),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY(entity_type, entity_id)
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
CREATE INDEX IF NOT EXISTS idx_track_isrc ON track(isrc);
CREATE INDEX IF NOT EXISTS idx_release_upc ON "release"(upc);
CREATE INDEX IF NOT EXISTS idx_updates_time ON update_event(updated_at);
CREATE INDEX IF NOT EXISTS idx_rights_entity ON rights(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_images_entity ON images(entity_type, entity_id);
`,
};

export const fullDDL = `${ddl.core}\n${ddl.ingest}\n${ddl.indexes}`;

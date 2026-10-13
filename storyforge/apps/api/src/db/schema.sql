-- StoryForge cloud persistence (optional — enabled when DATABASE_URL is set).
-- JSONB document store mirrors the in-memory API used by Studio.

CREATE TABLE IF NOT EXISTS sf_users (
  id UUID PRIMARY KEY,
  external_ref TEXT NOT NULL UNIQUE,
  email TEXT,
  locale TEXT DEFAULT 'de',
  guardian_affirmed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sf_ledger (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES sf_users(id) ON DELETE CASCADE,
  delta INTEGER NOT NULL,
  reason TEXT,
  job_id UUID,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS sf_ledger_user_idx ON sf_ledger(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS sf_projects (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES sf_users(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS sf_projects_user_idx ON sf_projects(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS sf_projects_series_idx ON sf_projects (
  user_id,
  (lower(coalesce(data->'ip_character'->>'seriesId', '')))
);

CREATE TABLE IF NOT EXISTS sf_jobs (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES sf_users(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS sf_jobs_user_idx ON sf_jobs(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS sf_kv (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

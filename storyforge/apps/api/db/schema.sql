-- StoryForge core schema (Postgres). Apply when DATABASE_URL is set.
-- Credits are append-only ledger rows — never a mutable balance column on users.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- CREATE EXTENSION IF NOT EXISTS vector; -- enable when using pgvector consistency scoring

CREATE TABLE IF NOT EXISTS sf_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_ref TEXT UNIQUE,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sf_credit_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES sf_users(id),
  delta INTEGER NOT NULL,
  reason TEXT NOT NULL,
  job_id UUID,
  meta JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sf_credit_ledger_user_idx ON sf_credit_ledger(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS sf_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES sf_users(id),
  title TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'de',
  trim_id TEXT NOT NULL DEFAULT 'sq_85',
  paper_type TEXT NOT NULL DEFAULT 'premium_color',
  page_count INTEGER NOT NULL DEFAULT 32,
  status TEXT NOT NULL DEFAULT 'draft',
  meta JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sf_characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES sf_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  locked BOOLEAN NOT NULL DEFAULT false,
  bible JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sf_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES sf_projects(id) ON DELETE CASCADE,
  page_index INTEGER NOT NULL,
  text_content TEXT NOT NULL DEFAULT '',
  illustration_brief TEXT NOT NULL DEFAULT '',
  layers JSONB NOT NULL DEFAULT '[]',
  UNIQUE (project_id, page_index)
);

CREATE TABLE IF NOT EXISTS sf_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES sf_users(id),
  project_id UUID REFERENCES sf_projects(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  cost_credits INTEGER NOT NULL DEFAULT 0,
  inputs_hash TEXT,
  inputs JSONB NOT NULL DEFAULT '{}',
  outputs JSONB NOT NULL DEFAULT '{}',
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sf_ai_usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES sf_projects(id) ON DELETE CASCADE,
  asset_id TEXT,
  source TEXT NOT NULL CHECK (source IN ('ai', 'upload', 'human')),
  provider TEXT,
  model TEXT,
  prompt TEXT,
  seed TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Launchpad Part A (guides, course, prompts, disclosure, config)

CREATE TABLE IF NOT EXISTS sf_config_values (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  source_label TEXT NOT NULL DEFAULT '',
  verified_note TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sf_guides (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sf_prompt_templates (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sf_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES sf_users(id),
  project_id UUID NOT NULL REFERENCES sf_projects(id) ON DELETE CASCADE,
  step_id INTEGER NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  checklist JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (project_id, step_id)
);

CREATE TABLE IF NOT EXISTS sf_disclosure_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES sf_users(id),
  project_id UUID NOT NULL REFERENCES sf_projects(id) ON DELETE CASCADE,
  asset_id TEXT,
  generation_mode TEXT NOT NULL,
  used_ai BOOLEAN NOT NULL DEFAULT true,
  recommend_disclose BOOLEAN NOT NULL,
  kdp_category TEXT NOT NULL,
  rationale TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sf_photo_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES sf_users(id),
  project_id UUID NOT NULL REFERENCES sf_projects(id) ON DELETE CASCADE,
  guardian_name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  agreed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  delete_after_approval BOOLEAN NOT NULL DEFAULT true,
  no_training BOOLEAN NOT NULL DEFAULT true,
  meta JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS sf_reading_resources (
  id TEXT PRIMARY KEY,
  group_name TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Characters: pin hero_frame as Launchpad anchor (S3–S4)
ALTER TABLE sf_characters ADD COLUMN IF NOT EXISTS pinned BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE sf_characters ADD COLUMN IF NOT EXISTS anchor JSONB NOT NULL DEFAULT '{}';
ALTER TABLE sf_characters ADD COLUMN IF NOT EXISTS engine_version TEXT NOT NULL DEFAULT 'v3';

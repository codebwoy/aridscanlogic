-- AuthorForge core schema (Postgres). Apply when DATABASE_URL is set.
-- Credits are append-only ledger rows — never a mutable balance column.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS af_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_ref TEXT UNIQUE,
  email TEXT,
  org_id UUID,
  locale TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS af_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS af_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES af_organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES af_users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'owner',
  UNIQUE (org_id, user_id)
);

CREATE TABLE IF NOT EXISTS af_credit_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES af_users(id),
  delta INTEGER NOT NULL,
  reason TEXT NOT NULL,
  job_id UUID,
  meta JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS af_credit_ledger_user_idx ON af_credit_ledger(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS af_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES af_users(id),
  org_id UUID,
  working_title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  genre TEXT,
  target_words INTEGER NOT NULL DEFAULT 28000,
  language TEXT NOT NULL DEFAULT 'en',
  trim_size TEXT NOT NULL DEFAULT '6x9',
  wizard_step TEXT NOT NULL DEFAULT 'basics',
  payload JSONB NOT NULL DEFAULT '{}',
  llm_cost_usd NUMERIC(12,6) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS af_generation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES af_users(id),
  book_id UUID REFERENCES af_books(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  model TEXT,
  prompt_name TEXT,
  prompt_version TEXT,
  input_hash TEXT,
  tokens_in INTEGER DEFAULT 0,
  tokens_out INTEGER DEFAULT 0,
  cost_usd NUMERIC(12,6) DEFAULT 0,
  cost_credits INTEGER NOT NULL DEFAULT 0,
  inputs JSONB NOT NULL DEFAULT '{}',
  outputs JSONB NOT NULL DEFAULT '{}',
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS af_config_values (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  source_label TEXT NOT NULL DEFAULT '',
  verified_note TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

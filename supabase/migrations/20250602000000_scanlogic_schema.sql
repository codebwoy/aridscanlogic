-- ScanLogic entity store (mirrors localStorage appApi entities)

CREATE TABLE IF NOT EXISTS public.scanlogic_records (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  user_id TEXT NOT NULL DEFAULT 'local-user',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_date TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_scanlogic_records_entity_user
  ON public.scanlogic_records (entity_type, user_id);

CREATE INDEX IF NOT EXISTS idx_scanlogic_records_created
  ON public.scanlogic_records (entity_type, created_date DESC);

CREATE INDEX IF NOT EXISTS idx_scanlogic_records_payload
  ON public.scanlogic_records USING GIN (payload);

ALTER TABLE public.scanlogic_records ENABLE ROW LEVEL SECURITY;

-- Service role / direct postgres bypasses RLS. Anon/authenticated need policies later.
CREATE POLICY scanlogic_records_service_all
  ON public.scanlogic_records
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE public.scanlogic_records IS 'ScanLogic suite entities (Document, Receipt, Contract, etc.)';

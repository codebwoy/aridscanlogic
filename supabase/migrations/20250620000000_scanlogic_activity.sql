-- Activity log for admin analytics (user actions across the suite)

CREATE TABLE IF NOT EXISTS public.scanlogic_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scanlogic_activity_user_created
  ON public.scanlogic_activity (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_scanlogic_activity_created
  ON public.scanlogic_activity (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_scanlogic_activity_action
  ON public.scanlogic_activity (action, created_at DESC);

ALTER TABLE public.scanlogic_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY scanlogic_activity_service_all
  ON public.scanlogic_activity
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE public.scanlogic_activity IS 'ScanLogic user activity events for admin analytics';

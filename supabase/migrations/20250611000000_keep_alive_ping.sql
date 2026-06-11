-- Lightweight table for cron keep-alive via anon key (no service role required on edge).

CREATE TABLE IF NOT EXISTS public.keep_alive_ping (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  pinged_at timestamptz NOT NULL DEFAULT NOW()
);

INSERT INTO public.keep_alive_ping (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.keep_alive_ping ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS keep_alive_ping_anon_select ON public.keep_alive_ping;
CREATE POLICY keep_alive_ping_anon_select
  ON public.keep_alive_ping
  FOR SELECT
  TO anon
  USING (true);

COMMENT ON TABLE public.keep_alive_ping IS 'Public read ping row for Vercel cron keep-alive without service role env';

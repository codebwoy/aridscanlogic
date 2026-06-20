# Security

## API keys (Anthropic)

- Put `ANTHROPIC_API_KEY` only in `.env` on the machine running Vite (`npm run dev` / `npm run preview`).
- The key is **never** bundled into the client. Requests go to `/api/llm`, which proxies to Anthropic server-side.
- Do **not** set `VITE_ANTHROPIC_API_KEY` — any `VITE_*` variable can be embedded in the frontend build.
- `.env` is gitignored. If a key was ever committed, rotate it in the [Anthropic console](https://console.anthropic.com/).

## Dev server & LAN access

- Default `npm run dev` binds to **localhost** so `/api/llm` and `/api/db` are not exposed on your network.
- Use `npm run dev:lan` only when you need LAN access; set `SCANLOGIC_API_SECRET` in `.env`, then in the phone browser console run `sessionStorage.setItem('scanlogic_api_secret', 'same-secret')` and reload.
- Non-local requests without a valid `Authorization: Bearer` token are rejected.

## API hardening

- LLM proxy validates model names, caps `max_tokens`, and rate-limits requests.
- Upstream Anthropic errors are sanitized — raw upstream bodies are not forwarded to clients.
- DB proxy sanitizes `user_id`, record IDs, and filter keys; database errors are not leaked to clients.
- Sync batches are capped at 500 records; upserts only apply when the existing row belongs to the same `user_id`.
- When `SUPABASE_JWT_SECRET` is set, `/api/db` binds requests to the JWT `sub` claim — client-supplied `user_id` cannot impersonate another tenant.
- LAN dev may send `X-ScanLogic-Api-Secret` alongside a user JWT Bearer token.
- Local API auth uses **socket address only** (not the `Host` header) to prevent LAN bypass via header spoofing.
- Postgres TLS certificate verification is **enabled by default**; set `SCANLOGIC_PG_SSL_REJECT_UNAUTHORIZED=false` only if your provider requires it (e.g. some Supabase setups).
- **Content-Security-Policy** is applied on production preview and in the built HTML meta tag — **not** during `npm run dev` (Vite requires inline scripts for HMR).
- Markdown from AI/OCR is rendered with `rehype-sanitize` to reduce XSS risk.
- User image URLs for Claude are restricted to safe `https:` / `data:` targets (SSRF mitigation).

## Production deployment

Static hosts (GitHub Pages, S3-only) **cannot** run the LLM proxy. Options:

1. Deploy the built app behind a Node server using `npm run preview` or your own server with the same `/api/llm` middleware (`server/llm-proxy.mjs`).
2. Add a serverless function (Vercel/Netlify/Cloudflare) that forwards to Anthropic with the secret in platform env vars.

## Local data

- ScanVault passwords are hashed with PBKDF2 (310k iterations) before storage in `localStorage`.
- Tax Vault backups use AES-GCM with a user passphrase (PBKDF2 310k iterations).
- Share links use cryptographically random tokens with expiry.

## Remaining limitations

- All business data lives in the browser (`localStorage`) — not suitable for multi-user or high-sensitivity production without a real backend and auth.
- “Google sign-in” in ScanVault is a **demo stub**, not OAuth.
- PWA offline cache does not encrypt stored data at rest in the browser profile.
- `/api/db` uses a shared Postgres connection without per-user auth; use RLS + Supabase Auth for production multi-tenant setups.

## Supabase

- `DATABASE_URL` is used **only** on the dev/preview server (`/api/db` proxy), never in the frontend bundle.
- Optional cloud auth: set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (client) and `SUPABASE_JWT_SECRET` (server) — see `.env.example`.
- When JWT auth is active, the server ignores mismatched `user_id` query parameters.
- Do **not** put `service_role` or database passwords in any `VITE_*` variable.
- **Never** set `VITE_SUPABASE_SECRET_KEY` or `VITE_SUPABASE_SERVICE_ROLE_KEY` — use `SUPABASE_SERVICE_ROLE_KEY` (server-only) for cron/keep-alive.
- Rotate database password and JWT secrets if they were shared in chat or committed.

## Admin console

- Admin API routes (`/api/admin/*`) require `ADMIN_API_SECRET` as Bearer token or `X-Admin-Secret` header — server-only, never in `VITE_*`.
- Open the dashboard at `?admin=1` on your deployed app; the secret is stored in **sessionStorage** only for the browser session.
- Admin queries run cross-tenant against Postgres — use only with `DATABASE_URL` configured and the activity migration applied.
- Activity ingestion (`POST /api/activity/events`) follows the same user auth rules as `/api/db`.
- Do **not** expose `SUPABASE_SERVICE_ROLE_KEY` to the admin UI; admin uses the dedicated secret instead.

## Reporting

Open a private security issue on the repository or contact the maintainer directly.

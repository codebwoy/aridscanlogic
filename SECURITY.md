# Security

## API keys (Anthropic)

- Put `ANTHROPIC_API_KEY` only in `.env` on the machine running Vite (`npm run dev` / `npm run preview`).
- The key is **never** bundled into the client. Requests go to `/api/llm`, which proxies to Anthropic server-side.
- Do **not** set `VITE_ANTHROPIC_API_KEY` — any `VITE_*` variable can be embedded in the frontend build.
- `.env` is gitignored. If a key was ever committed, rotate it in the [Anthropic console](https://console.anthropic.com/).

## Dev server & LAN access

- Default `npm run dev` binds to **localhost** so `/api/llm` and `/api/db` are not exposed on your network.
- Use `npm run dev:lan` only when you need LAN access; set `SCANLOGIC_API_SECRET` in `.env` and enter the same value under **Settings → Remote API access** (stored in `sessionStorage` for that tab only).
- Non-local requests without a valid `Authorization: Bearer` token are rejected.

## API hardening

- LLM proxy validates model names, caps `max_tokens`, and rate-limits requests.
- DB proxy sanitizes `user_id` and filter keys; database errors are not leaked to clients.
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
- Do **not** put `service_role` or database passwords in any `VITE_*` variable.
- Rotate database password and JWT secrets if they were shared in chat or committed.

## Reporting

Open a private security issue on the repository or contact the maintainer directly.

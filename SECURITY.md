# Security

## API keys (Anthropic)

- Put `ANTHROPIC_API_KEY` only in `.env` on the machine running Vite (`npm run dev` / `npm run preview`).
- The key is **never** bundled into the client. Requests go to `/api/llm`, which proxies to Anthropic server-side.
- Do **not** set `VITE_ANTHROPIC_API_KEY` — any `VITE_*` variable can be embedded in the frontend build.
- `.env` is gitignored. If a key was ever committed, rotate it in the [Anthropic console](https://console.anthropic.com/).

## Production deployment

Static hosts (GitHub Pages, S3-only) **cannot** run the LLM proxy. Options:

1. Deploy the built app behind a Node server using `npm run preview` or your own server with the same `/api/llm` middleware (`server/llm-proxy.mjs`).
2. Add a serverless function (Vercel/Netlify/Cloudflare) that forwards to Anthropic with the secret in platform env vars.

## Local data

- ScanVault passwords are hashed with PBKDF2 (310k iterations) before storage in `localStorage`.
- Tax Vault backups use AES-GCM with a user passphrase.
- Share links use cryptographically random tokens with expiry.

## Remaining limitations

- All business data lives in the browser (`localStorage`) — not suitable for multi-user or high-sensitivity production without a real backend.
- “Google sign-in” in ScanVault is a demo stub, not OAuth.
- PWA offline cache does not encrypt stored data at rest in the browser profile.

## Supabase

- `DATABASE_URL` is used **only** on the dev/preview server (`/api/db` proxy), never in the frontend bundle.
- Do **not** put `service_role` or `NEXT_SECRET_KEY` in any `VITE_*` variable.
- Rotate database password and JWT secrets if they were shared in chat or committed.

## Reporting

Open a private security issue on the repository or contact the maintainer directly.

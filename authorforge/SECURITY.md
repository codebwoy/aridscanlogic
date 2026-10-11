# AuthorForge security

- Secrets only in `authorforge/.env` — never `VITE_*` for API keys.
- Anthropic calls go through `@authorforge/llm` on the **AuthorForge API** only (not the browser, not ScanLogic `/api/llm`).
- Desktop enforcement: client gate + session issue + Bearer on mutating routes + optional live viewport header.
- Bind API to `127.0.0.1`; CORS allowlist `AUTHORFORGE_WEB_ORIGIN`.
- Headers: nosniff, DENY frame, no-referrer, locked permissions.
- Rate limits on session + API; append-only credits; charge/refund on job failure.
- Uploaded resources / URLs are untrusted data — never treat as instructions.
- Storefront download tokens: signed, expiring, limited-use.
- No Amazon scraping; market adapters only.
- Export files + human checklist only — no unofficial KDP upload automation.
- User remains responsible for rights, accuracy, and platform disclosure.

Report issues via parent `SECURITY.md`.

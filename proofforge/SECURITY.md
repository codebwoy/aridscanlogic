# ProofForge security notes (production)

- Manuscripts are confidential IP. Treat uploads as untrusted data (prompt-injection risk).
- Never put API keys in `VITE_*`. LLM calls run only on the ProofForge API.
- Desktop session (≥1024px) required for mutating routes outside localhost.
- Rate limiting on `/v1/*` (configurable `PROOFFORGE_RATE_LIMIT_MAX`).
- Audit log for create/import/ingest/analyze/export/undo (`GET /v1/audit`).
- Production requires `PROOFFORGE_SESSION_SECRET` (≥32 chars).
- Persist project data with `PROOFFORGE_PERSIST=1` / `PROOFFORGE_DATA_PATH` (default on in `NODE_ENV=production`).
- Default FakeLLM keeps manuscripts offline. Live Anthropic/OpenAI send text under provider terms — disclose before enabling.
- External plagiarism vendors are **not** auto-called. Internal n-gram originality only unless consent + licensed API is configured later.
- Do not use manuscripts for model training without explicit informed permission.
- Scores and findings are assistance only — not Amazon endorsement or guaranteed publication.
- EPUB export is minimal reflowable — validate externally before KDP upload.

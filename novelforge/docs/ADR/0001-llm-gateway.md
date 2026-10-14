# ADR 0001 — NovelForge owns the LLM gateway

## Decision

NovelForge API calls Anthropic directly via `LLMProvider` (Recommendation C). It does **not** proxy through ScanLogic `/api/llm`.

## Why

Book generation needs longer jobs, cost-per-book tracking, prompt caching, and independent rate limits. ScanLogic’s `/api/llm` is tuned for short interactive suite AI.

## Keys

`ANTHROPIC_API_KEY` may be the same string as ScanLogic’s, but lives in `novelforge/.env` for the NovelForge process. Never `VITE_*`.

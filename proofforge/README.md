# ProofForge

Desktop-only **AI manuscript audit** studio — humanoid proofreader / localization / style reports / KDP readiness after **NovelForge**, **AuthorForge**, or **StoryForge**.

> Not affiliated with Amazon. Scores are guides — not KDP approval.

## Production readiness

Research: [`docs/RESEARCH.md`](./docs/RESEARCH.md). Security: [`SECURITY.md`](./SECURITY.md).

> **Scope note:** The original BookReady mega-prompt describes a full commercial SaaS.
> ProofForge implements the **personal manuscript-audit product** for your own books
> (core journey + research-backed reports + KDP readiness). It is **not** a clone of
> every SaaS line (multi-tenant auth, payments, object storage farm, browser E2E suite).

| Capability | Status |
|------------|--------|
| Whole-manuscript chunked analysis | Done |
| Ordered action plan + re-verify | Done |
| Alternatives picker + DOCX export | Done |
| Ingest sha256 + drag-drop | Done |
| Cross-chapter continuity + kids safeguards | Done |
| KDP print pre-pub checklist | Done |
| Manuscript Analysis 5 sections + color levels | Done |
| Text Location jump-to + highlight | Done |
| Fine-tune author goals | Done |
| Genre comparison scores (AutoCrit-style) | Done |
| Editing process order workflow | Done |
| Structured findings + accept/reject/intentional + agree/disagree | Done |
| Side-by-side compare + revision Undo | Done |
| Style reports + emotion tells / hidden verbs / 1st-chapter pacing | Done |
| Reports catalog (Summary / Overused / Sticky / Structure / Readability / Grammar / Dialogue) | Done |
| Ignore / Defer / Add to dictionary | Done |
| Credit estimate before audit | Done |
| Hardcover KDP reminder | Done |
| Tone detector (overall) | Done |
| Chapter critiques (per section) | Done |
| Document domains (Grammarly-style) | Done |
| Word-count soft gate (6k–300k) | Done |
| Language packs en/de/es/fr/it/nl | Done |
| Fiction / nonfiction + translation mode | Done |
| Dual-model verify + disagreement preserved | Done (set `PROOFFORGE_VERIFY_PROVIDER`) |
| Internal originality (no silent third-party upload) | Done |
| External plagiarism (consent + mock/http provider) | Done |
| Workbook/journal engine | Done |
| Versioned KDP rules + content/AI policy + print config + admin catalog | Done |
| Preferences (category toggles) | Done |
| Ingest TXT/MD/DOCX/PDF (**OCR fallback**)/EPUB | Done |
| Export JSON/CSV/MD/manuscript/EPUB | Done |
| Rate limit + audit log + desktop auth | Done |
| Personal studio (no Stripe / no paywall) | Done |
| Docker production image | Done |

## Quick start

```bash
npm run proofforge:install
npm run proofforge:dev
# http://127.0.0.1:5183/
```

Production:

```bash
# proofforge/.env
NODE_ENV=production
PROOFFORGE_SESSION_SECRET=<≥32 chars>
PROOFFORGE_LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=...
PROOFFORGE_PERSIST=1
# optional dual verify:
# PROOFFORGE_VERIFY_PROVIDER=openai
# OPENAI_API_KEY=...
# optional OCR (default on):
# PROOFFORGE_OCR=1
# PROOFFORGE_OCR_MAX_PAGES=40
# optional plagiarism (consent required in UI):
# PROOFFORGE_PLAGIARISM_PROVIDER=mock
# or PROOFFORGE_PLAGIARISM_PROVIDER=http + PROOFFORGE_PLAGIARISM_URL=

npm run build && npm run start:prod
# or: docker build -t proofforge .
```

ScanLogic: `VITE_PROOFFORGE_URL` + Amazon Hub / NovelForge **Audit in ProofForge**.

# AuthorForge

Desktop-only AI **culturally specific adult non-fiction** co-author for African-heritage / bilingual / Germany-based authors: parenting guides, coaching workbooks, cultural journals, identity self-help. Guided wizard, quality gates, KDP-oriented export, storefront. **Not** for fiction or children’s picture books — those belong in **StoryForge**. Hybrid: bilingual kids’ series in StoryForge → companion parent / coaching book here. Sibling to **ScanLogic Business Suite** — Amazon Business Hub on wide viewports only.

Product positioning + recommended niches (canonical): `packages/shared/src/product-positioning.js` and `.cursor/rules/19-authorforge.mdc`. Niche demand copy is strategic guidance with ⚠ — not verified Amazon sales data.

> Not affiliated with or endorsed by Amazon.

## Architecture

| Package | Role |
|---------|------|
| `packages/shared` | Desktop gate, credits, wizard steps, publishing specs, token budgets, i18n |
| `packages/llm` | `LLMProvider` (fake + Anthropic) — AuthorForge owns the gateway (not ScanLogic `/api/llm`) |
| `packages/agents` | Versioned prompts, `runAgent`, outline coverage, quality gates |
| `packages/export` | Interior PDF, cover wrap, EPUB3, KDP ZIP |
| `packages/market` | `MarketDataProvider` + mock (no Amazon scrape) |
| `apps/api` | Desktop sessions, credits, books, jobs, storefront, signed exports |
| `apps/web` | Wizard studio + public storefront |
| `apps/worker` | Optional BullMQ consumer when `REDIS_URL` is set |

**Mobile users never edit here.** Mutating API routes require an HMAC desktop session issued only when `viewportWidth ≥ 1024`.

## Quick start

```bash
# From repo root
npm run authorforge:install
npm run authorforge:dev       # API :8788 + web :5181
```

Open **http://127.0.0.1:5181/?view=studio#studio** (viewport ≥1024px).

From ScanLogic (with `VITE_AUTHORFORGE_URL=http://127.0.0.1:5181` in root `.env`):
Amazon Hub → **Open AuthorForge**.

```bash
cd authorforge
cp .env.example .env
npm install
npm test
npm run dev:studio
```

Default LLM is **fake** (offline fixtures). For live Anthropic (Recommendation C):

```bash
# authorforge/.env
AUTHORFORGE_LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...   # may match ScanLogic’s key — never VITE_*
```

## Phases shipped

1. Foundation — monorepo, desktop session, credits, LLM abstraction, design shell  
2. Book bible & outline — wizard steps, persona, focus tags, coverage matrix  
3. Writing engine — section draft / generate-all chapter, continuity, editor versions, story slots  
4. Quality & truth — fact-check markers, originality n-grams, quality reports, export soft-gate  
5. Export & KDP — interior PDF, EPUB, cover wrap, metadata, compliance checklist ZIP  
6. Cover & marketing — SVG cover with exact typography QA, wrap PDF, A+ SVG modules, ad scripts  
7. Storefront — public `/?view=store&slug=…`, Stripe Checkout when keyed (else test paid), signed downloads, JSON-LD  
8. Market research — Niche Hunter + competitive analysis via mock adapter (licensed adapters pluggable)  
9. Polish — DE/EN strings, admin cost snapshot, translation job + AI disclosure, docs, tests  

### Primary manuscript language

Users choose the book language up front (`en` / `de` / `es` / `fr` / `it` / `nl`) plus a variety
where relevant (e.g. US vs UK English, LatAm vs Spain Spanish). Culture/tone profiles live in
`packages/shared/src/book-languages.js` and are injected into every writing agent. See
`.cursor/rules/22-book-languages.mdc`.

### Launch readiness (Publish step)

Interactive checklist before Amazon: manuscript quality, KDP account, studio setup, after-export
upload, strategy disclaimer. Canonical: `LAUNCH_READINESS` in `publishing-specs.js`. See
`.cursor/rules/23-launch-readiness.mdc`. Export still does **not** upload to Amazon.

### Editor & quality

- Tiptap editor with inline Improve / Rephrase / Elaborate / Soften-claim (approve/reject diffs)
- Fact-check extracts claims + search adapter (mock never marks verified; Tavily when keyed)
- Resource notes chunked + retrieved into WriterAgent context
- Real DOCX via `docx` in exports and KDP ZIP

## Production (hybrid)

One Docker container serves API + SPA. **Oracle active** (`deploy/oracle/`); Fly `fly.toml` kept as standby.
ScanLogic Vercel sets `VITE_AUTHORFORGE_URL`. Full guide: [docs/HYBRID_DEPLOY.md](./docs/HYBRID_DEPLOY.md).

```bash
fly secrets set AUTHORFORGE_SESSION_SECRET=... ANTHROPIC_API_KEY=... AUTHORFORGE_PUBLIC_HOST=...
fly deploy
```

## Security

See [SECURITY.md](./SECURITY.md). Specs use ⚠ `verified_note`. No Amazon scraping or upload automation.

## Commands

| Script | Purpose |
|--------|---------|
| `npm run authorforge:dev` | Studio + API |
| `npm run authorforge:test` | Unit/integration tests |
| `npm run authorforge:dev:api` | API only |
| `npm run authorforge:dev:web` | Web only |

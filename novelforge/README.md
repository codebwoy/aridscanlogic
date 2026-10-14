# NovelForge

Desktop-only AI **adult fiction** co-author for novels and novellas (romance, thriller, contemporary, literary) with a culturally specific diaspora lane. Guided wizard, continuity checks, KDP-oriented export. **Not** for non-fiction (→ **AuthorForge**) or children’s picture books (→ **StoryForge**).

> Not affiliated with or endorsed by Amazon.

## Architecture

| Package | Role |
|---------|------|
| `packages/shared` | Desktop gate, credits, fiction wizard, niches, `UNIVERSAL_FICTION_RULES` |
| `packages/llm` | `LLMProvider` (fake + Anthropic) — NovelForge owns the gateway |
| `packages/agents` | Premise / cast / plot / outline / writer / continuity agents |
| `packages/export` | Interior PDF, cover wrap, EPUB3, DOCX, KDP ZIP |
| `packages/market` | Mock comps (no Amazon scrape) |
| `apps/api` | Desktop sessions, credits, books, jobs (:8789) |
| `apps/web` | Wizard studio (:5182) |
| `apps/worker` | Optional BullMQ consumer |

**Mobile users never edit here.** Mutating API routes require an HMAC desktop session (`viewportWidth ≥ 1024`).

## Quick start

```bash
# From repo root
npm run novelforge:install
npm run novelforge:dev       # API :8789 + web :5182
```

Open **http://127.0.0.1:5182/?view=studio#studio** (viewport ≥1024px).

From ScanLogic (with `VITE_NOVELFORGE_URL=http://127.0.0.1:5182` in root `.env`):
Amazon Hub → **Open NovelForge**.

### Primary manuscript language

Users choose the novel language up front (`en` / `de` / `es` / `fr` / `it` / `nl`) plus a variety
where relevant (e.g. US vs UK English, LatAm vs Spain Spanish). Culture/tone profiles live in
`packages/shared/src/book-languages.js` and are injected into every writing agent. See
`.cursor/rules/22-book-languages.mdc`.

### Launch readiness (Publish step)

Interactive checklist before Amazon: manuscript quality, KDP account, studio setup, after-export
upload, strategy disclaimer. Canonical: `LAUNCH_READINESS` in `publishing-specs.js`. See
`.cursor/rules/23-launch-readiness.mdc`. Export still does **not** upload to Amazon.

Default LLM is **fake** (offline fixtures). For live Anthropic:

```bash
# novelforge/.env
NOVELFORGE_LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...   # never VITE_*
```

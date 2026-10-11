# StoryForge

Desktop-only AI children’s book studio with a KDP-oriented print pipeline. Sibling product to **ScanLogic Business Suite** — launched from BizStart → Amazon Business Hub on wide viewports only.

> Not affiliated with or endorsed by Amazon.

## Architecture

| Package | Role |
|---------|------|
| `packages/shared` | Publishing specs, print math, credits, Launchpad seed, disclosure, desktop constants |
| `apps/api` | Secure HTTP API: desktop sessions, credits ledger, jobs, mock image provider, PDF export |
| `apps/worker` | BullMQ consumer when `REDIS_URL` is set (else API runs jobs in-process) |
| `apps/web` | Desktop studio + Launchpad UI (Vite + React + Konva) |

**Mobile users never edit here.** API mutating routes require an HMAC desktop session issued only when `viewportWidth ≥ 1024`.

## Quick start (operational)

```bash
# From repo root (or cd storyforge)
npm run storyforge:install   # once
npm run storyforge:dev       # API :8787 + web :5180 together
```

Open **http://127.0.0.1:5180/?view=studio#studio** (viewport ≥1024px).

Or from ScanLogic (with `VITE_STORYFORGE_URL=http://127.0.0.1:5180` in root `.env`):
Amazon Hub → **Open StoryForge**.

**First-session loop (mock, no paid API):**
1. Create project → Character Turbo → Approve/pin  
2. Editor Pro → generate a few pages  
3. Canvas → 2.5× upscale (optional) → **Finish pack** (interior + cover wrap)  
4. Low credits? Studio sidebar → **+100 local credits**

Projects/credits persist in `storyforge/.data/` (disable with `STORYFORGE_PERSIST=0`).

```bash
cd storyforge
cp .env.example .env   # if missing
npm install
npm run test
npm run dev:studio     # same as npm run storyforge:dev from root
```

Optional: `npm run dev:worker` with Redis. Real AI: set `STORYFORGE_IMAGE_PROVIDER=replicate` + `REPLICATE_API_TOKEN`.

## Demo path (mock)

1. Open `http://127.0.0.1:5180` on a ≥1024px viewport  
2. Create a 24-page project → Character Turbo → Approve (anchor pins)  
3. Editor Pro generate a page → consistency badge  
4. Canvas → Preflight → Export interior PDF  
5. Launchpad → Course / Guides / Disclosure / Admin ⚠ config  

## What ships (Phase 1 + Launchpad Part A)

- Desktop gate (client + API) + 20 trial credits (append-only ledger)
- Character Turbo + pin anchor; Editor Pro from anchor; Story Scene Pro stub; Photo to Cartoon consent
- **Bilingual mode** — selectable primary + secondary language pairs (ES/FR/IT/DE/EN + Twi/Igbo/Swahili/Arabic/…), per-page dual text, stacked / side-by-side / alternating layouts, L2 verified flag
- **IP Character Builder** — merch-ready DNA gate (name suggestions + coach, one colour/trait/object, silhouette + Merch checks) must lock before Character Turbo
- **Series DNA reuse**, escalating picture-book **beat seeding**, and **Merch PNG** export from pinned hero (manual Amazon Merch upload)
- Print math preflight (blocks under-res); interior PDF via `pdf-lib`
- Launchpad: Tutorials (Neolemon catalogue → StoryForge paths), Craft (Compass / DNA / styles / 7-day / continuity), Guides, Course (format table + Koala notes), Prompt Library, Disclosure Helper, Books slots, Admin config, S1–S52 traceability
- Amazon Hub launch button in ScanLogic

## Real AI gens + 2.5× print upscale

**Connect one of these APIs** (server-only keys in `storyforge/.env`):

| Priority | Provider | Env | Get key | Models used |
|----------|----------|-----|---------|-------------|
| **1 — recommended** | [Replicate](https://replicate.com) | `STORYFORGE_IMAGE_PROVIDER=replicate` + `REPLICATE_API_TOKEN` | [API tokens](https://replicate.com/account/api-tokens) | Gen: `black-forest-labs/flux-schnell` · Scene consistency: `black-forest-labs/flux-redux-dev` · Upscale: `nightmareai/real-esrgan` → sharp to **2.5×** / KDP bleed px |
| 2 — fal (images + video) | [fal.ai](https://fal.ai/docs/documentation) | `STORYFORGE_IMAGE_PROVIDER=fal` + `FAL_KEY` | [Dashboard keys](https://fal.ai/dashboard/keys) | Full catalogue in Studio pickers. Defaults: Gen `flux/schnell` · Editor **Kontext Pro** · Video **Kling v3 Pro i2v** · Upscale Clarity. Also Nano Banana 2, FLUX.2, Veo 3.1, Seedance, Kling Standard/Pro T2V |

```bash
cd storyforge
cp .env.example .env
# paste REPLICATE_API_TOKEN, then:
# STORYFORGE_IMAGE_PROVIDER=replicate
npm run dev:api
```

Studio → Canvas shows provider status. After a scene: **2.5× print upscale** (job `upscale_print`, 2 credits). `GET /health` includes `image.ready`.

Default remains `mock` (no network, SVG placeholders) for tests.

## Print pipeline (finish flow)

Studio → **Canvas**:

1. **2.5× print upscale** per page  
2. **Export interior** / **Export cover wrap** (print-ready PDFs, HMAC signed download URLs under `/v1/exports/:id?token=…`)  
3. **Finish pack / KDP ZIP** (`export_source_zip`) — interior + cover + `preflight.json` + checklist + manuscript  

Always verify in the Amazon KDP Previewer before upload.

- Single PDF: **BACK | SPINE | FRONT** at KDP wrap size from `coverWrapLayout` (trim + bleed + spine)
- Front art from pinned Character Turbo hero (or page 1 asset)
- Barcode reserve box on the back; spine text only when page count ≥ 80
- Job: `export_cover_pdf` (3 credits) — always re-check in the Amazon KDP cover calculator / Previewer

## Part B / Phase 2 — not built

Market-data providers, royalty calculator, Stripe live checkout, Redis-required multi-instance.

## Production (hybrid)

Deploy API + SPA as one Fly/Railway container; point ScanLogic `VITE_STORYFORGE_URL` at that host.  
See [authorforge/docs/HYBRID_DEPLOY.md](../authorforge/docs/HYBRID_DEPLOY.md).

```bash
cd storyforge && fly secrets set STORYFORGE_SESSION_SECRET=... STORYFORGE_PUBLIC_HOST=...
fly deploy
```

## Security

See [SECURITY.md](./SECURITY.md). Specs live in `@storyforge/shared` with `lastVerified`. No Amazon scraping.

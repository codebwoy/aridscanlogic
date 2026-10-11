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

## Quick start

```bash
cd storyforge
cp .env.example .env
# set STORYFORGE_SESSION_SECRET=$(openssl rand -base64 48)
npm install
npm run test
npm run build
npm run dev:api    # http://127.0.0.1:8787
npm run dev:web    # http://127.0.0.1:5180  (proxies /v1 → API)
```

Optional: `npm run dev:worker` with Redis.

In ScanLogic `.env`:

```bash
VITE_STORYFORGE_URL=http://127.0.0.1:5180
```

## Demo path (mock)

1. Open `http://127.0.0.1:5180` on a ≥1024px viewport  
2. Create a 24-page project → Character Turbo → Approve (anchor pins)  
3. Editor Pro generate a page → consistency badge  
4. Canvas → Preflight → Export interior PDF  
5. Launchpad → Course / Guides / Disclosure / Admin ⚠ config  

## What ships (Phase 1 + Launchpad Part A)

- Desktop gate (client + API) + 20 trial credits (append-only ledger)
- Character Turbo + pin anchor; Editor Pro from anchor; Story Scene Pro stub; Photo to Cartoon consent
- Print math preflight (blocks under-res); interior PDF via `pdf-lib`
- Launchpad: Guides, Course (format table + Koala notes), Prompt Library, Disclosure Helper, Books slots, Admin config, S1–S32 traceability
- Amazon Hub launch button in ScanLogic

## Part B / Phase 2 — not built

Market-data providers, royalty calculator, Stripe live checkout, cover wrap PDF, Redis-required multi-instance, real Replicate/fal providers.

## Security

See [SECURITY.md](./SECURITY.md). Specs live in `@storyforge/shared` with `lastVerified`. No Amazon scraping.

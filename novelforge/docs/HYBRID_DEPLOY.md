# Hybrid production deploy — NovelForge + StoryForge

ScanLogic stays on **Vercel**. NovelForge and StoryForge run as **containers** so long book/image jobs are not capped at Vercel’s 60s serverless limit.

**Active path: Oracle Cloud Always Free** (`deploy/oracle/`).  
**Standby: Fly.io** (`novelforge/fly.toml`, `storyforge/fly.toml`) — keep for when you switch to Pay-as-You-Go. Do not delete Fly configs.

```
ScanLogic (Vercel) ──VITE_NOVELFORGE_URL──► NovelForge (Oracle ★ active)
                   ──VITE_STORYFORGE_URL───► StoryForge (Oracle ★ active)
                                              └── Fly *.fly.dev kept as standby
```

Each studio container serves **API + built SPA** on one origin (`/health`, `/v1/*`, `/`).

---

## 1. Oracle (active) — quick start

Step-by-step VM bootstrap, DNS, compose, and secrets:

**→ [deploy/oracle/README.md](../../deploy/oracle/README.md)**

```bash
# On the OCI VM (repo checked out):
cd deploy/oracle
cp .env.example .env   # set hosts, secrets, ANTHROPIC_API_KEY, WEB_ORIGIN
docker compose up -d --build
curl -sS "https://$NOVELFORGE_HOST/health"
curl -sS "https://$STORYFORGE_HOST/health"
```

**Persistent volumes required.** NovelForge and StoryForge write `/data/state.json`. Compose mounts named volumes; without them, restarts wipe books/projects.

**Single process per studio.** Do not scale to multiple replicas of the same API — in-memory + file state would split.

---

## 2. Wire ScanLogic (Vercel) — Oracle active

Vercel → Project → Settings → Environment Variables → **Production**:

| Variable | Example (Oracle) |
|----------|------------------|
| `VITE_NOVELFORGE_URL` | `https://novelforge.example.com` |
| `VITE_STORYFORGE_URL` | `https://storyforge.example.com` |

Redeploy ScanLogic so the client bundle picks up the URLs.

Amazon Hub → **Open NovelForge** / **Open StoryForge** will probe `/health` on those hosts and open the studio (desktop ≥1024px).

---

## 3. Required secrets checklist

### NovelForge
- `NOVELFORGE_SESSION_SECRET` (≥32 chars) — **required** in production  
- `ANTHROPIC_API_KEY` + `NOVELFORGE_LLM_PROVIDER=anthropic`  
- `NOVELFORGE_PUBLIC_HOST` — hostname only (no `https://`)  
- `NOVELFORGE_WEB_ORIGIN` — comma-separated: studio URL + ScanLogic production URLs  

### StoryForge
- `STORYFORGE_SESSION_SECRET` (≥32 chars)  
- `STORYFORGE_PUBLIC_HOST`  
- `STORYFORGE_WEB_ORIGIN` — studio + ScanLogic  
- Image provider keys if not `mock`  

Never put secrets in `VITE_*`. On Oracle they live in `deploy/oracle/.env`. On Fly: `fly secrets`.

---

## 4. Fly.io (standby — switch back when ready to pay)

Configs stay in-repo. Trial is short (7 days or ~2h machine runtime); prefer Oracle until you add a card.

### 4a. NovelForge on Fly

**Single machine + volume required.**

```bash
fly scale count 1 -a scanlogic-novelforge
fly volumes create novelforge_data --region fra --size 1 -a scanlogic-novelforge   # once
```

```bash
cd novelforge
fly auth login
fly apps create scanlogic-novelforge   # once; or edit fly.toml app name
fly secrets set \
  NOVELFORGE_SESSION_SECRET="$(openssl rand -base64 48)" \
  NOVELFORGE_LLM_PROVIDER=anthropic \
  ANTHROPIC_API_KEY="sk-ant-..." \
  NOVELFORGE_PUBLIC_HOST="scanlogic-novelforge.fly.dev" \
  NOVELFORGE_WEB_ORIGIN="https://scanlogic-novelforge.fly.dev,https://aridscanlogic.cycroommedia.com,https://aridscanlogic-tau.vercel.app"
fly deploy
```

```bash
curl -sS https://scanlogic-novelforge.fly.dev/health
```

### 4b. StoryForge on Fly

```bash
cd storyforge
fly apps create scanlogic-storyforge
fly secrets set \
  STORYFORGE_SESSION_SECRET="$(openssl rand -base64 48)" \
  STORYFORGE_PUBLIC_HOST="scanlogic-storyforge.fly.dev" \
  STORYFORGE_WEB_ORIGIN="https://scanlogic-storyforge.fly.dev,https://aridscanlogic.cycroommedia.com,https://aridscanlogic-tau.vercel.app" \
  STORYFORGE_IMAGE_PROVIDER=replicate \
  REPLICATE_API_TOKEN="r8_..."   # optional; mock works without
fly deploy
```

Optional volume (recommended if using Fly as primary):

```bash
fly volumes create storyforge_data --region fra --size 1 -a scanlogic-storyforge
# then add [mounts] in storyforge/fly.toml matching novelforge (destination = "/data")
```

### 4c. Flip ScanLogic from Oracle → Fly

| Variable | Fly value |
|----------|-----------|
| `VITE_NOVELFORGE_URL` | `https://scanlogic-novelforge.fly.dev` |
| `VITE_STORYFORGE_URL` | `https://scanlogic-storyforge.fly.dev` |

Redeploy ScanLogic. Optionally `docker compose down` on the OCI VM (volumes keep data if you return).

Cost rail while Fly is idle: see `.cursor/rules/20-hybrid-fly-cost.mdc` — do not wake `*.fly.dev` unless deploying or testing the switch.

---

## 5. Railway / Render alternative

Use the same `Dockerfile` in each folder:

- Set `PORT=8080` (already default in Docker)  
- Same secrets as Fly / Oracle  
- Health check path: `/health`  
- **Prefer a paid plan with a persistent disk** if you need NovelForge state (Render free has no disk).

---

## 6. Local hybrid simulation

```bash
cd novelforge && npm run build -w @novelforge/web
NODE_ENV=production NOVELFORGE_SERVE_STATIC=1 NOVELFORGE_API_PORT=8789 \
  NOVELFORGE_LLM_PROVIDER=fake npm run start -w @novelforge/api
# open http://127.0.0.1:8789/?view=studio
```

---

## Why not Vercel-only for the studios?

Book/image jobs exceed serverless duration. Hybrid keeps ScanLogic on Vercel and studios on a process that can run durable jobs.

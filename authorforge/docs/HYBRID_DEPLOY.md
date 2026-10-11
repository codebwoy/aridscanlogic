# Hybrid production deploy — AuthorForge + StoryForge

ScanLogic stays on **Vercel**. AuthorForge and StoryForge run as **always-on (or auto-start) containers** (Fly.io recommended) so long book/image jobs are not capped at Vercel’s 60s serverless limit.

```
ScanLogic (Vercel) ──VITE_AUTHORFORGE_URL──► AuthorForge (Fly)
                   ──VITE_STORYFORGE_URL───► StoryForge (Fly)
```

Each studio container serves **API + built SPA** on one origin (`/health`, `/v1/*`, `/`).

---

## 1. AuthorForge on Fly

```bash
cd authorforge
fly auth login
fly apps create scanlogic-authorforge   # once; or edit fly.toml app name
fly secrets set \
  AUTHORFORGE_SESSION_SECRET="$(openssl rand -base64 48)" \
  AUTHORFORGE_LLM_PROVIDER=anthropic \
  ANTHROPIC_API_KEY="sk-ant-..." \
  AUTHORFORGE_PUBLIC_HOST="scanlogic-authorforge.fly.dev" \
  AUTHORFORGE_WEB_ORIGIN="https://scanlogic-authorforge.fly.dev,https://aridscanlogic.cycroommedia.com,https://aridscanlogic-tau.vercel.app"
fly deploy
```

Smoke:

```bash
curl -sS https://scanlogic-authorforge.fly.dev/health
# expect { "ok": true, "hybrid": true, "llm": { "id": "anthropic", ... } }
```

Open studio: `https://scanlogic-authorforge.fly.dev/?view=studio`

---

## 2. StoryForge on Fly

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

---

## 3. Wire ScanLogic (Vercel)

Vercel → Project → Settings → Environment Variables → **Production**:

| Variable | Example |
|----------|---------|
| `VITE_AUTHORFORGE_URL` | `https://scanlogic-authorforge.fly.dev` |
| `VITE_STORYFORGE_URL` | `https://scanlogic-storyforge.fly.dev` |

Redeploy ScanLogic so the client bundle picks up the URLs.

Amazon Hub → **Open AuthorForge** / **Open StoryForge** will probe `/health` on those hosts and open the studio (desktop ≥1024px).

---

## 4. Required secrets checklist

### AuthorForge
- `AUTHORFORGE_SESSION_SECRET` (≥32 chars) — **required** in production  
- `ANTHROPIC_API_KEY` + `AUTHORFORGE_LLM_PROVIDER=anthropic`  
- `AUTHORFORGE_PUBLIC_HOST` — hostname only (no `https://`)  
- `AUTHORFORGE_WEB_ORIGIN` — comma-separated: studio URL + ScanLogic production URLs  

### StoryForge
- `STORYFORGE_SESSION_SECRET` (≥32 chars)  
- `STORYFORGE_PUBLIC_HOST`  
- `STORYFORGE_WEB_ORIGIN` — studio + ScanLogic  
- Image provider keys if not `mock`  

Never put secrets in `VITE_*`.

---

## 5. Railway / Render alternative

Use the same `Dockerfile` in each folder:

- Set `PORT=8080` (already default in Docker)  
- Same secrets as Fly  
- Health check path: `/health`  

---

## 6. Local hybrid simulation

```bash
cd authorforge && npm run build -w @authorforge/web
NODE_ENV=production AUTHORFORGE_SERVE_STATIC=1 AUTHORFORGE_API_PORT=8788 \
  AUTHORFORGE_LLM_PROVIDER=fake npm run start -w @authorforge/api
# open http://127.0.0.1:8788/?view=studio
```

---

## Why not Vercel-only for the studios?

Book/image jobs exceed serverless duration. Hybrid keeps ScanLogic on Vercel and studios on a process that can run durable jobs.

# GitHub Pages deploy

Live URL: **https://codebwoy.github.io/aridscanlogic/**

## How it works

On every push to `main`, [Deploy GitHub Pages](https://github.com/codebwoy/aridscanlogic/actions/workflows/deploy-github-pages.yml):

1. Builds the Vite app with `VITE_BASE_PATH=/aridscanlogic/`
2. Pushes `dist/` to the **`gh-pages`** branch (peaceiris)

## One-time setup (required if the site is 404)

GitHub does **not** allow `GITHUB_TOKEN` to enable Pages on the **first** deploy (especially on template repos). You must do this **once** in the browser:

1. [Pages settings](https://github.com/codebwoy/aridscanlogic/settings/pages)
2. **Build and deployment** → **Source:** **Deploy from a branch**
3. Branch: **`gh-pages`** → Folder: **`/ (root)`** → **Save**
4. Wait ~1 minute, then open https://codebwoy.github.io/aridscanlogic/

Also ensure [Actions permissions](https://github.com/codebwoy/aridscanlogic/settings/actions) → **Read and write permissions**.

### Or from your machine

```bash
gh auth login
./scripts/enable-github-pages.sh
```

## Old failed deployments

Red **github-pages** entries from June 2026 (*"Add SEO, structured data…"*) are from an **obsolete** `deploy-pages` workflow that ran **before** Pages was enabled. Safe to ignore. After the one-time setup above, new deploys go live from `gh-pages`.

## Manual redeploy

[Actions → Deploy GitHub Pages → Run workflow](https://github.com/codebwoy/aridscanlogic/actions/workflows/deploy-github-pages.yml)

## Vercel (Production on `main` only)

**Project:** [codebwoys-projects/aridscanlogic](https://vercel.com/codebwoys-projects/aridscanlogic)  
**URL:** https://aridscanlogic-tau.vercel.app

| Setting | Value |
|---|---|
| Production branch | `main` |
| Framework preset | Other |
| Install command | `npm install` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Ignored build step | skip when branch is `gh-pages` |

The **`gh-pages`** branch is **GitHub Pages only** — Vercel must not build it.

| Layer | What it does |
|---|---|
| `vercel.json` on **`main`** | Skips `gh-pages` on your project (`codebwoys-projects`) |
| `vercel.json` on **`gh-pages`** | `ignoreCommand: exit 1` — any Vercel project linked to this repo skips that branch |
| Vercel dashboard (your project) | Ignored build step when branch is `gh-pages` |

### Red “Build Failed” on `aberlinda95-9315's projects`

That is a **separate Vercel account** still connected to this repo. After the next GitHub Pages deploy, its `gh-pages` builds should **cancel/skip** instead of running `vite build`. If failures continue, the owner of that team must **disconnect** the repo under **Settings → Git** (you cannot fix it from `codebwoys-projects`).

## Vercel cron / keep-alive

**Working URL (use this in cron-job.org):**

`https://aridscanlogic.cycroommedia.com/api/cron/keep-alive`

Header: `Authorization: Bearer <CRON_SECRET>`

A successful response must include `"method": "rest-scanlogic_records"` and `"attempts"` — that confirms a real DB query ran. Example:

```json
{"success":true,"message":"Database keep-alive ping successful — Supabase kept active","attempts":1,"method":"rest-scanlogic_records"}
```

### Live AI (Lawyer AI / Claude)

| Variable | Where |
|---|---|
| `ANTHROPIC_API_KEY` | Vercel → Project → Settings → Environment Variables (Production) |
| `ANTHROPIC_MODEL` | Optional — default is now `claude-sonnet-4-6` |

As of **2026-06-15**, Anthropic retired `claude-sonnet-4-20250514`. If Live AI fails or `/api/llm` returns 404/502, remove the old `ANTHROPIC_MODEL` on Vercel or set `claude-sonnet-4-6`, then **Redeploy**.

**Custom domain:** use `https://aridscanlogic.cycroommedia.com` (double **c** in cycroommedia). `cyroommedia.com` is not configured.

GitHub Pages is **static only** — no `/api/llm`. Use Vercel for Live AI.

### Stale deployment on `aridscanlogic-tau.vercel.app`

This repo is linked to **two** Vercel projects. After pushes to `main`, only one may auto-deploy:

| URL | Status |
|---|---|
| `https://aridscanlogic.cycroommedia.com` | **Current** — has latest keep-alive code + Supabase env vars |
| `https://aridscanlogic-tau.vercel.app` | **Stale** — may still return the old JSON without `method` / `attempts` |

If cron-job.org points at `aridscanlogic-tau.vercel.app`, update the job URL to `aridscanlogic.cycroommedia.com` (above), or redeploy [codebwoys-projects/aridscanlogic](https://vercel.com/codebwoys-projects/aridscanlogic) from the Vercel dashboard.

### GitHub Actions backup (optional)

You may have **three** keep-alive schedulers:

| Scheduler | Status if misconfigured |
|-----------|-------------------------|
| **cron-job.org** | You configure URL + `Authorization: Bearer <CRON_SECRET>` — your manual test (200 OK) means this works. |
| **Vercel Cron** (`vercel.json`) | Needs `CRON_SECRET` on Vercel; Vercel sends the Bearer header automatically. |
| **GitHub Actions** | Needs `CRON_SECRET` in **GitHub → Settings → Secrets → Actions** (not the same as Vercel env). |

**Failure emails from GitHub** (`Add CRON_SECRET to GitHub repo secrets`) mean the Actions backup is not configured. Your app and Supabase are still fine if cron-job.org or Vercel Cron succeeds.

The workflow **skips** (no failure email) when `CRON_SECRET` is missing from GitHub.

To enable the GitHub backup (same secret as Vercel):

```bash
gh auth login
./scripts/enable-github-keep-alive.sh
```

Or paste `CRON_SECRET` manually under [repo Actions secrets](https://github.com/codebwoy/aridscanlogic/settings/secrets/actions).

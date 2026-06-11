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

## Vercel cron / keep-alive

**Working URL (use this in cron-job.org):**

`https://aridscanlogic-tau.vercel.app/api/cron/keep-alive`

Header: `Authorization: Bearer <CRON_SECRET>`

### Why `aridscanlogic.cycroommedia.com` returns 500

That domain is attached to a **different Vercel team** (`aberlinda95-9315's projects`), not `codebwoy's projects/aridscanlogic`. That deployment has `CRON_SECRET` but is **missing** `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

**Fix option A (recommended):** Point cron-job.org at `aridscanlogic-tau.vercel.app` (above).

**Fix option B:** In Vercel, open the project that owns `aridscanlogic.cycroommedia.com` → **Settings → Environment Variables** → add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `CRON_SECRET` (Production) → **Redeploy**.

**Fix option C:** Remove the domain from the other team’s project, then add it to [codebwoys-projects/aridscanlogic](https://vercel.com/codebwoys-projects/aridscanlogic).

### GitHub Actions backup

[Supabase Keep-Alive](https://github.com/codebwoy/aridscanlogic/actions/workflows/supabase-keep-alive.yml) runs daily if you add `CRON_SECRET` to **GitHub → Settings → Secrets → Actions**.

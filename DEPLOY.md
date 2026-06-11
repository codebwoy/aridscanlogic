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

# GitHub Pages deploy

Live URL: **https://codebwoy.github.io/aridscanlogic/**

## How it works

On every push to `main`, [Deploy GitHub Pages](https://github.com/codebwoy/aridscanlogic/actions/workflows/deploy-github-pages.yml):

1. Builds the Vite app with `VITE_BASE_PATH=/aridscanlogic/`
2. Pushes `dist/` to the **`gh-pages`** branch (peaceiris backup)
3. Enables GitHub Pages via API if needed (`workflow` source preferred)
4. Deploys via **`actions/deploy-pages@v4`** to the `github-pages` environment

## One-time setup (if the site is 404)

1. **Workflow permissions**  
   [Actions settings](https://github.com/codebwoy/aridscanlogic/settings/actions) → **General** → **Workflow permissions** → **Read and write permissions** → Save

2. **Enable Pages** (only if CI cannot enable via API)  
   [Pages settings](https://github.com/codebwoy/aridscanlogic/settings/pages)  
   - **Source:** **GitHub Actions** (preferred)  
   - Or **Deploy from a branch** → **`gh-pages`** → **`/ (root)`**

3. **Or from your machine** (with `gh auth login`):

   ```bash
   ./scripts/enable-github-pages.sh
   ```

## Old failed deployments

Red **github-pages** entries from June 2026 with commit *"Add SEO, structured data…"* are from an **obsolete** `deploy-pages` workflow that ran **before** Pages was enabled on the repo. They are safe to ignore. New successful runs will show green once Pages is enabled.

## Manual redeploy

[Actions → Deploy GitHub Pages → Run workflow](https://github.com/codebwoy/aridscanlogic/actions/workflows/deploy-github-pages.yml)

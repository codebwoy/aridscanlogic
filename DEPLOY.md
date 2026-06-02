# GitHub Pages deploy

## Error: `deploy-pages@v4` → 404 Not Found

**Root cause:** GitHub Pages is not enabled for this repository (or not set to **GitHub Actions**).

### Fix

1. Open **[Pages settings](https://github.com/codebwoy/aridscanlogic/settings/pages)**
2. Under **Build and deployment**, choose **GitHub Actions**
3. Click **Save**
4. **Settings → Actions → General → Workflow permissions** → **Read and write permissions**
5. Run the latest workflow (not obsolete **#1**):
   - [Deploy GitHub Pages → Run workflow](https://github.com/codebwoy/aridscanlogic/actions/workflows/deploy-github-pages.yml)

The workflow uses `configure-pages@v5` with `enablement: true` to try enabling Pages automatically; if deploy still 404s, complete step 1–2 manually.

### Do not re-run workflow #1

Run **#1** (commit `bd95397`) always replays the old workflow and fails. Use the **latest** run after push to `main`.

## Fallback (branch deploy)

If Actions deploy keeps failing: run **[Setup GitHub Pages (run once)](https://github.com/codebwoy/aridscanlogic/actions/workflows/setup-github-pages.yml)**, then set Pages source to **Deploy from a branch** → `gh-pages` → `/ (root)`.

## Live URL

**https://codebwoy.github.io/aridscanlogic/**

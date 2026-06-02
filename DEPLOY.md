# GitHub Pages deploy

## Error: `actions/deploy-pages@v4` → 404 Not Found

That step is **removed** from the current workflow. If you still see it, you are on an **old workflow run** (often **#1**, commit `bd95397`).

| Log shows | Action |
|-----------|--------|
| `Run actions/deploy-pages@v4` | **Stop.** Do not re-run that job. |
| `Push to gh-pages branch` | **Correct** workflow — use the latest run. |

## One-time setup (required)

1. Run workflow: [Actions → **Deploy GitHub Pages** → Run workflow](https://github.com/codebwoy/aridscanlogic/actions/workflows/deploy-github-pages.yml)  
   (or push to `main` and wait for green ✓)

2. Open **[Pages settings](https://github.com/codebwoy/aridscanlogic/settings/pages)**  
   - **Build and deployment:** Deploy from a branch  
   - **Branch:** `gh-pages`  
   - **Folder:** `/ (root)`  
   - **Save**

3. Open **https://codebwoy.github.io/aridscanlogic/** (may take 1–2 minutes)

## Repo settings check

**Settings → Actions → General → Workflow permissions** → **Read and write permissions** (so the workflow can push to `gh-pages`).

## Alternative one-shot

[Actions → **Setup GitHub Pages (run once)** → Run workflow](https://github.com/codebwoy/aridscanlogic/actions/workflows/setup-github-pages.yml)

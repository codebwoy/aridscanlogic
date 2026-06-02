# GitHub Pages deploy

## Error: `configure-pages` — "Resource not accessible by integration"

The workflow **cannot** enable Pages via the API (GitHub blocks that for `GITHUB_TOKEN`).  
The deploy workflow now **only pushes to the `gh-pages` branch** — no `configure-pages` or `deploy-pages`.

## Fix (one time, ~1 minute)

1. **Workflow permissions**  
   [Actions settings](https://github.com/codebwoy/aridscanlogic/settings/actions) → **General** → **Workflow permissions** → **Read and write permissions** → Save

2. **Run deploy**  
   [Deploy GitHub Pages](https://github.com/codebwoy/aridscanlogic/actions/workflows/deploy-github-pages.yml) → wait for green ✓ (step: **Publish to gh-pages branch**)

3. **Enable Pages**  
   [Pages settings](https://github.com/codebwoy/aridscanlogic/settings/pages)  
   - **Deploy from a branch**  
   - Branch: **`gh-pages`**  
   - Folder: **`/ (root)`**  
   - **Save**

4. **Open site**  
   https://codebwoy.github.io/aridscanlogic/

## Old errors (ignore)

| Error | Meaning |
|-------|---------|
| `deploy-pages@v4` 404 | Obsolete workflow **#1** — do not re-run |
| `configure-pages` enablement failed | Fixed — that step was removed |

## Live URL

**https://codebwoy.github.io/aridscanlogic/**

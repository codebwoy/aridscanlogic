# GitHub Pages deploy

Live URL: **https://codebwoy.github.io/aridscanlogic/**

## How it works

On every push to `main`, [Deploy GitHub Pages](https://github.com/codebwoy/aridscanlogic/actions/workflows/deploy-github-pages.yml):

1. Builds the Vite app with `VITE_BASE_PATH=/aridscanlogic/`
2. Pushes `dist/` to the **`gh-pages`** branch (peaceiris)
3. Tries to set Pages source to **`gh-pages` / (root)** via the GitHub API

## One-time setup (if the site is 404)

1. **Workflow permissions**  
   [Actions settings](https://github.com/codebwoy/aridscanlogic/settings/actions) → **General** → **Workflow permissions** → **Read and write permissions** → Save

2. **Enable Pages** (only if step 3 in CI did not succeed)  
   [Pages settings](https://github.com/codebwoy/aridscanlogic/settings/pages)  
   - **Deploy from a branch**  
   - Branch: **`gh-pages`**  
   - Folder: **`/ (root)`**  
   - **Save**

3. **Or from your machine** (with `gh auth login`):

   ```bash
   ./scripts/enable-github-pages.sh
   ```

## Old errors (ignore)

| What you see | Meaning |
|--------------|---------|
| Red **github-pages** environment deployments from “Deploy GitHub Pages **#1**” | Obsolete `deploy-pages@v4` runs — not used anymore |
| `.github/workflows/enable-pages-settings.yml` failed | Removed — invalid workflow permissions caused a failed check on every push |

## Manual redeploy

[Actions → Deploy GitHub Pages → Run workflow](https://github.com/codebwoy/aridscanlogic/actions/workflows/deploy-github-pages.yml)

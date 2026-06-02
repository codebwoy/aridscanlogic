# Deploy / GitHub Pages

## Failed run with `deploy-pages@v4` and 404?

### If it is workflow **#1** (commit `bd95397`)

**Do not click "Re-run jobs".** That run uses an old workflow file and will always fail.

Open the **latest** **Deploy GitHub Pages** run instead (higher run number).

### If the **latest** run still shows 404

GitHub Pages is not enabled for this repo. Fix in settings:

1. Open **[Pages settings](https://github.com/codebwoy/aridscanlogic/settings/pages)**
2. **Build and deployment** → **Source: GitHub Actions** (not “Deploy from a branch”)
3. Save
4. Re-run only the **latest** workflow (or push an empty commit)

Also check: **Settings → Actions → General → Workflow permissions** → **Read and write permissions**.

## One-click setup (alternative: gh-pages branch)

1. [Actions](https://github.com/codebwoy/aridscanlogic/actions) → **Setup GitHub Pages (run once)** → **Run workflow**
2. Settings → Pages → **Deploy from a branch** → `gh-pages` → `/ (root)`

## Live URL

**https://codebwoy.github.io/aridscanlogic/**

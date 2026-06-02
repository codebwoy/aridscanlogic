# Deploy / GitHub Pages

## You are seeing `deploy-pages@v4` failed — workflow #1

That run is **obsolete**. It is from commit `bd95397` and uses `actions/deploy-pages`, which returns **404** until GitHub Pages is configured.

**Do not click "Re-run jobs" on that run** — it will fail again every time.

## Fix in 2 minutes

### Option A — One-click (recommended)

1. Open [Actions](https://github.com/codebwoy/aridscanlogic/actions)
2. Click **Setup GitHub Pages (run once)** in the left sidebar
3. Click **Run workflow** → **Run workflow**
4. Wait for green checkmark
5. Open **https://codebwoy.github.io/aridscanlogic/**

### Option B — Manual settings

1. Open [Pages settings](https://github.com/codebwoy/aridscanlogic/settings/pages)
2. **Build and deployment** → **Deploy from a branch**
3. Branch: **`gh-pages`** / Folder: **`/ (root)`** → **Save**
4. Use the latest **Publish Site to GitHub Pages** workflow run (not #1)

## Ongoing deploys

Every push to `main` runs **Publish Site to GitHub Pages** (peaceiris → `gh-pages` branch).

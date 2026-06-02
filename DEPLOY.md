# Deploy / GitHub Pages

## You are seeing `deploy-pages@v4` failed — workflow #1

| What you see | What it means |
|--------------|----------------|
| Step `Run actions/deploy-pages@v4` | **Obsolete** run from commit `bd95397` |
| Step `Deploy to gh-pages` (peaceiris) | **Correct** — use the latest run with this step |

**Never click "Re-run jobs" on workflow #1** — GitHub replays the old broken YAML every time.

Open the latest **Deploy GitHub Pages** run (number **#2 or higher**), or run **Setup GitHub Pages (run once)**.

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
4. Use the latest **Deploy GitHub Pages** workflow run (not #1)

## Ongoing deploys

Every push to `main` runs **Deploy GitHub Pages** (peaceiris → `gh-pages` branch).

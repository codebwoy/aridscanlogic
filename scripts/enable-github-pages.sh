#!/usr/bin/env bash
# Enable GitHub Pages and trigger deploy. Requires GitHub CLI logged in OR GH_TOKEN.
#
#   gh auth login
#   ./scripts/enable-github-pages.sh
#
# Or:
#   GH_TOKEN=ghp_xxx ./scripts/enable-github-pages.sh

set -euo pipefail

REPO="${GITHUB_REPOSITORY:-codebwoy/aridscanlogic}"
SITE_URL="https://codebwoy.github.io/aridscanlogic/"
BODY='{"build_type":"legacy","source":{"branch":"gh-pages","path":"/"}}'

if [[ -n "${GH_TOKEN:-}" ]]; then
  export GH_TOKEN
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "Install GitHub CLI: https://cli.github.com/"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Run: gh auth login"
  exit 1
fi

echo "→ Setting Pages source: gh-pages branch / (root)"
if gh api "repos/${REPO}/pages" &>/dev/null; then
  gh api --method PUT "repos/${REPO}/pages" --input - <<<"$BODY"
else
  gh api --method POST "repos/${REPO}/pages" --input - <<<"$BODY"
fi

echo "→ Triggering Deploy GitHub Pages workflow"
gh workflow run "Deploy GitHub Pages" --repo "$REPO" --ref main

echo ""
echo "Wait ~2 min, then open: $SITE_URL"
echo "Actions: https://github.com/${REPO}/actions"

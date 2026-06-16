#!/usr/bin/env bash
# Copy CRON_SECRET from .env into GitHub Actions secrets (optional backup cron).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${ROOT}/.env"

if ! command -v gh >/dev/null 2>&1; then
  echo "Install GitHub CLI first: https://cli.github.com/"
  echo "Then run: gh auth login"
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE — add CRON_SECRET=... (same value as on Vercel)."
  exit 1
fi

CRON_SECRET="$(grep -E '^CRON_SECRET=' "$ENV_FILE" | head -1 | cut -d= -f2- | tr -d '\r' | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")"

if [ -z "$CRON_SECRET" ]; then
  echo "CRON_SECRET is empty in .env"
  echo "Generate one: openssl rand -base64 32"
  echo "Set it on Vercel (Production) and in .env, then run this script again."
  exit 1
fi

gh secret set CRON_SECRET --body "$CRON_SECRET"

OPTIONAL_URL="$(grep -E '^KEEP_ALIVE_URL=' "$ENV_FILE" | head -1 | cut -d= -f2- | tr -d '\r' | sed -e 's/^"//' -e 's/"$//' || true)"
if [ -n "$OPTIONAL_URL" ]; then
  gh secret set KEEP_ALIVE_URL --body "$OPTIONAL_URL"
  echo "Set KEEP_ALIVE_URL=$OPTIONAL_URL"
fi

echo "GitHub Actions secret CRON_SECRET is set."
echo "Test: gh workflow run supabase-keep-alive.yml"
echo "Or open: https://github.com/codebwoy/aridscanlogic/actions/workflows/supabase-keep-alive.yml"

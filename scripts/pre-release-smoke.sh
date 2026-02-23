#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "SW6 smoke check: start"

if ! command -v rg >/dev/null 2>&1; then
  echo "ERROR: ripgrep (rg) is required for smoke checks."
  exit 1
fi

if [[ -f "dist/index.html" ]]; then
  echo "dist/ exists."
else
  echo "dist/ missing. Run: npm run build"
  exit 1
fi

echo "Checking core files..."
for f in index.html app.js styles.css login.html login.js signup.html signup.js; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: missing required file: $f"
    exit 1
  fi
done

echo "Checking for accidental secret exposure..."
if rg -n --hidden \
  --glob '!dist/**' \
  --glob '!.git/**' \
  --glob '!supabase/**' \
  --glob '!docs/**' \
  --glob '!README.md' \
  --glob '!SECURITY.md' \
  --glob '!scripts/pre-release-smoke.sh' \
  "SUPABASE_SERVICE_ROLE|sk_live|xoxb-|BEGIN PRIVATE KEY|sb_secret_" \
  . >/tmp/sw6_smoke_secrets.txt; then
  echo "ERROR: possible secret material found:"
  cat /tmp/sw6_smoke_secrets.txt
  exit 1
fi

echo "Checking runtime config wiring..."
if ! rg -n "window\\.__SW6_CONFIG__|runtime-config\\.js" app.js index.html >/dev/null; then
  echo "ERROR: runtime config hook not found."
  exit 1
fi

echo "Checking auth pages have Supabase bundle..."
if ! rg -n "@supabase/supabase-js" login.html signup.html >/dev/null; then
  echo "ERROR: Supabase client script missing from login/signup pages."
  exit 1
fi

echo "Checking no unresolved merge markers..."
if rg -n "^(<<<<<<<|=======|>>>>>>>)" . --glob '!dist/**' --glob '!.git/**' >/tmp/sw6_smoke_merge.txt; then
  echo "ERROR: merge conflict markers found:"
  cat /tmp/sw6_smoke_merge.txt
  exit 1
fi

echo "Smoke checks passed."
echo
echo "Manual release checks (required):"
echo "1) Sign up a test account and confirm email link logs in correctly."
echo "2) Sign in existing account and verify redirect returns to intended tab."
echo "3) Submit prediction and confirm immediate 'saved/updated' feedback."
echo "4) Refresh and verify prediction remains saved."
echo "5) Admin publish result for completed fixture."
echo "6) Verify league/global leaderboard points update."
echo "7) Verify collectables appear for users with qualifying predictions."
echo
echo "SW6 smoke check: complete"

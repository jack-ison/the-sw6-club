#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <expected_git_sha_prefix> [domain]"
  echo "Example: $0 0773207 thesw6club.com"
  exit 1
fi

EXPECTED_SHA_PREFIX="$1"
DOMAIN="${2:-thesw6club.com}"
URL="https://${DOMAIN}/build-meta.js"

if ! command -v curl >/dev/null 2>&1; then
  echo "ERROR: curl is required."
  exit 1
fi

if ! command -v sed >/dev/null 2>&1; then
  echo "ERROR: sed is required."
  exit 1
fi

META="$(curl -sS "$URL")"
LIVE_SHA="$(echo "$META" | sed -n 's/.*\"gitSha\":\"\([^\"]*\)\".*/\1/p')"

if [[ -z "$LIVE_SHA" ]]; then
  echo "ERROR: Could not parse gitSha from ${URL}"
  echo "Response:"
  echo "$META"
  exit 1
fi

echo "Live build sha on ${DOMAIN}: ${LIVE_SHA}"
if [[ "$LIVE_SHA" == "${EXPECTED_SHA_PREFIX}"* ]]; then
  echo "OK: Live build matches expected prefix ${EXPECTED_SHA_PREFIX}"
  exit 0
fi

echo "ERROR: Live build does not match expected prefix ${EXPECTED_SHA_PREFIX}"
exit 1

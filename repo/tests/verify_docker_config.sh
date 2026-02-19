#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
echo "[TEST] Verifying docker config in $ROOT_DIR"

REQUIRED_FILES=(
  "$ROOT_DIR/docker-compose.yml"
  "$ROOT_DIR/docker-compose.prod.yml"
  "$ROOT_DIR/.env.example"
)
for f in "${REQUIRED_FILES[@]}"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: Required file missing: $f" >&2
    exit 1
  fi
done

grep -q "^image: agentforge" "$ROOT_DIR/docker-compose.yml" && echo "OK: docker-compose image set to agentforge" || (echo "ERROR: docker-compose.yml missing image agentforge"; exit 1)
grep -q "DISPATCH_ENABLED" "$ROOT_DIR/docker-compose.yml" && echo "OK: DISPATCH_ENABLED present" || (echo "ERROR: DISPATCH_ENABLED missing"; exit 1)
grep -q "DISPATCH_CONTROLLER_URL" "$ROOT_DIR/docker-compose.yml" && echo "OK: DISPATCH_CONTROLLER_URL present" || (echo "ERROR: DISPATCH_CONTROLLER_URL missing"; exit 1)
grep -q "^PORT=" "$ROOT_DIR/docker-compose.yml" && echo "OK: PORT variable present" || (echo "ERROR: PORT var missing"; exit 1)

grep -q "^DISPATCH_CONTROLLER_URL=" "$ROOT_DIR/.env.example" && echo "OK: DISPATCH_CONTROLLER_URL documented in .env.example" || (echo "ERROR: DISPATCH_CONTROLLER_URL not documented in .env.example"; exit 1)

echo "All checks passed."

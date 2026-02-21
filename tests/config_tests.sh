#!/usr/bin/env bash
set -euo pipefail

# Test repository docker config for required variables
ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)

# 1) docker-compose.yml should specify the agentforge image
if ! grep -qE "^\s*image:\s*agentforge" "$ROOT_DIR/docker-compose.yml"; then
  echo "FAIL: docker-compose.yml does not specify image agentforge" >&2
  exit 1
fi

# 2) docker-compose.yml should reference core env vars
if ! grep -qE "DISPATCH_CONTROLLER_URL|DISPATCH_ENABLED" "$ROOT_DIR/docker-compose.yml"; then
  echo "FAIL: docker-compose.yml missing DISPATCH_CONTROLLER_URL/DISPATCH_ENABLED references" >&2
  exit 1
fi

# 3) .env.example exists and documents key vars
if [ ! -f "$ROOT_DIR/.env.example" ]; then
  echo "FAIL: .env.example not found" >&2
  exit 1
fi
if ! grep -q "DISPATCH_CONTROLLER_URL" "$ROOT_DIR/.env.example"; then
  echo "FAIL: DISPATCH_CONTROLLER_URL not documented in .env.example" >&2
  exit 1
fi
if ! grep -q "DISPATCH_ENABLED" "$ROOT_DIR/.env.example"; then
  echo "FAIL: DISPATCH_ENABLED not documented in .env.example" >&2
  exit 1
fi
if ! grep -q "DISPATCH_ENABLED_PROD" "$ROOT_DIR/.env.example"; then
  echo "FAIL: DISPATCH_ENABLED_PROD not documented in .env.example" >&2
  exit 1
fi
if ! grep -q "DISPATCH_CONTROLLER_URL_PROD" "$ROOT_DIR/.env.example"; then
  echo "FAIL: DISPATCH_CONTROLLER_URL_PROD not documented in .env.example" >&2
  exit 1
fi

# 4) docker-compose.prod.yml must override dispatch config with production env vars
if [ ! -f "$ROOT_DIR/docker-compose.prod.yml" ]; then
  echo "FAIL: docker-compose.prod.yml not found" >&2
  exit 1
fi
if ! grep -q "DISPATCH_ENABLED_PROD" "$ROOT_DIR/docker-compose.prod.yml"; then
  echo "FAIL: docker-compose.prod.yml missing DISPATCH_ENABLED_PROD" >&2
  exit 1
fi
if ! grep -q "DISPATCH_CONTROLLER_URL_PROD" "$ROOT_DIR/docker-compose.prod.yml"; then
  echo "FAIL: docker-compose.prod.yml missing DISPATCH_CONTROLLER_URL_PROD" >&2
  exit 1
fi

echo "ALL TESTS PASSED"
exit 0

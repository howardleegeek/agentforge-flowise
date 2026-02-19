#!/usr/bin/env bash
set -euo pipefail

ENV_FILE=".env.example"
if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: $ENV_FILE not found" >&2
  exit 2
fi

# Basic checks: required vars exist
grep -q '^DISPATCH_ENABLED=' "$ENV_FILE" || { echo "Missing DISPATCH_ENABLED in $ENV_FILE"; exit 1; }
grep -q '^DISPATCH_CONTROLLER_URL=' "$ENV_FILE" || { echo "Missing DISPATCH_CONTROLLER_URL in $ENV_FILE"; exit 1; }

# Documentation requirement: ensure there is a doc line for DISPATCH_CONTROLLER_URL
grep -q '^# DISPATCH_CONTROLLER_URL' "$ENV_FILE" || { echo "Documentation for DISPATCH_CONTROLLER_URL is missing in $ENV_FILE"; exit 1; }

echo "ENV example checks passed";

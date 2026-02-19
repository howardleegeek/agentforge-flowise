#!/usr/bin/env bash
set -euo pipefail
echo "Running config tests..."
bash tests/config_tests.sh
echo "Config tests completed."

#!/usr/bin/env bash
set -euo pipefail

echo "Running docker config verification tests..."
bash ./verify_docker_config.sh
echo "Tests completed successfully."

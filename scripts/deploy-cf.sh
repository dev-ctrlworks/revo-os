#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

bash scripts/build-cf.sh
echo "Deploying worker..."
./node_modules/.bin/opennextjs-cloudflare deploy
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

BIN="./node_modules/.bin"
CF_BAK=".cf-env-backup"

restore() {
  if [ -f "$CF_BAK/env.local" ]; then mv -f "$CF_BAK/env.local" .env.local; fi
  if [ -f "$CF_BAK/dev.vars" ]; then mv -f "$CF_BAK/dev.vars" .dev.vars; fi
  rmdir "$CF_BAK" 2>/dev/null || true
}
trap restore EXIT

mkdir -p "$CF_BAK"
[ -f .env.local ] && mv -f .env.local "$CF_BAK/env.local"
[ -f .dev.vars ] && mv -f .dev.vars "$CF_BAK/dev.vars"

echo "OpenNext build with clean env (secrets stripped)..."
"$BIN/opennextjs-cloudflare" build
restore
trap - EXIT
echo "restore: .env.local=$([ -f .env.local ] && echo yes || echo NO) .dev.vars=$([ -f .dev.vars ] && echo yes || echo NO)"
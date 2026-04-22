#!/usr/bin/env bash
# scripts/ingest.sh — raw/ 를 graphify로 재인덱스하고 docs/references.json 을 새로 생성
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "▶ graphify update raw/"
graphify update raw/ || echo "⚠ graphify update skipped or failed (empty corpus is OK); continuing."

echo "▶ build docs/references.json"
node scripts/build-references.mjs "$@"

echo "✓ done"

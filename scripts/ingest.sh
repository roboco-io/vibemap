#!/usr/bin/env bash
# scripts/ingest.sh — recompile nodes, re-index corpus, regenerate references.json
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "▶ compile raw/nodes/ → docs/data.js + docs/nodes.json"
node scripts/compile-nodes.mjs

echo "▶ graphify update raw/urls/"
graphify update raw/urls/ || echo "⚠ graphify update skipped or failed (empty corpus is OK); continuing."

echo "▶ build docs/references.json"
node scripts/build-references.mjs "$@"

echo "✓ done"

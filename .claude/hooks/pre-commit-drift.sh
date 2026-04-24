#!/bin/bash
# Block `git commit` when raw/nodes/*.md or scripts/legacy-*.js is staged without
# the corresponding docs/data.js + docs/nodes.json regeneration also staged.
# Prevents the "raw committed, docs forgotten" class of pipeline drift.

set -u

input=$(cat)
command=$(printf '%s' "$input" | jq -r '.tool_input.command // empty' 2>/dev/null || echo "")

# Only act on actual git commits — ignore other git subcommands
case "$command" in
  git\ commit*|*\&\&\ git\ commit*|*\;\ git\ commit*) ;;
  *) exit 0 ;;
esac

project_dir="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}"
if [ -z "$project_dir" ] || [ ! -f "$project_dir/Makefile" ]; then
  exit 0
fi
cd "$project_dir" || exit 0

raw_staged=$(git diff --cached --name-only 2>/dev/null | grep -E '^raw/nodes/.*\.md$|^scripts/legacy-(nodes|edges)\.js$' || true)
docs_staged=$(git diff --cached --name-only 2>/dev/null | grep -E '^docs/(data\.js|nodes\.json)$' || true)

if [ -n "$raw_staged" ] && [ -z "$docs_staged" ]; then
  {
    echo "[vibemap] drift guard: raw/legacy source changes are staged without docs/ regeneration."
    echo ""
    echo "  Staged source files:"
    printf '%s\n' "$raw_staged" | sed 's/^/    /'
    echo ""
    echo "  Fix: run 'make compile' then 'git add docs/data.js docs/nodes.json' before committing."
  } >&2
  exit 2
fi

exit 0

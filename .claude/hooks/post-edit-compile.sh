#!/bin/bash
# Auto-compile VibeMap nodes after editing raw/nodes/*.md or scripts/legacy-*.js.
# Keeps docs/data.js and docs/nodes.json in sync with sources so pipeline debugging
# isn't obscured by a raw-vs-generated drift (see CLAUDE.md "세 레이어" rule).

set -u

input=$(cat)
file=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty' 2>/dev/null || echo "")

case "$file" in
  */raw/nodes/*.md|*/scripts/legacy-nodes.js|*/scripts/legacy-edges.js)
    project_dir="${CLAUDE_PROJECT_DIR:-$(git -C "$(dirname "$file")" rev-parse --show-toplevel 2>/dev/null)}"
    if [ -z "$project_dir" ] || [ ! -f "$project_dir/Makefile" ]; then
      exit 0
    fi
    cd "$project_dir" || exit 0

    output=$(make compile 2>&1)
    status=$?
    if [ $status -ne 0 ]; then
      # Exit 2 blocks subsequent tool use with the error surfaced to Claude
      echo "[vibemap] make compile FAILED after editing $(basename "$file"):" >&2
      echo "$output" >&2
      exit 2
    fi

    # Silent success — just the final summary line
    printf '%s' "$output" | tail -1
    ;;
esac

exit 0

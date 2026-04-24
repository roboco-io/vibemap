---
description: Ingest an external URL into raw/urls/ for the "더 읽을 자료" panel
argument-hint: <URL> [--author Name]
---

Ingest the URL(s) the user provided as `$ARGUMENTS` into the external-corpus pipeline so they appear in the "더 읽을 자료 / More reading" panel for matching nodes.

Pipeline:

1. Parse `$ARGUMENTS` — must contain at least one URL starting with `http://` or `https://`. Accept an optional `--author "Name"` flag; default author to "Unknown".
2. For each URL, run `graphify add <URL> --dir raw/urls --author "<Name>"`. Let graphify fetch, clean, and persist the markdown.
3. After all adds complete, run `node scripts/build-references.mjs` and capture `stats` from `docs/references.json`.
4. Summarize what changed: new source count, which nodes gained references, and any `_unmapped` sources.
5. Stage the new `raw/urls/*.md` files and the regenerated `docs/references.json`. Do NOT commit — the user reviews and commits themselves.

Quality rules:
- Reject URLs that aren't well-formed (refuse up front, don't let graphify silently fail)
- Skip any URL that `raw/urls/` already contains (graphify handles this idempotently — just report it)
- If `stats.unmapped > 0`, mention which sources had no keyword match. A non-match usually means the article's topic doesn't correspond to any existing node — that's informational, not an error

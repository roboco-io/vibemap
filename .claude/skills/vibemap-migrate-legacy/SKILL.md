---
name: vibemap-migrate-legacy
description: Bulk-migrate legacy VibeMap nodes from scripts/legacy-nodes.js into rich raw/nodes/<id>.md files with 3-language bodies, wiki-links, and canonical refs. Use when the user asks to "보강 / enrich / migrate / flesh out / 승격" one or more existing (legacy) VibeMap nodes. Accepts a list of node ids, or the phrase "top-N by degree" to auto-select highest-connected legacy nodes. Reuses the authoring patterns from vibemap-add-node but starts from an existing legacy body/title instead of a blank keyword.
---

# Migrating legacy VibeMap nodes to rich md

You are promoting nodes from the short legacy body (`scripts/legacy-nodes.js`) into the full md format (`raw/nodes/<id>.md`) so they match the depth of `iac.md`, `tidd.md`, `harness-eng.md`, etc. Announce at start: "Using vibemap-migrate-legacy on: <ids>."

## The pipeline (per node)

```
resolve id ─▶ read legacy body ─▶ research (Perplexity/Exa) ─▶ author raw/nodes/<id>.md
                                                                       │
                                                                       ▼
                                                    remove legacy entry ─▶ verify
                                                                       │
                                                                       ▼
                                             batch all ids ─▶ make compile/test ─▶ commit
```

Do **not** push. Commit locally and let the user push.

## Step 1 — Resolve the target list

Three input shapes the user might give:

- **Explicit ids**: `cicd, claude-code, cost` → use as-is.
- **`top-N by degree`**: enumerate degrees by scanning `docs/data.js` edges, intersect with current legacy ids (entries present in `scripts/legacy-nodes.js`), take the top N.
- **Category filter**: e.g. `all ops`, `all ai` → scan `scripts/legacy-nodes.js` for `cat: "<cat>"`, take those ids.

Refuse ids that already have a file at `raw/nodes/<id>.md` — md overrides legacy, so those are already done. Surface this to the user before proceeding.

```bash
# Legacy-only ids
node -e '
const src=require("fs").readFileSync("scripts/legacy-nodes.js","utf8");
const md=new Set(require("fs").readdirSync("raw/nodes/").filter(f=>f.endsWith(".md")).map(f=>f.replace(".md","")));
const ids=[...src.matchAll(/id:\s*"([^"]+)"/g)].map(m=>m[1]);
console.log(ids.filter(id=>!md.has(id)).join("\n"));
'
```

## Step 2 — Extract the legacy seed

For each id, pull the current legacy record so you don't lose signal the author already wrote:

```bash
node -e '
const src=require("fs").readFileSync("scripts/legacy-nodes.js","utf8");
const ID="<id>";
const re=new RegExp("\\\\{\\\\s*id:\\\\s*\""+ID+"\"[\\\\s\\\\S]*?\\\\n\\\\s*\\\\},?");
const m=src.match(re);
console.log(m?m[0]:"NOT FOUND");
'
```

The legacy block gives you `cat`, `size`, `title.ko/en/ja`, and three short body strings. **Preserve `cat` and `size`** unless the user explicitly wants to reclassify. Preserve `title` unless the user requests a rename.

## Step 3 — Research (Perplexity first, Exa fallback)

Use **two** queries per node, same as `vibemap-add-node`:

1. "Explain \<keyword\> in the context of AWS/cloud/software development. Focus on: (a) essence, (b) when to use, (c) 2-3 adjacent concepts [list known VibeMap neighbors explicitly so the model maps them], (d) common pitfalls. Under 400 words."
2. "Give me the official documentation URL for \<keyword\> and one high-quality introductory article. For each, return URL, title, primary language. No speculation."

Batch research across nodes in parallel — issue all queries in one tool-call round when possible to minimize latency and quota burn.

If Perplexity returns a quota error, fall back immediately to `mcp__exa__web_search_exa` with the same questions rephrased as search queries. If both fail, report the blocked id(s) and continue with the rest.

## Step 4 — Author `raw/nodes/<id>.md`

Same format rules as `vibemap-add-node`:

- Frontmatter: `id`, `cat`, `size`, `title.{ko,en,ja}`, `refs[]`, `extraEdges: []`
- Body: `## ko` then `## en` then `## ja`, each 800–1800 chars
- Markdown subset only — no code blocks (triple-backtick), no tables, no images, no HTML, no h1/h2/h4+, no ordered lists
- 5+ distinct `[[wiki-link]]` per language, targeting ids that exist (verify against `raw/nodes/*.md` + remaining `scripts/legacy-nodes.js`)

Tone template (same as rich md siblings):

- Opening one-liner that contrasts with an adjacent concept the reader already knows
- `### 언제 쓰나 / When to use / いつ使うか` bullet list
- `### 쉽게 빠지는 함정 / Common pitfalls / はまりやすい罠` bullet list
- Closing paragraph on "How it connects / 연결" with wiki-links

Read 2-3 existing rich md files for tone reference before writing. Don't rewrite the voice — match it.

## Step 5 — Remove the legacy entry

After the md exists, delete the corresponding block in `scripts/legacy-nodes.js`. Use `Edit` with an `old_string` matching the full `{ id: "<id>", ... },` block including the trailing comma and newline.

Do NOT delete any other entries. After each removal, re-grep to confirm the count dropped by exactly one:

```bash
grep -c '^\s*{ id: "' scripts/legacy-nodes.js
```

## Step 6 — Batch verify

After ALL ids are authored and removed:

1. `make compile` — expect `written: N node(s) (M md, K legacy), E edges, 0 broken.` where M increased by the batch count, K decreased by the batch count, N is unchanged
2. `make test` — expect `tests 61 / pass 61 / fail 0`
3. If either fails, read the error and repair the offending md. Don't proceed to commit with a broken pipeline.

Spot-check each new node's refs count and wiki-link count (both per language):

```bash
node -e '
const o=JSON.parse(require("fs").readFileSync("docs/nodes.json","utf8"));
for (const id of ["<id1>","<id2>","..."]) {
  const n=o.nodes[id]; if (!n) { console.log(id,"MISSING"); continue; }
  console.log(id, "refs="+(n.refs?.length||0),
    "wl_ko="+((n.body.ko.match(/wiki-link/g)||[]).length),
    "wl_en="+((n.body.en.match(/wiki-link/g)||[]).length),
    "wl_ja="+((n.body.ja.match(/wiki-link/g)||[]).length));
}
'
```

## Step 7 — Commit (batch)

`git add` the new md files, the modified `scripts/legacy-nodes.js`, and the regenerated `docs/data.js` + `docs/nodes.json`. Commit with a batch message:

```
content: promote N nodes from legacy to md-based rich content

Enriches <list> to match the depth of recent md additions.

Each file:
- 3 refs in frontmatter, canonical AWS/vendor/academic sources
- ko/en/ja bodies 800-1800 chars each, 5+ wiki-links
- Opening contrast, when-to-use, pitfalls, connections sections

Pipeline effect: N nodes total unchanged, md <old>→<new>, legacy <old>→<new>,
edges <old>→<new> (+delta from denser wiki-link graph). 0 broken edges;
61 tests pass.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

Show the commit sha and `git log --oneline -3`. Tell the user: "Committed locally as <sha>. Run `git push origin main` when ready to deploy." Do not push unless the user explicitly asked the skill to also push.

## Quality bars — reject and retry per-node if any fails

- Any language body < 500 chars → under-researched; re-query Perplexity/Exa with a broader prompt
- Fewer than 5 distinct `[[wiki-link]]` to existing ids → thin content
- `refs[]` empty or any URL not http(s):// → refuse to commit
- `make compile` broken edges → a wiki-link typo; fix before proceeding
- `make test` fails → body contains a rejected markdown construct

## Batch discipline

- **Do NOT author in one giant message.** Write each md file in its own Write tool call. Use file-at-a-time to keep the context of each node isolated.
- **Research in parallel, write sequentially.** A single tool-call round with N Perplexity queries is fine. Writing files is sequential so you can re-read if the format rules trip you up.
- **Commit once, not N times.** Batch commits are cleaner for enrichment work because the nodes are logically one operation ("lift the graph center").
- **Stop at 5–8 nodes per batch.** Beyond that, context pressure and research quota both hurt quality. Ask the user to confirm before exceeding.

## Related files

- `raw/nodes/iac.md`, `raw/nodes/tidd.md`, `raw/nodes/harness-eng.md` — tone references
- `.claude/skills/vibemap-add-node/SKILL.md` — adjacent skill for new keywords (use when an id doesn't exist in legacy at all)
- `scripts/compile-nodes.mjs` — understand why certain markdown is rejected
- `CLAUDE.md` — the "세 레이어" data ownership rules

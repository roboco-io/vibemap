---
name: vibemap-add-node
description: Add a new concept/service/tool node to VibeMap. Use when the user asks to add a node, concept, service, or tool to VibeMap — e.g. "VibeMap에 AppRunner 추가", "add a node for Kubernetes", "VibeMap에 새 개념 추가해줘", "노드 추가해줘 — X", or after a conversation concludes "이것도 지도에 넣는 게 좋겠다." Researches the keyword via Perplexity/Exa, authors raw/nodes/<id>.md with 3-language body and [[wiki-link]] connections, runs make compile, and stages a commit.
---

# Adding a node to VibeMap

You are walking through a fixed pipeline. Skip no step. Announce at start: "Using vibemap-add-node to add <keyword>."

## The pipeline

```
keyword ─▶ clarify ─▶ research (Perplexity) ─▶ author raw/nodes/<id>.md
                                                     │
                                                     ▼
                                    make compile ─▶ verify edges
                                                     │
                                                     ▼
                                     (optional) add URL to raw/urls/
                                                     │
                                                     ▼
                                              review ─▶ commit
```

**Do not push to production in this skill.** The user deploys explicitly when they're ready — typically with `git push origin main`, which triggers GitHub Pages. This skill stops at the local commit.

## Step 1 — Clarify scope

Read current nodes (their ids are the available `[[wiki-link]]` targets):

```bash
grep -E '^\s*\{ id: "' scripts/legacy-nodes.js | sed -E 's/.*id: "([^"]+)".*/\1/' | sort -u > /tmp/vm-legacy-ids.txt
ls raw/nodes/*.md 2>/dev/null | xargs -I{} basename {} .md | sort -u > /tmp/vm-md-ids.txt
sort -u /tmp/vm-legacy-ids.txt /tmp/vm-md-ids.txt
```

Then use `AskUserQuestion` with 3 questions (single batch):

1. **Category**: `core` / `mindset` / `ai` / `tool` / `tech` / `data` / `ops`. Map the keyword to one. AWS/cloud service = `ops`, data-storage/analytics = `data`, testing/API/container concepts = `tech`, git/IDE/package managers = `tool`, LLM/Claude Code/MCP = `ai`, methodology/thinking pattern = `mindset`.
2. **Size**: `1` (대주제, 핵심 축) / `2` (중주제) / `3` (세부). New AWS services → usually `3`. New thinking frameworks → `2`. Core paradigm shifts → `1`.
3. **Node id**: short lowercase/dash, unique. Offer 1-2 candidates derived from the keyword.

If the user gives a Korean/English/Japanese title override, accept it. Otherwise derive naturally (service names typically stay in English for all three languages, concepts translate).

## Step 2 — Research via Perplexity

Use `mcp__perplexity-ask__perplexity_ask` with **two** short queries. Don't hit it more than needed.

**Query 1 (conceptual)** — exactly this shape:

> "Explain <keyword> in the context of AWS/cloud/software development. Focus on: (a) one-sentence essence, (b) when to use it vs not, (c) the 2-3 adjacent concepts it relates to, (d) common pitfalls. Keep under 400 words."

**Query 2 (authoritative sources)** — exactly this shape:

> "Give me the official documentation URL for <keyword> and one high-quality introductory article. For each, return: URL, title, primary language (en/ko/ja). No speculation — only URLs you are confident exist."

If Perplexity is unavailable, fall back to `mcp__exa__web_search_exa` with the same two queries. If both fail, tell the user and stop — do not invent content.

Extract from the responses:
- One-sentence essence (for the opening paragraph)
- 2-3 canonical "when to use" bullets
- Related concepts → map to existing node ids for `[[wiki-link]]` (minimum 3, ideally 5+)
- Pitfalls / "watch out" bullets
- 1-2 URLs for `refs:` frontmatter (verify http(s)://)

## Step 3 — Author `raw/nodes/<id>.md`

**Critical format rules** (enforced by `scripts/compile-nodes/markdown.mjs` — violations fail `make compile`):

- Frontmatter YAML subset: `id`, `cat`, `size`, `title.{ko,en,ja}`, `refs[]` (optional), `extraEdges: []`
- Required body sections: `## ko` then `## en` then `## ja` (all three, each non-empty)
- Allowed markdown: paragraphs, `**bold**`, `*italic*`, `` `inline code` ``, `### h3`, `-` lists, `[[id]]` and `[[id|label]]`
- **Rejected** (hard errors): code blocks with triple backticks, tables, images, raw HTML, h1/h2/h4+, ordered lists, blockquotes
- refs URL must start with `http://` or `https://`
- Use `[[wiki-link]]` naturally in prose — the parser auto-creates edges to each linked id. Include at least 3 distinct ones.

See `references/node-template.md` for a fill-in template and `references/example-ecs.md` for a full worked example. Model tone/structure on existing `raw/nodes/*.md` (especially `dsql.md`, `ecs.md`, `kinesis.md`). Each language section should be 150-400 words.

**Tone guide** (project voice):
- Open with a one-liner that contrasts the concept with an adjacent one the reader already knows.
- One analogy is welcome (taxi, water tap, conveyor belt), but not two.
- Include a `### 언제 쓰나 / When to use / いつ使うか` bullet list.
- Keep jargon explained inline; no assumed prior knowledge beyond node prerequisites.
- Don't write "How" (per intent engineering) — describe *what it is*, not *how to configure it*.

## Step 4 — Compile and verify

```bash
make compile
```

Expected stdout: `docs/data.js + docs/nodes.json written: N node(s) (M md, K legacy), E edges, 0 broken.`

If the output shows broken edges for the new node, one of your `[[wiki-link]]` ids doesn't exist. Open the id list from Step 1 and fix the typo.

Then spot-check the generated body:

```bash
node -e "const j=require('fs').readFileSync('docs/nodes.json','utf8'); const o=JSON.parse(j); const id='<your-id>'; console.log('refs:', o.nodes[id].refs.length); console.log('wiki-link count:', (o.nodes[id].body.ko.match(/wiki-link/g)||[]).length);"
```

Run `make test` to confirm the pipeline tests still pass.

## Step 5 — (Optional) Add source URL for "더 읽을 자료"

If the research surfaced a particularly good article (not just official docs), consider adding it to the external corpus so it auto-appears in the "More reading" panel section:

```bash
graphify add <URL> --dir raw/urls --author "Name"
node scripts/build-references.mjs
```

Skip this if the node's canonical source is only official docs — those already appear in "관련 링크" via frontmatter `refs`. Adding a URL to `raw/urls/` is for supplemental long-form content.

## Step 6 — Review and commit

Show the user:
- `git diff --stat` summary
- The new edges created (grep `"<id>"` in `docs/data.js` for lines inside the `edges:` block)
- A short summary of the body (first line of each language section)

Ask for confirmation (plain sentence, not AskUserQuestion — this is a yes/go confirmation, not a choice between options). On confirmation, commit:

```
content: add <keyword> node (<id>)

- raw/nodes/<id>.md with 3-language body and wiki-links to [list]
- refs: [official docs URLs]
- Regenerates docs/data.js and docs/nodes.json

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

Do not push. Tell the user: "Committed locally as <sha>. Run `git push origin main` when ready to deploy."

## Quality bars — reject the node if any fails

- Fewer than 3 distinct `[[wiki-link]]` to existing ids → thin content, retry Step 2-3
- Any language section under 120 words → under-researched, retry Step 2 with a broader query
- `refs[]` empty → you have no canonical source; did Perplexity really fail? Retry once
- `make compile` reports broken edges → fix typos before asking for commit approval
- `make test` fails → your md likely triggered a rejected markdown construct (triple-backtick? table? image?). Fix and recompile.

## Related files (for quick orientation)

- `specs/superpowers/specs/2026-04-22-knowledge-base-driven-nodes-design.md` — the full design spec
- `scripts/compile-nodes.mjs` — compile orchestrator
- `scripts/compile-nodes/markdown.mjs` — the allowed markdown subset
- `raw/nodes/dsql.md`, `raw/nodes/ecs.md` — reference-quality examples to model on
- `CLAUDE.md` — the "세 레이어" data ownership section

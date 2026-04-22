# Knowledge-Base-Driven Nodes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Spec:** `specs/superpowers/specs/2026-04-22-knowledge-base-driven-nodes-design.md` — read before starting any task.

**Goal:** Convert VibeMap's 48-node hand-authored data.js into a markdown-SSOT pipeline (raw/nodes/<id>.md → docs/data.js + docs/nodes.json), enrich bodies with wiki-link navigation, and add 6 new AWS nodes (DSQL, MemoryDB, Glue, Athena, Lake Formation, Kinesis) plus 2 sample migrations (intent, vibe). Ship to production via GitHub Pages.

**Architecture:** Self-written `compile-nodes.mjs` parses per-node frontmatter + 3-language markdown + `[[wiki-links]]` → emits legacy-compatible `data.js` (meta + edges only) + new `nodes.json` (HTML bodies + refs). Existing 46 nodes stay in fallback `legacy-nodes.js`/`legacy-edges.js` and are rendered with their short bodies until individually migrated. Frontend grows a 3-tier panel (body / refs / connected / more reading). No npm deps.

**Tech Stack:** Node ≥18 (built-in `node:test`, `node:fs/promises`, `node:vm`), vanilla React 18 UMD + @babel/standalone (no build step), Python `http.server` for serving `docs/`, Make for orchestration, GitHub Pages for hosting.

---

## File Structure

**New files**

| Path | Responsibility |
|------|---------------|
| `scripts/compile-nodes.mjs` | CLI + orchestration (load → parse → merge → write) |
| `scripts/compile-nodes/frontmatter.mjs` | Minimal YAML-subset parser for `---...---` blocks |
| `scripts/compile-nodes/markdown.mjs` | Allowed-subset markdown → HTML, `[[wiki]]` extraction |
| `scripts/compile-nodes/schema.mjs` | Validate frontmatter + refs + body sections |
| `scripts/compile-nodes/merge.mjs` | Merge md + legacy nodes; normalize + validate edges |
| `scripts/compile-nodes.test.mjs` | Node test runner tests (parser + schema + merge + output determinism) |
| `scripts/legacy-nodes.js` | One-time snapshot of current `docs/data.js` nodes array |
| `scripts/legacy-edges.js` | One-time snapshot of current `docs/data.js` edges array |
| `raw/nodes/dsql.md` | New Aurora DSQL node |
| `raw/nodes/memorydb.md` | New MemoryDB node |
| `raw/nodes/glue.md` | New AWS Glue node |
| `raw/nodes/athena.md` | New Athena node |
| `raw/nodes/lake-formation.md` | New Lake Formation node |
| `raw/nodes/kinesis.md` | New Kinesis node |
| `raw/nodes/intent.md` | Sample migration (mindset) |
| `raw/nodes/vibe.md` | Sample migration (core root) |
| `docs/nodes.json` | Generated — body + refs per node |

**Modified files**

| Path | Change |
|------|--------|
| `docs/data.js` | Regenerated as meta-only (no `body` field); add generator header |
| `docs/app.jsx` | Fetch `nodes.json`; 3-tier panel; wiki-link click delegation; search over `nodesDetail.body` |
| `docs/styles.css` | `.wiki-link`, `.panel-section.refs-curated`, `.panel-section.more-reading`, `.panel-text h3`, `.panel-text ul` |
| `docs/i18n.js` | Add `refsCurated`, `moreReading`; `connections` label reused |
| `scripts/ingest.sh` | Add `compile-nodes` first step |
| `Makefile` | Add `compile` target; `build`/`ingest` depend on it; `e2e` curls `nodes.json` |
| `package.json` | `test` glob picks up `scripts/compile-nodes.test.mjs` (already wildcarded — verify) |
| `CLAUDE.md` | Update "two layers" → "three layers"; add `docs/nodes.json` and regenerated `docs/data.js` to "절대 수정 금지" |

---

### Task 1: Snapshot current data.js into legacy-* scripts

**Files:**
- Create: `scripts/legacy-nodes.js`
- Create: `scripts/legacy-edges.js`

- [ ] **Step 1: Copy `nodes` array from `docs/data.js` into `scripts/legacy-nodes.js`**

The file must export via `window.VIBEMAP_LEGACY_NODES` on globalThis to stay consumable from both `node --experimental-vm-modules` and the compile script's `vm.createContext`. Use CommonJS-compatible assignment:

```javascript
// scripts/legacy-nodes.js — snapshot of docs/data.js nodes as of 2026-04-22
// AUTO-LOADED by scripts/compile-nodes.mjs via vm.runInContext.
// Do not hand-edit after new md nodes are added — prefer migrating to raw/nodes/.

const LEGACY_NODES = [
  // …copy the entire nodes array from docs/data.js (current window.VIBEMAP_DATA.nodes)…
];

if (typeof module !== 'undefined') module.exports = LEGACY_NODES;
if (typeof globalThis !== 'undefined') globalThis.LEGACY_NODES = LEGACY_NODES;
```

Read the current `docs/data.js` and paste the nodes array verbatim inside the `[...]` (every node object with id/cat/size/title/body fields).

- [ ] **Step 2: Copy `edges` array into `scripts/legacy-edges.js`**

Same pattern:

```javascript
// scripts/legacy-edges.js — snapshot of docs/data.js edges as of 2026-04-22
const LEGACY_EDGES = [
  // …copy the edges array verbatim…
];
if (typeof module !== 'undefined') module.exports = LEGACY_EDGES;
if (typeof globalThis !== 'undefined') globalThis.LEGACY_EDGES = LEGACY_EDGES;
```

- [ ] **Step 3: Verify snapshot integrity by counts**

Run:

```bash
node -e "const n=require('./scripts/legacy-nodes.js'); console.log('nodes:', n.length);"
node -e "const e=require('./scripts/legacy-edges.js'); console.log('edges:', e.length);"
```

Expected: `nodes: 48`, `edges: 60` (approximately — count should match what's currently in `docs/data.js`; verify with `grep -cE '^\s*\{ id: "' docs/data.js` for nodes).

- [ ] **Step 4: Commit**

```bash
git add scripts/legacy-nodes.js scripts/legacy-edges.js
git commit -m "$(cat <<'EOF'
chore(pipeline): snapshot current data.js into legacy-*.js

Pre-migration snapshot. compile-nodes.mjs will fall back to these
arrays for nodes not yet authored as raw/nodes/<id>.md.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Frontmatter parser with tests

**Files:**
- Create: `scripts/compile-nodes/frontmatter.mjs`
- Create: `scripts/compile-nodes.test.mjs`

- [ ] **Step 1: Write failing tests for frontmatter parser**

Create `scripts/compile-nodes.test.mjs` with:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFrontmatter } from './compile-nodes/frontmatter.mjs';

test('frontmatter: parses basic key/value + nested title', () => {
  const src = `---
id: dsql
cat: ops
size: 3
title:
  ko: Aurora DSQL
  en: Aurora DSQL
  ja: Aurora DSQL
---
body here`;
  const { data, body } = parseFrontmatter(src);
  assert.equal(data.id, 'dsql');
  assert.equal(data.cat, 'ops');
  assert.equal(data.size, 3);
  assert.deepEqual(data.title, { ko: 'Aurora DSQL', en: 'Aurora DSQL', ja: 'Aurora DSQL' });
  assert.equal(body.trim(), 'body here');
});

test('frontmatter: parses refs list with nested objects', () => {
  const src = `---
id: x
refs:
  - url: https://example.com/a
    title: A
    lang: en
  - url: https://example.com/b
    title: B
    lang: ko
---
`;
  const { data } = parseFrontmatter(src);
  assert.equal(data.refs.length, 2);
  assert.equal(data.refs[0].url, 'https://example.com/a');
  assert.equal(data.refs[1].lang, 'ko');
});

test('frontmatter: missing opening delimiter throws', () => {
  assert.throws(() => parseFrontmatter('no frontmatter here\n'), /frontmatter/i);
});

test('frontmatter: empty list renders as []', () => {
  const src = `---
id: x
extraEdges: []
---
`;
  const { data } = parseFrontmatter(src);
  assert.deepEqual(data.extraEdges, []);
});
```

- [ ] **Step 2: Run tests to confirm failure**

```bash
node --test scripts/compile-nodes.test.mjs
```

Expected: all tests fail with "Cannot find module './compile-nodes/frontmatter.mjs'".

- [ ] **Step 3: Implement `parseFrontmatter`**

Create `scripts/compile-nodes/frontmatter.mjs`:

```javascript
// Minimal YAML-subset parser for VibeMap node frontmatter.
// Supports:
//   - scalar key: value (string, number, [])
//   - nested mapping (2-space indent) one level deep for `title:`
//   - list of mappings (2-space indent, `- ` prefix) for `refs:`
//   - inline empty list: `key: []`
// Rejects anything else with a line-numbered error.

export function parseFrontmatter(source) {
  const lines = source.split('\n');
  if (lines[0] !== '---') {
    throw new Error('frontmatter: missing opening --- delimiter');
  }
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---') { end = i; break; }
  }
  if (end < 0) throw new Error('frontmatter: missing closing --- delimiter');

  const fmLines = lines.slice(1, end);
  const body = lines.slice(end + 1).join('\n');
  const data = parseBlock(fmLines, 0);
  return { data, body };
}

function parseBlock(lines, baseIndent) {
  const out = {};
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) { i++; continue; }
    const indent = line.length - line.trimStart().length;
    if (indent !== baseIndent) {
      throw new Error(`frontmatter: unexpected indent at line ${i + 1}: ${JSON.stringify(line)}`);
    }
    const m = line.match(/^(\s*)([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
    if (!m) throw new Error(`frontmatter: unparsable line ${i + 1}: ${JSON.stringify(line)}`);
    const key = m[2];
    const rest = m[3];

    if (rest === '') {
      // Nested mapping or list — collect child lines at baseIndent+2
      const childIndent = baseIndent + 2;
      const childLines = [];
      i++;
      while (i < lines.length) {
        const L = lines[i];
        if (!L.trim() || L.trim().startsWith('#')) { childLines.push(L); i++; continue; }
        const ind = L.length - L.trimStart().length;
        if (ind < childIndent) break;
        childLines.push(L.slice(childIndent));
        i++;
      }
      out[key] = parseChildren(childLines);
    } else if (rest === '[]') {
      out[key] = [];
      i++;
    } else {
      out[key] = parseScalar(rest);
      i++;
    }
  }
  return out;
}

function parseChildren(lines) {
  if (lines.length === 0) return {};
  const firstNonEmpty = lines.find((L) => L.trim() && !L.trim().startsWith('#'));
  if (firstNonEmpty && firstNonEmpty.startsWith('- ')) {
    return parseList(lines);
  }
  return parseBlock(lines, 0);
}

function parseList(lines) {
  const items = [];
  let current = null;
  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (line.startsWith('- ')) {
      if (current !== null) items.push(current);
      // Rest of `- ` line is first key of the new item
      const rest = line.slice(2);
      current = {};
      const m = rest.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
      if (!m) throw new Error(`frontmatter: list item must start with "key: value" — got ${JSON.stringify(line)}`);
      current[m[1]] = parseScalar(m[2]);
    } else if (line.startsWith('  ')) {
      // Continuation of current item
      const m = line.slice(2).match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
      if (!m || !current) throw new Error(`frontmatter: bad list continuation ${JSON.stringify(line)}`);
      current[m[1]] = parseScalar(m[2]);
    } else {
      throw new Error(`frontmatter: unexpected list line ${JSON.stringify(line)}`);
    }
  }
  if (current !== null) items.push(current);
  return items;
}

function parseScalar(raw) {
  const s = raw.trim();
  if (s === '') return '';
  if (s === '[]') return [];
  if (/^-?\d+$/.test(s)) return Number(s);
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}
```

- [ ] **Step 4: Run tests to confirm pass**

```bash
node --test scripts/compile-nodes.test.mjs
```

Expected: 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/compile-nodes/frontmatter.mjs scripts/compile-nodes.test.mjs
git commit -m "feat(compile): add frontmatter parser with tests

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Markdown parser (allowed subset) with wiki-link extraction

**Files:**
- Create: `scripts/compile-nodes/markdown.mjs`
- Modify: `scripts/compile-nodes.test.mjs`

- [ ] **Step 1: Append failing tests**

Append to `scripts/compile-nodes.test.mjs`:

```javascript
import { renderSection, splitLanguageSections } from './compile-nodes/markdown.mjs';

test('markdown: renders paragraph, bold, italic, h3, ul', () => {
  const { html, wikiLinks } = renderSection(`
This is **bold** and *italic*.

### 소제목

- item one
- item two
`.trim());
  assert.match(html, /<p>This is <strong>bold<\/strong> and <em>italic<\/em>\.<\/p>/);
  assert.match(html, /<h3>소제목<\/h3>/);
  assert.match(html, /<ul><li>item one<\/li><li>item two<\/li><\/ul>/);
  assert.deepEqual(wikiLinks, []);
});

test('markdown: extracts [[id]] and [[id|label]] wiki-links', () => {
  const { html, wikiLinks } = renderSection('See [[serverless]] and [[sql|관계형 DB]].');
  assert.match(html, /<a class="wiki-link" data-node-id="serverless">serverless<\/a>/);
  assert.match(html, /<a class="wiki-link" data-node-id="sql">관계형 DB<\/a>/);
  assert.deepEqual(wikiLinks.sort(), ['serverless', 'sql']);
});

test('markdown: escapes HTML-looking input as text (no <script>)', () => {
  const { html } = renderSection('Beware <script>alert(1)</script> input.');
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
});

test('markdown: rejects code blocks (triple-backtick)', () => {
  assert.throws(() => renderSection('```\ncode\n```'), /code block/i);
});

test('markdown: rejects tables and images and raw html', () => {
  assert.throws(() => renderSection('| a | b |\n| - | - |'), /table/i);
  assert.throws(() => renderSection('![alt](foo.png)'), /image/i);
  assert.throws(() => renderSection('<div>raw</div>'), /raw html/i);
});

test('markdown: splitLanguageSections finds ## ko/en/ja', () => {
  const src = `
## ko
한국어 본문.

## en
English body.

## ja
日本語本文。
`.trim();
  const sections = splitLanguageSections(src);
  assert.equal(sections.ko.trim(), '한국어 본문.');
  assert.equal(sections.en.trim(), 'English body.');
  assert.equal(sections.ja.trim(), '日本語本文。');
});

test('markdown: splitLanguageSections requires all three', () => {
  assert.throws(() => splitLanguageSections('## ko\nonly korean'), /missing/i);
});
```

- [ ] **Step 2: Run to confirm failure**

```bash
node --test scripts/compile-nodes.test.mjs
```

Expected: new tests fail with module-not-found or assertion errors.

- [ ] **Step 3: Implement markdown.mjs**

Create `scripts/compile-nodes/markdown.mjs`:

```javascript
// VibeMap's intentionally-restricted markdown → HTML renderer.
// Allowed: paragraphs, **bold**, *italic*, ### h3, unordered lists, [[wiki]] / [[wiki|label]].
// Rejected (throws): code blocks, tables, images, raw HTML, h1, h2, h4+, ordered lists, blockquotes, inline code.
// Escapes <, >, & in text nodes. Never emits attribute values other than the fixed data-node-id whitelist.

const WIKI_RE = /\[\[([a-z0-9][a-z0-9-]*)(?:\|([^\]]+))?\]\]/g;

export function splitLanguageSections(source) {
  const out = {};
  const re = /^##\s+(ko|en|ja)\s*$/m;
  let rest = source;
  let match;
  let lastLang = null;
  let lastIdx = 0;
  const headers = [];
  const headerRe = /^##\s+(ko|en|ja)\s*$/gm;
  while ((match = headerRe.exec(source)) !== null) {
    headers.push({ lang: match[1], start: match.index, headerLen: match[0].length });
  }
  if (headers.length === 0) throw new Error('markdown: missing ## ko / ## en / ## ja sections');
  for (let i = 0; i < headers.length; i++) {
    const h = headers[i];
    const bodyStart = h.start + h.headerLen;
    const bodyEnd = i + 1 < headers.length ? headers[i + 1].start : source.length;
    out[h.lang] = source.slice(bodyStart, bodyEnd).trim();
  }
  for (const lang of ['ko', 'en', 'ja']) {
    if (!out[lang] || !out[lang].trim()) {
      throw new Error(`markdown: missing or empty ## ${lang} section`);
    }
  }
  return out;
}

export function renderSection(source) {
  if (/```/.test(source)) throw new Error('markdown: code blocks are not allowed');
  if (/^\s*\|.*\|\s*$/m.test(source)) throw new Error('markdown: tables are not allowed');
  if (/!\[[^\]]*\]\([^)]+\)/.test(source)) throw new Error('markdown: images are not allowed');
  if (/<[a-zA-Z][^>]*>/.test(source) && !/<\/?\s*$/.test(source)) {
    // Any angle-bracket tag that is not a dangling "<" — treat as raw HTML.
    // Escape-only pass happens later for genuinely free-form text; here we reject authored HTML.
    if (!/^[\s\S]*&lt;[\s\S]*$/.test(source)) {
      throw new Error('markdown: raw html is not allowed');
    }
  }
  if (/^#{1,2}\s/m.test(source)) throw new Error('markdown: only ### headers allowed inside sections');
  if (/^#{4,}\s/m.test(source)) throw new Error('markdown: only ### headers allowed inside sections');
  if (/^\s*>\s/m.test(source)) throw new Error('markdown: blockquotes are not allowed');
  if (/^\s*\d+\.\s/m.test(source)) throw new Error('markdown: ordered lists are not allowed');
  if (/`[^`]+`/.test(source)) throw new Error('markdown: inline code is not allowed');

  const wikiLinks = new Set();
  const blocks = source.split(/\n\s*\n/);
  const html = blocks.map((block) => renderBlock(block, wikiLinks)).filter(Boolean).join('');
  return { html, wikiLinks: [...wikiLinks] };
}

function renderBlock(block, wikiLinks) {
  const trimmed = block.trim();
  if (!trimmed) return '';
  if (/^###\s/.test(trimmed)) {
    const text = trimmed.replace(/^###\s+/, '');
    return `<h3>${inline(text, wikiLinks)}</h3>`;
  }
  if (/^-\s/.test(trimmed)) {
    const items = trimmed.split('\n').map((L) => {
      const m = L.match(/^-\s+(.*)$/);
      if (!m) throw new Error(`markdown: malformed list item ${JSON.stringify(L)}`);
      return `<li>${inline(m[1], wikiLinks)}</li>`;
    }).join('');
    return `<ul>${items}</ul>`;
  }
  return `<p>${inline(trimmed.replace(/\n/g, ' '), wikiLinks)}</p>`;
}

function inline(text, wikiLinks) {
  // 1. Extract wiki-links first so we never re-process their label text.
  const placeholders = [];
  let stripped = text.replace(WIKI_RE, (_m, id, label) => {
    wikiLinks.add(id);
    const display = (label || id).trim();
    placeholders.push(`<a class="wiki-link" data-node-id="${id}">${escapeHtml(display)}</a>`);
    return `\x00${placeholders.length - 1}\x00`;
  });
  // 2. Escape everything else.
  stripped = escapeHtml(stripped);
  // 3. Apply **bold** and *italic* on escaped text.
  stripped = stripped.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  stripped = stripped.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  // 4. Restore wiki-link placeholders.
  stripped = stripped.replace(/\x00(\d+)\x00/g, (_m, n) => placeholders[Number(n)]);
  return stripped;
}

function escapeHtml(s) {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}
```

- [ ] **Step 4: Run tests to confirm pass**

```bash
node --test scripts/compile-nodes.test.mjs
```

Expected: all tests pass (4 frontmatter + 7 markdown).

- [ ] **Step 5: Commit**

```bash
git add scripts/compile-nodes/markdown.mjs scripts/compile-nodes.test.mjs
git commit -m "feat(compile): add restricted markdown → HTML renderer

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Schema validation for node records

**Files:**
- Create: `scripts/compile-nodes/schema.mjs`
- Modify: `scripts/compile-nodes.test.mjs`

- [ ] **Step 1: Append failing tests**

```javascript
import { validateNode } from './compile-nodes/schema.mjs';

const KNOWN_CATS = new Set(['core', 'mindset', 'ai', 'tool', 'tech', 'data', 'ops']);

test('schema: accepts a complete valid node', () => {
  const node = {
    id: 'dsql', cat: 'ops', size: 3,
    title: { ko: 'Aurora DSQL', en: 'Aurora DSQL', ja: 'Aurora DSQL' },
    refs: [{ url: 'https://docs.aws.amazon.com/aurora-dsql/', title: 'Docs', lang: 'en' }],
  };
  assert.doesNotThrow(() => validateNode(node, { knownCats: KNOWN_CATS, file: 'x.md' }));
});

test('schema: missing id throws with file path', () => {
  const err = assert.throws(() => validateNode({ cat: 'ops' }, { knownCats: KNOWN_CATS, file: 'missing-id.md' }));
  assert.match(err.message, /missing-id\.md/);
  assert.match(err.message, /id/);
});

test('schema: unknown cat throws', () => {
  assert.throws(() => validateNode(
    { id: 'x', cat: 'bogus', size: 3, title: { ko: 'x', en: 'x', ja: 'x' } },
    { knownCats: KNOWN_CATS, file: 'x.md' }
  ), /unknown cat/i);
});

test('schema: size must be 1/2/3', () => {
  assert.throws(() => validateNode(
    { id: 'x', cat: 'ops', size: 9, title: { ko: 'x', en: 'x', ja: 'x' } },
    { knownCats: KNOWN_CATS, file: 'x.md' }
  ), /size/);
});

test('schema: title must have ko/en/ja non-empty', () => {
  assert.throws(() => validateNode(
    { id: 'x', cat: 'ops', size: 3, title: { ko: 'x', en: '', ja: 'x' } },
    { knownCats: KNOWN_CATS, file: 'x.md' }
  ), /title\.en/);
});

test('schema: refs url must be http(s)', () => {
  assert.throws(() => validateNode(
    {
      id: 'x', cat: 'ops', size: 3, title: { ko: 'x', en: 'x', ja: 'x' },
      refs: [{ url: 'javascript:alert(1)', title: 'bad', lang: 'en' }],
    },
    { knownCats: KNOWN_CATS, file: 'x.md' }
  ), /http/);
});

test('schema: refs lang must be in allowed set', () => {
  assert.throws(() => validateNode(
    {
      id: 'x', cat: 'ops', size: 3, title: { ko: 'x', en: 'x', ja: 'x' },
      refs: [{ url: 'https://example.com', title: 'x', lang: 'fr' }],
    },
    { knownCats: KNOWN_CATS, file: 'x.md' }
  ), /lang/);
});
```

- [ ] **Step 2: Run to confirm failure**

```bash
node --test scripts/compile-nodes.test.mjs
```

- [ ] **Step 3: Implement schema.mjs**

```javascript
// scripts/compile-nodes/schema.mjs
const ALLOWED_LANGS = new Set(['ko', 'en', 'ja', 'other']);
const ALLOWED_SIZES = new Set([1, 2, 3]);

export function validateNode(node, { knownCats, file }) {
  const where = (field) => `${file}: ${field}`;
  if (!node.id || typeof node.id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(node.id)) {
    throw new Error(`${where('id')}: missing or invalid id (lowercase/digits/hyphen; got ${JSON.stringify(node.id)})`);
  }
  if (!knownCats.has(node.cat)) {
    throw new Error(`${where('cat')}: unknown cat ${JSON.stringify(node.cat)}`);
  }
  if (!ALLOWED_SIZES.has(node.size)) {
    throw new Error(`${where('size')}: size must be 1, 2, or 3 (got ${JSON.stringify(node.size)})`);
  }
  if (!node.title || typeof node.title !== 'object') {
    throw new Error(`${where('title')}: missing title object`);
  }
  for (const lang of ['ko', 'en', 'ja']) {
    const t = node.title[lang];
    if (typeof t !== 'string' || !t.trim()) {
      throw new Error(`${where(`title.${lang}`)}: required non-empty string`);
    }
  }
  if (node.refs !== undefined) {
    if (!Array.isArray(node.refs)) throw new Error(`${where('refs')}: must be array`);
    node.refs.forEach((r, i) => {
      if (!r || typeof r !== 'object') throw new Error(`${where(`refs[${i}]`)}: must be object`);
      if (typeof r.url !== 'string' || !/^https?:\/\//.test(r.url)) {
        throw new Error(`${where(`refs[${i}].url`)}: must start with http:// or https:// (got ${JSON.stringify(r.url)})`);
      }
      if (typeof r.title !== 'string' || !r.title.trim()) {
        throw new Error(`${where(`refs[${i}].title`)}: required non-empty string`);
      }
      if (r.lang !== undefined && !ALLOWED_LANGS.has(r.lang)) {
        throw new Error(`${where(`refs[${i}].lang`)}: must be one of ${[...ALLOWED_LANGS].join('/')}`);
      }
    });
  }
  if (node.extraEdges !== undefined && !Array.isArray(node.extraEdges)) {
    throw new Error(`${where('extraEdges')}: must be array`);
  }
}
```

- [ ] **Step 4: Run tests**

```bash
node --test scripts/compile-nodes.test.mjs
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/compile-nodes/schema.mjs scripts/compile-nodes.test.mjs
git commit -m "feat(compile): add schema validator for frontmatter nodes

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Node/edge merge with legacy fallback

**Files:**
- Create: `scripts/compile-nodes/merge.mjs`
- Modify: `scripts/compile-nodes.test.mjs`

- [ ] **Step 1: Append failing tests**

```javascript
import { mergeNodes, normalizeEdges, validateEdges } from './compile-nodes/merge.mjs';

test('merge: md overrides legacy by id', () => {
  const legacy = [{ id: 'a', cat: 'ops', size: 3, title: { ko: 'L', en: 'L', ja: 'L' }, body: {} }];
  const md = [{ id: 'a', cat: 'ops', size: 3, title: { ko: 'M', en: 'M', ja: 'M' }, _source: 'md' }];
  const { byId, stats } = mergeNodes({ legacy, md });
  assert.equal(byId.a.title.ko, 'M');
  assert.equal(stats.fromMarkdown, 1);
  assert.equal(stats.fromLegacy, 0);
});

test('merge: legacy kept when no md with same id', () => {
  const legacy = [{ id: 'a', cat: 'ops', size: 3, title: { ko: 'L', en: 'L', ja: 'L' } }];
  const md = [];
  const { byId, stats } = mergeNodes({ legacy, md });
  assert.ok(byId.a);
  assert.equal(stats.fromLegacy, 1);
});

test('edges: normalize dedupes [a,b] and [b,a]', () => {
  const out = normalizeEdges([['b', 'a'], ['a', 'b'], ['a', 'c']]);
  assert.deepEqual(out, [['a', 'b'], ['a', 'c']]);
});

test('edges: validateEdges flags endpoint missing in byId', () => {
  const byId = { a: {}, b: {} };
  const { valid, broken } = validateEdges([['a', 'b'], ['a', 'ghost']], byId);
  assert.deepEqual(valid, [['a', 'b']]);
  assert.deepEqual(broken, [['a', 'ghost']]);
});
```

- [ ] **Step 2: Run to confirm failure**

```bash
node --test scripts/compile-nodes.test.mjs
```

- [ ] **Step 3: Implement merge.mjs**

```javascript
// scripts/compile-nodes/merge.mjs

export function mergeNodes({ legacy, md }) {
  const byId = {};
  const stats = { fromMarkdown: 0, fromLegacy: 0 };
  for (const n of legacy) {
    byId[n.id] = { ...n, _source: 'legacy' };
  }
  for (const n of md) {
    if (byId[n.id]) {
      byId[n.id] = { ...n, _source: 'md' };
    } else {
      byId[n.id] = { ...n, _source: 'md' };
    }
  }
  for (const id of Object.keys(byId)) {
    if (byId[id]._source === 'md') stats.fromMarkdown++;
    else stats.fromLegacy++;
  }
  return { byId, stats };
}

export function normalizeEdges(edges) {
  const seen = new Set();
  const out = [];
  for (const [s, t] of edges) {
    if (s === t) continue;
    const [a, b] = s < t ? [s, t] : [t, s];
    const key = `${a}\x00${b}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push([a, b]);
  }
  out.sort((x, y) => x[0].localeCompare(y[0]) || x[1].localeCompare(y[1]));
  return out;
}

export function validateEdges(edges, byId) {
  const valid = [];
  const broken = [];
  for (const e of edges) {
    if (byId[e[0]] && byId[e[1]]) valid.push(e);
    else broken.push(e);
  }
  return { valid, broken };
}
```

- [ ] **Step 4: Run tests**

```bash
node --test scripts/compile-nodes.test.mjs
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/compile-nodes/merge.mjs scripts/compile-nodes.test.mjs
git commit -m "feat(compile): add node/edge merge with legacy fallback

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: compile-nodes.mjs CLI orchestration

**Files:**
- Create: `scripts/compile-nodes.mjs`
- Modify: `scripts/compile-nodes.test.mjs`

- [ ] **Step 1: Append integration tests**

```javascript
import { compile } from './compile-nodes.mjs';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

function setupFixture() {
  const root = mkdtempSync(join(tmpdir(), 'vibemap-compile-'));
  mkdirSync(join(root, 'raw', 'nodes'), { recursive: true });
  mkdirSync(join(root, 'docs'), { recursive: true });
  mkdirSync(join(root, 'scripts'), { recursive: true });
  return root;
}

test('compile: end-to-end with single md + legacy fallback', async () => {
  const root = setupFixture();
  writeFileSync(join(root, 'raw/nodes/dsql.md'), `---
id: dsql
cat: ops
size: 3
title:
  ko: Aurora DSQL
  en: Aurora DSQL
  ja: Aurora DSQL
refs:
  - url: https://example.com/dsql
    title: Docs
    lang: en
---
## ko
Aurora DSQL은 [[serverless]] 스택의 SQL 옵션이다.

## en
Aurora DSQL is the SQL option in the [[serverless]] stack.

## ja
Aurora DSQLは[[serverless]]スタックのSQLオプションだ。
`);
  writeFileSync(join(root, 'scripts/legacy-nodes.js'), `
const LEGACY_NODES = [{ id: 'serverless', cat: 'ops', size: 1, title: { ko: 'S', en: 'S', ja: 'S' }, body: { ko: 'x', en: 'x', ja: 'x' } }];
module.exports = LEGACY_NODES;
globalThis.LEGACY_NODES = LEGACY_NODES;
`);
  writeFileSync(join(root, 'scripts/legacy-edges.js'), `
const LEGACY_EDGES = [];
module.exports = LEGACY_EDGES;
globalThis.LEGACY_EDGES = LEGACY_EDGES;
`);
  writeFileSync(join(root, 'docs/data.js'), `
window.VIBEMAP_DATA = {
  categories: {
    ops: { color: "#f87171", label: { ko: "운영", en: "Ops", ja: "運用" } }
  },
  nodes: [],
  edges: []
};
`);

  const result = await compile({ projectRoot: root, strict: false });
  assert.equal(result.stats.fromMarkdown, 1);
  assert.equal(result.stats.fromLegacy, 1);
  assert.ok(result.edges.some(([a, b]) => (a === 'dsql' && b === 'serverless') || (a === 'serverless' && b === 'dsql')));
});

test('compile: output is deterministic across two runs', async () => {
  const root = setupFixture();
  // (reuse same fixture setup from above — write helper)
  // … same writes as previous test …
  writeFileSync(join(root, 'raw/nodes/dsql.md'), `---
id: dsql
cat: ops
size: 3
title:
  ko: Aurora DSQL
  en: Aurora DSQL
  ja: Aurora DSQL
---
## ko
[[serverless]]
## en
[[serverless]]
## ja
[[serverless]]
`);
  writeFileSync(join(root, 'scripts/legacy-nodes.js'), `
const LEGACY_NODES = [{ id: 'serverless', cat: 'ops', size: 1, title: { ko: 'S', en: 'S', ja: 'S' }, body: { ko: 'x', en: 'x', ja: 'x' } }];
module.exports = LEGACY_NODES;
globalThis.LEGACY_NODES = LEGACY_NODES;
`);
  writeFileSync(join(root, 'scripts/legacy-edges.js'), `
const LEGACY_EDGES = [];
module.exports = LEGACY_EDGES;
globalThis.LEGACY_EDGES = LEGACY_EDGES;
`);
  writeFileSync(join(root, 'docs/data.js'), `
window.VIBEMAP_DATA = { categories: { ops: { color: "#f87171", label: { ko: "운영", en: "Ops", ja: "運用" } } }, nodes: [], edges: [] };
`);
  const a = await compile({ projectRoot: root, strict: false });
  const b = await compile({ projectRoot: root, strict: false });
  assert.equal(a.dataJsBytes, b.dataJsBytes);
  assert.equal(a.nodesJsonBytes, b.nodesJsonBytes);
});
```

- [ ] **Step 2: Run to confirm failure**

```bash
node --test scripts/compile-nodes.test.mjs
```

- [ ] **Step 3: Implement compile-nodes.mjs**

```javascript
#!/usr/bin/env node
// scripts/compile-nodes.mjs
// Compile raw/nodes/*.md + scripts/legacy-*.js → docs/data.js + docs/nodes.json

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

import { parseFrontmatter } from './compile-nodes/frontmatter.mjs';
import { renderSection, splitLanguageSections } from './compile-nodes/markdown.mjs';
import { validateNode } from './compile-nodes/schema.mjs';
import { mergeNodes, normalizeEdges, validateEdges } from './compile-nodes/merge.mjs';

async function loadDataCategories(projectRoot) {
  const src = await readFile(join(projectRoot, 'docs', 'data.js'), 'utf8');
  const ctx = vm.createContext({ window: {} });
  vm.runInContext(src, ctx, { filename: 'docs/data.js' });
  if (!ctx.window.VIBEMAP_DATA) throw new Error('docs/data.js must set window.VIBEMAP_DATA');
  return ctx.window.VIBEMAP_DATA.categories;
}

async function loadLegacy(projectRoot) {
  const nodesPath = join(projectRoot, 'scripts', 'legacy-nodes.js');
  const edgesPath = join(projectRoot, 'scripts', 'legacy-edges.js');
  const ctx = vm.createContext({ module: { exports: null }, globalThis: {} });
  const nodesSrc = await readFile(nodesPath, 'utf8');
  vm.runInContext(nodesSrc, ctx, { filename: nodesPath });
  const nodes = ctx.module.exports || ctx.globalThis.LEGACY_NODES || [];
  const ctx2 = vm.createContext({ module: { exports: null }, globalThis: {} });
  const edgesSrc = await readFile(edgesPath, 'utf8');
  vm.runInContext(edgesSrc, ctx2, { filename: edgesPath });
  const edges = ctx2.module.exports || ctx2.globalThis.LEGACY_EDGES || [];
  return { nodes, edges };
}

async function loadMarkdownNodes(projectRoot, knownCats) {
  const dir = join(projectRoot, 'raw', 'nodes');
  let files;
  try { files = await readdir(dir); } catch { return []; }
  const md = [];
  for (const file of files.sort()) {
    if (!file.endsWith('.md')) continue;
    const path = join(dir, file);
    const src = await readFile(path, 'utf8');
    const { data, body } = parseFrontmatter(src);
    const sections = splitLanguageSections(body);
    const bodyHtml = {};
    const wikiLinks = new Set();
    for (const lang of ['ko', 'en', 'ja']) {
      const { html, wikiLinks: links } = renderSection(sections[lang]);
      bodyHtml[lang] = html;
      for (const l of links) wikiLinks.add(l);
    }
    validateNode(data, { knownCats, file });
    md.push({
      ...data,
      _bodyHtml: bodyHtml,
      _wikiLinks: [...wikiLinks],
    });
  }
  return md;
}

function buildEdges({ mdNodes, legacyEdges, byId }) {
  const all = [];
  for (const n of mdNodes) {
    for (const target of n._wikiLinks) all.push([n.id, target]);
    for (const target of (n.extraEdges || [])) all.push([n.id, target]);
  }
  for (const e of legacyEdges) all.push([e[0], e[1]]);
  const normalized = normalizeEdges(all);
  return validateEdges(normalized, byId);
}

function serializeDataJs(categories, nodes, edges) {
  const catKeys = Object.keys(categories);
  const catOrder = Object.fromEntries(catKeys.map((k, i) => [k, i]));
  const nodeLines = [...nodes].sort((a, b) => {
    const ca = catOrder[a.cat] ?? 999;
    const cb = catOrder[b.cat] ?? 999;
    if (ca !== cb) return ca - cb;
    return a.id.localeCompare(b.id);
  }).map((n) => {
    const title = JSON.stringify(n.title);
    return `  { id: ${JSON.stringify(n.id)}, cat: ${JSON.stringify(n.cat)}, size: ${n.size}, title: ${title} }`;
  }).join(',\n');
  const catLiteral = catKeys.map((k) => {
    const c = categories[k];
    return `    ${k}: { color: ${JSON.stringify(c.color)}, label: ${JSON.stringify(c.label)} }`;
  }).join(',\n');
  const edgeLines = edges.map(([a, b]) => `  [${JSON.stringify(a)}, ${JSON.stringify(b)}]`).join(',\n');
  return `// AUTO-GENERATED by scripts/compile-nodes.mjs — do not edit by hand.\n` +
    `// Source: raw/nodes/*.md + scripts/legacy-*.js\n` +
    `window.VIBEMAP_DATA = {\n` +
    `  categories: {\n${catLiteral}\n  },\n` +
    `  nodes: [\n${nodeLines}\n  ],\n` +
    `  edges: [\n${edgeLines}\n  ]\n` +
    `};\n`;
}

function serializeNodesJson(byId, generatedAt) {
  const nodes = {};
  const sortedIds = Object.keys(byId).sort();
  for (const id of sortedIds) {
    const n = byId[id];
    if (n._source === 'md') {
      nodes[id] = { body: n._bodyHtml, refs: n.refs || [] };
    } else {
      // legacy fallback — wrap short body fields as <p>...</p>
      const body = {};
      for (const lang of ['ko', 'en', 'ja']) {
        const raw = (n.body && n.body[lang]) || '';
        body[lang] = raw ? `<p>${escapeHtml(raw).replace(/\n/g, '<br>')}</p>` : '';
      }
      nodes[id] = { body, refs: [] };
    }
  }
  return JSON.stringify({
    version: '1',
    generatedAt,
    source: 'raw/nodes/ + scripts/legacy-*.js',
    nodes,
  }, null, 2) + '\n';
}

function escapeHtml(s) {
  return String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

export async function compile({ projectRoot, strict = false, now }) {
  const categories = await loadDataCategories(projectRoot);
  const knownCats = new Set(Object.keys(categories));
  const legacy = await loadLegacy(projectRoot);
  const md = await loadMarkdownNodes(projectRoot, knownCats);
  const { byId, stats } = mergeNodes({ legacy: legacy.nodes, md });
  const { valid: validEdges, broken } = buildEdges({ mdNodes: md, legacyEdges: legacy.edges, byId });

  if (broken.length > 0) {
    const msg = `⚠ ${broken.length} broken edge(s): ${broken.map(e => `[${e[0]}→${e[1]}]`).join(', ')}`;
    console.warn(msg);
    if (strict) throw new Error(msg);
  }

  const nodesArr = Object.values(byId);
  const dataJs = serializeDataJs(categories, nodesArr, validEdges);
  const nodesJson = serializeNodesJson(byId, now ?? new Date().toISOString());
  await writeFile(join(projectRoot, 'docs', 'data.js'), dataJs, 'utf8');
  await writeFile(join(projectRoot, 'docs', 'nodes.json'), nodesJson, 'utf8');

  return {
    stats: { ...stats, total: nodesArr.length, edges: validEdges.length, brokenEdges: broken.length },
    edges: validEdges,
    dataJsBytes: Buffer.byteLength(dataJs),
    nodesJsonBytes: Buffer.byteLength(nodesJson),
  };
}

async function main() {
  const strict = process.argv.includes('--strict');
  const here = dirname(fileURLToPath(import.meta.url));
  const projectRoot = join(here, '..');
  const result = await compile({ projectRoot, strict });
  const { stats } = result;
  console.log(`docs/data.js + docs/nodes.json written: ${stats.total} node(s) (${stats.fromMarkdown} md, ${stats.fromLegacy} legacy), ${stats.edges} edges, ${stats.brokenEdges} broken.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => { console.error(err.stack || err.message); process.exit(1); });
}
```

- [ ] **Step 4: Run tests**

```bash
node --test scripts/compile-nodes.test.mjs
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/compile-nodes.mjs scripts/compile-nodes.test.mjs
git commit -m "feat(compile): add compile-nodes CLI with determinism tests

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Write 8 markdown nodes (AWS 6 + samples 2)

**Files:**
- Create: `raw/nodes/dsql.md`, `raw/nodes/memorydb.md`, `raw/nodes/glue.md`, `raw/nodes/athena.md`, `raw/nodes/lake-formation.md`, `raw/nodes/kinesis.md`, `raw/nodes/intent.md`, `raw/nodes/vibe.md`

Each file must:
- Use the exact frontmatter schema validated by Task 4.
- Include `## ko`, `## en`, `## ja` sections each with 150-400 words of substantive content.
- Use at least 3 `[[wiki-link]]` references to existing node ids (search `scripts/legacy-nodes.js` for valid ids).
- Follow the project tone: analogies for non-developers, contrast with adjacent concepts, concrete when-to-use bullet list.

- [ ] **Step 1: Write `raw/nodes/dsql.md`**

Frontmatter:

```yaml
---
id: dsql
cat: ops
size: 3
title:
  ko: Aurora DSQL
  en: Aurora DSQL
  ja: Aurora DSQL
refs:
  - url: https://docs.aws.amazon.com/aurora-dsql/latest/userguide/what-is-aurora-dsql.html
    title: What is Aurora DSQL (AWS Docs)
    lang: en
  - url: https://aws.amazon.com/blogs/aws/introducing-amazon-aurora-dsql/
    title: Introducing Amazon Aurora DSQL
    lang: en
extraEdges: []
---
```

Body guidance:
- ko/en/ja: open with "serverless distributed SQL" one-liner; contrast with `[[dynamodb]]` (NoSQL) and `[[sql]]` (traditional Postgres); position alongside `[[lambda]]` + `[[apigw]]` for a full serverless stack; include a "언제 쓰나 / When to use / いつ使うか" `###` section with `-` bullets referencing `[[sql-vs-nosql]]`, multi-region, full-serverless backend.
- Include at least: `[[serverless]]`, `[[dynamodb]]`, `[[sql]]`, `[[lambda]]`, `[[apigw]]`, `[[sql-vs-nosql]]`.

- [ ] **Step 2: Write `raw/nodes/memorydb.md`**

Frontmatter:

```yaml
---
id: memorydb
cat: ops
size: 3
title:
  ko: MemoryDB for Redis
  en: MemoryDB for Redis
  ja: MemoryDB for Redis
refs:
  - url: https://docs.aws.amazon.com/memorydb/latest/devguide/what-is-memorydb.html
    title: What is Amazon MemoryDB (AWS Docs)
    lang: en
  - url: https://aws.amazon.com/blogs/database/announcing-amazon-memorydb-with-valkey/
    title: MemoryDB with Valkey
    lang: en
extraEdges: []
---
```

Body guidance:
- Position as "Redis가 데이터베이스로 승격된 버전 — 휘발성 캐시가 아닌 durable primary store".
- Wiki-links: `[[serverless]]`, `[[dynamodb]]` (대비: NoSQL 옵션), `[[cost]]`, `[[lambda]]`, `[[monitoring]]`.
- Contrast with ElastiCache (capacity vs durability), mention Valkey migration.

- [ ] **Step 3: Write `raw/nodes/glue.md`**

Frontmatter:

```yaml
---
id: glue
cat: data
size: 3
title:
  ko: AWS Glue
  en: AWS Glue
  ja: AWS Glue
refs:
  - url: https://docs.aws.amazon.com/glue/latest/dg/what-is-glue.html
    title: What is AWS Glue (AWS Docs)
    lang: en
  - url: https://aws.amazon.com/glue/features/
    title: AWS Glue Features
    lang: en
extraEdges: []
---
```

Body guidance: "데이터 레이크 운영의 ETL + 데이터 카탈로그 하나로 묶은 관리형 서비스". Wiki-links: `[[datalake]]`, `[[s3]]`, `[[athena]]`, `[[lake-formation]]`, `[[dw]]`.

- [ ] **Step 4: Write `raw/nodes/athena.md`**

```yaml
---
id: athena
cat: data
size: 3
title:
  ko: Athena
  en: Athena
  ja: Athena
refs:
  - url: https://docs.aws.amazon.com/athena/latest/ug/what-is.html
    title: What is Amazon Athena
    lang: en
extraEdges: []
---
```

Body: "S3에 놓인 파일을 SQL 한 줄로 질의. 서버 없음, 쿼리당 과금." Wiki-links: `[[s3]]`, `[[sql]]`, `[[datalake]]`, `[[glue]]`, `[[lake-formation]]`.

- [ ] **Step 5: Write `raw/nodes/lake-formation.md`**

```yaml
---
id: lake-formation
cat: data
size: 3
title:
  ko: Lake Formation
  en: Lake Formation
  ja: Lake Formation
refs:
  - url: https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html
    title: What is AWS Lake Formation
    lang: en
extraEdges: []
---
```

Body: "데이터 레이크의 권한·거버넌스 레이어. 누가 어떤 테이블·컬럼을 볼 수 있는지 IAM보다 세밀하게 제어." Wiki-links: `[[datalake]]`, `[[s3]]`, `[[glue]]`, `[[athena]]`.

- [ ] **Step 6: Write `raw/nodes/kinesis.md`**

```yaml
---
id: kinesis
cat: data
size: 3
title:
  ko: Kinesis
  en: Kinesis
  ja: Kinesis
refs:
  - url: https://docs.aws.amazon.com/streams/latest/dev/introduction.html
    title: What is Amazon Kinesis Data Streams
    lang: en
  - url: https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html
    title: Amazon Data Firehose
    lang: en
extraEdges: []
---
```

Body: "데이터 레이크로 '흐르는' 데이터를 흘려보내는 파이프. 스트림(Streams) + 전달(Firehose) 2계열". Wiki-links: `[[datalake]]`, `[[s3]]`, `[[lambda]]`, `[[monitoring]]`.

- [ ] **Step 7: Write `raw/nodes/intent.md` (sample migration)**

Re-author the existing `intent` node (currently in `scripts/legacy-nodes.js`) as markdown. Preserve the core message ("Ship intent, not code", four sections Why/What/Not/Learnings, Intent lifecycle). Frontmatter:

```yaml
---
id: intent
cat: mindset
size: 2
title:
  ko: 의도공학
  en: Intent Engineering
  ja: 意図工学
refs:
  - url: https://intent.roboco.io/
    title: Intent Engineering (roboco.io)
    lang: en
extraEdges: []
---
```

Body must be richer than current one-paragraph body in legacy. Include: `[[requirements]]`, `[[prompt-eng]]`, `[[context-eng]]`, `[[convergence]]`, `[[small-steps]]`, `[[simplify]]`, `[[vibe]]`.

- [ ] **Step 8: Write `raw/nodes/vibe.md` (sample migration)**

Re-author the core `vibe` node.

```yaml
---
id: vibe
cat: core
size: 1
title:
  ko: 바이브 코딩
  en: Vibe Coding
  ja: バイブコーディング
refs:
  - url: https://roboco.io/posts/the-art-of-vibe-coding/
    title: The Art of Vibe Coding (roboco.io)
    lang: en
extraEdges: []
---
```

Body: origin story (sarcasm → craft), principle bullets (good inputs, small steps, leverage automation, simplify boldly, never write how), relationship to `[[intent]]`, `[[tdd]]`, `[[claude-code]]`, `[[pitfalls]]`.

- [ ] **Step 9: Build and verify all 8 nodes compile**

```bash
node scripts/compile-nodes.mjs
```

Expected stdout contains: `... 8 md, 40 legacy) ...` (assuming 48 legacy snapshot; intent+vibe get overridden → md: 8, legacy: 46 - 2 = 44. Wait: 48 legacy - 2 overridden = 46; + 6 new from md = 54 total, 8 md, 46 legacy). Actually the stat counts by final `_source`, so: md=8, legacy=40 (48 legacy - 8 that are now in md? No — 2 of the 8 md IDs overlap with legacy, so md=8, legacy=46, total=54). Verify the actual numbers and ensure no broken-edge warnings fail the build.

- [ ] **Step 10: Commit**

```bash
git add raw/nodes/ docs/data.js docs/nodes.json
git commit -m "$(cat <<'EOF'
content: add 8 knowledge-base nodes (AWS 6 + samples 2)

- AWS data lake: glue, athena, lake-formation, kinesis
- AWS serverless persistence: dsql, memorydb
- Sample migrations: intent, vibe (richer bodies)

Regenerates docs/data.js and docs/nodes.json from raw/nodes/.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Wire `compile` into Makefile and ingest.sh

**Files:**
- Modify: `Makefile`
- Modify: `scripts/ingest.sh`

- [ ] **Step 1: Add `compile` target and adjust dependencies**

Edit `Makefile`. Change the `.PHONY` line and add/modify these targets:

```makefile
.PHONY: help test build compile ingest serve serve-bg stop open e2e clean

compile:
	node scripts/compile-nodes.mjs

build: compile
	node scripts/build-references.mjs

ingest: compile
	bash scripts/ingest.sh
```

Also update the `help` output to list `compile`.

- [ ] **Step 2: Update `scripts/ingest.sh` to run compile first**

Replace the file body (keeping shebang) with:

```bash
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
```

- [ ] **Step 3: Extend `make e2e` to check `nodes.json`**

In the `e2e:` recipe, after the `REFS_STATUS` check, add a parallel check for `nodes.json`:

```makefile
		NODES_STATUS=$$(curl -s -o /dev/null -w "%{http_code}" $(URL)nodes.json); \
		if [ "$$NODES_STATUS" != "200" ]; then \
			echo "WARN: nodes.json 응답 $$NODES_STATUS (사이트는 fallback 으로 정상 작동)"; \
		else \
			NODE_COUNT=$$(curl -s $(URL)nodes.json | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{const j=JSON.parse(d);console.log(Object.keys(j.nodes).length)})'); \
			echo "nodes.json: $$NODE_COUNT node bodies"; \
		fi; \
```

- [ ] **Step 4: Verify the build pipeline**

```bash
make test && make compile && make build
```

Expected: tests pass, `docs/data.js` + `docs/nodes.json` + `docs/references.json` all regenerate, no errors.

- [ ] **Step 5: Commit**

```bash
git add Makefile scripts/ingest.sh
git commit -m "build(pipeline): chain compile-nodes into Makefile and ingest.sh

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Frontend — fetch nodes.json and split body source

**Files:**
- Modify: `docs/app.jsx`
- Modify: `docs/i18n.js`

- [ ] **Step 1: Add `nodesDetail` state and fetch in `docs/app.jsx`**

In the `App` function (around line 26 where `references` is declared), add:

```javascript
const [nodesDetail, setNodesDetail] = useState({ nodes: {} });
```

And in the useEffect block (after the `references.json` fetch around line 136), add a parallel fetch:

```javascript
useEffect(() => {
  let cancelled = false;
  fetch('./nodes.json', { cache: 'no-cache' })
    .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then((data) => {
      if (cancelled) return;
      if (data && data.version === '1' && data.nodes) setNodesDetail(data);
      else console.warn('nodes.json: unsupported schema; using empty fallback');
    })
    .catch((err) => console.warn('nodes.json unavailable:', err.message));
  return () => { cancelled = true; };
}, []);
```

- [ ] **Step 2: Replace `getText(activeNode.body, lang)` with nodes.json lookup**

On the line currently rendering `<div className="panel-text">{getText(activeNode.body, lang)}</div>` (around line 498), replace with:

```jsx
<div
  className="panel-text"
  ref={panelBodyRef}
  dangerouslySetInnerHTML={{
    __html: (nodesDetail.nodes[activeNode.id]?.body?.[lang])
      || '<p class="panel-text-empty">본문을 불러오는 중…</p>',
  }}
/>
```

Declare `const panelBodyRef = useRef(null);` near the other refs (top of `App`).

- [ ] **Step 3: Update search filter to include nodes.json body text**

Find the search filter (around line 179 `const t = getText(n.title, lang).toLowerCase();`). Extend to also match body HTML stripped of tags:

```javascript
const filteredNodes = useMemo(() => {
  if (!query.trim()) return nodes;
  const q = query.trim().toLowerCase();
  return nodes.filter((n) => {
    const title = getText(n.title, lang).toLowerCase();
    if (title.includes(q)) return true;
    const bodyHtml = nodesDetail.nodes[n.id]?.body?.[lang] || '';
    const bodyText = bodyHtml.replace(/<[^>]+>/g, ' ').toLowerCase();
    return bodyText.includes(q);
  });
}, [nodes, query, lang, nodesDetail]);
```

Replace existing filter logic with `filteredNodes`. (If the current code uses inline `.filter`, refactor to this memoized list.)

- [ ] **Step 4: Serve locally and verify in browser**

```bash
make serve-bg && make open
# Verify that DSQL panel loads rich HTML body; legacy nodes load short <p>.
make stop
```

- [ ] **Step 5: Commit**

```bash
git add docs/app.jsx
git commit -m "feat(ui): fetch nodes.json and render HTML body in panel

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Frontend — 3-tier panel layout + wiki-link delegation

**Files:**
- Modify: `docs/app.jsx`
- Modify: `docs/i18n.js`
- Modify: `docs/styles.css`

- [ ] **Step 1: Add i18n keys in `docs/i18n.js`**

Inside each language block (`ko`, `en`, `ja`), add:

- ko: `refsCurated: "관련 링크",` and `moreReading: "더 읽을 자료",`
- en: `refsCurated: "Related",` and `moreReading: "More reading",`
- ja: `refsCurated: "関連リンク",` and `moreReading: "関連資料",`

Keep `referencesTitle` for back-compat but `moreReading` is the new label used in the new panel section; update the old `references` section to use `moreReading`.

- [ ] **Step 2: Add curated refs section to panel (between body and connections)**

In `docs/app.jsx`, inside the panel JSX (around line 498), insert after `<div className="panel-text">…</div>` and before `<div className="panel-section"><div className="panel-section-label">{t.connections}</div>`:

```jsx
{((nodesDetail.nodes[activeNode.id]?.refs?.length) ?? 0) > 0 && (
  <div className="panel-section refs-curated">
    <div className="panel-section-label">{t.refsCurated}</div>
    <ul className="refs-list">
      {nodesDetail.nodes[activeNode.id].refs.map((ref, i) => (
        <li key={i} className="refs-item">
          <a className="refs-link" href={ref.url} target="_blank" rel="noreferrer noopener">{ref.title}</a>
          <span className={`refs-lang refs-lang-${ref.lang || 'other'}`}>
            {(ref.lang || 'other').toUpperCase()}
          </span>
        </li>
      ))}
    </ul>
  </div>
)}
```

- [ ] **Step 3: Rename the existing `references` section label**

Change `{t.referencesTitle}` to `{t.moreReading}` on the existing references.json section (around line 522).

- [ ] **Step 4: Add wiki-link click delegation**

Attach `onClick` to the panel body div from Task 9, replacing the previous `<div className="panel-text" ref={…}>`:

```jsx
<div
  className="panel-text"
  onClick={(e) => {
    const a = e.target.closest && e.target.closest('a.wiki-link');
    if (!a) return;
    e.preventDefault();
    const id = a.getAttribute('data-node-id');
    if (id && DATA.nodes && nodes.find(n => n.id === id)) setActiveId(id);
  }}
  dangerouslySetInnerHTML={{
    __html: (nodesDetail.nodes[activeNode.id]?.body?.[lang])
      || '<p class="panel-text-empty">본문을 불러오는 중…</p>',
  }}
/>
```

- [ ] **Step 5: Add styles in `docs/styles.css`**

Append to the file:

```css
.panel .panel-text h3 {
  margin: 1.2em 0 .4em;
  font-size: .95rem;
  color: var(--muted, #b5b3cf);
  letter-spacing: .02em;
}
.panel .panel-text ul {
  margin: .4em 0 .8em;
  padding-left: 1.2em;
}
.panel .panel-text li { margin: .2em 0; }
.panel .panel-text strong { color: #e8e4ff; }
.panel .panel-text a.wiki-link {
  color: #c4b5fd;
  border-bottom: 1px dashed currentColor;
  cursor: pointer;
  text-decoration: none;
}
.panel .panel-text a.wiki-link:hover {
  background: rgba(167, 139, 250, .16);
  color: #e8e4ff;
}
.panel .panel-section.refs-curated { margin-top: 1.2em; }
.panel .panel-text-empty { opacity: .5; font-style: italic; }
```

- [ ] **Step 6: Verify in browser**

```bash
make serve-bg && make open
```

Click `dsql` → should show rich body with wiki-links, "관련 링크" section with AWS docs, "연결 노드" chips, and (if matched) "더 읽을 자료". Click a `[[serverless]]` wiki-link → panel switches to serverless node. Legacy nodes (e.g., `git`) still render with short body and no curated refs.

```bash
make stop
```

- [ ] **Step 7: Commit**

```bash
git add docs/app.jsx docs/i18n.js docs/styles.css
git commit -m "feat(ui): 3-tier panel with curated refs and wiki-link navigation

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: Update CLAUDE.md ownership section

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Replace the "두 레이어로 분리된 데이터 소유권" section**

Find the table that currently has two rows (`docs/data.js` and `docs/references.json`). Replace with a three-row table:

```markdown
### 세 레이어로 분리된 데이터 소유권

| 레이어 | 파일 | 소유자 | 변경 시 |
|-------|-----|-------|--------|
| 노드 SSOT (신규) | `raw/nodes/<id>.md` | 사람 | 직접 편집 |
| 노드 생성물 | `docs/data.js` + `docs/nodes.json` | 자동 | `scripts/compile-nodes.mjs`로 재생성, 손으로 편집 금지 |
| 외부 근거 자료 | `docs/references.json` | 자동 | `scripts/build-references.mjs`로 재생성, 손으로 편집 금지 |

`raw/nodes/<id>.md`가 존재하는 노드는 compile-nodes가 해당 파일에서 body/refs/edges를 추출하고, 없는 노드는 `scripts/legacy-nodes.js` / `scripts/legacy-edges.js` 스냅샷에서 짧은 body를 유지한다. legacy는 점진적으로 raw/nodes로 이식 후 최종 삭제 예정.
```

- [ ] **Step 2: Update Commands section to mention `make compile`**

Insert between `make test` and `# 지식기반 재생성`:

```bash
# 노드 재컴파일 — raw/nodes/ + legacy-*.js → docs/data.js + docs/nodes.json
make compile
```

- [ ] **Step 3: Update Conventions — "절대 수정 금지 파일"**

Replace the line about `docs/references.json` with:

```markdown
- **절대 수정 금지 파일** (자동 생성): `docs/data.js`, `docs/nodes.json`, `docs/references.json`. 수정하려면 raw/nodes/*.md 또는 raw/urls/ + 해당 빌드 스크립트를 고치세요.
```

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for 3-layer data ownership

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 12: Regenerate references.json (optional content step)

**Files:**
- Optional create: `raw/urls/aws-*.md` if/when wanting richer "more reading" for AWS nodes.
- Modify: `docs/references.json` (regenerated)

- [ ] **Step 1: Regenerate references.json against current raw/urls/**

Even without new URL corpus, the AWS nodes' titles (dsql, memorydb, glue, athena, lake-formation, kinesis) might already match some existing articles. Regenerate:

```bash
node scripts/build-references.mjs
```

If `_unmapped` grows or any critical node has zero matches, that's OK — the "더 읽을 자료" section just won't render for that node, which is fine since "관련 링크" (frontmatter refs) already provides canonical links.

- [ ] **Step 2: Commit**

```bash
git add docs/references.json
git commit -m "chore(refs): regenerate references.json for new AWS nodes

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 13: Full E2E verification

**Files:**
- None — verification only.

- [ ] **Step 1: Run full test suite**

```bash
make test
```

Expected: all tests pass (build-references + compile-nodes).

- [ ] **Step 2: Run E2E**

```bash
make e2e
```

Expected:
- HTTP 200 for `/`, `/references.json`, `/nodes.json`.
- stdout prints `references.json: N/M nodes mapped` and `nodes.json: K node bodies` (K should be 54).

- [ ] **Step 3: Manual browser checklist**

Open `http://localhost:8080/`. Verify:

| Check | Expected |
|-------|---------|
| Graph renders with ripple animation | Yes |
| Search `dsql` → click node → panel opens | Rich HTML body with wiki-links visible |
| Panel sections present for dsql | 본문 + 관련 링크 (2 items) + 연결 노드 (chips) + 더 읽을 자료 (0 or more) |
| Click `[[serverless]]` wiki-link in body | Panel switches to serverless node |
| Click `git` node (legacy) | Short body renders, 관련 링크 section hidden, connections chips visible |
| Language toggle ko/en/ja | Body switches; panel section labels switch |
| Click `intent` node | Rich markdown body (not old one-paragraph) |

- [ ] **Step 4: Stop server**

```bash
make stop
```

- [ ] **Step 5: No commit needed — this is verification only**

---

### Task 14: Deploy to production (GitHub Pages)

**Files:**
- None — deployment action.

- [ ] **Step 1: Final git status check**

```bash
git status
git log --oneline origin/main..HEAD
```

Expected: clean working tree, all Task 1-12 commits present ahead of origin/main.

- [ ] **Step 2: Push to origin/main**

```bash
git push origin main
```

GitHub Pages redeploys from `main` branch `/docs` folder automatically.

- [ ] **Step 3: Verify production deployment**

Wait ~30-60 seconds for GitHub Pages rebuild. Then:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://vibemap.roboco.io/
curl -s -o /dev/null -w "%{http_code}\n" https://vibemap.roboco.io/nodes.json
```

Both should be `200`. If `nodes.json` is `404`, GitHub Pages may still be caching; retry after 2 minutes.

- [ ] **Step 4: Smoke test production**

Open <https://vibemap.roboco.io/> in a browser. Repeat a subset of Task 13's Step 3 checklist (dsql + wiki-link navigation + language toggle). If any fails, investigate — likely a production-only path issue (absolute vs relative fetch URLs, cache, etc.).

- [ ] **Step 5: Done. No commit.**

---

## Self-Review Checklist

1. **Spec coverage**
   - §3 architecture → Tasks 1 (legacy snapshot), 6 (compile CLI), 8 (Makefile/ingest)
   - §4 formats → Tasks 2/3/4/5 (parsers, schema, merge), 7 (markdown files)
   - §5 compile-nodes responsibilities → Tasks 2-6
   - §6 frontend → Tasks 9-10
   - §7 testing → Tasks 2-6 (unit), 8 (e2e HTTP check), 13 (manual)
   - §8 migration checklist → covered by Tasks 1-11 in order
   - §10 risks → markdown sanitization tested in Task 3; nodes.json size re-verified in Task 13; legacy+md confusion documented in Task 11
   - ✅ all sections traced to at least one task

2. **Placeholder scan**
   - No TBD/TODO/"fill in later" in code steps
   - Content for all parser/schema/merge code provided verbatim
   - Markdown file bodies (Task 7) deliberately left to author — this is intentional creative writing, not a code placeholder. Guidance provided instead of stub.

3. **Type/method consistency**
   - `parseFrontmatter({data, body})` — used in Task 6 as `{ data, body }` ✓
   - `renderSection({html, wikiLinks})` — used in Task 6 ✓
   - `splitLanguageSections(src) → {ko, en, ja}` — used in Task 6 ✓
   - `validateNode(node, {knownCats, file})` — matches Task 4 signature ✓
   - `mergeNodes({legacy, md}) → {byId, stats}` — matches Task 5 ✓
   - `normalizeEdges(edges)` / `validateEdges(edges, byId) → {valid, broken}` — matches Task 5 ✓
   - `compile({projectRoot, strict, now}) → {stats, edges, dataJsBytes, nodesJsonBytes}` — matches Task 6 test expectations ✓

4. **No silent gaps**
   - Tests before implementation in every parser task (TDD)
   - Commit after every task (frequent commits)
   - Deployment (Task 14) is explicit and gated by passing E2E (Task 13)

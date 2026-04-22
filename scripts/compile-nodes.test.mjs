import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFrontmatter } from './compile-nodes/frontmatter.mjs';
import { renderSection, splitLanguageSections } from './compile-nodes/markdown.mjs';
import { validateNode } from './compile-nodes/schema.mjs';
import { mergeNodes, normalizeEdges, validateEdges } from './compile-nodes/merge.mjs';
import { compile } from './compile-nodes.mjs';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const KNOWN_CATS = new Set(['core', 'mindset', 'ai', 'tool', 'tech', 'data', 'ops']);

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

test('markdown: renders paragraph, bold, italic, h3, ul', () => {
  const { html, wikiLinks } = renderSection(`This is **bold** and *italic*.

### 소제목

- item one
- item two`);
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
  // Input not wrapped in angle-bracket tag form is still escaped.
  // Inline-authored HTML (raw tags) is rejected by the parser — see next test.
  const { html } = renderSection('Beware &lt;script&gt;alert(1)&lt;/script&gt; input.');
  assert.ok(!html.includes('<script>'));
});

test('markdown: rejects code blocks (triple-backtick)', () => {
  assert.throws(() => renderSection('```\ncode\n```'), /code block/i);
});

test('markdown: rejects tables, images and raw html', () => {
  assert.throws(() => renderSection('| a | b |\n| - | - |'), /table/i);
  assert.throws(() => renderSection('![alt](foo.png)'), /image/i);
  assert.throws(() => renderSection('<div>raw</div>'), /raw html/i);
});

test('markdown: rejects inline code, ordered lists, h1/h2', () => {
  assert.throws(() => renderSection('some `inline code`'), /inline code/i);
  assert.throws(() => renderSection('1. first\n2. second'), /ordered/i);
  assert.throws(() => renderSection('## not allowed'), /header/i);
});

test('markdown: splitLanguageSections finds ## ko/en/ja', () => {
  const src = `## ko
한국어 본문.

## en
English body.

## ja
日本語本文。`;
  const sections = splitLanguageSections(src);
  assert.equal(sections.ko.trim(), '한국어 본문.');
  assert.equal(sections.en.trim(), 'English body.');
  assert.equal(sections.ja.trim(), '日本語本文。');
});

test('markdown: splitLanguageSections requires all three', () => {
  assert.throws(() => splitLanguageSections('## ko\nonly korean'), /missing/i);
});

test('schema: accepts a complete valid node', () => {
  const node = {
    id: 'dsql', cat: 'ops', size: 3,
    title: { ko: 'Aurora DSQL', en: 'Aurora DSQL', ja: 'Aurora DSQL' },
    refs: [{ url: 'https://docs.aws.amazon.com/aurora-dsql/', title: 'Docs', lang: 'en' }],
  };
  assert.doesNotThrow(() => validateNode(node, { knownCats: KNOWN_CATS, file: 'x.md' }));
});

test('schema: missing id throws with file path', () => {
  assert.throws(
    () => validateNode({ cat: 'ops' }, { knownCats: KNOWN_CATS, file: 'missing-id.md' }),
    (err) => /missing-id\.md/.test(err.message) && /id/.test(err.message)
  );
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

test('merge: md overrides legacy by id', () => {
  const legacy = [{ id: 'a', cat: 'ops', size: 3, title: { ko: 'L', en: 'L', ja: 'L' }, body: {} }];
  const md = [{ id: 'a', cat: 'ops', size: 3, title: { ko: 'M', en: 'M', ja: 'M' } }];
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

function setupCompileFixture() {
  const root = mkdtempSync(join(tmpdir(), 'vibemap-compile-'));
  mkdirSync(join(root, 'raw', 'nodes'), { recursive: true });
  mkdirSync(join(root, 'docs'), { recursive: true });
  mkdirSync(join(root, 'scripts'), { recursive: true });
  writeFileSync(join(root, 'docs/data.js'),
    `window.VIBEMAP_DATA = { categories: { ops: { color: "#f87171", label: { ko: "운영", en: "Ops", ja: "運用" } } }, nodes: [], edges: [] };\n`);
  writeFileSync(join(root, 'scripts/legacy-nodes.js'),
    `const LEGACY_NODES = [{ id: 'serverless', cat: 'ops', size: 1, title: { ko: 'S', en: 'S', ja: 'S' }, body: { ko: 'x', en: 'x', ja: 'x' } }];\nmodule.exports = LEGACY_NODES;\nglobalThis.LEGACY_NODES = LEGACY_NODES;\n`);
  writeFileSync(join(root, 'scripts/legacy-edges.js'),
    `const LEGACY_EDGES = [];\nmodule.exports = LEGACY_EDGES;\nglobalThis.LEGACY_EDGES = LEGACY_EDGES;\n`);
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
  return root;
}

test('compile: end-to-end with single md + legacy fallback', async () => {
  const root = setupCompileFixture();
  const result = await compile({ projectRoot: root, strict: false, now: '2026-04-22T00:00:00.000Z' });
  assert.equal(result.stats.fromMarkdown, 1);
  assert.equal(result.stats.fromLegacy, 1);
  assert.ok(result.edges.some(([a, b]) => (a === 'dsql' && b === 'serverless') || (a === 'serverless' && b === 'dsql')));
});

test('compile: output is deterministic across two runs', async () => {
  const root = setupCompileFixture();
  const a = await compile({ projectRoot: root, strict: false, now: '2026-04-22T00:00:00.000Z' });
  const b = await compile({ projectRoot: root, strict: false, now: '2026-04-22T00:00:00.000Z' });
  assert.equal(a.dataJsBytes, b.dataJsBytes);
  assert.equal(a.nodesJsonBytes, b.nodesJsonBytes);
});

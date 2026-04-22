import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFrontmatter } from './compile-nodes/frontmatter.mjs';
import { renderSection, splitLanguageSections } from './compile-nodes/markdown.mjs';

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

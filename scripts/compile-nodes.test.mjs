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

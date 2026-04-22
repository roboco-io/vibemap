import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeText } from './build-references.mjs';

test('normalizeText: lowercases', () => {
  assert.equal(normalizeText('Intent Engineering'), 'intent engineering');
});

test('normalizeText: replaces punctuation with spaces', () => {
  assert.equal(normalizeText('intent-engineering,good!'), 'intent engineering good');
});

test('normalizeText: collapses whitespace', () => {
  assert.equal(normalizeText('  hello\n\tworld  '), 'hello world');
});

test('normalizeText: applies NFKC (fullwidth to ascii)', () => {
  assert.equal(normalizeText('ＩＮＴＥＮＴ'), 'intent');
});

test('normalizeText: preserves Korean and Japanese chars', () => {
  assert.equal(normalizeText('의도공학! 意図工学'), '의도공학 意図工学');
});

test('normalizeText: handles null/undefined/empty', () => {
  assert.equal(normalizeText(''), '');
  assert.equal(normalizeText(null), '');
  assert.equal(normalizeText(undefined), '');
});

import { buildKeywordIndex } from './build-references.mjs';

test('buildKeywordIndex: extracts id + titles for each language', () => {
  const nodes = [
    { id: 'intent', title: { ko: '의도공학', en: 'Intent Engineering', ja: '意図工学' } },
    { id: 'vibe',   title: { ko: '바이브 코딩', en: 'Vibe Coding',      ja: 'バイブコーディング' } },
  ];
  const idx = buildKeywordIndex(nodes);
  assert.equal(idx.length, 2);

  const intent = idx.find(e => e.nodeId === 'intent');
  assert.ok(intent.keywords.includes('intent'));
  assert.ok(intent.keywords.includes('의도공학'));
  assert.ok(intent.keywords.includes('intent engineering'));
  assert.ok(intent.keywords.includes('意図工学'));
});

test('buildKeywordIndex: deduplicates and ignores empty', () => {
  const nodes = [{ id: 'x', title: { ko: '테스트', en: 'test', ja: 'test' } }];
  const idx = buildKeywordIndex(nodes);
  const kw = idx[0].keywords;
  assert.equal(new Set(kw).size, kw.length);
});

test('buildKeywordIndex: tolerates missing title languages', () => {
  const nodes = [{ id: 'x', title: { ko: '테스트' } }];
  const idx = buildKeywordIndex(nodes);
  assert.ok(idx[0].keywords.includes('x'));
  assert.ok(idx[0].keywords.includes('테스트'));
});

import { normalizeUrl } from './build-references.mjs';

test('normalizeUrl: strips trailing slash', () => {
  assert.equal(normalizeUrl('https://example.com/'), 'https://example.com');
  assert.equal(normalizeUrl('https://example.com/path/'), 'https://example.com/path');
});

test('normalizeUrl: removes utm_* query params', () => {
  assert.equal(
    normalizeUrl('https://example.com/?utm_source=x&utm_medium=y'),
    'https://example.com'
  );
  assert.equal(
    normalizeUrl('https://example.com/?utm_source=x&keep=1'),
    'https://example.com?keep=1'
  );
});

test('normalizeUrl: preserves hash and non-utm query', () => {
  assert.equal(
    normalizeUrl('https://example.com/post?id=1#section'),
    'https://example.com/post?id=1#section'
  );
});

test('normalizeUrl: returns original on invalid', () => {
  assert.equal(normalizeUrl('not a url'), 'not a url');
  assert.equal(normalizeUrl(''), '');
});

import { detectLang } from './build-references.mjs';

test('detectLang: Hangul dominated → ko', () => {
  assert.equal(detectLang('의도공학은 왜 중요한가?'), 'ko');
});

test('detectLang: Hiragana/Katakana dominated → ja', () => {
  assert.equal(detectLang('バイブコーディングとは何か'), 'ja');
});

test('detectLang: Latin dominated → en', () => {
  assert.equal(detectLang('Ship intent, not code.'), 'en');
});

test('detectLang: mixed but Korean majority → ko', () => {
  assert.equal(detectLang('Intent — 의도공학은 가장 중요하다'), 'ko');
});

test('detectLang: CJK ambiguous (only kanji) → ja', () => {
  assert.equal(detectLang('意図工学'), 'ja');
});

test('detectLang: empty or unknown → other', () => {
  assert.equal(detectLang(''), 'other');
  assert.equal(detectLang('12345 !!!'), 'other');
});

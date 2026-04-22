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

import { matchNodes } from './build-references.mjs';

const SAMPLE_INDEX = [
  { nodeId: 'intent', keywords: ['intent', '의도공학', 'intent engineering', '意図工学'] },
  { nodeId: 'vibe',   keywords: ['vibe', '바이브 코딩', 'vibe coding'] },
  { nodeId: 'git',    keywords: ['git'] },
];

test('matchNodes: finds exact keyword in text', () => {
  const hits = matchNodes('Intent Engineering is the new craft.', SAMPLE_INDEX, { maxPerSource: 3, minScore: 0.1 });
  assert.ok(hits.length >= 1);
  assert.equal(hits[0].nodeId, 'intent');
  assert.ok(hits[0].score > 0);
});

test('matchNodes: ranks multiple matches by score', () => {
  const hits = matchNodes('의도공학과 바이브 코딩', SAMPLE_INDEX, { maxPerSource: 3, minScore: 0.1 });
  const ids = hits.map(h => h.nodeId);
  assert.ok(ids.includes('intent'));
  assert.ok(ids.includes('vibe'));
});

test('matchNodes: respects maxPerSource cap', () => {
  const hits = matchNodes('intent vibe git', SAMPLE_INDEX, { maxPerSource: 2, minScore: 0.1 });
  assert.equal(hits.length, 2);
});

test('matchNodes: drops below minScore', () => {
  const longText = 'a'.repeat(1000) + ' git ' + 'b'.repeat(1000);
  const hits = matchNodes(longText, SAMPLE_INDEX, { maxPerSource: 3, minScore: 1.5 });
  assert.equal(hits.length, 0);
});

test('matchNodes: no matches returns empty array', () => {
  const hits = matchNodes('unrelated content about weather', SAMPLE_INDEX, { maxPerSource: 3, minScore: 0.1 });
  assert.deepEqual(hits, []);
});

test('matchNodes: word-boundary — "git" does not match "github" by default', () => {
  const hits = matchNodes('check out github for this.', SAMPLE_INDEX, { maxPerSource: 3, minScore: 0.1 });
  const gitHit = hits.find(h => h.nodeId === 'git');
  assert.equal(gitHit, undefined);
});

import { extractSources } from './build-references.mjs';

test('extractSources: reads top-level sources array', () => {
  const graph = {
    sources: [
      { url: 'https://a.example.com/', title: 'A', excerpt: 'about intent' },
      { url: 'https://b.example.com/', title: 'B', summary: 'about vibe' },
    ],
  };
  const srcs = extractSources(graph);
  assert.equal(srcs.length, 2);
  assert.equal(srcs[0].url, 'https://a.example.com/');
  assert.equal(srcs[0].title, 'A');
  assert.equal(srcs[0].text, 'A about intent');
});

test('extractSources: falls back to nodes with url metadata', () => {
  const graph = {
    nodes: [
      { id: 'n1', label: 'Intent Eng', source: { url: 'https://x.example/' }, description: 'ship intent' },
      { id: 'n2', label: 'NoUrl' },
    ],
  };
  const srcs = extractSources(graph);
  assert.equal(srcs.length, 1);
  assert.equal(srcs[0].url, 'https://x.example/');
  assert.equal(srcs[0].title, 'Intent Eng');
});

test('extractSources: uses name/summary when title/excerpt absent', () => {
  const graph = {
    sources: [
      { url: 'https://c.example/', name: 'C', summary: 'sum' },
    ],
  };
  const srcs = extractSources(graph);
  assert.equal(srcs[0].title, 'C');
  assert.equal(srcs[0].text, 'C sum');
});

test('extractSources: dedupes by normalized URL (last wins for metadata)', () => {
  const graph = {
    sources: [
      { url: 'https://a.example/', title: 'First' },
      { url: 'https://a.example', title: 'Second' },
    ],
  };
  const srcs = extractSources(graph);
  assert.equal(srcs.length, 1);
});

test('extractSources: returns empty on missing graph', () => {
  assert.deepEqual(extractSources({}), []);
  assert.deepEqual(extractSources(null), []);
});

import { buildReferences } from './build-references.mjs';

const FIXTURE_NODES = [
  { id: 'intent', title: { ko: '의도공학', en: 'Intent Engineering', ja: '意図工学' } },
  { id: 'vibe',   title: { ko: '바이브 코딩', en: 'Vibe Coding',      ja: 'バイブコーディング' } },
  { id: 'git',    title: { ko: 'Git', en: 'Git', ja: 'Git' } },
];

test('buildReferences: produces expected schema', () => {
  const graph = {
    sources: [
      { url: 'https://intent.roboco.io/', title: 'Intent Engineering', excerpt: 'Ship intent, not code — a framework for the AI era.' },
      { url: 'https://roboco.io/posts/the-art-of-vibe-coding/', title: 'The Art of Vibe Coding', excerpt: '바이브 코딩은 AI와 대화하는 기술이다.' },
    ],
  };
  const out = buildReferences(FIXTURE_NODES, graph);

  assert.equal(out.version, '1');
  assert.equal(out.source, 'graphify-out/graph.json');
  assert.ok(out.generatedAt);
  assert.equal(typeof out.stats.totalSources, 'number');
  assert.equal(typeof out.stats.mappedNodes, 'number');
  assert.equal(typeof out.stats.unmappedCount, 'number');

  assert.ok(Array.isArray(out.byNode.intent));
  assert.ok(out.byNode.intent.length >= 1);
  assert.equal(out.byNode.intent[0].url, 'https://intent.roboco.io');
  assert.equal(out.byNode.intent[0].lang, 'en');
  assert.ok(out.byNode.intent[0].score > 0);
});

test('buildReferences: unmatched sources go to _unmapped', () => {
  const graph = {
    sources: [
      { url: 'https://weather.example/', title: 'Weather Report', excerpt: 'sunny and warm today' },
    ],
  };
  const out = buildReferences(FIXTURE_NODES, graph);
  assert.equal(out.stats.unmappedCount, 1);
  assert.equal(out._unmapped.length, 1);
  assert.equal(Object.keys(out.byNode).length, 0);
});

test('buildReferences: caps references per node at MAX_PER_NODE (10)', () => {
  const sources = [];
  for (let i = 0; i < 15; i++) {
    sources.push({ url: `https://ex${i}.example/`, title: `Intent Engineering ${i}`, excerpt: 'ship intent' });
  }
  const out = buildReferences(FIXTURE_NODES, { sources });
  assert.ok(out.byNode.intent.length <= 10);
});

test('buildReferences: byNode only includes keys with at least one ref', () => {
  const graph = {
    sources: [
      { url: 'https://a.example/', title: 'Intent', excerpt: '' },
    ],
  };
  const out = buildReferences(FIXTURE_NODES, graph);
  assert.ok('intent' in out.byNode);
  assert.ok(!('git' in out.byNode));
  assert.ok(!('vibe' in out.byNode));
});

test('buildReferences: deterministic order (score desc, then url)', () => {
  const graph = {
    sources: [
      { url: 'https://b.example/', title: 'Intent Engineering B', excerpt: 'intent intent' },
      { url: 'https://a.example/', title: 'Intent Engineering A', excerpt: 'intent intent' },
    ],
  };
  const out = buildReferences(FIXTURE_NODES, graph);
  const urls = out.byNode.intent.map(r => r.url);
  assert.deepEqual(urls.slice().sort(), urls);
});

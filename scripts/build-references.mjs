// scripts/build-references.mjs
// graphify의 graph.json을 VibeMap용 docs/references.json으로 변환한다.

export function normalizeText(input) {
  if (input == null) return '';
  const s = String(input);
  return s
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\p{P}\p{S}]+/gu, ' ')   // 구두점·기호를 공백으로
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isAsciiWord(s) {
  return /^[a-z0-9][a-z0-9 ]*$/i.test(s);
}

function countMatches(normalizedText, keyword) {
  if (!keyword) return { count: 0, totalLen: 0 };
  const kw = keyword;
  if (isAsciiWord(kw)) {
    const re = new RegExp(`\\b${escapeRegex(kw)}\\b`, 'g');
    const matches = normalizedText.match(re) || [];
    return { count: matches.length, totalLen: matches.length * kw.length };
  }
  if (!kw.trim()) return { count: 0, totalLen: 0 };
  let count = 0, from = 0;
  while (true) {
    const idx = normalizedText.indexOf(kw, from);
    if (idx < 0) break;
    count++;
    from = idx + kw.length;
  }
  return { count, totalLen: count * kw.length };
}

function pick(obj, keys) {
  for (const k of keys) {
    if (obj && typeof obj[k] === 'string' && obj[k].trim()) return obj[k];
  }
  return '';
}

function sourceFromRecord(rec) {
  if (!rec || typeof rec !== 'object') return null;
  const rawUrl = rec.url || rec.source?.url || rec.source_url || '';
  if (!rawUrl) return null;
  const title = pick(rec, ['title', 'label', 'name']);
  const excerpt = pick(rec, ['excerpt', 'summary', 'description']);
  const text = [title, excerpt].filter(Boolean).join(' ');
  return {
    url: rawUrl,
    normalizedUrl: normalizeUrl(rawUrl),
    title: title || rawUrl,
    excerpt: excerpt.slice(0, 200),
    text,
  };
}

// graphify 그래프는 한 URL에 수십 개 노드가 연결된다. URL 단위로 aggregate 해야
// "이 자료는 어떤 개념들을 담는가"가 풍부한 텍스트로 표현되어 48노드 매칭률이 오른다.
function mergeSourceIntoMap(byUrl, src) {
  const existing = byUrl.get(src.normalizedUrl);
  if (!existing) {
    byUrl.set(src.normalizedUrl, { ...src });
    return;
  }
  // 같은 URL을 가진 추가 레코드: 첫 번째 레코드를 대표로 삼고(graphify 루트 노드가
  // 가장 먼저 나오므로 파일의 주 제목이 유지됨), text 는 누적해 매칭 풍부도를 올린다.
  if (src.text) {
    existing.text = existing.text ? `${existing.text} · ${src.text}` : src.text;
  }
  if (src.excerpt && !existing.excerpt) {
    existing.excerpt = src.excerpt;
  }
}

export function extractSources(graph) {
  if (!graph || typeof graph !== 'object') return [];
  const byUrl = new Map();

  const candidates = [];
  if (Array.isArray(graph.sources)) candidates.push(...graph.sources);
  if (Array.isArray(graph.documents)) candidates.push(...graph.documents);
  if (Array.isArray(graph.nodes)) candidates.push(...graph.nodes);

  for (const rec of candidates) {
    const src = sourceFromRecord(rec);
    if (!src) continue;
    mergeSourceIntoMap(byUrl, src);
  }
  return Array.from(byUrl.values());
}

export function matchNodes(rawText, keywordIndex, opts = {}) {
  const { maxPerSource = 3, minScore = 0.3 } = opts;
  const text = normalizeText(rawText);
  if (!text) return [];

  const results = [];
  for (const entry of keywordIndex) {
    let hits = 0;
    let lenSum = 0;
    const matchedKeywords = [];
    for (const kw of entry.keywords) {
      const { count, totalLen } = countMatches(text, kw);
      if (count > 0) {
        hits += count;
        lenSum += totalLen;
        matchedKeywords.push(kw);
      }
    }
    if (hits === 0) continue;
    const score = hits * 1.0 + (lenSum / Math.max(1, text.length)) * 2.0;
    if (score < minScore) continue;
    results.push({ nodeId: entry.nodeId, score, matchedKeywords });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, maxPerSource);
}

export function detectLang(text) {
  if (typeof text !== 'string' || !text.trim()) return 'other';

  let hangul = 0, kana = 0, kanji = 0, latin = 0;
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (cp >= 0xAC00 && cp <= 0xD7AF) hangul++;          // 한글 음절
    else if (cp >= 0x3040 && cp <= 0x30FF) kana++;       // 히라가나·가타카나
    else if (cp >= 0x4E00 && cp <= 0x9FFF) kanji++;      // CJK 한자
    else if ((cp >= 0x41 && cp <= 0x5A) || (cp >= 0x61 && cp <= 0x7A)) latin++;
  }

  if (hangul === 0 && kana === 0 && kanji === 0 && latin === 0) return 'other';

  if (hangul >= kana && hangul >= kanji && hangul >= latin && hangul > 0) return 'ko';
  if (kana > 0 || kanji > 0) {
    if (kana + kanji >= hangul && kana + kanji >= latin) return 'ja';
  }
  if (latin > 0 && latin >= hangul && latin >= kana + kanji) return 'en';
  return 'other';
}

export function normalizeUrl(input) {
  if (typeof input !== 'string' || !input) return input ?? '';
  let url;
  try {
    url = new URL(input);
  } catch {
    return input;
  }
  // utm_* 쿼리 제거
  const keep = [];
  for (const [k, v] of url.searchParams) {
    if (!k.toLowerCase().startsWith('utm_')) keep.push([k, v]);
  }
  url.search = '';
  for (const [k, v] of keep) url.searchParams.append(k, v);

  // trailing slash 제거
  let out = url.toString();
  // pathname이 '/'인 경우: query나 hash 없으면 trailing slash 제거, 있으면 /?query → ?query
  if (url.pathname === '/') {
    if (!url.search && !url.hash) {
      out = out.replace(/\/$/, '');
    } else {
      // https://example.com/?keep=1 → https://example.com?keep=1
      out = out.replace(/\/(\?|#)/, '$1');
    }
  } else if (out.endsWith('/')) {
    out = out.slice(0, -1);
  }
  return out;
}

export function buildKeywordIndex(nodes) {
  return nodes.map((n) => {
    const raw = [
      n.id,
      n.title?.ko,
      n.title?.en,
      n.title?.ja,
    ].filter((s) => typeof s === 'string' && s.trim().length > 0);

    const keywords = Array.from(new Set(raw.map(normalizeText).filter(Boolean)));
    return { nodeId: n.id, keywords };
  });
}

const MAX_PER_NODE = 10;
const MIN_SCORE = 0.3;
const MAX_PER_SOURCE = 3;

export function buildReferences(nodes, graph, opts = {}) {
  const generatedAt = opts.now ?? new Date().toISOString();
  const source = opts.sourcePath ?? 'graphify-out/graph.json';

  const index = buildKeywordIndex(nodes);
  const sources = extractSources(graph);

  const byNode = {};
  const unmapped = [];

  for (const src of sources) {
    const hits = matchNodes(src.text || src.title, index, {
      maxPerSource: MAX_PER_SOURCE,
      minScore: MIN_SCORE,
    });
    if (hits.length === 0) {
      unmapped.push({ url: src.normalizedUrl || src.url, title: src.title, score: 0 });
      continue;
    }
    for (const hit of hits) {
      (byNode[hit.nodeId] ||= []).push({
        url: src.normalizedUrl || src.url,
        title: src.title,
        excerpt: src.excerpt,
        lang: detectLang(src.text || src.title),
        score: Number(hit.score.toFixed(3)),
      });
    }
  }

  for (const id of Object.keys(byNode)) {
    byNode[id].sort((a, b) => (b.score - a.score) || a.url.localeCompare(b.url));
    byNode[id] = byNode[id].slice(0, MAX_PER_NODE);
  }

  return {
    version: '1',
    generatedAt,
    source,
    stats: {
      totalSources: sources.length,
      mappedNodes: Object.keys(byNode).length,
      unmappedCount: unmapped.length,
    },
    byNode,
    _unmapped: unmapped,
  };
}

// ── CLI ─────────────────────────────────────────────
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

async function loadVibemapData(projectRoot) {
  const dataPath = join(projectRoot, 'docs', 'data.js');
  const src = await readFile(dataPath, 'utf8');
  const context = vm.createContext({ window: {} });
  vm.runInContext(src, context, { filename: dataPath });
  if (!context.window.VIBEMAP_DATA) {
    throw new Error(`data.js did not set window.VIBEMAP_DATA (path: ${dataPath})`);
  }
  return context.window.VIBEMAP_DATA;
}

async function loadGraph(projectRoot) {
  const graphPath = join(projectRoot, 'graphify-out', 'graph.json');
  try {
    const raw = await readFile(graphPath, 'utf8');
    return { path: graphPath, data: JSON.parse(raw) };
  } catch (err) {
    if (err.code === 'ENOENT') return { path: graphPath, data: {} };
    throw err;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const strict = args.includes('--strict');

  const here = dirname(fileURLToPath(import.meta.url));
  const projectRoot = join(here, '..');

  const data = await loadVibemapData(projectRoot);
  const { data: graph } = await loadGraph(projectRoot);

  const output = buildReferences(data.nodes, graph);

  const outPath = join(projectRoot, 'docs', 'references.json');
  await writeFile(outPath, JSON.stringify(output, null, 2) + '\n', 'utf8');

  const { totalSources, mappedNodes, unmappedCount } = output.stats;
  console.log(`docs/references.json written: ${totalSources} source(s), ${mappedNodes} mapped node(s), ${unmappedCount} unmapped.`);

  if (strict && unmappedCount > 0) {
    console.error(`FAIL (--strict): ${unmappedCount} unmapped source(s).`);
    process.exit(2);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

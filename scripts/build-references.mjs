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

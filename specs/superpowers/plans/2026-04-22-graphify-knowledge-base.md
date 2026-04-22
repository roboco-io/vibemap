# VibeMap × graphify 지식기반 통합 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** graphify로 ingest한 외부 원본 자료를 VibeMap의 48개 노드에 자동 매핑해, 각 노드 슬라이드 패널에 "근거 자료" 섹션을 노출한다.

**Architecture:** `raw/` 디렉토리의 원본 corpus를 graphify가 `graphify-out/graph.json`으로 만든 뒤, `scripts/build-references.mjs`가 48노드 id/title 키워드로 매칭해 `docs/references.json`을 산출한다. VibeMap(`docs/app.jsx`)은 이 파일을 로드해 패널에 섹션을 추가한다. `docs/data.js`는 수정하지 않으며, `docs/references.json`이 없거나 실패해도 사이트는 정상 동작한다.

**Tech Stack:** Node ≥18 (내장 test runner `node:test`), 의존성 없는 ES Module(`.mjs`), graphify CLI(이미 설치됨), React 18 UMD + @babel/standalone(기존 구성), bash.

**Spec:** `specs/superpowers/specs/2026-04-22-graphify-knowledge-base-design.md`

**저장소 레이아웃 가정:** GitHub Pages는 `main` 브랜치의 `/docs` 폴더를 서빙한다. 웹 자원은 모두 `docs/` 아래에 있고, 파이프라인 아티팩트(`raw/`, `graphify-out/`, `scripts/`)는 저장소 루트에 있다.

**경로 규칙 (모든 태스크에 적용):**
- 브라우저가 로드하는 모든 파일(`index.html`, `app.jsx`, `data.js`, `i18n.js`, `sim.js`, `styles.css`, `CNAME`, `references.json`)은 **`docs/` 아래**에 있다. 본 플랜의 모든 `git add`, `mv`, `cp`, `cat` 명령에서 이들 파일을 참조할 때는 `docs/<file>` 경로를 사용한다.
- 로컬 서버는 `python3 -m http.server 8080 -d docs &` 로 실행해 `docs/`를 루트로 서빙한다. `app.jsx`의 `fetch('./references.json')`은 같은 `docs/` 안의 파일을 fetch한다.
- `scripts/`, `raw/`, `graphify-out/`, `package.json`은 저장소 루트에 유지한다.

---

## 파일 구조 요약

**신규 파일:**
- `package.json` (루트) — Node ES Module 선언 + npm 스크립트. 의존성 없음.
- `raw/.gitkeep` — 초기 빈 corpus 디렉토리 유지
- `raw/.gitignore` — 대용량 바이너리 제외
- `graphify-out/.gitkeep` — graphify 출력 디렉토리 유지
- `scripts/build-references.mjs` — 핵심 변환기 (여러 내부 함수)
- `scripts/build-references.test.mjs` — Node 내장 테스트
- `scripts/ingest.sh` — `graphify update` + `build-references` 체인 래퍼
- `docs/references.json` — 초기 빈 스키마 (git 커밋, 브라우저가 fetch)

**수정 파일:**
- `docs/i18n.js` — `referencesTitle` 키 3개 언어 추가
- `docs/app.jsx` — `references.json` fetch + 패널에 "근거 자료" 섹션
- `docs/styles.css` — `.refs` 섹션 스타일
- `README.md` — 지식 수집·업데이트 워크플로우 섹션 추가

**손대지 않는 파일:** `docs/data.js`, `docs/sim.js`, `docs/index.html`, `docs/CNAME`

---

## Task 1: 프로젝트 부트스트랩 (package.json, raw/, graphify-out/)

**Files:**
- Create: `package.json`
- Create: `raw/.gitkeep`
- Create: `raw/.gitignore`
- Create: `graphify-out/.gitkeep`

이 저장소는 지금 `package.json`이 없는 정적 사이트다. ES Module(`.mjs`)과 Node 내장 테스트 러너만 쓰기 위해 최소한의 `package.json`을 둔다. 어떤 npm 의존성도 추가하지 않는다.

- [ ] **Step 1: `package.json` 생성**

```json
{
  "name": "vibemap",
  "version": "1.0.0",
  "description": "비개발자를 위한 바이브 코딩 학습 지도",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test scripts/",
    "build:refs": "node scripts/build-references.mjs",
    "build:refs:strict": "node scripts/build-references.mjs --strict",
    "ingest": "bash scripts/ingest.sh"
  }
}
```

`"type": "module"`이 있어야 `.mjs`뿐 아니라 `.js`도 ES Module로 해석된다. 단 `docs/data.js`·`docs/i18n.js`·`docs/sim.js`·`docs/app.jsx`는 브라우저가 `<script>`로 읽으므로 Node의 module 타입과 무관하다. `package.json`은 저장소 루트에 두며, `docs/` 안에 두지 않는다(GitHub Pages 서빙 폴더가 npm 메타로 오염되지 않도록).

- [ ] **Step 2: `raw/.gitkeep` 생성 (빈 파일)**

```bash
touch raw/.gitkeep
```

- [ ] **Step 3: `raw/.gitignore` 생성**

```
# 대용량 바이너리 제외 — 필요시 DVC/LFS 검토
*.mp4
*.mov
*.zip
*.tar.gz
*.parquet
# 시스템 파일
.DS_Store
```

- [ ] **Step 4: `graphify-out/.gitkeep` 생성 (빈 파일)**

```bash
touch graphify-out/.gitkeep
```

- [ ] **Step 5: Node 버전 확인**

Run: `node --version`
Expected: v18 이상 (v18.x, v20.x, v22.x 모두 OK; `node --test`가 있어야 함)

만약 18 미만이면 여기서 멈추고 사용자에게 알린다.

- [ ] **Step 6: 커밋**

```bash
git add package.json raw/.gitkeep raw/.gitignore graphify-out/.gitkeep
git commit -m "chore: bootstrap Node package and corpus directories for graphify"
```

---

## Task 2: `normalizeText` 순수 함수 (TDD)

**Files:**
- Create: `scripts/build-references.mjs`
- Create: `scripts/build-references.test.mjs`

매칭 전에 텍스트를 정규화한다(NFKC → 소문자 → 구두점 공백화 → 공백 단일화).

- [ ] **Step 1: 실패하는 테스트 작성**

`scripts/build-references.test.mjs`에 다음 내용을 만든다:

```js
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
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `node --test scripts/build-references.test.mjs`
Expected: FAIL — 파일 없음(Cannot find module './build-references.mjs') 또는 export 없음

- [ ] **Step 3: 최소 구현**

`scripts/build-references.mjs`에 다음을 넣는다:

```js
// scripts/build-references.mjs
// graphify의 graph.json을 VibeMap용 references.json으로 변환한다.

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
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `node --test scripts/build-references.test.mjs`
Expected: 6개 테스트 PASS

- [ ] **Step 5: 커밋**

```bash
git add scripts/build-references.mjs scripts/build-references.test.mjs
git commit -m "feat(refs): add normalizeText with NFKC + punctuation handling"
```

---

## Task 3: `buildKeywordIndex` — 48노드에서 키워드 사전 만들기 (TDD)

**Files:**
- Modify: `scripts/build-references.mjs`
- Modify: `scripts/build-references.test.mjs`

48노드의 `id`, `title.ko`, `title.en`, `title.ja`를 키워드 집합으로 모은다. 결과는 `[{ nodeId, keywords: string[] }]` 형태.

- [ ] **Step 1: 실패하는 테스트 추가**

`scripts/build-references.test.mjs` 끝에 추가:

```js
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
  // 'test'는 en과 ja에 모두 있고 id에는 'x' — 중복 없어야 함
  assert.equal(new Set(kw).size, kw.length);
});

test('buildKeywordIndex: tolerates missing title languages', () => {
  const nodes = [{ id: 'x', title: { ko: '테스트' } }];
  const idx = buildKeywordIndex(nodes);
  assert.ok(idx[0].keywords.includes('x'));
  assert.ok(idx[0].keywords.includes('테스트'));
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `node --test scripts/build-references.test.mjs`
Expected: 위 3개 FAIL (buildKeywordIndex 없음), 이전 6개는 여전히 PASS

- [ ] **Step 3: 구현 추가**

`scripts/build-references.mjs`에 덧붙인다:

```js
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
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `node --test scripts/build-references.test.mjs`
Expected: 9개 테스트 PASS

- [ ] **Step 5: 커밋**

```bash
git add scripts/build-references.mjs scripts/build-references.test.mjs
git commit -m "feat(refs): buildKeywordIndex from id + multilingual titles"
```

---

## Task 4: `normalizeUrl` — URL 중복 제거용 정규화 (TDD)

**Files:**
- Modify: `scripts/build-references.mjs`
- Modify: `scripts/build-references.test.mjs`

URL을 비교하려면 trailing slash와 `utm_*` 쿼리를 지워야 한다.

- [ ] **Step 1: 실패하는 테스트 추가**

```js
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
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `node --test scripts/build-references.test.mjs`
Expected: 4개 신규 FAIL

- [ ] **Step 3: 구현 추가**

```js
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

  // trailing slash 제거 (루트 `/`만 있는 경우 포함)
  let out = url.toString();
  if (out.endsWith('/') && url.pathname !== '/') out = out.slice(0, -1);
  if (url.pathname === '/' && !url.search && !url.hash) {
    out = out.replace(/\/$/, '');
  }
  return out;
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `node --test scripts/build-references.test.mjs`
Expected: 13개 PASS

- [ ] **Step 5: 커밋**

```bash
git add scripts/build-references.mjs scripts/build-references.test.mjs
git commit -m "feat(refs): normalizeUrl strips trailing slash and utm_* params"
```

---

## Task 5: `detectLang` — 원문 언어 감지 heuristic (TDD)

**Files:**
- Modify: `scripts/build-references.mjs`
- Modify: `scripts/build-references.test.mjs`

문자 코드 블록 카운트로 ko/en/ja/other 네 가지만 구분한다. 완벽한 감지기가 아니라 뱃지용 근사.

- [ ] **Step 1: 실패하는 테스트 추가**

```js
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
  // VibeMap 문맥상 일본어 문서에 한자가 섞이는 경우가 흔하므로 ja로 떨어뜨림
  assert.equal(detectLang('意図工学'), 'ja');
});

test('detectLang: empty or unknown → other', () => {
  assert.equal(detectLang(''), 'other');
  assert.equal(detectLang('12345 !!!'), 'other');
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `node --test scripts/build-references.test.mjs`
Expected: 6개 신규 FAIL

- [ ] **Step 3: 구현 추가**

```js
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
    // kana 존재 또는 kanji만 존재 → ja (한자 단독도 ja로 본다)
    if (kana + kanji >= hangul && kana + kanji >= latin) return 'ja';
  }
  if (latin > 0 && latin >= hangul && latin >= kana + kanji) return 'en';
  return 'other';
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `node --test scripts/build-references.test.mjs`
Expected: 19개 PASS

- [ ] **Step 5: 커밋**

```bash
git add scripts/build-references.mjs scripts/build-references.test.mjs
git commit -m "feat(refs): detectLang via codepoint buckets (ko/en/ja/other)"
```

---

## Task 6: `matchNodes` — 한 자료(문서)와 48노드 매칭·스코어링 (TDD)

**Files:**
- Modify: `scripts/build-references.mjs`
- Modify: `scripts/build-references.test.mjs`

주어진 자료(title + excerpt 합친 텍스트)를 키워드 인덱스로 스캔해 스코어가 높은 노드 상위 N개를 반환한다.

스코어 = `matches * 1.0 + totalMatchLen / max(1, textLen) * 2.0`.

- [ ] **Step 1: 실패하는 테스트 추가**

```js
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
  // 긴 텍스트에서 짧은 단일 매칭은 스코어가 낮아 드랍되어야 함
  const longText = 'a'.repeat(1000) + ' git ' + 'b'.repeat(1000);
  const hits = matchNodes(longText, SAMPLE_INDEX, { maxPerSource: 3, minScore: 1.5 });
  assert.equal(hits.length, 0);
});

test('matchNodes: no matches returns empty array', () => {
  const hits = matchNodes('unrelated content about weather', SAMPLE_INDEX, { maxPerSource: 3, minScore: 0.1 });
  assert.deepEqual(hits, []);
});

test('matchNodes: word-boundary — "git" does not match "github" by default', () => {
  // 단어 경계: "github" 안의 "git"은 매칭되지 않아야 함
  const hits = matchNodes('check out github for this.', SAMPLE_INDEX, { maxPerSource: 3, minScore: 0.1 });
  const gitHit = hits.find(h => h.nodeId === 'git');
  assert.equal(gitHit, undefined);
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `node --test scripts/build-references.test.mjs`
Expected: 6개 신규 FAIL

- [ ] **Step 3: 구현 추가**

```js
// 단어 경계 기준: Latin 단어는 \b로 감싸고, CJK/한글 포함 구는 그냥 substring 탐색
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
  // 비-ASCII: 단순 substring
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
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `node --test scripts/build-references.test.mjs`
Expected: 25개 PASS

- [ ] **Step 5: 커밋**

```bash
git add scripts/build-references.mjs scripts/build-references.test.mjs
git commit -m "feat(refs): matchNodes with word-boundary + substring scoring"
```

---

## Task 7: `extractSources` — graphify graph.json에서 자료 목록 뽑기 (TDD)

**Files:**
- Modify: `scripts/build-references.mjs`
- Modify: `scripts/build-references.test.mjs`

graphify의 실제 스키마가 확정되지 않았으므로 **방어적 추출**을 한다. 다음 필드 이름 중 발견되는 것을 사용: `url`/`source.url`, `title`/`label`/`name`, `summary`/`excerpt`/`description`. 이 함수는 스펙 12번 "오픈 이슈"를 해결하는 실질적 장소다.

- [ ] **Step 1: 실패하는 테스트 추가**

```js
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
      { id: 'n2', label: 'NoUrl' }, // url 없는 노드는 스킵
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
      { url: 'https://a.example', title: 'Second' },  // trailing slash 차이
    ],
  };
  const srcs = extractSources(graph);
  assert.equal(srcs.length, 1);
});

test('extractSources: returns empty on missing graph', () => {
  assert.deepEqual(extractSources({}), []);
  assert.deepEqual(extractSources(null), []);
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `node --test scripts/build-references.test.mjs`
Expected: 5개 신규 FAIL

- [ ] **Step 3: 구현 추가**

```js
function pick(obj, keys) {
  for (const k of keys) {
    if (obj && typeof obj[k] === 'string' && obj[k].trim()) return obj[k];
  }
  return '';
}

function sourceFromRecord(rec) {
  if (!rec || typeof rec !== 'object') return null;
  const rawUrl = rec.url || rec.source?.url || '';
  if (!rawUrl) return null;
  const title = pick(rec, ['title', 'label', 'name']);
  const excerpt = pick(rec, ['excerpt', 'summary', 'description']);
  const text = [title, excerpt].filter(Boolean).join(' ');
  return {
    url: normalizeUrl(rawUrl),
    title: title || rawUrl,
    excerpt: excerpt.slice(0, 200),
    text,
  };
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
    byUrl.set(src.url, src);  // 나중 것이 덮어씀
  }
  return Array.from(byUrl.values());
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `node --test scripts/build-references.test.mjs`
Expected: 30개 PASS

- [ ] **Step 5: 커밋**

```bash
git add scripts/build-references.mjs scripts/build-references.test.mjs
git commit -m "feat(refs): extractSources defensively reads graphify graph.json"
```

---

## Task 8: `buildReferences` — 전체 파이프라인 조립 (TDD)

**Files:**
- Modify: `scripts/build-references.mjs`
- Modify: `scripts/build-references.test.mjs`

입력: VibeMap `nodes`, graphify `graph`. 출력: 스펙 5.1의 `references.json` 객체.

- [ ] **Step 1: 실패하는 테스트 추가**

```js
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
  // 스코어 동점일 때 url 알파벳순
  assert.deepEqual(urls.slice().sort(), urls);
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `node --test scripts/build-references.test.mjs`
Expected: 5개 신규 FAIL

- [ ] **Step 3: 구현 추가**

```js
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
      unmapped.push({ url: src.url, title: src.title, score: 0 });
      continue;
    }
    for (const hit of hits) {
      (byNode[hit.nodeId] ||= []).push({
        url: src.url,
        title: src.title,
        excerpt: src.excerpt,
        lang: detectLang(src.text || src.title),
        score: Number(hit.score.toFixed(3)),
      });
    }
  }

  // 노드별 정렬(스코어 desc, url asc) + 상한
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
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `node --test scripts/build-references.test.mjs`
Expected: 35개 PASS

- [ ] **Step 5: 커밋**

```bash
git add scripts/build-references.mjs scripts/build-references.test.mjs
git commit -m "feat(refs): buildReferences assembles full pipeline"
```

---

## Task 9: CLI entry-point + `--strict` 옵션

**Files:**
- Modify: `scripts/build-references.mjs`

파일 맨 아래에 CLI 진입점을 붙인다. `docs/data.js`는 `window.VIBEMAP_DATA`를 설정하는 브라우저 스크립트라, Node에서 바로 `import` 할 수 없다. 대신 **런타임 평가**로 `window` 섀도를 만들고 읽는다.

- [ ] **Step 1: CLI 로직 추가**

`scripts/build-references.mjs` 맨 아래:

```js
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
```

- [ ] **Step 2: 수동 실행 (graph.json 없는 상태)**

Run: `node scripts/build-references.mjs`
Expected:
- stdout에 `docs/references.json written: 0 source(s), 0 mapped node(s), 0 unmapped.`
- `docs/references.json` 생성됨
- exit code 0

- [ ] **Step 3: 파일 내용 확인**

Run: `cat docs/references.json`
Expected:
```json
{
  "version": "1",
  "generatedAt": "2026-04-22T...",
  "source": "graphify-out/graph.json",
  "stats": { "totalSources": 0, "mappedNodes": 0, "unmappedCount": 0 },
  "byNode": {},
  "_unmapped": []
}
```

- [ ] **Step 4: 기존 테스트가 여전히 통과하는지 확인**

Run: `node --test scripts/build-references.test.mjs`
Expected: 35개 PASS (CLI 추가로 인한 회귀 없음)

- [ ] **Step 5: 커밋**

```bash
git add scripts/build-references.mjs docs/references.json
git commit -m "feat(refs): CLI entrypoint generates empty docs/references.json on first run"
```

---

## Task 10: `scripts/ingest.sh` 래퍼

**Files:**
- Create: `scripts/ingest.sh`

graphify update와 build-references를 한 번에 돌리는 편의 스크립트.

- [ ] **Step 1: 스크립트 작성**

```bash
#!/usr/bin/env bash
# scripts/ingest.sh — raw/ 를 graphify로 재인덱스하고 docs/references.json 을 새로 생성
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "▶ graphify update raw/"
graphify update raw/

echo "▶ build docs/references.json"
node scripts/build-references.mjs "$@"

echo "✓ done"
```

- [ ] **Step 2: 실행 권한 부여**

```bash
chmod +x scripts/ingest.sh
```

- [ ] **Step 3: 스크립트 동작 확인 (dry run)**

Run: `bash scripts/ingest.sh` (`raw/` 가 비어있거나 graphify가 처음 실행되면 그래프는 비어있을 수 있음)
Expected:
- graphify가 실행되거나 "nothing to index" 류 메시지
- build-references가 실행되어 `docs/references.json`이 업데이트됨
- exit code 0

※ graphify가 "no files" 같은 이유로 실패하면 이 Task에서는 멈추지 말고 기록만 남긴다. 실제 자료 ingest는 Task 12에서.

- [ ] **Step 4: 커밋**

```bash
git add scripts/ingest.sh
git commit -m "feat(refs): ingest.sh chains graphify update and build-references"
```

---

## Task 11: i18n에 `referencesTitle` 키 추가

**Files:**
- Modify: `docs/i18n.js:17`
- Modify: `docs/i18n.js:34`
- Modify: `docs/i18n.js:51`

기존 `I18N.{ko,en,ja}`의 `footer` 앞에 `referencesTitle`을 추가한다.

- [ ] **Step 1: ko 블록 수정**

`i18n.js:17`의 `footer:` 바로 앞에 한 줄 추가:

기존:
```js
    share: "공유",
    footer: "VibeMap · 바이브 코딩 입문자용 지도 · v1.0",
```

변경:
```js
    share: "공유",
    referencesTitle: "근거 자료",
    footer: "VibeMap · 바이브 코딩 입문자용 지도 · v1.0",
```

- [ ] **Step 2: en 블록 수정**

`i18n.js:34`의 `footer:` 앞:
```js
    share: "Share",
    referencesTitle: "References",
    footer: "VibeMap · a map for vibe coders · v1.0",
```

- [ ] **Step 3: ja 블록 수정**

`i18n.js:51`의 `footer:` 앞:
```js
    share: "共有",
    referencesTitle: "参考資料",
    footer: "VibeMap · バイブコーダーのための地図 · v1.0",
```

- [ ] **Step 4: 로컬 서버에서 페이지 로드**

Run: `python3 -m http.server 8080 -d docs &`
브라우저에서 `http://localhost:8080/` 열고, 개발자 콘솔에서:
```js
I18N.ko.referencesTitle    // "근거 자료"
I18N.en.referencesTitle    // "References"
I18N.ja.referencesTitle    // "参考資料"
```
Expected: 세 값 모두 올바르게 리턴

- [ ] **Step 5: 서버 종료 후 커밋**

```bash
kill %1 2>/dev/null || true
git add i18n.js
git commit -m "feat(i18n): add referencesTitle key for ko/en/ja"
```

---

## Task 12: `docs/app.jsx`에서 references.json 로드 + state

**Files:**
- Modify: `docs/app.jsx:16` 주변 (App 함수 상단 state 영역)

앱 마운트 직후 `fetch('./references.json')`을 시도하고, 실패하면 빈 객체 fallback. 기존 로직에 영향 없도록 별도 state로 둔다.

- [ ] **Step 1: state와 effect 추가**

`app.jsx`의 `const [transform, setTransform] = useState(...)` 줄 (line 24) 바로 아래, 그리고 `const [entryProgress, setEntryProgress] = useState(0);` (line 25) 뒤에 다음 state를 추가:

```jsx
  const [references, setReferences] = useState({ byNode: {} });
```

그다음 기존 effect들이 모여 있는 곳(`useEffect` 블록들 사이, 대략 line 113 아래 `// Persist lang` 위)에 로드 effect 추가:

```jsx
  // Load references.json (생성 실패 시 조용히 비어있는 상태 유지)
  useEffect(() => {
    let cancelled = false;
    fetch('./references.json', { cache: 'no-cache' })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (data && data.version === '1' && data.byNode) {
          setReferences(data);
        } else {
          console.warn('references.json: unsupported schema; using empty fallback');
        }
      })
      .catch((err) => {
        console.warn('references.json unavailable:', err.message);
      });
    return () => { cancelled = true; };
  }, []);
```

- [ ] **Step 2: 로컬 서버 띄워서 콘솔 확인**

Run: `python3 -m http.server 8080 -d docs &`
브라우저 `http://localhost:8080/` 에서 콘솔:
```js
// 네트워크 탭에 references.json 요청이 200으로 로드되어야 함
// 콘솔에 에러/경고 없어야 함
```
Expected: 요청 성공, 경고 없음. (이 단계에서 `references.json`은 Task 9에서 만든 빈 파일이어야 한다.)

- [ ] **Step 3: references.json을 잠시 삭제하고 fallback 확인**

```bash
mv references.json references.json.bak
```
페이지 새로고침. 콘솔에 `references.json unavailable: HTTP 404` 경고만 뜨고, 그래프는 정상 동작해야 한다.

복구:
```bash
mv references.json.bak references.json
```

- [ ] **Step 4: 서버 종료 후 커밋**

```bash
kill %1 2>/dev/null || true
git add app.jsx
git commit -m "feat(app): load references.json with graceful fallback"
```

---

## Task 13: 패널에 "근거 자료" 섹션 추가

**Files:**
- Modify: `docs/app.jsx:496` 주변 (패널 body 내부, "연결" 섹션 뒤)

`aside.panel` 내부의 `<div className="panel-body">` 안, `<div className="panel-section">` (connections)의 **뒤에** "근거 자료" 섹션을 추가한다.

- [ ] **Step 1: 섹션 JSX 추가**

`app.jsx`의 기존 코드:
```jsx
              <div className="panel-section">
                <div className="panel-section-label">{t.connections}</div>
                <div className="panel-links">
                  {[...(adjacency[activeNode.id] || [])].map((nid) => {
                    ...
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </aside>
```

위의 첫 번째 `</div>`(바깥 `panel-section`을 닫는 줄) **뒤**에, 바깥 `</div>`(panel-body를 닫는 줄) **앞**에 다음을 삽입:

```jsx
              {(references.byNode[activeNode.id]?.length ?? 0) > 0 && (
                <div className="panel-section refs">
                  <div className="panel-section-label">{t.referencesTitle}</div>
                  <ul className="refs-list">
                    {references.byNode[activeNode.id].map((ref, i) => (
                      <li key={i} className="refs-item">
                        <a
                          className="refs-link"
                          href={ref.url}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {ref.title}
                        </a>
                        {ref.excerpt && (
                          <p className="refs-excerpt">{ref.excerpt}</p>
                        )}
                        <span className={`refs-lang refs-lang-${ref.lang || 'other'}`}>
                          {(ref.lang || 'other').toUpperCase()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
```

- [ ] **Step 2: 로컬 서버에서 확인 (현재 references.json은 비어있으므로 섹션 미표시 기대)**

Run: `python3 -m http.server 8080 -d docs &`
브라우저에서 아무 노드 클릭 → 패널 열림 → "근거 자료" 섹션은 **안 보여야** 정상 (빈 배열이므로).

- [ ] **Step 3: 가짜 references.json으로 렌더 확인**

`references.json`을 임시로 다음 내용으로 바꾼다 (원본 백업):

```bash
cp references.json references.json.bak
```

```json
{
  "version": "1",
  "generatedAt": "2026-04-22T00:00:00.000Z",
  "source": "graphify-out/graph.json",
  "stats": { "totalSources": 1, "mappedNodes": 1, "unmappedCount": 0 },
  "byNode": {
    "intent": [
      {
        "url": "https://intent.roboco.io/",
        "title": "Intent Engineering",
        "excerpt": "Ship intent, not code — a framework for the AI era.",
        "lang": "en",
        "score": 0.8
      }
    ]
  },
  "_unmapped": []
}
```

페이지 새로고침 후 `intent` 노드를 검색·클릭. 패널에 "근거 자료" 섹션이 뜨고, Intent Engineering 링크가 보이고, 클릭하면 새 탭이 열리는지 확인.

Expected:
- 섹션 제목이 현재 언어에 맞게 "근거 자료"/"References"/"参考資料"
- 링크 클릭 시 새 탭
- 언어 뱃지 "EN" 표시
- 다른 노드(예: `git`) 클릭 시에는 섹션 미표시

백업 복원:
```bash
mv references.json.bak references.json
```

- [ ] **Step 4: 서버 종료 후 커밋**

```bash
kill %1 2>/dev/null || true
git add app.jsx
git commit -m "feat(panel): render references section with language badge"
```

---

## Task 14: 패널 "근거 자료" 섹션 스타일

**Files:**
- Modify: `docs/styles.css`

기존 `.panel-section`과 조화롭되, 살짝 흐린 계층감을 준다.

- [ ] **Step 1: CSS 추가**

`styles.css` 맨 아래에 다음을 붙인다:

```css
/* References section (graphify-sourced) */
.panel-section.refs {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(232, 228, 255, 0.1);
}

.panel-section.refs .panel-section-label {
  opacity: 0.75;
}

.refs-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.refs-item {
  position: relative;
  padding-right: 44px; /* lang badge 공간 */
}

.refs-link {
  color: #e8e4ff;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.4;
  border-bottom: 1px solid rgba(232, 228, 255, 0.2);
}

.refs-link:hover {
  border-bottom-color: rgba(232, 228, 255, 0.8);
}

.refs-excerpt {
  margin: 4px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: rgba(232, 228, 255, 0.55);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.refs-lang {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 2px 6px;
  border-radius: 3px;
  background: rgba(167, 139, 250, 0.15);
  color: rgba(232, 228, 255, 0.7);
}

.refs-lang-ko { background: rgba(196, 181, 253, 0.15); }
.refs-lang-en { background: rgba(96, 165, 250, 0.15); }
.refs-lang-ja { background: rgba(52, 211, 153, 0.15); }
.refs-lang-other { background: rgba(232, 228, 255, 0.08); }
```

- [ ] **Step 2: 렌더 확인 (Task 13의 가짜 references.json 기법 재사용)**

Task 13 Step 3을 다시 수행해 intent 노드 패널을 열어본다.
Expected:
- "근거 자료" 제목 위에 얇은 가로선 (구분선)
- 링크가 부드럽게 밑줄 표시, 호버 시 밑줄 강조
- 2줄 excerpt (길면 말줄임)
- 우측 상단에 EN 뱃지, 파란 계열 배경

- [ ] **Step 3: 커밋**

```bash
git add styles.css
git commit -m "style(panel): refs section layout with language badges"
```

---

## Task 15: 실제 외부 자료 하나 ingest + E2E 확인

**Files:**
- Modify: `raw/` (graphify가 `raw/urls/`에 파일 생성)
- Modify: `graphify-out/graph.json` (graphify 생성)
- Modify: `docs/references.json` (build-references 생성)

첫 실제 자료로 스펙의 성공 기준 #3("intent.roboco.io 또는 roboco.io/posts/the-art-of-vibe-coding가 관련 노드 패널에 자동 노출")을 만족시킨다.

- [ ] **Step 1: intent.roboco.io 추가**

```bash
graphify add https://intent.roboco.io/ --dir raw/urls --author "roboco"
```
Expected: `raw/urls/` 아래에 파일 생성됨, graphify 메시지 출력

- [ ] **Step 2: roboco.io 바이브 코딩 글 추가**

```bash
graphify add https://roboco.io/posts/the-art-of-vibe-coding/ --dir raw/urls --author "roboco"
```

- [ ] **Step 3: ingest 실행**

```bash
bash scripts/ingest.sh
```
Expected:
- `graphify-out/graph.json` 생성/갱신
- `references.json`이 업데이트되고 stdout에 `2 source(s), N mapped node(s), M unmapped.` 출력

- [ ] **Step 4: 결과 검사**

```bash
cat docs/references.json | head -80
```
Expected:
- `byNode.intent` 또는 `byNode.vibe`에 최소 하나의 항목
- 링크의 `url`, `title`, `excerpt`, `lang` 채워져 있음
- `_unmapped`가 비어있지 않을 수도 있음 — 그럼 항목별로 판단해서 수용 가능하면 넘어감

만약 `intent`나 `vibe` 어느 것에도 매칭되지 않았다면: 텍스트 내용을 직접 확인(`cat graphify-out/graph.json | head -40`). graphify가 title/excerpt를 예상과 다른 필드명으로 둘 수 있다 — 그 경우 Task 7의 `extractSources`의 필드 후보를 보강하고 재실행한다(이건 회귀가 아니라 "오픈 이슈" 해결의 연속).

- [ ] **Step 5: 브라우저에서 확인**

```bash
python3 -m http.server 8080 &
```
브라우저에서:
1. `intent` 노드(의도공학)를 검색하거나 찾아 클릭
2. 우측 패널에 "근거 자료" 섹션이 나타나고 Intent Engineering 링크가 보인다
3. 링크 클릭 시 새 탭에서 실제 사이트로 이동
4. `vibe` 노드(바이브 코딩) 클릭 시 The Art of Vibe Coding이 보인다 (또는 spec에 적힌 다른 관련 노드)
5. `git`, `tdd` 같은 무관한 노드 클릭 시에는 섹션 미표시

서버 종료:
```bash
kill %1 2>/dev/null || true
```

- [ ] **Step 6: 커밋**

```bash
git add raw/ graphify-out/ docs/references.json
git commit -m "knowledge: seed corpus with intent.roboco.io and vibe coding article"
```

---

## Task 16: README에 워크플로우 섹션 추가

**Files:**
- Modify: `README.md`

새 자료를 추가하고 싶은 사람이 명령 5줄로 전체 파이프라인을 돌릴 수 있도록 안내한다.

- [ ] **Step 1: README 수정**

`README.md`의 `## 참고` 섹션(줄 66쯤) **앞**에 다음 섹션을 삽입:

```markdown
## 지식기반 관리 (graphify)

VibeMap의 각 노드에는 외부 자료(블로그·문서·노트)를 자동으로 연결할 수 있습니다. 원본은 `raw/`에 모이고, [graphify](https://github.com/safishamsi/graphify)가 그래프로 만든 뒤 `scripts/build-references.mjs`가 노드별 근거 자료(`docs/references.json`)를 생성합니다. 48개 교육 노드는 `docs/data.js`에 그대로 유지되고, 근거 자료는 슬라이드 패널에 별도 섹션으로 노출됩니다.

### 새 자료 추가

```bash
# 1) 원본 수집
graphify add https://example.com/article --dir raw/urls

# 2) 그래프 재인덱스 + docs/references.json 생성
bash scripts/ingest.sh

# 3) 결과 검토 (_unmapped 배열에 자료가 남아있으면 사람이 확인)
git diff docs/references.json

# 4) 커밋 & 배포
git add raw/ graphify-out/graph.json docs/references.json
git commit -m "knowledge: add article X"
git push
```

`docs/references.json`이 없거나 손상되면 사이트는 조용히 fallback 동작하므로, 빌드 실패가 사용자 경험을 망치지 않습니다.

### 파이프라인 테스트

```bash
node --test scripts/
```

Node ≥ 18 이 필요하며, 별도 npm 의존성은 없습니다.
```

- [ ] **Step 2: 변경 확인**

Run: `head -90 README.md`
Expected: 새 섹션이 `## 참고` 위에 정확히 들어가 있음.

- [ ] **Step 3: 커밋**

```bash
git add README.md
git commit -m "docs: document graphify knowledge base workflow"
```

---

## Task 17: 최종 회귀 체크

**Files:** (읽기만)

- [ ] **Step 1: 전체 테스트 통과 확인**

Run: `node --test scripts/`
Expected: 35개 PASS, 0개 FAIL

- [ ] **Step 2: 로컬 서버로 최종 UX 체크**

Run: `python3 -m http.server 8080 -d docs &`
브라우저에서 확인:
1. 그래프가 중심→가지로 리플 등장 (기존 동작 유지)
2. 카테고리 필터, 검색, 언어 전환, 물리 토글 모두 동작
3. 근거 자료가 있는 노드(intent, vibe 등) 클릭 시 패널에 "근거 자료" 섹션 노출
4. 근거 자료가 없는 노드 클릭 시 섹션 미표시
5. 콘솔에 에러 없음

서버 종료:
```bash
kill %1 2>/dev/null || true
```

- [ ] **Step 3: git 상태 확인**

Run: `git status && git log --oneline -20`
Expected: working tree clean, 17개 태스크의 커밋이 순서대로 쌓여 있음.

- [ ] **Step 4: 스펙 성공 기준과 대조**

스펙 11번의 5개 성공 기준을 머릿속으로 체크:
1. ✅ npm 명령 없이 그래프 시각화 정상 (`docs/index.html` 그대로)
2. ✅ `scripts/ingest.sh` 실행 시 결정적 `docs/references.json` 생성 (정렬이 score desc, url asc)
3. ✅ intent.roboco.io / roboco.io/posts/the-art-of-vibe-coding가 관련 노드에 노출 (Task 15 확인)
4. ✅ `docs/references.json` 삭제해도 사이트 정상 (Task 12 Step 3 확인)
5. ✅ `--strict` 옵션으로 `_unmapped` 없을 때만 성공 (Task 9 구현, 실제 커밋 전 `npm run build:refs:strict`로 검증 가능)

완료 시 summary 커밋 불필요. 전체 구현이 끝남.

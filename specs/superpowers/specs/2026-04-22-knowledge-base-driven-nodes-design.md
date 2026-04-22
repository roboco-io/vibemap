# 지식베이스 주도 노드 파이프라인 설계

- 작성일: 2026-04-22
- 상태: Draft (사용자 리뷰 대기)
- 대상 저장소: `vibemap/` (<https://vibemap.roboco.io>)
- 관련 스펙: `2026-04-22-graphify-knowledge-base-design.md` (외부 참고 자료 파이프라인, 본 스펙과 병행 유지)

## 1. 배경과 목적

현재 VibeMap의 48개 교육 노드는 `docs/data.js`에 하드코딩되어 있고, 각 노드의 `body`는 한두 줄의 짧은 설명이다. 같은 저장소의 외부 블로그 수집·링크 기능은 `raw/urls/` → graphify → `docs/references.json` 파이프라인으로 이미 분리되어 있지만, **노드 자체의 지식은 자동화되지 않은 상태**다.

이 설계는 다음 두 가지 요구를 한 번에 해결한다:

1. **워크플로우 전환** — 노드를 "지식베이스 먼저 작성 → 관계 설정 → JS 산출"의 파이프라인으로 만든다. 노드당 markdown 파일(`raw/nodes/<id>.md`)이 단일 진실원(SSOT)이 되고, 빌드 스크립트가 `docs/data.js`와 `docs/nodes.json`을 생성한다.
2. **본문 확장** — 한두 줄이던 본문을 "학습에 도움이 될 만큼 풍부한 맥락 + 관련 링크"로 확장한다. 슬라이드 패널에 본문·관련 링크·연결 노드·더 읽을 자료의 **3-tier 구조**로 표시한다.

또한 이번 스펙 범위에서 **AWS 데이터 레이크 관련 5개 서비스 + 서버리스 퍼시스턴스 2개 서비스**(DSQL, MemoryDB)를 새 파이프라인으로 추가한다.

## 2. 핵심 결정

| 항목 | 결정 | 근거 |
|-----|------|-----|
| SSOT 위치 | `raw/nodes/<id>.md` 노드별 markdown | 사람이 작성·리뷰하기 쉽고 diff가 깔끔. frontmatter 메타 + 3언어 본문을 한 파일에 묶어 언어 간 드리프트 방지. |
| 본문 전송 | `docs/data.js` 메타 + `docs/nodes.json` 본문 분리 | 초기 그래프 렌더 빠름. nodes.json은 백그라운드 fetch로 패널 표시 전에 이미 도착. |
| edges 도출 | 본문 내 `[[wiki-link]]` 자동 추출 | 관계를 별도로 유지하지 않아도 되는 위키 패턴. 본문과 관계가 동기화된 상태를 구조적으로 강제. |
| 참고 링크 | frontmatter `refs` (수기) + `references.json` (자동) 병행 | AWS 공식 문서 같은 canonical 자료는 명시, 블로그·기사는 기존 자동 매칭 유지. 패널에서 2개 섹션으로 분리 노출. |
| 마이그레이션 | 하이브리드 빌드 (md 없으면 legacy-nodes.js로 폴백) | 48노드 일괄 rewrite를 이번 PR에서 강제하지 않음. 신규 AWS 6개 + 샘플 2개(intent, vibe)만 이번에 작성. |
| AWS 범위 | data 카테고리 4개 + ops 카테고리 2개 | Glue · Athena · Lake Formation · Kinesis + DSQL · MemoryDB. 기존 s3 노드의 연결만 보강. EMR/MSK/QuickSight는 이번 범위 외. |
| 의존성 | 외부 npm 패키지 0개 유지 | 프로젝트 원칙 "빌드 도구·번들러·npm 의존성 도입 금지". frontmatter 파서·markdown→HTML 변환 모두 Node 내장 범위로 자체 구현. |

## 3. 아키텍처

### 3.1 전체 데이터 흐름

```
raw/
├── nodes/                     ← 신규 SSOT (노드별 md, 이번 PR에서 8개)
│   ├── dsql.md
│   ├── memorydb.md
│   ├── glue.md
│   ├── athena.md
│   ├── lake-formation.md
│   ├── kinesis.md
│   ├── intent.md              ← 샘플 마이그레이션
│   └── vibe.md                ← 샘플 마이그레이션
└── urls/                      ← 기존 — 외부 블로그 아카이브 (변경 없음)

scripts/
├── legacy-nodes.js            ← 현 docs/data.js의 nodes 배열 1회 복사
├── legacy-edges.js            ← 현 docs/data.js의 edges 배열 1회 복사
├── compile-nodes.mjs          ← 신규 — raw/nodes/ + legacy → data.js + nodes.json
├── compile-nodes.test.mjs     ← 신규
├── build-references.mjs       ← 기존 (변경 없음)
├── build-references.test.mjs  ← 기존 (변경 없음)
└── ingest.sh                  ← 수정 — compile-nodes 단계 추가

docs/
├── data.js                    ← 생성물 (id/cat/size/title/edges 메타만)
├── nodes.json                 ← 신규 생성물 (노드별 HTML 본문 ko/en/ja + refs)
├── references.json            ← 기존 생성물 (변경 없음)
├── app.jsx                    ← 수정 — nodes.json fetch + 3-tier 패널 + wiki-link 위임
├── styles.css                 ← 수정 — wiki-link, refs-section, more-reading-section
└── i18n.js                    ← 수정 — panel.refs / panel.connected / panel.moreReading
```

### 3.2 파이프라인

```
raw/nodes/*.md ─┐
                ├─ compile-nodes.mjs ─▶ docs/data.js + docs/nodes.json
legacy-*.js    ─┘                        (md 우선, 없으면 legacy 폴백)

raw/urls/*.md  ── graphify ── graph.json ── build-references.mjs ─▶ docs/references.json
```

두 파이프라인은 독립적이다. `docs/references.json`이 깨져도 관련 링크 "더 읽을 자료" 섹션만 사라지고 사이트는 정상 동작한다. `docs/nodes.json`이 깨지면 본문 영역에 "본문을 불러올 수 없습니다" 한 줄만 표시되고 그래프는 정상 렌더된다.

### 3.3 브라우저 로드 순서

1. `data.js` (script 태그, 수십 KB) — 즉시 그래프 렌더 + 등장 애니메이션
2. `nodes.json` (fetch, 수백 KB 예상) — 백그라운드로 본문 채움. 첫 패널 오픈 전에 도착할 가능성이 높음
3. `references.json` (fetch, 수십 KB) — 기존과 동일

## 4. 파일 포맷

### 4.1 `raw/nodes/<id>.md` (SSOT)

```markdown
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
    title: Introducing Aurora DSQL
    lang: en
extraEdges: []
---

## ko

Aurora DSQL은 AWS의 **서버리스 분산 SQL** 데이터베이스다. [[serverless]] 스택에서
[[dynamodb]]가 NoSQL 자리를 맡아왔다면, DSQL은 "관계형이 필요한데 서버는 운영하기 싫다"는
경우를 채운다...

### 언제 쓰나
- [[sql-vs-nosql]] 갈림길에서 SQL 쪽을 고르되, Aurora 인스턴스 관리까지는 하기 싫을 때
- 멀티 리전 동기 쓰기가 필요한 워크로드
- [[lambda]] + [[apigw]]와 붙여 완전 서버리스 백엔드 구성

## en

...

## ja

...
```

**스키마 규칙**
- frontmatter 필수: `id`, `cat`, `size`, `title.{ko,en,ja}`
- frontmatter 선택: `refs[]` (각 항목 `{url, title, lang}` — url 필수이며 `http://` 또는 `https://`로 시작, lang은 `ko/en/ja/other` 중 하나), `extraEdges[]`
- body: `## ko` / `## en` / `## ja` 세 섹션 모두 필수. 비어있으면 빌드 실패
- wiki-link: `[[id]]` 또는 `[[id|표시라벨]]`. 빌드 시 edges로 추출, 본문은 anchor로 치환
- `extraEdges`: 본문에서 자연스럽게 언급하기 어려운 관계를 보조적으로 연결할 때만 사용

### 4.2 허용 markdown 범위 (의도적 제한)

| 지원 | 형태 |
|-----|-----|
| 문단 | 빈 줄로 구분 |
| 강조 | `**굵게**` |
| 이탤릭 | `*기울임*` |
| 3레벨 헤더 | `### 소제목` |
| 순서 없는 리스트 | `- 항목` |
| wiki-link | `[[id]]` 또는 `[[id\|라벨]]` |

**미지원 (입력 시 빌드 에러)**: 테이블, 코드블록, 이미지, 1·2레벨 헤더, 임의 HTML, 인라인 코드(`` ` ``). 이유 — HTML sanitization 복잡도를 회피하고, 본문이 학습용 요약문 범위를 벗어나지 않도록 강제한다.

### 4.3 `docs/data.js` (생성물)

```javascript
// AUTO-GENERATED by scripts/compile-nodes.mjs — do not edit by hand
window.VIBEMAP_DATA = {
  categories: { /* 기존과 동일 */ },
  nodes: [
    { id: "dsql", cat: "ops", size: 3,
      title: { ko: "Aurora DSQL", en: "Aurora DSQL", ja: "Aurora DSQL" } },
    // ... body 필드 없음 (nodes.json으로 이동)
  ],
  edges: [["dsql","serverless"], ["dsql","sql"], /* ... */],
};
```

nodes는 카테고리 선언 순서 → 같은 카테고리 내에서는 id 사전순. edges는 `[source,target]`을 id 사전순으로 정규화 후 전체 배열도 사전순 정렬. **두 번 실행해도 바이트 동일**이 불변식.

**참고**: legacy 폴백으로 들어온 노드는 `docs/nodes.json`에 `refs: []`로 포함된다 (legacy-nodes.js는 refs 개념을 가지지 않음). 해당 노드의 슬라이드 패널에서 "관련 링크" 섹션은 자동 숨김되고, "더 읽을 자료"(references.json)만 노출된다.

### 4.4 `docs/nodes.json` (생성물)

```json
{
  "version": "1",
  "generatedAt": "2026-04-22T00:00:00.000Z",
  "source": "raw/nodes/ + scripts/legacy-nodes.js",
  "stats": {
    "total": 54,
    "fromMarkdown": 8,
    "fromLegacy": 46,
    "brokenEdges": 0
  },
  "nodes": {
    "dsql": {
      "body": {
        "ko": "<p>Aurora DSQL은 AWS의 <strong>서버리스 분산 SQL</strong> 데이터베이스다. <a class=\"wiki-link\" data-node-id=\"serverless\">serverless</a> 스택에서 <a class=\"wiki-link\" data-node-id=\"dynamodb\">dynamodb</a>가 NoSQL 자리를 맡아왔다면...</p>",
        "en": "...",
        "ja": "..."
      },
      "refs": [
        { "url": "https://docs.aws.amazon.com/aurora-dsql/...", "title": "What is Aurora DSQL", "lang": "en" }
      ]
    }
  }
}
```

## 5. `scripts/compile-nodes.mjs` 책임

### 5.1 단계

1. **Load & parse** — `raw/nodes/*.md`를 전부 읽어 frontmatter(YAML 서브셋, 자체 파서) + body 분리. 스키마 위반 시 파일 경로 + 라인 번호 포함한 에러.
2. **Body parse** — 3개 언어 섹션 추출, `[[id]]` 정규식 수집 → edges 세트 + HTML anchor 치환, markdown→HTML 변환(허용 태그만).
3. **Merge with legacy** — `legacy-nodes.js`의 노드 먼저 로드, 같은 id의 md 노드가 있으면 override. edges도 동일 방식으로 union.
4. **Edge validation** — 양 끝 노드 존재 여부 확인. 깨진 edge는 경고 + `--strict` 시 실패. `[a,b]`와 `[b,a]` 중복 정규화.
5. **Write** — `docs/data.js` 리터럴, `docs/nodes.json` 직렬화. stdout에 `N node(s), M edges, W warning(s)` 요약.

### 5.2 CLI

```bash
node scripts/compile-nodes.mjs            # 기본
node scripts/compile-nodes.mjs --strict   # 경고도 실패로
```

### 5.3 Makefile / ingest.sh 통합

```makefile
compile:
	node scripts/compile-nodes.mjs

build: compile
	node scripts/build-references.mjs

ingest: compile
	bash scripts/ingest.sh
```

`scripts/ingest.sh`는 `compile-nodes → graphify update → build-references` 순으로 실행.

## 6. 프론트엔드 변경

### 6.1 데이터 로딩

```javascript
const [nodesDetail, setNodesDetail] = useState({ nodes: {} });
useEffect(() => {
  fetch('nodes.json').then(r => r.json()).then(setNodesDetail)
    .catch(() => { /* 조용히 fallback */ });
}, []);
```

### 6.2 슬라이드 패널 3-tier

```
┌ 패널 ──────────────────────────────────┐
│ [카테고리 뱃지]  타이틀                │
│                                         │
│ ── 본문 ──                              │  ← nodes.json[id].body[lang]
│ HTML (p, strong, em, h3, ul/li, a.wiki)│
│                                         │
│ ── 관련 링크 ──                         │  ← nodes.json[id].refs
│ 🔗 AWS Aurora DSQL 공식 문서 [en]       │
│                                         │
│ ── 연결 노드 ──                         │  ← edges 기반 adjacency
│ [serverless] [sql] [dynamodb] [lambda]  │
│                                         │
│ ── 더 읽을 자료 ──                      │  ← references.json
│ 🔗 The Art of Vibe Coding [ko]          │
└─────────────────────────────────────────┘
```

**관련 링크 vs 더 읽을 자료**
- 관련 링크: 수기 관리되는 canonical. 항상 노출, refs 비어있으면 섹션 숨김.
- 더 읽을 자료: raw/urls/ 자동 매칭. 매칭 없으면 섹션 숨김.

### 6.3 Wiki-link 클릭 위임

본문은 `dangerouslySetInnerHTML`로 주입(허용 태그만 생성되므로 안전). 패널 루트에 이벤트 위임:

```javascript
const onPanelClick = (e) => {
  const link = e.target.closest('a.wiki-link');
  if (!link) return;
  e.preventDefault();
  setActiveId(link.dataset.nodeId);
};
```

### 6.4 i18n 추가 키

| 키 | ko | en | ja |
|---|---|---|---|
| `panel.refs` | 관련 링크 | Related | 関連リンク |
| `panel.connected` | 연결 노드 | Connected | 関連ノード |
| `panel.moreReading` | 더 읽을 자료 | More reading | 関連資料 |

### 6.5 검색 동작

`app.jsx`의 검색 필터는 현재 `node.title`과 `node.body`를 매칭한다. 변경 후에는 `nodesDetail.nodes[id]?.body`를 함께 매칭. `nodes.json`이 도착하기 전에는 title만 매칭 — 짧은 degrade 구간 허용.

## 7. 테스트 전략

### 7.1 `scripts/compile-nodes.test.mjs` (신규)

| 테스트 | 검증 |
|-------|-----|
| frontmatter 필수 필드 누락 | id/cat/size/title 중 하나라도 없으면 에러, 메시지에 파일 경로 포함 |
| 유효하지 않은 cat | categories에 없는 id면 에러 |
| refs 스키마 | url 누락 시 에러, `http(s)://`로 시작하지 않으면 에러, lang은 허용값만 |
| body 세 언어 섹션 모두 존재 | 하나라도 비어있으면 에러 |
| wiki-link 추출 | `[[serverless]]`, `[[sql\|관계형]]` 둘 다 edges 수집 + anchor 치환 |
| 깨진 wiki-link | 존재하지 않는 id는 경고, `--strict`면 실패 |
| markdown 허용 태그만 생성 | `<script>`, `<img onerror>`, `javascript:` href 적대 입력이 출력에서 제거 |
| markdown 허용 범위 초과 | 테이블·코드블록·임의 HTML 입력 시 에러 |
| md가 legacy를 override | 동일 id가 양쪽에 있으면 md 버전 채택 |
| md 없으면 legacy 그대로 | 46개 legacy 노드는 이번 PR에서도 동일 렌더 |
| edges 양 끝 존재 검증 | 깨진 edge는 경고, strict 시 실패 |
| edges 중복·대칭 제거 | `[a,b]`와 `[b,a]` 정규화 |
| 출력 결정론 | 두 번 실행 시 data.js / nodes.json 바이트 동일 |

### 7.2 E2E (`make e2e`) 확장

기존 HTTP 200 체크에 `nodes.json` 추가:

```bash
curl -s -o /dev/null -w "%{http_code}" $(URL)nodes.json
# 200 아니면 WARN (사이트는 fallback)
```

유효 JSON + `stats` 필드 존재 검증은 `node -e` 한 줄로.

### 7.3 수동 검증 체크리스트 (브라우저)

- DSQL 노드 클릭 → 본문 풍부 · refs 2개 · 연결 노드 칩 · 더 읽을 자료(있으면)
- 본문의 `[[serverless]]` 클릭 → serverless 노드로 포커스 이동 + 애니메이션
- intent 노드 클릭 → md 기반 풍부한 본문 (기존 한두 줄 대비 확장 확인)
- git 노드(legacy) 클릭 → 기존과 동일하게 짧은 본문 렌더 (legacy fallback 검증)
- KO/EN/JA 전환 → 새 노드도 정상 번역, i18n 키 3개 정상 표시

## 8. 마이그레이션 체크리스트 (이 스펙의 실행 범위)

1. `scripts/legacy-nodes.js` · `scripts/legacy-edges.js` — 현 `docs/data.js`의 두 배열 그대로 복사
2. `scripts/compile-nodes.mjs` · `scripts/compile-nodes.test.mjs` 작성, `make test` 통과
3. `raw/nodes/` 디렉토리 생성, 8개 md 작성:
   - 신규 AWS 6개: dsql, memorydb, glue, athena, lake-formation, kinesis
   - 샘플 2개: intent (mindset 대표), vibe (core 루트)
   - 각 md: 3개 언어 각각 수백 단어 수준, wiki-link로 기존 노드 최소 3개 이상 연결
4. `docs/data.js` 삭제 후 `compile-nodes.mjs` 실행으로 재생성 — 기존 46노드 동치 확인, 새 8노드 확인
5. `docs/nodes.json` 생성물 커밋
6. `docs/app.jsx` 수정 — nodes.json fetch, 3-tier 패널, wiki-link 위임, 검색 필터 업데이트
7. `docs/styles.css` 추가 — wiki-link, refs-section, more-reading-section
8. `docs/i18n.js` 수정 — panel.refs / panel.connected / panel.moreReading
9. `Makefile`에 `compile` 타겟 추가, build/ingest가 compile 의존
10. `scripts/ingest.sh` 수정 — compile-nodes를 첫 단계로
11. `make e2e` 수동 검증 (§7.3 체크리스트)
12. `CLAUDE.md` 업데이트 — "두 레이어"를 "세 레이어"로 (md SSOT / legacy fallback / references), `docs/nodes.json`을 "절대 수정 금지" 목록에 추가, "절대 수정 금지" 목록에 `docs/data.js`도 추가 (md 노드가 한 개라도 있는 순간 data.js는 생성물)

## 9. 스펙 범위 밖 (후속 작업)

- 나머지 40노드를 `raw/nodes/`로 점진 이식 → `legacy-*.js`가 점차 비워지다 최종 삭제
- wiki-link 역방향 인덱스를 그래프 뷰에서 하이라이트로 활용 (호버 시 양방향 경로 강조)
- graphify 그래프의 god node 정보를 참고해 edges 품질 개선
- AWS 공식 문서 등을 `raw/urls/`에 수집 → 새 AWS 노드의 "더 읽을 자료" 섹션 자동 채움

## 10. 리스크 및 완화

| 리스크 | 완화 |
|-------|-----|
| markdown 자체 파서의 취약점 | 허용 태그만 화이트리스트. 테스트에 적대적 입력 포함. 브라우저 측은 생성된 HTML을 신뢰하되, 생성 주체가 파서 하나로 국한되므로 공격면이 좁음 |
| nodes.json 비대화 | 이번 범위는 54노드 × 세 언어 × 수백 단어 → gzip 후 100KB 미만 예상. 실제 측정 후 필요 시 노드별 lazy load로 분할 (스펙 범위 밖) |
| legacy + md 이중 유지로 인한 혼란 | CLAUDE.md에 "같은 id가 md와 legacy에 동시에 존재하면 md가 이긴다"를 명시. 빌드 출력에 `fromMarkdown / fromLegacy` 통계 노출. |
| GitHub Pages 캐시로 data.js 갱신 지연 | 기존과 동일한 이슈. data.js는 HTML과 같이 갱신되므로 실무상 영향 낮음. 필요 시 `<script src="data.js?v=...">` 캐시 버스팅 추가 (스펙 범위 밖) |

## 11. 참고

- 기존 설계: `specs/superpowers/specs/2026-04-22-graphify-knowledge-base-design.md` (`docs/references.json` 파이프라인)
- 기존 빌드 스크립트: `scripts/build-references.mjs`, `scripts/build-references.test.mjs`
- 본 스펙의 AWS 서비스 선정 근거 — 이번 범위를 "핵심 5개"로 제한. EMR/MSK/QuickSight/Redshift Spectrum 등은 후속 PR에서 추가 가능.

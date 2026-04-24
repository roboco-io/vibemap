# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

VibeMap — 60+ 개념 / 7개 카테고리의 "바이브 코딩" 학습 지도. React 기반 인터랙티브 force-directed graph, KO/EN/JA 다국어. <https://vibemap.roboco.io> (GitHub Pages, `main` 브랜치 `/docs` 폴더 서빙).

## Commands

```bash
# 로컬 개발 — docs/를 HTTP 서버로 서빙 (file://은 JSX/CORS로 깨짐)
make serve            # 포그라운드 (Ctrl+C)
make e2e              # 백그라운드 + 자동 브라우저 오픈 + references.json HTTP 체크
make stop             # 백그라운드 서버 종료
make clean            # stop + .make.serve.log 제거

# 테스트 — Node 내장 러너, 외부 의존성 없음 (Node ≥ 18 필요)
make test             # == npm test == node --test scripts/*.test.mjs
node --test scripts/compile-nodes.test.mjs      # 단일 테스트 파일

# 노드 재컴파일 — raw/nodes/ + legacy-*.js → docs/data.js + docs/nodes.json
make compile

# 지식기반 재생성 (compile + graphify + build-references)
bash scripts/ingest.sh
make build                       # compile + build-references 연쇄 실행
node scripts/compile-nodes.mjs --strict     # 깨진 edge가 하나라도 있으면 실패
node scripts/build-references.mjs --strict  # _unmapped > 0이면 exit 2
```

빌드 시스템은 없습니다. `docs/`의 HTML/JS/CSS가 소스이자 배포 산출물이며, JSX는 `@babel/standalone`이 브라우저에서 변환합니다. `npm install`도 불필요 — `package.json`은 스크립트 entry point일 뿐 의존성이 없습니다.

## Architecture

### 세 레이어로 분리된 데이터 소유권

하나의 그래프에 **사람이 쓴 교육용 척추(md SSOT)**, **레거시 폴백**, **자동 생성된 외부 근거 자료**가 겹쳐 있습니다. 세 레이어는 절대 섞지 않습니다:

| 레이어 | 파일 | 소유자 | 변경 시 |
|-------|-----|-------|--------|
| 노드 SSOT (신규) | `raw/nodes/<id>.md` | 사람 | 직접 편집 (frontmatter + `## ko/en/ja` + `[[wiki-link]]`) |
| 노드 생성물 | `docs/data.js` + `docs/nodes.json` | 자동 | `scripts/compile-nodes.mjs`로 재생성, 손으로 편집 금지 |
| 레거시 폴백 | `scripts/legacy-nodes.js` + `scripts/legacy-edges.js` | 사람 (일시적) | 점진적으로 `raw/nodes/`로 이식하여 비워감 |
| 외부 근거 자료 매핑 | `docs/references.json` | 자동 | `scripts/build-references.mjs`로 재생성, 손으로 편집 금지 |

`raw/nodes/<id>.md`가 있는 id는 legacy를 override합니다. md 없는 id는 legacy의 짧은 body로 폴백.

`nodes.json`이나 `references.json`이 손상돼도 사이트는 조용히 fallback — 패널의 해당 섹션만 비어집니다. 이 불변식이 깨지지 않게 유지하세요.

### 노드 파이프라인 (신규)

```
raw/nodes/*.md ─┐
                ├─ compile-nodes.mjs ─▶ docs/data.js + docs/nodes.json
legacy-*.js    ─┘                        (md 우선, 없으면 legacy 폴백)
```

- `raw/nodes/<id>.md`의 frontmatter는 YAML 서브셋(`id`/`cat`/`size`/`title.{ko,en,ja}`/`refs[]`/`extraEdges[]`)만 허용
- 본문은 `## ko` / `## en` / `## ja` 세 섹션 필수. 제한된 markdown — 문단, `**bold**`, `*italic*`, `` `inline code` ``, `### h3`, `-` 리스트, `[[wiki-link]]`만 허용. 나머지는 빌드 에러.
- `[[id]]` 또는 `[[id|표시라벨]]`은 `<a class="wiki-link">`로 변환되고 edges로도 수집. 본문에서 노드 간 관계가 자동 도출.
- 결정론 불변: 두 번 실행해도 data.js / nodes.json 바이트 동일 (id 사전순, edges 정렬).

### 외부 근거 자료 파이프라인 (기존)

```
raw/urls/*.md  ──graphify update──▶  graphify-out/graph.json  ──build-references.mjs──▶  docs/references.json
```

- `raw/urls/`는 외부 블로그 아카이브. `graphify add <URL>`로 추가.
- `build-references.mjs`의 매칭 전략: `data.js`의 각 노드 `id`+`title.{ko,en,ja}`를 NFKC 정규화해 키워드 인덱스를 만들고, graphify 소스의 title/excerpt에 `\b키워드\b`(ASCII) 또는 substring(한·일) 매칭.
- 핵심 상수: `MAX_PER_NODE=10`, `MIN_SCORE=0.3`, `MAX_PER_SOURCE=3`.

### Force-directed graph (`docs/sim.js`)

`d3-force`가 아닌 **자체 O(n²) 시뮬레이터**입니다. 80노드 규모라 Barnes-Hut 생략. `repulsion`/`springLen`/`springK`/`damping`/`center`/`maxV`로 파라미터화되며, `alpha`가 decay하며 수렴. `app.jsx`에서 `setInterval` 대신 `requestAnimationFrame` 루프로 step. "물리엔진 OFF" 토글은 `sim.running=false`로만 구현.

### 등장 애니메이션

`app.jsx`의 `entryProgress` 상태가 0→1로 증가하며, `vibe` 노드로부터 BFS 거리에 따라 각 노드·엣지가 단계적으로 페이드 인. BFS 계산은 `edges`로부터 `useMemo`.

### i18n

`docs/i18n.js`는 **UI 라벨**만. 노드 content는 `docs/nodes.json`의 `nodes[id].body[lang]` HTML 문자열로 fetch 시점에 주입. 선택된 언어는 `localStorage('vibemap.lang')`에 저장.

### 슬라이드 패널 3-tier

1. **본문** — `nodes.json[id].body[lang]` HTML (wiki-link 포함, 이벤트 위임으로 노드 이동)
2. **관련 링크 (refsCurated)** — `nodes.json[id].refs`. 사람이 관리하는 canonical 링크 (AWS 공식 문서 등)
3. **연결 노드 (connections)** — `edges`로부터 도출된 adjacency 칩
4. **더 읽을 자료 (moreReading)** — `references.json[id]`. raw/urls/ 자동 매칭 기사

## Conventions

- **절대 수정 금지 파일** (자동 생성): `docs/data.js`, `docs/nodes.json`, `docs/references.json`. 수정하려면 `raw/nodes/*.md`, `scripts/legacy-*.js`, 또는 `raw/urls/` 중 해당 원본과 빌드 스크립트를 고치세요.
- **커밋 시 함께 업데이트**: `raw/nodes/`를 바꾸면 `docs/data.js` + `docs/nodes.json`을 함께 커밋. `raw/urls/`를 바꾸면 `graphify-out/` + `docs/references.json`도 같이 커밋. 원본과 파생물이 어긋나면 pipeline 디버깅이 어려워집니다.
- **GitHub Pages 배포**: `git push`만으로 자동 배포. CI 없음. `make e2e`는 최소한의 스모크 체크(HTTP 200 · references.json 매핑 수 · nodes.json body 수 출력)를 제공하므로 배포 전 실행 권장.
- **의존성 추가 금지 원칙**: 빌드 도구·번들러·npm 의존성을 도입하지 마세요. React/Babel은 CDN UMD로 불러오고, 스크립트는 Node 내장 API로만 작성합니다. 이 제약이 "비개발자가 `python3 -m http.server`만으로 돌려볼 수 있다"는 교육적 가치의 핵심입니다.

## Current focus

> 이 섹션은 *세션 간 상태*를 담는다. 포커스가 바뀌면 이 블록만 업데이트하고, 이력은 `specs/` 아래로 남긴다.

- **레거시 마이그레이션 완료 (2026-04-24)**: 75개 노드 전부 `raw/nodes/*.md` 기반. `scripts/legacy-nodes.js`는 빈 껍데기(셸)로 남음 — 필요 시 후속 PR로 완전 제거 가능.
- **다음 포커스 후보**: (a) "더 읽을 자료" 보강 — `/vibemap-ingest <URL>`로 외부 글을 `raw/urls/`에 점진 추가 (현재 매핑 4개뿐). (b) 노드 간 cross-reference 밀도 추가 검토 — 현재 580 edges이며 `graphify query`로 god node 재평가. (c) `extraEdges` 활용 — 본문에 자연스럽게 못 녹인 관계를 frontmatter로 선언.
- **신규 노드 추가 워크플로우**: `/vibemap-add-node <keyword>` 또는 `vibemap-add-node` 스킬. 기존 노드 편집은 그냥 raw/nodes/*.md 직접 수정 (hook이 자동 compile).

## Harness

로컬 하네스(`.claude/`)가 아래를 강제·보조한다. 편집하면 즉시 다음 세션부터 반영된다.

- **`.claude/settings.json`** — `docs/data.js|nodes.json|references.json`의 직접 편집 차단(`deny`), 일상 명령 allowlist로 permission 프롬프트 감소.
- **PostToolUse 훅 `post-edit-compile.sh`** — `raw/nodes/*.md` 또는 `scripts/legacy-*.js`를 Edit/Write하면 즉시 `make compile`. 실패 시 블록.
- **PreToolUse 훅 `pre-commit-drift.sh`** — `git commit`이 raw/legacy 변경을 스테이지했는데 `docs/data.js`·`docs/nodes.json`이 빠지면 블록. "raw만 커밋하고 docs 잊기" 사고 방지.
- **`/vibemap-check`** — `make compile` + `make test` + `build-references` 후 한 줄 요약.
- **`/vibemap-ingest <URL>`** — 외부 글을 `raw/urls/`에 넣고 references.json 재생성.
- **`vibemap-add-node` 스킬** — 새 키워드를 노드로 추가 (리서치→작성→컴파일→커밋).
- **`vibemap-migrate-legacy` 스킬** — 기존 레거시 id 들을 배치로 md 승격.
- **`vibemap-node-reviewer` 서브에이전트** — md 노드 품질·포맷 검사(푸시 전 또는 `make compile` 전에 호출). 에이전트는 파일을 수정하지 않는다.

## Specs

주요 설계 결정은 `specs/superpowers/specs/`와 `specs/superpowers/plans/`에 날짜별로 보관됩니다. 아키텍처 변경 전 기존 스펙을 먼저 읽으세요.

## graphify

This project has a graphify knowledge graph at `graphify-out/`.

Rules:
- Before answering architecture or codebase questions, read `graphify-out/GRAPH_REPORT.md` for god nodes and community structure
- If `graphify-out/wiki/index.md` exists, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)

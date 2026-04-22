# VibeMap × graphify 지식기반 통합 설계

- 작성일: 2026-04-22
- 상태: Draft (사용자 리뷰 대기)
- 대상 저장소: `vibemap/` (https://vibemap.roboco.io)

## 1. 배경과 목적

VibeMap은 현재 48개 개념 / 7개 카테고리로 구성된 한국어·영어·일본어 학습 지도이며, 모든 지식은 하드코딩된 `data.js`에 담겨 있다. 외부 블로그·내부 문서·수기 마크다운 노트 같은 원본 자료는 이 지도와 분리되어 있어, 학습자가 한 개념에서 "더 깊이 읽을 자료"로 이동하기 어렵다.

이 설계는 외부 CLI 도구 **graphify**를 도입해 원본 corpus를 기계가 관리 가능한 지식 그래프로 만들고, 그 결과를 VibeMap의 노드 상세 패널에 **근거/참고 자료** 계층으로 얇게 겹쳐 노출한다. 목표는 두 가지다:

1. 48개 핵심 노드의 교육용 구조는 사람이 손으로 유지하되, 각 노드에 "외부 근거"가 자동으로 수집·링크되도록 한다.
2. 자동 파이프라인이 실패해도 사이트가 무너지지 않도록 원본과 파생물의 경계를 명확히 분리한다.

## 2. 핵심 결정

| 항목 | 결정 | 근거 |
|-----|------|-----|
| 전체 방향 | 원본 → graphify → VibeMap 소비 | 지식 관리의 단일 진실원을 raw corpus로 둔다 |
| 원본 소스 | 외부 URL + 내부 저장소 + 마크다운 노트 | 블로그·연구자료·수기 노트를 한 corpus에 모음 |
| 48노드 취급 | Seed로 유지, 외부 자료는 '근거' 계층으로 연결 | 교육용 척추 보존 + 심층 자료 연결 |
| UI 노출 | 노드 슬라이드 패널에 '근거 자료' 섹션 추가 | 그래프 시각화를 그대로 유지 (최소 침습) |
| 매핑 로직 | 순수 자동 — graphify 노드 라벨 ↔ 48노드 id/title 키워드 매칭 | 수작업 최소, 오탐은 안전장치로 격리 |
| 빌드 파이프라인 | 로컬 수동 재생성 + 결과물 git 커밋 | GitHub Pages 정적 서빙과 일치, 재현성 확보 |
| 데이터 포맷 | `data.js`는 손대지 않고 `references.json`을 별도 파일로 생성 | 사람/기계 작성물 분리, 롤백 용이 |

## 3. 아키텍처

### 3.1 파이프라인

```
raw/                         graphify-out/           references.json          VibeMap
┌──────────────┐             ┌──────────────┐        ┌──────────────┐       ┌──────────────┐
│ urls/        │             │              │        │ byNode: {    │       │ data.js      │
│ notes/       │─graphify──▶ │ graph.json   │─build─▶│   intent:[..]│──fetch│ + references │
│ internal/    │ update      │              │  refs  │   vibe: [..] │       │ .json        │
└──────────────┘             └──────────────┘        │ }            │       └──────────────┘
                                                     │ _unmapped:[] │
                                                     └──────────────┘
```

### 3.2 디렉토리 구조 (신규/수정)

```
vibemap/
├── raw/                            # 신규 — 원본 corpus
│   ├── urls/                       # graphify add 가 저장한 HTML/텍스트
│   ├── notes/                      # 수기 마크다운 노트
│   ├── internal/                   # 내부 저장소에서 복사한 문서 (심볼릭 링크 X)
│   └── .gitignore                  # 대용량 바이너리·캐시 제외
├── graphify-out/                   # 신규 — graphify 출력
│   └── graph.json
├── scripts/
│   ├── ingest.sh                   # 신규 — graphify update + build-references 연쇄 실행
│   └── build-references.mjs        # 신규 — graph.json → references.json 변환기
├── references.json                 # 신규 — 최종 산출물 (git에 커밋됨)
├── data.js                         # 기존 — 수정하지 않음
├── app.jsx                         # 수정 — references.json 로드 + 패널 섹션
├── styles.css                      # 수정 — .refs 스타일
├── i18n.js                         # 수정 — "근거 자료" 라벨 ko/en/ja
└── docs/
    └── superpowers/specs/2026-04-22-graphify-knowledge-base-design.md  (본 문서)
```

`raw/internal/`은 **복사본**으로 관리한다. 심볼릭 링크는 graphify의 파일 스캔이 외부 저장소의 무관한 파일까지 탐색할 위험이 있다.

## 4. 매핑 로직

`scripts/build-references.mjs`의 알고리즘.

### 4.1 키워드 사전 구축

각 48노드마다 매칭 키워드 집합을 만든다.

- **1차 키워드**: `id`, `title.ko`, `title.en`, `title.ja`
- **정규화**: NFKC → 소문자 → 구두점 제거 → 공백 단일화
- **다중 토큰 허용**: 공백 포함 구(phrase)도 그대로 유지 (예: `"intent engineering"`)
- **수동 보조 (선택)**: `aliases.json`이 존재하면 node id → 추가 별칭 배열로 주입. MVP는 이 파일 없이 출발.

### 4.2 graphify 그래프 스캔

`graph.json`의 각 원소에 대해 텍스트 대상을 수집:
- `node.label`, `node.summary`, `node.description` 등 라벨성 필드
- 연결된 원본 문서의 `title`, `excerpt` (스키마에 있으면)
- `source.url`, `source.author` (있으면 참고용 메타데이터)

### 4.3 매칭·스코어링

- 정규화된 텍스트에 대해 각 48노드의 키워드를 **단어 경계 기반 서브스트링** 매칭
- 스코어 = (매칭 키워드 수) + (매칭 길이 합 / 전체 텍스트 길이) * 가중치
- 한 자료가 여러 48노드에 매칭되면 상위 3개까지만 연결
- 점수 < 임계치(`MIN_SCORE = 0.3`, MVP 기준) → `_unmapped`로 격리
- 노드당 자료 상한 `MAX_PER_NODE = 10`; 초과 시 스코어 상위로 컷

### 4.4 중복·안전장치

- URL 정규화(trailing slash, utm_* 쿼리 제거) 후 중복 제거
- `references.json`의 `_unmapped` 배열은 사람이 리뷰 대상 — `build-references.mjs` 실행 시 `--strict` 옵션을 주면 `_unmapped`가 비어있지 않으면 exit code ≠ 0
- 빈 `byNode[id]`는 파일에 포함하지 않아 사이즈 절감

## 5. 데이터 스키마

### 5.1 `references.json`

```json
{
  "version": "1",
  "generatedAt": "2026-04-22T10:00:00.000Z",
  "source": "graphify-out/graph.json",
  "stats": {
    "totalSources": 42,
    "mappedNodes": 31,
    "unmappedCount": 3
  },
  "byNode": {
    "intent": [
      {
        "url": "https://intent.roboco.io/",
        "title": "Intent Engineering",
        "excerpt": "Ship intent, not code — AI made generation cheap...",
        "lang": "en",
        "score": 0.84
      }
    ],
    "vibe": [
      {
        "url": "https://roboco.io/posts/the-art-of-vibe-coding/",
        "title": "The Art of Vibe Coding",
        "excerpt": "직관과 느낌으로 AI에게 말을 거는 기술...",
        "lang": "ko",
        "score": 0.91
      }
    ]
  },
  "_unmapped": [
    { "url": "...", "title": "...", "score": 0.12 }
  ]
}
```

### 5.2 필드 정의

| 필드 | 타입 | 설명 |
|------|------|------|
| `version` | string | 스키마 버전 (브레이킹 체인지 시 bump) |
| `generatedAt` | ISO 8601 | 마지막 생성 시각 |
| `source` | string | 생성 근거 파일 경로 |
| `stats.*` | number | 파이프라인 요약 통계 (디버깅용) |
| `byNode[nodeId]` | array | 노드에 연결된 자료 목록 |
| `byNode[*].url` | string | 정규화된 URL (필수) |
| `byNode[*].title` | string | 자료 제목 |
| `byNode[*].excerpt` | string | 본문 첫 문장 또는 1~2줄 (200자 이내) |
| `byNode[*].lang` | `"ko" \| "en" \| "ja" \| "other"` | 원문 언어 — 2글자 감지 실패 시 `"other"` |
| `byNode[*].score` | number | 매칭 신뢰도 (0.0~1.0 근사) |
| `_unmapped` | array | 임계치 미달 자료 — 사람 리뷰 대상 |

## 6. UI/UX 변경

### 6.1 로딩

- `index.html`에 `references.json` 사전 fetch는 넣지 않는다. `app.jsx` 앱 부팅 시 `fetch('./references.json')`으로 비동기 로드.
- 실패/404 → 콘솔 warn만 찍고 빈 객체(`{ byNode: {} }`)로 fallback. 사이트의 기본 기능은 영향받지 않는다.

### 6.2 패널 렌더링

우측 슬라이드 패널의 기존 레이아웃:
1. 카테고리 뱃지
2. 제목
3. 본문 (body)
4. 연결 노드 칩

새로 추가:
5. **근거 자료** 섹션 (본 설계의 핵심 UX 변경)
   - 해당 노드 `byNode[id]` 배열이 비어있으면 섹션 전체 비표시
   - 최대 10개 표시
   - 각 항목 레이아웃:
     - 제목 (외부 링크, `target="_blank" rel="noreferrer noopener"`)
     - 한 줄 excerpt (CSS `line-clamp: 2`)
     - 오른쪽에 작은 언어 뱃지 (KO/EN/JA/…)
   - 섹션 제목은 `i18n.referencesTitle[lang]` 사용
   - 시각적으로 기존 연결 노드 칩 섹션 아래, 얇은 구분선, 살짝 흐린 색

### 6.3 i18n

`i18n.js`에 키 하나 추가:
```js
referencesTitle: { ko: "근거 자료", en: "References", ja: "参考資料" }
```
(빈 배열은 섹션 자체를 숨기므로 "없음" 문구는 별도로 두지 않는다.)

## 7. 운영 워크플로우

### 7.1 새 자료 추가 (일반 경로)

```bash
# 1. 원본 수집
graphify add https://example.com/article --dir raw/urls

# 2. 재인덱스
graphify update raw/

# 3. references.json 생성
node scripts/build-references.mjs

# 4. 결과 검토 (특히 _unmapped)
git diff references.json

# 5. 커밋
git add raw/ graphify-out/graph.json references.json
git commit -m "knowledge: add article X"
git push    # GitHub Pages 배포
```

`scripts/ingest.sh`는 2~3번을 하나로 묶는 편의 스크립트:
```bash
#!/usr/bin/env bash
set -euo pipefail
graphify update raw/
node scripts/build-references.mjs "$@"
```

### 7.2 `_unmapped` 처리

- 정기적으로(또는 PR 전) `references.json`의 `_unmapped`를 본다.
- 정말 쓸모없는 자료면 `raw/`에서 제거.
- 48노드에 포함되어야 할 개념이면 `data.js`에 새 노드를 추가(본 설계 범위 밖의 수작업).
- 키워드 매칭이 실패한 것뿐이면 `aliases.json`(향후 확장)에 별칭 추가.

### 7.3 스키마 마이그레이션

- `references.json.version`이 바뀌면 `app.jsx` 로더가 버전 체크하고 미지원 버전이면 empty fallback.

## 8. 에러와 경계값

| 상황 | 동작 |
|-----|------|
| `references.json` 없음/404 | 콘솔 warn, 빈 객체 fallback, 기존 사이트 정상 |
| `references.json` 파싱 실패 | 동일하게 fallback |
| 버전 미스매치 | 동일하게 fallback |
| graphify 스키마 변경 | `build-references.mjs`만 수정, 나머지 영향 없음 |
| `raw/` 내 대용량 바이너리 | `raw/.gitignore`로 제외 (예: `*.mp4`, `*.pdf > 5MB`는 검토) |
| URL 중복 | 정규화 후 dedup, score 높은 쪽 유지 |
| 언어 감지 실패 | `"other"`로 기록 |

## 9. 비기능 요구

- `references.json` 크기 < 1MB (GitHub Pages 정적 서빙 부담 없음)
- 빌드 스크립트 실행 시간 < 10초 (MVP — 자료 100개 기준)
- `app.jsx` 추가 로딩 지연 < 50ms (비동기 fetch)
- 기존 다국어 전환·검색·필터 기능에 회귀 없음

## 10. 범위 밖 (YAGNI)

- graphify의 `query`/`explain`/`path` 기능은 **개발자 CLI**로만 사용. VibeMap UI에 통합하지 않는다.
- LLM 기반 분류·요약·번역 파이프라인은 도입하지 않는다. 필요시 후속 프로젝트로 분리.
- GitHub Actions CI 자동화는 도입하지 않는다 (수동 커밋 유지).
- 그래프에 서브노드(자료 도트)를 시각적으로 추가하지 않는다.
- 외부 자료 본문의 다국어 번역은 하지 않는다. 원문 언어 뱃지만 표시.
- `aliases.json` 수동 별칭 주입은 MVP 이후 선택적 확장.

## 11. 성공 기준

1. `npm`/`node` 명령 없이도 그래프 시각화는 기존과 동일하게 동작한다.
2. `scripts/ingest.sh`를 실행하면 `references.json`이 결정적으로 생성된다(동일 입력 → 동일 출력).
3. 하나 이상의 실제 외부 자료(예: intent.roboco.io, roboco.io/posts/the-art-of-vibe-coding)가 ingest되어 `intent`, `vibe` 등 관련 노드의 슬라이드 패널에 자동으로 노출된다.
4. `references.json`을 삭제해도 사이트는 콘솔 경고와 함께 정상 동작한다.
5. `_unmapped` 배열이 빈 상태(`--strict`)로 커밋 가능하다.

## 12. 오픈 이슈 (구현 플랜에서 해결)

- `build-references.mjs`가 ES module(.mjs)인지 CommonJS인지 — 현 저장소에 `package.json`이 없으므로 MVP는 의존성 없는 순수 `.mjs`로 작성.
- graphify `graph.json`의 실제 스키마 — 첫 ingest 실행 후 필드 이름을 확인하고 `build-references.mjs`를 맞춘다.
- `raw/internal/`에 어떤 내부 저장소를 얼마만큼 담을지 — 초기에는 `roboco-io/education/`만 작게 시작.

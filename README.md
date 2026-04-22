# VibeMap

비개발자를 위한 바이브 코딩 학습 지도. 의도공학·Claude Code·Git·TDD·AWS 서버리스 등 **48개 개념**을 **7개 카테고리**로 엮어 Obsidian 그래프 뷰 스타일의 인터랙티브 맵으로 탐색합니다.

> **배포 주소:** <https://vibemap.roboco.io>

## 기능

- **Force-directed graph** — 노드 드래그, 줌(휠/핀치), 팬
- **우측 슬라이드 패널** — 노드 클릭 시 설명·비유·연결 노드 칩 표시
- **중심→가지 리플 등장 애니메이션** — BFS 기반 단계적 페이드 인
- **카테고리 필터** — 좌하단 범례에서 토글
- **검색** — 노드 제목 실시간 필터
- **다국어** — 한국어 / English / 日本語 (localStorage에 선택 저장)
- **물리엔진 ON/OFF, 레이아웃 리셋** — 상단 도구 버튼

## 카테고리

| 색상 | 카테고리 | 설명 |
|-----|--------|-----|
| ![#f0abfc](https://placehold.co/10x10/f0abfc/f0abfc.png) | 핵심 | 바이브 코딩 그 자체 |
| ![#c4b5fd](https://placehold.co/10x10/c4b5fd/c4b5fd.png) | 사고방식 | 의도공학, 요건정의, 프롬프트/컨텍스트 엔지니어링 등 |
| ![#a78bfa](https://placehold.co/10x10/a78bfa/a78bfa.png) | AI·LLM | Claude Code 기능(설정·스킬·훅·커맨드·규칙), MCP, 에이전틱 |
| ![#60a5fa](https://placehold.co/10x10/60a5fa/60a5fa.png) | 도구 | Git, 터미널, PR, 린트, 리팩토링, IDE |
| ![#34d399](https://placehold.co/10x10/34d399/34d399.png) | 기술 | TDD, UT/IT/E2E, API(REST·GraphQL), 컨테이너 |
| ![#fbbf24](https://placehold.co/10x10/fbbf24/fbbf24.png) | 데이터 | SQL / NoSQL, DW, 데이터 레이크 |
| ![#f87171](https://placehold.co/10x10/f87171/f87171.png) | 운영·배포 | AWS 서버리스, CI/CD, Vercel, 모니터링, 비용 관리 |

## 로컬 실행

정적 자원만 사용하지만 `file://` 로 열면 JSX/CDN CORS가 막히므로 HTTP 서버를 띄워야 합니다. 웹 자원은 `docs/` 폴더에 있으므로 해당 폴더를 루트로 서빙합니다.

```bash
make serve          # 포그라운드 (Ctrl+C 종료)
make e2e            # 백그라운드 + 브라우저 자동 오픈 + 체크리스트
make stop           # 백그라운드 서버 종료
```

`make help` 로 전체 타겟 확인. Make 없이 직접 돌리려면:

```bash
python3 -m http.server 8080 -d docs
# → http://localhost:8080/
```

## 기술 스택

- **React 18** (UMD) + **@babel/standalone** — 빌드 도구 없이 정적 배포
- **바닐라 CSS** — Obsidian 재해석 다크 보라 테마
- **자체 force simulation** (`sim.js`) — O(n²) 반발력 + 스프링 + 센터링
- **CDN 호스팅 폰트** — Inter, Noto Sans KR, Noto Sans JP
- **GitHub Pages** — `main` 브랜치 `/docs` 폴더 서빙

## 파일 구조

```
vibemap/
├── docs/                   # GitHub Pages 서빙 루트 (웹 자원)
│   ├── index.html          # 엔트리 HTML
│   ├── app.jsx             # React 앱 본체
│   ├── data.js             # 노드 / 엣지 / 카테고리 데이터
│   ├── i18n.js             # KO/EN/JA 번역
│   ├── sim.js              # force-directed 시뮬레이터
│   ├── styles.css          # 전체 스타일
│   └── CNAME               # vibemap.roboco.io
├── specs/superpowers/      # 스펙 · 구현 플랜 문서
│   ├── specs/
│   └── plans/
└── README.md
```

> **GitHub Pages 설정 안내:** 저장소 Settings > Pages > Source에서 **Branch: `main`, Folder: `/docs`** 로 설정해야 합니다. 설정 변경 직후 첫 배포에서 최대 수 분의 지연이 있을 수 있습니다.

## 지식기반 관리 (graphify)

VibeMap의 각 노드에는 외부 자료(블로그·문서·노트)를 자동으로 연결할 수 있습니다. 원본은 `raw/`에 모이고, [graphify](https://github.com/safishamsi/graphify)가 그래프(`graphify-out/graph.json`)로 만든 뒤 `scripts/build-references.mjs`가 48노드별 근거 자료(`docs/references.json`)를 생성합니다. 핵심 교육 노드는 `docs/data.js`에 그대로 유지되고, 근거 자료는 슬라이드 패널에 별도 섹션으로 노출됩니다.

### 새 자료 추가

```bash
# 1) 원본 수집 — graphify가 URL을 fetch해 raw/urls/ 에 markdown으로 저장
graphify add https://example.com/article --dir raw/urls --author "Name"

# 2) LLM 기반 그래프 재생성 — Claude Code 세션에서 입력
/graphify ./raw --update

# 3) docs/references.json 재생성
bash scripts/ingest.sh

# 4) 결과 검토 (_unmapped 배열이 비어있는지, 매핑이 합리적인지)
git diff docs/references.json

# 5) 커밋 & 배포
git add raw/ graphify-out/ docs/references.json
git commit -m "knowledge: add article X"
git push    # GitHub Pages 자동 배포
```

`docs/references.json`이 없거나 손상되면 사이트는 조용히 fallback 동작하므로, 빌드 실패가 사용자 경험을 망치지 않습니다.

### 파이프라인 테스트

```bash
npm test
```

Node ≥ 18 이 필요하며, 별도 npm 의존성은 없습니다.

## 참고

- 의도공학 노드는 <https://intent.roboco.io/> 의 Intent Engineering 프레임워크(Why/What/Not/Learnings, "Ship intent, not code", "Never write How")를 반영했습니다.
- 바이브 코딩 정의는 <https://roboco.io/posts/the-art-of-vibe-coding/> 를 기반으로 합니다.

## 라이선스

MIT

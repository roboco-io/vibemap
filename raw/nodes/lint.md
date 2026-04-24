---
id: lint
cat: tool
size: 3
title:
  ko: Lint·포매터
  en: Lint & Formatter
  ja: Lint・フォーマッタ
refs:
  - url: https://eslint.org/
    title: ESLint — JavaScript linter
    lang: en
  - url: https://prettier.io/
    title: Prettier — Opinionated code formatter
    lang: en
  - url: https://en.wikipedia.org/wiki/Lint_(software)
    title: Lint (software) (Wikipedia)
    lang: en
extraEdges: []
---

## ko

Lint는 **"코드를 실행하지 않고 정적으로 분석해서 버그 가능성·스타일 문제·안티패턴을 지적하는 도구"**다. 1978년 C 언어용 `lint`에서 시작됐고, 오늘날 모든 주요 언어에 표준 linter가 있다 — ESLint(JS/TS), ruff·pyflakes(Python), clippy(Rust), golangci-lint(Go) 등. 코드 리뷰에서 "세미콜론"·"변수 이름"을 사람이 지적하지 않아도 되게 만드는 자동화.

**Lint vs 포매터**는 자주 혼동된다. Lint는 *잠재적 문제*를 지적(쓰지 않은 변수, 잘못된 비교, 리소스 누수 가능성). 포매터는 *시각적 일관성*을 강제(들여쓰기, 줄 길이, 따옴표 스타일). 둘 다 [[cicd]]에 통합하면 팀 전체에 기계적 품질 하한이 생긴다. Prettier·Black·rustfmt·gofmt처럼 "의견 있는 포매터"는 설정 논쟁을 아예 없애버린다.

### 언제 쓰나
- 프로젝트 초기 설정 — 뒤로 갈수록 추가 비용 증가. 첫 커밋부터
- 팀이 커질 때 — 스타일 가이드 문서보다 자동화가 강함
- [[cicd]] 게이트 — PR이 lint 실패면 머지 불가
- 에디터 통합 — 저장 시 자동 수정
- [[claude-code]]·[[ai-coding-tools]]의 생성물 검증 — 자동 수정으로 AI 코드 품질 하한선

### 쉽게 빠지는 함정
- **규칙 과다** — 100개 규칙을 다 켜면 경고만 쏟아져 모두 무시한다. 실제 효과 있는 20개 정도로 시작
- **auto-fix 맹신** — 자동 수정이 의미를 바꿀 수 있음(예: `==` → `===`). PR로 확인
- **포매터와 lint 규칙 충돌** — 둘이 싸우면 저장할 때마다 diff 발생. Prettier + ESLint의 경우 `eslint-config-prettier`로 정리
- **[[cicd]]에서만 실행** — 로컬에서 안 보이면 PR마다 수정 커밋 생김. pre-commit hook으로 로컬부터
- **설정 파일을 하나도 없이** — [[ai-coding-tools]]가 규칙 없이 코드를 짜면 스타일이 튐. CLAUDE.md·Cursor rules에 linter 설정 참조를 명시
- **legacy 코드에 풀 적용** — 수천 개 에러가 한 번에 떠 아무도 고치지 않음. baseline 기능으로 기존 에러 무시하고 신규부터
- **한국어·일본어 주석을 라인 길이 제한에 걸리게** — 전각 문자를 2칸으로 세는 규칙이 필요. 팀별 조정

### 추천 최소 세트
- **포매터**: Prettier(JS), Black(Python), rustfmt, gofmt — 논쟁 종결
- **Linter**: ESLint / ruff / clippy / golangci-lint — 각 언어 표준
- **Commit hook**: lint-staged + husky — 스테이지된 파일만 검사
- **[[cicd]]**: 같은 규칙으로 다시 검증 (로컬 우회 방지)
- **에디터**: VSCode save-on-format

### 연결
[[testing]]과 다른 축의 자동 품질 장치 — lint는 "정적 분석", test는 "동적 검증". [[cicd]] 파이프라인의 첫 단계로 보통 가장 먼저 실행(빠르니까). [[pitfalls]]의 "AI가 생성한 스타일 불일치 코드"를 자동으로 정리. [[ide]]와 짝을 이뤄 개발자 경험 결정. [[claude-code]]·[[cc-hooks]]와 연결해 저장 시 자동 실행 가능.

## en

Lint is **"a tool that statically analyzes code (without running it) to flag potential bugs, style problems, and anti-patterns."** It started with C's `lint` in 1978; today every major language has a standard linter — ESLint (JS/TS), ruff/pyflakes (Python), clippy (Rust), golangci-lint (Go). The automation that saves humans from pointing out semicolons and variable names in code review.

**Lint vs formatter** is often confused. Linters flag *potential problems* (unused variables, wrong comparisons, resource leaks). Formatters enforce *visual consistency* (indentation, line length, quote style). Integrate both into [[cicd]] and the team gets a mechanical quality floor. "Opinionated formatters" like Prettier, Black, rustfmt, and gofmt kill the settings debate entirely.

### When to use
- Early project setup — adding later costs more. From the first commit
- As the team grows — automation beats style guide documents
- As a [[cicd]] gate — PR can't merge on lint failure
- Editor integration — auto-fix on save
- Validating [[claude-code]] / [[ai-coding-tools]] output — auto-fix gives AI code a quality floor

### Common pitfalls
- **Rule overload** — all 100 rules on creates so many warnings everyone ignores them. Start with ~20 impactful rules
- **Trusting auto-fix** — some fixes change meaning (`==` → `===`). Verify via PR
- **Formatter vs lint-rule collisions** — fighting produces diff on every save. For Prettier + ESLint, `eslint-config-prettier` reconciles
- **Only running in [[cicd]]** — invisible locally means every PR grows fix commits. Pre-commit hooks bring it home
- **No config file** — [[ai-coding-tools]] with no rules drift in style. Reference linter config explicitly in CLAUDE.md / Cursor rules
- **Full rollout onto legacy** — thousands of errors land at once, and no one fixes them. Baseline ignore existing and enforce for new
- **Korean / Japanese comments hitting line-length limits** — full-width characters need the "count-as-two" rule. Tune per team

### Recommended minimum
- **Formatter**: Prettier (JS), Black (Python), rustfmt, gofmt — settles debates
- **Linter**: ESLint / ruff / clippy / golangci-lint — language standards
- **Commit hooks**: lint-staged + husky — only checks staged files
- **[[cicd]]**: same rules re-verified (stop local bypass)
- **Editor**: VS Code save-on-format

### How it connects
An automated quality device on a different axis from [[testing]] — lint is static analysis; tests are dynamic verification. Usually the first stage of a [[cicd]] pipeline (it's fast). It automatically cleans up "AI-produced style drift" from [[pitfalls]]. Paired with [[ide]] it shapes developer experience. Can be connected to [[cc-hooks]] for save-time auto-execution.

## ja

Lintは**「コードを実行せず静的に解析して、潜在的バグ・スタイル問題・アンチパターンを指摘するツール」**。1978年のC言語用`lint`に始まり、今日は主要な全言語に標準linterがある — ESLint(JS/TS)、ruff・pyflakes(Python)、clippy(Rust)、golangci-lint(Go)など。コードレビューで「セミコロン」や「変数名」を人が指摘しなくて済む自動化。

**Lint vs フォーマッタ**はよく混同される。Lintは*潜在的問題*を指摘(未使用変数、誤った比較、リソース漏れの可能性)。フォーマッタは*視覚的一貫性*を強制(インデント、行長、引用符スタイル)。両方を[[cicd]]に統合すればチーム全体に機械的品質下限が生まれる。Prettier・Black・rustfmt・gofmtのような「意見のあるフォーマッタ」は設定論争を完全に消す。

### いつ使うか
- プロジェクト初期設定 — 後になるほど追加コスト増。初コミットから
- チームが大きくなるとき — スタイルガイド文書より自動化が強い
- [[cicd]]ゲート — lint失敗ならPRマージ不可
- エディタ統合 — 保存時に自動修正
- [[claude-code]]・[[ai-coding-tools]]生成物の検証 — 自動修正でAIコード品質の下限

### はまりやすい罠
- **ルール過剰** — 100ルール全部オンだと警告が溢れて誰も見ない。実効のある20個程度で始める
- **auto-fix盲信** — 自動修正が意味を変えることがある(`==` → `===`)。PRで確認
- **フォーマッタとlintルールの衝突** — 喧嘩すると保存毎にdiff発生。Prettier + ESLintなら`eslint-config-prettier`で整理
- **[[cicd]]だけで実行** — ローカルで見えなければPR毎に修正コミットが増える。pre-commit hookでローカル側から
- **設定ファイルが一つもない** — [[ai-coding-tools]]がルールなしでコードを書くとスタイルがぶれる。CLAUDE.md・Cursor rulesにlinter設定参照を明記
- **レガシーコードに全適用** — 数千のエラーが一度に出て誰も直さない。baseline機能で既存を無視し新規から強制
- **日本語コメントが行長制限に引っかかる** — 全角文字を2幅でカウントするルールが必要。チーム別に調整

### 推奨最小セット
- **フォーマッタ**: Prettier(JS)、Black(Python)、rustfmt、gofmt — 論争終結
- **Linter**: ESLint / ruff / clippy / golangci-lint — 各言語標準
- **コミットフック**: lint-staged + husky — ステージ済みファイルだけ検査
- **[[cicd]]**: 同ルールで再検証(ローカル回避阻止)
- **エディタ**: VS Codeのsave-on-format

### 繋がり
[[testing]]と別軸の自動品質装置 — lintは「静的解析」、testは「動的検証」。[[cicd]]パイプラインの最初の段階で大抵一番に走る(速いから)。[[pitfalls]]の「AIが生成したスタイル不一致コード」を自動で整える。[[ide]]と対で開発者体験を決める。[[claude-code]]・[[cc-hooks]]と連携すれば保存時に自動実行可能。

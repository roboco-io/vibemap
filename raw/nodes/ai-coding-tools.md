---
id: ai-coding-tools
cat: ai
size: 2
title:
  ko: AI 코딩 도구
  en: AI Coding Tools
  ja: AIコーディングツール
refs:
  - url: https://docs.claude.com/en/docs/claude-code/overview
    title: Claude Code Overview (Anthropic Docs)
    lang: en
  - url: https://cursor.com/docs
    title: Cursor Documentation
    lang: en
  - url: https://simonwillison.net/tags/ai-assisted-programming/
    title: AI-assisted programming coverage — Simon Willison
    lang: en
extraEdges: []
---

## ko

AI 코딩 도구는 **사람의 코딩 작업에 LLM을 끼워 넣은 제품군**이다. 2023년 GitHub Copilot이 "자동완성"으로 시작해, 2024~2026년 사이 "에이전트"로 무게 중심이 옮겨갔다. 지금은 네 가지 계층이 공존한다: **인라인 자동완성**(Copilot, Supermaven) — 타이핑 중 다음 줄을 제안 / **에디터 기반 에이전트**(Cursor Composer, Windsurf) — IDE 안에서 멀티파일 수정 / **터미널 에이전트**([[claude-code]], Codex CLI) — 명령줄·[[git]] 중심 / **프롬프트→앱**(v0, Lovable, Bolt) — 대화 하나로 전체 UI 생성.

어떤 걸 고를지는 *목표*에 따라 바뀐다. 처음부터 만들기? Lovable / v0. 대규모 코드베이스 편집? Cursor / [[claude-code]]. 스크립트 자동화·시스템 작업? [[claude-code]] / Codex. 타이핑 속도만 올리고 싶다? Copilot. 한 도구가 모든 영역을 덮지 못한다 — 조합이 정답이다.

### 언제 어떤 도구
- **새 프로젝트·프로토타입** → v0 / Lovable / Bolt (UI 생성 빠름)
- **기존 코드베이스 리팩터** → [[claude-code]] (파일 수십 개 탐색), Cursor (IDE 친화적)
- **[[cicd]]·배포·시스템 작업** → [[claude-code]] (터미널 기본), Codex
- **자동완성** → Copilot, Supermaven (지연 짧음)
- **학습·이해** → ChatGPT·Claude 웹 (탐구적 대화)

### 쉽게 빠지는 함정
- **도구 쇼핑 중독** — 새 도구가 나올 때마다 갈아타다 정착 못 하는 것. [[harness-eng]] 관점에서 *하나를 깊게*가 대개 낫다
- **[[review-mindset]] 상실** — "Cursor가 빨라서" 읽지 않고 Accept. 속도 이점이 기술 부채로 전환
- **[[pitfalls]] 전체가 여기서 발생** — 이 도구들의 공통 위험. 특히 [[hallucination]]·보안·테스트 누락
- **도구에 맞는 [[prompt-eng]]·[[context-eng]] 없이 씀** — 같은 도구라도 CLAUDE.md·Cursor rules 설정 유무로 품질 2~3배
- **사내 정보를 퍼블릭 모델에 직접** — 엔터프라이즈 설정·자체 호스팅·프라이빗 MCP 없이는 기밀 정보가 샘

### 비교축
- **실행 권한** — 터미널 에이전트가 최대, 자동완성이 최소
- **컨텍스트 크기** — [[claude-code]] 1M 토큰 vs Copilot 수천 줄
- **통합 깊이** — IDE 기반이 [[lint]]·[[testing]]·[[debug]]와 자연 통합, CLI 에이전트가 [[git]]·[[cicd]]와 자연 통합
- **비용** — 프로 티어 월 $20~100, 엔터프라이즈는 별도. [[cost]] 관점에서 [[llmops]]로 추적 필요

### 연결
[[claude-code]]는 이 집합의 대표 케이스로 size 1. [[agentic]] 워크플로우의 실제 상품화. [[harness-eng]]이 설계 원리라면 ai-coding-tools는 그 원리의 시장 구현들. [[pitfalls]]·[[review-mindset]]·[[testing]]이 이 도구들과 짝을 이루는 품질 방어선. [[llmops]] 관점에서 이 도구들을 팀 레벨에서 운영하려면 프롬프트·컨텍스트·권한의 거버넌스가 필요.

## en

AI coding tools are **the product category that wraps LLMs around human coding work**. It started with GitHub Copilot autocomplete in 2023 and, across 2024–2026, the center of gravity shifted to "agents." Four tiers now coexist: **inline autocomplete** (Copilot, Supermaven) — next-line suggestions while you type; **editor agents** (Cursor Composer, Windsurf) — multi-file edits inside the IDE; **terminal agents** ([[claude-code]], Codex CLI) — shell- and [[git]]-centric; **prompt-to-app** (v0, Lovable, Bolt) — one conversation produces a whole UI.

Which you pick depends on the *goal*. From scratch? Lovable / v0. Edit a big codebase? Cursor / [[claude-code]]. Script automation or system work? [[claude-code]] / Codex. Just faster typing? Copilot. No single tool covers every axis — combining is the answer.

### When to use what
- **New project / prototype** → v0, Lovable, Bolt (fast UI generation)
- **Refactor an existing codebase** → [[claude-code]] (dozens of files), Cursor (IDE-native)
- **[[cicd]], deploy, system ops** → [[claude-code]], Codex (terminal-first)
- **Autocomplete** → Copilot, Supermaven (low latency)
- **Learning / exploration** → ChatGPT, Claude web (open-ended chat)

### Common pitfalls
- **Tool-shopping addiction** — switching every time something new drops, never deepening. From a [[harness-eng]] view, "one tool deeply" beats "all tools shallowly"
- **Losing [[review-mindset]]** — "Cursor is fast" so you Accept without reading. Speed converts to tech debt
- **All of [[pitfalls]] lives here** — this category is where [[hallucination]], security gaps, and missing tests all show up
- **Using the tool without [[prompt-eng]] or [[context-eng]]** — same tool, 2–3× quality difference depending on CLAUDE.md / Cursor rules
- **Sending internal info to public models** — without enterprise tier, self-hosted, or private MCP, secrets leak

### Comparison axes
- **Execution power** — terminal agents maximum, autocomplete minimum
- **Context size** — [[claude-code]] 1M tokens vs Copilot's thousands of lines
- **Integration depth** — IDE-based pairs naturally with [[lint]], [[testing]], [[debug]]; CLI agents pair naturally with [[git]], [[cicd]]
- **Cost** — pro tier $20–100/mo, enterprise is separate. Track via [[cost]] and [[llmops]]

### How it connects
[[claude-code]] is the flagship of this set and a size-1 node on its own. It's the productized form of [[agentic]] workflow. If [[harness-eng]] is the design principle, ai-coding-tools are its market implementations. [[pitfalls]], [[review-mindset]], and [[testing]] are the quality defense lines that pair with these tools. From an [[llmops]] view, running these at team scale requires governance over prompts, context, and permissions.

## ja

AIコーディングツールは**人のコーディング作業にLLMを組み込んだ製品群**。2023年のGitHub Copilot「自動補完」に始まり、2024〜2026年にかけて重心が「エージェント」に移った。今は四つの階層が共存する: **インライン補完**(Copilot、Supermaven) — 入力中の次行を提案 / **エディタエージェント**(Cursor Composer、Windsurf) — IDE内で複数ファイル編集 / **ターミナルエージェント**([[claude-code]]、Codex CLI) — コマンドライン・[[git]]中心 / **プロンプト→アプリ**(v0、Lovable、Bolt) — 一つの対話でUI全体を生成。

どれを選ぶかは*目的*次第。最初から作る? Lovable / v0。大規模コードベース編集? Cursor / [[claude-code]]。スクリプト自動化・システム作業? [[claude-code]] / Codex。タイピングを速くしたいだけ? Copilot。一つのツールが全領域を覆わない — 組み合わせが答えだ。

### いつ何を
- **新プロジェクト・プロトタイプ** → v0 / Lovable / Bolt (UI生成が速い)
- **既存コードベースのリファクタ** → [[claude-code]] (数十ファイル探索)、Cursor (IDE親和)
- **[[cicd]]・デプロイ・システム作業** → [[claude-code]]、Codex (ターミナル標準)
- **自動補完** → Copilot、Supermaven (低レイテンシ)
- **学習・理解** → ChatGPT・Claude Web (探索的対話)

### はまりやすい罠
- **ツールショッピング中毒** — 新ツールが出るたび乗り換え定着しない。[[harness-eng]]視点では*一つを深く*が大抵勝つ
- **[[review-mindset]]の喪失** — 「Cursorが速い」から読まずにAccept。速度利得が技術負債に転換
- **[[pitfalls]]の全てがここで起きる** — このカテゴリが[[hallucination]]・セキュリティ穴・テスト欠落の発生源
- **[[prompt-eng]]・[[context-eng]]抜きで使う** — 同じツールでもCLAUDE.md・Cursor rules設定の有無で2〜3倍の品質差
- **社内情報をパブリックモデルに** — エンタープライズ・自ホスティング・プライベートMCPなしでは機密が漏れる

### 比較軸
- **実行権限** — ターミナルエージェントが最大、自動補完が最小
- **コンテキストサイズ** — [[claude-code]] 1Mトークン vs Copilot数千行
- **統合の深さ** — IDEベースは[[lint]]・[[testing]]・[[debug]]と自然統合、CLIエージェントは[[git]]・[[cicd]]と自然統合
- **コスト** — プロ層月$20〜100、エンタープライズは別。[[cost]]と[[llmops]]で追跡

### 繋がり
[[claude-code]]はこの集合の代表ケースで単独でsize 1。[[agentic]]ワークフローの製品化形。[[harness-eng]]が設計原理なら、ai-coding-toolsはその原理の市場実装たち。[[pitfalls]]・[[review-mindset]]・[[testing]]がこれらのツールと対になる品質防御線。[[llmops]]視点ではこれらをチーム規模で運用するには、プロンプト・コンテキスト・権限のガバナンスが必要。

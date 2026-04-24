---
id: agentic
cat: ai
size: 2
title:
  ko: 에이전틱 워크플로우
  en: Agentic Workflow
  ja: エージェント型ワークフロー
refs:
  - url: https://www.anthropic.com/research/building-effective-agents
    title: Building effective agents — Anthropic Research
    lang: en
  - url: https://huyenchip.com/2025/01/07/agents.html
    title: Agents — Chip Huyen
    lang: en
  - url: https://lilianweng.github.io/posts/2023-06-23-agent/
    title: LLM Powered Autonomous Agents — Lilian Weng
    lang: en
extraEdges: []
---

## ko

에이전틱 워크플로우는 **LLM이 "계획→실행→검증→수정"을 자율적으로 반복하는 흐름**이다. 일회성 Q&A와 결정적 차이: 사람은 *목표와 제약*만 주고, 중간 판단은 모델이 한다. "이 버그 고쳐줘"를 던지면 에이전트가 테스트를 돌리고, 실패 원인을 보고, 수정하고, 재테스트하고, 보고서를 남긴다.

2024~2025년 "agentic"이 유행어가 됐지만 핵심 패턴은 단순하다. **툴 사용 루프**(모델이 도구를 호출하고 결과를 받아 다음 행동 결정) + **상태 지속**(작업 중간에 컨텍스트를 외부에 저장) + **자기 검증**(결과를 스스로 확인 후 수정). 이 세 개가 없는 건 "자동화"일 뿐 에이전틱이 아니다. Anthropic의 "Building effective agents"가 유명한 구분을 제시했다: 워크플로우(고정된 코드 경로)와 에이전트(모델이 스스로 다음 단계 선택)는 다르다.

### 언제 쓰나
- **멀티스텝 과제** — 리팩터, 대규모 테스트 복구, 데이터 분석 — 한 번의 컨텍스트 윈도우로 안 끝나는 일
- 실행 비용 대비 결정 비용이 클 때 — 사람이 매 스텝 확인하면 속도 이점이 사라짐
- **탐색적 작업** — 파일 수십 개를 읽으며 원인을 추적해야 할 때
- [[claude-code]]·Cursor agent·Codex — 모두 에이전틱이 기본 모드
- [[mcp]]로 외부 도구 붙여 작업 영역이 넓어질 때

### 쉽게 빠지는 함정
- **권한 과다** — 에이전트에게 쓰기·실행 권한을 넓게 주면 `rm -rf` 사고가 난다. [[claude-code]]의 [[cc-settings]] permissions·샌드박스가 상한선
- **컨텍스트 폭발** — 긴 루프에서 히스토리가 쌓이면 성능 저하. [[context-eng]]으로 계층적 공개·압축
- **검증 생략** — 자기가 한 일을 자기가 맞다고 보고. 독립 검증 단계(테스트 실행, 별도 리뷰어) 필수
- **[[hallucination]]의 증폭** — 한 번의 환각이 이후 루프의 전제가 되어 눈덩이. [[small-steps]]으로 자주 리셋
- **"마법을 기대" 태도** — 에이전트는 **넓지만 얕은** 추론에 강하다. 깊은 도메인 결정은 사람이
- **도구 스프롤** — 쓸 수 있는 툴이 많아질수록 모델이 엉뚱한 선택. 서브에이전트마다 툴 스키마 좁히기

### 패턴
- **ReAct** — 추론(Thought) + 행동(Action) 교대
- **Plan-execute-verify** — 전체 계획 선수립 후 실행, 매 단계 검증
- **오케스트레이터-서브에이전트** — 주 에이전트가 하위 에이전트에 위임

### 연결
[[claude-code]]·[[ai-coding-tools]]의 기본 동작 모드이자 [[harness-eng]]의 실제 구현 대상. [[llm-basics]]가 모델을 설명한다면 agentic은 그 모델을 *도구 루프에 끼운* 형태. [[mcp]]가 외부 세계로의 손, [[context-eng]]이 머리, [[prompt-eng]]이 입, [[hallucination]] 대응이 안전벨트. [[llmops]]는 이 루프를 프로덕션에서 돌리기 위한 운영 도구 전체.

## en

Agentic workflow is the pattern where an LLM **autonomously loops through plan → act → verify → revise**. The decisive difference from one-shot Q&A: you hand over only *goal and guardrails* while the model makes the intermediate decisions. Throw "fix this bug" at an agent and it runs tests, diagnoses the failure, edits code, re-runs, and reports.

"Agentic" became a buzzword in 2024–2025, but the core pattern is simple. **Tool-use loop** (model calls a tool, reads result, decides next action) + **state persistence** (durable context outside the prompt) + **self-verification** (check own output, revise). Lacking any of the three is "automation," not agentic. Anthropic's "Building effective agents" made the useful distinction: workflows (fixed code paths) and agents (model chooses the next step) are different.

### When to use
- **Multi-step tasks** — refactors, mass test repair, data investigation — anything that exceeds one context window
- Execution cost ≪ decision cost — stepping through with a human confirmation loop erases the speed benefit
- **Exploratory work** — traversing dozens of files to trace a cause
- [[claude-code]], Cursor's agent mode, Codex — all default to agentic
- Pairing with [[mcp]] to expand the workspace via external tools

### Common pitfalls
- **Over-permissioned agents** — wide write/execute scope invites the `rm -rf` class of incident. [[cc-settings]] permissions and sandboxing are the ceiling on safety
- **Context explosion** — long loops accumulate history and degrade. Use [[context-eng]] for tiered disclosure and compaction
- **Skipping verification** — self-reporting "I fixed it" without a real check. Independent verification (tests, separate reviewer) is required
- **[[hallucination]] amplification** — one hallucinated fact becomes the premise of subsequent steps; snowballs. Reset often with [[small-steps]]
- **Expecting magic** — agents are strong on *broad but shallow* reasoning. Deep domain decisions stay with humans
- **Tool sprawl** — more available tools → more odd choices. Narrow each subagent's tool schema

### Patterns
- **ReAct** — alternating Reasoning (Thought) and Action
- **Plan-execute-verify** — full plan first, then execute with per-step checks
- **Orchestrator-subagent** — primary delegates to subordinate agents

### How it connects
The default operating mode of [[claude-code]] and [[ai-coding-tools]], and the concrete subject of [[harness-eng]]. If [[llm-basics]] explains the model, agentic wraps that model into a *tool loop*. [[mcp]] is the hand reaching outside, [[context-eng]] the head, [[prompt-eng]] the mouth, [[hallucination]] defense the seatbelt. [[llmops]] is the whole operations stack for running these loops in production.

## ja

エージェント型ワークフローは、LLMが**「計画→実行→検証→修正」を自律的に繰り返す**流れ。単発Q&Aとの決定的違い: 人は*目標と制約*だけ渡し、中間判断はモデルがする。「このバグ直して」と投げれば、エージェントがテストを走らせ、失敗原因を見て、修正し、再実行し、報告する。

2024〜2025年に"agentic"が流行語になったが、核心パターンは単純。**ツール使用ループ**(モデルが道具を呼び出し結果を読んで次の行動を決める) + **状態の永続化**(プロンプト外に持続コンテキスト) + **自己検証**(出力を自分で確認し修正)。この三つがなければ単なる「自動化」であってエージェントではない。Anthropicの"Building effective agents"が有用な区別を示した: ワークフロー(固定コード経路)とエージェント(モデルが次ステップを選ぶ)は別物。

### いつ使うか
- **マルチステップ課題** — リファクタ、大規模テスト復旧、データ分析 — 一回のコンテキストウィンドウで終わらないもの
- 実行コストが判断コストを下回るとき — 各ステップ人が確認すると速度利点が消える
- **探索的作業** — 数十ファイルを辿って原因を追う
- [[claude-code]]・Cursorエージェント・Codex — すべてエージェンティックが既定モード
- [[mcp]]で外部ツールを繋いで作業領域が広がるとき

### はまりやすい罠
- **権限過多** — エージェントに書き込み・実行権限を広く与えると`rm -rf`級の事故が起きる。[[claude-code]]の[[cc-settings]] permissionsとサンドボックスが安全の上限
- **コンテキスト爆発** — 長いループで履歴が積もり性能低下。[[context-eng]]で段階的開示と圧縮
- **検証の省略** — 自分のやったことを自分で「できた」と報告。独立検証段階(テスト実行、別のレビュアー)が必須
- **[[hallucination]]の増幅** — 一度の捏造が以降の前提になり雪だるま式に。[[small-steps]]で頻繁にリセット
- **「魔法を期待」** — エージェントは*広く浅い*推論に強い。深いドメイン判断は人が
- **ツールのばらまき** — 使える道具が増えるほど変な選択。サブエージェント毎にツールスキーマを絞る

### パターン
- **ReAct** — 思考(Thought)と行動(Action)の交互
- **Plan-execute-verify** — 全計画を先に立てて実行、各段階検証
- **オーケストレーター-サブエージェント** — 主エージェントが下位に委譲

### 繋がり
[[claude-code]]・[[ai-coding-tools]]の既定動作モードであり、[[harness-eng]]の実装対象そのもの。[[llm-basics]]がモデルを説明するなら、agenticはそのモデルを*ツールループに組み込んだ*形。[[mcp]]が外界への手、[[context-eng]]が頭、[[prompt-eng]]が口、[[hallucination]]対策がシートベルト。[[llmops]]はこのループを本番で動かす運用スタック全体。

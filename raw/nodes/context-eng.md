---
id: context-eng
cat: mindset
size: 2
title:
  ko: 컨텍스트 엔지니어링
  en: Context Engineering
  ja: コンテキスト工学
refs:
  - url: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
    title: Effective context engineering for AI agents (Anthropic)
    lang: en
  - url: https://simonwillison.net/2025/Oct/1/context-engineering/
    title: Context engineering — Simon Willison
    lang: en
extraEdges: []
---

## ko

Context Engineering은 **모델의 컨텍스트 윈도우에 무엇을, 어떤 순서로, 얼마나 넣을지 설계하는 기술**이다. [[prompt-eng]]이 *한 문장의 문구*를 다듬는 일이라면, 컨텍스트 공학은 그 문구 주변에 배치되는 *전체 자료*(파일·문서·대화 이력·툴 결과·메모리)를 관리하는 일이다. 2024년 말~2025년 Anthropic·Simon Willison 등이 용어를 굳혔고, 지금은 LLM 앱 품질을 좌우하는 가장 큰 축 중 하나다.

핵심 통찰: **컨텍스트는 공짜가 아니다**. 창을 40% 이상 채우면 성능이 떨어지기 시작하고, 관련 없는 내용은 중요한 신호를 덮는다. 그래서 엔지니어링이 필요하다 — 계층적 공개(필요할 때 필요한 것만), 주기적 압축, 파일시스템·외부 메모리에 상태 빼두기, RAG로 적시에 가져오기.

### 언제 쓰나
- LLM 앱이 한 번의 질의가 아니라 **여러 단계로 흘러갈 때** — [[claude-code]]·[[agentic]] 시스템의 기본 문제
- 같은 모델인데 결과가 들쭉날쭉할 때 — 대개 모델 문제가 아니라 컨텍스트 설계 문제
- [[hallucination]]이 잦을 때 — 근거가 컨텍스트에 없으면 모델은 메워 넣는다
- RAG·MCP를 도입할 때 — 검색·툴 결과가 컨텍스트로 들어오는 타이밍과 양을 설계

### 쉽게 빠지는 함정
- **"더 많이 넣으면 더 잘하겠지"** — 반대다. 관련성이 낮은 텍스트는 노이즈가 되어 정밀도를 깎는다
- **채팅 히스토리에 모든 걸 의존** — 세션을 넘기면 날아간다. 중요한 결정은 [[git]] 커밋이나 진행 파일로 외부화
- **정적 시스템 프롬프트를 1000번 고치는 것** — 컨텍스트의 *타이밍*과 *출처*가 더 중요하다. 이게 [[harness-eng]]과 만나는 지점
- **컨텍스트 오염** — 한 번 나쁜 출력이 들어가면 이후 모델이 그걸 근거로 삼는다. [[small-steps]]으로 자주 재시작
- **도구 스펙을 다 로드** — MCP 서버가 붙을수록 툴 설명이 창을 잡아먹는다. 하위 에이전트에 좁혀 전달

### 연결
[[prompt-eng]]의 상위 축이자 [[harness-eng]]의 재료. [[llm-basics]]가 모델 자체를 배우는 일이면, 컨텍스트 공학은 그 모델을 *쓸모 있게 만드는* 설계 규율. [[llmops]]의 핵심 관심사 — 프롬프트와 함께 컨텍스트 파이프라인을 버저닝·평가한다. [[hallucination]] 대응에서 모델을 바꾸기 전에 먼저 의심해야 하는 곳.

## en

Context engineering is **the craft of deciding what goes into a model's context window, in what order, and how much**. Where [[prompt-eng]] tunes *one phrasing*, context engineering manages the *whole material around it* — files, docs, dialogue history, tool outputs, memory. Anthropic and Simon Willison crystallized the term around late-2024 / 2025, and it's now one of the biggest axes of LLM app quality.

The pivotal insight: **context isn't free**. Fill the window past ~40% and performance drops; irrelevant material drowns important signal. That's why engineering is required — tiered disclosure (need-to-know, not everything), periodic compaction, externalizing state to files or memory, retrieving just-in-time via RAG.

### When to use
- LLM apps that flow through **multiple steps**, not a single query — the default case for [[claude-code]] and [[agentic]] systems
- Same model, inconsistent results — usually a context design issue, not a model issue
- High [[hallucination]] rate — the model fills in what the context didn't provide
- Introducing RAG or MCP — retrieval and tool outputs enter the context; their timing and volume must be designed

### Common pitfalls
- **"More context = better results"** — the opposite. Low-relevance text becomes noise and shaves precision
- **State living only in chat history** — it vanishes across sessions. Externalize important decisions to [[git]] commits or a progress file
- **Tuning the static system prompt 1000 times** — the *timing* and *source* of context matter more. This is where you meet [[harness-eng]]
- **Context pollution** — one bad output enters and the model grounds subsequent work on it. Restart often with [[small-steps]]
- **Loading every tool spec** — each MCP server eats window space with its tool descriptions. Narrow them per subagent

### How it connects
The higher axis above [[prompt-eng]] and the raw material of [[harness-eng]]. Where [[llm-basics]] is learning the model itself, context engineering is the design discipline for making that model *useful*. It's a core concern of [[llmops]] — you version and evaluate the context pipeline alongside the prompt. When [[hallucination]] rates climb, this is the place to inspect before swapping models.

## ja

Context Engineeringは**モデルのコンテキストウィンドウに何を、どの順で、どれだけ入れるかを設計する技術**。[[prompt-eng]]が*一文の文言*を磨く仕事なら、コンテキスト工学はその周囲の*素材全体*(ファイル・ドキュメント・対話履歴・ツール結果・記憶)を管理する仕事。2024年末〜2025年にAnthropic・Simon Willisonらが用語を固め、今やLLMアプリ品質を左右する最大の軸の一つだ。

核心の洞察: **コンテキストはタダではない**。ウィンドウを40%以上埋めると性能が落ち始め、関連のない内容は重要な信号を覆い隠す。だから工学が必要だ — 段階的開示(必要なときに必要なものだけ)、周期的圧縮、状態をファイルや外部メモリに外出し、RAGでタイミングよく取得。

### いつ使うか
- LLMアプリが一回の問い合わせでなく**複数ステップで流れる**とき — [[claude-code]]や[[agentic]]システムの基本課題
- 同じモデルなのに結果がブレるとき — 大抵モデル問題でなくコンテキスト設計問題
- [[hallucination]]が頻発するとき — 根拠がコンテキストになければモデルは埋めにいく
- RAGやMCPを導入するとき — 検索結果やツール出力がコンテキストに入るタイミングと量を設計

### はまりやすい罠
- **「多く入れれば良くなる」** — 逆。関連性の低いテキストはノイズになり精度を削る
- **チャット履歴に全てを依存** — セッションを越えれば消える。重要な決定は[[git]]コミットや進捗ファイルに外出し
- **静的システムプロンプトを1000回書き換える** — コンテキストの*タイミング*と*出所*の方が重要。ここで[[harness-eng]]と交差する
- **コンテキスト汚染** — 一度悪い出力が入ると、以降モデルがそれを根拠にする。[[small-steps]]で頻繁にリセット
- **ツール仕様を全ロード** — MCPサーバーが増えるほどツール説明がウィンドウを食う。サブエージェント毎に絞る

### 繋がり
[[prompt-eng]]の上位軸であり、[[harness-eng]]の素材。[[llm-basics]]がモデル自体を学ぶことなら、コンテキスト工学はそのモデルを*役立たせる*設計規律。[[llmops]]の主要関心事 — プロンプトと並んでコンテキストパイプラインをバージョン管理・評価する。[[hallucination]]対策ではモデルを変える前にまず疑うべき場所。

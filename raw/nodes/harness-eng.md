---
id: harness-eng
cat: mindset
size: 2
title:
  ko: Harness Engineering (하네스 엔지니어링)
  en: Harness Engineering
  ja: Harness Engineering (ハーネス工学)
refs:
  - url: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
    title: Effective harnesses for long-running agents (Anthropic Engineering)
    lang: en
  - url: https://www.anthropic.com/engineering/harness-design-long-running-apps/
    title: Harness design for long-running application development (Anthropic Engineering)
    lang: en
  - url: https://addyosmani.com/blog/agent-harness-engineering/
    title: Agent Harness Engineering (Addy Osmani)
    lang: en
extraEdges: []
---

## ko

Harness Engineering은 **LLM을 감싸는 실행 껍데기를 설계·조율하는 일**이다. "하네스(harness)"는 원래 말을 마차에 묶는 가죽 장치 — 모델이라는 말을 현실 과제에 묶어 유용한 일을 시키는 모든 스캐폴딩을 가리킨다: 툴 호출 루프, 컨텍스트·메모리 관리, 샌드박스와 권한, 서브에이전트 조율, 진행 상황 지속화. [[claude-code]] 본체가 바로 하나의 하네스고, Codex·Cursor의 에이전트 모드, 커스텀 에이전트 프레임워크도 마찬가지.

핵심 통찰은 **"에이전트 신뢰성의 병목은 모델 지능이 아니라 인프라"**라는 것. 2025~2026년 들어 Anthropic, OpenAI 등이 장기 실행 에이전트를 운영하며 반복 확인한 결론 — 같은 모델이라도 하네스 설계에 따라 성패가 갈리고, 더 똑똑한 모델일수록 오히려 더 공들인 하네스가 필요하다. [[prompt-eng]]이 *한 프롬프트*를 다듬는 일이라면, 하네스는 그 프롬프트들이 수백 번 순환하는 **루프 전체**를 짜는 일이다.

### 언제 쓰나
- 단발 Q&A를 넘어 **장시간 자율 작업**(코드 작성, 리서치, 리팩터)에 LLM을 붙일 때 — 한 번의 컨텍스트 윈도우로 안 끝나는 일
- 에이전트가 파일을 쓰거나 명령을 실행하는 등 **부작용**이 있을 때 — 권한·샌드박스 설계가 곧 안전의 상한선
- [[agentic]] 시스템이 "됐다 안 됐다" 할 때 — 모델을 바꾸기 전에 하네스부터 의심하는 것이 2026년 기본 자세
- [[claude-code]]의 [[cc-skills]]·[[cc-hooks]]·[[cc-rules]]·[[cc-commands]]처럼 하네스 위에 조직·팀 맥락을 쌓고 싶을 때

### 쉽게 빠지는 함정
- **컨텍스트 과적** — 툴 스펙·문서·과거 대화를 다 욱여넣으면 40%만 써도 성능이 떨어지기 시작. 계층적 공개와 주기적 압축이 필수
- **프롬프트만 만지작** — 시스템 프롬프트를 100번 고쳐도 루프 구조가 나쁘면 개선이 없다. *언제 어떤 프롬프트가 주입되는가*가 더 중요
- **상태를 채팅 히스토리에만 의존** — 세션이 끝나면 날아간다. [[git]] 커밋, 진행 파일, 파일시스템 기반 메모리로 빼내야 여러 컨텍스트 윈도우를 넘어 [[small-steps]]으로 전진 가능
- **툴의 난립** — 서브에이전트마다 허용 툴 스키마를 좁히지 않으면 "Planner가 `rm -rf`를 호출하는" 사고가 난다
- **[[hallucination]] 대응을 모델 탓으로만** — 근거 부족은 대개 컨텍스트 설계 실패. 하네스가 [[context-eng]]의 인프라가 돼줘야 한다
- **AGENTS.md를 정적 문서로** — 하네스 스캐폴딩은 코드처럼 버저닝·피드백 루프로 진화시킬 아티팩트

### 연결
[[prompt-eng]]과 [[context-eng]]이 *무엇을* 모델에게 주느냐의 축이라면, harness-eng은 *언제·어떤 순서·어떤 권한으로* 주느냐의 축. [[intent]]가 프로젝트의 "왜"라면, 하네스는 에이전트 루프의 "어떻게 흐르게 할까". [[agentic]]·[[mcp]]가 재료라면, 하네스는 그 재료로 실제 도는 엔진. [[claude-code]]와 [[ai-coding-tools]]의 경쟁은 곧 하네스 경쟁이다.

## en

Harness engineering is **the craft of designing the runtime shell that wraps an LLM**. A "harness" originally meant the leather rig that tied a horse to a cart — here it names every scaffolding piece that binds the model to real-world work: tool-call loops, context and memory management, sandboxes and permissions, subagent orchestration, progress persistence. [[claude-code]] itself is a harness. So are Codex's and Cursor's agent modes, and any custom agent framework.

The pivotal insight is **"the bottleneck on agent reliability is infrastructure, not intelligence."** Anthropic, OpenAI and others running long-running agents through 2025–2026 kept landing on the same conclusion: the same model can succeed or fail based on harness design, and smarter models actually demand *more* careful harnesses, not less. Where [[prompt-eng]] tunes *one prompt*, harness engineering designs the **whole loop** those prompts circulate through — hundreds of times.

### When to use
- Moving LLMs from one-shot Q&A to **long-running autonomous work** (coding, research, refactors) that blows past a single context window
- Agents that write files, run commands, take any action with **side effects** — permission and sandbox design is the upper bound on safety
- An [[agentic]] system that works sometimes — by 2026, the default move is to suspect the harness before swapping the model
- Layering org/team context on top with [[claude-code]]'s [[cc-skills]], [[cc-hooks]], [[cc-rules]], [[cc-commands]]

### Common pitfalls
- **Context overload** — shoving every tool spec, doc, and past turn into the window degrades performance past ~40% fill. Tiered disclosure and periodic compaction are table stakes
- **Only ever touching the prompt** — you can rewrite the system prompt a hundred times and see no gain if the loop structure is wrong. *When* a prompt fires matters more than its wording
- **State in chat history alone** — gone when the session ends. Externalize to [[git]] commits, progress files, filesystem-backed memory so [[small-steps]] progress survives across context windows
- **Tool sprawl** — if you don't narrow each subagent's tool schema, the "Planner calls `rm -rf`" accident is waiting to happen
- **Blaming [[hallucination]] on the model** — missing grounding is usually a context design failure. The harness has to be the infrastructure of [[context-eng]]
- **Treating AGENTS.md as a static doc** — harness scaffolding is a code-like artifact, versioned and evolved via feedback loops

### How it connects
If [[prompt-eng]] and [[context-eng]] are *what* you hand the model, harness engineering is *when, in what order, and with what authority* you hand it over. [[intent]] answers the project's "why"; the harness answers "how should this loop flow." [[agentic]] and [[mcp]] are the ingredients; the harness is the engine that actually runs on them. [[claude-code]] and [[ai-coding-tools]] compete, at the frontier, on harness.

## ja

Harness Engineeringは**LLMを包む実行シェルを設計・調律する仕事**。「ハーネス」は元々、馬を馬車につなぐ革の装具 — モデルという馬を現実の課題に結び、役立つ仕事をさせる足場一切を指す:ツール呼び出しループ、コンテキスト・メモリ管理、サンドボックスと権限、サブエージェントの統制、進捗の永続化。[[claude-code]]そのものがハーネスであり、Codex・Cursorのエージェントモード、独自エージェントフレームワークも同様。

肝心な洞察は**「エージェント信頼性のボトルネックはモデル知能ではなくインフラ」**ということ。2025〜2026年にAnthropic、OpenAIらが長時間稼働エージェントを運用しながら繰り返し確かめた結論 — 同じモデルでもハーネス設計次第で成否が分かれ、賢いモデルほどむしろ入念なハーネスを要求する。[[prompt-eng]]が*一つのプロンプト*を磨く仕事なら、ハーネスはそのプロンプトが何百回も循環する**ループ全体**を組む仕事だ。

### いつ使うか
- 単発Q&Aを超えて**長時間の自律作業**(コーディング、リサーチ、リファクタ)にLLMを当てるとき — 一回のコンテキストウィンドウで終わらない仕事
- エージェントがファイルを書いたりコマンドを実行したり、**副作用**を持つとき — 権限とサンドボックス設計が安全の上限を決める
- [[agentic]]システムが「うまくいったりいかなかったり」するとき — モデルを替える前にハーネスを疑うのが2026年の既定姿勢
- [[claude-code]]の[[cc-skills]]・[[cc-hooks]]・[[cc-rules]]・[[cc-commands]]のように、ハーネスの上に組織・チームの文脈を積み上げたいとき

### はまりやすい罠
- **コンテキスト過積み** — ツール仕様・ドキュメント・過去対話を全部詰めると40%程度でも性能が落ち始める。段階的開示と周期的圧縮は前提
- **プロンプトだけいじる** — システムプロンプトを100回書き換えてもループ構造が悪ければ改善しない。*いつ*発火するかの方が文面より重要
- **状態をチャット履歴だけに** — セッションが切れると消える。[[git]]コミット、進捗ファイル、ファイルシステム記憶に外出しして、複数コンテキストウィンドウを越えて[[small-steps]]で前進可能に
- **ツールの乱立** — サブエージェント毎に許可ツールスキーマを絞らないと、「Plannerが`rm -rf`を呼ぶ」事故が待っている
- **[[hallucination]]をモデルのせいに** — 根拠不足は大抵コンテキスト設計の失敗。ハーネスが[[context-eng]]のインフラになる必要がある
- **AGENTS.mdを静的ドキュメントに** — ハーネススキャフォールディングはコード同様にバージョン管理し、フィードバックループで進化させる成果物

### 繋がり
[[prompt-eng]]と[[context-eng]]がモデルに*何を*渡すかの軸なら、harness-engは*いつ・どの順で・どの権限で*渡すかの軸。[[intent]]がプロジェクトの「なぜ」なら、ハーネスはエージェントループの「どう流すか」。[[agentic]]と[[mcp]]が材料なら、ハーネスはそれで実際に回るエンジン。[[claude-code]]と[[ai-coding-tools]]の競争は、フロンティアではハーネス競争だ。

---
id: claude-code
cat: ai
size: 1
title:
  ko: Claude Code
  en: Claude Code
  ja: Claude Code
refs:
  - url: https://docs.claude.com/en/docs/claude-code/overview
    title: Claude Code Overview (Anthropic Docs)
    lang: en
  - url: https://github.com/anthropics/claude-code
    title: Claude Code (GitHub)
    lang: en
  - url: https://www.anthropic.com/engineering/claude-code-best-practices
    title: Claude Code Best Practices (Anthropic Engineering)
    lang: en
extraEdges: []
---

## ko

Claude Code는 **터미널에서 돌아가는 에이전트형 코딩 파트너**다. ChatGPT가 브라우저 안에서 답변을 돌려준다면, Claude Code는 파일을 직접 읽고 쓰고, `git`·`npm`·`pytest`를 실제로 실행하고, 테스트가 깨지면 스스로 고치러 들어간다. "주니어 개발자에게 지시한다" 느낌 — 다만 일하는 게 사람이 아니라 [[agentic]] 루프라는 점이 다르다.

본체는 단순하다: LLM + 샌드박스 + 툴 호출 루프. 하지만 그 "본체"를 실제 일에 묶어주는 건 [[harness-eng]]의 산물 — 컨텍스트를 계단식으로 공개하고, 서브에이전트를 분리하고, [[git]] 커밋으로 진행 상황을 지속시키는 스캐폴딩 덩어리다. 사용자는 그 위에 [[cc-skills]]·[[cc-commands]]·[[cc-hooks]]·[[cc-rules]]·[[cc-settings]]으로 조직·프로젝트·팀의 맥락을 얹는다.

### 언제 쓰나
- 단발 Q&A가 아니라 **여러 단계의 코드 변경**이 필요한 일 — 리팩터, 기능 추가, 테스트 복구, 디버깅
- 파일 수십 개에 걸친 탐색이 필요해서 IDE 오토컴플릿만으로는 부족할 때 — [[ai-coding-tools]] 중에서도 "터미널·[[git]] 중심 워크플로우"에 가장 최적화
- [[mcp]]로 외부 도구·DB·API를 에이전트에 물려 작업 공간을 넓히고 싶을 때
- [[tidd]]·[[gitops]]·[[cicd]]처럼 "티켓·PR·커밋이 규율인" 팀에서 에이전트도 그 규율을 지키며 돌아야 할 때

### 쉽게 빠지는 함정
- **맥락 없는 원샷 프롬프트** — "그냥 고쳐줘"로 시작하면 [[hallucination]] 비율이 뛴다. CLAUDE.md에 프로젝트 맥락을, [[cc-rules]]에 규율을, [[intent]]에 왜를 남기는 것이 투자 대비 회수가 가장 크다
- **에이전트에게 너무 많은 툴** — 허용 툴이 넓을수록 `rm -rf` 같은 사고 위험이 커진다. [[cc-settings]]의 permissions로 좁히고, 서브에이전트는 더 좁혀라
- **긴 세션에 상태를 대화 히스토리로만** — 컨텍스트 윈도우를 넘기면 날아간다. [[small-steps]]로 자주 커밋하고 진행 파일을 남겨야 다음 세션이 이어받는다
- **[[prompt-eng]]만 붙잡기** — 단일 프롬프트를 100번 고치는 것보다 [[harness-eng]] 관점에서 루프·컨텍스트·툴 스키마를 재설계하는 게 대개 더 크게 바꾼다
- **리뷰를 에이전트에게 위임** — 생성된 코드를 사람 눈으로 보지 않으면 *의도와 다른 "돌아가는 코드"*가 쌓인다. [[review-mindset]]은 줄일 수 없다

### 연결
[[vibe]] 코딩 지도의 중심축 중 하나이자 [[ai-coding-tools]] 전체의 대표 케이스. [[harness-eng]]이 설계 원리라면 Claude Code는 그 원리가 실제로 굴러가는 구현체. [[mcp]]로 외부 세계와, [[cc-*]] 컴포넌트로 조직 내부와 연결된다. [[tidd]]가 준 티켓이 입력이 되고, [[git]] 커밋이 출력이 되고, [[cicd]]가 그 커밋을 프로덕션까지 나른다 — 워크플로우 한가운데에 앉은 상수.

## en

Claude Code is **an agentic coding partner that lives in your terminal**. Where ChatGPT hands you an answer inside a browser tab, Claude Code reads and writes your files directly, actually runs `git` / `npm` / `pytest`, and goes back in to fix things when a test breaks. It feels like instructing a junior developer — except the worker is an [[agentic]] loop rather than a person.

The core is simple: LLM + sandbox + tool-call loop. But what makes the core useful is the work of [[harness-eng]] around it — tiered context disclosure, subagent isolation, [[git]] commits that persist progress across sessions. On top of that shell, users layer [[cc-skills]], [[cc-commands]], [[cc-hooks]], [[cc-rules]], and [[cc-settings]] to carry project, team, and org context.

### When to use
- Not single Q&A, but **multi-step code changes** — refactors, new features, test repair, debugging
- You need to sweep through dozens of files; IDE autocomplete alone falls short — among [[ai-coding-tools]], Claude Code is tuned for terminal + [[git]] workflows
- You want to widen its workspace via [[mcp]] — external tools, DBs, APIs hooked into the agent loop
- Your team runs on [[tidd]], [[gitops]], [[cicd]] rails and the agent has to keep the same rails

### Common pitfalls
- **Context-free one-shot prompts** — "just fix it" drives [[hallucination]] rates up. Putting project context in CLAUDE.md, discipline in [[cc-rules]], and the why in [[intent]] has the best ROI
- **Too many tools on the agent** — wide tool access means `rm -rf` class accidents. Narrow with [[cc-settings]] permissions; narrow subagents further
- **State living only in chat history on long sessions** — it vanishes past the context window. Commit in [[small-steps]] and keep a progress file so the next session can pick up
- **Tuning only [[prompt-eng]]** — rewriting one prompt a hundred times usually moves the needle less than redesigning the loop, context, and tool schemas from a [[harness-eng]] lens
- **Delegating review to the agent** — if no human reads the output, "code that runs but drifts from intent" piles up. [[review-mindset]] is non-negotiable

### How it connects
One of the central axes of the [[vibe]] coding map and the flagship case of [[ai-coding-tools]]. If [[harness-eng]] is the design principle, Claude Code is the running implementation of it. [[mcp]] connects it outward; [[cc-*]] components connect it inward to the org. A [[tidd]] ticket becomes input; a [[git]] commit becomes output; [[cicd]] carries that commit to production — a constant that sits squarely in the middle of the workflow.

## ja

Claude Codeは**ターミナルで動くエージェント型コーディングパートナー**。ChatGPTがブラウザ内で答えを返すなら、Claude Codeはファイルを直接読み書きし、`git`・`npm`・`pytest`を実際に実行し、テストが落ちれば自ら直しに戻る。「ジュニア開発者に指示する」感覚 — ただし働くのは人間ではなく[[agentic]]ループという点が違う。

本体は単純だ: LLM + サンドボックス + ツール呼び出しループ。しかしその本体を現実の仕事に繋ぐのは[[harness-eng]]の産物 — 段階的コンテキスト開示、サブエージェントの分離、[[git]]コミットによる進捗の永続化、といったスキャフォールディングの塊。ユーザーはその上に[[cc-skills]]・[[cc-commands]]・[[cc-hooks]]・[[cc-rules]]・[[cc-settings]]で組織・プロジェクト・チームの文脈を積む。

### いつ使うか
- 単発Q&Aではなく**複数ステップのコード変更**が必要な仕事 — リファクタ、機能追加、テスト復旧、デバッグ
- 数十ファイルを横断する探索が必要でIDEオートコンプリートでは足りないとき — [[ai-coding-tools]]の中でも「ターミナル・[[git]]中心ワークフロー」に最も最適化
- [[mcp]]で外部ツール・DB・APIをエージェントに繋ぎ、作業空間を広げたいとき
- [[tidd]]・[[gitops]]・[[cicd]]のように「チケット・PR・コミットが規律」のチームで、エージェントも同じ規律で動く必要があるとき

### はまりやすい罠
- **文脈なしのワンショットプロンプト** — 「とりあえず直して」から始めると[[hallucination]]率が跳ねる。CLAUDE.mdにプロジェクト文脈を、[[cc-rules]]に規律を、[[intent]]に「なぜ」を残すのが投資対効果が最も高い
- **エージェントに過剰なツール** — 許可ツールが広いほど`rm -rf`級の事故リスクが上がる。[[cc-settings]]のpermissionsで狭め、サブエージェントはさらに狭める
- **長いセッションで状態を対話履歴だけに** — コンテキストウィンドウを越えれば消える。[[small-steps]]で頻繁にコミットし、進捗ファイルを残せば次セッションが引き継げる
- **[[prompt-eng]]だけに執着** — 一つのプロンプトを100回書き直すより、[[harness-eng]]視点でループ・コンテキスト・ツールスキーマを再設計する方が大抵効く
- **レビューをエージェントに委譲** — 出力を人の目で見なければ「動くが意図と違うコード」が積み上がる。[[review-mindset]]は削れない

### 繋がり
[[vibe]]コーディング地図の中心軸の一つであり、[[ai-coding-tools]]全体の代表ケース。[[harness-eng]]が設計原理なら、Claude Codeはその原理が実際に回っている実装。[[mcp]]で外世界と、[[cc-*]]コンポーネントで組織内部と繋がる。[[tidd]]のチケットが入力になり、[[git]]コミットが出力になり、[[cicd]]がそのコミットを本番まで運ぶ — ワークフローのど真ん中に座る定数。

---
id: prompt-eng
cat: mindset
size: 2
title:
  ko: 프롬프트 엔지니어링
  en: Prompt Engineering
  ja: プロンプト工学
refs:
  - url: https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview
    title: Prompt engineering overview (Anthropic Docs)
    lang: en
  - url: https://www.promptingguide.ai/
    title: Prompt Engineering Guide (DAIR.AI)
    lang: en
  - url: https://en.wikipedia.org/wiki/Prompt_engineering
    title: Prompt engineering (Wikipedia)
    lang: en
extraEdges: []
---

## ko

프롬프트 엔지니어링은 **LLM에게 "잘 부탁하는" 기술**이다. 같은 모델이라도 부탁 방식에 따라 답의 품질이 몇 배 차이 난다는 현상을 체계화한 것. 네 가지만 챙기면 80%는 끝난다 — **역할**(너는 누구냐), **맥락**(지금 상황), **예시**(내가 원하는 출력의 모양), **출력 형식**(JSON? 마크다운? 목록?).

2023년 ChatGPT 대중화와 함께 "기술"로 불리기 시작했지만 지금은 한 축 아래로 내려왔다. **[[context-eng]]**이 더 상위 — "무엇을 주느냐"가 "어떻게 표현하느냐"보다 더 크게 결과를 흔들기 때문이다. 그럼에도 프롬프트 자체의 문법은 여전히 중요하다: Chain-of-Thought("단계적으로 생각해라"), Few-shot(예시 N개 먼저 보여줌), 자기 검증("답 전에 확인해라") 같은 치트키가 실측으로 품질을 끌어올린다.

### 언제 쓰나
- 모델을 이제 막 테스트하거나, 같은 요청을 여러 번 보낼 때 — 반복되는 프롬프트는 다듬을 가치가 있다
- 출력 포맷이 엄격해야 할 때 — JSON 스키마·특정 섹션 구조를 요구하면 후처리가 쉬워진다
- 특정 버전의 모델에 최적화가 필요할 때 — [[llm-basics]] 기준으로 Claude 4.7과 GPT-5.4는 같은 프롬프트에 다른 반응을 보인다
- [[claude-code]] 같은 에이전트에 CLAUDE.md·[[cc-rules]]로 프로젝트 수준 프롬프트를 심을 때

### 쉽게 빠지는 함정
- **마법의 한 줄 믿기** — "전문가처럼 답해" 같은 문구가 실측 효과가 작은데도 과대평가된다. [[pitfalls]]의 단골
- **예시 없이 긴 설명만** — 추상적 지시보다 *구체적 in/out 쌍* 하나가 더 강하다
- **프롬프트만 고치고 [[context-eng]] 외면** — 문구를 100번 다듬어도 관련 파일이 컨텍스트에 없으면 소용없다
- **[[hallucination]]을 프롬프트로만 막으려 함** — "거짓말하지 마"는 효과가 제한적. 근거 주입과 검증 단계가 본질 해결
- **버전 관리 없이 프롬프트 수정** — "어제는 잘 됐는데" 사태. [[tidd]]·[[git]]으로 프롬프트도 아티팩트로 취급

### 연결
[[context-eng]]의 하위 축이자 [[llmops]]의 한 요소. [[claude-code]] 같은 도구에서는 CLAUDE.md·[[cc-rules]]·[[cc-skills]]로 프롬프트가 팀·프로젝트 맥락에 녹아든다. [[hallucination]] 대응에서 단일 방어선이 아니라 여러 방어선 중 하나로 써야 한다. [[harness-eng]] 관점에서는 *한 점*의 도구 — 그 점이 *언제·어떻게* 흐르는지가 더 큰 그림이다.

## en

Prompt engineering is **the craft of asking an LLM well**. Same model, vastly different answers depending on how you phrase the ask — that phenomenon systematized. Four levers cover about 80% of the gains: **role** (who the model is), **context** (the situation), **examples** (the shape of the output you want), **output format** (JSON? markdown? bullet list?).

It earned the title "engineering" during the 2023 ChatGPT wave but has since been demoted one axis below. **[[context-eng]]** sits above it — *what* you supply moves the needle more than *how* you word it. Even so, prompt grammar still matters: Chain-of-Thought ("think step by step"), few-shot (show N examples first), self-verification ("check before answering") demonstrably raise quality.

### When to use
- Early testing of a model, or when the same ask gets reissued — a prompt used many times is worth tuning
- Strict output format — JSON schema or structured sections make downstream parsing easy
- Optimizing for a specific model version — per [[llm-basics]], Claude 4.7 and GPT-5.4 react differently to the same words
- Embedding project-level prompts in agents like [[claude-code]] via CLAUDE.md or [[cc-rules]]

### Common pitfalls
- **Believing in a magic sentence** — "answer like an expert" is overrated; effect size is small. A staple in [[pitfalls]]
- **All instruction, no examples** — abstract directives lose to one concrete in/out pair
- **Tuning prompt, ignoring [[context-eng]]** — rewriting text 100 times can't fix missing relevant files
- **Fighting [[hallucination]] with prompt alone** — "don't make things up" has limited effect. Ground the answer and add a verification step
- **Editing prompts without version control** — "it worked yesterday" syndrome. Treat prompts as artifacts via [[tidd]] and [[git]]

### How it connects
A subaxis of [[context-eng]] and an element of [[llmops]]. In tools like [[claude-code]] the prompt dissolves into team/project context through CLAUDE.md, [[cc-rules]], [[cc-skills]]. Against [[hallucination]] it's one of several defenses, not the only one. From a [[harness-eng]] view, it's a *point* tool — the bigger picture is *when* and *how* that point fires.

## ja

プロンプト工学は**LLMに「うまく頼む」技術**。同じモデルでも頼み方で答の質が数倍違うという現象を体系化したもの。四つ押さえれば8割終わる — **役割**(あなたは誰か)、**文脈**(今の状況)、**例**(欲しい出力の形)、**出力形式**(JSON?マークダウン?箇条書き?)。

2023年のChatGPT大衆化と共に「工学」と呼ばれ始めたが、今は一段下の軸に降りた。**[[context-eng]]**が上位 — *何を*渡すかの方が*どう言うか*よりも結果を大きく振るから。それでもプロンプト自体の文法は依然重要: Chain-of-Thought(「段階的に考えて」)、Few-shot(例をN個先に見せる)、自己検証(「答の前に確認して」)といった手が実測で品質を引き上げる。

### いつ使うか
- モデルをテストし始めたばかり、または同じ要求を何度も送るとき — 繰り返されるプロンプトは磨く価値がある
- 出力形式が厳格なとき — JSONスキーマや特定のセクション構造を要求すれば後処理が楽
- 特定モデルバージョンへの最適化が必要なとき — [[llm-basics]]の通り、Claude 4.7とGPT-5.4は同じ文言に違う反応を示す
- [[claude-code]]のようなエージェントにCLAUDE.mdや[[cc-rules]]でプロジェクトレベルのプロンプトを埋めるとき

### はまりやすい罠
- **魔法の一文を信じる** — 「専門家のように答えて」は過大評価されている。[[pitfalls]]の常連
- **説明ばかりで例がない** — 抽象的指示は具体的なin/outペア一つに負ける
- **プロンプトばかり直して[[context-eng]]を見ない** — 文言を100回書き換えても関連ファイルがコンテキストになければ無駄
- **[[hallucination]]をプロンプトだけで防ぐ** — 「嘘をつくな」の効果は限定的。根拠注入と検証ステップが本質解
- **バージョン管理なしにプロンプト修正** — 「昨日はうまくいったのに」症候群。[[tidd]]・[[git]]でプロンプトもアーティファクトとして扱う

### 繋がり
[[context-eng]]の下位軸であり、[[llmops]]の一要素。[[claude-code]]のようなツールではCLAUDE.md・[[cc-rules]]・[[cc-skills]]を通じてプロンプトがチーム・プロジェクトの文脈に溶ける。[[hallucination]]対策では単一防御線ではなく複数防御線の一つとして使う。[[harness-eng]]視点では*一点*の道具 — その点が*いつ・どう*流れるかがより大きな絵だ。

---
id: intent
cat: mindset
size: 2
title:
  ko: 의도공학
  en: Intent Engineering
  ja: 意図工学
refs:
  - url: https://intent.roboco.io/
    title: Intent Engineering (roboco.io)
    lang: en
extraEdges: []
---

## ko

**"Ship intent, not code."** — 코드가 아니라 '의도'를 배포한다는 관점이다. AI가 생성을 값싸게 만든 시대에, 속도를 소음이 아니라 명료함으로 바꾸는 기술.

[[vibe]] 시대의 가장 큰 실수는 "뭘 만들지" 고민 없이 AI에게 "만들어줘"라고 말하는 것. 그 결과물은 작동해도 왜 존재하는지 설명할 수 없다. 의도공학은 그 공백을 채우는 프레임이다.

### Intent Document의 네 섹션

- **Why** — 왜 존재해야 하는가 (문제·목표·성공 기준)
- **What** — 무엇을 만들 것인가 (기능·플로우·엣지 케이스)
- **Not** — AI가 넘지 말아야 할 선 (금지·범위·보안·품질)
- **Learnings** — 무엇을 시도하고 배웠는가

### 핵심 원칙: Never write How

스택·아키텍처·일정은 AI가 고른다. 인간은 Why/What/Not만 쥐고, 결과를 판단한다. [[requirements]]가 "누가·무엇·왜"까지 답한다면, 의도공학은 "이걸 AI에게 안전하게 맡기기 위한 사전 조약"에 가깝다.

### 의도는 정적이지 않다

seed → exploring → clarified → build, 혹은 언제든 **killed**. 증거가 부족하면 바로 죽여라. [[small-steps]]로 검증하고 [[convergence]]로 수렴시킨다. 이 리듬이 곧 [[simplify]]로 이어진다 — 의도가 명확할수록 삭제할 게 많아진다.

### 예시로 느낌 잡기

- 소음: "좋은 앱 만들기" ❌
- 의도: "신규 유저가 30초 안에 가치를 경험한다" ✅

두 번째 문장은 [[prompt-eng]]과 [[context-eng]]의 기초 재료가 되며, AI 산출물의 합격 기준이 된다. 의도 없이 [[vibe]] 코딩을 시작하면, 빠르게 망가진 것을 많이 만들게 된다.

## en

**"Ship intent, not code."** You deploy intent, not implementation. In an era where AI made generation cheap, intent is how you convert speed into clarity instead of noise.

The classic [[vibe]]-era mistake is telling the AI "build this" without ever figuring out *what* you want. The output may run but nobody can explain why it exists. Intent Engineering fills that gap.

### The four sections of an Intent Document

- **Why** — why it must exist (problem, goal, success bar)
- **What** — what to build (features, flows, edges)
- **Not** — lines AI cannot cross (scope, security, quality)
- **Learnings** — what you tried and discovered

### Core rule: never write How

Stack, architecture, timeline — AI chooses. Humans own Why/What/Not and judge the outcome. Where [[requirements]] answer "who, what, why", Intent Engineering is more like "the safety treaty for handing this to the AI."

### Intent is not static

seed → exploring → clarified → build, or **killed** at any point. Kill fast when evidence is thin. Validate with [[small-steps]] and let results [[convergence|converge]]. That rhythm feeds directly into [[simplify]] — the clearer the intent, the more you can delete.

### Example

- Noise: "Build a good app" ❌
- Intent: "New users reach value in 30 seconds" ✅

The second line is the raw material for [[prompt-eng]] and [[context-eng]], and becomes the pass/fail bar for AI output. Starting [[vibe]] coding without intent means you build many broken things very quickly.

## ja

**"Ship intent, not code."** — コードではなく「意図」をデプロイするという考え方。AIが生成を安くした時代に、速度を騒音ではなく明快さに変える技術。

[[vibe]]時代の最大のミスは、「何を作るか」を考えずにAIに「作って」と言うこと。成果物は動いても、なぜ存在するかを説明できない。意図工学はその空白を埋めるフレーム。

### Intent Documentの4セクション

- **Why** — なぜ存在するか(問題・目標・成功基準)
- **What** — 何を作るか(機能・フロー・エッジケース)
- **Not** — AIが越えてはならない線(禁止・範囲・セキュリティ・品質)
- **Learnings** — 何を試し、何を学んだか

### 原則: Howは書かない

スタック・アーキテクチャ・スケジュールはAIが選ぶ。人間はWhy/What/Notだけ握り、結果を判断する。[[requirements]]が「誰が・何を・なぜ」に答えるなら、意図工学は「AIへ安全に委ねるための事前条約」に近い。

### 意図は静的ではない

seed → exploring → clarified → build、またはいつでも**killed**。証拠が不足していれば即座に殺す。[[small-steps]]で検証し、結果を[[convergence|収束]]させる。このリズムはそのまま[[simplify]]につながる — 意図が明確になるほど削除できる箇所が増える。

### 例

- 騒音: 「良いアプリを作る」❌
- 意図: 「新規ユーザーが30秒で価値に到達」✅

後者が[[prompt-eng]]と[[context-eng]]の素材になり、AI成果物の合否基準となる。意図なしに[[vibe]]コーディングを始めると、壊れたものを高速に大量生産することになる。

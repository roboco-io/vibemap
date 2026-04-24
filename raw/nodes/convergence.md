---
id: convergence
cat: mindset
size: 3
title:
  ko: 수렴 사고
  en: Convergence
  ja: 収束思考
refs:
  - url: https://en.wikipedia.org/wiki/Iterative_and_incremental_development
    title: Iterative and incremental development (Wikipedia)
    lang: en
  - url: https://martinfowler.com/articles/agileFluency.html
    title: The Agile Fluency Model — Martin Fowler
    lang: en
extraEdges: []
---

## ko

수렴 사고는 **"한 번에 정답"을 포기하고 "여러 번 시도해서 정답에 다가간다"**로 목표를 바꾸는 마음가짐이다. AI와 협업할 때 특히 중요하다 — 모델은 확률적이라 같은 프롬프트에 다른 답을 낸다. 이 변동성을 *결함*으로 보면 좌절하고, *재료*로 보면 여러 후보 중 골라 쓰는 능력이 생긴다.

전통 엔지니어링도 수렴적이다(요구분석→설계→구현→테스트→수정 반복). 하지만 LLM과의 대화는 사이클이 *분 단위*로 빨라진다 — 이 속도를 쓰려면 "한 번에 맞추기" 습관을 의식적으로 버려야 한다. 한 번에 완벽을 노리면 오히려 더 느리고 불안정한 결과에 도달한다.

### 언제 쓰나
- 요구가 모호하거나 정답이 여럿인 문제 — UI·UX·카피처럼 "취향"이 섞인 영역
- [[ai-coding-tools]]에게 같은 질문을 3번 이상 보내게 될 때 — 첫 답이 아니라 답들의 *교집합*이 정답에 가깝다
- 프로토타입·탐색 단계 — 목표가 배포가 아니라 학습
- [[small-steps]] 실천 — 각 스텝이 "수렴을 한 번 하는 것"
- [[refactor]] 반복 — 첫 구현이 최종일 수 없다는 전제를 자연스럽게 받아들이게 함

### 쉽게 빠지는 함정
- **수렴 ≠ 방황** — 기준 없이 이것저것 시도하면 수렴이 아니라 헤매는 것. 매 반복마다 *무엇이 나아졌는지* 판단 기준이 있어야 한다
- **모델 변경으로 도피** — 답이 안 나오면 Claude→GPT→Gemini 전전. 보통 문제는 [[context-eng]]이지 모델이 아니다
- **재생성 버튼 중독** — 아무 개선 신호 없이 "다시 해줘"만 반복. 각 시도의 *조건*을 바꿔야 정보가 쌓인다
- **무한 수렴** — "조금만 더"로 완벽을 쫓다 출시 시점을 놓친다. [[tdd]]의 "충분히 좋다" 기준이 필요
- **확정해야 할 것까지 확률적으로 놔둠** — 계약·법·보안처럼 *결정*이 필요한 영역에선 수렴 사고가 방해

### 연결
[[small-steps]]·[[tdd]]·[[refactor]]의 사고 방식 자체. [[ai-coding-tools]]·[[llmops]] 시대의 필수 기질 — 모델의 비결정성을 받아들이고 활용하는 태도. [[context-eng]]과 함께 쓰면 "왜 답이 다른지"를 이해하며 수렴하게 되어 시행착오가 줄어든다. [[hallucination]] 대응에서도 "한 답을 믿지 말고 두세 답을 비교"가 수렴 사고의 실전 응용.

## en

Convergence thinking swaps the goal from **"get it right on try one"** to **"approach the right answer across many tries."** This matters even more with AI — models are probabilistic, so the same prompt yields different answers. Read that variability as a *defect* and you'll be frustrated; read it as *raw material* and you gain the ability to pick from candidates.

Traditional engineering is already convergent (requirements → design → build → test → refine). But with LLMs the cycle shrinks to *minutes*, and using that speed requires consciously abandoning the "nail it in one shot" habit. Aim for perfection in a single pass and you'll actually get slower, shakier results.

### When to use
- Problems with fuzzy requirements or multiple valid answers — UI, UX, copy, anything with taste
- When you're about to ask the same question of [[ai-coding-tools]] a third time — the *intersection* of the answers gets closer to truth than any single reply
- Prototype or exploration phases — goal is learning, not deploy
- As a practice of [[small-steps]] — each step is "one convergence"
- Repeated [[refactor]] — naturally assumes the first implementation isn't final

### Common pitfalls
- **Convergence ≠ drifting** — trying things without a criterion isn't convergence, it's wandering. Each iteration needs a standard for *what got better*
- **Escape-via-model-swap** — Claude → GPT → Gemini carousel. The problem is usually [[context-eng]], not the model
- **Regenerate-button addiction** — mashing "try again" with no change. Each attempt's *conditions* need to shift for information to accumulate
- **Infinite convergence** — chasing "just a bit more" past the ship point. You need [[tdd]]'s "good enough" criterion
- **Probabilizing things that should be decided** — contracts, legal, security call for *decisions*, not convergence

### How it connects
The operating mindset of [[small-steps]], [[tdd]], and [[refactor]]. A non-optional temperament in the [[ai-coding-tools]] / [[llmops]] era — accepting and exploiting model non-determinism. Paired with [[context-eng]] it converges with understanding (why did the answer differ?), reducing trial-and-error. Against [[hallucination]], "don't trust one answer; compare two or three" is this principle applied.

## ja

収束思考は**「一度で正解」を諦めて「何度も試して正解に近づく」**に目標を変える心構え。AIと協業するとき特に重要だ — モデルは確率的なので、同じプロンプトに違う答を出す。この揺らぎを*欠陥*と見ると苛立ち、*素材*と見れば複数候補から選ぶ力が得られる。

伝統的エンジニアリングも収束的だ(要求分析→設計→実装→テスト→修正の反復)。ただしLLMとの対話ではサイクルが*分単位*に縮む — この速度を使うには「一発で当てる」習慣を意識的に捨てる必要がある。一発完璧を狙うと逆により遅く不安定な結果に到る。

### いつ使うか
- 要件が曖昧、正解が複数ある問題 — UI・UX・コピーなど「好み」が絡む領域
- [[ai-coding-tools]]に同じ質問を3回以上送ることになるとき — 最初の答ではなく答たちの*交わり*が正解に近い
- プロトタイプ・探索段階 — 目標はデプロイでなく学習
- [[small-steps]]の実践 — 各ステップが「一回の収束」
- [[refactor]]の反復 — 最初の実装が最終でないという前提を自然に受け入れる

### はまりやすい罠
- **収束 ≠ 彷徨** — 基準なしにあれこれ試すのは収束でなく迷走。毎回「何が良くなったか」の判断基準が要る
- **モデル変更で逃避** — Claude→GPT→Geminiを渡り歩く。問題は大抵[[context-eng]]であってモデルではない
- **再生成ボタン中毒** — 改善信号なしに「もう一度」だけ繰り返す。各試行の*条件*を変えないと情報が積もらない
- **無限収束** — 「あと少し」で完璧を追い出荷を逃す。[[tdd]]の「十分良い」基準が必要
- **確定すべきものまで確率的に残す** — 契約・法務・セキュリティは*決定*が要る領域で、収束思考が邪魔になる

### 繋がり
[[small-steps]]・[[tdd]]・[[refactor]]の思考様式そのもの。[[ai-coding-tools]]・[[llmops]]時代の必須気質 — モデルの非決定性を受け入れ活用する姿勢。[[context-eng]]と一緒に使うと「なぜ答が違うか」を理解しつつ収束でき、試行錯誤が減る。[[hallucination]]対策でも「一つの答を信じるな、二三の答を比べよ」は収束思考の実戦応用。

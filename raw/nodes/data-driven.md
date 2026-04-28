---
id: data-driven
cat: mindset
size: 2
title:
  ko: 데이터 드리븐
  en: Data-Driven
  ja: データドリブン
refs:
  - url: https://docs.growthbook.io/using/fundamentals
    title: A/B Testing Fundamentals — GrowthBook Docs
    lang: en
  - url: https://www.growthbook.io/blog/what-is-a-b-testing
    title: What Is A/B Testing? A Complete Guide — GrowthBook
    lang: en
  - url: https://aakashgupta.medium.com/vibe-coding-met-vibe-experimentation-it-collapsed-4-10-weeks-into-3-8-hours-cc1808aee19e
    title: Vibe Coding Met Vibe Experimentation — Aakash Gupta
    lang: en
extraEdges: []
---

## ko

**"느낌 말고 숫자."** AI가 한 시간에 다섯 개의 변형을 뽑아내는 시대, "이게 더 좋아 보여"라는 직관만으로 방향을 정하면 빠르게 *틀린 방향으로 빠른* 결과를 얻는다. 데이터 드리븐은 *가설 → 데이터 → 선택*의 순환을 코드 결정의 1차 권위로 두는 자세다.

세 갈래가 한 점에서 만난다. **(1) 데이터사이언티스트의 소양** — 추측을 측정 가능한 가설로 바꾸고, 실험 설계와 통계의 흉내라도 안다. **(2) A/B 테스트** — 생성된 두 변형을 실 사용자 흐름에 동시에 흘려 어느 쪽이 정말 좋은지 *causal*하게 판별. **(3) 큐레이션** — AI가 만들어낸 *수십 개의 UI 후보 중 사람이 가치 있는 것을 골라내는 안목*. [[vibe]] 코딩이 4-10주를 3-8시간으로 압축한 이유는 빌드 비용이 거의 0이 됐기 때문이며, 그 결과 병목은 *어느 변형이 옳은가를 결정하는 능력*으로 이동한다.

### 왜 AI 시대에 강력함이 두 배가 되는가

AI는 *가설 공간*을 폭발적으로 넓힌다. "AI는 가설을 늘리고, 인간은 선별한다." 동시에 "통계적 엄밀성이 병목이 아니다. *좋은 가설을 만드는 것*이 병목이다." 모델이 변형을 싸게 만드는 만큼, [[review-mindset]]과 [[intent]]를 데이터로 잇는 *선별의 힘*이 곧 경쟁력. [[claude-code]]·[[ai-coding-tools]]가 변형을 생성하고, [[monitoring]]과 feature flag가 검증하며, 그 사이의 [[harness-eng]]가 사이클을 굴린다.

### 언제 쓰나

- 프론트엔드 카피·레이아웃·온보딩 흐름처럼 *바꿔봐야 알 수 있는* 영역 — vibe experimentation의 본거지
- AI가 같은 요구에 대해 5개의 합리적 후보를 뽑았을 때 — 큐레이션 자체가 가설이 된다
- [[refactor]] 후 성능 회귀가 의심될 때 — 직감 대신 메트릭
- [[intent]] 문서의 success bar를 *측정 가능한 지표*로 내릴 수 있을 때 — 그때만 데이터가 [[convergence|수렴]]을 끌고 간다
- 조직 의사결정에서 HiPPO(가장 직급 높은 사람의 의견)를 깰 근거가 필요할 때

### 언제 안 쓰나

- 결제·인증·보안처럼 한 번 틀리면 끝나는 영역 — 실험보다 명세
- 트래픽이 너무 적어 통계적 유의성에 도달할 수 없을 때 — 데이터 없는 데이터 드리븐은 미신
- 가설이 *세 번 이상 말로 설명되지 않을* 때 — 모호한 가설은 어떤 데이터로도 반증되지 않는다

### 쉽게 빠지는 함정

- **HiPPO 결정** — "내 직감엔…"이 데이터를 덮어쓴다. 실험 결과를 *해석*하는 단계에서도 같은 함정이 재림
- **p-value peeking** — 실험 도중에 결과를 훔쳐보고 *유의해지면 멈추기*. 거짓양성을 양산. Sequential testing이나 Bayesian 프레임은 이 문제를 의식해 설계됐다
- **Over-curation** — 사람이 모든 AI 변형에 손을 대 *원본의 다양성*을 죽인다. 큐레이터의 일은 *고르기*지 *고치기*가 아니다
- **단일 지표 터널** — 전환율 한 개에 모든 결정을 거는 순간, 이탈률·만족도·기술부채는 그림자에서 누적
- **AI의 통계 환각** — 모델이 "변형 A가 12% 더 낫습니다"라고 자신만만하지만 sample size가 50인 경우. [[hallucination]]의 한 형태이며 [[review-mindset]]으로만 잡힌다

### 연결

[[intent]]의 success bar를 *측정 가능한 지표*로 번역하는 장치. [[vibe]] 코딩이 빌드 루프를 가속한 만큼 데이터 드리븐이 [[convergence|수렴]]을 책임진다. [[testing]]·[[tdd]]가 *코드가 기대대로 동작하는가*를 잡는다면, A/B는 *기대 자체가 옳았는가*를 잡는다. [[monitoring]]은 사후 신호, A/B는 사전 검증. [[claude-code]]·[[ai-coding-tools]]가 변형을 만들고 사람이 [[review-mindset]]으로 큐레이션할 때, 그 큐레이션을 *데이터로 객관화*하는 게 데이터 드리븐의 본질. 짧은 사이클의 가설-검증이 곧 [[small-steps]]를 슬로건에서 진짜 엔진으로 바꾼다.

## en

**"Numbers, not vibes."** When an AI cranks out five variants per hour, "this one looks better" is a fast way to head in the *wrong* direction at speed. Data-driven engineering treats the *hypothesis → data → choice* loop as the primary authority on code decisions.

Three threads converge into one. **(1) The data-scientist mindset** — turn guesses into measurable hypotheses; know enough about experiment design and statistics to be dangerous. **(2) A/B testing** — two AI-generated variants run side by side in real user traffic and you find out which is *causally* better. **(3) Curation** — the eye for picking what is actually valuable from dozens of AI-generated UI candidates. The reason [[vibe]] coding collapses 4-10 weeks of experimentation into 3-8 hours is that build cost has gone to nearly zero; the bottleneck shifts to *the ability to decide which variant is right*.

### Why this gets twice as strong in the AI era

AI explodes the *hypothesis space*. "AI expands the set of hypotheses; humans curate them." Equally bluntly: "statistical rigor isn't the bottleneck. *Generating good hypotheses is*." The cheaper variants get to produce, the more competitive advantage moves to the *curation muscle* that ties [[review-mindset]] and [[intent]] back to data. [[claude-code]] and [[ai-coding-tools]] generate variants; [[monitoring]] and feature flags verify them; [[harness-eng]] loops the cycle.

### When to use

- Frontend copy, layout, onboarding flows — anything you can only know by trying. The native territory of vibe experimentation
- When AI returns 5 reasonable candidates for the same request — curation itself becomes the hypothesis
- After a [[refactor]] when you suspect a perf regression — instincts won't tell you
- When the success bar in your [[intent]] doc can be cashed out as a *measurable metric* — only then can data drive [[convergence]]
- When you need evidence to break a HiPPO (Highest-Paid Person's Opinion) call

### When not to

- Payments, auth, security — areas where a single wrong call ends you. Spec, not experiment
- When traffic is too thin to reach statistical power — data-driven without data is just superstition
- When the hypothesis can't survive *being explained out loud three times* — fuzzy hypotheses get falsified by no dataset

### Common pitfalls

- **HiPPO decisions** — "my gut says…" overrides the data. The same trap reappears at the *interpretation* stage after the experiment runs
- **p-value peeking** — checking results mid-experiment and stopping when "significant." Manufactures false positives. Sequential testing and Bayesian frameworks were designed against this
- **Over-curation** — touching every AI variant by hand kills the *diversity* of the original output. The curator's job is to *pick*, not to *fix*
- **Single-metric tunnel** — pin every decision to conversion rate alone, and bounce, satisfaction, and tech debt accumulate in the shadow
- **AI's statistical hallucination** — the model proudly reports "variant A is 12% better" with sample size 50. A flavor of [[hallucination]] caught only by [[review-mindset]]

### How it connects

The instrument that translates the success bar of [[intent]] into a measurable metric. [[vibe]] coding accelerated the build loop, so data-driven becomes the engine of [[convergence]]. [[testing]] and [[tdd]] check *did the code do what I expected*; A/B checks *was my expectation right*. [[monitoring]] is a post-hoc signal, A/B is a pre-decision verification. When [[claude-code]] and [[ai-coding-tools]] generate variants and humans curate via [[review-mindset]], data-driven is what *objectifies* that curation. Short hypothesis-test cycles are what turn [[small-steps]] from a slogan into a real engine.

## ja

**「フィーリングではなく数字」** —— AIが一時間に五つの変形を吐き出す時代、「こっちの方が良さそう」という直感だけで方向を決めれば、*間違った方向に高速で*辿り着く。データドリブンとは、*仮説 → データ → 選択*のループをコード判断の第一権威に据える姿勢だ。

三本の糸が一点で交わる。**(1) データサイエンティストの素養** —— 推測を測定可能な仮説に翻訳し、実験設計と統計の真似事ぐらいはこなす。**(2) A/Bテスト** —— 生成された二つの変形を実ユーザートラフィックに同時に流し、どちらが*因果的に*優れるかを判定。**(3) キュレーション** —— AIが作り出した*数十のUI候補から人間が価値あるものを選び抜く眼*。[[vibe]]コーディングが4-10週間を3-8時間に圧縮できたのはビルドコストがほぼゼロになったからで、ゆえにボトルネックは*どの変形が正しいかを決める能力*へ移る。

### なぜAI時代に強力さが倍増するか

AIは*仮説空間*を爆発的に広げる。「AIが仮説を増やし、人間が選別する」。同時に「統計的厳密さはボトルネックではない。*良い仮説を生み出すこと*こそがボトルネック」。モデルが安く変形を作る分だけ、[[review-mindset]]と[[intent]]をデータに繋ぐ*選別の筋肉*が競争力に変わる。[[claude-code]]・[[ai-coding-tools]]が変形を生成し、[[monitoring]]とフィーチャーフラグが検証し、その間の[[harness-eng]]がサイクルを回す。

### いつ使うか

- フロントエンドのコピー・レイアウト・オンボーディングフロー —— *試さなければ分からない*領域。vibe experimentationの本来の領土
- AIが同じ要求に対して5つの妥当な候補を返したとき —— キュレーション自体が仮説になる
- [[refactor]]後にパフォーマンス退行が疑われるとき —— 直感では判断できない
- [[intent]]文書のsuccess barを*測定可能な指標*に落とせるとき —— そのときだけデータが[[convergence|収束]]を駆動できる
- HiPPO(最高給者の意見)を覆す根拠が必要なとき

### いつ使わないか

- 決済・認証・セキュリティ —— 一度間違えば終わる領域。実験ではなく仕様で押さえる
- トラフィックが薄く統計的検出力に届かないとき —— データなきデータドリブンは迷信
- 仮説が*声に出して三回説明できない*とき —— 曖昧な仮説はどんなデータでも反証されない

### はまりやすい罠

- **HiPPO 決定** —— 「俺の勘では…」がデータを上書きする。実験結果を*解釈*する段階でも同じ罠が再来
- **p-値のpeeking** —— 実験途中で結果を覗き、「有意」になったら止める。偽陽性を量産。Sequential testingやBayesianアプローチはこれへの対策として設計された
- **過剰キュレーション** —— 人間が全てのAI変形に手を入れることで*元の多様性*が死ぬ。キュレーターの仕事は*選ぶ*ことであり*直す*ことではない
- **単一指標トンネル** —— 全判断をコンバージョン率一本に賭けた瞬間、離脱率・満足度・技術的負債が影で積もる
- **AIの統計幻覚** —— モデルが「変形Aは12%良い」と自信満々に言うがサンプルサイズ50。[[hallucination]]の一種で、[[review-mindset]]でしか検出できない

### 繋がり

[[intent]]のsuccess barを*測定可能な指標*に翻訳する装置。[[vibe]]コーディングがビルドループを加速した分、データドリブンが[[convergence|収束]]の責任を負う。[[testing]]・[[tdd]]は*コードが期待通りに動くか*を、A/Bは*期待そのものが正しかったか*を確かめる。[[monitoring]]は事後信号、A/Bは事前検証。[[claude-code]]・[[ai-coding-tools]]が変形を作り人が[[review-mindset]]でキュレーションするとき、そのキュレーションを*データで客観化する*のがデータドリブンの本質。短い仮説-検証サイクルこそが[[small-steps]]をスローガンから真のエンジンに変える。

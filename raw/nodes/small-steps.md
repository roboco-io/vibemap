---
id: small-steps
cat: mindset
size: 3
title:
  ko: 작은 단계
  en: Small Steps
  ja: 小さな一歩
refs:
  - url: https://en.wikipedia.org/wiki/Iterative_and_incremental_development
    title: Iterative and incremental development (Wikipedia)
    lang: en
  - url: https://tidyfirst.substack.com/
    title: Tidy First? — Kent Beck on incremental change
    lang: en
extraEdges: []
---

## ko

작은 단계는 **"한 번에 다 하지 말고, 한 번에 조금만 한다"**는 규율이다. "로그인 기능 만들어줘"보다 "이메일 입력창만 먼저" → "검증 규칙 추가" → "제출 로직"의 순서가 빠르고 안정적으로 수렴한다. Kent Beck의 TDD, 애자일의 짧은 이터레이션, [[git]]의 작은 커밋 — 모두 같은 원리의 다른 표현이다.

작게 쪼개면 세 가지가 따라온다. **피드백 주기가 짧아진다** (테스트·[[cicd]]·리뷰가 금방 돈다), **되돌리기 쉽다** ([[git]] revert 한 번으로 복원), **마음의 부담이 준다** (5분짜리 작업은 시작 허들이 낮다). 반대로 "하루치 변경을 한 커밋에 몰기"는 [[pr]] 리뷰·디버깅·롤백을 모두 불가능에 가깝게 만든다.

### 언제 쓰나
- 요구가 모호하거나 설계가 불확실할 때 — 작은 시도로 정답에 [[convergence]]하는 게 한 방에 맞추려는 것보다 낫다
- [[tdd]]를 할 때 — 테스트 하나 빨간→초록→리팩터 사이클은 본질적으로 작은 단계의 반복
- [[ai-coding-tools]]와 협업할 때 — [[claude-code]] 같은 에이전트는 범위가 좁을수록 [[hallucination]]이 준다
- [[cicd]]·[[trunk]] 기반 개발처럼 "자주 통합한다"는 운영 규율과 함께

### 쉽게 빠지는 함정
- **"작게 쪼개면 비효율적"이라는 오해** — 큰 덩어리 한 방이 빠르게 보이지만, 실패 시 원인 파악 비용이 지수적으로 크다
- **조각이 너무 작아서 의미 손실** — "세미콜론 추가" 같은 마이크로 커밋은 리뷰어를 지치게 한다. 1개의 독립 의도가 1개 조각
- **작게 쓰되 한꺼번에 커밋** — 쪼개고도 한 번에 push하면 [[git]] log에 남은 게 없어 혜택 소실
- **[[refactor]]와 기능 변경을 한 조각에** — 리팩터는 동작 불변, 기능은 동작 변경. 섞으면 리뷰가 지옥이 된다

### 연결
[[tdd]]·[[refactor]]·[[simplify]]의 공통 전제이자 [[convergence]] 사고의 실천 도구. [[trunk]] 기반 개발은 이 규율이 팀 레벨에서 굴러가게 만드는 협업 형태. [[claude-code]] 같은 에이전트에게도 같은 규율이 들어간다 — [[harness-eng]]이 "incremental progress per session"을 핵심 원칙으로 삼는 이유.

## en

Small steps is the discipline of **"don't do it all at once — do a little at once."** "Build the login feature" loses to "just the email field" → "add validation rules" → "wire up submit," which converges faster and more reliably. Kent Beck's TDD, agile's short iterations, [[git]]'s small commits — all the same principle under different names.

Three things follow from shrinking the unit. **Feedback loops shrink** (tests, [[cicd]], review all spin fast), **rollback gets easy** (one [[git]] revert), **starting friction drops** (a 5-minute change has no activation energy). The opposite — bundling a day's worth of changes into one commit — makes [[pr]] review, debugging, and rollback nearly impossible.

### When to use
- Requirements are fuzzy or design is uncertain — small attempts [[convergence|converging]] beats trying to nail it one-shot
- Doing [[tdd]] — red→green→refactor is inherently the small-step loop
- Collaborating with [[ai-coding-tools]] — agents like [[claude-code]] hallucinate less when scope is narrow
- Paired with [[cicd]] or [[trunk]]-based development, where "integrate often" is the team-level discipline

### Common pitfalls
- **Belief that small steps are inefficient** — one big push feels fast until failure, and then root-cause cost explodes
- **Too small to have intent** — "add semicolon" micro-commits exhaust reviewers. One independent intent per chunk, not fewer
- **Chunked work, bundled commit** — splitting the work but pushing all at once wipes out the [[git]] log benefit
- **Mixing [[refactor]] with feature change** — refactor preserves behavior, feature changes it. Mixing them turns review into a nightmare

### How it connects
A shared prerequisite of [[tdd]], [[refactor]], and [[simplify]]; the concrete tool of [[convergence]] thinking. [[trunk]]-based development is how a team turns this into a coordination rhythm. The same rule applies to agents — [[harness-eng]] treats "incremental progress per session" as a core principle for a reason.

## ja

小さな一歩は**「一度に全部やらず、一度に少しだけやる」**という規律。「ログイン機能を作って」より「まずメール入力欄だけ」→「検証ルール追加」→「送信ロジック」の順が速く安定して収束する。Kent BeckのTDD、アジャイルの短いイテレーション、[[git]]の小さなコミット — どれも同じ原理の別表現だ。

小さく刻むと三つが付いてくる。**フィードバックサイクルが短くなる**(テスト・[[cicd]]・レビューが速く回る)、**巻き戻しが簡単**([[git]] revert一発)、**着手の心理的ハードルが下がる**(5分の作業は始めやすい)。逆に「一日分の変更を一コミットに詰める」は[[pr]]レビュー・デバッグ・ロールバックのすべてを不可能に近くする。

### いつ使うか
- 要件が曖昧、設計が不確実なとき — 小さな試行で[[convergence]]する方が一発で当てようとするより良い
- [[tdd]]をやるとき — red→green→refactorのサイクルは本質的に小さな一歩の繰り返し
- [[ai-coding-tools]]と協業するとき — [[claude-code]]のようなエージェントは範囲が狭いほど[[hallucination]]が減る
- [[cicd]]・[[trunk]]ベース開発のように「頻繁に統合する」という運用規律と組み合わせる

### はまりやすい罠
- **「小さく刻むと非効率」という誤解** — 大きな一発が速く見えるが、失敗時の原因究明コストが指数的に大きい
- **小さすぎて意図を失う** — 「セミコロン追加」のマイクロコミットはレビュアーを疲弊させる。1つの独立した意図が1つの塊
- **小さく書いて一気にコミット** — 刻んでも一括pushでは[[git]] logに何も残らず利得が消える
- **[[refactor]]と機能変更を同じ塊に** — リファクタは振る舞いを保ち、機能は変える。混ぜるとレビューが地獄になる

### 繋がり
[[tdd]]・[[refactor]]・[[simplify]]の共通前提であり、[[convergence]]思考の実践道具。[[trunk]]ベース開発はこの規律をチームレベルで回す協業形態。[[claude-code]]のようなエージェントにも同じ規律が入る — [[harness-eng]]が「incremental progress per session」を核心原則とする理由だ。

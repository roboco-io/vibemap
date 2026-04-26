---
id: two-pizza-team
cat: mindset
size: 2
title:
  ko: Two Pizza Team
  en: Two Pizza Team
  ja: Two Pizza Team
refs:
  - url: https://aws.amazon.com/executive-insights/content/amazon-two-pizza-team/
    title: Amazon's Two-Pizza Teams (AWS Executive Insights)
    lang: en
  - url: https://martinfowler.com/bliki/TwoPizzaTeam.html
    title: Two Pizza Team (Martin Fowler bliki)
    lang: en
  - url: https://en.wikipedia.org/wiki/The_Mythical_Man-Month
    title: The Mythical Man-Month — Brooks' Law (Wikipedia)
    lang: en
extraEdges: []
---

## ko

Two Pizza Team은 **"피자 두 판이면 식사가 끝나는 인원수까지만 한 팀에 둔다"**는 Amazon의 운영 도그마다. 보통 5~8명. 핵심은 *간식 메뉴*가 아니라 *커뮤니케이션 비용 수식*이다 — n명의 팀에서 양자 간 채널 수는 **n(n-1)/2**로 자라기 때문에, 5명이면 채널 10개, 10명이면 45개, 20명이면 190개. 인원이 늘면 코딩 시간보다 *조율* 시간이 빠르게 비례 이상으로 잡아먹는다(Brooks' Law). Jeff Bezos가 2002년 무렵 정식화한 이후 Amazon이 [[microservices]]·"you build it, you run it" 문화의 토대로 굳혔다.

이 원칙은 Conway's Law와 짝이다 — *조직 구조가 곧 시스템 구조*. 두 피자 팀이 한 [[microservices]] 서비스를 *완전 소유*하면, 서비스 경계가 팀 경계와 일치해 인접 팀에 의존하지 않고 배포·운영·결정을 끝낸다. [[intent]]·[[requirements]]를 자체 결정하고, [[cicd]]·[[gitops]]·[[serverless]]로 운영을 자동화하면 팀 외부 협의 없이도 사이클이 돈다.

### AI 시대의 가속

바이브 코딩과 [[ai-coding-tools]] 진입 후 이 원칙은 *더 강력해진다*. [[claude-code]] 같은 [[agentic]] 도구가 한 사람의 작업 폭을 5~10배 늘려 — 같은 5명 팀이 예전 30~50명이 다루던 영역을 소유할 수 있다. n(n-1)/2 수식은 그대로지만 **n이 작아지므로 분모는 작아지고**, [[harness-eng]]가 잘 설계된 팀일수록 그 효과가 누적된다. 결과: *더 적은 인원으로 더 넓은 오너십*, 커뮤니케이션 비용은 줄고 혁신 속도는 가속된다. 1인 회사가 SaaS를 운영하는 사례가 흔해진 이유.

### 언제 쓰나
- 새 [[microservices]]·신규 제품 라인을 시작할 때 — 처음부터 작은 팀에 *전체 책임*을 묶기
- 기존 거대 팀이 결정 마비를 겪을 때 — 두 피자 단위로 쪼개고 인터페이스를 [[api]]·계약 테스트로 고정
- AI 에이전트 도입과 함께 — [[harness-eng]]·[[claude-code]] 통해 1인의 영향 반경이 넓어졌으니 팀 사이즈를 *더 줄일 수도* 있음
- [[tidd]]·[[gitops]] 등 *문서·자동화로 협업하는* 운영 인프라가 갖춰진 팀

### 쉽게 빠지는 함정
- **인위적 쪼개기로 의존 지옥** — 팀은 작아졌는데 서비스 경계가 엉성하면 팀 간 의존이 폭증해 결국 더 많은 회의. [[microservices]] 경계 설계가 본질
- **공유 DB·공유 모놀리스** — 두 피자 팀들이 같은 [[db-basics]]에 붙으면 "분산 모놀리스"가 되어 자율성 환상
- **시니어 부족** — 작은 팀에서 한 명이 "단일 threaded leader"여야 하는데 그 위치가 비면 팀이 표류
- **AI 의존을 핑계로 1인화** — n=1은 채널 0이지만 *리뷰어 0*이기도. [[review-mindset]]·[[testing]]·[[security]] 게이트가 무너짐. 사람·에이전트 *조합*이 안전망
- **컨웨이 법칙 무시한 재조직** — 팀만 바꾸고 시스템은 그대로면 6개월 후 원래대로 회귀
- **외부에 보이지 않는 의사결정** — 팀이 작을수록 *결정 로그*가 휘발됨. [[intent]]·[[tidd]] 문서화로 외부에 공유

### 연결
Conway's Law·Brooks' Law·[[microservices]]·[[intent]]가 같은 원의 다른 점들. AI 시대 [[claude-code]]·[[harness-eng]]·[[agentic]]는 이 원의 *반지름을 늘리는* 도구 — 작은 팀이 다룰 수 있는 영역이 커진다. [[serverless]]·[[gitops]]·[[cicd]]는 작은 팀이 운영 부담 없이 자율 배포할 수 있게 해주는 인프라. [[tidd]]는 팀 결정의 휘발을 막는 기록 규율.

## en

Two Pizza Team is **Amazon's operating doctrine of keeping a team small enough that two pizzas can feed everyone** — usually 5 to 8 people. The point isn't the snack menu; it's the *communication-cost equation*: pairwise channels in an n-person team scale as **n(n-1)/2**. Five people = 10 channels; 10 = 45; 20 = 190. Past a threshold, *coordination* eats more time than coding (Brooks' Law). Jeff Bezos formalized it around 2002, and Amazon built [[microservices]] culture and "you build it, you run it" on this foundation.

The principle pairs with Conway's Law — *org structure becomes system structure*. When a two-pizza team *fully owns* one [[microservices]] service, service boundaries align with team boundaries: deploys, operations, and decisions complete without waiting on adjacent teams. The team owns its [[intent]] and [[requirements]], runs its operations on [[cicd]], [[gitops]], and [[serverless]], and the loop closes inside the team.

### Acceleration in the AI era

Vibe coding and [[ai-coding-tools]] make the principle *more powerful*, not less. [[agentic]] tooling like [[claude-code]] expands one person's reach 5–10×, so the same 5-person team can now own what 30–50 people used to. The n(n-1)/2 math is unchanged, but **n shrinks**, and well-designed [[harness-eng]] compounds the effect. Result: *fewer people, wider ownership*, less coordination cost, faster innovation. The one-person SaaS becomes a regular pattern, not an exception.

### When to use
- Launching new [[microservices]] or product lines — bind *full responsibility* to a small team from day one
- A large team is decision-paralyzed — split it into two-pizza units and freeze interfaces with [[api]] and contract tests
- Adopting AI agents — with [[harness-eng]] and [[claude-code]], one person's blast radius is bigger, so team sizes can shrink *further*
- You already have the infra for *coordinating via docs and automation* ([[tidd]], [[gitops]], etc.)

### Common pitfalls
- **Artificial splits → dependency hell** — small teams with sloppy service boundaries spawn cross-team dependencies and *more* meetings. [[microservices]] boundary design is the actual lever
- **Shared DB / shared monolith** — two-pizza teams hitting the same [[db-basics]] is a "distributed monolith" with the illusion of autonomy
- **Missing senior** — every small team needs a single-threaded leader. If that role is vacant, the team drifts
- **Solo using AI as the excuse** — n=1 means zero channels, but also zero reviewers. [[review-mindset]], [[testing]], [[security]] gates collapse. Human + agent *combination* is the safety net
- **Re-org without Conway** — change teams but leave the system architecture the same and you'll regress in six months
- **Decisions invisible from outside** — small teams' decision logs evaporate. [[intent]] and [[tidd]] documentation keeps them shareable

### How it connects
Conway's Law, Brooks' Law, [[microservices]], and [[intent]] are points on the same circle. In the AI era, [[claude-code]], [[harness-eng]], and [[agentic]] are tools that *increase the radius* — the surface a small team can govern grows. [[serverless]], [[gitops]], and [[cicd]] give small teams autonomous operations without the operational tax. [[tidd]] keeps the team's decisions from evaporating.

## ja

Two Pizza Teamは**「ピザ2枚で全員が食事を終えられる人数まで一チームに置く」**Amazonの運用ドクトリン。通常5〜8人。本質は*間食メニュー*ではなく*コミュニケーションコスト式* —— n人のチームでの2者間チャネル数は**n(n-1)/2**で増える。5人=10チャネル、10人=45、20人=190。人数が増えれば*調整*がコーディングより速いペースで時間を食う(Brooks' Law)。Jeff Bezosが2002年頃に定式化し、Amazonが[[microservices]]・"you build it, you run it"文化の土台に据えた。

この原則はConway's Lawと対 —— *組織構造がそのままシステム構造になる*。2-pizzaチームが一つの[[microservices]]を*完全に所有*すれば、サービス境界とチーム境界が一致し、隣接チームに依存せずデプロイ・運用・判断を完結できる。[[intent]]・[[requirements]]を自分達で決め、[[cicd]]・[[gitops]]・[[serverless]]で運用を自動化すれば、チーム外の協議なしにサイクルが回る。

### AI時代の加速

バイブコーディングと[[ai-coding-tools]]の登場で、この原則は*さらに強くなる*。[[claude-code]]のような[[agentic]]ツールが一人の作業範囲を5〜10倍に広げ —— 同じ5人チームがかつて30〜50人で扱っていた領域を所有できる。n(n-1)/2の式は変わらないが**nが小さくなる**ので分母も縮み、[[harness-eng]]が良く設計されたチームほどその効果が積み上がる。結果: *少ない人数でより広いオーナーシップ*、コミュニケーションコストは減り、イノベーション速度は上がる。一人会社がSaaSを運営する事例が普通になった理由。

### いつ使うか
- 新しい[[microservices]]や新製品ラインを始めるとき —— 最初から*全責任*を小さなチームに紐付ける
- 既存の大規模チームが意思決定で麻痺しているとき —— 2-pizza単位に分割し、[[api]]や契約テストでインターフェースを固定
- AIエージェント導入と同時に —— [[harness-eng]]・[[claude-code]]で一人の影響半径が広がったので、チームサイズを*さらに縮める*ことも可能
- [[tidd]]・[[gitops]]など*文書と自動化で協業する*運用基盤が整ったチーム

### はまりやすい罠
- **人為的分割で依存地獄** —— チームを小さくしてもサービス境界がずさんならチーム間依存が爆発し、結局会議が増える。[[microservices]]の境界設計が本質
- **共有DB・共有モノリス** —— 2-pizzaチームが同じ[[db-basics]]に繋がれば「分散モノリス」となり自律性は幻想
- **シニア不在** —— 小チームには一人の"single-threaded leader"が必要。空席だとチームは漂流
- **AIを口実に1人化** —— n=1はチャネル0だが*レビュアー0*でもある。[[review-mindset]]・[[testing]]・[[security]]ゲートが崩れる。人とエージェントの*組み合わせ*こそが安全網
- **コンウェイの法則を無視した再編成** —— チームだけ変えてシステムを変えなければ6ヶ月で元に戻る
- **外から見えない意思決定** —— 小さなチームほど決定ログが揮発する。[[intent]]・[[tidd]]の文書化で共有

### 繋がり
Conway's Law・Brooks' Law・[[microservices]]・[[intent]]は同じ円の別の点。AI時代の[[claude-code]]・[[harness-eng]]・[[agentic]]はその円の*半径を伸ばす*道具 —— 小さなチームが扱える表面積が広がる。[[serverless]]・[[gitops]]・[[cicd]]は小チームが運用負荷なく自律デプロイできるインフラ。[[tidd]]はチームの決定が揮発しないよう記録する規律。

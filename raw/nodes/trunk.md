---
id: trunk
cat: tool
size: 2
title:
  ko: 트렁크 기반 개발
  en: Trunk-Based Development
  ja: トランクベース開発
refs:
  - url: https://trunkbaseddevelopment.com/
    title: Trunk-Based Development — Paul Hammant
    lang: en
  - url: https://martinfowler.com/articles/branching-patterns.html
    title: Patterns for Managing Source Code Branches — Martin Fowler
    lang: en
extraEdges: []
---

## ko

트렁크 기반 개발(Trunk-Based Development, TBD)은 **"모든 개발자가 단 하나의 장수 브랜치(main/trunk)에 하루 한 번 이상 작은 변경을 통합하는 협업 방식"**이다. GitHub Flow, Git Flow 같은 다른 전략과 대비되는 축 — 장수 브랜치를 여러 개 두지 않고, 기능 브랜치도 며칠 이내에 머지한다. Google·Facebook·Netflix 같은 대규모 조직이 오래 써온 패턴이고, 지금은 DORA 연구에서 "고성능 팀의 특징"으로 자주 거론된다.

핵심은 **통합 주기가 짧다**는 것. 기능 브랜치가 1주일 넘게 떠 있으면 머지 충돌·컨텍스트 상실·리뷰 지연이 눈덩이처럼 커진다. TBD는 "아직 완성 안 된 기능도 main에 합치되, **기능 플래그로 꺼둔다**"는 전략으로 이를 해결. 실제 활성화는 별개의 결정이 된다. [[cicd]]·[[testing]]의 안정성이 전제 — 자주 머지하려면 자주 통과하는 파이프라인이 있어야 한다.

### 언제 쓰나
- 활발히 개발되는 제품 — 정체된 레거시에는 과잉
- [[cicd]] 인프라가 충분히 성숙했을 때 — main 빨간 채로 방치 안 되는 규율
- 여러 사람이 같은 코드베이스를 자주 수정하는 상황 — 머지 충돌을 피하려면 *자주* 통합
- [[microservices]]·[[serverless]] 아키텍처 — 서비스별 독립 트렁크로 자연 확장
- 기능 플래그 도구(LaunchDarkly, Unleash, [[dynamodb]] 자체 관리) 사용 팀

### 쉽게 빠지는 함정
- **[[cicd]] 없이 TBD** — main이 빨간 채로 하루 지나면 모든 개발자가 깨진 상태에서 작업. 테스트 자동화는 전제
- **기능 플래그 남발 후 청소 안 함** — 플래그가 100개 쌓이면 코드 복잡도 폭발. 제거 티켓도 같이 생성
- **[[pr]] 리뷰 없이 직접 push** — TBD는 리뷰 없음이 아니라 *빠른 리뷰*. self-merge 금지 규율은 유지
- **거대 변경을 한 번에** — 트렁크 기반에선 큰 변경도 [[small-steps]]으로 쪼개야. 기능 플래그 뒤에 숨기며 점진 배포
- **Git Flow와 혼동** — Git Flow는 장수 브랜치(develop, release, hotfix)가 많음. 전혀 다른 철학
- **[[ai-coding-tools]]가 만든 거대 PR** — TBD 원칙 깨짐. "작게 쪼개서 각각 PR" 규율 에이전트에게도 요구

### 변형
- **Release branch 허용** — 출시 직전에만 짧게 분기, 버그 수정 후 재머지
- **기능 플래그 기반** — main에 합치되 런타임에 ON/OFF
- **Dark launching** — 프로덕션에 코드는 있되 트래픽 라우팅은 점진

### 연결
[[git]]·[[github]]·[[pr]] 워크플로우 위의 협업 전략. [[cicd]]·[[testing]]·[[review-mindset]]이 튼튼해야 성립. [[gitops]]와 영혼이 같다 — "main이 진실의 공급원". [[small-steps]]·[[tdd]]·[[simplify]]의 자연스러운 파트너. [[microservices]] 아키텍처에서는 서비스당 독립 트렁크로 확장. [[pitfalls]]의 "거대 PR" 문제를 원천 차단하는 문화 레이어.

## en

Trunk-Based Development (TBD) is **"a collaboration style where every developer integrates small changes into a single long-lived branch (main/trunk) at least once a day."** It contrasts with strategies like GitHub Flow and Git Flow on the axis of *long-lived branches* — TBD keeps only one, and even feature branches merge within days. Google, Facebook, and Netflix have run this model for years; DORA research frequently cites it as a trait of high-performing teams.

The core is that **integration cycles stay short**. Feature branches that live longer than a week snowball merge conflicts, context loss, and delayed reviews. TBD answers this by "merging unfinished features into main too — **with a feature flag hiding them off**." Activation becomes a separate decision. Stable [[cicd]] and [[testing]] are prerequisites — frequent merge requires a frequently-passing pipeline.

### When to use
- Actively developed products — overkill for stagnant legacy
- When [[cicd]] infrastructure is mature enough — the discipline of "no red main for long" must hold
- When many people modify the same codebase frequently — avoid merge conflicts by integrating *often*
- [[microservices]] / [[serverless]] architectures — extend naturally to per-service trunks
- Teams using feature-flag tools (LaunchDarkly, Unleash, or homegrown via [[dynamodb]])

### Common pitfalls
- **TBD without [[cicd]]** — main staying red overnight means everyone works on broken ground. Test automation is foundational
- **Feature-flag bloat without cleanup** — 100 stale flags explode complexity. Create removal tickets alongside
- **Skipping [[pr]] review** — TBD isn't "no review"; it's *fast review*. Still ban self-merge
- **Giant single change** — even under TBD, split by [[small-steps]] and hide behind flags for gradual rollout
- **Confusing with Git Flow** — Git Flow has many long-lived branches (develop, release, hotfix). Fundamentally different philosophy
- **[[ai-coding-tools]] producing giant PRs** — breaks TBD. Enforce "split into small PRs" for agents too

### Variants
- **Short-lived release branches** — branch right before release, bugfix, merge back
- **Feature-flag driven** — merge into main but toggle at runtime
- **Dark launching** — code in production with traffic routing rolled out gradually

### How it connects
A collaboration strategy built on [[git]], [[github]], and [[pr]] workflows. Requires solid [[cicd]], [[testing]], and [[review-mindset]]. Shares a soul with [[gitops]] — "main is the source of truth." A natural partner to [[small-steps]], [[tdd]], and [[simplify]]. In [[microservices]] architectures, extend to per-service trunks. The cultural layer that blocks the "giant PR" entry in [[pitfalls]] at the source.

## ja

トランクベース開発(Trunk-Based Development、TBD)は**「全開発者が唯一の長寿ブランチ(main/trunk)に日に一度以上小さな変更を統合する協業方式」**。GitHub Flow・Git Flowなど他の戦略と対比される軸 — 長寿ブランチを複数持たず、フィーチャーブランチも数日以内にマージする。Google・Facebook・Netflixのような大規模組織が長く使ってきたパターンで、今やDORA研究で「高業績チームの特徴」として頻繁に挙げられる。

核となるのは**統合周期が短い**こと。フィーチャーブランチが1週間以上開いたままだとマージ衝突・文脈喪失・レビュー遅延が雪だるま式に。TBDは「未完成の機能もmainにマージするが、**フィーチャーフラグで隠してオフ**」という戦略で解決する。実際の有効化は別の判断になる。[[cicd]]・[[testing]]の安定性が前提 — 頻繁にマージするには頻繁に通るパイプラインが必要。

### いつ使うか
- 活発に開発中の製品 — 停滞したレガシーには過剰
- [[cicd]]インフラが十分成熟しているとき — main赤のまま放置されない規律
- 複数人が同じコードベースを頻繁に修正する状況 — マージ衝突を避けるには*頻繁に*統合
- [[microservices]]・[[serverless]]アーキテクチャ — サービスごとの独立トランクに自然拡張
- フィーチャーフラグツール(LaunchDarkly、Unleash、[[dynamodb]]自前管理)使用チーム

### はまりやすい罠
- **[[cicd]]なしのTBD** — mainが赤のまま一日続けば全開発者が壊れた状態で作業。テスト自動化は前提
- **フィーチャーフラグの乱立・掃除なし** — フラグが100個たまるとコード複雑度が爆発。削除チケットも一緒に作る
- **[[pr]]レビュー飛ばして直接push** — TBDはレビューなしではなく*速いレビュー*。セルフマージ禁止の規律は維持
- **巨大変更を一度に** — トランクベースでも大きい変更は[[small-steps]]で分割。フィーチャーフラグの裏で段階的展開
- **Git Flowと混同** — Git Flowは長寿ブランチ(develop、release、hotfix)多数。全く違う哲学
- **[[ai-coding-tools]]が作る巨大PR** — TBD原則崩壊。「小さく分けて各々PR」規律をエージェントにも要求

### バリエーション
- **短寿命release branch** — リリース直前だけ短く分岐、バグ修正後再マージ
- **フィーチャーフラグ方式** — mainに入れてランタイムでON/OFF
- **Dark launching** — 本番にコードはあるがトラフィックルーティングは段階的

### 繋がり
[[git]]・[[github]]・[[pr]]ワークフロー上の協業戦略。[[cicd]]・[[testing]]・[[review-mindset]]が堅牢でないと成立しない。[[gitops]]と魂を共有 — 「mainが真実の源」。[[small-steps]]・[[tdd]]・[[simplify]]の自然なパートナー。[[microservices]]ではサービスごとの独立トランクに拡張。[[pitfalls]]の「巨大PR」問題を根源で塞ぐ文化層。

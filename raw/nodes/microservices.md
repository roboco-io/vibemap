---
id: microservices
cat: tech
size: 3
title:
  ko: 마이크로서비스
  en: Microservices
  ja: マイクロサービス
refs:
  - url: https://martinfowler.com/articles/microservices.html
    title: Microservices — Martin Fowler
    lang: en
  - url: https://samnewman.io/books/building_microservices_2nd_edition/
    title: Building Microservices — Sam Newman
    lang: en
  - url: https://microservices.io/
    title: Microservices.io — Chris Richardson
    lang: en
extraEdges: []
---

## ko

마이크로서비스는 **"한 서비스를 작고 독립된 여러 서비스로 쪼개어 각자 배포·확장·팀 소유할 수 있게 만드는 아키텍처 스타일"**이다. Martin Fowler·James Lewis가 2014년에 정의를 내린 이래 현업의 표준 선택지 중 하나가 됐다. 반대는 모놀리식 — 하나의 배포 단위에 모든 기능. 두 쪽 모두 정당한 선택이고, "무엇이 더 좋냐"가 아니라 "우리 조직과 도메인에 맞느냐"의 문제.

핵심 약속 셋. **독립 배포**(서비스 A를 B 리스크 없이 배포), **기술 독립**(서비스마다 다른 언어·DB·[[framework]] 가능), **팀 독립**(한 팀이 하나 또는 몇 개 서비스를 끝까지 소유). 그 대가로 얻는 문제 셋. **분산 복잡성**(네트워크 실패·부분 실패·일관성), **운영 부담 증가**(N개 서비스의 [[cicd]]·[[monitoring]]·인증), **경계 설계의 어려움**("이 기능은 어느 서비스?"). Sam Newman의 "Building Microservices" 2판이 표준 교본.

### 언제 쓰나
- 조직이 커져 한 레포·한 배포 단위에 팀 여럿이 부딪힐 때
- 서비스마다 스케일·기술 요구가 크게 다를 때 (ML 서비스는 GPU, 관리자 툴은 DB 중심 등)
- [[serverless]] + [[dynamodb]] + [[apigw]] 조합으로 각 서비스가 자연스럽게 분리될 때
- 도메인이 명확히 쪼개져 있고 [[domain]] 주도 설계가 자연스러울 때
- **반대로**: 초기 스타트업·작은 팀·도메인이 불명확하면 **모놀리식 먼저**

### 쉽게 빠지는 함정
- **너무 이른 분산** — 도메인을 모른 채 쪼개면 나중에 경계 재설계 지옥. "모놀리스 퍼스트" 원칙
- **분산 모놀리스** — N개 서비스가 동기 호출로 서로 꽉 묶여 있으면 배포도 독립 못 하고 장애도 연쇄. 최악의 조합
- **공유 DB** — 여러 서비스가 한 DB에 붙으면 결합도가 숨겨짐. 서비스당 자체 DB ([[nosql]]·[[sql]]) 원칙
- **트랜잭션 가정** — 분산에서 ACID는 없다. Saga·보상 트랜잭션·이벤추얼 컨시스턴시 설계 필요
- **[[monitoring]] 없음 → 블랙박스** — 한 요청이 10개 서비스를 거치면 로그만으론 추적 불가. OpenTelemetry 트레이싱 필수
- **팀 경계 ≠ 서비스 경계** — 콘웨이 법칙. 조직 구조를 무시한 서비스 쪼개기는 오래 못 간다
- **[[cost]] 증폭** — 각 서비스가 자체 인프라·로드밸런서·[[monitoring]]을 가지면 비용이 n배. [[serverless]]가 완화책

### 경계를 긋는 기준
- 도메인 경계 (DDD Bounded Context)
- 데이터 소유권 (어떤 테이블을 누가 쓰나)
- 배포 빈도 (자주 바뀌는 것 vs 안정적인 것)
- 팀 구성 (두 피자 팀)

### 연결
[[serverless]]·[[lambda]]·[[apigw]]·[[dynamodb]]가 마이크로서비스 구현의 현대적 조합. [[container]]·[[ecs]] 기반의 전통적 구현도 여전히 주류. [[iac]]·[[cicd]]·[[monitoring]]·[[gitops]]는 마이크로서비스에서 *선택이 아니라 필수*가 된다. [[testing]]에서 계약 테스트가 중심, [[tdd]]도 서비스 경계를 넘어가면 다르게 설계. [[llmops]] 시스템에도 이 아키텍처가 그대로 적용된다 — 추론·검색·평가가 각자 서비스.

## en

Microservices is **"an architectural style that splits one service into many small, independent services that each deploy, scale, and are owned by a team."** Defined by Martin Fowler and James Lewis in 2014, it became one of the industry's standard options. Its counterpart is the monolith — one deployment unit containing all functionality. Both are legitimate; the question isn't "which is better" but "which fits our org and domain."

Three core promises. **Independent deploys** (ship service A without risk to B), **technology freedom** (different languages, DBs, [[framework]]s per service), **team independence** (one team owns one or a few services end-to-end). The price: three problems. **Distributed complexity** (network failures, partial failures, consistency), **operational cost** (N services worth of [[cicd]], [[monitoring]], auth), **boundary design** ("which service owns this feature?"). Sam Newman's "Building Microservices" 2nd edition is the canonical reference.

### When to use
- Your org grew to the point that one repo / one deploy collides with multiple teams
- Services have very different scaling or technology needs (ML needs GPUs, admin tools are DB-heavy, etc.)
- A [[serverless]] + [[dynamodb]] + [[apigw]] stack naturally separates services
- Clearly split domains where [[domain]]-driven design fits
- **Conversely**: early startup / small team / unclear domain → **monolith first**

### Common pitfalls
- **Premature distribution** — splitting before you understand the domain leads to boundary re-design hell. "Monolith first" rule
- **Distributed monolith** — N services tightly coupled via synchronous calls can neither deploy independently nor fail independently. Worst of both worlds
- **Shared database** — multiple services against one DB hides coupling. Each service owns its DB ([[nosql]] or [[sql]])
- **Assuming ACID** — no such thing in distributed systems. Design for sagas, compensating transactions, eventual consistency
- **No [[monitoring]] → black box** — a single request through 10 services can't be traced by logs alone. OpenTelemetry distributed tracing is mandatory
- **Team boundary ≠ service boundary** — Conway's Law. Service splits that ignore org structure don't last
- **[[cost]] amplification** — each service with its own infra, load balancer, [[monitoring]] multiplies cost. [[serverless]] softens this

### Boundary criteria
- Domain boundary (DDD Bounded Context)
- Data ownership (who writes which tables)
- Deploy frequency (volatile vs stable)
- Team structure (two-pizza teams)

### How it connects
[[serverless]] + [[lambda]] + [[apigw]] + [[dynamodb]] is the modern microservices stack. Container-based implementations via [[container]] and [[ecs]] remain mainstream. [[iac]], [[cicd]], [[monitoring]], [[gitops]] become *mandatory*, not optional, at this scale. In [[testing]], contract tests take center stage; [[tdd]] at service boundaries is designed differently. The same architecture applies to [[llmops]] systems — inference, retrieval, evaluation as separate services.

## ja

マイクロサービスは**「一つのサービスを小さく独立した複数のサービスに分け、それぞれが独立してデプロイ・スケール・チーム所有できるようにするアーキテクチャスタイル」**。Martin Fowlerとジェームス・ルイスが2014年に定義して以来、現業の標準的選択肢の一つになった。反対はモノリシック — 一つのデプロイ単位に全機能。両方とも正当な選択で、「どちらが良いか」ではなく「我々の組織とドメインに合うか」の問題。

核心の約束三つ。**独立デプロイ**(サービスAをBのリスクなしにデプロイ)、**技術独立**(サービスごとに違う言語・DB・[[framework]])、**チーム独立**(一つのチームが一つまたは数個のサービスを最後まで所有)。代償として得る問題三つ。**分散の複雑性**(ネットワーク障害・部分障害・一貫性)、**運用負荷増加**(N個のサービスの[[cicd]]・[[monitoring]]・認証)、**境界設計の難しさ**(「この機能はどのサービス?」)。Sam Newmanの"Building Microservices"第2版が標準教本。

### いつ使うか
- 組織が大きくなり一つのレポ・一つのデプロイ単位に複数チームがぶつかるとき
- サービスごとのスケール・技術要求が大きく違うとき(MLはGPU、管理ツールはDB中心など)
- [[serverless]] + [[dynamodb]] + [[apigw]]の組合せで各サービスが自然に分離できるとき
- ドメインが明確に分かれており[[domain]]駆動設計が自然なとき
- **逆に**: 初期スタートアップ・小さなチーム・ドメインが不明確なら**モノリシックが先**

### はまりやすい罠
- **早すぎる分散** — ドメインを知らないまま分けると後で境界再設計地獄。「モノリスファースト」原則
- **分散モノリス** — N個のサービスが同期呼び出しで互いに固く結びつくと、独立デプロイも障害独立もできない。最悪の組合せ
- **共有DB** — 複数サービスが一つのDBに繋がると結合度が隠れる。サービスごとに自DB([[nosql]]・[[sql]])原則
- **トランザクションの前提** — 分散ではACIDはない。Saga・補償トランザクション・結果整合性の設計が必要
- **[[monitoring]]なし → ブラックボックス** — 一要求が10サービスを通るとログだけでは追跡不能。OpenTelemetryの分散トレーシング必須
- **チーム境界 ≠ サービス境界** — コンウェイの法則。組織構造を無視したサービス分けは長続きしない
- **[[cost]]増幅** — 各サービスが自前インフラ・ロードバランサー・[[monitoring]]を持つとコストがn倍。[[serverless]]が緩和策

### 境界を引く基準
- ドメイン境界(DDD Bounded Context)
- データ所有権(どのテーブルを誰が書くか)
- デプロイ頻度(よく変わるもの vs 安定)
- チーム構成(ツーピザチーム)

### 繋がり
[[serverless]]・[[lambda]]・[[apigw]]・[[dynamodb]]がマイクロサービスの現代的組合せ。[[container]]・[[ecs]]ベースの伝統的実装も依然主流。[[iac]]・[[cicd]]・[[monitoring]]・[[gitops]]はマイクロサービスでは*選択肢ではなく必須*になる。[[testing]]では契約テストが中心、[[tdd]]もサービス境界を超えると設計が変わる。[[llmops]]システムにもこのアーキテクチャがそのまま適用される — 推論・検索・評価が別サービス。

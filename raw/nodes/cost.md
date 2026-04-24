---
id: cost
cat: ops
size: 3
title:
  ko: 비용 관리
  en: Cost Control
  ja: コスト管理
refs:
  - url: https://docs.aws.amazon.com/cost-management/latest/userguide/what-is-costmanagement.html
    title: AWS Cost Management (AWS Docs)
    lang: en
  - url: https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html
    title: Cost Optimization Pillar (AWS Well-Architected)
    lang: en
  - url: https://www.finops.org/introduction/what-is-finops/
    title: What is FinOps? (FinOps Foundation)
    lang: en
extraEdges: []
---

## ko

클라우드에서 "공짜"는 **처음 몇 달만 유효한 약속**이다. 서비스는 사용량 기반이라 트래픽이나 데이터가 늘면 청구서도 같이 자라는데, 그 성장이 선형이 아니라 종종 **지수적**이다 — 새벽 3시에 온 스팸 트래픽이 [[lambda]] 호출 10만 건을 찍거나, [[llmops]] 환경에서 RAG 인덱스 재빌드 한 번이 수만 번의 임베딩 호출을 낸다. 비용 관리는 그 지수성을 **가시화하고 상한을 거는** 규율이다.

세 개의 축으로 본다. **가시성**(누가 얼마를 쓰는지 보이는가 — AWS Cost Explorer, 태그 기반 분해, FinOps 대시보드), **제어**(예산 알림과 한도 — AWS Budgets, Service Quotas, API 레벨 rate limit), **최적화**(자원 크기·스토리지 티어·예약 인스턴스 — 쓰지 않을 때 끄고, 쓰는 것은 적절히 줄인다). 스타트업의 "월 10$로 시작" 룰은 가시성과 제어를 갖추기 전까지의 안전 상한이다.

### 언제 쓰나
- 클라우드 계정을 연 첫 날 — 알림·한도는 *장애가 난 후*가 아니라 *시작하기 전*에 건다
- [[serverless]]·[[lambda]] 기반 서비스가 의외로 비쌀 때 — 단가가 요청 수에 비례하므로, 상시 고트래픽이면 손익분기를 다시 계산
- [[llmops]] 운영 — 토큰 단가가 기능 단위로 쪼개져야 "이 기능 한 번 호출이 $0.02"인지 "$2"인지 알 수 있다
- [[iac]]에 태그 규약을 박아 두면, 비용 계정이 자동으로 프로젝트·팀별로 나뉘어 [[aiops]] 대시보드까지 자연스럽게 흐른다

### 쉽게 빠지는 함정
- **예산 알림 미설정** — "월말에 보지 뭐"는 $10,000 청구서를 만든다. 첫날 AWS Budgets로 월 한도·일별 알림·이메일·Slack 설정
- **[[s3]] 스토리지 클래스 방치** — 한 번 쓰고 안 보는 로그를 Standard에 계속 두면 장기적으로 가장 큰 지출. Intelligent-Tiering·Glacier로 자동 이관
- **리소스 생성 후 삭제 안 함** — 실험용 RDS, 테스트 EC2, EBS 스냅샷이 쌓여 월별 "유령 비용"이 된다. [[iac]]로 만들고 tear-down도 자동화
- **데이터 전송 비용 무시** — 리전 간 트래픽은 초당 계산이 안 붙는 숨은 항목. 아키텍처 초기에 배치 결정
- **[[llmops]]에서 컨텍스트 캐싱 안 씀** — 같은 긴 프롬프트를 매번 풀로 보내면 토큰 비용이 몇 배. 캐시 가능한 부분은 공통으로 빼라
- **[[monitoring]] 없는 비용 이상 탐지** — 어제 $5였던 게 오늘 $500이 됐는데 월말까지 모르는 경우가 최악. [[aiops]]·Cost Anomaly Detection으로 자동 경고

### 연결
[[serverless]]·[[lambda]]·[[ecs]]·[[dynamodb]]·[[s3]]는 모두 사용량 과금이라 이 노드가 실제 운영 지표로 따라붙는다. [[iac]]는 태그·예산까지 코드로 심어 비용 거버넌스를 자동화하는 도구. [[llmops]]는 토큰 과금이라는 새로운 축을 추가했고, [[aiops]]는 비용 이상 탐지를 사람이 아니라 ML이 하게 만드는 연장선. FinOps(재무+DevOps) 운동 전체가 이 노드의 확장판이다.

## en

In cloud, "free" is **a promise that only lasts a few months**. Services are usage-based, so as traffic and data grow, so does the bill — and the growth is often **exponential**, not linear. A 3 AM spam wave can fire 100,000 [[lambda]] invocations; a single RAG index rebuild under [[llmops]] can fire tens of thousands of embedding calls. Cost control is the discipline of **making that exponential visible and capping it**.

Think in three axes. **Visibility** (can you see who spent what — AWS Cost Explorer, tag-based decomposition, FinOps dashboards), **Control** (budget alerts and caps — AWS Budgets, Service Quotas, API-level rate limits), and **Optimization** (right-sizing, storage tiers, reserved/savings plans — turn off what you don't use, shrink what you do). The "start at $10/month" rule for solo projects is a safety cap until visibility and control are in place.

### When to use
- Day one of a new cloud account — alerts and caps go on *before* the first incident, not after
- When a [[serverless]]/[[lambda]] service starts looking expensive — unit costs are per-call, so sustained high traffic flips the break-even vs EC2 or [[ecs]]
- [[llmops]] operations — per-token cost must be sliced per feature to know whether a call costs $0.02 or $2
- Bake a tagging convention into [[iac]] and cost accounting splits by project and team automatically, flowing into [[aiops]] dashboards

### Common pitfalls
- **No budget alerts** — "I'll check at month end" produces the $10,000 bill. Day one: AWS Budgets monthly cap, daily alerts, email + Slack
- **[[s3]] storage class drift** — write-once logs left in Standard become your biggest long-term line item. Move to Intelligent-Tiering or Glacier
- **Resources created, never destroyed** — experimental RDS, test EC2, orphaned EBS snapshots become monthly ghost cost. Build and tear down via [[iac]]
- **Ignoring data-transfer cost** — cross-region traffic is the hidden billable; decide layout early in the architecture
- **No context caching in [[llmops]]** — sending the same long prompt fresh every time multiplies token cost. Factor out cacheable prefixes
- **No [[monitoring]] on cost anomalies** — yesterday $5, today $500, you find out at month end. Wire in [[aiops]] or Cost Anomaly Detection

### How it connects
[[serverless]], [[lambda]], [[ecs]], [[dynamodb]], and [[s3]] are all usage-billed, so this node shows up as a real operational metric across them. [[iac]] automates cost governance by baking tags and budgets into code. [[llmops]] adds a new axis (token billing), and [[aiops]] moves cost anomaly detection off humans and onto ML. The whole FinOps (finance + DevOps) movement is an extension of this node.

## ja

クラウドで「無料」は**最初の数ヶ月だけ有効な約束**だ。サービスは使用量ベースなので、トラフィックやデータが増えれば請求書も一緒に育つ — しかもその成長は線形でなく**指数関数的**なことが多い。午前3時のスパムが[[lambda]]を10万回呼んだり、[[llmops]]環境下のRAGインデックス再構築一回で数万回の埋め込み呼び出しが走ったりする。コスト管理はその指数性を**可視化して上限を掛ける**規律だ。

三つの軸で見る。**可視性**(誰がいくら使ったか見えるか — AWS Cost Explorer、タグ分解、FinOpsダッシュボード)、**制御**(予算アラートと上限 — AWS Budgets、Service Quotas、APIレベルのレート制限)、**最適化**(サイジング、ストレージティア、リザーブド/Savings Plans — 使わないものは消し、使うものは絞る)。スタートアップの「月$10で始める」ルールは可視性と制御が揃うまでの安全上限だ。

### いつ使うか
- クラウドアカウントを開いた初日 — アラートと上限は*障害後*ではなく*開始前*に掛ける
- [[serverless]]/[[lambda]]系が意外に高くついたとき — 単価がコール数に比例するので、常時高トラフィックなら損益分岐を再計算
- [[llmops]]運用 — トークン単価を機能別に切り分けて初めて「この機能1回$0.02か$2か」が分かる
- [[iac]]にタグ規約を埋めると、コスト計上がプロジェクト・チーム別に自動分割され、[[aiops]]ダッシュボードまで自然に流れる

### はまりやすい罠
- **予算アラート未設定** — 「月末に見ればいい」は$10,000請求を生む。初日にAWS Budgetsで月上限、日次アラート、メール+Slack
- **[[s3]]ストレージクラスの放置** — 書いて見ないログをStandardに置きっぱなしにすると長期的に最大の支出。Intelligent-TieringやGlacierに自動移行
- **リソース作成して削除せず** — 実験用RDS、テストEC2、EBSスナップショットが溜まって月次「幽霊コスト」になる。[[iac]]で作り、tear-downも自動化
- **データ転送コストの軽視** — リージョン間トラフィックは見えにくい課金項目。アーキテクチャ初期に決める
- **[[llmops]]でコンテキストキャッシュ未使用** — 同じ長いプロンプトを毎回丸ごと送るとトークン費が何倍にもなる。キャッシュ可能な部分は共通化
- **[[monitoring]]なしのコスト異常検知** — 昨日$5が今日$500になったのに月末まで気づかないのが最悪。[[aiops]]やCost Anomaly Detectionで自動アラート

### 繋がり
[[serverless]]・[[lambda]]・[[ecs]]・[[dynamodb]]・[[s3]]は全て従量課金なので、このノードは全体の実運用指標として付いてくる。[[iac]]はタグや予算をコードに埋めてコストガバナンスを自動化する道具。[[llmops]]はトークン課金という新しい軸を加え、[[aiops]]はコスト異常検知を人からMLへ移す延長線上にある。FinOps(財務+DevOps)運動全体がこのノードの拡張版だ。

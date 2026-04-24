---
id: monitoring
cat: ops
size: 3
title:
  ko: 모니터링·옵저버빌리티
  en: Monitoring & Observability
  ja: モニタリング・オブザーバビリティ
refs:
  - url: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html
    title: What is Amazon CloudWatch? (AWS Docs)
    lang: en
  - url: https://sre.google/sre-book/monitoring-distributed-systems/
    title: Google SRE Book — Monitoring Distributed Systems
    lang: en
  - url: https://opentelemetry.io/
    title: OpenTelemetry — Observability framework
    lang: en
extraEdges: []
---

## ko

모니터링은 **"시스템이 지금 어떤 상태인지 바깥에서 볼 수 있게 만드는 일"**이다. 더 구체적으로는 세 종류의 신호를 흘려보낸다 — **메트릭**(숫자, 초당 요청 수·에러율·지연 시간), **로그**(이벤트의 서술, 무엇이 일어났는지), **트레이스**(한 요청이 서비스들을 거쳐가는 궤적). 이 셋을 합쳐 *옵저버빌리티*(observability)라 부르고, 2010년대 후반 Honeycomb·Google SRE 커뮤니티가 개념을 굳혔다.

"모니터링 vs 옵저버빌리티" 구분이 있다. 모니터링은 *예상되는 문제*를 지켜보는 것(CPU 90% 넘으면 알림), 옵저버빌리티는 *예상 못 한 문제*를 디버깅 가능하게 하는 것(왜 이 요청만 느리지?). 현대 시스템은 양쪽 다 필요. AWS에서는 CloudWatch(메트릭·로그) + X-Ray(트레이스)가 기본이고, 외부에서 Datadog·New Relic·Honeycomb·Grafana 스택을 많이 쓴다.

### 언제 쓰나
- 모든 프로덕션 시스템 — "모니터링 없는 배포"는 "눈 감고 운전"과 같다
- [[serverless]]·[[microservices]]에선 특히 절실 — 서비스가 분산될수록 "어디서 터졌나" 찾기 어려움
- [[cicd]] 배포 후 자동 헬스 체크 — 새 버전이 SLO를 위반하면 자동 롤백
- [[aiops]]의 전제 조건 — 데이터가 없으면 ML도 없음
- [[llmops]]에서 토큰 비용·지연·[[hallucination]] 비율 등 AI 특화 지표도 이 범주

### 핵심 개념
- **SLI/SLO/SLA** — Indicator(측정), Objective(목표), Agreement(계약). 순서 중요
- **4 Golden Signals** — latency, traffic, errors, saturation (Google SRE)
- **USE Method** — Utilization, Saturation, Errors (Brendan Gregg)
- **RED Method** — Rate, Errors, Duration (마이크로서비스용)
- **구조화된 로그** — JSON으로 남기면 검색·집계 용이. 사람 전용 prose는 덜 유용
- **분산 트레이싱** — OpenTelemetry가 표준. trace_id로 요청 전체 궤적 연결

### 쉽게 빠지는 함정
- **경보 피로** — 수십 개가 동시에 뜨면 아무도 안 본다. 실행 가능한 경보만, 심각도 계층화
- **대시보드 무덤** — 50개 대시보드 아무도 안 봄. 팀별 주요 3~5개에 집중
- **로그만 있고 메트릭 없음** — 로그로 "왜"는 알아도 "얼마나"는 계산 비쌈. 메트릭이 1차
- **[[cost]] 폭발** — CloudWatch 로그 저장·Ingest는 생각보다 비쌈. 샘플링·보존 기간 조절 필수
- **PII 로깅** — 무심코 사용자 이메일·토큰을 로그에 찍으면 컴플라이언스 사고
- **[[hallucination]]을 관찰 안 함** — [[llmops]] 시대 추가 지표. 모델 출력 품질·근거 이탈을 대시보드에

### 연결
[[aiops]]의 전제이자 [[llmops]]의 한 축. [[cicd]]·[[iac]]와 짝으로 운영 사각형을 완성. [[debug]]의 시작점이고 [[cost]]와는 양쪽에서 필요 — 관찰해야 비용 이상 감지 가능. [[serverless]]와 [[microservices]] 아키텍처에서 가장 크게 요구됨. OpenTelemetry로 표준화된 덕에 도구 교체 비용이 낮아짐.

## en

Monitoring is **"making a system's current state observable from the outside."** More concretely, three signal types flow out — **metrics** (numbers: RPS, error rate, latency), **logs** (event descriptions: what happened), **traces** (the path of a request across services). Together they form *observability*, a concept crystallized in the late 2010s by Honeycomb, the Google SRE community, and others.

"Monitoring vs observability" is a meaningful distinction. Monitoring watches for *anticipated* problems (alert when CPU > 90%); observability makes *unanticipated* problems debuggable ("why is just this request slow?"). Modern systems need both. In AWS, CloudWatch (metrics + logs) + X-Ray (tracing) form the baseline; external stacks like Datadog, New Relic, Honeycomb, Grafana are widely used on top.

### When to use
- Every production system — "deploy without monitoring" is "drive blindfolded"
- Especially urgent for [[serverless]] / [[microservices]] — the more distributed, the harder "where did it fail?"
- Post-[[cicd]] auto health checks — new version violates SLO → auto-rollback
- Prerequisite for [[aiops]] — no data, no ML
- [[llmops]] adds AI-specific metrics: token cost, latency, [[hallucination]] rate

### Core concepts
- **SLI / SLO / SLA** — Indicator (measurement), Objective (goal), Agreement (contract). Order matters
- **Four Golden Signals** — latency, traffic, errors, saturation (Google SRE)
- **USE method** — Utilization, Saturation, Errors (Brendan Gregg)
- **RED method** — Rate, Errors, Duration (microservice-oriented)
- **Structured logs** — JSON is searchable and aggregatable; human prose is less useful
- **Distributed tracing** — OpenTelemetry is the standard. trace_id connects a request across services

### Common pitfalls
- **Alert fatigue** — if dozens fire at once, no one reads them. Only actionable alerts, tiered by severity
- **Dashboard graveyards** — 50 dashboards no one opens. Focus on 3–5 team-critical ones
- **Logs without metrics** — logs answer "why" but computing "how much" from them is expensive. Metrics first
- **[[cost]] blowouts** — CloudWatch log ingest and storage add up. Sample and set retention deliberately
- **Logging PII** — carelessly writing user emails or tokens into logs is a compliance incident
- **Not observing [[hallucination]]** — LLM-era addition. Put model output quality and grounding drift on dashboards

### How it connects
Prerequisite to [[aiops]] and an axis of [[llmops]]. Pairs with [[cicd]] and [[iac]] to complete the operational square. The starting point of [[debug]], and needed from both sides of [[cost]] — you can only detect cost anomalies by observing them. Most demanded in [[serverless]] and [[microservices]] architectures. OpenTelemetry's standardization lowered the cost of switching tools.

## ja

モニタリングは**「システムが今どういう状態かを外から見えるようにする仕事」**。より具体的には三種類の信号を流す — **メトリクス**(数値: RPS・エラー率・レイテンシ)、**ログ**(イベントの記述: 何が起きたか)、**トレース**(一つの要求がサービス群を渡っていく軌跡)。この三つを合わせて*オブザーバビリティ*(observability)と呼び、2010年代後半にHoneycomb・Google SREコミュニティが概念を固めた。

「モニタリング vs オブザーバビリティ」の区別がある。モニタリングは*予期した*問題を見張ること(CPU 90%超でアラート)、オブザーバビリティは*予期しない*問題をデバッグ可能にすること(「なぜこの要求だけ遅い?」)。現代システムは両方が必要。AWSではCloudWatch(メトリクス・ログ) + X-Ray(トレース)が基本、外部ではDatadog・New Relic・Honeycomb・Grafanaスタックが多く使われる。

### いつ使うか
- すべての本番システム — 「モニタリングなしのデプロイ」は「目隠し運転」
- [[serverless]]・[[microservices]]では特に切実 — 分散するほど「どこで落ちたか」が難しい
- [[cicd]]デプロイ後の自動ヘルスチェック — 新バージョンがSLO違反なら自動ロールバック
- [[aiops]]の前提条件 — データがなければMLもない
- [[llmops]]ではAI特化指標: トークンコスト・遅延・[[hallucination]]率

### 核となる概念
- **SLI/SLO/SLA** — Indicator(測定)、Objective(目標)、Agreement(契約)。順序重要
- **四つのゴールデンシグナル** — latency、traffic、errors、saturation(Google SRE)
- **USEメソッド** — Utilization、Saturation、Errors(Brendan Gregg)
- **REDメソッド** — Rate、Errors、Duration(マイクロサービス向け)
- **構造化ログ** — JSONで残せば検索・集計が容易。人向けproseは有用性が下がる
- **分散トレーシング** — OpenTelemetryが標準。trace_idで要求全体の軌跡を繋ぐ

### はまりやすい罠
- **アラート疲労** — 数十が同時に上がると誰も見ない。実行可能なアラートだけ、重大度で階層化
- **ダッシュボードの墓場** — 50のダッシュボードは誰も見ない。チームで重要な3〜5つに集中
- **ログだけありメトリクスなし** — ログで「なぜ」は分かるが「どれだけ」は計算が高い。メトリクスが一次
- **[[cost]]の爆発** — CloudWatchのログ取り込み・保存は意外と高い。サンプリング・保持期間調整必須
- **PIIロギング** — うっかりユーザーメールやトークンをログに書くとコンプライアンス事故
- **[[hallucination]]を観察しない** — [[llmops]]時代の追加指標。モデル出力品質・根拠逸脱をダッシュボードに

### 繋がり
[[aiops]]の前提であり[[llmops]]の一軸。[[cicd]]・[[iac]]と対をなして運用四角形を完成させる。[[debug]]の出発点であり、[[cost]]とは両方向で必要 — 観察してこそコスト異常が検知できる。[[serverless]]・[[microservices]]アーキテクチャで最も強く要求される。OpenTelemetryで標準化されたおかげでツール交換コストが下がった。

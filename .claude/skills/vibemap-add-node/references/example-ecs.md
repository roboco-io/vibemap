---
id: ecs
cat: ops
size: 3
title:
  ko: ECS / Fargate
  en: ECS / Fargate
  ja: ECS / Fargate
refs:
  - url: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html
    title: What is Amazon ECS (AWS Docs)
    lang: en
  - url: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html
    title: AWS Fargate on ECS (AWS Docs)
    lang: en
extraEdges: []
---

## ko

ECS(Elastic Container Service)는 AWS의 **관리형 컨테이너 오케스트레이터**다. [[container]]로 포장한 앱을 클러스터에서 돌리고, 죽으면 자동 재기동하고, 트래픽에 맞춰 개수를 늘리거나 줄인다. Kubernetes(EKS)보다 훨씬 단순한 것이 특징 — AWS 세계 안에서 "그냥 컨테이너를 돌리고 싶을 때" 기본 선택지다.

한 쌍으로 따라오는 게 **Fargate**. Fargate는 "EC2 인스턴스를 고를지 말지조차 고민하고 싶지 않다"는 사람을 위한 **서버리스 컨테이너 실행 환경**이다. 같은 ECS API를 쓰지만, VM 선택·패치·스케일링을 AWS가 완전히 대신한다. [[serverless]] 철학이 [[container]]에까지 확장된 형태.

### 언제 쓰나
- [[lambda]]의 15분 실행 시간 제한이 불편하거나, 커스텀 바이너리(ffmpeg, 대형 ML 모델)를 돌려야 할 때
- 팀이 이미 [[container]] 이미지로 배포 파이프라인을 만들어 놨을 때 — ECS는 그 이미지를 그대로 받아 실행
- [[microservices]]를 10~30개 규모로 운영하되 Kubernetes 운영 부담은 원치 않을 때

### ECS vs Lambda vs Fargate 한 줄 요약
- [[lambda]]: 짧게 실행되는 함수 단위 (15분 이하, 이벤트 주도)
- ECS + EC2: 컨테이너를 직접 관리하는 VM 위에서 실행 — 가장 저렴하지만 운영 부담
- ECS + Fargate: 컨테이너를 "서버리스"로 실행 — VM 안 보임, 과금은 vCPU·RAM·시간

### 연결되는 서비스
[[apigw]] → ECS 뒤의 Application Load Balancer → 컨테이너화된 API. 로그는 CloudWatch로, [[monitoring]]·[[cost]] 대시보드는 처음부터 걸어두자. 데이터 계층에서는 [[dynamodb]]나 [[dsql]]과 자연스럽게 조합된다.

## en

ECS (Elastic Container Service) is AWS's **managed container orchestrator**. You hand it a [[container]] image, it runs N copies in a cluster, restarts anything that dies, and scales with traffic. Compared to Kubernetes (EKS), ECS is dramatically simpler — the default choice inside AWS when you "just want to run containers."

Its inseparable partner is **Fargate**: a **serverless container runtime** for people who don't want to pick EC2 instance types either. Same ECS API, but AWS owns VM selection, patching, and scaling. It's the [[serverless]] philosophy extended to [[container]] workloads.

### When to use
- [[lambda]]'s 15-minute limit hurts, or you need custom binaries (ffmpeg, large ML models)
- Your team already ships [[container]] images via a pipeline — ECS consumes them as-is
- You're running 10–30 [[microservices]] and don't want Kubernetes operational overhead

### ECS vs Lambda vs Fargate in one line
- [[lambda]]: short-lived functions (≤15 min, event-driven)
- ECS + EC2: containers on VMs you manage — cheapest, most ops work
- ECS + Fargate: containers "serverlessly" — no VMs visible, billed per vCPU/RAM/second

### How it connects
[[apigw]] → an Application Load Balancer in front of ECS → your containerized API. Logs land in CloudWatch; wire [[monitoring]] and [[cost]] dashboards from day one. On the data side, ECS composes naturally with [[dynamodb]] or [[dsql]].

## ja

ECS(Elastic Container Service)はAWSの**マネージドコンテナオーケストレーター**。[[container]]で包んだアプリをクラスターで走らせ、落ちたら自動再起動、トラフィックに合わせて数を増減する。Kubernetes(EKS)よりはるかにシンプル — AWS内で「とにかくコンテナを動かしたい」ときの既定解。

相方として**Fargate**が付く。Fargateは「EC2インスタンスの選定すらしたくない」人向けの**サーバーレスコンテナ実行環境**。同じECS APIを使いつつ、VM選択・パッチ・スケーリングをAWSが完全に代行する。[[serverless]]の思想が[[container]]まで拡張された形だ。

### いつ使うか
- [[lambda]]の15分制限が窮屈、またはカスタムバイナリ(ffmpeg、大型MLモデル)を動かす必要があるとき
- チームが既に[[container]]イメージで配布パイプラインを持っているとき — ECSはそれをそのまま受け取って実行
- [[microservices]]を10〜30規模で運用しつつ、Kubernetesの運用負荷は避けたいとき

### ECS vs Lambda vs Fargate ひとことまとめ
- [[lambda]]: 短命な関数単位(15分以下、イベント駆動)
- ECS + EC2: 自分で管理するVM上でコンテナ実行 — 最も安いが運用コスト大
- ECS + Fargate: コンテナを「サーバーレス」で実行 — VMは見えず、vCPU・RAM・秒単位課金

### 接続される周辺
[[apigw]] → ECSの前段のApplication Load Balancer → コンテナ化APIという構成。ログはCloudWatchへ、[[monitoring]]と[[cost]]のダッシュボードは初期から設定する。データ層では[[dynamodb]]や[[dsql]]と自然に組み合わせられる。

---
id: container
cat: tech
size: 3
title:
  ko: 컨테이너
  en: Container
  ja: コンテナ
refs:
  - url: https://docs.docker.com/get-started/overview/
    title: Docker Overview (Docker Docs)
    lang: en
  - url: https://kubernetes.io/docs/concepts/overview/
    title: Kubernetes Overview (Kubernetes Docs)
    lang: en
  - url: https://opencontainers.org/
    title: Open Container Initiative (OCI)
    lang: en
extraEdges: []
---

## ko

컨테이너는 **"애플리케이션과 그 실행 환경(라이브러리·설정·런타임)을 하나의 *포터블한 패키지*로 묶는 기술"**이다. 가상 머신처럼 격리는 제공하지만 OS 커널을 공유해 훨씬 가볍고 빠르다. Docker가 2013년 이 개념을 대중화한 후, 오늘날 클라우드 배포의 공통어가 됐다. 이미지(정지된 스냅샷) + 컨테이너(실행 중인 인스턴스) 두 개념을 구분한다.

컨테이너는 *[[immutable-infra]]*와 영혼이 맞다. 이미지는 한 번 빌드되면 바뀌지 않고, 업데이트는 새 이미지를 빌드해 교체. 로컬·스테이징·프로덕션에서 "같은 이미지"를 돌리면 "내 PC에선 됐는데" 문제가 사라진다. Kubernetes·[[ecs]] Fargate·Google Cloud Run 같은 오케스트레이터가 컨테이너 무리를 스케줄·재시작·스케일링한다.

### 언제 쓰나
- **[[microservices]]의 기본 단위** — 각 서비스를 독립 컨테이너로
- **[[cicd]] 일관성** — 빌드 이미지가 모든 환경에서 동일하게 동작
- **로컬 개발 환경** — Docker Compose로 "DB·캐시·앱"을 한 번에 띄움
- **ML·데이터 파이프라인** — 복잡한 의존성을 컨테이너로 봉인
- **[[claude-code]] + MCP + Testcontainers 같은 AI 개발 워크플로우** — 테스트용 DB를 컨테이너로 생성

### 쉽게 빠지는 함정
- **이미지 크기 무관심** — `FROM ubuntu` 기반에 모든 것 설치하면 2GB+. Alpine·distroless·multi-stage build로 수백 MB 이하
- **시크릿을 이미지에 굽기** — `ENV DB_PASSWORD=xxx` 같은 건 이미지 레이어에 영원히 남음. Secrets Manager·Kubernetes Secret·런타임 주입
- **root로 실행** — 기본은 root. 컨테이너 탈출 시 호스트 공격. 항상 non-root 유저 설정
- **취약점 스캔 생략** — base image가 CVE 투성이여도 모름. Trivy·Snyk를 [[cicd]]에 통합
- **디버깅 어려움** — 컨테이너가 수초마다 뜨고 지면 `ssh`로 접속 불가. 로그 구조화, [[monitoring]] 중심 운영
- **[[cost]] 망각** — 항상 켜져 있는 [[ecs]] 태스크는 EC2처럼 시간 과금. 서버리스로 쪼개거나 Spot·Scale-to-zero 고려
- **LLM이 잘못된 Dockerfile 생성** — [[hallucination]]으로 존재하지 않는 베이스 이미지나 명령. [[review-mindset]]·빌드 테스트로 검증

### 주요 개념
- **이미지** — 빌드된 정지 상태. `docker build`로 생성, 레지스트리(Docker Hub, ECR)에 저장
- **컨테이너** — 이미지의 실행 인스턴스
- **Dockerfile** — 이미지 빌드 명세. 레이어 캐시 잘 활용하면 빌드 속도 10배
- **OCI** — Docker 외 다른 구현(Podman, containerd)도 지원하는 표준
- **오케스트레이터** — Kubernetes(강력·복잡), [[ecs]](AWS 네이티브·간단), Nomad, Cloud Run

### 연결
[[ecs]]가 AWS에서의 주요 실행 플랫폼 ([[serverless]] 방식 Fargate 포함). [[immutable-infra]]의 구현 기술. [[cicd]]와 짝을 이뤄 빌드 → 레지스트리 → 배포의 파이프라인. [[microservices]]·[[testing]](Testcontainers)·[[iac]](Dockerfile도 코드)까지 맞닿는 지점이 많음. [[claude-code]] 같은 에이전트도 실행 샌드박스를 컨테이너로 제공하는 게 표준 — [[harness-eng]]의 격리 레이어.

## en

A container is **"a technology that packages an application together with its runtime environment (libraries, config, runtime) into a *portable bundle*."** It provides VM-like isolation but shares the host OS kernel, so it's much lighter and faster. Docker popularized the concept in 2013; today containers are the lingua franca of cloud deployment. Two concepts to keep apart: images (immutable snapshots) and containers (running instances).

Containers share a soul with *[[immutable-infra]]*. An image, once built, doesn't change; updates mean building a new image and replacing it. Running "the same image" locally, in staging, and in production eliminates the "works on my machine" class of bug. Orchestrators like Kubernetes, [[ecs]] Fargate, and Google Cloud Run handle scheduling, restarts, and scaling.

### When to use
- **Unit of [[microservices]]** — each service as an independent container
- **[[cicd]] consistency** — a built image behaves the same in every environment
- **Local dev environments** — Docker Compose brings up "DB + cache + app" in one shot
- **ML and data pipelines** — complex dependencies sealed inside a container
- **AI dev workflows** like [[claude-code]] + MCP + Testcontainers — ephemeral test DBs as containers

### Common pitfalls
- **Ignoring image size** — `FROM ubuntu` with everything installed reaches 2 GB+. Use Alpine, distroless, multi-stage builds to drop to hundreds of MB
- **Baking secrets into the image** — `ENV DB_PASSWORD=xxx` lives forever in a layer. Use Secrets Manager, Kubernetes Secrets, runtime injection
- **Running as root** — the default is root. Container escape = host attack. Always set a non-root user
- **Skipping vuln scans** — a base image full of CVEs sails through. Integrate Trivy or Snyk into [[cicd]]
- **Hard debugging** — containers come and go in seconds; no `ssh` in. Structure logs and lean on [[monitoring]]
- **[[cost]] drift** — always-on [[ecs]] tasks are billed like EC2 time. Shift to serverless, or consider Spot / scale-to-zero
- **LLM generates broken Dockerfile** — [[hallucination]] of nonexistent base images or commands. Verify via [[review-mindset]] and build tests

### Core concepts
- **Image** — a built, static snapshot. Created with `docker build`, stored in registries (Docker Hub, ECR)
- **Container** — a running instance of an image
- **Dockerfile** — build spec. Using layer caching well gives 10× build speed
- **OCI** — standard that also supports non-Docker implementations (Podman, containerd)
- **Orchestrator** — Kubernetes (powerful, complex), [[ecs]] (AWS-native, simpler), Nomad, Cloud Run

### How it connects
[[ecs]] is the main execution platform on AWS (Fargate is the serverless flavor). Containers are the implementation of [[immutable-infra]]. They pair with [[cicd]] for build → registry → deploy pipelines. Touch points into [[microservices]], [[testing]] (Testcontainers), and [[iac]] (Dockerfiles are code too) abound. Agents like [[claude-code]] typically provide their execution sandbox as a container — the isolation layer of [[harness-eng]].

## ja

コンテナは**「アプリケーションとその実行環境(ライブラリ・設定・ランタイム)を一つの*ポータブルなパッケージ*にまとめる技術」**。仮想マシンのような隔離を提供するがOSカーネルを共有するのではるかに軽量で速い。Dockerが2013年にこの概念を大衆化して以来、今日のクラウドデプロイの共通語。イメージ(静止したスナップショット) + コンテナ(実行中のインスタンス)の二概念を区別する。

コンテナは*[[immutable-infra]]*と魂が合う。イメージは一度ビルドすれば変わらず、更新は新イメージをビルドして差し替え。ローカル・ステージング・本番で「同じイメージ」を動かせば「自分のPCでは動く」問題が消える。Kubernetes・[[ecs]] Fargate・Google Cloud Runのようなオーケストレーターがコンテナ群のスケジュール・再起動・スケーリングを扱う。

### いつ使うか
- **[[microservices]]の基本単位** — 各サービスを独立コンテナに
- **[[cicd]]の一貫性** — ビルドしたイメージが全環境で同じ動作
- **ローカル開発環境** — Docker Composeで「DB・キャッシュ・アプリ」を一発起動
- **ML・データパイプライン** — 複雑な依存をコンテナに封入
- **[[claude-code]] + MCP + TestcontainersのようなAI開発ワークフロー** — テスト用DBをコンテナで作る

### はまりやすい罠
- **イメージサイズの無関心** — `FROM ubuntu`にすべてインストールすれば2GB+。Alpine・distroless・マルチステージビルドで数百MB以下
- **シークレットをイメージに焼く** — `ENV DB_PASSWORD=xxx`はイメージレイヤに永遠に残る。Secrets Manager・Kubernetes Secret・ランタイム注入
- **rootで実行** — 既定はroot。コンテナ脱出時にホスト攻撃。常にnon-rootユーザー設定
- **脆弱性スキャン省略** — ベースイメージがCVEだらけでも気付かない。Trivy・Snykを[[cicd]]に統合
- **デバッグが難しい** — コンテナが数秒で生き死にするので`ssh`不可。ログを構造化し[[monitoring]]中心に運用
- **[[cost]]の抜け** — 常時起動の[[ecs]]タスクはEC2のように時間課金。サーバーレス分割またはSpot・Scale-to-zeroを検討
- **LLMが壊れたDockerfile生成** — [[hallucination]]で存在しないベースイメージや命令。[[review-mindset]]とビルドテストで検証

### 主要概念
- **イメージ** — ビルドされた静的スナップショット。`docker build`で生成、レジストリ(Docker Hub・ECR)に保存
- **コンテナ** — イメージの実行インスタンス
- **Dockerfile** — イメージビルド仕様。レイヤーキャッシュをうまく使うとビルドが10倍速
- **OCI** — Docker以外の実装(Podman、containerd)も対応する標準
- **オーケストレーター** — Kubernetes(強力・複雑)、[[ecs]](AWSネイティブ・簡易)、Nomad、Cloud Run

### 繋がり
[[ecs]]がAWSでの主要実行プラットフォーム([[serverless]]方式のFargate含む)。[[immutable-infra]]の実装技術。[[cicd]]と組んでビルド → レジストリ → デプロイのパイプライン。[[microservices]]・[[testing]](Testcontainers)・[[iac]](Dockerfileもコード)に接する地点が多い。[[claude-code]]のようなエージェントも実行サンドボックスをコンテナで提供するのが標準 — [[harness-eng]]の隔離レイヤ。

---
id: lambda
cat: ops
size: 3
title:
  ko: AWS Lambda
  en: AWS Lambda
  ja: AWS Lambda
refs:
  - url: https://docs.aws.amazon.com/lambda/latest/dg/welcome.html
    title: What is AWS Lambda? (AWS Docs)
    lang: en
  - url: https://aws.amazon.com/blogs/compute/operating-lambda-performance-optimization-part-1/
    title: Operating Lambda — Performance Optimization (AWS Blog)
    lang: en
extraEdges: []
---

## ko

AWS Lambda는 **"요청이 올 때만 잠깐 코드가 실행되는 서버리스 컴퓨팅 서비스"**다. 서버를 미리 띄워두지 않고, 이벤트(HTTP 요청, 큐 메시지, 스케줄, 파일 업로드 등)가 들어올 때 함수가 깨어나 실행되고 끝나면 사라진다. 2014년 AWS가 출시한 이후 "[[serverless]]" 개념의 대표 상품이 됐고, 오늘날 수많은 백엔드·데이터 파이프라인·자동화 작업의 기본 블록이다.

핵심 특성 셋. **짧게 실행**(최대 15분), **자동 스케일**(요청이 몰리면 AWS가 동시 인스턴스를 늘림), **사용한 만큼 과금**(밀리초 단위 + 호출 수). 트레이드오프도 셋. **cold start**(오래 쉬면 첫 호출이 느림), **15분 상한**(긴 작업엔 부적합), **상태 없음**(메모리·디스크는 휘발). 이 셋을 받아들일 수 있으면 Lambda가 맞고, 아니면 [[ecs]] Fargate나 EC2로.

### 언제 쓰나
- **API 백엔드** — [[apigw]] + Lambda + [[dynamodb]] 조합이 서버리스 3종 세트
- **이벤트 처리** — [[s3]] 업로드 → 썸네일 생성, SQS 메시지 → 비동기 처리
- **스케줄 작업** — cron 대용으로 EventBridge + Lambda
- **스트림 처리** — [[kinesis]] 레코드 배치별로 Lambda 호출
- **Chat/AI 워크플로우** — LLM API를 감싸는 Lambda가 흔한 패턴

### 쉽게 빠지는 함정
- **cold start** — 콜드 스타트가 100ms~2초. 레이턴시 민감하면 Provisioned Concurrency 또는 컨테이너 이미지 최적화
- **DB 커넥션 폭발** — 동시 1000개 Lambda 인스턴스가 RDS에 직접 연결하면 DB가 죽음. RDS Proxy 또는 [[dynamodb]]로
- **긴 작업을 무리하게 쪼갬** — 15분 넘는 작업은 Step Functions로 분할하거나 [[ecs]] Fargate로. 억지로 Lambda에 태우면 재시작 지옥
- **[[cost]] 역전** — 상시 고트래픽이면 EC2·[[ecs]]가 저렴할 수 있음. 손익분기 주기적 점검
- **상태를 메모리에 저장** — 다음 호출이 다른 인스턴스일 수 있음. 상태는 [[dynamodb]]·[[s3]]·Redis로 외부화
- **로깅 누락** — 함수가 잠깐 떠서 사라지니 CloudWatch 로그 설계가 초기부터 필요. [[monitoring]]·X-Ray 연동

### 실용 체크리스트
- 런타임 선택: Node.js·Python이 cold start 짧음, Java·.NET은 길지만 SnapStart로 개선
- 메모리 설정: CPU도 메모리에 비례. 128MB 기본값은 대개 부족, 512MB~1GB로 시작
- 동시성 한도: 계정당 기본 1000. 대량 트래픽 전에 상향 요청
- 환경변수 vs Secrets Manager: 시크릿은 Secrets Manager로 (환경변수는 IaC 로그에 노출 위험)

### 연결
[[serverless]] 아키텍처의 중심. [[apigw]]·[[dynamodb]]·[[s3]]·[[kinesis]]와 자연 조합. [[ecs]]의 "컨테이너 서버리스"와 대비되는 "함수 서버리스". [[iac]]·[[cicd]] 없이 Lambda를 운영하는 건 곧 혼란 — 코드·설정·권한이 다 코드여야 추적 가능. [[cost]]와 [[monitoring]]은 Lambda에 늘 따라 붙는다.

## en

AWS Lambda is **a serverless compute service where your code runs briefly only when invoked**. No pre-provisioned server; an event (HTTP request, queue message, schedule, file upload) wakes the function, it runs, it vanishes. Since launch in 2014 Lambda has been the flagship of "[[serverless]]" and, today, the default building block for countless backends, data pipelines, and automations.

Three defining traits. **Short-lived** (15-minute max), **auto-scaling** (AWS spins up concurrent instances as demand rises), **pay per use** (milliseconds + invocations). Three trade-offs. **Cold starts** (long-idle first calls are slow), **15-minute ceiling** (not for long-running work), **no persistent state** (memory and disk are ephemeral). If those three are acceptable, Lambda fits; if not, [[ecs]] Fargate or EC2.

### When to use
- **API backends** — [[apigw]] + Lambda + [[dynamodb]] is the serverless trifecta
- **Event handling** — [[s3]] upload → thumbnail, SQS message → async processing
- **Scheduled jobs** — EventBridge + Lambda as cron
- **Stream processing** — [[kinesis]] records batched into Lambda invocations
- **Chat/AI workflows** — wrapping an LLM API in Lambda is a common pattern

### Common pitfalls
- **Cold starts** — 100 ms to 2 s on first call. Latency-sensitive work needs Provisioned Concurrency or container-image tuning
- **DB connection explosion** — 1000 concurrent Lambdas hitting RDS directly kill the DB. Use RDS Proxy or shift to [[dynamodb]]
- **Cramming long jobs** — over-15-minute work belongs in Step Functions or [[ecs]] Fargate. Forcing it into Lambda causes retry hell
- **[[cost]] inversion** — at sustained high traffic, EC2 or [[ecs]] can be cheaper. Re-run the break-even periodically
- **State in memory** — the next call may be a new instance. Externalize to [[dynamodb]], [[s3]], or Redis
- **Missing logging** — the function vanishes fast; design CloudWatch logging up front. Wire [[monitoring]] and X-Ray

### Practical checklist
- Runtime choice: Node.js / Python have short cold starts; Java / .NET are longer but improve with SnapStart
- Memory setting: CPU scales with memory. The 128 MB default is usually tight; start at 512 MB–1 GB
- Concurrency limit: 1000 per account by default. Request an increase before heavy traffic
- Env vars vs Secrets Manager: put secrets in Secrets Manager (env vars can leak via [[iac]] logs)

### How it connects
The core of [[serverless]] architecture. Pairs naturally with [[apigw]], [[dynamodb]], [[s3]], [[kinesis]]. Complements [[ecs]]'s "container serverless" as "function serverless." Running Lambda without [[iac]] and [[cicd]] is an invitation to chaos — code, configuration, and permissions all need to be code to be traceable. [[cost]] and [[monitoring]] always tag along.

## ja

AWS Lambdaは**「リクエストが来たときだけ短時間コードが実行されるサーバーレスコンピューティング」**。サーバーを事前に立ち上げず、イベント(HTTP要求、キューメッセージ、スケジュール、ファイルアップロードなど)が入ると関数が目覚めて実行し、終われば消える。2014年リリース以来「[[serverless]]」概念の代表商品であり、今日多数のバックエンド・データパイプライン・自動化の基本ブロックだ。

核心特性三つ。**短時間実行**(最大15分)、**自動スケール**(要求が集中するとAWSが並行インスタンスを増やす)、**使用分課金**(ミリ秒単位 + 呼び出し数)。トレードオフも三つ。**cold start**(長く休むと初回が遅い)、**15分上限**(長時間作業には不適)、**状態なし**(メモリ・ディスクは揮発)。この三つを受け入れられればLambdaが合う、そうでなければ[[ecs]] FargateかEC2へ。

### いつ使うか
- **APIバックエンド** — [[apigw]] + Lambda + [[dynamodb]]の組合せがサーバーレス三種の神器
- **イベント処理** — [[s3]]アップロード → サムネ生成、SQSメッセージ → 非同期処理
- **スケジュール作業** — cron代わりにEventBridge + Lambda
- **ストリーム処理** — [[kinesis]]レコードをバッチ単位でLambdaに呼ぶ
- **Chat/AIワークフロー** — LLM APIを包むLambdaが一般的パターン

### はまりやすい罠
- **cold start** — 初回呼び出しで100ms〜2秒。レイテンシに厳しいならProvisioned Concurrencyやコンテナイメージ最適化
- **DB接続の爆発** — 同時1000のLambdaがRDSに直接繋ぐとDBが死ぬ。RDS Proxyか[[dynamodb]]へ
- **長時間作業を無理に詰める** — 15分超はStep Functionsで分割するか[[ecs]] Fargateへ。無理にLambdaに載せると再試行地獄
- **[[cost]]の逆転** — 常時高トラフィックならEC2や[[ecs]]が安いことがある。損益分岐を定期確認
- **状態をメモリに保存** — 次の呼び出しは別インスタンスの可能性。状態は[[dynamodb]]・[[s3]]・Redisに外出し
- **ロギング漏れ** — 関数が一瞬で消えるのでCloudWatchログ設計は初期から必要。[[monitoring]]・X-Ray連携

### 実用チェックリスト
- ランタイム選択: Node.js・Pythonはcold start短め、Java・.NETは長いがSnapStartで改善
- メモリ設定: CPUもメモリに比例。128MB既定値は大抵不足、512MB〜1GBから始める
- 同時実行上限: アカウントあたり既定1000。大量トラフィック前に上限引き上げ申請
- 環境変数 vs Secrets Manager: シークレットはSecrets Managerへ(環境変数は[[iac]]ログで露出リスク)

### 繋がり
[[serverless]]アーキテクチャの中心。[[apigw]]・[[dynamodb]]・[[s3]]・[[kinesis]]と自然に組み合わさる。[[ecs]]の「コンテナサーバーレス」と対比される「関数サーバーレス」。[[iac]]・[[cicd]]なしでLambdaを運用するのは混乱の招待 — コード・設定・権限すべてをコード化しなければ追跡不能。[[cost]]と[[monitoring]]は常に付いてくる。

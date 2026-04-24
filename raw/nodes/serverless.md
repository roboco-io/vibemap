---
id: serverless
cat: ops
size: 1
title:
  ko: AWS 서버리스
  en: AWS Serverless
  ja: AWSサーバーレス
refs:
  - url: https://aws.amazon.com/serverless/
    title: AWS Serverless
    lang: en
  - url: https://docs.aws.amazon.com/lambda/latest/dg/welcome.html
    title: What is AWS Lambda? (AWS Docs)
    lang: en
  - url: https://docs.aws.amazon.com/wellarchitected/latest/serverless-applications-lens/welcome.html
    title: Serverless Applications Lens (AWS Well-Architected)
    lang: en
extraEdges: []
---

## ko

서버리스는 **"서버를 빌리는 대신 필요한 순간에만 잠깐 돌아가는 함수를 빌린다"**는 운영 모델이다. EC2처럼 24시간 켜두고 월세를 내는 게 아니라, 요청이 들어올 때만 깨어나 일하고 다시 자는 방식 — 평시 비용 0, 쓴 만큼만 과금. "서버가 없는" 건 과장이고, 정확히는 서버 존재를 네가 신경 쓸 필요 없게 클라우드가 숨겨준다는 뜻이다.

AWS의 서버리스 계열은 조합 블록이다: [[lambda]](함수 실행) + [[apigw]](HTTP 입구) + [[dynamodb]](NoSQL 저장) + [[s3]](파일 저장) + EventBridge·SQS·SNS(이벤트 배선). 컨테이너 서버리스가 필요하면 [[ecs]] + Fargate. "서버리스"는 특정 서비스가 아니라 이 블록들을 조립해 운영 부담을 지우는 *패러다임*이다.

### 언제 쓰나
- 트래픽이 들쭉날쭉하거나 평시 유휴 시간이 긴 서비스 — 24시간 켜 둘 이유가 없을 때
- 스타트업·사이드 프로젝트 — 월 $0에 가깝게 시작해 사용자가 늘면 자동으로 스케일
- 이벤트 주도 작업 — 업로드 시 썸네일, 웹훅 처리, 정기 배치
- [[microservices]]를 10~30개 쪼개고 각자 독립 배포·스케일하고 싶을 때
- [[iac]]와 결합해 전체 스택을 코드로 버저닝하고 싶을 때 — 서버리스는 [[immutable-infra]]를 사실상 강제

### 쉽게 빠지는 함정
- **Cold start** — 함수가 오래 쉬면 첫 호출이 느리다. 레이턴시 SLO가 100ms급이면 Provisioned Concurrency나 [[ecs]] Fargate로 넘어가야 함
- **15분 실행 한도** — [[lambda]]는 장시간 작업에 맞지 않는다. 긴 배치는 Step Functions로 쪼개거나 [[ecs]] Fargate로
- **비용 역전** — 초당 수천 요청으로 상시 붙어 있는 서비스라면 서버리스 단가가 EC2·[[ecs]]보다 비쌀 수 있다. [[cost]] 대시보드로 손익분기 추적
- **[[monitoring]] 공백** — 함수가 잠깐 떴다 사라지니 `tail -f` 문화가 안 통한다. 로그·트레이스를 CloudWatch/X-Ray로 설계 시점에 같이 빼둘 것
- **상태 있는 작업에 무리** — 함수 간 공유 상태는 [[dynamodb]]·[[s3]]·Redis([[memorydb]])로. 메모리에 기대면 재시작 순간 날아감
- **로컬 재현의 어려움** — 서비스 의존성이 많아 "내 PC에선 됐는데"가 심해진다. SAM/serverless framework, LocalStack으로 부분 복제

### 연결
[[lambda]]·[[apigw]]·[[dynamodb]]·[[s3]]가 직접 자식 블록. [[ecs]] Fargate는 컨테이너를 같은 철학으로 묶은 사촌. [[iac]]·[[cicd]]·[[immutable-infra]]의 운영 삼각형이 가장 자연스럽게 붙는 실행 모델이고, [[microservices]]의 단위 구현으로도 자주 쓰인다. [[cost]] 관점에서는 "공짜처럼 보이지만 조건 따라 비싼" 존재라 [[monitoring]]과 [[aiops]]가 초기부터 필요하다.

## en

Serverless is the operational model where **you rent short-lived functions on demand instead of renting a server 24/7**. Unlike an always-on EC2, the code wakes on request, does its work, and goes back to sleep — zero idle cost, pay only for what you use. "No server" is marketing; the truth is the cloud hides the server so you don't have to think about it.

AWS's serverless family is a box of blocks you compose: [[lambda]] (function execution) + [[apigw]] (HTTP entry) + [[dynamodb]] (NoSQL store) + [[s3]] (object store) + EventBridge/SQS/SNS (event wiring). For containerized serverless, reach for [[ecs]] + Fargate. "Serverless" isn't one service — it's the *paradigm* of assembling these blocks to shed operational burden.

### When to use
- Spiky or heavily idle workloads where staying up 24/7 wastes money
- Startups and side projects — start near $0/mo and scale up automatically as users arrive
- Event-driven work — thumbnails on upload, webhook handlers, scheduled jobs
- Splitting a system into 10–30 [[microservices]] that each deploy and scale independently
- Pairing with [[iac]] to version the whole stack as code — serverless practically enforces [[immutable-infra]]

### Common pitfalls
- **Cold starts** — a long-idle function is slow to first response. If your latency SLO is ~100 ms, move to Provisioned Concurrency or [[ecs]] Fargate
- **15-minute execution cap** — [[lambda]] doesn't fit long-running work. Split via Step Functions or move to [[ecs]] Fargate
- **Cost crossover** — at thousands of RPS sustained, serverless unit economics can lose to EC2 or [[ecs]]. Track the break-even in [[cost]] dashboards
- **[[monitoring]] gaps** — functions vanish before you can `tail -f`. Plan logs and traces via CloudWatch and X-Ray at design time, not after an incident
- **Stateful work under protest** — share state through [[dynamodb]], [[s3]], or Redis ([[memorydb]]). Leaning on in-memory state means one restart wipes you out
- **Hard-to-reproduce locally** — many service deps, so "works on my machine" gets worse. Use SAM, Serverless Framework, or LocalStack for partial reproduction

### How it connects
[[lambda]], [[apigw]], [[dynamodb]], and [[s3]] are the direct child blocks. [[ecs]] Fargate is the container cousin that shares the philosophy. It's the execution model where the [[iac]] + [[cicd]] + [[immutable-infra]] operational triangle fits most naturally, and it's a common unit of [[microservices]]. From a [[cost]] angle it looks free but can bite under sustained load, so [[monitoring]] and [[aiops]] belong from day one.

## ja

サーバーレスは**「サーバーを借りる代わりに、必要な瞬間だけ動く関数を借りる」**運用モデル。EC2のように24時間点けて月額を払うのではなく、リクエストが来た時だけ起きて仕事し、また眠る — 平時コスト0、使った分だけ課金。「サーバーがない」はマーケティングで、正確にはサーバーの存在を意識しなくていいようクラウドが隠してくれる、という意味。

AWSのサーバーレス系列は組み合わせブロック: [[lambda]](関数実行) + [[apigw]](HTTP入口) + [[dynamodb]](NoSQLストア) + [[s3]](ファイルストア) + EventBridge・SQS・SNS(イベント配線)。コンテナ型サーバーレスが必要なら[[ecs]] + Fargate。「サーバーレス」は特定サービスでなく、これらのブロックを組み立てて運用負荷を消す*パラダイム*だ。

### いつ使うか
- トラフィックにムラがあったり、平時のアイドル時間が長いサービス — 24時間点ける理由がないとき
- スタートアップ・サイドプロジェクト — 月$0近くで始め、ユーザーが増えれば自動スケール
- イベント駆動処理 — アップロード時のサムネ生成、Webhook処理、定期バッチ
- [[microservices]]を10〜30に分けて個別デプロイ・スケールしたいとき
- [[iac]]と組んでスタック全体をコードでバージョン管理したいとき — サーバーレスは[[immutable-infra]]を事実上強制する

### はまりやすい罠
- **Cold start** — 関数が長く休むと初回が遅い。レイテンシSLOが100ms級ならProvisioned Concurrencyか[[ecs]] Fargateへ
- **15分実行上限** — [[lambda]]は長時間作業に合わない。Step Functionsで分割するか[[ecs]] Fargateに移す
- **コスト逆転** — 毎秒数千リクエスト常時稼働ならサーバーレスの単価がEC2や[[ecs]]を上回ることがある。[[cost]]ダッシュボードで損益分岐を追う
- **[[monitoring]]の空白** — 関数は`tail -f`が効く前に消える。ログとトレースはCloudWatch・X-Rayで設計時点から
- **状態ありの作業を無理に** — 関数間の共有状態は[[dynamodb]]・[[s3]]・Redis([[memorydb]])へ。メモリに依存すると再起動一発で消える
- **ローカル再現の難しさ** — サービス依存が多く「自分のPCでは動く」が悪化する。SAM・Serverless Framework・LocalStackで部分再現する

### 繋がり
[[lambda]]・[[apigw]]・[[dynamodb]]・[[s3]]が直接の子ブロック。[[ecs]] Fargateは同じ哲学を持つコンテナ版のいとこ。[[iac]]・[[cicd]]・[[immutable-infra]]の運用三角形が最も自然に乗る実行モデルで、[[microservices]]の単位実装にもよく使われる。[[cost]]の観点では「無料に見えて条件次第で高くつく」存在なので、[[monitoring]]と[[aiops]]は初日から必要だ。

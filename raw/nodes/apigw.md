---
id: apigw
cat: ops
size: 3
title:
  ko: API Gateway
  en: API Gateway
  ja: API Gateway
refs:
  - url: https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html
    title: What is API Gateway? (AWS Docs)
    lang: en
  - url: https://aws.amazon.com/api-gateway/features/
    title: API Gateway features (AWS)
    lang: en
extraEdges: []
---

## ko

API Gateway는 **"HTTP 요청이 AWS 내부 서비스로 들어오는 공식 관문"**이다. 클라이언트(브라우저·모바일·외부 시스템)가 보낸 요청을 받아 인증·레이트리미팅·변환을 거쳐 [[lambda]]·[[ecs]]·다른 HTTP 백엔드로 라우팅한다. 서버리스 스택의 기본 "입구" 역할이며, 직접 ALB를 다루지 않고 관리형으로 빠르게 API를 세울 수 있게 해준다.

세 가지 종류가 있다. **REST API** — 가장 기능 풍부([[rest]] 지원), API 키·요청 검증·SDK 생성·X-Ray 통합. **HTTP API** — 더 가볍고 빠르고 저렴, 대부분의 현업에 충분. **WebSocket API** — 양방향 연결 (채팅·실시간 업데이트). 2020년 이후 신규 프로젝트에선 HTTP API가 기본 추천.

### 언제 쓰나
- [[lambda]] 앞단의 HTTP 엔드포인트 — [[serverless]] 삼각형의 한 꼭지점
- 외부 API 노출 — 키 기반 액세스·사용량 플랜·요금제 연동
- [[microservices]] 진입점 — 서비스 여러 개 뒤에 한 도메인
- WebSocket 필요 — 채팅·대시보드·협업 툴
- 인증·[[rest]]·쓰로틀링을 백엔드에서 빼고 게이트웨이에 위임하고 싶을 때

### 쉽게 빠지는 함정
- **요금** — REST API는 요청당 $3.5/백만 + 전송. 트래픽 클럼이면 ALB가 저렴할 수 있음. [[cost]] 재계산
- **콜드 스타트 + Lambda 콜드 스타트 중첩** — 사용자 체감 레이턴시 무거워짐. Provisioned Concurrency 또는 HTTP API로
- **CORS 설정 지옥** — 세션이 꼬이면 디버깅이 악몽. 테스트 환경에서 확정해두고 [[iac]]로 고정
- **인증 로직 분산** — API Gateway·Lambda·비즈니스 로직에 각각 흩어지면 바꾸기 어려움. Authorizer로 한 곳에
- **과도한 변환 로직** — 게이트웨이에서 요청/응답 변환을 복잡하게 짜면 디버깅 불가. 단순 프록시 + 백엔드에서 처리
- **로깅·모니터링 없이 프로덕션** — [[monitoring]]·X-Ray·엑세스 로그를 초기부터. 장애 났을 때 "어디 있나" 추적 못 하면 지옥

### REST API vs HTTP API (2026년 기준)
- **HTTP API가 기본값** — 70% 저렴, 더 빠름, 최신 기능이 우선 들어감
- **REST API는** — 기존 REST API 계약이 있거나, API Key 사용량 플랜·요청 검증이 필수일 때
- 둘 다 [[rest]] 설계와는 다른 문제 — [[rest]] 원칙은 백엔드 설계의 문제, API Gateway는 배치/운영의 문제

### 연결
[[lambda]]·[[ecs]] 앞단의 표준 입구. [[serverless]] + [[dynamodb]] 삼종 세트의 "ㄱ" 부분. [[rest]]·[[graphql]]·WebSocket 3가지 HTTP 패러다임 모두 지원. [[iac]]로 API 정의를 코드화([[microservices]] 여러 개를 한 게이트웨이 뒤에 묶을 때 특히 중요). [[monitoring]]·[[cost]]에서는 항상 주요 관찰 대상.

## en

API Gateway is **the official front door for HTTP requests entering AWS**. It receives calls from clients (browsers, mobile, external systems), handles authentication, rate-limiting, and transformation, then routes to [[lambda]], [[ecs]], or other HTTP backends. It's the default "entry" in serverless stacks, letting you stand up APIs without managing ALBs directly.

Three flavors exist. **REST API** — most feature-rich ([[rest]] support, API keys, request validation, SDK generation, X-Ray integration). **HTTP API** — lighter, faster, cheaper; sufficient for most real-world uses. **WebSocket API** — bidirectional connections (chat, live updates). Since 2020, HTTP API is the default recommendation for new projects.

### When to use
- HTTP endpoint in front of [[lambda]] — one vertex of the serverless triangle
- Public APIs — key-based access, usage plans, billing integration
- [[microservices]] entry — many services behind one domain
- WebSocket needs — chat, dashboards, collaborative tools
- When offloading auth, [[rest]] concerns, or throttling from the backend onto the gateway

### Common pitfalls
- **Pricing** — REST API runs ~$3.50 per million requests + data transfer. Under sustained heavy traffic, ALB may be cheaper. Recompute [[cost]]
- **Cold starts stacked on Lambda cold starts** — user-perceived latency balloons. Provisioned Concurrency, or move to HTTP API
- **CORS hell** — once sessions tangle, debugging is a nightmare. Pin it down in staging, then freeze via [[iac]]
- **Scattered auth logic** — authentication spread across API Gateway, Lambda, and business logic is unchangeable. Consolidate via Authorizers
- **Over-complex transformations** — heavy mapping in the gateway becomes undebuggable. Prefer a simple proxy and handle it in the backend
- **Production without logging/monitoring** — [[monitoring]], X-Ray, access logs from day one. Without them, incident triage is hopeless

### REST API vs HTTP API (as of 2026)
- **HTTP API is the default** — ~70% cheaper, faster, newer features land here first
- **REST API when** — existing REST API contracts need preserving, or API Key usage plans / request validation are must-haves
- Both are a different problem from [[rest]] — REST is a design question for the backend; API Gateway is a placement/ops question

### How it connects
The standard ingress in front of [[lambda]] and [[ecs]]. The "API" corner of the [[serverless]] + [[dynamodb]] trifecta. Supports all three HTTP paradigms — [[rest]], [[graphql]], WebSocket. Codified via [[iac]] (crucial when grouping many [[microservices]] behind one gateway). Always a primary target in [[monitoring]] and [[cost]] reviews.

## ja

API Gatewayは**「HTTPリクエストがAWS内部サービスに入る正式な関門」**。クライアント(ブラウザ・モバイル・外部システム)の要求を受け、認証・レートリミッティング・変換を経て[[lambda]]・[[ecs]]・その他HTTPバックエンドへルーティングする。サーバーレススタックの標準「入口」役で、ALBを直接扱わず管理型で素早くAPIを立てられる。

三種類ある。**REST API** — 最も機能豊富([[rest]]対応、APIキー・要求検証・SDK生成・X-Ray統合)。**HTTP API** — より軽量・高速・安価、ほとんどの現場に十分。**WebSocket API** — 双方向接続(チャット・リアルタイム更新)。2020年以降の新規プロジェクトではHTTP APIが既定推奨。

### いつ使うか
- [[lambda]]前段のHTTPエンドポイント — サーバーレス三角形の一頂点
- 外部API公開 — キーベースアクセス・使用量プラン・課金連携
- [[microservices]]のエントリ — 多数サービスを一つのドメインに
- WebSocket必要 — チャット・ダッシュボード・協業ツール
- 認証・[[rest]]・スロットリングをバックエンドから外しゲートウェイに委譲したいとき

### はまりやすい罠
- **料金** — REST APIは百万リクエスト$3.5 + 転送。トラフィック大ならALBが安いことも。[[cost]]再計算
- **コールドスタート + Lambdaコールドスタートの重なり** — 体感レイテンシが膨らむ。Provisioned Concurrency、またはHTTP APIへ
- **CORS地獄** — セッションが絡むとデバッグが悪夢。ステージングで固定して[[iac]]に焼く
- **認証ロジックの分散** — API Gateway・Lambda・ビジネスロジックに散ると変更不能。Authorizerに集約
- **過度な変換ロジック** — ゲートウェイで要求/応答変換を複雑に書くとデバッグ不能。単純プロキシにしてバックエンドで処理
- **ロギング・モニタリングなしに本番** — [[monitoring]]・X-Ray・アクセスログは初日から。なしでは障害triageが絶望的

### REST API vs HTTP API (2026年時点)
- **HTTP APIが既定値** — 約70%安い、速い、新機能が先に入る
- **REST APIは** — 既存REST API契約の維持、またはAPIキー使用量プラン・要求検証が必須のとき
- どちらも[[rest]]とは別問題 — RESTはバックエンド設計の問題、API Gatewayは配置・運用の問題

### 繋がり
[[lambda]]・[[ecs]]前段の標準入口。[[serverless]] + [[dynamodb]]三種の神器の「API」部分。[[rest]]・[[graphql]]・WebSocketの三HTTPパラダイムすべてを対応。[[iac]]でAPI定義をコード化(多数の[[microservices]]を一つのゲートウェイ裏に束ねるとき特に重要)。[[monitoring]]・[[cost]]では常に主要観察対象。

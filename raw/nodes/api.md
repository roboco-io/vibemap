---
id: api
cat: tech
size: 2
title:
  ko: API
  en: API
  ja: API
refs:
  - url: https://en.wikipedia.org/wiki/API
    title: API (Wikipedia)
    lang: en
  - url: https://www.apiday.com/
    title: API Day — community and resources
    lang: en
  - url: https://swagger.io/resources/articles/
    title: Swagger/OpenAPI Resources
    lang: en
extraEdges: []
---

## ko

API(Application Programming Interface)는 **"소프트웨어끼리 약속된 방식으로 대화할 수 있도록 정의된 접점"**이다. 라이브러리 함수 호출부터 HTTP로 주고받는 원격 서비스까지 모두 API의 일종. 오늘날 "API"라고 하면 대개 *네트워크를 통한 원격 API*를 가리키며, 그 안에서 [[rest]]·[[graphql]]·gRPC·WebSocket이 주요 스타일로 경쟁·공존한다.

API의 진짜 가치는 *경계*를 만드는 데 있다. 안쪽의 복잡성을 숨기고, 바깥쪽에게는 *계약*만 노출. 이 계약이 단단하면 내부를 마음대로 리팩터할 수 있고([[simplify]]·[[refactor]]), 계약이 무너지면 소비자 전부가 같이 깨진다. 그래서 *버전 관리*와 *계약 테스트*가 API 설계의 심장. OpenAPI(Swagger), AsyncAPI, Pact, Protobuf 등 도구가 이를 지원한다.

### 언제 고민하나
- 시스템을 둘 이상의 조각으로 쪼갤 때 — [[microservices]]의 전제
- 외부 파트너·고객에게 기능을 노출할 때 — [[domain]] 정책·레이트리미팅이 필요
- 모바일·웹·AI 에이전트가 동시에 붙는 백엔드 — 한 API가 여러 소비자 상대
- [[ai-coding-tools]] 연동 — [[mcp]]도 결국 *AI와 도구 간의 API*
- [[llmops]] 운영 — LLM API 호출 자체가 가장 빈번한 외부 API 사용 사례

### API 스타일 비교
- **[[rest]]** — HTTP 기본에 충실, 캐시·표준성 강함, 과도·부족 fetch 문제 있음
- **[[graphql]]** — 클라이언트가 원하는 모양 쿼리, 유연, 러닝 커브·N+1 주의
- **gRPC** — 고성능·스트리밍·강타입, 브라우저 지원 약함, 내부 서비스 간에 적합
- **WebSocket** — 양방향 실시간, 채팅·협업
- **이벤트(EventBridge, Kafka)** — 비동기 메시지, 느슨한 결합

### 쉽게 빠지는 함정
- **계약 없이 시작** — 문서 없이 돌아가면 소비자는 스펙을 *추측*한다. [[hallucination]] 관련 LLM이 유독 문제
- **버전 관리 부재** — 한 번 배포한 API는 돌이키기 어렵다. `/v1/`, `/v2/` 또는 헤더 방식 전략 초기부터
- **에러 포맷 불일치** — 어떤 엔드포인트는 `{error}`, 어떤 건 `{code, message}`. 일관성이 품질의 절반
- **[[testing]]에서 실제 호출만** — 계약 테스트 없으면 소비자 코드가 조용히 깨짐. Pact 같은 도구로 양방향 검증
- **보안 토큰을 쿼리 파라미터로** — 로그에 그대로 찍힘. 항상 Authorization 헤더
- **N+1 응답** — GraphQL에서 흔한 실수. DataLoader 등 패턴 적용 필요
- **[[monitoring]] 없음** — 어떤 엔드포인트가 느리고 자주 실패하는지 모르면 개선 포인트를 못 찾음

### 연결
[[rest]]·[[graphql]]이 대표 스타일이고, [[apigw]]가 AWS에서의 배포 관문. [[microservices]] 경계의 계약이자 [[testing]]에서 계약 테스트의 대상. [[mcp]]는 AI와 툴 간의 API 표준화 시도. [[ai-coding-tools]]에게 API를 호출시킬 때 [[context-eng]]에 OpenAPI 스펙을 주입하면 [[hallucination]]이 크게 줄어든다.

## en

An API (Application Programming Interface) is **"a defined contact point through which software can talk to other software, by agreed-upon rules."** It covers everything from library function calls to remote services over HTTP. In modern usage, "API" usually means *remote API over the network*, and within that space [[rest]], [[graphql]], gRPC, and WebSocket are the main styles in competition and coexistence.

The real value of an API is building a *boundary*. It hides internal complexity and exposes only the *contract*. Strong contracts let you freely refactor internals ([[simplify]], [[refactor]]); broken contracts break every consumer at once. That's why *versioning* and *contract testing* sit at the heart of API design. Tools like OpenAPI (Swagger), AsyncAPI, Pact, and Protobuf support the discipline.

### When to think about it
- Splitting a system into two or more pieces — a premise of [[microservices]]
- Exposing features to external partners or customers — [[domain]] policy and rate-limiting needed
- Mobile, web, and AI agents hitting the same backend simultaneously
- Integrating with [[ai-coding-tools]] — [[mcp]] is, in the end, *an API between AI and tools*
- [[llmops]] operations — calling LLM APIs is the most frequent external API use case

### Style comparison
- **[[rest]]** — HTTP-native, cache-friendly, standard; suffers over-/under-fetching
- **[[graphql]]** — client queries the shape it wants; flexible; steeper learning curve and N+1 risk
- **gRPC** — high performance, streaming, strong typing; poor browser support; good for internal service-to-service
- **WebSocket** — bidirectional real-time; chat, collaboration
- **Events (EventBridge, Kafka)** — async messaging, loose coupling

### Common pitfalls
- **Starting without a contract** — without docs, consumers *guess* the spec. LLMs especially suffer via [[hallucination]]
- **Missing versioning** — once released, rollback is hard. Decide `/v1/` vs header strategy up front
- **Inconsistent error formats** — `{error}` here, `{code, message}` there. Consistency is half of quality
- **Only [[testing]] the live call** — without contract tests, consumer code breaks silently. Use Pact or similar for two-way verification
- **Security tokens in query params** — they end up in logs. Always Authorization headers
- **N+1 responses** — a GraphQL staple mistake. Apply patterns like DataLoader
- **No [[monitoring]]** — without per-endpoint latency / error metrics, you can't target improvements

### How it connects
[[rest]] and [[graphql]] are the headline styles; [[apigw]] is AWS's delivery gateway. The contract layer of [[microservices]] boundaries and the target of contract tests in [[testing]]. [[mcp]] is the standardization attempt for AI-to-tool APIs. When you have [[ai-coding-tools]] call an API, injecting the OpenAPI spec into [[context-eng]] drops [[hallucination]] rates dramatically.

## ja

API(Application Programming Interface)は**「ソフトウェア同士が約束された方法で対話できるよう定義された接点」**。ライブラリの関数呼び出しからHTTPで通信する遠隔サービスまで全てAPIの一種。今日「API」と言えば大抵*ネットワーク越しの遠隔API*を指し、その中で[[rest]]・[[graphql]]・gRPC・WebSocketが主要スタイルとして競合・共存する。

APIの本当の価値は*境界*を作ることにある。内側の複雑性を隠し、外側には*契約*だけを見せる。この契約が堅ければ内部を自由にリファクタできる([[simplify]]・[[refactor]])し、契約が壊れれば消費者全員が一緒に壊れる。だから*バージョン管理*と*契約テスト*がAPI設計の心臓。OpenAPI(Swagger)、AsyncAPI、Pact、Protobufなどのツールがこれを支える。

### いつ考えるか
- システムを二つ以上のパーツに分けるとき — [[microservices]]の前提
- 外部パートナー・顧客に機能を公開するとき — [[domain]]ポリシー・レートリミッティングが必要
- モバイル・Web・AIエージェントが同時に繋がるバックエンド — 一つのAPIが複数消費者を相手に
- [[ai-coding-tools]]との連携 — [[mcp]]も結局*AIとツール間のAPI*
- [[llmops]]運用 — LLM API呼び出し自体が最も頻繁な外部API使用例

### スタイル比較
- **[[rest]]** — HTTP基本に忠実、キャッシュ・標準性強い、over/under-fetching問題あり
- **[[graphql]]** — クライアントが欲しい形をクエリ、柔軟、学習曲線・N+1に注意
- **gRPC** — 高性能・ストリーミング・強型、ブラウザサポート弱い、内部サービス間に好適
- **WebSocket** — 双方向リアルタイム、チャット・協業
- **イベント(EventBridge、Kafka)** — 非同期メッセージ、疎結合

### はまりやすい罠
- **契約なしで始める** — ドキュメントなしで動くと消費者は仕様を*推測*する。LLM関連で特に[[hallucination]]
- **バージョン管理不在** — 一度公開したAPIは取り消しが難しい。`/v1/`・`/v2/`またはヘッダー方式戦略を初期から
- **エラー形式の不一致** — あるエンドポイントは`{error}`、あるのは`{code, message}`。一貫性が品質の半分
- **[[testing]]で実呼び出しのみ** — 契約テストなしでは消費者コードが静かに壊れる。Pactのようなツールで双方向検証
- **セキュリティトークンをクエリパラメータに** — ログに残る。常にAuthorizationヘッダー
- **N+1レスポンス** — GraphQLでよくあるミス。DataLoaderなどのパターンを適用
- **[[monitoring]]なし** — どのエンドポイントが遅く頻繁に失敗するか分からないと改善点が見つからない

### 繋がり
[[rest]]・[[graphql]]が代表スタイルで、[[apigw]]がAWSでのデプロイ関門。[[microservices]]境界の契約であり[[testing]]で契約テストの対象。[[mcp]]はAIとツール間のAPI標準化の試み。[[ai-coding-tools]]にAPIを呼ばせるとき[[context-eng]]にOpenAPIスペックを注入すれば[[hallucination]]が大きく減る。

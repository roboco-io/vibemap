---
id: it
cat: tech
size: 3
title:
  ko: 통합 테스트 (Integration Test)
  en: Integration Test
  ja: 結合テスト
refs:
  - url: https://en.wikipedia.org/wiki/Integration_testing
    title: Integration testing (Wikipedia)
    lang: en
  - url: https://martinfowler.com/bliki/IntegrationTest.html
    title: Integration Test — Martin Fowler
    lang: en
extraEdges: []
---

## ko

통합 테스트(Integration Test, IT)는 **"여러 모듈이 *실제로 함께 동작할 때*의 행동을 검증하는 테스트"**다. [[ut]]이 함수 하나를 고립시켜 보는 거라면, IT는 "이 서비스 + DB + 캐시 + 인증 계층이 진짜로 말이 통하는가?"를 본다. [[testing]] 피라미드의 중간, 현업 장애 대부분이 잡히는 층.

실전에서는 두 종류로 갈린다. **좁은 IT**(narrow) — 테스트 대역(Testcontainers의 Postgres, 로컬 Redis)을 띄워 실제 I/O는 하되 외부 API는 mock. **넓은 IT**(broad) — 진짜 외부 서비스까지 포함해 실제로 호출. 대부분 좁은 쪽이 유용 — 빠르고 안정적이면서 [[ut]]이 못 잡는 통합 문제는 대부분 잡아준다. [[microservices]] 시대에는 **계약 테스트**(consumer-driven contracts)가 별도 축으로 자주 병행.

### 언제 쓰나
- **DB·캐시·큐 등 실제 인프라와의 상호작용** — ORM 매핑, SQL 방언, 트랜잭션 경계
- **외부 API 어댑터** — 응답 포맷 변경, 인증 실패, 타임아웃 처리
- **프레임워크 설정** — 미들웨어 순서, 인터셉터, 라우팅
- **[[microservices]] 경계** — 서비스 간 API 호환성. 계약 테스트가 주 축
- **[[iac]] 시나리오** — 실제 클라우드 리소스 생성/소멸 확인 (staging 환경)

### 쉽게 빠지는 함정
- **UT를 IT라 부르기** — mock만 쓰면서 "통합"이라 주장. 실제 인프라가 개입하지 않으면 IT 이점이 사라짐
- **느림 → 자주 안 돌림 → 신뢰 저하** — 30분짜리 IT는 사실상 없는 거나 같다. Testcontainers 등으로 시작 시간 수초로
- **flaky IT** — 타이밍·포트 충돌·외부 의존. 원인 해결 안 하면 "그냥 재시도" 문화 형성 → 신뢰 붕괴
- **Production DB에 테스트 연결** — 한 번의 오타로 프로덕션 데이터가 사라진다. 완전히 분리된 테스트 환경
- **데이터 청소 생략** — 테스트 간 데이터 누적으로 실행 순서 의존. 각 테스트가 자기 fixture 관리
- **실제 비용 발생** — IT가 실제 AWS·OpenAI API를 호출하면 CI 비용이 급등. Mock/stub 경계 명확히

### 좁은 IT 패턴
- **Testcontainers** — Docker로 진짜 Postgres·Redis·Kafka를 테스트마다 깨끗하게
- **LocalStack** — AWS 서비스 로컬 에뮬레이션 (S3·DynamoDB·Lambda 등)
- **WireMock / MSW** — 외부 API를 HTTP 레벨에서 녹음·재생
- **계약 테스트 (Pact, Spring Cloud Contract)** — 소비자-공급자 스펙 공유

### 연결
[[testing]] 피라미드의 중간층. [[ut]] 아래·[[e2e]] 위. [[cicd]]에서 UT 다음 단계로 돌아감. [[microservices]]·[[serverless]] 아키텍처에서는 계약 테스트가 독립 배포의 열쇠. [[tdd]] 사이클에서도 통합 지점은 IT로 감싸두면 리팩터가 편해진다. [[claude-code]]가 코드를 바꿀 때 IT가 있으면 회귀 감지 속도가 비약적으로 빨라진다.

## en

An integration test (IT) is **"a test that verifies how multiple modules behave *when actually wired together*."** Where [[ut]] isolates a single function, IT asks "does this service + DB + cache + auth layer actually talk to each other?" It sits in the middle of the [[testing]] pyramid and is where most production-class bugs get caught.

Two shapes dominate in practice. **Narrow ITs** use test doubles (Testcontainers Postgres, local Redis) with real I/O but mock external APIs. **Broad ITs** bring real external services into the loop. Narrow wins most of the time — fast, stable, and catches the integration bugs [[ut]] misses. In the [[microservices]] era, **contract tests** (consumer-driven) run on their own axis alongside these.

### When to use
- **Real DB, cache, queue interactions** — ORM mappings, SQL dialects, transaction boundaries
- **External API adapters** — response format changes, auth failures, timeouts
- **Framework configuration** — middleware order, interceptors, routing
- **[[microservices]] boundaries** — inter-service API compatibility. Contract tests lead here
- **[[iac]] scenarios** — verify real cloud resource creation/teardown (staging)

### Common pitfalls
- **Calling UT "IT"** — all-mock tests claiming integration coverage. If real infrastructure doesn't participate, the IT benefit evaporates
- **Slow → rarely run → trusted less** — a 30-minute IT suite effectively doesn't exist. Testcontainers can cut startup to seconds
- **Flaky ITs** — timing, port collision, external dependencies. Without addressing the cause, a "just retry" culture forms and trust collapses
- **Connecting tests to production DB** — one typo wipes production data. Fully separated test environment required
- **Skipping data cleanup** — accumulated state couples test order. Each test owns its fixtures
- **Real cost leakage** — ITs calling real AWS / OpenAI APIs spike CI costs. Draw a clear mock/stub boundary

### Narrow-IT patterns
- **Testcontainers** — Docker launches real Postgres, Redis, Kafka cleanly per test
- **LocalStack** — local emulation of AWS services (S3, DynamoDB, Lambda)
- **WireMock / MSW** — record-and-replay external APIs at the HTTP level
- **Contract tests (Pact, Spring Cloud Contract)** — consumer/provider spec shared explicitly

### How it connects
The middle of the [[testing]] pyramid, above [[ut]] and below [[e2e]]. In [[cicd]], it runs after UT. In [[microservices]] and [[serverless]] architectures, contract tests are the key to independent deploys. In the [[tdd]] loop, wrapping integration points with IT makes later refactors dramatically safer. When [[claude-code]] changes code, having IT accelerates regression detection enormously.

## ja

結合テスト(Integration Test、IT)は**「複数モジュールが*実際に一緒に動いているとき*の振る舞いを検証するテスト」**。[[ut]]が関数一つを孤立させて見るなら、ITは「このサービス + DB + キャッシュ + 認証層が本当に話が通じるか?」を見る。[[testing]]ピラミッドの中間、現業障害の大半が引っかかる層。

実戦では二種類に分かれる。**狭いIT**(narrow) — テストダブル(TestcontainersのPostgres、ローカルRedis)を立ち上げ実I/Oはするが外部APIはmock。**広いIT**(broad) — 実際の外部サービスまで巻き込んで本当に呼び出す。大抵狭い方が有用 — 速く安定でありながら[[ut]]が捉えられない統合問題を大半捕まえる。[[microservices]]時代には**契約テスト**(consumer-driven contracts)が別軸で並走することが多い。

### いつ使うか
- **DB・キャッシュ・キューなど実インフラとの相互作用** — ORMマッピング、SQL方言、トランザクション境界
- **外部APIアダプタ** — レスポンス形式変更、認証失敗、タイムアウト処理
- **フレームワーク設定** — ミドルウェア順序、インターセプタ、ルーティング
- **[[microservices]]境界** — サービス間API互換性。契約テストが主軸
- **[[iac]]シナリオ** — 実際のクラウドリソース生成/破棄の確認(ステージング)

### はまりやすい罠
- **UTをITと呼ぶ** — mockだけで「統合」と主張。実インフラが関与しなければIT利点が消える
- **遅い → 走らせない → 信頼低下** — 30分のITは実質存在しないも同然。Testcontainersで起動を数秒に
- **flakyなIT** — タイミング・ポート衝突・外部依存。原因を解かないと「とりあえずretry」文化になり信頼崩壊
- **本番DBにテスト接続** — 一発のタイポで本番データが消える。完全に分離したテスト環境
- **データクリーンアップ省略** — テスト間の状態蓄積で実行順依存。各テストが自分のfixtureを管理
- **実コスト発生** — ITが実AWSやOpenAI APIを呼ぶとCIコストが跳ねる。Mock/stubの境界を明確に

### 狭いITのパターン
- **Testcontainers** — Dockerで実Postgres・Redis・Kafkaをテスト毎に清潔に
- **LocalStack** — AWSサービスのローカルエミュレーション(S3・DynamoDB・Lambdaなど)
- **WireMock / MSW** — 外部APIをHTTPレベルで録音・再生
- **契約テスト(Pact、Spring Cloud Contract)** — 消費者-供給者の仕様を共有

### 繋がり
[[testing]]ピラミッドの中間層。[[ut]]の上・[[e2e]]の下。[[cicd]]でUTの次段階として走る。[[microservices]]・[[serverless]]アーキテクチャでは契約テストが独立デプロイの鍵。[[tdd]]サイクルでも統合点をITで包んでおくとリファクタが楽になる。[[claude-code]]がコードを変えるときITがあれば回帰検知速度が飛躍的に上がる。

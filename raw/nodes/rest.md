---
id: rest
cat: tech
size: 3
title:
  ko: REST
  en: REST
  ja: REST
refs:
  - url: https://en.wikipedia.org/wiki/REST
    title: REST (Wikipedia)
    lang: en
  - url: https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm
    title: Roy Fielding's REST dissertation (2000)
    lang: en
  - url: https://github.com/microsoft/api-guidelines
    title: Microsoft REST API Guidelines
    lang: en
extraEdges: []
---

## ko

REST(Representational State Transfer)는 **"HTTP 프로토콜의 특성을 최대한 살려 API를 설계하는 스타일"**이다. Roy Fielding이 2000년 박사 논문에서 제안한 이후 20년 넘게 웹 [[api]]의 기본 어휘. 핵심 아이디어는 *리소스 중심* — 세상을 동사(`fetchUser`) 대신 명사(`/users/123`)로 모델링하고, HTTP 메서드(GET/POST/PUT/DELETE)로 조작한다.

하지만 현업에서 "REST"는 원본 논문의 엄격한 정의와 많이 다르다. Fielding이 요구한 HATEOAS(하이퍼미디어 내비게이션)를 지키는 API는 드물고, 대부분은 "리소스 URL + HTTP 메서드 + JSON 본문" 수준의 *REST-ish*. 그래도 이 수준의 관례만 지켜도 캐시·표준 상태 코드·도구 생태계의 큰 이점을 얻는다. 완벽한 REST보단 *일관된 REST-ish*가 실무 목표.

### REST의 기본 약속
- **리소스 중심 URL** — `/users/123/orders`, `/posts/42`. 명사가 주인공
- **HTTP 메서드 의미** — GET(읽기), POST(생성), PUT(전체 교체), PATCH(부분 수정), DELETE(삭제)
- **상태 코드** — 200(OK), 201(Created), 400(Client Error), 404(Not Found), 500(Server Error). 표준을 따라라
- **무상태** — 서버가 클라이언트 세션 상태를 들고 있지 않음. 확장성의 근본
- **캐시 가능** — GET 응답은 캐시 헤더로 중간층(CDN) 활용
- **콘텐츠 협상** — `Accept`/`Content-Type` 헤더로 JSON·XML·Protobuf 선택

### 언제 쓰나
- 일반 웹 [[api]] — 특별한 이유 없으면 REST가 기본값
- 퍼블릭 API — 표준성·도구 지원·러닝 커브가 낮음
- 캐시 효과가 큰 읽기 중심 서비스 — GET 무제한 캐시
- [[microservices]] 간 동기 통신 (내부 서비스라면 gRPC도 고려)
- AWS [[apigw]]와 조합 — REST API 타입이 기본

### 쉽게 빠지는 함정
- **동사 URL** — `/getUser?id=123`, `/deletePost`. REST 정신 위반, RPC 스타일
- **잘못된 상태 코드** — 모든 응답에 200 + `{"ok": false}`. 디버깅·캐시·모니터링 방해
- **PUT과 PATCH 혼동** — PUT은 *전체 교체*, PATCH는 *부분 수정*. 섞어 쓰면 클라이언트가 헷갈림
- **버전 전략 미리 정하지 않음** — `/v1/` prefix, 헤더, 서브도메인 — 어느 하나를 초기에 못 박을 것
- **에러 응답 구조 불일치** — `{error: "..."}` vs `{code, message}` vs `{errors: [...]}`. 한 번 정한 뒤 일관
- **N+1 리소스 요청** — 클라이언트가 100번의 GET을 하게 만듦. sparse fieldset·embed·GraphQL 고려
- **LLM에게 REST 클라이언트 코드 생성 시켜 [[hallucination]]** — 존재하지 않는 엔드포인트·필드. [[context-eng]]에 OpenAPI 스펙 주입

### REST vs GraphQL
- **REST가 낫다**: 단순 CRUD, 강한 캐시 필요, 도구·러닝 커브 우선
- **[[graphql]]이 낫다**: 모바일·다양한 클라이언트, 중첩 리소스 많이 fetch, 스키마 진화 유연성

### 연결
[[api]]의 가장 대중적인 스타일이자 [[apigw]]의 기본 모드. [[microservices]]·[[serverless]] 스택의 동기 통신 표준. [[testing]]에서 계약 테스트(Pact) 대상, [[cicd]]에서 OpenAPI 스펙 검증 단계. [[ai-coding-tools]]가 API 클라이언트를 만들 때 OpenAPI 스펙을 [[context-eng]]에 주입하는 게 품질 레버.

## en

REST (Representational State Transfer) is **"an API design style that leans fully into the nature of the HTTP protocol."** Roy Fielding proposed it in his 2000 dissertation, and it has been the baseline vocabulary of the web [[api]] for over twenty years. The core idea is *resource-oriented* — model the world in nouns (`/users/123`) rather than verbs (`fetchUser`) and manipulate them via HTTP methods (GET/POST/PUT/DELETE).

In practice, "REST" often drifts far from the strict dissertation definition. Few APIs actually satisfy HATEOAS (hypermedia navigation); most are *REST-ish*: "resource URL + HTTP method + JSON body." Even this level of convention unlocks huge benefits in caching, standard status codes, and tooling. The practical goal is *consistent REST-ish*, not perfect REST.

### REST's basic agreements
- **Resource-oriented URLs** — `/users/123/orders`, `/posts/42`. Nouns lead
- **HTTP method semantics** — GET (read), POST (create), PUT (full replace), PATCH (partial update), DELETE (remove)
- **Status codes** — 200, 201, 400, 404, 500 — follow the standards
- **Stateless** — server holds no client session state. Foundation of scalability
- **Cacheable** — GET responses participate in middle-tier caches (CDNs)
- **Content negotiation** — `Accept` / `Content-Type` picks JSON, XML, Protobuf

### When to use
- General web [[api]]s — REST is the default unless you have a reason otherwise
- Public APIs — standardization, tooling, and low learning curve matter
- Read-heavy, cache-friendly services — GET caches generously
- Internal [[microservices]] synchronous communication (gRPC is worth considering too)
- Pairs with AWS [[apigw]] — REST API type is the default

### Common pitfalls
- **Verb URLs** — `/getUser?id=123`, `/deletePost`. Violates REST; that's RPC style
- **Wrong status codes** — 200 for everything with `{"ok": false}` in the body. Wrecks debugging, caching, and monitoring
- **Confusing PUT and PATCH** — PUT is *full replace*, PATCH is *partial*. Mixing them confuses clients
- **No versioning strategy up front** — `/v1/` prefix, header, subdomain — commit to one early
- **Inconsistent error envelope** — `{error: "..."}` vs `{code, message}` vs `{errors: [...]}`. Pick one and hold
- **N+1 resource fetches** — making the client issue 100 GETs. Consider sparse fieldsets, embed, or GraphQL
- **LLM-generated REST clients full of [[hallucination]]** — nonexistent endpoints or fields. Inject the OpenAPI spec via [[context-eng]]

### REST vs GraphQL
- **REST wins**: simple CRUD, strong caching needs, tooling and learning curve matter
- **[[graphql]] wins**: mobile / varied clients, nested resources, schema evolution flexibility

### How it connects
The most mainstream style of [[api]] and the default mode of [[apigw]]. The synchronous-communication standard of [[microservices]] / [[serverless]] stacks. Target of contract tests in [[testing]] (Pact) and of OpenAPI spec validation steps in [[cicd]]. When [[ai-coding-tools]] generate API clients, feeding the OpenAPI spec via [[context-eng]] is the key quality lever.

## ja

REST(Representational State Transfer)は**「HTTPプロトコルの特性を最大限活かしてAPIを設計するスタイル」**。Roy Fieldingが2000年の博士論文で提案して以来、20年以上Web [[api]]の基本語彙。核となる考えは*リソース中心* — 世界を動詞(`fetchUser`)ではなく名詞(`/users/123`)でモデル化し、HTTPメソッド(GET/POST/PUT/DELETE)で操作する。

しかし現業で「REST」は原論文の厳密な定義と大きく違う。FieldingのHATEOAS(ハイパーメディアナビゲーション)を守るAPIは少なく、ほとんどは「リソースURL + HTTPメソッド + JSON本体」レベルの*REST-ish*。それでもこの程度の規約を守るだけでキャッシュ・標準ステータスコード・ツール生態系の大きな利点が得られる。完璧なRESTより*一貫したREST-ish*が実務の目標。

### RESTの基本約束
- **リソース中心URL** — `/users/123/orders`、`/posts/42`。名詞が主役
- **HTTPメソッドの意味** — GET(読み)、POST(生成)、PUT(全体置換)、PATCH(部分修正)、DELETE(削除)
- **ステータスコード** — 200、201、400、404、500 — 標準に従う
- **ステートレス** — サーバーがクライアントのセッション状態を持たない。拡張性の根源
- **キャッシュ可能** — GETレスポンスはキャッシュヘッダで中間層(CDN)に乗る
- **コンテンツネゴシエーション** — `Accept`/`Content-Type`ヘッダでJSON・XML・Protobufを選ぶ

### いつ使うか
- 一般的なWeb [[api]] — 特別な理由がなければRESTが既定値
- パブリックAPI — 標準性・ツール支援・学習曲線の低さ
- キャッシュ効果が大きい読み中心サービス — GET無制限キャッシュ
- [[microservices]]間の同期通信(内部サービスならgRPCも検討)
- AWS [[apigw]]と組み合わせ — REST APIタイプが既定

### はまりやすい罠
- **動詞URL** — `/getUser?id=123`、`/deletePost`。REST精神違反、RPCスタイル
- **間違ったステータスコード** — 全レスポンスに200 + `{"ok": false}`。デバッグ・キャッシュ・モニタリングを妨げる
- **PUTとPATCHの混同** — PUTは*全体置換*、PATCHは*部分修正*。混ぜるとクライアントが困る
- **バージョン戦略を先に決めない** — `/v1/`プレフィックス、ヘッダ、サブドメイン — 初期に一つに固定
- **エラーレスポンス構造の不一致** — `{error: "..."}` vs `{code, message}` vs `{errors: [...]}`。一つに決めて貫く
- **N+1リソース要求** — クライアントに100回のGETをさせる。sparse fieldset・embed・GraphQLを検討
- **LLMにRESTクライアントコード生成させて[[hallucination]]** — 存在しないエンドポイント・フィールド。[[context-eng]]にOpenAPI仕様を注入

### REST vs GraphQL
- **RESTが良い**: 単純CRUD、強いキャッシュ必要、ツール・学習曲線優先
- **[[graphql]]が良い**: モバイル・多様なクライアント、ネストしたリソースを大量fetch、スキーマ進化の柔軟性

### 繋がり
[[api]]の最も大衆的スタイルであり[[apigw]]の既定モード。[[microservices]]・[[serverless]]スタックの同期通信標準。[[testing]]の契約テスト(Pact)の対象、[[cicd]]でOpenAPI仕様検証ステップ。[[ai-coding-tools]]がAPIクライアントを作るときOpenAPI仕様を[[context-eng]]に注入するのが品質レバー。

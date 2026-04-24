---
id: graphql
cat: tech
size: 3
title:
  ko: GraphQL
  en: GraphQL
  ja: GraphQL
refs:
  - url: https://graphql.org/
    title: GraphQL — Official Site
    lang: en
  - url: https://en.wikipedia.org/wiki/GraphQL
    title: GraphQL (Wikipedia)
    lang: en
  - url: https://www.apollographql.com/docs/
    title: Apollo GraphQL Documentation
    lang: en
extraEdges: []
---

## ko

GraphQL은 **"클라이언트가 필요한 데이터의 모양을 직접 쿼리로 지정해서 받는 API 질의어"**다. 2012년 Facebook 내부에서 만들어져 2015년 오픈소스화, 모바일·웹 앱이 "엔드포인트 수십 개를 조합해 한 화면에 뿌리는" 부담을 덜기 위한 답으로 퍼졌다. [[rest]]가 리소스 단위로 미리 모양이 정해져 있다면, GraphQL은 *한 엔드포인트*에서 클라이언트가 원하는 필드·중첩만 쏙 골라 가져간다.

핵심은 **스키마**(타입 정의)와 **쿼리**(그 스키마에서 뽑아내는 요청). 서버는 스키마에 대한 resolver 함수를 제공하고, 클라이언트는 SQL 유사 쿼리로 요청. 덤으로 **subscription**(실시간 데이터), **mutation**(쓰기), **introspection**(스키마 자체를 쿼리)이 표준으로 따라온다. Apollo, Relay, URQL이 대표 클라이언트 라이브러리.

### 언제 쓰나
- **모바일·다양한 클라이언트** — 필요한 필드만 받아 대역폭·배터리 절약
- **중첩된 관계 데이터** — 한 화면에 "유저 + 포스트 + 댓글 + 작성자"가 동시에 필요할 때
- **스키마 진화가 잦은 도메인** — 필드 추가/deprecation이 유연
- **여러 마이크로서비스 위의 통합 레이어** — GraphQL Federation
- **[[ai-coding-tools]] + 관리자 도구** — 탐색형 쿼리가 자연어 → GraphQL 변환에 친화적

### 쉽게 빠지는 함정
- **N+1 문제** — 중첩 쿼리 내부에서 각 노드마다 DB 호출 터짐. DataLoader로 배치·캐시 필수
- **과도한 깊이의 쿼리** — 악의적 클라이언트가 20단계 중첩 요청 → 서버 폭격. 깊이 제한·복잡도 분석·쿼리 비용 예산
- **인증·권한을 리졸버에 흩뿌림** — 한 필드마다 권한 체크. 공통 레이어로 중앙화해야 유지 가능
- **캐싱 어려움** — HTTP 캐시(GET 기반)가 자연스러운 [[rest]]에 비해 GraphQL은 모든 게 POST. Apollo 클라이언트·CDN 특수 설정 필요
- **"필요한 것만 받아서 빠르다"의 과신** — 서버 쪽은 오히려 복잡. 네트워크는 절약해도 서버 CPU는 늘어날 수 있음
- **모든 API를 GraphQL로 바꿔야 한다는 유혹** — 단순 CRUD는 [[rest]]이 여전히 낫다. 둘은 도구, 이념이 아님
- **LLM이 존재하지 않는 필드 쿼리** — 스키마 introspection 먼저 물어보게 하는 [[context-eng]] 필수

### 연결
[[api]]의 한 스타일로 [[rest]]의 대안·보완. [[microservices]]에서 클라이언트-서비스 사이의 통합 레이어로 쓰이는 경우 많음(Federation). [[testing]]에서 스키마 단위 계약 테스트가 자연. [[ai-coding-tools]]·[[claude-code]] 관점에서 스키마를 컨텍스트에 넣으면 정확한 쿼리 생성이 가능 — [[context-eng]]의 대표 응용. [[monitoring]]에서는 HTTP 엔드포인트가 하나라 operation별 메트릭을 구조화해야 함.

## en

GraphQL is **"an API query language that lets clients request exactly the shape of data they need."** Created at Facebook in 2012 and open-sourced in 2015, it spread as an answer to the mobile/web pain of stitching together dozens of endpoints for a single screen. Where [[rest]] ships fixed shapes per resource, GraphQL exposes *one endpoint* and the client picks the exact fields and nesting it wants.

At its core are a **schema** (type definitions) and **queries** (what you pull from the schema). The server provides resolver functions against the schema; the client issues SQL-like queries. **Subscriptions** (real-time), **mutations** (writes), and **introspection** (querying the schema itself) come as standard features. Apollo, Relay, and URQL are the representative client libraries.

### When to use
- **Mobile and varied clients** — fetch only the needed fields, saving bandwidth and battery
- **Nested related data** — a single screen needs "user + posts + comments + authors" at once
- **Schema-evolution-heavy domains** — additions and deprecations stay flexible
- **A unification layer over multiple microservices** — GraphQL Federation
- **[[ai-coding-tools]] + admin tooling** — exploratory queries are friendly targets for natural-language-to-GraphQL

### Common pitfalls
- **N+1 problem** — nested queries make one DB call per node. DataLoader batching + caching is mandatory
- **Excessively deep queries** — a malicious client can nest 20 levels deep and bomb the server. Depth limits, complexity analysis, query cost budgets
- **Auth logic scattered across resolvers** — per-field checks. Central layer is required for maintenance
- **Caching harder** — HTTP caching (GET-based) fits [[rest]] naturally; GraphQL is all POSTs. Apollo client or CDN-specific setups needed
- **Overconfidence in "fetch only what you need = fast"** — the server side gets more complex. Network saves but CPU can rise
- **Temptation to convert all APIs to GraphQL** — simple CRUD is still [[rest]]'s home. Both are tools, not ideologies
- **LLM queries nonexistent fields** — schema introspection first via [[context-eng]] is critical

### How it connects
One style of [[api]], complementary to [[rest]]. Often used as an integration layer between clients and microservices (Federation). Schema-level contract testing is natural in [[testing]]. From an [[ai-coding-tools]] / [[claude-code]] angle, injecting the schema into context lets accurate queries be generated — a textbook [[context-eng]] case. In [[monitoring]], a single HTTP endpoint means operation-level metrics must be structured explicitly.

## ja

GraphQLは**「クライアントが必要なデータの形を直接クエリで指定して受け取るAPIクエリ言語」**。2012年Facebook内で作られ2015年にオープンソース化、モバイル・Webアプリが「エンドポイント数十を組み合わせて一画面に表示する」負担を減らす答として広まった。[[rest]]がリソース単位で形が決まっているなら、GraphQLは*一つのエンドポイント*からクライアントが欲しいフィールド・ネストだけを取る。

核となるのは**スキーマ**(型定義)と**クエリ**(スキーマから抜き出す要求)。サーバーはスキーマに対するresolver関数を提供し、クライアントはSQL類似クエリで要求。おまけとして**subscription**(リアルタイムデータ)、**mutation**(書き込み)、**introspection**(スキーマ自体を問い合わせ)が標準で付く。Apollo、Relay、URQLが代表的クライアントライブラリ。

### いつ使うか
- **モバイル・多様なクライアント** — 必要なフィールドだけ受け取り帯域・バッテリーを節約
- **ネストした関係データ** — 一画面に「ユーザー + 投稿 + コメント + 作者」が同時に必要なとき
- **スキーマ進化が多いドメイン** — フィールド追加/deprecationが柔軟
- **複数マイクロサービス上の統合層** — GraphQL Federation
- **[[ai-coding-tools]] + 管理ツール** — 探索型クエリが自然言語 → GraphQL変換に親和

### はまりやすい罠
- **N+1問題** — ネストしたクエリ内でノードごとにDB呼び出しが爆発。DataLoaderでバッチ・キャッシュ必須
- **過度に深いクエリ** — 悪意あるクライアントが20階層のネスト要求 → サーバー爆撃。深さ制限・複雑度分析・クエリ費用予算
- **認証・認可をリゾルバに散らす** — フィールドごとに権限チェック。共通層で中央化しないと維持不能
- **キャッシュが難しい** — HTTPキャッシュ(GETベース)が自然な[[rest]]に対し、GraphQLはすべてPOST。ApolloクライアントやCDN特殊設定が必要
- **「必要なものだけ受け取って速い」への過信** — サーバー側はむしろ複雑。ネットワーク節約できてもサーバーCPUは増える
- **すべてのAPIをGraphQLに変える誘惑** — 単純CRUDは依然[[rest]]が良い。両方とも道具、イデオロギーではない
- **LLMが存在しないフィールドをクエリ** — スキーマintrospectionを先に問い合わせる[[context-eng]]必須

### 繋がり
[[api]]の一スタイルで[[rest]]の代替・補完。[[microservices]]でクライアントとサービス間の統合層として使われることが多い(Federation)。[[testing]]でスキーマ単位の契約テストが自然。[[ai-coding-tools]]・[[claude-code]]観点からスキーマをコンテキストに入れると正確なクエリ生成が可能 — [[context-eng]]の代表応用。[[monitoring]]ではHTTPエンドポイントが一つなのでoperation別メトリクスを構造化して出す必要がある。

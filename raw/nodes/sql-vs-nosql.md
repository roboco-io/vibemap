---
id: sql-vs-nosql
cat: data
size: 3
title:
  ko: SQL vs NoSQL
  en: SQL vs NoSQL
  ja: SQL vs NoSQL
refs:
  - url: https://aws.amazon.com/nosql/
    title: Relational vs Non-relational (AWS)
    lang: en
  - url: https://martinfowler.com/bliki/PolyglotPersistence.html
    title: Polyglot Persistence — Martin Fowler
    lang: en
extraEdges: []
---

## ko

SQL과 NoSQL 중 무엇을 고르느냐는 **"정합성 vs 확장성"의 트레이드오프가 아니라 "접근 패턴"의 문제**다. 둘 다 잘 쓰면 확장되고 일관성이 있다. 진짜 결정 요소는 "데이터를 어떻게 읽고 쓸 건가?" — 이게 스키마보다 먼저 정해져야 한다.

현실의 많은 시스템은 *둘 다 쓴다*. Martin Fowler가 이름 붙인 **polyglot persistence** — 용도별로 다른 저장소. 예: 사용자 프로필은 [[sql]] DB, 세션은 Redis([[memorydb]]), 검색은 Elasticsearch, 카탈로그는 [[dynamodb]]. "하나만 쓴다"는 제약이 오히려 비용이다.

### 결정 축
- **관계·조인이 본질적인가?** → [[sql]] (결제, 재고, 계정 관계)
- **키로만 꺼내 쓰면 충분한가?** → [[nosql]] 키-값 ([[dynamodb]])
- **스키마가 자주 변하는가?** → 문서 DB
- **대량 쓰기가 쏟아지는가?** → [[nosql]] 컬럼 패밀리나 이벤트 로그
- **ACID 트랜잭션 필요?** → [[sql]] 먼저 고려 (NoSQL도 지원하지만 범위 제한)
- **수평 확장이 제1 요구사항?** → [[nosql]]이 기본 유리, 최근엔 [[dsql]] 같은 분산 SQL도
- **팀 숙련도** — [[sql]]은 거의 모두 쓸 수 있음, [[nosql]]은 패턴별 학습 필요

### 흔한 오해
- **"NoSQL이 더 빠르다"** — 조건부. 특정 접근 패턴에 최적화된 NoSQL은 빠르지만, 범용 질의는 관계형이 낫다
- **"SQL은 확장 안 된다"** — 틀림. PostgreSQL 파티셔닝, Aurora, [[dsql]], Vitess 등 수평 확장 옵션 많음
- **"NoSQL은 스키마가 없다"** — 강제되지 않을 뿐, *암묵적* 스키마는 항상 있다
- **"둘을 섞으면 운영이 지옥"** — polyglot persistence가 일반적. 각자 역할 분담이 오히려 단순
- **"AI가 선택해준다"** — LLM은 패턴에 친숙한 선택을 제안하지만, 비즈니스 제약·[[cost]]·팀 역량은 모름. [[review-mindset]]으로 검증

### 체크리스트
- 1순위 쿼리 패턴 3개를 글로 쓴다 — 둘 다 만족시키면 양쪽 비교
- 예상 QPS·데이터 크기·동시 사용자 수를 추정 — 극단치가 결정을 바꾼다
- 트랜잭션 경계를 그려본다 — 다중 엔티티 원자성이 필요하면 관계형
- [[cost]] 모델을 뽑는다 — [[serverless]]와의 조합이면 [[dynamodb]]가 유리한 경우 많음
- 운영 팀 경험을 확인한다 — "가능한" 선택과 "지속 가능한" 선택은 다르다

### 연결
[[sql]]·[[nosql]]·[[db-basics]]의 통합 축. [[db-vs-dw]]와 다른 문제 — 여기는 모두 *operational* 선택. [[serverless]] 설계에서는 [[dynamodb]] 중심의 NoSQL이 많고, [[microservices]] 각 서비스마다 다른 DB를 고르는 polyglot 전략이 흔해졌다. [[cost]]·[[monitoring]] 관점에서 어느 쪽이든 처음부터 대시보드 연결이 필수.

## en

Choosing between SQL and NoSQL **isn't a "consistency vs scalability" trade-off — it's about access patterns**. Done well, both scale and both give consistency. The real deciding factor is "how will we read and write?" — which gets settled *before* schema.

Most real systems use *both*. Martin Fowler's **polyglot persistence** coins this — pick the store per use case. Example: user profiles in [[sql]], sessions in Redis ([[memorydb]]), search in Elasticsearch, catalogs in [[dynamodb]]. Constraining yourself to "just one" usually costs more than it saves.

### Decision axes
- **Are relations / joins essential?** → [[sql]] (payments, inventory, account graphs)
- **Is key lookup enough?** → [[nosql]] key-value ([[dynamodb]])
- **Does schema change often?** → document DB
- **Massive write volume?** → [[nosql]] column-family or event logs
- **ACID transactions required?** → [[sql]] first (NoSQL has it too, but scope-limited)
- **Horizontal scale is #1 requirement?** → [[nosql]] wins by default, though distributed SQL like [[dsql]] is closing the gap
- **Team expertise** — everyone knows [[sql]]; [[nosql]] requires pattern-specific learning

### Common misconceptions
- **"NoSQL is faster"** — conditional. NoSQL optimized for a specific access pattern is fast; for ad-hoc queries, relational wins
- **"SQL doesn't scale"** — false. PostgreSQL partitioning, Aurora, [[dsql]], Vitess all scale horizontally
- **"NoSQL has no schema"** — not enforced at write, but *implicit* schema always exists
- **"Mixing them is operational hell"** — polyglot persistence is routine; separation of concerns usually simplifies
- **"AI picks for me"** — LLMs suggest common-pattern picks but ignore business constraints, [[cost]], team capability. Verify via [[review-mindset]]

### Checklist
- Write out your top-3 query patterns — if one side covers all, it wins; otherwise compare directly
- Estimate QPS, data size, concurrent users — extremes change the answer
- Draw the transactional boundary — multi-entity atomicity pushes you to relational
- Model the [[cost]] — paired with [[serverless]], [[dynamodb]] often wins
- Check team experience — the "possible" and "sustainable" picks are different

### How it connects
The unifying axis of [[sql]], [[nosql]], and [[db-basics]]. A different problem from [[db-vs-dw]] — all operational choices here. In [[serverless]] designs, NoSQL centered on [[dynamodb]] dominates; in [[microservices]], the polyglot strategy (per-service DB choice) is common. From [[cost]] and [[monitoring]] perspectives, either choice needs dashboard wiring from the start.

## ja

SQLとNoSQLの選択は**「整合性 vs スケーラビリティ」のトレードオフではなく「アクセスパターン」の問題**。どちらもうまく使えばスケールするし整合性を持つ。本当の決定要素は「データをどう読み書きするか?」 — これがスキーマより先に決まらなければならない。

現実の多くのシステムは*両方使う*。Martin Fowlerが名付けた**polyglot persistence** — 用途別に違うストア。例: ユーザープロファイルは[[sql]] DB、セッションはRedis([[memorydb]])、検索はElasticsearch、カタログは[[dynamodb]]。「一つだけ」という制約がむしろコストになる。

### 決定軸
- **関係・JOINが本質か?** → [[sql]](決済・在庫・アカウント関係)
- **キーだけで取り出せば十分か?** → [[nosql]]キー値([[dynamodb]])
- **スキーマが頻繁に変わるか?** → ドキュメントDB
- **大量書き込みが押し寄せるか?** → [[nosql]]カラムファミリーやイベントログ
- **ACIDトランザクションが必要?** → [[sql]]を先に検討(NoSQLも対応するが範囲限定)
- **水平拡張が第一要件?** → [[nosql]]が既定有利、最近は[[dsql]]のような分散SQLも
- **チームの習熟度** — [[sql]]はほぼ全員使える、[[nosql]]はパターン別学習が必要

### よくある誤解
- **「NoSQLの方が速い」** — 条件次第。特定アクセスパターンに最適化されたNoSQLは速いが、汎用クエリは関係型が勝つ
- **「SQLはスケールしない」** — 誤り。PostgreSQLパーティショニング、Aurora、[[dsql]]、Vitessなど水平拡張手段多数
- **「NoSQLはスキーマがない」** — 書き込み時強制されないだけ、*暗黙の*スキーマは常に存在する
- **「両方混ぜると運用地獄」** — polyglot persistenceは一般的。役割分担の方が運用が単純になる
- **「AIが選んでくれる」** — LLMはパターン親和的な選択を提案するが、ビジネス制約・[[cost]]・チーム能力は知らない。[[review-mindset]]で検証

### チェックリスト
- 1位のクエリパターン3つを文字に書く — 一方が全てカバーすれば勝ち、そうでなければ両方比較
- QPS・データ量・同時利用者数を推定 — 極端値が答を変える
- トランザクション境界を描く — マルチエンティティ原子性が必要なら関係型
- [[cost]]モデルを出す — [[serverless]]と組むなら[[dynamodb]]が有利なことが多い
- 運用チームの経験を確認 — 「可能な」選択と「持続可能な」選択は違う

### 繋がり
[[sql]]・[[nosql]]・[[db-basics]]の統合軸。[[db-vs-dw]]とは別問題 — ここはすべて*operational*選択。[[serverless]]設計では[[dynamodb]]中心のNoSQLが多く、[[microservices]]では各サービスごとに違うDBを選ぶpolyglot戦略が一般的。[[cost]]・[[monitoring]]観点ではどちらを選んでも初日からダッシュボード接続が必須。

---
id: nosql
cat: data
size: 3
title:
  ko: NoSQL
  en: NoSQL
  ja: NoSQL
refs:
  - url: https://en.wikipedia.org/wiki/NoSQL
    title: NoSQL (Wikipedia)
    lang: en
  - url: https://aws.amazon.com/nosql/
    title: What is NoSQL? (AWS)
    lang: en
  - url: https://jepsen.io/
    title: Jepsen — distributed systems safety analysis
    lang: en
extraEdges: []
---

## ko

NoSQL은 **"관계형이 아닌 DB들의 모음"**이다. 하나의 기술이 아니라 우산 용어 — 공통점은 "고정된 테이블 스키마 없이 유연한 구조로 저장한다"는 정도. 2000년대 중반 웹 규모 서비스(Amazon DynamoDB 논문 2007, Google BigTable 2006)가 "관계형으론 수평 확장이 어렵다"는 한계에 부딪히며 개화했다. "Not Only SQL"이라 해석하는 편이 오늘날 맥락에 더 맞다.

네 가지 주요 형태. **키-값**: 해시맵처럼 키로 O(1) 접근 (DynamoDB, Redis). **문서**: JSON 유사 객체를 그대로 저장·질의 (MongoDB, CouchDB). **컬럼 패밀리**: 행마다 컬럼 집합이 달라도 됨, 시계열·쓰기 폭주에 강함 (Cassandra, HBase). **그래프**: 엔티티 간 관계가 1급 시민 (Neo4j, Neptune). 고르는 기준은 *접근 패턴* — "어떻게 읽고 쓸지"가 스키마보다 먼저 결정.

### 언제 쓰나
- **세션·캐시·레이트리미터** → Redis ([[memorydb]])
- **카탈로그·사용자 프로필·주문** → [[dynamodb]]·Mongo (수평 확장, 단순 쿼리)
- **시계열·이벤트 로그** → Cassandra·TimescaleDB·InfluxDB
- **소셜 그래프·지식 그래프·추천** → 그래프 DB
- **[[serverless]] + 높은 쓰기 처리량** → [[dynamodb]]가 사실상 표준

### 쉽게 빠지는 함정
- **관계형 습관으로 접근** — 조인을 NoSQL에서 쓰려 하면 성능 박살. *비정규화*와 *접근 패턴 설계*가 기본기
- **트랜잭션 가정** — 많은 NoSQL이 제한된 트랜잭션만 지원. 멀티 엔티티 원자성 필요하면 설계부터 다시
- **일관성 모델 오해** — "최종 일관성"은 "곧바로 읽으면 옛 값을 볼 수 있다"는 뜻. 결제·재고는 강한 일관성 필요
- **키 설계 실수로 핫 파티션** — [[dynamodb]]에서 유저ID로 파티션하는데 한 유저가 80% 트래픽 유발하면 한 샤드가 죽음
- **[[cost]] 모델이 다름** — 읽기/쓰기 유닛, 스토리지, 글로벌 테이블 전송 등. 관계형 가격 감각으로 예측하면 청구서 깜짝
- **LLM이 "NoSQL이니까 뭐든 저장 가능"이라 오답** — 스키마가 없는 게 아니라 *강제되지 않을* 뿐. 설계 안 하면 결국 쓰레기장

### 연결
[[db-basics]]의 한 축, [[sql]]과의 쌍. [[sql-vs-nosql]]이 선택 기준을 정리한다. AWS에서는 [[dynamodb]]·[[memorydb]]가 핵심 매니지드 옵션. [[serverless]] 앱과는 특히 잘 맞는다 — 커넥션 풀 문제가 없고, 수평 확장이 투명. [[datalake]]·[[dw]]와는 역할이 다른 축 — NoSQL은 여전히 *operational*, 분석은 별도.

## en

NoSQL is **"the set of databases that aren't relational."** It's an umbrella term, not a single technology — the shared trait is roughly "store data without a fixed table schema." The category matured in the mid-2000s as web-scale services (Amazon Dynamo paper 2007, Google BigTable 2006) hit horizontal-scaling limits of relational systems. "Not Only SQL" is the modern reading.

Four major shapes. **Key-value**: O(1) access by key like a hashmap (DynamoDB, Redis). **Document**: store and query JSON-like objects directly (MongoDB, CouchDB). **Column-family**: rows can have different column sets — strong for time-series and write-heavy loads (Cassandra, HBase). **Graph**: entity relationships are first-class (Neo4j, Neptune). The decisive criterion is *access pattern* — "how will we read and write?" decides the shape, before schema.

### When to use
- **Session, cache, rate-limiter** → Redis ([[memorydb]])
- **Catalogs, user profiles, orders** → [[dynamodb]], Mongo (horizontal scale, simple queries)
- **Time-series, event logs** → Cassandra, TimescaleDB, InfluxDB
- **Social graphs, knowledge graphs, recommendations** → graph DBs
- **[[serverless]] + high write throughput** → [[dynamodb]] is effectively the default

### Common pitfalls
- **Relational habits** — forcing joins onto NoSQL tanks performance. *Denormalization* and *access-pattern-first design* are the fundamentals
- **Assuming transactions** — many NoSQL systems only offer limited transactions. Multi-entity atomicity requires design reconsideration
- **Misreading consistency** — "eventual consistency" means "immediate reads may see stale values." Strong consistency is required for payments, inventory
- **Key design → hot partition** — in [[dynamodb]], partitioning by user-id when one user drives 80% of traffic kills a shard
- **[[cost]] model differs** — read/write units, storage, global-table replication. Relational pricing instincts mis-predict the bill
- **LLM says "NoSQL means any structure works"** — schema isn't enforced, but still exists. Without design it becomes a landfill

### How it connects
A branch under [[db-basics]] and the counterpart of [[sql]]. [[sql-vs-nosql]] frames the decision. In AWS, [[dynamodb]] and [[memorydb]] are the key managed options. Fits [[serverless]] particularly well — no connection pooling issues, transparent horizontal scaling. Distinct axis from [[datalake]] and [[dw]] — NoSQL is still *operational*; analytics goes elsewhere.

## ja

NoSQLは**「関係型ではないDBの総称」**。単一技術ではなく傘概念 — 共通点はせいぜい「固定テーブルスキーマなしに柔軟な構造で保存する」こと。2000年代半ばにWebスケールサービス(Amazon Dynamo論文2007、Google BigTable 2006)が「関係型では水平拡張が難しい」という限界に突き当たって花開いた。「Not Only SQL」と解釈する方が今日の文脈に合う。

主要四形態。**キー値**: ハッシュマップのようにキーでO(1)アクセス(DynamoDB、Redis)。**ドキュメント**: JSON類似オブジェクトをそのまま保存・問い合わせ(MongoDB、CouchDB)。**カラムファミリー**: 行ごとにカラムセットが違ってもよく、時系列・書き込み集中に強い(Cassandra、HBase)。**グラフ**: エンティティ間の関係が第一級(Neo4j、Neptune)。選ぶ基準は*アクセスパターン* — 「どう読み書きするか」がスキーマより先に決まる。

### いつ使うか
- **セッション・キャッシュ・レートリミッタ** → Redis([[memorydb]])
- **カタログ・ユーザープロファイル・注文** → [[dynamodb]]・Mongo(水平拡張、単純クエリ)
- **時系列・イベントログ** → Cassandra・TimescaleDB・InfluxDB
- **ソーシャルグラフ・知識グラフ・推薦** → グラフDB
- **[[serverless]] + 高書き込みスループット** → [[dynamodb]]が事実上の標準

### はまりやすい罠
- **関係型の習慣** — NoSQLでJOINを無理に使うと性能が粉砕。*非正規化*と*アクセスパターン優先設計*が基本
- **トランザクションの前提** — 多くのNoSQLは限定的トランザクションのみ。マルチエンティティ原子性が必要なら設計再考
- **一貫性モデルの誤解** — 「結果整合性」は「即読みは古い値が見える可能性あり」という意味。決済・在庫は強一貫性が必要
- **キー設計ミスでホットパーティション** — [[dynamodb]]でユーザーIDでパーティションし、一人が80%のトラフィックを発生させるとシャードが死ぬ
- **[[cost]]モデルが違う** — 読み書きユニット、ストレージ、グローバルテーブル転送など。関係型の価格感覚で予測すると請求書でびっくり
- **LLMが「NoSQLだから何でも保存できる」と誤答** — スキーマがないのではなく*強制されない*だけ。設計なしではゴミ捨て場になる

### 繋がり
[[db-basics]]の一枝、[[sql]]の対。[[sql-vs-nosql]]が選択基準を整理する。AWSでは[[dynamodb]]・[[memorydb]]が主要マネージドオプション。[[serverless]]と特に相性が良い — コネクションプール問題がなく、水平拡張が透明。[[datalake]]・[[dw]]とは役割が違う軸 — NoSQLも依然*operational*、分析は別に。

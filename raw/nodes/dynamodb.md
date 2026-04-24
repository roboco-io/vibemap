---
id: dynamodb
cat: ops
size: 3
title:
  ko: DynamoDB
  en: DynamoDB
  ja: DynamoDB
refs:
  - url: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html
    title: What is DynamoDB? (AWS Docs)
    lang: en
  - url: https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf
    title: Dynamo — Amazon's Highly Available Key-value Store (2007)
    lang: en
  - url: https://www.dynamodbbook.com/
    title: The DynamoDB Book — Alex DeBrie
    lang: en
extraEdges: []
---

## ko

DynamoDB는 **AWS의 완전 관리형 NoSQL 키-값·문서 DB**다. 2007년 Amazon의 Dynamo 논문에서 출발해 2012년 서비스로 공개됐고, 지금은 AWS에서 [[serverless]] 아키텍처의 사실상 표준 저장소다. 핵심 약속 셋: **한 자리수 밀리초 지연**(어떤 규모에서도), **무한 수평 확장**(파티션 자동 분할), **운영 부담 0**(백업·패치·복제 자동).

데이터 모델은 "파티션 키 + 정렬 키"로 찾는 테이블. [[sql]]의 JOIN 같은 건 없다 — 대신 **접근 패턴을 먼저 설계**하고 그에 맞는 키를 짠다. Alex DeBrie의 "DynamoDB Book"이 이 사고 방식의 교본. 단일 테이블 디자인, GSI(Global Secondary Index), 트랜잭션(제한적), 스트림(변경 이벤트) 같은 기능들이 얹힌다.

### 언제 쓰나
- [[serverless]] 백엔드 기본값 — [[lambda]]와 짝 맞음 (커넥션 풀 문제 없음, 요청당 과금 친화)
- 단일 엔티티의 빠른 키 조회 — 사용자 프로필, 세션, 카탈로그 상품
- 높은 쓰기 처리량 — 실시간 스코어, 이벤트 로그, 레이트 리미팅
- 예측 불가한 트래픽 스파이크 — on-demand 과금으로 급증 대응
- **[[microservices]]에서 각 서비스의 저장소** — polyglot persistence의 한 블록

### 쉽게 빠지는 함정
- **관계형 사고로 접근** — JOIN 없음, 트랜잭션 제한적. 접근 패턴부터 정하고 역산해 키 설계
- **스캔 남발** — `Scan`은 전체 테이블 읽기. [[cost]]도 성능도 재앙. 항상 `Query` 또는 GSI
- **핫 파티션** — 파티션 키 선택이 나쁘면 특정 키에 트래픽 집중 → 스로틀링
- **on-demand vs provisioned 혼동** — 트래픽이 스파이키면 on-demand, 안정적이면 provisioned. 잘못 고르면 2~3배 비용
- **TTL 설정 미흡** — 세션·캐시 엔트리가 영원히 남으면 스토리지·[[cost]] 증가. TTL 컬럼 필수
- **백업·PITR 미설정** — 실수로 삭제하면 복구 어려움. Point-in-Time Recovery를 기본 ON
- **GSI 남발** — GSI마다 쓰기 비용 2배. 3개 넘어가면 설계 재검토

### 고급 기능
- **DynamoDB Streams** — 변경 이벤트를 [[lambda]]로 실시간 처리
- **Global Tables** — 멀티리전 자동 복제 (최종 일관성)
- **TTL** — 만료 시간에 자동 삭제
- **PartiQL** — SQL 유사 쿼리 (내부는 여전히 Query/Scan)

### 연결
[[serverless]]·[[lambda]]·[[apigw]]와 함께 AWS 서버리스 4종 세트. [[nosql]]의 대표 AWS 구현체. [[dsql]]이 "서버리스 SQL"이라면 DynamoDB는 "서버리스 NoSQL". [[cost]] 관점에서 트래픽 패턴에 따라 최적 과금 모드가 달라지므로 [[monitoring]]으로 추적 필수. [[microservices]] 아키텍처에서 각 서비스가 독립 DB를 가질 때 자주 선택.

## en

DynamoDB is **AWS's fully managed NoSQL key-value and document database**. It traces to Amazon's 2007 Dynamo paper, launched as a service in 2012, and is now the de facto default storage layer for [[serverless]] architectures on AWS. Three core promises: **single-digit millisecond latency** at any scale, **limitless horizontal scale** through automatic partitioning, and **zero operational overhead** — backup, patching, and replication are all handled.

The data model is tables accessed via "partition key + sort key." No JOINs like [[sql]] — instead, **design access patterns first**, then choose keys to match. Alex DeBrie's *DynamoDB Book* is the canonical guide to that mindset. Single-table design, GSIs (Global Secondary Indexes), limited transactions, and Streams (change events) layer on top.

### When to use
- The default for [[serverless]] backends — pairs with [[lambda]] (no connection pool issue, per-request billing friendly)
- Fast key lookups on single entities — user profiles, sessions, catalogs
- High write throughput — real-time scores, event logs, rate limiting
- Unpredictable traffic spikes — on-demand billing absorbs surges
- **Per-service storage in [[microservices]]** — a block of polyglot persistence

### Common pitfalls
- **Relational thinking** — no JOINs, limited transactions. Decide access patterns first, then back-derive keys
- **Scan overuse** — `Scan` reads the whole table, disastrous for [[cost]] and performance. Always `Query` or use a GSI
- **Hot partitions** — a bad partition key concentrates traffic on one key → throttling
- **On-demand vs provisioned confusion** — spiky traffic → on-demand; stable → provisioned. Wrong pick costs 2–3×
- **Missing TTL** — session / cache rows living forever bloat storage and [[cost]]. TTL column is mandatory
- **Skipping backup / PITR** — accidental delete is hard to undo. Keep Point-in-Time Recovery on by default
- **GSI bloat** — each GSI doubles write cost. More than 3 means rethinking the design

### Advanced features
- **DynamoDB Streams** — change events consumed by [[lambda]] in real time
- **Global Tables** — multi-region automatic replication (eventually consistent)
- **TTL** — automatic deletion at expiration
- **PartiQL** — SQL-like queries (internally still Query / Scan)

### How it connects
With [[serverless]], [[lambda]], [[apigw]], part of the AWS serverless quartet. The flagship AWS implementation of [[nosql]]. If [[dsql]] is "serverless SQL," DynamoDB is "serverless NoSQL." From a [[cost]] perspective the optimal billing mode depends on traffic, so track via [[monitoring]]. Widely chosen in [[microservices]] where each service owns its DB.

## ja

DynamoDBは**AWSのフルマネージドNoSQLキー値・ドキュメントDB**。2007年のAmazon Dynamo論文に発し、2012年にサービスとして公開され、今や[[serverless]]アーキテクチャの事実上既定ストレージだ。核となる約束三つ: **一桁ミリ秒の遅延**(どの規模でも)、**無限水平拡張**(パーティション自動分割)、**運用負荷ゼロ**(バックアップ・パッチ・複製が自動)。

データモデルは「パーティションキー + ソートキー」でアクセスするテーブル。[[sql]]のようなJOINはない — 代わりに**アクセスパターンを先に設計**し、それに合うキーを組む。Alex DeBrieの"DynamoDB Book"がこの考え方の教科書。シングルテーブル設計、GSI(Global Secondary Index)、限定的トランザクション、Streams(変更イベント)が上に乗る。

### いつ使うか
- [[serverless]]バックエンドの既定値 — [[lambda]]と相性良い(コネクションプール問題なし、リクエスト課金親和)
- 単一エンティティの高速キー照会 — ユーザープロファイル、セッション、カタログ商品
- 高書き込みスループット — リアルタイムスコア、イベントログ、レートリミッティング
- 予測困難なトラフィックスパイク — on-demand課金が急増を吸収
- **[[microservices]]での各サービスのストレージ** — polyglot persistenceの一ブロック

### はまりやすい罠
- **関係型の発想でアクセス** — JOINなし、トランザクション限定的。アクセスパターンから決めて逆算してキー設計
- **Scan濫用** — `Scan`は全テーブル読み。[[cost]]も性能も災害。常に`Query`かGSIを使う
- **ホットパーティション** — パーティションキー選択が悪いと特定キーにトラフィック集中 → スロットリング
- **on-demand vs provisioned混同** — スパイキーならon-demand、安定ならprovisioned。誤選択で2〜3倍コスト
- **TTL設定不足** — セッション・キャッシュ行が永久に残るとストレージ・[[cost]]が増える。TTLカラム必須
- **バックアップ・PITR未設定** — 誤削除は復旧困難。Point-in-Time Recoveryを既定ONに
- **GSI乱発** — GSI毎に書き込みコスト2倍。3つ超えは設計再検討

### 高度機能
- **DynamoDB Streams** — 変更イベントを[[lambda]]でリアルタイム処理
- **Global Tables** — マルチリージョン自動複製(結果整合)
- **TTL** — 期限時に自動削除
- **PartiQL** — SQL類似クエリ(内部は依然Query/Scan)

### 繋がり
[[serverless]]・[[lambda]]・[[apigw]]と共にAWSサーバーレス四種の神器。[[nosql]]の代表的AWS実装。[[dsql]]が「サーバーレスSQL」なら、DynamoDBは「サーバーレスNoSQL」。[[cost]]観点ではトラフィックパターンで最適課金モードが変わるため[[monitoring]]で追跡必須。[[microservices]]で各サービスが独立DBを持つときによく選ばれる。

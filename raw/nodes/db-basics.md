---
id: db-basics
cat: data
size: 2
title:
  ko: DB 기초
  en: Database Basics
  ja: DB基礎
refs:
  - url: https://en.wikipedia.org/wiki/Database
    title: Database (Wikipedia)
    lang: en
  - url: https://use-the-index-luke.com/
    title: Use The Index, Luke — a guide to SQL performance
    lang: en
extraEdges: []
---

## ko

데이터베이스는 **"데이터를 구조적으로 저장하고 *안전하게* 꺼내 쓸 수 있게 해주는 소프트웨어"**다. 파일에 `user1,김,서울`을 줄줄이 쓰는 것과의 차이는 셋: **동시성**(여러 명이 동시에 읽고 쓸 때 깨지지 않음), **쿼리**(원하는 데이터를 조건으로 골라냄), **내구성**(전원이 꺼져도 쓴 건 남아 있음). 이 셋이 파일 시스템과의 결정적 구분선이다.

크게 두 진영으로 나뉜다. **관계형**(RDBMS) — [[sql]]로 질의하고, 테이블·행·열 구조, ACID 트랜잭션. PostgreSQL, MySQL, SQL Server, Oracle이 대표. **비관계형(NoSQL)** — 용도별 다양. 키-값([[dynamodb]]·Redis), 문서(MongoDB), 그래프(Neo4j), 시계열(InfluxDB). 어느 한쪽이 "더 나은" 게 아니라 *문제에 맞는 모양*이 다르다 — [[sql-vs-nosql]]이 이 결정을 정리한다.

### 언제 어떤 걸
- **관계형이 기본값** — 스키마 변화가 적고 정합성이 중요하면 [[sql]]부터
- **키로 접근하는 빠른 조회·높은 쓰기 부하** → 키-값([[dynamodb]])
- **반구조화된 문서·다양한 필드** → 문서 DB
- **분석·집계가 주목적** → [[dw]]·[[datalake]]로 분리
- **실시간 이벤트 스트림** → [[kinesis]]·Kafka + 저장은 별도 DB

### 쉽게 빠지는 함정
- **N+1 쿼리** — 목록 1회 + 각 항목마다 1회 쿼리가 터지면 1000건에 1001 쿼리. 조인·eager loading로 해결
- **인덱스 없이 `WHERE`** — 테이블 10만 행 넘으면 풀스캔이 악몽. 자주 걸리는 컬럼에 인덱스
- **[[hallucination]] 없이 스키마 AI 생성** — LLM이 "그럴듯한 스키마"를 주지만 제약·인덱스·관계가 엉망. [[review-mindset]]로 검토
- **모든 걸 한 DB에** — 검색·분석·캐시를 한 곳에 밀어 넣으면 성능이 꺾인다. 용도별 분리
- **커넥션 풀 미관리** — [[serverless]] 환경에서 특히 위험. [[lambda]] 각 인스턴스가 DB에 연결을 만들면 DB가 먼저 죽음
- **[[cost]] 각성 지연** — 클라우드 DB는 IOPS·스토리지·전송으로 가끔 폭탄. 초기부터 [[monitoring]]

### 연결
[[sql]]·[[nosql]]·[[sql-vs-nosql]]·[[db-vs-dw]]의 부모 개념. [[dw]]([[datalake]])와는 다른 축 — DB는 *operational*, DW는 *analytical*. [[dynamodb]]·[[dsql]]·[[memorydb]] 같은 AWS 서비스들의 선택 맥락을 제공. [[serverless]] 앱에서는 DB 선택이 아키텍처의 가장 큰 결정 중 하나.

## en

A database is **"software that stores data in structure and lets you retrieve it safely."** The difference from dumping `user1,Kim,Seoul` lines into a file comes down to three things: **concurrency** (multiple clients reading/writing without corruption), **querying** (select data by conditions), **durability** (what you wrote is still there after power loss). Those three mark the line between databases and filesystems.

Two camps split the space. **Relational** (RDBMS) — query via [[sql]], tables/rows/columns, ACID transactions. PostgreSQL, MySQL, SQL Server, Oracle are the big names. **Non-relational (NoSQL)** — varies by use case: key-value ([[dynamodb]], Redis), document (MongoDB), graph (Neo4j), time-series (InfluxDB). Neither is "better" — they're *shapes matched to problems*. [[sql-vs-nosql]] frames that choice.

### Which when
- **Relational as default** — low-churn schema and consistency matters → start with [[sql]]
- **Fast key lookups, heavy write throughput** → key-value ([[dynamodb]])
- **Semi-structured documents, varying fields** → document DB
- **Analytics, aggregation as primary** → split into [[dw]] / [[datalake]]
- **Real-time event streams** → [[kinesis]] / Kafka, with storage separate

### Common pitfalls
- **N+1 queries** — one list query plus one per item explodes to 1001 queries for 1000 rows. Fix with joins or eager loading
- **`WHERE` without an index** — once past 100K rows, full scans become nightmares. Index frequently-filtered columns
- **AI-generated schemas without [[review-mindset]]** — LLMs produce plausible-looking schemas with broken constraints, indexes, and relations
- **Everything in one DB** — pushing search, analytics, and cache into one database eventually breaks performance. Separate by purpose
- **Connection pool neglect** — especially dangerous under [[serverless]]. Each [[lambda]] instance opening its own connection can kill the DB first
- **[[cost]] awareness delayed** — cloud databases surprise you via IOPS, storage, and transfer. Wire [[monitoring]] from day one

### How it connects
The parent of [[sql]], [[nosql]], [[sql-vs-nosql]], [[db-vs-dw]]. Distinct from [[dw]] / [[datalake]] — databases are *operational*; warehouses are *analytical*. Provides the decision context for AWS choices like [[dynamodb]], [[dsql]], [[memorydb]]. In [[serverless]] apps, DB choice is usually the biggest architectural decision.

## ja

データベースは**「データを構造化して保存し、*安全に*取り出せるソフトウェア」**。ファイルに`user1,金,ソウル`と並べて書くのとの違いは三つ: **並行性**(複数クライアントが同時に読み書きしても壊れない)、**クエリ**(条件で必要なデータだけ選ぶ)、**永続性**(電源が落ちても書いたものは残る)。この三つがファイルシステムとの決定的境界線。

大きく二陣営に分かれる。**関係型**(RDBMS) — [[sql]]でクエリ、テーブル・行・列構造、ACIDトランザクション。PostgreSQL、MySQL、SQL Server、Oracleが代表。**非関係型(NoSQL)** — 用途別に多様。キー値([[dynamodb]]・Redis)、ドキュメント(MongoDB)、グラフ(Neo4j)、時系列(InfluxDB)。どちらが「良い」ではなく*問題に合う形*が違う — [[sql-vs-nosql]]がこの判断を整理する。

### どれをいつ
- **関係型が既定値** — スキーマ変動が少なく整合性が重要なら[[sql]]から
- **キーで高速照会・高い書き込み負荷** → キー値([[dynamodb]])
- **半構造化ドキュメント・多様なフィールド** → ドキュメントDB
- **分析・集計が主目的** → [[dw]]・[[datalake]]に分離
- **リアルタイムイベントストリーム** → [[kinesis]]・Kafkaと保存は別

### はまりやすい罠
- **N+1クエリ** — リストを1回取って各項目ごとに1回追加クエリすれば1000件で1001クエリに。JOINやeager loadingで解決
- **インデックスなしの`WHERE`** — 10万行を超えればフルスキャンが悪夢。頻出フィルタカラムにインデックス
- **[[review-mindset]]なしでAIがスキーマ生成** — LLMが「もっともらしいスキーマ」を出すが制約・インデックス・関係が壊れている
- **全部一つのDBに** — 検索・分析・キャッシュを一箇所に詰めると性能が折れる。用途別に分ける
- **コネクションプール未管理** — [[serverless]]環境で特に危険。[[lambda]]各インスタンスが接続を作るとDBが先に死ぬ
- **[[cost]]の覚醒遅れ** — クラウドDBはIOPS・ストレージ・転送で急に爆弾。[[monitoring]]を初日から

### 繋がり
[[sql]]・[[nosql]]・[[sql-vs-nosql]]・[[db-vs-dw]]の親概念。[[dw]]([[datalake]])とは別軸 — DBは*operational*、DWは*analytical*。[[dynamodb]]・[[dsql]]・[[memorydb]]のようなAWSサービス選択の文脈を提供する。[[serverless]]アプリではDB選択がアーキテクチャの最大の判断の一つ。

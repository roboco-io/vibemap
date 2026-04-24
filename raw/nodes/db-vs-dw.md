---
id: db-vs-dw
cat: data
size: 3
title:
  ko: DB vs DW
  en: DB vs DW
  ja: DB vs DW
refs:
  - url: https://aws.amazon.com/compare/the-difference-between-a-data-warehouse-and-a-database/
    title: Database vs Data Warehouse (AWS)
    lang: en
  - url: https://en.wikipedia.org/wiki/Online_transaction_processing
    title: Online transaction processing (Wikipedia)
    lang: en
extraEdges: []
---

## ko

DB([[db-basics]])와 DW([[dw]])는 같은 "데이터 저장"처럼 보이지만 **목적이 정반대**다. DB는 *지금 일어나는 일*을 빨리 처리하기 위해 존재하고(OLTP, Online Transaction Processing), DW는 *과거의 누적*을 빨리 질의하기 위해 존재한다(OLAP, Online Analytical Processing). 한 문장 요약: **DB는 거래, DW는 질문**.

구조도 그에 맞춰 다르다. DB는 **행 저장**(한 거래가 한 행 전체 쓰기 최적), DW는 **열 저장**(수백만 행의 특정 칼럼만 읽는 집계 최적). DB는 동시 거래 수천, DW는 복잡한 분석 쿼리 수십. DB는 정규화(중복 제거), DW는 비정규화(조인 최소화, 빠른 읽기). 같은 회사의 데이터가 두 시스템에 각각 다른 모양으로 있는 게 정상이다.

### 축별 비교
- **작업 단위**: DB는 수 밀리초의 단일 거래 / DW는 수초~수분의 분석 쿼리
- **데이터 변경**: DB는 UPDATE·DELETE 잦음 / DW는 거의 INSERT만(append-only)
- **스키마**: DB는 정규화·3NF / DW는 스타 스키마·비정규화
- **동시 사용자**: DB는 수천 / DW는 수십~수백 (분석가)
- **데이터 양**: DB는 GB~TB / DW는 TB~PB
- **과금**: DB는 상시 인스턴스 / DW는 쿼리당·컴퓨팅당 (Snowflake·BigQuery)
- **기술 예**: DB = PostgreSQL·[[dynamodb]]·[[dsql]] / DW = Redshift·Snowflake·BigQuery

### 흔한 오해
- **"DW가 DB의 상위 호환"** — 아님. 운영 거래 처리에 DW는 부적합 (지연이 큼)
- **"DW 대신 DB에서 분석하면 되지"** — 처음엔 되지만 데이터 커지면 운영 성능이 무너짐. 별도 분리가 기본
- **"[[datalake]]면 DW 필요 없지"** — 역할이 다름. Lake는 raw·비정형, DW는 큐레이션된 정형. 보통 함께 씀
- **"실시간 대시보드는 DW로"** — DW는 대개 분~시간 지연. 실시간엔 [[kinesis]] + Materialized View
- **"복제만 해두면 분석 DB"** — 복제본은 여전히 운영 구조. 집계 쿼리 성능은 제대로 안 나옴

### 둘을 잇는 파이프라인
- **ETL/ELT**: 운영 DB → DW. 보통 밤에 배치, 또는 CDC(Change Data Capture)로 실시간
- **[[datalake]] 경유**: OLTP DB → 이벤트 → [[s3]] → [[glue]] ETL → [[dw]] 또는 [[athena]] 직접
- **dbt**: DW 내부에서 SQL로 변환을 관리, 버저닝
- **[[aiops]]·[[llmops]] 관찰 지표** 상당수가 이 파이프라인의 끝단에 달림

### 연결
[[db-basics]]와 [[dw]]의 비교 축. [[datalake]]를 추가하면 "3단 아키텍처"로 확장 — 운영(DB) / 원본 저장(Lake) / 정제 분석(DW). [[serverless]] 앱에서는 [[dynamodb]] + [[s3]] + [[athena]] 조합이 경량 DW 대체로 흔함. [[cost]] 설계에서 "거래 과금 vs 쿼리 과금" 구분이 중요하다.

## en

A database ([[db-basics]]) and a data warehouse ([[dw]]) look alike — both "store data" — but their purposes are **opposite**. A DB exists to handle *what's happening right now* quickly (OLTP, Online Transaction Processing). A DW exists to query *accumulated history* quickly (OLAP, Online Analytical Processing). One-line summary: **DBs do transactions, DWs answer questions**.

Structure follows purpose. DBs use **row storage** (optimized for writing whole rows per transaction); DWs use **column storage** (optimized for reading one column across millions of rows). DBs: thousands of concurrent transactions; DWs: tens of complex analytical queries. DBs normalize (eliminate duplication); DWs denormalize (minimize joins, fast reads). The same company's data *legitimately* lives in both systems in different shapes.

### Axis-by-axis
- **Unit of work**: DB is a millisecond transaction / DW is a second-to-minute analytical query
- **Data mutation**: DB sees frequent UPDATE/DELETE / DW is mostly INSERT (append-only)
- **Schema**: DB normalizes (3NF) / DW denormalizes (star schema)
- **Concurrency**: DB thousands / DW tens to hundreds (analysts)
- **Volume**: DB GB–TB / DW TB–PB
- **Pricing**: DB per instance / DW per query / per compute (Snowflake, BigQuery)
- **Examples**: DB = PostgreSQL, [[dynamodb]], [[dsql]] / DW = Redshift, Snowflake, BigQuery

### Common misconceptions
- **"DW is DB's upgrade"** — no. A DW is unfit for operational transaction processing (latency)
- **"Analyze in the DB instead"** — works initially; once data grows, operational performance collapses
- **"With a [[datalake]], who needs a DW?"** — different roles. Lakes hold raw/unstructured; DWs hold curated structured. Usually both
- **"Real-time dashboards on the DW"** — DWs lag by minutes to hours. Real-time needs [[kinesis]] + materialized views
- **"A replica is my analytics DB"** — replicas still carry operational schema; aggregate performance suffers

### Linking pipelines
- **ETL/ELT**: operational DB → DW. Usually nightly batch, or CDC (Change Data Capture) for near-real-time
- **Via a [[datalake]]**: OLTP DB → events → [[s3]] → [[glue]] ETL → [[dw]] or directly queried by [[athena]]
- **dbt**: manages transformations inside the DW with SQL and versioning
- Many [[aiops]] / [[llmops]] observability metrics sit at the end of this pipeline

### How it connects
The comparison axis between [[db-basics]] and [[dw]]. Adding [[datalake]] extends it to a "three-tier architecture" — operational (DB) / raw storage (Lake) / curated analytics (DW). In [[serverless]] apps, [[dynamodb]] + [[s3]] + [[athena]] often replaces a lightweight DW. In [[cost]] design, "priced-by-transaction vs priced-by-query" distinction matters.

## ja

DB([[db-basics]])とDW([[dw]])は同じ「データ保存」に見えるが**目的が正反対**だ。DBは*今起きていること*を速く処理するため(OLTP、Online Transaction Processing)、DWは*過去の累積*を速く問い合わせるため(OLAP、Online Analytical Processing)。一行要約: **DBは取引、DWは質問**。

構造もそれに合わせて違う。DBは**行ストレージ**(一取引が一行全体を書き込むのに最適)、DWは**列ストレージ**(数百万行の特定カラムだけ読む集計に最適)。DBは同時取引数千、DWは複雑な分析クエリ数十。DBは正規化(重複除去)、DWは非正規化(JOIN最小化、速い読み)。同じ会社のデータが二つのシステムに別の形で存在するのが正常。

### 軸別比較
- **作業単位**: DBはミリ秒の単一取引 / DWは数秒〜数分の分析クエリ
- **データ変更**: DBはUPDATE・DELETE頻繁 / DWはほぼINSERTのみ(append-only)
- **スキーマ**: DBは正規化・3NF / DWはスタースキーマ・非正規化
- **同時ユーザー**: DBは数千 / DWは数十〜数百(分析者)
- **データ量**: DBはGB〜TB / DWはTB〜PB
- **課金**: DBは常時インスタンス / DWはクエリ課金・コンピュート課金(Snowflake・BigQuery)
- **技術例**: DB = PostgreSQL・[[dynamodb]]・[[dsql]] / DW = Redshift・Snowflake・BigQuery

### よくある誤解
- **「DWがDBの上位互換」** — 違う。運用取引処理にDWは不適(遅延が大きい)
- **「DWの代わりにDBで分析すればいい」** — 最初はできるが、データが増えると運用性能が崩れる。分離が基本
- **「[[datalake]]があればDWはいらない」** — 役割が違う。Lakeは生・非定型、DWは整理済み定型。通常は併用
- **「リアルタイムダッシュボードはDWで」** — DWは大抵分〜時間の遅延。リアルタイムには[[kinesis]] + マテリアライズドビュー
- **「レプリカを分析DBに」** — レプリカも運用構造のまま。集計クエリ性能は出ない

### 繋ぐパイプライン
- **ETL/ELT**: 運用DB → DW。通常夜間バッチ、またはCDC(Change Data Capture)で準リアルタイム
- **[[datalake]]経由**: OLTP DB → イベント → [[s3]] → [[glue]] ETL → [[dw]]、または[[athena]]が直接問い合わせ
- **dbt**: DW内部でSQLによる変換を管理・バージョン管理
- [[aiops]]・[[llmops]]の観察指標の多くがこのパイプライン末端に連なる

### 繋がり
[[db-basics]]と[[dw]]の比較軸。[[datalake]]を加えれば「3段アーキテクチャ」に拡張される — 運用(DB)/原本保存(Lake)/整理分析(DW)。[[serverless]]アプリでは[[dynamodb]] + [[s3]] + [[athena]]の組合せが軽量DW代替として一般的。[[cost]]設計では「取引課金 vs クエリ課金」の区別が重要。

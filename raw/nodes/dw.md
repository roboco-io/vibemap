---
id: dw
cat: data
size: 3
title:
  ko: 데이터 웨어하우스
  en: Data Warehouse
  ja: データウェアハウス
refs:
  - url: https://en.wikipedia.org/wiki/Data_warehouse
    title: Data warehouse (Wikipedia)
    lang: en
  - url: https://aws.amazon.com/redshift/
    title: Amazon Redshift
    lang: en
  - url: https://www.snowflake.com/en/data-cloud/workloads/data-warehouse/
    title: Snowflake Data Warehouse
    lang: en
extraEdges: []
---

## ko

데이터 웨어하우스(DW)는 **"분석을 위해 데이터를 모으고 정리해둔 저장소"**다. OLTP 데이터베이스([[db-basics]])가 *하나의 거래*를 빨리 처리하는 데 최적이라면, DW는 *수십억 건의 집계*를 빠르게 내는 데 최적이다. 컬럼 저장, 대규모 병렬 처리(MPP), 미리 집계된 뷰 — 구조부터 OLAP(Online Analytical Processing)를 위해 설계됐다. Redshift, Snowflake, BigQuery, Azure Synapse가 대표.

운영 DB와 가장 큰 차이는 *시간축*. OLTP는 지금 이 순간의 상태, DW는 시간에 걸쳐 쌓이는 이력. 그래서 "어제 매출 얼마?" "지난 분기 지역별 성장률?" 같은 질문에 [[sql]] 한 줄로 답이 나온다. 현대는 ELT 워크플로우가 주류 — 운영 DB나 이벤트 스트림에서 *로드 먼저*, 변환은 DW 안에서 dbt 같은 도구로.

### 언제 쓰나
- BI 대시보드·경영 리포트·재무 집계 — 초 단위 거래 처리가 아니라 분 단위 집계
- 제품 애널리틱스 — 사용자 행동·퍼널·코호트 분석
- 머신러닝 학습 데이터 소스 — 피처 스토어의 원본이 DW인 경우 많음
- 여러 시스템의 데이터를 한 질의로 묶어야 할 때 — 운영 DB 여러 개 + 외부 API 데이터를 DW로 수집
- **[[datalake]]와 병행** — Lakehouse 패턴으로 raw는 [[datalake]], 정리된 건 DW

### 쉽게 빠지는 함정
- **운영 DB 대용으로 쓰기** — DW는 동시 수천 거래에 최적화 안 됨. 읽기는 빠르지만 지연(분 단위)이 존재
- **[[cost]] 폭발** — Redshift는 클러스터 비용, Snowflake/BigQuery는 쿼리당 과금. `SELECT *` 한 번이 하루치 예산일 수도
- **차원 모델링 생략** — 정규화된 OLTP 스키마를 그대로 DW에 넣으면 JOIN 지옥. Star schema·dimension/fact 설계 기본기
- **실시간 기대** — DW는 보통 몇 분~몇 시간 지연. 실시간이 필요하면 [[kinesis]]·스트림 처리 추가
- **[[llmops]] 시대의 함정** — LLM이 DW에 자연어 질의하면 비용 실수 가능. 샘플링·타임아웃·비용 캡을 [[context-eng]] 레이어에서
- **데이터 거버넌스 부재** — "누가 무엇을 볼 수 있나" 없이 운영하면 PII 유출. 초기부터 role 기반 접근

### 연결
[[db-basics]]와는 축이 다름 — [[db-vs-dw]]가 이 대비를 정리. [[datalake]]와는 자주 함께 쓰이며, 많은 현업은 "lakehouse" 형태로 둘을 결합. AWS에서는 Redshift + [[athena]](쿼리) + [[s3]](저장) + [[glue]](ETL) + [[lake-formation]](거버넌스)가 한 묶음. [[llmops]]·[[aiops]] 모두 관찰 지표의 일부를 DW에서 가져오는 경우 많음.

## en

A data warehouse (DW) is **"a repository that centralizes and organizes data for analysis."** If the OLTP database ([[db-basics]]) is optimized for fast *single-transaction* handling, the DW is optimized for fast *billion-row aggregations*. Columnar storage, massively parallel processing (MPP), pre-aggregated views — the design is purpose-built for OLAP (Online Analytical Processing). Redshift, Snowflake, BigQuery, Azure Synapse lead the market.

The biggest difference from operational DBs is the *time axis*. OLTP is the state right now; DW is history accumulating across time. So "yesterday's revenue?" "last-quarter growth by region?" get answers in a single [[sql]] query. The modern workflow is ELT — *load first* from operational DBs and event streams, transform inside the DW using tools like dbt.

### When to use
- BI dashboards, executive reporting, financial aggregation — minute-scale summaries, not sub-second transactions
- Product analytics — user behavior, funnels, cohort analysis
- ML training data source — feature stores often pull from the DW
- Unifying data across systems — multiple operational DBs + external APIs merged in one query
- **Alongside a [[datalake]]** — the lakehouse pattern keeps raw data in the [[datalake]] and curated views in the DW

### Common pitfalls
- **Using it as an operational DB** — DWs aren't optimized for thousands of concurrent transactions. Reads are fast, but with latency (minutes)
- **[[cost]] blowouts** — Redshift charges per cluster; Snowflake and BigQuery per query. A single `SELECT *` can equal a day's budget
- **Skipping dimensional modeling** — dumping a normalized OLTP schema into a DW creates JOIN hell. Star schema, fact/dimension design is fundamental
- **Expecting real-time** — DWs typically lag by minutes to hours. Real-time needs [[kinesis]] or stream processing in front
- **LLM-era pitfall** — agents querying the DW in natural language can burn budget. Put sampling, timeouts, and cost caps at the [[context-eng]] layer
- **Governance absent** — running without "who can see what" leaks PII. Role-based access from day one

### How it connects
A different axis from [[db-basics]] — [[db-vs-dw]] frames the contrast. Often paired with a [[datalake]]; the lakehouse pattern blends both. In AWS, Redshift + [[athena]] (query) + [[s3]] (storage) + [[glue]] (ETL) + [[lake-formation]] (governance) form one stack. Both [[llmops]] and [[aiops]] often pull observability metrics from a DW.

## ja

データウェアハウス(DW)は**「分析のためにデータを集めて整理しておく倉庫」**。OLTPデータベース([[db-basics]])が*一つの取引*を速く処理することに最適なら、DWは*数十億件の集計*を速く返すことに最適だ。列ストレージ、大規模並列処理(MPP)、事前集計ビュー — 構造からOLAP(Online Analytical Processing)のために設計されている。Redshift、Snowflake、BigQuery、Azure Synapseが代表。

運用DBとの最大の違いは*時間軸*。OLTPは今この瞬間の状態、DWは時間をまたいで積もる履歴。だから「昨日の売上は?」「前四半期の地域別成長率は?」のような質問に[[sql]]一行で答えが返る。現代はELTワークフローが主流 — 運用DBやイベントストリームから*先にロード*し、変換はDW内でdbtのようなツールで。

### いつ使うか
- BIダッシュボード・経営レポート・財務集計 — 秒単位の取引処理ではなく分単位の集計
- プロダクト分析 — ユーザー行動・ファネル・コホート分析
- 機械学習の訓練データソース — 特徴量ストアの原本がDWであることが多い
- 複数システムのデータを一つのクエリでまとめる必要 — 複数の運用DB + 外部APIのデータをDWに収集
- **[[datalake]]と併用** — lakehouseパターンで生データは[[datalake]]、整理済みはDWに

### はまりやすい罠
- **運用DB代わりに使う** — DWは同時数千取引に最適化されていない。読みは速いが遅延(分単位)がある
- **[[cost]]の爆発** — Redshiftはクラスター費、Snowflake/BigQueryはクエリ課金。`SELECT *`一回が一日分の予算になりうる
- **次元モデリング省略** — 正規化されたOLTPスキーマをそのままDWに入れるとJOIN地獄。スタースキーマ・dimension/fact設計が基本
- **リアルタイム期待** — DWは通常数分〜数時間の遅延。リアルタイムが必要なら[[kinesis]]・ストリーム処理を前段に
- **[[llmops]]時代の罠** — LLMがDWに自然言語クエリすると予算が飛ぶ。サンプリング・タイムアウト・コストキャップを[[context-eng]]層に
- **データガバナンス不在** — 「誰が何を見られるか」なしで運用するとPII漏洩。初日からロールベースアクセス

### 繋がり
[[db-basics]]とは別軸 — [[db-vs-dw]]がこの対比を整理する。[[datalake]]と一緒に使われることが多く、lakehouse形態で両者を結合する。AWSではRedshift + [[athena]](クエリ) + [[s3]](保存) + [[glue]](ETL) + [[lake-formation]](ガバナンス)が一つのスタック。[[llmops]]・[[aiops]]はどちらも観察指標の一部をDWから取ってくることが多い。

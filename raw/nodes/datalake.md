---
id: datalake
cat: data
size: 3
title:
  ko: 데이터 레이크
  en: Data Lake
  ja: データレイク
refs:
  - url: https://en.wikipedia.org/wiki/Data_lake
    title: Data lake (Wikipedia)
    lang: en
  - url: https://aws.amazon.com/big-data/datalakes-and-analytics/
    title: Data Lakes and Analytics (AWS)
    lang: en
  - url: https://delta.io/
    title: Delta Lake — open table format
    lang: en
extraEdges: []
---

## ko

데이터 레이크는 **"정형·반정형·비정형 데이터를 *원본 그대로* 쌓아두는 저장소"**다. [[dw]]가 "질문에 답하려고 정리된 방"이라면, 레이크는 "일단 다 던져 넣는 창고". 스키마를 쓰기 전에 강제하지 않고(schema-on-read), 파일 포맷(Parquet, ORC, JSON, CSV, 로그)도 다양하게 받는다. 용량이 크고 쌓는 비용이 싸서 — 보통 [[s3]] 같은 객체 저장소가 기반 — "나중에 쓸지도 모르는" 데이터까지 일단 저장한다.

실전 레이크 스택은 이렇게 생겼다. **저장**: [[s3]](AWS) / GCS / ADLS. **카탈로그**: [[glue]]·Hive Metastore — 어떤 파일이 어떤 테이블인지. **쿼리**: [[athena]]·Presto·Trino·Spark — 데이터를 옮기지 않고 직접 SQL. **거버넌스**: [[lake-formation]]·Unity Catalog — 테이블·칼럼 수준 권한. 요즘은 Iceberg·Delta Lake 같은 "오픈 테이블 포맷"이 DW와 레이크의 경계를 흐리며 lakehouse로 수렴.

### 언제 쓰나
- **다양한 형식의 로그·이벤트·센서 데이터**를 장기 보관 — 스키마가 아직 정해지지 않았거나 자주 바뀜
- **ML 학습용 대용량 원본** — 이미지·비디오·텍스트·시계열
- **DW의 보조 단계** — raw는 레이크, 정제된 큐레이션은 [[dw]]
- **다양한 분석 도구 공존** — 같은 원본을 Spark·SQL·Pandas·MLlib이 각자 읽음
- **[[kinesis]]/Kafka 이벤트 스트림의 영구 저장소** — 실시간 처리 후 레이크로 싱크

### 쉽게 빠지는 함정
- **"레이크에 넣기만 하면 끝"** — 카탈로그·파티셔닝·메타데이터 없이 쌓으면 곧 **데이터 스왐프**(늪). 찾지도 못할 쓰레기 산
- **파일 수 폭증** — [[s3]]에 수백만 작은 파일이 쌓이면 쿼리가 메타데이터 부하로 느려짐. compaction 작업 필수
- **[[cost]] 방심** — 저장은 싸지만 [[athena]]·Redshift Spectrum이 스캔한 바이트로 과금. 파티셔닝 없이 전체 스캔이 악몽
- **PII 혼입** — 구조화 안 된 원본에 개인정보가 섞이면 GDPR·CCPA 위반 위험. 수집 단계에서 마스킹
- **포맷 고민 없이 JSON** — 분석 쿼리에는 Parquet이 10~100배 빠름. 저장 시점에 컬럼 포맷으로 변환
- **스키마 진화 무시** — 새 필드 추가할 때 기존 파티션과 충돌. Iceberg·Delta Lake가 이 문제를 해결

### 연결
[[dw]]와 상호 보완이자 대비 — [[db-vs-dw]] 비교가 레이크까지 확장되면 "3단계(OLTP vs DW vs Lake)" 그림이 된다. AWS에서 [[s3]]·[[glue]]·[[athena]]·[[lake-formation]]이 네 기둥. [[kinesis]]에서 흘러들어와 [[aiops]]·[[llmops]]의 관찰·학습 데이터로 흘러 나간다. [[cost]] 관점에서 "저장은 싸고 쿼리는 비싸다"는 특성을 이해해야 운영이 지속 가능.

## en

A data lake is **"a repository that stores structured, semi-structured, and unstructured data *as-is*."** If the [[dw]] is "a tidy room arranged to answer questions," the lake is "the warehouse where everything gets dropped first." Schema isn't forced at write time (schema-on-read); file formats vary widely (Parquet, ORC, JSON, CSV, logs). Storage is cheap — usually object storage like [[s3]] — so you can keep data even if you don't yet know how you'll use it.

A production lake stack looks like this. **Storage**: [[s3]] (AWS) / GCS / ADLS. **Catalog**: [[glue]], Hive Metastore — which files are which tables. **Query**: [[athena]], Presto, Trino, Spark — SQL over the data without moving it. **Governance**: [[lake-formation]], Unity Catalog — table- and column-level permissions. "Open table formats" like Iceberg and Delta Lake are blurring the line between DWs and lakes into a "lakehouse."

### When to use
- **Long-term storage of varied logs, events, sensor data** — schema isn't fixed or changes often
- **ML training data at scale** — images, video, text, time series
- **As the raw tier under a DW** — raw in the lake, curated in the [[dw]]
- **Multiple analytical tools on the same data** — Spark, SQL, Pandas, MLlib reading the same source
- **Permanent storage for [[kinesis]] / Kafka streams** — real-time processing lands here

### Common pitfalls
- **"Just drop it in and we're done"** — without a catalog, partitioning, or metadata, it's a **data swamp** within weeks. An unsearchable junk pile
- **File-count explosion** — millions of tiny files in [[s3]] slow queries through metadata overhead. Compaction is mandatory
- **[[cost]] complacency** — storage is cheap but [[athena]] / Redshift Spectrum charge by bytes scanned. Unpartitioned full scans are nightmares
- **PII contamination** — unstructured raw data can contain personal information, risking GDPR/CCPA. Mask at ingest
- **Defaulting to JSON** — Parquet is 10–100× faster for analytical queries. Convert to columnar at land time
- **Ignoring schema evolution** — adding new fields conflicts with old partitions. Iceberg and Delta Lake solve this

### How it connects
Complementary to and contrasted with [[dw]] — extending [[db-vs-dw]] gives you the three-tier (OLTP vs DW vs Lake) picture. In AWS, [[s3]], [[glue]], [[athena]], [[lake-formation]] are the four pillars. Data flows in from [[kinesis]] and flows out as observability/training data for [[aiops]] and [[llmops]]. From a [[cost]] angle, the "cheap to store, expensive to query" pattern has to be understood for sustainable operation.

## ja

データレイクは**「構造化・半構造化・非構造化データを*生のまま*溜めておく保存所」**。[[dw]]が「質問に答えるため整理された部屋」なら、レイクは「とりあえず全部放り込む倉庫」。書き込み時にスキーマを強制しない(schema-on-read)し、ファイル形式(Parquet、ORC、JSON、CSV、ログ)も多様に受ける。容量が大きく保存が安い — 通常[[s3]]のようなオブジェクトストレージが基盤 — ので「いつか使うかも」のデータまで保存できる。

実戦レイクスタックはこうなる。**保存**: [[s3]](AWS) / GCS / ADLS。**カタログ**: [[glue]]・Hive Metastore — どのファイルがどのテーブルか。**クエリ**: [[athena]]・Presto・Trino・Spark — データを動かさず直接SQL。**ガバナンス**: [[lake-formation]]・Unity Catalog — テーブル・カラム単位の権限。最近はIceberg・Delta Lakeのような「オープンテーブル形式」がDWとレイクの境界を曖昧にし、lakehouseへ収束している。

### いつ使うか
- **多様な形式のログ・イベント・センサーデータ**を長期保管 — スキーマが未定、または頻繁に変わる
- **ML訓練用の大容量原本** — 画像・動画・テキスト・時系列
- **DWの下位段** — 生はレイク、整理済みは[[dw]]
- **多様な分析ツールの共存** — 同じ原本をSpark・SQL・Pandas・MLlibが各々読む
- **[[kinesis]]/Kafkaストリームの永久保存** — リアルタイム処理後レイクに流す

### はまりやすい罠
- **「レイクに入れれば終わり」** — カタログ・パーティション・メタデータなしで積むとすぐ**データスワンプ**(沼)になる。検索もできないゴミ山
- **ファイル数爆発** — [[s3]]に数百万の小ファイルが溜まるとクエリがメタデータ負荷で遅くなる。コンパクションが必須
- **[[cost]]油断** — 保存は安いが[[athena]]・Redshift Spectrumはスキャンバイト課金。パーティションなしのフルスキャンは悪夢
- **PII混入** — 構造化されていない原本に個人情報が混ざるとGDPR・CCPA違反リスク。取り込み段階でマスキング
- **形式を考えずJSON** — 分析クエリにはParquetが10〜100倍速い。保存時点でカラム形式に変換
- **スキーマ進化の無視** — 新フィールド追加時に既存パーティションと衝突。Iceberg・Delta Lakeがこの問題を解く

### 繋がり
[[dw]]と相補でありつつ対比 — [[db-vs-dw]]比較をレイクまで拡張すれば「3段(OLTP vs DW vs Lake)」の図になる。AWSでは[[s3]]・[[glue]]・[[athena]]・[[lake-formation]]が四本柱。[[kinesis]]から流れ込み、[[aiops]]・[[llmops]]の観察・学習データとして流れ出る。[[cost]]視点で「保存は安く、クエリは高い」特性を理解しないと運用が続かない。

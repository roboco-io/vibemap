---
id: athena
cat: data
size: 3
title:
  ko: Athena
  en: Athena
  ja: Athena
refs:
  - url: https://docs.aws.amazon.com/athena/latest/ug/what-is.html
    title: What is Amazon Athena (AWS Docs)
    lang: en
  - url: https://aws.amazon.com/athena/pricing/
    title: Athena Pricing
    lang: en
extraEdges: []
---

## ko

Athena는 **[[s3]]에 있는 파일을 SQL로 직접 쿼리하는** 서버리스 서비스다. "데이터를 데이터베이스에 올리지 않고도 질의할 수 있다"는 게 핵심.

[[datalake]]에 Parquet/CSV/JSON 파일을 던져놓고, [[glue]]가 카탈로그에 테이블로 등록해두면, Athena에 `SELECT * FROM logs WHERE date='2026-04-22'` 같은 쿼리를 바로 날릴 수 있다. 서버 없음, 인덱스 없음, 관리 없음 — **스캔한 데이터 용량만큼만 과금**.

### 언제 쓰나
- "DB로 옮기기엔 너무 크고, 몇 번만 분석하면 되는" 로그 데이터
- [[dw]]로 가기 전 원시 데이터를 탐색할 때
- BI 대시보드가 주 1회만 갱신되면 되는 경우 (Athena 쿼리 → QuickSight)

### 비용 주의
쿼리당 스캔한 데이터 1TB당 몇 달러. [[sql]]에 익숙한 사람이 `SELECT *`를 대형 테이블에 던지면 한 쿼리로 수십 달러가 나갈 수 있다. 방어:
- 파일을 **Parquet로 저장** (컬럼 지향 → 필요한 열만 스캔)
- **날짜별 파티션** (조건에 `WHERE year=2026`을 쓰면 해당 폴더만 스캔)
- 쿼리 상한(workgroup limit) 설정 — [[cost]] 노드 참고

## en

Athena is a **serverless SQL engine that queries files in [[s3]]** — no database load step. That's the whole pitch.

Drop Parquet/CSV/JSON into your [[datalake]], let [[glue]] register the tables in a catalog, then run `SELECT * FROM logs WHERE date='2026-04-22'` right there. No servers, no indexes, no ops — **pay only for data scanned**.

### When to use
- Log data that's too big to load into a DB but only needs occasional analysis
- Exploring raw data before deciding what goes into the [[dw]]
- BI dashboards that refresh weekly, not in real time (Athena → QuickSight)

### Cost watch
A few dollars per TB scanned. A careless `SELECT *` on a big table can ring up tens of dollars in a single query. Defenses:
- Store files as **Parquet** (columnar → scan only the columns you need)
- **Partition by date** so `WHERE year=2026` prunes whole folders
- Set a workgroup query limit — see the [[cost]] node

## ja

Athenaは**[[s3]]上のファイルをSQLで直接クエリする**サーバーレスサービス。「データベースにロードせずに問い合わせられる」のが核心。

[[datalake]]にParquet/CSV/JSONを置き、[[glue]]がカタログにテーブル登録しておけば、Athenaで`SELECT * FROM logs WHERE date='2026-04-22'`のようなクエリをそのまま実行できる。サーバー不要、インデックス不要、運用不要 — **スキャンしたデータ量に応じた課金**。

### いつ使うか
- 「DBに入れるには大きすぎるが、たまに分析する」程度のログデータ
- [[dw]]に載せる前に生データを探索したいとき
- BIダッシュボードが週1回更新で十分な場合(Athena→QuickSight)

### コスト注意
スキャン量1TBあたり数ドル。[[sql]]に慣れた人が大きいテーブルに`SELECT *`を投げると、1回のクエリで数十ドル飛ぶことがある。防御策:
- ファイルを**Parquet**で保存(列指向 — 必要な列だけスキャン)
- **日付パーティション** — `WHERE year=2026`で該当フォルダのみスキャン
- ワークグループのクエリ上限を設定 — [[cost]]ノード参照

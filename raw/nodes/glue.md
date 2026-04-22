---
id: glue
cat: data
size: 3
title:
  ko: AWS Glue
  en: AWS Glue
  ja: AWS Glue
refs:
  - url: https://docs.aws.amazon.com/glue/latest/dg/what-is-glue.html
    title: What is AWS Glue (AWS Docs)
    lang: en
  - url: https://aws.amazon.com/glue/features/
    title: AWS Glue Features
    lang: en
extraEdges: []
---

## ko

AWS Glue는 **데이터 레이크 운영의 스위스 아미 나이프**다. 크게 세 가지를 한데 묶은 관리형 서비스 — ETL(Extract/Transform/Load), 데이터 카탈로그, 크롤러.

[[datalake]]가 "뭐든 쏟아붓는 호수"라면 Glue는 그 호수에서 **"여기 어떤 데이터가 있고, 어떤 스키마인지"** 를 자동으로 목록화한다. 크롤러가 [[s3]] 버킷을 훑고 Parquet/CSV/JSON의 컬럼을 알아낸 뒤, 카탈로그에 등록. 이후 [[athena]], [[dw]]의 Redshift, EMR 같은 도구가 이 카탈로그를 공유하기 때문에 "어떤 테이블이 있더라?"를 매번 묻지 않아도 된다.

### 언제 쓰나
- 여러 팀이 [[s3]]에 파일을 떨구는데, "지금 어떤 데이터가 있는지" 파악이 안 될 때 → 크롤러 돌려 카탈로그 생성
- 원시 로그를 분석 가능한 형태(Parquet, 파티션)로 정제해야 할 때 → Glue ETL 작업
- [[lake-formation]]의 권한 정책을 걸기 전, 테이블 메타데이터가 먼저 카탈로그에 있어야 함

### 비유
집에 짐이 잔뜩 쌓였는데 "어디 뭐 있는지"를 적어둔 엑셀이 없으면 쓸모가 없다. Glue는 그 엑셀을 자동으로 만들어주고, 필요하면 물건들을 같은 규격(상자 크기)으로 다시 포장해준다.

## en

AWS Glue is the **Swiss army knife for data-lake ops** — one managed service wrapping ETL (Extract/Transform/Load), a data catalog, and crawlers.

If [[datalake]] is "the lake you dump anything into", Glue is what keeps a **map of what's actually in it** and in what schema. Crawlers scan your [[s3]] buckets, infer column types from Parquet/CSV/JSON, and register tables in the catalog. Downstream tools like [[athena]], Redshift (the [[dw]]), and EMR all read from the same catalog, so nobody asks "what tables do we have?" anymore.

### When to use
- Multiple teams drop files into [[s3]] and nobody knows what's there → run a crawler, get a catalog
- Raw logs need to become analysis-ready (Parquet, partitioned) → Glue ETL jobs
- Before you can apply [[lake-formation]] permissions, tables must live in the Glue catalog

### Analogy
If your garage is piled with stuff and you have no spreadsheet of "where is what", the stuff is useless. Glue writes that spreadsheet for you, and optionally re-boxes everything into a standard container size.

## ja

AWS Glueは**データレイク運用のスイスアーミーナイフ**。ETL(Extract/Transform/Load)、データカタログ、クローラーを一つのマネージドサービスにまとめたもの。

[[datalake]]が「何でも流し込む湖」なら、Glueはその湖の**「何がどこにあり、どんなスキーマか」の地図**を保つ役割。クローラーが[[s3]]バケットを走査し、Parquet/CSV/JSONのカラム型を推定、カタログにテーブルを登録する。[[athena]]、Redshift([[dw]])、EMRなどの下流ツールがすべて同じカタログを参照するため、「今どんなテーブルがある?」を毎回聞かなくて済む。

### いつ使うか
- 複数チームが[[s3]]にファイルを投入しているが、現状把握ができない → クローラーを走らせてカタログ生成
- 生ログを分析可能な形(Parquet、パーティション)に整形する必要があるとき → Glue ETLジョブ
- [[lake-formation]]のアクセス制御を適用するには、先にテーブルがGlueカタログに存在している必要がある

### 例え
倉庫に荷物が山積みでも、「何がどこにあるか」の台帳がなければ使い物にならない。Glueはその台帳を自動で作り、必要なら荷物を標準の箱に詰め直してくれる。

---
id: kinesis
cat: data
size: 3
title:
  ko: Kinesis
  en: Kinesis
  ja: Kinesis
refs:
  - url: https://docs.aws.amazon.com/streams/latest/dev/introduction.html
    title: What is Amazon Kinesis Data Streams (AWS Docs)
    lang: en
  - url: https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html
    title: Amazon Data Firehose (AWS Docs)
    lang: en
extraEdges: []
---

## ko

Kinesis는 AWS의 **스트리밍 데이터 파이프라인**이다. 실시간으로 쏟아지는 이벤트(웹 클릭, IoT 센서, 앱 로그)를 받아 [[datalake]]나 분석 도구로 흘려보낸다.

한 덩어리가 아니라 두 형제로 나뉜다:
- **Kinesis Data Streams** — 스트림 자체(카프카 같은 메시지 큐). 개발자가 직접 읽고 쓰며 가공
- **Data Firehose** (예전 이름: Kinesis Firehose) — 스트림을 받아 [[s3]], [[dw]]의 Redshift, OpenSearch로 **자동 배달**. 거의 코드 없이 구성

### 언제 쓰나
- 사용자 이벤트를 실시간으로 [[s3]]에 쌓아 [[athena]]로 분석하고 싶을 때 → Firehose
- 실시간 알림·스트림 처리 ([[lambda]]가 스트림을 읽고 조건 맞으면 슬랙 등) → Data Streams
- IoT 디바이스 수백만 개가 1초마다 보내는 센서 값 수집

### 비유
Kinesis Data Streams는 "실시간 컨베이어 벨트 시스템" — 무엇을 얹을지, 어디서 꺼낼지 직접 설계. Firehose는 "벨트 + 자동 분류기 + 배달 트럭"까지 묶어놓은 것. [[monitoring]]과 [[cost]]는 샤드 수, 처리량, 변환 Lambda 호출 수로 결정되니 아키텍처 초기에 설정을 잡아두자.

## en

Kinesis is AWS's **streaming data pipeline**: it takes real-time events (web clicks, IoT sensors, app logs) and delivers them into your [[datalake]] or analytics stack.

It's actually two siblings:
- **Kinesis Data Streams** — the stream itself (like Kafka). You read and write messages yourself and do custom processing
- **Data Firehose** (formerly Kinesis Firehose) — takes a stream and **auto-delivers** it to [[s3]], Redshift (the [[dw]]), OpenSearch. Almost no code

### When to use
- Pile user events into [[s3]] in real time so [[athena]] can analyze them → Firehose
- Real-time alerts or stream processing ([[lambda]] reads the stream and pings Slack on match) → Data Streams
- Ingest sensor readings from millions of IoT devices every second

### Analogy
Data Streams is "a real-time conveyor belt" — you design what goes on it and where to take things off. Firehose is "conveyor + auto-sorter + delivery truck" as one package. [[monitoring]] and [[cost]] hinge on shard count, throughput, and transformation Lambda invocations — settle the architecture early.

## ja

KinesisはAWSの**ストリーミングデータパイプライン**。リアルタイムに流れ込むイベント(Webクリック、IoTセンサー、アプリログ)を受け取り、[[datalake]]や分析ツールへ流し込む。

一塊ではなく、兄弟が2つ:
- **Kinesis Data Streams** — ストリーム本体(Kafkaのようなメッセージキュー)。開発者が直接読み書きして加工する
- **Data Firehose**(旧名: Kinesis Firehose) — ストリームを受けて[[s3]]、Redshift([[dw]])、OpenSearchへ**自動配送**。ほぼノーコード

### いつ使うか
- ユーザーイベントをリアルタイムに[[s3]]へ蓄積し、[[athena]]で分析したいとき → Firehose
- リアルタイム通知・ストリーム処理([[lambda]]がストリームを読み条件一致でSlack通知など) → Data Streams
- 数百万台のIoTデバイスが毎秒送るセンサー値の収集

### 例え
Data Streamsは「リアルタイムコンベアベルト」 — 何を載せてどこで取るかを自分で設計。Firehoseは「ベルト+自動仕分け機+配送トラック」を一つにまとめた構成。[[monitoring]]と[[cost]]はシャード数、スループット、変換Lambda呼び出し回数で決まるため、アーキテクチャの初期段階で設計しておく。

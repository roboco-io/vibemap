---
id: dsql
cat: ops
size: 3
title:
  ko: Aurora DSQL
  en: Aurora DSQL
  ja: Aurora DSQL
refs:
  - url: https://docs.aws.amazon.com/aurora-dsql/latest/userguide/what-is-aurora-dsql.html
    title: What is Aurora DSQL (AWS Docs)
    lang: en
  - url: https://aws.amazon.com/blogs/aws/introducing-amazon-aurora-dsql/
    title: Introducing Amazon Aurora DSQL
    lang: en
extraEdges: []
---

## ko

Aurora DSQL은 AWS의 **서버리스 분산 SQL** 데이터베이스다. [[serverless]] 스택에서 [[dynamodb]]가 NoSQL 자리를 맡아왔다면, DSQL은 "관계형이 필요한데 서버는 운영하기 싫다"는 경우를 채운다. 기존 [[sql]] 경험을 그대로 가져가면서도, 여러 리전에서 동시에 읽고 쓸 수 있는 **멀티 리전 동시 쓰기(active-active)** 를 기본으로 제공한다.

비유하면 기존 RDS/Aurora는 "서버를 주문 → 설치 → 사이즈 조정"이라는 식당 예약 같은 경험이라면, DSQL은 "SQL 쿼리만 던지면 되는 수도꼭지"다. 물이 얼마나 필요한지 고민할 필요 없이 틀기만 하면 나온다.

### 언제 쓰나
- [[sql-vs-nosql]] 갈림길에서 SQL 쪽을 고르되, 인스턴스 프로비저닝/백업/패치까지 맡기고 싶을 때
- 여러 대륙의 사용자가 동시에 쓰기/읽기 하는 글로벌 앱
- [[lambda]] + [[apigw]]로 완전 서버리스 백엔드를 구성하는데 관계형 DB가 필요한 경우

### 주의할 점
- 트랜잭션 의미론이 전통적 Aurora와 미묘하게 다르다 — 낙관적 동시성(optimistic concurrency) 기반이라 동시 쓰기 충돌이 많으면 재시도 설계가 필요
- 요즘 막 GA된 서비스라 ORM 호환성, 드라이버 지원 범위를 공식 문서로 확인할 것
- 가격 모델이 시간당이 아니라 **쿼리·스토리지 사용량** 기반이라 [[cost]] 모니터링을 처음부터 걸어두자

## en

Aurora DSQL is AWS's **serverless distributed SQL** database. Where [[dynamodb]] handles the NoSQL slot in a [[serverless]] stack, DSQL fills "I need relational, but I don't want to operate servers." You keep your [[sql]] skills, and get **multi-region active-active writes** for free.

Put differently: traditional RDS/Aurora is "order a server, install, size it right" — the restaurant-reservation experience. DSQL is the tap: turn the handle and water comes out. You don't reserve capacity upfront.

### When to use
- You're at the [[sql-vs-nosql]] fork, pick SQL, and want AWS to own provisioning/backup/patching
- Global app where users on different continents read and write simultaneously
- Full serverless backend with [[lambda]] + [[apigw]] that needs a relational store

### Watch out
- Transaction semantics differ from classic Aurora — optimistic concurrency means contention-heavy writes need retry design
- It's a newly-GA service, so double-check ORM and driver support in the docs
- Billing is per-query and storage, not hourly — wire up [[cost]] alerts from day one

## ja

Aurora DSQLはAWSの**サーバーレス分散SQL**データベース。[[serverless]]スタックで[[dynamodb]]がNoSQL枠を担ってきたのに対し、DSQLは「リレーショナルは欲しいがサーバーは運用したくない」というケースを埋める。既存の[[sql]]スキルをそのまま活かしつつ、**複数リージョン同時書き込み(active-active)** を標準で提供する。

例えるなら、従来のRDS/Auroraは「サーバーを注文→設置→サイズ調整」という予約型レストランの体験。DSQLは蛇口だ。水がどれだけ必要かを事前に考えず、ひねればそのまま出る。

### いつ使うか
- [[sql-vs-nosql]]の分岐でSQLを選びつつ、インスタンス管理までAWSに任せたいとき
- 複数大陸のユーザーが同時に読み書きするグローバルアプリ
- [[lambda]] + [[apigw]]で完全サーバーレスバックエンドを組むときのRDB選択肢

### 注意点
- トランザクションの挙動が従来のAuroraと微妙に違う — 楽観的同時実行制御なので、競合が多い書き込みでは再試行設計が必要
- 最近GAされたばかり。ORM・ドライバのサポート状況は必ず公式ドキュメントで確認
- 課金モデルが時間単位ではなくクエリ・ストレージ利用量ベース — [[cost]]アラートは最初から設定する

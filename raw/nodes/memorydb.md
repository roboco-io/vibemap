---
id: memorydb
cat: ops
size: 3
title:
  ko: MemoryDB for Redis
  en: MemoryDB for Redis
  ja: MemoryDB for Redis
refs:
  - url: https://docs.aws.amazon.com/memorydb/latest/devguide/what-is-memorydb.html
    title: What is Amazon MemoryDB (AWS Docs)
    lang: en
  - url: https://aws.amazon.com/blogs/database/announcing-amazon-memorydb-with-valkey/
    title: Amazon MemoryDB with Valkey
    lang: en
extraEdges: []
---

## ko

MemoryDB는 AWS의 **지속성 있는 인메모리 데이터베이스**다. 한 마디로 "Redis가 데이터베이스로 승격된 버전." 기존 ElastiCache Redis가 "빠르지만 언제든 날아갈 수 있는 캐시"였다면, MemoryDB는 여러 AZ에 자동 복제되어 **데이터베이스 주 저장소(primary store)** 로 쓸 수 있다.

[[serverless]] 스택에서 [[dynamodb]]가 "확장성 좋은 NoSQL"을 맡는다면, MemoryDB는 "밀리초 미만 응답이 필요한데 캐시가 날아가면 안 되는" 시나리오 — 실시간 리더보드, 세션 스토어, 채팅 메시지 큐 같은 것 — 을 담당한다.

### 언제 쓰나
- 읽기·쓰기 모두 밀리초 미만이어야 하고, 데이터가 휘발되면 안 될 때
- Redis API 그대로 쓰면서 AWS 관리형을 원할 때 (Valkey 엔진으로 마이그레이션도 최근 지원)
- [[lambda]]에서 세션·토큰·임시 상태를 빠르게 조회해야 하는 경우

### ElastiCache vs MemoryDB
ElastiCache는 캐시 레이어(옆방의 노트), MemoryDB는 주 DB(금고). 둘은 용도가 다르다. "원본은 DynamoDB, 가속만 Redis"면 ElastiCache, "원본 자체가 Redis"면 MemoryDB. [[monitoring]]과 [[cost]] 차이도 상당하니 서비스 선택 시 비교 필수.

## en

MemoryDB is AWS's **durable in-memory database** — Redis promoted to a database tier. Classic ElastiCache Redis is "fast but volatile"; MemoryDB replicates synchronously across AZs and can be a **primary store**.

In a [[serverless]] stack where [[dynamodb]] handles scalable NoSQL, MemoryDB covers the "sub-millisecond latency AND the data cannot evaporate" slot — real-time leaderboards, session stores, chat message queues, etc.

### When to use
- Sub-millisecond reads and writes, and losing data is not an option
- You want Redis API compatibility plus AWS management (Valkey engine is now an option for licensing-sensitive teams)
- Fast session/token/ephemeral state lookups from [[lambda]]

### ElastiCache vs MemoryDB
ElastiCache is a cache layer (the sticky note next to the vault); MemoryDB is the vault itself. Different jobs. If your source of truth is DynamoDB and Redis is just the accelerator, use ElastiCache. If Redis IS the source of truth, use MemoryDB. [[monitoring]] and [[cost]] profiles differ meaningfully — compare before choosing.

## ja

MemoryDBはAWSの**永続性を持つインメモリデータベース**。一言で「Redisがデータベース階層に昇格したもの」。従来のElastiCache Redisが「速いが揮発性のキャッシュ」だったのに対し、MemoryDBは複数AZに同期レプリケーションされ、**プライマリストア**として使える。

[[serverless]]スタックで[[dynamodb]]が「スケーラブルなNoSQL」を担うなら、MemoryDBは「ミリ秒未満の応答が必要かつデータ消失不可」のシナリオ — リアルタイムリーダーボード、セッションストア、チャットメッセージキューなど — を引き受ける。

### いつ使うか
- 読み書きともにミリ秒未満必須、かつデータ消失が許されないとき
- Redis APIをそのまま使いつつAWS管理型を望むとき(Valkeyエンジンへの移行も最近サポート)
- [[lambda]]からセッション・トークン・一時状態を高速参照する場合

### ElastiCache vs MemoryDB
ElastiCacheはキャッシュ層(金庫の隣の付箋)、MemoryDBは金庫そのもの。役割が違う。「原本はDynamoDB、高速化だけRedis」ならElastiCache、「原本がRedis」ならMemoryDB。[[monitoring]]と[[cost]]の傾向も大きく異なるため、選定時に必ず比較すること。

---
id: sql
cat: data
size: 3
title:
  ko: SQL
  en: SQL
  ja: SQL
refs:
  - url: https://en.wikipedia.org/wiki/SQL
    title: SQL (Wikipedia)
    lang: en
  - url: https://sqlbolt.com/
    title: SQLBolt — Interactive SQL lessons
    lang: en
  - url: https://use-the-index-luke.com/
    title: Use The Index, Luke — SQL performance guide
    lang: en
extraEdges: []
---

## ko

SQL(Structured Query Language)은 **관계형 DB와 대화하는 선언적 언어**다. "어떻게 가져올지"를 명령하는 절차형이 아니라, "무엇을 원하는지"를 기술하면 DB 엔진이 실행 계획을 세워 가져다준다. 1974년 IBM에서 탄생한 뒤 50년이 지났지만 여전히 가장 널리 쓰이는 데이터 질의 언어 — AWS의 [[dsql]]·Redshift, Google BigQuery, Snowflake, PostgreSQL, MySQL, SQLite 전부 기본이 SQL.

네 개의 동사로 대부분을 처리한다. **SELECT**(읽기), **INSERT**(쓰기), **UPDATE**(변경), **DELETE**(삭제). 여기에 **JOIN**(테이블 결합), **GROUP BY**(집계), **WINDOW**(순위·누적) 같은 연산이 붙으면 분석 쿼리까지 쓸 수 있다. 학습 곡선은 완만하지만 *성능 튜닝*은 깊다 — 인덱스 설계, 쿼리 플랜 읽기, 통계 갱신. 이 지점에서 숙련자와 초보가 갈린다.

### 언제 쓰나
- 관계형 DB가 있는 어디든 — 현업 앱의 기본값
- 분석·BI — [[dw]]의 질의 언어도 대부분 SQL
- AI 에이전트에게 DB 작업 위임 — 자연어→SQL 변환이 가장 잘 되는 질의어
- [[datalake]] 위에서도 Athena·Presto·Trino로 SQL 가능 — 데이터를 옮기지 않고 조회
- 데이터 탐색·품질 체크 — [[testing]]의 한 축으로 쓰이기도

### 쉽게 빠지는 함정
- **`SELECT *` 남발** — 필요한 컬럼만 가져오는 게 성능·네트워크·메모리 모두 이득
- **부등호·함수로 인덱스 무력화** — `WHERE date(created)=...`는 인덱스를 못 탄다. 컬럼에 함수 걸지 말 것
- **서브쿼리 남용** — JOIN으로 쓸 수 있는 걸 상관 서브쿼리로 풀면 N+1로 터짐
- **TRUNCATE·DROP·DELETE 혼동** — 실수하면 복구 불가. 프로덕션에선 항상 트랜잭션 감싸 테스트 먼저
- **LLM이 작성한 SQL을 검증 없이 실행** — [[hallucination]]으로 존재하지 않는 컬럼이나 잘못된 JOIN 조건. [[review-mindset]] 필수
- **[[cost]] 폭발** — [[datalake]] 위의 SQL은 스캔량 기반 과금. `WHERE` 파티션 없이 전체 스캔이면 수천 달러가 한 번에

### 연결
[[db-basics]]의 직접 하위 축이자 [[nosql]]과의 대비. [[sql-vs-nosql]]·[[db-vs-dw]]가 선택 맥락. AWS 세계의 [[dsql]]·[[athena]]·Redshift·RDS가 SQL 인터페이스. [[llmops]] 시대에는 "자연어→SQL" 변환이 에이전트 능력의 시금석 — 정확한 SQL을 생성하려면 모델이 스키마·관계·제약을 이해해야 한다 ([[context-eng]]이 중요해지는 지점).

## en

SQL (Structured Query Language) is **the declarative language for talking to relational databases**. You don't command "how to fetch"; you describe "what you want" and the engine plans the execution. Born at IBM in 1974, still the most widely used query language 50 years later — AWS [[dsql]], Redshift, Google BigQuery, Snowflake, PostgreSQL, MySQL, SQLite all speak SQL as their lingua franca.

Four verbs cover most of it. **SELECT** (read), **INSERT** (write), **UPDATE** (modify), **DELETE** (remove). Layer on **JOIN** (combine tables), **GROUP BY** (aggregate), and **WINDOW** (ranks, running totals), and you can do analytics. The learning curve is gentle, but *performance tuning* runs deep — index design, reading query plans, keeping statistics fresh. That's where expert and beginner diverge.

### When to use
- Anywhere a relational DB lives — the default for production apps
- Analytics / BI — [[dw]] query languages are usually SQL too
- Delegating DB work to an AI agent — SQL is the best-translated target for natural-language-to-query
- Over a [[datalake]] via Athena, Presto, Trino — SQL without moving the data
- Data exploration and quality checks — sometimes used as a [[testing]] axis

### Common pitfalls
- **`SELECT *` everywhere** — fetching only needed columns wins on CPU, network, and memory
- **Functions disabling indexes** — `WHERE date(created) = ...` can't use the index on `created`. Don't wrap functions around columns
- **Subquery overuse** — a correlated subquery where a JOIN would do becomes N+1
- **Confusing TRUNCATE / DROP / DELETE** — mistakes are unrecoverable. In prod, wrap in a transaction and test first
- **Running LLM-written SQL without review** — [[hallucination]] yields nonexistent columns or wrong JOIN conditions. [[review-mindset]] is mandatory
- **[[cost]] explosion** — SQL over a [[datalake]] is billed by bytes scanned. A partition-less full scan can cost thousands in a single query

### How it connects
A direct subaxis of [[db-basics]] and the counterpart to [[nosql]]. [[sql-vs-nosql]] and [[db-vs-dw]] frame the selection context. In AWS, [[dsql]], [[athena]], Redshift, and RDS all expose SQL interfaces. In the [[llmops]] era, "natural-language-to-SQL" is a touchstone for agent capability — generating correct SQL requires the model to understand schema, relations, and constraints (where [[context-eng]] matters most).

## ja

SQL(Structured Query Language)は**関係型DBと対話する宣言的言語**。「どう取るか」を命令する手続き型でなく「何が欲しいか」を記述すればDBエンジンが実行計画を立てて取ってくる。1974年にIBMで生まれて50年、依然として最広く使われるデータ問い合わせ言語 — AWSの[[dsql]]・Redshift、Google BigQuery、Snowflake、PostgreSQL、MySQL、SQLiteすべてが基本SQL。

四つの動詞で大半を処理する。**SELECT**(読み)、**INSERT**(書き)、**UPDATE**(変更)、**DELETE**(削除)。さらに**JOIN**(テーブル結合)、**GROUP BY**(集計)、**WINDOW**(順位・累積)が付けば分析クエリまで書ける。学習曲線は緩やかだが*性能チューニング*は深い — インデックス設計、クエリプラン読解、統計更新。ここが熟練者と初心者を分ける。

### いつ使うか
- 関係型DBがあるどこでも — 現業アプリの既定値
- 分析・BI — [[dw]]の問い合わせ言語もほぼSQL
- AIエージェントにDB作業を委譲 — 自然言語→SQL変換が最も良くできる対象
- [[datalake]]上でAthena・Presto・TrinoでSQLが使える — データを動かさず照会
- データ探索・品質チェック — [[testing]]の一軸として使われることも

### はまりやすい罠
- **`SELECT *`の乱用** — 必要なカラムだけ取る方が性能・ネットワーク・メモリで得
- **関数でインデックス無効化** — `WHERE date(created)=...`はインデックスが効かない。カラムに関数を被せない
- **サブクエリ濫用** — JOINで書けるものを相関サブクエリで書くとN+1
- **TRUNCATE・DROP・DELETEの混同** — 失敗したら復旧不可。本番はトランザクションで包んでテスト先行
- **LLMが書いたSQLを検証なしに実行** — [[hallucination]]で存在しないカラムや誤ったJOIN条件。[[review-mindset]]が必須
- **[[cost]]の爆発** — [[datalake]]上のSQLはスキャン量課金。パーティションなしのフルスキャン1回で数千ドル

### 繋がり
[[db-basics]]の直接下位軸であり[[nosql]]との対。[[sql-vs-nosql]]・[[db-vs-dw]]が選択文脈を与える。AWS世界の[[dsql]]・[[athena]]・Redshift・RDSがSQLインターフェース。[[llmops]]時代は「自然言語→SQL」変換がエージェント能力の試金石 — 正確なSQL生成にはモデルがスキーマ・関係・制約を理解する必要がある([[context-eng]]が重要になる地点)。

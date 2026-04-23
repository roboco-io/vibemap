---
id: tidd
cat: mindset
size: 2
title:
  ko: TiDD (Ticket Driven Development)
  en: TiDD (Ticket Driven Development)
  ja: TiDD (チケット駆動開発)
refs:
  - url: https://www.redmine.org/
    title: Redmine — Flexible project management web application
    lang: en
  - url: https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue
    title: Linking a pull request to an issue (GitHub Docs)
    lang: en
  - url: https://doi.org/10.1145/2591062.2591162
    title: An empirical study on Japanese TiDD (ACM ICSE Companion, 2014)
    lang: en
extraEdges: []
---

## ko

TiDD는 **"No Ticket, No Commit"** — 티켓(이슈) 없이 커밋하지 않는다는 단 하나의 규칙으로 굴러가는 개발 프로세스다. [[tdd]]가 "구현 전에 테스트를 먼저 쓴다"고 한다면, TiDD는 "코드 변경 전에 *왜* 바꾸는지를 티켓에 먼저 쓴다"고 말한다. 2009년 일본 Redmine 커뮤니티(사카이 마코토)에서 "티켓퍼스트" 운동으로 시작됐고, 지금은 Jira·GitHub Issues·Linear 어디서든 같은 규율로 통한다.

근본 가치는 **추적성**. 프로덕션에서 이상한 동작을 발견하면 커밋 메시지 → 티켓 → 원래 요구·결정 근거까지 한 줄로 거슬러 올라갈 수 있어야 한다. 코드 리뷰에서는 "이게 왜 필요하냐?"에 PR 설명이 아니라 티켓이 답한다.

AI 시대에 오면서 의미가 한 겹 더해졌다. 티켓이 **사람과 AI가 공유하는 지속적 컨텍스트**가 된 것 — [[claude-code]] 같은 에이전트가 작업을 시작할 때, 소스·문서에 더해 티켓 본문과 토론을 읽어 *의도*를 복원한다. [[intent]]가 "왜 이 프로젝트를 하나"의 상위 축이라면, 티켓은 "왜 이 변경을 하나"의 로컬 축 — 둘 다 AI가 참조 가능한 구조화된 문맥 자산이 된다.

### 언제 쓰나
- 여러 명(또는 에이전트)이 동시에 같은 저장소를 건드리는 규모 — 누가 왜 뭘 바꿨는지 안 엉키려면 티켓이 앵커가 된다
- 감사·컴플라이언스 이력이 필수인 도메인(금융·의료·공공)
- "3개월 전 왜 이렇게 짰는지" [[git]] blame만으로는 복원되지 않는 결정이 쌓여갈 때
- [[claude-code]]나 자동화가 작업 컨텍스트로 티켓을 소비하기 시작했을 때 — 이때부터는 [[context-eng]]의 인프라가 된다

### 쉽게 빠지는 함정
- **티켓 숫자가 목표가 됨** — "이번 스프린트 42개 완료"가 KPI가 되면 실제 성과와 무관한 연극이 된다
- **티켓이 "할 일 제목"뿐** — 한 줄짜리 티켓은 컨텍스트가 없는 껍데기. 왜·제약·대안 검토가 본문에 있어야 사람·AI 모두에게 유용해진다
- **사고의 외주화** — 티켓을 의심할 수 없는 지시로 받으면 스코프·아키텍처 질문이 사라지고 코드 품질이 떨어진다
- **과도한 오버헤드** — 10분짜리 오타 수정에도 티켓을 요구하면 [[small-steps]]의 속도가 죽는다. "실험·오타·문서 오타는 예외"처럼 성문화된 탈출 조항이 필요
- **[[trunk]]/[[pr]] 리듬과 엇박** — 티켓 승인 대기로 PR이 쌓이면 오히려 통합이 어려워진다. 경량화된 승인 경로가 병행돼야 한다

### 연결
[[requirements]]와 [[intent]]가 "무엇을/왜"의 큰 그림이라면 TiDD는 그걸 **커밋 단위까지 끌고 내려오는 규율**이다. [[tdd]]는 *행동*을 고정하고, TiDD는 *의도*를 고정한다 — 둘이 함께일 때 코드와 배경이 같이 남는다. [[claude-code]]와 만나면 티켓은 [[context-eng]]의 재료가 되고, [[pr]]·[[trunk]] 워크플로우와 만나면 커밋마다 근거가 자동으로 링크된다.

## en

TiDD is the development process that runs on a single rule: **"No Ticket, No Commit."** Where [[tdd]] says "write the test before the code," TiDD says "write down *why* you're changing this — in a ticket — before you touch the code." It emerged from the Japanese Redmine community in 2009 (Makoto Sakai) as a "ticket-first" movement, and now travels the same way whether the tracker is Redmine, Jira, GitHub Issues, or Linear.

The underlying value is **traceability**. When production misbehaves, you should be able to walk from commit → ticket → original requirement and decision in one line. In code review, the answer to "why do we need this?" lives in the linked ticket, not a cleverly worded PR description.

In the AI era, the meaning has grown a layer. Tickets become **shared durable context for humans and AI alike** — an agent like [[claude-code]] starting a task reads source, docs, *and* ticket body + discussion to reconstruct *intent*. If [[intent]] is the high-axis "why this project," tickets are the local "why this change" — both are structured context assets any agent can consume.

### When to use
- Multiple humans (or agents) touching the same repo in parallel — without a ticket as the anchor, "who changed what and why" turns into noise
- Domains where audit/compliance trails are mandatory (finance, medical, public sector)
- You're accumulating decisions that [[git]] blame alone won't recover three months later
- [[claude-code]] or other automation starts consuming tickets as work context — at that point it becomes infrastructure for [[context-eng]]

### Common pitfalls
- **Ticket count becomes the goal** — "42 tickets closed this sprint" as a KPI devolves into theater divorced from real outcomes
- **Tickets reduced to titles** — a one-line ticket is a shell with no context. The *why*, the constraints, the alternatives considered have to be in the body to serve humans *or* AI
- **Outsourcing thought** — treating tickets as unquestionable directives kills scope and architecture debate; code quality slides with it
- **Overhead exceeds value** — requiring a ticket for a 10-minute typo fix murders [[small-steps]] velocity. Codify escape hatches ("experiments, typos, doc fixes are exempt")
- **Out of sync with [[trunk]]/[[pr]] rhythm** — if ticket approval blocks PRs, integration actually gets harder. Pair it with a lightweight approval path

### How it connects
Where [[requirements]] and [[intent]] hold the big-picture "what and why," TiDD is **the discipline that carries that down to the commit level**. [[tdd]] pins *behavior*; TiDD pins *intent*. Together, code and rationale survive together. Meet [[claude-code]] and tickets become feedstock for [[context-eng]]. Meet [[pr]] and [[trunk]] workflow and every commit gets linked to rationale automatically.

## ja

TiDDは**「No Ticket, No Commit」** — チケット(イシュー)なしでコミットしないという、たった一つのルールで回る開発プロセス。[[tdd]]が「実装前にテストを書け」と言うなら、TiDDは「コード変更前に*なぜ*変えるかをチケットに書け」と言う。2009年、日本のRedmineコミュニティ(さかいまこと氏)で「チケットファースト」運動として始まり、今やRedmine・Jira・GitHub Issues・Linearどこでも同じ規律として通る。

根本価値は**追跡可能性**。本番で妙な挙動を見つけたら、コミット → チケット → 元の要求・決定根拠まで一本で辿れるべき。コードレビューで「なぜ必要か?」の答えは、気の利いたPR説明ではなく、リンクされたチケット本体に宿る。

AI時代に入って意味がもう一層増した。チケットが**人とAIが共有する持続的コンテキスト**になる — [[claude-code]]のようなエージェントが作業を始めるとき、ソースやドキュメントに加えチケット本文と議論を読み、*意図*を復元する。[[intent]]が「なぜこのプロジェクトか」の上位軸なら、チケットは「なぜこの変更か」のローカル軸。どちらも任意のエージェントが消費可能な構造化コンテキスト資産となる。

### いつ使うか
- 複数人(またはエージェント)が並行で同じリポジトリを触る規模 — チケットというアンカーなしでは「誰がなぜ何を変えたか」が雑音になる
- 監査・コンプライアンス履歴が必須のドメイン(金融・医療・公共)
- 3ヶ月後に[[git]] blameだけでは復元できない決定が積み上がってくるとき
- [[claude-code]]や自動化がチケットを作業コンテキストとして消費し始めたとき — そこから先は[[context-eng]]のインフラになる

### はまりやすい罠
- **チケット数が目的化** — 「今スプリント42件完了」がKPIになると、実際の成果と無関係な芝居になる
- **タイトルだけのチケット** — 一行チケットは文脈のない殻。*なぜ*、制約、検討した代替が本文にあって初めて人・AI双方に役立つ
- **思考の外注** — チケットを疑えない指示として受けると、スコープやアーキテクチャの議論が消え、コード品質も落ちる
- **過剰なオーバーヘッド** — 10分のタイポ修正にもチケットを要求すると[[small-steps]]の速度が死ぬ。「実験・タイポ・ドキュメント修正は対象外」のような明文化された例外条項が必要
- **[[trunk]]/[[pr]]のリズムと逆行** — チケット承認待ちでPRが積み上がるとむしろ統合が難しくなる。軽量な承認経路を併走させる

### 繋がり
[[requirements]]と[[intent]]が「何を・なぜ」の大枠なら、TiDDはそれを**コミット粒度まで引き下ろす規律**。[[tdd]]が*行動*を固定し、TiDDが*意図*を固定する — 両輪で、コードと背景が一緒に残る。[[claude-code]]と組むとチケットは[[context-eng]]の素材になり、[[pr]]・[[trunk]]ワークフローと組むとコミット毎に根拠が自動でリンクされる。

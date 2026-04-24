---
id: framework
cat: tool
size: 3
title:
  ko: 프레임워크
  en: Framework
  ja: フレームワーク
refs:
  - url: https://en.wikipedia.org/wiki/Software_framework
    title: Software framework (Wikipedia)
    lang: en
  - url: https://martinfowler.com/bliki/InversionOfControl.html
    title: Inversion of Control — Martin Fowler
    lang: en
extraEdges: []
---

## ko

프레임워크는 **"뼈대와 규칙을 정해 놓고, 그 안에서만 당신의 코드를 호출해주는 구조물"**이다. 라이브러리와 다른 점이 있다 — 라이브러리는 *내가* 호출하지만, 프레임워크는 *나를* 호출한다(Inversion of Control). "이 자리에는 이런 함수가 있어야 한다"는 계약을 강제하고, 대신 라우팅·요청 처리·에러 관리·설정 로딩 같은 *배선*을 대신 해준다.

대표 예: 웹에서 Next.js·React·Vue·SvelteKit (프런트), Express·Fastify·NestJS·Django·Rails·Spring (백엔드), Flutter·SwiftUI (모바일). [[ai-coding-tools]]도 일종의 프레임워크 — 에이전트 루프가 *당신의* 프롬프트·툴을 호출한다. 프레임워크 선택은 *장기적 영향*이 있는 결정이라 가볍게 하면 안 된다. 한 번 들어가면 빠져나오기 어렵다.

### 언제 고르나
- 새 프로젝트 시작 시점 — 뼈대 선택은 뒷비용을 크게 좌우
- 팀 역량과 맞는가 — 학습 곡선과 실무자 풀
- 배포 환경과 맞는가 — [[vercel]]은 Next.js 최적화, AWS [[serverless]]는 Fastify·Serverless Framework
- [[ai-coding-tools]] 통합 — 인기 있는 프레임워크일수록 AI 생성 품질 높음
- [[testing]]·[[lint]]·[[cicd]] 생태계 지원

### 쉽게 빠지는 함정
- **최신 것에 휩쓸림** — 매달 새 프레임워크가 뜬다. *성숙*이 안정성. 2년 이상 큰 조직이 프로덕션에 쓰는 것 중심으로
- **너무 많은 추상화** — 프레임워크가 "마법"처럼 보이면 디버깅이 고통. 내부 동작을 대략이라도 이해
- **벤더 락인** — 독점 기능에 깊이 의존 후 이전 시 재작성. 표준 인터페이스 위주 사용
- **[[simplify]] 대 reality** — 프레임워크가 요구하는 상용구(boilerplate)가 [[pitfalls]]의 "LLM 과잉 설계"와 결합하면 폭발
- **성능 블랙박스** — 프레임워크 오버헤드를 측정하지 않으면 병목 위치를 모름. 프로덕션 [[monitoring]] 필수
- **버전 마이그레이션 지연** — major 업데이트를 몇 년 미루면 보안 CVE + 도구 지원 단절. [[cost]] 관점에서 정기 업그레이드 예산
- **[[ai-coding-tools]]가 옛 버전 기준** — 학습 컷오프 이전 버전의 API를 제안하면 [[hallucination]]. CLAUDE.md에 "we use Next.js 15.x" 같은 버전 명시

### 프레임워크 vs 라이브러리 vs 플랫폼
- **라이브러리** — 함수 컬렉션. 내가 호출. lodash·numpy
- **프레임워크** — 구조. 내 코드를 호출. Django·Rails
- **플랫폼** — 실행 환경까지 포함. [[vercel]]·AWS Amplify
경계는 흐려지지만 이 구분이 설계 선택을 명확히 한다.

### 연결
[[ai-coding-tools]]·[[package-mgr]]·[[lint]]·[[testing]]과 짝 — 프레임워크가 생태계를 결정. [[simplify]]의 반대 축 — 추상화를 더하는 방향. [[microservices]] 아키텍처에선 서비스별로 다른 프레임워크를 쓰는 polyglot 가능. [[claude-code]] 같은 에이전트도 일종의 "에이전트 프레임워크" — [[harness-eng]]과 교차.

## en

A framework is **"scaffolding with rules that calls your code, rather than waits for you to call it."** It differs from a library: you call a library; a framework calls *you* (Inversion of Control). It enforces contracts — "a function of this shape goes here" — and in return handles wiring like routing, request handling, error management, and config loading.

Canonical examples: Next.js, React, Vue, SvelteKit (frontend); Express, Fastify, NestJS, Django, Rails, Spring (backend); Flutter, SwiftUI (mobile). [[ai-coding-tools]] are frameworks too — the agent loop calls *your* prompts and tools. Framework choice has *long-term consequences* and shouldn't be lightweight. Once in, getting out is hard.

### When to choose
- Starting a new project — the scaffolding decision dominates long-run cost
- Team capability fit — learning curve and hiring pool
- Deployment environment fit — [[vercel]] is optimized for Next.js; AWS [[serverless]] likes Fastify / Serverless Framework
- [[ai-coding-tools]] integration — more popular frameworks generate better AI output
- [[testing]], [[lint]], [[cicd]] ecosystem support

### Common pitfalls
- **Chasing new and shiny** — a new framework drops every month. *Maturity* is stability. Favor what large orgs run in production for 2+ years
- **Too much abstraction** — when the framework feels "magical," debugging hurts. At least understand the internals roughly
- **Vendor lock-in** — deep dependency on proprietary features means a rewrite to migrate. Prefer standard interfaces
- **[[simplify]] vs reality** — framework-required boilerplate plus the "LLM over-engineers" entry of [[pitfalls]] compounds
- **Performance as a black box** — unmeasured framework overhead hides bottlenecks. Production [[monitoring]] is mandatory
- **Deferring version migration** — skipping major upgrades for years invites security CVEs and lost tool support. Budget regular upgrades in [[cost]]
- **[[ai-coding-tools]] stuck on old versions** — pre-cutoff APIs yield [[hallucination]]. Pin versions in CLAUDE.md ("we use Next.js 15.x")

### Framework vs library vs platform
- **Library** — a collection of functions you call. lodash, numpy
- **Framework** — structure that calls your code. Django, Rails
- **Platform** — includes the runtime environment. [[vercel]], AWS Amplify
The boundaries blur, but the distinction keeps design choices clear.

### How it connects
Pairs with [[ai-coding-tools]], [[package-mgr]], [[lint]], [[testing]] — the framework sets the ecosystem. Opposite axis from [[simplify]] — it adds abstraction. In [[microservices]], polyglot framework choice per service is possible. Agents like [[claude-code]] are themselves "agent frameworks" — the intersection with [[harness-eng]].

## ja

フレームワークは**「骨組みとルールを定めて、その中であなたのコードを呼び出してくれる構造物」**。ライブラリとの違い — ライブラリは*私が*呼び出すが、フレームワークは*私を*呼び出す(Inversion of Control)。「この場所にはこういう関数があるべき」という契約を強制し、代わりにルーティング・リクエスト処理・エラー管理・設定読み込みなどの*配線*を代行する。

代表例: Web系でNext.js・React・Vue・SvelteKit(フロント)、Express・Fastify・NestJS・Django・Rails・Spring(バックエンド)、Flutter・SwiftUI(モバイル)。[[ai-coding-tools]]も一種のフレームワーク — エージェントループが*あなたの*プロンプトやツールを呼び出す。フレームワーク選択は*長期的影響*のある判断なので軽くしてはならない。一度入れば抜け出すのが難しい。

### いつ選ぶか
- 新プロジェクト開始時点 — 骨組み選択が後のコストを大きく左右する
- チーム能力との適合 — 学習曲線と実務者プール
- デプロイ環境との適合 — [[vercel]]はNext.js最適化、AWS [[serverless]]はFastify・Serverless Framework
- [[ai-coding-tools]]統合 — 人気フレームワークほどAI生成品質が高い
- [[testing]]・[[lint]]・[[cicd]]エコシステム支援

### はまりやすい罠
- **新しいものに流される** — 毎月新フレームワークが出る。*成熟*が安定性。2年以上大規模組織が本番で使うものを中心に
- **過度な抽象化** — フレームワークが「魔法」に見えるとデバッグが苦痛。内部動作を大まかでも理解する
- **ベンダーロックイン** — 独自機能に深く依存すると移行時に書き直し。標準インターフェース中心に
- **[[simplify]] vs 現実** — フレームワークが要求する定型コード(boilerplate)が[[pitfalls]]の「LLM過剰設計」と合わさって爆発
- **性能のブラックボックス** — フレームワークのオーバーヘッドを測らなければボトルネック位置が分からない。本番[[monitoring]]必須
- **バージョンマイグレーション遅延** — メジャーアップデートを数年先送りすると、セキュリティCVE + ツールサポート切れ。[[cost]]観点で定期アップグレード予算
- **[[ai-coding-tools]]が旧版基準** — 学習カットオフ以前のAPIを提案すると[[hallucination]]。CLAUDE.mdに「we use Next.js 15.x」のようにバージョン明記

### フレームワーク vs ライブラリ vs プラットフォーム
- **ライブラリ** — 関数のコレクション。私が呼ぶ。lodash・numpy
- **フレームワーク** — 構造。私のコードを呼ぶ。Django・Rails
- **プラットフォーム** — 実行環境まで含む。[[vercel]]・AWS Amplify
境界は曖昧だがこの区分が設計選択を明確にする。

### 繋がり
[[ai-coding-tools]]・[[package-mgr]]・[[lint]]・[[testing]]と対 — フレームワークがエコシステムを決める。[[simplify]]の反対軸 — 抽象化を増やす方向。[[microservices]]ではサービスごとに違うフレームワークを使うpolyglotが可能。[[claude-code]]のようなエージェントも一種の「エージェントフレームワーク」 — [[harness-eng]]との交差。

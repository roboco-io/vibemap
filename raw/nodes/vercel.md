---
id: vercel
cat: ops
size: 3
title:
  ko: Vercel
  en: Vercel
  ja: Vercel
refs:
  - url: https://vercel.com/docs
    title: Vercel Documentation
    lang: en
  - url: https://vercel.com/docs/frameworks/nextjs
    title: Next.js on Vercel (Vercel Docs)
    lang: en
extraEdges: []
---

## ko

Vercel은 **"프런트엔드 개발자를 위한 관리형 배포 플랫폼"**이다. [[git]] 저장소를 연결하면 푸시할 때마다 빌드·배포·CDN 배포까지 자동으로 돌아간다. Next.js를 만든 회사답게 Next.js·React·Vue·Svelte·SvelteKit 등 모던 프런트엔드 프레임워크에 최적화돼 있고, "Zero-config 배포"가 핵심 약속이다. AWS 서버리스를 "직접 배선하지 않고 쓰는" 포장이라 생각해도 비슷하다.

내부는 [[serverless]] 함수 + 엣지 네트워크 + CDN이 합쳐진 구조. `/api` 디렉토리의 함수는 서버리스로, 페이지는 정적/ISR/스트리밍 SSR 중 선택. Preview Deployment가 특히 강력 — 모든 PR이 자체 URL로 배포돼 리뷰어가 실물로 확인 가능. 단점은 [[cost]] — 트래픽이 커지면 빠르게 비싸진다.

### 언제 쓰나
- **Next.js·React SPA·정적 사이트** — 빌드·배포·CDN을 고민하고 싶지 않을 때 최적
- **v0·Lovable 등 AI 생성 앱** — 이 도구들은 Vercel 배포를 기본으로 사용
- **빠른 프로토타입·MVP** — 도메인만 준비하면 1분 내 배포
- **[[pr]] 기반 협업** — Preview Deployment로 디자이너·PM이 실물 확인
- **작은~중간 규모 팀** — 운영 부담 0에 가까움

### 쉽게 빠지는 함정
- **[[cost]] 폭발** — 트래픽이 월 1TB 넘으면 과금이 빠르게 오른다. 손익분기에서 [[s3]] + CloudFront로 이관 검토
- **Vendor lock-in** — Vercel-only 기능 (Edge Config, Analytics, KV)에 의존하면 이식 비용. 표준 Next.js 기능 중심
- **서버리스 제약이 숨어 있음** — Vercel 함수도 [[lambda]]처럼 10~60초 제한, cold start 있음. 긴 작업·상시 커넥션은 부적합
- **빌드 시간 증가** — 대형 프로젝트에서 빌드가 10분 넘으면 배포 흐름이 끊김. Turborepo·캐시·빌드 분할로 관리
- **복잡한 백엔드는 어색** — Vercel은 프런트엔드 중심. 복잡한 워크플로우·큐·DB는 [[serverless]](AWS) 또는 [[ecs]] 별도 배포
- **도메인·SSL 미설정으로 프로덕션** — 기본은 `.vercel.app`. 프로덕션이면 [[domain]] 연결 + SSL 자동 발급

### Vercel vs 대안
- **vs Netlify** — 거의 대등, Next.js 강세는 Vercel
- **vs Cloudflare Pages** — 가격·엣지 네트워크는 Cloudflare가 유리, Next.js 통합은 Vercel
- **vs AWS Amplify** — AWS 생태계 통합은 Amplify, 개발자 경험은 Vercel
- **vs 자체 [[serverless]]** — 제어·비용은 자체가 유리, 시간·인력은 Vercel

### 연결
[[ai-coding-tools]]의 프런트엔드 생성물이 흘러가는 기본 배포처. [[git]] + [[pr]] + [[cicd]]를 플랫폼 레벨에서 통합. [[serverless]]의 "단순 버전"이라 보면 맞다 — [[lambda]]·[[apigw]]·CloudFront를 하나로 포장. [[cost]]·[[monitoring]]은 Vercel 자체 대시보드 + 외부 툴 (Datadog·Sentry) 병행이 흔함. [[domain]] 설정이 Vercel 프로젝트의 첫 관문.

## en

Vercel is **a managed deployment platform built for frontend developers**. Connect a [[git]] repo, push, and it builds, deploys, and distributes over a CDN automatically. As the company behind Next.js, it's optimized for Next.js, React, Vue, Svelte, SvelteKit and other modern frontend frameworks; "zero-config deploy" is the core promise. Think of it as AWS serverless with the wiring already done.

Under the hood it's [[serverless]] functions + edge network + CDN. Functions in `/api` run serverlessly; pages are static, ISR, or streaming SSR. Preview Deployments stand out — every PR gets its own URL so reviewers see the real thing. The trade-off is [[cost]] — pricing climbs quickly as traffic grows.

### When to use
- **Next.js, React SPAs, static sites** — you don't want to think about build, deploy, or CDN
- **AI-generated apps from v0, Lovable, etc.** — those tools default to Vercel
- **Fast prototypes and MVPs** — register a domain and deploy within a minute
- **[[pr]]-based collaboration** — Preview Deployments let designers/PMs check the actual thing
- **Small-to-midsize teams** — operational overhead is near zero

### Common pitfalls
- **[[cost]] blowouts** — past ~1 TB/mo traffic the bill climbs fast. At break-even, move to [[s3]] + CloudFront
- **Vendor lock-in** — depending on Vercel-only features (Edge Config, Analytics, KV) increases portability cost. Stick to standard Next.js features
- **Hidden serverless constraints** — Vercel functions have the same [[lambda]]-class limits (10–60 s, cold starts). Long-running or persistent-connection workloads don't fit
- **Build-time creep** — past 10-minute builds, the deploy flow fractures. Manage with Turborepo, caching, build splitting
- **Complex backends feel awkward** — Vercel is frontend-first. Complex workflows, queues, or DBs live better on AWS [[serverless]] or [[ecs]]
- **Shipping to production without a [[domain]] / SSL** — default is `.vercel.app`. For production, wire a [[domain]] and let Vercel auto-provision SSL

### Vercel vs alternatives
- **vs Netlify** — roughly even; Vercel wins on Next.js integration
- **vs Cloudflare Pages** — Cloudflare wins on price and edge; Vercel wins on Next.js integration
- **vs AWS Amplify** — Amplify for AWS ecosystem; Vercel for developer experience
- **vs rolling your own [[serverless]]** — DIY wins on control and cost; Vercel wins on time and effort

### How it connects
The default landing zone for frontend output from [[ai-coding-tools]]. Integrates [[git]] + [[pr]] + [[cicd]] at the platform layer. Think "simplified [[serverless]]" — [[lambda]], [[apigw]], and CloudFront packaged as one. For [[cost]] and [[monitoring]], people usually combine Vercel's own dashboard with external tooling (Datadog, Sentry). [[domain]] configuration is the first real step on any Vercel project.

## ja

Vercelは**「フロントエンド開発者向けの管理型デプロイプラットフォーム」**。[[git]]リポジトリを繋ぐだけでpushごとにビルド・デプロイ・CDN配信が自動で回る。Next.jsを作った会社だけあって、Next.js・React・Vue・Svelte・SvelteKit等のモダンフロントエンドフレームワークに最適化され、「Zero-configデプロイ」が核心約束。AWSサーバーレスを「自分で配線せずに使う」包装と思ってよい。

内部は[[serverless]]関数 + エッジネットワーク + CDNの組合せ。`/api`ディレクトリの関数はサーバーレスで、ページは静的/ISR/ストリーミングSSRから選択。Preview Deploymentが特に強力 — 全PRが専用URLでデプロイされレビュアーが実物で確認可能。欠点は[[cost]] — トラフィックが増えると急速に高くなる。

### いつ使うか
- **Next.js・React SPA・静的サイト** — ビルド・デプロイ・CDNを考えたくないとき最適
- **v0・Lovable等のAI生成アプリ** — これらのツールはVercelデプロイが既定
- **高速プロトタイプ・MVP** — ドメインだけ用意すれば1分以内にデプロイ
- **[[pr]]ベースの協業** — Preview Deploymentでデザイナー・PMが実物確認
- **小〜中規模チーム** — 運用負荷がほぼゼロ

### はまりやすい罠
- **[[cost]]爆発** — トラフィックが月1TBを超えると課金が急上昇。損益分岐で[[s3]] + CloudFrontへ移行検討
- **Vendor lock-in** — Vercel固有機能(Edge Config、Analytics、KV)に依存すると移植コスト。標準Next.js機能中心に
- **サーバーレス制約が隠れている** — Vercel関数も[[lambda]]同様10〜60秒制限、cold startあり。長時間・常時接続は不適
- **ビルド時間増加** — 大規模プロジェクトで10分超になるとデプロイフローが途切れる。Turborepo・キャッシュ・ビルド分割で管理
- **複雑なバックエンドは不自然** — Vercelはフロント中心。複雑なワークフロー・キュー・DBはAWS [[serverless]]か[[ecs]]別デプロイ
- **[[domain]]・SSL未設定で本番** — 既定は`.vercel.app`。本番なら[[domain]]連携 + SSL自動発行

### Vercel vs 代替
- **vs Netlify** — ほぼ対等、Next.jsはVercelが強い
- **vs Cloudflare Pages** — 価格・エッジネットワークはCloudflareが有利、Next.js統合はVercel
- **vs AWS Amplify** — AWSエコシステム統合はAmplify、開発者体験はVercel
- **vs 自前[[serverless]]** — 制御・コストは自前が有利、時間・人手はVercel

### 繋がり
[[ai-coding-tools]]のフロントエンド生成物が流れる既定デプロイ先。[[git]] + [[pr]] + [[cicd]]をプラットフォームレベルで統合。[[serverless]]の「簡易版」と見ると正しい — [[lambda]]・[[apigw]]・CloudFrontを一つに包装。[[cost]]・[[monitoring]]はVercel自身のダッシュボード + 外部ツール(Datadog・Sentry)の併用が一般的。[[domain]]設定はVercelプロジェクトの最初の関門。

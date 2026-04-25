---
id: security
cat: mindset
size: 2
title:
  ko: 보안
  en: Security
  ja: セキュリティ
refs:
  - url: https://owasp.org/Top10/
    title: OWASP Top 10 — Web Application Security Risks
    lang: en
  - url: https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html
    title: Security Pillar — AWS Well-Architected Framework
    lang: en
  - url: https://owasp.org/www-project-top-10-for-large-language-model-applications/
    title: OWASP Top 10 for Large Language Model Applications
    lang: en
extraEdges: []
---

## ko

보안은 **"공격자가 들어올 수 있는 모든 길을, 들어오기 전에 닫는 규율"**이다. 기능 개발이 "무엇을 *할 수 있게* 할까?"라면 보안은 "무엇을 *못 하게* 할까?"의 반대축. 코드·인프라·데이터·AI 시스템 어느 한 곳이라도 약하면 전체가 무너지므로, 모든 레이어에 *defense in depth*(다층 방어)를 깐다. 2026년 기준 가장 큰 변화는 *AI가 코드를 쓰는 시대의 새 위협면* — 가짜 의존성, 프롬프트 누출, 비검토 자동 머지가 새 1차 공격면이 됐다.

세 가지 영역으로 갈린다. **애플리케이션 보안** — OWASP Top 10이 대표(인젝션·인증·접근제어·민감 데이터). **클라우드/인프라 보안** — IAM 최소 권한, 시크릿 관리, 네트워크 격리, 암호화. **AI/LLM 보안** — 프롬프트 인젝션, 데이터 누출, 모델 탈옥, [[hallucination]]된 의존성. 새로 등장한 OWASP LLM Top 10이 이 영역의 표준 출발점.

### 언제 챙기나
- 첫 프로토타입에서부터 — 나중에 "올리기 직전 보안 검토"는 거의 항상 늦다. *secure by design*
- [[ai-coding-tools]]·[[claude-code]] 도입 시점 — 자동 생성 코드는 *기본값으로* 의심
- [[serverless]]/[[microservices]]/[[iac]] 같은 분산 환경에 들어가기 전 — IAM 경계가 곧 보안 경계
- 외부 API·결제·PII를 다루기 시작할 때 — 컴플라이언스 요구가 따라옴
- 사고 발생 시 — 사후 대응만으로는 부족. 사후 분석을 [[testing]]·[[cicd]] 자산으로 박제

### 쉽게 빠지는 함정
- **보안을 "마지막 단계"로** — 출시 직전에 추가하면 비용이 폭발한다. 설계 단계부터 *위협 모델링*
- **시크릿을 코드/`.env`/프롬프트에** — [[git]] 한 번 푸시되면 회수 불능. Secrets Manager·Parameter Store·환경 주입
- **[[ai-coding-tools]] 출력을 그대로 머지** — [[hallucination]]된 라이브러리 이름, 잘못된 인증 흐름. [[review-mindset]] 통과가 필수
- **공급망 무방비** — `npm install` 한 번에 수백 패키지. [[package-mgr]] SBOM·Dependabot·서명 검증을 [[cicd]]에 박아둘 것
- **프롬프트에 시크릿 주입** — LLM 호출 로그·중간 캐시·학습 데이터로 누출. 컨텍스트에서 시크릿을 *분리*해 런타임에만 결합
- **IAM `*:*`** — "일단 다 열고 나중에 좁히자"는 절대 안 좁혀진다. 처음부터 최소 권한
- **보안 알람 무시 문화** — 거짓 양성 비율이 높으면 진짜 양성도 묻힌다. [[monitoring]]·[[aiops]]로 신호 정리
- **컴플라이언스 ≠ 보안** — 체크리스트만 통과하고 안전하다고 믿는 함정. 실제 위협 모델링 필요

### 핵심 도구·실천
- **위협 모델링** — STRIDE/DREAD 같은 프레임워크로 "누가, 무엇을, 왜"를 글로
- **자동 스캔 in [[cicd]]** — SAST(코드)/DAST(런타임)/SCA(의존성)/시크릿 스캔 4종 세트
- **[[github]] 무료 자산** — Dependabot, secret scanning, CodeQL을 켜는 것만으로도 큰 차이
- **[[iac]]에 보안 박기** — 보안 그룹·IAM 정책을 코드로 두면 [[gitops]] 리뷰 대상이 된다
- **[[llmops]] 보안 메트릭** — 프롬프트 인젝션 탐지·민감정보 누출률 모니터링

### 연결
[[pitfalls]]의 가장 큰 부분집합 중 하나이자 [[review-mindset]]의 자동·체계화. [[cicd]]·[[iac]]·[[gitops]]가 보안 게이트의 실행 환경. [[github]]·[[package-mgr]]·[[env]]·[[testing]]이 일상에서 만나는 접점. AI 시대에는 [[claude-code]]·[[ai-coding-tools]]·[[llmops]]·[[hallucination]]·[[harness-eng]]이 모두 새 보안 표면이 된다 — 에이전트의 권한·툴·컨텍스트 설계가 곧 보안 설계.

## en

Security is **"the discipline of closing every path an attacker could take, before they take it."** If feature work answers "what should this be *able* to do?", security answers the opposite axis: "what should this *not* do?" Any weak layer — code, infrastructure, data, or AI — collapses the rest, so the practice is *defense in depth*: layered controls everywhere. The biggest change as of 2026 is the new attack surface introduced by *AI writing code* — fake dependencies, prompt leakage, unreviewed auto-merge are now first-class entry points.

Three rough territories. **Application security** — OWASP Top 10 (injection, auth, access control, sensitive data). **Cloud / infrastructure security** — IAM least privilege, secrets management, network isolation, encryption. **AI/LLM security** — prompt injection, data leakage, model jailbreaks, [[hallucination]]-ed dependencies. The newer OWASP LLM Top 10 is the canonical starting point for that territory.

### When to attend to it
- From the first prototype — adding "security review just before launch" is almost always too late. *Secure by design*
- The moment you adopt [[ai-coding-tools]] or [[claude-code]] — auto-generated code is suspect *by default*
- Before going distributed with [[serverless]] / [[microservices]] / [[iac]] — IAM boundaries become security boundaries
- The moment you touch external APIs, payments, or PII — compliance follows
- After an incident — postmortem becomes [[testing]] and [[cicd]] assets so the same hole doesn't reopen

### Common pitfalls
- **Treating security as "the last stage"** — bolting it on at release time costs more than designing it in. Threat-model from the start
- **Secrets in code, `.env`, or prompts** — once pushed via [[git]], unrecoverable. Use Secrets Manager / Parameter Store / runtime injection
- **Merging [[ai-coding-tools]] output as-is** — [[hallucination]]-ed library names, wrong auth flows. [[review-mindset]] is non-negotiable
- **Defenseless supply chain** — one `npm install` pulls hundreds of packages. Bake [[package-mgr]] SBOM, Dependabot, signature verification into [[cicd]]
- **Pasting secrets into prompts** — they leak via LLM logs, intermediate caches, training data. Keep secrets *separate* from context, joined only at runtime
- **IAM `*:*`** — "open everything, narrow later" never gets narrowed. Least privilege from day one
- **Alert fatigue culture** — high false-positive rates bury true positives. Use [[monitoring]] and [[aiops]] to clean the signal
- **Compliance ≠ security** — passing the checklist and assuming safety is the trap. Real threat modeling still required

### Core tools and practices
- **Threat modeling** — frameworks like STRIDE/DREAD turning "who, what, why" into writing
- **Automated scanning in [[cicd]]** — SAST (code) / DAST (runtime) / SCA (deps) / secret scanning, the four-pack
- **Free [[github]] assets** — turning on Dependabot, secret scanning, and CodeQL alone moves the needle
- **Security baked into [[iac]]** — security groups and IAM as code make them reviewable via [[gitops]]
- **[[llmops]] security metrics** — track prompt injection detection rates and sensitive-data leakage

### How it connects
A major subset of [[pitfalls]] and the systematized form of [[review-mindset]]. [[cicd]], [[iac]], [[gitops]] are the runtime for security gates. [[github]], [[package-mgr]], [[env]], [[testing]] are the day-to-day touch points. In the AI era, [[claude-code]], [[ai-coding-tools]], [[llmops]], [[hallucination]], and [[harness-eng]] are all new security surfaces — agent permissions, tool schemas, and context design all *are* security design now.

## ja

セキュリティは**「攻撃者が入ってきうるあらゆる道を、入る前に塞ぐ規律」**。機能開発が「何を*できるよう*にするか」を問うなら、セキュリティはその逆軸 ——「何を*できないよう*にするか」。コード・インフラ・データ・AIシステムのどこか一層が弱ければ全体が崩れるので、すべてのレイヤに*defense in depth*(多層防御)を敷く。2026年最大の変化は*AIがコードを書く時代の新しい攻撃面* —— 偽の依存関係、プロンプト漏洩、未レビューの自動マージが新たな第一級の侵入口になった。

三つの領域に分かれる。**アプリケーションセキュリティ** —— OWASP Top 10が代表(インジェクション、認証、アクセス制御、機微データ)。**クラウド・インフラセキュリティ** —— IAM最小権限、シークレット管理、ネットワーク隔離、暗号化。**AI/LLMセキュリティ** —— プロンプトインジェクション、データ漏洩、モデル脱獄、[[hallucination]]された依存関係。新たなOWASP LLM Top 10がこの領域の標準的な出発点。

### いつ気にするか
- 最初のプロトタイプから —— 「リリース直前のセキュリティレビュー」はほぼ手遅れ。*secure by design*
- [[ai-coding-tools]]や[[claude-code]]を導入した瞬間 —— 自動生成コードは*既定で*疑う
- [[serverless]]/[[microservices]]/[[iac]]の分散環境に入る前 —— IAM境界がセキュリティ境界になる
- 外部API・決済・PIIを扱い始めるとき —— コンプライアンスが付いてくる
- 事故発生後 —— 事後分析を[[testing]]や[[cicd]]の資産として残し、同じ穴が再び開かないようにする

### はまりやすい罠
- **セキュリティを「最終段階」扱い** —— 出荷直前に付け足すとコストが爆発。設計段階から脅威モデリング
- **シークレットをコード/`.env`/プロンプトに** —— [[git]]で一度pushすれば回収不能。Secrets Manager・Parameter Store・ランタイム注入で
- **[[ai-coding-tools]]の出力をそのままマージ** —— [[hallucination]]されたライブラリ名、誤った認証フロー。[[review-mindset]]は譲れない
- **無防備なサプライチェーン** —— 一回の`npm install`で数百パッケージ。[[package-mgr]] SBOM・Dependabot・署名検証を[[cicd]]に焼く
- **プロンプトにシークレットを貼る** —— LLMログ・中間キャッシュ・学習データから漏れる。コンテキストとシークレットを*分離*し、ランタイムだけで結合
- **IAMの`*:*`** —— 「とりあえず全開、後で絞る」は絶対に絞られない。初日から最小権限
- **アラート疲労の文化** —— 偽陽性が多いと真陽性が埋もれる。[[monitoring]]や[[aiops]]で信号を整える
- **コンプライアンス ≠ セキュリティ** —— チェックリストを通過したら安全と思い込む罠。実際の脅威モデリングは依然必要

### 中核ツール・実践
- **脅威モデリング** —— STRIDE/DREADなどのフレームワークで「誰が、何を、なぜ」を書き出す
- **[[cicd]]内の自動スキャン** —— SAST(コード)/DAST(ランタイム)/SCA(依存)/シークレットスキャンの4点セット
- **[[github]]の無料資産** —— Dependabot・secret scanning・CodeQLをONにするだけで効果大
- **[[iac]]にセキュリティを焼く** —— セキュリティグループやIAMポリシーをコード化すると[[gitops]]のレビュー対象になる
- **[[llmops]]のセキュリティ指標** —— プロンプトインジェクション検出率や機微情報漏洩率をモニタリング

### 繋がり
[[pitfalls]]の最大の部分集合の一つであり、[[review-mindset]]の自動・体系化。[[cicd]]・[[iac]]・[[gitops]]がセキュリティゲートの実行環境。[[github]]・[[package-mgr]]・[[env]]・[[testing]]が日常の接点。AI時代には[[claude-code]]・[[ai-coding-tools]]・[[llmops]]・[[hallucination]]・[[harness-eng]]がすべて新しい攻撃面になる —— エージェントの権限・ツール・コンテキスト設計こそがセキュリティ設計だ。

---
id: package-mgr
cat: tool
size: 3
title:
  ko: 패키지 매니저
  en: Package Manager
  ja: パッケージマネージャ
refs:
  - url: https://docs.npmjs.com/about-npm
    title: About npm (npm Docs)
    lang: en
  - url: https://pnpm.io/motivation
    title: pnpm — Motivation
    lang: en
  - url: https://en.wikipedia.org/wiki/Package_manager
    title: Package manager (Wikipedia)
    lang: en
extraEdges: []
---

## ko

패키지 매니저는 **"외부 라이브러리의 설치·버전 고정·업데이트·제거를 자동화하는 도구"**다. 30년 전엔 `.tar.gz`를 다운로드해 압축 풀고 수동 링크하던 작업이, 오늘은 `npm install`이나 `pip install` 한 줄. 이 단순함이 현대 소프트웨어의 *재사용 문화*를 가능하게 했지만, 동시에 [[pitfalls]]의 "의존성 지옥"도 낳았다.

생태계별 표준. **JavaScript**: npm(표준, 느림), pnpm(빠름, 디스크 효율), Bun(초고속). **Python**: pip + uv(신생, 빠름), Poetry(의존성 해결). **Rust**: cargo(언어 내장). **Go**: go modules(언어 내장). **Java/Kotlin**: Maven, Gradle. 같은 기능도 생태계별로 성숙도·속도·철학이 다르다. 공통은 세 파일 — **매니페스트**(package.json, Cargo.toml, 무엇을 설치할지), **락 파일**(package-lock.json, Cargo.lock, 정확히 어느 버전이 설치됐는지), **모듈 디렉토리**(node_modules, 실제 파일).

### 언제 쓰나
- 모든 프로젝트 — 순수 파일 시스템·의존성 제로 프로젝트가 오히려 예외적(VibeMap이 그런 예외)
- 보안 패치 추적 — Dependabot·Snyk로 자동화
- 모노레포 — pnpm·Nx·Turbo로 여러 패키지 한 번에 관리
- [[ai-coding-tools]] 생성 코드 검증 — [[hallucination]]된 패키지명·존재하지 않는 버전 탐지

### 쉽게 빠지는 함정
- **의존성 비대** — `npm install` 한 번에 500MB+. node_modules만으로 디스크 가득. 정말 필요한 것만
- **락 파일 무시** — `.gitignore`에 포함시키면 "내 PC에선 됐는데"의 전형. 락 파일은 반드시 커밋
- **메이저 업그레이드 누적** — 3년 방치 후 한 번에 업그레이드 시도 → 지옥. [[cost]]처럼 꾸준히 조금씩
- **[[hallucination]]된 패키지** — LLM이 존재하지 않는 `aws-boto-helper` 같은 이름 제안. 반드시 [[review-mindset]]으로 실재 확인. Typosquatting도 조심
- **시크릿이 들어간 `.npmrc`** — 인증 토큰을 리포에 커밋하면 유출. 환경변수나 Secrets Manager
- **전역 설치 남발** — `-g` 플래그로 시스템 오염. 프로젝트별 격리가 원칙
- **glob 패치 업데이트** — `"^1.0.0"` 같은 표기가 안전해 보이지만 minor 업데이트로 회귀 가능. 락 파일이 실제 방어선

### 선택 기준
- **속도**: Bun > pnpm > npm / uv > pip
- **디스크 효율**: pnpm(심볼릭 링크로 중복 제거)
- **안정성**: npm·pip (가장 오래, 가장 널리)
- **모노레포 친화**: pnpm·cargo workspaces·Nx

### 보안·공급망
- **SBOM**(Software Bill of Materials) — 어떤 의존성이 어떤 버전인지 공식 목록
- **Dependabot·Renovate** — CVE·업데이트 자동 PR
- **supply chain attacks** — 인기 패키지가 악성 코드로 오염되는 사고. 락 파일 + 서명 검증이 방어선
- **AI 제안 패키지 검증** — 다운로드 수·유지보수자·최근 커밋으로 신뢰성 평가

### 연결
[[framework]]과 짝 — 프레임워크가 권하는 매니저가 대개 정답. [[cicd]] 파이프라인에서 캐시 설계가 빌드 속도의 큰 변수. [[testing]]·[[lint]] 도구도 패키지로 설치·실행. [[cost]] 관점에서 CI 빌드 시간과 디스크 사용량에 직접 영향. [[ai-coding-tools]]가 의존성을 추가할 때 [[pitfalls]] 항목 중 하나로 매번 의심 대상.

## en

A package manager is **"a tool that automates installing, pinning, updating, and removing external libraries."** Thirty years ago, this was "download a `.tar.gz`, extract, link by hand"; today it's a one-liner like `npm install` or `pip install`. That simplicity enabled modern software's *reuse culture* — but it also gave birth to the "dependency hell" entry in [[pitfalls]].

Standards by ecosystem. **JavaScript**: npm (standard, slow), pnpm (fast, disk-efficient), Bun (blazing fast). **Python**: pip + uv (new, fast), Poetry (dependency resolution). **Rust**: cargo (language-native). **Go**: go modules (language-native). **Java / Kotlin**: Maven, Gradle. Same role, different maturity, speed, philosophy per ecosystem. Common across all: three files — **manifest** (package.json, Cargo.toml — what to install), **lockfile** (package-lock.json, Cargo.lock — exactly which versions), **modules directory** (node_modules — the actual files).

### When to use
- Every project — dependency-free projects are the exception (VibeMap is such an exception)
- Tracking security patches — automated via Dependabot, Snyk
- Monorepos — pnpm, Nx, Turbo manage many packages at once
- Validating [[ai-coding-tools]] output — detecting [[hallucination]]-ed names or nonexistent versions

### Common pitfalls
- **Dependency bloat** — one `npm install` hits 500 MB+. node_modules can dominate your disk. Only what you actually need
- **Ignoring the lockfile** — `.gitignore`-ing it is the classic "works on my machine." Always commit
- **Accumulated major upgrades** — skipping for 3 years and then upgrading is hell. Like [[cost]]: small, steady
- **[[hallucination]]-ed packages** — LLMs suggest nonexistent names like `aws-boto-helper`. Always verify existence with [[review-mindset]]. Watch for typosquatting too
- **Secrets in `.npmrc`** — committing auth tokens leaks them. Use env vars or Secrets Manager
- **Global install sprawl** — `-g` pollutes the system. Per-project isolation is the rule
- **Glob-pattern updates** — `"^1.0.0"` looks safe but minor updates can regress. The lockfile is the real defense

### Choosing criteria
- **Speed**: Bun > pnpm > npm / uv > pip
- **Disk efficiency**: pnpm (symlink-based deduplication)
- **Stability**: npm, pip (oldest, most widely used)
- **Monorepo-friendly**: pnpm, cargo workspaces, Nx

### Security / supply chain
- **SBOM** (Software Bill of Materials) — an official list of which dependencies at which versions
- **Dependabot, Renovate** — auto-PR for CVEs and updates
- **Supply-chain attacks** — popular packages getting compromised with malicious code. Lockfile + signature verification is the defense
- **Verify AI-suggested packages** — assess trust via download count, maintainers, recent commits

### How it connects
Pairs with [[framework]] — the manager the framework recommends is usually the right answer. In [[cicd]] pipelines, cache design is a big build-speed variable. [[testing]] and [[lint]] tools install and run as packages too. From a [[cost]] angle, impacts CI build time and disk usage. When [[ai-coding-tools]] add dependencies, it's the [[pitfalls]] item to question every time.

## ja

パッケージマネージャは**「外部ライブラリの導入・バージョン固定・更新・削除を自動化するツール」**。30年前は`.tar.gz`をダウンロードして展開し手動でリンクしていた作業が、今日は`npm install`や`pip install`の一行。この単純さが現代ソフトウェアの*再利用文化*を可能にしたが、同時に[[pitfalls]]の「依存地獄」も生んだ。

エコシステム別標準。**JavaScript**: npm(標準、遅い)、pnpm(速い、ディスク効率)、Bun(超高速)。**Python**: pip + uv(新興、速い)、Poetry(依存解決)。**Rust**: cargo(言語内蔵)。**Go**: go modules(言語内蔵)。**Java/Kotlin**: Maven、Gradle。同じ機能でもエコシステム別に成熟度・速度・哲学が違う。共通は三ファイル — **マニフェスト**(package.json、Cargo.toml、何を入れるか)、**ロックファイル**(package-lock.json、Cargo.lock、正確にどのバージョンか)、**モジュールディレクトリ**(node_modules、実際のファイル)。

### いつ使うか
- 全プロジェクト — 純ファイルシステム・依存ゼロのプロジェクトの方が例外(VibeMapがその例外)
- セキュリティパッチ追跡 — Dependabot・Snykで自動化
- モノレポ — pnpm・Nx・Turboで複数パッケージ一度に管理
- [[ai-coding-tools]]生成コード検証 — [[hallucination]]されたパッケージ名・存在しないバージョンの検出

### はまりやすい罠
- **依存の肥大化** — `npm install`一回で500MB+。node_modulesだけでディスク満杯。本当に必要なものだけ
- **ロックファイル無視** — `.gitignore`に含めれば「自分のPCでは動く」の典型。ロックファイルは必ずコミット
- **メジャーアップグレード蓄積** — 3年放置後に一気に上げると地獄。[[cost]]のようにコツコツと
- **[[hallucination]]されたパッケージ** — LLMが存在しない`aws-boto-helper`のような名前を提案。必ず[[review-mindset]]で実在確認。タイポスクワッティングも警戒
- **シークレット入り`.npmrc`** — 認証トークンをリポにコミットすると漏洩。環境変数かSecrets Manager
- **グローバルインストール乱立** — `-g`フラグでシステム汚染。プロジェクトごとの隔離が原則
- **globパターン更新** — `"^1.0.0"`は安全に見えてminor更新で回帰可能性。ロックファイルが実際の防御線

### 選択基準
- **速度**: Bun > pnpm > npm / uv > pip
- **ディスク効率**: pnpm(シンボリックリンクで重複除去)
- **安定性**: npm・pip(最も古く、最も広く)
- **モノレポ親和**: pnpm・cargo workspaces・Nx

### セキュリティ・サプライチェーン
- **SBOM**(Software Bill of Materials) — どの依存がどのバージョンかの公式リスト
- **Dependabot・Renovate** — CVE・更新の自動PR
- **サプライチェーン攻撃** — 人気パッケージが悪性コードで汚染される事故。ロックファイル + 署名検証が防御線
- **AI提案パッケージの検証** — ダウンロード数・メンテナ・最近のコミットで信頼性評価

### 繋がり
[[framework]]と対 — フレームワークが勧めるマネージャが大抵正解。[[cicd]]パイプラインではキャッシュ設計がビルド速度の大きな変数。[[testing]]・[[lint]]ツールもパッケージとしてインストール・実行。[[cost]]観点でCIビルド時間とディスク使用量に直接影響。[[ai-coding-tools]]が依存を追加するとき[[pitfalls]]の項目として毎回疑いの対象。

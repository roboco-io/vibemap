---
id: github
cat: tool
size: 3
title:
  ko: GitHub
  en: GitHub
  ja: GitHub
refs:
  - url: https://docs.github.com/
    title: GitHub Documentation
    lang: en
  - url: https://en.wikipedia.org/wiki/GitHub
    title: GitHub (Wikipedia)
    lang: en
extraEdges: []
---

## ko

GitHub은 **"[[git]] 저장소 호스팅을 넘어 소프트웨어 협업의 사실상 표준 플랫폼이 된 서비스"**다. 2008년 시작해 2018년 Microsoft 인수, 지금은 개발자 1억 명이 쓰는 공간. Git은 분산 VCS지만 실제로는 "중앙 서버"가 있어야 팀이 돌아가고, 그 중앙이 대부분 GitHub이다. 단순 호스팅을 넘어 **PR 리뷰·이슈 트래커·CI/CD·패키지 레지스트리·Copilot까지** 하나로 묶은 완전한 워크플로우 스위트.

핵심 구성요소. **Repository**([[git]] 리포 호스팅), **Pull Request**([[pr]] 리뷰·토론), **Issues**([[tidd]] 티켓 트래커), **Actions**([[cicd]] 워크플로우), **Packages**(npm·Docker 이미지 레지스트리), **Security**(CodeQL·Dependabot·secret scanning), **Copilot**([[ai-coding-tools]] 통합). 이 스택이 한 플랫폼에 있다는 게 *통합의 가치* — 외부 도구 N개를 엮는 비용이 사라진다.

### 언제 쓰나
- 오픈소스 프로젝트 — 거의 독점적 표준
- 스타트업·중소 조직 — 별도 CI·이슈 트래커·레지스트리를 따로 사지 않고 한 계정에
- 교육·학습 프로젝트 — VibeMap 자신도 GitHub Pages로 배포
- [[ai-coding-tools]] 연동 — Copilot·Cursor·[[claude-code]] 모두 GitHub과 1급 통합
- [[gitops]] 실천 — 이슈·PR·Actions가 자연스럽게 GitOps 루프를 구성

### 쉽게 빠지는 함정
- **Public 리포에 시크릿 커밋** — 몇 초면 봇이 스캔해 감. `.gitignore` + secret scanning 기본 ON
- **브랜치 보호 미설정** — main에 직접 push 가능하면 팀 규율이 깨짐. "review required + status checks" 최소 걸기
- **Actions의 비용 블랙박스** — matrix build·긴 workflow는 분당 과금. [[cost]] 대시보드 모니터링
- **Issue 무한 증식** — 수천 개 쌓이면 누구도 안 봄. 라벨·마일스톤·주기적 청소
- **GitHub Pages에 민감 데이터** — 정적 호스팅은 공개. 프라이빗이 필요하면 Vercel·Cloudflare
- **엔터프라이즈 데이터 유출** — Copilot이 프라이빗 코드로 학습되지 않는다는 걸 계약·설정으로 확인
- **LLM이 가짜 GitHub URL 생성** — 존재하지 않는 organization·repo 링크. [[hallucination]]·[[review-mindset]]

### GitHub의 특수 파일
- `.github/workflows/*.yml` — Actions 워크플로우 정의
- `.github/CODEOWNERS` — 경로별 자동 리뷰어 지정
- `.github/pull_request_template.md` — PR 본문 템플릿
- `.github/ISSUE_TEMPLATE/*.yml` — 이슈 템플릿
- `.github/dependabot.yml` — 의존성 자동 업데이트

### 연결
[[git]]의 네트워크·사회 계층. [[pr]]·[[cicd]] 워크플로우의 기본 실행 환경. [[gitops]]·[[trunk]]·[[tidd]]의 실무 구현이 대개 GitHub 위에서. [[ai-coding-tools]]·[[claude-code]]가 리포를 읽거나 PR을 만들 때의 통합점. VibeMap 프로젝트도 GitHub Pages로 배포되고, `.github/`에 워크플로우를 두는 현대적 구조.

## en

GitHub is **"the service that grew from [[git]] repository hosting into the de facto standard platform for software collaboration."** Launched in 2008, acquired by Microsoft in 2018, today it's home to 100+ million developers. Git is distributed by design, but teams need a central hub in practice — and that hub is almost always GitHub. It's gone far past hosting: **PR review, issue tracker, CI/CD, package registry, and Copilot** all bundle into one workflow suite.

Key pieces. **Repositories** ([[git]] repo hosting), **Pull Requests** ([[pr]] review / discussion), **Issues** ([[tidd]] ticket tracker), **Actions** ([[cicd]] workflows), **Packages** (npm, Docker image registry), **Security** (CodeQL, Dependabot, secret scanning), **Copilot** ([[ai-coding-tools]] integration). Having this stack on one platform is the *integration value* — the cost of wiring N separate tools disappears.

### When to use
- Open source — nearly exclusive standard
- Startups and smaller orgs — no need to buy separate CI, issue tracker, registry; one account covers it
- Educational and learning projects — VibeMap itself deploys via GitHub Pages
- [[ai-coding-tools]] integration — Copilot, Cursor, [[claude-code]] all integrate natively
- Practicing [[gitops]] — issues, PRs, and Actions naturally compose the GitOps loop

### Common pitfalls
- **Secrets committed to a public repo** — bots scan within seconds. Use `.gitignore` + secret scanning by default
- **No branch protection** — direct pushes to main collapse team discipline. Set "review required + status checks" at minimum
- **Actions cost as a black box** — matrix builds / long workflows bill by the minute. Watch the [[cost]] dashboard
- **Issue sprawl** — thousands of open issues means nobody reads them. Labels, milestones, regular cleanup
- **Sensitive data on GitHub Pages** — static hosting is public. Private needs Vercel or Cloudflare
- **Enterprise data leakage** — confirm via contract and settings that Copilot doesn't train on your private code
- **LLM inventing GitHub URLs** — nonexistent orgs or repos. [[hallucination]] + [[review-mindset]]

### Special files
- `.github/workflows/*.yml` — Actions workflow definitions
- `.github/CODEOWNERS` — automatic reviewer assignment by path
- `.github/pull_request_template.md` — PR body template
- `.github/ISSUE_TEMPLATE/*.yml` — issue templates
- `.github/dependabot.yml` — automatic dependency updates

### How it connects
The network and social layer of [[git]]. The default execution environment for [[pr]] and [[cicd]] workflows. The real-world implementations of [[gitops]], [[trunk]], [[tidd]] usually live on GitHub. The integration point for [[ai-coding-tools]] and [[claude-code]] reading repos or opening PRs. VibeMap itself deploys via GitHub Pages and keeps workflows under `.github/` — a thoroughly modern layout.

## ja

GitHubは**「[[git]]リポジトリのホスティングを超えてソフトウェア協業の事実上標準プラットフォームになったサービス」**。2008年開始、2018年にMicrosoftが買収し、今や1億人以上の開発者が使う空間。Gitは分散VCSだが実際には「中央サーバー」が必要で、その中央が大抵GitHub。単なるホスティングを超えて、**PRレビュー・イシュートラッカー・CI/CD・パッケージレジストリ・Copilotまで**一つに束ねた完全なワークフロースイート。

核心要素。**Repository**([[git]]リポホスティング)、**Pull Request**([[pr]]レビュー・議論)、**Issues**([[tidd]]チケットトラッカー)、**Actions**([[cicd]]ワークフロー)、**Packages**(npm・Dockerイメージレジストリ)、**Security**(CodeQL・Dependabot・secret scanning)、**Copilot**([[ai-coding-tools]]統合)。このスタックが一プラットフォームにあることが*統合の価値* — 外部ツールN個を繋ぐコストが消える。

### いつ使うか
- オープンソースプロジェクト — ほぼ独占的標準
- スタートアップ・中小組織 — CI・イシュートラッカー・レジストリを別途買わず一アカウントで
- 教育・学習プロジェクト — VibeMap自身もGitHub Pagesでデプロイ
- [[ai-coding-tools]]連携 — Copilot・Cursor・[[claude-code]]すべてが1級統合
- [[gitops]]実践 — issue・PR・Actionsが自然にGitOpsループを構成

### はまりやすい罠
- **Publicリポにシークレットをコミット** — 数秒でボットがスキャンする。`.gitignore` + secret scanningを既定ON
- **ブランチ保護未設定** — mainに直接pushできるとチーム規律が崩れる。「review required + status checks」を最低限
- **Actionsのコストがブラックボックス** — matrix build・長いworkflowは分課金。[[cost]]ダッシュボードを見る
- **Issueの無限増殖** — 数千たまると誰も見ない。ラベル・マイルストーン・定期整理
- **GitHub Pagesに機微データ** — 静的ホスティングは公開。プライベートが必要ならVercel・Cloudflare
- **エンタープライズデータ漏洩** — Copilotがプライベートコードで学習されないことを契約と設定で確認
- **LLMが偽GitHub URL生成** — 存在しないorganization・repoリンク。[[hallucination]]・[[review-mindset]]

### GitHubの特殊ファイル
- `.github/workflows/*.yml` — Actionsワークフロー定義
- `.github/CODEOWNERS` — パス別の自動レビュアー指定
- `.github/pull_request_template.md` — PR本文テンプレート
- `.github/ISSUE_TEMPLATE/*.yml` — issueテンプレート
- `.github/dependabot.yml` — 依存関係の自動更新

### 繋がり
[[git]]のネットワーク・社会層。[[pr]]・[[cicd]]ワークフローの既定実行環境。[[gitops]]・[[trunk]]・[[tidd]]の実務実装は大抵GitHub上で。[[ai-coding-tools]]・[[claude-code]]がリポを読んだりPRを作るときの統合点。VibeMapプロジェクトもGitHub Pagesでデプロイし、`.github/`にワークフローを置く現代的な構造。

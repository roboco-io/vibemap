---
id: cicd
cat: ops
size: 2
title:
  ko: CI/CD
  en: CI/CD
  ja: CI/CD
refs:
  - url: https://docs.github.com/en/actions
    title: GitHub Actions Documentation
    lang: en
  - url: https://martinfowler.com/articles/continuousIntegration.html
    title: Continuous Integration (Martin Fowler)
    lang: en
  - url: https://continuousdelivery.com/
    title: Continuous Delivery (Jez Humble & David Farley)
    lang: en
extraEdges: []
---

## ko

CI/CD는 **"코드가 바뀔 때마다 자동으로 테스트·빌드·배포가 흘러간다"**는 두 쌍둥이 실천이다. CI(Continuous Integration)는 "내 브랜치를 main과 자주 합치고, 합칠 때마다 자동 테스트"라는 규율이고, CD(Continuous Delivery/Deployment)는 "main에 들어온 것은 언제든 프로덕션에 나갈 수 있는 상태"를 유지하는 것. 한 번 파이프라인을 만들어두면 "어제 빌드는 어떻게 했었지?"라는 기억에 의존하지 않는다.

Martin Fowler가 2006년에 CI를 정식화했고, Jez Humble의 2010년 책 *Continuous Delivery*가 CD를 표준화했다. 오늘날은 [[github]] Actions, GitLab CI, CircleCI, Jenkins 등이 대표 도구. AWS 생태계에서는 CodeBuild/CodePipeline이 있지만, 대개 팀은 GitHub Actions + AWS Deploy 조합을 쓴다.

### 언제 쓰나
- 두 명 이상이 같은 저장소를 건드리기 시작하는 순간 — CI 없이는 "내 로컬에선 됐는데"가 일상이 됨
- 배포가 주 1회 이상 필요할 때 — 수동 배포의 실수 비용이 자동화 비용을 금방 추월
- [[testing]]·[[ut]]·[[e2e]]·[[lint]] 같은 검증을 사람이 기억해서 돌리는 걸 그만두고 싶을 때
- [[iac]]와 묶어 GitOps([[gitops]])로 넘어가고 싶을 때 — CI/CD는 그 전 단계의 기반

### 쉽게 빠지는 함정
- **빨간 빌드를 방치** — main이 깨진 채 며칠 지나면 누구도 안 믿는 신호등이 된다. "main 깨진 빌드는 최우선 복구"를 규율로 고정
- **테스트가 너무 느려서 파이프라인 외면** — 10분 넘어가면 개발자가 커밋을 뭉쳐 올린다. [[small-steps]]이 무너짐
- **시크릿을 YAML에 평문으로** — GitHub Secrets나 OIDC, AWS IAM role로 주입. 평문은 사고의 지름길
- **CD = "main 머지 즉시 프로덕션"으로 단정** — 팀 성숙도에 따라 Delivery(언제든 배포 가능) vs Deployment(자동 배포) 선택. 섞지 말 것
- **모든 걸 하나의 파이프라인에** — 빌드·테스트·배포·보안스캔을 한 줄로 묶으면 한 곳만 실패해도 전부 중단. 단계별로 쪼개자
- **[[llmops]]/[[aiops]] 시대의 데이터 부재** — 배포·변경 이벤트를 [[monitoring]]·AIOps로 흘려보내지 않으면 장애 원인 분석이 반쪽

### 연결
[[iac]]·[[immutable-infra]]·[[gitops]]와 함께 운영 네 축 중 가장 오래된 축. [[git]]의 PR([[pr]])과 [[trunk]] 기반 개발이 CI의 전제. [[testing]]의 출력이 CI의 입력. 최근에는 [[llmops]]가 CI/CD의 파이프라인에 "프롬프트 회귀 eval" 단계를 끼워 넣는 방향으로 확장 중 — 결정론 코드 배포의 문법이 확률적 시스템까지 퍼지고 있다.

## en

CI/CD is the twin practice that says **"every code change flows through automated test, build, and deploy."** Continuous Integration means "merge your branch into main often, and run the full test suite on every merge." Continuous Delivery/Deployment means "whatever sits on main is always in a shippable state." Build the pipeline once and you no longer depend on someone remembering "how did we build this yesterday?"

Martin Fowler formalized CI in 2006; Jez Humble's 2010 book *Continuous Delivery* standardized CD. Today the canonical tools are [[github]] Actions, GitLab CI, CircleCI, Jenkins. In AWS land there's CodeBuild/CodePipeline, though most teams reach for GitHub Actions + AWS deploy targets.

### When to use
- The moment two or more people touch the same repo — without CI, "works on my machine" becomes your daily life
- Deploying more than weekly — the cost of manual-deploy mistakes quickly exceeds automation cost
- You want to stop relying on humans remembering to run [[testing]], [[ut]], [[e2e]], [[lint]]
- You're about to pair it with [[iac]] for GitOps ([[gitops]]) — CI/CD is the step before that

### Common pitfalls
- **Letting red builds linger** — a broken main for days stops being a signal anyone trusts. Treat "main is red" as drop-everything priority
- **Pipeline too slow to use** — past ~10 minutes, developers batch commits and [[small-steps]] collapses
- **Plaintext secrets in YAML** — use GitHub Secrets, OIDC, or AWS IAM roles. Plaintext is an accident waiting to happen
- **Assuming CD means "auto-deploy to prod on merge"** — depending on team maturity, pick Delivery (always-deployable) vs Deployment (auto-deployed). Don't blur the two
- **One pipeline to rule them all** — bundling build, test, deploy, security scan into one chain means any single failure blocks everything. Split by stage
- **Missing data in the [[llmops]]/[[aiops]] era** — if deploy and change events don't flow into [[monitoring]] and AIOps, root-cause analysis is half-blind

### How it connects
One of the four operational axes alongside [[iac]], [[immutable-infra]], and [[gitops]] — and the oldest. [[git]]'s [[pr]] and [[trunk]]-based development are CI's prerequisites. [[testing]]'s output is CI's input. Recently [[llmops]] has been pushing CI/CD to add "prompt regression eval" stages, extending the grammar of deterministic-code delivery into probabilistic systems.

## ja

CI/CDは**「コードが変わるたびに自動でテスト・ビルド・デプロイが流れる」**という双子の実践。CI(Continuous Integration)は「自分のブランチをmainに頻繁にマージし、マージごとに全テスト」という規律。CD(Continuous Delivery/Deployment)は「mainにあるものは常に出荷可能な状態」を保つこと。パイプラインを一度作れば「昨日どうビルドしたっけ?」という記憶に頼らなくなる。

Martin Fowlerが2006年にCIを定式化し、Jez Humbleの2010年の著書『Continuous Delivery』がCDを標準化した。今日の代表ツールは[[github]] Actions、GitLab CI、CircleCI、Jenkins。AWS圏にはCodeBuild/CodePipelineもあるが、大抵のチームはGitHub Actions + AWSデプロイ先の組み合わせを使う。

### いつ使うか
- 2人以上が同じリポジトリを触り始めた瞬間 — CIなしでは「自分のローカルでは動く」が日常になる
- 週1回以上デプロイするとき — 手動デプロイのミスコストがすぐに自動化コストを超える
- [[testing]]・[[ut]]・[[e2e]]・[[lint]]を人が思い出して走らせるのを止めたいとき
- [[iac]]と組んでGitOps([[gitops]])に進みたいとき — CI/CDはその前段の基盤

### はまりやすい罠
- **赤いビルドを放置** — mainが壊れたまま何日も経つと、誰も信じない信号機になる。「main破壊は最優先復旧」を規律化
- **パイプラインが遅すぎて使われない** — 10分を超えると開発者はコミットをまとめ始め、[[small-steps]]が崩れる
- **YAMLに平文シークレット** — GitHub Secrets、OIDC、AWS IAMロールで注入。平文は事故の近道
- **CD = 「mainマージで即本番」と決めつけ** — チームの成熟度次第でDelivery(常時出荷可能)とDeployment(自動デプロイ)を使い分ける。混ぜない
- **全てを一つのパイプラインに** — ビルド・テスト・デプロイ・セキュリティスキャンを一直線にすると、一箇所の失敗で全停止。ステージで分ける
- **[[llmops]]/[[aiops]]時代のデータ欠落** — デプロイ・変更イベントを[[monitoring]]やAIOpsに流さないと、障害の原因分析が半分になる

### 繋がり
[[iac]]・[[immutable-infra]]・[[gitops]]と並ぶ運用4軸の中で最も古い軸。[[git]]の[[pr]]と[[trunk]]ベース開発がCIの前提。[[testing]]の出力がCIの入力。最近は[[llmops]]がCI/CDのパイプラインに「プロンプト回帰eval」ステージを差し込む方向で拡張中 — 決定論コード配信の文法が確率的システムまで広がっている。

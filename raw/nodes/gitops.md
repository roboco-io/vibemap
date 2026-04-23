---
id: gitops
cat: ops
size: 2
title:
  ko: GitOps
  en: GitOps
  ja: GitOps
refs:
  - url: https://opengitops.dev/
    title: OpenGitOps — CNCF GitOps Working Group
    lang: en
  - url: https://argo-cd.readthedocs.io/en/stable/
    title: Argo CD Documentation
    lang: en
  - url: https://fluxcd.io/
    title: Flux — The GitOps family of projects
    lang: en
extraEdges: []
---

## ko

GitOps는 **[[git]] 저장소를 클러스터가 따라야 할 '유일한 진실 공급원'으로 삼는 배포 방식**이다. [[cicd]]가 "빌드하고 kubectl apply를 때린다"는 *푸시* 모델이라면, GitOps는 클러스터 안의 에이전트(Argo CD, Flux)가 저장소를 *풀*로 감시하다가 차이가 생기면 스스로 맞추는 **reconciliation** 모델이다. 2017년 Weaveworks가 명명했고, 지금은 CNCF의 OpenGitOps Working Group이 4대 원칙(선언적·버전 관리·자동 당김·지속 조정)으로 표준화했다.

핵심은 단순하다. 운영자는 [[git]]에 매니페스트를 머지할 뿐, 클러스터에 직접 손을 대지 않는다. 에이전트가 PR이 머지되면 자동으로 반영하고, 누군가 콘솔에서 수동 변경을 해도 되돌려 버린다. [[iac]]가 "선언형 코드"라는 재료를 준다면, GitOps는 그 재료를 운영 루프의 **심장**으로 올리는 설계다.

### 언제 쓰나
- Kubernetes 중심 환경 — 매니페스트가 선언적이고 API가 reconcile 가능할 때 자연히 맞다
- 여러 클러스터(multi-region, dev/staging/prod)를 동일 저장소 하나로 관리하고 싶을 때
- 감사 로그가 곧 [[git]] 로그 — "언제 누가 뭘 바꿨나"를 PR 하나로 증명하고 싶을 때
- [[cicd]] 파이프라인과 공존시키되, 클러스터 배포만 분리해 **풀 기반**으로 안정화하고 싶을 때

### 쉽게 빠지는 함정
- **시크릿을 저장소에 평문으로** — [[git]]은 시크릿 저장소가 아니다. Sealed Secrets, External Secrets, Vault 같은 외부 수단으로 암호화·주입.
- **콘솔에서 "잠깐만" 편집** — [[immutable-infra]]와 같은 규율이 필요. 콘솔 쓰기 권한을 막지 않으면 에이전트가 계속 되돌려 혼란만 키운다.
- **PR이 배포 병목이 됨** — 모든 변경이 리뷰·승인을 거치다 보니 속도가 죽는다. [[trunk]] 기반 개발이나 프리뷰 환경 자동화로 풀어야 한다.
- **GitOps ≠ CI의 대체** — 이미지 빌드·테스트는 여전히 [[cicd]]의 영역. GitOps는 **배포 반영**만 다룬다. 둘을 혼동하면 파이프라인이 뒤엉킨다.
- **Kubernetes 밖에서 억지로 적용** — reconcile 가능한 선언형 API가 없는 레거시에는 맞지 않는다.

### 연결
[[iac]] + [[cicd]] + [[immutable-infra]]의 운영 삼각형을 닫는 조각. [[container]]와 [[microservices]] 스택에서 특히 빛나고, [[pr]]이 사실상 배포 버튼이 된다. [[monitoring]]과 연계해 "Git 커밋과 클러스터 상태가 얼마나 벌어져 있나"를 핵심 지표로 삼는 팀이 많다.

## en

GitOps is a deployment model that **treats a [[git]] repository as the single source of truth a cluster must conform to**. Where [[cicd]] is a *push* model ("build, then kubectl apply"), GitOps is a *pull* model: an agent inside the cluster (Argo CD, Flux) watches the repo and reconciles drift on its own. Weaveworks coined the term in 2017; today the CNCF OpenGitOps Working Group has standardized it around four principles — declarative, versioned, pulled automatically, continuously reconciled.

The core idea is simple. Operators merge manifests into [[git]] and do nothing else to the cluster. The agent applies merged PRs automatically, and if someone sneaks in a console change it gets reverted. If [[iac]] provides the raw material — declarative code — GitOps promotes that material to the **beating heart** of the operational loop.

### When to use
- Kubernetes-centric environments — manifests are declarative and APIs are reconcilable, so it fits naturally
- Multiple clusters (multi-region, dev/staging/prod) you want to manage from one repo
- Audit trail = [[git]] log — when you need a PR to be the answer to "who changed what, when"
- You want [[cicd]] to coexist but split off cluster deploys into a stabler **pull-based** loop

### Common pitfalls
- **Plaintext secrets in the repo** — [[git]] is not a secrets store. Use Sealed Secrets, External Secrets, or Vault to encrypt and inject.
- **"Quick edits" in the console** — this needs the same discipline as [[immutable-infra]]. Without revoking console write access, the agent will keep undoing changes and everyone gets confused.
- **PRs become a deploy bottleneck** — if every change needs review, velocity dies. Pair with [[trunk]]-based development or automated preview environments.
- **GitOps is not a CI replacement** — image build and test still belong to [[cicd]]. GitOps only handles **deploy reconciliation**. Conflating the two tangles the pipeline.
- **Forcing it outside Kubernetes** — legacy systems without reconcilable declarative APIs don't fit.

### How it connects
The piece that closes the [[iac]] + [[cicd]] + [[immutable-infra]] operational triangle. Shines brightest in [[container]] and [[microservices]] stacks, where [[pr]] effectively becomes the deploy button. Many teams wire it to [[monitoring]] so that "distance between Git commit and cluster state" becomes a first-class metric.

## ja

GitOpsは**[[git]]リポジトリをクラスターが従うべき「唯一の真実の源」とするデプロイ方式**。[[cicd]]が「ビルドしてkubectl apply」という*プッシュ*モデルなら、GitOpsはクラスター内のエージェント(Argo CD、Flux)がリポジトリを*プル*で監視し、差分が出たら自分で合わせにいく**reconciliation**モデル。Weaveworksが2017年に命名し、現在はCNCFのOpenGitOps Working Groupが4原則(宣言的・バージョン管理・自動プル・継続調整)として標準化している。

核は単純。運用者は[[git]]にマニフェストをマージするだけで、クラスターには直接触らない。エージェントはPRのマージを自動反映し、誰かがコンソールで手動変更しても元に戻す。[[iac]]が「宣言型コード」という素材を用意するなら、GitOpsはその素材を運用ループの**心臓**に据える設計だ。

### いつ使うか
- Kubernetes中心の環境 — マニフェストが宣言的でAPIがreconcile可能なので自然にはまる
- 複数クラスター(マルチリージョン、dev/staging/prod)を一つのリポジトリで管理したいとき
- 監査ログ=[[git]]ログ — 「いつ誰が何を変えたか」をPR一つで示したいとき
- [[cicd]]パイプラインと共存させつつ、クラスターデプロイだけ**プル基盤**で安定化したいとき

### はまりやすい罠
- **シークレットを平文で保存** — [[git]]はシークレット保管庫ではない。Sealed Secrets、External Secrets、Vaultなどで暗号化・注入する。
- **コンソールで「ちょっとだけ」編集** — [[immutable-infra]]と同じ規律が必要。コンソールの書き込み権限を外さないと、エージェントが巻き戻し続けて混乱が増えるだけ。
- **PRがデプロイのボトルネックに** — 全変更にレビューを課すと速度が死ぬ。[[trunk]]ベース開発やプレビュー環境の自動化で解く。
- **GitOps ≠ CIの置き換え** — イメージビルドとテストは依然[[cicd]]の領域。GitOpsが扱うのは**デプロイ反映**のみ。混同するとパイプラインが絡まる。
- **Kubernetes外に無理やり適用** — reconcile可能な宣言型APIがないレガシーには合わない。

### 繋がり
[[iac]] + [[cicd]] + [[immutable-infra]]の運用三角形を閉じるピース。[[container]]や[[microservices]]スタックで特に光り、[[pr]]が実質デプロイボタンになる。[[monitoring]]と連携し、「Gitコミットとクラスター状態の乖離」を主要指標とするチームも多い。

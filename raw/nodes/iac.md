---
id: iac
cat: ops
size: 2
title:
  ko: IaC (Infrastructure as Code)
  en: IaC (Infrastructure as Code)
  ja: IaC (Infrastructure as Code)
refs:
  - url: https://docs.aws.amazon.com/whitepapers/latest/introduction-devops-aws/infrastructure-as-code.html
    title: Infrastructure as code — Introduction to DevOps on AWS (AWS Whitepaper)
    lang: en
  - url: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html
    title: What is CloudFormation? (AWS Docs)
    lang: en
  - url: https://developer.hashicorp.com/terraform/intro
    title: What is Terraform? (HashiCorp Docs)
    lang: en
extraEdges: []
---

## ko

IaC는 **인프라를 콘솔 클릭이 아니라 코드로 정의**하는 방식이다. VPC, 서브넷, [[ecs]] 클러스터, IAM 정책, DNS 레코드를 전부 텍스트 파일로 쓰고, [[git]]으로 버전을 관리하고, PR로 리뷰한 뒤에야 실제 환경에 적용한다. 애플리케이션 코드에 들이는 규율(리뷰·테스트·롤백)을 인프라에도 똑같이 들이는 것이 핵심.

AWS 세계에서는 CloudFormation(AWS 공식, YAML/JSON), CDK(타입 있는 언어로 CloudFormation 템플릿을 생성), Terraform(멀티 클라우드, HashiCorp), Pulumi(범용 언어) 중 고른다. **선언형**이 주류다 — "이 상태가 돼야 한다"를 쓰면 도구가 현재 상태와 비교해 필요한 API 호출을 계산한다. 같은 템플릿을 두 번 적용해도 결과가 같다(idempotent).

### 언제 쓰나
- 환경을 여러 벌(dev/staging/prod) 운영해야 하고, 세 환경이 진짜로 같아야 할 때
- 장애 시 "어제 뭘 바꿨지?"를 git log로 되짚고 싶을 때
- 누군가 콘솔에서 몰래 수정한 걸 감지하고 되돌리고 싶을 때 — drift detection
- [[cicd]] 파이프라인에서 인프라까지 함께 배포하고 싶을 때

### 쉽게 빠지는 함정
- **State 파일 관리** — Terraform의 state는 민감 정보 덩어리다. S3+DynamoDB 락으로 원격 저장하지 않으면 팀이 터진다.
- **Drift** — 콘솔에서 "잠깐만" 수정하면 코드와 실제가 어긋난다. 이를 막으려면 콘솔 쓰기 권한을 제거하고 [[immutable-infra]] 쪽으로 한 걸음 더 간다.
- **추상화 과잉** — 모든 걸 모듈화하려다 디버깅 불가능한 레이어 케이크가 된다. 처음엔 평평하게 쓰고, 반복이 3번 나올 때까지 리팩터링을 참는다.
- **[[serverless]]/[[microservices]] 규모에서 폭발** — 수백 개 스택이 서로 참조하면 배포 순서가 지옥이 된다. 경계를 명확히 나누는 것이 핵심.

### 연결
[[cicd]]와 짝을 이뤄 GitOps가 되고, [[immutable-infra]]의 토대가 되며, [[serverless]]와 [[microservices]]의 복잡도를 감당 가능한 수준으로 끌어내린다. [[cost]] 관리도 IaC에서 시작한다 — 태그 규칙을 코드에 박아두면 비용 추적이 공짜로 따라온다.

## en

IaC means **defining infrastructure in code rather than clicking through a console**. VPCs, subnets, [[ecs]] clusters, IAM policies, DNS records — everything lives in text files, versioned with [[git]], reviewed via PR, and applied to real environments only after merge. The same discipline you apply to application code (review, test, rollback) now applies to infrastructure.

In AWS land, your options are CloudFormation (AWS-native, YAML/JSON), CDK (a typed language that generates CloudFormation), Terraform (multi-cloud, HashiCorp), or Pulumi (general-purpose languages). The mainstream flavor is **declarative** — you write "this is the desired state" and the tool diffs against reality to compute the API calls. Applying the same template twice yields the same result (idempotent).

### When to use
- You run multiple environments (dev/staging/prod) and they actually need to match
- When something breaks you want `git log` to answer "what changed yesterday?"
- You want to detect and revert the person who quietly edited something in the console (drift detection)
- You want your [[cicd]] pipeline to deploy infrastructure alongside application code

### Common pitfalls
- **State file management** — Terraform state is a bag of secrets. If you don't store it remotely with locking (S3+DynamoDB), your team will have a bad day.
- **Drift** — a quick console edit and code-vs-reality diverges. The real fix is to strip console write access and lean further into [[immutable-infra]].
- **Abstraction overreach** — modularize too aggressively and you end up with an undebuggable layer cake. Stay flat until you've repeated yourself three times.
- **Explosion at [[serverless]]/[[microservices]] scale** — hundreds of stacks cross-referencing each other makes deploy ordering a nightmare. Clear boundaries matter more than DRY.

### How it connects
Pair IaC with [[cicd]] and you get GitOps. It's the foundation [[immutable-infra]] stands on, and it keeps [[serverless]] and [[microservices]] complexity manageable. [[cost]] governance starts here too — bake tagging conventions into the code and cost attribution comes for free.

## ja

IaCは**インフラをコンソールクリックではなくコードで定義する**こと。VPC、サブネット、[[ecs]]クラスタ、IAMポリシー、DNSレコードを全てテキストファイルに書き、[[git]]でバージョン管理し、PRでレビューしてから本番に適用する。アプリコードに適用する規律(レビュー・テスト・ロールバック)をインフラにもそのまま持ち込む。

AWS圏ではCloudFormation(AWS公式、YAML/JSON)、CDK(型付き言語でCloudFormationテンプレを生成)、Terraform(マルチクラウド、HashiCorp製)、Pulumi(汎用言語)から選ぶ。主流は**宣言型** — 「この状態になるべき」を書くと、ツールが現状と差分を取って必要なAPI呼び出しを計算する。同じテンプレを2回適用しても結果が同じ(idempotent)。

### いつ使うか
- 環境を複数セット(dev/staging/prod)運用し、本当に揃えないといけないとき
- 障害時に「昨日何を変えた?」を`git log`で遡りたいとき
- 誰かがこっそりコンソールで書き換えたのを検知して戻したいとき — drift detection
- [[cicd]]パイプラインでインフラまで一緒にデプロイしたいとき

### はまりやすい罠
- **Stateファイル管理** — Terraformのstateは機密の塊。S3+DynamoDBロックで遠隔保存しないとチームが爆発する。
- **Drift** — コンソールで「ちょっとだけ」修正するとコードと現実がずれる。根本的にはコンソールの書き込み権限を外し、[[immutable-infra]]に一歩踏み込む。
- **抽象化過剰** — 全てモジュール化しようとしてデバッグ不能なレイヤーケーキになる。最初はフラットに書き、3回繰り返してからリファクタする。
- **[[serverless]]/[[microservices]]規模での爆発** — 数百のスタックが互いを参照し始めるとデプロイ順序が地獄になる。境界を明確に切る方がDRYより重要。

### 繋がり
[[cicd]]と組むとGitOpsになり、[[immutable-infra]]の土台になり、[[serverless]]や[[microservices]]の複雑さを御せるレベルに抑える。[[cost]]管理もここから始まる — タグ規約をコードに埋めれば、コスト計上は自動で付いてくる。

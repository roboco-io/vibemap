---
id: immutable-infra
cat: ops
size: 2
title:
  ko: Immutable Infrastructure
  en: Immutable Infrastructure
  ja: Immutable Infrastructure
refs:
  - url: https://martinfowler.com/bliki/ImmutableServer.html
    title: Immutable Server (Martin Fowler's bliki)
    lang: en
  - url: https://developer.hashicorp.com/well-architected-framework/define-and-automate-processes/define/immutable-infrastructure
    title: Create immutable infrastructure (HashiCorp Well-Architected)
    lang: en
  - url: https://martinfowler.com/bliki/PhoenixServer.html
    title: Phoenix Server (Martin Fowler's bliki)
    lang: en
extraEdges: []
---

## ko

Immutable Infrastructure는 **배포된 서버는 절대 고치지 않는다. 바꿀 게 생기면 새로 만들어 교체한다**는 운영 철학이다. 보안 패치? 새 이미지 빌드해서 새 인스턴스 띄우고 옛 것을 버린다. 코드 배포? 마찬가지. 서버에 SSH로 들어가 `yum update` 같은 걸 치는 습관은 이 세계에서 금지어다.

유명한 비유가 **"pets vs cattle"** — 애완동물처럼 이름 붙이고 아플 때마다 간호하던 서버 대신, 가축처럼 번호만 붙이고 문제 생기면 도태시키고 새로 넣는다. Kief Morris가 2013년 Martin Fowler 블로그에서 정식화한 개념이고, Chad Fowler는 "서버를 쓰레기처럼 다루라"고 표현했다. 한 걸음 더 나아간 게 **Phoenix Server 패턴** — 멀쩡한 서버도 주기적으로 파괴하고 재생성해 drift가 쌓일 기회 자체를 없앤다.

### 언제 쓰나
- [[container]]나 Lambda([[serverless]])로 이미 강제되고 있을 때 — [[ecs]]·[[lambda]]는 본질적으로 immutable이라 자연히 따라온다
- AMI 기반 EC2를 돌리되 AutoScaling Group의 launch template을 바꿔 롤링 배포하고 싶을 때
- [[iac]]를 도입했지만 drift가 자꾸 생겨 코드와 현실이 어긋날 때 — SSH 자체를 막고 이 패턴으로 넘어간다
- 롤백이 "바로 이전 이미지로 교체"로 끝나야 하는 규모의 시스템

### 조심할 점
- **상태(데이터)는 따로 빼야 한다** — 서버가 수시로 죽고 살아나니 DB·파일은 반드시 외부 스토리지로. 상태 있는 레거시 DB 서버는 이 패턴에 억지로 끼울 수 없다.
- **빌드 시간** — 매 변경마다 이미지를 굽는 비용. Packer·[[container]] 레이어 캐시·골든 AMI 파이프라인이 꼭 붙는다.
- **시크릿을 이미지에 굽지 말 것** — 이미지는 아티팩트 저장소에 퍼진다. 시크릿은 Secrets Manager/Parameter Store에서 런타임에 주입.
- **dev 환경의 피로** — 반복 수정 중인 개발자에겐 매번 교체가 느리게 느껴진다. dev는 mutable로 두고 staging/prod부터 강제하는 타협도 흔하다.

### 연결
[[iac]]가 "무엇이 있어야 하는가"를 선언한다면, Immutable Infrastructure는 "있던 것은 고치지 말고 바꿔 끼우라"고 보탠다. [[container]]와 [[ecs]]는 이 철학을 기본으로 체화했고, [[serverless]]는 사실상 강제한다. [[cicd]] 파이프라인이 이미지 빌드→배포→교체를 자동화해줘야 이 패턴이 지속 가능하다.

## en

Immutable Infrastructure is the operational stance that **a deployed server is never modified; if something needs to change, you build a new one and replace it**. Security patch? Bake a new image, launch a new instance, kill the old one. Code deploy? Same. SSHing in to run `yum update` is a habit you leave behind.

The canonical metaphor is **"pets vs cattle"** — instead of naming servers and nursing them back to health, you number them, cull the sick, and spin up replacements. Kief Morris formalized the pattern on Martin Fowler's bliki in 2013; Chad Fowler memorably called it "trashing your servers." One step further is the **Phoenix Server** pattern — periodically destroying even healthy servers so that drift has no chance to accumulate.

### When to use
- It's already forced on you by [[container]]s or Lambda ([[serverless]]) — [[ecs]] and [[lambda]] are immutable by construction
- You run AMI-based EC2 but want rolling deploys by swapping the launch template in an AutoScaling Group
- You adopted [[iac]] but drift keeps creeping in — close console write access and lean into this pattern
- Rollback must reduce to "redeploy the previous image" at your scale

### Watch out for
- **State must live elsewhere** — servers die and respawn often, so databases and files belong in external storage. Stateful legacy DB servers don't retrofit into this pattern.
- **Build cost** — every change bakes a new image. You'll want Packer, [[container]] layer caching, a golden-AMI pipeline.
- **Don't bake secrets into images** — images propagate through artifact repos. Inject secrets at runtime from Secrets Manager or Parameter Store.
- **Dev-loop friction** — for a developer iterating fast, full replacement feels slow. A common compromise: keep dev mutable, enforce immutability from staging onward.

### How it connects
Where [[iac]] declares "what must exist," immutable infrastructure adds "and don't touch it — swap it." [[container]]s and [[ecs]] have this philosophy baked in, and [[serverless]] essentially enforces it. The pattern is only sustainable when a [[cicd]] pipeline automates the image-build → deploy → replace cycle.

## ja

Immutable Infrastructureは**デプロイ済みサーバーは絶対に修正しない。変更が必要なら新しく作って差し替える**という運用哲学だ。セキュリティパッチ?新イメージをビルドして新インスタンスを起動、古いものを捨てる。コードデプロイも同じ。SSHで入って`yum update`を叩く習慣はこの世界では禁句。

有名な例えが**「pets vs cattle」** — ペットのように名前を付けて病気のたびに看病していたサーバーの代わりに、家畜のように番号だけ付けて問題があれば淘汰して新しいのを入れる。Kief Morrisが2013年にMartin Fowlerのbliki上で定式化した概念で、Chad Fowlerは「サーバーをゴミのように扱え」と表現した。さらに進んだのが**Phoenix Server**パターン — 健全なサーバーでも定期的に破壊・再生成し、driftが溜まる余地そのものを消す。

### いつ使うか
- [[container]]や[[serverless]]で既に強制されているとき — [[ecs]]・[[lambda]]は本質的にimmutableなので自然に従う
- AMIベースのEC2を動かしつつ、AutoScaling Groupのlaunch templateを差し替えてローリングデプロイしたいとき
- [[iac]]を入れたがdriftが繰り返し発生してコードと現実が乖離するとき — SSHそのものを塞いでこのパターンに寄せる
- ロールバックが「直前のイメージに差し替える」で済ませなければならない規模のシステム

### 気をつけること
- **状態(データ)は外に出す** — サーバーは頻繁に死んで蘇るので、DBやファイルは必ず外部ストレージへ。ステートフルなレガシーDBサーバーは無理に当てはめられない。
- **ビルドコスト** — 変更のたびにイメージを焼く。Packer、[[container]]レイヤーキャッシュ、ゴールデンAMIパイプラインが必須。
- **シークレットをイメージに焼かない** — イメージはアーティファクトリポジトリに広がる。シークレットはSecrets ManagerやParameter Storeからランタイムで注入。
- **dev環境の疲労** — 反復修正中の開発者には毎回差し替えが遅く感じる。devはmutableに残し、staging以降で強制する妥協もよくある。

### 繋がり
[[iac]]が「何が存在すべきか」を宣言するなら、Immutable Infrastructureは「存在するものは触らず差し替えろ」を足す。[[container]]と[[ecs]]はこの哲学を標準で内包し、[[serverless]]は実質強制する。[[cicd]]パイプラインがイメージビルド→デプロイ→差し替えを自動化して、はじめてこのパターンが持続可能になる。

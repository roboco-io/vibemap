---
id: aiops
cat: ops
size: 2
title:
  ko: AIOps
  en: AIOps
  ja: AIOps
refs:
  - url: https://docs.aws.amazon.com/devops-guru/latest/userguide/welcome.html
    title: Amazon DevOps Guru (AWS Docs)
    lang: en
  - url: https://cloud.google.com/discover/what-is-aiops
    title: What is AIOps? (Google Cloud)
    lang: en
  - url: https://www.gartner.com/en/information-technology/glossary/aiops-platform
    title: AIOps Platform Definition (Gartner Glossary)
    lang: en
extraEdges: []
---

## ko

AIOps(AI for IT Operations)는 **로그·메트릭·트레이스에 ML을 끼얹어 운영 문제를 사람보다 먼저 감지·진단하는** 실천이다. [[monitoring]]이 "숫자를 대시보드에 그려주는" 일이라면, AIOps는 그 숫자 더미에서 *패턴*을 배우고 이상을 자동으로 끄집어낸다. 2016년 Gartner가 붙인 용어인데, 뜻이 안정되기까지 시간이 걸려 지금은 "ML 기반 옵저버빌리티"에 가깝게 쓰인다.

구체적으로는 세 가지 일을 한다: **이상 탐지**(평소 패턴에서 벗어난 메트릭 자동 플래그), **알람 상관관계**(터진 1000개의 경보를 한 인시던트로 묶기), **근본 원인 힌트**(최근 배포·설정 변경과의 시점 상관). AWS의 DevOps Guru, Datadog Bits AI, PagerDuty AIOps 등이 같은 계열이다.

### 언제 쓰나
- [[monitoring]] 신호가 너무 많아 사람이 경보 피로(alert fatigue)로 무감각해질 때
- [[microservices]]나 [[serverless]] 구조라 장애가 "어디서 왔는지" 사람이 추적하기 힘들 때
- MTTR(평균 복구 시간)이 비즈니스 KPI가 되어 자동 triage가 필요할 때
- [[cicd]] 파이프라인이 충분히 성숙해 배포·변경 이벤트가 깨끗한 데이터로 들어올 때

### 쉽게 빠지는 함정
- **데이터 기반이 빈약한데 AIOps부터 산다** — 신호가 들쭉날쭉하면 ML이 학습할 패턴이 없다. [[monitoring]]과 태그 규율이 먼저.
- **"AI가 다 해주겠지"** — 새로운 유형의 장애는 모델이 본 적 없는 것. 사람 판단을 대체하는 게 아니라 가장 수상한 상위 5개를 보여주는 도구로 대하자.
- **[[hallucination]]의 운영판** — 상관관계를 인과처럼 보여주기도 한다. 근본 원인 "추정치"를 확정으로 읽지 말 것.
- **[[cicd]] 없이 AIOps** — 데이터 소스 중 "변경 이벤트"가 빠지면 이상 탐지가 추측이 된다.

### 연결
[[monitoring]]의 다음 단계, [[debug]]의 자동화된 조수. [[llmops]]와는 완전히 다른 축 — 전자는 *인프라를 돌리는 AI*, 후자는 *AI 앱을 돌리는 운영*. [[iac]]와 [[cicd]]가 깨끗한 신호를 공급해야 AIOps가 거짓말을 덜 한다.

## en

AIOps (AI for IT Operations) means **pouring ML over logs, metrics, and traces so that operational problems get caught and diagnosed before a human notices**. Where [[monitoring]] draws numbers on a dashboard, AIOps learns *patterns* from those numbers and surfaces anomalies automatically. Gartner coined the term in 2016; after some semantic drift it now mostly means "ML-driven observability."

In practice it does three things: **anomaly detection** (flag metrics deviating from learned baselines), **alert correlation** (fold a thousand paging events into one incident), and **root-cause hints** (correlate the timing with recent deploys or config changes). AWS DevOps Guru, Datadog Bits AI, and PagerDuty AIOps all live in this family.

### When to use
- [[monitoring]] signal volume is high enough that humans go numb with alert fatigue
- A [[microservices]] or [[serverless]] topology makes "where did this fail?" genuinely hard to trace
- MTTR is a business KPI and auto-triage is the only way to hit it
- Your [[cicd]] pipeline is mature enough that deploy/change events flow in as clean data

### Common pitfalls
- **Buying AIOps before fixing the data** — inconsistent signals give the model no patterns to learn. Get [[monitoring]] and tagging discipline in place first.
- **"The AI will figure it out"** — novel failure modes are by definition unseen. Treat AIOps as "top-5 suspect" tooling, not a replacement for human judgment.
- **[[hallucination]] for ops** — correlation presented as causation. A "probable root cause" is a hypothesis, not a verdict.
- **AIOps without [[cicd]]** — missing change-event data turns anomaly detection into guesswork.

### How it connects
The next stage of [[monitoring]], the automated sidekick of [[debug]]. Orthogonal to [[llmops]] — one is *AI running your infra*, the other is *ops for running AI apps*. [[iac]] and [[cicd]] must feed AIOps clean signals or it will lie to you.

## ja

AIOps(AI for IT Operations)は**ログ・メトリクス・トレースにMLをかけ、人間より先に運用問題を検知・診断する**実践。[[monitoring]]が「数字をダッシュボードに描く」仕事なら、AIOpsはその数字の山から*パターン*を学び、異常を自動で引きずり出す。2016年にGartnerが名付けた用語で、意味が安定するのに時間がかかったが今は「ML駆動オブザーバビリティ」に近い。

具体的にやることは三つ: **異常検知**(学習した平常パターンから外れたメトリクスを自動フラグ)、**アラート相関**(1000件の通知を1インシデントに束ねる)、**根本原因ヒント**(直近のデプロイや設定変更との時刻相関)。AWSのDevOps Guru、Datadog Bits AI、PagerDuty AIOpsが同系統。

### いつ使うか
- [[monitoring]]の信号量が多すぎて人間がアラート疲労で麻痺しているとき
- [[microservices]]や[[serverless]]構成で「どこから来た障害か」の追跡が人手では辛いとき
- MTTR(平均復旧時間)がビジネスKPIになり自動triageが必要なとき
- [[cicd]]パイプラインが成熟していて、デプロイ・変更イベントがきれいなデータで入ってくるとき

### はまりやすい罠
- **データ基盤が貧弱なのにAIOpsを買う** — 信号がバラバラだとMLが学ぶパターンがない。[[monitoring]]とタグ規律が先。
- **「AIがやってくれる」** — 新種の障害はモデルにとって未知。人の判断を置き換えるのではなく、最も怪しい上位5件を示すツールと扱う。
- **[[hallucination]]の運用版** — 相関を因果のように提示することがある。「推定根本原因」を確定と読まない。
- **[[cicd]]なしのAIOps** — 「変更イベント」がデータから抜けると異常検知は推測になる。

### 繋がり
[[monitoring]]の次段階、[[debug]]の自動化された相棒。[[llmops]]とは別軸 — 前者は*インフラを動かすAI*、後者は*AIアプリを動かす運用*。[[iac]]と[[cicd]]がきれいな信号を供給してはじめて、AIOpsの嘘が減る。

---
id: llmops
cat: ops
size: 2
title:
  ko: LLMOps
  en: LLMOps
  ja: LLMOps
refs:
  - url: https://cloud.google.com/discover/what-is-llmops
    title: What is LLMOps? (Google Cloud)
    lang: en
  - url: https://www.databricks.com/glossary/llmops
    title: LLMOps (Databricks Glossary)
    lang: en
  - url: https://learn.microsoft.com/en-us/azure/machine-learning/prompt-flow/concept-model-monitoring-generative-ai
    title: Monitoring generative AI applications (Microsoft Learn)
    lang: en
extraEdges: []
---

## ko

LLMOps는 **LLM을 쓴 앱을 프로덕션에서 돌리는 데 필요한 운영 일습**이다. [[cicd]]가 결정론적 코드를 배포하는 규율이라면, LLMOps는 **확률적 출력**을 가진 시스템을 다루는 규율이다. 같은 프롬프트에 다른 답이 나오는 게 정상인 세계 — 그 혼돈을 통제 가능하게 만드는 도구·프로세스·지표의 모음.

핵심 관심사는 네 가지. **프롬프트를 코드처럼** ([[git]]에 버저닝, PR로 리뷰, 롤백 가능), **Eval** (새 모델/프롬프트가 이전보다 나쁘지 않은지 자동 평가 — LLM 앱의 [[tdd]] 대응물), **RAG 파이프라인** (벡터 인덱스를 [[iac]]처럼 재현 가능하게 빌드·갱신), **비용·지연·품질 모니터링** ([[monitoring]]의 AI판 — 토큰당 원가, p95 latency, [[hallucination]] 율 추적).

### 언제 쓰나
- LLM 앱이 프로토타입을 넘어 실사용자를 받을 때 — 단일 프롬프트 파일에서 벗어나야 할 시점
- 프롬프트/모델/RAG 인덱스 중 어느 조합이 배포되어 있는지 추적이 필요할 때
- [[cost]]가 튀기 시작해 토큰당 원가를 기능 단위로 쪼개 봐야 할 때
- 여러 명이 프롬프트를 만지고 있어 누가 언제 뭘 바꿨는지 [[git]] 이력으로 증명해야 할 때

### 쉽게 빠지는 함정
- **프롬프트를 하드코딩** — 문자열이 코드에 박히면 버저닝·롤백·A/B가 불가능. 프롬프트를 *아티팩트*로 취급하자.
- **Eval 없이 배포** — 새 모델로 바꿨는데 주요 플로우가 조용히 퇴화하는 걸 알아채는 유일한 방법이 고객 항의라면, 그건 LLMOps가 아니다.
- **[[hallucination]]을 모니터링 지표가 아닌 "일화"로 다룸** — "가끔 틀려요"는 관리할 수 없다. 구조화된 eval 셋이 있어야 수치가 된다.
- **[[context-eng]] 없이 RAG만 쑤셔넣기** — 검색이 쓰레기면 생성도 쓰레기. 인덱스의 신선도·커버리지가 앱 품질을 결정한다.
- **MLOps 도구를 그대로 씀** — MLOps는 결정론적 모델 가정. 프롬프트·RAG·에이전트 체인은 다른 아티팩트 모델이 필요하다.

### 연결
[[llm-basics]]와 [[prompt-eng]]이 "뭘 만들 건가"라면 LLMOps는 "어떻게 운영할 건가". [[hallucination]]과 [[cost]]는 LLMOps가 반드시 측정해야 할 두 지표. [[cicd]]와 [[iac]]의 문법을 그대로 받되 아티팩트는 프롬프트·인덱스로 확장. [[aiops]]와는 방향이 반대다 — AIOps는 *AI로 운영을*, LLMOps는 *AI의 운영을*.

## en

LLMOps is **the operational toolkit for running LLM-powered apps in production**. Where [[cicd]] is the discipline for shipping deterministic code, LLMOps is the discipline for shipping systems with **probabilistic outputs** — a world where "same prompt, different answer" is the normal case, and the job is to make that chaos governable.

Four concerns sit at its core. **Prompts as code** ([[git]]-versioned, PR-reviewed, rollback-able), **Evals** (automated checks that a new model or prompt isn't worse than before — the LLM-app analogue of [[tdd]]), **RAG pipelines** (vector indexes built and refreshed with the same reproducibility as [[iac]]), and **cost/latency/quality monitoring** ([[monitoring]] for AI — cost-per-token, p95 latency, [[hallucination]] rate as live metrics).

### When to use
- An LLM app graduates from prototype to real users — the single-prompt-file phase has ended
- You need to trace which combination of prompt/model/RAG index is actually deployed
- [[cost]] spikes start and you need per-feature cost-per-token breakdowns
- Multiple people edit prompts and you need [[git]] history to answer "who changed what and when"

### Common pitfalls
- **Hardcoded prompts** — strings embedded in code can't be versioned, rolled back, or A/B-tested. Treat prompts as *artifacts*.
- **Deploying without evals** — if customer complaints are your only signal that a model swap silently regressed a critical flow, that's not LLMOps.
- **Tracking [[hallucination]] as anecdote, not metric** — "it sometimes gets things wrong" is unmanageable. A structured eval set turns it into a number.
- **RAG without [[context-eng]]** — garbage retrieval, garbage generation. Index freshness and coverage decide app quality.
- **Reusing MLOps tooling wholesale** — MLOps assumes deterministic models. Prompts, RAG, agent chains need a different artifact model.

### How it connects
If [[llm-basics]] and [[prompt-eng]] answer "what are we building," LLMOps answers "how do we run it." [[hallucination]] and [[cost]] are the two metrics LLMOps *must* measure. It borrows [[cicd]]'s and [[iac]]'s grammar but extends artifacts to prompts and indexes. Opposite direction from [[aiops]] — AIOps applies *AI to operations*, LLMOps applies *operations to AI*.

## ja

LLMOpsは**LLMを使ったアプリを本番で動かすのに必要な運用一式**。[[cicd]]が決定論的なコードをデプロイする規律なら、LLMOpsは**確率的な出力**を持つシステムを扱う規律。同じプロンプトに違う答えが出るのが正常な世界で、その混沌を統治可能にするツール・プロセス・指標の集合。

関心事は四つ。**プロンプトをコードのように**([[git]]でバージョン管理、PRでレビュー、ロールバック可能)、**Eval**(新モデル・新プロンプトが以前より悪くないかの自動評価 — LLMアプリ版の[[tdd]])、**RAGパイプライン**(ベクトルインデックスを[[iac]]と同じ再現性で構築・更新)、**コスト・遅延・品質モニタリング**([[monitoring]]のAI版 — トークン単価、p95 latency、[[hallucination]]率をライブ指標に)。

### いつ使うか
- LLMアプリがプロトタイプを越えて実ユーザーを受ける段階 — 単一プロンプトファイルから卒業する時
- どのプロンプト・モデル・RAGインデックスの組み合わせが実際にデプロイされているか追跡が必要なとき
- [[cost]]が跳ね始め、トークン単価を機能別に切って見る必要があるとき
- 複数人がプロンプトを触っていて、誰がいつ何を変えたかを[[git]]履歴で示す必要があるとき

### はまりやすい罠
- **プロンプトのハードコード** — 文字列がコードに埋まるとバージョン管理・ロールバック・A/Bができない。プロンプトを*アーティファクト*として扱う。
- **Evalなしでデプロイ** — モデル差し替えで重要フローが静かに劣化したのを顧客クレームで初めて知るなら、それはLLMOpsではない。
- **[[hallucination]]を指標でなく「エピソード」で扱う** — 「たまに間違えます」は管理できない。構造化evalセットがあってはじめて数値になる。
- **[[context-eng]]なしでRAGだけ** — 検索がゴミなら生成もゴミ。インデックスの鮮度とカバレッジがアプリ品質を決める。
- **MLOpsツールをそのまま流用** — MLOpsは決定論的モデルを前提とする。プロンプト・RAG・エージェントチェーンは別のアーティファクトモデルが要る。

### 繋がり
[[llm-basics]]と[[prompt-eng]]が「何を作るか」なら、LLMOpsは「どう運用するか」。[[hallucination]]と[[cost]]はLLMOpsが必ず計測すべき二指標。[[cicd]]や[[iac]]の文法を借りつつ、アーティファクトをプロンプト・インデックスへ拡張する。[[aiops]]とは方向が逆 — AIOpsは*運用にAIを*、LLMOpsは*AIに運用を*。

---
id: hallucination
cat: ai
size: 3
title:
  ko: 환각 (Hallucination)
  en: Hallucination
  ja: ハルシネーション
refs:
  - url: https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)
    title: Hallucination (artificial intelligence) — Wikipedia
    lang: en
  - url: https://www.anthropic.com/research/measuring-model-persona-features
    title: Measuring model behavior — Anthropic Research
    lang: en
  - url: https://simonwillison.net/tags/hallucinations/
    title: Hallucination coverage — Simon Willison
    lang: en
extraEdges: []
---

## ko

환각은 **LLM이 "존재하지 않는 것을 존재하는 것처럼 말하는"** 현상이다. 존재하지 않는 함수, 가짜 라이브러리 이름, 지어낸 API 시그니처, 실재하지 않는 논문 인용 — 확률적으로 다음 토큰을 예측하는 모델의 본질적 특성이지 "버그"가 아니다. 모델은 "나도 모른다"를 말하도록 설계되지 않고 "그럴듯한 답"을 내도록 학습됐기 때문이다.

실무에서 환각이 가장 위험한 지점은 **자신 있게 틀린다**는 것. 인터넷에서 제일 흔한 패턴 네 가지: ① 존재하지 않는 Python 패키지명(`pip install aws-boto-helper` 같은 것), ② 실재하지 않는 AWS 서비스 이름 또는 엔드포인트, ③ 변경된 API를 옛날 시그니처로 호출, ④ 지어낸 RFC 번호·문서 링크. 방어선은 [[review-mindset]]과 [[testing]] — *실제로 돌려보는 것*이 진실의 기준.

### 언제 조심하나
- [[ai-coding-tools]]·[[claude-code]]가 새 라이브러리·API를 제안할 때 — 존재 여부 먼저 확인
- 최신 기능을 쓰라고 할 때 — 모델 학습 이후에 API가 바뀌었을 수 있음
- 구체적 버전·숫자를 인용할 때 — 모델은 "그럴듯한 숫자"를 만든다
- 긴 대화 중 — 누적된 컨텍스트가 "사실인 척 일관적인 거짓"을 만드는 경우
- [[llmops]] 운영에서 — 지표로 측정 안 하면 일화로만 관리하게 됨

### 대응 전략
- **근거 주입** — [[context-eng]]으로 문서·파일을 컨텍스트에 함께 제공. 참조가 있으면 지어내지 못함
- **자기 검증 프롬프트** — "답 전에 실제로 존재하는지 확인해"가 유의미하게 효과 있음
- **툴 사용** — 웹검색·파일읽기·명령실행이 붙은 에이전트는 [[hallucination]] 빈도가 떨어짐. [[mcp]]로 외부 세계 연결
- **[[testing]]·[[tdd]]** — 컴파일·실행이 진실 검사기. "돌아가나?"로 상당수 걸러짐
- **복수 답 비교** — [[convergence]] 사고로 한 번에 안 믿고 2~3회 재생성
- **[[llmops]] 지표화** — hallucination rate를 관찰 지표로 잡아 모델·프롬프트 회귀 감지

### 쉽게 빠지는 함정
- **"모델이 똑똑해지면 사라진다"는 낙관** — 더 똑똑한 모델은 *더 그럴듯하게* 틀린다. 절대량이 줄어도 검증 부담은 그대로
- **프롬프트로만 막으려 함** — "거짓말 금지"만으로는 약함. 근거·도구·검증 단계 세 겹이 기본
- **로그 분석 없이 일화로만** — "가끔 틀리던데요"는 관리 불가. 구조화된 eval 셋 필요
- **자기 검증 맹신** — 모델에게 "맞니?" 물으면 자기 답이 맞다고 과신. 외부 도구로 검증

### 연결
[[pitfalls]]의 핵심 항목이자 [[review-mindset]]이 반드시 스캔하는 패턴. [[context-eng]]·[[prompt-eng]]·[[llmops]] 세 축 모두 이 문제를 완화하는 장치를 가진다. [[agentic]] 시스템에서는 툴 사용으로 자연 감소하지만 완전 제거는 불가 — 개발 워크플로우에 "검증" 단계가 영구 상수로 들어가야 한다는 의미.

## en

Hallucination is what happens when an LLM **states nonexistent things as if they existed**: functions that don't exist, fake library names, invented API signatures, citations of papers that never were written. It's a fundamental property of a next-token predictor, not a "bug" — models aren't trained to say "I don't know," they're trained to produce plausible completions.

In practice the dangerous part is **confident wrongness**. The four most common patterns: (1) nonexistent Python packages (`pip install aws-boto-helper`-type names), (2) made-up AWS service names or endpoints, (3) calling a changed API with its old signature, (4) invented RFC numbers or doc links. The defense line is [[review-mindset]] and [[testing]] — *actually running the thing* is the truth test.

### When to watch for it
- An [[ai-coding-tools]] / [[claude-code]] suggestion of a new library or API — confirm existence first
- Requests to use "the latest feature" — APIs may have changed since training
- Specific version numbers or metrics — models generate plausible numbers
- Long conversations — accumulated context can produce internally-consistent fictions
- [[llmops]] operations — without a metric, you manage it anecdotally and lose

### Counter-strategies
- **Ground the context** — feed relevant docs and files via [[context-eng]]. Given a reference, the model can't invent
- **Self-verify prompts** — "before answering, verify this exists" demonstrably helps
- **Tool use** — agents with web search, file reads, or shell execution drift less. Wire external reality through [[mcp]]
- **[[testing]] / [[tdd]]** — compilation and execution are the truth tests
- **Multiple answers** — [[convergence]] thinking: don't trust one generation, compare 2–3
- **[[llmops]] metrics** — make hallucination rate a monitored metric to catch regressions

### Common pitfalls
- **"Smarter models fix it" optimism** — smarter models hallucinate *more plausibly*. Volume drops; verification load doesn't
- **Trying to prompt your way out** — "never lie" alone is weak. Grounding + tools + verification in three layers
- **Anecdotal tracking only** — "it misses sometimes" is unmanageable. Build a structured eval set
- **Trusting self-verification alone** — asking "is this right?" reinforces the model's own answer. Verify with external tools

### How it connects
A central entry in [[pitfalls]] and a pattern [[review-mindset]] must always scan for. All three axes of [[context-eng]], [[prompt-eng]], and [[llmops]] carry mitigations for it. [[agentic]] systems reduce the rate through tool use, but full elimination is impossible — meaning "verification" is a permanent constant in any AI-assisted workflow.

## ja

ハルシネーションはLLMが**「存在しないものを存在するかのように述べる」**現象。存在しない関数、偽のライブラリ名、捏造されたAPIシグネチャ、実在しない論文引用 — 次トークンを確率的に予測するモデルの本質的特性であって「バグ」ではない。モデルは「分かりません」と言うよう訓練されておらず、「もっともらしい答」を出すよう学習しているからだ。

実務で一番危険なのは**自信満々に間違える**こと。ネット上の最頻パターン四つ: ① 存在しないPythonパッケージ名(`pip install aws-boto-helper`のようなもの)、② 実在しないAWSサービス名やエンドポイント、③ 変更されたAPIを旧シグネチャで呼ぶ、④ 捏造されたRFC番号・ドキュメントリンク。防御線は[[review-mindset]]と[[testing]] — *実際に動かすこと*が真実の基準。

### いつ気をつけるか
- [[ai-coding-tools]]・[[claude-code]]が新ライブラリやAPIを提案するとき — まず存在確認
- 「最新機能」を使えと言うとき — 学習以降にAPIが変わっていることがある
- 具体的なバージョン番号や数値を引用するとき — モデルは「もっともらしい数値」を作る
- 長い対話 — 蓄積された文脈が「事実のように一貫した虚構」を作る
- [[llmops]]運用 — 指標で測らないと逸話でしか管理できない

### 対応戦略
- **根拠注入** — [[context-eng]]で関連ドキュメント・ファイルを一緒に渡す。参照があれば捏造できない
- **自己検証プロンプト** — 「答の前に実在を確認して」は有意に効く
- **ツール使用** — Web検索・ファイル読み・コマンド実行が付いたエージェントは頻度が下がる。[[mcp]]で外界と繋ぐ
- **[[testing]]・[[tdd]]** — コンパイル・実行が真実検査器
- **複数回答の比較** — [[convergence]]思考で一回を信じず2〜3回再生成
- **[[llmops]]指標化** — ハルシネーション率を観察指標に、モデル・プロンプト回帰を検知

### はまりやすい罠
- **「賢くなれば消える」楽観** — 賢いモデルほど*もっともらしく*間違える。絶対量は減るが検証負荷は変わらない
- **プロンプトだけで防ぐ** — 「嘘つくな」は弱い。根拠・ツール・検証の三層が基本
- **ログ分析なしの逸話管理** — 「たまに間違える」は管理不能。構造化evalセットが必要
- **自己検証への過信** — モデルに「合ってる?」と聞くと自答を肯定。外部ツールで検証

### 繋がり
[[pitfalls]]の核心項目であり、[[review-mindset]]が必ずスキャンするパターン。[[context-eng]]・[[prompt-eng]]・[[llmops]]の三軸すべてがこの問題を緩和する仕組みを持つ。[[agentic]]システムではツール使用で自然に減るが、完全除去は不可 — 開発ワークフローに「検証」段階が永久的な定数として入る、という意味だ。

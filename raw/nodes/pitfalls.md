---
id: pitfalls
cat: mindset
size: 2
title:
  ko: 바이브 코딩의 함정
  en: Pitfalls
  ja: 落とし穴
refs:
  - url: https://simonwillison.net/2025/Mar/19/vibe-coding/
    title: Not all AI-assisted programming is vibe coding — Simon Willison
    lang: en
  - url: https://www.anthropic.com/engineering/claude-code-best-practices
    title: Claude Code Best Practices (Anthropic Engineering)
    lang: en
extraEdges: []
---

## ko

Vibe 코딩의 함정은 **"AI가 만들어준 코드가 내 것처럼 보인다"는 착각**에서 시작된다. 실제로는 빠르게 쌓이는 네 종류의 부채가 있다: ① **이해 못 한 코드의 축적** — 돌아가지만 왜 돌아가는지 모름, 내일의 버그. ② **숨은 보안 구멍** — SQL 인젝션·XSS·평문 시크릿이 조용히 들어옴. ③ **가짜 라이브러리** — [[hallucination]]이 존재하지 않는 패키지 이름을 지어냄. ④ **테스트 없는 배포** — "돌아가는 것 같다"로 프로덕션까지 흘러감.

이 네 함정은 AI 코딩 도구의 *단점*이 아니라 *속도의 반대급부*다. 빠르게 만드는 능력이 커질수록, 이해·검증·보안 점검의 시간이 상대적으로 줄어 보이고, 그 누락이 빚으로 쌓인다. 해독제는 속도를 줄이는 게 아니라 **품질 게이트를 자동화**하는 것이다.

### 자주 만나는 함정들
- **"돌아가니까 됐어" 증후군** — 코드를 읽지 않고 커밋. [[review-mindset]]이 무너지면 나머지는 시간 문제
- **AI에게 디버깅까지 위임** — 모델이 문제를 *지어낼* 수 있다. 최소한 근본 원인 한 줄은 사람이 이해
- **[[simplify]] 없이 기능 추가만** — LLM은 기본적으로 과잉 설계한다. 추상화를 지우지 않으면 코드가 부풀어 오른다
- **[[small-steps]] 무시한 거대 변경** — 한 번에 200줄 머지 후 뭔가 깨지면 원인 추적 불가
- **시크릿을 프롬프트에 붙여 넣기** — 모델 학습·로그·중간 저장소로 누출될 수 있다
- **테스트를 AI에게 맡기고 읽지 않음** — 가짜 테스트(`expect(true).toBe(true)`)가 초록 불을 내준다. [[testing]]·[[tdd]]는 사람 확인 전제
- **의존성 폭증** — "이 라이브러리 쓰세요" 제안을 따라가면 package.json이 수백 개로 부푼다. [[package-mgr]] 관점에서 매번 의심

### 방어선
- **한 줄씩 읽고 이해 안 되면 질문** — [[review-mindset]]
- **자주 커밋, 자주 되돌림** — [[small-steps]] + [[git]]
- **테스트 직접 확인** — [[testing]] + [[tdd]]
- **보안 스캔을 [[cicd]]에 박기** — 사람 기억에 의존하지 말 것
- **[[hallucination]] 대응은 근거 주입**([[context-eng]])과 검증 단계로

### 연결
[[vibe]] 지도의 균형추. [[ai-coding-tools]]·[[claude-code]]의 가속 효과를 상쇄하는 방어선들 — [[review-mindset]]·[[testing]]·[[tdd]]·[[small-steps]]·[[simplify]]·[[context-eng]]이 이 함정들을 하나씩 상대한다. 이 노드를 "금지 목록"이 아니라 *체크리스트*로 쓰는 게 맞다: 새 기능 하나 추가할 때마다 일곱 함정을 빠르게 훑는다.

## en

Vibe-coding pitfalls start with **the illusion that AI-generated code is yours**. In practice, four kinds of debt accumulate fast: (1) **unread, unscrutinized code** — runs now, bugs tomorrow; (2) **silent security holes** — SQL injection, XSS, plaintext secrets slipping in; (3) **fake libraries** — [[hallucination]] invents packages that don't exist; (4) **deploy without tests** — "seems to work" shipped to production.

These four aren't *flaws* of AI coding tools; they're *the tax on speed*. The faster you can produce, the more the time for understanding, verification, and security review shrinks — and the gaps compound as debt. The cure isn't slowing down; it's **automating the quality gates**.

### Pitfalls you'll meet often
- **"It runs, ship it" syndrome** — committing without reading. Once [[review-mindset]] erodes, the rest is inevitable
- **Delegating debugging to the AI** — the model can *invent* causes. A human should at minimum grasp one sentence of root cause
- **Adding features without [[simplify]]** — LLMs over-engineer by default. Unless you actively delete abstractions, code inflates
- **Huge changes without [[small-steps]]** — merge 200 lines at once, then anything broken is un-bisectable
- **Pasting secrets into prompts** — can leak via training, logs, or intermediate storage
- **Trusting AI-generated tests without reading them** — fake tests like `expect(true).toBe(true)` go green and lie. [[testing]] and [[tdd]] presume human verification
- **Dependency bloat** — follow every "use this library" suggestion and `package.json` balloons. [[package-mgr]] says question each one

### Defenses
- **Read line by line; ask when unclear** — [[review-mindset]]
- **Commit often, revert often** — [[small-steps]] + [[git]]
- **Run and read the tests yourself** — [[testing]] + [[tdd]]
- **Bake security scans into [[cicd]]** — don't trust human memory
- **Counter [[hallucination]] with grounded context** ([[context-eng]]) and a verification step

### How it connects
The counterweight of the [[vibe]] map. Every defense above cancels one aspect of the acceleration that [[ai-coding-tools]] and [[claude-code]] deliver — [[review-mindset]], [[testing]], [[tdd]], [[small-steps]], [[simplify]], [[context-eng]] each answer one pitfall. Use this node as a *checklist*, not a ban list: sweep the seven items fast every time you add a feature.

## ja

Vibeコーディングの落とし穴は**「AIが作ったコードが自分のもののように見える」錯覚**から始まる。実際には速く積もる四種の負債がある: ① **理解していないコードの蓄積** — 動くが理由は分からず、明日のバグ。② **隠れたセキュリティ穴** — SQLインジェクション・XSS・平文シークレットが静かに混入。③ **偽のライブラリ** — [[hallucination]]が存在しないパッケージ名を作る。④ **テストなしデプロイ** — 「動くっぽい」で本番まで流れる。

この四つはAIコーディングツールの*欠点*ではなく、*速度の代償*。速く作る能力が大きくなるほど、理解・検証・セキュリティ確認の時間が相対的に減って見え、その抜けが負債として積もる。解毒剤は速度を落とすことではなく、**品質ゲートを自動化**することだ。

### よく出会う落とし穴
- **「動くからいい」症候群** — 読まずにコミット。[[review-mindset]]が崩れれば残りは時間の問題
- **デバッグまでAIに委譲** — モデルは原因を*捏造*し得る。少なくとも根本原因の一行は人が理解する
- **[[simplify]]なしの機能追加** — LLMは既定で過剰設計する。抽象を積極的に削らないとコードは膨れる
- **[[small-steps]]を無視した巨大変更** — 200行を一括マージ後に何か壊れると原因特定不可能
- **シークレットをプロンプトに貼り付け** — 学習・ログ・中間保存で漏洩し得る
- **AI生成テストを読まずに信頼** — `expect(true).toBe(true)`のような偽テストが緑になって嘘をつく。[[testing]]・[[tdd]]は人の確認を前提
- **依存の肥大化** — 「このライブラリを使って」の提案を全部取り込むとpackage.jsonが膨張。[[package-mgr]]は毎回疑え

### 防御線
- **一行ずつ読み、分からなければ質問** — [[review-mindset]]
- **頻繁にコミット、頻繁にrevert** — [[small-steps]] + [[git]]
- **テストは自分で実行して読む** — [[testing]] + [[tdd]]
- **セキュリティスキャンを[[cicd]]に埋める** — 人の記憶に頼らない
- **[[hallucination]]対策は根拠注入**([[context-eng]])と検証ステップで

### 繋がり
[[vibe]]地図の釣り合い錘。上記の防御線はそれぞれ、[[ai-coding-tools]]や[[claude-code]]がもたらす加速の一側面を相殺する — [[review-mindset]]・[[testing]]・[[tdd]]・[[small-steps]]・[[simplify]]・[[context-eng]]が落とし穴と一対一で対応。このノードは「禁止リスト」ではなく*チェックリスト*として使う: 機能追加のたびに七項目を素早く通す。

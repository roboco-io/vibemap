---
id: vibe
cat: core
size: 1
title:
  ko: 바이브 코딩
  en: Vibe Coding
  ja: バイブコーディング
refs:
  - url: https://roboco.io/posts/the-art-of-vibe-coding/
    title: The Art of Vibe Coding (roboco.io)
    lang: en
extraEdges: []
---

## ko

**바이브 코딩**은 직관과 느낌으로 AI에게 말을 걸어 코드를 만들어내는 방식이다. 원래는 "감으로 짜는" 개발자를 비꼬는 말이었지만, LLM 시대에 와서 "**프롬프트만으로 작동하는 코드를 얻는 기술**"로 재해석되었다.

비유: 운전을 배우는 대신 택시기사에게 목적지를 잘 설명하는 기술. 핸들을 직접 잡지 않아도 원하는 곳에 도착할 수 있다 — 목적지를 정확히 말할 수 있다면.

### 다섯 가지 원칙

- **좋은 입력을 준다** — AI는 맥락을 먹고 산다. [[prompt-eng]]과 [[context-eng]]를 도구로 삼는다
- **작은 단계로 쪼갠다** — [[small-steps]]. "로그인 전체"보다 "이메일 검증만 먼저"
- **자동화를 활용한다** — [[tdd]], [[lint]], 타입 체커가 수렴의 증거를 만든다
- **과감하게 단순화한다** — [[simplify]]. LLM이 만든 과잉 추상화를 지워라
- **How를 쓰지 마라** — [[intent]]에서 왔다. 스택·아키텍처는 AI가 고른다

### 왜 필요한가

코드 생성이 무료에 가까워지면서, 병목은 "빨리 많이 쓰기"가 아니라 "**무엇이 맞는지 빨리 아는 것**"으로 옮겨 갔다. [[claude-code]] 같은 에이전틱 도구가 인간보다 빠르게 코드를 쓰는 세계에서, 인간의 역할은 작성자가 아니라 판단자(judge)다.

### 함정을 피하는 법

바이브 코딩의 어두운 면은 [[pitfalls]]에 정리되어 있다. 요약: 이해 못 한 코드를 쌓지 말 것, 보안 구멍을 방치하지 말 것, 환각을 실행으로 검증할 것. 이 세 가지가 [[review-mindset]]과 함께 중급자의 분기점이다.

## en

**Vibe Coding** is the craft of talking to an AI by intuition and vibes to make code. Once mockery for "winging it" devs, it has been repurposed for the LLM era as "**getting working code from a prompt**."

Analogy: instead of learning to drive, you learn to tell a taxi driver exactly where to go. You still arrive — if your directions are clear.

### Five principles

- **Good inputs** — AI runs on context. [[prompt-eng]] and [[context-eng]] are your tools
- **Small steps** — [[small-steps]]. "Just the email field" beats "build login"
- **Lean on automation** — [[tdd]], [[lint]], and type checkers produce the evidence of convergence
- **Simplify boldly** — [[simplify]]. Delete the over-engineering the LLM added
- **Never write How** — inherited from [[intent]]. Stack and architecture are the AI's job

### Why it matters

When generating code became nearly free, the bottleneck shifted from "write a lot fast" to "**know quickly what's correct**." In a world where agentic tools like [[claude-code]] type faster than you do, your role is judge, not typist.

### Avoiding the dark side

Vibe coding's failure modes live in [[pitfalls]]. Short version: don't stack up code you don't understand, don't ignore quiet security holes, verify hallucinations by running the thing. Together with [[review-mindset]], those three form the intermediate-to-advanced boundary.

## ja

**バイブコーディング**は、直感と「ノリ」でAIに話しかけてコードを生み出す方法。元は「勘でコードを書く」開発者への皮肉だったが、LLM時代には「**プロンプトだけで動くコードを得る技術**」として再解釈された。

例え: 運転を覚える代わりに、タクシー運転手に目的地をうまく伝える技術。ハンドルを直接握らなくても目的地にたどり着ける — 行き先を正確に伝えられるなら。

### 5つの原則

- **良い入力を与える** — AIは文脈で動く。[[prompt-eng]]と[[context-eng]]が道具
- **小さく刻む** — [[small-steps]]。「ログイン全部」より「メール検証だけ」
- **自動化に寄りかかる** — [[tdd]]、[[lint]]、型チェッカーが収束の証拠を作る
- **思い切って単純化する** — [[simplify]]。LLMが追加した過剰抽象を削る
- **Howを書かない** — [[intent]]から継承。スタックや構成はAIの仕事

### なぜ必要か

コード生成がほぼ無料になった今、ボトルネックは「速く大量に書くこと」から「**何が正しいかを速く知ること**」へ移った。[[claude-code]]のようなエージェント型ツールが人間より速くコードを書く世界で、人間の役割は書き手ではなく審判(judge)だ。

### 落とし穴の避け方

バイブコーディングの暗部は[[pitfalls]]にまとまっている。要約すれば: 理解していないコードを積み上げない、静かなセキュリティ穴を放置しない、ハルシネーションは実行で検証する。この3つと[[review-mindset]]が、中級から上級への境界になる。

---
id: simplify
cat: mindset
size: 3
title:
  ko: 과감한 단순화
  en: Aggressive Simplicity
  ja: 思い切った単純化
refs:
  - url: https://en.wikipedia.org/wiki/KISS_principle
    title: KISS principle (Wikipedia)
    lang: en
  - url: https://grugbrain.dev/
    title: The Grug Brained Developer
    lang: en
  - url: https://blog.codinghorror.com/code-smaller/
    title: Code Smaller (Jeff Atwood)
    lang: en
extraEdges: []
---

## ko

과감한 단순화는 **"지워도 안 죽으면 지운다"**는 규율이다. LLM의 기본값은 과잉 설계 — 한 기능에 팩토리·인터페이스·유틸 모듈이 같이 딸려 온다. 그 상태로 쌓이면 코드베이스가 이해할 수 없는 레이어 케이크가 된다. 해독제는 기능을 더하는 속도만큼 *추상화를 지우는 의지*를 유지하는 것.

핵심 질문 세 개. **이거 꼭 필요해?** (한 번만 쓰이는 추상화는 추상화가 아니라 간접 계층이다), **이 함수가 없으면 무슨 일이 벌어지지?** (아무 일도 안 벌어지면 지운다), **설명이 한 문장으로 되나?** (안 되면 쪼갠 게 아니라 꼬아 놓은 것). KISS 원칙, Unix 철학, "grug brain" 운동 — 다 같은 영혼이다.

### 언제 쓰나
- [[claude-code]] 같은 에이전트가 머지해 달라고 내민 diff를 읽을 때 — "추상화가 필요해?" 질문부터
- 기능 추가가 끝난 뒤 [[refactor]] 단계에서 — 돌아가는 코드가 있어야 지워도 되는지 확신 가능
- [[review-mindset]]의 자연 확장 — "이 코드 이해 안 됨"이 "이 코드 불필요"로 자주 수렴
- 레거시 정리 — 3년 전에 쓴 "언젠가 필요할지도" 클래스를 오늘 지우는 날
- [[small-steps]] 직후 — 작은 커밋으로 쌓인 임시 비계를 한 번에 치우는 작업

### 쉽게 빠지는 함정
- **"언젠가 필요할지도" 증후군** — 쓰지 않는 추상화는 유지 비용만 낸다. YAGNI(You Aren't Gonna Need It) 원칙
- **추상화 = 품질이라는 오해** — 한 번만 쓰는 인터페이스, 하나뿐인 구현체의 팩토리, 호출자가 한 명인 래퍼. 다 간접 레이어일 뿐
- **지움을 리뷰어가 반대** — "예전에 쓰던 방식" 보존이 선이라 여기는 문화. [[git]] 히스토리에 남으면 충분, 현재 코드는 가볍게
- **과도하게 단순화해서 재발명** — 라이브러리 한 줄을 10줄 손수 구현. 반대 극단도 비용이다
- **[[testing]] 없이 지움** — 안전망 없이 삭제하면 조용한 회귀가 난다. 테스트로 보호한 뒤에 지운다

### 연결
[[refactor]]의 목적이자 [[pitfalls]]의 "LLM 과잉 설계" 해독제. [[small-steps]]이 추가의 리듬을 잡는다면, simplify는 *제거의 리듬*을 잡는다. [[review-mindset]]은 "이해 가능한가"를 묻고, simplify는 "필요한가"를 묻는다 — 순서대로 실행하면 자연히 얇아진다. [[framework]]를 고를 때도 같은 기준 — 더 적은 코드로 같은 일을 하는 선택이 대개 옳다.

## en

Aggressive simplicity is the discipline of **"if nothing dies when you delete it, delete it."** LLMs default to over-engineering — a single feature arrives with factories, interfaces, and utility modules tagging along. Let that accrete and your codebase becomes an unreadable layer cake. The antidote is matching the pace of *addition* with an equal pace of *removing abstraction*.

Three key questions. **Is this actually needed?** (an abstraction used once isn't an abstraction, it's indirection). **What breaks if this function disappears?** (if nothing breaks, delete it). **Can I describe it in one sentence?** (if not, you didn't split it, you tangled it). KISS, the Unix philosophy, the "grug brain" movement — all the same soul.

### When to use
- Reading a diff an agent like [[claude-code]] just handed you — start with "does this abstraction earn its keep?"
- [[refactor]] after a feature is working — you can only confidently delete when behavior is pinned
- Natural extension of [[review-mindset]] — "I don't understand this" often converges into "this isn't needed"
- Legacy cleanup days — deleting the "we might need it someday" class from three years ago
- Right after [[small-steps]] — consolidating temporary scaffolding that accumulated across many small commits

### Common pitfalls
- **"Someday we'll need it" syndrome** — unused abstractions only charge maintenance rent. YAGNI.
- **Abstraction-equals-quality confusion** — the single-use interface, the factory for one implementation, the wrapper with one caller. All pure indirection
- **Reviewers defending kept code** — culture treating preservation as virtue. [[git]] history keeps it; today's code should be lighter
- **Over-simplification → reinvention** — replacing one library line with ten hand-rolled ones. The opposite extreme also has a cost
- **Deleting without [[testing]]** — safety-netless removal invites silent regressions. Cover with tests *before* you delete

### How it connects
The purpose of [[refactor]] and the antidote to the "LLM over-engineering" entry in [[pitfalls]]. If [[small-steps]] is the rhythm of addition, simplify is the rhythm of *subtraction*. [[review-mindset]] asks "is this understandable?"; simplify asks "is this necessary?" — run them in order and the codebase thins naturally. The same criterion picks [[framework]] choices — fewer lines to do the same job is usually right.

## ja

思い切った単純化は**「消しても死ななければ消す」**規律。LLMの既定値は過剰設計 — 一機能にファクトリやインターフェース、ユーティリティモジュールが付いてくる。そのまま積もればコードベースは理解不能なレイヤーケーキになる。解毒剤は、機能を足す速度と同じ速度で*抽象化を削る意志*を保つこと。

核心の質問三つ。**本当に必要?** (一度しか使われない抽象は抽象ではなく間接層)、**この関数がなければ何が起きる?** (何も起きないなら消す)、**一文で説明できる?** (できないなら分割ではなく絡まっただけ)。KISS原則、Unix哲学、"grug brain"運動 — 全部同じ魂。

### いつ使うか
- [[claude-code]]のようなエージェントが出してきたdiffを読むとき — 「この抽象必要?」から始める
- 機能追加が終わった[[refactor]]段階 — 動くコードがあって初めて安心して消せる
- [[review-mindset]]の自然な延長 — 「このコード理解できない」がしばしば「このコード不要」に収束する
- レガシー整理日 — 3年前の「いつか必要かも」クラスを今日消す
- [[small-steps]]直後 — 小さなコミットで積もった仮足場を一度に片付ける

### はまりやすい罠
- **「いつか必要かも」症候群** — 使わない抽象は維持費だけ払う。YAGNI(You Aren't Gonna Need It)原則
- **抽象=品質の誤解** — 一度しか使わないインターフェース、実装が一つのファクトリ、呼び手が一人のラッパー。全部ただの間接層
- **削除に反対するレビュー文化** — 「以前のやり方」保存を美徳とする文化。[[git]]履歴に残れば十分、今のコードは軽く
- **削りすぎて再発明** — ライブラリの一行を十行自前実装。逆の極端にもコストがある
- **[[testing]]なしに削る** — セーフティネットなしで消すと静かな回帰が起きる。テストで守った後に消す

### 繋がり
[[refactor]]の目的であり、[[pitfalls]]の「LLM過剰設計」項目に対する解毒剤。[[small-steps]]が追加のリズムを取るなら、simplifyは*削除のリズム*を取る。[[review-mindset]]が「理解可能か?」を問い、simplifyは「必要か?」を問う — 順に実行すれば自然にコードは薄くなる。[[framework]]選びにも同じ基準 — 少ない行で同じ仕事をする選択が大抵正しい。

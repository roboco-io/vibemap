---
id: tdd
cat: tech
size: 1
title:
  ko: TDD (Test-Driven Development)
  en: TDD (Test-Driven Development)
  ja: TDD (テスト駆動開発)
refs:
  - url: https://en.wikipedia.org/wiki/Test-driven_development
    title: Test-driven development (Wikipedia)
    lang: en
  - url: https://tidyfirst.substack.com/
    title: Tidy First? — Kent Beck's blog
    lang: en
  - url: https://martinfowler.com/bliki/TestDrivenDevelopment.html
    title: Test Driven Development — Martin Fowler
    lang: en
extraEdges: []
---

## ko

TDD(Test-Driven Development)는 **"구현 전에 실패하는 테스트를 먼저 쓰는"** 개발 규율이다. Kent Beck이 1990년대 후반 eXtreme Programming 운동에서 정식화했고, 지금은 소프트웨어 공학의 근본 기술 중 하나. 사이클은 단순하다: **Red**(실패 테스트 작성) → **Green**(최소 코드로 통과) → **Refactor**(중복·설계 정리). 이 세 박자를 빠르게 반복하며 코드와 테스트가 함께 자란다.

핵심 효과는 세 가지. ① **설계를 향상** — 테스트 가능한 코드는 자연히 결합도가 낮고 응집도가 높다. ② **안전망** — 리팩터링·변경 시 회귀를 즉시 감지. ③ **문서** — 테스트가 "이 코드가 무엇을 하는가"의 실행 가능한 명세. [[small-steps]]·[[convergence]] 사고와 영혼이 같고, AI 시대에는 "[[claude-code]]가 테스트를 먼저 써달라"는 지시만으로도 [[hallucination]]을 크게 줄이는 방법이 됐다.

### 언제 쓰나
- **새 기능 추가** — 빨간 테스트부터 쓰면 스코프가 명확해진다
- **버그 수정** — 버그를 재현하는 실패 테스트 먼저, 그다음 고치기 (회귀 방지 자동)
- **레거시 리팩터** — 특성 테스트(characterization test)로 현재 동작을 포착한 뒤 구조 바꾸기
- **AI와 페어 코딩** — "테스트 먼저 써달라"는 단 한 줄이 [[ai-coding-tools]] 품질의 분기점
- **API 설계 탐색** — 쓰는 쪽 관점에서 테스트 쓰면 사용성 문제가 드러남

### 흐름과 용어
- **Red / Green / Refactor** — 세 단계. Red 없이 Green 금지, Refactor는 Green 유지 하에 구조만
- **Arrange / Act / Assert** — 테스트 내부 구조. 준비 → 실행 → 검증
- **Given / When / Then** — BDD에서 같은 구조를 다른 언어로
- **TDD vs BDD** — BDD는 비즈니스 언어로 쓴 TDD. 대상 독자가 다름
- **단위 ([[ut]]) / 통합 ([[it]]) / E2E ([[e2e]])** — TDD 원리는 모든 계층에 적용되나 피라미드의 아래쪽에서 주로

### 쉽게 빠지는 함정
- **"다 짠 다음 테스트 쓰기"** — 그건 테스트일 뿐 TDD가 아님. Red 없이 Green은 설계 효과 없음
- **구현을 그대로 복사한 테스트** — assertion이 구현과 동일하면 회귀 감지 안 됨. *행동*을 테스트
- **너무 큰 Red** — 한 번에 통과시키기 힘든 큰 테스트는 작게 쪼개야
- **Refactor 생략** — 녹색 바로 다음 기능 추가로 넘어가면 코드가 부풀어 오름. Refactor가 핵심의 반
- **[[hallucination]]된 테스트** — AI가 `expect(true).toBe(true)` 같은 가짜를 내놓으면 초록불만 남음. [[review-mindset]]로 체크
- **느린 테스트로 TDD 포기** — 테스트 한 번 실행에 5분이면 TDD는 불가능. 테스트 속도는 TDD의 전제

### 연결
[[testing]]·[[ut]]·[[it]]·[[e2e]]의 사고 방식. [[small-steps]]·[[convergence]]·[[refactor]]·[[simplify]]와 영혼 공유. [[cicd]]의 안정성은 TDD가 만드는 테스트 자산 위에 선다. [[claude-code]]·[[ai-coding-tools]] 시대에 [[pitfalls]]의 많은 항목을 자동 방어하는 규율 — "AI에게 테스트부터 쓰게 시켜라"가 2026년 가장 비용 대비 효과가 큰 한 줄.

## en

TDD (Test-Driven Development) is the discipline of **"write a failing test before the implementation."** Formalized by Kent Beck in the late 1990s during the eXtreme Programming movement, it's now one of software engineering's foundational techniques. The loop is simple: **Red** (write a failing test) → **Green** (minimum code to pass) → **Refactor** (remove duplication, improve design). Iterate this three-beat fast, and code and tests grow together.

Three payoffs. (1) **Design improves** — testable code naturally has low coupling, high cohesion. (2) **Safety net** — refactors and changes surface regressions immediately. (3) **Documentation** — tests are executable specifications of what the code does. It shares a soul with [[small-steps]] and [[convergence]]. In the AI era, a single instruction — "[[claude-code]], write the test first" — dramatically cuts [[hallucination]].

### When to use
- **Adding a feature** — starting with a red test clarifies scope
- **Fixing a bug** — reproduce with a failing test first, then fix (regression prevention comes free)
- **Legacy refactor** — pin current behavior with characterization tests, then restructure
- **Pair-coding with AI** — "write the test first" is the single line that forks [[ai-coding-tools]] quality
- **API design exploration** — writing the test from the consumer side exposes usability issues

### Flow and vocabulary
- **Red / Green / Refactor** — three phases. No Green without Red; Refactor keeps Green while reshaping
- **Arrange / Act / Assert** — the test's internal structure. Set up, execute, verify
- **Given / When / Then** — same shape in BDD, just different language
- **TDD vs BDD** — BDD is TDD written in business language. Different audience
- **Unit ([[ut]]) / Integration ([[it]]) / E2E ([[e2e]])** — the principle applies at every layer, weighted to the bottom of the pyramid

### Common pitfalls
- **"Tests after implementation"** — that's testing, not TDD. Without Red, no design benefit
- **Tests that mirror the implementation** — assertions identical to code catch no regressions. Test *behavior*
- **Too-big Red** — a test you can't pass in one pass needs splitting
- **Skipping Refactor** — jumping to the next feature right after Green bloats code. Refactor is half the value
- **[[hallucination]]-ed tests** — AI outputs like `expect(true).toBe(true)` give only a green light. [[review-mindset]] catches these
- **Abandoning TDD due to slow tests** — five-minute test runs kill the loop. Test speed is a TDD prerequisite

### How it connects
The mindset that powers [[testing]], [[ut]], [[it]], [[e2e]]. Shares a soul with [[small-steps]], [[convergence]], [[refactor]], [[simplify]]. [[cicd]]'s reliability rests on the test assets TDD produces. In the [[claude-code]] / [[ai-coding-tools]] era, it automatically defends against many items in [[pitfalls]] — "tell the AI to write the test first" is the highest-ROI one-liner of 2026.

## ja

TDD(Test-Driven Development)は**「実装の前に失敗するテストを先に書く」**開発規律。Kent Beckが1990年代後半のeXtreme Programming運動で定式化し、今やソフトウェア工学の基礎技術の一つ。サイクルは単純: **Red**(失敗テストを書く) → **Green**(最小のコードで通す) → **Refactor**(重複・設計を整える)。この三拍子を速く繰り返し、コードとテストが共に育つ。

核となる効果三つ。① **設計が良くなる** — テスト可能なコードは自然に結合度が低く凝集度が高い。② **セーフティネット** — リファクタや変更の際、回帰を即座に検知。③ **ドキュメント** — テストが「このコードが何をするか」の実行可能な仕様。[[small-steps]]・[[convergence]]と魂を共有し、AI時代には「[[claude-code]]にテストを先に書かせる」一言が[[hallucination]]を大きく減らす方法になった。

### いつ使うか
- **新機能追加** — 赤いテストから書けばスコープが明確になる
- **バグ修正** — 再現する失敗テストを先に、その後修正(回帰防止が自動)
- **レガシーリファクタ** — 特性テスト(characterization test)で現在の振る舞いを捕捉し構造変更
- **AIとのペアコーディング** — 「テストを先に書いて」という一言が[[ai-coding-tools]]品質の分岐点
- **API設計の探索** — 利用側視点でテストを書くと使いにくさが露呈

### 流れと用語
- **Red / Green / Refactor** — 三段階。RedなしにGreenは禁止、RefactorはGreenを保ったまま構造のみ
- **Arrange / Act / Assert** — テスト内部構造。準備 → 実行 → 検証
- **Given / When / Then** — BDDで同じ構造を違う言語で
- **TDD vs BDD** — BDDはビジネス言語で書いたTDD。対象読者が違う
- **単体([[ut]])/結合([[it]])/E2E([[e2e]])** — TDDの原理は全層に適用されるがピラミッドの下に比重

### はまりやすい罠
- **「実装後にテスト」** — それはテストであってTDDではない。RedなしにGreenは設計効果なし
- **実装をそのままコピーしたテスト** — アサーションが実装と同じなら回帰検知できない。*振る舞い*をテスト
- **大きすぎるRed** — 一度に通らない大きなテストは小さく分割する
- **Refactor省略** — 緑の直後に次機能へ行くとコードが膨れる。Refactorが価値の半分
- **[[hallucination]]されたテスト** — AIが`expect(true).toBe(true)`のような偽物を出すと緑信号だけ残る。[[review-mindset]]でチェック
- **遅いテストでTDD放棄** — テスト一回の実行に5分ならTDDは不可能。テスト速度はTDDの前提

### 繋がり
[[testing]]・[[ut]]・[[it]]・[[e2e]]の考え方。[[small-steps]]・[[convergence]]・[[refactor]]・[[simplify]]と魂を共有。[[cicd]]の安定性はTDDが作るテスト資産の上に立つ。[[claude-code]]・[[ai-coding-tools]]時代は[[pitfalls]]の多くを自動防御する規律 — 「AIにテストから書かせよ」が2026年最もコスパの高い一行。

---
id: testing
cat: tech
size: 2
title:
  ko: 테스팅
  en: Testing
  ja: テスティング
refs:
  - url: https://martinfowler.com/articles/practical-test-pyramid.html
    title: The Practical Test Pyramid — Martin Fowler
    lang: en
  - url: https://en.wikipedia.org/wiki/Software_testing
    title: Software testing (Wikipedia)
    lang: en
  - url: https://testing.googleblog.com/
    title: Google Testing Blog
    lang: en
extraEdges: []
---

## ko

테스팅은 **"코드가 원래 의도한 대로 동작하는지 기계가 반복 검증할 수 있게 만드는 일"**이다. 사람이 수동으로 클릭하며 확인하는 건 지속 불가능 — 한 번 만든 테스트가 매 배포마다 자동으로 돌아야 한다. [[cicd]]와 짝, [[tdd]]의 구현 수단, [[review-mindset]]의 보조 장치. "잘 돌아간다"와 "증명된다" 사이의 거리를 메우는 기술.

테스트 피라미드는 Mike Cohn이 제안한 고전 구조: 아래가 넓고(**[[ut]]** 단위 테스트, 빠르고 많음) 위로 갈수록 좁아진다(**[[it]]** 통합 테스트, **[[e2e]]** 엔드투엔드). 왜 피라미드인가? 위로 갈수록 *느리고 비싸고 불안정*하기 때문. "트로피" 형태도 유명하다(정적 분석·[[lint]] + 통합 중심). 어떤 모양이든 — 하나의 원칙: **빠른 피드백 많이, 느린 검증 적게**.

### 테스트 계층
- **[[ut]] 단위 테스트** — 함수·클래스 단위. 밀리초. 수천 개
- **[[it]] 통합 테스트** — 모듈 간 협력. 수초. 수백 개
- **[[e2e]] 엔드투엔드** — 실제 사용자 플로우. 수초~수십초. 수십 개
- **계약 테스트** — API 소비자-공급자 간 합의 검증. [[microservices]]에서 중요
- **속성 테스트**(property-based) — 수많은 랜덤 입력에 대해 불변식 검증
- **성능·부하 테스트** — 기능이 아닌 비기능 요구사항
- **카오스 테스트** — 의도적 장애 주입으로 복원력 검증

### 언제 무엇을
- **로직 검증** → [[ut]]
- **DB·API·외부 통합** → [[it]]
- **사용자 여정** → [[e2e]] (비싼 편이라 핵심 플로우만)
- **[[microservices]] 경계** → 계약 테스트로 독립 배포 안전성
- **파서·알고리즘·수식** → 속성 테스트가 수동 작성보다 강함

### 쉽게 빠지는 함정
- **피라미드 역전** — [[e2e]]만 잔뜩, [[ut]]은 얼마 없음. 실행 시간은 길고 실패 원인 파악은 어려움. "아이스크림 콘" 안티 패턴
- **flaky 테스트 방치** — 가끔 실패하는 테스트는 가장 해롭다. 아무도 실패를 믿지 않게 됨. 고치거나 지우기
- **Mock 남발** — 다 mock하면 사실상 구현만 테스트하는 꼴. 통합 지점 하나는 실제로
- **[[hallucination]]된 테스트** — `expect(true).toBe(true)`, assertion 없는 블록. AI 생성 테스트는 [[review-mindset]] 필수
- **커버리지 수치에 집착** — 100% 라인 커버리지여도 품질 안 됨. 핵심 경로의 *행동*이 더 중요
- **[[testing]]과 [[debug]]의 혼동** — debug는 문제를 찾는 행위, test는 문제가 없음을 보증하는 자산. 둘을 섞으면 둘 다 약해짐

### 연결
[[tdd]]의 사고 방식을 구현하는 도구 모음. [[cicd]] 파이프라인의 핵심 단계. [[review-mindset]]의 자동 보조. [[pitfalls]]의 "테스트 없는 배포" 항목에 직접 대응. [[microservices]]·[[serverless]] 아키텍처에서는 계약 테스트가 독립 배포를 가능하게 하는 조건. [[claude-code]] 같은 AI에게는 "테스트를 먼저 써라"가 가장 큰 품질 레버.

## en

Testing is **"making code's correctness machine-verifiable on repeat."** Manual click-through doesn't scale — once written, tests need to run automatically on every deploy. Paired with [[cicd]], the implementation mechanism of [[tdd]], an auxiliary of [[review-mindset]]. Testing closes the gap between "seems to work" and "proven."

Mike Cohn's classic test pyramid stacks tests from wide-and-fast at the bottom (**[[ut]]** — unit) to narrow-and-slow at the top (**[[it]]** — integration, **[[e2e]]** — end-to-end). Why a pyramid? Upper layers are *slower, costlier, flakier*. The "trophy" shape is also popular (static analysis + [[lint]] + integration-heavy). Whatever the shape, one principle rules: **fast feedback often, slow verification rarely**.

### Test layers
- **[[ut]] unit** — function / class scope. Milliseconds. Thousands
- **[[it]] integration** — modules cooperating. Seconds. Hundreds
- **[[e2e]] end-to-end** — real user flows. Seconds to tens of seconds. Dozens
- **Contract tests** — consumer/provider API agreement checks. Crucial for [[microservices]]
- **Property-based** — invariants verified across many random inputs
- **Performance / load** — nonfunctional rather than functional
- **Chaos testing** — deliberate fault injection to prove resilience

### Which when
- **Logic verification** → [[ut]]
- **DB / API / external integration** → [[it]]
- **User journeys** → [[e2e]] (expensive, reserve for core flows)
- **[[microservices]] boundaries** → contract tests to keep independent deploys safe
- **Parsers, algorithms, formulas** → property-based beats hand-written

### Common pitfalls
- **Inverted pyramid** — heavy [[e2e]], light [[ut]]. Slow runs, unclear failures. The "ice-cream cone" anti-pattern
- **Flaky tests ignored** — the most toxic kind. Nobody trusts failures anymore. Fix or delete
- **Mock overuse** — mocking everything tests only the implementation. Leave at least one integration point real
- **[[hallucination]]-ed tests** — `expect(true).toBe(true)`, assertion-less blocks. AI-generated tests demand [[review-mindset]]
- **Obsessing over coverage numbers** — 100% line coverage doesn't imply quality. Core-path *behavior* matters more
- **Confusing [[testing]] and [[debug]]** — debug hunts problems; tests are assets that guarantee no problem exists. Blending weakens both

### How it connects
The toolkit that implements [[tdd]]'s mindset. The core stage of [[cicd]] pipelines. An automated ally of [[review-mindset]]. Directly answers the "deploy without tests" entry in [[pitfalls]]. In [[microservices]] / [[serverless]] architectures, contract tests are what make independent deploys possible. For agents like [[claude-code]], "write tests first" is the biggest quality lever.

## ja

テスティングは**「コードが意図通りに動くかを機械が繰り返し検証できるようにする仕事」**。人が手動でクリックして確認するのは持続不能 — 一度書いたテストはデプロイごとに自動で走る必要がある。[[cicd]]と対、[[tdd]]の実装手段、[[review-mindset]]の補助。「うまく動くようだ」と「証明できる」の隙間を埋める技術。

テストピラミッドはMike Cohnが提案した古典構造: 下が広く(**[[ut]]**単体テスト、速く多い)、上に行くほど狭まる(**[[it]]**結合テスト、**[[e2e]]**エンドツーエンド)。なぜピラミッドか? 上ほど*遅く高く不安定*だから。「トロフィー」形も有名(静的解析・[[lint]] + 結合中心)。どの形でも原則は一つ: **速いフィードバックを多く、遅い検証を少なく**。

### テスト階層
- **[[ut]]単体テスト** — 関数・クラス単位。ミリ秒。数千
- **[[it]]結合テスト** — モジュール間の協調。数秒。数百
- **[[e2e]]エンドツーエンド** — 実ユーザーフロー。数秒〜数十秒。数十
- **契約テスト** — 消費者/供給者間のAPI合意検証。[[microservices]]で重要
- **特性(property-based)テスト** — 多数のランダム入力で不変条件を検証
- **性能・負荷テスト** — 機能でなく非機能要件
- **カオステスト** — 意図的な障害注入で復元力を検証

### 何をいつ
- **ロジック検証** → [[ut]]
- **DB・API・外部統合** → [[it]]
- **ユーザージャーニー** → [[e2e]](高価、核心フロー限定)
- **[[microservices]]境界** → 契約テストで独立デプロイの安全性
- **パーサー・アルゴリズム・数式** → 特性テストが手書きより強い

### はまりやすい罠
- **逆ピラミッド** — [[e2e]]ばかり、[[ut]]が少ない。実行時間長く失敗原因不明。「アイスクリームコーン」アンチパターン
- **flakyテストの放置** — たまに落ちるテストが最も有害。誰も失敗を信じなくなる。直すか消す
- **Mock濫用** — 全部モックすると実質実装のみテスト。統合点を一つは本物で
- **[[hallucination]]されたテスト** — `expect(true).toBe(true)`、アサーションなしブロック。AI生成テストは[[review-mindset]]必須
- **カバレッジ数値に固執** — 100%ライン網羅でも品質にはならない。核心経路の*振る舞い*が重要
- **[[testing]]と[[debug]]の混同** — debugは問題を探す行為、testは問題がないことを保証する資産。混ぜると両方弱くなる

### 繋がり
[[tdd]]の考え方を実装する道具一式。[[cicd]]パイプラインの核心段階。[[review-mindset]]の自動補助。[[pitfalls]]の「テストなしデプロイ」項目に直接対応。[[microservices]]・[[serverless]]アーキテクチャでは契約テストが独立デプロイを可能にする条件。[[claude-code]]のようなAIには「テストから書け」が最大の品質レバー。

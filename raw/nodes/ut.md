---
id: ut
cat: tech
size: 3
title:
  ko: 단위 테스트 (Unit Test)
  en: Unit Test
  ja: 単体テスト
refs:
  - url: https://en.wikipedia.org/wiki/Unit_testing
    title: Unit testing (Wikipedia)
    lang: en
  - url: https://martinfowler.com/bliki/UnitTest.html
    title: Unit Test — Martin Fowler
    lang: en
extraEdges: []
---

## ko

단위 테스트(Unit Test, UT)는 **"가장 작은 코드 단위(함수·클래스)가 혼자서 올바른지 빠르게 검증하는 테스트"**다. [[testing]] 피라미드의 가장 아래, [[tdd]] 사이클의 기본 재료. 하나의 테스트는 밀리초 안에 끝나고, 외부 I/O(DB·네트워크·파일)를 건드리지 않으며, 다른 테스트와 독립적이다. 이 셋이 만족되지 않으면 엄밀히는 단위 테스트가 아니라 [[it]](통합 테스트)에 가깝다.

"단위"의 범위는 언어·커뮤니티마다 다르다. Java 전통은 클래스, 함수형 언어는 함수 하나, Fowler는 "고립된 한 부분". 중요한 건 *고립성* — 테스트 대상만 실행되고, 협력자는 mock·stub·fake으로 대체하거나 실제 모듈이지만 부수 효과 없음. Jest·Vitest(JS), pytest(Python), JUnit(Java), Go의 `testing` 패키지 등 각 언어 표준 러너를 쓴다.

### 언제 쓰나
- **순수 로직·알고리즘·포맷 변환** — 입력/출력이 명확하면 UT가 최적
- **[[tdd]] 사이클** — Red/Green/Refactor의 기본 단위
- **리팩터 안전망** — 내부 구조 바꿀 때 외부 행동 유지 확인
- **엣지 케이스 탐색** — null, 빈 배열, 음수, 경계값 — UT가 가장 싸고 빠름
- **회귀 방지** — 한 번 발견한 버그를 UT로 고정하면 다시는 안 난다

### 쉽게 빠지는 함정
- **구현 세부를 테스트** — 내부 변수 이름·호출 순서를 assert하면 리팩터가 불가능. *공개된 행동*만 테스트
- **mock 남발** — 다 mock하면 사실상 "구현이 구현을 호출한다"만 증명. 순수 로직은 mock 없이 실제 값으로
- **느린 UT** — 100개 테스트 실행에 30초 걸리면 TDD 깨짐. DB·네트워크 접근이 숨어 있는지 의심
- **비결정적 테스트** — `new Date()`, `Math.random()`, 타이머에 의존하면 flaky. 시계·랜덤 시드를 주입 가능하게
- **공유 상태로 테스트 간 오염** — 전역 변수·싱글톤을 쓰면 실행 순서에 따라 결과가 달라짐. `beforeEach`로 초기화
- **커버리지 100%에 집착** — 도달 가능한 모든 라인 실행은 쉽지만 *의미 있는 검증*은 별개. 분기·경계·오류 경로에 집중

### 구조 체크리스트
- Arrange / Act / Assert — 명확히 구분
- 한 테스트 한 가지 행동 — 이름도 그대로 반영 ("handles_empty_input")
- Setup/teardown 최소화 — 과한 `beforeAll`은 테스트 이해를 어렵게 함
- 실패 메시지가 진단 가능 — "Expected X, got Y"가 한 줄에 읽혀야

### 연결
[[testing]] 피라미드의 토대, [[tdd]] 사이클의 실행 단위. [[it]]·[[e2e]]와 계층 구분. [[cicd]]에서 가장 먼저 돌아가는 단계 (빠르니까). [[refactor]]의 안전망이자 [[claude-code]]·[[ai-coding-tools]] 코드 검토의 자동 상대 — AI 생성 코드에 "이 함수의 UT도 같이 써줘"는 품질의 가장 싼 레버.

## en

A unit test (UT) is **"a test that quickly verifies the smallest code unit (function / class) in isolation."** It sits at the bottom of the [[testing]] pyramid and is the basic ingredient of the [[tdd]] loop. A single test finishes in milliseconds, touches no external I/O (DB, network, files), and is independent of other tests. Miss any of those three and it's closer to an [[it]] (integration test).

What "unit" means varies by language and community. Java tradition says class; functional languages say function; Fowler says "an isolated piece." What matters is *isolation* — only the unit under test runs, and collaborators are replaced with mocks, stubs, fakes, or real modules with no side effects. Tools follow the language: Jest/Vitest (JS), pytest (Python), JUnit (Java), Go's `testing` package, etc.

### When to use
- **Pure logic, algorithms, format conversion** — clear in/out makes UT optimal
- **[[tdd]] cycle** — the base unit of Red/Green/Refactor
- **Refactor safety net** — confirm external behavior is preserved when internals change
- **Edge-case exploration** — null, empty array, negatives, boundaries — UT is cheapest, fastest
- **Regression prevention** — pin a discovered bug with a UT; it never returns

### Common pitfalls
- **Testing implementation details** — asserting on internal variable names or call order kills refactoring. Test *public behavior*
- **Mock abuse** — mocking everything proves only "implementation calls implementation." Pure logic takes real values
- **Slow UTs** — 30 seconds for 100 tests breaks TDD. Suspect hidden DB or network calls
- **Non-determinism** — depending on `new Date()`, `Math.random()`, timers produces flaky tests. Inject clocks and random seeds
- **Cross-test contamination via shared state** — globals or singletons mean order affects outcome. Reset in `beforeEach`
- **Obsessing over 100% coverage** — hitting every line is easy; *meaningful verification* isn't. Focus on branches, boundaries, error paths

### Structure checklist
- Arrange / Act / Assert clearly separated
- One test, one behavior — and name it that way ("handles_empty_input")
- Minimal setup/teardown — heavy `beforeAll` obscures the test
- Readable failure messages — "Expected X, got Y" in one line

### How it connects
Foundation of the [[testing]] pyramid, execution unit of the [[tdd]] loop. Stratified against [[it]] and [[e2e]]. The first stage in [[cicd]] (it's fast). A safety net for [[refactor]] and the automatic counterpart of [[claude-code]] / [[ai-coding-tools]] code review — "write a UT for that function too" is the cheapest quality lever over AI-generated code.

## ja

単体テスト(Unit Test、UT)は**「最小のコード単位(関数・クラス)が単独で正しいかを速く検証するテスト」**。[[testing]]ピラミッドの最下層、[[tdd]]サイクルの基本素材。一つのテストはミリ秒で終わり、外部I/O(DB・ネットワーク・ファイル)に触れず、他のテストと独立している。この三つが揃わなければ厳密には単体テストでなく[[it]](結合テスト)に近い。

「単位」の範囲は言語・コミュニティで違う。Java伝統ではクラス、関数型言語では関数一つ、Fowlerは「孤立した一部分」。大事なのは*孤立性* — テスト対象だけが実行され、協力者はmock・stub・fakeで置き換えるか、実モジュールでも副作用なし。Jest・Vitest(JS)、pytest(Python)、JUnit(Java)、Goの`testing`パッケージなど各言語標準ランナーを使う。

### いつ使うか
- **純ロジック・アルゴリズム・フォーマット変換** — 入出力が明確ならUTが最適
- **[[tdd]]サイクル** — Red/Green/Refactorの基本単位
- **リファクタのセーフティネット** — 内部構造を変えるときに外部振る舞いを保つ確認
- **エッジケース探索** — null、空配列、負数、境界値 — UTが最も安く速い
- **回帰防止** — 発見したバグをUTで固定すれば二度と出ない

### はまりやすい罠
- **実装詳細をテスト** — 内部変数名や呼び出し順にassertするとリファクタ不可能。*公開された振る舞い*をテスト
- **mock濫用** — 全部mockすると実質「実装が実装を呼ぶ」ことを証明するだけ。純ロジックはmockなしで実値で
- **遅いUT** — 100テストに30秒かかればTDDが崩れる。DB・ネットワーク呼び出しが隠れていないか疑う
- **非決定的テスト** — `new Date()`、`Math.random()`、タイマー依存はflakyに。時計とランダムシードは注入可能に
- **共有状態によるテスト間汚染** — グローバルやシングルトンは実行順で結果が変わる。`beforeEach`で初期化
- **100%カバレッジに固執** — 全行実行は簡単だが*意味ある検証*は別物。分岐・境界・エラー経路に集中

### 構造チェックリスト
- Arrange / Act / Assertを明確に区切る
- 1テスト1振る舞い — 名前にも反映("handles_empty_input")
- Setup/teardownは最小 — 重い`beforeAll`はテスト理解を妨げる
- 失敗メッセージは診断可能に — "Expected X, got Y"が一行で読める

### 繋がり
[[testing]]ピラミッドの土台、[[tdd]]サイクルの実行単位。[[it]]・[[e2e]]との階層区分。[[cicd]]で最初に走る段階(速いから)。[[refactor]]のセーフティネットであり[[claude-code]]・[[ai-coding-tools]]コードレビューの自動相手 — AI生成コードに「この関数のUTも一緒に書いて」は品質の最も安いレバー。

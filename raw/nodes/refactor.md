---
id: refactor
cat: tool
size: 3
title:
  ko: 리팩터링
  en: Refactoring
  ja: リファクタリング
refs:
  - url: https://martinfowler.com/books/refactoring.html
    title: Refactoring (2nd edition) — Martin Fowler
    lang: en
  - url: https://refactoring.guru/refactoring
    title: Refactoring Guru
    lang: en
extraEdges: []
---

## ko

리팩터링은 **"외부 동작은 그대로 두고 내부 구조만 바꾸는 작업"**이다. Martin Fowler의 정의가 지금도 표준: *behavior preserving*이 핵심. 기능을 추가하지 않고, 버그를 고치지 않으며, 성능을 최적화하지도 않는다. 오직 코드를 *이해하고 고치기 쉬운 모양*으로만 재배열한다. 이 경계를 지켜야 안전 — 리팩터와 기능 변경을 섞으면 리뷰·디버깅·롤백이 모두 어려워진다.

[[tdd]]의 Red/Green/Refactor 사이클에서 세 번째 단계가 이 행위. 녹색 테스트를 유지하면서 중복을 제거하고, 이름을 개선하고, 긴 함수를 쪼갠다. [[simplify]]와 방향이 같다 — 둘 다 "덜어내기". 하지만 [[simplify]]가 "불필요한 걸 지우자"라면 리팩터는 "필요한 걸 더 잘 배치하자"에 가깝다. 두 작업이 번갈아 일어난다.

### 언제 하나
- 같은 코드를 3번 반복하게 된 순간 (rule of three)
- 함수나 클래스가 너무 커져 한눈에 안 들어올 때
- 이름이 사실을 더 이상 설명 못 할 때 (도메인이 진화)
- 새 기능을 추가하려는데 기존 구조가 막을 때 — *"make the change easy, then make the easy change"* (Kent Beck)
- [[testing]] 자산이 충분할 때 — 테스트 없는 리팩터는 도박

### 대표 기법 (Fowler 카탈로그)
- **Extract Function/Variable** — 긴 표현을 잘라 이름 붙이기
- **Inline Function/Variable** — 이름이 의미를 더하지 않으면 펼치기
- **Rename** — 가장 강력하고 가장 과소평가된 기법
- **Replace Conditional with Polymorphism** — if/switch 뭉치를 다형성으로
- **Move Function/Field** — 잘못된 위치의 논리를 적합한 모듈로
- **Extract Class** — 한 클래스의 책임이 둘이면 쪼개기

### 쉽게 빠지는 함정
- **기능 변경을 섞음** — 리팩터 PR에 신규 기능 한 줄 — 리뷰·디버깅 지옥. 커밋·PR을 분리
- **테스트 없이 시작** — 리팩터가 버그를 만들었는지 알 방법이 없음. [[ut]]·[[it]]이 안전망
- **너무 큰 리팩터** — 하루 종일 구조 변경 → main에 머지 안 되고 갈등. [[small-steps]]으로 쪼갤 것
- **이유 없는 리팩터** — "그냥 더 예뻐 보여서"는 동료 시간을 씀. *그다음 작업이 쉬워지는가*로 정당화
- **[[ai-coding-tools]]에게 "리팩터해줘"** — 동작 보존 검증 없이 진행하면 기능 상실. 테스트가 붙어 있어야 안전
- **[[simplify]]와 혼동** — 리팩터는 구조 재배열, simplify는 제거. 섞어 써도 되지만 의도는 구분

### 커밋 구분
- **리팩터 커밋**: "refactor: extract X from Y"
- **기능 커밋**: "feat: add X"
- **버그 커밋**: "fix: Y"
이 구분이 [[git]] log를 유용하게 만든다. [[tidd]]와 결합하면 티켓 유형까지 이어진다.

### 연결
[[tdd]] 사이클의 세 번째 단계. [[simplify]]와 짝 — 제거와 재배열. [[testing]]·[[ut]]·[[it]]가 안전망이고, 안전망 없는 리팩터는 위험. [[small-steps]]으로 조각 내서 진행. [[review-mindset]]에서 "이 PR은 동작 변경 없다"를 리뷰어가 빠르게 확인 가능한 구조가 좋은 리팩터 PR. [[ai-coding-tools]] + 충분한 테스트 자산이 조합되면 대규모 리팩터도 안전해진다.

## en

Refactoring is **"changing internal structure while preserving external behavior."** Martin Fowler's definition is still the standard: *behavior-preserving* is the core. No new features, no bug fixes, no performance optimization. Only rearranging the code into a shape that's *easier to understand and change*. Holding this line keeps it safe — mixing refactor with feature change makes review, debugging, and rollback all harder.

It's the third phase of [[tdd]]'s Red/Green/Refactor. With green tests held, remove duplication, improve names, break long functions apart. Refactoring shares a direction with [[simplify]] — both subtract. But where [[simplify]] asks "what's unnecessary?", refactor asks "how should the necessary be arranged?" The two alternate.

### When to do it
- The moment you write the same pattern three times (rule of three)
- When a function or class is too large to hold in one view
- When names stop telling the truth (the domain has evolved)
- When a new feature can't fit without reshaping the context — *"make the change easy, then make the easy change"* (Kent Beck)
- When [[testing]] coverage is strong enough — refactor without tests is gambling

### Canonical moves (Fowler's catalog)
- **Extract Function / Variable** — slice a long expression and name it
- **Inline Function / Variable** — if the name adds no meaning, unwrap it
- **Rename** — the most powerful and most underrated move
- **Replace Conditional with Polymorphism** — collapse switch-heavy code via polymorphism
- **Move Function / Field** — relocate logic to the right module
- **Extract Class** — split one class that owns two responsibilities

### Common pitfalls
- **Mixing feature changes** — one new line in a refactor PR creates review hell. Keep commits and PRs separate
- **No tests to start** — you can't tell whether the refactor broke anything. [[ut]] and [[it]] are the safety net
- **Oversized refactors** — a day of restructuring never lands on main. Split by [[small-steps]]
- **Refactor without reason** — "it just looks nicer" burns teammate time. Justify with "does the next task get easier?"
- **Asking [[ai-coding-tools]] to "refactor"** — proceeding without behavior-preservation verification loses features. Tests are required
- **Confusing with [[simplify]]** — refactor rearranges; simplify removes. They can coexist, but keep intent distinct

### Commit hygiene
- **Refactor commit**: "refactor: extract X from Y"
- **Feature commit**: "feat: add X"
- **Bug commit**: "fix: Y"
This separation makes [[git]] log useful. Combined with [[tidd]], the ticket type follows the commit type.

### How it connects
The third phase of the [[tdd]] cycle. Paired with [[simplify]] — rearrangement and removal. [[testing]], [[ut]], [[it]] form the safety net; refactor without them is dangerous. Drive it via [[small-steps]]. A good refactor PR is one a reviewer can quickly verify as "no behavior change" ([[review-mindset]]). Pairing [[ai-coding-tools]] with strong test coverage is what makes even large refactors safe.

## ja

リファクタリングは**「外部の振る舞いを保ったまま内部構造だけを変える作業」**。Martin Fowlerの定義が今も標準: *behavior preserving*が核心。機能を追加せず、バグを直さず、性能を最適化もしない。ただコードを*理解し変更しやすい形*に並べ替えるだけ。この境界を守ってこそ安全 — リファクタと機能変更を混ぜるとレビュー・デバッグ・ロールバックすべてが難しくなる。

[[tdd]]のRed/Green/Refactorサイクルの三番目の段階がこれ。緑のテストを保ったまま重複を取り除き、名前を改善し、長い関数を分ける。[[simplify]]と方向が同じ — 両方「減らす」。だが[[simplify]]が「不要なものを消す」なら、リファクタは「必要なものをよりよく配置する」に近い。二つの作業が交互に起きる。

### いつやるか
- 同じコードを3回繰り返した瞬間(rule of three)
- 関数やクラスが大きすぎて一目で見えなくなったとき
- 名前が事実をもう説明できなくなったとき(ドメインが進化)
- 新機能を追加しようとしたら既存の構造が邪魔するとき — *"make the change easy, then make the easy change"*(Kent Beck)
- [[testing]]資産が十分なとき — テストなしのリファクタは賭け

### 代表技法(Fowlerのカタログ)
- **Extract Function/Variable** — 長い式を切って名前を付ける
- **Inline Function/Variable** — 名前が意味を加えなければ展開
- **Rename** — 最も強力で最も過小評価された技法
- **Replace Conditional with Polymorphism** — if/switchの塊を多態性に
- **Move Function/Field** — 間違った場所のロジックを適切なモジュールへ
- **Extract Class** — 一クラスに責任が二つあれば分ける

### はまりやすい罠
- **機能変更を混ぜる** — リファクタPRに新機能一行 — レビュー・デバッグ地獄。コミット・PRを分ける
- **テストなしで開始** — リファクタがバグを作ったか分かりようがない。[[ut]]・[[it]]がセーフティネット
- **大きすぎるリファクタ** — 一日中構造変更 → mainにマージされず衝突。[[small-steps]]で分割
- **理由なきリファクタ** — 「なんとなく綺麗に見えた」は同僚の時間を使う。*次の作業が楽になるか*で正当化
- **[[ai-coding-tools]]に「リファクタして」** — 動作保存の検証なしで進めると機能が消える。テストが必要
- **[[simplify]]と混同** — リファクタは構造再配置、simplifyは削除。混用して良いが意図は区別

### コミット区分
- **リファクタコミット**: "refactor: extract X from Y"
- **機能コミット**: "feat: add X"
- **バグコミット**: "fix: Y"
この区分が[[git]] logを有用にする。[[tidd]]と組めばチケット種別まで繋がる。

### 繋がり
[[tdd]]サイクルの三番目。[[simplify]]と対 — 削除と再配置。[[testing]]・[[ut]]・[[it]]がセーフティネットで、ネットなしのリファクタは危険。[[small-steps]]で刻んで進める。[[review-mindset]]では「このPRは動作変更なし」をレビュアーが速く確認できる構造が良いリファクタPR。[[ai-coding-tools]] + 十分なテスト資産の組合せで大規模リファクタも安全になる。

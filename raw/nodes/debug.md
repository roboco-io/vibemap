---
id: debug
cat: tool
size: 2
title:
  ko: 디버깅
  en: Debugging
  ja: デバッグ
refs:
  - url: https://debuggingbook.org/
    title: The Debugging Book (free online)
    lang: en
  - url: https://en.wikipedia.org/wiki/Debugging
    title: Debugging (Wikipedia)
    lang: en
extraEdges: []
---

## ko

디버깅은 **"코드의 기대 동작과 실제 동작 사이의 차이를 찾아내고 좁히는 활동"**이다. 새 기능을 만드는 일이 아니고, 잘못된 곳이 *왜* 잘못됐는지를 *이해*하는 일. [[testing]]이 "문제 없음을 증명"하는 자산이라면, 디버깅은 "있는 문제를 찾는" 행위 — 두 축을 섞어 쓰면 둘 다 약해진다.

디버깅의 근본 원칙은 단순하다: **가정을 하나씩 검증**. 프로그램 동작 중 어느 지점에서 기대가 깨지는지 찾는 과정. print·logger·디버거·트레이스 — 도구는 달라도 본질은 같다. "이쯤이면 X여야 한다"를 체크하고, 맞으면 다음, 틀리면 그 앞쪽으로. AI 시대에는 [[claude-code]]에게 "디버깅 위임"보다 "[[hallucination]] 경계하며 같이 추적"이 현명하다 — 모델은 그럴듯한 원인을 *지어낼 수 있다*.

무엇보다 **디버깅은 추론이 아니라 증거에 기반한다**. 로그·메트릭·트레이스·디버거 출력 — 실제로 관측된 데이터만이 사실이다. "아마 ~때문일 것이다"는 가설일 뿐, 데이터로 확인하기 전에는 코드를 고치지 않는다. 특히 [[ai-coding-tools]] 에이전트는 여러 가정을 쌓아 그럴듯한 원인을 빠르게 *추론*하려는 경향이 강하고, 그 추론은 자주 틀린다. 에이전트에게 디버깅을 시킬 때는 관련 로그·메트릭을 먼저 보여달라고 명시하고, 증거 없이 나온 변경 제안은 거부한다.

### 언제 쓰나
- 버그 신고 — 재현부터
- [[testing]] 실패 — 빨간 불이 붙었을 때 가정 검증
- 성능 문제 — 프로파일러로 병목 찾기
- [[monitoring]] 경보 — 지표가 말하는 이상을 코드까지 추적
- [[llmops]]·[[aiops]] 이상 — 데이터 이상을 코드 원인으로 귀인

### 체계적 접근
- **증거 우선, 추론 금지** — 로그·메트릭·트레이스에서 *관측된 사실*만 근거로 채택. "아마 X일 것이다"는 가설로 명시하고 데이터로 확인된 다음에 행동. 증거가 없으면 먼저 로깅·관측을 추가하는 것이 변경보다 우선
- **재현 먼저** — 신뢰할 수 있는 재현 방법 없으면 디버깅은 추측. 테스트 케이스로 고정
- **작게 격리** — 전체 시스템이 아니라 의심 구간만. [[small-steps]] 정신
- **가정을 글로** — 머릿속으로만 하면 같은 실수 반복. 수첩·쪽지에라도
- **binary search** — [[git]] bisect가 대표. "언제부터 망가졌나"를 로그(n) 단계로
- **가장 최근 변경 의심** — 보통 여기에 범인 있음
- **디버거 > print** — 조건부 중단점·변수 감시·호출 스택이 print보다 효율적 (단, [[serverless]]·프로덕션에선 로그가 주)

### 쉽게 빠지는 함정
- **증상 위치 = 원인 위치 오해** — null pointer가 난 줄이 원인이 아닐 수 있음. 상류로 올라가라
- **"재실행하면 될지도"** — 타이밍·레이스·외부 상태 의존이면 재실행이 일시 해결처럼 보임. 근본 원인을 놓침
- **AI에게 원인만 물어봄** — [[hallucination]]의 가장 위험한 영역. 에이전트는 로그를 보지 않고도 가정을 쌓아 그럴듯한 원인을 *추론*해 답한다 — 빠르고 자신감 있어 보이지만 자주 틀린다. 최소한 한 줄은 사람이 로그·메트릭으로 검증
- **로그에 의존하는데 로그가 없음** — [[monitoring]] 설계가 허술하면 디버깅이 추측이 됨. 초기부터 로그·트레이스
- **디버깅 끝에 테스트 안 추가** — 같은 버그가 또 난다. [[tdd]] 정신 — 버그는 테스트로 "박제"
- **[[testing]]과 혼동** — 디버깅으로 발견한 근본 원인은 [[ut]]·[[it]] 어딘가에 회귀 테스트로 고정해야 자산이 됨

### 연결
[[testing]]과 쌍을 이루는 축. [[tdd]]의 Red 단계가 디버깅 진입점이자 출구. [[monitoring]]·[[aiops]]가 상위 관찰 도구, 디버깅이 하위 조사 도구. [[ai-coding-tools]] 시대에는 *디버깅을 에이전트에 위임*하는 시도가 늘고 있으나, [[review-mindset]]·[[pitfalls]] 관점에서 가장 조심해야 하는 영역이기도 하다. [[git]] bisect는 가장 강력한 디버깅 무기 중 하나.

## en

Debugging is **"the activity of finding and narrowing the gap between a program's expected and actual behavior."** It's not writing new features; it's *understanding why* the wrong thing is wrong. Where [[testing]] is an asset that "proves no problem exists," debugging is the act of "finding an existing problem." Blending the two axes weakens both.

The fundamental principle is simple: **verify assumptions one at a time**. Work out where, in the running program, expectation first breaks. print, logger, debugger, traces — tools differ, essence doesn't. Check "by this point, X should be true"; if yes, move forward; if no, move upstream. In the AI era, "we trace it *together* with a wary eye for [[hallucination]]" beats "we delegate debugging to [[claude-code]]" — the model can *invent* plausible causes.

Above all, **debugging is grounded in evidence, not inference**. Logs, metrics, traces, debugger output — only data you actually observed counts as fact. "It's probably because X" is a hypothesis; never change code on a hypothesis until data confirms it. [[ai-coding-tools]] agents in particular tend to stack assumptions and *infer* a plausible cause quickly, and that inference is wrong often enough to matter. When you delegate debugging to an agent, demand that it show the relevant logs and metrics first, and reject change proposals that arrive without evidence.

### When to debug
- Bug report — reproduction first
- Failing [[testing]] — a red result calls for assumption checking
- Performance problems — find bottlenecks with a profiler
- [[monitoring]] alerts — trace an anomalous metric back to code
- [[llmops]] / [[aiops]] anomalies — attribute data anomalies to code causes

### Systematic approach
- **Evidence first, no inference** — only observed facts in logs, metrics, and traces count. State "it's probably X" as a hypothesis explicitly, then act only after data confirms it. If evidence is missing, add logging and observability *before* changing code
- **Reproduce first** — without a reliable repro, debugging is guessing. Pin it with a test
- **Isolate small** — focus on the suspect region, not the whole system. [[small-steps]] spirit
- **Write down hypotheses** — mental-only breeds repeats. Notebook or sticky note
- **Binary search** — [[git]] bisect is the flagship. "Where did this break?" in log(n) steps
- **Suspect the most recent change** — the culprit usually lives there
- **Debugger > print** — conditional breakpoints, watches, call stacks beat print most days (in [[serverless]] / prod, logs rule)

### Common pitfalls
- **Confusing symptom location with cause location** — the null-pointer line may not be the cause. Walk upstream
- **"Maybe it will pass on retry"** — timing / race / external state can make retry look like a fix. Root cause lost
- **Asking the AI for the cause alone** — the most dangerous corner of [[hallucination]]. Agents stack assumptions without ever reading the logs and *infer* a plausible cause — fast and confident, often wrong. At minimum, a human verifies one sentence against actual logs or metrics
- **Depending on logs you didn't write** — weak [[monitoring]] turns debugging into guessing. Log and trace from day one
- **Skipping the test after you find the bug** — the same bug returns. [[tdd]] mentality: mount the bug as a regression test
- **Blurring with [[testing]]** — a root cause found via debugging should be pinned as a regression test in [[ut]] or [[it]] to become an asset

### How it connects
Paired axis with [[testing]]. The Red phase of [[tdd]] is debugging's entry and exit. [[monitoring]] and [[aiops]] are the upper-level observability tools; debugging is the lower-level investigation tool. In the [[ai-coding-tools]] era, "delegate debugging to the agent" is increasingly attempted, but this is also the area where [[review-mindset]] and [[pitfalls]] caution matters most. [[git]] bisect is one of the most powerful debugging weapons.

## ja

デバッグは**「コードの期待動作と実際の動作の差を見つけて縮める活動」**。新機能を作る仕事ではなく、間違っている場所が*なぜ*間違っているかを*理解する*仕事。[[testing]]が「問題がないことを証明する」資産なら、デバッグは「ある問題を探す」行為 — 二軸を混ぜると両方弱くなる。

デバッグの根本原則は単純: **仮定を一つずつ検証**。プログラム動作中のどこで期待が壊れるかを見つけるプロセス。print・logger・デバッガ・トレース — 道具は違っても本質は同じ。「ここまででXのはず」を確認し、合えば先へ、合わなければ前方へ。AI時代には[[claude-code]]に「デバッグを委譲」するより「[[hallucination]]を警戒しながら一緒に追う」方が賢明 — モデルはもっともらしい原因を*捏造し得る*。

何より、**デバッグは推論ではなく証拠に基づく**。ログ・メトリック・トレース・デバッガ出力 — 実際に観測されたデータだけが事実。「たぶん〜だろう」は仮説に過ぎず、データで確認するまでコードを変更しない。特に[[ai-coding-tools]]エージェントは複数の仮定を積み上げてもっともらしい原因を素早く*推論*しようとする傾向が強く、その推論はしばしば外れる。エージェントにデバッグを任せる時は、関連ログ・メトリックを先に提示するよう明示し、証拠なき変更提案は却下する。

### いつ使うか
- バグ報告 — 再現から
- [[testing]]失敗 — 赤が出たら仮定を検証
- 性能問題 — プロファイラでボトルネック探し
- [[monitoring]]アラート — 指標が言う異常をコードまで追跡
- [[llmops]]・[[aiops]]異常 — データ異常をコード原因に帰す

### 体系的アプローチ
- **証拠優先、推論禁止** — ログ・メトリック・トレースで*観測された事実*だけを根拠に。「たぶんXだろう」は仮説と明示し、データで確認してから行動。証拠がなければコード変更より先にロギング・観測を追加する
- **再現が先** — 信頼できる再現法なしにデバッグは推測。テストケースで固定
- **小さく隔離** — システム全体でなく疑わしい区間だけ。[[small-steps]]精神
- **仮説を書き出す** — 頭の中だけだと同じミスを繰り返す。ノートや付箋に
- **binary search** — [[git]] bisectが代表。「いつから壊れたか」をlog(n)段階で
- **直近の変更を疑う** — 大抵ここに犯人
- **デバッガ > print** — 条件付きブレークポイント・ウォッチ・コールスタックがprintより効率的(ただし[[serverless]]・本番ではログが主)

### はまりやすい罠
- **症状の場所=原因の場所の誤解** — null pointerが出た行が原因とは限らない。上流へ
- **「再実行で治るかも」** — タイミング・レース・外部状態依存では再実行が一時解決に見える。根本原因を逃す
- **AIに原因だけ尋ねる** — [[hallucination]]の最も危険な領域。エージェントはログを見ずに仮定を積み上げてもっともらしい原因を*推論*して答える — 速く自信ありげに見えるがしばしば外れる。最低でも一行は人がログ・メトリックで検証
- **ログに頼るがログがない** — [[monitoring]]設計が甘いとデバッグが推測に。初日からログ・トレース
- **デバッグ後にテスト追加しない** — 同じバグが再発。[[tdd]]精神 — バグは回帰テストで「剥製化」
- **[[testing]]と混同** — デバッグで見つけた根本原因は[[ut]]・[[it]]のどこかに回帰テストとして固定してこそ資産になる

### 繋がり
[[testing]]と対をなす軸。[[tdd]]のRed段階がデバッグの入口であり出口。[[monitoring]]・[[aiops]]が上位観察ツール、デバッグが下位調査ツール。[[ai-coding-tools]]時代には*デバッグをエージェントに委譲*する試みが増えているが、[[review-mindset]]・[[pitfalls]]観点で最も注意すべき領域でもある。[[git]] bisectは最も強力なデバッグ武器の一つ。

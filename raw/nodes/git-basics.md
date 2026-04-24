---
id: git-basics
cat: tool
size: 3
title:
  ko: Git 기초
  en: Git Basics
  ja: Git基礎
refs:
  - url: https://git-scm.com/book/en/v2
    title: Pro Git (free online)
    lang: en
  - url: https://learngitbranching.js.org/
    title: Learn Git Branching — interactive tutorial
    lang: en
extraEdges: []
---

## ko

Git 기초는 **"Git의 모든 것을 이해하려 하지 않고 매일 쓰는 동사 10개 안쪽만 내 것으로 만드는 과정"**이다. 완전히 익히려 들면 수렁이지만, 필수 명령만 체화하면 1주일 안에 일상 업무가 매끄러워진다. 어려움은 명령어 수가 아니라 모델이 처음엔 *추상적*이라는 데 있다 — 몇 번 손으로 만져보면 갑자기 단순해진다.

매일 쓰는 10개는 이 정도. `git status`(지금 상태), `git add`(스테이징), `git commit`(스냅샷), `git push`(원격에 올림), `git pull`(원격에서 가져옴), `git branch`(분기 목록·생성), `git checkout`/`git switch`(분기 전환), `git merge`(분기 합침), `git log`(히스토리), `git diff`(변경 내용). 이 10개 + `git reflog`(안전망)를 외우면 일상이 해결된다. 나머지(rebase, cherry-pick, bisect, stash)는 필요할 때 배워도 늦지 않다.

### 필수 모델 세 가지
- **Working directory** — 지금 파일의 실제 상태
- **Staging area(Index)** — 다음 커밋에 들어갈 예정의 변경 모음. `git add`의 목적지
- **Repository** — 커밋이 저장되는 곳. `git commit`이 Index에서 여기로 이동

이 세 공간을 머릿속에 그리면 90%의 헷갈림이 풀린다. "내 변경이 어디 있지?"는 위 셋 중 하나.

### 언제 배우나
- [[git]]을 처음 쓰기 시작한 개발자·비개발자
- "왜 머지 충돌이 나요?"·"reflog가 뭐예요?" 같은 질문이 막히는 시점
- [[ai-coding-tools]]가 Git 명령을 대신 쳐주는데 결과를 이해해야 할 때
- [[tidd]]·[[pr]]·[[trunk]]·[[gitops]] 같은 상위 규율로 넘어가기 전 토대

### 쉽게 빠지는 함정
- **`git commit -am`으로 전부** — 새 파일은 `git add`가 먼저 필요. 몰라서 커밋 안 된 줄 착각
- **`git add .`으로 의도 없는 파일까지** — `node_modules`·`.env`가 딸려 들어감. `.gitignore` 먼저
- **충돌을 "덮어쓰기"로 해결** — 한쪽을 무의식적으로 버리면 기능 사라짐. 실제 변경을 이해하고 병합
- **reflog를 모른다** — "커밋이 사라졌다"는 거의 항상 오해. `git reflog`가 모든 HEAD 이동을 기억
- **`git push --force`를 아무데나** — 공유 브랜치에 쏘면 동료 작업 지움. `--force-with-lease`를 습관으로
- **커밋 메시지에 "fix"만** — 1달 뒤 자신이 못 알아봄. "무엇을·왜"를 한 줄로
- **[[ai-coding-tools]] 생성 커밋 그대로** — 기능 + 리팩터 + 포맷이 뒤섞인 커밋. [[small-steps]]으로 쪼갤 것

### 학습 순서 추천
- 1단계: `clone`·`status`·`add`·`commit`·`log` — 혼자 쓰기
- 2단계: `branch`·`checkout`·`merge` — 분기 개념
- 3단계: `push`·`pull`·`remote` — [[github]] 연동
- 4단계: `rebase`·`stash`·`cherry-pick` — 고급 편집
- 5단계: `reflog`·`bisect`·`revert` — 구조·복구

### 연결
[[git]]의 하위축으로 "첫 1주일에 배울 것". [[pr]]·[[tidd]]·[[trunk]]·[[gitops]]의 모든 상위 규율이 이 토대 위에 선다. [[ai-coding-tools]]는 Git 명령을 대신 쳐주지만 *결과를 읽는 능력*은 여전히 사람 몫 — 그 능력의 기초가 이 노드.

## en

Git basics is **"the path of not trying to learn everything about Git, but mastering the ~10 verbs you use daily."** Attempting to absorb it all is a swamp; just internalize the essentials and daily work smooths out within a week. The difficulty isn't the number of commands — it's that the model is *abstract* at first. A few hands-on passes and it snaps into place.

The daily ten look like: `git status` (current state), `git add` (staging), `git commit` (snapshot), `git push` (upload), `git pull` (fetch and merge), `git branch` (list / create), `git checkout` / `git switch` (switch branches), `git merge` (combine branches), `git log` (history), `git diff` (changes). Those ten plus `git reflog` (the safety net) handle daily life. The rest — rebase, cherry-pick, bisect, stash — can wait until you need them.

### Three essential mental models
- **Working directory** — the actual file state right now
- **Staging area (Index)** — the set of changes that will go in the next commit. The destination of `git add`
- **Repository** — where commits are stored. `git commit` moves from Index into here

Picture these three and 90% of confusion dissolves. "Where is my change?" is always in one of the three.

### When to learn
- New developers and non-developers just starting with [[git]]
- When questions like "why did the merge conflict?" or "what is reflog?" stall you
- When [[ai-coding-tools]] run Git for you and you need to read the result
- As the foundation before moving to [[tidd]], [[pr]], [[trunk]], [[gitops]]

### Common pitfalls
- **Relying on `git commit -am` for everything** — new files still need `git add`. Easy to think it committed when it didn't
- **Sweeping `git add .`** — drags in `node_modules`, `.env`. Set up `.gitignore` first
- **Resolving conflicts by "overwriting"** — unconsciously dropping one side deletes features. Understand both changes first
- **Not knowing reflog** — "my commits are gone" is almost always a misunderstanding. `git reflog` remembers every HEAD move
- **`git push --force` everywhere** — force on a shared branch overwrites teammates. Make `--force-with-lease` the default
- **Commit messages that just say "fix"** — you won't recognize it a month later. One line on *what* and *why*
- **Using [[ai-coding-tools]] commits as-is** — a mixed blob of feature + refactor + format. Split per [[small-steps]]

### Suggested learning order
- Stage 1: `clone`, `status`, `add`, `commit`, `log` — solo use
- Stage 2: `branch`, `checkout`, `merge` — branching concepts
- Stage 3: `push`, `pull`, `remote` — integrating with [[github]]
- Stage 4: `rebase`, `stash`, `cherry-pick` — advanced editing
- Stage 5: `reflog`, `bisect`, `revert` — structure and recovery

### How it connects
A sub-axis of [[git]] that "learns the first week." All higher disciplines — [[pr]], [[tidd]], [[trunk]], [[gitops]] — rest on this foundation. [[ai-coding-tools]] issue Git commands for you, but *reading the result* is still a human skill — and this node is the base of that skill.

## ja

Git基礎は**「Gitの全部を理解しようとせず、毎日使う動詞10個前後を自分のものにする過程」**。完全に習得しようとすると沼だが、必須コマンドだけ体得すれば1週間以内に日常業務が滑らかになる。難しさはコマンド数ではなく、モデルが最初は*抽象的*なことに由来する — 何度か手で触れば急に単純になる。

毎日使う10個はこんな感じ。`git status`(今の状態)、`git add`(ステージング)、`git commit`(スナップショット)、`git push`(リモートへ)、`git pull`(リモートから)、`git branch`(分岐一覧・作成)、`git checkout`/`git switch`(分岐切替)、`git merge`(分岐統合)、`git log`(履歴)、`git diff`(変更内容)。この10 + `git reflog`(セーフティネット)を覚えれば日常は解決する。残り(rebase、cherry-pick、bisect、stash)は必要になってから学べば遅くない。

### 必須モデル三つ
- **Working directory** — 今のファイルの実状態
- **Staging area(Index)** — 次のコミットに入る変更の集まり。`git add`の行き先
- **Repository** — コミットが保存される場所。`git commit`がIndexからここへ移す

この三空間を頭の中で描ければ混乱の90%が解ける。「私の変更はどこ?」は必ずこの三つのどれか。

### いつ学ぶか
- [[git]]を初めて使う開発者・非開発者
- 「なぜマージ衝突?」「reflogって何?」のような質問で詰まる時点
- [[ai-coding-tools]]がGitコマンドを代行してくれるが結果を理解する必要があるとき
- [[tidd]]・[[pr]]・[[trunk]]・[[gitops]]のような上位規律に進む前の土台

### はまりやすい罠
- **`git commit -am`で全部** — 新ファイルは`git add`が先に必要。コミットされないのに気付かない
- **`git add .`で意図しないファイルまで** — `node_modules`・`.env`が混入。`.gitignore`を先に
- **衝突を「上書き」で解決** — 無意識に片方を捨てると機能が消える。実際の変更を理解してマージ
- **reflogを知らない** — 「コミットが消えた」はほぼ必ず誤解。`git reflog`が全HEAD移動を覚えている
- **`git push --force`をどこでも** — 共有ブランチに撃つと同僚の作業を消す。`--force-with-lease`を習慣に
- **コミットメッセージが「fix」だけ** — 1ヶ月後の自分が分からない。「何を・なぜ」を一行で
- **[[ai-coding-tools]]生成コミットそのまま** — 機能+リファクタ+フォーマットが混ざったコミット。[[small-steps]]で分ける

### 学習順序の推奨
- 段階1: `clone`・`status`・`add`・`commit`・`log` — 一人で使う
- 段階2: `branch`・`checkout`・`merge` — 分岐概念
- 段階3: `push`・`pull`・`remote` — [[github]]連携
- 段階4: `rebase`・`stash`・`cherry-pick` — 上級編集
- 段階5: `reflog`・`bisect`・`revert` — 構造・復旧

### 繋がり
[[git]]の下位軸で「最初の1週間に学ぶこと」。[[pr]]・[[tidd]]・[[trunk]]・[[gitops]]の全ての上位規律がこの土台の上に立つ。[[ai-coding-tools]]はGitコマンドを代行するが*結果を読む能力*は依然人の役目 — その能力の基礎がこのノード。

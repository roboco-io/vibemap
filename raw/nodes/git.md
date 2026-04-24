---
id: git
cat: tool
size: 1
title:
  ko: Git
  en: Git
  ja: Git
refs:
  - url: https://git-scm.com/
    title: Git — Official Site
    lang: en
  - url: https://git-scm.com/book/en/v2
    title: Pro Git (2nd Edition, free online)
    lang: en
  - url: https://docs.github.com/en/get-started/using-git
    title: Using Git (GitHub Docs)
    lang: en
extraEdges: []
---

## ko

Git은 **코드 변경을 스냅샷으로 저장해 시간축 위에 붙이는 도구**다. 파일을 직접 보관하는 드롭박스가 아니라, "이 시점 내용은 이랬다"를 끝없이 쌓아두고 언제든 돌아갈 수 있게 만드는 타임머신. Linus Torvalds가 2005년 Linux 커널 배포를 위해 만든 뒤, 지금은 세상의 거의 모든 코드가 Git 위에 얹혀 있다.

핵심 동사는 셋. **commit**(지금 상태를 스냅샷으로 고정) / **branch**(평행 세계를 만들어 실험) / **merge**(평행 세계를 다시 합치기). [[git-basics]]이 이 세 개의 문법이고, 나머지 모든 Git 기능(rebase, cherry-pick, bisect, reflog)은 이 위의 응용이다. 초보자가 겁먹는 건 보통 "명령어가 너무 많다"가 아니라 "모델이 처음엔 추상적이다"여서 — 몇 번 손으로 만들어 보면 갑자기 간단해진다.

### 언제 쓰나
- 코드를 한 줄이라도 쓰는 모든 순간 — 혼자 하는 프로젝트도 1주만 지나면 과거 나 자신이 왜 그랬는지 모른다. Git이 그걸 복원
- 팀으로 일할 때 — [[github]]·GitLab이 Git을 네트워크로 올려 PR·리뷰·이슈 워크플로우를 돌릴 수 있게 해준다
- [[tidd]]·[[gitops]]·[[cicd]] 등 모든 현대 운영 규율의 전제 — Git 없이는 이것들이 성립하지 않는다
- AI 에이전트와 함께 작업할 때 — [[claude-code]] 같은 도구가 [[small-steps]]으로 커밋하며 자기 작업을 되돌아볼 수 있게 해주는 안전망

### 쉽게 빠지는 함정
- **`git push --force` 남용** — 공용 브랜치에 쏘면 동료 작업을 덮어쓴다. 본인 브랜치 한정, 그리고 `--force-with-lease`를 습관으로
- **의미 없는 커밋 메시지** — "fix", "update", "wip"로 가득 차면 [[git]] log가 무용지물. 1달 뒤의 나를 위해 "무엇을·왜"를 한 줄로
- **거대 커밋** — 1000줄짜리 한 방 커밋은 리뷰도 디버깅도 불가능. [[small-steps]]과 [[pr]]이 왜 필요한지가 여기서 드러난다
- **시크릿을 커밋** — 한 번 push하면 회수 불가. `.gitignore`와 pre-commit 훅, 그리고 노출됐다면 즉시 키 회전
- **merge conflict에서 `--theirs`/`--ours`로 도망** — 충돌은 두 변경이 같은 줄을 건드렸다는 신호. 이해하지 않고 한쪽을 통째로 버리면 조용히 기능이 사라진다
- **`reflog`을 모르고 "내 커밋이 사라졌다"** — Git에서 진짜로 사라지는 건 거의 없다. `git reflog`가 모든 HEAD 이동 로그를 들고 있다

### 연결
[[github]]이 Git의 네트워크·사회 계층, [[pr]]이 협업 단위, [[trunk]] 기반 개발이 그 위의 규율. [[cicd]]와 [[gitops]]가 Git 커밋을 배포 트리거로 삼고, [[tidd]]가 "티켓 없이 커밋하지 않는다"는 규율로 감싸며, [[claude-code]] 같은 에이전트는 Git을 [[harness-eng]]의 상태 저장 계층으로 쓴다. Vibe 코딩의 거의 모든 축은 결국 Git을 지나간다.

## en

Git is **the tool that stores code changes as snapshots pinned to a timeline**. It isn't Dropbox for files; it's a time machine that keeps endlessly stacking "here's what things looked like at this moment" so you can always walk back. Linus Torvalds built it in 2005 to ship the Linux kernel, and now nearly all the world's code sits on top of Git.

Three verbs do the real work. **commit** (freeze the current state as a snapshot), **branch** (spin up a parallel universe for experiments), **merge** (fold that universe back in). [[git-basics]] is those three; everything else (rebase, cherry-pick, bisect, reflog) is applied on top. Newcomers rarely struggle with "too many commands" — they struggle because "the model is abstract at first." A few hands-on cycles and it snaps into place.

### When to use
- Any moment you write code — even solo projects past one week lose track of why past-you made choices, and Git recovers that
- When working in teams — [[github]] and GitLab put Git on the network so PR, review, and issue workflows can run
- As a prerequisite for every modern operational discipline ([[tidd]], [[gitops]], [[cicd]]) — none of them exist without Git
- When working with AI agents — tools like [[claude-code]] lean on [[small-steps]] commits as a safety net so they can review their own work

### Common pitfalls
- **`git push --force` on shared branches** — overwrites your teammates. Keep force to your own branches, and make `--force-with-lease` the default
- **Meaningless commit messages** — a log of "fix", "update", "wip" is useless. Write for you-in-a-month: one line on *what* and *why*
- **Giant commits** — a 1000-line single commit is unreviewable and undebuggable. This is exactly why [[small-steps]] and [[pr]] exist
- **Committing secrets** — once pushed, recovery is impossible. Use `.gitignore`, pre-commit hooks, and rotate keys immediately on exposure
- **Fleeing merge conflicts with `--theirs`/`--ours`** — a conflict means two changes touched the same lines. Blindly discarding one side silently deletes features
- **Thinking commits are lost** — they almost never are. `git reflog` keeps every HEAD movement; learn it before you panic

### How it connects
[[github]] is Git's network and social layer; [[pr]] is the unit of collaboration; [[trunk]]-based development is the discipline layered on top. [[cicd]] and [[gitops]] use Git commits as deploy triggers; [[tidd]] wraps them in "no commit without a ticket"; agents like [[claude-code]] use Git as the state store of their [[harness-eng]]. Nearly every axis of vibe coding passes through Git.

## ja

Gitは**コード変更をスナップショットで保存し、時間軸上に貼り付けるツール**。ファイルを保管するDropboxではなく、「この瞬間の内容はこうだった」を無限に積み重ね、いつでも戻れるタイムマシン。Linus Torvaldsが2005年にLinuxカーネル配信のために作り、今や世界のほぼ全てのコードがGitの上に乗っている。

核となる動詞は三つ。**commit**(現在の状態をスナップショットで固定)、**branch**(平行世界を作って実験)、**merge**(平行世界を再度合流)。[[git-basics]]がこの三つの文法で、他のGit機能(rebase、cherry-pick、bisect、reflog)は全てこの上の応用だ。初心者が詰まるのは「コマンドが多すぎる」ではなく「モデルが最初は抽象的」だから — 何度か手で触れば急に単純になる。

### いつ使うか
- コードを一行でも書く全ての瞬間 — 一人プロジェクトでも1週間経てば過去の自分がなぜこう書いたか忘れる。Gitがそれを復元する
- チームで働くとき — [[github]]・GitLabがGitをネットワーク化して、PR・レビュー・イシューワークフローを回せるようにする
- [[tidd]]・[[gitops]]・[[cicd]]といったあらゆる現代運用規律の前提 — Gitなしではどれも成立しない
- AIエージェントと組むとき — [[claude-code]]のようなツールが[[small-steps]]でコミットして自分の作業を振り返れるようにするセーフティネット

### はまりやすい罠
- **`git push --force`の乱用** — 共有ブランチに撃ち込むと同僚の作業を上書きする。自分のブランチに限定、そして`--force-with-lease`を習慣に
- **意味のないコミットメッセージ** — "fix"、"update"、"wip"で埋まった[[git]] logは役に立たない。1ヶ月後の自分のために「何を・なぜ」を一行で
- **巨大コミット** — 1000行一発コミットはレビューもデバッグも不可能。なぜ[[small-steps]]と[[pr]]が必要かがここで分かる
- **シークレットをコミット** — 一度pushすれば回収不能。`.gitignore`とpre-commitフックを用意し、漏れたら即キー回転
- **マージ衝突を`--theirs`/`--ours`で回避** — 衝突は二つの変更が同じ行を触った合図。理解せず片方を捨てると機能が静かに消える
- **`reflog`を知らず「コミットが消えた」** — Gitで本当に消えるものはほぼない。`git reflog`がHEAD移動の全履歴を持っている

### 繋がり
[[github]]がGitのネットワーク・社会層、[[pr]]が協業単位、[[trunk]]ベース開発がその上の規律。[[cicd]]と[[gitops]]がGitコミットをデプロイトリガに、[[tidd]]が「チケットなしでコミットしない」という規律で包み、[[claude-code]]のようなエージェントはGitを[[harness-eng]]の状態保存層として使う。Vibeコーディングのほぼ全ての軸は結局Gitを通る。

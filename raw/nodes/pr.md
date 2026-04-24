---
id: pr
cat: tool
size: 3
title:
  ko: Pull Request
  en: Pull Request
  ja: Pull Request
refs:
  - url: https://docs.github.com/en/pull-requests
    title: Pull requests (GitHub Docs)
    lang: en
  - url: https://google.github.io/eng-practices/review/
    title: Google Engineering Practices — Code Review
    lang: en
extraEdges: []
---

## ko

Pull Request(PR)는 **"내 브랜치의 변경을 main에 합쳐달라고 요청하는 단위"**이자 **"변경에 대한 토론·검증·기록을 모으는 장소"**다. [[git]]·[[github]]·GitLab의 워크플로우에서 협업의 기본 블록. 단순한 병합 요청이 아니라, 리뷰 의견·CI 결과·관련 이슈가 모두 연결되어 "이 변경이 왜 필요했고 어떻게 검증됐는가"의 영구 기록이 된다.

좋은 PR의 기준은 세 가지. **작다** — [[small-steps]] 단위. 1000줄짜리 PR은 리뷰 불가능. **하나의 의도** — 리팩터와 기능 추가를 섞지 않는다. **자기 설명적** — 제목·본문만 읽고도 "왜 필요한가"가 납득되어야 한다. [[tidd]]를 쓰는 팀은 PR 본문에 티켓 링크를 꼭 넣어 맥락을 확장한다.

### PR 라이프사이클
- **브랜치 생성** — 기능·버그당 하나
- **[[small-steps]]으로 커밋** — 의미 있는 단위로 여러 번
- **PR 열기** — draft부터 시작해도 됨
- **[[cicd]] 실행** — 자동 테스트·린트·보안 스캔
- **리뷰** — [[review-mindset]]으로 한 줄씩 읽기, 질문
- **머지** — squash / merge / rebase 중 팀 규약대로
- **브랜치 삭제** — 머지 후 정리

### 쉽게 빠지는 함정
- **거대 PR** — 300줄 넘으면 리뷰 품질이 급락. 쪼개라
- **제목 없이 "update"** — [[git]] log가 무용. "fix: null check in auth handler"처럼 구체적으로
- **본문 없음** — 왜·무엇을·어떻게 테스트했는지. 템플릿 기본 탑재
- **CI 빨간 채로 리뷰 요청** — 리뷰어 시간 낭비. 녹색 확인 후 리뷰 요청
- **대댓글 전쟁** — 20개 코멘트가 넘으면 오프라인 대화로 옮기기
- **AI 생성 PR을 자신도 안 읽고 올림** — [[review-mindset]]의 첫 번째 항목. self-review 필수
- **[[trunk]] 원칙과 충돌** — PR이 1주일 열려 있으면 [[trunk]] 기반 개발 실패. 24~48시간 내 머지 목표

### 머지 전략
- **Squash merge** — PR 하나를 한 커밋으로. 히스토리 깔끔, bisect 쉬움 ← 대부분 추천
- **Merge commit** — 모든 커밋 보존 + merge commit. 분기 역사 남음
- **Rebase merge** — 선형 히스토리, merge commit 없음. 깔끔하지만 force-push 필요

### 연결
[[git]]·[[github]] 워크플로우의 협업 단위. [[cicd]] 게이트와 [[review-mindset]] 체크리스트의 결합 지점. [[trunk]] 기반 개발에서는 PR 수명이 짧아야 정상 동작. [[tidd]]의 티켓이 PR 본문으로 흘러 들어가고, [[pitfalls]] 여러 항목을 PR 레벨에서 막을 수 있다. [[ai-coding-tools]] 시대에 PR은 *사람이 AI 작업을 최종 승인하는 관문* — 이 자리의 품질이 전체 품질.

## en

A pull request (PR) is **"the unit that requests merging a branch's changes into main"** and **"the place where discussion, verification, and the record of that change gather."** It's the base building block of collaboration in [[git]] / [[github]] / GitLab workflows. More than a merge request — review comments, CI results, and linked issues converge into a permanent record of "why this change was needed and how it was verified."

Three criteria for a good PR. **Small** — sized by [[small-steps]]. A 1000-line PR is unreviewable. **Single intent** — don't mix refactor and feature change. **Self-explanatory** — title and body alone should justify "why." Teams on [[tidd]] link the ticket in the PR body to extend context.

### PR lifecycle
- **Branch creation** — one per feature or bug
- **Commit in [[small-steps]]** — meaningful chunks
- **Open PR** — draft mode is fine for early feedback
- **[[cicd]] runs** — tests, lint, security scans
- **Review** — read line by line with [[review-mindset]]; ask
- **Merge** — squash / merge / rebase per team convention
- **Delete branch** — cleanup after merge

### Common pitfalls
- **Giant PRs** — past 300 lines, review quality collapses. Split
- **Titles like "update"** — makes [[git]] log useless. "fix: null check in auth handler" — specific
- **Empty body** — why, what, how tested? Template in the repo
- **Asking for review while CI is red** — wastes reviewer time. Confirm green first
- **Comment threads 20 deep** — move to a voice conversation
- **AI-generated PRs submitted without self-reading** — item #1 in [[review-mindset]]. Self-review is mandatory
- **Clash with [[trunk]] principle** — PRs open for a week mean trunk-based dev is failing. Target 24–48-hour merge

### Merge strategies
- **Squash merge** — collapses a PR to one commit. Clean history, easier bisect ← recommended default
- **Merge commit** — preserves all commits plus a merge commit. Preserves branching history
- **Rebase merge** — linear history, no merge commits. Clean, requires force-push

### How it connects
The collaboration unit of [[git]] / [[github]] workflows. Where [[cicd]] gates meet [[review-mindset]] checklists. In [[trunk]]-based development, short PR lifespans are mandatory. A [[tidd]] ticket flows into the PR body; many [[pitfalls]] can be blocked at the PR level. In the [[ai-coding-tools]] era, the PR is *the gate where humans finally approve AI work* — the quality here sets the quality of everything downstream.

## ja

Pull Request(PR)は**「自分のブランチの変更をmainに統合するよう依頼する単位」**であり**「変更に関する議論・検証・記録を集める場所」**。[[git]]・[[github]]・GitLabのワークフローで協業の基本ブロック。単なる統合要求ではなく、レビューコメント・CI結果・関連イシューが全て繋がり「この変更がなぜ必要で、どう検証されたか」の永続記録になる。

良いPRの基準は三つ。**小さい** — [[small-steps]]単位。1000行のPRはレビュー不能。**単一の意図** — リファクタと機能追加を混ぜない。**自己説明的** — タイトル・本文だけで「なぜ必要か」が納得できる。[[tidd]]を使うチームはPR本文にチケットリンクを必ず入れて文脈を拡張する。

### PRライフサイクル
- **ブランチ作成** — 機能・バグ毎に一つ
- **[[small-steps]]でコミット** — 意味のある単位で複数回
- **PRオープン** — draftから始めても良い
- **[[cicd]]実行** — 自動テスト・lint・セキュリティスキャン
- **レビュー** — [[review-mindset]]で一行ずつ読み、質問
- **マージ** — squash / merge / rebaseをチーム規約で
- **ブランチ削除** — マージ後に整理

### はまりやすい罠
- **巨大PR** — 300行を超えるとレビュー品質が急落。分割
- **"update"のようなタイトル** — [[git]] logが無用。"fix: null check in auth handler"のように具体的に
- **本文なし** — なぜ・何を・どうテストしたか。テンプレートをリポに
- **CI赤のままレビュー依頼** — レビュアーの時間を無駄にする。緑確認後に依頼
- **コメント戦争** — 20超えたらオフライン会話に移す
- **AI生成PRを自分も読まず上げる** — [[review-mindset]]の第1項。セルフレビュー必須
- **[[trunk]]原則と衝突** — PRが1週間開いていればtrunkベース開発失敗。24〜48時間以内のマージ目標

### マージ戦略
- **Squash merge** — PR一つを一コミットに。履歴きれい、bisect容易 ← 大抵推奨
- **Merge commit** — 全コミット保存 + merge commit。分岐履歴が残る
- **Rebase merge** — 線形履歴、merge commitなし。きれいだがforce-push必要

### 繋がり
[[git]]・[[github]]ワークフローの協業単位。[[cicd]]ゲートと[[review-mindset]]チェックリストの合流地点。[[trunk]]ベース開発ではPR寿命が短くあるべき。[[tidd]]のチケットがPR本文に流れ込み、[[pitfalls]]の多くをPRレベルで塞げる。[[ai-coding-tools]]時代にPRは*人がAI作業を最終承認する関門* — ここの品質が全体品質を決める。

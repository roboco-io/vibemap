---
id: terminal
cat: tool
size: 2
title:
  ko: 터미널·CLI
  en: Terminal & CLI
  ja: ターミナル・CLI
refs:
  - url: https://missing.csail.mit.edu/2020/shell-tools/
    title: MIT Missing Semester — Shell Tools
    lang: en
  - url: https://en.wikipedia.org/wiki/Command-line_interface
    title: Command-line interface (Wikipedia)
    lang: en
extraEdges: []
---

## ko

터미널은 **"검은 화면에 글자를 쳐서 컴퓨터에 명령하는 인터페이스"**, CLI(Command-Line Interface)는 그 위에서 돌아가는 도구들이다. GUI의 반대축 — 버튼·마우스 대신 *타이핑과 조합*. 비효율처럼 보이지만, 한번 익히면 반복 작업·자동화·원격 서버·AI 에이전트와의 협업에서 GUI보다 훨씬 빠르다. Vibe 코딩 시대에 [[claude-code]]·Codex가 터미널에서 사는 이유 — 텍스트는 *조립 가능*한 첫 번째 인터페이스이기 때문.

필수 10개면 일상이 해결된다. `cd`(이동), `ls`(목록), `pwd`(현재 위치), `cat`(파일 내용), `less`(긴 파일), `grep`(검색), `find`(파일 찾기), `cp`/`mv`/`rm`(복사·이동·삭제), `chmod`(권한). 여기에 `git`·`ssh`·[[package-mgr]]이 얹히면 개발자 일상 완성. Unix 철학 — *작은 도구를 파이프로 조합* — 이 핵심이라, 한 도구의 출력이 다른 도구의 입력이 되는 `|` 연산이 진짜 강점.

### 언제 배우나
- [[git]] 명령을 손으로 치기 시작할 때 — GUI만으로는 한계
- [[cicd]]·[[iac]]·[[serverless]] 배포 — 대부분 CLI 기반
- [[claude-code]]·Codex 같은 터미널 에이전트와 협업
- 서버 운영·문제 분석 — SSH 접속 후 상황 파악은 CLI가 주 수단
- [[testing]] 자동화·배포 스크립트 — Bash·zsh 기본 문법 필요

### 쉽게 빠지는 함정
- **`rm -rf /` 실수** — 한 번에 모든 걸 지움. 위험 명령은 `dry-run` 먼저, 경로에 변수 쓰면 검증
- **`sudo` 남용** — 왜 권한이 필요한지 모르는 채 쓰면 보안 구멍. 최소 권한 원칙
- **복잡한 bash 스크립트** — 100줄 넘어가면 Python·Node로 재작성이 대개 정답. 유지보수성이 파이프 체인을 넘음
- **환경변수 .bashrc에 시크릿 평문** — 화면 공유 시 노출. Secrets Manager·1Password CLI 연동
- **[[ai-coding-tools]] 생성 명령 맹신** — `rm -rf` 같은 위험 명령에 [[hallucination]]된 인자. 항상 읽고 실행
- **GUI 대체재 거부** — 터미널이 항상 빠르진 않음. 복잡한 diff 보기·시각화는 GUI가 나음
- **단축키·히스토리 무시** — `Ctrl+R`(히스토리 검색), `Tab`(자동 완성), `!!`(직전 명령)을 모르면 속도가 반토막

### 추천 셋업
- **셸**: zsh + oh-my-zsh 또는 fish — 기본 bash보다 편리
- **터미널 앱**: Alacritty·Warp·iTerm2·Kitty — 성능·기능 차이
- **유틸리티**: `bat`(cat 대체), `ripgrep`(grep 대체), `fzf`(fuzzy finder), `eza`(ls 대체), `zoxide`(cd 대체)
- **버전 매니저**: mise·asdf — 언어 버전 전환
- **[[claude-code]]와 함께**: 터미널이 에이전트의 작업 공간

### 연결
[[ide]] 내 통합 터미널로 대부분 자주 만남. [[git]]·[[package-mgr]]·[[cicd]]·[[iac]]의 기본 인터페이스. [[claude-code]]·Codex가 거주하는 환경이라 [[harness-eng]]·[[ai-coding-tools]]와 직결. 비개발자에게는 Vibe 코딩의 첫 관문 — "검은 화면의 두려움"을 넘어서야 자동화·AI 에이전트·운영의 가능성이 열린다.

## en

A terminal is **"an interface that commands a computer by typing characters into a text window."** A CLI (Command-Line Interface) is the set of tools that run through it. The opposite of GUI — *typing and composition* replace buttons and mouse. It looks inefficient until you learn it; then for repeated tasks, automation, remote servers, and collaborating with AI agents, it beats GUIs. In the vibe-coding era, [[claude-code]] and Codex live in the terminal because text is the first *composable* interface.

Ten essentials handle daily life. `cd` (navigate), `ls` (list), `pwd` (current location), `cat` (file content), `less` (long files), `grep` (search), `find` (locate files), `cp` / `mv` / `rm` (copy / move / delete), `chmod` (permissions). Add `git`, `ssh`, and [[package-mgr]] on top and the developer's daily life is covered. The Unix philosophy — *compose small tools via pipes* — is the heart; the `|` operator, where one tool's output becomes another's input, is the real strength.

### When to learn it
- When you start running [[git]] commands by hand — GUI hits its limits
- [[cicd]] / [[iac]] / [[serverless]] deploys — mostly CLI-based
- Collaborating with terminal agents like [[claude-code]] or Codex
- Server ops and incident analysis — after SSH, CLI is the primary tool
- Automating [[testing]] and deploys — Bash / zsh basics required

### Common pitfalls
- **`rm -rf /` mistakes** — wipes everything in one line. For dangerous commands use `--dry-run` first; double-check variables in paths
- **`sudo` overuse** — using it without understanding why creates security holes. Least privilege
- **Complex bash scripts** — past 100 lines, rewriting in Python or Node is usually right. Maintainability outruns pipe chains
- **Plaintext secrets in `.bashrc`** — screen-sharing exposure. Use Secrets Manager or 1Password CLI integration
- **Trusting [[ai-coding-tools]] commands blindly** — [[hallucination]]-ed args to `rm -rf`-class commands. Read before executing
- **Rejecting GUI alternatives** — the terminal isn't always faster. Complex diff viewing or visualization favors GUI
- **Ignoring shortcuts and history** — `Ctrl+R` (history search), `Tab` (completion), `!!` (last command) — not knowing these halves your speed

### Recommended setup
- **Shell**: zsh + oh-my-zsh, or fish — more convenient than plain bash
- **Terminal app**: Alacritty, Warp, iTerm2, Kitty — performance and features differ
- **Utilities**: `bat` (cat), `ripgrep` (grep), `fzf` (fuzzy finder), `eza` (ls), `zoxide` (cd)
- **Version managers**: mise, asdf — switch language versions
- **Pair with [[claude-code]]**: the terminal is the agent's workspace

### How it connects
Most often encountered through [[ide]]'s integrated terminal. The primary interface for [[git]], [[package-mgr]], [[cicd]], [[iac]]. The residence of [[claude-code]] and Codex, tying it directly to [[harness-eng]] and [[ai-coding-tools]]. For non-developers, it's the first gate of vibe coding — once past the "fear of the black screen," automation, AI agents, and operations open up.

## ja

ターミナルは**「黒い画面に文字を打ってコンピュータに命令するインターフェース」**、CLI(Command-Line Interface)はその上で動くツールたち。GUIの反対軸 — ボタン・マウスの代わりに*タイピングと組合せ*。非効率に見えるが、一度覚えれば繰り返し作業・自動化・遠隔サーバー・AIエージェントとの協業でGUIよりずっと速い。Vibeコーディング時代に[[claude-code]]・Codexがターミナルに住む理由 — テキストは*組立て可能*な最初のインターフェースだから。

必須10個で日常が片付く。`cd`(移動)、`ls`(一覧)、`pwd`(現在位置)、`cat`(ファイル内容)、`less`(長いファイル)、`grep`(検索)、`find`(ファイル検索)、`cp`/`mv`/`rm`(コピー・移動・削除)、`chmod`(権限)。ここに`git`・`ssh`・[[package-mgr]]が載れば開発者の日常が完成。Unix哲学 — *小さなツールをパイプで組合せる* — が核心なので、一つのツールの出力が他のツールの入力になる`|`演算が真の強み。

### いつ学ぶか
- [[git]]コマンドを手で打ち始めるとき — GUIだけでは限界
- [[cicd]]・[[iac]]・[[serverless]]デプロイ — 大半CLIベース
- [[claude-code]]・Codexのようなターミナルエージェントとの協業
- サーバー運用・問題分析 — SSH接続後の状況把握はCLIが主手段
- [[testing]]自動化・デプロイスクリプト — Bash・zshの基本文法が必要

### はまりやすい罠
- **`rm -rf /`のミス** — 一発で全部消す。危険コマンドは`--dry-run`を先に、パスに変数を使うなら検証
- **`sudo`濫用** — なぜ権限が必要か分からず使うとセキュリティ穴。最小権限の原則
- **複雑なbashスクリプト** — 100行超えたらPython・Nodeに書き直しが大抵正解。保守性がパイプチェーンを超える
- **環境変数`.bashrc`に平文シークレット** — 画面共有で露出。Secrets Manager・1Password CLI連携
- **[[ai-coding-tools]]生成コマンド盲信** — `rm -rf`のような危険コマンドに[[hallucination]]された引数。必ず読んで実行
- **GUI代替を拒絶** — ターミナルが常に速いわけではない。複雑なdiff表示・可視化はGUIが有利
- **ショートカット・履歴無視** — `Ctrl+R`(履歴検索)、`Tab`(自動補完)、`!!`(直前のコマンド)を知らないと速度半減

### 推奨セットアップ
- **シェル**: zsh + oh-my-zshやfish — 素のbashより便利
- **ターミナルアプリ**: Alacritty・Warp・iTerm2・Kitty — 性能・機能差
- **ユーティリティ**: `bat`(cat代替)、`ripgrep`(grep代替)、`fzf`(fuzzy finder)、`eza`(ls代替)、`zoxide`(cd代替)
- **バージョンマネージャ**: mise・asdf — 言語バージョン切替
- **[[claude-code]]と組む**: ターミナルがエージェントの作業空間

### 繋がり
[[ide]]内の統合ターミナルで最もよく出会う。[[git]]・[[package-mgr]]・[[cicd]]・[[iac]]の基本インターフェース。[[claude-code]]・Codexが住む環境なので[[harness-eng]]・[[ai-coding-tools]]と直結。非開発者にはVibeコーディングの最初の関門 — 「黒い画面の恐怖」を越えてこそ自動化・AIエージェント・運用の可能性が開ける。

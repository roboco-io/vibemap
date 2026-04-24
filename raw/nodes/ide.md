---
id: ide
cat: tool
size: 3
title:
  ko: IDE·에디터
  en: IDE & Editor
  ja: IDE・エディタ
refs:
  - url: https://code.visualstudio.com/docs
    title: Visual Studio Code Documentation
    lang: en
  - url: https://en.wikipedia.org/wiki/Integrated_development_environment
    title: Integrated development environment (Wikipedia)
    lang: en
extraEdges: []
---

## ko

IDE·에디터는 **"코드를 작성·탐색·디버깅하는 주 작업 공간"**이다. IDE(Integrated Development Environment)는 에디터 + 디버거 + 빌드 도구 + 버전 관리 + 터미널이 통합된 환경, 에디터는 주로 편집 기능 중심이지만 현대 VS Code·Zed 같은 에디터는 확장으로 IDE 기능을 대부분 확보했다. 개발자가 하루 중 가장 오래 머무는 도구라 *속도·손목·집중*을 직접적으로 결정한다.

오늘날 주요 계열. **VS Code**(마이크로소프트, 사실상 표준, 확장 생태계 방대), **JetBrains**(IntelliJ IDEA·WebStorm·PyCharm 등, 언어별 깊은 분석), **Cursor**(VS Code 포크 + AI 통합 1급), **Windsurf**(Cursor 대안, Codeium), **Zed**(Rust로 쓴 고성능 에디터), **Vim/Neovim**(터미널 네이티브, 학습 곡선). [[ai-coding-tools]]와 함께 진화 중 — 자동완성·채팅·에이전트가 에디터 안에서 1급 시민.

### 언제 고민하나
- 새 언어·새 팀 합류 — 언어별 *추천 IDE*는 대개 분명
- [[ai-coding-tools]] 선택과 연동 — Cursor·Zed·VS Code + Copilot·[[claude-code]] 조합 중 택일
- 성능 이슈 — 큰 모노레포에서 VS Code가 느려지면 JetBrains·Zed 고려
- 원격 개발 — VS Code Remote·JetBrains Gateway·GitHub Codespaces
- 표준 설정 공유 — `.vscode/settings.json`·`.editorconfig`를 [[git]]에 커밋

### 쉽게 빠지는 함정
- **확장 남발** — 50개 설치 후 에디터 시작이 10초 걸림. 실제로 쓰는 것만 유지
- **개인 설정을 팀 저장소에** — 개인 키 바인딩·테마까지 커밋하면 동료가 혼란. `.vscode/settings.json`은 *프로젝트 기본*만
- **AI 자동완성 맹신** — [[pitfalls]]의 "AI 생성 코드 미검토" 최단 거리 경로. [[review-mindset]] 상시
- **에디터 튜닝으로 시간 녹임** — *도구 만지기*는 중독성이지만 작업이 아님. 정말 마찰이 있을 때만
- **[[testing]] 통합 안 함** — 터미널에서 테스트 돌리는 구시대. IDE 내에서 한 키로 실행·디버깅
- **터미널 대신 IDE 내부만** — [[terminal]] 기본 기술 손 놓으면 자동화·스크립트 쪽 약해짐
- **[[git]] GUI로만** — 배움에는 좋지만, 핵심 명령은 CLI로도 이해하는 게 이점

### 핵심 단축키 셋팅 (일반론)
- **파일 탐색**: fuzzy file finder (Ctrl/Cmd+P)
- **커맨드 팔레트**: 모든 기능의 검색 진입점
- **Go to Definition / References**: 코드 이해의 기본
- **멀티 커서**: 반복 편집 한 번에
- **통합 터미널**: 편집과 실행을 같은 창에

### 연결
[[terminal]]·[[git]]·[[testing]]·[[lint]]·[[debug]]의 통합 지점. [[ai-coding-tools]]·[[claude-code]]가 거주하는 공간. [[framework]] 생태계(언어 서버·디버거 프로토콜)가 IDE 경험 수준을 결정. [[package-mgr]] 연동으로 의존성 트리 시각화. [[review-mindset]]의 작업이 대부분 이 안에서 일어난다.

## en

An IDE or editor is **"the primary workspace for writing, navigating, and debugging code."** An IDE (Integrated Development Environment) bundles editor + debugger + build tools + version control + terminal, while "editor" emphasizes editing — though modern editors like VS Code and Zed have absorbed most IDE features through extensions. It's the tool a developer spends the most hours in, so it directly shapes *speed, wrist health, and focus*.

Today's main families. **VS Code** (Microsoft, de-facto standard, huge extension ecosystem), **JetBrains** (IntelliJ IDEA, WebStorm, PyCharm, deep language analysis), **Cursor** (VS Code fork with first-class AI integration), **Windsurf** (Codeium's alternative to Cursor), **Zed** (Rust-written, high-performance editor), **Vim/Neovim** (terminal-native, steep learning curve). They're co-evolving with [[ai-coding-tools]] — autocomplete, chat, and agents live inside the editor as first-class citizens.

### When to think about it
- New language or joining a new team — the *recommended IDE* per language is usually clear
- [[ai-coding-tools]] choice and integration — pick among Cursor, Zed, VS Code + Copilot, [[claude-code]]
- Performance issues — when VS Code slows on a large monorepo, consider JetBrains or Zed
- Remote development — VS Code Remote, JetBrains Gateway, GitHub Codespaces
- Sharing team defaults — commit `.vscode/settings.json` and `.editorconfig` to [[git]]

### Common pitfalls
- **Extension sprawl** — 50 extensions and editor startup hits 10 seconds. Keep only what you actually use
- **Personal settings in the team repo** — committing your keybindings and theme confuses teammates. Keep `.vscode/settings.json` at *project defaults* only
- **Blind trust in AI autocomplete** — the shortest path to the "AI code unreviewed" entry in [[pitfalls]]. [[review-mindset]] always
- **Endless editor tuning** — *fiddling with tools* is addictive but not work. Adjust only when real friction exists
- **No [[testing]] integration** — running tests in the terminal is old-school. One-key test runs inside the IDE
- **IDE-only, no [[terminal]]** — abandoning terminal fundamentals weakens your scripting and automation
- **[[git]] through GUI only** — fine for learning, but understanding the core commands in CLI is an advantage

### Key shortcuts to invest in
- **File navigation**: fuzzy file finder (Ctrl/Cmd+P)
- **Command palette**: search entry for every feature
- **Go to Definition / References**: the basic tool of understanding code
- **Multi-cursor**: batch repetitive edits
- **Integrated terminal**: edit and run in the same window

### How it connects
The integration point for [[terminal]], [[git]], [[testing]], [[lint]], [[debug]]. The residence of [[ai-coding-tools]] and [[claude-code]]. The [[framework]] ecosystem (language servers, debugger protocols) determines the depth of the IDE experience. [[package-mgr]] integration gives dependency-tree visualization. Most [[review-mindset]] work happens inside here.

## ja

IDE・エディタは**「コードを書き、探索し、デバッグする主な作業空間」**。IDE(Integrated Development Environment)はエディタ + デバッガ + ビルドツール + バージョン管理 + ターミナルの統合環境、エディタは主に編集機能中心だがVS CodeやZedのような現代エディタは拡張でIDE機能の大半を取り込んでいる。開発者が一日の中で最も長くいる道具なので*速度・手首・集中*を直接決める。

今日の主要系統。**VS Code**(マイクロソフト、事実上標準、拡張エコシステム膨大)、**JetBrains**(IntelliJ IDEA・WebStorm・PyCharmなど、言語別の深い解析)、**Cursor**(VS CodeフォークでAI統合一級)、**Windsurf**(Cursor代替、Codeium)、**Zed**(Rust製高性能エディタ)、**Vim/Neovim**(ターミナルネイティブ、学習曲線)。[[ai-coding-tools]]と共に進化中 — 自動補完・チャット・エージェントがエディタ内で一級市民。

### いつ考えるか
- 新言語・新チーム参加 — 言語別*推奨IDE*は大抵明確
- [[ai-coding-tools]]選択と連動 — Cursor・Zed・VS Code + Copilot・[[claude-code]]の組合せから一つ
- 性能問題 — 大きなモノレポでVS Codeが遅くなればJetBrains・Zedを検討
- リモート開発 — VS Code Remote・JetBrains Gateway・GitHub Codespaces
- 標準設定共有 — `.vscode/settings.json`・`.editorconfig`を[[git]]にコミット

### はまりやすい罠
- **拡張乱立** — 50個入れるとエディタ起動が10秒。実際使うものだけ維持
- **個人設定をチームリポに** — 個人のキーバインド・テーマまでコミットすると同僚が混乱。`.vscode/settings.json`は*プロジェクト既定*だけ
- **AI自動補完盲信** — [[pitfalls]]の「AI生成コード未レビュー」への最短経路。[[review-mindset]]を常時
- **エディタチューニングで時間消費** — *道具いじり*は中毒性があるが仕事ではない。本当に摩擦があるときだけ
- **[[testing]]統合なし** — ターミナルでテストを走らせる旧世代。IDE内でワンキー実行・デバッグ
- **[[terminal]]を使わずIDE内だけ** — ターミナル基礎技術を手放すと自動化・スクリプトが弱くなる
- **[[git]] GUIだけ** — 学ぶには良いが、核心コマンドをCLIでも理解できる方が有利

### 投資すべきキーショートカット
- **ファイル探索**: fuzzy file finder(Ctrl/Cmd+P)
- **コマンドパレット**: 全機能の検索入口
- **Go to Definition / References**: コード理解の基本
- **マルチカーソル**: 反復編集を一度に
- **統合ターミナル**: 編集と実行を同じ窓で

### 繋がり
[[terminal]]・[[git]]・[[testing]]・[[lint]]・[[debug]]の統合点。[[ai-coding-tools]]・[[claude-code]]の住処。[[framework]]エコシステム(言語サーバー・デバッガプロトコル)がIDE体験の深さを決める。[[package-mgr]]連携で依存関係ツリーの可視化。[[review-mindset]]の作業の大半がこの中で起きる。

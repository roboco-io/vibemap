---
id: cc-commands
cat: ai
size: 3
title:
  ko: Claude Code 커맨드
  en: Claude Code Commands
  ja: Claude Codeコマンド
refs:
  - url: https://docs.claude.com/en/docs/claude-code/slash-commands
    title: Slash commands (Anthropic Docs)
    lang: en
  - url: https://github.com/anthropics/claude-code/tree/main/.claude/commands
    title: Example commands (Claude Code GitHub)
    lang: en
extraEdges: []
---

## ko

Claude Code 커맨드는 **"자주 쓰는 프롬프트를 `/이름`으로 호출하는 단축키"**다. `.claude/commands/NAME.md` 형태로 마크다운 파일을 두면 세션에서 `/NAME` 하나로 그 내용이 프롬프트로 들어간다. 매번 장문을 복붙하지 않고, 팀 전체가 같은 문구로 같은 작업을 돌릴 수 있게 만드는 조직 차원의 도구.

프런트매터로 설정이 가능하다. `description`(명령 설명), `argument-hint`(`$ARGUMENTS`로 들어올 인자 힌트), `allowed-tools`(명령 내에서만 쓸 수 있는 도구 제한). 본문은 자연어 + `!shell-command` + `@파일경로` 참조를 섞어 쓸 수 있다. 본질은 "프롬프트를 버저닝된 아티팩트로 관리"하는 것 — [[tidd]]·[[llmops]]의 원칙이 Claude Code 레이어에서 실현.

### 언제 쓰나
- 매번 입력하기 지겨운 반복 프롬프트 — `/deploy`, `/check`, `/commit` 등
- 팀에 공유하고 싶은 워크플로우 — 리뷰 체크리스트, 코드 감사, PR 템플릿
- 긴 맥락을 한 번에 주입하는 용도 — 프로젝트 아키텍처 설명 + 작업 지시
- `.claude/commands/`에 두면 프로젝트별 고정, `~/.claude/commands/`에 두면 유저 전역
- [[cc-skills]]보다 가벼운 쓰임에 — 스킬은 자동 발견, 커맨드는 사용자가 명시 호출

### 쉽게 빠지는 함정
- **`$ARGUMENTS` 없이 유연성 포기** — 대부분의 커맨드는 인자 하나 이상을 받아야 유용. `--name=foo` 같은 파싱 규칙을 본문에 명시
- **`allowed-tools`로 너무 넓게 열기** — 커맨드가 시스템 명령 무제한이면 실수의 바닥이 낮아진다. 최소 권한으로
- **커맨드 남발로 발견성 저하** — 20개 이상 쌓이면 어느 게 뭔지 모름. `description`을 구체적으로
- **스킬·에이전트 경계 혼동** — 커맨드는 *사용자 트리거*, 스킬은 *컨텍스트 일치*, 에이전트는 *위임*. 기능을 잘못된 레이어에 두면 재사용성이 떨어진다
- **하드코딩된 경로** — 팀 공유 시 `/Users/me/...` 절대경로가 섞여 있으면 무용지물

### 연결
[[cc-skills]]·[[cc-hooks]]·[[cc-rules]]·[[cc-settings]]와 함께 [[claude-code]] 커스터마이즈의 5형제. [[harness-eng]] 관점에서는 "프롬프트가 언제 들어갈지"를 사용자가 명시적으로 트리거하는 레이어. [[tidd]]에서 `/ticket-start`, [[cicd]]에서 `/deploy-check` 같이 조직 규율을 자동화하는 접점. 본 VibeMap 프로젝트도 `/vibemap-check`·`/vibemap-ingest` 커맨드로 이 원리를 쓴다.

## en

Claude Code commands are **shortcuts that fire a saved prompt when you type `/name`**. Drop a markdown file into `.claude/commands/NAME.md` and the session can invoke its contents as a prompt with one line. Instead of pasting long prose repeatedly, a whole team runs the same workflow through the same phrasing — an organizational tool, not a personal one.

Frontmatter controls behavior: `description` (what it does), `argument-hint` (how `$ARGUMENTS` is shaped), `allowed-tools` (scope-limit tools for the command). The body can mix natural language with `!shell-command` and `@file/path` references. The essence is "prompts as versioned artifacts" — the [[tidd]] and [[llmops]] principles realized at the Claude Code layer.

### When to use
- Repetitive prompts you're tired of typing — `/deploy`, `/check`, `/commit`, etc.
- Team-shared workflows — review checklists, code audits, PR templates
- One-shot injection of long context — project architecture + task directive in one invocation
- `.claude/commands/` scopes to the project; `~/.claude/commands/` scopes to the user globally
- Lighter than [[cc-skills]] — skills auto-discover by context; commands are user-invoked explicitly

### Common pitfalls
- **No `$ARGUMENTS` → no flexibility** — most commands need an arg. Document `--name=foo` parsing in the body if needed
- **`allowed-tools` too wide** — if a command can run any shell, accidents are one typo away. Scope minimally
- **Command sprawl hurts discovery** — 20+ commands and no one knows which is which. Write specific `description`s
- **Confusing commands, skills, agents** — commands are *user-triggered*, skills are *context-matched*, agents are *delegated*. Wrong layer = poor reuse
- **Hard-coded paths** — shared commands with `/Users/me/...` absolute paths are dead on arrival

### How it connects
With [[cc-skills]], [[cc-hooks]], [[cc-rules]], [[cc-settings]], one of the five customization handles of [[claude-code]]. From a [[harness-eng]] view, it's the layer where the *user explicitly decides when the prompt fires*. It's where team discipline gets automated — `/ticket-start` in [[tidd]], `/deploy-check` in [[cicd]]. VibeMap itself uses `/vibemap-check` and `/vibemap-ingest` on this principle.

## ja

Claude Codeコマンドは**「よく使うプロンプトを`/名前`で呼ぶショートカット」**。`.claude/commands/NAME.md`にマークダウンを置けばセッションで`/NAME`一つでその内容がプロンプトとして入る。毎回長文をコピペせず、チーム全員が同じ文言で同じ作業を回せる — 組織レベルのツール。

フロントマターで設定可能。`description`(コマンドの説明)、`argument-hint`(`$ARGUMENTS`で入る引数のヒント)、`allowed-tools`(コマンド内で使えるツールを制限)。本文は自然言語 + `!shell-command` + `@ファイルパス`参照を混ぜられる。本質は「プロンプトをバージョン管理されたアーティファクトとして扱う」こと — [[tidd]]・[[llmops]]の原則がClaude Code層で実現する。

### いつ使うか
- 毎回入力が面倒な反復プロンプト — `/deploy`, `/check`, `/commit`など
- チーム共有したいワークフロー — レビューチェックリスト、コード監査、PRテンプレート
- 長い文脈を一気に注入する用途 — プロジェクトアーキテクチャ説明+作業指示
- `.claude/commands/`はプロジェクト固定、`~/.claude/commands/`はユーザー全体
- [[cc-skills]]より軽い用途に — スキルは自動発見、コマンドはユーザーが明示呼び出し

### はまりやすい罠
- **`$ARGUMENTS`なしで柔軟性を捨てる** — 多くのコマンドは引数が必要。`--name=foo`のパース規則を本文に明記
- **`allowed-tools`を広く開けすぎ** — コマンドがシステムコマンド無制限だとミスの床が下がる。最小権限で
- **コマンドの乱立で発見性低下** — 20個以上溜まるとどれがどれか不明。`description`を具体的に
- **スキル・エージェントの境界混同** — コマンドは*ユーザートリガー*、スキルは*文脈一致*、エージェントは*委譲*。間違った層に置くと再利用性が落ちる
- **ハードコードされたパス** — チーム共有時に`/Users/me/...`絶対パスが混ざると使い物にならない

### 繋がり
[[cc-skills]]・[[cc-hooks]]・[[cc-rules]]・[[cc-settings]]と並んで[[claude-code]]カスタマイズの5兄弟。[[harness-eng]]視点では「プロンプトがいつ入るか」をユーザーが明示的にトリガする層。[[tidd]]で`/ticket-start`、[[cicd]]で`/deploy-check`のように組織規律を自動化する接点。本VibeMapプロジェクトも`/vibemap-check`・`/vibemap-ingest`コマンドでこの原理を使っている。

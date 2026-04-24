---
id: cc-settings
cat: ai
size: 3
title:
  ko: Claude Code 설정 (Settings)
  en: Claude Code Settings
  ja: Claude Code設定
refs:
  - url: https://docs.claude.com/en/docs/claude-code/settings
    title: Settings (Anthropic Docs)
    lang: en
  - url: https://docs.claude.com/en/docs/claude-code/iam
    title: Permissions and IAM (Anthropic Docs)
    lang: en
extraEdges: []
---

## ko

Claude Code 설정은 **`settings.json` 파일에 담기는 하네스 구성 정보**다. 어떤 모델을 쓸지, 어떤 Bash 명령을 허용/차단할지, 어떤 [[cc-hooks]]를 연결할지, 환경 변수·MCP 서버·텔레메트리를 어떻게 다룰지 — 여기서 정해진다. CLAUDE.md가 *프롬프트 레벨* 맥락이라면, settings.json은 *실행 레벨* 정책.

세 군데에 놓일 수 있다. `~/.claude/settings.json`(유저 전역), `프로젝트/.claude/settings.json`(프로젝트 공유, git에 포함), `프로젝트/.claude/settings.local.json`(개인 오버라이드, gitignore 대상). 아래로 갈수록 우선순위가 높아지고 좁아진다. 팀 공유 설정은 중간 계층, 개인 선호는 local.

핵심 섹션:
- **permissions** — `allow`·`deny` 목록. 자주 쓰는 `make compile` 같은 건 allow로 permission 프롬프트 없이 실행, `docs/data.js` 직접 편집 같은 건 deny로 사고 차단
- **hooks** — [[cc-hooks]] 등록 위치. PreToolUse·PostToolUse 등 이벤트에 스크립트 연결
- **env** — 세션 환경변수 (API 키·모델 ID 등)
- **model** — 디폴트 모델 선택 (`claude-opus-4-7` 같은 식)

### 언제 쓰나
- 프로젝트별 권한 정책이 필요할 때 — "이 프로젝트에선 `rm`은 항상 확인"
- 팀 차원의 자동 훅을 강제할 때 — 드리프트 방지, 포맷 강제 등. VibeMap의 settings.json이 대표 예
- 유저 전역 선호를 한곳에 — 선호 모델, 공통 환경변수
- `.local.json`으로 민감 정보·개인 설정 분리 — API 키는 절대 공유 파일에 넣지 말 것

### 쉽게 빠지는 함정
- **`allow`가 과하게 넓음** — `"Bash"` 자체를 허용하면 `rm -rf /`도 통과. 구체 매처(`Bash(make *)`)를 써라
- **시크릿을 `settings.json`에 박음** — git에 푸시되면 유출. `.local.json` 또는 `env`로 외부 주입
- **훅을 남발해 세션이 느려짐** — 매 도구 호출에 여러 훅이 실행되면 체감 속도 저하. [[cc-hooks]]도 최소 원칙
- **`deny` 없이 `allow`만** — whitelist는 좋지만 명시적 `deny`가 "이건 절대 안 됨" 신호 — VibeMap이 `docs/*` 직접 편집을 deny로 잠가 둔 이유
- **팀 공유 파일에 개인 취향** — "내가 쓰는 테마" 같은 건 `.local.json`으로

### 연결
[[cc-commands]]·[[cc-skills]]·[[cc-hooks]]·[[cc-rules]]와 함께 [[claude-code]] 커스터마이즈 5요소의 토대. [[harness-eng]] 관점에서는 "하네스의 설정 파일" — 모델·도구·권한·훅 네 축이 여기서 묶인다. 보안 경계를 정하는 자리이기도 하니 [[pitfalls]]·[[review-mindset]]과 함께 가장 먼저 설계해야 할 층이다. VibeMap의 `.claude/settings.json`이 실 사례 (permissions allow/deny + 드리프트 훅 2종).

## en

Claude Code settings are **the harness configuration that lives in `settings.json`**. Which model to use, which Bash patterns to allow or deny, which [[cc-hooks]] to wire up, how to handle env vars, MCP servers, and telemetry — all decided here. Where CLAUDE.md carries *prompt-level* context, settings.json carries *execution-level* policy.

Three locations. `~/.claude/settings.json` (user-global), `project/.claude/settings.json` (project-shared, committed to git), `project/.claude/settings.local.json` (personal override, gitignored). Priority and specificity grow as you descend. Team-shared policies belong in the middle; personal preferences go in local.

Key sections:
- **permissions** — `allow` and `deny` lists. Allowlist common commands like `make compile` to skip prompts; denylist things like direct edits to `docs/data.js` to prevent accidents
- **hooks** — where [[cc-hooks]] are registered. Connect scripts to PreToolUse, PostToolUse, and other events
- **env** — session environment variables (API keys, model IDs)
- **model** — default model selection (e.g. `claude-opus-4-7`)

### When to use
- Project-specific permission policy — "always confirm `rm` in this project"
- Team-level mandatory automation — drift prevention, auto-formatting. VibeMap's own `settings.json` is the canonical example
- User-global preferences in one place — default model, shared env vars
- Using `.local.json` to isolate secrets and personal preference — never put API keys in the shared file

### Common pitfalls
- **`allow` too broad** — permitting `"Bash"` alone admits `rm -rf /`. Use specific matchers like `Bash(make *)`
- **Secrets in the committed `settings.json`** — it ships to git. Use `.local.json` or externalize via `env`
- **Hook overuse slowing the session** — multiple hooks per tool call hurts feel. Keep hooks minimal
- **`allow` without any `deny`** — allowlisting is good, but explicit `deny` signals "absolutely never" — which is why VibeMap locks direct edits to `docs/*`
- **Personal preference in the shared file** — "my color theme" goes in `.local.json`

### How it connects
With [[cc-commands]], [[cc-skills]], [[cc-hooks]], [[cc-rules]], the foundation of [[claude-code]]'s five-piece customization. From a [[harness-eng]] view, it's "the harness's config file" — model, tools, permissions, hooks all wire here. It's also where the security boundary is set, so design it early alongside [[pitfalls]] and [[review-mindset]] thinking. VibeMap's `.claude/settings.json` is a working example (allow/deny permissions + two drift-prevention hooks).

## ja

Claude Code設定は**`settings.json`に収まるハーネス構成情報**。どのモデルを使うか、どのBashコマンドを許可/拒否するか、どの[[cc-hooks]]を繋ぐか、環境変数・MCPサーバー・テレメトリをどう扱うか — すべてここで決まる。CLAUDE.mdが*プロンプト階層*の文脈なら、settings.jsonは*実行階層*のポリシーだ。

三箇所に置ける。`~/.claude/settings.json`(ユーザー全体)、`プロジェクト/.claude/settings.json`(プロジェクト共有、gitに含まれる)、`プロジェクト/.claude/settings.local.json`(個人上書き、gitignore対象)。下に行くほど優先度が上がり狭くなる。チーム共有ポリシーは中間、個人嗜好はlocalに。

主要セクション:
- **permissions** — `allow`・`deny`のリスト。`make compile`のような常用コマンドはallowで許可プロンプトなしで実行、`docs/data.js`の直接編集のようなものはdenyで事故を防ぐ
- **hooks** — [[cc-hooks]]の登録場所。PreToolUse・PostToolUseなどイベントにスクリプトを接続
- **env** — セッション環境変数(APIキー・モデルIDなど)
- **model** — 既定モデル選択(`claude-opus-4-7`のように)

### いつ使うか
- プロジェクト別の権限ポリシーが必要なとき — 「このプロジェクトでは`rm`は常に確認」
- チームレベルの自動フックを強制するとき — ドリフト防止、フォーマット強制など。VibeMapのsettings.jsonが代表例
- ユーザー全体の嗜好を一箇所に — 既定モデル、共通環境変数
- `.local.json`で機微情報・個人設定を分離 — APIキーは絶対共有ファイルに入れない

### はまりやすい罠
- **`allow`が広すぎる** — `"Bash"`全体を許可すると`rm -rf /`も通る。具体マッチャー(`Bash(make *)`)を使う
- **シークレットを`settings.json`に焼く** — gitにpushされると漏洩。`.local.json`または`env`で外部注入
- **フック乱発でセッションが遅い** — 各ツール呼び出しに複数フックが走ると体感が落ちる。[[cc-hooks]]も最小原則
- **`deny`なしで`allow`だけ** — ホワイトリストは良いが、明示的`deny`が「絶対ダメ」の信号 — VibeMapが`docs/*`直接編集をdenyで塞いでいる理由
- **チーム共有ファイルに個人嗜好** — 「私が使うテーマ」のようなものは`.local.json`へ

### 繋がり
[[cc-commands]]・[[cc-skills]]・[[cc-hooks]]・[[cc-rules]]と並び[[claude-code]]カスタマイズ5要素の土台。[[harness-eng]]視点では「ハーネスの設定ファイル」 — モデル・ツール・権限・フックの四軸がここで束ねられる。セキュリティ境界を決める場所でもあるので、[[pitfalls]]・[[review-mindset]]と共に最初に設計すべき層。VibeMapの`.claude/settings.json`が実事例(allow/deny permissions + 二種のドリフト防止フック)。

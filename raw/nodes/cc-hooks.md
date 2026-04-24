---
id: cc-hooks
cat: ai
size: 3
title:
  ko: Claude Code 훅
  en: Claude Code Hooks
  ja: Claude Codeフック
refs:
  - url: https://docs.claude.com/en/docs/claude-code/hooks
    title: Hooks (Anthropic Docs)
    lang: en
  - url: https://docs.claude.com/en/docs/claude-code/hooks-guide
    title: Hooks guide (Anthropic Docs)
    lang: en
extraEdges: []
---

## ko

Claude Code 훅은 **"특정 이벤트에 자동으로 실행되는 스크립트"**다. 파일이 저장되면 lint를 돌리고, 커맨드 실행 전에 위험한 패턴을 검사하고, 세션이 끝날 때 요약을 남기는 식. Git 훅과 개념이 같지만 대상이 Git이 아니라 [[claude-code]]의 *도구 사용 흐름*이다. `settings.json`의 `hooks` 섹션에 등록하면 된다.

훅 이벤트는 9가지. 가장 많이 쓰는 넷은 **PreToolUse**(도구 실행 *전* — 위험 패턴 차단), **PostToolUse**(도구 실행 *후* — 자동 컴파일·포맷), **UserPromptSubmit**(유저 입력 직후 — 맥락 주입), **Stop**(세션 종료 시 — 체크포인트). 스크립트는 stdin으로 JSON(도구명·인자)을 받고, exit 2로 블록하거나, stdout으로 additional context를 주입한다.

### 언제 쓰나
- **드리프트 방지** — 생성물과 원본이 어긋나면 커밋 블록. 본 VibeMap의 `pre-commit-drift.sh`가 대표 예
- **자동 재생성** — 특정 파일 편집 직후 파생물 재생성. VibeMap의 `post-edit-compile.sh`
- **포맷·린트 자동화** — 저장마다 [[lint]] 강제
- **위험 명령 차단** — `rm -rf /` 같은 패턴을 PreToolUse로 정규식 매칭해 거부
- **[[tidd]] 강제** — 커밋 명령 앞에서 티켓 링크 유무 확인
- **감사 로그** — 모든 Bash 실행을 외부 로그로 흘려보내기

### 쉽게 빠지는 함정
- **훅이 느리면 체감 저하** — 매 도구 호출에 2초씩 걸리면 세션이 고통스러움. 백그라운드로 돌리거나 매우 빠르게
- **exit 2 남발로 워크플로우 파괴** — 블록은 강한 수단. 경고(stderr + exit 0)로 끝낼 수 있으면 우선 그걸로
- **JSON 파싱 실패로 훅이 조용히 탈락** — `jq`가 없거나 입력 포맷이 달라지면 무응답. 훅 자체에 최소한의 에러 처리
- **민감 정보 로깅** — 훅에서 입력을 그대로 로그 파일에 박으면 시크릿·키가 샐 수 있음
- **Claude 몰래 실행되는 스크립트** — 모든 훅은 사용자 권한으로 실행된다는 걸 잊으면 안 됨. 공유된 settings.json에 의심스러운 훅이 들어오면 보안 구멍

### 연결
[[cc-commands]]·[[cc-skills]]·[[cc-rules]]·[[cc-settings]]와 함께 [[claude-code]] 커스터마이즈의 핵심 축. [[harness-eng]] 관점에서는 "*정책*을 셸 수준에서 강제"하는 레이어 — 프롬프트로 부탁하지 말고 훅으로 막아라. [[tidd]]·[[cicd]] 품질 게이트가 자연스럽게 여기 붙는다. VibeMap의 `pre-commit-drift.sh`·`post-edit-compile.sh`가 실 사례.

## en

Claude Code hooks are **scripts that run automatically on specific events**. Lint on file save, screen dangerous patterns before commands run, leave a summary at session end. The idea matches Git hooks, but the subject is [[claude-code]]'s *tool-use flow*, not Git. Register them in the `hooks` section of `settings.json`.

Nine event types exist. The four you'll use most: **PreToolUse** (before tool execution — block risky patterns), **PostToolUse** (after — auto-compile, auto-format), **UserPromptSubmit** (right after user input — inject context), **Stop** (at session end — checkpoint). The script receives JSON on stdin (tool name, arguments) and can block with exit 2 or inject "additional context" via stdout.

### When to use
- **Drift prevention** — block commits when generated files don't match sources. VibeMap's `pre-commit-drift.sh` is the canonical case
- **Auto-regeneration** — regenerate derived files after editing the source. VibeMap's `post-edit-compile.sh`
- **Format/lint automation** — enforce [[lint]] on save
- **Dangerous-command blocking** — regex-match `rm -rf /`-class patterns in PreToolUse
- **[[tidd]] enforcement** — check ticket link presence before a commit command
- **Audit logging** — pipe every Bash invocation to an external log

### Common pitfalls
- **Slow hooks degrade the session** — 2 seconds on every tool call is painful. Run in background, or keep them fast
- **Overusing exit 2** — blocking is a strong signal. Prefer warn-and-exit-0 (stderr message) when a hard block isn't needed
- **Silent failures in JSON parsing** — if `jq` is missing or input shape changes, the hook silently skips. Add minimal error handling in the script itself
- **Logging sensitive data** — pasting hook input straight to a log file can leak secrets. Redact or skip
- **Scripts running behind Claude's back** — every hook executes as the user. A suspicious hook in a shared `settings.json` is a security hole

### How it connects
With [[cc-commands]], [[cc-skills]], [[cc-rules]], and [[cc-settings]], a core axis of [[claude-code]] customization. From a [[harness-eng]] perspective, this is the layer for *enforcing policy at the shell level* — stop asking the prompt to behave, block the action with a hook. Quality gates for [[tidd]] and [[cicd]] fit naturally here. VibeMap's `pre-commit-drift.sh` and `post-edit-compile.sh` are working examples.

## ja

Claude Codeフックは**「特定イベントで自動実行されるスクリプト」**。ファイル保存時にlintを走らせ、コマンド実行前に危険パターンを検査し、セッション終了時にサマリーを残す、といった具合。Gitフックと概念は同じだが、対象はGitではなく[[claude-code]]の*ツール使用フロー*。`settings.json`の`hooks`セクションに登録する。

フックイベントは9種類。最頻のは四つ: **PreToolUse**(ツール実行*前* — 危険パターンを遮断)、**PostToolUse**(ツール実行*後* — 自動コンパイル・フォーマット)、**UserPromptSubmit**(ユーザー入力直後 — 文脈注入)、**Stop**(セッション終了時 — チェックポイント)。スクリプトはstdinでJSON(ツール名・引数)を受け、exit 2でブロックするかstdoutにadditional contextを注入できる。

### いつ使うか
- **ドリフト防止** — 生成物が原本と乖離したらコミット遮断。VibeMapの`pre-commit-drift.sh`が代表例
- **自動再生成** — 特定ファイル編集直後に派生物を再生成。VibeMapの`post-edit-compile.sh`
- **フォーマット・lint自動化** — 保存のたびに[[lint]]強制
- **危険コマンド遮断** — `rm -rf /`級パターンをPreToolUseで正規表現マッチして拒否
- **[[tidd]]強制** — コミットコマンド前にチケットリンクの有無を確認
- **監査ログ** — 全Bash実行を外部ログに流す

### はまりやすい罠
- **遅いフックは体感を下げる** — 毎ツール呼び出しに2秒かかるとセッションが苦痛。バックグラウンド化、または超高速化
- **exit 2の乱用** — ブロックは強いシグナル。警告(stderr + exit 0)で済むならまずそれ
- **JSONパース失敗で黙って脱落** — `jq`が無いか入力フォーマットが変わるとフックが無反応。スクリプト内に最小限のエラー処理
- **機微情報のロギング** — フックの入力をそのままログに貼るとシークレットが漏れる。マスクするかスキップ
- **Claudeに隠れて走るスクリプト** — すべてのフックはユーザー権限で実行される。共有settings.jsonに怪しいフックが入れば穴

### 繋がり
[[cc-commands]]・[[cc-skills]]・[[cc-rules]]・[[cc-settings]]と並んで[[claude-code]]カスタマイズの核心軸。[[harness-eng]]視点では「*ポリシー*をシェルレベルで強制する」層 — プロンプトに頼むのではなくフックで塞ぐ。[[tidd]]・[[cicd]]の品質ゲートがここに自然に付く。VibeMapの`pre-commit-drift.sh`・`post-edit-compile.sh`が実例。

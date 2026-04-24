// scripts/legacy-nodes.js — snapshot of docs/data.js nodes as of 2026-04-22
// AUTO-LOADED by scripts/compile-nodes.mjs via vm.runInContext.
// Do not hand-edit after new md nodes are added — prefer migrating to raw/nodes/.

const LEGACY_NODES = [
  // ── CORE ────────────────────────────────────────────────
  { id: "vibe", cat: "core", size: 1,
    title: { ko: "바이브 코딩", en: "Vibe Coding", ja: "バイブコーディング" },
    body: {
      ko: "직관과 느낌으로 AI에게 말을 걸어 코드를 만들어내는 방식. 원래는 '감으로 짜는' 개발자를 비꼬는 말이었지만, LLM 시대에 와서 '프롬프트만으로 작동하는 코드를 얻는 기술'로 재해석되었다.\n\n비유: 운전을 배우는 대신 택시기사에게 목적지를 잘 설명하는 기술. 핸들을 직접 잡지 않아도 원하는 곳에 도착할 수 있다 — 목적지를 정확히 말할 수 있다면.",
      en: "Talking to an AI by intuition and vibes to make code. Once mockery for 'winging it' devs, now repurposed for the LLM era: the craft of getting working code from a prompt.\n\nAnalogy: Instead of learning to drive, you learn to tell a taxi driver exactly where to go. You still arrive — if your directions are clear.",
      ja: "直感とノリでAIに話しかけてコードを生み出す方法。元は「勘でコードを書く」開発者への皮肉だったが、LLM時代には「プロンプトだけで動くコードを得る技術」として再解釈された。\n\n例え: 運転を覚える代わりに、タクシー運転手に目的地をうまく伝える技術。" }
  },

  // ── MINDSET ─────────────────────────────────────────────
  { id: "intent", cat: "mindset", size: 2,
    title: { ko: "의도공학", en: "Intent Engineering", ja: "意図工学" },
    body: {
      ko: "\"Ship intent, not code.\" — 코드가 아니라 '의도'를 배포한다는 관점. AI가 생성을 값싸게 만든 시대에, 속도를 소음이 아닌 명료함으로 바꾸는 기술.\n\n의도 문서(INTENT.md)는 딱 네 가지만 담는다:\n• Why — 왜 존재해야 하는가 (문제·목표·성공 기준)\n• What — 무엇을 만들 것인가 (기능·플로우·엣지 케이스)\n• Not — AI가 넘지 말아야 할 선 (금지·범위·보안·품질)\n• Learnings — 무엇을 시도하고 배웠는가\n\n핵심 원칙: '어떻게(How)'를 쓰지 말 것. 스택·아키텍처·일정은 AI가 고른다. 인간은 Why/What/Not만 쥐고, 결과를 판단한다.\n\n의도는 정적이지 않다 — seed → exploring → clarified → build, 혹은 언제든 killed. 증거가 부족하면 바로 죽여라. 좋은 일이다.\n\n치명적 예시:\n'좋은 앱 만들기' ❌ (소음)\n'신규 유저가 30초 안에 가치를 경험한다' ✅ (의도)",
      en: "\"Ship intent, not code.\" AI made generation cheap; without intent that speed is noise, with it it's clarity.\n\nAn Intent Document has exactly four sections:\n• Why — why it must exist (problem, goal, success bar)\n• What — what to build (features, flows, edges)\n• Not — lines AI cannot cross (scope, security, quality)\n• Learnings — what you tried and discovered\n\nCore rule: never write *How*. Stack, architecture, timeline — AI chooses. Humans own Why/What/Not and judge the outcome.\n\nIntent isn't static: seed → exploring → clarified → build, or killed at any point. Killing fast is good.\n\n'Build a good app' ❌ (noise)\n'New users reach value in 30 seconds' ✅ (intent)",
      ja: "\"Ship intent, not code.\" コードではなく「意図」をデプロイするという考え方。AIが生成を安くした時代に、速度を騒音ではなく明快さに変える技術。\n\nIntent Documentの4セクション:\n• Why — なぜ存在するか\n• What — 何を作るか\n• Not — AIが越えてはならない線\n• Learnings — 何を試し何を学んだか\n\n原則: Howは書かない。スタック・アーキテクチャ・スケジュールはAIが選ぶ。人間はWhy/What/Notだけ握り、結果を判断する。\n\n意図は静的ではない。seed→exploring→clarified→build、または いつでもkilled。早く殺すのは良いこと。\n\n「良いアプリを作る」❌（騒音）\n「新規ユーザーが30秒で価値に到達」✅（意図）" }
  },

  // ── AI ─────────────────────────────────────────────────
  { id: "llm-basics", cat: "ai", size: 2,
    title: { ko: "LLM 이해하기", en: "Understanding LLMs", ja: "LLMを理解する" },
    body: {
      ko: "LLM은 확률적으로 다음 단어를 예측하는 기계. 따라서 같은 질문에 매번 조금씩 다른 답을 한다. 이걸 '버그'가 아니라 '특성'으로 이해해야 한다.\n\n비유: 컴파일러는 계산기, LLM은 친구. 친구는 매번 기분이 다르지만 맥락을 이해한다.",
      en: "An LLM predicts the next word by probability. Same question, slightly different answers. That's not a bug — it's the whole deal.\n\nAnalogy: compilers are calculators, LLMs are friends. Friends have moods, but they read context.",
      ja: "LLMは確率的に次の単語を予測する機械。同じ質問にも毎回少し違う答えを返す。バグではなく特性として理解する。" }
  },
  { id: "ai-coding-tools", cat: "ai", size: 2,
    title: { ko: "AI 코딩 도구", en: "AI Coding Tools", ja: "AIコーディングツール" },
    body: {
      ko: "대표 선수들: Claude Code (터미널/에이전트), Cursor (에디터), GitHub Copilot (자동완성), v0/Lovable (프롬프트→앱).\n\n목적에 맞게 고르자. '처음부터 만들기'는 Lovable, '코드베이스 편집'은 Cursor/Claude Code가 강하다.",
      en: "The roster: Claude Code (terminal/agent), Cursor (editor), Copilot (autocomplete), v0/Lovable (prompt-to-app).\n\nPick by purpose. From scratch? Lovable. Editing a codebase? Cursor / Claude Code.",
      ja: "代表選手: Claude Code（ターミナル/エージェント）、Cursor（エディタ）、Copilot（補完）、v0/Lovable（プロンプト→アプリ）。" }
  },
  { id: "cc-settings", cat: "ai", size: 3,
    title: { ko: "설정 (Settings)", en: "Settings", ja: "設定" },
    body: {
      ko: "`~/.claude/settings.json`에 퍼미션, 모델, 환경변수 등을 설정. 프로젝트별 `.claude/settings.json`으로 오버라이드 가능.",
      en: "Configure permissions, model, env vars in `~/.claude/settings.json`. Override per-project via `.claude/settings.json`.",
      ja: "`~/.claude/settings.json`に権限・モデル・環境変数を設定。プロジェクト単位で上書き可能。" }
  },
  { id: "cc-skills", cat: "ai", size: 3,
    title: { ko: "스킬 (Skills)", en: "Skills", ja: "スキル" },
    body: {
      ko: "재사용 가능한 능력 꾸러미. '이 스킬 써줘' 한마디로 특정 작업(PDF 처리, 데이터 분석 등)을 잘하게 만든다.",
      en: "Reusable capability bundles. Say 'use this skill' and Claude gets good at specific jobs (PDF parsing, data analysis, etc).",
      ja: "再利用可能な能力バンドル。「このスキルを使って」と言うだけで特定タスクが得意になる。" }
  },
  { id: "cc-hooks", cat: "ai", size: 3,
    title: { ko: "훅 (Hooks)", en: "Hooks", ja: "フック" },
    body: {
      ko: "특정 이벤트(도구 실행 전/후 등)에 자동 실행되는 스크립트. 예: '파일 저장 후 자동으로 lint 돌리기'.",
      en: "Scripts that auto-run on events (before/after tool use). Example: 'run the linter every time a file is saved'.",
      ja: "特定イベント（ツール実行前後など）で自動実行されるスクリプト。" }
  },
  { id: "cc-commands", cat: "ai", size: 3,
    title: { ko: "커맨드 (Commands)", en: "Commands", ja: "コマンド" },
    body: {
      ko: "`/명령어` 로 호출하는 단축키. 자주 쓰는 프롬프트를 `.claude/commands/`에 저장해두면 한 번에 실행된다.",
      en: "Shortcuts invoked with `/command`. Save frequent prompts into `.claude/commands/` and fire them with one line.",
      ja: "`/コマンド`で呼び出すショートカット。よく使うプロンプトを保存しておく。" }
  },
  { id: "cc-rules", cat: "ai", size: 3,
    title: { ko: "규칙 (CLAUDE.md)", en: "Rules (CLAUDE.md)", ja: "ルール (CLAUDE.md)" },
    body: {
      ko: "프로젝트 루트의 `CLAUDE.md`는 '이 프로젝트의 헌법'. 코드 스타일, 디렉토리 구조, 하지 말 것 등을 적어두면 매 세션에 자동 적용된다.",
      en: "`CLAUDE.md` at project root is your project's constitution — code style, structure, don'ts. Auto-loaded every session.",
      ja: "プロジェクトルートの`CLAUDE.md`は「このプロジェクトの憲法」。毎セッション自動適用される。" }
  },
  { id: "mcp", cat: "ai", size: 2,
    title: { ko: "MCP", en: "MCP (Model Context Protocol)", ja: "MCP" },
    body: {
      ko: "Model Context Protocol — AI가 외부 도구(DB, Slack, Figma 등)에 안전하게 연결되는 표준 규격. USB-C 같은 것. 한 번 붙이면 여러 도구에서 재사용.",
      en: "Model Context Protocol — the USB-C for AI: a standard to plug AIs into external tools (DBs, Slack, Figma). Wire once, reuse everywhere.",
      ja: "AIが外部ツールに安全に接続するための標準規格。USB-Cのようなもの。" }
  },
  { id: "agentic", cat: "ai", size: 2,
    title: { ko: "에이전틱 워크플로우", en: "Agentic Workflow", ja: "エージェント型ワークフロー" },
    body: {
      ko: "AI가 스스로 계획 → 실행 → 검증 → 수정을 반복하는 흐름. 지시자(너)는 목표와 제약만 주고, 세부 판단은 AI가 한다.\n\n예시: '이 버그 고쳐줘' → AI가 테스트 실행 → 실패 원인 분석 → 수정 → 재테스트 → 보고.",
      en: "AI plans → acts → verifies → revises on its own loop. You give the goal and guardrails; it handles the micro-decisions.\n\nExample: 'fix this bug' → runs tests → analyzes failure → edits → re-runs → reports.",
      ja: "AIが自律的に計画→実行→検証→修正を繰り返す流れ。目標と制約だけ与え、細部はAIが判断。" }
  },
  { id: "hallucination", cat: "ai", size: 3,
    title: { ko: "환각 (Hallucination)", en: "Hallucination", ja: "ハルシネーション" },
    body: {
      ko: "AI가 존재하지 않는 함수, 라이브러리, API를 그럴싸하게 지어내는 현상. 방어: 실제로 돌려봐라. 컴파일/실행이 진실의 기준.",
      en: "AI confidently invents functions, libraries, APIs that don't exist. Defense: *run the thing*. Compilation is truth.",
      ja: "AIが存在しない関数・ライブラリ・APIを自信満々に捏造する現象。" }
  },

  // ── TOOL ───────────────────────────────────────────────
  { id: "terminal", cat: "tool", size: 2,
    title: { ko: "터미널/CLI", en: "Terminal / CLI", ja: "ターミナル / CLI" },
    body: {
      ko: "검은 화면에 글자 치는 그것. `cd`, `ls`, `mkdir` 열 개 정도만 알면 된다. 바이브 코딩에서는 AI가 대신 쳐주지만, '지금 어디 있는지' 정도는 알아야 한다.",
      en: "That black window with text. Ten commands (`cd`, `ls`, `mkdir`, …) will carry you far. AI types for you — but you still need to know *where you are*.",
      ja: "黒い画面に文字を打つアレ。`cd`、`ls`、`mkdir`など10個覚えれば十分。" }
  },
  { id: "git-basics", cat: "tool", size: 3,
    title: { ko: "Git 기초 개념", en: "Git Basics", ja: "Git基礎" },
    body: {
      ko: "commit = 사진 찍기, branch = 평행우주, merge = 평행우주 합치기, push = 클라우드에 올리기, pull = 클라우드에서 받기. 끝.",
      en: "commit = snapshot, branch = parallel universe, merge = merge universes, push = upload, pull = download. That's it.",
      ja: "commit=写真を撮る、branch=並行世界、merge=統合、push=アップ、pull=ダウン。" }
  },
  { id: "trunk", cat: "tool", size: 2,
    title: { ko: "트렁크 기반 워크플로우", en: "Trunk-Based Workflow", ja: "トランクベース開発" },
    body: {
      ko: "메인 브랜치(트렁크) 하나에 모두가 자주(하루에도 여러 번) 합치는 방식. 작고 빠른 커밋이 핵심. '장기 브랜치 지옥'을 피한다.\n\n비유: 모두가 같은 카톡방에서 자주 얘기하는 것. 따로 단톡 파서 한 달 모여 수다떨다 합치면 난리난다.",
      en: "Everyone merges into one main branch frequently (multiple times a day). Small fast commits. Avoids long-lived-branch hell.\n\nAnalogy: one shared chatroom where everyone talks often. Splitting into side chats for a month always ends badly.",
      ja: "メインブランチ一つに全員が頻繁に（1日に何度も）マージする方式。" }
  },
  { id: "github", cat: "tool", size: 3,
    title: { ko: "GitHub", en: "GitHub", ja: "GitHub" },
    body: {
      ko: "Git을 웹으로 올려 놓은 서비스. 코드의 인스타그램 + 구글드라이브 + 댓글창. 협업과 포트폴리오 둘 다 된다.",
      en: "Git on the web. Instagram + Google Drive + comment thread for code. Doubles as portfolio and collab space.",
      ja: "Gitのウェブ版。コードのインスタ+Googleドライブ+コメント欄。" }
  },
  { id: "pr", cat: "tool", size: 3,
    title: { ko: "PR & 코드 리뷰", en: "PR & Code Review", ja: "PR・コードレビュー" },
    body: {
      ko: "Pull Request = '이 변경사항 합쳐도 될까요?' 요청. 동료(또는 AI)가 읽고 코멘트를 달아 더 나은 코드로 만든다.",
      en: "Pull Request = 'may I merge this change?'. A peer (or AI) reads it, comments, and levels the code up.",
      ja: "Pull Request=「この変更をマージしていいですか？」依頼。" }
  },
  { id: "package-mgr", cat: "tool", size: 3,
    title: { ko: "패키지 매니저", en: "Package Manager", ja: "パッケージマネージャ" },
    body: {
      ko: "npm / pnpm / yarn — 남이 만든 코드 블록(라이브러리)을 설치·관리하는 앱스토어. `package.json`이 장바구니 영수증.",
      en: "npm / pnpm / yarn — the app store for code blocks. `package.json` is the receipt.",
      ja: "npm / pnpm / yarn — 他人のコードブロックを管理するアプリストア。" }
  },
  { id: "framework", cat: "tool", size: 3,
    title: { ko: "프레임워크 선택", en: "Picking a Framework", ja: "フレームワーク選択" },
    body: {
      ko: "웹 처음이면 Next.js (React 기반, 제일 범용적). 간단한 SPA면 Vite+React. 풀스택 SaaS면 Next.js + Supabase/Convex 조합이 요즘 표준.",
      en: "First web project → Next.js (React-based, ubiquitous). Tiny SPA → Vite+React. Full-stack SaaS → Next.js + Supabase/Convex is today's default.",
      ja: "初めてのウェブはNext.js。軽量SPAならVite+React。フルスタックSaaSならNext.js+Supabase/Convex。" }
  },
  { id: "debug", cat: "tool", size: 2,
    title: { ko: "디버깅 & 에러 읽기", en: "Debugging & Reading Errors", ja: "デバッグ・エラー読解" },
    body: {
      ko: "에러 메시지는 AI에게 '그대로 통째로' 붙여넣어라. 해석하려 하지 말고. 스택 트레이스도 포함. 그게 가장 빠른 길.\n\n팁: '이 에러가 뭐고, 왜 났고, 어떻게 고치는지 3개 가능성'을 묻자.",
      en: "Paste the *entire* error into the AI. Don't interpret it yourself. Include the stack trace. Fastest path.\n\nTip: ask 'what is it, why, and 3 possible fixes'.",
      ja: "エラーメッセージはAIにそのまま丸ごと貼り付け。スタックトレースも含める。" }
  },
  { id: "lint", cat: "tool", size: 3,
    title: { ko: "린트 (Lint)", en: "Linter", ja: "リンター" },
    body: {
      ko: "코드 맞춤법 검사기. ESLint / Prettier 같은 도구가 '이건 스타일 이상해'를 자동 지적. AI 코드 품질 관리에 필수.",
      en: "Spellcheck for code. ESLint / Prettier flag style crimes automatically. Essential when shipping AI-generated code.",
      ja: "コードのスペルチェッカー。ESLint / Prettierが自動指摘。" }
  },
  { id: "refactor", cat: "tool", size: 3,
    title: { ko: "리팩토링", en: "Refactoring", ja: "リファクタリング" },
    body: {
      ko: "작동은 그대로 두고 '모양만 깔끔하게' 정리. AI에게 맡기기 딱 좋은 작업이지만, 반드시 테스트 먼저 깔고 돌려라.",
      en: "Clean up the shape without changing behavior. Perfect AI task — but lay tests down *first*.",
      ja: "動作はそのままに、形だけ整理する。AI向きだが、必ずテストを先に。" }
  },
  { id: "ide", cat: "tool", size: 3,
    title: { ko: "에디터/IDE", en: "Editor / IDE", ja: "エディタ / IDE" },
    body: {
      ko: "VS Code, Cursor, Zed — 코드 쓰는 문서 앱. 바이브 코딩에서는 AI 통합이 강한 Cursor나 터미널형 Claude Code가 인기.",
      en: "VS Code, Cursor, Zed — the doc app for code. AI-native Cursor and terminal-first Claude Code lead the pack.",
      ja: "VS Code、Cursor、Zed — コード用のドキュメントアプリ。" }
  },

  // ── TECH ───────────────────────────────────────────────
  { id: "tdd", cat: "tech", size: 1,
    title: { ko: "TDD", en: "TDD", ja: "TDD" },
    body: {
      ko: "Test-Driven Development. 작동 코드를 쓰기 전에 '이게 맞게 동작하는지 확인하는 코드(테스트)'를 먼저 쓰는 방식. AI 시대에 특히 빛난다 — AI가 만든 코드의 '합격 조건'을 미리 정해두는 셈.\n\n빨강(실패) → 초록(통과) → 리팩토링, 이 사이클이 전부.",
      en: "Test-Driven Development. Write the *test* (pass/fail check) before the code. Especially powerful in the AI era — you're defining the grading rubric upfront.\n\nRed → Green → Refactor, that's the whole loop.",
      ja: "Test-Driven Development. 動くコードより先にテストを書く方式。AI時代に特に光る—合格条件を先に定義する。" }
  },
  { id: "testing", cat: "tech", size: 2,
    title: { ko: "테스트", en: "Testing", ja: "テスト" },
    body: {
      ko: "UT (단위): 함수 하나. IT (통합): 여러 부품 연결. E2E (엔드투엔드): 사용자 관점 전체 플로우.\n\n비유: UT는 부품 검사, IT는 조립 검사, E2E는 시승.",
      en: "UT (unit): one function. IT (integration): parts wired. E2E (end-to-end): full user flow.\n\nAnalogy: UT = part inspection, IT = assembly inspection, E2E = test drive.",
      ja: "UT (単体)、IT (結合)、E2E (エンドツーエンド)。部品検査、組立検査、試乗の違い。" }
  },
  { id: "ut", cat: "tech", size: 3,
    title: { ko: "단위 테스트 (UT)", en: "Unit Test", ja: "単体テスト" },
    body: {
      ko: "함수 하나가 정해진 입력에 정해진 출력을 내는지 확인. 빠르고 많이 돌릴 수 있다. AI가 가장 잘 만들어주는 테스트 종류.",
      en: "Check a single function maps input to expected output. Fast and plentiful. AI's best-generated kind.",
      ja: "関数一つが期待通りの出力を返すかを確認。" }
  },
  { id: "it", cat: "tech", size: 3,
    title: { ko: "통합 테스트 (IT)", en: "Integration Test", ja: "結合テスト" },
    body: {
      ko: "여러 모듈이 붙었을 때 제대로 돌아가는지 확인. DB 붙은 API 호출 같은 것.",
      en: "Check that multiple modules work when wired together — e.g. API → DB.",
      ja: "複数モジュールが結合した時に正しく動くかを確認。" }
  },
  { id: "e2e", cat: "tech", size: 3,
    title: { ko: "E2E 테스트", en: "E2E Test", ja: "E2Eテスト" },
    body: {
      ko: "실제 브라우저를 열어 버튼 누르고 폼 채우는 테스트. Playwright, Cypress가 대표. 느리지만 '진짜로 되는지' 확실.",
      en: "Opens a real browser, clicks buttons, fills forms. Playwright or Cypress. Slow, but true truth.",
      ja: "実際にブラウザを開いてボタンを押し、フォームを埋めるテスト。" }
  },
  { id: "api", cat: "tech", size: 2,
    title: { ko: "API 이해", en: "APIs", ja: "API" },
    body: {
      ko: "프로그램끼리 말하는 규칙. 식당으로 치면 메뉴판. '이런 요청을 이런 형식으로 하면, 이런 응답 줄게'.",
      en: "The rulebook for programs talking to each other. The restaurant menu: 'order like this, get that'.",
      ja: "プログラム同士の会話ルール。レストランのメニューのようなもの。" }
  },
  { id: "rest", cat: "tech", size: 3,
    title: { ko: "REST", en: "REST", ja: "REST" },
    body: {
      ko: "URL과 HTTP 동사(GET/POST/PUT/DELETE)로 데이터 주고받는 관습. 가장 보편적. 97%의 웹 API가 이것.",
      en: "Convention of swapping data via URLs + HTTP verbs (GET/POST/PUT/DELETE). The default for 97% of web APIs.",
      ja: "URLとHTTP動詞でデータをやり取りする慣習。" }
  },
  { id: "graphql", cat: "tech", size: 3,
    title: { ko: "GraphQL", en: "GraphQL", ja: "GraphQL" },
    body: {
      ko: "'내가 원하는 필드만 달라'고 말할 수 있는 API 방식. 프론트가 유연하지만 셋업이 무거움.",
      en: "Say 'give me only these fields' API style. Flexible on the front, heavy to set up.",
      ja: "必要なフィールドだけ指定できるAPI方式。" }
  },
  { id: "env", cat: "tech", size: 3,
    title: { ko: "환경변수 & 보안", en: "Env Vars & Secrets", ja: "環境変数・セキュリティ" },
    body: {
      ko: "API 키, 비밀번호는 절대 코드에 박지 말기. `.env` 파일에 넣고 `.gitignore`로 GitHub에 안 올라가게 하라. AI에게 절대 키 그대로 보여주지 말 것.\n\n사고 1위: 키가 깃허브에 유출되는 것.",
      en: "Never hardcode API keys or passwords. Put them in `.env` and `.gitignore` them. Never paste real keys into the AI.\n\n#1 footgun: secrets leaked to public GitHub.",
      ja: "APIキーやパスワードは絶対コードに書かない。`.env`に入れて`.gitignore`。" }
  },
  { id: "container", cat: "tech", size: 3,
    title: { ko: "컨테이너 (Docker)", en: "Containers (Docker)", ja: "コンテナ (Docker)" },
    body: {
      ko: "'내 컴퓨터에서는 됐는데…' 문제를 박멸하는 포장 기술. 앱 + 환경을 통째로 상자에 담아 어디서든 똑같이 돌아가게 한다.",
      en: "Kills the 'works on my machine' problem. Pack app + its environment into a box that runs identically anywhere.",
      ja: "「私のPCでは動いた…」問題を撲滅する包装技術。" }
  },
  { id: "microservices", cat: "tech", size: 3,
    title: { ko: "마이크로서비스", en: "Microservices", ja: "マイクロサービス" },
    body: {
      ko: "거대한 앱을 작은 서비스 여러 개로 쪼개는 아키텍처. 유연하지만 복잡도 폭발. 비개발자 바이브 코딩에는 보통 오버킬.",
      en: "Split a giant app into lots of small services. Flexible but complexity explodes. Usually overkill for non-dev vibe coders.",
      ja: "巨大アプリを小さなサービスに分割する構造。柔軟だが複雑度が爆発。" }
  },

  // ── DATA ───────────────────────────────────────────────
  { id: "db-basics", cat: "data", size: 2,
    title: { ko: "데이터베이스 기초", en: "Database Basics", ja: "DB基礎" },
    body: {
      ko: "앱이 '기억하는' 장소. 엑셀 시트의 거대한 고성능 버전. CRUD (Create/Read/Update/Delete) 네 가지 동작이 전부.",
      en: "Where apps *remember* things. Giant performant Excel. Four verbs: CRUD (Create/Read/Update/Delete).",
      ja: "アプリが「覚える」場所。巨大で高性能なExcel。CRUDの4つだけ。" }
  },
  { id: "sql", cat: "data", size: 3,
    title: { ko: "관계형 DB (SQL)", en: "Relational DB (SQL)", ja: "リレーショナルDB (SQL)" },
    body: {
      ko: "표(테이블) 구조로 데이터를 저장하고, 표끼리 연결한다. PostgreSQL, MySQL. 구조가 명확하고 데이터 정합성이 강함.",
      en: "Store data in tables and link tables. PostgreSQL, MySQL. Strong structure and integrity.",
      ja: "表構造でデータを保存し、表同士を繋ぐ。PostgreSQL、MySQL。" }
  },
  { id: "nosql", cat: "data", size: 3,
    title: { ko: "NoSQL", en: "NoSQL", ja: "NoSQL" },
    body: {
      ko: "자유로운 구조(JSON 문서 등)로 저장. MongoDB, DynamoDB. 빠르고 유연하지만 '관계'를 표현하기 어렵다.",
      en: "Store freeform shapes (JSON docs). MongoDB, DynamoDB. Fast and flexible, weak at relations.",
      ja: "自由な構造で保存。MongoDB、DynamoDB。高速で柔軟だが「関係」表現が苦手。" }
  },
  { id: "sql-vs-nosql", cat: "data", size: 3,
    title: { ko: "SQL vs NoSQL", en: "SQL vs NoSQL", ja: "SQL vs NoSQL" },
    body: {
      ko: "고민되면 SQL (PostgreSQL). 확장성·유연성이 극단적으로 필요하면 NoSQL. 초보자 90% 케이스는 Postgres 정답.",
      en: "When in doubt: SQL (PostgreSQL). Need extreme scale or flex? NoSQL. 90% of beginner cases → Postgres.",
      ja: "迷ったらSQL (PostgreSQL)。極端な拡張性・柔軟性が必要ならNoSQL。" }
  },
  { id: "dw", cat: "data", size: 3,
    title: { ko: "데이터 웨어하우스 (DW)", en: "Data Warehouse", ja: "データウェアハウス" },
    body: {
      ko: "분석용 대형 창고. 정제된 구조화 데이터를 쌓아두고 비즈니스 질문에 답한다. Snowflake, BigQuery, Redshift.",
      en: "Big analytics warehouse. Structured cleaned data for business questions. Snowflake, BigQuery, Redshift.",
      ja: "分析用の大型倉庫。Snowflake、BigQuery、Redshift。" }
  },
  { id: "datalake", cat: "data", size: 3,
    title: { ko: "데이터 레이크", en: "Data Lake", ja: "データレイク" },
    body: {
      ko: "정제 안 된 모든 원시 데이터를 호수처럼 쏟아붓는 곳. 나중에 필요한 걸 건져 쓴다. DW보다 유연, 덜 정리됨.",
      en: "Dump *all* raw data into a lake. Fish out what you need later. More flexible than DW, less tidy.",
      ja: "未整理のあらゆる生データを湖のように貯める場所。" }
  },
  { id: "db-vs-dw", cat: "data", size: 3,
    title: { ko: "DB vs DW vs Lake", en: "DB vs DW vs Lake", ja: "DB vs DW vs Lake" },
    body: {
      ko: "DB = 서비스 운영용 창고 (빠른 입출고). DW = 분석용 창고 (구조화된 질의). Lake = 뭐든 다 쏟아붓는 저수지.",
      en: "DB = operational storage (fast ops). DW = analytics storage (structured queries). Lake = the reservoir where anything goes.",
      ja: "DB=運用用、DW=分析用、Lake=何でも貯める貯水池。" }
  },

  // ── OPS ────────────────────────────────────────────────
  { id: "lambda", cat: "ops", size: 3,
    title: { ko: "AWS Lambda", en: "AWS Lambda", ja: "AWS Lambda" },
    body: {
      ko: "'함수 한 개'를 클라우드에 올려놓고 호출될 때만 실행. 전기세가 아니라 '버튼 누른 횟수'로 과금.",
      en: "Upload a single function; it runs only when called. Billed by invocations, not by hours.",
      ja: "関数一つをクラウドに置き、呼ばれた時だけ実行。" }
  },
  { id: "apigw", cat: "ops", size: 3,
    title: { ko: "API Gateway", en: "API Gateway", ja: "API Gateway" },
    body: {
      ko: "Lambda로 들어오는 인터넷 요청의 '현관문'. URL을 함수에 연결해준다.",
      en: "The front door for internet requests into Lambda. Maps URLs to functions.",
      ja: "Lambdaへのリクエストの玄関。" }
  },
  { id: "dynamodb", cat: "ops", size: 3,
    title: { ko: "DynamoDB", en: "DynamoDB", ja: "DynamoDB" },
    body: {
      ko: "AWS의 서버리스 NoSQL. 설치·운영 필요 없고 자동 확장. 서버리스 스택의 기본 DB.",
      en: "AWS's serverless NoSQL. No setup, auto-scales. The default DB for serverless stacks.",
      ja: "AWSのサーバーレスNoSQL。自動スケール。" }
  },
  { id: "s3", cat: "ops", size: 3,
    title: { ko: "S3", en: "S3", ja: "S3" },
    body: {
      ko: "파일 저장소. 이미지·동영상·백업 아무거나 던져넣는 무제한 클라우드 하드. 싸고 튼튼하다.",
      en: "File storage. Toss any images, videos, backups — unlimited cloud disk. Cheap and durable.",
      ja: "ファイルストレージ。画像・動画・バックアップを何でも放り込める。" }
  },
  { id: "vercel", cat: "ops", size: 3,
    title: { ko: "Vercel / Netlify", en: "Vercel / Netlify", ja: "Vercel / Netlify" },
    body: {
      ko: "GitHub 연결 한 번으로 '푸시하면 자동 배포'되는 마법 서비스. 비개발자·프론트엔드 프로젝트는 99% 이걸로 충분. 무료 티어 후한 편.",
      en: "Connect GitHub once; every push auto-deploys. Magic for non-devs and frontend projects. Generous free tier.",
      ja: "GitHub連携一発で、プッシュすれば自動デプロイ。" }
  },
  { id: "domain", cat: "ops", size: 3,
    title: { ko: "도메인 & 호스팅", en: "Domain & Hosting", ja: "ドメイン・ホスティング" },
    body: {
      ko: "도메인(example.com) = 주소. 호스팅 = 집. 요즘은 Vercel이 호스팅, Cloudflare/Route53이 도메인이 무난한 조합.",
      en: "Domain = address. Hosting = house. Today's safe combo: Vercel (hosting) + Cloudflare / Route53 (domain).",
      ja: "ドメイン=住所、ホスティング=家。" }
  },
  { id: "monitoring", cat: "ops", size: 3,
    title: { ko: "모니터링", en: "Monitoring", ja: "モニタリング" },
    body: {
      ko: "배포 후 '진짜 잘 돌아가는지' 계속 지켜보기. Sentry(에러), Vercel Analytics(사용자), Logs(흐름). AI에게 에러 로그 붙여넣는 습관이 핵심.",
      en: "After deploy, keep watching. Sentry (errors), Vercel Analytics (users), logs (flow). Paste the logs into AI — that's the reflex.",
      ja: "デプロイ後も動きを監視する。Sentry、Vercel Analytics、Logs。" }
  },
];

if (typeof module !== 'undefined') module.exports = LEGACY_NODES;
if (typeof globalThis !== 'undefined') globalThis.LEGACY_NODES = LEGACY_NODES;

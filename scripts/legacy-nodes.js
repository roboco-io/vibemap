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

  // ── DATA ───────────────────────────────────────────────

  // ── OPS ────────────────────────────────────────────────
];

if (typeof module !== 'undefined') module.exports = LEGACY_NODES;
if (typeof globalThis !== 'undefined') globalThis.LEGACY_NODES = LEGACY_NODES;

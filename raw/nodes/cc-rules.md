---
id: cc-rules
cat: ai
size: 3
title:
  ko: Claude Code 규칙 (CLAUDE.md)
  en: Rules (CLAUDE.md)
  ja: ルール (CLAUDE.md)
refs:
  - url: https://docs.claude.com/en/docs/claude-code/memory
    title: Memory and CLAUDE.md (Anthropic Docs)
    lang: en
  - url: https://www.anthropic.com/engineering/claude-code-best-practices
    title: Claude Code Best Practices (Anthropic Engineering)
    lang: en
extraEdges: []
---

## ko

CLAUDE.md는 **프로젝트의 "헌법" 역할을 하는 마크다운 파일**이다. 프로젝트 루트에 두면 [[claude-code]]가 매 세션 자동으로 읽어 컨텍스트에 싣는다. 코딩 스타일, 디렉토리 구조, 하지 말 것, 도메인 용어, 실행 방법 — 매번 설명하지 않아도 될 것들을 이 한 파일에 모은다. "AI에게 프로젝트를 온보딩시키는 문서"라 생각하면 맞다.

세 계층으로 상속된다. `~/.claude/CLAUDE.md`(유저 전역) → `프로젝트/CLAUDE.md`(프로젝트 기본) → `프로젝트/서브디렉토리/CLAUDE.md`(로컬 오버라이드). 아래로 갈수록 구체적 규칙. Git에 커밋되므로 **팀 전체가 같은 규칙을 공유**하며, 변경 이력도 [[git]]·[[pr]]로 추적된다 — [[tidd]]·[[llmops]]의 "프롬프트를 아티팩트로" 원칙이 여기서도 성립.

### 언제 쓰나
- 프로젝트를 시작하고 2~3세션 진행한 뒤 — 반복해서 설명하게 되는 내용을 여기로 빼내기
- 팀 신규 합류자 온보딩과 동시에 AI 온보딩 — 같은 문서가 둘 다에 쓰임
- 자주 틀리는 도메인 용어·네이밍 규칙을 AI에게 주입할 때
- [[tidd]]·[[review-mindset]]·[[testing]] 같은 규율을 전 세션에 강제하고 싶을 때
- `@path/to/other.md` 참조로 분리 — 메인 CLAUDE.md는 얇게, 상세는 서브 문서에

### 쉽게 빠지는 함정
- **길이 폭발** — CLAUDE.md가 수천 줄이 되면 토큰 예산을 잡아먹고 핵심이 묻힌다. 핵심 규칙만, 상세는 서브 문서로
- **"How"를 너무 많이 넣음** — [[intent]]에 맞게 Why/What/Not 중심. How는 코드에 맡기는 편이 유연
- **업데이트 안 함** — 6개월 전 규칙이 현재와 다르면 AI가 모순된 지시를 받고 헤맨다. 주기적으로 리뷰
- **보안 정보 포함** — CLAUDE.md는 `.git`에 들어간다. 시크릿·내부 URL·API 키는 절대 여기에
- **개인 취향을 팀 규칙으로** — "나는 탭을 좋아해"를 프로젝트 CLAUDE.md에 박으면 팀 전체가 따라야 함. 유저 전역 파일로

### 전형적 섹션
- **Project** — 한두 문장으로 이 프로젝트가 뭐인지
- **Commands** — 빌드·테스트·배포 명령 (AI가 기억할 필요 없게)
- **Architecture** — 주요 파일·패턴·의존관계
- **Conventions** — 스타일·네이밍·"하지 말 것"
- **Current focus** — 이번 시점의 초점 (VibeMap 스타일)

### 연결
[[cc-settings]]·[[cc-commands]]·[[cc-skills]]·[[cc-hooks]]와 함께 [[claude-code]] 커스터마이즈의 5요소. [[context-eng]] 관점에서는 "매 세션 자동 주입되는 계층 1 컨텍스트". [[intent]]·[[requirements]]의 상위 축을 문서화하는 자연스러운 자리. [[harness-eng]]에서 "정적 시스템 프롬프트의 프로젝트 버전"으로 볼 수 있으며, 본 VibeMap의 CLAUDE.md가 대표 사례(세 레이어 규칙, 현재 포커스, 하네스 섹션 등을 포함).

## en

CLAUDE.md is **a markdown file that plays the role of the project's "constitution."** Place it at the project root and [[claude-code]] auto-loads it into context every session. Code style, directory structure, don'ts, domain vocabulary, how to run things — everything you'd rather not re-explain goes here. Think of it as "onboarding your AI to the project."

It layers through three levels: `~/.claude/CLAUDE.md` (user-global) → `project/CLAUDE.md` (project default) → `project/subdir/CLAUDE.md` (local overrides). More specific rules win as you descend. Because it's in [[git]], **the whole team shares the same rules**, and history is tracked via [[pr]] — the "prompts as artifacts" principle of [[tidd]] and [[llmops]] lives here too.

### When to use
- After 2–3 sessions in a project — spot what you keep re-explaining and move it here
- Onboard a new hire and the AI simultaneously — the same doc serves both
- Inject domain vocabulary or naming conventions the AI keeps getting wrong
- Enforce disciplines like [[tidd]], [[review-mindset]], or [[testing]] across every session
- Split via `@path/to/other.md` references — keep the main CLAUDE.md thin and link out

### Common pitfalls
- **Runaway length** — a 5000-line CLAUDE.md eats the token budget and buries the essentials. Core rules stay; details move to sub-docs
- **Too much "how"** — per [[intent]], keep Why/What/Not at the center; leave How to the code, where it's flexible
- **Never updating it** — a six-month-old rule that contradicts reality gives the AI contradictory directives. Schedule reviews
- **Secrets in the file** — it's in `.git`. Never put credentials, internal URLs, or API keys
- **Personal preferences as team rules** — "I like tabs" in the project CLAUDE.md imposes it on everyone. Put those in user-global

### Typical sections
- **Project** — one or two sentences on what this is
- **Commands** — build/test/deploy commands (so the AI doesn't have to remember)
- **Architecture** — key files, patterns, dependencies
- **Conventions** — style, naming, "do not"
- **Current focus** — what matters right now (VibeMap style)

### How it connects
With [[cc-settings]], [[cc-commands]], [[cc-skills]], [[cc-hooks]], one of the five [[claude-code]] customization primitives. From a [[context-eng]] view, it's "tier-1 context auto-injected every session." A natural home for documenting [[intent]] and [[requirements]] at the project level. In [[harness-eng]] terms, it's "the project-scoped system prompt" — VibeMap's own CLAUDE.md (with the three-layer rule, current focus, and harness section) is a working example.

## ja

CLAUDE.mdは**プロジェクトの「憲法」役のマークダウンファイル**。プロジェクトルートに置けば[[claude-code]]が毎セッション自動で読んでコンテキストに載せる。コーディングスタイル、ディレクトリ構成、やってはいけないこと、ドメイン用語、実行方法 — 毎回説明したくないことをこの一枚にまとめる。「AIにプロジェクトをオンボーディングする文書」と思えばよい。

三層で継承される。`~/.claude/CLAUDE.md`(ユーザー全体) → `プロジェクト/CLAUDE.md`(プロジェクト既定) → `プロジェクト/サブディレクトリ/CLAUDE.md`(ローカル上書き)。下に行くほど具体的なルール。[[git]]にコミットされるので**チーム全員が同じルールを共有**し、変更履歴も[[pr]]で追える — [[tidd]]・[[llmops]]の「プロンプトをアーティファクトに」原則がここでも成立する。

### いつ使うか
- プロジェクトを2〜3セッション進めた後 — 繰り返し説明する内容をここに抜く
- 新規メンバーのオンボーディングと同時にAIをオンボーディング — 同じ文書が両方に効く
- AIがよく間違えるドメイン用語・命名規則を注入するとき
- [[tidd]]・[[review-mindset]]・[[testing]]のような規律を全セッションに強制したいとき
- `@path/to/other.md`参照で分割 — メインは薄く、詳細はサブ文書に

### はまりやすい罠
- **長さ暴走** — CLAUDE.mdが数千行になるとトークン予算を食い、核心が埋もれる。核だけここ、詳細はサブに
- **「How」を入れすぎ** — [[intent]]に合わせWhy/What/Not中心。Howはコード側が柔軟
- **更新しない** — 6ヶ月前のルールが現状と違えばAIは矛盾指示を受ける。定期レビュー
- **機密情報の混入** — CLAUDE.mdは`.git`に入る。シークレット・内部URL・APIキーは絶対ここに書かない
- **個人嗜好をチームルールに** — 「私はタブが好き」をプロジェクトCLAUDE.mdに焼くとチーム全員が従う羽目に。ユーザー全体ファイルへ

### 典型セクション
- **Project** — 一二文でこれは何か
- **Commands** — ビルド・テスト・デプロイコマンド(AIに覚えさせない)
- **Architecture** — 主要ファイル・パターン・依存
- **Conventions** — スタイル・命名・「禁止」
- **Current focus** — 今時点の焦点(VibeMap方式)

### 繋がり
[[cc-settings]]・[[cc-commands]]・[[cc-skills]]・[[cc-hooks]]と並ぶ[[claude-code]]カスタマイズの5要素。[[context-eng]]視点では「毎セッション自動注入される第一階層コンテキスト」。[[intent]]・[[requirements]]の上位軸を文書化する自然な場所。[[harness-eng]]では「静的システムプロンプトのプロジェクト版」と言え、本VibeMapのCLAUDE.md(三層規則、現在の焦点、ハーネスセクション等)が代表例。

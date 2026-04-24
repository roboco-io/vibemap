---
id: cc-skills
cat: ai
size: 3
title:
  ko: Claude Code 스킬
  en: Claude Code Skills
  ja: Claude Codeスキル
refs:
  - url: https://docs.claude.com/en/docs/claude-code/skills
    title: Skills (Anthropic Docs)
    lang: en
  - url: https://www.anthropic.com/news/agent-skills
    title: Introducing Agent Skills — Anthropic
    lang: en
extraEdges: []
---

## ko

Claude Code 스킬은 **"재사용 가능한 작업 능력 꾸러미"**다. `.claude/skills/이름/SKILL.md`에 프롬프트·체크리스트·참조 파일들을 묶어 두면, 사용자가 명시적으로 부르지 않아도 *맥락이 맞을 때 자동으로* 활성화된다. "PDF 처리 필요한 작업이네" → PDF 스킬이 스스로 관여, "VibeMap 노드 추가네" → `vibemap-add-node` 스킬이 스스로 관여. 매번 긴 설명을 붙이지 않고 "방법론 자체"를 재사용하는 것이 본질.

핵심 필드는 `name`(식별자)와 `description`(*언제 발동되어야 하는지*를 서술). description이 스킬의 "자석" — 모델이 이 문장을 읽고 현재 요청과 맞는지 판단해 활성화한다. 본문에는 체크리스트·템플릿·참조 파일이 들어가고, `references/` 서브디렉토리로 예시를 같이 둘 수 있다. [[cc-commands]]와 쌍을 이룬다 — 커맨드는 *사용자 명시 호출*, 스킬은 *문맥 자동 발동*.

### 언제 쓰나
- 반복되는 다단계 워크플로우를 코드화 — VibeMap의 `vibemap-add-node`·`vibemap-migrate-legacy`가 대표 예
- 팀 공통 절차를 AI에 주입 — 온보딩, 인시던트 대응, 릴리스 체크리스트
- 특정 데이터 형식·파일 타입 처리 — PDF·Excel·YAML 파서 스킬
- [[harness-eng]] 관점에서 "도메인 특화 미니 하네스"
- 스킬 내 체크리스트는 `TaskCreate` 항목으로 자동 변환 — 진행 상황 가시화

### 쉽게 빠지는 함정
- **`description`이 모호하면 발동 안 됨** — "useful tool"로는 매칭이 안 된다. "X를 요청받았을 때" 같이 구체적 트리거를 넣기
- **중복 스킬의 충돌** — 두 스킬이 같은 맥락에서 둘 다 발동하면 모델이 혼란. 경계를 명확히 나누기
- **`allowed-tools` 생략** — 스킬이 모든 도구를 쓸 수 있으면 권한 최소화 원칙에 어긋남
- **한 번만 쓰는 작업까지 스킬화** — 두 번 이상 반복될 때 스킬. 한 번은 [[cc-commands]]가 낫다
- **스킬 간 순환 호출** — 스킬이 다른 스킬을 *호출*하는 건 지원되지만 너무 깊어지면 컨텍스트가 폭발
- **문서 업데이트 누락** — 스킬 내부 절차가 바뀌었는데 SKILL.md는 그대로면 AI가 옛 방식을 따름

### 구조 예시
- `name`, `description` 상단 frontmatter
- 본문: 파이프라인 다이어그램, 단계별 설명, 금지 사항, 품질 바
- `references/` 안에 템플릿·완성 예시
- 필요 시 `$ARGUMENTS`로 외부 인자 받기

### 연결
[[cc-commands]]·[[cc-hooks]]·[[cc-rules]]·[[cc-settings]]의 한 요소. [[claude-code]]를 조직에 맞게 형상화하는 가장 표현력 높은 수단. [[harness-eng]]이 "루프 레이어"라면 스킬은 "도메인 루틴의 책장" — 원하는 루틴을 모델이 꺼내 쓴다. 본 VibeMap의 `vibemap-add-node`·`vibemap-migrate-legacy`가 실사례.

## en

Claude Code skills are **"reusable bundles of work capabilities."** Drop prompts, checklists, and reference files into `.claude/skills/NAME/SKILL.md` and it activates *automatically when the context matches* — the user doesn't have to invoke it by name. "Oh, a PDF processing task" → the PDF skill engages; "adding a VibeMap node" → the `vibemap-add-node` skill engages. The point is to reuse a *methodology* without re-explaining it every time.

The key fields are `name` (identifier) and `description` (when this should fire). The description is the skill's magnet — the model reads it and decides whether the current request matches. The body holds the checklist, templates, and reference files; a `references/` subdirectory can carry examples. Skills pair with [[cc-commands]]: commands are *user-invoked*; skills are *context-activated*.

### When to use
- Codifying repeated multi-step workflows — VibeMap's `vibemap-add-node` and `vibemap-migrate-legacy` are working examples
- Shared team procedures — onboarding, incident response, release checklists
- Handling specific data or file types — PDF, Excel, YAML parsers
- A "domain-specialized mini-harness," in [[harness-eng]] terms
- Checklists inside a skill auto-convert to TaskCreate entries for visible progress

### Common pitfalls
- **Vague `description` → no activation** — "useful tool" matches nothing. Write concrete triggers: "when the user asks to X"
- **Skill collision** — two skills firing on the same context confuses the model. Carve clear boundaries
- **No `allowed-tools`** — skills that can use any tool violate least-privilege
- **Over-skilling one-offs** — make it a skill only when it repeats. One-shot work fits [[cc-commands]] better
- **Skill-to-skill recursion** — supported but depth blows up the context. Keep shallow
- **Stale docs** — if internal procedure changed but SKILL.md didn't, the AI runs the old playbook

### Structure example
- `name` and `description` in top frontmatter
- Body: pipeline diagram, step-by-step, prohibitions, quality bar
- `references/` subdirectory for templates and worked examples
- Accept external input via `$ARGUMENTS` if parameterized

### How it connects
One of the pieces alongside [[cc-commands]], [[cc-hooks]], [[cc-rules]], [[cc-settings]]. The highest-expressiveness way to shape [[claude-code]] to an organization. If [[harness-eng]] is the "loop layer," skills are the "bookshelf of domain routines" the model pulls from. VibeMap's `vibemap-add-node` and `vibemap-migrate-legacy` are real-world examples.

## ja

Claude Codeスキルは**「再利用可能な作業能力のバンドル」**。`.claude/skills/名前/SKILL.md`にプロンプト・チェックリスト・参照ファイルをまとめて置けば、ユーザーが明示呼び出ししなくても*文脈が合えば自動的に*発動する。「PDF処理が必要な仕事だね」→ PDFスキルが自分から関わり、「VibeMapノード追加だね」→ `vibemap-add-node`スキルが自分から関わる。毎回長説明を付けず「方法論そのもの」を再利用するのが本質。

主要フィールドは`name`(識別子)と`description`(*いつ発動すべきか*を記述)。descriptionがスキルの「磁石」 — モデルがこれを読んで現在の要求とマッチするか判定し起動する。本文はチェックリスト・テンプレート・参照ファイルが入り、`references/`サブディレクトリに例を置ける。[[cc-commands]]と対になる — コマンドは*ユーザー明示呼び出し*、スキルは*文脈自動発動*。

### いつ使うか
- 繰り返す多段ワークフローをコード化 — VibeMapの`vibemap-add-node`・`vibemap-migrate-legacy`が代表例
- チーム共通手順をAIに注入 — オンボーディング、インシデント対応、リリースチェックリスト
- 特定データ形式・ファイルタイプの処理 — PDF・Excel・YAMLパーサースキル
- [[harness-eng]]視点で「ドメイン特化ミニハーネス」
- スキル内チェックリストはTaskCreate項目に自動変換 — 進捗の可視化

### はまりやすい罠
- **`description`が曖昧だと発動しない** — "useful tool"ではマッチしない。「Xを要求されたとき」など具体的トリガを入れる
- **スキル衝突** — 二つのスキルが同じ文脈で同時発動するとモデルが混乱。境界を明確に
- **`allowed-tools`省略** — スキルが任意ツールを使えると最小権限原則に反する
- **一度しか使わない作業までスキル化** — 二回以上繰り返すならスキル。一度なら[[cc-commands]]の方が合う
- **スキル間の循環呼び出し** — 対応されているが深すぎるとコンテキストが爆発
- **ドキュメント更新漏れ** — 内部手順が変わったのにSKILL.mdが古いままだとAIが旧方式を踏襲

### 構造例
- `name`, `description`を冒頭フロントマターに
- 本文: パイプライン図、段階別説明、禁止事項、品質バー
- `references/`にテンプレや完成例
- 必要なら`$ARGUMENTS`で外部引数

### 繋がり
[[cc-commands]]・[[cc-hooks]]・[[cc-rules]]・[[cc-settings]]の一要素。[[claude-code]]を組織に合わせて形作る最も表現力の高い手段。[[harness-eng]]が「ループ層」なら、スキルは「ドメインルーチンの本棚」 — モデルが必要なルーチンを棚から取る。本VibeMapの`vibemap-add-node`・`vibemap-migrate-legacy`が実事例。

---
id: docs
cat: mindset
size: 2
title:
  ko: 문서화
  en: Documentation
  ja: ドキュメンテーション
refs:
  - url: https://adr.github.io/madr/
    title: MADR — Markdown Architectural Decision Records
    lang: en
  - url: https://iacli.com/articles/reconsidering-documentation-in-the-era-of-ai-assisted-coding
    title: Reconsidering Documentation in the Era of AI-Assisted Coding (IaCLI Labs)
    lang: en
  - url: https://medium.com/insiderengineering/managing-markdown-as-data-the-silent-crisis-of-documentation-in-the-ai-era-f2c162abf147
    title: Managing Markdown as Data — The Silent Crisis of Documentation in the AI Era (Insider Engineering)
    lang: en
extraEdges: []
---

## ko

**"Code says what; docs say why."** — 코드가 동작 방식을 말한다면, 문서는 그 코드가 *왜 그래야만 했는지*를 말한다. 바이브 코딩 시대에 문서는 더 이상 사후 정리물이 아니라, 사람과 AI가 같은 맥락 위에서 일하기 위한 *입력*이다.

[[vibe]] 코딩에서 LLM은 가장 먼저 README와 CLAUDE.md를 읽는다. 문서 품질이 곧 AI 산출물의 품질이 되는 셈. [[context-eng]]의 출발점도, [[hallucination]] 감소의 가장 큰 지렛대도 결국 *명확하게 쓰여진 문서*다. [[intent]]가 "왜 이걸 만드는가"를, [[requirements]]가 "무엇이 충족돼야 하는가"를 답한다면, 문서화는 그 답들을 시간 너머로 **보존**하는 행위다.

### 무엇을 문서화하나

- **ADR (Architecture Decision Record)** — 한 결정 = 한 마크다운 파일. 왜 이 선택이었는지·어떤 대안을 검토했는지·어떤 제약이 있었는지를 *append-only*로 보존. 결정이 뒤집혀도 옛 ADR은 지우지 않고 "Superseded by ADR-N"으로 잇는다
- **커밋 메시지 / PR 본문 / 이슈** — 변경 *그 자체*가 아니라 변경의 *동기*를 적는다. 코드와 같이 git에 박히기 때문에 영구 기록
- **README / CLAUDE.md / AGENTS.md** — 프로젝트 진입점. 인간 신규 입사자와 AI 에이전트의 첫 컨텍스트. 한 번 쓰고 잊으면 *문서가 거짓말쟁이*가 된다 ([[llm-wiki]] 참고)
- **도메인 용어 사전 / 스펙** — [[domain]] 지식과 비즈니스 룰. 코드만 봐서는 알 수 없는 "왜 이 함수가 0이 아닌 1로 시작하는가" 같은 맥락

### 왜 마크다운인가

마크다운은 *코드와 같은 toolchain*에 들어간다 — diff·리뷰·머지 대상이 된다는 뜻. PDF나 외부 위키 페이지는 [[git]]에서 떨어져 나가 곧 stale해지지만, `docs/adr/0042-use-rds-not-aurora.md`는 [[pr]] 단계에서 리뷰되고 [[github]]에서 검색된다. *문서가 코드와 함께 진화한다*는 것이 docs-as-code의 핵심.

### 쉽게 빠지는 함정

- **Stale docs (context rot)** — 코드는 바뀌었는데 문서는 그대로. 없는 것보다 *나쁜* 상태. AI에게 잘못된 컨텍스트를 먹이면 자신만만하게 환각한다
- **What 만 쓰고 Why 빠짐** — 코드를 읽으면 알 수 있는 것을 다시 적는 문서. 가치는 *왜*에 있다
- **한 번에 모든 것을 담은 거대한 README** — LLM은 긴 문서의 중간을 무시한다 ("lost in the middle"). 짧고 분할된 페이지가 더 잘 읽힌다
- **사후 작성 습관** — 기능 머지 후 "나중에 정리"하면 영영 안 한다. PR과 같은 diff 안에 ADR을 넣는 규칙이 유일한 안전망
- **고립 페이지 / 깨진 링크** — 어디서도 참조되지 않는 문서는 곧 잊혀지고, 깨진 wiki-link는 신뢰를 갉아먹는다

### 연결

[[intent]]와 [[requirements]]의 산출물을 시간 너머로 잇는 매개. [[git]]·[[github]]·[[pr]]은 문서를 코드와 같은 라이프사이클에 태운다. [[review-mindset]]은 PR 본문을 *문서로* 다루게 하고, [[refactor]] 시 ADR을 남기는 습관이 미래의 [[debug]]를 절반으로 줄인다. AI 협업 관점에서는 [[claude-code]]·[[llm-wiki]]·[[context-eng]]의 가장 핵심적인 입력이며, [[small-steps]]마다 한 줄씩 적는 리듬이 곧 [[harness-eng]]를 만든다.

## en

**"Code says what; docs say why."** Code describes how it works; documentation describes *why it had to be that way*. In the vibe-coding era, docs are no longer a post-hoc cleanup — they are the *input* humans and AI share to work from the same context.

In [[vibe]] coding, the LLM reads README and CLAUDE.md before anything else. Doc quality becomes AI output quality. The biggest lever for [[context-eng]] and the most effective mitigation for [[hallucination]] is, in the end, *clearly written documentation*. Where [[intent]] answers "why are we building this" and [[requirements]] answer "what must be true", documentation **preserves** those answers across time.

### What to document

- **ADR (Architecture Decision Record)** — one decision per markdown file. Why this choice, what alternatives were weighed, what constraints applied — kept *append-only*. When a decision flips, you don't delete the old ADR; you link "Superseded by ADR-N"
- **Commit messages / PR descriptions / issues** — write the *motivation*, not the change itself. They live in git, so they're a permanent record
- **README / CLAUDE.md / AGENTS.md** — project entry points. The first context a new hire *and* an AI agent see. Write once and forget, and *the doc becomes the liar* (see [[llm-wiki]])
- **Domain glossary / spec** — [[domain]] knowledge and business rules. The "why does this function start at 1, not 0?" context that code alone cannot carry

### Why markdown

Markdown enters the *same toolchain as code* — it gets diffed, reviewed, merged. A PDF or an external wiki page drifts away from [[git]] and goes stale; `docs/adr/0042-use-rds-not-aurora.md` is reviewed in the [[pr]] and searchable on [[github]]. The point of docs-as-code is precisely that *docs evolve alongside the code*.

### Common pitfalls

- **Stale docs (context rot)** — code changed, docs didn't. *Worse* than no docs. Feed the wrong context to an AI and it hallucinates with full confidence
- **What without why** — restating what the code already says. The value is in *why*
- **The giant catch-all README** — LLMs ignore the middle of long docs ("lost in the middle"). Short, split pages read better
- **The "I'll write it later" habit** — write it after merge and you never will. Requiring the ADR in the *same diff* as the change is the only safety net
- **Orphan pages / broken links** — a page nothing links to is forgotten; a broken wiki-link erodes trust

### How it connects

The medium that carries [[intent]] and [[requirements]] across time. [[git]], [[github]], and [[pr]] put docs on the same lifecycle as code. [[review-mindset]] treats the PR body *as documentation*; leaving an ADR during [[refactor]] halves the future [[debug]] cost. From the AI-collaboration angle, docs are the most critical input to [[claude-code]], [[llm-wiki]], and [[context-eng]]; the rhythm of writing one line per [[small-steps]] is what builds a real [[harness-eng]].

## ja

**「Code says what; docs say why.」** — コードが*どう動くか*を語るなら、文書はそのコードが*なぜそうあらねばならなかったか*を語る。バイブコーディング時代、文書はもはや事後の片付けではなく、人とAIが同じ文脈で働くための*入力*だ。

[[vibe]]コーディングでLLMはまずREADMEとCLAUDE.mdを読む。文書の品質がそのままAI出力の品質になる。[[context-eng]]の出発点も、[[hallucination]]を抑える最大の梃子も、結局は*明確に書かれた文書*だ。[[intent]]が「なぜ作るか」、[[requirements]]が「何が満たされるべきか」に答えるなら、文書化はその答えを*時間を超えて***保存**する行為。

### 何を文書化するか

- **ADR (Architecture Decision Record)** — 一決定 = 一マークダウンファイル。なぜこの選択か、どんな代案を検討したか、どんな制約があったかを*append-only*で残す。決定が覆っても古いADRは消さず「Superseded by ADR-N」でつなぐ
- **コミットメッセージ / PR本文 / Issue** — 変更*そのもの*ではなく変更の*動機*を書く。gitに焼き付くので永久記録
- **README / CLAUDE.md / AGENTS.md** — プロジェクトの入口。新メンバーとAIエージェント双方の最初の文脈。一度書いて忘れると*文書が嘘つき*になる([[llm-wiki]]参照)
- **ドメイン用語集 / 仕様書** — [[domain]]知識とビジネスルール。「なぜこの関数は0でなく1から始まるのか」のような、コードだけでは運べない文脈

### なぜマークダウンか

マークダウンは*コードと同じtoolchain*に乗る — diff・レビュー・マージの対象になる。PDFや外部wikiページは[[git]]から離れてすぐにstaleになるが、`docs/adr/0042-use-rds-not-aurora.md`は[[pr]]でレビューされ[[github]]で検索される。docs-as-codeの肝は、*文書がコードと共に進化する*こと。

### はまりやすい罠

- **Stale docs (context rot)** — コードは変わったが文書は古いまま。文書がない状態より*悪い*。誤った文脈をAIに食わせれば自信満々に幻覚する
- **WhatだけあってWhyがない** — コードを読めば分かることを再記述するだけの文書。価値は*なぜ*にある
- **すべてを詰め込んだ巨大なREADME** — LLMは長文書の中間を無視する(「lost in the middle」)。短く分割された方が読まれる
- **「あとで書く」習慣** — マージ後に「あとで」と思うと永遠に書かない。変更と*同じdiff*でADRを要求するのが唯一の安全網
- **孤立ページ / 壊れたリンク** — どこからもリンクされない文書は忘れられ、壊れたwiki-linkは信頼を侵食する

### 繋がり

[[intent]]と[[requirements]]の成果を時間を超えて運ぶ媒体。[[git]]・[[github]]・[[pr]]が文書をコードと同じライフサイクルに乗せる。[[review-mindset]]はPR本文を*文書として*扱わせ、[[refactor]]時にADRを残す習慣が将来の[[debug]]を半減させる。AI協業の観点では文書こそ[[claude-code]]・[[llm-wiki]]・[[context-eng]]の最重要入力であり、[[small-steps]]ごとに一行ずつ書くリズムが本物の[[harness-eng]]を築く。

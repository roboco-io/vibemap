---
id: llm-wiki
cat: mindset
size: 2
title:
  ko: LLM Wiki
  en: LLM Wiki
  ja: LLM Wiki
refs:
  - url: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
    title: LLM Wiki — Andrej Karpathy (GitHub Gist)
    lang: en
  - url: https://help.obsidian.md/Linking+notes+and+files/Internal+links
    title: Obsidian — Internal links / Wiki-link syntax
    lang: en
  - url: https://www.mindstudio.ai/blog/karpathy-llm-wiki-knowledge-base-pattern/
    title: The Karpathy LLM Wiki pattern (MindStudio)
    lang: en
extraEdges: []
---

## ko

LLM Wiki는 **"원본 문서를 LLM이 *컴파일*해 교차참조 마크다운 위키로 누적시키는 지식관리 패턴"**이다. RAG가 *질의 시점*에 매번 검색해 합치는 방식이라면, LLM Wiki는 *수집 시점*에 한 번 정리해 두고 이후 세션이 그 위키를 항행한다. 2026년 초 Andrej Karpathy의 짧은 노트(GitHub Gist)가 도화선이 됐고, "vector DB 없이도 잘 된다 — 사실 더 잘 된다"는 실험 보고가 줄지어 나오며 [[context-eng]]의 한 갈래로 굳어졌다.

세 레이어로 본다. **Raw** — 원본(스펙, ADR, 회의록, 블로그 글). 절대 수정 안 함. **Wiki** — LLM이 만들고 유지하는 마크다운 페이지 묶음. `[[ ... ]]`로 서로 참조. **Schema** — LLM에게 "이 위키를 어떻게 운영할지" 지시하는 문서(보통 CLAUDE.md). 이 셋이 분리되면 *원본 손실 없이* 위키는 시간을 따라 쌓이고, 모순은 표시되고, 새 사실이 들어와도 기존 페이지에 자연스럽게 통합된다.

VibeMap 자체가 이 패턴의 작은 사례다. `raw/nodes/*.md`(원본) → `scripts/compile-nodes.mjs`(컴파일) → `docs/data.js`·`docs/nodes.json`(위키). [[ ... ]] 문법은 Obsidian 호환. AI 시대의 "[[two-pizza-team]] + LLM Wiki"가 흔한 조합이 된 이유 — 작은 팀이 *기관 기억*을 LLM과 공유하며 일한다.

### 언제 쓰나
- 프로젝트 문서가 누적·진화하며 *세션 간 일관성*이 필요할 때 — 매번 처음부터 RAG로 검색하는 것보다 효율적
- [[claude-code]]·[[ai-coding-tools]]가 같은 프로젝트를 반복 방문 — CLAUDE.md가 위키의 schema 레이어가 됨
- 팀 온보딩과 AI 온보딩을 *같은 문서*로 처리하고 싶을 때
- [[hallucination]] 줄이기 — 모델이 *근거 있는 페이지*를 인용해 답하도록 유도
- [[tidd]]·[[intent]]·[[requirements]] 문서가 흩어져 있을 때 — wiki가 통합 지점

### 쉽게 빠지는 함정
- **Raw와 Wiki 동기화 누락** — 원본이 갱신됐는데 위키가 옛 주장을 유지하면 위키가 거짓말쟁이. 주기적 *린트* 작업(모순·중복·고립 페이지 점검)이 필수
- **고립 페이지(orphan)** — 어디서도 링크 안 받는 페이지가 쌓인다. inbound link 0인 페이지를 정기 검사
- **Over-compile로 디테일 손실** — 위키는 *큐레이션 합성물*이지 *원본 대체물*이 아니다. 원본은 항상 immutable & queryable로 남겨야
- **Schema 정체** — CLAUDE.md를 한 번 쓰고 안 고치면 도메인 진화에 따라 위키가 일관성을 잃는다. Schema도 살아있는 문서
- **위키만 의존** — 위키는 *입구*일 뿐. 깊은 질문은 결국 원본을 다시 읽어야. AI에게도 "위키 우선, 원본은 백업"으로 지시
- **Vector DB와 양립 안 시킴** — 작은~중간 규모는 plain markdown이 더 빠르고 정확. 진짜 큰 코퍼스에선 둘을 결합(하이브리드 검색)

### VibeMap의 LLM Wiki 구현
- `raw/nodes/*.md` — 사람이 쓰는 SSOT
- `compile-nodes.mjs` — 마크다운 서브셋 검증 + 그래프 유도
- `docs/nodes.json` — 위키의 직렬화 결과
- `[[ ... ]]` — 노드 간 자동 edge 생성
- 같은 패턴을 다른 프로젝트로도 옮길 수 있게 [[harness-eng]]에 박아둘 수 있음

### 연결
[[context-eng]]의 핵심 응용이자 [[hallucination]]의 가장 효과적인 완화책 중 하나. [[claude-code]]·[[ai-coding-tools]]·[[harness-eng]]가 위키를 *읽고 쓰는* 도구. [[intent]]·[[requirements]]·[[tidd]]가 raw 자료의 주요 출처. [[two-pizza-team]] + LLM Wiki = 적은 인원이 큰 영역을 *지식 자산*으로 끌고 가는 조합. [[llmops]] 관점에서 위키 자체의 품질·갱신 빈도가 새로운 운영 지표.

## en

LLM Wiki is **"the knowledge-management pattern where raw documents are *compiled* by an LLM into a cross-referenced markdown wiki that compounds over time."** Where RAG re-retrieves and synthesizes at *query time*, LLM Wiki curates once at *ingest time* and lets future sessions navigate the wiki itself. Andrej Karpathy's short gist in early 2026 set it off; reports of "works without a vector DB — actually works *better*" piled up, and the pattern crystallized as a branch of [[context-eng]].

Three layers hold it together. **Raw** — original sources (specs, ADRs, meeting notes, blog posts). Never modified. **Wiki** — LLM-authored and -maintained markdown pages, cross-linked via `[[ ... ]]`. **Schema** — the document that tells the LLM how to run this wiki (usually CLAUDE.md). With those three separated, the wiki *compounds* across time without losing the originals; contradictions are surfaced, and new facts integrate into existing pages naturally.

VibeMap itself is a small instance of this pattern. `raw/nodes/*.md` (raw) → `scripts/compile-nodes.mjs` (compile) → `docs/data.js` and `docs/nodes.json` (wiki). The `[[ ... ]]` syntax is Obsidian-compatible. The "[[two-pizza-team]] + LLM Wiki" combo is becoming common in the AI era — small teams keep *institutional memory* shared with their LLM.

### When to use
- Project docs are accumulating and evolving, and you need *cross-session consistency* — beats fetching from raw via RAG every time
- [[claude-code]] / [[ai-coding-tools]] revisit the same project repeatedly — your CLAUDE.md becomes the wiki's schema layer
- You want to onboard humans and AI agents from the *same* document set
- Reducing [[hallucination]] — by guiding the model to cite *grounded pages*, not invent
- [[tidd]], [[intent]], [[requirements]] docs are scattered — the wiki becomes the unifying entry point

### Common pitfalls
- **Raw / wiki drift** — raw was updated, wiki kept the old claim, now the wiki lies. Periodic *lint* passes (contradictions, duplicates, orphans) are non-negotiable
- **Orphan pages** — pages with no inbound links accumulate quietly. Inspect zero-inbound pages regularly
- **Over-compilation losing nuance** — the wiki is *curated synthesis*, not a replacement. Raw must remain immutable and queryable
- **Stagnant schema** — if CLAUDE.md never updates as the domain evolves, the wiki gradually loses consistency. Treat the schema as a living document
- **Wiki-only dependency** — the wiki is the *front door*; deep questions still hit the raw. Tell the AI: "wiki first, raw as backup"
- **Refusing to combine with vector DBs** — at small/medium scale plain markdown is faster and more accurate, but at very large corpus scale a hybrid (markdown wiki + vector index) wins

### VibeMap's LLM Wiki implementation
- `raw/nodes/*.md` — human-edited SSOT
- `compile-nodes.mjs` — strict markdown-subset validator + edge derivation
- `docs/nodes.json` — serialized wiki output
- `[[ ... ]]` — automatic edge creation between nodes
- The same pattern can ride on top of [[harness-eng]] to portably move it between projects

### How it connects
A core application of [[context-eng]] and one of the most effective [[hallucination]] mitigations available. [[claude-code]], [[ai-coding-tools]], and [[harness-eng]] are the tools that *read and write* the wiki. [[intent]], [[requirements]], and [[tidd]] are common raw-source feeders. The combination of [[two-pizza-team]] and LLM Wiki = a small team scaling its surface as a *knowledge asset*. From the [[llmops]] view, wiki quality and refresh cadence become new operational metrics.

## ja

LLM Wikiは**「原本ドキュメントをLLMが*コンパイル*し、相互参照マークダウンwikiとして累積させる知識管理パターン」**。RAGが*問い合わせ時*に毎回検索して合成するのに対し、LLM Wikiは*収集時*に一度整理しておき、以降のセッションがそのwikiを航行する。2026年初頭のAndrej Karpathyの短いノート(GitHub Gist)が起爆剤となり、「ベクターDBなしでもうまくいく — 実はその方が良い」という実験報告が相次ぎ、[[context-eng]]の一支流として定着した。

三層で考える。**Raw** —— 原本(仕様、ADR、議事録、ブログ記事)。絶対に修正しない。**Wiki** —— LLMが作って維持するマークダウンページ群。`[[ ... ]]`で互いを参照。**Schema** —— LLMに「このwikiをどう運用するか」を伝える文書(通常はCLAUDE.md)。この三つが分離されていれば、原本を失わずにwikiは時間と共に積もり、矛盾は浮かび上がり、新しい事実は既存ページに自然に統合される。

VibeMap自体がこのパターンの小さな実例だ。`raw/nodes/*.md`(原本) → `scripts/compile-nodes.mjs`(コンパイル) → `docs/data.js`・`docs/nodes.json`(wiki)。`[[ ... ]]`構文はObsidian互換。AI時代に「[[two-pizza-team]] + LLM Wiki」が一般的になった理由 —— 小さなチームが*組織記憶*をLLMと共有しながら働く。

### いつ使うか
- プロジェクト文書が累積・進化し、*セッション間の一貫性*が必要なとき —— 毎回RAGで原本を検索するより効率的
- [[claude-code]]・[[ai-coding-tools]]が同じプロジェクトを繰り返し訪れる —— CLAUDE.mdがwikiのschema層になる
- 人とAIエージェントのオンボーディングを*同じ文書*でこなしたいとき
- [[hallucination]]の削減 —— モデルに*根拠あるページ*を引用させて答えさせる
- [[tidd]]・[[intent]]・[[requirements]]の文書が散らばっているとき —— wikiが統合の入り口になる

### はまりやすい罠
- **RawとWikiの同期漏れ** —— 原本が更新されたのにwikiが古い主張を持ち続ければ、wikiが嘘をつくことに。定期的な*lint*作業(矛盾・重複・孤立ページ点検)は必須
- **孤立ページ(orphan)** —— inbound linkゼロのページが溜まる。定期的に検査
- **Over-compileで細部喪失** —— wikiは*キュレートされた合成物*であって*原本の代替*ではない。原本は常にimmutable & queryableに
- **Schemaの停滞** —— CLAUDE.mdを書きっぱなしにすると、ドメインの進化につれwikiが一貫性を失う。Schemaも生きた文書として扱う
- **Wikiのみ依存** —— wikiは*入口*にすぎない。深い問いは結局原本に戻る。AIにも「wiki優先、原本はバックアップ」と指示
- **Vector DBと両立させない** —— 小〜中規模ならplain markdownの方が速く正確。本当に巨大なコーパスでは両者を結合(ハイブリッド検索)するのが勝つ

### VibeMapのLLM Wiki実装
- `raw/nodes/*.md` —— 人が編集するSSOT
- `compile-nodes.mjs` —— マークダウンサブセット検証 + グラフ導出
- `docs/nodes.json` —— wikiの直列化結果
- `[[ ... ]]` —— ノード間の自動エッジ生成
- 同じパターンを他プロジェクトに移植できるよう[[harness-eng]]に焼き込める

### 繋がり
[[context-eng]]の中核応用であり、[[hallucination]]の最も効果的な緩和策の一つ。[[claude-code]]・[[ai-coding-tools]]・[[harness-eng]]がwikiを*読み書きする*道具。[[intent]]・[[requirements]]・[[tidd]]がraw資料の主な供給源。[[two-pizza-team]] + LLM Wiki = 少人数が広い領域を*知識資産*として持ち運ぶ組合せ。[[llmops]]の観点では、wiki自体の品質と更新頻度が新たな運用指標になる。

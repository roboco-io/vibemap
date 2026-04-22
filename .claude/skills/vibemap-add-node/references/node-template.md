# Node template

Copy-paste into `raw/nodes/<id>.md`, replace `{{placeholders}}`, then delete this comment block.

```markdown
---
id: {{lowercase-dashed-id}}
cat: {{core|mindset|ai|tool|tech|data|ops}}
size: {{1|2|3}}
title:
  ko: {{한국어 타이틀}}
  en: {{English title}}
  ja: {{日本語タイトル}}
refs:
  - url: https://{{official-docs-url}}
    title: {{Concise source title (can include "AWS Docs" suffix etc.)}}
    lang: {{en|ko|ja|other}}
extraEdges: []
---

## ko

한 문장 본질 — {{무엇인가}}. [[인접-노드-id]]와 비교하면... {{차이 요약}}.

{{한 단락 — 맥락, 일반적인 오해, 비유 하나}}.

### 언제 쓰나
- {{케이스 1}} — [[관련-노드]]와 함께 사용
- {{케이스 2}}
- {{케이스 3}}

### 주의할 점
- {{핀트 1}}
- {{핀트 2 — [[cost]]/[[monitoring]]과 연결}}

## en

One-line essence — {{what it is}}. Compared to [[adjacent-node-id]], {{difference summary}}.

{{One paragraph — context, common misconception, one analogy}}.

### When to use
- {{Case 1}} — paired with [[related-node]]
- {{Case 2}}
- {{Case 3}}

### Watch out
- {{Pitfall 1}}
- {{Pitfall 2 — link to [[cost]] / [[monitoring]]}}

## ja

一言で本質 — {{これは何か}}。[[隣接ノードid]]と比べると...{{差分の要約}}。

{{1段落 — 文脈、よくある誤解、例え一つ}}。

### いつ使うか
- {{ケース1}} — [[関連ノード]]と組み合わせる
- {{ケース2}}
- {{ケース3}}

### 注意点
- {{落とし穴1}}
- {{落とし穴2 — [[cost]]・[[monitoring]]との関連}}
```

## Checklist before saving

- [ ] frontmatter has all required fields (id/cat/size/title.ko/en/ja)
- [ ] at least one ref with http(s) URL
- [ ] each `##` section is 150-400 words
- [ ] at least 3 distinct `[[wiki-link]]` ids across the body
- [ ] no triple-backtick code blocks, tables, images, raw HTML, or `## h2` within a language section
- [ ] id is unique (not in `legacy-nodes.js` or `raw/nodes/*.md`, unless you are intentionally migrating)

# Graph Report - ./raw  (2026-04-22)

## Corpus Check
- Corpus is ~1,081 words - fits in a single context window. You may not need a graph.

## Summary
- 26 nodes · 31 edges · 5 communities detected
- Extraction: 81% EXTRACTED · 19% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.75)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_LLM non-determinism & convergence|LLM non-determinism & convergence]]
- [[_COMMUNITY_Intent Document structure|Intent Document structure]]
- [[_COMMUNITY_Vibe Coding pipeline|Vibe Coding pipeline]]
- [[_COMMUNITY_Intent Engineering principles|Intent Engineering principles]]
- [[_COMMUNITY_Intent lifecycle|Intent lifecycle]]

## God Nodes (most connected - your core abstractions)
1. `Intent Document (Why/What/Not/Learnings)` - 8 edges
2. `Intent Engineering (roboco.io)` - 5 edges
3. `Ship intent, not code` - 5 edges
4. `The Art of Vibe Coding (roboco.io)` - 5 edges
5. `Convergence (수렴) as trust model` - 4 edges
6. `Intent Lifecycle (seed->exploring->clarified->build/killed)` - 3 edges
7. `Vibe Coding (concept)` - 3 edges
8. `LLM vs Compiler: non-determinism` - 3 edges
9. `The Problem: generation is cheap, intent gives clarity` - 2 edges
10. `Intent Pipeline (Write->Spec->Implement->Verify->Deploy->Learn)` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Principle: Provide good inputs` --semantically_similar_to--> `Ship intent, not code`  [INFERRED] [semantically similar]
  raw/urls/roboco_io_posts_the-art-of-vibe-coding.md → raw/urls/intent_roboco_io.md
- `Vibe Coding (concept)` --conceptually_related_to--> `Ship intent, not code`  [INFERRED]
  raw/urls/roboco_io_posts_the-art-of-vibe-coding.md → raw/urls/intent_roboco_io.md
- `Principle: Small steps approach` --semantically_similar_to--> `Intent Lifecycle (seed->exploring->clarified->build/killed)`  [INFERRED] [semantically similar]
  raw/urls/roboco_io_posts_the-art-of-vibe-coding.md → raw/urls/intent_roboco_io.md
- `Principle: Leverage automation (tests/linters/formatters)` --semantically_similar_to--> `Intent Pipeline (Write->Spec->Implement->Verify->Deploy->Learn)`  [INFERRED] [semantically similar]
  raw/urls/roboco_io_posts_the-art-of-vibe-coding.md → raw/urls/intent_roboco_io.md
- `Principle: Simplify boldly` --semantically_similar_to--> `Principle: Never write How`  [INFERRED] [semantically similar]
  raw/urls/roboco_io_posts_the-art-of-vibe-coding.md → raw/urls/intent_roboco_io.md

## Hyperedges (group relationships)
- **Four Intent Principles** — intent_roboco_io_principle_never_write_how, intent_roboco_io_principle_admit_uncertainty, intent_roboco_io_principle_kill_fast, intent_roboco_io_principle_precision_equals_quality [EXTRACTED 1.00]
- **Intent Document four sections** — intent_roboco_io_why_section, intent_roboco_io_what_section, intent_roboco_io_not_section, intent_roboco_io_learnings_section [EXTRACTED 1.00]
- **Four Vibe Coding Principles** — roboco_io_posts_the_art_of_vibe_coding_principle_simplify, roboco_io_posts_the_art_of_vibe_coding_principle_small_steps, roboco_io_posts_the_art_of_vibe_coding_principle_automation, roboco_io_posts_the_art_of_vibe_coding_principle_good_inputs [EXTRACTED 1.00]

## Communities

### Community 0 - "LLM non-determinism & convergence"
Cohesion: 0.29
Nodes (7): Principle: Admit uncertainty, Convergence (수렴) as trust model, Genetic Algorithm (analogy), LLM vs Compiler: non-determinism, Stochastic Gradient Descent (analogy), Simulated Annealing (analogy), Vibe Coding (concept)

### Community 1 - "Intent Document structure"
Cohesion: 0.33
Nodes (6): Intent Document (Why/What/Not/Learnings), Learnings section, Example: Legacy Converter INTENT.md, Not section, What section, Why section

### Community 2 - "Vibe Coding pipeline"
Cohesion: 0.33
Nodes (6): Intent Pipeline (Write->Spec->Implement->Verify->Deploy->Learn), Principle: Never write How, The Art of Vibe Coding (roboco.io), Principle: Leverage automation (tests/linters/formatters), Principle: Provide good inputs, Principle: Simplify boldly

### Community 3 - "Intent Engineering principles"
Cohesion: 0.67
Nodes (4): Intent Engineering (roboco.io), Principle: Intent precision = output quality, Ship intent, not code, The Problem: generation is cheap, intent gives clarity

### Community 4 - "Intent lifecycle"
Cohesion: 0.67
Nodes (3): Intent Lifecycle (seed->exploring->clarified->build/killed), Principle: Kill fast, Principle: Small steps approach

## Knowledge Gaps
- **10 isolated node(s):** `Why section`, `What section`, `Not section`, `Learnings section`, `Principle: Kill fast` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Intent Document (Why/What/Not/Learnings)` connect `Intent Document structure` to `LLM non-determinism & convergence`, `Vibe Coding pipeline`, `Intent Engineering principles`?**
  _High betweenness centrality (0.467) - this node is a cross-community bridge._
- **Why does `Intent Engineering (roboco.io)` connect `Intent Engineering principles` to `Intent Document structure`, `Vibe Coding pipeline`, `Intent lifecycle`?**
  _High betweenness centrality (0.328) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Ship intent, not code` (e.g. with `Principle: Provide good inputs` and `Vibe Coding (concept)`) actually correct?**
  _`Ship intent, not code` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Why section`, `What section`, `Not section` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._
---
id: requirements
cat: mindset
size: 2
title:
  ko: 요건 정의
  en: Requirements
  ja: 要件定義
refs:
  - url: https://en.wikipedia.org/wiki/Requirements_engineering
    title: Requirements engineering (Wikipedia)
    lang: en
  - url: https://www.iso.org/standard/45171.html
    title: ISO/IEC/IEEE 29148 — Requirements engineering
    lang: en
  - url: https://martinfowler.com/bliki/UserStory.html
    title: User Story (Martin Fowler)
    lang: en
extraEdges: []
---

## ko

요건 정의는 **코드를 쓰기 전에 "누가, 무엇을, 왜"에 답하는 단계**다. 개발자가 아니라면 이 영역이 오히려 당신이 제일 강한 곳일 수 있다 — 문제를 실제로 아는 사람이 쓴 요구가 엔지니어 해석을 거친 요구보다 정확한 경우가 많다. 비유는 건축: 벽을 세우고 나서 "문이 필요했네"는 비싸다. 설계도는 첫 삽 전에 그리는 것.

AI 시대의 요건 정의는 한 가지가 바뀌었다 — [[claude-code]] 같은 에이전트가 요구 문서 자체를 *입력*으로 먹는다. [[tidd]]의 티켓, [[intent]]의 INTENT.md, 간단한 "What/Why/Not" 메모 — 구조화된 글로 남긴 요구는 사람과 AI 모두의 컨텍스트가 된다. [[context-eng]]의 상류.

### 언제 쓰나
- 새 프로젝트 첫날 — 한 페이지라도 좋으니 What/Why/Not 정리부터
- [[ai-coding-tools]]에 넘기기 전 — 모호한 요구는 모호한 코드를 낳는다. [[hallucination]] 1순위 원인
- 기능 스코프가 자꾸 커질 때 — "이번 스프린트엔 X만"을 종이에 박아두면 [[simplify]]가 자연히 따라온다
- 이해관계자가 여럿일 때 — 구두 합의는 잊힌다. 글이 있어야 나중에 "이렇게 하기로 했잖아요"가 통한다
- [[tidd]] 운영 팀에서 — 티켓 본문이 곧 요건. 한 줄 티켓은 컨텍스트 없는 껍데기

### 쉽게 빠지는 함정
- **"일단 만들고 보자"** — AI가 빨라지니 더 커진 유혹. 한 시간 요건 정리가 열 시간 재작성을 구한다
- **"How"를 "What"에 섞어 넣기** — "React로 모달을 만들어"는 요건이 아니라 구현. 요건은 "어떤 상호작용이 필요한가"
- **모두 담으려다 아무것도 못 담음** — 우선순위 없는 요구 100개는 요구 0개와 같다. Must/Should/Won't로 분리
- **측정 불가능한 "좋은 UX"** — "빨라야 한다"는 요건이 아니다. "p95 latency 200ms 이하"가 요건
- **[[intent]]와 혼동** — intent는 *왜*의 상위축, requirements는 *무엇*의 구체 — 두 층이 다 있어야 한다

### 구성 요소 체크리스트
- **누가**: 사용자/이해관계자 (1~2 유형으로 좁히기)
- **무엇을**: 상호작용·결과 (UI 스크린샷이나 in/out 예시로)
- **왜**: 해결하려는 문제 ([[intent]]와 연결)
- **왜 아님(Not)**: 이번엔 하지 않을 것 (스코프 방어선)
- **측정**: 완료 기준 (테스트·지표)

### 연결
[[intent]]의 하위축, [[tidd]]·[[context-eng]]의 재료. [[small-steps]] 실천에 직접 기여 — 요건이 명확해야 조각으로 쪼갤 수 있다. [[review-mindset]]과 만나면 "이 코드가 요건을 만족하나?"라는 강력한 질문이 된다. [[ai-coding-tools]] 시대에는 *사람이 가장 가치를 더하는 단계*로 중요도가 오히려 오르고 있다.

## en

Requirements is **the step where you answer "who, what, why" *before* writing code**. If you're not a developer, this is often where you're strongest — requirements written by someone who actually knows the problem beat engineer-interpreted ones. The analogy: architecture. Realizing you needed a door after the wall is up is expensive. The blueprint comes before the first shovel.

One thing changed in the AI era — agents like [[claude-code]] consume requirement documents as *input*. A [[tidd]] ticket, an [[intent]] INTENT.md, a simple "What/Why/Not" memo — structured requirements become context for both humans and AI. Upstream of [[context-eng]].

### When to use
- Day one of a new project — even one page of What/Why/Not changes the trajectory
- Before handing work to [[ai-coding-tools]] — fuzzy requirements produce fuzzy code. Prime cause of [[hallucination]]
- When scope keeps creeping — writing "this sprint is only X" down makes [[simplify]] follow naturally
- Multiple stakeholders — oral agreements evaporate. Writing gives you "we agreed to this, remember?"
- On a [[tidd]] team — the ticket body *is* the requirement. A one-liner ticket is a context-free shell

### Common pitfalls
- **"Let's just build it"** — tempting when AI is fast, but an hour of requirements saves ten hours of rework
- **Mixing "how" into "what"** — "build a modal in React" is implementation, not requirement. Requirement is "what interaction do we need?"
- **Trying to capture everything → capturing nothing** — 100 unprioritized asks equals zero asks. Split by Must/Should/Won't
- **Unmeasurable "good UX"** — "it should be fast" isn't a requirement. "p95 latency < 200ms" is
- **Confusing [[intent]] and requirements** — intent is the higher *why*-axis; requirements are the concrete *what*. You want both layers

### Structure checklist
- **Who**: user / stakeholder (narrow to 1–2 personas)
- **What**: interaction / outcome (screenshots or in/out examples beat prose)
- **Why**: the problem to solve (link to [[intent]])
- **Why Not**: what's explicitly out of scope (scope defense)
- **Measurement**: definition of done (tests or metrics)

### How it connects
A subaxis of [[intent]] and raw material for [[tidd]] and [[context-eng]]. Directly enables [[small-steps]] — clear requirements split naturally into chunks. With [[review-mindset]] it becomes the powerful "does this code satisfy the requirement?" question. In the [[ai-coding-tools]] era this step is gaining importance rather than losing it — it's where humans add the most value.

## ja

要件定義は**コードを書く前に「誰が、何を、なぜ」に答える段階**。開発者でないなら、この領域こそあなたが一番強い可能性が高い — 問題を実際に知る人が書いた要求が、エンジニア解釈を経た要求より正確なことが多い。比喩は建築: 壁を立ててから「ドアが必要だった」は高くつく。図面は最初のスコップの前に描く。

AI時代の要件定義は一つ変わった — [[claude-code]]のようなエージェントが要件ドキュメント自体を*入力*として食べる。[[tidd]]のチケット、[[intent]]のINTENT.md、簡単な「What/Why/Not」メモ — 構造化された要件は人とAI双方のコンテキストになる。[[context-eng]]の上流。

### いつ使うか
- 新プロジェクト初日 — 一ページでもよいからWhat/Why/Notの整理から
- [[ai-coding-tools]]に渡す前 — 曖昧な要求は曖昧なコードを生む。[[hallucination]]の第1原因
- 機能スコープが膨らみ続けるとき — 「今スプリントはXのみ」を紙に焼けば[[simplify]]が自然に付いてくる
- 利害関係者が複数のとき — 口約束は忘れられる。書き物があれば後で「こう決めたはず」が通る
- [[tidd]]を運用するチームで — チケット本文が要件そのもの。一行チケットは文脈のない殻

### はまりやすい罠
- **「とりあえず作ろう」** — AIが速くなった分だけ誘惑は大きい。要件整理1時間が書き直し10時間を救う
- **「How」を「What」に混ぜる** — 「Reactでモーダルを作る」は実装であって要件ではない。要件は「どんな相互作用が必要か」
- **全部入れようとして何も入らない** — 優先順位のない要求100個は要求0個と同じ。Must/Should/Won'tで切る
- **測定不能な「良いUX」** — 「速いべき」は要件ではない。「p95 latency 200ms未満」が要件
- **[[intent]]と混同** — intentは*なぜ*の上位軸、requirementsは*何*の具体 — 両層がそろって意味がある

### 構成要素チェックリスト
- **誰が**: ユーザー/ステークホルダー(1〜2ペルソナに絞る)
- **何を**: 相互作用・成果(UIスクリーンショットやin/out例が文章より強い)
- **なぜ**: 解決したい問題([[intent]]と結び)
- **なぜ否(Not)**: 今回はやらないこと(スコープ防御)
- **測定**: 完了基準(テスト・指標)

### 繋がり
[[intent]]の下位軸、[[tidd]]・[[context-eng]]の素材。[[small-steps]]実践に直接寄与 — 要件が明確なら塊に分けやすい。[[review-mindset]]と組むと「このコードは要件を満たすか?」という強力な問いになる。[[ai-coding-tools]]時代はこの段階の重要度がむしろ上がっている — 人が最も価値を付加する段階だ。

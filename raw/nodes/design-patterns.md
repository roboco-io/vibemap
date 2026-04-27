---
id: design-patterns
cat: mindset
size: 2
title:
  ko: 디자인 패턴
  en: Design Patterns
  ja: デザインパターン
refs:
  - url: https://refactoring.guru/design-patterns
    title: Design Patterns — Refactoring.Guru
    lang: en
  - url: https://martinfowler.com/bliki/GangOfFour.html
    title: Gang of Four — Martin Fowler
    lang: en
  - url: https://www.metaphorex.org/entries/pattern-language-as-shared-vocabulary/
    title: Pattern Language as Shared Vocabulary (Metaphorex)
    lang: en
extraEdges: []
---

## ko

**"이건 Strategy야"** 한 마디면 코드를 본 사람은 곧 "런타임에 알고리즘을 갈아끼우는 인터페이스 경계, 클라이언트는 그걸 모른 채 호출만 하고, 분기문이 사라진다"는 *문단 분량의 의미*를 받아챈다. 디자인 패턴은 그렇게 *짧은 단어가 긴 컨텍스트를 운반*하게 만드는 *공유 어휘*다.

뿌리는 1977년 건축가 Christopher Alexander의 *A Pattern Language*. "재귀하는 문제 + 그 맥락에서의 해법"을 이름 붙여 묶고, 그 이름들을 문법처럼 조합해 디자인 *언어*로 키운다는 발상. 1987년 Kent Beck·Ward Cunningham이 객체지향 소프트웨어로 옮겼고, 1994년 GoF(*Design Patterns*) 책이 23개 카탈로그(Strategy·Observer·Decorator·Factory…)로 굳혔다. 현대 개발자가 매일 쓰는 Singleton, Observer, Pipeline, Repository, Adapter는 모두 이 계보의 후손.

### 왜 AI 시대에 더 강력해지는가

LLM은 자연어 토큰의 통계적 압축에 능하다. "Builder 패턴으로 빌드해줘"라고 [[prompt-eng|프롬프트]]에 적으면 모델은 *수십 줄짜리 명세*를 펼쳐 코드를 생성한다. 즉 패턴 이름은 [[context-eng]]의 고밀도 입력이며, [[claude-code]]·[[ai-coding-tools]]에 일관된 결과를 끌어내는 가장 짧은 거리. 사람-사람 커뮤니케이션을 위해 만들어진 도구가, 이제 사람-AI 커뮤니케이션에서도 똑같이 작동한다.

### 언제 쓰나

- 같은 모양의 문제가 *세 번 이상* 나타날 때 — 두 번까지는 우연일 수 있다
- 코드 리뷰·PR 본문에서 의도를 압축적으로 전달할 때 — [[review-mindset]]의 효율을 끌어올린다
- AI 에이전트에게 설계 결정을 정확히 지시할 때 — "Strategy로 분리해"가 "긴 명세"보다 정확
- [[domain]] 모델링에서 ubiquitous language의 일부로 — 패턴 이름이 도메인 용어와 섞이면 팀 공통 어휘가 된다
- [[refactor]] 카탈로그(Fowler)의 "Replace Conditional with Polymorphism" 같은 항목 — 패턴이 리팩토링의 *목적지*

### 쉽게 빠지는 함정

- **Cargo cult / pattern-itis** — 필요 없는데 Singleton·Factory를 도배. [[simplify]]를 거스른다
- **억지로 끼워맞추기** — 문제를 패턴에 맞추는 게 아니라 패턴을 문제에 맞춰야 한다
- **이름과 구현 혼동** — "콜백 받는 클래스는 다 Strategy"라는 식. 진짜 Strategy는 *교체 가능성*과 *클라이언트 무지*를 함께 요구
- **시대에 뒤처진 패턴** — 함수형·모던 언어에선 GoF 일부(Singleton, Iterator)가 언어 기능으로 흡수돼 무의미. *언제 안 쓰나*도 같이 배워야
- **AI의 패턴 환각** — 모델이 "Factory 패턴으로 만들었습니다"라고 자랑하지만 실제 코드는 평범한 함수일 때. [[hallucination]]의 한 형태이며 [[review-mindset]]으로만 잡힌다

### 연결

[[intent]]를 코드 구조에 새기는 가장 짧은 방법. [[refactor]] 카탈로그가 패턴을 *목적지*로 쓰고, [[review-mindset]]은 패턴 이름으로 의견을 압축한다. [[domain]]의 ubiquitous language와 합쳐져 팀 공통 어휘가 되며, 그 어휘가 [[docs]]·[[llm-wiki]]에 박히면 [[claude-code]]·[[prompt-eng]]·[[context-eng]]가 같은 의미를 받아낸다. *짧은 단어 = 긴 컨텍스트*가 [[harness-eng]]의 핵심 자산이 되는 이유.

## en

A single line — **"make this a Strategy"** — and the reader unpacks paragraphs of meaning: an interface that lets clients swap algorithms at runtime, conditional branches collapsed into polymorphism. Design patterns are exactly that — a *shared vocabulary* where *short words carry long context*.

The root is Christopher Alexander's *A Pattern Language* (1977), where recurring problems plus their solutions in context were named and combined like grammar into a generative *language* for design. Kent Beck and Ward Cunningham brought it to OOP at OOPSLA 1987; the Gang of Four book (1994) crystallized 23 patterns (Strategy, Observer, Decorator, Factory…) that practitioners still use daily. Singleton, Observer, Pipeline, Repository, Adapter — all descendants of the same lineage.

### Why this gets stronger in the AI era

LLMs are excellent at compressing natural-language tokens into intent. Write "build this with the Builder pattern" in a [[prompt-eng|prompt]] and the model expands a multi-paragraph spec into code. A pattern name is therefore a *high-density input* for [[context-eng]] — the shortest path to consistent output from [[claude-code]] and [[ai-coding-tools]]. A tool built for human-human communication works just as well for human-AI.

### When to use

- The same shape of problem appears *three or more times* — twice can still be coincidence
- Code review and PR descriptions need a compressed way to convey intent — patterns multiply [[review-mindset]] efficiency
- Giving an AI agent precise design instructions — "extract a Strategy" beats a long prose spec
- [[domain]] modeling — pattern names enter the team's ubiquitous language and stick
- During [[refactor]] — Fowler's catalog explicitly targets patterns as *destinations* (e.g. "Replace Conditional with Polymorphism")

### Common pitfalls

- **Cargo cult / pattern-itis** — wrapping everything in Singleton and Factory because it sounds professional; an enemy of [[simplify]]
- **Forced fit** — bending the problem to match a pattern instead of the other way around
- **Name vs implementation** — "anything with a callback is Strategy" is wrong; real Strategy requires interchangeability *and* client ignorance
- **Outdated patterns** — modern/functional languages absorb several GoF patterns into the language itself (Singleton, Iterator). *When not to apply* matters as much as how
- **AI pattern hallucination** — the model proudly claims "I implemented the Factory pattern" while the code is a plain function. A flavor of [[hallucination]] caught only by [[review-mindset]]

### How it connects

The shortest way to inscribe [[intent]] into code structure. [[refactor]] uses patterns as targets; [[review-mindset]] compresses critique into pattern names. Combined with [[domain]]'s ubiquitous language, patterns become team-wide shared vocabulary; baked into [[docs]] and [[llm-wiki]], they let [[claude-code]], [[prompt-eng]], and [[context-eng]] receive the same meaning. *Short word = long context* — the asset that makes [[harness-eng]] worth its weight.

## ja

**「ここはStrategy」** —— その一言で、読み手は「ランタイムにアルゴリズムを差し替えられるインターフェース境界、クライアントはそれを知らずに呼ぶだけ、条件分岐が消える」という*段落分の意味*を一瞬で受け取る。デザインパターンとは、まさに*短い単語が長い文脈を運ぶ*ための*共有語彙*だ。

ルーツは1977年、建築家Christopher Alexanderの*A Pattern Language*。「再帰する問題 + その文脈での解法」に名前を付け、それらを文法のように組み合わせて*言語*に育てる発想。1987年にKent Beck・Ward CunninghamがOOPに移植、1994年のGoF(*Design Patterns*)が23パターン(Strategy・Observer・Decorator・Factory…)としてカタログ化した。現代の開発者が日常的に使うSingleton, Observer, Pipeline, Repository, Adapter —— みなこの系譜の子孫。

### なぜAI時代に強力さが増すか

LLMは自然言語トークンの統計的圧縮が得意。「Builderパターンで作って」と[[prompt-eng|プロンプト]]に書けば、モデルは*数段落分の仕様*を展開してコードを生成する。つまりパターン名は[[context-eng]]の高密度入力であり、[[claude-code]]・[[ai-coding-tools]]から一貫した結果を引き出す最短経路。人-人のコミュニケーションのために作られた道具が、人-AIにも同じく機能する。

### いつ使うか

- 同じ形の問題が*三回以上*現れたとき —— 二回までは偶然かもしれない
- コードレビューやPR本文で意図を圧縮的に伝えるとき —— [[review-mindset]]の効率が跳ね上がる
- AIエージェントに設計判断を正確に指示するとき —— 「Strategyに分離して」は長文の仕様より正確
- [[domain]]モデリングで ubiquitous language の一部として —— パターン名が業務用語と混ざるとチームの共通語彙になる
- [[refactor]]のとき —— Fowlerのカタログはパターンを*ゴール*として明示的に使う

### はまりやすい罠

- **Cargo cult / pattern-itis** —— 不要なのにSingletonやFactoryで埋める。[[simplify]]の敵
- **無理矢理の当てはめ** —— 問題をパターンに合わせるのではなく、パターンを問題に合わせる
- **名前と実装の混同** —— 「コールバックを受け取れば全部Strategy」は誤り。本物のStrategyは*交換可能性*と*クライアントの無知*を共に要求
- **時代遅れのパターン** —— 関数型・モダン言語では一部のGoF(Singleton, Iterator)が言語機能に吸収されて無意味になる。*いつ使わないか*も同時に学ぶ
- **AIのパターン幻覚** —— モデルが「Factoryパターンで実装しました」と自慢するが実際は平凡な関数だけ、というケース。[[hallucination]]の一種で、[[review-mindset]]でしか検出できない

### 繋がり

[[intent]]をコード構造に刻む最短の方法。[[refactor]]はパターンを*ゴール*に使い、[[review-mindset]]は批評をパターン名に圧縮する。[[domain]]のubiquitous languageと結びついてチーム共通語彙になり、[[docs]]・[[llm-wiki]]に焼き込まれれば[[claude-code]]・[[prompt-eng]]・[[context-eng]]が同じ意味を受け取る。*短い単語 = 長い文脈*こそが[[harness-eng]]の中核資産になる理由。

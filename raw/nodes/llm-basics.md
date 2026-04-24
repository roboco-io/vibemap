---
id: llm-basics
cat: ai
size: 2
title:
  ko: LLM 이해하기
  en: Understanding LLMs
  ja: LLMを理解する
refs:
  - url: https://en.wikipedia.org/wiki/Large_language_model
    title: Large language model (Wikipedia)
    lang: en
  - url: https://jalammar.github.io/illustrated-transformer/
    title: The Illustrated Transformer — Jay Alammar
    lang: en
  - url: https://karpathy.github.io/2025/01/24/deep-dive-into-llms/
    title: Deep Dive into LLMs — Andrej Karpathy
    lang: en
extraEdges: []
---

## ko

LLM(Large Language Model)을 이해하는 핵심 한 줄은 **"다음에 올 확률이 가장 높은 토큰을 하나씩 고르는 기계"**다. 코드도 글도 답변도 "다음 단어 예측"의 반복으로 만들어진다. 그래서 같은 질문에 매번 조금씩 다른 답이 나온다 — 결정론적 컴파일러와 가장 크게 다른 지점. "버그"가 아니라 "특성"으로 이해해야 이후의 도구·워크플로우가 납득된다.

한 단계 깊이 들어가면 세 가지 축이 있다. **파라미터**(모델이 학습한 수치들 — Claude Opus 4.7은 수천억 규모), **컨텍스트 윈도우**(한 번에 보는 입력 토큰 수 — 지금은 200K~1M), **토큰화**(GPT 토크나이저로 "hello world"는 2토큰, 한국어는 글자당 2~3토큰이라 영어보다 비싸다). 이 셋이 비용·속도·품질을 좌우한다.

### 언제 쓰나
- AI 도구를 고르기 전 — Claude 4.7과 GPT-5.4와 Gemini 2.5가 같은 프롬프트에 다른 반응을 하는 *이유*를 알아야 도구 선택이 된다
- [[hallucination]]·[[prompt-eng]]·[[context-eng]]의 바닥 개념을 잡을 때 — 이 셋 다 "확률적 예측 기계"라는 사실에서 파생
- [[llmops]] 운영 — 토큰 비용·지연·품질을 측정하려면 모델 내부 동작을 알아야 함
- 비개발자가 AI 한계를 설명받을 때 — "왜 가끔 틀려요?"의 근본 답

### 쉽게 빠지는 오해
- **"학습 데이터에 없는 건 절대 모른다"** — 부분 참. 추론으로 합성할 수 있으나, 최신 정보는 모름. 학습 컷오프 이후 지식은 [[context-eng]]으로 주입
- **"더 큰 모델이 무조건 좋다"** — 틀림. 작업별로 작고 빠른 모델이 나은 경우 많음(분류·요약·구조화 출력)
- **"결과가 같으면 모델도 같다"** — 아님. 같은 답 뒤에 다른 확률 분포가 있을 수 있고, 분포 차이가 엣지 케이스에서 드러남
- **"프롬프트가 전부"** — [[prompt-eng]]은 조미료. 주재료는 [[context-eng]]과 모델 자체 능력
- **"LLM이 추론한다"의 의인화** — "추론"처럼 *보이는* 것은 학습된 패턴 재현. "step-by-step" 같은 기법은 분포를 좋은 방향으로 기울일 뿐

### 주요 개념 어휘
- **토큰/토크나이저** — 텍스트를 나누는 단위. 언어마다 비용 다름
- **컨텍스트 윈도우** — 한 번에 읽는 최대 길이. 넘으면 잘리거나 요약 필요
- **Temperature** — 0에 가까우면 일관적, 1에 가까우면 창의적(=편차 큼)
- **RAG** — 검색 결과를 컨텍스트에 주입. [[hallucination]] 완화 표준
- **파인튜닝** — 베이스 모델을 특정 도메인으로 재학습. 요즘은 [[prompt-eng]]·[[context-eng]]로 대부분 해결되어 쓰임 줄어듦

### 연결
[[hallucination]]·[[prompt-eng]]·[[context-eng]]·[[agentic]]·[[llmops]] 모두 이 노드를 전제로 한다. [[ai-coding-tools]]·[[claude-code]]의 동작 원리도 여기서 출발. [[harness-eng]]은 "이 기계의 확률적 특성을 감싸서 유용하게 만드는 기술"이라 정의할 수 있어, llm-basics의 자연스러운 응용 축이다.

## en

The one-line understanding of LLMs (Large Language Models) is: **they pick the next most-probable token, one at a time**. Code, prose, answers — all come from iterating that single operation. That's why the same question yields slightly different answers each time; this is the biggest difference from a deterministic compiler. Reading it as a *feature*, not a *bug*, is what makes downstream tooling and workflows make sense.

One level deeper, three axes shape everything. **Parameters** (the learned numbers — Claude Opus 4.7 is hundreds of billions), **context window** (tokens the model can see at once — now 200K to 1M), **tokenization** (with the GPT tokenizer "hello world" is 2 tokens, while Korean takes 2–3 per character, making it costlier than English). These three drive cost, latency, and quality.

### When to use this framing
- Before choosing an AI tool — Claude 4.7, GPT-5.4, and Gemini 2.5 react differently to the same prompt; knowing *why* makes the choice possible
- Grounding [[hallucination]], [[prompt-eng]], [[context-eng]] — all derive from "probabilistic predictor"
- [[llmops]] operations — measuring token cost, latency, and quality demands a model of the model
- Explaining AI limits to non-developers — answers the basic "why does it sometimes get things wrong?"

### Common misconceptions
- **"It only knows what's in its training data"** — partially true. It can *synthesize* from inference, but post-cutoff knowledge is absent. Inject it via [[context-eng]]
- **"Bigger model = always better"** — wrong. Smaller, faster models often win on specific tasks (classification, summarization, structured output)
- **"Same output means same model"** — not necessarily. The same final token can come from different probability distributions; differences show up in edge cases
- **"Prompt is everything"** — [[prompt-eng]] is the seasoning. The main course is [[context-eng]] and raw model capability
- **"LLMs reason"** — anthropomorphic. What *looks* like reasoning is learned-pattern reproduction. Techniques like "step-by-step" tilt the distribution in a good direction

### Core vocabulary
- **Token / tokenizer** — the unit text is chunked into. Costs vary by language
- **Context window** — maximum length per pass. Overflow means truncation or summarization
- **Temperature** — near 0, consistent; near 1, creative (= high variance)
- **RAG** — injecting retrieval results into context. Standard [[hallucination]] mitigation
- **Fine-tuning** — retraining a base model on domain data. Less common now, since [[prompt-eng]] + [[context-eng]] often suffice

### How it connects
[[hallucination]], [[prompt-eng]], [[context-eng]], [[agentic]], [[llmops]] all presuppose this node. It's also the starting point for understanding [[ai-coding-tools]] and [[claude-code]]. [[harness-eng]] can be defined as "the craft of wrapping this machine's probabilistic nature into something useful" — a natural application axis of llm-basics.

## ja

LLM(Large Language Model)を理解する一行は**「次に来る確率が最も高いトークンを一つずつ選ぶ機械」**。コードも文章も答も「次の単語予測」の反復で作られる。だから同じ質問に毎回少し違う答が返る — 決定論的なコンパイラとの最大の違い。「バグ」ではなく「特性」と理解して初めて、以降の道具・ワークフローが納得できる。

一段深掘りすれば三つの軸がある。**パラメータ**(学習した数値 — Claude Opus 4.7は数千億規模)、**コンテキストウィンドウ**(一度に見る入力トークン数 — 今は200K〜1M)、**トークン化**(GPTトークナイザーで"hello world"は2トークン、日本語は文字単位で2〜3トークンと英語より高い)。この三つがコスト・速度・品質を決める。

### いつ使うか
- AI道具を選ぶ前 — Claude 4.7とGPT-5.4とGemini 2.5が同じプロンプトに違う反応を示す*理由*を知らないと選択できない
- [[hallucination]]・[[prompt-eng]]・[[context-eng]]の土台概念を掴むとき — 全部「確率的予測機」から派生する
- [[llmops]]運用 — トークンコスト・遅延・品質を測るにはモデル内部の把握が必要
- 非エンジニアにAIの限界を説明するとき — 「なぜ時々間違う?」の根本答

### よくある誤解
- **「学習データにないものは絶対知らない」** — 半分正しい。推論で合成可能だが最新情報はない。学習カットオフ以降は[[context-eng]]で注入
- **「大きいモデル=常に良い」** — 誤り。作業別に小さく速いモデルが勝つ場合多数(分類・要約・構造化出力)
- **「結果が同じならモデルも同じ」** — 違う。同じ最終トークンが違う確率分布から来ることがあり、差はエッジケースで出る
- **「プロンプトが全て」** — [[prompt-eng]]は調味料。主菜は[[context-eng]]とモデル自体の能力
- **「LLMが推論する」の擬人化** — *推論のように見える*ものは学習済みパターンの再現。"step-by-step"のような手は分布を良い方向に傾けるだけ

### 主な概念語彙
- **トークン/トークナイザー** — テキストの刻み単位。言語ごとにコスト違う
- **コンテキストウィンドウ** — 一度に読む最大長。超えると切り詰め or 要約
- **Temperature** — 0に近いと一貫、1に近いと創造的(=バラつき大)
- **RAG** — 検索結果をコンテキストに注入。[[hallucination]]緩和の標準
- **ファインチューニング** — ベースモデルをドメインで再学習。今や[[prompt-eng]]・[[context-eng]]で大抵解決され使用減

### 繋がり
[[hallucination]]・[[prompt-eng]]・[[context-eng]]・[[agentic]]・[[llmops]]はすべてこのノードを前提にする。[[ai-coding-tools]]・[[claude-code]]の動作原理もここから出発。[[harness-eng]]は「この機械の確率的特性を包んで有用にする技術」と定義でき、llm-basicsの自然な応用軸。

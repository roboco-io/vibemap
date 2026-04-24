---
id: review-mindset
cat: mindset
size: 3
title:
  ko: AI 코드 검토 습관
  en: Reviewing AI Code
  ja: AIコードレビュー習慣
refs:
  - url: https://google.github.io/eng-practices/review/
    title: Google Engineering Practices — Code Review
    lang: en
  - url: https://www.anthropic.com/engineering/claude-code-best-practices
    title: Claude Code Best Practices (Anthropic Engineering)
    lang: en
extraEdges: []
---

## ko

AI 코드 검토 습관은 **"AI가 쓴 코드를 내 코드처럼 읽는다"**는 규율이다. AI와 협업할 때 가장 흔한 실패는 코드가 *돌아가는지*만 보고 커밋하는 것 — [[pitfalls]]의 1번 항목 그대로다. 리뷰 마인드셋은 "작동"과 "이해"를 분리하고, 이해 없이는 통과시키지 않는 태도.

기존 사람끼리의 코드 리뷰와 다른 점이 하나 있다: **저자에게 질문이 공짜**다. 사람 리뷰에서 "이 변수 왜 이렇게 썼어요?"는 상대방 시간을 빌리는 일이지만, AI에겐 무한히 물어볼 수 있다. 이 특권을 안 쓰면 검토 품질이 떨어진다. "왜 이 함수를 썼어?", "이 부분 없이도 돌아갈까?", "이 라이브러리 실제로 존재해?" — 생각이 막히는 모든 지점이 질문거리다.

### 언제 쓰나
- [[ai-coding-tools]]·[[claude-code]]에서 받은 모든 diff를 커밋 전에
- [[pr]] 생성 전에 self-review로 — "내가 설명 못 하는 줄이 있나?"
- 프로덕션 배포 전 마지막 관문으로 — 테스트 초록이어도 검토는 별개
- 새 라이브러리나 API를 AI가 제안했을 때 — 존재 여부·라이선스·취약점을 최소 1분은 검증

### 쉽게 빠지는 함정
- **"AI가 알아서 했겠지"** — 책임은 머지하는 사람에게 있다. 돌아가는 나쁜 코드도 당신이 오너
- **빨간 신호를 녹색으로 덮기** — 테스트 깨지면 "AI에게 고치라고" 하지 말고 *왜 깨졌는지* 먼저 이해
- **한 줄 diff의 일관성만 보기** — "문법이 맞다"는 읽기가 아니다. *기능이 맞다*를 봐야 한다
- **[[hallucination]] 감지 미스** — 존재하지 않는 함수, 지어낸 import, 가짜 문서 링크. 이 네 패턴은 거의 매번 확인
- **테스트 코드 미검토** — AI가 짠 테스트가 가장 흔한 사각지대. `expect(true).toBe(true)`·assertion 빠진 블록·mock만 검증하는 테스트를 읽지 않으면 초록불이 의미 없다

### 체크리스트 (30초 스윕)
- 한 줄이라도 설명 못 하는 곳이 있는가?
- import한 라이브러리가 실제로 존재하는가?
- 테스트는 *기능*을 검증하는가, *구현*을 반복하는가?
- 시크릿·자격 증명이 리터럴로 박혔는가?
- 에러 처리가 "무시"·"콘솔 로그"로 빠져 있진 않은가?

### 연결
[[pitfalls]]의 가장 직접적인 방어선. [[testing]]·[[tdd]]가 자동화된 확인이라면, 리뷰 마인드셋은 *인간의 마지막 확인*. [[pr]]·[[trunk]] 기반 개발의 품질 게이트로 작동한다. [[tidd]]의 "티켓이 컨텍스트" 원리와 만나면, 티켓을 다시 읽으며 "이 코드가 티켓 의도와 일치하나?"까지 확장되어 더 강한 검토가 된다.

## en

The AI-code review mindset is the discipline of **reading AI-written code as if it were your own**. The most common failure in AI-assisted work is committing as soon as the code *runs* — item #1 on [[pitfalls]]. The review mindset separates "works" from "understood" and refuses to pass anything in the second bucket.

One difference from human-to-human code review: **questions are free**. In a human review, "why did you use this variable?" costs someone's time; with an AI, you can ask infinitely. Skipping this privilege drops quality fast. "Why this function?" "Would it work without this piece?" "Does this library actually exist?" — every moment of confusion is a question.

### When to use
- On every diff received from [[ai-coding-tools]] or [[claude-code]] before committing
- As self-review before opening a [[pr]] — "is there a line I can't explain?"
- As the final gate before production — green tests ≠ reviewed
- Any time AI suggests a new library or API — spend at least a minute checking existence, license, vulnerabilities

### Common pitfalls
- **"The AI probably knows"** — accountability sits with the merger. A running-but-wrong change is yours to own
- **Turning red to green by force** — when tests break, don't ask the AI to "fix it"; understand *why* they broke first
- **Inspecting line-level syntax only** — "looks syntactically right" isn't reading. "Does it functionally fit?" is
- **Missing [[hallucination]]** — nonexistent functions, fabricated imports, fake doc links. Always sweep these four
- **Not reviewing the test code** — AI-generated tests are the most common blind spot. Don't trust green without reading the assertion body

### 30-second checklist
- Any line you can't explain?
- Every imported library actually exists?
- Tests verify *behavior*, not just repeat implementation?
- Any hard-coded secrets or credentials?
- Error handling that silently swallows errors or just console.log's?

### How it connects
The most direct defense against [[pitfalls]]. Where [[testing]] and [[tdd]] are automated checks, review mindset is the *human final check*. It acts as a quality gate for [[pr]] and [[trunk]]-based workflows. Paired with [[tidd]]'s "the ticket is context" principle, it grows into "does this code match the ticket's intent?" — stronger review on the same discipline.

## ja

AIコードレビュー習慣は**「AIの書いたコードを自分のコードのように読む」**規律。AIと協業する際の最頻の失敗は、コードが*動く*ことだけ見てコミットすること — [[pitfalls]]の1番項目そのまま。レビュー姿勢は「動く」と「理解した」を分離し、理解なしには通さない態度だ。

人間同士のコードレビューと違う点が一つ: **著者への質問が無料**。人のレビューで「このパラメータなぜ?」は相手の時間を借りる行為だが、AIには無限に聞ける。この特権を使わないと検証品質が落ちる。「なぜこの関数?」「これなしでも動く?」「このライブラリ本当に存在する?」 — 考えが止まるすべてが質問ネタだ。

### いつ使うか
- [[ai-coding-tools]]・[[claude-code]]から受け取ったすべてのdiffをコミット前に
- [[pr]]作成前のセルフレビューとして — 「説明できない行はないか?」
- 本番デプロイ前の最終関門として — テスト緑でもレビューは別物
- AIが新ライブラリやAPIを提案したとき — 存在・ライセンス・脆弱性を最低1分は検証

### はまりやすい罠
- **「AIがうまくやったはず」** — 責任はマージする人にある。動く悪いコードもあなたのもの
- **赤を力ずくで緑にする** — テストが落ちたら「AIに直して」ではなく*なぜ落ちた*を先に理解
- **一行単位の構文だけ見る** — 「構文的に正しい」は読んでいない。「機能的に合う」を見るのが読む
- **[[hallucination]]検知漏れ** — 存在しない関数、捏造されたimport、嘘のドキュメントリンク。この四つはほぼ毎回スイープ
- **テストコード未レビュー** — AI生成テストは最大の盲点。アサーション本体を読まずに緑を信じない

### 30秒チェックリスト
- 説明できない行があるか?
- importしたライブラリは実在するか?
- テストは*振る舞い*を検証するか、実装を反復するだけか?
- シークレットや認証情報がリテラルで埋まっていないか?
- エラーハンドリングがエラーを握りつぶしたりconsole.logだけにしていないか?

### 繋がり
[[pitfalls]]に対する最も直接的な防御線。[[testing]]や[[tdd]]が自動化された確認なら、レビュー姿勢は*人の最終確認*。[[pr]]・[[trunk]]ベース開発の品質ゲートとして作動する。[[tidd]]の「チケットが文脈」原理と組むと「このコードはチケットの意図と一致するか?」まで拡張され、同じ規律でより強いレビューになる。

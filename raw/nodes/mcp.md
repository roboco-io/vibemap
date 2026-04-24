---
id: mcp
cat: ai
size: 2
title:
  ko: MCP (Model Context Protocol)
  en: MCP (Model Context Protocol)
  ja: MCP (Model Context Protocol)
refs:
  - url: https://modelcontextprotocol.io/
    title: Model Context Protocol — Official Site
    lang: en
  - url: https://docs.claude.com/en/docs/claude-code/mcp
    title: MCP in Claude Code (Anthropic Docs)
    lang: en
  - url: https://github.com/modelcontextprotocol/servers
    title: MCP Servers (GitHub)
    lang: en
extraEdges: []
---

## ko

MCP(Model Context Protocol)는 **LLM과 외부 도구를 잇는 표준 규격**이다. 비유로는 "AI용 USB-C" — 한 번 맞추면 어떤 AI도(Claude, GPT, Cursor 등) 어떤 도구에든(Slack, GitHub, PostgreSQL, Figma, 내부 CRM) 같은 방식으로 붙는다. Anthropic이 2024년에 오픈 표준으로 제안한 뒤 주요 에이전트 도구들이 빠르게 채택했다.

MCP 없이는 각 AI × 각 도구 조합마다 통합 코드가 필요했다 — N×M 문제. MCP는 도구를 "서버"로 표준화하고(리소스·툴·프롬프트 세 종류 제공), AI를 "클라이언트"로 표준화해 N+M 문제로 바꾼다. stdio / SSE / HTTP 세 가지 전송 방식을 지원하고, 서버는 로컬(내 PC의 파일시스템)이거나 원격(회사 내부 API)일 수 있다.

### 언제 쓰나
- [[claude-code]]·[[agentic]] 에이전트에게 **외부 세계 접근**을 주고 싶을 때 — DB 조회, 이슈 검색, Figma 읽기 등
- 같은 도구를 여러 AI에서 쓰고 싶을 때 — MCP 서버 하나로 Claude Code / Cursor / Codex가 공유
- 민감한 데이터를 클라우드에 업로드하지 않고 로컬에서 AI에 제공할 때 — stdio MCP로 파일시스템을 직접 노출
- 조직 내부 API를 공식 SDK 없이 AI에 태울 때 — MCP 서버 래핑만 하면 됨
- [[context-eng]] 확장 — 정적 파일 첨부 대신 *필요할 때 가져오는* 동적 컨텍스트로

### 쉽게 빠지는 함정
- **권한 과다한 MCP 서버** — 읽기 의도로 연결했는데 쓰기까지 열려 있는 실수. 서버 설정 시 가장 좁게
- **토큰 예산 초과** — MCP 서버가 많을수록 tool description이 컨텍스트를 잡아먹는다. [[context-eng]] 관점에서 실제 쓰는 것만 enable
- **사내 데이터를 퍼블릭 서버로 전송** — 공식 MCP 서버 리스트의 "공식"은 "Anthropic이 만든"이란 뜻이지 "안전 보장"이 아니다. 사내 정보는 자체 호스팅 서버로
- **인증 우회** — MCP 서버가 앞단 인증을 건너뛰는 백도어가 되면 감사에서 걸림. SSO·OAuth 통합이 기본
- **[[hallucination]]의 대리 실행** — 툴 호출 결과를 검증 없이 LLM이 확정으로 받아들이는 케이스. 파라미터 검증 필요

### 대표 서버
- 파일시스템, GitHub, Slack, Postgres, Sentry 등 공식 서버는 `modelcontextprotocol/servers` 리포에
- 커뮤니티: Linear, Notion, Figma, 각종 사내 API 래퍼
- Claude Code용은 `.mcp.json`에 등록하면 전체 세션에서 사용 가능

### 연결
[[claude-code]]·[[agentic]] 시스템의 외부 세계로의 다리이자 [[harness-eng]]의 한 층. [[context-eng]] 관점에서 MCP 서버는 *온디맨드 컨텍스트 공급원* — 정적 첨부를 보완한다. [[hallucination]] 대응에서 "지어내지 않고 실제 조회"를 가능케 하는 인프라. [[cc-*]] 컴포넌트와 함께 Claude Code의 조직 맞춤화를 완성.

## en

MCP (Model Context Protocol) is **a standard protocol for connecting LLMs to external tools**. The tagline is "USB-C for AI" — wire it once and any AI (Claude, GPT, Cursor, etc.) can talk to any tool (Slack, GitHub, PostgreSQL, Figma, internal CRMs) the same way. Anthropic proposed it as an open standard in 2024 and major agent tools adopted it quickly.

Before MCP, every AI × tool combination needed its own glue — the N×M problem. MCP standardizes tools as "servers" (offering three kinds of artifacts: resources, tools, prompts) and AIs as "clients," turning it into N+M. It supports stdio / SSE / HTTP transports, and servers can be local (your filesystem) or remote (an internal company API).

### When to use
- Giving a [[claude-code]] or [[agentic]] agent **access to the outside world** — query a DB, search issues, read Figma
- Reusing the same tool across multiple AIs — one MCP server, shared across Claude Code / Cursor / Codex
- Exposing sensitive data to an AI locally rather than uploading to the cloud — stdio MCP can surface filesystem directly
- Wrapping an internal API for AI use without an official SDK — just wrap with an MCP server
- Extending [[context-eng]] — dynamic, just-in-time context instead of static file attachments

### Common pitfalls
- **Over-permissioned servers** — connected for read, accidentally exposes write. Start with minimum scope
- **Token budget blowout** — more MCP servers → more tool descriptions in the context. Enable only what you actually use
- **Sending internal data to public servers** — "official" in the registry means "built by Anthropic," not "safe for your data." Host your own for sensitive info
- **Auth bypass** — an MCP server that skips front-door auth becomes an audit gap. Standard is SSO/OAuth integration
- **Letting tool results stand unverified** — treating tool outputs as ground truth without input validation enables [[hallucination]] by proxy

### Notable servers
- Filesystem, GitHub, Slack, Postgres, Sentry etc. live in `modelcontextprotocol/servers`
- Community: Linear, Notion, Figma, various internal-API wrappers
- For Claude Code, register in `.mcp.json` and it's usable across the session

### How it connects
The bridge to the outside world for [[claude-code]] and [[agentic]] systems, and a layer of [[harness-eng]]. From a [[context-eng]] perspective, an MCP server is an *on-demand context source* that complements static attachments. In [[hallucination]] defense, it's the infrastructure that enables "actually look it up" instead of "confidently invent." Paired with [[cc-*]] components, it completes Claude Code's organizational customization.

## ja

MCP(Model Context Protocol)は**LLMと外部ツールを繋ぐ標準規格**。キャッチフレーズは「AI用USB-C」 — 一度合わせればどのAI(Claude、GPT、Cursorなど)もどのツール(Slack、GitHub、PostgreSQL、Figma、社内CRM)にも同じ方法で繋がる。Anthropicが2024年にオープン標準として提案し、主要エージェントツールが急速に採用した。

MCP以前は各AI × 各ツールの組み合わせごとに統合コードが必要 — N×M問題。MCPはツールを「サーバー」として標準化し(リソース・ツール・プロンプトの三種を提供)、AIを「クライアント」として標準化することでN+M問題に変える。stdio / SSE / HTTPの三転送をサポートし、サーバーはローカル(自PCのファイルシステム)でも遠隔(社内API)でも構わない。

### いつ使うか
- [[claude-code]]・[[agentic]]エージェントに**外界アクセス**を渡したいとき — DB照会、イシュー検索、Figma読み
- 同じツールを複数AIで使いたいとき — MCPサーバー一つでClaude Code / Cursor / Codexが共有
- 機微データをクラウドにアップせずローカルでAIに提供するとき — stdio MCPでファイルシステムを直接露出
- 社内APIを公式SDKなしでAIに繋ぎたいとき — MCPサーバーでラップするだけ
- [[context-eng]]の拡張 — 静的添付でなく*必要時に取得する*動的コンテキストに

### はまりやすい罠
- **権限過多サーバー** — 読み取り目的で繋いだが書き込みまで開いていた。最小権限で始める
- **トークン予算オーバー** — MCPサーバーが多いほどツール説明がコンテキストを食う。[[context-eng]]視点で実使用分だけ有効化
- **社内データをパブリックサーバーへ** — レジストリの「公式」は「Anthropic製」であって「データ安全」ではない。機微情報は自ホスティングで
- **認証バイパス** — MCPサーバーが正面認証を迂回するバックドアになり監査で引っかかる。SSO・OAuth統合が基本
- **ツール結果を無検証で採用** — ツール出力を真実と扱って入力検証せず、代理の[[hallucination]]を生む

### 代表サーバー
- ファイルシステム、GitHub、Slack、Postgres、Sentryなどは`modelcontextprotocol/servers`リポに
- コミュニティ: Linear、Notion、Figma、各種社内APIラッパー
- Claude Code用は`.mcp.json`に登録すればセッション全体で使用可能

### 繋がり
[[claude-code]]・[[agentic]]システムの外界への橋であり、[[harness-eng]]の一層。[[context-eng]]視点ではMCPサーバーは*オンデマンドなコンテキスト供給源* — 静的添付を補完する。[[hallucination]]対策では「捏造せず実照会」を可能にするインフラ。[[cc-*]]コンポーネントと共にClaude Codeの組織向けカスタマイズを完成する。

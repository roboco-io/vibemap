---
id: zero-trust
cat: mindset
size: 3
title:
  ko: 제로 트러스트
  en: Zero Trust
  ja: ゼロトラスト
refs:
  - url: https://csrc.nist.gov/pubs/sp/800/207/final
    title: NIST SP 800-207 — Zero Trust Architecture
    lang: en
  - url: https://www.cisa.gov/zero-trust-maturity-model
    title: CISA Zero Trust Maturity Model
    lang: en
  - url: https://www.microsoft.com/en-us/security/business/zero-trust
    title: What is Zero Trust? — Microsoft Security
    lang: en
extraEdges: []
---

## ko

제로 트러스트는 **"네트워크 안에 있다고 해서 신뢰하지 않는다"**는 [[security]] 아키텍처다. 전통적 보안은 *성벽* 비유 — 안과 밖을 가르고, 안쪽은 안전하다고 가정. 제로 트러스트는 그 가정을 버린다. *Never trust, always verify* — 모든 요청을 매번 신원·디바이스·맥락으로 재검증한다. 사용자도, 서비스도, AI 에이전트도 같은 규칙. NIST SP 800-207(2020)이 표준 정의를 제공했고, Google BeyondCorp(2014)·Microsoft·CISA Maturity Model이 실무 청사진을 채워 왔다.

핵심 원칙 셋. **명시적 검증** — 신원 + 디바이스 + 위치 + 행동 패턴으로 매 요청 확인. **최소 권한** — 작업에 딱 필요한 만큼만, just-in-time / just-enough. **침해 가정** — 한 부분이 뚫렸다고 가정하고 폭발 반경을 좁힌다(microsegmentation). 이 셋이 [[microservices]]·[[serverless]]·원격 근무·AI 에이전트 시대에 자연스럽게 맞물린다 — 어차피 *경계가 없는* 환경.

### 언제 쓰나
- 클라우드 네이티브·원격 근무 — 사무실 VPN이 더 이상 신뢰 경계가 아닐 때
- [[microservices]] 간 통신 — mTLS·서비스 메시(Istio·Linkerd)로 서비스 간 상호 인증
- [[claude-code]]·[[harness-eng]] 같은 AI 에이전트에게 권한 부여 — 에이전트도 *비-인간 신원*으로 취급, 좁은 권한·감사 로그
- [[llmops]] 환경의 RAG/검색 — LLM이 접근 가능한 데이터를 사용자 권한과 일치시키기
- [[iac]]·[[gitops]]를 이미 쓰고 있을 때 — 정책을 코드로 표현하기 좋은 토대

### 인접 개념
- **BeyondCorp** — Google이 원조 격으로 발표한 "VPN 없는 사내 접근". ZT의 청사진
- **SASE / ZTNA** — 네트워크 + 보안을 클라우드에서 결합한 패키지. ZT의 운영 형태
- **IAM 최소 권한** — ZT의 *권한* 축. 최소 권한 + JIT 접근으로 *부여*도 일시적
- **mTLS** — 서비스 간 상호 인증. ZT의 *서비스* 축
- **마이크로세그멘테이션** — 워크로드별로 격리해 폭발 반경 축소

### 쉽게 빠지는 함정
- **"제로 트러스트 제품"을 사겠다** — ZT는 *아키텍처*이지 한 도구가 아니다. 한 벤더가 "ZT 솔루션"이라 부르는 건 한 조각일 뿐
- **AI 에이전트 권한 누락** — [[claude-code]]·[[ai-coding-tools]] 에이전트도 신원이다. 사람만 ZT 적용하고 에이전트엔 와일드카드 권한이면 [[hallucination]] 한 번에 사고
- **세션 토큰 영구화** — 한 번 발급된 토큰을 평생 쓰면 ZT 아니라 *지연된 펄리미터*. 짧은 만료 + 컨텍스트 기반 재검증
- **로깅·모니터링 없는 ZT** — *항상 검증*은 *항상 관찰*과 짝. [[monitoring]]·[[aiops]] 없으면 누가 무엇을 했는지 사후 추적 불가
- **모든 걸 한 번에 ZT로** — 단계적 도입 필수. 가장 민감한 워크로드부터(결제·관리자·AI 에이전트), 그다음 확장
- **컴플라이언스 체크박스로 끝** — 정책만 쓰고 *지속적 검증 루프*가 없으면 종이호랑이. 시뮬레이션·레드팀으로 검증

### 연결
[[security]]의 직접 하위 축이자 [[iac]]·[[gitops]] 위에서 정책을 코드로 운용. [[microservices]]·[[serverless]]·[[claude-code]]가 모두 *경계 없는* 시스템이라 ZT가 자연스럽게 들어갈 자리. [[harness-eng]] 관점에서 에이전트의 권한·툴 스키마·서브에이전트 격리가 본질적으로 ZT 설계 결정. [[monitoring]]·[[aiops]]가 *지속적 검증*의 신호 공급자.

## en

Zero Trust is the [[security]] architecture that says **"location inside a network does not imply trust."** Classical security uses the *castle wall* metaphor — separate inside from outside, assume the inside is safe. Zero Trust drops that assumption. *Never trust, always verify* — every request is re-validated by identity, device, and context. Users, services, and AI agents all play by the same rules. NIST SP 800-207 (2020) provides the canonical definition; Google BeyondCorp (2014), Microsoft, and CISA's Maturity Model filled in the practitioner blueprints.

Three core principles. **Verify explicitly** — identity + device + location + behavioral signals on every request. **Least privilege** — exactly what's needed, just-in-time / just-enough. **Assume breach** — design as if one segment is already compromised; constrain blast radius via microsegmentation. The three click into place naturally in the [[microservices]] / [[serverless]] / remote-work / AI-agent era — environments that have no perimeter to begin with.

### When to use
- Cloud-native and remote work — when an office VPN is no longer a meaningful trust boundary
- Inter-[[microservices]] communication — mTLS and service mesh (Istio, Linkerd) for mutual auth
- Granting permissions to AI agents like [[claude-code]] or [[harness-eng]] — treat agents as *non-human identities* with narrow scopes and audit logs
- RAG / retrieval in [[llmops]] — align the LLM's reachable data with the user's permissions
- Already using [[iac]] and [[gitops]] — gives you the substrate to express policy as code

### Adjacent concepts
- **BeyondCorp** — Google's "VPN-less corporate access" model; the ZT blueprint
- **SASE / ZTNA** — the cloud-delivered packaging of ZT (network + security)
- **IAM least privilege** — the *permissions* axis: minimum + JIT access; *granting* itself becomes ephemeral
- **mTLS** — the *service* axis: services authenticate each other
- **Microsegmentation** — workload-level isolation to limit blast radius

### Common pitfalls
- **"Buying a Zero Trust product"** — ZT is an *architecture*, not a single tool. A vendor's "ZT solution" is one slice, not the whole
- **Forgetting AI agent permissions** — agents from [[claude-code]] and [[ai-coding-tools]] are identities too. Apply ZT only to humans and one [[hallucination]] turns wildcard agent perms into an incident
- **Permanent session tokens** — a token that lives forever is *delayed perimeter*, not ZT. Short expiries with context-driven re-validation
- **ZT without [[monitoring]]** — *always verify* needs *always observe*. No logs, no after-the-fact attribution
- **"All at once" rollout** — phased introduction is mandatory. Start with the most sensitive workloads (payments, admin, AI agents), then expand
- **Compliance-checkbox theater** — writing policy without running continuous-verification loops is paper. Validate via simulation and red teaming

### How it connects
A direct sub-axis of [[security]], operated as policy-as-code on top of [[iac]] and [[gitops]]. [[microservices]], [[serverless]], and [[claude-code]] are all *perimeterless* systems where ZT slots in naturally. From a [[harness-eng]] perspective, an agent's permissions, tool schemas, and subagent isolation *are* Zero Trust design decisions. [[monitoring]] and [[aiops]] are the signal sources for the continuous-verification half.

## ja

ゼロトラストは**「ネットワーク内側にいるからといって信頼しない」**という[[security]]アーキテクチャ。伝統的セキュリティは*城壁*の比喩 —— 内と外を分け、内側は安全と仮定する。ゼロトラストはその仮定を捨てる。*Never trust, always verify* —— あらゆるリクエストを毎回、身元・デバイス・コンテキストで再検証する。ユーザーもサービスもAIエージェントも同じルール。NIST SP 800-207(2020年)が標準定義を提供し、Google BeyondCorp(2014年)・Microsoft・CISA Maturity Modelが実務の青写真を埋めてきた。

核心原則は三つ。**明示的検証** —— 身元 + デバイス + 場所 + 振る舞いを毎リクエスト確認。**最小権限** —— 作業に必要な分だけ、just-in-time / just-enough。**侵害前提** —— ある区画が既に破られている前提で設計し、マイクロセグメンテーションで爆発半径を抑える。この三つが[[microservices]]・[[serverless]]・リモートワーク・AIエージェント時代と自然に噛み合う —— そもそも*境界のない*環境だから。

### いつ使うか
- クラウドネイティブ・リモートワーク —— オフィスVPNがもはや信頼境界にならないとき
- [[microservices]]間通信 —— mTLSとサービスメッシュ(Istio・Linkerd)で相互認証
- [[claude-code]]や[[harness-eng]]のようなAIエージェントへの権限付与 —— エージェントも*非人間アイデンティティ*として扱い、狭い権限と監査ログ
- [[llmops]]環境のRAG・検索 —— LLMがアクセス可能なデータをユーザー権限に揃える
- [[iac]]や[[gitops]]を既に使っているとき —— ポリシーをコードで表現する土台が揃っている

### 隣接概念
- **BeyondCorp** —— Googleが先駆けて発表した「VPNなしの社内アクセス」。ZTの青写真
- **SASE / ZTNA** —— クラウドでネットワーク+セキュリティを束ねた運用形態
- **IAM最小権限** —— ZTの*権限*軸。最小権限 + JITアクセスで*付与*も一時的
- **mTLS** —— サービス間相互認証。ZTの*サービス*軸
- **マイクロセグメンテーション** —— ワークロード別に隔離して爆発半径を縮小

### はまりやすい罠
- **「ゼロトラスト製品」を買う** —— ZTは*アーキテクチャ*であって一つの道具ではない。ベンダーが「ZTソリューション」と呼ぶものは一断面にすぎない
- **AIエージェントの権限漏れ** —— [[claude-code]]や[[ai-coding-tools]]のエージェントもアイデンティティ。人にだけZTを適用し、エージェントにワイルドカード権限を残せば[[hallucination]]一発で事故
- **セッショントークンの永続化** —— 一度発行したトークンを永久に使うのはZTではなく*遅延した境界*。短い有効期限 + コンテキスト基準の再検証
- **ロギング・モニタリングなしのZT** —— *常時検証*は*常時観察*と対。[[monitoring]]や[[aiops]]がなければ事後追跡不能
- **すべてを一度に** —— 段階導入必須。最も機微なワークロード(決済・管理者・AIエージェント)から始めて拡張
- **コンプライアンスのチェックボックス止まり** —— ポリシーだけ書いて*継続的検証ループ*がなければ紙の虎。シミュレーション・レッドチームで検証

### 繋がり
[[security]]の直接下位軸であり、[[iac]]・[[gitops]]の上でポリシーをコード化して運用する。[[microservices]]・[[serverless]]・[[claude-code]]はすべて*境界のない*システムなので、ZTが自然に収まる場所。[[harness-eng]]視点ではエージェントの権限・ツールスキーマ・サブエージェント隔離が本質的にZT設計判断。[[monitoring]]・[[aiops]]が*継続的検証*の信号供給源。

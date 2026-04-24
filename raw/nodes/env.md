---
id: env
cat: tech
size: 3
title:
  ko: 환경변수·설정
  en: Environment & Config
  ja: 環境変数・設定
refs:
  - url: https://12factor.net/config
    title: The Twelve-Factor App — III. Config
    lang: en
  - url: https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html
    title: AWS Secrets Manager (AWS Docs)
    lang: en
extraEdges: []
---

## ko

환경변수와 설정은 **"코드를 바꾸지 않고도 실행 환경에 따라 동작을 바꿀 수 있게 하는 외부 입력"**이다. 12-factor app의 3번째 원칙: *설정은 환경변수로, 코드에 하드코딩하지 말 것*. dev·staging·prod에서 같은 이미지·같은 코드가 다른 DB·다른 API 키로 돌아가게 만드는 것이 핵심.

세 종류로 생각하면 편하다. **평범한 구성**(DB URL, 로그 레벨, 기능 플래그) — 평문 환경변수로 OK. **시크릿**(API 키, 비밀번호, 토큰) — Secrets Manager·Vault로 런타임 주입, 평문 저장 금지. **프로젝트 상수**(정적 텍스트·디자인 토큰) — 코드에 둬도 OK, 환경마다 다르지 않으니까. 이 셋을 구분하면 "어디에 두느냐"의 90%가 자동 결정된다.

### 언제 쓰나
- **같은 코드를 여러 환경에서** — dev/staging/prod, 리전별, 고객별
- **빌드 아티팩트 재사용** — [[cicd]]로 한 번 빌드한 이미지가 어디서든 돌게
- **[[serverless]]·[[lambda]] 설정** — 함수 환경변수가 기본 수단
- **기능 플래그** — 점진적 롤아웃·A/B 테스트·긴급 차단
- **[[container]] 배포** — Kubernetes ConfigMap·Secret, Docker Compose `.env`

### 쉽게 빠지는 함정
- **시크릿을 `.env`에 평문** — `.gitignore`에 넣는 걸 깜빡하면 바로 유출. Secrets Manager 주입 또는 GitHub Secrets
- **프로덕션 값을 로컬에 복사** — 개발자 PC가 프로덕션 DB 접근 권한을 갖게 됨. 사고 유발. 환경별 분리
- **환경변수에 JSON 덩어리 넣기** — 파싱 버그·가독성 저하. 구조화 필요하면 Parameter Store의 계층 구조 쓰기
- **기본값 없음** — 새 변수 추가 시 기존 배포가 죽음. 센스 있는 default 또는 명시적 에러 메시지
- **[[iac]]·[[cicd]] 로그에 환경변수 노출** — `env` 덤프가 로그로 흘러 시크릿 유출. 마스킹 규칙 필수
- **환경별 다른 동작을 숨김** — 배포하고 나서야 "프로덕션에서만 에러"를 발견. 환경 차이를 문서화·테스트
- **LLM 생성 코드가 `console.log(env)`** — 디버깅용 코드가 프로덕션에 남으면 시크릿 로그. [[review-mindset]]로 걸러라

### 실전 권장
- **dev**: `.env.local`(gitignored) + 센스 있는 default
- **staging/prod**: Secrets Manager·Parameter Store에서 런타임 주입
- **[[iac]]로 설정도 코드화** — 어떤 환경에 어떤 값이 들어가는지 추적 가능
- **기능 플래그**: LaunchDarkly·Split.io 같은 전용 도구 또는 [[dynamodb]]에 직접 관리
- **암호화**: 저장 시 KMS, 전송 시 TLS 기본

### 연결
[[iac]]와 짝 — 환경별 설정이 코드로 관리되어야 추적 가능. [[cicd]] 파이프라인에서 배포 시 환경변수 주입이 표준. [[serverless]]·[[lambda]]·[[container]]·[[ecs]] 모두 환경변수로 설정을 받음. [[cost]]·[[monitoring]]·[[llmops]] 관련 설정(모델 ID, 토큰 한도, 엔드포인트)도 환경변수로. [[claude-code]]의 [[cc-settings]] `env` 필드도 이 원리.

## en

Environment and config is **"external input that lets a system change behavior without changing code."** The 12-Factor app's third principle: *put config in environment variables; never hardcode it*. The point is running the same image and same code with a different DB or different API key across dev, staging, and prod.

Three buckets help. **Ordinary config** (DB URL, log level, feature flags) — plain environment variables are fine. **Secrets** (API keys, passwords, tokens) — inject via Secrets Manager or Vault at runtime; never store plaintext. **Project constants** (static text, design tokens) — code-resident is fine; they don't vary by environment. With these three distinguished, 90% of "where should this go?" is self-answering.

### When to use
- **Same code, multiple environments** — dev/staging/prod, per region, per customer
- **Reusing build artifacts** — [[cicd]] builds one image; config shapes it per environment
- **[[serverless]] / [[lambda]] configuration** — function environment variables are the default mechanism
- **Feature flags** — gradual rollouts, A/B tests, emergency kill-switches
- **[[container]] deployments** — Kubernetes ConfigMaps and Secrets, Docker Compose `.env`

### Common pitfalls
- **Plaintext secrets in `.env`** — forgetting `.gitignore` once and you're leaked. Inject via Secrets Manager or GitHub Secrets
- **Copying production values locally** — developers' laptops end up with prod DB access. Separate environments strictly
- **Blobs of JSON in env vars** — parse bugs, poor readability. If you need structure, use Parameter Store's hierarchy
- **No defaults** — adding a new variable breaks existing deploys. Either sensible defaults or explicit startup errors
- **Env leaking into [[iac]] / [[cicd]] logs** — an `env` dump lands in logs, secrets exposed. Mandatory masking rules
- **Hidden per-env behavior** — "error only in prod" surprises. Document and test environment differences
- **LLM-generated `console.log(env)`** — debug code in production logs secrets. Catch via [[review-mindset]]

### Practical recommendations
- **dev**: `.env.local` (gitignored) + sensible defaults
- **staging / prod**: inject from Secrets Manager or Parameter Store at runtime
- **Config as code via [[iac]]** — track which env gets which value
- **Feature flags**: use a dedicated tool (LaunchDarkly, Split.io) or manage in [[dynamodb]]
- **Encryption**: KMS at rest, TLS in transit as baseline

### How it connects
Pairs with [[iac]] — environment-specific config must be code to be traceable. Environment-variable injection at deploy time is standard in [[cicd]] pipelines. [[serverless]], [[lambda]], [[container]], [[ecs]] all consume configuration as env vars. [[cost]], [[monitoring]], and [[llmops]] settings (model IDs, token caps, endpoints) live here too. [[claude-code]]'s [[cc-settings]] `env` field follows the same principle.

## ja

環境変数・設定は**「コードを変えずに実行環境に応じて振る舞いを変えられる外部入力」**。12-Factor appの第三原則: *設定は環境変数に入れ、コードにハードコードしない*。dev・staging・prodで同じイメージ・同じコードが違うDB・違うAPIキーで動くようにするのが核心。

三種に分けて考えると楽。**普通の構成**(DB URL、ログレベル、機能フラグ) — 平文環境変数でOK。**シークレット**(APIキー、パスワード、トークン) — Secrets Manager・Vaultからランタイム注入、平文保存禁止。**プロジェクト定数**(静的テキスト・デザイントークン) — コードに置いてOK、環境で変わらないから。この三つを区別すれば「どこに置くか」の90%が自動で決まる。

### いつ使うか
- **同じコードを複数環境で** — dev/staging/prod、リージョン別、顧客別
- **ビルド成果物の再利用** — [[cicd]]で一度ビルドしたイメージがどこでも動くように
- **[[serverless]]・[[lambda]]設定** — 関数環境変数が基本手段
- **機能フラグ** — 段階的ロールアウト・A/Bテスト・緊急遮断
- **[[container]]デプロイ** — Kubernetes ConfigMap・Secret、Docker Composeの`.env`

### はまりやすい罠
- **`.env`に平文シークレット** — `.gitignore`を忘れると即漏洩。Secrets Manager注入またはGitHub Secrets
- **本番の値をローカルに複製** — 開発者のPCが本番DBアクセス権を持つことになる。事故の元。環境別に厳しく分ける
- **環境変数にJSONの塊** — パースバグ・可読性低下。構造化が必要ならParameter Storeの階層を使う
- **既定値なし** — 新変数追加で既存デプロイが壊れる。センスのある既定値か明示的エラーメッセージ
- **[[iac]]・[[cicd]]ログに環境変数露出** — `env`ダンプがログに流れてシークレット漏洩。マスキングルールが必須
- **環境別動作の隠蔽** — デプロイ後に「本番だけエラー」を発見。環境差を文書化・テスト
- **LLM生成コードが`console.log(env)`** — デバッグコードが本番に残るとシークレットログ。[[review-mindset]]で弾く

### 実戦推奨
- **dev**: `.env.local`(gitignored) + センスのある既定値
- **staging/prod**: Secrets Manager・Parameter Storeからランタイム注入
- **[[iac]]で設定もコード化** — どの環境にどの値が入るか追跡可能
- **機能フラグ**: LaunchDarkly・Split.ioなどの専用ツールか[[dynamodb]]で直接管理
- **暗号化**: 保存時KMS、転送時TLSが基本

### 繋がり
[[iac]]と対 — 環境別設定がコードで管理されてこそ追跡可能。[[cicd]]パイプラインのデプロイ時に環境変数注入が標準。[[serverless]]・[[lambda]]・[[container]]・[[ecs]]すべてが環境変数で設定を受ける。[[cost]]・[[monitoring]]・[[llmops]]関連設定(モデルID、トークン上限、エンドポイント)もここに。[[claude-code]]の[[cc-settings]] `env`フィールドもこの原理。

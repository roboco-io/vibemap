---
id: e2e
cat: tech
size: 3
title:
  ko: 엔드투엔드 테스트 (E2E)
  en: End-to-End Test
  ja: E2Eテスト
refs:
  - url: https://playwright.dev/
    title: Playwright — End-to-end testing
    lang: en
  - url: https://www.cypress.io/
    title: Cypress — End-to-end testing
    lang: en
extraEdges: []
---

## ko

엔드투엔드 테스트(E2E)는 **"사용자가 실제로 겪는 길을 기계가 그대로 따라가며 검증하는 테스트"**다. 로그인 → 장바구니 → 결제 → 완료 화면까지 한 번에. UI·API·DB·큐·외부 결제까지 전 스택이 조립된 상태로 실행한다. [[testing]] 피라미드의 꼭대기 — 값비싼 정보지만 결정적. "컴포넌트 단위 테스트는 다 통과하는데 실제로는 안 돌아간다"를 잡아낸다.

도구는 프런트엔드 위주로 성숙했다. **Playwright**(Microsoft, 다중 브라우저·안정성 최강), **Cypress**(개발자 경험 좋음), **Selenium**(레거시이나 여전히 널리 쓰임), **Puppeteer**(Chrome 전용). API-only E2E는 REST/Newman·Postman, k6로 시나리오 테스트. [[claude-code]] 같은 에이전트에게 E2E 작성을 시키면 MCP의 Playwright/browsermcp 서버를 물려 실제 브라우저를 조작하게 할 수 있다.

### 언제 쓰나
- **핵심 사용자 플로우**(로그인·결제·체크아웃) 5~20개 — 깨지면 비즈니스 중단
- **회귀 방지** — 한 번 일어난 프로덕션 장애를 E2E로 고정
- **크로스 브라우저 확인** — 모바일 Safari의 quirk를 수동으로 매번 확인 불가
- **시각 회귀** — Percy·Chromatic 같은 도구로 스크린샷 diff
- **[[cicd]] 배포 전 마지막 관문** — 스모크 테스트만이라도 돌려야 안심

### 쉽게 빠지는 함정
- **피라미드 역전** — E2E 비중이 지나치게 크면 CI가 1시간짜리가 됨. 핵심 5~20개만
- **flaky 천국** — 타이밍 이슈, 비동기 대기 부족, 외부 API 지연. 명시적 대기·재시도·테스트 격리로
- **구현 클래스명에 의존** — `div.btn-primary-v2`에 의존하면 UI 변경 시 전부 깨짐. `data-testid` 같은 테스트 전용 훅
- **상태 정리 안 해서 테스트 간 오염** — 앞 테스트가 만든 데이터가 다음 테스트에 영향. 테스트별 fixture 초기화
- **E2E만 믿고 [[ut]]·[[it]] 생략** — E2E는 "어디서 깨졌는지"를 알려주지 않음. 실패 원인 추적 불가능
- **실제 결제·이메일 발송** — 격리 안 하면 매 CI마다 진짜 돈·스팸. sandbox 모드·모의 게이트웨이

### 안정성 팁
- **고정 테스트 데이터** — 매 실행마다 깨끗한 DB 상태
- **네트워크 목킹 선택적** — 3rd party 결제 같은 건 mock, 내부 API는 실제
- **병렬 실행** — Playwright는 worker 여러 개로 테스트 분산, CI 시간 단축
- **재시도 정책** — flaky 테스트는 2~3회 재시도 허용하되, 실패 패턴 추적 대시보드 필수

### 연결
[[testing]] 피라미드 최상단. [[cicd]] 파이프라인의 마지막·가장 느린 단계. [[ut]]·[[it]]·[[e2e]] 세 계층 중 커버리지 범위는 가장 넓지만 실행 빈도는 가장 낮음. [[review-mindset]]의 자동 보조이지만 E2E가 녹색이라고 해서 [[pitfalls]]가 다 막히진 않음. [[claude-code]] + Playwright MCP 조합은 2026년 가장 빠르게 성숙 중인 E2E 자동화 패턴.

## en

An end-to-end test (E2E) is **"a test that has a machine follow the path a user would actually take."** Login → cart → checkout → confirmation, in one pass. UI, API, DB, queues, even external payment — the whole stack assembled and running. At the top of the [[testing]] pyramid — expensive per signal, but decisive. It catches the "every component test passes but nothing actually works" class of bug.

Tooling is most mature on the frontend. **Playwright** (Microsoft, multi-browser, best-in-class stability), **Cypress** (great DX), **Selenium** (legacy but still widely used), **Puppeteer** (Chrome-only). API-only E2E uses REST/Newman/Postman or k6 for scenario tests. An agent like [[claude-code]] can write E2E tests while driving a real browser via a Playwright/browsermcp MCP server.

### When to use
- **Core user flows** (login, payment, checkout) — 5 to 20 paths that are business-critical
- **Regression prevention** — pin a past production incident with an E2E
- **Cross-browser checks** — you cannot manually verify mobile Safari quirks every release
- **Visual regression** — tools like Percy and Chromatic for screenshot diffs
- **Last gate before [[cicd]] deploy** — at least smoke-test the critical flows

### Common pitfalls
- **Inverted pyramid** — too much E2E turns CI into an hour-long job. Keep 5–20 core flows
- **Flaky heaven** — timing, missing async waits, external API latency. Use explicit waits, retries, isolation
- **Depending on implementation class names** — `div.btn-primary-v2` breaks on any UI change. Use `data-testid` hooks
- **Test pollution** — data from one test leaking into the next. Reset fixtures per test
- **Trusting E2E over [[ut]] / [[it]]** — E2E doesn't tell you *where* it broke. Root causes become untraceable
- **Real payment / email** — without isolation, every CI burns real money or sends spam. Sandbox modes and mock gateways

### Stability tips
- **Fixed test data** — each run starts from a clean DB state
- **Selective network mocking** — third-party payment mocked; internal APIs real
- **Parallel execution** — Playwright workers can distribute tests and cut CI time
- **Retry policies** — allow 2–3 retries for flaky tests but track failure patterns on a dashboard

### How it connects
The pyramid's peak. The last and slowest stage of [[cicd]] pipelines. Of the three [[ut]] / [[it]] / [[e2e]] layers, E2E has the widest coverage but the lowest run frequency. A useful auxiliary for [[review-mindset]], but green E2E doesn't close every [[pitfalls]] entry. [[claude-code]] + Playwright MCP is one of the fastest-maturing E2E automation patterns in 2026.

## ja

E2Eテスト(End-to-End Test)は**「ユーザーが実際にたどる道を機械がそのまま進んで検証するテスト」**。ログイン → カート → 決済 → 完了画面まで一気通貫。UI・API・DB・キュー・外部決済まで全スタックが組み立てられた状態で走る。[[testing]]ピラミッドの頂点 — 一信号あたりは高価だが決定的。「コンポーネント単位テストは全部通るのに実際は動かない」を捕まえる。

ツールはフロントエンド中心に成熟している。**Playwright**(Microsoft、マルチブラウザ・安定性最強)、**Cypress**(開発者体験良好)、**Selenium**(レガシーだが依然広く使われる)、**Puppeteer**(Chrome専用)。APIのみのE2EはREST/Newman・Postman、k6でシナリオテスト。[[claude-code]]のようなエージェントにE2Eを書かせる際はPlaywright/browsermcpのMCPサーバーを繋いで実ブラウザを操作させられる。

### いつ使うか
- **核心ユーザーフロー**(ログイン・決済・チェックアウト)5〜20本 — 壊れるとビジネス停止
- **回帰防止** — 過去の本番障害をE2Eで固定
- **クロスブラウザ確認** — モバイルSafariのquirkを毎回手動で確認できない
- **視覚的回帰** — Percy・Chromaticなどでスクリーンショット差分
- **[[cicd]]デプロイ前の最終関門** — せめてスモークテストだけでも走らせて安心

### はまりやすい罠
- **ピラミッドの逆転** — E2E比重が大きすぎるとCIが1時間になる。核5〜20本だけ
- **flaky天国** — タイミング問題、非同期待機不足、外部API遅延。明示的待機・再試行・テスト隔離で
- **実装クラス名に依存** — `div.btn-primary-v2`依存だとUI変更で全部壊れる。`data-testid`のようなテスト専用フック
- **状態整理しないテスト間汚染** — 前のテストが作ったデータが次に影響。テスト毎にfixture初期化
- **E2Eだけ信じて[[ut]]・[[it]]を省略** — E2Eは「どこで壊れたか」を教えない。根本原因追跡不能
- **実決済・実メール送信** — 隔離しないと毎CIで実費・スパム。サンドボックスモードや模擬ゲートウェイ

### 安定性のヒント
- **固定テストデータ** — 毎回クリーンなDB状態から
- **選択的ネットワークモック** — サードパーティ決済はmock、内部APIは実物
- **並行実行** — Playwrightのworkerでテスト分散、CI時間短縮
- **再試行ポリシー** — flakyテストに2〜3回の再試行を許すが、失敗パターン追跡ダッシュボードは必須

### 繋がり
[[testing]]ピラミッドの頂点。[[cicd]]パイプラインの最後かつ最も遅い段階。[[ut]]・[[it]]・[[e2e]]の三層の中でカバレッジ範囲は最も広いが実行頻度は最も低い。[[review-mindset]]の自動補助だがE2Eが緑だからといって[[pitfalls]]が全部塞がるわけではない。[[claude-code]] + Playwright MCPの組合せは2026年最も速く成熟中のE2E自動化パターン。

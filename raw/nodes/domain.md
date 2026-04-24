---
id: domain
cat: ops
size: 3
title:
  ko: 도메인·DNS
  en: Domain & DNS
  ja: ドメイン・DNS
refs:
  - url: https://en.wikipedia.org/wiki/Domain_Name_System
    title: Domain Name System (Wikipedia)
    lang: en
  - url: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-overview.html
    title: DNS overview (AWS Route 53 Docs)
    lang: en
  - url: https://www.cloudflare.com/learning/dns/what-is-dns/
    title: What is DNS? (Cloudflare Learning)
    lang: en
extraEdges: []
---

## ko

도메인은 **"사람이 기억할 수 있는 인터넷 주소"**다. 서버의 실제 위치는 IP 주소(`52.95.110.1`)지만, 사람은 숫자를 기억 못 하니 `example.com` 같은 이름을 쓰는 것. 도메인을 IP로 바꿔주는 전화번호부 역할이 **DNS**(Domain Name System). 1983년 제안된 이후 인터넷의 숨은 인프라 — 평소엔 안 보이지만 고장 나면 세상이 멈춘다.

구성 요소. **도메인 레지스트라**(GoDaddy·Namecheap·Cloudflare·Route 53에서 도메인 "구매"), **네임서버**(어느 DNS가 이 도메인의 권위자인지), **레코드**(A=IPv4, AAAA=IPv6, CNAME=별칭, MX=메일, TXT=검증, NS=네임서버 위임). TTL은 캐시 유지 시간 — 너무 길면 변경이 안 반영되고, 너무 짧으면 DNS 쿼리가 폭증한다.

### 언제 다루나
- **프로젝트 배포 시 첫 관문** — [[vercel]]·[[serverless]] 앱에 커스텀 도메인 연결
- **이메일 설정** — MX, SPF, DKIM, DMARC 레코드가 맞아야 스팸 필터 안 걸림
- **SSL 인증서 검증** — HTTP-01 / DNS-01 challenge로 도메인 소유 증명
- **지역별 라우팅** — 사용자 가까운 리전으로 보내기 (Route 53 지리 기반)
- **블루-그린 배포** — DNS 전환으로 트래픽 이동

### 쉽게 빠지는 함정
- **TTL 설정 망각** — 프로덕션 레코드를 TTL 3600(1시간)으로 뒀다가 이전 시 1시간 지연. 배포 전에 TTL을 60초로 낮춰두기
- **도메인 갱신 누락** — 도메인 만료로 서비스 전체 중단. auto-renewal + 여러 결제 수단 등록
- **이메일 SPF/DKIM 미설정** — 이메일이 스팸함으로 직행. 도메인 인증 3종 세트 필수
- **CNAME과 루트 도메인 충돌** — `example.com`에 CNAME을 걸면 표준 위반. ALIAS / ANAME 레코드를 쓰거나 `www` 사용
- **DNSSEC 미적용** — 고급 공격(DNS 스푸핑) 대응. 금융·공공은 필수
- **내부 도메인 외부 노출** — 사내 시스템 도메인이 public DNS에 노출되면 정찰 대상. 내부는 private zone

### AWS Route 53
- AWS의 관리형 DNS. 도메인 등록도 가능
- Alias 레코드로 CloudFront·ALB·S3 버킷에 직접 라우팅
- Health check + failover routing 조합으로 자동 DR
- [[iac]]로 레코드 전체 관리 ([[cost]] 저렴, 레코드당 $0.40/월)

### 연결
[[vercel]]·[[serverless]] 앱의 외부 노출 첫 단계. [[cicd]] 배포 파이프라인의 끝단에 종종 DNS 전환이 포함된다 (블루-그린). [[monitoring]] 관점에서 도메인 만료·인증서 만료 경보는 기본. [[cost]] 관점에서는 거의 무시 가능한 수준이지만 갱신 누락은 치명적 장애 원인 1순위.

## en

A domain is **"an internet address humans can remember."** The server's real address is an IP (`52.95.110.1`), but nobody memorizes numbers, so we use names like `example.com`. The phonebook that translates domain to IP is **DNS** (Domain Name System). Proposed in 1983, DNS is the invisible infrastructure of the internet — silent when working, world-stopping when broken.

Key pieces. **Registrar** (GoDaddy, Namecheap, Cloudflare, Route 53 where you "buy" domains), **nameservers** (which DNS is authoritative for this domain), **records** (A = IPv4, AAAA = IPv6, CNAME = alias, MX = mail, TXT = verification, NS = nameserver delegation). TTL is the cache-lifetime — too long and changes don't propagate; too short and DNS query volume explodes.

### When to deal with it
- **First step when deploying a project** — custom domain for [[vercel]] and [[serverless]] apps
- **Email setup** — MX, SPF, DKIM, DMARC records must align or spam filters catch you
- **SSL certificate validation** — HTTP-01 / DNS-01 challenges prove domain ownership
- **Regional routing** — send users to the nearest region (Route 53 geolocation)
- **Blue-green deploys** — shift traffic via DNS cut-over

### Common pitfalls
- **Forgetting TTL** — production records at TTL 3600 (1 h) mean 1-hour lag during migration. Drop TTL to 60 s *before* the change
- **Domain renewal lapse** — domain expires, whole service dies. Enable auto-renewal with multiple payment methods
- **Missing SPF/DKIM** — email heads straight to spam. Domain auth trio is mandatory
- **CNAME on root collision** — CNAME on `example.com` violates the standard. Use ALIAS/ANAME or `www`
- **No DNSSEC** — defenses against DNS spoofing. Mandatory for finance/public sector
- **Internal domains exposed externally** — internal system names in public DNS become reconnaissance targets. Put them in private zones

### AWS Route 53
- AWS's managed DNS; also a registrar
- Alias records route directly to CloudFront, ALB, S3 buckets
- Health checks + failover routing for automatic DR
- Manage all records via [[iac]] ([[cost]] is minimal — $0.40 per record per month)

### How it connects
The first step in exposing [[vercel]] or [[serverless]] apps to the outside. [[cicd]] pipelines often end with a DNS cut-over (blue-green). For [[monitoring]], expiry alerts on domain and certificate are table stakes. For [[cost]], DNS itself is trivial; a renewal lapse is the #1 catastrophic failure mode.

## ja

ドメインは**「人間が覚えられるインターネットアドレス」**。サーバーの実際の場所はIPアドレス(`52.95.110.1`)だが、人間は数字を覚えられないので`example.com`のような名前を使う。ドメインをIPに変換する電話帳役が**DNS**(Domain Name System)。1983年提案以来インターネットの隠れインフラ — 普段は見えないが壊れると世界が止まる。

構成要素。**ドメインレジストラ**(GoDaddy・Namecheap・Cloudflare・Route 53でドメインを「購入」)、**ネームサーバー**(どのDNSがこのドメインの権威者か)、**レコード**(A=IPv4、AAAA=IPv6、CNAME=別名、MX=メール、TXT=検証、NS=ネームサーバー委任)。TTLはキャッシュ保持時間 — 長すぎると変更が反映されず、短すぎるとDNSクエリが爆発する。

### いつ扱うか
- **プロジェクトデプロイ時の最初の関門** — [[vercel]]・[[serverless]]アプリにカスタムドメインを繋ぐ
- **メール設定** — MX、SPF、DKIM、DMARCレコードが正しくないとスパムフィルタにかかる
- **SSL証明書検証** — HTTP-01 / DNS-01 challengeでドメイン所有を証明
- **地域別ルーティング** — ユーザーに近いリージョンへ(Route 53地理ベース)
- **ブルーグリーンデプロイ** — DNS切替でトラフィック移動

### はまりやすい罠
- **TTL設定の忘れ** — 本番レコードをTTL 3600(1時間)にしたまま移行で1時間遅延。変更前にTTLを60秒に落とす
- **ドメイン更新漏れ** — ドメイン失効でサービス全停止。auto-renewal + 複数決済手段登録
- **メールSPF/DKIM未設定** — メールがスパム箱直行。ドメイン認証3点セットが必須
- **CNAMEとルートドメイン衝突** — `example.com`にCNAMEを張ると標準違反。ALIAS/ANAMEレコードか`www`を使う
- **DNSSEC未適用** — 高度な攻撃(DNSスプーフィング)対策。金融・公共は必須
- **内部ドメインの外部露出** — 社内システムドメインがpublic DNSで見えると偵察対象に。内部はprivate zone

### AWS Route 53
- AWSの管理型DNS。ドメイン登録も可能
- AliasレコードでCloudFront・ALB・S3バケットに直接ルーティング
- Health check + failover routingで自動DR
- [[iac]]でレコード全体を管理([[cost]]安、レコードあたり$0.40/月)

### 繋がり
[[vercel]]・[[serverless]]アプリの外部露出の最初の段階。[[cicd]]パイプラインの末端にDNS切替(ブルーグリーン)が含まれることが多い。[[monitoring]]観点でドメイン失効・証明書失効アラートは基本。[[cost]]観点ではほぼ無視可能だが、更新漏れは致命的障害原因の第1位。

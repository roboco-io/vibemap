---
id: lake-formation
cat: data
size: 3
title:
  ko: Lake Formation
  en: Lake Formation
  ja: Lake Formation
refs:
  - url: https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html
    title: What is AWS Lake Formation (AWS Docs)
    lang: en
  - url: https://aws.amazon.com/lake-formation/
    title: AWS Lake Formation
    lang: en
extraEdges: []
---

## ko

Lake Formation은 **데이터 레이크의 권한·거버넌스 레이어**다. "누가 어떤 테이블의 어떤 컬럼까지 볼 수 있는가"를 IAM보다 훨씬 세밀하게 제어한다.

[[s3]] 기반 [[datalake]]에 [[glue]] 카탈로그로 테이블이 등록되었다고 치자. 그 상태에서 [[athena]]는 IAM만으로 "버킷 읽기 권한" 수준의 허가만 줄 수 있다. 개인정보가 담긴 `customers.email` 컬럼만 막고 싶다면? Lake Formation이 필요하다.

### 언제 쓰나
- 여러 팀·외부 파트너가 같은 레이크를 공유하는데 **컬럼·행 단위 접근 제어**가 필요
- GDPR/개인정보보호법 준수 — 특정 컬럼을 마스킹하거나 감사 로그 남기기
- [[env]] 보안 원칙("필요한 것만 최소 권한")을 레이크 수준으로 확장

### 개념 정리
- **Data Location**: [[s3]] 버킷 경로를 Lake Formation 등록 — 이후 이 경로의 데이터는 Lake Formation이 접근 제어
- **Permissions**: Grant SELECT ON table.column TO user/role — SQL 권한 관리와 비슷
- **Tag-based Access Control (LF-TBAC)**: "PII" 태그가 붙은 컬럼은 특정 그룹만 — 정책을 메타데이터로 관리

기억할 것: Lake Formation은 **별도 카탈로그가 아니라 Glue 카탈로그 위에 권한 층을 덧씌우는 것**이다. 그래서 [[glue]] 카탈로그가 먼저 세팅돼 있어야 한다.

## en

Lake Formation is the **permissions and governance layer for your data lake**. It controls "who can see which column of which table" at a much finer grain than raw IAM.

Say your [[datalake]] sits on [[s3]] and [[glue]] has cataloged the tables. With IAM alone, [[athena]] can only be gated at the "bucket read" level. Want to hide the `customers.email` column with personal data? That's Lake Formation territory.

### When to use
- Multiple teams or external partners share the same lake and you need **column- and row-level access control**
- Compliance (GDPR, privacy laws) — mask specific columns, audit access
- Extend [[env]]'s "least privilege" principle to the lake

### Concepts
- **Data Location**: register an [[s3]] bucket path with Lake Formation — it becomes the enforcer for that path
- **Permissions**: Grant SELECT ON table.column TO user/role — much like classic SQL grants
- **Tag-based Access Control (LF-TBAC)**: tag columns "PII" and restrict by tag — governance-as-metadata

Remember: Lake Formation is **not a separate catalog** — it layers permissions on top of the Glue catalog. So [[glue]] must be wired up first.

## ja

Lake Formationは**データレイクのアクセス制御とガバナンス層**。「誰がどのテーブルのどのカラムまで見られるか」をIAMよりずっと細かく制御する。

[[s3]]上の[[datalake]]に[[glue]]がテーブルを登録した状態を想像してほしい。IAMだけでは[[athena]]に対して「バケット読み取り」レベルの許可しか出せない。個人情報を含む`customers.email`カラムだけ隠したい場合、Lake Formationが必要になる。

### いつ使うか
- 複数チームや外部パートナーが同じレイクを共有し、**カラム・行レベルのアクセス制御**が必要
- GDPR/個人情報保護法対応 — 特定カラムのマスキング、アクセス監査
- [[env]]の「最小権限原則」をレイク層へ拡張

### 概念整理
- **Data Location**: [[s3]]バケットパスをLake Formationに登録 — 以後そのパスのアクセス制御をLake Formationが引き受ける
- **Permissions**: Grant SELECT ON table.column TO user/role — SQLの権限管理に近い
- **Tag-based Access Control (LF-TBAC)**: 「PII」タグを付けたカラムは特定グループのみ — ガバナンスをメタデータで管理

注意: Lake Formationは**独立したカタログではなく、Glueカタログの上に権限層を重ねるもの**。よって[[glue]]の設定が先に完了している必要がある。

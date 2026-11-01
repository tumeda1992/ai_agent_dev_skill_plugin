# 議論記録

## 論点1: ログの保存方針を、開発標準のどこに、どう書くか

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0（論点1）: 置き場所と本文

#### 提案0（論点1）

利用者は「プラグインの開発方針のところあったら、infrastractureというファイルかディレクトリ切ってそこにもログ方針書いておいて」と指示した（2026-11-01）。書く方針は「awsサービス個別のログはそのサービス閉じたら消していいけど、アプリケーションログは永続的に残したい。どうせ個人アクセスだから大した量残らないし。」である。
file か directory か、file 名、本文を決める。

置き場所:

- `plugins/tumeda-dev/docs/development_standards/infrastructure/log_retention.md` を作る（directory）。
    - infrastructure は分野の名前であり、今後も同じ分野の標準（権限、費用など）が増えうる。`development_flow/` と同じく、README を持たない directory にし、索引は `development_standards/README.md` に置く。
    - file 名は、同階層の慣習（docs は snake_case）に揃え、親が語る「infrastructure」を重ねない。中身は「ログをどれだけ残すか」なので `log_retention` とする。
- `development_standards/README.md`:
    - 「収録している標準」に、`development_flow/` と同じ形で次を足す。
        - `**infrastructure/** — 本番の基盤（cloud の resource）の作り方の判断基準。`
        - `[log_retention.md](./infrastructure/log_retention.md) — ログをどれだけ残すか。application のログは無期限に残し、cloud の service が自分で持つログは service と一緒に消えてよい。`
    - 「維持規律」の「現在は 13 file・約 57KB」を、実物に合わせて「14 file・約 60KB」へ直し、括弧内の内訳に「`infrastructure/` に log_retention」を足す。

本文（`log_retention.md`）:

```markdown
# ログの保存期間

cloud の基盤へ出すログを、どれだけ残すかの判断基準。

## application のログは無期限に残す

application のログとは、application の code が動いた結果として出る記録である。server 側の描画や API の処理の console の出力、error、request ごとの記録が当たる。

- MUST: application のログの保管先（CloudWatch Logs の log group など）に、保存期間を付けない。
- MUST: application のログは、それを出す resource（app、container、function など）を消しても残す。保管先を infrastructure as code で定義する場合は、resource の削除に連れて保管先が消えない形にする（例: Terraform の `aws_cloudwatch_log_group` の `skip_destroy = true`）。

理由:

- 障害や挙動の変化は、後からさかのぼって調べる。いつから起きていたか、変更の前後で何が変わったかは、古いログが無いと確かめられない。
- 個人で使う規模の application では request が少なく、ログは大きく溜まらない。保存の費用は決め手にならない。

前提が変わる場合: 多くの利用者を持つ application で、ログの量が保存の費用を左右するほど大きいなら、この基準をそのまま当てはめず、残す期間を利用者と決める。

## cloud の service が自分で持つログは、service と一緒に消えてよい

cloud の service が自分の動作について持つログ（build や deploy のログ、service の管理画面で見る実行履歴など）は、その service を閉じたら消えてよい。残すための保管先を別に作らない。

- 例: AWS Amplify Hosting の SSR の app では、SSR の実行時の出力は application のログであり、無期限に残す。build のログは Amplify が持つ service のログであり、app を消したら消えてよい。

判断の問い: **「このログは application の code が出すものか、cloud の service が自分の動作について持つものか」**

## やってしまいがちな失敗

- 保存の費用を理由に、application のログへ 7 日や 90 日の保存期間を付ける案を、既定のように推奨する。
    - 量が小さく費用が決め手にならないのに短い期間を付けると、後から調べたい時にログが無い。
    - この推奨は、二つの利用先 repository でどちらも利用者に却下された。
```

利用者の原文に無く、assistant が足したもの（採否を見てほしい）:

- 二つ目の MUST（resource を消してもログを残す。infrastructure as code では `skip_destroy`）。「service を閉じたら消してよいのは service のログで、application のログは永続」から導いた。
- 「前提が変わる場合」。利用者が理由に挙げた「どうせ個人アクセスだから大した量残らない」を、適用の前提として書いた。量が大きい application へ無条件に当てはめられることを防ぐ。

#### 検討記録（論点1・イテレーション0）

`development_standards/README.md` の「この群の置き方」は、開発そのもの（何を作るか）を扱う標準をこの群に置き、既存の群に当たらなければ新設するとしている。ログの保管先は作るものの一部であり、既存の三群（命名、エンティティ設計、開発の進め方）のどれにも当たらないため、新設する。

`task-design` は設計前調査でこの群の配下をすべて読むため、新しい導線を skill に足さなくても、ログの保管先を設計する時にこの文書に触れる。

[内部検討記録: 論点1・イテレーション0](internal-records/task-design-discussion.md.topic-1.md#iteration-0)

#### 提案0へのフィードバック（論点1）

**結果:** 提案0 を採用

> ok

（2026-11-01、chat 上の発言。assistant は「論点1: ok」か直したいところを求め、ok なら本文と README を書き、version を上げ、review・validator を通し、commit・main への取り込み・plugin の update まで進めると伝えていた。assistant が足した二つ目の MUST と「前提が変わる場合」も、この ok で採用された）

### 決定（論点1）

`plugins/tumeda-dev/docs/development_standards/infrastructure/log_retention.md` を新しく作り、提案0 の本文を書く。`infrastructure/` は `development_flow/` と同じく README を持たない directory とし、索引を `development_standards/README.md` の「収録している標準」に置く。同 README の「維持規律」の file 数・分量と内訳を実物に合わせる。

本文の規範:

- application のログ（application の code が動いた結果として出る記録）は無期限に残す。
    - MUST: 保管先に保存期間を付けない。
    - MUST: ログを出す resource を消しても残す。infrastructure as code で保管先を定義する場合は、resource の削除に連れて消えない形にする（例: Terraform の `skip_destroy = true`）。
    - 理由: 後からさかのぼって調べるため。個人で使う規模では量が小さく、費用は決め手にならない。
    - 前提が変わる場合: ログの量が保存の費用を左右するほど大きい application では、残す期間を利用者と決める。
- cloud の service が自分の動作について持つログは、service を閉じたら消えてよい。
- 判断の問い: 「このログは application の code が出すものか、cloud の service が自分の動作について持つものか」
- やってしまいがちな失敗: 費用を理由に 7 日や 90 日の保存期間を既定のように推奨する。

選択理由: 開発標準の「この群の置き方」は、何を作るかの標準を既存の群に当たらなければ新設するとしており、ログの保管先は既存の三群に当たらない。infrastructure は分野の名前で、同じ分野の標準が後から入りうるため directory にする。`task-design` は設計前調査でこの群の配下をすべて読むため、skill に導線を足さずに済む。

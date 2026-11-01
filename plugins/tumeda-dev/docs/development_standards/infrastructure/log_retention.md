# ログの保存期間

cloud の基盤へ出すログを、どれだけ残すかの判断基準。

## application のログは無期限に残す

application のログとは、application の code が動いた結果として出る記録である。server 側の描画や API の処理の console の出力、error、request ごとの記録が当たる。

- MUST: application のログの保管先（CloudWatch Logs の log group など）に、保存期間を付けない。
- MUST: application のログは、それを出す resource（app、container、function など）を消しても残す。保管先を infrastructure as code で定義する場合は、resource の削除に連れて保管先が消えない形にする（例: Terraform の `aws_cloudwatch_log_group` の `skip_destroy = true`）。

理由:

- 障害や挙動の変化は、後からさかのぼって調べる。いつから起きていたか、変更の前後で何が変わったかは、古いログが無いと確かめられない。
- 個人で使う規模の application では request が少なく、ログは大きく溜まらない。保存の費用は決め手にならない。

前提が変わる場合: 多くの利用者を持つ application で、ログの量が保存の費用を左右するほど大きいなら、保存期間を付けないという基準をそのまま当てはめず、残す期間を利用者と決める。

## cloud の service が自分で持つログは、service と一緒に消えてよい

cloud の service が自分の動作について持つログ（build や deploy のログ、service の管理画面で見る実行履歴など）は、その service を閉じたら消えてよい。残すための保管先を別に作らない。

- 例: AWS Amplify Hosting の SSR の app では、SSR の実行時の出力は application のログであり、無期限に残す。build のログは Amplify が持つ service のログであり、app を消したら消えてよい。

判断の問い: **「このログは application の code が出すものか、cloud の service が自分の動作について持つものか」**

## やってしまいがちな失敗

- 保存の費用を理由に、application のログへ 7 日や 90 日の保存期間を付ける案を、既定のように推奨する。
    - 量が小さく費用が決め手にならないのに短い期間を付けると、後から調べたい時にログが無い。
    - この推奨は、二つの利用先 repository でどちらも利用者に却下された。

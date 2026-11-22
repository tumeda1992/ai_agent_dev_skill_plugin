# Design: 作業の公開の規則をpluginに書き、利用先の文脈に依存させない

## 元の依頼内容

issue #2 のsteeringを完了した時、assistantは「PRが要るなら言って」と利用者へ聞いた。利用者の応答:

> ok。え、PRはいつもいるっていう手順にしてなかったっけ？PR作ったうえでmainでマージしてpushするっていう

assistantは、このrepositoryにその手順が書かれていないこと、`fortune_calculator`・`nanitabe` の文脈が「PRを既定branchへ作り、mergeは利用者が行う」を持つことを示した。利用者の応答:

> a。この規約がnanitabeとかリポジトリにあるのおかしいな。pluginが主語の話だから。pluginに書いてconsumer依存にしないで

（「a」は、issue #2 の作業を `Closes #2` 付きのPRにし、assistantがmainへmergeしてpushする案への回答。PR #30 で実施済み）

## TL;DR

作業の公開（commit、push、PR、merge、既定branchのpush）は、pluginのworkflowが行う工程である。それなのに、どこまで行うか、誰がmergeするかを、利用先repositoryごとの文脈が決めている。文脈に書かれていないrepositoryでは、作業の終わりに毎回利用者へ聞くことになる。書いてあるrepositoryでは、pluginの規則と同じことを書き写して重複させている。

完成後は、公開の流れをpluginが一つの規則として持つ。利用先の文脈には、remote、既定branchの名前、branchの形式、mergeが本番へ適用されるか、のようなrepositoryのfactだけが残る。

作業の終わりに、assistantは利用者に聞かずに、commit → 作業branchのpush → PRの作成まで行う。TBD: PRのmergeと既定branchを最新にするところを誰が行うか（論点3）

## 完成後の姿

### 移行で変えない振る舞いと、意図して変える差分

移行前の基準と対象範囲は [contract-ledger.md](./contract-ledger.md) の「移行前の基準」に置く。対象範囲は、作業の公開を定める記述（plugin repositoryの文脈、`fortune_calculator`・`x_favorites`・`nanitabe` の文脈、pluginの `tasklist-design.md`・`templates/tasklist.md`・`steering/SKILL.md`・`integrate-plugin-changes.md`・`maintenance-plugin-context/SKILL.md`・`branch_pr_issue.md`）である。

次に書く変化以外は全て保存する。

- TBD: 論点2〜9の決定から書く

### 作業の公開の流れ

作業の終わりに、assistantは利用者に聞かずに次を行う。

1. commitする。分け方は`plan-commits`に従う。
2. 作業branchをpushする。
3. PRを作る。`Closes`は[`branch_pr_issue.md`](../../../../plugins/tumeda-dev/docs/development_standards/development_flow/branch_pr_issue.md)に従い、このPRのmergeでissueの作業が終わる時だけ付ける。

作業の終わりは、tasklistがある作業では利用者の確認と最後のtaskが終わった時、planlessの作業ではsteeringの締めくくりのreviewが終わった時である。動作確認の前にcommit・push・PRをしない規則は変えない（確認環境へ載せるcommit・pushと、作業の外へ残るactionを含むphaseの最後のcommit・pushの例外も変えない）。

行えない時は、行えるところまで行い、止まった所と理由を報告する。

| 状態 | 行うところ |
| --- | --- |
| remoteが無い、またはGitHubでない | commitまで |
| 実行環境が、利用者の明示の指示なしのPRの作成やpushを禁じる（cloud sessionの指示等） | 実行環境の指示に従い、PRの作成・pushの前に利用者へ確認する |

PRを頼まれた時だけ作る形、毎回どこまで行うかを聞く形は採らない。どちらもPRの段で作業のたびに往復が一つ増え、利用者の手順（PRを作ったうえでmergeしてpushする）と食い違う。`fortune_calculator`の「commit・push・PR の作成は、利用者が頼んだ時だけ行う」は、この規則に置き換わる。

TBD: PRのmergeと既定branchを最新にするところを誰が行うか（論点3）、その方法（論点10）。steeringの`planless_complete`での置き場（論点5）。escalate-plugin-skill-fixから引き渡された作業の扱い（論点4）。steeringの`planless_complete`での扱い（論点5）。escalate-plugin-skill-fixから引き渡された作業の扱い（論点4）。

### 規則の置き場

TBD: 公開の流れの規則を、pluginのどの文書・skillに置くか（論点6）。

### 利用先の文脈に残すもの

TBD: 利用先の文脈とtemplateに残すfactの欄（論点7）。利用先repositoryの文脈の書き換えを、この作業で行うか（論点8）。

## 要件（Requirements）

### MUST（必達）

- 作業の公開の流れを、pluginの規則として書く。pluginのworkflowは、利用先の文脈に公開の欄があるかどうかで、公開の段を出す・出さないを変えない。
- 作業の終わりに、assistantは利用者に聞かずにcommit → 作業branchのpush → PRの作成まで行う。行えない時は行えるところまで行い、止まった所と理由を報告する。
- 利用先の文脈には、repositoryのfactだけを残す。pluginの規則と同じことを書き写した記述を残さない。
- TBD: 論点2〜9の決定から足す

### SHOULD（できれば）

- TBD

### MAY（あれば嬉しい）

- なし

### 非目標

- `branch_pr_issue.md` の `Closes` と二つのmerge経路の規則を変えない。branchの形式を利用先が宣言する仕組みも変えない。
- 動作確認の前にcommit・push・PRを行わない規則（確認環境と作業の外へ残るactionの例外を含む）を変えない。
- `share-work-in-progress` を変えない。動作確認の前に今のbranchを見せる場面であり、作業の終わりの公開とは別である。

### 受け入れ基準

- TBD: 論点2〜9の決定から書く

## リスクと対策

- 利用先の文脈で利用者が合意した規則（`x_favorites` の「assistantはmergeしない」は issue #31 で合意）を、pluginの規則で上書きする。→ 論点3で、合意の理由（mainへのmergeが本番のbuildを起こす）をpluginの規則がどう扱うかを決める。
- 実行環境が、PRの作成や既定branchへのpushを利用者の明示の指示なしに禁じることがある（cloud sessionの制約等）。→ TBD: 論点2・論点3で扱う。

## テスト方針

- `node scripts/verification/validate-plugin.mjs`、`node scripts/verification/test-task-design-handoff.mjs`、`node --test plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.test.mjs` をassistantが実行する。
- 移行の照合は [contract-ledger.md](./contract-ledger.md) の全IDについてassistantが行う。
- TBD: 論点の決定から足す

## （付録）前提とする既存仕様

- [`branch_pr_issue.md`](../../../../plugins/tumeda-dev/docs/development_standards/development_flow/branch_pr_issue.md): `Closes` はissueの終わりを宣言する。既定branchへのmergeは、issue完了のmergeと検証のためのmergeに分かれる。branch名の形式は利用先の文脈の `### Branch / issue 契約` が宣言する。
- [`tasklist-design.md`](../../../../plugins/tumeda-dev/skills/task-design/tasklist-design.md)「実装後feedbackと公開action」: commit section、push・PR sectionは、文脈に該当の欄がある時だけ作る。無ければ利用者へ確認し、答えを文脈へ書き戻す。

## （付録）変更の実行区分

### 設計中に反映を終えた変更

なし

### 設計中に反映する、他の判断を待っている変更

なし

### tasklist・roadmapに載せて実行する変更

なし

### 分類保留（設計中のみ）

- TBD: 論点2〜9の決定から分類する

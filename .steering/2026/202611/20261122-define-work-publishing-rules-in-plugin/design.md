# Design: plugin repositoryの作業の公開の規則をpluginに書く

## 元の依頼内容

issue #2 のsteeringを完了した時、assistantは「PRが要るなら言って」と利用者へ聞いた。利用者の応答:

> ok。え、PRはいつもいるっていう手順にしてなかったっけ？PR作ったうえでmainでマージしてpushするっていう

assistantは、このrepositoryにその手順が書かれていないこと、`fortune_calculator`・`nanitabe` の文脈が「PRを既定branchへ作り、mergeは利用者が行う」を持つことを示した。利用者の応答:

> a。この規約がnanitabeとかリポジトリにあるのおかしいな。pluginが主語の話だから。pluginに書いてconsumer依存にしないで

（「a」は、issue #2 の作業を `Closes #2` 付きのPRにし、assistantがmainへmergeしてpushする案への回答。PR #30 で実施済み）

## TL;DR

plugin repository（`ai_agent_dev_skill_plugin`）の作業は、escalate経由かどうかによらず、PRを作ってからassistantが手元でmainへmergeしてpushする。PRはmergeの手段ではなく、ひとまとまりの変更の記録である。他のrepositoryはPR経由のsquash mergeで、どの変更がひとまとまりかがPRで分かる。plugin repositoryのescalate経由の作業は、これまでPRを作らずに手元でmainへmergeしていたため、ひとまとまりが分かりづらかった。GitHub上でPRをmergeする操作はAIに任せない。

この規則はpluginが持つ。plugin repositoryの文脈のfile（`tumeda-dev-plugin-context.md`）は利用先へ配る文脈のtemplateも兼ねるため、plugin repositoryの規則を置かない。利用先repositoryの公開の規則は変えない。

## 完成後の姿

### plugin repositoryの作業の公開の流れ

plugin repositoryの作業の終わりに、assistantは利用者に聞かずに次を行う。

1. commitする。分け方は`plan-commits`に従う。
2. 作業branchをpushする。
3. PRを作る。`Closes`は[`branch_pr_issue.md`](../../../../plugins/tumeda-dev/docs/development_standards/development_flow/branch_pr_issue.md)に従い、このPRのmergeでissueの作業が終わる時だけ付ける。
4. 手元のmainへ`git merge --no-ff <作業branch>`でmergeする。merge commitのmessageは「Merge pull request #<PR番号>: <PRの題名>」にする。GitHub上でPRをmergeする操作は行わない。
5. mainをpushする。GitHubは、PRの変更がmainに入ったことからPRをmerge済みとして扱い、`Closes`のissueを閉じる。
6. pluginをupdateする（今の`integrate-plugin-changes.md`の「pluginをupdateする」）。

`--no-ff`でmerge commitを必ず作るのは、fast-forwardになるとmainの履歴からひとまとまりの境目が消えるためである。merge commitにPR番号を入れ、mainの履歴からPRを引けるようにする。

行えない時は、行えるところまで行い、止まった所と理由を報告する。

| 状態 | 扱い |
| --- | --- |
| 実行環境が、利用者の明示の指示なしのPRの作成やmainへのpushを禁じる（cloud sessionの指示等） | 実行環境の指示に従い、その操作の前に利用者へ確認する |
| 利用者の環境にあるpluginのupdateを、実行環境から行えない（cloud session等） | 5までを行い、updateを利用者の環境で行うことを報告する |

escalate経由の作業も同じ流れにする。2026-08-31の決定（`.steering/2026/202608/20260831-add-incident-flow-and-subagent-boundary/`）のうち「PRを作らない」はこの流れで置き換え、「`steering`の完了後actionを変えない」「pluginの更新をさっと済ませてメインの作業へ戻る」は保つ。PRを作ってもGitHubでmergeする往復は増えない。mergeは手元で行うためである。

### 規則の置き場

TBD: この流れを、pluginのどこに置くか。escalate経由でない作業の終わりに、誰がこの流れを始めるか（論点6）。

### 移行で変えない振る舞いと、意図して変える差分

移行前の基準と対象範囲は [contract-ledger.md](./contract-ledger.md) の「移行前の基準」に置く。対象範囲は、plugin repositoryの作業の公開を定める記述（plugin repositoryの文脈の「Git / GitHub公開条件」、`escalate-plugin-skill-fix/SKILL.md`と`integrate-plugin-changes.md`）である。

次に書く変化以外は全て保存する。

- escalate経由の作業も、PRを記録として作る（L3、P7）。
- escalate経由でないplugin repositoryの作業にも、同じ流れを当てる。TBD: 始める担当（論点6）
- plugin repositoryの文脈の「Git / GitHub公開条件」から、escalate経由の取り込みの一行を消す（L3）。remote、既定branch、PR作成scriptのpath（L1、L2、L4）は残す。

## 要件（Requirements）

### MUST（必達）

- plugin repositoryの作業は、escalate経由かどうかによらず、PRを作ってから手元でmainへmergeしてpushする。
- assistantは、GitHub上でPRをmergeする操作を行わない。
- この規則をpluginに置き、`tumeda-dev-plugin-context.md`には置かない。
- 作業の終わりに、assistantは利用者に聞かずに、commitからpluginのupdateまで行う。行えない時は、行えるところまで行い、止まった所と理由を報告する。
- mainへのmergeは`--no-ff`で行い、merge commitのmessageにPR番号を入れる。
- TBD: 論点6・論点11の決定から足す

### SHOULD（できれば）

- なし

### MAY（あれば嬉しい）

- なし

### 非目標

- 利用先repository（`fortune_calculator`・`x_favorites`・`nanitabe`等）の公開の規則と、`tasklist-design.md`が文脈の欄で公開の段を出し分ける仕組みは変えない。利用先ではPRのmergeを利用者が行い、PRがreviewとひとまとまりの単位として働いているためである。
- `steering`の完了後actionは変えない。PRを経由するかはrepositoryの性質で決まり、`steering`の性質ではない（2026-08-31の決定）。
- `branch_pr_issue.md`は変えない。

### 受け入れ基準

- TBD: 論点6・論点11の決定から書く

## リスクと対策

- 実行環境が、利用者の明示の指示なしのPRの作成やmainへのpushを禁じることがある（cloud sessionの指示等）。→ 実行環境の指示に従い、その操作の前に利用者へ確認する（「plugin repositoryの作業の公開の流れ」）。

## テスト方針

- `node scripts/verification/validate-plugin.mjs`、`node scripts/verification/test-task-design-handoff.mjs`、`node --test plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.test.mjs` をassistantが実行する。
- 移行の照合は [contract-ledger.md](./contract-ledger.md) の対象行についてassistantが行う。
- TBD: 論点の決定から足す

## （付録）前提とする既存仕様

- [`branch_pr_issue.md`](../../../../plugins/tumeda-dev/docs/development_standards/development_flow/branch_pr_issue.md): `Closes` はissueの終わりを宣言する。既定branchへのmergeは、issue完了のmergeと検証のためのmergeに分かれる。branch名の形式は利用先の文脈の `### Branch / issue 契約` が宣言する。
- [`tasklist-design.md`](../../../../plugins/tumeda-dev/skills/task-design/tasklist-design.md)「実装後feedbackと公開action」: commit section、push・PR sectionは、文脈に該当の欄がある時だけ作る。無ければ利用者へ確認し、答えを文脈へ書き戻す。
- [`integrate-plugin-changes.md`](../../../../plugins/tumeda-dev/skills/escalate-plugin-skill-fix/integrate-plugin-changes.md): escalate経由のplugin repositoryの作業を、PRを経由せずmainへ取り込み、pluginをupdateする。2026-08-31の決定（`.steering/2026/202608/20260831-add-incident-flow-and-subagent-boundary/task-design-discussion.md`）による。

## （付録）変更の実行区分

### 設計中に反映を終えた変更

なし

### 設計中に反映する、他の判断を待っている変更

| 対象 | 待っている判断 | 参照するdesign section |
| --- | --- | --- |
| `plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md`「Git / GitHub公開条件」からL3の一行を消し、`validate-plugin.mjs`のそのassertionを外す | 論点6。L3の中身を持つ置き場と、`escalate-plugin-skill-fix/SKILL.md`の取り込みの文を一緒に直すため | 移行で変えない振る舞いと、意図して変える差分 |

### tasklist・roadmapに載せて実行する変更

なし

### 分類保留（設計中のみ）

- TBD: 論点6・論点11の決定から分類する

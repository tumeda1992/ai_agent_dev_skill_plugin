# Design: escalate経由のplugin更新でも、ひとまとまりの記録としてPRを作る

## 元の依頼内容

issue #2 のsteeringを完了した時、assistantは「PRが要るなら言って」と利用者へ聞いた。利用者の応答:

> ok。え、PRはいつもいるっていう手順にしてなかったっけ？PR作ったうえでmainでマージしてpushするっていう

assistantは、plugin repositoryの文脈には、escalate経由の作業を「PRを経由せずmainへmergeしてpush」とする一行しか無いことを示した。利用者の応答:

> a。この規約がnanitabeとかリポジトリにあるのおかしいな。pluginが主語の話だから。pluginに書いてconsumer依存にしないで

その後の議論で、利用者は次のように意図を示した（[task-design-discussion.md](./task-design-discussion.md) 論点1・論点6）。

> いや、だからこそプラグインはエスカレでPR作りたい。最初に違う方針にしたとしても
>
> なんでかというと、他に関してはpr経由のマージだからスカッシュマージだけど、プラグインのエスカレはローカルのmainマージになるからどの塊か分かりづらいのよ。で、prでのマージはaiに任せたくない。だから、記録としてprを作りたい（最初も同じ意図だからPR作るようにしたと思ってたけど）

> いや、論点6はcだろ。文脈みろよ。エスカレだからpr経由じゃないって言ってんだよ。

## TL;DR

escalate経由でplugin repositoryへ移った作業は、ついでの更新なので、手元でmainへmergeする。これまではPRを作らなかったため、mainの履歴からどの変更がひとまとまりかが分からなかった。通常の作業はPR経由でmerge（squash merge）しており、PRがひとまとまりを示す。

完成後は、escalate経由の作業でもPRを記録として作り、手元で`git merge --no-ff`し、merge commitにPR番号を入れる。GitHub上でPRをmergeする操作はassistantに任せない。この規則は`escalate-plugin-skill-fix`が持ち、利用先へ配る文脈のtemplate（`tumeda-dev-plugin-context.md`）からは取り除く。

## 完成後の姿

### escalate経由の作業の取り込みの流れ

escalate経由でplugin repositoryへ移った作業で、steeringが完了した時、assistantは利用者に聞かずに次を行う。正本は[`integrate-plugin-changes.md`](../../../../plugins/tumeda-dev/skills/escalate-plugin-skill-fix/integrate-plugin-changes.md)である。

1. 作業branchをpushする。
2. PRを作る。`Closes`は[`branch_pr_issue.md`](../../../../plugins/tumeda-dev/docs/development_standards/development_flow/branch_pr_issue.md)に従い、このPRのmergeでissueの作業が終わる時だけ付ける。
3. `main`へ切り替える。
4. `git merge --no-ff <作業branch>`でmergeする。merge commitのmessageは「Merge pull request #<PR番号>: <PRの題名>」にする。
5. `main`をpushする。GitHubは、PRの変更が`main`に入ったことから、PRをmerge済みとして扱う。
6. pluginをupdateする。installされたpluginのcommitが`main`の先端と一致することを確かめ、実行中のsessionへの反映を利用者へ案内する（今の手順のまま。番号だけ6〜8になる）。

PRはmergeの手段ではなく、ひとまとまりの記録である。`--no-ff`でmerge commitを必ず作るのも同じ理由である。fast-forwardになると、`main`の履歴からひとまとまりの境目が消える。

mergeを手元で行う理由は、2026-08-31の決定（`.steering/2026/202608/20260831-add-incident-flow-and-subagent-boundary/`）のまま保つ。plugin repositoryは利用先から見てsubであり、GitHubを開いてmergeする往復は、メインの作業へ戻るまでの時間を延ばす。その決定のうち「PRを作らない」だけを、この流れで置き換える。

行えない時の扱い:

| 状態 | 扱い |
| --- | --- |
| 実行環境が、利用者の明示の指示なしのPRの作成や`main`へのpushを禁じる（cloud sessionの指示等） | 実行環境の指示に従い、その操作の前に利用者へ確認する |
| 実行環境から、利用者の環境のpluginをupdateできない（cloud session等） | 5までを行い、6からを利用者の環境で行うことを報告する |

escalate経由でないplugin repositoryの作業は、この流れに従わない。`integrate-plugin-changes.md`の冒頭にそう書く。

### 規則の置き場

取り込みの流れは、escalate経由の作業だけのものなので、`escalate-plugin-skill-fix`の内部指示（`integrate-plugin-changes.md`）に置いたまま書き換える。`AGENTS.md`等からの案内は足さない。

plugin repositoryの文脈のfile（`plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md`）は、`maintenance-plugin-context`が利用先にinstanceが無い時にtemplateとして写す。escalateの取り込みの規則をここに書くと、利用先の文脈へ写る。そのため「Git / GitHub公開条件」から取り込みの一行を消す。remote、既定branch、PR作成scriptのpathは、plugin repositoryのfactなので残す。

### steeringのplanless完了での公開

steeringの締めくくりのreviewで、`planless_complete`には公開の段が無いことが分かった。tasklistがある作業はtasklistのpush・PR sectionで公開まで進むが、planlessの作業は公開しないまま完了し、issue #2 の終わりに「PRが要るなら言って」と問う往復が生じた。

`steering/SKILL.md` 5-1の完了報告の前に、task-design内で適用した変更を公開する段を置く。

- commit・push・PRを行う条件と方法は、tasklistのcommit section・push・PR sectionと同じく`tasklist-design.md`「実装後feedbackと公開action」に従い、steeringへ写さない。文脈に公開条件がある利用先では聞かずにPRまで進み、無い利用先では一度だけ利用者へ確認して文脈へ書き戻す。
- この段はPRの作成で終わり、PRのmergeは行わない。PR経由のmergeはassistantに任せない。
- escalate経由の作業では、続けて`integrate-plugin-changes.md`に従う。
- 完了報告には、公開した先（PRのURL）か、公開しなかった理由を含める。

### 設計前調査と議論の進め方の再発防止

締めくくりのreviewで、この作業の行き違いの原因から二つを足す。

- `task-design/SKILL.md`の設計前調査の確認項目に、同じ主題を過去に決めた作業の決定と理由を足す。この作業では、2026-08-31に決めた主題を、決定を知らないまま問い直した。
- `facilitate-discussion/SKILL.md`の「decisionの境界を判定する」に、利用者の発言から推して広げた行を別の問いとして問うことを足す。この作業では、escalate経由の話を、利用者が言っていないescalate経由でない作業へ広げた行を、提案の表に混ぜた。

### chatで論点の段を示さない

議論の途中で、利用者から「重さってセッションに出さなくていいわ。うるさい。気になったら自分でディスカッションファイル見にいく」と指摘された。`facilitate-discussion/round-trip.md`は「chatでは、各論点の番号と段、…を示し」としていた。chatから段を外し、議論記録の`**重さ:**`の欄は残す。段は一往復の組を選ぶためのものであり、利用者が気になれば議論記録を読む。

### 移行で変えない振る舞いと、意図して変える差分

移行前の基準と対象範囲は [contract-ledger.md](./contract-ledger.md) の「移行前の基準」に置く。次に書く変化以外は全て保存する。

- escalate経由の取り込みで、PRを記録として作る。mainへのmergeは`--no-ff`で行い、merge commitにPR番号を入れる。GitHub上のPRのmergeはassistantが行わない（P7）。
- `escalate-plugin-skill-fix/SKILL.md`の取り込みの一文を「PRを記録として作り、手元で`main`へ取り込み」にし、反映の操作の番号を7から8へ直す（P7に伴う追随）。
- plugin repositoryの文脈の「Git / GitHub公開条件」から、escalate経由の取り込みの一行を消す（L3）。
- `facilitate-discussion/round-trip.md`のchatの示し方から段を外す（対応表の範囲の外で、議論の途中に加えた変更）。
- `steering/SKILL.md` 5-1に、完了報告の前の公開の段を足す（P6。締めくくりのreviewで加えた変更）。
- `task-design/SKILL.md`の設計前調査と、`facilitate-discussion/SKILL.md`のdecisionの境界に、再発防止の一行ずつを足す（対応表の範囲の外で、締めくくりのreviewで加えた変更）。

## 要件（Requirements）

### MUST（必達）

- escalate経由の作業の取り込みで、PRを記録として作る。
- 手元で`git merge --no-ff`し、merge commitのmessageを「Merge pull request #<PR番号>: <PRの題名>」にする。
- assistantは、GitHub上でPRをmergeする操作を行わない。
- 取り込みの規則は`escalate-plugin-skill-fix`が持ち、`tumeda-dev-plugin-context.md`には置かない。
- 実行環境がPRの作成や`main`へのpushを禁じる時、pluginのupdateを行えない時の扱いを、取り込みの流れに書く。
- chatで論点の段を示さない。
- steeringの`planless_complete`は、完了報告の前に、tasklistと同じ条件でcommit・push・PRまで公開する。PRのmergeは行わない。

### SHOULD（できれば）

- なし

### MAY（あれば嬉しい）

- なし

### 非目標

- escalate経由でないplugin repositoryの作業のmergeは変えない。通常どおりPR経由でmergeし、GitHub上のmergeはassistantに任せない。
- 利用先repositoryの公開の規則（`fortune_calculator`・`x_favorites`・`nanitabe`の文脈）と、`tasklist-design.md`が文脈の欄で公開の段を出し分ける仕組みは変えない。
- `steering`に、PRを経由しない取り込みやmergeを持ち込まない。PRを経由するかはrepositoryと作業の始まり方で決まり、`steering`の性質ではない（2026-08-31の決定）。steeringが足すのは、tasklistと同じ条件のPRの作成までである。
- `branch_pr_issue.md`は変えない。
- 議論記録の`**重さ:**`の欄は変えない。

### 受け入れ基準

- `integrate-plugin-changes.md`が、escalate経由の作業だけを対象とすることを冒頭に書き、5stepの取り込み（push、PR、mainへの切替、`--no-ff`のmerge、push）と、PRを記録として作る理由、GitHub上でmergeしない理由、行えない時の扱いを持つ。「PRを経由せず」の文が無い。
- `escalate-plugin-skill-fix/SKILL.md`の取り込みの一文が、PRを記録として作ることを示し、反映の操作の番号が8を指す。
- `tumeda-dev-plugin-context.md`の「Git / GitHub公開条件」に、escalate経由の取り込みの一行が無い。remote、既定branch、PR作成scriptのpathは残る。
- `round-trip.md`のchatの示し方に段が無く、段を示さない理由がある。
- `steering/SKILL.md` 5-1が、完了報告の前の公開の段を持ち、条件を`tasklist-design.md`から参照し、PRのmergeを行わないことを示す。
- `task-design/SKILL.md`の設計前調査の確認項目に、同じ主題の過去の決定がある。`facilitate-discussion/SKILL.md`のdecisionの境界に、推して広げた行の扱いがある。
- `validate-plugin.mjs`が上の各文を検査し、versionが9.1.7で揃っている。

## リスクと対策

- escalate経由でないplugin repositoryの作業で、assistantがこの流れを当てて手元でmergeする。→ `integrate-plugin-changes.md`の冒頭に「escalate経由でないplugin repositoryの作業は、この流れに従わない」と書く。
- PRを作ったことを理由に、assistantがGitHub上でPRをmergeする。→ 同fileに、やってしまいがちな行動として書く。

## テスト方針

| 確認 | 担当 | 手段 |
| --- | --- | --- |
| 受け入れ基準の各文があり、撤去した文が無い | assistant | `node scripts/verification/validate-plugin.mjs` |
| task-designの引継ぎの検査が壊れていない | assistant | `node scripts/verification/test-task-design-handoff.mjs` |
| 議論記録の読取helperが壊れていない | assistant | `node --test plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.test.mjs` |
| 対応表の対象行（L1〜L5、P6〜P8）が、意図した変化以外は保存されている | assistant | 変更前後の差分を対応表の行と照合する |

## （付録）前提とする既存仕様

- [`branch_pr_issue.md`](../../../../plugins/tumeda-dev/docs/development_standards/development_flow/branch_pr_issue.md): `Closes`はissueの終わりを宣言する。
- 2026-08-31の決定（`.steering/2026/202608/20260831-add-incident-flow-and-subagent-boundary/task-design-discussion.md`）: escalate経由のplugin repositoryの作業は手元でmainへmergeし、pluginをupdateする。`steering`の完了後actionは変えない。
- [`maintenance-plugin-context/SKILL.md`](../../../../plugins/tumeda-dev/skills/maintenance-plugin-context/SKILL.md)「解決とmaintenance」: instanceが無い時は、pluginの`skills/`直下の`tumeda-dev-plugin-context.md`をtemplateとして写す。

## （付録）変更の実行区分

### 設計中に反映を終えた変更

| 対象 | 変更 | 参照するdesign section | validation |
| --- | --- | --- | --- |
| `escalate-plugin-skill-fix/integrate-plugin-changes.md`、`escalate-plugin-skill-fix/SKILL.md`、`tumeda-dev-plugin-context.md`、`validate-plugin.mjs`、version 9.1.7 | commit `e31e14b` | escalate経由の作業の取り込みの流れ、規則の置き場 | `plugin validation passed`、`task-design handoff tests passed` |
| `facilitate-discussion/round-trip.md`、`validate-plugin.mjs` | commit `3d78cdb` | chatで論点の段を示さない | `plugin validation passed` |
| `task-design/SKILL.md`、`facilitate-discussion/SKILL.md`、`validate-plugin.mjs` | commit `dfa1011` | 設計前調査と議論の進め方の再発防止 | `plugin validation passed`、`task-design handoff tests passed` |
| `steering/SKILL.md`、`validate-plugin.mjs` | commit `100cd4b` | steeringのplanless完了での公開 | `plugin validation passed`、`task-design handoff tests passed` |

### 設計中に反映する、他の判断を待っている変更

なし

### tasklist・roadmapに載せて実行する変更

なし

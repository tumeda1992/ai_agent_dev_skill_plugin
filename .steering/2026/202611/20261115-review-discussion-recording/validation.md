# 記録の役割変更の検証

## 現在の合意状態

対象変更の具体案は論点3で合意済みだが、design.md全体への合意は未取得である。
全体合意を補完した`planless_complete`の返却は撤回し、task-design Step4のreview待ちへ戻した。
利用者の原文、誤った判断、Step3の適用とStep4以降の完了判定の区別、現design全体へのreview提案は`task-design-discussion.md`の論点4に保存している。
以下の検証成功は適用済み変更の証拠であり、設計全体の承認やtask-design完了の証拠ではない。

## 逸脱の修復と白箱照合の回復

以下は追加指摘を受けた後の事後監査・修復である。初回に編集前の全契約ledgerと白箱照合を完了したとは扱わない。
先のmigration-audit.jsonは置換片の対応一覧であり、それだけで全契約の意味保存を証明したとした判断は撤回する。
その不足を、利用者に差分を手直ししてもらう前提の全体reviewへ渡したことも誤りだった。

Issue本文と論点3の具体案/ok、task-designの全指示、baselineと19fileの実差分を照合した。
記録先・任意性の変更とは別に、facilitate-discussion/SKILL.mdの保存先・読取sectionで次の旧条件を落としていた。

| 逸脱 | 復元した意味 |
| --- | --- |
| 所属不整合等でもlogの更新だけを止める形へ狭めた | logを使う場合の不整合で停止し、必須fileや根拠の読取不能を未確認・停止理由として返す |
| 新規用pathを既存にも適用できる形へし、旧暫定名の維持を除去した | 既存接続を継続、新規だけ規定pathに置き、命名統一だけの旧暫定名の移動を禁止する |
| 必須link撤去と一緒にlabel条件を除去した | 任意でlogへのlinkを置く場合は、論点・回・必要ならrecord番号をlabelに明示する |

callerが保全したmanifestと19fileの実hashを照合し、全件一致してから上の復元だけを行った。
追加のsource変更は本体1fileの同じsectionに限る。log任意化・Git管理・discussionの正本性・権限分類の変更を増やしていない。
他の18fileの差分は、合意3の正本移動・条件付きlog読取・ignore・検査と、既存version規約に対応する。この照合では別の独立した未合意仕様追加は見つからなかった。

復元後、旧原文の6条件が現文に同一文字列で存在することと、logを使う時/任意linkを置く時だけの条件に接続していることを確認した。
既存の`validate-plugin.mjs`は`plugin validation passed`、`git diff --check`も成功した。
helper code、test code、fixtureは今回変えていない。既存自己testとfresh agentの先行結果を再実施したとは扱わない。

[white-box-recovery.json](white-box-recovery.json)へ、19fileの旧revisionと現hash、原文同一81範囲のhash/行対応、章構造171件のrole・親子・前後関係、変更65hunk、旧文117単位と新文197単位の対応を事後保存した。
未変更範囲は原文一致を機械照合し、同じ内容への不要な新分析は作っていない。変更範囲にはsource、kind、原文の意味、destination、分類・根拠、照合内容を持たせた。
この索引の未対応hunkは0、原文保持範囲の不一致は0である。文/行による索引件数を、独立した能力の数や意味保存の保証率には読み替えない。
旧一覧を編集前gateの履行へ見せ直すことも、先行smokeを白箱照合後の実施へ見せ直すこともできない。
design全体合意は未取得で、task-designのready・完了は撤回したままである。

## 対象と根拠

利用者が受け入れた、discussionを正本、内部logをGit管理外の任意の作業控えとする変更集合を検証する。
保存済みの具体案と応答は`task-design-discussion.md`の論点3・提案0と、そのフィードバックにある。
保存先、読取・再開・回復、consumer、検証を合わせて変更し、合意・導出・委託・機械適用の権限条件は変えない。

## 既存の権限条件の調査

このrepositoryの過去の議論では、導出変更を報告したturnで即反映する案と、次の実応答を受けてから反映する案を比較し、利用者が後者を選んでいる。
出典は`.steering/2026/202610/20261018-escalate-pending-plugin-improvements/task-design-discussion/task-design-discussion-11-15.md`の論点13で、原文の応答は`a`である。
その記録は2026年10月24日のcommitへ保存され、現行`derived-change.md`はその反映時点と、架空の承認を作らない分類を持つ。

Issue #10は2026年11月1日作成、11月15日更新で、上の合意より後である。
今回再取得した本文の具体案は、内部logのGit管理と、検討記録単体で反復の経緯を残すことに関するものであり、反映時点の具体的な取下げは書かれていない。
タイトルの「自動ok」を、既存の全権限や反映時点を撤去する指定とは扱わない。
今回の`derived-change.md`の差分は、証拠と経緯をdiscussionへ残す一文だけで、権限分類・報告後の次実応答待ち・訂正の扱いは不変である。

## 適用と検査

- `node scripts/verification/validate-plugin.mjs`: `plugin validation passed`。
- `node scripts/verification/test-task-design-handoff.mjs`: `task-design handoff tests passed`。
- `node --test plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.test.mjs`: 26 pass、0 fail、1 skip。
- skipは実在記録を指定した時だけ使う既存の条件付きcaseであり、新しいcaseの未実施ではない。
- `git diff --check`: 成功。
- `git check-ignore`で今回の未追跡の`internal-records/`がignore対象であることを確認した。
- helperの実装codeは変更していない。既存の任意の`--log`を使う呼出し条件と、その挙動を守るtestを変更した。
- version宣言4箇所と検査側の期待値1箇所を、既存skill指示の変更として`9.0.1`へ揃えた。

validatorの初回実行では、新しい検査を後方の変数宣言より前へ置いたため`ReferenceError`になった。
対象pathを既存の`skillPath`で直接解決する形へ直し、同じ検査を通過させた。契約を外して通したものではない。

## 新しい挙動のcase

| case | 方法 | 観測した結果 |
| --- | --- | --- |
| 内部logを作らない新規の記録 | 新しいfixtureでsnapshot・本文・現在の問いを取得し、compareを実行 | snapshotのfileはdiscussionだけ。本文と現在の案を取得でき、compareはexit 0 |
| 既存logを比較根拠に使う再開 | 既存logを明示指定したsnapshotとcompare | discussionとlogの2fileが対象、compareはexit 0 |
| 根拠として指定したlogの消失 | snapshot後にそのfixtureのlogを削除し、同じ指定でcompare | exit 1。取得不能を確認済みや単なる変更ありへ変換しない |
| 任意の旧logを使わない読取 | log削除後、`--log`を省略して本文を取得 | discussionだけのsnapshotと全文取得が成立。必要証拠の不足を隠してよいという意味ではない |

## 記述と責務のreview

`skill-update-review`を設計時と編集後に明示適用した。対象は`facilitate-discussion/SKILL.md`と内部指示・templateである。
入口解決、読取、分割、回復は既に内部fileへ分かれている。
今回の内部logの任意化は、同じ論点・回の記録と読取条件を変えるもので、別の判断・現在状態・完了条件を持つ工程を増やさない。
追加の切り出し候補はない。新しいskillやwrapperは作らない。

編集には、公式の[skill-creator](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md)を取得して適用した。
既にあるintentと具体案への合意を入力に使い、同じ内容のinterviewや進め方確認を増やしていない。

`document-review`では、旧文と変更後の差分、内容の濃さ、記法、命名、公開範囲を確認した。
内部logなし、必要な既存logあり、必要なlogが取得不能、単純な訂正という異なるcaseで、必須の説明と任意の控えの境界を照合した。
比較・訂正の経緯を残す規則に、再送の宛先の例と、架空の比較を増やさなくてよい表記訂正の例を添えた。

合意3の即時反映後に`doc-enricher`を提案modeで適用した。
関連するroot README、docsの入口、skill本体、検討記録guideを確認し、今回の役割分担と理由はその既存の担当箇所へ反映されているため、別のREADME/docsへ同じ規則を複写する候補はない。

## baselineと意味保存

適用前のHEADと原文snapshotを固定し、51変更単位の原文・置換後・合意根拠を編集前に記録した。
変更集合は、正本と任意logの役割、本文へ残す経緯、必須link、読取・再開・回復、ignore、consumer、validatorとその検証である。
保存済みの過去の提案・応答と、既存のtrackedな内部logを削除していない。
合意・権限・採番・親子関係・単一writer・本文の版照合に関する既存条件を、記録先の変更を理由に緩めない。

## 新しい実行者と最終状態の確認

新しい実行者へ架空入力の2fixtureを渡し、現行skillを読取適用して記録・再開させた。結果は指定範囲でPASSだった。
Aでは、内部logを作らず、旧案「再送は初回宛先を固定」、訂正「送信内容は固定でも配送先は変更後へ」、その比較、配送先を更新する提案1と限界を本文へ保存した。提案1は未合意のまま応答待ちに保たれた。
Bでは、存在しない古い任意logへのlinkを残したdiscussionを読み、現在案を再提示でき、compareはexit 0だった。別途、明示的にsnapshotへ加えた根拠logを削除した後はcompareがexit 1で「snapshot対象がfileではない」となった。
結果とCLI証跡は、このsessionの`/tmp/issue10-behavior-smoke/results.md`と同directoryの`cli-artifacts/`へ保存された。架空の配送仕様の実装、旧版との性能比較、全modelでの再現率は検証していない。

最終discussionでは、親の状態を分解済み、子の2件を決定へ揃え、合意後の適用・検証と自動okの調査結果を追記した。
保存前のsnapshotと全文読取後のcompareはexit 0で、意図した保存後に更新snapshotを取得し、再度全文を読んだ後のcompareもexit 0だった。`check`は`problems=[]`、論点3件である。
designは検索と目視通読の両方で未決事項・議論残骸がないことを確認した。対象成果物への反映待ち、分類保留、実行計画に載せる変更はなく、tasklistとroadmapは作成していない。


## 設計review用Draft PRの公開前に行った追加検証

PRで現状を読むための承認済みcommit計画に対し、公開前の中間版と現worktreeを新たに検証した。
`request_id=issue10-review-pr-validation-1`、`attempt=1`、結果は`passed`である。
この節は今回の追加実施を記録する。過去の検証時点・未実施範囲を書き換えるものではない。

### 対象の違い

- **中間版:** HEAD全体に、承認済みの「本文具体化・内部log必須維持」の9file中間案を適用した`/tmp/issue10-publish-validation/intermediate`。
- **最終版:** `/workspace/ai_agent_dev_skill_plugin`の現worktree。ここでいう最終版は公開対象の現状を指し、設計・実装の完了を意味しない。

### 実測結果

各版で次の3commandを実行し、計6commandすべてexit 0だった。

- `node scripts/verification/validate-plugin.mjs`
- `node scripts/verification/test-task-design-handoff.mjs`
- `node --test plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.test.mjs`

| 対象 | validator | handoff | helper |
| --- | --- | --- | --- |
| 中間版 | `plugin validation passed` | `task-design handoff tests passed` | 24 pass・0 fail・1 skip（全25件） |
| 最終版 | `plugin validation passed` | `task-design handoff tests passed` | 26 pass・0 fail・1 skip（全27件） |

両版のskipは「指定された実在の分割記録を修復せず原文・現在・snapshotで読む」という既存の条件付きcaseであり、成功件数には含めない。
`/tmp/issue10-publish-validation/`の`request.json`・`result.json`・`result.md`と、`intermediate-validate.log`・`intermediate-handoff.log`・`intermediate-helper.log`・`final-validate.log`・`final-handoff.log`・`final-helper.log`を照合した。
ログの成功文・件数・exit値は上表と一致し、失敗はなかった。これらの実行artifactは一時directoryにあり、この節に結果と対象を記録している。

### この検証で確定しないこと

これはrepositoryのvalidator・handoff・helperの検証であり、Claude/Codexへ記録生成を新たに実行させた検証ではない。
設計全体の合意は未取得、β本文は設計用draftのままで最終skill pathへ未適用である。
今回の結果は未適用のβsourceや追加の記録構造指示を検証済みにせず、ready・phase完了の根拠にも使わない。
source・分割patch・当初の検証履歴はこの記録追記で変更していない。

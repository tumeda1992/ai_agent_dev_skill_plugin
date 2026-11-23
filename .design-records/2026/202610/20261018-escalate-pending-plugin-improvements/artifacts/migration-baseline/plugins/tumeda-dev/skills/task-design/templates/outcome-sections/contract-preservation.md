### contractの保存と明示差分

<!--
code、skill、prompt、workflow、template、document等を移動、分割、統合、owner変更、形式置換する時、
移行前に存在したcontractの何が保存され、何が合意済み差分として変わった状態になるかを描く。

完成後の保存・差分状態は、次の二層で表す。
- design.md: baseline scope、明示差分以外の全量保存宣言、人が理解できる完成後の意味差分、根拠となるledger IDへのcitation
- ledger: contract IDごとの原文、`KEEP | MOVE | ADAPT | ADD | CHANGE | RETIRE`、source、destination、agreement、verification evidence

design.mdへledger行を転記しない。baseline scope内のcontractは、design.mdに明示した意味差分以外を全量保存する。
design.mdの各意味差分からledger IDへ降りることで、人が読む完成後の世界とcontract単位の証明を接続する。

ここでいうcontractは公開APIだけではない。入力、action、結果、必須順序、gate、停止、再開、取消、
owner、例外、理由、正しい例、失敗例、判断質問、強調等が生む挙動と判断能力を含む。

migrationやrefactoringは作業手段であって、完成後outcomeではない。
このsectionは作業手順を所有せず、移行前と完成後の関係だけを所有する。
baselineの固定、二層ledger、順方向・逆方向照合、black-box、validator等の一般procedureは
`function_migration_policy.md`を正本として参照する。

なぜ必要か:
- 新しいownerに似た記述があるだけで、旧contractの判断能力が保存されたと誤認することを防ぐため。
- baseline scopeを固定し、明示差分以外を全量保存するclosed-worldの完成状態を作るため。
- ledgerの全contract IDをdesignへ複製せず、読者が許可された意味差分だけを理解できるようにするため。

owner境界:
- このsectionは、移行前contractと完成後contractの関係、全量保存宣言、明示差分を所有する。
- 変更後のworkflow、caller contract、code structure、file内容、data等の具体像は対応するoutcome sectionが所有し、ここでは参照する。
- `KEEP | MOVE | ADAPT | ADD | CHANGE | RETIRE`、contract ID、source range、destination、agreement、verification evidenceの全明細はledgerが正本であり、ここへ複製しない。
- designは完成後の意味差分を人が理解できる粒度で記載し、各項目から根拠となるledger IDへcitationする。
- file分割、rename、owner移動、形式置換の完成後構造は対応するoutcome section、意味保存の分類と証拠はledgerが所有する。
- migrationの手順、停止点、rollout順序、test commandはこのsectionへ書かない。

NG:
- 既存仕様を維持する
- migration policyに従う
- 詳細はledgerを参照
- 保存されるcontractをgroup別に一覧化する
- `KEEP | MOVE | ADAPT`をledgerから転記する
- `ADD | CHANGE | RETIRE`のclassificationとcontract原文を一行ずつ転記する
- 許容するfile分割、rename、owner移動を別表で列挙する
- baseline作成、ledger記入、順方向照合、逆方向照合、test実行を順に列挙する
- ledgerのcontract IDを全件貼り、完成後に何が不変で何が変わるかを人が読めない状態にする

記述のMUST:
- 移行前を再現できるbaseline、対象fileと連続範囲等のscope、ledgerへのlinkを示す。
- 「次に記載する意味差分以外は全量保存する」というclosed-worldの完成後差分宣言を示す。
- 完成後の意味差分を人が理解できる項目として記載し、移行前との違い、詳細owner、根拠となるledger IDと合意へ接続する。該当なしの場合も`なし`と明記する。
- designへledgerのclassificationやcontract原文を転記しない。ledger IDは出典として使い、原contract、classification、source、agreement、verificationへ戻れるようにする。
- 同じ上位decisionに完全に規定され、完成後に一つの意味差分として理解すべき複数IDだけを一項目へまとめる。独立した意味差分を要約で隠さない。
- 意訳は短縮を意味しない。原contractの条件、限定、強度が変わる表現を避け、疑義があれば変更項目を分ける。
- `KEEP | MOVE | ADAPT`、保存contract group、内部構造変更を一覧化しない。それらの全明細と証拠はledgerおよび変更後構造を所有するoutcome sectionへ委ねる。
- ledgerを詳細evidenceの正本としてlinkし、designには合意された意味差分だけを人が読める粒度で示す。
- migration procedureの完了を完成後outcomeの代わりにしない。

判断基準:
- baseline scopeと明示差分から、何が変わらないかを補集合として一意に判断できるか。
- designだけで合意された意味差分を理解し、各項目のcitationからledgerのcontract、classification、合意、証拠まで辿れるか。
- citationされたledger IDを合算した意味と、designの変更項目が過不足なく対応しているか。
- 明示項目以外の差分が紛れ込んだ時、完成後の差分宣言との矛盾として気づけるか。
- 保存contractや`KEEP | MOVE | ADAPT`を列挙してledgerの劣化copyを作っていないか。
- classification tableを作り、`ADD | CHANGE | RETIRE`だけの劣化copyへ置き換えていないか。
- 一般procedureをこのsectionへ複製せず、今回固有の保存・差分結果だけを記載しているか。
-->

**baselineとevidence:**

| 項目 | 内容 |
| --- | --- |
| baseline | {revision、tag、snapshot等、移行前を再現できる識別子} |
| 対象scope | {移動、分割、統合、owner変更、形式置換の対象} |
| ledger | [{ledger名}]({相対path}) |
| 一般procedureの正本 | [`function_migration_policy.md`]({相対path}) |

<!--
記入例:
| baseline | `v1.4.0`の`skills/import/SKILL.md`全体と`templates/` |
| 対象scope | import skillのowner分割とresult contract変更 |
| ledger | [function-migration-ledger.md](./function-migration-ledger.md) |
| 一般procedureの正本 | [Function migration policy]({policyへの相対path}) |
-->

**完成後の差分宣言:**

{次に記載する意味差分だけが変わる。baseline scope内のその他すべてのcontractは、ownerや配置が変わっても意味、条件、順序、強度、判断能力を保存する}

<!--
記入例:
次に記載するresult contractだけが変わる。baseline scope内のその他すべてのcontractは、ownerや配置が変わっても意味、条件、順序、強度、判断能力を保存する。
-->

**完成後に変わること:**

| 完成後の意味差分 | 移行前との違い | 詳細owner | 出典 |
| --- | --- | --- | --- |
| {人が完成後の世界の変化を理解できる記述} | {以前はどうで、何が変わるか} | [{outcome section}](#{anchor}) | {ledger ID群と合意根拠} |

<!-- 該当しない場合は「なし。baseline scope内の全contractを保存する」と明記する。 -->

<!--
記入例:
| planを必要としない完了を`planless_complete`という通常resultとしてcallerへ返せる | 移行前は`legacy_ready`だけがplanなし完了を表していた | [公開contract](#公開contract) | ledger `A-011`〜`A-014`、discussion論点7 |
-->

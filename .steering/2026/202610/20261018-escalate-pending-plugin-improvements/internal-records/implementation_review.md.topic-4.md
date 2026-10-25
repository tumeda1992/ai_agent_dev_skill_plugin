# 内部検討記録: 論点4 — ledgerをtemplateへ誤保存し、実物未読のreviewを通した

**discussion:** [implementation_review.md](../implementation_review/implementation_review.md)

**論点:** 論点4

## 開始context

保存先とloop変数の共有によりtemplateがledgerで上書きされ、生成予定内容に基づくreviewでも見逃した。
破損版を保持してtemplateを復元し、保存先を不変変数へ分離した。旧reviewを失効させ、実物の再読と再検証を行った。

<a id="iteration-0"></a>

## イテレーション0: 旧記録からの事後回復

<a id="iteration-0-record-1"></a>

### 診断: 過去の記録と現在の保存結果を区別する

旧fileはcommit 1259528とartifacts/record-recovery-20261025/に保存した。
以下は旧記録に実際にあった経過であり、今回新たに調査・実施した履歴とは扱わない。
過去の「読んだ」「適用した」という記述自体を、その実行の独立した証明とも扱わない。

#### 当時保存されていた経過

executorがvalidation-run-1のfailedと親reviewを直接受領し、facilitate-discussionの既存合意への適合修復として記録する。

> template実物の先頭が能力migration ledgerとなっており、保存内容の不整合が直接根拠。旧guardは変更せず、編集担当の復旧と再検証が必要。

根本原因はledger保存先とloop変数の共有である。さらに生成したはずの本文に依存してreviewし、実物のtemplateを読まずにhash集合を記録したため、既存review規則が求める実物確認を満たさなかった。規範の知識は既存skillにあり、今回の成果物・実行の不備である。

破損版を保存した後、誤出力内の原文A1行から22行templateを復元し、既存独立観測のhashと一致させた。予定ledger出力は正しい作業記録へ保存した。保存先は役割ごとの不変変数へ分け、loop変数を再利用しない局所修復を行った。失効reviewとcheckbox差戻しを記録し、実物の全文再読・文書/構造review・最終集合と内容識別をfinal-structure-review.md、final-document-review.md、final-review-identifiers.jsonへ保存した。

構造や利用者要件を変更する修復ではなく、guardも弱めていない。doc-enricherで候補を判定したが、『実物の読取をhashや記憶で代替しない』は既存skillの明示規則であり、今回の具体的な失敗はこの実装reviewで追跡する。新しい恒久知識の追加提案はない。

#### 今回の接続と限界

後発の保存結果: phase-1-callers-validation-2 / attempt 2 / passed。
新しい機能検証は実行していない。保存済み結果への接続と記録先の修正である。

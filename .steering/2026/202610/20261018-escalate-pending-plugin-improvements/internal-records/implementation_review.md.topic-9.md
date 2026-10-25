# 内部検討記録: 論点9 — 保留・暫定指示の出典が切れ、検証入力も不足した

**discussion:** [implementation_review.md](../implementation_review/implementation_review.md)

**論点:** 論点9

## 開始context

保存先から相対解決すると出典fileがなく、consumer実行元やGit前提も不足していた。
保存先基準でfile/anchorを確認する指示へ修復した。独立fixtureのconsumer取得元・隔離Git・コピー条件を補い34caseを再実行した。

<a id="iteration-0"></a>

## イテレーション0: 旧記録からの事後回復

<a id="iteration-0-record-1"></a>

### 診断: 過去の記録と現在の保存結果を区別する

旧fileはcommit 1259528とartifacts/record-recovery-20261025/に保存した。
以下は旧記録に実際にあった経過であり、今回新たに調査・実施した履歴とは扱わない。
過去の「読んだ」「適用した」という記述自体を、その実行の独立した証明とも扱わない。

#### 当時保存されていた経過

初回owner25caseは17成功、出典相対pathの1失敗、consumer取得元/Git許可不足による7blockedだった。
保存先から解決すると存在しない出典pathは成果物の不良であり、検証前提不足とは分離した。

保存先を基準に出典file/anchorと原文の対応を確かめ、会話出典へ架空linkを作らないよう修復した。
別のfixture集合に実在consumer取得元・隔離Gitを準備し、read-only Gitと相対symlink保持を許可した。
原文を変質させず、新34caseは全成功した。
証跡は[owner attempt1](../artifacts/phase-5/behavior-run-1/result.json)と[attempt2](../artifacts/phase-5/behavior-run-2/result.json)。

#### 今回の接続と限界

後発の保存結果: phase-5-9-owner-behavior-2 / attempt 2 / passed。
新しい機能検証は実行していない。保存済み結果への接続と記録先の修正である。

# 内部検討記録: 論点53 — steeringの復旧処理を内部指示へ分けるか

**discussion:** [task-design-discussion.md](../task-design-discussion/task-design-discussion.md)

**論点:** 論点53

## 開始context

合意済みtasklistのPhase 1でskill-update-reviewを実装・検証し、既存callerへ接続した。
Phase 2着手前の全体reviewで、steeringのBlocker resolutionが独立工程を一fileに抱える不合格へ該当すると実装担当が報告した。
ここでいう復旧処理は、設計済みの作業で実行条件が崩れ、通常の手順では回復できない時だけ適用する既存の例外経路である。
通常のtest失敗や設計不足を復旧名目で処理する権限ではない。

構造の不合格を残して通常完了しないことは既決だが、steeringのこの内部指示分割は現行の読取接続追加の計画にはない。
一般的なreview基準は変えず、意味を保った限定的な分割を同じ作業へ追加するかを扱う。
設計とplanの再合意前に本体やtasklistへ分割を適用しない。Phase 1の実測完了は保持する。

<a id="iteration-0"></a>

## イテレーション0: 独立した復旧工程だけを分ける案を評価する

起点はPhase 2着手前の実装担当の構造review。既存steering/SKILL.mdのBlocker resolution全文と、同fileの通常進行・禁止条件を確認した。
新しい調査の前に既存findingを判断材料として使い、未実施の調査を装わない。

<a id="iteration-0-record-1"></a>

### 判断: 分割の対象と、保持する復旧の権限・状態を閉じる

#### 判断対象と必要条件

steering内の復旧工程を同skillの内部fileへ移し、SKILL.mdには入口と返却だけを残す案を評価する。
固有の判断・状態・完了・改訂理由を分離でき、通常進行と復旧の権限が変わらず、旧guard・参照・既存記録へ接続できることが必要である。
比較対象は一file維持と別skill化。前者は既決の必須分割条件、後者は現在の外部caller要求の有無へ照らす。

既存source、保存済みbaseline、validatorのBlocker参照、runtime共通契約を根拠とする。
合意後は設計・planへ対応する変更を追加し、移行前後の意味照合と独立挙動検証を完了する必要がある。

#### 評価結果と代償

同じsteeringの内部指示へ分ける案を推奨する。
現物は通常Flowに対する並行経路と明記し、成立の二条件、承認待ち／都度確認／自走、回復確認、元stepの先頭への再開、独自の記録先を持つ。
復帰条件や復旧logだけを改訂するcaseは通常dispatchと独立しており、単なる入力値の切替ではない。
一file維持は既決の構造基準を満たさず、別skill化には現在の外部利用要求がない。
既決の一般基準を改めて選ばせる対抗案は作らない。

移行元はsteering/SKILL.mdのBlocker resolution全体から次のh2直前まで。
新fileへ本文・理由・例・選択肢・禁止・記録条件を移し、見出し深度と参照だけを適応する。
入口と禁止条件の参照、validatorの確認先は同じ移動の不可分な追随とする。
runtime共通契約、.gitignore.sample、通常Flow、single writer、commit前確認は意味を変えない。

実装担当の保持contract 60件と現物識別は[事前review](../artifacts/phase-2/preimplementation-structure-review.md)と[保持contract](../artifacts/phase-2/blocker-preservation-contracts.json)を使う。
親も復旧章全文、通常進行と禁止条件、validatorの旧guard、runtimeの呼出し説明を確認した。
復旧の成立判定から元stepへの返却までを新fileだけで辿れ、入口の短い導線が条件の別正本にならない構成である。

代償は内部fileの追加と、その移行・再review・独立検証の作業が増えること。
復旧の権限を増やさず、通常進行の設計をやり直さない限定した変更なので、この追加で不合格を解消する案が成立する。
現時点で本体は未編集。実装後の合格や能力保持を先取りしない。

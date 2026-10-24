# Phase 2着手前: steeringの構造review

検証済みrepository実物のskill-update-reviewを明示適用し、collect-review-material.mdとassess-structure.mdに従って確認した。対象は今回更新予定のsteering全体、段階は構造案採用前の既存更新。目的は議論の保存形式の解決・許可後読取を接続することである。比較元は保存済みbaseline。

## 実読と内容識別

steering/SKILL.mdの全体と所有する.gitignore.sampleを読み、通常Flow、既存designへのrouting、ready result、承認、dispatch、roadmap、実装review、Blocker resolution、禁止と廃止を確認した。呼ぶtask-design・facilitate-discussion・tasklist-executor・doc-enricher・maintenance-plugin-context・name-work-directoryの入口と必要な共有契約は既読の実物で照合した。読取の対象・実解決先・hashと行数はpreimplementation-review-identifiers.json。steering実物はbaselineとbytes同一であり、Phase 2の本体変更は行っていない。

## 判定

不合格。steering/SKILL.md:362以降のBlocker resolutionは、通常Flowから独立した判断・状態・完了・再開を持つ工程を同じSKILL.mdに抱え込んでいる。assess-structure.md:5〜10は対象の未変更処理も含め、この構成を混線実績がなくても不合格にする。行数が長いことを根拠にはしていない。

現物の366行はFlowに対する並行経路でありFlowの一部ではないと定義する。389行以降は二つの成立条件と設計不足/通常失敗への分岐、検知時の三択、権限別の自走範囲、回復確認と元stepへの復帰を持つ。終了はtaskの完了ではなく実行条件の回復であり、tasklistのcheckboxは通常手順へ返す。記録も合意の正本とは別の追跡対象外logである。

たとえば「回復確認後に離脱stepの先頭へ戻る条件」「承認待ちと自走の境界」「復旧logの記録規則」を改訂するcaseは、task-designのready resultや通常dispatchの仕様を変えずに、復旧の判断・状態・再開・完了を独立して改訂/検証できる。CSV/PDFの出力形式を切り替えるだけの場合と異なり、入口値の違いではない。過去の混線事故は根拠として創作していない。

## 解消条件と保持する境界

方向は同じsteering内の内部指示への分離であり、現在の単独利用や他callerの具体要求がないため別skill化は要求しない。入口が持つ読む条件と親への返却を残し、工程の成立判定・状態・承認・復旧・回復確認・再開を内部指示から辿れることが解消条件になる。

移す場合にも、Flowの順序固定、設計不足/通常task失敗とblockerの区別、検知時の一回の三択、a先頭の理由、cでも破壊的/外部影響/範囲外なら都度確認、報告一回、離脱step先頭への復帰、復旧をtask成果にしないこと、checkboxの既存writer、追跡対象外logと.gitignore.sampleの利用条件を全て保持する。原文の意味単位はblocker-preservation-contracts.jsonから辿れる。一般化や理由・例の削除を許可した記録ではない。

## 設計への影響と返却

現行design-details/discussion-records.mdがsteeringへ定めるのは、配置説明/終了前reviewの同basename解決と読取接続である。Blocker resolutionの内部指示分割と参照の移行は定義されていない。完成構成と変更範囲を勝手に追加せず、同じworking directoryのtask-designへ返す。設計・planへ必要な合意が得られるまでこの不合格を未解消とし、Phase 2の本体編集へ進まない。

返却先は親steeringを経た同じ作業のtask-design。保存先は本phaseの構造review。今回review対象steeringについて資料不足はない。他のPhase 2対象の構造reviewはまだ確定結果として返していない。新設skillが未作成の時の確認としては扱わない。

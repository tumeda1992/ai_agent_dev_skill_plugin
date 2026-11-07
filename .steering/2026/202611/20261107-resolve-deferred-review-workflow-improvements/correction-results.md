# 適用範囲と許可境界の訂正結果

## 対象成果物

`plugins/tumeda-dev/skills/exhaustive-review/SKILL.md`に、hostを限定しないSolの方針・進行・結果監督、Terraへ委譲できる実作業と、高推論review担当の区別を記載した。`runtime-model-profiles.md`は既存high-reasoning-reviewに本体への参照だけを加えた。明示model指定、選択できない場合の制約報告、review実施の事実性を維持した。

一般profileの推論強度基準・delegated-execution・adapter規則から前版の全体化を撤回した。steering、task-design、tasklist-executor、test-runner、visual-inspectorの前版追記も撤回した。`unattended-execution/SKILL.md`には作業指示、設計合意、工程移行確認、実行権限、公開許可を別々に維持し、不足操作と依存先を保留する条件と、保存prefixが設計・公開の許可にならない具体例を加えた。8.3.1へのversion宣言4値とvalidator expectedReleaseを更新し、scopeとgateのassertionを改めた。

## 差分とケースの確認

- `4589a50`とのbyte比較で汎用5入口はすべて一致。runtime-model-profilesの`high-reasoning-review`以前も一致。同節は今回追加した参照文を除いて一致し、Opus相当・Astra相当、利用者指定優先と選択不能時の既存契約を保持。
- `6883660`との比較でexhaustive-reviewの「合意と適用」以降とfinding templateは一致。レビュー依頼のみでは修正しない、挙動維持の境界、既承認、1指摘1コミットと撤回を保持。
- 机上で、設計合意待ちには独立した既承認調査を続行し依存実装を保留、公開許可待ちは保存prefixがあっても公開せず独立検証を続行することを確認。復帰時は実際の必要許可と依存を再判定する。高推論review担当とTerra実作業の結果はSolが監督する。model切替・承認UIは実測していない。

## 編集後review

8.3.0のskill-update-reviewを明示適用し、exhaustive-review本体・finding templateとunattended-execution本体を通読した。役割・条件の訂正は既存reviewまたは承認判定loopの一部であり、独立した状態・完了条件を持つ新工程の切り出し候補なし。汎用5入口は旧版への追記撤回のみで、byte比較により変更前内容へ復帰した。document-reviewの作成・更新観点で変更箇所と削除差分を確認し、見出し、指示対象、参照と具体例、機密・暫定性に今回の不整合を見つけなかった。これは実行試験の成功を代替しない。

## 初回の検証状態と診断

`correction-validation-evidence.txt`に8.3.1の実行結果を保存。validator exit 0。handoffはexit 1でJSON.parse失敗、inspect-discussion testは長時間終了せず中断し、子exitと出力未取得のため結果不明。既存の8.3.0成功記録は今回の成功に流用しない。

1回の独立診断ではspawnSyncが`error: EPERM`と空stdoutを返す一方、statusは0だった。testがerrorを確認せずJSON.parseへ進んだ場合に同型エラーを起こす根拠がある。実際の失敗時のerrorは採取しておらず、同一原因とは断定しない。この時点では正規の承認済実行環境での再検証とinspect中断後の状態確認が未完了であり、全3検証成功とは扱わなかった。後続の実結果を次節に保存する。


## 2026-11-08 再検証

旧所有検証processを共有process一覧で特定し、親を停止して6 PIDの消滅を確認した。旧wrapper 56647の子exitは未取得のまま。`require_escalated`の承認済nodeで同一handoffを一度実行してexit 0、inspect-discussionを一度実行してexit 0（25件中24 pass、1 skip、0 fail）だった。validatorは前回exit 0を使用し、反復していない。sourceはHEAD a7054ccとの差分なしでhashを今回の証跡に記録した。以前の空stdoutの実際の原因は遡って断定しない。model切替と承認UIは未実測。

# 保留メモ: 暫定指示の取得と独立再構成の読取順序

## 保留時の内容

対象はこの元作業のゼロベースレビュー指摘R3。元作業は `20261018-escalate-pending-plugin-improvements`。
今回のescalateの締めでは修正せず、未解消のまま記録する。
保留指示の原文と範囲は[実装review論点22](../implementation_review/implementation_review-21-25.md#論点22-ゼロベースレビューの8指摘を保留して今回の締めへ進む)に保存した。
再開条件は、この改善を再開する利用者の指示。今回の作業終了や公開だけでは解除しない。

同じ元作業の暫定指示の原文・履歴に現在designの採用判断が含まれる場合、独立再構成より前にその判断を読む経路がある。現作業でその内容の指示を取得したという実測ではなく、入力範囲の静的な競合である。

根拠となる現行sourceはplugin rootの `plugins/tumeda-dev/skills/` 以下。
task-design/SKILL.md 24〜40行とthink-throughの入口は起動・再開時の取得を要求する。maintenance-plugin-context/temporary-overrides.md 24〜29、48行は原文・出典・判断履歴を含む全候補の読取を要求する。task-design-work-handoff-contracts.md 15〜22行は対象design由来入力をbounded extractionに限定する。

改善の方向は次のとおり。詳細実装案の採用や修正完了を意味しない。
利用者指示の優先順位を維持し、独立再構成前に適用する運用指示と、その後で読む対象designの判断・証拠を区別する。task-designだけでなくthink-throughと管理担当を通じた読取順序を揃える。

解消確認: 既存designの結論を含む暫定指示がある場合にも、許可された入力だけで独立再構成を開始できること。

詳細な読取範囲と当時の実測は[ゼロベースレビュー](../artifacts/harness-zero-base-review-20261025/review.md)のR3にある。
artifactsはGit追跡対象外なので、発生条件・根拠・改善方向・解消条件はこのメモ自体から読めるように残した。

## 追跡

状態は保留。修正・新しいsteeringへの引渡しは未実施で、受領先はまだ無い。
既存reviewの指摘を取り下げたものではなく、全体合格へ変更したものでもない。
再開指示後に、現物と後発情報を確認して既存の転送先を同定し、二重起動せず引き渡す。

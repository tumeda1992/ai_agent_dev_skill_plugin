# 保留メモ: 壊れた既存入口と未作成の区別

## 保留時の内容

対象はこの元作業のゼロベースレビュー指摘R8。元作業は `20261018-escalate-pending-plugin-improvements`。
今回のescalateの締めでは修正せず、未解消のまま記録する。
保留指示の原文と範囲は[実装review論点22](../implementation_review/implementation_review-21-25.md#論点22-ゼロベースレビューの8指摘を保留して今回の締めへ進む)に保存した。
再開条件は、この改善を再開する利用者の指示。今回の作業終了や公開だけでは解除しない。

不存在の転送先を持つdiscussion.mdのsymlink、およびdiscussion/のsymlinkを用意すると、resolveはformat=none、entry=null、problems=[]を返した。隔離記録で実測。誤分類後の実書込みは試していない。

根拠となる現行sourceはplugin rootの `plugins/tumeda-dev/skills/` 以下。
facilitate-discussion/scripts/inspect-discussion.mjs 11〜13行はstatSyncのENOENTをnoneへ変換し、entryが壊れている場合と真に何も無い場合を区別しない。

改善の方向は次のとおり。詳細実装案の採用や修正完了を意味しない。
真の不存在と既存だが解決不能なentryを、本文先読みに頼らず区別して停止理由を返す。有効なsymlinkを一律禁止しない。

解消確認: 単一入口・分割入口・同名索引・有効なsymlink・真の不存在で意図した分類になること。

詳細な読取範囲と当時の実測は[ゼロベースレビュー](../artifacts/harness-zero-base-review-20261025/review.md)のR8にある。
artifactsはGit追跡対象外なので、発生条件・根拠・改善方向・解消条件はこのメモ自体から読めるように残した。

## 追跡

状態は保留。修正・新しいsteeringへの引渡しは未実施で、受領先はまだ無い。
既存reviewの指摘を取り下げたものではなく、全体合格へ変更したものでもない。
再開指示後に、現物と後発情報を確認して既存の転送先を同定し、二重起動せず引き渡す。

# 保留メモ: 未対応の論点境界を正常な件数へ落とさない

## 保留時の内容

対象はこの元作業のゼロベースレビュー指摘R7。元作業は `20261018-escalate-pending-plugin-improvements`。
今回のescalateの締めでは修正せず、未解消のまま記録する。
保留指示の原文と範囲は[実装review論点22](../implementation_review/implementation_review-21-25.md#論点22-ゼロベースレビューの8指摘を保留して今回の締めへ進む)に保存した。
再開条件は、この改善を再開する利用者の指示。今回の作業終了や公開だけでは解除しない。

通常の論点1の後に、論点2の各非空行へ空白一つを付ける。checkはtopic_count=1、next_topic=2、problems=[]、currentはcomplete=true、needs_full_read=[]を返した。原文には既存2があるのに構造上の数え落としを通知しない。隔離記録で実測した。

根拠となる現行sourceはplugin rootの `plugins/tumeda-dev/skills/` 以下。
facilitate-discussion/scripts/inspect-discussion.mjs 61〜66行は行頭#だけを走査し、未知境界の診断もその走査を通った見出しだけを扱う。取得結果に文字列が含まれることと、次の採番を信頼できることは異なる。

改善の方向は次のとおり。詳細実装案の採用や修正完了を意味しない。
この境界を認識するか、論点らしい未対応境界として診断し、件数・次番号を正常値として渡さない。全Markdown表現の対応を要求するものではない。

解消確認: 空白付き境界を正常な不存在へ落とさず、fence・引用・commentの例も実論点へ数えないこと。

詳細な読取範囲と当時の実測は[ゼロベースレビュー](../artifacts/harness-zero-base-review-20261025/review.md)のR7にある。
artifactsはGit追跡対象外なので、発生条件・根拠・改善方向・解消条件はこのメモ自体から読めるように残した。

## 追跡

状態は保留。修正・新しいsteeringへの引渡しは未実施で、受領先はまだ無い。
既存reviewの指摘を取り下げたものではなく、全体合格へ変更したものでもない。
再開指示後に、現物と後発情報を確認して既存の転送先を同定し、二重起動せず引き渡す。

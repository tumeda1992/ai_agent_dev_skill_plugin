# 保留メモ: 現在結果の見出しと所有論点の不一致検出

## 保留時の内容

対象はこの元作業のゼロベースレビュー指摘R6。元作業は `20261018-escalate-pending-plugin-improvements`。
今回のescalateの締めでは修正せず、未解消のまま記録する。
保留指示の原文と範囲は[実装review論点22](../implementation_review/implementation_review-21-25.md#論点22-ゼロベースレビューの8指摘を保留して今回の締めへ進む)に保存した。
再開条件は、この改善を再開する利用者の指示。今回の作業終了や公開だけでは解除しない。

論点1を決定statusとし、iteration0の後に「### 決定（論点999）」と非空本文だけを置く。現行helperのcheckは成功し、currentは論点1のmetadataと999の結果を返してcomplete=true、needs_full_read=[]となった。隔離記録で実測した。

根拠となる現行sourceはplugin rootの `plugins/tumeda-dev/skills/` 以下。
facilitate-discussion/scripts/inspect-discussion.mjs 165〜181行は結果の種別と非空本文を調べるが、明示された所有論点番号と対象論点を照合しない。終端結果欠落対策だけではこの不一致を捕まえない。

改善の方向は次のとおり。詳細実装案の採用や修正完了を意味しない。
結果の所有番号が矛盾・不明なら診断または全文読取へ回す。意味上の合意判断はhelperへ移さない。

解消確認: canonical h2、legacy h3、結果番号の有無、別番号混入を区別し、矛盾する結果を確認済みの現在結果として正常抽出しないこと。

詳細な読取範囲と当時の実測は[ゼロベースレビュー](../artifacts/harness-zero-base-review-20261025/review.md)のR6にある。
artifactsはGit追跡対象外なので、発生条件・根拠・改善方向・解消条件はこのメモ自体から読めるように残した。

## 追跡

状態は保留。修正・新しいsteeringへの引渡しは未実施で、受領先はまだ無い。
既存reviewの指摘を取り下げたものではなく、全体合格へ変更したものでもない。
再開指示後に、現物と後発情報を確認して既存の転送先を同定し、二重起動せず引き渡す。

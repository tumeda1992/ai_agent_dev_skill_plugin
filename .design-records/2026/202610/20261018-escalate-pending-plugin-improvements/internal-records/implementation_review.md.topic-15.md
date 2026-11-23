# 内部検討記録: 論点15 — 独立試行で別caseの語句が混入した

**discussion:** [implementation_review.md](../implementation_review/implementation_review.md)

**論点:** 論点15

## 開始context

case18の初回では、別caseの「監査結果」という語彙が見出し案へ混入した。後で訂正しても初回の独立性逸脱は消えない。

<a id="iteration-0"></a>

## イテレーション0: 原因と対応を別の指摘へ分ける

<a id="iteration-0-record-1"></a>

### 診断: 指摘の原因・修正対象・証拠を対応させる

当時の経過は[先行する移管記録](implementation_review.md.topic-12.md)に原文を保持している。
複数の原因が一つの記録見出しに混在していたため、その原文を再合意や上書きに使わず、本論点の原因と対応を独立させた。

旧失敗を保持し、同じrawをfresh担当へ渡して必要なcaseだけ再試行した。配布sourceの原因とは確定しないため、未確認の普遍ルールを追加していない。
根拠は[保存済み結果](../artifacts/phase-3/behavior-run-3/result.json)。新しい試行の実施や、未確認のsource原因の確定を装わない。

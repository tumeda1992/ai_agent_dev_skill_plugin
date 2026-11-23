# 内部検討記録: 論点14 — 独立試行にconsumer実行元とGit前提がなかった

**discussion:** [implementation_review.md](../implementation_review/implementation_review.md)

**論点:** 論点14

## 開始context

owner試行の7blockedは、実行するconsumerの取得元と隔離Git等の前提不足だった。出典リンク自体の不良とは別の原因である。

<a id="iteration-0"></a>

## イテレーション0: 原因と対応を別の指摘へ分ける

<a id="iteration-0-record-1"></a>

### 診断: 指摘の原因・修正対象・証拠を対応させる

当時の経過は[先行する移管記録](implementation_review.md.topic-9.md)に原文を保持している。
複数の原因が一つの記録見出しに混在していたため、その原文を再合意や上書きに使わず、本論点の原因と対応を独立させた。

raw fixtureへ実在するconsumer取得元・隔離Git・read-only Git許可・相対symlink保持を揃えた。sourceを期待値へ変えて通すのではなく、新34caseで観測した。
根拠は[保存済み結果](../artifacts/phase-5/behavior-run-2/result.json)。新しい試行の実施や、未確認のsource原因の確定を装わない。

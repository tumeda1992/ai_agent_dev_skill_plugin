# 高推論モデルによるコードレビュースキルの追加

## 目的と合意

利用者が依頼したコードレビューを共有pluginへ追加する。対象範囲は未指定時の全体、指定path、指定差分。出力先はtask-designと同じdirectory指定方式を使う。指摘はtemplateに従って独立保存し、合意した適用範囲だけを変更し、指摘ごとにテストとcommitを行う。

## 実装

- `plugins/tumeda-dev/skills/code-review/SKILL.md`: 入力、範囲確定、レビュー、合意、適用、障害処理。
- `templates/finding.md`: 根拠・改善案・影響・証拠・採否・commitを記す指摘template。
- model profileとskill索引を追加し、新skillの追加としてversionを8.2.0へ更新。

## 検証・共有状態

`node scripts/verification/validate-plugin.mjs`は成功。既存handoffテストは通常sandboxで子processの出力を取得できずJSON parseに失敗したため、環境を変えて確認中。実modelの自動切替やhostへのインストール検証は未実施。利用者の現状共有依頼に従ってcommit・push・draft PRへ保存する。アプリケーション固有の情報は含めない。

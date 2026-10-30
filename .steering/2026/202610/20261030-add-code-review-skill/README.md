# 高推論モデルによるコードレビュースキルの追加

## 目的と合意

利用者が依頼したコードレビューを共有pluginへ追加する。対象範囲は未指定時の全体、指定path、指定差分。出力先はtask-designと同じdirectory指定方式を使う。指摘はtemplateに従って独立保存し、合意した適用範囲だけを変更し、指摘ごとにテストとcommitを行う。

## 実装

- `plugins/tumeda-dev/skills/exhaustive-review/SKILL.md`: 入力、範囲確定、レビュー、合意、適用、障害処理。
- `templates/finding.md`: 根拠・改善案・影響・証拠・採否・commitを記す指摘template。
- model profileとskill索引を追加し、新skillの追加としてversionを8.2.0へ更新。

## 検証・共有状態

`node scripts/verification/validate-plugin.mjs`は成功。既存handoffテストは通常sandboxでは子processの出力を取得できなかったが、追加権限付き実行では成功した。実modelの自動切替やhostへのインストール検証は未実施。利用者の現状共有依頼に従ってcommit・push・draft PRへ保存する。アプリケーション固有の情報は含めない。

## 名称と起動目的の見直し

汎用的な`code-review`では、日常的なPR確認にも使うskillと誤解される。名称を`high-reasoning-audit`へ変更し、高推論モデルで指定範囲を観点横断で繰り返し精査して問題を洗い出す目的を、descriptionと本文・索引へ明記した。セキュリティだけに限定せず、正しさ・異常系・設計・保守性も対象とする。観点と対象のcoverageを照合し、最初の指摘やテスト成功で終了しない。指摘数のノルマや無欠陥の保証は設けない。既存の出力先・指摘template・合意した範囲のみの適用・1指摘1コミットの契約は保持する。未リリースの追加skillの見直しとして、今回PRのversionは8.2.0を維持する。

改名後も`node scripts/verification/validate-plugin.mjs`は成功した。モデル切替・インストールの実環境確認は今回も未実施。

## 合意した名称への変更（2026-10-30）

`audit`は監査・基準適合の検査を連想させるため、利用者と合意した名称`exhaustive-review`、見出し「高知能モデルによる徹底レビュー」へ変更した。descriptionは、高知能モデルで指定範囲を複数の観点から繰り返し精査し、指摘と改善案を独立保存する目的と、合意した範囲だけの修正を明記する。現行の参照・consumer名・新規作業directory名も揃えた。既存成果物のdirectoryや固定ID、モデルprofile名、適用と検証の契約は変更しない。

合意名への変更後、`node scripts/verification/validate-plugin.mjs`と`git diff --check`が成功し、現行skill配下に旧名称の参照が残っていないことを確認した。

# Phase 1 caller接続の準備

新skillの独立検証後に、同skillを明示適用して構造案を確認し、次の追加だけを反映する。新skillの作成前または未検証時の実起動として扱わない。

- task-design/SKILL.md: 構造案採用前の明示起動、skill-creator編集後の実物review、結果の既存記録保存、完了判定時の内容照合。未解消・材料不足ではreadyを返さない。
- task-design/tasklist-design.md: 汎用skillを実装するphaseに編集後reviewと保存・再照合・未解消時の戻りを含める。
- task-design/templates/tasklist.md: 対象skill時だけのreview task部品を追加する。
- tasklist-executor/SKILL.md: 実装後・DoD前に明示起動し、結果保存と内容照合。checkboxのsingle writer、document-review・機能・安全・独立動作検証は維持する。
- skills/README.md: 人間向け目次に一行だけ追加する。
- validate-plugin.mjs: 新skillの入口と三参照・metadata、一般判定・caller接続を追加検査する。既存guardは意味を変えず保持する。

この準備は構造reviewの実行結果ではない。対象skillの全体・必要依存の読取と版識別を、検証後のreview結果へ記録する。

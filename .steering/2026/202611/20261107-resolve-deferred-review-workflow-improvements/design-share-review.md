# 設計文書の共有前確認

## 共有できる対象と範囲

design.mdの本文は完成しており、三件の方針、owner、権限境界、具体case、変更先、受け入れ基準を読んでレビューできる。付録と議論記録は、実装途中の未commit差分が存在し、結果監督と検証が未完了である現在状態へ同期した。実装完了またはtask-design全体の完了を宣言する記録ではない。

利用者の「design.mdが出来上がったら見たいから $tumeda-dev:share-work-in-progress もして」に応じ、引継ぎownerが作業tree全体をWIPとして共有する。共有後は同じ作業treeで反映・検証を再開する。共有前にはsourceを変更していない。

## document-review

cache 8.2.5のdocument-reviewを明示適用し、作成時と更新時の両観点でdesign.md、task-design-discussion.md、受領記録と二つの内部検討記録を確認した。結果は設計記録として共有可能。

- 濃さ: レビュー境界の正常操作と内部修正、model役割と既存高推論review、保留操作と独立作業の扱いを具体caseで判断できる。sourceの検証成功は主張していない。
- 記法・命名・指示対象: 役割と条件は散文、比較caseと変更区分は表で示す。元ownerと新skillの正本を区別し、参照先のfileと見出しを特定している。
- 機密性: 利用先のrepository名、owner、path、PR・commit等の識別子を文書へ持ち込んでいない。rootからも利用先固有語scanで一致ゼロとの確認を受領した。
- 暫定性: 実装途中の理由、source固定の期限、共有後の再開先を記載した。不在中skillの適用終了条件も明示した。
- 既存記述の更新: 過去の提案・応答は保持し、現在状態だけを更新した。source未変更という古い現在値は実差分に合わせて訂正した。

design.mdの未決表示の機械検索では一致なし。本文を通読し、内部ログだけに重要な条件を隠さず、source品質確認と設計文書の共有可否を混同しないことを確認した。

## 未完了のsource確認

既存14fileと新skillに実装途中の差分がある。対応assertionの完成、編集後skill-update-review、sourceのdocument-review、全体三検証と結果監督は未完了。rootはvalidator末尾の余分な空行をdiff checkで検出したと通知した。このWIP品質上の事項は共有後の反映・検証へ引き継ぎ、設計文書の完成と区別する。

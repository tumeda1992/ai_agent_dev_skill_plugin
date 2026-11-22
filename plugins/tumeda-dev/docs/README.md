# plugins/tumeda-dev/docs/

## 5群への入口

- **[common_standard/function_migration_policy.md](./common_standard/function_migration_policy.md)** — 機能・仕様の移行（file分割、owner変更、skill間・plugin間移植等）で意味を全量保存するための共通規範
- **[development_standards/](./development_standards/)** — 命名規約とエンティティ設計の判断基準
- **[doc_templates/table_description.template.md](./doc_templates/table_description.template.md)** — README／テーブル記述などの汎用雛形
- **[documentation_standards/README.md](./documentation_standards/README.md)** — docsの書き方・構造化に関する標準
- **[think_standards/README.md](./think_standards/README.md)** — 議論・思考プロセスの作法。`think-through` skillが参照する思考標準の本体

## 群の置き方

- 群は主題単位である。
- 群のREADMEが入口になる。ただしREADMEを持たない群は、収録fileが1つならそのfileを、複数ならdirectoryを代表fileの代わりに指す。
- 一つのfileで足りる主題は、収まる既存群があれば、新しい群を作らずその群へ置く。収まる群が無い時は、既存群へ収めるために中身や群の範囲を言い直さず、群を作るかを決める。収まるかは [`naming/core.md` の「中身を足す前に、名前が約束する範囲に入るかを確かめる」](./development_standards/naming/core.md#中身を足す前に名前が約束する範囲に入るかを確かめる) で照合する。
- 群の増減時は、このREADMEの一覧を1行の追加・削除で更新する。

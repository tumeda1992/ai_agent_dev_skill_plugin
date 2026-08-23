# plugins/tumeda-dev/docs/

## 5群への入口

- **[common_standard/function_migration_policy.md](./common_standard/function_migration_policy.md)** — 機能・仕様の移行（file分割、owner変更、skill間・plugin間移植等）で意味を全量保存するための共通規範
- **[development_standards/naming.md](./development_standards/naming.md)** — file名・識別子の命名規約
- **[doc_templates/table_description.template.md](./doc_templates/table_description.template.md)** — README／テーブル記述などの汎用雛形
- **[documentation_standards/README.md](./documentation_standards/README.md)** — docsの書き方・構造化に関する標準
- **[think_standards/README.md](./think_standards/README.md)** — 議論・思考プロセスの作法。`think-through` skillが参照する思考標準の本体

## 群の置き方

- 群は主題単位である。
- 群のREADMEが入口になる。ただしREADMEを持たない群は、収録fileが1つならそのfileを、複数ならdirectoryを代表fileの代わりに指す。
- 一つのfileで足りる主題は、新しい群を作らず既存群へ置く。
- 群の増減時は、このREADMEの一覧を1行の追加・削除で更新する。

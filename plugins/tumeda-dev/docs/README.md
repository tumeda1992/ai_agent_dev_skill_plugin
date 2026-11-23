# plugins/tumeda-dev/docs/

## 6群への入口

- **[agent_execution_standards/blocked_commands.md](./agent_execution_standards/blocked_commands.md)** — AI agent に作業を実行させる時に、AI agent と、それを動かす実行環境（host の実行許可の仕組み、sandbox、分類器等）の性質から起きる、AI agent に特有の詰まり方への対処の群。人も AI も従う開発・文書・思考の規範は、それぞれの群に置く。実行環境に command を止められた時の規範を持つ
- **[common_standard/function_migration_policy.md](./common_standard/function_migration_policy.md)** — 機能・仕様の移行（file分割、owner変更、skill間・plugin間移植等）で意味を全量保存するための共通規範
  - 群の範囲: 他の群（`development_standards/`、`documentation_standards/`、`think_standards/`）のどれか一つに収まらず、それら複数の群の作業（開発、文書、思考）に同じ形で効く規範だけを置く。
  - 置かないもの: どれか一つの群に収まる規範はその群へ、特定の skill や工程にだけ効く手順・契約はその skill の中へ置く。「複数の skill が使う」ことだけを理由にここへ置かない。使う場面が一つの群に収まるならその群へ、どの群にも収まらないなら、その主題の群を作るかを決める。
  - 判断の問い: 「この規範は、既存の群のどれか一つに収まるか。収まらないなら、開発・文書・思考のどの作業にも同じ形で効くか」
- **[development_standards/](./development_standards/)** — 開発にまつわる標準（命名、エンティティ設計、開発の進め方、基盤）
- **[doc_templates/table_description.template.md](./doc_templates/table_description.template.md)** — README／テーブル記述などの汎用雛形
- **[documentation_standards/README.md](./documentation_standards/README.md)** — docsの書き方・構造化に関する標準
- **[think_standards/README.md](./think_standards/README.md)** — 議論・思考プロセスの作法。`think-through` skillが参照する思考標準の本体

## 群の置き方

- 群は主題単位である。
- 群のREADMEが入口になる。ただしREADMEを持たない群は、収録fileが1つならそのfileを、複数ならdirectoryを代表fileの代わりに指す。
- 一つのfileで足りる主題は、収まる既存群があれば、新しい群を作らずその群へ置く。収まる群が無い時は、既存群へ収めるために中身や群の範囲を言い直さず、群を作るかを決める。収まるかは [`naming/core.md` の「中身を足す前に、名前が約束する範囲に入るかを確かめる」](./development_standards/naming/core.md#中身を足す前に名前が約束する範囲に入るかを確かめる) で照合する。
- 群の増減時は、このREADMEの一覧を1行の追加・削除で更新する。

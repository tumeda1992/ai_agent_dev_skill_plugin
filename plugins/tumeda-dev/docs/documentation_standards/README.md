# ドキュメンテーション標準

docs の書き方・構造化に関する標準を置く場所。

## 収録している標準

- **[core_readers.md](./core_readers.md)** — ドキュメントの読者を「関与の仕方」で捉え、執筆者が深さを測る物差しとして定義する標準（誰に向けて、どの深さで書くか）。
- **[information_structuring.md](./information_structuring.md)** — 巨大なナレッジをドメイン単位で、正しさの上に理解容易さを積んで構造化するための標準（何をどこに置くか）。
- **[case_coverage/](./case_coverage/README.md)** — あるドメインの「起こりうるケース」を漏れなく挙げ、漏れていないと読み手が確かめられる形で書くための標準（網羅の作り方）。information_structuring §5（cases）の深掘り。
- **[expression_notation.md](./expression_notation.md)** — 内容を散文・箇条書き・表・図のどれで書き表すかの標準（記法の使い分け）。
- **[how_to_write_workflow.md](./how_to_write_workflow.md)** — 任意の成果物内にあるworkflow記述を、scopeとsemantic roleの二軸で構造化し、実行関係に合う記法で表すための標準。

## 標準の置き方

- 各標準は **基本 1 ファイル**。
- ただし、1 つの標準を説明するのに複数ファイルが要る場合は **ディレクトリ化してよい**。

（README／テーブル記述などの汎用雛形は [`../doc_templates/`](../doc_templates/) にある。この標準群は「構造化の思想・型」を扱い、雛形置き場とは役割が違う。）

# ドキュメンテーション標準

docs の書き方・構造化に関する標準を置く場所。

## 収録している標準

- **[core_readers.md](./core_readers.md)** — ドキュメントの読者を「関与の仕方」で捉え、執筆者が深さを測る物差しとして定義する標準（誰に向けて、どの深さで書くか）。
- **[content_density.md](./content_density.md)** — 書いたものが読者を下駄を履いた状態にする濃さに達しているかを扱う標準。薄さの検知方法と、比較でしか見つからない 4 つの崩れを定める。
- **[information_structuring/](./information_structuring/README.md)** — 巨大なナレッジをドメイン単位で、正しさの上に理解容易さを積んで構造化するための標準（何をどこに置くか）。overview の書き方は [information_structuring/writing_overview.md](./information_structuring/writing_overview.md)。
- **[case_coverage/](./case_coverage/README.md)** — あるドメインの「起こりうるケース」を漏れなく挙げ、漏れていないと読み手が確かめられる形で書くための標準（網羅の作り方）。information_structuring §5（cases）の深掘り。
- **[expression_notation.md](./expression_notation.md)** — 内容を散文・箇条書き・表・図のどれで書き表すかの標準（記法の使い分け）。
- **[how_to_write_workflow.md](./how_to_write_workflow.md)** — 任意の成果物内にあるworkflow記述を、scopeとsemantic roleの二軸で構造化し、実行関係に合う記法で表すための標準。
- **[business_specification.md](./business_specification.md)** — docs に書くのは実装が変わっても変わらないビジネス仕様であるとして、何を・どの粒度で書くかを定める標準（記載レベル）。
- **[modify_description_policy.md](./modify_description_policy.md)** — すでにある doc を直すときに固有の失敗を扱う標準（議論の経緯や指摘への反論を本文に持ち込まない）。
- **[stock-and-flow-information.md](./stock-and-flow-information.md)** — 情報を寿命（永続・使い捨て・ゴールまで）で分類し、置き場所と書き方を変えるための上位方針。
- **[supplier-consumer-relation.md](./supplier-consumer-relation.md)** — 提供側と使う側の間で、知識と複雑さをどちらへ寄せるかの上位方針（consumer を薄く、supplier を厚く）。
- **[file_naming.md](./file_naming.md)** — ファイル名の規約は命名標準側が正本であることを示すポインタ。

## 標準の置き方

- 各標準は **基本 1 ファイル**。
- ただし、1 つの標準を説明するのに複数ファイルが要る場合は **ディレクトリ化してよい**。

（README／テーブル記述などの汎用雛形は [`../doc_templates/`](../doc_templates/) にある。この標準群は「構造化の思想・型」を扱い、雛形置き場とは役割が違う。）

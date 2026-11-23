# Function migration ledger — documentation_standards 追随（移植元 → plugin）

## 1. Baseline

- 方向: **移植元（upstream）→ plugin のみ**。plugin側の独自成長を移植元へ戻す作業は含まない。
- 移植元 baseline revision: `980d9b2a8559b9a7edb660245774b564902cad08`（前回移植直後の移植元snapshot）
- 移植元 baseline再現性の注意: baseline commitは移植元のsquash mergeによりmainline上では `093e6eae476fba872e529120adf0d59d63ed3d4e` へ丸められている。`980d9b2a…` はmainlineのancestorではない（merge-baseは `e41c05b7ee4eec7406f307e394775de1663fb065`）。ただしcommit objectはlocalに現存し、treeを完全に再現できるため、丸められたsquash commitではなく **`980d9b2a…` のtreeをbaselineの正本**とする。squash側をbaselineにすると、前回移植後に同一branchで積まれた成長が差分から消える。
- 移植元 current revision: `b4dc22a734`（追随対象の上端）
- 移植元 source range: baseline/current両revisionの `<upstream>/documentation_standards/` 配下全file
- destination: `plugins/tumeda-dev/docs/documentation_standards/`
- plugin baseline revision: `479b84631fedbc8ddf36f861aed775b58d7058c9`（前回移植直後のplugin側snapshot）

### baseline時点で確認したplugin側の既存差分（巻き戻し禁止）

前回移植以降にplugin側だけで育った成果物。今回の追随で削除・上書きしてはならない。

| plugin path | 由来 | 扱い |
| --- | --- | --- |
| `how_to_write_workflow.md` | plugin固有成長 | 維持。README索引の記載も維持 |
| `stock-and-flow-information.md` | plugin固有成長 | 維持 |
| `supplier-consumer-relation.md` | plugin固有成長 | 維持 |
| `naming.md` | plugin固有成長（移植元 `file_naming.md` と並行独立に作成） | A-002で`file_naming.md`へrename |
| `expression_notation.md` の例の汎用化 | 前回移植時の固有情報除去 | 維持。移植元の未汎用な例へ戻さない |
| `information_structuring.md` の例の汎用化 | 前回移植時の固有情報除去 | 維持。移植元の未汎用な例へ戻さない |

移植元 baselineとplugin currentの差分は上記のみで、`core_readers.md`・`case_coverage/` 全fileはbyte一致だった。したがって今回の追随は「移植元 baseline→current の差分を、plugin側の汎用化を保ったまま重ねる」作業として定義できる。

### 合意済みの変更

| ID | 分類 | 合意内容 | 根拠 |
| --- | --- | --- | --- |
| A-001 | `CHANGE` | `information_structuring.md` を `information_structuring/README.md` へ移し、`writing_overview.md`・`README.template.md` を同directoryへ追加する。参照元の相互リンクも更新する | ユーザーへ3案提示し「ディレクトリ化して追随」を明示選択 |
| A-002 | `CHANGE` | plugin の `naming.md` を `file_naming.md` へrenameし、参照先を命名標準の「ファイル名」節へ絞る | ユーザーへ3案提示し「file_naming.md へrename + 節を絞る」を明示選択 |
| A-003 | `ADD` | 移植元 baseline→current の成長全量をpluginへ取り込む | 初回依頼「以前の移植移行の成長を取り込みたい」 |
| A-004 | `RETIRE` | `modify_description_policy.md` の隣接トピック導線のうち、濃さ（`content_density.md`）への1行を落とす | 移植元にも移植先にも当該fileが存在せず、移植すれば必ず壊れたリンクになる。導線1本のRETIREであり、本文のcontractは触らない |
| A-005 | `ADD` | **単なるfile索引のREADMEは、移植の忠実性ではなく現状の忠実性で判断する。** plugin `README.md` の収録標準索引を、実際に `documentation_standards/` 直下にある全標準へ揃える。追加した4行は `business_specification.md`、`stock-and-flow-information.md`、`supplier-consumer-relation.md`、`file_naming.md` | ユーザー明示指示「単なるファイル索引のREADME.mdは移行に忠実でなく、現状に忠実であればいい」。移植元READMEはこの4件を索引していないが、索引は移植元との一致ではなく自directoryの実内容に対して正しさを負う。後3件は前回移植時から続く索引漏れで、今回の指示で解消対象になった |

`A-003` は成長全量の取り込みという単一の上位decisionであり、個々のfile追加を個別承認する必要はない。ただし固有情報の除去（§4）は各件を独立して監査する。

### 未合意で変更してはならない領域

- plugin固有成長4件（`how_to_write_workflow.md`・`stock-and-flow-information.md`・`supplier-consumer-relation.md`・rename後の`file_naming.md`本文の参照先repository）は追随対象外。移植元に存在しないことを理由に削除しない。
- 前回移植で汎用化済みの例（在庫確認・注文・出荷・配達・顧客の語彙）は、移植元側が当該行を変更していない限り現状維持する。移植元の未汎用な原文へ戻さない。
- plugin側 `README.md` の「標準の置き方」節と `doc_templates/` への注記は移植元に対応する変更が無いため全量維持する。

## 2. 構造ledger

`ADAPT` は章のownerと意味を維持し、移植先の構造・汎用語彙へbindingだけを読み替える分類。

| ID | source（移植元 baseline→current） | structural role / relation | destination | classification | agreement / evidence |
| --- | --- | --- | --- | --- | --- |
| S-001 | `README.md` 収録標準の索引 | 標準一覧。各標準への入口 | `README.md` 同節 | `ADAPT` | A-001、A-003。plugin固有行（how_to_write_workflow）を保持したまま、information_structuringのlink差し替えとmodify_description_policy行の追加を重ねる |
| S-002 | `business_specification.md`（新規79行） | 記載レベルの独立標準。実装語彙と仕様語彙の分離 | 同名file | `MOVE` | A-003。§4の汎用化を適用 |
| S-003 | `modify_description_policy.md`（新規104行） | 既存doc修正時の失敗を扱う独立標準 | 同名file | `MOVE` | A-003、A-004。§4の汎用化を適用 |
| S-004 | `case_coverage/README.md`（-106行の縮退） | 手順hubへ縮退。洗い出し／表現を子fileへ委譲し、データ整合性と「つまり」を保持 | 同path | `ADAPT` | A-003。縮退分はS-005・S-006へbijectiveに移動。§7.4の異常signalとして全範囲を逆引き済 |
| S-005 | `case_coverage/enumeration.md`（新規82行） | 洗い出し（軸・掛け合わせ・遷移・QAの目・アンチパターン） | 同path | `MOVE` + `ADD` | A-003。旧READMEからのMOVE分とupstream新規追記が混在。§3のcontract ledgerで分離 |
| S-006 | `case_coverage/presentation.md`（新規122行） | 表現（検算可能性・塊/章/節/ケース・ケースの書き方） | 同path | `MOVE` + `ADD` | A-003。「ケースを書く」節は全体が新規contract |
| S-007 | `case_coverage/cases.template.md` | 空雛形。固定観点枠から「生成データ・変わる状態の言い切り」へ | 同path | `ADAPT` | A-003。§4の汎用化を適用 |
| S-008 | `case_coverage/example_cases/overview.md` | 記入例の地図。章→塊、観点宣言の差し替え | 同path | `ADAPT` | A-003 |
| S-009 | `case_coverage/example_cases/main_cases.md` | 記入例の王道。散文→共通レンズ3次元 | 同path | `ADAPT` | A-003 |
| S-010 | `case_coverage/example_cases/cancel_cases.md` | 記入例のキャンセル。散文→共通レンズ3次元 | 同path | `ADAPT` | A-003 |
| S-011 | `case_coverage/example_cases/data_integrity.md` | 記入例の不変条件。`cases.md`参照をfile分割後のpathへ、担い手を「期待状態」へ | 同path | `ADAPT` | A-003 |
| S-012 | `expression_notation.md` | 記法標準。3件の追記＋information_structuringへのlink | 同path | `ADAPT` | A-001、A-003。plugin側の汎用化済み例は維持 |
| S-013 | `file_naming.md`（新規1行） | 命名標準の「ファイル名」節へのポインタ | plugin `naming.md` → `file_naming.md` | `ADAPT` | A-002。参照先repositoryはplugin側のまま |
| S-014 | `information_structuring.md` → `information_structuring/README.md` | 構造化標準本体。README索引の新設、§3/§4のwriting_overviewへの委譲、§6 `*.model.md`置き場所の3分類化、相対path修正 | `information_structuring/README.md` | `ADAPT` | A-001、A-003。plugin側の汎用化済み例は維持 |
| S-015 | `information_structuring/writing_overview.md`（新規54行） | overviewの役割・思想・テクニック | 同path | `MOVE` | A-003 |
| S-016 | `information_structuring/README.template.md`（新規53行） | ドメイン直下READMEの雛形 | 同path | `MOVE` | A-003。§4の汎用化を適用 |
| S-017 | 移植元に対応変更なし | plugin固有file `how_to_write_workflow.md` 冒頭の隣接標準への参照 | 同path | `ADAPT` | A-001の随伴。`information_structuring.md` へのlinkがrenameで壊れるため `information_structuring/README.md` へ読み替える。本文のcontractは無変更 |

移植元 baseline→current の `--name-status` 16件すべてがS-001〜S-016に登録されている。S-017はplugin側referrerの追随であり、移植元に対応する変更は無い。未登録の追加・削除は無い。

## 3. Contract ledger

移植元側の変更を意味単位へ分解する。`MOVE(README→子)` は移植元内部でownerが移った既存contractで、pluginでは同じ移動を再現する。

### 3.1 case_coverage の分割

| ID | source contract | kind | destination | classification | verification |
| --- | --- | --- | --- | --- | --- |
| C-CC-001 | cases 2要件（漏れなく拾う／読み手が確かめられる） | 前提 | `README.md` | `KEEP` | READMEに残存 |
| C-CC-002 | 作り方は洗い出しと表現の2塊、それぞれの子fileへの導線 | 順序 | `README.md` | `ADD` | 分割に伴う新規hub contract |
| C-CC-003 | 思いつき列挙は組み合わせの隙間を落とす（旅行予約の反例） | 失敗例 | `enumeration.md` | `MOVE` | 原文維持で移動 |
| C-CC-004 | 軸で分けて掛け合わせる／存在ごとに状態集合が違う非対称性 | action | `enumeration.md` | `MOVE` | 6マス表ごと移動 |
| C-CC-005 | 存在は2つとは限らない／意味のあるマスに絞り対象外を畳む | 例外 | `enumeration.md` | `MOVE` | 移動 |
| C-CC-006 | 軸の見つけ方3型（掛け合わせ／時間遷移／取り違え） | action | `enumeration.md` | `MOVE` | 移動 |
| C-CC-007 | 掛け算系は1つとは限らない | 判断質問 | `enumeration.md` | `MOVE` | 移動。固有語1件を§4で汎用化 |
| C-CC-008 | 状態を動かすのは操作／遷移表・同値クラス・系列を列挙しない | action・禁止 | `enumeration.md` | `ADAPT` | データ整合性への参照先が `README.md`「データ整合性の不変条件」節へ変わる |
| C-CC-009 | 軸をファイル名・見出しにしない | 禁止 | `enumeration.md` | `MOVE` | 移動 |
| C-CC-010 | QAレビュアーの目5観点（隠れ状態・並行中断・値境界・書き忘れ・実装ズレ） | 判断質問 | `enumeration.md` | `MOVE` | 移動 |
| C-CC-011 | アンチパターン全10項 | 失敗例 | `enumeration.md` | `MOVE` | 全項移動を照合 |
| C-CC-012 | 網羅を開かず検算できる形で見せる（幹・分岐・葉） | 前提 | `presentation.md` | `ADAPT` | 旧README「確かめられる形で見せる」節の思想を保持しつつ、木の喩えを冒頭思想へ再配置 |
| C-CC-013 | 表現の組み立て順（洗い出し→塊→分岐→章→ケース）と入れ子用語（塊⊃章⊃節⊃ケース） | 順序 | `presentation.md` | `ADD` | 新規。旧「章」語彙を「塊」へ格上げ |
| C-CC-014 | 塊に分け地図を置く／ファイルの目安5種 | action | `presentation.md` | `MOVE` | 旧README「大きくなったら」からの移動 |
| C-CC-015 | 塊ごとの分岐設計（冒頭で分かれ方を出し切る・記法の選び分け） | action | `presentation.md` | `MOVE` | 移動 |
| C-CC-016 | 章（節）をケースまで分ける／途中で丸めない | 禁止 | `presentation.md` | `ADD` | 新規contract |
| C-CC-017 | ケースを書く: リード文の定義 | action | `presentation.md` | `ADD` | 新規 |
| C-CC-018 | ケースを書く: 本体の掃き出し3カテゴリ（生成消滅レコード／状態変化／付随結果）と「固定枠でない」限定 | action・例外 | `presentation.md` | `ADD` | 新規 |
| C-CC-019 | 書き方の掟5件（状態で書く／言い切る「／」禁止／他ドメインの都合を書かない／具体値でなくデルタ／機構と分岐条件を再掲しない） | 禁止 | `presentation.md` | `ADD` | 新規。他ドメイン例を§4で汎用化 |
| C-CC-020 | ✗悪い例・✓良い例の対比 | 例・失敗例 | `presentation.md` | `ADD` | 新規。旅行予約語彙なので汎用化不要 |
| C-CC-021 | 共通レンズは状態の次元で取り、叙述スロットにしない | 禁止 | `presentation.md` | `ADD` | 新規 |
| C-CC-022 | データ整合性3不変条件（認可・冪等性・独立性）と書き方 | action | `README.md` | `KEEP` | READMEに残置。ビジネス上の正しさの担い手表現だけC-CC-023で変更 |
| C-CC-023 | ビジネス上の正しさは「各ケースの期待状態」が担う（旧「システムの対応」） | 前提 | `README.md`・`example_cases/data_integrity.md` | `CHANGE` | A-003。固定観点枠の廃止に随伴する上流変更 |
| C-CC-024 | 「つまり」— 網羅と伝達は同じ一手 | 理由 | `README.md` | `KEEP` | 原文維持 |
| C-CC-025 | 旧README「幹・分岐・葉は見出し語でない」注記 | 禁止 | `presentation.md` | `ADAPT` | 冒頭思想の括弧注記として保持 |
| C-CC-026 | 旧README「葉のテンプレを先に宣言する」 | action | — | `RETIRE` | 上流が固定観点枠を廃止し、C-CC-018/021の掃き出し＋共通レンズへ置換。A-003に含まれる上流decision |

### 3.2 雛形と記入例

| ID | source contract | kind | destination | classification | verification |
| --- | --- | --- | --- | --- | --- |
| C-TP-001 | 雛形の使い方コメント（塊単位・軸を見出しにしない・分岐を冒頭で・記法選択・モジュールへ譲る） | 前提 | `cases.template.md` | `ADAPT` | 章→塊、presentation.mdへの導線追加 |
| C-TP-002 | 各ケースの中身指示（掃き出し3カテゴリ・掟・✗✓例） | action | `cases.template.md` | `ADD` | presentation.mdと同一contractの雛形内再掲。上流が意図した二重化を維持 |
| C-TP-003 | 「各ケースは〈観点1・観点2・観点3〉で書く」宣言行 | action | — | `RETIRE` | C-CC-026と同一の上流decision |
| C-TP-004 | 対象外欄・抜け漏れ検証の使い方4手順 | action | `cases.template.md` | `KEEP` | 章→塊の語彙だけ更新 |
| C-EX-001 | 記入例の章→塊語彙統一 | 前提 | `example_cases/overview.md` | `ADAPT` | — |
| C-EX-002 | 記入例の観点宣言を〈予約状態・課金/返金・旅程の見え方〉へ | action | `example_cases/{overview,main_cases,cancel_cases}.md` | `CHANGE` | A-003。共通レンズの実演。旧散文の情報は3次元へ全量再配置され、欠落なし |
| C-EX-003 | `cases.md` 単一file参照 → `main_cases.md`・`cancel_cases.md` の2file参照 | 前提 | `example_cases/data_integrity.md` | `ADAPT` | 記入例のfile分割に追随 |

### 3.3 記法標準の追記

| ID | source contract | kind | destination | classification | verification |
| --- | --- | --- | --- | --- | --- |
| C-EN-001 | 揃えることを昇格の代わりにしない（並列性は粒度・レイヤの話で、内部フォーマットの一致ではない。形式混在を許す） | 禁止・理由 | `expression_notation.md` 箇条書き節 | `ADD` | A-003 |
| C-EN-002 | 太字で見出しを代用しない（階層・目次・アンカーが機能しない） | 禁止・理由 | `expression_notation.md` アンチパターン | `ADD` | A-003 |
| C-EN-003 | 散文で書けるものを1行散文にしない。100字超は句点、長文は読点で改行し、再帰的に別記法を検討する | action・例 | `expression_notation.md` アンチパターン | `ADD` | A-003。悪例中の固有pathと工程符号を§4で汎用化 |
| C-EN-004 | information_structuring への参照 | 参照 | `expression_notation.md` 冒頭 | `ADAPT` | A-001。directory化後のpathへ |

### 3.4 構造化標準の変更

| ID | source contract | kind | destination | classification | verification |
| --- | --- | --- | --- | --- | --- |
| C-IS-001 | ドメイン直下にREADMEを置き全体の索引にする。overviewは骨子概念しか導線しないため、概念モジュールでない要素まで含む全体はREADMEで初めて見える。構造を提案・合意する単位でもある | action・理由 | `information_structuring/README.md` §2 | `ADD` | A-003 |
| C-IS-002 | §3 overview の詳細規則をwriting_overviewへ委譲し、本体は役割と合格ラインの要約に絞る | 順序 | `information_structuring/README.md` §3 | `ADAPT` | 委譲先S-015に全contractが存在することを§5で照合 |
| C-IS-003 | §4 導線contractをwriting_overviewの「地図」節へ委譲 | 順序 | `information_structuring/README.md` §4 | `ADAPT` | 同上 |
| C-IS-004 | `*.model.md` 置き場所を「種類で寄せ集めない」原則＋3分類（モジュール密着／ドメイン直下／最後の手段の専用dir）へ拡充。各分類に一般例を付す | action・例 | `information_structuring/README.md` §6 | `ADD` | A-003。旧3分類の箇条書きから昇格。一般例1件を§4で汎用化 |
| C-IS-005 | 相対path修正（`./core_readers.md`→`../core_readers.md` 等、`table_description.template.md` は `../../doc_templates/`） | 参照 | `information_structuring/README.md` | `ADAPT` | A-001。plugin側の実配置で解決することを§5で確認 |
| C-IS-006 | overviewの役割2つ（腹落ちの入口・地図）と欠落時の堕ち方 | 前提・理由 | `writing_overview.md` | `MOVE` | 旧§3/§4からの移動 |
| C-IS-007 | 書く側とレビュー側で別の基準を持たない | 前提 | `writing_overview.md` | `ADD` | 新規 |
| C-IS-008 | 思想1: whatを書く／崩れ方はhow基準の説明 | 禁止・失敗例 | `writing_overview.md` | `ADD` | 新規 |
| C-IS-009 | 思想2: 腹落ちのゴールから構成を決める／崩れ方は資料転用 | 禁止・失敗例 | `writing_overview.md` | `ADD` | 新規 |
| C-IS-010 | ドメイン自体を分割する方向に逃げない | 禁止 | `writing_overview.md` | `MOVE` | 旧§3からの移動 |
| C-IS-011 | 導線を乱発しない／置き場は末尾集約でも節末でもよい | 禁止・例外 | `writing_overview.md` | `MOVE` | 旧§4からの移動 |
| C-IS-012 | 見せ方6テクニック（要旨先行・少数概念・未定義語の接地・図・読む順・大きければdir化）を〈狙い／崩れ方〉対で | action・失敗例 | `writing_overview.md` | `ADD` | 一部は旧§3からのMOVE、崩れ方の対比はADD |
| C-IS-013 | READMEの雛形（役割・外に出すもの・とりあえずこれ・読む順の目安・モジュール一覧・直下索引・正本ルール） | template | `README.template.md` | `MOVE` | A-003。固有語彙を§4で汎用化 |
| C-IS-014 | 雛形内の限定: モジュール一覧に載せるのは概念の深掘りだけ。テーブル・値辞書・testing・historiesとcasesは別カテゴリで載せない | 禁止・例外 | `README.template.md` | `MOVE` | 移動 |
| C-IS-015 | 雛形内の限定: 読者名を本文へ露出しない。読む順は関わり方で書く | 禁止 | `README.template.md` | `MOVE` | 既存 `core_readers.md` のcontractと整合 |
| C-IS-016 | plugin baseline §3: 少数概念は**経験則**であって「少なくないと誤り」ではない。豊穣な情報を持つドメインはざらにある | 例外 | `writing_overview.md` 見せ方「少数概念」項 | `KEEP` | **移植元は分割時にこの限定を落としたが、plugin baselineには存在し、廃止合意が無い。**共通規範§2によりunagreed `RETIRE`は許されないため、新ownerへ復元した。限定を落とすと「概念が多い＝失敗」と誤読され、豊穣なドメインで無理な削減を招く |
| C-IS-017 | plugin baseline §3: 合格ラインは読んだ人がその後を自分で再現・判断できるまで。腹落ちのため概念どうしの繋がりと順序を尽くす（1つの見方でまとまるのは手段の一つで必須ではない） | 前提・例外 | `writing_overview.md` 合格ライン項 | `KEEP` | 同上。移植元の縮退分をplugin側で復元。「1つの見方が必須ではない」を落とすと、単一の統合ビューを作れないドメインで合格判定ができなくなる |

### 3.5 記載レベル標準（新規file）

| ID | source contract | kind | destination | classification | verification |
| --- | --- | --- | --- | --- | --- |
| C-BS-001 | docsにはビジネス仕様を書く。この標準は記載レベルを扱い、構造化と文体は別標準へ委ねる | 前提 | `business_specification.md` §冒頭 | `MOVE` | A-003 |
| C-BS-002 | 仕様は残り実装は変わる。「腐らない」は帰結であって目的ではない。目的は読み手が業務のふるまいを掴めること | 理由 | 同 §1 | `MOVE` | 目的と帰結の区別を落とさず維持 |
| C-BS-003 | 判断の中心の問い「実装が変わっても変わらないか」と2分岐 | 判断質問 | 同 §1 | `MOVE` | — |
| C-BS-004 | 処理は仕様の語彙で書く。メソッド名・行番号・SQL・クラス名・path・バッチ名を本文に書かない。✗○の2例対 | 禁止・例 | 同 §2.1 | `MOVE` | 例を§4で汎用化 |
| C-BS-005 | データは意味と用途で書く（物理名＋型の羅列にしない）。✗○例対 | 禁止・例 | 同 §2.2 | `MOVE` | 例を§4で汎用化 |
| C-BS-006 | コード値は値辞書として独立させ、処理側は意味の名前で参照する。テーブル定義と値辞書は別ナレッジ | action・禁止 | 同 §2.3 | `MOVE` | 例を§4で汎用化 |
| C-BS-007 | 観測・スナップショットを仕様として残さない。抽象化できないなら書かない | 禁止・例外 | 同 §2.4 | `MOVE` | 例を§4で汎用化 |
| C-BS-008 | 実装の裏取りは必要だが過程を本文に混ぜない。根拠は各トピック末尾の「実装の入口」へ隔離 | action | 同 §3 | `MOVE` | 既存 `information_structuring` §8の同名概念と整合 |
| C-BS-009 | 提示前セルフチェック6項 | 判断質問 | 同 §4 | `MOVE` | 全項移植 |

### 3.6 既存doc修正方針（新規file）

| ID | source contract | kind | destination | classification | verification |
| --- | --- | --- | --- | --- | --- |
| C-MD-001 | 既存doc修正に固有の失敗を扱う。新規執筆時の失敗（薄い・散らかる）と形が違う | 前提 | `modify_description_policy.md` 冒頭 | `MOVE` | A-003 |
| C-MD-002 | 隣接トピックの担当分け（記法・構造・読者段階） | 参照 | 同 | `ADAPT` | A-004で濃さ1行を落とす。残る3本はplugin実配置へ解決 |
| C-MD-003 | 直すときは指摘した人をsecond readerに置いてしまう | 理由 | 同 | `MOVE` | — |
| C-MD-004 | 原則: 本文はそのdocしか読んでいない初見の読者だけに向ける | 前提 | 同 §議論の経緯 | `MOVE` | — |
| C-MD-005 | なぜ起きるか: 指摘への回答形になり、書き手には自然に見える。存在しない主張への反論を読ませる | 理由 | 同 | `MOVE` | — |
| C-MD-006 | 修正は量を増やす方向に働き、最も重要でない箇所が最も厚くなる逆転が起きる | 理由 | 同 | `MOVE` | — |
| C-MD-007 | 失敗形1: 存在しない主張への反論（before/after対比） | 失敗例 | 同 | `MOVE` | 語彙を§4で汎用化。before/afterの対比構造と「反論の枠を外すと事実だけが残る」を維持 |
| C-MD-008 | 失敗形2: 修正の正しさを補強する肥大（1行→15行→4行、増分3内訳、未確認の推論が最悪） | 失敗例 | 同 | `MOVE` | 行数・内訳数を数値ごと維持。数値は失敗の規模を示すcontract |
| C-MD-009 | 失敗形3: 同じ弁解の増殖（5file・5引用、書き手は満足できるので自覚しにくい） | 失敗例 | 同 | `MOVE` | 引用5本を維持 |
| C-MD-010 | 戻した基準: 否定形は読者が自分で抱く誤解にだけ当てる。判定は「docしか読んでいない人が自分で思いつくか」1つ | 判断質問 | 同 | `MOVE` | 当てる例／当てない例の対比を維持 |
| C-MD-011 | 判定するのは記述の由来でなく読者への効き。指摘起因でも効くなら残る（未確定注記・誤読防止キャプション） | 例外 | 同 | `MOVE` | 例外条項を落とすと過剰削除を招くため全量維持 |
| C-MD-012 | 守る点4件（増分の理由を疑う／未確認の理由を補強に使わない／2file以上の同趣旨否定は過剰補正／表記だけ直して済ませない） | 禁止 | 同 | `MOVE` | 全4件 |
| C-MD-013 | 検知4手段（git diffの増加行数／増えた文への問い／否定形の検索／複数fileの同趣旨検索） | action | 同 | `MOVE` | 「単体で読み返しても気づけないので差分を見るのが要」という前提ごと維持 |

## 4. 固有情報除去ledger（migration.md 追加監査）

移植元固有情報を抜き、汎用表現へ置換した箇所と、置換後も意味が維持される根拠。語彙は前回移植で確立した汎用ドメイン（受注・在庫・出荷・配達・顧客）へ揃え、pluginの既存fileと衝突しないことを確認する。

| ID | 対象 | 移植元の固有表現 | plugin表現 | 意味維持の根拠 |
| --- | --- | --- | --- | --- |
| G-001 | `business_specification.md` §2.1 例1 | 本人確認ドメインのクラス名・テーブル名・状態値 | 配送状態を最新の配送記録で決める例（クラス名・テーブル名も汎用名） | contractは「実装語彙で書くな・業務判断の言葉に還元せよ」。例が満たすべき条件は〈実装識別子を含む✗〉と〈同じ判断を仕様語で述べる○〉の対比で、ドメインの選択に依存しない |
| G-002 | `business_specification.md` §2.1 例2 | 入金消込のservice名・承認番号・加盟店番号 | 注文照合の汎用service名・注文番号・顧客ID | 同上。既存 `information_structuring` §8が同じ照合例を同じ汎用語彙で持つため、標準間の語彙が一致する |
| G-003 | `business_specification.md` §2.2/2.3 | 会員ステータスの物理名と区分値、請求・与信の分岐 | 顧客ステータスの物理名と区分値、出荷・配送方法の分岐 | contractは「物理名＋型の羅列でなく意味と用途」「値辞書を独立させる」。lifecycle enumという例の型を保てば判断は同じ |
| G-004 | `business_specification.md` §2.4 | アクティブ会員数の観測値 | アクティブ顧客数の観測値（件数の桁は維持） | 観測値を仕様に残す✗例。数量の具体性が失敗の実感を作るため桁を維持 |
| G-005 | `business_specification.md` §2.3 | 外部電文 | 外部連携 | 前回移植で確立した置換。値辞書の対象種別という役割は不変 |
| G-006 | `modify_description_policy.md` §実際に落ちた現物 | 与信・残枠ドメインの固有語 | 引当済み在庫ドメイン（倉庫別の残在庫・引当の判定） | 失敗の形は〈2方式の非対称を弁解した〉こと。方式名（随時更新方式・都度集計方式）は一般的な算出方式名なので維持し、対象ドメインだけ置換。1行→15行→4行、増分3内訳、5file・5引用という規模のcontractは数値ごと保全 |
| G-007 | `modify_description_policy.md` 隣接トピック | 濃さ標準への導線 | 削除（A-004） | 移植元・移植先ともに当該fileが無く、移植すれば壊れたリンクになる。導線のRETIREであり本文judgmentは無変更 |
| G-008 | `case_coverage/enumeration.md` 掛け算系 | 「使った額」表示の差引 | 「未払い残高」表示の差引 | 例が担うのは「数は少ないが毎回その場で考えると漏れる掛け算」の実例。周囲は旅行予約の課金ライフサイクルなので、同一ドメイン内の語へ寄せる方が例として整合する |
| G-009 | `case_coverage/presentation.md` 掟 | 会員向け表示ラベルは会員向けAPIの領分 | 顧客向け表示ラベルは顧客向けAPIの領分 | 「他ドメインの都合を書かない」というcontract。境界の相手が固有APIである必要はない |
| G-010 | `case_coverage/presentation.md` デルタ式 | 利用額累計のカラム名 | 引当在庫のカラム名 | デルタ式で意味を表す例。式の形（`x += y`）が本体 |
| G-011 | `case_coverage/presentation.md` 冒頭 | 移植元skillの工程符号 | 工程符号を落とし「これを運用する工程側で定める」 | 書く→レビューの回し方をこのfileが所有しないという境界contract。ownerの指し方だけ汎用化 |
| G-012 | `case_coverage/cases.template.md` 掟 | 会員向け表示・会員向けAPI | 顧客向け表示・顧客向けAPI | G-009と同一contractの雛形内再掲 |
| G-013 | `expression_notation.md` C-EN-003 悪例 | 移植元repositoryの絶対path、工程符号F2 | 相対link `./core_readers.md`、工程符号を落とす | 悪例が示すのは「1行散文に詰め込むな」。引用内の参照先は例の題材で、判断には効かない。移植元自身も修正後blockでは符号を落としている |
| G-014 | `information_structuring/README.md` §6 一般例 | 会員の債権債務の台帳群 | 顧客の残高の台帳群 | 「複数テーブルが絡み合って初めて意味をなす」という最後の手段の判定例。絡み合いの構造（台帳・明細・相殺結果・イベント）は維持 |
| G-015 | `information_structuring/README.template.md` | 会員／加盟店、請求ドメイン、商材別 | 利用者、配送ドメイン、商品種別別 | 雛形の穴埋め指示。ドメイン境界を可視化せよというcontractは相手先の固有性に依存しない |
| G-016 | `information_structuring/README.template.md` | 移植元skillの工程符号F3（3箇所） | 「構造を提案・合意する工程」 | 雛形が「どの工程で合意されるか」を示すcontract。工程のowner名を汎用化しても、合意対象と足切りの指示は不変 |
| G-017 | `file_naming.md` | 移植元の命名標準path | plugin `development_standards/naming.md` の「ファイル名」 | A-002。参照の意味（ファイル名規約の正本は命名標準側）を維持し、参照先だけ移植先の実配置へ解決 |
| G-018 | `information_structuring/writing_overview.md` 思想1の崩れ方 | 取引 | 注文 | how基準の説明へ流れる崩れ方の例。前回移植で `expression_notation.md`・`information_structuring` の同種例を注文へ揃えたため、標準間で語彙を一致させる |

移植元 baselineに存在してpluginで欠落する固有依存は無い。plugin公開物へ残る移植元固有の社名・repository名・絶対path・固有モデル名・commitハッシュは、§5のself checkで0件を確認する。

## 5. White-box検証

実施結果は本ledgerと同directoryの `verification.md` に記録する。

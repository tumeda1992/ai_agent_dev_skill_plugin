# Function migration ledger: `naming.md` の directory 化

`common_standard/function_migration_policy.md` に従う。論点4の決定が根拠。

## baseline

| 項目 | 内容 |
| --- | --- |
| revision | `c003640b43d958c85f7102c276a0fd659063aaed`（HEAD）。ただし対象fileは論点2で作業ツリー上を更新済みで、その状態をbaselineとする |
| 対象file | `plugins/tumeda-dev/docs/development_standards/naming.md` 全83行 |
| 方向 | `naming.md` → `naming/README.md` + `naming/core.md` + `naming/file.md` + `naming/method.md` |
| 開始前に合意済みの変更 | 論点2でscope宣言（5-11行）と §1「修飾の向きで指すものが変わる」（40-51行）を追加済み。これらもbaselineに含めて全量移行する |

### 移行対象へ依存している側（全数）

| 依存元 | 依存の形 |
| --- | --- |
| `docs/documentation_standards/file_naming.md` | 本文で `development_standards/naming.md` の「ファイル名」を参照 |
| `docs/development_standards/entity_modeling.md` 3行目 | `[naming.md](./naming.md)` |
| `docs/development_standards/entity_modeling.md` 40行目 | `[naming.md の「修飾の向きで指すものが変わる」](./naming.md)` |
| `docs/README.md` | `development_standards/` を指す（file名を含まないため変更不要） |
| `scripts/verification/validate-plugin.mjs` | `naming` を検査していない（`grep` で0件、変更不要） |

`skills/name-work-directory/SKILL.md:42` の `20260726-extract-work-directory-naming` はslug例の文字列であり、参照ではない。

## 構造ledger

| source | structural role | relation | destination | classification | agreement | evidence |
| --- | --- | --- | --- | --- | --- | --- |
| `naming.md` 1-3 | h1 + 標準の一文定義 | file冒頭 | `naming/README.md` h1 + 同一文 | MOVE | — | README冒頭に同文が存在 |
| `naming.md` 5-11 | scope宣言（積集合方針） | h1直後、file全体を規定 | `naming/README.md` `## この群の置き方` | ADAPT | 論点4決定 | 群構成に合わせ「ここに置く」を「`core.md`」等へ読み替え |
| `naming.md` 13-15 | `## §1 基本` 見出し + 導入文 | 章 | `naming/core.md` h1 + 導入文 | ADAPT | 論点4決定 | 節番号を廃し、file自体が章になる |
| `naming.md` 17-24 | `### 初見でも自明にわかる名前にする` | §1配下、1番目 | `naming/core.md` 同名節 | MOVE | — | 全4例が存在 |
| `naming.md` 26-31 | `### 手続き的な how でなく、宣言的な what / why を表す` | §1配下、2番目 | `naming/core.md` 同名節 | MOVE | — | 全2例が存在 |
| `naming.md` 33-38 | `### 中身が大まかにわかる具体性を備える` | §1配下、3番目 | `naming/core.md` 同名節 | MOVE | — | 全2例が存在 |
| `naming.md` 40-51 | `### 修飾の向きで指すものが変わる` | §1配下、4番目 | `naming/core.md` 同名節 | MOVE | — | 判断の問い・2例・MUSTが存在 |
| `naming.md` 53-55 | `### 命名後、名前と実態の対応をレビューする` | §1配下、5番目・末尾 | `naming/core.md` 同名節 | MOVE | — | 順序も末尾のまま |
| `naming.md` 57 | `## §2 ファイル名` 見出し | 章 | `naming/file.md` h1 | ADAPT | 論点4決定 | 節番号を廃し、file自体が章になる |
| `naming.md` 59-64 | `### 同階層の存在と足並みを揃える` | §2配下、1番目 | `naming/file.md` 同名節 | MOVE | — | 表面・抽象度の2項目が存在 |
| `naming.md` 66-68 | `### 全体を説明する一員として名付ける` | §2配下、2番目 | `naming/file.md` 同名節 | MOVE | — | 存在 |
| `naming.md` 70-74 | `### 直上ディレクトリのコンテキストを継承する` | §2配下、3番目 | `naming/file.md` 同名節 | MOVE | — | 例が存在 |
| `naming.md` 76 | `## §3 メソッド名` 見出し | 章 | `naming/method.md` h1 | ADAPT | 論点4決定 | 節番号を廃し、file自体が章になる |
| `naming.md` 78-83 | `### レシーバー.メソッド名 で意味が通る名前にする` | §3配下、1番目 | `naming/method.md` 同名節 | MOVE | — | 全3例が存在 |
| （移行後のみ） | 各fileの守備範囲表と、対象種別fileを増やすときの規則 | `README.md` | `naming/README.md` | ADD | 論点4決定（「それぞれのファイルで扱う守備範囲を明確にしたい」「README.mdで取り回し方針を立てて」） | README に守備範囲表が存在 |

全83行が上表のいずれかの範囲に属する（1-3, 5-11, 13-15, 17-24, 26-31, 33-38, 40-51, 53-55, 57, 59-64, 66-68, 70-74, 76, 78-83。空行は前後の範囲に含む）。未登録範囲なし。

## contract ledger

| ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| N-01 | 3 | 理由 | 名前は本質であり、あらゆる命名場面で守る | `README.md` 冒頭 | MOVE | — | 同文存在 |
| N-02 | 5 | 前提 | 扱うのはどのプロジェクトにも存在する成果物の命名と共通原則 | `README.md` この群の置き方 | ADAPT | 論点4決定 | 群構成へ読み替えて存在 |
| N-03 | 5 | 禁止 | 特定の設計手法固有の概念の命名判断はここに置かない | `README.md` 同上 | KEEP | — | 同義の記述が存在 |
| N-04 | 7 | 判断質問 | 「この規則は、名前を付ける対象が何であっても成立するか」 | `README.md` 同上 | KEEP | — | 同文存在 |
| N-05 | 8-9 | action | 成立するなら共通側、しないならその概念の標準へ | `README.md` 同上 | ADAPT | 論点4決定 | 「`core.md`」「対象種別のfile」「群の外」の3分岐へ細分 |
| N-06 | 11 | 禁止 + 理由 | 積集合のみ扱い和集合運用をしない。適用範囲が濁るため | `README.md` 同上 | KEEP | — | 同文存在 |
| N-07 | 15 | 前提 | この章は命名全般に効く原則である | `core.md` 導入文 | MOVE | — | 同義文存在 |
| N-08 | 19 | action | 初見の人が名前だけで中身を正しく受け取れること | `core.md` | MOVE | — | 同文存在 |
| N-09 | 19 | 禁止 | 参加者だけに通じる略語・対比・内部符号を避ける | `core.md` | MOVE | — | 同文存在 |
| N-10 | 21-22 | 例 + 失敗例 | `spec_over_implementation` ✗ / `business_specification` ○ | `core.md` | MOVE | — | 両方存在 |
| N-11 | 23-24 | 失敗例 + 理由 | 連番IDでの相互参照は変換表を要求し番号が壊れる | `core.md` | MOVE | — | 理由まで存在 |
| N-12 | 28 | action + 理由 | how でなく what / why で名付ける。手順は変わるが what / why は変わりにくい | `core.md` | MOVE | — | 理由まで存在 |
| N-13 | 30-31 | 例 + 失敗例 | `recalculate_and_save_balance` ✗ / `settle` ○ | `core.md` | MOVE | — | 両方存在 |
| N-14 | 35 | action + 失敗 | 名前から内容が大づかみできること。意味抜きの汎用名を避ける | `core.md` | MOVE | — | 同文存在 |
| N-15 | 37-38 | 失敗例 + 例 | `data`/`manager`/`info`/`util` ✗ / 実態を名指す具体語 ○ | `core.md` | MOVE | — | 両方存在 |
| N-16 | 42 | 前提 | 「A の B」と「B の A」は別物。修飾の向きで指す対象が変わる | `core.md` | MOVE | — | 同文存在 |
| N-17 | 44 | 判断質問 | 「その名前が指すのは、出来事（行為）か、状態を持つ物か」 | `core.md` | MOVE | — | 同文存在 |
| N-18 | 45-46 | action | 出来事→名詞形、物→形容詞で修飾した形 | `core.md` | MOVE | — | 同文存在 |
| N-19 | 48-49 | 失敗例 + 例 | `retry_notification` の誤用 ✗ / 出来事と物の書き分け ○ | `core.md` | MOVE | — | 両方存在 |
| N-20 | 51 | 禁止（MUST） | 形容詞を単独で名詞の位置に置かない。修飾先の名詞を伴わせる | `core.md` | MOVE | — | MUST表記のまま存在 |
| N-21 | 55 | action + 強調 | 名前と実態の対応を見直し、外していたら改名して再レビュー。工程の最後でも本質として詰める | `core.md` | MOVE | — | 強調まで存在 |
| N-22 | 61 | action + 禁止 | 同階層と表面も抽象度も揃える。1つだけ足並みを乱さない | `file.md` | MOVE | — | 同文存在 |
| N-23 | 63 | 例 + 理由 | 表面は周囲に合わせる。kebab/snakeは所属ツリーの慣習。どちらが正しいではない | `file.md` | MOVE | — | 具体例2件と理由が存在 |
| N-24 | 64 | action | 抽象度も周囲の粒度に揃える | `file.md` | MOVE | — | 同文存在 |
| N-25 | 68 | 前提 + 強調 | 単体の正しさより、同階層と合わせてディレクトリ全体を説明する役割を担う | `file.md` | MOVE | — | 強調まで存在 |
| N-26 | 72 | 禁止 | 親が語ることをファイル名に重複させない | `file.md` | MOVE | — | 同文存在 |
| N-27 | 74 | 例 | `documentation_standards/business_specification.md`（`documentation_standard_for_business_spec.md` としない） | `file.md` | MOVE | — | 例が存在 |
| N-28 | 80 | action | メソッド名単体でなく `receiver.method` で読んで意味が通ること | `method.md` | MOVE | — | 同文存在 |
| N-29 | 82-83 | 失敗例 + 例 | `member.check`/`bill.process` ✗ / `member.active?` 等 ○ | `method.md` | MOVE | — | 両方存在 |
| N-30 | （移行後のみ） | action | 各fileの守備範囲（扱うもの / 扱わないもの）を表で示す | `README.md` | ADD | 論点4決定 | 守備範囲表が存在 |
| N-31 | （移行後のみ） | 禁止 + 理由 | 対象種別fileを増やす前に `core.md` へ入らないことを確認する。`core.md` に入る規則を種別fileへ書くと他の種別から見えなくなる | `README.md` | ADD | 論点4決定 | 同義の記述が存在 |

`ADD` は N-30・N-31 の2件のみで、いずれも論点4のユーザー明示要求（守備範囲の明確化、取り回し方針）が根拠。
`CHANGE` と `RETIRE` はゼロ。未分類の削除・追加はない。

## 参照元の更新

| 依存元 | 変更 | classification | evidence |
| --- | --- | --- | --- |
| `documentation_standards/file_naming.md` | 参照先を `development_standards/naming/file.md` へ | ADAPT | 新pathが解決する |
| `entity_modeling.md` 3行目 | `./naming.md` → `./naming/core.md` | ADAPT | 新pathが解決する |
| `entity_modeling.md` 40行目 | `./naming.md` → `./naming/core.md` | ADAPT | 新pathが解決する |

## 完了gate

- [x] 全83行が構造ledgerへ登録され、未登録範囲がない
- [x] contract ledger の全行に destination がある
- [x] `ADD` に合意根拠がある（N-30・N-31、論点4のユーザー明示要求）/ `CHANGE` `RETIRE` がゼロ
- [x] 順方向照合: 旧contractの代表句34件を新4fileの結合テキストへ照合し、欠落ゼロ
- [x] 逆方向照合: 新fileに旧sourceへ由来しない内容が `ADD`（README の守備範囲表と種別file追加時の規則）以外にない
- [x] 参照元3箇所が新pathを指す。旧 `naming.md` への参照は repository 全体でゼロ
- [x] `node scripts/verification/validate-plugin.mjs` → `plugin validation passed`

### 実測

```text
照合contract数: 34
欠落: なし
旧 naming.md への参照: なし
link先実在: naming/core.md, naming/file.md, naming/method.md, naming/README.md, entity_modeling.md すべてOK
plugin validation passed
```

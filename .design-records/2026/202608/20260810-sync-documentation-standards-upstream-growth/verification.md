# White-box検証結果

対象ledger: [`function-migration-ledger.md`](./function-migration-ledger.md)

## 1. 完了集計

```text
適合 62 / 合意済み追加 24 / 合意済み変更 5 / 明示廃止 2 / 未監査 0 / 未分類削除 0 / 未分類追加 0
```

内訳の索引:

- 適合（`KEEP | MOVE | ADAPT`）: S-001、S-004、S-007〜S-014、S-017、C-CC-001〜C-CC-015、C-CC-022、C-CC-024、C-CC-025、C-TP-001、C-TP-004、C-EX-001、C-EX-003、C-EN-004、C-IS-002、C-IS-003、C-IS-005〜C-IS-017、C-BS-001〜C-BS-009、C-MD-001〜C-MD-013
- 合意済み追加（`ADD`、根拠 A-003 / A-005）: C-CC-002、C-CC-013、C-CC-016〜C-CC-021、C-TP-002、C-EN-001〜C-EN-003、C-IS-001、C-IS-004、C-IS-007〜C-IS-009、C-IS-012、S-002、S-003、S-005、S-006、S-015、S-016、A-005
- 合意済み変更（`CHANGE`、根拠 A-001 / A-002 / A-003）: A-001（構造）、A-002（rename）、C-CC-023、C-EX-002、S-013
- 明示廃止（`RETIRE`）: A-004（`content_density.md` 導線）、C-CC-026 / C-TP-003（固定観点枠。移植元が上位decisionとして置換）

数は各件のevidenceへ辿る索引であり、正しさの代替ではない。

## 2. 順方向の照合

移植元 baseline→current の `--name-status` 16件すべてに移植先ownerが存在する。fileごとに移植先と移植元 currentを差分し、残る差異が全件ledgerの記載であることを確認した。

| 移植先 | 移植元 currentとの差異 | 根拠 |
| --- | --- | --- |
| `README.md` | plugin固有2行（`how_to_write_workflow`、`business_specification`） | baseline既存 + A-005 |
| `business_specification.md` | 6箇所の例の汎用化 | G-001〜G-005 |
| `modify_description_policy.md` | 導線1行削除 + 6箇所の語彙置換 | A-004、G-006 |
| `case_coverage/README.md` | 差異なし（byte一致） | — |
| `case_coverage/enumeration.md` | 1箇所 | G-008 |
| `case_coverage/presentation.md` | 3箇所 | G-009〜G-011 |
| `case_coverage/cases.template.md` | 1箇所 | G-012 |
| `case_coverage/example_cases/*` | 差異なし（byte一致・4file） | — |
| `expression_notation.md` | 前回移植の汎用化済み例 + 1箇所 | baseline維持、G-013 |
| `file_naming.md` | 参照先path | A-002、G-017 |
| `information_structuring/README.md` | 前回移植の汎用化済み例 + 1箇所 | baseline維持、G-014 |
| `information_structuring/writing_overview.md` | 1箇所 + 復元2箇所 | G-018、C-IS-016、C-IS-017 |
| `information_structuring/README.template.md` | 5箇所 | G-015、G-016 |

移植元にあってpluginに無いfileは0件。pluginにあって移植元に無いfileは3件（`how_to_write_workflow.md`、`stock-and-flow-information.md`、`supplier-consumer-relation.md`）で、いずれもbaselineで確認したplugin固有成長であり削除していない。

## 3. 逆方向の照合

`git diff --cached -M` の全変更行を起点に逆引きした。

- 変更file 18件は S-001〜S-017（rename1件がadd/delete2entryに分解）に全件対応する。未登録の追加・削除は0件。
- 縮退した2fileについて、旧本文の非空行を新owner群の合算と照合した。
  - `case_coverage/README.md`（旧77行）: 文字列一致しない17行はすべて、C-CC-008・C-CC-012〜C-CC-015・C-CC-023・C-CC-025・C-CC-026・S-004・G-008の書き換えである。
  - `information_structuring`（旧108行）: 文字列一致しない19行はすべて、C-IS-002〜C-IS-005・C-IS-006・C-IS-010〜C-IS-012・C-IS-016・C-IS-017の書き換えである。
- 二重正本の検査: `information_structuring/README.md` §3・§4は詳細を `writing_overview.md` へ委譲し、委譲元に規則を残していない。移植元が `information_structuring` §5に残す「先にテンプレートを宣言する」は、移植元自身が両方に持つ状態であり、pluginが新たに複製したものではない。

## 4. 境界の照合

- **相互リンク**: `documentation_standards/` 配下の全 `.md` の相対リンクを実体解決し、壊れたリンク0件。directory化に伴い、移植元が変更していないplugin固有file `how_to_write_workflow.md` のリンクも追随した（S-017）。これを漏らすとplugin側だけリンクが壊れる。
- **委譲先の実在**: `information_structuring/README.md` の `../../doc_templates/table_description.template.md` は移植先の実配置で解決する。
- **owner境界**: 洗い出し（`enumeration.md`）と表現（`presentation.md`）の境界、データ整合性がREADMEに残る配置、cases雛形とpresentation.mdの二重記載は、いずれも移植元の配置をそのまま再現している。

## 5. 情報量と構造の異常signal（§7.4）

`case_coverage/README.md` が106行減、`information_structuring` §3が10行→2行へ縮退した。これは移植元の分割によるもので、削減分の移動先を全件照合した（§3）。加えて、**移植元が分割時に落とした限定のうち、plugin baselineに存在し廃止合意が無い2件を検出し、新ownerへ復元した**（C-IS-016、C-IS-017）。

復元した根拠: 共通規範§2は「移行後の能力 = 移行前の能力 + 合意済み追加 − 明示廃止」を要求する。移植元が縮退させた事実は、plugin側の能力を廃止する合意にはならない。

baselineの主要な限定・失敗例・判断質問20語について、新tree全体での残存をgrepで確認した（消失0件）。移植元が固定観点枠を廃止した`RETIRE`2件は、代替contract（掃き出し3カテゴリ・共通レンズ・叙述スロット禁止）が同時に入っており、判断能力の純減ではない。

## 6. 固有情報のself check（migration.md MUST）

`documentation_standards/` 全体に対し、移植元の社名・repository名・絶対path・移植元固有path・固有ドメイン語・移植元skillの工程符号・commitハッシュをgrepし、**0件**を確認した。

## 7. 通常検証

- `node scripts/verification/validate-plugin.mjs` → `plugin validation passed`
- 相対リンク解決 → 壊れたリンク0件

## 8. 索引fileの扱い（A-005で確定）

ユーザー指示により、**単なるfile索引のREADMEは移植の忠実性ではなく現状の忠実性で判断する**と確定した。したがって `documentation_standards/README.md` は移植元READMEとの一致を目標にせず、自directoryの実内容と一致することを目標にする。

この結果、当初申し送りにしていた2点は両方とも「索引に載せる」で解決した。

| 索引へ追加 | 状況 |
| --- | --- |
| `business_specification.md` | 今回A-003で追加したfile。移植元は索引していない |
| `modify_description_policy.md` | 今回A-003で追加したfile。移植元も索引している |
| `stock-and-flow-information.md` | plugin固有成長。前回移植時からの索引漏れ |
| `supplier-consumer-relation.md` | plugin固有成長。前回移植時からの索引漏れ |
| `file_naming.md` | A-002でrenameしたポインタfile。移植元は索引していない |

索引の網羅性を確認した。`documentation_standards/` 直下の全 `.md`（`README.md` 自身を除く9件）が索引に載っており、索引にあって実体が無い行は0件。

この方針は次回以降の追随にも効く。移植元README索引との差分は、それ自体では追随漏れの証拠にならない。plugin側の実内容と索引が一致しているかで判定する。

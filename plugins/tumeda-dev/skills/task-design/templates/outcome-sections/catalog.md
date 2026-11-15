# 完成後の姿のsection一覧

`design.md`の「完成後の姿」へ、steeringの終了時に成り立ち、確かめられる変化に当たるsectionだけを差し込む。fileの種類ではなく、何の見え方、振る舞い、境目、知識の並べ方が変わるかで選ぶ。一つの変更が複数の対象へ影響する場合は、複数のsectionを使う。選んだ後の並べ方は、この一覧の行の順ではなく[READMEの並べ方の決まり](./README.md#designmdへの配置順)に従う。

| 完成後に変わるもの | 読むsection | 主な移行元 | 選ぶかを決める問い |
| --- | --- | --- | --- |
| 利用者または外部のsystemの操作と、systemの反応 | `interaction-flow.md` | 旧`templates/design.md` 3-1、`SKILL.md`観点1 | 誰が何をした時、何がどの順序で起きるかが変わるか |
| 画面の情報の配置、強調、状態、画面幅に応じた挙動 | `screen.md` | `SKILL.md`観点5 | 完成後の画面を見なければ合意できない変化があるか |
| 保存する値、関係、状態の遷移、dataの見え方 | `data.md` | 旧`templates/design.md` 3-2、`SKILL.md`観点2 | 具体的な値や複数のcaseで整合性を確かめる必要があるか |
| 呼び出し元から見える名前、入力、結果、error、副作用の保証 | `caller-contracts.md` | 旧`templates/design.md` 3-3(A)、`SKILL.md`観点3前半 | 呼び出し元が実装を開かずに頼る名前または保証が変わるか |
| codeの責務の配置、module／directory、公開入口、依存の向き、全体の呼び出し関係 | `code-structure.md` | 旧`templates/design.md` 3-3(B)、`SKILL.md`観点3後半 | 配置と入口から、責務の分担・依存の向き・全体の処理の組み立てを理解する構造が変わるか |
| skillの長く続く役割、判断の方針、受け持つ範囲、禁止・非目標 | `skill-policy.md` | `task-design/SKILL.md` section 2〜4、各skillの設計意図 | 完成後のskillが何を正しい／誤りと判断し、どの力を守るかが変わるか |
| skill、prompt、template、manifest等のfileの成果物 | `file-deliverables.md` | 旧`templates/design.md` 3-4、`SKILL.md`観点4 | documentation以外のfileについて、読者、内容、構造、配置、形式を合意する必要があるか |
| documentationでまとめる知識の並べ方、標準、考え方、最新に保つ方法 | `documentation.md` | 旧`templates/design.md` 3-4、`SKILL.md`観点4、旧軽量modeのdocs task | 暗黙知や困りごとを文書にし、読者の判断と、正しい内容を保つことを成り立たせるか |
| 実行環境の設定、build、依存、環境、失敗時の挙動 | `runtime-and-configuration.md` | 旧`templates/design.md` 3-4、`tasklist-design.md`品質check | 実行の条件や、環境による違いで振る舞いが変わるか |
| 担当、先へ進む条件、状態、引き継ぎを持つ作業の流れ | `workflow.md` | `SKILL.md` Step 3〜6、`roadmap-design.md`、`steering/SKILL.md` | 誰がいつ何を判断、更新、引き継ぐかが変わるか |
| 移行前の振る舞いの保存と、意図して変える差分 | `contract-preservation.md` | `function_migration_policy.md`、function migration ledger | 移動、分割、統合、担当や置き場所の変更、形式の置き換えの前後で、何を変えず何を合意済みの差分として変えるかが成功の条件か |
| 調査、比較、技術検証そのものを主な成果として分かったこと | `research-findings.md` | `SKILL.md` 3-4、investigationとspikeのlifecycle | 分かっていなかった問いを、再現できる根拠から確定すること自体が受け入れ基準か |

## sectionを選ぶ時の決まり

- 最低一つのsectionを選ぶ。
- 該当しないsectionを読み込まず、空のsectionや「なし」を作らない。
- 各fileは独立した設計書や汎用の部品ではない。複数のsectionを使っても、`design.md`全体で一つの完成後の姿を表す。
- 同じ内容を複数のsectionへ写さない。その内容を主に扱うsectionへ書き、他のsectionからは必要な関係だけを参照する。
- sectionを埋めても、実装中に新しい判断が残るなら、sectionの選び方または具体化が足りない。
- placeholderだけをコピーしない。各fileの「なぜ必要か」「NG」「具体的な記述例」「MUST」「判断基準」を読み、それらに反しない具体性で書く。
- sectionに分けたことは、移行元の判断の力を短くしてよい許可ではない。移行元の理由、例、失敗例、判断の問い、強調に対応しない削除は、やめる（`RETIRE`）合意が無い限り禁止する。

## codeが中心でない作業で必ず選ぶsection

| steeringの中心 | MUSTで選ぶsection | 条件に応じて併用 |
| --- | --- | --- |
| documentationの新設・本質的な更新 | `documentation.md` | 手順を設計する`workflow.md`、調査自体も主な成果である`research-findings.md` |
| skillの新規作成 | `skill-policy.md` + `file-deliverables.md` | 担当、状態、先へ進む条件、引き継ぎを設計する`workflow.md`、`documentation.md`、`runtime-and-configuration.md`、`research-findings.md` |
| 既存skillの本質的な更新 | `file-deliverables.md` | 役割・判断の方針・受け持つ範囲が変わる`skill-policy.md`、担当、状態、先へ進む条件、引き継ぎが変わる`workflow.md`、その他の変わる対象のsection |
| prompt、template、manifest等のfileの成果物 | `file-deliverables.md` | `workflow.md`、`runtime-and-configuration.md` |
| 調査・比較・技術検証が主な成果 | `research-findings.md` | 分かったことが決める、他の完成後の姿のsection、成果を長く残るdocsにする`documentation.md` |
| codeを使わない作業の流れの設計 | `workflow.md` | 成果物のfileがある`file-deliverables.md`、決まりのdocsを作る`documentation.md` |
| 既存のfunctionの移動、分割、統合、担当や置き場所の変更、形式の置き換え | `contract-preservation.md` | 変更後の具体的な姿を書く、他の完成後の姿のsection |

typoや単純な表現の修正は、task-design自体を起動する対象ではない。本質的なdocumentationの更新を「軽いfileの変更」として`file-deliverables.md`だけへ送らない。

## `documentation.md`と`research-findings.md`のどちらを選ぶか

> 終了時に成り立たせる主な変化は、「分かっていなかった問いについて、根拠に基づき何が言えるか」か、それとも「既に知られている、暗黙の、散らばっていた知識から、読者が判断できる決まり・説明の体系と、それを最新に保つ方法が成り立つこと」か。

- 前者は`research-findings.md`を選ぶ。
- 後者は`documentation.md`を選ぶ。
- 両方が独立した受け入れ基準なら、両方のsectionを使う。`research-findings.md`には根拠を、`documentation.md`にはそこから設計した決まりと知識の並べ方を書き、同じ内容を写さない。
- 別の成果物を設計する途中で得た事実は、`research-findings.md`として独立させず、その成果物を決める完成後の姿のsectionへ根拠として書き戻す。再現のlogは`investigation.md`または`spike/`に置く。

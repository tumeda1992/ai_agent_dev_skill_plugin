# 完成後の姿section catalog

`design.md`の「3. 完成後の姿」へ、steering終了時に成立・観測できるoutcomeに該当するsectionだけを差し込む。file種別ではなく、何の見え方、振る舞い、境界、知識体系が変わるかで選ぶ。一つの変更が複数themeへ影響する場合は複数sectionを使う。選択後の配置は、このcatalogの行順ではなく[READMEのcomposition rule](./README.md#designmdへの配置順)に従う。

| outcome | 読むsection | 主な移行元 | 選択する問い |
| --- | --- | --- | --- |
| 利用者または外部actorの操作とsystemの反応 | `interaction-flow.md` | 旧`templates/design.md` 3-1、`SKILL.md`観点1 | 誰が何をした時、何がどの順序で起きるかが変わるか |
| 画面の情報配置、強調、状態、responsive挙動 | `screen.md` | `SKILL.md`観点5 | 完成後の画面を見なければ合意できない変化があるか |
| 保存値、関係、状態遷移、dataの見え方 | `data.md` | 旧`templates/design.md` 3-2、`SKILL.md`観点2 | 具体的な値や複数caseで整合性を確認する必要があるか |
| caller-facingな名前、input、result、error、side effect保証 | `caller-contracts.md` | 旧`templates/design.md` 3-3(A)、`SKILL.md`観点3前半 | callerが実装を開かず依存するidentifierまたは保証が変わるか |
| codeの責務配置、module／directory、公開入口、dependency direction、全体call関係 | `code-structure.md` | 旧`templates/design.md` 3-3(B)、`SKILL.md`観点3後半 | 配置と入口から責務分担・依存方向・全体orchestrationを理解する構造が変わるか |
| skillの恒久的な役割、判断方針、能力境界、禁止・非目標 | `skill-policy.md` | `task-design/SKILL.md` section 2〜4、各skillの設計意図 | 完成後skillが何を正しい／誤りと判断し、どの能力を守るかが変わるか |
| skill、prompt、template、manifest等のfile成果物 | `file-deliverables.md` | 旧`templates/design.md` 3-4、`SKILL.md`観点4 | documentation以外のfileについて、読者、内容、構造、配置、形式を合意する必要があるか |
| documentationが成立させる知識体系、標準、思想、維持規律 | `documentation.md` | 旧`templates/design.md` 3-4、`SKILL.md`観点4、旧軽量modeのdocs task | 暗黙知やpainを形式知化し、読者の判断と正しいsnapshotの維持を成立させるか |
| runtime設定、build、dependency、環境、失敗時挙動 | `runtime-and-configuration.md` | 旧`templates/design.md` 3-4、`tasklist-design.md`品質check | 実行条件や環境差による振る舞いが変わるか |
| owner、gate、状態、handoffを持つworkflow | `workflow.md` | `SKILL.md` Step 3〜6、`roadmap-design.md`、`steering/SKILL.md` | 誰がいつ何を判断、更新、引継ぎするかが変わるか |
| 既存contractの保存と明示的な差分 | `contract-preservation.md` | `function_migration_policy.md`、function migration ledger | 移動、分割、統合、owner変更、形式置換の前後で、何を不変にし何を合意済み差分として変えるかが成功条件か |
| 調査、比較、技術検証そのものを主成果とするfinding | `research-findings.md` | `SKILL.md` 3-4、investigationとspikeのlifecycle | 未知だった問いを再現可能なevidenceから確定すること自体が受け入れ基準か |

## 選択gate

- 最低一つのsectionを選ぶ。
- 該当しないsectionを読み込まず、空sectionや「なし」を生成しない。
- 各fileは独立した設計書や汎用componentではない。複数sectionを使っても、`design.md`全体で一つの完成後の姿を表す。
- 同じ内容を複数sectionへ複製しない。主ownerとなるsectionへ書き、他sectionから必要な関係だけ参照する。
- sectionを埋めても、実装中に新しい判断が残るならsection選択または具体化が不足している。
- placeholderだけをコピーしない。各fileの「なぜ必要か」「NG」「具体的な記述例」「MUST」「判断基準」を読み、それらに反しない具体性で記載する。
- section化は移行元の判断能力を短縮する許可ではない。移行元の理由、例、失敗例、判断質問、強調に対応しない削除は、合意済み`RETIRE`がない限り禁止する。

## 非code中心steeringの必須mapping

| steeringの中心 | MUSTで選ぶsection | 条件に応じて併用 |
| --- | --- | --- |
| documentationの新設・本質的更新 | `documentation.md` | procedureを設計する`workflow.md`、調査自体も主成果である`research-findings.md` |
| skillの新規作成 | `skill-policy.md` + `file-deliverables.md` | owner、state、gate、handoffを設計する`workflow.md`、`documentation.md`、`runtime-and-configuration.md`、`research-findings.md` |
| 既存skillの本質的更新 | `file-deliverables.md` | 役割・判断方針・能力境界が変わる`skill-policy.md`、owner、state、gate、handoffが変わる`workflow.md`、その他変化対象のsection |
| prompt、template、manifest等のfile成果物 | `file-deliverables.md` | `workflow.md`、`runtime-and-configuration.md` |
| 調査・比較・技術検証が主成果 | `research-findings.md` | findingが規定する他outcome section、成果を恒久docsへする`documentation.md` |
| codeを使わないprocess設計 | `workflow.md` | source artifactがある`file-deliverables.md`、規範docsを作る`documentation.md` |
| 既存functionの移動、分割、統合、owner変更、形式置換 | `contract-preservation.md` | 変更後の具体像を所有する他outcome section |

typoや単純な表現修正はtask-design自体の起動対象外である。本質的なdocumentation更新を「軽微なfile変更」として`file-deliverables.md`だけへ送らない。

## `documentation`と`research findings`の分岐gate

> 終了時に成立させる主outcomeは、「未知だった問いについてevidenceに基づき何が言えるか」か、それとも「既知、暗黙、散在していた知識から、読者が判断できる規範・説明体系と維持規律が成立すること」か。

- 前者は`research-findings.md`を選ぶ。
- 後者は`documentation.md`を選ぶ。
- 両方が独立した受け入れ基準なら両sectionを使う。research findingsはevidence、documentationはそこから設計した規範とknowledge architectureを所有し、同じ内容を複製しない。
- 別artifactを設計する途中で得た事実は`research-findings.md`として独立させず、そのartifactを規定するoutcome sectionへ根拠として書き戻す。再現logは`investigation.md`または`spike/`が所有する。

# Validatorとcallerの接続設計

## 今回変わる境界

実行手順と記録が複数fileへ分かれても、callerが渡す明示入力は `discussion_directory` と `discussion_file_name` の二つのままである。
論点番号、内部log名、親子関係、保存の順序はcallerへ移さない。
callerは一つのdecisionを受けて自身の成果物へ反映し、全体を再評価する。

以下は完成本文と、反映時に差し替えるexactな範囲である。productionへの反映は完了し、実測範囲と限界は [production検証結果](../behavior-preservation/production-verification.md) に保存した。

## validate-plugin.mjsの置換範囲

`scripts/verification/validate-plugin.mjs` の `const discussionSkill =` から、`const taskDesignSkill =` の直前までを [置換本文](../integration/validate-plugin.discussion.inc.mjs) に置き換える。
既存のhelper、以降のtask-design検査、version検査等は変えない。
置換片はこのscript内で使うものであり、単独実行moduleではない。

[旧48 assertionの対応](../integration/validator-contract-map.json) から、消すguardと移管先を一件ずつ追える。

- 意味と表記が変わらない32件
  - 元のピン留め文字列を維持する。
  - 表示patternの選択、feedback再分類等は新ownerのiteration.mdを検査する。
  - 検査を通すために同じ規則をSKILL.mdへ複製しない。
- 合意済みの構造・保存形へbindingが変わる16件
  - 旧番号付き見出しを、三fileの対応見出しへ変更する。
  - `提案Nへのフィードバック` は共通回番号Iと所属suffixを持つ保存形へ変更する。
  - mermaidのsubgraphに依存した検査を、起動→論点→iterationの包含を明示する本文へ変更する。包含の能力は残し、図の構文を要求しない。
- 新しい検査
  - 三実行file、entry、内部log、表示pattern十file、六用途formatとREADMEが存在する。
  - entryは十、内部logは三の名前付き見出しとmarkdown code blockを持ち、適用制御commentを持たない。
  - entryの二種類の本文・応答、共通回番号、所属、status、内部logへの接続を検査する。
  - 本体が標準参照、実施前入力、結果保存、再構成、二層の独立可読性、中断復帰へ接続していることを検査する。
  - metadataの暗黙起動禁止、廃止済みcaller側templateの不在、旧固定fieldの禁止は維持する。

文字列と見出しの検査は、意味保存や実際のagentの実行順序を証明しない。
順序・停止・誤合意の検査は [移行検証](../behavior-preservation/migration-verification.md) のsource由来scenarioで補う。

## task-designの説明を二層へ接続する

対象: `plugins/tumeda-dev/skills/task-design/SKILL.md` の「discussionを選んだ場合の境界」。

```diff
-- `facilitate-discussion`が行う: discussion scopeと対象論点を判定し、完全な現在案、feedback、検証、routing、決定をdiscussion fileへ保存して合意を進める。
+- `facilitate-discussion`が行う: discussion scopeと対象論点を判定し、単独で判断できる現在案・背景、feedback、routing、決定をdiscussion fileへ保存して合意を進める。調査・検証・訂正等の過程は、同skillが接続する論点単位の内部検討記録へ保存する。二層の保存・読取・回復は同skillへ委ねる。
```

他のdiscussion起動、同じowner、入力二項目、一decisionごとのdesign即時反映は変更しない。
task-designが内部log名やiteration formatを組み立てる処理は追加しない。

## 別ownerへのcatch-up

対象: `plugins/tumeda-dev/skills/task-design-work-handoff-contracts.md`。

独立再構成前の禁止入力に、分離された内部logも含まれることを明示する。
「起動gateと読取境界」の禁止入力の列挙だけを次へ置換する。

```diff
-summary、designの他section、discussion、既存attempt本文、canonical file全体を読むことは禁止する。
+summary、designの他section、discussion、接続された内部検討記録、既存attempt本文、canonical file全体を読むことは禁止する。
```

独立再構成を保存した後に正本を照合する境界へ、次の段落を加える。

```markdown
discussionから必要な判断過程を確認する場合は、facilitate-discussionの読取規則で、対象論点の内部検討記録を全文読み、参照した根拠と後続訂正を辿る。
無関係な内部logを一律に読むことは要求しない。内部logから論点番号・現在decisionを逆算せず、discussionを判断とdecisionの正本として扱う。
内部logを比較根拠として読んだ場合は、そのexactなfileをcanonical file digestの対象へ加える。読取集合へ追加したfileも、照合時と完了直前のdigest一致を確認する。
```

独立再構成の順序、四分類、全decisionのcoverage、未解消疑義があれば復帰しないgate、attemptのcleanupは不変である。
内部logの全件読取を新しい完了条件にせず、実際に根拠へ使ったfileの変化を見逃さない適応である。

## 変更しないconsumer

| 対象 | 変更しない根拠 |
| --- | --- |
| steering/SKILL.md | discussionの起動とdecision後のroutingがownerであり、entry内部を持たない |
| task-design/templates/tasklist.md | discussion_directoryとimplementation_review.mdで直接ownerを起動する契約は不変 |
| task-design/tasklist-design.md | feedbackを直接受領したownerへ適用させる契約は不変 |
| task-design/roadmap-design.md | 計画逸脱を同じworking directoryのdiscussionへ戻す契約は不変 |
| task-design/scripts/extract-handoff-input.mjs | 元依頼・上位roadmap制約だけを抽出する。内部logを入力へ増やさない |
| scripts/verification/test-task-design-handoff.mjsの既存scenario | extractorとowner境界の既存能力は不変。既存scenarioは削除・緩和しない |

handoff testのcontract検査へ、内部検討記録が独立再構成前の禁止入力であること、読んだlogをdigestへ加えることの二assertionを追加する。
新しいextractor分岐は作らない。

## Productionへ反映するときのpath投影

prototypeの本文を反映する場合に限り、次の機械的な投影を行う。今回のproduction適用ではこの投影を使った。

- 三実行fileとactiveなtemplatesを同名で `plugins/tumeda-dev/skills/facilitate-discussion/` へ置く。
- prototypeから標準へ向く `../../../../../plugins/tumeda-dev/docs/` は、production ownerからの `../../docs/` へ変更する。
- SKILL.md冒頭の「設計確認用prototype」blockquoteを配布本文へ入れない。
- consideration-records/README.mdの例を実測と扱わない説明は、「このprototypeで実測した事実ではない」から「実際の調査・検証結果ではない」へ投影し、配布先にprototype依存の指示語を残さない。
- 同directoryのgeneralization.mdも「このprototypeの実測結果ではない」を「実際の調査・検証結果ではない」へ投影する。後続のsourceとcaseの実在根拠を添える契約は維持する。
- prototypeのREADME、alternatives、作業ledger、integration片は配布しない。
- `agents/openai.yaml` は現行のまま保持する。prototypeに無いことを削除理由にしない。
- entryと実行側の変更、validator、callerの接続は一括で整合させる。保存形だけを先に置換しない。

## 受入れscenarioの追加位置

新しい意味変更をtest都合で作らず、source由来scenarioと新合意差分を区別する。

- plugin validator
  - 旧48 assertionと新しい保存形・file存在検査を同じscriptで実行する。
  - 見出しが表示用code fence内にあるだけ、十部品の名前が重複する、templateへ制御commentが戻る場合は失敗する。
- handoff test
  - 既存extractorの成功・失敗fixtureとcleanupの境界を維持する。
  - 独立再構成前の内部log読取は禁止、後は必要log全文と後続訂正を読み、参照したlogが変われば再照合する。
- agentの実行確認
  - 保存順・合意解釈・二層の可読性は静的assertionでは観測できないため、移行検証のscenarioで確認する。

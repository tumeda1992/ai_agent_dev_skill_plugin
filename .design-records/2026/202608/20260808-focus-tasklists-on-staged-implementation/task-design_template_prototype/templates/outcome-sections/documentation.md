### documentationによって成立する知識体系

<!--
移行元:
- 旧templates/design.md「docs・設定・環境構築系 deliverable」
- task-design/SKILL.md「観点4」
- 旧軽量modeが扱っていたdocs作成・更新task

documentationの新設、再構成、本質的更新により、読者がcodeや過去の会話を再探索せず判断・実行でき、意図した知識のsnapshotを維持できる状態を設計する。

なぜ必要か:
- 「READMEを整備する」「標準を書く」というfile名だけでは、実装者が何を抽象化し、どの判断能力を作るかを独自に決めるため。
- 暗黙知や個別のpainをそのまま事例集にせず、別caseでも使える原則、判断質問、具体例、失敗例へ引き上げるため。
- 作成時には正しくても、source of truth、更新owner、更新triggerがなく腐るsnapshotを防ぐため。

NG:
- READMEを整備する
- 標準を書く
- user feedbackや具体ケースをそのまま一般則として保存する
- 原則だけを書き、判断質問、具体例、失敗例、適用境界を持たない
- 同じ知識をREADME、docs、skillへ重複記載する
- 作成時点のsnapshotだけを置き、更新ownerと腐敗検出条件を決めない

具体的な記述例:
docs/architecture.md:
- 構成: (1) 各layerとその責務 (2) 各layerの判断基準 (3) anti-patternと正しい問い
- 形式: Markdownで、layerごとにh2見出しを置く
- 配置: docs/
- 読者が可能になる判断: 新しい責務をどのlayerへ置き、何を置いてはいけないかをcodeの再調査なしで判断できる

function migration policy:
- 形式知化するpain: file分割時に見出しだけが移り、理由、例外、失敗例が落ちる
- 成立させる判断: 移行者がcontractを意味単位へ分解し、未合意削除を停止できる
- 知識構造: 目的 → 不変条件 → 意味単位 → ledger → gate → failure pattern → example
- 規範: 全range登録と未分類zeroはMUST。単なる行数比較は補助signalであって完了証拠ではない
- 維持規律: workflowまたはowner境界を変更した時にpolicyとconsumer skillを同時確認する

記述のMUST:
- 形式知化する暗黙知、散在知識、繰り返し発生したpainと、具体例から引き上げる再利用可能な原則を示す。
- 読者と利用場面、および読後にcodeや過去会話を再調査せず可能になる判断またはactionを示す。
- 概念、原則、判断基準、具体例、失敗例、手順、参照を、抽象と具体を往復できる構造で配置する。
- 規範の根拠、MUST／SHOULD／MAY、適用対象、例外、非目標、誤適用を示す。
- 正しいsnapshot、single source of truth、更新owner、更新trigger、腐敗signal、関連docsとの重複防止を示す。
- 完成後のpath、見出し、entry、参照関係、具体例の配置を示し、既存documentへの統合または新owner作成の理由を明示する。

判断基準:
- 読者が、記録された具体ケース以外にも同じ原則を適用できるか。
- 抽象的な標語と個別事例の間を、判断質問、例、失敗例で往復できるか。
- どこまで規範が適用され、どこから例外または非目標かが一意か。
- sourceが変わった時、誰が何をsignalとしてこのdocumentationを更新するか分かるか。
- 内容、配置、形式だけでなく、documentation-only taskのoutcomeが完成後の状態として読めるか。
-->

**形式知化する対象:**

- 暗黙知・散在知識・pain: {何がどこに埋もれ、どんな誤判断または再調査を生んでいるか}
- 再利用可能な原則へ引き上げるもの: {具体ケースから抽出する原則、標準、判断質問}

**読者と成立させる判断:**

| 読者 | 利用場面 | codeや過去会話を再調査せず可能になる判断・action | 入口・読む順序・検索語 |
| --- | --- | --- | --- |
| {読者} | {場面} | {判断またはaction} | {entry point} |

**知識構造:**

```text
{概念、原則、判断基準、具体例、失敗例、手順、参照の階層と関係}
```

**規範の根拠と適用境界:**

- 根拠となるpain・失敗: {なぜこの規範が必要か}
- MUST: {必ず守ること}
- SHOULD: {原則として守ることと例外条件}
- MAY: {任意の選択}
- 適用対象: {scope}
- 例外・非目標: {適用しない範囲}
- 誤適用: {似ているがこの規範を使わないcase}

**snapshotと維持規律:**

| 正しいsnapshot | single source of truth | 更新owner | 更新trigger | 腐敗signal・同時確認先 |
| --- | --- | --- | --- | --- |
| {保つ状態} | `{pathまたはowner}` | {owner} | {変更event} | {矛盾、重複、参照切れ等} |

**完成後のdocument構造:**

- 配置: `{path}`
- 形式: {Markdown、既存template等}
- 既存documentへ統合するか: {統合先または新ownerと理由}

```text
{見出し、entry、参照関係、具体例の配置}
```

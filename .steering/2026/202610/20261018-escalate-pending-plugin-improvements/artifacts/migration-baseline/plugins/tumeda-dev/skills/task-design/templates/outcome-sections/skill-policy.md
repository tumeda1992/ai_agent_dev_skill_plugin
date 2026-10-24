### skillの役割と方針

<!--
skillの新設、または既存skillの役割、判断方針、能力境界、禁止、negative diagnosisを
本質的に変更する時だけ使う。単にSKILL.mdを編集する、workflowを変える、章を移動する
という理由では選ばない。

このsectionが所有するもの:
- 完成後の個別skillが何のために存在し、agentまたは利用者にどの能力を成立させるか
- 何を正しい／誤りと判断し、複数の判断軸がある時に何を優先するか
- skillを同じskillとして維持するための設計原則、能力境界、禁止、非目標
- 原則を具体場面で発火させるための理由、違反signal、帰結、判断質問、具体例

owner境界:
- trigger、入力、owner、state、gate、handoff、停止・再開は`workflow.md`が所有する。
- SKILL.mdの見出し、section、配置、形式は`file-deliverables.md`が所有する。
- 今回なぜこのpolicyへ変更したか、旧案、pain、trade-offは、このsectionのWHATを読んだ後に
  必要な場合だけ置く設計意図が所有する。
- skill利用者から見た呼出しcontractやresult schemaが独立して変わる場合は、該当する
  contract outcomeが所有する。

表現記法:
- repository path
  `plugins/tumeda-dev/docs/documentation_standards/expression_notation.md`を正本とし、skill policy全体を
  一つの記法へ押し込まない。prototypeの配置に依存する相対pathは記載しない。
- roleはskillの存在理由と利用後に成立する能力を結ぶ短い散文にする。roleの属性を固定の
  key-value listへ分解しない。
- 独立したpolicyは内容を表す固有見出しへ昇格する。一つの上位policyから複数の子policyが
  導かれ、各子が独立した説明を持つ場合は、親子の見出し階層を保つ。
- 理由、条件、例外、帰結は散文で結ぶ。入れ替えても意味が壊れない短い同格要素だけを
  箇条書きにする。policy本文をtableのcellへ入れない。
- 能力境界、禁止、非目標、negative diagnosisは、それが拘束するpolicyの近くへ置く。
  複数policyを横断する独立した境界だけを固有見出しにする。
- 具体caseは、それが説明するpolicyの直後へ置く。全policyのcaseを末尾のcatch-allへ
  集約しない。

なぜ必要か:
- workflowとfile構造だけが正しくても、skillが何を良しとし、どこまで考え、何を拒むかを
  実装者が独自に決めれば、名前と手順だけ同じ別のskillになるため。
- 「原則名」だけでは、具体場面で発火せず、違反しても自己診断できないため。
- 将来の短縮、再構成、共通化で、観測済み失敗から得た判断能力が装飾と誤認されて
  消えることを防ぐため。

選択gate:
- 新しいskillを作る場合は選ぶ。
- 既存skillでは、役割、成立させる能力、判断の優先順位、設計原則、禁止、negative diagnosis、
  非目標のいずれかがADD／CHANGE／RETIREされる場合だけ選ぶ。
- typo、表現修正、章配置だけの変更、合意済みpolicyから一意に導かれるworkflow変更では選ばない。

NG:
- このskillは高品質な設計を行う
- 必要に応じて柔軟に判断する
- WHY→WHAT→HOWを守る
- 既存の思想を維持する

上記は、成立させる能力、適用条件、違反signal、破った場合の帰結、具体場面での判断を
実装者へ残すため、完成後policyとして不足している。

具体的な記述例（task-design）:

#### task-design

task-designは、後続作業で新しい設計判断を生じさせず、合意済み内容を手を動かして反映する
だけの状態を作る。designの深さはexecution planの有無で変えない。

##### WHY→WHAT→HOWの順序で下ろす

HOWから始めるとWHYを暗黙に決め、目的への異議で下位設計が全て崩れる。このため、file変更や
実装方式から話し始めてtaskの目的とscopeが未合意なら違反と診断する。判断時は「いま書こうと
しているHOWは、合意済みのWHYとWHATから一意に導けるか」と問う。

##### 変更点一覧をdesign完了と扱わない

変更点一覧しかなく完成後の世界を読めない場合は、file一覧が正確でもdesign完了と判定しない。

具体的な記述例（別skill）:

#### review skill

review skillは、指摘件数を増やすのではなく、変更の意図を壊す欠陥を、証拠と修正可能な単位で
利用者へ返す。

##### false positiveより証拠を優先する

証拠がない断定を禁止し、指摘しない範囲を明示する。PRを開く順序とGitHub API失敗時の再開位置は
workflowへ置き、このsectionへ複製しない。

記述のMUST:
- skillの恒久的な役割と、利用後に成立する判断能力または行動能力を具体化する。
- 複数の原則が一つの上位思想から導かれる場合、その階層を保つ。原則を平坦なtableへ
  一行ずつ分解しない。
- 役割、方針、能力境界、具体caseを固定の表示枠にしない。独立したpolicyは固有見出しへ分け、
  各pieceの関係に応じて表現記法を選ぶ。
- 原則名だけでなく、誤適用を防ぐために必要な理由、違反signal、帰結、判断質問、具体例を残す。
  全原則を同じ固定fieldへ穴埋めするのではなく、利用時の判断能力が欠けないことを優先する。
- 維持する能力、変更する能力、廃止する能力を区別し、未合意の削除を「簡素化」と扱わない。
- 禁止と非目標について、何をしないかだけでなく、隣接ownerまたは正しい戻り先を示す。
- 関係するworkflow、file deliverable、contractへ必要な参照を持ち、同じpolicy本文を複製しない。

判断基準:
- skill名とworkflowを残したままこのsectionを削除すると、実装者が別の思想・品質基準を持つ
  skillへ作り替えられるか。Yesなら記述が必要である。
- 初見の実装者が、境界caseで何を優先し、何を完了とせず、どこで停止するかをpolicyから
  説明できるか。
- 将来の短縮や共通化で、どの能力を削除してはならず、何を合意すれば変更できるか分かるか。
- workflowの手順、fileの章構造、今回の変更理由をこのsectionへ混ぜていないか。
-->

#### {skill名}

{このskillが何を完成させるために存在し、利用後にagentまたは利用者が何を判断・実行できるかを、短い散文で記述する。}

<!--
ここから先は固定fieldではない。独立したpolicyごとに内容を表す固有見出しを必要数だけ置く。
一つのpolicy内でも、子policyが独立した理由、条件、例外、caseを持つなら見出し階層を一段下げる。
能力境界、禁止、非目標、negative diagnosis、具体caseは、関係するpolicyの近くに置く。
-->

##### {policyの内容を表す固有見出し}

{policy、必要性、適用条件、例外、破った場合の帰結を、実際の意味関係に合う記法で記述する。}

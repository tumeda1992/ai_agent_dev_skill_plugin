# Function migration ledger

## 1. Baseline

- baseline revision: `c3537350f31059a24f4960d9248f04766d213ac6`
- main migration source: baseline revisionにある`plugins/tumeda-dev/skills/task-design/`、callerである`plugins/tumeda-dev/skills/steering/SKILL.md`、公開consumer説明`plugins/tumeda-dev/skills/README.md`、contract validator `scripts/verification/validate-plugin.mjs`
- independent immediate source: discussion記録ownerである`plugins/tumeda-dev/skills/facilitate-discussion/`
- destination: 同じproduction pathへ、合意済みのworkflow変更だけを適用する
- prototype: `./task-design_template_prototype/templates/`
- 方向: 現行task-design contractを、条件付きexecution planとoutcome section選択型design templateへ移行する
- baseline固定時点のproduction source差分: なし

### 合意済みの変更

| ID | 分類 | 合意内容 | 根拠 |
| --- | --- | --- | --- |
| A-001 | `CHANGE` | tasklistまたはroadmapは常時必須ではなく、本番applicationのruntime behaviorを変更してtestで正しさを確認する通常のapplication coding、実行時に段階を踏む作業、ユーザー指定の作業がある場合だけ作る。skill ecosystemの補助tool codeはcodeであることだけでは対象にしない | 初回依頼、論点1・イテレーション3 |
| A-002 | `RETIRE` | 軽量モードというmode labelと、完成後の姿を不要とする分岐を廃止する | 初回依頼、論点3 |
| A-003 | `CHANGE` | 完成後の姿は固定された成果物種別ではなく、変化対象に応じたsectionを選んで構成する | 初回依頼、論点1 |
| A-004 | `CHANGE` | execution plan対象一覧は`対象`、`掲載理由`、`参照するdesign section`だけを持つ索引とし、対象ごとの完成後の姿を持たない | 論点1 |
| A-005 | `CHANGE` | 対象成果物への即時適用は目的またはdefaultにしない。未決decisionやfile間contractに依存しない場合だけ任意で行い、依存があればtask-design内で待って一括適用する | 論点3 |
| A-006 | `KEEP` | discussion decisionは確定直後に`design.md`へ記録し、次の論点より先に設計全体を再評価する | 論点3で既存contractの維持を確認 |
| A-007 | `KEEP` | 調査・技術検証実装はdesign中の不確実性解消手段であり、execution planへ載せない | 初回依頼で維持を明示 |
| A-008 | `CHANGE` | `facilitate-discussion`は一decisionを返した後も、委託されたテーマが続く間の記録ownerであり、handoff前に未収録議論を同期する | 論点5 |
| A-009 | `ADD` | 合意済みdiscussionを再合意なしで保存し、記録漏れへ事後に気づいた場合は結論だけでなく議論の変遷と反映済み状態を再構成する | 論点5 |
| A-010 | `ADD` | 認識齟齬を具体案の前に原因ownerへroutingし、docsまたはskillの一般則を先に合意する。即時反映後は同じoriginating decisionについて`doc-enricher`を一度だけreviewする | 論点2 |
| A-011 | `CHANGE` | 対象成果物変更のrouting stateは`design.md`付録を単一正本とし、別state fileを作らない。完成後の姿とは分離し、完了時は適用済みとexecution plan対象を確定差分として残す | 論点6 |
| A-012 | `CHANGE` | execution plan対象zeroでは`planless_complete`を返す。steeringは三result共通の終了前gateを通し、planlessでは開始確認・dispatchをせず、子完了とsummaryへ伝播する | 論点7 |
| A-013 | `CHANGE` | 完成後の姿へ差し込むtemplate群は`templates/outcome-sections/`に置き、同directoryの`catalog.md`を選択正本とする。汎用componentまたは比喩的なworldとして命名しない | 論点8、提案2・3 |
| A-014 | `ADD` | docs中心steeringの完成後の姿として`documentation.md`を独立させ、形式知化、読者の判断、知識構造、規範の根拠と境界、snapshot維持規律、document構造を設計する | 論点8、提案3 |
| A-015 | `ADD` | runtime条件とworkflow contractをそれぞれ`runtime-and-configuration.md`、`workflow.md`の独立outcome sectionとして選択可能にする | 論点8、提案1〜3 |
| A-016 | `ADD` | 調査・比較・技術検証そのものが主成果の場合だけ`research-findings.md`を選ぶ。別outcomeの設計途中で得た事実は該当sectionへ根拠として書き戻す | 論点8、提案1〜3 |
| A-017 | `RETIRE` | prototypeの`migration-and-rollout.md`を完成後outcome sectionとして採用しない。終了状態はoutcome section、中間制約はRequirements／risk、実行順・停止点はtasklist／roadmapへroutingしてmigration能力を維持する | 論点8、提案1〜3 |
| A-018 | `ADD` | interaction flowへ、今回変わる失敗・操作中断・境界caseの分岐step、call／stateへの影響、actorの観測と次の操作を追加する | 論点9の四候補一括合意 |
| A-019 | `ADD` | data sectionへ、relation／state変更時の更新・削除後dataと、全caseを貫く不変条件を追加する | 論点9の四候補一括合意 |
| A-020 | `ADD` | public contractへ、成功時のresult／side effectと、caller-facingな失敗contract／state保証を追加する | 論点9の四候補一括合意 |
| A-021 | `ADD` | screen sectionへ、今回変わる状態ごとの表示、操作可否、次の操作を追加する | 論点9の四候補一括合意 |
| A-022 | `ADD` | 完成後の個別skillの恒久的な役割、判断方針、能力境界、禁止・非目標を`skill-policy.md`で設計する | 論点18、22、24 |
| A-023 | `CHANGE` | `public-contracts.md`を、callerが依存する保証の`caller-contracts.md`と、codeの責務配置・依存構造の`code-structure.md`へ分割する | 論点23、提案1への明示合意 |
| A-024 | `ADD` | scope、分割、名前、templateが未決のoutcome section候補を、採用済みcatalogと分けてprototype READMEで管理する | 論点26、ユーザー直接指定 |
| A-025 | `ADD` | migration／refactoring後のcontract保存・明示差分を`contract-preservation.md`で表す。designはbaseline scope、全量保存宣言、人が理解できる意味差分とledger ID citation、ledgerはcontract単位のclassificationと証拠を正本として持つ | 論点17、提案4への明示合意 |
| A-026 | `CHANGE` | 完成後状態を理解・維持するために必要な最終理由はdesign内でself-containedに保ち、固定章ではなくoutcome section READMEの生成・配置gateに従って関係するWHATの後へ置く | 論点21、提案1への明示合意 |
| A-027 | `RETIRE` | 全taskへ固定の`設計判断`章、`選択した原則と理由`、`代替案と棄却理由`、各placeholderを生成するformatを廃止する | 論点21、提案1への明示合意 |
| A-028 | `KEEP` | riskとtestは設計意図から独立した必須章として維持する。固定設計判断章の廃止に伴う章番号の4、5への繰上げだけを行う | 論点21、提案1への明示合意 |
| A-029 | `CHANGE` | `skill-policy.md`は役割、判断方針、能力境界、禁止、非目標という意味要件を維持しながら、固定四枠を出力formatとして要求しない。短いroleを入口に、独立したpolicyを固有見出しへ分け、各pieceの関係に応じて`expression_notation.md`の記法を選ぶ | 論点28、提案0への明示合意 |

`A-018`〜`A-021`は一つの上位意図で一括承認された。atomic IDを分けるのは意味保存とowner検証のためであり、追加ごとの承認を要求するためではない。論点4は既存能力の未合意欠落を禁止するdecisionであり、意図的な追加をprototypeへ適用・検証して修正することを禁止しない。

### 未合意で変更してはならない領域

- tasklist、roadmapの内部設計、実行時gate、取消条件、commit・push・PR条件は変更指示がないため全量維持する。
- task-designの設計思想、自己診断、例、失敗例、判断質問、skill更新規則は変更指示がないため全量維持する。

## 2. 構造ledger

構造rangeはbaseline revisionの行番号で固定する。`ADAPT`は章のownerと意味を維持し、合意済み変更へ必要なbindingだけを読み替える分類である。

| ID | source | structural role / relation | destination | classification | agreement / evidence |
| --- | --- | --- | --- | --- | --- |
| S-TD-001 | `task-design/SKILL.md:1-22` | metadata、trigger、model、mode、plan ownership | future `task-design/SKILL.md` frontmatter | `ADAPT` | A-001、A-002。その他は維持 |
| S-TD-002 | `task-design/SKILL.md:24-46` | skill目的、完了定義、配置入力、言語、domain名、repository context | future `task-design/SKILL.md`「目的と入力」 | `KEEP` | destination通読で照合予定 |
| S-TD-003 | `task-design/SKILL.md:47-271` | 設計境界、完了自己診断、完成後の姿5観点、具体例、問い | future `task-design/SKILL.md`「設計とは何か」+ outcome sections | `ADAPT` | A-003、A-013〜A-016。判断能力は全量維持 |
| S-TD-004 | `task-design/SKILL.md:272-426` | WHY→WHAT→HOW、TBD、合意、spike、対話の思想 | future `task-design/SKILL.md`「設計思想」 | `KEEP` | destination通読で照合予定 |
| S-TD-005 | `task-design/SKILL.md:427-484` | 成果物、designとdiscussionのowner、decision反映順序 | future `task-design/SKILL.md`「成果物と正本」 | `ADAPT` | A-001、A-003、A-004、A-006 |
| S-TD-006 | `task-design/SKILL.md:485-700` | Step 0〜6、working directory、調査、初稿、discussion、spike、合意、plan、result | future `task-design/SKILL.md`「Flow」 | `ADAPT` | A-001、A-005、A-006、A-007、A-012、A-026〜A-028。completion reviewの固定4章参照を局所設計意図gateへ変更する |
| S-TD-007 | `task-design/SKILL.md:701-750` | NG集と戻り先 | future `task-design/SKILL.md`「絶対にやらないこと」 | `KEEP` | 新workflowにpathだけ適応 |
| S-TD-008 | `task-design/SKILL.md:751-787` | 起動、終了、境界、handoff | future `task-design/SKILL.md`「起動・終了条件」 | `ADAPT` | A-001、A-012。planlessは適用・validation完了後だけ終了 |
| S-TD-009 | `task-design/SKILL.md:788-829` | skill更新model、自己適用、失敗pattern | future `task-design/SKILL.md`「このskill自体の更新」 | `KEEP` | 全量維持 |
| S-TD-010 | `task-design/SKILL.md:830-892` | 軽量モードの適用、切替、差分、flow、成果物、維持原則 | common flowと各対応section | `ADAPT` | A-002。modeだけ廃止し、共通原則はMOVE |
| S-TL-001 | `task-design/tasklist-design.md:1-140` | leaf planのowner、作成、phase、test、UI、docs、feedback、完了、review | same path、同じsection群 | `KEEP` | 全量維持。plan作成前条件だけcallerで変更 |
| S-RM-001 | `task-design/roadmap-design.md:1-93` | composite判定、field owner、dependency、完了、review | same path、同じsection群 | `KEEP` | 全量維持。plan作成前条件だけcallerで変更 |
| S-DT-001 | `task-design/templates/design.md:1-69` | template思想、原文、親制約、TL;DR、既存仕様、Requirements | prototype `templates/design.md` core | `ADAPT` | A-003。削除は未許可 |
| S-DT-002 | `task-design/templates/design.md:70-167` | 完成後の姿4区分と具体化指示 | prototype `outcome-sections/catalog.md` + 各outcome section | `ADAPT` | A-003、A-013〜A-017。意味、理由、例、問いを保存し、docs・設定・環境構築のownerを分割する |
| S-DT-003 | `task-design/templates/design.md:168-207` | 設計判断、代替案、risk、test、変更点一覧 | prototype `outcome-sections/README.md`の設計意図gate + `templates/design.md` core + execution classification | `ADAPT` | A-004、A-011、A-026〜A-028。必要な最終理由は局所配置へ移し、固定章・固定subsectionを廃止する。risk/testは維持し、routing stateを末尾の付録へ集約 |
| S-TT-001 | `task-design/templates/tasklist.md:1-188` | execution checklist、取消、phase、quality、review、user check、公開action | prototypeとproductionの同path | `KEEP` | prototypeはbaselineと同一であることを確認済み |
| S-RT-001 | `task-design/templates/roadmap.md:1-101` | roadmap構造field、運用field、coverage、DAG | prototypeとproductionの同path | `KEEP` | prototypeはbaselineと同一であることを確認済み |
| S-ST-001 | `steering/SKILL.md:1-95` | metadata、入力、role、repository context、言語、directory、成果物、discussion | future `steering/SKILL.md`同等section | `ADAPT` | A-012。planlessを第三の完了routeとして追加 |
| S-ST-002 | `steering/SKILL.md:96-162` | directory準備、task-design起動、ready result検証 | future `steering/SKILL.md`「Flow Step 1〜3」 | `ADAPT` | A-001、A-012。三resultの排他的identityを検証 |
| S-ST-003 | `steering/SKILL.md:163-213` | plan合意後gate、doc-enricher、再発防止、開始確認 | future `steering/SKILL.md` common safety gate + plan route | `ADAPT` | A-012。safety reviewは三result共通、開始確認はplan routeだけに維持 |
| S-ST-004 | `steering/SKILL.md:214-238` | leaf dispatchとroadmap orchestration | future `steering/SKILL.md` plan route | `KEEP` | planが存在する場合の挙動を全量維持 |
| S-ST-005 | `steering/SKILL.md:239-268` | standalone roadmap昇格 | future `steering/SKILL.md`同section | `KEEP` | 全量維持 |
| S-ST-006 | `steering/SKILL.md:269-298` | 実装完了後reviewとrouting | future `steering/SKILL.md`同section | `KEEP` | 全量維持 |
| S-ST-007 | `steering/SKILL.md:299-320` | 禁止事項と合意済み廃止 | future `steering/SKILL.md`同section | `ADAPT` | A-012。planlessを未完了扱いせず、非dispatchを明示 |
| S-VL-001 | `scripts/verification/validate-plugin.mjs:1-末尾` | plugin構造、version、skill contract、runtime fixtureの実行validator | same path | `ADAPT` | A-001〜A-003、A-012〜A-028に関係するassertionだけ変更し、他skill／runtime検証は全量維持 |
| S-FD-001 | `facilitate-discussion/SKILL.md:1-79` | metadata、目的、起動gate、owner、入力、不変条件 | production同path | `ADAPT` | A-008、A-009、A-010。起動条件とconsumer固有workflow境界は維持 |
| S-FD-002 | `facilitate-discussion/SKILL.md:80-265` | 論点選択、提案、iteration、決定、routing、完了gate | production同path | `ADAPT` | A-008、A-009、A-010。既存routing・履歴・親子contractは維持 |
| S-FDT-001 | `facilitate-discussion/templates/discussion_entry.md:1-84` | discussion entryの必須骨格 | same path | `KEEP` | 論点5でtemplate変更なしを合意。production byte差分なし |

## 3. Contract ledger

### 3-1. task-designの核

| contract ID | source | kind | meaning | destination | classification | agreement / verification |
| --- | --- | --- | --- | --- | --- | --- |
| TD-C001 | `SKILL.md:1-22` | trigger/default | 起動条件、Opus推奨、日本語、plan ownershipを宣言する | future frontmatter | `ADAPT` | A-001、A-002以外を維持 |
| TD-C002 | `SKILL.md:28-46` | 目的/完了 | 実装中の新規設計判断をゼロにし、実装を手作業だけにする | future「目的」 | `KEEP` | TD-E002。baseline該当rangeに実差分hunkがなく、原文一致を確認 |
| TD-C003 | `SKILL.md:28-46` | 入力/配置 | standaloneとsteeringの両起動、working directory入力を扱う | future「入力と配置」 | `KEEP` | TD-E002。standalone／steering入力とworking directory契約の原文一致を確認 |
| TD-C004 | `SKILL.md:28-46` | 記述規則 | 日本語本文、domain固有名詞を略さない、contextを推測しない | future「記述規則」 | `KEEP` | TD-E002。日本語、完全名、context非推測の原文一致を確認 |
| TD-C005 | `SKILL.md:49-69` | 境界 | 設計は完成後の世界、実装は合意をcodeへ落とす段階と分ける | future「設計境界」 | `KEEP` | TD-E003。固定観点数の選択契約化以外の境界本文が残ることを直接差分で確認 |
| TD-C006 | `SKILL.md:49-69` | 禁止/理由 | 変更file一覧を完成後の姿の代わりにしない | future「設計境界」+ template注記 | `KEEP` | TD-E003、DTC-C013。skillとproduction templateの両方で変更一覧を設計の代替にしない理由を確認 |
| TD-C007 | `SKILL.md:70-95` | 完了gate | 新規判断、変更点だけ、section充足だけという3つのnegative diagnosisを使う | future「完了自己診断」 | `KEEP` | TD-E003。三つの問いが同じ順序と強度で残ることを目視確認 |
| TD-C008 | `SKILL.md:96-121` | 観点/例/問い | 操作flowをactor、call回数、順序、結果まで具体化する | outcome section `interaction-flow.md` + skill説明 | `MOVE` | DTC-I001〜DTC-I003。理由、NG、actor、call回数、順序、結果、問いを順方向・逆方向に照合済み |
| TD-C009 | `SKILL.md:122-150` | 観点/例/問い | dataを型だけでなく具体値と複数caseで検証する | outcome section `data.md` + skill説明 | `MOVE` | DTC-D001〜DTC-D002。理由、NG、具体row、正常／未設定／既存case、問いを順方向・逆方向に照合済み |
| TD-C010 | `SKILL.md:151-213` | 観点/理由/失敗例 | caller-facingなnameとcodeの責務配置・依存境界を全体layerとして読め、汎用directoryへ逃がさない | `caller-contracts.md` + `code-structure.md` + skill説明 | `CHANGE` | A-023。両観点の意味を維持し、常時一組という選択だけを分離する |
| TD-C011 | `SKILL.md:214-236` | 観点/例/問い | docs・設定成果物は内容、配置、形式まで設計する | outcome section `file-deliverables.md` + skill説明 | `MOVE` | DTC-F001〜DTC-F003。file、documentation、runtimeへownerを分け、内容、配置、形式、両具体例、問いを合算照合済み |
| TD-C012 | `SKILL.md:237-265` | conditional観点 | UI変更時にwireframe、配置理由、状態、input供給元を設計する | outcome section `screen.md` + skill説明 | `MOVE` | DTC-S001〜DTC-S002。wireframe、配置意図、状態、input供給元、NG／OK、問いを順方向・逆方向に照合済み |
| TD-C013 | `SKILL.md:266-271` | 自己check | deliverableごとに設計外判断が残るかを問う | future completion gate | `KEEP` | TD-E005。問いの原文と全選択outcomeへの適用を目視確認 |
| TD-C014 | `SKILL.md:274-326` | 順序/理由/問い | WHY→WHAT→HOWと、TBDで全体構造を先に合意する | future「設計思想」 | `KEEP` | TD-E006。baseline該当rangeの実差分hunk zeroを確認 |
| TD-C015 | `SKILL.md:327-358` | 合意gate | 方向性合意と設計合意を分け、上位から再帰的に合意する | future「設計思想」 | `KEEP` | TD-E006。baseline該当rangeの実差分hunk zeroを確認 |
| TD-C016 | `SKILL.md:359-392` | fallback/例 | discussion・調査・spikeを使い分け、spike後は事実をdesignへ戻す | future「不確実性解消」 | `KEEP` | A-007 |
| TD-C017 | `SKILL.md:393-426` | 対話/禁止 | 転記、脊髄反射、推測埋め、合意なし型変更を禁止する | future「対話」 | `KEEP` | TD-E006。baseline該当rangeの実差分hunk zeroを確認 |

### 3-2. 成果物、discussion、進行

| contract ID | source | kind | meaning | destination | classification | agreement / verification |
| --- | --- | --- | --- | --- | --- | --- |
| TD-C018 | `SKILL.md:427-452` | 正本/owner | design、discussion、排他的planの役割を分ける | future「成果物と正本」 | `ADAPT` | A-001、A-004 |
| TD-C019 | `SKILL.md:442-452` | 更新順序 | decision確定ごとに`design.md`へ書き、未決提案は書かない | future「design.md lifecycle」 | `KEEP` | A-006 |
| TD-C020 | `SKILL.md:453-484` | owner境界 | discussion内部processは`facilitate-discussion`、task-designはcontextと戻り先を所有する | future「discussion consumer contract」 | `KEEP` | TD-E009、FD-C001〜FD-C007。consumer入力と戻り先、facilitator内部owner、decision返却を相互照合済み |
| TD-C021 | `SKILL.md:489-527` | trigger/directory | 起動判定、working_dir 4分岐、name-work-directory、衝突時停止、子roadmap制約を守る | future「Step 0〜0.5」 | `KEEP` | TD-E010〜TD-E011。軽微除外、4分岐、name、衝突停止、子四入力、strictly narrowerを目視確認 |
| TD-C022 | `SKILL.md:528-544` | 調査順序 | repository context、類似実装、README、doc-enricher、現状UI実測を初稿前に行う | future「Step 0.75」 | `KEEP` | 論点2決定までは変更禁止 |
| TD-C023 | `SKILL.md:545-568` | 初稿/lifecycle | TBD込み初稿を作り、investigationとrequirementsを条件付き別正本にする | future「Step 1」 | `KEEP` | prototypeから落ちていたため復元対象 |
| TD-C024 | `SKILL.md:569-575` | 合意順序 | 初稿では全TBD解消を求めず、骨格だけを先に合意する | future「Step 2」 | `KEEP` | TD-E014。TBD込み構造合意と全TBD解消を求めない本文を目視確認 |
| TD-C025 | `SKILL.md:576-595` | loop | 最上位不確実性を一つ選び、discussion・調査・spikeで解消して再評価する | future「Step 3」 | `KEEP` | TD-E015。三解消手段、decision／fact単位の記録、全体再評価を目視確認 |
| TD-C026 | `SKILL.md:596-604` | spike契約 | `spike/`の命名、配置、環境、成果物保存条件を守る | future「spike」 | `KEEP` | TD-E016。命名理由、独立／product module、環境、成果物管理を目視確認 |
| TD-C027 | `SKILL.md:605-612` | discussion境界 | discussion状態をsessionや独自形式で管理しない | future「discussion境界」 | `KEEP` | TD-E017。task-design／facilitatorの三owner境界と独自状態管理禁止を目視確認 |
| TD-C028 | `SKILL.md:613-632` | side effect/gate | skill・docs改善候補は合意後だけ適用し、通常はcontextが熱いうちに扱う | future「副産物」 | `ADAPT` | A-005、A-010。原因分類とdecision単位reviewは`facilitate-discussion`へ集約し、consumerの適用時期判定だけを残す |
| TD-C029 | `SKILL.md:633-668` | design完了gate | 要件分類、TBD zero、収束、自己診断、根拠追跡、自然言語合意、二段階通読を必須にする | future「Step 4」 | `ADAPT` | A-026〜A-028。最終理由のself-containednessと二段階通読を維持し、固定4章への集約・本文理由禁止だけを局所設計意図gateへ変更する |
| TD-C030 | `SKILL.md:669-685` | plan選択 | leaf/compositeを意味で判定し、排他planを設計・reviewする | future「execution plan gate」 | `ADAPT` | A-001。対象がある場合の内部挙動はKEEP |
| TD-C031 | `SKILL.md:686-700` | result/完了 | designとplan合意、feedback zero、TBD zeroを確認してready resultを返す | future「完了result」 | `CHANGE` | A-001、A-012。plan対象zeroは`planless_complete`、他二resultは既存fieldを維持 |
| TD-C032 | `SKILL.md:701-750` | 禁止/自己review | A〜FのNGと対応する戻り先を自己reviewする | future「NG集」 | `KEEP` | 全項目のatomic照合が必要 |
| TD-C033 | `SKILL.md:751-787` | trigger/境界 | 起動不要の軽微変更、迷ったら起動、plan実行非ownerを定める | future「起動・終了」 | `ADAPT` | A-001。軽微判定の変更は未指示 |
| TD-C034 | `SKILL.md:788-829` | self-change gate | 構造変更はOpus、思想を自己適用し、観測済み失敗patternを検査する | future「skill更新」 | `KEEP` | 全量維持 |
| TD-C035 | `SKILL.md:830-892` | mode | 軽量mode labelとmode固有分岐 | 廃止 | `RETIRE` | A-002。詳細はLM-C001〜LM-C019で行単位に分類 |
| TD-C036 | `SKILL.md:830-892` | preserved principles | non-code task coverage、discussion駆動、decision単位記録、再評価、file成果物観点、設計思想 | future common flow + outcome sections | `ADAPT` | A-002はmode廃止であり共通能力は維持。詳細はLM-C002〜LM-C019 |

### 3-2a. 軽量モードのatomic mapping

軽量mode sectionを一括削除対象にしない。mode identityと、modeにしかなかった能力を分け、後者は共通flowまたはoutcome sectionへ移す。

| contract ID | source | kind / meaning | destination | classification | agreement / verification |
| --- | --- | --- | --- | --- | --- |
| LM-C001 | `SKILL.md:830-832` | mode前提 | docs／skillでは完成後の姿が不要なので軽量modeを使う | 廃止 | `RETIRE` | A-002。docs／skillも一つの完成後の姿を持つcommon flowへ変更 |
| LM-C002 | `SKILL.md:834-846` | trigger / examples | docs、prompt、skill、規範、議論駆動taskをtask-designで扱える | future frontmatterのtrigger + `outcome-sections/catalog.md`の非code mapping | `ADAPT` | A-002、A-014〜A-016。mode選択ではなく共通flowのoutcome選択へ読み替える |
| LM-C003 | `SKILL.md:848-851` | mode switch | 軽量modeの選択・途中切替にユーザー合意を求める | 廃止 | `RETIRE` | A-002。mode自体を廃止するため切替も存在しない |
| LM-C004 | `SKILL.md:852` | discussion boundary | 設計contextを渡し、discussion file内部形式はtask-designで定義しない | future §4 discussion consumer contract | `ADAPT` | mode理由fieldだけ除き、owner境界は既存§4と合算して維持 |
| LM-C005 | `SKILL.md:856-860` | common core / exception | 目的と完了条件は必須、完成後の姿は不要 | future design core。不要分岐だけ廃止 | `ADAPT` | 目的・完了条件はKEEP、完成後の姿不要はA-002でRETIRE |
| LM-C006 | `SKILL.md:861,864` | requirements exception | designのRequirementsと`requirements.md`を省略できる | 廃止。長い場合だけ既存Step 1で`requirements.md`へ切り出す | `RETIRE` | A-002でmode差分を廃止し、合意済みdesign §3-1でbaseline Requirements contractの維持を確定 |
| LM-C007 | `SKILL.md:862` | design format | `D1, D2, ...`の決定事項stockをdesignの主内容にする | future templateの該当outcome／設計判断section | `ADAPT` | A-006。decision単位の即時反映は維持し、時系列stock formatは廃止 |
| LM-C008 | `SKILL.md:863` | plan requirement | design合意後にtasklist／roadmapを必ず作る | future execution plan gate | `CHANGE` | A-001、A-012。対象zeroは`planless_complete` |
| LM-C009 | `SKILL.md:865` | discussion artifact | task-design discussionを軽量modeの主成果物として常時持つ | future Step 3の条件付きdiscussion route | `ADAPT` | A-002。discussion駆動能力を共通化し、議論が生じた時だけ正本として持つ |
| LM-C010 | `SKILL.md:866` | doc review | 軽量modeでは`doc-enricher`を起動しない | future pre-design reading review + discussion decision review + steering final review | `CHANGE` | A-010。即時反映decisionごとに一回reviewし、既存の他timingも維持 |
| LM-C011 | `SKILL.md:870` | mode declaration | 軽量modeを宣言・合意して開始する | 廃止 | `RETIRE` | A-002 |
| LM-C012 | `SKILL.md:871-873` | minimal design | 目的、完了条件、決定stockだけを持ち、完成後の姿と要件を書かない | 廃止 | `RETIRE` | A-002。common design templateを使い、該当outcome sectionを選ぶ |
| LM-C013 | `SKILL.md:874-875` | outer loop / discussion | 最上位不確実性と解消手段を選び、discussionでは§4 contextを渡す | future Step 3 + §4 | `MOVE` | common flowへ合流。現行Step 3／§4と意味を合算照合 |
| LM-C014 | `SKILL.md:876-877` | update order / convergence | decisionまたはfactごとにdesignへ反映し、完了条件と不確実性を再評価する | future Step 3 + design lifecycle | `ADAPT` | A-006。`D1` bindingだけ該当outcome／設計判断sectionへ変更 |
| LM-C015 | `SKILL.md:878` | design completion | 完了条件を満たしてdesignを合意する | future Step 4 | `ADAPT` | checkbox formatに限定せず、既存full completion gateへ統合 |
| LM-C016 | `SKILL.md:879` | plan flow | leaf／compositeを判定し必ずplanを作る | future execution plan gate | `CHANGE` | A-001、A-012。対象がある場合だけ既存leaf／composite判定をKEEP |
| LM-C017 | `SKILL.md:880` | task-design completion | completion gateを満たすまで完了しない | future Step 6 | `ADAPT` | planlessを含む三resultの排他的completion gateへ統合 |
| LM-C018 | `SKILL.md:882,887` | discussion owner | modeごとにdiscussion内部processを再定義せず、`facilitate-discussion`を正本とする | future §4 discussion consumer contract | `MOVE` | A-008〜A-010と合算し、task-design側へ内部processを複製しない |
| LM-C019 | `SKILL.md:884-892` | artifact / principles | decision stock、discussion記録、file成果物観点、五つの設計思想を維持する | future design template、Step 3、`outcome-sections/`、sections 2〜3 | `ADAPT` | decision stock formatと不要分岐だけ廃止。discussion、file／documentation outcome、全設計思想は共通flowで維持 |

### 3-2b. task-design production edit map

productionの`task-design/SKILL.md`は全面書換えしない。baselineのsection 1〜8を原文土台として残し、次のrangeだけを合意済み変更へ適応する。`KEEP` rangeは原文同一を基本とし、前後の見出し番号または参照先変更が避けられない場合だけ機械的に更新する。

| edit ID | source | source responsibility | production action | classification | preserved / changed contract | white-box verification |
| --- | --- | --- | --- | --- | --- | --- |
| TD-E001 | `SKILL.md:1-22` | trigger、model、軽量mode、plan ownership | docs／skill／調査を含む設計taskを共通triggerへ含め、軽量mode記述を除き、条件付きexecution plan ownershipへ変更する | `ADAPT` | Opus推奨と既存五triggerは原文維持。A-001、A-002、LM-C002だけを適用 | frontmatterの既存trigger五件が残り、`軽量モード`がzero、planが条件付きと読めること |
| TD-E002 | `SKILL.md:24-46` | 目的、完了定義、起動形式、言語、固有名詞、repository context | 原文維持 | `KEEP` | TD-C002〜TD-C004 | baseline rangeとのtext diff zero |
| TD-E003 | `SKILL.md:47-95` | 設計境界、四対象、三negative diagnosis | 固定観点数だけcatalog選択へ読み替え、境界・理由・例・三diagnosisは原文維持する | `ADAPT` | TD-C005〜TD-C007。A-003、A-013により`4つ`という閉じた列挙だけ変更 | 変更file一覧を設計としない例と三つの問いが残り、選択正本がcatalogを指すこと |
| TD-E004 | `SKILL.md:96-265` | 操作、data、public name／module、file、screenの理由、NG／OK、問い | 詳細本文の正本を対応するoutcome sectionへ移し、本体はcatalogを使う選択契約と各ownerへの導線に置き換える | `MOVE` | TD-C008〜TD-C012、DTC-I001〜DTC-S002 | sourceの理由、NG、OK例、判断基準がDTC mappingのdestinationに一つ以上存在し、本体と二重正本にならないこと |
| TD-E005 | `SKILL.md:266-271` | deliverableごとの自己check | wordingを原文維持し、選択した全outcome sectionへ適用することだけ明示する | `ADAPT` | TD-C013 | 問いの原文が残り、未選択sectionの機械充足を要求しないこと |
| TD-E006 | `SKILL.md:272-426` | WHY→WHAT→HOW、TBD、合意、spike、対話の思想 | 原文維持 | `KEEP` | TD-C014〜TD-C017、LM-C019 | baseline rangeとのtext diff zero |
| TD-E007 | `SKILL.md:427-440` | 成果物と排他的planのowner | designを常時成果物、discussionを発生時の正本、planを対象がある時だけの排他的成果物として記述する | `ADAPT` | TD-C018、A-001、A-004 | planの二種排他性と分割rule読了義務を残し、plan常時必須の文がzeroであること |
| TD-E008 | `SKILL.md:442-452` | design lifecycle | 原文維持 | `KEEP` | TD-C019、A-006 | decision即時記録、TBD、未決提案禁止の三項が原文同等で残ること |
| TD-E009 | `SKILL.md:453-484` | discussion consumer contract | owner境界、渡すcontext、decision返却後の順序を維持し、mode名とmode固有制約だけを除く | `ADAPT` | TD-C020、LM-C004、LM-C018 | `facilitate-discussion`内部processを複製せず、context入力と返却後処理が残ること |
| TD-E010 | `SKILL.md:485-494` | trigger判定 | `実装タスク`に閉じずtask-design対象taskとし、軽微変更の既存除外は維持する | `ADAPT` | TD-C021、LM-C002 | section 7と同じ起動条件を参照し、軽微除外の意味が変わらないこと |
| TD-E011 | `SKILL.md:495-527` | working directoryとartifact lifecycle | 4分岐、name、衝突停止、子roadmap制約を原文維持し、artifact列挙とplan作成条件、mode参照だけを変更する | `ADAPT` | TD-C021、A-001、A-002 | 4分岐、全子入力、strictly narrower制約が残り、planはdesign合意後かつ対象ありの場合だけであること |
| TD-E012 | `SKILL.md:528-544` | 初稿前調査 | 原文維持 | `KEEP` | TD-C022。これは即時反映decision後reviewとは別の既存timing | repository context、類似実装五観点、README、reading時doc-enricher、UI実測、事実／判断分離がすべて残ること |
| TD-E013 | `SKILL.md:545-568` | 初稿、investigation、requirements | `4観点`をcatalogから必要sectionを選ぶ手順へ変更し、TBD、固有名詞、`investigation.md`、条件付き`requirements.md`のlifecycleを原文維持する | `ADAPT` | TD-C023、A-003、A-013〜A-016 | catalogを完全に読み、選択sectionを完全に読む指示があり、investigation四stepとrequirements非二重管理が残ること |
| TD-E014 | `SKILL.md:569-575` | TBD込み構造合意 | 原文維持 | `KEEP` | TD-C024 | baseline rangeとのtext diff zero |
| TD-E015 | `SKILL.md:576-595` | 外側loopと不確実性解消 | 原文維持し、decisionのdesign記録と対象成果物への適用を区別する導線だけ副産物sectionへ置く | `KEEP` | TD-C025、A-006、A-007、LM-C013〜LM-C014 | 三解消手段、facilitator境界、decision／fact単位の記録・再評価が残ること |
| TD-E016 | `SKILL.md:596-604` | spike配置・運用 | 原文維持 | `KEEP` | TD-C026、A-007 | `spike/`命名理由、独立／product module、環境、成果物管理の全契約が残ること |
| TD-E017 | `SKILL.md:605-612` | discussion境界 | 原文維持 | `KEEP` | TD-C027、A-008〜A-010 | task-designが行う／行わない、facilitatorが行う、の三ownerが残ること |
| TD-E018 | `SKILL.md:613-632` | skill／docs副産物の適用 | 原因owner routingは`facilitate-discussion`を正本として参照し、返却decisionをdesignへ記録した後、対象artifactへの適用時期を依存関係で判定する。独立時は任意の即時適用、依存時はtask-design内で保留し整合する単位で一括適用する | `CHANGE` | TD-C028、A-005、A-010。合意なし編集禁止とcontextを熱いうちに永続化する意図は維持 | `即時反映（推奨）`と軽微例外がzero。原因routing、依存判定、適用済み／pending記録、同一origin一回reviewへの導線があること |
| TD-E019 | `SKILL.md:633-668` | design完了gate | 既存gateを維持し、付録routing stateの`分類保留`zeroとtask-design内適用pendingの解消を追加する。planを前提にする読み手self-reviewを三result共通へ一般化し、理由の固定4章集約をREADMEの生成・配置gateへ変更する | `ADAPT` | TD-C029、A-011、A-012、A-026〜A-028 | 要件分類、TBD、収束、二自己診断、根拠、自然言語合意、二段階通読、最終理由のself-containednessが残り、固定理由章への依存とrouting未決がzeroであること |
| TD-E020 | `SKILL.md:669-685` | leaf／composite判定とplan review | 最初にexecution plan対象をA-001の三条件で分類する。zeroならplanを作らずStep 6へ進み、一件以上なら既存leaf／composite判定と六stepを原文維持する | `ADAPT` | TD-C030、A-001、A-004 | plan対象一覧が対象・理由・design参照だけを持ち、対象別完成後の姿を持たず、対象ありrouteの既存六stepが残ること |
| TD-E021 | `SKILL.md:686-700` | task-design完了とresult | 三resultの共通gateと排他的identityを定義し、planlessではplan file zero、適用pending zero、確定差分が付録に残ることを検証する | `CHANGE` | TD-C031、A-011、A-012 | `tasklist_ready`と`roadmap_ready`の既存fieldが変わらず、`planless_complete`が`working_dir`、`design_path`だけを返すこと |
| TD-E022 | `SKILL.md:701-750` | NG集 | 各NG本文を維持し、旧固定観点の参照先だけ選択outcomeへ更新する。plan不要対象の掲載、依存中の対象artifact適用、routing state未確定での完了を合意済みNGとして追加する | `ADAPT` | TD-C032、A-001、A-005、A-011 | baseline A〜Fの全checkboxが一対一で残り、三つの新workflow違反を検出できること |
| TD-E023 | `SKILL.md:751-787` | 起動、終了、非owner境界 | 起動条件へnon-code設計taskを含める。終了をdesign合意後の三resultへ変更し、planlessではexecution非ownerのまま対象artifact適用とvalidation完了をtask-designの範囲に含める | `ADAPT` | TD-C033、A-001、A-002、A-012 | 軽微除外と迷ったら起動を維持し、planlessを未完了扱いせず、plan routeでは実行非ownerを維持すること |
| TD-E024 | `SKILL.md:788-829` | skill自己更新gate | 原文維持 | `KEEP` | TD-C034 | baseline rangeとのtext diff zero |
| TD-E025 | `SKILL.md:830-892` | 軽量modeの全差分と共通能力 | LM-C001〜LM-C019のdestinationを先に実装・照合してからsectionを削除する | `ADAPT` | TD-C035、TD-C036、A-002 | `軽量モード`zeroかつLM-C002、004、005、007、009、013〜019のdestination evidenceが全件passすること |

### 3-2c. steering production edit map

productionの`steering/SKILL.md`も原文土台を維持する。planless routeは、既存plan routeを一般化できる箇所へだけ追加し、tasklist dispatch、roadmap orchestration、standalone roadmap、実装完了後reviewを短縮しない。

| edit ID | source | source responsibility | production action | classification | preserved / changed contract | white-box verification |
| --- | --- | --- | --- | --- | --- | --- |
| ST-E001 | `steering/SKILL.md:1-7` | metadata、caller／orchestrator概要、trigger、model | task-designの三resultを受け、plan resultだけdispatchする説明へ変更する | `ADAPT` | trigger、tool、model、effortは原文維持。A-012だけを適用 | 既存triggerが残り、planlessをdispatchすると読める文がzeroであること |
| ST-E002 | `steering/SKILL.md:9-25` | role、二ready result、非重複review、開始gate | `planless_complete`を第三resultとして追加し、三result共通gateとplan二resultだけの開始確認／dispatchを分ける | `ADAPT` | ST-C001、A-012 | 二plan resultの既存説明とplan自動実行禁止を残し、planlessの非dispatchが一意に読めること |
| ST-E003 | `steering/SKILL.md:27-37` | repository context、言語、domain名 | 原文維持 | `KEEP` | S-ST-001の非result部分 | baseline rangeとのtext diff zero |
| ST-E004 | `steering/SKILL.md:38-60` | canonical directoryとroot artifact | naming、path、directory ownerを原文維持し、`tasklist.md | roadmap.md`をexecution plan対象ありの場合だけのartifactとする | `ADAPT` | ST-C001、A-001、A-012 | basename、月path、root owner、禁止三件が残り、planless rootを正常に表せること |
| ST-E005 | `steering/SKILL.md:61-75` | artifact lifecycle、追加task、legacy memo | design／discussion／review lifecycleを原文維持し、plan lifecycleへ条件を付ける | `ADAPT` | ST-C001、A-001 | 同一featureのplan追加、legacy非規範性を維持し、planlessへ空plan作成を要求しないこと |
| ST-E006 | `steering/SKILL.md:76-95` | steering discussion ownerと用途 | 原文維持 | `KEEP` | discussion contract | baseline rangeとのtext diff zero |
| ST-E007 | `steering/SKILL.md:96-127` | directory作成と前月summary | 既存tasklist／roadmap status判定とexact formatを維持し、plan fileがない時だけdesign付録からplanless完了を判定するbranchを追加する | `ADAPT` | ST-C001、A-012 | 既存二status ruleとsingle writer理由が残り、planlessは分類保留なし、反映待ちなし、execution plan対象なしだけ完了になること |
| ST-E008 | `steering/SKILL.md:129-149` | task-design起動、root binding、子四入力、discussion分離 | 原文維持し、task-designがplanなしresultを返し得ることとplan artifactの条件だけを反映する | `ADAPT` | ST-C002、A-012 | `create_working_dir=false`、子四入力、二discussion正本の区別が残ること |
| ST-E009 | `steering/SKILL.md:151-161` | ready result identityと差戻し | 三resultを排他的に検証する。planlessでは両plan file不存在、design付録の分類保留section不存在、反映待ちとexecution plan対象が`なし`、適用済み行のvalidationと参照先を確認する | `CHANGE` | ST-C002、A-011、A-012 | 内容の重複reviewをせずidentity／stateだけ検証し、矛盾時は同じdirectoryでtask-designへ戻すこと |
| ST-E010 | `steering/SKILL.md:163-204` | doc-enricher、再発防止、skill自身のreview、timely proposal | `Plan合意後`を三result共通のready result後gateへ一般化する。本文と三reviewは原文維持し、decision単位でreview済みのoriginを重複提案しない | `ADAPT` | ST-C003、A-010、A-012 | 4-1〜4-3とファインプレー四則が残り、planlessもgateを通り、同一origin reviewを重複しないこと |
| ST-E011 | `steering/SKILL.md:205-213` | plan実行開始確認 | `tasklist_ready | roadmap_ready`だけのbranchに置き、本文を原文維持する。planlessはこのStepを通らない | `MOVE` | ST-C003、A-012 | plan合意と開始承認を区別する四契約がplan routeに全件残ること |
| ST-E012 | `steering/SKILL.md:214-238` | leaf dispatchとroadmap orchestration | plan routeの本文を原文維持する。子task-designの三resultを許可し、子planlessを正常完了としてphase完了へ伝播する | `ADAPT` | ST-C004、A-012 | leafの四contract、roadmap七step、runtime field ownerを残し、planlessをexecutorへ渡さないこと |
| ST-E013 | `steering/SKILL.md:239-298` | standalone roadmap昇格と実装完了後review | 原文維持 | `KEEP` | ST-C005、ST-C006 | baseline rangeとのtext diff zero |
| ST-E014 | `steering/SKILL.md:299-320` | NGと明示廃止 | 既存禁止十件と明示廃止五件を原文維持し、planlessのdispatch／開始確認禁止と共通gate省略禁止を追加する | `ADAPT` | ST-C007、A-012 | baseline全項目が残り、planlessを未完了扱いまたは実行対象にする誤りを検出できること |

### 3-2d. 公開consumer descriptionのedit map

初回検索をresult名へ狭めたため、旧文言を固定するrepository validatorを見落とした。production本文反映後の実行で`scripts/verification/validate-plugin.mjs`が判明したため、公開READMEとは別のcode execution targetとして追加する。generic skill validatorはbaselineのClaude用`model`／`effort`を許可しないため補助結果として記録し、repository validatorをplugin contractのprimary validationとする。

| edit ID | source | source responsibility | production action | classification | white-box verification |
| --- | --- | --- | --- | --- | --- |
| PUB-E001 | `skills/README.md:29` | steeringの公開概要 | task-designの三resultを受け、plan resultはdispatch、planless resultは共通gate後に完了する概要へ変更する | `ADAPT` | A-012。roadmap binding、status伝播、再帰実行を維持 |
| PUB-E002 | `skills/README.md:30` | task-designの公開概要 | 一つのcompleted world、条件付きexecution plan、planless completionのownerとして変更する | `ADAPT` | A-001〜A-003、A-012。designとplanの設計・review・合意能力を維持 |

### 3-2e. repository validatorのedit map

| edit ID | source | source responsibility | production action | classification | white-box verification |
| --- | --- | --- | --- | --- | --- |
| VAL-E001 | `scripts/verification/validate-plugin.mjs:96` | tumeda-dev release versionの一致と期待値 | 論点15で決定した`6.0.0`へ、統合design最終合意後に期待値と四version宣言を一batchで一致させる | `CHANGE` | 2026-08-10、suffixなしの`6.0.0`で四宣言と期待値を同期し、version failure zeroとJSON parse成功を確認 |
| VAL-E002 | `scripts/verification/validate-plugin.mjs:142-324,397-403`のtask-design assertion | 既存調査、directory、discussion、completed world、plan、result contractを退行検出する | 旧固定`観点5`、通常／軽量mode、mode固有文、二result前提を、catalog、outcome files、decision単位routing、三result、条件付きplanのassertionへ変更する | `ADAPT` | 2026-08-10、旧assertionを撤去し、outcome file集合、四routing state、本番application coding、三result、固定設計判断format／旧path禁止のassertionがpassした |
| VAL-E003 | `scripts/verification/validate-plugin.mjs:342-359,415-438`のsteering assertion | 必須gate、開始確認、result、roadmap、summary、review contractを退行検出する | `Plan合意後`と二result前提を、三result共通Ready result後gate、planless非dispatch、summary／子完了伝播へ変更する | `ADAPT` | 2026-08-10、plan routeの開始確認assertionを維持し、Ready result後gate、planless非dispatch、summary／子完了伝播のassertionがpassした |
| VAL-E004 | 上記以外の`validate-plugin.mjs` | manifest構造、facilitate-discussion、runtime contract、executor、visual/test child等の検査 | 原文維持 | `KEEP` | 変更hunkはVAL-E001〜VAL-E003へ全件逆引き済みで、変更対象外fixtureは未変更。四宣言と`expectedRelease`の同期後、repository validator全件pass |

### 3-3. tasklistとroadmap

この二fileの内部contractは変更しない。baseline revisionと現在のproduction sourceにtext差分がなく、prototypeの二templateもproductionとbyte一致することを確認した。このため各`KEEP` contractのwhite-box evidenceはsource identityそのものである。

| contract ID | source | kind | meaning | destination | classification | agreement / verification |
| --- | --- | --- | --- | --- | --- | --- |
| TL-C001 | `tasklist-design.md:1-18` | owner/input/output | 合意済みdesignから排他的tasklistを作り、executorをsingle writerにする | same path | `KEEP` | baseline text diff zero |
| TL-C002 | `tasklist-design.md:19-43` | phase/gate | DB migration停止点、incrementalな操作単位phase、layer分割禁止 | same path | `KEEP` | baseline text diff zero |
| TL-C003 | `tasklist-design.md:44-52` | test | 各phaseで変更挙動のtestを作成・変更する | same path | `KEEP` | baseline text diff zero |
| TL-C004 | `tasklist-design.md:53-59` | quality | repository context由来の全体checkをerror zeroまで行う | same path | `KEEP` | baseline text diff zero |
| TL-C005 | `tasklist-design.md:60-74` | UI | UI変更phaseごとと最終phaseでvisual-inspector確認し、Playwright直接利用を禁止する | same path | `KEEP` | baseline text diff zero |
| TL-C006 | `tasklist-design.md:75-80` | order/reason | 実装前に確立したdocumentは最初の実装phaseへ置く | same path | `KEEP` | baseline text diff zero |
| TL-C007 | `tasklist-design.md:81-96` | feedback/public action | doc-enricher、implementation review、user確認、commit、push、PRの条件を守る | same path | `KEEP` | baseline text diff zero。A-010はtask-design／steering側の追加timingであり、このcontractを変更しない |
| TL-C008 | `tasklist-design.md:97-104` | complete/cancel | checkbox即時更新、未完継続、取消理由限定、環境停止を取消にしない | same path | `KEEP` | baseline text diff zero |
| TL-C009 | `tasklist-design.md:105-132` | review gate | DoD、phase、test、UI、docs、公開action、取消、roadmap非ownerを全件reviewする | same path | `KEEP` | baseline text diff zero |
| TL-C010 | `tasklist-design.md:133-140` | feedback routing | plan修正、design差戻し、roadmap切替を意味でroutingする | same path | `KEEP` | baseline text diff zero |
| RM-C001 | `roadmap-design.md:1-13` | owner/input/output | roadmap構造はtask-design、運用fieldはsteeringがsingle writer | same path | `KEEP` | baseline text diff zero |
| RM-C002 | `roadmap-design.md:14-28` | selection | strictly narrowerな二つ以上の子design loopとDAGだけroadmapにする | same path | `KEEP` | baseline text diff zero |
| RM-C003 | `roadmap-design.md:29-47` | field ownership | structure fieldとruntime fieldを分離する | same path | `KEEP` | baseline text diff zero |
| RM-C004 | `roadmap-design.md:48-59` | dependency/TBD | dependency resultを子制約へ渡し、親構造TBDをready時に残さない | same path | `KEEP` | baseline text diff zero |
| RM-C005 | `roadmap-design.md:60-65` | complete/deviation | 全体完了をphaseから導出し、逸脱はimplementation reviewへ置く | same path | `KEEP` | baseline text diff zero |
| RM-C006 | `roadmap-design.md:66-83` | review gate | scope、coverage、DAG、field owner、排他性を全件reviewする | same path | `KEEP` | baseline text diff zero |
| RM-C007 | `roadmap-design.md:84-93` | feedback routing | wording、構造、親design、leaf切替をroutingする | same path | `KEEP` | baseline text diff zero |

### 3-4. templateとsteering consumer

| contract ID | source | kind | meaning | destination | classification | agreement / verification |
| --- | --- | --- | --- | --- | --- | --- |
| DT-C001 | `templates/design.md:1-35` | core/strength | 原文を意訳せず保持し、親制約とWHYを持つ | prototype core | `KEEP` | DTC-C001〜DTC-C004でatomic照合 |
| DT-C002 | `templates/design.md:36-69` | baseline/requirements | 既存仕様、MUST、SHOULD、MAY、非目標、受入基準を持つ | prototype core | `KEEP` | DTC-C005〜DTC-C008でatomic照合 |
| DT-C003 | `templates/design.md:70-167` | completed world | 操作、data、公開契約、file成果物を具体値・例・問い付きで表す | prototype `outcome-sections/` | `ADAPT` | A-013〜A-017に従いownerを分割。原sourceとのbijective照合は継続 |
| DT-C004 | `templates/design.md:168-195` | rationale/risk/test | 必要な設計理由と実在する代替案を最終状態の理解に必要な時だけ持ち、riskとtestは独立して持つ | prototype `outcome-sections/README.md` + core | `ADAPT` | A-026〜A-028。DTC-C010〜DTC-C012でsemantic contractと廃止formatを分けてatomic照合 |
| DT-C005 | `templates/design.md:196-207` | change appendix | 完成後の姿から導く変更範囲を前捌きとして持つ | prototype execution classification | `ADAPT` | DTC-C013。A-004、A-005、A-011によりrouting stateの単一正本と終了時差分証跡を兼ねる |
| TT-C001 | `templates/tasklist.md:1-188` | executable template | task完全完了、取消、phase、quality、review、user確認、公開actionを表す | same template | `KEEP` | baselineとprototypeのbyte diffなし |
| RT-C001 | `templates/roadmap.md:1-101` | roadmap template | 構造field、運用field、coverage、DAGを表す | same template | `KEEP` | baselineとprototypeのbyte diffなし |
| ST-C001 | `steering/SKILL.md:9-95` | caller/owner | canonical directory、artifact lifecycle、discussion ownerを持つ | future steering同section | `ADAPT` | A-012。planless完了routeを追加 |
| ST-C002 | `steering/SKILL.md:96-162` | call/result gate | task-designを起動し、resultとfile identityを検証する | future Step 1〜3 | `CHANGE` | A-001、A-012。`planless_complete`と付録zero stateを検証 |
| ST-C003 | `steering/SKILL.md:163-213` | safety gate | doc-enricher、再発防止、skill確認、実行開始確認をplan実行前に行う | future common safety gate + plan route | `ADAPT` | A-012。三resultでreviewを維持し、開始確認はplan routeだけにする |
| ST-C004 | `steering/SKILL.md:214-238` | dispatch | tasklist executorとroadmap treeをsingle-writer契約でdispatchする | future plan route | `KEEP` | ST-E012。既存leaf四contract、roadmap七step、runtime field ownerを維持し、子planless伝播だけを追加したことを目視・validatorで確認 |
| ST-C005 | `steering/SKILL.md:239-268` | optional flow | standalone roadmap昇格のread-only gateと明示承認を守る | future same section | `KEEP` | ST-E013。baseline該当rangeの実差分hunk zeroを確認 |
| ST-C006 | `steering/SKILL.md:269-298` | feedback lifecycle | implementation reviewを正本に原因をroutingし、自動再開しない | future same section | `KEEP` | ST-E013。baseline該当rangeの実差分hunk zeroを確認 |
| ST-C007 | `steering/SKILL.md:299-320` | prohibition/history | 実装・test非owner、gate省略禁止、合意済み廃止を維持する | future same section | `ADAPT` | A-012。planlessの非dispatchと共通gateを明示 |
| VAL-C001 | `validate-plugin.mjs:96` | release contract | manifest四宣言を同じ期待releaseへ固定する | same path | `CHANGE` | 論点15で`6.0.0`と決定済み。統合design最終合意後に四宣言と`expectedRelease`を一batchで同期し、論点10のassertion追随とは独立に検証する |
| VAL-C002 | `validate-plugin.mjs:142-324,397-403` | task-design regression | completed world、調査、directory、discussion、plan／resultの必須contractを検査する | same path | `ADAPT` | A-001〜A-003、A-012〜A-028。旧modeと固定設計判断章のassertionだけ合意済みcontractへ置換し、他assertionを維持 |
| VAL-C003 | `validate-plugin.mjs:342-359,415-438` | steering regression | gate、開始確認、result、summary、roadmap、reviewを検査する | same path | `ADAPT` | A-012。三result共通gateとplanless非dispatch／伝播を追加 |
| VAL-C004 | 上記以外の`validate-plugin.mjs` | unrelated regression | 他skill、manifest構造、runtime fixtureの検査を維持する | same path | `KEEP` | production diffで変更hunk zeroを確認する |

### 3-5. `design.md`完成後の姿sectionのatomic mapping

初版prototypeは次のcontractをplaceholderへ要約していたため不適合だった。baselineを起点に再構築した現在の対応を示す。これは指摘されたoutcome section範囲の順方向照合であり、template全体の監査完了を意味しない。

| contract ID | source | kind / meaning | destination | classification | verification |
| --- | --- | --- | --- | --- | --- |
| DTC-I001 | `templates/design.md:70-80`、`SKILL.md:100-121` | 操作flowを動的視点として持つ理由、粗い記述の失敗、call・順序・回数の判断基準 | `outcome-sections/interaction-flow.md`「なぜ必要か」「NG」「判断基準」 | `MOVE` | 理由、NG、判断基準を目視照合 |
| DTC-I002 | `templates/design.md:81-87` | 作成以外の削除・更新・再取得、tap粒度、frontend／backend validation照合をMUSTにする | `outcome-sections/interaction-flow.md`「ケース選択のMUST」 | `MOVE` | 全条件を目視照合 |
| DTC-I003 | `templates/design.md:88-101`、`SKILL.md:108-117` | actor操作から公開call、server責務、data変更、返却、表示までの具体的な記述例とtemplate | `outcome-sections/interaction-flow.md`「具体的な記述例」+ 記入block | `ADAPT` | 具体例と記入blockを分離して照合 |
| DTC-I004 | 論点9で一括承認した追加 | 失敗・操作中断・境界caseのselection、分岐step、call／state、actorの観測と次の操作 | `outcome-sections/interaction-flow.md`「失敗・操作中断・境界case」 | `ADD` | A-018。public error表現とscreen stateを参照先へ委ねるowner境界を目視照合 |
| DTC-D001 | `templates/design.md:103-111`、`SKILL.md:122-150` | schema列挙ではなく具体値と複数caseでdata整合を判断する理由、NG、OK例、問い | `outcome-sections/data.md`「なぜ必要か」〜「判断基準」 | `MOVE` | 理由、NG、row例、case、判断基準を目視照合 |
| DTC-D002 | `templates/design.md:112-119` | row dataと正常・未設定・既存patternを記録するtemplate | `outcome-sections/data.md`のrow例と典型case | `ADAPT` | baselineの正常、未設定、既存patternを保持し、取得不能はbaseline具体例から適応 |
| DTC-D003 | 論点9で一括承認した追加 | relation／state変更時の更新・削除後dataと、全caseを貫く不変条件 | `outcome-sections/data.md`「更新・削除後のdata」「不変条件」 | `ADD` | A-019。operation sequenceをinteractionへ委ね、before／afterと整合条件だけを所有 |
| DTC-P001 | `templates/design.md:120-125`、`SKILL.md:151-168` | caller-facingなnameとcode structureを上から追い、全体layerのflowと責務境界を読めるようにする理由 | `caller-contracts.md`「なぜ必要か」+ `code-structure.md`冒頭 | `CHANGE` | A-023。理由を維持し、両section常時必須だけを条件選択へ変更 |
| DTC-P002 | `templates/design.md:126-139`、`SKILL.md:169-193` | 機械的な動詞を避け、domain name、根拠、signatureを具体化するNG・OK・問い | `caller-contracts.md`のNG、具体例、判断基準、記入block | `ADAPT` | 三つの具体例、代替名理由、caller-facing ownerを目視照合 |
| DTC-P003 | `templates/design.md:140-153`、`SKILL.md:194-213` | 汎用directoryへ逃がさず、配置、責務、依存境界、call flowを具体化するNG・OK・問い | `code-structure.md`のNG、具体例、判断基準、記入block | `ADAPT` | directory例、禁止例、判断基準、配置・境界・call blockを目視照合 |
| DTC-P004 | 論点9で一括承認した追加 | caller contractの成功result／side effectとcaller-facingな失敗表現／state保証 | `caller-contracts.md`「mutation / endpoint / caller contract」「失敗contract」 | `ADD` | A-020。actor sequenceと画面表示をinteraction／screenへ委ねるowner境界を目視照合 |
| DTC-F001 | `templates/design.md:154-167`、`SKILL.md:214-236` | file成果物をlistingで終えず、対象、読者、内容、構造、配置、形式、具体例まで設計する | `outcome-sections/file-deliverables.md` + `outcome-sections/documentation.md` + `outcome-sections/runtime-and-configuration.md` | `ADAPT` | A-014、A-015。物理artifact、知識体系、runtime条件へownerを分け、同じ判断能力を合算で維持 |
| DTC-F002 | 同上のarchitecture document例と、将来の読者がcodeを再調査せず判断できるという問い | `outcome-sections/documentation.md`「具体的な記述例」「読者と成立させる判断」「完成後のdocument構造」 | `ADAPT` | A-014。元の内容・配置・形式を維持し、形式知化と維持規律を合意済み追加 |
| DTC-F003 | 同上のtest環境例と、設定・環境構築の配置・形式を具体化する能力 | `outcome-sections/runtime-and-configuration.md`「具体的な記述例」「file配置と既存pattern」 | `MOVE` | A-015。Vitest例、配置、実行条件をruntime ownerへ保存 |
| DTC-S001 | `SKILL.md:237-265` | UI変更時のwireframe、配置意図、完成画面、input供給元、NG・OK・問い | `outcome-sections/screen.md` | `MOVE` | ItemCard例、4判断条件、input mappingを目視照合 |
| DTC-S002 | 論点9で一括承認した追加 | 今回変わるUI stateごとの表示、操作可否、次の操作 | `outcome-sections/screen.md`「今回変わる状態別の見え方」 | `ADD` | A-021。全stateの機械列挙を禁止し、call sequenceとerror表現を他ownerへ委ねる境界を目視照合 |

### 3-5a. `design.md` coreのatomic mapping

完成後の姿以外も「見出しがある」だけでは保存とみなさない。旧templateのコメントが持つ理由、禁止、強度を次の単位でprototypeへ対応付ける。

| contract ID | source | kind / meaning | destination | classification | verification |
| --- | --- | --- | --- | --- | --- |
| DTC-C001 | `templates/design.md:3-10` | designは変更点一覧ではなく完成後の世界を揃える文書であり、完成後の姿が中心、前提・必要な理由・担保・付録には主従がある | prototype `design.md`冒頭comment + `outcome-sections/README.md`「設計意図との合成」 | `ADAPT` | 固定四観点をcatalog選択へ一般化し、必要な理由を第3章へ局所配置する。変更点一覧では不十分という理由と章の主従を維持 |
| DTC-C002 | `templates/design.md:12-14` | 元依頼を要約・意訳せず原文保持する | prototype `design.md`「元の依頼内容」 | `KEEP` | `全く要約や意訳を加えず`と`そのままここに転記`を復元 |
| DTC-C003 | `templates/design.md:16-26` | 子phaseでは親path、identity、目的、scope、scope外、DoD、dependencyを持ち、参考情報でなく上位制約としてstrictly narrowerにする | prototype `design.md`「上位roadmap制約」 | `KEEP` | 七fieldと、section削除条件、上位制約、strictly narrowerを目視照合 |
| DTC-C004 | `templates/design.md:30-32` | TL;DRにWHYとWHATを2〜4文で書く | prototype `design.md`「1. TL;DR」 | `ADAPT` | WHY／WHATを維持し、合意済みworkflowを表す終了状態を追加 |
| DTC-C005 | `templates/design.md:36-43` | 感覚で始めず既存仕様を確認し、列挙でなく制約・合意の要点まで書き、なければ新規と明記する | prototype `design.md`「前提とする既存仕様」 | `ADAPT` | 元の三つの指示を復元し、確認元を追加 |
| DTC-C006 | `templates/design.md:47-60` | RequirementsはWHATの境界でありHOWを書かず、MUST／SHOULD／MAYを区別する | prototype `design.md`「2. 要件」 | `KEEP` | WHAT／HOW境界と三分類を目視照合 |
| DTC-C007 | `templates/design.md:61-63` | 非目標はscope外を明示して設計膨張を防ぐ | prototype `design.md`「非目標」 | `KEEP` | `設計の膨張を防ぐ`という理由を復元 |
| DTC-C008 | `templates/design.md:65-66` | 受け入れ基準で完了判断を可能にする | prototype `design.md`「受け入れ基準」 | `ADAPT` | `終了時の状態を観測できる基準`として判定可能性を強化。未分類だった独立`変化の境界`sectionは削除 |
| DTC-C009 | `templates/design.md:70-167` | 完成後の姿が設計の核心であり、異なる観点を合算して一つの世界を表す | prototype `design.md`「3. 完成後の姿」+ `outcome-sections/catalog.md` | `CHANGE` | A-003、A-013。固定四観点は選択式へ変更するが、中心性、一つの世界、観点欠落による認識不一致を維持 |
| DTC-C010 | `templates/design.md:168-175` | 完成後の姿を先に示し、「設計を守る」のでなく「この世界を実現する」ために必要な理由を書く | `outcome-sections/README.md`「設計意図との合成」 | `CHANGE` | A-026、A-027。WHAT→WHYとself-containednessを維持し、固定4章・固定理由欄だけを廃止する |
| DTC-C011 | `templates/design.md:177-179` | 実在し合意された代替案のうち、最終状態の理解・維持に必要な棄却理由を残す | `outcome-sections/README.md`「設計意図との合成」 | `CHANGE` | A-026、A-027。四条件を満たす内容だけを局所設計意図へ置き、固定subsectionとplaceholderを廃止する |
| DTC-C012 | `templates/design.md:182-192` | risk／対策とtest方針を設計意図から分離して持つ | prototype `design.md`「4. リスクと対策」「5. テスト方針」 | `KEEP` | A-028。二sectionの独立性、必須性、fieldを維持し、章番号だけ繰り上げる |
| DTC-C013 | `templates/design.md:196-207` | 変更範囲は設計から導くtaskの前捌きであり、完成後の姿の代替でないため付録に置く | prototype `design.md`「（付録）変更の実行区分」 | `ADAPT` | A-004、A-005、A-011。元の主従理由を復元し、変更file種別の固定二分をrouting state四区分へ変更 |

### 3-6. Prototype追加の採否

baselineの意味保存とは分けて追跡する。未合意の候補はproduction templateへ移さない。合意済みの候補はmain migrationのatomic監査完了までprototypeに留め、論点31でtemplate内容へ影響する未決decisionがzeroになったことを確認してからproductionへ一括同期した。

| candidate ID | prototype上の追加 | classification | agreement | 扱い |
| --- | --- | --- | --- | --- |
| P-ADD-001 | interaction sectionの失敗・操作中断・境界case専用block | `ADD` | A-018で一括合意 | prototypeへselection gate、owner境界、tableを反映済み |
| P-ADD-002 | data sectionの更新・削除後caseと独立した不変条件block | `ADD` | A-019で一括合意 | prototypeへconditional tableと不変条件を反映済み |
| P-ADD-003 | caller contractの成功時・失敗時field | `ADD` | A-020で一括合意 | `caller-contracts.md`へ成功result／side effectと失敗contract tableを反映済み |
| P-ADD-004 | screen sectionの状態別表示table | `ADD` | A-021で一括合意 | prototypeへ状態selection gateと表示／操作可否／次操作tableを反映済み |
| P-ADD-005 | `runtime-and-configuration.md`を独立outcome sectionにする構造 | `ADD` | A-015で合意 | prototypeへ反映済み。旧file成果物観点の設定・環境能力をこのownerへMOVEする |
| P-ADD-006 | `workflow.md`を独立outcome sectionにする構造 | `ADD` | A-015で合意 | prototypeへ反映済み。owner、正本、gate、state、handoffが変わるtaskだけ選ぶ |
| P-ADD-007 | `migration-and-rollout.md`を独立outcome sectionにする構造 | `RETIRE` | A-017で不採用合意 | prototypeから撤去済み。migration能力はRequirements、risk、tasklist、roadmapへroutingする |
| P-ADD-008 | 調査主成果の独立section | `ADD` | A-016で`research-findings.md`として合意 | prototypeへ反映済み。設計途中の調査は該当outcome sectionへ書き戻す |
| P-ADD-009 | documentation-only outcomeの独立section | `ADD` | A-014で合意 | prototypeへ`documentation.md`として反映済み。file deliverableへ矮小化しない |
| P-CHG-010 | directoryとcatalogを`outcome-sections/`配下へ集約する | `CHANGE` | A-013で合意 | prototypeへ反映済み。旧`design-components/`とroot catalogは使用しない |
| P-ADD-011 | skillの恒久的な役割・判断方針・能力境界の独立section | `ADD` | A-022で合意 | prototypeへ`skill-policy.md`として反映済み。表示formatはP-CHG-015で適応する |
| P-CHG-012 | public contractとmodule境界を一fileからcaller contractとcode structureへ分割する | `CHANGE` | A-023で合意 | `caller-contracts.md`と`code-structure.md`へ移植し、旧fileを撤去 |
| P-ADD-013 | 未決outcome section候補のREADME backlog | `ADD` | A-024で直接指定 | 採用済みcatalogと分離し、暫定fileを作らず候補を保持 |
| P-ADD-014 | contract保存・明示差分の独立section | `ADD` | A-025で合意 | `contract-preservation.md`へ二層正本、closed-world差分宣言、三記入blockと局所記入例を反映済み |
| P-CHG-015 | `skill-policy.md`の固定四枠を、意味関係に応じて記法を選ぶ構造へ変更する | `CHANGE` | A-029で合意 | prototypeへ短いrole、固有policy見出し、親子階層、局所的な境界・case、`expression_notation.md`参照を反映し、論点31の統合batchでproductionへ同期済み |

論点31のproduction同期では、prototypeとproductionの`templates/`全file集合と内容をbyte比較し、差分zeroを確認した。旧`public-contracts.md`はA-023／P-CHG-012どおり撤去され、`caller-contracts.md`と`code-structure.md`へ置換された。`tasklist.md`と`roadmap.md`はbaseline revision、prototype、productionのSHA-256がそれぞれ一致し、変更されていない。

### 3-7. `facilitate-discussion`の即時変更

論点5と論点2はtask-design template migrationと独立し、一fileで閉じて未決decisionへ依存しないため、prototypeを作らずproductionへ即時反映した。

| contract ID | baseline source | baseline contract | production destination | classification | verification |
| --- | --- | --- | --- | --- | --- |
| FD-C001 | `SKILL.md:8-17` | discussion fileをsession外の正本とし、完全案・feedback・decisionを保存する | `SKILL.md`「目的と成果」 | `ADAPT` | A-008。decision返却とテーマの記録ownership終了を分離 |
| FD-C002 | `SKILL.md:29-46` | facilitatorとconsumerのowner境界 | `SKILL.md`「責務境界」 | `ADAPT` | A-008、A-009、A-010。記録同期、reconstruction、原因routing、decision単位reviewをfacilitatorへ追加 |
| FD-C003 | `SKILL.md:61-78` | discussionの正本、履歴、domain workflow分離、不変条件 | `SKILL.md`「全体の設計意図」「workflow全体で守る不変条件」 | `ADAPT` | A-008、A-009。既存不変条件を削除せずhandoff前同期を追加 |
| FD-C004 | `SKILL.md:80-105` | 一decisionを扱いconsumer適用へ返すworkflow | `SKILL.md`「実行workflow」 | `ADAPT` | A-008、A-010。handoff前同期と即時反映後reviewを追加し、domain適用は引き続き外側 |
| FD-C005 | `SKILL.md:155-255` | 論点routing、提案、iteration、合意、reparent、取下げ | production同section + `2.1.1` + `2.3.5` | `ADAPT` | A-009、A-010。既存variantを維持し、原因owner routingと合意済みdiscussion分岐を追加 |
| FD-C006 | `SKILL.md:256-265` | 論点level完了gate | production同section + `3. handoff前に委託scopeの記録を同期する` | `ADAPT` | A-008、A-009。通常同期と事後reconstructionを追加 |
| FD-C007 | 論点2の合意済み追加 | 認識齟齬の原因分類、一般則優先、適用時期のconsumer境界、一origin一回の`doc-enricher` review | `SKILL.md`「2.1.1 認識齟齬を原因ownerへ戻す」 | `ADD` | A-010。成果物固有、repository知識、skillの三分類と非再帰条件を直接差分で確認する |
| FDT-C001 | `templates/discussion_entry.md:1-84` | 原文、原因、提案、検証、iteration、routing、決定、ネクストアクションを持つ | same path | `KEEP` | `git diff`で変更なしを確認対象とする |

## 4. 現在の監査結果

```text
構造range登録 28
contract group登録 79
outcome section atomic mapping 16
template core atomic mapping 13
軽量mode atomic mapping 19
task-design production edit mapping 25
steering production edit mapping 14
public consumer edit mapping 2
repository validator edit mapping 4
合意済み追加 9
合意済み変更 8
明示廃止 2
production前の未割当atomic contract 0
production実差分の逆引き 完了
未分類削除 0
未分類追加 0
分類保留 0
task-design内反映待ち 0
```

`contract group登録`だけをmain migrationの完了件数とは扱わない。production前のsource range、atomic contract、合意済み追加・変更・廃止に加え、production実差分の全hunkと新規fileを下表でedit IDへ逆引きした。四version宣言とvalidatorの`expectedRelease`は`6.0.0`へ同期済みである。`facilitate-discussion`は独立laneとして論点5・2の合意、source mapping、直接差分、validationを揃えている。

### 4-1. production実差分の最終逆引き

baseline `c3537350f31059a24f4960d9248f04766d213ac6`からのproduction実差分を`--unified=0`でhunk単位に列挙し、削除行と追加行のownerを次のedit mapへ逆引きした。new outcome sectionは、file集合と全行をP-ADD／P-CHG、DTC atomic mappingへ割り当てた。

| production対象 | 実差分 | 逆引きowner | 最終判定 |
| --- | --- | --- | --- |
| 四version宣言 | 4 hunk、+4 / -4 | VAL-E001、VAL-C001、論点15 | `6.0.0`への同期以外の差分zero |
| `skills/README.md` | 1 hunk、+2 / -2 | PUB-E001〜PUB-E002 | 三resultと条件付きplanの公開概要だけを変更 |
| `facilitate-discussion/SKILL.md` | 13 hunk、+97 / -14 | FD-C001〜FD-C007、A-008〜A-010 | handoff前同期、事後reconstruction、原因owner routing、一origin一回reviewへ全件分類 |
| `steering/SKILL.md` | 18 hunk、+28 / -15 | ST-E001〜ST-E014 | 三result、共通gate、planless非dispatch／子伝播に全件分類。ST-E013のKEEP rangeにhunk zero |
| `task-design/SKILL.md` | 42 hunk、+106 / -285 | TD-E001〜TD-E025、LM-C001〜LM-C019 | catalog選択、四routing state、条件付きplan、三result、軽量modeの明示廃止／能力移管に全件分類 |
| `templates/design.md` | 31 hunk、+72 / -126 | DTC-C001〜DTC-C013、DTC-I／D／P／F／S、A-003〜A-004、A-011、A-026〜A-028 | core保存、選択式outcome、risk／test、routing付録へ全件分類 |
| `templates/outcome-sections/*.md` | 新規14 file、1,135行 | P-ADD-001〜014、P-CHG-010／012／015、DTC atomic mapping | productionとprototypeのfile集合・内容がbyte一致し、旧`public-contracts.md`は不存在 |
| `scripts/verification/validate-plugin.mjs` | 10 hunk、+72 / -8 | VAL-E001〜VAL-E004 | version、task-design、steering assertionへ全件分類し、変更対象外fixtureは維持 |
| tasklist／roadmapのdesign・template、discussion template | hunk zero | TL-C001〜TL-C010、RM-C001〜RM-C007、FDT-C001 | baselineとbyte一致。SHA-256も記録済み |

**逆引き結果:** 未分類削除0、未分類追加0。旧sourceからdestinationを追う順方向照合と、production差分からagreement／contract IDへ戻る逆方向照合の両方が閉じた。

### 4-2. 三result scenarioの最終照合

| scenario | task-designの到達状態 | steeringの到達状態 | 結果 |
| --- | --- | --- | --- |
| docs／skill等のplan不要変更 | 分類保留zero、反映待ちzero、適用済みvalidationあり、execution plan対象なし、両plan fileなしで`planless_complete` | 共通gate後、開始確認・dispatchなしで完了 | pass |
| 本番applicationのruntime behavior変更とtest | application codingをexecution plan対象へ置き、leaf planを設計・review・合意して`tasklist_ready` | 共通gateと開始確認後にtasklist-executorへdispatch | pass |
| strictly narrowerな複数子taskと依存DAG | composite判定後、roadmapを設計・review・合意して`roadmap_ready` | 共通gateと開始確認後、子steeringへbindingし、子planlessも正常完了として伝播 | pass |

repository validatorは三result名、共通成立保証、planless非dispatch／子伝播、旧二result前提の不存在を検査してpassした。これは上記のcontract scenario walkthroughを補強する回帰検査であり、white-box逆引きの代替にはしていない。

## 5. 次の監査gate

- [x] prototype coreへ`前提とする既存仕様`、Requirements 4分類、独立したriskとtestを復元した。
- [x] 既存templateの各コメント、具体例、判断質問をprototype coreまたはoutcome sectionへatomicに対応付ける。
- [x] task-designのsection 1〜8を、原文維持rangeと限定変更rangeへ分けたproduction edit mapへ対応付ける。
- [x] 軽量mode sectionから、廃止するlabel／分岐とcommon flowへ移す能力をatomicに分ける。
- [x] steering全rangeを、三result共通gate、plan専用route、原文維持rangeへ対応付ける。
- [x] tasklist／roadmapの内部contractとtemplateがbaselineから変更されていないことをtext／byte比較する。
- [x] repository validatorの旧mode／二result assertionを補助toolの変更対象として分離し、変更対象外assertionを`KEEP`へ割り当てる。
- [x] 論点10の合意に従ってvalidator assertionをtask-design内で追随させ、version failure一件だけが残ることを確認する。
- [x] 全atomic contractへproduction前destinationとwhite-box verification条件を付ける。
- [x] `facilitate-discussion`の通常同期、合意済みdiscussion、事後reconstructionをsmokeで検証し、原因owner routingと即時反映後reviewをsource mappingとskill validatorで検証する。
- [x] task-design、template、steeringのproduction前gateを`未割当atomic contract 0 / 未分類削除 0 / 未分類追加 0`で通過する。
- [x] 論点15でrelease versionを`6.0.0`、四宣言と`expectedRelease`をtask-design内で同期するroutingへ確定する。
- [x] 統合design最終合意後に四version宣言と`expectedRelease`を`6.0.0`へ同期し、production実差分の全削除行・全追加行をcontract IDへ逆引きして、三result scenario、repository validator、Markdown checkを通す。

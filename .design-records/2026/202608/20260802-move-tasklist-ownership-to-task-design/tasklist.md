# タスクリスト

## 設計参照

- `./design.md`

## 完了原則

- このfileの全taskを完了するまで作業を継続する。
- taskまたはsubtaskが完了した時点で直ちに`[x]`へ更新し、最後にまとめて更新しない。
- 未完了taskを別taskへ先送りしない。実装方針の変更で不要になった場合だけ、具体的理由を記録して取消完了にする。
- unrelatedな既存変更を編集・削除・commitしない。
- `tasklist.md`と`roadmap.md`を同じworking directoryの正本として併存させない。

## Phase 1: task-designが排他的なexecution planを設計できる

### DoD

task-designを一度起動すると、同じworking directoryでdesignを合意した後、scopeに応じてtasklistまたはroadmapのどちらか一方を設計・reviewし、対応するready resultを返せる。

### Tasks

- [x] 実装前のworktreeとbranchを確認する
  - [x] `git status --short`で既存変更を特定し、本taskの変更と混在させない
  - [x] current branchがdefault branchの場合、file編集前にwork branchの扱いをユーザーへ確認する
- [x] task-designのexecution plan共通契約を実装する
  - [x] `plugins/tumeda-dev/skills/task-design/SKILL.md`の成果物を`design + (tasklist | roadmap)`へ変更する
  - [x] leaf/compositeの意味的判断基準と排他的な`tasklist_ready | roadmap_ready`を規定する
  - [x] plan作成・自己レビュー・ユーザーレビューからdesignへ戻るloopと、双方合意までのcompletion gateを追加する
  - [x] standaloneは`create_working_dir=true`、既存directory callerは`false`を使う契約を維持する
  - [x] 軽量modeもdiscussion駆動のdesign合意後にexecution planを後置し、plan合意まで完了しないよう更新する
- [x] tasklist設計規則をtask-design本体の分割fileへ移す
  - [x] `plugins/tumeda-dev/skills/task-design/tasklist-design.md`を作成する
  - [x] phase分割、DoD、test、UI、migration gate、自己レビュー、ユーザーレビュー、feedback routingをsteeringから咀嚼して移す
  - [x] `plugins/tumeda-dev/skills/task-design/templates/tasklist.md`へtemplateを移し、設計参照を`./design.md`へ固定する
  - [x] 親roadmap更新taskを削除し、feedback routingをsteeringだけに固定しない
- [x] roadmap設計規則をtask-design本体の分割fileへ移す
  - [x] `plugins/tumeda-dev/skills/task-design/roadmap-design.md`を作成する
  - [x] 二つ以上のstrictly narrowerな子scope、親DoD cover、依存DAG、一子roadmap禁止をself-review gateにする
  - [x] `plugins/tumeda-dev/skills/task-design/templates/roadmap.md`へtemplateを移す
  - [x] 構造fieldとsteeringだけが更新する運用fieldをtemplate上で区別する
- [x] validatorへtask-design execution plan contractの検証を追加する
  - [x] 新しい分割fileとtemplateの存在を必須化する
  - [x] steering配下の旧tasklist/roadmap templateが存在しないことを検証する
  - [x] 排他的result、分割fileの完全読込、plan completion gateを検証する

## Phase 2: steeringがtask-design resultをdispatchしてroadmap treeを実行できる

### DoD

steeringを一度起動すると、自身のdirectoryをtask-designへ直接渡し、tasklist readyならleafとして終了し、roadmap readyなら各phaseを子steeringへbindingして依存順に実行できる。

### Tasks

- [x] `plugins/tumeda-dev/skills/steering/SKILL.md`をplan orchestratorへ変更する
  - [x] steering directoryを`working_dir_parent`として`create_working_dir=false`でtask-designへ渡す
  - [x] task-design専用子directory、`task_design_dir`探索、`steering.json`を新規flowから排除する
  - [x] design/tasklist/roadmapの内容設計と重複reviewを削除し、task-designのready resultを信頼する
  - [x] `tasklist_ready`をleaf、`roadmap_ready`をcompositeとしてdispatchする
- [x] roadmap runtime orchestrationを実装する
  - [x] roadmap phaseへ子steering pathを割り当て、statusと完了日だけをsteeringが更新する
  - [x] 子steeringへ`parent_roadmap_path`、`parent_phase_id`、親design、依存phaseの確定結果を渡す
  - [x] 子task-designがtasklistまたはnested roadmapを返す再帰flowを規定する
  - [x] roadmapの目的・scope・DoD・依存を変える場合はtask-designを`create_working_dir=false`で再開する
  - [x] leaf完了とcomposite完了を一段ずつ親roadmapへ伝播する
- [x] summary生成を排他的planに対応させる
  - [x] tasklistはcheckboxから`完了 / 未完了 / 不明`を判定する
  - [x] roadmapは全phaseの運用statusから同じ三状態を判定する
  - [x] 新規成果物はroot固定とし、旧形式のroot plan・一意な子design fallbackはread compatibilityとして維持する
- [x] validatorへsteering dispatchとroadmap field ownershipの検証を追加する
  - [x] initial task-design起動が`create_working_dir=false`であることを検証する
  - [x] ready result分岐、子binding、status伝播、構造変更時のtask-design再開を検証する
  - [x] summaryがtasklistとroadmapの両方を判定することを検証する

## Phase 3: standalone roadmapをcanonical steering nodeへ昇格できる

### DoD

ユーザーがstandalone roadmapの採用を指示すると、steeringはsourceとdestinationを提示して承認を得た場合だけbundle全体をcanonical pathへ移し、正本を複製せず通常のroadmap orchestrationへ合流できる。

### Tasks

- [x] steeringへ`adopt_task_design_working_dir=<absolute path>`契約を追加する
  - [x] 同一repository内の合意済み`design.md + roadmap.md` bundleだけを対象にする
  - [x] `tasklist.md`併存、未解消TBD、未合意roadmap、repository外sourceを拒否する
  - [x] source basenameから`.steering/YYYY/YYYYMM/<basename>/`を一意に解決する
- [x] 昇格前の安全gateを規定する
  - [x] source/destination、必須file、相対参照、Git状態、destination不存在をread-onlyで確認する
  - [x] exact source/destinationとpath変更を提示し、ユーザーの明示承認を必須にする
  - [x] merge、overwrite、suffix追加、自動copy/deleteを禁止する
- [x] 昇格後の再開契約を規定する
  - [x] bundle全体を一度だけ移動し、新pathだけを正本にする
  - [x] `steering.json`や旧source pointerを作らない
  - [x] 新しい`working_dir`、`design_path`、`roadmap_path`を返して子bindingを開始する
- [x] validatorへstandalone昇格contractの必須文言と禁止事項を追加する

## Phase 4: downstream consumerとrepository contextを新ownerへ揃える

### DoD

task-designが生成したtasklistをexecutorへ渡すと、executorは同階層のdesignを根拠にtasklistだけを実行し、repository context、GitHub helper、skill一覧のどこにも旧ownerや旧pathが残らない。

### Tasks

- [x] `plugins/tumeda-dev/skills/tasklist-executor/SKILL.md`を新配置へ対応させる
  - [x] tasklist pathから同directoryの`./design.md`を解決する契約を追加する
  - [x] roadmapを作成・更新しないことを明記する
  - [x] 親roadmap pathを探索・更新せず、tasklist完了結果だけをcallerへ返す
- [x] GitHub PR helperを実行owner配下へ移す
  - [x] `plugins/tumeda-dev/skills/steering/scripts/github/create_or_get_pr.sh`を`plugins/tumeda-dev/skills/tasklist-executor/scripts/github/create_or_get_pr.sh`へ移す
  - [x] tasklist templateと参照consumerを新pathへ更新する
- [x] repository contextのconsumer契約を更新する
  - [x] `plugins/tumeda-dev/skills/maintenance-plugin-context/SKILL.md`でtask-designへ全体test/lint command、UI確認環境、Git/GitHub公開条件を必要時に返せるようにする
  - [x] `plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md`のtask-design欄へtasklist設計用contextを移し、steering欄からtasklist固有制約を外す
- [x] `plugins/tumeda-dev/skills/README.md`のowner説明を更新する
  - [x] task-designをexecution plan設計ownerとして説明する
  - [x] steeringをready result dispatchとroadmap runtime orchestratorとして説明する
  - [x] tasklist-executorをtask-design生成tasklistのsingle execution writerとして説明する
- [x] validatorのconsumer pathとportable file一覧を更新する
  - [x] discussion consumerをtask-design配下のtasklist templateへ変更する
  - [x] 移動後helperを必須、steering配下の旧helperを不存在条件にする
  - [x] tasklist-executorのroadmap非更新とsibling design解決を検証する
- [x] manifestとmarketplaceのversionがすべて`5.0.0`のまま一致することを確認する

## Phase 5: static validationとcross-host smokeを完了する

### DoD

repository validatorとskill validatorがgreenになり、CodexとClaude Codeのread-only/workspace-write smokeでleaf、composite、nested child、standalone昇格の主要contractが期待どおり観測できる。

### Tasks

- [x] repository全体のstatic validationを実行する
  - [x] `node --check scripts/verification/validate-plugin.mjs`
  - [x] `node scripts/verification/validate-plugin.mjs`
  - [x] `git diff --check`
- [x] 変更した各skillをskill-creatorのquick validatorで検証する
  - [x] ~~task-design~~（技術的不適用: quick validatorのschemaが、このskillで維持必須のhost拡張frontmatter `model`を許容しない。repository validatorで`model: opus`を検証する）
  - [x] ~~steering~~（技術的不適用: quick validatorのschemaが、このskillで維持必須のhost拡張frontmatter `model`・`effort`を許容しない。repository validatorで`model: sonnet`・`effort: high`・`Agent`を検証する）
  - [x] ~~tasklist-executor~~（技術的不適用: quick validatorのschemaが、このskillで維持必須のhost拡張frontmatter `model`・`context`・`effort`・`tools`を許容しない。repository validatorで各host contractを検証する）
  - [x] maintenance-plugin-context
- [x] ~~temp repositoryでCodex smokeを実行する~~（技術的不適用: attempt 2/3で別host方式・logical-owner direct fixture方式ともfixture生成前にhost/harnessが停止した。contractはgreenのrepository static validatorを代替証跡とすることをユーザー承認済み）
  - [x] ~~standalone leafで日付付きdirectoryと`design.md + tasklist.md`だけが作られ、`tasklist_ready`が返る~~（attempt 2/3のblocked証跡とstatic validatorを代替証跡としてユーザー承認済み）
  - [x] ~~standalone compositeで`design.md + roadmap.md`だけが作られ、`roadmap_ready`が返る~~（attempt 2/3のblocked証跡とstatic validatorを代替証跡としてユーザー承認済み）
  - [x] ~~steering経由でtask-design専用子directoryが作られず、steering rootへ成果物が置かれる~~（attempt 2/3のblocked証跡とstatic validatorを代替証跡としてユーザー承認済み）
  - [x] ~~roadmap phaseから子steering・子task-designへ親contextが渡り、nested resultをdispatchできる~~（attempt 2/3のblocked証跡とstatic validatorを代替証跡としてユーザー承認済み）
  - [x] ~~standalone昇格は承認前に移動せず、承認後だけtemp内のcanonical `.steering/`へbundle全体を移す~~（attempt 2/3のblocked証跡とstatic validatorを代替証跡としてユーザー承認済み）
- [x] ~~同じ主要contractをClaude Codeのlocal skill読込smokeで確認する~~（技術的不適用: Claude Codeが未loginでskill読込前に終了。static validatorを代替証跡とすることをユーザー承認済み）
  - [x] ~~leaf/compositeの排他的resultと成果物配置を確認する~~（Claude未loginのblocked証跡とstatic validatorを代替証跡としてユーザー承認済み）
  - [x] ~~roadmap構造fieldとsteering運用fieldのwriter境界を確認する~~（Claude未loginのblocked証跡とstatic validatorを代替証跡としてユーザー承認済み）
- [x] ~~smokeで見つかったinstruction ambiguityをownerのskillとvalidatorへ修正し、全validationを再実行する~~（技術的不適用: 観測されたのはhost/harness停止とClaude未loginだけで、仕様上のambiguityは観測されなかった）

## Phase 6: 旧steeringの意味を新ownerへ再移植する

### DoD

旧steeringの各意味単位が移管・適応・明示廃止へ分類され、変更後skill群が旧運用知識と新しいowner境界を同時に満たす。

### Tasks

- [x] migration ledgerを実装へ反映する
  - [x] steeringへdirectory・summary・discussion・実装後review・plan合意後gateの具体契約を戻す
  - [x] task-designへ設計前調査、UI現状確認、`investigation.md`、`requirements.md`、成果物命名の契約を移す
  - [x] task-designの配置先確定後に設計前調査を行う順序へ補正する
  - [x] task-designとsteeringへ日本語での会話・成果物記述契約を移す
  - [x] steeringの前月summaryへ`# {YYYY}年{MM}月 Steering サマリー` headerを移す
  - [x] `tasklist-design.md`へphase分割の具体例、既知docsの早期配置、実装可能taskだけを置く規則を移す
  - [x] tasklist templateへ厳密な完了・取消・feedback・commit・push条件を戻す
- [x] 移植完了判定を再発防止する
  - [x] migration policyへ意味単位ledgerと未分類削除禁止を追加する
  - [x] validatorへ高riskな移管契約と旧ownerへの逆流防止を追加する
  - [x] validatorへ配置先確定と調査の順序、日本語契約、summary headerのassertionを追加する
- [x] 意味保存validationを実行する
  - [x] `node --check scripts/verification/validate-plugin.mjs`
  - [x] `node scripts/verification/validate-plugin.mjs`
  - [x] `git diff --check`
  - [x] 旧steeringの各意味単位をGit差分から再監査し、移管先または明示廃止理由を確認する

## Phase 7: documentation reviewとユーザー動作確認

### DoD

変更後skillをユーザーが確認し、task-design・steering・tasklist-executorの責務と主要flowが意図どおりであることへ合意している。

### Tasks

- [x] doc-enricherを提案modeで適用する
  - [x] 今回読んだskill directory READMEに、実装後も再利用価値の高い知識が不足しているか確認する
  - [x] ~~提案がある場合だけユーザー承認後に既存READMEへ反映し、新規docs directoryを作らない~~（提案なし: skill間のowner境界は既に目次へ反映済みで、意味保存規約は既存のmigration policyとrepository指示が正本。READMEへ詳細を重複させない）
- [x] 実装結果の要点とvalidation結果をユーザーへ提示する
- [x] ~~ユーザーにtask-design standalone、steering leaf、steering roadmapの契約を確認してもらう~~（移行漏れの指摘により旧実装の確認gateは失効した。source-first再構築後のPhase 10で改めて確認する）
- [x] feedbackを`implementation_review.md`へ記録し、同じworking directoryで設計へ戻す
  - [x] designまたはplan構造を変えるfeedbackとしてD8以降と二層ledgerへ反映する
  - [x] feedbackなしの取消処理は適用しない

## Phase 8: 失敗したmigrationを移行前baselineから再構築する

### DoD

旧steering本体・tasklist template・roadmap template・PR helperの全構造と全contractが二層ledgerへ登録され、合意のない変更は復元対象、本当に新構造と競合する変更だけが個別合意対象になっている。

### Tasks

- [x] 移行前baselineと合意済み変換仕様を確定する
  - [x] Git revisionと旧source四点をbaselineとして固定する
  - [x] D1からD6とdiscussionの確定済みdecisionだけを合意済み変換とする
  - [x] 現在のskill群とD7の粗粒度ledgerを移行完了の証拠から外す
  - [x] 物理rollbackは行わず、Git baselineから論理的に再構築すると決定する
- [x] `function-migration-ledger.md`の二層構造を作る
  - [x] 旧章とtemplate構造を構造ledgerへ連続行範囲で登録する
  - [x] 全contractを前提・action・禁止・例外・fallback・理由・例・失敗例・判断質問・強調の単位で登録する
  - [x] 移管先、分類、合意根拠、現実装監査欄を設ける
- [x] 現実装をledgerからwhite-box監査する
  - [x] 全contractの移管先を具体的な節まで特定する
  - [x] 合意なしで変わった差分を復元対象へ分類する
  - [x] 新構造と本当に競合する差分だけを`TBD`として残す
- [x] `TBD`を上位から一件ずつユーザーと合意する
- [x] 合意済みledgerからskill群を全面再構築する
  - [x] 旧steeringを土台に、caller・summary・discussion・post-plan gate・実装後reviewの全contractをD1-D15へ適応する
  - [x] 移行前task-designを土台に、設計前調査・artifact lifecycle・排他的plan lifecycleをD1-D15へ適応する
  - [x] 旧steeringのtasklist設計章を土台に`tasklist-design.md`を全量再構築する
  - [x] 旧tasklist templateを土台に、合意済みpath・owner・条件変更だけを適応する
  - [x] 旧roadmap templateを土台にD4・D9の構造を加え、D15の明示廃止だけを適用する
  - [x] executor、repository context、README、validatorを新owner contractへ整合させる
  - [x] PR helperが移行前sourceとbyte一致することを再確認する
- [x] Git削除行の逆引きと移管先通読でwhite-box完了gateを満たす
- [x] 旧contractから導いたscenarioでblack-box smokeを実行する

## Phase 9: function migrationの再発防止規範を新設する

### DoD

今回の失敗と修復で確定した原則が`plugins/tumeda-dev/docs/common_standard/function_migration_policy.md`へ一般化され、将来の移植で意味保存ledger、個別合意、white-box検証を省略できない。

### Tasks

- [x] source-first再構築とwhite-box監査の実績から、論点2の判断を確定する
- [x] `plugins/tumeda-dev/docs/common_standard/function_migration_policy.md`を新規作成する
  - [x] function migrationを挙動・意味・細かな再発防止ニュアンスを全量維持するrefactoringとして定義する
  - [x] ユーザー提案または合意がない機能的欠落を、非合理に見える場合も禁止する
  - [x] 章を薄い箇条書きへ縮退させる形式的移行を失敗として明記する
  - [x] black-box smokeは一部の潜在能力しか観測せず、white-box照合の代替にならないことを明記する
  - [x] 不可避な変更は意味単位ごとにユーザーへ問い、明示合意を得るgateを定める
- [x] migration policyから共通規範を参照し、repository固有migration手順との責務を重複させない
- [x] 論点3のdoc-enricher新規document判断は別taskのまま維持し、このPhaseへ混在させない

## Phase 10: 修復後の最終確認

### DoD

移行前contractの全量維持または合意済み変更・廃止が証明され、ユーザーが修復後のskill群を確認している。

### Tasks

- [x] static validation、white-box監査、scenario検証の結果を提示する
- [ ] ユーザーにtask-design standalone、steering leaf、steering roadmap、migration policyを確認してもらう
- [ ] feedbackがあれば`implementation_review.md`へ追記し、必要なownerへ戻す

## 完了後のactions

> ユーザー動作確認が完了するまでcommit、push、PRを促したり実行したりしない。

- [ ] ユーザー確認後、意味単位でcommitする
  - [ ] current branchがdefault branchのままなら、ユーザー確認なしにcommitしない
  - [ ] task-design execution plan assets、steering orchestration、downstream/validatorを分離可能なcommitへ整理する
  - [ ] ユーザーがcommit不要と回答した場合は、理由を記録して取消完了にする
- [ ] GitHub公開を行う場合だけpushしてPRを作成する
  - [ ] non-default branchであることを確認する
  - [ ] `git push -u origin <current-branch>`
  - [ ] `plugins/tumeda-dev/skills/tasklist-executor/scripts/github/create_or_get_pr.sh`を使用する
  - [ ] ユーザーが公開不要と回答した場合は、理由を記録して取消完了にする

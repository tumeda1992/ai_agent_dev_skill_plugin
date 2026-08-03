# Design: tasklist lifecycleをtask-designへ移す

## 目的

`tasklist.md`と`roadmap.md`を単なるsteeringの後工程ではなく、`design.md`を実行可能な単位へ落とす排他的な設計成果物として`task-design`に帰属させる。leafのtasklist作成・reviewでもcompositeのroadmap作成・reviewでも、設計不足が判明した場合にskill境界を跨がず同じ所有者がdesignへ戻れるworkflowを作る。

## 完了条件

- [x] `design.md`と排他的な`tasklist.md | roadmap.md`が同じ`working_dir`へ保存される
- [x] task-designがdesign作成・合意、execution plan作成・自己レビュー・合意、planからdesignへの差し戻しloopを一貫して所有する
- [x] steeringはtasklistとroadmapの構造を直接設計せず、task-design起動、roadmap phaseの子steering binding、status伝播、前後のorchestrationへ責務を絞る
- [x] roadmap構造、roadmap運用field、investigation、plan合意後の振り返り、実装開始、実装後reviewの所有者が一意に決まる
- [x] tasklist-executor、summary生成、skill一覧、validatorが新しい配置と所有者を参照する
- [x] pluginの配布versionが一度だけ、変更全体の互換性に応じた値へ揃う
- [x] 旧steeringの各意味単位が、移管・新構造への適応・明示廃止のいずれかへ分類され、未分類の削除がない

## 決定事項

### D1. designと排他的なexecution planを一つの設計収束loopとしてtask-designが所有する

`design.md`と、そのdesignに対応する排他的な`tasklist.md | roadmap.md`をtask-designの同じ`working_dir`へ置く。leafならtasklist、compositeならroadmapを作り、同じworking directoryで両方を正本として持たない。task-designはdesign作成・合意、execution plan作成・自己レビュー・合意を一貫して所有し、planの具体化で設計変更が必要になった場合は同じskill内でdesignへ戻る。

task-designの完了条件は「design合意、選択されたexecution plan合意、planからdesignへ戻る未解消feedbackなし」とする。planの指摘が実装順序、task粒度、検証手順、roadmapの運用fieldだけを変える場合はplanまたはsteeringの運用stateだけを更新し、完成後の姿、設計根拠、公開API、モジュール境界、要件、roadmapのphase構造を変える場合はdesignまたはtask-designのplan phaseへ戻る。

steeringはrepository contextの準備、task-design起動、roadmap phaseと子steeringのbinding、依存順の再帰実行、status伝播、plan合意後の振り返り、実装開始、実装後reviewを所有する。調査結果でdesignが変わる`investigation.md`はtask-design配下へ移す。実装後reviewからdesignまたはplan構造を変更する場合は、既存working directoryを再利用してtask-designへ戻す。

tasklistとroadmapのtemplate、設計・自己レビュー規則はtask-design配下へ移し、steeringに同じ正本を残さない。今回の変更はHEADの`4.0.0`に対する未配布の破壊的変更一式に含め、配布versionは`5.0.0`を維持する。

### D2. steeringでは自身のdirectoryをtask-designのworking directoryとして直接使う

standalone task-designは`create_working_dir=true`をdefaultとし、`name-work-directory`で新しいdirectoryを作る。steering経由では、steeringが作成済みの自身のdirectoryを`working_dir_parent`として渡し、`create_working_dir=false`でtask-designを起動する。task-design専用の子directoryは作らない。

steering経由の`design.md`、`task-design-discussion.md`、排他的な`tasklist.md | roadmap.md`はsteering directory直下へ置く。steering固有の`discussion.md`と`implementation_review.md`も別basenameで同居する。再開、summary、tasklist-executor、実装後reviewは固定file名を使うため、`steering.json`や別pathの探索を導入しない。

task-designの一般契約はsteeringを要求しない。既存directoryを使うcallerは`create_working_dir=false`、task-design自身にdirectoryを作らせるcallerは`true`を使う。完了時は`tasklist_ready`なら`working_dir`、`design_path`、`tasklist_path`、`roadmap_ready`なら`working_dir`、`design_path`、`roadmap_path`を返す。tasklistとroadmapは同居する`./design.md`を参照する。

### D3. tasklistとroadmapの設計規則をtask-design本体の分割fileとする

tasklist phaseの詳細な作成・自己レビュー・ユーザーレビュー・designへの差し戻し規則は`plugins/tumeda-dev/skills/task-design/tasklist-design.md`、roadmap phaseのphase分割・自己レビュー・ユーザーレビュー・designへの差し戻し規則は`plugins/tumeda-dev/skills/task-design/roadmap-design.md`を正本とする。これらは外部資料を置く`references/`ではなく、長さのために`SKILL.md`から分割したtask-design自身のinstructionである。

`steering/templates/tasklist.md`と`steering/templates/roadmap.md`は、それぞれ`task-design/templates/tasklist.md`と`task-design/templates/roadmap.md`へ移し、設計参照を同居する`./design.md`へ変える。tasklistの既存scopeである実装、test、lint、UI確認、doc-enricher、ユーザー動作確認、条件付きcommit・push・PR、実装後feedbackは維持し、roadmap更新taskとsteeringに固定された表現・pathだけを外す。

task-designの`SKILL.md`にはleaf/composite判定、対応する分割fileの完全読込、排他的result、共通completion gateだけを置く。tasklistとroadmapは異なる形式として別fileに分けるが、いずれも「designに対応するexecution plan」の直和としてtask-designが構造を所有する。

### D4. roadmap構造はtask-design、実行bindingとstatusはsteeringが所有する

task-designはroadmapの全体目的、安定したphase identity、各phaseの目的・scope・scope外・DoD・依存、親designとの対応を設計・reviewする。steeringは合意済みroadmapを受け取り、各phaseの子steering path、未着手・進行中・完了status、完了日だけを更新する。構造変更が必要な場合はsteeringが直接編集せず、同じworking directoryでtask-designを再開する。

roadmap phaseは`親roadmap phase -> 子steering -> 子task-design`の順に対応する。子steeringは親roadmap path、phase identity、親design、依存phaseの確定結果をtask-designへ渡し、子task-designは上位制約を自分のdesignへ記録する。子task-designも排他的にtasklistまたはroadmapを返せるため、roadmap treeは必要に応じて入れ子になる。

再帰を収束させるため、roadmapは二つ以上の子scopeを持ち、各子scopeが親より厳密に狭く、全子の完了で親DoDを満たし、依存関係がcycleを持たないことを自己レビューgateにする。一つだけの子、親と同一scopeの子、phase数が多いだけのroadmapを禁止する。leaf完了はtasklist-executor、composite完了は全子完了を確認したsteeringが一段ずつ上位へ伝播する。

### D5. standalone roadmapは明示承認後にbundle単位でsteeringへ昇格する

steeringに任意入力`adopt_task_design_working_dir=<absolute path>`を設ける。対象は同じrepository内にある、合意済み`design.md`、`task-design-discussion.md`、排他的な`roadmap.md`を持つ自己完結bundleに限定する。source basenameの`YYYYMMDD-slug`を維持し、`.steering/YYYY/YYYYMM/<basename>/`をcanonical destinationとする。

steeringはsourceとdestination、必須file、destination不存在、Git状態、bundle内部の相対参照をread-onlyで検証し、path変更を示してユーザーの明示承認を得た後だけdirectory全体を移動する。copy、merge、overwrite、suffix追加、repository外sourceの自動copy/deleteは行わない。承認されなければstandalone bundleを変更しない。

移動後は新しいdirectoryだけをsteering directoryかつtask-design working directoryとして扱い、新しい`working_dir`、`design_path`、`roadmap_path`を返す。`steering.json`や旧sourceへのpointerを作らない。steeringはroadmapの未割当phaseへ子steeringをbindingし、構造変更が必要なら同directoryでtask-designを`create_working_dir=false`として再開する。

### D6. consumerと検証を新しいexecution plan契約へ揃える

- `task-design/SKILL.md`: 成果物と完了条件を`design + (tasklist | roadmap)`へ変更し、leaf/composite判定、`tasklist-design.md | roadmap-design.md`の完全読込、plan review、designへの差し戻し、排他的resultを規定する。軽量modeもdiscussion駆動のdesign合意後にexecution planを後置し、plan合意までをtask-design完了条件にする。
- `task-design/tasklist-design.md`と`task-design/roadmap-design.md`: 現在steeringにある詳細規則を移動後のownerに合わせて再構成する。roadmap側は構造fieldと運用field、再帰収束gateを明示する。
- `task-design/templates/tasklist.md`と`task-design/templates/roadmap.md`: steering配下から移動する。tasklistから親roadmap更新taskを外し、feedback routingを特定callerに固定しない。roadmapは構造fieldと、steeringだけが更新する子path・status・完了日を区別する。
- `steering/SKILL.md`: 新規steeringでは自身のdirectoryを`create_working_dir=false`でtask-designへ渡し、`tasklist_ready | roadmap_ready`をdispatchする。tasklist・roadmapの内容設計と重複reviewを削除し、roadmap binding・再帰実行・status伝播、standalone bundle昇格、plan合意後の処理だけを残す。
- summary生成: 新形式ではrootの`design.md`と排他的planを読む。tasklistはcheckbox、roadmapは全phaseの運用statusから`完了 / 未完了 / 不明`を導出する。旧形式はroot planと一意な子designの既存fallbackをread compatibilityとして維持するが、新規成果物を旧配置へ書かない。
- `tasklist-executor/SKILL.md`: 明示されたtasklistと同directoryの`./design.md`を正本として実行し、roadmapを作成・更新しないことを明記する。tasklist内の親roadmap更新taskも実行しない。GitHub PR helperは実行ownerに合わせて`tasklist-executor/scripts/github/create_or_get_pr.sh`へ移す。
- `maintenance-plugin-context`: task-designがtasklistを設計できるよう、consumer=`task-design`へ全体test/lint command、UI確認環境、Git/GitHub公開条件を必要時に返せる契約へ広げる。steering固有欄からtasklist固有制約を外す。
- `skills/README.md`: task-designをexecution plan設計owner、steeringをplan dispatchとroadmap orchestration、tasklist-executorをtask-design生成tasklistの実行ownerとして説明する。
- `scripts/verification/validate-plugin.mjs`: 新しい二つの分割fileとtemplate、移動後helperを必須化し、steering配下の旧template/helperを不存在条件にする。task-designの排他的result、steeringの`create_working_dir=false`、roadmap field ownership、summary分岐、tasklist-executorのroadmap非更新を検証する。portable file一覧とdiscussion consumerのtemplate pathも更新する。
- 配布version: manifestとmarketplaceの`5.0.0`を維持し、追加のmajor bumpは行わない。

### D7. owner変更は行数削減ではなく意味保存migrationとして完了判定する

旧steeringの記述は、移動後のownerを短く説明できるかではなく、変更後の`steering + task-design + tasklist-executor`が同じ判断と失敗防止を再現できるかで評価する。各意味単位を次のいずれかへ分類し、移管先のない削除を禁止する。

- **移管**: ownerだけが変わり、判断条件・必須順序・失敗例・停止条件を維持する。
- **適応**: 新しいdirectory構造やfield ownershipへ依存先を読み替えるが、元の目的と安全性を維持する。
- **明示廃止**: 新構造と矛盾する契約だけを、代替契約と廃止理由を示して削除する。

今回のmigration ledgerは次とする。

| 旧steeringの意味単位 | 変更後owner | 分類 |
| --- | --- | --- |
| steering directory、安定basename、前月summary | steering | 移管 |
| repository context取得後の読み取り調査、類似実装調査、UI現状確認 | task-design | 移管 |
| `investigation.md`と`requirements.md`の作成判断・lifecycle | task-design | 移管 |
| tasklistのphase分割、DoD、test、UI、既知docsの早期配置、自己review | task-designの`tasklist-design.md` | 移管 |
| task完了、取消、checkbox、user confirmation、commit・push条件 | tasklist templateとtasklist-executor | 移管 |
| plan合意後gate、steering固有discussion、実装後review routing | steering | 移管 |
| task-design専用子directoryと`task_design_dir`探索 | steering rootを直接使う契約 | 明示廃止 |
| tasklistから親roadmapを更新する契約 | steeringだけが運用fieldを更新する契約 | 適応 |
| steeringがtasklist・roadmapを設計・再reviewする契約 | task-designの排他的plan設計・review | 適応 |

具体的には次を復元・適応する。

- task-designは初稿前にrepository contextを解決し、許可された文書と類似実装から命名、例外、test、責務境界を調査する。GraphQL mutationやCommandでは関連READMEを先に読み、UI変更では`visual-inspector`による現状の実測を設計根拠にする。
- 調査結果で方針が変わり得る場合だけ`investigation.md`を作り、調査目的・確認方法を合意してから事実と結果を記録する。Requirementsが長く、独立させるとreview可能性が上がる場合だけ`requirements.md`へ切り出す。
- tasklistには実装可能なtaskだけを置き、将来候補や未決事項を入れない。取消完了は実装方針・architecture・依存の変更により元taskが不要または置換された場合に限定し、単なる環境停止や時間不足を取消理由にしない。ユーザーがplan自体の変更としてtaskを除外した場合は、その合意と理由を記録する。
- 実装後feedbackは原文、関連する実装・design・plan、原因、採用方針、決定をdiscussionへ渡す。すでに修正済みでも記録を省略せず、design、plan、roadmap運用、docsのどこへ戻すかをsteeringが判断し、自動実装再開はしない。
- migration policyへ意味単位ledgerを必須化し、validatorで高riskな移管契約の存在と旧ownerへの逆流がないことを検証する。

### D8. 移行前sourceと合意済み変換だけから二層ledgerを再構築する

現在の変更後skill群とD7の粗粒度ledgerを、移行完了の前提または意味保存の証拠として扱わない。Git revision `d67763fede920b0a9c61028ff93b7dbf3b5fc460`の旧steering本体、tasklist template、roadmap template、PR helperをbaselineとし、D1からD6とdiscussionの確定済みdecisionだけを変換仕様とする。

`function-migration-ledger.md`に、旧章の目的・発動場面・内部順序・規則間関係を追跡する構造ledgerと、各contractの前提・action・禁止・例外・fallback・理由・具体例・失敗例・判断質問・強調を追跡するcontract ledgerを置く。`KEEP | MOVE | CHANGE | RETIRE`のいずれかへ分類し、合意前の競合だけを一時的に`TBD`とする。`既存記述に含まれる`、`趣旨は同じ`、`一般化した`を移植完了理由にしない。

skill本体の再修正前にledgerを完成させ、合意のない差分は旧contractへ戻す。新構造と本当に競合する差分だけを一件ずつユーザーと合意する。white-box監査が完了した後にだけvalidatorとblack-box smokeを補助検証として実行する。

### D9. tasklistとroadmapのTBDは作成途中だけ許し、ready resultでは構造TBDを残さない

tasklistとroadmapの作成途中では、解消対象を可視化するためにTBDを使える。ただし`tasklist_ready | roadmap_ready`を返す前に、planの構造field、task、DoD、依存に残るTBDをすべて解消する。

前phaseの確定結果によって後続phaseの詳細が決まる場合、親roadmapの構造TBDとして残さない。後続phaseの目的、scope、scope外、DoD、依存は親roadmapで確定し、子task-designへ渡す`dependency_results`と、その結果を使って子designで解消する制約を明記する。子steering pathの未割当、statusの未着手、完了日の未完了は設計TBDではなくruntime stateなので、`roadmap_ready`で許可する。

### D10. feedback件数による新steeringの自動起動規則を廃止する

実装後feedbackが複数件揃ったことだけを理由に、新しいsteeringを自動起動しない。feedback件数はscopeの独立性や設計loopの分割要否を示さず、件数をtriggerにすると同一featureのsteeringが過剰に増えるため、この旧規則を明示的な破壊的挙動変更として廃止する。

同一featureに属する追加taskは、designとexecution planを再合意したうえで既存tasklistへ追記する。tasklistはfeatureが完成するまで継続して使用する。別steeringまたは子steeringが必要かどうかは、task-designのleaf / composite判定による意味的なscope分割、またはユーザーの明示判断で決め、feedback件数では決めない。

旧規則が存在した事実は、将来の再検討材料としてsteeringに非規範的なlegacy memoを残す。memoには、過去に「複数のfeedbackが揃ったら新しいsteeringを起動する」方針があったことと、必要なら将来の明示合意で復活を検討できることだけを書く。現在の起動条件、推奨動作、暗黙のfallbackとして解釈できる表現にはしない。

### D11. 議論履歴と確定設計の保存先を分離する

`task-design-discussion.md`を、論点、比較した選択肢、議論の変遷、feedback、decisionへ至る過程の正本とする。`design.md`を、合意済みの完成後の姿、制約、選択した設計と、将来の設計理解に必要な「代替案と棄却理由」の正本とする。

旧steeringが`design.md`内に要求していた`事前設計議論メモ（揮発防止）`の章は、そのまま二重保存しない。議論過程の揮発防止という目的は`task-design-discussion.md`で維持し、実装者がdesignだけを読んでも選択理由を理解できるという目的は、結論を支える必要十分な棄却理由を`design.md`へ残すことで維持する。

`design.md`へは生の議論log、iterationごとの旧案、未決の提案を複製しない。反対に、最終設計の理解や将来の変更判断に必要な理由をdiscussionへのlinkだけで済ませない。詳細な経緯を確認する場合にだけ、同じworking directoryの`./task-design-discussion.md`を参照する。

### D12. doc-enricherの即時起動を維持し、書込みだけを承認gateへ適応する

コードを読んで初めて判明した永続性とレバレッジの高い知識は、contextが熱いうちに`doc-enricher`へ即座に渡す。taskやtasklistの末尾へ先送りせず、その場で既存documentの確認、候補の抽象化、自己review、提案まで行うという旧contractの即時性を維持する。

旧steeringの「即座にREADMEへ反映する」という無条件書込みは廃止し、`doc-enricher`自身のwriter契約に合わせる。`doc-enricher`は最初に変更を伴わない提案を返し、ユーザーが承認した内容だけをその場で適用する。承認されなければREADMEまたはdocsを変更せず、承認・拒否が確定した後に元のtask-designまたはsteeringへ戻る。

この変更は呼出時期を遅らせるものではなく、callerがcalleeの承認gateを迂回しないための権限調整である。提案対象を既存README・既存docsから新規documentへ広げるか、その配置をどう判断するかはimplementation reviewの論点3に留保し、D12では変更しない。

### D13. 実装後feedbackの正本をimplementation_review.mdへ統一する

実装、review、validation、ユーザー動作確認のいずれから生じたfeedback・実装とのずれも、tasklistと同じworking directoryの`implementation_review.md`へ記録する。発生源によって`discussion.md`と`implementation_review.md`へ分けず、実装後に判明し、実装・design・execution plan・roadmap運用・docsのいずれかへ戻す判断が必要な記録というlifecycleで保存先を決める。

feedbackを直接受け取ったworkflow ownerが`facilitate-discussion`を`discussion_directory=<working_dir>`、`discussion_file_name=implementation_review.md`で適用する。workflow ownerはsteeringに固定せず、standalone tasklistの実行でも同じ契約を使う。decisionはcallerへ返し、designまたはplan構造が変わる場合は同じworking directoryでtask-designを再開する。review後に実装を自動再開しない。

旧templateの実装後振り返りにあった三つの再発防止質問は削除せず、`implementation_review.md`の各feedbackへ適用する。根本原因となる未共有知識、codeから判別可能か設計意図かprocess不足か、次回の議論を不要にする保存先を順に判断し、合意後だけ反映する。

`discussion.md`はsteering固有の認識合わせ、orchestration上の推論、design・investigation・plan・implementation reviewのいずれにも属さない背景だけを扱う。tasklistやtasklist-executorの必須成果物にはせず、同じfeedbackの正本を複製しない。

### D14. local commitとGitHub公開actionを別のcontextで設計する

local commitをtasklistへ含める条件と、push・PRを含める条件を分離する。task-designはrepository contextからlocal Git運用条件とGitHub公開条件を別々に取得し、plan合意時点で適用できるactionだけをtasklistへ確定する。どちらのcontextも返されず、ユーザーの明示指示もない場合は、固定repository運用を推測してcommit・push・PRを追加しない。

local Git運用条件が返された場合、またはユーザーが明示的にcommitを要求した場合だけ、phase単位かつ意味単位のcommit taskを含める。部分承認なら承認範囲だけをcommitし、不要と回答された場合は理由を記録して取消完了にするという旧templateのcontractを維持する。GitHub contextの有無をlocal commitの可否へ流用しない。

pushとPRは、GitHub公開条件が返され、tasklistに実行可能なcommit taskが一件以上あり、current branchが公開可能なnon-default branchである場合だけtasklistへ含める。これはplan生成時の条件である。実行時には、commit taskの結果としてlocal commitが実際に一件以上存在することを別gateで確認し、一件もなければpush・PRを実行しない。

task-design時点でGitHub公開条件、実行可能なcommit task、公開可能なnon-default branchのいずれかを満たさないactionは、「場合のみ」の未確定taskとして残さず該当sectionを生成しない。実行時に前提が変わった場合はplan変更としてworkflow ownerへ返す。plan時点の「commit taskがある」とruntimeの「commitが作成済み」を混同しない。

ユーザー動作確認が完了する前にcommit・push・PRを実行または催促しないgate、意味の異なる変更を一つのcommitへまとめない規則、既存PR再利用を含むhelper contractは変更しない。

### D15. roadmapの全phase完了日と計画・実績差分を明示廃止する

旧roadmap templateの`全フェーズ完了日`と`計画と実績の差分`は、明示的な破壊的挙動変更として廃止する。旧steering本体にはこれらのfieldをいつ、誰が、どの基準で更新するかを定める運用規則がなく、全体完了は各phaseのstatusと完了日から導出できるため、独立fieldを維持する実効的な意味がない。

計画からの意味ある逸脱は、D13に従って同じworking directoryの`implementation_review.md`へ記録する。roadmapはtask-designによる再設計と再合意で構造自体が更新され得るため、再承認後も比較可能な「当初計画」のbaselineを定義せずに差分欄だけを残すと、何との比較かが曖昧になる。したがって、振り返りfieldのownerを新設せず、roadmap templateとsteeringの運用fieldから削除する。

この廃止はroadmap全体の完了判定や逸脱記録を失わせるものではない。全体完了は全phaseのstatusと完了日で判定し、実装後に判明した設計・plan・運用上のずれは`implementation_review.md`のfeedback lifecycleで扱う。

### D16. function migrationの意味保存を共通規範として独立させる

`plugins/tumeda-dev/docs/common_standard/function_migration_policy.md`を、code、skill、workflow、template、documentに共通するfunction migrationの正本とする。移行前baselineを固定し、旧章と関係を追う構造ledger、判断・順序・禁止・例外・理由・例・失敗例・問い・強調を追うcontract ledgerを編集前に作る。合意済み変更以外は、非合理または冗長に見えても全量維持する。

変更または廃止が必要な意味単位は、旧挙動、競合理由、選択肢、推奨案と弱点、代替contractを示してユーザーの明示合意を得る。途中の失敗移行を表層補修せず、移行前sourceから再構築し、Git削除行の逆引きと全owner合算のwhite-box監査を完了してから旧contract由来のblack-box scenarioを行う。smoke、validator、行数、見出しの存在は意味保存の代替証拠にしない。

`maintenance-plugin-context/maintenance_policies/migration.md`は共通規範を参照し、公開plugin固有の機密性、汎用化、移植方向、移植元依存だけを追加する。doc-enricherが新規documentを提案する一般判断はimplementation reviewの論点3として分離し、D16へ混在させない。

# 議論記録

## 論点31: 保留の確かめ直しと知らせの変更集合

**ステータス:** 決定

**親論点:** 論点16

**種別:** TBDヒアリング

**重さ:** まとめて考える（確かめる手間: 中 — 四つのfileの差分を読む。他は小）

### イテレーション0（論点31）: 変更集合を示す

#### 提案0（論点31）

保留の確かめ直しの時点（論点14）と、利用者へ伝える時点（論点15）を、次の四つのfileの一つの変更集合として変える。確かめ直す時点の規則（`pending-escalations.md`）と、それを依頼する三つのskillの箇所は、片方だけを変えると、依頼する側が規則に無い時点で依頼し続けるため、一緒に変える。

`plugins/tumeda-dev/skills/escalate-plugin-skill-fix/pending-escalations.md`（全文: [`drafts/pending-escalations.md`](../drafts/pending-escalations.md)）:

````diff
@@ -53,7 +53,10 @@
 元の作業は提案が生じた時に進めていた作業であり、roadmapの子steeringの中で生じたら、roadmap全体ではなくその子steeringとする。
 新しい監視fileや完了flagを増やさず、元担当の既存記録から条件と根拠を辿れるようにする。
 
-元担当は、同じ作業の再開時、および保留条件に対応するphase完了・状態遷移を記録した時に、次の通常処理へ進む前にこの処理を依頼する。
+元担当は、メモの再開条件が成り立ちうる状態遷移を記録した時だけ、次の通常処理へ進む前にこの処理を依頼する。
+既定の保留（元の作業の完了）は元の作業の完了時、利用者が指定した条件はその状態遷移（例: 設計完了ならdesign phaseの完了）である。
+taskやphaseの完了、executorの停止、作業の再開のたびには依頼しない。
+条件が成り立ちえない時点の確かめ直しは、結果が必ず保留中になり、詰まりを解いている最中の利用者とassistantの作業へ割り込むだけで得るものが無いためである。
 引継ぎでメモのpathを失っていた場合も、元作業のpending-escalations内だけを列挙する。別作業を探索しない。
 該当directoryがない場合は作成せず通常処理へ戻る。列挙・読取不能を「保留なし」にしない。
 
@@ -67,6 +70,10 @@
 返却を受けた元担当は、引渡しや確認待ちで元作業を継続できるかを元の指示の範囲で判断し、元作業の担当と戻り先を維持する。
 再確認自体を追加承認や元作業完了の新gateにせず、background監視・別session起動・各返信でのpollingも行わない。
 
+保留について利用者へ伝えるのは、保存した時の一行（上の「保留を保存する」）、確かめ直して条件が成り立ち引き渡しに入る時、利用者の判断が要る時（範囲・期間が分からない時の確認、即時を勧める一問、条件が成り立ったかを確かめられない時）だけにする。
+確かめ直して状態が変わらない時は、利用者へ何も伝えない。
+作業中の利用者の思考を、状態の変わらない知らせで中断させないためである。
+
 ## 再開条件を確認する
 
 同じメモの固定本文・関連情報・追跡と、現在の元作業・実際の発話を併読する。
````

`plugins/tumeda-dev/skills/tasklist-executor/SKILL.md`（全文: [`drafts/tasklist-executor-SKILL.md`](../drafts/tasklist-executor-SKILL.md)）:

````diff
@@ -81,7 +81,6 @@
 - tasklistが止まるtaskを置いたPhase境界では、完了済みtaskを保存したうえで`phase_checkpoint`を返せる。止まるtaskの無いPhase境界では止まらず、次のPhaseへ進む
 - ユーザー動作確認がtasklistにある時は`user_confirmation_required`で停止し、確認前にcommit・pushへ進まない（確認環境へ載せるために`UI確認環境`が定めるcommit・pushと、作業の外へ残るactionを含むphaseの最後のcommit・pushを除く）
 - 利用上限に達した時は、完了済みtask、pending request/result、次の`[ ]`を`limit_reached`として返す
-- 同じ元作業の再開時と、task／phaseの既存完了条件を実測して次へ進む時は、元作業の場所と現在の状態・証拠を`escalate-plugin-skill-fix`へ渡し、[保留条件を再確認する](../escalate-plugin-skill-fix/pending-escalations.md#元担当の状態遷移から再確認する)。未実測の完了を通知せず、各返信のpollingにも変えない。
 - 再開時は最初の`[ ]`と既存artifactを再評価する
   - result済みならchildを再起動せず結果を消費する
   - request済み・resultなしなら同じrequest IDをpendingとして返し、二重起動しない
````

`plugins/tumeda-dev/skills/steering/SKILL.md`（全文: [`drafts/steering-SKILL.md`](../drafts/steering-SKILL.md)）:

````diff
@@ -223,10 +223,9 @@
 
 resultとfileが矛盾する、両planが併存する、planからdesignへ戻るfeedbackが未解消、またはplanlessのzero stateを満たさない場合は、同じworking directoryでtask-designを再開する。
 
-上のidentityと正本の対応を照合できた後、次のphaseへ進む前に、元作業の場所と確認済みの状態・実証拠を
-`escalate-plugin-skill-fix`へ渡して[保留条件を再確認する](../escalate-plugin-skill-fix/pending-escalations.md#元担当の状態遷移から再確認する)。
-同じ作業の再開時も、既存の記録とphase状態を照合してから依頼し、返却resultだけで成立を通知しない。
-元作業全体を完了する時にも同じ処理へ完了記録を渡す。暫定指示の管理への通知や追加承認とは区別する。
+保留したplugin改善のメモは、再開条件が成り立ちうる状態遷移の時だけ確かめ直す（[保留条件の再確認](../escalate-plugin-skill-fix/pending-escalations.md#元担当の状態遷移から再確認する)）。
+steeringが依頼するのは、元作業全体を完了する時だけであり、元作業の場所と完了記録・実証拠を`escalate-plugin-skill-fix`へ渡す。
+ready resultの照合後、作業の再開時、executorの停止時には依頼しない。返却resultだけで成立を通知しない。暫定指示の管理への通知や追加承認とは区別する。
 
 task-designからready resultが返った直後に実装、子steering起動、またはplanless完了へ進まない。次のStep 4を必ず先に完了する。
 
@@ -311,9 +310,6 @@
 - `artifact_directory`にrequest / result artifactがあれば読む。
 - 読んだ内容が`design.md`と食い違う場合、実装を進める前に`実装完了後review`へ回す。
 
-上の正本とartifactの照合を終えてから、[保留条件の再確認](../escalate-plugin-skill-fix/pending-escalations.md#元担当の状態遷移から再確認する)へ、
-元作業の場所と確認済みの状態・実証拠を渡す。不一致や未確認の完了を成立証拠にせず、該当するreview・追加確認へ戻す。
-
 根拠は`tasklist-executor/execution-contracts.md`の`状態の正本とsingle writer`にある。taskの完了状態の正本はtasklistの`[ ]` / `[x]`、child処理の状態の正本はrequest / result artifactと定められ、返却resultはこの列挙に含まれない。
 
 #### 6-2. roadmap runtime orchestrationを行う
@@ -325,7 +321,7 @@
 3. 子steeringへ親roadmap path、phase identity、親design path、dependency resultsを渡す。
 4. 子steeringも自身のrootを`create_working_dir=false`で子task-designへ渡す。子task-designは`tasklist_ready`、nestedな`roadmap_ready`、または`planless_complete`を返せる。
 5. leafはtasklist-executorの完了result、compositeは全子phaseの完了、planlessは子steeringの共通gateと完了報告を確認する。
-6. 対応phaseのstatusと完了日だけを更新し、その成立証拠で同じ作業の保留条件を再確認してから、次の依存可能phaseへ進む。
+6. 対応phaseのstatusと完了日だけを更新し、次の依存可能phaseへ進む。子steeringで生じた保留メモは、その子steeringが自身の完了時に確かめ直す。
 7. 全phase完了は、全phaseのstatusが`完了`で、各phaseに完了日があることを確認して判定し、composite完了を一段上の親roadmapへ伝播する。
 
 steeringが更新できるroadmap fieldは、子steering path、status、完了日だけである。目的、scope、scope外、DoD、依存、phase identityを変える必要がある場合は直接編集せず、同じdirectoryでtask-designを`create_working_dir=false`として再開する。
````

`plugins/tumeda-dev/skills/task-design/SKILL.md`の確かめ直しの箇所（論点30の差分を当てた後への差分。全文: [`drafts/task-design-SKILL.md`](../drafts/task-design-SKILL.md)）:

````diff
@@ -38,8 +38,6 @@
 元作業directoryが未確定なら、取得不能をnoneにせず管理担当へ不足を返す。
 既存ownerによる命名・directory確定に必要な処理は続け、影響する暫定動作だけを待ちにする。
 元作業が確定した直後に取得し、先に対象の暫定動作を実行しない。
-同じ元作業を再開する時は、独立再構成を含む既存handoff gateで正本の本文読取が許可されてから、[保留条件の再確認](../escalate-plugin-skill-fix/pending-escalations.md#元担当の状態遷移から再確認する)もescalate-plugin-skill-fixへ依頼する。
-元作業の場所と把握済みの状態・証拠を渡し、再開したことだけで条件成立を補完しない。
 
 ## 1. スキルの目的
 
@@ -693,8 +691,9 @@
 
 designの要点をchatで短く示し、自然言語でreviewを依頼する。`OK`、`はい`、`進めて`等の自然な合意を受け取ればStep 5へ進み、修正ならdesignを更新して再reviewする。特定の承認keywordを強制しない。
 
-design phaseの既存完了条件と実際の合意が揃った時は、Step 5へ進む前に、元作業の場所・設計完了の記録を添えて
+design phaseの既存完了条件と実際の合意が揃った時は、元作業の`pending-escalations/`に、利用者が設計完了を再開条件に指定したメモがある時だけ、Step 5へ進む前に、元作業の場所・設計完了の記録を添えて
 `escalate-plugin-skill-fix`へ[同じ作業の保留条件の再確認](../escalate-plugin-skill-fix/pending-escalations.md#元担当の状態遷移から再確認する)を依頼する。
+既定の保留（元の作業の完了）のメモは、design phaseの完了では確かめ直さない。
 design phaseだけの完了を、元作業全体の完了や暫定指示終了として通知しない。
 
 D11により、生の議論log、iterationごとの旧案、未決提案を`design.md`へ複製する旧`事前設計議論メモ`章は作らない。議論の変遷は`task-design-discussion.md`を正本とする。ただし、未来の実装者がdesignだけから「なぜこの設計を選んだか」を遡れるよう、最終設計の理解に必要な代替案と棄却理由は`design.md`へ残す。discussionへのlinkだけで決定理由を省略しない。
````

`tasklist-executor/SKILL.md`「元作業の完了を暫定指示の管理へ通知する」の、完了ownerとして完了時に確かめ直しを依頼する文は、元の作業の完了時に当たるため残す。

判断してほしいこと（このまとまりの中で）: この変更集合でよいか。

#### 検討記録（論点31・イテレーション0）

論点14の検討記録で挙げた依頼箇所を、決定の時点（再開条件が成り立ちうる時点だけ）に当てた。

- `tasklist-executor`: 再開時とtask・phaseの完了時の依頼を外した。完了ownerとしての完了時の依頼は残した。
- `steering`: Step 3（ready resultの照合後、再開時）、6-1（executorの停止のたび）、6-2の手順6（phaseの完了ごと）の依頼を外し、元作業全体の完了時だけにした。roadmapの子steeringで生じたメモは、その子steeringが自身の完了時に確かめ直す。
- `task-design`: 再開時の依頼を外した。design phaseの完了時の依頼は、利用者が設計完了を再開条件に指定したメモがある時だけにした。
- `pending-escalations.md`: 依頼される時点を決定どおりに改め、利用者へ伝える時点（論点15）を足した。`scripts/verification/validate-plugin.mjs`が固定している節の名前（「保留を保存する」「再開条件を確認する」等）は変えていない。

#### 提案0へのフィードバック（論点31）

**結果:** 合意。「ok」は全部の推す案への合意である。

論点29・30・31を、まとめて考える論点としてまとめて示した往復への返事である。

> ok

### 決定（論点31）

`escalate-plugin-skill-fix/pending-escalations.md`、`tasklist-executor/SKILL.md`、`steering/SKILL.md`、`task-design/SKILL.md`の確かめ直しの箇所を、提案0の変更集合で変える。変更後の全文は`drafts/`の各fileである。

## 論点32: 検査scriptのassertionとversionの差分

**ステータス:** 決定

**親論点:** 論点16

**種別:** TBDヒアリング

**重さ:** 確かめるだけ（四観点とも小。根拠: root `README.md`「変更時の検証と前提」、論点23の決定）

**依存先:** 論点26〜31（各fileの文面が決まれば、検査する文を選べる）

### イテレーション0（論点32）: 検査とversionの差分を仮決めで示す

#### 提案0（論点32）

- **a. 次の差分で、検査scriptとversionを変える**（仮決め）
- **b. 検査scriptは固定した文の追随だけにし、新しい契約の検査を足さない**

根拠: root `README.md`「変更時の検証と前提」の「skillまたはdocsを追加・変更したら、対応するassertionをこのfileへ追加する」「既存assertionがピン留めしている文字列を変更したら、そのassertionも追随させる」、論点23の決定（9.1.6）。bは、この規則に反するため採らない。

`scripts/verification/validate-plugin.mjs`（変更後の全文: [`drafts/validate-plugin.mjs`](../drafts/validate-plugin.mjs)）:

````diff
@@ -95,7 +95,7 @@ const codexManifest = readJson(codexManifestPath);
 const claudeManifest = readJson(claudeManifestPath);
 const marketplace = readJson(".claude-plugin/marketplace.json");
 const codexMarketplace = readJson(".agents/plugins/marketplace.json");
-const expectedRelease = "9.1.5";
+const expectedRelease = "9.1.6";
 const claudePlugin = marketplace?.plugins?.find(
   (plugin) => plugin.name === "tumeda-dev",
 );
@@ -339,7 +339,7 @@ requireSavedForms(discussionInternalTemplate, ["論点の骨子","回の骨子",
 
 for (const expected of [
   "## 論点N: {判断内容を表すタイトル}",
-  "**ステータス:** {調査中 / 応答待ち / 子論点待ち / 決定 / 保留 / 分解済み / 反映待ち / 反映済み}",
+  "**ステータス:** {調査中 / 応答待ち / 依存先待ち / 子論点待ち / 決定 / 保留 / 分解済み}",
   "**親論点:** 論点M",
   "**種別:**",
   "### イテレーションI（論点N）:",
@@ -399,7 +399,7 @@ for (const expected of ["discussion fileを検討経緯・判断context・応答
 for (const expected of ["起きた順序と理由が分かる本文", "成立しなかった案とその理由", "内部logへのlinkで説明を代替しない"]) requireText(discussionIteration, expected);
 requireText(skillPath("facilitate-discussion/read-discussion.md"), "内部logを根拠として使わない場合は`--log`を省略する");
 forbidText(discussionTemplate, "{内部log相対path}#iteration-I", "Git管理外logへの必須link");
-for (const p of [discussionSkill, discussionIteration, discussionRecovery, skillPath("facilitate-discussion/split-discussion.md"), skillPath("facilitate-discussion/derived-change.md"), skillPath("facilitate-discussion/templates/consideration-records/README.md"), skillPath("facilitate-discussion/templates/consideration-records/alignment.md"), skillPath("task-design/SKILL.md")]) {
+for (const p of [discussionSkill, discussionIteration, discussionRecovery, skillPath("facilitate-discussion/split-discussion.md"), skillPath("facilitate-discussion/round-trip.md"), skillPath("facilitate-discussion/templates/consideration-records/README.md"), skillPath("facilitate-discussion/templates/consideration-records/alignment.md"), skillPath("task-design/SKILL.md")]) {
   for (const forbidden of ["必要な場合だけ準備する", "長い調査の作業控え", "必要な場合だけ作業控えとして使う", "必要な場合だけ内部logにも記録する", "内部logへ論点・開始context・同じ回の骨子を準備する"]) forbidText(p, forbidden, "内部logの共通作成工程");
 }
 requireText(discussionInternalTemplate, "新規logの作成templateとしては使わない");
@@ -1236,22 +1236,51 @@ for (const expected of [
 const discussionResolve = skillPath("facilitate-discussion/resolve-discussion.md");
 const discussionRead = skillPath("facilitate-discussion/read-discussion.md");
 const discussionSplit = skillPath("facilitate-discussion/split-discussion.md");
-const derivedChanges = skillPath("facilitate-discussion/derived-change.md");
+const discussionRoundTrip = skillPath("facilitate-discussion/round-trip.md");
 const pendingEscalations = skillPath("escalate-plugin-skill-fix/pending-escalations.md");
 const pendingTemplate = skillPath("escalate-plugin-skill-fix/templates/pending-escalation.md");
 const temporaryOverrides = skillPath("maintenance-plugin-context/temporary-overrides.md");
 const overrideTemplate = skillPath("maintenance-plugin-context/templates/temporary-override.md");
 const discussionHelper = skillPath("facilitate-discussion/scripts/inspect-discussion.mjs");
 const discussionHelperTest = skillPath("facilitate-discussion/scripts/inspect-discussion.test.mjs");
-const newFunctionalFiles = [discussionResolve, discussionRead, discussionSplit, derivedChanges, pendingEscalations, pendingTemplate, temporaryOverrides, overrideTemplate, discussionHelper, discussionHelperTest];
+const newFunctionalFiles = [discussionResolve, discussionRead, discussionSplit, discussionRoundTrip, pendingEscalations, pendingTemplate, temporaryOverrides, overrideTemplate, discussionHelper, discussionHelperTest];
 for (const path of newFunctionalFiles) requireExists(path);
 requireText(discussionResolve, "# 議論記録");
 requireText(discussionResolve, "### 解決の完了gate");
 requireText(discussionRead, "末尾提示・原文応答・現在state・親子と根拠を判断する");
-for (const name of ["resolve-discussion.md", "read-discussion.md", "split-discussion.md", "derived-change.md"]) requireText(discussionSkill, name);
+for (const name of ["resolve-discussion.md", "read-discussion.md", "split-discussion.md", "round-trip.md"]) requireText(discussionSkill, name);
 for (const expected of ["next_offset", "needs_full_read", "snapshot", "compare", "全chunk", "独立構成前"]) requireText(discussionRead, expected);
 for (const expected of ["10件を超えた", "最大番号+1", "check-candidate", "原文fileを削除", "自動修復"]) requireText(discussionSplit, expected);
-for (const expected of ["明示委託", "次の実応答", "変更内容", "現在の変更", "原文", "部分反映"]) requireText(derivedChanges, expected);
+// 論点の重さで一往復を組み、既決・委託から導ける変更も仮決めとして問う。導出を報告で扱うfileは無くした。
+requireAbsent(skillPath("facilitate-discussion/derived-change.md"));
+for (const p of [discussionSkill, discussionIteration]) forbidText(p, "derived-change.md", "無くした導出変更fileへの参照");
+for (const expected of [
+  "一つずつ考える",
+  "まとめて考える",
+  "確かめるだけ",
+  "3つまで。確かめるだけを混ぜても合わせて3つまで",
+  "応答を受けて回を重ねた論点は、段によらず一往復に1つで示す",
+  "利用者の前提への依存を小にするのは、根拠を名指せる時だけにする",
+  "前例から答えが一つに決まっても、問わずに決めない",
+  "該当する案の行の末尾に「（仮決め）」「（推奨）」と付ける",
+  "「ok」は「全部ok」の別名",
+  "返事は、名指された論点だけを、その答えとして扱う",
+  "採らなかった案と理由は、論点ごとに議論記録の提案と検討記録へ残す",
+]) requireText(discussionRoundTrip, expected);
+for (const expected of ["論点は、わかった時点で立てる", "依存先待ち", "利用者が明示委託した範囲の選択も含む", "意味を変えない機械的適用・誤字・format・link修正"]) requireText(discussionSkill, expected);
+forbidText(discussionSkill, "同じturnで次decisionを確定しない", "一論点ずつ選ぶ前提の旧い確定");
+for (const expected of ["### 修正と反映を追跡する", "利用者が修正を一意に指定し、既存権限内であれば再承認を求めず反映できる", "部分反映や検証失敗を全件反映済みにしない"]) requireText(discussionIteration, expected);
+for (const expected of ["**重さ:**", "**依存先:**", "以前の記録で、導出・委託した変更の報告に使った保存形である"]) requireText(discussionTemplate, expected);
+requireText(discussionHelper, "依存先待ち");
+requireText(advancingDiscussionDoc, "## 補助: 一つずつ考える論点と、まとめてよい論点を分ける");
+forbidText(advancingDiscussionDoc, "採否を問わず、導いた結果として報告する", "既決から決まる論点を問わずに決める旧い補助");
+requireText(taskDesignSkill, "ユーザーへ問わなければ確定しないTBDは、識別した時点で`facilitate-discussion`へ渡し");
+forbidText(taskDesignSkill, "この時点ではdiscussion fileの論点・提案・親子関係を組み立てない", "初稿で論点を組み立てない旧い前提");
+// 保留したplugin改善は、再開条件が成り立ちうる時点だけで確かめ直し、状態の変わらない知らせを出さない。
+for (const expected of ["taskやphaseの完了、executorの停止、作業の再開のたびには依頼しない", "確かめ直して状態が変わらない時は、利用者へ何も伝えない"]) requireText(pendingEscalations, expected);
+forbidText(skillPath("tasklist-executor/SKILL.md"), "task／phaseの既存完了条件を実測して次へ進む時は", "taskごとの保留の確かめ直し");
+requireText(steeringSkill, "steeringが依頼するのは、元作業全体を完了する時だけ");
+forbidText(steeringSkill, "その成立証拠で同じ作業の保留条件を再確認してから", "phaseごとの保留の確かめ直し");
 requireOrderedText(escalateSkill, ["\n## 起動gate\n", "\n## 作業先を切り替える前の保留判定\n", "\n## plugin repositoryの判定\n"], "起動後・repository判定前の保留判定");
 // 利用者の確かめを実行許可の画面に当てず、合意の原文を実行するagentへ渡す。
 requireText(skillPath("task-design/SKILL.md"), "実行環境の実行許可の画面（agentがtoolを実行する前に利用者へ出す確認）を、利用者が確かめる手段にしない。");
@@ -1288,7 +1317,6 @@ requireText(escalateSkill, "pending-escalations.md");
 // 独立実操作で検出した到達不能・出典切れの修復条件。
 for (const expected of ["分割済み記録を更新する", "通常のresolve/compareを呼ばない", "実体pathとSHA-256", "design等から旧入口"]) requireText(discussionSplit, expected);
 for (const path of [pendingEscalations, temporaryOverrides]) requireText(path, "保存先fileから相対pathを実解決");
-for (const expected of ["候補を比較", "選定理由", "報告した実際の問いまたは完了reviewと版"]) requireText(derivedChanges, expected);
 
 requireText(discussionResolve, "`.md`以外の拡張子や拡張子なしを追加拒否しない");
 requireText(discussionSplit, "## 元fileと最終directoryが同pathになる場合");
````

version宣言の4箇所:

````diff
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/claude-code-marketplace.json",
   "name": "tumeda-dev-plugins",
-  "version": "9.1.5",
+  "version": "9.1.6",
   "description": "tumedaが、リポジトリ横断でよく使うplugin集。",
   "owner": {
     "name": "tumeda"
@@ -10,7 +10,7 @@
     {
       "name": "tumeda-dev",
       "description": "tumedaが、リポジトリ横断でよく使うskill集としてのplugin。特定テーマに特化したものは順次切り出す",
-      "version": "9.1.5",
+      "version": "9.1.6",
       "author": {
         "name": "tumeda"
       },
@@ -1,7 +1,7 @@
 {
   "name": "tumeda-dev",
   "description": "tumedaが、リポジトリ横断でよく使うskill集としてのplugin。特定テーマに特化したものは順次切り出す",
-  "version": "9.1.5",
+  "version": "9.1.6",
   "author": {
     "name": "tumeda"
   }
@@ -1,6 +1,6 @@
 {
   "name": "tumeda-dev",
   "description": "tumeda\u304c\u3001\u30ea\u30dd\u30b8\u30c8\u30ea\u6a2a\u65ad\u3067\u3088\u304f\u4f7f\u3046skill\u96c6\u3068\u3057\u3066\u306eplugin\u3002\u7279\u5b9a\u30c6\u30fc\u30de\u306b\u7279\u5316\u3057\u305f\u3082\u306e\u306f\u9806\u6b21\u5207\u308a\u51fa\u3059",
-  "version": "9.1.5",
+  "version": "9.1.6",
   "skills": "./skills/"
 }
````

判断してほしいこと（このまとまりの中で）: a（仮決め）でよいか。

#### 検討記録（論点32・イテレーション0）

##### 検証: 合意済みの変更を全部当てた状態で、検査が通るか

論点21・24・26〜31の決定の変更を作業木へ当て、`validate-plugin.mjs`を今の版のまま実行した。失敗は、消した`derived-change.md`を読む・名を含むことを求める検査（存在、`SKILL.md`がfile名を含むこと、本文の9語）と、templateの状態の行を固定した検査だけだった。どれも今回の決定で意図して変えた箇所である。

上の差分を当てて再実行し、`plugin validation passed`を確かめた。`node --check`は`validate-plugin.mjs`と`inspect-discussion.mjs`で通り、`node scripts/verification/test-task-design-handoff.mjs`は`task-design handoff tests passed`、`node --test plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.test.mjs`は失敗0件だった。

##### 足した検査の選び方

`README.md`の「`forbidText` を先に確認する」に従い、禁止する文は、今後の変更で戻りうる旧い形にした（`derived-change.md`への参照、「同じturnで次decisionを確定しない」、「採否を問わず、導いた結果として報告する」、初稿で論点を組み立てない前提、taskごと・phaseごとの保留の確かめ直し）。求める文は、決定の中心になる契約の文（段の名前と数、回を重ねた論点、根拠の名指し、前例から決まっても問わずに決めないこと、印の位置、okの別名、返事の読み方、採らなかった案の記録、修正の追跡、欄、依存先待ち、保留の時点と知らせ）にした。

合意前のため、検証の後に作業木を元へ戻した。合意後に同じ変更を当て、もう一度検証してからcommitする。

#### 提案0へのフィードバック（論点32）

**結果:** 合意（a）。「ok」は全部の仮決めへの合意である。

論点32・33を、確かめるだけの論点として仮決めでまとめて示した往復への返事である。

> ok

### 決定（論点32）

`scripts/verification/validate-plugin.mjs`を提案0の差分で変え、version宣言の4箇所と`expectedRelease`を9.1.6にする。変更後の全文は[`drafts/validate-plugin.mjs`](../drafts/validate-plugin.mjs)である。

## 論点33: 議論記録の提案でも、推奨・仮決めの印を案の行に付けるか

**ステータス:** 決定

**親論点:** 論点16

**種別:** TBDヒアリング

**重さ:** 確かめるだけ（四観点とも小。根拠: 論点26〜28をまとめて示した往復の返事「の方が読みやすい」）

### イテレーション0（論点33）: templateの差分を仮決めで示す

#### 提案0（論点33）

- **a. 次の差分で、`compact-options.md`と`detailed-options.md`の印の位置を案の行へ移す**（仮決め）
- **b. 議論記録のtemplateは変えず、chatでの示し方だけを案の行に付ける形にする**

根拠: 論点26〜28をまとめて示した往復の返事「xxx （推す案a or 仮決定a）…より xxx a. xxx（仮決定 or 推奨）…の方が読みやすい」と、論点24の決定に加えた`round-trip.md`の示し方。bは、chatと議論記録で印の位置が食い違い、議論記録の提案を読む時だけ読みにくい形が残るため採らない。

`plugins/tumeda-dev/skills/facilitate-discussion/templates/proposal-sections/compact-options.md`（全文: [`drafts/c33/compact-options.md`](../drafts/c33/compact-options.md)）:

````diff
@@ -7,9 +7,7 @@
 ## template
 
 ```markdown
-**推奨:** {推奨する選択肢の添字}。{推奨理由を書く。}
-
-- **a. {選択肢を一文で書く}**
+- **a. {選択肢を一文で書く}**（推奨）
   - {この案を理解・比較するための要素を書く。}
   - {必要な別の説明、影響、trade-off、条件等を書く。}
   - {さらに必要な列挙要素があれば追加する。}
@@ -17,8 +15,10 @@
   - {aと同じ観点と粒度に倣い、この案に必要な子要素を必要な数だけ書く。}
 
 {b以降もc、d等の添字で必要な選択肢数だけ増やし、各案の子要素はaの記述形に倣う。}
+
+{推奨の理由を、全ての案の後に書く。}
 ```
 
-ユーザーが添字だけで選べるよう、各選択肢に`a`から始まる連続した添字を付ける。選択肢自体は添字の直後に一文で書く。一階層下には、その案を理解・比較するために必要な要素を列挙し、要素数と各要素の長さを固定しない。
+ユーザーが添字だけで選べるよう、各選択肢に`a`から始まる連続した添字を付ける。推奨・仮決めの印は、案の前に別の行として書かず、該当する案の行の末尾に付ける。案を読みながら、どれが推されているかが分かるためである。確かめるだけの論点を仮決めとして示す時は「（推奨）」の代わりに「（仮決め）」を付け、理由として根拠を名指す（[round-trip.md](../../round-trip.md)）。選択肢自体は添字の直後に一文で書く。一階層下には、その案を理解・比較するために必要な要素を列挙し、要素数と各要素の長さを固定しない。
 
 `a`は選択肢と子要素を省略せず、実際に必要な厚みを持つ記述形として使う。`b`以降は選択肢数に応じて増減させ、子要素の観点と粒度を`a`に揃える。説明にnested listでは収まらない複数段落、表、tree、図等が必要なら`detailed-options.md`を使う。
````

`plugins/tumeda-dev/skills/facilitate-discussion/templates/proposal-sections/detailed-options.md`（全文: [`drafts/c33/detailed-options.md`](../drafts/c33/detailed-options.md)）:

````diff
@@ -7,9 +7,7 @@
 ## template
 
 ```markdown
-**推奨:** {a / b / c}。{推奨理由を書く。}
-
-##### a. {選択肢を一文で書く}
+##### a. {選択肢を一文で書く}（推奨）
 
 {この案の内容を、必要な段落、固有見出し、表、tree、図、代表例等で示す。}
 
@@ -20,6 +18,8 @@
 ##### c. {選択肢を一文で書く}
 
 {この案の内容を、必要な段落、固有見出し、表、tree、図、代表例等で示す。}
+
+{推奨の理由を、全ての案の後に書く。}
 ```
 
-ユーザーが`a`、`b`、`c`だけで選べる添字を保つ。各案の見出し自体で選択肢を一文表示し、その配下を案ごとの説明領域にする。すべての案へ同じ固定小見出しを要求せず、比較に必要な具体像とpatternを案ごとに選ぶ。
+ユーザーが`a`、`b`、`c`だけで選べる添字を保つ。推奨・仮決めの印は、案の前に別の行として書かず、該当する案の行の末尾に付ける。案を読みながら、どれが推されているかが分かるためである。確かめるだけの論点を仮決めとして示す時は「（推奨）」の代わりに「（仮決め）」を付け、理由として根拠を名指す（[round-trip.md](../../round-trip.md)）。各案の見出し自体で選択肢を一文表示し、その配下を案ごとの説明領域にする。すべての案へ同じ固定小見出しを要求せず、比較に必要な具体像とpatternを案ごとに選ぶ。
````

判断してほしいこと（このまとまりの中で）: a（仮決め）でよいか。

#### 検討記録（論点33・イテレーション0）

利用者の返事は、chatで示した形を指していた。議論記録の提案は`templates/proposal-sections/`の二つのtemplateで形が決まり、今は案の前に「**推奨:** a。」の行を置く形である。chatと議論記録は同じ提案を示すため、印の位置も揃えるのが自然であり、仮決めとして示した。`scripts/verification/validate-plugin.mjs`はこの二つのfileの存在だけを検査しており、文の検査は無い。過去の議論記録の提案は直さない。

#### 提案0へのフィードバック（論点33）

**結果:** 合意（a）。「ok」は全部の仮決めへの合意である。

論点32・33を、確かめるだけの論点として仮決めでまとめて示した往復への返事である。

> ok

### 決定（論点33）

`facilitate-discussion/templates/proposal-sections/compact-options.md`と`detailed-options.md`の推奨の印を、案の前の行から、該当する案の行の末尾へ移し、推奨の理由を全ての案の後に書く形にする。確かめるだけの論点を仮決めとして示す時は「（仮決め）」を付け、理由として根拠を名指す。変更後の全文は[`drafts/c33/`](../drafts/c33/)である。chatと議論記録で印の位置を揃えるためである。


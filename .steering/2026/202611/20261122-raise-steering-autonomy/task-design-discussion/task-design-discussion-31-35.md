# 議論記録

## 論点31: 保留の確かめ直しと知らせの変更集合

**ステータス:** 応答待ち

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

## 論点32: 検査scriptのassertionとversionの差分

**ステータス:** 依存先待ち

**親論点:** 論点16

**種別:** TBDヒアリング

**重さ:** 確かめるだけ（四観点とも小。根拠: root `README.md`「変更時の検証と前提」、論点23の決定）

**依存先:** 論点26〜31（各fileの文面が決まれば、検査する文を選べる）

### イテレーション0（論点32）: 論点を立てた（まだ示していない）

変えた契約の文を検査するassertionと、versionの宣言値・`expectedRelease`の差分を示す。

## 論点33: 議論記録の提案でも、推奨・仮決めの印を案の行に付けるか

**ステータス:** 調査中

**親論点:** 論点16

**種別:** TBDヒアリング

**重さ:** 確かめるだけ（四観点とも小。根拠: 論点26〜28をまとめて示した往復の返事「の方が読みやすい」）

### イテレーション0（論点33）: 論点を立てた（まだ示していない）

示す予定の仮決め: 議論記録の提案に使う`facilitate-discussion/templates/proposal-sections/compact-options.md`と`detailed-options.md`も、案の前に「**推奨:** a。」と書く形から、推奨する案の行の末尾に「（推奨）」と付け、推奨の理由を案の後に書く形へ改める。chatと議論記録で印の位置を揃えるため。


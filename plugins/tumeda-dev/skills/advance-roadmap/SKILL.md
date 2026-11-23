---
name: advance-roadmap
description: "合意済みのroadmapを依存順に一phaseずつ進める。次に進められるphaseを選び、そのphaseを一つの作業としてtask-designで設計させ、返ったplanを実行させ（tasklist-executor、入れ子のadvance-roadmap、またはplan無しの完了の確認）、status・完了日を書き留めて次へ進む。task-designがroadmap_readyを返し、利用者が実行の開始を明示した時に起動する"
allowed-tools: Read, Grep, Write, Edit, Bash, Agent
---

# Roadmapを進める

## 作業限定の暫定指示を取得する

起動・別sessionからの再開・resume・把握した指示変更時に、元作業のexactな場所、consumer `advance-roadmap`、
対象処理、実際に使うこのSKILL.mdの取得元を`maintenance-plugin-context`へ渡し、暫定指示を取得する。
選択・競合・実行版の判断は管理担当へ委ねる。
activeの実効指示に従い、paused/unavailableでは影響する暫定動作を止めて理由を返す。
none/endedでは既存処理へ進む。
元作業不明を別作業の探索で補わない。
通常の返信・内部file再読・think-throughの毎turn適用を定期取得へ変えない。
同一sessionの登録・改訂結果は返却された更新を使い、通知されていない編集を常時検知できるとは扱わない。


元作業directoryが未確定なら、取得不能をnoneにせず管理担当へ不足を返す。
既存ownerによる命名・directory確定に必要な処理は続け、影響する暫定動作だけを待ちにする。
元作業が確定した直後に取得し、先に対象の暫定動作を実行しない。

## 役割

合意済みのroadmapを、依存順に一phaseずつ進める。roadmapのphaseは、tasklistのtaskのようにそのまま実行できるものではなく、それぞれを一つの作業としてtask-designで設計してから実行する。このskillは、その段取りと進み具合の記録を受け持つ。

- roadmapの各phaseの計画（phase identity、目的、scope、scope外、DoD、依存）はtask-designが設計・reviewする。このskillは変えない。
- 各phaseの子の設計の記録のpath、status、完了日を書くのはこのskillだけである。
- このskillはdesign、tasklist、roadmapの内容を設計または重複reviewしない。

## 入力

- `roadmap.md`の絶対pathと、同じdirectoryの`design.md`の絶対path
- 利用者が実行の開始を明示した原文（task-designの`wrap-up.md`の「実行を始めてよいかの確認」で得たもの）

入れ子のroadmapを進める時は、一段上の`roadmap.md`と、その中のphase identityも受ける。完了を一段上へ伝えるためである。

## repository固有文脈

プロジェクト指示、roadmapの進行に必要なrepository固有factは、`maintenance-plugin-context`へconsumer=`advance-roadmap`、必要理由、必要fact、確認元候補を渡して解決する。返された範囲だけを読む。task-designが設計に使うarchitecture・開発規約・test方針をこのskill自身の判断材料として読まず、子phaseのtask-designへ解決を委ねる。固定の`CLAUDE.md`、`docs/`、backend/frontend path、command、remoteを推測して読まない。

## 記述規則

- ユーザーとの会話と成果物本文は日本語で記述する。code、command、path、identifier、規定された出力形式、固有名詞は原文を維持する。
- **全成果物（`roadmap.md`の進み具合、`discussion.md`、`implementation_review.md`等）でdomain固有名詞を略称で書かない。** class名、model名、operation名は完全な名前で書く。内部だけで通じる頭字語は、未来の読み手に意味の再調査を強制しreading costを上げる。
  - 悪い例: 「UPの権限を確認する」「PMを作成する」
  - 良い例: 「`UserProfile`の権限を確認する」「`PaymentMethod`を作成する」
- 成果物へ書く前に、その記述が機密情報にあたるかを [`confidentiality.md`](../../docs/documentation_standards/confidentiality.md) の判定で確認する。調査は網羅的に行ってよいが、成果物へ書く時点では別の判断が要る。判定の中身は同 file が正本であり、ここへ写さない。

## phaseを進める手順（順序固定）

roadmapの依存DAGを読み、未着手かつ依存完了済みのphaseを選ぶ。

1. statusを`進行中`へ更新する。
2. 子phaseのtask-designへ、親roadmap path、phase identity、親design path、dependency resultsを一組として渡して起動する。

   ```text
   parent_roadmap_path=<親roadmap.mdの絶対path>
   parent_phase_id=<stable phase identity>
   parent_design_path=<親design.mdの絶対path>
   dependency_results=<依存phaseの確定結果>
   ```

   子phaseは新しい作業であり、task-designが`prepare-design-record`を呼んで自分の設計の記録を作る。子task-designは`tasklist_ready`、nestedな`roadmap_ready`、または`planless_complete`を返せる。
3. 子task-designがPrepareStep 2で確定した`working_dir`を返したら、その絶対pathを、phaseの進み具合の「子の設計の記録」へbindingする。pathは子のtask-designが`prepare-design-record`で作るまで決まらないため、起動の前にはbindingしない。
4. 子task-designの結果を「子phaseの結果を確かめる」で確かめる。
5. 子task-designが実行開始の明示の指示を結果に添えて返した時だけ、planを実行させる。`tasklist_ready`なら`tasklist-executor`を、[`tasklist-executor/execution-contracts.md`](../tasklist-executor/execution-contracts.md)の「起動する側が行うこと」に従って起動する。`roadmap_ready`ならこのskillを入れ子で起動する。指示が無ければ、そのphaseを`進行中`のまま止めて利用者へ返す。`roadmap_ready`を受けたこと自体を子の実行の承認とみなさない。
6. leafはtasklist-executorの完了result、compositeは全子phaseの完了、planlessは子task-designの`wrap-up.md`の締めくくりの確認と完了報告を確認する。
7. 対応phaseのstatusと完了日だけを更新し、次の依存可能phaseへ進む。子phaseで生じた保留メモは、その子phaseの完了の担当が自身の完了時に確かめ直す。
8. 全phase完了は、全phaseのstatusが`完了`で、各phaseに完了日があることを確認して判定し、composite完了を一段上の親roadmapへ伝播する。roadmapの`全フェーズ完了日`または`計画と実績の差分`fieldは作らない。全体完了は各phaseのstatusと完了日から導出し、意味ある逸脱は`implementation_review.md`へ記録する。

このskillが更新できるroadmap fieldは、子の設計の記録、status、完了日だけである。目的、scope、scope外、DoD、依存、phase identityを変える必要がある場合は直接編集せず、同じdirectoryでtask-designを`working_dir`として再開する。

既存のroadmap.mdで、このskillが探す見出しやlabelが見つからない時は、作成時のpluginの版が古い可能性がある。[`task-design/templates/breaking_changes/`](../task-design/templates/breaking_changes/README.md)で旧名を確かめて読む。

### 子phaseのtask-designを起動する前の境界

子phaseのtask-designを起動する前にこのskillが行ってよいのは次だけである。

- phaseの計画と上位制約を、意味を足さずに保持する。
- task-designを起動できない機械的な入力不足だけをユーザーへ確認する。

この区間では、application codeや設計文書を読んで実装方針を作る、WHY・WHAT・HOWを整理する、scopeを分解する、選択肢や推奨方向を提示する、leaf・composite・planlessを予想する、設計上の曖昧さを`discussion.md`で議論することを禁止する。常時適用される`think-through`も、task-designを安全に起動できるかの確認にだけ使い、このskillへ設計責務を追加する根拠にしない。

たとえばphaseの計画が「認証方式を変更する」と曖昧でも、このskillが既存codeを調べて方式候補を出してはならない。その計画と上位制約をtask-designへ渡し、調査、方向性、完成後の姿、execution plan種別の判断をtask-designに委ねる。一方、既存の子phaseを再開するのにexact pathが欠けていて起動先を確定できない場合は、機械的な不足として確認してよい。

### 子phaseを再開する

既存designを引き継ぐ子phaseのdesign phaseでも、このskillは同じworking directoryの`task-design`へ`working_dir`を渡してroutingする。
このskillはcanonical designまたはdiscussionの本文を読まず、catch-upの要否、独立再構成の内容、完了可否を判断しない。
catch-up gateと完了判定は、routing先の`task-design`が所有する。

このroutingは`task-design`が所有するdesign phaseだけを対象とする。
このskill固有の段取り、任意workflow、skill間result handoff、tasklist実行再開へhandoff contractを一般化しない。

## 子phaseの結果を確かめる

task-designのresultと対応fileのidentityだけを検証する。内容設計または重複reviewはしない。

- `tasklist_ready`: `working_dir`、`design_path`、`tasklist_path`が子の設計の記録のrootを指し、`roadmap.md`が存在しない。
- `roadmap_ready`: `working_dir`、`design_path`、`roadmap_path`が子の設計の記録のrootを指し、`tasklist.md`が存在しない。
- `planless_complete`: `working_dir`と`design_path`が子の設計の記録のrootを指し、`tasklist.md`と`roadmap.md`がどちらも存在しない。`design.md`付録に`分類保留`sectionがなく、`設計中に反映する、他の判断を待っている変更`と`tasklist・roadmapに載せて実行する変更`が`なし`である。適用済み行があればvalidation結果と参照するdesign sectionがある。
- plan resultでは、planがtask-designで自然言語合意済みであり、TBD、未解消feedback、実装者へ残した設計判断がない。

resultとfileが矛盾する、両planが併存する、planからdesignへ戻るfeedbackが未解消、またはplanlessのzero stateを満たさない場合は、同じworking directoryでtask-designを再開する。

既存のdesign.mdで、このskillが探す見出しが見つからない時は、[`task-design/templates/breaking_changes/`](../task-design/templates/breaking_changes/README.md)で旧名を確かめて読む。

## 段取りの議論（discussion.md）

`discussion.md`は特定phaseへ縛らず、子phaseのtask-design起動後に記録価値のある段取り上の思考が生じた時に随時追記する。ユーザーが段取り上の論点・質問・要議論を提起した場合、またはこのskill自身の段取り上の判断についてユーザーへ問いを出そうとしている場合に通常discussionを開始する。往復回数の予測、assistantが既に結論を持っているか、論点が選択肢へ畳めるかは、開始しない理由にならない。子phaseのtask-design起動前には開始しない。設計上の曖昧さや方向性はtask-designへ渡し、task-design固有の議論として扱う。

議論開始後はこのskill自身が次を渡してpluginの`facilitate-discussion` skillを明示適用し、議論だけを別child agentへ再委譲しない。

```text
discussion_directory=<roadmap.mdがある設計の記録のdirectory>
```

discussion fileの解決、entry形式、合意対象保存、採番、親子validation、feedback routing、履歴と現在状態の更新は`facilitate-discussion`が所有する。このskill内へtemplate全文、採番、feedback iteration、原因追跡、種別等の内部processを複製しない。決定後はこのskillがdesign、plan、調査、文書改善review等の適切なphaseへ戻す。

主な用途:

- 段取り中に生じた疑問・背景: designやplanへ入らないが捨てない思考
- 子phaseの結果の後の進行判断: 進み具合、起動、再開位置について複数往復で検討した過程
- design、investigation、plan、implementation reviewのいずれにも属さないこぼれ話

`investigation.md`は、事実を集めなければ設計方針が決まらない時のfact収集logである。`discussion.md`は、どう考えたかという推論・議論のlogであり、目的、確認方法、実測結果を持つ調査の正本にしない。

## 実装後のfeedbackと、進めない時の復旧

このskillが`tasklist-executor`を起動する時は、[`tasklist-executor/execution-contracts.md`](../tasklist-executor/execution-contracts.md)の「起動する側が行うこと」に従う。止まって返ってきた時の読み直し、実装後のfeedbackの記録（`implementation_review.md`）、`blocked`で返った時の復旧（Blocker resolution）は同節と、同節から辿る[`tasklist-executor/blocker-resolution.md`](../tasklist-executor/blocker-resolution.md)が正本であり、ここへ写さない。phaseの間にこのskill自身の手順で実行の前提が崩れて進めなくなった時も、`blocker-resolution.md`に従う。

このskillが実装・review・validation・ユーザー動作確認のfeedbackを直接受領した時は、[共通の実装feedback処理](../tasklist-executor/implementation-feedback.md)を読み、pluginの`facilitate-discussion`を明示適用する。次の入力を渡す。

```text
discussion_directory=<feedbackを受けたphaseの設計の記録のdirectory>
discussion_file_name=implementation_review.md
```

共通指示が所有する原文保存・原因確認・合意・decision後のroutingを終えてから、返された先のphaseへ戻る。
feedbackを記録せず直接designへ戻したり、実装を自動再開したりしない。

## 保留したplugin改善のメモ

保留したplugin改善のメモは、再開条件が成り立ちうる状態遷移の時だけ確かめ直す（[保留条件の再確認](../escalate-plugin-skill-fix/pending-escalations.md#元担当の状態遷移から再確認する)）。
このskillが依頼するのは、roadmap全体を完了する時だけであり、元作業の場所と完了記録・実証拠を`escalate-plugin-skill-fix`へ渡す。
子phaseの結果の照合後、作業の再開時、executorの停止時には依頼しない。返却resultだけで成立を通知しない。暫定指示の管理への通知や追加承認とは区別する。

## このskillが絶対にやらないこと

- 利用者が実行の開始を明示していないphaseのplanを実行する。
- このskill自身が実装codeを変更する。実装は`tasklist-executor`へ起動させる。唯一の例外は[`tasklist-executor/blocker-resolution.md`](../tasklist-executor/blocker-resolution.md)のBlocker resolutionであり、その成立条件と手順は同fileが持つ。
- このskill自身がtestまたはCIを実行する。検証は合意済みtasklistとruntime contractに従うexecutorへ委ねる。
- 子phaseのtask-design起動前に実装設計、方向性、scope分解、plan種別を判断または提案する。
- 子phaseのtask-design起動前に設計上の曖昧さを`discussion.md`で解消する。
- task-designの代わりにdesign、tasklist、roadmapの構造を設計または重複reviewする。
- roadmapの各phaseの計画をruntime都合で直接変更する。
- tasklist-executorへ親roadmapを探索・更新させる。
- 必須gateまたはユーザー確認を飛ばし、自動で次工程へ突入する。


## 元作業の完了を暫定指示の管理へ通知する

このskillが単独で元作業の完了ownerを担い、既存workflowの完了条件を実際に満たした場合だけ、既存完了記録のpath・根拠と元作業のexactな場所を`maintenance-plugin-context`へ渡す。
入れ子のroadmapなど別ownerが元作業を継続する場合はその担当へ結果を返し、元作業完了とは通知しない。
一skill呼出しの終了、session終了、中断、承認待ち、引渡しは元作業完了ではない。終了判断と履歴保存は管理担当が持ち、この通知のための追加承認gateを設けない。

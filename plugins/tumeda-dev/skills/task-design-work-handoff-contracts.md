# task-design work handoff contracts

進行中のdesign判断責任を別の`task-design`実行へ渡すときの、共有される不変条件である。ownerは`task-design`であり、このreferenceは独立して起動するskillではない。`steering`はdesign phaseを同じworking directoryの`task-design`へroutingするだけで、ここにある判断を再実装しない。

## 対象と対象外

対象は、別agentまたはownershipの連続性を確認できない新しい`task-design`実行が、既存working directoryにある未完了designの判断責任を引き継ぐcaseだけである。designの規模、discussion量、変更の軽重では省略しない。

新規design、同じ`task-design`実行がfeedbackまたは`facilitate-discussion`から戻る継続は対象外である。前者には読むべきcanonical成果物がなく、後者には既に同じ実行の判断責任があるためである。

steering固有phaseの引き継ぎ、任意workflowのhandoff、skill間result handoff、tasklist実行の再開は対象外である。これらをこのcontractへ一般化してはならない。

## 起動gateと読取境界

working directoryを確定した直後、`task-design`は`design.md`または`task-design-discussion.md`の**存在だけ**を確認する。既存正本があれば、canonical本文を読む前にこのcatch-upを開始する。`task-design`と`think-through`、適用標準、repository固有指示を先に読み、通常の設計前調査は対象working directoryを除外して行う。

独立再構成前に許可される対象design由来の入力は、`scripts/extract-handoff-input.mjs`がstdoutへ出す単一の`元の依頼内容`と、存在する場合の単一の`上位roadmap制約`だけである。summary、designの他section、discussion、既存attempt本文、canonical file全体を読むことは禁止する。extractorが欠落、重複見出し、壊れた境界、読取失敗を報告したときは、内容を推測または別経路で復元せずfail closedで停止する。

## attemptの作成と独立再構成

attemptは`<working_dir>/task-design-catch-up/attempt-NNN.md`へ一回のcatch-upにつき一fileで保存する。作成前に、working directoryがGit管理下ならこのexact directoryが`git check-ignore`でignoredであることを確認する。standalone working directoryでignoreを確認できない場合は作成せず停止する。canonical designまたはdiscussionをattemptで上書きしない。

同じ`task-design`実行の再開は同じattemptを続ける。別の`task-design`実行は既存attempt本文を独立再構成前に読まず、最大連番の次の`attempt-NNN.md`を選ぶ。attemptには、許可入力の参照元、仮design、TBD全体を先に保存する。ここには禁止入力であるcanonical結論やdiscussionの内容を混ぜない。

## 正本照合とcompletion gate

独立再構成を保存した後だけ、canonical designとdiscussionを読む。同じattemptへ、各decisionの問題、採用判断、主要な棄却案と理由、activeまたは停止中topicの現在案、未決判断、依存先、次の一問を自分の言葉で対応表に記録する。

対応表はcurrent design、全decision、activeまたは停止中topicを漏れなく置く。独立再構成との差分を`一致`、`正本から補完して理由まで理解`、`正本へ疑義あり`、`独立再構成だけにある新規TBD`の四分類へ一件ずつ置く。`正本へ疑義あり`は対応topicの再開へ、current designへ影響する新規TBDは新しいtopic候補として`facilitate-discussion`へroutingする。未分類差分または未解消疑義が一つでもある間はcatch-up未完了であり、既存topicへ戻らない。

正本を比較する時点と完了直前にcanonical file digestを取り、両方が一致することを確認する。digestが変化していれば、独立再構成を捨てず最新正本との差分解消へ戻る。全対象のcoverage、四分類、未分類差分zero、未解消疑義zero、digest一致、exactな再開topicと次の一問がそろったときだけcatch-up完了とする。

## 停止、再開、cleanup

catch-upが未完了で停止するときはcanonical fileを変更せず、current attemptへ停止理由とexactな再開位置を残す。必要な変更は通常の`facilitate-discussion`手順で正本へ反映してから再評価する。attemptの本文をcanonical fileへ転記して合流してはならない。

完了時だけ`task-design-catch-up/`を削除する。削除前に、対象がworking directory直下のexact pathでsymlinkではなく、entryが`attempt-[0-9]{3}.md`だけであることを確認する。予期しないentryまたはsymlinkが一つでもあれば削除せず停止する。cleanup後、`task-design`は確認済みのexactなactive topicと次の一問から既存workflowを再開する。

## 更新owner

このcontractの順序、読取境界、attempt lifecycle、completion validationは共有referenceだけが所有する。`task-design`は入口、入力解決、既存workflowへの復帰を担い、`steering`はdesign phaseのroutingだけを担う。変更時はこの責務境界を壊さず、consumerに同じ判断基準を複製しない。

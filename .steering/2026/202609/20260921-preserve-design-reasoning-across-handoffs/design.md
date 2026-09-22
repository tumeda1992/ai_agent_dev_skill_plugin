# Design: design引き継ぎで判断根拠を再構成する

## 元の依頼内容

進行中designを別agentへ引き継ぐとき、後任が保存済みの `design.md` とdiscussionを受動的に読んで直ちに続きを始める方式にしない。

後任は、引き継ぐworkflowに必要なskill本体と `think-through` を先に読み、既存の正本を見る前にoriginal requestと参照対象から仮designとTBD全体を独立に組み立てる。その後で正本のdesignとdiscussionを読み、各decisionの問題、棄却案、現在判断へ至った理由を自分の仮説と照合する。自分の仮説と正本の差分を説明でき、現在の未決論点を自分の言葉で再構成できた状態をcatch-up完了とする。

一時成果物を使う場合はgitignore対象領域へ置き、catch-up完了後に削除して正本へ合流する。配置、命名、読んでよい根拠の範囲、完了validation、失敗時の再開位置は設計で決める。

必要性が分かった具体例では、後任agentが対象workflowのskill本体と `think-through` を読まず、保存済み成果物の表面だけから続きを始めた。ファイル上の現在地は読めても、なぜその順序で考え、どの誤りを経て現在判断に至ったかを自分の判断として持てず、進め方が既存議論から外れた。

別の引き継ぎでは、正本を先に読まずoriginal requestと参照記録から独自のTBDと論点を立て、その後で正本のdesignとdiscussionに照合した。完成済みの結論を覚えるだけでなく、同じ材料から自分がどこまで到達し、どこで既存議論の方が深かったかを比較できた。結果として、既存decisionを外から渡された制約ではなく、自分の判断として引き継ぎやすくなった。

---

## TL;DR

引き継ぎ失敗の原因は情報不足だけではない。正本を最初に読むと、後任は既存の切り分けと結論を前提として受け取り、自分でTBD全体を構成したかのように錯覚できる。

終了時には、独立再構成と正本との差分解消をcatch-upの完了条件にするcontractが成立する。owner、適用条件、共有reference名、一時成果物、読取境界、完了validationを一つのworkflowとして定める。

---

## 完成後の姿

### skillの役割と方針

進行中designの引き継ぎでは、保存済み成果物を読めることと、判断根拠を引き継げたことを区別する。後任がoriginal requestから問いの全体を一度構成し、正本との差分を説明できる状態を成立させる。

独立再構成は既存議論を隠して難しくすることが目的ではない。後任が、どの問いを立てるか、上位と下位をどう分けるか、何を不確実として残すかを一度自分で担うために行う。正本を読んだ後は、自分の仮説との差分を通じて既存decisionの根拠と棄却案を理解する。

新しく起動した`task-design`が既存working directoryのdesignを引き受ける場合、catch-upを必須とする。working directory確定直後は`design.md`または`task-design-discussion.md`の存在だけを確認し、本文は独立再構成後まで読まない。

既存正本がない新規designは対象外とする。同じtask-design実行が既に判断責任を持つ場合、user feedbackや`facilitate-discussion`から戻るたびにはcatch-upを再起動しない。ownershipの連続性を判定できない場合はcatch-upを必須とする。design規模、discussion量、変更の軽重による省略条件は設けず、対象が小さい場合はcatch-upの作業量自体を小さくする。

独立再構成前に読める入力は、`task-design`と`think-through`、適用標準とrepository固有指示、`design.md`からbounded extractionした`元の依頼内容`と任意の`上位roadmap制約`、対象working directoryを除外した通常の設計前調査で得る外部事実に限定する。

`plugins/tumeda-dev/skills/task-design/scripts/extract-handoff-input.mjs`は、対象`design.md`全体をmodel contextへ入れず、許可sectionだけをstdoutへ出す。`元の依頼内容`がない、section境界が壊れている、または抽出に失敗した場合は非zeroで停止する。全体読込み、summaryからの復元、推測へfallbackしない。

catch-upの不変条件は、`plugins/tumeda-dev/skills/task-design-work-handoff-contracts.md`を正本とする。共有referenceは独立起動するskillではなく、進行中designのownerを置き換えない。

共有referenceが扱うhandoff objectは、`task-design`が所有する未完了designの判断責任に限定する。`task-design`がcontractを適用し、`steering`はdesign phaseの引き継ぎを同じworking directoryの`task-design`へroutingする。steering固有phaseと任意workflowの引き継ぎはscope外とする。

配布versionは`8.0.1`へPATCH bumpする。既存skillのbehavior拡張と内部helperの追加であり、consumerが新たに呼び出すskillまたはparameterは増えない。

### workflow

catch-upは次の順序で実行する。

1. 後任agentが`task-design`、`think-through`、適用標準、repository固有指示を読む。
2. bounded extractionした元依頼と上位制約、対象working directoryを除外した通常の設計前調査から、仮designとTBD全体を独立再構成する。
3. `<working_dir>/task-design-catch-up/attempt-N.md`へ、許可入力の参照元、独立再構成した仮designとTBDを保存する。
4. 正本のdesignとdiscussionを読み、各decisionの問題、棄却案、現在判断へ至った理由を仮説と照合し、同じattempt fileへ差分と未解消事項を追記する。
5. 現在有効なdesign、各decision、activeまたは停止中topicを対応表へ漏れなく置く。各decisionの問題、採用判断、主要な棄却案と理由、各未決topicの現在案、未決判断、依存先、次の一問を自分の言葉で再構成する。
6. 独立再構成との差分を`一致`、`正本から補完して理由まで理解`、`正本へ疑義あり`、`独立再構成だけにある新規TBD`へ分類する。疑義は対応topicの再開へroutingし、現在designへ影響する新規TBDは新しいtopic候補としてtask-designへ返す。
7. 比較時と完了直前のcanonical file digestが一致し、全対象が対応表に現れ、未分類差分と未解消疑義がzeroで、exactな再開topicと一問を示せた場合だけ完了とする。digestが変化していれば独立再構成を維持したまま最新正本との差分解消からやり直す。
8. 必要な変更が正規のdiscussion手順で反映済みであることを確認する。attempt本文をcanonical fileへ転記せず、一時directoryを安全確認して削除し、特定済みのactive topicからtask-designを再開する。

catch-up未完了で停止する場合はcanonical fileを変更せず、現在attemptへ停止理由と再開位置を残す。同じtask-design実行は同じattemptを続け、別のtask-designは既存attempt本文を独立再構成前に読まず新しい連番を使う。

### documentationによって成立する知識体系

進行中designの判断責任を引き継ぐcontractは、`plugins/tumeda-dev/skills/task-design-work-handoff-contracts.md`として設ける。

共通documentを設ける場合、具体例から再利用可能な原則、適用対象、例外、誤適用、更新ownerを持たせる。個別skillへ同じ手順を複製しない。

### documentation以外のfile deliverable

対象fileは次のとおり。

- `plugins/tumeda-dev/skills/task-design/SKILL.md`
- `plugins/tumeda-dev/skills/steering/SKILL.md`
- `plugins/tumeda-dev/skills/task-design-work-handoff-contracts.md`
- `plugins/tumeda-dev/skills/task-design/scripts/extract-handoff-input.mjs`
- `plugins/tumeda-dev/skills/README.md`
- catch-up一時成果物を追跡対象外にする `plugins/tumeda-dev/skills/steering/.gitignore.sample`
- `scripts/verification/test-task-design-handoff.mjs`
- `scripts/verification/validate-plugin.mjs`
- `plugins/tumeda-dev/.codex-plugin/plugin.json`
- `plugins/tumeda-dev/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

対象fileには、trigger、入力、読む順序、正本を読む前後の境界、完了状態、削除、停止・再開を、担当ownerの責務に応じて記述する。単に「引き継ぎ時は十分に理解する」とだけ書かない。

---

## 要件（Requirements）

### MUST（必達）

- 後任agentが `task-design` と `think-through` を読まずに続きを始める経路を塞ぐ
- 新しい`task-design`が既存正本を引き受ける場合は規模によらずcatch-upし、同じtask-design実行内では重複起動しない
- 仮design保存前に対象designの結論と議論過程をmodel contextへ入れず、許可sectionの抽出失敗時はfail closedで停止する
- 一attemptを一fileへ保存し、未完了時は再開可能に保ち、完了時だけ検証済みの一時directoryを削除する
- current design、全decision、activeまたは停止中topicを対応付け、未分類差分と未解消疑義がzeroになるまでtask-designを再開しない
- 正本を読む前の独立再構成と、正本を読んだ後の差分解消を両方成立させる
- catch-up完了を、一時fileの作成有無ではなく、差分説明と未決論点の再構成ができる状態で判定する
- 既存の `design.md` とdiscussionをcatch-up用成果物で上書きせず、正本のsingle writer契約を維持する
- 一時成果物を使う場合、その配置、追跡対象外にする方法、削除時点を一意にする
- ownerを一つに定め、consumer skillへ同じ判断基準を複製しない

### SHOULD（できれば）

- 対象が小さい場合は必須順序を省略せず、再構成する内容量を対象に合わせて小さくする
- 既存skillの再開contractと自然に接続し、catch-up専用の別workflowを不必要に増やさない

### MAY（あれば嬉しい）

- catch-up成果物の標準配置と命名を用意し、後任が置き場所を毎回判断しなくてよい状態にする

### 非目標

- 全discussionを逐語的に再演すること
- 常に一時fileを二つ作ること自体を完了条件にすること
- 既存の正本designとdiscussionをcatch-up成果物へ置き換えること
- 進行中design以外の一般的なsession要約または作業報告を設計すること
- steering固有phase、任意workflow、skill間のresult handoff、tasklist実行の再開を一般化して扱うこと

### 受け入れ基準

- skillを読まず正本の表面だけから続きを始める失敗caseで、catch-up未完了と判定できる
- 独立再構成後に正本との差分を説明できないcaseで、catch-up未完了と判定できる
- 差分説明と未決論点の再構成ができたcaseで、正本へ合流できる
- `task-design`単独起動と`steering`経由のdesign phaseを含むcaseへ当て、必須、省略可能、またはscope外を判定できる
- 抽出scriptが`元の依頼内容`と任意の`上位roadmap制約`だけを出力し、欠落または壊れたsection境界では非zeroを返す
- Git worktree内で一時directoryがignoredでなければ作成前に停止し、ignoredならattemptを作成できる
- 未完了attemptがある状態で別task-designが引き継いでも、その本文を独立再構成前に読まず次の連番を作れる
- 完了時の削除対象に予期しないentryまたはsymlinkがあれば削除せず停止する
- decisionまたはactive topicが対応表から欠けたcase、未分類差分または未解消疑義が残るcaseをcatch-up未完了と判定できる
- canonical fileが比較後に変化したcaseで、独立再構成は維持したまま最新正本との差分解消へ戻れる
- version宣言4箇所とvalidatorの`expectedRelease`が`8.0.1`で一致する
- escalation完了時は、作業branchと`main`のremote ref、merge前後のcommit、最終validator結果から、取り込み済み範囲と失敗時の再開stepを一意に確認できる
- 変更対象のMarkdownへ `document-review` を適用し、`node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出力する
- owner移動または共通contractへの抽出を行う場合、function migration ledgerで既存contractの未分類削除・未分類追加がzeroである

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 正本を読まない時間が長くなり、既に確定したことを無駄に再設計する | 独立再構成の入力範囲と終了条件を限定し、正本との照合を同じcatch-up内の必須後半にする |
| 許可sectionだけ読むつもりで`design.md`全体がmodel contextへ入る | bounded extraction scriptだけを入口にし、抽出失敗時はfail closedで停止する |
| file作成が目的化し、理解不足でも完了扱いになる | 差分説明と未決論点の再構成を完了条件にし、file数を条件にしない |
| 一時directoryの削除で利用者のfileまで消す | exact path、非symlink、許可entryだけを削除前に検証し、一つでも外れれば停止する |
| 小さい引き継ぎにも重いcatch-upを強制する | 必須順序は維持し、再構成する内容量を対象に合わせて小さくする |
| `task-design` と `steering` が同じcontractを重複所有する | 正本ownerを一つにし、consumerは参照と固有の入口だけを持つ |
| catch-up中にcanonical fileが変化し、古い正本との比較で完了する | 比較時と完了直前のdigestを照合し、変化時は最新正本との差分解消へ戻る |

---

## テスト方針

- 起点の失敗case、`task-design`単独起動、`steering`経由のdesign phaseでworkflowを通し、完了・未完了判定をwhite-boxで照合する
- 対象skillと共通contractを通読し、trigger、必須順序、停止・再開、single source of truth、handoffがcallerとconsumerの合算で欠けないことを確認する
- Markdown変更には `document-review` を適用する
- repository validatorを実行する

---

## （付録）前提とする既存仕様

- `task-design`: 新規・再開とも同じworking directoryを使うが、後任agentが再開前に判断根拠をcatch-upする契約はない
- `steering`: task-designの起動・再開、canonical directory、result dispatchを所有するが、別agentへの引き継ぎ理解を検証するgateはない
- `think-through`: 思考順序と場面別標準を持つが、進行中designの後任agent向けcatch-up手順はない
- `facilitate-discussion`: decisionの根拠、棄却案、現在状態をdiscussion fileへ保存するが、後任がそれを自分の仮説との差分で理解したことまでは保証しない

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

なし。

### task-design内の対象成果物反映待ち

なし。

### execution plan対象

| 対象 | 掲載理由 | 参照するdesign section |
| --- | --- | --- |
| task-design work handoff contract、consumer接続、bounded extraction、ignore契約、verification | plugin利用者へ届けるtask-designのruntime behaviorを変更し、独立再構成、差分解消、停止・再開、削除を順序依存で実装・検証する | 「skillの役割と方針」「workflow」「documentationによって成立する知識体系」「documentation以外のfile deliverable」 |
| 配布version `8.0.1` | 変更したplugin behaviorを配布metadataとvalidatorの一意なreleaseとして揃える | 「skillの役割と方針」「documentation以外のfile deliverable」 |
| 作業branchのpushと`main`への取り込み | 利用先repositoryの元taskへ戻る前に、plugin repositoryの変更を作業破棄後も残る配布可能な状態へする外部actionであり、escalation contractが順序を固定する | 「受け入れ基準」 |

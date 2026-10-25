# Tasklist: 保留解除したplugin改善を組み込む

設計の正本は[design.md](./design.md)。そこから参照する領域別詳細も、対応phaseの着手前に読む。
設計と本tasklistは合意済み。実装開始の了承を受領し、Phase 1から実行する。利用者動作確認前にcommit・push・PRへ進まない。

## 実行の共通条件

- 対象pathは、特記しない限り `plugins/tumeda-dev/skills/` からの相対path。
- phase番号だけを実行の依存にしない。2026-10-24の利用者指示に従い、実際の意味的依存を確認してready taskを進める。独立した既存配置整理候補は残件noteへ明示し、実施済みreviewを未実施と扱わず、無関係な機能の実装・検証を止めない。reviewの実施・記録と候補の解消は区別する。未実測のtaskを完了にしない。
- Phase 1〜10は作業branch内で完結させる。release、merge、cache更新、利用先への適用は含めない。
- 現行skillの移動・分割前に、移行元の全文・依存先を保存し、構造ledgerとcontract ledgerを分類する。未分類の追加・削除、合意のない意味変更があれば設計へ戻す。
- skillの作成・更新にはskill-creatorを使う。Phase 1で構造reviewを利用可能にした後は、各対象の構造案を採用する前と編集後に明示適用する。既存の未変更処理も含む対象全体を確認する。
- 新規・更新Markdownにはdocument-reviewを適用する。規則を移しただけで、読取条件・停止・再開・返却が失われていないことも照合する。
- 各phaseで検証caseとfixtureを作成・更新し、期待値を旧contractと合意済み差分から定める。結果・現物・読取元を `artifacts/phase-<番号>/` に保存する。
- skillの挙動は、更新後の実体pathを渡したfresh agentで確認する。評価者へ想定解や修正案を与えず、利用者の依頼と必要な元資料を渡す。同じcontractのcaseはfixtureを分け、一つのfresh processでまとめられる。再開・別sessionを検証するcaseだけprocessを分ける。
- 各phaseで検査scriptの該当assertionも更新する。`forbidText` を含む旧guardの意味を先に照合し、契約不変なら文言・移動先を保つ。単にgreenへ戻すためにguardを弱めない。
- 永続化すべき知識を得た時は、その場でdoc-enricherへ提案し、承認された内容だけ既存READMEへ反映する。最終phaseへの先送りはしない。
- checkboxは実測完了した直後にexecutorが更新する。難しさ・時間・環境未準備を取消理由にしない。未完なら既存の停止・再開契約で返す。

## Phase 1: skill全体の構造をレビューできる

### DoD

対象skillと構造案または編集後の実物を渡すと、読取範囲・内容識別の根拠付きで合格／不合格／材料不足を返し、既存の作業記録へ保存できる。

### Tasks

- [x] 最初の本体編集前に、変更対象13skill、必要な内部指示・template・共有reference、今回編集するREADME・manifest・検査scriptの現行版を保存する。
  - [x] `artifacts/migration-baseline/` と `migration-structure-ledger.md`、`migration-contract-ledger.md` を同じ作業内に作る。sourceの連続範囲・依存・移動先・分類・合意根拠を登録し、今回の差分をdesignと対応させる。
  - [x] 既にある無関係な変更を記録して除外する。`.agents/skills/tumeda-dev-plugin-context.md` は配布templateへのsymlinkのためinstanceとして書き込まない。
- [x] `skill-update-review/` にSKILL.md、collect-review-material.md、assess-structure.md、templates/review-result.md、agents/openai.yamlを作成する。入力判定、材料の収集、全体評価、返却を設計どおり分担する。
- [x] 一責務、独立した復旧工程、二重正本、分割で失われる停止条件、未読資料、共有先の独立問題、古い合格の流用を含むfixtureと判定条件を作り、独立した挙動検証を行う。
  > attempt 1: behavior 12 passed / 0 failed。公式構文検証はPyYAML不足でblocked。証跡: artifacts/phase-1/behavior-run-1/result.json。前提を隔離tmp環境で解消し、材料不変55 fileを照合してattempt 2へ渡した。
  > attempt 2: behavior 12 passed / 構文1 failed。description継続行のYAML不良を修復し、本文・依存・集合不変を記録した。構文合格とcreation taskの再確定はattempt 3のpassed結果待ち。
  - [x] 設計時と編集後の入力、同一担当の再review、不合格と未確認の併記、内容・依存・file集合の変化、表記修正による判定維持を確認する。
  > attempt 3: passed。独立挙動12 case維持、公式skill validatorとUI metadata parseの2件成功（合計14 passed / 0 failed / 0 blocked）。証跡: artifacts/phase-1/behavior-run-3/result.json。文書再review: document-review-frontmatter-fix.md。
- [x] 検証した新skillを使い、`task-design/SKILL.md`、`task-design/tasklist-design.md`、`task-design/templates/tasklist.md`、`tasklist-executor/SKILL.md` へ明示起動・結果保存・完了判定への接続を加える。repository rootの `plugins/tumeda-dev/skills/README.md` に入口を登録する。外部のskill-creatorは編集しない。
  > 証跡: artifacts/phase-1/caller-connection.diff、structure-review-before-callers.md、structure-review-after-callers.md、document-review-callers.md。外部skill-creatorと既存guardは変更していない。
- [x] 新skillと変更したcallerを、材料から返却・保存先まで通して再確認する。文書review、構造の編集後review、既存validatorの該当assertionを確認する。新skillの未作成時の確認を、実起動済みとは記録しない。


> Phase 1 DoD: 通過。新skill実体の12case独立挙動、公式構文/UI parse、最終の文書/構造reviewと全体validator/node --checkの実測が揃った。validation-run-2/result.jsonを消費し、最終集合/hash/実解決先を再照合した。過去failed/失効reviewは履歴として維持する。

## Phase 2: 一file・分割済みの議論記録を読める

> 旧停止の履歴はartifacts/phase-2/design-return.mdへ保持。2026-10-24の利用者指示により、論点53の既存Blocker resolutionの配置整理は新機能の依存ではないと確認した。合意外のBlocker分割本体は実行せず、既存配置候補は残件noteに保持する。reviewの実施と候補解消は区別し、議論読取・分割・変更報告などの機能実装を進める。

### DoD

同じ作業directoryと元basenameを渡せば保存形式を解決でき、許可後は出典付き原文と構造・内容差を取得できる。存在確認では本文を読まない。

### Tasks

- [x] `facilitate-discussion/resolve-discussion.md` と `facilitate-discussion/read-discussion.md` を作成し、同skillのSKILL.mdの入口・通常読取・書込前再読込へ接続する。
- [x] `facilitate-discussion/scripts/inspect-discussion.mjs` を実装する。resolve、各read、check、snapshot、compare、check-candidate、分割取得、終了値0／1／2を設計どおり提供し、書込みを行わない。
- [x] `facilitate-discussion/scripts/inspect-discussion.test.mjs` を作成する。10／11／12件、旧h3、引用・fence・HTML comment内の例、欠番、未完成iteration、未知形式、重複・親循環、file追加削除・解決先変更、原文chunkと分割取得、候補の差、source不変を検証する。
  > helper実測: 18case成功の後、互換修復をstatic4で再検証。phase-10-static-validation-4 / attempt4 / passed、23自己test成功/skip0、7command成功、実在53論点12file100chunkの再構成・source不変。旧15/18caseとは版を区別して消費済み。

- [x] `task-design/SKILL.md`、`task-design-work-handoff-contracts.md`、`steering/SKILL.md` の存在確認・許可後読取へ接続する。`extract-handoff-input.mjs` は変更しない。
- [x] `scripts/verification/test-task-design-handoff.mjs` を更新し、分割済みを新規と誤認しないこと、独立再構成前に本文を読まないことを確認する。旧extractorの回帰caseも維持する。
- [x] 自己testとhandoff回帰を実行し、fresh agentに一file／分割済み記録の読取を依頼する。取得不能を読了にしないことまで観測する。root READMEの検証説明へ追加commandを反映する。

## Phase 3: 長くなった議論を履歴を保って分割できる

### DoD

11件目を追加する更新で索引と5件単位の本文へ移行し、旧入口を外した後も過去の番号・順序・原文・全iterationと参照を辿れる。

### Tasks

- [x] `facilitate-discussion/split-discussion.md` を作成し、SKILL.mdから条件成立時の移行へ接続する。既存の長い記録は次の更新で対象にし、短い記録や読むだけの記録は動かさない。
- [x] Phase 2のcheck-candidateを使う候補検査、必要なhref変更の提示、元版の再確認、旧入口の最終除去、新入口からの再検査を接続する。切替中は通常提案・決定を混ぜない。
- [x] 10件の設計議論と短い通常議論・reviewを持つfixtureを作り、11件目追加後の配置・索引・link・原文保持を確認する。
- [x] 候補作成中断、元版の変更、候補本文改変、曖昧な参照、新旧共存からの再開caseを追加する。自動削除・上書き・rollbackで隠さず、一致する途中成果だけを再利用できることを独立実行で確認する。
- [x] 自己test、handoff回帰、文書・構造reviewを通し、ledgerへ原文・参照・停止・再開の保持を記録する。

> 初回独立操作で、候補作成後の通常compareが新旧共存を拒否して切替へ到達しない問題を観測したため、候補接続taskを未完へ戻した。通常gateは維持し、明示移行中だけ旧集合の直接実体/hash照合へ修復後のattempt2の02/03/15で旧入口除去と新入口検査まで再確認済み。旧sourceと観測は保持する。

## Phase 4: AIが具体化した変更を記録・報告して反映できる

### DoD

導出または明示委任の変更を受けると、通常連番で根拠と完全な変更内容を保存し、報告後の当該応答・反映・検証まで現在状態を追える。

### Tasks

- [x] `facilitate-discussion/derived-change.md` を作成する。SKILL.mdの原因判定後に四分類を接続し、通常提案は既存iteration.mdへ渡す。think-throughの標準は編集しない。
- [x] `facilitate-discussion/templates/discussion_entry.md` へ変更内容・現在の変更の部品と例を追加する。通常のfeedback形式を保ち、AI変更へ空feedbackや架空のokを作らない。
- [x] 親の未完判定とPhase 2の原文取得を接続し、未報告・応答待ち・部分反映・検証失敗・反映済みを区別する。
- [x] 通常decision、意味不変の機械適用、導出、委任のfixtureを作る。報告前、別件の応答、当該応答、訂正、新iteration、複数変更への一応答を独立実行で確認する。
- [x] 訂正で依存先だけを止め、前提が変わった問いへの回答を流用せず、同じ原文を個別の賛成へ分割しないことを検証する。文書・構造reviewと該当assertionを通す。

## Phase 5: 改善提案を元作業へ保留できる

### DoD

明示的な保留指示を受けると、作業先を切り替える前に一改善一fileで固定本文と追跡を保存し、保留指示がなければ既存の即時転送へ進む。

### Tasks

- [x] `escalate-plugin-skill-fix/pending-escalations.md` と `escalate-plugin-skill-fix/templates/pending-escalation.md` を作成し、同skillのSKILL.mdの移動前へ保留判定を接続する。
- [x] 作業内の連番・slug、固定本文・関連情報・追跡、元の議論からの参照を実装する。元作業不明時は担当へ返す。
- [x] 個別保留、作業全体の保留、指示なし、範囲不明、plugin内の作業、作業directory未確定のfixtureを作り、保存先と分岐を独立実行で確認する。
- [x] 後の訂正を固定本文へ上書きしないこと、別作業の保留や暫定動作の権限へ広げないことを検証する。文書・構造reviewと該当assertionを通す。

## Phase 6: 保留した改善提案の引き渡しを再開できる

### DoD

指定された条件で保留メモから再開すると、現在の提案を整えて既存escalationへ渡し、受領を確認した時だけ引渡し済みになる。

### Tasks

- [x] Phase 5の内部指示へ条件確認・固定本文と後発情報の併読・既存転送先の確認・受領先の記録を接続する。既存の汎用化・repository判定・steering起動を使う。
- [x] 「完了したら渡す」「完了したら聞く」「今は保留」「条件不明」、後からの保留継続・範囲変更のfixtureを作り、必要な応答と証拠を区別する。
- [x] 転送先作成後の失敗と中断復帰を独立実行で確認する。受領前は未完に保ち、同じ作業を二重起動しない。
- [x] 引渡し済みを改善済みにせず、修正・配布・導入の同期や暫定指示の自動終了を加えていないことを確認する。文書・構造reviewと該当assertionを通す。

> owner独立挙動: artifacts/phase-5/behavior-run-2/result.json、phase-5-9-owner-behavior-2 / attempt2 / passed。34case成功・source全件一致を消費済み。該当機能taskへ反映し、reviewは実施済みとして記録した。別process通し操作は別の未完taskで扱う。

## Phase 7: 作業限定の暫定指示を登録・改訂できる

### DoD

利用者の指示を登録・改訂すると、独立した一指示を一fileに保存し、原文・出典・変更前後の履歴を保つ。安定factのinstanceには混ぜない。

### Tasks

- [x] `maintenance-plugin-context/temporary-overrides.md` と `maintenance-plugin-context/templates/temporary-override.md` を作成する。同skillのSKILL.mdで安定factと暫定指示の依頼を独立して受け付ける。
- [x] 元作業・対象skill・処理・条件・現行指示・終了条件と、適用状況・実行版・変更履歴を保存する。一指示一file、作業内連番、必要時だけ作成、複数skillへの同一指示を複写しない契約を実装する。
- [x] 登録・改訂、複数skillに効く指示、元作業不明、fact依頼なし、保留メモとの相互参照のfixtureを作り、独立実行で保存内容を確認する。
- [x] 指示原文と過去の意味が消えず、配布templateや別作業へ保存されず、空fact instanceも作られないことを確認する。文書・構造reviewと該当assertionを通す。

## Phase 8: 起動・再開したskillへ実効指示を渡せる

### DoD

元作業と対象処理を渡すと、適用する指示と実行版の根拠、または指示なし・停止・取得不能の理由が返り、各skillがその結果に従う。

### Tasks

- [x] Phase 7の管理処理へ全候補の選択・競合確認・実行version照合を実装する。active／none／paused／unavailable／endedを安定factとは別節で返す。
- [x] 次の13入口と新設skill-update-review/SKILL.mdへ、起動・別session再開・resume・把握した変更時の取得を接続する。
  - doc-enricher、document-review、escalate-plugin-skill-fix、facilitate-discussion、maintenance-plugin-context、name-work-directory、share-work-in-progress
  - steering、task-design、tasklist-executor、test-runner、think-through、visual-inspector
- [x] 管理担当自身は内部処理へ進み、各consumerへ選択・競合・版の判断を複製しない。通常の返信やthink-throughの毎turn適用を定期取得へ変えない。
- [x] 同一作業再開、別作業、指示なし、読取失敗、複数指示の競合、明示置換、実行版不明、実行元とrepository最新版の違い、version更新のfixtureを作る。
- [x] 無関係な更新でも継続を毎回尋ねること、取得不能をnoneにしないこと、影響する暫定動作だけ止めることを独立実行で確認する。同一sessionの更新返却と、通知されていない編集の限界も確認する。
- [x] 全14入口の接続を一覧照合し、対象skill全体の構造reviewと文書review、該当assertionを通す。既存処理の問題で合意外の整理が必要なら設計へ戻す。

## Phase 9: 不要になった暫定指示を終了できる

### DoD

明示取下げ・指定条件・元作業完了・正式版の全面代替を根拠に終了すると、同じfileへ理由と履歴を残し、再開しても自動復活しない。

### Tasks

- [x] temporary-overrides.mdへ終了判断と記録を接続し、steeringと単独の作業担当の既存完了記録から管理担当への通知を追加する。一skill呼出しの終了は元作業の完了にしない。
- [x] 指定期限、取下げ、作業完了、中断・承認待ち、正式版の部分代替と全面代替、複数skillへの指示、後日再開のfixtureを作る。
- [x] 全面代替では追加承認なしで終了・報告し、部分代替・証拠不足は勝手に指示を分割・改訂しないことを独立実行で確認する。
- [x] 終了済みを実効指示から除外し、保留メモの引渡しだけでは終了しないことを確認する。文書・構造reviewと該当assertionを通す。


> 2026-10-25 最終: Phase1〜10の全taskは実測/記録済み。helper23自己test、owner34、議論既存18+再試行2+新規3、通しA3/B7、static4の7command、最終表記validator1command成功を消費した。旧失敗/blockedと観測限界は保持。次はPhase11利用者確認のみ。

> review実施と候補解消の区別: artifacts/phase-10/review-current-scope.mdへ全14入口・必要依存・文書の評価と内容識別を保存済み。独立した既存配置候補（steering論点53、escalateの引渡し後取込み）は未解消noteとして残すが、review未実施には戻さない。非.md互換・14/18再試行・同居fixture・通し/中断は実測結果を消費済み。再修正後は影響範囲を再reviewする。

## Phase 10: 変更一式を配布可能な内容として検証する

### DoD

全体の意味保存・呼出し接続・実行結果が根拠付きで揃い、manifestと検査の期待versionが一致する。

### Tasks

- [x] 全対象の二層ledgerを順方向・逆方向に照合する。削除・追加行と移動先を辿り、未監査0・未分類削除0・未分類追加0を記録する。状態・停止・再開・single writerを全体で確認する。
- [x] 「分割済み議論でAI変更を報告してから反映」「改善を保留し、同じ作業の暫定指示で再開」「skill更新を設計時・編集後にreviewし、結果を保存して再利用」の通しfixtureを追加し、各ownerの受渡しをfresh agentで確認する。
- [x] 現行8.0.2を確認し、新しい公開skill追加と既存入力の維持を根拠に8.1.0へ一度だけ更新する。
  - [x] plugins/tumeda-dev/.codex-plugin/plugin.jsonとplugins/tumeda-dev/.claude-plugin/plugin.jsonのversion、root .claude-plugin/marketplace.jsonのversionとtumeda-devのplugins[].version、scripts/verification/validate-plugin.mjsのexpectedReleaseを同時に揃える。別作業で現行版が変わっていれば上書きせず管理担当へ戻す。
- [x] 自己test、handoff回帰、全体validatorを実行し、失敗は原因を修正して再実行する。新scriptはnode --checkも通す。存在しないlint・formatter・UI確認taskは追加しない。
- [x] 更新したskill一式の編集後構造reviewとMarkdownのdocument-reviewを完了し、内容識別を結果へ記録する。再修正した対象は必要な再review・挙動検証を行う。
- [x] 実装・review・validationのfeedbackを、直接受領した担当がfacilitate-discussionでimplementation_review.mdへ記録する。原因・知識の所在・修正先を確認し、合意後だけ反映する。designやplan構造が変われば同じ作業のtask-designへ戻し、実装を自動再開しない。
- [x] 実装中に得た永続化候補のdoc-enricher提案と承認判断が未処理で残っていないことを確認する。

### 実行ハーネスのレビュー後修復（2026-10-25）

過去のPhase 1〜10完了記録は当時の検証範囲を示す。
利用者の修正指示を受け、次の不足を修復する。旧成功や失敗は書き換えない。
本追加範囲では、利用者指示によりskill-creator・公式validator・全体validateを使わず、対象の回帰確認と実物レビューを行う。

- [x] 実装review論点16: 分割後の親変更を同じ論理記録全体で扱う。本体修正と対応する確認を完了する。
- [x] 実装review論点17: 判断に使った読取版を保存前の比較起点として保持する。本体修正と対応する確認を完了する。
- [x] 実装review論点18: 訂正で前提が変わった別の問いの回答を再評価する。本体修正と対応する確認を完了する。
- [x] 実装review論点19: 元担当の状態遷移から保留条件の再確認へ接続する。本体修正と対応する確認を完了する。
- [x] 実装review論点20: 現在結果が欠落した終端記録を全文読取へ戻す。本体修正と対応する確認を完了する。
  > helper自己test: attempt1で24 passed / 0 failed / 1既存環境依存skip。新規2件成功。helper本体/testのhash不変を確認し、この対象結果だけを消費した。証跡: artifacts/harness-repair-20261025/test-run-1/result.md。

### 検証command

repository rootから実行する。

```sh
node --test plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.test.mjs
node scripts/verification/test-task-design-handoff.mjs
node scripts/verification/validate-plugin.mjs
node --check plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.mjs
node --check plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.test.mjs
```

> 最終案内: artifacts/phase-11/user-check-guide.md。専用demo-workと新session用3入力を準備済み。利用者への案内/依頼の実送付と実際の確認結果は、未実施のPhase11 checkboxへ残す。

## Phase 11: 利用者が新しい進め方を確認する

### DoD

新しい実体を使った代表操作を利用者が確認し、期待する記録・報告・停止になっていると判断する。

### Tasks

- [ ] repository内の更新済みSKILL.mdを明示する新しいsessionと、確認用の記録を案内する。cacheの自動更新や導入済みpluginの変更を前提にしない。
- [ ] 利用者に、議論の再開、AI変更の報告、保留・暫定指示、構造reviewの代表操作と結果の保存先を示して確認を依頼し、ここで停止する。回答前にcommit・push・PRを促したり実行したりしない。
- [ ] 実際の確認結果を記録する。feedbackがあれば直接受領した担当がimplementation_review.mdへ保存し、必要な設計差戻し・修正・再検証・再確認を完了する。feedbackがなければ、その事実を記録して本確認を完了する。

## Phase 12: 合意した変更だけを意味単位でコミットする

### DoD

動作確認済みの変更だけが、無関係な作業を含まない意味単位のlocal commitとして残る。

### Tasks

- [ ] 利用者の動作確認完了とcommit対象への許可、現在のbranchがmain以外であることを確認する。部分承認はその範囲だけを扱う。
- [ ] 次の意味単位で差分とcommit messageを確認し、重なるfileは該当するhunkだけstageする。実際の差分で分割を調整した場合は理由を記録する。
  - 設計・作業記録: `docs: plugin改善の設計と実行計画を記録`
  - 構造review: `feat(tumeda-dev): skill構造reviewを追加`
  - 議論の保存・読取・分割: `feat(tumeda-dev): 長大な議論の分割と読取を共通化`
  - AI変更: `feat(tumeda-dev): 導出変更の報告と反映を追跡`
  - 保留: `feat(tumeda-dev): 改善提案の明示保留と再開に対応`
  - 暫定指示: `feat(tumeda-dev): 作業限定の暫定指示を管理`
  - 配布metadata: `chore(tumeda-dev): 配布versionを8.1.0へ更新`
- [ ] 対象外の.steering変更、個人設定、不要な検証生成物を混ぜず、各commitの差分と実在を確認する。commit不要という回答なら、その回答を根拠に取消完了を記録する。

## Phase 13: branchとPRを共有し、結果を確認する

### DoD

実在する今回のcommitが非default branchへpushされ、同じheadのPRへ到達できる。共有した範囲を利用者が確認できる。

### Tasks

- [ ] Phase 11と12の完了、今回のlocal commitの実在、originと非default branchを確認する。commitが一件もなければ公開を実行しない。
- [ ] current branchをoriginへpushし、repository側の `scripts/for_local/github/create_or_get_pr.sh` で既存PRを取得または作成する。同じheadに重複作成せず、issueのないbranch契約に従う。
- [ ] PRのtitle・bodyを完成した四領域の変更と実施した検証に合わせ、作業記録への導線を付ける。本文を一時fileから安全に渡し、未実施の動作・releaseを完了と書かない。
- [ ] pushした範囲・PR URL・残件を報告する。ここで停止し、共有結果を利用者に確認してもらう。merge・release・installへ進まない。

## 参照と完了判定

- 設計の正本: [design.md](./design.md)。
- 完了状態・停止・再開・取消条件: tasklist-executor/SKILL.mdとruntime-execution-contracts.md。
- planの構造とreview: task-design/tasklist-design.md。
- 全taskの実測完了までcompletedを返さない。tasklistの合意待ちと、実装後のユーザー確認待ちは別である。

### Phase 1検査での差戻し記録

validation-run-1はtemplateへのledger誤書込みを検出してfailed。復元後の実物全文reviewと再検証が終わるまで作成・caller taskを未完へ戻した。過去のreview・failed resultは保持し、review-invalidation.mdで適用不可を記録した。

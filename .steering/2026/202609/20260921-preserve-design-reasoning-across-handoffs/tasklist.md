## Phase 1: 後任が既存designを見ずに独立再構成を開始できる

### DoD（完了条件）

- 既存`design.md`を入力にした時、後任へ渡るのは`元の依頼内容`と任意の`上位roadmap制約`だけであり、後続sectionはmodel contextへ入らない。
- `<working_dir>/task-design-catch-up/attempt-N.md`を、Git管理下ではignored確認後だけ作成できる。

### Tasks

- [x] `plugins/tumeda-dev/skills/task-design-work-handoff-contracts.md`を作成する
  - [x] 対象を、別agentが`task-design`の未完了design判断責任を引き継ぐcaseに限定する
  - [x] 起動gate、読取whitelist、禁止入力、bounded extraction、fail-closed、attempt採番、停止・再開、safe cleanupを一つのworkflowとして記述する
  - [x] steering固有phase、任意workflow、skill間result handoff、tasklist実行再開をscope外にする
  - [x] 既存`task-design`・`steering`のcontractを、`維持 | 拡張 | 共有referenceへ移す | scope外`へ分類するfunction migration ledgerをtasklistの実行記録へ残す
- [x] `plugins/tumeda-dev/skills/task-design/scripts/extract-handoff-input.mjs`を作成する
  - [x] file全体をstdoutへ出さず、単一の`元の依頼内容`と任意の単一`上位roadmap制約`だけを見出し境界で抽出する
  - [x] `元の依頼内容`欠落、対象見出し重複、壊れた境界、読取失敗を非zero終了にする
  - [x] summary復元、内容推測、file全体出力のfallbackを実装しない
- [x] `scripts/verification/test-task-design-handoff.mjs`を作成し、抽出behaviorを固定する
  - [x] standalone designでは元依頼だけを出力するcaseを追加する
  - [x] 子phase designでは元依頼と上位roadmap制約だけを出力するcaseを追加する
  - [x] `TL;DR`以降へ置いた禁止markerがstdoutへ現れないcaseを追加する
  - [x] 元依頼欠落、対象見出し重複、壊れた境界が非zeroになるcaseを追加する
  - [x] `node scripts/verification/test-task-design-handoff.mjs`を実行し、全caseがgreenになるまで修正する
- [x] local artifactの配置を既存索引とignore sampleへ接続する
  - [x] `plugins/tumeda-dev/skills/README.md`から共有referenceの責務とconsumerを辿れるようにする
  - [x] `plugins/tumeda-dev/skills/steering/.gitignore.sample`へsteering標準配置の`task-design-catch-up/`だけをignoreするpatternを追加する
  - [x] standalone working directoryでは`git check-ignore`不成立時に作成せず停止するcontractを共有referenceへ記述する

### 各task詳細

#### bounded extraction

`extract-handoff-input.mjs`はcatch-up前に`design.md`へ触れる唯一の入口とする。正常系だけでなく、禁止marker非露出とfail-closedをtestで観測する。scriptが出力した内容を再加工してdesign結論を補う別経路は作らない。

#### attempt directory

attemptは一回のcatch-upだけに必要なflow情報であり、canonical成果物にしない。削除前にはworking directory直下のexact path、非symlink、`attempt-[0-9]{3}.md`以外のentryがないことを検証する。予期しないentryがあれば削除しない。

### 実行記録: function migration ledger

| 既存contract / function | 分類 | 反映先と扱い |
| --- | --- | --- |
| `task-design`による`working_dir`解決とcanonical成果物の配置 | 維持 | `task-design/SKILL.md`のPrepareStep 2を維持し、確定直後にhandoff gateを接続する |
| `task-design`の新規design、同一実行の継続、discussion復帰 | 維持 | 既存design workflowを維持し、ownershipが連続するcaseではcatch-upを再起動しない |
| 新しい`task-design`が既存designを再開する入口 | 拡張 | canonical本文を読む前のcatch-up gate、共有reference、bounded extractorをconsumer側へ追加する |
| catch-upの順序、読取境界、attempt lifecycle、completion validation | 共有referenceへ移す | `task-design-work-handoff-contracts.md`だけを正本にし、consumerへ判断基準を複製しない |
| `steering`が同じworking directoryで`task-design`を起動・再開するrouting | 拡張 | 既存Step 2を維持し、既存designの引き継ぎも同じdirectoryの`task-design`へ渡すことを明記する |
| `steering`がdesign内容を設計または重複reviewしない境界 | 維持 | catch-up要否・再構成・完了判断も`task-design`へ委ねる |
| steering固有phase、任意workflow、skill間result handoff、tasklist実行再開 | scope外 | 共有referenceを適用せず、既存ownerと既存contractを変更しない |

未分類削除: zero。未分類追加: zero。

## Phase 2: task-designがcatch-up完了後だけ既存topicへ復帰できる

### DoD（完了条件）

- 新しく起動した`task-design`が既存designを引き受けると、独立再構成、正本との差分解消、current-state coverage、digest再確認を順に通り、未分類差分と未解消疑義がzeroの場合だけexactなtopicへ復帰する。
- `steering`はdesign phaseを同じworking directoryの`task-design`へroutingするだけで、catch-upの判断基準を重複所有しない。

### Tasks

- [x] `plugins/tumeda-dev/skills/task-design/SKILL.md`を共有contractのconsumerへ変更する
  - [x] working directory確定直後、正本本文を読む前にcatch-up gateを評価する
  - [x] 新規design、同じtask-design実行の継続、ownership不明のcaseをdesignどおり分岐する
  - [x] `task-design`と`think-through`、適用標準、repository固有指示、bounded extraction、working directory外の通常調査を独立再構成の入力にする
  - [x] 既存attemptがある別task-designは本文を読まず次の連番を選び、同じtask-design実行の再開だけ同じattemptを続ける
  - [x] current design、全decision、activeまたは停止中topicのcoverage表と四分類を必須にする
  - [x] `正本へ疑義あり`とdesignへ影響する新規TBDを`facilitate-discussion`へroutingし、解消までcatch-up未完了にする
  - [x] canonical file digestが変化した場合、独立再構成を維持して最新正本との差分解消へ戻す
  - [x] completion後だけattempt directoryを安全に削除し、exactなactive topicと一問へ復帰する
- [x] `plugins/tumeda-dev/skills/steering/SKILL.md`のroutingを更新する
  - [x] 既存designを引き継ぐdesign phaseは、同じworking directoryの`task-design`へ渡す
  - [x] steering自身がdesignを読み、catch-up要否、再構成内容、完了を判断しない
  - [x] steering固有phaseの引き継ぎへ共有contractを一般化しない
- [x] `scripts/verification/test-task-design-handoff.mjs`へconsumer contract testを追加する
  - [x] `task-design`がworking directory確定後、canonical本文読取前に共有referenceとextractorを通ることを静的に検証する
  - [x] `steering`がdesign phaseをroutingし、共通validationを重複定義しないことを検証する
  - [x] current-state coverage、四分類、digest再確認、safe cleanupが共有referenceに存在することを検証する
  - [x] `node scripts/verification/test-task-design-handoff.mjs`を実行し、全caseがgreenになるまで修正する
- [x] consumerと共有referenceの責務重複をwhite-box reviewする
  - [x] 共通の順序、読取境界、attempt lifecycle、完了validationは共有referenceだけが所有する
  - [x] `task-design`には入口、入力解決、既存workflowへの復帰だけが残る
  - [x] `steering`にはdesign phaseのroutingだけが残る
  - [x] migration ledgerの未分類削除・未分類追加がzeroであることを確認する
- [x] 変更したMarkdownへ`document-review`を適用し、作成時・更新時・workflow固有観点の指摘を修正する

### 各task詳細

#### completion gate

全iteration・全発話の再演は要求しない。現在有効なdesign、各decisionの問題・採用判断・主要な棄却理由、各未決topicの現在案・依存・次の一問をcoverage対象にする。attempt fileの存在や後任の自己申告だけでは完了にしない。

## Phase 3: 隔離fixtureで引き継ぎbehaviorを実測する

### DoD（完了条件）

- repository差分を増やさないtemporary fixtureとfresh Codex processで、禁止入力非露出、未完了attemptの分離、ignore不成立時の停止、完了後cleanup、exact topic復帰を観測できる。

### Tasks

- [x] `mktemp -d`で各caseを分離したfixture rootを作る
  - [x] local plugin sourceを明示参照し、repository内へfixtureを作らない
  - [x] 元依頼、上位制約、禁止marker、decision、active topicを持つ最小の既存design bundleを用意する
- [x] fresh `codex exec --ephemeral --sandbox workspace-write`で独立再構成前半をsmoke testする
  - [x] 正本後続sectionの禁止markerがattemptの独立再構成部分へ現れないことを確認する
  - [x] ignoredでないfixtureではattemptを書かず停止することを確認する
- [x] 未完了attemptを別task-designが引き継ぐcaseをsmoke testする
  - [x] `attempt-001.md`本文にtrapを置き、次のfresh processが独立再構成前に読まず`attempt-002.md`を選ぶことを確認する
  - [x] 正本読取後の差分解消段階では過去attemptを参照できることを確認する
- [x] catch-up完了caseをsmoke testする
  - [x] current decisionとactive topicのcoverage、四分類、exactな次の一問が成立することを確認する
  - [x] 完了後に`task-design-catch-up/`だけが削除され、canonical fileが仮説で上書きされないことを確認する
- [x] smoke結果をtasklistへ記録し、temporary fixtureを安全に後片付けする
  - [x] cleanup対象が`mktemp -d`で得たexact pathであることを確認する
  - [x] plugin sourceと既存steering成果物にfixture由来差分がないことを確認する

## Phase 4: 配布metadataとrepository validationを完成させる

### DoD（完了条件）

- handoff contract、consumer、helper、test、README、ignore sampleがrepository validatorで検証され、version宣言4箇所と`expectedRelease`が`8.0.1`で一致する。
- extraction test、plugin validator、JavaScript syntax check、diff checkがすべてgreenになる。

### Tasks

- [x] `scripts/verification/validate-plugin.mjs`へ静的contract検証を追加する
  - [x] 共有reference、extractor、test scriptを必須pathとportable fileへ追加する
  - [x] `task-design`と`steering`のconsumer接続、ignore pattern、README索引を検証する
  - [x] scope外のsteering固有phaseへcontractが拡張されていないことを検証する
- [x] 配布versionを`8.0.1`へPATCH bumpする
  - [x] `plugins/tumeda-dev/.codex-plugin/plugin.json`を更新する
  - [x] `plugins/tumeda-dev/.claude-plugin/plugin.json`を更新する
  - [x] `.claude-plugin/marketplace.json`のroot versionとplugin entry versionを更新する
  - [x] `scripts/verification/validate-plugin.mjs`の`expectedRelease`を更新する
- [x] repository全体のvalidationを実行し、error zeroまで修正・再実行する
  - [x] `node --check plugins/tumeda-dev/skills/task-design/scripts/extract-handoff-input.mjs`を実行する
  - [x] `node --check scripts/verification/test-task-design-handoff.mjs`を実行する
  - [x] `node --check scripts/verification/validate-plugin.mjs`を実行する
  - [x] `node scripts/verification/test-task-design-handoff.mjs`を実行する
  - [x] `node scripts/verification/validate-plugin.mjs`を実行し、`plugin validation passed`を確認する
  - [x] `git diff --check`を実行する
  - [x] test実行後に`test-runner`を適用し、失敗原因またはgreen結果を記録する
- [x] 最終`document-review`を実行する
  - [x] 新規共有referenceへ作成時観点、更新したskill・READMEへ更新時観点、workflow文書へcase別観点を適用する
  - [x] designの全deliverableとtasklistのtaskを正方向に照合し、欠落がzeroであることを確認する

## Documentation reviewと実装後振り返り

- [x] code readingまたは実装で永続化候補を得た場合、その場で`doc-enricher`を提案modeで適用する
  - [x] 提案がある場合だけユーザー承認後に既存READMEまたは既存docsへ反映する（初回はdiscussionへの経緯保存だけを決定し、再開後の明示承認を受けてrepository rootの`README.md`へ反映）
  - [x] 提案・承認判断を別taskへ先送りしない
- [x] 実装、review、validationからfeedbackまたは実装とのずれが生じた場合、直接受領したworkflow ownerが`facilitate-discussion`を`implementation_review.md`へ適用する
  - [x] `discussion_directory=<working_dir>`と`discussion_file_name=implementation_review.md`を渡す
  - [x] 原文、関連する実装・design・plan、原因、採用方針、決定を保存する
  - [x] ~~designまたはplan構造が変わる場合は同じworking directoryでtask-designへ戻す~~（decision再開後にREADMEを更新したが、design・plan構造の変更なし）
  - [x] review後に実装を自動再開しない（初回decision後は「続けて」、再開decision後は「readme更新して良いよ。pushもマージもして良い」の明示指示を受けて再開）

---

## 動作確認

### DoD

- ユーザーが変更後contract、smoke結果、version `8.0.1`を確認し、別sessionのtask-design引き継ぎで意図した順序と完了gateになると判断する。

### Tasks

- [x] ユーザーへ、共有reference、`task-design`と`steering`の接続、extractor test、behavior smoke結果を提示して動作確認を依頼する
- [x] feedbackがあれば、直接受領したworkflow ownerが`facilitate-discussion`を`implementation_review.md`へ適用し、decisionをcallerへ返す
  - [x] ~~designまたはplan構造が変わる場合は同じworking directoryでtask-designへ戻す~~（decision再開後にREADMEを更新したが、design・plan構造の変更なし）
  - [x] ~~feedbackがなければ`[x] ~~feedback収集~~（feedbackなし）`の形式で完了扱いにする~~（feedbackあり。初回のREADME非反映decisionと、再開後のREADME反映decisionを`implementation_review.md`へ保存）

---

## Phase 5: 作業branchをpushしてmainへ取り込む

> ⚠️ 動作確認phaseが完了するまでcommit、push、mainへの取り込みを促したり実行したりしない。急かすことも禁止する。

> ⚠️ このphaseは作業の外へ残るactionを含む。remoteへpushしたbranchと`main`は、local作業を破棄しても残る。repository contextに追加の差し込み宣言はないため、下記の実測確認と停止を行う。

### DoD（完了条件）

- 作業branchが`origin`へpushされ、今回の変更が`main`へ取り込まれ、`origin/main`と一致する。
- merge後の`main`でplugin validatorがgreenになり、各remote refとcommitから取り込み済み範囲を再確認できる。

### Tasks

- [ ] commit（phase単位かつ意味単位で分割）
  - [x] `design.md`、`task-design-discussion.md`、合意済み`tasklist.md`を実装変更より前のcommitにする（`788757b`）
  - [x] Phase 1の共有contract・extractor・test・ignore・READMEを意味単位でcommitする（`02e584e`）
  - [x] Phase 2のconsumer接続をPhase 1と別commitにする（`dbbef49`）
  - [x] Phase 4のvalidator・version bumpを別commitにする（`97ca335`）
  - [x] checkbox確定済み`tasklist.md`を実装変更より後のcommitにする（`16524d6`）
  - [ ] README反映の最終decision、`implementation_review.md`のdecision再開記録、tasklistの状態同期を意味単位でcommitする
  - [x] ~~ユーザーが一部だけ承認した場合は承認範囲だけをcommitし、残りは待つ~~（全体承認のため該当なし）
  - [x] ~~ユーザーが不要と回答した場合は`[x] ~~commit~~（ユーザーが不要と回答）`の形式で完了扱いにする~~（ユーザーが実行を承認したため該当なし）
- [ ] 作業branchをpushして`main`へ取り込む
  - [ ] commit taskの結果としてlocal commitが一件以上存在することを確認する。一件もなければ以降を実行しない
  - [ ] 作業branch`20260921-preserve-design-reasoning-across-handoffs`を`origin`へpushする
  - [ ] `main`へ切り替える
  - [ ] remote更新を確認し、作業branchを`main`へ安全にmergeする。競合または想定外の進行があれば停止する
  - [ ] merge後に`node scripts/verification/validate-plugin.mjs`を再実行する
  - [ ] `main`を`origin`へpushする
- [ ] ここで作業を停止し、作業branchと`origin/main`のcommit、merge結果、validator結果をユーザーへ提示して確認を得る。次phaseへは進まない

---

## 参照

- 設計の正本: 同じdirectoryの`./design.md`
- 完了条件、取消完了、subtask分割、checkbox更新timingの正本: `tasklist-executor/SKILL.md`
- tasklist掲載範囲の正本: `task-design/tasklist-design.md`
- plugin version規約とGit運用: `.agents/skills/tumeda-dev-plugin-context.md`
- escalation後の取り込み順序: `escalate-plugin-skill-fix/SKILL.md`

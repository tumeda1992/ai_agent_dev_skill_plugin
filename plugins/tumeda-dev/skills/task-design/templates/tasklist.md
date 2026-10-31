## Phase 1: {一つの利用者操作または成果状態}

### DoD（完了条件）

- {一つの操作として実測できる完了条件}

### Tasks

- [ ] {task 1}
  - [ ] {subtask 1-1}
  - [ ] {変更挙動を担保するtestの作成・変更}
  - [ ] {testのgreen確認}
  - [ ] {UI変更時だけvisual-inspectorによる確認}

- [ ] {task 2}
  - [ ] {subtask 2-1}
  - [ ] {subtask 2-2}

<!-- commit taskを生成する条件（local Git運用条件の記載、またはユーザーのcommit要求）を満たす時だけ、次のtaskを各phaseの末尾に置く。条件を満たさない場合はtaskを残さない。 -->

- [ ] このphaseの差分をlocalでcommitする（DoDの確認の後。pushしない）
  - MUST: 複数phaseをまとめて一commitにしない
  - 同一phase内でも意味的に異なる変更を分割する
    - 例: DB migration、domain model、GraphQL、frontendは別commit
  - ユーザーが不要と回答した場合は`[x] ~~commit~~（ユーザーが不要と回答）`の形式で完了扱いにする

### 各task詳細

#### {task 1}

##### {subtask 1-1}

{対象file、変更内容、依存、確認方法}

## Phase 2: {一つの利用者操作または成果状態}

### DoD（完了条件）

- {一つの操作として実測できる完了条件}

### Tasks

- [ ] {task 1}
  - [ ] {subtask 1-1}
  - [ ] {変更挙動を担保するtestの作成・変更}
  - [ ] {testのgreen確認}
  - [ ] {UI変更時だけvisual-inspectorによる確認}

- [ ] このphaseの差分をlocalでcommitする（DoDの確認の後。pushしない。規則はPhase 1と同じ）

### 各task詳細

#### {task 1}

##### {subtask 1-1}

{対象file、変更内容、依存、確認方法}

## Phase 3: 品質checkと修正

### DoD（完了条件）

- 全testがgreen
- repository contextで許可されたrepository全体のlint・static analysis・format checkにerrorがない
- UI変更がある場合、最終screenshotで見た目を目視確認済み

> ⚠️ screenshot確認は最後にまとめて行うものではない。UIへ変更を加えた各phaseのDoDにscreenshot確認を含める。このphaseでは全体の最終確認だけを行い、phase内確認を代替しない。

### Tasks

- [ ] 全test実行
  - [ ] すべてgreenであることを確認する

- [ ] lint実行（新規file）
  - [ ] 新規fileに対してlintを実行する
  - [ ] errorがあれば修正して再実行する
  - [ ] error zeroを確認する

- [ ] repository contextが全体lint commandを返した場合だけ、repository全体のlint・static analysis・format checkを実行する
  - [ ] 返された全体commandを実行する
  - [ ] 新規codeが既存codeへ与えた影響を確認する
  - [ ] errorがあれば修正して再実行する
  - [ ] error zeroを確認する

- [ ] UI変更がある場合だけ、最終screenshotで見た目を目視確認する
  - [ ] pluginの`visual-inspector` skillをchildとして使いscreenshotを撮る
  - [ ] 全体のdesign・layoutが意図どおりか確認する
  - [ ] 問題があれば修正して再確認する
  - ⚠️ `npx playwright`またはPlaywright toolを直接呼ばない。必ずpluginの`visual-inspector` skillを使う。

- [ ] 品質checkで直した差分があればlocalでcommitする（commit taskを生成する時だけ）

## 汎用skillを新設・更新する場合のreview

<!-- 対象skillがある場合だけ、該当する実装phaseのtask・DoDへ以下を組み込む。対象外ならこのsectionを生成しない。 -->

- [ ] skill-creatorによる編集後・DoD判定前に`skill-update-review`を明示適用する
  - [ ] 実物全体・構造案・保持要件・更新前後の比較元・先行指摘・元作業と返却先を渡す
  - [ ] 結果を既存の検証記録または実装reviewへ保存し、保存先・対象箇所・内容識別を残す
  - [ ] 使用前・再開時にも内容・必要依存・file集合・参照・解決先を照合する
  - [ ] 不合格・材料不足・影響不明があれば修正・追加確認・必要な全体再reviewを行い、未解消のままDoDを完了しない
  - [ ] 設計時の合格を編集後へ流用せず、document-review・機能・安全・独立した動作検証・利用者確認を維持する

## Documentation reviewと実装後振り返り

- [ ] code readingまたは実装で永続化候補を得た場合、その場でdoc-enricherを提案modeで適用する
  - [ ] 提案がある場合だけユーザー承認後に既存READMEまたは既存docsへ反映する
  - [ ] 提案・承認判断を別taskへ先送りしない
- [ ] 実装、review、validationからfeedbackまたは実装とのずれが生じた場合、直接受領したworkflow ownerがpluginの`facilitate-discussion`を`implementation_review.md`へ適用する。特定の`steering` callerへ固定しない
  - [ ] `discussion_directory=<working_dir>`と`discussion_file_name=implementation_review.md`を渡す
  - [ ] 原文、関連する実装・design・plan、原因、採用方針、決定を渡し、修正済みでも記録を省略しない
  - [ ] 「共有されていなかった知識の前提は何か」を確認する
  - [ ] 「codeを読めば分かるか、設計意図か、process不足か」を確認する
  - [ ] 「どこに書けば次回この議論が不要になるか」を確認し、合意後だけ反映する
  - [ ] decisionをcallerへ返し、designまたはplan構造が変わる場合は同じworking directoryでtask-designへ戻す
  - [ ] review後に実装を自動再開しない

---

## 動作確認

### DoD

Tasks に挙げた確認をユーザーが行い、期待どおりであることを確認した。

### Tasks

- [ ] ユーザーに動作確認を依頼する（{どの操作をしてもらい、何を観測できれば満たすか}）
  - [ ] 直すところが出たら、pushの前に該当phaseのcommitをlocalで直す（commit taskを生成した時だけ）
- [ ] feedbackがあれば、直接受領したworkflow ownerがpluginの`facilitate-discussion`を`implementation_review.md`へ適用し、decisionをcallerへ返す
  - [ ] designまたはplan構造が変わる場合は同じworking directoryでtask-designへ戻す
  - [ ] feedbackがなければ`[x] ~~feedback収集~~（feedbackなし）`の形式で完了扱いにする

---

## 完了後のaction

> ⚠️ 動作確認phaseが完了するまでpush、PRを促したり実行したりしない。急かすことも禁止する。

<!-- GitHub公開条件が返され、tasklistに実行可能なcommit taskが一件以上あり、current branchが公開可能なnon-default branchの場合だけ、次のsectionを生成する。条件を満たさない場合はsection自体をtasklistへ残さない。 -->

- [ ] current branchをpushしてPRを作成する
  - [ ] commit taskの結果としてlocal commitが実際に一件以上あることを確認する。一件もなければpush・PRを実行しない
  - [ ] current branchが公開可能なnon-default branchであることを確認する
  - [ ] `git push -u origin <current-branch>`を実行する
  - [ ] pluginのskills directory配下にある `scripts/github/create_or_get_pr.sh` を実行する
    - pathの起点はpluginのskills directoryである。利用先repositoryからの相対pathではない
    - このscriptは`gh pr create`のwrapperではない。同じhead branchのopen PRがあれば新規作成せずそのURLを返し、repositoryが`feature-<issue番号>`契約を宣言していればbranch名からissue番号を導いてPR bodyへ`Closes #<番号>`を入れる
    - `--title`と`--body`を渡すとissueからの導出は行われない。issueへ紐づける場合はbody側へ明示する

---

## 参照

- 設計の正本: 同じdirectoryの `./design.md`
- 完了条件、取消完了、subtask分割、checkbox更新timingの規則の正本: `tasklist-executor/SKILL.md`
- tasklistへ載せるtaskの範囲の正本: `task-design/tasklist-design.md`

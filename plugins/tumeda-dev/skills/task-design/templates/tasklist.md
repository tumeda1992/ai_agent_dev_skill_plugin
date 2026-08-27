# タスクリスト

## 設計参照

- `./design.md`

## 🚨 タスク完全完了の原則

**このfileの全taskが完了するまで作業を継続すること**

### 必須rule

- **すべてのtaskを`[x]`にすること**
- 「時間の都合により別taskとして実施予定」は禁止
- 「実装が複雑すぎるため後回し」は禁止
- host・tool・外部環境が動かないことを理由に完了扱いにすることは禁止
- 未完了task（`[ ]`）を残したまま`completed`を返さない

### 実装可能なtaskだけを計画

- 計画段階で実装可能なtaskだけをlistする
- 「将来やるかもしれないtask」は含めない
- 「検討中のtask」は含めない
- 未解消のTBDまたは実装者が決める設計判断は含めない

### taskの取消完了が許可される唯一のcase

合意済みplanの変更によって元taskが不要または別実装へ置換された場合だけ取消完了にできる。

- 実装方針の変更により機能自体が不要になった
- architecture変更により別の実装方法へ置き換わった
- 依存関係の変更により元taskが不要または実行不能になった
- ユーザーがplan変更としてscopeから除外した

取消時は合意と具体的理由を必ず記録する。

```markdown
- [x] ~~task名~~（合意済みplan変更により不要: 具体的な理由）
```

時間不足、難しさ、host停止、tool制限、外部環境未準備は取消理由にしない。これらの場合は`[ ]`を維持し、停止・再開状態を返す。

### taskが大きすぎる場合

- taskを着手可能なsubtaskへ分割する
- 分割したsubtaskをこのfileへ追加する
- subtaskを一つずつ完了させる

### tasklistの更新timing（必須）

- **各task・subtaskを実測完了した直後に`[x]`へ更新する**
- phaseが完了したら直ちにphaseの状態も更新する
- phase末や作業末にまとめて更新しない。最後にまとめて更新することは禁止

---

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

ユーザーが実際に機能または契約を使い、意図どおりであることを確認した。

### Tasks

- [ ] ユーザーに動作確認を依頼する
- [ ] feedbackがあれば、直接受領したworkflow ownerがpluginの`facilitate-discussion`を`implementation_review.md`へ適用し、decisionをcallerへ返す
  - [ ] designまたはplan構造が変わる場合は同じworking directoryでtask-designへ戻す
  - [ ] feedbackがなければ`[x] ~~feedback収集~~（feedbackなし）`の形式で完了扱いにする

---

## 完了後のaction

> ⚠️ 動作確認phaseが完了するまでcommit、push、PRを促したり実行したりしない。急かすことも禁止する。

<!-- local Git運用条件が返された場合、またはユーザーがcommitを明示要求した場合だけ、次のsectionを生成する。条件を満たさない場合はsection自体をtasklistへ残さない。 -->

- [ ] commit（phase単位かつ意味単位で分割）
  - MUST: まとめて一commitにしない
  - phaseごとに別commitにする
  - 同一phase内でも意味的に異なる変更を分割する
    - 例: DB migration、domain model、GraphQL、frontendは別commit
  - ユーザーが一部だけ承認した場合は承認範囲だけをcommitし、残りは待つ
  - ユーザーが不要と回答した場合は`[x] ~~commit~~（ユーザーが不要と回答）`の形式で完了扱いにする

<!-- GitHub公開条件が返され、tasklistに実行可能なcommit taskが一件以上あり、current branchが公開可能なnon-default branchの場合だけ、次のsectionを生成する。条件を満たさない場合はsection自体をtasklistへ残さない。 -->

- [ ] current branchをpushしてPRを作成する
  - [ ] commit taskの結果としてlocal commitが実際に一件以上あることを確認する。一件もなければpush・PRを実行しない
  - [ ] current branchが公開可能なnon-default branchであることを確認する
  - [ ] `git push -u origin <current-branch>`を実行する
  - [ ] pluginのskills directory配下にある `tasklist-executor/scripts/github/create_or_get_pr.sh` を実行する
    - pathの起点はpluginのskills directoryである。利用先repositoryからの相対pathではない
    - このscriptは`gh pr create`のwrapperではない。同じhead branchのopen PRがあれば新規作成せずそのURLを返し、repositoryが`feature-<issue番号>`契約を宣言していればbranch名からissue番号を導いてPR bodyへ`Closes #<番号>`を入れる
    - `--title`と`--body`を渡すとissueからの導出は行われない。issueへ紐づける場合はbody側へ明示する

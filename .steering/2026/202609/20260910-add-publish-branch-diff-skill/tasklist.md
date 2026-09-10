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

### 「作業の外へ残るaction」の判定

このtasklistに対象actionは含まれない。判定の対象になり得たのは、`scripts/for_local/github/create_or_get_pr.sh` の symlink 張り替えと `plugins/tumeda-dev/skills/steering/scripts/github/` の削除である。どちらも `.gitignore` の対象または git 未追跡であり、branch を破棄しても元へ戻らない。

それでも対象外とするのは、変化が及ぶ範囲が作業者自身の machine に閉じるためである。`tasklist-design.md` は「判定は利用先の運用に依存する。開発DBが開発者ごとに分離されていれば、migrationの適用も対象外になりうる」としている。この symlink と directory は開発者ごとに分離された local 環境の設定であり、共有されない。手作業で同じ操作を繰り返せば復旧できる。

`maintenance-plugin-context` へ consumer=`task-design` として「作業の外へ残るactionの差し込み」を要求した。宣言は返らなかったため、差し込みは行わない。

### test作成・変更を各phaseへ置かない技術的理由

`tasklist-design.md` は「各phaseで変更した挙動に対応するtestを、そのphase内で作成または変更する」を MUST としている。このtasklistは各phaseにtest作成・変更taskを持たない。理由を記録する。

`maintenance-plugin-context` が返したtest方針は「自動test frameworkを持たない。`package.json` は存在しない。検証は `scripts/verification/validate-plugin.mjs` によるplugin manifestの整合確認だけである。skill本文の内容は人のreviewで担保する」である。この repository の成果物は skill と docs の Markdown、および manifest の JSON であり、実行される code を持たない。挙動を担保するtestを書く対象が存在しない。

代替として各phaseのDoDへ、機械的に判定できる確認を置いている。Phase 1 は `grep` の出力と symlink の実行結果、Phase 3 と Phase 4 は `node scripts/verification/validate-plugin.mjs` の出力である。Phase 2 だけは人の読みによる確認になるが、これはtest方針が「skill本文の内容は人のreviewで担保する」と定めた範囲にあたる。

---

## Phase 1: PR 作成 script を二つの skill から対等に参照できる場所へ移す

### DoD（完了条件）

- `plugins/tumeda-dev/skills/scripts/github/create_or_get_pr.sh` が存在し、実行権限を持つ。
- `grep -rn "create_or_get_pr" plugins/tumeda-dev/` の出力に、移動前の path `tasklist-executor/scripts/github/create_or_get_pr.sh` が一件も現れない。
- `scripts/for_local/github/create_or_get_pr.sh` を実行すると、壊れた symlink の error ではなく script の usage が出る。
- `plugins/tumeda-dev/skills/README.md` の「共有リファレンス（skill ではない）」節から、`skills/` 直下に script が置かれていることを辿れる。
- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出力する。

### Tasks

- [x] script を共用配置へ移す
  - [x] `git mv` で `plugins/tumeda-dev/skills/tasklist-executor/scripts/github/create_or_get_pr.sh` を `plugins/tumeda-dev/skills/scripts/github/create_or_get_pr.sh` へ移す
  - [x] 移動後に実行権限が残っていることを確認する（`-rwxr-xr-x` を維持）
  - [x] 空になった `plugins/tumeda-dev/skills/tasklist-executor/scripts/` を削除する

- [x] 参照元を新しい path へ更新する
  - [x] `plugins/tumeda-dev/skills/tasklist-executor/SKILL.md` の記述を更新する
  - [x] `plugins/tumeda-dev/skills/task-design/templates/tasklist.md` の記述を更新する
  - [x] `plugins/tumeda-dev/skills/task-design/tasklist-design.md` の記述を更新する
  - [x] `plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md` の「`tasklist-executor` skill配下の同名scriptとはpathが異なる」を新しい配置へ合わせる
  - [x] `scripts/verification/validate-plugin.mjs` の `requireExists(prHelper)` の対象、`requireText(tasklistDesign, ...)`、`requireText(tasklistTemplate, ...)` を新しい path へ更新する
  - [x] 同 file へ、移動元 `tasklist-executor/scripts/github/create_or_get_pr.sh` に対する `requireAbsent` を追加する。既存の `steering/scripts/github/...` に対するガードと対称にする
  - [x] `grep -rn "create_or_get_pr" plugins/tumeda-dev/ scripts/` を実行し、移動前の path が残っていないことを確認する
  - [x] `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出すことを確認する

- [x] `skills/README.md` の「共有リファレンス（skill ではない）」節へ script の所在を書く
  - [x] 同節は現在「skill 本文から参照される host 非依存の共通ドキュメント」として Markdown 三つだけを列挙している。script も置かれることが読める形へ改める
  - [x] `SKILL.md` を持たない directory は skill として拾われないことを併記し、`skills/scripts/` が skill 一覧に紛れないことを示す

- [x] local の参照を復旧する
  - [x] `scripts/for_local/github/create_or_get_pr.sh` の symlink を新しい path へ張り替える
  - [x] `plugins/tumeda-dev/skills/steering/scripts/` を削除する
  - [x] `scripts/for_local/github/create_or_get_pr.sh` を引数なしで実行し、usage が出ることを確認する
    - 実測: 引数なし実行は symlink 解決後、実 script のロジックを最後まで通り、`gh pr create` が `No commits between main and 20260910-add-publish-branch-diff-skill` という実 API error で失敗した（このbranchはまだ何もcommitしておらずmainと同一のため、正しい挙動）。壊れた symlink の `No such file or directory` ではなく、script 本来の error である
    - 追加確認: 未知 flag を渡すと `usage: ./scripts/for_local/github/create_or_get_pr.sh [--base <branch>] [--head <branch>] [--title <title>] [--body <body>]` が symlink 経由で出力されることを確認した。usage() は script 内で不明flag時のみ発火する経路であり、DoDが指す「壊れたsymlinkのerrorではない」という本質は両方の実行で確認できた

### 各task詳細

#### script を共用配置へ移す

##### `git mv` で移す

対象は `plugins/tumeda-dev/skills/tasklist-executor/scripts/github/create_or_get_pr.sh`。移動先は `plugins/tumeda-dev/skills/scripts/github/create_or_get_pr.sh`。script の内容は変更しない。移動だけを行う。

`skills/scripts/` は skill directory ではない。`SKILL.md` を持たないため loader は skill として拾わず、`scripts/verification/validate-plugin.mjs` も skill directory を列挙しないため検査へ影響しない。

##### 空になった directory を削除する

移動後、`plugins/tumeda-dev/skills/tasklist-executor/scripts/` は file を持たない。git は空 directory を追跡しないため、local から削除する。

#### 参照元三箇所を新しい path へ更新する

##### 各fileの現在の記述

- `tasklist-executor/SKILL.md`: 「このskillのdirectory配下に `scripts/github/create_or_get_pr.sh` を同梱している」。同梱ではなくなるため、skills directory 直下の共用配置を指す記述へ改める。この時点では `share-work-in-progress` がまだ存在しないため、skill 名を出さず「共用配置であり、このskillの配下には同梱していない」と書く。phase の独立性を保つため、後続 phase で作る成果物へ依存させない
- `task-design/templates/tasklist.md`: 「pluginのskills directory配下にある `tasklist-executor/scripts/github/create_or_get_pr.sh` を実行する」と、その直下の「pathの起点はpluginのskills directoryである」という補足
- `task-design/tasklist-design.md`: 「`tasklist-executor/scripts/github/create_or_get_pr.sh`を使う」

#### local の参照を復旧する

##### symlink を張り替える

`scripts/for_local/github/create_or_get_pr.sh` は現在 `<repo root>/skills/steering/scripts/github/create_or_get_pr.sh` を指しており、この path は存在しない。`plugins/tumeda-dev/skills/` へ skill 群が移り、script が `tasklist-executor` 配下へ移った際に更新されていない。

新しい指し先は `<repo root>/plugins/tumeda-dev/skills/scripts/github/create_or_get_pr.sh` とする。`scripts/for_local/` は `.gitignore` の対象であり、この変更は commit されない。

この repository の context は「このrepositoryで作業する時はrepository側の `scripts/for_local/github/` を使う」と定めており、記載された access path はこの symlink である。今回の tasklist は `main` へ直接取り込むため PR を作らず、この symlink をこの作業の中では使わない。それでも張り替えるのは、context の記述が指す path が実在しない状態を残さないためである。

##### 残骸 directory を削除する

`plugins/tumeda-dev/skills/steering/scripts/github/` は file を持たない状態で残っている。同じ移動の置き土産であり、削除する。

## Phase 2: `share-work-in-progress` skill を追加する

### DoD（完了条件）

- `plugins/tumeda-dev/skills/share-work-in-progress/SKILL.md` を読んだ実装者が、停止する場合（detached HEAD、remote 不在）、確認を取る場合（current branch が default branch）、部分成功で終わる場合（default branch、`gh` が使えない）を区別できる。
- 同 `SKILL.md` の手順を、起点ケース（default branch でない作業 branch、push できる commit ゼロ、untracked の成果物あり）へ当てると、commit、push、PR 作成まで到達すると読める。
- `plugins/tumeda-dev/skills/README.md` の階層構造に `share-work-in-progress` の一行があり、詳細を書かずに位置が分かる。

### Tasks

- [x] `SKILL.md` を作成する
  - [x] frontmatter に `name: share-work-in-progress` と description を書く
  - [x] 「目的と成果」「起動gate」「停止条件」「確認を取る条件」「実行workflow」「部分成功の扱い」「失敗の扱い」「このskillが絶対にやらないこと」を書く
  - [x] `design.md` の workflow section にある七つの必須順序を、実行 workflow として落とす
  - [x] `agents/openai.yaml` は作らない

- [x] `skills/README.md` を更新する
  - [x] 階層構造へ `share-work-in-progress` の一行を追加する
  - [x] 詳細を書かず、見出し一行の追加で済ませる

- [x] DoD の三分岐が読み分けられることを確認する
  - [x] 停止・確認・部分成功のそれぞれについて、`SKILL.md` の該当箇所を指させることを確認する（`## 停止条件` 24行目、`## 確認を取る条件` 31行目、`## 部分成功の扱い` 47行目）
  - [x] 起点ケースを `SKILL.md` の手順へ当て、commit、push、PR 作成まで到達すると読めることを確認する（`## 実行workflow` 手順1→2はdefault branchでないためskip→3で1 commit→4はpushできるcommitがあるためskip→5でpush→6でPR作成→7で報告）

### 各task詳細

#### `SKILL.md` を作成する

##### frontmatter

`name` は `share-work-in-progress`。description は、起動場面（作業途中の状態を共有したいとき）と、`tasklist-executor` との境界（動作確認の完了後の公開ではない）が読めるものにする。

##### 起動gate

`tasklist-executor` は「ユーザー動作確認が完了するまで commit・push・PR を行わない」契約を持ち、公開は動作確認の後に来る。この skill は動作確認の前に呼ばれる。両者の前提が逆であることを書く。

##### 実行workflow

`design.md` の workflow section が持つ必須順序をそのまま落とす。

1. current branch、remote の有無、default branch 名を確認する
2. default branch なら commit 前に利用者へ確認を取る
3. 未 commit の変更を untracked を含めてすべて stage し、一つの commit にする。message は `WIP: share work in progress`
4. 未 commit が無く push できる commit も無い場合だけ空 commit を作る
5. current branch を push する
6. default branch でなく `gh` が使える場合だけ PR 作成 script を呼ぶ
7. 到達地点を報告する

##### このskillが絶対にやらないこと

force push、PR の merge、PR 本文の生成、利用先 repository の CI・自動化の変更。

`--force-with-lease` による自動再試行も行わない。この保護は「自分が最後に fetch した remote 先端」との比較で成り立つため、手順に `git fetch` を挟むと効かなくなる。安全性が手順の書き方に依存する形にしない旨を書く。

#### `skills/README.md` を更新する

##### 配置する位置

`skills/README.md` の「階層構造」節は、オーケストレータが呼ぶ下位 skill を階層で表現し、それ以外を top level へ置いている。この skill はオーケストレータ配下ではないため top level へ置く。

## Phase 3: `tasklist.md` の template から規則を外し、正本へ寄せる

### DoD（完了条件）

- `plugins/tumeda-dev/skills/task-design/templates/tasklist.md` の一行目が `## Phase 1` で始まる。
- 同 template の末尾に `## 参照` があり、設計の正本、完了・取消・更新 timing の規則の正本、tasklist へ載せる task の範囲の正本の三つを指す。
- `plugins/tumeda-dev/skills/tasklist-executor/SKILL.md` の停止・再開節から、checkbox を phase 末や作業末にまとめて更新しない理由（停止時点の checkbox が実態とずれると再開位置が決まらない）を読める。
- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出力する。

### Tasks

- [x] template の冒頭を外す
  - [x] `# タスクリスト` の見出しを削除する
  - [x] `## 設計参照` 節を削除する
  - [x] `## 🚨 タスク完全完了の原則` 節を、直後の区切り線まで含めて削除する
  - [x] file の一行目が `## Phase 1:` で始まることを確認する

- [x] template の末尾へ `## 参照` を追加する
  - [x] 設計の正本として、同じ directory の `./design.md` を指す行を書く
  - [x] 完了条件、取消完了、subtask 分割、checkbox 更新 timing の規則の正本として `tasklist-executor/SKILL.md` を指す行を書く
  - [x] tasklist へ載せる task の範囲の正本として `task-design/tasklist-design.md` を指す行を書く
  - [x] 本文を複製せず、所在だけを示すことを確認する

- [x] `tasklist-executor/SKILL.md` へ欠けている規則を追記する
  - [x] 停止・再開節へ「phase 末や作業末にまとめて更新しない」を追記する
  - [x] 停止時点の checkbox が実態とずれると再開位置が決まらない、という理由を併記する
  - [x] 既存の「DoD の各条件は『試みた』ではなく『実際に通過した』ことを確認してから `[x]` にする」と重複しない書き方にする

- [x] validator の四検査を正本へ移す
  - [x] `requireText(tasklistTemplate, "## 設計参照")` を `"## 参照"` へ変更する
  - [x] `requireText(tasklistTemplate, "phase末や作業末にまとめて更新しない")` の対象を `tasklist-executor/SKILL.md` へ移し、検査文字列を追記した実文言へ合わせる
  - [x] `requireText(tasklistTemplate, "時間不足")` の対象を `tasklist-executor/SKILL.md` へ移す。同 file に完全一致の文言がある
  - [x] `requireText(tasklistTemplate, "合意済みplanの変更によって元taskが不要または別実装へ置換")` の対象を `tasklist-executor/SKILL.md` へ移し、検査文字列を同 file の実文言「合意済みplanの変更により元taskが不要または別実装へ置換」へ合わせる
  - [x] `requireText(tasklistTemplate, "./design.md")` は変更しない
  - [x] `node scripts/verification/validate-plugin.mjs` を実行し、`plugin validation passed` が出ることを確認する

### 各task詳細

#### template の冒頭を外す

##### 削除する範囲と、それぞれの正本

冒頭の記述はすべて他所に正本がある。`design.md` の「documentation以外のfile deliverable」に対応表がある。

`## 🚨 タスク完全完了の原則` 節は、その配下の「必須rule」「実装可能なtaskだけを計画」「taskの取消完了が許可される唯一のcase」「taskが大きすぎる場合」「tasklistの更新timing（必須）」をすべて含む。節の終わりは、`## Phase 1` の直前にある区切り線である。

既に生成済みの tasklist は追随させない。この template は今後生成されるものへ効く。

#### `tasklist-executor/SKILL.md` へ欠けている規則を追記する

##### なぜ追記が要るか

この規則は executor の既存規則から導出できない。同 file は「DoD の各条件は『試みた』ではなく『実際に通過した』ことを確認してから `[x]` にする」を持つが、全 task を実測してから最後に一括で `[x]` を付ける形はこれを満たしつつまとめて更新している。独立した規則である。

必要な理由は停止・再開にある。executor は `phase_checkpoint` や `blocked` で停止する契約を持つ。まとめて更新すると停止時点の checkbox が実態とずれ、再開時に何を再実行すべきかが決まらない。よって停止・再開節へ置く。

`tasklist-design.md` にある同趣旨の記述は、task-design が tasklist を作るときの作成規約であり、executor 自身への契約ではない。

#### validator の四検査を正本へ移す

##### 落ちる検査と、移し先

冒頭の削除で失われるのは四つである。`## 設計参照`、`phase末や作業末にまとめて更新しない`、`時間不足`、`合意済みplanの変更によって元taskが不要または別実装へ置換`。

検査が守っていた意図は「この規則が plugin のどこかに存在し続けること」であり、template を対象にしたのは当時そこにあったからである。よって対象を規則ごとの正本へ移す。`## 設計参照` は末尾の参照節へ、残る三つは `tasklist-executor/SKILL.md` へ移す。

`./design.md` は末尾の参照節に残るため変更しない。`facilitate-discussion`、`implementation_review.md`、`特定の\`steering\` callerへ固定しない`、`原文、関連する実装・design・plan、原因、採用方針、決定`、`review後に実装を自動再開しない`、`current branchが公開可能なnon-default branch` は削除対象の外にあり影響しない。

## Phase 4: 品質checkと修正

### DoD（完了条件）

- version 宣言値四箇所と `expectedRelease` 一箇所が `7.6.0` で一致する。
- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出力する。

> ⚠️ この repository は UI を持たないため screenshot 確認の対象がない。`maintenance-plugin-context` が「UI確認環境: なし」を返している。

### Tasks

- [x] version を MINOR bump する
  - [x] `plugins/tumeda-dev/.codex-plugin/plugin.json` の `version` を `7.6.0` にする
  - [x] `plugins/tumeda-dev/.claude-plugin/plugin.json` の `version` を `7.6.0` にする
  - [x] root `.claude-plugin/marketplace.json` の `version` を `7.6.0` にする
  - [x] root `.claude-plugin/marketplace.json` の `plugins[]` 内 `name: tumeda-dev` の `version` を `7.6.0` にする
  - [x] `scripts/verification/validate-plugin.mjs` の `expectedRelease` を `7.6.0` にする

- [x] 全test実行
  - [x] repository root で `node scripts/verification/validate-plugin.mjs` を実行する
  - [x] `plugin validation passed` が出ることを確認する
  - [x] errorがあれば修正して再実行し、error zero を確認する（今回は初回から`plugin validation passed`で成功）

- [x] ~~lint実行~~（`maintenance-plugin-context` が「全体 lint command: なし。linterを持たない」を返したため対象なし）

### 各task詳細

#### version を MINOR bump する

##### bump 区分の根拠

`maintenance-plugin-context` が返した version 規約は「consumerが新たに呼べるものが増えたか」で MINOR と PATCH を分ける。新しい skill が増えるため MINOR にあたる。現在は `7.5.1` であり、`7.6.0` とする。

script の移動と参照更新は既存 skill の内容修正にあたるが、同じ release へ含まれるため区分を上げる根拠にはしない。

## Documentation reviewと実装後振り返り

- [x] code readingまたは実装で永続化候補を得た場合、その場でdoc-enricherを提案modeで適用する
  - [x] 提案がある場合だけユーザー承認後に既存READMEまたは既存docsへ反映する（今回は候補なし。scriptの移動とskill追加はdesign.mdの合意事項どおりの実装であり、新たな永続化候補は生じなかった）
  - [x] 提案・承認判断を別taskへ先送りしない
- [ ] 実装、review、validationからfeedbackまたは実装とのずれが生じた場合、直接受領したworkflow ownerがpluginの`facilitate-discussion`を`implementation_review.md`へ適用する
  - [x] `discussion_directory=<working_dir>`と`discussion_file_name=implementation_review.md`を渡す
  - [x] 原文、関連する実装・design・plan、原因、採用方針、決定を渡し、修正済みでも記録を省略しない
  - [x] 「共有されていなかった知識の前提は何か」を確認する
  - [x] 「codeを読めば分かるか、設計意図か、process不足か」を確認する
  - [ ] 「どこに書けば次回この議論が不要になるか」を確認し、合意後だけ反映する（`implementation_review.md` 論点1に提案0を保存済み。ユーザーの明示的合意を待つ）
  - [ ] decisionをcallerへ返し、designまたはplan構造が変わる場合は同じworking directoryでtask-designへ戻す（合意待ちのため未実施）
  - [x] review後に実装を自動再開しない

---

## 動作確認

### DoD

ユーザーが、作成した `share-work-in-progress` を起点ケースへ実際に使い、意図どおりであることを確認した。

### Tasks

- [ ] 起点ケースへ `share-work-in-progress` の手順を適用する
  - [ ] 対象は利用先 repository の作業 branch とする。対象 repository と branch をユーザーへ確認してから実行する
  - [ ] この session では新しい skill を skill として起動できない。skill の内容は session 開始時に cache されるため、`SKILL.md` の手順を読んで実行する
  - [ ] `SKILL.md` の手順どおりに commit、push、PR 作成まで到達することを確認する
  - [ ] 手順と実際の挙動がずれた箇所を記録する

- [ ] ユーザーに動作確認を依頼する
  - [ ] PR の URL を示し、見たい内容が読める状態になっていることを確認してもらう

- [ ] feedbackがあれば、直接受領したworkflow ownerがpluginの`facilitate-discussion`を`implementation_review.md`へ適用し、decisionをcallerへ返す
  - [ ] designまたはplan構造が変わる場合は同じworking directoryでtask-designへ戻す
  - [ ] feedbackがなければ`[x] ~~feedback収集~~（feedbackなし）`の形式で完了扱いにする

---

## 完了後のaction

> ⚠️ 動作確認phaseが完了するまでcommit、push、mergeを促したり実行したりしない。急かすことも禁止する。

- [ ] commit（phase単位かつ意味単位で分割）
  - MUST: まとめて一commitにしない
  - Phase 1（script の移動と参照更新）、Phase 2（skill の追加と README）、Phase 3（template の整理と validator の追随）、Phase 4（version bump）を別commitにする
  - steering成果物のうち `design.md` と `task-design-discussion.md` は、対応する変更commitより前に置く
  - `tasklist.md` のcheckbox確定は、対応する変更commitより後に置く
  - ユーザーが一部だけ承認した場合は承認範囲だけをcommitし、残りは待つ
  - ユーザーが不要と回答した場合は`[x] ~~commit~~（ユーザーが不要と回答）`の形式で完了扱いにする

- [ ] branch を push して `main` へ取り込む
  - [ ] commit taskの結果としてlocal commitが実際に一件以上あることを確認する。一件もなければ実行しない
  - [ ] current branch が `main` でないことを確認する
  - [ ] `main` への取り込みはこの repository の外へ影響するため、実行前にユーザーの明示的な承認を得る
  - [ ] `git push -u origin <current-branch>` を実行する
  - [ ] `git checkout main` を実行する
  - [ ] `git merge <current-branch>` を実行する
  - [ ] `git push` を実行する

### 各task詳細

#### branch を push して `main` へ取り込む

##### PR を経由しない理由

この steering は `escalate-plugin-skill-fix` 経由で利用先 repository から引き渡された作業である。同 skill は、plugin repository での作業が commit まで終わったら PR を経由せず `main` へ取り込むと定めている。

PR を開いて review を待つ相手がいないため、review 単位としての PR が機能しない。変更の妥当性は、この steering の design 合意と tasklist 合意で担保している。

このため template が持つ push・PR section を、push と merge の四段へ置き換えている。`create_or_get_pr.sh` はこの repository の取り込みでは使わない。

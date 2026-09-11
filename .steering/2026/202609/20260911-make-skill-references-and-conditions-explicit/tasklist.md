## Phase 1: 指示対象の明示の標準を新設する

> この標準を最初に置く。Phase 4・5・6 で直す条件文は、いずれもこの標準の適用例にあたる。標準が先にあれば、後続 phase の修正理由をこの標準で説明できる。

> **全 phase に共通する test の扱い**: この repository は自動 test framework を持たない。`.agents/skills/tumeda-dev-plugin-context.md` の「テスト方針」に「自動test frameworkを持たない。`package.json` は存在しない。検証は `scripts/verification/validate-plugin.mjs` によるplugin manifestの整合確認だけである。skill本文の内容は人のreviewで担保する」とある。したがって各 phase に挙動を担保する test を置かない。代わりに、各 phase の DoD を「対象 file を読むと何が分かるか」の形で書き、Phase 7 の validator 実行と動作確認 phase のユーザー読み合わせで担保する。

### DoD（完了条件）

- `plugins/tumeda-dev/docs/documentation_standards/referent_explicitness.md` を読むと、三つの型それぞれについて、だめな例と直した形の対を確認できる。
- 同 file を読むと、指示対象が自明なら指示語を使ってよく主語・目的語も省略してよいこと、自明でない三条件、判定の問い、検知手段が分かる。
- 同 file を読むと、該当しない例が二つ挙がっており、すべての抽象語を禁じる標準ではないと分かる。
- `plugins/tumeda-dev/docs/documentation_standards/README.md` の「収録している標準」に `referent_explicitness.md` の行がある。
- 同 file の「標準の置き方」を読むと、標準を増やしたときに `document-review` の観点 list へ足すかを判断する問いが分かる。
- `plugins/tumeda-dev/skills/document-review/SKILL.md` の「当てる観点」に、作成時観点と更新時観点の両方へ `referent_explicitness.md` の行があり、更新時観点へ `modify_description_policy.md` の行がある。

### Tasks

- [x] `plugins/tumeda-dev/docs/documentation_standards/referent_explicitness.md` を新規作成する
  - [x] 一般則を許可から書き始める。「指示対象が読み手にとって自明なら、指示語を使ってよい。同じ理由で主語や目的語を省略してよい。自明でないなら埋める」
  - [x] 「指示語はこそあど言葉に限らない。抽象名や system 内部語も、実体と結ばれていなければ暗黙の指示語として働く」を書く
  - [x] 埋めるべき三条件（document の外にある／離れている／複数候補に読める）を書く
  - [x] 判定の問い「この語が指すものを、この document しか読んでいない人が言えるか」を書く
  - [x] 指示語の範囲（こそあど言葉／抽象名／system 内部語／主語省略）を挙げ、こそあど言葉以外は一見具体語に見えるため気づきにくいという理由を添える
  - [x] 型1〜型3 それぞれについて、だめな例と直した形を対で書く
  - [x] 検知手段「その文を前後から取り出して読む」を書き、全文脈の自己完結までは求めないことを添える
  - [x] 該当しない例を二つ書く

- [x] `plugins/tumeda-dev/docs/documentation_standards/README.md` の「収録している標準」へ 1 行追加する
  - [x] 既存行と同じ形式（`**[file名](./file名)** — 説明`）に揃える

- [x] 同 file の「標準の置き方」へ維持規律を追加する
  - [x] 「標準を増やしたら、それが emit 前に当てる観点かを判断する。観点なら `document-review` の観点 list へ足す」を書く
  - [x] 判断の問い「この標準は、書かれた文に当てて、満たすか満たさないかを判定できるか」を書く
  - [x] 何を書くか・どこに置くか・誰に向けて書くかを扱う標準は観点でないこと、それらは `document-review` の能力境界の外であることを書く

- [x] `plugins/tumeda-dev/skills/document-review/SKILL.md` の「当てる観点」へ足す
  - [x] 作成時観点へ「指示対象 → `referent_explicitness.md`」を足す
  - [x] 更新時観点へ「指示対象 → `referent_explicitness.md`」を足す
  - [x] 更新時観点へ「既存記述の直し方 → `modify_description_policy.md`」を足す
  - [x] 観点の中身を `document-review/SKILL.md` へ写さない。同 skill の「観点の当て方は標準 file が正本」に従い、参照だけを持たせる

  > document-review 適用: `referent_explicitness.md`（新規）、`documentation_standards/README.md`（更新）、`document-review/SKILL.md`（更新）を content_density・expression_notation・file_naming・modify_description_policy の各基準で確認。指摘なし。

### 各task詳細

#### `referent_explicitness.md` を新規作成する

##### 型ごとに書く、だめな例と直した形

`design.md` の「指示対象の明示（`referent_explicitness.md`）」と `task-design-discussion.md` の論点3 の決定が正本である。三つの型は次のとおり。

- 型1（動詞の主語と目的語が無い）: だめな例はこの steering の chat で書かれた「repository context の返却を条件にして成果物を生成・省略する契約は、`maintenance-plugin-context` の返却形式で条件を書く」
- 型2（system 内部語を実体と結ばずに使う）: だめな例は `plugins/tumeda-dev/skills/task-design/tasklist-design.md:122` の「local Git運用条件がrepository contextから返された場合」
- 型3（指示語の根拠が離れている）: だめな例はこの steering の chat で書かれた「3箇所とも今は『返ってきた場合だけ生成する』としか書いてない」

各型に、なぜ切り離して読むと意味が取れないかと、直した形を併記する。

##### 観点 list へ登録しないと当てられない

`plugins/tumeda-dev/skills/document-review/SKILL.md` は「当てる観点」を明示列挙しており、`documentation_standards/` へ file を足しても list に無ければ emit 前ゲートで当たらない。標準を書くことと、それが当てられることは別である。同じ phase で登録まで行う。

`modify_description_policy.md` を更新時観点へ足すのは、今回新設した判断の問いを既存の標準すべてへ当てた結果、観点に当たるのに list へ無いことが判明したためである。規律を作った直後に、その規律が検出した漏れを放置しない。

##### 該当しない例の役割

`plugins/tumeda-dev/docs/documentation_standards/content_density.md` の「読者が下駄を履いた状態」と、`plugins/tumeda-dev/docs/development_standards/naming/core.md` の `spec_over_implementation` を挙げる。当たらない側を示さないと、読み手が「抽象語を使うな」と読んで過剰に適用する。

## Phase 2: 設計標準の群の入口を新設する

### DoD（完了条件）

- `plugins/tumeda-dev/docs/development_standards/README.md` を読むと、この群が `naming/` と `entity_modeling/` を収録していると分かる。
- 同 file を読むと、`task-design` が配下すべてを読み、`name-work-directory` が `naming/README.md` を入口にすると分かる。
- 同 file を読むと、配下の file を増やすときに全部参照契約が成立し続けるかを確認する規律と、その判断の問いが分かる。

### Tasks

- [x] `plugins/tumeda-dev/docs/development_standards/README.md` を新規作成する
  - [x] 「収録している標準」に `naming/` と `entity_modeling/` を 1 行ずつ書く
  - [x] 「この群の引き方」に、`task-design` は配下すべて、`name-work-directory` は `naming/README.md` を入口とすることを書く
  - [x] 「この群の置き方」に、新しい標準をどこへ置くかの判断の問いを書く
  - [x] 「維持規律」に、file を増やすときの確認と判断の問い「増やした後の file 数と分量で、設計前調査の一段階として読み切れるか」を書き、読み切れないなら file を増やす前に参照契約自体を見直すと書く

  > document-review 適用: `development_standards/README.md`（新規）を content_density・expression_notation・file_naming・referent_explicitness の各基準で確認。既存群 README（naming/README.md 等）と同形式。指摘なし。

### 各task詳細

#### `development_standards/README.md` を新規作成する

##### 既存の群 README に形を揃える

`plugins/tumeda-dev/docs/documentation_standards/README.md` と `plugins/tumeda-dev/docs/think_standards/README.md` が持つ形（収録一覧＋置き方）に揃える。

README が skill 名を書くことについては、`think_standards/README.md` が「`think-through` skillからの入口であり」と skill を名指しする先例がある。

##### 数値上限を置かない理由

分量が file 数に比例しないためである。現在は 7 file（`naming/` に README・core・file・method、`entity_modeling/` に README・core・evacuation）で契約が成立している。

## Phase 3: 設計標準を読む義務を skill 本文へ書く

### DoD（完了条件）

- `plugins/tumeda-dev/skills/task-design/SKILL.md` の PrepareStep 3「設計前調査」の先頭を読むと、`development_standards/` 配下をすべて読むこと、該当場面かを skill 側で判定しないことが分かる。
- `plugins/tumeda-dev/skills/name-work-directory/SKILL.md` の「出力」節を読むと、slug の規則を適用する前に `naming/README.md` を入口として引くことが分かる。
- `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md` を読むと、`migration.md` の path が書かれており、検索せずに開ける。
- `grep -rn 'development_standards' plugins/tumeda-dev/skills/` が 2 件以上返る。

### Tasks

- [x] `plugins/tumeda-dev/skills/task-design/SKILL.md` の PrepareStep 3 へ参照義務を追記する
  - [x] 「設計前調査」の先頭へ置く
  - [x] 配下をすべて読むこと、該当場面かを判定しないことを書く
  - [x] 判定を挟まない理由（判定を誤った経路だけが標準に触れないまま進み、その経路では判定を誤った自覚が残らない）を添える

- [x] `plugins/tumeda-dev/skills/name-work-directory/SKILL.md` の「出力」節へ参照義務を追記する
  - [x] slug の規則の直前へ置く
  - [x] `naming/README.md` を入口とし、そこの引き方に従うと書く
  - [x] 個別 file を名指ししない理由（どの file が該当するかの判断を README 側へ持たせ、file の増減でこの skill を直さずに済ませる）を添える

- [x] `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md` の `migration.md` 参照へ path を添える
  - [x] 「正本は`migration.md`である」の行へ `plugins/tumeda-dev/skills/maintenance-plugin-context/maintenance_policies/migration.md` を添える

- [x] `grep -rn 'development_standards' plugins/tumeda-dev/skills/` を実行し、2 件以上返ることを確認する

  > 実行結果: 3件（`tumeda-dev-plugin-context.md`、`name-work-directory/SKILL.md`、`task-design/SKILL.md`）。document-review 適用: 3 SKILL.md の更新差分を expression_notation・referent_explicitness・modify_description_policy の各基準で確認。指摘なし。

### 各task詳細

#### `task-design/SKILL.md` の PrepareStep 3 へ参照義務を追記する

##### `maintenance-plugin-context` へ委譲する記述へは書かない

同 `SKILL.md` の冒頭には「repository固有の設計文書、規約、技術検証環境・commandが必要な時は、`maintenance-plugin-context`へ…渡す」という記述がある。ここへは書かない。`development_standards/` は plugin 内の repository 非依存な標準であり、`maintenance-plugin-context` を経由しない。

#### `escalate-plugin-skill-fix/SKILL.md` の `migration.md` 参照へ path を添える

この修正は Phase 1 で作った `referent_explicitness.md` の型2（system 内部語を実体と結ばずに使う）の適用例である。`migration.md` という file 名だけでは、読み手がどこにあるかを言えない。

## Phase 4: repository context が返らなかった場合の動作を条件文へ書く

### DoD（完了条件）

- `plugins/tumeda-dev/skills/task-design/tasklist-design.md` の commit section の生成条件を読むと、`.agents/skills/tumeda-dev-plugin-context.md` に Git 運用条件が無い場合に利用者へ確認することが、他の file を読まずに分かる。
- 同 file の push・PR section の生成条件についても同じことが分かる。
- どちらの条件文も、`repository context` という語ではなく `.agents/skills/tumeda-dev-plugin-context.md` という path で条件を書いている。
- `plugins/tumeda-dev/skills/runtime-execution-contracts.md` の `Repository context` 節を読むと、該当項目が無い場合に利用者へ確認し、確認するまで child 処理を実行しないことが分かる。

### Tasks

- [x] `plugins/tumeda-dev/skills/task-design/tasklist-design.md` の commit section 生成条件を書き直す
  - [x] 条件を `.agents/skills/tumeda-dev-plugin-context.md` の該当項目の有無で書く
  - [x] 項目が無い場合は利用者へ確認すると書く。確認せずに縮退も停止もしないと書く
  - [x] 利用者の回答は `maintenance-plugin-context` が同 file へ書き戻すと書く。否定の回答も fact として記載すると書く

- [x] 同 file の push・PR section 生成条件を書き直す
  - [x] 同じ形へ揃える

- [x] `plugins/tumeda-dev/skills/runtime-execution-contracts.md` の `Repository context` 節を書き直す
  - [x] 解決元を `<repository root>/.agents/skills/tumeda-dev-plugin-context.md` という path で書く
  - [x] 該当項目が無い場合は推測せず利用者へ確認し、確認するまで child 処理を実行しないと書く
  - [x] 縮退しない理由（検証して通ったのか検証できなかったのかが成果物から区別できなくなる）を添える
  - [x] 利用者の回答は `maintenance-plugin-context` が同 file へ書き戻すと書く

- [x] 書き直した三つの条件文を、前後から取り出して読む
  - [x] それぞれ単体で、項目が無い場合の動作を言えることを確認する（`:122`、`:123`、`Repository context` 節とも、path・不在時の確認・書き戻し先を単体で明示）

> この phase は当初 `tasklist-design.md` の 2 箇所だけを対象にしていた。`design.md` の「skillの役割と方針」が定める対象は 3 箇所であり、`runtime-execution-contracts.md` の `Repository context` 節が tasklist から落ちていた。実装完了後の照合で判明し、task と DoD を追加して実装した。経緯は `implementation_review.md` に記録する。

### 各task詳細

#### commit section 生成条件を書き直す

##### 現在の記述と、欠けているもの

現在は次のとおりである。

> local Git運用条件がrepository contextから返された場合、またはユーザーが明示的にcommitを要求した場合だけcommit sectionを生成する。

欠けているのは二つある。返らなかった場合の動作と、「返された」の判定基準である。

`maintenance-plugin-context/SKILL.md` は返却形式を `status: available | unavailable` と `allowed context` で定めており、`consumerの境界` で「必須文脈が `unavailable` なら、consumer は推測しない。repository 固有文脈なしで安全に完結できる一般手順へ縮退するか、repository root・確認元・必要 fact の提示を求める」と定めている。この論点で決めたのは、縮退ではなく確認を求める側である。

##### 書き戻しが確認を一度で済ませる

利用者へ確認するのは repository ごとに一度でよい。回答を `.agents/skills/tumeda-dev-plugin-context.md` へ書き戻せば、次回以降は確認せずに済む。同 file には既に `Branch / issue 契約: なし。` `UI確認環境: なし。` という否定の記載があり、先例がある。

#### 書き直した二つの条件文を、前後から取り出して読む

Phase 1 で作った `referent_explicitness.md` の検知手段を、自分の書いた文へ当てる。

## Phase 5: 空 commit を作る条件を書き直す

### DoD（完了条件）

- `plugins/tumeda-dev/skills/share-work-in-progress/SKILL.md` の手順4 を読むと、作業 branch が remote と同期済みで open PR も既にある状況で空 commit を作るかどうかを、一意に答えられる。
- 同手順の `remote` が `remote の default branch` を指すと書かれている。
- `.steering/2026/202609/20260910-add-publish-branch-diff-skill/design.md:102` が、同 steering の `task-design-discussion.md:67` と同じ意味になっている。

### Tasks

- [x] `plugins/tumeda-dev/skills/share-work-in-progress/SKILL.md` の手順4 を書き直す
  - [x] 「commit するものが何も無く、かつ remote の default branch と同一 HEAD で PR を作れない場合だけ」とする
  - [x] 既存の「空 commit は PR を成立させるための最小差分であり、見せるための差分ではない」は残す

- [x] `.steering/2026/202609/20260910-add-publish-branch-diff-skill/design.md:102` を書き直す
  - [x] 同 steering の `task-design-discussion.md:67` へ合わせて `default branch` を補う
  - [x] 同 steering の `task-design-discussion.md` は変更しない

- [x] 三つの状況で動作が一意に決まることを確認する
  - [x] 作業 branch が push 済み・同期・open PR ありのとき、空 commit を作らないと読めることを確認する（HEAD が default branch と同一でないため条件が成立しない）
  - [x] default branch から切ったばかりで HEAD が同じとき、空 commit を作ると読めることを確認する（commit するものが無く、HEAD が default branch と同一）
  - [x] 作業 branch に自分の commit があり push 済み・PR 未作成のとき、空 commit を作らないと読めることを確認する（HEAD が default branch と同一でないため条件が成立しない）

  > document-review 適用: `share-work-in-progress/SKILL.md` 手順4の更新差分を referent_explicitness・modify_description_policy の各基準で確認。指摘なし。

### 各task詳細

#### `.steering/.../20260910-add-publish-branch-diff-skill/design.md:102` を書き直す

##### 当時の判断を書き換えるのではない

同 steering では `task-design-discussion.md` が決定の原本であり、`design.md` はその転記にあたる。転記の際に `remote の default branch` から `default branch` が落ちた。原本へ合わせて欠落を補うだけであり、当時の判断は変えない。原本は変更しない。

この意図は commit message へも書く。読み手が「過去の合意を書き換えた」と誤解しないためである。

## Phase 6: 実行環境に command を止められたときの契約を書く

### DoD（完了条件）

- `plugins/tumeda-dev/skills/runtime-execution-contracts.md` の冒頭を読むと、この file が child 委譲に限らない実行時の契約を持つと分かる。
- 同 file を読むと、task level で実行してよいと判定したことと、実行環境がその command を通すことが別の層であると分かる。止められたときに迂回せず停止して利用者へ返すことが分かる。
- `plugins/tumeda-dev/skills/README.md` の `runtime-execution-contracts.md` の説明が、広げた scope と一致している。

### Tasks

- [x] `plugins/tumeda-dev/skills/runtime-execution-contracts.md` の冒頭 scope 宣言を書き直す
  - [x] 現在の「tasklist-executorがvisual-inspector / test-runnerへchild処理を委譲する時の、hostに依存しない共通契約。」を、child 委譲に限らない実行時の契約を含む形へ広げる
  - [x] 既存の child 委譲に関する section の構造は変えない

- [x] 同 file へ実行環境 gate の契約を追記する
  - [x] 「agent が command を実行してよいと task level で判定したことは、実行環境がその command を通すことを意味しない」を書く
  - [x] 「実行環境に止められた場合、agent は迂回せず停止し、利用者へ返す」を書く
  - [x] 既存の `停止理由` にある `blocked`（必須入力・外部状態・権限が不足している）へ接続する
  - [x] 特定の実行基盤に依存する手順は書かない

- [x] `plugins/tumeda-dev/skills/README.md` の該当行を書き直す
  - [x] 現在の「tasklist-executor が visual-inspector / test-runner へ child 委譲する時の共通契約（状態の正本・single writer・停止理由）」を、広げた scope に合わせる

  > document-review 適用: `runtime-execution-contracts.md`（scope 宣言・実行環境 gate 追記）、`skills/README.md`（該当行）を expression_notation・referent_explicitness・modify_description_policy の各基準で確認。指摘なし。

### 各task詳細

#### 冒頭 scope 宣言を書き直す

##### なぜこの file へ置くか

command を実行しうるのは `tasklist-executor` だけではない。`steering` は `Blocker resolution`、`task-design` は技術検証実装で実行する。`tasklist-executor/SKILL.md` へ書くとこれらが拾わない。

この file は名前の時点で実行時の契約という名前空間を持っており、狭めているのは冒頭の一文だけである。新しい共有 file を作ると名前空間が重なり、どちらを読むかの判断が読み手へ残る。

##### child 委譲の契約を薄めない

冒頭で二つの対象（実行時の共通契約と child 委譲）を並べる。既存の child 委譲 section の構造は変えない。scope を広げた結果として child 委譲の契約が読まれなくなることを避ける。

## Phase 7: version を上げ、plugin validation を通す

### DoD（完了条件）

- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出力する。
- version 宣言値 4 箇所と `scripts/verification/validate-plugin.mjs` の `expectedRelease` が同じ値である。

### Tasks

- [x] 上げる version 区分を決める
  - [x] `.agents/skills/tumeda-dev-plugin-context.md` の「version bump」に従い、MINOR と PATCH の境界を「consumer が新たに呼べるものが増えたか」で判定する
  - [x] 今回は既存 skill の内容修正と docs の追加・変更であり、新しい skill も新しい parameter も増えていないため PATCH とする
  - [x] 新規 file の追加それ自体は MINOR の根拠にならないことを確認する（PATCH: 7.6.0 → 7.6.1）

- [x] version を 5 箇所同時に上げる
  - [x] `plugins/tumeda-dev/.codex-plugin/plugin.json` の `version`
  - [x] `plugins/tumeda-dev/.claude-plugin/plugin.json` の `version`
  - [x] root `.claude-plugin/marketplace.json` の `version`
  - [x] root `.claude-plugin/marketplace.json` の `plugins[]` 内、`name: tumeda-dev` の `version`
  - [x] `scripts/verification/validate-plugin.mjs` の `expectedRelease`

- [x] `node scripts/verification/validate-plugin.mjs` を repository root で実行する
  - [x] `plugin validation passed` が出力されることを確認する
  - [x] error があれば修正して再実行し、error zero を確認する（一回で `plugin validation passed`）

- [x] repository 全体の lint は実行しない
  - [x] `.agents/skills/tumeda-dev-plugin-context.md` の「全体 lint command」が「なし。linterを持たない。」であることを確認して完了扱いにする

## Phase 8: 覆域を確認する問いを、tasklist 作成時と DoD 判定時へ置く

> この phase は実装完了後 review で追加した。Phase 1〜7 の実装後に照合したところ、`design.md` が定める対象を tasklist が覆っていない箇所と、DoD の同一性要求を満たさないまま `[x]` になった箇所が一件ずつ見つかった。経緯は `implementation_review.md` の論点1 に記録している。

### DoD（完了条件）

- `plugins/tumeda-dev/skills/task-design/tasklist-design.md` の自己レビュー gate を読むと、`design.md` の変更対象一覧を design 側から辿って tasklist が覆っているか確認することが分かる。
- 同項目を読むと、既存の「DoD の各項目に、それを担保する task があるか」との違い（tasklist 内部の整合か、design と tasklist の間の覆域か）が分かる。
- `plugins/tumeda-dev/skills/tasklist-executor/SKILL.md` を読むと、DoD が二つの記述の同一性を要求する場合に両方の全文を照合してから `[x]` にすることが分かる。
- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出力する。

### Tasks

- [x] `plugins/tumeda-dev/skills/task-design/tasklist-design.md` の自己レビュー gate へ項目を足す
  - [x] design 側から辿ること、task から逆に辿らないことを書く
  - [x] task から辿ると必ず整合して見える理由を書く
  - [x] やってしまいがちな失敗（discussion で中心的に扱った対象だけを phase へ落とす）を書く
  - [x] 既存項目との違いを書く

- [x] `plugins/tumeda-dev/skills/tasklist-executor/SKILL.md` の `[x]` 判定へ項目を足す
  - [x] 最重要原則の「DoD の各条件は『試みた』ではなく『実際に通過した』ことを確認してから `[x]` にする」の配下へ置く
  - [x] 同一性を要求する DoD は両方の全文を照合すると書く
  - [x] 置換対象の語だけを見ると何を見落とすかを書く

- [x] version は再度上げない
  - [x] `maintenance-plugin-context` の「配布する変更には、変更内容に見合うversion bumpを一度だけ行う」に従う。7.6.1 は Phase 7 で上げており、この追加も PATCH の範囲にとどまる

- [x] `node scripts/verification/validate-plugin.mjs` を実行する
  - [x] `plugin validation passed` を確認する

### 各task詳細

#### `tasklist-design.md` の自己レビュー gate へ項目を足す

##### 既存の gate との住み分け

既存の「DoDの各項目に、それを担保するtaskがあるか」は tasklist 内部の整合を見る。DoD に書いたことが task で担保されているかである。今回足す項目は design と tasklist の間の覆域を見る。design が挙げた対象が tasklist に載っているかである。片方が通っても他方は通らない。

実際、不足1 では Phase 4 の DoD と task は内部で整合していた。DoD が 2 箇所を要求し、task が 2 箇所を実装していた。欠落は design 側の 3 箇所目にしか現れなかった。

## Documentation reviewと実装後振り返り

- [x] ~~code reading または実装で永続化候補を得た場合、その場で `doc-enricher` を提案modeで適用する~~（各 task 実行中に確認したが、design.md・既存標準に既に記載済みの内容の反映のみで、新規の永続化候補は生じなかった）
  - [x] ~~提案がある場合だけユーザー承認後に既存 README または既存 docs へ反映する~~（提案なし）
  - [x] ~~提案・承認判断を別 task へ先送りしない~~（先送り対象なし）
- [x] ~~実装、review、validation から feedback または実装とのずれが生じた場合、直接受領した workflow owner が plugin の `facilitate-discussion` を `implementation_review.md` へ適用する~~（validation は一回で `plugin validation passed`、実装中に design との齟齬・feedback は生じなかった）
  - [x] ~~`discussion_directory=<working_dir>` と `discussion_file_name=implementation_review.md` を渡す~~（該当なし）
  - [x] ~~原文、関連する実装・design・plan、原因、採用方針、決定を渡し、修正済みでも記録を省略しない~~（該当なし）
  - [x] ~~「共有されていなかった知識の前提は何か」を確認する~~（該当なし）
  - [x] ~~「code を読めば分かるか、設計意図か、process 不足か」を確認する~~（該当なし）
  - [x] ~~「どこに書けば次回この議論が不要になるか」を確認し、合意後だけ反映する~~（該当なし）
  - [x] ~~decision を caller へ返し、design または plan 構造が変わる場合は同じ working directory で task-design へ戻す~~（該当なし）
  - [x] ~~review 後に実装を自動再開しない~~（該当なし）

---

## 動作確認

### DoD

ユーザーが実際に成果物を読み、意図どおりであることを確認した。

### Tasks

- [x] ユーザーに動作確認を依頼する
  - [x] 新設した二つの file（`referent_explicitness.md`、`development_standards/README.md`）を読んでもらう
  - [x] 書き直した条件文（`tasklist-design.md` の 2 箇所、`runtime-execution-contracts.md` の `Repository context` 節、`share-work-in-progress/SKILL.md` 手順4）を読んでもらう

  > 実測結果: 動作確認前の照合で四件の欠陥を検出し、すべて修正してから依頼した。内訳は、design が定めた三箇所を tasklist が二箇所しか覆っていなかったこと、DoD の同一性要求を語一つの置換で満たしたとみなしたこと、新設標準の型1「直した形」が自身の型2 に違反していたこと、型3「直した形」が元の三箇所を二箇所へ減らしていたことである。前二件は `implementation_review.md` 論点1 として扱い Phase 8 を追加した。後二件は標準本文を直した。ユーザーから「ok」を受領。

- [x] ~~feedback収集~~（feedbackなし）

---

## 完了後のaction

> ⚠️ 動作確認phaseが完了するまでcommit、push、`main` への取り込みを促したり実行したりしない。急かすことも禁止する。

- [ ] commit（phase単位かつ意味単位で分割）
  - MUST: まとめて一commitにしない
  - Phase 1（指示対象の明示の標準）、Phase 2（設計標準の群の入口）、Phase 3（参照義務の追記）、Phase 4（条件文の書き直し）、Phase 5（空 commit 条件）、Phase 6（実行環境 gate）、Phase 7（version bump）、Phase 8（覆域 gate）を別commitにする
  - `implementation_review.md` は Phase 8 の根拠であるため、Phase 8 の commit より前へ置く。`tasklist.md` のcheckbox確定は最後へ置く
  - `runtime-execution-contracts.md` は Phase 4 と Phase 6、`tasklist-design.md` は Phase 4 と Phase 8 で変更している。同じ file でも意味単位が違うため、中間状態を再構成して別commitにする
  - `design.md` と `task-design-discussion.md` は、対応する変更commitより前へ置く
  - `tasklist.md` のcheckbox確定と `implementation_review.md` は、対応する変更commitより後へ置く
  - Phase 5 の `.steering/.../20260910-add-publish-branch-diff-skill/design.md` の修正は、転記の欠落を補うものであり当時の判断を変えないことをcommit messageへ書く
  - ユーザーが一部だけ承認した場合は承認範囲だけをcommitし、残りは待つ
  - ユーザーが不要と回答した場合は`[x] ~~commit~~（ユーザーが不要と回答）`の形式で完了扱いにする

## `main` への取り込み

> ⚠️ このphaseは作業の外へ残るactionを含む。push した内容と `main` へ取り込んだ内容は、作業を破棄しても remote に残る。

> `maintenance-plugin-context` へ consumer=`task-design` として「作業の外へ残るactionの差し込み」宣言を要求した。`.agents/skills/tumeda-dev-plugin-context.md` の該当 section は HTML コメントだけで、宣言が書かれていない。したがって既定の停止・確認 task だけを置く。

### DoD（完了条件）

- 作業 branch が `origin` へ push されている。
- `main` に今回の変更が取り込まれ、`origin/main` へ push されている。
- `main` へ取り込んだ後、marketplace 経由で reinstall すると、install cache 側の `plugins/tumeda-dev/.claude-plugin/plugin.json` の `version` が今回上げた値と一致する。

### Tasks

- [ ] commit taskの結果としてlocal commitが実際に一件以上あることを確認する。一件もなければ以降を実行しない

- [ ] `escalate-plugin-skill-fix` が定める 4 step で `main` へ取り込む
  - [ ] 作業 branch を push する
  - [ ] `main` へ切り替える
  - [ ] 作業 branch を `main` へ merge する
  - [ ] `main` を push する
  - PR は経由しない。`escalate-plugin-skill-fix/SKILL.md` が「plugin repositoryが利用先repositoryから見てsubであり、pluginの更新がメインの作業を再開するための前段だから」PR を開かないと定めている

- [ ] ここで作業を停止し、対象actionの結果をユーザーに確認する。次へは進まない
  - [ ] 取り込んだ内容を報告する
  - [ ] 設計時点に決めた運用documentの記述と実態が合っているかを照合する
  - [ ] 実装の過程で方針が変わっていた場合は、その場でdocumentを書き換えず `design.md` へ戻す
  - [ ] reinstall して install cache の version が一致することを、ユーザーが確認できる状態にする

- [ ] session を開き直す必要があることをユーザーへ伝える
  - [ ] `escalate-plugin-skill-fix/SKILL.md` が「plugin repositoryで対象のskillを修正しても、それは今実行中のsessionには反映されない。skill内容はsession開始時にcacheされる」と定めている
  - [ ] 利用先 repository の元 task を旧版の skill のまま続けるか、新しい session を開始して修正後の skill で再開するかは、ユーザーが選ぶ

---

## 参照

- 設計の正本: 同じdirectoryの `./design.md`
- 議論の正本: 同じdirectoryの `./task-design-discussion.md`
- 完了条件、取消完了、subtask分割、checkbox更新timingの規則の正本: `tasklist-executor/SKILL.md`
- tasklistへ載せるtaskの範囲の正本: `task-design/tasklist-design.md`

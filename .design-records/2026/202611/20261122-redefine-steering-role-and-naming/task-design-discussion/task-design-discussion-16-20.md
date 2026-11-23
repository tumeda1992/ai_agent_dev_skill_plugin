# 議論記録

## 論点16: `.steering/`の読み替えの決まりの置き場所と、規則の文面

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** 確かめるだけ（全部小。根拠は`maintenance-plugin-context/SKILL.md`「Plugin version」と`task-design/templates/breaking_changes/`の前例）

論点14の決定から立てた。

### イテレーション0（論点16）: 読み替えの決まりを、既存の`breaking_changes/`の仕組みに乗せる形を仮決めする

#### 提案0（論点16）

- a. 置き場所を用意するskillのdirectoryに`breaking_changes/`を作り、`.steering/…`を`.design-records/…`として読む記録を一件置く。`maintenance-plugin-context/SKILL.md`「Plugin version」の対象の文面を「見出し・labelの名前」から「見出し・labelの名前や、置き場所のpath」へ広げる（仮決め）
  - 根拠: 同節は「その成果物のテンプレートと同じdirectoryの`breaking_changes/`に記録を残す。無ければ作る」と定める。`.design-records/`の置き場所を決めるのは置き場所を用意するskillである。記録の形（変わった版、旧名と新名の対応、変えた理由、古い成果物の読み方）は`20261115-rename-template-labels.md`に倣う。
  - `breaking_changes/`のREADMEには、このskillの成果物で記録する例・しない例を書く（同節の決まり）。
  - 文面を広げないと、置き場所のpathの変更はこの仕組みの対象外になり、記録を置く根拠が無い。
- b. `task-design/templates/breaking_changes/`へ置く
  - 同directoryのREADMEは対象をtask-designの`design.md`、`tasklist.md`、`roadmap.md`に限っており、置き場所を決める担当とも違う。

#### 検討記録（論点16・イテレーション0）

`maintenance-plugin-context/SKILL.md`「Plugin version」、`task-design/templates/breaking_changes/README.md`、`20261115-rename-template-labels.md`を読んだ。今の規則の対象は見出し・labelの名前に限られ、置き場所のpathを含まない。記録はtemplateと同じdirectoryに置くと定められ、READMEには記録する例・しない例を書く決まりがある。

#### 提案0へのフィードバック（論点16）

**結果:** aに合意（論点4・15・16をまとめて示した往復で「15以外ok」と答えられた）

> 15以外ok。ロードマップって、executeするものなの？

### 決定（論点16）

`.steering/…`を`.design-records/…`として読む決まりは、`prepare-design-record`のdirectoryに`breaking_changes/`を作り、そこへ一件の記録として置く。記録の形（変わった版、旧名と新名の対応、変えた理由、古い成果物の読み方）は`task-design/templates/breaking_changes/20261115-rename-template-labels.md`に倣う。`breaking_changes/`のREADMEには、このskillの成果物で記録する例・しない例を書く。

`maintenance-plugin-context/SKILL.md`「Plugin version」の記録の対象を、「見出し・labelの名前で読めなくなること」から「見出し・labelの名前や、置き場所のpathで読めなくなること」へ広げる。広げないと、置き場所のpathの変更はこの仕組みの対象外になり、記録を置く根拠が無い。`task-design/templates/breaking_changes/`へは置かない。同directoryのREADMEは対象をtask-designの`design.md`、`tasklist.md`、`roadmap.md`に限っており、置き場所を決める担当とも違うためである。

## 論点17: task-designの、締めくくりの確認と公開の内部指示のfileの名前

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** 確かめるだけ（全部小。skillの内部のfileであり、後で一箇所の参照と一緒に直せる）

**依存先:** なし。論点4・15・16の後に、論点18とまとめて示す。

### イテレーション0（論点17）: task-designの締めくくりのfileの名前を仮決めする

#### 提案0（論点17）

このfileは、task-designが結果を返す前に読み、締めくくりの確認（`doc-enricher`の提案mode、議論記録からの再発防止先の見直し、skill自身の見直し）、plan無しで終わった変更の公開と記録をcommitへ載せる順序、実行を始めてよいかの確認を行う（論点6・9・12の決定）。

- a. `task-design/wrap-up.md`（仮決め）
  - 根拠: 決定で使ってきた「締めくくり」をそのまま英語にした。直上の`task-design/`が「task-designの」を語るため、fileの名前に「design」を重ねない（`naming/file.md`「直上ディレクトリのコンテキストを継承する」）。公開と実行開始の確認も、設計を締めくくって次へ渡す段に含まれる。
- b. `task-design/closing-review.md`
  - 見直しは読めるが、公開と実行開始の確認が入ることは読めない。

#### 検討記録（論点17・イテレーション0）

`task-design/`の既存の内部指示の名前（`tasklist-design.md`、`roadmap-design.md`、`work-handoff-contracts.md`）を確かめた。`work-handoff-contracts.md`の「handoff」は別のtask-designの実行への引き継ぎを指すため、紛れないよう「handoff」を使わない。

#### 提案0へのフィードバック（論点17）

**結果:** aに合意（論点17〜21をまとめて示した往復で「ok」と答えられた）

> ok

### 決定（論点17）

task-designの締めくくりの内部指示のfileの名前を`task-design/wrap-up.md`にする。締めくくりの確認、plan無しで終わった変更の公開と記録をcommitへ載せる順序、実行を始めてよいかの確認を持つ。直上の`task-design/`が「task-designの」を語るため、fileの名前に「design」を重ねない。別のtask-designの実行への引き継ぎを指す`work-handoff-contracts.md`の「handoff」と紛れないよう、「handoff」を使わない。

## 論点18: 置き場所を用意するskillの、前月summaryの生成の内部指示のfileの名前

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** 確かめるだけ（全部小。理由は論点17と同じ）

**依存先:** 論点4（skillの名前が決まれば、その配下の名前として揃えられる）。論点4は`prepare-design-record`に決まった。

### イテレーション0（論点18）: 前月summaryの生成のfileの名前を仮決めする

#### 提案0（論点18）

- a. `prepare-design-record/summarize-previous-month.md`（仮決め）
  - 根拠: このfileは、前月のdirectoryがあり`summary.md`が無い時に、前月の作業の一覧を作る手順である。`facilitate-discussion`の内部指示（`resolve-discussion.md`、`read-discussion.md`、`split-discussion.md`）と同じ、手順を動詞と目的語で表す形にした。
- b. `prepare-design-record/monthly-summary.md`
  - skillのdirectoryの中では、summaryそのもの（作られる一覧のfile）とも読める。

#### 検討記録（論点18・イテレーション0）

`plugins/tumeda-dev/skills/`の内部指示の名前の形を確かめた。`facilitate-discussion`は手順を動詞と目的語で、`task-design`は対象の名詞で名付けている。このfileは「前月の一覧を作る」手順であり、生成物（`summary.md`）と名前で紛れないよう動詞の形にした。

#### 提案0へのフィードバック（論点18）

**結果:** aに合意（論点17〜21をまとめて示した往復で「ok」と答えられた）

> ok

### 決定（論点18）

前月summaryの生成の内部指示のfileの名前を`prepare-design-record/summarize-previous-month.md`にする。手順を動詞と目的語で表し、生成物の`summary.md`と名前で紛れないようにする。

## 論点19: task-designの起動の入力

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** 確かめるだけ（全部小。論点1・11・14の決定から一つに導ける）

### イテレーション0（論点19）: 置き場所を`prepare-design-record`に任せた後の、task-designの入力を仮決めする

#### 提案0（論点19）

今のtask-designは、`working_dir_parent`と`create_working_dir`（defaultは`true`）を受け、`true`なら`<working_dir_parent または今のdirectory>/<YYYYMMDD-slug>`を自分で作り、`false`なら渡されたdirectoryをそのまま使う。steeringは`create_working_dir=false`で自分のdirectoryを渡していた。

- a. 新しい作業か、既にある作業かで入力を分け、`working_dir_parent`と`create_working_dir`を無くす（仮決め）
  - 新しい作業: 置き場所を渡さない。task-designが`prepare-design-record`を呼び、`.design-records/YYYY/YYYYMM/YYYYMMDD-slug/`を用意させる。任意の`branch_from_basename`を受け、そのまま渡す（`escalate-plugin-skill-fix`が使う）。
  - 既にある作業の再開: `working_dir=<絶対path>`を受け、そのまま使う。存在しなければ推測せず利用者へ確かめる。
  - roadmapの子phase: 新しい作業として扱い、今と同じ四項目（`parent_roadmap_path`、`parent_phase_id`、`parent_design_path`、`dependency_results`）を受ける。
  - 根拠: 論点1の決定「単独で起動したtask-designも同じ置き場所を使う」と、論点11の決定（置き場所の準備は`prepare-design-record`）。今の二つの入力は、任意の親directoryの下に作る使い方のためのもので、置き場所が一通りになると使い道が無い。
- b. 二つの入力を残し、`working_dir_parent`を省いた時だけ`prepare-design-record`を呼ぶ
  - `.design-records/`の外に設計を作る道が残り、置き場所が二通りに戻る。

#### 検討記録（論点19・イテレーション0）

`task-design/SKILL.md` PrepareStep 2の入力契約と、`working_dir_parent`・`create_working_dir`を使う箇所（`steering/SKILL.md`、`scripts/verification/validate-plugin.mjs`、`exhaustive-review/SKILL.md`）を確かめた。`exhaustive-review`は同名の入力を自分の成果物の置き場所として別に持っており、task-designの入力とは独立しているため、この論点では変えない。

#### 提案0へのフィードバック（論点19）

**結果:** aに合意（論点17〜21をまとめて示した往復で「ok」と答えられた）

> ok

### 決定（論点19）

task-designの起動の入力から`working_dir_parent`と`create_working_dir`を無くす。新しい作業では置き場所を渡さず、task-designが`prepare-design-record`を呼んで`.design-records/YYYY/YYYYMM/YYYYMMDD-slug/`を用意させる。任意の`branch_from_basename`を受け、そのまま`prepare-design-record`へ渡す。既にある作業を再開する時は`working_dir=<絶対path>`を受けてそのまま使い、存在しなければ推測せず利用者へ確かめる。roadmapの子phaseは新しい作業として扱い、今と同じ四項目（`parent_roadmap_path`、`parent_phase_id`、`parent_design_path`、`dependency_results`）を受ける。置き場所が一通りになり、任意の親directoryの下に作る入力の使い道が無くなったためである。`exhaustive-review`の同名の入力は自分の成果物の置き場所であり、変えない。

## 論点20: roadmapのtemplateの、steeringを名指す見出しとlabel

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** 確かめるだけ（全部小。論点3・15の決定と、論点16で広げた`breaking_changes/`の決まりから導ける）

### イテレーション0（論点20）: roadmapの見出しとlabelの書き換えと、読み替えの記録を仮決めする

#### 提案0（論点20）

`task-design/templates/roadmap.md`は、phaseごとに「### 進み具合（steeringだけが更新する）」という見出しと「子steering: 未割当」というlabelを持ち、steeringがこの名前で探して更新している。`task-design/roadmap-design.md`も「steeringだけが更新する進み具合」「子steering path」と書く。

- a. 見出しを「### 進み具合（advance-roadmapだけが更新する）」、labelを「子の設計の記録: 未割当」（値は子phaseの`.design-records/…`のpath）へ変え、`task-design/templates/breaking_changes/`へ旧名と新名の対応を一件記録する（仮決め）
  - 根拠: 論点3・15の決定で、進み具合を書くのは`advance-roadmap`だけになり、子phaseは子steeringではなく一つの設計の記録になる。見出しとlabelは名前で読まれるため、`maintenance-plugin-context/SKILL.md`「Plugin version」の決まりで記録が要る。記録の形は`20261115-rename-template-labels.md`に倣う。
- b. 見出しとlabelは変えず、読む側だけを`advance-roadmap`にする
  - 無くなるskillの名前が、新しく作るroadmapにも残り続ける。

#### 検討記録（論点20・イテレーション0）

`task-design/templates/roadmap.md`と`roadmap-design.md`の`steering`を含む行（`grep -n steering`）を確かめた。見出しとlabelのほか、本文の説明（「各phaseは独立した子steeringを通じて設計・実装し」等）も子steeringを名指しており、名前で読まれない本文は記録なしで書き換える。

#### 提案0へのフィードバック（論点20）

**結果:** aに合意（論点17〜21をまとめて示した往復で「ok」と答えられた）

> ok

### 決定（論点20）

`task-design/templates/roadmap.md`の見出し「### 進み具合（steeringだけが更新する）」を「### 進み具合（advance-roadmapだけが更新する）」へ、label「子steering」を「子の設計の記録」（値は子phaseの`.design-records/…`のpath）へ変える。見出しとlabelは名前で読まれるため、`task-design/templates/breaking_changes/`へ旧名と新名の対応を一件記録する。名前で読まれない本文（`roadmap.md`の説明、`roadmap-design.md`の記述）の子steeringやsteeringは、記録なしで新しい担当へ書き換える。


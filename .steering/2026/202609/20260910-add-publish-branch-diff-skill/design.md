# Design: 作業中の branch の差分を見える状態にする skill を作る

## 元の依頼内容

escalateスキルでpluginにスキル作りたい。
今いるブランチの差分を見えるようにプッシュするスキル。
prがなかったら、今steeringにあるpr作るスクリプトで作る（共用できるところに置く）
プッシュできるだけコミットがなかったら空コミットする

依頼の起点は「ちょっと、出来上がったものを見たい」である。利用先 repository で作業中、成果物がまだ local にしか無く、依頼者が中身を確認できない状態が起きた。

---

## TL;DR

作業中の branch の内容を、依頼者が GitHub 上で読める状態にする手段が skill として存在しない。現状は commit、push、PR 作成を毎回その場で組み立てており、commit が無い場合や PR が既にある場合の扱いも都度判断になっている。`share-work-in-progress` は「今いる branch の内容が GitHub 上で見える」という結果を一つの起動で成立させる。終了時には、skill 本体と、二つの skill が共用する PR 作成 script の配置が揃う。

あわせて `tasklist.md` の template から、実行契約と作成規約の二重記載になっている冒頭を外す。生成される tasklist が `## Phase 1` から始まり、規則の正本が一箇所に定まる。

---

## 完成後の姿

### skillの役割と方針

#### share-work-in-progress

`share-work-in-progress` は、作業中の branch の内容を、依頼者が GitHub 上で読める状態にする。利用後、依頼者は URL を開くだけで現在の成果物を確認でき、依頼される側は commit、push、PR 作成の手順を毎回組み立てなくて済む。

##### 見せたい内容を取りこぼさない

この skill は working tree の全部を commit してから公開する。untracked を含む未 commit の変更をすべて stage し、一つの commit にする。

commit する範囲を「working tree の全部」という一つの規則で決めるのは、範囲の判断を skill が抱えないためである。どれを含めどれを外すかを skill が判断すると、判断のたびに正しさを問える基準が必要になり、誤れば見せたいものが欠ける。

未 commit の変更があるときに停止しない。停止すると依頼者は commit してから呼び直すことになり、「今の状態を見たい」に対して二往復が要る。未 commit を放置して push する形も採らない。依頼者は push の報告を受けるのに、URL には見たい中身が無い状態になる。

この skill が作る commit は、後から amend や rebase で整理される前提を持つ。履歴として残すための commit ではない。

##### 作業途中の共有であり、完成物の公開ではない

`tasklist-executor` は「ユーザー動作確認が完了するまで commit・push・PR を行わない」契約を持ち、公開は動作確認の後に来る。この skill は動作確認の前に呼ばれる。両者は公開の前提が逆であり、手順を共通化しない。

`tasklist-executor` の push・PR 手順をこの skill へ寄せると、`tasklist-executor` の gate をどちらが持つかという判断が新たに生じる。さらにこの skill は working tree を丸ごと commit するため、`tasklist-executor` が task 単位で積み上げた commit の途中に未整理の commit が混ざり得る。

両者が重複して持つのは「同じ head branch の open PR を重複作成しない」処理だけであり、これは PR 作成 script が担う。script を共用する。

##### 運用形態を推定しない

current branch が remote の default branch である場合、この skill は運用形態を推定しない。default branch を保護対象として PR 経由で更新する repository と、default branch をそのまま作業 branch として使う repository では、同じ操作の意味が反転する。

merged PR の有無、branch protection の設定、default branch 以外の branch の有無、利用先 context の宣言は、いずれも推定にしかならない。推定を分岐条件にすると、誤判定の余地が skill の内側に入る。その repository を知っている利用者が確認の場で判断する。

##### 他者が進めた remote を上書きしない

push が reject されたとき、この skill は force push を行わない。停止して、remote と分岐していることを原因として報告する。

この skill の通常の使い方では reject は起きにくい。working tree の全部を一つの commit にして積み上げる形は fast-forward であり、local HEAD は常に remote HEAD の子孫になる。実際に遭遇する reject は、別 machine や別 session からの push、remote 側の force push といった他者起因が主になる。そこで自動的に force すると他の作業を消す。

`--force-with-lease` による自動再試行も採らない。この保護は「自分が最後に fetch した remote 先端」との比較で成り立つため、手順に `git fetch` を挟むと効かなくなる。安全性が手順の書き方に依存する形にしない。

##### 能力境界

この skill は PR を merge しない。PR 本文を生成する仕組みも持たない。本文は PR 作成 script が持つ範囲に留める。利用先 repository の CI や自動化を変更しない。

### workflow

**ownerと責務:**

| owner | 判断・更新するもの | 行わないこと | single source of truth |
| --- | --- | --- | --- |
| `share-work-in-progress` | commit の要否、push、PR の存在確認の起動 | 変更内容の作成、PR の merge、force push | remote branch の HEAD と PR の URL |
| `create_or_get_pr.sh` | 同じ head branch の open PR の有無、無い場合の作成 | commit、push | GitHub 上の PR |
| 利用者 | default branch で実行してよいか、reject 後に force するか | — | 確認への回答 |

**状態と遷移:**

```text
起動 --{detached HEAD、または remote 不在}--> 停止して報告
起動 --{current branch が default branch}--> 利用者へ確認
利用者へ確認 --{承認されない}--> 停止して報告
利用者へ確認 --{承認}--> commit 判定
起動 --{current branch が default branch でない}--> commit 判定
commit 判定 --{未 commit の変更あり}--> working tree の全部を 1 commit
commit 判定 --{未 commit なし、かつ remote と HEAD が同じ}--> 空 commit
commit 判定 --{未 commit なし、かつ push できる commit あり}--> push
working tree の全部を 1 commit --> push
空 commit --> push
push --{reject}--> 停止して報告（remote と分岐している）
push --{成功、かつ default branch}--> push までを部分成功として報告
push --{成功、かつ default branch でない}--> PR 確認
PR 確認 --{gh が使えない}--> push までを部分成功として報告
PR 確認 --{open PR あり}--> URL を返す
PR 確認 --{open PR なし}--> create_or_get_pr.sh で作成して URL を返す
```

**必須順序とhandoff:**

1. current branch、remote の有無、default branch 名を確認する。detached HEAD または remote 不在なら停止する。
2. current branch が default branch なら、commit する前に利用者へ確認を取る。承認されなければ停止する。
3. 未 commit の変更があれば、untracked を含めてすべて stage し、一つの commit にする。commit message は `WIP: share work in progress` とする。
4. 未 commit の変更が無く、かつ remote と HEAD が同じで push できる commit も無い場合だけ、空 commit を作る。空 commit は PR を成立させるための最小差分であり、見せるための差分ではない。
5. current branch を push する。reject されたら停止し、remote と分岐していることを報告する。
6. default branch でなく、かつ `gh` が使える場合だけ、`create_or_get_pr.sh` を呼ぶ。既に open PR があれば作成せず URL が返る。
7. 到達した地点を報告する。PR の URL、または push までで止まった理由を示す。

**失敗・取消・再開:**

- detached HEAD、remote 不在: 停止する。確認を取っても実行できないため、確認を挟まない。
- default branch での不承認: 停止する。commit を作る前に停止するため、working tree は変わらない。
- push の reject: 停止する。commit は作られた後であり、local には残る。利用者が分岐を解消してから呼び直す。
- `gh` の不使用、または GitHub でない repository: push までを部分成功として報告する。remote に branch があれば差分は読める。
- default branch での実行: PR を作れないため、push までを部分成功として報告する。

### documentation以外のfile deliverable

**対象と読者:**

| file | 主な読者 | 読後または利用後にできること |
| --- | --- | --- |
| `plugins/tumeda-dev/skills/share-work-in-progress/SKILL.md` | この skill を起動する AI agent | 起動条件、実行順序、停止条件、部分成功の報告内容を判断できる |
| `plugins/tumeda-dev/skills/scripts/github/create_or_get_pr.sh` | `share-work-in-progress` と `tasklist-executor` | 同じ head branch の open PR を重複作成せずに URL を得る |
| `plugins/tumeda-dev/skills/README.md` | 人間 | skill 群を俯瞰したときに `share-work-in-progress` の位置が分かる |
| `plugins/tumeda-dev/skills/task-design/templates/tasklist.md` | `tasklist.md` を生成する task-design と、生成された tasklist を読む人 | 冒頭から phase を読み始められる。完了・取消・更新 timing の規則がどこにあるかを末尾から辿れる |
| `scripts/verification/validate-plugin.mjs` | この repository の検証 | template の末尾に参照節があり、design への導線が保たれていることを検査できる |

**完成後の内容と構造:**

```text
plugins/tumeda-dev/skills/share-work-in-progress/SKILL.md
├── frontmatter（name, description）
├── 目的と成果 — 何を成立させるか
├── 起動gate — いつ起動し、いつ起動しないか。tasklist-executor との境界
├── 停止条件 — detached HEAD、remote 不在
├── 確認を取る条件 — current branch が default branch
├── 実行workflow — 確認 → commit → push → PR
├── 部分成功の扱い — default branch、gh 不使用
├── 失敗の扱い — push の reject
└── このskillが絶対にやらないこと — force push、PR の merge、PR 本文の生成

plugins/tumeda-dev/skills/scripts/
└── github/
    └── create_or_get_pr.sh（tasklist-executor 配下から移動。内容は変えない）

plugins/tumeda-dev/skills/task-design/templates/tasklist.md
├── ## Phase 1: …（file の先頭）
├── …（既存の phase、品質check、Documentation review、動作確認、完了後のaction）
└── ## 参照（末尾へ新設）
    ├── 設計の正本: 同じdirectoryの ./design.md
    ├── 完了条件、取消完了、subtask分割、checkbox更新timingの規則: tasklist-executor/SKILL.md
    └── tasklistへ載せるtaskの範囲: task-design/tasklist-design.md
```

template から外すのは、`# タスクリスト` の見出し、`## 設計参照` 節、`## 🚨 タスク完全完了の原則` 節の全体である。いずれも他所に正本がある。

| template の記述 | 正本 |
| --- | --- |
| `## 設計参照` と `./design.md` | `tasklist-executor/SKILL.md`「受け取ったtasklist pathを絶対pathへ解決し、その同directoryの`./design.md`を設計の正本として必ず読む」 |
| すべての task を `[x]` にする、未完了で `completed` を返さない | `tasklist-executor/SKILL.md` の最重要原則と禁止事項 |
| 時間・難しさ・host を取消理由にしない | `tasklist-executor/SKILL.md` の最重要原則 |
| 取消完了が許可される唯一の case | `tasklist-executor/SKILL.md` の最重要原則 |
| task が大きすぎる場合の subtask 分割 | `tasklist-executor/SKILL.md` の最重要原則 |
| 実測完了直後に `[x]`、まとめて更新しない | `tasklist-executor/SKILL.md` の最重要原則と `task-design/tasklist-design.md` |
| 実装可能な task だけを計画する | `task-design/tasklist-design.md`。これは作成側の規約であり、実行する側が読むものではない |

末尾へ本文ではなく参照だけを置くのは、規則の所在を失わせないためである。tasklist を単独で開いた読み手が、どこを見れば規則が分かるかを辿れる。

template を更新しても既に生成された tasklist は追随しないため、各 tasklist の冒頭は結果として「その作業が当時どの規則で運用されたか」の記録として働いていた。この性質は意図された設計ではなく副産物であり、記録として機能させるなら plugin version を明示する形が要る。副産物に依存せず、正本を一箇所に定めて所在だけを示す。

`roadmap.md` の template は対象にしない。`## 設計参照` は持つが、最初の phase までが六行で、そのうち `## 概要` は task 全体の目的を書く実体のある節である。冒頭を読み飛ばす負担が生じていない。

**記載する原則と例:**

- 運用形態を推定せず、判断を利用者へ返す
  - 今回の具体例: current branch が default branch のとき、merged PR の有無や branch protection から運用形態を推定せず、確認を取る
  - 意図に反する薄い記述: 「default branch では注意する」。何を判定し、判定できないとき誰に返すかが決まらない
- 実行できない異常と、確認を経れば実行できる状況を区別する
  - 今回の具体例: detached HEAD と remote 不在は停止、default branch は確認
  - 意図に反する薄い記述: 「異常時は停止する」。確認で解ける状況まで停止に倒れる
- 目的が部分的に達成できる場面で、達成しない結果を返さない
  - 今回の具体例: `gh` が使えなくても push まで進め、PR を作れなかったことを報告する
  - 意図に反する薄い記述: 「失敗したら報告する」。どこまで進んだかが利用者に伝わらない

**配置・形式:**

- 配置: `plugins/tumeda-dev/skills/share-work-in-progress/`
- 形式: Markdown。frontmatter に `name` と `description` を持つ。既存 skill と同じ
- 参照する既存pattern: `plugins/tumeda-dev/skills/name-work-directory/`（`SKILL.md` を持つ最小構成）
- `agents/openai.yaml`: 作らない。12 skill 中 8 skill が持たず、持たない側には `steering`、`task-design`、`tasklist-executor`、`doc-enricher` といった workflow を持つ skill が並ぶ。この skill も workflow を持つ側にあたる
- 正本と重複防止: script の内容は変えない。移動だけを行い、参照元三箇所の path を同じ変更で更新する

---

## 要件（Requirements）

### MUST（必達）

- 一度の起動で、今いる branch の内容が GitHub 上で読める状態になる。
- push できる commit が無い場合も、起動が「何もできない」で終わらない。
- 同じ head branch に open PR が既にある場合、PR を重複作成しない。
- PR 作成 script が、`share-work-in-progress` と `tasklist-executor` の両方から対等に参照できる場所にある。
- default branch を作業 branch として運用する repository でも、確認を経れば目的を達成できる。
- 他者が進めた remote を、この skill が上書きしない。
- `tasklist.md` の template から生成される tasklist が `## Phase 1` から始まる。
- template から外した規則が、他所の正本から読める状態を保つ。

### SHOULD（できれば）

- 部分的にしか進めなかった場合、何がどこまで済んだかが報告から分かる。

### MAY（あれば嬉しい）

- なし

### 非目標

- PR を merge しない。
- PR 本文を自動生成する仕組みを新たに作らない。既存 script が持つ範囲に留める。
- 利用先 repository の CI や自動化を変更しない。
- `tasklist-executor` の push・PR 手順をこの skill へ統合しない。
- 利用先 context へ「default branch を作業 branch として運用する」宣言を持たせて確認を省く仕組みを、今回は作らない。繰り返しの確認が負担になった時点で検討する。

### 受け入れ基準

- `scripts/verification/validate-plugin.mjs` が通る。
- `grep -rn "create_or_get_pr" plugins/tumeda-dev/` の結果に、移動前の path が残っていない。
- `SKILL.md` だけを入力として、停止する場合と確認を取る場合と部分成功で終わる場合を、実装者が区別できる。
- `plugins/tumeda-dev/skills/task-design/templates/tasklist.md` の一行目が `## Phase 1` で始まる。
- 同 template の末尾から、設計の正本と、完了・取消・更新 timing の規則の正本を辿れる。
- 起点となったケース（default branch でない作業 branch、commit ゼロ、untracked の成果物あり）に対し、SKILL.md の手順を辿ると commit、push、PR 作成まで到達すると読める。

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| script を移動すると、既存の三箇所の参照が壊れる | 参照元を同じ変更で更新する。参照元は `tasklist-executor/SKILL.md`、`task-design/templates/tasklist.md`、`task-design/tasklist-design.md` |
| `skills/scripts/` が skill 名と紛れる | `SKILL.md` を持たないため loader は skill として拾わない。`scripts/verification/validate-plugin.mjs` も skill directory を列挙しないため、検査は通る。残るのは人が一覧を見たときの読みにくさであり、`skills/README.md` の「共有リファレンス」節に script を含めることで所在を示す |
| 共有のための commit が履歴に残り続ける | commit message を `WIP: share work in progress` とし、整理される前提の commit であることを message から読めるようにする |
| 保護された default branch へ未整理の commit が入る | commit する前に利用者へ確認を取る。承認されなければ working tree を変えずに停止する |
| template の冒頭を外したことで、`validate-plugin.mjs` の既存検査が落ちる | 落ちるのは四つである。`## 設計参照` は末尾の `## 参照` へ対象を移す。残る三つは規則の正本である `tasklist-executor/SKILL.md` へ対象を移し、検査文字列を移し先の実文言へ合わせる。`./design.md` は別行で独立に検査されているため、design への導線の担保は変わらない |
| 規則を移す先に、その規則が存在しない | 「phase 末や作業末にまとめて更新しない」は `tasklist-executor/SKILL.md` に無い。移す前に同 file の停止・再開節へ追記する。追記しないまま検査対象だけ移すと、検査が通らないか、通っても規則が失われる |
| 生成済みの tasklist と template の形が食い違う | 既に生成された tasklist は追随させない。template は今後生成されるものへ効く。既存 tasklist の冒頭は当時の形のまま残す |

---

## テスト方針

- `scripts/verification/validate-plugin.mjs` を実行し、manifest の整合と `expectedRelease` の一致を確認する。
- `grep -rn "create_or_get_pr" plugins/tumeda-dev/` を実行し、移動後の path だけが現れることを確認する。
- 移動後の `create_or_get_pr.sh` に実行権限が残っていることを確認する。
- 起点となったケースを実際の対象として skill の手順を辿り、commit、push、PR 作成まで到達することを実測する。

---

## （付録）前提とする既存仕様

- **PR 作成 script の現在地**: `plugins/tumeda-dev/skills/tasklist-executor/scripts/github/create_or_get_pr.sh`。依頼文では「steering にある」とされているが、実際は `tasklist-executor` 配下にある。
- **script の挙動**: `--base` / `--head` / `--title` / `--body` を受ける。`--head` 未指定なら current branch、`--base` 未指定なら repository の default branch を使う。同じ head の open PR があれば作成せず URL を返す。利用先の context に `Branch / issue 契約`（`feature-<issue番号>`）が宣言されていて branch 名が該当する場合、issue title を PR title に、`Closes #N` を body に使う。push は行わない。
- **script の参照元**: `tasklist-executor/SKILL.md`（同梱の説明）、`task-design/templates/tasklist.md`（tasklist の PR task 雛形）、`task-design/tasklist-design.md`（push・PR section の生成条件）。
- **壊れた symlink**: `scripts/for_local/github/create_or_get_pr.sh` は `<repo root>/skills/steering/scripts/github/create_or_get_pr.sh` を指しているが、この path は存在しない。skill 群が `plugins/tumeda-dev/skills/` へ移り、script が `tasklist-executor` 配下へ移った際に更新されていない。`scripts/for_local/` は `.gitignore` の対象で、`.gitignore` 自身だけが追跡されている。
- **空の残骸 directory**: `plugins/tumeda-dev/skills/steering/scripts/github/` が file を持たない状態で残っている。git は空 directory を追跡しないため、local にだけ存在する。
- **context の記述**: `plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md` は PR 作成 script の path を `scripts/for_local/github/create_or_get_pr.sh` と記載している。これは local の symlink 経由の path であり、symlink の指し先が正しければ記述は有効なままになる。
- **skill の配置と mirror**: skill は `plugins/tumeda-dev/skills/<name>/SKILL.md` に置く。`.agents/skills` は `../plugins/tumeda-dev/skills` への symlink であり、新しい skill を追加しても手動同期は不要。
- **loader と validator の挙動**: skill の loader は `skills/*/SKILL.md` を探す。`scripts/verification/validate-plugin.mjs` は skill directory を列挙せず、特定 file の存在と manifest の値だけを検査する。
- **skills/README.md の規約**: skill が増減したら README も更新する。詳細は書かず、見出し 1 行の追加・削除で済ませる。`skills/` 直下には「共有リファレンス（skill ではない）」として `runtime-execution-contracts.md`、`runtime-model-profiles.md`、`tumeda-dev-plugin-context.md` が置かれている。
- **`agents/openai.yaml` の分布**: 12 skill 中 4 skill（`name-work-directory`、`facilitate-discussion`、`maintenance-plugin-context`、`escalate-plugin-skill-fix`）が持つ。持たない 8 skill には `steering`、`task-design`、`tasklist-executor`、`doc-enricher`、`document-review`、`test-runner`、`think-through`、`visual-inspector` が含まれる。
- **version 規約**: 配布 version は `MAJOR.MINOR.PATCH` のみ。「consumer が新たに呼べるものが増えたか」で MINOR と PATCH を分ける。新しい skill は MINOR。bump は宣言値 4 箇所と `scripts/verification/validate-plugin.mjs` の `expectedRelease` 1 箇所の計 5 箇所を一度に変える。現在は `7.5.1`。
- **検証手段**: 自動 test framework を持たない。`scripts/verification/validate-plugin.mjs` が manifest の整合を確認する。skill 本文の内容は人の review で担保する。
- **validator が template へ課す検査**: `scripts/verification/validate-plugin.mjs` は `task-design/templates/tasklist.md` に対し `requireText` を十二個持つ。433 行から 437 行に `## 設計参照`、`./design.md`、`facilitate-discussion`、`implementation_review.md`、`特定の\`steering\` callerへ固定しない`、833 行から 842 行に `phase末や作業末にまとめて更新しない`、`時間不足`、`合意済みplanの変更によって元taskが不要または別実装へ置換`、`原文、関連する実装・design・plan、原因、採用方針、決定`、`review後に実装を自動再開しない`、`current branchが公開可能なnon-default branch`、832 行に PR 作成 script の path がある。このうち preamble の削除で失われるのは `## 設計参照`、`phase末や作業末にまとめて更新しない`、`時間不足`、`合意済みplanの変更によって元taskが不要または別実装へ置換` の四つである。script の移動で失われるのは 832 行の path 一つで、827 行の `requireExists` と 831 行の `requireText(tasklistDesign, ...)` も同じ path を持つ。
- **validator が持つ移動元ガード**: `requireAbsent(skillPath("steering/scripts/github/create_or_get_pr.sh"))` が 830 行にある。前回 script を移動した際に、移動元へ復活しないよう置かれたものである。
- **`tasklist-executor/SKILL.md` に無い規則**: 「phase 末や作業末にまとめて更新しない」に相当する記述を持たない。「DoD の各条件は『試みた』ではなく『実際に通過した』ことを確認してから `[x]` にする」はあるが、全 task を実測してから一括で `[x]` を付ける形はこれを満たすため、導出できない。
- **`think_standards` の維持規律**: `docs/think_standards/evolution_policy.md` が「場面駆動 + 主軸/補助」モデルを定め、場面駆動を崩さないこと、各場面の主軸を一つに絞ることを求めている。
- **validator の可搬性検査**: `thinkStandardsFiles` に列挙された file は `portableFiles` へ含まれ、利用先 repository 名、利用者の絶対 path、commit hash、固定 localhost URL の混入を機械的に弾かれる。
- **`roadmap.md` template の構成**: `## 設計参照` を持つが、`## 🚨 タスク完全完了の原則` に相当する節を持たない。最初の phase までが六行で、そのうち `## 概要` は task 全体の目的を書く実体のある節である。

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |
| `plugins/tumeda-dev/docs/think_standards/questioning_existing.md` | 場面「既存のものを消す・残すを判断する」を新設。主軸は歴史的経緯と合理的必然性の分離、補助は運用で測ること、複製と所在の指示の区別。末尾に失敗例 | `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出力。可搬性検査も通過 | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) |
| `plugins/tumeda-dev/docs/think_standards/README.md` | 収録一覧へ一行追加 | 同上 | 同上 |
| `scripts/verification/validate-plugin.mjs` の `thinkStandardsFiles` | 新設 file を一行追加し、可搬性検査の対象へ含めた | 同上 | 同上 |
| `plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md` | `Git / GitHub公開条件` へ、PR 作成 script の参照が plugin 内 path を指す symlink であり、再配置時に張り替えが要る旨を追記 | 同上 | [（付録）前提とする既存仕様](#付録前提とする既存仕様) |
| `plugins/tumeda-dev/skills/task-design/SKILL.md` | Step 4 の「対象語の網羅確認」を一般則「確認範囲が主張範囲を覆っているか」へ拡張。既存内容は具体例として保持し、実行結果の断定に関する具体例を追加 | `plugin validation passed`。改名で一度 validation が落ち、検査行を合わせて再実行 | `implementation_review.md` 論点1 |
| `scripts/verification/validate-plugin.mjs` の `requireText(taskDesignSkill, ...)` | 上記の改名に検査文字列を追随 | 同上 | `implementation_review.md` 論点1 |

### task-design内の対象成果物反映待ち

なし

### execution plan対象

| 対象 | 掲載理由 | 参照するdesign section |
| --- | --- | --- |
| `plugins/tumeda-dev/skills/share-work-in-progress/SKILL.md` | 利用者へ届ける本番成果物の新規追加。この plugin の product は skill 本体である | [skillの役割と方針](#skillの役割と方針) |
| `create_or_get_pr.sh` の移動と参照元三箇所の更新 | 移動と参照更新が同時に成立しないと壊れる。順序依存がある | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) |
| `plugins/tumeda-dev/skills/README.md` | skill の増減に伴う既存 README の更新。skill 追加と同じ実装 scope に含む | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) |
| version 宣言 4 箇所と `expectedRelease` 1 箇所 | 新しい skill が増えるため MINOR bump。5 箇所を一度に変える必要があり、`validate-plugin.mjs` の実行で検証する | [（付録）前提とする既存仕様](#付録前提とする既存仕様) |
| local の後片付け（`scripts/for_local/github/create_or_get_pr.sh` の symlink 張り替え、`skills/steering/scripts/github/` の削除） | git の diff を生まないが、行わないと context に記載された access path が壊れる。移動と同じ順序に属する | [（付録）前提とする既存仕様](#付録前提とする既存仕様) |
| `templates/tasklist.md` の preamble 削除と参照節新設、`tasklist-executor/SKILL.md` への規則追記、`validate-plugin.mjs` の四検査の移設 | 三つが同時に成立しないと validation が落ちるか、規則が失われる。順序依存がある | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) |
| `share-work-in-progress` を起点ケースへ実行して動作確認 | 作った skill を実際に使って初めて確定する。利用先 repository の作業 branch を対象にする | [テスト方針](#テスト方針) |

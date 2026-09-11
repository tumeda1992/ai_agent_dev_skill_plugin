# Design: skill が依拠する参照先と条件を明示する

## 元の依頼内容

利用先 repository での steering 実行中に判明した、この plugin 側の不備 4 件を直す。escalate-plugin-skill-fix 経由の引き渡し。固有情報は migration.md の規約に従って除去済み。

### 事項1: `plugins/tumeda-dev/skills/task-design/tasklist-design.md:122` の条件文が曖昧

該当文: 「local Git運用条件がrepository contextから返された場合、またはユーザーが明示的にcommitを要求した場合だけcommit sectionを生成する。」

書かれていないもの: (a) 返されなかった場合の扱い、(b)「返された」の判定基準。`maintenance-plugin-context` が Git 運用条件を明示的に列挙しなかった状態を「返されていない」と読むのか、context 全体が返ってきたことを「返された」と読むのかが決まらない。

実害: この曖昧さを起点に、assistant が「git 運用条件が context から返らないかもしれないので tasklist に commit task を置けない」という存在しない blocker を作り、ユーザーへ提示した。ユーザーから「ごめん言ってる意味がわからない？返るって何？commitってなんでこの話になった？」「何度も扱ってるtask-designスキルとtasklistで今更これが論議されるのもわからない」という指摘を受けて撤回した。撤回の根拠は、同じ利用先 repository の直前の steering の tasklist が、同じ context 条件下で commit/push task を持っていた実績である。

### 事項2: `share-work-in-progress` の空 commit 条件が discussion の決定と乖離

乖離の所在（実測済み）:

- `.steering/2026/202609/20260910-add-publish-branch-diff-skill/task-design-discussion.md:67` の決定: 「空 commit を作るのは、commit するものが何も無く、かつ remote の default branch と同一 HEAD で PR を作れない場合だけである」
- 同 `design.md:102` および `plugins/tumeda-dev/skills/share-work-in-progress/SKILL.md` の手順4: 「未 commit の変更が無く、かつ remote と HEAD が同じで push できる commit も無い場合だけ、空 commit を作る」

後者のほうが広い。実害: 非 default branch が remote と同期済みで、open PR も既存という条件では、広い側は PR を成立させる必要が無いのに空 commit を作る。引き渡し元の利用先 repository の作業 branch が現にその条件だった。

どちらが正しいかは未決。design phase で決める。

### 事項3: harness gate の一般則が `runtime-execution-contracts.md` に無い

事象: 利用先 repository で、稼働中の外部 resource へ変更を適用する command を実行しようとしたところ、harness の auto mode classifier が block した。task level では適用してよいと design で判定済みだった（差分が新規 resource の追加だけで、既存 resource への change と destroy が 0 件）。

一般則: task level で authorize されていることと、harness classifier が実行を通すことは別の層である。agent は「判断してよい」ことと「実行できる」ことを区別する必要があり、classifier に block された場合は迂回せず停止して利用者へ返す。

利用先 repository 側には、そこで有効な具体手順を既に記載済み。この plugin 側へ書くのは層の存在という一般則だけであり、特定の実行基盤に依存する手順は書かない。

### 事項4: skill 群から naming 標準への導線が無い（方針はユーザー合意済み）

実測した事実:

- `plugins/tumeda-dev/skills/` から `plugins/tumeda-dev/docs/development_standards/naming/` への参照は 0 件
- 唯一の導線は `plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md:92` の「`plugins/tumeda-dev/docs/development_standards/`: 命名、entity modeling等のrepository非依存な設計標準。」という directory 単位の言及だけ
- `plugins/tumeda-dev/docs/development_standards/` に README が無い。`plugins/tumeda-dev/docs/think_standards/README.md` は場面と file の対応および引き方を持っている

起点: branch 名を決める場面で assistant が `naming/core.md` を参照せず、「他サービスでの語の衝突」という自前の基準で対案を潰した。ユーザーから「steeringのプラグインのドキュメントに書いてあるよね plugins/tumeda-dev/docs/development_standards/naming/core.md」と指摘された。根本原因は基準の誤適用ではなく、基準の存在を想起しなかったことである。

ユーザー合意済みの方針:

- `plugins/tumeda-dev/docs/development_standards/README.md` を作る。収録一覧と引き方を持たせる
- `task-design` は `development_standards` を毎回全部参照する。該当場面かどうかを skill 側で判定させない（今回の失敗が「命名判断の場面だと自分で判定しなかった」形で起きたため）
- `name-work-directory` は `naming/` を参照する
- `facilitate-discussion` が何を参照すべきかは未確定。assistant の見解は「参照義務を置かない」。根拠は、この skill は議論の進行形式を所有し提案内容の正しさは consumer が所有すること、および `facilitate-discussion` は task-design agent 自身が適用する契約であり task-design が全部参照していれば同じ context に載ること。この見解は検証対象であり、この design で結論を出す
- 「毎回全部参照する」は `development_standards` 配下の file 数に依存する契約である。file が増えて成立しなくなる場合の扱いを README の維持規律として決める

採らなかった案と理由: `think_standards/` へ「名前を決める場面」を置く案は、`think_standards/README.md` が「ドメイン固有の判断基準（命名、architecture等）は対象外であり、対応する専用documentが持つ」と明記しているため境界と衝突する。

### 付随して観測した軽微な点

`plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md` は「正本は`migration.md`である」と書いているが path を示していない。実体は `plugins/tumeda-dev/skills/maintenance-plugin-context/maintenance_policies/migration.md` にあり、探索が 1 手余分にかかった。design で扱うかは判断してよい。

### 制約

- 事項4 以外は方針を付けていない。design から起こす
- 利用先 repository 側の変更は不要
- version bump の要否は maintenance-plugin-context の規約に従う

---

## TL;DR

4 件はどれも個別 skill の機能不足ではなく、**skill が依拠している参照先と条件を、skill 自身から辿れない**という同じ形の不備である。読み手である agent は、条件文の空白を自分の推測で埋め、存在する標準を想起できず、存在しない blocker を作った。

終了時に成立するのは、条件文が「満たさなかった場合」まで書かれていること、同じ条件が二つの正本で食い違っていないこと、実行が止まる層の存在が契約として書かれていること、設計判断に使う標準へ skill 自身から導線が張られていることである。

---

## 完成後の姿

### skillの役割と方針

#### task-design

task-design は、後続作業で新しい設計判断を生じさせず、合意済み内容を手を動かして反映するだけの状態を作る。この role は変わらない。今回変わるのは、その判断を下すときに何を入力とするかである。

##### 設計標準は場面判定を挟まずに参照する

task-design は `plugins/tumeda-dev/docs/development_standards/` 配下を毎回すべて参照する。「今回は命名判断を含むか」「entity 設計に該当するか」を skill 側で判定しない。

判定を挟まない理由は、今回の失敗が「命名判断の場面であることを自分で判定しなかった」形で起きたためである。場面判定を条件にすると、判定を誤った経路だけが標準に触れないまま進み、しかもその経路では「該当しないと判断した」という自覚が残らない。参照を無条件にすれば、判定の誤りが参照の欠落へ伝播しない。

違反 signal は、命名・entity 設計に触れる提案を出しているのに、`development_standards/` 配下を読んだ形跡がないことである。破った場合の帰結は、標準が存在するのに自前の基準を作り、対案を誤った理由で潰すことである。

この義務は `task-design/SKILL.md` の PrepareStep 3「設計前調査」の先頭へ置く。初稿を書く前に設計判断の入力を揃える段階であり、ここで読めば以降のすべての判断に載る。

同 `SKILL.md` 冒頭の `maintenance-plugin-context` へ委譲する記述へは書かない。`development_standards/` は plugin 内の repository 非依存な標準であり、`maintenance-plugin-context` を経由しない。

この契約は配下の file 数と分量に依存する。維持規律は `development_standards/README.md` が持つ（後述の documentation section）。

##### repository context の返却は、返らなかった場合まで含めて判定する

repository context の返却を条件にして成果物を生成・省略する契約は、`maintenance-plugin-context` の返却形式で条件を書く。すなわち `status: available | unavailable` と、`allowed context` に該当 fact が含まれるかで判定する。そのうえで、返らなかった場合の既定動作を書く。

この契約が拘束するのは次の 3 箇所である。

| 箇所 | 欠けているもの |
| --- | --- |
| `plugins/tumeda-dev/skills/task-design/tasklist-design.md:122`（local Git 運用条件 → commit section） | 返らなかった場合の既定動作、「返された」の判定基準 |
| 同 `:123`（GitHub 公開条件 → push・PR section） | 同上 |
| `plugins/tumeda-dev/skills/runtime-execution-contracts.md` の `Repository context` 節 | 解決できなかった場合の既定動作 |

`tasklist-design.md` 自己レビュー gate の「対象actionを含むphaseで、差し込み宣言を要求したか」は、「宣言が返らなければ既定の停止・確認taskだけを置く。要求自体を省略しない」と既に書かれており、この契約を充足している。修正対象に含めない。

`.agents/skills/tumeda-dev-plugin-context.md` に該当項目が無い場合、consumer skill は利用者へ確認する。確認せずに縮退も停止もしない。利用者の回答は `maintenance-plugin-context` が同 file へ書き戻し、否定の回答（`commit しない` 等）も fact として記載する。書き戻すことで、同じ repository で二度目以降の確認が不要になる。

確認するのは consumer skill、context file への書き込みは `maintenance-plugin-context` だけが行う。この owner 境界は既存契約のままである。

##### design が定める変更対象を、tasklist が覆っているかを確認する

tasklist を作ったら、`design.md` が定める変更対象を一つずつ辿り、対応する task があることを確認する。task から逆に辿らない。task から辿ると、存在する task はすべて何かを実装しているため必ず整合して見える。欠落は「design 側に対応 task が無い対象がある」という形でしか現れない。

違反 signal は、discussion で中心的に扱った対象だけを phase へ落としていることである。中心でなかった対象が静かに落ちる。

この問いは `task-design/SKILL.md` Step 4 の「確認範囲が主張範囲を覆っているか」と同じものである。既存の gate は design 合意判定の場面に置かれており、tasklist を作る場面には置かれていなかった。

#### tasklist-executor

tasklist-executor は、合意済み tasklist の task を実測完了させ、完了状態を tasklist へ記録する。この role は変わらない。今回変わるのは、DoD の一種類について確認の仕方を明示することである。

##### 同一性を要求する DoD は、両方の全文を照合する

DoD が二つの記述の同一性を要求する場合（「X が Y と同じ意味になっている」等）は、両方の全文を読んで照合してから `[x]` にする。置換対象の語だけを見て完了としない。

違反 signal は、差分のある語を置換し、その語が変わったことをもって同一性を満たしたとみなすことである。文の他の部分に残る差分に気づけない。

#### share-work-in-progress

share-work-in-progress は、今いる branch の内容を依頼者が GitHub 上で読める状態にする。この role は変わらない。今回変わるのは、空 commit を作る条件である。

##### 空 commit は PR を成立させられないときだけ作る

空 commit を作るのは、commit するものが何も無く、かつ remote の default branch と同一 HEAD で PR を作れない場合だけである。作業 branch が remote と同期済みでも、その branch から PR を作れる、あるいは open PR が既にあるなら作らない。

`SKILL.md` は空 commit を「PR を成立させるための最小差分であり、見せるための差分ではない」と位置づけている。PR が既に成立している状況で空 commit を作ると、差分の無い commit が PR へ積まれ、この位置づけと矛盾する。

現在の `SKILL.md` 手順4 と、その steering の `design.md:102` は `remote と HEAD が同じ` とだけ書いており、`remote` が作業 branch の追跡先を指すのか default branch を指すのかが決まらない。決定の原本である同 steering の `task-design-discussion.md:67` は `remote の default branch` と書いている。転記の際に `default branch` が落ちたものであり、原本へ合わせて欠落を補う。原本は変更しない。

#### name-work-directory

name-work-directory は、作業内容とローカル日付から `YYYYMMDD-slug` の basename を一つ決める。この role は変わらない。今回変わるのは、slug を決めるときに命名標準を参照することである。

##### 命名標準は群の入口から引く

`name-work-directory` は `plugins/tumeda-dev/docs/development_standards/naming/README.md` を入口とし、そこに書かれた引き方に従う。個別 file を名指ししない。

名指ししない理由は、どの file が該当するかの判断を README 側へ持たせるためである。`naming/README.md` は「この規則は、名前を付ける対象が何であっても成立するか」という引き方を持っており、`method.md`（メソッド名に固有）が該当しないことも、`file.md`（同階層との足並み、直上 directory のコンテキスト継承）が directory 名にも成立することも、README の引き方から導ける。`naming/` 配下の file が増減しても、この skill の本文を直さずに済む。

この義務は `name-work-directory/SKILL.md` の「出力」節、slug の規則の直前へ置く。規則を適用する前に標準へ当たる位置である。

#### facilitate-discussion

`development_standards/` への参照義務は置かない。この skill の役割と方針は変わらない。

置かない根拠は二つある。この skill は議論の進行形式を所有し、提案内容が設計標準に合っているかは consumer が所有する。また `facilitate-discussion` は task-design agent 自身が適用する契約であり、別 child agent へ再委譲しない。task-design が `development_standards/` を読んでいれば、同じ agent の context に載ったまま議論へ入る。

残る穴を明示する。`facilitate-discussion` は `$facilitate-discussion` によるユーザー単独起動を許しており、その経路では consumer が存在しない。命名判断が起きても `development_standards/` は読まれない。単独起動はユーザーが議論を見ている場面であり、実害が小さいと判断して義務を置かない。

### workflow

**ownerと責務:**

| owner | 判断・更新するもの | 行わないこと | single source of truth |
| --- | --- | --- | --- |
| consumer skill（`task-design`、`tasklist-executor`） | `.agents/skills/tumeda-dev-plugin-context.md` に該当項目が無いとき、利用者へ確認する | 確認せずに縮退または停止する。context file へ直接書き込む | 各 skill の SKILL.md |
| `maintenance-plugin-context` | 利用者の回答を `.agents/skills/tumeda-dev-plugin-context.md` へ書き戻す。否定の回答も fact として記載する | 回答を推測で補う | `.agents/skills/tumeda-dev-plugin-context.md` |
| command を実行する任意の skill | 実行環境に止められたら停止し、利用者へ返す | 迂回する。別の command で同じ結果を得ようとする | `plugins/tumeda-dev/skills/runtime-execution-contracts.md` |

**状態と遷移:**

```text
該当項目を読む --{項目がある}--> そのまま成果物を生成・省略する
該当項目を読む --{項目が無い}--> 利用者へ確認 --{回答}--> maintenance-plugin-context が context file へ書き戻す --> 成果物を生成・省略する
command を実行 --{実行環境が止めた}--> 停止し、利用者へ返す
```

**実行環境に command を止められたときの契約:**

agent が command を実行してよいと task level で判定したことは、実行環境がその command を通すことを意味しない。実行環境に止められた場合、agent は迂回せず停止し、利用者へ返す。

この契約は `plugins/tumeda-dev/skills/runtime-execution-contracts.md` が持つ。同 file の既存 `停止理由` にある `blocked`（必須入力・外部状態・権限が不足している）へ接続する。特定の実行基盤に依存する手順は書かない。

同 file の冒頭は現在 child 委譲へ scope を宣言しているため、child 委譲に限らない実行時の契約を含む形へ広げる。あわせて `plugins/tumeda-dev/skills/README.md:43` の説明文も広げた scope に合わせる。

command を実行しうるのは `tasklist-executor` だけではない。`steering` は `Blocker resolution`、`task-design` は技術検証実装で実行する。`tasklist-executor/SKILL.md` へ書くとこれらが拾わないため、共有 file へ置く。

### documentationによって成立する知識体系

**形式知化する対象:**

- 暗黙知・散在知識・pain: `development_standards/` 配下に命名と entity 設計の標準があるが、skill 群からの参照が 0 件である。存在を知らない agent は自前の基準を作る。`docs/README.md` は `development_standards/` を directory として指しているだけで、群の中の引き方を示していない
- 再利用可能な原則へ引き上げるもの: 「名前を付ける場面・entity を設計する場面で、どの file を読むか」の引き方

#### 指示対象の明示（`referent_explicitness.md`）

**形式知化する対象:**

- 暗黙知・pain: 書き手は指示対象の実体を知っているため、省略しても自分では読める。読み手は実体を知らないため復元できない。この非対称が「内容は難しくないのに読めない」文章を生む
- 再利用可能な原則へ引き上げるもの: 指示対象が読み手にとって自明なら指示語を使ってよく、主語や目的語も省略してよい。自明でないなら埋める。指示語はこそあど言葉に限らず、抽象名や system 内部語も実体と結ばれていなければ暗黙の指示語として働く

**読者と成立させる判断:**

| 読者 | 利用場面 | 可能になる判断 | 入口 |
| --- | --- | --- | --- |
| skill・docs を書く agent と人 | 提案文、標準、skill 本文を書いた直後 | 自分の書いた文のどの語を実体へ置き換えるべきかを、読み手に指摘される前に判定できる | `documentation_standards/README.md` の収録一覧 |

**知識構造:**

```text
一般則（許可から始める）
  → 埋めるべき三条件（document の外・離れている・複数候補に読める）
  → 判定の問い
  → 指示語の範囲（こそあど言葉／抽象名／system 内部語／主語省略）
  → 型ごとの、だめな例と直した形（三型、現物は今回の原文）
  → 検知手段（文を前後から取り出して読む）
  → 該当しない例
```

**規範の根拠と適用境界:**

- 根拠となる失敗: この steering の進行中に、assistant が書いた提案をユーザーが二度続けて読めなかった。内容の難しさではなく、指示対象の欠落が原因だった
- MUST: 指示対象が自明でない場合、語を実体へ置き換えるか実体を併記する
- MAY: 指示対象が近くにあって自明な場合、指示語を使ってよいし主語・目的語を省略してよい
- 適用対象: skill 本文、docs、提案文
- 誤適用: すべての抽象語を避けること。該当しない例（`content_density.md` の「下駄を履いた状態」、`naming/core.md` の `spec_over_implementation`）で境界を示す

**snapshotと維持規律:**

| 正しいsnapshot | single source of truth | 更新owner | 更新trigger |
| --- | --- | --- | --- |
| 三つの型それぞれに、だめな例と直した形の対がある | `plugins/tumeda-dev/docs/documentation_standards/referent_explicitness.md` | この標準を使う書き手 | 既存の型に当てはまらない読めなさが観測されたとき |

**完成後のdocument構造:**

- 配置: `plugins/tumeda-dev/docs/documentation_standards/referent_explicitness.md`
- 形式: Markdown。`documentation_standards/README.md` の「各標準は基本 1 ファイル」に従う
- `documentation_standards/README.md` の「収録している標準」へ 1 行を追加する
- `plugins/tumeda-dev/skills/document-review/SKILL.md` の作成時観点と更新時観点の両方へ「指示対象 → `referent_explicitness.md`」を足す。この list に無い標準は emit 前ゲートで当たらない
- 同 list の更新時観点へ「既存記述の直し方 → `modify_description_policy.md`」を足す。下記の判断の問いを既存の標準すべてへ当てた結果、観点に当たるのに list へ無いことが判明したためである

**標準を増やすときの維持規律（`documentation_standards/README.md` の「標準の置き方」）:**

標準を増やしたら、それが emit 前に当てる観点かを判断する。観点なら `document-review` の観点 list へ足す。

判断の問い: 「この標準は、書かれた文に当てて、満たすか満たさないかを判定できるか」

何を書くか、どこに置くか、誰に向けて書くかを扱う標準は観点ではない。これらは書く前の取捨選択であり、`document-review` の能力境界の外である。

この問いを当てた結果、観点に当たるのは `content_density.md`、`expression_notation.md`、`file_naming.md`、`modify_description_policy.md`、`referent_explicitness.md` の五つである。`business_specification.md`、`core_readers.md`、`information_structuring/`、`case_coverage/`、`stock-and-flow-information.md`、`supplier-consumer-relation.md` は観点でない。

#### 設計標準の入口（`development_standards/README.md`）

**完成後のdocument構造:**

- 配置: `plugins/tumeda-dev/docs/development_standards/README.md`
- 形式: Markdown。同階層の群 README（`think_standards/README.md`、`documentation_standards/README.md`）と同じく「収録している標準」＋「置き方」の形を採る
- 既存 document へ統合するか: 新設する。`docs/README.md` の「群の置き方」が「群のREADMEが入口になる。ただしREADMEを持たない群は、収録fileが1つならそのfileを、複数ならdirectoryを代表fileの代わりに指す」と定めており、現状は fallback 形である。README を持てば入口の形が他の群と揃う

**規範の根拠と適用境界:**

- 根拠となる失敗: 命名標準が存在するのに、`skills/` からの参照が 0 件で、設計中に想起されなかった
- MUST: `task-design` はこの群の配下をすべて読む。`name-work-directory` は `naming/README.md` を入口とする
- 適用対象: この plugin の skill 群

**snapshotと維持規律:**

`task-design` が配下をすべて読む契約は、配下の file 数と分量に依存する。file を増やすときは、増やした後も契約が成立するかを確認する。

判断の問い: 「増やした後の file 数と分量で、設計前調査の一段階として読み切れるか」

読み切れないなら、file を増やす前に参照契約自体を見直す。数値上限は置かない。分量が file 数に比例しないためである。現在は 7 file（`naming/` に README・core・file・method、`entity_modeling/` に README・core・evacuation）で契約が成立している。

**完成後のdocument構造:**

```text
# 開発標準
## 収録している標準   — naming/ と entity_modeling/ を 1 行ずつ
## この群の引き方     — task-design は配下すべて、name-work-directory は naming/README.md
## この群の置き方     — 新しい標準をどこへ置くかの判断の問い
## 維持規律           — 全部参照契約が成立し続けるかの確認
```

README が skill 名を書くことについては、`think_standards/README.md` が「`think-through` skillからの入口であり」と skill を名指しする先例がある。

### documentation以外のfile deliverable

**対象と読者:**

| file | 主な読者 | 読後または利用後にできること |
| --- | --- | --- |
| `plugins/tumeda-dev/skills/task-design/tasklist-design.md` | tasklist を設計する agent | repository context が返らなかった場合に commit section をどうするかを、推測せず決められる |
| `plugins/tumeda-dev/skills/task-design/SKILL.md` | 設計する agent | 設計標準を参照する段階と範囲が分かる |
| `plugins/tumeda-dev/skills/tasklist-executor/SKILL.md` | tasklist を実行する agent | 同一性を要求する DoD をどう確認するかが分かる |
| `plugins/tumeda-dev/skills/share-work-in-progress/SKILL.md` | 作業中 branch を共有する agent | 空 commit を作る条件を一意に判定できる |
| `plugins/tumeda-dev/skills/name-work-directory/SKILL.md` | basename を決める agent | slug を決めるときに読む標準が分かる |
| `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md` | plugin へ提案を引き渡す agent | `migration.md` がどこにあるかを、検索せずに開ける |
| `plugins/tumeda-dev/skills/runtime-execution-contracts.md` | command を実行する agent | 実行が止まったとき、迂回せず停止して返すべきことが分かる |
| `plugins/tumeda-dev/skills/README.md` | skill 群を俯瞰する読み手 | `runtime-execution-contracts.md` が child 委譲に限らない契約を持つと分かる |
| `plugins/tumeda-dev/docs/documentation_standards/README.md` | docs を書く読み手 | 指示対象の明示という標準が存在すると分かる。標準を増やすとき、`document-review` の観点 list へ足すかを判断できる |
| `plugins/tumeda-dev/skills/document-review/SKILL.md` | emit 前ゲートを回す agent | 指示対象の明示と既存記述の直し方を、当てる観点として拾える |
| `.steering/2026/202609/20260910-add-publish-branch-diff-skill/design.md` | 過去 steering を読み返す読み手 | 空 commit の条件を、原本と同じ意味で読める |

**完成後の内容と構造:**

| file | 追記位置 | 書く内容 |
| --- | --- | --- |
| `task-design/tasklist-design.md:122` | 該当行を置換 | 条件を `.agents/skills/tumeda-dev-plugin-context.md` の項目の有無で書き、無い場合は利用者へ確認すると書く |
| 同 `:123` | 該当行を置換 | 同上（GitHub 公開条件） |
| `task-design/SKILL.md` | PrepareStep 3「設計前調査」の先頭 | `development_standards/` 配下をすべて読む。該当場面かを判定しない |
| `task-design/tasklist-design.md` | 自己レビュー gate | design の変更対象を tasklist の task が覆っているかを、design 側から辿って確認する |
| `tasklist-executor/SKILL.md` | 最重要原則の `[x]` 判定の配下 | 同一性を要求する DoD は両方の全文を照合する |
| `share-work-in-progress/SKILL.md` 手順4 | 該当行を置換 | `remote の default branch と同一 HEAD で PR を作れない場合だけ` と書く |
| `name-work-directory/SKILL.md` | 「出力」節、slug の規則の直前 | `naming/README.md` を入口とし、そこの引き方に従う |
| `runtime-execution-contracts.md` | 冒頭の scope 宣言を置換。`実行環境gate` 節を追加 | scope を child 委譲に限らない形へ広げる。実行環境に止められたら迂回せず停止する契約を書き、既存 `停止理由` の `blocked` へ接続する |
| `runtime-execution-contracts.md` の `Repository context` 節 | 該当節を置換 | 解決元を path で書き、該当項目が無い場合は利用者へ確認し確認するまで child 処理を実行しないと書く |
| `skills/README.md:43` | 該当行を置換 | 広げた scope に合わせる |
| `documentation_standards/README.md` | 「収録している標準」へ 1 行追加、「標準の置き方」へ維持規律を追加 | `referent_explicitness.md` の 1 行と、観点かを判断する問い |
| `document-review/SKILL.md` | 「当てる観点」の作成時観点・更新時観点 | 指示対象と既存記述の直し方の行を足す |
| `escalate-plugin-skill-fix/SKILL.md` | 「正本は`migration.md`である」の行 | `plugins/tumeda-dev/skills/maintenance-plugin-context/maintenance_policies/migration.md` という path を添える |
| `.steering/.../20260910-add-publish-branch-diff-skill/design.md:102` | 該当行を置換 | 原本（同 steering の `task-design-discussion.md:67`）へ合わせて `default branch` を補う |

**配置・形式:**

- 形式: すべて Markdown。既存 file の記法に合わせる
- 正本と重複防止: 実行環境に止められたときの契約は `runtime-execution-contracts.md` だけが持ち、`tasklist-executor/SKILL.md` へ複製しない。指示対象の明示の標準は `referent_explicitness.md` だけが持ち、各 skill へ複製しない

---

## 要件（Requirements）

### MUST（必達）

- 条件文が「条件を満たさなかった場合」まで書かれている
- 同じ条件について、`SKILL.md` と対応する design・discussion の記述が食い違っていない
- `plugins/tumeda-dev/docs/development_standards/README.md` が存在し、群の入口として機能する
- `plugins/tumeda-dev/skills/` から `development_standards/` への参照が 1 件以上ある
- `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md` の `migration.md` 参照が、実体の path を伴っている
- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出力する

### SHOULD（できれば）

- 修正した条件文が、同じ形の条件文を書く後続の書き手にとって参考になる形になっている

### MAY（あれば嬉しい）

- なし。

### 非目標

- 利用先 repository 側の変更
- 命名標準・entity 設計標準の内容そのものの変更
- harness の分類器を迂回する手段の設計
- 特定の実行基盤（infrastructure-as-code tool 等）に依存する手順の記載

### 受け入れ基準

- `plugins/tumeda-dev/skills/task-design/tasklist-design.md` の commit section と push・PR section の生成条件を読み、`.agents/skills/tumeda-dev-plugin-context.md` に該当項目が無い場合の動作を、他の file を読まずに答えられる
- `plugins/tumeda-dev/skills/share-work-in-progress/SKILL.md` の手順4 を読み、作業 branch が remote と同期済みで open PR も既にある状況で空 commit を作るかどうかを、一意に答えられる
- `plugins/tumeda-dev/skills/runtime-execution-contracts.md` の冒頭を読み、この file が child 委譲に限らない実行時の契約を持つと分かる
- `grep -rn 'development_standards' plugins/tumeda-dev/skills/` が 2 件以上返る（`task-design/SKILL.md` と `name-work-directory/SKILL.md`）
- `plugins/tumeda-dev/docs/development_standards/README.md` を読み、`task-design` と `name-work-directory` がそれぞれ何を読むかが分かる
- `plugins/tumeda-dev/docs/documentation_standards/referent_explicitness.md` を読み、三つの型それぞれについて、だめな例と直した形の対を確認できる
- `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md` を読み、`migration.md` の場所を検索せずに開ける
- `plugins/tumeda-dev/skills/document-review/SKILL.md` の「当てる観点」に `referent_explicitness.md` と `modify_description_policy.md` の行があり、新設した標準が emit 前ゲートで当たる
- `plugins/tumeda-dev/docs/documentation_standards/README.md` の「標準の置き方」を読み、次に標準を増やす人が `document-review` の観点 list へ足すかを判断できる
- `plugins/tumeda-dev/skills/task-design/tasklist-design.md` の自己レビュー gate に、design の対象を tasklist が覆っているかの項目がある
- `plugins/tumeda-dev/skills/tasklist-executor/SKILL.md` に、同一性を要求する DoD の照合方法がある
- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出力する
- `main` へ取り込んだ後、marketplace 経由で plugin を reinstall すると、更新後の skill と docs が install cache へ反映される。反映されたことは、install cache 側の `plugins/tumeda-dev/.claude-plugin/plugin.json` の `version` が今回上げた値と一致することで確認できる

この最後の一項目は、`main` への取り込みが作業を破棄しても残る変化であることに対応する。取り込んだ後で更新が届いているかを独立に確認できる必要がある。

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 「毎回全部参照する」が将来 file 増加で守られなくなり、契約だけが残る | `development_standards/README.md` の維持規律に、file を増やすときの確認と判断の問いを書く |
| `runtime-execution-contracts.md` の scope を広げた結果、child 委譲の契約が薄まって読まれなくなる | 冒頭で二つの対象（実行時の共通契約と child 委譲）を並べ、既存の child 委譲 section は構造を変えない |
| `referent_explicitness.md` が「抽象語を使うな」と読まれ、過剰に適用される | 該当しない例を本文へ置く。一般則を許可（自明なら省略してよい）から書き始める |
| 新設した標準が `document-review` の観点 list へ登録されず、書かれるが当てられない標準になる | 同じ phase で観点 list への登録まで行う。次回以降のために `documentation_standards/README.md` の「標準の置き方」へ判断の問いを置く |
| 過去 steering の `design.md:102` を直すことが、当時の判断の書き換えと誤解される | 原本である同 steering の `task-design-discussion.md` は変更しない。転記の欠落を補うだけであることを commit message へ書く |

---

## テスト方針

- この repository は自動 test framework を持たない。検証は `node scripts/verification/validate-plugin.mjs` による manifest 整合確認だけである
- 条件文の修正は、修正後の文だけを読んで「満たさない場合に何をするか」を答えられるかで確認する
- 参照導線は、`grep` で `skills/` から `development_standards/` への参照件数が 0 でないことを確認する

---

## （付録）前提とする既存仕様

- `plugins/tumeda-dev/skills/task-design/tasklist-design.md:122-125`: commit / push / PR section の生成条件。`:122` が local Git 運用条件、`:123` が GitHub 公開条件で、どちらも「返された場合だけ生成する」形。`:125` は「plan 合意時点で適用できない action は section 自体を生成しない」
- 同 file の自己レビュー gate「対象actionを含むphaseで、差し込み宣言を要求したか」: 「宣言が返らなければ既定の停止・確認taskだけを置く。要求自体を省略しない」と、返らなかった場合を明記している。同じ repository 内の先例
- `plugins/tumeda-dev/skills/share-work-in-progress/SKILL.md` 手順4 と、その steering の `design.md:102`・`task-design-discussion.md:67`
- `plugins/tumeda-dev/skills/runtime-execution-contracts.md`: 冒頭で child 委譲の共通契約と scope 宣言。`停止理由` に `blocked`（必須入力・外部状態・権限が不足している）
- `plugins/tumeda-dev/docs/README.md`「群の置き方」: 群の README が入口になる。README を持たない群は directory を指す fallback
- `plugins/tumeda-dev/docs/development_standards/naming/README.md`・`entity_modeling/README.md`: 各群は既に引き方を持つ。不足しているのは一段上の `development_standards/` の入口
- `plugins/tumeda-dev/docs/think_standards/README.md`: 「ドメイン固有の判断基準（命名、architecture等）は対象外であり、対応する専用documentが持つ」
- `.agents/skills/tumeda-dev-plugin-context.md`: version bump は宣言値 4 箇所と `expectedRelease` 1 箇所の計 5 箇所。default branch へ直接 commit / push しない。PR script は `scripts/for_local/github/create_or_get_pr.sh`

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |

なし。

### task-design内の対象成果物反映待ち

| 対象 | 待つ理由 | 依存decision | 参照するdesign section |
| --- | --- | --- | --- |

なし。

### execution plan対象

| 対象 | 掲載理由 | 参照するdesign section |
| --- | --- | --- |
| `plugins/tumeda-dev/skills/task-design/tasklist-design.md` の `:122` と `:123`、`plugins/tumeda-dev/skills/runtime-execution-contracts.md` の `Repository context` 節 | 段階実行。条件文の修正は意味単位で commit を分ける対象であり、`design.md` 確定後・`tasklist.md` 確定前の位置へ置く必要がある。三箇所は同じ一般則の適用例であり一組 | [skillの役割と方針](#skillの役割と方針) |
| `plugins/tumeda-dev/skills/task-design/SKILL.md` の PrepareStep 3 | 段階実行。上と別の意味単位（参照義務の追加）であり、別 commit になる | [skillの役割と方針](#skillの役割と方針) |
| `plugins/tumeda-dev/skills/share-work-in-progress/SKILL.md` の手順4 | 段階実行。上と別の意味単位（空 commit 条件の修正） | [skillの役割と方針](#skillの役割と方針) |
| `plugins/tumeda-dev/skills/name-work-directory/SKILL.md` の「出力」節 | 段階実行。参照義務の追加として `task-design/SKILL.md` と同じ意味単位に入る | [skillの役割と方針](#skillの役割と方針) |
| `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md` の `migration.md` 参照 | 段階実行。参照先を明示する変更として、上と同じ意味単位に入る | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) |
| `plugins/tumeda-dev/skills/runtime-execution-contracts.md` の冒頭 scope 宣言と `実行環境gate` 節、`plugins/tumeda-dev/skills/README.md:43` | 段階実行。scope 宣言の変更と索引の同期は一組で、条件文の修正とは別の意味単位。同 file の `Repository context` 節は条件文の意味単位へ属する | [workflow](#workflow) |
| `plugins/tumeda-dev/docs/development_standards/README.md`（新設） | 段階実行。新設 docs は独立した意味単位 | [documentationによって成立する知識体系](#documentationによって成立する知識体系) |
| `plugins/tumeda-dev/docs/documentation_standards/referent_explicitness.md`（新設）、同 directory の `README.md`、`plugins/tumeda-dev/skills/document-review/SKILL.md` | 段階実行。新設 docs、索引更新、観点 list への登録が一組。登録しないと標準が当てられない | [documentationによって成立する知識体系](#documentationによって成立する知識体系) |
| `.steering/2026/202609/20260910-add-publish-branch-diff-skill/design.md:102` | 段階実行。過去 steering の成果物であり、当時の判断を変えるものでないことを commit message で示す必要がある | [skillの役割と方針](#skillの役割と方針) |
| version 宣言値 4 箇所と `scripts/verification/validate-plugin.mjs` の `expectedRelease` | 段階実行。5 箇所を一度に変え、`node scripts/verification/validate-plugin.mjs` で検証する独立した単位。他のすべての変更が終わった後に行う | [テスト方針](#テスト方針) |
| `plugins/tumeda-dev/skills/task-design/tasklist-design.md` の自己レビュー gate と `plugins/tumeda-dev/skills/tasklist-executor/SKILL.md` の `[x]` 判定 | 段階実行。実装完了後 review で判明した不足への対処であり、他の変更とは別の意味単位 | [skillの役割と方針](#skillの役割と方針) |
| commit、push、`main` への取り込み | 段階実行。`escalate-plugin-skill-fix` が定める 4 step（作業 branch を push、`main` へ切替、merge、`main` を push）であり、repository 外への影響を含む | [テスト方針](#テスト方針) |

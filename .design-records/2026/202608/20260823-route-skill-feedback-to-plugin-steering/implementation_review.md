# 議論記録

<!--
このfileはpluginの公開配布物に含まれる。`maintenance_policies/migration.md`に従い、
利用先repositoryの名称、所有者名、絶対path、固有ドメイン名、固有steering slugを書かない。
-->

## 論点1: 作業branch名をsteering directoryのbasenameに則らせる規約の置き場所

**ステータス:** 決定

**種別:** レビュー指摘

### イテレーション0: 規約の内容と置き場所を決める

#### 提案0

##### 規約の内容

このrepositoryでsteeringを起動して作業branchを切るとき、branch名をsteering directoryのbasenameと同じにする。prefixを付けない。

- 例: steering directoryが`.steering/2026/202608/20260823-route-skill-feedback-to-plugin-steering/`なら、branch名は`20260823-route-skill-feedback-to-plugin-steering`
- 日付部分を含めたbasename全体を使う。branchとsteering記録が1対1で対応し、branch名からsteering directoryを一意に引ける

##### 置き場所: root `AGENTS.md` の `## repository運用`

このrepository固有の運用規約として`AGENTS.md`へ書く。配布されるskillへは書かない。

```diff
 ## repository運用

 他のリポジトリから移植してpluginを成長させる際には plugins/tumeda-dev/skills/maintenance-plugin-context/maintenance_policies/migration.md を参照する。

+steeringを起動して作業branchを切るときは、branch名をsteering directoryのbasenameと同じにする。prefixを付けない。branch名からsteering directoryを一意に引ける状態を保つためである。
+
 repository 内のドキュメント本文は、ファイル種別や配置場所にかかわらず日本語で記述する。コード、command、path、識別子、規定された出力形式、固有名詞は原文を維持する。
```

##### 既存branchの扱い

`feature/extract-think-standards-docs` と、今回pushした `feature/route-skill-feedback-to-plugin-steering` は新規約に合わない。どちらも既にpush済みであり、片方は既にmainへmerge済みである。改名せず、規約は次回以降のbranchから適用する。

##### 実施条件

- `main` branchで直接作業する。この変更のためにbranchを切らない。
- 配布versionを上げない。現在の`7.2.0`のまま据え置き、次回の配布時にこの変更を含めてbumpする。

#### 提案背景

##### 起点

`7.2.0`のrelease完了後、ユーザーから次のfeedbackを受けた。

> 今回指定しなかったけど、ブランチ名はsteering名にそのまま則るようにスキルに書こうか。これはmainブランチで作業しちゃっていいし、活きるのが次のこのスキル使うときだから無理にversion upしないで次のときに混ぜ込んじゃえばいいよ

本steeringの実行中、assistantがbranch名の規約を二度確認したがどちらも指定がなく、最終的にassistantが既存リモートbranchの形（`feature/`prefix付き）へ合わせて命名した。規約が不在だったことがこのfeedbackの起点である。

##### 原因owner

**repository知識**と分類する。branch命名という運用規約が、このrepositoryのどのdocumentにも書かれていなかった。

skillの不足ではない。`name-work-directory`は「branch名を取得・含有しない。親パスの決定、ディレクトリ作成、名前衝突の確認もしない。これらは呼び出し側が担う」と責務境界を明示しており、`steering`も`命名規則とcanonical directory`で「branch名の取得・埋込み・衝突確認をbasenameへ持ち込まない」としている。どちらもbasename側の汚染を禁じているだけで、逆方向（basenameからbranch名を導く）は規定していない。この空白は意図的な境界設定の結果であり、skillの欠陥ではない。

##### 配布skillへ書かない理由

「branch名をsteering basenameに則らせる」を`steering/SKILL.md`へ一般規約として書く案も検討した。採らない。

branch命名規約はrepositoryごとに異なる。ticket番号やissue番号へ紐づける規約を持つrepositoryでは、steering basenameに則る規約と直接衝突する。既知の利用先にも別規約を持つものがあり、一般default化しても半分は上書きされる。上書き前提のdefaultをskillへ置くと、読み手はまずrepository contextを確認する必要が生じ、skill側の記述は判断の助けにならない。

本steeringでは同じ判断を三度している。`facilitate-discussion`へ供給側の知識を書かない（論点7）、symlink構造の帰結を配布skillではなく`.agents/AGENTS.md`へ置く、そして今回である。いずれも「配布される成果物へrepository固有の事情を持ち込まない」という同じ原則の適用である。

##### version bumpを行わない理由

`maintenance-plugin-context`の`Plugin version`は「配布する変更には、変更内容に見合うversion bumpを一度だけ行う」と定める。今回の変更は`AGENTS.md`のみで、配布されるskillとdocsを変更しない。宣言値四箇所と`expectedRelease`は`7.2.0`のまま整合し、validatorも通る。

ただしこの判断は、次回の配布時にこの変更を含めることを前提としている。次回のbump時に本変更を見落とすriskがあるため、commit本文へ「次回配布へ繰り越す」旨を明記して痕跡を残す。

##### 提案0が満たす必要のある条件

1. branch名からsteering directoryを一意に引ける
2. 配布されるskillへrepository固有の運用規約を持ち込まない
3. 既にpush済みのbranchへ遡及しない
4. 配布versionを上げずに整合を保つ

規約の内容が条件1、置き場所が条件2、既存branchの扱いが条件3、実施条件が条件4を満たす。

#### 提案0へのフィードバック

**結果:** 却下。置き場所の判断が誤り。`escalate-plugin-skill-fix`単体で完結する。

> え、このスキル単体の話で済まない？

`escalate-plugin-skill-fix`はこのpluginの正本repository専用のskillであり、既に正本判定と`plugins/tumeda-dev/skills/`の存在確認という固有の内容を持つ。汎用skillではないため、「配布skillへrepository固有の事情を持ち込まない」という原則の対象外である。提案0はこの原則を、原則が想定していない対象へ当てていた。`AGENTS.md`への追記は不要。

### イテレーション1: 規約を新skill内へ置き、順序と経路の不備を同時に直す

#### 提案1

`plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md` だけを変更する。`AGENTS.md`は変更しない。

##### 変更1: `### 作業対象の切り替え` からbranch作成を外す

```diff
 ### 作業対象の切り替え

-working directoryを正本repositoryへ移し、その既定branchから作業branchを切る。
+working directoryを正本repositoryへ移す。作業branchは`## 作業branch`に従い、`steering`がsteering directoryを作った後に切る。
```

##### 変更2: `### 正本だった場合` から作業branchへ導線を張る

```diff
 ### 正本だった場合

-現在のrepositoryが既に正本であれば、移動もrepository固有情報の除去も不要である。そのまま`steering`を起動し、このskillは終了する。
+現在のrepositoryが既に正本であれば、移動もrepository固有情報の除去も不要である。そのまま`steering`を起動し、このskillは終了する。作業branchは`## 作業branch`に従う。
```

##### 変更3: `## 作業branch` を新設する

`## 正本でない場合の引き渡し` の後、`## 引き渡し後の前提` の前へ置く。

```markdown
## 作業branch

`steering`がsteering directoryを作った後に、そのbasenameと同じ名前で作業branchを切る。prefixを付けない。

- steering directoryが `.steering/2026/202608/20260823-example-slug/` なら、branch名は `20260823-example-slug` にする。
- basenameは`steering`のStep 1が`name-work-directory`から受け取って決める。branchを先に切るとbasenameがまだ存在しないため、この順序を逆にしない。
- 正本repositoryで直接作業を始めた場合も、引き渡しを経た場合も、同じ規約に従う。
- 既にpush済みのbranchへ遡及しない。
```

##### 実施条件

`main`で直接作業し、この変更のためにbranchを切らない。配布versionは`7.2.0`のまま据え置き、次回配布時にこの変更を含めてbumpする。

#### 提案背景

##### feedbackから今回満たす必要が生じた条件

置き場所を`escalate-plugin-skill-fix`単体にする。これにより、規約は分岐が起きる場所そのもの、つまりbranchを切る手順の中で読まれる。`AGENTS.md`に置いた場合、この経路を通るagentが`AGENTS.md`を読んでいる保証はない。

##### 単体化によって表面化した二つの不備

置き場所を新skill内へ移すと、既存の記述と噛み合わない箇所が二つ出る。どちらも本steeringで出荷した`SKILL.md`の不備である。

**不備1: 順序が破綻している。** `### 作業対象の切り替え`はbranchを切る手順を持ち、その後の`### 起動するもの`で`steering`を起動する。しかしbasenameを決めるのは`steering`のStep 1が呼ぶ`name-work-directory`である。branchを切る時点でbasenameは存在しない。「branch名をbasenameと同じにする」を現状の順序へ足すと、実行不能な手順になる。変更1と変更3で、branch作成を`steering`起動後へ移す。

**不備2: 正本だった場合の経路にbranch作成がない。** `### 正本だった場合`は「そのまま`steering`を起動し、このskillは終了する」だけで、branchに触れない。本steeringの実作業はまさにこの経路であり、assistantが手でbranchを切った。規約を`### 作業対象の切り替え`だけに書くと、この経路では発火しない。変更2で導線を張り、変更3の本文で両経路が対象であることを明示する。

##### 残る隙間

このskillが起動しない作業でbranchを切る場合、規約は読まれない。ただしこのrepositoryの作業はskill、docs、template、scriptの変更がほぼすべてであり、いずれも本skillの起動gateに含まれる。隙間は小さいと判断し、`AGENTS.md`への二重掲載は行わない。

##### 提案1が満たす必要のある条件

1. 変更範囲が`escalate-plugin-skill-fix/SKILL.md`だけに閉じる
2. branchを切る時点でbasenameが確定している
3. 正本へ直接入った経路と引き渡しを経た経路の両方で規約が読まれる
4. 同じ規約を二箇所へ書かない

変更1と変更3が条件2、変更2と変更3の本文が条件3、`## 作業branch`への集約と両経路からの参照が条件4、実施条件が条件1を満たす。

#### 提案1へのフィードバック

**結果:** 却下。規約を新skill内へ書くのではなく、`steering`へopt-inのparameterを設ける形が優れている。

> steeringスキルに、基本falseの、steering名を作ったら、その名前のブランチに移るっていうパラメータを作るのは？ consumer側なら、基本的にissueが紐付くけど、supplierのこのリポジトリについてはこのスキル経由だと、consumer発信で変更を求められる。そのときのブランチ名はその都度オリジナルでブランチ名順の一覧の見え方もそんなに崩さないためには、タイムスタンプのsteering名がちょうどいいのよね

提案1が抱えていた順序の制約は、branch作成を`steering`の内側へ移すと消える。提案1で挙げた不備1・不備2も、両経路が最終的に`steering`を起動するという構造から自動的に解ける。

### イテレーション2: `steering`へopt-inのbranch作成parameterを設ける

#### 提案2

##### 変更1: `steering/SKILL.md` の `## 入力`

```diff
 - ユーザー入力: **達成したいこと**
 - 子roadmap phaseの場合: `parent_roadmap_path`、`parent_phase_id`、`parent_design_path`、`dependency_results`
 - standalone roadmapを昇格する場合: `adopt_task_design_working_dir=<absolute path>`
+- 任意: `branch_from_basename`。defaultは`false`。`true`のとき、basenameを決めた直後に同名のbranchを作成して切り替える。
```

##### 変更2: `steering/SKILL.md` の Step 1 手順

```diff
 1. `name-work-directory`で`YYYYMMDD-slug`を決める。
-2. `.steering/YYYY/YYYYMM/`がなければ作成する。
-3. `.steering/YYYY/YYYYMM/YYYYMMDD-slug/`を作成する。
-4. 実行月の一か月前（年を跨ぐ場合は前年12月）のdirectoryが存在し、その月の`summary.md`が未存在の場合だけ、前月summaryを生成する。
+2. `branch_from_basename=true`の場合だけ、現在のHEADから`YYYYMMDD-slug`という名前のbranchを作成して切り替える。基点となるbranchが意図どおりかはcallerが保証する。同名branchが既に存在する場合、または切替に失敗した場合は、作成も強制切替もせず作業を停止してユーザーへ報告する。stashを行わない。
+3. `.steering/YYYY/YYYYMM/`がなければ作成する。
+4. `.steering/YYYY/YYYYMM/YYYYMMDD-slug/`を作成する。
+5. 実行月の一か月前（年を跨ぐ場合は前年12月）のdirectoryが存在し、その月の`summary.md`が未存在の場合だけ、前月summaryを生成する。
```

branch作成をdirectory作成より前へ置く。steering成果物がすべて新しいbranch上で生まれ、branch切替をまたぐ未追跡fileが発生しない。

##### 変更3: `steering/SKILL.md` の `## 命名規則とcanonical directory`

既存の一文が逆方向の禁止と読まれないよう、一文だけ添える。

```diff
-このpathがsteering directoryであり、task-design working directoryでもある。steeringは親directoryの作成と前月summary生成を担当する。branch名の取得・埋込み・衝突確認をbasenameへ持ち込まない。
+このpathがsteering directoryであり、task-design working directoryでもある。steeringは親directoryの作成と前月summary生成を担当する。branch名の取得・埋込み・衝突確認をbasenameへ持ち込まない。basenameからbranch名を導く逆方向は`branch_from_basename`が扱う。
```

##### 変更4: `escalate-plugin-skill-fix/SKILL.md`

`## 作業branch`は新設しない。branch作成を`steering`へ委ね、両経路でparameterを渡す。

```diff
 ### 正本だった場合

-現在のrepositoryが既に正本であれば、移動もrepository固有情報の除去も不要である。そのまま`steering`を起動し、このskillは終了する。
+現在のrepositoryが既に正本であれば、移動もrepository固有情報の除去も不要である。そのまま`steering`を`branch_from_basename=true`で起動し、このskillは終了する。
```

```diff
 ### 作業対象の切り替え

-working directoryを正本repositoryへ移し、その既定branchから作業branchを切る。
+working directoryを正本repositoryへ移す。作業branchは`steering`が作る。
```

```diff
 ### 起動するもの

-working directoryの切り替えが終わったら、正本repositoryで`steering`を起動する。以降の設計・議論・実装は`steering`の通常flowに委ねる。
+working directoryの切り替えが終わったら、正本repositoryで`steering`を`branch_from_basename=true`で起動する。以降の設計・議論・実装は`steering`の通常flowに委ねる。
+
+このrepositoryへの変更は利用先からの提案が起点であり、その都度固有の題材になるためissue番号のような安定した識別子を持たない。branch名をsteering directoryのbasenameに揃えると、branch一覧が日付順に並び、branch名からsteering記録を一意に引ける。
```

##### 変更5: validatorへassertionを追加する

```javascript
requireText(steeringSkill, "branch_from_basename");
requireText(escalateSkill, "branch_from_basename");
```

##### 実施条件

`main`で直接作業し、この変更のためにbranchを切らない。配布versionは`7.2.0`のまま据え置き、次回配布時にこの変更を含めてbumpする。

#### 提案背景

##### 提案1から何を置換したか

提案1は「規約を`escalate-plugin-skill-fix`内へ書く」という置き場所の解だった。提案2は「branch作成の能力を`steering`へ持たせ、`escalate-plugin-skill-fix`はそれを有効化するだけにする」という責務の解へ置き換える。

提案1が抱えていた二つの不備は、この置換で消える。

- **順序**: `steering`のStep 1はbasenameを決めた直後である。その場でbranchを切れるため、「`steering`の後に切る」という skill をまたぐ約束が不要になる。
- **両経路のカバー**: 正本直行と引き渡し経由のどちらも最終的に`steering`を起動する。parameterを渡すだけで両方が同じ挙動になり、導線を二箇所へ張る必要がない。

提案1が残していた「このskillが起動しない作業では規約が読まれない」という隙間も、性質が変わる。規約ではなく`steering`の実行時の挙動になるため、`branch_from_basename=true`で起動された作業では必ず適用される。

##### `steering`へ入れてよい理由

配布されるskillへrepository固有の事情を持ち込まないという原則は維持される。`branch_from_basename`は特定repositoryを前提としない一般的な能力であり、defaultは`false`である。issue番号へbranchを紐づける規約を持つ利用先は、parameterを渡さない限り現状のまま動く。opt-inであることが、上書き前提のdefaultを置く案との違いである。

##### timestampつきbasenameをbranch名にする利点

このrepositoryへの変更は利用先からの提案が起点になるため、その都度固有の題材になり、issue番号のような安定した識別子を持たない。命名を都度考えると、branch一覧の並びが揃わない。`YYYYMMDD-slug`は日付が先頭にあるため、branch一覧が時系列で並び、名前からsteering記録を一意に引ける。

##### 既存の一文との関係

`steering`の`命名規則とcanonical directory`にある「branch名の取得・埋込み・衝突確認をbasenameへ持ち込まない」は、branch名がbasenameを汚染することを禁じている。`branch_from_basename`はbasenameからbranch名を導く逆方向であり、矛盾しない。ただし読み手が矛盾と誤読しうるため、変更3で一文を添える。

##### 提案2が満たす必要のある条件

1. branchを切る時点でbasenameが確定している
2. 正本へ直接入った経路と引き渡しを経た経路の両方で同じ挙動になる
3. 既存の利用先の挙動を変えない
4. 既存の一文と矛盾せず、矛盾とも読まれない
5. 同じ規約を二箇所へ書かない

変更2が条件1、変更4が条件2、defaultを`false`にすることが条件3、変更3が条件4、`## 作業branch`を新設しないことが条件5を満たす。

#### 提案2へのフィードバック

**結果:** 受諾。提案2のとおり適用する。

> ok

### 決定

`steering`へopt-inのparameter `branch_from_basename`（default `false`）を設け、`escalate-plugin-skill-fix`から`true`で渡す。反映済み。

- `steering/SKILL.md`: `## 入力`へparameterを追加し、Step 1の手順2としてbranch作成を挿入して既存手順を繰り下げた。branch作成をdirectory作成より前へ置き、steering成果物がすべて新しいbranch上で生まれるようにした。同名branchが既に存在する場合と切替に失敗した場合は、作成も強制切替もstashも行わず停止して報告する。`命名規則とcanonical directory`へ、逆方向を`branch_from_basename`が扱う旨の一文を添えた。
- `escalate-plugin-skill-fix/SKILL.md`: 正本直行と引き渡し経由の両経路で`branch_from_basename=true`を渡す。`### 作業対象の切り替え`からbranch作成を外した。timestampつきbasenameをbranch名にする理由を`### 起動するもの`へ記載した。
- `scripts/verification/validate-plugin.mjs`: 両fileへの記載assertionを追加した。

`AGENTS.md`は変更しない。`## 作業branch`は新設しない。

**採らなかった案**

イテレーション0の`AGENTS.md`案は、`escalate-plugin-skill-fix`が汎用skillではなくこのpluginの正本repository専用であることを見落としていた。イテレーション1の`## 作業branch`新設案は、branch作成を`steering`起動前に置いたままだったため、basenameが未確定の時点でbranch名を決めることになり実行できなかった。branch作成の責務を`steering`へ移すと、両方の問題が同時に解ける。

**配布version**

`7.2.0`のまま据え置く。次回の配布時にこの変更を含めてbumpする。

# 議論記録

## 論点1: 何を契約として書くか

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0: 契約の内容を決める

#### 提案0

**共有されていなかった前提を一つ置き、そこから二つの merge 経路を導く。**

```text
前提（これが書かれていなかった）
  branch と issue は 1:1 で対応する。
  merge はその branch の作業の終わりであり、同時に issue の終わりである。

経路 1: issue 完了の merge
  branch が issue の作業を終えた
  PR は `Closes` を持つ
  merge 後、その branch 名は再利用しない

経路 2: 検証のための merge
  既定 branch へ入れないと確認できない挙動がある
  PR は `Closes` を持たない
  検証が終わったら、元の作業 branch へ戻る
```

経路の選択は「この merge で issue の作業が終わるか」で判定する。終わらないなら経路 2 である。

##### 三つの規律

- **`Closes` は issue の終わりを宣言する。** 検証のための merge へ付けない。付けると、残作業があっても issue が閉じる
- **merge 済みの branch 名を再利用しない。** 同じ名前が二つの異なる作業を指すと、branch 名から issue を一意に引けなくなる
- **既定 branch への merge が本番適用を起こす repository では、経路 2 も本番へ適用される。** 検証のための merge であっても適用は起きるため、適用されて困る変更を含めない

#### 提案背景

**この論点が扱う範囲。** 契約として書く内容を確定する。置き場は論点2 で扱う。

**この順序にする理由。** 両端から問うと what が上位にある。契約内容の確定に置き場の結論は要らないが、置き場の確定には契約内容が要る。分量が `development_standards` の維持規律（「増やした後の file 数と分量で、設計前調査の一段階として読み切れるか」）に効き、実行時に必要かどうかが発火先を変えるためである。

**失敗の分析から導いた。**

| 起きたこと | 何が問題だったか | どこでどうすればよかったか |
| --- | --- | --- |
| 検証のために既定 branch へ merge する必要が生じた | 問題ではない。既定 branch でしか確認できない挙動は実在する | — |
| issue 完了の merge と同じ経路（`Closes` 付き PR）を使った | merge が issue を閉じた。残作業があったのに完了扱いになった | 検証のための merge だと分かった時点で、`Closes` を持たない PR を立てる |
| merge 済みの branch 名を再利用した | branch 名と issue の 1:1 対応が崩れた。同じ名前が二つの異なる作業を指す | 新しい branch 名を使う |

**共有されていなかった前提は一つである。** branch と issue は 1:1 で対応し、merge はその両方の終了を意味する。この前提が skill に書かれていないため、`Closes` を付けるかどうかが「その PR で issue を閉じたいか」という個別判断になり、branch 名の再利用が「履歴が綺麗になるか」という別の軸で判断された。

**前提を先に置く理由。** 二つの経路だけを書くと、どちらを選ぶかの判定が個別事情に依存する。前提を置けば、判定は「この merge で issue の作業が終わるか」の一問に落ちる。

**三つ目の規律を入れる理由。** 親 phase の DoD は「既定 branch への merge が本番適用を起こす repository で、この契約がどう効くかが読み取れる」を含む。経路 2 は「検証のため」であっても適用を起こすため、経路を分けただけでは安全にならない。

**調査で確定した事実。**

```text
merge と issue の契約は、どの skill にも存在しない

task-design/tasklist-design.md   push/PR section の生成条件、commit 前のユーザー動作確認
tasklist-executor/SKILL.md       script の使用、ユーザー動作確認前に commit・push へ進まない
steering/SKILL.md                branch_from_basename、ユーザー動作確認前に commit・push・PR
share-work-in-progress/SKILL.md  作業中 branch の共有。PR 作成まで。merge はしない
```

四つの skill はいずれも「PR を作るところまで」を扱い、merge した後に何が終わるかを扱っていない。`feature-<issue番号>` という branch 命名契約は利用先 repository の context file にあり、plugin 側には無い。

**既存契約との関係。** 親 phase の scope は「既存の『ユーザー動作確認が完了する前に commit、push、PR を行わない』との関係整理」を含むが、これは `share-work-in-progress` が既に済ませている。同 skill は起動 gate で「`tasklist-executor` の契約とは前提が逆であり、動作確認の後に呼ぶものではない」と明記している。今回の契約は merge 以降を扱うため、両者と扱う区間が重ならない。

**この提案が扱わないこと。** 検証のための merge をどの単位で立てるか（専用 branch を切るか、作業 branch から直接 PR を立てるか）は、経路 2 の内部の判断である。独立して却下できるため、別の decision として分ける。

#### 提案0へのフィードバック

**結果:** 採用。

> ok

### イテレーション1: 前提を 1:1 から所属関係へ直す

#### 提案1

```text
前提
  branch は issue に属する。branch 名から issue 番号を一意に引ける。
  一つの issue に複数の branch があってよい。
  issue の終わりは、`Closes` を持つ PR の merge が宣言する。

経路 1: issue 完了の merge
  その issue の作業が終わった
  PR は `Closes` を持つ
  merge 後、その branch 名は再利用しない

経路 2: 検証のための merge
  既定 branch 上でしか動かない仕組み（CI、deploy 等）を確認する必要がある
  PR は `Closes` を持たない。issue へは参照として書く
  merge 後、既定 branch を作業 branch へ取り込み、作業を続ける
```

経路の選択は「この merge で issue の作業が終わるか」で判定する。

##### 三つの規律

- **`Closes` は issue の終わりを宣言する。** 検証のための merge へ付けない
- **merge 済みの branch 名を再利用しない。** 同じ名前が二つの異なる作業を指すと、名前から作業を復元できなくなる
- **既定 branch への merge が本番適用を起こす repository では、経路 2 も適用を起こす。** 検証のための merge であっても適用は起きるため、適用されて困る変更を含めない

#### 提案背景

**再開させた feedback。** 論点4 の提案0 へ寄せられた指摘が、この論点の前提を変えた。

**無効になった判断。** 前提「branch と issue は 1:1 で対応する。merge はその branch の作業の終わりであり、同時に issue の終わりである」を取り下げる。

1:1 とすると、検証用 branch を作る余地が無くなる。検証用 branch も issue のための作業であるため、issue から切り離すと branch 名から文脈を引けなくなる。実際に検証が必要になるのは GitHub Actions や CI が既定 branch 上でしか動かない場合であり、それは特定の issue の作業の一部である。

**維持する判断。** 三つの規律は維持する。`Closes` が issue の終わりを宣言すること、merge 済み branch 名を再利用しないこと、経路 2 も本番適用を起こすことは、前提が変わっても成立する。

**所属関係へ変える理由。**

1:1 は「一つの issue に一つの branch」を意味し、branch が増えることを禁じる。しかし禁じたいのは branch が増えることではなく、**merge が意図せず issue を閉じること**と、**branch 名から作業を復元できなくなること**である。

所属関係にすれば、issue に複数の branch があってよい。branch 名から issue 番号を引けるため、どの branch がどの issue の作業かは辿れる。issue の終わりは `Closes` が宣言するため、merge の回数とは独立する。

**「merge 後、既定 branch を作業 branch へ取り込む」を経路 2 へ入れる理由。** 検証のための merge は既定 branch を進める。作業 branch がそのままだと、以降の作業が古い既定 branch の上に乗る。実証済みの形でも、検証 merge の後に既定 branch を作業 branch へ取り込んでいる。

**branch 名の形式は別の decision とする。** 利用者は `issue-[0-9]+-xx` 形式を提案した。これは「`issue-` の後の数値だけを issue 番号として読み、それ以降は自由にする」という命名規則であり、前提（branch は issue に属する）を満たす一つの形である。前提と形式は独立して却下できるため、別の論点で扱う。

#### 提案1へのフィードバック

**結果:** 採用。branch 名の形式を別論点として扱うことも合意。

> ok。「branch 名の形式（issue-[0-9]+-xx）は別の論点にする。」で何個も作れるからって本線はissue-[0-9]+で終わるものにするっていうのも話しておきたい

### 決定

前提を所属関係として置き、そこから二つの merge 経路と三つの規律を導く。

```text
前提
  branch は issue に属する。branch 名から issue 番号を一意に引ける。
  一つの issue に複数の branch があってよい。
  issue の終わりは、`Closes` を持つ PR の merge が宣言する。

経路 1: issue 完了の merge        経路 2: 検証のための merge
  その issue の作業が終わった       既定 branch 上でしか動かない仕組みを確認する必要がある
  PR は `Closes` を持つ             PR は `Closes` を持たない。issue へは参照として書く
  merge 後、branch 名は再利用しない merge 後、既定 branch を作業 branch へ取り込み作業を続ける
```

経路の選択は「この merge で issue の作業が終わるか」で判定する。

規律は三つ。`Closes` は issue の終わりを宣言するため検証の merge へ付けない。merge 済みの branch 名を再利用しない。既定 branch への merge が本番適用を起こす repository では経路 2 も適用を起こすため、適用されて困る変更を含めない。

1:1 を採らないのは、禁じたいのが branch の増加ではなく、merge が意図せず issue を閉じることと、branch 名から作業を復元できなくなることだからである。

### 旧決定（イテレーション0）

前提を一つ置き、そこから二つの merge 経路と三つの規律を導く。

```text
前提
  branch と issue は 1:1 で対応する。
  merge はその branch の作業の終わりであり、同時に issue の終わりである。

経路 1: issue 完了の merge          経路 2: 検証のための merge
  branch が issue の作業を終えた      既定 branch へ入れないと確認できない挙動がある
  PR は `Closes` を持つ               PR は `Closes` を持たない
  merge 後、branch 名は再利用しない   検証が終わったら元の作業 branch へ戻る
```

経路の選択は「この merge で issue の作業が終わるか」で判定する。

規律は三つ。`Closes` は issue の終わりを宣言するため検証の merge へ付けない。merge 済みの branch 名を再利用しない。既定 branch への merge が本番適用を起こす repository では経路 2 も適用を起こすため、適用されて困る変更を含めない。

検証のための merge をどの単位で立てるかは、経路 2 の内部の判断として別に扱う。

---

## 論点2: 契約をどこが所有するか

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0: 所有者を決める

#### 提案0

##### 先に、何を満たせば解けるか

| 基準 | 内容 |
| --- | --- |
| 発火 | 契約が必要な場面で、読まれる場所にあるか |
| 正本の一意性 | 同じ判断が複数の場所に存在しないか |
| 維持規律 | 置いた先の既存の参照契約を壊さないか |

##### 調査結果 — 誰が何を読むか

```text
task-design           development_standards 配下をすべて読む（設計前調査。無条件）
name-work-directory   naming/README.md を入口として引く
tasklist-executor     development_standards を読まない
steering              development_standards を読まない
```

契約が必要な場面は三つある。

```text
tasklist を作る段階     merge task を含むか、どちらの経路かを判定する    → task-design
実行する段階            merge を実行する                                 → tasklist-executor
orchestration           branch を作る、phase の開始と終了を管理する      → steering
```

`development_standards/README.md` は置き場の判断基準と維持規律を持つ。

```text
置き場の判断  この標準は、名前を付ける場面・entity を設計する場面のどちらかで
              判断基準として使われるか
維持規律      増やした後の file 数と分量で、設計前調査の一段階として読み切れるか
              現在 11 file・約 56KB
```

##### a. `development_standards` に開発フローの群を立て、必要な skill が参照する

```text
docs/development_standards/
├── README.md                    収録一覧と置き場判断を更新
├── naming/
├── entity_modeling/
└── development_flow/            新設
    └── branch_pr_issue.md       前提、二つの経路、三つの規律
```

`README.md` の置き場判断を「名前を付ける場面・entity を設計する場面」から広げる。`steering` と `tasklist-executor` からは参照を置く。

##### b. `steering` に置く

branch を作り phase の開始と終了を管理するのは `steering` である。

##### c. `task-design/tasklist-design.md` に置く

push・PR section の生成規則を持つのは同 file である。

**推す案は a。**

#### 提案背景

**この論点が扱う範囲。** 論点1 で契約内容が決まった。所有者と置き場を決める。参照の張り方は、所有者が決まってから別に扱う。

**a を推す理由。**

第一に、契約が必要な場面が三つの skill にまたがる。skill の中へ置くと、他の二つから引けない。docs へ置けば三つとも参照できる。

第二に、`task-design` が `development_standards` 配下を無条件に読む。「今回は命名判断を含むか」を判定しない契約であるため、判定漏れによって標準へ触れない経路が生じない。tasklist を作る段階での発火は確実になる。

第三に、前 phase（`proposal-decidability`）が同じ構造を採っている。判断基準は docs が正本を持ち、skill は参照と適用タイミングだけを持つ。同じ性質のものを同じ形で置けば、読み手は既存の形から今回の形を予測できる。

**b を採らない理由。** `steering` は branch を作る場面を持つが、tasklist を作る場面と実行する場面を持たない。`task-design` が merge task を設計するとき、`steering` の本文を読む契約が無い。

**c を採らない理由。** `tasklist-design.md` は plan の設計規則であり、実行時と orchestration 時に読まれない。加えて同 file は `task-design` の配下にあり、他 skill から引く前例が無い。

**a を採るときに解決が要る二点。**

**置き場の判断基準を広げる必要がある。** `README.md` は「名前を付ける場面・entity を設計する場面のどちらかで判断基準として使われるか」を置き場の問いにしている。開発フローはどちらでもないため、現在の基準では「この群の外」になる。群の名前（開発標準）は広いが、README の定義が狭い。基準を広げる形も、この decision の一部として扱う必要がある。

**維持規律への影響を見積もる必要がある。** 現在 11 file・約 56KB で、`task-design` が設計前調査の一段階として全部読む。論点1 で決めた内容は前提・二経路・三規律であり、1 file で 2〜3KB 程度に収まる。12 file・約 59KB になる。読み切れるかの判断は利用者に委ねる。

**`steering` と `tasklist-executor` が読まない問題。** この二つは `development_standards` を読む契約を持たない。a を採る場合、両者から参照を置くか、読む契約を足すかが必要になる。**これは独立して却下できるため、別の decision として分ける。**

#### 提案0へのフィードバック

**結果:** a を採用。README の定義が誤っているという指摘を伴う。

> ok。READMEの「命名規約とエンティティ設計の判断基準を置く場所。」なわけないよね。開発にまつわる標準を置く場所だよ

### 決定

`development_standards` に開発フローの群を立て、必要な skill が参照する。

```text
docs/development_standards/
├── README.md                    収録一覧と定義を更新
├── naming/
├── entity_modeling/
└── development_flow/            新設
    └── branch_pr_issue.md       前提、二つの経路、三つの規律
```

契約が必要な場面が三つの skill（`task-design` / `tasklist-executor` / `steering`）にまたがるため、skill の中へ置くと他から引けない。`task-design` は `development_standards` 配下を無条件に読むため、判定漏れによって標準へ触れない経路が生じない。

`README.md` の定義「命名規約とエンティティ設計の判断基準を置く場所」は、群の実体ではなく当時の収録物を書いたものであり、誤りである。**この群は開発にまつわる標準を置く場所である。** 定義と置き場の判断基準をどう書き直すかは論点3 で扱う。

`steering` と `tasklist-executor` が `development_standards` を読まない件は、別の decision として扱う。

---

## 論点3: `development_standards/README.md` の定義と置き場の判断をどう書くか

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0: 書き方を決める

#### 提案0

##### 他の群の定義形式

```text
documentation_standards   docs の書き方・構造化に関する標準を置く場所
think_standards           議論・思考プロセスの作法を扱う。対象は思考・議論プロセスが絡む全場面
development_standards     命名規約とエンティティ設計の判断基準を置く場所   ← 収録物の列挙
```

他の二つは対象を名指ししている。`development_standards` だけが、当時の収録物をそのまま定義にしている。

##### 修正案

```diff
 # 開発標準

-命名規約とエンティティ設計の判断基準を置く場所。
+開発にまつわる標準を置く場所。
```

置き場の判断は、場面の列挙から対象領域の問いへ変える。

```diff
 ## この群の置き方

 新しい標準をどこへ置くかは、次の問いで判断する。

-**この標準は、名前を付ける場面・entity を設計する場面のどちらかで、判断基準として使われるか。**
+**この標準が扱う対象は何か。**
 
-- 使われる → この群の配下（`naming/` または `entity_modeling/`、あるいは新設する群）
-- 使われない → この群の外。対象領域を持つ別の docs 群（例: `documentation_standards/`、`think_standards/`）
+- 開発そのもの（何を作るか、どう名付けるか、どう進めるか） → この群の配下。既存の群に当たらなければ新設する
+- docs の書き方・構造化 → `documentation_standards/`
+- 思考・議論のプロセス → `think_standards/`
+
+docs を書くことも開発の一部だが、**書き方**の標準は `documentation_standards/` が持つ。この群が持つのは、開発の成果物と手順についての判断基準である。
```

収録一覧へ一行足す。

```diff
 - **[entity_modeling/](./entity_modeling/README.md)** — エンティティ設計の判断基準。
+- **[development_flow/](./development_flow/branch_pr_issue.md)** — 開発の進め方の判断基準。branch・PR・issue の対応と、merge が何を終わらせるか。
```

**推す案はこの形。** 対案は場面の列挙を広げる形（「名前を付ける / entity を設計する / 開発フローを決める 場面で使われるか」）だが、群が増えるたびに列挙が伸びるため採らない。

#### 提案背景

**この論点が扱う範囲。** 論点2 で `development_standards` へ置くことが決まった。README の定義と置き場の判断をどう書き直すかを決める。

**定義を直す理由。** 利用者の指摘のとおり、現在の定義は群の実体ではなく当時の収録物を書いている。収録物を定義にすると、収録が増えるたびに定義が古くなる。他の二つの群は対象を名指ししており、同じ形へ揃える。

**置き場の判断を対象領域の問いへ変える理由。** 現在は場面の列挙であるため、新しい群を足すたびに列挙が伸びる。今回 `development_flow/` を足すと三項目になり、次に足せば四項目になる。対象領域で問えば、群が増えても問いは変わらない。

**docs との境界を明示する理由。** 「開発そのもの」は広く、docs を書くことも開発に含まれる。境界を書かないと、`documentation_standards` が持つべき標準がこの群へ流れ込む。`documentation_standards` の定義が「docs の書き方・構造化」であるため、書き方はそちらが持つと明示する。

**維持規律は変えない。** 「増やした後の file 数と分量で、設計前調査の一段階として読み切れるか」という問いと、現在の file 数・分量の記載は、`development_flow/` を足した後の値へ更新する。問いそのものは変えない。

#### 提案0へのフィードバック

**結果:** 採用。

> ok

### 決定

定義を「開発にまつわる標準を置く場所」へ直し、置き場の判断を場面の列挙から対象領域の問いへ変える。

```text
**この標準が扱う対象は何か。**

- 開発そのもの（何を作るか、どう名付けるか、どう進めるか） → この群の配下
- docs の書き方・構造化 → documentation_standards/
- 思考・議論のプロセス → think_standards/

docs を書くことも開発の一部だが、書き方の標準は documentation_standards/ が持つ。
この群が持つのは、開発の成果物と手順についての判断基準である。
```

収録一覧へ `development_flow/` の行を足す。維持規律の問いは変えず、file 数と分量の記載だけ更新する。

---

## 論点4: 検証のための merge を、どの単位で立てるか

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0: branch と PR の単位を決める

#### 提案0

##### 実証済みの形（利用先で実際に行い、機能した）

```text
head branch   verify-<検証内容>            作業 branch とは別に切る
                                           `feature-<issue番号>` 形式を使わない
base          既定 branch
PR body       この PR 自体は issue の完了を意味しない
              動作確認用の一時的な差分であり、確認後に削除して merge する
issue 参照    「参照: #NN」                `Closes` を使わない
merge 後      作業 branch へ既定 branch を取り込み、作業を続ける
検証の後始末  検証用の差分を削除する変更を、改めて merge する
```

##### 契約として書く形

```text
検証のための merge では、作業 branch とは別に検証用 branch を切る。

branch 名      検証内容を表す名前にする。issue へ対応づける命名規則
               （`feature-<issue番号>` 等）を使わない
差分           検証に必要な最小限だけを含める。作業 branch の変更を巻き込まない
PR             `Closes` を持たない。issue へは参照として書く
               本文に「この PR は issue の完了を意味しない」を明記する
merge 後       作業 branch へ既定 branch を取り込み、作業を続ける
後始末         検証用の差分は、確認が済んだら削除する変更を改めて merge する
```

**推す案はこの形。** 対案は作業 branch から直接 `Closes` なしの PR を立てる形だが、採らない。

#### 提案背景

**この論点が扱う範囲。** 論点1 で経路 2（検証のための merge）を置くことが決まった。その内部の単位を決める。

**実証済みの形をそのまま契約にする理由。** 利用先で実際に行われ、機能した。branch 名、PR 本文、issue 参照、後始末まで一通り揃っている。設計しなおすより、機能した形を書き起こすほうが確実である。

**専用 branch を切る理由。**

第一に、作業 branch から直接 PR を立てると、作業中の変更がすべて既定 branch へ入る。既定 branch への merge が本番適用を起こす repository では、検証したい一点以外の変更も適用される。論点1 の三つ目の規律「適用されて困る変更を含めない」を満たせない。

第二に、`feature-<issue番号>` 形式を使わないことで、前提（branch と issue は 1:1）が保たれる。検証用 branch は issue に対応しないため、issue へ対応づける命名規則の外へ置く。実証済みの形では `verify-` で始まる名前が使われた。

**後始末を契約へ含める理由。** 検証用の差分は、検証のためだけに入れたものである。残すと既定 branch に意味のない差分が残り、次に読む人が意図を復元できない。実証済みの形では、確認後に削除する変更を改めて merge している。

**作業 branch から直接 PR を立てる形を採らない理由。** `Closes` を外すだけなら実装は簡単だが、上の第一の理由により、検証したい一点以外の変更が本番へ適用される。検証のたびに作業 branch 全体を本番へ入れることになる。

**この提案が扱わないこと。** 検証用 branch の命名規則を具体的にどう定めるか（prefix を固定するか、慣習に留めるか）は、利用先ごとの命名契約に属する。plugin 側では「issue へ対応づける命名規則を使わない」ことだけを定める。

#### 提案0へのフィードバック

**結果:** 最小差分では検証できない。加えて上位の前提が変わる。

> いいけど、検証用PRを立てるなんて大抵github action絡みや それに依存関係のあるciアクションで、 それを思った通りに作動させようとすると本線のブランチの主な修正記録を持ってこないとできないとかありそう。だから issue-[0-9]+-xxの形にして、mainマージ後にmainを最新化して本線にmergeさせるとかでも良いと思う。ブランチ名も、後方をすべてissue番号としているけど、issue-の後の数値だけヒットさせる形にすればブランチ名の制約は少し緩まるんじゃない？

検証用 PR が必要になるのは、GitHub Actions や CI が既定 branch 上でしか動かない場合である。それを意図どおり動かすには、本線の修正が既定 branch に入っている必要がある。「差分は検証に必要な最小限だけ。作業 branch の変更を巻き込まない」は成立しない。

さらに、検証用 branch を `feature-<issue番号>` 形式の外へ置くという提案は、branch を issue から切り離す。利用者の提案は逆に、検証用 branch も issue に属させる形である。これは論点1 の前提「branch と issue は 1:1」を変える。

### イテレーション1: 本線を取り込める形へ直す

#### 提案1

```text
検証用 branch   `issue-<番号>-<検証内容>`。本線と同じ issue に属する
差分            既定 branch 上でしか動かない仕組みを動かすのに必要な範囲を含めてよい。
                本線の変更を取り込むことを妨げない
PR              `Closes` を持たない。issue へは参照として書く
                本文に「この PR は issue の完了を意味しない」を明記する
merge 後        既定 branch を本線へ取り込み、作業を続ける
後始末          検証のためだけに入れた差分は、本線で削除する。
                issue 完了の merge でその削除が既定 branch へ反映される
```

#### 提案背景

**再開条件が満たされた。** 論点1 で前提が所属関係になり、論点5 で形式が決まった。

**提案0 から取り下げた二点。**

第一に、「差分は検証に必要な最小限だけ。作業 branch の変更を巻き込まない」を取り下げる。検証用 PR が必要になるのは、GitHub Actions や CI が既定 branch 上でしか動かない場合である。それを意図どおり動かすには、本線の修正が既定 branch に入っている必要がある。最小差分に制限すると、検証したい仕組みそのものが動かない。

第二に、「`feature-<issue番号>` 形式を使わない」を取り下げる。検証用 branch を issue から切り離すと、branch 名から文脈を引けなくなる。検証は特定の issue の作業の一部であるため、同じ issue に属させる。

**後始末の形が変わる理由。** 提案0 では「検証用の差分を削除する変更を改めて merge する」としていた。本線を取り込む形にすると、検証用の差分も本線へ入る。本線で削除すれば、issue 完了の merge で削除が既定 branch へ反映される。別の merge を立てる必要が無くなる。

**merge 後に既定 branch を本線へ取り込む理由。** 検証のための merge は既定 branch を進める。本線がそのままだと、以降の作業が古い既定 branch の上に乗る。実証済みの形でも、検証 merge の後に既定 branch を本線へ取り込んでいる。

#### 提案1へのフィードバック

**結果:** 採用。

> ok

### 決定

検証のための merge は、本線と同じ issue に属する branch で立てる。

```text
検証用 branch   `issue-<番号>-<検証内容>`
差分            既定 branch 上でしか動かない仕組みを動かすのに必要な範囲を含めてよい
PR              `Closes` を持たない。issue へは参照として書く
                本文に「この PR は issue の完了を意味しない」を明記する
merge 後        既定 branch を本線へ取り込み、作業を続ける
後始末          検証のためだけに入れた差分は本線で削除し、issue 完了の merge で反映する
```

最小差分に制限しないのは、検証用 PR が必要になるのが CI や deploy が既定 branch 上でしか動かない場合であり、それを動かすには本線の修正が既定 branch に入っている必要があるためである。

---

## 論点5: branch 名の形式をどこまで標準が定めるか

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0: 標準が定める範囲を決める

#### 提案0

##### 先に、何を満たせば解けるか

| 基準 | 内容 |
| --- | --- |
| 一意性 | branch 名から issue 番号を一意に引けるか |
| 本線の識別 | その issue の本線がどれかを名前から判定できるか |
| 利用先差の吸収 | issue を持たない repository でも成立するか |

##### 調査結果 — 契約は repository ごとに違い、script がそれを読む

```text
利用先 repository   `feature-<issue番号>` branch は、同じ番号の GitHub Issue に対応する
plugin repository   なし。issue番号のような安定した識別子を持たない。
                    branch名は steering directory の basename（YYYYMMDD-slug）に揃える
```

`scripts/github/create_or_get_pr.sh` は、利用先の context file の `### Branch / issue 契約` section を読み、`feature-<issue番号>` という文字列が含まれるかで判定している。形式は context file が宣言し、script がそれを読む構造になっているが、**script 側に特定の文字列がハードコードされている。**

##### a. 標準は原則と推奨形式を定め、利用先が context file で宣言する

```text
標準が定める原則
  branch 名から issue 番号を一意に引けること
  その issue の本線がどれかを名前から判定できること
  merge 済みの branch 名を再利用しないこと

標準が示す推奨形式
  本線          issue-<番号>               例: issue-28
  派生          issue-<番号>-<説明>         例: issue-28-verify-ci

  `issue-` の直後の数値列を issue 番号として読む。それ以降は自由にする。
  本線は番号で終わることで、派生と区別できる。

利用先が宣言すること
  この形式を採るか、別の形式を採るか。採らない場合は自身の形式を context file へ書く
  issue を持たない repository は、その旨と代わりの識別子を書く
```

`create_or_get_pr.sh` のハードコードを、context file の宣言を読む形へ緩める。

##### b. 標準が形式を定める（利用先は従う）

##### c. 標準は原則だけ定め、形式は完全に利用先任せ

**推す案は a。**

#### 提案背景

**この論点が扱う範囲。** 論点1 で前提「branch は issue に属する。branch 名から issue 番号を一意に引ける」が決まった。それを満たす形式をどこまで標準が定めるかを決める。

**a を推す理由。**

第一に、issue を持たない repository が実在する。plugin repository 自身がそれであり、branch 名を steering directory の basename に揃えている。標準が形式を強制すると、この repository では成立しない。

第二に、原則だけでは形式が揺れる。「issue 番号を一意に引ける」を満たす形式は複数あり（`feature-28`、`issue-28`、`28-xxx` 等）、利用先ごとに違えば、skill 側が branch 名から issue を引く処理を利用先ごとに書き分けることになる。推奨形式を示せば、特段の事情が無い限り揃う。

第三に、宣言の置き場が既にある。context file の `### Branch / issue 契約` section がそれであり、`create_or_get_pr.sh` が既にそこを読んでいる。新しい仕組みを作らずに済む。

**本線を番号で終わらせる理由。** 一つの issue に複数の branch があってよいとすると、どれが本線かが名前から分からなくなる。`Closes` を持つ PR を出すのは本線であるため、本線が識別できないと、どの PR に `Closes` を付けるかが個別判断になる。番号で終わる形にすれば、派生（番号の後に説明が続く）と機械的に区別できる。

**`issue-` prefix を使う理由。** 現在の `feature-` は branch の性質（機能追加）を示すが、検証用 branch は機能追加ではない。`issue-` なら所属を示すため、派生 branch も同じ prefix で扱える。

**b を採らない理由。** issue を持たない repository で成立しない。plugin repository 自身がその例である。

**c を採らない理由。** 形式が利用先ごとに揺れると、branch 名から issue を引く処理を skill 側で書き分けることになる。現在 `create_or_get_pr.sh` が特定の文字列をハードコードしているのは、揺れを前提にしていないためである。

**script の変更が scope に入るかを確認したい。** 親 phase の scope は owner 候補として `task-design` / `tasklist-executor` / `steering` を挙げており、script を含まない。しかし形式を変えると `create_or_get_pr.sh` の判定が通らなくなる。scope へ含めるか、別に扱うかを決める必要がある。

#### 提案0へのフィードバック

**結果:** a を採用。script の変更も scope に含める。

> aの「標準は原則と推奨形式」で全然問題ない。「 create_or_get_pr.sh の変更が scope に入るか」入る

### 決定

標準は原則と推奨形式を定め、利用先が context file で宣言する。

```text
原則
  branch 名から issue 番号を一意に引けること
  その issue の本線がどれかを名前から判定できること
  merge 済みの branch 名を再利用しないこと

推奨形式
  本線   issue-<番号>            例: issue-28
  派生   issue-<番号>-<説明>      例: issue-28-verify-ci

  `issue-` の直後の数値列を issue 番号として読む。それ以降は自由にする。
```

issue を持たない repository は、その旨と代わりの識別子を context file へ書く。`create_or_get_pr.sh` のハードコードを、context file の宣言を読む形へ緩める。この script 変更をこの phase の scope に含める。

---

## 論点6: `steering` と `tasklist-executor` から標準をどう引くか

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0: 参照の要否と張り方を決める

#### 提案0

##### 先に、何を満たせば解けるか

| 基準 | 内容 |
| --- | --- |
| 発火 | その skill が契約を必要とする場面で、実際に読まれるか |
| 既存設計との整合 | その skill が「何を読むか」について既に持つ方針と矛盾しないか |
| 正本の一意性 | 契約の内容を skill 側へ複製しないか |

##### 調査結果 — 両 skill は plugin の docs を直接読む契約を持たない

```text
steering            maintenance-plugin-context へ consumer=steering を渡し、返された範囲だけを読む。
                    「task-design が設計に使う architecture・開発規約・test方針を
                     初回起動前に steering 自身の判断材料として読まない」と明記
tasklist-executor   maintenance-plugin-context へ consumer=tasklist-executor を渡し、
                    返された範囲だけを実行条件として使う
name-work-directory naming/README.md を直接引く（plugin の docs を引く前例）
task-design         development_standards 配下を無条件にすべて読む
```

##### 各 skill が契約を必要とする場面

```text
task-design         tasklist を作るとき、merge task をどちらの経路で書くか判定する
tasklist-executor   tasklist に書かれた merge task を実行する
steering            branch を作る（branch_from_basename）。merge 済み branch 名の再利用を避ける
```

##### a. `steering` にだけ参照を置き、`tasklist-executor` には置かない

```text
steering          branch を作る直前に branch_pr_issue.md を引く。
                  merge 済みの branch 名を再利用しないことと、branch 名の原則を確かめる
tasklist-executor 置かない。tasklist に書かれた内容を実行するだけであり、
                  どちらの経路かの判定は task-design が tasklist を作る段階で済んでいる
```

##### b. 両方へ置く

##### c. どちらにも置かない。`task-design` が tasklist へ書き込むことで伝える

**推す案は a。**

#### 提案背景

**この論点が扱う範囲。** 論点2 で `development_standards` が正本と決まった。`task-design` は無条件に読むため参照が要らない。残る二つの skill から引くかを決める。

**a を推す理由。**

`steering` は branch を作る。`branch_from_basename=true` のとき、basename と同名の branch を作成する。「merge 済みの branch 名を再利用しない」はこの場面で守るべき規律であり、tasklist には現れない。`task-design` が tasklist を作る段階では、branch は既に存在する。

既存設計とも矛盾しない。`steering` が読まないと明記しているのは「task-design が設計に使う architecture・開発規約・test方針」であり、その理由は設計判断を task-design へ委ねるためである。branch 名は steering 自身が決める対象であり、設計判断ではない。加えて `name-work-directory` が `naming/README.md` を直接引く前例があり、skill が plugin の docs を引く形は確立している。

`tasklist-executor` へ置かない理由は、同 skill が tasklist に書かれた内容を実行する役割に限られるためである。どちらの経路で merge するかは `task-design` が tasklist を作る段階で判定済みであり、実行時に判定し直す場面が無い。実行中に新しい判断が必要になれば、同 skill は停止して親へ返す契約を持つ。

**b を採らない理由。** `tasklist-executor` が契約を読んでも、判定する場面が無い。読む対象が増えるだけで発火しない。

**c を採らない理由。** branch を作る場面が tasklist に現れない。`steering` が branch 名を決めるとき、契約へ触れる経路が無くなる。

**参照の形。** 契約の内容を skill 側へ写さず、引く指示だけを置く。`name-work-directory` が採っている形と同じである。

```text
name-work-directory の形:
  slug の規則を適用する前に、`docs/development_standards/naming/README.md` を
  入口として引き、そこの引き方に従う。個別 file を名指ししないのは、
  どの file が該当するかの判断を README 側へ持たせるためである。
```

#### 提案0へのフィードバック

**結果:** a を採用。加えて `task-design` 側にも引く場面を明示する。

> aでok。task-design側でも念押ししておきたいけどね。別個独立して運用方針があるだけで、どこでその運用方針を見てほしいかは薄まってしまって守られない可能性があるから、全部を見るから安心とは思わない

### イテレーション1: `task-design` 側にも引く場面を置く

#### 提案1

a の内容に加えて、`tasklist-design.md` の二箇所へ置く。

```diff
 push・PR section の生成規則（既存の隣）
+- 既定 branch への merge を含む場合は、`docs/development_standards/development_flow/branch_pr_issue.md`
+  を引き、issue 完了の merge か検証のための merge かを判定してから section を生成する。
+  判定の中身は同 file が正本であり、ここへ写さない。

 自己レビューgate（既存の項目群へ）
+- [ ] **既定 branch への merge を含む場合、どちらの経路か判定したか**:
+      `Closes` の有無と branch の扱いが経路に合っているか。
+      失敗例: 検証のための merge に `Closes` を付け、残作業があるのに issue が閉じる。
```

#### 提案背景

**直前の feedback から今回満たす必要が生じた条件。** 「配下をすべて読む」ことと、その場面で引くことを分けること。

**提案0 の誤り。** 「`task-design` は `development_standards` 配下を無条件に読むため参照が要らない」と判断した。読むことと、必要な場面でそれを使うことは別である。11 file を読んでも、merge task を書く段になって `branch_pr_issue.md` を思い出すとは限らない。

**同じ誤りを前 phase でも踏んでいる。** `proposal-decidability` では「template を正本にすれば読まれる」と考え、template が注入されないため発火しないことを指摘された。今回は「無条件に読むから発火する」と考えた。**どちらも、読まれる可能性があることを、その場面で使われることと同一視している。**

**二箇所へ置く理由。**

生成規則は実手順である。merge task を書く場面でそこを読むため、判定の契機になる。

自己レビュー gate は書いた後の確認である。gate には既に「完了後actionがrepository contextへ従うか」があり、commit・push・PR の適用条件を確かめている。merge も同じ系列であり、経路の判定を確かめる項目を並べる。

**内容を写さない。** どちらも「引く」指示と、失敗例だけを持つ。判定の中身は `branch_pr_issue.md` が正本である。

#### 提案1へのフィードバック

**結果:** 採用。

> ok

### 決定

`steering` と `task-design` へ引く場面を置く。`tasklist-executor` には置かない。

```text
steering                    branch を作る直前に branch_pr_issue.md を引く
task-design（tasklist-design.md）
  push・PR section の生成規則   既定 branch への merge を含む場合は同 file を引き、
                                どちらの経路か判定してから section を生成する
  自己レビューgate              経路の判定を確かめる項目を置く
tasklist-executor           置かない。tasklist に書かれた内容を実行する役割に限られ、
                            経路の判定は tasklist を作る段階で済んでいる
```

いずれも判定の中身を写さず、引く指示と失敗例だけを持つ。

`task-design` が `development_standards` 配下を無条件に読むことは、その場面で使われることを保証しない。読まれる可能性と、必要な場面で引かれることは別である。

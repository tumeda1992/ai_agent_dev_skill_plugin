# 議論記録

## 論点1: 4 件を個別の修正として扱うか、一般則を先に立てるか

**ステータス:** 提案中

**種別:** TBDヒアリング

### イテレーション0: 事項1 だけ一般則へ引き上げ、残り 3 件は個別修正とする

#### 提案0

**推奨:** b。事項1 は同じ形の条件文が repository 内に複数あり、起点の 1 行だけ直すと同じ穴が残る。残り 3 件は形が違い、畳むと具体修正が一意に決まらなくなる。

- **a. 4 件すべてを個別修正として扱う。一般則を立てない。**
  - 各事項の修正が起点の箇所に閉じる
  - 事項1 は起点以外に同じ形の条件文が存在するため、修正範囲を決める根拠が残らない
- **b. 事項1 だけ一般則へ引き上げ、残り 3 件は個別修正とする。**
  - 一般則の内容: repository context の返却を条件にして成果物を生成・省略する契約は、`maintenance-plugin-context` の返却形式（`status: available | unavailable` と `allowed context`）で条件を書き、`unavailable` の場合と、該当 fact が `allowed context` に含まれない場合の既定動作を書く
  - 事項1 の起点（`tasklist-design.md:122`）は、この一般則の適用例として修正する
  - 事項2・3・4 はそれぞれ独立した decision として扱う
- **c. 4 件を貫く一般則を一つ立て、4 件をその適用例にする。**
  - 一般則の候補: 「skill は依拠する参照先と条件を、skill 自身から辿れる形で持つ」
  - 4 件すべてが一つの命題の下に並ぶ
  - 命題が抽象に寄りすぎ、各事項の具体修正を一意に決めない

#### 提案背景

`facilitate-discussion` の原因 owner 分類は、認識齟齬の原因が skill に落ちた場合「具体ケース固有の修正を先に合意しない。原因 owner の一般則を主 decision として合意した後、元の具体ケースをその適用例として必ず再評価する」と定めている。今回の 4 件はいずれも skill 起因の認識齟齬であるため、「一般則を立てるか」を省略できない。同時に、同じ規約は「一般則だけで変更が一意に決まらなければ、残る判断を具体ケース側の decision として保存する」とも定めており、一般則へ畳むこと自体は目的ではない。

提案0 が満たす必要のある条件は次の三つである。

1. 一般則を立てる場合、起点以外の具体 case 二つ以上へ当てて、意図した場所へ落ちること（`task-design/SKILL.md` Step 4「新しい判断基準の検証」）
2. 畳んだ結果、元の具体ケースの修正が一意に決まること
3. 今回の scope（4 件の修正）を超えないこと

##### 調査で判明した事実: 「返された」は既に供給側で定義されている

引き渡し時点では、事項1 の曖昧さを「`maintenance-plugin-context` が Git 運用条件を明示的に列挙しなかった状態を『返されていない』と読むのか、context 全体が返ってきたことを『返された』と読むのかが決まらない」と記述していた。調査の結果、この読みは供給側の契約を見落としている。

`maintenance-plugin-context/SKILL.md` は返却形式を定めており、`status: available | unavailable` と `allowed context:`（H2 / H3 と確認済み fact の列挙）を返す。さらに `consumerの境界` で「必須文脈が `unavailable` なら、consumer は推測しない。repository 固有文脈なしで安全に完結できる一般手順へ縮退するか、repository root・確認元・必要 fact の提示を求める」と定めている。

つまり「返された / 返されない」は供給側で既に一意に定義されている。欠けているのは定義ではなく、消費側の条件文がその定義へ接続していないことである。`tasklist-design.md:122` は「repository context から返された場合」とだけ書き、それが `status` を指すのか `allowed context` への該当 fact の有無を指すのかを示していない。

この事実により、事項1 の修正は「新しい判断基準を発明する」ではなく「既存の供給側契約へ接続する」になる。

##### 条件1 の検証: 一般則を起点以外の case へ当てる

案 b の一般則を、起点（`tasklist-design.md:122`）以外の three case へ当てた結果は次のとおりである。

- `tasklist-design.md:123`（GitHub 公開条件）: 「GitHub公開条件が返され、tasklistに実行可能なcommit taskが一件以上あり…場合だけpush・PR sectionを生成し」。`:122` と同じ形で、返らなかった場合が書かれていない。**修正対象に落ちる**
- `runtime-execution-contracts.md` の `Repository context` 節: 「repository固有のapp URL、authentication、test / lint command…はrepository contextから解決する。共通skill本文とrequest fixtureへ固定しない」。解決できなかった場合が書かれていない。**修正対象に落ちる**
- `tasklist-design.md` 自己レビュー gate「対象actionを含むphaseで、差し込み宣言を要求したか」: 「宣言が返らなければ既定の停止・確認taskだけを置く。要求自体を省略しない」。返らなかった場合が既に書かれている。**修正対象に落ちない**

三つ目が落ちないことが、この基準が「条件文をすべて書き換える」ではなく「返らなかった場合が欠けているものだけを拾う」として機能する証拠である。条件1 を満たす。

##### 条件2 の検証: 案 c を採らない理由

案 c の命題「skill は依拠する参照先と条件を、skill 自身から辿れる形で持つ」を 4 件へ当てると、次のようになる。

- 事項2 の decision は「非 default branch が remote と同期済みで PR も既存のとき、空 commit を作るべきか」である。これは挙動の正しさの判断であり、参照先や条件の明示ではない。命題を当てても「二つの正本のどちらが正か」は決まらない
- 事項3 は、それ自体が「実行が止まる層が存在する」という一般則の追加である。その上へさらに一般則を被せても、書く内容は変わらない
- 事項4 は導線の欠落であり、条件文の欠落ではない。ユーザー合意済みの方針が既にあり、命題を当てても方針は変わらない

したがって案 c の命題は、4 件のうち事項1 以外について具体修正を一意に決めない。条件2 を満たさない。

##### 条件2 の検証: 案 a を採らない理由

事項1 を個別修正に閉じると、修正するのが `:122` の 1 行だけなのか、同じ形の `:123` も含むのかを決める根拠が無くなる。実際に同じ形の条件文が同 file 内に 2 箇所、別 file に 1 箇所ある。範囲を決める根拠が一般則にしか存在しないため、案 a は条件2 を満たさない。

#### 提案0へのフィードバック

**結果:** b を採用。ただし提案内容そのものは伝わらないまま選択された。

> 正直提案内容がよくわからないけど、一旦bで

提案0 は「一般則を立てるか」という設計 process 内部の問いを抽象のまま提示し、案ごとに成果物がどう変わるかを示していなかった。提案の書き方の失敗であり、選択された案の内容が不適切だったことを示すものではない。b が実務上意味するのは次である。

- 修正箇所が起点の 1 行から 3 箇所へ広がる（`tasklist-design.md:122`、同 `:123`、`runtime-execution-contracts.md` の `Repository context` 節）
- 案 a なら `:122` だけを直す
- 案 c なら 4 件を一つの抽象命題で括るが、事項2・3・4 の具体修正は決まらない

### 決定

事項1 を一般則へ引き上げ、事項2・3・4 はそれぞれ独立した decision として扱う。

一般則の内容は次のとおり。repository context の返却を条件にして成果物を生成・省略する契約は、`maintenance-plugin-context` の返却形式（`status: available | unavailable` と `allowed context`）で条件を書き、返らなかった場合の既定動作を書く。

この一般則が拾う箇所は次の 3 箇所である。

| 箇所 | 現在の記述 | 欠けているもの |
| --- | --- | --- |
| `plugins/tumeda-dev/skills/task-design/tasklist-design.md:122` | 「local Git運用条件がrepository contextから返された場合…だけcommit sectionを生成する」 | 返らなかった場合の既定動作、「返された」の判定基準 |
| 同 `:123` | 「GitHub公開条件が返され…場合だけpush・PR sectionを生成し」 | 同上 |
| `plugins/tumeda-dev/skills/runtime-execution-contracts.md` の `Repository context` 節 | 「repository固有の…はrepository contextから解決する」 | 解決できなかった場合の既定動作 |

拾わない箇所として、`tasklist-design.md` 自己レビュー gate の「対象actionを含むphaseで、差し込み宣言を要求したか」がある。「宣言が返らなければ既定の停止・確認taskだけを置く。要求自体を省略しない」と既に書かれており、この一般則を当てると充足済みと判定される。

既定動作の中身は論点2 で決める。

---

## 論点2: repository context が返らなかった場合の既定動作

**ステータス:** 提案中

**親論点:** 論点1

**種別:** TBDヒアリング

### イテレーション0: 縮退できるかで分岐させ、箇所ごとに動作を書き分ける

#### 提案0

**推奨:** c。3 箇所は fact の性質が違い、一律の動作を当てると危険な側へ倒れる箇所が出る。

- **a. 一律「生成しない」で明文化する。**
  - 3 箇所すべてで、返らなかったら対象 section を生成せずそのまま完成させる
  - 書き方が単純で、判定の余地が残らない
  - `runtime-execution-contracts.md` の場合、test command や app URL が無いのに黙って検証を省くことになる。DoD を判定できないまま完了扱いになる危険がある
- **b. 一律「利用者へ提示を求める」で明文化する。**
  - 3 箇所すべてで、返らなかったら停止して repository context の提示を求める
  - 安全側に倒れる
  - commit section の場合、commit task が無い tasklist は成立するのに停止する。今回の失敗（存在しない blocker を作る）と同じ形を、契約として固定することになる
- **c. 「その fact 無しで成果物が意味を保てるか」で分岐する一般則にし、各箇所へ具体動作を書く。**
  - 一般則: 返らなかった場合、その fact 無しでも成果物が意味を保てるなら縮退して完成させる。保てないなら停止して提示を求める。どちらに当たるかを各条件文へ明記する
  - `tasklist-design.md:122`（commit section）: commit task が無い tasklist は plan として成立する → **縮退**。section を生成せず、これを blocker として扱わない
  - 同 `:123`（push・PR section）: 同じ → **縮退**
  - `runtime-execution-contracts.md` の `Repository context`: test command、app URL 等が無いと child 処理を実測できず DoD を判定できない → **停止**。`blocked` を返す
  - 箇所ごとに判断が要るぶん、書く量が増える

#### 提案背景

論点1 で、repository context の返却を条件にする契約は返らなかった場合まで書く、という一般則が決まった。この論点はその「返らなかった場合」の中身を決める。

供給側である `maintenance-plugin-context/SKILL.md` は `consumerの境界` で「必須文脈が `unavailable` なら、consumer は推測しない。repository 固有文脈なしで安全に完結できる一般手順へ縮退するか、repository root・確認元・必要 fact の提示を求める」と定めている。縮退と提示要求の両方を許しており、どちらを選ぶかは consumer 側の decision として残されている。

提案0 が満たす必要のある条件は次の三つである。

1. 今回の失敗（返らないかもしれないと考えて存在しない blocker を作る）を直接潰すこと
2. 供給側の契約と矛盾しないこと
3. 3 箇所それぞれへ当てたとき、具体動作が一意に決まること

条件1 で案 b が落ちる。案 b は commit section が返らない場合に停止させるため、今回の失敗と同じ形を契約として固定する。

条件3 で案 a が落ちる。案 a を `runtime-execution-contracts.md` へ当てると「test command が返らなければ検証 section を生成しない」となり、検証されていないことが成果物の上で区別できなくなる。生成しない動作は決まるが、それが安全かどうかは箇所によって逆になる。

案 c は、分岐の判断基準を「その fact 無しで成果物が意味を保てるか」という一つの問いへ揃え、各箇所での答えを契約へ書き切る。判断が実行時に残らない。

#### 提案0へのフィードバック

**結果:** 提案0 は読めず、判断できなかった。提案1 として書き直す。

> 正直読めない。返る/返らないが読めない。対象が無いともうほぼ読めないし、あっても「契約が返る」とか。暗黙の指示語が多すぎて読めたものじゃない

提案0 は「返る」「返らない」「契約が返る」という語を、主語と目的語を伴わせずに使った。何が、どの file を読み、何を渡すのかを書いていないため、読み手は指示対象を推測で補うしかない。論点1 の提案0 でも同じ形の読めなさが起きていた。

### イテレーション1: 対象を実物の file と動作で書き直す

#### 提案1

判断する内容は提案0 と同じである。指示語を実物へ置き換えて書き直す。

##### 何が起きているか

`task-design` が tasklist を作るとき、その repository で commit してよいかを知る必要がある。知る手段は一つで、`<repository root>/.agents/skills/tumeda-dev-plugin-context.md` という file である。この file の `## task-design` の下に `Git / GitHub公開条件` という項目があり、remote 名、default branch、PR 作成 script の path が書かれている。`maintenance-plugin-context` がこの file を読み、`task-design` へ内容を渡す。

この項目が書かれていない repository がある。そのとき `task-design` が何をすべきかは、どこにも書かれていない。

`tasklist-design.md:122` の現在の記述は次のとおりである。

> local Git運用条件がrepository contextから返された場合、またはユーザーが明示的にcommitを要求した場合だけcommit sectionを生成する。

書かれていない場合の動作がない。この空白を起点に、assistant は「書かれていないかもしれないので commit task を置けない」と考えて停止した。

##### 決めること

`.agents/skills/tumeda-dev-plugin-context.md` に該当項目が無いとき、どうするか。該当する箇所は三つある。

| # | 直す file | 読みに行く項目 | 無かったとき決めること |
| --- | --- | --- | --- |
| 1 | `plugins/tumeda-dev/skills/task-design/tasklist-design.md:122` | Git 運用条件 | tasklist に commit task を書くか |
| 2 | 同 `:123` | GitHub 公開条件 | tasklist に push / PR task を書くか |
| 3 | `plugins/tumeda-dev/skills/runtime-execution-contracts.md` の `Repository context` 節 | test command、app URL 等 | `tasklist-executor` が検証を実行できないとき何を返すか |

##### 案

- **a. 三つとも「書かない。止まらない」。**
  - 3 は、test command が無いまま検証 task を書かずに tasklist を完成させることになる。検証して通ったのか、検証できなかったのかが成果物から区別できない
- **b. 三つとも「利用者に聞く。聞くまで止まる」。**
  - 1 と 2 は、commit task が無い tasklist でもそのまま使えるのに止まる
- **c. 1 と 2 は「書かない。止まらない」、3 だけ「止まって `blocked` を返す」。**
  - 分岐の問いを「その項目が無くても成果物が意味を保てるか」に揃える

#### 提案背景

提案0 へのフィードバックは、判断内容ではなく提示の読めなさを指していた。したがって案の中身は変えず、指示対象を実物の file 名、項目名、動作へ置き換えた。

提案1 が満たす必要のある条件は次の二つである。

1. 「返る / 返らない」のような、主語と目的語を伴わない語を使わないこと
2. 案ごとに、三つの箇所それぞれで何が起きるかを具体的に読めること

#### 提案1へのフィードバック

**結果:** b を採用。あわせて、聞いた結果を context file へ書き戻す動作が決定へ加わった。

> b。必要なのはそのrepositoryで1回。指定しないと回答が来たら、その旨をcontextに書けばいい。

assistant は案 c を推していたが、その根拠は「1 と 2 で止まるのは無駄である」だった。この根拠は「止まるコストが毎回発生する」という前提に立っていた。実際には、聞くのは repository ごとに一度でよく、回答を `.agents/skills/tumeda-dev-plugin-context.md` へ書けば次回以降は聞かずに済む。前提が誤っていた。

さらに案 b には、案 c に無い利点がある。「commit しない」という利用者の判断が context file に残る。案 c の黙った縮退では、この情報がどこにも残らない。

なお論点1 の提案0 も同じ読めなさを持っており、ユーザーは内容を理解しないまま推奨案を選んでいた。論点1 で決めた修正範囲（三箇所）は、この提案1 の表として読める形で再提示され、その上で b が選択されている。範囲への合意はここで事後的に成立した。

### 決定

`.agents/skills/tumeda-dev-plugin-context.md` に該当項目が無い場合、consumer skill は利用者へ確認する。確認せずに縮退も停止もしない。

利用者の回答は `maintenance-plugin-context` が同 file へ書き戻す。「commit しない」「GitHub へ公開しない」のような否定の回答も、その旨を fact として記載する。同 file には既に `Branch / issue 契約: なし。` `UI確認環境: なし。` という否定の記載があり、先例がある。書き戻すことで、同じ repository で二度目以降の確認が不要になる。

三箇所での具体動作は次のとおりである。

| # | 直す file | 該当項目が無いとき | 回答を書き戻す先 |
| --- | --- | --- | --- |
| 1 | `tasklist-design.md:122` | 利用者へ commit してよいかを確認する。確認するまで commit section の生成可否を決めない | `.agents/skills/tumeda-dev-plugin-context.md` の `## task-design` |
| 2 | 同 `:123` | 利用者へ GitHub へ公開してよいかを確認する。確認するまで push・PR section の生成可否を決めない | 同上 |
| 3 | `runtime-execution-contracts.md` の `Repository context` 節 | 利用者へ test command 等を確認する。確認するまで child 処理を実行しない | 同上 |

owner の境界は既存契約のとおりである。確認するのは consumer skill、context file への書き込みは `maintenance-plugin-context` だけが行う。

---

## 論点3: 指示対象を書かずに読めなくする崩れを、どこへどう記録するか

**ステータス:** 提案中

**種別:** 認識齟齬

### イテレーション0: `documentation_standards/` へ新しい file を作る

#### 提案0

**推奨:** a。既存 file はどれも別の問いを扱っており、この崩れを拾わない。

##### 何が起きたか

この steering の論点1 と論点2 で、assistant が出した提案をユーザーが読めなかった。二回続いた。

論点1 でのユーザーの発言。

> 正直提案内容がよくわからないけど、一旦bで

論点2 でのユーザーの発言。

> 正直読めない。返る/返らないが読めない。対象が無いともうほぼ読めないし、あっても「契約が返る」とか。暗黙の指示語が多すぎて読めたものじゃない

> 何だったら論点1を適当に推奨項目選んだのも読めなかったから。指示語をいい感じに意訳されたら、全然難しいこと言ってなかった。

最後の一文が重要である。**内容は難しくなかった。** 書き方が読めなくしていた。

##### 何が省略されていたか

assistant が書いた原文を三つ挙げる。

> repository context の返却を条件にして成果物を生成・省略する契約は、`maintenance-plugin-context` の返却形式で条件を書く。

「返却」の主語と目的語が無い。誰が何をどこへ返すのかが書かれていない。実体は「`maintenance-plugin-context` skill が `<repository root>/.agents/skills/tumeda-dev-plugin-context.md` という file を読み、その中の該当項目を呼び出し元の skill へ渡す」である。

> 3箇所とも今は「返ってきた場合だけ生成する」としか書いてない。

「3箇所」が何を指すかは直前の表にしかない。表を読み飛ばすと復元できない。

> `runtime-execution-contracts` → 停止。`blocked` を返す

`runtime-execution-contracts` が file 名なのか概念名なのかが書かれていない。`blocked` を誰が誰へ返すのかも無い。

共通する形は一つである。**system 内部の語彙（`repository context`、`返却`、`契約`、`箇所`）を、それが指す実体と結びつけずに使った。** 書き手は実体を知っているので自分では読める。読み手は実体を知らないので読めない。

##### 記録する一般則

> 読み手が指示対象を復元できない語を使わない。抽象名や system 内部語を使うときは、それが指す実体（file path、項目名、動作）を少なくとも一度は併記する。

崩れ方の型は三つある。

1. **動詞の主語と目的語が無い。** 「返る」「解決する」「生成する」を、誰が何をに対して行うのかを書かずに使う
2. **system 内部語を実体と結ばずに使う。** `repository context` と書いて、それが `.agents/skills/tumeda-dev-plugin-context.md` という file であることを書かない
3. **指示語の根拠が直前の文にしかない。** 「その」「対象」「箇所」が、離れた位置から読むと復元できない

判定の問い: **この語が指すものを、この document しか読んでいない人が言えるか。**

##### 一般則を起点以外の case へ当てた結果

- `plugins/tumeda-dev/skills/task-design/tasklist-design.md:122`「local Git運用条件がrepository contextから返された場合」: `repository context` がどの file かを書いていない。**該当する**
- `plugins/tumeda-dev/skills/runtime-execution-contracts.md` の `Repository context` 節「repository固有のapp URL、authentication、test / lint command…はrepository contextから解決する」: 同じ。**該当する**
- `plugins/tumeda-dev/docs/documentation_standards/content_density.md`「読者が下駄を履いた状態」: 比喩だが、直後に「3 つが同時に立っている状態」として具体を置いている。**該当しない**
- `plugins/tumeda-dev/docs/development_standards/naming/core.md`「✗ `spec_over_implementation` — 何の spec か、なぜ implementation との対比なのか、議論を知らないと読めない」: 具体例そのものが実体を示している。**該当しない**

四つ目までで、この基準が「すべての抽象語を禁止する」ではなく「実体と結ばれていない語だけを拾う」として機能することを確認できる。

なお一つ目の `tasklist-design.md:122` は、論点1・論点2 が扱う「条件を満たさなかった場合が書かれていない」と、この論点が扱う「指示対象が書かれていない」の両方を同時に持つ。同じ一行が二つの標準の適用例になる。

##### 置き場所の案

ユーザーの指示により、群は `plugins/tumeda-dev/docs/documentation_standards/` に確定している。決めるのは、新しい file を作るか既存 file へ足すかである。

- **a. `documentation_standards/` へ新しい file を作る。**
  - file 名の候補: `referent_explicitness.md`（指示対象の明示性）。代案は `concrete_referents.md`
  - 同 directory の `README.md` は「各標準は基本 1 ファイル」と定めており、新しい主題は新しい file になる
  - `naming/file.md` の「同階層の存在と足並みを揃える」に従い、表記は snake とする（同 directory の多数派）。「直上ディレクトリのコンテキストを継承する」に従い、file 名へ `documentation` を重複させない
- **b. `expression_notation.md` へ節を足す。**
  - この file は内容を散文・箇条書き・表・図のどれで書き表すかの標準である
  - 今回の崩れは記法の選択ではなく、選んだ記法の中で語が実体と結ばれていないことである。主題が違う
- **c. `content_density.md` へ節を足す。**
  - この file は「書いたものが読者を下駄を履いた状態にする濃さに達しているか」を扱う
  - 今回、内容の濃さは足りていた。ユーザーが意訳したら難しいことは言っていなかった。薄さではなく読めなさである。主題が違う

#### 提案背景

ユーザーから次の指示があった。

> この教訓を plugins/tumeda-dev/docs/documentation_standards に置いておきたいな

`facilitate-discussion` の原因 owner 分類では、認識齟齬の原因が docs の不足に落ちる場合、具体ケースの修正より先に一般則を主 decision として合意する。今回の具体ケースは「論点1・論点2 の提案文」であり、これはすでに提案1 として書き直して解消している。残るのは一般則の記録である。

提案0 が満たす必要のある条件は次の三つである。

1. 既存 file と重複しないこと
2. 一般則が、起点（今回の提案文）以外の具体 case 二つ以上へ当たり、当たらない case も区別できること
3. `documentation_standards/README.md` の「各標準は基本 1 ファイル」という置き方に反しないこと

条件1 について、`documentation_standards/` 配下を `指示語`、`主語`、`目的語`、`省略` で grep した結果、該当する記述は一件だけで、それは在庫確認の例文中の「確認を省略する」であり主題が異なる。既存 file にこの崩れを扱うものは無い。

条件2 は前述の四 case で確認した。

#### 提案0へのフィードバック

**結果:** a を採用。file 名は推奨どおり `referent_explicitness.md` とする。

> a

### イテレーション1: 省略してよい条件を本体へ入れ、指示語の範囲を広げる

#### 提案1

論点3 の置き場所（`documentation_standards/` へ新設、file 名 `referent_explicitness.md`）は提案0 のまま維持する。変えるのは、その file に書く一般則の内容である。

##### 一般則

> 指示対象が読み手にとって自明なら、指示語を使ってよい。同じ理由で主語や目的語を省略してよい。自明でないなら埋める。
>
> 指示語はこそあど言葉に限らない。抽象名や system 内部語も、実体と結ばれていなければ暗黙の指示語として働く。

提案0 の一般則は「読み手が指示対象を復元できない語を使わない」という禁止だけを書いていた。復元できる場合に省略してよいことが書かれていないため、すべての指示語と省略を避ける方向へ読める。実際には、指示対象が近くにあって自明なら指示語で足りるし、主語や目的語も省略してよい。省略は文を短くし、繰り返しによる読みにくさを避ける。

##### 自明でない条件

埋めるべきなのは、次のいずれかに当たるときである。

1. **指示対象がこの document の外にある。** `repository context` と書いて、それが `<repository root>/.agents/skills/tumeda-dev-plugin-context.md` という file であることを書かない場合が当たる
2. **指示対象が離れている。** 「3 箇所」と書き、その 3 箇所が数段落前の表にしかない場合が当たる
3. **指示対象が複数候補に読める。** 「remote と HEAD が同じ」と書き、`remote` が自分の branch の追跡先なのか default branch なのかが決まらない場合が当たる

判定の問いは提案0 から変えない。**この語が指すものを、この document しか読んでいない人が言えるか。**

##### 指示語の範囲

こそあど言葉（この、その、あの、どの）だけを指示語として扱わない。次も暗黙の指示語として働く。

- 抽象名: `対象`、`箇所`、`条件`、`契約`
- system 内部語: `repository context`、`返却`、`解決`
- 主語や目的語を省略した動詞: 「返る」「生成する」「解決する」

これらはこそあど言葉と違い、一見すると具体語に見える。そのぶん、指示対象が書かれていないことに書き手も読み手も気づきにくい。

##### 該当しない例

すべての抽象語を禁じる標準ではないことを、当たらない側で示す。

- `plugins/tumeda-dev/docs/documentation_standards/content_density.md` の「読者が下駄を履いた状態」: 比喩だが、直後に「3 つが同時に立っている状態」として具体を置いている
- `plugins/tumeda-dev/docs/development_standards/naming/core.md` の `spec_over_implementation`: 具体例そのものが実体を示している

#### 提案背景

提案0 の一般則を確定した直後、ユーザーから次の指示があった。

> 指示対象が近くにあるなどで自明な場合には指示語を使っていいし、同様の理由で主語や目的語を省略していいけど、そうでない場合はちゃんと埋める。こそあど言葉以外も暗黙の指示語たりうる

提案1 が満たす必要のある条件は次の二つである。提案0 が満たしていた条件（既存 file と重複しない、起点以外の case 二つ以上へ当たる、`documentation_standards/README.md` の置き方に反しない）は維持する。

1. 省略してよい条件が本体に書かれ、禁止だけの標準として読めないこと
2. 指示語の範囲がこそあど言葉に限られないことが明示されること

条件1 に対して、提案1 は一般則の第一文を許可から始め、「自明でないなら埋める」を後段へ置いた。提案0 は禁止から始めていた。

条件2 に対して、提案1 は「指示語の範囲」を独立した見出しとして置き、こそあど言葉・抽象名・system 内部語・主語省略の四つを並べた。あわせて、こそあど言葉以外は一見具体語に見えるぶん気づきにくいという理由を添えた。理由が無いと、読み手は列挙を覚えることになり、列挙に無い形を見逃す。

#### 提案1へのフィードバック

---

## 論点4: `share-work-in-progress` が空 commit を作る条件

**ステータス:** 提案中

**種別:** TBDヒアリング

### イテレーション0: discussion の決定を正とし、`SKILL.md` と `design.md` の欠落を補う

#### 提案0

**推奨:** a。二つの記述は別々の判断ではなく、後から書かれた側で指示対象が落ちたものである。

##### 二つの記述

`share-work-in-progress` は、今いる branch の内容を依頼者が GitHub 上で読める状態にする skill である。その手順4 が、空 commit を作る条件を定めている。

同じ条件について、記述が二つあり食い違っている。

記述(1) — `plugins/tumeda-dev/skills/share-work-in-progress/SKILL.md` の手順4、および `.steering/2026/202609/20260910-add-publish-branch-diff-skill/design.md:102`

> 未 commit の変更が無く、かつ remote と HEAD が同じで push できる commit も無い場合だけ、空 commit を作る。

記述(2) — `.steering/2026/202609/20260910-add-publish-branch-diff-skill/task-design-discussion.md:67`

> 空 commit を作るのは、commit するものが何も無く、かつ remote の default branch と同一 HEAD で PR を作れない場合だけである。

違いは「remote と HEAD が同じ」の `remote` が何を指すかである。記述(2) は `remote の default branch` と書いている。記述(1) は `remote` とだけ書いており、自分の branch の追跡先を指すのか default branch を指すのかが決まらない。

##### 三つの状況で挙動を比べる

`remote` を「自分の branch の追跡先」と読んだ場合の記述(1) と、記述(2) を比べる。

| 状況 | 記述(1) の動作 | 記述(2) の動作 |
| --- | --- | --- |
| A. 作業 branch に自分の commit があり、push 済みで同期。open PR も既にある。未 commit 変更なし | 空 commit を作る。既存 PR に差分の無い commit が積まれる | 作らない。既存 PR の URL を返して終わる |
| B. default branch から branch を切ったばかりで HEAD が同じ。remote にその branch は無い。未 commit 変更なし | 空 commit を作る | 空 commit を作る |
| C. 作業 branch に自分の commit があり push 済み。PR は未作成。未 commit 変更なし | 空 commit を作る | 作らない。PR を作って URL を返す |

状況 A と C で結論が変わる。記述(1) は、PR を作れる、あるいは既に PR がある状況でも空 commit を作る。

##### どちらが skill の意図と合うか

`SKILL.md` は手順4 の中で空 commit の位置づけを次のように書いている。

> 空 commit は PR を成立させるための最小差分であり、見せるための差分ではない。

状況 A と C では PR が既に成立している、または空 commit なしで成立させられる。この位置づけに従えば、空 commit を作る理由が無い。記述(1) の動作は `SKILL.md` 自身が書いた位置づけと矛盾する。

##### なぜ食い違ったか

同じ steering の中で、`task-design-discussion.md` が決定の原本、`design.md` がその反映先である。記述(2) が先に書かれ、記述(1) はその転記にあたる。転記の際に `remote の default branch` から `default branch` が落ち、`remote` だけが残った。その `SKILL.md` への反映でも同じ形のまま運ばれた。

これは論点3 が扱う崩れ（指示対象が書かれていない）の実例である。`remote` という語が何を指すかが書かれていないため、読み手が別の意味へ復元できてしまった。

##### 案

- **a. 記述(2) を正とし、`SKILL.md` の手順4 と `design.md:102` を書き直す。**
  - 条件を「commit するものが何も無く、かつ remote の default branch と同一 HEAD で PR を作れない場合だけ」とする
  - `remote` が何を指すかを明示する
- **b. 記述(1) を正とし、`task-design-discussion.md:67` の決定を誤りとして扱う。**
  - 状況 A と C で空 commit を作り続ける
  - `SKILL.md` 自身が書いた「PR を成立させるための最小差分」という位置づけと矛盾したまま残る
- **c. 両方と異なる第三の条件を新たに定める。**
  - 現時点で、状況 A・B・C のすべてで記述(2) と違う結論になる条件の候補が無い

#### 提案背景

引き渡し時点では、この事項を「二つの正本が食い違っている。どちらが正しいかは未決」として受け取っていた。調査の結果、二つは対等な二案ではなく、原本と、指示対象が落ちた転記であることが分かった。

提案0 が満たす必要のある条件は次の三つである。

1. 三つの状況すべてで動作が一意に決まること
2. `SKILL.md` が書いている空 commit の位置づけと矛盾しないこと
3. 引き渡し元で実際に起きた条件（状況 A）で、意図しない空 commit が生じないこと

条件2 で案 b が落ちる。条件1 について、案 c は候補が無いため評価できない。

#### 提案0へのフィードバック

**結果:** 提案1 を受諾。あわせて file の構成に指定が加わった。

> 論点3についてはok。今回はアンチパターンの詰め合わせだから、パターンごとにだめな例と、どう直すべきか併記してほしい。前後の文章を取り出して文脈以外で意味が通じうるかが検証対象。

提案1 は型を三つ挙げていたが、型ごとの「だめな例」と「直した形」の対を持っていなかった。またこの標準が持つべき検知手段を書いていなかった。指定された検知手段は「その文を前後から取り出し、文脈以外で意味が通じうるか」である。

### 決定

`plugins/tumeda-dev/docs/documentation_standards/referent_explicitness.md` を新設する。

#### 記録する一般則

> 指示対象が読み手にとって自明なら、指示語を使ってよい。同じ理由で主語や目的語を省略してよい。自明でないなら埋める。
>
> 指示語はこそあど言葉に限らない。抽象名や system 内部語も、実体と結ばれていなければ暗黙の指示語として働く。

#### 埋めるべき条件

1. 指示対象がこの document の外にある
2. 指示対象が離れている
3. 指示対象が複数候補に読める

判定の問い: **この語が指すものを、この document しか読んでいない人が言えるか。**

#### 指示語の範囲

こそあど言葉（この、その、あの、どの）に加えて、次も暗黙の指示語として働く。

- 抽象名: `対象`、`箇所`、`条件`、`契約`
- system 内部語: `repository context`、`返却`、`解決`
- 主語や目的語を省略した動詞: 「返る」「生成する」「解決する」

これらはこそあど言葉と違い、一見すると具体語に見える。そのぶん、指示対象が書かれていないことに書き手も読み手も気づきにくい。

#### 型ごとの、だめな例と直した形

この steering で実際に書かれた文を現物として使う。

**型1: 動詞の主語と目的語が無い**

だめな例（この steering の chat 上で assistant が書いた文）:

> repository context の返却を条件にして成果物を生成・省略する契約は、`maintenance-plugin-context` の返却形式で条件を書く。

切り離して読むと、誰が返却するのか、何を返却するのか、誰が条件を書くのかが、どれも文中に無い。

直した形:

> `maintenance-plugin-context` skill は `<repository root>/.agents/skills/tumeda-dev-plugin-context.md` を読み、該当項目を呼び出し元の skill へ渡す。呼び出し元がその項目の有無で成果物を生成・省略するときは、条件文へ項目が無かった場合の動作も書く。

**型2: system 内部語を実体と結ばずに使う**

だめな例（`plugins/tumeda-dev/skills/task-design/tasklist-design.md:122`）:

> local Git運用条件がrepository contextから返された場合、またはユーザーが明示的にcommitを要求した場合だけcommit sectionを生成する。

切り離して読むと、`repository context` が file なのか、変数なのか、skill の返り値なのかが決まらない。

直した形:

> `<repository root>/.agents/skills/tumeda-dev-plugin-context.md` の `## task-design` に Git 運用条件が書かれている場合、またはユーザーが明示的に commit を要求した場合だけ commit section を生成する。書かれていない場合は利用者へ確認する。

**型3: 指示語の根拠が離れている**

だめな例（この steering の chat 上で assistant が書いた文）:

> 3箇所とも今は「返ってきた場合だけ生成する」としか書いてない。

切り離して読むと、「3 箇所」がどこを指すかは数段落前の表にしか無い。

直した形:

> `tasklist-design.md:122`、同 `:123`、`runtime-execution-contracts.md` の `Repository context` 節の三つは、どれも項目があった場合の動作しか書いていない。

#### 検知手段

**その文を前後から取り出して読む。** 指す先が同じ文の中にも近くの文にも無く、離れた位置の本文にしか無いなら、語を実体へ置き換えるか、実体を併記する。

「取り出して読める」は、その文だけで全文脈が分かることを要求しない。**指示対象が何であるかを言えれば足りる。** 指示対象が近くにあって自明な場合に省略してよい、という許可と矛盾しない。

#### 該当しない例

すべての抽象語を禁じる標準ではないことを、当たらない側で示す。

- `plugins/tumeda-dev/docs/documentation_standards/content_density.md` の「読者が下駄を履いた状態」: 比喩だが、直後に「3 つが同時に立っている状態」として具体を置いている
- `plugins/tumeda-dev/docs/development_standards/naming/core.md` の `spec_over_implementation`: 具体例そのものが実体を示している

#### 索引への追加

`plugins/tumeda-dev/docs/documentation_standards/README.md` の「収録している標準」へ 1 行を追加する。

**結果:** a を採用。

> 論点4はa

### 決定

記述(2) を正とする。空 commit を作るのは、commit するものが何も無く、かつ remote の default branch と同一 HEAD で PR を作れない場合だけである。

書き直す対象は二つある。

| 対象 | 現在 | 直す内容 |
| --- | --- | --- |
| `plugins/tumeda-dev/skills/share-work-in-progress/SKILL.md` の手順4 | 「未 commit の変更が無く、かつ remote と HEAD が同じで push できる commit も無い場合だけ、空 commit を作る」 | `remote` が何を指すかを明示し、`remote の default branch と同一 HEAD で PR を作れない場合` とする |
| `.steering/2026/202609/20260910-add-publish-branch-diff-skill/design.md:102` | 同上 | 同上 |

過去 steering の `design.md` を直すのは、当時の判断を書き換えるためではない。同 steering の `task-design-discussion.md:67` が決定の原本であり、`design.md:102` はその転記にあたる。転記の際に `default branch` が落ちたため、原本へ合わせて欠落を補う。原本である `task-design-discussion.md` は変更しない。

この修正は、論点3 で決めた `referent_explicitness.md` の型2（system 内部語を実体と結ばずに使う）の適用例にあたる。`remote` という語が何を指すかを書かなかったために、読み手が別の意味へ復元できてしまった。

---

## 論点5: 実行環境に command を止められたときの契約を、どこへ書くか

**ステータス:** 提案中

**種別:** TBDヒアリング

### イテレーション0: `runtime-execution-contracts.md` の scope 宣言を広げて追記する

#### 提案0

**推奨:** a。この file は名前の時点で実行時の契約という名前空間を持っており、冒頭の一文だけが child 委譲へ狭めている。

##### 何が起きたか

利用先 repository で、agent が稼働中の外部 resource を変更する command を実行しようとした。agent を動かしている実行環境（harness）の auto mode 分類器が、その command を実行前に止めた。

design の時点では「この変更は agent が適用してよい」と判定済みだった。判定の根拠は、差分が新規 resource の追加だけで、既存 resource への change と destroy が 0 件であることだった。

つまり **task として許可されていることと、実行環境がその command を通すことは別の層である。** agent はこの二つを区別しておらず、止められたときにどうするかを知らなかった。

##### 書く内容

> agent が command を実行してよいと task level で判定したことは、実行環境がその command を通すことを意味しない。実行環境に止められた場合、agent は迂回せず停止し、利用者へ返す。

特定の実行基盤に依存する手順は書かない。利用先 repository で有効な具体手順は、利用先 repository 側へ既に記載済みである。

##### 書く場所の案

- **a. `plugins/tumeda-dev/skills/runtime-execution-contracts.md` の scope 宣言を広げて追記する。**
  - この file の冒頭は現在「tasklist-executorがvisual-inspector / test-runnerへchild処理を委譲する時の、hostに依存しない共通契約。」である。child 委譲へ狭めているのはこの一文だけで、file 名 `runtime-execution-contracts` は実行時の契約という広い名前空間を指している
  - 同 file の `停止理由` に `blocked`（必須入力・外部状態・権限が不足している）が既にあり、実行環境に止められた状態を接続できる
  - 代償として、`plugins/tumeda-dev/skills/README.md:43` の説明文（「tasklist-executor が visual-inspector / test-runner へ child 委譲する時の共通契約」）も直す必要がある
- **b. `plugins/tumeda-dev/skills/tasklist-executor/SKILL.md` の停止・再開節へ書く。**
  - command を実行する頻度が最も高いのは `tasklist-executor` である
  - しかし command を実行するのは `tasklist-executor` だけではない。`steering` は `Blocker resolution` で実行し、`task-design` は技術検証実装（spike）で実行する。ここへ書くと他の skill が拾わない
- **c. `plugins/tumeda-dev/skills/` 直下へ新しい共有 file を作る。**
  - 既存 file の scope 宣言を触らずに済む
  - 契約 1 件のために共有 file が 1 枚増える。`runtime-execution-contracts.md` と名前空間が重なり、どちらを読むかの判断が読み手へ残る

#### 提案背景

引き渡し時点では、書く場所を `runtime-execution-contracts.md` と指定して受け取っていた。調査の結果、この file は冒頭で scope を child 委譲へ宣言しており、そのまま追記すると宣言と内容がずれることが分かった。書く場所自体を論点として立て直す。

提案0 が満たす必要のある条件は次の三つである。

1. command を実行しうるすべての skill が読む位置にあること
2. 追記後、その file の scope 宣言と内容が一致していること
3. 特定の実行基盤に依存する手順を書かないこと

条件1 で案 b が落ちる。`steering` の `Blocker resolution` と `task-design` の技術検証実装も command を実行するため、`tasklist-executor` だけが読む位置では足りない。

条件2 について、案 a は scope 宣言を広げることで満たす。案 c は既存 file を触らずに満たす。両者は、名前空間の重複を許すか、既存 file の宣言を書き換えるかの選択になる。

#### 提案0へのフィードバック
**結果:** a を採用。

> a

### 決定

`plugins/tumeda-dev/skills/runtime-execution-contracts.md` の scope 宣言を広げ、実行環境に command を止められたときの契約を追記する。

書く内容は次のとおり。

> agent が command を実行してよいと task level で判定したことは、実行環境がその command を通すことを意味しない。実行環境に止められた場合、agent は迂回せず停止し、利用者へ返す。

特定の実行基盤に依存する手順は書かない。

あわせて直す箇所が二つある。

| 対象 | 直す内容 |
| --- | --- |
| `plugins/tumeda-dev/skills/runtime-execution-contracts.md` の冒頭 | 現在は「tasklist-executorがvisual-inspector / test-runnerへchild処理を委譲する時の、hostに依存しない共通契約。」。child 委譲に限らない実行時の契約を含む形へ広げる |
| `plugins/tumeda-dev/skills/README.md:43` | 現在は「tasklist-executor が visual-inspector / test-runner へ child 委譲する時の共通契約（状態の正本・single writer・停止理由）」。広げた scope に合わせる |

既存の `停止理由` にある `blocked`（必須入力・外部状態・権限が不足している）へ、実行環境に止められた状態を接続する。

---

## 論点6: どの skill が `development_standards/` の何を読むか、それを skill 本文のどこへ書くか

**ステータス:** 提案中

**種別:** TBDヒアリング

### イテレーション0: `facilitate-discussion` には義務を置かず、`name-work-directory` は `naming/README.md` から群を引く

#### 提案0

**推奨:** 下記の割り当て表のとおり。

##### 前提として確定していること

ユーザーとの合意で、次の二つは確定している。

- `task-design` は `plugins/tumeda-dev/docs/development_standards/` 配下を毎回すべて参照する。今回が命名判断を含む場面かどうかを skill 側で判定しない
- `name-work-directory` は `naming/` を参照する

この論点で決めるのは、残る三つである。

1. `facilitate-discussion` に参照義務を置くか
2. `name-work-directory` が読む範囲を `naming/` のどこまでにするか
3. 各 skill 本文のどこへ参照義務を書くか

##### 1. `facilitate-discussion` に参照義務を置くか

**推奨: 置かない。**

根拠は二つある。

- `facilitate-discussion` は議論の進行形式（論点の採番、提案の保存、feedback の routing、決定の確定）を所有する。提案内容が設計標準に合っているかは consumer が所有する。`facilitate-discussion/SKILL.md` の責務境界は「consumerが所有するもの: 議論の起動条件、議論対象とconsumer固有制約のcontext」と定めており、内容の正しさは consumer 側にある
- `facilitate-discussion` は task-design agent 自身が適用する契約である。`task-design/SKILL.md` は「議論開始後はtask-design agent自身が…`facilitate-discussion`を明示適用する。議論だけを別child agentへ再委譲しない」と定めている。task-design が `development_standards/` を毎回読んでいれば、同じ agent の context に載ったまま議論へ入る

残る穴を記録する。`facilitate-discussion` は `$facilitate-discussion` によるユーザー単独起動も許しており、そのとき consumer は存在しない。この経路で命名判断が起きた場合、`development_standards/` は読まれない。単独起動はユーザーが議論を見ている場面であり、実害は小さいと判断して義務を置かない。

##### 2. `name-work-directory` が読む範囲

**推奨: `plugins/tumeda-dev/docs/development_standards/naming/README.md` を入口として、そこに書かれた引き方に従う。**

`naming/` 配下には四つの file がある。

| file | この skill に効くか |
| --- | --- |
| `README.md` | 効く。「この規則は、名前を付ける対象が何であっても成立するか」という引き方を持つ |
| `core.md` | 効く。対象を問わず成立する原則 |
| `file.md` | 効く。「同階層の存在と足並みを揃える」「直上ディレクトリのコンテキストを継承する」は directory 名にも成立する |
| `method.md` | 効かない。メソッド名に固有 |

`core.md` と `file.md` を名指しする案もあるが、`README.md` を入口にすれば、どの file が該当するかの判断を README 側が持つ。file が増減したときに `name-work-directory` 側を直さずに済む。

##### 3. 各 skill 本文のどこへ書くか

| skill | 書く位置 | 理由 |
| --- | --- | --- |
| `task-design` | PrepareStep 3「設計前調査」の先頭 | 初稿を書く前に設計判断の入力を揃える段階である。ここで読めば、以降のすべての判断に載る |
| `name-work-directory` | 「出力」節、slug の規則の直前 | この skill は短く、slug を決める規則がその節にある。読む対象を規則の直前へ置けば、規則を適用する前に標準へ当たる |

`task-design/SKILL.md` の冒頭には既に「repository固有の設計文書、規約、技術検証環境・commandが必要な時は、`maintenance-plugin-context`へ…渡す」という記述がある。ここへは書かない。`development_standards/` は plugin 内の repository 非依存な標準であり、`maintenance-plugin-context` を経由しないためである。

#### 提案背景

提案0 が満たす必要のある条件は次の三つである。

1. 命名判断が起きうる経路のうち、実害の大きいものが標準へ当たること
2. `development_standards/` 配下の file が増減したときに、skill 本文を直さずに済むこと
3. 参照義務が repository 固有文脈の解決（`maintenance-plugin-context` 経由）と混ざらないこと

条件1 に対して、`task-design`（設計判断全般）と `name-work-directory`（directory 名）の二つで、命名判断が起きる主経路を覆う。`facilitate-discussion` の単独起動経路は覆わないため、穴として記録する。

条件2 に対して、`name-work-directory` は個別 file ではなく `naming/README.md` を入口にする。`task-design` は配下すべてを読むため、file 増減の影響を受けない。ただし file 数が増えて全部参照が成立しなくなる場合の扱いは、この論点では決めない。

条件3 に対して、書く位置を `maintenance-plugin-context` へ委譲する記述から離す。

#### 提案0へのフィードバック
**結果:** 三つとも提案どおり採用。

> ok

### 決定

`development_standards/` を読む義務は次のとおり割り当てる。

| skill | 読む対象 | 書く位置 |
| --- | --- | --- |
| `task-design` | `plugins/tumeda-dev/docs/development_standards/` 配下すべて。今回が該当場面かを skill 側で判定しない | PrepareStep 3「設計前調査」の先頭 |
| `name-work-directory` | `plugins/tumeda-dev/docs/development_standards/naming/README.md` を入口とし、そこの引き方に従う | 「出力」節、slug の規則の直前 |
| `facilitate-discussion` | 義務を置かない | 変更しない |

`facilitate-discussion` に義務を置かない根拠は二つある。この skill は議論の進行形式を所有し、提案内容の正しさは consumer が所有する（`facilitate-discussion/SKILL.md` の責務境界）。また `facilitate-discussion` は task-design agent 自身が適用する契約であり（`task-design/SKILL.md`）、task-design が読んでいれば同じ agent の context に載る。

残る穴を記録する。`facilitate-discussion` は `$facilitate-discussion` によるユーザー単独起動を許しており、その経路では consumer が存在しない。命名判断が起きても `development_standards/` は読まれない。単独起動はユーザーが議論を見ている場面であり、実害が小さいと判断して義務を置かない。

`name-work-directory` が個別 file ではなく `naming/README.md` を入口にするのは、どの file が該当するかの判断を README 側へ持たせるためである。`naming/` 配下の file が増減しても `name-work-directory` 本文を直さずに済む。

`task-design/SKILL.md` 冒頭の `maintenance-plugin-context` へ委譲する記述へは書かない。`development_standards/` は plugin 内の repository 非依存な標準であり、`maintenance-plugin-context` を経由しない。

---

## 論点7: `development_standards/README.md` に何を書くか

**ステータス:** 提案中

**種別:** TBDヒアリング

### イテレーション0: 収録一覧と引き方を置き、全部参照契約の維持規律を添える

#### 提案0

**推奨:** 維持規律は案 a。現在 7 file で全部参照が成立しており、読む量を減らす最適化を先取りする理由が無い。

##### README の構成

`plugins/tumeda-dev/docs/documentation_standards/README.md` と `plugins/tumeda-dev/docs/think_standards/README.md` が持つ形（収録一覧 ＋ 置き方）に揃える。

```text
# 開発標準

（この群が扱うもの）

## 収録している標準
  - naming/ — 名前を付けるあらゆる場面で守る標準
  - entity_modeling/ — エンティティをどう切るか、切った結果をどう名付けるか

## この群の引き方
  - task-design はこの群の配下をすべて読む
  - name-work-directory は naming/README.md を入口にする

## この群の置き方
  （新しい標準をどこへ置くかの判断の問い）

## 維持規律
  （全部参照契約が成立し続けるかの確認）
```

README が skill 名を書くことについて、`think_standards/README.md` が「`think-through` skillからの入口であり」と skill を名指しする先例がある。

##### 維持規律の案

`task-design` がこの群の配下をすべて読む契約は、配下の file 数と分量に依存する。現在は 7 file である（`naming/` に README・core・file・method の 4 つ、`entity_modeling/` に README・core・evacuation の 3 つ）。増えると成立しなくなる。

- **a. 「file を増やすときに、全部参照契約が成立し続けるかを確認する」を規律として書く。**
  - 判断の問い: 「増やした後の file 数と分量で、設計前調査の一段階として読み切れるか」
  - 成立しなくなったら、file を増やす前に参照契約自体を見直す
  - 「読み切れるか」の判定に幅が残る
- **b. 数値上限を置く。**
  - 例: 配下の file が 10 を超えたら参照契約を見直す
  - 判定に幅が無い
  - 数値の根拠が無い。分量は file 数に比例しない
- **c. 全部参照をやめ、群 README だけを必読にして下位 file は引き方で選ぶ形へ変える。**
  - file 数に依存しなくなる
  - 「今回が該当場面か」の判定が README 側へ戻る。ユーザーが「毎回全部参照しようとしてほしい」と指定した意図（判定を skill 側にさせない）から離れる
  - 現在 7 file で全部参照が成立しており、いま変える理由が無い

#### 提案背景

提案0 が満たす必要のある条件は次の三つである。

1. `documentation_standards/README.md` と `think_standards/README.md` が持つ群 README の形から外れないこと
2. `task-design` の全部参照契約が壊れるときに、壊れたことに気づけること
3. いま必要でない最適化を先取りしないこと

条件1 に対して、収録一覧と置き方の二つを持たせ、引き方と維持規律を足す。

条件2 と条件3 が案を分ける。案 c は file 数への依存を先に断つが、そのために合意済みの全部参照契約を変える。現在 7 file で成立しているため、条件3 に反する。案 b は判定に幅が無い代わりに、数値の根拠が無い。

案 a は判定に幅を残すが、確認する機会（file を増やすとき）を規律として固定する。壊れたことに気づけないまま運用が続く状態は避けられる。

#### 提案0へのフィードバック
**結果:** a を採用。

> a

### 決定

`plugins/tumeda-dev/docs/development_standards/README.md` の構成は、`documentation_standards/README.md` と `think_standards/README.md` が持つ群 README の形に揃える。収録している標準、この群の引き方、この群の置き方、維持規律の四つを持たせる。

維持規律は次のとおり書く。

> `task-design` はこの群の配下をすべて読む契約を持つ。この契約は配下の file 数と分量に依存する。file を増やすときは、増やした後も契約が成立するかを確認する。
>
> 判断の問い: 「増やした後の file 数と分量で、設計前調査の一段階として読み切れるか」
>
> 読み切れないなら、file を増やす前に参照契約自体を見直す。

数値上限を置かないのは、分量が file 数に比例しないためである。全部参照をやめて群 README だけを必読にする案は採らない。「今回が該当場面か」の判定が README 側へ戻り、判定を skill 側にさせないという方針から離れる。現在は 7 file で契約が成立している。

---

## 論点8: `escalate-plugin-skill-fix/SKILL.md` の `migration.md` 参照を今回の scope へ含めるか

**ステータス:** 決定

**種別:** TBDヒアリング

<!-- この論点は chat 上で提案と合意が先に成立した。facilitate-discussion の事後記録手順で保存している。提案を保存する前に合意を求めた点は process 逸脱であり、事後記述で正当化しない。 -->

### イテレーション0: 今回の scope へ含める

#### 提案0

`plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md` は「除去すべき固有情報…の規約はこのskillが持たない。正本は`migration.md`である」と書いているが、`migration.md` の path を示していない。実体は `plugins/tumeda-dev/skills/maintenance-plugin-context/maintenance_policies/migration.md` にある。

この steering の引き渡し作業中、assistant は `escalate-plugin-skill-fix/` 直下に `migration.md` があると想定して探し、見つからず、repository 全体を検索し直した。探索が一手余分にかかった。

これは論点3 で決めた `referent_explicitness.md` の型2（system 内部語を実体と結ばずに使う）にあたる。`migration.md` という file 名だけでは、読み手がどこにあるかを言えない。

該当行へ path を添える。

#### 提案背景

引き渡し時点では、この点を MAY（あれば嬉しい）として渡していた。今回の scope へ含めるかは未決だった。

提案0 が満たす必要のある条件は次の二つである。

1. 今回の scope（skill が依拠する参照先と条件を明示する）から外れないこと
2. 他の decision へ依存しないこと

条件1 について、この修正は参照先を明示する変更そのものであり、scope の中心にある。条件2 について、他の七つの decision のいずれにも依存しない。

#### 提案0へのフィードバック

**結果:** 今回の scope へ含める。

> ok

### 決定

`plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md` の「正本は`migration.md`である」という記述へ、`plugins/tumeda-dev/skills/maintenance-plugin-context/maintenance_policies/migration.md` という path を添える。

`design.md` の要件区分では MAY から MUST へ移す。今回必ず行う変更として扱う。

---

## 論点9: 新設した標準を `document-review` が当てられるようにする

**ステータス:** 提案中

**種別:** 認識齟齬

<!-- 提案0 と合意は chat 上で先に成立した。facilitate-discussion の事後記録手順で保存している。提案1 は、提案0 の合意後に判明した事実を扱う。 -->

### イテレーション0: 観点 list へ足し、標準を増やすときの規律を README へ置く

#### 提案0

##### 何が起きているか

`plugins/tumeda-dev/skills/document-review/SKILL.md` は「当てる観点」を明示列挙している。

```text
### 作成時観点
- 内容の濃さ → content_density.md
- 記法 → expression_notation.md
- 命名 → file_naming.md

### 更新時観点
- 内容の濃さ → content_density.md
- 記法 → expression_notation.md

### ケース別観点
今は無し。
```

`documentation_standards/` へ file を足しても、この list に無ければ emit 前ゲートで当たらない。論点3 で新設を決めた `referent_explicitness.md` は、このままでは書かれるが当てられない標準になる。

これは事項4（naming 標準への導線が 0 件）と同じ形である。標準が存在するのに、それを使う skill 側から参照されていない。

##### 三問

1. 根本原因: 標準を増やしても、それを当てる skill 側の list を更新する規律が無い
2. どの層か: `document-review/SKILL.md` を読めば list は分かる。不足しているのは process である
3. どこへ書くか: 具体対応として `document-review/SKILL.md` の観点 list、一般則として `documentation_standards/README.md` の「標準の置き方」

##### 書く内容

`document-review/SKILL.md` の作成時観点と更新時観点の両方へ「指示対象 → `referent_explicitness.md`」を足す。指示対象の明示は新規作成でも更新でも当たるため、記法（`expression_notation.md`）と同じ扱いになる。

`documentation_standards/README.md` の「標準の置き方」へ次を足す。

> 標準を増やしたら、それが emit 前に当てる観点かを判断する。観点なら `document-review` の観点 list へ足す。
>
> 判断の問い: 「この標準は、書かれた文に当てて、満たすか満たさないかを判定できるか」
>
> 何を書くか、どこに置くか、誰に向けて書くかを扱う標準は観点ではない。これらは書く前の取捨選択であり、`document-review` の能力境界の外である。

#### 提案背景

steering の Ready result 後の必須 gate 4-2（discussion を元に再発防止先を review する）で見つかった。

提案0 が満たす必要のある条件は次の二つである。

1. 論点3 で新設する標準が、実際に当てられる状態になること
2. 次に標準を増やす人が、同じ見落としをしないこと

条件1 を具体対応、条件2 を一般則が満たす。

#### 提案0へのフィードバック

**結果:** 両方とも今回の scope へ含める。

> 入れる

### イテレーション1: 判断基準を既存の標準へ当てた結果、既存の漏れが一件出た

#### 提案1

提案0 で決めた判断の問い「この標準は、書かれた文に当てて、満たすか満たさないかを判定できるか」を、`documentation_standards/` の既存 file すべてへ当てた。

| file | 判定 | `document-review` の list |
| --- | --- | --- |
| `content_density.md` | 観点である | ある |
| `expression_notation.md` | 観点である | ある |
| `file_naming.md` | 観点である | ある |
| `modify_description_policy.md` | **観点である** | **無い** |
| `business_specification.md` | 観点でない（何を書くか） | 無い |
| `core_readers.md` | 観点でない（誰に向けて書くか） | 無い |
| `information_structuring/` | 観点でない（どこに置くか） | 無い |
| `case_coverage/` | 観点でない（網羅の作り方） | 無い |
| `stock-and-flow-information.md` | 観点でない（置き場所の上位方針） | 無い |
| `supplier-consumer-relation.md` | 観点でない（知識をどちらへ寄せるか） | 無い |
| `referent_explicitness.md`（新設） | 観点である | 無い（論点9 で足す） |

`modify_description_policy.md` は「すでにある doc を直すときに固有の失敗を扱う標準（議論の経緯や指摘への反論を本文に持ち込まない）」である。書かれた文に当てて、議論の経緯が持ち込まれているかを判定できる。判断基準では観点に当たるが、`document-review` の更新時観点に入っていない。

基準が既存の漏れを検出したことは、基準が機能している証拠である。当たるべきでないもの（`business_specification.md` 以下）は正しく落ちている。

##### 案

- **a. `referent_explicitness.md` だけを足し、`modify_description_policy.md` は今回扱わない。**
  - 今回の scope（4 件 ＋ 読めなさの教訓）に忠実
  - 規律を作った直後に、その規律が検出した漏れを放置することになる
- **b. `modify_description_policy.md` も更新時観点へ足す。**
  - `document-review/SKILL.md` へ 1 行追加する
  - 今回の主題（標準が参照されていない）と同じ形の不備であり、対処も同じ
  - scope が 1 件増える

#### 提案背景

提案0 の一般則を確定した後、`task-design/SKILL.md` Step 4 の「新しい判断基準の検証」に従い、起点以外の具体 case へ基準を当てた。「起点 case で基準を作った直後、同じ case で基準が満たされることを確認して終える」ことを避けるためである。

提案1 が満たす必要のある条件は次の二つである。

1. 基準を既存の標準すべてへ当て、当たるものと当たらないものを区別できること
2. 検出した漏れをどう扱うかを、放置以外の形で決めること

条件1 は上の表で満たしている。条件2 が案 a と案 b を分ける。

#### 提案1へのフィードバック
**結果:** b を採用。

> b

### 決定

新設する標準を `document-review` が当てられる状態にし、同じ見落としが繰り返されない規律を置く。

#### `plugins/tumeda-dev/skills/document-review/SKILL.md` の観点 list

| 系統 | 足す行 |
| --- | --- |
| 作成時観点 | 指示対象 → `referent_explicitness.md` |
| 更新時観点 | 指示対象 → `referent_explicitness.md` |
| 更新時観点 | 既存記述の直し方 → `modify_description_policy.md` |

指示対象の明示は新規作成でも更新でも当たるため、記法（`expression_notation.md`）と同じく両系統へ入る。`modify_description_policy.md` は既存 doc を直すときの標準であり、更新時観点だけへ入る。

`modify_description_policy.md` は今回の起点ではない。提案0 で決めた判断の問いを既存の標準すべてへ当てた結果、観点に当たるのに list へ無いことが判明したものである。規律を作った直後にその規律が検出した漏れを放置しないため、今回の scope へ含める。

#### `plugins/tumeda-dev/docs/documentation_standards/README.md` の「標準の置き方」

次を足す。

> 標準を増やしたら、それが emit 前に当てる観点かを判断する。観点なら `document-review` の観点 list へ足す。
>
> 判断の問い: 「この標準は、書かれた文に当てて、満たすか満たさないかを判定できるか」
>
> 何を書くか、どこに置くか、誰に向けて書くかを扱う標準は観点ではない。これらは書く前の取捨選択であり、`document-review` の能力境界の外である。

この判断の問いを既存の標準へ当てた結果は次のとおりである。観点に当たるのは `content_density.md`、`expression_notation.md`、`file_naming.md`、`modify_description_policy.md`、`referent_explicitness.md` の五つである。`business_specification.md`、`core_readers.md`、`information_structuring/`、`case_coverage/`、`stock-and-flow-information.md`、`supplier-consumer-relation.md` は観点でない。

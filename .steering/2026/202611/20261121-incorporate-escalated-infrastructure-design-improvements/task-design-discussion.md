# 議論記録

## 論点1: 1「参考実装の最新を読み、差分だけを合意する」を取り込むか、どこに置くか

**ステータス:** 反映済み

**種別:** TBDヒアリング

### イテレーション0（論点1）: 参考実装をどこで宣言し、task-design のどの手順で読んで、何を論点にするかを決める

#### 提案0（論点1）

取り込む。置き場は二つにする。

- `plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md`（利用先の context instance の template）の `## task-design` に、H3 `### 参考実装` を足す。利用先は、作業の種類ごとに、参考にする別の repository と、最初に読む場所を宣言する。repository 名は利用先の instance にだけ書き、plugin には書かない。
- `plugins/tumeda-dev/skills/task-design/SKILL.md` の「PrepareStep 3. 設計前調査」の手順 2（類似実装を検索する）の次に、手順を一つ足す。中身は次のとおり。文面は次の論点で決める。
  - context instance の `参考実装` が、今回の作業の種類に当たる repository を宣言していれば、その最新を読む。最初に読む場所から辿り、構成の全体を確かめる。
  - 参考実装と同じ形で足りる部分は、「参考実装に倣う」形として design の初稿へ書き、Step 2 の骨格の合意で一度に合意を取る。個別の論点にしない。
  - 論点にするのは、参考実装との差分だけである。差分とは、この repository で同じ形にできない部分、同じ形にすると目的に合わない部分、利用者が変えたい部分である。
  - 参考実装の詳細を plugin の skill・docs へ写さない。写すと、参考実装が変わるたびに同期が要る。

`maintenance-plugin-context` は直さない。選択的な読み取りは consumer の H2（`## task-design`）を丸ごと返すため、H3 を足せば task-design へ届く。

この論点に含めないもの: 基盤の大枠（中央と app ごとの置き分け、state、plan と apply の role、PR で plan・merge で apply する workflow 等）を、参考実装から固有の情報を抜いて plugin の docs に汎用の形で書くこと。利用者の原文では「良いかも」にとどまり、参考実装を読めば足りる内容を二か所に持つことになる。必要なら別の論点として問う。

#### 検討記録（論点1・イテレーション0）

##### 起点の失敗で、何が欠けていたか

利用先の作業で、Terraform の置き場、state の置き場と排他、GitHub Actions の role の数を、それぞれ一から論点にした。三つとも、利用者の別の repository（参考 A）と同じ形に落ちた。task-design の設計前調査には「類似実装を検索する」があるが、対象はその repository の中だけで、利用者が別の repository に同じ形の基盤を持つことを前提にする手順が無かった。そのため、参考 A は「参考にした一つの例」として読まれ、論点ごとに候補の一つとして比べられた。

置き場の論点では、参考 A の file の一覧を途中で打ち切って読み、構成を読み違えた。これは task-design の Step 4 にある「確認範囲が主張範囲を覆っているか」が扱う失敗で、新しい規則は要らない。ただし参考実装を読む手順では「構成の全体を確かめる」を明示する。参考実装を前提にするなら、読み違いはそのまま design の誤りになるためである。

##### 置き場の比較

| 候補 | 失敗の時点で読まれるか | 範囲に入るか | 評価 |
| --- | --- | --- | --- |
| task-design の PrepareStep 3 に手順を足し、context の template に宣言の H3 を足す | 読まれる。設計前調査は初稿の前に必ず通り、context instance もこの時に読む | 入る。PrepareStep 3 は初稿の前に読むものと読み方を定め、手順 2 は類似実装を読む。template の `## task-design` は task-design が使う repository 固有の fact を宣言する | 推す |
| `docs/development_standards/` に標準を足す | 読まれる（task-design は配下をすべて読む） | 入りにくい。この群は開発の成果物と手順の判断基準で、設計の進め方（何を論点にするか）は task-design が持つ | 採らない |
| context instance だけに書き、plugin は直さない | 読まれない。task-design が `参考実装` という項目を知らなければ、読む契機が無い | — | 採らない |

##### repository 名を plugin に書かない理由

`migration.md` は、他の repository から得た内容は固有の情報を抜き、repository 固有の fact が前提として要るなら context instance から解決すると定める。どの repository を参考にするかは利用者ごとに違う fact であり、instance に置く。

##### 一般則として成り立つか（起点以外の case と、当てはまらないはずの case）

| case | 規則を当てた結果 |
| --- | --- |
| 利用先の instance が「基盤の Terraform と適用経路」に参考 repository を宣言し、新しく基盤を建てる | 当てはまる。参考の最新を読み、同じ形を初稿にして骨格で合意し、差分（review 用の環境を持つか、repository の公開・非公開で出力の扱いが変わる等）だけを論点にする |
| instance が「job の基盤（AWS Batch）」に別の参考 repository を宣言し、非同期の job を足す | 当てはまる。job の基盤の部分だけ、その参考を読む。参考は部分ごとに違ってよい |
| instance が参考を宣言しておらず、新しい機能の domain model を設計する | 当てはまらない。宣言が無いので読まず、従来どおり論点を立てる |
| instance が Terraform の参考を宣言しているが、今回の作業は画面の変更である | 当てはまらない。作業の種類が宣言に当たらないので読まない |

##### skill-update-review（構造案の採用前）

`task-design/SKILL.md` の見出しの全体と PrepareStep 3 の全文、template の `## task-design` の全文を見た。内部指示（`tasklist-design.md`、`roadmap-design.md`）と templates の全文は読んでいない。

- 今回の変更 case: PrepareStep 3 に手順を一つ足し、template に H3 を一つ足す。
- 参考実装を読むことは設計前調査の一部であり、独立した状態や完了条件を持つ工程を足すものではない。参考実装に倣う形を骨格で合意することは、既存の Step 2 の中で行う。

結果は、この変更に関わる切り出し候補は無い。読んだ範囲は上のとおりである。

#### 提案0へのフィードバック（論点1）

**結果:** 置き場の前提の誤りの指摘（認識齟齬）

> は？terraform固有の指示が全タスク設計に入るの？インフラ固有のドキュメントができて、インフラ触る時に、自然とそこが参照されて、その時に参考にするリポジトリを知れるとかじゃないの？
>
> これ前もあったよな。固有のものを汎用のところに無作法に置こうとする失敗。多分最新順でsteeringの会話ログ見てたらここ1ヶ月でやってると思うよ

提案0 は、Terraform で基盤を建てる時の型という、基盤の作業に固有の手順を、すべての設計で通る task-design の設計前調査へ足そうとしていた。利用者の示す形は、基盤に固有の文書を作り、基盤を触る時にそこが自然に参照され、その文書から参考にする repository を知る形である。

同じ形の失敗は、2026-11-01 の steering「既存の file に内容を足す前に、その file の範囲に入るかを確かめる」（`20261101-keep-document-content-within-file-scope`）の起点にあった。基盤の原則を「最も読まれる」という理由で application の層の文書へ足そうとした件で、その結果 `naming/core.md` に「中身を足す前に、名前が約束する範囲に入るかを確かめる」ができた。今回はこの規則を当てたが、次の二点で破った。

- 置き場の比較の最初の列を「失敗の時点で読まれるか」にした。規則は、読まれる頻度で足す先を選ぶことを失敗として挙げ、届けることは入口からの導線で補うと定めている。
- 範囲の照合の前に、中身を「Terraform を建てる時の型」から「作業の種類ごとに参考実装を宣言して読む」へ言い直した。言い直した文で照合したため、task-design の設計前調査の範囲に入るように見えた。元の中身のまま照合すれば、すべての設計で通る手順には入らない。

原因は skill・docs の側にある。既存の規則は読まれる頻度で選ぶ形の失敗を挙げるが、足す先に合わせて中身を言い直す形を挙げていない。そのため、照合をしたという感覚が残ったまま範囲を越えた。`facilitate-discussion` の原因の振り分けに従い、既存の規則への追記を主の decision として先に別の論点で合意し、その後でこの論点の置き場を、利用者が示した形でやり直す。

### イテレーション1（論点1）: 基盤に固有の文書を作り、基盤を扱う時にそこから参考実装を知る形にする

#### 提案1（論点1）

取り込む。置き場は次の二つにする。task-design の設計前調査には足さない。

- `plugins/tumeda-dev/docs/development_standards/infrastructure/` に、新しい標準 `reference_implementation.md`（参考実装に倣って基盤を建てる）を作る。中身は次のとおり。文面は次の論点で決める。
  - 当てはめる範囲: 基盤（cloud の resource、Terraform の定義、それを本番へ届ける workflow）を建てる・変える作業。
  - 利用者が、同じ形の基盤を既に持つ別の repository（参考実装）を持つなら、その最新を読む。最初に読む場所から辿り、構成の全体を確かめる。
  - 参考実装と同じ形で足りる部分は「参考実装に倣う」形として design の初稿へ書き、骨格の合意で一度に合意を取る。個別の論点にするのは、参考実装との差分（この repository で同じ形にできない部分、同じ形にすると目的に合わない部分、利用者が変えたい部分）だけである。
  - 参考実装は、基盤の部分ごとに違ってよい。
  - 参考実装の詳細を plugin の docs・skill へ写さない。参考実装が変わるたびに同期が要るためである。
  - どの repository を参考実装とするかは、利用先の context instance の `### 基盤の参考実装`（下）を見る。
- `plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md`（context instance の template）の `## task-design` に、H3 `### 基盤の参考実装` を足す。利用先は、基盤の部分ごとに、参考にする repository と最初に読む場所を書く。repository 名は利用先の instance にだけ書く。この repository（plugin）の値は「なし」とする。
- `docs/development_standards/README.md` の「infrastructure/」に一行を足し、「維持規律」の file 数と分量を直す。

読み手に届く道筋: task-design は設計前調査で `docs/development_standards/` の配下をすべて読む。基盤を扱う設計では、そこで `reference_implementation.md` を読み、そこから context instance の `### 基盤の参考実装` を引く。基盤を扱わない設計では、文書を読んでも当てはまらないので何もしない。

#### 検討記録（論点1・イテレーション1）

##### 照合に使う中身

論点2 の判断の問いに従い、元の中身のまま照合する。元の中身は「Terraform で基盤と適用経路を建てる時の型（参考実装の最新を読み、差分だけを合意する）」であり、基盤の作業に固有である。

##### `infrastructure/` の範囲に入るかの照合

- 名前: `infrastructure`（基盤）。基盤を建てる時の進め方は入る。
- 入口の説明: README の「基盤（cloud の resource とその構成、開発と本番の環境の分け方）の作り方の判断基準」。参考実装に倣って建てることは、基盤の作り方の判断基準に入る。
- 既に入っている中身: `log_retention.md`、`change_verification.md`、`database_separation.md` は、基盤を作る・変える時の判断基準である。今回の文書も、基盤を建てる時に何を論点にするかの判断基準になる。

##### template の `### 基盤の参考実装` が範囲に入るか

template の `## task-design` は、task-design が使う repository 固有の fact を宣言する。既にある `### UI確認環境` も、画面を扱う作業でだけ使う fact である。`### 基盤の参考実装` も、基盤を扱う作業でだけ使う fact であり、同じ範囲に入る。fact の欄であり、手順ではない。手順は `reference_implementation.md` が持つ。

repository 名を plugin に書かないのは `migration.md` による。参考実装をどこに宣言するかの候補として、利用先の基盤の文書も考えたが、初めて基盤を建てる repository にはその文書がまだ無い。context instance は基盤を建てる前からあり、`maintenance-plugin-context` が保つ。

##### 一般則として成り立つか（起点以外の case と、当てはまらないはずの case）

| case | 当てた結果 |
| --- | --- |
| 新しい repository で、参考実装と同じ形の基盤を初めて建てる | 当てはまる。参考実装を読み、同じ形を骨格で合意し、差分（review 用の環境を持つか、repository の公開・非公開で plan の出力の扱いが変わる等）だけを論点にする |
| 既に基盤のある repository に、非同期の job の resource を足す。job の基盤だけ別の参考実装がある | 当てはまる。job の部分だけ、その参考実装を読む |
| 参考実装が宣言されていない repository で基盤を建てる | 文書は読まれるが、参考実装が無いので、従来どおり論点を立てる |
| 画面の変更や domain model の設計 | 当てはまらない。基盤の作業ではないので、文書を読んでも何もしない |

#### 提案1へのフィードバック（論点1）

**結果:** 合意

> ok

### 決定（論点1）

1 を取り込む。task-design の設計前調査には足さず、基盤に固有の文書に置く。

- `plugins/tumeda-dev/docs/development_standards/infrastructure/reference_implementation.md`（参考実装に倣って基盤を建てる）を新しく作る。当てはめる範囲は、基盤（cloud の resource、Terraform の定義、それを本番へ届ける workflow）を建てる・変える作業。利用者が同じ形の基盤を別の repository（参考実装）に持つなら、その最新を、最初に読む場所から辿って構成の全体を確かめて読む。同じ形で足りる部分は個別の論点にせず骨格の合意で一度に合意を取り、design の完成後の姿には参考実装への参照ではなく実際に作るものを具体的に書き（決定（論点3）で具体化）、個別の論点にするのは差分（同じ形にできない部分、同じ形だと目的に合わない部分、利用者が変えたい部分）だけにする。参考実装は基盤の部分ごとに違ってよい。参考実装の詳細は plugin の docs・skill へ写さない。どの repository を参考実装とするかは、利用先の context instance の `### 基盤の参考実装` を見る。
- `plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md` の `## task-design` に H3 `### 基盤の参考実装` を足す。利用先は、基盤の部分ごとに参考にする repository と最初に読む場所を書く。この repository の値は「なし」とする。
- `docs/development_standards/README.md` の「infrastructure/」に一行を足し、「維持規律」の file 数と分量を直す。

文面は別の論点で決める。

選択理由: 元の中身は基盤の作業に固有であり、すべての設計で通る task-design の手順には入らない。`infrastructure/` は名前・入口の説明（基盤の作り方の判断基準）・既にある中身のどれにも入る。task-design は設計前調査で `docs/development_standards/` をすべて読むため、基盤の作業ではこの文書に自然に届き、そこから context instance の宣言を引く。repository 名は `migration.md` により plugin に書かず、基盤を建てる前からある context instance に置く。template の `## task-design` は、`### UI確認環境` と同じく特定の作業でだけ使う repository 固有の fact を持つ場所で、手順は持たせない。

## 論点2: 足す先に合わせて中身を言い直してから範囲を照合する失敗を、既存の規則に足す

**ステータス:** 反映済み

**種別:** 認識齟齬

### イテレーション0（論点2）: 論点1 の失敗の形を、`naming/core.md` の範囲の照合の規則へ失敗例として足す

#### 提案0（論点2）

`plugins/tumeda-dev/docs/development_standards/naming/core.md` の「中身を足す前に、名前が約束する範囲に入るかを確かめる」で、既存の「やってしまいがちな失敗」（読まれる頻度で足す先を選ぶ）の段落と「届けたい人に届くかは、…入口からの導線で補う。」の後に、次の段落を足す。

```diff
 届けたい人に届くかは、足す先の選び方ではなく、入口からの導線で補う。
+
+やってしまいがちな失敗: 照合の前に、足したい先の範囲に入るよう、中身を実際より一般的な言葉で言い直す。言い直した文で照合するため、範囲に入ったように見える。例えば、基盤を Terraform で建てる時に、同じ形を持つ別の repository を読んで差分だけを決める、という基盤の作業に固有の手順を、「作業の種類ごとに参考にする repository を宣言して読む」と言い直し、すべての設計で通る設計前調査の手順へ足そうとした。元の中身のまま照合すれば、基盤を扱う文書の範囲であり、すべての設計の手順には入らない。
+
+判断の問い: **「照合しているのは、元の依頼や具体例が指す中身か。足す先に合わせて言い直した中身か」**
```

`scripts/verification/validate-plugin.mjs` に、足した判断の問いを検査する `requireText` を足す。

#### 検討記録（論点2・イテレーション0）

##### 既存の規則で足りなかった点

`naming/core.md` の範囲の照合の規則は、範囲を名前・入口の説明・既にある中身から読み、足す中身と照合する。失敗例は「読まれる頻度や呼ばれる頻度で、足す先を選ぶ」の一つである。今回は照合をしたが、照合の相手の「足す中身」を、足す先に合わせて広く言い直していた。規則は、何を照合の相手にするかを問わないため、この形を止められなかった。

##### 置き場

同じ規則の失敗例として足す。新しい規則ではなく、既存の規則を当てる時の失敗の形であり、2026-11-15 の steering（既存の原則に失敗例を足す）と同じ扱いになる。この節は、名前の付いたものへ中身を足す前の照合を定めるため、範囲に入る。

##### 一般則として成り立つか（起点以外の case と、当てはまらないはずの case）

| case | 問いを当てた結果 |
| --- | --- |
| 画面の部品に固有の命名の決まりを、「UI の要素の名前の付け方」と言い直して命名の core へ足そうとする | 当てはまる。元の中身（ある画面の部品の決まり）のまま照合すれば、core（対象を問わない原則）の範囲に入らない |
| ある app の DB の index の方針を、「性能の方針」と言い直して全体の構成の原則の文書へ足そうとする | 当てはまる。元の中身は一つの app の DB に固有で、全体の原則には入らない |
| すでに一般的な中身（どの文書にも当てはまる書き方の規則）を、文書の標準へ足す | 当てはまらない。言い直していないので、問いは働かない |

#### 提案0へのフィードバック（論点2）

**結果:** 合意

> ok

### 決定（論点2）

`plugins/tumeda-dev/docs/development_standards/naming/core.md` の「中身を足す前に、名前が約束する範囲に入るかを確かめる」で、「届けたい人に届くかは、足す先の選び方ではなく、入口からの導線で補う。」の後に、提案0（論点2）の diff の二段落（照合の前に足す先に合わせて中身を一般的な言葉で言い直す失敗と、その例、判断の問い「照合しているのは、元の依頼や具体例が指す中身か。足す先に合わせて言い直した中身か」）をそのまま足す。`scripts/verification/validate-plugin.mjs` に、判断の問いを検査する `requireText` を足す。

選択理由: 既存の規則は読まれる頻度で足す先を選ぶ失敗を挙げるが、照合の相手にする中身を足す先に合わせて言い直す形を挙げていない。今回はこの形で、照合をした感覚が残ったまま範囲を越えた。新しい規則ではなく既存の規則を当てる時の失敗の形なので、同じ節の失敗例として足す。

### 現在の変更（論点2）

- 反映: 決定（論点2）のとおり、`naming/core.md` に二段落、`validate-plugin.mjs` に一行を足した（2026-11-21）。合意した diff と同じ文である。
- 検証: `validate-plugin.mjs` は `plugin validation passed`、`test-task-design-handoff.mjs` は `task-design handoff tests passed`、`inspect-discussion.test.mjs` は 27 件中 26 件 pass、失敗 0、skip 1。足した `requireText` について、検査する文の途中へ一文字足すと `validate-plugin.mjs` が落ちることを確かめ、元に戻した。
- document-review（更新時観点）: 指摘なし。足した段落は、失敗の形、起きる理由、例、元の中身で照合した時の結論、判断の問いを持つ（濃さ）。節の既存の失敗例と同じ「やってしまいがちな失敗:」「判断の問い:」の形にした（記法）。「言い直した文」「元の中身」は同じ段落の中で指すものが決まる（指示対象）。Terraform、repository は普段の意味のまま使う語（普段の言葉）。既存の段落は変えず、後に足した（既存記述の直し方）。利用先と参考実装の repository の固有の情報は無い（機密性）。暫定の判断は含まない（暫定性）。
- skill-update-review: 対象外。docs の標準を変え、skill の `SKILL.md`・内部指示を変えていない。
- doc-enricher（この decision の review、提案 mode）: 候補なし。決定した知識は規則として `naming/core.md` に書いた。
- `development_standards/README.md` の「維持規律」の分量（約 75KB）は、この追記で約 76KB になる。この作業で基盤の文書を足す時に、まとめて実際の値へ直す。

## 論点3: 1 の新しい標準 `reference_implementation.md`、template の H3、README の文面

**ステータス:** 反映済み

**種別:** TBDヒアリング

### イテレーション0（論点3）: 決定（論点1）の中身を、同じ群の文書と同じ形の文にする

#### 提案0（論点3）

`plugins/tumeda-dev/docs/development_standards/infrastructure/reference_implementation.md` を、次の内容で新しく作る。

````markdown
# 参考実装に倣って基盤を建てる

基盤（cloud の resource、Terraform の定義、それを本番へ届ける workflow）を建てる・変える時に、利用者が別の repository に持つ同じ形の基盤（参考実装）をどう使うかの判断基準。

## 参考実装の最新を読み、差分だけを論点にする

利用者が同じ形の基盤を別の repository に既に持つなら、その最新を読み、同じ形を最初の案にする。

- 最初に読む場所から辿り、構成の全体を確かめる。file の一覧や文書を途中で打ち切って読まない。
- 参考実装と同じ形で足りる部分は、「参考実装に倣う」形として design の初稿へ書き、骨格の合意で一度に合意を取る。部分ごとに論点を立てない。
- 論点にするのは、参考実装との差分だけである。差分は、この repository で同じ形にできない部分、同じ形にすると目的に合わない部分、利用者が変えたい部分である。
- 参考実装は、基盤の部分ごとに違ってよい。例えば、app ごとの resource と app をまたぐ resource の置き分けは一つの repository に、job の基盤は別の repository に倣う。

理由:

- 同じ利用者の基盤は、どの repository でもほぼ同じ形に落ちる。一から論点を立てると、候補を比べて結局同じ形を選ぶ往復だけが増える。
- 参考実装は、細部（role の権限、workflow の手順、運用の文書）まで動いている実物である。最新を読めば、細部まで含めて倣える。

どの repository を参考実装とするかは、利用先の context instance の `## task-design` にある `### 基盤の参考実装` に書く。宣言が無ければ、参考実装は無いものとして、従来どおり論点を立てる。

判断の問い: **「この論点は、参考実装との差分か。参考実装と同じ形で足りる部分を、改めて論点にしていないか」**

## 参考実装の細部を plugin へ写さない

参考実装の細部（directory の構成、role の権限、workflow の手順）は、plugin の docs・skill へ写さず、参考実装の最新を正とする。写すと、参考実装が変わるたびに同期が要り、古い写しが正として読まれる。

## やってしまいがちな失敗

- 参考実装を候補の一つとして扱い、置き場、state、role を一つずつ論点にする。
    - Terraform の置き場、state の置き場と排他、GitHub Actions の role の数を順に論点にし、三つとも参考実装と同じ形に落ちた。
- 参考実装の file の一覧を、絞り込んだ出力の先頭だけで読み、構成を読み違える。
    - app ごとの resource を app の下に、app をまたぐ resource を中央の directory に置く構成を、app の下の directory だけだと読み、利用者に訂正された。
````

`plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md` の `## task-design` の最後（`### 作業の外へ残るactionの差し込み` の後）に、次の H3 を足す。

```markdown
### 基盤の参考実装

<!-- 基盤（cloud の resource、Terraform の定義、それを本番へ届ける workflow）を建てる・変える時に倣う、
     同じ形の基盤を持つ別の repository を書く。基盤の部分ごとに、参考にする repository と最初に読む場所を書く。
     読み方と、何を論点にするかは `docs/development_standards/infrastructure/reference_implementation.md` が持つ。
     参考にする repository が無ければ「なし」と書く -->

- なし。このrepositoryは基盤を持たない。
```

`plugins/tumeda-dev/docs/development_standards/README.md` を次のとおり変える。

```diff
   - [database_separation.md](./infrastructure/database_separation.md) — 開発の DB を本番と分けるか。…
+  - [reference_implementation.md](./infrastructure/reference_implementation.md) — 基盤を建てる・変える時に、利用者が別の repository に持つ同じ形の基盤（参考実装）をどう使うか。最新を読んで同じ形を最初の案にし、差分だけを論点にする。
```

```diff
-現在は 17 file・約 75KB である（… `infrastructure/` に log_retention・change_verification・database_separation、この README）。
+現在は 18 file・約 79KB である（… `infrastructure/` に log_retention・change_verification・database_separation・reference_implementation、この README）。
```

`scripts/verification/validate-plugin.mjs` に、次の四行を足す。

```js
requireText(docPath("development_standards/infrastructure/reference_implementation.md"), "論点にするのは、参考実装との差分だけである。");
requireText(docPath("development_standards/infrastructure/reference_implementation.md"), "参考実装の細部（directory の構成、role の権限、workflow の手順）は、plugin の docs・skill へ写さず、参考実装の最新を正とする。");
requireText(docPath("development_standards/README.md"), "[reference_implementation.md](./infrastructure/reference_implementation.md)");
requireText(skillPath("tumeda-dev-plugin-context.md"), "### 基盤の参考実装");
```

#### 検討記録（論点3・イテレーション0）

##### 文書の組み立て

- 同じ群の `database_separation.md` と同じ形にした。冒頭に何の判断基準かを一文で書き、決まりを見出しにし、本文・理由・判断の問いを置き、最後に「やってしまいがちな失敗」を置く。
- 決まりは二つに分けた。「参考実装の最新を読み、差分だけを論点にする」と「参考実装の細部を plugin へ写さない」である。前者は設計の進め方、後者は plugin の保守の決まりで、読む人と場面が違う。
- 参考実装を宣言する場所（context instance の `### 基盤の参考実装`）を本文に書き、宣言が無い時の扱いも一文で書いた。
- 例は固有の名前を使わず、構成の形（app ごとと app をまたぐ resource の置き分け、job の基盤）で書いた。
- 失敗の形は元の依頼内容の具体例の二つを、固有の名前を使わずに書いた。

##### template の H3

既存の H3 と同じく、HTML comment に何を書くかと正本の文書を書き、この repository の値を一行書く。手順は書かず、正本の文書へ委ねる。

##### README

新しい file の一行は、既存の行と同じく、何を扱うかと結論を書いた。「維持規律」は、論点2 で `naming/core.md` に足した分（約 1KB）も含めた見込みで、反映した後に実際の値で確かめる。

##### validate-plugin.mjs の assertion

二つの決まりの本体、README からの導線、template の H3 を検査する。理由・例・失敗の形は、書き換えても決まりの意味が変わらないため検査しない。

#### 提案0へのフィードバック（論点3）

**結果:** 一部を直す

> まぁ良いけど、ここのリポジトリ適用時は、design.mdの完成の姿には、参考実装に倣うと参照わたしするよりは、その時点のフロー情報だから、実際に作るものは細かく書いて欲しいかな

提案0 の文は、同じ形で足りる部分を「参考実装に倣う」形として design の初稿へ書く、としていた。利用者の入力は、参考実装はその時点の情報（後で変わる）なので、利用先の design.md の完成後の姿には、参照を渡すのではなく実際に作るものを細かく書く、というものである。論点を立てずに骨格で一度に合意を取ること、差分だけを論点にすること、他の文面への指摘は無い。同じ問い（文面）への局所修正として、次の回で扱う。

### イテレーション1（論点3）: 同じ形の部分も、design の完成後の姿には作るものを具体的に書く

#### 提案1（論点3）

提案0 の `reference_implementation.md` のうち、「参考実装と同じ形で足りる部分は…」の箇条を次の二つに置き換える。他の文面、template の H3、README、`validate-plugin.mjs` は提案0 のままとする。

```diff
-- 参考実装と同じ形で足りる部分は、「参考実装に倣う」形として design の初稿へ書き、骨格の合意で一度に合意を取る。部分ごとに論点を立てない。
+- 参考実装と同じ形で足りる部分は、部分ごとに論点を立てず、骨格の合意で一度に合意を取る。
+- ただし design の完成後の姿には、参考実装への参照ではなく、実際に作るもの（directory の構成、resource と権限、workflow の手順等）を具体的に書く。参考実装は読んだ時点の情報で、後で変わるため、参照だけでは作るものが design から読めなくなる。どの参考実装をいつ読んだかは、design の付録の「前提とする既存仕様」に書く。
```

あわせて、「参考実装の細部を plugin へ写さない」の段落の末尾に、次の一文を足す。

```diff
 参考実装の細部（directory の構成、role の権限、workflow の手順）は、plugin の docs・skill へ写さず、参考実装の最新を正とする。写すと、参考実装が変わるたびに同期が要り、古い写しが正として読まれる。
+細部を書き起こす先は、その基盤を作る利用先の design である（上の「参考実装の最新を読み、差分だけを論点にする」）。
```

決定（論点1）の中身の「同じ形で足りる部分は「参考実装に倣う」形として design の初稿へ書き」は、この回の決定に合わせて同期する。

#### 検討記録（論点3・イテレーション1）

##### 利用者の入力から一意に決まるもの

- 同じ形で足りる部分も、design の完成後の姿には実際に作るものを細かく書く。理由は、参考実装がその時点の情報で、後で変わるため（原文「その時点のフロー情報だから」）。
- 論点を立てずに骨格で一度に合意を取ること、差分だけを論点にすることは、提案0 のまま（原文「まぁ良いけど」）。

##### assistant が補ったもの

- 「どの参考実装をいつ読んだかを、design の付録の「前提とする既存仕様」に書く」: 利用者の原文には無い。参考実装が後で変わった時に、design がどの時点の形に倣ったかを辿れるようにするため。task-design の template の付録「前提とする既存仕様」は、確認した既存仕様の要点と確認元を書く場所であり、範囲に入る。
- 「細部を書き起こす先は、その基盤を作る利用先の design である」: 「plugin へ写さない」と「design には細かく書く」が食い違って読まれないよう、写す先と写さない先を並べた。

##### validate-plugin.mjs の assertion

提案0 の検査（「論点にするのは、参考実装との差分だけである。」等）はそのまま残る。足した箇条は、書き換えると決まりの意味が変わるため、次を足す。

```js
requireText(docPath("development_standards/infrastructure/reference_implementation.md"), "ただし design の完成後の姿には、参考実装への参照ではなく、実際に作るもの（directory の構成、resource と権限、workflow の手順等）を具体的に書く。");
```

#### 提案1へのフィードバック（論点3）

**結果:** 合意

> ok

### 決定（論点3）

`plugins/tumeda-dev/docs/development_standards/infrastructure/reference_implementation.md` を、提案0（論点3）の内容に、提案1（論点3）の置き換え（同じ形で足りる部分は論点を立てず骨格で一度に合意を取ること、ただし design の完成後の姿には参考実装への参照ではなく実際に作るものを具体的に書き、どの参考実装をいつ読んだかを付録「前提とする既存仕様」に書くこと）と、「参考実装の細部を plugin へ写さない」の段落の末尾の一文（細部を書き起こす先は利用先の design）を当てた形で新しく作る。`plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md` の `## task-design` の最後に、提案0（論点3）の H3 `### 基盤の参考実装` を足す。`docs/development_standards/README.md` の「infrastructure/」に一行を足し、「維持規律」を直す。`scripts/verification/validate-plugin.mjs` に、二つの決まりの本体と、足した箇条、README からの導線、template の H3 を検査する五行を足す。

選択理由: 同じ群の `database_separation.md` と同じ形にし、設計の進め方の決まりと plugin の保守の決まりを分けた。参考実装は読んだ時点の情報で後で変わるため、利用先の design には参照ではなく作るものを具体的に書く（利用者の入力）。どの時点の形に倣ったかを辿れるよう、読んだ参考実装と日付を付録に残す（assistant が補い、合意で確定）。plugin へ写さないことと design に書き起こすことが食い違って読まれないよう、写す先を並べて書いた。

### 現在の変更（論点3）

- 反映: 決定（論点3）のとおり、`reference_implementation.md` を新しく作り、template に H3 を、README に一行を足して「維持規律」を直し、`validate-plugin.mjs` に五行を足した（2026-11-21）。合意した文と同じである。
- 分量: 反映した後の `docs/development_standards/` の配下は 18 file・79,650 byte。提案0 の見込み（約 79KB）ではなく、実際の値から「約 80KB」と書いた。
- 検証: `validate-plugin.mjs` は `plugin validation passed`、`test-task-design-handoff.mjs` は `task-design handoff tests passed`、`inspect-discussion.test.mjs` は 27 件中 26 件 pass、失敗 0、skip 1。足した五つの `requireText` について、検査する文の途中へ一文字足すと五つとも `validate-plugin.mjs` が落ちることを確かめ、元に戻した。
- document-review（新しい file は作成時観点、README と template は更新時観点）: 指摘なし。新しい file は、当てはめる範囲、決まり、理由、宣言の場所と宣言が無い時の扱い、判断の問い、失敗の形を持つ（濃さ）。同じ群の `database_separation.md` と同じ見出しと並びにした（記法）。file 名は同じ directory の他の file と同じ snake_case で、directory の文脈（基盤）を受けて何の判断かを表す（命名）。「参考実装」は冒頭の一文で定義し、「骨格の合意」は task-design の手順の語のまま使った（指示対象）。Terraform、resource、workflow、repository は普段の意味のまま使う語（普段の言葉）。README と template は既存の行を変えずに足し、README の分量を実際の値に合わせた（既存記述の直し方）。利用先と参考実装の repository の固有の情報は無い（機密性）。暫定の判断は含まない（暫定性）。
- skill-update-review: 対象外。docs の標準と context instance の template を変え、skill の手順（`SKILL.md`・内部指示）を変えていない。
- doc-enricher（論点1・3 の decision の review、提案 mode）: 候補なし。決定した知識は標準として `reference_implementation.md` に書いた。

## 論点4: 2「review 環境の要点」を取り込むか、要点として何を持ち、どこに置くか

**ステータス:** 反映済み

**種別:** TBDヒアリング

### イテレーション0（論点4）: 参考実装の review 環境から、変わりにくい大枠だけを取り出して要点にする

#### 提案0（論点4）

取り込む。`plugins/tumeda-dev/docs/development_standards/infrastructure/` に新しい標準 `review_environment.md`（review 環境）を作り、`docs/development_standards/README.md` の「infrastructure/」に一行を足して「維持規律」を直す。

要点として、次の五つを持つ。文面は次の論点で決める。

1. 基盤を持つ repository は、review 環境（本番へ入れる前の変更を、開発機の外の実物で確かめる環境）を作ることを既定にする。作らない時は、理由を design に書く。
2. review 環境は、本番と同じ定義（module）を環境の名前だけ変えて呼び、resource と state を本番と分けて持つ。review への適用が本番の resource を対象にせず、逆も同じにするためである。
3. 止めている状態を既定にし、使う時だけ起動する。
   - 定義は止めている状態を正とし、起動は一時的な逸脱として扱う（apply すると止まる側へ倒れる）。
   - 起動は、決まった時間の後に止まる予約と一緒に行う。止め忘れは通知で知らせる。
   - 存在するだけで時間ごとに課金される resource（load balancer、managed の DB、NAT gateway 等）を構成に入れない。
4. review 環境に何が載っているかは保証しない。確かめる人が、開く前に自分の確認の対象を載せる。確かめた後の後始末（元に戻す等）は運用に入れない。
5. 「review 環境に閉じる操作」を定義する。本番、開発の DB、本番の state、secret のどれにも影響しない操作だけを、AI agent が操作ごとの事前確認なしに行ってよい。閉じるかは、対象の resource と state で決め、`review` という名前が付いているかでは決めない。destroy を含む apply は閉じる操作に含めない。

細部（起動・停止の手順、到達の経路、build の確かめ方、DB の向き先等）は、`reference_implementation.md` に従い、参考実装の最新を読む。plugin へ写さない。

#### 検討記録（論点4・イテレーション0）

##### 参考実装の review 環境（2026-11-21 に、参考 A の review 環境の文書と基盤の README で確かめた）

- 目的: main へ入れる前の変更を、開発機以外の端末（スマートフォンの実機等）から、画面の操作と API の呼び出しで確かめる。ローカルの compose には届かない端末から確かめるために作った。
- 本番と review は同じ module を stage 違いで呼び、resource と state を環境ごとに分ける。
- backend の container は、定義上 `desired_count = 0` を持ち、apply すると止まる。起動の script は、起動・到達の経路の切り替え・30 分後の自動停止の予約を行い、予約に失敗したら起動を取り消す。止め忘れは 45 分で alarm が通知する（alarm は止めない）。
- 停止中にも課金される resource を三つ（image の保存、log の保存、alarm 一つ）に限り、存在するだけで時間課金される resource（ALB、RDS、NAT Gateway、Elastic IP）を構成に含めない。
- `review` branch は共有の置き場で、何が載っているかを保証しない。確かめる人が force push してから開き、後始末は運用に含めない。後始末を運用に入れると、守られなかった時に「前の人の後始末漏れ」という状態が生まれるためである。
- 「review 環境に閉じる操作」を、本番の backend とその host、開発の DB の schema とデータ、本番の state とその resource、`.env` と SSM の値のどれにも影響しない操作と定義する。AI agent は事前確認なしに行ってよい。destroy（replace を含む）を含む apply は、失敗しても再実行で回復できるという前提を崩すため止める。閉じるかは対象の resource と state で決まり、名前で決まらない。
- review 環境は開発の DB を共用している。

##### 何を要点に取り出したか

`reference_implementation.md`（論点1・3）の決まりに従い、参考実装の細部は写さず、変わりにくい大枠だけを取り出した。取り出したかの判断は、「別の構成（別の cloud の service、別の app の形）の repository でも、同じ決まりとして成り立つか」で行った。

| 参考実装の形 | 要点にするか | 理由 |
| --- | --- | --- |
| どの repository でも review 環境を作る | 1 に入れる | 利用者の原文「どうせ全てでreview環境作る」 |
| 同じ module を stage 違いで呼び、resource と state を分ける | 2 に入れる | 構成によらず成り立つ |
| 停止を既定、自動停止の予約、止め忘れの通知、時間課金の resource を入れない | 3 に入れる | 構成によらず成り立つ。数値（30 分、45 分）は細部として入れない |
| 何が載っているかを保証しない、後始末をしない | 4 に入れる | 置き場が branch でなくても成り立つ |
| review に閉じる操作の定義と destroy の扱い | 5 に入れる | AI agent との線引きとして、構成によらず成り立つ |
| `desired_count`、API Gateway の向け先の切り替え、CodePipeline、Amplify の review app | 入れない | 構成（ECS、API Gateway 等）に依存する細部 |
| 開発の DB を共用する | 入れない | DB を分けるかは `database_separation.md` の判断で、repository ごとに違う |

##### 1 の「作らない時は理由を書く」は assistant が補った

利用者の原文は「どうせ全てでreview環境作る」で、例外には触れていない。基盤を持たない repository や、本番の前に cloud で確かめるものが無い repository まで作る必要は無いため、既定にして例外の時は理由を書く形にした。

##### 置き場

`infrastructure/` の README の入口の説明は「基盤（cloud の resource とその構成、開発と本番の環境の分け方）の作り方の判断基準」である。review 環境は本番と分けて持つ基盤の環境であり、環境の分け方の判断基準に入る。入口の説明の「開発と本番の環境の分け方」を「環境の分け方」へ広げるかは、文面の論点で扱う。

##### 一般則として成り立つか（起点以外の case と、当てはまらないはずの case）

| case | 当てた結果 |
| --- | --- |
| frontend だけの app を Amplify で持つ repository | 当てはまる。review の app を本番と同じ定義で別に持ち、何が載っているかは確かめる人が載せる。止める対象の server が無いので 3 は当てはまる resource が無い |
| job の基盤（AWS Batch）を持つ repository | 当てはまる。review の job は本番と同じ定義を別の名前で持ち、使う時だけ投入する |
| 基盤を持たない repository（plugin のような文書だけの repository） | 当てはまらない。基盤が無いので review 環境も無い |

#### 提案0へのフィードバック（論点4）

**結果:** 合意

> ok

### 決定（論点4）

2 を取り込む。`plugins/tumeda-dev/docs/development_standards/infrastructure/review_environment.md`（review 環境）を新しく作り、`docs/development_standards/README.md` の「infrastructure/」に一行を足して「維持規律」を直す。要点として次の五つを持つ。

1. 基盤を持つ repository は、review 環境（本番へ入れる前の変更を、開発機の外の実物で確かめる環境）を作ることを既定にし、作らない時は理由を design に書く。
2. 本番と同じ定義（module）を環境の名前だけ変えて呼び、resource と state を本番と分けて持つ。
3. 止めている状態を既定にし、使う時だけ起動する。定義は止めている状態を正とし（apply すると止まる側へ倒れる）、起動は決まった時間の後に止まる予約と一緒に行い、止め忘れは通知で知らせ、存在するだけで時間ごとに課金される resource を構成に入れない。
4. 何が載っているかは保証しない。確かめる人が開く前に自分の確認の対象を載せ、後始末は運用に入れない。
5. 「review 環境に閉じる操作」（本番、開発の DB、本番の state、secret のどれにも影響しない操作）を定義し、AI agent はそれを操作ごとの事前確認なしに行ってよい。閉じるかは対象の resource と state で決め、名前では決めない。destroy を含む apply は閉じる操作に含めない。

細部（起動・停止の手順、到達の経路、build の確かめ方、DB の向き先等）は `reference_implementation.md` に従い参考実装の最新を読み、plugin へ写さない。文面は別の論点で決める。

選択理由: 参考実装の review 環境から、別の構成の repository でも同じ決まりとして成り立つ大枠だけを取り出した。構成に依存する細部（container の数の扱い、到達の経路の切り替え、build の pipeline）と、repository ごとに違う判断（DB を共用するか）は入れない。1 の「作らない時は理由を書く」は、基盤を持たない repository を除くため assistant が補い、合意で確定した。review 環境は本番と分けて持つ基盤の環境であり、`infrastructure/` の環境の分け方の判断基準に入る。

## 論点5: 2 の新しい標準 `review_environment.md` と README の文面

**ステータス:** 反映済み

**種別:** TBDヒアリング

### イテレーション0（論点5）: 決定（論点4）の五つの要点を、同じ群の文書と同じ形の文にする

#### 提案0（論点5）

`plugins/tumeda-dev/docs/development_standards/infrastructure/review_environment.md` を、次の内容で新しく作る。

````markdown
# review 環境

本番へ入れる前の変更を、開発機の外の実物で確かめる環境（review 環境）を、どう持つかの判断基準。

## 基盤を持つ repository は、review 環境を作る

基盤を持つ repository は、review 環境を作ることを既定にする。作らない時は、その理由を design に書く。

ローカルの環境では、cloud の service の上での動きや、開発機以外の端末（スマートフォンの実機等）からの操作を確かめられない。本番へ入れてから確かめると、確かめている間も本番が変わった状態になる。

## 本番と同じ定義を、環境の名前だけ変えて呼ぶ

review 環境は、本番と同じ定義（Terraform の module）を、環境の名前（stage）だけ変えて呼ぶ。resource と state は本番と分けて持つ。

- 同じ定義を呼ぶのは、review で確かめた構成と本番の構成をずらさないためである。
- state を分けるのは、review への適用が本番の resource を対象にせず、逆も同じにするためである。

## 止めている状態を既定にし、使う時だけ起動する

- 定義は止めている状態を正とし、起動は一時的な逸脱として扱う。起動中に apply すると、止まる側へ倒れる。
- 起動は、決まった時間の後に止まる予約と一緒に行う。予約できなければ起動しない。
- 止め忘れは通知で知らせる。
- 存在するだけで時間ごとに課金される resource（load balancer、managed の DB、NAT gateway 等）を構成に入れない。

review 環境を使う時間は短く、間が空く。起動したままにすると、使わない時間の費用が、使う時間の費用を大きく上回る。

判断の問い: **「この resource は、止めている間も時間ごとに課金されるか。起動したまま忘れた時に、誰がいつ気づくか」**

## 何が載っているかは保証しない

review 環境に何が載っているかは保証しない。確かめる人は、開く前に自分の確認の対象を載せる。確かめた後の後始末（元の状態へ戻す等）は運用に入れない。

後始末を運用に入れると、それが守られなかった時に「前の人の後始末漏れ」という状態が生まれる。確かめる人が毎回自分で載せる前提にすれば、その状態自体が無くなる。

## review 環境に閉じる操作を定義する

本番、開発の DB、本番の state、secret のどれにも影響しない操作を、review 環境に閉じる操作と定義する。AI agent は、閉じる操作を、操作ごとの事前確認なしに行ってよい。失敗しても止めて再実行すれば回復し、影響が review 環境の外へ出ないためである。

- 閉じるかは、対象の resource と state で決める。`review` という名前が付いているかでは決めない。例えば、review 環境のための変更でも、本番の state への apply は閉じない。
- destroy（作り直しを含む）を含む apply は、閉じる操作に含めない。消したものは apply し直しても戻らないことがあり、再実行で回復するという前提が崩れるためである。
- 何が閉じる操作に当たるかの一覧は、その repository の review 環境の文書に書く。

## 細部は参考実装を読む

起動・停止の手順、到達の経路、build の確かめ方、DB の向き先等の細部は、[`reference_implementation.md`](./reference_implementation.md) に従い、参考実装の最新を読む。

## やってしまいがちな失敗

- 基盤の design で、上位の design が本番とローカルの環境だけを持つことを理由に、review 環境を作らないと決める。
    - 上位の design に review 環境が無いことは、作らない理由にならない。作らないなら、作らない理由を design に書く。
````

`plugins/tumeda-dev/docs/development_standards/README.md` を次のとおり変える。

```diff
-- **infrastructure/** — 基盤（cloud の resource とその構成、開発と本番の環境の分け方）の作り方の判断基準。
+- **infrastructure/** — 基盤（cloud の resource とその構成、環境の分け方）の作り方の判断基準。
```

```diff
   - [reference_implementation.md](./infrastructure/reference_implementation.md) — …
+  - [review_environment.md](./infrastructure/review_environment.md) — 本番へ入れる前の変更を、開発機の外の実物で確かめる review 環境をどう持つか。作ることを既定にし、止めている状態を既定にして使う時だけ起動する。
```

```diff
-現在は 18 file・約 80KB である（… `infrastructure/` に log_retention・change_verification・database_separation・reference_implementation、この README）。
+現在は 19 file・約 84KB である（… `infrastructure/` に log_retention・change_verification・database_separation・reference_implementation・review_environment、この README）。
```

`scripts/verification/validate-plugin.mjs` に、次を足す。

```js
const reviewEnvironmentStandard = docPath("development_standards/infrastructure/review_environment.md");
for (const expected of [
  "基盤を持つ repository は、review 環境を作ることを既定にする。作らない時は、その理由を design に書く。",
  "review 環境は、本番と同じ定義（Terraform の module）を、環境の名前（stage）だけ変えて呼ぶ。resource と state は本番と分けて持つ。",
  "定義は止めている状態を正とし、起動は一時的な逸脱として扱う。",
  "review 環境に何が載っているかは保証しない。",
  "閉じるかは、対象の resource と state で決める。",
  "destroy（作り直しを含む）を含む apply は、閉じる操作に含めない。",
]) requireText(reviewEnvironmentStandard, expected);
requireText(docPath("development_standards/README.md"), "[review_environment.md](./infrastructure/review_environment.md)");
```

#### 検討記録（論点5・イテレーション0）

##### 文書の組み立て

- 同じ群の `database_separation.md`・`reference_implementation.md` と同じ形にした。冒頭に何の判断基準かを一文で書き、五つの要点を見出しにし、各見出しに決まりと理由を置き、最後に細部の読み方と「やってしまいがちな失敗」を置く。
- 3 には判断の問いを置いた。resource を足す時に、時間課金と止め忘れの気づき方を問うためである。
- 5 の「何が閉じる操作に当たるかの一覧は、その repository の review 環境の文書に書く」は、一覧が構成ごとに違う細部であり、plugin には置かないことを示すために足した。
- 失敗の形は、元の依頼内容の 2 の具体例（上位の design が本番とローカルだけを持つため、review 環境を作らないと決めた）を、固有の名前を使わずに書いた。

##### README

- 「infrastructure/」の入口の説明を「開発と本番の環境の分け方」から「環境の分け方」へ広げた。review 環境は開発でも本番でもない環境であり、元の説明のままでは入らないためである（`naming/core.md` の範囲の照合で、入口の説明だけが狭く、名前 `infrastructure` と既にある中身には入る）。
- 「維持規律」の分量は見込みで、反映した後に実際の値で確かめる。

##### validate-plugin.mjs の assertion

五つの要点の本体と、閉じる操作の決まり二つ、README からの導線を検査する。理由・例・失敗の形は、書き換えても決まりの意味が変わらないため検査しない。検査する文が多いため、既存の検査と同じく `for` で並べる。

#### 提案0へのフィードバック（論点5）

**結果:** 合意

> ok。あと、[参考 repository B]か[参考 repository A]にあるお金の判断の話も別論点としてかいておきたいかな。xのapiを使え方じゃなくてインフラコストの方。applyしてから止めるのもその思想のhow。ゼロコスト志向ではないが個人開発で無尽蔵にお金は使えない。だからログ記録で月数円掛かろうと必要だったら問題ない。ただ、100円とかを安易に許容すると10個で1000円でランニングコストにそれがかかり続けるのは負担、みたいな話があった気がする

前半が提案0（論点5）への合意である。後半は、基盤の費用の判断を別の論点として足す依頼で、別の論点で扱う。

### 決定（論点5）

`plugins/tumeda-dev/docs/development_standards/infrastructure/review_environment.md` を提案0（論点5）の内容で新しく作る。`docs/development_standards/README.md` は、「infrastructure/」の入口の説明を「基盤（cloud の resource とその構成、環境の分け方）の作り方の判断基準。」へ広げ、`review_environment.md` の一行を足し、「維持規律」を直す。`scripts/verification/validate-plugin.mjs` に、決まりの本体の六つの文と README からの導線の検査を足す。

選択理由: 同じ群の文書と同じ形にし、五つの要点を見出しにして各見出しに決まりと理由を置いた。閉じる操作の一覧は構成ごとに違う細部のため、各 repository の文書に書くとした。review 環境は開発でも本番でもない環境で、入口の説明の「開発と本番の環境の分け方」には入らないため「環境の分け方」へ広げた。

### 現在の変更（論点5）

- 反映: 決定（論点5）のとおり、`review_environment.md` を新しく作り、README の入口の説明と索引と「維持規律」を直し、`validate-plugin.mjs` に七つの検査を足した（2026-11-21）。合意した文と同じである。
- 分量: 反映した後の `docs/development_standards/` の配下は 19 file・84,003 byte で、README に書いた「約 84KB」と合う。
- 検証: `validate-plugin.mjs` は `plugin validation passed`、`test-task-design-handoff.mjs` は `task-design handoff tests passed`、`inspect-discussion.test.mjs` は 27 件中 26 件 pass、失敗 0、skip 1。足した七つの検査について、検査する文の途中へ一文字足すと七つとも落ちることを確かめ、元に戻した（初回は一文字を検査する文の先頭の外へ入れてしまい三つしか落ちなかったため、文の途中へ入れ直して確かめた）。
- document-review（新しい file は作成時観点、README は更新時観点）: 指摘なし。新しい file は、五つの要点ごとに決まりと理由、判断の問い、細部の読み方、失敗の形を持つ（濃さ）。同じ群の文書と同じ形にした（記法）。file 名は同じ directory の他の file と同じ snake_case（命名）。「review 環境」は冒頭の一文で定義した（指示対象）。load balancer、NAT gateway、module、stage、state は普段の意味のまま使う語（普段の言葉）。README は入口の説明を広げ、既存の行を変えずに一行を足した（既存記述の直し方）。固有の情報は無い（機密性）。暫定の判断は含まない（暫定性）。
- skill-update-review: 対象外。docs の標準だけを変えた。
- doc-enricher（論点4・5 の decision の review、提案 mode）: 候補なし。決定した知識は標準として `review_environment.md` に書いた。

## 論点6: 3「基盤の費用の判断」を取り込むか、何を持ち、どこに置くか

**ステータス:** 反映済み

**種別:** TBDヒアリング

### イテレーション0（論点6）: 利用者の費用の考え方を軸に、参考実装の判断の手順から変わりにくい部分を取り出す

#### 提案0（論点6）

取り込む。`plugins/tumeda-dev/docs/development_standards/infrastructure/` に新しい標準 `cost_judgment.md`（基盤の費用の判断）を作り、`docs/development_standards/README.md` の「infrastructure/」に一行を足して「維持規律」を直す。あわせて、論点5 で作った `review_environment.md` の「止めている状態を既定にし、使う時だけ起動する」の理由の段落に、この文書への参照を一文足す（止めて使う形は、この費用の考え方を実現する手段の一つであるため）。

`cost_judgment.md` に持つ中身は次のとおり。文面は次の論点で決める。

1. 費用の考え方: ゼロの費用を目指さないが、個人の開発であり、無尽蔵には使わない。
   - 必要なものは、月に数円かかっても入れてよい（例: ログの保存）。
   - 月に 100 円程度の継続的な費用を、一件ずつ「この程度なら」と許さない。一件は小さくても、継続的な費用は積み上がる。10 件で月 1,000 円が払い続けられる。
   - そのため、継続的な費用は一件の額ではなく、積み上がった額で考える。
2. 課金の型を分けて考える。
   - 時間で課金されるもの（存在するだけで積み上がる。止める手段が無いか、止めても課金が続く）: 構成に入れるかどうかが、そのまま費用の判断になる。
   - 保存の量・件数で課金されるもの（量に比例し、設定で抑えられる）: 入れるかではなく、どれだけ持つかの判断になることが多い。
3. 入れるかを金額で決める時の手順。
   - その resource が防ぐ損失を、金額と期間で見積もる。使う頻度が低いほど、問題に気づくのが遅れて損失が大きくなる。
   - 同じ目的の手段を複数出し、額を比べる。額が桁で違うことがある。最初に思いついた手段で決めない。
   - 防ぐための継続的な費用と、防ぐ損失を並べて比べる。
4. 要件に費用の上限を書く時は、resource の種類ではなく金額で書く。種類で書くと、損失を防ぐ少額の resource まで機械的に退ける。
5. 使う時だけ起動する形（`review_environment.md` の止めている状態を既定にする形）は、この考え方を実現する手段の一つである。

サービスごとの料金と性質（どの service がいくらか、どの metric が無料か等）は、細部として持たない。料金は変わり、参考実装の最新か、その時の公式の料金表を読む（`reference_implementation.md`）。

#### 検討記録（論点6・イテレーション0）

##### 中身の出所

- 1 の考え方: 利用者の原文による（「ゼロコスト志向ではないが個人開発で無尽蔵にお金は使えない」「ログ記録で月数円掛かろうと必要だったら問題ない」「100円とかを安易に許容すると10個で1000円でランニングコストにそれがかかり続けるのは負担」）。「継続的な費用は一件の額ではなく、積み上がった額で考える」は、原文の 10 個で 1000 円の話を決まりの形にしたもので、assistant が書いた。
- 2〜4: 参考実装の費用の判断の文書（2026-11-21 に読んだ）から、構成によらず成り立つ部分を取り出した。参考実装は、課金の型（時間課金と、保存・件数課金）、判断の手順（防ぐ損失を見積もる、手段を複数出す、損益分岐で比べる）、要件の上限を種類ではなく金額で書くこと、を持つ。
- 5: 利用者の原文による（「applyしてから止めるのもその思想のhow」）。

##### 入れないもの

参考実装の「サービス別の要点」（ECS・CloudWatch・ECR・API Gateway・Secrets Manager の料金と性質）と、手順の例の金額（Fargate の止め忘れの時間あたりの額、alarm の額等）は入れない。料金と service の性質は変わり、構成ごとに違う細部であるためである。`reference_implementation.md` の「細部を plugin へ写さない」と同じ扱いにする。

##### 置き場

`infrastructure/` の入口の説明は「基盤（cloud の resource とその構成、環境の分け方）の作り方の判断基準」である。resource を構成に入れるかを費用で決めることは、基盤の作り方の判断基準に入る。名前は参考実装と同じ `cost_judgment.md` にした。同じ directory の他の file と同じ snake_case で、何の判断かを表す。

既にある `log_retention.md` は「個人で使う規模の application では…保存の費用は決め手にならない」と書く。ログは必要で、費用が月に数円の例に当たり、この文書の考え方と食い違わない。

##### 一般則として成り立つか（起点以外の case と、当てはまらないはずの case）

| case | 当てた結果 |
| --- | --- |
| 止め忘れの検知の alarm（月に十数円）を足す | 防ぐ損失（止め忘れが数日続いた時の費用）と比べて入れる。継続的な費用の積み上げにも小さい |
| 閲覧 app の前に load balancer（月に数千円の時間課金）を置く | 時間課金の型。積み上げに大きく効くため、時間課金の無い手段（使った分だけ課金される HTTPS の終端等）を先に探す |
| secret を一件あたり月額のかかる service に置く | 一件は小さいが、件数で積み上がる。無料の置き場で足りるなら、そちらを選ぶ |
| 一度だけかかる費用（domain の取得等） | 継続的な費用ではないので、積み上げの考え方は当てはまらない。必要かどうかで決める |

#### 提案0へのフィードバック（論点6）

**結果:** 合意

> ok

### 決定（論点6）

3 を取り込む。`plugins/tumeda-dev/docs/development_standards/infrastructure/cost_judgment.md`（基盤の費用の判断）を新しく作り、`docs/development_standards/README.md` の「infrastructure/」に一行を足して「維持規律」を直す。`review_environment.md` の「止めている状態を既定にし、使う時だけ起動する」の理由の段落に、この文書への参照を一文足す。

中身は次の五つ。(1) ゼロの費用を目指さないが、個人の開発で無尽蔵には使わない。必要なものは月に数円かかっても入れてよく、月に 100 円程度の継続的な費用を一件ずつ許さない（10 件で月 1,000 円が続く）。継続的な費用は一件の額ではなく積み上がった額で考える。(2) 時間で課金されるものと、保存の量・件数で課金されるものを分けて考える。(3) 入れるかを金額で決める時は、防ぐ損失を金額と期間で見積もり、同じ目的の手段を複数出して額を比べ、継続的な費用と防ぐ損失を並べて比べる。(4) 要件の費用の上限は、resource の種類ではなく金額で書く。(5) 使う時だけ起動する形は、この考え方を実現する手段の一つである。サービスごとの料金と性質は持たず、参考実装の最新かその時の公式の料金表を読む。文面は別の論点で決める。

選択理由: 1 と 5 は利用者の原文による。「継続的な費用は積み上がった額で考える」は、原文の 10 個で 1000 円の話を決まりの形にしたもので、assistant が書き、合意で確定した。2〜4 は参考実装の費用の判断の文書から、構成によらず成り立つ部分を取り出した。料金と service の性質は変わる細部であり、`reference_implementation.md` と同じく写さない。resource を構成に入れるかを費用で決めることは、`infrastructure/` の基盤の作り方の判断基準に入る。

## 論点7: 3 の新しい標準 `cost_judgment.md`、`review_environment.md` への参照、README の文面

**ステータス:** 反映済み

**種別:** TBDヒアリング

### イテレーション0（論点7）: 決定（論点6）の五つの中身を、同じ群の文書と同じ形の文にする

#### 提案0（論点7）

`plugins/tumeda-dev/docs/development_standards/infrastructure/cost_judgment.md` を、次の内容で新しく作る。

````markdown
# 基盤の費用の判断

基盤の resource を構成に入れるかを、費用を根拠に決めるための判断基準。既に決まった構成を安くする作業（size の見直し等）は扱わない。

## ゼロを目指さないが、継続的な費用は積み上がった額で考える

ゼロの費用を目指さない。ただし個人の開発であり、無尽蔵には使わない。

- 必要なものは、月に数円かかっても入れてよい。例えば、ログの保存（[`log_retention.md`](./log_retention.md)）。
- 月に 100 円程度の継続的な費用を、一件ずつ「この程度なら」と許さない。一件は小さくても、継続的な費用は積み上がる。10 件で、月 1,000 円を払い続けることになる。

継続的な費用は、一件の額ではなく、積み上がった額で考える。一度だけかかる費用には、この積み上げの考え方は当てはまらない。必要かどうかで決める。

判断の問い: **「この継続的な費用は、必要なものか。同じ程度の費用を、他の resource でも同じ理由で許していないか」**

## 課金の型を分けて考える

課金の起き方が違うものを、同じ基準で扱わない。

- 時間で課金されるもの: 存在するだけで積み上がる。止める手段が無いか、止めても課金が続く。構成に入れた時点で月額が決まるため、入れるかどうかが、そのまま費用の判断になる。
- 保存の量・件数で課金されるもの: 量に比例し、量を抑える設定がある。入れるかではなく、どれだけ持つかの判断になることが多い。

## 入れるかを金額で決める手順

1. その resource が防ぐ損失を、金額と期間で見積もる。「なんとなく危ない」で止めない。使う頻度が低い環境ほど、問題に気づくのが遅れ、損失が大きくなる。
2. 同じ目的の手段を複数出し、額を比べる。額が桁で違うことがある。最初に思いついた手段で決めない。
3. 防ぐための継続的な費用と、防ぐ損失を並べて比べる。

金額で比べられない損害（データを失う等）を含む時は、この手順とは別に判断する。

## 要件の上限は、resource の種類ではなく金額で書く

要件に費用の上限を書く時は、「時間で課金される resource を入れない」のように種類で書かず、「止めている間の費用を月 N 円以内にする」のように金額で書く。種類で書くと、損失を防ぐ少額の resource（止め忘れの通知等）まで機械的に退ける。

## 使う時だけ起動する

止めている状態を既定にし、使う時だけ起動する形（[`review_environment.md`](./review_environment.md)）は、この考え方を実現する手段の一つである。使わない時間の費用を払わずに済む。

## サービスごとの料金は写さない

どの service がいくらか、どの metric が無料か等の料金と性質は、この文書に持たない。料金は変わり、構成ごとに違うためである。参考実装の最新か、その時の公式の料金表を読む（[`reference_implementation.md`](./reference_implementation.md)）。

## やってしまいがちな失敗

- 一件ずつ「月 100 円程度なら」と許し、継続的な費用を積み上げる。
- 要件の「時間で課金される resource を入れない」という文言だけを根拠に、止め忘れを知らせる月十数円の通知まで退ける。防ぎたいのは無駄な継続的な費用で、損失を防ぐ少額の resource ではない。
- 同じ目的の手段の額を比べず、最初に思いついた手段で決める。代わりになる無料の観測があることが多い。
````

`plugins/tumeda-dev/docs/development_standards/infrastructure/review_environment.md` の「止めている状態を既定にし、使う時だけ起動する」の理由の段落の末尾に、一文足す。

```diff
 review 環境を使う時間は短く、間が空く。起動したままにすると、使わない時間の費用が、使う時間の費用を大きく上回る。
+費用の考え方は [`cost_judgment.md`](./cost_judgment.md) が持つ。
```

`plugins/tumeda-dev/docs/development_standards/README.md` を次のとおり変える。

```diff
   - [review_environment.md](./infrastructure/review_environment.md) — …
+  - [cost_judgment.md](./infrastructure/cost_judgment.md) — 基盤の resource を構成に入れるかを費用で決める。ゼロは目指さないが、継続的な費用は一件の額ではなく積み上がった額で考える。
```

```diff
-現在は 19 file・約 84KB である（… `infrastructure/` に log_retention・change_verification・database_separation・reference_implementation・review_environment、この README）。
+現在は 20 file・約 88KB である（… `infrastructure/` に log_retention・change_verification・database_separation・reference_implementation・review_environment・cost_judgment、この README）。
```

`scripts/verification/validate-plugin.mjs` に、次を足す。

```js
const costJudgmentStandard = docPath("development_standards/infrastructure/cost_judgment.md");
for (const expected of [
  "継続的な費用は、一件の額ではなく、積み上がった額で考える。",
  "月に 100 円程度の継続的な費用を、一件ずつ「この程度なら」と許さない。",
  "要件に費用の上限を書く時は、「時間で課金される resource を入れない」のように種類で書かず、「止めている間の費用を月 N 円以内にする」のように金額で書く。",
]) requireText(costJudgmentStandard, expected);
requireText(docPath("development_standards/README.md"), "[cost_judgment.md](./infrastructure/cost_judgment.md)");
requireText(reviewEnvironmentStandard, "費用の考え方は [`cost_judgment.md`](./cost_judgment.md) が持つ。");
```

#### 検討記録（論点7・イテレーション0）

##### 文書の組み立て

- 同じ群の文書と同じ形にした。冒頭に何の判断基準かと扱わないものを書き、中身を見出しにし、判断の問いと「やってしまいがちな失敗」を置く。
- 冒頭の「既に決まった構成を安くする作業は扱わない」は、参考実装の費用の判断の文書の対象外の書き方に倣った。入れるかを決める判断と、入れた後に安くする作業は、問いが違う。
- 一度だけかかる費用を積み上げの考え方から外す一文を足した。論点6 の検討記録で当てはまらないはずの case として確かめたもので、書かないと domain の取得等まで月額の積み上げで考える読み方を招く。
- 手順の後に「金額で比べられない損害は別に判断する」を置いた。参考実装の文書も同じ但し書きを持つ。
- 「ログの保存」の例から `log_retention.md` へ、「使う時だけ起動する」から `review_environment.md` へ、料金を写さない理由から `reference_implementation.md` へ link した。
- 失敗の形の三つ目（手段の額を比べない）は、参考実装の文書の失敗例から、固有の service 名を抜いて書いた。

##### validate-plugin.mjs の assertion

考え方の本体（積み上がった額で考える、月 100 円程度を一件ずつ許さない）、上限を金額で書く決まり、README からの導線、`review_environment.md` からの参照を検査する。手順・課金の型・例は、書き換えても決まりの意味が変わらないため検査しない。

#### 提案0へのフィードバック（論点7）

**結果:** 合意

> ok

### 決定（論点7）

`plugins/tumeda-dev/docs/development_standards/infrastructure/cost_judgment.md` を提案0（論点7）の内容で新しく作る。`review_environment.md` の「止めている状態を既定にし、使う時だけ起動する」の理由の段落の末尾に「費用の考え方は [`cost_judgment.md`](./cost_judgment.md) が持つ。」を足す。README の「infrastructure/」に一行を足し、「維持規律」を直す。`scripts/verification/validate-plugin.mjs` に、考え方の本体二つ、上限を金額で書く決まり、README からの導線、`review_environment.md` からの参照を検査する五つの検査を足す。

選択理由: 同じ群の文書と同じ形にした。一度だけの費用を積み上げの考え方から外す一文と、金額で比べられない損害を別に判断する但し書きを置き、当てはまらない case まで規則が働かないようにした。関係する文書（ログの保存期間、review 環境、参考実装）へ link した。

### 現在の変更（論点7）

- 反映: 決定（論点7）のとおり、`cost_judgment.md` を新しく作り、`review_environment.md` に一文、README に一行を足して「維持規律」を直し、`validate-plugin.mjs` に五つの検査を足した（2026-11-21）。合意した文と同じである。
- 分量: 反映した後の `docs/development_standards/` の配下は 20 file・88,254 byte で、README に書いた「約 88KB」と合う。
- 検証: `validate-plugin.mjs` は `plugin validation passed`、`test-task-design-handoff.mjs` は `task-design handoff tests passed`、`inspect-discussion.test.mjs` は 27 件中 26 件 pass、失敗 0、skip 1。足した五つの検査について、検査する文の途中へ一文字足すと五つとも落ちることを確かめ、元に戻した。
- document-review（新しい file は作成時観点、`review_environment.md` と README は更新時観点）: 指摘なし。新しい file は、考え方と判断の問い、課金の型、手順と但し書き、上限の書き方、手段との関係、写さないもの、失敗の形を持つ（濃さ）。同じ群の文書と同じ形にした（記法）。file 名は参考実装と同じ `cost_judgment` で、同じ directory の他の file と同じ snake_case（命名）。「継続的な費用」は一度だけかかる費用と対比して指すものを決めた（指示対象）。resource、metric、size は普段の意味のまま使う語（普段の言葉）。既存の文書は既存の文を変えず、後に足した（既存記述の直し方）。固有の情報は無い（機密性）。暫定の判断は含まない（暫定性）。
- skill-update-review: 対象外。docs の標準だけを変えた。
- doc-enricher（論点6・7 の decision の review、提案 mode）: 候補なし。決定した知識は標準として `cost_judgment.md` に書いた。

### codeの責務配置と依存構造

<!--
layer、component、module、class、directory、公開入口、依存の向き、全体の呼び出し関係を
変える時に使う。単なるfile移動、同じ責務の中のprivateなrefactoring、algorithmの詳細化では選ばない。

設計とは、細かな処理を組み合わせて全体を構成すること。
責務を示す名前、配置、公開入口を上から追い、処理の流れと責務の境目を、code内部を全て読み直さずに
理解できる状態を先に作る。

なぜ必要か:
- 責務が太り、影響範囲を毎回code全体から調べ直す状態を防ぐため。
- directoryやmoduleの名前だけがあり、何を置いてよいか、何へ依存してよいかが実装者ごとに
  変わる状態を防ぐため。
- 名前とmoduleの境目は長く残るため、実装中の都合で決めないため。

NG:
- 「とりあえず lib/ に置く」
- utils/、helpers/等、domainの責務を宣言しない場所へ集める
- class一覧だけを書き、各classが何を行わず、どこへ依存するかを書かない
- private helper、algorithm、処理の行を全て並べて構造の設計とみなす

具体的な記述例:
src/features/document/source/  ← 外部文書の「取得元」を組み合わせるmodule
src/lib/document-api/         ← 外部文書APIのclient（featuresに依存しない）

- featuresはsourceを組み合わせる場所
- libは外部APIを抽象化する場所
- importDocument → DocumentSourceClient.fetchDocument → DocumentRecordBuilder.buildを追うだけで
  流れと、各moduleが受け持つ範囲の境目が読める

このsectionを選ぶ条件:
- codeを開いて処理を追わずに、配置と公開入口から責務の分担、依存の向き、全体の処理の組み立てを
  理解するための構造が変わる場合に選ぶ。
- 同じ責務と依存を保つrenameやfile移動だけでは選ばない。
- 呼び出し元から見える入力、結果、error、副作用の保証だけが変わる場合は`caller-contracts.md`を選ぶ。

このsectionに書くこと・書かないこと:
- このsectionには、layer、component／module／classの責務、directory、置いてよいもの／置かないもの、
  依存の向き、公開入口、全体の呼び出し関係を書く。
- 呼び出し元が頼る名前とsignatureは`caller-contracts.md`を正とする。このsectionでは
  入口として参照するだけで、引数、結果、error、副作用を写さない。
- domainの概念の定義、それを呼ぶ共通の言葉、その言葉が通じる範囲を選ぶ方針は、このsectionで決めない。
- data schema、実行環境・deployの条件、security、performanceは、それぞれを扱うsectionへ送る。

判断基準:
- directory、module、classの名前が、domainまたは技術上の境目における責務を表すか。
- 配置だけで「ここに何があり、何があってはいけないか」が分かるか。
- 依存の向きと公開入口が一意か。
- 公開された入口から結果を返すmoduleまで、責務の名前を追うだけで全体の処理の組み立てを説明できるか。
- algorithmやprivate helperの説明へ範囲を広げていないか。
-->

**配置と責務:**

```text
{path/to/module}/  ← {担う責務}
{path/to/another}/ ← {担う責務}
```

**moduleの間の決まり:**

- `{module A}`は`{module B}`へ{依存してよい / 依存しない}
- `{module}`に置いてよいもの: {責務}
- `{module}`に置かないもの: {隣のmoduleへ送る責務}
- 公開入口: `{呼び出し元から見た呼び出し方の名前への参照}`

**全体の呼び出し関係:**

```text
{呼び出し元が使う入口} -> {担当module A} -> {担当module B} -> {結果を返すmodule}
```

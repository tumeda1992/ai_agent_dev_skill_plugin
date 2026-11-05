# 内部検討記録: 論点1 — 範囲との照合の規範を、どこに、どの適用範囲で書くか

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点1

## 開始context

- 問題: 既存の file に内容を足す時に、その file の範囲（名前、入口の説明、既存の見出し）と照合しないまま、読まれる頻度で足す先を選ぶ失敗が起きた。利用先 repository で、基盤の役割分担の原則を、application の層の構造を扱う文書へ足そうとし、利用者の「この file に書いてよいかゼロベースで厳しく review して」で取りやめた。
- 語の意味:
    - 範囲: その file が何を扱うと約束しているか。file 名、入口の説明（上位の索引の一行、冒頭の説明）、既存の見出しが表す。
    - 規範: 照合を求める規則の本文。skill から引く入口（trigger）は論点の外で、別に決める。
- 決める範囲: 規範を置く file と位置、規範を当てる対象（文書の file だけか、名前の付いたもの全般か）、規範の文言。
- 開始時の既決条件:
    - design.md の骨格に利用者が合意した（2026-11-05「ok」）。完成後の姿は「規範」と「skill からの入口」の 2 つ。
    - 成果物に利用先 repository 固有の情報を書かない。
    - skill は実行手順と ownership、docs は種別横断の規範を持つ（repository の context の「アーキテクチャ文書」）。
- 残る不足: 既存の近い規範との関係、規範が file 以外にも成り立つか、置き場所の候補ごとの成否。

<a id="iteration-0"></a>

## イテレーション0: 規範の置き場所・適用範囲・文言

設計前調査（task-design の PrepareStep 3 で `development_standards/` 配下を全て読み、`documentation_standards/` の入口と関連 file、doc-enricher・task-design・steering を読んだ）の finding を使う。引き渡しの時点の根拠は「近い規則は documentation_standards に無い」だったが、調べた範囲が狭かった。

<a id="iteration-0-record-1"></a>

### 調査: 既存の標準と skill に、範囲との照合に近い規則はあるか

#### 問い・探索先・方法

- 問い: 既存の file に中身を足す前に、その file の範囲と照合する規則、または近い規則が、plugin の docs と skill にあるか。あるなら、どの場面を trigger にしているか。
- 探索先: `plugins/tumeda-dev/docs/` の `development_standards/`（全 file を通読）、`documentation_standards/` の `README.md`・`file_naming.md`・`information_structuring/README.md`、`think_standards/making_and_choosing_options.md`、skill の `doc-enricher`・`document-review`・`task-design`（`templates/outcome-sections/documentation.md`）・`steering`。
- 方法: 通読と、`置き場所` の grep（`skills/` と `docs/` の全体）。

#### 結果

- `naming/core.md` の「命名後、名前と実態の対応をレビューする」: 付けた名前と実態の対応を見直し、外していたら改名して再レビューする。trigger は名前を付けた時であり、名前を変えずに後から中身を足す場面は書かれていない。
- `naming/README.md`: `core.md` は名前を付ける対象が何であっても成立する原則（積集合）だけを扱う。群の冒頭は「名前を付けるあらゆる場面で守る標準」。
- `naming/core.md` の「中身が大まかにわかる具体性を備える」: 汎用化しすぎて「間違ってはいないが、何も意味していない」名前を避ける。
- `information_structuring/README.md` の「6. 配置 — 何に一番強く結びつくかで決まる」: domain の知識をどこに置くかを、何に最も強く結びつくかで決める。対象は domain の知識の構造化である。
- `making_and_choosing_options.md` の「足したくなったこと自体が合図」: 場面の違う二つの内容を一つの標準 file へ入れ、名前が上位語にしかならず「このファイル名には適さないコンテンツとも思う」と指摘された例。和集合の失敗として書かれている。
- `doc-enricher` の Phase 2: 置き場所の決め方は「知識の抽象レベルに対応するドキュメントを選ぶ」。範囲との照合は無い。
- `task-design` の `documentation.md`: 記述の MUST に「既存documentへの統合または新owner作成の理由を明示する」。理由の中身は問わない。
- `steering` の Step 4-2: 三問目が「どこに書けば次回この議論が不要になるか」。
- `documentation_standards/README.md` の「標準の置き方」: 何を書くか・どこに置くか・誰に向けて書くかを扱う標準は `document-review` の観点ではない。

#### 限界

- `think_standards/` は `making_and_choosing_options.md` 以外を通読していない（`置き場所` の grep では該当が無かった）。

<a id="iteration-0-record-2"></a>

### 一般化: 範囲との照合は、文書の file 以外にも成り立つか

#### 起点case・暫定原則・異なるcase

- 起点case: application の層の構造を扱う文書へ、基盤の役割分担の原則を、最も読まれるという理由で足そうとした。文書の名前・入口の説明・見出しはどれも application の code の構造を指していた。
- 暫定原則: 名前の付いたものへ中身を足す前に、足す中身が、名前・入口の説明・既に入っている中身が約束する範囲に入るかを確かめる。入らなければ、範囲に入る別のもの、範囲を広げて名前を改めること、新しいもの、のどれかを選ぶ。
- 異なるcase: class への method の追加、directory（module）への file の追加、標準の file の範囲の拡張、上位の索引への一行の追加、何でも入る名前の入れ物。

#### 異なるcaseへの当てはめ

- class: 注文の永続化を担う `OrderRepository` へ、注文を扱う場所でいつも import されるという理由で、確認 email の送信を足す。名前と既存の method（取得・保存）が約束する範囲は永続化であり、送信は入らない。別の通知の class へ置く。失敗の形（呼ばれる頻度で足す先を選ぶ）が起点と同じであり、原則が成り立つ。
- directory: 外部 service への接続を置く `lib/<service>/` へ、その service の code からしか使わない日付の整形の helper を足す。directory の名前が約束するのはその service への接続であり、整形は入らない。範囲に入る別の既存の場所か、新しい場所を選ぶ。成り立つ。
- 範囲の拡張: ログの保存期間を扱う標準の file へ、ログの出力形式の規則を足す。範囲に入らない。名前を「ログ」全般へ広げると、保存期間の標準としての具体性が落ちる。広げてよいのは、広げた名前が中身を大まかに表す具体性を保てる時だけであり、上位語にしかならないなら新しい file にする。`making_and_choosing_options.md` の例（名前が上位語にしかならなかった）と同じ条件で止まる。
- 上位の索引への一行の追加: README が索引の役割を持つなら、新しい文書への一行はその範囲に入る。原則は過剰に発火しない。
- 反例になり得るもの（何でも入る名前）: `utils/` のような入れ物には、どの中身も範囲に入ってしまい、照合が働かない。原因は名前の具体性の不足であり、`core.md` の「中身が大まかにわかる具体性を備える」が扱う。この原則の適用の境界として扱う。

#### 結果

**名前の付いたもの（file、directory、module、class、method、文書の見出し）全般に成り立つ。** 起点の文書の場合だけに限らない。照合が働かないのは、名前の具体性が足りない入れ物であり、そこは既存の「中身が大まかにわかる具体性を備える」が扱う。範囲を広げる選択には「広げた名前が具体性を保てる時だけ」という条件が要る。

<a id="iteration-0-record-3"></a>

### 判断: 規範をどこに置くか

#### 判断対象・必須条件・評価軸・根拠

- 判断対象: 規範を置く file と位置。
- 必須条件:
    - record 2 の結果（名前の付いたもの全般に成り立つ）を狭めない。
    - 既存の近い規則と二重の正本にならない。
    - 置く file 自身の範囲に入る（この規範を自分自身に当てても通る）。
- 評価軸: 規範を読む場面に届くか（task-design は `development_standards/` を全て読む。doc-enricher からの入口は論点の外で決める）。
- 根拠: record 1、record 2。

#### 評価

- a) `naming/core.md` に、「命名後、名前と実態の対応をレビューする」の次の h2 として置く。
    - 範囲: `core.md` の名前は「命名の基本」、入口の説明は「名前を付ける対象が何であっても成立する原則」、既存の見出しに「命名後、名前と実態の対応をレビューする」がある。名前と実態の対応を保つ規範として入る。ただし naming の群の冒頭（`naming/README.md`）と `development_standards/README.md` の説明は「名前を付けるあらゆる場面」であり、名前を付けずに中身を足す場面は含めていない。範囲を広げると決め、二つの入口の説明を改める。「命名」という名前は、名前と実態の対応を扱う群として具体性を保つ。
    - 適用範囲: `core.md` は対象を問わない原則の置き場所であり、record 2 の結果をそのまま保てる。
    - 二重の正本: 既存の対応の見直しと同じ file の隣の section になり、trigger の違い（名前を付けた時と、中身を足す時）だけを書き分けられる。
- b) `documentation_standards/` に新しい標準を置く（文書の置き場所の標準）。
    - 適用範囲が文書の file に狭まり、record 2 の class・directory の case を落とす。
    - 名前と実態の対応という同じ原則を、`naming/core.md` とは別に持つことになり、二重の正本になる。
- c) `information_structuring/README.md` の「6. 配置」を広げる。
    - 「6. 配置」は domain の知識の構造化に限った配置の基準である。文書全般・code へ広げると、その標準の範囲を越える。この規範を自分自身に当てると通らない。
- d) 規範を docs に置かず、置き場所を決める skill の手順へ問いだけを書く。
    - skill は手順と ownership、docs は種別横断の規範という責務の境界から外れる。複数の skill に同じ問いを写すことになる。

#### 結論

- 推奨: a。決め手は、record 2 の適用範囲を狭めず、既存の「名前と実態の対応」と同じ file で正本を一つに保てること。
- 引き受ける代償: naming の群の入口の説明を「名前を付ける場面」から「名前の付いたものへ中身を足す場面」まで広げる。doc-enricher のように `development_standards/` を全て読む契約を持たない skill からは、入口（論点の外）で引けるようにする必要がある。
- 最終案への影響: 規範の文言は `core.md` の既存の文体（h2、短い本文、判断の問い、やってしまいがちな失敗）に揃え、起点の失敗を一般化した例を失敗例に置く。

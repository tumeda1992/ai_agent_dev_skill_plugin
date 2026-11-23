# C6 after候補 v1: 既存READMEの局所修正を完全diffで判断する

**位置づけ:** 既存file修正で`変更内容を全部示す`単位として、file全文ではなくunified diffを使えるか確認するafter候補。共通format案ではない。

**source:** 非公開の利用先記録から一般化したcase（論点10「README ユビキタス言語明記の体裁」）

**変更前後の確認元:** `src/features/savedItem/README.md`の変更前後のrevision

イテレーション0はsourceのdecisionを現在の骨子へ置いた再現である。イテレーション1だけが、sourceで実装時判断へ残った変更内容を合意前に示すC6の試作である。

---

## 論点10: READMEへdomain用語を置く体裁

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0: 用語定義をモジュール構想へ統合する

#### 提案0

既存`src/features/savedItem/README.md`へ`モジュール構想`sectionを追加し、その中の`WHY / WHAT / 命名意図`で、`savedItem`が何を指すdomain用語かを明記する。

独立した`用語定義`sectionは作らない。用語だけを孤立させず、moduleが必要な理由、担う機能、命名理由と一緒に読める構造にする。

#### 提案背景

document規範で`モジュール構想`の概念が確立し、既存READMEへdomain用語を明記する必要が生じた。未決なのは用語の意味そのものではなく、独立した用語集として置くか、moduleのWHY・WHAT・命名意図へ統合するかという体裁だった。

`savedItem`の定義はmoduleの責務と命名理由に依存するため、独立節よりモジュール構想の中へ置く方が、読者が名前と役割を一続きで理解できる。

#### 提案0へのフィードバック

**結果:** 受諾（source上の採用記録）

元sourceは上記を`決定`として記録している。採用時のuser feedback原文は保存されていないため補完しない。

### イテレーション1: 既存READMEへ適用する全変更をdiffで示す

#### 提案1

`src/features/savedItem/README.md`の変更はfile先頭だけに限定し、`## SavedItem 型`以降は変更しない。削除する既存introと追加する全本文を、次のdiffどおりに変更する。

```diff
 # features/savedItem

-external storeの「webクリップ」DBから取得したいいね済みコンテンツのドメインロジック層。
+## モジュール構想
+
+### WHY
+
+external store UI で 1 ページずつ開かずに、external serviceのいいね（savedItem）を素早く評価・タグ付け・吟味済み化できるキュレーションツールのドメインロジックを提供するため。external store でも吟味は成立していたが、1 ページずつ開く操作・タイトルのぶつ切り問題が摩擦だった。目的は「全部吟味済みにする」ことではなく、残したい savedItem に評価をつけて「あの良記事どこだっけ」で探せること。
+
+### WHAT
+
+savedItem の取得・吟味アクション（評価・タグ付け・吟味済み化）・タグプルダウン並び順最適化のドメインロジック一式。external store を Single Source of Truth として、UI 操作だけで吟味が完結する場を提供する。
+
+### 役割と存在意義
+
+external data store の savedItem データに対する読み取り・書き込みのドメインロジックを担う。React 非依存の pure async 関数群として実装し、`app/api/` ルートから呼ばれる。
+
+### 命名意図
+
+`savedItem` = external store に同期した external serviceでいいねしたポスト。
+
+`post` ではない（external serviceの用語は `lib/external-service` に閉じる、`application_architecture.md`「features に外部サービス名を持ち込まない」規約準拠）。`externalSavedItem` も退けた（外部サービス名の混入）。ユーザーが external store で管理・整理する対象としてのドメイン語彙。
+
+### 進化の種
+
+（想定。確定ではない）
+
+- 評価・タグによる絞り込み検索（`product.md` 「将来作りたい」検索機能に接続）
+- 吟味アクション履歴の記録（いつ評価したか）
+- external store 側で変更された値の逆方向同期

 ## SavedItem 型
```

#### 提案背景

イテレーション0では、`モジュール構想`を追加して用語定義を統合する構造へ合意した。しかし、実際の変更では、既存introを残すか置換するか、`役割と存在意義`と`進化の種`も追加するか、WHYとWHATをどの具体性で書くか、外部service名を退ける理由をどこまで残すかという判断が必要になる。

これらはREADMEを書き換える時の実装詳細ではなく、読者が得るmodule理解そのものである。変更後に初めてreviewするのではなく、削除行と追加行をすべて含むdiffへ先に合意する必要がある。

file全文を表示すると、変更しない`SavedItem 型`と`fetchSavedItems`まで再掲される。このdiffは、前後の見出しをcontextとして残しながら、変更対象の全行だけを一つの合意対象にできる。

#### 提案1へのフィードバック

**結果:** 受諾

> ok

file先頭の局所変更について、削除行と追加行のすべて、変更位置を特定できる前後context、diff外を変更しないことが一つのdiffで読める。この形なら、既存file全文を再掲せず、何を残し、変え、削るかへ合意できる。

### 決定

既存fileの変更が局所範囲に閉じ、全変更行を読みやすい一つのunified diffで示せる場合は、完全diffを合意対象にする。diffには、対象範囲の追加行と削除行をすべて含め、変更位置、保持される既存内容、変更後の接続先を特定できるcontextを添える。変更hunk内を省略せず、変更しないfile残部は再掲しない。

大規模な変更、離れた多数の変更、複数fileにまたがる変更、file移動等、完全diffでは判断しづらいvariantはこのcaseでは決めない。

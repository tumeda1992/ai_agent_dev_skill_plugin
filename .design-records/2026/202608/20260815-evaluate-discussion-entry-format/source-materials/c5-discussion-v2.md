# C5 after候補 v2: READMEのownerとfile内容を一緒に判断する

**位置づけ:** C5 beforeの履歴を維持し、path変更後に残ったREADMEの編集判断を、新しいiterationのproposalとして補ったafter候補。共通format案ではない。

**source:** 非公開の利用先記録から一般化したcase（論点11「画面イメージと設計意図のストック」）

イテレーション0と1は元sourceの再現である。イテレーション2だけが、C5の不足を現在のprototypeで補うための試作であり、まだ合意されていない。

---

## 論点11: 画面イメージと設計意図のストック

**ステータス:** 決定

**種別:** レビュー指摘 / 認識齟齬

### イテレーション0: UIの情報配置と設計意図を設計成果物へ残す

#### 提案0

`design.md`へ「3-1.5 画面イメージと設計意図」を追加し、今回の仕様を基準に、一覧画面、`SavedItemCard`、詳細モーダルの情報配置と理由を残す。

##### 一覧画面

headerへsort、filter、tag順更新のcontrolを置く。`SavedItemCard`は、タイトル、評価と吟味済み操作、tag、metadata、source URLの順に表示する。

##### 詳細モーダル

タイトル、metadata、吟味action、本文全文の順に表示する。タイトルだけでほぼactionを判断でき、本文は雰囲気を知るための補助なので、長文を読み切らなくても吟味actionへ進めるよう本文を最後に置く。

##### 設計意図の保存先

UIの配置意図を`src/app/saved-items/README.md`へ保存する。初期は汎用の一画面とし、将来必要になった時に特化画面へ分ける進化道筋、分岐line、金属疲労が起きた時に大喜利的に設計し直さないための意図も残す。

#### 提案背景

操作flow、data model、命名、module境界は設計済みだったが、情報配置のwire levelでの認識合わせがなかった。既存UIを継ぎ足すのではなく、今回の仕様から何をどの順で見せるかを決めないと、実装中に配置判断が残る。

詳細モーダルの初期案は、タイトル、本文、吟味actionの順だった。しかし本文は全文を精読する主情報ではなく、タイトルで行った判断へ雰囲気を補う情報である。そのため、metadataと吟味actionを先に置き、本文を最後にする必要が生じた。

#### 提案0へのフィードバック

**結果:** 保存先の修正要求

> `src/app/saved-items/README.md` ではなくない？ ページではなくてコンポーネントの方じゃない？

UI配置と設計意図のownerをpage統合層とした点が成立しない。`app`はdata取得とcomponent統合を担い、presentationの責務は`components`にあるため、READMEの保存先を見直す必要がある。

### イテレーション1: UI設計意図のownerをcomponentsへ移す

#### 提案1

UI配置と設計意図の保存先を、`src/app/saved-items/README.md`から`src/components/savedItem/README.md`へ変更する。

`src/app/saved-items/README.md`は作成しない。`design.md`のdocs deliverableと付録の変更対象一覧も、新しいpathへ修正する。

#### 提案背景

`app/saved-items`は、featuresを呼び出し、取得したdataをpresentation componentへ渡す統合層である。画面イメージからpage directoryを直感的に保存先としたが、情報の順序、強調、操作配置の理由を所有するのは`components/savedItem`である。

保存先をpresentation ownerへ移せば、componentを変更する時に実装と設計意図を同じdirectoryで確認できる。URL strategyを含む将来の進化道筋も、UI componentの変化を判断する材料として同じREADMEへ集約する。

#### 提案1へのフィードバック

**結果:** 受諾（source上の採用記録）

元sourceは`提案1（採用）`、`決定: 確定（提案1採用）`と記録している。採用時のuser feedback原文は保存されていないため補完しない。

### イテレーション2: 新規READMEの作成結果まで合意対象にする

#### 提案2

保存先だけでなく、次の完成後treeとREADME全文を、新規file作成の合意対象にする。

##### 完成後の配置

```text
src/
├── components/savedItem/
│   ├── README.md                 # 新規: UI設計意図の正本
│   ├── SavedItemList.tsx
│   ├── SavedItemListHeader.tsx
│   ├── SavedItemCard.tsx
│   ├── RatingControl.tsx
│   ├── TagsControl.tsx
│   ├── ReviewedControl.tsx
│   └── SavedItemDetailModal.tsx
└── app/saved-items/
    └── page.tsx                  # README.mdは作成しない
```

##### `src/components/savedItem/README.md`

````markdown
# components/savedItem

## モジュール構想

### WHY

一覧で素早く評価、タグ付け、吟味済み化する操作と、長文savedItemの詳細を見ながら行う吟味を、同じUI component群で両立する。

### WHAT

- `SavedItemList`: headerとcard listを描画する。
- `SavedItemListHeader`: sort、未吟味filter、tag順更新をまとめる。
- `SavedItemCard`: 一覧で一件のsavedItemを表示し、三つのcontrolを配置する。
- `RatingControl`: 評価を変更・解除する。
- `TagsControl`: tagを追加・削除する。
- `ReviewedControl`: 未吟味と吟味済みを切り替える。
- `SavedItemDetailModal`: 本文全文と吟味actionをmodalで表示する。

### 役割と存在意義

各`XxxControl`は、自身が扱う属性のstateとevent-drivenなfetchを所有する。`SavedItemCard`と`SavedItemDetailModal`はcontrolを組み合わせ、情報配置を所有するが、吟味actionの処理を重複して持たない。

### 命名意図

`XxxControl`は、一つの属性を現在状態に応じて操作するUIを表す。`SavedItemCard`は一覧の表示単位、`SavedItemDetailModal`は詳細閲覧と吟味を行うmodalである。

## 画面構成と配置意図

### SavedItemCard

```text
┌─────────────────────────────────────────────┐
│ タイトル                                     │
│ 評価control          吟味済みcontrol         │
│ tag control                                  │
│ 取り込み日・投稿日                           │
│ source URL                         全文を見る     │
└─────────────────────────────────────────────┘
```

タイトルを最上段に置く。一覧での判断は主にタイトルから始まるためである。評価と吟味済みは主要な二つのactionとして同列に置き、tagは別段、metadataと外部URLは補助情報として後ろへ置く。

### SavedItemDetailModal

```text
┌─────────────────────────────────────────────┐
│ タイトル                                  × │
│ 取り込み日・投稿日・source URL                    │
│ 評価・吟味済み・tagの各control               │
│ 本文全文                                     │
└─────────────────────────────────────────────┘
```

本文は雰囲気を知るための補助情報であり、タイトルだけでほぼactionを判断できる。長文を読み切らなくても吟味できるよう、吟味actionを本文全文より前に置く。詳細modalは独立した閲覧画面ではなく、一覧の概要表示の延長として扱う。

### 各controlの見た目

- `RatingControl`: 選択中の評価が分かるbutton列と解除buttonを置く。
- `TagsControl`: autocompleteと、削除できるtag badgeを置く。
- `ReviewedControl`: 未吟味と吟味済みを切り替えるtoggleを置く。

## 進化の種

一覧UIは、最初は一つの汎用画面でsortとfilterを切り替える。吟味中と閲覧中の操作が同じUIで両立しにくくなった時は、mode presetを経て`/saved-items/review`への分離を検討する。

詳細UIはmodalから始める。独自layoutまたはURL直linkの重要性が増した時は、`/saved-items/[id]`への分離を検討する。これらは将来の決定ではなく、金属疲労が起きた時に当初想定した分岐を思い出すための材料である。

## 設計意図メモ

componentの変更時に、codeを読めば分かる挙動ではなく、codeだけでは復元しづらい配置理由、制約、捨てた案が新しく判明した場合は、この節へ追記する。
````

#### 提案背景

イテレーション1では、UI設計意図のownerを`components/savedItem`へ正した。しかし、pathと保存する題材だけでは、既決のUI情報をREADMEのどこまで含め、どんな見出しと本文へするかが実装者へ残る。

このREADMEは新規かつ、一つのproposal内で全文を読める大きさである。outlineと代表本文に分けるより、完成後のfileを直接示せば、見出し間の重複、情報の不足、粒度まで合意前に確認できる。treeは、file本文では分からない既存componentとの位置関係と、作らない`app/saved-items/README.md`を補う。

#### 提案2へのフィードバック

**結果:** 受諾・長さを許容

> 大きい感あるけど、結局これを合意できないと安心して差分適用させられないからこれは必要だよな

全文draftには読むcostがあるが、このREADMEでは省略した本文がそのまま実装者の新しい判断になる。proposalを短くするためにoutlineまたは代表本文へ縮めず、成果物へ安心して適用を許可できる全文を合意対象にする。

### イテレーション3: 新規READMEは見出し構造へ合意してから実fileを書く

#### 提案3

新規READMEの合意前には、本文全文ではなく、完成後treeとannotated outlineを示す。outlineへ合意した後に実fileを作成し、書かれたREADME自体をreviewする。

##### 完成後の配置

```text
src/
├── components/savedItem/
│   ├── README.md                 # 新規: UI設計意図の正本
│   ├── SavedItemList.tsx
│   ├── SavedItemListHeader.tsx
│   ├── SavedItemCard.tsx
│   ├── RatingControl.tsx
│   ├── TagsControl.tsx
│   ├── ReviewedControl.tsx
│   └── SavedItemDetailModal.tsx
└── app/saved-items/
    └── page.tsx                  # README.mdは作成しない
```

##### READMEの見出し構造

```text
# components/savedItem
├── ## モジュール構想
│   ├── ### WHY
│   │   └── 一覧と詳細の両方で吟味できるcomponent群が必要な理由
│   ├── ### WHAT
│   │   └── List、Header、Card、三Control、DetailModalの責務
│   ├── ### 役割と存在意義
│   │   └── Controlがstateとfetch、CardとModalがlayoutを所有する境界
│   └── ### 命名意図
│       └── Control、Card、DetailModalという名前が表す責務
├── ## 画面構成と配置意図
│   ├── ### SavedItemCard
│   │   └── 五段の情報配置と、タイトル・主要actionを先に置く理由
│   ├── ### SavedItemDetailModal
│   │   └── 四段の情報配置と、本文全文を吟味actionより後へ置く理由
│   └── ### 各controlの見た目
│       └── 評価button列、tag autocomplete、吟味済みtoggle
├── ## 進化の種
│   └── 汎用一覧から吟味専用画面、modalから専用pageへ分ける条件
└── ## 設計意図メモ
    └── codeだけでは復元しづらい理由・制約・棄却案を後から追記する条件
```

##### outline合意後の進め方

```text
このtreeとoutlineへ合意
  ↓
src/components/savedItem/README.mdを実際に作成
  ↓
作成されたREADMEをreview
  ├── 問題なし → 完了
  └── 修正あり → 変更内容を全部示して合意
```

#### 提案背景

提案2は、file本文へ未合意判断を残さないため、README全文をdiscussion内に表示した。しかし新規fileには、見出し構造を先に合意し、その構造に沿って実物を書かせてからreviewする段階を置ける。全文をdiscussionと成果物へ二重に持つより、documentの責務と構造をoutlineで決め、文章としての完成度は実fileで確認する方が読みやすい。

既存fileの修正では、既存本文から何が変わるかをoutlineだけで判断できないため、変更内容を全部示す必要がある。この提案は新規READMEだけを扱い、修正variantの形式までは確定しない。

#### 提案3へのフィードバック

**結果:** 受諾

> ok

新規READMEは、完成後treeとannotated outlineへ先に合意し、その後に実fileを書かせて実物をreviewする。discussion内へ本文全文を複製しない。

### 決定

`src/components/savedItem/README.md`の新規作成では、既存componentとの位置関係と`src/app/saved-items/README.md`を作らないことが分かる完成後tree、および各見出しの役割と扱う内容が分かるannotated outlineを合意対象にする。

outlineの合意後に実fileを作成し、書かれたREADME自体をreviewする。新規fileの本文全文は、作成前のdiscussionへ複製しない。作成後に修正が必要になった場合は、修正内容を省略せず提示して合意する。

# C5 before再現 v1: READMEのowner変更後もfileの完成像が見えない状態

**位置づけ:** C5の元sourceを、保存先変更後に何が決まり、何が成果物作成時の判断として残ったか確認するために再現したbefore。after案または共通format案ではない。

**source:** 非公開の利用先記録から一般化したcase（論点11「画面イメージと設計意図のストック」）

sourceでは、提案1の採用によって論点自体は決定済みになっている。この再現でもその状態を維持し、元sourceになかったREADMEのoutlineや代表本文を補完しない。

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

### 決定

一覧画面、`SavedItemCard`、詳細モーダルの情報配置と設計意図を`design.md`へ追加し、UI設計意図のstockを`src/components/savedItem/README.md`へ置く。`src/app/saved-items/README.md`は作成しない。

この決定から、READMEへ保存する題材とownerは分かる。一方、作成後のdirectory tree、READMEの見出し構造、既決の題材からREADMEへ含める範囲、判断に重要な代表本文は示されていない。

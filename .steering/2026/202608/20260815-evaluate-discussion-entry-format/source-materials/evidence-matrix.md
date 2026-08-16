# Discussion corpus evidence matrix（一般化済み検証資料）

このファイルは、非公開の利用先で得た観測を、repository名、source path、固有domain語彙を除いて再構成した検証資料である。`Dxx`と`Rxx`は[`coverage-v3.md`](./coverage-v3.md)の一般化済みcorpus IDを指す。

## 調査母集団

- 対象: 二つの利用先にあった`discussion.md`、`task-design-discussion.md`、`implementation_review.md`
- file数: 20
- `## 論点`または`## 副産物論点`の明示見出し: 130
- `#### イテレーションN`の記録: 53
- iteration見出しの内訳: 番号のみ45、内容を表す補題付き8
- 現template固有の`### 現在の合意対象`: 0。母集団は現在templateの直接利用結果ではなく、format要件の発生源として扱う

## iterationの追跡性

### E01: 番号だけではなく、展開を表す見出しが実際に機能した

- source: 非公開の利用先記録から一般化したcase（論点4）
- 展開:
  1. `since_id アプローチの検討`
  2. `start_time / end_time アプローチ`
  3. `Elevated access制約発覚 → since_id に変更`
  4. `since_id + until_id ... の導入`
- 観測:
  - 見出しだけで、候補の変更、外部制約による撤回、最終的な制約追加まで復元できる。
  - iteration本文を畳んでも、議論の筋を失わない。
- 帰納される要件候補:
  - iterationは番号だけでなく、そのiterationで起きた判断変化を短く命名する。
  - iterationを補助資料へ格下げせず、当事者が現在地を掴むnavigationとして扱う。

### E02: 53件中45件が番号だけで、本文を順に再読しないと展開を思い出せない

- sources: 両利用先のiterationを持つ全discussion系file
- 観測:
  - `イテレーション1`、`イテレーション2`だけでは、feedback、診断更新、提案変更、scope分割のどれが起きたか区別できない。
  - 同じ論点へ時間を置いて戻った当事者が、各本文を先頭から読み直す必要がある。
- 帰納される要件候補:
  - 当事者向けの「議論の目次」が必要であり、単なるchronological archiveでは足りない。

### E03: `現在の焦点`とA/B/C分解が、長い論点の現在地を支えた

- source: 非公開の利用先記録から一般化したcase（論点10）
- 展開:
  - 初期提案がcontext ownership、template path、model profile、remote Git provider tasklistという4契約を一括した。
  - iteration 1で10-A / 10-B / 10-Cへ分解し、各段階に`現在の焦点`を記載した。
  - 最後に`論点10の結論`で3 decisionを再統合した。
- 観測:
  - iteration本文の反復は長いが、`現在の焦点`とA/B/Cが進行位置を示すため、何を今決めているかは追いやすい。
  - iterationは単なる案の修正版ではなく、decision boundaryの再編を担う場合がある。
- 帰納される要件候補:
  - 議論の展開には「案の差分」以外に、焦点移動、分解、再統合を表す型が必要。
  - 現在案と履歴の二分だけでは、この型を表現しきれない。

### E04: 診断が深くなるiterationと、提案だけを修正するiterationが同じ外形になっている

- source: 非公開の利用先記録から一般化したcase（論点7）
- 展開:
  - 初期: tasklistを表面的な作業として書いたため、実装時判断が流出した。
  - iteration 1: skillにdesign完成定義がないことへ原因を深掘りした。
  - iteration 2: deliverable単位で問いとcheckを持つ提案へ変えた。
  - iteration 3: HOWだけでなくWHY / goalから設計する上位原則を加えた。
- 観測:
  - 原因の深掘り、提案の具体化、上位原則の追加という異なる変化が、毎回同じ`検証 / 修正先 / 根本原因 + 提案`で表示される。
  - `変更点`は有用だが、見出しが変化の種類を示さないため、展開を一覧できない。
- 帰納される要件候補:
  - 各iterationは「何が変わったか」だけでなく、診断更新、提案修正、scope変更等の変化種別を見出しまたはsummaryで示す。

### E05: 現formatの起源は、浅い提案を構造で防ぐための5 iterationだった

- source: 非公開の利用先記録から一般化したcase（論点11）
- 展開:
  1. 診断への遡及をproposal loopへ追加
  2. 提案は総論と各論の両方を必須化
  3. 診断の質が提案の質を決める因果を追加
  4. discussion format自体を構造化
  5. 各論を`ルール本文 + 適用例`にする
- 観測:
  - `事象 / 原因 / 検証 / 総論 / 各論 / 具体例`は偶然のboilerplateではなく、当時の具体的失敗を一つずつ防ぐために追加された。
  - 一方、5 iterationすべてが完全提案を繰り返すため、現在の契約集合と、その契約がどのiterationで追加されたかを一目で対応づけられない。
- 帰納される要件候補:
  - 見出しを減らす時も、深い診断、抽象と具体、feedbackによる追加契約という意味能力は捨てない。
  - 改善対象は意味要素そのものより、累積した契約と議論展開の対応表示である。

### E06: `ルール`の反復は意味を平坦化するが、抽象と具体の対は残す必要がある

- sources:
  - E05のiteration 5
  - corpus case D15の複数論点
- 観測:
  - host起動、context読取、fallback、release検証等の異なる契約がすべて`ルール`として並ぶと、scan時に区別できない。
  - E05では、抽象ルールだけでも具体例だけでも理解を誤るという実害から両者を対にした。
- 帰納される要件候補:
  - `ルール`という固定labelを並べるのではなく、内容固有の名前を持つ具体契約として見せる。
  - 各具体契約は、それが属する全体方針と、必要な適用例を接続したままにする。

### E07: 後続論点が前の決定の語彙を上書きする場合がある

- source: 非公開の利用先記録から一般化したcase（論点5・6）
- 展開:
  - 論点5で`Template`階層とdirectory treeを決定した。
  - 論点6でconcept名を`Pattern`へ変更した。
  - 論点5の末尾に、最終名は`Pattern`であるという注記を追加した。
- 観測:
  - 当事者が追うべき変遷は同一論点内のiterationだけではない。
  - topic間で依存する決定が変わると、前topicの具体像も読み替えが必要になる。
- 帰納される要件候補:
  - formatは必要時に、後続decisionによる置換・supersede関係を表示できる。
  - すべてを同一topicへ押し込まず、topic単位processを維持したまま現在の語彙へ辿れることが必要。

## 変更内容の具体像

### E08: directory treeがあると、配置decisionをその場で評価できる

- source: E07の論点5
- 観測:
  - module hierarchyとdirectory treeを併記し、既存directoryの移動も矢印で示した。
  - `Schedule::`直下のflat配置を避けるという総論が、完成後のtreeと直接対応する。
- 帰納される要件候補:
  - directory配置・移動では、path列挙より完成後treeが判断材料として機能する。

### E09: before / after差分があると、UI変更の境界を誤読しにくい

- source: 非公開の利用先記録から一般化したcase（論点1 iteration 2）
- 観測:
  - `// 変更前`と`// 変更後`のJSXを示し、「点線エリアの見た目は変えず、modal内部だけ変える」を具体化した。
  - 変更する範囲だけでなく、変更しない範囲もpreviewから判断できる。
- 帰納される要件候補:
  - code / UI挙動変更には、必要最小限のbefore / afterまたはstate transitionが有効。

### E10: READMEのpath変更だけでは、合意対象の本文が空白のまま残る

- source: 非公開の利用先記録から一般化したcase（論点11）
- 展開:
  - 初期は`src/app/saved-items/README.md`へUI意図を保存する案だった。
  - iteration 1で`src/components/savedItem/README.md`へ変更し、前者は作らないと決定した。
- 観測:
  - pathとowner layerは決まったが、新規READMEの見出し、代表本文、既存docsとの責務境界はentryから分からない。
  - `design.md 3-4 docsを修正`への合意は、新規fileの完成像への合意になっていない。
- 帰納される要件候補:
  - 文書作成はtreeだけで足りず、outlineと判断に重要な代表本文まで必要。
  - previewの型は変更対象ごとに変える必要がある。

### E11: 抽象的な作業名だけの設計は、実装時の独自判断を生んだ

- source: 非公開の利用先記録から一般化したcase（FB-1〜3）
- 観測:
  - test setup、architecture doc、product docが「作成する」「整備する」程度で設計され、配置と本文scopeを実装時に決めた。
  - 結果として、test設定の配置、architecture docの内容、product docにschema/typeを含めるかが合意外判断になった。
- 帰納される要件候補:
  - previewは読みやすさの装飾ではなく、合意されていない実装判断を露出する設計gateである。

## ネクストアクション

### E12: 固定fieldは大量のdefault値と完了報告を生む

- 全123件の固定`ネクストアクション`fieldの傾向:
  - 空欄: 28
  - `design.md`への反映に言及: 31
  - tasklistに言及: 17
  - 完了・実装済み・反映済みに言及: 23
- 観測:
  - 空欄、`なし`、既定consumerへの反映、完了報告が多く、論点固有情報ではない。
  - status、decision、workflow handoffと情報が重複する。
- 帰納される要件候補:
  - default handoffと完了報告を、全entryの固定fieldとして繰り返さない。

### E13: 一部のネクストアクションは、当事者の進行位置を実際に伝える

- sources:
  - feature list discussion 論点7の`イテレーション1へ`、`イテレーション2へ`
  - phase3 sync discussionの`論点10〜12を起票し、1つずつ解消する`
  - migration discussionの`10-Bを議論する`、`10-Cを議論する`
  - `外部review後に確定`、`別steering起票`等
- 観測:
  - これらは単なるconsumer反映ではなく、現在どこで止まり、次に何を扱うかというactive state transitionである。
  - fieldを一律削除すると、当事者向けnavigationをさらに弱くする。
- 帰納される要件候補:
  - `ネクストアクション`という固定fieldを残すかではなく、非defaultな進行遷移をどこで明示するかを決める。

## iterationなしの対照例

### E14: 新規提案は、事象→原因→提案が一方向なら現形式でも読みやすい

- sources:
  - corpus case D09の論点2
  - corpus case D01の短い論点
- 観測:
  - 選択肢、原因、決定が一回で閉じる場合、思考順と理解順のずれは小さい。
  - `総論 + 各論 + 適用例`も、契約数が少なければscanを妨げない。
- 帰納される要件候補:
  - 全entryを複雑に再構成するより、iterationで累積する情報をどうnavigation可能にするかが中心課題。

## 暫定分類

| 分類 | 観測されたproblem | 機能した表現 | format要件候補 |
| --- | --- | --- | --- |
| 展開のnavigation | iteration番号だけでは筋を思い出せない | 説明的見出し、`現在の焦点`、A/B/C | 議論の目次と現在地を持つ |
| 変更の型 | 診断更新・提案修正・scope分割が同じ外形 | `変更点`、診断level明記 | 何が変わったiterationかを示す |
| 累積状態 | 完全提案の反復から現在の契約集合を再構築する | 最終結論、現在の焦点 | 現在の具体像と各変更の接続を同時に見せる |
| 抽象と具体 | `ルール`反復は平坦、削除すると具体性喪失 | named tree、before / after、適用例 | 内容固有名 + 対象別preview |
| topic間依存 | 後続decisionで前topicの語彙が変わる | supersede注記 | 置換先へ辿れる関係表示 |
| 進行遷移 | default handoffはnoise、次の焦点は重要 | `イテレーションNへ`、`10-Bへ` | 非defaultなstate transitionだけ保持 |

## 現時点で棄却する早計な結論

- 「現在案を上、iterationを下へ分ければ解決する」: E01、E03、E13が示す当事者向けnavigationを従属情報にしてしまう。
- 「iterationは差分だけ残せばよい」: E03のdecision分解、E04の診断更新、E07のtopic間置換を単純差分では表せない。
- 「`ルール / 適用例`を削除すればよい」: E05の発生経緯を失い、抽象だけ・具体だけの失敗を再導入する。
- 「ネクストアクションを削除すればよい」: E13のactive state transitionまで消してしまう。

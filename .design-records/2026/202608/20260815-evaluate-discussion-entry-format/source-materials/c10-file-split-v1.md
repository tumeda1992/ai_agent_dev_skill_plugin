# C10 after候補 v1: 単一fileの分割を責務対応で判断する

**位置づけ:** 既存の単一fileを複数fileへ分割する時、完成後treeだけでもfile全文の再掲だけでも見えにくい、旧責務から新fileへの配分を合意できるか確認するafter候補。共通format案ではない。

**判定:** 成立。`file-change-set`のfile分割variationとして受諾

**source:** 非公開の利用先記録から一般化したcase（論点4「repository.ts の構造」）

sourceでは、単一fileの問題、完成後tree、mapperとfetchのcode image、task一覧が別々に示された。ここでは、分割によって旧fileの各責務がどこへ移り、外部contractがどう維持されるかを一つの判断対象へまとめる。

---

## 論点4: savedItem repositoryを公開操作と変換責務へ分割する

**ステータス:** 提案中

**種別:** レビュー指摘

### イテレーション0: file数ではなく責務の移動先を確定する

#### 提案0

`src/features/savedItem/repository.ts`をdirectoryへ分割する。合意対象は「directory化する」という操作だけでなく、旧fileが持つ責務の移動先、公開importの互換性、削除する旧fileまで含む次の完成状態とする。

##### 完成後の配置

```text
src/features/savedItem/
├── repository/
│   ├── fetchSavedItems.ts
│   ├── fetchSavedItems.spec.ts
│   ├── index.ts
│   └── externalRecordMapper.ts
├── repository.ts                         [存在しない]
└── repository.spec.ts                    [存在しない]
```

##### 旧責務から新fileへの対応

| 旧file内の責務・要素 | 移動先 | 分割後のcontract |
| --- | --- | --- |
| `queryDatabase`を呼び、pagination結果を返す`fetchSavedItems` | `repository/fetchSavedItems.ts` | query条件と返却形を維持し、page変換だけをmapperへ委譲する |
| `response.results.map(...)`内のpage→`SavedItem`変換 | `repository/externalRecordMapper.ts` | `ExternalRecordMapper.toSavedItem(page): SavedItem`として切り出す |
| title、URL、source item ID、tag、rating、reviewed、created timeのfield抽出 | `repository/externalRecordMapper.ts` | mapper内の非公開関数へ分け、外部へ個別exportしない |
| `VALID_RATINGS`とrating検証 | `repository/externalRecordMapper.ts` | 不正値を`null`にする既存挙動を維持する |
| `fetchSavedItems`の外部公開 | `repository/index.ts` | `export { fetchSavedItems } from "./fetchSavedItems"`で維持する |
| 旧`repository.spec.ts`のfetch・pagination・変換検証 | `repository/fetchSavedItems.spec.ts` | import先だけを新構造へ合わせ、既存caseを落とさない |

旧fileにある要素は、この表のいずれかへ対応させる。分割を理由に既存の変換field、fallback、validation、pagination contractを削除しない。

##### 新しいfile間のflow

```text
consumer
  -> repository/index.ts
  -> fetchSavedItems.ts
       -> queryDatabase(...)
       -> response.results.map(ExternalRecordMapper.toSavedItem)
            -> externalRecordMapper.ts
       -> { items, nextCursor }
```

consumerはdirectoryの`index.ts`を通して従来と同じ`@/features/savedItem/repository`から`fetchSavedItems`をimportする。consumer側のimport path変更は発生させない。

##### fileごとの変更内容

`fetchSavedItems.ts`には、旧`fetchSavedItems`からquery実行、cursor処理、`next_cursor ?? null`の返却を移す。inlineのpage変換は置かず、`response.results.map(ExternalRecordMapper.toSavedItem)`だけを呼ぶ。

`externalRecordMapper.ts`には、pageから`SavedItem`を組み立てる`ExternalRecordMapper.toSavedItem`と、そのためのfield別非公開関数を置く。external data APIのquery、pagination、環境変数の読取りは置かない。

`index.ts`は公開関数のre-exportだけを持ち、変換処理を再実装しない。

旧`repository.spec.ts`は`repository/fetchSavedItems.spec.ts`へ移す。既存assertionを削除してgreenにせず、importだけを新しい公開pathへ合わせる。

##### この分割へ含めない変更

`SavedItem`型、external data storeのproperty名、query filter・sort、consumerの表示、公開関数名は変更しない。分割中にそれらを変える必要が見つかった場合は、このproposalへ混ぜず別decisionとして提示する。

##### 完了確認

- 完成後treeの4 fileが存在し、旧`repository.ts`と`repository.spec.ts`が存在しない。
- 旧fileの各責務・fallback・validationが対応表の新fileまたはspecへ一つ以上対応する。
- repository外からの`fetchSavedItems` import pathが変わっていない。
- repository外から`externalRecordMapper.ts`を直接importしていない。
- 旧specの既存assertionが`repository/fetchSavedItems.spec.ts`に残っている。
- 分割対象以外にdiffがない。
- test、lint、typecheckがgreenである。

#### 提案背景

sourceの完成後treeは、どのfileを作り、どの旧fileを消すかを示していた。code imageは、fetchとmappingを分ける方向も示していた。しかし両者の間に、旧fileの各責務、fallback、testが新しいどこへ移るかという対応がなかった。実装者はtreeを満たしながら、一部field変換や既存testを落とすことができる。

C9の一対一移動では、source fileとtarget fileのpath対応が中心だった。このcaseは一つのsourceが複数targetへ分かれるため、pathの対応だけでは足りない。移す単位をfileから責務・contractへ下げ、各要素の移動先、公開境界、残す挙動、削除する旧fileを同じ変更集合として示す必要がある。

一方、各新fileの完成全文をこのentryへ書く必要はない。新しい判断は責務分割であり、既存ロジックの大半は移設される。責務対応、file間flow、維持する外部contract、scope外、完了確認を省略せず、実装自由度が残る関数内部の書式までは固定しない。

#### 提案0へのフィードバック

**結果:** 母集団への一巡適用で受諾

単体の合意gateにはせず、C9・C11との共通骨子、既確認caseへの戻り検証を含む論点4の提案20として受諾した。

### 決定

このafterを`file-change-set`のfile分割variationとして採用する。pathの一対多対応だけで済ませず、旧fileの責務、contract、test、公開APIを新fileへ対応させる。典拠は`task-design-discussion.md`論点4のイテレーション20とする。

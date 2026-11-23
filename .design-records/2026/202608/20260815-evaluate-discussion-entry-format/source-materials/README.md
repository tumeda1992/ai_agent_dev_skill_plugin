# 一般化済みsource materials

このdirectoryは、discussion entryのformatを具体caseから検討した時のbefore / after、反証、coverageを保持する。非公開の利用先記録から作った資料だが、repository名、source path、commit ID、固有domainのclass・file・API名は一般例へ置換している。

`C1`〜`C11`はformat分類ではなく、異なる読みにくさや合意時の不安を検証したcase IDである。一つのcaseから得た表示方法を全caseへ固定せず、case群を往復して共通骨子とvariationを決めるために使った。

## Case catalog

| Case | 問題または判断対象 | 主な資料 |
| --- | --- | --- |
| C1 | iterationを重ねるたびに追加された契約の累積結果と議論の展開を、一つのentryから追えない | [失敗したsnapshot方式](./c1-iteration-replay-v2.md)、[一entryへ蓄積するv3](./c1-single-entry-v3.md)、[各回の問いへ絞るv4](./c1-single-entry-v4.md)、[最終決定と判断の足跡を分けるv5](./c1-single-entry-v5.md) |
| C2 | 原因診断が深まった回と、診断を維持して提案だけを変えた回が同じ外形で区別できない | [c2-single-entry-v1.md](./c2-single-entry-v1.md) |
| C3 | 一度採用した案が技術的反証で撤回され、過去候補へ戻って別の制約を加える経路を追えない | [c3-single-entry-v1.md](./c3-single-entry-v1.md) |
| C4 | 一括提案を複数decisionへ分けた後、parentとchildのどこが現在の判断対象か分からない | [c4-discussion-v1.md](./c4-discussion-v1.md) |
| C5 | 新規documentの保存pathには合意したが、作られるfileの見出し構造と内容には合意していない | [before v1](./c5-discussion-v1.md)、[after v2](./c5-discussion-v2.md) |
| C6 | 既存fileを変更する時、変更方針だけでは追加・削除される全行へ安心して合意できない | [c6-existing-file-modification-v1.md](./c6-existing-file-modification-v1.md) |
| C7 | 後続topicの独立decisionが、先行topicの具体treeと識別子だけを置換した時に現在有効な表現が分からない | [c7-topic-supersede-v1.md](./c7-topic-supersede-v1.md) |
| C8 | iteration中に現れたowner移動が元のdecisionへ累積され、別decisionであることが読めない | [c8-owner-move-v1.md](./c8-owner-move-v1.md) |
| C9 | directory移動への合意で、source→target、旧path削除、consumer更新、scope外を閉じられない | [c9-file-move-v1.md](./c9-file-move-v1.md) |
| C10 | 一つのfileを複数fileへ分割する時、旧責務・test・公開contractの移動先が分からない | [c10-file-split-v1.md](./c10-file-split-v1.md) |
| C11 | 多数fileを意味保持で移植する時、許可する一般化と意図しない意味変更を区別できない | [c11-semantic-migration-v1.md](./c11-semantic-migration-v1.md) |

## 帰納とcoverageの資料

- [curated-failures-before-after.md](./curated-failures-before-after.md): 異なる失敗caseを具体的なbefore / afterとして比較した初期資料。
- [evidence-matrix.md](./evidence-matrix.md): iteration、decision分解、preview、next actionについてcorpusから得た観測。
- [coverage-v1.md](./coverage-v1.md): 初期の共通骨子とvariationを、キュレーション外のcaseへ仮適用した結果。
- [coverage-v2.md](./coverage-v2.md): C1〜C8を反映した後の未対応範囲の再評価。
- [coverage-v3.md](./coverage-v3.md): 補正後の母集団全体を一巡し、C9〜C11を含む方針群で扱えるか確認した最終coverage。

## 読む順序

C番号の意味を知るだけならこのcatalogを読む。formatが具体caseにどう作用したかを見る時は該当caseを読む。case選定から全体coverageまでの帰納過程を監査する時だけ、`curated-failures-before-after.md`、`evidence-matrix.md`、`coverage-v1.md`〜`coverage-v3.md`の順に辿る。

一般化の境界と参照集合は、[`source-materials-migration-ledger.md`](../source-materials-migration-ledger.md)を正本とする。

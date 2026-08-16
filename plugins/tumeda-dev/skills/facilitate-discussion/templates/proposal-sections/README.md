# 提案section pattern

このdirectoryは、discussion entryの`#### 提案N`本文に使える表示patternを置く。提案内容や判断を生成する正本ではなく、その回の問いへ答える提案を読者へ示す時の開始形である。

## 使い方

1. feedback、調査結果、既存状態から、今回の問いと、それを判断するために提示すべき内容を先に考える。
2. このREADMEから、判断対象を読み手が理解する助けになるpatternを確認する。patternは一つだけ選ぶ分類ではなく、必要なら複数を組み合わせる。
3. 複数案から選んでもらう場合は、各案の重さに応じて`compact-options.md`または`detailed-options.md`をwrapperとして使う。各案の内部には他のpatternを使ってよい。
4. 対応fileを読み、提案内容に合わせて構成を変更して使う。該当patternがなければ、内容に適した段落、固有見出し、表、tree、diff、図等で直接書く。

## pattern catalog

各patternは排他的な種別ではない。認識合わせと選択肢提示も排他的ではなく、選択肢の一案がそれ自体で認識合わせになる。

| pattern | 助ける判断 | 組み合わせ方 |
| --- | --- | --- |
| `complete-state.md` | 判断に必要な完成後の全体を直接見る | 内部にflow、表、tree等を含められる。重い選択肢の各案にも使える |
| `compact-options.md` | 選択肢行とnested listで比較できる複数案から選ぶ | 各案が独立した図、完全状態、複数段落を必要とするなら`detailed-options.md`へ替える |
| `detailed-options.md` | 独立した本文が必要な重い複数案から選ぶ | 各案の内部でcomplete stateや任意の内容patternを使える |
| `process-flow.md` | 順序、分岐、戻り先、循環を持つ思考手順やworkflowを合わせる | 単独でも、complete stateや選択肢の内部でも使える |
| `element-correspondence.md` | 少数の要素を短い共通観点で照合する | 単独でも、complete stateや選択肢の内部でも使える |
| `structure-tree.md` | 見出し、file、directory等の包含・所有・配置を合わせる | 単独でも、complete stateや選択肢の内部でも使える |
| `document-heading-outline.md` | 新規documentの見出し階層と、各見出しが扱う内容へ合意してからdraftを書く | file配置も判断する時は`structure-tree.md`を併用し、合意後は作成された実fileをreviewする |
| `existing-file-local-diff.md` | 既存fileの局所修正について、何を残し、変え、削るかへ合意する | 全追加・削除行と必要contextが読みやすい一つのunified diffに収まる時に使う |
| `file-change-set.md` | 複数file、file間対応、または不可分な複数hunkについて、変更対象と対応、許可・維持・削除・scope外、完了状態を閉じる | 対象内部にはtree、diff、before / after、outline、flow等を使い分ける。独立して採否を変えられる変更は一つへまとめない |

たとえば、思考手順そのものを確認する提案では`process-flow.md`だけを使える。二つのworkflowを比較する提案では、`detailed-options.md`の各案にprocess flowを置ける。二つの完成後document構造を比較する提案では、各案をcomplete stateとして示し、その内部にstructure treeを置ける。新規documentを一案として作る場合は、`document-heading-outline.md`で見出し構造へ合意し、配置も判断するなら`structure-tree.md`を組み合わせる。既存fileの局所修正なら、`existing-file-local-diff.md`で変更対象の全行だけを合意対象にできる。複数fileが一つの変更decisionを作る場合は、`file-change-set.md`で外側の変更集合を閉じ、各file内部にoutline、diff等を選ぶ。

認識定義も認識合わせの対象になる。ただし、定義の示し方は散文、対比、例、境界条件等へ分かれる。再利用できる開始形が具体caseから得られるまでは、分類を埋めるためのpatternを作らず自由構成にする。

## 共通contract

- patternはproposalの表示を助ける雛形であり、診断、選択肢、結論を代わりに考えない。
- `提案N`はその回の問いを判断できる案にする。既決内容は今回の判断に必要な範囲だけ示し、完全性のためだけに再掲しない。
- 完全状態そのものが判断対象なら`complete-state.md`を使い、必要な全体像を省略しない。局所的な問いまで常に完全版へ広げない。
- placeholderやpattern名を機械的に本文へ残さない。
- pattern内の見出しや項目は、提案内容を理解しやすくする時だけ使う。不要な項目を空欄や`なし`として出さない。
- patternの数、組み合わせ、適用順序は固定しない。patternの形を保つことより、一つの提案として理解できる順序を優先する。

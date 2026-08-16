# C11 after候補 v1: 複数fileの意味保持移植を変換台帳で判断する

**位置づけ:** 多数の既存fileを別repositoryへ移植し、repository固有箇所だけを一般化する時、file一覧だけでは見えない意味変更の許容範囲を合意できるか確認するafter候補。共通format案ではない。

**判定:** 成立。`file-change-set`の意味保持移植variationとして受諾

**source:** 非公開の利用先記録から一般化したcase（論点2・3）

sourceの事後比較では、15 fileすべてに例示以外の差分があり、共有化に必要な追加と、意図せず失われた規則が混在していた。ここでは、移植前にどこまで変えてよいかをfileごとに判断できる形へ戻す。

---

## 論点2: project skillを意味を失わず共有pluginへ移植する

**ステータス:** 提案中

**種別:** レビュー指摘

### イテレーション0: file対応と許可する意味変更を先に確定する

#### 提案0

project内の5 skill、5 template、3 agent由来skillを共有pluginへ移植する。移植は要約や再設計ではなく、原本の意味を保った転記をdefaultとする。変更できるのは、次の変換台帳で明示した一般化、host差分、repository context委譲だけとする。

##### 対象fileとdefault contract

原本のbaselineは移植開始時にcommitで固定する。15 fileは、次の対応でtargetへ一つずつ移す。

| file群 | 原本 | target | default |
| --- | --- | --- | --- |
| skill | `design-consult/SKILL.md` | 同名skill | 意味保持 |
| skill | `doc-enricher/SKILL.md` | 同名skill | 意味保持 |
| skill | `steering/SKILL.md` | 同名skill | 意味保持 |
| template | `steering/templates/discussion_entry.md` | 同path | 意味保持 |
| template | `steering/templates/implementation_review.md` | 同path | 意味保持 |
| template | `steering/templates/roadmap.md` | 同path | 意味保持 |
| template | `steering/templates/summary_entry.md` | 同path | 意味保持 |
| template | `steering/templates/tasklist.md` | 同path | 意味保持 |
| skill | `task-design/SKILL.md` | 同名skill | 意味保持 |
| template | `task-design/templates/design.md` | 同path | 意味保持 |
| template | `task-design/templates/discussion_entry.md` | 同path | 意味保持 |
| skill | `think-through/SKILL.md` | 同名skill | 意味保持 |
| agent→skill | `tasklist-executor.md` | `tasklist-executor/SKILL.md` | host形式だけ変換 |
| agent→skill | `test-runner.md` | `test-runner/SKILL.md` | host形式だけ変換 |
| agent→skill | `visual-inspector.md` | `visual-inspector/SKILL.md` | host形式だけ変換 |

`意味保持`は、行数や文言の同一ではなく、見出しが所有する判断、MUST・禁止事項、起動・終了条件、状態遷移、出力形式、失敗例と正例の因果を落とさないことを指す。台帳で許可していない要約、統合、見出しの再編、規則の削除は行わない。

##### 全fileに許可する変換

repository固有のpath、command、固有domainの例は共有pluginへ固定しない。ただし、抽象語へ縮めず、元の例が教えていた操作、データ関係、命名理由、境界、成果物を同じ具体性の一般例へ置換する。

固定pathやcommandが実行時repositoryごとに変わる箇所は、repository contextから得る形へ置換する。単に削除して利用者へ判断を戻さない。

Markdownのfrontmatterやagentからskillへのhost固有形式はtarget hostに合わせて変える。ただし、元手順の順序、入力、完了条件は同時に再設計しない。

##### file群ごとに許可する追加

| 対象 | 許可する追加 | 維持する境界 |
| --- | --- | --- |
| subagentを起動するskill | host別のsubagent起動方法とmodel/context契約 | 元の責務、入力、返却物を削らない |
| repository固有情報を読むskill | repository contextの選択読取とfallback | 元の必須情報を「contextにあるはず」で省略しない |
| remote Git provider処理を持つsteering | provider・branch契約に応じた条件分岐 | 元のissue連携、既存PR検出、完了条件を後退させない |
| plugin配布を扱う箇所 | version、cachebuster、host別更新確認 | task本体の終了条件と混同しない |

追加要件と原本の意味が衝突する場合は、移植の一部として黙って置換しない。衝突する一decisionを別論点へ分け、元contract、追加要件、採る側を比較して判断する。

##### fileごとの変換記録

各fileを変更する前に、次の三つを記録する。

1. **保持する意味:** 見出し、必須規則、禁止事項、状態遷移、出力形式、例が教える因果のうち、targetにも残すもの。
2. **許可された変換:** 固有例の置換、context委譲、host形式、追加要件のうち、そのfileで実際に行うもの。
3. **表示する具体差分:** 機械的一括置換でない箇所は、局所diff、before / after、outlineのいずれかで、何が変わるかを省略せず示す。

この記録は15 fileを一つの定型tableへ無理に押し込まない。短いfileは一つのdiffで示せる。長いskillは見出しごとの保持・変換対応と、変更するhunkのdiffを組み合わせる。exampleだけを一般化するfileは、example単位のbefore / afterを並べられる。全fileが同じ表示方式である必要はないが、15 fileすべてが三項目の判断を通過する必要がある。

##### 完了確認

- 15のsource→target対応がすべて存在し、未分類fileがない。
- 各fileで、許可された変換に対応しない意味差分が0件である。
- 原本のMUST、禁止事項、起動・終了条件、状態遷移、出力形式が、維持または明示合意した置換のどちらかへ対応する。
- repository固有例を一般化した箇所は、元の例が教えていた具体的な因果を保持する。
- host/context/remote Git providerの追加は、追加要件として追跡でき、元contractの暗黙削除になっていない。
- 行数やdiff hunk数は差分検出に使うが、意味保持の合格根拠にはしない。
- 未許可差分が見つかった場合は、実装完了にせず、原本へ戻すか別decisionとして合意する。

#### 提案背景

sourceの初回移植では、15 fileを「共有pluginへ移植する」という一つの作業へまとめた。repository固有箇所を一般化する必要は示されていたが、原本の何を保持し、どの意味変更を許可するかがfileごとに可視化されていなかった。そのため、一般化と同時にskill本文やtemplateが要約・再構成されても、作業の完了条件から逸脱を検出できなかった。

C9は一対一のpath移動と機械的なimport補正、C10は一つのfileから複数責務への分割を扱う。このcaseは、sourceとtargetが概ね一対一でも、本文の意味を選択的に変換する。path対応や完成後treeだけでは、許可された一般化と不許可の意味変更を区別できない。

必要なのは15 fileの全文をdiscussionへ複製することではない。原本commitをbaselineにし、defaultを意味保持へ置き、例外として許可する変換を列挙する。そのうえで、機械的でない箇所だけをfileの内容に応じたdiff、before / after、outlineで示せば、全対象を省略せず、同じ表示形式へ収斂させずに判断できる。

#### 提案0へのフィードバック

**結果:** 母集団への一巡適用で受諾

単体の合意gateにはせず、C9・C10との共通骨子、既確認caseへの戻り検証を含む論点4の提案20として受諾した。

### 決定

このafterを`file-change-set`の意味保持移植variationとして採用する。全fileを同じ表示方式へ揃えず、source→target対応、defaultの意味保持、許可する変換、file別の具体差分、未許可差分0件で変更集合を閉じる。典拠は`task-design-discussion.md`論点4のイテレーション20とする。

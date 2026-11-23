### データモデル

<!--
静的な視点: 「完成後のdataがどう表現されるか」を具体的な行と複数caseで示す。

なぜ必要か:
- field名と型だけでは、その表現が正常、未設定、複数要素、取得不能等のcaseを破綻なく保持できるか分からないため。
- schema定義だけで整合性を確認したつもりになり、実装中にplaceholder、区切り、null、既存dataとの互換を決めることを防ぐため。

NG:
保存済み文書:
- Source URL: string
- Author: string
- Content: text

具体的な記述例:
| Source URL | Author | Content |
| --- | --- | --- |
| https://example.com/articles/42 | editor-a | First section... |
| https://example.com/articles/43 | editor-b | Overview...\n---section---\nDetails... |

case:
- 単一section: Contentに1 section
- 複数section: Contentに「---section---」区切りで連結
- 取得不能section: 「[unavailable]」placeholderで埋める

case選択のMUST:
- 正常な完成状態だけでなく、未設定・空、既存の別pattern、境界・失敗を含める。
- relationまたはstateを追加する場合、作成後だけでなく更新・削除・関連なしの既存rowも示す。
- 抽象的な「保持できる」ではなく、実際に入る値で示す。

更新・削除caseと不変条件のselection gate:
- 今回relationまたはstateを追加・変更し、更新・削除後のrow、cascade、保持値が一意でなければ専用tableを使う。
- 今回の変更がuniqueness、順序、relation、既存値との互換へ影響するなら、不変条件を具体値または判定可能なruleで示す。
- 今回変わらないoperationと不変条件を機械的に列挙しない。該当しない専用blockは差し込まない。

owner境界:
- data sectionはoperation前後の具体値、row／relationの有無、cascade、保持値、全caseを貫く整合条件を所有する。
- actor操作、call順序、停止stepはinteraction flowが所有する。data sectionへsequenceを複製しない。

判断基準:
- 想定する複数caseが、その表現で破綻なく入るか。
- null、空、placeholder、既存値との互換を実装者が決めずに済むか。
- 操作フローに出る状態変化と、このrow例が矛盾していないか。
-->

**{table / collection / state名}:**

| id | {field 1} | {field 2} | {relation / state} |
| --- | --- | --- | --- |
| {具体値} | {具体値} | {具体値} | {具体値} |
| {別caseの具体値} | {具体値} | {null / 空 / placeholder等} | {具体値} |

**典型case:**

- {正常な完成状態}: {どのrow・値で表現されるか}
- {未設定・空}: {null、空文字、rowなし等のどれで表現するか}
- {既存の別pattern}: {今回の変更後もどう維持されるか}
- {取得不能・失敗}: {保存可否、placeholder、状態不変条件}

**更新・削除後のdata:**

| operation | 操作前 | 操作後 | relation・cascade・保持値 |
| --- | --- | --- | --- |
| {更新または削除} | {具体的なrow・state} | {具体的なrow・state} | {関連row、cascade、保持する値} |

**不変条件:**

- {どのcaseでも維持するrelation}: {具体的な判定rule}
- {uniqueness、順序、既存値との互換}: {破綻を検出できる条件}

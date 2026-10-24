# 複数対象の変更集合を閉じて示す

## 使用条件

複数file、file間の対応、または一file内の複数箇所が、一つのdecisionとして不可分に変わる時に使う。対象名だけでなく、今回の変更へ含むもの、beforeからafterへの対応、変えてよい範囲、維持・削除・除外する範囲、完了状態を判断できる変更集合にする。

次のいずれかに該当する時に選ぶ。

- directoryまたはfileを移動し、旧配置の削除、本文補正、consumer更新まで一decisionで扱う。
- 一つのfileを分割または複数fileを統合し、旧責務を新しい配置へ対応させる。
- 複数fileを別の場所・形式へ移植し、保持する意味と許可する変換をfileごとに確定する。
- 一つの意味変更が、離れた複数hunkまたは複数fileを不可分に変更する。

一つの既存fileの局所修正が読みやすい完全diffに収まるなら`existing-file-local-diff.md`を使う。新規documentの主な判断が見出し構造なら`document-heading-outline.md`を使う。複数の変更が独立して採否を変えられるなら、一つの変更集合へまとめずdecisionを分ける。

## 組み立て方

最初に、このdecisionへ含む変更対象を漏れなく列挙する。tree、file action一覧、source→target表等から、配置と対象範囲に合う表現を選ぶ。

次に、beforeの何がafterのどこへ対応するかを示す。対応の主単位はcaseで変えてよい。

- 一対一移動ではfile pathを対応させる。
- file分割では旧fileの責務、contract、testを新fileへ対応させる。
- 意味保持移植ではsource fileが持つ規則、禁止事項、状態遷移、出力形式等をtargetの保持・変換へ対応させる。

対象ごとの具体的な変更は、機械的置換、unified diff、before / after、annotated outline、flow等から選ぶ。全対象を同じ表示方式へ揃える必要はない。判断に必要な変更を省略しないことを共通条件にする。

最後に、変更集合の境界と完了状態を示す。判断に必要なら、次を内容固有の見出しや説明へ含める。

- 変更してよい内容と維持する内容
- 削除後に存在してはいけない旧file、旧path、旧参照
- 今回のdecisionへ含めない変更
- 対象漏れ、意図しない意味変更、scope外diffを検出する確認方法

これらを固定見出しとして毎回すべて出さない。たとえば旧pathがない新規file群では、旧path不在を空欄で表示しない。caseの変更集合を閉じるために必要な内容だけを、読者が理解しやすい順序で構成する。

## template

````markdown
{このdecisionで変更する対象と、変更後に成立させる状態を示す。}

{必要なら、完成後treeまたはfile action一覧を示す。}

{beforeのfile、責務、contract、意味等から、afterの配置・内容への対応を示す。}

{各対象の変更内容を、機械的置換、完全diff、before / after、outline、flow等で省略せず示す。}

{判断に必要な場合だけ、維持する内容、削除する旧状態、scope外、完了確認を示す。}
````

placeholderや上記の説明順をそのまま可視本文へ残さない。対象に合う固有見出しへ変え、一つの提案として自然に読める順序へ組み直す。

## variation

### 一対一のdirectory移動

完成後treeで旧directory不在まで示し、全fileのsource→target対応、階層変更に伴う完全なimport置換、外部consumer、移動から説明できないscope外変更を続ける。file本文が同一なら旧新の全文を複製せず、許可する補正だけを完全に示す。

### 一fileから複数fileへの分割

完成後treeに加え、旧fileの責務、fallback、test、公開APIを新しいどのfileへ移すか対応させる。分割後のfile間flowと、consumerから見た公開contractの維持を示す。

### 複数fileの意味保持移植

source→target台帳を作り、defaultを意味保持とする。一般化、host形式、context委譲等、許可する変換だけを例外として示す。機械的でない変更は、fileごとにdiff、before / after、outline等を選び、未許可の意味差分がないことを完了条件にする。

## ユースケース

- `src/legacy-notifications/`を`src/notifications/legacy/`へ移し、内部importと全consumerを更新したうえで旧directoryを残さない。
- `src/orders/service.ts`をcommand、query、mapperへ分割し、旧関数の責務とtestを新fileへ対応させながら既存の公開importを維持する。
- project固有の運用規約群を共有packageへ移植し、固有例だけを一般化しながら、MUST、禁止事項、状態遷移、出力contractを保持する。

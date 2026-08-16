# before / after v1の全iteration論点coverage（一般化済み検証資料）

## 目的

`curated-failures-before-after.md`で得た共通骨子とvariantを、キュレーション元以外の全iteration論点へ仮適用する。単にvariant名を付けられるかではなく、当事者が現在の判断と変更経路を読めるafterを作るために不足する情報型がないかを見る。

## variant記号

| 記号 | variant |
| --- | --- |
| P | 同じ診断のまま提案を修正 |
| D | 診断を更新し、修正scopeも変える |
| R | evidenceまたは具体的counterexampleで前提・案を反証し、置換する |
| X | decisionを分解し、焦点を移す |
| M | scopeまたはtopicを移動する |
| O | 判断対象に応じた具体像を追加する |

## 26論点への仮適用

| ID | iteration論点 | 数 | 主な変化 | 適用variant | coverage | 確認結果 |
| --- | --- | ---: | --- | --- | --- | --- |
| N1 | 参照すべき既存仕様の洗い出し不足 | 3 | 特定成果物依存を抽象化しすぎ、trigger型 + 具体例へ修正 | D, P, O | 可 | C2の診断更新とC1の抽象・具体で読める |
| N2 | 振り返りの精度の低さ | 3 | task追加からformat定義へ広げ、気づきのownerを移し、問いを具体化 | D, M, P | 一部 | Mを使えるが、scope移動のcurated afterがまだない |
| N3 | 提案の精度の低さ | 5 | 契約を5段階で累積 | P, D, O | 可 | C1の直接case |
| N4 | `duration_days`の要否 | 1 | dataから導出できる値を保存する案の検証 | P, O | 可 | data relationを現在判断側へ置けば足りる |
| N5 | `+` button挙動統一 | 3 | 共通component案を撤回し、modal内部差替え、共通contentへ修正 | P, R, O | 可 | code before / afterと変更しない範囲で読める |
| N6 | shared skill正本とrepository固有設定 | 1 | personal marketplace依存をrepository所有接続へ修正 | P, O | 可 | runtime / file配置previewで読める |
| X1 | features層の命名とdomain modeling | 1 | directory名だけでなく、将来phaseの型関係を追加 | P, O | 可 | type relationとstructure previewで読める |
| X2 | 設計判断を実装へ流した | 3 | 作業level診断からskill完了条件へ深掘り | D, P, O | 可 | C2の直接case |
| X3 | thread本文取得方法 | 4 | 採用案がaccess制約で無効化され、旧候補へ戻って制約追加 | R, P, O | 可 | C3の直接case |
| X4 | 増分同期判定方法 | 2 | 具体的取り残しcounterexampleで案を修正し、不要な上限を撤回 | R, P, O | 可 | Rを技術evidenceだけでなくcounterexampleにも使えば読める |
| X5 | UI component分割 | 1 | component path命名を修正 | P, O | 可 | structure previewで読める |
| X6 | designとdiscussionの役割分担 | 1 | grep完了判定を、意味を読む目視reviewへ修正 | D, P | 可 | 診断更新 + policy契約として読める |
| X7 | MVP scopeと進行形式 | 1 | MAYを非実装と誤読させたscope表現を、撤退順序へ修正 | P, O | 可 | scope表またはpriority relationで読める |
| X8 | 「進化の種」の概念定着 | 4 | document構造を複数回全面改訂し、8 feedbackを統合 | P, O | 可だが重い | document previewで現在像は出せる。各feedbackをnamed changeへまとめる粒度の検証が必要 |
| X9 | 詳細画面の存在意義とURL構造 | 1 | page遷移案をstate維持できるmodalへ修正 | R, P, O | 可 | interaction flow + screen previewで読める |
| X10 | 画面イメージの保存owner | 1 | README owner pathをappからcomponentsへ変更 | P, O | 可 | C5の直接case |
| X11 | contextを各skillへ引き渡す | 2 | 共通全読取を選択読取へ変更し、保存分類を表示から除去 | P, O | 可 | policy契約 + context構造previewで読める |
| X12 | runtime capabilityをhost名から分離 | 3 | agent / skill境界、model pin、host別責務を順に修正 | D, P, O | 可 | current policyを内容別variantへ分け、変更経路をnamed stepにできる |
| X13 | generic steeringとpublish workflow | 3 | repository手順、provider抽象、remote Git provider adapter責務を順に修正 | D, P, O | 可 | workflow / runtime / code structureの複数variantで読める |
| X14 | context instance初期移行 | 1 | 旧agent記述を反証し、確認済みfactsだけへ限定 | R, O | 可 | evidence / 無効情報 / 採用factsで読める |
| X15 | nested subagent実行graph | 1 | root限定前提を撤回し、direct parent edgeへ一般化 | D, P, O | 可 | workflow graph previewで読める |
| X16 | Git provider scope | 1 | 未実装provider抽象を撤回し、remote Git providerだけへ限定 | R, P | 可 | scope反証と現在の能力境界で読める |
| X17 | context bootstrap owner | 1 | consumer分散ownerをmaintainerへ移す | D, M, O | 可 | owner tableとworkflow previewで読める |
| X18 | host配布更新の完了条件 | 1 | unrelated skill削除と9 skill固定を追加 | P, O | 可 | file deliverable + host別runtime結果で読める |
| X19 | context / model / remote Git providerの一括論点 | 3 | 3 decisionへ分解して順に確定 | X, P, O | 可 | C4の直接case |
| X20 | 再発防止のowner | 2 | 2項目を分離し、一方採用、他方は既存ruleで足りるため棄却 | X, R, M | 一部 | decision一覧で状態は読めるが、partial decisionと残件のcurated afterがない |

## v1の判定

### 26論点の意味型coverage

- `coverage: 可`: 24論点
- `coverage: 一部`: 2論点
- `coverage: 不可`: 0論点

現時点のvariantで全論点を分類はできる。ただし、分類できることとafterが実際に読みやすいことは同じではない。次の2型は、キュレーションcaseとしてbefore / afterを作らず、table上の類推だけでcoverageを主張している。

1. scopeまたは情報ownerを別topic・別artifactへ移すcase
2. 複数decisionの一部を決定し、一部を残件化し、最後に棄却するcase

### iteration論点外から見つかったgap

後続の別論点で用語が`Template`から`Pattern`へ変わり、先行論点のtreeとdecisionへ読み替え注記を加えたcaseがある。これは同一entry内のiteration variantだけでは扱えない。

- 必要になり得るvariant: 後続decisionによるsupersede
- 必要な情報: 置換された判断、置換先topic、現在有効な語彙・契約、先行topicに残る判断

## 次のキュレーション候補

- C6: partial decision + 残件 + 最終棄却
- C7: topic間supersede
- C8: scope / owner移動

この3件を追加するかは、まずC1〜C5のafterが本当に読みやすいかを確認してから決める。C1〜C5の骨子自体が悪ければ、gapを同じ骨子へ足しても改善にならない。

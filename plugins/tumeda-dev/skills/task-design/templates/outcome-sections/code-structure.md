### codeの責務配置と依存構造

<!--
layer、component、module、class、directory、公開入口、dependency direction、全体call relationを
変える時に使う。単なるfile移動、同一責務内のprivate refactoring、algorithmの詳細化では選ばない。

設計とは、細かな処理をorchestrationして全体を構成すること。
責務を示すname、配置、公開入口を上から追い、処理の流れと責務境界をcode内部の全読みに
戻らず理解できる状態を先に作る。

なぜ必要か:
- 責務が太り、影響範囲を毎回code全体から再調査する状態を防ぐため。
- directoryやmodule名だけがあり、何を置いてよいか、何へ依存してよいかが実装者ごとに
  変わる状態を防ぐため。
- nameとmodule boundaryは長く残るため、実装中の都合で決めないため。

NG:
- 「とりあえず lib/ に置く」
- utils/、helpers/等、domain責務を宣言しない場所へ集める
- class一覧だけを書き、各ownerが何を行わず、どこへ依存するかを書かない
- private helper、algorithm、処理行を網羅して構造設計とみなす

具体的な記述例:
src/features/document/source/  ← 外部文書の「取得元」を組み合わせるmodule
src/lib/document-api/         ← 外部文書API client（features非依存）

- featuresはsourceを組み合わせる場所
- libはexternal APIを抽象化する場所
- importDocument → DocumentSourceClient.fetchDocument → DocumentRecordBuilder.buildを追うだけで
  flowとowner境界が読める

selection gate:
- codeを開いて処理を追わず、配置と公開入口から責務分担、依存方向、全体orchestrationを
  理解するための構造が変わる場合に選ぶ。
- 同じ責務とdependencyを保つrenameやfile移動だけでは選ばない。
- caller-facingなinput、result、error、side effect保証だけが変わる場合は`caller-contracts.md`を選ぶ。

owner境界:
- このsectionはlayer、component／module／class責務、directory、置いてよい／置かないもの、
  dependency direction、公開入口、全体call relationを所有する。
- callerが依存するidentifierとsignatureは`caller-contracts.md`を正本とする。このsectionでは
  入口として参照するだけで、argument、result、error、side effectを複製しない。
- domain概念の定義、ubiquitous language、bounded contextを選ぶ方針はこのsectionで決めない。
- data schema、runtime／deployment条件、security、performanceはそれぞれのownerへ送る。

判断基準:
- directory name、module名、class名がdomainまたはtechnical boundary上の責務を表すか。
- 配置だけで「ここに何があり、何があってはいけないか」が分かるか。
- dependency directionと公開入口が一意か。
- public entryからresult ownerまで、責務名を追うだけで全体orchestrationを説明できるか。
- algorithmやprivate helperの説明へscopeを広げていないか。
-->

**配置と責務:**

```text
{path/to/module}/  ← {担う責務}
{path/to/another}/ ← {担う責務}
```

**境界のrule:**

- `{module A}`は`{module B}`へ{依存してよい / 依存しない}
- `{module}`に置いてよいもの: {責務}
- `{module}`に置かないもの: {隣接ownerへ送る責務}
- 公開入口: `{caller-contract identifierへの参照}`

**全体のcall関係:**

```text
{Caller-facing entry} -> {Owner A} -> {Owner B} -> {Result owner}
```

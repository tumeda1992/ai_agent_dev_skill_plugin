# 実装後レビュー

## feedback原文

> .agents/skills/steering/SKILL.md の差分をgitで見てみなさい。移植という、steeringとtask-designの合算でできあがるものがおなじになる中で中身だけ移動することにもかかわらず、steeringでの修正が、task-designに移る以上に削減されすぎて淡白になりすぎじゃない？ 意味的に差分を見てみてこれで移植完了と言えるの？

## 原因

owner境界と新しいroadmap構造の整合を主な完了基準にし、旧steeringの各意味単位が変更後ownerへ到達したかを検査していなかった。`421行から172行へ減った`こと自体ではなく、読み取り調査、artifact lifecycle、tasklistの失敗防止、実装後reviewなどに移管先のない削除が存在したことが問題である。

## 決定

現状を移植完了としない。旧steeringの意味単位をmigration ledgerへ分類し、caller/orchestrationはsteering、設計前調査とartifact lifecycleはtask-design、tasklist作成判断は`tasklist-design.md`、実行時不変条件はtemplateとtasklist-executorへ適応して戻す。新構造と矛盾する契約だけを理由付きで廃止する。

## ネクストアクション

同じworking directoryでdesignとtasklistを再開し、修正・validator・Git意味差分監査を完了してからユーザー確認へ戻る。commit、push、PRは再確認後まで行わない。

## 論点2: function migrationで挙動・意味・細かな再発防止文言を全量維持する

**ステータス:** 解決済み

**種別:** 再レビュー指摘、移行完了判定、function migrationの再発防止

### 起点となった原文

> plugins/tumeda-dev/docs/common_standard/function_migration_policy.md を作って、今回のことが再発しないように明記したい。挙動や意味を全く変えずに全量を維持したうえでのリファクタリング。多少非合理でも、ユーザが提案したこと、提案して合意されたこと以外は機能的な欠落を許さないこと。意訳されて丸められたものに、長年のメンテナンス上痛みを伴い再発防止をするための細かいニュアンスの文言変更があるかもしれない。スモークテストが通ってもそれはその対象のポテンシャルの1%だけで通ったブラックボックステストであり、移行以前にカバーしてきた顕在化したポテンシャルを無為に捨てないためにホワイトボックス的な検証が必要。どうしても必要であれば1つ1つユーザに問い合意することが必要。特に章として立っていたものを薄い箇条書きの1つに載せて移行しきったとかは形式的な移行の悪癖。
>
> これを書いていたのがあなたの作業中なんだけど、あなたの移行漏れ修復作業、直したふりして、既存機構を前提として、ちょちょっと直しただけで、私の指摘やあなたが穴として認識した漏れを直しているように思えないんだけど

### 合意前に解く問い

1. function migrationを、改善・要約ではなく挙動と意味を全量維持するrefactoringとしてどの粒度で定義するか。
2. 旧章、箇条書き、具体例、失敗例、判断質問、強調表現の一つずつについて、維持・移動・変更をどう証明するか。
3. 非合理に見える記述でも、ユーザーが明示提案または合意していない限り変更・削除しないgateをどう置くか。
4. smoke等のblack-box検証とは別に、移行前の顕在化した全contractを照合するwhite-box検証をどう必須化するか。
5. 変更が不可避な各意味単位を、どの時点で一つずつユーザーへ提示し合意するか。
6. 章を薄い箇条書きへ縮退させて形式上の移行だけを完了する悪癖を、構造・情報量・意味の検査でどう防ぐか。
7. 直前の移行漏れ修復が、旧機構を前提にした表層補修ではなく、実際に認識済みの欠落を全量回復したか。

### 現時点の制約

- この論点の設計が合意されるまで、`function_migration_policy.md`と移行対象skillを一気に修正しない。
- smoke、validator、行数、見出しの存在だけを移行完了の根拠にしない。
- 直前の修復結果は完了前提にせず、Git上の旧内容と現在の全移管先をwhite-boxで再照合する。

### 決定

移行前revisionをbaselineとして旧sourceを全量再読し、構造ledgerとcontract ledgerを作ってsource-firstで再構築する。意味単位は`KEEP | MOVE | ADAPT | CHANGE | RETIRE`へ分類し、変更・廃止はユーザーが変更として明示指示したもの、または実装者の提案へユーザーが明示合意したものだけに限定する。Git削除行の逆引きと全ownerの通読をblack-boxより先に完了する。

このprocessを今回の修復で実行し、`適合 68 / 合意済み追加 4 / 明示廃止 1 / 未監査 0 / 未分類削除 0 / 未分類追加 0`まで照合した。旧contractから導いた四scenarioも最終的にPASSした。再発防止は`plugins/tumeda-dev/docs/common_standard/function_migration_policy.md`を共通正本とし、plugin固有のmigration policyは機密性・汎用化・方向・移植元依存だけを追加する。

共通規範のread-only監査で、未合意の新規contractを検出する逆引きと、固有情報除去・意味保存が両立しない場合の停止条件が不足していると判明した。分類へ`ADD`を追加し、Git追加行と移行後全contractを旧contractまたは合意済み`ADD`へ逆引きするgateを設けた。plugin固有policyには、機密情報を残さず、外出し・意味保存`ADAPT`・合意済み`CHANGE | RETIRE`のいずれでも解けない場合は移植を停止する規則を追加した。

修正後のfocused再検証では両方がPASSした。今回のledgerにも追加path・hunk単位の逆引き索引を追加し、自己申告だけでなく第三者が`未分類追加 0`を再検算できる形にした。

章を薄い箇条書きへ縮退する形式的移行、細かな再発防止文言の意訳、失敗実装への表層的な継ぎ足し、smokeやvalidatorだけによる完了判定を明示的な失敗patternとする。

## 論点3: doc-enricherが新規documentを提案する判断

**ステータス:** 未決（別taskとして保留）

**種別:** doc-enricherのscope変更、document配置判断

### 起点となった原文

> また、doc-enricherはREADMEや既存のdocsだけでなく、新しいドキュメントを作ることも含め検討してほしいな。そう判断するまでの思考手順も合わせて考えたい。

### 合意前に解く問い

1. `doc-enricher`が新規document作成も候補にできる条件は何か。
2. README、既存docs、新規docsのどこへ置くかを、どの思考順序で判断するか。
3. 新規documentの提案と、ユーザー合意後の実作成の境界をどう定義するか。

### 現時点の制約

- この論点の設計と`doc-enricher`の変更は別taskで行う。
- function migrationの失敗分析へ、document配置一般の判断を混在させない。

## source-first再構築後の補助scenario検証

white-box監査完了後、旧contractから導いた四つのscenarioをread-only runnerへ渡した。standalone task-designとsteering leaf dispatchはPASSだった。roadmap構造変更とGitHub公開actionは、次の曖昧さにより初回FAILとなった。

### roadmap構造変更の戻り先

`roadmap-design.md`はroadmap plan構造へ戻って親design影響を判定する一方、task-design本体はroadmap phase構造変更を一律にdesign Step 3へ戻していた。roadmap構造自体はexecution planであり、親designを変えない修正までdesign loopへ送るのはD1の分水嶺と一致しない。

task-design本体、roadmap-design、steeringを次へ統一した。

1. phase identity、目的、scope、scope外、DoD、依存、親DoD coverageの変更はroadmap plan構造へ戻す。
2. その変更が親designの完成後の姿、要件、設計根拠、公開API、module境界へ影響するか判定する。
3. 親designへ影響する場合だけdesign Step 3へ戻す。
4. 子path、status、完了日だけならsteering runtimeで扱う。

### GitHub公開actionのplan時条件とruntime条件

D14の「commitが一件以上」をplan作成時点の実commitと読むと、commitはtasklist実行中に初めて作られるため、初回planへpush・PR sectionを生成できない。D14の意図はlocal commit条件とGitHub公開条件の分離であり、公開workflowを不可能にすることではない。

条件を二段階へ明確化した。

1. plan生成時: GitHub公開条件、実行可能なcommit taskが一件以上、公開可能なnon-default branchを確認してpush・PR sectionを生成する。
2. runtime: commit taskの結果としてlocal commitが実際に一件以上存在することを確認してからpush・PRを実行する。一件もなければ実行しない。

この修正はD14の条件を緩和せず、plan時の予定とruntimeの実績を別stateとして扱う。

### focused再検証で見つかったroadmap field列挙漏れ

上記二点だけを別のread-only runnerで再検証した結果、GitHub公開actionはPASSした。roadmap構造変更もtask-design本体とsteeringでは七つの構造fieldが一致していたが、`roadmap-design.md`末尾のfeedback routingだけ、`phase identity`と`親DoD coverage`が列挙から漏れていた。

これは新しい設計判断ではなく、同じfileのfield ownershipと他の二つの正本に既にある七field契約の転記漏れである。feedback routingの列挙を`phase identity、目的、scope、scope外、DoD、依存、親DoD coverage`へ揃え、再度focused scenarioで確認する。

修正後のfocused再検証では、roadmapの差し戻し契約とGitHub公開flowの双方がPASSした。これにより、旧contractから導出した四scenarioはすべて成立した。

# 内部検討記録: モデル分担と不在中の自走

**discussion:** [task-design-discussion.md](task-design-discussion.md)

本記録は論点2・3の現物調査と設計判断を扱う。専用logへの分離が調査後になったため、実施前に保存済みだったという扱いはしない。実際のtool結果と担当間の通知から再構成し、利用者の発言を補完しない。

## 開始context

Solに必要な方針・ハンドリング・結果監督と、Terraへ委譲できる実作業を分ける要求がある。応答できない間の自走は別skill化が明示された。名前・配置・状態の具体化は設計担当の作業であり、追加の選択確認によって既存の依頼を止めないと引継ぎownerが指示した。

<a id="topic-2-iteration-0"></a>

## 論点2・イテレーション0: 役割と既存model契約を両立させる

### 調査: 正本profileとownerの現物

Terra担当がread-onlyでruntime-model-profiles.md、runtime-execution-contracts.md、steering、task-design、executor、test-runner、visual-inspector、exhaustive-reviewを調べた。変更前のprofileはmain=host default、child=Sonnet相当、Codex child=標準coding modelと記載し、Sol/Terraの役割が明確でなかった。Codex節は起動と待機を示すが、profileの要求するmodel指示を持っていなかった。

high-reasoning-reviewはAstra相当の高推論reviewを独立して指定していた。task-designのOpus指定は既存の品質契約であり、単純な全置換は廃止を含む。logical ownerはexecutor、physical launcherはhost adapterと明確に分かれていた。

### 判断: 既存contractを保持する具体化

Solの役割とTerraへ委譲できる作業をprofileに集約し、adapter参照を補う。全model名の機械的置換はしない。利用者の委譲許可は高推論reviewの廃止を含まないため、その指定を保持する。この区別は引継ぎownerへ報告し、ownerは利用者へ説明済みとして反映を指示した。

構造上はmodel選択の正本を増やさず、責任を変更しない。作業の事実収集をTerraへ委譲できるようにしても、designの方針判断とdiscussion ownershipはSolに残る。

<a id="topic-3-iteration-0"></a>

## 論点3・イテレーション0: 自走の入口と承認境界

### 判断: 単独入口と元ownerの両立

別skill化には利用者の現在の単独利用要求がある。executorだけの内部modeにすると任意のcommand実行workflowで使えず、この要求を満たさない。unattended-executionを単独入口とし、元workflowへ結果を返す一つのloopにする。

runtime-execution-contractsには実行環境gateによる停止が既にある。拒否操作を停止する契約は維持し、独立作業へ進むことを参照として追加する。元のcheckboxやlogical ownerは移動しない。新しい全体状態fileは既存正本と競合するため設けない。既存記録がなければ、操作ごとの保留だけをapproval-deferrals.mdへ保存する。

### 検証: 許可判定のcase

既承認の通常操作はそのまま進める。require_escalatedを使っていても、確認済み保存prefixで自動許可されるなら人の新承認待ちと扱わない。prefix適合が不明なら許可探索のためにpromptを発火せず保留する。ただし、上位指示が承認呼出しを要求する場面では上位指示を優先する。

広いnode prefixや別toolで同等の拒否操作を通すcaseは迂回として拒否する。独立作業がなくなれば未完了を返し、承認待ちを取消完了や成功へ変えない。復帰時には実承認と最新状態を確認する。これらの期待値はdesignへ反映した。

### skill-update-review: 設計時の切り出し

新skillは承認判定・保留・独立作業選択・返却という一つのloopを持ち、内部に別の独立工程を抱える構造ではない。追加の内部分割候補なし。単独skillとしての分離は利用者の要求により今の作業で実施する。

model selectorを独立した新skillへする案は、状態や完了を持つ工程ではなく既存profileのadapter規則なので候補にしない。review境界も既存の指摘・適用workflowの判断条件であり、新たな独立状態を持たない。編集後は実物のskillと内部指示の全体をTerraに明示reviewさせ、結果をSolが監督する。

## 元作業の取得と設計の検査

今回のexactなworking directoryにtemporary-overrides directoryがないことを実測した。cacheの.codex-plugin/plugin.jsonは8.2.5。consumerはtask-design、think-through、facilitate-discussion、skill-update-review、document-reviewで、対象は今回の三提案の設計と記録。状態はnoneであり、取得失敗を指示なしと誤認していない。

安定contextはtask-design固有項目と直接使う共通項目をmaintenance-plugin-contextの選択範囲で解決した。日本語本文、skill/docs境界、移植時の固有情報除去、validatorと全体三検証commandを使う。安定context instanceは変更していない。

designの機械検索ではTBD等の未決表示はゼロ。通読では三件のpolicy、workflow、source配置、受入caseが互いに矛盾せず、元の権限とsingle writerを保持することを確認した。source反映待ちがあるため、task-design全体の完了とはまだ報告しない。

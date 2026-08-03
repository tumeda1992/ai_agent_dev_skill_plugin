# Roadmap design

このfileは外部referenceではなく、長さのために`SKILL.md`から分割したtask-design本体の一部である。composite判定後、`roadmap.md`を作る直前に先頭から末尾まで完全に読む。

## 入出力とowner

- 入力は同じ`working_dir`の合意済み`./design.md`である。
- 出力は同じdirectoryの`roadmap.md`だけであり、`tasklist.md`と併存させない。
- task-designはroadmapの構造fieldを設計・自己review・ユーザーreviewする。
- steeringだけが実行時の運用fieldを更新する。task-designは子steeringを作成・bindingせず、statusや完了日を更新しない。
- roadmapはtasklist-executorが誤って拾わないよう`tasklist.md`という名前にしない。
- roadmapのphase構成と子steering pathはroadmapを正本とし、月次`summary.md`へ複製しない。summaryはslug、概要、statusだけを持つ。

## Roadmapを選ぶ条件

roadmapは「phaseが多い」時に選ぶものではない。一つのtasklistで親design全体を実行できず、相互に区別できる二つ以上の子design loopが必要なcompositeだけに使う。

- 二つ以上の子scopeを持つ。
- 各子scopeは親scopeより厳密に狭く、親と同一scopeではない。
- 子scope全体と各DoDにより親designの全DoDを満たす。未担当、重複、境界の曖昧さを残さない。
- 依存関係はcycleを持たないDAGにする。依存はstable phase identityで記述し、一覧順だけへ暗黙化しない。
- 一つだけの子、工程数が多いだけの分割、backend / frontend等のlayer名だけで切った分割を禁止する。
- 各phaseは子task-designが親より狭い上位制約として受け取れる具体性を持つ。
- 子task-designはleafならtasklist、さらにcompositeならnested roadmapを返せる。再帰してもscopeが必ずstrictly narrowerになるようにする。
- 各phase完了時点でappまたは成果物が正常に利用できる状態を保つ。途中phaseの完了を、後続phaseがなければ成立しない壊れた状態として設計しない。

大きすぎるtaskをroadmapに変える場合、このroadmapでは子scopeの目的、境界、DoD、依存まで設計する。子の実装taskを親へ重複記載せず、個々の詳細は対応する子steeringのtask-designで扱う。過去の一例として、日付付きfeature directoryの親roadmapから複数の子steeringを分けた運用がある。過去例のpath形式を固定pathとして推測しない。

## Field ownership

### task-designが所有する構造field

- roadmap全体の目的と、複数の子scopeへ分ける意味的理由
- 並び替え後も参照できるstable phase identity
- 各phaseの目的、scope、scope外、DoD
- 依存phase identity
- 親designのどの完了条件を担うか
- 依存phaseの結果を子task-designでどの制約の解消に使うか

### steeringだけが更新する運用field

- 子steering path
- `未着手 | 進行中 | 完了`のstatus
- 完了日

運用fieldの初期値は`未割当`、`未着手`、`未完了`とする。これらはruntime stateであり、`roadmap_ready`時点のTBDではない。実行中に構造fieldを変える必要が出た場合、steeringは直接変更せず、同じ`working_dir`でtask-designを`create_working_dir=false`として再開する。

## 依存結果とTBD

roadmap作成途中では、解消対象を可視化するためにTBDを使える。ただし`roadmap_ready`を返す前に、目的、scope、scope外、DoD、依存、親DoD coverageに残るTBDをすべて解消する。

前phaseの実行結果によって後続phaseの詳細が決まる場合も、親roadmapの構造TBDとして残さない。後続phaseの目的、scope、scope外、DoD、依存を親roadmapで確定し、次を明記する。

- どの依存phaseの確定結果を`dependency_results`として子task-designへ渡すか。
- その結果を使って子designで解消する上位制約は何か。
- 依存結果が想定範囲外なら、構造変更として親task-designへ戻る条件は何か。

子steeringは、親roadmap path、phase identity、親design path、dependency resultsを一組として子task-designへ渡す。子task-designはこれらを自分の`design.md`の上位roadmap制約へ記録する。

## 全体完了と逸脱記録

roadmap全体の完了は、全phaseのstatusが`完了`で、各phaseに完了日があることから導出する。独立した`全フェーズ完了日`fieldは持たない。

計画からの意味ある逸脱は、直接受領したworkflow ownerが同じworking directoryの`implementation_review.md`へ記録する。roadmapは再設計・再合意で構造が更新され得て、比較可能な当初計画baselineを別途定義していないため、`計画と実績の差分`fieldは持たない。

## 自己レビューgate

ユーザーへ提示する前に次をゼロベースで確認し、一つでも不合格ならroadmapを修正する。

- [ ] phaseは二つ以上か。
- [ ] 全phaseが親よりstrictly narrowerか。
- [ ] 全phaseの完了で親DoDをcoverするか。
- [ ] 未担当scope、重複scope、曖昧な境界がないか。
- [ ] 依存graphはDAGか。
- [ ] 一子roadmap、親と同一scopeの子、単なる工程・layer分割がないか。
- [ ] phase identityは並び替え後も安定して参照できるか。
- [ ] 目的、scope、scope外、DoD、依存が子task-designの上位制約として十分か。
- [ ] 各phase完了時点でappまたは成果物が正常に利用できるか。
- [ ] 依存結果で決まる内容を構造TBDへ残さず、dependency resultsと子design制約へ変換したか。
- [ ] 構造fieldとsteering運用fieldが混ざっていないか。
- [ ] 親DoD coverageが全完了条件を具体的なphaseへ対応付けているか。
- [ ] 同じworking directoryに`tasklist.md`がないか。

## ユーザーレビューとfeedback routing

分割理由、phase、依存、親DoD coverageを短く示し、自然言語で合意を求める。特定の承認keywordを強制しない。

- wordingまたは運用fieldの初期表現だけが変わる: roadmapを更新して自己レビューから繰り返す。
- phase identity、目的、scope、scope外、DoD、依存、親DoD coverageが変わる: roadmapの構造設計へ戻り、親designへの影響を判定する。
- 親designの完成後の姿、要件、設計根拠、公開API、module境界が変わる: `SKILL.md` Step 3へ戻る。
- 単一のdesign loopで十分と判明した: leaf / composite判定へ戻り、plan種別の合意後にroadmapを正本として残さずtasklistへ切り替える。

roadmapの自然言語での合意と、designへ戻る未解消feedbackがないことを確認したら`SKILL.md` Step 6へ返す。task-designはroadmapの子path・status・完了日を更新せず、callerはready resultを受けてorchestrationを行う。

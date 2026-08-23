#!/usr/bin/env bash
# think-through skill の SessionStart 注入
# 全原則をコンテキストに乗せる（cache に乗るので毎セッション 1 回のコスト）

read -r -d '' CTX <<'EOF'
think-through skill 適用中（毎ターン常時注入）。
本体: tumeda-dev:think-through

コア（全場面、core.md）:
- 唯々諾々禁止: ユーザー発言を即反映せず、自分で咀嚼してから応答・反論する
- 修正前合意: file の変更・作成・削除の前に方針を合意する

場面別（主軸）:
- 考え始め（starting_to_think.md）: 事象（具体） → 原因（再発が止まる深さまで） → 提案（合意後に何が変わるか読める） → 検証（目下の課題が解けそうか）
- 指摘・提案の受領（receiving_feedback.md）: 自分で先に考えてから問う
- 議論進行中（advancing_discussion.md）: ロジックツリー上位から再帰。往復コストが高ければ TBD 暫定全体を先に出す
- 抽象を書く（writing_abstraction.md）: 抽象と具体をワンショット。文脈外の具体でも成立するか確認する
- 型・skill・template を直す（updating_types.md）: 今のファイルで正しい形を合意してから型へ反映する
- エラー（handling_errors.md）: 消す前に原因を特定する
- 選択肢の提示（presenting_options.md）: a/b/c か 1/2/3 で答えられる形式にする
- 複数事項・状態変化（ordering_parallel_items.md）: 工程の切れ目で ready を再評価し、確定事項を先に完了する
- variation のある対象（designing_for_variations.md）: 具体 case と方針群を往復し、全 case を扱えるまで帰納する

詳細は docs/think_standards/README.md 参照。
EOF

jq -nc --arg ctx "$CTX" '{hookSpecificOutput: {hookEventName: "SessionStart", additionalContext: $ctx}}'

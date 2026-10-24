#!/usr/bin/env bash
# think-through skill の SessionStart 注入
# 全原則をコンテキストに乗せる（cache に乗るので毎セッション 1 回のコスト）

read -r -d '' CTX <<'EOF'
think-through skill の要約（hook による毎ターン注入）。
これは要約であり、skill の起動ではない。
本体: tumeda-dev:think-through

コア（全場面、core.md）:
- 唯々諾々禁止: ユーザー発言を即反映せず、自分で咀嚼してから応答・反論する
- 修正前合意: file の変更・作成・削除の前に方針を合意する

場面別（主軸）:
- 考え始め（starting_to_think.md）: 事象（具体） → 原因（再発が止まる深さまで） → 提案（合意後に何が変わるか読める） → 検証（目下の課題が解けそうか）
- 指摘・提案の受領（receiving_feedback.md）: 問うか自分で埋めるかは、情報の持ち主で決まる
- 議論進行中（advancing_discussion.md）: ロジックツリー上位から再帰。往復コストが高ければ TBD 暫定全体を先に出す
- 抽象を書く（writing_abstraction.md）: 抽象と具体をワンショット。文脈外の具体でも成立するか確認する
- 型・skill・template を直す（updating_types.md）: 今のファイルで正しい形を合意してから型へ反映する
- エラー（handling_errors.md）: 消す前に原因を特定する
- 既存を消す・残す（questioning_existing.md）: 理由を歴史的経緯と合理的必然性へ分離し、必然性だけを残す
- 案を作る・提示する・選ぶ（making_and_choosing_options.md）: 材料が枯れていないと、案も作れず、選ぶこともできない。提案前に前提・時期・導出元を確かめる。提示は a/b/c か 1/2/3
- 複数事項・状態変化（ordering_parallel_items.md）: 工程の切れ目で ready を再評価し、確定事項を先に完了する
- variation のある対象（designing_for_variations.md）: 具体 case と方針群を往復し、全 case を扱えるまで帰納する
- 叩き台を作る（building_a_prototype.md）: 横展開で検証するまで成立していない。やりやすいところから始めない

この要約が載せているのは think-through の一部だけである。design・tasklist・discussion の
記録形式、論点の立て方、合意の取り方は含まれていない。
.steering/ 配下を読み書きする前に、Skill で tumeda-dev:task-design を起動する。

詳細は docs/think_standards/README.md 参照。
EOF

jq -nc --arg ctx "$CTX" '{hookSpecificOutput: {hookEventName: "SessionStart", additionalContext: $ctx}}'

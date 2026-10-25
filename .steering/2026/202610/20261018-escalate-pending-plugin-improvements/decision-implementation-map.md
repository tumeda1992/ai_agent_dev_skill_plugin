# 設計論点1〜52と実装記述の対応

## 対象と読み方

設計論点は一件ずつ、合意・導出内容、設計への反映先、現在のplugin本体のfileと行へ対応させた。
対象の本体はcheckpoint `1259528`の内容。今回作成したplan-commitsは1〜52の実装へ含めない。
本体の差分比較元は、この実装前の`c148a81`。追加file、追加・変更記述、既存記述の利用を区別する。
行番号は今回確認した現物のもの。各項目の合意元には設計discussionへのlinkも付ける。

「記述対応あり」は記述の所在を確認した意味であり、52件の全条件や実行履歴の無条件合格を宣言しない。
設計書だけへの同期をplugin本体の反映済みと数えず、不足・適用理解の疑義・記録運用の逸脱を分けた。
今回、validate・skill-creator・新しい挙動testは実行していない。

## 対応上の不足と運用の問題

- 論点7・48: 通常読取の索引原文。設計では索引を読むが、実行手順はcheck→currentで、
  current()は範囲本文のchunkだけを返す。内部で索引を構造検査することと議論ownerの原文読取は別。
- 論点11: 四経路の分類はあるが、利用者判断へ戻す具体条件の一部が実行指示へ落ちていない。
- 論点15・49: 訂正と次の問いへの回答が同時に来て前提が変わった場合、その選択を流用しない条件が欠けている。
- 論点2・37: この作業のimplementation_reviewを議論形式で運用せず、実装時の指摘をtask-design論点53へ置いた。
  今回、実装reviewの論点5・13へ移譲・訂正した。
- 論点31・35・38・44: 構造基準の記述はあるが、指摘の妥当性と個別task/全体完了の区別を、
  今回の運用で正しく適用したと断定しない。旧論点53の問題を解消済みとは数えない。

これらの本体不足は、この対応表の作成を理由に勝手に修正していない。
これまでの「Phase1〜10の全条件を満たした」という扱いは、上の不足・運用問題を踏まえて再評価が必要である。
記録修正の所在は[実装review論点13](implementation_review/implementation_review-11-15.md)。

## 1〜52の個別対応

### 論点1: 四領域を独立した担当と処理へ分ける

合意・導出元: [task-design-discussion-1-5.md L38](task-design-discussion/task-design-discussion-1-5.md)。

設計への反映先: [design.md L12](<design.md>)「この変更で実現すること」。

本体の対応箇所:

- [.steering/2026/202610/20261018-escalate-pending-plugin-improvements/design.md](<design.md>) L18（追加file）
  該当記述: `変更は次の四領域。議論・設計・実装の担当は維持し、それぞれが必要な共通処理を呼び出す。`。
- [plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md>) L24（既存記述を利用）
  該当記述: `## 目的と成果`。
- [plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md](<../../../../plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md>) L46（追加・変更記述）
  該当記述: `## 作業先を切り替える前の保留判定`。
- [plugins/tumeda-dev/skills/maintenance-plugin-context/SKILL.md](<../../../../plugins/tumeda-dev/skills/maintenance-plugin-context/SKILL.md>) L23（追加・変更記述）
  該当記述: `## 安定factと暫定指示の依頼を分ける`。
- [plugins/tumeda-dev/skills/skill-update-review/SKILL.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/SKILL.md>) L8（追加file）
  該当記述: `# Skill構造review`。

対応状況: **記述対応あり**。構造reviewは独立した公開skill。保留と暫定指示を一つの管理正本へ統合してはいない。

### 論点2: facilitate-discussion形式の各記録に同じ分割条件を適用する

合意・導出元: [task-design-discussion-1-5.md L110](task-design-discussion/task-design-discussion-1-5.md)。

設計への反映先: [discussion-records.md L8](<design-details/discussion-records.md>)「保存する場所」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/facilitate-discussion/split-discussion.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/split-discussion.md>) L16（追加file）
  該当記述: `通常の新規追加で実論点が10件を超えた時に分割する。既存の長大な単一記録は次の更新機会に移す。handoffの独立構成前には移さず、catch-upと内容把握を終えてから行う。`。
- [plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md>) L80（既存記述を利用）
  該当記述: ``| `discussion_file_name` | 任意。pathを含まないbasename。defaultは `discussion.md` |``。

対応状況: **記述あり・旧運用を今回訂正**。共通処理の記述はあるが、この作業自身のimplementation_reviewを同形式で運用していなかった。今回、記録を修正した。

### 論点3: 元basenameのdirectory・同名索引・5番号の範囲へ配置する

合意・導出元: [task-design-discussion-1-5.md L308](task-design-discussion/task-design-discussion-1-5.md)。

設計への反映先: [discussion-records.md L8](<design-details/discussion-records.md>)「保存する場所」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/facilitate-discussion/resolve-discussion.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/resolve-discussion.md>) L11（追加file）
  該当記述: ``3. 単一file `<directory>/<name>` と、最後の拡張子を除いた同名directory（拡張子なしはbasenameそのもの） `<directory>/<stem>/` を調べる。``。
- [plugins/tumeda-dev/skills/facilitate-discussion/split-discussion.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/split-discussion.md>) L31（追加file）
  該当記述: ``4. 本文は`<stem>-1-5.md`、`<stem>-6-10.md`のように番号5件の範囲へ置く。``。

対応状況: **記述対応あり**。短い別記録の配置は変更しない。

### 論点4: 旧入口を残さず既知の参照を新入口・本文へ追随する

合意・導出元: [task-design-discussion-1-5.md L404](task-design-discussion/task-design-discussion-1-5.md)。

設計への反映先: [discussion-records.md L36](<design-details/discussion-records.md>)「入口を解決する」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/facilitate-discussion/split-discussion.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/split-discussion.md>) L65（追加file）
  該当記述: `既知の旧集合の直接照合と、再実行したcheck-candidate、全ての参照の検証成功を確かめた後だけ原文fileを削除する。候補作成時点で原文を消さない。`。
- [plugins/tumeda-dev/skills/facilitate-discussion/split-discussion.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/split-discussion.md>) L60（追加file）
  該当記述: `全体を指す参照は同名索引へ、個別論点を指す参照は実際の所属範囲とそのanchorへ結ぶ。`。

対応状況: **記述対応あり**。恒久pointerは追加しない。

### 論点5: 存在だけでsingle・split・none・競合を解決する

合意・導出元: [task-design-discussion-1-5.md L500](task-design-discussion/task-design-discussion-1-5.md)。

設計への反映先: [discussion-records.md L36](<design-details/discussion-records.md>)「入口を解決する」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/facilitate-discussion/resolve-discussion.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/resolve-discussion.md>) L5（追加file）
  該当記述: `## 存在だけを確認する`。
- [plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.mjs](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.mjs>) L15（追加file）
  該当記述: `export function resolveDiscussion(directory, name = "discussion.md") {`。
- [plugins/tumeda-dev/skills/task-design/SKILL.md](<../../../../plugins/tumeda-dev/skills/task-design/SKILL.md>) L449（追加・変更記述）
  該当記述: `同名directoryの索引も既存記録に含める。`。

対応状況: **記述対応あり**。本文・hashの読取と入口の発見を分離する。

### 論点6: 索引は番号・題名・所在だけにする

合意・導出元: [task-design-discussion-6-10.md L86](task-design-discussion/task-design-discussion-6-10.md)。

設計への反映先: [discussion-records.md L8](<design-details/discussion-records.md>)「保存する場所」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/facilitate-discussion/split-discussion.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/split-discussion.md>) L30（追加file）
  該当記述: `status・親子・決定要約を索引へ複製しない。`。
- [plugins/tumeda-dev/skills/facilitate-discussion/split-discussion.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/split-discussion.md>) L29（追加file）
  該当記述: ``元h1と`## 論点一覧`、番号・題名・本文linkだけを置く。``。

対応状況: **記述対応あり**。本文のstatusだけの更新で索引を同期しない。

### 論点7: 通常は現在状態、対象履歴は全文、handoffは全履歴を読む

合意・導出元: [task-design-discussion-6-10.md L182](task-design-discussion/task-design-discussion-6-10.md)。

設計への反映先: [discussion-records.md L52](<design-details/discussion-records.md>)「原文を読む」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/facilitate-discussion/read-discussion.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/read-discussion.md>) L7（追加file）
  該当記述: `## 通常の継続を読む`。
- [plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.mjs](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.mjs>) L157（追加file）
  該当記述: `function current(record) {`。
- [plugins/tumeda-dev/skills/task-design-work-handoff-contracts.md](<../../../../plugins/tumeda-dev/skills/task-design-work-handoff-contracts.md>) L33（追加・変更記述）
  該当記述: ``分割形式では`facilitate-discussion/read-discussion.md`のfull取得を使い、索引・全範囲fileを全chunk読む。``。

対応状況: **部分反映**。通常進行で索引の原文を読むという決定に対し、read手順はcheck→currentであり、current()は範囲本文だけを返す。内部で索引を構造検査することと、議論ownerが索引原文を読むことは一致していない。

### 論点8: Node標準だけの読取専用helperを持つ

合意・導出元: [task-design-discussion-6-10.md L309](task-design-discussion/task-design-discussion-6-10.md)。

設計への反映先: [discussion-records.md L93](<design-details/discussion-records.md>)「読取専用script」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.mjs](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.mjs>) L3（追加file）
  該当記述: `import { readFileSync, readdirSync, statSync, realpathSync } from "node:fs";`。
- [plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.mjs](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.mjs>) L8（追加file）
  該当記述: `const actions = new Set(["resolve", "read", "check", "snapshot", "compare", "check-candidate"]);`。
- [plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.test.mjs](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.test.mjs>) L31（追加file）
  該当記述: `test("入口は内容を読まずにnone/single/splitを判定し、共存や索引欠落を拒否する", t => {`。

対応状況: **記述対応あり**。書込み・分割・合意の意味判定はhelperに実装していない。

### 論点9: 既存の長い記録は次の更新時だけ移行する

合意・導出元: [task-design-discussion-6-10.md L399](task-design-discussion/task-design-discussion-6-10.md)。

設計への反映先: [discussion-records.md L69](<design-details/discussion-records.md>)「分割へ移行する」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/facilitate-discussion/split-discussion.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/split-discussion.md>) L16（追加file）
  該当記述: `通常の新規追加で実論点が10件を超えた時に分割する。既存の長大な単一記録は次の更新機会に移す。handoffの独立構成前には移さず、catch-upと内容把握を終えてから行う。`。
- [plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md>) L203（追加・変更記述）
  該当記述: `読むだけでは移行しない。`。

対応状況: **記述対応あり**。過去記録の一括移行は追加していない。

### 論点10: 候補と原文を照合し旧入口を最後に除去して中断復帰する

合意・導出元: [task-design-discussion-6-10.md L517](task-design-discussion/task-design-discussion-6-10.md)。

設計への反映先: [discussion-records.md L69](<design-details/discussion-records.md>)「分割へ移行する」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/facilitate-discussion/split-discussion.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/split-discussion.md>) L50（追加file）
  該当記述: `## 原文を最後に退ける`。
- [plugins/tumeda-dev/skills/facilitate-discussion/split-discussion.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/split-discussion.md>) L69（追加file）
  該当記述: `## 中断から戻る`。
- [plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.mjs](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.mjs>) L214（追加file）
  該当記述: `function candidate(sourcePath, candidateDirectory, name) {`。

対応状況: **記述対応あり**。明示移行中の旧集合直接照合と、通常入口の共存停止を区別する。

### 論点11: 利用者判断・一意導出・明示委任・機械適用を区別する

合意・導出元: [task-design-discussion-11-15.md L90](task-design-discussion/task-design-discussion-11-15.md)。

設計への反映先: [derived-changes.md L8](<design-details/derived-changes.md>)「何を利用者へ問うか」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/facilitate-discussion/derived-change.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/derived-change.md>) L5（追加file）
  該当記述: `## 変更の種類を判定する`。
- [plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md>) L306（追加・変更記述）
  該当記述: `### 変更の権限から経路を選ぶ`。
- [plugins/tumeda-dev/skills/facilitate-discussion/iteration.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/iteration.md>) L63（既存記述を利用）
  該当記述: `内容を作り始める直前に、[making_and_choosing_options.md](../../docs/think_standards/making_and_choosing_options.md) 全文を読み、今の判断材料へ適用する。起動時の読取、案への確信、調査や否定の回数で代替しない。判定基準の正本は標準に保ち、ここへ複製しない。`。

対応状況: **部分反映**。四経路と一意導出不能時の差戻しはある。しかし論点11で定めた、価値・優先順位、新たな負担、意図の実質的な疑義、一案しか考えていないことを導出根拠にしない等の具体的な判定条件は、対応する実行指示へ十分に保持されていない。

### 論点12: 変更を通常の個別論点・共通iteration・判断根拠として保存する

合意・導出元: [task-design-discussion-11-15.md L262](task-design-discussion/task-design-discussion-11-15.md)。

設計への反映先: [derived-changes.md L23](<design-details/derived-changes.md>)「変更を記録し、報告してから反映する」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/facilitate-discussion/derived-change.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/derived-change.md>) L16（追加file）
  該当記述: `## 同じ論点と回へ保存する`。
- [plugins/tumeda-dev/skills/facilitate-discussion/templates/discussion_entry.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/templates/discussion_entry.md>) L91（追加・変更記述）
  該当記述: `## 変更内容`。

対応状況: **記述対応あり**。独立反映単位、委任内の候補比較と選定理由、架空の承認欄を作らない指示がある。

### 論点13: 報告の後の当該応答を受けて反映する

合意・導出元: [task-design-discussion-11-15.md L392](task-design-discussion/task-design-discussion-11-15.md)。

設計への反映先: [derived-changes.md L23](<design-details/derived-changes.md>)「変更を記録し、報告してから反映する」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/facilitate-discussion/derived-change.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/derived-change.md>) L30（追加file）
  該当記述: `## 報告を次の判断より先に返す`。
- [plugins/tumeda-dev/skills/facilitate-discussion/derived-change.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/derived-change.md>) L33（追加file）
  該当記述: `導出・委託による変更の反映は、報告後に届いた同じ作業に対する利用者の実応答を確認した後とする。時間経過・別作業の発言・別の問いへの古い応答を通過根拠にしない。`。

対応状況: **記述対応あり**。追加の採否承認ではなく、元の権限と実応答を区別する。

### 論点14: 報告・応答・適用・検証の現在値を保持し親の未完へ数える

合意・導出元: [task-design-discussion-11-15.md L422](task-design-discussion/task-design-discussion-11-15.md)。

設計への反映先: [derived-changes.md L23](<design-details/derived-changes.md>)「変更を記録し、報告してから反映する」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/facilitate-discussion/templates/discussion_entry.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/templates/discussion_entry.md>) L105（追加・変更記述）
  該当記述: `## 現在の変更`。
- [plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md>) L166（追加・変更記述）
  該当記述: ``表示値は `応答待ち / 調査中 / 子論点待ち / 決定 / 保留 / 分解済み / 反映待ち / 反映済み` とする。``。
- [plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md>) L251（追加・変更記述）
  該当記述: `調査中・反映待ちは未完childとして数える。`。
- [plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.mjs](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.mjs>) L166（追加file）
  該当記述: `const results = nested.filter(h => /^(?:仮決定|決定|再開条件|現在の変更)(?:（|\s|$)/u.test(h.title));`。

対応状況: **記述対応あり**。状態の文字列だけでなく実際の反映範囲と検証を現在値へ残す指示がある。

### 論点15: 訂正対象と依存先だけを止め、変更後の前提へ古い回答を流用しない

合意・導出元: [task-design-discussion-11-15.md L539](task-design-discussion/task-design-discussion-11-15.md)。

設計への反映先: [derived-changes.md L59](<design-details/derived-changes.md>)「訂正を受けた時」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/facilitate-discussion/derived-change.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/derived-change.md>) L36（追加file）
  該当記述: `## 修正と反映を追跡する`。
- [plugins/tumeda-dev/skills/facilitate-discussion/derived-change.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/derived-change.md>) L41（追加file）
  該当記述: `以前の報告への応答を新しい変更へ流用しない。`。

対応状況: **部分反映**。明示訂正・AI再導出・部分反映・独立task継続はある。一方、訂正と次の問いへの回答が同時に届いた時、問いの前提が変われば回答を流用しない、という判定が実行指示に明記されていない。

### 論点16: 保留時の内容を固定し後発情報は関連付ける

合意・導出元: [task-design-discussion-16-20.md L77](task-design-discussion/task-design-discussion-16-20.md)。

設計への反映先: [pending-escalations.md L18](<design-details/pending-escalations.md>)「元作業へ保存する内容」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/escalate-plugin-skill-fix/pending-escalations.md](<../../../../plugins/tumeda-dev/skills/escalate-plugin-skill-fix/pending-escalations.md>) L21（追加file）
  該当記述: `「保留時の内容」は提案・具体例・根拠・保留指示の原文と出典・対象・再開条件を保存し、初回保存後に固定する。`。
- [plugins/tumeda-dev/skills/escalate-plugin-skill-fix/templates/pending-escalation.md](<../../../../plugins/tumeda-dev/skills/escalate-plugin-skill-fix/templates/pending-escalation.md>) L3（追加file）
  該当記述: `## 保留時の内容`。

対応状況: **記述対応あり**。現行の提案を引き渡す時は固定本文と後発情報を併読する。

### 論点17: 再開指示と確認指示を分け、成立証拠を確かめる

合意・導出元: [task-design-discussion-16-20.md L102](task-design-discussion/task-design-discussion-16-20.md)。

設計への反映先: [pending-escalations.md L37](<design-details/pending-escalations.md>)「条件を確認して再開する」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/escalate-plugin-skill-fix/pending-escalations.md](<../../../../plugins/tumeda-dev/skills/escalate-plugin-skill-fix/pending-escalations.md>) L35（追加file）
  該当記述: `## 再開条件を確認する`。

対応状況: **記述対応あり**。終わったら渡す／聞く／解除待ち／不明、後発の条件変更を区別する。

### 論点18: 個別または同作業内の明示保留をその範囲で扱う

合意・導出元: [task-design-discussion-16-20.md L226](task-design-discussion/task-design-discussion-16-20.md)。

設計への反映先: [pending-escalations.md L8](<design-details/pending-escalations.md>)「保留を成立させる指示」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md](<../../../../plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md>) L48（追加・変更記述）
  該当記述: `起動gateを通った後、実際の利用者指示に個別または同じ作業内の明示保留があるかを確認する。`。
- [plugins/tumeda-dev/skills/escalate-plugin-skill-fix/pending-escalations.md](<../../../../plugins/tumeda-dev/skills/escalate-plugin-skill-fix/pending-escalations.md>) L11（追加file）
  該当記述: `範囲・期間が不明なら不足だけを確認し、慣習、agentの方針文書、既存メモの存在から保留を補完しない。`。

対応状況: **記述対応あり**。agentが独自に決めた保留方針は根拠にしない。

### 論点19: 保留メモを元作業のpending-escalationsへ置く

合意・導出元: [task-design-discussion-16-20.md L372](task-design-discussion/task-design-discussion-16-20.md)。

設計への反映先: [pending-escalations.md L18](<design-details/pending-escalations.md>)「元作業へ保存する内容」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/escalate-plugin-skill-fix/pending-escalations.md](<../../../../plugins/tumeda-dev/skills/escalate-plugin-skill-fix/pending-escalations.md>) L16（追加file）
  該当記述: ```pending-escalations/`は必要になった時だけ元作業内へ作る。``。

対応状況: **記述対応あり**。元作業不明を別作業探索やrepository共通の仮置きで補わない。

### 論点20: 改善一件につき一fileの保留メモとする

合意・導出元: [task-design-discussion-16-20.md L466](task-design-discussion/task-design-discussion-16-20.md)。

設計への反映先: [pending-escalations.md L18](<design-details/pending-escalations.md>)「元作業へ保存する内容」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/escalate-plugin-skill-fix/pending-escalations.md](<../../../../plugins/tumeda-dev/skills/escalate-plugin-skill-fix/pending-escalations.md>) L20（追加file）
  該当記述: `[保留メモ](templates/pending-escalation.md)の必要な部品を使い、一改善一fileで保存する。`。

対応状況: **記述対応あり**。議論と控えを別々の正本として複写しない。

### 論点21: 保留メモの追跡は受領確認までとし改善完了と混同しない

合意・導出元: [task-design-discussion-21-25.md L83](task-design-discussion/task-design-discussion-21-25.md)。

設計への反映先: [pending-escalations.md L54](<design-details/pending-escalations.md>)「どこまで追跡するか」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/escalate-plugin-skill-fix/pending-escalations.md](<../../../../plugins/tumeda-dev/skills/escalate-plugin-skill-fix/pending-escalations.md>) L57（追加file）
  該当記述: `## 受領先を記録する`。
- [plugins/tumeda-dev/skills/escalate-plugin-skill-fix/pending-escalations.md](<../../../../plugins/tumeda-dev/skills/escalate-plugin-skill-fix/pending-escalations.md>) L63（追加file）
  該当記述: `引渡し済みは改善済みではない。修正・release・利用先導入の進捗同期を必須にせず、必要時はplugin側の記録を読む。`。

対応状況: **記述対応あり**。修正・配布・導入の進捗同期や暫定指示の自動終了を要求しない。

### 論点22: 暫定指示管理をmaintenance-plugin-context内へ置く

合意・導出元: [task-design-discussion-21-25.md L253](task-design-discussion/task-design-discussion-21-25.md)。

設計への反映先: [temporary-overrides.md L8](<design-details/temporary-overrides.md>)「指示の範囲と保存先」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/maintenance-plugin-context/SKILL.md](<../../../../plugins/tumeda-dev/skills/maintenance-plugin-context/SKILL.md>) L23（追加・変更記述）
  該当記述: `## 安定factと暫定指示の依頼を分ける`。
- [plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md](<../../../../plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md>) L4（追加file）
  該当記述: `管理担当はmaintenance-plugin-context。同じ担当が記録と選択・競合・版・終了を一箇所で扱い、consumerは判断を複製しない。`。

対応状況: **記述対応あり**。別の公開skillや空のfact instanceを作らない。

### 論点23: 指示は元の一作業限定で別作業へ継承しない

合意・導出元: [task-design-discussion-21-25.md L325](task-design-discussion/task-design-discussion-21-25.md)。

設計への反映先: [temporary-overrides.md L8](<design-details/temporary-overrides.md>)「指示の範囲と保存先」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md](<../../../../plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md>) L16（追加file）
  該当記述: `終了済みも同じ場所へ残す。別作業へ自動継承せず、別作業で使うには新しい指示を受ける。`。

対応状況: **記述対応あり**。同じ作業の再開では同じ保存先を取得する。

### 論点24: 暫定指示をtemporary-overridesへ必要時だけ保存する

合意・導出元: [task-design-discussion-21-25.md L403](task-design-discussion/task-design-discussion-21-25.md)。

設計への反映先: [temporary-overrides.md L8](<design-details/temporary-overrides.md>)「指示の範囲と保存先」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md](<../../../../plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md>) L13（追加file）
  該当記述: ``指示は元作業の`temporary-overrides/001-<短いkebab-slug>.md`へ保存する。``。
- [plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md](<../../../../plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md>) L18（追加file）
  該当記述: ``安定factの`.agents/skills/tumeda-dev-plugin-context.md`、配布template、repository共通の場所へ動作ルールを混ぜない。``。

対応状況: **記述対応あり**。安定fact・保留メモ・暫定指示を混ぜない。

### 論点25: 独立して改訂・終了できる一指示を一fileにする

合意・導出元: [task-design-discussion-21-25.md L485](task-design-discussion/task-design-discussion-21-25.md)。

設計への反映先: [temporary-overrides.md L8](<design-details/temporary-overrides.md>)「指示の範囲と保存先」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md](<../../../../plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md>) L15（追加file）
  該当記述: `一指示一fileとは、独立して改訂・終了できる指示の単位である。一発言・一skillでは区切らず、複数skillに効く同じ指示を複写しない。`。

対応状況: **記述対応あり**。一発言や一skillを機械的な単位にせず、複数skillに効く同じ指示も複写しない。

### 論点26: 実行版が変わったら停止し毎回継続を確認する

合意・導出元: [task-design-discussion-26-30.md L74](task-design-discussion/task-design-discussion-26-30.md)。

設計への反映先: [temporary-overrides.md L56](<design-details/temporary-overrides.md>)「競合と実行versionの変更」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md](<../../../../plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md>) L62（追加file）
  該当記述: `確認済みの実行versionが記録時から変わったら、影響する暫定動作をいったん停止する。`。
- [plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md](<../../../../plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md>) L63（追加file）
  該当記述: `実際の変更を確認し、対象規則が不変の無関係な更新でも継続してよいか利用者へ毎回尋ねる。`。

対応状況: **記述対応あり**。同じ版・同じ作業での再取得ごとには聞き直さない。

### 論点27: 終了済みの指示も同じfileへ残す

合意・導出元: [task-design-discussion-26-30.md L166](task-design-discussion/task-design-discussion-26-30.md)。

設計への反映先: [temporary-overrides.md L74](<design-details/temporary-overrides.md>)「終了しても記録を残す」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md](<../../../../plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md>) L103（追加file）
  該当記述: `fileは削除せず、同じ作業を後日再開しても自動復活させない。必要なら新たな利用者指示を受ける。`。

対応状況: **記述対応あり**。適用候補から除外し、自動復活させない。

### 論点28: 起動・再開・resume・把握した変更時だけ指示を取得する

合意・導出元: [task-design-discussion-26-30.md L251](task-design-discussion/task-design-discussion-26-30.md)。

設計への反映先: [temporary-overrides.md L30](<design-details/temporary-overrides.md>)「各skillが受け取る時」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md](<../../../../plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md>) L86（追加file）
  該当記述: `実際の新規起動、別sessionからの再開、resume、把握した変更時にこの処理を使う。`。
- [plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md](<../../../../plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md>) L37（追加file）
  該当記述: `同じsessionで登録・更新・終了した場合は、管理担当から現在の対象consumerへ更新後の内容と読直しの必要を返す。`。
- [plugins/tumeda-dev/skills/think-through/SKILL.md](<../../../../plugins/tumeda-dev/skills/think-through/SKILL.md>) L25（追加・変更記述）
  該当記述: `通常の返信・内部file再読・think-throughの毎turn適用を定期取得へ変えない。`。

対応状況: **記述対応あり**。各返信のpollingや通知されていない編集の即時発見を保証しない。

### 論点29: 既定の終了条件を元作業の完了へ接続する

合意・導出元: [task-design-discussion-26-30.md L342](task-design-discussion/task-design-discussion-26-30.md)。

設計への反映先: [temporary-overrides.md L74](<design-details/temporary-overrides.md>)「終了しても記録を残す」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md](<../../../../plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md>) L92（追加file）
  該当記述: `終了時期の別指定がなければ、元作業の完了または実際の正式版による全範囲の代替でも終了する。`。
- [plugins/tumeda-dev/skills/steering/SKILL.md](<../../../../plugins/tumeda-dev/skills/steering/SKILL.md>) L512（追加・変更記述）
  該当記述: `## 元作業の完了を暫定指示の管理へ通知する`。
- [plugins/tumeda-dev/skills/task-design/SKILL.md](<../../../../plugins/tumeda-dev/skills/task-design/SKILL.md>) L882（追加・変更記述）
  該当記述: `## 元作業の完了を暫定指示の管理へ通知する`。
- [plugins/tumeda-dev/skills/tasklist-executor/SKILL.md](<../../../../plugins/tumeda-dev/skills/tasklist-executor/SKILL.md>) L183（追加・変更記述）
  該当記述: `## 元作業の完了を暫定指示の管理へ通知する`。

対応状況: **記述対応あり**。一返信・一呼出し・中断・承認待ちを元作業の完了に数えない。

### 論点30: 正式版の全面代替を確認したら追加承認なしで終了する

合意・導出元: [task-design-discussion-26-30.md L431](task-design-discussion/task-design-discussion-26-30.md)。

設計への反映先: [temporary-overrides.md L74](<design-details/temporary-overrides.md>)「終了しても記録を残す」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md](<../../../../plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md>) L96（追加file）
  該当記述: `正式版による全面代替は、実際に使う正式版が指示の対象・動作・条件の全てを満たすと確認できた時だけ認定する。`。
- [plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md](<../../../../plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md>) L99（追加file）
  該当記述: `部分代替・証拠不足では残る差と必要な判断を返し、一部だけ残す自動分割・改訂、過去の意味の書換えは行わない。`。

対応状況: **記述対応あり**。対象・動作・条件の全範囲を照合し、部分代替を勝手に分割・終了しない。

### 論点31: 構造上の問題・材料不足を通常完了と区別する

合意・導出元: [task-design-discussion-31-35.md L78](task-design-discussion/task-design-discussion-31-35.md)。

設計への反映先: [skill-update-review.md L61](<design-details/skill-update-review.md>)「構造を判定する」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/skill-update-review/SKILL.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/SKILL.md>) L46（追加file）
  該当記述: `不足・不合格を残したまま通常完了へ進まない。構造reviewだけで実装を自動再開せず、元のworkflowへ戻す。別作業の探索、外部連絡、読取許可から広げた実行・生成・編集は行わない。`。
- [plugins/tumeda-dev/skills/skill-update-review/assess-structure.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/assess-structure.md>) L22（追加file）
  該当記述: `新skillでも具体caseで評価できるが、過去の障害を創作しない。反証があれば再判定する。全不合格を分割命令へ変換しない。機能・安全・既存要件の不備は対応する既存gateでも扱う。`。

対応状況: **記述対応あり・運用要再検討**。指摘内容の採否や他の独立taskの実行停止と混同した運用は、実装reviewで扱う。

### 論点32: 過去実績だけでなく現物に即した変更caseで評価する

合意・導出元: [task-design-discussion-31-35.md L166](task-design-discussion/task-design-discussion-31-35.md)。

設計への反映先: [skill-update-review.md L61](<design-details/skill-update-review.md>)「構造を判定する」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/skill-update-review/assess-structure.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/assess-structure.md>) L13（追加file）
  該当記述: `## 変更caseで構造を評価する`。
- [plugins/tumeda-dev/skills/skill-update-review/assess-structure.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/assess-structure.md>) L22（追加file）
  該当記述: `新skillでも具体caseで評価できるが、過去の障害を創作しない。反証があれば再判定する。全不合格を分割命令へ変換しない。機能・安全・既存要件の不備は対応する既存gateでも扱う。`。

対応状況: **記述対応あり**。机上検討と実障害を区別し、反証があれば再判定する。

### 論点33: 構造案採用前と編集後の二段階で明示reviewする

合意・導出元: [task-design-discussion-31-35.md L316](task-design-discussion/task-design-discussion-31-35.md)。

設計への反映先: [skill-update-review.md L8](<design-details/skill-update-review.md>)「いつ使い、誰へ返すか」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/skill-update-review/SKILL.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/SKILL.md>) L22（追加file）
  該当記述: `構造案の採用前と、skill-creatorによる編集後に明示適用する。構造の合格は、利用者の合意、機能・安全・独立した動作検証、作業完了の合格を代替しない。`。
- [plugins/tumeda-dev/skills/task-design/SKILL.md](<../../../../plugins/tumeda-dev/skills/task-design/SKILL.md>) L536（追加・変更記述）
  該当記述: ```skill-update-review`の対象判定に該当する汎用skillの新設・更新を含む時は、構造案を採用する前に`skill-update-review`を明示適用する。``。
- [plugins/tumeda-dev/skills/task-design/tasklist-design.md](<../../../../plugins/tumeda-dev/skills/task-design/tasklist-design.md>) L86（追加・変更記述）
  該当記述: ```skill-update-review`の対象となる汎用skillの新設・更新を実装するphaseには、skill-creatorによる編集後・DoD判定前の`skill-update-review`明示起動をtaskとDoDへ含める。``。
- [plugins/tumeda-dev/skills/tasklist-executor/SKILL.md](<../../../../plugins/tumeda-dev/skills/tasklist-executor/SKILL.md>) L145（追加・変更記述）
  該当記述: ```skill-update-review`の対象となる汎用skillの新設・更新では、skill-creatorによる実装後・DoD判定前に`skill-update-review`を明示適用する。``。

対応状況: **記述対応あり**。前段合格で後段を省略せず、毎返信や全過去skill点検へ広げない。

### 論点34: 新設・動作変更を対象にし、意味不変を示せる表記修正だけ除外する

合意・導出元: [task-design-discussion-31-35.md L412](task-design-discussion/task-design-discussion-31-35.md)。

設計への反映先: [skill-update-review.md L8](<design-details/skill-update-review.md>)「いつ使い、誰へ返すか」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/skill-update-review/SKILL.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/SKILL.md>) L34（追加file）
  該当記述: `起動条件、指示、入出力、役割分担、参照・読取条件、scriptの動作を変える更新が対象となる。誤字・書式だけの変更は、差分と参照先から意味・構造不変を示せる時だけ除外できる。`。
- [plugins/tumeda-dev/skills/skill-update-review/SKILL.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/SKILL.md>) L35（追加file）
  該当記述: `file種類・行数・「軽微」という呼び名では除外しない。不明な変更、明示review、既知の不合格、既存の合意・検証条件を省略しない。`。

対応状況: **記述対応あり**。不明な変更・明示review・既知問題を軽微という呼び名で除外しない。

### 論点35: 対象skillの未変更部分も構造reviewへ含める

合意・導出元: [task-design-discussion-31-35.md L511](task-design-discussion/task-design-discussion-31-35.md)。

設計への反映先: [skill-update-review.md L61](<design-details/skill-update-review.md>)「構造を判定する」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/skill-update-review/assess-structure.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/assess-structure.md>) L5（追加file）
  該当記述: `対象全体について指示とコードの分担、入出力、判断・状態、停止・再開・返却、規則の正本、独立した改訂理由と検証のまとまりを確認する。今回未編集の内部処理も対象とする。`。
- [plugins/tumeda-dev/skills/skill-update-review/assess-structure.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/assess-structure.md>) L6（追加file）
  該当記述: `既存の不合格も通常完了までに解消し、合意範囲を越える整理は設計へ戻す。必要な合意が得られなければ未完として止める。行数やfile数では判定しない。`。

対応状況: **記述対応あり・運用要再検討**。この規則は本体に残る一方、今回の実行記録では既存配置問題を残して完了と扱っている。判定の妥当性・個別taskと全体完了の区別を解決済みとはしない。

### 論点36: 親専用の独立工程は内部指示、現在の外部要求がある場合だけ別skillを検討する

合意・導出元: [task-design-discussion-36-40.md L81](task-design-discussion/task-design-discussion-36-40.md)。

設計への反映先: [skill-update-review.md L61](<design-details/skill-update-review.md>)「構造を判定する」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/skill-update-review/assess-structure.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/assess-structure.md>) L10（追加file）
  該当記述: `分割によって入口のgate・状態・返却が欠けるなら不合格とする。別skill化には現在の単独利用・他callerの具体要求を要し、将来予測だけでは独立させない。`。
- [plugins/tumeda-dev/skills/skill-update-review/assess-structure.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/assess-structure.md>) L9（追加file）
  該当記述: `固有の判断・状態・完了条件と独立した改訂理由・検証を持つ工程を一fileに抱え込む構成は、混線の実績がなくても不合格とする。内部指示には読む条件・所有する判断と状態・親への返却を明示する。`。

対応状況: **記述対応あり**。利用実績を待たず現在の具体要求で検討でき、将来予測だけでは独立させない。

### 論点37: review結果を既存ownerの記録へ戻し、不合格再検討を実装reviewで行う

合意・導出元: [task-design-discussion-36-40.md L183](task-design-discussion/task-design-discussion-36-40.md)。

設計への反映先: [skill-update-review.md L102](<design-details/skill-update-review.md>)「結果と、保存する担当」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/skill-update-review/assess-structure.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/assess-structure.md>) L43（追加file）
  該当記述: `呼出し側が権限を持つ既存の設計議論、task検証記録、実装reviewへ保存し、保存先と対象箇所を返す。既存writerを維持する。適切な保存先がない単独利用なら同じ作業内へ記録を用意する。`。
- [plugins/tumeda-dev/skills/steering/SKILL.md](<../../../../plugins/tumeda-dev/skills/steering/SKILL.md>) L351（既存記述を利用）
  該当記述: `## 実装完了後review`。
- [plugins/tumeda-dev/skills/tasklist-executor/SKILL.md](<../../../../plugins/tumeda-dev/skills/tasklist-executor/SKILL.md>) L148（追加・変更記述）
  該当記述: `結果を既存のtask検証記録または実装reviewへ保存し、保存先・対象箇所・内容識別を残す。`。

対応状況: **記述あり・旧運用を今回訂正**。本体に返却・保存契約はあるが、この作業では実装reviewが論点形式でなく、実装中の指摘をtask-design論点53へ置いた。今回の書き直しと移譲が対応する。

### 論点38: 意味上独立して改訂・検証する内部処理を具体的に捉える

合意・導出元: [task-design-discussion-36-40.md L282](task-design-discussion/task-design-discussion-36-40.md)。

設計への反映先: [skill-update-review.md L61](<design-details/skill-update-review.md>)「構造を判定する」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/skill-update-review/assess-structure.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/assess-structure.md>) L9（追加file）
  該当記述: `固有の判断・状態・完了条件と独立した改訂理由・検証を持つ工程を一fileに抱え込む構成は、混線の実績がなくても不合格とする。内部指示には読む条件・所有する判断と状態・親への返却を明示する。`。
- [plugins/tumeda-dev/skills/skill-update-review/assess-structure.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/assess-structure.md>) L6（追加file）
  該当記述: `既存の不合格も通常完了までに解消し、合意範囲を越える整理は設計へ戻す。必要な合意が得られなければ未完として止める。行数やfile数では判定しない。`。

対応状況: **記述対応あり・適用理解に疑義**。文言はある。しかし実物の仕事を意味から捉えた判断になっているかは旧論点53への指摘で未解消。章があることだけで分割必須と結論しない。

### 論点39: 同じ編集担当による明示reviewを認める

合意・導出元: [task-design-discussion-36-40.md L378](task-design-discussion/task-design-discussion-36-40.md)。

設計への反映先: [skill-update-review.md L8](<design-details/skill-update-review.md>)「いつ使い、誰へ返すか」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/skill-update-review/SKILL.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/SKILL.md>) L38（追加file）
  該当記述: `同じ設計・編集agentが明示適用してよいが、別途指定された独立review・動作検証は維持する。`。

対応状況: **記述対応あり**。別途指定された独立review・動作検証は免除しない。

### 論点40: reviewは問題・根拠・解消条件・方向を返し完成構成は設計担当へ戻す

合意・導出元: [task-design-discussion-36-40.md L475](task-design-discussion/task-design-discussion-36-40.md)。

設計への反映先: [skill-update-review.md L102](<design-details/skill-update-review.md>)「結果と、保存する担当」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/skill-update-review/assess-structure.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/assess-structure.md>) L37（追加file）
  該当記述: `不合格には問題箇所・根拠・解消条件・整理の方向と、保持する境界・状態・受渡しを示す。完成した実装構成の作成は設計へ返し、reviewが毎回完成案を作ることは要求しない。`。

対応状況: **記述対応あり**。返却方向をそのまま編集承認にしない。設計判断へ戻す必要が生じた場合と、実装feedback記録のowner移動を混同しない。

### 論点41: 自然言語contextから対象・段階・要件・比較元を揃える

合意・導出元: [task-design-discussion-41-45.md L100](task-design-discussion/task-design-discussion-41-45.md)。

設計への反映先: [skill-update-review.md L30](<design-details/skill-update-review.md>)「材料を揃えて読む」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/skill-update-review/SKILL.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/SKILL.md>) L29（追加file）
  該当記述: `## 入力と対象判定`。
- [plugins/tumeda-dev/skills/skill-update-review/collect-review-material.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/collect-review-material.md>) L3（追加file）
  該当記述: `## 入力と比較元を揃える`。

対応状況: **記述対応あり**。予定入口を認め、未作成source全文を設計段階で先行要求しない。

### 論点42: 対象・読取根拠・判定・未確認・返却先を返す

合意・導出元: [task-design-discussion-41-45.md L256](task-design-discussion/task-design-discussion-41-45.md)。

設計への反映先: [skill-update-review.md L102](<design-details/skill-update-review.md>)「結果と、保存する担当」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/skill-update-review/assess-structure.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/assess-structure.md>) L33（追加file）
  該当記述: `## 結果を返す`。
- [plugins/tumeda-dev/skills/skill-update-review/templates/review-result.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/templates/review-result.md>) L15（追加file）
  該当記述: `## 架空例`。

対応状況: **記述対応あり**。合格/不合格/材料不足と、併存する未確認を区別する。固定JSONや専用報告fileを必須にしない。

### 論点43: 共有指示は利用部分と必要な前提まで読む

合意・導出元: [task-design-discussion-41-45.md L366](task-design-discussion/task-design-discussion-41-45.md)。

設計への反映先: [skill-update-review.md L30](<design-details/skill-update-review.md>)「材料を揃えて読む」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/skill-update-review/collect-review-material.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/collect-review-material.md>) L14（追加file）
  該当記述: `共有指示・moduleは目次・利用規則、利用部分、共通定義・条件・例外、必要な参照と前提を読む。共有先の独立性が不明、全文読取の明示がある、内部実装が判定に必要なら範囲を広げる。`。

対応状況: **記述対応あり**。独立性不明・全文必読指定・内部判定に必要な場合は範囲を広げる。対象skill自身の全体確認は維持する。

### 論点44: 共有先だけの独立問題で対象の完了を止めない

合意・導出元: [task-design-discussion-41-45.md L474](task-design-discussion/task-design-discussion-41-45.md)。

設計への反映先: [skill-update-review.md L93](<design-details/skill-update-review.md>)「共有先に見つかった問題」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/skill-update-review/assess-structure.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/assess-structure.md>) L24（追加file）
  該当記述: `共有先の利用処理・共通定義を通じて対象skillへ影響する問題は必須対応とする。別用途だけの独立問題で無影響と確認できたものは、所在・根拠・無影響の理由を返すが、それだけで今回の完了を止めない。`。
- [plugins/tumeda-dev/skills/skill-update-review/assess-structure.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/assess-structure.md>) L25（追加file）
  該当記述: `影響不明なら必要確認へ戻り、確認不能なら未確認と影響を返す。対象自身の未変更処理や依頼された共有文書更新を、この除外へ含めない。`。

対応状況: **記述対応あり**。対象自身の未変更処理を、別用途の共有先問題の例外へ含めない。今回の運用判断への適用は実装reviewで未解決。

### 論点45: 呼出先の入口全文と受渡し契約を照合する

合意・導出元: [task-design-discussion-41-45.md L588](task-design-discussion/task-design-discussion-41-45.md)。

設計への反映先: [skill-update-review.md L30](<design-details/skill-update-review.md>)「材料を揃えて読む」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/skill-update-review/collect-review-material.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/collect-review-material.md>) L16（追加file）
  該当記述: `呼ぶだけの別skillはSKILL.md全文と受渡しの参照を読む。条件・入力・判断・状態・完了・失敗・中断・返却・再開をcallerと照合し、入口だけでは確認できない場合は必要な内部指示まで辿る。`。
- [plugins/tumeda-dev/skills/skill-update-review/collect-review-material.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/collect-review-material.md>) L17（追加file）
  該当記述: `内部処理を直接利用する場合も、飛ばした入口が持つ判断・状態・前提を確認する。外部command・libraryは利用する入出力、失敗、副作用などの条件と根拠を確認する。`。

対応状況: **記述対応あり**。入口で不足する場合は内部へ広げるが、呼ぶだけの他skill全体の独立reviewを自動追加しない。

### 論点46: 専用scriptは全文、共有・外部依存は利用条件と必要範囲を読む

合意・導出元: [task-design-discussion-46-50.md L100](task-design-discussion/task-design-discussion-46-50.md)。

設計への反映先: [skill-update-review.md L30](<design-details/skill-update-review.md>)「材料を揃えて読む」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/skill-update-review/collect-review-material.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/collect-review-material.md>) L12（追加file）
  該当記述: `対象skillのSKILL.mdと補助指示は、未変更処理を含む全体を読む。そのskillが役割と改訂を管理する専用script・内部moduleはsource全文を読み、所在や拡張子で除外しない。`。
- [plugins/tumeda-dev/skills/skill-update-review/collect-review-material.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/collect-review-material.md>) L17（追加file）
  該当記述: `内部処理を直接利用する場合も、飛ばした入口が持つ判断・状態・前提を確認する。外部command・libraryは利用する入出力、失敗、副作用などの条件と根拠を確認する。`。

対応状況: **記述対応あり**。sourceの所在・拡張子だけで対象を除外せず、読取を実行や編集の許可へ広げない。

### 論点47: 内容・集合・参照・前提にreview結果を結び再利用を判断する

合意・導出元: [task-design-discussion-46-50.md L232](task-design-discussion/task-design-discussion-46-50.md)。

設計への反映先: [skill-update-review.md L158](<design-details/skill-update-review.md>)「確認した内容の版と照合する」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/skill-update-review/collect-review-material.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/collect-review-material.md>) L22（追加file）
  該当記述: `## 確認範囲と内容を識別する`。
- [plugins/tumeda-dev/skills/skill-update-review/SKILL.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/SKILL.md>) L48（追加file）
  該当記述: `## 既存結果の再利用と再review`。

対応状況: **記述対応あり**。hashは読了・合格の代わりではない。自己参照、追加削除、cache/実物の区別を保持する。

### 論点48: helperのCLI・出典・構造検査・既存入口への接続を具体化する

合意・導出元: [task-design-discussion-46-50.md L267](task-design-discussion/task-design-discussion-46-50.md)。

設計への反映先: [discussion-records.md L123](<design-details/discussion-records.md>)「実装するfileと接続」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.mjs](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.mjs>) L245（追加file）
  該当記述: `export function inspect(argv, stdin = "") {`。
- [plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.mjs](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.mjs>) L85（追加file）
  該当記述: `function boundedChunks(chunks) {`。
- [plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.mjs](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.mjs>) L205（追加file）
  該当記述: `function validateSnapshot(value) {`。
- [plugins/tumeda-dev/skills/facilitate-discussion/read-discussion.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/read-discussion.md>) L7（追加file）
  該当記述: `## 通常の継続を読む`。
- [scripts/verification/test-task-design-handoff.mjs](<../../../../scripts/verification/test-task-design-handoff.mjs>) L105（追加・変更記述）
  該当記述: `if (result.status !== 0 || JSON.parse(result.stdout).format !== "split" || result.stdout.includes("FORBIDDEN_MARKER") || result.stdout.includes("sha256")) failures.push("split存在gate: 本文/hash取得なしで既存を解決できない");`。

対応状況: **部分反映**。CLI・bounded chunk・snapshot検査・既存extractorを変えない接続はある。通常読取で索引の原文を取得しない不一致は論点7と共通。

### 論点49: 変更の表示・報告版・実応答・反映待ちを接続する

合意・導出元: [task-design-discussion-46-50.md L378](task-design-discussion/task-design-discussion-46-50.md)。

設計への反映先: [derived-changes.md L99](<design-details/derived-changes.md>)「実装するfileと接続」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/facilitate-discussion/derived-change.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/derived-change.md>) L25（追加file）
  該当記述: ```現在の変更`には対象iteration、報告した実際の問いまたは完了reviewと版、変更対象、報告済みか、対応する実応答、反映状態・実結果、``。
- [plugins/tumeda-dev/skills/facilitate-discussion/templates/discussion_entry.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/templates/discussion_entry.md>) L105（追加・変更記述）
  該当記述: `## 現在の変更`。
- [plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md>) L250（追加・変更記述）
  該当記述: ``未決childがあればparentを`子論点待ち`、全childが決定済みまたは変更の反映済みなら`分解済み`とする。``。

対応状況: **部分反映**。表示と親の完了判定はある。利用者判断の具体条件と訂正で次の問いの前提が変わる場合の扱いは論点11/15と同じ不足を持つ。

### 論点50: 保留メモ・条件再開・引渡しと受領の具体形を実装する

合意・導出元: [task-design-discussion-46-50.md L464](task-design-discussion/task-design-discussion-46-50.md)。

設計への反映先: [pending-escalations.md L86](<design-details/pending-escalations.md>)「実装するfile」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/escalate-plugin-skill-fix/pending-escalations.md](<../../../../plugins/tumeda-dev/skills/escalate-plugin-skill-fix/pending-escalations.md>) L17（追加file）
  該当記述: ``同directoryの最大連番+1を3桁以上にし、内容から選んだ短いkebab-case slugで`001-<slug>.md`の形にする。``。
- [plugins/tumeda-dev/skills/escalate-plugin-skill-fix/templates/pending-escalation.md](<../../../../plugins/tumeda-dev/skills/escalate-plugin-skill-fix/templates/pending-escalation.md>) L11（追加file）
  該当記述: `## 追跡`。
- [plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md](<../../../../plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md>) L49（追加・変更記述）
  該当記述: `明示保留または既存保留メモからの再開では、[保留と再開](pending-escalations.md)を読み、元作業への保存・条件確認・受領追跡を行う。`。

対応状況: **記述対応あり**。固定本文・関連情報・追跡、既存転送先の確認、受領前を未完とする記述へ対応する。

### 論点51: 暫定指示の保存・選択・版・終了と全consumer接続を具体化する

合意・導出元: [task-design-discussion-51-55.md L11](task-design-discussion/task-design-discussion-51-55.md)。

設計への反映先: [temporary-overrides.md L102](<design-details/temporary-overrides.md>)「実装するfileと接続」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md](<../../../../plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md>) L22（追加file）
  該当記述: `## 記録を登録・改訂する`。
- [plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md](<../../../../plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md>) L46（追加file）
  該当記述: `## 適用候補と実行版を照合する`。
- [plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md](<../../../../plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md>) L68（追加file）
  該当記述: `## 実効指示または停止理由を返す`。
- [plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md](<../../../../plugins/tumeda-dev/skills/maintenance-plugin-context/temporary-overrides.md>) L89（追加file）
  該当記述: `## 終了を記録する`。
- [plugins/tumeda-dev/skills/maintenance-plugin-context/templates/temporary-override.md](<../../../../plugins/tumeda-dev/skills/maintenance-plugin-context/templates/temporary-override.md>) L3（追加file）
  該当記述: `## 指示`。

対応状況: **記述対応あり**。14入口の個別fileと完了通知の所在は末尾のconsumer一覧へ列挙する。今回追加のplan-commitsは当時の14対象には数えない。

### 論点52: 構造reviewを入口・材料収集・評価・結果部品へ分担する

合意・導出元: [task-design-discussion-51-55.md L109](task-design-discussion/task-design-discussion-51-55.md)。

設計への反映先: [skill-update-review.md L184](<design-details/skill-update-review.md>)「実装するfileと接続」。

本体の対応箇所:

- [plugins/tumeda-dev/skills/skill-update-review/SKILL.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/SKILL.md>) L40（追加file）
  該当記述: `## 進行`。
- [plugins/tumeda-dev/skills/skill-update-review/collect-review-material.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/collect-review-material.md>) L3（追加file）
  該当記述: `## 入力と比較元を揃える`。
- [plugins/tumeda-dev/skills/skill-update-review/assess-structure.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/assess-structure.md>) L3（追加file）
  該当記述: `## 全体の責務と進行を照合する`。
- [plugins/tumeda-dev/skills/skill-update-review/templates/review-result.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/templates/review-result.md>) L15（追加file）
  該当記述: `## 架空例`。
- [plugins/tumeda-dev/skills/skill-update-review/agents/openai.yaml](<../../../../plugins/tumeda-dev/skills/skill-update-review/agents/openai.yaml>) L2（追加file）
  該当記述: `display_name: "Skill構造review"`。

対応状況: **記述対応あり**。task-design・tasklist設計・executorからの明示呼出しは論点33の参照先と同じ。これは対応先の確認であり、今回のrecord運用を含めて正しく使えたという宣言ではない。

## 論点28・51: 暫定指示を取得する14入口

各fileの取得節は同じmanagerへ渡す導線であり、選択・競合・version判断を14箇所へ複写しない。

- [doc-enricher/SKILL.md](<../../../../plugins/tumeda-dev/skills/doc-enricher/SKILL.md>) L9。
- [document-review/SKILL.md](<../../../../plugins/tumeda-dev/skills/document-review/SKILL.md>) L13。
- [escalate-plugin-skill-fix/SKILL.md](<../../../../plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md>) L8。
- [facilitate-discussion/SKILL.md](<../../../../plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md>) L8。
- [maintenance-plugin-context/SKILL.md](<../../../../plugins/tumeda-dev/skills/maintenance-plugin-context/SKILL.md>) L8。
- [name-work-directory/SKILL.md](<../../../../plugins/tumeda-dev/skills/name-work-directory/SKILL.md>) L8。
- [share-work-in-progress/SKILL.md](<../../../../plugins/tumeda-dev/skills/share-work-in-progress/SKILL.md>) L8。
- [steering/SKILL.md](<../../../../plugins/tumeda-dev/skills/steering/SKILL.md>) L9。
- [task-design/SKILL.md](<../../../../plugins/tumeda-dev/skills/task-design/SKILL.md>) L24。
- [tasklist-executor/SKILL.md](<../../../../plugins/tumeda-dev/skills/tasklist-executor/SKILL.md>) L19。
- [test-runner/SKILL.md](<../../../../plugins/tumeda-dev/skills/test-runner/SKILL.md>) L13。
- [think-through/SKILL.md](<../../../../plugins/tumeda-dev/skills/think-through/SKILL.md>) L17。
- [visual-inspector/SKILL.md](<../../../../plugins/tumeda-dev/skills/visual-inspector/SKILL.md>) L15。
- [skill-update-review/SKILL.md](<../../../../plugins/tumeda-dev/skills/skill-update-review/SKILL.md>) L10。

元作業完了の通知は、論点29に挙げたsteering・task-design・tasklist-executorの各末尾節。

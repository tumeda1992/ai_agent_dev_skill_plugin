# 残差分のコミット計画

2026-10-25。対象branchは `20261018-escalate-pending-plugin-improvements`、比較元は現在のHEAD `1259528`。
以下は実行前に合意した計画であり、実行結果はtasklist.mdを参照する。
四領域の実装と8.1.0の配布metadataは既にcheckpointへ保存されているため、今回の新規commitとして再計上しない。

## 範囲と前提

ゼロベースレビューの8件は[実装review論点22](implementation_review/implementation_review-21-25.md#論点22-ゼロベースレビューの8指摘を保留して今回の締めへ進む)に従い保留とする。
以下の修復commitは前回実施した6修正を保存するもの。新しい8件を直したと称するものではない。
未変更の8.1.0をもう一度version変更する作業も含めない。

実操作確認は未実施。tasklistのPhase11〜13を実施済みへ変えず、未確認と既知の問題を明記したまま締めの判断へ返す。
コミット計画への合意、実際のコミット許可、公開許可を区別する。
今回の計画を実行する時は、Phase11の扱いとコミット対象への利用者指示をtasklistへ記録してから進む。

## 1. 意味単位でコミット計画を立てるskillを追加する

メッセージ: `feat(tumeda-dev): 意味単位のコミット計画skillを追加`

対象は `plugins/tumeda-dev/skills/plan-commits/SKILL.md`、`agents/openai.yaml`、同skillsのREADMEのplan-commits一行。
差分から一つの仕事、revertの効果、依存、具体メッセージを決める指示を公開入口として成立させる。
このcommitを戻すと新skillとその一覧行だけが消え、既存の議論・review・6修正は残る。他の修復への実装依存は無い。

## 2. 実装reviewを分割し、設計論点53から記録責務を移す

メッセージ: `docs: 実装reviewを分割して論点53の議論を移譲`

対象は旧root `implementation_review.md` の除去、`implementation_review/` の索引と1〜15本文、
対応する内部log1〜15、設計discussion51〜55とその論点53内部logの移譲記述。
この段階の索引は1〜15だけとし、16以降の記録を先に混ぜない。
既存指摘・応答・判断の変遷を正しい実装reviewから辿れるようにする。

戻す効果は記録配置と移譲の取消であり、skill本体は変わらない。
後続修復に紐づく新しいreview記録はこの配置を前提にするため、後続がある状態でこの基盤だけを単独revertできるとは扱わない。

## 3. 52合意と実装記述の対応を記録する

メッセージ: `docs: 52合意と実装記述の対応を記録`

対象は `decision-implementation-map.md`と、実装review論点13の対応表link、内部log13の「今回の対応表で確認できたこと」の保存結果block。
これらは対応表を作成した結果そのものであり、2の記録移譲には先行させず、この資料と同時に追加する。
checkpoint時点の記述対応と当時認識した不足を保存する仕事で、全条件の動作合格ではない。
戻すとこの対応資料だけが消え、実装reviewや本体は残る。論点へのlinkのため2を先に置く。

この資料の時点はHEAD1259528であり、後の6修正・ゼロベースレビューを反映した現況表として読み替えない。
後の問題・解消状況は対応する実装reviewと保留メモから読む。

## 4. 分割された議論の親変更を論理記録全体で扱う

メッセージ: `fix(tumeda-dev): 分割議論の親変更を全範囲で検証`

本体は `facilitate-discussion/SKILL.md` のreparentの2箇所。
同じ記録の別範囲にある新親・旧親を検査し、所属fileでstatus同期する。
実装review16、内部log16、索引16行、tasklistの対応する修復記録を同じ仕事へ含める。
16〜20本文fileはこの段階で16だけを持つ中間版として追加する。

戻す効果は、範囲をまたぐ親変更の扱いと対応記録だけの取消。
snapshot手順の強化や訂正処理など独立した修正を一緒に戻さない。
保存時の版照合については既存の読取契約を使い、その強化は次のcommitに分ける。

## 5. 判断に使った読取起点を保持して保存する

メッセージ: `fix(tumeda-dev): 読取起点を保持して保存ごとに照合`

本体は `facilitate-discussion/read-discussion.md`。
最初の読取前のsnapshot、後から根拠logを追加する照合、一file保存ごとの起点更新、新規logと指定集合の保持を一つの保存protocolとして扱う。
実装review17、内部log17、索引17行、tasklistの対応記録を含める。

これらは同じ起点を継続する不可分な状態遷移なので、機能名や行数で分割しない。
戻すと保存protocolの強化だけが消え、親変更・訂正・helperの終端結果検査は残る。
新レビューR1の通常中断復帰を解消したcommitとは説明しない。

## 6. 訂正で前提が変わった後続回答を再評価する

メッセージ: `fix(tumeda-dev): 訂正後の前提へ古い回答を流用しない`

本体は `facilitate-discussion/derived-change.md` の依存評価と `iteration.md` の呼出し一行。
実装review18、内部log18、索引18行、tasklistの対応記録を含める。
訂正と次の選択が同時に来た場合に、影響する回答だけを待ち、独立回答は処理できるようにする。

戻すとこの同時応答の再評価だけが消え、保存protocolや保留条件の再確認は残る。
呼出しと判断本体を別commitへ散らさない。

## 7. 元作業の状態遷移から保留条件を再確認する

メッセージ: `fix(tumeda-dev): 元作業の状態遷移から保留改善を再確認`

対象は `escalate-plugin-skill-fix/SKILL.md` と `pending-escalations.md`、
`task-design/SKILL.md` の再開・design完了通知、
`steering/SKILL.md` のready-result照合後・executor返却後・roadmap phase完了の通知、
`tasklist-executor/SKILL.md` の再開・phase完了と単独完了の通知。
実装review19、内部log19、索引19行、tasklistの対応記録も同じ仕事。

起動gate、条件確認の担当、元担当のcallbackまでが揃って一つの再確認経路になるため、skill別には分けない。
戻すとこの自動的な再確認の接続だけが消え、既存の保留保存や、次のhelper修復、feedback routingは残る。
新レビューR3・R4が未解消であることを保留メモに残し、全経路が閉じたと説明しない。

## 8. 終端statusで結果が欠けた記録を全文へ戻す

メッセージ: `fix(tumeda-dev): 現在結果が欠けた終端記録を全文へ戻す`

対象は `facilitate-discussion/scripts/inspect-discussion.mjs` の結果型・非空本文の検査と、
同test fileの追加2test。
実装review20、内部log20、索引20行、tasklistの対応記録を含める。
statusだけで過去回を省略する経路を狭める。

戻すとこの検査と専用回帰testだけが消え、他のhelper機能と指示側の修正は残る。
実測は前回24成功・0失敗・1既存skip。新レビューR6〜R8まで解消したという意味ではない。

## 9. 両実装入口のfeedbackを共通の記録・返却処理へ接続する

メッセージ: `fix(tumeda-dev): 両実装入口からfeedbackを記録して返す`

対象は新しい `skills/runtime-feedback-review.md`、
`steering/SKILL.md` の実装完了後reviewの移管、
`tasklist-executor/SKILL.md` の構造reviewからの接続と実装feedback節。
7の同file内callbackのhunkを含めない。
実装review21、内部log21、索引21行、tasklistの対応記録も含める。
21〜25本文fileはこの段階では21だけを追加する。

既存steeringの原文保存・原因確認・合意・routingを共通正本へ移し、executorへ直接来たfeedbackでも同じ処理を通せる状態にする。
戻す時はsteering側の旧本文の復元と共通fileの除去・executor接続の取消を同時に行い、参照切れを残さない。
保留条件callbackや構造review本体は残る。

## 10. 修復の確認結果と8件の保留を残し、締めの範囲を記録する

メッセージ: `docs: 実行ハーネスの残る8指摘を保留して締めを整理`

対象は `pending-escalations/001-*.md`〜`008-*.md`、
実装review22、内部log22、索引22行、本file、tasklistの全体確認結果と今回の締めの扱い。
個別修復taskの記録は4〜9へ置き、複数修復を合わせた確認の範囲と限界はここへ置く。
保留は合格や修正完了ではないこと、再開条件、実操作確認と公開の未実施を明示する。

戻すと8件の保留と今回の締め判断の記録だけが消え、実施済み6修復と各記録は残る。
詳細artifactは追跡対象外のため自動でstageせず、各保留メモ自体に再開できる具体を残す。
10は各修復の記録・確認を参照するため、2〜9の後に置く。

## 共有fileと対象外

意味ごとに分ける計画であり、同じhunkにあるという理由だけで仕事を統合しない。

- steeringとtasklist-executorは7のcallbackと9のfeedback移管を、中間版を再構成して分ける。
- review索引、16〜20本文、21〜25本文、tasklistは各仕事に必要な行・論点だけを順に含める。
- 各commitで索引と範囲本文を一致させ、将来commitの論点や存在しないlinkを先に入れない。
- 内部logの過去内容は意味を変えず、その所属する記録移管・修復の仕事へ含める。

無関係な `.steering/2026/202609/summary.md`、個人設定、全てのignored artifact、配布済みcache、利用先article repositoryの変更を除外する。
plan-commitsは他の四領域と実装依存が無く、同じ作業群にいたことを結合理由にしない。
実際のstage時に差分が変わっていれば再照合し、境界を変えた時は対象とrevert効果の変化を報告する。
計画作成時点は読取・差分照合であり、当時は隔離中間版の再構成・revert・各commitの動作試験を行っていなかった。実行時の境界訂正と整形は次節に記録する。

## 実行時に確認した境界の訂正

最初に作った未公開2の記録へ、3の対応表linkと作成済みの結果blockが混ざっていた。
この2箇所を2から除き、3で対応表本体と同時に追加するよう、その実行で作った未公開2・3だけを再構成した。
利用者のraw発言と予定表明は2に保持した。先行checkpoint・1、3の最終tree、worktreeは保持した。
履歴を整理するための無関係な変更や、独立仕事の統合は行っていない。

git diff --cached --checkが検出した記録4本の末尾重複改行は、単一改行へ揃えた。
対象は実装reviewの1〜5・6〜10・16〜20本文と内部log5であり、発言・本文・途中の空行は不変。
範囲本文を切り出す中間版も末尾だけ単一改行とし、後続論点を加えた時の途中空行は保持した。
skill本体の開始時bytesは変更していない。

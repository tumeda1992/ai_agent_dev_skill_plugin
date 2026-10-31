# 議論記録

## 論点1: escalate-plugin-skill-fix の取り込みの手順に、plugin の update を足す

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0（論点1）: 変更の報告

#### 変更内容0（論点1）

判断根拠: 既決事項からの導出。

- 取り込みと update が assistant の仕事であること: 利用者の発言（2026-10-31）。「え、escalateがやること終わってから私の作業じゃない？」「updateもあなたでしょ」
- update の中身: 利用先 repository の指示（plugin の source を更新した後、同じ marketplace 経由で plugin を reinstall・reload する）と、2026-10-31 に実際に行った手順（marketplace の update、plugin の update、install した commit の確認、利用者の `/reload-plugins`）。`/reload-plugins` で、同じ session に新しい version の skill が読み込まれた。
- 置き場所: 20261018 の論点38 の決定（別々に改訂する内部処理は、絡み合いの負担が無くても file を分ける）と、それを写した `skill-update-review/assess-structure.md` の切り出しの基準。

変更前: `escalate-plugin-skill-fix/SKILL.md` の「plugin repositoryでの作業完了後の取り込み」は、作業 branch の push、`main` への切替、merge、`main` の push の 4 step で終わる。「引き渡し後」は、修正した skill を使うには session を resume すると書く。

変更後:

1. 取り込みの手順を、escalate-plugin-skill-fix の内部指示 `integrate-plugin-changes.md` へ移し、plugin の update までを続ける。

   ```markdown
   # plugin repositoryでの作業の取り込みと反映

   この内部指示は、plugin repositoryでのsteeringがcommitまで終わった後に、作業を`main`へ取り込み、利用者の環境のpluginへ反映するまでを所有する。
   plugin repositoryでのsteeringが完了した時に読む。

   ## mainへ取り込む

   PRを経由せず次の4stepで`main`へ取り込む。

   1. 作業branchをpushする。
   2. `main`へ切り替える。
   3. 作業branchを`main`へmergeする。
   4. `main`をpushする。

   （PRを経由しない理由の段落は、今の SKILL.md の文をそのまま移す）

   ## pluginをupdateする

   `main`をpushしたら、続けて次を行う。利用者の作業として依頼しない。

   5. 使用中のAI agentのmarketplaceをupdateし、pluginをupdateする。Claude Codeでは、`claude plugin marketplace update <marketplace名>`と`claude plugin update <plugin名>@<marketplace名>`である。
   6. installされたpluginのcommitが`main`の先端と一致することを確かめる。
   7. 実行中のsessionへ反映する操作を、利用者へ案内する。Claude Codeでは利用者が`/reload-plugins`を打つ。sessionの中で使うcommandであり、agentからは実行できない。reloadの手段が無いagentでは、sessionをresumeする。

   利用者へ依頼するのは、agentから実行できない7の操作だけである。

   - やってしまいがちな行動: `main`のpushで手順が終わったとみなし、pluginのupdateを利用者へ依頼する
   - それをやると何が起きるか: plugin repositoryの作業の後始末が利用者へ渡り、利用者がメインの作業へ戻るのが遅れる
   - 正しい判断のための問い: 「この操作は、agentから実行できないか」
   ```

2. `SKILL.md` の「plugin repositoryでの作業完了後の取り込み」は、見出しを残し、本文を次の一文にする。context file の `### Git / GitHub公開条件` がこの見出しを名前で指すためである。

   ```markdown
   plugin repositoryでのsteeringがcommitまで終わったら、[取り込みと反映](integrate-plugin-changes.md)に従い、PRを経由せず`main`へ取り込み、pluginをupdateする。
   ```

3. `SKILL.md` の「引き渡し後」の二つの項目を直す。

   ```diff
   -- 修正したskillは、今実行中のsessionへは反映されない。skill内容はsession開始時にcacheされるためである。修正後のskillで動きたい場合は、sessionをresumeする。resumeならcontextを保ったままskillが読み直される。
   +- 修正したskillは、pluginをupdateしただけでは、今実行中のsessionへ反映されない。skill内容はsession開始時に読み込まれるためである。反映する操作は[取り込みと反映](integrate-plugin-changes.md)の7に従う。
   -- 元taskを旧版のskillのまま続けるか、resumeして修正後のskillで続けるかは、ユーザーが選ぶ。このskillが代わりに決めない。
   +- 元taskを旧版のskillのまま続けるか、反映して修正後のskillで続けるかは、ユーザーが選ぶ。このskillが代わりに決めない。
   ```

4. validator: `integrate-plugin-changes.md` の存在、4 step の merge の文と 5〜7 の文、`SKILL.md` からの参照を検査する。「sessionをresumeする。resumeならcontextを保ったまま」が `SKILL.md` に戻らないことを検査する。

- 対象と範囲: `escalate-plugin-skill-fix/SKILL.md`、新しい `escalate-plugin-skill-fix/integrate-plugin-changes.md`、validator。context file は変えない（見出しの名前で指す参照が保たれる）。
- 利用先 repository 固有の情報（marketplace 名、install した場所）は書かない。command は名前を変数にして書く。
- 検証: 反映後に validator を通し、変える前の文に戻すと落ちることを確かめる。

#### 検討記録（論点1・イテレーション0）

元の作業で assistant は、escalate の 4 step で取り込んだ後、plugin の update を利用者へ依頼し、利用者に正された。escalate の手順が `main` の push で終わっており、その後の update へつながっていなかった。
`/reload-plugins` で同じ session に新しい version の skill が読み込まれたため、「引き渡し後」の「session を resume する」は今の事実に合わない。

置き場所は、元の作業の論点9 で絞ることにした skill-update-review の判断基準（切り出しの候補）を当てて決めた。取り込みと反映は、引渡しとは別の時点（plugin repository の steering の完了）に始まり、別の完了条件（install した plugin が `main` と一致する）と別の改訂理由（agent の update の手段、Git の運用）を持つ。20261018 の論点38 の決定に従い、内部指示へ分ける。`SKILL.md` に見出しを残すので、入口から辿れなくなる箇所は無い。

[内部検討記録: 論点1・イテレーション0](./internal-records/task-design-discussion.md.topic-1.md#iteration-0)

### 決定（論点1）

escalate-plugin-skill-fix の取り込みの手順を、内部指示 `integrate-plugin-changes.md` へ移し、`main` への取り込み（1〜4）に続けて plugin の update（5）、install した commit の確認（6）、session への反映の案内（7）を assistant が行う。利用者へ依頼するのは、agent から実行できない 7 だけとする。
`SKILL.md` は「plugin repositoryでの作業完了後の取り込み」の見出しを残して内部指示を指し、「引き渡し後」の session を resume するという文を、内部指示の 7 に従う形へ直す。文は変更内容0 のとおりとする。

選択理由: 取り込みと update が assistant の仕事であることは利用者の発言による。置き場所は、20261018 の論点38 の決定（別々に改訂する内部処理は file を分ける）に従う。

### 現在の変更（論点1）

イテレーション0 の変更内容0。対象は `escalate-plugin-skill-fix/SKILL.md`、新しい内部指示 `integrate-plugin-changes.md`、validator。2026-10-31 に chat で報告した。

対応する実応答（2026-10-31、design.md の骨格と変更内容0 を示した後の利用者の発言）:

> ok

骨格への合意と、変更内容0 への異論が無いことの確認を兼ねて受け取った（chat でそう示した上での応答）。反映した。validator が通り、変える前の `SKILL.md` に戻して内部指示を除くと 12 件で落ちることを確かめた。

## 論点2: skill-update-review が切り出しの候補を見つけた時、更新の完了を止めるか

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0（論点2）: 知らせるだけにするか、完了を止めるかを決める

#### 提案0（論点2）

skill-update-review は、返す指摘を切り出しの候補に絞る（元の作業の論点9 で決定）。候補を見つけた時の扱いを、次のどちらかにする。

- a) 候補として知らせ、今切り出すかは呼出し側が決める（推奨）
    - skill-update-review は、候補ごとに、どの工程が、どの判断・状態・完了条件・改訂理由を持つかと、分ける先（同じ skill の内部指示か、別 skill か）を返す。候補が無ければ「候補なし」と返す。合格・不合格・材料不足の判定は持たない。
    - 呼出し側（task-design、tasklist-executor）は、候補ごとに、今の作業で切り出すかを `development_flow/work_scope.md` の二段目で判定する。既定は今の作業で切り出す。大きすぎる等に当たれば、別の作業にする。
    - task-design の Step 6 の完了条件は、「skill-update-review の不合格・材料不足を残さない」から、「候補ごとに、今切り出したか、別の作業にしたかが記録されている」へ変わる。
- b) 候補を不合格として返し、解消するまで更新を完了にしない（今のまま。20261018 の論点31 の決定）
    - 合格・不合格・材料不足の判定と、解消後の再 review を残す。

推奨は a。
利用者は skill-update-review に頼んだことを「skill.mdから切り出せるものがあったら分割透知しろってだけの内容だった」と述べた（2026-10-31）。a はこの言葉に合う。
論点31 が b を選んだ理由は、直さないまま完了できると、抱え込みを続ける余地が残ることだった。a でも、`work_scope.md` の既定（今の作業で拾う）と、別の作業にする時は切り出し先を先に作る決まりで、候補が流れて消えることは防げる。
a の代償は、呼出し側が「別の作業にする」と判定した時に、その場では切り出されないことである。

この論点の答えで、skill-update-review の返す結果の形と、呼出し側 4 file の完了条件の文が決まる。

#### 検討記録（論点2・イテレーション0）

20261018 の論点31 で、利用者は「b」（構造上の不合格を残して更新を完了にしない）を選んだ。今回の利用者の言葉は「通知」であり、論点31 の決定と向きが違う。利用者の内側にしか答えが無いため、採否を問う。

[内部検討記録: 論点2・イテレーション0](./internal-records/task-design-discussion.md.topic-2.md#iteration-0)

#### 提案0へのフィードバック（論点2）

**結果:** 提案0 を a で採用

> a

（2026-10-31、chat 上の発言）

### イテレーション1（論点2）: 変更の報告

#### 変更内容1（論点2）

判断根拠: 決定からの導出。この論点の a と、元の作業の論点9 の決定（返す指摘を切り出しの候補に絞る）による。

design.md の骨格に残した二つの TBD（読む範囲と記録、いつ呼ぶか）と、skill-update-review・呼出し側の文を、次のように導く。変更後の文は、design.md の「documentation以外のfile deliverable」に全文を置いた。

- 材料不足の判定を外す。a で合格・不合格・材料不足の判定を持たないと決めたため。
- 読んだ file の内容 hash の記録と、前の結果を版に結んで再利用する仕組み（`SKILL.md` の「既存結果の再利用と再review」）を外す。20261018 の論点47 は、合格の判定を後の工程で使うために版へ結んだ。判定を持たない今は、結ぶものが無い。
- 読む範囲を、対象 skill の `SKILL.md` と内部指示の全体（今回編集しない処理を含む）と、設計時の構造案に限る。呼ぶだけの別 skill、共有指示、script、更新前の比較元は読まない。20261018 の論点43〜46 でこれらを読むと決めたのは、受渡し・script の動作・共有指示の問題を見るためであり、論点9 でそれらを見ないと決めた。script を読まないのは、利用者が頼んだのが「skill.mdから切り出せるもの」であるため。
- 呼ぶ時期は変えない（設計時と編集後の両方）。範囲を絞っても、20261018 の論点33 の理由（書く前に分け方を決める、編集で生じた抱え込みを見つける）は変わらない。
- file の構成:
    - `collect-review-material.md` を削除する。中身（入力と比較元、依存先の読取、内容 hash）は切り出しの判断に要らない。残る「全体を読む」は `SKILL.md` の進行の 1 行で足りる。
    - `assess-structure.md` を `find-split-candidates.md` へ改名する。今の名前（構造の評価）は広い範囲を示し、外す照合を呼び込むため。
    - skill の名前は変えない（design.md の非目標）。
- 呼出し側（`task-design/SKILL.md` の Step 2・Step 3 の編集後 review・Step 6、`tasklist-design.md`、`templates/tasklist.md`、`tasklist-executor/SKILL.md`）:
    - 「内容識別」「材料不足」「合格の流用」「file集合・参照・解決先の照合」を外す。
    - 候補が返った時の扱いを足す。task-design は `work_scope.md` で判定して discussion で合意する。tasklist-executor は自分で切り出さず、実装 feedback として返す。
    - task-design の Step 6 の完了条件を、「候補ごとに、今切り出したか別の作業にしたかが記録されている」にする。
- validator: skill-update-review の file の一覧と assertion を新しい文に合わせる。外した文（「内容hash」「旧合格を使わない」「必要な比較元が読めなければ材料不足」「規則の正本」等）が戻らないこと、呼出し側 4 file に「内容識別」「材料不足」が無いことを検査する。
- version を 8.2.2 にする（既存 skill の内容修正のため PATCH）。

対象と範囲: 上の file だけ。20261018 と過去の steering の記録は変えない。
検証: 反映後に validator・task-design handoff test・facilitate-discussion の helper の自己 test を通し、変える前の文に戻すと validator が落ちることを確かめる。

#### 検討記録（論点2・イテレーション1）

骨格に残した TBD は、どちらも a と論点9 から一つに決まった。読む範囲・hash・材料不足は、20261018 で受渡しの照合と合否の判定のために決めたものであり、その目的が無くなった。呼ぶ時期は、変える理由が無い。
script を読まないことは、利用者の言葉（SKILL.md から切り出せるもの）による。

[内部検討記録: 論点2・イテレーション1](./internal-records/task-design-discussion.md.topic-2.md#iteration-1)

### 決定（論点2）

skill-update-review は、切り出しの候補を見つけたら、候補として知らせる。候補ごとに、どの工程が、どの判断・状態・完了条件・改訂理由を持つか、当てた変更 case、分ける先を返し、候補が無ければ「候補なし」と返す。合格・不合格・材料不足の判定は持たず、更新の完了を止めない。
今の作業で切り出すかは、呼出し側が候補ごとに `development_flow/work_scope.md` の二段目で判定する。

選択理由: 利用者の言葉「skill.mdから切り出せるものがあったら分割透知しろってだけの内容だったのに」に合う。20261018 の論点31 が解消まで完了にしないとした懸念（抱え込みが残り続ける）は、`work_scope.md` の既定（今の作業で拾う）で受け止める。
受け入れる弱点: 呼出し側が別の作業にすると判定した候補は、その場では切り出されない。

### 現在の変更（論点2）

イテレーション1 の変更内容1。対象は skill-update-review の file、`skills/README.md` の一行、呼出し側 4 file、validator、version 宣言。2026-10-31 に chat で報告した。

対応する実応答（2026-10-31、変更内容1 と、反映から取り込みまでの進め方を示した後の利用者の発言）:

> ok

反映した。design.md の「documentation以外のfile deliverable」の文のとおりに書き、`collect-review-material.md` を削除し、`assess-structure.md` を `find-split-candidates.md` へ改名した。version を 8.2.2 にした。
validator、task-design handoff test、facilitate-discussion の helper の自己 test が通る。変える前の skill-update-review と呼出し側に新しい validator を当てると、41 件で落ちることを確かめた。

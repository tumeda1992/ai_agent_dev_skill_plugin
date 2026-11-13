# 内部検討記録: 論点1 — 利用者の確認の task に、何を入れるか

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点1

## 開始context

- 問題: tasklist の利用者の確認の task に、assistant が実行・照合できる確認が入り、executor がそこで止まって利用者を待たせた。二つの作業で続けて起きた。
- 決める範囲: 利用者の確認の task に入れる確認と、入れない確認の境界。
- 開始時の既決条件:
    - design.md の骨格に利用者が合意した（2026-11-06「pluginの骨格ok」）。
    - 前回の取り込み（steering `20261031-adopt-escalated-commit-practice-improvements` の論点3）は、commit・push・PR より前に利用者の確認を置く契約を変えず、確認環境のための commit・push の例外を足した。
    - 自動 test と screenshot は、利用者が実際に触る確認を代替しない（今の `tasklist-design.md`）。
- 残る不足: 境界の判定の仕方と、起点以外の場面への当てはめ。確認をいつ置くかは、この論点の外にある。

<a id="iteration-0"></a>

## イテレーション0: 利用者の確認の task の中身の境界

<a id="iteration-0-record-1"></a>

### 調査: 今の規則は、利用者の確認の task の中身をどう決めているか

#### 問い・探索先・方法

- 問い: tasklist の設計の規則と template は、利用者の確認の task に入れるものを決めているか。
- 探索先: `plugins/tumeda-dev/skills/task-design/tasklist-design.md` の「実装後feedbackと公開action」と自己レビューgate、`templates/tasklist.md` の「動作確認」、`tasklist-executor/SKILL.md` の「停止・再開」と「実行手順」。
- 方法: `動作確認` の grep と、該当箇所の前後の通読。

#### 結果

- `tasklist-design.md`: 「自動testとscreenshotは機械的確認であり、ユーザーが実際に触る動作確認を代替しない。commit・push・PRより前にユーザー動作確認を必須にする。」 機械的な確認で利用者の確認を置き換えることだけを禁じる。
- 自己レビューgate: 「commit・push・PRより前にユーザー動作確認があるか」。失敗例は「機械的確認を『動作確認済み』と読み替え、tasklist-executorがそのままcommit・pushまで進む」。同じく置き換えの向きだけを見る。
- template の「動作確認」: DoD は「Tasks に挙げた確認をユーザーが行い、期待どおりであることを確認した」。task は「ユーザーに動作確認を依頼する（{どの操作をしてもらい、何を観測できれば満たすか}）」で、中身の制約が無い。
- `tasklist-executor/SKILL.md`: 利用者の確認の task で `user_confirmation_required` として止まる。実行手順の 11 は、全 task の後に必ず「ユーザーに動作確認を促す」。

#### 限界

- `tasklist-design.md` と template は該当箇所の前後だけを読んだ。全体の通読は、file と文を決める論点で行う。

<a id="iteration-0-record-2"></a>

### 一般化: 境界は、起点以外の場面でも意図した先へ落ちるか

#### 起点case・暫定原則・異なるcase

- 起点case: 本番の基盤を作る作業で、品質 check の後の利用者の確認の task に、command の exit code、ログ、差分と design の照合の三つが入った。
- 暫定原則: 利用者の確認の task に入れるのは、利用者が触って確かめるものと、利用者のところにだけ届くものだけ。それ以外は assistant の確認として DoD と品質 check に入れる。
- 異なるcase: 画面の操作の変更、通知の email の文面の変更、画面の無い API の変更、文書だけの変更、画面の撮影。

#### 異なるcaseへの当てはめ

- 画面の操作の変更: 感触と利用者の端末での表示は、利用者の手と目が要る。利用者の確認に入る。今の規則と同じ。
- 通知の email の文面の変更: 利用者の受信箱に届いたものは、利用者にしか見えない。利用者の確認に入る。
- 画面の無い API の変更: request と response は assistant が観測できる。assistant の確認に入る。
- 文書だけの変更: 差分と design の照合は assistant ができる。利用者が差分を見るのは review の場面である。assistant の確認に入る。
- 画面の撮影: 撮影した画面の判定は assistant ができる。ただし今の規則どおり、利用者が触る確認の代わりにはならない。撮影は assistant の確認、触るのは利用者の確認と、二つに分かれる。

#### 結果

境界は、起点以外の五つの場面で意図した先へ落ちた。画面の撮影の場面で今の規則と同じ結論になり、今の規則を緩めない。境界が埋めるのは、機械的な確認を利用者の確認の task に入れるという、今の規則が見ていない逆向きの抜けである。

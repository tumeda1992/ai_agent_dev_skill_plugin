# 議論記録

## 論点1: 基盤の変更を停止・確認 task の対象から外す条件を、どこにどう書くか

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0（論点1）: 外す単位（作業か action か）と置き場を決める

#### 提案0（論点1）

`skills/task-design/tasklist-design.md` の「作業の外へ残るactionを含むphaseの原則」の中で、二つ目の MUST（phase の最後の停止・確認 task）に、基盤の変更を外す条件を書く。外す単位は作業ではなく action とする。

変更後の二つ目の MUST と、その直後に足す段落:

> - **MUST**: そのphaseの最後に「ここで作業を停止し、対象actionの結果をユーザーに確認する。次phaseへは進まない」というtaskを置く。ただし、対象actionが基盤の変更（cloud の resource とその構成、それを定義する Terraform 等、それを届ける workflow の変更）である時は置かない。
>
> 基盤の変更を外すのは、基盤の作業では外を変えることそのものが成果物で、適用の確認が届ける経路に組み込まれているためである。plan の要約を利用者が読んで merge し、一度だけの操作は利用者が command ごとに実行の許可で見てから通し、結果は command の出力で判定でき、後の phase がその結果を前提として確かめる。停止・確認 task を置いても、利用者が確かめるものの無い待ちになる（上の「止まるtaskの原則」）。application の作業の DB の migration のように、作業の目的の外で起き、後続の変更がその上に積み上がる副作用には、この MUST を当てる。一つの作業が両方を含む時は、action ごとに判定する。

- 一つ目の MUST（単独 phase への切り出し）と三つ目の MUST（受け入れ基準の引き継ぎの観点）は、基盤の変更にも残す。三つ目の MUST の「停止・確認taskでは、…照合する」は、基盤の変更では停止しない phase の最後の task として行う。この旨を三つ目の MUST に書き足す。
- 「止まるtaskの原則」の一つ目（「作業の外へ残るactionを含むphaseの最後」）に、「（基盤の変更を除く）」を足す。
- 「利用先固有の差し込み」は、基盤の変更の phase では、宣言された action を停止しない phase の最後の task として書く（問いの形は今どおり review で問う）。この旨を差し込みの表の下に一文足す。

#### 検討記録（論点1・イテレーション0）

##### 規則の経緯（この repository の steering の記録から）

- 元は「migration phaseの原則」で、DB の migration を対象にしていた。
- 2026-08-31 に「作業の外へ残るactionを含むphaseの原則」へ一般化し、判定の問い（この作業を破棄しても残るか）と例（DB migration の適用、deploy / release、外部 service の設定変更、本番データの移行・削除）を足した。MUST の文面は変えなかった。
- この一般化で、基盤の作業（外の変化そのものが成果物）も、判定の問いに当たるようになった。利用者の「アプリケーション層でのdbのマイグレーションのときに入れた」「インフラは外で変わることが基本」は、この一般化で対象が広がりすぎたことを指す。

##### 外す単位を作業ではなく action にする理由

基盤の変更と application の副作用は、一つの作業に同時に現れる。例えば、後続の作業で job の resource を Terraform で足し、同じ作業で DB の migration も行うことがある。「基盤の作業は例外」と作業の単位で書くと、その作業の migration まで停止 task から外れる。action ごとに判定すれば、Terraform の変更は PR と merge の経路で確かめ、migration の phase の最後では止まる。

##### 当てた具体 case（task-design Step 4 の「新しい判断基準の検証」）

| case | 対象 action | 規則を当てた結果 |
| --- | --- | --- |
| 起点: Terraform と GitHub Actions の経路を作る作業 | 初回の構築、secrets の登録、旧 deploy の resource の削除、merge による apply | どれも基盤の変更。停止しない（利用者が求めた結果と一致） |
| application の作業で、共有の DB へ migration を当てる | migration の適用 | 基盤の変更ではない。停止する（元の目的どおり） |
| 一つの作業で job の resource を Terraform で足し、DB の migration も当てる | Terraform の apply、migration の適用 | Terraform は停止しない。migration の phase は停止する |
| 本番データを一括で移す・消す作業 | 本番データの移行・削除 | 基盤の変更ではない。停止する |

「GitHub の secrets の登録」は、基盤を届ける workflow の設定であり、基盤の変更に含める。外部 service の設定変更のうち、基盤を届ける経路に関わらないもの（例: 利用者の通知の設定）は、この条件に当たらず停止する。

##### 置き場を tasklist-design.md にする理由

外すのは tasklist-design.md の MUST の適用範囲であり、MUST を読んで当てる場面で例外が見えなければ、MUST が当てられ続ける。`docs/development_standards/infrastructure/` に置くと、tasklist-design.md の MUST と食い違う文書が二つできる。基盤に固有の手順を書くのではなく、汎用の規則の適用範囲を書くため、汎用の skill に置いても、基盤の作業でない設計に余計な手順を足すことにはならない。

##### 候補

| 候補 | 形 | 評価 |
| --- | --- | --- |
| a | tasklist-design.md の二つ目の MUST に、action の単位で基盤の変更を外す条件と理由を書く | 推す |
| b | 作業の単位で「基盤の作業には当てない」と書く | 採らない。同じ作業の DB の migration まで外れる |
| c | `docs/development_standards/infrastructure/` に、基盤の作業では停止 task を置かないと書く | 採らない。MUST を当てる場面で見えず、二つの文書が食い違う |
| d | 条件を「外の変化が作業の成果物そのものである action」と性質で書き、基盤に限らない | 採らない。利用者の合意は基盤までで、release や外部 service の設定の作業へ広げる根拠が無い |

##### skill-update-review（構造案の採用前）

- 対象と段階: task-design（`SKILL.md` と内部指示 `tasklist-design.md`、`roadmap-design.md`）、設計時。三つの全体を読んだ。
- 結果: 候補なし。
- 当てた変更 case: 外す範囲を変える（例: 基盤の変更に加えて、別の種類の action も外す）。直すのは `tasklist-design.md` の「作業の外へ残るactionを含むphaseの原則」の二つ目の MUST とその直後の段落だけで、他の工程の記述を直す必要は出ない。構造案は新しい工程・状態・完了条件を足さず、既存の MUST の適用範囲を書き足すだけである。
- 今回編集しない処理（既存 design の handoff gate、技術検証実装、roadmap の設計）は、既に別の file（`task-design-work-handoff-contracts.md`、`roadmap-design.md`）へ分かれているか、固有の状態・完了条件を持たない。

#### 提案0へのフィードバック（論点1）

**結果:** 前提の訂正（停止 task を入れた本当の理由）

> なんだったらdbのマイグレーションもそこでコミットとプッシュして、作業環境が飛んでも同期できない状態を避けたくて、その頃一括コミット時代だったから停止を入れただけで本当は止まらなくてもコミットプッシュできればいいだけなんだよな

### イテレーション1（論点1）: 停止 task を、作業の外へ残る action の直後の commit・push に置き換える

#### 提案1（論点1）

基盤の変更だけを例外にするのではなく、作業の外へ残る action のすべてについて、phase の最後の停止・確認 task を、その action の元になった変更を commit・push する task に置き換える。止まらずに次の phase へ進む。

`skills/task-design/tasklist-design.md` の変更:

- 「作業の外へ残るactionを含むphaseの原則」
  - 一つ目の MUST（単独 phase への切り出し）: 変えない。
  - 二つ目の MUST を次に置き換える。
    > **MUST**: そのphaseの最後に、対象actionの元になった変更（migration の file、Terraform の定義等）と、そのphaseまでの作業記録をcommitし、作業branchをpushするtaskを置く。止まらずに次のphaseへ進む。対象actionがmergeで動く適用（PRをmergeするとapplyが動く等）なら、元になった変更はmergeの前にremoteにあるため、このtaskは要らない。
  - 理由の段落を次に置き換える。
    > 理由: 対象actionは作業を破棄しても残る。対象actionの後に作業環境（開発機のworking tree）が失われると、外の状態だけが進み、それを生んだ変更がどこにも無くなって、外の状態とrepositoryを同期できなくなる。例えば共有のDBへmigrationを当てた後にworking treeを失うと、DBには当たっているmigrationのfileがどこにも無い。pushしておけば、別の環境から続きを行える。以前はここに停止・確認taskを置いていた。commitを作業の最後にまとめていた頃に、途中でcommit・pushする機会を作るためだった。止まる必要は無い。
  - 三つ目の MUST の「停止・確認taskでは、…照合する」を、「phaseの最後のcommit・pushの前に、…照合する」にする。
- 「止まるtaskの原則」: 止まる task を「利用者の確認」の一つだけにする（作業の外へ残る action の phase の最後を外す）。
- 「利用先固有の差し込み」: 表の列「停止・確認taskへ書くもの」を「phaseの最後へ書くもの」に、「既定の停止・確認taskのみ」を「commit・pushのtaskのみ」にし、本文の「停止・確認taskへ書き込む」を「phaseの最後のtaskへ書き込む」にする。
- 「実装後feedbackと公開action」: 利用者の確認の前に許す commit・push に、「作業の外へ残るactionを含むphaseの最後のcommit・push」を足す（今は `UI確認環境` が定める commit・push だけ）。
- 自己レビュー gate: 「差し込み宣言を要求したか」の「既定の停止・確認taskだけを置く」を「commit・pushのtaskだけを置く」にし、「対象actionを含むphaseの最後に、commit・pushのtaskがあるか」を足す。

同じ例外（利用者の確認の前に許す commit・push）を、次の 4 か所にも足す。

- `skills/steering/SKILL.md` の 6-1（executor へ渡す時の禁止）と「このskillが絶対にやらないこと」
- `skills/tasklist-executor/SKILL.md` の「停止・再開」
- `skills/task-design/templates/tasklist.md` の「完了後のaction」の注意書き

`skills/tumeda-dev-plugin-context.md` の `### 作業の外へ残るactionの差し込み` の comment の「停止時に」を「phaseの最後に」にする。

#### 検討記録（論点1・イテレーション1）

##### 訂正された前提

提案0 は、停止 task の目的を、MUST の理由の段落に書かれたとおり「利用者が適用の事実を確かめてから後続へ進む」ことと読み、基盤の変更ではその確認が届ける経路に組み込まれているから要らない、と組み立てていた。利用者によれば、停止 task を入れた本当の目的は、作業環境が失われても外の状態と repository を同期できるように、その時点で commit・push することだった。当時は commit を作業の最後にまとめていたため、途中で commit・push する機会として停止を入れた。

つまり、理由の段落が本当の目的を書いていなかった。この食い違いは基盤に限らず、DB の migration にも当てはまる。基盤だけを例外にすると、migration の phase では、もう要らない停止が残る。

##### 原因の分類（facilitate-discussion の原因 owner）

skill の不足である。MUST の理由が目的と違うことを書いていたため、読んだ assistant は停止を「利用者の確認」と解釈し、利用先の作業で、利用者が確かめるものの無い停止 task を置いた。直すのは skill の規則そのもので、利用先の具体 case の修正（停止 task を外す）は、利用先で既に利用者の合意を得ている。

##### 当てた具体 case

| case | 対象 action | 規則を当てた結果 |
| --- | --- | --- |
| 起点: Terraform と GitHub Actions の経路を作る作業 | 手元からの初回の構築、secrets の登録、旧 deploy の resource の削除、merge による apply | 初回の構築の phase の最後で、Terraform の定義を commit・push する。削除の phase の最後で、削除の記録（tasklist の進み）と repository の旧 file の削除を commit・push する。merge による apply は、元の変更が merge の前に remote にあるため、commit・push の task は要らない。どこでも止まらない |
| application の作業で、共有の DB へ migration を当てる | migration の適用 | phase の最後で migration の file を commit・push し、止まらずに進む（本来の目的） |
| 外へ残る action の無い作業（code の変更と test だけ） | なし | この原則は当たらない。commit・push は今どおり作業の最後（利用者の確認の後）に行う |

##### 利用者の確認の前の commit・push との関係

今の steering、tasklist-executor、tasklist-design、tasklist の template は、利用者の確認の前の commit・push を、`UI確認環境` が定める載せ方の時だけ許す。対象 action の phase の最後の commit・push は、この禁止に当たる。例外として足さないと、executor が phase の最後の task を実行できない。

##### commit・push ができない repository

repository の context に local Git 運用条件や GitHub 公開条件が無い時の扱いは、今の「実装後feedbackと公開action」の決まり（縮退も停止もせず利用者へ確認する）に従う。新しい決まりは足さない。

##### skill-update-review（構造案の採用前、提案1 の範囲）

- 対象と段階: task-design（`SKILL.md`、`tasklist-design.md`、`roadmap-design.md`）に加え、提案1 で一文を足す steering と tasklist-executor の `SKILL.md`。設計時。
- 結果: 候補なし。提案1 は新しい工程・状態・完了条件を足さず、既存の MUST の中身（停止 → commit・push）と、既存の例外（利用者の確認の前に許す commit・push）の列挙を変えるだけである。
- 当てた変更 case: 許す commit・push の種類をもう一つ増やす。直すのは、例外を列挙する 5 か所の文だけで、他の工程の記述は直さない。

#### 提案1へのフィードバック（論点1）

**結果:** 修正の要求（止まる task の種類が足りない）

> prのマージ含め、ユーザしかできないことでは止まらざるを得ないんじゃない？
> prのaiによるマージは禁止してるし、このプラグイン以外では、main級のブランチへのマージを禁止してるし。あと、シンプルに権限的にaiが実行できないコマンドとか

### イテレーション2（論点1）: 止まる task に「利用者にしかできない操作」を加える

#### 提案2（論点1）

提案1 の置き換え（作業の外へ残る action の phase の最後は、停止ではなく commit・push）は保つ。そのうえで、「止まるtaskの原則」の止まる task を、次の二つにする。

1. **利用者にしかできない操作を待つ**: assistant が行うことを禁じられている操作（PR の merge、既定 branch への merge 等。どれが禁じられているかは repository の context と plugin の規則が決める）と、assistant の権限では実行できない command。その操作を必要とする phase の最後に置き、何を利用者が行うか、行われた後に assistant が何を確かめて続けるかを書く。
2. **利用者の確認**: 今どおり（利用者にしか確かめられないものだけを、利用者が触れるものが揃った後に一度だけ）。

`skills/task-design/tasklist-design.md` の「止まるtaskの原則」の書き換え:

> tasklistは、止めずに最後まで進む前提で作る。止まるtaskを置くのは、次の二つだけである。
>
> - 利用者にしかできない操作（下の「利用者にしかできない操作」）
> - 利用者の確認（「実装後feedbackと公開action」）

足す小節「利用者にしかできない操作」（「止まるtaskの原則」の直後）:

> assistantが行うことを禁じられている操作と、assistantの権限では実行できないcommandは、利用者が行う。例: PRのmerge、既定branchへのmerge（どちらを禁じるかはrepositoryのcontextとpluginの規則が決める）、権限の無いcommand。
>
> - そのtaskは、操作を必要とするphaseの最後に置く。executorはそこで`phase_checkpoint`を返して止まる。
> - taskには、利用者が行う操作と、行われた後にassistantが確かめて続けることを書く。
> - 判断の問い: 「この操作を、assistantが行ってよく、行えるか」。どちらかがNoなら、利用者にしかできない操作である。
>
> 作業の外へ残るactionのphaseの最後のcommit・pushも、assistantが行えない時はこの操作に当たる。

提案1 のほかの変更（二つ目の MUST の置き換え、理由の段落、三つ目の MUST の照合の位置、差し込み、利用者の確認の前に許す commit・push の例外を 5 か所に足す、自己レビュー gate）は変えない。自己レビュー gate には、「利用者にしかできない操作のtaskが、操作を必要とするphaseの最後にあり、利用者が行う操作と、その後にassistantが確かめることを書いているか」を足す。

#### 検討記録（論点1・イテレーション2）

##### 提案1 の欠け

提案1 は、止まる task を「利用者の確認」だけにした。利用者の確認は、利用者にしか確かめられないものを見る task で、利用者にしかできない操作（merge 等）は含まない。今の「止まるtaskの原則」も、「作業の外へ残る action の phase の最後」と「利用者の確認」の二つしか持たず、この種類を持っていなかった。

利用先の作業の tasklist は、検証のための PR を利用者が merge するのを待つ task を置き、「確認のための停止ではなく、merge が利用者の担当であるための待ち」と書いて、どちらの種類にも当たらないことを本文で説明していた。原則に無い種類の停止が、実際には要っていた例である。

##### 実行時の停止理由

`runtime-execution-contracts.md` の停止理由のうち、`user_confirmation_required` は「tasklistが要求するユーザー動作確認を待つ」で、操作を待つことは含まない。`blocked` は「必須入力・外部状態・権限が不足している」で、計画していない不足を表す。利用者にしかできない操作の task を phase の最後に置けば、既にある `phase_checkpoint`（合意された Phase 境界まで完了した）で止まれる。停止理由を増やさずに済む。

##### 当てた具体 case

| case | 操作 | 原則を当てた結果 |
| --- | --- | --- |
| 起点の作業の検証のための PR | 利用者が master へ merge する | 止まる（利用者にしかできない操作）。PR を作る phase の最後に置き、merge の後に apply の結果を確かめる phase へ続く |
| 起点の作業の初回の構築 | assistant が手元から apply し、定義を commit・push する | 止まらない（assistant が行ってよく、行える） |
| plugin repository で、引き渡された作業を `main` へ取り込む | assistant が merge して push する（この repository の context が定める） | 止まらない |
| 権限の無い操作（例: 組織の管理者だけが変えられる設定） | 利用者が行う | 止まる |
| application の作業の migration | assistant が当てて commit・push する | 止まらない |

#### 提案2へのフィードバック（論点1）

**結果:** 合意

> ok

### 決定（論点1）

作業の外へ残る action を含む phase の最後の停止・確認 task を、その action の元になった変更とそこまでの作業記録を commit・push する task に置き換え、止まらずに次の phase へ進む。止まる task は、利用者にしかできない操作（assistant が行うことを禁じられている操作と、権限で実行できない command。操作を必要とする phase の最後に置き、`phase_checkpoint` で止まる）と、利用者の確認の二つにする。

- `skills/task-design/tasklist-design.md`:
  - 「止まるtaskの原則」の二つを、利用者にしかできない操作と利用者の確認にする。
  - 小節「利用者にしかできない操作」を足す（例、置く場所、task に書くこと、判断の問い「この操作を、assistantが行ってよく、行えるか」、commit・push を行えない時もこれに当たること）。
  - 「作業の外へ残るactionを含むphaseの原則」の二つ目の MUST を commit・push の task に置き換え（merge で動く適用なら要らない）、理由の段落を本当の目的（作業環境が失われても外の状態と repository を同期できるようにする。以前の停止は一括 commit の頃に commit・push の機会を作るためだった）に書き直し、三つ目の MUST の照合を commit・push の前に行う形にする。
  - 「利用先固有の差し込み」の書き込み先を phase の最後の task にする。
  - 「実装後feedbackと公開action」の、利用者の確認の前に許す commit・push に、作業の外へ残る action の phase の最後の commit・push を足す。
  - 自己レビュー gate を合わせる。
- 同じ例外を `skills/steering/SKILL.md`（2 か所）、`skills/tasklist-executor/SKILL.md`、`skills/task-design/templates/tasklist.md` に足し、`skills/tumeda-dev-plugin-context.md` の差し込みの comment を合わせる。

選択理由: 停止 task を入れた本当の目的は、作業環境が失われても外の状態と repository を同期できるよう、その時点で commit・push することだった（利用者の訂正）。MUST の理由の段落はこれを書いておらず、停止を利用者の確認と読ませ、利用者が確かめるものの無い停止を生んだ。目的は止まらずに commit・push すれば満たせ、基盤に限らず DB の migration にも当てはまるため、基盤だけを例外にする案（提案0）は採らない。一方、利用者にしかできない操作（merge、権限の無い command）では止まらざるを得ず、今の原則はこの種類を持っていなかったため足す。停止理由は既存の `phase_checkpoint` で足りる。

#### 反映の記録（論点1）

- 決定のとおり、`tasklist-design.md`、`steering/SKILL.md`、`tasklist-executor/SKILL.md`、`templates/tasklist.md`、`tumeda-dev-plugin-context.md`、`validate-plugin.mjs` を書き換え、配布 version を 9.0.4 にした（`design.md` の付録「設計中に反映を終えた変更」）。
- document-review（更新時観点）: `tasklist-design.md` の理由の段落に、前の版で停止を置いていた経緯を書いていた。`modify_description_policy.md` の「議論の経緯や指摘への反論を本文に持ち込まない」に当たるため消し、読者が自分で抱く誤り（phase の最後で止まって確かめてもらう）を、やってしまいがちな行動として書いた。
- skill-update-review（編集後）: 対象は task-design（`SKILL.md`、`tasklist-design.md`、`roadmap-design.md`）と、一文を変えた steering と tasklist-executor の `SKILL.md`。候補なし。足した小節「利用者にしかできない操作」は、止まる task の種類の一つを定めるもので、固有の状態・完了条件を持たず、既存の停止理由 `phase_checkpoint` を使う。当てた変更 case（利用者にしかできない操作の例を増やす）で直すのは、この小節だけである。


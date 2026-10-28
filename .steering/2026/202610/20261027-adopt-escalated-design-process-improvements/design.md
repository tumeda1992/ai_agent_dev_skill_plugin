# Design: 利用先から引き渡された設計 process の改善 3 件を plugin へ取り込む

## 元の依頼内容

利用先 repository から escalate-plugin-skill-fix で引き渡された改善提案 3 件。利用先固有の情報は除いてある。3 件を一つの steering にまとめたのは引き渡した assistant の判断であり、利用者の指示ではない。分け方は task-design が判断してよい。

1. task-design の design 合意判定（Step 4）で、作業を破棄しても残る変化（既定 branch への merge による deploy、schedule の有効化、外部 service の設定変更など）が含まれるかを確かめる。含まれる場合、それを後から止める・確かめる・変える手段が design.md の受け入れ基準にあることを、design 合意の前に確かめる。
   - 具体例: 定期実行の schedule を有効にする作業で、design の合意を得た後、tasklist を設計する段階で tasklist-design.md の「作業の外へ残るactionを含むphaseの原則」に当たった。この原則は引き継ぎの観点を design.md の受け入れ基準へ入れることを MUST としている。そのため合意済みの design へ戻り、新しい提案（定期起動の止め方・結果の確かめ方を運用の文書に書き、受け入れ基準に入れる）を出して合意をやり直した。
   - 根拠: 引き継ぎの観点は design の受け入れ基準に属するのに、それを求める規則が tasklist 設計の段階にしか無い。

2. 暫定の判断を記録・提示するときは、暫定であること・理由・見直す条件（または切り出した先）を落とさない。置き場所は利用者が選んだ: 文書は plugin の文書規約（docs/documentation_standards/）に標準を足し、document-review の作成時・更新時の観点に加える。提案は think-through に、提示する判断が暫定か恒久かを問う問いを足す。
   - 具体例 a: 先行の steering が初回公開の範囲を絞るため、ある機能が使う runtime の経路を暫定で無効にし、design に「その機能を公開機能へ加える判断をした時点で改めて設計する」と書いた。それを README へ写した記述は「経路を無効に保つため」「runtime へ渡したくない変数」となり、暫定性と見直しの条件が落ちた。後の session の assistant はこの README だけを読み、利用者に「最初から動かさない設計」と誤って答えた。
   - 具体例 b: 後続の作業の design.md の非目標が、先行 steering の条件付きの保留（「実測が許容時間に近い場合のみ別途合意する」）を「行わないと決定済み」と書いていた。同じ design の別の非目標も「別作業に切り出し済み」と書いていたが、切り出した issue は実在しなかった。
   - 具体例 c: assistant が、本番への適用を遅らせないため今はやらない非同期化を「どちらの形もやらない」と提示した。利用者の指摘「暫定提案と恒久提案が混ざってるな。今やらないのは確かだけど、見え方はずっとやらない、に見える」。
   - 根拠: 暫定の判断は時間が経つと理由と見直しの条件が伝わらなくなり、恒久方針と取り違えた読み手は見直すべき判断を前提として固定する。文書と提案の両方で同じ失敗が起きた。利用者の指示「ドキュメンテーション方針をどこかに書いて、既存か新規の参照する仕組みで縛り、再発防止に努めなさい」。

3. task-design に、作業中にその場でしか気付けない不備の扱いの基準を入れる。
   - 小さければ今の作業（同じ issue・steering）で拾う。別 issue へたらい回しにしない（ボーイスカウトルール）。
   - 次のどれかに当たるものだけを別の issue・steering に切り出す: 大きすぎる / 単体で分けた方が revert しやすい / 今の作業に含めると本番への適用が遅れる。
   - 切り出すときは「今はやらない」理由と切り出した先を書く（提案 2 と同じ規則）。
   - 対になる scope の判定: 途中で新しい判断が出たら、最初に合意済み scope の内か外かを判定する。scope 内で design の範囲を変え得る判断が未決なら design の合意を求めない。scope 外の判断は design で扱う判断にしない（ただし小さな不備は上の基準で拾う）。「選択肢にコード変更が含まれる」ことは scope 内の根拠にならない。
   - 具体例（拾う）: 作業中に README の暫定性の欠落を見つけ、assistant は scope 外として別 issue を推奨した。利用者は「ボーイスカウトルールだよ。その場で気付いたゴミがデカすぎなきゃ拾わないとゴミだらけになるだろ」としてその作業に含めた。同じ作業の中で、CI の state lock の待ち時間の不備（workflow 3 行）も同じ基準で拾った。
   - 具体例（切り出す）: 大きな機能の削除（revert を分けたい）、同期処理の非同期化（本番への適用を遅らせる）。
   - 具体例（scope 判定）: design の合意を求めている最中に、依存する別の試行が入ったのに合意を催促した。その後、scope 外と決めていた作業の費用を下げる案を design で扱う判断として起こした。
   - 根拠: task-design と facilitate-discussion の scope 判定は「現在の目的の決定・実装範囲が変わるか」で議論の対象に含めるかを決める。この判定だけでは、範囲を変えない小さな不備が scope 外として毎回別 issue へ回り、誰も拾わずに溜まる。逆に何でも抱えると本番への適用が遅れ、revert の単位が崩れる。

---

## TL;DR

利用先の作業で、設計 process の不足による失敗が 3 つ起きた。
(1) 作業を破棄しても残る変化の引き継ぎ観点を、design の合意後の tasklist 設計で初めて求められ、design の合意をやり直した。
(2) 暫定の判断が、文書でも提案でも恒久方針のように書かれ、読み手（後の session の assistant を含む）の誤った回答や設計を招いた。
(3) その場で気付いた小さな不備を scope 外として別 issue へ回そうとし、不備を溜める方向へ判断した。

それぞれの失敗は、判断が必要になる時点の skill・標準に、その時点で問うべき問いが無いことから起きている。
終了時には、その問いが判断の時点の skill・標準に置かれ、既存の関門（design 合意判定、`document-review`、思考標準の参照）から必ず当たる状態にする。

3 件は一つの design で扱う。改善 3 の「切り出すときは理由と切り出し先を書く」は改善 2 の規則と同じであり、二つはつながっている。revert の単位は、改善ごとに commit を分けて保つ。

---

## 完成後の姿

### 改善 1: design 合意判定で、作業の外へ残る変化の引き継ぎ観点を確かめる

「作業を破棄しても残る変化」の判定の定義を `tasklist-design.md` から `task-design/SKILL.md` の Step 4（design合意判定）へ移し、Step 4 で受け入れ基準を確かめる（決定の経緯は [task-design-discussion.md](task-design-discussion.md)）。

```text
 変更前                                   変更後
 SKILL.md Step 4      （該当項目なし）      SKILL.md Step 4      判定の問い・例の表・
                                                                 判定に使わない観点・
                                                                 受け入れ基準の確認
 tasklist-design.md   判定の問い・例の表・   tasklist-design.md   phase の作り方だけ
                      受け入れ基準の MUST・                       （判定は Step 4 を参照）
                      phase の作り方
 templates/design.md  受け入れ基準の       templates/design.md  受け入れ基準の comment
                      記入時の comment                           は変えない
```

`tasklist-design.md` は plan phase の直前に完全に読む分割 file であり、design 合意の時点では読まれない。`SKILL.md` は常に全部読まれるため、定義を本体に置き、分割 file から参照する向きにする。`templates/design.md` の受け入れ基準の comment は同じ趣旨を書いているが、記入時の注意であり関門にならない。

**`task-design/SKILL.md` Step 4 に足す確認項目「作業の外へ残る変化の引き継ぎ」**

- 判定の問い: 「この作業で起きる変化は、この作業を破棄しても残るか」。
- 例の表: `tasklist-design.md` の 6 行（DB migration の適用、deploy・release、外部 service の設定変更、本番データの移行・削除は残る。未 release の公開 API の code 変更、通常の code 変更・test 追加は残らない）を、主語を phase から作業に変えて移す。
- 判定に使わない観点: 「破壊的」「後方互換性がない」ではなく、変化が及ぶ範囲で分ける。判定は利用先の運用に依存し、plugin は問いだけを持つ。いずれも `tasklist-design.md` の文を移す。
- 確認: 残る変化があるなら、それを後から更新・確認・復旧できることが受け入れ基準に入っているか。入っていなければ design 合意へ進まない。
- やってしまいがちな失敗: 引き継ぎの観点を tasklist 設計で初めて問われ、合意済みの design へ戻って合意をやり直す。具体例: 定期実行の schedule を有効にする作業で、止め方と結果の確かめ方を運用の文書に書くことが、design 合意の後に受け入れ基準へ加わった。
- 書き方は Step 4 の既存の確認項目（太字の項目名、やってしまいがちな失敗、判断基準）にそろえる。

**`task-design/tasklist-design.md` の「作業の外へ残るactionを含むphaseの原則」**

| 部分 | 変更 |
| --- | --- |
| 節の冒頭 | 「`SKILL.md` Step 4 で特定した、作業を破棄しても残る変化を起こす action を対象actionとし、それを含む phase に次の MUST を当てる」を書く。同じ file の自己レビューgate と利用先固有の差し込みの「対象action」は、この定義を指す |
| 判定の問い、例の表、判定に使わない観点、利用先依存の注記 | 削る。対象actionの判定は、冒頭の一文で Step 4 へ渡す |
| MUST: 引き継ぎの観点を `design.md` の受け入れ基準へ入れる | 「Step 4 で受け入れ基準へ入れた引き継ぎの観点を前提にする。入っていなければ design へ戻す」に置き換える。停止・確認 task での照合と、方針が変わっていたら design へ戻す文は残す |
| MUST: 単独 phase に切り出す、停止・確認 task を置く。理由。利用先固有の差し込み | 変えない |

冒頭の一文が要るのは、Step 4 へ移す判定の問いの主語が作業であり、`tasklist-design.md` は phase 単位で「対象actionを含むphase」を使い続けるためである。作業単位の判定から phase 単位の対象へ渡す文が無いと、どの phase に MUST を当てるかが決まらない。

### 改善 2: 暫定の判断を記録・提示するとき、暫定性・理由・見直す条件を落とさない

規範の正本は新しい文書標準 `docs/documentation_standards/provisionality_explicitness.md`（暫定性の明示）の一つだけとし、三つの経路から参照する（決定の経緯は [task-design-discussion.md](task-design-discussion.md)）。

```text
                 provisionality_explicitness.md（正本）
                   ▲              ▲                 ▲
   経路1           │   経路2      │                 │ 参照のみ
 document-review ──┘ task-design ─┘   stock-and-flow-information.md
 （docs・skill本体）  SKILL.md の一文    「議論結果をそのまま転記する」
                     templates/design.md
                     の非目標 comment
                     （steering の作業記録）

   経路3（提案）: think_standards/making_and_choosing_options.md
                  文書標準を参照せず、提案の場面の問いだけを持つ
```

**新しい標準 `provisionality_explicitness.md` の構成**

- 対象: 今回の範囲に限った判断（「今回は含めない」「今回は無効にする」）、条件付きの保留（「〜の場合のみ別途合意する」）、別の作業への切り出し。
- MUST: 暫定の判断を書くときは、暫定であること（今回の範囲の判断であり、恒久の方針ではないこと）、暫定にした理由、見直す条件または切り出した先、の 3 点を書く。
- 写すときの規則: design から README へ、先行の steering から後続の design へ写すときも 3 点を落とさない。結論だけを写さない。
- 判断の問い: 「見直す条件を知らない読み手がこの文だけを読んだら、恒久の方針と受け取らないか」。
- やってしまいがちな失敗: 具体例 a（README へ写すときに暫定性と見直しの条件が落ち、後の読み手が恒久の設計と答えた）、具体例 b（条件付きの保留を「行わないと決定済み」と写した。実在しない切り出し先を「切り出し済み」と書いた）。利用先固有の情報を除いた形で書く。
- 検知手段: 「しない」「含めない」「無効」「保留」「別途」「切り出し」を含む文を拾って判断の問いを当てる。写した記述は元の文と並べて比べる。
- 該当しない例: 責務の境界に基づく恒久の判断には、見直す条件を求めない。
- 書き方は同じ階層の既存標準（`referent_explicitness.md` 等）の節構成にそろえる。

**経路ごとの変更**

| 経路 | 対象 file | 変更 |
| --- | --- | --- |
| 1: docs と skill 本体 | `skills/document-review/SKILL.md` | 作成時観点と更新時観点に「暫定性 → `provisionality_explicitness.md`」を足す |
| 1 の前提 | `docs/documentation_standards/README.md` | 「収録している標準」の一覧へ、既存の行と同じ形式で `provisionality_explicitness.md` の 1 行を足す |
| 2: steering の作業記録 | `skills/task-design/SKILL.md` | `confidentiality.md` を参照する一文の隣に、「成果物へ暫定の判断を書くときは、暫定であること・理由・見直す条件または切り出した先が落ちていないかを `provisionality_explicitness.md` で確認する」を足す。後続の作業は先行の作業記録を前提として読むため、`design.md` の非目標と、先行の steering から写した記述も確認の対象に含める |
| 2 | `skills/task-design/templates/design.md` | 「非目標」の comment に「今回扱わない理由と、見直す条件または切り出した先を書く。責務の境界など、今回に限らない判断なら見直す条件は要らない」を足す。非目標には恒久の判断も並ぶため、見直す条件を一律に求めると正本の「該当しない例」と食い違う |
| 3: 提案 | `docs/think_standards/making_and_choosing_options.md` | 補助節「補助: 提案が暫定か恒久かを示す」を足す。主軸（材料が枯れていないと、案も作れず、選ぶこともできない）は変えない。既存の補助節と同じく、やってしまいがちな行動・それをやると何が起きるか・正しい判断のための問いで書く。中身: 「今はやらない」「今回だけ」の判断を提示するときは、理由と、見直す条件または切り出す先を添える。判断の問い「この提案を受け取った人は、ずっとやらない判断と読まないか」。具体例 c。末尾の「正しい判断のための問い」の一覧には足さない（既存の補助節も一覧に載っていない） |
| 参照 | `docs/documentation_standards/stock-and-flow-information.md` | 「議論結果をそのまま転記する」アンチパターンから `provisionality_explicitness.md` へ参照を足す |

見出しに「補助:」を付けるのは、`docs/think_standards/evolution_policy.md` が各場面の主軸を一つにし、独立した補助判断の見出しに「補助:」を付けると定めているためである。新しい節は主軸の説明ではなく、独立した補助判断に当たる。

`think_standards/README.md` は変えない。`making_and_choosing_options.md` へ足す節は同じ場面（案を作る・提示する・選ぶとき）の中にあり、一覧の行が示す場面は変わらないため。

`docs/documentation_standards/README.md` の「標準の置き方」にある観点の向きの段落にも、条件を一つ足す。今の段落は、読者が使えるかを見る観点は steering の作業記録に当たらないと書いており、作業記録へも当てる新しい標準と食い違うためである。足す文: 「ただし前者でも、後続の作業が steering の作業記録を前提として読み、その記録の書き方で失敗が起きる標準は、作業記録を書く skill 側に trigger を置く。`provisionality_explicitness.md` がこれに当たる」。

### 改善 3: その場で気付いた不備を、今の作業で拾うか切り出すか

基準の正本は新しい開発標準 `docs/development_standards/development_flow/work_scope.md`（作業の範囲）の一つだけとし、不備に気付く段階ごとに参照を置く（決定の経緯は [task-design-discussion.md](task-design-discussion.md)）。

```text
 気付く段階            参照する場所                       正本
 設計中        ──→  task-design/SKILL.md Step 3      ─┐
                                                       ├─→ work_scope.md
 実装・動作確認 ──→  runtime-feedback-review.md       ─┘
                    （steering と tasklist-executor が読む）
```

`development_standards/` を読むのは task-design の設計前調査（PrepareStep 3）だけであり、設計の開始時に限られる。拾った具体例 2 件は実装・動作確認中に起き、その段階では task-design は動いていないため、気付いた時点で読む場所に参照を置く。facilitate-discussion は議論の記録役であり、作業の範囲の判断基準を持たないため変えない。

参照を置く位置は、判定の結果が後続の手順を変える点の手前にする。

- task-design Step 3: 既存の 2 は「今回の段階の scope」を判定しており、作業の目的の内外とは別の判定である。順序が無いと、目的の外の判断に 3-5 を当てる余地が残る。また facilitate-discussion の scope 判定は同趣旨の問いを持つため、task-design が先に判定すると書かないと、記録役の判定が作業の範囲の判断を兼ねる状態に戻る。
- `runtime-feedback-review.md`: 拾うか切り出すかは decision の中身であり、戻り先を選ぶ段階では既に決まっている。判定を戻り先の選択の前に置くと、判定せずに decision を作る順序が残る。

**新しい標準 `work_scope.md` の構成**

扱う場面: 作業中に新しい判断が出たとき、または作業の目的の外にある不備に気付いたとき。二段で判定する。判定をどの手順の中で行い、結果を誰と合意するかは、気付いた段階の workflow（設計中は task-design、実装・動作確認中は `runtime-feedback-review.md`）が持つ。

1. scope の内外
    - 判断の問い: 「その判断の結論が変わると、今の作業の目的の決定・実装範囲が変わるか」。
    - やってしまいがちな失敗: 選択肢に成果物の変更（code の変更など）が含まれることを、scope 内の根拠にする。具体例: 作業の範囲外と決めていた作業の費用を下げる案を、code の変更を含むという理由で design で扱う判断に起こした。
2. scope 外の不備を拾うか切り出すか
    - 既定は今の作業で拾う。その場でしか気付けない不備は、別の作業へ回すと誰も拾わずに溜まる（ボーイスカウトルール）。
    - 次のどれかに当たるものだけを別の作業（issue・steering）に切り出す: 大きすぎる / 単体で分けた方が revert しやすい / 今の作業に含めると本番への適用が遅れる。
    - 「scope 外である」ことは、切り出す理由にならない。
    - 切り出すときは、切り出し先を先に作る。そのうえで今の作業の記録に、今はやらない理由と切り出し先を `provisionality_explicitness.md` に従って書く。
    - 拾うときは、今の作業の design と plan へ戻して範囲に加える。
    - 判断の問い: 「これを今の作業に含めたら、今の作業の review・revert・本番適用の単位が崩れるか」。崩れなければ拾う。
    - やってしまいがちな失敗: 「今の作業の scope 外だから」と別 issue を推奨する。具体例: 拾った 2 件（README の暫定性の欠落、CI の state lock の待ち時間）、切り出した 2 件（大きな機能の削除、同期処理の非同期化）。利用先固有の情報を除いた形で書く。
- 書き方は同じ directory の `branch_pr_issue.md` の節構成（主題の前提、やってしまいがちな行動・それをやると何が起きるか・正しい判断のための問い）にそろえる。

**参照側の変更**

| 対象 file | 変更 |
| --- | --- |
| `skills/task-design/SKILL.md` Step 3 | 1（不確実性を一つ選ぶ）と 2（今回の段階の scope へ含めるかの判定、3-5）の間に、新しい手順として「選んだ不確実性（未決の判断、または作業中に気付いた不備）が今の作業の目的の内にあるかを `work_scope.md` で判定する」を置き、以降の番号を一つずつ繰り下げる（番号を参照する記述は plugin 内に無いことを確かめた）。結果ごとの扱い: 目的の外の判断は design で扱う判断にしない。`design.md` に未決事項として書いていた場合は外す（目的の外の判断は今の作業の設計の対象ではなく、今回やらないと決めた事柄でもないため、非目標へも書かない）。目的の外の不備は、拾うか切り出すかを同じ file で判定し、どちらの結果も discussion で合意する。拾うと合意したものは今の作業の scope に加える。切り出すと合意したものは、切り出し先を作ってから、非目標へ `provisionality_explicitness.md` に従って書く。3-5 の判定は、目的の内にある不確実性だけに当てる。facilitate-discussion へ渡すのは、この判定の後とする。判定の中身は同 file が正本である旨を、`making_and_choosing_options.md` 参照と同じ形で書く |
| `skills/task-design/SKILL.md` Step 4 | 未決事項がすべて解消されていることを求める項目に、やってしまいがちな失敗「進行中の試行・調査のうち、結果次第で design の範囲が変わるものを未決事項に登録しないまま、design の合意を求める」を足す。具体例: design の範囲を左右する別の試行が進行中なのに、design の合意を催促した |
| `skills/runtime-feedback-review.md` | 各 feedback の三問の後、decision の提案を作る段階に、「feedback が今の作業の目的の外にある不備なら、拾うか切り出すかを `work_scope.md` で判定し、その判定を decision の提案にする」を足す。decision 後の戻り先の一覧に、二つの結果の行き先を足す。拾う場合は完成後の姿が変わるため、既存の「同じworking directoryでtask-designのdesign phaseへ戻す」に当たる。切り出す場合は、切り出し先を作り、理由と切り出し先を decision に記録する。今の作業の完成後の姿が変わらないなら design と plan は変えない |
| `docs/development_standards/README.md` | 「収録している標準」の `development_flow/` の行を、`branch_pr_issue.md` と `work_scope.md` を区別できる書き方に直す。「維持規律」の file 数と分量の記述を更新する |

### plugin の version

PATCH を上げる（`8.1.0` → `8.1.1`）。改善 1〜3 は既存 skill の内容修正と docs の追加・変更であり、新しい skill・parameter など consumer が新たに呼べるものは増えない。`maintenance-plugin-context` の規約では、新規 file の追加それ自体は MINOR の根拠にならない。

変える箇所は宣言値 4 箇所と期待値 1 箇所の計 5 箇所。

- `plugins/tumeda-dev/.codex-plugin/plugin.json` の `version`
- `plugins/tumeda-dev/.claude-plugin/plugin.json` の `version`
- `.claude-plugin/marketplace.json` の `version`
- `.claude-plugin/marketplace.json` の `plugins[]` 内、`name: tumeda-dev` の `version`
- `scripts/verification/validate-plugin.mjs` の `expectedRelease`

### validator の必須文言

`scripts/verification/validate-plugin.mjs` は、skill の契約を表す文が本文に残っているかを必須文言で検査する。次の 2 種類を、文の所在に合わせて直す。検査の意図は変えない。

| 必須文言 | 変更前に探す場所 | 変更後 |
| --- | --- | --- |
| 「選んだ不確実性を、今回の段階のscopeへ含めるか判定する（3-5）」 | `task-design/SKILL.md` | 改善3 で書き換えた「目的の内にある不確実性を、今回の段階のscopeへ含めるか判定する（3-5）」を探す |
| 「引き継ぎの観点（…）を`design.md`の受け入れ基準へ入れる」 | `task-design/tasklist-design.md` | 改善1 で置き換えた「Step 4で受け入れ基準へ入れた引き継ぎの観点（…）を前提にする」を探す |
| 「feedback原文」「既に修正済みのfeedbackでも記録を省略しない」「reviewのdecisionやtask追加後も実装を自動再開しない」 | `steering/SKILL.md` | `skills/runtime-feedback-review.md` で探す。`steering/SKILL.md` には `runtime-feedback-review.md` の参照を求める |
| 「末尾のiterationとfeedback状態」 | `facilitate-discussion/read-discussion.md` | 同 file の「末尾提示・原文応答・現在state・親子と根拠を判断する」を探す |

上の 2 行は今回の変更に伴う追随である。下の 2 行は、実装 feedback の処理を共通 file へ移した変更と、議論記録の読取手順を書き直した変更（どちらも `8.1.0` の配布に含まれる）に validator が追随しておらず、既定 branch でも検査が失敗していたものである。今回の作業の目的の外にある不備だが、1 file の数箇所で検査の意図を変えず、review・revert・配布の単位を崩さないため、`work_scope.md` の基準に従ってこの作業で拾う。commit は改善 1〜3 と分ける。

加えて、root `README.md` の「変更時の検証と前提」（skill または docs を追加・変更したら、対応する assertion を同じ変更で足す）に従い、改善 1〜3 の契約を固定する assertion を足す。

| 対象 file | 足す検査 |
| --- | --- |
| `provisionality_explicitness.md`、`work_scope.md` | 存在。それぞれの判断の問い（「見直す条件を知らない読み手がこの文だけを読んだら、恒久の方針と受け取らないか」）と既定の規則（「「今の作業の目的の外である」ことは、切り出す理由にならない」） |
| `task-design/SKILL.md` | Step 4 の確認項目名と判定の問い、2 標準の参照、目的の内外の判定を facilitate-discussion へ渡す前に置く文 |
| `task-design/tasklist-design.md` | 冒頭の対象actionの受け取り。Step 4 へ移した例の表の行は `forbidText` で禁止し、判定の定義が二箇所に戻らないようにする |
| `runtime-feedback-review.md` | `work_scope.md` の参照と、切り出す場合の行き先 |
| `document-review/SKILL.md`、`templates/design.md`、2 つの README、`stock-and-flow-information.md`、`making_and_choosing_options.md` | 暫定性の観点、非目標の comment、新しい標準への参照、補助節の見出し |

---

## 要件（Requirements）

### MUST（必達）

- 三つの規範は、それぞれ正本を一つだけ持つ。
    - 作業を破棄しても残る変化の判定: `task-design/SKILL.md` Step 4。
    - 暫定の判断の書き方: `provisionality_explicitness.md`。
    - 作業の範囲と、拾うか切り出すか: `work_scope.md`。
    - 他の file は参照だけを持ち、判定の中身を写さない。
- 各規範は、判断が必要になる時点で読まれる場所から参照される。
    - 改善1: design 合意判定。
    - 改善2: md を出す前の `document-review`、steering の作業記録を書く task-design、提案を作る場面の思考標準。
    - 改善3: 設計中の Step 3、実装・動作確認中の `runtime-feedback-review.md`。
- 既存の読取の約束を崩さない。
    - `tasklist-design.md` は plan phase の直前に完全に読む。
    - `development_standards/` は設計前調査で全部読む。
    - `document-review` は docs と skill 本体だけに当たる。
    - facilitate-discussion は議論の記録役のままにする。
    - `think-through` は `think_standards/` への入口だけを持つ。
- 索引と説明を、新しい file と食い違わない状態にする。
    - `documentation_standards/README.md` の一覧と観点の向きの段落。
    - `development_standards/README.md` の一覧と維持規律。
- plugin の成果物に利用先固有の情報を書かない。具体例は `maintenance-plugin-context/maintenance_policies/migration.md` の除去規約に従って一般化する。
- plugin の version を `8.1.1` に上げ、宣言値 4 箇所と期待値 1 箇所を揃える。

### SHOULD（できれば）

なし。

### MAY（あれば嬉しい）

なし。

### 非目標

- facilitate-discussion の変更。facilitate-discussion は議論の記録役であり、作業の範囲の判断基準を持たない。この責務境界は今回に限った判断ではない。
- `task-design/roadmap-design.md` への「作業の外へ残るaction」の原則の追加。composite の各 phase は子 steering の task-design を通るため、子の design 合意で Step 4 の確認が当たる。子が leaf なら `tasklist-design.md` の MUST も当たる。
- 既存の docs・skill・steering 記録にある暫定の判断の記述の一斉点検。docs と skill 本体は、次に更新するときに `document-review` の更新時観点で当たる。過去の steering 記録は当時の判断の履歴であり、書き換えない。

### 受け入れ基準

- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出す（`expectedRelease` は `8.1.1`）。
    - 既定 branch でも失敗していた必須文言の検査 4 件も直し、この作業の後は失敗が残らない（[validator の必須文言](#validator-の必須文言)）。
- 編集後の `skill-update-review` が、実物一式と更新前の版の比較で合格する。
- 新設・更新した md がすべて `document-review` を通っている。観点には新しい暫定性の観点を含める。
- 新しい 3 つの判断基準を、起点以外の具体 case 二つ以上へ当てた結果が「テスト方針」に書かれ、意図した場所へ落ちている。
- 作業の外へ残る変化の引き継ぎ: この作業の変更は、plugin の既定 branch へ取り込まれると marketplace を通じて利用先へ配布され、この作業を破棄しても残る。
    - 確認: 取り込みと marketplace の update・reinstall の後、install cache の `tumeda-dev` の version が `8.1.1` になり、新しい 2 file が cache に含まれる。
    - 更新・復旧: 不具合が見つかったら、既定 branch で該当 commit を revert し、次の PATCH（`8.1.2`）として配布し直す。同じ release を付け直さない（`maintenance-plugin-context` の version 規約）。
    - 取り込みは `escalate-plugin-skill-fix` の「plugin repositoryでの作業完了後の取り込み」の 4 step で、steering の commit の後に行う。

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| `task-design/SKILL.md` が長くなり、読む負荷が上がる | 判定の定義は `tasklist-design.md` から移すだけで、二箇所に持たない。Step 3・4 と confidentiality の隣に足すのは参照と失敗例だけにし、規範の中身は標準 file に置く |
| Step 3 の手順番号を繰り下げると、番号を参照する記述が壊れる | plugin 全体を検索し、参照が無いことを確かめた。適用後に同じ検索を再実行する |
| `tasklist-design.md` の受け入れ基準の MUST を「Step 4 で入れた観点を前提にする」へ置き換えると、変更前に合意した design では観点が欠けている | 置き換え後の MUST は「入っていなければ design へ戻す」であり、欠けていれば plan phase で design へ戻る。変更前の MUST と同じ結果になる |
| 「既定は拾う」により、今の作業が膨らむ | 切り出す 3 条件と判断の問い（review・revert・本番適用の単位が崩れるか）で止める。拾うか切り出すかは、どちらの結果も利用者と合意する |
| `document-review` の観点が増え、既存 docs の更新で指摘が増える | 観点は暫定の判断を書いた箇所にだけ当たる。暫定の判断を含まない更新では該当しない |
| 具体例に利用先固有の情報が混ざる | `migration.md` の除去規約に従って一般化する。適用後、除去対象（利用先 repository 名、所有者名、絶対 path、固有 domain 名、固有 steering slug）を検索し、`document-review` の機密性の観点を通す |
| 配布後に不具合が見つかる | 受け入れ基準の復旧手順（revert と次の PATCH）で戻す |

---

## テスト方針

このrepositoryに自動 test は無い。次で確かめる。

- 配布 manifest と version: `node scripts/verification/validate-plugin.mjs`。
- 文書の観点: 新設 2 file は作成時観点と更新時観点、更新した docs と skill 本体は更新時観点で `document-review` を通す。
- skill の構造: 編集後に、実物一式と更新前の版で `skill-update-review` を通す。設計時の合格を流用しない。
- 参照の整合: 新しい 2 file を指す相対 link がすべて実在の file へ解決すること、参照元が「完成後の姿」の表のとおりの位置にあることを、検索で確かめる。Step 3 の手順番号の参照が無いことを再検索する。
- 利用先固有の情報: 上のリスクの対策の検索。

**新しい判断基準を、起点以外の具体 case へ当てた結果**

1. Step 4「作業の外へ残る変化の引き継ぎ」（起点: 定期実行の schedule を有効にする作業）
    - この作業自身: plugin の既定 branch への取り込みは配布になり、破棄しても残る。Step 4 で受け入れ基準に確認（cache の version）と復旧（revert と次の PATCH）を求める。この design の受け入れ基準に入れた。
    - 列を追加する DB migration を含む機能追加: 本番 DB への migration の適用は残る。design 合意の時点で、適用の確認と戻し方（down migration、または前方修正の手順）を受け入れ基準に求める。tasklist 設計で初めて気付く経路は無くなる。
    - feature branch 上の code の整理（merge 前に破棄できる）: 残らない。Step 4 の確認項目は該当なしで通り、受け入れ基準を増やさない。
2. `provisionality_explicitness.md`（起点: README へ写すときの暫定性の欠落、条件付きの保留の「決定済み」化、「どちらもやらない」の提示）
    - 定期実行の頻度を、費用の実測が出るまで週 1 回にする判断: 暫定に当たる。理由（費用が未実測）と見直す条件（初回実行の後の費用確認）を書かせる。design から運用 README へ写すときも 3 点を残させる。
    - 「facilitate-discussion は変えない」（この design の非目標）: 責務境界に基づく恒久の判断であり、暫定に当たらない。恒久の方針と読まれても誤りにならず、見直す条件は求めない。
3. `work_scope.md` の二段（起点: README と CI の待ち時間を拾った、費用を下げる案を design で扱う判断に起こした、非同期化と大きな機能の削除を切り出した）
    - この design の構造reviewで見つけた `making_and_choosing_options.md` の見出しの形: 一段目で、結論が変わると今の作業の成果物が変わるため目的の内。design の変更として扱う（実際に変更内容として扱った）。
    - `task-design/SKILL.md` を編集中に、無関係な節の壊れた link に気付いた場合: 一段目で目的の外。二段目で、数文字の修正で review・revert・本番適用の単位を崩さないため、拾う方向で利用者と合意し、同じ commit 群に含める。
    - 新しい標準を書く途中で、`development_standards/` の全 file の構成を揃え直したくなった場合: 一段目で目的の外。二段目で、全 file に及び今の作業の review 単位を崩すため、切り出す方向で利用者と合意し、切り出し先を作ってから非目標へ理由と切り出し先を書く。

---

## （付録）前提とする既存仕様

- `task-design/SKILL.md` の Step 4: design 合意判定の条件を列挙する。作業の外へ残る変化に関する条件は無い。
- `task-design/tasklist-design.md` の「作業の外へ残るactionを含むphaseの原則」: 判定の問い「このphaseで起きる変化は、この作業を破棄しても残るか」と、対象 action がある場合に引き継ぎの観点を `design.md` の受け入れ基準へ入れる MUST を持つ。tasklist 設計の時点で読まれる。
- `task-design/templates/design.md` の受け入れ基準: HTML comment で、作業を破棄しても残る変化の引き継ぎを受け入れ基準に入れるよう促す。
- `docs/documentation_standards/README.md`: 標準を増やしたら `document-review` の観点にするかを判断する。観点の向き（読者が使えるか／書いてはいけないものが無いか）により、作業記録への適用の要否が変わる。
- `docs/documentation_standards/stock-and-flow-information.md`: 情報の寿命で置き場所と書き方を分ける。ストック情報のアンチパターン「議論結果をそのまま転記する」（結論だけ載せず、因果と具体背景を添えて書き直す）。
- `skills/document-review/SKILL.md`: 作成時・更新時の観点として標準 file を列挙する。対象は docs と skill 本体。
- `skills/think-through/SKILL.md`: 本体は `docs/think_standards/README.md` の引き方に従って該当 file を読む入口だけを持つ。
- `skills/facilitate-discussion/SKILL.md` の「scopeと親子関係」: 結論が現在の目的・指定 parent の決定・実装範囲を変えない decision は、議論記録の対象にせず、scope 外の候補として chat で区別する。
- `docs/development_standards/` 配下 12 file: 設計前調査として全文を読んだ。今回の変更に直接当たる標準は無い。
- `skills/runtime-feedback-review.md`: steering と tasklist-executor が、実装・review・validation・利用者確認の feedback を直接受領したときに読む。facilitate-discussion の適用 → 各 feedback の三問 → decision → 戻り先の選択、の順に進む。戻り先の一覧の先頭は「完成後の姿、要件、設計根拠、公開API、module境界が変わる: 同じworking directoryでtask-designのdesign phaseへ戻す」。
- `task-design/SKILL.md` の Step 3: 1（不確実性を一つ選ぶ）、2（今回の段階の scope へ含めるかの判定、3-5）、3（解消手段を選ぶ）〜7（再評価）の手順を持つ。手順番号を参照する記述は plugin 内に無い。§4 は discussion を既定で開始し、開始しない場合を未決事項が残らない場合と、調査・技術検証実装だけで事実が決まる場合に限る。
- `docs/think_standards/evolution_policy.md`: 各場面の主軸を一つにし、独立した補助判断の見出しには「補助:」を付ける。
- `maintenance-plugin-context/SKILL.md` の「Plugin version」: 既存 skill の内容修正と docs の追加・変更は PATCH。配布する変更には一度だけ version を上げ、同じ release を付け直さない。
- `escalate-plugin-skill-fix/SKILL.md` の「plugin repositoryでの作業完了後の取り込み」: steering の commit の後、作業 branch の push、既定 branch への切替、merge、既定 branch の push の 4 step で取り込む。marketplace の source はこの repository の既定 branch である。

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |
| `plugins/tumeda-dev/skills/task-design/SKILL.md` | 冒頭に暫定性の参照。Step 3 の手順 2 に目的の内外の判定を挿入し、以降の番号を繰り下げ。Step 4 に未決事項の登録漏れの失敗例と「作業の外へ残る変化の引き継ぎ」 | `document-review`（更新時観点、暫定性を含む）を通過。編集後の `skill-update-review` は不合格 6 の解消後の再照合で合格（[編集後の再照合](artifacts/design-structure-review.md#編集後の再照合)）。Step 3 の手順番号を参照する記述が plugin 内に無いことを再検索で確認 | [改善 1](#改善-1-design-合意判定で作業の外へ残る変化の引き継ぎ観点を確かめる)、[改善 2](#改善-2-暫定の判断を記録提示するとき暫定性理由見直す条件を落とさない)、[改善 3](#改善-3-その場で気付いた不備を今の作業で拾うか切り出すか) |
| `plugins/tumeda-dev/skills/task-design/tasklist-design.md` | 判定の定義を外し、節の冒頭の一文で Step 4 から対象actionを受け取る。受け入れ基準の MUST を「Step 4 で入れた観点を前提にする」へ置き換え | `document-review`（更新時観点、暫定性を含む）を通過。編集後の `skill-update-review` は不合格 6 の解消後の再照合で合格（[編集後の再照合](artifacts/design-structure-review.md#編集後の再照合)） | [改善 1](#改善-1-design-合意判定で作業の外へ残る変化の引き継ぎ観点を確かめる) |
| `plugins/tumeda-dev/skills/task-design/templates/design.md` | 「非目標」の comment に、理由と見直す条件または切り出した先を書くこと、恒久の判断なら見直す条件は要らないこと | `document-review`（更新時観点、暫定性を含む）を通過。編集後の `skill-update-review` は不合格 6 の解消後の再照合で合格（[編集後の再照合](artifacts/design-structure-review.md#編集後の再照合)） | [改善 2](#改善-2-暫定の判断を記録提示するとき暫定性理由見直す条件を落とさない) |
| `plugins/tumeda-dev/skills/runtime-feedback-review.md` | 三問の後に `work_scope.md` の判定。戻り先の一覧に、拾う・切り出すの行き先 | `document-review`（更新時観点、暫定性を含む）を通過。編集後の `skill-update-review` は不合格 6 の解消後の再照合で合格（[編集後の再照合](artifacts/design-structure-review.md#編集後の再照合)） | [改善 3](#改善-3-その場で気付いた不備を今の作業で拾うか切り出すか) |
| `plugins/tumeda-dev/skills/document-review/SKILL.md` | 作成時観点と更新時観点に「暫定性 → `provisionality_explicitness.md`」 | `document-review`（更新時観点、暫定性を含む）を通過。編集後の `skill-update-review` は不合格 6 の解消後の再照合で合格（[編集後の再照合](artifacts/design-structure-review.md#編集後の再照合)） | [改善 2](#改善-2-暫定の判断を記録提示するとき暫定性理由見直す条件を落とさない) |
| `plugins/tumeda-dev/docs/documentation_standards/provisionality_explicitness.md`（新設）、`docs/documentation_standards/README.md`、`docs/documentation_standards/stock-and-flow-information.md` | 新しい標準。README の一覧の行と、観点の向きの段落の条件。「議論結果をそのまま転記する」からの参照 | `document-review` を通過（新設は作成時・更新時観点、更新は更新時観点）。相対 link はすべて実在の file へ解決 | [改善 2](#改善-2-暫定の判断を記録提示するとき暫定性理由見直す条件を落とさない) |
| `plugins/tumeda-dev/docs/development_standards/development_flow/work_scope.md`（新設）、`docs/development_standards/README.md` | 新しい標準。README の `development_flow/` の行を 2 file に分け、維持規律を 13 file・約 57KB へ更新 | `document-review` を通過。分量は実測 58,035 bytes（約 56.7 KiB）。相対 link はすべて実在の file へ解決 | [改善 3](#改善-3-その場で気付いた不備を今の作業で拾うか切り出すか) |
| `plugins/tumeda-dev/docs/think_standards/making_and_choosing_options.md` | 補助節「補助: 提案が暫定か恒久かを示す」 | `document-review` を通過 | [改善 2](#改善-2-暫定の判断を記録提示するとき暫定性理由見直す条件を落とさない) |
| `scripts/verification/validate-plugin.mjs` | 必須文言 6 件を文の所在へ追随（今回の変更に伴う 2 件、既定 branch でも失敗していた 4 件）。改善 1〜3 の契約を固定する assertion を追加。`expectedRelease` を `8.1.1` | `node scripts/verification/validate-plugin.mjs` が `plugin validation passed`。作業 tree の複製で、契約の文の削除・新しい標準の削除・禁止した表の行の復活をそれぞれ失敗として検出することを確認。`test-task-design-handoff.mjs` が passed。`inspect-discussion.test.mjs` が 24 passed・0 failed・1 skipped（既存の環境依存の skip） | [validator の必須文言](#validator-の必須文言)、[plugin の version](#plugin-の-version) |
| `plugins/tumeda-dev/.codex-plugin/plugin.json`、`plugins/tumeda-dev/.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json`（2 箇所） | version を `8.1.1` | 上の validator で 4 つの宣言値と期待値の一致を確認 | [plugin の version](#plugin-の-version) |

利用先固有の情報（利用先 repository 名、所有者名、絶対 path、固有 domain 名、固有 steering slug）を、変更・新設した全 file で検索した。該当は `scripts/verification/validate-plugin.mjs` の既存の 1 行だけで、利用先名の混入を禁止するための検出 pattern であり、今回の差分ではない。

### task-design内の対象成果物反映待ち

なし。

### execution plan対象

なし。対象は skill・docs・manifest の content であり、本番 application coding に当たらない。合意済み内容から一意に反映でき、一つの連続した反映・validation で完了できる。既定 branch への取り込みは、steering の commit の後に `escalate-plugin-skill-fix` の既存の 4 step で行う。

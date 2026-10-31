# 議論記録

## 論点1: 提案1（commit の境界を決める段階で plan-commits の基準を当てる導線）を取り込む理由

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0（論点1）: 取り込む理由を決める

#### 提案0（論点1）

design.md の TL;DR に、提案1 を取り込む理由として次を書く。

> commit の境界を決める段階で、何を比べて境界を決めるかの基準が手元に無い。そのため、revert しても code と文書が食い違わないといった必要条件や、同じ行を二度直す手間を、境界を決める基準と取り違える。plan-commits はその基準（意味で分ける、取り消した時に消したい効果と残したい効果を比べる、編集の手間や本数で境界を変えない）を持つが、task-design からも tasklist の設計からも辿れない。境界を決める段階からその基準へ辿れるようにして、同じ取り違えを減らす。取り違えの主な原因は当てはめの誤りであり、導線はそれを減らす補助にとどまる。

どの段階のどの file へ導線を置くかと、書く文は、この理由の合意の後に別の論点で決める。

#### 検討記録（論点1・イテレーション0）

利用先の作業では、要件「機能の削除を単体で revert できる一つの変更にする」の下で、assistant が「revert しても code と文書が食い違わない」だけを軸に、code・文書・呼び名の変更を一つの commit にする案を出した。利用者の「コミット計画のスキル考えても同じ結論に至る？」で plan-commits の基準に当てると、画面の依存の切り離しと呼び名の変更は取り消す効果が独立しており、四つの commit に分かれた。
基準そのものは plan-commits にあった。足りなかったのは、境界を決めている最中にそこへ辿る道である。利用者の問いがその道として働いた。

plugin の現状（8.2.0）:

- `plan-commits` を参照しているのは `skills/README.md` の一覧だけで、task-design、`tasklist-design.md`、tasklist-executor、steering は参照していない。
- commit の境界を決める段階は二つある。
    - tasklist の commit section: 「phase単位かつ意味単位で分け」とだけ定め、何を比べるかを書かない。
    - design: 要件に revert の単位がある時に境界が設計判断になるが、その節も手順も無い。
- plan-commits は「実差分から」計画し、「designやtasklistの見出しだけから計画を作らない」と定める。design の段階には実差分が無いので、skill をそのまま起動する形ではなく、判断基準を当てる形になる。これは次の論点の前提である。

採らなかった理由の案:

- 「意味単位」の定義を plugin の別の場所へ書く: plan-commits が既に基準を持ち、別に書くと正本が二つになる。
- 取り込まない: 利用者は保留の時点で「skill は直さない」を選ばなかった。利用先の一件で、基準へ辿る問い一つが結論を変えた。

限界: 根拠は利用先の一件であり、他の repository で同じ取り違えが起きたかは分からない。

[内部検討記録: 論点1・イテレーション0](./internal-records/task-design-discussion.md.topic-1.md#iteration-0)

#### 提案0へのフィードバック（論点1）

**結果:** 合意。あわせて、この問いを出したこと自体への疑問を受けた

> そりゃOKだけど、なんでこんなことが聞かれてるかわからない

（2026-10-31、chat 上の発言）

問いは不要だった。理由は利用先の作業で既に合意されていた。利用先では、assistant が原因と再発防止の候補を示したうえで「plugin へ提案するか」を問い、利用者が「1:b」と答えている。task-design の判定（上位を別の答えに置き換えて下位が変わるか、変わるなら相手の言葉を引けるか）に当てると、引ける言葉はその「1:b」だった。assistant は「根拠の文を書いたのが assistant である」ことを未合意と取り違えた。

### 決定（論点1）

design.md の TL;DR に、提案1 を取り込む理由として次を書く。

> commit の境界を決める段階で、何を比べて境界を決めるかの基準が手元に無い。そのため、revert しても code と文書が食い違わないといった必要条件や、同じ行を二度直す手間を、境界を決める基準と取り違える。plan-commits はその基準（意味で分ける、取り消した時に消したい効果と残したい効果を比べる、編集の手間や本数で境界を変えない）を持つが、task-design からも tasklist の設計からも辿れない。境界を決める段階からその基準へ辿れるようにして、同じ取り違えを減らす。取り違えの主な原因は当てはめの誤りであり、導線はそれを減らす補助にとどまる。

この理由は、利用先の作業で利用者が「1:b」（plugin へ提案する）と答えた時点で合意されていた。

## 論点2: 提案2（利用者の動作確認を push の前に置き、local commit を先に許す）を取り込む理由

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0（論点2）: 変更の報告

#### 変更内容0（論点2）

判断根拠: 既決事項からの導出。利用先の作業で、assistant が次の理由を推奨として示したうえで「plugin へ提案するか」を問い、利用者が「1:b」と答えた（2026-10-30）。

design.md の TL;DR の「提案2: TBD」を、次に置き換える。

> 利用者の動作確認で守りたいのは、確かめていない変更を公開しないことである。push の前の local commit は amend や rebase で直せるため、確認を作業 branch の push・PR の前に置けば守れる。今の契約は確認を commit の前に置くため、phase ごとに確認を待たないと commit できない。確認環境が commit の push で build される repository では、この順序が確認環境の使い方と構造上ぶつかり、確認のたびに一時 commit・push・build の待ちが要った。

- 典拠: 利用先の実装後の振り返りの論点1。推奨の文は「local の commit は push の前なら直せるため、利用者の確認で守りたいもの（確かめていない変更を公開しないこと）は push の前の確認で守れる」。確認環境とぶつかる点は、利用者の「多分あれか？動確環境立ち上げの時のコミットに引きずられたのか？」に assistant が「半分はそうだと見る」と答えた内容である。
- 対象: design.md の TL;DR の提案2 の行だけ。新しい契約の中身は、次の論点で決める。

#### 検討記録（論点2・イテレーション0）

論点1 で、理由を問いにしたことが不要だったと分かった（利用先で「1:b」と答えた時点で合意されていた）。提案2 も同じ形で合意されているため、問いにせず導出として報告する。

[内部検討記録: 論点2・イテレーション0](./internal-records/task-design-discussion.md.topic-2.md#iteration-0)

### 決定（論点2）

design.md の TL;DR に、提案2 を取り込む理由として次を書く。

> 確認環境（review 環境など）で確かめるには commit・push が要る場合がある。今の契約は確認の前の commit・push を一律に禁じるため、確認に必然性がある commit・push まで禁じてしまう。それを許す。

典拠は利用者の発言（2026-10-31、論点3 の提案1 への応答）「review環境で確認するとか必然性があるコミットを許可してるだけなのに」である。

変更内容0 で報告した理由（確認で守るのは公開しないこと、push 前の local commit は直せるため確認を commit の前に置く必要はない）は採らない。利用先で利用者が「1:b」と答えたのは、確認環境とぶつかる問題を plugin へ回すことへの合意だった。phase ごとに確認前に commit するという中身は、利用先の tasklist で assistant が書いた例外を、assistant が提案文へ広げたものであり、利用者の意図ではなかった。

### 現在の変更（論点2）

イテレーション0 の変更内容0。2026-10-31 に chat で報告した。

対応する実応答（2026-10-31、報告の後の利用者の発言。論点3 の提案1 への応答として述べられた）:

> 「phase ごとに、DoD の確認（test・lint・型検査・画面）が済んだら、確認を待たずに local で commit する。」え、なんでそんなことになってるの？ review環境で確認するとか必然性があるコミットを許可してるだけなのに

この応答で、変更内容0 の前提（利用先で合意された理由に、確認を commit の前に置かなくてよいことが含まれる）が覆った。変更内容0 は反映せず、上の決定の文を反映する。

## 論点3: 提案2 の新しい契約（利用者の動作確認・local commit・push・PR の順序）

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0（論点3）: 契約の書き換えを決める

#### 提案0（論点3）

plugin の既定の順序を次に変える。repository の context file（`.agents/skills/tumeda-dev-plugin-context.md`）の local Git 運用条件が commit の時期を別に定めていれば、そちらに従う。

```text
Phase n の task（実装、test の作成・変更）
  → Phase n の DoD の確認（test green、lint、型検査、UI 変更なら visual-inspector）
  → Phase n の差分を local で commit（commit task を作る条件を満たす時。push はしない）
   … 各 phase で繰り返す …
品質 check（直した差分があれば local で commit）
動作確認（利用者が確かめる）
  ├─ 直すところなし → 完了後の action: 作業 branch の push・PR
  └─ 直すところあり → implementation_review で扱う
                        → push の前に、該当 phase の commit を local で直す
                        → 動作確認へ戻る
```

変えないもの:

- commit task を作る条件（context に local Git 運用条件がある、または利用者が commit を求めた）。
- 作業の外へ残る action を含む phase で止まって確かめる規則。
- push・PR の前に local commit が一件以上あることを確かめる規則。

##### 書き換える箇所

| file | 今 | 後 |
| --- | --- | --- |
| `task-design/tasklist-design.md` 実装後feedbackと公開action | 「commit・push・PRより前にユーザー動作確認を必須にする。」 | 「作業branchのpush・PRより前にユーザー動作確認を必須にする。確認で守るのは、確かめていない変更を公開しないことである。push前のlocal commitはamendやrebaseで直せるため、確認をcommitの前に置く必要はない。」 |
| 同（commit の生成条件の文） | 「…だけcommit sectionを生成する。phase単位かつ意味単位で分け、部分承認なら承認範囲だけをcommitする。」 | 「…だけcommit taskを生成する。commit taskは各phaseの末尾に置き、そのphaseのDoDの確認（test、lint、型検査、UI変更ならvisual-inspector）を通した後に、利用者の確認を待たずにlocalでcommitする。phase単位かつ意味単位で分ける。利用者の確認で直すところが出たphaseは、pushの前にそのphaseのcommitをlocalで直す。local Git運用条件がcommitの時期を別に定めている場合は、それに従う。」（後半の「同fileに該当項目が無い場合は…」以降は変えない） |
| 同 自己レビューgate | 「**commit・push・PRより前にユーザー動作確認があるか**」と、失敗例「…tasklist-executorがそのままcommit・pushまで進む。」 | 「**作業branchのpush・PRより前にユーザー動作確認があるか**: 自動test・screenshotをユーザー確認の代替にしていないか。phaseのcommit taskが、そのphaseのDoDの確認の後にあるか。」と、失敗例「…tasklist-executorがそのままpush・PRまで進む。」 |
| `task-design/templates/tasklist.md` 各 Phase の Tasks | （commit task なし） | 末尾に「- [ ] このphaseの差分をlocalでcommitする（DoDの確認の後。pushしない）」を置き、commit task を作る条件を満たす時だけ残すよう comment で示す。今の完了後の commit block にある「まとめて一commitにしない」「同一phase内でも意味的に異なる変更を分割する（例: DB migration、domain model、GraphQL、frontendは別commit）」「利用者が不要と回答した場合は`[x] ~~commit~~（ユーザーが不要と回答）`」は、この task の下へ移す |
| 同 品質check の Tasks | （commit task なし） | 末尾に「- [ ] 品質checkで直した差分があればlocalでcommitする」 |
| 同 動作確認 の Tasks | （直す task なし） | 「- [ ] 直すところが出たら、pushの前に該当phaseのcommitをlocalで直す」（commit task を作った時だけ） |
| 同 完了後のaction | ⚠️「動作確認phaseが完了するまでcommit、push、PRを促したり実行したりしない。」と、commit block | ⚠️「動作確認phaseが完了するまでpush、PRを促したり実行したりしない。」。commit block は消す（中身は phase の commit task へ移した。「部分承認なら承認範囲だけをcommit」は、上の「直す」task に置き換わる） |
| `tasklist-executor/SKILL.md` 停止・再開 | 「…`user_confirmation_required`で停止し、確認前にcommit・pushへ進まない」 | 「…`user_confirmation_required`で停止し、確認前に作業branchのpush・PRへ進まない。phaseのcommit taskは、そのphaseのDoDを実測で通した後に実行する」 |
| 同 返却 | 「tasklistが定めるユーザー動作確認より先にcommit・push・PRへ進まない。」 | 「tasklistが定めるユーザー動作確認より先に作業branchのpush・PRへ進まない。」 |
| `steering/SKILL.md` 6-1 | 「tasklist内のユーザー動作確認が完了する前にcommit、push、PRへ進ませない。」 | 「tasklist内のユーザー動作確認が完了する前に作業branchのpush、PRへ進ませない。phaseのcommit taskは、そのphaseのDoDの確認の後に進めてよい。」 |
| 同 やらないこと | 「…ユーザー動作確認前にcommit、push、PRを行う。…」 | 「…ユーザー動作確認前に作業branchのpush、PRを行う。…」 |
| `share-work-in-progress/SKILL.md` description と起動gate | 「ユーザー動作確認が完了するまでcommit・push・PRを行わない」 | 「ユーザー動作確認が完了するまで作業branchのpush・PRを行わない」 |
| `skills/README.md` share-work-in-progress の行 | 「tasklist-executorのcommit・push・PR契約」 | 「tasklist-executorのpush・PR契約」 |

あわせて、validator に、後の文があることと今の文が戻らないことの assertion を足す。

#### 検討記録（論点3・イテレーション0）

確認と commit・push・PR の順序を定めている、または引いている箇所を、plugin 全体（skill、docs、root の README と AGENTS.md、validator）から「動作確認」「commit・push」「commit、push」「確認前に」「承認範囲」で探し、上の表の 6 file に限られることを確かめた。validator には、これらの文を検査する assertion は無い。

新しい順序を plugin の既定にする理由は、論点2 の理由（push 前の local commit は直せる）が repository に依らないことである。既定を変えずに、context に宣言した repository だけ変える形も考えたが、宣言しない repository では確認環境とぶつかる問題が残る。逆に、既に「確認の後に commit」を context に書いている repository は、context の宣言が優先されるので振る舞いが変わらない。

「local commit を行ってよい」とだけ書き、行うかを executor に任せる形は採らない。commit の有無と時期が実行時の判断になり、tasklist から実行順が読めなくなる。

今の「部分承認なら承認範囲だけを commit し、残りは待つ」は、commit が確認の前に済むと成り立たない。代わりに「確認で直すところが出た phase は、push の前にその phase の commit を local で直す」とする。利用先の作業でも、tasklist にこの形で書いて運用できた。

この論点では、確認環境へ載せるための push を push の制限に含めるかは扱わない。上の後の文は「作業 branch の push・PR」と書くため、確認環境への push については何も定めない状態になる。その扱いは次の論点で決める。

[内部検討記録: 論点3・イテレーション0](./internal-records/task-design-discussion.md.topic-3.md#iteration-0)

#### 提案0へのフィードバック（論点3）

**結果:** 修正要求。直すところが出た時に phase の commit を書き換える部分を外す。あわせて、提案が箇所の数で読みにくいとの指摘を受けた

> 論点3について数が多くてあまり読めてない。というか、local commit書き換えないでいいんじゃ無い？ tasklist終了後に指摘があったからって、指摘修正で追いコミットでいいんじゃ無い？

（2026-10-31、chat 上の発言。利用者は作業中の PR（plugin repository の #9）で提案0 を当てた diff を見られる状態だった）

評価: 合意済みの理由（確かめていない変更を公開しない）は、push の前に確認があれば守れる。phase の commit を書き換えることは理由から出てこない。書き換えは、phase の commit を確認済みの状態に揃えるために assistant が足したもので、根拠が無い。追加の commit にすれば既存の commit に触れず、agent に履歴の書き換えをさせずに済む。

### イテレーション1（論点3）: 確認で直したところを追加の commit にする

#### 提案1（論点3）

提案0 から一点だけ変える。利用者の確認で直すところが出たら、既存の commit は書き換えず、直した差分を追加の commit にする。

```text
Phase ごとに: 実装 → DoD の確認 → local commit
品質 check（直した差分があれば local commit）
動作確認
  ├─ 直すところなし → 作業 branch の push・PR
  └─ 直すところあり → 直して、その差分を追加で local commit → 動作確認へ戻る
```

提案0 の表から変わる箇所は二つだけである。

| file | 提案0 の後の文 | 提案1 の後の文 |
| --- | --- | --- |
| `task-design/tasklist-design.md`（commit の生成条件の文） | 「利用者の確認で直すところが出たphaseは、pushの前にそのphaseのcommitをlocalで直す。」 | 「利用者の確認で直したところは、既存のcommitを書き換えず、追加のcommitにする。」 |
| `task-design/templates/tasklist.md` 動作確認 の Tasks | 「直すところが出たら、pushの前に該当phaseのcommitをlocalで直す（commit taskを生成した時だけ）」 | 「直すところが出たら、直した差分を追加でlocalにcommitする（commit taskを生成した時だけ。既存のcommitは書き換えない）」 |

それ以外の箇所（確認を作業 branch の push・PR の前に置くこと、phase ごとの local commit、executor・steering・share-work-in-progress・skills/README の書き換え）は提案0 のままである。

#### 検討記録（論点3・イテレーション1）

利用者の指摘のとおり、合意済みの理由（確かめていない変更を公開しない）は、push の前に確認があれば守れる。phase の commit を書き換えることは、この理由から出てこない。
提案0 の書き換えは、phase の commit を「確認済みの状態」に揃えるために assistant が足したもので、利用先の作業でも assistant が tasklist に書いた文が元になっていた。利用者の指示や合意に根拠は無い。
追加の commit にすると、次のことが成り立つ。

- 既存の commit に触れないため、agent に rebase や amend をさせずに済む。interactive な rebase を使えない実行環境でも同じ手順で動く。
- 確認で直したことが、別の commit として履歴に残る。

代償は、phase の commit を単独で revert した時に、それを直した追加の commit が残りうることである。直した差分が phase の commit に依存するなら、revert する時に両方を戻す。

[内部検討記録: 論点3・イテレーション1](./internal-records/task-design-discussion.md.topic-3.md#iteration-1)

#### 提案1へのフィードバック（論点3）

**結果:** 修正要求（認識齟齬）。phase ごとに確認前に commit することは、利用者の意図に無い

> 「phase ごとに、DoD の確認（test・lint・型検査・画面）が済んだら、確認を待たずに local で commit する。」え、なんでそんなことになってるの？ review環境で確認するとか必然性があるコミットを許可してるだけなのに

（2026-10-31、chat 上の発言）

評価: 提案0・提案1 は、「phase ごとに確認前に local で commit する」を前提にしていた。この前提は、利用先の tasklist で assistant が書いた例外を、assistant が提案文へ広げたものだった。利用者の意図は、確認環境で確かめるために必然性がある commit・push を許すことだけである。前提が誤っていたため、提案0・提案1 の書き換えの大半（phase ごとの commit task、確認を push の前へ移すこと）は成り立たない。

### イテレーション2（論点3）: 確認に必然性がある commit・push だけを許す

#### 提案2（論点3）

今の契約（commit・push・PR より前にユーザー動作確認を必須にする）は変えない。例外を一つだけ足す。

> repository の context file の `UI確認環境` が、確認環境へ載せるのに commit・push が要ると定めている場合、その commit・push は確認の前に行ってよい。それ以外の commit・push・PR は、今までどおり確認の後に行う。

書き換える箇所は 4 file・6 か所である。どれも「確認前に commit・push しない」に、この例外を添えるだけである。

| file | 箇所 | 書き換え |
| --- | --- | --- |
| `task-design/tasklist-design.md` | 実装後feedbackと公開action の「commit・push・PRより前にユーザー動作確認を必須にする。」 | 直後に上の例外の文を足す |
| 同 | 自己レビューgate「commit・push・PRより前にユーザー動作確認があるか」 | 「（`UI確認環境`が定める、確認環境へ載せるためのcommit・pushを除く）」を足す |
| `task-design/templates/tasklist.md` | 完了後のaction の ⚠️「動作確認phaseが完了するまでcommit、push、PRを促したり実行したりしない。」 | 「確認環境へ載せるためのcommit・push（`UI確認環境`が定めるもの）を除き、」を頭に足す |
| `tasklist-executor/SKILL.md` | 停止・再開「確認前にcommit・pushへ進まない」、返却「確認より先にcommit・push・PRへ進まない」 | どちらにも「（確認環境へ載せるために`UI確認環境`が定めるcommit・pushを除く）」を足す |
| `steering/SKILL.md` | 6-1「確認が完了する前にcommit、push、PRへ進ませない」、やらないこと「確認前にcommit、push、PRを行う」 | どちらにも同じ除外を足す |

`share-work-in-progress/SKILL.md` と `skills/README.md` は変えない（tasklist-executor の契約の原則は変わらないため）。確認で直したところは、今までどおり確認の後の commit に含まれる。確認の前に確認環境のための commit が既にある場合は、利用者の発言「指摘修正で追いコミットでいいんじゃ無い？」のとおり、既存の commit を書き換えず追加の commit にすることを、、`tasklist-design.md` の例外の文の後に一文で添える。

#### 検討記録（論点3・イテレーション2）

利用者の意図は、確認環境で確かめるために必然性がある commit・push を許すことだった。利用先の作業で問題になったのは、確認環境が commit の push で build されるため、「確認より先に commit しない」が確認環境で確かめること自体を禁じた点である。利用先では、作業 branch の外の一時 commit を確認用の branch へ載せる repository 固有の skill で回避したが、plugin の契約は一時 commit を含む commit・push を一律に禁じたままである。

何が「必然性がある」かは、executor が実行時に判断しない。repository の context file の template には既に `UI確認環境` の節があり、task-design が tasklist を設計する時に読める。そこに「確認環境へ載せるのに commit・push が要る」と書かれている repository だけで、その commit・push を確認の前に許す。確認環境が作業 branch の HEAD を build する repository（branch ごとの preview 等）でも、一時 commit を使う repository でも、同じ文で扱える。

提案0・提案1 から外すもの: phase ごとの commit task、確認を push の前へ移すこと、template の commit block の移動、`share-work-in-progress` と `skills/README.md` の書き換え。

[内部検討記録: 論点3・イテレーション2](./internal-records/task-design-discussion.md.topic-3.md#iteration-2)

#### 提案2へのフィードバック（論点3）

**結果:** 合意

> ok

（2026-10-31、chat 上の発言。利用者は作業中の PR（plugin repository の #9）で、提案2 を当てた diff を見られる状態だった）

### イテレーション3（論点3）: 変更の報告

#### 変更内容3（論点3）

判断根拠: 決定からの導出。例外は「context file の `UI確認環境` が、確認環境へ載せるのに commit・push が要ると定めている場合」に効く。今の context file の template の `UI確認環境` の節には、何を書くかの comment が無く、利用先の repository はそう書けばよいことに気付けない。

`plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md` の `### UI確認環境` の見出しの直後に、他の節と同じ形の comment を足す。

```markdown
<!-- 利用者の動作確認に使う環境と、そこへ載せる方法を書く。
     確認環境へ載せるのに commit・push が要る場合（push で build される環境等）は、その旨と載せ方を書く。
     tasklist-design・tasklist-executor・steering は、ここに書かれた commit・push だけを、利用者の動作確認の前に許す -->
```

- 変更先: 上の 1 か所だけ。この file は plugin repository の context file の instance（`.agents/skills/tumeda-dev-plugin-context.md`）と同じ中身であり、instance にも同じ comment が入る。節の本文（「なし。…」）は変えない。
- 検証: 反映後に validator を通す。

#### 検討記録（論点3・イテレーション3）

他の節（`### Branch / issue 契約`、`### 作業の外へ残るactionの差し込み`）は、見出しの直後に何を書くかの comment を持つ。`### UI確認環境` だけが comment を持たない。例外の条件をこの節に置いたため、書き方の手掛かりも同じ節に置く。

[内部検討記録: 論点3・イテレーション3](./internal-records/task-design-discussion.md.topic-3.md#iteration-3)

### イテレーション4（論点3）: 変更の報告

#### 変更内容4（論点3）

判断根拠: 決定からの導出。skill-update-review の指摘2（`artifacts/skill-structure-review.md`）による。

tasklist-executor は、context file の `## task-design` の中にある `UI確認環境` を読めない（`maintenance-plugin-context` は executor へ共通項目だけを返す）。そのため、確認環境へ載せる commit・push は、task-design が tasklist に task として書かない限り行われない。決定の文は「確認の前に行ってよい」とだけ書き、task を置く指示が無い。次の二か所を足す。

- `task-design/tasklist-design.md` の規則の文: 「そのcommit・pushは確認の前に行ってよい。」の直後に、「その場合は、動作確認の依頼taskの前に、`UI確認環境`が定める載せ方で確認環境へ載せるtaskを置く。」を足す。
- `task-design/templates/tasklist.md` の「動作確認」の Tasks: 先頭に「- [ ] 確認環境へ載せる（`UI確認環境`が載せ方を定めている場合だけ。{載せ方}）」を足す。

あわせて、validator にこの二つの文の assertion を足す。

#### 検討記録（論点3・イテレーション4）

design.md の「ownerと責務」では、task-design が `UI確認環境` を読み、確認環境へ載せる task を動作確認の前に置くとした。skill の文がそれを指示していなかった。指示が無いと、例外は認められていても、確認環境へ載せる task がどの tasklist にも現れず、executor は載せないまま確認を頼む。

同じ review の指摘1（除外の句が箇所によって違う）は、決定の範囲内の機械的な修正として、6 か所の句をそろえた。

### 決定（論点3）

今の契約（commit・push・PR より前にユーザー動作確認を必須にする）は変えず、例外を一つ足す。

> repository の context file の `UI確認環境` が、確認環境へ載せるのに commit・push が要ると定めている場合、その commit・push は確認の前に行ってよい。それ以外の commit・push・PR は確認の後に行う。確認の前に確認環境のための commit が作業 branch にある場合、確認で直したところは既存の commit を書き換えず、追加の commit にする。

- 書き換える箇所: `task-design/tasklist-design.md`（規則の文、自己レビュー gate）、`task-design/templates/tasklist.md`（完了後の action の ⚠️）、`tasklist-executor/SKILL.md`（停止・再開、返却）、`steering/SKILL.md`（6-1、やらないこと）。どれも除外を添えるだけ。
- 変えないもの: `share-work-in-progress/SKILL.md`、`skills/README.md`、commit task を作る条件、作業の外へ残る action を含む phase で止まる規則。
- 何が必然かは executor の実行時の判断にせず、`UI確認環境` の宣言で決める。

選択理由: 利用者の意図は、確認環境で確かめるのに必然性がある commit・push を許すことだけだった（論点2）。phase ごとに確認前に commit する形（提案0・提案1）は、assistant が利用先の tasklist に書いた例外を広げたもので、利用者の意図に無かった。

### 現在の変更（論点3）

イテレーション3 の変更内容3。対象は `plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md` の `### UI確認環境`。2026-10-31 に chat で報告した。

対応する実応答（2026-10-31、報告と論点4 の提案0 を示した後の利用者の発言）:

> ok

反映済み。`### UI確認環境` の見出しの直後に、報告した comment を足した。反映後に validator を通した。

訂正（2026-10-31）: `.agents/skills/` は `plugins/tumeda-dev/skills/` への symlink であり、`.agents/skills/tumeda-dev-plugin-context.md` は同じ file だった。別 file と取り違えて同じ comment を二度足していたため、一つを消した。

イテレーション4 の変更内容4。対象は `task-design/tasklist-design.md` の規則の文と、`templates/tasklist.md` の「動作確認」。2026-10-31 に chat で報告した。

対応する実応答（2026-10-31、報告と、WIP の commit の扱いの問いを示した後の利用者の発言）:

> b

「b」は同じ message の WIP の commit の扱いの問いへの答えであり、変更内容4 の前提を変えない。報告の後の実応答として受け取り、反映した。`tasklist-design.md` の規則の文と template の「動作確認」に報告した文を足し、validator に二つの assertion を足して通した。

## 論点4: 提案1 の導線の置き場所と文

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0（論点4）: 導線を置く場所と文を決める

#### 提案0（論点4）

commit の境界を決める三つの段階に、それぞれ短く置く。

1. design の段階: `task-design/SKILL.md` の Step 3 の末尾（「discussionを選んだ場合の境界」の後）に小節を足す。

    ```markdown
    #### commitの境界が設計判断になる時

    要件にrevertの単位がある時や、変更の分け方でreview・revert・本番適用の単位が変わる時は、commitの境界が設計判断になる。この時は`plan-commits`の判断基準（「分割の優先順位」と「境界を実物へ当てる」）を、designの変更の単位へ当てて境界を決める。designの段階には実差分が無いため`plan-commits`は起動せず、基準だけを当てる。実差分ができた後のcommit計画は`plan-commits`が持つ。

    - やってしまいがちな行動: revertしてもcodeと文書が食い違わない、同じ行を二度直さずに済む、といった必要条件や手間を、境界を決める基準にする
    - それをやると何が起きるか: 取り消す効果が独立した変更まで一つのcommitへまとまり、片方だけを戻せなくなる
    - 正しい判断のための問い: 「この変更を取り消した時に消したい効果と、残したい効果は何か。それは他の変更と同じか」
    ```

2. tasklist の設計: `tasklist-design.md` の commit の生成条件の文の「phase単位かつ意味単位で分け、」を、「phase単位かつ意味単位で分け（分け方の基準は`plan-commits`に従い、commit taskの実行時は実差分へ`plan-commits`を当てて境界を決める）、」にする。
3. commit の実行: `templates/tasklist.md` の「- [ ] commit（phase単位かつ意味単位で分割）」の直下に「  - 境界は、実差分へ`plan-commits`を当てて決める」を足す。

#### 検討記録（論点4・イテレーション0）

commit の境界を決める段階は三つある。design（境界が設計判断になる時）、tasklist の設計（commit の分け方を書く）、commit の実行（実差分を commit する）である。どれか一つだけに置くと、他の段階で「意味単位」の中身が分からないまま残る。

design の段階には実差分が無い。plan-commits は「Git情報を読まず、designやtasklistの見出しだけから計画を作らない」と定めるので、design では skill を起動せず基準だけを当てると書く。commit の実行の段階には実差分があるので、plan-commits をそのまま当てる。

design の小節の「やってしまいがちな行動」には、利用先で起きた取り違え（必要条件と手間を基準にした）を一般化して置いた。plugin の docs と skill が使う、失敗例の三行の形に揃えた。

採らなかった案:

- design の段階だけに置く: tasklist の設計と commit の実行で、同じ取り違えが起きうる。
- 「意味単位」の定義を task-design 側に書く: plan-commits と正本が二つになる。
- design.md の template に「変更の単位と順序」節を足す: 境界が設計判断になる作業でだけ要る節で、すべての design に空の節が増える。

作業中の PR（plugin repository の #9）に、この三か所を当てた diff を入れた。

[内部検討記録: 論点4・イテレーション0](./internal-records/task-design-discussion.md.topic-4.md#iteration-0)

#### 提案0へのフィードバック（論点4）

**結果:** 合意

> ok

（2026-10-31、chat 上の発言。利用者は作業中の PR（plugin repository の #9）で、提案0 を当てた diff を見られる状態だった）

### 決定（論点4）

commit の境界を決める三つの段階に、plan-commits への導線を置く。

1. design の段階: `task-design/SKILL.md` の Step 3 の末尾（「discussionを選んだ場合の境界」の後）に、小節「commitの境界が設計判断になる時」を足す。境界が設計判断になる時は plan-commits の判断基準（「分割の優先順位」と「境界を実物へ当てる」）を design の変更の単位へ当てる。実差分が無いため plan-commits は起動せず基準だけを当てる。失敗例（必要条件や手間を境界の基準にする）を三行の形で置く。
2. tasklist の設計: `tasklist-design.md` の commit の生成条件の文に、「（分け方の基準は`plan-commits`に従い、commit taskの実行時は実差分へ`plan-commits`を当てて境界を決める）」を足す。
3. commit の実行: `templates/tasklist.md` の commit task の直下に「境界は、実差分へ`plan-commits`を当てて決める」を足す。

選択理由: 境界を決める段階は三つあり、一つだけに置くと他の段階で同じ取り違えが起きうる。「意味単位」の定義を別に書くと plan-commits と正本が二つになる。design.md の template に節を足すと、境界が設計判断にならない作業でも空の節が増える。

## 論点5: 既存の commit を書き換えないという考え方を plan-commits に書くか

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0（論点5）: 書く先と文を決める

#### 提案0（論点5）

`plan-commits/SKILL.md` の「分割の優先順位」の末尾にある一文を、既存の commit 全般に広げた段落へ置き換える。

```diff
 利用者が現状保存を明示した場合は、その目的を区別する。
 チェックポイントを意味単位の完成版と称さず、保存範囲を示す。
-既存の保存commitを、履歴が整わないという理由だけで改変しない。
+
+commitの単位は、歴史を理解する単位として、これから作るcommitで厳密に守る。
+一方、既にあるcommitを、履歴の単位を整えるためだけに書き換えない。
+書き換えても良い単位になるとは限らず、書き換えにはrebaseやforce pushが要るためである。
+既にあるcommitの上へ、意味の単位で積む。書き換えるのは利用者が明示した時だけである。
+
+- やってしまいがちな行動: 確認の後の指摘修正を該当commitへ入れ直す、作業中に積んだcommitを意味の単位へ作り直す、を既定にする
+- それをやると何が起きるか: 履歴の書き換えとforce pushを要する。作り直しても良い単位になる保証は無い
+- 正しい判断のための問い: 「この書き換えは利用者が求めたものか。積む形では歴史を理解できないか」
```

あわせて validator に assertion を足す。

#### 検討記録（論点5・イテレーション0）

利用者は design の合意と同じ発言で、WIP の commit を作り直さない理由を「コミット単位は、歴史を理解する単位として厳密にするけど、強硬派のように、コミットを書き換えてでも間違った歴史にしない強制力をするほどじゃ無いと思っているから。うまい単位にならない可能性もあるし」と説明した。

plan-commits の今の文「既存の保存commitを、履歴が整わないという理由だけで改変しない」は、利用者が現状保存を明示した時の commit に限られる。この session で assistant は既存の commit の書き換えを二度既定にした。

- 論点3 の提案0: 確認で直すところが出た phase の commit を、push の前に書き換える。利用者は「指摘修正で追いコミットでいいんじゃ無い？」と答えた。
- steering の `discussion.md` の論点1: WIP の commit を作り直して force push する案を推した。利用者は作り直さない方を選んだ。

どちらも、既存の commit を書き換えないという考え方が手元にあれば出なかった。commit の単位の正本は plan-commits であり、論点4 で task-design と tasklist から plan-commits へ辿る導線を置いたので、同じ正本に置く。

この論点は design の合意の後に生じた。合意すると、design.md の要件に一つ足すことになる。

[内部検討記録: 論点5・イテレーション0](./internal-records/task-design-discussion.md.topic-5.md#iteration-0)

#### 提案0へのフィードバック（論点5）

**結果:** 提案0 を採用。置き場所は暫定

> plan-commitに関係ない気もするけど、一旦ここに間借りさせるか

（2026-10-31、chat 上の発言）

### イテレーション1（論点5）: 変更の報告

#### 変更内容1（論点5）

判断根拠: 決定からの導出。暫定性の明示の標準（`docs/documentation_standards/provisionality_explicitness.md`）の「書く 3 点」による。

利用者は置き場所を暫定とし、理由も述べた。見直す条件は述べていない。
標準は、暫定の判断に見直す条件を書くよう求める。
design.md の MUST の論点5 の行で、「見直す条件は、論点5 の変更内容1 で報告中である。」を次の文に置き換える。

> plan-commits を通らない場面（設計の議論、作業中の共有など）で既にある commit の書き換えを再び既定にした時、または `docs/development_standards/development_flow/` に commit や履歴の扱いを書く時に、置き場所を見直す。
> 移す先の候補は `development_flow/` である。

skill の本文には書かない。本文の規則そのものは暫定ではなく、暫定なのは置き場所だけであるため。

#### 検討記録（論点5・イテレーション1）

一つ目の条件を「plan-commits を通らない場面での再発」にしたのは、置き場所の弱点がそこにあるためである。
plan-commits は commit を計画・実行する時に読まれる。
この session で書き換えを既定にした二つの場面は、どちらも plan-commits を通らなかった。
論点3 の提案0 は tasklist の契約を設計する議論の中、WIP の commit を作り直す案は作業中の PR を共有した後だった。

移す先の候補を `development_flow/` にしたのは、開発標準の README が「開発そのもの（何を作るか、どう名付けるか、どう進めるか）」をこの群に置くと定め、task-design が設計前に配下をすべて読むためである。
設計の議論で読まれる場所になる。今移さないのは、利用者が今回は間借りを選んだためである。

[内部検討記録: 論点5・イテレーション1](./internal-records/task-design-discussion.md.topic-5.md#iteration-1)

### 決定（論点5）

`plan-commits/SKILL.md` の「分割の優先順位」の末尾の一文「既存の保存commitを、履歴が整わないという理由だけで改変しない。」を、次の段落と三行の失敗例（提案0 の diff のとおり）に置き換える。
validator に assertion を足し、design.md の MUST に一つ足す。

> commitの単位は、歴史を理解する単位として、これから作るcommitで厳密に守る。
> 一方、既にあるcommitを、履歴の単位を整えるためだけに書き換えない。
> 書き換えても良い単位になるとは限らず、書き換えにはrebaseやforce pushが要るためである。
> 既にあるcommitの上へ、意味の単位で積む。書き換えるのは利用者が明示した時だけである。

置き場所は暫定である（利用者「一旦ここに間借りさせるか」）。暫定にした理由は、利用者の「plan-commitに関係ない気もする」による。
見直す条件（イテレーション1 の変更内容1）: plan-commits を通らない場面（設計の議論、作業中の共有など）で既にある commit の書き換えを再び既定にした時、または `docs/development_standards/development_flow/` に commit や履歴の扱いを書く時に、置き場所を見直す。移す先の候補は `development_flow/` である。

選択理由: この session で assistant は、既にある commit の書き換えを二度既定にした（論点3 の提案0、steering の `discussion.md` の論点1）。
今の文は現状保存の commit に限られ、どちらにも効かなかった。
今ある skill のうち commit の単位を扱うのは plan-commits であり、論点4 で task-design と tasklist から辿る導線を置いた。

### 現在の変更（論点5）

イテレーション1 の変更内容1。対象は design.md の MUST の論点5 の行の、見直す条件の文。2026-10-31 に chat で報告した。

対応する実応答（2026-10-31、報告と論点6 の提案0 を示した後の利用者の発言）:

> ok

「ok」は同じ message の論点6 の問いへの答えでもある。変更内容1 への異論は無く、論点6 の答えは変更内容1 の前提を変えない。報告の後の実応答として受け取り、反映した。design.md の MUST の論点5 の行で、報告中の文を見直す条件に置き換えた。

## 論点6: share-work-in-progress の「後から整理される前提」を、論点5 の決定に合わせるか

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0（論点6）: 書き換えるかと文を決める

#### 提案0（論点6）

`share-work-in-progress/SKILL.md` の「起動gate」の二段落目を書き換える。

```diff
-このskillが作るcommitは、後からamendやrebaseで整理される前提を持つ。履歴として残すためのcommitではない。
+このskillが作るcommitは、作業中の内容を見せるためのcommitであり、意味の単位になっているとは限らない。
+後から整理するかは利用者が決める。既にあるcommitの扱いは`plan-commits`に従う。
```

あわせて次を直す。

- design.md: 非目標の「`share-work-in-progress` と `skills/README.md` の書き換え」から `share-work-in-progress` を外す。受け入れ基準の「`share-work-in-progress/SKILL.md` が `c1122f5` から変わっていない」を、この段落だけが変わった形に直す。完成後の姿と付録にこの段落を足す。
- validator: 新しい文の assertion と、「後からamendやrebaseで整理される前提を持つ」が戻らない assertion を足す。

#### 検討記録（論点6・イテレーション0）

論点5 で plan-commits に「既にあるcommitを、履歴の単位を整えるためだけに書き換えない」「書き換えるのは利用者が明示した時だけ」と書いた。
share-work-in-progress は、自分が作る commit を「後からamendやrebaseで整理される前提を持つ」と書く。
WIP の commit を扱う agent は、二つの skill から逆の既定を受け取る。

この文は実際に判断へ効いた。
steering の `discussion.md` の論点1 で、assistant が WIP の commit を作り直して force push する案を推した時、検討記録の根拠はこの文だった。利用者は作り直さない b を選んだ。

文を消すだけにはしない。消すと、WIP の commit が意味の単位になっていないことが読み手に伝わらない。
利用者は論点1 で、WIP の commit が main の履歴に残ることを受け入れた。「意味の単位になっているとは限らない」は、利用者の「うまい単位にならない可能性もある」に合う。

既にある commit の扱いの規則は、plan-commits への参照だけを置き、share-work-in-progress へ写さない。論点5 の置き場所を後で移す時に、写しが古く残らないようにするためである。

design の合意では share-work-in-progress を変えないとした。その理由は「tasklist-executor の契約の原則は変わらない」であり、この段落は扱っていなかった。合意すると、非目標を一つ外すことになる。

[内部検討記録: 論点6・イテレーション0](./internal-records/task-design-discussion.md.topic-6.md#iteration-0)

#### 提案0へのフィードバック（論点6）

**結果:** 提案0 を採用

> ok

（2026-10-31、chat 上の発言）

### 決定（論点6）

`share-work-in-progress/SKILL.md` の「起動gate」の二段落目を、次に書き換える。

> このskillが作るcommitは、作業中の内容を見せるためのcommitであり、意味の単位になっているとは限らない。
> 後から整理するかは利用者が決める。既にあるcommitの扱いは`plan-commits`に従う。

- 既にある commit の扱いの規則は写さず、plan-commits への参照だけを置く。
- design.md の非目標から「`share-work-in-progress` の書き換え」を外し、「起動gate」の二段落目以外は変えないとする。tasklist-executor の契約を引く段落は変えない。
- validator に、新しい二文の assertion と、「後からamendやrebaseで整理される前提を持つ」が戻らない assertion を足す。

選択理由: 元の文は、WIP の commit を書き換えるものとして読み手に渡し、論点5 の決定と逆の既定になっていた。steering の `discussion.md` の論点1 で WIP の commit を作り直す案が出た根拠も、この文だった。消すだけにすると、WIP の commit が意味の単位でないことが伝わらない。

## 論点7: 引き渡す内容に、利用者が合意した範囲を足すか

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0（論点7）: 足すかと文を決める

#### 提案0（論点7）

steering の Step 4 の再発防止 review で、論点2・論点3 の取り違えの原因を `escalate-plugin-skill-fix` に求めた。`escalate-plugin-skill-fix/SKILL.md` の「引き渡す内容」を次のように変える。

```diff
-次の三点を、利用先repository固有の情報を除いた形で取り出す。
+次の四点を、利用先repository固有の情報を除いた形で取り出す。

 - 提案の内容
 - その提案が必要だと分かった具体例
 - 提案の根拠
+- 利用者が合意した範囲。引き渡すことへの合意と提案の中身への合意を分け、利用者の原文を添える。中身や根拠をassistantが書いた場合は、その旨を示す。
+
+受け取った側は、利用者の原文で確かめられない中身を未合意として扱い、設計で改めて合意を取る。
```

あわせて validator に assertion を足し、design.md の要件・完成後の姿・付録に足す。

#### 検討記録（論点7・イテレーション0）

論点2・論点3 で、assistant は引き渡された提案2 の中身（phase ごとに確認の前に local で commit する）を、利用者が合意したものとして設計を進めた。
利用者の「1:b」は、確認環境とぶつかる問題を plugin へ回すことへの合意であり、中身への合意ではなかった。
利用者は「review環境で確認するとか必然性があるコミットを許可してるだけなのに」と正した。

引き渡しの記録は、根拠に「assistant の整理」と付けていたが、提案の中身が誰の言葉かは示していなかった。
今の「引き渡す内容」は、提案・具体例・根拠の三点だけを求め、利用者が何に合意したかを求めない。
受け取る側には、引き渡しへの合意と中身への合意を見分ける材料が無い。

引き渡しは利用先から plugin への経路であり、利用先が変わっても同じ形で起きる。原因は skill の不足と判断した。
保留の経路（`pending-escalations.md`）も、条件成立後は同じ「引き渡す内容」を通るため、置く場所は一か所でよい。

[内部検討記録: 論点7・イテレーション0](./internal-records/task-design-discussion.md.topic-7.md#iteration-0)

#### 提案0へのフィードバック（論点7）

**結果:** 提案0 を採用

> ok

（2026-10-31、chat 上の発言）

### 決定（論点7）

`escalate-plugin-skill-fix/SKILL.md` の「引き渡す内容」を四点にし、受け取った側の扱いを足す。

> - 利用者が合意した範囲。引き渡すことへの合意と提案の中身への合意を分け、利用者の原文を添える。中身や根拠をassistantが書いた場合は、その旨を示す。
>
> 受け取った側は、利用者の原文で確かめられない中身を未合意として扱い、設計で改めて合意を取る。

- 置き場所はこの節だけとする。保留からの転送も、条件成立後はこの節を通る。
- validator に、足した二文の assertion と、「次の三点を」が戻らない assertion を足す。design.md の要件・完成後の姿・付録に足す。

選択理由: 論点2・論点3 で、引き渡しへの合意（「1:b」）を提案の中身への合意として読んだ。受け取る側が二つを見分ける材料は、渡す側でしか作れない。

## 論点8: escalate-plugin-skill-fix の取り込みの節と、context の Git 運用の記述をどうそろえるか

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0（論点8）: 取り込みに PR を経由するかを決める

#### 提案0（論点8）

二つの記述は、出どころが違う。

- `escalate-plugin-skill-fix/SKILL.md` の「plugin repositoryでの作業完了後の取り込み」は、2026-08-31 の利用者の指示による。作業 branch を push し、`main` へ merge して `main` を push する。PR は経由しない。
  > このスキルが使われるホームポジションはpluginを使う側であり、使う側のリポジトリにとってpluginはサブであり、自活したい。わざわざgithubを開いてPRをマージするより、さっとpluginを更新してメインの動きに戻りたい
- context file の `### Git / GitHub公開条件` の「default branch: `main`。commitとpushをdefault branchへ直接行わない。」は、同じ時期に、空だった context の instance を埋めた時に assistant が書いた。利用者と議論した記録は無い。

食い違いは、この一文の「直接」が二通りに読めることから来る。「`main` の上で commit しない（作業は branch で行う）」と読めば 4 step と両立する。「`main` へ push しない」と読むと両立しない。

次のどちらかを選ぶ。

- a) PR を経由しない取り込みを続ける（推奨）。escalate は変えず、context の一文を次のように直す。

  ```diff
  -- default branch: `main`。commitとpushをdefault branchへ直接行わない。
  +- default branch: `main`。default branchの上で直接commitしない。作業はbranchで行う。
  +  - `escalate-plugin-skill-fix`で引き渡された作業は、同skillの「plugin repositoryでの作業完了後の取り込み」に従い、PRを経由せず作業branchを`main`へmergeしてpushする。
  ```

- b) PR を経由する取り込みに変える。escalate の取り込みの節（4 step と PR を経由しない理由）を、作業 branch を push して PR を作り、merge は利用者が行う形に置き換える。context は変えない。

どちらでも、validator の assertion（今は 4 step の文を検査している）を合わせ、design.md に足す。
この作業（PR #9）の取り込みは、steering の `discussion.md` 論点2 で決めたとおり、利用者が PR #9 を merge する。

推奨は a。08-31 の理由を取り下げる発言は記録に無い。この作業で PR を開いたのは、設計の途中の diff を見るため（share-work-in-progress）であり、取り込みの review のためではなかった。

#### 検討記録（論点8・イテレーション0）

steering の `discussion.md` 論点2 で、assistant は二つの記述を、同じ重みの決まりどうしの食い違いとして示した。論点8 の案を作る前に、それぞれの出どころを git の履歴と過去の steering の記録で確かめた。

- 4 step は、2026-08-31 の steering の議論で利用者が手順と理由を指示し、そのまま合意された。
- context の一文は、同じ時期の commit で、assistant が「検証した実fact」として instance に書いた。議論の記録は見つからなかった。
- `main` の履歴には、PR を経由しない merge（`Merge branch '<steering の basename>'`）と、PR の merge（#8）の両方がある。

また、論点2 で assistant は b（別の作業にする）を推奨し、理由を「この作業の目的の決定・実装範囲は、この判断で変わらない」とした。
`development_flow/work_scope.md` は、目的の外であることを切り出す理由にしない。既定は今の作業で拾う。利用者の「a」は、この標準に沿う。

a の一文は、context file の template にも入る。この file は配布する template と、この repository の instance を兼ねるためである。
template がこの repository 固有の事実を持つことは、この論点の前からある（remote、version bump など）。この論点の結論は、それで変わらない。

[内部検討記録: 論点8・イテレーション0](./internal-records/task-design-discussion.md.topic-8.md#iteration-0)

#### 提案0へのフィードバック（論点8）

**結果:** 提案0 を取り下げた（利用者の採否が要らない問いだった）

> なんか、それでそんな問題起きる？みたいなことで何度か答えさせられてる感じがする。
> skill-updatereviewがうるさいせいからか？
> あれに依頼したことはskill.mdから切り出せるものがあったら分割透知しろってだけの内容だったのに

（2026-10-31、chat 上の発言。提案0 の a / b へは答えていない）

この発言は、この作業で出た問いの全体について述べたものであり、論点8 だけを指してはいない。
assistant は、論点8 がそうした問いの一つにあたると判断し、提案0 を取り下げた。
答えは 2026-08-31 の利用者の指示から一つに決まり、提案0 自身がそれを推奨の理由に挙げていた。
次の回で、a を既決事項から導いた変更として報告する。

### イテレーション1（論点8）: 変更の報告

#### 変更内容1（論点8）

判断根拠: 既決事項からの導出。2026-08-31 の利用者の指示（提案0 に引用した「わざわざgithubを開いてPRをマージするより、さっとpluginを更新してメインの動きに戻りたい」）による。この指示を取り下げる発言は記録に無い。

PR を経由しない取り込みを続ける。`escalate-plugin-skill-fix/SKILL.md` は変えない。
`plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md` の `### Git / GitHub公開条件` の一行を、提案0 の a のとおりに直す。

```diff
-- default branch: `main`。commitとpushをdefault branchへ直接行わない。
+- default branch: `main`。default branchの上で直接commitしない。作業はbranchで行う。
+  - `escalate-plugin-skill-fix`で引き渡された作業は、同skillの「plugin repositoryでの作業完了後の取り込み」に従い、PRを経由せず作業branchを`main`へmergeしてpushする。
```

- 変更先: 上の 1 か所。この file は配布する template と、この repository の instance を兼ねるため、template にも同じ文が入る。
- validator: 新しい二行の assertion を足す。escalate の 4 step の assertion はそのまま残す。
- design.md: 論点8 の TBD を、この変更に置き換える。
- この作業（PR #9）の取り込みは、steering の `discussion.md` 論点2 の決定のまま、利用者が PR #9 を merge する。この変更は次の作業から効く。
- 検証: 反映後に validator を通す。

#### 検討記録（論点8・イテレーション1）

提案0 は、答えが既決事項から一つに決まるのに、a / b の採否として問うた。
facilitate-discussion の `derived-change.md` は、既決事項から一意に導いた変更を、採否を問わずに報告し、次の実応答を確かめてから反映すると定める。論点8 はこれにあたった。
この作業で出した問いの出どころと、利用者の採否が要らなかった問いを、内部検討記録にまとめた。

[内部検討記録: 論点8・イテレーション1](./internal-records/task-design-discussion.md.topic-8.md#iteration-1)

### 決定（論点8）

PR を経由しない取り込み（`escalate-plugin-skill-fix/SKILL.md` の「plugin repositoryでの作業完了後の取り込み」）を続ける。escalate は変えない。
context file の `### Git / GitHub公開条件` の一行を、変更内容1 の diff のとおりに直す。`main` の上で直接 commit しないことと、escalate で引き渡された作業は PR を経由せず `main` へ merge して push することを書く。
validator に新しい二行の assertion と、元の一文が無いことの検査を足す。design.md の論点8 の TBD を、この変更の行に置き換える。

典拠は 2026-08-31 の利用者の指示（提案0 に引用）であり、取り下げる発言は記録に無い。
この作業（PR #9）の取り込みは、steering の `discussion.md` 論点2 の決定のまま、利用者が PR #9 を merge する。この変更は次の作業から効く。

選択理由: context の一文は、空の instance を埋めた時に assistant が書いたもので、議論の記録が無い。「直接」を「`main` へ push しない」と読むと、利用者の指示による 4 step と食い違う。利用者の指示に合わせて、一文の方を直す。

### 現在の変更（論点8）

イテレーション1 の変更内容1。対象は context file の `### Git / GitHub公開条件` の一行、validator、design.md の論点8 の TBD。2026-10-31 に chat で報告した。

対応する実応答（2026-10-31、報告の後の利用者の発言）:

> 検出に絞るかどうかは、この論点に限らず、今回の一連のsteeringで、間違ってないわけではないけれども、価値が少ない問答が遅延行為になったかで決める

この発言は論点9 の問いへの答えである。変更内容1 への異論は無い。報告の後の実応答として受け取り、反映した。
反映後に validator を通した。

## 論点9: skill-update-review を、SKILL.md から切り出せるものの検出に絞るか

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0（論点9）: 絞るかを決める

この回は事後記録である（2026-10-31 に記録）。chat で問いを出す前に、この file へ保存しなかった。

#### 提案0（論点9）

（2026-10-31 の chat で assistant が示した問い）

skill-update-review を「SKILL.md から切り出せるもの」の検出だけに絞るか。

- そのまま（推奨）: この作業で問いが多かった原因は assistant であり、skill-update-review から出た問い（論点3 の変更内容4、論点6）は、実際に起きていた問題だったため。
- 絞る: `.steering/2026/202610/20261018-escalate-pending-plugin-improvements/` の論点46 などの決定を見直すことになるので、別の作業にする。

#### 検討記録（論点9・イテレーション0）

利用者が、問いの多さは skill-update-review のせいかと問い、skill-update-review に頼んだのは SKILL.md から切り出せるものの通知だけだったと述べた（発言の原文は論点8 の提案0 へのフィードバック）。
assistant は、この作業の問いの出どころと、skill-update-review の元の目的を確かめた。

[内部検討記録: 論点8・イテレーション1 の記録1](./internal-records/task-design-discussion.md.topic-8.md#iteration-1-record-1)

#### 提案0へのフィードバック（論点9）

**結果:** 判断の基準が示された。採否は未決

> 検出に絞るかどうかは、この論点に限らず、今回の一連のsteeringで、間違ってないわけではないけれども、価値が少ない問答が遅延行為になったかで決める

（2026-10-31、chat 上の発言）

提案0 の推奨の理由（実際に起きていた問題だった）は、指摘が正しいかを見ていた。
利用者の基準は、正しくても価値が少ない問答が、作業を遅らせたかである。
提案0 の推奨は、この基準で見直す。

### イテレーション1（論点9）: 利用者の基準に当てて、絞るかを決める

#### 提案1（論点9）

今回の一連の steering は、利用先 repository の steering（既存の「いいね」の一括取込みを外す作業。`request-check-on-review-environment` を作った）と、この作業の二つとした。
この二つで skill-update-review は 8 回 review した（利用先で 3 回、この作業で 5 回）。
そこから利用者との問答が 5 回生じた。

| 問答 | 指摘 | 価値 |
| --- | --- | --- |
| 利用先の論点11 の報告 | 一時 commit の command 列が、実行する directory で変わる | 高い。agent の shell は steering の directory へ移ることがあり、そこで実行すると `.steering/` だけが確認環境へ載る |
| 利用先の論点15 の報告 | skill の入力と返却が無い | 低い。main を取り込まずに載せると選んで呼び直すと、手順2 で再び止まる。agent がその場で気づいて避けられる |
| 利用先の論点9 のイテレーション1 の報告 | 終了 code 4 が design.md に無い | 低い。skill と script には既に入っていた。design.md の記録を実物にそろえただけである |
| この作業の論点3 の変更内容4 | 確認環境へ載せる task を置く指示が無い | 低い。確認環境を持つ利用先は今は一つで、そこでは `request-check-on-review-environment` が確認の task で起動して載せる |
| この作業の論点6 | share-work-in-progress の一文が、逆の既定を渡す | 低い。誤りは一度起きたが、論点5 で plan-commits に規則が入った後は、効く場面が少ない |

- 価値が高かったのは 1 回（利用先の論点11）。
    - これも切り出しの指摘ではない。review の中で command を実行して見つけたものであり、動作の検証でも見つけられる。
- 切り出しの指摘は、8 回の review で一件も無かった。
- 問答の他に、review ごとに読んだ file の hash を記録し、再 review で照合した。これも作業を遅らせた。

利用者の基準に当てると、価値が少ない問答が 5 回のうち 4 回あり、遅延になった。次のどれかを選ぶ。

- a) 絞る。別の作業で行う（推奨）
- b) 絞る。この作業で行う
- c) そのまま

推奨は a。絞るのは利用者の基準による。
別の作業にするのは、絞ると 20261018 の論点31〜47 の決定（不合格なら完了にしない、受渡しや二重管理の確認、hash で版を結ぶ等）のどれを残すかを決め直す必要があり、この作業に含めると PR #9 の取り込みが遅れるためである（`development_flow/work_scope.md` の二段目「今の作業に含めると、本番への適用が遅れる」）。
a か b を選んだ場合、受け入れる弱点として、論点11 のような動作の不備を skill-update-review では見つけなくなる。動作の検証で見つける。

a を選んだ場合は、別の作業の steering を先に作り、この作業の design.md に今はやらない理由と切り出し先を書く。

#### 検討記録（論点9・イテレーション1）

利用先の steering の三つの報告と、この作業の二つの問答を、それぞれ「直さなかったら、いつ誰が何を誤ったか」で見直した。
価値の判定の根拠と、各問答の出典は内部検討記録に置いた。

[内部検討記録: 論点9・イテレーション1](./internal-records/task-design-discussion.md.topic-9.md#iteration-1)

#### 提案1へのフィードバック（論点9）

**結果:** 調査の観点を訂正された。採否は未決

> えっと、調査観点が違う。skill-update-reviewが、切出しだけで機能してるならいいんだけど、それ以上のうるさい指摘存在になってないかというところ

（2026-10-31、chat 上の発言）

提案1 は、指摘一つ一つの価値を測った。
利用者が見たいのは、skill-update-review が切り出しの検出を超えた指摘をしていないかである。価値が高い指摘でも、切り出しの指摘でなければ、範囲を超えている。

### イテレーション2（論点9）: 切り出しを超えた指摘をしているかを確かめる

#### 提案2（論点9）

skill-update-review を使った三つの steering の記録を見た。20261027 の steering、利用先 repository の steering（既存の「いいね」の一括取込みを外す作業）、この作業である。

指摘は 12 件あり、切り出しの指摘は 0 件だった。12 件すべてが切り出しを超えた指摘である。そのうち 9 件が、利用者への報告になった（20261027 で 4 回、利用先で 3 回、この作業で 2 回）。

| 指摘の種類 | 件数 | 指摘 | 指摘を求めている skill の文 |
| --- | --- | --- | --- |
| 処理の順序・位置 | 3 | 20261027 の 1・2・5 | `assess-structure.md` の「全体の責務と進行を照合する」 |
| 受渡し・入出力・状態の遷移 | 4 | 20261027 の 4・6、利用先の指摘2、この作業の 1 回目の指摘2 | 同じ節の「入出力、判断・状態、停止・再開・返却」、description の「受渡し」 |
| 文・規則の食い違い | 3 | 20261027 の 3、この作業の 1 回目の指摘1（句）、3 回目の指摘1（share-work-in-progress） | 同じ節の「規則の正本」、「変更caseで構造を評価する」の二重正本 |
| command の不具合 | 1 | 利用先の指摘1（実行する directory で結果が変わる） | script の中身まで読む範囲（20261018 の論点46） |
| 記録と実物の差 | 1 | 利用先の編集後 review の終了 code 4 | 編集後 review の、構造案との照合 |

切り出しを超えた指摘は、運用で広がったのではなく、skill の文が求めている。
skill を作った commit（`b172223`）の時点で、description は「全体の責務・判断・状態・受渡しをreviewする」であり、`assess-structure.md` の最初の節は順序・入出力・状態・返却・規則の正本の照合を求めていた。
切り出しに当たる文は、同じ節の「独立した改訂理由と検証のまとまり」と、一 file を維持するか・内部指示へ分けるか・別 skill にするかの判定の段落だけである。

次のどれかを選ぶ。

- a) 切り出しの検出に絞る。別の作業で行う（推奨）
- b) 切り出しの検出に絞る。この作業で行う
- c) そのまま

推奨は a。
絞るのは、skill-update-review が切り出しの検出では一度も働かず、切り出しを超えた指摘だけをしていたためである。
別の作業にするのは、description、`assess-structure.md` の最初の節、再 review と hash の照合の節を書き直し、20261018 の論点31〜47 の決定のどれを残すかを決め直すことになるためである。この作業に含めると、PR #9 の取り込みが遅れる（`development_flow/work_scope.md` の二段目「今の作業に含めると、本番への適用が遅れる」）。
受け入れる弱点として、利用先の指摘1 のような動作の不備を、skill-update-review では見つけなくなる。動作の検証で見つける。

#### 検討記録（論点9・イテレーション2）

三つの steering の review の記録から指摘を拾い、切り出しの指摘かどうかと、その指摘を求めている skill の文を対応づけた。
20261018 の steering（skill-update-review を作った作業）の中の review は見ていない。

[内部検討記録: 論点9・イテレーション2](./internal-records/task-design-discussion.md.topic-9.md#iteration-2)

#### 提案2へのフィードバック（論点9）

**結果:** 提案2 を a で採用

> a

（2026-10-31、chat 上の発言）

### 決定（論点9）

skill-update-review を、SKILL.md から切り出せるもの（独立した判断・状態・完了条件・改訂理由を持つ工程の抱え込み）の検出に絞る。
この作業では行わず、別の作業にする。この作業の design と plan は変えない。

- 切り出し先: 保留メモ [`pending-escalations/001-narrow-skill-update-review-to-split-detection.md`](./pending-escalations/001-narrow-skill-update-review-to-split-detection.md)。plugin repository は issue を持たないため（context file の `### Branch / issue 契約`）、別の steering を起動するまでの間は、escalate-plugin-skill-fix の保留の仕組みで追跡する。
- 再開条件: この作業の完了の後に、plugin repository で別の steering を起動して扱う。
- 書き直す範囲と残す決定（20261018 の論点31〜47）は、別の作業で決める。
- design.md の非目標へ、今はやらない理由と切り出し先を書く。

選択理由: skill-update-review を使った三つの steering で、指摘 12 件のうち切り出しの指摘は 0 件だった。切り出しを超えた指摘は、運用ではなく skill の文が求めていた。別の作業にするのは、この作業に含めると PR #9 の取り込みが遅れるためである（`development_flow/work_scope.md` の二段目）。
受け入れる弱点: 動作の不備を skill-update-review では見つけなくなる。動作の検証で見つける。

## 論点10: 見つけた不備を問いにする前に、何を確かめるか

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0（論点10）: 確かめることと、書く場所を決める

#### 提案0（論点10）

`plugins/tumeda-dev/docs/think_standards/advancing_discussion.md`（議論を進めるとき）の末尾に、次の補助を足す。

```markdown
## 補助: 見つけた不備を問いにする前に、誤る場面を一つ言う

作業中に、文と文の食い違いや記述の欠けに気付くことがある。問いにする前に、直さなかった時に、どの場面で誰が何を誤るかを一つ言う。
言えなければ問いにしない。言えても、答えが既にある発言や決定から一つに決まるなら、採否を問わず、導いた結果として報告する（[ユーザーから指摘・提案を受領したとき](./receiving_feedback.md)の、外部にある情報は自分で取りに行く）。

やってしまいがちな行動:
- 二つの文の食い違いに気付いた時点で、どちらへ揃えるかを利用者の採否にする
- 誤りが起きていない潜在的な欠けを、拾うか切り出すかの問いにする

それをやると何が起きるか:
- 間違ってはいないが価値の少ない問答が積み重なり、作業が遅れる。例えば、repository 固有の文書と skill の手順の食い違いを二択で問うたが、答えは利用者の過去の指示から一つに決まっていた。配布する template が配布元固有の事実を持つことを問うたが、利用先で誤りは起きていなかった

正しい判断のための問い:
「この不備を直さなかったら、いつ、誰が、何を誤るか。その答えは、既にある発言や決定から決まらないか」
```

あわせて validator に、見出しの assertion を足す。design.md の要件・完成後の姿に一行足す。

#### 検討記録（論点10・イテレーション0）

この作業で、答えが既にあった問い・誤りが起きていない問いを、assistant が三つ起こした（論点1、steering の論点2 と論点8、template の件。[論点8 の内部検討記録](./internal-records/task-design-discussion.md.topic-8.md#iteration-1-record-1)）。
答えが既にあるかは、`receiving_feedback.md` の主軸（外部にある情報は自分で取りに行く）と facilitate-discussion の導出変更が既に扱う。assistant の当てはめの誤りである。
直さなかった時に誤る場面を確かめる問いは、思考標準にも skill にも無い。これを足す。

書く場所は、思考標準の「議論を進めるとき」にした。
問いを出すのは設計・review・実装のどの場面でも起き、template の件は discussion を通さず chat で問うた。facilitate-discussion の論点を起こす判定に置くと、discussion の外で出す問いに効かない。
主軸（問いはロジックツリーの上位から）とは別の判断なので、補助にする（`evolution_policy.md`）。

[内部検討記録: 論点10・イテレーション0](./internal-records/task-design-discussion.md.topic-10.md#iteration-0)

#### 提案0へのフィードバック（論点10）

**結果:** 提案0 を採用

> ok

（2026-10-31、chat 上の発言）

### 決定（論点10）

`plugins/tumeda-dev/docs/think_standards/advancing_discussion.md` の末尾に、提案0 の「補助: 見つけた不備を問いにする前に、誤る場面を一つ言う」を、提案0 の文のとおり足す。
validator に見出しと判断の問いの assertion を足し、design.md の要件・完成後の姿・受け入れ基準・付録に足す。

選択理由: この作業で assistant は、答えが既にあった問い・誤りが起きていない問いを三つ起こした。答えが既にあるかは `receiving_feedback.md` と facilitate-discussion の導出変更が既に扱うため、参照だけにする。直さなかった時に誤る場面を確かめる問いは、どこにも無かった。
思考標準に置くのは、問いを出す場面が設計・review・実装のどこでも起き、discussion を通さず chat で問うこともあるためである。

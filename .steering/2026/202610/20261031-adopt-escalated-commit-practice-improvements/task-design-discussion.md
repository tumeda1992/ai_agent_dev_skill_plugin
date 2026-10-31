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

**ステータス:** 反映待ち

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

### 決定（論点3）

今の契約（commit・push・PR より前にユーザー動作確認を必須にする）は変えず、例外を一つ足す。

> repository の context file の `UI確認環境` が、確認環境へ載せるのに commit・push が要ると定めている場合、その commit・push は確認の前に行ってよい。それ以外の commit・push・PR は確認の後に行う。確認の前に確認環境のための commit が作業 branch にある場合、確認で直したところは既存の commit を書き換えず、追加の commit にする。

- 書き換える箇所: `task-design/tasklist-design.md`（規則の文、自己レビュー gate）、`task-design/templates/tasklist.md`（完了後の action の ⚠️）、`tasklist-executor/SKILL.md`（停止・再開、返却）、`steering/SKILL.md`（6-1、やらないこと）。どれも除外を添えるだけ。
- 変えないもの: `share-work-in-progress/SKILL.md`、`skills/README.md`、commit task を作る条件、作業の外へ残る action を含む phase で止まる規則。
- 何が必然かは executor の実行時の判断にせず、`UI確認環境` の宣言で決める。

選択理由: 利用者の意図は、確認環境で確かめるのに必然性がある commit・push を許すことだけだった（論点2）。phase ごとに確認前に commit する形（提案0・提案1）は、assistant が利用先の tasklist に書いた例外を広げたもので、利用者の意図に無かった。

### 現在の変更（論点3）

イテレーション3 の変更内容3。対象は `plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md` の `### UI確認環境`。2026-10-31 に chat で報告した。対応する実応答は未着。未反映。

## 論点4: 提案1 の導線の置き場所と文

**ステータス:** 応答待ち

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


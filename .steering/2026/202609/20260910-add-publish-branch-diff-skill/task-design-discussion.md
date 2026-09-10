# 議論記録

## 論点1: この skill が公開する差分とは何か

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0: working tree の全部を commit してから公開する

#### 提案0

**推奨:** b。依頼の起点は「出来上がったものを見たい」であり、出来上がったものは commit 前の working tree にある。

- **a. commit 済みの差分だけを公開する。未 commit の変更があれば停止して報告する。**
  - この skill は commit を作らない。commit は呼ぶ前に済んでいる前提
  - `tasklist-executor` が持つ commit の責務と重複しない
  - remote と同一 HEAD で push できる commit が無い場合だけ、PR を成立させるために空 commit を作る
  - 起点となったケース（untracked の成果物が残っている状態）では停止する。利用者が commit してから呼び直すことになり 2 往復になる
- **b. working tree の全部を commit してから公開する。**
  - 未 commit の変更（untracked を含む）があれば、すべて stage して 1 commit にする
  - 「今の状態を見せる」という目的に対し、見せたいものが漏れない
  - commit する範囲の判断が要らない。全部という一つの規則で決まる。message は定型でよい
  - 作業用 branch を対象とするため、後から amend や rebase で整理できる
  - commit するものが何も無く、かつ remote と同一 HEAD の場合だけ空 commit を作る
- **c. commit 済みの差分だけを公開する。未 commit の変更は放置して push する。**
  - 停止しないため 1 往復で終わる
  - 見えるはずのものが見えない。利用者は「push した」という報告を受けるが、URL には未 commit の内容が無い
  - 差分が空の PR ができ得る

#### 提案背景

依頼文は「プッシュできるだけコミットがなかったら空コミットする」と書いている。空 commit の目的を確認すると、この論点が立つ。

空 commit は差分を持たないため、push しても GitHub 上で見えるものは増えない。それでも必要になるのは、remote の default branch と同一 HEAD の branch では PR を作れないためである。HEAD を一つ進めて PR を成立させるための最小差分が空 commit である。

したがって空 commit は「見せるための差分」ではなく「PR を成立させるための差分」である。見せたい中身が commit されていない場合、空 commit を足しても目的は達成されない。

起点となったケースがこれにあたる。利用先 repository の作業 branch は default branch と同一 HEAD であり、見せたい成果物は untracked のまま working tree に残っていた。空 commit と push だけでは、依頼者は中身を読めない。

提案0 が満たす必要のある条件は次の三つである。

1. 「出来上がったものを見たい」という起点の目的が、一度の起動で達成されること
2. commit する範囲の判断を skill が抱え込まないこと
3. `tasklist-executor` が持つ commit の責務と二重にならないこと

条件1 は案 b だけが満たす。案 a は未 commit があると停止するため 2 往復になる。案 c は停止しないが、見せたい中身が公開されない。

条件2 について、案 b は「working tree の全部」という一つの規則で範囲が決まる。どれを含めどれを外すかの判断が発生しない。commit message も定型でよい。

条件3 が案 b の弱点にあたる。`tasklist-executor` は tasklist が指示した commit を作る owner であり、この skill が commit を作ると commit を作る skill が二つになる。ただし両者は起動契機が違う。`tasklist-executor` は合意済み tasklist に従って意味のある単位で commit する。この skill は作業途中の状態をそのまま見せるために commit する。前者は履歴として残す commit、後者は共有のための commit である。

この違いを踏まえると、案 b が作る commit は後から整理される前提のものになる。作業用 branch を対象とし、default branch を対象にしない限り、amend や rebase で整理できる。

#### 提案0へのフィードバック

**結果:** 案 b を採用。

> b

### 決定

この skill は working tree の全部を commit してから公開する。未 commit の変更が untracked を含めて残っていれば、すべて stage して 1 commit にする。

commit する範囲は「working tree の全部」という一つの規則で決まる。どれを含めどれを外すかの判断を skill が抱えない。commit message は定型とする。

空 commit を作るのは、commit するものが何も無く、かつ remote の default branch と同一 HEAD で PR を作れない場合だけである。空 commit は差分を持たないため、見せるための差分ではなく、PR を成立させるための最小差分として位置づける。

未 commit の変更があるときに停止しないのは、起点の目的が一度の起動で達成されないためである。停止すると利用者が commit してから呼び直すことになり、「出来上がったものを見たい」に対して 2 往復が必要になる。未 commit を放置して push する形も採らない。利用者は push の報告を受けるのに、URL には見たい中身が無い状態になる。

この skill が作る commit は、`tasklist-executor` が作る commit と性質が違う。`tasklist-executor` は合意済み tasklist に従って履歴として残す commit を意味のある単位で作る。この skill は作業途中の状態をそのまま見せるための commit を作り、後から amend や rebase で整理される前提を持つ。

## 論点2: `tasklist-executor` の push・PR 手順をこの skill へ寄せるか

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0: 寄せない。script だけを共用する

#### 提案0

**推奨:** a。二つの skill は公開の前提が逆であり、手順を共通化すると片方の gate が崩れる。

- **a. 寄せない。`tasklist-executor` は今のまま script を直接呼ぶ。この skill は作業途中の共有を扱う。共用するのは PR 作成 script だけ。**
  - `tasklist-executor` は「ユーザー動作確認が完了するまで commit・push・PR を行わない」という契約を持つ。公開は動作確認の後に来る
  - この skill は「今の状態を見せる」ことが目的であり、動作確認の前に呼ばれる。前提が逆になる
  - 論点1 で「working tree の全部を commit する」と決めたため、`tasklist-executor` が意味のある単位で commit した直後にこの skill を呼ぶと、残った未 commit を巻き込む
  - 重複するのは PR 作成だけであり、そこは script の共用で解消できる
- **b. 寄せる。`tasklist-executor` の push・PR task がこの skill を呼ぶ。**
  - 公開の手順が一箇所になる
  - `tasklist-executor` の「動作確認が完了するまで公開しない」gate を、この skill 側でも判定するか、呼び出し側で保つかを決める必要が出る
  - この skill が working tree の全部を commit するため、`tasklist-executor` が積み上げた commit 単位を壊し得る
- **c. PR 作成だけ共通の script、push はそれぞれが行う。**
  - 現状と同じ構造であり、実質は案 a と変わらない
  - 案 a との違いは script の置き場所だけになるため、独立した案として成立しない

#### 提案背景

論点1 で、この skill が commit を作ると決まった。`tasklist-executor` も commit を作るため、commit を作る skill が二つになる。両者の関係を決めないと、`tasklist-executor` の実行中にこの skill を呼んでよいかが実装者の判断に残る。

提案0 が満たす必要のある条件は次の三つである。

1. `tasklist-executor` が持つ「ユーザー動作確認が完了するまで commit・push・PR を行わない」契約が壊れないこと
2. 論点1 の「working tree の全部を commit する」が、`tasklist-executor` の commit 単位を壊さないこと
3. PR 作成の重複を解消すること

条件1 と条件2 が案 b を落とす。案 b は公開の入口を一つにするが、`tasklist-executor` の gate をどちらが持つかという新しい判断を生む。さらに、この skill が working tree を丸ごと commit する以上、`tasklist-executor` が task 単位で積み上げた commit の途中に、未整理の commit が混ざり得る。

条件3 は案 a が script の共用で満たす。両者が重複して持つのは「同じ head branch の open PR を重複作成しない」処理だけであり、これは既に script が担っている。

案 c は案 a と実質同じ構造になるため、独立した選択肢として成立しない。現状も PR 作成は script、push は呼び出し側という分担であり、案 c が変えるのは script の置き場所だけである。置き場所は別の論点で扱う。

#### 提案0へのフィードバック

**結果:** 案 a を採用。案 c は独立した選択肢として成立しないという整理も受け入れられた。

> a

### 決定

`tasklist-executor` の push・PR 手順をこの skill へ寄せない。`tasklist-executor` は今のまま PR 作成 script を直接呼ぶ。この skill は作業途中の共有を扱う。両者が共用するのは PR 作成 script だけとする。

寄せない理由は、二つの skill で公開の前提が逆になっているためである。`tasklist-executor` は「ユーザー動作確認が完了するまで commit・push・PR を行わない」契約を持ち、公開は動作確認の後に来る。この skill は今の状態を見せることが目的であり、動作確認の前に呼ばれる。

寄せた場合、`tasklist-executor` の gate をどちらが持つかという判断が新たに生じる。さらに論点1 で「working tree の全部を commit する」と決めたため、`tasklist-executor` が task 単位で積み上げた commit の途中に未整理の commit が混ざり得る。

重複するのは「同じ head branch の open PR を重複作成しない」処理だけであり、これは既に script が担っている。script の共用で解消する。

## 論点3: この skill が停止する条件と、部分的にしか進めない場合の扱い

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0: default branch だけ停止し、他は進めるところまで進めて報告する

#### 提案0

**推奨:** a。目的は「見せる」ことであり、PR が作れなくても push できていれば branch の差分は GitHub 上で読める。

この skill が遭遇し得る異常は次の四つである。

1. current branch が remote の default branch である
2. push 先の remote が存在しない
3. `gh` が認証されていない、または repository が GitHub でない
4. detached HEAD であり branch 名が無い

- **a. default branch と detached HEAD では停止する。remote 不在は停止する。`gh` の問題は push まで進めて、PR を作れなかったことを報告する。**
  - default branch は「作業中の branch の差分」という前提が成立しない。比較対象が自分自身になる。加えて論点1 で working tree の全部を commit すると決めたため、実行すると未整理の変更が既定の履歴へ入る
  - detached HEAD は push 先の branch 名を決められない
  - remote が無ければ push そのものが成立しない
  - `gh` が使えなくても push は成立する。branch が remote にあれば GitHub 上で差分を読めるため、目的は部分的に達成される
- **b. 四つのいずれでも停止する。部分成功を作らない。**
  - 結果が「成功」か「停止」の二値になり、利用者が状態を推測しなくて済む
  - `gh` が使えないだけで push まで諦めることになり、目的を達成できる場面で達成しない
- **c. default branch でも実行する。異常時の判断を利用者に委ねる。**
  - 停止条件を持たないため skill が単純になる
  - 既定の履歴へ未整理の commit が入る。取り消しには履歴の書き換えが要る

#### 提案背景

論点1 で「working tree の全部を commit する」と決めたことにより、この skill が動く場所を限定する必要が生じた。commit する範囲を判断しない設計は、対象 branch が作業用であることを前提にしている。

提案0 が満たす必要のある条件は次の三つである。

1. 論点1 の前提（対象は作業用 branch であり、commit は後から整理できる）が崩れる場所で動かないこと
2. 目的が達成できる場面で、達成できない結果を返さないこと
3. 利用者が結果から次の行動を判断できること

条件1 が default branch と detached HEAD を停止対象にする。default branch では commit の整理に履歴の書き換えが要り、「後から整理できる」という前提が成立しない。detached HEAD では push 先の branch 名が決まらない。

条件2 が案 b を落とす。`gh` の問題は PR 作成だけを妨げる。push は成立し、remote に branch があれば GitHub 上で差分を読める。目的の大部分が達成される場面で停止すると、利用者は手動で push をやり直すことになる。

条件3 は、部分的にしか進めなかった場合に何がどこまで済んだかを報告することで満たす。push は済んだが PR は作れなかった、という状態を利用者が区別できる必要がある。

#### 提案0へのフィードバック

**結果:** 案 a の停止条件のうち default branch が成立しない。作りたての repository では default branch をそのまま作業 branch として運用するため、一律に停止すると目的を達成できない。

> 難しいな。基本aなんだけど、作りたてのリポジトリだと平気でmain運用するから

提案0 は default branch を停止対象に含めた理由として二つを挙げていたが、この二つは性質が違う。切り分けてから決め直す。

### イテレーション1: default branch では確認を取って進める

#### 提案1

**推奨:** a。判別を仕組みで自動化せず、確認を一つ挟むことで両方の運用を扱う。

##### 停止理由の切り分け

提案0 は default branch を停止対象にする理由として次の二つを挙げていた。

1. 「作業中の branch の差分」の比較対象が自分自身になり、PR を作れない
2. working tree の全部を commit すると、未整理の変更が既定の履歴へ入る

理由1 は停止の根拠にならない。PR を作れないことは `gh` が使えない場合と同じであり、push は成立して GitHub 上で差分は読める。部分成功として扱えばよい。

理由2 だけが残る。ただしこれは repository の運用形態によって意味が反転する。default branch を保護対象として PR 経由で更新する運用では事故になる。default branch をそのまま作業 branch として使う運用では通常の操作である。

##### 運用形態の判別を skill に持たせない

判別に使えそうな signal は次のとおりで、いずれも確実ではない。

- merged PR の有無: PR 運用でも最初の PR を作る前は該当しない
- branch protection の設定: 設定していない PR 運用の repository が多い
- default branch 以外の branch の有無: 作業 branch を消した直後は該当しない
- 利用先 context の `Branch / issue 契約` の宣言: 宣言していないだけの PR 運用がある

これらを組み合わせても推定にしかならない。論点1 で「commit する範囲の判断を skill が抱えない」と決めたのと同じ理由で、誤判定の余地がある推定を skill の分岐条件にしない。

##### 提案する扱い

- **a. default branch では、commit する前に利用者へ確認を取る。確認が取れれば実行し、PR は作れないため push までを部分成功として報告する。確認が取れなければ停止する。**
  - 運用形態を推定せず、その repository を知っている利用者が判断する
  - 保護対象の default branch では、確認の時点で気づいて止められる
  - default branch を作業 branch として使う運用では、確認に答えれば実行できる
  - 確認のたびに 1 往復増える
- **b. 利用先 repository の context に「default branch を作業 branch として運用する」宣言を持たせ、宣言があれば確認を省く。宣言が無ければ確認を取る。**
  - 同じ repository で繰り返し確認されることがなくなる
  - `tumeda-dev-plugin-context.md` へ項目を増やすことになり、`maintenance-plugin-context` の変更を伴う
  - 宣言を書くまでは案 a と同じ挙動になる
- **c. default branch でも確認せず実行する。PR は作れないため push までを報告する。**
  - 往復が増えない
  - 保護対象の default branch へ未整理の commit が入る。取り消しに履歴の書き換えが要る

detached HEAD と remote 不在は提案0 のまま停止対象とする。前者は push 先の branch 名が決まらず、後者は push そのものが成立しないため、確認を取っても実行できない。

#### 提案背景

提案0 は default branch を一律の停止対象にしていた。指摘により、作りたての repository では default branch をそのまま作業 branch として運用する場面があり、その運用ではこの skill が目的を果たせなくなることが判明した。

提案1 が満たす必要のある条件は次の四つである。

1. default branch を作業 branch として運用する repository でも、目的が達成できること
2. default branch を保護対象とする repository で、未整理の commit が既定の履歴へ入らないこと
3. 運用形態の判別を、誤判定の余地がある推定に依存させないこと
4. 実行できない異常と、確認を経れば実行できる状況を区別すること

条件1 と条件2 は両立しない要求に見えるが、判断する主体を利用者へ移すことで両立する。案 a はそのための確認を一つ挟む。

条件3 が案 b の位置づけを決める。案 b は推定ではなく宣言に基づくため誤判定は起きない。ただし宣言を書くまでは案 a と同じ挙動であり、案 a の上に後から足せる。今それを作る必要が生じていないため、案 a を先に採り、繰り返しの確認が実際に負担になった時点で案 b へ育てる形を推す。

条件4 は detached HEAD と remote 不在を停止対象に残すことで満たす。この二つは確認を取っても実行できない。default branch は確認を経れば実行できるため、性質が違う。

#### 提案1へのフィードバック

**結果:** 案 a を採用。

> a

### 決定

停止する条件は detached HEAD と remote 不在の二つとする。どちらも確認を取っても実行できない。detached HEAD では push 先の branch 名が決まらず、remote が無ければ push そのものが成立しない。

current branch が remote の default branch である場合は停止しない。commit する前に利用者へ確認を取り、確認が取れれば実行する。確認が取れなければ停止する。default branch では PR を作れないため、push までを部分成功として報告する。

`gh` が認証されていない、または repository が GitHub でない場合も停止しない。push まで進め、PR を作れなかったことを報告する。remote に branch があれば GitHub 上で差分は読める。

運用形態の判別を skill に持たせない。merged PR の有無、branch protection の設定、default branch 以外の branch の有無、利用先 context の宣言は、いずれも推定にしかならない。default branch を保護対象として PR 経由で更新する運用と、default branch をそのまま作業 branch として使う運用の区別は、その repository を知っている利用者が確認の場で判断する。

利用先 context へ「default branch を作業 branch として運用する」宣言を持たせて確認を省く形は、この決定の上に後から足せる。繰り返しの確認が実際に負担になった時点で検討する。

部分的にしか進めなかった場合は、何がどこまで済んだかを報告する。push は済んだが PR は作れなかった、という状態を利用者が区別できるようにする。

## 論点4: push が reject されたときどうするか

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0: 作業 branch でだけ `--force-with-lease` で再試行する

#### 提案0

**推奨:** a。論点1 で amend と rebase を前提に置いたため、reject は日常的に起きる。

local branch が remote と分岐していると通常の push は reject される。amend や rebase の後に起きる。

- **a. 通常の push を試し、reject されたら `--force-with-lease` で再試行する。default branch では force push せず、停止して報告する。**
  - 論点1 は「この skill が作る commit は後から amend や rebase で整理される前提」と決めている。分岐は想定内であり、そのたびに止まると目的を果たせない
  - `--force-with-lease` は remote が想定と違う場合に失敗するため、他者の push を消さない
  - default branch は論点3 で確認を経て実行する場所と決めたが、そこで履歴を上書きすると影響が確認の範囲を超える
- **b. reject されたら常に停止して報告する。**
  - 履歴を上書きしない
  - rebase のたびに止まる。論点1 の前提と噛み合わない
- **c. 常に `--force-with-lease` で push する。**
  - 分岐の有無を判定しなくて済む
  - force が不要な場面でも force を使う。通常の push で足りる場合に、上書きの意味を持つ操作を既定にする理由が無い

#### 提案背景

論点1 で「この skill が作る commit は後から amend や rebase で整理される前提」と決めた。整理した後にもう一度この skill を呼ぶと、local と remote が分岐していて push が reject される。

提案0 が満たす必要のある条件は次の三つである。

1. 論点1 が前提に置いた amend と rebase の後でも、目的が達成できること
2. 他者の push を消さないこと
3. 上書きの影響が、論点3 で決めた確認の範囲を超えないこと

条件1 が案 b を落とす。整理するたびに停止すると、利用者が手動で force push することになる。

条件2 は `--force-with-lease` で満たす。remote の先端が想定と違えば失敗するため、取得していない他者の commit を消さない。

条件3 が default branch を除外する理由である。論点3 で default branch は確認を経て実行すると決めたが、そこで確認しているのは「未整理の commit を既定の履歴へ入れてよいか」であり、「既定の履歴を上書きしてよいか」ではない。後者は影響が大きく、同じ確認では覆えない。

案 c は条件を満たすが、通常の push で足りる場面まで force を既定にする。上書きの意味を持つ操作は、必要になった場面でだけ使う。

#### 提案0へのフィードバック

**結果:** 案 a を採らない。reject が実際に起きる条件を確認した結果、案 a の前提が成立しないことが分かった。

> bかなって思うけどどんな時にrejectされる？

問いに答える過程で、提案0 の推奨根拠が誤っていたことが判明した。詳細は提案1 の本文へ示す。

### イテレーション1: reject では停止し、原因を報告する

#### 提案1

**推奨:** この案を採る。reject の主因が他者起因であり、自動 force が他の作業を消し得るため。

##### reject が起きる条件

push が reject されるのは local HEAD が remote HEAD の子孫でないときであり、原因は次の五つである。

1. local branch を rebase した
2. commit を amend または squash した
3. `reset --hard` で巻き戻した
4. 別 machine または別 session が同じ branch へ push した
5. remote 側で force push された（GitHub 上の編集、suggestion の適用など）

##### この skill の使い方では 1 から 3 が起きにくい

論点1 で決めた形は「working tree の全部を 1 commit にして push する」である。この skill を繰り返し呼ぶと commit が積み上がるだけで、local HEAD は常に remote HEAD の子孫になる。fast-forward であり reject されない。

1 から 3 が起きるのは利用者が履歴を整理したときだが、整理は通常 PR を出す直前に行う。その時点で動くのは論点2 で分離した `tasklist-executor` 側の手順であり、この skill の出番ではない。

提案0 は「論点1 が amend と rebase を前提に置いたため reject は日常的に起きる」を推奨根拠にしていた。この前提が成立しない。

##### 残る 4 と 5 で自動 force は危険である

残るのは自分以外が remote を進めたケースである。ここで force push すると他の作業を消す。

`--force-with-lease` はこれを防ぐ仕組みだが、保護は「自分が最後に fetch した remote 先端」との比較で成り立つ。skill の手順に `git fetch` を挟むと lease が最新へ更新され、保護が効かなくなる。安全性が「fetch しないこと」という暗黙の前提に依存するため、手順として脆い。

##### 提案する扱い

push が reject されたら停止し、remote と分岐していることを原因として報告する。force push を skill が行わない。force するかどうかは、分岐の原因を確認できる利用者が判断する。

論点3 で default branch に採った「確認を取れば実行する」形は、この論点では採らない。論点3 の確認は「未整理の commit を既定の履歴へ入れてよいか」を問うものであり、対象は自分の変更である。reject の場合に問うことになるのは「他者が進めた可能性のある remote を上書きしてよいか」であり、確認の場で利用者が判断材料を持たない。分岐の中身を見てからでなければ答えられない。

#### 提案背景

提案0 は `--force-with-lease` での自動再試行を推奨していた。根拠は論点1 が amend と rebase を前提に置いたことだった。

reject が起きる条件を列挙して使用パターンへ当てた結果、この skill を通常どおり使う限り 1 から 3 は起きにくく、実際に遭遇するのは他者起因の 4 と 5 が主だと分かった。推奨の前提が崩れたため、提案1 で結論を差し替える。

提案1 が満たす必要のある条件は次の三つである。

1. 他者が進めた remote を skill が上書きしないこと
2. 安全性が暗黙の前提へ依存しないこと
3. 停止したときに、利用者が次の行動を決められること

条件1 は force push を行わないことで満たす。条件2 は `--force-with-lease` を採らないことで満たす。この仕組みは fetch の有無で保護の強さが変わるため、skill の手順に組み込むと保護されているかどうかが手順の書き方に依存する。

条件3 は報告の内容で満たす。「push できなかった」だけでは次の行動が決まらない。remote と分岐していることを原因として示す。

#### 提案1へのフィードバック

**結果:** 提案1 を採用。停止時に原因を報告し、force するかは利用者が判断する形で合意した。論点3 型の「確認を取れば force する」は含めない。

> ok

### 決定

push が reject されたら停止し、remote と分岐していることを原因として報告する。この skill は force push を行わない。force するかどうかは、分岐の原因を確認できる利用者が判断する。

`--force-with-lease` による自動再試行を採らない。この保護は「自分が最後に fetch した remote 先端」との比較で成り立つため、手順に `git fetch` を挟むと効かなくなる。安全性が手順の書き方に依存する形を避ける。

この skill の通常の使い方では reject は起きにくい。working tree の全部を 1 commit にして積み上げる形は fast-forward であり、local HEAD は常に remote HEAD の子孫になる。実際に遭遇する reject は、別 machine や別 session からの push、remote 側の force push といった他者起因が主になる。そこで自動的に force すると他の作業を消す。

論点3 で default branch に採った「確認を取れば実行する」形をここでは採らない。論点3 の確認は自分の変更を既定の履歴へ入れてよいかを問うものであり、利用者は判断材料を持っている。reject の場合に問うことになるのは他者が進めた可能性のある remote を上書きしてよいかであり、分岐の中身を見なければ答えられない。

## 論点5: 共用する PR 作成 script をどこへ置くか

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0: plugin root 直下の `scripts/` へ置く

#### 提案0

**推奨:** b。skill の名前空間と衝突せず、`docs/` が skill 横断の共通ドキュメントを持つのと対称になる。

論点2 で、この skill と `tasklist-executor` が PR 作成 script を共用すると決めた。現在の配置は `plugins/tumeda-dev/skills/tasklist-executor/scripts/github/create_or_get_pr.sh` であり、片方の skill の配下にある。

- **a. `plugins/tumeda-dev/skills/scripts/github/create_or_get_pr.sh`**
  - `skills/` 直下には既に「共有リファレンス（skill ではない）」として三つの Markdown が置かれている。skill 本文から参照される共通のものを直下に置く前例がある
  - ただし前例はいずれも Markdown であり、`skills/README.md` は「skill 本文から参照される host 非依存の共通ドキュメント」と定義している。script はドキュメントではない
  - `skills/scripts/` という directory が、skill 名 `scripts` と見分けがつかない。`SKILL.md` を持たないため loader は拾わないが、人が skill 一覧を見たときに紛れる
- **b. `plugins/tumeda-dev/scripts/github/create_or_get_pr.sh`**
  - plugin root 直下に `scripts/` を作る。`.claude-plugin/`、`.codex-plugin/`、`docs/`、`skills/` と並ぶ
  - skill の名前空間の外にあるため、skill 名と紛れない
  - `docs/` が skill 横断の共通ドキュメントを持つのに対し、`scripts/` が skill 横断の共通 script を持つという対称になる
  - marketplace の source は `./plugins/tumeda-dev` であり、その配下は配布に含まれる
- **c. 新しい skill の配下へ置き、`tasklist-executor` が参照する。**
  - 移動は伴うが、構造は今と対称なだけで共用の問題を解消しない
  - 現在は `tasklist-executor` が owner で新 skill が借りる形になり、案 c ではその向きが逆になるだけである

#### 提案背景

論点2 で「共用するのは PR 作成 script だけ」と決めたため、片方の skill の配下にある現状を変える必要が生じた。

提案0 が満たす必要のある条件は次の三つである。

1. 二つの skill のどちらからも、対等に参照できる場所にあること
2. skill の名前空間と紛れないこと
3. 配布物に含まれること

条件1 が案 c を落とす。owner が入れ替わるだけで、片方の skill の配下という構造は変わらない。

条件2 が案 a と案 b を分ける。`skills/` 直下の共有リファレンスは Markdown であり、file として置かれているため skill directory と混ざらない。script を置く場合は `scripts/` という directory を作ることになり、skill directory の並びに skill でないものが入る。

条件3 は案 a と案 b のどちらも満たす。marketplace の source が `./plugins/tumeda-dev` であるため、その配下は配布される。

#### 提案0へのフィードバック

**結果:** 案 a を採用。

> a

### 決定

PR 作成 script を `plugins/tumeda-dev/skills/scripts/github/create_or_get_pr.sh` へ移す。`skills/` 直下には、skill 本文から参照される共通のものを置く前例が既にある。

移動に伴い、参照元三箇所を同じ変更で更新する。`tasklist-executor/SKILL.md`、`task-design/templates/tasklist.md`、`task-design/tasklist-design.md` が現在の path を持っている。

動作上の破綻は起きない。`scripts/verification/validate-plugin.mjs` は skill directory を列挙せず、特定 file の存在と manifest の値だけを検査する。skill の loader は `skills/*/SKILL.md` を探すため、`SKILL.md` を持たない `skills/scripts/` は skill として拾われない。

案 b（plugin root 直下の `scripts/`）は skill の名前空間の外にあり、`docs/` と対称になる利点があった。それでも採らないのは、`skills/` 直下に共通のものを置く前例が既にあり、参照する側からの距離が近いためである。

## 論点6: この skill を何という名前にするか

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0: `share-work-in-progress` を採る

#### 提案0

**推奨:** c。論点2 で `tasklist-executor` と役割を分けた境界が、名前そのものに出る。

同階層の skill 名は kebab case で、`name-work-directory`、`facilitate-discussion`、`escalate-plugin-skill-fix` のような動詞句と、`task-design`、`tasklist-executor`、`doc-enricher` のような名詞句が混在している。

- **a. `publish-branch`**
  - what が単独で伝わる。「branch を公開する」
  - `push` や `pr` のような手続きを名前に持ち込まない
  - 完成後の公開とも読める。論点2 で `tasklist-executor` と分けた「作業途中かどうか」の境界が名前から読めない
- **b. `publish-branch-diff`**
  - 依頼文の「差分を見えるようにプッシュする」に最も近い
  - 「差分」が入ることで、見るためのものであることが伝わる
  - 誰との差分かが名前から決まらない。default branch との差分を指すが、そう読めるとは限らない
- **c. `share-work-in-progress`**
  - 起動場面が名前に出る。作業途中の状態を共有する skill であることが読める
  - 論点2 で `tasklist-executor`（動作確認の完了後に公開する）と分けた境界が、名前の時点で伝わる
  - 対象が branch であることが名前に無い。共有する単位を名前から特定できない
  - 三語で、同階層の二語中心より長い

#### 提案背景

論点1 から論点5 で、この skill の役割が確定した。working tree の全部を commit し、push し、PR が無ければ作る。default branch では確認を取り、reject では停止する。`tasklist-executor` とは公開の前提が逆であり、こちらは動作確認の前に呼ばれる。

提案0 が満たす必要のある条件は次の四つである。

1. 同階層と表記の足並みが揃うこと（`naming/file.md`）
2. 手続きではなく what を表すこと（`naming/core.md`）
3. 名前だけ見て中身を正しく受け取れること（`naming/core.md`）
4. 論点2 で分けた `tasklist-executor` との境界が読めること

条件1 は三案とも満たす。いずれも kebab case である。

条件2 により `push-and-open-pr` のような手続きを並べる名前を候補に入れていない。push と PR は手段であり、変わり得る。

条件3 と条件4 が案を分ける。案 a と案 b は対象が branch であることを名前に持つが、いつ使うものかが読めない。案 c は逆に、いつ使うものかは読めるが対象が読めない。

案 c を推すのは、この skill が誤って使われるとしたら「完成後の公開に使う」形であり、それは `tasklist-executor` の領分だからである。対象を取り違える誤りより、使う場面を取り違える誤りのほうが起きやすく、影響も大きい。

#### 提案0へのフィードバック

**結果:** 案 c を採用。

> c

### 決定

skill 名を `share-work-in-progress` とする。配置は `plugins/tumeda-dev/skills/share-work-in-progress/SKILL.md`。

起動場面が名前に出ることを優先した。論点2 で `tasklist-executor` と役割を分けており、`tasklist-executor` は動作確認の完了後に公開し、この skill は動作確認の前に呼ばれる。この境界が名前の時点で伝わる。

`publish-branch` と `publish-branch-diff` は対象が branch であることを名前に持つが、いつ使うものかが読めない。この skill が誤って使われるとしたら「完成後の公開に使う」形であり、それは `tasklist-executor` の領分である。対象を取り違える誤りより、使う場面を取り違える誤りのほうが起きやすく、影響も大きい。

`push` と `pr` を名前に持ち込まない。どちらも手段であり、`naming/core.md` の「手続き的な how でなく、宣言的な what / why を表す」に従う。

## 論点7: `tasklist.md` の template の冒頭をどうするか

**ステータス:** 決定

**種別:** TBDヒアリング、認識齟齬

<!-- この論点は chat 上で提案と合意が先に成立した。facilitate-discussion の事後記録手順で、変遷を再構成して保存している。 -->

### イテレーション0: 削除する

#### 提案0

生成される `tasklist.md` の冒頭に、`# タスクリスト`、`## 設計参照`、`## 🚨 タスク完全完了の原則` が並び、最初の phase まで約五十行ある。

調査したところ、冒頭の記述はすべて他所に正本があった。

| template の記述 | 正本 |
| --- | --- |
| `## 設計参照` と `./design.md` | `tasklist-executor/SKILL.md`「受け取ったtasklist pathを絶対pathへ解決し、その同directoryの`./design.md`を設計の正本として必ず読む」 |
| すべての task を `[x]` にする、未完了で `completed` を返さない | `tasklist-executor/SKILL.md` の最重要原則と禁止事項 |
| 時間・難しさ・host を取消理由にしない | `tasklist-executor/SKILL.md` の最重要原則 |
| 取消完了が許可される唯一の case | `tasklist-executor/SKILL.md` の最重要原則 |
| task が大きすぎる場合の subtask 分割 | `tasklist-executor/SKILL.md` の最重要原則 |
| 実測完了直後に `[x]`、まとめて更新しない | `tasklist-executor/SKILL.md` の最重要原則と `task-design/tasklist-design.md` |
| 実装可能な task だけを計画する | `task-design/tasklist-design.md` |

冒頭を削除し、file を `## Phase 1` から始める案を示した。

#### 提案背景

依頼は「今回のtasklistを叩き台に、`## Phase1` から始まるようにskillを修正してくれるかな？毎回スクロールが鬱陶しい」である。

提案0 は、scroll の負担を解く方法として削除だけを示し、その後は scope（今の steering に含めるか別 steering か）を問うた。

#### 提案0へのフィードバック

**結果:** 選択肢の立て方が誤っている。判断すべき軸は削除と移動であり、提案0 はその軸を示さずに片方だけを提示していた。

> え、選択肢は、削除、移動じゃないの？

提案0 は「二重正本だから削除」という結論へ直行し、移動を選択肢として立てなかった。そのうえで scope という別の問いへ移り、本来の判断を飛ばしていた。

### イテレーション1: 削除したうえで、末尾に正本への参照だけを残す

#### 提案1

**推奨:** c。

- **a. 削除する。** 冒頭を全部消す。正本は `tasklist-executor/SKILL.md`（実行契約）と `tasklist-design.md`（作成規約）に一本化される。規則が一箇所なので、更新時に片方だけ直る事故が起きない
- **b. 末尾へ移動する。** 内容をそのまま末尾へ移す。scroll は解決し、情報は減らない。template を更新しても既に生成された tasklist は追随しないため、各 tasklist の冒頭は事実上「その作業が当時どの規則で運用されたか」の記録として働いている。plugin は version 管理されており規則は変わる。tasklist は steering directory に残り続けるため、削除するとこの記録が失われる
- **c. 削除したうえで、末尾に正本への参照だけを残す。** 本文は持たず、所在だけを示す。単独で開いた読み手が、どこを見れば規則が分かるかを辿れる。b の記録性は失う

#### 提案背景

提案0 は判断の軸を示さずに削除だけを提示していた。フィードバックにより、削除と移動を並べたうえで選ぶ必要が確定した。

提案1 が満たす必要のある条件は次の二つである。

1. 削除と移動を、それぞれの強みが読める形で並べること
2. 選ぶ軸を明示すること

条件2 の軸は「二重正本を許すか」対「tasklist 単独で規則が読めるか」である。

案 b を推さないのは、preamble の記録性が意図された設計ではなく副産物だからである。記録として機能させるなら「この tasklist は plugin version X の規則で運用された」と明示する形が要る。現状の preamble はそう書かれていない。副産物に依存するより、正本を一本化して所在だけを示すほうが壊れにくい。

#### 提案1へのフィードバック

**結果:** 案 c を採用。

> c

### イテレーション2: 規則ごとに、歴史的経緯と合理的必然性を分離して行き先を決める

#### 提案2

イテレーション1 の決定を保持したまま、規則ごとの行き先を確定する。

##### 用語

preamble とは `plugins/tumeda-dev/skills/task-design/templates/tasklist.md` の一行目から `## Phase 1` の直前までを指す。`# タスクリスト`、`## 設計参照` 節、`## 🚨 タスク完全完了の原則` 節とその配下五小節、直後の区切り線が含まれる。

##### 要素ごとの分離

| 要素 | 歴史的経緯 | 合理的必然性 |
| --- | --- | --- |
| `# タスクリスト` | Markdown は h1 から始めるという一般慣習 | なし。file 名が識別子であり、h1 が無くて壊れる運用が無い |
| `## 設計参照` と `./design.md` | executor の入力解決規則が確立する前の名残 | 弱いがある。executor には不要だが、skill を起動せず tasklist だけ開く運用での導線になる |
| 完了原則五項目 | template 作成時に executor の SKILL.md との責務分離が無かった | 本文にはなし。所在にはある |
| 実装可能な task だけを計画する | 作成規約が `tasklist-design.md` へ整理される前の名残 | なし。生成物の読者はこの規約を使わない |
| phase 末や作業末にまとめて更新しない | preamble に置かれた | ある。ただし置き場所が誤っている |

##### 「まとめて更新しない」の必然性と正しい置き場所

この規則は、executor の既存規則から導出できない。`tasklist-executor/SKILL.md` は「DoD の各条件は『試みた』ではなく『実際に通過した』ことを確認してから `[x]` にする」を持つが、全 task を実測してから最後に一括で `[x]` を付ける形はこれを満たしつつまとめて更新している。独立した規則である。

必要な理由は停止・再開にある。executor は `phase_checkpoint` や `blocked` で停止する契約を持つ。まとめて更新すると、停止時点の checkbox が実態とずれ、再開時に何を再実行すべきかが決まらない。よってこの規則は executor の停止・再開契約と不可分であり、正本は `tasklist-executor/SKILL.md` にある。現状はそこが欠けていて、preamble が肩代わりしていた。

`tasklist-design.md` にある「phase末や作業末にまとめて更新させない」は、task-design が tasklist を作るときの作成規約であり、executor 自身への契約ではない。

##### 規則ごとの行き先

| 規則 | 行き先 |
| --- | --- |
| 全部 `[x]` にする、未完了で `completed` を返さない | `tasklist-executor/SKILL.md`（既存）。生成物から消す |
| 時間不足・難しさ・host を取消理由にしない | `tasklist-executor/SKILL.md`（既存）。生成物から消す |
| 取消完了が許可される唯一の case | `tasklist-executor/SKILL.md`（既存）。生成物から消す |
| 大きすぎる task の subtask 分割 | `tasklist-executor/SKILL.md`（既存）。生成物から消す |
| phase 末や作業末にまとめて更新しない | `tasklist-executor/SKILL.md` の停止・再開節へ新規追記 |
| 実装可能な task だけを計画する | `task-design/tasklist-design.md`（既存）。生成物から消す |
| 設計の正本 `./design.md` | `tasklist-executor/SKILL.md`（既存）。生成物には所在の指示だけ残す |

##### validator の扱い

`scripts/verification/validate-plugin.mjs` は template に対し、`## 設計参照`、`phase末や作業末にまとめて更新しない`、`時間不足`、`合意済みplanの変更によって元taskが不要または別実装へ置換` を `requireText` で検査している。四つとも preamble の中にある。

検査が守っていた意図は「この規則が plugin のどこかに存在し続けること」であり、template を対象にしたのは当時そこにあったからである。検査対象を、規則ごとの正本 file へ移す。あわせて、前回の移動で残された `requireAbsent(skillPath("steering/scripts/github/create_or_get_pr.sh"))` と対称に、今回の移動元に対する `requireAbsent` を足す。

#### 提案背景

イテレーション1 の決定の後、`grep` の範囲を広げたところ、validator が template の preamble を四箇所で固定していることが判明した。イテレーション1 の時点で「削除で失われる検査は `## 設計参照` だけ」と述べたのは誤りであり、428 行から 440 行しか確認していなかった。

さらに、その追随を検討する過程で、行き先を「調べたら該当文言があった file」で決めようとしていた。これは現状の配置を出発点にした判断であり、あるべき配置を問うていない。

提案2 が満たす必要のある条件は次の四つである。

1. preamble の各要素について、歴史的経緯と合理的必然性を分離すること
2. 必然性の判定を、原理ではなく運用で行うこと
3. 「消す」「残す」の二択ではなく、「移す」を選択肢に含めること
4. validator の検査を、文字列の一致ではなく守るべき意図から決めること

条件2 は、イテレーション1 の時点で欠けていた。「executor は SKILL.md を読むから生成物に規則は要らない」で止めており、artifact が skill 非起動で読まれる運用を見ていなかった。この運用を入れると、末尾の参照節は「複製ではないから腐らない」という消極的な理由ではなく、「正本を読まない経路へ到達性を与える」という積極的な理由を持つ。

条件3 が「まとめて更新しない」の扱いを決める。この規則は消すのでも残すのでもなく、正本へ移す。二択で考えていたために、イテレーション1 では「二重正本なので消せる」と誤って分類していた。

#### 提案2へのフィードバック

**結果:** 提案2 を採用。あわせて、この判断方法自体を思考標準へ追加することが合意された。標準への追加は論点8 で扱う。

> ok

### 決定

`plugins/tumeda-dev/skills/task-design/templates/tasklist.md` の preamble、すなわち一行目から `## Phase 1` の直前までを削除し、file を `## Phase 1` から始める。

末尾へ `## 参照` を新設し、規則の本文ではなく所在だけを示す。

- 設計の正本: 同じ directory の `./design.md`
- 完了条件、取消完了、subtask 分割、checkbox 更新 timing の規則: `tasklist-executor/SKILL.md`
- tasklist へ載せる task の範囲: `task-design/tasklist-design.md`

所在の指示を残すのは、artifact が skill を起動せずに読まれる運用が実在するためである。本文の複製は正本の更新に追随せず、古い複製と新しい正本が併存して読み手がどちらに従うか決まらなくなる。所在の指示は指し先が変わらない限り腐らず、正本を読まない経路へ到達性だけを与える。

`tasklist-executor/SKILL.md` の停止・再開節へ「phase 末や作業末にまとめて更新しない」を追記する。この規則は executor の停止・再開契約と不可分であり、preamble が肩代わりしていた欠落を埋める。

`scripts/verification/validate-plugin.mjs` の四つの検査を、規則ごとの正本 file へ移す。`## 設計参照` は末尾の `## 参照` へ、残る三つは `tasklist-executor/SKILL.md` へ対象を移す。検査文字列は移し先の実文言へ合わせる。あわせて移動元 path に対する `requireAbsent` を足す。

既に生成済みの tasklist は追随させない。`roadmap.md` の template は対象にしない。

## 論点8: この判断方法を思考標準のどこへ置くか

**ステータス:** 決定

**種別:** レビュー指摘

### イテレーション0: 場面 file を一つ新設する

#### 提案0

論点7 のイテレーション2 で用いた判断方法を、思考標準へ場面として追加する。

`docs/think_standards/evolution_policy.md` は、この標準群を「場面駆動 + 主軸/補助」モデルと定め、各場面の主軸を一つに絞ることを求めている。この形に合わせる。

- 場面名: 既存のものを消す・残すを判断する
- file: `docs/think_standards/questioning_existing.md`
- 主軸: 理由を歴史的経緯と合理的必然性へ分離し、必然性だけを残す
- 補助1: 必然性は運用の中でしか測れない
- 補助2: 複製と所在の指示を区別する
- 失敗例: 正本が別にあることだけを根拠に複製を消し、複製が唯一の伝達経路だった規則まで巻き込む

`README.md` の収録一覧へ一行を追加し、`scripts/verification/validate-plugin.mjs` の `thinkStandardsFiles` へ一行を追加する。後者は可搬性検査の対象へ含めるためであり、repository 名や絶対 path の混入を機械的に弾く。

#### 提案背景

当初は `rebuilding_from_zero.md` を候補にしていたが、これは手法の名前であって場面の名前ではない。同階層の file は `starting_to_think.md`、`receiving_feedback.md`、`updating_types.md` のように場面を名指している。`evolution_policy.md` も「場面駆動を崩さない」を守るべき軸に挙げている。

主軸を一つに絞る要求から、「歴史と必然の分離」を主軸、「運用で測る」を補助とした。後者は前者の適用条件であり、場面へ入った時に思い出すべき一個としては前者が適切である。

`updating_types.md`（型・スキル・テンプレートを直したい）と場面が近いが、主軸が違う。あちらは「直す前に今のファイルで正しい形を合意する」であり、こちらは「消す・残す・移すをどう判断するか」である。対象も型に限らず、code、規則、構造へ及ぶ。

#### 提案0へのフィードバック

**結果:** 採用。

> ok

### 決定

`plugins/tumeda-dev/docs/think_standards/questioning_existing.md` を新設する。場面名は「既存のものを消す・残すを判断する」、主軸は「理由を歴史的経緯と合理的必然性へ分離し、必然性だけを残す」とする。

補助として「必然性は運用の中でしか測れない」と「複製と所在の指示を区別する」を置き、末尾に失敗例を書く。失敗例は論点7 で実際に起きたものを、repository 固有情報を除いた形で記す。

`docs/think_standards/README.md` の収録一覧へ一行、`scripts/verification/validate-plugin.mjs` の `thinkStandardsFiles` へ一行を追加する。後者により、この file も可搬性検査の対象になる。

`rebuilding_from_zero.md` は採らない。手法の名前であり、この標準群が採る場面駆動の命名から外れる。

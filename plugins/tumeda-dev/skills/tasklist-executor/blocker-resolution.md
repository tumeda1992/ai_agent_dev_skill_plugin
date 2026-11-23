# Blocker resolution

`tasklist-executor`を起動する側（利用者の会話のagent、`advance-roadmap`）が、手順を離れて自ら手を動かしてよい唯一の例外である。[`caller-contract.md`](caller-contract.md)から、`tasklist-executor`が`blocked`で返った時と、起動する側が自分の手順で進めなくなった時に読む。

起動する側が自ら手を動かしてよいのは、Flowが前提とする実行条件が崩れ、Flowの内側では復旧できなくなった`blocker`を解消するときだけである。ここでいうFlowは、起動する側の手順（`tasklist-executor`の起動、止まって返ってきた時の扱い、完了の確認）と、`advance-roadmap`の「phaseを進める手順」である。この行為を`resolve-blocker`と呼ぶ。

`blocker resolution`はFlowに対して並行して存在する経路であり、Flowの一部ではない。任意のstepから離脱し、同じstepへ戻る。

```text
起動 → 止まった時の扱い → 完了の確認   （advance-roadmapでは phaseの選択 → … → 伝播）
  │            │                │
  └────────────┴────────────────┘
                      実行条件が崩れる
                            │
                            ▼
              ┌──────────────────────────┐
              │ blocker resolution        │
              │ （Flowの外側）            │
              │  確認 → 復旧行為 → 回復確認 │
              └──────────────────────────┘
                            │
                     実行条件が回復
                            │
                            ▼
                 離脱したstepの先頭へ戻る
```

stepとして番号を与えない。実行条件の崩壊は`tasklist-executor`が`blocked`で返った時に限らず、`advance-roadmap`のphaseの間でも起こり得るため、特定stepの後続として置けない。また`advance-roadmap`の手順は「順序固定」であり、条件分岐のstepを挿すとその性質が崩れる。

## 例外が成立する2条件

例外が成立する条件は次の2つがともに満たされることであり、片方だけでは成立しない。

- 設計を尽くした後である。designが合意され、tasklistが合意され、実行に入っている
- Flowの内側では復旧できない。次のstepへ進めず、現在のstepも完了できず、skillが定めた手順のどれを実行しても状態が変わらない

条件1 が欠けて条件2 だけが成立するなら設計不足であり、designへ戻る。条件2 が欠けて条件1 だけが成立するなら通常のtask失敗であり、[`execution-contracts.md`](execution-contracts.md)の「停止・再開と二重起動防止」で扱う。この2条件が、例外を「詰まったから手を動かす」へ拡張させない歯止めである。

## 設計で潰せた不確実性を持ち込まない

`resolve-blocker`が許容するのは実行条件の回復だけである。次の3つは`blocker`の解消に見えても許容しない。

- 実装中に、designで決めていないことを決める
- design中に決められたはずのことを、実装中に判断する
- spikeで潰せたはずの不確実性を、えいやで試しながら進める

いずれも「設計を尽くした」という前提を満たしていない。これらを`resolve-blocker`として実行すると、設計と実行の分離そのものが崩れる。判断時は「この不確実性は、designまたはspikeで潰せたか」と問う。潰せたならそれは`blocker`ではなく設計不足である。

## blockerを解消してもFlowの成果にはしない

`resolve-blocker`は実行条件を回復させるためだけの行為であり、tasklistのtaskを進めることを目的にしない。`blocker resolution`中に副次的にtaskが進んでいても、tasklistのcheckboxはstep内の通常手順で確定させる。

この区別を失うと、`resolve-blocker`が実装の抜け道になる。「blockerを解消するついでに実装した」を成果として数えないことが、例外を例外のまま保つ条件である。

## 検知時の確認

`blocker`を検知した時点で、ユーザーの指示の有無に関わらず次の3択を1回で問う。

```text
Flowが進められない状態を検知した。（何が起きているかを1〜2文で示す）

a. Flowから離れず、ここで停止して指示を待つ
b. blockerの解消のためにFlowから離れる。方針は都度確認する
c. blockerの解消のためにFlowから離れる。解消できる限り自走する
```

2軸（離れるか / 離れた後どう進めるか）を`yes/no`の入れ子で2段に分けない。入れ子では1回目の回答時点で何を承諾したことになるのかが確定しないため、`no` / `yes-no` / `yes-yes`の3通りへ展開して1往復で取る。

`a`を先頭へ置くのは、離れることを既定にしないためである。選択肢として提示されなければ、agentは「離れてよいか」という問い自体を離れる前提の確認として出しやすい。

task-designの[`wrap-up.md`](../task-design/wrap-up.md)の「実行を始めてよいかを確かめる」は「進むか否か」の2値を扱う形式であり、この2軸の判断には流用しない。

## 自走の範囲と報告

`c`を選ばれた場合も、次は自走の範囲に含めない。該当したら`b`と同じく都度確認へ戻る。

- 破壊的操作。削除、強制上書き、履歴の書き換え、稼働中の外部resourceの再作成
- repository外への影響。push、PR作成、外部serviceへの送信
- `blocker`の解消に必要な範囲を超える変更

選定基準は「取り返しがつかないか、影響がrepositoryの外へ出るか、`blocker`と無関係か」である。3つめは`resolve-blocker`が実行条件の回復だけを目的とすることに対応し、ここが緩むと`blocker`の解消を名目にした任意の実装が正当化される。

報告は離脱したstepへ戻る時点で1回行い、何が`blocker`だったか、解消のために行ったこと、解消できたか、判明した事実のうちdesign・tasklist・repository知識へ影響するものを含める。自走中に逐一報告しない。報告のたびに応答を待つなら`c`が`b`と同じになる。

## 離脱したstepへの復帰

実行条件が回復したら、離脱したstepの先頭へ戻る。戻り先はこれ1つであり、「次のstepへ進む」を選べない。離脱したstepの入口条件が満たされたかは、復帰時に改めて確認する必要があるためである。次へ進めると、崩れた条件のまま先へ行く経路ができる。

復帰時に行うことは次の2つだけである。

- 離脱したstepをその入口条件から改めて実行する
- 上記「自走の範囲と報告」で定めた報告を1回行う

`blocker resolution`中に副次的にtaskが進んでいても、tasklistのcheckboxはstep内の通常手順で確定させる。復帰した時点でcheckboxを更新しない。

## blocker resolution中の記録先

判明した事実は`.design-records/YYYY/YYYYMM/YYYYMMDD-slug/subagent_report/`へ記録する。

追跡対象外にする。`design.md`、`tasklist.md`、discussion fileは「どの変更がどの合意に基づくか」を後から辿るために追跡されるが、`blocker resolution`の記録は実行条件の回復に関する調査ログであり、合意の正本ではないためこの性質を持たない。

利用先repositoryは`plugins/tumeda-dev/skills/prepare-design-record/.gitignore.sample`を`.design-records/.gitignore`へ複製して使う。`.sample`のままでは効かない。

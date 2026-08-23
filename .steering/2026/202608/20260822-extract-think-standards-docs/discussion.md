# 議論記録

## 論点1: steering成果物をcommitへ載せる順序を定める

**ステータス:** 決定

**種別:** レビュー指摘

### イテレーション0: 確定時点で三段へ分け、対応する変更commitへ近接させる

#### 提案0

`plugins/tumeda-dev/skills/steering/SKILL.md` の `## 成果物のlifecycle` へ、commit順序を定める節を追加する。diff外のlifecycle定義、`### 非規範的なlegacy memo`、Flow各Step、`tasklist-design.md`のcommit記述は変更しない。

```diff
 同じfeatureの追加taskは、designとplanを再合意した後に既存tasklistへ追記する。tasklistは「このfeatureを完成させるためのchecklist」であり、納品物はtasklistではなくfeatureなので、追加要件が判明しても同じfeatureの完成まで生き続ける。
 
+### commitへ載せる順序
+
+steering成果物を「記録」として一括りにせず、確定した時点で実装変更の前後へ分ける。
+分割軸は何がいつ確定したかであり、`.steering/`配下という置き場所ではない。
+
+1. `design.md`、`requirements.md`、`task-design-discussion.md`、`discussion.md` — 変更を行う前に確定する。対応する変更commitより前へ置く。
+2. tasklistが指示した成果物変更 — 実装commit。
+3. `tasklist.md`のcheckbox確定と`implementation_review.md` — 変更が終わってから確定する。対応する変更commitより後へ置く。
+
+一つのsteeringが複数の変更commitを生む場合、各変更commitと、その根拠になった合意の記録を近接させる。間に無関係なcommitを挟まない。
+
+一つのdiscussion fileが複数の変更commitへ対応する場合、hunk単位の分割を強制しない。最も早い対応commitへまとめ、後続commitの本文でどの論点に基づくかを示す。
+
+変更が一commitで完結し、三段へ分けても読み手が辿れる情報が増えない場合は、まとめてよい。判断基準は、後から読む人が「どの変更がどの合意に基づくか」をcommit単位で辿れるかである。
+
+- やってしまいがちな行動: steering成果物を`.steering/`配下という置き場所で括り、最後の一commitへまとめる
+- それをやると何が起きるか: 合意が変更より後に記録された履歴になる。どの変更がどの合意に基づくかを、後から読む人がfile全体を突き合わせないと辿れない
+- 正しい判断のための問い: 「このsteering成果物は、対応する変更より前に確定したか、後に確定したか？」
+
 ### 非規範的なlegacy memo
```

#### 提案背景

##### 起点となった指摘

think_standards移管のcommit計画で、`.steering/`配下の二directoryを最後の一commitへまとめた。

> え、steeringまとめないでよ。2,3とそれに対応するsteeringが先でしょ。というかいつもコミット計画でsteeringが最後に回されがちだな。タスク更新済み、discussion済っていうのは全部済んだ後っていうのはそのとおりだけど。論点立てて、steeringスキルでのコミット順指示したいわ。steeringと近いコミットは、steeringとまとめる。steeringの中でも順序はある。designとtask-discussion→タスクによる変更→tasklistとimplementation-review

「いつもcommit計画でsteeringが最後に回されがち」という指摘は、今回限りではなく再発している癖として述べられている。

##### 原因の追跡

- **なぜまとめたか。** commitの分割軸を「fileがどこにあるか」にした。`.steering/`配下という置き場所で括った。
- **なぜ置き場所で括ったか。** steering成果物を「記録」という単一のカテゴリとして扱い、実装変更とは別種のものとして最後へ置いた。
- **なぜ単一カテゴリとして扱ったか。** steering成果物が確定時点の異なる三種に分かれることを捉えていなかった。`design.md`と`task-design-discussion.md`は変更前に確定し、`tasklist.md`のcheckboxと`implementation_review.md`は変更後に確定する。この違いはlifecycle節が各fileの役割として記述しているが、commitへ載せる時の順序としては規定されていない。
- **なぜ対応関係を見落としたか。** 一つのsteeringが複数の変更commitを生むことを想定していなかった。今回、`20260815-evaluate-discussion-entry-format`のdiscussionは論点22〜26を持ち、hook配線、`facilitate-discussion`修正、think-through事前変更の三つへ対応する。`20260822-extract-think-standards-docs`は移管へ対応する。対応先が分かれているのに置き場所で一括した。

##### ownerがsteeringである理由

`tasklist-design.md`は「phase単位かつ意味単位で分け、部分承認なら承認範囲だけをcommitする」を定めるが、扱うのはtasklist内のcommit taskの設計であり、steering成果物をどこへ置くかは扱っていない。

steeringは`## 成果物のlifecycle`で各fileの役割と確定時点を所有している。commit順序はそのlifecycleの帰結であり、同じ節に続けるのが自然である。両者は重複しない。

##### 「まとめる」を近接と読む理由

指摘は「steeringと近いコミットは、steeringとまとめる」と「steeringの中でも順序はある」を並べている。同一commitへ入れると、design確定と変更が同時になり、後者が述べる順序が消える。両立させるには「まとめる」を同一commit化ではなく近接と読む必要がある。提案0は「間に無関係なcommitを挟まない」としてこれを表す。

##### 例外を置く理由

変更が一commitで完結する小さなsteeringでは、三段へ分けても辿れる情報が増えない。三段化を無条件のMUSTにすると、得るもののない分割を強制する。判断基準を「後から読む人がどの変更がどの合意に基づくかをcommit単位で辿れるか」に置き、それを満たすならまとめてよいとする。

##### hunk分割を強制しない理由

一つのdiscussion fileが複数の変更commitへ対応する場合、順序を厳密に守るにはhunk単位でstageする必要がある。今回の`20260815`のdiscussion fileがこれにあたり、論点22〜26が三つの変更へ分かれる。

hunk分割は操作が壊れやすく、分割の失敗が履歴へ残る。得られるのは対応の厳密さだけで、後続commitの本文に根拠論点を書けば辿れる。強制しない。

#### 提案0へのフィードバック

**結果:** 受諾。

> ok

### 決定

`plugins/tumeda-dev/skills/steering/SKILL.md` の `## 成果物のlifecycle` へ `### commitへ載せる順序` を追加する。

steering成果物を「記録」として一括りにせず、確定した時点で実装変更の前後へ三段に分ける。`design.md`、`requirements.md`、`task-design-discussion.md`、`discussion.md`は変更前に確定するため対応する変更commitより前へ、tasklistが指示した成果物変更を実装commitとし、`tasklist.md`のcheckbox確定と`implementation_review.md`は変更後に確定するため対応する変更commitより後へ置く。分割軸は何がいつ確定したかであり、`.steering/`配下という置き場所ではない。

一つのsteeringが複数の変更commitを生む場合、各変更commitとその根拠になった合意の記録を近接させ、間に無関係なcommitを挟まない。一つのdiscussion fileが複数の変更commitへ対応する場合はhunk単位の分割を強制せず、最も早い対応commitへまとめて後続commitの本文で根拠論点を示す。

変更が一commitで完結し三段へ分けても読み手が辿れる情報が増えない場合はまとめてよい。判断基準は、後から読む人が「どの変更がどの合意に基づくか」をcommit単位で辿れるかである。

ownerはsteeringとする。`tasklist-design.md`のcommit記述はtasklist内のcommit taskの設計を扱い、steering成果物の位置を扱っていない。steeringは`## 成果物のlifecycle`で各fileの確定時点を所有しており、commit順序はその帰結である。

## 論点2: version bumpの対象へvalidatorの期待値を含める

**ステータス:** 決定

**種別:** レビュー指摘

### イテレーション0: 宣言値四箇所と検査側期待値一箇所を、五箇所として明示する

#### 提案0

`plugins/tumeda-dev/skills/maintenance-plugin-context/SKILL.md` の `## Plugin version` へ、検査側の期待値を追記する。diff外の宣言値四項目、SemVer規約、cachebuster禁止は変更しない。

```diff
 いずれかにsuffixがある、または値がずれる時は、そのままinstall / releaseしない。変更の互換性を判定して正しいrelease versionへ揃える。
 
+宣言値に加えて、`scripts/verification/validate-plugin.mjs` の `expectedRelease` を同じ値へ更新する。これは配布manifestの宣言値ではなく検査側の期待値であり、四つの宣言値が揃っていることに加えて、意図したrelease versionであることを確かめる。更新しないと`plugin validation failed`になる。version bumpは宣言値四箇所と期待値一箇所の計五箇所を一度に変える作業である。
+
+`expectedRelease`を宣言値から動的に読ませない。四つが揃ってさえいれば通る状態になり、意図しないversion変更を検知できなくなる。
```

#### 提案背景

##### 起点となった事象

think_standards移管のcommit計画で、`maintenance-plugin-context`が挙げる四箇所を7.0.0から7.1.0へ更新した。その直後に`node scripts/verification/validate-plugin.mjs`が失敗した。

```text
plugin validation failed:
- manifest: release期待値は7.0.0、実際は7.1.0
```

`scripts/verification/validate-plugin.mjs` の `const expectedRelease` が五箇所目として存在し、skillの記述に従うだけでは通らない状態だった。

##### 原因の追跡

- **なぜ列挙から漏れたか。** skillは「`tumeda-dev`の次の宣言値が同じ`MAJOR.MINOR.PATCH`であること」として、配布manifest上のversion宣言を四つ挙げている。`expectedRelease`は宣言値ではなく検査側の期待値であり、カテゴリが異なるため列挙の対象外になった。
- **なぜカテゴリの違いで漏れることが問題か。** 実務上の作業単位は「versionを上げる」であり、宣言値と期待値の区別は作業者にとって意味を持たない。カテゴリで切ると、同じ作業で同時に変えるべきものが記述から落ちる。
- **同型の問題を今回すでに扱っている。** `function_migration_policy.md` §4.1へ「移行対象の内容へ依存している側を列挙する。参照document、目次、template、hook、内容を文字列assertionする検査scriptを含む」を追記した。versionという値に依存している側が版規約の列挙から漏れていた本件は、同じ構造である。依存している側を検査scriptまで含めて数えるかどうかで分かれる。

##### 動的読み取りを採らない理由

`expectedRelease`を廃止し、宣言値から動的に読む案がある。五箇所目そのものが消えるため、記述を足すより根本的に見える。

しかしvalidatorの検査は三段になっている。四つがすべてstringであること、四つが一致すること、そして四つが`expectedRelease`と等しいこと。三段目は、四つを一斉に書き換えた場合でも意図しないversionを検知するguardである。動的に読むとこのguardが消え、どの値でも一致さえしていれば通る。

`expectedRelease`の重複は、この検知能力の対価である。廃止は`RETIRE`にあたり、guardを失う判断をユーザーと合意する必要がある。本提案では採らない。

##### 六箇所目がないことの確認

validatorは`.agents/plugins/marketplace.json`も読み、`codexPlugin`を取得する。ただし同fileにversion fieldはなく、`codexPlugin`は`source.path`の検査にだけ使われる。version宣言点は四つ、期待値は一つで、計五箇所で網羅している。

#### 提案0へのフィードバック

**結果:** 受諾。

> ok

### 決定

`maintenance-plugin-context/SKILL.md` の `## Plugin version` へ、`scripts/verification/validate-plugin.mjs` の `expectedRelease` を検査側の期待値として追記する。version bumpは宣言値四箇所と期待値一箇所の計五箇所を一度に変える作業であると明示する。

`expectedRelease`を宣言値から動的に読ませない。validatorの検査は、四つがすべてstringであること、四つが一致すること、四つが`expectedRelease`と等しいことの三段からなり、三段目は四つを一斉に書き換えた場合でも意図しないversionを検知するguardである。動的に読むとこのguardが消える。重複はこの検知能力の対価であり、廃止は`RETIRE`として別途合意を要する。

あわせて、同validatorの失敗message内の誤字「4管所」を「4箇所」へ直す。

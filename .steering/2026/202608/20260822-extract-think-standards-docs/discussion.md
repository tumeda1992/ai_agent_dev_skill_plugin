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

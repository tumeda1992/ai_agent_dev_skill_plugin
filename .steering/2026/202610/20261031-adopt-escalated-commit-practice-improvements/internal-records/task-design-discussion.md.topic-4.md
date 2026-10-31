# 内部検討記録: 論点4 — 提案1 の導線の置き場所と文

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点4

## 開始context

論点1 で、提案1 を取り込む理由を「commit の境界を決める段階から plan-commits の基準へ辿れるようにして、必要条件や手間を境界の基準と取り違えることを減らす」と決めた。論点3 で、commit は今までどおり利用者の確認の後に行い、template の commit block は「完了後のaction」に残ると決まった。この論点では、導線をどこへ、どの文で置くかを決める。

<a id="iteration-0"></a>

## イテレーション0: 導線の置き場所

<a id="iteration-0-record-1"></a>

### 調査: 境界を決める段階ごとの今の文

#### 入力

- 問い: commit の境界を決める段階はどこで、それぞれ今どう書かれているか。
- 方法: 2026-10-31 に、`task-design/SKILL.md` の見出し一覧、`tasklist-design.md` と `templates/tasklist.md` の「phase単位かつ意味単位」を含む行を読んだ（論点1 の調査の続き）。

#### 結果

| 段階 | 場所 | 今の文 |
| --- | --- | --- |
| design（境界が設計判断になる時） | `task-design/SKILL.md` | 該当する節が無い。Step 3 は「未解消の設計判断を解消する」で、その下に「技術検証実装の配置・運用」「discussionを選んだ場合の境界」がある |
| tasklist の設計 | `tasklist-design.md` の commit の生成条件の文 | 「phase単位かつ意味単位で分け、部分承認なら承認範囲だけをcommitする」 |
| commit の実行 | `templates/tasklist.md` の「完了後のaction」の commit block | 「commit（phase単位かつ意味単位で分割）」と、MUST・例 |

- plugin の docs と skill は、「やってしまいがちな行動／それをやると何が起きるか／正しい判断のための問い」の形で失敗例を書く（`work_scope.md`、`branch_pr_issue.md` 等）。

<a id="iteration-0-record-2"></a>

### 判断: どこへ何を書くか

推奨: 三つの段階のそれぞれに短く置く。design には Step 3 の小節、tasklist の設計には括弧書き、commit の実行には template の 1 行。決め手は、境界を決める段階が三つあり、どれか一つだけでは他の段階で同じ取り違えが起きうること。

- design の小節では、plan-commits を起動しないことを明記する。design の段階には実差分が無く、plan-commits は「Git情報を読まず、designやtasklistの見出しだけから計画を作らない」と定めるため。
- commit の実行の段階では実差分があるので、plan-commits を当てる。
- 利用先の失敗（必要条件と手間を基準にした）を、design の小節の「やってしまいがちな行動」に置く。

#### 採らなかった案

- design の段階だけに置く: tasklist の設計と commit の実行で、「意味単位」の中身が分からないまま残る。
- 「意味単位」の定義を task-design 側に書く: plan-commits と正本が二つになる（論点1）。
- design.md の template に「変更の単位と順序」節を足す: 境界が設計判断になる作業だけで要る節であり、すべての design に置くと空の節が増える。

#### 判断結果が規定するもの

- `task-design/SKILL.md` の Step 3 の小節、`tasklist-design.md` の括弧書き、`templates/tasklist.md` の 1 行。
- validator の assertion の対象。

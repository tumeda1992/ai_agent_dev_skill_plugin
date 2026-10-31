# 内部検討記録: 論点7 — 引き渡す内容に、利用者が合意した範囲を足すか

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点7

## 開始context

design の完了後、steering の Step 4 の再発防止 review（discussion を元に再発防止先を review する）で、task-design-discussion の各論点と steering の `discussion.md` を見直した。
論点2・論点3 の取り違えについて、原因が skill の不足にあると判断し、この論点を起こした。

<a id="iteration-0"></a>

## イテレーション0: 足すかと文

<a id="iteration-0-record-1"></a>

### 調査: 各議論の原因

#### 入力

- 問い: 各議論が起きた根本原因は何か。code・docs・skill のどれで防げたか。
- 方法: 2026-10-31 に、task-design-discussion の論点1〜6 と steering の `discussion.md` の論点1 を読み直した。`escalate-plugin-skill-fix/SKILL.md` の「引き渡す内容」と `pending-escalations.md` の「保留時の内容」を読んだ。

#### 結果

- 論点1（WHY を問う必要が無かった）: 利用者の「1:b」を引用できたのに問うた。task-design の 3-1 は「相手の言葉を引用できるか」を問うよう既に定める。当てはめの誤りであり、追加は無い。
- 論点2・論点3（提案2 の中身を合意済みとして扱った）: 「1:b」は plugin へ回すことへの合意だった。
    - 引き渡しの記録は根拠に「assistant の整理」と付けたが、提案の中身が誰の言葉かは示していなかった。
    - `escalate-plugin-skill-fix/SKILL.md` の「引き渡す内容」は、提案・具体例・根拠の三点だけを求める。利用者が何に合意したかを求めない。
    - `pending-escalations.md` の「保留時の内容」は保留指示の原文を残すが、条件成立後の転送は「引き渡す内容」を通る。
- 論点4: 新たな原因は無い。
- 論点5・論点6: この作業そのものが再発防止である。
- steering の `discussion.md` の論点1（問いを記録の前に出した）: facilitate-discussion は保存を先に求めている。当てはめの誤りであり、追加は無い。

<a id="iteration-0-record-2"></a>

### 判断: どこに何を足すか

推奨: `escalate-plugin-skill-fix/SKILL.md` の「引き渡す内容」に、利用者が合意した範囲を四点目として足す。決め手は、受け取る側が引き渡しへの合意と中身への合意を見分ける材料を、渡す側でしか作れないこと。

- 「引き渡す内容」に足す（推奨）
    - 即時の引渡しも、保留からの転送も、ここを通る。
- task-design に「引き渡された提案の中身を合意済みとみなさない」と書く
    - 受け取る側だけで直すと、何が合意済みかを確かめる材料が引き渡しに無いままになる。
- 足さない
    - 引き渡しのたびに、受け取る側が中身を合意済みと読む余地が残る。

#### 判断結果が規定するもの

- `escalate-plugin-skill-fix/SKILL.md` の「引き渡す内容」。
- validator の assertion、design.md の要件・完成後の姿・付録。

<a id="iteration-0-record-3"></a>

### 応答と反映

#### 入力

- 2026-10-31 の利用者の発言「ok」。

#### 結果

- 提案0 を採る。`escalate-plugin-skill-fix/SKILL.md`、validator、design.md へ反映した。
- validator の新しい定数名が既存の `escalateSkill` と重なり、構文エラーになった。既存の定数は同じ file を指すため、それを使うように直した。
- validator は通り、`escalate-plugin-skill-fix/SKILL.md` を `c1122f5` の版に戻すと 3 件で落ちることを確かめた。
- skill-update-review の 5 回目で合格した（`artifacts/skill-structure-review.md`）。

<a id="iteration-0-record-4"></a>

### origin review: doc-enricher の提案 mode（論点7 の決定について一度だけ）

#### 入力

- origin: 論点7 の決定（引き渡す内容に、利用者が合意した範囲を足す）。即時反映済み。
- 対象: `escalate-plugin-skill-fix/pending-escalations.md`、`maintenance-plugin-context/maintenance_policies/migration.md`、`plugins/tumeda-dev/skills/README.md`。

#### 結果

候補なし。

- `pending-escalations.md` の「保留時の内容」へ同じ項目を足す案: DROP。保留指示の原文は既に残し、転送は「引き渡す内容」を通るため重複になる（Gate G）。
- `migration.md` へ原文の扱いを足す案: DROP。原文の固有情報の除き方は既存の規約で足りる（Gate G）。

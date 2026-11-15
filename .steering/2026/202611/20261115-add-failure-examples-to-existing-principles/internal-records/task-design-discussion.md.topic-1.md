# 内部検討記録: 論点1 — task-design Step 5 に足す具体例の位置と文面

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点1

## 開始context

- 問題: 利用先の作業で、利用者に確かめてから文書を書く作業を、段階実行と読み替えて tasklist に載せようとした。task-design `SKILL.md` Step 5 の基準は既にあるが、この形を防ぐ具体例が無い。
- 決める範囲: 具体例を置く位置と文面。
- 開始時の既決条件: 新しい規則・判定基準を足さない（design の MUST）。設計時と編集後に `skill-update-review` を当てる。
- 残る不足: 基準が書かれている箇所（置き場の候補）、文面、`skill-update-review` の結果。

<a id="iteration-0"></a>

## イテレーション0: 位置と文面

<a id="iteration-0-record-1"></a>

### 調査: execution plan 対象の基準がどこに書かれているか

- 問いと方法: 基準が Step 5 以外（`tasklist-design.md`、`roadmap-design.md`、templates）にも書かれていれば、例の置き場が変わる。各 file の見出しを読み、「掲載」「段階実行」「中間checkpoint」を grep した。
- 結果: 基準を持つのは `SKILL.md` Step 5 だけ。`templates/design.md` には execution plan 対象の表の `掲載理由` 列（本番 application coding / 段階実行 / ユーザー指定）があるだけで、判定の説明は無い。NG 集 G に「本番application coding、段階実行、ユーザー指定のいずれにも該当しない変更をexecution plan対象へ載せた → 5 Step 5」がある。
- 案への影響: 例は Step 5 の「file数、調査量、discussion回数…を掲載理由にしない」の段落の直後に置く。NG 集は Step 5 を指しているので変えない。

<a id="iteration-0-record-2"></a>

### 判断: 具体例の文面

推奨は、`SKILL.md` の他の節（「commitの境界が設計判断になる時」）と同じ「やってしまいがちな行動 / それをやると何が起きるか / 正しい判断のための問い」の三行で添える案。問いで、条件 2 の中間 checkpoint と、案への合意を取る確認を分ける。

- 必須条件: 新しい条件を足さない（条件 2 の読み方を具体例で示すだけ）。利用先固有の情報を含めない。起点以外の case でも問いが意図どおりに分ける。
- 起点以外の case での確認:

| case | 中間の確認の中身 | 問いでの判定 |
| --- | --- | --- |
| 本番データを batch に分けて埋め直し、各 batch の後に件数を確かめてから次へ進む | 実行して初めて得られる状態（埋め直した件数） | 条件 2。tasklist に載せる |
| feature flag を一部の利用者にだけ有効にし、指標を見てから広げる | 実行して初めて得られる状態（指標） | 条件 2。tasklist に載せる |
| 複数の文書を書き直し、文書ごとに文言を利用者に確かめる | 案への合意 | task-design の discussion で扱い、合意したら書く |

- 結果: 三つの case で、問いが意図どおりに分けた。

<a id="iteration-0-record-3"></a>

### 検証: 設計時の `skill-update-review`

- 対象と段階: `plugins/tumeda-dev/skills/task-design/SKILL.md`、設計時。構造案は「Step 5 の段落の直後に三行の具体例を足す」。
- 読んだ範囲: `SKILL.md` の全文（この session で 8.3.2 版を全文読み、repository の現行版と差分が無いことを diff で確認した）。`tasklist-design.md` と `roadmap-design.md` は見出しと、基準の重複を探す grep まで。templates の全文と `scripts/` は読んでいない。
- 当てた変更case: この具体例の追加。直すのは Step 5 の一段落の後だけで、他の工程（PrepareStep、Step 3 の routing、plan の設計）を直す必要は出なかった。
- 結果: この変更に関わる切り出し候補は無い。
- 限界: 内部指示の全文を読んでいないため、skill 全体を対象にした切り出し候補の探索は `SKILL.md` に限った範囲でしか行っていない。

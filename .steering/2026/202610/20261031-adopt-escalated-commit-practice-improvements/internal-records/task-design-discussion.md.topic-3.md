# 内部検討記録: 論点3 — 提案2 の新しい契約（利用者の動作確認・local commit・push・PR の順序）

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点3

## 開始context

論点2 で、提案2 の理由（確認で守るのは確かめていない変更を公開しないこと、push 前の local commit は直せること）を導出として報告した。この論点では、plugin の契約をどう書き換えるかを決める。
提案2 のうち「確認環境へ載せるための push を push の制限に含めない」は、採否を独立に決められるため別の論点で扱う。

範囲外: 確認環境への push の扱い、提案1 の導線。

<a id="iteration-0"></a>

## イテレーション0: 契約の書き換え

<a id="iteration-0-record-1"></a>

### 調査: 確認と commit・push・PR の順序を定めている箇所

#### 入力

- 問い: plugin のどこが「確認の前に commit しない」を定め、または引いているか。漏れなく挙げる。
- 方法: 2026-10-31 に、plugin 8.2.0（`c1122f5`）の `plugins/tumeda-dev`、root の `README.md`・`AGENTS.md`、`scripts/verification` を、「動作確認」「commit・push」「commit、push」「確認前に」「承認範囲」で検索し、該当箇所を読んだ。

#### 結果

| file | 箇所 | 今の文の要点 |
| --- | --- | --- |
| `task-design/tasklist-design.md` | 117 行（実装後feedbackと公開action） | commit・push・PR より前にユーザー動作確認を必須にする |
| 同 | 118 行 | commit section を生成する条件。phase 単位かつ意味単位で分け、部分承認なら承認範囲だけを commit する |
| 同 | 151–152 行（自己レビューgate） | commit・push・PR より前にユーザー動作確認があるか。失敗例は executor が commit・push まで進むこと |
| `task-design/templates/tasklist.md` | 125 行（完了後のaction の ⚠️） | 動作確認 phase が完了するまで commit、push、PR を促したり実行したりしない |
| 同 | 127–135 行（commit block） | 完了後の action としての commit。phase ごとに別 commit、部分承認なら承認範囲だけ |
| `tasklist-executor/SKILL.md` | 78 行（停止・再開） | 確認前に commit・push へ進まない |
| 同 | 185 行（返却） | 確認より先に commit・push・PR へ進まない |
| `steering/SKILL.md` | 302 行（6-1） | 確認が完了する前に commit、push、PR へ進ませない |
| 同 | 486 行（やらないこと） | 確認前に commit、push、PR を行う |
| `share-work-in-progress/SKILL.md` | 3 行（description）、36 行（起動gate） | executor の契約を「確認が完了するまで commit・push・PR を行わない」と引く |
| `skills/README.md` | 39 行 | executor の「commit・push・PR 契約」と前提が逆 |

- validator（`scripts/verification/validate-plugin.mjs`）には、これらの文を検査する assertion が無い。
- `plan-commits/SKILL.md` の「stage・commit・push しない」は、計画だけを求められた時の権限の話であり、確認との順序ではない。対象外。
- `tasklist-design.md` の「作業の外へ残るactionを含むphaseの原則」は、対象 action を含む phase で止まって確かめる別の規則であり、変えない。
- `runtime-execution-contracts.md` の `user_confirmation_required` は「ユーザー動作確認を待つ」停止理由であり、commit との順序を書いていない。変えない。

<a id="iteration-0-record-2"></a>

### 判断: 新しい契約の形

推奨: plugin の既定を「確認は作業 branch の push・PR の前。commit task は各 phase の末尾で、DoD の確認の後に local で行う」に変え、repository の context の local Git 運用条件が commit の時期を別に定めていればそれに従う。決め手は、合意済みの理由（push 前の local commit は直せる）が repository を問わず成り立つこと。

#### 判断対象・必須条件・根拠

- 判断対象: plugin の契約で、利用者の動作確認・local commit・作業 branch の push・PR をどの順に置くか。
- 必須条件:
    - 確かめていない変更を公開しない（作業 branch の push・PR の前に確認がある）。
    - tasklist から実行順が一意に読める。executor が実行時に判断しない。
    - repository が「確認の後に commit」を選びたい時に選べる。
    - 作業の外へ残る action を含む phase で止まる規則を変えない。
- 根拠: [record-1](#iteration-0-record-1)、論点2 の理由。

#### 案の評価

- plugin の既定を変え、context の宣言を優先する（推奨）
    - 合意済みの理由は repository に依らない。既定にすれば、利用先ごとに context へ書かなくても効く。
    - 既に「確認の後に commit」を context に書いている repository は、その宣言が優先されて振る舞いが変わらない。
- 既定は今のままにし、context に「phase ごとの local commit を許す」と書いた repository だけ変える
    - 理由が repository に依らないのに、利用先ごとに宣言を求めることになる。宣言しない repository では、確認環境とぶつかる問題が残る。
- 「local commit を行ってよい」とし、行うかを executor に任せる
    - 必須条件の二つ目を満たさない。commit の有無と時期が実行時の判断になる。

#### 部分承認の扱い

今の契約は「部分承認なら承認範囲だけを commit し、残りは待つ」とする。commit が確認の前に済むと、この文は成り立たない。代わりに「確認で直すところが出た phase は、push の前にその phase の commit を local で直す」とする。利用先の作業でも、tasklist にこの形で書いて運用できた。

#### 判断結果が規定するもの

- 上の表の 10 か所の書き換えと、validator の assertion。
- template の commit task の置き場所（各 phase の末尾と品質 check の末尾）。これは提案1 の導線を tasklist 側のどこへ置くかの前提になる。

<a id="iteration-1"></a>

## イテレーション1: 確認で直したところの commit の仕方

利用者の応答（2026-10-31）「local commit書き換えないでいいんじゃ無い？ tasklist終了後に指摘があったからって、指摘修正で追いコミットでいいんじゃ無い？」を受けた。あわせて、提案0 が箇所の数で読みにくいとの指摘を受けた。

<a id="iteration-1-record-1"></a>

### 診断: 書き換えを入れた理由

#### 入力

- 期待との差: 提案0 は、確認で直すところが出た phase の commit を push の前に書き換えるとした。利用者は追加の commit で足りるとした。
- 確認元: 論点2 の理由、提案0 の検討記録、利用先の作業の tasklist。

#### 結果

- 論点2 の理由（確かめていない変更を公開しない、push 前の local commit は直せる）は、push の前に確認があれば満たされる。「直せる」は、確認を commit の前に置かなくてよい根拠であり、直す方法を書き換えに限る根拠ではない。
- 書き換えは、利用先の作業で assistant が tasklist に「直すところが出たら、push 前に該当 phase の commit を local で直す」と書いた文が元になっている。利用者の指示ではない。利用先では直すところが出なかったため、この手順は試されていない。
- 書き換えには rebase か amend が要る。interactive な rebase は使えない実行環境がある。

#### 原因の所在

成果物固有。assistant が、phase の commit を確認済みの状態に揃えることを、根拠なく必須条件に加えていた。skill や docs の不足ではない。

<a id="iteration-1-record-2"></a>

### 判断: 直したところの commit の仕方

推奨: 直した差分を追加の commit にする。決め手は、合意済みの理由を満たしたまま、agent に履歴の書き換えをさせずに済むこと。

- 追加の commit（推奨）
    - 代償: phase の commit を単独で revert した時に、それを直した追加の commit が残りうる。依存がある時は両方を戻す。
- 書き換え（提案0）
    - 必須条件に無い性質（phase の commit が確認済みの状態と一致すること）のために、rebase か amend を要する。

#### 判断結果が規定するもの

- `tasklist-design.md` の commit の生成条件の文と、template の動作確認の task の二箇所。他は提案0 のまま。

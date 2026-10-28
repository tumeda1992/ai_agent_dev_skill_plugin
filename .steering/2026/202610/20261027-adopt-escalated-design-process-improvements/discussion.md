# 議論記録

## 論点1: task-design が依拠する repository context のテスト方針を、root README の検証規約に合わせるか

**ステータス:** 反映済み

**種別:** 再発防止review

### イテレーション0（論点1）: context のテスト方針の修正

#### 提案0（論点1）

この repository の context instance（`plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md`。`.agents/skills` が `plugins/tumeda-dev/skills` への symlink のため、この file が instance を兼ねる）の「テスト方針」と「全体 test command」を、root `README.md` の「変更時の検証と前提」に合わせて直す。

**今の記述と、README との食い違い**

| 箇所 | 今の記述 | README の「変更時の検証と前提」 |
| --- | --- | --- |
| テスト方針 | 検証は `validate-plugin.mjs` による plugin manifest の整合確認だけである。skill 本文の内容は人の review で担保する | validator は assertion で skill と docs の内容を検査する。skill または docs を追加・変更したら対応する assertion を足し、固定している文字列を変えたら追随させる |
| 全体 test command | `validate-plugin.mjs` の 1 本 | `validate-plugin.mjs`、`test-task-design-handoff.mjs`、`inspect-discussion.test.mjs` の 3 本。新 script は `node --check` も実行する |

**変更後**

- テスト方針: 「自動test frameworkを持たない。`package.json` は存在しない。」は残す。2 文目を「検証の規約は root `README.md` の『変更時の検証と前提』が正本である。`scripts/verification/validate-plugin.mjs` は manifest の整合に加え、assertion で skill と docs の内容を検査する。skill または docs を追加・変更したら、対応する assertion を同じ変更で足す」に置き換える。
- 全体 test command: 既存の `validate-plugin.mjs` の項目は残し、`node scripts/verification/test-task-design-handoff.mjs` と `node --test plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.test.mjs` を足す。

**なぜ必要か（再発防止の三問）**

1. 根本原因となる未共有の知識: validator が skill と docs の内容を検査し、変更のたびに assertion を足す規約。README には書かれているが、task-design が設計前に読む context には逆のこと（manifest の整合だけ）が書かれている。
2. 知識の種類: code を読めば分かる（validator を読めば assertion の存在は分かる）が、設計前調査は context の記述を前提にするため、code を読みに行く契機が無い。repository 知識の不足に当たる。
3. 保存先: task-design・tasklist-executor・test-runner が直接読む context のテスト方針。README を正本として参照し、規約の中身は写さない。

具体例は 2 件ある。

- 今回の design は assertion の追加を含まず、steering の終了前の確認で初めて README の規約に当たった（task-design-discussion.md 論点4・変更内容1）。
- 前回の配布（`8.1.0`）は、skill の文を共通 file へ移した変更と、読取手順を書き直した変更に assertion が追随しないまま、検証が失敗した状態で出ていた（同論点4）。

**この作業で拾う理由（`work_scope.md` の二段目）**

今の作業の目的の外にある不備だが、1 file の 2 節で、review・revert・配布の単位を崩さない。今回の配布（`8.1.1`）に含めれば、次の作業から設計前調査で正しい規約に当たる。

**扱わないもの**

この file が配布 template と instance を兼ねている件は、`.steering/2026/202608/20260823-route-skill-feedback-to-plugin-steering/design.md` に既知の欠陥として記録済みであり、今回は扱わない。

#### 検討記録（論点1・イテレーション0）

steering の終了前 gate（doc-enricher の提案 mode と、議論ごとの再発防止 review）として、今回の議論（task-design-discussion.md 論点1〜4）の根本原因を辿った。論点1〜3 は引き渡された改善そのもので、この作業が再発防止に当たる。構造reviewの不合格 1〜6 は設計時・編集後の review が機能した結果であり、追加の保存先は要らない。論点4 と、その変更内容1（assertion の追加漏れ）は、context のテスト方針と README の食い違いという同じ原因に行き着いた。

[内部検討記録: 論点1・イテレーション0](internal-records/discussion.md.topic-1.md#iteration-0)

#### 提案0へのフィードバック（論点1）

**結果:** 合意（a: 1 と 2 の両方を進める）

> a

選択肢 a は、task-design-discussion.md 論点4・変更内容1（validator への assertion の追加）とこの提案0の両方を進めるものである。

### 現在の変更（論点1）

`plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md` の「テスト方針」と「全体 test command」へ反映済み。

### 決定（論点1）

この repository の context instance（`plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md`）の「テスト方針」と「全体 test command」を、root `README.md` の「変更時の検証と前提」に合わせる。

- テスト方針: 検証の規約は README の同節を正本として参照する。validator は manifest の整合に加え、assertion で skill と docs の内容を検査し、skill または docs を追加・変更したら同じ変更で assertion を足すことを書く。
- 全体 test command: `validate-plugin.mjs` に assertion の検査を書き足し、`test-task-design-handoff.mjs` と `inspect-discussion.test.mjs` を足す。
- 配布 template と instance を兼ねる件は扱わない（既知の欠陥として別の steering に記録済み）。

選択理由: task-design・tasklist-executor・test-runner は設計前・実行時に context の記述を前提にし、validator の code を読みに行く契機が無い。README と逆の記述が、今回の assertion の追加漏れと、前回の配布で検査が失敗したままだった原因になった。

代償: 配布 template を兼ねる file に、この repository の検証の事実がさらに書き足される（既知の欠陥の範囲内）。

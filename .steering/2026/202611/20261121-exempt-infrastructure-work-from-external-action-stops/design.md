# Design: 作業の外へ残る action の phase で止まらず commit・push し、止まる task に利用者にしかできない操作を足す

## 元の依頼内容

利用先 repository の一つの作業（AWS の resource を、Terraform と GitHub Actions を通して本番へ届ける経路を作る）の tasklist のレビューで出た、plugin の skill への改善提案である。`escalate-plugin-skill-fix` で引き渡す。元の作業は tasklist のレビュー中で中断している。利用先固有の情報（repository 名、path、issue の番号、AWS の account の値）は除いた。

- 提案: `skills/task-design/tasklist-design.md` の「作業の外へ残るactionを含むphaseの原則」は、対象 action を含む phase の最後に「ここで作業を停止し、対象 action の結果をユーザーに確認する。次phaseへは進まない」task を置くことを MUST にしている。この原則は、application の作業で DB の migration のような、作業の外へ残る副作用のために入れたもので、基盤（infrastructure）の作業は外を変えることが基本のため、例外にする。
- 具体例: 利用先の作業の tasklist で、初回の構築（state の bucket と role を手元から apply）、GitHub の secrets の登録、使われていない旧 deploy の resource の削除、検証のための merge による apply の各 phase の最後に停止・確認 task を置いた。利用者は「今回は止まる必要は無い」と言い、理由を問うた。その作業の design では、一度だけの外への操作は assistant が行い、利用者は各 command を tool の実行の許可で見てから通すと決めていた。各操作の結果は command の出力で判定でき、後の phase（PR の plan、merge の後の apply）が前の phase の結果を前提として確かめる。
- 根拠（assistant が書いた部分）: 基盤の作業では、外の変化が成果物そのものであり、確認が届ける経路（PR の plan の要約、利用者の merge、一度だけの操作の command ごとの許可、結果の command での判定）に組み込まれている。停止 task は、同じ file の「止まるtaskの原則」が退ける「利用者が確かめるものの無い待ち」になる。

### 合意の範囲

- 引き渡すことへの合意: 明示の合意は無い。明示の保留も無いため、`escalate-plugin-skill-fix` の既定どおり、すぐ引き渡した。
- 提案の中身への合意: 基盤の作業を例外にすることは、利用者の原文で合意している。例外の書き方、条件、置き場は未合意で、この repository の設計で合意を取る。

利用者の原文:

> フェーズわけはOK。今回は止まる必要は無い。なぜだかわかる？

（assistant が、利用者は各 command を許可で見てから通すため適用の事実をその場で見ていること、結果は command で判定でき後の phase がその検証になることを理由として答え、plugin の MUST と「止まるtaskの原則」がぶつかると述べた。）

> 理解あってる。howもok。作業の外に残るactionって、インフラだけは例外なんだよな。アプリケーション層でのdbのマイグレーションのときに入れたんだけど、インフラは外で変わることが基本なんよね。

この repository での設計の議論（`task-design-discussion.md`）で、利用者が次を述べ、提案の中身が「基盤だけを例外にする」から広がった。

> なんだったらdbのマイグレーションもそこでコミットとプッシュして、作業環境が飛んでも同期できない状態を避けたくて、その頃一括コミット時代だったから停止を入れただけで本当は止まらなくてもコミットプッシュできればいいだけなんだよな

> prのマージ含め、ユーザしかできないことでは止まらざるを得ないんじゃない？
> prのaiによるマージは禁止してるし、このプラグイン以外では、main級のブランチへのマージを禁止してるし。あと、シンプルに権限的にaiが実行できないコマンドとか

---

## TL;DR

tasklist の「作業の外へ残る action を含む phase の最後に、停止して利用者に結果を確かめてもらう task を置く」という MUST は、本当は、作業環境が失われても外の状態と repository を同期できるよう、その時点で commit・push するために入れたものだった。commit を作業の最後にまとめていた頃に、途中で commit・push する機会として停止を置いた。MUST の理由の段落はこの目的を書いておらず、停止を利用者の確認と読ませ、利用者が確かめるものの無い停止を生んだ。この作業で、その停止を、対象 action の元になった変更を commit・push する task に置き換え、止まらずに進むようにした。あわせて、止まる task に「利用者にしかできない操作」（PR の merge、既定 branch への merge、権限の無い command）を足し、止まる task を「利用者にしかできない操作」と「利用者の確認」の二つにした。配布 version は 9.0.3 から 9.0.4（PATCH）へ上げた。

---

## 完成後の姿

### 進め方の規則（workflow）

**tasklist に止まる task を置く条件**（`skills/task-design/tasklist-design.md` の「止まるtaskの原則」）:

止まる task は次の二つだけで、task にはどちらに当たるかを書く。

1. 利用者にしかできない操作（小節「利用者にしかできない操作」）
   - assistant が行うことを禁じられている操作（PR の merge、既定 branch への merge。どれを禁じるかは repository の context file と plugin の規則が決める）と、assistant の権限では実行できない command。
   - 操作を必要とする phase の最後に置く。`tasklist-executor` はそこで既存の停止理由 `phase_checkpoint` を返して止まる（停止理由は増やさない）。
   - task には、利用者が行う操作と、行われた後に assistant が確かめて続けることを書く。
   - 判断の問い: 「この操作を、assistant が行ってよく、行えるか」。
2. 利用者の確認（変えない。利用者にしか確かめられないものだけを、利用者が触れるものが揃った後に一度だけ）

**作業の外へ残る action を含む phase**（同 file の「作業の外へ残るactionを含むphaseの原則」）:

```text
対象 action を含む phase（単独 phase に切り出す）
  1. 対象 action を行う（migration を当てる、手元から apply する等）
  2. 運用の文書と実態を照合する
  3. 対象 action の元になった変更と、その phase までの作業記録を commit し、作業 branch を push する
  4. 止まらずに次の phase へ進む
```

- 対象 action が merge で動く適用（PR を merge すると apply が動く等）なら、元になった変更は merge の前に remote にあるため、3 は要らない。merge そのものは利用者にしかできない操作として止まる。
- 3 を assistant が行えない時（push の権限が無い等）は、利用者にしかできない操作として止まる。
- 理由: 対象 action の後に作業環境（開発機の working tree）が失われると、外の状態だけが進み、それを生んだ変更がどこにも無くなって、外の状態と repository を同期できなくなる。push しておけば、別の環境から続きを行える。
- やってしまいがちな行動: 対象 action の phase の最後で止まり、利用者に適用の結果を確かめてもらう。利用者は確かめるものの無い待ちを受け、しかも止まっても変更は remote に無いままである。
- context instance の `### 作業の外へ残るactionの差し込み` の宣言は、phase の最後の task へ書く（宣言が無ければ commit・push の task だけ）。

**利用者の確認の前に許す commit・push**: 今までの「確認環境へ載せるために `UI確認環境` が定める commit・push」に、「作業の外へ残る action を含む phase の最後の commit・push」を足す。この例外を書いている 6 か所（`tasklist-design.md` の「実装後feedbackと公開action」と自己レビュー gate、`steering/SKILL.md` の 2 か所、`tasklist-executor/SKILL.md` の 2 か所、`templates/tasklist.md` の注意書き）と、context instance の template の `### UI確認環境` の comment を、同じ文へ揃えた。

**自己レビュー gate に足した項目:**

- 対象 action を含む phase の最後に、元になった変更と作業記録の commit・push の task があるか（止まる task にしていないか。merge で動く適用には置いていないか）。
- 利用者にしかできない操作の task が、操作を必要とする phase の最後にあり、利用者が行う操作と、その後に assistant が確かめて続けることを書いているか。

**当てた具体 case:**

| case | 規則を当てた結果 |
| --- | --- |
| Terraform と GitHub Actions の経路を作る作業（起点） | 手元からの初回の構築の後に定義を commit・push し、旧 deploy の resource の削除の後に記録を commit・push する。どちらも止まらない。検証のための PR の merge は利用者にしかできない操作として止まり、merge による apply の後は commit・push の task が要らない |
| application の作業で、共有の DB へ migration を当てる | 当てた後に migration の file を commit・push し、止まらずに進む |
| plugin repository で、引き渡された作業を `main` へ取り込む | この repository の context が assistant に許しているため、止まらない |
| assistant に権限の無い設定の変更 | 利用者にしかできない操作として止まる |
| 外へ残る action の無い作業（code の変更と test だけ） | 作業の外へ残る action の原則は当たらない。commit・push は今どおり、利用者の確認の後に行う |

**変わらない規則:**

- `SKILL.md` の Step 4（design 合意判定）の「作業の外へ残る変化の引き継ぎ」。外へ残る変化を確かめ・更新・復旧する手段を受け入れ基準に入れることは変えない。
- 対象 action を含む phase を単独 phase に切り出すこと。
- `runtime-execution-contracts.md` の停止理由。

---

## 要件（Requirements）

### MUST（必達）

- 作業の外へ残る action を含む phase の最後の停止・確認 task を、元になった変更の commit・push の task に置き換え、止まらずに進む規則にする。理由の段落には、作業環境が失われても同期できるようにするという本当の目的を書く。
- 止まる task に、利用者にしかできない操作を足す。
- 利用者の確認の前に許す commit・push の例外を、同じ例外を書いているすべての箇所で揃える。
- 書いた規則の文が残っていることを検査する assertion を、`scripts/verification/validate-plugin.mjs` へ足す。
- 利用先 repository の固有の情報（repository 名、path、issue の番号、AWS の account の値）を、skill・docs・この steering の成果物に書かない（`maintenance_policies/migration.md`）。
- 配布 version を一度だけ上げる。

### SHOULD（できれば）

- なし

### MAY（あれば嬉しい）

- なし

### 非目標

- 利用先 repository の tasklist の続き。利用先の作業へ戻ってから、そこで扱う。
- 利用先 repository への plugin の update と、利用先の進行中の作業への反映。`escalate-plugin-skill-fix` の「取り込みと反映」が扱う。
- `runtime-execution-contracts.md` へ、利用者の操作を待つ専用の停止理由を足すこと。利用者にしかできない操作の task を phase の最後に置けば、既存の `phase_checkpoint` で止まれる。

### 受け入れ基準

- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出す。`node scripts/verification/test-task-design-handoff.mjs` と `node --test plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.test.mjs` が通る。
- 合意した文面が合意した場所にあり、対応する assertion がある。assertion は、検査する文を一文字変えると落ちる。
- 変更した範囲を `grep` で調べ、利用先 repository の固有の情報が無い。

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 利用者の確認の前に許す commit・push の例外が、一部の箇所でだけ広がり、executor と steering と tasklist-design で食い違う | 例外を書いている 6 か所と template の comment を同じ文に揃え、`validate-plugin.mjs` で同じ文字列を検査する |
| 「利用者にしかできない操作」が、assistant の手間を省くための停止の言い訳に使われる | 判断の問い「この操作を、assistant が行ってよく、行えるか」と、自己レビュー gate の「assistant が行ってよく、行える操作で止めていないか」で退ける |

---

## テスト方針

- 書いた規則の文が残っていることを、`validate-plugin.mjs` の assertion で検査する。assistant が plugin repository の手元で `node` を実行して確かめる（今の環境で動く）。
- `validate-plugin.mjs`、`test-task-design-handoff.mjs`、`inspect-discussion.test.mjs` が通ることを、assistant が手元で確かめる。
- skill の md は、書いた後に assistant が `document-review` を当てる。汎用 skill の更新のため、構造案の採用前と編集後に `skill-update-review` を当てる。
- 利用者が確かめる項目は無い。

---

## （付録）前提とする既存仕様

- `skills/task-design/tasklist-design.md`:
  - 「止まるtaskの原則」: 止まる task は、作業の外へ残る action を含む phase の最後と、利用者の確認の二つだけ。止まる理由がどちらにも当たらない task を置かない。やってしまいがちな失敗として、利用者が確かめるものの無い確認で作業が止まることを挙げる。
  - 「作業の外へ残るactionを含むphaseの原則」: MUST が三つ（単独 phase への切り出し、phase の最後の停止・確認 task、受け入れ基準の引き継ぎの観点と、停止・確認 task での運用の文書と実態の照合）。理由は、対象 action が後続作業の前提になり、作業の破棄で戻せないため、適用の事実を独立に確かめる必要があること。下位に「利用先固有の差し込み」（context instance の宣言を停止・確認 task へ書く）。
  - 「実装後feedbackと公開action」: 利用者の確認の task に入れるのは、利用者にしか確かめられないものだけ。判断の問いは「この確認の合否を、assistant が command の出力・file・撮影した画面から判定できるか」。
- `skills/task-design/SKILL.md` の Step 4「作業の外へ残る変化の引き継ぎ」: 判定の問い「この作業で起きる変化は、この作業を破棄しても残るか」。例の表に、DB migration の適用、deploy / release、外部 service の設定変更、本番データの移行・削除（残る）を持つ。
- 規則の経緯（この repository の steering の記録）:
  - 元は「migration phaseの原則」で、DB の migration を対象にしていた。
  - 2026-08-31 の steering `20260831-add-evacuation-standard-and-refine-task-design` で「作業の外へ残るactionを含むphaseの原則」へ一般化し、判定の問いと例（deploy / release、外部 service の設定変更を含む）を足した。MUST の文面は変えなかった。
  - 2026-09-09 の steering `20260909-apply-infrastructure-steering-feedback` で三つ目の MUST（受け入れ基準の引き継ぎの観点と、停止・確認 task での照合）を足した。
  - 2026-10-29 に、作業の外へ残る変化の判定を design 合意判定（Step 4）へ移した。
- `docs/development_standards/infrastructure/`: 基盤（cloud の resource とその構成、環境の分け方）の作り方の判断基準。task-design は設計前調査でこの群をすべて読む。
- `skills/tumeda-dev-plugin-context.md`（context instance の template）: `## task-design` に `### 作業の外へ残るactionの差し込み` を持つ（停止時に既定の確認へ加えて行うこと、または問うこと）。

---

## （付録）変更の実行区分

### 設計中に反映を終えた変更

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |
| `plugins/tumeda-dev/skills/task-design/tasklist-design.md` | 「止まるtaskの原則」の二つを、利用者にしかできない操作と利用者の確認にした。小節「利用者にしかできない操作」を足した。「作業の外へ残るactionを含むphaseの原則」の二つ目の MUST を commit・push の task に置き換え、理由・やってしまいがちな行動を書き直し、三つ目の MUST の照合を commit・push の前にした。差し込みの書き込み先を phase の最後の task にした。「実装後feedbackと公開action」の、確認の前に許す commit・push を二つにした。自己レビュー gate に二項目を足し、差し込みの項目を合わせた | `validate-plugin.mjs`、`test-task-design-handoff.mjs`、`inspect-discussion.test.mjs` が通った。document-review（更新時観点）で、理由の段落に前の版の経緯が入っていた指摘を直した。skill-update-review（編集後）は候補なし | [進め方の規則（workflow）](#進め方の規則workflow) |
| `plugins/tumeda-dev/skills/steering/SKILL.md`（2 か所）、`plugins/tumeda-dev/skills/tasklist-executor/SKILL.md`（2 か所）、`plugins/tumeda-dev/skills/task-design/templates/tasklist.md` | 利用者の確認の前に許す commit・push に、作業の外へ残る action を含む phase の最後の commit・push を足した | `plugin validation passed` | [進め方の規則（workflow）](#進め方の規則workflow) |
| `plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md` | `### UI確認環境` の comment に同じ例外を足し、`### 作業の外へ残るactionの差し込み` の comment の「停止時に」を「phaseの最後に」にした | `plugin validation passed` | [進め方の規則（workflow）](#進め方の規則workflow) |
| `scripts/verification/validate-plugin.mjs` | 例外の文字列を含む 4 つの検査（`confirmEnvExclusion` 等）を新しい文へ直し、新しい規則の本体・小節の順序・自己レビュー gate・template の comment を検査する 13 の検査と、古い停止・確認 task の文を禁じる `forbidText` を足した。検査する文を一文字変えると、18 の検査がすべて落ちることを確かめた | `plugin validation passed` | [要件（Requirements）](#要件requirements) |
| `.claude-plugin/marketplace.json`（二箇所）、`plugins/tumeda-dev/.claude-plugin/plugin.json`、`plugins/tumeda-dev/.codex-plugin/plugin.json`、`scripts/verification/validate-plugin.mjs` の `expectedRelease` | 配布 version を 9.0.3 から 9.0.4 へ上げた。既存の skill の内容の修正で、consumer が新たに呼べるもの（skill、parameter）は増えないため PATCH | `plugin validation passed`、`task-design handoff tests passed` | [要件（Requirements）](#要件requirements) |
| `plugins/tumeda-dev/docs/think_standards/questioning_existing.md` | 「失敗例」に、規則の対象を広げる時に手段だけを引き継ぎ、理由を手段に合わせた別の目的で書いた例と、判断の問い（引き継ぐのは目的か手段か）を足した（steering の Step 4-2 の再発防止。利用者の合意を得た） | `plugin validation passed`。検査する文を一文字変えると落ちることを確かめた。document-review（更新時観点）は指摘なし | [TL;DR](#tldr) |
| `scripts/verification/validate-plugin.mjs` | 上の判断の問いを検査する `requireText` を一行足した | `plugin validation passed` | [TL;DR](#tldr) |

### 設計中に反映する、他の判断を待っている変更

なし

### tasklist・roadmapに載せて実行する変更

なし

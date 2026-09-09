# タスクリスト

## 設計参照

- `./design.md`
- 議論の経緯: `./task-design-discussion.md`

## 🚨 タスク完全完了の原則

**このfileの全taskが完了するまで作業を継続すること**

### 必須rule

- **すべてのtaskを`[x]`にすること**
- 「時間の都合により別taskとして実施予定」は禁止
- 「実装が複雑すぎるため後回し」は禁止
- host・tool・外部環境が動かないことを理由に完了扱いにすることは禁止
- 未完了task（`[ ]`）を残したまま`completed`を返さない

### 実装可能なtaskだけを計画

- 計画段階で実装可能なtaskだけをlistする
- 「将来やるかもしれないtask」は含めない
- 「検討中のtask」は含めない
- 未解消のTBDまたは実装者が決める設計判断は含めない

### taskの取消完了が許可される唯一のcase

合意済みplanの変更によって元taskが不要または別実装へ置換された場合だけ取消完了にできる。取消時は合意と具体的理由を必ず記録する。

```markdown
- [x] ~~task名~~（合意済みplan変更により不要: 具体的な理由）
```

時間不足、難しさ、host停止、tool制限、外部環境未準備は取消理由にしない。これらの場合は`[ ]`を維持し、停止・再開状態を返す。

### taskが大きすぎる場合

- taskを着手可能なsubtaskへ分割する
- 分割したsubtaskをこのfileへ追加する
- subtaskを一つずつ完了させる

### tasklistの更新timing（必須）

- **各task・subtaskを実測完了した直後に`[x]`へ更新する**
- phaseが完了したら直ちにphaseの状態も更新する
- phase末や作業末にまとめて更新しない

### 作業の外へ残るactionの判定

このtasklistは作業の外へ残るactionを持たない。変更はすべてこのrepository内のfileであり、branchを破棄すればすべて消える。配布versionの宣言値を更新するが、実際に利用先へ届くのは`main`へ取り込まれ再installされた時点であり、それはこのtasklistの範囲外である。

対象actionが無いため、停止・確認taskを置かない。`design.md`が定める引き継ぎの担保も、適用条件（この作業を破棄しても残る変化があるか）を満たさないため発火しない。

### testと品質checkの扱い

このrepositoryは自動test frameworkを持たない。`package.json`が存在せず、linterも無い。検証は`node scripts/verification/validate-plugin.mjs`によるplugin manifestとskill・docs内容の整合確認だけである。

`README.md`の`## 変更時の検証と前提`が次を定めている。この作業ではこれをtestの代替として扱う。

- skillまたはdocsを追加・変更したら、対応するassertionを`validate-plugin.mjs`へ追加する
- 既存assertionがピン留めしている文字列を変更したら、そのassertionも追随させる
- `forbidText`を先に確認する。`requireText`は追随を怠ると検査が落ちて気づけるが、`forbidText`は落ちないまま無力化する

UI変更は無い。このrepositoryは起動するappを持たない。

---

## Phase 1: `task-design/SKILL.md` の節構造を整える

新しい思想を入れる場所を作り、既存の節番号と内部参照を整合させる。記述の追加はPhase 2 で行う。

### DoD（完了条件）

- `task-design/SKILL.md` の section 3 の見出しが `3-1` から `3-6` まで欠番なく並ぶ
- 旧 `3-5 設計は対話であり転記ではない` が `3-6` になっている
- `SKILL.md` 内で旧 `3-5` を指していた参照がすべて `3-6` を指す
- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出力する

### Tasks

- [x] 新しい節の枠を作る
  - [x] `### 3-4. 不確実性のためならコードを書く` の直後へ `### 3-5. 実行して初めて確定することは、段階を分けて設計する` の見出しを挿入する
  - [x] 既存の `### 3-5. 設計は対話であり転記ではない` を `### 3-6.` へ変更する

- [x] 内部参照を追随させる
  - [x] `grep -n "3-5" SKILL.md` で参照箇所を列挙する
  - [x] 旧 `3-5`（設計は対話であり転記ではない）を指す参照をすべて `3-6` へ変更する。対象は `## 4 成果物テンプレート` の「（3-5 思想に対応）」、Step 3 の「**禁止（3-5 違反）:**」、section 6 NG集 の D 群、section 8 の「転記禁止（3-5）」を含む
  - [x] 変更後に `grep -n "3-5\|3-6" SKILL.md` を実行し、`3-5` が新しい節の見出しとPhase 2 で足す参照だけになることを確認する

- [x] 既存assertionの追随を確認する
  - [x] `grep -n "taskDesignSkill" scripts/verification/validate-plugin.mjs` で対象assertionを列挙する
  - [x] 節番号をピン留めしているassertionが無いことを確認する
  - [x] ピン留めしている文字列が今回の変更で失われていないことを確認する

- [x] 追加した節に対応するassertionを足す
  - [x] `validate-plugin.mjs` へ、新しい `### 3-5.` の見出しに対する `requireText` を追加する
  - [x] 繰り下げた `### 3-6.` の見出しに対する `requireText` を追加する

- [x] 検証する
  - [x] `node scripts/verification/validate-plugin.mjs` を実行し `plugin validation passed` を確認する

### 各task詳細

#### 新しい節の枠を作る

この phase では見出しだけを置き、本文は空にしない。`design.md` の `documentation以外のfile deliverable` が定める内容の骨子（段階を分ける三条件、scope 判定の二問、技術検証実装との境界、対象範囲の明示）を、section 3 の型（`**思想:**` / `**違反シグナル:**` / `**帰結:**` / `**問い:**`）で書く。Phase 2 と分けているのは、節番号の繰り下げと参照更新という構造の変更を、記述の追加と別の検証単位にするためである。

#### 内部参照を追随させる

`3-5` は現在12箇所以上から参照されている。すべて「設計は対話であり転記ではない」を指しており、繰り下げ後は `3-6` になる。一つでも残ると、読み手が新しい `3-5` を「転記禁止」の節だと誤読する。

---

## Phase 2: 判断の適用と段階の切り方を、手順とplanの層へ足す

Phase 1 で置いた思想を、実際に適用する手順と、planへの落とし込みへ繋ぐ。

### DoD（完了条件）

- `task-design/SKILL.md` の Step 3 で、解消手段を選ぶ表の直前に scope 判定の記述がある
- `task-design/SKILL.md` の `3-4` に、技術検証実装との境界を示す記述がある
- `task-design/SKILL.md` の Step 4 に、新しい判断基準を起点以外の case で検証する項目がある
- `task-design/templates/design.md` の `### 受け入れ基準` の記入指示に、引き継ぎの観点がある
- `task-design/tasklist-design.md` の `### phase分割の方針` に、基盤phase を最初に置く指針がある
- `task-design/tasklist-design.md` の `### 作業の外へ残るactionを含むphaseの原則` に、引き継ぎ担保のMUSTがある
- 追加した記述に対応するassertionが `validate-plugin.mjs` にある
- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出力する

### Tasks

- [x] 適用の層へ足す
  - [x] `SKILL.md` の Step 3 の `2. 不確実性の解消手段を選ぶ` の表の直前へ、scope 判定の段落を挿入する。解消手段は三つのまま増やさない
  - [x] 外した不確実性を `design.md` の非目標へ「実測後に設計する」と記す指示を含める
  - [x] `3-4 不確実性のためならコードを書く` へ、技術検証実装との境界を一文加える。捨てられる成果物は土台にならず、土台になる成果物は捨てられない
  - [x] Step 4 の design 合意判定の箇条書きへ、新しい判断基準または規則を設計した場合に起点以外の具体 case を二つ以上当てて確認する項目を追加する

- [x] design templateへ足す
  - [x] `templates/design.md` の `### 受け入れ基準` のコメントへ、引き継ぎの観点の記入指示を加える。存在確認ではなく、運用documentの手順だけを入力として確認操作が通る形で書くことを示す
  - [x] 適用条件が「この作業を破棄しても残る変化があるか」であることを含める

- [x] planの層へ足す
  - [x] `tasklist-design.md` の `### phase分割の方針` の箇条書き末尾へ、基盤phase を最初に置き、DoDへ実測結果を含め、完了後に実測を入力としてdesignへ戻る前提でplanを作ることを追加する
  - [x] `tasklist-design.md` の `### 作業の外へ残るactionを含むphaseの原則` のMUST二項の後へ、三つ目のMUSTを追加する。対象actionがある場合は引き継ぎの観点をdesignの受け入れ基準へ入れること、停止・確認taskで設計時点に決めた運用documentと実態を照合すること

- [x] 追加した記述に対応するassertionを足す
  - [x] Step 3 の scope 判定に対する `requireText` を追加する
  - [x] Step 4 へ足した case 検証の項目に対する `requireText` を追加する
  - [x] `3-4` へ足した境界の一文に対する `requireText` を追加する
  - [x] `tasklist-design.md` の二箇所に対する `requireText` を追加する
  - [x] `templates/design.md` の記入指示に対する `requireText` を追加する

- [x] 検証する
  - [x] `node scripts/verification/validate-plugin.mjs` を実行し `plugin validation passed` を確認する

### 各task詳細

#### 適用の層へ足す

Step 3 は不確実性ごとに解消手段を選ぶ手順を持つ。scope 判定はその手前に置く。手段を四つへ増やすと「議論・調査・技術検証実装」という既存の三分類が崩れる。判定は手段の選択ではなく、手段を選ぶ対象かどうかの判定である。

#### assertionを追加する

`README.md` の `## 変更時の検証と前提` が、skillまたはdocsを追加・変更したら対応するassertionを追加することを定めている。この作業ではこれがtestの代替になる。追加する文字列は、将来の言い換えで消えると困る中核だけを選ぶ。全文をピン留めすると、以後の表現修正がすべて検査に引っかかる。

---

## Phase 3: このrepositoryの自称から「正本」を外し、再混入を検査で止める

### DoD（完了条件）

- `AGENTS.md` に「正本」が無い
- `README.md` に「正本」が無い
- `escalate-plugin-skill-fix/SKILL.md` に「正本repository」が無い
- 同fileの相対用法2行（`migration.md` を規約の正本とする記述、判断・規約をそれぞれの正本へ委ねる記述）が残っている
- `validate-plugin.mjs` に `forbidText` が三件追加され、禁止語を戻すと validation が落ちる
- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出力する

### Tasks

- [x] `AGENTS.md` を直す
  - [x] `### tumeda-dev` の「このrepositoryが正本のskill plugin。実体は `plugins/tumeda-dev/`。」を、このrepositoryが何を持つかを述べる形へ変える

- [x] `README.md` を直す
  - [x] `## 運用契約` の「共有手順の正本はこのpluginに置く。」を、コピー禁止規則の理由を自称なしで述べる形へ変える
  - [x] `## 運用契約` の「正本repository自身も…正本だけを例外にしない。」を、このrepositoryも同じcontract上で動くことを述べる形へ変える
  - [x] `## 変更時の検証と前提` の「このrepositoryの検査正本は…」を、検査手段が一つであることを述べる形へ変える
  - [x] （設計時未列挙）`## 運用契約` の「provider固有model名はskill手順の正本にしない。」を発見。相対用法だが本phaseのDoD「`README.md`に「正本」が無い」を満たすため同時に言い換える

- [x] `escalate-plugin-skill-fix/SKILL.md` を直す
  - [x] `docs/documentation_standards/modify_description_policy.md` を読み、descriptionの変更規約を確認する
  - [x] frontmatterのdescriptionから「正本repository」を外す
  - [x] 見出し `## 正本repositoryの判定` を `## plugin repositoryの判定` へ変える
  - [x] 見出し `### 正本だった場合` と `## 正本でない場合の引き渡し` を、判定対象がplugin repositoryであることが読める形へ変える
  - [x] 本文の「正本repository」をすべて `plugin repository` へ置き換える
  - [x] 「正本かどうか」「正本と決めつけない」等の単独用法を、判定対象が読める形へ変える
  - [x] 相対用法2行を変更していないことを確認する

- [x] 再混入を止めるassertionを足す
  - [x] `AGENTS.md` に対し「正本」を禁止する `forbidText` を追加する
  - [x] `README.md` に対し「正本」を禁止する `forbidText` を追加する
  - [x] `escalate-plugin-skill-fix/SKILL.md` に対し「正本repository」を禁止する `forbidText` を追加する
  - [x] labelには何を禁止しているかが読める説明を付ける

- [x] 検証する
  - [x] `grep -n 正本 AGENTS.md README.md` が空であることを確認する
  - [x] `grep -n 正本repository plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md` が空であることを確認する
  - [x] `grep -n 正本 plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md` が2行であることを確認する
  - [x] `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出力することを確認する
  - [x] `AGENTS.md` へ一時的に「正本」を含む行を足し、validation が落ちることを確認する
  - [x] 足した行を戻し、再び `plugin validation passed` になることを確認する

### 各task詳細

#### `escalate-plugin-skill-fix/SKILL.md` を直す

このfileは26行に「正本」を含み、skillの中心語彙になっている。単純な文字列置換では、単独用法（「正本かどうか」「正本だった場合」）が不自然な日本語になる。判定対象がplugin repositoryであることが読める形へ、文ごと見直す。

相対用法2行は残す。`migration.md` を規約の正本とする記述と、判断・規約をそれぞれの正本へ委ねる記述は、何に対する正本かが同じ文の中にある。

#### 再混入を止めるassertionを足す

`README.md` が「`forbidText` は落ちないまま無力化する」と警告している。追加した直後に、禁止語を戻したら実際に落ちることを一度確認する。確認せずに置くと、対象pathの綴り違い等で検査が無効なまま気づけない。

言い換えと検査を同じphaseへ置くのは、検査が言い換えの完了を担保するためである。分けると、言い換えが漏れたまま検査だけ追加され、validation が落ちて初めて気づくことになる。

---

## Phase 4: 配布versionを上げ、templateから実値の記述を外す

### DoD（完了条件）

- 宣言値4箇所と `expectedRelease` がいずれも `7.4.2` である
- `plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md` の `### version bump` に version の実値が無い
- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出力する

### Tasks

- [x] 5箇所を同時に更新する
  - [x] `plugins/tumeda-dev/.codex-plugin/plugin.json` の `version` を `7.4.2` にする
  - [x] `plugins/tumeda-dev/.claude-plugin/plugin.json` の `version` を `7.4.2` にする
  - [x] `.claude-plugin/marketplace.json` の `version` を `7.4.2` にする
  - [x] `.claude-plugin/marketplace.json` の `plugins[]` 内、`name: tumeda-dev` の `version` を `7.4.2` にする
  - [x] `scripts/verification/validate-plugin.mjs` の `expectedRelease` を `7.4.2` にする

- [x] templateから実値の記述を外す
  - [x] `plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md` の `### version bump` から「現在の宣言値は…」の一行を削る
  - [x] 削除に対応する `forbidText` を `validate-plugin.mjs` へ追加する。禁止語は `現在の宣言値は`

- [x] 検証する
  - [x] `node scripts/verification/validate-plugin.mjs` を実行し `plugin validation passed` を確認する

### 各task詳細

#### templateから実値の記述を外す

`.agents/skills` は `plugins/tumeda-dev/skills` へのsymlinkであり、このrepositoryの context instance は配布される template file そのものである。version の実値を template へ書くと、bump のたびに追随が必要になり、しかも配布先には無意味な値が載る。実値は宣言値4箇所と `expectedRelease` が持つ。

同じ phase へ置くのは、この行を残したまま bump すると一度更新してから削ることになるためである。

#### 5箇所を同時に更新する

区分はPATCHである。今回の変更は既存skillの内容修正とdocsの変更であり、consumerが新たに呼べるものは増えない。新規fileの追加も無い。

`expectedRelease` を宣言値から動的に読ませない。四つが揃ってさえいれば通る状態になり、意図しないversion変更を検知できなくなる。

---

## Phase 5: 品質checkと修正

### DoD（完了条件）

- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出力する
- 変更した全fileについて、`design.md` の受け入れ基準の各項目に対応する確認が済んでいる

### Tasks

- [x] repository全体の検証を実行する
  - [x] repository rootで `node scripts/verification/validate-plugin.mjs` を実行する
  - [x] errorがあれば修正して再実行する
  - [x] `plugin validation passed` を確認する

- [x] hookの出力を確認する
  - [x] `bash .claude/hooks/think_through_session_start.sh | jq -r '.hookSpecificOutput.additionalContext'` を実行し、有効なJSONが返り注入文面に断定が無いことを確認する
  - [x] `bash .claude/hooks/think_through_user_prompt.sh | jq -r '.hookSpecificOutput.additionalContext'` について同じ確認をする

- [x] 受け入れ基準を突き合わせる
  - [x] `design.md` の `### 受け入れ基準` の各項目について、対応する確認結果を提示する

---

## Phase 6: 実測で判明した見落としを塞ぐ

`implementation_review.md` の論点1 の決定を実装する。design 時点の調査が「正本」の自称を二件見落としていた。一件は Phase 3 の実行中に、もう一件は Phase 5 完了後の検証で見つかった。

### DoD（完了条件）

- `plugins/tumeda-dev/skills/README.md` に「正本repository」が無い
- 同 file の相対用法（`状態の正本`）が残っている
- `validate-plugin.mjs` に `plugins/tumeda-dev/skills/README.md` を対象とする `forbidText` がある
- `task-design/SKILL.md` の Step 4 に、対象語の網羅を確認する項目がある
- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出力する

### Tasks

- [x] `skills/README.md` の自称を言い換える
  - [x] `- **escalate-plugin-skill-fix** — …正本repositoryの`steering`へ引き渡すrouting skill。` を、`plugin repository` を使う形へ変える
  - [x] `escalate-plugin-skill-fix/SKILL.md` の言い換えと語が揃っていることを確認する
  - [x] 同 file の `状態の正本` が残っていることを確認する

- [x] `task-design/SKILL.md` へ網羅確認の項目を足す
  - [x] Step 4 の自己レビューの箇条書きへ、対象語を洗い出して置き換える設計では `design.md` の付録の列挙が repository 全体の網羅であることを grep の全出力で確認する項目を追加する
  - [x] 出力を打ち切らないこと、件数を数える command の意味（行数か出現数か）を確認することを含める
  - [x] 「やってしまいがちな失敗」として、grep の出力を `head` で打ち切ったまま全体として扱う例を添える

- [x] 追加した記述と言い換えに対応するassertionを足す
  - [x] `plugins/tumeda-dev/skills/README.md` に対し「正本repository」を禁止する `forbidText` を追加する
  - [x] Step 4 へ足した網羅確認の項目に対する `requireText` を追加する

- [x] 検証する
  - [x] `grep -n 正本repository plugins/tumeda-dev/skills/README.md` が空であることを確認する
  - [x] repository 全体で `grep -rn 正本 --include="*.md"` を `head` を付けずに実行し、残る出現がすべて相対用法であることを目視で確認する
    - 確認の過程で、`plugins/tumeda-dev/skills/maintenance-plugin-context/SKILL.md:16`「修正の議論と変更は正本repositoryで行う。」が相対用法ではない追加の自称であることを発見した。この occurrence は本phaseのDoD・design.mdのどちらにも列挙が無く、`skills/README.md`の言い換えとは対象fileが異なるため、このtasklistの許可された取消完了・実装可能task判定の範囲外である。無断で修正すると「tasklistにない大きな追加実装を勝手に始めない」に抵触するため、このtaskの範囲では修正せず、callerへの報告事項として記録するに留めた
  - [x] `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出力することを確認する

### 各task詳細

#### `skills/README.md` の自称を言い換える

この file は `plugins/tumeda-dev/` 配下であり配布物である。`escalate-plugin-skill-fix/SKILL.md` を `plugin repository` へ言い換えた結果、それを説明する skills README だけが「正本repository」のまま残っており、配布物の中で記述が食い違っている。

#### 検証する

`head` を付けずに repository 全体の grep を取るのは、今回の見落としの直接の原因が出力の打ち切りだったためである。件数の確認にも `grep -c` を使わない。同 command は行数を数えるため、一行に複数出現する file を過小に見積もる。

---

## Documentation reviewと実装後振り返り

- [x] code readingまたは実装で永続化候補を得た場合、その場で`doc-enricher`を提案modeで適用する
  - [x] 提案がある場合だけユーザー承認後に既存READMEまたは既存docsへ反映する（今回の実装は既存design.mdの合意内容を反映するだけであり、code readingから新たに得た永続化候補は無かったため`doc-enricher`提案は無し）
  - [x] 提案・承認判断を別taskへ先送りしない
- [x] 実装、review、validationからfeedbackまたは実装とのずれが生じた場合、`facilitate-discussion`を`implementation_review.md`へ適用する
  - [x] `discussion_directory=<working_dir>`と`discussion_file_name=implementation_review.md`を渡す
  - [x] 原文、関連する実装・design・plan、原因、採用方針、決定を渡し、修正済みでも記録を省略しない
  - [x] 「共有されていなかった知識の前提は何か」を確認する
  - [x] 「codeを読めば分かるか、設計意図か、process不足か」を確認する
  - [x] 「どこに書けば次回この議論が不要になるか」を確認し、合意後だけ反映する
    - `implementation_review.md` 論点1として記録済み。design.mdの付録調査がREADME.mdの1箇所（相対用法寄りの「正本」表現）を見落としていた件について、恒久策の要否（案A: task-design側self-reviewへgrep網羅の一般則を追加 / 案B: 現状のtasklist-executor実測補完で十分）をユーザーへ提示済み、決定は保留中
  - [x] review後に実装を自動再開しない

---

## 動作確認

### DoD

ユーザーが変更後のskill・docsを読み、意図どおりであることを確認した。

### Tasks

- [x] ユーザーに動作確認を依頼する
  - [x] 変更した全fileの差分を提示する
  - [x] とくに `task-design/SKILL.md` の新しい `3-5` と、`escalate-plugin-skill-fix/SKILL.md` の言い換えを確認してもらう（「全部オッケー」）
- [x] feedbackがあれば `facilitate-discussion` を `implementation_review.md` へ適用し、decisionをcallerへ返す
  - [x] designまたはplan構造が変わる場合は同じworking directoryでtask-designへ戻す（論点1 は Phase 6 として plan へ追加、論点2 は追加作業なしで決着）
  - [x] feedbackがなければ `[x] ~~feedback収集~~（feedbackなし）` の形式で完了扱いにする（feedback あり。`implementation_review.md` の論点1・論点2 に記録）

---

## 完了後のaction

> ⚠️ 動作確認phaseが完了するまでcommit、push、mainへの取り込みを促したり実行したりしない。急かすことも禁止する。

- [x] commit（phase単位かつ意味単位で分割）
  - MUST: まとめて一commitにしない
  - phaseごとに別commitにする
  - ユーザーが一部だけ承認した場合は承認範囲だけをcommitし、残りは待つ

- [ ] 作業branchをpushする
  - [ ] commit taskの結果としてlocal commitが実際に一件以上あることを確認する
  - [ ] `git push` を実行する

- [ ] `main` へ取り込む
  - [ ] `escalate-plugin-skill-fix` の `plugin repositoryでの作業完了後の取り込み` が定める4stepに従う。PRを経由しない
  - [ ] 実行前にユーザーの確認を得る
  - [ ] 作業branchをpushする
  - [ ] `main` へ切り替える
  - [ ] 作業branchを `main` へmergeする
  - [ ] `main` をpushする

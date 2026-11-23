# タスクリスト

## 設計参照

- `./design.md`

## 🚨 タスク完全完了の原則

**このfileの全taskが完了するまで作業を継続すること**

### 必須rule

- **すべてのtaskを`[x]`にすること**
- 「時間の都合により別taskとして実施予定」は禁止
- 「実装が複雑すぎるため後回し」は禁止
- host・tool・外部環境が動かないことを理由に完了扱いにすることは禁止
- 未完了task（`[ ]`）を残したまま`completed`を返さない

### taskの取消完了が許可される唯一のcase

合意済みplanの変更によって元taskが不要または別実装へ置換された場合だけ取消完了にできる。取消時は合意と具体的理由を必ず記録する。

```markdown
- [x] ~~task名~~（合意済みplan変更により不要: 具体的な理由）
```

時間不足、難しさ、host停止、tool制限、外部環境未準備は取消理由にしない。これらの場合は`[ ]`を維持し、停止・再開状態を返す。

### tasklistの更新timing（必須）

- **各task・subtaskを実測完了した直後に`[x]`へ更新する**
- phaseが完了したら直ちにphaseの状態も更新する
- phase末や作業末にまとめて更新しない

---

## この repository における「test」の実体

`node scripts/verification/validate-plugin.mjs` が、926行のassertion（`requireText` / `requireExists` / `requireFrontmatter` / `requireAbsent` 等）でskillとdocsの内容を検査する。このrepositoryにはこれ以外のtest framework、lint、formatterが存在しない（root に `package.json`、`Makefile`、CI設定のいずれもない）。

したがって「変更した挙動を担保するtest」は、**validatorへassertionを追加すること**を指す。既存skillはいずれもこの形でassertionを持つ。

---

## Phase 1: repositoryの検証手段と前提がREADMEから分かる

### DoD（完了条件）

- root `README.md` を読んだ人が、検査の正本が `node scripts/verification/validate-plugin.mjs` であり、skill追加時にassertionを足す必要があると分かる。
- symlink構造とその帰結（context instanceの解決手順をこのrepositoryで実行すると配布templateを汚染する）は、`.agents/AGENTS.md` が所有する。root READMEへ重複させない。
- 同じ読者が、skill変更が同一sessionへ反映されないと分かる。

### Tasks

- [x] root `README.md` へ `## 変更時の検証と前提` を追加する
- [x] `migration.md`のセルフチェックを追加箇所へ適用する

### 各task詳細

#### root `README.md` へ `## 変更時の検証と前提` を追加する

対象file: `README.md`

既存の `## 運用契約` の後へ、次のsectionを追加する。

```markdown
## 変更時の検証と前提

- このrepositoryの検査正本は `node scripts/verification/validate-plugin.mjs` である。926行のassertion（`requireText` / `requireExists` / `requireFrontmatter` / `requireAbsent` 等）でskillとdocsの内容を検査する。test framework、lint、formatter、CI設定は他に存在しない。skillを追加・変更したら、対応するassertionをこのfileへ追加する。
- skill内容はsession開始時にcacheされる。skillを変更したsession内では変更が反映されない。変更後のskillで動作を確認するには新しいsessionで起動する。
```

これらは設計前および設計中に確定した事実であり、実装完了を待たずに書ける。`tasklist-design.md`の「設計前に確立済みの知識を記録するdocumentは最初の実装phaseへ置く」に従い、ここへ置く。

配布skill本文へは書かない。利用先repositoryで読まれた時に無関係な情報になるため、repository levelのREADMEが置き場所になる。

確認方法: 追加後のREADMEを通読し、DoDの三点が読み取れることを確認する。

#### `migration.md`のセルフチェックを追加箇所へ適用する

検出語は利用先repository名、所有者名、絶対path、利用先固有のドメイン名、利用先固有のsteering slug。ヒットゼロを確認する。

---

## Phase 2: 新skillが存在し、descriptionだけで起動判断できる

### DoD（完了条件）

- `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md` の`description`だけを読んだ人が、「このpluginの成果物への修正提案が生じた時に起動する」「通常の設計議論や利用先自身のcode修正では起動しない」と判断できる。
- `design.md`の`SKILL.md` 見出し構成にある全見出しが存在する。
- `node scripts/verification/validate-plugin.mjs` が、新skillに対する追加assertionを含めた状態で成功する。

### Tasks

- [x] `skill-creator` skillを適用して`escalate-plugin-skill-fix`を作成する
  - [x] `skill-creator` skillを起動する
  - [x] `design.md`の`新設・変更するfile`にある見出し構成と`description`要件を入力として渡す
  - [x] 生成された`SKILL.md`を実file としてreviewする
- [x] `agents/openai.yaml` を作成する
- [x] validatorへ新skillのassertionを追加する
  - [x] assertionを追加する
  - [x] `node scripts/verification/validate-plugin.mjs` を実行してgreenを確認する
- [x] `migration.md`のセルフチェックを新規fileへ適用する

### 各task詳細

#### `skill-creator` skillを適用して`escalate-plugin-skill-fix`を作成する

対象file: `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md`（新規）

`skill-creator`へ渡す入力は`design.md`の次の二箇所とする。

- `新設・変更するfile` の `SKILL.md` の見出し構成（`## 目的と成果` から `## このskillが絶対にやらないこと` までの9見出し）
- 同節の `description` が満たす要件3点

各見出しが扱う内容は`design.md`の`workflow`（owner表、状態と遷移、必須順序とhandoff、失敗・取消・再開、引き渡し後の前提）から取る。特に次を落とさない。

- `## 起動gate`: 起動条件は「修正提案が生じた」だけとし、正本判定を含めない
- `### 作業対象の切り替え`: working directoryを正本repositoryへ移し、既定branchから作業branchを切る。`steering`は起動時のworking directoryを基準に`.steering/`を解決するため、この移動が作業対象を伝える唯一の手段である
- `### 利用先側に残すもの`: 正本repositoryで扱う旨、正本側steering directoryのbasename、引き渡した提案の要旨一行の三つ
- `## 引き渡し後の前提`: 元taskは中断したまま残る、修正したskillは現在のsessionへ反映されない、旧版のまま続行するか新sessionで再開するかはユーザーが選ぶ
- `## 責務境界`: `facilitate-discussion` / `migration.md` / `maintenance-plugin-context` / `steering` との分界。各ownerの規約を複製せず参照にとどめる

確認方法: 生成された実fileを通読し、上記が読み取れることを確認する。

#### `agents/openai.yaml` を作成する

対象file: `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/agents/openai.yaml`（新規）

内容:

```yaml
interface:
  display_name: "Escalate Plugin Skill Fix"
  short_description: "pluginの成果物への修正提案を正本repositoryのsteeringへ引き渡す"
  default_prompt: "$escalate-plugin-skill-fix を使って、この修正提案を正本repositoryで扱ってください。"
policy:
  allow_implicit_invocation: true
```

依存: 先行taskで`SKILL.md`が確定していること。

理由: 本設計は`description`による暗黙起動を到達性の担保にしている。`facilitate-discussion/agents/openai.yaml` は `allow_implicit_invocation: false` を明示しており、同じ場所で本skillが逆の方針であることを明示する。10skill中3skillだけがこのfileを持つため、暗黙起動の可否が設計上の要点になるskillだけが持つ形になっている。

確認方法: 既存2fileと同じkey構造であることを目視で確認する。

#### validatorへ新skillのassertionを追加する

対象file: `scripts/verification/validate-plugin.mjs`

追加するassertion:

```javascript
const escalateSkill = skillPath("escalate-plugin-skill-fix/SKILL.md");
requireExists(escalateSkill);
requireExists(skillPath("escalate-plugin-skill-fix/agents/openai.yaml"));
for (const heading of [
  "## 起動gate",
  "## 正本repositoryの判定",
  "### 作業対象の切り替え",
  "## 引き渡し後の前提",
  "## 責務境界",
  "## このskillが絶対にやらないこと",
]) {
  requireText(escalateSkill, heading);
}
```

配置は既存skillのassertion群と同じ流れに置く。

確認方法: `node scripts/verification/validate-plugin.mjs` を実行し `plugin validation passed` を確認する。

#### `migration.md`のセルフチェックを新規fileへ適用する

対象: Phase 2で追加した全file。

検出語は利用先repository名、所有者名、絶対path、利用先固有のドメイン名、利用先固有のsteering slug。ヒットゼロを確認する。

---

## Phase 3: 新skillが既存skill群から辿れる

### DoD（完了条件）

- `plugins/tumeda-dev/skills/README.md` の階層構造を読んだ人が、新skillの存在と役割を1行で把握できる。
- `maintenance-plugin-context/SKILL.md` を読んだ人が、利用先で生じた修正提案の引き渡しownerが新skillであると分かる。
- validatorが両fileの記載をassertionで検査し、成功する。

### Tasks

- [x] `maintenance-plugin-context/SKILL.md` へpointerを1行追加する
- [x] `skills/README.md` の階層構造へ1行追加する
- [x] validatorへ両fileのassertionを追加する
  - [x] assertionを追加する
  - [x] `node scripts/verification/validate-plugin.mjs` を実行してgreenを確認する

### 各task詳細

#### `maintenance-plugin-context/SKILL.md` へpointerを1行追加する

対象file: `plugins/tumeda-dev/skills/maintenance-plugin-context/SKILL.md`

`## Maintenance policies` のlist末尾へ追加する。

> - 利用先repositoryでこのpluginの成果物への修正提案が生じた場合の引き渡しは`escalate-plugin-skill-fix`が所有する。修正の議論と変更は正本repositoryで行う。

手順本体を複製せず、所有者を示す1行にとどめる。

#### `skills/README.md` の階層構造へ1行追加する

対象file: `plugins/tumeda-dev/skills/README.md`

`## 階層構造` の `doc-enricher` と `maintenance-plugin-context` の間へ追加する。

> - **escalate-plugin-skill-fix** — 利用先repositoryで生じたこのpluginの成果物への修正提案を、正本repositoryの`steering`へ引き渡すrouting skill。

README自身の方針「詳細は書かず、見出し1行の追加・削除で済むように保つ」に従う。

#### validatorへ両fileのassertionを追加する

対象file: `scripts/verification/validate-plugin.mjs`

```javascript
requireText(skillPath("README.md"), "escalate-plugin-skill-fix");
requireText(
  skillPath("maintenance-plugin-context/SKILL.md"),
  "escalate-plugin-skill-fix",
);
```

既存の `requireText(skillPath("README.md"), "facilitate-discussion");` と同じ流れに置く。

---

## Phase 4: 既commit分の利用先固有情報が除去されている

### DoD（完了条件）

- `.steering/2026/202608/20260801-extract-discussion-workflow-skill/implementation_review.md` に対する`migration.md`のセルフチェックgrepが、利用先repository名と利用先固有steering slugを検出しない。

### Tasks

- [x] `implementation_review.md` の2行を総称表現へ置換する
- [x] セルフチェックgrepでヒットゼロを確認する

### 各task詳細

#### `implementation_review.md` の2行を総称表現へ置換する

対象file: `.steering/2026/202608/20260801-extract-discussion-workflow-skill/implementation_review.md`

3箇所が2行に含まれる。

| 現在 | 置換後 |
| --- | --- |
| `` `{利用先repository名}` repositoryのsteering directory `.steering/2026/202608/{利用先固有slug}/discussion.md` `` | 利用先repositoryのsteering directoryにある`discussion.md` |
| `` `{利用先repository名}` repository固有の知識不足でも `` | 利用先repository固有の知識不足でも |

ユーザー発言の引用ブロックと、既に追加済みの採番注記は変更しない。

依存: なし。Phase 2・3と独立して検証できる。

#### セルフチェックgrepでヒットゼロを確認する

検出語は利用先repository名、所有者名、絶対path、利用先固有のドメイン名、利用先固有のsteering slug。

このphaseにvalidator assertionを追加しない。`forbidText` helperで検出語を固定しようとすると、検出語である利用先repository名を`validate-plugin.mjs`へ書き込むことになり、`migration.md`が禁じている当のもの（公開配布物への利用先固有情報の混入）を作ってしまう。検査手段はcommit前の手動grepにとどめる。

---

## Phase 5: 配布versionが揃い、validatorが通る

### DoD（完了条件）

- 宣言値四箇所と`expectedRelease`がすべて `7.2.0` になっている。
- `node scripts/verification/validate-plugin.mjs` が成功する。

### Tasks

- [x] 五箇所を `7.2.0` へ更新する
- [x] validatorを実行してgreenを確認する

### 各task詳細

#### 五箇所を `7.2.0` へ更新する

対象file:

1. `plugins/tumeda-dev/.codex-plugin/plugin.json` の `version`
2. `plugins/tumeda-dev/.claude-plugin/plugin.json` の `version`
3. `.claude-plugin/marketplace.json` の `version`
4. `.claude-plugin/marketplace.json` の `plugins[]` 内 `tumeda-dev` の `version`
5. `scripts/verification/validate-plugin.mjs` の `expectedRelease`（98行目付近）

区分の根拠: 新skillの追加は後方互換な機能追加であり、SemVerのMINORに当たる。`7.1.0` → `7.2.0`。

このbumpは、本branchの変更に加えて、`main`に既にある未release の3commit（discussion開始判定の予測条件除去、`presenting_options.md`の補助節追加、`implementation_review.md`への記録）も同時に配布する。それらは単独ではPATCH相当だが、同一releaseに含まれるためMINORへ吸収される。「配布する変更には、変更内容に見合うversion bumpを一度だけ行う」に従い、bumpは一度だけ行う。

依存: Phase 2・3・4の変更範囲が確定していること。

---

## Phase 6: 品質checkと修正

### DoD（完了条件）

- `node scripts/verification/validate-plugin.mjs` が成功する。
- 本branchで追加・変更した全fileに対する`migration.md`のセルフチェックgrepが、利用先固有情報を検出しない。

> このrepositoryにはlint、formatter、CI設定が存在しない。repository全体の検査手段はvalidatorだけである。UI変更がないため、screenshot確認は行わない。

### Tasks

- [x] validatorをrepository全体に対して実行する
  - [x] `node scripts/verification/validate-plugin.mjs` を実行する
  - [x] errorがあれば修正して再実行する
  - [x] `plugin validation passed` を確認する
- [x] 本branchで追加・変更した全fileへセルフチェックgrepを適用する
  - [x] `git diff --name-only main...HEAD` で対象fileを列挙する
  - [x] 各fileへ検出語のgrepを実行する
  - [x] ヒットがあれば総称表現へ置換して再実行する
  - [x] ヒットゼロを確認する

---

## Documentation reviewと実装後振り返り

- [x] ~~code readingまたは実装で永続化候補を得た場合、その場でdoc-enricherを提案modeで適用する~~（永続化候補なし: design.mdに従い過不足なく実装し、追加で記録すべき新規事実は生じなかった）
- [x] ~~実装、review、validationからfeedbackまたは実装とのずれが生じた場合、直接受領したworkflow ownerがpluginの`facilitate-discussion`を`implementation_review.md`へ適用する~~（ずれなし: 全task・DoDがdesign.md/tasklist.mdの記述どおりに実装・検証できた）

---

## 動作確認

### DoD

ユーザーが実際に新skillの記述を読み、意図どおりであることを確認した。

### Tasks

- [x] ユーザーに動作確認を依頼する
  - [x] `escalate-plugin-skill-fix/SKILL.md` の全文を提示する
  - [x] `description` だけで起動判断ができるかを確認してもらう
- [x] ~~feedback収集~~（feedbackなし。descriptionと本文はそのまま採用）

---

## 完了後のaction

> ⚠️ 動作確認phaseが完了するまでcommit、push、merge、pushを促したり実行したりしない。急かすことも禁止する。

- [x] commit計画をユーザーへ提示して合意を得る
  - [x] phase単位かつ意味単位で分割した計画を示す
  - [x] version bumpを独立commitにする
  - [x] ユーザーが一部だけ承認した場合は承認範囲だけをcommitする

- [x] 合意された計画でcommitする
  - MUST: まとめて一commitにしない
  - ユーザーが不要と回答した場合は`[x] ~~commit~~（ユーザーが不要と回答）`の形式で完了扱いにする

- [x] branchをpushする
  - [x] commit taskの結果としてlocal commitが実際に一件以上あることを確認する。一件もなければpushを実行しない
  - [x] current branchが既定branchでないことを確認する
  - [x] `git push -u origin feature/route-skill-feedback-to-plugin-steering` を実行した

- [x] localで`main`へmergeして`main`をpushする
  - [x] `main`へ切り替える
  - [x] 本branchをmergeする
  - [x] `node scripts/verification/validate-plugin.mjs` をmerge後に再実行してgreenを確認する
  - [x] `git push origin main` を実行する

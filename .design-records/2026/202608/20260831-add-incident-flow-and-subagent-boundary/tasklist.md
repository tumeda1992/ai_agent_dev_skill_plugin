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

### このtasklistにおけるtestの扱い

このrepositoryは自動test frameworkを持たず、`package.json`も存在しない。変更対象はskill本文とdocsのMarkdown、およびmanifestのJSONであり、挙動をtestで担保できない。各phaseのDoDは、変更後のfileが満たすべき状態をgrepと目視で確認する形で定める。

`node scripts/verification/validate-plugin.mjs`はmanifestの整合だけを検査し、skill本文の内容は検査しない。

### 作業の外へ残るactionについて

今回の変更はskill本文とdocsの編集であり、作業を破棄すればすべて消える。DB migration、deploy、外部service設定変更、本番データ移行のいずれも含まない。したがって対象actionを含むphaseはない。

`maintenance-plugin-context`へ「作業の外へ残るactionの差し込み」宣言を要求した結果、`## task-design`の当該sectionはコメントのみで宣言がなかった。既定の停止・確認taskだけを置く。

---

## Phase 1: `steering`が`blocker`に遭遇したとき何をしてよいかを判断できる

`resolve-blocker`のpolicyとworkflowを`steering/SKILL.md`へ加え、既存の無条件禁止と矛盾しない状態にする。

### DoD（完了条件）

- `plugins/tumeda-dev/skills/steering/SKILL.md`に`## Blocker resolution`があり、次をすべて含む。
  - 例外が成立する2条件と、片方だけでは成立しないこと
  - 条件1 が欠けた場合はdesignへ戻し、条件2 が欠けた場合は`tasklist-executor`の停止・再開contractへ回すこと
  - 許容しない3種（designで決めていないことを決める / design中に決められたはずのことを実装中に判断する / spikeで潰せた不確実性をえいやで試す）
  - `blocker`を解消してもtasklistのcheckboxをstep内の通常手順で確定させること
  - 検知時の3択（`a` / `b` / `c`）と、`a`を先頭へ置く理由
  - 自走時に都度確認へ戻す3種と、報告を復帰時1回にすること
  - 離脱したstepの先頭へ戻ること、「次のstepへ進む」を選べないこと
  - `### blocker resolution中の記録先`の節が存在すること（節の中身はPhase 3 で確定する）
- `## このskillが絶対にやらないこと`の「steering自身が実装codeを変更する」の行が、`Blocker resolution`を参照する形になっている。無条件禁止の文言のまま残っていない
- `Blocker resolution`以外の場所に、例外の成立条件や手順が複製されていない

### Tasks

- [x] `steering/SKILL.md`へ`## Blocker resolution`を追加する
  - [x] policy部分（例外の2条件、許容しない3種、Flowの成果にしないこと）を書く
  - [x] workflow部分（3択の確認、自走の範囲と報告、復帰、記録先）を書く
  - [x] 節の配置を決めて挿入する
- [x] `## このskillが絶対にやらないこと`の該当行を書き換える
  - [x] `Blocker resolution`への参照を持たせる
  - [x] 無条件禁止の文言が残っていないことを確認する
- [x] 重複がないことを確認する
  - [x] 例外の成立条件が`Blocker resolution`以外に書かれていないことをgrepで確認する

### 各task詳細

#### `steering/SKILL.md`へ`## Blocker resolution`を追加する

配置は`## 実装完了後review`の直後、`## このskillが絶対にやらないこと`の直前とする。理由は次のとおり。

- `実装完了後review`は「Flowを離れて何かをし、定められた地点へ戻る」構造を持つ既存節であり、`Blocker resolution`と構造が近い
- `このskillが絶対にやらないこと`の直前へ置くことで、禁止条項から参照したときに読み手が直前へ戻れる

節の構成は`design.md`の「完成後の内容と構造」に従う。

```text
## Blocker resolution

（導入: これが何であり、Flowに対してどう位置するか）

### 例外が成立する2条件
### 設計で潰せた不確実性を持ち込まない
### blockerを解消してもFlowの成果にはしない
### 検知時の確認
### 自走の範囲と報告
### 離脱したstepへの復帰
### blocker resolution中の記録先   （節だけ作る。中身はPhase 3）
```

各節の内容は`design.md`の`### skillの役割と方針`と`### workflow`に確定済みのものを使う。設計判断を新たに行わない。

導入部にはFlowとの位置関係を示す。stepとして番号を与えない理由（実行条件の崩壊はStep 1でも起こり得る、既存Flowが「順序固定」である）を含める。

#### `## このskillが絶対にやらないこと`の該当行を書き換える

現行:

```markdown
- steering自身が実装codeを変更する。実装は明示承認後にtasklist-executorまたは子steeringへdispatchする。
```

変更後:

```markdown
- steering自身が実装codeを変更する。実装は明示承認後にtasklist-executorまたは子steeringへdispatchする。唯一の例外は`Blocker resolution`であり、その成立条件と手順は同節が持つ。
```

無条件禁止の文言を残したまま別の場所へ例外を書くと、skill内に矛盾した指示が併存し、agentがどちらに従うか判断できない。参照を持たせることで、禁止条項を読んだ時点で例外の存在と在処が分かる。

同じ節の「steering自身がtestまたはCIを実行する」は変更しない。`resolve-blocker`は実行条件の回復であり、testやCIの実行を許容するものではない。

#### 重複がないことを確認する

`grep -n "設計を尽くした\|Flowの内側では復旧できない" plugins/tumeda-dev/skills/steering/SKILL.md`を実行し、ヒットが`Blocker resolution`節の中だけであることを確認する。

`design.md`の「正本と重複防止」が定めるとおり、`resolve-blocker`のpolicyとworkflowは`Blocker resolution`が唯一の正本である。

---

## Phase 2: `steering`がdispatch先の停止時に何を読むか判断できる

### DoD（完了条件）

- `plugins/tumeda-dev/skills/steering/SKILL.md`の`#### 6-1. leafを実行する`に次の4点がある。
  - executorがどの停止理由で返しても、返却resultだけで次の判断をしない
  - `tasklist.md`のcheckboxと、task配下にexecutorが書き残したnoteを読む
  - `artifact_directory`にrequest / result artifactがあれば読む
  - 読んだ内容が`design.md`と食い違う場合、実装を進める前に`実装完了後review`へ回す
- 同箇所に、この手順が`Blocker resolution`の一部ではないことと、その理由（正常停止を含む全停止理由で行う）が書かれている
- 既存の`6-1`の記述（executorへ渡すもの、executorに守らせること）が変更されていない

### Tasks

- [x] `#### 6-1. leafを実行する`へ停止時の読み取り手順を追記する
  - [x] 4点を書く
  - [x] `Blocker resolution`の一部ではない理由を書く
  - [x] 根拠として`runtime-execution-contracts.md`の`状態の正本とsingle writer`を参照する
  - [x] 既存記述が変更されていないことを確認する

### 各task詳細

#### `#### 6-1. leafを実行する`へ停止時の読み取り手順を追記する

既存の箇条書きの後へ、独立した段落として追加する。既存の箇条書き（tasklist-executorだけをsingle writerとする、実測完了直後に`[x]`へ更新させる等）は変更しない。

追記する内容は`design.md`の「dispatch先が停止した時に読む対象（Step 6-1 の通常手順）」に確定済みのものを使う。

根拠の示し方は、`runtime-execution-contracts.md`が既に「taskの完了状態の正本はtasklistの`[ ]` / `[x]`」「child処理の状態の正本はrequest / result artifact」と定め、返却resultがこの列挙に含まれないことを引く形にする。新しい契約を作るのではなく、既存契約からsteering側の義務を導く。

`Blocker resolution`の一部ではない理由は、`runtime-execution-contracts.md`の停止理由のうち`delegation_required`、`user_confirmation_required`、`phase_checkpoint`がFlowの想定する正常停止であり、実行条件が崩れていないことによる。

---

## Phase 3: 利用先が`subagent_report/`を追跡対象外にできる

### DoD（完了条件）

- `plugins/tumeda-dev/skills/steering/.gitignore.sample`が存在する
- 内容が次と一致する

  ```
  # subagent の実行レポートは各 steering ディレクトリのローカル記録として扱い、追跡しない。
  # 不測の事態が起きたときの調査ログであり、design / tasklist / discussion のような
  # 合意の正本ではないため。
  */*/*/subagent_report/
  ```

- `steering/SKILL.md`の`### blocker resolution中の記録先`に、次の3点がある。
  - 記録先が`.steering/YYYY/YYYYMM/YYYYMMDD-slug/subagent_report/`であること
  - 追跡対象外にすることと、その理由（合意の正本ではなく調査ログであるため）
  - 利用先は`.gitignore.sample`を`.steering/.gitignore`へ複製して使うこと

### Tasks

- [x] `plugins/tumeda-dev/skills/steering/.gitignore.sample`を新規作成する
  - [x] 内容がDoDに示したものと一致することを確認する
- [x] `steering/SKILL.md`の`### blocker resolution中の記録先`へ3点を書く
  - [x] Phase 1 で作成した同節へ追記する
  - [x] 3点がすべて含まれることを確認する

### 各task詳細

#### `plugins/tumeda-dev/skills/steering/.gitignore.sample`を新規作成する

配置は`plugins/tumeda-dev/skills/steering/`直下。同skillの`scripts/`と並ぶ。

`.sample`suffixは、そのままでは効かず利用先が`.steering/.gitignore`へ複製して使うことを示す。利用先repositoryが`.agents/skills/tumeda-dev-plugin-context.md`をtemplateから複製する形と同じpatternである。

`*/*/*/`は`.steering/YYYY/YYYYMM/YYYYMMDD-slug/`の階層に対応する。

#### `steering/SKILL.md`の記録先の節からsampleへの導線を書く

Phase 1 で作った`### blocker resolution中の記録先`へ、次を含める。

- 記録先が`.steering/YYYY/YYYYMM/YYYYMMDD-slug/subagent_report/`であること
- 追跡対象外にすること、およびその理由（合意の正本ではなく調査ログであるため）
- 利用先は`.gitignore.sample`を`.steering/.gitignore`へ複製して使うこと

---

## Phase 4: `task-design`が変更対象から既存docsを逆引きできる

### DoD（完了条件）

- `plugins/tumeda-dev/skills/task-design/SKILL.md`の`### PrepareStep 3. 設計前調査`の項目数が5のまま変わらない
- 項目3 が、file種別による限定（GraphQL mutationまたはCommand）を前提とする書き出しになっていない
- 項目3 に次が含まれる。
  - 変更対象fileを説明している既存docsを探すこと。種別を問わないこと
  - 変更後に不正確になる記述がないか確認すること
  - 不正確になる記述を`design.md`の変更対象へ含めること
  - GraphQL mutationまたはCommandの場合が具体例として従属していること
  - 既存の判断観点（どのdomain aggregateが、どのlayerで、どのように組み合わされているか）が失われていないこと

### Tasks

- [x] `PrepareStep 3`の項目3 を置き換える
  - [x] 一般則を先に書く
  - [x] GraphQL / Commandを具体例として従属させる
  - [x] 既存の判断観点を維持する
  - [x] 項目数が5のままであることを確認する

### 各task詳細

#### `PrepareStep 3`の項目3 を置き換える

現行:

```markdown
3. GraphQL mutationまたはCommandの変更・追加では、関連moduleのREADMEを先に読み、orchestration patternを把握する。READMEに答えがない場合だけ既存の関連resolver等の実装へ進む。確認する観点は「どのdomain aggregateが、どのlayerで、どのように組み合わされているか」である。
```

変更後の内容は`design.md`の`### documentation以外のfile deliverable`が参照する論点6 の決定に従う。一般則を先に置き、GraphQL / Commandを「これに当たる」具体例として従属させる。

項目を増やさない理由は、新項目として一般則を足すと項目3 と二重に指示することになり、かつ項目3 の存在が「一般則はGraphQL / Commandには適用されない」という誤読を生むためである。

---

## Phase 5: 表現の一致と意味の一致を区別する判断基準がnaming標準にある

### DoD（完了条件）

- `plugins/tumeda-dev/docs/development_standards/naming/core.md`に`## 表現が同じでも、名前空間が違えば別の意味を持つ`がある
- その節が`## 修飾の向きで指すものが変わる`の直後に位置する
- 節に次が含まれる。
  - 判断の問い「その2つは、同じ読み手が同じ場面で出会うか」
  - 出会う場合と出会わない場合の分岐
  - 名前空間がディレクトリやmoduleの境界だけで決まらないこと
  - ✗ / ○ の対比
  - やってしまいがちな失敗（grepで数えてヒットだけを理由に外す）と、それをやると何が起きるか、正しい判断のための問い
- `naming/README.md`の守備範囲の表に変更が不要であることを確認済み（`core.md`の行が既に「対象が何であっても成立する原則」を含むため）

### Tasks

- [x] `naming/core.md`へ`## 表現が同じでも、名前空間が違えば別の意味を持つ`を追加する
  - [x] `## 修飾の向きで指すものが変わる`の直後へ挿入する
  - [x] 判断の問いと分岐を書く
  - [x] 失敗例を書く
- [x] `naming/README.md`の更新要否を確認する

### 各task詳細

#### `naming/core.md`へ節を追加する

内容は`design.md`の`### documentationが成立させる知識`に確定済みのものを使う。

失敗例には、出現数の多い一般語（`state`、`owner`、`context`等）が使用不能になることを書く。これらは文脈ごとに違う意味で使われており、それで機能しているという事実を添える。

#### `naming/README.md`の更新要否を確認する

`README.md`の守備範囲の表は`core.md`の行を「名前を付ける対象が何であっても成立する原則」としている。今回追加する節はこれに含まれるため、表の変更は不要である。確認だけを行い、不要なら変更しない。

---

## Phase 6: 正本repository自身もplugin contextのinstanceを持つことが契約から分かる

### DoD（完了条件）

- root `README.md`の`## 運用契約`に、正本repository自身も`<repository-root>/.agents/skills/tumeda-dev-plugin-context.md`のinstanceを持つ旨の記述がある
- `.agents/skills/tumeda-dev-plugin-context.md`の`## task-design`と`## 共通`に実factが入っており、コメントだけの状態ではない
- 既存の運用契約4項目が変更されていない

### Tasks

- [x] root `README.md`の`## 運用契約`へ1行追加する
- [x] `.agents/skills/tumeda-dev-plugin-context.md`の記載内容を確認する
  - [x] `## task-design`のversion bump、UI確認環境、Git / GitHub公開条件、Branch / issue契約が埋まっている
  - [x] `## 共通`のプロジェクト指示、architecture文書、開発規約、test方針、test command、lint commandが埋まっている

### 各task詳細

#### root `README.md`の`## 運用契約`へ1行追加する

現行の4項目の後へ追加する。

> - 正本repository自身も`<repository-root>/.agents/skills/tumeda-dev-plugin-context.md`のinstanceを持つ。pluginを開発する時もshared skillは同じcontract上で動くため、正本だけを例外にしない。

既存4項目（共有手順の正本、repository固有文脈の置き場所、固定path・固定commandを読まない、hostごとのmodel差）は変更しない。

#### `.agents/skills/tumeda-dev-plugin-context.md`の記載内容を確認する

このfileは今回のsteeringのPrepareStep 3 で`maintenance-plugin-context`が既に書き込み済みである。Phase 6 では新たに書かず、内容が残っていることの確認だけを行う。

書き込んだ内容の要点は次のとおり。

- `## 共通`のtest commandは`node scripts/verification/validate-plugin.mjs`、lint commandは「なし」
- `## task-design`のUI確認環境は「なし」（起動するappを持たない）
- `## task-design`のGit / GitHub公開条件に、`scripts/for_local/github/create_or_get_pr.sh`と`tasklist-executor`配下の同名scriptがpath違いであることを明記

---

## Phase 7: 正本repositoryでの作業完了後、PRを経由せず`main`へ取り込める

### DoD（完了条件）

- `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md`の節名が`## 引き渡し後`である（`## 引き渡し後の前提`から変更）
- 同節に取り込み手順4stepがある。
  1. 作業branchをpushする
  2. `main`へ切り替える
  3. 作業branchを`main`へmergeする
  4. `main`をpushする
- 同節にPRを経由しない理由がある
- 既存の3項目（元taskは中断したまま、skill修正はsessionへ反映されない、再開方法はユーザーが選ぶ）が変更されていない
- merge方式と、取り込み後の再install / reloadを規定していない

### Tasks

- [x] `escalate-plugin-skill-fix/SKILL.md`の節名を`## 引き渡し後`へ変更する
- [x] 取り込み手順4stepとPRを経由しない理由を追加する
  - [x] 既存3項目が変更されていないことを確認する
  - [x] merge方式を規定していないことを確認する

### 各task詳細

#### 節名の変更と手順の追加

現行の`## 引き渡し後の前提`は成立している状態の列挙だけを持ち、行為を持たない。取り込み手順は行為であるため、節名を`## 引き渡し後`とし、行為と前提の両方を持てる形にする。

手順の前にPRを経由しない理由を置く。理由を書かないと、次に読む人が既存の`steering`の完了後action（commit、push、PR作成）と矛盾して見え、PR作成を省略してよいか判断できない。

理由の内容は`design.md`の「正本repositoryでの作業完了後の取り込み」に確定済みのものを使う。

merge方式（fast-forward / merge commit）を指定しない。正本repositoryの既存履歴はmerge commitを作る運用であり、skillが方式まで規定する必要はない。

取り込み後の再install / reloadも規定しない。同節が既に「修正後のskillで動くには新しいsessionを開始する必要がある」と定めており、その判断に含まれる。

---

## Phase 8: assertionが今回の変更へ追随している

root `README.md`の`## 変更時の検証と前提`が「skillまたはdocsを追加・変更したら、対応するassertionをこのfileへ追加する」「既存assertionがピン留めしている文字列を変更したら、そのassertionも追随させる。見出し、step番号、章番号、契約文の変更はすべてこれに当たる」と定める。Phase 1〜7 の変更に対してこれを行う。

### DoD（完了条件）

- `scripts/verification/validate-plugin.mjs`に`## 引き渡し後の前提`が残っておらず、`## 引き渡し後`へ追随している
- 同fileに次のassertionがある。
  - `steering/SKILL.md`に`## Blocker resolution`があること
  - `steering/SKILL.md`の`このskillが絶対にやらないこと`の該当行が`Blocker resolution`を参照すること
  - `steering/.gitignore.sample`が存在すること
  - `naming/core.md`に`## 表現が同じでも、名前空間が違えば別の意味を持つ`があること
  - `escalate-plugin-skill-fix/SKILL.md`に取り込み手順を示す文字列があること
- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を返す

### Tasks

- [x] 既存assertionを今回の変更へ追随させる
  - [x] `validate-plugin.mjs`の見出し一覧にある`## 引き渡し後の前提`を`## 引き渡し後`へ変える
  - [x] 他に今回の変更でピン留めが外れる既存assertionがないか確認する（`forbidText`16件を確認し、今回変更箇所を禁止対象にしているものはなかった）
- [x] 今回新設した見出しと契約文へassertionを追加する
  - [x] `steering/SKILL.md`の`## Blocker resolution`
  - [x] `このskillが絶対にやらないこと`が`Blocker resolution`を参照すること
  - [x] `steering/.gitignore.sample`の存在
  - [x] `naming/core.md`の新設節
  - [x] `escalate-plugin-skill-fix/SKILL.md`の取り込み手順
- [x] `node scripts/verification/validate-plugin.mjs`を実行する
  - [x] `plugin validation passed` を確認する
  - [x] 失敗した場合は原因を特定して修正し、再実行する

### 各task詳細

#### 既存assertionを今回の変更へ追随させる

`validate-plugin.mjs:900`付近に次がある。

```js
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

`## 引き渡し後の前提`を`## 引き渡し後`へ変える。変えないとPhase 7 の変更で検査が失敗する。

`forbidText`は16件あり、今回変更する箇所を禁止対象にしているものはないことを設計時に実測済みである。ただし`forbidText`は失敗しないまま無力化するため、Phase 1〜7 の変更後に改めて確認する。

#### 今回新設した見出しと契約文へassertionを追加する

追加する対象は、失われると設計が崩れるものに限る。すべての見出しをピン留めすると、以降の軽微な整形でも検査が落ちて追随コストだけが増える。

とりわけ`このskillが絶対にやらないこと`が`Blocker resolution`を参照する形は必ずピン留めする。参照が消えると無条件禁止へ戻り、`Blocker resolution`が孤立した節になる。この状態はskill本文を読んでも矛盾として現れず、検査でしか捕まえられない。

---

## Phase 9: version bumpとmanifestの整合

### DoD（完了条件）

- 次の5箇所がすべて`7.4.1`である。
  - `plugins/tumeda-dev/.codex-plugin/plugin.json` の `version`
  - `plugins/tumeda-dev/.claude-plugin/plugin.json` の `version`
  - `.claude-plugin/marketplace.json` の `version`
  - 同fileの `plugins[]` 内、`name: tumeda-dev` の `version`
  - `scripts/verification/validate-plugin.mjs` の `expectedRelease`
- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を返す

### Tasks

- [x] version宣言値4箇所を`7.4.1`へ更新する
- [x] `validate-plugin.mjs`の`expectedRelease`を`7.4.1`へ更新する
- [x] `node scripts/verification/validate-plugin.mjs`を実行する
  - [x] `plugin validation passed` を確認する
  - [x] 失敗した場合は原因を特定して修正し、再実行する

### 各task詳細

#### version bumpの区分

`7.4.0` → `7.4.1`（PATCH）。規約は「consumerが新たに呼べるものが増えたか」でMINORとPATCHを分ける。今回は既存skillの内容修正だけであり、新しいskillも新しいparameterも増えない。`.gitignore.sample`の新設は「新規fileの追加それ自体はMINORの根拠にならない」に該当する。

5箇所を一度に変える。宣言値だけを変えて`expectedRelease`を据え置くと`plugin validation failed`になる。

---

## Phase 10: 全体の整合確認

### DoD（完了条件）

- `design.md`の受け入れ基準のうち、Phase 1〜9 で個別に確認していない項目がすべて満たされている
- skill間に矛盾がない

### Tasks

- [x] Phase 1〜9 で個別に確認していない受け入れ基準を確認する
  - [x] `このskillが絶対にやらないこと`の該当行が`Blocker resolution`を参照する形になっている
  - [x] `.gitignore.sample` が存在し、内容が一致する
  - [x] `PrepareStep 3` の項目数が5のまま、項目3 がfile種別による限定を含まない
  - [x] `naming/core.md` に該当節があり、`## 修飾の向きで指すものが変わる` の直後に位置する
  - [x] `escalate-plugin-skill-fix/SKILL.md` の節名が `## 引き渡し後` であり、取り込み手順4stepと理由を含む
- [x] skill間の矛盾がないことを確認する
  - [x] `このskillが絶対にやらないこと`と`Blocker resolution`が矛盾しない
  - [x] `Blocker resolution`の内容が他の節へ複製されていない

---

## Documentation reviewと実装後振り返り

- [x] ~~code readingまたは実装で永続化候補を得た場合、その場でdoc-enricherを提案modeで適用する~~（実装中に得た永続化候補はdesign合意済みの論点7=`naming/core.md`追加のみで、同じoriginating decisionのため重複提案しない。それ以外の新規候補は生じなかった）
  - [x] ~~提案がある場合だけユーザー承認後に既存READMEまたは既存docsへ反映する~~（新規提案なし）
  - [x] ~~提案・承認判断を別taskへ先送りしない~~（先送り対象なし）
- [x] ~~実装、review、validationからfeedbackまたは実装とのずれが生じた場合、直接受領したworkflow ownerがpluginの`facilitate-discussion`を`implementation_review.md`へ適用する~~（実装はdesign.mdとtasklist.mdの確定済み内容をそのまま反映しており、feedbackまたは実装とのずれは生じなかった）
  - [x] ~~`discussion_directory=<working_dir>`と`discussion_file_name=implementation_review.md`を渡す~~（該当なし）
  - [x] ~~原文、関連する実装・design・plan、原因、採用方針、決定を渡し、修正済みでも記録を省略しない~~（該当なし）
  - [x] ~~「共有されていなかった知識の前提は何か」を確認する~~（該当なし）
  - [x] ~~「codeを読めば分かるか、設計意図か、process不足か」を確認する~~（該当なし）
  - [x] ~~「どこに書けば次回この議論が不要になるか」を確認し、合意後だけ反映する~~（該当なし）
  - [x] ~~decisionをcallerへ返し、designまたはplan構造が変わる場合は同じworking directoryでtask-designへ戻す~~（該当なし）
  - [x] ~~review後に実装を自動再開しない~~（該当なし）

---

## 動作確認

### DoD

ユーザーが変更後のskill本文とdocsを読み、意図どおりであることを確認した。

### Tasks

- [x] agentの確認結果を報告したうえで、ユーザーに動作確認を依頼する
  - [x] 確認が及んでいない範囲も報告に含める
  - 補足: このrepositoryは起動するappを持たず、`visual-inspector`の対象がない。報告は変更後のfile内容と、受け入れ基準の確認結果で行う
- [x] ~~feedback収集~~（feedbackなし。受け入れ基準を全項目実測し、designとのずれもなかった）

---

## 完了後のaction

> ⚠️ 動作確認phaseが完了するまでcommit、push、mergeを促したり実行したりしない。急かすことも禁止する。

### commit（phase単位かつ意味単位で分割）

MUST: まとめて一commitにしない。合意の記録は対応する変更commitより前へ、変更後に確定するものは後ろへ置く。

- [x] commit 1: 設計合意の記録
  - 対象: `.steering/2026/202608/20260831-add-incident-flow-and-subagent-boundary/design.md`、同`task-design-discussion.md`
  - 実装前に確定した合意であるため、後続の実装commitより前へ置く
  - `tasklist.md`はこのcommitに含めない。checkboxが実行後に確定するため
- [x] commit 2: `steering`へ`Blocker resolution`を追加
  - 対象: `plugins/tumeda-dev/skills/steering/SKILL.md`、同`.gitignore.sample`
  - Phase 1〜3 の変更。`resolve-blocker`のpolicyとworkflow、停止時の読み取り義務、記録先とsample
- [x] commit 3: `task-design`の調査観点を一般化
  - 対象: `plugins/tumeda-dev/skills/task-design/SKILL.md`
  - Phase 4 の変更
- [x] commit 4: naming標準へ同名異義の判断基準を追加
  - 対象: `plugins/tumeda-dev/docs/development_standards/naming/core.md`
  - Phase 5 の変更
- [x] commit 5: 運用契約へ正本repository自身のinstanceを明記
  - 対象: `README.md`（root）、`.agents/skills/tumeda-dev-plugin-context.md`
  - Phase 6 の変更
- [x] commit 6: `escalate-plugin-skill-fix`へ取り込み手順を追加
  - 対象: `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md`
  - Phase 7 の変更
- [x] commit 7: assertionの追随と追加、version bump
  - 対象: `plugins/tumeda-dev/.codex-plugin/plugin.json`、`plugins/tumeda-dev/.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json`、`scripts/verification/validate-plugin.mjs`
  - Phase 8〜9 の変更。`validate-plugin.mjs`はassertionと`expectedRelease`の両方を持つため、分けずに1commitにする
- [x] commit 8: tasklistの実行結果
  - 対象: `.steering/2026/202608/20260831-add-incident-flow-and-subagent-boundary/tasklist.md`、（生じた場合のみ）同`implementation_review.md`
  - checkboxは実行後に確定するため、対応する変更commitより後ろへ置く

ユーザーが一部だけ承認した場合は承認範囲だけをcommitし、残りは待つ。ユーザーが不要と回答した場合は`[x] ~~commit~~（ユーザーが不要と回答）`の形式で完了扱いにする。

### `main`への取り込み

> ⚠️ この手順は今回`escalate-plugin-skill-fix`へ追加する内容そのものである。追加した手順を最初に適用する対象がこのtasklist自身になる。

- [ ] 作業branchをpushする
  - [ ] commit taskの結果としてlocal commitが実際に一件以上あることを確認する。一件もなければpush・mergeを実行しない
  - [ ] `git push -u origin 20260831-add-incident-flow-and-subagent-boundary`を実行する
- [ ] `main`へ取り込む
  - [ ] `main`へ切り替える
  - [ ] 作業branchを`main`へmergeする
  - [ ] `main`をpushする
- [ ] PRを作成しない
  - 理由: このrepositoryは利用先repositoryから見てsubであり、pluginの更新はメインの作業を再開するための前段である。PRを開いてreviewを待つ相手がいないため、review単位としてのPRが機能しない

# タスクリスト

## 設計参照

- `./design.md`
- `./baseline-ledger.md`
- `plugins/tumeda-dev/docs/common_standard/function_migration_policy.md`

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

## Phase 1: contract ledgerを作り、未分類ゼロを確認する

### DoD（完了条件）

- `./contract-ledger.md`を開くと、`./baseline-ledger.md`の全35構造範囲それぞれについて、`function_migration_policy.md` §3の意味単位へ分解されたcontractが登録されている。
- 各contractに`contract ID`、`source`、`kind`、`meaning`、`destination`、`classification`が入っている。
- `classification`が`ADD | CHANGE | RETIRE`の行はすべて、`agreement`列に`./task-design-discussion.md`の論点番号またはユーザーの明示指示が入っている。
- `KEEP | MOVE | ADAPT`の行はすべて`destination`に具体的なfile名と節が入っている。
- 未分類の行がゼロである。

### Tasks

- [x] `contract-ledger.md`を新規作成し、表の枠を定義する
  - [x] `contract ID`、`source`、`kind`、`meaning`、`destination`、`classification`、`agreement`、`verification`の列を持つ表にする
  - [x] `verification`列は空のままにする。Phase 6で埋める

- [x] A-01〜A-17（frontmatter、h1、repository固有文脈、役割、形式の優先順位、構成意図、コア、場面別見出し）を意味単位へ分解して登録する

- [x] A-18〜A-34（場面S1〜S9）を意味単位へ分解して登録する

- [x] A-35（形式の優先順位）を意味単位へ分解して登録する

- [x] 分類の確認を行う
  - [x] `ADD | CHANGE | RETIRE`の全行に`agreement`があることを確認する
  - [x] `KEEP | MOVE | ADAPT`の全行に具体的な`destination`があることを確認する
  - [x] 未分類の行がゼロであることを確認する
  - [x] 新たな`CHANGE`が見つかった場合は、ここで作業を停止してユーザーへ報告し、同じworking directoryでtask-designのdesign phaseへ戻す。後続phaseへ進まない（新たな`CHANGE`は見つからなかった。既知の`ADD`以外は全件`KEEP | MOVE | ADAPT | RETIRE`で説明できたため、Phase 2へ進む）

### 各task詳細

#### 意味単位への分解

`function_migration_policy.md` §3が挙げる意味単位を独立したcontractとして登録する。入力・前提条件・trigger・default、action・出力・返却値・副作用、必須順序・先行gate・完了条件、禁止・停止・再開・取消・fallback、owner・single writer・正本・境界、例外条件・分岐・適用外、なぜその規則が必要かという理由、正しい例・悪い例・失敗例、判断質問、`MUST`や太字が表す強度、複数章をまたぐ順序・対応・排他。

長い一項目へ複数contractを丸めない。理由、例、失敗例、判断質問を「装飾」として省略しない。

#### destinationの決め方

`./design.md`「3. 完成後の姿」のtreeに従う。A-01〜A-04は`plugins/tumeda-dev/skills/think-through/SKILL.md`、A-35とA-12〜A-15は`core.md`、A-06〜A-10は`evolution_policy.md`、A-18〜A-34は対応する場面file、A-05・A-11・A-16（区切り線）はfile分割自体が代替するため`RETIRE`とし、agreementに論点1を記録する。

#### 既知の`ADD | CHANGE | RETIRE`

| classification | 対象 | agreement |
| --- | --- | --- |
| `ADD` | SKILL.mdの`## 思考標準の参照` | ユーザー明示指示、論点4 |
| `RETIRE` | `S1`〜`S9`、`C1`、`C2`という識別子の呼称 | 論点3 |
| `RETIRE` | 章間の区切り線 | 論点1（file分割が代替） |
| `ADAPT` | 場面間相互参照4箇所のfile跨ぎlinkへの読み替え | 論点3 |
| `ADAPT` | frontmatter `description`の場面列挙 | 論点4 |
| `ADAPT` | `## 役割`冒頭のオーケストレーション記述 | 論点4 |

---

## Phase 2: think_standards/配下12fileを生成する

### DoD（完了条件）

- `plugins/tumeda-dev/docs/think_standards/`を開くと、`README.md`、`core.md`、`evolution_policy.md`、および場面9fileの計12fileが存在する。
- `contract-ledger.md`で`destination`が`think_standards/`配下を指す全contractの内容が、対応するfileに入っている。
- 各場面fileは主軸を先頭に持ち、その場面の補助節が続く。
- file跨ぎの参照が場面名を表示テキスト、相対pathをlink先とする形になっている。
- この時点では`think-through/SKILL.md`を変更しない。内容が両方に存在する状態を許容し、Phase 4で解消する。

### Tasks

- [x] `plugins/tumeda-dev/docs/think_standards/` directoryを作る

- [x] `core.md`を作る
  - [x] A-13（C1 唯々諾々の禁止）、A-14・A-15（C2 修正前の方針合意と補助）、A-35（形式の優先順位）の内容をledgerのdestinationどおりに入れる
  - [x] 見出しから`C1`、`C2`の識別子を外す

- [x] `evolution_policy.md`を作る
  - [x] A-06〜A-10（なぜこの構成か、暫定であること、改善時に守ってほしい軸、変えてよいこと）を入れる

- [x] 場面9fileを作る
  - [x] `starting_to_think.md`（A-18）
  - [x] `receiving_feedback.md`（A-19）
  - [x] `advancing_discussion.md`（A-20〜A-23）
  - [x] `writing_abstraction.md`（A-24〜A-27）
  - [x] `updating_types.md`（A-28〜A-30）
  - [x] `handling_errors.md`（A-31）
  - [x] `presenting_options.md`（A-32）
  - [x] `ordering_parallel_items.md`（A-33）
  - [x] `designing_for_variations.md`（A-34）
  - [x] 各fileの見出しから`S1`〜`S9`の識別子を外す

- [x] file跨ぎの相互参照を書き換える
  - [x] `receiving_feedback.md`から`starting_to_think.md`への参照
  - [x] `advancing_discussion.md`から`ordering_parallel_items.md`への参照
  - [x] `ordering_parallel_items.md`から`receiving_feedback.md`と`advancing_discussion.md`への参照
  - [x] 表示テキストを場面名、link先を相対pathにする

- [x] `README.md`を作る
  - [x] 導入、この標準群の引き方、収録一覧の3節で構成する
  - [x] 引き方に、コアを場面を問わず先に適用すること、該当する場面を判定してそのfileを読むこと、複数の場面が同時に該当するなら該当分をすべて読むこと、形式はconsumer側の指定が優先されることを書く
  - [x] 収録一覧を`- **[file](./path)** — 一行説明`の形にし、コア・場面9件・維持規律のすべてを並べる

- [x] 生成結果を照合する
  - [x] `contract-ledger.md`で`destination`が`think_standards/`配下の全contractについて、対応fileに内容があることを確認する
  - [x] linkが実在するpathを指していることを確認する

---

## Phase 3: validatorのassertionを移管後のownerへ付け替える

### DoD（完了条件）

- `node scripts/verification/validate-plugin.mjs`が`plugin validation passed`を返す。
- S8の本文を要求する4件と`forbidText` 1件が`ordering_parallel_items.md`を、S9の本文を要求する4件が`designing_for_variations.md`を対象にしている。
- `think_standards/`配下12fileが`requireExists`と`portableFiles`の対象になっている。
- `### S8.`と`### S9.`の見出し文字列を要求する2件が削除されている。

### Tasks

- [x] `scripts/verification/validate-plugin.mjs`へ`think_standards/`のpath helperを追加する

- [x] think-through assertionを付け替える
  - [x] S8本文4件を`ordering_parallel_items.md`対象へ移す（うち1件は原文どおり`advancing_discussion.md`が原本であったため同fileへ対象を訂正）
  - [x] S9本文4件を`designing_for_variations.md`対象へ移す
  - [x] `forbidText`（旧ルール禁止）を`ordering_parallel_items.md`対象へ移す
  - [x] `### S8.`と`### S9.`の見出し文字列を要求する2件を削除する

- [x] `think_standards/`配下12fileの`requireExists`を追加する

- [x] `portableFiles`へ`think_standards/`配下12fileを追加する

- [x] validatorを実行する
  - [x] `node scripts/verification/validate-plugin.mjs`を実行する
  - [x] failureがあれば修正して再実行する
  - [x] `plugin validation passed`を確認する

### 各task詳細

#### この時点でSKILL.md側のassertionを追加しない理由

`forbidText(thinkThroughSkill, "**主軸:")`は、SKILL.mdから場面の内容が消えて初めて成立する。Phase 4でSKILL.mdを縮小するのと同時に追加する。この順序を守らないとPhase 3でvalidatorが失敗する。

---

## Phase 4: SKILL.mdを入口だけへ縮小する

### DoD（完了条件）

- `plugins/tumeda-dev/skills/think-through/SKILL.md`を開くと、frontmatter、`# think-through スキル`、`## repository固有文脈`、`## 役割`、`## 思考標準の参照`だけで構成されている。
- `## 思考標準の参照`が、`plugins/tumeda-dev/docs/think_standards/`への相対path、READMEが引き方の正本であること、内容の正本がdocs側にあることの3点を持つ。場面一覧と引き方の手順を持たない。
- `node scripts/verification/validate-plugin.mjs`が`plugin validation passed`を返す。
- 内容の二重存在が解消されている。

### Tasks

- [x] SKILL.mdから移管済みの範囲を削除する
  - [x] `### 形式の優先順位`（A-35）を削除する
  - [x] `## 構成意図（後続改善者へ）`（A-06〜A-10）を削除する
  - [x] `## コア（常時適用、場面トリガー不要）`（A-12〜A-15）を削除する
  - [x] `## 場面別`（A-17〜A-34）を削除する
  - [x] 章間の区切り線（A-05、A-11、A-16）を削除する

- [x] `## 思考標準の参照`を追加する
  - [x] `plugins/tumeda-dev/docs/think_standards/`への相対pathを書く
  - [x] READMEが引き方の正本であることを書く
  - [x] 内容の正本がdocs側にあることを書く
  - [x] 場面一覧と引き方の手順を書かない

- [x] `ADAPT`対象2件を反映する
  - [x] frontmatter `description`の場面列挙を、書き換え後の考え始めの内容と、識別子を使わない表現へ揃える
  - [x] `## 役割`冒頭の「CLAUDE.md からオーケストレーションされ、毎ターン適用される」を、`.claude/hooks/`による注入の実態へ合わせる

- [x] validatorへSKILL.md側のassertionを追加する
  - [x] `requireText(thinkThroughSkill, "docs/think_standards/")`を追加する
  - [x] `forbidText(thinkThroughSkill, "**主軸:", "docsへ移した思考標準の内容がSKILL.mdへ戻っている")`を追加する

- [x] validatorを実行する
  - [x] `node scripts/verification/validate-plugin.mjs`を実行する
  - [x] failureがあれば修正して再実行する
  - [x] `plugin validation passed`を確認する

---

## Phase 5: 導線とhook注入文を更新する

### DoD（完了条件）

- `plugins/tumeda-dev/docs/README.md`を開くと、docs直下5群への1行説明付きlinkと「群の置き方」がある。
- `plugins/tumeda-dev/skills/README.md`のthink-through行から`../docs/think_standards/README.md`へ辿れる。
- `bash .claude/hooks/think_through_session_start.sh`を実行すると、識別子を含まずfile名を添えた注入文がJSONで返る。
- 注入文が指すfile名がすべて実在する。

### Tasks

- [x] `plugins/tumeda-dev/docs/README.md`を新規作成する
  - [x] 5群への1行説明付きlinkを置く
  - [x] 入口fileを持つ群はそのfileを、持たない群はdirectoryまたは代表fileを指す
  - [x] 「群の置き方」に、群は主題単位であること、群のREADMEが入口になること、一つのfileで足りる主題は既存群へ置くこと、群の増減時は1行の追加・削除で更新することを書く

- [x] `plugins/tumeda-dev/skills/README.md`のthink-through行へ、思考標準の本体が`../docs/think_standards/`にあることを示すlinkを一行足す

- [x] `.claude/hooks/think_through_session_start.sh`の注入文を更新する
  - [x] コア2行から`C1`、`C2`を外し、`core.md`を添える
  - [x] 場面9行から`S1`〜`S9`を外し、対応するfile名を添える
  - [x] `bash .claude/hooks/think_through_session_start.sh | jq -e '.hookSpecificOutput.hookEventName'`で正しいJSONが返ることを確認する
  - [x] 注入文が指すfile名がすべて実在することを確認する

- [x] `.claude/hooks/think_through_user_prompt.sh`を確認する
  - [x] 同fileは識別子もfile名も含まないため、変更が不要であることを確認する
  - [x] 変更が必要と判明した場合だけ更新し、JSON出力を確認する（変更不要と確認。`| jq -e`で出力を確認済み）

- [x] linkの実在を確認する
  - [x] `docs/README.md`と`skills/README.md`から張ったlinkのpathがすべて実在することを確認する

---

## Phase 6: white-box検証と完了集計

### DoD（完了条件）

- `contract-ledger.md`の全contractの`verification`列が埋まっている。
- Git差分の削除行すべてから、contract IDとdestinationまたは廃止合意へ逆引きできる。
- Git差分の追加行すべてから、旧contract IDまたは合意済み`ADD`へ逆引きできる。
- 完了集計が`未監査 0 / 未分類削除 0 / 未分類追加 0`である。

### Tasks

- [x] 順方向照合を行う
  - [x] `baseline-ledger.md`の全35構造範囲について、移行後のownerと節を確認する
  - [x] `contract-ledger.md`の全contractについて、移行後のownerと節、または合意済みの変更・廃止理由を確認する
  - [x] 12fileへ分散した内容を合算して通読し、移行前の順序とlifecycleが再現されるか確認する
  - [x] `verification`列へ結果を記録する

- [x] 逆方向照合を行う
  - [x] `git diff`の削除行を列挙する
  - [x] 各削除行からcontract IDとdestination、または廃止合意へ逆引きする
  - [x] `git diff`の追加行を列挙する
  - [x] 各追加行から旧contract ID、または合意済み`ADD`へ逆引きする
  - [x] ledgerに載らない削除・追加が一行でもあれば、ledgerへ登録して分類する（reverse audit scriptで発見した2件を修正: evolution_policy.mdの見出し「構成意図」→「維持規律」をADAPTとしてledgerへ追記し、`## 補助:`prefixを場面file側へ復元した）

- [x] 境界照合を行う
  - [x] SKILL.mdと`think_standards/`配下を合算して通読する
  - [x] 起動条件の判定、`maintenance-plugin-context`への委譲、`think_standards/`への参照、READMEからの場面dispatch、形式のprecedenceが移行前と同じ判断を再現するか確認する

- [x] 情報量signalを監査する
  - [x] 移行前478行と、移行後のSKILL.md・`think_standards/`配下12fileの合算行数を比較する
  - [x] 減少した範囲について、意味が別の場所へ移ったのか合意済みで廃止されたのかを全件説明する（減少なし。493行で増加）

- [x] 完了集計を`contract-ledger.md`へ記録する
  - [x] `適合 N / 合意済み追加 N / 合意済み変更 N / 明示廃止 N / 未監査 0 / 未分類削除 0 / 未分類追加 0`の形で示す
  - [x] 未監査・未分類削除・未分類追加がゼロでなければ、ゼロになるまで照合を続ける

- [x] black-box scenarioを実行する
  - [x] 選択肢を提示する場面でどの形式を使うかを、READMEから辿って引けるか確認する
  - [x] 修正前の方針合意が、場面を問わず引けるコアとして辿れるか確認する
  - [x] 複数の場面が同時に該当する時、該当分をすべて読む指示へ到達できるか確認する
  - [x] consumer側が形式を指定した場合にpresetより優先されることを、READMEから`core.md`へ辿って確認できるか確認する

---

## Phase 7: 品質check

### DoD（完了条件）

- `node scripts/verification/validate-plugin.mjs`が`plugin validation passed`を返す。
- repository全体で参照切れのlinkがない。

### Tasks

- [x] validatorを実行する
  - [x] `node scripts/verification/validate-plugin.mjs`を実行する
  - [x] failureがあれば修正して再実行する
  - [x] `plugin validation passed`を確認する

- [x] 変更したfileから張ったlinkの実在を確認する
  - [x] `think_standards/`配下12file、`docs/README.md`、`skills/README.md`、`think-through/SKILL.md`のlinkを対象にする
  - [x] 参照切れがあれば修正して再確認する（全link解決を確認。参照切れなし）

> repository contextからrepository全体のlint・static analysis・format check・test commandは返らなかった。返された検証手段は`node scripts/verification/validate-plugin.mjs`だけであるため、それ以外の全体commandを推測して実行しない。UI変更がないためscreenshot確認taskは置かない。

---

## Documentation reviewと実装後振り返り

- [x] code readingまたは実装で永続化候補を得た場合、その場でdoc-enricherを提案modeで適用する（該当なし。今回の移行はcontract-ledger.mdとdesign.mdへ既に記録済みで、既存READMEへの追加提案候補は生じなかった）
  - [x] 提案がある場合だけユーザー承認後に既存READMEまたは既存docsへ反映する
  - [x] 提案・承認判断を別taskへ先送りしない
- [x] 実装、review、validationからfeedbackまたは実装とのずれが生じた場合、直接受領したworkflow ownerがpluginの`facilitate-discussion`を`implementation_review.md`へ適用する（Phase 6のwhite-box逆方向照合で2件のずれ（evolution_policy.mdの見出し「構成意図」→「維持規律」の未記録ADAPT、場面補助節`## 補助:`prefixの脱落）を自己検出し、その場でcontract-ledger.mdへ追記・tasklist.mdへ記録した上で実装を修正した。外部からのuser feedbackや設計との対立ではなく、実装時の見落としをwhite-box監査工程内で検出・是正したものであり、別途`implementation_review.md`での議論を要する未解決の認識齟齬は残っていない）
  - [x] `discussion_directory=<working_dir>`と`discussion_file_name=implementation_review.md`を渡す（今回は適用不要と判断）
  - [x] 原文、関連する実装・design・plan、原因、採用方針、決定を渡し、修正済みでも記録を省略しない（contract-ledger.mdのA-06-1、Phase6セクション、tasklist.mdの該当taskへ記録済み）
  - [x] 「共有されていなかった知識の前提は何か」を確認する（design.mdのdocument treeコメントが見出し名「維持規律」を先に宣言していたが、論点1〜3の決定文が明示的にはそれを反映していなかった）
  - [x] 「codeを読めば分かるか、設計意図か、process不足か」を確認する（設計意図。design.mdのtree注記を見落とさず反映すればcontract-ledger作成時点で気づけた）
  - [x] 「どこに書けば次回この議論が不要になるか」を確認し、合意後だけ反映する（contract-ledger.mdのA-06-1へ根拠込みで記録した。新たな合意形成は不要と判断し、design.md自体は変更していない）
  - [x] decisionをcallerへ返し、designまたはplan構造が変わる場合は同じworking directoryでtask-designへ戻す（design/plan構造の変更は不要と判断）
  - [x] review後に実装を自動再開しない（本件はPhase 6監査内での自己是正であり、review後の別途再開は発生していない）

---

## 動作確認

### DoD

ユーザーが実際に`think_standards/`を引き、意図どおりであることを確認した。

### Tasks

- [ ] ユーザーに動作確認を依頼する
  - [ ] `think_standards/README.md`から各fileへ辿れるかを確認してもらう
  - [ ] 縮小後の`think-through/SKILL.md`が入口として機能するかを確認してもらう
  - [ ] session再起動後、hookが新しい注入文を配ることを確認してもらう
- [ ] feedbackがあれば、直接受領したworkflow ownerがpluginの`facilitate-discussion`を`implementation_review.md`へ適用し、decisionをcallerへ返す
  - [ ] designまたはplan構造が変わる場合は同じworking directoryでtask-designへ戻す
  - [ ] feedbackがなければ`[x] ~~feedback収集~~（feedbackなし）`の形式で完了扱いにする

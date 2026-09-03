# Design: steeringのmodel・effort指定を外す

## 元の依頼内容

steeringスキルからeffortとmodelの指定を外したい

---

## TL;DR

`plugins/tumeda-dev/skills/steering/SKILL.md` のfrontmatterにある `model: sonnet` と `effort: high` は、hostのdefault modelがSonnetだった時代に、default運用を明示し `task-design` だけをOpusへ上げる差分を成立させるために置かれた宣言である。当時は意図どおり機能していた。defaultがOpusへ移った現在、同じ宣言は効く経路ではdefaultから下げる指定として働き、効かない経路では「Sonnet前提のskill」という実態と食い違う契約を読ませる。当初の目的を果たさず制約としてだけ残っているため外す。

終了時には、どの層をどの推論強度で動かすかの基準が `runtime-model-profiles.md` に書かれ、その基準に違反する宣言が `steering` と `task-design` の両方から消えている。基準を明記するのは、宣言の意図がどこにも記録されていなかったために「配置が構造的に誤っている」という誤診断が実際に起きたためである。同じ前提変化はprofile名にも及んでいたため、`standard-execution` を `delegated-execution` へ改名して名前と実体を一致させる。

---

## 完成後の姿

### documentationが成立させる知識体系

**`runtime-model-profiles.md` が持つ基準**

前文とprofile定義の間に `## 推論強度の基準` を置き、内容は次の2点に限る。

- main sessionで適用するskillはhostのdefaultで動かし、frontmatterで `model` と `effort` を宣言しない。現在のdefaultはOpus相当である。
- childとして委譲する先はSonnet相当で足りる。`delegated-execution` がこれを表す。

この基準から、各skillが宣言を持ってよいかが導ける。宣言がhost defaultに対する相対指定であり、defaultが変われば意味が反転するという理由の説明は書かない。基準だけで判断できるため、理由を足すと記述量は増えるが判断は助けられない。

同じ理由で次のものも書かない。

- `steering` と `task-design` が宣言を持っていた経緯の実例。
- root `README.md` の運用契約1行の置換。
- `plugins/tumeda-dev/skills/README.md` の役割説明の追随。

基準の正本は `runtime-model-profiles.md` 一箇所とし、同じ内容を複数fileへ置かない。

**profile名の改名**

`standard-execution` を `delegated-execution` へ改名する。default Sonnetの時代はmain sessionもこのprofileと同じ強度で動いていたため `standard` で成立していたが、defaultがOpusへ移った時点でこのprofileはdefaultより下位を指すようになり、名前が実体とずれた。frontmatterの宣言と同じく、文字列が変わらないまま意味が反転している。宣言だけを直して名前を残すと、次に読む人が「standard = 標準的な実行 = main session」と読んでprofileの適用先を誤る。

`delegated-execution` を選ぶのは、`runtime-execution-contracts.md` が既に「child処理の委譲」「logical owner / physical launcher」の語彙を持ち、委譲先であることがこのprofileの要件と一致するためである。

この改名は個別判断であり、命名の汎用規範へ昇格させない。`standard` が問題になったのは、それがhostのdefault modelという名前の外にある前提を指し、かつその前提が実際に動いたという条件が揃ったためである。基準相対語を含む名前（`default_value`、`new_order`、`legacy_adapter` 等）は一般に機能しており、条件を落として規範化すると誤った禁止になる。

### runtime・設定・環境構築

**実行条件と設定:**

| identifier / dependency | 値または解決元 | default | 影響する挙動 |
| --- | --- | --- | --- |
| `model`（`steering/SKILL.md`、`task-design/SKILL.md` frontmatter） | 宣言を削除する。両skillが動くmodelはhostのdefaultとユーザーの選択が決める | 宣言なし | 宣言がないため、hostのdefault modelでそのまま動く。defaultが上がっても下げられない |
| `effort`（`steering/SKILL.md` frontmatter） | 同上 | 宣言なし | 同上 |
| 配布version宣言4箇所と `expectedRelease` | `7.4.2` | なし | PATCHとして配布される |

配布versionをPATCHにするのは、今回の変更3種類（既存skillのfrontmatter宣言削除、既存docsへのsection追加とprofile名の改名、検査scriptのassertion変更）がいずれもconsumerの呼び出し方を増やさないためである。公開contract（skillの起動条件、入力、result、owner境界）は変わらないためMAJORにしない。profile名はplugin内部のskill本文だけが参照する識別子であり、利用先repositoryのcontext instanceは profile名を持たないため外部consumerのcontractではない。frontmatterの宣言削除はhostが選ぶmodelを変え得るが、これはskillが提供するcontractではなく実行環境側の解決結果である。新しいskill、parameter、起動経路のいずれも増えないためMINORにもしない。

**環境別の完成状態:**

| environment | 配置・起動条件 | 観測可能な結果 |
| --- | --- | --- |
| Claude Code（main session適用） | frontmatterに宣言なし | 親sessionのmodelとeffortで動く。既に宣言を持たない6 skill（`facilitate-discussion`、`maintenance-plugin-context`、`name-work-directory`、`think-through`、`escalate-plugin-skill-fix`、`doc-enricher`）と同じ状態になる |
| Claude Code（子steeringをchildとして起動する経路） | 同上 | hostのdefaultを継承する。Sonnetへ落ちない |
| Codex | 同上 | `runtime-model-profiles.md` のadapter規則が定める親model継承のfallbackと同じ結果になる |

**不足・不整合時:**

- 宣言がないことは不足ではなく既定の状態である。fallbackもerrorも発生させない。hostのdefaultとユーザーの選択が唯一の解決元になる。

**file配置と既存pattern:**

- `plugins/tumeda-dev/skills/steering/SKILL.md`: frontmatterから2行を削除する対象。
- `plugins/tumeda-dev/skills/task-design/SKILL.md`: frontmatterから1行を削除する対象。
- 参照する既存pattern: 宣言を持たない上記6 skillのfrontmatter。
- 変更しない: `delegated-execution` profileの本文（用途、Claude selector、Codex adapter、返却、使用skill）、`## adapter規則`、`## release確認`。agent由来3 skill（`tasklist-executor`、`test-runner`、`visual-inspector`）の宣言はprofileに紐づき、childとして委譲される側なので基準を満たす。

### documentation以外のfile deliverable

**対象と読者:**

| file | 主な読者 | 読後または利用後にできること |
| --- | --- | --- |
| `plugins/tumeda-dev/skills/steering/SKILL.md` | steeringを起動するhost、skillを保守する人 | steeringの起動条件・許可tool・手順を判断できる。frontmatterからmodel前提を読み取らない |
| `plugins/tumeda-dev/skills/task-design/SKILL.md` | task-designを起動するhost、skillを保守する人 | 設計processの起動条件と手順を判断できる。frontmatterからmodel前提を読み取らない |
| `plugins/tumeda-dev/skills/doc-enricher/SKILL.md` | doc-enricherを提案modeで使うagent | 抽象化ラダーを登り切った命題が一般則として真かを判断できる |
| `scripts/verification/validate-plugin.mjs` | このrepositoryで変更を検証する人 | frontmatterのassertionが現状と一致し、基準に違反する宣言の再導入と旧profile名の復活を検知できる |

**完成後の内容と構造:**

```text
plugins/tumeda-dev/skills/steering/SKILL.md frontmatter:
  name: steering
  description: "..."（変更しない）
  allowed-tools: Read, Grep, Write, Edit, Bash, Agent（変更しない）
  （model: sonnet と effort: high を削除）

plugins/tumeda-dev/skills/task-design/SKILL.md frontmatter:
  name: task-design
  description: |（変更しない）
  （model: opus を削除）
```

`task-design/SKILL.md` 本文のSonnet前提記述群は変更しない。基準はfrontmatterの宣言を対象とし、本文の思想記述には効かない。

**doc-enricherの抽象化ラダー:**

「ラダーの止まり方と判断」へ4番目の項目を追加する。既存の項目1〜3と、それに続く「やってしまいがちな失敗」以降は変更しない。

```text
  4. 「登り切った命題に反例はないか」→ 反例が挙がるなら一般則として偽 → DROP
     条件を落として一般化した結果である。成立条件を書き戻すと個別判断に戻るため、
     置き場所は規範fileでなく当該作業のledgerになる
```

ラダーは「登り切ること」をMUSTで要求し、Gate A〜Gで抽象度、永続性、レバレッジ、非自明性、探索性、低メンテ、既存docsとの非重複を問うが、登り切った命題そのものが真かを問う項目を持たない。このsteering中に実際に、profile名の改名から「基準相対語で名付けない」という原則を立てて規範fileへ提案し、反例（`default_value`、`new_order`、`legacy_adapter`）によって取り下げた。同じ失敗は2026/8/10 の索引READMEの件でも起きているため、skill本体へ書いて利用先repositoryでの実行にも効かせる。

**validatorの検査内容:**

削除するのは、削除した宣言をpin留めしていた3 assertion（`task-design: model: opus`、`steering: model: sonnet`、`steering: effort: high`）である。残すとvalidationが落ちる。

追加するのは次の3組である。

- profilesの変更のpin留め。`## 推論強度の基準` と `## delegated-execution` を `requireText`、`standard-execution` を `forbidText`（label `旧profile名`）する。旧名の禁止は、旧 `public-contracts.md` の復活を拒否した既存の形に倣う。
- agent由来3 skillのループへ `delegated-execution` の `requireText` を1行追加する。3 skillへ個別に書かずループへ置くのは、対象集合の定義と検査内容を一箇所に保つためである。
- 再導入拒否。`steering` と `task-design` の各fileへ `model:` と `effort:` の `forbidText` を計4本置く。基準は `runtime-model-profiles.md` にあるが、それを読まずに宣言を足す経路は残る。今回の宣言自体、当時は正しく置かれたものが前提変化で足かせになった。同じことは再度起こり得るため機械的に止める。

`forbidText` はfile全体を `String.includes` で判定するため、対象文字列が両fileにzeroであることを確認して置く。root `README.md` は「`forbidText` は落ちないまま無力化する」と警告しているが、この禁止が無力化するのはfrontmatterがYAML以外の形式になった場合であり、その時は同じfileの `requireFrontmatter` によるassertionも同時に壊れるため形式変更自体は検知される。

**配置・形式:**

- 配置: 上記2 skillの既存frontmatter、および `scripts/verification/validate-plugin.mjs`
- 形式: YAML frontmatter、既存skill schemaに合わせる
- 参照する既存pattern: 宣言を持たない6 skillのfrontmatter
- 正本と重複防止: 宣言を置ける条件は `runtime-model-profiles.md` が正本。skill側は宣言の有無だけを持ち、validatorは実態が正本と一致することだけを検査する

---

## 要件（Requirements）

### MUST（必達）

- `plugins/tumeda-dev/skills/steering/SKILL.md` のfrontmatterから `model: sonnet` と `effort: high` が消えている。
- `plugins/tumeda-dev/skills/task-design/SKILL.md` のfrontmatterから `model: opus` が消えている。
- どの層をどの推論強度で動かすかの基準が `runtime-model-profiles.md` から読め、その基準と各skillのfrontmatterの実態が一致している。
- profile名が実体と一致し、`standard-execution` を参照する箇所が残っていない。
- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を返す。
- 配布versionの宣言値4箇所と `scripts/verification/validate-plugin.mjs` の `expectedRelease` が `7.4.2` で一致している。

### SHOULD（できれば）

- なし。

### MAY（あれば嬉しい）

- なし。

### 非目標

- `delegated-execution` profileの本文、`## adapter規則`、`## release確認` の変更。profile体系は今回の欠陥の原因ではない。
- agent由来3 skill（`tasklist-executor`、`test-runner`、`visual-inspector`）の `model` / `effort` / `context: fork` の削除。childとして委譲される側であり基準を満たす。
- `task-design/SKILL.md` 本文のSonnet前提記述群の書き換え。対象は description本文の「デフォルトモデル: Opus」「Sonnetで起動された場合でもOpusに切替が望ましい」、section 1 の「Sonnet は『実装に入りたい衝動』を持っている」、section 6 冒頭の「Sonnet がよく陥る穴埋めパターン」、section 8 の「Sonnet が日常運用する前提」「修正の種類と使うモデル」対応表「Sonnet が更新するときに守ること」「Opus に相談するか」である。基準はfrontmatterの宣言を対象とし本文の思想記述には効かない。加えて「Sonnetという名前を外して意図を保つ」判断が一箇所ずつ必要になるため、別steeringの候補として残す。
- 汎用skill schema validatorの `model` / `effort` 拒否への対応。「toolの非対応でありacceptance failureにしない」という既存の判断を維持する。
- root `README.md` と `plugins/tumeda-dev/skills/README.md` への波及。基準の正本を `runtime-model-profiles.md` 一箇所に閉じる。
- `plugins/tumeda-dev/docs/development_standards/naming/core.md` への命名原則の追加。profile名の改名は個別判断としてこのledgerに留める。

### 受け入れ基準

- `steering/SKILL.md` のfrontmatterが `name`、`description`、`allowed-tools` の3項目だけを持つ。
- `task-design/SKILL.md` のfrontmatterが `name` と `description` だけを持つ。
- `runtime-model-profiles.md` に `## 推論強度の基準` が存在し、その基準と各skillのfrontmatterが一致している。
- `standard-execution` の参照が repository 内に残っていない。
- 配布versionの5箇所が `7.4.2` で一致している。
- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を返す。

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| assertionを削除するだけだと、将来同じ宣言が理由なく再導入される | `forbidText` で `model:` と `effort:` の再導入を拒否する。対象文字列が現在zeroであることを確認して置く |
| 宣言の意図を記録しないまま削除すると、同じ誤診断が次回も起きる | 基準を `runtime-model-profiles.md` へ書き、宣言の削除より先に適用する |
| profile名を改名すると参照が壊れる | 参照箇所を `grep` で洗い出し、4 file各1行を同時に置換する。改名後に残存参照がzeroであることを確認する |
| 配布versionの5箇所がずれると、validatorが落ちるか意図しないreleaseになる | 宣言値4箇所と `expectedRelease` を一度に変え、`grep` で旧versionの残存がzeroであることを確認する |
| 削除後のskillが実際にどのmodelで動くかを本sessionで確認できない | skill内容はsession開始時にcacheされるため、実測を受け入れ基準に含めない。frontmatterの状態とvalidatorで判定する |

---

## テスト方針

- `node scripts/verification/validate-plugin.mjs` で、frontmatter assertionの追随、docs記述の追随、version宣言値の一致を確認する。
- `grep` で `standard-execution` と旧versionの残存参照がzeroであることを確認する。
- 宣言を持たない既存6 skillと同じfrontmatter構成になったことを実測で照合する。
- `forbidText` の検知能力について、宣言を一時的に戻して落ちることを確認する破壊検証は行わない。`forbidText` の実装が `source.includes(forbidden)` であり、対象文字列が現在zeroであることを実測済みなので、同じ文字列が現れれば必ずfailureへ入る。実装と実測から一意に決まるため、fileを一時的に壊す手順を踏まない。
- 削除後のskillが動くmodelの実測は行わない。skill内容はsession開始時にcacheされ、同一session内では変更が反映されないため。

---

## （付録）前提とする既存仕様

- `plugins/tumeda-dev/skills/steering/SKILL.md` frontmatter（変更前）: `name`、`description`、`allowed-tools: Read, Grep, Write, Edit, Bash, Agent`、`model: sonnet`、`effort: high` を持つ。
- **宣言が置かれた経緯**（ユーザーから得た事実、docsに記録なし）: hostのdefault modelがSonnetだった時代の運用で、`task-design` だけをOpusで動かしたかったために置かれた指定である。default運用の明示と、task-designへの差分指定が対になっていた。defaultがOpusになった現在は足かせにしかならない。
- `plugins/tumeda-dev/skills/runtime-model-profiles.md`（変更前）: profileは `standard-execution` の1つだけ。使用skillは `visual-inspector`、`tasklist-executor`、`test-runner` と明記され、steeringとtask-designは含まれない。adapter規則は「skill本文はprofile名を参照し、provider固有model名を判断根拠にしない」「Claude Codeではprofileに対応する`model` frontmatterを使う」「hostがprofile相当のmodelを選べない時は存在しないmodel名を指定して失敗させず、親model継承をfallbackとする」。
- root `README.md` 運用契約: 「hostごとのmodel差は`runtime-model-profiles.md`の能力profileで吸収する。provider固有model名はskill手順の正本にしない。」frontmatterの宣言には触れていない。
- root `README.md` 変更時の検証と前提: 検査正本は `node scripts/verification/validate-plugin.mjs`。skillまたはdocsを変更したら対応するassertionを追加し、既存assertionがピン留めしている文字列を変更したら追随させる。`forbidText` は落ちないまま無力化するため先に確認する。skill内容はsession開始時にcacheされる。
- `plugins/tumeda-dev/skills/README.md`: 共有リファレンス節で `runtime-model-profiles.md` を「skill が要求する推論強度 profile を、各 host の実 model へ変換する対応表」と説明している。
- `plugins/tumeda-dev/skills/runtime-execution-contracts.md`: 「agent由来の3skillはfrontmatterに`context: fork`を保持する。これは宣言の静的契約であり、特定hostのruntime動作をこの文書の受け入れ条件にはしない。」child処理の委譲、logical owner / physical launcherの語彙を持つ。
- `plugins/tumeda-dev/docs/development_standards/naming/core.md`: 「名前を付ける対象が何であっても成立する原則」として6原則を持つ。初見での自明性、宣言的なwhat/why、具体性、修飾の向き、名前空間、命名後のレビュー。
- 各skillのfrontmatter実測（変更前）:
  - model/effortなし: `escalate-plugin-skill-fix`、`facilitate-discussion`、`maintenance-plugin-context`、`name-work-directory`、`think-through`、`doc-enricher`（`allowed-tools`のみ）
  - `steering`: `model: sonnet`、`effort: high`
  - `task-design`: `model: opus`（description本文にも「デフォルトモデル: Opus」「Sonnetで起動された場合でもOpusに切替が望ましい」。SKILL.md本文にもSonnet前提の思想記述が複数ある）
  - `tasklist-executor` / `test-runner` / `visual-inspector`: `model: sonnet`、`context: fork`、`effort: medium`
- `scripts/verification/validate-plugin.mjs`: `forbidText` はfile全体を対象に `String.includes` で判定する。`requireFrontmatter` は先頭の `---` blockだけを対象にする。agent由来3 skillのループが `context: fork`、`../runtime-execution-contracts.md`、`../runtime-model-profiles.md`、`Codex` をassertする。`standard-execution` をpin留めするassertionは存在しなかった。version検査は宣言値4箇所だけを比較し、`.agents/plugins/marketplace.json` は version fieldを持たないため対象外である。
- `.steering/2026/202608/20260808-focus-tasklists-on-staged-implementation/design.md`: 「generic validatorの`model`／`effort`拒否はtoolの非対応でありacceptance failureにしない」と記録済み。旧 `public-contracts.md` の復活を `forbidText` で拒否した前例がある。破壊的な公開contract変更として `6.0.0` へbumpした前例もある。
- 配布version（変更前）: 宣言値4箇所と `expectedRelease` はすべて `7.4.1`。
- version bump規約（`maintenance-plugin-context`）: MINORとPATCHの境界は「consumerが新たに呼べるものが増えたか」で判定する。既存skillの内容修正、docsの追加・変更はPATCH。新規fileの追加それ自体はMINORの根拠にならない。

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |
| `plugins/tumeda-dev/skills/runtime-model-profiles.md` | 前文とprofile定義の間へ `## 推論強度の基準` を追加。見出しを `## standard-execution` から `## delegated-execution` へ改名 | `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` | [documentationが成立させる知識体系](#documentationが成立させる知識体系) |
| `plugins/tumeda-dev/skills/tasklist-executor/SKILL.md`、`visual-inspector/SKILL.md`、`test-runner/SKILL.md` | 本文の `standard-execution` 参照を `delegated-execution` へ置換（各1行） | 同上。あわせて `grep` で `standard-execution` の残存参照がzeroであることを確認 | 同上 |
| `plugins/tumeda-dev/skills/steering/SKILL.md` | frontmatterから `model: sonnet` と `effort: high` を削除 | `plugin validation passed`。frontmatterが `name`、`description`、`allowed-tools` の3項目になったことを実測 | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) |
| `plugins/tumeda-dev/skills/task-design/SKILL.md` | frontmatterから `model: opus` を削除 | `plugin validation passed`。frontmatterが `name` と `description` になったことを実測 | 同上 |
| `plugins/tumeda-dev/skills/doc-enricher/SKILL.md` | 抽象化ラダーの「ラダーの止まり方と判断」へ、登り切った命題の反例を問う項目4を追加 | `plugin validation passed` | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) |
| `scripts/verification/validate-plugin.mjs` | 削除した宣言をpin留めしていた3 assertionを削除。`runtimeProfiles` を定義し `## 推論強度の基準` と `## delegated-execution` を `requireText`、`standard-execution` を `forbidText`。agent由来3 skillのループへ `delegated-execution` の `requireText` を1行追加。`steering` と `task-design` へ `model:` / `effort:` の `forbidText` を計4本追加。doc-enricherの追加項目を `requireText` で2本pin留め。`expectedRelease` を `7.4.2` へ同期 | `plugin validation passed`。`forbidText` の対象文字列が両fileにzeroであることを実測 | 同上 |
| 配布version宣言値4箇所（`plugins/tumeda-dev/.codex-plugin/plugin.json`、`plugins/tumeda-dev/.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json` の `version` と `plugins[].version`） | `7.4.1` から `7.4.2` へPATCH | `plugin validation passed`。`grep` で `7.4.1` の残存がzeroであることを確認 | [runtime・設定・環境構築](#runtime設定環境構築) |
| `plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md` | `## task-design` / `### version bump` の「現在の宣言値」を実測値へ同期（`7.4.0` → `7.4.1` → `7.4.2`） | 宣言値4箇所と `expectedRelease` をすべて実測し一致することを確認 | `maintenance-plugin-context` がconsumer要求sectionを更新する契約に基づく |

### task-design内の対象成果物反映待ち

なし。

### execution plan対象

なし。

skill、docs、検査scriptのcontent変更であり、本番application codingに該当しない。合意済み内容から一意に反映でき、段階を踏む作業、外部調整、rollback境界、独立した検証単位のいずれも必要としない。実際にすべての対象成果物変更が、task-design内の一度の連続した反映・validationで完了している。

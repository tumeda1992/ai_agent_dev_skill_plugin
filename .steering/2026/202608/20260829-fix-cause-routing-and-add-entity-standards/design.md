# Design: 原因owner routingの導線修正と、エンティティ設計・命名標準の追加

## 元の依頼内容

```text
（escalate-plugin-skill-fix により利用先repositoryから引き渡された2件。固有情報は migration.md に従い除去済み）

# 提案1: facilitate-discussion の routing 表とフローチャートの不整合

facilitate-discussion の `2.1 対象論点を選ぶ` にある routing 表で、次の行が
`2.1.1 認識齟齬を原因ownerへ戻す` を経由せず `2.3.1` へ直行している。

| activeな既存論点と同じdecisionの原因・提案・検証を変える | その論点を選び、`2.3.1 feedbackをiterationとして扱う`へ進む |

一方、同skillのmermaidフローチャートは `T(2.1) --> C(2.1.1) --> A(2.3)` と描いており、
全ての論点選択が2.1.1を経由する構造になっている。図と本文が食い違う。

実際に起きた被害: ある機能の設計discussionで、assistantが提示した設計上の反論をユーザーが
「それは矛盾しない」と否定した。これはassistantの知識欠落による認識齟齬であり、2.1.1 の分類を
通せば「repository知識の不足」と判定され、doc-enricher が起動されるはずだった。
しかしassistantは routing 表の上記行に従って 2.3.1 へ直行し、通常のiterationとして提案を
差し替えただけで先へ進んだ。結果、doc-enricher は一度も起動されず、ユーザーの指摘で初めて発覚した。

原因の所在: assistantの実行ミスでもあるが、routing表を素直に読むと2.1.1を通らない導線が
正当化される。図と本文のどちらが正なのかが本文だけからは判定できない。

検討してほしい方向:
- routing表の「activeな既存論点へのfeedback」行に、2.1.1を経由することを明示する
- `2.3.1 iterationの入口gate` にも、原因ownerの再分類を行う旨を追記するか検討する
- 論点の`種別`fieldが起動時の値のまま固定される問題も併発している。起動時は「TBDヒアリング」
  だったが、途中で「認識齟齬」の性質が加わった。種別を再評価する契機が本文にない

# 提案2: docs/development_standards/ への知識追加（4件）

知識1: 状態遷移の表現方法の判断基準
  status カラム方式 / 別エンティティ方式の2手法。判断の問いは
  「状態が変わったとき、そのエンティティが持つべき属性は変わるか？」

知識2: テーブル名は集約の同一性を主張しない
  workflow上の状態遷移で行が別テーブルへ移るのは通常の設計。

知識3: 名詞形と形容詞形の判断基準
  「A の B」と「B の A」は別物。判断の問いは「その名前が指すのは、出来事か、状態を持つ物か？」

知識4: ドメイン名前空間と永続化層の名前の対応（汎用化の可否を設計で判定してほしい）

file配置についての論点: 知識3は naming.md への追加が自然と思われる。知識1・2・4は
development_standards/ への新規fileが必要になる可能性が高い。

version bump: maintenance-plugin-context の規約に従う。宣言値4箇所と expectedRelease。
```

---

## 1. TL;DR

利用先repositoryでの実運用中に、このpluginの欠陥が2つ露出した。

一つ目は `facilitate-discussion` の導線欠陥である。認識齟齬を原因ownerへ戻す `2.1.1` は、
`doc-enricher` を起動して知識を永続化させる唯一のgateだが、既存論点へのfeedbackを扱う経路が
このgateを迂回できる書き方になっていた。結果、実際に知識の永続化が丸ごと失われた。

二つ目は標準の欠落である。エンティティ設計と命名について、判断の型が `development_standards` に
無かったため、同じ議論を毎回ゼロから積み直すことになった。

終了時には、feedback経路から `2.1.1` を迂回できなくなり、エンティティ設計・命名の判断基準が
`development_standards` に置かれ、次回同じ議論が不要になっている。

---

## 前提とする既存仕様

- `facilitate-discussion` の mermaid フローチャートは `S --> T`、`T --> C`、`C -->|新しいdecision| N`、
  `C -->|既存論点| A` と描いており、**全ての論点選択が `2.1.1`（図中 `C`）を経由する**。
- 同skillの `2.1` routing表は8行あり、**そのどれ一つとして `2.1.1` に言及していない**。特定行の欠落ではなく、
  表全体が `2.1.1` を素通りする構造だった（escalation時の報告は「1行の問題」だったが、実測で範囲が広がった）。
- `2.1.1` は「選んだdecisionが認識齟齬または修正要求を扱う場合は、具体案を作る前に原因を分類する」と
  条件付きで始まり、`repository知識` 判定時に `doc-enricher` を提案modeで起動する契約を持つ。
- `2.3.1 iterationの入口gate` は「feedbackを受けた時は、iterationを追加する前に必ずこの分類をやり直す」
  と書くが、ここでいう分類は**所属先論点の判定**であり、原因ownerの分類ではない。
- discussion entryの`種別`fieldは `templates/discussion_entry.md` で
  `{TBDヒアリング / 認識齟齬 / レビュー指摘。複数可}` と定義されている。更新契機の記述はない。
- `docs/development_standards/` には `naming.md` のみ。§1 基本 / §2 ファイル名 / §3 メソッド名 の構成で、
  repository固有情報は既に除去されている。
- `docs/README.md` の「5群への入口」は `development_standards/naming.md` を直接指す。同READMEは
  「群のREADMEが入口になる。ただしREADMEを持たない群は、収録fileが1つならそのfileを、
  複数ならdirectoryを代表fileの代わりに指す」と定めている。
- `docs/documentation_standards/` に docs の書き方の標準群がある（`core_readers.md`、
  `information_structuring/`、`case_coverage/`、`expression_notation.md`、`business_specification.md` 等）。
  「各標準は基本1ファイル。1つの標準を説明するのに複数ファイルが要る場合はディレクトリ化してよい」。
- 配布versionは現在 `7.3.1` で、宣言値4箇所（`.codex-plugin/plugin.json`、`.claude-plugin/plugin.json`、
  root `marketplace.json` の2箇所）と `scripts/verification/validate-plugin.mjs` の
  `expectedRelease`（98行目）がすべて一致している。

---

## 2. 要件（Requirements）

### MUST（必達）

- 既存論点へのfeedbackを扱う経路から `2.1.1` を迂回できなくする。図と本文が同じ導線を示す。
- エンティティ設計・命名の判断基準が `docs/development_standards/` 配下から辿れる。
- 追加する記述にrepository固有情報を含めない（`migration.md` の除去規約）。
- 命名標準は、名前を付ける対象を問わず成立する規則と、対象種別に固有の規則を別のfileへ分ける。
  各fileが扱う範囲と扱わない範囲を明示する。
- `naming.md` の分割で、旧fileが持っていた判断能力を一つも失わない。
- 変更内容に見合うversion bumpを一度だけ行い、宣言値4箇所と `expectedRelease` の計5箇所を一致させる。

### SHOULD（できれば）

- 命名標準のfile名自体が、その命名標準の規則を満たす。

### MAY（あれば嬉しい）

- なし。

### 非目標

- `2.1.1` の原因分類そのもの（成果物固有 / repository知識 / skill の3分類）の変更。今回は導線だけを扱う。
- `doc-enricher` の起動条件・提案modeの契約変更。
- discussion entryの`種別`fieldへ再評価契機を追加すること。記録精度には効くが迂回を防がないため、
  必要になれば独立して扱う。
- ドメイン名前空間と永続化層の名前の対応規則をpluginの標準として持つこと。規約であって判断基準ではなく、
  汎用化すると一般論しか残らない。
- `naming.md` 分割に伴う既存規則の内容変更。分割は配置だけを変える。

### 受け入れ基準

- `facilitate-discussion` の routing表から `2.2` / `2.3` へ進む経路が、本文上 `2.1.1` を経由する。
- `2.1.1` に、認識齟齬かどうかを判定できる問いがある。
- `2.3.1` の「この分類」が何を指すかが同じ段落で読み取れ、`2.1.1` と別であることが明示されている。
- `docs/development_standards/naming/` に `README.md` / `core.md` / `file.md` / `method.md` があり、
  `naming.md` が存在しない。
- `entity_modeling.md` から状態遷移・テーブル名・修飾の向きの3判断が辿れ、一般則は `naming/core.md` へlinkしている。
- 旧 `naming.md` への参照が repository 全体でゼロである。
- `node scripts/verification/validate-plugin.mjs` が通り、versionが `7.3.2` で5箇所一致している。

---

## 3. 完成後の姿

<!-- 採用予定の outcome section: documentation.md → workflow.md → file-deliverables.md
     （catalog の「既存skillの本質的更新」= file-deliverables + workflow、
       「documentationの新設・本質的更新」= documentation に対応）
     理解依存が両者間にないため、README の同順位既定順に従って配置する。 -->

### documentationによって成立する知識体系

**形式知化する対象:**

- 暗黙知・pain: エンティティを状態ごとに分けるか1テーブルに保つか、分けた結果をどう名付けるかの判断が
  どこにも書かれておらず、その都度ゼロから議論していた。特に「名前の修飾の向き」の取り違えは、
  読みにくさではなく1行が何を表すかの誤りとして表面化するため、スキーマ確定後に気づくと手遅れになる
- 再利用可能な原則へ引き上げるもの: 状態遷移の表現方法を選ぶ問い、テーブル名と集約境界の関係、
  修飾の向きが指す対象を変えること

**読者と成立させる判断:**

| 読者 | 利用場面 | 再調査せず可能になる判断 | 入口 |
| --- | --- | --- | --- |
| 設計を行うagentまたは開発者 | エンティティに状態が増えたとき | 同じテーブルへ status を足すか、別エンティティへ分けるか | `development_standards/entity_modeling.md` §1 |
| 同上 | 分けた新エンティティを名付けるとき | 既存テーブルと似た名前を避ける必要がないこと、名詞形と形容詞形のどちらを採るか | 同 §2 |
| 同上 | あらゆる命名の場面 | 修飾の向きで指すものが変わること | `development_standards/naming.md` §1 |

**知識構造:**

```text
naming.md（どの命名にも共通する積集合）
  冒頭: この標準のscope宣言 — 特定の設計手法固有の命名判断は置かない
  §1 基本
    ...
    修飾の向きで指すものが変わる  ← 一般則と判断の問い（正本）
    ...
  §2 ファイル名 / §3 メソッド名（既存、変更なし）

entity_modeling.md（エンティティを前提にしないと成立しない判断）
  §1 エンティティの切り方
    状態が変わるとき、同じエンティティに置くか別エンティティにするか
      → 別エンティティ方式を選んだら §2 へ
  §2 エンティティの命名
    テーブル名は集約の同一性を主張しない
    修飾の向きが「1行が何か」を決める  ← naming.md へlink、固有の帰結のみ
```

**規範の根拠と適用境界:**

- 根拠となるpain: 状態を持つエンティティの設計と命名で、同じ議論が繰り返し発生していた
- MUST: 形容詞を単独で名詞の位置に置かない
- 判断基準: 状態遷移は「状態が変わったとき属性は変わるか」、命名は「指すのは出来事か物か」
- 適用対象: `naming.md` はどのプロジェクトにも存在する成果物の命名。
  `entity_modeling.md` はドメインモデリングを採ったときにだけ現れる概念の設計と命名
- 例外・非目標: ドメイン名前空間と永続化名の対応規則は載せない。規約であって判断基準ではなく、
  汎用化すると「一貫性を保て」という一般論しか残らないため

**`naming.md` のscope境界（積集合運用）:**

`naming.md` はどの命名にも共通して成立する内容だけを扱う。特定の設計手法を採ったときにだけ存在する
概念の命名判断は、その概念を扱う標準へ置く。個別文脈の規則を足していく和集合運用にすると、
読み手が「この規則は自分の場面に当てはまるか」を毎回判定することになり、適用範囲が濁る。

この境界で既存の §2 ファイル名・§3 メソッド名 は残る。file と method はどのcodebaseにも存在するが、
entity はドメインモデリングという方針を採ったときにだけ現れる概念である。

**知識3を二箇所へ置く分担:**

| file | 持つもの | 持たないもの |
| --- | --- | --- |
| `naming.md` | 一般則と「出来事か物か」の判断の問い（正本） | 行数・削除の帰結（エンティティ前提でないと成立しない） |
| `entity_modeling.md` | エンティティでの帰結（1行が表すもの、重複時の行数、削除で失われるもの） | 一般則と判断の問いの再掲（linkする） |

一箇所に閉じないのは、この判断が問われるのが大半エンティティの名付けの場面であり、そこでの取り違えが
データモデルそのものの誤りへつながるためである。

**snapshotと維持規律:**

| 正しいsnapshot | single source of truth | 更新trigger |
| --- | --- | --- |
| 一般則は `naming.md` に一度だけ、エンティティ固有の帰結は `entity_modeling.md` に一度だけ存在する | 一般則: `naming.md` §1 / 固有の帰結: `entity_modeling.md` §2 | 判断の問い自体が変わったとき `naming.md` を更新し、`entity_modeling.md` のlink先を確認する |

**完成後のdocument構造:**

- `docs/development_standards/naming.md`: 冒頭へscope宣言、§1 へ「修飾の向きで指すものが変わる」を新設
- `docs/development_standards/entity_modeling.md`: 新規作成
- `docs/README.md`: 「5群への入口」を `development_standards/naming.md` → `development_standards/` へ変更
  （同READMEの「収録fileが1つならそのfileを、複数ならdirectoryを指す」規約による）

### workflow

`facilitate-discussion` の論点選択からiterationまでの導線について、完成後は次が成立する。

**ownerと責務:**

| owner | 判断・更新するもの | 行わないこと | single source of truth |
| --- | --- | --- | --- |
| `2.1 対象論点を選ぶ` | どの論点を扱うか（所属論点の判定） | 原因ownerの分類 | routing表 |
| `2.1.1 認識齟齬を原因ownerへ戻す` | 認識齟齬に該当するかの判定と、該当時の原因owner分類 | 所属論点の判定 | 原因owner表（成果物固有 / repository知識 / skill） |
| `2.3.1 iterationの入口gate` | feedbackの所属先再判定 | 原因ownerの分類 | iterationの入口gate表 |

**状態と遷移:**

```text
feedback到着 --{2.1 所属論点の判定}--> 対象論点が確定
対象論点が確定 --{2.1.1 認識齟齬か判定。該当時は原因owner分類}--> 2.2 または 2.3 へ
```

`2.1.1` は全経路が通る。原因を分類するのは認識齟齬または修正要求を扱う場合だけだが、
**該当するかどうかの判定自体は全経路で行う**。routing表の「次に行うこと」列が指す遷移先は、
この判定を終えた後の行き先である。

**認識齟齬の判定基準:**

> このfeedbackは、提案の選好を変えたのか。それとも提案が依拠していた前提知識の誤りを正したのか。

後者なら認識齟齬である。判定は差し替えた提案の内容ではなく、差し替える理由になった知識がどこから
来たかへ向ける。assistantがその知識を持っていなかったなら、成果物固有ではなくrepository知識または
skillの不足である。

この基準を置く理由は、gateへ到達しても判定を誤れば迂回と同じ結果になるためである。assistantは
自分の提案差し替えを「より良い案を出した」と認識しやすく、その状態では認識齟齬を選好の変更として
処理できてしまう。

**`2.1` と `2.3.1` の「分類」の区別:**

`2.3.1` の「必ずこの分類をやり直す」は所属論点の判定を指し、`2.1.1` の原因owner分類とは別である。
両方を通る。語が衝突したまま放置すると、feedbackを受けた読み手が「分類はやり直した」と認識し、
原因ownerの分類を済ませたと誤認できる。

### documentation以外のfile deliverable

**対象と読者:**

| file | 主な読者 | 読後または利用後にできること |
| --- | --- | --- |
| `plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md` | このskillを実行するagent | routing表から次の処理へ進む際に `2.1.1` を飛ばさず、認識齟齬か否かを基準に沿って判定できる |

**完成後の内容と構造:**

`SKILL.md` の既存構造は変えず、3箇所へ挿入・補足する。

```text
#### 2.1 対象論点を選ぶ
  routing表（8行、変更しない）
  + 全経路が 2.1.1 を通る旨の一文        ← 追加
#### 2.1.1 認識齟齬を原因ownerへ戻す
  冒頭の条件文（変更しない）
  + 認識齟齬の判定基準（問いと解説）      ← 追加
  原因owner表（変更しない）
##### 2.3.1 feedbackをiterationとして扱う
###### iterationの入口gate
  ピン留め契約文（変更しない）
  + 「この分類」が所属論点の判定である旨   ← 追加
```

**配置・形式:**

- 変更しないもの: mermaidフローチャート（既に `T --> C --> A` と正しい導線を描いており、
  今回は本文を図へ合わせる修正であって逆ではない）、routing表の8行、
  `templates/discussion_entry.md`、`scripts/verification/validate-plugin.mjs`
- `validate-plugin.mjs` を変更しない理由: 同scriptは `SKILL.md` の契約文を必須句としてピン留めし、
  移行時の契約消失を防ぐguardである。今回変えるのは契約ではなく曖昧さだけであり、
  契約文自体は保存されるため、ピン留めを外す理由がない

---

## 4. リスクと対策

| リスク | 対策 |
| --- | --- |
| 導線を強めすぎ、認識齟齬でないfeedbackにまで原因分類を強制して往復が増える | `2.1.1` の条件節（認識齟齬または修正要求を扱う場合）を維持し、迂回不可にするのは判定の実施であって分類結果ではないことを明示する |
| 知識1・2 を汎用化しすぎ、判断できない標語になる | `documentation.md` の判断基準「記録された具体ケース以外にも同じ原則を適用できるか」で検証する |
| `naming.md` の分割で、章の要旨だけが移り理由・例外・失敗例が落ちる | `function_migration_policy.md` に従い二層ledgerを編集前に作り、white-box照合で全contractの存在を確認する |
| 分割後に旧 `naming.md` への参照が残り、リンク切れになる | 移行前に依存元を全数列挙してledgerへ登録し、移行後に repository 全体を `grep` して残存ゼロを確認する |

---

## 5. テスト方針

このsteeringの成果物はskillとdocsであり、実行codeを持たない。検証は次の3層で行う。

- **構造検証**: `node scripts/verification/validate-plugin.mjs`。`facilitate-discussion/SKILL.md` の
  契約文ピン留めと、version宣言値4箇所と `expectedRelease` の一致を検査する
- **white-box照合**（`naming.md` 分割のみ）: `function-migration-ledger.md` の contract ledger に沿って、
  旧sourceの各contractが新fileに存在することを照合する。見出しの存在だけを根拠にしない
- **参照整合**: 旧pathへの参照が repository 全体でゼロであること、新pathのlink先が実在することを確認する

`validate-plugin.mjs` のピン留めに衝突した場合は、assertionを書き換える前に
「変えようとしているのは契約か、曖昧さだけか」を問う（`function_migration_policy.md` §8）。

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |
| `plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md` | `2.1` 末尾へ全経路が `2.1.1` を通る旨、`2.1.1` 冒頭へ認識齟齬の判定基準、`2.3.1` 入口gateへ「この分類」の指示対象を追加（+9 / -1） | `node scripts/verification/validate-plugin.mjs` → `plugin validation passed`。旧文言 `必ずこの分類をやり直す` の保存を `grep` で確認 | [workflow](#workflow) / [documentation以外のfile deliverable](#documentation以外のfile-deliverable) |
| `plugins/tumeda-dev/docs/common_standard/function_migration_policy.md` | §8 へ「文字列assertionに衝突したら、契約が変わったのかを先に問う」を追加（+14） | `node scripts/verification/validate-plugin.mjs` → `plugin validation passed` | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) の「`validate-plugin.mjs` を変更しない理由」 |
| `plugins/tumeda-dev/docs/development_standards/naming.md` | 冒頭へscope宣言、§1 へ「修飾の向きで指すものが変わる」を新設（+21） | `node scripts/verification/validate-plugin.mjs` → `plugin validation passed` | [documentationによって成立する知識体系](#documentationによって成立する知識体系) |
| `plugins/tumeda-dev/docs/development_standards/entity_modeling.md` | 新規作成。§1 エンティティの切り方 / §2 エンティティの命名 | 同上 | 同上 |
| `plugins/tumeda-dev/docs/README.md` | 「5群への入口」の指し先を `development_standards/` へ変更（+1 / -1） | 同上 | 同上 |
| `plugins/tumeda-dev/docs/development_standards/naming/` | `naming.md` を削除し `README.md` / `core.md` / `file.md` / `method.md` へ分割 | `function-migration-ledger.md` の完了gate全項目を充足。contract代表句34件の照合で欠落ゼロ、旧path参照ゼロ、`plugin validation passed` | [documentationによって成立する知識体系](#documentationによって成立する知識体系) |
| `plugins/tumeda-dev/docs/documentation_standards/file_naming.md` / `entity_modeling.md`（2箇所） | 参照先を `naming/file.md` / `naming/core.md` へ更新 | 新pathの実在を確認 | 同上 |
| version宣言値4箇所 + `validate-plugin.mjs` の `expectedRelease` | `7.3.1` → `7.3.2`（PATCH） | 5箇所を置換し `plugin validation passed` | [（付録）version bump](#付録変更の実行区分) |
| `plugins/tumeda-dev/skills/maintenance-plugin-context/SKILL.md` | `## Plugin version` へ、MINORとPATCHの境界を「consumerが新たに呼べるものが増えたか」で判定する旨を追加 | `plugin validation passed` | steering Step 4-1 の doc-enricher review（論点3の根本原因: version規約が新規標準fileの扱いを規定していなかった） |

### task-design内の対象成果物反映待ち

なし

### execution plan対象

なし。

すべての変更がskillとdocsのcontentであり、本番application codingに該当しない。合意済み内容から一意に反映でき、
他の未決事項へ依存せず、一つの連続した反映・validationで完了した。`naming.md` の分割は段階を踏む作業だが、
中間checkpointは `function-migration-ledger.md` が持ち、実行時に外部調整もrollback境界も必要としなかった。
</content>

# Design: think-throughの思考標準をdocs/think_standardsへ分割移管する

## 元の依頼内容

think-through スキルにある内容を plugins/tumeda-dev/docs/think_standards に移したい
1ファイルとして移管するというより、ファイルとして分けられるものは分けたい。
そして、元々スキルの中にあった、どのときに何を参照するっていうハンドリングはREADME.mdで行って、スキル自体は、ディレクトリを参照し、READMEのハンドリング方針で考えるって感じにしたい。

---

## 1. TL;DR

think-throughは「毎ターン適用する常時注入型」でありながら、453行31KBのSKILL.md一つに、常時適用のコア、場面別S1〜S9、標準群の維持規律、skill運用contractを同居させている。場面駆動という構成意図を持ちながら、物理的には場面に該当しない大部分も毎回読み込む形になっており、また思考の標準そのものがskillに閉じているため、skill以外のconsumerから引けず、標準の増改築がskill改版と結合している。

このsteeringの終了時には、思考の標準本体が`plugins/tumeda-dev/docs/think_standards/`配下の複数fileへownerを移し、`README.md`が「どの場面で何を参照するか」のハンドリング方針の正本になり、`SKILL.md`はtrigger、repository固有文脈、そのdirectoryを参照してREADMEのハンドリング方針で考えるという指示だけを持つentry pointになっている。移行前に成立していた判断能力は、明示合意した差分を除いて全量保存する。

---

## 前提とする既存仕様

- `plugins/tumeda-dev/skills/think-through/SKILL.md`（453行）: frontmatter description（trigger）、`## repository固有文脈`、`## 役割`、`## 構成意図（後続改善者へ）`、`## コア（常時適用、場面トリガー不要）`（C1、C2）、`## 場面別`（S1〜S9）で構成される。各場面は**主軸を1つだけ**立て、残りを補助として並べる。S2は「思考フォーマットはS1を使う」、S3補助は「S8に従って」、S8は「残る未決事項へS2とS3を適用」のように、場面間を`S番号`で相互参照している。
- 同`## 構成意図（後続改善者へ）`: 後続改善者への維持規律として「場面駆動を崩さない（性質グルーピングに戻さない）」「各場面の主軸は1個に絞る」「削除より再分類。失敗起点の知識を捨てない」「コアは全場面で例外なく適用のみ」を明記し、構成自体が暫定であること、変えてよいこと（場面の追加・統合・分割、主軸/補助の入れ替え、補助節の追記）を定めている。
- `plugins/tumeda-dev/docs/`: `common_standard/`、`development_standards/`、`documentation_standards/`、`doc_templates/`の4群があり、top-levelの`README.md`は存在しない。
- `plugins/tumeda-dev/docs/documentation_standards/README.md`: 「収録している標準」を`- **[file](./path)** — 一行説明`の箇条書きで並べ、末尾に「標準の置き方」（各標準は基本1ファイル、複数ファイルが要る場合はディレクトリ化してよい）を持つ。
- `plugins/tumeda-dev/docs/documentation_standards/case_coverage/README.md`: 傘の下の1トピックとして、隣接標準とのowner境界を先に示し、中身を「洗い出し」「表現」の塊へ分けて各fileへdispatchする形を取る。既存docs群における「READMEがdispatchを持つ」実例。
- `plugins/tumeda-dev/docs/common_standard/function_migration_policy.md`: 配置やownerを変えても挙動と意味を全量維持するfunction migrationの共通規範。baseline固定、構造ledgerとcontract ledgerの二層、`KEEP | MOVE | ADAPT | ADD | CHANGE | RETIRE`分類、順方向・逆方向・境界の照合、完了gateの正本。今回はskillからdocsへのowner移動そのものなので、この規範が適用される。
- skillからdocsを参照する既存pattern: `maintenance-plugin-context/SKILL.md`が`../../docs/common_standard/function_migration_policy.md`という相対pathでlinkしている。
- `plugins/tumeda-dev/skills/README.md`: 人間向けの目次。skill増減時に見出し1行の追加・削除で済むよう保つ方針を持ち、「共有リファレンス（skill ではない）」の節を持つ。

---

## 2. 要件（Requirements）

### MUST（必達）

- 移行前SKILL.md全478行の意味単位を、`function_migration_policy.md`の二層ledgerで分類し、明示合意した差分以外を全量保存する。
- 思考標準本体のownerを`plugins/tumeda-dev/docs/think_standards/`配下へ移す。
- 場面ごとに1file、コアを1file、維持規律を1fileへ分ける。一つのfileへ丸ごと移さない。
- 「どの場面で何を参照するか」のハンドリング方針を`think_standards/README.md`が所有する。
- `SKILL.md`は`think_standards/`のdirectoryとREADMEを指す入口だけを持ち、思考標準の内容を持たない。
- `.claude/hooks/think_through_session_start.sh`の注入文を、移管後のfile名と収録一覧へ同期する。
- `scripts/verification/validate-plugin.mjs`のthink-through assertionを移管後のownerへ付け替え、`node scripts/verification/validate-plugin.mjs`が`plugin validation passed`を返す状態を保つ。
- `function_migration_policy.md` §11の完了gate全項目を満たす。

### SHOULD（できれば）

- 場面9fileのfile名を動名詞で揃える。`core.md`と`evolution_policy.md`は場面ではないため揃えず、名前の形で性格の違いを示す。
- `plugins/tumeda-dev/docs/README.md`と`plugins/tumeda-dev/skills/README.md`の導線を、同じ変更集合の中で更新する。

### MAY（あれば嬉しい）

- なし

### 非目標

- 思考標準の内容そのものを改善・追加・削除すること（移行に伴い明示合意した差分を除く）。
- think-through以外のskillのSKILL.md変更。`skills/README.md`と新設する`docs/README.md`の目次更新は対象に含む。
- `docs/`配下の他標準群（`documentation_standards`等）の再編。

### 受け入れ基準

- `function_migration_policy.md` §11の完了gate全項目を満たす。
- 完了集計が`未監査 0 / 未分類削除 0 / 未分類追加 0`である。
- `node scripts/verification/validate-plugin.mjs`が`plugin validation passed`を返す。
- 移行後の`SKILL.md`に思考標準の内容が残っていない。frontmatter、h1、`## repository固有文脈`、`## 役割`、`## 思考標準の参照`だけで構成される。
- `think_standards/README.md`から、コア・場面9件・維持規律のすべてへlinkで辿れる。
- `.claude/hooks/think_through_session_start.sh`が注入するfile名がすべて実在し、hookがJSONとして正しく出力される。
- `plugins/tumeda-dev/docs/README.md`と`plugins/tumeda-dev/skills/README.md`からのlinkが切れていない。

---

## 3. 完成後の姿

<!-- 選択したoutcome section: skill-policy.md → documentation.md → file-deliverables.md → contract-preservation.md -->

### skillの役割と方針

#### think-through

移行後のthink-throughは、思考標準の内容を持たない。skillとしての運用契約と`think_standards/`への入口だけを持ち、内容の正本はdocs側にある。

skillが所有し続けるのは、trigger判定、`maintenance-plugin-context`へconsumer=`think-through`として委譲するrepository固有文脈の解決、および口調とリトマス試験紙による適用状態の外形的な観測方法である。いずれも思考の作法そのものではなく、skillの運用契約にあたる。

docsが所有するのは、思考標準の内容、場面のdispatch、形式のprecedence、維持規律である。`### 形式の優先順位`もdocs側へ移す。移行後に形式を示すのはdocs側の各fileであり、consumer skillが参照するのもdocsであるため、precedenceの宣言は形式を示す側と同じ場所に置く。

skillはdirectoryとREADMEを指すだけにとどめ、場面一覧や引き方の手順を複製しない。複製するとREADMEの収録一覧と二重正本になり、場面を追加・統合・分割するたびに二箇所を直すことになる。

---

### documentationによって成立する知識体系

**分割単位は場面とする。** 場面S1〜S9をそれぞれ1file、コアC1・C2を1file、ハンドリング方針を持つ`README.md`を1file置く。場面をまとめず、主軸・補助を独立fileへ分けない。

```text
plugins/tumeda-dev/docs/think_standards/
├── README.md                     # ハンドリング方針と収録一覧
├── core.md                       # 唯々諾々の禁止 / 修正前の方針合意
├── evolution_policy.md           # 維持規律（旧「構成意図（後続改善者へ）」）
├── starting_to_think.md          # 考え始め
├── receiving_feedback.md         # ユーザーから指摘・提案を受領した
├── advancing_discussion.md       # 議論進行中
├── writing_abstraction.md        # 抽象を書く
├── updating_types.md             # 型・スキル・テンプレートを直したい
├── handling_errors.md            # エラーが出た
├── presenting_options.md         # 選択肢を提示する
├── ordering_parallel_items.md    # 複数事項が並ぶ、または作業中に事項の状態が変わった
└── designing_for_variations.md   # 広くvariationのある対象へ適用方針を作る
```

各場面fileは移行前の場面節をそのまま持つ。主軸を先頭に置き、その場面の補助節を同じfileへ続ける。9場面のfile名は動名詞で表面と抽象度を揃え、`core.md`と`evolution_policy.md`は場面ではないため揃えずに性格の違いを示す。

この分割は、think-throughの`## 構成意図（後続改善者へ）`が定める「場面駆動を崩さない」「各場面の主軸は1個に絞る」を、file構造として保証する。またコアと全場面の主軸は`.claude/hooks/`で毎session注入され、その一覧が場面から詳細へ降りるindexとして働くため、indexとfileが1対1で対応する。

**コアと維持規律は独立fileへ置く。** `README.md`はハンドリング方針と収録一覧だけを持ち、思考標準の内容も維持規律も内包しない。

`README.md`の構成は次のとおり。

| 見出し | 扱う内容 |
| --- | --- |
| 導入 | この標準群が何を担い、何を担わないか。skillからの入口であること |
| この標準群の引き方 | コアは場面を問わず先に適用する。該当する場面を判定し、その場面のfileを読む。複数の場面が同時に該当するなら該当分をすべて読む。形式はconsumer側の指定が優先される |
| 収録一覧 | コア、場面S1〜S9、維持規律への1行説明付きlink。記法は`documentation_standards/README.md`の`- **[file](./path)** — 一行説明`に合わせる |

READMEへ内容を内包しないのは、元の依頼がREADMEの役割をハンドリングと指定しているためである。加えて、コアを内包する利点であった「常時読むfileを1つに減らす」は、コアと全場面の主軸が毎session注入されるようになったため消えた。維持規律を分けるのは、4節34行がREADMEの過半を占めて収録一覧の導線を埋もれさせること、および読者が標準を引く側ではなく標準群を変える後続改善者であることによる。

**識別子を廃止し、参照はfile名の相対linkへ統一する。** 表示テキストには場面名を使い、`core.md`内の二つを指し分ける必要がある場合はanchorを添える。READMEの収録一覧も識別子列を持たない。

参照先がそのまま内容を示すため、識別子とfile名を対応づける変換表が不要になる。移行前の相互参照四箇所（S2→S1、S3補助→S8、S8→S2・S3）はこの形へ読み替える。

`.claude/hooks/` の注入文からも識別子を外してfile名を添えるが、この書き換えは移管の実施と同時に行う。file が存在しない状態でpathを注入すると、参照先のないpathを毎session配ることになる。

**`think_standards/`はdocs直下の五つ目の群として並べる。** あわせて`plugins/tumeda-dev/docs/README.md`を新設し、五群への1行説明付きlinkと「群の置き方」を持つdocs全体の入口にする。

```text
plugins/tumeda-dev/docs/
├── README.md                 # 新設。五群への入口
├── common_standard/
├── development_standards/
├── doc_templates/
├── documentation_standards/
└── think_standards/          # 新設
```

入口fileを持つ群はそのfileを、持たない群はdirectoryまたは代表fileを指す。link先の形が揃わないのは対象の性質の違いによる。

`plugins/tumeda-dev/skills/README.md`のthink-through行へ、思考標準の本体が`../docs/think_standards/`にあることを示すlinkを一行足す。`documentation_standards/README.md`と他群のREADMEは変更しない。

**読者と成立させる判断:**

| 読者 | 利用場面 | codeや過去会話を再調査せず可能になる判断・action | 入口・読む順序 |
| --- | --- | --- | --- |
| think-throughを適用するAI agent | 思考・議論プロセスが絡む全場面 | 該当場面の作法を引き、事象の捉え方、原因を降ろす深さ、提案の粒度、検証の判定を決められる | `SKILL.md`の`## 思考標準の参照` → `README.md`の引き方 → 該当場面file |
| consumer skillを書く人 | consumer側で提案や選択肢の形式を指定する時 | preset形式を上書きしてよい範囲と、部分指定時にpresetが残る範囲が分かる | `README.md`の引き方 → `core.md`の形式の優先順位 |
| 標準群を変える後続改善者 | 場面の追加・統合・分割、主軸/補助の入れ替え、補助節の追記 | 崩してはいけない軸と変えてよい範囲が分かる | `README.md`の収録一覧 → `evolution_policy.md` |

**知識構造:**

```text
README.md（引き方と収録一覧）
├── core.md                     場面を問わず常に効く
│   ├── 唯々諾々の禁止
│   ├── 修正前の方針合意
│   └── 形式の優先順位          consumer指定がpresetに優先する
├── 場面別9file                  主軸1つ + その場面の補助
└── evolution_policy.md         維持規律。標準群を変える時だけ読む
```

**規範の根拠と適用境界:**

- 根拠となるpain・失敗: 脊髄反射の応答、浅い診断、場当たり的な変更。加えて、場面駆動の構成でありながら単一fileのため、該当しない場面まで毎回読み込む形になっていたこと。
- MUST: コアは場面を問わず適用する。形式はconsumer側の指定が優先される。
- SHOULD: 該当する場面のfileを読む。複数の場面が同時に該当するなら該当分をすべて読む。
- 適用対象: 思考・議論プロセスが絡む全場面。特定のdomain、言語、workflowを前提にしない。
- 例外・非目標: domain固有の判断基準（命名、architecture等）は対象外であり、対応する専用documentが持つ。
- 誤適用: presetの形式を保存formatへ流用すること。思考の順序をそのまま出力の見出し構成にすること。

**snapshotと維持規律:**

| 正しいsnapshot | single source of truth | 更新owner | 更新trigger | 腐敗signal・同時確認先 |
| --- | --- | --- | --- | --- |
| 思考標準の内容がdocs側だけにあり、SKILL.mdはdirectoryとREADMEを指す入口だけを持つ | `plugins/tumeda-dev/docs/think_standards/` | 標準群を変える後続改善者 | 場面の追加・統合・分割、主軸/補助の入れ替え、補助節の追記 | `.claude/hooks/think_through_session_start.sh`の注入文が収録一覧とずれる。`skills/README.md`と`docs/README.md`のlink切れ。SKILL.mdへ内容が戻る |

**完成後のdocument構造:**

- 配置: `plugins/tumeda-dev/docs/think_standards/`（上のtreeのとおり）
- 形式: Markdown。file名はsnake_caseで、既存docs群の慣習に合わせる
- 既存documentへ統合するか: 新owner。docs直下の既存四群はいずれも別主題であり、統合先にならない

---

### documentation以外のfile deliverable

**対象と読者:**

| file | 主な読者 | 読後または利用後にできること |
| --- | --- | --- |
| `plugins/tumeda-dev/skills/think-through/SKILL.md` | skillを起動するAI agent | 起動条件を判定し、repository固有文脈を解決し、`think_standards/`のREADMEへ降りて思考標準を引ける |

**完成後の内容と構造:**

```text
frontmatter（name / description）
# think-through スキル
## repository固有文脈
## 役割
## 思考標準の参照
```

`## 思考標準の参照`が持つのは、`plugins/tumeda-dev/docs/think_standards/`への相対path、READMEが引き方の正本であること、内容の正本がdocs側にあることの三点だけである。場面一覧と引き方の手順は複製しない。

**配置・形式:**

- 配置: `plugins/tumeda-dev/skills/think-through/`（据置）
- 形式: Markdown。frontmatterは既存skill schemaのまま
- 正本と重複防止: 場面一覧の正本は`think_standards/README.md`の収録一覧。SKILL.mdはdirectoryとREADMEを指すだけにとどめる

---

### contractの保存と明示差分

**baselineとevidence:**

| 項目 | 内容 |
| --- | --- |
| baseline | `aa9603e` + 移行開始前に合意済みの変更（論点23、論点25）を適用した`plugins/tumeda-dev/skills/think-through/SKILL.md`全478行 |
| 対象scope | think-through skillが持つ思考標準本体の、`plugins/tumeda-dev/docs/think_standards/`へのowner移動とfile分割 |
| ledger | [baseline-ledger.md](./baseline-ledger.md)（baselineと構造ledger）、`contract-ledger.md`（contract ledger。移行実施前に作成） |
| 一般procedureの正本 | `plugins/tumeda-dev/docs/common_standard/function_migration_policy.md` |

**完成後の差分宣言:**

次に記載する意味差分だけが変わる。baseline scope内のその他すべてのcontractは、ownerや配置が変わっても意味、条件、順序、強度、判断能力を保存する。

**完成後に変わること:**

| 完成後の意味差分 | 移行前との違い | 詳細owner | 出典 |
| --- | --- | --- | --- |
| think-through skillが思考標準の内容を持たず、`think_standards/`を参照してREADMEの引き方で考える | 移行前はSKILL.md本体が内容の正本だった | [skillの役割と方針](#skillの役割と方針) | ユーザー明示指示、論点4 |
| 場面とコアを識別子で呼ばず、file名の相対linkで参照する | 移行前は`S1`〜`S9`、`C1`、`C2`で相互参照していた | [documentationによって成立する知識体系](#documentationによって成立する知識体系) | 論点3 |

`CHANGE`は現時点で未識別である。contract ledgerの作成中に新たな`CHANGE`が判明した場合はdesign phaseへ戻す。

---

## 4. リスクと対策

| リスク | 対策 |
| --- | --- |
| 章をfileへ移す過程で、理由・失敗例・判断質問が「装飾」と誤認されて落ちる（`function_migration_policy.md` §9「章を要旨一つへ畳む」） | contract ledgerで意味単位ごとに分類し、逆方向照合でGit削除行を全件逆引きする |
| 常時注入型skillが、README + 複数fileの読み込みで実運用の負荷が上がる | コアと全場面の主軸を`.claude/hooks/`で毎session注入するため、常時分の把握に追加のfile読み込みが要らない。場面が該当した時だけそのfileを読む |
| contract ledgerの作成中に新たな`CHANGE`が判明し、移行実施後に発見すると戻る範囲が広がる | ledger完成時点を中間checkpointとし、`ADD | CHANGE | RETIRE`の未合意分ゼロを確認してから移行実施へ進む |
| 注入文が`think_standards/`のfile名を指すため、移管前に書き換えると参照先のないpathを毎session配る | 注入文の更新をtasklistの第三段階へ置き、移行実施の完了後に行う |
| validatorが`think-through/SKILL.md`へS8・S9本文を要求しており、移管すると`plugin validation failed`になる | assertionを移管後のownerへ付け替えるtaskを同じ変更集合へ含め、各段階の後にvalidatorを実行する |

---

## 5. テスト方針

`function_migration_policy.md` §7と§8に従う。

- **順方向照合**: `baseline-ledger.md`の全35構造範囲と、`contract-ledger.md`の全contractについて、移行後の具体的なownerと節、または合意済みの変更・廃止理由を確認する。12fileへ分散するため、合算して元の順序とlifecycleが再現されるかを通読する。
- **逆方向照合**: Git差分の削除行を起点に旧contract IDとdestinationを逆引きする。追加行と移行後の全contractからも、旧contract IDまたは合意済み`ADD`へ接続する。ledgerに載らない削除・追加が一行でもあれば完了としない。
- **境界照合**: skillとdocsを合算したworkflowを通読する。起動条件の判定、`maintenance-plugin-context`への委譲、`think_standards/`への参照、READMEからの場面dispatch、形式のprecedenceが、移行前と同じ判断を再現するかを確認する。
- **情報量signal**: 移行前478行と、移行後のSKILL.md・`think_standards/`配下12fileの合算行数を比較する。減少した範囲は、意味が別の場所へ移ったのか合意済みで廃止されたのかを全件説明できるまで完了扱いにしない。
- **完了集計**: `適合 N / 合意済み追加 N / 合意済み変更 N / 明示廃止 N / 未監査 0 / 未分類削除 0 / 未分類追加 0` を示す。
- **black-box scenario**: white-box完了後に、旧contractから導出したscenarioを実行する。例として、選択肢を提示する場面でどの形式を使うかをREADMEから引けるか、修正前の方針合意がコアとして場面を問わず引けるか、場面が複数該当する時に該当分をすべて読む指示へ到達できるかを確認する。

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

なし

### task-design内の対象成果物反映待ち

なし

### execution plan対象

| 対象 | 掲載理由 | 参照するdesign section |
| --- | --- | --- |
| `contract-ledger.md` | 段階実行。完成時点に`ADD | CHANGE | RETIRE`の未合意分ゼロを確認する中間checkpointを持ち、ここで新たな`CHANGE`が出ればdesign phaseへ戻る | [contractの保存と明示差分](#contractの保存と明示差分) |
| `plugins/tumeda-dev/docs/think_standards/` 配下12file、`plugins/tumeda-dev/skills/think-through/SKILL.md` | 段階実行。ledger完成と未分類ゼロの確認を経てからでなければ着手できない | [documentationによって成立する知識体系](#documentationによって成立する知識体系) |
| `plugins/tumeda-dev/docs/README.md`、`plugins/tumeda-dev/skills/README.md`、`.claude/hooks/think_through_session_start.sh` | 段階実行。`think_standards/`配下のfileが存在してからでなければfile名を書けない | [documentationによって成立する知識体系](#documentationによって成立する知識体系) |
| `scripts/verification/validate-plugin.mjs` | 段階実行。assertionの付け替え先fileが存在してからでなければ`requireExists`と`requireText`が通らない | [documentationによって成立する知識体系](#documentationによって成立する知識体系) |
| white-box検証と完了集計 | 段階実行。移行実施の完了後でなければ順方向・逆方向照合を実行できない | [contractの保存と明示差分](#contractの保存と明示差分) |

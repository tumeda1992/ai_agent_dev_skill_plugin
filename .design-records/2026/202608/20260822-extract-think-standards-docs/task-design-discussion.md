# 議論記録

## 論点1: think_standards/ の分割単位

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0: 思考標準本体をどの単位でfileへ分けるかを決める

#### 提案0

**推奨:** a。移行前SKILL.mdの `## 構成意図（後続改善者へ）` が「場面駆動を崩さない（性質グルーピングに戻さない）」「各場面の主軸は1個に絞る（複数立てると主軸が薄まる）」を維持規律として明記しており、これは移行時に保存すべきcontractである。1場面1fileにすると、この「主軸1個」が運用者の自制ではなくfile構造として保証され、READMEのdispatchも「場面 → file」の1対1で最も引きやすくなる。

以下のtreeにあるfile名は分割単位を示すための暫定である。file名規則と場面識別子（移行前の `S1`〜`S9`、`C1`、`C2`）を残すかは別decisionとして後続で扱う。ここで判断するのは「どの内容が同じfileに入り、どこで切れるか」だけである。

##### a. 場面を単位にし、1場面1fileへ分ける

```text
plugins/tumeda-dev/docs/think_standards/
├── README.md                # ハンドリング方針（場面 → file のdispatch）
├── core.md                  # C1 唯々諾々の禁止 / C2 修正前の方針合意
├── starting_to_think.md     # S1 考え始め
├── receiving_feedback.md    # S2 ユーザーから指摘・提案を受領した
├── during_discussion.md     # S3 議論進行中
├── writing_abstraction.md   # S4 抽象を書く
├── fixing_types.md          # S5 型・スキル・テンプレートを直したい
├── error_occurred.md        # S6 エラーが出た
├── presenting_options.md    # S7 選択肢を提示する
├── parallel_items.md        # S8 複数事項が並ぶ、または作業中に事項の状態が変わった
└── wide_variation.md        # S9 広くvariationのある対象へ適用方針を作る
```

各場面fileは、移行前の場面節をそのまま持つ。主軸を先頭に置き、その場面の補助節を同じfileへ続ける。たとえば `during_discussion.md` は主軸「問いはロジックツリーの上位から再帰的に掘り下げる」に、補助「TBDを使った暫定全体構成」「議論の収束を待つ」「合意の粒度」が続く。

`core.md` は場面ではなく「常時適用、場面トリガー不要」なので、場面fileと並べつつ性格が違う。これをREADMEへ内包するかは後続の別decisionとして扱う。

##### b. 場面を近縁でまとめ、4〜5fileへ分ける

```text
plugins/tumeda-dev/docs/think_standards/
├── README.md
├── core.md
├── discussion_process.md    # S1 + S2 + S3
├── abstraction.md           # S4
├── updating_types.md        # S5
└── execution_order.md       # S6 + S7 + S8 + S9
```

file数が減り、関連する場面を続けて読める。一方で `discussion_process.md` は主軸を3つ（事象→原因→提案→検証／自分で考えてから問う／ロジックツリー上位から再帰）持ち、`execution_order.md` は主軸を4つ持つ。

##### c. 主軸・補助それぞれを独立した標準fileにする

```text
plugins/tumeda-dev/docs/think_standards/
├── README.md                       # 場面 → 複数標準へのdispatch表
├── no_blind_acceptance.md          # C1
├── agree_before_fixing.md          # C2
├── fact_cause_proposal_verify.md   # S1主軸
├── think_before_asking.md          # S2主軸
├── recursive_top_down.md           # S3主軸
├── provisional_whole_with_tbd.md   # S3補助
├── waiting_for_convergence.md      # S3補助
├── agreement_granularity.md        # S3補助
├── abstraction_with_concrete.md    # S4主軸
...
```

`documentation_standards/` の「各標準は基本1ファイル」という置き方には最も素直に合う。file単位が思考の型と1対1になるため、標準単体を他skillから名指しで参照しやすい。

#### 提案背景

##### この提案が満たす必要のある条件

ユーザー要件は「1ファイルとして移管するというより、ファイルとして分けられるものは分けたい」であり、分割自体は前提である。決めるべきは切れ目をどこに置くかで、この結論がREADMEのハンドリング方針の形、file数、file名規則、SKILL.mdに残す記述をすべて規定するため、他のTBDより先に扱う。

同時に、今回は skill から docs への owner 移動そのものなので `plugins/tumeda-dev/docs/common_standard/function_migration_policy.md` が適用される。同policyは、移行前に成立していた判断能力を明示合意した差分以外は全量保存することを不変条件とし、`ADD | CHANGE | RETIRE` にはユーザーの明示指示または明示合意を要求する。したがって分割単位も、移行前SKILL.mdが持つcontractと両立するかで評価する必要がある。

##### 移行前SKILL.mdが持つ、分割単位を拘束するcontract

`## 構成意図（後続改善者へ）` は、後続改善者への維持規律として次を明記している。

- 場面駆動を崩さない（性質グルーピングに戻さない）
- 各場面の主軸は1個に絞る（複数立てると主軸が薄まる）
- 削除より再分類。失敗起点の知識を捨てない
- コアは「全場面で例外なく適用」のみ。場面限定は場面節へ

さらに旧構成の問題として「性質グルーピング（議論/抽象化/型/対話）だと読み手が『いま自分どの場面 → 何を引くか』検索できない / 全項目フラットで優先度濃淡なし → 無視される項目が出る」と記録されている。案cはこの旧構成へ構造として戻るため、単なる配置替えではなく、合意なしには選べない `CHANGE` にあたる。

##### 各案が全場面を扱えるかの確認

分量が極端に振れる場面で案aが破綻しないかを確認した。S6「エラーが出た」とS7「選択肢を提示する」はそれぞれ11行で、1fileとしては小さい。ただし既存docsには `documentation_standards/file_naming.md` が1行のpointer fileとして実在しており、小さいfileを置くこと自体は同階層の慣習に反しない。逆にS4は74行、S3は61行、S8は51行あり、これらをまとめると1fileが100行を超えて主軸が埋もれる。

案bで具体的にどこをまとめるかを当ててみると、最も近縁に見えるS1・S2・S3を束ねた時点で主軸が3つ同居する。これは「主軸が薄まる」として明示的に避けられている形であり、まとめる基準そのものが新たな論点になる。

##### 推奨案の弱点

案aには次の弱点があり、どちらも別decisionで吸収する必要がある。

- 複数場面が同時に該当する時、読み手は2〜3fileを読むことになる。移行前は1file内のスクロールで済んでいた。READMEのハンドリング方針が「該当場面が複数あるなら全部を読む」ことを明示しないと、1fileだけ読んで足りたと誤認する失敗が新たに生まれる。
- 場面間の相互参照（S2→S1、S3補助→S8、S8→S2・S3）がfile跨ぎになり、link切れの面が増える。移行前は同一file内のsection参照だったため、この面は存在しなかった。

#### 提案0へのフィードバック

**結果:** 案aを採用。

> aで

### 決定

`think_standards/`の分割単位を場面とする。場面S1〜S9をそれぞれ1file、コアC1・C2を1file、ハンドリング方針を持つ`README.md`を1file置く。場面をまとめず、主軸・補助を独立fileへ分けない。

file名は分割単位の決定に含めない。命名規則と、移行前の`S1`〜`S9`・`C1`・`C2`という場面識別子を保つかは別decisionとして扱う。

採用の根拠は三つある。

第一に、think-throughの`## 構成意図（後続改善者へ）`が維持規律として「場面駆動を崩さない（性質グルーピングに戻さない）」「各場面の主軸は1個に絞る」を明記している。1場面1fileにすると、主軸1個が運用者の自制ではなくfile構造として保証される。

第二に、案cが採る主軸・補助単位の分割は、同章が旧構成の問題として記録した性質グルーピングそのものである。配置替えではなく`CHANGE`にあたり、`plugins/tumeda-dev/docs/common_standard/function_migration_policy.md`上の明示合意を要する変更になる。

第三に、論点22の決定によりコアと全場面の主軸が毎session注入されるようになった。この注入は場面順に並ぶ主軸一覧であり、場面から詳細へ降りるindexとして働く。1場面1fileならindexとfileが1対1で対応する。案bは主軸9個に対しfile5個となり、主軸からfileを引く段が一つ増える。案cはindexが場面で並ぶのにfile配置に場面が存在せず、対応しない。

提案0が挙げた弱点のうち、複数場面が同時に該当する時に複数fileを読む点は、注入された主軸一覧で該当場面を判定できるため、fileを開いて確かめる必要はなくなった。残る弱点は、場面間の相互参照（S2→S1、S3補助→S8、S8→S2・S3）がfile跨ぎになることであり、識別子の別decisionで扱う。

## 論点2: コアと構成意図の置き場所を決める

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0: READMEをdispatchに限定し、内容を独立fileへ出す

#### 提案0

コアC1・C2を独立fileへ、`## 構成意図（後続改善者へ）`も独立fileへ置く。`README.md`はハンドリング方針と収録一覧だけを持ち、思考標準の内容も維持規律も内包しない。

##### 完成後のdirectory構造

file名は論点3（識別子とfile名）で確定するため、ここでは役割を`{}`で仮置きする。

```text
plugins/tumeda-dev/docs/think_standards/
├── README.md          # ハンドリング方針と収録一覧のみ
├── {コア}              # C1 唯々諾々の禁止 / C2 修正前の方針合意（補助含む）
├── {維持規律}          # なぜこの構成か / 暫定であること / 改善時に守ってほしい軸 / 変えてよいこと
├── {S1} 〜 {S9}       # 場面別。論点1で決定済み
```

##### `README.md`の見出し構成

| 見出し | 扱う内容 |
| --- | --- |
| 導入 | この標準群が何を担い、何を担わないか。skillからの入口であること |
| この標準群の引き方 | コアは場面を問わず先に適用する。該当する場面を判定し、その場面のfileを読む。複数の場面が同時に該当するなら該当分をすべて読む。形式はconsumer側の指定が優先される |
| 収録一覧 | コア、場面S1〜S9、維持規律への1行説明付きlink |

`documentation_standards/README.md`が採る`- **[file](./path)** — 一行説明`の形を収録一覧に使う。

#### 提案背景

##### 論点1の決定文との関係

論点1の提案0は、案aのtreeにコアのfileを含めつつ、本文で「これをREADMEへ内包するかは後続の別decisionとして扱う」と明示的に判断を送っていた。一方、論点1の決定文は「コアC1・C2を1file」と書いており、提案0が送った判断まで確定したように読める。

本提案はコアの置き場所を改めて判断対象に含める。結論が独立fileで一致すれば論点1の決定文はそのまま有効であり、README内包へ変わる場合は論点1の決定文を現在有効な表現へ同期する。

##### 提案0が満たす必要のある条件

元の依頼は「どのときに何を参照するっていうハンドリングはREADME.mdで行って、スキル自体は、ディレクトリを参照し、READMEのハンドリング方針で考える」である。READMEの役割はハンドリングであり、思考標準の内容の正本ではない。コアをREADMEへ内包すると、READMEが引き方と内容の両方を持ち、この指定と食い違う。

##### 論点22の決定が前提を変えたこと

提案を検討し始めた時点では、コアをREADMEへ内包する利点があった。コアは「常時適用、場面トリガー不要」なので、READMEへ内包すれば常時読むfileが1つで済み、常時注入型skillの読み込み負荷を抑えられる、という理屈である。design.mdの「リスクと対策」にも、この負荷をTBD-2の判断軸に含めると記録している。

論点22の決定でこの前提が変わった。`.claude/hooks/think_through_session_start.sh`がC1・C2の要約を毎session注入するようになったため、常時分の把握に追加のfile読み込みが要らない。READMEへ内包する利点が消え、READMEの役割を薄く保つ側だけが残る。

##### 維持規律を独立fileにする理由

`documentation_standards/README.md`は末尾に「標準の置き方」を持ち、dispatchと維持規律を同じfileへ置く前例がある。ただしそこは2項目の短い規約であり、think-throughの`## 構成意図（後続改善者へ）`は4節34行を占める。同じ形で内包すると、READMEの過半が維持規律になり、収録一覧を引く導線が埋もれる。

読者も異なる。維持規律の読者は標準群を変える後続改善者であり、標準を引く読み手ではない。標準を引くたびに改善者向けの規律が目に入るのは、READMEを引き方の入口として使う妨げになる。`skills/README.md`も「詳細は書かない」「トップ階層に何があるかを一目で把握できることを最優先する」を方針として明記している。

独立fileにしたうえで、READMEの収録一覧からlinkする。維持規律の存在自体は一覧から辿れるため、埋没しない。

#### 提案0へのフィードバック

**結果:** 受諾。

> ok

### 決定

コアC1・C2を独立fileへ、`## 構成意図（後続改善者へ）`を別の独立fileへ置く。`README.md`はハンドリング方針と収録一覧だけを持ち、思考標準の内容も維持規律も内包しない。

READMEは、この標準群が何を担うかの導入、引き方（コアを場面を問わず先に適用する。該当する場面を判定してそのfileを読む。複数の場面が同時に該当するなら該当分をすべて読む。形式はconsumer側の指定が優先される）、およびコア・場面S1〜S9・維持規律への1行説明付きlinkによる収録一覧で構成する。収録一覧の記法は`documentation_standards/README.md`の`- **[file](./path)** — 一行説明`に合わせる。

コアをREADMEへ内包しない理由は二つある。元の依頼がREADMEの役割をハンドリングと指定しており、内容の正本を持たせると役割が混ざる。加えて、内包の利点であった「常時読むfileを1つに減らす」は、論点22の決定でコアと全場面の主軸が毎session注入されるようになったため消えた。

維持規律をREADMEへ内包しない理由も二つある。`documentation_standards/README.md`の「標準の置き方」は2項目の短い規約だが、`## 構成意図（後続改善者へ）`は4節34行を占め、内包するとREADMEの過半が維持規律になって収録一覧を引く導線が埋もれる。また読者が異なり、維持規律の読者は標準群を変える後続改善者であって、標準を引く読み手ではない。

この決定により、論点1の決定文にある「コアC1・C2を1file」は有効なまま維持される。

## 論点3: 場面識別子とfile名を決める

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0: 識別子を保ち、file名には焼き込まない

#### 提案0

`S1`〜`S9`、`C1`、`C2`の識別子を保つ。file名には識別子を含めず、場面の内容を表すsnake_caseにする。両者の対応はREADMEの収録一覧が持つ。

##### file名

| 識別子 | file名 | 場面 |
| --- | --- | --- |
| C1・C2 | `core.md` | 唯々諾々の禁止 / 修正前の方針合意 |
| — | `evolution_policy.md` | 維持規律（旧`## 構成意図（後続改善者へ）`） |
| S1 | `starting_to_think.md` | 考え始め |
| S2 | `receiving_feedback.md` | ユーザーから指摘・提案を受領した |
| S3 | `advancing_discussion.md` | 議論進行中 |
| S4 | `writing_abstraction.md` | 抽象を書く |
| S5 | `updating_types.md` | 型・スキル・テンプレートを直したい |
| S6 | `handling_errors.md` | エラーが出た |
| S7 | `presenting_options.md` | 選択肢を提示する |
| S8 | `ordering_parallel_items.md` | 複数事項が並ぶ、または作業中に事項の状態が変わった |
| S9 | `designing_for_variations.md` | 広くvariationのある対象へ適用方針を作る |

場面9件は動名詞で表面と抽象度を揃える。`core.md`と`evolution_policy.md`は場面ではないため揃えず、名前の形で性格の違いを示す。`_policy`接尾辞は`function_migration_policy.md`、`modify_description_policy.md`に揃える。

##### 相互参照の書き方

file跨ぎになる参照は、識別子を表示テキスト、file を link 先にする。

```markdown
未決事項と依存関係がない確定事項は[S8](./ordering_parallel_items.md)に従って先に完了する。
```

移行前の参照はS2→S1、S3補助→S8、S8→S2・S3の四箇所。同一file内に閉じる参照は識別子のままでよい。

#### 提案背景

##### 識別子を廃止しない理由

識別子は三つの場所で現に使われている。`.claude/hooks/think_through_session_start.sh`が注入する主軸一覧は`- S1 考え始め:`の形で並ぶ。移行前SKILL.md本文の相互参照が四箇所ある。そしてこのsteeringの会話自体が「S1」「S7」「C1」で場面を指しており、共通語彙として成立している。

廃止すると`plugins/tumeda-dev/docs/common_standard/function_migration_policy.md`上の`RETIRE`にあたり、hook注入文の書き換えと、会話語彙の喪失を伴う。保つ側に利益がある。

##### file名へ識別子を焼き込まない理由

`s1_starting_to_think.md`のように番号を含めれば、注入文の`S1`からfileへ直行できる。1段短い。

一方でthink-throughの`## 構成意図（後続改善者へ）`は「変えてよいこと」として「場面の追加・統合・分割」を明示的に許している。番号をfile名へ焼くと、場面を統合または分割するたびにfile renameが発生し、番号を詰め直すか欠番を残すかの判断が要る。分割時は`s3a_`のような番号がfile名へ現れる。運用で調整する前提の構成に対して、file名が変更コストを持つ形になる。

直行できないことの実コストは薄い。READMEはハンドリングの正本であり、引く側は必ず読む。その収録一覧に識別子とfile名が並ぶため、`S1`からfileへは1段で降りられる。

##### hook注入文を変更しないこと

識別子を保つため、`.claude/hooks/think_through_session_start.sh`と`think_through_user_prompt.sh`は本論点の変更対象にならない。注入文の`S1`〜`S9`、`C1`、`C2`は移管後もそのまま場面を指す。

##### file名がdocsの命名規約を満たすこと

`plugins/tumeda-dev/docs/development_standards/naming.md` §2は、同階層で表面と抽象度を揃えること、直上ディレクトリの文脈をファイル名へ重複させないこと、docsはsnake_caseを使うことを定めている。

場面9件は動名詞で揃えた。`think_`のような親の文脈は含めていない。`core.md`と`evolution_policy.md`が動名詞で揃わないのは、両者が場面ではなく別カテゴリであるためで、同章が禁じる「1つだけ足並みを乱す抽象度」には当たらない。カテゴリの違いはREADMEの収録一覧が明示する。

#### 提案0へのフィードバック

**結果:** 識別子の価値の否定。使う側をfile参照へ変えれば識別子は不要。

> 今更識別子が意味を持つの？ 別に使ってる側をファイル参照にすればよくない？

提案0が挙げた三つの根拠は、いずれも使う側をfile参照へ変えれば消える。hook注入文は`- 考え始め（starting_to_think.md）:`とすればfile名が直接出るため、READMEを経由する段がむしろ減る。本文の相互参照は表示テキストを場面名にすればよく、識別子である必要がない。会話の共通語彙という根拠も弱い。このsteeringでは毎回「S8（複数事項が並ぶ）」のように補って書いており、補わないと通じない時点で識別子単体は語彙として機能していない。

加えて提案0には見落としがある。file名へ番号を焼き込まない根拠として「場面の統合・分割で番号が壊れる」を挙げたが、これは識別子そのものの性質であり、file名から本文へ問題を移しただけである。提案0は番号の維持コストを解決していない。

### イテレーション1: 識別子を廃止し、参照をfile名へ統一する

#### 提案1

`S1`〜`S9`、`C1`、`C2`の識別子を廃止する。参照はすべてfile名（相対link）で行う。file名は提案0の表をそのまま使う。

##### 参照の書き方

file跨ぎの参照は、場面名を表示テキスト、file を link 先にする。

```markdown
未決事項と依存関係がない確定事項は[複数事項が並ぶとき](./ordering_parallel_items.md)に従って先に完了する。
```

`core.md`はC1とC2の二つを収めるため、どちらを指すかが必要な場合はanchorを付ける。

```markdown
[修正前の方針合意](./core.md#修正前の方針合意)
```

移行前の相互参照はS2→S1、S3補助→S8、S8→S2・S3の四箇所。いずれもこの形へ読み替える。

##### READMEの収録一覧

識別子の列を持たない。file名と場面名の1行説明だけで構成する。

##### hook注入文

`.claude/hooks/think_through_session_start.sh`のコアと場面別の各行から識別子を外し、file名を添える。

```diff
-- C1 唯々諾々禁止: ユーザー発言を即反映せず、自分で咀嚼してから応答・反論する
-- C2 修正前合意: file の変更・作成・削除の前に方針を合意する
+- 唯々諾々禁止（core.md）: ユーザー発言を即反映せず、自分で咀嚼してから応答・反論する
+- 修正前合意（core.md）: file の変更・作成・削除の前に方針を合意する
```

```diff
-- S1 考え始め: 事象（具体） → 原因（再発が止まる深さまで） → 提案（合意後に何が変わるか読める） → 検証（目下の課題が解けそうか）
+- 考え始め（starting_to_think.md）: 事象（具体） → 原因（再発が止まる深さまで） → 提案（合意後に何が変わるか読める） → 検証（目下の課題が解けそうか）
```

他の場面行も同じ形にする。

##### hook書き換えのタイミング

この書き換えは移管の実施と同時に行う。`think_standards/`配下のfileが存在しない状態で注入文へfile名を書くと、参照先のないpathを毎session配ることになる。論点23と論点25のhook変更は本文との内容同期だったため即時適用できたが、本件はfile参照を含むため、移管完了まで適用しない。

#### 提案背景

##### 前の提案から維持・置換したもの

- **維持:** file名の表。9場面を動名詞で揃え、`core.md`と`evolution_policy.md`を別カテゴリとして扱う点。`plugins/tumeda-dev/docs/development_standards/naming.md` §2との整合。
- **置換:** 識別子を保つという判断を撤回する。参照はすべてfile名へ統一し、READMEの収録一覧からも識別子列を外す。hook注入文を変更対象へ加える。

##### 識別子が要求する変換表がなくなること

提案0は、識別子とfile名の対応をREADMEの収録一覧が持つ構成だった。この対応表は、識別子が中身を示さないために必要になるものである。参照をfile名へ統一すれば、参照先がそのまま内容を示すため、対応表そのものが不要になる。READMEは収録一覧をfile名と1行説明だけで構成できる。

##### `RETIRE`として扱うこと

識別子の廃止は移行前contractの削除にあたる。`plugins/tumeda-dev/docs/common_standard/function_migration_policy.md`は`RETIRE`にユーザーの明示指示または明示合意を求めており、本論点のfeedbackがその指示にあたる。contract ledgerでは、識別子とそれを使う相互参照を`RETIRE`と`ADAPT`へ分けて登録する。参照そのものは意味を保って残るため`ADAPT`、識別子という呼称は`RETIRE`である。

#### 提案1へのフィードバック

**結果:** 受諾。

> ok

### 決定

`S1`〜`S9`、`C1`、`C2`の識別子を廃止する。参照はすべてfile名の相対linkで行い、表示テキストには場面名を使う。`core.md`内のC1・C2を指し分ける必要がある場合はanchorを添える。READMEの収録一覧は識別子列を持たず、file名と1行説明だけで構成する。

file名は次のとおり。9場面は動名詞で表面と抽象度を揃える。`core.md`と`evolution_policy.md`は場面ではないため揃えず、名前の形で性格の違いを示す。`_policy`接尾辞は`function_migration_policy.md`、`modify_description_policy.md`に揃える。

| file名 | 収める内容 |
| --- | --- |
| `core.md` | 唯々諾々の禁止 / 修正前の方針合意 |
| `evolution_policy.md` | 維持規律（旧`## 構成意図（後続改善者へ）`） |
| `starting_to_think.md` | 考え始め |
| `receiving_feedback.md` | ユーザーから指摘・提案を受領した |
| `advancing_discussion.md` | 議論進行中 |
| `writing_abstraction.md` | 抽象を書く |
| `updating_types.md` | 型・スキル・テンプレートを直したい |
| `handling_errors.md` | エラーが出た |
| `presenting_options.md` | 選択肢を提示する |
| `ordering_parallel_items.md` | 複数事項が並ぶ、または作業中に事項の状態が変わった |
| `designing_for_variations.md` | 広くvariationのある対象へ適用方針を作る |

`.claude/hooks/think_through_session_start.sh`の注入文からも識別子を外し、各行へfile名を添える。この書き換えは移管の実施と同時に行う。`think_standards/`配下のfileが存在しない状態でfile名を注入すると、参照先のないpathを毎session配ることになるため、移管完了まで適用しない。

識別子の廃止は`plugins/tumeda-dev/docs/common_standard/function_migration_policy.md`上の`RETIRE`にあたる。contract ledgerでは、参照そのものは意味を保って残るため`ADAPT`、識別子という呼称を`RETIRE`として登録する。

## 論点4: 移行後SKILL.mdの残置範囲を決める

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0: skill運用契約だけを残し、形式の優先順位もdocsへ出す

#### 提案0

移行後の`plugins/tumeda-dev/skills/think-through/SKILL.md`は、skillとしての運用契約と`think_standards/`への入口だけを持つ。思考標準の内容、形式のprecedence、維持規律はすべてdocsへ移す。

##### 移行後SKILL.mdの見出し構成

| 見出し | 扱う内容 | 由来 |
| --- | --- | --- |
| frontmatter | `name`と`description`。起動条件としての場面列挙 | 据置。ただし内容はADAPT（後述） |
| `# think-through スキル` | h1 | 据置 |
| `## repository固有文脈` | `maintenance-plugin-context`へのconsumer委譲 | 据置 |
| `## 役割` | 矯正対象、口調と内容の別軸、リトマス試験紙、session再起動 | 据置。ただし一文をADAPT（後述） |
| `## 思考標準の参照` | `plugins/tumeda-dev/docs/think_standards/`を参照し、そのREADMEのハンドリング方針に従って考える指示 | ADD |

`## 思考標準の参照`が持つのは、directoryの相対path、READMEが引き方の正本であること、内容の正本がdocs側にあることの三点にとどめる。場面一覧や引き方の手順をSKILL.mdへ複製しない。複製すると、docs側のREADMEと二重正本になる。

##### `### 形式の優先順位`をdocsへ移す

論点23で`## 役割`へ追加した`### 形式の優先順位`は、`core.md`へ移す。

移行後、形式を示すのはdocs側の各fileである。選択肢の記号は`presenting_options.md`が、抽象と具体の並べ方は`writing_abstraction.md`が持つ。consumer skillが参照するのもdocsであり、precedenceの宣言は形式を示す側と同じ場所にあるべきである。SKILL.mdへ残すと、宣言と対象が別のfileに分かれる。

`core.md`を行き先とするのは、移行前の`## コア（常時適用、場面トリガー不要）`と同じ「場面を問わず常に効く」性格を持つためである。C1・C2が思考の作法、形式の優先順位が適用条件という違いはあるが、常時適用という括りは共通する。READMEへ入れないのは、理由・失敗例・判断の問いを含む18行がハンドリング方針を圧迫し、論点2で維持規律を外したのと同じ問題を起こすためである。

READMEの「この標準群の引き方」には、論点2の決定どおり「形式はconsumer側の指定が優先される」の一文だけを置き、詳細は`core.md`へlinkする。

##### frontmatterと`## 役割`のADAPT

| 対象 | 現行 | 移行後 |
| --- | --- | --- |
| `description`の場面列挙 | 「事象→原因→提案→検証 の構造で考え抜く」ほか、S1の旧表現と識別子前提の記述を含む | 論点25で書き換えたS1の内容と、識別子を使わない表現へ揃える |
| `## 役割`冒頭 | 「CLAUDE.md からオーケストレーションされ、毎ターン適用される」 | 論点22で`.claude/hooks/`による注入へ変わった実態に合わせる |

いずれも意味を変えず、現在の実態と移行後の構造へbindingを読み替える`ADAPT`である。

#### 提案背景

##### 提案0が満たす必要のある条件

元の依頼は「スキル自体は、ディレクトリを参照し、READMEのハンドリング方針で考える」である。SKILL.mdに内容が残ると、skillがdocsを参照する構成にならない。したがって判断は、どの範囲が「思考標準の内容」でどの範囲が「skillの運用契約」かの線引きに帰着する。

##### skill運用契約として残す根拠

`## repository固有文脈`は`maintenance-plugin-context`へconsumer=`think-through`として委譲する手順であり、skillのruntime契約である。docsは特定のskillのconsumer名を持たない。

`## 役割`の「口調（原始人モード）と内容（思考の深さ）は別軸」「リトマス試験紙: この作法ができていないとき、CLAUDE.md やこのスキルの指示を忘れているサイン。セッション再起動を検討する」は、skillが適用されているかを運用者が判定するための記述である。思考の作法そのものではなく、作法が効いているかの外形的な観測方法にあたる。docsへ移すと、標準を引く読み手にとって不要な運用情報が混ざる。

##### 二重正本を作らない境界

`## 思考標準の参照`に場面一覧を書きたくなるが、それは`think_standards/README.md`の収録一覧と同じ内容になる。skillとdocsの両方に一覧を持つと、場面を追加・統合・分割するたびに二箇所を直す必要が生じる。`plugins/tumeda-dev/docs/documentation_standards/supplier-consumer-relation.md`が挙げる1:Nの変更コストと同じ形である。SKILL.mdはdirectoryとREADMEを指すだけにとどめる。

#### 提案0へのフィードバック

**結果:** 受諾。

> 論点4も

### 決定

移行後の`plugins/tumeda-dev/skills/think-through/SKILL.md`は、frontmatter、h1、`## repository固有文脈`、`## 役割`、および新設する`## 思考標準の参照`で構成する。思考標準の内容、形式のprecedence、維持規律はすべてdocsへ移す。

`## 思考標準の参照`が持つのは、`plugins/tumeda-dev/docs/think_standards/`への相対path、READMEが引き方の正本であること、内容の正本がdocs側にあることの三点にとどめる。場面一覧や引き方の手順をSKILL.mdへ複製しない。複製するとREADMEの収録一覧と二重正本になり、場面を追加・統合・分割するたびに二箇所を直すことになる。

論点23で`## 役割`へ追加した`### 形式の優先順位`は`core.md`へ移す。移行後に形式を示すのはdocs側の各fileであり、consumer skillが参照するのもdocsであるため、precedenceの宣言は形式を示す側と同じ場所に置く。`core.md`を行き先とするのは、移行前の`## コア（常時適用、場面トリガー不要）`と同じ「場面を問わず常に効く」性格によるものである。READMEには論点2の決定どおり「形式はconsumer側の指定が優先される」の一文だけを置き、詳細は`core.md`へlinkする。

`## repository固有文脈`と`## 役割`をSKILL.mdへ残すのは、前者が`maintenance-plugin-context`へconsumer=`think-through`として委譲するruntime契約であり、後者の口調とリトマス試験紙がskillの適用状態を運用者が判定するための外形的な観測方法であるためである。いずれも思考の作法そのものではない。

あわせて二件を`ADAPT`として扱う。frontmatterの`description`は、論点25で書き換えたS1の内容と、識別子を使わない表現へ揃える。`## 役割`冒頭の「CLAUDE.md からオーケストレーションされ、毎ターン適用される」は、論点22で`.claude/hooks/`による注入へ変わった実態に合わせる。いずれも意味を変えないbindingの読み替えである。

## 論点5: think_standards/と既存docs群の関係付けを決める

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0: docs直下の一群として並べ、skills/README.mdへ導線を一行足す

#### 提案0

`think_standards/`を`plugins/tumeda-dev/docs/`直下の五つ目の群として並べる。top-level READMEは新設しない。導線は`skills/README.md`のthink-through行へ一行だけ足す。

##### `plugins/tumeda-dev/docs/` の完成後構造

```text
plugins/tumeda-dev/docs/
├── common_standard/
├── development_standards/
├── doc_templates/
├── documentation_standards/
└── think_standards/          # 新設
```

top-level READMEは作らない。現状も存在せず、各群はそれぞれのREADMEが入口になっている。

##### `plugins/tumeda-dev/skills/README.md`

```diff
-- **think-through** — 議論・思考プロセスの作法。毎ターン適用する想定の常時注入型。steering / task-design を呼ぶ前段にも効く。
+- **think-through** — 議論・思考プロセスの作法。毎ターン適用する想定の常時注入型。steering / task-design を呼ぶ前段にも効く。思考標準の本体は [`../docs/think_standards/`](../docs/think_standards/README.md)。
```

##### 変更しないもの

- `plugins/tumeda-dev/docs/documentation_standards/README.md`。同fileの収録一覧は自身の傘下の標準を並べるものであり、docs直下の別群を列挙する場所ではない。
- 他の群のREADME。`think_standards/`から参照する必要が生じた場合は、参照する側の本文からrelative pathで指す。

#### 提案背景

##### 提案0が満たす必要のある条件

移管後、`think_standards/`は二方向から辿られる。skillからは`SKILL.md`の`## 思考標準の参照`が直接pathで指す（論点4の決定）。人がplugin全体を眺める場合は`skills/README.md`が入口になる。前者は論点4で確定しているため、本論点で決めるのは後者の導線と、docs群の中での位置付けである。

##### top-level READMEを新設しない理由

`plugins/tumeda-dev/docs/`にtop-level READMEは現在存在せず、四つの群がそれぞれ自分のREADMEを入口に持つ構造で運用されている。`think_standards/`もREADMEを持つため、同じ構造に収まる。

新設すると、群が増減するたびに更新が必要な目次が一つ増える。得られるのは「docs直下に何があるか」の一覧だが、それはdirectory listingで足りる。`plugins/tumeda-dev/skills/README.md`が「AI は各 skill の `SKILL.md` 冒頭の description を読めば把握できる」ため人間向けの目次として作られたのと違い、docs群には同等の必要性が確認できない。

##### 群名が同階層の慣習に合うこと

docs直下は`common_standard`、`development_standards`、`doc_templates`、`documentation_standards`である。`think_standards`はsnake_caseで、`_standards`接尾辞を持つ二群と表面が揃う。`plugins/tumeda-dev/docs/development_standards/naming.md` §2が求める「同階層の存在と足並みを揃える」を満たす。

##### `skills/README.md`へ一行だけ足す理由

同fileは「個々の skill の詳細は書かない」「トップ階層に何があるかを一目で把握できることを最優先する」「skill が増減したらこのREADMEも更新する。詳細は書かず、見出し1行の追加・削除で済むように保つ」を方針として明記している。

think-throughは、移管後も skill として存在し続けるが、内容の正本がdocs側へ移る。この所在が分からないと、skillのREADMEを見た人が「think-throughの中身はSKILL.mdにある」と誤解する。一行のlinkはこの誤解を防ぐ最小の記述であり、同fileの方針に反しない。

#### 提案0へのフィードバック

**結果:** 内容は受諾。top-level READMEを新設しない判断だけ否定。

> 内容okで、トップレベルも作っていい

`think_standards/`をdocs直下の五つ目の群として並べること、`skills/README.md`へ一行足すこと、`documentation_standards/README.md`と他群のREADMEを変更しないことは受諾された。否定されたのは、`plugins/tumeda-dev/docs/README.md`を新設しないという判断である。

### イテレーション1: docs直下へtop-level READMEを新設する

#### 提案1

提案0のうちtop-level READMEの扱いだけを変える。`plugins/tumeda-dev/docs/README.md`を新設し、docs直下の五群への入口にする。他の内容は提案0のまま。

##### `plugins/tumeda-dev/docs/README.md`

```markdown
# tumeda-dev docs

`tumeda-dev` plugin が参照する標準・規範・雛形を主題ごとの群に分けて置く場所。各群は自身のREADMEを入口に持つ。

## 収録している群

- **[common_standard/](./common_standard/function_migration_policy.md)** — 特定の主題に属さない共通規範。現在は、配置やownerを変えても挙動と意味を全量維持するfunction migrationの規範を収める。
- **[development_standards/](./development_standards/naming.md)** — 実装時の判断基準。現在は命名（基本方針、ファイル名、メソッド名）を収める。
- **[documentation_standards/](./documentation_standards/README.md)** — docsの書き方・構造化の標準群。読者の捉え方、情報構造化、ケース網羅、表現記法などを扱う。
- **[think_standards/](./think_standards/README.md)** — 思考・議論プロセスの標準群。場面ごとに何を引くかは同群のREADMEが扱う。
- **[doc_templates/](./doc_templates/)** — 汎用の雛形置き場。標準そのものではなく、標準に沿って書くための空のtemplateを置く。

## 群の置き方

- 群は主題単位で分ける。群のREADMEがその主題の入口になる。
- 一つのfileで足りる主題は群を作らず、既存の群へ置く。
- 群が増減したらこのREADMEも更新する。詳細は各群のREADMEへ委ね、ここには1行の概略だけを置く。
```

`common_standard/`と`development_standards/`はREADMEを持たず単一fileで構成されているため、linkは代表fileを直接指す。`doc_templates/`は雛形の置き場でREADMEも代表fileも持たないため、directoryを指す。

#### 提案背景

##### 前の提案から維持・置換したもの

- **維持:** `think_standards/`をdocs直下の五つ目の群として並べること。`skills/README.md`のthink-through行へ一行足すこと。`documentation_standards/README.md`と他群のREADMEを変更しないこと。群名がsnake_caseで`_standards`接尾辞の二群と表面が揃うこと。
- **置換:** top-level READMEを新設しないという判断を撤回する。

##### 新設が提案0の懸念を生まないこと

提案0は、群が増減するたびに更新が必要な目次が増えることを懸念していた。この懸念自体は残るが、`skills/README.md`が同じ性質の目次を既に持ち、「skill が増減したらこのREADMEも更新する。詳細は書かず、見出し1行の追加・削除で済むように保つ」という運用で維持されている。docs側も同じ形にすれば、更新は1行の追加・削除で済む。「群の置き方」節へこの運用を明記する。

##### 各群へのlink先が揃わないこと

`documentation_standards/`と`think_standards/`はREADMEを持つが、`common_standard/`と`development_standards/`は単一fileで構成されREADMEを持たない。`doc_templates/`は雛形の置き場で入口fileを持たない。

link先をdirectoryで統一すると、READMEのない群ではlistingへ落ちて概要が読めない。代表fileで統一すると、READMEを持つ群でその入口を素通りする。したがって、入口fileがある群はそれを、ない群はdirectoryを指す。この不揃いはlink先の性質の違いであり、`plugins/tumeda-dev/docs/development_standards/naming.md` §2が扱うファイル名の抽象度の揃えとは別問題である。

#### 提案1へのフィードバック

**結果:** 受諾。

> ok

### 決定

`think_standards/`を`plugins/tumeda-dev/docs/`直下の五つ目の群として並べる。群名はsnake_caseで、`_standards`接尾辞を持つ既存二群と表面が揃う。

`plugins/tumeda-dev/docs/README.md`を新設し、五群への1行説明付きlinkと「群の置き方」を持つdocs全体の入口にする。入口fileを持つ群はそのfileを、持たない群（`common_standard/`、`development_standards/`は単一file構成、`doc_templates/`は雛形置き場）はdirectoryまたは代表fileを指す。link先の形が揃わないのは対象の性質の違いによるものであり、統一しない。

「群の置き方」には、群を主題単位で分けること、群のREADMEが入口になること、一つのfileで足りる主題は群を作らず既存群へ置くこと、群が増減したらこのREADMEを1行の追加・削除で更新することを書く。`skills/README.md`が同性質の目次を同じ運用で維持している前例に倣う。

`plugins/tumeda-dev/skills/README.md`のthink-through行へ、思考標準の本体が`../docs/think_standards/`にあることを示すlinkを一行足す。同fileの「詳細は書かない」「見出し1行の追加・削除で済むように保つ」方針に収まる。

`documentation_standards/README.md`と他群のREADMEは変更しない。同fileの収録一覧は自身の傘下の標準を並べる場所であり、docs直下の別群を列挙する場所ではない。

## 論点6: 実行単位とledgerの配置を決める

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0: execution plan対象と判定し、leafのtasklistで扱う

#### 提案0

この移管をexecution plan対象と判定し、leafとして`tasklist.md`で扱う。ledgerはsteering directory配下へ二file構成で置く。

##### 実行単位

| 項目 | 判定 |
| --- | --- |
| execution plan対象 | 該当する |
| 該当する掲載条件 | 第二条件（順序依存する複数段階、中間checkpoint、独立した検証単位） |
| leaf / composite | leaf |
| 成果物 | `tasklist.md` |

##### ledgerの配置

| file | 内容 | 状態 |
| --- | --- | --- |
| `baseline-ledger.md` | baselineの固定、移行開始前に合意済みの変更、構造ledger（35範囲） | 作成済み |
| `contract-ledger.md` | contract ledger。各構造範囲を`function_migration_policy.md` §3の意味単位へ分解 | 新規。tasklistの最初の段階で作る |

両fileともこのsteering directory配下へ置く。`.steering/2026/202608/20260815-evaluate-discussion-entry-format/`が`baseline-ledger.md`をsteering directory直下へ置いている前例に倣う。構造ledgerとcontract ledgerを別fileにするのは、35構造範囲を意味単位へ分解した結果が一fileでは通読しにくい規模になるためである。

##### 段階の境界

tasklistの詳細設計はplan phaseで行う。ここで確定するのは、順序依存によって分かれる段階の境界だけである。

1. contract ledgerのsource側を作り、`ADD | CHANGE | RETIRE`の未合意分がないことを確認する
2. `think_standards/`配下11fileとSKILL.mdへ移行を実施する
3. `docs/README.md`、`skills/README.md`、`.claude/hooks/think_through_session_start.sh`を更新する
4. white-box検証（順方向・逆方向・境界・情報量signal・完了集計）を行う

段階3が段階2の後に来るのは、論点3の決定による。注入文へfile名を書くのは`think_standards/`配下のfileが存在してからでなければならない。

#### 提案背景

##### 第一条件に該当しない理由

task-designのStep 5が定める第一条件は「本番成果物として利用者へ届けるapplication、service、library、CLI、batch、infrastructure component等のruntime behaviorを変更し、testで正しさを確認する通常のapplication coding」である。

このrepositoryはplugin配布物であり、skillとdocsは利用者へ届ける成果物にあたる。ただし今回変更するのはすべてMarkdown contentであり、runtime behaviorの変更でもtestによる正しさの確認でもない。同Stepは「skill、prompt、documentation、template、規範等のcontent…は、今回の本番成果物でない限り第一条件に含めない」と定めており、content自体が届く対象であっても、第一条件が求めるcodingの実体を伴わない。

##### 第二条件に該当する理由

同Stepの第二条件は「順序依存する複数段階、中間checkpoint、外部調整、rollback境界、独立した検証単位が必要で、一つの連続した反映・validationでは安全に完了できない作業」である。

順序依存が二つ実在する。`function_migration_policy.md` §6は、ledgerを作り未分類をゼロにしてから移行を実施し、その後にwhite-box検証を行う順序を定めている。加えて論点3の決定により、hook注入文へfile名を書くのは移管完了後でなければならない。

独立した検証単位も実在する。white-box検証は順方向照合（移行前の全構造範囲と全contractに移行後のownerを対応づける）と逆方向照合（Git差分の削除行から旧contract IDを逆引きし、追加行から旧contract IDまたは合意済み`ADD`へ接続する）に分かれ、どちらも移行実施が完了してからでなければ実行できない。

中間checkpointも実在する。contract ledgerの完成時点で、`ADD | CHANGE | RETIRE`に未合意分が残っていないことを確認する必要がある。ここで新たな`CHANGE`が見つかればdesign phaseへ戻る。移行を進めてから発見すると、戻る範囲が広がる。

##### leafと判定する理由

同Stepはcompositeの条件を「二つ以上の相互に区別できる子scopeが必要で、各子が親より厳密に狭く、子全体で親DoDを満たす。依存はDAGにできる」と定め、「工程数が多いだけの分割はroadmapにしない」と明示している。

本件の段階は一本の順序で並び、分岐しない。各段階は独立した設計loopを必要とせず、合意済みdesignから一意に実行できる。工程数は四つあるが、それは段階実行の必要性であってscopeの分割ではない。したがってleafとして`tasklist.md`で扱う。

##### ledger作成をtasklistへ載せる理由

調査と技術検証実装はdesign phaseの不確実性解消手段であり、execution plan対象へ載せない。contract ledgerはこのどちらでもない。移行の作業成果物であり、`function_migration_policy.md` §11の完了gateが存在を要求する。

またcontract ledgerの完成は、未分類ゼロを確認する中間checkpointを持つ。段階実行の一部として扱うのが実態に合う。

#### 提案0へのフィードバック

**結果:** 受諾。

> ok

### 決定

この移管をexecution plan対象と判定し、leafとして`tasklist.md`で扱う。該当する掲載条件はtask-design Step 5の第二条件（順序依存する複数段階、中間checkpoint、独立した検証単位）である。第一条件には該当しない。変更対象はすべてMarkdown contentであり、runtime behaviorの変更でもtestによる正しさの確認でもない。

段階の境界は四つ。contract ledgerのsource側を作り`ADD | CHANGE | RETIRE`の未合意分がないことを確認する段階、`think_standards/`配下11fileとSKILL.mdへ移行を実施する段階、`docs/README.md`・`skills/README.md`・`.claude/hooks/think_through_session_start.sh`を更新する段階、white-box検証を行う段階である。第三段階が第二段階の後に来るのは、論点3の決定により注入文へfile名を書くのが移管完了後でなければならないためである。

compositeにはしない。段階は一本の順序で並んで分岐せず、各段階が独立した設計loopを必要としない。工程数の多さはscopeの分割ではない。

ledgerはこのsteering directory配下へ二file構成で置く。`baseline-ledger.md`がbaselineの固定と構造ledger（35範囲）を、新規の`contract-ledger.md`がcontract ledgerを持つ。contract ledgerの作成はtasklistの第一段階に含める。移行の作業成果物であり、`function_migration_policy.md` §11の完了gateが存在を要求し、完成時点に未分類ゼロの中間checkpointを持つためである。

## 論点7: validatorのthink-through assertionを移管後のownerへ追随させる

**ステータス:** 決定

**種別:** レビュー指摘

### イテレーション0: assertionをdocs側fileへ付け替え、think_standards配下を可搬性checkの対象に加える

#### 提案0

`scripts/verification/validate-plugin.mjs`を変更対象へ加える。移管によって内容が移るassertionを新しいownerへ付け替え、`think_standards/`配下を可搬性checkの対象に含める。

##### assertionの付け替え

現行の`thinkThroughSkill`（`plugins/tumeda-dev/skills/think-through/SKILL.md`）に対する`requireText` 11件と`forbidText` 1件は、対象文字列がすべてS8とS9の本文である。移管後、これらは`ordering_parallel_items.md`と`designing_for_variations.md`が持つ。

```diff
 const thinkThroughSkill = skillPath("think-through/SKILL.md");
+const thinkStandards = (name) => `${pluginRoot}/docs/think_standards/${name}`;
+const orderingParallelItems = thinkStandards("ordering_parallel_items.md");
+const designingForVariations = thinkStandards("designing_for_variations.md");
```

```diff
-for (const expected of [
-  "### S8. 複数事項が並ぶ、または作業中に事項の状態が変わった",
-  "**主軸: readyな確定事項を先に完了する**",
-  "未決事項への問いかけや新しい作業を先行させない",
-  "同じmessage、task、sessionに含まれる",
-  "必要な合意・入力・権限が揃うなら、先に完了する",
-  "### S9. 広くvariationのある対象へ適用方針を作る",
-  "**主軸: 具体caseと方針群を反復往復し、全caseを扱えるまで帰納する**",
-  "方針群が変わるたび5へ戻る",
-  "多様なcaseを一つの方式へ押し込む",
-  "taskを終えるため、豊富な具体を使わず演繹的に方針を作る",
-]) {
-  requireText(thinkThroughSkill, expected);
-}
-forbidText(
-  thinkThroughSkill,
-  "あるトピックについて議論している最中は、その議論が収束するまで次のアクションを提案・促すことは禁止。",
-  "独立した確定事項まで一括保留する旧ルール",
-);
+for (const expected of [
+  "**主軸: readyな確定事項を先に完了する**",
+  "未決事項への問いかけや新しい作業を先行させない",
+  "同じmessage、task、sessionに含まれる",
+  "必要な合意・入力・権限が揃うなら、先に完了する",
+]) {
+  requireText(orderingParallelItems, expected);
+}
+for (const expected of [
+  "**主軸: 具体caseと方針群を反復往復し、全caseを扱えるまで帰納する**",
+  "方針群が変わるたび5へ戻る",
+  "多様なcaseを一つの方式へ押し込む",
+  "taskを終えるため、豊富な具体を使わず演繹的に方針を作る",
+]) {
+  requireText(designingForVariations, expected);
+}
+forbidText(
+  orderingParallelItems,
+  "あるトピックについて議論している最中は、その議論が収束するまで次のアクションを提案・促すことは禁止。",
+  "独立した確定事項まで一括保留する旧ルール",
+);
```

`### S8.`と`### S9.`の見出し文字列を要求する2件は落とす。識別子を廃止し、場面ごとにfileを分ける決定により、見出しがfile名で表されるためである。file名は`requireExists`で担保する。

##### 移管後SKILL.mdへのassertion追加

内容がdocsへ移ったことをvalidatorが検知できるよう、SKILL.md側へ二件を加える。

```diff
+requireText(thinkThroughSkill, "docs/think_standards/");
+forbidText(
+  thinkThroughSkill,
+  "**主軸:",
+  "docsへ移した思考標準の内容がSKILL.mdへ戻っている",
+);
```

##### `think_standards/`配下の存在checkと可搬性check

```diff
+for (const name of [
+  "README.md",
+  "core.md",
+  "evolution_policy.md",
+  "starting_to_think.md",
+  "receiving_feedback.md",
+  "advancing_discussion.md",
+  "writing_abstraction.md",
+  "updating_types.md",
+  "handling_errors.md",
+  "presenting_options.md",
+  "ordering_parallel_items.md",
+  "designing_for_variations.md",
+]) {
+  requireExists(thinkStandards(name));
+}
```

`portableFiles`へ`think_standards/`配下12fileを加える。移管前は`think-through/SKILL.md`自体が`portableFiles`に含まれていないが、内容がdocsへ移ることで配布物の主要部分になるため、参照元repository名・絶対path・commit hash・固定localhost URLの混入checkを効かせる。

#### 提案背景

##### 発見の経緯

tasklistの品質check taskへ含める検証commandを解決するため、`scripts/verification/validate-plugin.mjs`を確認したところ、`think-through/SKILL.md`に対する`requireText` 11件と`forbidText` 1件が見つかった。対象文字列はすべてS8とS9の本文であり、移管によって内容が別fileへ移るため、そのままでは`plugin validation failed`になる。

現時点でvalidatorは`plugin validation passed`を返す。移管後も同じ状態を保つには、assertionを新しいownerへ付け替える必要がある。

##### designのscopeを広げること

design.mdの非目標は「think-through以外のskillのSKILL.md変更」であり、validatorはskillではないため非目標に該当しない。ただし変更対象としても列挙していなかった。本提案が合意されれば、`scripts/verification/validate-plugin.mjs`をMUST要件とexecution plan対象へ加える。

##### 見出しassertionを落とす理由

`### S8.`と`### S9.`の見出し文字列を要求する2件は、識別子を前提としている。論点3で識別子を廃止し、論点1で場面ごとにfileを分ける決定をしたため、場面の同定はfile名が担う。`requireExists`でfileの存在を担保すれば、見出し文字列の要求は重複する。

一方、主軸と本文を要求する残り9件は、内容が保存されているかを見ている。これは移管後も必要であり、ownerを変えて維持する。

##### SKILL.mdへassertionを加える理由

移管の目的は、思考標準の内容をdocs側へ移し、SKILL.mdを入口だけにすることである。この状態が崩れて内容がSKILL.mdへ戻っても、現行のassertionでは検知できない。

`requireText`で`docs/think_standards/`への参照が存在することを、`forbidText`で場面の主軸見出し記法`**主軸:`が現れないことを確認すれば、両方向から状態を守れる。

##### `portableFiles`へ加える理由

`portableFiles`は、参照元repository名、利用者の絶対path、commit hash、固定localhost URLの混入を禁じるcheckの対象である。現在の対象はskill本体とtemplateであり、`docs/`配下は含まれていない。

移管後、思考標準の本体は`think_standards/`配下へ移る。配布物として利用者へ届く主要部分が移動するため、同じ可搬性checkを効かせる。

#### 提案0へのフィードバック

**結果:** 受諾。

> ok

### 決定

`scripts/verification/validate-plugin.mjs`を変更対象へ加える。

`think-through/SKILL.md`に対する`requireText` 11件と`forbidText` 1件のうち、S8の本文を要求する4件と`forbidText`を`ordering_parallel_items.md`へ、S9の本文を要求する4件を`designing_for_variations.md`へ付け替える。`### S8.`と`### S9.`の見出し文字列を要求する2件は落とす。識別子を廃止して場面ごとにfileを分けたことで場面の同定はfile名が担い、`requireExists`と重複するためである。

移管後のSKILL.mdへ二件を加える。`requireText`で`docs/think_standards/`への参照が存在すること、`forbidText`で場面の主軸見出し記法`**主軸:`が現れないことを確認する。内容がdocsへ移った状態を両方向から守る。

`think_standards/`配下12fileを`requireExists`の対象に加え、`portableFiles`へも加える。配布物として届く主要部分がdocsへ移るため、参照元repository名・利用者の絶対path・commit hash・固定localhost URLの混入checkを効かせる。

design.mdのMUST要件とexecution plan対象へ`scripts/verification/validate-plugin.mjs`を加える。同fileの非目標「think-through以外のskillのSKILL.md変更」には該当しない。validatorはskillではない。

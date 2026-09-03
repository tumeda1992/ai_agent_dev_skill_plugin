# 議論記録

## 論点1: steeringのmodel・effort宣言を外す根拠

**ステータス:** 分解済み

**種別:** TBDヒアリング / 認識齟齬

### イテレーション0: 外す根拠を確定し、下位scopeの判定軸を得る

#### 提案0

**主根拠**

steeringのfrontmatterにある `model: sonnet` と `effort: high` は、**steeringが動く経路に対して効かない、または実運用と矛盾する宣言**である。これを主根拠として外す。

**なぜこれが主根拠か**

`model` と `effort` は、hostがそのskillを独立したchildとして起動する時に読む宣言である。この宣言を持つ他の3 skill（`tasklist-executor`、`test-runner`、`visual-inspector`）は `.claude/agents/` 由来で、`context: fork` を併記し、`runtime-execution-contracts.md` が「child処理の委譲先」として契約を定めている。宣言が効く場所に宣言がある。

steeringは違う。

- steeringはmain sessionへ読み込まれて適用されるorchestratorである。`allowed-tools` に `Agent` を持つのは、自分がchildを**起動する側**だからである。
- 現にこのsessionは Opus 5 で動いており、`model: sonnet` は主sessionのmodelを変えていない。宣言は無視されている。
- roadmapのphaseを子steeringへbindingする経路でhostがsubagentを起動する場合には `model: sonnet` が効く余地が残る。だがその場合、design合意とgate判定を担うorchestrationをSonnetへ固定することになり、`task-design` を `model: opus` とした判断（設計判断の質が要求される）と噛み合わない。効く場合も効かない場合も、この宣言は望ましい状態を作らない。

つまり「効かない宣言が置かれている」だけでなく、「効いた場合はさらに困る宣言が置かれている」。どちらの経路でも外すのが正しい。

**profile体系とのずれは、独立した欠陥ではなく同じ原因の別の症状として扱う**

`runtime-model-profiles.md` は profile を `standard-execution` の1つだけ持ち、使用skillを `visual-inspector` / `tasklist-executor` / `test-runner` と明記している。steeringは含まれない。adapter規則は「Claude Codeでは**profileに対応する** `model` frontmatterを使う」と定めている。

steeringが対応profileを持たずに `model: sonnet` を書いている状態は、この規則違反である。しかしこれは独立した理由ではない。profile体系が「child起動されるskillのmodel選択を吸収する仕組み」だから、main sessionで動くsteeringにprofileがないのは正しく、**profileがないのに宣言があること**が異常なのである。原因は上と同じ、宣言が効く場所ではない所に宣言が置かれていること。

したがって、profile体系そのものは今回の欠陥の原因ではなく、変更対象にもしない。

**汎用skill schema validatorの拒否は根拠に採らない**

`model` / `effort` を未知fieldとして汎用validatorが拒否する事実はある（`.steering/2026/202608/20260808-focus-tasklists-on-staged-implementation/design.md` に記録済み）。しかしそこで「toolの非対応でありacceptance failureにしない」と既に判断している。これを今回の主根拠に採ると、その判断を理由なく覆すことになる。外部tool都合は根拠に採らない。

**この結論が規定する下位判断**

| 下位のTBD | この根拠から導かれる向き |
| --- | --- |
| TBD-2 scope | 「宣言が効く場所か」が判定軸になる。`task-design` の `model: opus` は同じ経路（main session適用）にあり同じ穴。agent由来3 skillは宣言が効く場所なので対象外 |
| TBD-3 profile体系 | 変更しない。原因ではない |
| TBD-4 validator | assertionの削除は必須。再導入拒否の要否は別論点 |
| TBD-5 version bump | 効かない宣言の削除であり、consumerが呼べるものは増減しない |

**別の根拠があるなら教えてほしい**

依頼原文は一文であり、この根拠はassistantが調査事実から組み立てたものである。実際には別の理由（たとえば「hostのmodel選択をユーザーが握りたい」「特定hostで実害が出た」など）が起点なら、上の判定軸ごと変わる。

#### 提案背景

**起点となったuser input**

> steeringスキルからeffortとmodelの指定を外したい

**提案0が満たす必要のある条件**

このdiscussionの目的は `steering/SKILL.md` から2行を外すことだが、依頼原文はWHYを含まない。WHYが確定しないと、以下が一つも決まらない。

- 併せて変えるfileの範囲（`task-design` の `model: opus`、agent由来3 skillの宣言、profile体系そのもの）
- validatorに再導入拒否を入れるか
- version bump区分

そのため提案0は、単に「外す」ではなく「**何を判定軸にして外すか**」を示す必要がある。提案0の「なぜこれが主根拠か」で判定軸（宣言が効く場所か）を立て、「この結論が規定する下位判断」でその軸を下位TBDへ適用した向きを示すことで、この条件を満たす。

**判断材料になった調査事実**

- `runtime-model-profiles.md`: profileは `standard-execution` のみ。使用skillは `visual-inspector` / `tasklist-executor` / `test-runner`。steeringとtask-designは含まれない。adapter規則は「skill本文はprofile名を参照し、provider固有model名を判断根拠にしない」「Claude Codeではprofileに対応する`model` frontmatterを使う」「hostがprofile相当のmodelを選べない時は親model継承をfallbackとする」。
- `runtime-execution-contracts.md`: 「agent由来の3skillはfrontmatterに`context: fork`を保持する。これは宣言の静的契約であり、特定hostのruntime動作をこの文書の受け入れ条件にはしない。」
- frontmatter実測: model/effortなしが `escalate-plugin-skill-fix`、`facilitate-discussion`、`maintenance-plugin-context`、`name-work-directory`、`think-through`、`doc-enricher`。`steering` が `model: sonnet` + `effort: high`。`task-design` が `model: opus`。agent由来3 skillが `model: sonnet` + `context: fork` + `effort: medium`。
- `validate-plugin.mjs`: L438-440 が `task-design: model: opus`、`steering: model: sonnet`、`steering: effort: high` をassert。
- 実運用の観測: 本sessionは Opus 5 で動作し、`model: sonnet` は主sessionのmodelを変えていない。
- root `README.md` 運用契約: 「hostごとのmodel差は`runtime-model-profiles.md`の能力profileで吸収する。provider固有model名はskill手順の正本にしない。」

#### 提案0へのフィードバック

**結果:** 診断の置換要求。「宣言が効く場所ではない所に宣言がある」という構造的誤配置の診断は成立せず、実際の起点は「当時の運用前提が消えて足かせになった」ことだと示された。

> まぁ、昔sonnet中心で動かしていたときに、タスク設計だけはopus使いたいっていう指定のためにやっていただけで、今のopusデフォルトだと足かせにしかならないっていうりゆうなのよね

提案0は宣言が置かれた**意図**を知らずに、実測とprofile体系の規則から誤配置と推論していた。実際には、宣言はSonnet中心運用の中で`task-design`だけをOpusへ上げるための意図的な差分指定であり、置かれた当時は機能していた。誤りは配置ではなく、前提が変わったのに宣言が残っていることである。

提案0のうち、profile体系を変更対象にしない結論と、汎用validatorの拒否を根拠に採らない結論は影響を受けない。scopeの判定軸「宣言が効く場所か」は、新しい診断では使えない。

### イテレーション1: 診断を前提変化へ置換し、原因ownerを確定する

#### 提案1

**確定する診断**

`model: sonnet` / `effort: high` は、hostのdefault modelがSonnetだった時代に、**default運用を明示し、`task-design` だけをOpusへ上げる差分を成立させるため**に置かれた。当時の宣言は意図どおりに機能していた。

hostのdefaultがOpusになった現在、同じ宣言は反対向きに働く。

- 宣言が効く経路では、`model: sonnet` はdefaultのOpusから**下げる**指定になる。design合意とgate判定を担うorchestrationをSonnetへ落とす。
- 宣言が効かない経路では、「このskillはSonnet前提で運用する」という読める契約だけが残り、実態（本sessionはOpus 5）と食い違う。

どちらの経路でも、宣言は当初の目的を果たさず制約としてだけ残っている。これが外す根拠である。

**原因owner: repository知識の不足**

提案0が誤診断へ至ったのは、この宣言が「Sonnet中心運用時代の差分指定」であるという設計意図が、`runtime-model-profiles.md`、root `README.md`、`SKILL.md` のいずれにも記録されていないためである。記録がないため、実測とprofile体系の規則だけから推論するしかなく、「profileを持たないのに宣言がある」という表層を原因と読んだ。

この欠落は、今回の宣言を削除しても消えない。skillのfrontmatterでmodelやeffortを固定する行為が、hostのdefaultに対する**相対指定**であり、defaultが動けば逆向きの制約に変わる、という一般則がどこにも書かれていないからである。root `README.md` の運用契約は「provider固有model名はskill手順の正本にしない」と定めるが、これはskill**手順**の話で、frontmatterの宣言には触れていない。

そのため、この一般則をどのdocsへどう書くかを**論点2として先に合意**し、steeringから何を削除するかはその適用例として論点3で扱う。具体ケースの修正を先に確定させない。

**scopeの判定軸が変わる**

提案0の判定軸「宣言が効く場所か」は使えない。新しい診断からは「**hostのdefaultに対する差分指定として今も意味を持つか**」が軸になる。この軸で見た各宣言の見え方は次のとおりで、確定は論点3で行う。

| 宣言 | 当時の意図 | 現在 |
| --- | --- | --- |
| `steering`: `model: sonnet` + `effort: high` | Sonnet中心運用の明示と、effortだけ上げる差分 | default Opusに対して下げる指定。意味を失っている |
| `task-design`: `model: opus` | Sonnet中心運用の中でここだけOpusへ上げる差分 | default Opusに対して冗長。同じ性質の足かせ |
| agent由来3 skill: `model: sonnet` + `effort: medium` | child委譲先を実行系として軽く回す意図 | defaultに対する意図的な下げとして、今も意味を持ち得る |

**提案0から維持する結論**

- profile体系（`runtime-model-profiles.md`）は今回の欠陥の原因ではなく、変更対象にしない。
- 汎用skill schema validatorの `model` / `effort` 拒否は根拠に採らない。`20260808` の「toolの非対応でありacceptance failureにしない」という判断を覆さない。

#### 提案背景

直前のfeedbackは、提案0の原因診断そのものを置き換えた。そのため提案1が満たす必要のある条件は、診断の訂正だけでは足りず、次の3つになる。

**1. 診断を、宣言の意図と前提変化で説明できる形にする**

提案0は「配置が構造的に誤っている」と診断した。この診断は「当時から誤っていた」ことを含意するため、実際の履歴（当時は機能していた）と矛盾する。提案1の「確定する診断」は、当時の機能と現在の逆作用を分けて記述することでこれを満たす。

提案0の観察のうち「効いた場合はさらに困る」「効かない場合は誤った契約を読ませる」の2点は、新しい診断の下でも成立するため、前提変化の帰結として維持した。棄却したのは「置かれた場所が誤りだった」という部分だけである。

**2. 誤診断が起きた原因を、成果物固有ではなくrepository知識の不足として扱う**

提案0が誤ったのは、assistantが宣言の意図を知らなかったためである。その知識はcodeを読んでも分からず、docsにも記録されていない。したがって原因ownerは成果物固有ではなくrepository知識であり、具体ケースの修正より先に一般則の合意が必要になる。提案1の「原因owner」がこの分類と、一般則を論点2へ分ける理由を示す。

**3. 新しい診断に整合するscope判定軸を示す**

提案0はscopeの判定軸を「宣言が効く場所か」に置き、その軸でagent由来3 skillを対象外、`task-design` を同じ穴と分けた。診断が変われば軸も変わるため、そのままでは論点3が誤った軸で進む。提案1の「scopeの判定軸が変わる」で新しい軸を提示し、各宣言の見え方だけを示して確定は論点3へ残す。

なお直前のfeedbackは `task-design` の `model: opus` を明示的に言及している（「タスク設計だけはopus使いたいっていう指定」）。これはscopeへ入る示唆だが、依頼原文は `steering` に限定されているため、提案1では確定させず論点3の判断材料として置く。

#### 提案1へのフィードバック

**結果:** 受諾。診断、原因owner、scope判定軸、論点分割の順序をそのまま確定。

> ok

### 決定

`steering` の `model: sonnet` と `effort: high` を外す根拠は、**宣言が前提としていた運用が消えたこと**である。

宣言はhostのdefault modelがSonnetだった時代に、default運用を明示し、`task-design` だけをOpusへ上げる差分を成立させるために置かれた。当時は意図どおり機能していた。defaultがOpusになった現在、同じ宣言は宣言が効く経路ではdefaultから下げる指定として働き、効かない経路では「Sonnet前提のskill」という実態と食い違う契約を読ませる。どちらでも当初の目的を果たさず制約としてだけ残っている。

配置が構造的に誤っていたという診断は採らない。誤りは配置ではなく、前提の変化に宣言が追随していないことである。

この誤診断の原因ownerは**repository知識の不足**である。宣言が「Sonnet中心運用時代の差分指定」であるという設計意図が `runtime-model-profiles.md`、root `README.md`、`SKILL.md` のいずれにも記録されていない。さらに、skillのfrontmatterでmodelやeffortを固定する行為がhost defaultに対する相対指定であり、defaultが動けば逆向きの制約に変わるという一般則もどこにも書かれていない。この欠落は宣言を削除しても消えないため、一般則を論点2で先に合意し、具体的な削除範囲は論点3でその適用例として扱う。

scopeの判定軸は「**host defaultに対する差分指定として今も意味を持つか**」とする。「宣言が効く場所か」という軸は採らない。

次の2点は提案0から維持する。

- profile体系（`runtime-model-profiles.md` の `standard-execution`）は今回の欠陥の原因ではなく、profile定義そのものを変更対象にしない。
- 汎用skill schema validatorが `model` / `effort` を未知fieldとして拒否する事実は根拠に採らない。`20260808` の「toolの非対応でありacceptance failureにしない」という判断を覆さない。

---

## 論点2: frontmatterへmodel・effortを固定する条件をどこへ書くか

**ステータス:** 決定

**親論点:** 論点1

**種別:** 認識齟齬

### イテレーション0: 再発防止先と記載内容を確定する

#### 提案0

論点1で確定した原因（repository知識の不足）に対し、次の3 fileを一つの変更集合として変える。一般則の本体は `runtime-model-profiles.md` が持ち、他2 fileはその所在と役割の記述を追随させるだけにする。

**変更対象と、変更後に成立させる状態**

| 対象 | 役割 | 変更後 |
| --- | --- | --- |
| `plugins/tumeda-dev/skills/runtime-model-profiles.md` | profile体系の正本 | 宣言を置く条件の一般則を持つ。profileを持たないskillが宣言を持ってはいけない理由が読める |
| root `README.md` の `## 運用契約` | 正本の所在を示す1行の運用契約 | frontmatterも対象であることが読める。条件そのものは持たず、profiles側へ委ねる |
| `plugins/tumeda-dev/skills/README.md` の共有リファレンス節 | 人間向けの目次 | `runtime-model-profiles.md` の役割説明が「変換対応表」だけでなくなったことに追随する |

**`runtime-model-profiles.md`: 新section `## 宣言を置く条件` を `## adapter規則` の前へ追加する**

```diff
 使用skill: `visual-inspector`、`tasklist-executor`、`test-runner`。
 
+## 宣言を置く条件
+
+skillのfrontmatterへ書く`model`と`effort`は、絶対的な要求ではなくhostのdefaultに対する相対指定である。hostのdefaultが変われば、同じ宣言は逆向きの制約になる。default Sonnetの時代に「実行系をSonnetへ寄せる」意味を持っていた`model: sonnet`は、defaultがOpusへ移ると「Opusから下げる」宣言に変わる。宣言の文字列は変わっていないのに意味が反転する。
+
+そのため宣言を置くのは、次の両方を満たすskillだけとする。
+
+- hostがchildとして起動する委譲先であり、親と別のmodelで動くことが契約上決まっている。
+- このfileのprofileがその推論強度の意図を表現している。
+
+main sessionへ読み込まれて適用されるskillには置かない。そのskillが動くmodelとeffortは、hostのdefaultとユーザーの選択が決める。orchestrationや設計判断の質をfrontmatterで確保しようとすると、hostのdefaultが上がった時にそれを下げる方向へ働く。
+
+この条件は過去の実例から得た。`steering`は`model: sonnet`と`effort: high`、`task-design`は`model: opus`を持っていた。どちらもdefault Sonnet時代に、default運用の明示と`task-design`だけをOpusへ上げる差分を成立させるための指定であり、当時は機能していた。defaultがOpusへ移った時点で両方が逆向きの制約になり、削除された。
+
 ## adapter規則
```

**root `README.md`: `## 運用契約` の該当行を置換する**

```diff
 - shared skillはrepository固有の固定path・固定commandを暗黙に読まない。必要な文脈はcontext maintainerから返された範囲だけを使う。
-- hostごとのmodel差は`plugins/tumeda-dev/skills/runtime-model-profiles.md`の能力profileで吸収する。provider固有model名はskill手順の正本にしない。
+- hostごとのmodel差は`plugins/tumeda-dev/skills/runtime-model-profiles.md`の能力profileで吸収する。provider固有model名は、skill手順にもfrontmatterにも固定しない。frontmatterへ`model`・`effort`を置ける条件は同fileが定める。
 - 正本repository自身も`<repository-root>/.agents/skills/tumeda-dev-plugin-context.md`のinstanceを持つ。
```

**`plugins/tumeda-dev/skills/README.md`: 共有リファレンス節の該当行を置換する**

```diff
 - **runtime-execution-contracts.md** — tasklist-executor が visual-inspector / test-runner へ child 委譲する時の共通契約（状態の正本・single writer・停止理由）。
-- **runtime-model-profiles.md** — skill が要求する推論強度 profile を、各 host の実 model へ変換する対応表。
+- **runtime-model-profiles.md** — skill が要求する推論強度 profile を各 host の実 model へ変換する対応表と、frontmatter へ `model`・`effort` を置ける条件。
 - **tumeda-dev-plugin-context.md** — 利用先 repository に置く context ファイルのテンプレート雛形。
```

**変更集合の境界**

- profile定義（`## standard-execution`）とadapter規則の既存本文は変更しない。論点1の決定でprofile体系を変更対象外としたため。
- `## release確認` も変更しない。「各profileを使うskillのfrontmatterがClaude selectorと一致すること」という確認は、宣言を持つskillがagent由来3 skillだけになっても成立する。
- 削除された実例として `steering` と `task-design` を名前で残す。これは「なぜこの条件があるか」を将来の読み手が辿れるようにするためであり、削除作業の履歴を残すためではない。
- `task-design/SKILL.md` の Sonnet前提記述（description本文の「デフォルトモデル: Opus」「Sonnetで起動された場合でもOpusに切替が望ましい」、本文の「Sonnetは実装に入りたい衝動を持っている」等）は、この変更集合へ含めない。論点3のscope判断に依存する。

#### 提案背景

論点1の決定で、原因ownerをrepository知識の不足と確定し、一般則の合意を具体ケースの修正より先に置くと決めた。提案0が満たす必要のある条件は次の3つである。

**1. 一般則の正本を一箇所に置く**

同じ内容を3 fileへ書くと、条件が変わった時に片方だけ腐る。`runtime-model-profiles.md` は「skillが要求するのはprovider固有model名ではなく推論強度profileである」という前文を持ち、adapter規則で「Claude Codeではprofileに対応する`model` frontmatterを使う」と定めている。宣言を置く条件はこの規則の適用境界そのものなので、同じfileが持つのが自然である。提案0は本体をこのfileへ置き、他2 fileを参照と役割説明の追随だけに留めることでこの条件を満たす。

**2. 誤読の余地を実際に閉じる**

今回の誤診断は、root `README.md` の「provider固有model名はskill手順の正本にしない」がfrontmatterを含まないと読めたことに一因がある。この行を残したまま新sectionを足しても、rootだけを読んだ次の読み手は同じ誤読をする。提案0はrootの該当行を「skill手順にもfrontmatterにも固定しない」へ置換し、条件の所在をprofiles側へ明示的に向けることでこれを閉じる。

**3. 一般則が別domainでも機能する形にする**

「main sessionへ読み込まれるskillに宣言を置かない」だけでは、今回のケース固有の結論に見える。提案0は理由を「宣言はhost defaultに対する相対指定であり、defaultが動けば意味が反転する」という形で書いた。この理由はhostやmodel世代が変わっても成立し、`effort` にも同じく効く。

#### 提案0へのフィードバック

**結果:** 記述量と変更範囲が過剰。記載先の判断は維持されたが、書く内容と波及範囲を縮める要求。

> 論点2での提案がうるさいな。パッチとして差分無いようにしているけど、standardはopusでsub-agentはsonnetレベルくらいの話で終わりじゃん

提案0は、原因を「repository知識の不足」と分類したことから、抽象的な一般則（宣言は相対指定であり意味が反転する）と過去の実例を長文で書き、さらにroot `README.md` と `plugins/tumeda-dev/skills/README.md` へ整合を波及させていた。実際に必要なのは、現在の推論強度の基準を短く書くことだけである。基準が書かれていれば「main sessionで動くskillは宣言を持たない」は導ける。

記載先を `runtime-model-profiles.md` とした判断、profile定義を変更しない境界は影響を受けない。

### イテレーション1: 記載内容を現在の基準の明記へ縮める

#### 提案1

`plugins/tumeda-dev/skills/runtime-model-profiles.md` の前文と `## standard-execution` の間へ、現在の基準だけを追加する。他fileは変更しない。

```diff
 skillが要求するのはprovider固有のmodel名ではなく、必要な推論強度profileである。Claude CodeとCodexのadapterは、このprofileをそれぞれのhostで選べるmodelへ変換する。
 
+## 推論強度の基準
+
+main sessionで適用するskillはhostのdefaultで動かし、frontmatterで`model`と`effort`を宣言しない。現在のdefaultはOpus相当である。
+
+childとして委譲する先はSonnet相当で足りる。`standard-execution`がこれを表す。
+
 ## standard-execution
 
 tasklist実行、test失敗分析、UI確認など、手順遵守と実装・調査を主とする作業用。
```

提案0から落とすもの。

- 「宣言はhost defaultに対する相対指定であり、defaultが変われば意味が反転する」という理由の説明。基準が書かれていれば宣言の可否は導けるため、理由を残さない。
- `steering` と `task-design` が宣言を持っていた経緯の実例。
- root `README.md` の運用契約1行の置換。
- `plugins/tumeda-dev/skills/README.md` の役割説明の追随。

`## adapter規則`、`## release確認`、`## standard-execution` の既存本文は変更しない。

#### 提案背景

直前のfeedbackは、提案0の記載内容と波及範囲を過剰と判定した。提案1が満たす必要のある条件は次の2つである。

**1. 対処の重さを原因に釣り合わせる**

提案0は原因分類（repository知識の不足）から、抽象的な一般則を立てて3 fileへ整合を波及させた。しかし欠けていた知識は「今どの層をどの推論強度で動かすか」という基準であり、それを書けば足りる。提案1は追加を1 file・4行に絞り、基準だけを残した。

**2. 基準から宣言の可否が導けるようにする**

理由の説明を落とすため、基準自体が判断に使える形でなければならない。提案1は「main sessionで適用するskillはfrontmatterで宣言しない」を基準の一部として書いた。これによりsteeringが宣言を持ってはいけないことが直接読め、agent由来3 skillが宣言を持つ根拠も `standard-execution` へ接続される。

提案0から維持したのは、一般則の記載先を `runtime-model-profiles.md` とする判断と、profile定義・adapter規則・release確認を変更しない境界である。置換したのは記載内容の粒度と変更対象fileの範囲であり、原因分類そのものは遡らない。

#### 提案1へのフィードバック

**結果:** profile名と実体のずれを指摘。提案1はそのずれを明文化して固定するものになっていた。

> え、standard-executionという見出しなのに、childからしか使われないの？

事実として、`standard-execution` の使用skillは `visual-inspector`、`tasklist-executor`、`test-runner` の3つだけで、main sessionへ適用するskillは一つも使っていない。提案1の「childとして委譲する先はSonnet相当で足りる。`standard-execution`がこれを表す」は、`standard`（標準）という名前がchild専用profileを指す状態を、基準として書き足すものだった。

追加する内容を4行へ絞る方針と記載先の判断は影響を受けない。

### イテレーション2: profile名を実体へ合わせる

#### 提案2

論点1で確定した診断は、profile名にも同じ形で起きている。default Sonnetの時代はmain sessionもこのprofileと同じ強度で動いていたため `standard` で違和感がなかった。defaultがOpusへ移った時点で、このprofileはdefaultより下位の強度を指すようになり、`standard` が実体とずれた。宣言と同じく、文字列は変わっていないのに意味が反転している。

そこでprofile名を `delegated-execution` へ変える。`runtime-execution-contracts.md` が既に「child処理の委譲」「logical owner / physical launcher」の語彙を持っており、委譲先であることがこのprofileの要件と一致する。

変更は4 fileの各1行の置換である。

| file | 変更 |
| --- | --- |
| `plugins/tumeda-dev/skills/runtime-model-profiles.md` | 見出し `## standard-execution` → `## delegated-execution` |
| `plugins/tumeda-dev/skills/tasklist-executor/SKILL.md` | 本文の `standard-execution` 参照 → `delegated-execution` |
| `plugins/tumeda-dev/skills/visual-inspector/SKILL.md` | 同上 |
| `plugins/tumeda-dev/skills/test-runner/SKILL.md` | 同上 |

`runtime-model-profiles.md` へ追加する基準も、この名前で書く。

```diff
 skillが要求するのはprovider固有のmodel名ではなく、必要な推論強度profileである。Claude CodeとCodexのadapterは、このprofileをそれぞれのhostで選べるmodelへ変換する。
 
+## 推論強度の基準
+
+main sessionで適用するskillはhostのdefaultで動かし、frontmatterで`model`と`effort`を宣言しない。現在のdefaultはOpus相当である。
+
+childとして委譲する先はSonnet相当で足りる。`delegated-execution`がこれを表す。
+
-## standard-execution
+## delegated-execution
 
 tasklist実行、test失敗分析、UI確認など、手順遵守と実装・調査を主とする作業用。
```

profileの本文（用途、Claude selector、Codex adapter、返却、使用skill）、`## adapter規則`、`## release確認` は変更しない。`validate-plugin.mjs` に `standard-execution` を参照するassertionはないため、追随は不要である。

#### 提案背景

直前のfeedbackは、提案1が `standard` という名前をchild専用profileの表現として固定しようとしていた点を指摘した。提案2が満たす必要のある条件は次の2つである。

**1. 同じ原因の症状を片方だけ直さない**

論点1で確定した診断は「hostのdefaultが動くと、同じ文字列の意味が反転する」である。この現象はfrontmatterの宣言だけでなくprofile名にも起きていた。宣言だけ直して `standard` を残すと、次に読む人が「standard = 標準的な実行 = main session」と読み、profileの適用先を誤る。提案2はprofile名の置換を同じdecisionへ含めることでこれを満たす。

**2. 追加する基準を4行に保つ**

提案1で合意された「追加は最小限」という方針は維持する。提案2はprofile名の置換を加えるが、追加する基準の本文は提案1と同じ4行のままで、参照するprofile名だけを変えている。名前の置換は4 fileの各1行に閉じ、profile本文とadapter規則へは触れない。

#### 提案2へのフィードバック

**結果:** 受諾。基準の追加とprofile名の置換をそのまま確定。

> ok

### 決定

再発防止先は `plugins/tumeda-dev/skills/runtime-model-profiles.md` だけとする。前文と profile定義の間へ `## 推論強度の基準` を置き、内容は次の4行に限る。

- main sessionで適用するskillはhostのdefaultで動かし、frontmatterで `model` と `effort` を宣言しない。現在のdefaultはOpus相当である。
- childとして委譲する先はSonnet相当で足りる。`delegated-execution` がこれを表す。

あわせてprofile名を `standard-execution` から `delegated-execution` へ変える。default Sonnetの時代はmain sessionもこのprofileと同じ強度で動いていたため `standard` で成立していたが、defaultがOpusへ移った時点でこのprofileはdefaultより下位を指すようになり、名前が実体とずれた。宣言と同じく、文字列が変わらないまま意味が反転している。同じ原因の症状を片方だけ直さない。置換対象は `runtime-model-profiles.md` の見出しと、`tasklist-executor`、`visual-inspector`、`test-runner` の本文参照の計4 file各1行である。

次のものは書かない。

- 「宣言はhost defaultに対する相対指定であり、defaultが変われば意味が反転する」という理由の説明。基準から宣言の可否が導けるため、理由は残さない。
- `steering` と `task-design` が宣言を持っていた経緯の実例。
- root `README.md` の運用契約1行の置換。
- `plugins/tumeda-dev/skills/README.md` の役割説明の追随。

profileの本文（用途、Claude selector、Codex adapter、返却、使用skill）、`## adapter規則`、`## release確認` は変更しない。

---

## 論点4: 基準相対語を避ける命名原則を追加するか

**ステータス:** 取下げ

**親論点:** 論点2

**種別:** レビュー指摘

<!-- 論点2のdecisionを即時反映したことによる`doc-enricher`提案modeのreviewから生じた。論点番号は保存順であり、論点3より後に作成した。 -->

### イテレーション0: 追加する原則と置き場所を確定する

#### 提案0

`plugins/tumeda-dev/docs/development_standards/naming/core.md` へ、次の原則を `## 表現が同じでも、名前空間が違えば別の意味を持つ` の後、`## 命名後、名前と実態の対応をレビューする` の前へ追加する。

```markdown
## 基準に相対的な語で名付けない

`standard` / `default` / `normal` / `new` / `legacy` のような語は、名前の外にある基準を参照している。基準が動くと、名前を変えていないのに指す位置が変わる。

- 判断の問い: **「この名前は、名前の外にある何かと比べて決まっていないか」**
- 比べて決まっている → その基準が動いた時に名前が嘘になる。対象自体の属性で付け直す
- 比べていない → 周囲が動いても指す先が変わらない

- ✗ `standard-execution` — 「標準」がどこを指すかは、その時の標準が何かで変わる。標準が上がれば、この名前は標準より下位のものを指すようになる
- ○ `delegated-execution` — 「委譲される」は対象自体の性質であり、周囲が動いても変わらない

やってしまいがちな失敗: 命名時点では基準と一致しているため違和感がなく、そのまま定着する。時間が経って基準が動いた後も、名前が読めてしまうために誤りに気づけない。正しい判断のための問い: 「この名前が指す位置は、何が変われば変わるか」。
```

#### 提案背景

論点2で profile名を `standard-execution` から `delegated-execution` へ置換した。この置換は `doc-enricher` を提案modeで起動する対象になる。提案0が満たす必要のある条件は次の2つである。

**1. 既存の命名原則に含まれないことを確認する**

`naming/core.md` は6つの原則を持つ。「初見でも自明にわかる名前」は議論を知らないと読めない略語・内部符号を扱い、今回のように「読めるが読めた意味が実態とずれる」ケースは対象外である。「中身が大まかにわかる具体性」は何でも入る汎用語を扱い、`standard` のように意味は持つが指す位置が動く語は対象外である。「命名後、名前と実態の対応をレビューする」は命名時点のレビューを求めるもので、外部前提が後から動いて対応が崩れる場合に触れていない。したがって重複しない。

**2. 今回のケースを一般則へ登り切る**

「profile名は使用者の層で名づける」で止めると、profile以外へ適用できない。提案0は「名前の外にある基準を参照する語を使うと、基準が動いた時に名前が嘘になる」まで登った。この形は対象種別に依存しないため、`naming/core.md` の「名前を付ける対象が何であっても成立する原則」という位置づけに合う。`standard-execution` / `delegated-execution` は原則の具体例として置き、経緯は書かない。

なお、論点2で「書かない」と決めた内容（frontmatter宣言が相対指定であるという理由の説明、`steering` と `task-design` の経緯の実例、root `README.md` と `plugins/tumeda-dev/skills/README.md` への波及）は再提案しない。

#### 提案0へのフィードバック

**結果:** 取下げ要求。原則として成立しない。個別の誤りを汎用規範へ昇格させる提案だった。

> いや、名前に相対的な言葉って全然つくし、お前の一時的な誤りを汎用的な判断にするな

`default_value`、`new_order`、`legacy_adapter` のように基準相対語を含む名前は普通に使われ、機能している。提案0の原則には反例が多く、一般則として偽である。

`standard-execution` が問題になったのは、`standard` がhostのdefault modelという名前の外にある前提を指し、かつその前提が実際に動いたという条件が揃ったためである。この条件を落として「基準相対語で名付けない」へ一般化すると、条件を見ずに相対語全般を禁止する誤った規範になる。

### 決定

取下げ。`plugins/tumeda-dev/docs/development_standards/naming/core.md` は変更しない。

profile名を `standard-execution` から `delegated-execution` へ改名した判断は、論点2の個別判断としてこのledgerに留める。規範fileへ昇格させない。

`doc-enricher` の提案modeによるreviewは実施済みで、採用する候補はzeroである。

---

## 論点3: task-designの宣言とSonnet前提記述群をscopeへ含めるか

**ステータス:** 分解済み

**親論点:** 論点1

**種別:** TBDヒアリング

### イテレーション0: 基準の適用範囲を確定する

#### 提案0

論点2で合意した基準を適用すると、`task-design/SKILL.md` の `model: opus` は基準違反になる。main sessionで適用するskillであり、宣言を持ってはいけない側にある。

**`model: opus` は今回のscopeへ含める。**

基準を書いた直後に、その基準へ違反する宣言を意図的に残す理由がない。変更は `task-design/SKILL.md` の1行削除と、`validate-plugin.mjs` L438 の対応assertion削除である。ユーザーの直前の発言「タスク設計だけはopus使いたいっていう指定のためにやっていた」も、この宣言が同じ前提変化の産物であることを示している。

**Sonnet前提記述群は含めない。**

`task-design/SKILL.md` には、frontmatter宣言とは別に、Sonnetを名指しした思想記述が複数ある。

| 位置 | 記述 |
| --- | --- |
| description本文 | 「デフォルトモデル: Opus（設計判断の質が要求されるため）。Sonnet で起動された場合でも、このスキル実行中は Opus に切替が望ましい。」 |
| section 1 | 「Sonnet は『実装に入りたい衝動』を持っているため、このスキルはその衝動を止め」 |
| section 6 冒頭 | 「Sonnet がよく陥る穴埋めパターン。」 |
| section 8 | 「このスキルは Sonnet が日常運用する前提で書かれているが」、修正の種類とモデルの対応表（細かな修正=Sonnet / 構造的修正=Opus必須 / 内容の抜本的修正=Opus必須）、「Sonnet が更新するときに守ること」、「Opus に相談するか、対話を1段階戻す」 |

これらを含めない理由は3つある。

1. 基準の対象外である。論点2の基準はfrontmatterの宣言について定めたもので、skill本文の思想記述には直接効かない。
2. 書き換えの性質が違う。宣言の削除は行を消せば終わるが、記述群は「Sonnetという名前を外して意図を保つ」作業になる。たとえば「実装に入りたい衝動」はmodelに限らず成立する観察かもしれず、section 8 の対応表はdefaultがOpusになった今どう置き換えるかを一箇所ずつ判断する必要がある。今回の判断材料では一意に決まらない。
3. 独立して扱える。宣言を削除しても記述群は矛盾を生まない。記述群が残るのは「古い前提の説明が残っている」状態であり、基準違反ではない。

そのため記述群は今回の非目標として `design.md` へ明記し、別steeringの候補として残す。

#### 提案背景

論点2で基準が確定したため、その適用範囲を確定する必要が生じた。提案0が満たす必要のある条件は次の2つである。

**1. 基準と実態の矛盾を今回のscope内で解消する**

基準を書いた時点で `task-design` の `model: opus` は違反状態になる。違反を残したまま完了すると、基準が最初から守られていない状態で配布される。提案0は宣言だけをscopeへ含めることでこれを満たす。

**2. scopeの膨張を防ぐ**

依頼原文は `steering` のmodel/effortに限定されていた。基準を根拠にすればSonnet前提記述群まで射程に入るが、記述群の書き換えは各箇所の意図を個別に吟味する作業であり、今回の判断材料では一意に決まらない。提案0は宣言と記述群を「基準違反かどうか」で切り分け、後者を非目標として明示することで、scopeを膨らませずに未処理を隠さない形にした。

#### 提案0へのフィードバック

**結果:** 受諾。宣言はscope内、記述群はscope外という切り分けをそのまま確定。

> ok

### 決定

`task-design/SKILL.md` の `model: opus` を今回のscopeへ含めて削除する。論点2の基準を書いた直後に、その基準へ違反する宣言を意図的に残す理由がない。

Sonnet前提記述群はscope外とする。対象は description本文の「デフォルトモデル: Opus」「Sonnetで起動された場合でもOpusに切替が望ましい」、section 1 の「Sonnet は『実装に入りたい衝動』を持っている」、section 6 冒頭の「Sonnet がよく陥る穴埋めパターン」、section 8 の「Sonnet が日常運用する前提」「修正の種類と使うモデル」対応表「Sonnet が更新するときに守ること」「Opus に相談するか」である。

scope外とする理由は3つある。論点2の基準はfrontmatterの宣言について定めたもので本文の思想記述には効かない。宣言の削除は行を消せば終わるが記述群は「Sonnetという名前を外して意図を保つ」作業であり、今回の判断材料では一意に決まらない。宣言を削除しても記述群は基準違反を生まず、独立して扱える。

記述群は `design.md` の非目標へ明記し、別steeringの候補として残す。

---

## 論点5: validatorの検査内容をどう追随させるか

**ステータス:** 決定

**親論点:** 論点3

**種別:** TBDヒアリング

### イテレーション0: assertionの追加・削除範囲を確定する

#### 提案0

論点2（profilesへの基準追加とprofile名の改名）と論点3（宣言の削除）の両方の結果を、`scripts/verification/validate-plugin.mjs` へ反映する。root `README.md` は「skillまたはdocsを追加・変更したら、対応するassertionをこのfileへ追加する」「既存assertionがピン留めしている文字列を変更したら、そのassertionも追随させる」と定めているため、追随は必須である。判断が必要なのは検査の形と、再導入拒否を入れるかである。

**削除（適用済み）**

```diff
-requireFrontmatter(taskDesignSkill, "model: opus");
-requireFrontmatter(steeringSkill, "model: sonnet");
-requireFrontmatter(steeringSkill, "effort: high");
```

宣言を削除したため、この3行を残すとvalidationが落ちる。既に削除して `plugin validation passed` を確認した。

**追加1: profilesの変更をpin留めする**

```js
requireText(skillPath("runtime-model-profiles.md"), "## 推論強度の基準");
requireText(skillPath("runtime-model-profiles.md"), "## delegated-execution");
forbidText(skillPath("runtime-model-profiles.md"), "standard-execution", "旧profile名");
```

旧profile名の `forbidText` は、`20260808` で旧 `public-contracts.md` の復活を拒否した前例と同じ形である。

**追加2: 3 skillの参照を新profile名で検査する**

agent由来3 skillのループ（現行L652-657）は `../runtime-model-profiles.md` への参照をassertするが、profile名は見ていない。ループへ1行足す。

```diff
 for (const relativePath of agentDerivedSkills) {
   requireFrontmatter(relativePath, "context: fork");
   requireText(relativePath, "../runtime-execution-contracts.md");
   requireText(relativePath, "../runtime-model-profiles.md");
+  requireText(relativePath, "delegated-execution");
   requireText(relativePath, "Codex");
 }
```

**追加3: 再導入を拒否する**

```js
forbidText(steeringSkill, "model:", "main session適用skillへのmodel宣言");
forbidText(steeringSkill, "effort:", "main session適用skillへのeffort宣言");
forbidText(taskDesignSkill, "model:", "main session適用skillへのmodel宣言");
forbidText(taskDesignSkill, "effort:", "main session適用skillへのeffort宣言");
```

`forbidText` はfile全体を対象にするため誤検知を確認した。削除後の両fileに `model:` と `effort:` の出現はzeroである。

root `README.md` は「`forbidText` は落ちないまま無力化する」と警告している。この禁止が無力化するのはfrontmatterがYAML以外の形式になった場合だが、その時は同じfileの `requireFrontmatter(..., "context: fork")` 等も同時に壊れるため、形式変更自体は検知される。静かに無力化するシナリオは薄い。

**入れる理由**

基準は `runtime-model-profiles.md` にあるが、docsを読まずに宣言を足す経路は残る。今回の宣言自体、当時は正しく置かれたものが前提変化で足かせになった。同じことは再度起こり得るため、機械的に止める側へ寄せる。

#### 提案背景

論点3で削除範囲が確定したため、validatorの追随範囲も確定できる状態になった。提案0が満たす必要のある条件は次の2つである。

**1. root `README.md` が義務付ける追随を漏らさない**

`runtime-model-profiles.md` へsectionを追加し、profile名を改名し、3 skillの参照を書き換えた。root `README.md` の検証方針はこれらに対応するassertionの追加を義務付けている。追加1と追加2がこれを満たす。追加2をループ内へ置くのは、3 skillへ同じ検査を個別に3行書くより、対象集合の定義と検査内容を一箇所に保てるためである。

**2. 再導入拒否の判断材料を示す**

`forbidText` は無力化しうるため、入れるかは判断が必要になる。提案0は誤検知がzeroであることを実測で示し、無力化が起きる条件（frontmatter形式の変更）とその場合に他のassertionが同時に壊れることを示した。判断に必要な材料をそろえたうえで、機械的に止める側を推した。

#### 提案0へのフィードバック

**結果:** 受諾。削除、追加1、追加2、追加3をすべて確定。

> ok

### 決定

`scripts/verification/validate-plugin.mjs` を次のとおり追随させる。

削除するのは、宣言をpin留めしていた3 assertion（`requireFrontmatter(taskDesignSkill, "model: opus")`、`requireFrontmatter(steeringSkill, "model: sonnet")`、`requireFrontmatter(steeringSkill, "effort: high")`）である。

追加するのは次の3組である。

- profilesの変更のpin留め。`runtimeProfiles` を定義し、`## 推論強度の基準` と `## delegated-execution` を `requireText`、`standard-execution` を `forbidText`（label `旧profile名`）する。旧名の禁止は、`20260808` で旧 `public-contracts.md` の復活を拒否した前例と同じ形である。
- agent由来3 skillのループへ `requireText(relativePath, "delegated-execution")` を1行追加する。3 skillへ個別に書かずループへ置くのは、対象集合の定義と検査内容を一箇所に保つためである。
- 再導入拒否。`steering` と `task-design` の各fileへ `model:` と `effort:` の `forbidText` を計4本置く。label は `main session適用skillへのmodel宣言` / `main session適用skillへのeffort宣言` とする。

`forbidText` はfile全体を `String.includes` で判定するため、誤検知がないことを実測で確認した。削除後の両fileに `model:` と `effort:` の出現はzeroである。

この禁止が無力化するのはfrontmatterがYAML以外の形式になった場合だが、その時は同じfileの `requireFrontmatter` によるassertionも同時に壊れるため、形式変更自体は検知される。静かに無力化する経路は成立しない。

`forbidText` の検知能力について、宣言を一時的に戻して落ちることを確認する破壊検証は行わない。`forbidText` の実装が `source.includes(forbidden)` であり、対象文字列が現在zeroであることを実測済みなので、追加後に同じ文字列が現れれば必ずfailureへ入る。実装と実測から一意に決まるため、fileを一時的に壊す手順を踏まない。

---

## 論点6: 配布versionのbump区分

**ステータス:** 決定

**親論点:** 論点1

**種別:** TBDヒアリング

### イテレーション0: bump区分を確定する

#### 提案0

`7.4.1` から `7.4.2` へPATCHを上げる。宣言値4箇所と `scripts/verification/validate-plugin.mjs` の `expectedRelease` の計5箇所を一度に変える。

`maintenance-plugin-context` の規約は、MINORとPATCHの境界を「consumerが新たに呼べるものが増えたか」で判定すると定めている。今回の変更は次の3種類であり、いずれもconsumerの呼び出し方を増やさない。

- 既存skillのfrontmatterからの宣言削除（`steering`、`task-design`）
- 既存docsへのsection追加とprofile名の改名（`runtime-model-profiles.md`、参照する3 skill）
- 検査scriptのassertion追加・削除

MAJORにしない理由。公開contract（skillの起動条件、入力、result、owner境界）は変わらない。profile名は plugin 内部のskill本文だけが参照する識別子であり、利用先repositoryの context instance は profile名を持たないため、外部consumerのcontractではない。frontmatterの宣言削除はhostが選ぶmodelを変え得るが、これはskillが提供するcontractではなく実行環境側の解決結果である。

MINORにしない理由。新しいskill、新しいparameter、新しい起動経路のいずれも増えていない。`## 推論強度の基準` はdocsのsection追加であり、規約が「新規fileの追加それ自体はMINORの根拠にならない」と定めているのと同じ理由で、consumerが呼べるものを増やさない。

#### 提案背景

論点3と論点5で変更対象が確定したため、bump区分を判定できる状態になった。提案0が満たす必要のある条件は次の2つである。

**1. 規約の判定軸をそのまま適用する**

`maintenance-plugin-context` はMINORとPATCHの境界を一つの問い（consumerが新たに呼べるものが増えたか）で定めている。提案0は今回の変更を3種類へ整理し、それぞれがこの問いに対してNoであることを示した。

**2. MAJORの可能性を明示的に潰す**

frontmatterの宣言削除はhostの実行結果を変えるため、破壊的変更に見える余地がある。提案0はcontractと実行環境の解決結果を分け、profile名が外部consumerのcontractではないことも示して、MAJORにしない根拠を残した。`20260808` で `6.0.0` へbumpした時は公開contractのresult種別自体が変わっていたため、今回とは性質が異なる。

#### 提案0へのフィードバック

**結果:** 受諾。PATCHで確定。

> ok

### 決定

配布versionを `7.4.1` から `7.4.2` へPATCHで上げる。

変更箇所は規約が定める宣言値4箇所（`plugins/tumeda-dev/.codex-plugin/plugin.json`、`plugins/tumeda-dev/.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json` の `version` と `plugins[].version`）と、`scripts/verification/validate-plugin.mjs` の `expectedRelease` の計5箇所である。`.agents/plugins/marketplace.json` は version fieldを持たないため対象外であり、validatorのversion検査も4箇所だけを比較する。

PATCHとする根拠は、今回の変更3種類（既存skillのfrontmatter宣言削除、既存docsへのsection追加とprofile名の改名、検査scriptのassertion変更）がいずれもconsumerの呼び出し方を増やさないことである。

MAJORにしない。公開contract（skillの起動条件、入力、result、owner境界）は変わらない。profile名はplugin内部のskill本文だけが参照する識別子であり、利用先repositoryのcontext instanceは profile名を持たないため外部consumerのcontractではない。frontmatterの宣言削除はhostが選ぶmodelを変え得るが、これはskillが提供するcontractではなく実行環境側の解決結果である。

MINORにしない。新しいskill、新しいparameter、新しい起動経路のいずれも増えていない。

---

## 論点7: doc-enricherの抽象化ラダーへ反例チェックを追加するか

**ステータス:** 決定

**種別:** レビュー指摘

<!-- steering Step 4-2 の再発防止reviewから生じた。提案と合意がchat上で先に成立したため事後記録である。 -->

### イテレーション0: 追加する判断項目を確定する

#### 提案0

`plugins/tumeda-dev/skills/doc-enricher/SKILL.md` の抽象化ラダー「ラダーの止まり方と判断」へ、4番目の項目を追加する。

```text
  4. 「登り切った命題に反例はないか」→ 反例が挙がるなら一般則として偽 → DROP
     条件を落として一般化した結果である。成立条件を書き戻すと個別判断に戻るため、
     置き場所は規範fileでなく当該作業のledgerになる
```

#### 提案背景

steering Step 4-2 の三問を論点4へ適用した結果である。

**根本原因**

抽象化ラダーは「MUST: 候補が生まれたら抽象化ラダーを登り切ること」と要求し、Gate A〜Gで抽象度、永続性、レバレッジ、非自明性、探索性、低メンテ、既存docsとの非重複を問う。しかし**登り切った命題そのものが真かを問う項目がない**。論点4では「基準相対語で名付けない」まで登り切り、反例を検討しないまま提案した。

**分類**

設計processの不足である。codeを読めば分かることでも、repository固有の設計意図でもない。ラダーという手順自体に検証の一段が欠けている。

**保存先**

同じ失敗は2026/8/10 の documentation_standards 追随（索引READMEを現状忠実にした判断をmigration policyへ昇格させようとした件）で一度起きている。今回が2度目である。sessionをまたぐ記録はassistant側のmemoryへ残せるが、それはこのpluginのskillを使う他のsessionには効かない。skill本体へ書くことで、利用先repositoryでの実行にも効く。

**別domainでも機能するか**

この項目はドメインに依存しない。「登った命題に反例がないか」は命名でもentity設計でもworkflow設計でも同じ形で問える。また「成立条件を書き戻すと個別判断に戻る」という帰結も、規範fileとledgerの境界を判断する一般的な形になっている。

#### 提案0へのフィードバック

**結果:** 採用。提案Bとの二択で提案Aが選ばれた。

> A

### 決定

`doc-enricher/SKILL.md` の「ラダーの止まり方と判断」へ、提案0の項目4をそのまま追加する。配置は既存の項目1〜3の後とし、1〜3の本文と「やってしまいがちな失敗」以降は変更しない。

あわせて `scripts/verification/validate-plugin.mjs` へ、追加した2文をpin留めする `requireText` を置く。root `README.md` が「skillまたはdocsを追加・変更したら、対応するassertionをこのfileへ追加する」と定めているためである。

---

## 論点8: steeringのsummary判定規則の曖昧さを修正するか

**ステータス:** 取下げ

**種別:** レビュー指摘

<!-- steering Step 4-3 の確認から生じた。提案と判断がchat上で先に成立したため事後記録である。 -->

### イテレーション0: 判定規則の修正要否を確定する

#### 提案0

`steering/SKILL.md` Step 1 のplanless status判定の文言を変える。

```diff
-`分類保留`sectionがなく
+`分類保留`に未決の変更候補がなく（sectionごと削除されているか、中身が`なし`である）
```

#### 提案背景

このsteeringのStep 1で前月summaryを生成した際、`20260815-evaluate-discussion-entry-format` のplanless statusを判定できずに迷った。現行の規則は「design.md付録に`分類保留`sectionがなく」と書いているが、対象のdesign.mdは `### 分類保留（設計中のみ）` の見出しを残したまま中身を「なし」にしていた。

規則を文言どおり読むと section が存在するため `完了` にできない。しかし規則の狙いは未決の残存検知であり、中身が「なし」なら未決はzeroである。狙いを優先して `完了` と判定したが、次に同じ状態へ出会った者が同じ迷いを繰り返す。

分類は設計processの不足である。

#### 提案0へのフィードバック

**結果:** 見送り。提案Aとの二択で提案Aが選ばれた。

> A

### 決定

見送り。`steering/SKILL.md` のsummary判定規則は変更しない。

今回の判定（見出しが残り中身が「なし」の場合を未決zeroとみなして `完了` とする）は、このledgerの記録に留める。同じ状態へ次に出会った場合の前例として扱い、規則本文へ昇格させない。

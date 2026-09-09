# Design: 利用先のinfrastructure構築から得た4件の改善をpluginへ反映する

## 元の依頼内容

利用先repositoryのinfrastructure構築作業から `escalate-plugin-skill-fix` 経由で運ばれた、このpluginのskill・docs・hookに対する修正提案4件を設計・反映する。利用先固有情報は `migration.md` の規約に従って除去済み。

【提案1】designの受け入れ基準が運用の観点を含んでいなかった

事象: managed hosting service へ infrastructure as code で新規構築する作業で、design の受け入れ基準がすべて「動くこと」の確認で構成されていた（構成と構築結果を照合できる / 公開 URL から機能が使える / access gate が要求される / アプリの主要操作が動作する / 再適用で意図しない差分が出ない）。「他の人、あるいは後日の同じ作業者が、この環境を更新・確認・復旧できること」が基準に無かった。

結果: 基準に無いため tasklist に task が立たず、更新手順・確認手順・復旧手順の文書が生まれなかった。作業終盤にユーザーの指摘で初めて表面化し、そこから文書を作ることになった。

提案の骨子: infrastructure を新しく構築する作業では、受け入れ基準に運用の観点を含める。

未解決の設計課題: `tasklist-design.md` は「各phaseのDoDを『ユーザーが一つの操作をした時、何を確認できるか』の形で書く」「DoDが抽象的なままreviewへ進むことを禁止する」を MUST としている。「引き継げること」も「手順が文書として存在すること」も操作で検証できず、この gate と衝突する。両立する形への落とし込みが必要。素案としては「新しい環境で運用documentの手順だけを読んで plan 相当の確認commandが通る」のような、実測可能な操作へ翻訳する方向がある。

【提案2】未開拓のインフラ基盤では、tasklistで基盤を立ててからdesignへ戻る

ユーザーの提起（原文、固有名を除去済み）:
> 基盤作成、特にインフラでまだ切り開いていない土壌を切り開く際は、tasklistで基盤作ってから、またdesignでtask-design-discussionに戻ってきて良い作りにしたい。今回どうでもいいことで設計にかなり時間を使わされたし、tasklist入ってからも同様だった。不確実性の高いことから対応するにあたって、全体の整合性のための重箱の隅の話は基盤立てられて初めて、今後の成長にむけて大事な論点になる。インフラのように机上でできそうと思っても動かしてみたら全然ハマることがあるトピックについてはspikeのようにtasklistで途中まで進めていい。それが決まることで他を安心して考えられるし、それが決まらない限り「今これ話している場合じゃないんだけどな」が続く

実例による裏付け: 最初の実装phaseの実測で判明した事実は、いずれも机上の議論では出てこなかった。access gate の設定範囲がアプリ単位か環境単位か、監視対象の設定が想定と違っていたこと、build image が version 指定fileを参照しないこと、hosting service が secret store から読む機構を持っていたこと。このうち二つは design の記述を訂正する結果になり、一つは tasklist の最初のphaseを実行できない状態を生み、一つは既に決着していた論点の前提を崩した。

分ける基準の案（二問）:
1. その論点の答えは、実環境の挙動に依存するか。依存するなら基盤後に回す。
2. その論点の答えは、作るものそのものを変えるか。変えるなら基盤前に決める。

実際、「初回公開の機能範囲」は基盤前に決めた価値があり（未決事項を三つ一度に外せた）、「secretの保持方式」と「branchの運用順序」は基盤を立ててから決めた方が精度が高かった。

【提案3】hookの注入文面が「skill適用中」と断定していた

事象: `.claude/hooks/think_through_session_start.sh` と `think_through_user_prompt.sh` が毎ターン think-through の要約を注入しており、その冒頭が「think-through skill 適用中（毎ターン常時注入）。」と断定していた。受け手はこれを読んで skill の作法が適用済みだと扱い、SKILL.md も `docs/think_standards/core.md` も template も読み込まないまま、記録の形式だけを既存fileから真似て進めた。

結果、`facilitate-discussion` の template と乖離した記録が積み上がった（`提案背景` の欠落が23提案中13件、`ステータス` と `種別` の固定候補外の値、合意していない事項の `決定` への混入）。加えて `task-design` の `templates/tasklist.md` と `tasklist-design.md` を読まずに tasklist を作り、templateに無い「各phaseの停止・確認task」を全phaseへ置いた。その3番目のsubtaskが「次phaseの開始確認を得るまで進まない」だったため、実測完了済みのphaseが次phaseの開始まで `[x]` にできない構造になっていた。

対処: 両 script の文面から断定を外し、要約であることと、`.steering/` 配下を扱うには `Skill` による起動が別に必要であることを明示する変更を既に適用済み。この2 fileは未commitで、この branch の working tree に載っている。commitしてよい旨はユーザーから許可済み。

あわせて、要約と本体の関係そのものをどう扱うか（hookの文面変更だけで足りるか、skill側にも起動を促す仕組みが要るか）を設計対象とする。

【提案4】このpluginが自身を「正本」と呼ぶ慣習をやめる

ユーザーの指摘（原文）:
> ai_agent_dev_skill_plugin を正本と呼ぶ慣習をついでにやめたい。「呼ばないようにする」というより、やつがどこかで勝手に自身を正本と名乗っているところがあるから正本と呼ばれているのだと思う。ただ単にskillの共有先のプラグインにすぎない。呼びたくない理由はスキル文脈でないところでも、無文脈に自身を正本と呼ぶところが厄介。正本は相対的な言葉で、複写先があって初めて正本やoriginalがあるだけで、自身がその文脈において複写先の正本でないときに、またメインのトピックがその正本 - 複写関係でないときに正本と呼ばれると、視点の向きが狂う。正本っていう言葉は文脈に優先されて守られるべき存在と読まれてしまう言葉だから

修正対象（このrepository自身の自称）と、対象外とすべき候補（相対関係が文中に明示されているもの）は付録「前提とする既存仕様」に列挙する。

---

## TL;DR

このpluginは、利用先の作業で表面化した四つの欠落をまだ持っている。designの受け入れ基準が「動くこと」だけで運用の引き継ぎを見ていないこと、実行しなければ確定しない論点を机上で決めさせ続けること、hookの注入文面がskill未起動を正常に見せること、そしてこのrepositoryが自身を文脈なく「正本」と名乗ることである。この四つを、それぞれ規範・進行契約・注入文面・用語として直す。終了時には、infrastructure構築を含むsteeringが運用の引き継ぎを受け入れ基準として持ち、実行して初めて確定する論点を後の段階へ回す判断基準が進行契約に載り、hookの注入が自身を要約と名乗り、このrepositoryが自身を相対語で呼ばない状態になる。

---

## 完成後の姿

### skillの役割と方針

#### task-design

##### 設計を尽くした単位は、実行可能な一段階である

`task-design` は「設計を尽くしてから実装する」ことを目的にしているが、実行しなければ確定しない事実がある。この skill は既にそれを認め、技術検証実装を `spike/` へ置いて「書いたコードは捨ててよい。残るのは事実だけ」と定義している。捨てられない実行によってしか得られない事実は、この定義から外れる。基盤は作れば残り、骨格として置いた実装は次の実装が乗る土台になる。

そこで、設計を尽くしたと言える単位を作業全体ではなく実行可能な一段階に置く。一つの作業に対して design を一度で完結させるという前提を手放す。

各段階では、その段階を実行するのに十分な設計を完結させる。既存の完了条件（未解消の設計判断がゼロ、分類保留がゼロ）は緩めず、段階ごとにそのまま満たす。「実装中に新しい判断が生まれない」という保証は各段階の内側で維持される。

段階を分けるのは、次の三つをすべて満たすときである。

1. 実行して初めて確定する不確実性がある
2. その答えが、後続の設計判断の入力になる
3. 確定させるために作るものを捨てず、次の段階の土台として残す

三つ目が No なら技術検証実装で潰す。捨てられる成果物は土台にならず、土台になる成果物は捨てられない。この区別が二つの手段を分ける。一つ目が No なら段階を分けない。既存の型が確立している作業ではこの条件がほとんど満たされず、現行どおり一度の design で完結する。

不確実性をその段階の scope へ含めるかは、次の二問で判定する。

1. その論点の答えは、実行して初めて確定するか。外部 service の挙動や runtime の制約だけでなく、書いてみて初めて分かる構造の摩擦も含む
2. その論点の答えは、作るものそのものを変えるか

一つ目が Yes で二つ目が No なら、その段階の scope へ含めない。基盤を立て、実測を得てから次の段階で設計する。両方が Yes なら前に決める。作るものが変わる論点を後回しにすると、その基盤そのものが不要になりうるためである。ただし実行しなければ確定しないため、技術検証実装で潰す。

この単位を採る代償として、途中の `design.md` は最終形を示さない。代償を受け入れる条件として、`design.md` にその design がどこまでを対象としているかを明示する。明示が無ければ読み手は完成形と誤読する。

##### 引き継ぎ可能性は、設計時点で決め、実装時点で照合する

受け入れ基準が「作ったものが動くこと」だけで構成されていると、作ったものを作った人以外が扱えるかは問われない。更新手順、確認手順、復旧手順が無くても基準は満たせてしまう。

そこで引き継ぎ可能性を、設計時点で決める方針を主、実装時点での照合を従として担保する。

設計時点では、`design.md` の受け入れ基準へ引き継ぎの観点を入れる。運用documentに何を書くかは設計時点で決める。実測でしか決まらないものだけを次の段階へ回す。受け入れ基準は操作で検証できる形にし、「運用documentが存在する」ではなく「運用documentの手順だけを入力として、対象環境に対する確認操作が通る」と書く。

適用条件は「この作業を破棄しても残る変化があるか」とする。`infrastructure` という語で境界を引かない。この判定軸は `tasklist-design.md` が既に運用しているものであり、新しい境界を作らない。

実装時点では、外部へ残るactionを含むphaseの停止・確認へ、設計時点で決めた運用documentが実態と合っているかの照合を加える。実装の過程で方針が変わっていた場合は、その場でdocumentを書き換えず design へ戻す。

二つは重複ではなく、決める側と追随する側の関係にある。照合は決めた内容が無ければ成立しないため、設計時点を飛ばして実装時点だけを満たすことはできない。

### workflow

設計を尽くした単位を実行可能な一段階に置くため、design phase と plan phase を段階ごとに一巡させる。段階の境界は、実測を得なければ次の設計ができない地点に置く。

**ownerと責務:**

| owner | 判断・更新するもの | 行わないこと | single source of truth |
| --- | --- | --- | --- |
| `task-design` | 不確実性をその段階の scope へ含めるかの判定、段階ごとの design と plan | 段階をまたぐ実行、実測の取得 | `design.md`、`tasklist.md` |
| `steering` | 段階ごとの task-design 起動と再開、実行開始のユーザー確認 | design と plan の内容設計 | steering directory |
| `tasklist-executor` | 合意済み tasklist の実行と checkbox 更新 | 親の探索、design の更新 | `tasklist.md` の `[ ]` / `[x]` |

**状態と遷移:**

```text
steering --task-design起動--> 段階Nのdesign
段階Nのdesign --未決ゼロ + 合意--> 段階Nのplan
段階Nのplan --合意 + 実行開始確認--> tasklist-executor
tasklist-executor --完了--> 実測が得られた状態
実測が得られた状態 --次段階が必要--> steering が create_working_dir=false で task-design を再開 --> 段階N+1のdesign
実測が得られた状態 --実態が設計と違う--> implementation_review --> 該当phaseへ戻る
```

**必須順序とhandoff:**

1. `task-design` は不確実性ごとに、その答えが実行して初めて確定するか、作るものそのものを変えるかを判定する。実行して初めて確定し、かつ作るものを変えないものは、その段階の scope から外し、`design.md` の非目標へ「実測後に設計する」と記す
2. 外した結果、その段階の design は未決ゼロで合意できる。既存の完了条件を緩めない
3. plan は基盤を立てる phase を最初に置き、その phase の DoD へ実測結果を含める
4. `steering` は実行開始のユーザー確認を経て `tasklist-executor` へ渡す
5. 実測が得られたら、`steering` が同じ working directory で `task-design` を `create_working_dir=false` で再開する。`design.md` は上書きではなく拡張される
6. 段階が残らなくなった時点で、作業全体が完了する

**失敗・取消・再開:**

- 実測が設計と食い違った場合: `implementation_review.md` へ記録し、完成後の姿・要件・設計根拠が変わるなら design phase へ、task 順・粒度・検証手順だけなら plan phase へ戻す。実装は自動再開しない
- 基盤phase が失敗した場合: 次の段階の設計へ進まない。基盤が立つまで後続の段階は scope を確定できない

### documentationによって成立する知識体系

hook が注入する要約については、規範を docs へ置かない。`.claude/hooks/` は配布対象ではないが、要約を注入する運用そのものへの規範を作らず、この repository の注入文面を直すところで終える。要約は残す。`think-through` は毎ターン適用する前提の skill であり、要約は起動していない状態でも最低限の作法を効かせるために存在する。失敗の原因は要約の存在ではなく、要約が自分を本体と名乗っていたことである。

「正本」については、用語規範を新しい document へ書かない。この語が問題になるのは、複写関係が文脈に無いところで使われるときであり、それは書き手が「何に対する正本か」を答えられるかで判定できる。判定の一般則を document へ足すより、実際に自称している箇所を直し、再混入を検査で止める方が短い。

再混入の検査は `scripts/verification/validate-plugin.mjs` の `forbidText` で行う。禁止語は file ごとに変える。`AGENTS.md` と `README.md` は repository の位置づけと運用を述べる file であり、正当な相対用法が現れる見込みが低いため「正本」そのものを禁止する。`escalate-plugin-skill-fix/SKILL.md` は責務境界の中で規約の所在に触れ、相対用法が2行残るため、自称の形である「正本repository」だけを禁止する。

この検査は再記述を不可能にするためではなく、記述時に理由を残させるために置く。将来これらの file で正当な相対用法が必要になった場合は assertion を編集し、編集の理由を記録する。

### documentation以外のfile deliverable

**対象と読者:**

| file | 主な読者 | 読後または利用後にできること |
| --- | --- | --- |
| `plugins/tumeda-dev/skills/task-design/SKILL.md` | 設計を進めるagent | 段階を分けるかを判定し、不確実性を今回の段階の scope へ含めるかを決められる。新しい判断基準を設計したとき、それを別の case で検証すべきだと分かる |
| `plugins/tumeda-dev/skills/task-design/templates/design.md` | design を書くagent | 受け入れ基準へ引き継ぎの観点をどう書くかを判断できる |
| `plugins/tumeda-dev/skills/task-design/tasklist-design.md` | plan を作るagent | 基盤phase を最初に置く判断と、停止・確認で照合する内容を判断できる |
| `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md` | 利用先で提案が生じたagent | 引き渡し先を、相対語ではない名前で識別できる |
| `AGENTS.md` | このrepositoryで作業するagent | このrepositoryの位置づけを、相対語ではない説明で理解できる |
| `README.md` | このrepositoryの利用者・開発者 | 同上 |
| `.claude/hooks/think_through_session_start.sh` | このrepositoryで作業するagent | 注入されたものが要約であり、skillの起動が別に必要だと判断できる（適用済み） |
| `.claude/hooks/think_through_user_prompt.sh` | 同上 | 同上（適用済み） |
| `scripts/verification/validate-plugin.mjs` | 変更を検証するagent | 自称の再混入を検知できる |
| `plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md` | context を解決するagent | version の実値を template から読まず、宣言値を読むべきだと分かる |

**完成後の内容と構造:**

`task-design/SKILL.md`:

- section 3 へ `### 3-5. 実行して初めて確定することは、段階を分けて設計する` を挿入する。位置は `3-4 不確実性のためならコードを書く` の直後。既存の `3-5 設計は対話であり転記ではない` は `3-6` へ繰り下がる
- 挿入する節は section 3 の型（`**思想:**` / `**違反シグナル:**` / `**帰結:**` / `**問い:**`）に従う。思想として書くのは「設計を尽くした単位は実行可能な一段階である」「段階を分ける三条件」「scope へ含めるかを決める二問」「技術検証実装との境界は、その成果物が次の段階の土台として残るかである」「途中の design.md は最終形を示さないため対象範囲を明示する」
- `3-4 不確実性のためならコードを書く` へ、技術検証実装との境界を一文加える。捨てられる成果物は土台にならず、土台になる成果物は捨てられない
- Step 3 の `2. 不確実性の解消手段を選ぶ` の表の直前へ、scope 判定の一段落を置く。解消手段は三つのまま増やさない
- 節番号を持つ参照（`→ 3-5` 等）を繰り下げに合わせて更新する。section 6 NG集 の参照も対象になる
- Step 4 の design 合意判定へ一項を追加する。新しい判断基準または規則を設計した場合、起点となった case 以外の具体 case を二つ以上当てて、意図した場所へ落ちることを確認する

`task-design/templates/design.md`:

- `### 受け入れ基準` のコメントへ、引き継ぎの観点の記入指示を足す。「この作業を破棄しても残る変化があるなら、それを後から更新・確認・復旧できることを受け入れ基準へ入れる。存在確認ではなく、運用documentの手順だけを入力として確認操作が通る形で書く」

`task-design/tasklist-design.md`:

- `### phase分割の方針` の箇条書き末尾へ、未開拓の実行基盤を伴う作業では基盤を立てる phase を最初に置き、その phase の DoD へ実測結果を含め、完了後に実測を入力として design へ戻る前提で plan を作ることを追加する
- `### 作業の外へ残るactionを含むphaseの原則` の MUST 二項の後へ、三つ目の MUST として、対象actionがある場合は引き継ぎの観点を design の受け入れ基準へ入れること、および停止・確認taskで設計時点に決めた運用documentと実態を照合することを追加する

`escalate-plugin-skill-fix/SKILL.md`:

- 「正本repository」を「plugin repository」へ置き換える。見出し `## 正本repositoryの判定` は `## plugin repositoryの判定`、`### 正本だった場合` は `### plugin repositoryだった場合`、`## 正本でない場合の引き渡し` は `## plugin repositoryでない場合の引き渡し` とする
- 「正本かどうか」「正本と決めつけない」等の単独用法も、判定対象が plugin repository であることが読めるよう書き換える
- 相対用法の2行は変更しない。`:47` の「正本は `migration.md` である」と `:90` の「それぞれの正本に委ね、複製しない」は、何に対する正本かが文中にある
- description の変更は `docs/documentation_standards/modify_description_policy.md` の規約に従う

`AGENTS.md`:

- `### tumeda-dev` の本文「このrepositoryが正本のskill plugin。実体は `plugins/tumeda-dev/`。」を、このrepositoryが何を持つかを述べる形へ変える。位置づけを相対語で示さない

`README.md`:

- `## 運用契約` の一項目目「共有手順の正本はこのpluginに置く。」は、コピー禁止規則の理由を自称なしで述べる形へ変える
- 同五項目目「正本repository自身も…正本だけを例外にしない。」は、このrepositoryも同じ contract 上で動くことを述べる形へ変える
- `## 変更時の検証と前提` の「このrepositoryの検査正本は…」は、検査手段が一つであることを述べる形へ変える。自称ではないため、置換語ではなく文の言い換えになる

`scripts/verification/validate-plugin.mjs`:

- `forbidText` を三件追加する。`AGENTS.md` に「正本」、`README.md` に「正本」、`plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md` に「正本repository」
- `expectedRelease` を version bump に合わせて更新する

`.claude/hooks/think_through_session_start.sh` と `think_through_user_prompt.sh`:

- 適用済み。冒頭から断定を外し、要約であることと `.steering/` を扱う前に `Skill` で `tumeda-dev:task-design` を起動することを明示した

`plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md`:

- `### version bump` から「現在の宣言値は…」の一行を削る。version の実値を template へ書かない。実値は宣言値4箇所と `expectedRelease` が持ち、`maintenance-plugin-context` は要求されたときにそれらを読んで返す
- template に残る他の repository 固有情報（remote URL、PR script の path、branch 契約）は対象外とする。同種の問題だが、扱うには template と instance の関係そのものを設計し直す必要がある

配布version:

- 変更はすべて既存skillの内容修正とdocsの変更であり、consumerが新たに呼べるものは増えない。PATCH を上げて `7.4.2` とする
- 宣言値4箇所（`plugins/tumeda-dev/.codex-plugin/plugin.json`、`plugins/tumeda-dev/.claude-plugin/plugin.json`、root `.claude-plugin/marketplace.json` の `version` と `plugins[].version`）と `validate-plugin.mjs` の `expectedRelease` を一度に更新する

**配置・形式:**

- 配置: 変更対象はすべて既存fileであり、新規fileの追加は現時点で予定していない
- 形式: Markdown。hook は bash script、検証は Node.js script
- 参照する既存pattern: skill本文は `docs/documentation_standards/how_to_write_workflow.md` と `modify_description_policy.md` に従う
- 正本と重複防止: skillは実行手順とownership、docsは種別横断の規範を持つ。同じ規範をskillとdocsへ二重に書かない

---

## 要件（Requirements）

### MUST（必達）

- 提案1〜4 のそれぞれについて、変更するfileと文面が確定していること
- 変更後に `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を返すこと
- 配布versionを、変更の互換性に応じて宣言値4箇所と `expectedRelease` の計5箇所で一度に更新すること
- hook 2 file の変更をこのsteeringの中でcommitすること
- 自称の再混入を止める `forbidText` を三件追加し、有効であること

### SHOULD（できれば）

- 提案4 で決めた呼称を、利用先repositoryへ持ち帰れる形で記録すること

### MAY（あれば嬉しい）

- なし

### 非目標

- 利用先repositoryの記述の修正。plugin側の呼称を決めるところまでを対象とする
- `.claude/hooks/` を配布物にすること。hookはこのrepository固有の運用物であり、plugin manifestは参照していない
- 「正本」の相対用法（対象が文中に明示されているもの）の一律置換

### 受け入れ基準

- `task-design/SKILL.md` に `3-5` として段階的に設計する節があり、段階を分ける三条件と scope 判定の二問を持つ。既存節の繰り下げと節番号の参照更新が済んでいる
- `task-design/SKILL.md` の Step 3 で、解消手段を選ぶ前に scope 判定を行う記述がある
- `templates/design.md` の受け入れ基準の記入指示に、引き継ぎの観点が入っている
- `tasklist-design.md` に、基盤phase を最初に置く指針と、対象actionがある場合の引き継ぎ担保の MUST がある
- `AGENTS.md`、`README.md`、`escalate-plugin-skill-fix/SKILL.md` に repository の自称としての「正本」が無い。escalate の相対用法2行は残っている
- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出力する。追加した `forbidText` 三件が有効である
- 宣言値4箇所と `expectedRelease` がいずれも `7.4.2` で一致している
- `tumeda-dev-plugin-context.md` の `### version bump` に version の実値が書かれていない
- hook 2 file を `bash` で実行すると、有効なJSONが返り、注入文面に断定が無い
- `task-design/SKILL.md` の Step 4 に、新しい判断基準を別の case で検証する項目がある
- `README.md` の `## 変更時の検証と前提` の記述だけを入力として、検証commandを実行できる

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 提案2 が既存の「design完了までplanを実行しない」契約を壊す | 衝突点を先に列挙し、契約を緩める範囲を明示して合意する。曖昧な例外条項にしない |
| 提案4 の置換で、相対関係が明示された正しい用法まで消える | 対象を「自称」に限定し、対象外候補を付録へ列挙したうえで線引きを合意する |
| hookを直しても利用先へ伝播しない | hookが配布対象でない事実を前提に置き、伝播が必要なら別の手段を設計する |
| 4提案を一度に入れて相互の整合が崩れる | 上位から順に解消する。提案1・2 が skill policy と workflow を規定し、提案3・4 はそれらへ依存しない |

---

## テスト方針

- `node scripts/verification/validate-plugin.mjs` を repository root で実行し、`plugin validation passed` を確認する
- hook 2 file は `bash <script>` を実行し、`jq` が有効なJSONを返すことと、注入文面が意図どおりであることを確認する
- skill・docsの内容は人のreviewで担保する。このrepositoryは自動test frameworkを持たない

---

## （付録）前提とする既存仕様

- **`tasklist-design.md` のDoD gate**: 「各phaseのDoDを『ユーザーが一つの操作をした時、何を確認できるか』の形で書く」「DoDが抽象的なままreviewへ進むことを禁止する」をMUSTとする。提案1 はこのgateと両立させる必要がある
- **`tasklist-design.md` の作業の外へ残るaction**: 「このphaseで起きる変化は、この作業を破棄しても残るか」を判定の問いとし、対象actionを含むphaseは単独phaseへ切り出し、末尾に停止・確認taskを置く
- **`task-design` の完了条件**: 未解消の設計判断が無いこと、分類保留がzeroであること。未解消のままplanを実行する経路を持たない
- **`steering` の禁止事項**: 「plan合意を実行開始の承認と読み替えない」「必須gateまたはユーザー確認を飛ばし、自動で次工程へ突入しない」
- **`.claude/hooks/` の配布範囲**: `plugins/tumeda-dev/` の中身は `docs` と `skills` だけで、plugin manifestはhookを参照しない。hookはこのrepository固有の運用物であり、利用先のhookは手動copyである
- **配布version**: 宣言値4箇所（`plugins/tumeda-dev/.codex-plugin/plugin.json`、`plugins/tumeda-dev/.claude-plugin/plugin.json`、root `.claude-plugin/marketplace.json` の `version` と `plugins[].version`）と `scripts/verification/validate-plugin.mjs` の `expectedRelease` が、いずれも `7.4.1` で一致している
- **`validate-plugin.mjs` の assertion**: `requireText` / `requireExists` / `requireFrontmatter` / `requireAbsent` / `forbidText` / `requireOrderedText` を持つ。`forbidText` は廃止した見出し・固定fieldの再混入検査に9箇所で使われている
- **「正本」の自称箇所**: `AGENTS.md:9`、`README.md:7`、`README.md:11`、`README.md:15`、`plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md` の description と本文（計5箇所）
- **「正本」の相対用法（対象外候補）**: `skills/runtime-execution-contracts.md`（taskの完了状態、session memory）、`skills/facilitate-discussion/SKILL.md`（discussion file）、`skills/tasklist-executor/SKILL.md`（design.md）、`skills/steering/SKILL.md`（成果物lifecycle）、`docs/documentation_standards/information_structuring/README.md`（値辞書、cases の ID 採番）、`docs/common_standard/function_migration_policy.md`（二重正本）

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |
| なし | | | |

<!-- hook 2 file の文面変更は利用先での適用であり、このrepositoryではまだcommitしていない。design合意後に扱う。 -->

### task-design内の対象成果物反映待ち

| 対象 | 待つ理由 | 依存decision | 参照するdesign section |
| --- | --- | --- | --- |
| なし | | | |

### execution plan対象

| 対象 | 掲載理由 | 参照するdesign section |
| --- | --- | --- |
| `plugins/tumeda-dev/skills/task-design/SKILL.md`、`templates/design.md`、`tasklist-design.md`、`escalate-plugin-skill-fix/SKILL.md`、`AGENTS.md`、`README.md`、`scripts/verification/validate-plugin.mjs`、version宣言値4箇所、`.claude/hooks/` 2 file | 順序依存する複数段階と中間checkpointを持つ。節番号の繰り下げと参照更新を先に終えないと、後続の記述追加が壊れた参照の上に乗る。用語の置換は `forbidText` の追加より前に完了していなければ validation が落ちる。version bump は全変更の後でなければ、途中の状態で宣言値と実装がずれる | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) |

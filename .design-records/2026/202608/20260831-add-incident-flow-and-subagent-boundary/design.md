# Design: 不測の事態への対処とsubagent境界の扱いをskillへ加える

## 元の依頼内容

利用先repositoryでのsteering実行中に生じた4件の修正提案を、`escalate-plugin-skill-fix`経由で引き渡したもの。2件はユーザーの明示指示、2件は実行中に検出したprocess不足。

**提案1**: `task-design`の`PrepareStep 3. 設計前調査`へ「変更対象fileを説明している既存docsを探す」観点を追加する。build scriptを`package.json`へ集約する設計で、変更対象を説明していたREADMEに変更後に不正確になる記述が3箇所あり、うち1箇所はその設計でまさに削除する運用を指示していた。execution plan対象から漏れ、steeringのReady result後の必須gateで辛うじて検出された。根本原因は、`PrepareStep 3`の調査範囲が`maintenance-plugin-context`が返した文書に閉じており、READMEを読む指示がGraphQL mutationまたはCommandの変更・追加に限定されていること。

**提案2**（ユーザー明示指示、原文）:

> 実装中に、決めてないことを勝手に決める、なんだったらdesignの最中に決められたようなことを勝手に判断したりやspikeできたら弾けた不確実性ををえいやで試しながら進むのはご法度だけど、ちゃんと設計しきってこれで行けると思った状態で不測の事態に陥った際は、報告しながらも、試行錯誤してくれるのはありがたい。不測の事態脱出後にtasklistに沿うことは守るうえで、ユーザに言われたこと関係なく、一旦不測の事態解消のために色々動いていいか(yes/no)、その場合に、いちいち方針を問うか（yes-no）、それとも自走できる限り自走するか（yes-yes）を聞いてほしい（yes-noとかはそのまま聞かず、a,b,cとか答えやすい形で）。そのためにskillを変えてもらおうかな。

**提案3**: `steering`へ、dispatch先が停止・失敗したときに成果物を読む手順を追加する。1回目の`tasklist-executor`は`tasklist.md`のtask配下へ詳細なnoteを書き残していたが、steeringは返却result（`blocked`と要約）だけを読んだ。その結果、executorが実装を修正していたのに`design.md`が旧内容のままで実装と設計が食い違ったまま後続Phaseが進み、executorが既に3パターンで再現していた事象を知らずに同じ実験を精度の低い形でやり直した。

**提案4**（ユーザー明示指示、原文）:

> 不測の事態が起きたら、そのsteeringディレクトリの中で、subagent_report/の中にレポーティングをしてもらおうかな。.steering直下の.gitignoreでsubagent_report配下は管理対象外にして。この.gitignore自体もスキルプラグインのsteeringスキルのディレクトリの中に.gitignore.sampleの形で置いてもらって

---

## TL;DR

現状、`steering`は「steering自身が実装codeを変更する」を無条件禁止とだけ定めており、Flowが前提とする実行条件が崩れて内側では復旧できなくなった場合の扱いを持たない。dispatch先が停止・失敗したときに何を読むかも定めていない。また`task-design`は、変更対象fileを説明している既存docsを逆引きする観点を持たない。

終了時には、実行条件が崩れた状態を解消する行為を`resolve-blocker`という名前で持ち、それが「実装しない」という能力境界の唯一の例外であること、成立条件が「設計を尽くした後」かつ「Flowの内側では復旧できない」の2つであることが`steering`から一意に読める。dispatch先が停止・失敗した場合は返却resultだけで判断せず、更新された成果物を読む手順が定まる。`blocker resolution`中の記録先も定まる。`task-design`は変更対象から既存docsを逆引きする観点を持つ。`naming/core.md`は、表現の一致を意味の一致と取り違えないための判断基準を持つ。

---

## 完成後の姿

### skillの役割と方針

#### steering

steeringは、設計と実行を分離した状態を保ちながら成果物を完成まで運ぶ。設計判断はtask-designへ、実装はtasklist-executorまたは子steeringへ委ね、steering自身は判断せず実装しない。この分離は、設計を尽くさないまま実装で辻褄を合わせる経路を塞ぐために存在する。

##### `resolve-blocker`だけが実装しない境界の例外である

steeringが自ら手を動かしてよいのは、Flowが前提とする実行条件が崩れ、Flowの内側では復旧できなくなった`blocker`を解消するときだけである。この行為を`resolve-blocker`と呼ぶ。

例外が成立する条件は次の2つがともに満たされることであり、片方だけでは成立しない。

- 設計を尽くした後である。designが合意され、tasklistが合意され、実行に入っている
- Flowの内側では復旧できない。次のstepへ進めず、現在のstepも完了できず、skillが定めた手順のどれを実行しても状態が変わらない

条件1 が欠けて条件2 だけが成立するなら設計不足であり、designへ戻る。条件2 が欠けて条件1 だけが成立するなら通常のtask失敗であり、`tasklist-executor`の停止・再開contractで扱う。この2条件が、例外を「詰まったから手を動かす」へ拡張させない歯止めである。

##### 設計で潰せた不確実性を実行中の試行錯誤へ持ち込まない

`resolve-blocker`が許容するのは実行条件の回復だけである。次の3つは`blocker`の解消に見えても許容しない。

- 実装中に、designで決めていないことを決める
- design中に決められたはずのことを、実装中に判断する
- spikeで潰せたはずの不確実性を、えいやで試しながら進める

いずれも「設計を尽くした」という前提を満たしていない。これらを`resolve-blocker`として実行すると、設計と実行の分離そのものが崩れる。判断時は「この不確実性は、designまたはspikeで潰せたか」と問う。潰せたならそれは`blocker`ではなく設計不足である。

##### `blocker`を解消してもFlowの成果にはしない

`resolve-blocker`は実行条件を回復させるためだけの行為であり、tasklistのtaskを進めることを目的にしない。`blocker resolution`中に副次的にtaskが進んでいても、tasklistのcheckboxはstep内の通常手順で確定させる。

この区別を失うと、`resolve-blocker`が実装の抜け道になる。「blockerを解消するついでに実装した」を成果として数えないことが、例外を例外のまま保つ条件である。

### workflow

`blocker resolution`はFlowに対して並行して存在する経路であり、Flowの一部ではない。任意のstepから離脱し、同じstepへ戻る。

```text
Step 1 → Step 2 → Step 3 → Step 4 → Step 5 → Step 6
   │        │        │        │        │        │
   └────────┴────────┴────────┴────────┴────────┘
                      実行条件が崩れる
                            │
                            ▼
              ┌──────────────────────────┐
              │ blocker resolution        │
              │ （Flowの外側）            │
              │  確認 → 復旧行為 → 回復確認 │
              └──────────────────────────┘
                            │
                     実行条件が回復
                            │
                            ▼
                 離脱したstepの先頭へ戻る
```

stepとして番号を与えない。実行条件の崩壊はStep 6のdispatch中に限らずStep 1のbranch作成でも起こり得るため、特定stepの後続として置けない。また既存Flowは「順序固定」であり、条件分岐のstepを挿すとその性質が崩れる。

**`blocker`検知時の確認:**

`blocker`を検知した時点で、ユーザーの指示の有無に関わらず次の3択を1回で問う。

```text
Flowが進められない状態を検知した。（何が起きているかを1〜2文で示す）

a. Flowから離れず、ここで停止して指示を待つ
b. blockerの解消のためにFlowから離れる。方針は都度確認する
c. blockerの解消のためにFlowから離れる。解消できる限り自走する
```

2軸（離れるか / 離れた後どう進めるか）を`yes/no`の入れ子で2段に分けない。入れ子では1回目の回答時点で何を承諾したことになるのかが確定しないため、`no` / `yes-no` / `yes-yes`の3通りへ展開して1往復で取る。

`a`を先頭へ置くのは、離れることを既定にしないためである。選択肢として提示されなければ、agentは「離れてよいか」という問い自体を離れる前提の確認として出しやすい。

既存の`5-2. planの実行開始をユーザーへ確認する`は「進むか否か」の2値を扱う形式であり、この2軸の判断には流用しない。

**自走（`c`）の範囲と報告:**

`c`を選ばれた場合も、次は自走の範囲に含めない。該当したら`b`と同じく都度確認へ戻る。

- 破壊的操作。削除、強制上書き、履歴の書き換え、稼働中の外部resourceの再作成
- repository外への影響。push、PR作成、外部serviceへの送信
- `blocker`の解消に必要な範囲を超える変更

選定基準は「取り返しがつかないか、影響がrepositoryの外へ出るか、`blocker`と無関係か」である。3つめは`resolve-blocker`が実行条件の回復だけを目的とすることに対応し、ここが緩むと`blocker`の解消を名目にした任意の実装が正当化される。

報告は離脱したstepへ戻る時点で1回行い、何が`blocker`だったか、解消のために行ったこと、解消できたか、判明した事実のうちdesign・tasklist・repository知識へ影響するものを含める。自走中に逐一報告しない。報告のたびに応答を待つなら`c`が`b`と同じになる。

**離脱したstepへの復帰:**

実行条件が回復したら、離脱したstepの先頭へ戻る。戻り先はこれ1つであり、「次のstepへ進む」を選べない。離脱したstepの入口条件が満たされたかは、復帰時に改めて確認する必要があるためである。次へ進めると、崩れた条件のまま先へ行く経路ができる。

復帰時に行うことは次の2つだけである。

- 離脱したstepをその入口条件から改めて実行する
- 上記「自走（`c`）の範囲と報告」で定めた報告を1回行う

`blocker resolution`中に副次的にtaskが進んでいても、tasklistのcheckboxはstep内の通常手順で確定させる。復帰した時点でcheckboxを更新しない。

**`blocker resolution`中の記録:**

判明した事実は`.steering/YYYY/YYYYMM/YYYYMMDD-slug/subagent_report/`へ記録し、追跡対象外とする。`.steering/.gitignore`へ`*/*/*/subagent_report/`を置き、`.gitignore`自体は追跡対象に残す。

追跡対象外にする根拠は、`commitへ載せる順序`が定める合意記録の性質との対比である。`design.md`、`tasklist.md`、discussion fileは「どの変更がどの合意に基づくか」を後から辿るために追跡される。`blocker resolution`の記録は実行条件の回復に関する調査ログであり、この性質を持たない。

名前を`subagent_report/`とするのは、記録される内容が「subagentの実行中に何が起きたか」であり、`blocker`の多くがsubagentの停止・失敗として現れるためである。

**dispatch先が停止した時に読む対象（Step 6-1 の通常手順）:**

この手順は`blocker resolution`の一部ではない。dispatch先の停止はそれ自体では`blocker`ではなく、`runtime-execution-contracts.md`が定める停止理由のうち`delegation_required`、`user_confirmation_required`、`phase_checkpoint`はFlowが想定する正常停止である。停止理由で分岐させず常に行う。

- executorがどの停止理由で返しても、返却resultだけで次の判断をしない
- `tasklist.md`のcheckboxと、task配下にexecutorが書き残したnoteを読む
- `artifact_directory`にrequest / result artifactがあれば読む
- 読んだ内容が`design.md`と食い違う場合、実装を進める前に`実装完了後review`へ回す

根拠は`runtime-execution-contracts.md`の`状態の正本とsingle writer`にある。taskの完了状態の正本はtasklistの`[ ]` / `[x]`、child処理の状態の正本はrequest / result artifactと定められ、返却resultはこの列挙に含まれない。「resultは正本ではない」は既に契約として成立しており、不足しているのはsteering側の読み取り義務だけである。

4点目を加えるのは、読む義務だけでは読んだ後の行き先が定まらないためである。食い違いを検知する場所がないと、実装と設計がずれたまま後続phaseが進む。

**正本repositoryでの作業完了後の取り込み（`escalate-plugin-skill-fix`）:**

正本repositoryでのsteeringがcommitまで終わったら、作業branchをpushし、`main`へ切り替え、作業branchを`main`へmergeし、`main`をpushする。PRの作成・mergeを経由しない。

PRを経由しないのは、正本repositoryが利用先repositoryから見てsubであり、pluginの更新がメインの作業を再開するための前段だからである。PRを開いてreviewを待つ相手がいないため、review単位としてのPRが機能しない。変更の妥当性は正本repositoryでのsteeringがdesign合意とtasklist合意で担保しており、PRはその上に別のgateを重ねるものではない。

`steering`側は変更しない。PRを経由するかどうかはrepositoryのreview要否で決まり、`steering`というskillの性質ではない。`steering`の完了後actionを変えると利用先repositoryでの振る舞いまで変わり、そこで機能しているreview単位としてのPRを壊す。

merge方式と、取り込み後の再install / reloadは規定しない。前者は正本repositoryの既存運用に従い、後者は同skillが既に持つ「修正後のskillで動くには新しいsessionを開始する必要がある」という記述の判断に含まれる。

### documentationが成立させる知識

`plugins/tumeda-dev/docs/development_standards/naming/core.md`へ`## 表現が同じでも、名前空間が違えば別の意味を持つ`を追加する。位置は`## 修飾の向きで指すものが変わる`の直後。

**読者:** 名前を付けようとしていて、同じ表現が別の場所で既に使われていることに気付いた人。

**成立させる判断:** 表現の一致を理由に候補から外すのではなく、その2つが同じ読み手に同じ場面で出会うかを問い、名前空間が違えば共存させられる状態。

**内容:**

判断の問いは「その2つは、同じ読み手が同じ場面で出会うか」である。出会うなら同じ名前空間にあり、意味が違うなら別の名前にする。出会わないなら名前空間が違い、表現が同じでも共存してよい。

名前空間はディレクトリやmoduleの境界だけで決まらない。読み手と場面で決まる。同じfile内でも扱う対象が違えば別の名前空間になり得る。逆に別fileでも、同じ読み手が同じ判断のために両方を読むなら同じ名前空間である。境界で定義すると、境界をまたぐ参照がある場合に判定を誤る。

失敗例として「語の出現箇所をgrepで数え、ヒットしたことだけを理由に候補から外す」を挙げる。これをやると出現数の多い一般語（`state`、`owner`、`context`等）がすべて使用不能になる。これらは文脈ごとに違う意味で使われており、それで機能している。

**この更新が必要な理由:** 「同じ語がある」ことと「読み手が誤解する」ことを区別する基準がnaming標準に存在しなかった。基準がないため、grepのヒット数だけで候補を排除する判断が生まれる。`core.md`へ置くのは`README.md`の判断の問い「名前を付ける対象が何であっても成立するか」に対して成立するためであり、独立fileにしないのは同fileが「積集合だけを扱う」と定めるためである。

#### root `README.md`の運用契約

**読者:** このrepositoryを変更する人、およびpluginを利用先へ導入する人。

**成立させる判断:** 正本repository自身も`.agents/skills/tumeda-dev-plugin-context.md`のinstanceを持つべきかを、契約から判断できる状態。

**変更内容:** `## 運用契約`へ次の1行を加える。

> - 正本repository自身も`<repository-root>/.agents/skills/tumeda-dev-plugin-context.md`のinstanceを持つ。pluginを開発する時もshared skillは同じcontract上で動くため、正本だけを例外にしない。

**この更新が必要な理由:** 現行の運用契約は「repository固有の文書・command・規約は`<repository-root>/.agents/skills/tumeda-dev-plugin-context.md`に置く」とだけ書き、正本repository自身が対象かを述べていない。実際、正本のinstanceは全sectionがコメントのみで実factが未記入だった。今回のsteeringで`task-design`がconsumerとして起動したとき、プロジェクト指示、architecture文書、開発規約、test方針、test command、lint commandのいずれも取得できず、確認元から検証して書き込む必要が生じた。

利用先repositoryのinstanceは埋まっているのに正本が空だったという非対称は、契約が正本を対象に含むと明示していないことから生じる。

### documentation以外のfile deliverable

**対象と読者:**

| file | 主な読者 | 読後または利用後にできること |
| --- | --- | --- |
| `plugins/tumeda-dev/skills/steering/SKILL.md` | steeringを実行するagent | `blocker`に遭遇したとき、Flowを離れてよいかを2条件で判定し、3択で確認を取り、離脱したstepへ戻れる。dispatch先が停止したとき、何を読んでから次の判断へ進むかを判断できる |
| `plugins/tumeda-dev/skills/task-design/SKILL.md` | task-designを実行するagent | 変更対象fileから、それを説明している既存docsを逆引きして探せる |
| `plugins/tumeda-dev/skills/steering/.gitignore.sample`（新設） | steeringを導入する利用先repositoryの管理者 | `.steering/.gitignore`として配置し、`subagent_report/`を追跡対象外にできる |
| `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md` | 利用先repositoryからpluginへ修正を引き渡すagent | 正本repositoryでの作業完了後、PRを経由せず`main`へ取り込み、本線へ戻れる |
| `scripts/verification/validate-plugin.mjs` | このrepositoryを変更する人 | 変更後のskillとdocsが、意図した見出しと契約文を持つことを検査できる |

**完成後の内容と構造:**

`steering/SKILL.md`へ加える3箇所と、書き換える1箇所。

```text
## Blocker resolution                      ← 新設。policy（判断基準）とworkflow（手順）を持つ
   ### 例外が成立する2条件
   ### 設計で潰せた不確実性を持ち込まない
   ### 検知時の確認（a / b / c の3択）
   ### 自走の範囲と報告
   ### 離脱したstepへの復帰
   ### blocker resolution中の記録先

#### 6-1. leafを実行する                    ← 追記。停止時に読む対象4点

## このskillが絶対にやらないこと            ← 書き換え。無条件禁止からBlocker resolutionへの参照付きへ
```

`task-design/SKILL.md`は`PrepareStep 3`の項目3 を置き換える。項目数は増やさない。

`escalate-plugin-skill-fix/SKILL.md`は`## 引き渡し後の前提`を`## 引き渡し後`へ改め、取り込み手順4stepとPRを経由しない理由を追加する。既存の3項目（元taskは中断したまま、skill修正はsessionへ反映されない、再開方法はユーザーが選ぶ）は変更しない。

`scripts/verification/validate-plugin.mjs`は、今回の変更へassertionを追随・追加する。root `README.md`の`## 変更時の検証と前提`が「skillまたはdocsを追加・変更したら、対応するassertionをこのfileへ追加する」「既存assertionがピン留めしている文字列を変更したら、そのassertionも追随させる」と定めるためである。

- 追随: `validate-plugin.mjs:900`の見出し一覧にある`## 引き渡し後の前提`を`## 引き渡し後`へ変える。変えないと検査が失敗する
- 追加: 今回新設・変更する見出しと契約文のうち、失われると設計が崩れるものをピン留めする

`.gitignore.sample`の内容は次のとおり。利用先で動作確認済みである。

```
# subagent の実行レポートは各 steering ディレクトリのローカル記録として扱い、追跡しない。
# 不測の事態が起きたときの調査ログであり、design / tasklist / discussion のような
# 合意の正本ではないため。
*/*/*/subagent_report/
```

**配置・形式:**

- 配置: `.gitignore.sample`は`plugins/tumeda-dev/skills/steering/`直下。同skillの`scripts/`と並ぶ
- 形式: Markdownではなくgitignore形式。`.sample`suffixにより、そのままでは効かず利用先が`.steering/.gitignore`へ複製して使うことを示す
- 参照する既存pattern: 利用先repositoryが`.agents/skills/tumeda-dev-plugin-context.md`をtemplateから複製する形と同じく、plugin側がsampleを持ち利用先が複製する

**正本と重複防止:**

`resolve-blocker`のpolicyとworkflowは`steering/SKILL.md`の`Blocker resolution`が唯一の正本とする。`このskillが絶対にやらないこと`は参照だけを持ち、条件や手順を複製しない。

### version bump

`7.4.0` → `7.4.1`（PATCH）。

規約は「consumerが新たに呼べるものが増えたか」でMINORとPATCHを分ける。今回は既存skillの内容修正だけであり、新しいskillも新しいparameterも増えない。`.gitignore.sample`の新設は「新規fileの追加それ自体はMINORの根拠にならない」に該当する。

更新箇所は5つ。

- `plugins/tumeda-dev/.codex-plugin/plugin.json` の `version`
- `plugins/tumeda-dev/.claude-plugin/plugin.json` の `version`
- root `.claude-plugin/marketplace.json` の `version`
- 同fileの `plugins[]` 内、`name: tumeda-dev` の `version`
- `scripts/verification/validate-plugin.mjs` の `expectedRelease`

---

## 要件（Requirements）

### MUST（必達）

- `resolve-blocker`が「実装しない」という能力境界の唯一の例外であること、およびその成立条件が2つであることが`steering/SKILL.md`から一意に読める
- `このskillが絶対にやらないこと`と`Blocker resolution`が矛盾しない。無条件禁止の文言を残したまま別の場所へ例外を書かない
- `blocker`検知時の3択（`a` / `b` / `c`）と、自走時に都度確認へ戻す3種が定まっている
- dispatch先がどの停止理由で返しても、返却resultだけで判断せず`tasklist.md`とartifactを読む手順が`Step 6-1`にある
- `blocker resolution`中の記録先が`subagent_report/`であり、追跡対象外である
- `task-design`の`PrepareStep 3`が、変更対象fileから既存docsを逆引きする観点を持つ
- `naming/core.md`が、表現の一致と意味の一致を区別する判断基準を持つ
- `escalate-plugin-skill-fix`が、正本repositoryでの作業完了後に`main`へ取り込む手順と、PRを経由しない理由を持つ
- root `README.md`の運用契約が、正本repository自身もplugin contextのinstanceを持つことを述べている
- `validate-plugin.mjs`のassertionが今回の変更へ追随しており、新設した見出しと契約文がピン留めされている
- version宣言値4箇所と`expectedRelease`が`7.4.1`で一致する

### SHOULD（できれば）

- `Blocker resolution`の記述が、既存の`ファインプレー即時記録の原則`と同じく「原則から外れてよい条件」を扱う形で読める

### MAY（あれば嬉しい）

- なし

### 非目標

- `tasklist-executor`自体の安定性向上。executorが停止する原因の除去は別scopeである
- `blocker`の自動検知。agentが自力で「これは`blocker`だ」と判定する仕組みは作らない。2条件の判定はagentが行うが、検知の自動化は含まない
- `runtime-execution-contracts.md`の停止理由の追加・変更。今回は既存の停止理由をそのまま使う
- 利用先repositoryへの`.steering/.gitignore`の自動配置。plugin側は`.gitignore.sample`を提供するだけとする

### 受け入れ基準

- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を返す
- `このskillが絶対にやらないこと`の該当行が、`Blocker resolution`を参照する形になっている。無条件禁止の文言のまま残っていない
- `plugins/tumeda-dev/skills/steering/.gitignore.sample` が存在し、内容が利用先で動作確認したものと一致する
- `plugins/tumeda-dev/skills/task-design/SKILL.md` の `PrepareStep 3` の項目数が5のまま変わらず、項目3 が file種別による限定を含まない
- `plugins/tumeda-dev/docs/development_standards/naming/core.md` に `## 表現が同じでも、名前空間が違えば別の意味を持つ` があり、`## 修飾の向きで指すものが変わる` の直後に位置する
- `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md` の節名が `## 引き渡し後` であり、取り込み手順4stepとPRを経由しない理由を含む
- root `README.md`の`## 運用契約`に、正本repository自身もinstanceを持つ旨の記述がある
- `validate-plugin.mjs`に`## 引き渡し後の前提`が残っておらず、`## 引き渡し後`へ追随している
- `validate-plugin.mjs`に`## Blocker resolution`と、`このskillが絶対にやらないこと`の該当行が`Blocker resolution`を参照することのassertionがある
- version宣言値4箇所と`expectedRelease`がすべて`7.4.1`である

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| `resolve-blocker`が「実装してよい」の抜け道になり、設計を尽くさないまま試行錯誤へ入る | 成立条件を2つとも満たすことを要求し、片方だけでは成立しないと明記する。条件1 が欠ければ設計不足としてdesignへ戻し、条件2 が欠ければ通常のtask失敗として`tasklist-executor`の停止・再開contractへ回す。あわせて許容しない3種（designで決めていないことを決める / design中に決められたはずのことを実装中に判断する / spikeで潰せた不確実性をえいやで試す）をpolicyへ置く |
| 3択の確認が形骸化し、agentが確認せず自走する | `a`を先頭へ置き、「Flowから離れない」を明示的な選択肢にする。離れることを既定にしない。確認は「ユーザーの指示の有無に関わらず」行うと明記し、事前に自走を許可されていても`blocker`検知時には改めて問う |
| `resolve-blocker`が実装の抜け道になり、`blocker`解消のついでに実装が進む | `blocker resolution`中に副次的にtaskが進んでも、tasklistのcheckboxはstep内の通常手順で確定させると明記する。復帰先を「離脱したstepの先頭」に固定し、「次のstepへ進む」を許さない |
| 見出しの変更がassertionに追随せず、検査が失敗する | root `README.md`の`## 変更時の検証と前提`に従い、変更する見出しをピン留めしている既存assertionを事前に特定する。`validate-plugin.mjs:900`の`## 引き渡し後の前提`が該当することを実測で確認済み |
| 新設した契約文がassertionでピン留めされず、次回の変更で無言に壊れる | 今回新設する見出しと、失われると設計が崩れる契約文へassertionを追加する。とりわけ`このskillが絶対にやらないこと`が`Blocker resolution`を参照する形は、参照が消えると無条件禁止へ戻るため必ずピン留めする |
| 条項を足した結果、`steering/SKILL.md` が肥大化して読まれなくなる | `Blocker resolution`を1つの節へまとめ、`このskillが絶対にやらないこと`からは参照だけを持たせる。条件や手順を複数箇所へ複製しない。`task-design`側は項目を増やさず既存項目3 を一般化する |

---

## テスト方針

このrepositoryは自動test frameworkを持たない。検証は`node scripts/verification/validate-plugin.mjs`によるplugin manifestの整合確認だけであり、skill本文の内容は人のreviewで担保する。

検証手順は次の2つである。

1. `node scripts/verification/validate-plugin.mjs` を実行し、`plugin validation passed` を確認する。version宣言値4箇所と`expectedRelease`の一致を検査する
2. 受け入れ基準に挙げたgrepと存在確認を実行する

skill本文の内容が意図どおりかは、`受け入れ基準`のgrepで機械的に確認できる範囲を超える。矛盾の不在（`このskillが絶対にやらないこと`と`Blocker resolution`）は人のreviewで担保する。このrepositoryはlinterを持たず、skill本文へのlint相当の検査は存在しない。

---

## （付録）前提とする既存仕様

- `plugins/tumeda-dev/skills/steering/SKILL.md`（確認元: 実file）
  - 「このskillが絶対にやらないこと」に「steering自身が実装codeを変更する。実装は明示承認後にtasklist-executorまたは子steeringへdispatchする」がある。dispatch先が機能しない場合の扱いはない。
  - `Step 6-1. leafを実行する`は、tasklist-executorへ渡すものと、executorに守らせることを定める。executorが停止・失敗した場合の記述はない。
  - `Ready result後の必須gate`（4-1〜4-3）、`ファインプレー即時記録の原則`、`実装完了後review`を持つ。
  - 成果物のlifecycleは`design.md`、`task-design-discussion.md`、排他的plan、`discussion.md`、`implementation_review.md`を定める。`subagent_report/`はない。
- `plugins/tumeda-dev/skills/task-design/SKILL.md`（確認元: 実file）
  - Step番号体系は`PrepareStep 1 / 2 / 3`と`Step 1〜6`。`PrepareStep 3. 設計前調査`が調査を持つ。
  - `PrepareStep 3-3`は「GraphQL mutationまたはCommandの変更・追加では、関連moduleのREADMEを先に読み」と限定している。
  - `PrepareStep 3-4`は`doc-enricher`へ即座に渡すことを定める。
- version宣言値は4箇所すべて`7.4.0`で一致し、`scripts/verification/validate-plugin.mjs`の`expectedRelease`も`7.4.0`（確認元: 実測）。
- このrepositoryはlinterを持たず、`package.json`も存在しない（確認元: 実測）。
- root `README.md`の`## 変更時の検証と前提`が次を定める（確認元: 実file）。
  - skillまたはdocsを追加・変更したら、対応するassertionを`scripts/verification/validate-plugin.mjs`へ追加する。
  - 既存assertionがピン留めしている文字列を変更したら、そのassertionも追随させる。見出し、step番号、章番号、契約文の変更はすべてこれに当たる。
  - `forbidText`を先に確認する。`requireText`は追随を怠ると検査が落ちて気づけるが、`forbidText`は落ちないまま無力化する。
- `validate-plugin.mjs:900`が`escalate-plugin-skill-fix/SKILL.md`の見出し一覧を`requireText`でピン留めしており、`## 引き渡し後の前提`を含む（確認元: 実測）。節名を変更するとこのassertionが失敗する。
- `forbidText`は16件あり、今回変更する箇所を禁止対象にしているものはない（確認元: 実測）。`### Step 0`はtask-designの旧番号で、既にリネーム済みの箇所を指す。
- 直近マージ`20260831-add-evacuation-standard-and-refine-task-design`の`evacuation`はentity modelingの退避基準であり、提案2 の「不測の事態」とは無関係（確認元: `git diff`）。
- 利用先で動作確認済みの`.steering/.gitignore`の内容は次のとおり。`git check-ignore`で除外が効き、`.gitignore`自体は追跡対象に残ることを確認済み。

  ```
  # subagent の実行レポートは各 steering ディレクトリのローカル記録として扱い、追跡しない。
  # 不測の事態が起きたときの調査ログであり、design / tasklist / discussion のような
  # 合意の正本ではないため。
  */*/*/subagent_report/
  ```

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

なし

### task-design内の対象成果物反映待ち

なし

### execution plan対象

| 対象 | 掲載理由 | 参照するdesign section |
| --- | --- | --- |
| `plugins/tumeda-dev/skills/steering/SKILL.md` | version bumpと同じ実行単位で反映する必要がある。skill本文の変更とmanifestのversionがずれた状態でinstallされると、利用先が新しい記述を古いversionとして受け取る | [skillの役割と方針](#skillの役割と方針) / [workflow](#workflow) |
| `plugins/tumeda-dev/skills/task-design/SKILL.md` | 同上 | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) |
| `plugins/tumeda-dev/skills/steering/.gitignore.sample` | 同上 | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) |
| `plugins/tumeda-dev/docs/development_standards/naming/core.md` | 同上。skill本文と同じversionで配布する | [documentationが成立させる知識](#documentationが成立させる知識) |
| `README.md`（root） | 運用契約の1行追加。今回のsteeringで正本のinstanceが空だったことが判明したため、同じ実行単位で反映する | [documentationが成立させる知識](#documentationが成立させる知識) |
| `.agents/skills/tumeda-dev-plugin-context.md` | 正本repositoryのinstance。今回のsteeringで`task-design`のsectionと共通sectionへ実factを書き込んだ。契約の追加と同じ実行単位で扱う | [documentationが成立させる知識](#documentationが成立させる知識) |
| `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md` | 同上 | [workflow](#workflow) |
| `scripts/verification/validate-plugin.mjs` | assertionの追随と追加。version bumpの`expectedRelease`と同じfileであり、同じ実行単位で扱う。追随しないと検査が失敗し、追加しないと今回の変更が次回の変更で無言に壊れる | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) |
| `plugins/tumeda-dev/.codex-plugin/plugin.json` | version宣言値。5箇所を一度に変える必要があり、部分適用では`validate-plugin.mjs`が失敗する | [version bump](#version-bump) |
| `plugins/tumeda-dev/.claude-plugin/plugin.json` | 同上 | [version bump](#version-bump) |
| `.claude-plugin/marketplace.json` | 同上。`version`と`plugins[]`内の2箇所を持つ | [version bump](#version-bump) |
| `scripts/verification/validate-plugin.mjs` | 検査側の期待値`expectedRelease`。宣言値だけを変えると検証が失敗する | [version bump](#version-bump) |

掲載理由は第2条件（順序依存する複数段階、中間checkpoint、独立した検証単位が必要で、一つの連続した反映・validationでは安全に完了できない作業）による。

skill本文の変更自体は合意済みdesignから一意に反映でき、単独ではtask-design内で扱える。しかしversion bumpが伴うため、宣言値4箇所と`expectedRelease`の計5箇所を一度に変え、その後`validate-plugin.mjs`で検証する順序が必要になる。部分的に適用した中間状態では検証が失敗し、その状態でinstallすると利用先が壊れる。skill本文とversionを別々のタイミングで反映すると、利用先が新しい記述を古いversionとして受け取る。

したがってskill本文4件、docs 1件、version関連4件（`validate-plugin.mjs`はassertionと`expectedRelease`の両方を持つため重複して数えない）は同じ実行単位で扱い、最後に検証する。この順序性がexecution planを必要とする理由である。

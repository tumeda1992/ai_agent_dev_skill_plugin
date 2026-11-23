# 議論記録

<!--
このfileはpluginの公開配布物に含まれる。`maintenance_policies/migration.md`に従い、
利用先repositoryの名称、所有者名、絶対path、固有ドメイン名、固有steering slugを書かない。
-->

## 論点1: plugin skill修正提案が生じた時の記録先と、その指示の置き場所

**ステータス:** 決定

**種別:** 認識齟齬 / TBDヒアリング

### イテレーション0: 確定している不変条件をTBDから外し、残る実質decisionだけを扱う

#### 提案0

##### 先に確定として扱うもの（TBDではない）

**このpluginのskillの修正は、plugin正本repositoryで行う。議論の記録先も正本repositoryのsteering directoryとする。** これは選択肢ではなく不変条件であり、`design.md`のTBDから外す。

`design.md`のMUST「議論の記録先repositoryとfileが一意に決まる」は、この確定事項と、未決の実質decision（利用先repositoryで進行中のsessionから、どうやってそこへ到達させるか）を一つのTBDへ束ねていた。確定側を上記へ移し、MUSTを次へ置き換える。

> 利用先repositoryでplugin skillの修正提案が生じたとき、agentが現在のdiscussion fileで議論を続けず、plugin正本repositoryへ移ることが、workflow上のtriggerとして担保される。

##### 残る実質decision: 指示を二箇所へ分割して書く

trigger文をagentが実際にいる場所へ置き、手順の本体を`maintenance-plugin-context`へ置く。

###### 変更1: `plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md` の `2.1.1`

原因owner分類表の直後の段落へ続けて、一段落だけ追加する。表とその他の段落は変更しない。

```diff
 repository知識またはskillの不足では、具体ケース固有の修正を先に合意しない。原因ownerの一般則を主decisionとして合意した後、元の具体ケースをその適用例として必ず再評価する。一般則だけで変更が一意に決まらなければ、残る判断を具体ケース側のdecisionとしてdiscussionへ保存する。
+
+原因ownerが`skill`で、その対象がこのpluginのskillであり、現在のrepositoryがpluginの正本repositoryでない場合は、この議論を現在のdiscussion fileで続けない。正本repositoryで`steering`を起動して扱う。手順は`maintenance-plugin-context`が所有する。合意してから移設する運用にしない。
```

###### 変更2: `plugins/tumeda-dev/skills/maintenance-plugin-context/SKILL.md`

`## Maintenance policies` と `## Plugin version` の間へsectionを新設する。既存sectionは変更しない。

```diff
 - `maintenance_policies/migration.md` — skillを参考元（移植元 upstream）や参照先リポジトリと行き来させる（新規移植・追随・逆輸入）時の追加規約。**取り込む内容から参照元リポジトリ固有の情報を抜き、汎用知識だけをpluginへ記載する**。skill本体・`.steering/` 成果物・docs・slugすべてに適用する。共通規範とこのfileを移植・追随作業の前に必ず読む。

+## 利用先repositoryで生じたskill修正提案の扱い
+
+利用先repositoryでskillを実行中にこのpluginのskill修正提案が生じた場合、その議論を利用先repositoryのdiscussion fileで続けない。plugin正本repositoryで`steering`を起動し、そこで議論と変更を行う。専用の修正skillは設けず、既存の`steering`を使う。
+
+- 記録先は正本repositoryの`.steering/`配下のsteering directoryとする。利用先で合意してから移設する運用にしない。移設は論点採番の衝突、ユーザー発言の原文改変、利用先固有情報の残存を生む。
+- 正本repositoryへ入る成果物からの利用先固有情報の除去は`maintenance_policies/migration.md`が所有する。このsectionはそれを複製せず、commit前にそのセルフチェックを実行することだけを求める。
+- skill内容はsession開始時にcacheされる。同一session内でskillを変更しても、そのsessionには反映されない。変更後のskillで動かすには新しいsessionで起動する。
+- 配布versionは[Plugin version](#plugin-version)に従い、宣言値四箇所と`expectedRelease`を一度に更新する。
+
 ## Plugin version
```

##### 今回のscopeから外すもの

| 対象 | 扱い |
| --- | --- |
| `migration.md` の内容変更 | 行わない。固有情報除去と意味保存は`migration.md`が所有し続ける。変更2から参照するだけにする |
| サニタイズgateの新規定義 | 行わない。`migration.md`のセルフチェックが既にgateである。新しいgateを作らず、変更2のbulletで参照する |
| skill内容のsession cache挙動の解消 | 行わない。host側の仕様であり、変更2のbulletで前提として明示するにとどめる |
| 正本repositoryの`.agents/skills` symlinkによるtemplate汚染 | 今回scope外。`design.md`の非目標へ観測事実つきで記録し、失わないようにする |

#### 提案背景

##### 起点

`design.md`初稿に対するユーザーのfeedback。

> ん？ 「議論の記録先repositoryとfileが一意に決まる。」って抽象的に書いてるけど、 ai_agent_dev_skill_plugin のスキルの修正はai_agent_dev_skill_pluginでやるっていう具体じゃないの？ 修正時にはプラグイン修正を賄う修正スキルを使うってmaintenanceスキルに記載すれば終わりじゃないの？

##### 原因owner

**成果物固有**と分類する。今回の`design.md`が、確定している不変条件をTBDとして開いたままにしていた。

skillの不足ではない。`task-design/SKILL.md` Step 1は「未合意の部分は`TBD: （何が未合意か）`の形で残す」と既に規定しており、確定事項をTBDへ入れることは既存規定に反する。新しいruleを足す対象ではない。

##### feedback前半への評価

妥当である。確定側と未決側を一つのTBDへ束ねたため、自明な側まで開いて見えた。提案0では確定側を「先に確定として扱うもの」へ移し、MUSTの文面を、到達を担保するtriggerの有無という観測可能な形へ置き換える。

##### feedback後半への評価と、分割が必要な理由

「maintenanceスキルに記載すれば終わり」は、記載場所として`maintenance-plugin-context`を選ぶ点では妥当である。手順の本体はそこが持つべきである。ただしそれだけでは、失敗する経路がその記載へ到達しない。

原因owner分類は`facilitate-discussion`の`2.1.1`で行われる。分類が`skill`になった後、`2.1.1`が指示するのは「具体ケースを必要性の実例とし、別domainでも機能するか検証した対応skillの修正」を主decisionとして合意することだけで、repositoryを移れとは言わない。agentはそのまま現在のdiscussion fileで議論を続ける。

このとき`maintenance-plugin-context`は起動されない。このskillが起動されるのは、repository固有文脈が必要になった時か、version変更・検証を行う時である。利用先repositoryのsessionでskill修正提案を立てた時点では、そのどちらの必要も生じていない。

同じ欠陥形を、本steeringの前半で既に一度修正している。`.steering/2026/202608/20260801-extract-discussion-workflow-skill/implementation_review.md` の論点6〜9では、gateの背後に置かれたruleが、そのgateへ到達しない経路を拘束できないことを問題として扱った。そこでの解は、判定を行う場所そのものへ観測可能なtriggerを置くことだった。提案0の変更1は同じ解を適用している。

したがって分割する。変更1は一段落だけのtriggerであり、手順を複製しない。変更2が手順の本体を持つ。

##### 「修正スキル」の解釈

専用の新skillは作らず、既存の`steering`を指すものとして扱う。ユーザーの当初の原文が「steeringスキルを起動して、ai_agent_dev_skill_plugin 側でdiscussionをハンドリングする」であり、新skillの新設を求めていないためである。提案0の変更2にも「専用の修正skillは設けず、既存の`steering`を使う」と明記した。

##### 直近の実例が、この形でどう防がれるか

実例では次の三つが同時に起きた。いずれも記録先が二箇所に分かれ、移設が手作業になったことから派生している。

| 実例で起きたこと | 提案0の形での帰結 |
| --- | --- |
| 論点採番が移設先の既存論点と衝突し、採番し直しが必要になった | 最初から正本repositoryのsteering directoryへ記録するため、移設が発生せず衝突しない |
| 採番し直しの際にユーザー発言の引用内の番号まで置換し、原文を改変した | 採番し直し自体が発生しない |
| 利用先repository名と固有slugを残したままcommitした | 正本repositoryで書き始めるため、書く時点から総称で書く。加えて変更2が`migration.md`のセルフチェック実行を求める |

##### 提案0が満たす必要のある条件

1. 確定している不変条件をTBDとして残さない
2. 失敗する経路が指示へ到達する
3. `migration.md`が既に所有する契約を複製しない
4. 専用skillを新設せず、既存skillの範囲で完結する
5. 変更範囲が二file、追加が一段落と一sectionに収まる

「先に確定として扱うもの」が条件1、変更1が条件2、scope外表が条件3と条件4、変更1・2の分量が条件5を満たす。

#### 提案0へのフィードバック

**結果:** 却下。二つの変更それぞれに別の誤りがある。

> 変更1については、具象リポジトリのconsumer側にsupplierのこと書かせるのは悪手だろ。あと変更2については、新しくスキル作ってって、最初のお願いで言ってるでしょ

変更1は依存方向の逆流である。`facilitate-discussion`はrepositoryを問わず使う汎用skillであり、consumer側の道具である。そこへ正本repositoryという供給側の知識を書き込むことは、到達性を塞ぐ手段として不適切である。到達性の問題そのものの指摘は維持される。

変更2は依頼の読み違いである。原文「pluginのスキルに、…っていうものを立てたい」は新skillの新設を指しており、既存skillへの追記ではない。

### イテレーション1: 新skillを新設し、descriptionを到達性の担保にする

#### 提案1

##### 全体構造

新skill `escalate-plugin-skill-fix` を新設する。`facilitate-discussion` と `migration.md` は変更しない。

```text
plugins/tumeda-dev/skills/
├── escalate-plugin-skill-fix/     ← 新設
│   └── SKILL.md
├── facilitate-discussion/         ← 変更しない
├── maintenance-plugin-context/
│   └── SKILL.md                   ← 新skillへの1行pointerだけ追加
│   └── maintenance_policies/
│       └── migration.md           ← 変更しない
└── README.md                      ← 階層構造へ1行追加
```

##### skill名の根拠

`escalate-plugin-skill-fix` とする。「利用先（consumer）で生じた修正提案を、供給側（正本repository）へ上げる」という方向を`escalate`が表す。

- `plugin-skill-maintenance` は採らない。`maintenance-plugin-context` と名前空間が近く、version規約・repository contextを持つ既存skillとの区別がつかない。
- `reimport` 系は採らない。`migration.md` が「consumerリポジトリでの改善の逆輸入」という語で内容の取り込み規約を既に所有しており、routingを担う本skillと語が衝突する。

##### descriptionが到達性を担保する

新skillの`description`がdiscoveryの機構そのものになる。提案が生じた瞬間にdescriptionマッチで起動されるため、`facilitate-discussion`へtriggerを埋め込む必要がなくなる。descriptionの要件は次のとおりとし、本文作成時にこの要件を満たす文面にする。

- 起動条件を「このpluginのskill、docs、templateに対する修正提案が生じた時」と観測可能な行為で書く
- 「現在のrepositoryが正本かどうか」を起動条件にしない。判定はskill本体が行う。起動前に判定させると、判定を誤った経路が起動しなくなる
- 通常の設計議論、利用先repository自身のcode修正では起動しないことを明示する

##### `SKILL.md` の見出しoutline

`plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md` を、利用先で生じたplugin成果物の修正提案を正本repositoryのsteeringへ引き渡すrouting skillとして新規作成する。

```text
# Escalate plugin skill fix
├── ## 目的と成果
│   └── 修正提案の議論と変更を正本repositoryで完結させ、利用先での議論と事後移設を発生させないこと。成果は正本repositoryで起動されたsteeringと、利用先側に残す最小限の参照
├── ## 起動gate
│   └── plugin成果物（skill、docs、template、script）への修正提案が生じた時に起動する。利用先repository自身のcode修正、通常の設計議論では起動しない
├── ## 正本repositoryの判定
│   ├── ### 判定方法
│   │   └── 現在のGit rootがplugin正本かを確認する手順。判定に使う観測可能な事実
│   └── ### 正本だった場合
│       └── escalate不要。そのまま`steering`を起動して扱い、本skillは終了する
├── ## 正本でない場合の引き渡し
│   ├── ### 引き渡す内容
│   │   └── 提案の内容、必要性の実例、根拠。利用先固有情報を含めない形で取り出す。除去規約は`migration.md`が正本であり複製しない
│   ├── ### 起動するもの
│   │   └── 正本repositoryを作業対象として`steering`を起動する。専用の設計・実装processを本skillへ作らない
│   └── ### 利用先側に残すもの
│       └── 利用先のdiscussion fileには、正本側で扱う旨と参照だけを残す。論点本体を利用先へ作らない
├── ## 引き渡し後の前提
│   └── skill内容はsession開始時にcacheされる。同一session内の変更はそのsessionへ反映されない。変更後のskillで動かすには新しいsessionで起動する
├── ## 責務境界
│   └── 本skillが所有するものと、`facilitate-discussion`（議論の進行）、`migration.md`（固有情報除去と意味保存）、`maintenance-plugin-context`（repository context、配布version）、`steering`（設計と実装のorchestration）が所有するものの分界
└── ## このskillが絶対にやらないこと
    └── 利用先で論点を立てて合意まで進めること、合意後に移設すること、skill fileを直接編集すること、他skillが所有する規約を複製すること
```

`## 起動gate`に「現在のrepositoryが正本かどうか」を含めない。判定は`## 正本repositoryの判定`が行う。起動前に判定を求めると、判定を誤った経路がskillへ到達しなくなる。

##### `maintenance-plugin-context/SKILL.md` への1行pointer

`## Maintenance policies` のlistへ1行だけ追加する。手順本体は新skillが持つため、ここへ複製しない。

```diff
 - `maintenance_policies/migration.md` — skillを参考元（移植元 upstream）や参照先リポジトリと行き来させる（新規移植・追随・逆輸入）時の追加規約。**取り込む内容から参照元リポジトリ固有の情報を抜き、汎用知識だけをpluginへ記載する**。skill本体・`.steering/` 成果物・docs・slugすべてに適用する。共通規範とこのfileを移植・追随作業の前に必ず読む。
+- 利用先repositoryでこのpluginの成果物への修正提案が生じた場合の引き渡しは`escalate-plugin-skill-fix`が所有する。修正の議論と変更は正本repositoryで行う。
```

##### `skills/README.md` への1行追加

`## 階層構造` へ1行追加する。README自身の方針「skill が増減したらこのREADMEも更新する。詳細は書かず、見出し1行の追加・削除で済むように保つ」に従う。

```diff
 - **doc-enricher** — コードリーディング/タスク遂行後、永続性が高い知識をディレクトリ README に提案する（デフォルトは提案のみ）。
+- **escalate-plugin-skill-fix** — 利用先repositoryで生じたこのpluginの成果物への修正提案を、正本repositoryの`steering`へ引き渡すrouting skill。
 - **maintenance-plugin-context** — plugin の repository context と配布 version 規約を管理するメタ skill。
```

##### 変更しないもの

| 対象 | 変更しない理由 |
| --- | --- |
| `facilitate-discussion/SKILL.md` | repositoryを問わず使う汎用skillであり、供給側の知識を持たせない。到達性は新skillのdescriptionが担保するため、triggerの埋め込みが不要になった |
| `maintenance_policies/migration.md` | 固有情報除去と意味保存の正本であり続ける。新skillは参照するだけで複製しない |
| `docs/common_standard/function_migration_policy.md` | 非目標 |

#### 提案背景

##### feedbackから今回満たす必要が生じた条件

**依存方向を逆流させない。** `facilitate-discussion`はrepositoryを問わず使う汎用skillであり、consumer側の道具である。提案0の変更1は、そこへ「このpluginの正本repository」という供給側の知識を書き込んでいた。到達性を塞ぐ目的は正しかったが、手段が汎用skillの汚染になっていた。

**新skillを新設する。** 依頼原文「pluginのスキルに、…っていうものを立てたい」は新skillの新設を指す。提案0はこれを既存skillへの追記と読み違え、「専用の修正skillは設けず、既存の`steering`を使う」と明記していた。この読み違いを撤回する。

##### 提案0の到達性診断は維持し、解決手段だけを置換する

提案0が指摘した問題そのものは有効である。原因owner分類が`skill`になった後、agentは現在のdiscussion fileで議論を続け、`maintenance-plugin-context`は起動されない。手順をそこへ書くだけでは、失敗する経路が指示へ到達しない。

置換するのは解決手段である。skillの`description`はhostのdiscovery機構であり、提案が生じた瞬間に評価される。到達性はここで担保できる。`facilitate-discussion`へtrigger文を埋め込む必要がなくなり、依存方向の問題も同時に消える。

診断を維持し手段だけを置換したため、`## 起動gate`へ「現在のrepositoryが正本かどうか」を含めない設計をとった。起動前に判定を求めると、判定を誤った経路がskillへ到達せず、同じ到達性の問題が形を変えて再発する。判定はskill本体が行う。

##### 本文全文を先に書かない理由

新規documentであるため、`proposal-sections/document-heading-outline.md`に従い、見出し階層と各見出しが扱う内容へ先に合意する。outline合意後に実fileを作成し、作成されたfile自体を次のreview対象にする。作成前のdiscussionへ本文全文を複製しない。

##### 提案1が満たす必要のある条件

1. `facilitate-discussion`へ供給側の知識を書かない
2. 新skillとして新設する
3. 失敗する経路が指示へ到達する
4. `migration.md`、`maintenance-plugin-context`、`facilitate-discussion`、`steering`が既に所有する契約を複製しない
5. skillの増減に伴う`skills/README.md`の更新を漏らさない

「変更しないもの」の表が条件1と条件4、全体構造とoutlineが条件2、descriptionの要件と`## 起動gate`の設計が条件3、README追加が条件5を満たす。

#### 提案1へのフィードバック

**結果:** 受諾。構成はそのまま採用する。skill作成の実施手段について制約が一つ追加された。

> 基本構成はok。スキル作るときにはskill-creatorスキル使ってね

追加制約は提案1の構成を変更しない。`SKILL.md`を手書きせず`skill-creator` skillを適用して作成することを、実施時の手段として確定する。

### 決定

新skill `escalate-plugin-skill-fix` を新設し、`facilitate-discussion` と `maintenance_policies/migration.md` は変更しない。

**成立させる構造**

- `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md` を新規作成する。責務は、利用先repositoryで生じたplugin成果物への修正提案を、正本repositoryの`steering`へ引き渡すroutingである。見出し構成はイテレーション1の提案1のoutlineに従う。
- `description`が到達性を担保する正本になる。提案が生じた瞬間にhostのdiscovery機構で起動されるため、`facilitate-discussion`へtrigger文を埋め込まない。
- `## 起動gate`へ「現在のrepositoryが正本かどうか」を含めない。判定は`## 正本repositoryの判定`が行う。起動前に判定を求めると、判定を誤った経路がskillへ到達せず、同じ到達性の問題が形を変えて再発する。
- `maintenance-plugin-context/SKILL.md` の `## Maintenance policies` へ、新skillを所有者として示す1行のpointerだけを追加する。手順本体を複製しない。
- `skills/README.md` の `## 階層構造` へ1行追加する。

**確定した不変条件**

このpluginの成果物の修正は、正本repositoryで行う。議論の記録先も正本repositoryのsteering directoryとする。利用先で合意してから移設する運用にしない。移設は論点採番の衝突、ユーザー発言の原文改変、利用先固有情報の残存を生む。

**実施手段の制約**

`SKILL.md`は手書きせず、`skill-creator` skillを適用して作成する。

**採らなかった案と理由**

イテレーション0の提案0は却下した。`facilitate-discussion`へtrigger文を一段落追加する案は、repositoryを問わず使う汎用skillへ供給側の知識を持ち込む依存方向の逆流だった。到達性を塞ぐ目的自体は正しく、その診断は本decisionへ引き継いでいる。置換したのは手段だけで、skillの`description`をdiscovery機構として使うことで、汎用skillを汚さずに到達性を担保する。

また提案0は「専用の修正skillは設けず既存の`steering`を使う」としていたが、これは依頼原文「pluginのスキルに、…っていうものを立てたい」の読み違いだった。新skillを新設する。

**責務境界**

| owner | 所有するもの |
| --- | --- |
| `escalate-plugin-skill-fix` | 正本判定と引き渡しのrouting |
| `facilitate-discussion` | 議論の進行と記録 |
| `maintenance_policies/migration.md` | 利用先固有情報の除去と意味保存 |
| `maintenance-plugin-context` | repository context、配布version規約 |
| `steering` | 正本repositoryでの設計と実装のorchestration |

## 論点2: 引き渡しworkflowの未定義箇所五件を埋める

**ステータス:** 決定

**種別:** レビュー指摘

### イテレーション0: 一周分の実行を想定して、実行不能な箇所と判断が残る箇所を埋める

#### 提案0

`design.md`の`必須順序とhandoff`と、`SKILL.md`の見出し構成を修正する。論点1の決定（新skillの新設、descriptionによる到達性担保、責務境界）は変更しない。

##### 穴1: `steering`へ作業対象repositoryを渡す手段がない（実行不能）

現行の`必須順序とhandoff` step 5は「正本repositoryを作業対象として`steering`を起動する」と書いているが、この指示は現状のままでは実行できない。

確認した事実:

- `steering/SKILL.md` の `## 入力` は「ユーザー入力: 達成したいこと」「子roadmap phaseの四項目」「`adopt_task_design_working_dir`」だけで、作業対象repositoryを受け取る入力がない
- `steering` Step 1 は `.steering/YYYY/YYYYMM/` を相対pathで解決する
- `maintenance-plugin-context` は `git rev-parse --show-toplevel` でGit rootを取得する

したがって、利用先repositoryのsessionのまま`steering`を起動すると、利用先repositoryへsteering directoryが作られる。

**提案**: `escalate-plugin-skill-fix` が、`steering`起動前にworking directoryを正本repositoryへ移すことを明示する。`steering`側へ入力を追加しない。`steering`の入力契約を変えると全consumerへ波及するのに対し、working directoryの切替は本skillの内側で完結する。

##### 穴2: 正本repositoryでの作業branchが手順にない

正本repositoryへ移った後、既定branchで直接作業するか作業branchを切るかが決まっていない。

**提案**: 引き渡し手順へ「正本repositoryの既定branchから作業branchを切る」を含める。

##### 穴3: `必須順序`のstep 7とstep 8にownerが割り当たっていない

現行のstep 7（`migration.md`のセルフチェック）とstep 8（配布version五箇所の更新と`validate-plugin.mjs`）は、`escalate-plugin-skill-fix`の責務にも`steering`の責務にも明示的に割り当たっていない。owner表のどの行もこれらを持っていない。

**提案**: step 7とstep 8を`必須順序とhandoff`から外し、引き渡し後に`steering`が起動する通常flowが所有する範囲として明示する。`escalate-plugin-skill-fix`側には、plugin成果物の変更が配布version bumpと検証を伴うことを前提として一行示し、詳細は`maintenance-plugin-context`を参照させる。

`escalate-plugin-skill-fix`の`必須順序`は、引き渡しが完了するstep 6までとする。

##### 穴4: 利用先へ戻る経路が決まっていない

利用先の元taskは引き渡しの時点で中断する。plugin側の作業が終わった後にどうなるかが書かれていない。修正したskillは現sessionへ反映されないため、この判断は実際に発生する。

**提案**: `## 引き渡し後の前提`へ次の三点を書く。

- 利用先の元taskは中断したまま残り、plugin側の作業完了後に戻る
- 修正したskillは現在のsessionへ反映されない。skill内容はsession開始時にcacheされる
- 元taskを旧版のskillのまま続行するか、新しいsessionで再開するかはユーザーが選ぶ

##### 穴5: 利用先に残す「参照」の中身が決まっていない

現行は「正本側で扱う旨と参照を残す」とだけ書いており、参照の内容が実装者の判断に残る。

**提案**: 次の三つとする。

- 正本repositoryで扱う旨
- 正本側のsteering directoryのbasename
- 引き渡した提案の要旨一行

##### `SKILL.md` 見出し構成の修正

穴1・穴2を受けて、`## 正本でない場合の引き渡し` の配下へ見出しを一つ追加する。

```text
├── ## 正本でない場合の引き渡し
│   ├── ### 引き渡す内容
│   ├── ### 作業対象の切り替え     ← 追加（working directoryの移動と作業branch）
│   ├── ### 起動するもの
│   └── ### 利用先側に残すもの
├── ## 引き渡し後の前提            ← session cacheに加え、利用先への復帰と配布versionを扱う
```

#### 提案背景

##### 起点

`design.md`の確定版に対し、ユーザーから一周分の実行を想定した見直しを求められた。

> もう一回見直して。最初にお願いされた記述を満たせる作りになってる？ 1周回した想定で抜けが無いか見直して

##### 原因owner

**成果物固有**と分類する。今回の`design.md`が、workflowの完成後の姿を書きながら、実行時に判断が残る箇所を五つ残していた。

`task-design/SKILL.md` の自己チェック「この deliverable を実装するとき、設計外の判断をしなければならない箇所はないか」に対し、`YES`が五件残っていた状態である。既存skillの規定は足りており、規定へ従えていなかった。

##### 五件の性質の違い

穴1だけは性質が違う。他の四件が「判断が実装者へ残る」不足であるのに対し、穴1は書かれた手順がそのままでは**実行できない**。`steering`の入力契約を確認せずにstep 5を書いたために生じた。

残る四件は、一周分の実行を追ったときに順に現れる。正本repositoryへ着いた後の作業単位（穴2）、変更を配布へ載せる経路のowner（穴3）、利用先へ戻る経路（穴4）、利用先に残す痕跡の中身（穴5）である。

##### 穴1の解を、`steering`側の入力追加にしない理由

`steering`へ作業対象repositoryの入力を足す案も成立する。採らないのは波及範囲の差である。`steering`の入力契約は全consumerが依存する公開contractであり、変更すると本skill以外の起動経路もその入力を考慮する必要が生じる。working directoryの切替は`escalate-plugin-skill-fix`の内側で完結し、`steering`から見れば通常の起動と区別がつかない。

##### 提案0が満たす必要のある条件

1. 書かれた手順がそのまま実行できる
2. `必須順序`の各stepにownerが割り当たっている
3. 一周分を追ったとき、実装者へ残る判断がない
4. `steering`の公開contractを変更しない
5. 論点1の決定（新skillの新設、descriptionによる到達性担保、責務境界）を変更しない

穴1の提案が条件1と条件4、穴3の提案が条件2、穴2・穴4・穴5の提案が条件3、`SKILL.md`見出し構成の修正が条件5の範囲内であることを示す。

#### 提案0へのフィードバック

**結果:** 受諾。五件すべて提案どおり埋める。

> ok

### 決定

`design.md`の`必須順序とhandoff`、`失敗・取消・再開`、owner表、`SKILL.md`見出し構成を次のとおり修正する。論点1の決定は変更しない。

**穴1**: `escalate-plugin-skill-fix` が`steering`起動前にworking directoryを正本repositoryへ移す。`steering`の入力契約は変更しない。`steering`の入力は全consumerが依存する公開contractであり、変更すると本skill以外の起動経路も影響を受ける。working directoryの切替は本skillの内側で完結し、`steering`から見れば通常の起動と区別がつかない。

**穴2**: 引き渡し手順へ「正本repositoryの既定branchから作業branchを切る」を含める。

**穴3**: `migration.md`のセルフチェックと配布version五箇所の更新・検証を`escalate-plugin-skill-fix`の`必須順序`から外し、引き渡し後に`steering`が起動する通常flowの所有範囲とする。owner表の`steering`行へ、配布version bumpと検証を含むことを明記する。`escalate-plugin-skill-fix`の`必須順序`は引き渡しが完了するstepまでとする。

**穴4**: `## 引き渡し後の前提`へ、利用先の元taskが中断したまま残ること、修正したskillが現在のsessionへ反映されないこと、元taskを旧版skillのまま続行するか新sessionで再開するかをユーザーが選ぶことを書く。

**穴5**: 利用先に残す参照を、正本repositoryで扱う旨、正本側steering directoryのbasename、引き渡した提案の要旨一行の三つに固定する。

**`SKILL.md`見出し構成**: `## 正本でない場合の引き渡し` の配下へ `### 作業対象の切り替え` を追加し、working directoryの移動と作業branchを扱う。

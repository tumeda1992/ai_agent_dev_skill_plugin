## 論点1: 四つの改善領域を独立して設計する骨格で進めるか

**ステータス:** 分解済み

**種別:** TBDヒアリング

### イテレーション0（論点1）: 転送した四提案を設計の骨格にする

#### 提案0（論点1）

分割、導出変更、保留・暫定指示、skill構造reviewを、別々に詰める四領域として扱う。
plugin側の既存ownerと記録契約へ接続する完成形は、各領域でこれから合意する。
四領域を一つの共通skillへまとめる提案でも、実装を一括承認してもらう提案でもない。

sessionでは「**分割／導出変更／保留・暫定指示／skill構造review**を別々に詰める骨格で進めていい？」と確認した。

#### 検討記録（論点1・イテレーション0）

事後記録。四提案の内容、具体例、根拠は[引き渡し入力](../handoff-input.md)へ保存し、
[design初稿](../design.md)では各領域の接続方法をTBDとして示した。
転送前に利用先で合意した運用を、現行pluginへの具体的な変更の合意として扱わないため、
完成形の詳細ではなく、独立して詰める四領域の骨格だけを確認した。

当時の確認はsessionにあり、discussionへ先に保存していなかった。
ここでは確認できる提示と応答を再構成し、事前保存済みだったとは扱わない。

[内部検討記録: 論点1・イテレーション0](../internal-records/task-design-discussion.md.topic-1.md#iteration-0)

#### 提案0へのフィードバック（論点1）

**結果:** 四領域を別々に詰める骨格に合意

> ok

了承の対象は、直前に提示した四領域の骨格である。
分割対象、各recordのschema、skill構造reviewの呼出位置、plugin本体の変更、実装開始への合意は含まない。

### 決定（論点1）

分割、導出変更、保留・暫定指示、skill構造reviewを独立した四領域として設計を進める。
各領域の完成形と既存pluginへの接続は、別の論点で合意する。

子の通常decisionはすべて決定し、詳細を具体化した論点48〜52も報告後の応答を受けてdesignへの反映・検証を終えた。
未完childがないため分解済みとする。これは子論点の完了状態であり、設計全体のreview・plan合意・plugin実装の完了を示すものではない。

## 論点2: 長大な議論の分割を、どの議論記録へ適用するか

**ステータス:** 決定

**親論点:** 論点1

**種別:** TBDヒアリング

### イテレーション0（論点2）: task-design固有か、pluginの議論記録共通かを決める

#### 提案0（論点2）

今回選ぶのは、「10論点を超えたら5論点ずつに分ける」運用を適用する議論記録の範囲である。
分割はfacilitate-discussionの保存・読取機能として設計し、caller側へ同じ処理を複製しない。
どちらの案も、10論点以下の記録、design.md、tasklist.md、roadmap.md、論点別内部logは分割しない。
通常のsession履歴を新たに論点形式で記録させる提案でもない。

- **a. facilitate-discussionが保存する論点形式の議論記録へ共通適用する。**
  - task-designの設計議論、steeringの通常議論、実装後review、同skillを明示利用したその他の議論を対象にする。
  - 内容のownerと各callerの判断手順は変えず、同じ記録形式の保存・読取運用を揃える。
  - 例: 設計議論と実装後reviewがそれぞれ12論点になったら、どちらも1〜5、6〜10、11〜15の本文へ分ける対象になる。
  - 弱み: 今回長大化を実測したtask-design以外にも、新しい保存・読取運用を導入する。
- **b. 今回はtask-designの設計議論だけへ適用する。**
  - 実例のある範囲だけを変え、steeringの通常議論と実装後reviewは従来の一file運用を保つ。
  - 分割処理のownerは同じfacilitate-discussionのままとし、task-designへ処理を複製しない。
  - 例: 設計議論が12論点なら5論点単位へ分けるが、実装後reviewが12論点でも一fileのままである。
  - 弱み: 同じ記録skillに二種類の保存・読取運用が残り、review側の長大化には別途適用拡大が要る。

aを推す。問題は設計という内容でなく、同じ論点形式の履歴が長大になることである。
保存形式を所有するskill内で読み方を揃える方が、callerごとの差を増やさずに済む。
一方、変更範囲を実測済みの用途へ限定することを優先するならbが合う。

ここでは分割directoryの正確なpath、索引項目、既存の過去記録をいつ移行するかまでは決めない。
採用範囲によって変わる後続設計は、その後で具体化する。

#### 検討記録（論点2・イテレーション0）

引き渡された要求は、10論点を超えた議論を5論点単位へ分け、索引と履歴を保って必要な範囲を読むことである。
現行facilitate-discussionは、task-design-discussion.md、discussion.md、implementation_review.mdを
同じ入力と同じ論点・iteration・内部logの仕組みで扱う。
したがって、分割の問題は三種類のどこでも起こりうる。ただし、実際に分割を試した入力はtask-design由来であり、
共通形式を使っていることだけで、ほかの用途へ適用拡大する合意が成立したとは扱わない。

保存と履歴のownerがfacilitate-discussionであることから、どちらの案でも分割処理をcallerへ複製する必要はない。
未決なのは、同じ記録形式の運用を揃えるか、今回の変更を実例のある用途へ限定するかである。

分割しても全文読取の要求を全本文へそのまま広げれば読取量は減らない。
逆に対象本文だけを読むと、別fileの親子関係、論点重複、後続訂正を見逃すriskがある。
適用範囲の合意後には、この読取と全体検査の関係、引き継ぎ時の全decision coverageとdigestを設計する。
extract-handoff-input.mjsはdesign.mdだけを対象としており、discussion分割を理由に入力境界を広げる案は採らない。

この提案は過去記録の一括移行への承認を含まず、物理pathと移行時点は後続の未決事項として残す。

[内部検討記録: 論点2・イテレーション0](../internal-records/task-design-discussion.md.topic-2.md#iteration-0)

#### 提案0へのフィードバック（論点2）

**結果:** aを採用

> a

facilitate-discussionが保存する論点形式の議論記録へ共通適用する。
今回の応答は適用対象の選択であり、未提示の物理構造、読取範囲、過去記録の移行時点への合意ではない。

### 決定（論点2）

長大な議論の分割は、facilitate-discussionが保存する論点形式の議論記録へ共通適用する。
task-designの設計議論、steeringの通常議論、実装後review、同skillを明示利用したその他の議論を対象にする。
各議論が10論点を超えたら5論点単位へ分ける。10論点以下の議論、design.md、tasklist.md、roadmap.md、
論点別内部log、議論を記録していない通常のsessionは分割しない。

内容のownerとcaller固有の判断手順は変えず、同じ論点形式の保存・読取運用を揃える。
分割処理はfacilitate-discussionが所有し、各callerへ複製しない。
物理構造、分割後の読取と全体検査、既存記録を移行する時点は別論点で合意する。

## 論点3: 複数の議論記録の索引と分割本文をどう配置するか

**ステータス:** 決定

**親論点:** 論点1

**種別:** TBDヒアリング

### イテレーション0（論点3）: 一つのdiscussion directoryへ並べるか、記録ごとに分けるか

#### 提案0（論点3）

完成後の配置を二案から選ぶ。どちらも索引と本文を同じdirectoryへ置き、可変の追記先pointerを作らない。
例は、一つの作業に設計議論が12論点、通常議論と実装後reviewが10論点以下ある場合である。

##### a. 一つのdiscussion directoryへ、記録名で区別して並べる

```text
<working_dir>/discussion/
├── task-design-discussion.md          # 設計議論の索引
├── task-design-discussion-1-5.md      # 設計議論の本文
├── task-design-discussion-6-10.md
├── task-design-discussion-11-15.md
├── discussion.md                      # 短い通常議論の本文
└── implementation_review.md           # 短いreviewの本文
```

入口は元のbasenameを使い、分割本文はそのstemに論点範囲を付ける。
短い議論は入口file自体へ本文を持ち、10論点を超えたら同じ入口を索引へ切り替える。
三種類の記録を浅い位置で見渡せる。一方、長大な記録が増えるとfile一覧は伸び、
利用者が付けた別の議論名と分割本文名がぶつかる場合の検出が要る。

##### b. 記録ごとにdirectoryを持ち、その中へ索引と本文をまとめる

```text
<working_dir>/discussion/
├── task-design-discussion/
│   ├── index.md                       # 設計議論の索引
│   ├── topics-1-5.md                  # 設計議論の本文
│   ├── topics-6-10.md
│   └── topics-11-15.md
├── discussion/
│   └── index.md                       # 短い通常議論の本文
└── implementation_review/
    └── index.md                       # 短いreviewの本文
```

元basenameの拡張子を除いた名前をdirectory名とし、入口はindex.md、本文はtopics-{先頭}-{末尾}.mdとする。
短い議論も同じ専用directoryのindex.mdへ本文を持つ。
一記録のまとまりが明確で、本文が増えても他の議論の一覧へ混ざらない。
一方、一段深くなり、短い記録にもdirectoryが増え、元の記録名とindex.mdの対応を保持する必要がある。

aを推す。同じ作業で設計議論・通常議論・reviewを見渡す使い方では、
file名で所属が分かる浅い配置の方が軽い。
多数の議論を一記録ずつ独立したdirectoryとして扱いたいならbが合う。

内部logは論点別記録という現行の役割を維持し、この配置選択では保存先を変更しない。
旧root入口の移行時点、既存linkの互換性、索引の具体的な項目、読取と全体検査は後続で決める。
この提案への合意だけでは、既存の作業記録を移動しない。

#### 検討記録（論点3・イテレーション0）

論点2で、facilitate-discussionが保存する議論記録へ共通適用すると決まった。
同じworking directoryには設計議論、通常議論、実装後reviewが共存しうる。
索引と本文は同じdiscussion directoryへ置き、可変の追記先pointerを作らないという入力要求を保ったまま、
記録種別を一つのdirectory内のfile名で分けるか、directory自体で分けるかを具体化する。

現在のcallerは同じ作業に複数の議論記録を置けるが、保存・読取機能は共通である。
記録ごとの専用directoryは必須ではなく、file名のprefixだけでも所属を表せる。
反対に、論点範囲の本文名は専用directoryの中なら短くでき、一記録の範囲を物理的に区切れる。
したがってどちらも要求を満たし、浅く見渡すことと、一記録をdirectoryでまとめることの優先順位が残る。

本文は範囲ごとにしか分割せず、一つの論点のiterationを別fileへ切らない。
範囲が11〜15で実在するのが11・12だけでも、予定上の末尾15を名前へ使う。
分割後の索引はその記録の本文だけへ接続し、複数種別の議論内容を一つの索引本文へ合流させない。
これらは入力の分割要求を両案で保つための条件であり、移行を実施したという意味ではない。

[内部検討記録: 論点3・イテレーション0](../internal-records/task-design-discussion.md.topic-3.md#iteration-0)

#### 提案0へのフィードバック（論点3）

**結果:** 両案とも未分割記録の配置を変えていたため、条件違反として修正する

> え、10を超えたらという条件なのに、なんで10を超えていない disscussionと implementation_reviewがディレクトリ分かれているの？

提案0のbは、10論点以下の記録にも専用directoryとindex.mdを先行作成していた。
aも、短い記録を既存の場所から共有discussion directoryへ移していた。
どちらも、本文の分割だけを条件付きにし、directory整理は最初から行うという未合意の前提を足していた。

assistantはsessionでこの誤りを認めたが、応答原文の保存と次案の提示を行わず、説明だけで終了した。
それに対し、利用者は次のように指摘した。

> は？お前solだよね。その答えの先にお前がやることわかってんだろ

前turnの指摘とassistantの説明は事後記録である。確認できる経過だけを保存し、
当時discussionへ保存済みだったことや、提案0への合意があったことにはしない。
利用者の指摘で確定した「10論点以下は既存の場所の一fileのまま」という条件を両案へ戻し、
同じ論点の次のiterationで、分割条件が成立した記録だけの配置を提案し直す。

### イテレーション1（論点3）: 10論点を超えた記録だけを配置変更の対象にする

#### 提案1（論点3）

10論点以下の記録は既存の場所・名前・一fileのまま残す。
その記録用のdirectoryや索引も先行作成しない。これは提案0の誤りの訂正であり、選択し直す条件ではない。
今回選ぶのは、10論点を超えた記録の索引と分割本文を、共有directoryへ並べるか、記録別directoryへまとめるかである。

例として、作業directory直下に次の三記録があり、設計議論だけが分割条件を満たす場合を示す。

```text
<working_dir>/
├── task-design-discussion.md
├── discussion.md
└── implementation_review.md
```

設計議論は12論点、通常議論は4論点、reviewは3論点とする。

##### a. 分割対象だけを共有discussion directoryへ並べる（推奨）

```text
<working_dir>/
├── discussion.md
├── implementation_review.md
└── discussion/
    ├── task-design-discussion.md
    ├── task-design-discussion-1-5.md
    ├── task-design-discussion-6-10.md
    └── task-design-discussion-11-15.md
```

通常議論とreviewは元の場所に残り、設計議論だけを移す。
discussion/task-design-discussion.mdは索引、範囲付きの三fileは本文である。
後でreviewも10論点を超えたら、その時点で同じdiscussion/へreviewの索引と範囲本文を追加する。

分割済み記録を浅い場所で見渡せ、索引名も元basenameを保てる。
反面、複数の記録が長大になるとfile一覧が伸び、任意の記録名と範囲本文名の衝突確認が必要になる。

##### b. 分割対象だけを記録別directoryへまとめる

```text
<working_dir>/
├── discussion.md
├── implementation_review.md
└── discussion/
    └── task-design-discussion/
        ├── index.md
        ├── topics-1-5.md
        ├── topics-6-10.md
        └── topics-11-15.md
```

通常議論とreviewは元の場所に残り、設計議論だけを移す。
専用directoryのindex.mdは索引、topics-{先頭}-{末尾}.mdは本文である。
後でreviewも10論点を超えたら、その時点でdiscussion/implementation_review/を作り、索引と本文を入れる。

一つの記録のfile群をdirectory単位で見渡せ、他の記録の本文と混ざらない。
反面、一段深くなり、元の記録名と入口index.mdの対応を保持する必要がある。

両案とも、三記録がそれぞれ10論点以下なら、合計論点数が10を超えていても何も移動せず、
分割用のdiscussion directoryも作らない。各記録が個別に10論点を超えた時だけ分割対象になる。
索引と本文は同居させ、可変の追記先pointerは作らない。内部logの配置も変えない。

aを推す。分割対象だけをまとめれば、短い記録を巻き込まず、分割済み記録も浅い位置で見渡せる。
記録ごとのまとまりをdirectory単位で扱うことを優先するならbが合う。
旧pathと既存linkの扱い、索引の項目、導入時に既存記録へ適用する時点は後続で決める。
ここで提示したtreeは配置の設計案であり、既存fileを移動したという意味ではない。

#### 検討記録（論点3・イテレーション1）

提案0では本文分割の条件とdirectory整理の条件を別々に扱い、後者へ未合意の常設運用を加えた。
訂正後は各議論記録の論点数を個別に判定し、条件を満たさない記録を移動・改名せず、
その記録のためのdirectoryや索引も先行作成しない。
分割対象になった一記録の索引と本文を共有directoryへ置くか、専用directoryへ置くかが、残る配置の判断である。

[内部検討記録: 論点3・イテレーション1](../internal-records/task-design-discussion.md.topic-3.md#iteration-1)

#### 提案1へのフィードバック（論点3）

**結果:** aのfile名を維持し、directory名を元file名の拡張子を除いた名前へ変更して採用

> aでディレクトリ名をファイル名を同じにする。例だったら、discussion/ ではなく task-design-discussion/

索引と範囲本文の命名はaのまま、共有discussion/を記録別のdirectoryへ置き換えるという具体的な指定である。
bのdiscussion/{元stem}/という二段構造、index.md、topics-{先頭}-{末尾}.mdは採らない。
指定内容に残る配置上の曖昧さはなく、同じ案の再承認を求めず決定へ反映する。

### 決定（論点3）

分割対象の元fileが{stem}.mdなら、元fileと同階層に{stem}/を作り、
索引を{stem}/{stem}.md、本文を{stem}/{stem}-{先頭}-{末尾}.mdとして置く。
共通のdiscussion/を外側へ追加せず、index.mdやtopics-*.mdへ改名しない。

設計議論12論点、通常議論4論点、review3論点の場合は次の配置になる。

```text
<working_dir>/
├── discussion.md
├── implementation_review.md
└── task-design-discussion/
    ├── task-design-discussion.md
    ├── task-design-discussion-1-5.md
    ├── task-design-discussion-6-10.md
    └── task-design-discussion-11-15.md
```

索引は元のbasenameを保ち、本文の所属もfile名から分かる。
一記録の本文群を一段のdirectoryへまとめるため、別記録の分割本文とも混ざらない。
reviewが後で10論点を超えた場合は、同様にimplementation_review/へ索引と範囲本文を置く。
通常議論とreviewが10論点以下の間は、既存の場所・名前の一fileのまま残し、専用directoryも作らない。
索引と本文を同居させ、可変の追記先pointerは作らず、内部logの配置は変えない。
旧pathと既存link、索引の具体的な項目、既存記録へ適用する時点は別途設計する。

## 論点4: 分割前の入口fileを分割後も残すか

**ステータス:** 決定

**親論点:** 論点1

**種別:** TBDヒアリング

### イテレーション0（論点4）: 旧入口の互換性と正本の見つけ方を決める

#### 提案0（論点4）

分割後の正本は、論点3で決めた{stem}/内の索引と本文だけにする。
今回選ぶのは、分割前の{stem}.mdをなくすか、新しい索引への案内だけ残すかである。
10論点以下の記録は、どちらを選んでも変更しない。

- **a. 旧入口fileを残さず、参照を新しい正本へ付け替える（推奨）。**
  - 設計議論の分割後は、rootのtask-design-discussion.mdを残さず、
    task-design-discussion/task-design-discussion.mdを索引として使う。
  - 移行時に確認できるlinkは、索引または担当範囲本文の該当見出しへ更新する。
  - rootに互換fileが増えず、議論の入口と本文が一つのdirectoryに収まる。
  - 外部に保存された旧file URLは、そのままでは辿れなくなる。更新できない参照の互換性は保てない。
- **b. 旧入口fileには、新しい索引への固定linkだけ残す。**
  - 正本はaと同じ。rootのtask-design-discussion.mdには移転案内だけ置き、本文や論点一覧は置かない。
  - 外部の旧file URLを開いた人も、案内から正本へ移れる。通常の追記時に案内を更新する必要はない。
  - 分割した記録ごとに互換fileが一つ残り、agentにも案内と議論本文を区別させる必要がある。
  - 旧URLの見出しfragmentを元の論点へ自動転送するものではない。
    確認できる見出し付きlinkは、aと同様に新しい範囲本文へ更新する。

bで旧task-design-discussion.mdへ残す案内の例は、次の内容だけである。

```markdown
# 議論記録の移転先

この議論は分割済みです。[索引](./task-design-discussion/task-design-discussion.md)を参照してください。
```

この固定linkは分割先の索引を指し、追記のたびに変わる「現在の追記先」とは異なる。
どちらの案でも、callerは元の作業directoryとdiscussion basenameを渡し、
facilitate-discussionが分割済みの記録を解決する。元pathがないという理由だけで新規作成しない。
その解決手順と引き継ぎ判定への接続は、残置方針の後に全caseを詰める。

aを推す。directory内に正本をまとめる決定を活かし、確認できる参照とcallerを移行時に接続する。
外部に置いた旧file URLからの到達性を残す方を優先するならbが合う。
この提案は、既存作業の移行開始やfile削除を承認してもらうものではない。

#### 検討記録（論点4・イテレーション0）

元file名に対応するdirectoryへ索引と本文を置くと決まったため、元の入口pathの扱いが次の判断になる。
現行facilitate-discussionは、指定directoryのbasenameが存在しなければ新規fileを作る。
task-designの引き継ぎ判定も、元のdesignまたはdiscussionの存在を前提にする。
従って、旧入口を残すかとは別に、分割先の存在を確認してから新規作成を判断する接続が必要である。
分割を理由に、引き継ぎ前の本文読取禁止を緩めることはしない。

参照を保持するには、移行時に確認できるlinkを新しい正本へ更新する必要がある。
旧pathへ固定の案内を置くと、外部の旧file URLから索引へ辿る導線も残せるが、
見出しfragmentまで自動で移る保証はない。案内の残置には互換fileを保つ代償がある。
このため、通常の書込先解決だけを理由にbを必須とはせず、外部の旧URLへの到達性と配置の簡潔さを比較する。

[内部検討記録: 論点4・イテレーション0](../internal-records/task-design-discussion.md.topic-4.md#iteration-0)

#### 提案0へのフィードバック（論点4）

**結果:** aを採用

> a

分割後は旧入口fileを残さず、確認できる参照を新しい正本へ付け替える。
この応答は残置方針への合意であり、未設計の移行を今実施する承認ではない。

### 決定（論点4）

分割後は、元の作業directory直下の{stem}.mdを残さない。
移転案内、互換file、本文または索引の複製は作らず、{stem}/{stem}.mdを索引として使う。
移行時に確認できる参照は、新しい索引または担当範囲本文の該当見出しへ更新する。
更新できない外部の旧file URLや見出しfragmentの互換性は保証しない。
これにより、正本を一directoryへまとめ、恒久的な互換fileを増やさない。

10論点以下の記録は既存の場所・名前の一fileのまま残す。
callerは作業directoryと元のdiscussion basenameを渡し、共通ownerが分割済みの記録を解決する。
元pathがないという理由だけで新規作成せず、分割先の存在を確認する。
入口解決の全case、参照更新と移行を実施する時点は別途設計する。

## 論点5: 未分割・分割済みの議論の入口をどう解決するか

**ステータス:** 決定

**親論点:** 論点1

**種別:** TBDヒアリング

### イテレーション0（論点5）: 同じ二入力から保存形式を解決し、不整合時の誤作成を防ぐ

#### 提案0（論点5）

callerは従来どおり、作業directoryとdiscussion basenameを渡す。
例ではdiscussion_directory=<working_dir>、discussion_file_name=task-design-discussion.mdである。
分割後も、callerにtask-design-discussion/という保存先を指定し直させない。

facilitate-discussionが所有する共通の入口解決で、次の二箇所を確認する。

```text
未分割: <working_dir>/task-design-discussion.md
分割後: <working_dir>/task-design-discussion/task-design-discussion.md
```

##### 保存形を確定する前の分岐

元fileと、分割先directoryの存在・種類を先に調べる。

```text
元fileと分割先を確認
├─ 元fileだけある → 従来の一file形式を継続
├─ 分割先だけある → 同名の索引があれば分割形式の入口へ
│                    └─ 索引がない → 停止
├─ 両方ある       → 正本を選ばず停止
└─ どちらもない   → 既存記録の証拠と矛盾しない場合だけ新規作成
```

存在確認の失敗や想定外のpathの種類も停止する。
新しい方を優先する、自動で統合する、欠落した索引や本文を推測で埋める処理は行わない。
どちらもなくても、同じdiscussion名の論点別内部logや、既存議論を示す会話・参照がある場合は、
新規扱いせず記録欠落として停止する。他のdiscussion名の内部logは混同しない。

例えば、設計議論だけが分割済みなら、同じ二入力からdirectory内の索引を発見して再開する。
元の場所へ新しいtask-design-discussion.mdを作らない。
reviewがまだ3論点なら、implementation_review.mdという別の入力はrootの一fileへ接続する。

##### 引き継ぎ前は存在確認で止める

保存形式を調べる処理は、それだけではfileを作成・移動せず、本文も読まない。
task-designのhandoff gateも同じ保存形式の判定を使い、分割済みdiscussionを既存設計の証拠として扱う。
独立再構成前に、索引、範囲本文、内部logの本文を読む経路は追加しない。
designが欠落している場合も、新規設計で置き換えず、既存のhandoffの停止条件を維持する。

本文を読める段階へ進んだ後、未分割ならその本文、分割済みなら索引と必要な本文へ接続する。
入口が見つかったことと、書込み可能な記録構造が確認できたことは区別する。
索引と範囲本文の検査、どこまで読むか、分割の実行・中断復帰は、続く別論点で設計する。

既存の長い一fileを発見した場合も、入口解決だけを理由に即時分割しない。
既存記録への適用時点は移行方針で決める。ここでは別の入口を新規作成しないことを保証する。

この入口解決案で進める。条件に反する優先順位や再指定を対抗案にはせず、手順全体への採否を問う。

#### 検討記録（論点5・イテレーション0）

分割済みの場合は旧入口を残さないため、元pathの不存在だけで新規議論とは判定できない。
論点4で確認した現行契約は元pathだけを見て新規作成するため、保存形式の確認をその前へ置く必要がある。
callerが渡す二入力はそのままにし、保存形式のownerが未分割fileと分割先を確認する。
競合や欠落の際に優先順位を付けると、履歴が複数の正本へ分かれた状態を隠してしまうため停止する。

四つの存在組合せと、索引欠落・確認失敗・長い一file・design欠落を机上照合した。
その過程で、入口が両方なくても同じ記録の内部logが残る反例を確認し、既存記録の証拠と矛盾する新規作成も止める案へ具体化した。
入口発見だけで本文構造の正しさや移行完了を保証しないこと、handoff前の読取禁止を保つことが、この案の境界である。

[内部検討記録: 論点5・イテレーション0](../internal-records/task-design-discussion.md.topic-5.md#iteration-0)

#### 提案0へのフィードバック（論点5）

**結果:** 提案0の入口解決手順に合意

> ok

同じ二入力を維持し、保存形式を先に判定する手順を採用する。
索引の内容、本文の読取範囲、構造検査、移行手順はこの応答では確定しない。

### 決定（論点5）

callerは作業directoryと元のdiscussion basenameを渡し、facilitate-discussionが入口解決を所有する。
元fileだけがあれば一file形式として継続し、分割先だけがあれば同名の索引の存在を確認して分割形式へ接続する。
元fileと分割先が両方ある場合は正本を自動選択せず停止する。
どちらもない場合に限り、同じ記録の内部log、会話、参照などの既存証拠と矛盾しないことを確認して新規作成する。
索引欠落、想定外のpathの種類、存在確認失敗も停止し、欠落を推測で補完しない。

保存形式の判定だけではfileを作成・移動せず、本文も読まない。
task-designのhandoff gateも同じ判定を使い、分割discussionを既存設計の証拠として扱う。
独立再構成前に索引や本文、内部log本文を読むことはなく、design欠落時の既存停止条件も維持する。
本文を読める段階で正本へ接続し、入口発見と書込み可能な記録構造の確認を区別する。
従来の長い一fileを認識しても、この判定だけで即時分割しない。
索引の内容、読取・構造検査、移行の実施時点は別途設計する。


# 内部検討記録: 論点3 — 複数議論の索引と分割本文の配置

**discussion:** [task-design-discussion.md](../task-design-discussion/task-design-discussion-1-5.md)

**論点:** 論点3

## 開始context

分割はfacilitate-discussionが保存する論点形式の議論へ共通適用し、callerへ処理を複製しない。
同じworking directoryにtask-design-discussion.md、discussion.md、implementation_review.mdが共存できる。
索引と本文は同じdiscussion directoryへ置き、通常の追記先は最大論点範囲から分かる構造が必要である。
今回決めるのは完成後の物理配置であり、索引内部のfield、読取の保証、既存pathの移行時点は別に残す。

<a id="iteration-0"></a>

## イテレーション0: 共有directory内の識別か、記録別directoryによる分離か

<a id="iteration-0-record-1"></a>

### 判断: 記録の種類をfile名で区別するかdirectoryで区別するか

#### 判断対象・必須条件・根拠

同じworking directoryで複数の議論記録を運用する時の配置を判断する。
必須条件は、各記録の索引と本文が同じdirectoryにあり、どの本文がどの記録に属するか一意に分かること、
未分割の短い議論にも入口があることである。
比較軸は全体を見渡す浅さと、一つの記録を閉じた単位として扱うことの容易さである。

判断材料は、論点2で保存したcallerと入力の調査、handoff-input.mdの分割要求、
現行facilitate-discussionがdiscussion basenameで内部logを識別する契約である。
外部serviceの挙動や新しいrepository事実は必要なく、形式だけの追加調査は行わない。
比較用のcaseは、設計議論12論点、通常議論と実装後reviewは10論点以下の一つのworking directoryとする。
分割後のfile名には未決の箇所があるため、表示案の命名も配置の一部として検算する。

#### 比較結果と具体case

aは一つのdiscussion directoryへ各記録の元basenameを持つ入口と、同じstemに論点範囲を付けた本文を並べる。
設計議論12論点はtask-design-discussion.mdを索引、task-design-discussion-1-5.md、
task-design-discussion-6-10.md、task-design-discussion-11-15.mdを本文とする。
短い通常議論とreviewはdiscussion.md、implementation_review.mdの一fileのままであり、
10論点超になった時も入口の場所と名前を変えず索引へ切り替えられる。
浅い位置で三種類の記録を見渡せる反面、本文が増えるとfile一覧は長くなり、別basenameとの衝突検出が必要である。

bはdiscussion/{元basenameの拡張子を除いた名前}/へ一記録をまとめ、index.mdを入口、
topics-1-5.mdのような範囲名を本文とする。
設計議論の本文はdiscussion/task-design-discussion/配下だけに収まり、他の議論のfile一覧と分離できる。
短い記録も同じ専用directoryのindex.mdへ本文を持つ。
記録単位の包含関係が明確で、任意basenameの他記録と本文名がぶつかりにくい。
反面、一段深くなり、入口だけの短い記録にもdirectoryが増える。
元basenameと物理的な入口名index.mdの区別を保持する必要もある。

#### 推奨と限界

aを推す。通常は同じ作業の設計議論、通常議論、reviewという少数の記録を見渡すため、
本文stemで所属を識別できれば専用directoryを増やす利点より浅さが勝る。
多数の独立した議論が共存し、一記録をdirectory単位で扱うことを優先するならbが有利である。
両案とも索引と本文の同居、追記先pointer不要、論点範囲による追記先識別を満たす。
任意basenameとの衝突の停止条件、既存pathを移す時期、旧linkの互換性、内部logの接続先は未決として残す。
この比較でファイル移動・新入口の運用を実行した事実はなく、表示するtreeは完成形の提案である。

<a id="iteration-1"></a>

## イテレーション1: 条件未成立の記録を動かさずに配置案を作り直す

利用者は、10論点以下の通常議論とreviewまでdirectoryを分けた提案0を指摘した。
assistantはaも含めた誤りを認めたが、記録更新と次案提示へ進まず、利用者から作業継続を要求された。
前turnの指摘と説明はdiscussionへ未保存だったため、この経過は事後記録として回復する。

<a id="iteration-1-record-1"></a>

### 診断: 分割条件にないdirectory整理を先行させた理由

#### 期待との差と確かめる原因候補

期待は、10論点を超えた議論記録だけの分割と、それに必要な配置変更である。
実際の提案は、短い通常議論とreviewも共通directoryへ移動するか、専用directoryを作ってindex.mdへ改名していた。
原因が既存の分割条件の不足か、条件を具体treeへ適用しなかった成果物固有の逸脱かを、
論点2の決定、提案0の説明とtree、利用者の指摘で照合する。
併せて、応答処理が説明だけで終了した理由を、facilitate-discussionの応答から次提示へ進む契約で照合する。

#### 照合結果と訂正範囲

論点2は各議論が10論点を超えた場合の分割だけを決定している。
提案0のaは短い記録の移動、bは短い記録のdirectory作成と改名を追加しており、
両案に共通する前提が決定範囲を超えていた。
原因は分割条件の不足ではなく、その条件を配置の具体例全体へ適用しなかった今回の提案の逸脱である。

facilitate-discussion/iteration.mdの「応答から次の行き先へ進む」は、
修正応答を保存し、材料が揃えば同じturnで次の提案を作ることを既に要求している。
説明だけで終了した応答も、既存手順を適用しなかった逸脱である。
不足している一般規則の新設や、別のplugin改善論点への転送では解消しない。
今回は履歴を回復し、短い記録をそのまま残した配置案を同じ論点の次の回として提示する。

<a id="iteration-1-record-2"></a>

### 判断: 分割対象だけを共有directoryへ並べるか、記録別directoryへまとめるか

#### 判断条件と検算するcase

両案とも、条件未成立の記録のpath・本文・名前を変えず、その記録用のdirectoryや索引を先行作成しない。
分割対象の索引と本文の同居、5論点単位、予定末尾を使うfile名、可変の追記先pointerなしという条件を維持する。
比較するのは分割対象どうしを浅く見渡す配置と、一記録のfile群を専用directoryへ閉じる配置である。

提案0と論点2が判断材料であり、新しい外部事実の調査は要らない。
具体例は設計議論12論点、通常議論4論点、review3論点とする。
境界として、全記録が個別には10論点以下の場合、設計議論が10から11へ増える場合、
後でreviewも11論点になる場合を検算する。

#### 比較結果と境界の検算

aは分割対象だけをdiscussion/へ移し、元basenameの索引と、同じstemに範囲を付けた本文を並べる。
bは分割対象だけをdiscussion/{元stem}/へ移し、index.mdとtopics-{先頭}-{末尾}.mdを置く。
設計議論12論点の例では、aはdiscussion/直下、bはdiscussion/task-design-discussion/内に設計議論だけが入る。
通常議論4論点とreview3論点は、どちらの案でも元のworking directory直下の一fileから変わらない。

- 全記録が個別には10論点以下なら、合計が10を超えても配置変更はなく、分割用directoryを作らない。
- 設計議論が10論点なら変更せず、11論点になったら設計議論だけが分割対象になる。
  本文範囲は1〜5、6〜10、11〜15となり、他の二記録は動かない。
- 後でreviewも11論点になったら、その時点でreviewだけが追加の分割対象になる。
  aならdiscussion/へimplementation_review.mdと同stemの範囲本文を追加する。
  bならdiscussion/implementation_review/へ索引と範囲本文を追加する。
  既に分割した設計議論と、まだ4論点の通常議論は動かない。

両案とも境界条件を満たす。aは分割済み記録を一段で見渡せ、元basenameも索引名として残る。
一方、分割済み記録が増えれば一覧が長くなり、任意の記録名と範囲本文名の衝突確認が必要になる。
bは記録ごとに本文群を閉じられるが一段深く、元記録名とindex.mdの対応を保持する必要がある。
短い記録へのdirectory増設はbの必要条件ではなく、提案0から取り除くべき誤りだった。

#### 推奨と未決範囲

分割済み記録を浅い位置で見渡せるaを推す。
多数の独立した記録をdirectory単位でまとめて扱うことを優先するならbが合う。
索引の中身、旧pathと既存linkの扱い、導入時にどの既存記録へ適用するかは別途合意する。
内部logの配置はこの判断で変えず、今回の設計記録自体を物理移動する作業も行わない。

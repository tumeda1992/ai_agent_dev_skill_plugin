# Design: 判断可能な提案と認識合わせを支える議論構造へ進化させる

## 元の依頼内容

他のリポジトリで escalateされた steering .steering/2026/202609/20260921-apply-escalated-skill-fixes の中で、faciliate-disscussionに抜本的な修正が必要になったのと他を終わらせてから本腰入れてやりたいということで移設された .steering/2026/202609/20260921-restructure-facilitate-discussion を再開したい

---

## TL;DR

提案を作る前に判断材料が枯れているかを確かめ、提案を出せない段階では認識合わせとして議論を進められるようにする。
この進化を現行構造へ載せようとした際、最も頻繁に回すイテレーションの共通動作が新規・継続・再開の箇条書きへ分散しており、標準参照の置き場を複数案試しても収束しなかった。
移行前の約400行の `SKILL.md` も、問題の発見と構造の変更を難しくしていた。
今回と以後の進化を載せられる構造へrefactoringし、明示した意味変更以外の既存能力は全量保存する。

- 実行手順を三つの責務に分ける。
  - `SKILL.md`: 論点選択・状態制御・確定・通常同期。
  - `iteration.md`: 次の提示準備と既存提示への応答。判断材料確認と内部loopはここへ集約する。
  - `record-recovery.md`: 未収録のchat合意・事後発見した記録漏れを、証拠の範囲内で回復する。
- 判断材料が足りなければ、埋められる不足を自分で調べる。
  - 問い・方法を保存して実施し、結果・解釈・次actionを保存してから再判定する。
  - ユーザー所有の前提・見方だけが残れば認識合わせ、別decisionや外部条件ならhandlerへ戻す。認識の了承だけで決定しない。
- 記録を、独立して読める二層に分ける。
  - discussion: 各提示だけで判断・応答できる本文と判断背景、応答、現在decision。詳細logへのlinkを説明の代わりにしない。
  - `internal-records/{discussion basename}.topic-{論点番号}.md`: 一論点一fileで逐次過程と中断復帰を支える。六用途formatを使い、毎回記法標準を読んでから書く。
- 保存形と制御を分ける。
  - `discussion_entry.md` の十部品と `internal_record.md` の三部品は純粋な雛形。適用制御は実行fileが持つ。
  - 表示patternと六用途の説明付きguideはそれぞれの目的を保ち、第四のhandlerを作らない。

新規fileの所属見出し、提案・認識合わせに対応する応答欄、共通の `応答待ち` を使う。既存履歴は一括変換しない。
validator・callerの接続と思考標準三件も、下記の完成形に含める。
具体本文はprototypeと補助設計へ保存済みであり、[移行検証](behavior-preservation/migration-verification.md) はprototypeのwhite-boxと限定実行の範囲を示す。
productionへの適用は別の許可gateであり、この設計の保存だけでは開始しない。

---

## 目的: 今回成立させる進化

### 提案を作る実手順で、判断材料が枯れているかを確かめる

形式が整っていてassistant自身に確信があっても、案の前提が未確認なら判断できる提案ではない。
提案を書く前に `plugins/tumeda-dev/docs/think_standards/making_and_choosing_options.md` の判定を通り、材料が枯れていなければ案へ畳まず、何が分かれば選べるようになるかを先に扱う。
新規・継続・再開のいずれでも、その時点の材料を対象に判定が発火するようにする。

この判定の正本と `task-design` Step 3からの参照は、`../20260921-guard-premature-decisions/` で実装済みである。
今回の残件は `facilitate-discussion` の実行手順への接続であり、判定基準そのものの再設計ではない。

### 提案を出せない回を、認識合わせとして扱えるようにする

基本は提案でイテレーションを回す。ただし、認識を合わせなければ提案を出せない場合だけ、`提案N` の代わりに `認識合わせ` を置けるようにする。
引き渡された形は `イテレーション0 - 提案0 → イテレーション1 - 認識合わせ → イテレーション2 - 提案2` である。

発端では、検証アクションの列挙と実績の報告が提案の体裁で提示されたが、必要だったのはアクションを軸に考えるという見方を合わせることだった。
案の採否を問える段階ではない回を、採否を問う提案として取り繕わず扱えるようにする。
調査結果を提案背景へ置く改善とは別の変更であり、提案背景の定義改善は既に完了している。

認識合わせは、自分で取得できる事実を調べた後も、ユーザーと問題・前提・見方を共有しなければ提案できない場合だけ使う。
調査できる不足は自分で解消し、判断可能な上位decisionや今は解消できない外部条件はhandlerへ返す。
応答処理と終了・復帰の実行本文は [iteration.md](faciliate-discussion/iteration.md)、検査への接続は [validator-caller-design.md](discussion-recording/validator-caller-design.md) に示す。

## 解消する構造上の問題

この二つの進化、とくに判断材料確認の参照を載せる過程で、現行の構造では変更を受け止められないことが分かった。

- 最頻出のイテレーションが独立した構造として見えず、提案・背景・feedback・提示という共通動作が新規・継続・再開の箇条書きへ分散している。
- 判定を不変条件へ置く、三経路へ追記する、新設節へ置く、templateへ寄せる等の六案を試しても、実行時の発火と共通動作のまとまりを両立できなかった。
- 378行の `SKILL.md` に入口差分、共通動作、条件付き処理が入り組み、分散の発見と見出し関係の組替えを難しくしている。

移管元 `../20260921-guard-premature-decisions/task-design-discussion.md` の論点10・11では、置き場所の選択を繰り返すのではなく、イテレーションをworkflowの主構造として持つ問題だと認識が揃っている。
refactoringは、今回の進化と以後の進化を載せられる構造を確保するために行う。移行やfileの短縮そのものを目的にはしない。

## 完成後の姿: 必要なcapability

### イテレーションを一つの単位として理解・変更できる

イテレーションの中で行う判断と動作、その関係を、手順中の一項目ではなく見出しと内部構造から理解できる。
新規・継続・再開で共通の能力を進化させる際に、三経路へ別々の本体を作る必要がない。
入口に固有の差分と共通の中身を区別でき、判定の追加や認識合わせの導入が、その共通構造への変更として成立する。

議論全体のhandlingは、起動、論点選択、現在stateの制御、合意されたdecisionの確定、consumerへの返却、記録同期を担う。
共通イテレーションは、選択した一つの論点を前提として、新規・継続・再開の入口差分、判断材料確認、提案または必要な認識合わせ、背景を含む保存・提示、feedbackと次の行き先への接続を担う。

```text
議論全体のhandling
  起動・論点選択・現在stateの判定
     └─ 選択した一つの論点で、共通のイテレーションを実行する
          ├─ 新規・継続・再開の入口差分を処理する
          ├─ 判断材料を確かめ、調査・検討と内部記録の保存を反復する
          ├─ 提案を作る／必要な認識を合わせる
          ├─ 内部記録から判断背景を再構成し、内容とともに提示する
          └─ feedbackを扱い、次の回・別論点・決定へ接続する
  合意されたdecisionの確定・consumerへの返却・記録同期
```

全体の状態制御と、選んだ論点で一回の議論を進める中身を分けることで、各入口へ共通の本体を複製せず、今回の判断材料確認と認識合わせを一つの変更単位へ載せられる。
この図は責務の関係を示し、Markdownの見出し階層は指定しない。
範囲限定の保存手順は三実行file、検査への接続は [validator-caller-design.md](discussion-recording/validator-caller-design.md) に示す。

### 提示を作る直前に不足の解消先を見分ける

新規・継続・再開の提示準備を終え、内容を作り始める直前に、`making_and_choosing_options.md` を読んで今回の判断材料へ適用する。
skill起動時の読取や案への確信を省略の根拠にしない。案・調査・否定の回数も、材料が足りたことの代替条件にしない。
判定基準の中身は同標準に保ち、本体は実行位置と行き先を持つ。新規・継続・再開、不変条件、templateへ判定を複製しない。
合意だけの処理、取下げ、記録回復には、新提示のための判定を無用に回さない。

| 判定結果 | 次の行き先 |
| --- | --- |
| 判断可能な案を作れる | 提案を作る。一案への採否を問える場合も含む |
| 自分で取得できる事実が不足する | 権限とconsumer境界を守って調査・検証し、同じ判断材料確認へ戻る |
| 事実を確認しても、共有すべき問題・前提・見方が残り提案できない | 認識合わせを作る |
| 選択可能な別の上位decisionが必要 | handlerの論点選択へ戻る。判断できる方針選択を認識合わせへ変えない |
| 今は解消できない外部の結果・action・権限が必要 | handlerの停止・再開条件へ戻る。形式を埋めるための提示は作らない |

認識合わせの本文は、確認したい理解と具体的な回答・訂正対象を中心にする。
今は提案できない理由、何が共有できれば進めるかを示し、確認済みの事実・自分の読解・未確定を区別する。
調査結果とその読解に至った理由は背景へ置く。単なる調査報告や、調べられる事実への問い返しには使わない。
確認対象を特定できなければ、何が分かれば案を作れるかの整理へ戻る。

認識合わせへの応答は、その回に明示した確認対象への応答として扱い、未提示の具体案への合意へ広げない。
次の内容を作る際には、応答で得た材料を含めて判断材料確認へ戻る。認識が揃ったことだけで残る事実確認も終わったとは扱わない。
応答処理は次節のcontractに従う。

### 認識合わせの回答を、決定ではなく次の判断材料へ接続する

認識合わせの本文は、回答・訂正してほしい対象と、その回答で進められる判断を示す。事実・自分の読解・未共有前提を区別し、未提示案や独立decisionの採否を一緒に問わない。
初回から認識合わせを使える。提案と同じ外向きiteration列を使い、形式だけの提案0や別counterは作らない。

所属gateと原因owner routingの後、何への回答かを特定し、対応する空の `認識合わせNへの回答` へ必要な原文と結果を一度保存する。
得た入力・訂正された理解・残る空白を、内容に合う段落や表で示す。固定三欄や結果enumにはしない。
具体的な理解への了承はその理解だけを確定し、部分回答は答えられた範囲だけを扱う。経験を問う質問への `ok` は、その経験を取得したことにはならない。外部事実への主張は必要な照合を行う。
別decisionや作業再開の指示だけなら、認識への回答として回答欄を埋めない。

回答の原文と結果はその回答欄が所有し、次iterationの背景は結果を参照して条件・案への影響を記録する。旧本文・背景・応答欄は書き換えず、認識の確認結果を `決定` や `仮決定` へ自動転記しない。
同じdecisionの材料を得たら、提示準備の判断材料確認へ戻る。材料が揃えば追加の「提案してよいか」を聞かず、同じturnで具体案を準備する。
残る不足は、取得可能な事実なら調査、必要なユーザー所有の空白なら対象を絞った認識合わせ、別decisionや外部条件ならhandlerへの返却に分ける。
再質問では前の回答で埋まったもの、残る必要な空白、自力では埋められない理由を背景に残す。答えられない問いは具体化する等の方法を見直し、取得不能なら不足と再開条件をhandlerへ返す。回数だけで継続・終了を決めない。

認識合わせの一回は、回答保存と行き先への接続で処理を終える。論点の決定は、具体案とその明示合意を一意に追える時に限る。
回答に別decisionや明示的な保留等を含む場合は、新提示準備の前にhandlerへ戻す。判断可能な定義・見方の採用は従来どおりproposalとして扱い、chat上の明示合意も既存の記録経路で保存する。
通常の回答待ちには再開条件を置かず、外部event・必要なactionを待って進めない場合だけ不足・成立条件・未決判断を残す。決定済みの同一decisionを変える場合は、既存の再開手順で旧履歴を保つ。
中断復帰・事後回復では、提示種別、質問、回答、結果、未完処理を照合する。回答の二重保存や同じ入力の再質問を避け、認識の了承から具体案への合意を補完しない。

共通本体が回答の解釈・保存・接続を、handlerがdecision確定と全体stateを、templateが対応する応答欄の記録内容を所有する。
具体本文は [iteration.md](faciliate-discussion/iteration.md) の「既存提示への応答を扱う」、検査は [validator-caller-design.md](discussion-recording/validator-caller-design.md) に対応する。

### 判断するための背景と、復帰・監査する経過を分ける

discussionは、その回の問いをユーザーが判断するための文書である。別fileの内部検討記録は、調査・比較・訂正・再判定・検証を逐次残し、中断復帰と詳細確認に使う文書である。同じ記録ownerが両方を扱うが、所有する事実を二重化しない。

| 保存先 | 正本として所有する内容 |
| --- | --- |
| discussion | 提示時の判断背景、提案または認識合わせ、原文と必要な評価・回答、現在decision・state、根拠となる内部記録へのlink |
| 内部検討記録 | 実施前入力、取得・比較・検証の結果と限界、解釈、不足、次action、訂正と再判定、中断復帰に必要な経過 |

背景は経過を短く写すのでなく、問いに必要な事実・制約から条件・決め手・代償・不確実性へ再構成する。認識合わせでは共有事実と未共有の前提、回答で変わる判断を示す。重要な反証、不在の意味、未確認・未検証の影響をlogへのlinkだけへ追い出さない。
discussionの各提示は、それだけで問題・条件・案と理由・代償・不確実性を理解し、判断・応答できる情報量を持つ。内部logへのlinkは補足証跡の確認用であり、説明を省く理由にしない。完全な本文や差分が判断対象なら提案側に残し、行数削減のためだけに隠さない。
内部logも、そのfileだけで何を検討し、何を確かめ、得た事実からどこまで判断し、何が残ったかを理解できる文書にする。調査・比較を行ったという宣言、論点番号の列挙、sourceへのlinkだけで説明を置き換えない。二層それぞれの作成・確認・差戻しは後述する。

提示種類が決まる前から内部記録を同じ場所で育て、実施前後に随時保存する。材料が揃った提示前に判断背景を再構成し、根拠との対応・限界・単独判断可能性を検査する。logの推奨や判断をユーザーの合意として扱わない。
原文・評価・質問への回答はdiscussion、作成過程や合意反映の検査はlogに置く。応答欄へ内部経過を積み戻さない。片側だけ保存できた場合は未同期範囲を明示し、整合した提示やhandoffを装わない。

提示済みの背景・応答と過去の逐次記録は保持し、後からより正しい説明へ上書きしない。新証拠は訂正・継続・再開のcontractへ接続する。過去fileを一括移動・改名せず、適用開始点を明示した新規fileまたは新しいiterationから分離する。legacyのfindingは元の場所を参照する。
内部logは、discussionを置くdirectoryの `internal-records/` 配下へ論点ごとに一fileを置く。
同じdecisionの準備・修正・応答後処理・再開を一箇所へ保持し、論点数に応じたfile増加と長い一論点の肥大化を受け入れる。
背景名は `検討記録`、内部logのtitleは `内部検討記録` とする。具体的な保存先・anchor・読取範囲・保存形は [record-storage-design.md](discussion-recording/record-storage-design.md) にまとめた。
既存の二入力から保存先を解決し、追加の保存先選択は求めない。既存の `検討記録` や `提案背景` は改名しない。

### 保存された実体から未完処理を特定し、二層を同期してから提示する

二層に分けた結果、内部logの結果保存とユーザー向け説明の完成は別の処理になる。
次の境界を使い、途中状態を完了と扱わず、保存済みの仕事も繰り返さない。

1. handlerが論点・回の番号と所属を確定し、discussionへ作成中の回を保存する。
   - 同じ論点・回のlog開始contextとdiscussionとの接続を揃えてから調査する。
   - 初期化途中で中断した場合は同じ回の未完部分を補い、新番号を作らない。
2. 内部logへ入力を保存し、実施後に結果・限界・解釈・次actionを保存してから次の処理へ進む。
   - 調査ごとにdiscussionの判断背景まで書き直すことは要求しない。
3. 保存したlogから提示本文と判断背景を再構成する。
   - 本文・背景・log接続・対応する空応答欄を保存し、根拠との対応と二層の独立可読性を確認する。
   - 同期後に、保存した提示と同じ判断対象をchatへ出す。
4. 応答をdiscussionへ原文と結果として一度保存し、その後に確定・反映・同伴質問の調査へ進む。
   - 同伴質問の調査完了まで合意の保存を遅らせない。後続検討・反映検証はlogへ記録する。

| 確認できた保存状態 | 再開する処理 |
| --- | --- |
| 作成中の回だけ保存 | 同じ回のlog初期化・接続 |
| logの入力だけ保存 | 会話・tool結果による実施確認。結果が残るなら結果保存 |
| logの結果保存済み、discussionの説明未完 | 同じ回の判断材料確認・背景作成 |
| 提示一式保存済み、実際のchat提示は未実施 | 根拠照合後、同じ提示の送出 |
| 応答保存済み、確定・反映・調査が未完 | 保存済み応答の指定する未完処理 |

結果が無いだけで未実施とせず、statusを実行・提示の証拠にしない。
過去結果が確認不能なら限界を残し、安全に再取得できる場合だけ新しい入力から新しい取得を行う。
新結果を過去実施の証拠へ置き換えない。実際の提示を確認できない場合や、再実施の副作用・安全性が不明な場合は停止する。

同じ処理の途中で止まった場合は通常復帰とする。
後続処理や提示へ進んだ後で必要な記録を飛ばしたと判明した場合、またはchatと保存本文が違う場合はhandlerから事後回復へ渡す。
確認できた経過だけを事後記録し、当時から保存されていた形へ偽装しない。
提示済み背景は保持し、反証・訂正は新しいlog記録から元を指して継続・再開routingへ戻す。

`iteration.md` が保存境界と通常復帰、`SKILL.md` が返却前の二層・実際の提示応答の同期と回復検出、`record-recovery.md` が事後回復と確認不能範囲を所有する。
書込み不能・対象不明・番号重複では保存済みと未同期を報告し、通常の提示や完了handoffへ進まない。
進捗台帳・完了flag・state enumは追加せず、実体照合の負担と証拠不足時の停止を受け入れる。

### 二層それぞれの本文から、読者が必要な答えを取り出せるようにする

内部logとdiscussionは短い版と詳しい版ではなく、それぞれの用途で完結する文書として作る。
作成・確認contractを次の時点へ置く。

1. 論点の内部logを始める時。
   - 問題、対象語の意味、決める範囲、既決条件、残る不足を説明する。
   - 後の回では同じfile内の説明を使い、変わった前提と今回の問いを加える。過去説明は後の結論へ合わせて上書きしない。
2. 六用途の一まとまりを作成し、終える時。
   - 実施前の入力、実施後の結果・解釈・限界・次actionを保存する。source名だけでなく、結論に使う事実や規則の中身と今回の判断への意味を記す。
   - 本文から、なぜ調べたか、具体的に何が分かったか、どこまで言え、次に何が必要かを答える。
   - 既知の事実なら説明を補い、未取得なら調査へ戻り、確認不能なら限界を残す。途中保存は止めず、未完成を完了と扱わない。
3. discussionの各提示を作る時。
   - 問題、今回の判断範囲、採用後の具体的な変化、成立理由、代償・反証・未確認へ再構成する。必要な代表caseも、その回だけで意味を理解できるよう説明する。
   - 認識合わせでは、確認済み事実と未共有の理解、回答対象、回答によって変わる判断を示す。自力調査で埋まる不足は質問へ回さない。
4. 提示直前。
   - その回の本文と背景だけから、何を決めるか、具体的に何が変わりなぜ効くか、代償と未確定範囲は何かを実際に答える。
   - logの未記載説明を持ち込まなければ答えられないならdiscussionへ戻す。logにも根拠がなければ内部検討へ戻し、背景の作文で補わない。
   - 重要な事実・推奨理由をlogの根拠へ対応付け、反証と限界が提示側から落ちていないかを確認する。

必要なcontextや事実は二層の双方で説明できる。禁止するのは説明の再掲ではなく、出所やユーザー合意を独立して更新する二重正本である。
検査で見つけた不足と重要な修正はlogへ残すが、定型質問への全回答をdiscussionへ毎回追加しない。
提示後の背景は当時の説明として保持し、新しい証拠や訂正を後続記録から接続する。

`iteration.md` は以上の作成・確認・差戻しを所有し、応答後の調査にも同じ品質を使う。
`record-recovery.md` は確認できた出発点・実施内容・結果と確認不能範囲を区別し、当時から十分な説明があったように創作しない。
entry templateに品質判定のhandlerを戻さない。一般的な濃さ・指示対象の基準は既存標準を参照する。
執筆と照合の負担を受け入れ、固定三見出し、字数下限、source全文の転載、別agentの必須化は追加しない。

### 本文の種類と応答先を、正式名で対応付ける

提案は `提案N`／`提案Nへのフィードバック`、認識合わせは `認識合わせN`／`認識合わせNへの回答` の組で保存する。Nは共通の外向きiteration番号とし、本文と応答先で一致させる。初回の認識合わせは0とし、別counterや形式だけの提案を作らない。間には `検討記録` として再構成した判断背景と内部記録へのlinkを置く。
回答欄には質問・確認対象への原文と得た入力・訂正・残る不足を保存し、訂正・一部回答・回答不能も含める。完全回答だけを記録する欄ではなく、受領しても案への合意にはならない。

内部の「既存提示へのfeedbackを扱う」入口は両方の応答を扱い、表示名ではなく提示種類と応答内容で戻り先を判定する。
これから新形式で準備する回のtemplate、保存・参照手順、chatで正式名を一致させる。過去の見出しは改名せず、旧表記や番号の有無も実際の提示と履歴から読む。`提案Nへのfeedback` は正式名にしない。
status、一意識別方式、物理構成は以下で定義し、対応名だけから状態遷移を推測しない。

### 作成中・通常の応答待ち・外部停止をstatusで読み分ける

新形式のstatusは `応答待ち / 調査中 / 子論点待ち / 決定 / 保留 / 分解済み` とする。
提案と認識合わせの通常のユーザー応答待ちは共通の `応答待ち` とし、提示種類は本文と応答欄から読む。stateの値だけで回答を案への合意にしない。

| 進行段階 | stateへの対応 |
| --- | --- |
| 新規・継続・再開の提示に向けて調査・比較・検証を行う | `調査中`。同じ作成中iterationに属する内部記録を育てる |
| 本文・判断背景・logへのlink・空の対応応答欄を保存し、chatへ提示して通常の返答を待つ | `応答待ち`。通常待ちのための再開条件は置かない |
| 回答・修正feedbackから同じdecisionの次提示を準備する | `調査中` へ戻して材料を確かめ、足りれば同じturnで次提示まで進む |
| 具体案と明示合意を一意に追える | 新iterationを作らずhandlerで `決定` と現在decisionを確定する |
| 外部event・action・権限、または明示的な保留で止める | `保留`。必要な場合に不足・成立条件・再開判断を再開条件へ残す |

親子statusは既存導出を優先し、未決childがあれば `子論点待ち`、全child決定済みなら `分解済み` とする。認識合わせの回答だけではchildを決定したことにしない。
statusは現在stateの要約であり、実際の提示・応答・保存範囲を置き換えない。保存後提示前なら未提示内容を提示し、回答保存後なら保存済み結果から次準備またはhandlerへ戻す。古い値だけを根拠に二重保存・再質問せず、状態不明・番号重複・書込み不能は既存の停止・回復contractで扱う。
旧 `提案中` も実際の本文・応答・会話から読み取る。既存fileや過去iterationの一括変換はせず、現在statusの実際の更新時に採用語彙を使う。表記だけを揃える巡回更新は行わない。
この対応をhandler・本体・templateと検証へ同時に接続する。
validatorの具体的な置換本文と旧guardの移管先は [validator-caller-design.md](discussion-recording/validator-caller-design.md) に保存した。productionへの反映と通常検証は、この合意内容を適用する後続工程である。

### 構造見出しの所属と、実際の書込範囲を一致させる

今後新規作成するdiscussion fileでは、次の構造見出しを使う。Tは論点番号、Iは共通iteration番号の説明用変数であり、保存時は実際の番号へ置き換える。

| 単位・役割 | 新規fileの表記 |
| --- | --- |
| 論点 | `## 論点T: {判断内容を表すタイトル}` |
| iteration | `### イテレーションI（論点T）: {この回で進める内容}` |
| 本文 | `#### 提案I（論点T）` または `#### 認識合わせI（論点T）` |
| 判断背景・内部記録への接続 | `検討記録（論点T・イテレーションI）` から、論点logの `iteration-I` anchorへ相対linkする |
| 応答欄 | `#### 提案Iへのフィードバック（論点T）` または `#### 認識合わせIへの回答（論点T）` |
| 現在state | `### 仮決定（論点T）`、`### 再開条件（論点T）`、`### 決定（論点T）` |

現在stateに回番号は付けず、必要な時だけ置く。reparentしてもTはchild自身の番号を維持する。内部記録は提示種類の確定時に移し替えず、discussion basenameと論点番号、同じ外向き回番号で帰属を特定する。個別根拠のanchorは回内のrecord番号を併用し、第二の論点採番正本を作らない。
内容固有の小見出しには所属suffixや新しい連番を一律に付けず、semantic titleを維持する。

新旧どちらのfileも、書込直前の全体再読込とsingle writerを保ち、論点→必要なら回→欄の順に範囲を限定する。実際のMarkdown構造を読み、コードfence・引用・HTML comment内の例をentryや書込先に数えない。役割と完全な番号、所属suffix、更新欄と終端・周辺文脈が一致することを確認し、file全体の先頭一致や部分一致で置換範囲を作らない。
論点番号重複は全書込み停止とする。既存欄の不在・複数・所属不整合ではその更新を止め、実履歴と保存状態を確認する。推測選択・自動renumber・過去見出しの修復で続行しない。
新規追加は一意な挿入位置と同じ欄の未作成を確認する。新論点は最大番号+1とfile末尾、次iterationは対象論点の追記位置、作成中の回への欄追加は同じ回のtemplate上の位置を使う。現在state欄は論点内の位置と役割で確認し、回番号は使わない。正常な未作成を停止理由にせず、既に存在するなら中断復帰か不整合かを確認して二重追加を防ぐ。
更新後は意図した欄・現在state・必要な親statusだけが変わったことを差分で確認し、別論点と確定済み履歴を保つ。失敗・未同期は既存の停止・回復contractへ返す。

所属suffixは新規fileだけへ適用する。既存fileは新しい論点・回を足す場合も現在の識別表記・兄弟深度を維持し、過去も追加部分もsuffixへ変換しない。新方式で作成したfileは継続時もその方式を使う。役割名・statusは前述の適用範囲を守る。
形式の正本はtemplate、対象解決と差分確認はhandler・本体の保存手順へ接続する。特定parser・command・自動anchorには依存せず、専用script新設や既存file修復は含めない。

### 調査・検討の進行と検討記録の保存を一体にする

検討記録を書く前に毎回 `plugins/tumeda-dev/docs/documentation_standards/expression_notation.md` を全文読む。
初期入力、結果追加、訂正、discussionの判断背景への再構成を含み、起動時の一回読取や記憶で代替しない。読取不能なら記憶で書き進めず、既存の停止contractへ返す。
単純な並列は箇条書き、短い補足付きなら階層箇条書き、説明が独立した話題へ育ったら見出しへ分ける。因果の関係を長い散文へ埋めず、根拠から判断へのつながりを構造から追えるようにする。
記法の基準は同標準を正本とし、この指定だけのための追加事後reviewは新設しない。二層の読解確認とtask-design・document-reviewの既存gateは維持する。

共通本体の提示準備では、問いと確認方法を内部検討記録へ保存してから調べ、得た事実・解釈・残る不足・次action・案への影響を保存してから次actionを実行する。
案を具体caseへ当てた結果も記録し、前提や条件に穴が残れば同じ内部loopへ戻る。
過程を最終提示時に後付けで創作せず、蓄積した記録から必要条件と案の対応を辿れるようにする。判断背景はその根拠から提示前に再構成する。

案がない間は、今回のiterationを調査中として保存し、内部記録へ接続する。
内部の確認ごとに外向きiteration番号を増やさず、未成立の案や空feedbackで合意待ちを装わない。
提示可能になったら同じiterationを、提案または認識合わせ、再構成した判断背景とlogへのlink、対応する空feedbackの読順へ仕上げる。

記録単位は、同じ問いと確認方法で判断材料を一段更新するまとまりとする。
同じ問いに複数sourceを使う場合はまとめられるが、結果から問いや次の方法を変える時は、それまでの結果と理由を保存してから進む。
各単位から問い・目的、確認先と方法、得た事実、解釈、残る不足、次action、案への影響を読み取れるようにする。
結果と解釈を一回で書くことはできるが、次actionの実行後まで記録を遅らせない。

事実と推論を分け、未取得・失敗・確認不能を否定的findingと混同しない。否定的findingには確認範囲も残す。
条件を変えた反例や解釈の訂正は、具体的な根拠を保つ。生logや資料全文は転記せず、調査回数を充足の証拠にしない。
既存findingだけを使う検討でも根拠と比較結果を記録し、形式のための新規調査を要求しない。

最終案から必要条件、条件を支える確認記録へ逆引きでき、認識合わせなら残るユーザー所有の空白と回答後の判断へつながる。
次の確認へ進んだ後は過去の結果や解釈を書き換えず、訂正元と新evidenceを新しい単位から指す。
過去iterationの原文feedback・却下案を重ねて写さない。

中断時はdiscussionの現在state、保存済みの内部記録とtool結果を照合し、同じ作成中iterationへ重複なく復帰する。対象論点のlog全文を読み、他論点の根拠を使う場合はそのdiscussionの現在decisionと当該log全文へ広げ、後続訂正も確認する。無関係な全logの毎回通読は要求しない。
未保存を未実行とみなさず、確認不能な結果や順序を創作しない。記録漏れの回復は事後記録と明示する。
外部停止と別decisionへの返却にも、それまでの過程と行き先の理由を残す。書込み不能なら未同期範囲を報告して止まる。
全体再読込、single writer、番号重複時の全書込み停止、提示済み・決定済み論点の再開規則は維持する。

実行手順の正本は共通本体、discussionの保存形はentry用template、内部記録の目的別記入形はformat群、全体stateと復帰先はhandlerとする。内部logの骨子は純粋な保存形 `templates/internal_record.md` が持ち、旧来の回の骨子へ経過を戻さない。
随時書込みと作成中状態は移行ledgerの追加・変更へ分類する。
問いから実際の取得、結果から次action、蓄積から案を辿り、利用可能なtool・書込み履歴と保存順序も照合する。
本文や見出しが揃っていること、validatorが通ることだけで、実行順序まで検証したとは扱わない。

### 内部検討記録を、目的に合う読み方と記入形で支える

内部検討記録のformatは、調査・判断・認識合わせ・検証・診断・一般化を目的別に持つ。discussionの判断背景に全blockを転記する形式ではない。
共通にするのは、目的と対象、根拠、結論の限界、次への接続を辿れることであり、欄名や段数、読順ではない。
見出しには `調査: 旧変更は随時保存を定義済みか` のように目的と具体対象を示し、`確認N` や `検討内容` だけで済ませない。

| 目的 | 読み手が辿る関係 |
| --- | --- |
| 調査 | 判断につながる問いと探索範囲・方法からテーマ別findingへ進み、言える範囲・残る調査・打切り理由を示す。肯定的finding、範囲内の不在、取得不能・未実施を区別する |
| 判断 | 推奨と決め手から、必須条件・評価軸と各案の差、引き受ける代償・不確実性へ進む。比較する理由のない対抗案を作らず、一案なら必要条件への対応で評価する |
| 認識合わせ | 共有できる事実と自分の読解を分け、相手が持つ未共有前提と回答によって変わる判断を対置する。背景を外向きの質問本文やfeedback欄の代わりにしない |
| 検証 | 主張を支持できる範囲から、合格条件・方法・対象と実測の対応へ降り、反例と未検証範囲を残す。机上照合・実行・目視を区別する |
| 診断 | 期待と実態の差から、原因候補を支持・反証する証拠、確定原因と仮説、修正先と再検証へ進む |
| 一般化 | 成立した原則から、起点case、異なるcaseや反例による修正、既確認caseへの再適用と適用境界を辿る |

各記入形の具体例は用途別fileに示す。完成時に推奨や検証結果を先に読ませる形でも、それらは評価・取得後に加える。
実施前には目的に応じた問い・評価軸・主張・原因候補等を保存し、結果後にはfinding・評価・修正等とその限界、次への接続を保存する。
未確認と該当しない項目を分け、未成立の結論をformatのために埋めない。

一つのblockは一つの目的で判断材料を更新するまとまりとし、tool一回やfile一枚を単位にしない。
目的が変わる時は意味のある見出しを分け、後続は先行blockの該当findingを参照して評価や結論への意味を加える。
完了したblockへ後の結果を遡って混ぜず、根拠を重ねて写さない。短い補足関係は同じblock内に置ける。
見出しや表・散文は調整できるが、目的に必要な情報の対応を落とさない。六用途に合わないcaseは共通の読み取りcontractを満たす内容固有の形を使い、実例から体系を改善する。

内部検討記録の記入形は目的別format群、discussion entry内の保存形はentry用template、内部logの所属・回・記録単位は `templates/internal_record.md` が所有する。共通本体は目的に合うformatの選択と随時保存を必須にし、templateへ選択・実行の指示を戻さない。
思考標準の判定基準や提案本文のpatternは複製しない。
format群の物理構成・正式名・見出し・必須読取は次節に示す。六用途の具体本文は [共通入口](faciliate-discussion/templates/consideration-records/README.md) から読める。保存先は内部logであり、[合意差分ledger](behavior-preservation/function-migration-additions.json) の目的別format単位と [validator設計](discussion-recording/validator-caller-design.md) へ接続する。

### 共通入口から、必要な用途の記入形を選んで読む

目的別formatは `templates/consideration-records/` に置く。各fileは説明、実施前の開始形、結果後の仕上げ方、具体例を持ち、用途固有の改善を独立して行える単位にする。

```text
consideration-records/
├── README.md              検討記録のformat
│   ├─ 検討記録が支えるもの
│   ├─ 今の目的に合う記入形を選ぶ
│   ├─ どの記入形でも辿れるようにすること
│   ├─ 目的を変える時は根拠を引き継ぐ
│   └─ 該当する形がない場合
├── research.md            調査の記録
│   ├─ 調べる問いと探索範囲
│   ├─ テーマ別finding
│   │   ├─ 見つかった事実
│   │   ├─ 範囲内で見つからなかったこと
│   │   └─ 取得できなかった・まだ調べていないこと
│   ├─ 言える範囲と、調査を終える根拠
│   └─ 調査の記入形と例
├── judgment.md            比較・判断の記録
│   ├─ 判断対象と選択条件
│   ├─ 案を評価する
│   │   ├─ 複数案の差を比べる
│   │   └─ 一案の成立条件を照合する
│   ├─ 推奨の決め手と、引き受ける代償
│   └─ 判断の記入形
├── alignment.md           認識合わせを必要とする背景
│   ├─ 共有事実と未共有の前提
│   ├─ 問う対象と、回答で変わる判断
│   └─ 背景の記入形と例
├── verification.md        検証の記録
│   ├─ 主張と確かめ方
│   ├─ 期待と実際の結果
│   ├─ 反例・未検証範囲から結論の射程を定める
│   └─ 検証の記入形と例
├── diagnosis.md           診断・修正の記録
│   ├─ 期待との差と原因候補
│   ├─ 原因を支持・反証する証拠
│   │   └─ 誤診を新しいevidenceで置き換える
│   └─ 修正先と再検証を結ぶ記入形
└── generalization.md      一般化の記録
    ├─ 起点caseと暫定原則
    ├─ 異なるcaseと反例で原則を育てる
    ├─ 修正した原則を既確認caseへ戻す
    └─ 原則と適用境界を示す記入形
```

treeの見出しはformatを説明するfileの構成であり、discussionや内部logへそのまま複製する固定syntaxではない。各用途の意味と記入例は前節の体系に従う。判断は複数案と一案の例を持ち、一般化は反例による原則の修正と再適用まで示す。未成立の結論を先に埋めず、作成順と完成時の読順を分ける。
READMEは役割・選択・共通の読み取りcontract・根拠参照・未該当時の扱いを所有し、六用途の本文を複製しない。目的固有の改善はその用途fileで行い、共通の選択や接続が変わる場合だけREADMEも変更する。

`iteration.md` は新しい検討blockを始める前にREADMEで目的を選び、該当fileを全文読んでから入力を保存する。目的を切り替える時も選び直し、後続は先行findingを参照して評価や結論への意味を加える。同じblockへの結果追加だけでは別blockや外向きiterationを増やさない。
全六fileの毎回読取・使用、調査からの一律開始、既存根拠で足りる回への追加調査を要求しない。六用途に該当しなければ共通contractを満たす内容固有の形を使う。必須READMEや該当fileの読取不能は未該当と別に扱い、既決の停止へ返す。

entry用templateはdiscussionに置く判断背景と内部logへの接続を表す保存形を持ち、回の骨子への差分は [record-storage-design.md](discussion-recording/record-storage-design.md) に示す。内部記録を作る際にREADMEと用途fileを読む適用制御は本体に置く。`record-recovery.md` が未収録過程を記述する場合も同じ入口と用途fileを使うが、事後記録・確認不能を明示し、実施前保存の履歴を創作しない。
内部loopと提示背景を再構成する時点は本体、各目的の入力・結果・完成時の読順は用途file、discussionの保存形はentry templateが所有する。内部logの具体schemaは `templates/internal_record.md` の三部品とする。提案本文の表示patternは `proposal-sections/` に保ち、思考標準の判定基準も複製しない。
一file案の一覧性より、用途固有の問い・読順・例を独立して育てられることを優先する。file間の読取と参照保守を代償として受け入れるが、分割だけで実行精度や読取総量の改善を保証しない。

### entry用templateを、適用制御ではなく保存形の正本にする

entry用templateは、discussionの論点・回・本文・判断背景とlog接続・応答・現在stateの保存形を持つ。論点選択、条件による生成・省略、挿入順、応答後の遷移はtemplate自身へ置かず、三つの実行file側で扱う。

| 適用制御 | owner |
| --- | --- |
| scope・親子・現在state・decision確定・保存安全性 | SKILL.md |
| 新規／継続／再開の準備、本文・記録・応答の組立、応答後の接続 | iteration.md |
| 未収録履歴から実在した段階だけを記録する回復 | record-recovery.md |

形を読む場所と適用条件を読む場所が分かれる代償を受け入れ、既決の実行ownerとtemplateに制御の二重正本を作らない。第四のhandlerは追加しない。
consideration-recordsとproposal-sectionsは説明付きformat guideとして扱い、この決定から一律の純粋雛形化やdirectory移動を導かない。

`faciliate-discussion/` は完成形を確認するprototypeとして保持する。
保存形のfile境界・見出し・読取先は次節のとおりであり、別枠で述べた将来のdirectory ownership案は今回の完成形へ含めない。

### entryの保存形を、一つの正本から読む

`templates/discussion_entry.md` に、次の十の名前付き保存形を集約する。各 `##` 見出しが形の名前、その直下の `markdown` code blockが雛形であり、適用条件の説明や制御commentは置かない。

| 見出し | 所有する保存形 |
| --- | --- |
| 論点metadata | 論点見出し、status、親論点、種別 |
| 回の骨子 | discussionのiteration見出し、再構成した判断背景、内部logの同じ回への相対link |
| 提案本文 | 提案見出しと判断可能な案の領域 |
| 空の提案応答欄 | 対応する提案feedback見出し |
| 認識合わせ本文 | 認識合わせ見出しと回答・訂正対象の領域 |
| 空の認識合わせ回答欄 | 対応する認識合わせ回答見出し |
| 受領応答の本文 | discussion上の結果、必要な原文、評価・入力・訂正・不足・質問への回答。作成過程は内部log |
| 仮決定 | 現在有効な仮の判断 |
| 再開条件 | 不足、解消条件、戻る未決判断 |
| 決定 | 現在有効な最終結論と制約・選択理由 |

三つの実行fileは、保存形を使う前にこのfile全体を読み、指定した見出しのcode blockだけを使う。file全体や説明用の見出し・code fenceを出力へcopyしない。template内の列挙順は生成手順ではない。
iteration.mdは新規ではmetadataと回、継続では回だけを適用し、判断背景とlogへの接続の前後へ本文と空応答を加える。受領応答は既存の対応空欄へ入れる。SKILL.mdは現在stateとreparent・取下げの適用を管理する。record-recovery.mdは証拠で確認できる形だけを使い、提示・応答の正本と経過の回復先を分け、現在stateの確定をhandlerへ戻す。
採番、top-level論点での親論点fieldの省略、旧形式への深度・所属表記の投影も実行側が所有する。第四のhandlerは作らない。

一部の形だけを使う時も全体を読む代償を受け入れ、現在の小さな共通schemaを見渡せることを優先する。論点／回の二file分割やprototypeの九file分割は採らず、八つの追加小fileをproductionへ持ち込まない。六用途のformat guideと表示patternの配置は維持する。
保存形の完成本文は [discussion_entry.md](faciliate-discussion/templates/discussion_entry.md)、回の骨子に置く背景とlog接続は [record-storage-design.md](discussion-recording/record-storage-design.md) に示す。
metadata・本文二種・空応答二種・受領応答・仮決定・再開条件・決定はdiscussion側に残す。
titleは `議論記録の保存形` とし、論点番号N・回番号I・親論点番号Mを区別する。
新規file用の回・本文・応答・現在stateには論点所属を付け、`検討記録` と内部logの帰属は論点と回を特定できるようにする。logの個別根拠は `iteration-I-record-R` anchorへ接続する。空応答は見出しだけ、受領応答は既存欄へ入れる本文だけとする。
全量移行ledgerとvalidator・callerへの具体接続は [移行検証](behavior-preservation/migration-verification.md) から辿れる。個別の保存形への合意を、prototype全本文やproduction移行開始への合意には広げない。

### 必要な時点で処理へ到達し、全体を見渡せる

起動時に標準や補助fileが読まれたことだけに依存せず、実際に提案を作る場面で必要な判定へ到達する。
大きな一fileの見出し関係へ変更を押し込めず、全体の構造と一回のイテレーションの中身をそれぞれ見渡し、変更箇所を特定できる。
`SKILL.md` は外部contract、全体の見取り図、全体handling、本体への必須導線を持ち、共通イテレーション本体は同じskill内の `iteration.md` へ置く。
handlingの実行箇所で本体fileを先頭から末尾まで読むことを必須にし、双方に前提と処理結果に応じた戻り先を示す。
新しいskill・agent・第二のdecision正本は作らず、同じ記録ownerによる内部手順として扱う。経過を持つ別fileの内部logは「判断するための背景と、復帰・監査する経過を分ける」の責務分離に従う。
本体を任意参照へ変えたり、その実行内容をhandlerにも重複定義したりしない。

本体を一fileの主題にすることで、その内部の判断や見出しを進化させても、全体handlingのdocument構造へ押し込まずに済む。
同じfile内の独立章でも共通化はできるが、全体制御と本体が同じdocumentとして成長する結合を残すため、別fileへ分ける。
file間の往復が増える代償は、必須読取と前提・戻り先を明示することで扱う。分割だけで読む総量の減少や実行精度の向上を保証しない。
実行手順の三file構成と接続を次節に示す。

### 実行手順を、全体handling・反復本体・記録回復へ分ける

```text
facilitate-discussion/
├── SKILL.md                 全体handler・共通contract・必須読取の入口
├── iteration.md             選択した論点の反復本体
├── record-recovery.md       未収録議論を証拠から回復する手順
├── templates/
│   ├── discussion_entry.md  十の名前付き保存形
│   ├── internal_record.md   内部logの所属・回・記録単位の保存形
│   ├── proposal-sections/   提案本文の表示pattern
│   └── consideration-records/ 共通入口と六用途の検討記録format
└── agents/openai.yaml       公開skillの入口
```

`consideration-records/` の内部構成と読取接続は前節に示す。別skill・agent・第二のdiscussion正本、索引だけのREADMEは作らない。

#### SKILL.md: 全体の状態から処理を選び、返却条件を守る

公開contractと全体不変条件を保持し、入口から処理・戻り先が分かる地図を置く。全体に効く保存安全性・範囲限定・履歴保持はここに一度定義し、本体と回復もその前提を使う。

| 見出し | 所有する内容 |
| --- | --- |
| 目的と成果／起動gate／責務境界／入力 | 明示起動、設定、consumerとの境界、一decision返却と記録ownerの継続 |
| 全体の設計意図／workflow全体で守る不変条件 | 正本・履歴・decision粒度・機密性・安全な書込み・未収録の隠蔽禁止 |
| 実行経路 | 起動→論点選択→本体または状態更新→同期→返却と、必要時の回復分岐 |
| discussion fileを解決する | directoryとbasename検査、作成または既存利用、現在stateと番号の検査 |
| 対象論点を選ぶ | scope・親子・新規／継続／再開のroutingと、全経路での原因owner該当性判定 |
| 選択した論点を進める | 本体の二入口への必須接続。配下の別処理としてdecision確定、reparent、取下げ、現在stateを管理する |
| 返却前に記録を同期する | 全返却の通常同期、必要時の回復接続、合意待ち・consumer返却・停止の完了gate |

decision確定の節に、consumer反映・全体再評価を待つ順序、origin単位のdoc-enricher review、その後の次論点判定を保つ。reparentと取下げは現在stateの制御へ直結するためhandlerに置き、低頻度であることだけを理由に分割しない。

#### iteration.md: 共通の内部loopと、提示・応答を一つの本体にする

`入る前に引き継ぐ状態`、`二つの入口と戻り先`を入口に置き、`次の提示を準備する` と `既存提示への応答を扱う` を別の主要見出しにする。
提示準備は、作成中の回と内部記録の準備、判断材料の確認と逐次保存、提案または認識合わせの作成、判断背景の再構成と提示可能性の検査へ展開する。具体見出しと本文は [iteration.md](faciliate-discussion/iteration.md) に保存した。
新規・継続・再開の差分は最初の準備だけに保ち、標準の適用、目的別formatの選択、入力保存→実施→結果・次action保存→再判定を共通の内部loopとして持つ。理由・分岐・停止条件と記録更新をそのscope内に置く。
応答は原文と結果を一度保存し、同じdecisionの修正・認識合わせの回答なら本体内で材料確認へ、明示合意・別decision・外部停止・過去の記録漏れならhandlerへ返す。

#### record-recovery.md: 通常の未処理eventと、未収録履歴の回復を区別する

`入る条件と引き継ぐ証拠`、`記録できる変遷と合意の範囲を確かめる`、`chat上で成立した合意を記録する`、`後から発見した記録漏れを再構成する`、`回復結果からhandlerへ戻る` を主要見出しとする。
対象は、未保存のまま成立したchat合意、または処理を進めた後に判明した記録漏れである。到着直後の通常event、reparent・取下げの通常更新、正しく保存済みの処理からの中断復帰は集めない。
handlerから受け取った未収録範囲と会話・成果物・差分を照合し、各decisionの保存先はhandlerの所属・原因owner・親子規則で判定してから書き込む。事後かつchat合意済みなら事後reconstruction内で合意証拠を使い、同じ変遷を二重保存しない。
回復後は保存済み履歴・明示合意・未決・未同期を分けてhandlerへ返す。handlerが現在stateを再評価し、一decisionの確定・consumer反映と再評価を通してから次へ進める。未合意を決定にせず、確認不能な段階や合意を補完しない。

#### 必要なfileへ、必要な処理の直前に必ず到達する

| 呼ぶ地点 | 読取と接続 |
| --- | --- |
| handlerから本体の各入口へ入る直前 | `iteration.md` 全文を読み、選んだ入口から実行する。本体内の応答→準備ではhandler入口を再実行しない |
| handlerで回復の対象を検出した時 | `record-recovery.md` 全文を読んで該当経路を実行し、handlerの実state判定・通常同期へ戻る |
| 各手順fileで保存形を使う時 | discussionには `templates/discussion_entry.md`、内部logには `templates/internal_record.md` の全文を読み、指定した名前のcode blockを使う。内部記録の中身は目的別format、提案本文は表示patternの正本を使う |
| 本体で判断材料を確かめる時 | `making_and_choosing_options.md` を読んで実際の材料へ適用する |
| 検討記録を新規作成・追記・訂正・再構成する前 | `expression_notation.md` 全文を毎回読む。本体と記録回復の双方で適用し、記法の基準を複製しない |

通常同期と回復の検出はhandlerに残し、回復fileを読まないと記録漏れを検出できない構造にしない。必須file読取不能・state不一致・番号重複・書込み失敗は既決の停止・回復contractを使い、記憶実行や自動修復で代行しない。
回復時に追加読取が生じる代償を受け入れ、独自の入口・証拠・完了条件を持つ回復手順を独立して変更できることを優先する。行数や読む総量の削減を目的にしない。
旧sourceの全体制御はhandler、新規・継続・再開の局所処理は本体、chat合意済み保存と事後reconstructionは回復へ対応させる。本文全量の保存と内部参照・検査先の対応は、対象編集前の二層ledgerと後続検証で閉じる。

### 次の提示と、保存済み提示へのfeedbackを混同しない

本体には「次の提示を準備する」と「既存提示へのfeedbackを扱う」の二入口を設ける。
handlerが対象decisionと現在stateから入口を選び、通常の一回の議論を本体で進め、全体の状態制御が必要になったらhandlerへ返す。
これは同じskill内の手順であり、外部event APIやresult schemaを追加しない。

| 本体への入口 | 履歴と現在stateの扱い |
| --- | --- |
| 次の提示を準備する: 新規 | canonical h2とlegacy h3の最大番号+1を採番し、templateのイテレーション0を使う。childなら親子validationを満たす |
| 次の提示を準備する: 継続 | 評価された提示へのfeedbackが保存済みであることを確認して次番号を使い、前の提案・背景・feedbackを保つ。今回の条件とfindingを新背景へ接続する |
| 次の提示を準備する: 再開 | 同じdecision scopeであることを確認し、過去iterationを保って現在の決定を外しactiveへ戻す。再開evidence、無効になった判断、置換条件を新背景へ接続し、feedback用の別iterationを増やさない |
| 既存提示へのfeedbackを扱う | 所属gateと評価対象の特定を通り、空の対応欄へ結果・必要な原文・評価内容を一度保存する。修正なら本体内で提示準備へ、合意なら新iterationを作らずhandlerへ返す |

新しい提示を作る三経路は、共通の判断材料確認から内部記録への逐次保存を経て、提示前に判断背景を再構成する。根拠との対応とdiscussionだけでの判断可能性を確認し、本文・背景・log接続を提示できる状態へ仕上げる。
提案前にdecision数と論点タイトルのscopeも確認し、複数decisionになった場合はhandlerの論点選択へ戻す。
再開条件が未成立なら新iterationを進めず、成立した結果は新背景へ残して現在の条件を外す。
確定済みfeedbackへ新しい評価を上書きせず、再開または別decisionへのroutingを判定する。

feedback用入口を分けるのは、評価の到着を新提示の開始と扱わず、合意だけの回に新しい案を作らないためである。
一方、提示準備を新規・継続・再開へ分割しないことで、判断材料確認と今回の提示を一つの変更単位にする。

### handlerと本体が同じ状態と必須処理を引き継ぐ

handlerは、新しいdecision候補またはfeedbackの到着時にscopeと所属を判定し、選択後の全経路で原因ownerへのroutingの該当性を確認する。
認識齟齬なら既存どおり原因ownerの一般則を具体ケースより先に扱い、本体の直接実行で迂回しない。
本体へ渡すのは解決済みdiscussion file、目的とconsumer固有制約、選択したdecision、実際の発言・evidenceである。
既存論点なら番号、履歴、末尾提示とfeedback、決定・仮決定・再開条件、親参照と未決childのstateを特定する。
新規decisionではscopeと他論点との関係を特定し、まだ存在しない論点番号は渡さない。

handlerから本体の各入口へ入る時点で本体fileを全文読む。
本体内のfeedbackから次の提示準備への遷移では、skill起動やhandlerからの入口を通り直さない。
必要なtemplateと条件付き詳細もその正本を読んで使い、本体fileの読取やhandlerの要約で代替しない。
同じ実行者がdiscussionと内部logをsingle writerとして扱い、受渡し用の別state正本は作らない。discussionが提示・合意・state、logが逐次過程を所有し、片側未同期のまま完了を返さない。
各書込み直前にdiscussion全体を再読込し、選択時のstateと食い違えばhandlerのstate判定へ戻す。

handlerが全体の状態制御を所有し、本体は選ばれた入口に必要な局所更新を行う。
親子validationとparent status導出はhandler側の一つの規則を使い、新規child・再開・確定等で未決child集合が変わる更新とともに同期する。

| 本体を抜ける状態 | handlerの戻り先 |
| --- | --- |
| 判断対象・背景・空のfeedback欄を保存した | 記録同期を通し、file・論点・提示を特定した合意確認を提示して待つ |
| 保存済み提案への合意feedbackを保存した | 対象を再確認し、そのturnで現在有効なdecisionとstatusを確定する。仮決定を外し、必要なparent statusと議論を同期してconsumerへ一decisionずつ返す |
| 別decisionを検出した | 現論点へiterationを足さず論点選択へ戻る。skill起動やfile解決へは戻らない |
| 作成済み論点がscope外と分かった | 取下げへ進む。scope外の新候補はactive論点にしない |
| 再開条件未成立、または対象・stateを特定できない | 条件成立を装わず止まり、必要な事実・条件を示す。保存可能な議論は同期する |
| 未収録の過去議論を発見した | 通常の次論点より先に記録回復へ進む |

consumerによる適用・全体再評価前に次論点へ進まず、即時反映時は同じoriginating decisionのdoc-enricher提案reviewを一度だけ行う。
次の論点が一意ならその提案まで進み、上位関係やscopeが決められない場合だけ選択を問う。
一回のhandoffで同じテーマの記録ownershipまでconsumerへ移さない。

### 通常の新提示を通さずに更新・回復できる

reparent、取下げ、合意済み記録、事後reconstruction、現在stateの表現同期と返却前の同期はhandlerが行き先を管理する。
これらの記録だけのために新しい提案・合意待ちを作らない。

| 経路 | 本体との関係と保持する性質 |
| --- | --- |
| reparent | 新親が必要なら実質的な分解decisionの提示に本体を使う。親の存在と一親・自己参照禁止・循環禁止を検証してchild参照だけを変更する。別decisionの反映であれば結果を保存して空の合意待ちにせず、旧親・新親を必要時だけ同期する |
| 取下げ | 空のfeedbackならそこへ理由・結果を保存し、確定済みなら新iterationへ記録する。履歴を保ち、現在の決定を取下げ・終了へ更新する |
| chat上の合意済み記録 | 具体案と明示合意を確認して時系列に保存し、再合意しない。合意を確認できなければ未決とし、本当に追加判断が必要な時だけ通常の提示へ進む |
| 事後reconstruction | chat・discussion・変更前後・差分を照合し、事後記録、反映済み成果物、確認不能範囲を明示する。存在しなかった提案・合意を創作しない |
| 仮決定・決定の表現同期 | 現在stateとして管理する。他論点がdecision境界を変えず語彙・path等だけを置換した場合は典拠付きで現在の決定だけ同期し、境界を変えるなら再開または別論点へroutingする |

本体または処理に必須のfileが読めなければ、その処理を止め、対象と理由を報告する。要約や記憶で代行しない。
論点番号重複なら同期を含む全書込みを止め、自動修復・renumber・欠番再利用をせず未同期範囲を報告する。
書込み失敗や中断は、実fileと実際の会話から保存済み範囲を判定し、盲目的に追記を繰り返さない。
同じ合意feedbackだけ保存済みならhandlerのdecision確定から、同じ修正feedbackだけ保存済みなら本体の提示準備から再開する。
同じ中断処理だと確認できない場合や保存状態・合意対象を確定できない場合は止まり、未保存のdecisionを適用可能な結果として返さない。
未同期のまま通常のhandoff完了を宣言しない。

### 既存の議論経路と今回の進化が一緒に成立する

論点を選んでからイテレーションを扱う順序、一decisionごとのconsumerへの返却、過去の提案・feedbackの保持を維持する。
新規・継続・再開だけでなく、親子関係の更新、取下げ、合意済み議論の記録、事後回復も成立する。
通常の提案を作る回と、認識合わせが必要な回とを扱え、回復経路へ架空の提案や再合意を強制しない。
合意だけの場合や別decisionの場合に、新しいイテレーションを水増ししない。

### 表示形式と、正式な提示種別の選択を分ける

表示patternは案の内容を理解するための表示形式を選ぶものであり、`提案N`／`認識合わせN` の種類を決めるものではない。
種類と応答処理はiteration.mdが所有する。図やtreeを使うことだけを認識合わせへ切り替える理由にしない。

`templates/proposal-sections/README.md` のcatalog冒頭は、内容の理解を共有することと複数案から選ぶことの両立を説明し、選択肢の内部にも完全状態・flow・tree等を置けるとする。
同じ箇所から `../../iteration.md` を種類判定の正本として参照する。
定義に関する段落は「定義の内容や境界も、理解を共有する対象」とし、散文・対比・例・境界条件の自由構成を維持する。
`process-flow.md` と `structure-tree.md` の使用条件も、対象を示して内容の理解を共有する目的とする。
両者の併用説明は「一つの対象を直接示す場合にも」とし、complete stateや重い選択肢の内部での利用を維持する。

旧案内の広義「認識合わせ」は、案の内容を理解してもらう表示目的を表していた。
READMEの注記だけでは個別patternを読む際の同語の曖昧さが残るため、三file・六段落を明示し直す。
図・treeの雛形、非排他的な組合せ、定義の自由構成は保持し、正式な種類判定の手順を表示patternへ複製しない。
他の七file、他consumerの同語、過去記録、directory配置は変えない。
具体的な変更本文はprototypeの同名三file、意味差分と旧能力の対応は移行ledgerに保存する。

## 品質保証: 既存能力を全量保存する

`plugins/tumeda-dev/docs/common_standard/function_migration_policy.md` を、構造変更による能力欠落を防ぐために適用する。
このpolicyは品質保証の手段であり、今回の進化や実行時の発火を確認する代わりにはしない。

最終的に明示合意した意味差分を除き、baseline scopeの能力を全量保存する。
入力、判断、必須順序、停止・再開、理由、例、判断質問、強調、禁止、履歴保持、caller境界も保存対象に含む。
file分割や短縮、イテレーションの主構造化を、既存能力の変更・廃止への包括的な合意とは扱わない。現時点で明示された廃止はない。

構造の移動・読み替えと、今回の能力追加・変更を区別し、後者だけを意味差分として追跡する。
新構造と旧contractが競合した場合は、競合する意味単位を示して個別に判断し、refactoringの都合で省略しない。

[旧source ledger](behavior-preservation/function-migration-ledger.json) と [entry ledger](behavior-preservation/entry-template-migration-ledger.md) に移動先を、[合意差分ledger](behavior-preservation/function-migration-additions.json) に追加・変更と合意根拠を保存した。
全contractの再説明をdesign本文へ展開せず、本文には意味差分とその根拠を置き、既存能力の全量はbaselineとledgerから追跡する。

baselineを固定し、対象編集前に構造ledgerとcontract ledgerを作る。
移行後は旧sourceの全件照合、全追加・削除行の逆引き、境界・順序・lifecycle・二重正本・情報量の縮退をwhite-boxで確認した後、旧contractから導いたscenarioと通常のvalidatorを確認する。
具体的なbaselineと照合範囲は付録に置く。

## 具体化した完成形と検証の境界

保存先、実行本文、用途format、validator・callerの具体修正は揃っている。
本文の存在と、実際の実行確認・production反映の完了を区別する。

- 内部logの物理構成と接続
  - [record-storage-design.md](discussion-recording/record-storage-design.md) にpath・見出し・link・読取・保存形を定めた。prototypeの三実行fileから同じ保存形へ到達する。
- 実行手順と保存する能力
  - 三fileの完成本文をprototypeに置き、旧sourceとentryのledgerから具体節へ対応させた。条件・理由・例の復元箇所と逆引きは [移行検証](behavior-preservation/migration-verification.md) に記録した。
- 認識合わせと二層の保存形
  - 応答・終了・復帰はiteration.md、現在stateと確定はSKILL.md、事後回復はrecord-recovery.mdが所有する。entry十部品と内部log三部品は適用制御を持たない。
- 六用途formatと検査・caller
  - 用途ごとの完成本文、旧48guardの移管先、新しい保存形検査を保存した。task-designとcatch-upの二層接続は [validator-caller-design.md](discussion-recording/validator-caller-design.md) にexactな置換範囲を示す。

[prototypeレビューの五指摘](prototype-refinement/prototype-maintainability-review.md#レビュー後の対処記録) は反映済みである。
レビュー後の本文を対象に、旧側800単位と合意追加306単位の意味・境界・順序・停止・合意根拠を照合した。
旧側は適合756と合意変更44へ分かれ、明示廃止・未監査・未分類削除・未分類追加は0である。
これはprototypeのwhite-box結果であり、件数や対応索引だけで動作保証を宣言しない。
具体的な検証範囲と実行の限界は [migration-verification.md](behavior-preservation/migration-verification.md) を正本とする。

全24論点は決定16件・分解済み8件であり、応答待ち・調査中・保留はない。
完成設計全体とproduction反映・検証への明示合意を受けた。付録の対象を後続工程で適用・検証する。
新しい仕様選択は残っていない。prototypeの検証とproduction反映の完了は区別する。

### 完成形を確認するprototype

[faciliate-discussion/README.md](faciliate-discussion/README.md) から現在の実物を読める。
三実行file、十部品に集約したdiscussion_entry、内部log三部品、六用途への接続、表示patternと正式な提示種別の区別を反映した。
旧九分割とA案は比較資料として保全している。discussionの過去実物linkは旧保存形の保全先へ直し、過去の提案・応答・decision本文は変更していない。

構造具体化の記録は [internal-records/topic-23.local.md](internal-records/topic-23.md)、レビュー後の照合は [論点24の内部記録](internal-records/task-design-discussion.md.topic-24.md#iteration-0-record-6) にある。
603原文候補のinventoryと旧IDを保全し、独立単位化したsource686・entry114、合意追加306の移動先と逆引きを監査結果へ保存した。
旧規則へ戻る関係索引37は重複計上しない。候補数を独立contract数へ読み替えない。
件数だけで全量移行完了とはしない。検証範囲・限界は [migration-verification.md](behavior-preservation/migration-verification.md) にある。
validator・callerの具体接続と移管された思考標準三件は、それぞれの設計fileから合意済みの適用本文へ辿れる。

---

## 要件（Requirements）

### MUST（必達）

- 判断材料確認を実手順で発火させ、提案を出せない回を認識合わせとして扱う今回の進化を完了する。
- 今回と以後の進化を載せられるよう構造を再構成し、意味差分以外の既存能力を全量保存する。
- イテレーションで議論を回す実態をworkflowの主構造として表し、共通動作の正本を一つにする。
- 判断材料を確かめる基準の正本を `making_and_choosing_options.md` に保ち、skillの実行手順から参照する。
- 引き渡された「提案を出せない場合の認識合わせ」を設計対象に含める。
- 肥大化した `SKILL.md` の構成を見直し、全体と変更箇所を把握できるfile分割、各fileへの到達条件と正本の分担を設計する。
- 意味差分以外の既存contractを、分割後のfile群全体で維持する。
- 利用先固有の情報を公開対象の設計・skill・docsへ持ち込まない。
- discussionの各提示だけで独立して理解・判断・応答でき、内部logも単独で検討過程を理解できる情報量を持つ。linkを説明の代替にせず、逐次証拠・中断復帰と両立させ、重要な反証・限界を隠さない。
- 検討記録を書く前に毎回 `expression_notation.md` 全文を参照し、因果と根拠を関係に合う記法で構造化する。

### 非目標

- 移管元で完了した、判断基準そのもの、提案背景の意味、branchとPRの対応、動作確認の具体化、escalate時のcontext保持の再設計。
- skillが元から担う役割の再定義、行数目標を達成するための要約や能力削減、移行の完了だけを今回の進化の完了とみなすこと。
- 既存discussion fileの一括整形。見出しの識別を扱う場合も、既存fileを直さない決定を引き継ぐ。

### 受け入れ基準

- 提案前の判断材料の確認を一つのownerへ定義することで、新規・継続・再開すべてへ適用できる。
- 日常のイテレーションの内部構造が見出しから読め、分割した処理にも必要な時点で到達できる。実行手順三fileの入口・停止・復帰を検証する。
- 目的別formatの共通入口と六用途fileが本文の構成に対応し、本体・記録回復の適用手順から必要な形式へ到達できる。entry用templateは保存形を持ち、選択・挿入・状態遷移の制御を重複定義しない。目的変更、未該当、読取不能を区別して検証する。
- entry用templateは十の名前付き保存形を一fileに持ち、三実行fileが全文を読んで必要な形へ到達する。作成中・提示・応答・現在stateを段階別に保存でき、説明用の見出し・fenceを成果物へ混入させない。
- 内部logの入力→実施→結果・次actionの保存順と、そこから提示背景を再構成した対応を確認できる。中断・片側保存失敗・negative finding・認識合わせ・応答と質問・legacy継続・事後回復で、証拠と合意の正本が競合しない。
- 自分で取得できる事実の調査、認識合わせ、上位decision、外部待ちを区別でき、認識合わせの応答から判断材料確認を経て提案へ戻るcaseを確認できる。内部loopと記録・終了は [移行検証](behavior-preservation/migration-verification.md) のB12〜B14へ対応する。
- 旧sourceの全構造・contractから新ownerへの対応と、全削除・追加行からcontract・合意への逆引きが成立し、未監査・未分類が0になる。
- ledgerを起点とする [移行検証](behavior-preservation/migration-verification.md) のB01〜B14で、停止・回復・caller返却も確認する。机上照合と実行済みcaseは別に報告する。
- `node scripts/verification/validate-plugin.mjs` が成功する。validatorの成功だけを意味保存の証拠にはしない。

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 参照の置き場だけを替え、動作する場面に判定が届かない | workflowの包含と実行経路を先に具体化し、各入口から到達を確認する |
| 新規・継続だけを直し、再開や記録回復で旧定義が残る | 現行の更新経路を二層ledgerとcaseへ対応付ける |
| file分割時に理由、例、停止条件が要約で落ちる | 旧sourceを基準とする二層ledgerで全量を照合し、文章量が減った範囲を監査する |
| fileは短くなっても日常の処理が見えなくなる | 全体の見取り図とイテレーションの内部構造から、必要な規則へ辿れることを確認する |
| 進化をrefactoringへ混ぜ、未合意の意味変更を行う | 保存するcontractと意味差分を分け、追加・変更・廃止を合意根拠へ対応付ける |
| 引き継ぎメモの古いstatusをそのまま採る | 現行fileと後続steeringを照合し、既処理事項を未完了に戻さない |
| 背景を短くするため判断に必要な反証・限界までlogへ隠す | discussionだけで当該問いを判断できるか、根拠logとの対応とともに検査する |
| discussionとlogの片側だけ保存され、古い背景を提示する | 保存済み範囲と未同期を区別し、整合前に返却gateを通さない |

---

## テスト方針

- skill本文、template、分割先、callerを通読し、選択した論点の履歴と現在stateが矛盾しないか確認する。
- 移行のwhite-box検証を先に行い、旧contractから導いた具体caseをその後に確認する。
- 新しい判断基準には、起点以外の具体caseを二つ以上当てる。
- 変更後のskillとdocsへ `document-review` を適用する。
- repository validatorの確認範囲と、本文の意味を人が確認する範囲を区別する。
- 文字列assertionに衝突した場合は、守るcontractと配置のbindingを区別する。contractが変わらない文を言い換えただけならassertionを緩めず、元の文を保存する。

---

## （付録）移行baselineと照合範囲

### baselineと移行方向

再開時点のbaselineは、このrepositoryのrevision `a6e24853800fcb75eb6a7bdd91479a633f740d4a` とする。
この時点で対象fileの未commit変更はない。

- `plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md` 全体（1〜378行）
- `plugins/tumeda-dev/skills/facilitate-discussion/templates/discussion_entry.md` 全体（1〜109行）
- `plugins/tumeda-dev/skills/facilitate-discussion/templates/proposal-sections/README.md` 全体
- `plugins/tumeda-dev/skills/facilitate-discussion/templates/proposal-sections/process-flow.md` 全体
- `plugins/tumeda-dev/skills/facilitate-discussion/templates/proposal-sections/structure-tree.md` 全体

移行方向は、現行skill本文と変更対象templateから、再構成したskill本体・分割file・templateへの移動である。
移行前の参照側は次の通りである。`.git/`、過去の `.steering/` 記録、Git ignore対象を除いたrepository内のfileから参照を探索した。

| 参照側 | 依存する内容 |
| --- | --- |
| `plugins/tumeda-dev/skills/task-design/SKILL.md`、`plugins/tumeda-dev/skills/steering/SKILL.md` | 起動設定、discussion内部processの委譲、一decisionごとの返却と記録ownerの継続 |
| `plugins/tumeda-dev/skills/task-design/tasklist-design.md`、`plugins/tumeda-dev/skills/task-design/templates/tasklist.md` | 実装review等で直接受領したworkflow ownerがこのskillを適用すること |
| `plugins/tumeda-dev/skills/task-design-work-handoff-contracts.md` | catch-upで発見した疑義・新規TBDを通常のdiscussionへ戻すこと |
| `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md` | 提案後の議論の委譲先 |
| `plugins/tumeda-dev/skills/README.md`、`plugins/tumeda-dev/skills/facilitate-discussion/agents/openai.yaml` | skillの公開名、概要、明示起動 |
| `scripts/verification/validate-plugin.mjs` | 対象file群の存在、contract文、現行の見出し・包含構造、templateの形式 |
| `scripts/verification/test-task-design-handoff.mjs` | catch-up側の委譲先としてのskill名 |

対象skill内部の節番号参照も、実行経路を保ったまま新構造へ読み替える。
表示patternの変更範囲は上記三fileである。残る七fileは維持対象であり、意味・参照の整合は検証する。
各contractのdestinationは [旧source ledger](behavior-preservation/function-migration-ledger.json) と [entry ledger](behavior-preservation/entry-template-migration-ledger.md)、依存先の更新要否と具体差分は [validator-caller-design.md](discussion-recording/validator-caller-design.md) に示す。

### 移行の証拠

一般手順は `plugins/tumeda-dev/docs/common_standard/function_migration_policy.md` を正本とする。
このtaskでは、対象skillを編集する前に旧sourceの全連続範囲を登録した構造ledgerと、独立した意味単位ごとのcontract ledgerを作り、保存先と分類を確定する。
旧sourceを土台に移し、明示指示・合意がある意味差分だけを適用する。

完了時は、旧sourceから移行先への全件照合に加え、Gitの全削除・追加行から旧contractまたは合意した意味差分へ逆引きできる。
file間の境界、必須順序、lifecycle、正本の重複、文章量・章数が減った箇所も監査する。
このwhite-box検証を終えてから、旧contractを起点とするscenarioと通常のvalidatorを確認する。

構造とcontractの対応、合意差分、逆引き、確認結果は [migration-verification.md](behavior-preservation/migration-verification.md) を索引とする。603候補だけの [source inventory](behavior-preservation/function-migration-source-inventory.json) と、照合を加えたledgerを混同しない。
移行完了時に、`適合 N / 合意済み追加 N / 合意済み変更 N / 明示廃止 N / 未監査 0 / 未分類削除 0 / 未分類追加 0` を証拠への索引として示す。

---

## （付録）前提とする既存仕様

- `facilitate-discussion/SKILL.md` は、明示起動、既存directoryとbasenameの入力、single writer、論点採番、親子validation、履歴保持を定めている。
- 新規論点、同じdecisionの継続、決定済み論点の再開の三経路が、提案・背景・feedback欄の作成を個別に記述している。
  再開経路は独立節番号ではなく、`2.3.1` 配下の `決定済み論点を再開するvariant` である。
- `templates/discussion_entry.md` は、提案0と提案1以降を含む保存形式の正本であり、`templates/proposal-sections/README.md` は内容表示patternの入口である。
- `task-design` と `steering` はdiscussionの内部processを `facilitate-discussion` へ委ねる。
  decisionの適用と全体再評価はconsumerが所有し、同じテーマの記録ownerは `facilitate-discussion` に残る。
- `scripts/verification/validate-plugin.mjs` は、contract文だけでなく、現行の節見出しやtemplateの見出しも固定文字列で検査している。
- 判断材料の正本とskillからの参照方針は、`../20260921-guard-premature-decisions/design.md` で確定している。
  同discussionの保留事項を再開するため、このdesignが具体的な構造と参照位置を決める。
- 元roadmap `../20260921-apply-escalated-skill-fixes/roadmap.md` は終了し、残件をこのdirectoryへ移管済みである。
  この再開を元roadmapの未割当childとして自動bindingしない。

### 同時に移管された独立事項

元roadmapは次の事項もこのdirectoryへ移している。
元roadmapの「その他」とhandoffに基づき、三件とも今回の設計対象として保持する。扱うこと自体を再合意しない。
三件はdiscussionの二層保存構成を規定しない独立事項である。[thinking-standards-design.md](thinking-standard-evolution/thinking-standards-design.md) に置換する全文・表示名・見出しを保存した。

| 事項 | 具体化した変更 |
| --- | --- |
| `think_standards/evolution_policy.md` の内容の濃さ | 場面駆動・主軸一つ・暫定性・失敗起点の知識保存を、歴史的な理由と変更時の判断へ展開する全文 |
| `think_standards` 全体の場面名 | 全11場面のh1と参照labelを「〜とき」へ統一。行為・出来事・検討段階、path、triggerは保持 |
| `think_standards` 全体の `補助:` prefix | making_and_choosing_optionsの独立補助二見出しへ追加。主軸の展開節・本文・深度は保持 |
| discussion見出しの識別 | 所属suffix・範囲限定を三実行fileと保存形へ接続。suffixは新規fileだけ、範囲限定は新旧共通。具体guardはvalidator置換本文へ保存 |

引き継ぎメモにあった別agentへのcatch-up手順は、後続の `../20260921-preserve-design-reasoning-across-handoffs/` で実装・検証されている。
現行 `task-design` にhandoff gateと共有referenceへの接続があり、今回の未完了事項には戻さない。

---

## prototypeの解釈を一意に保つ

安全書込みは、全体再読込・実論点走査・範囲限定・更新または追加・差分確認の順序と、停止する不整合を分けて記述する。
既存fileの表記維持とstatus導出は別の規則として引けるようにする。iterationの入口差分と、二層の共通保存順も分ける。

中断復帰の具体caseは `iteration.md` の「保存境界から中断処理へ戻る」を正本とする。
handlerは同節への接続、返された結果の確定・同期、処理後に判明した記録漏れの回復検出を所有し、具体的な復帰表を複製しない。

origin-reviewで追加の調査・比較・一般化を行う時は、iterationの共通記録手順へ接続する。
記録だけの呼出しでは外向き回を増やさず、結果保存だけの場合に新しい調査を作らない。
六用途に該当しない形を使う理由は、目的と既存formatで表せない必要情報によって記録する。見出し調整で表せる場合と読取不能は未該当としない。

図を使うかは記法標準に従う。discussion fileとchatだけは未renderでも判断できるようにraw text優先の既存例外を維持し、内部logへその例外を拡張しない。

以上は既決契約の明確化としてprototypeへ反映した。実施根拠は [レビュー](prototype-refinement/prototype-maintainability-review.md) と [論点24](task-design-discussion.md#論点24-部分修正できる案と分けて採否を決める案をどう区別するか) に置く。

decisionは、ユーザーが採否を決める問いとその結論の単位とする。
各部分が別の問いへの答えで、一方を確定しても他方について別に決める結論が残る場合に分ける。
同じ採否を成立させる必然的な展開・参照更新は一つとし、同じ問いへの局所修正や別案は同じ論点で扱う。
別decision間の依存は既存routingで表し、file数・hunk数・部分修正を求められる箇所数では数えない。

判定正本はSKILL.mdの「対象論点を選ぶ」に置き、保存前gateとiterationの提案保存前・応答処理が参照する。
論点24で旧条件からの意味変更へ合意した。scope・原因owner・親子routingと判断材料確認は維持する。
意味と依存を読む判断は残り、機械的に数えられる基準とはしない。

## （付録）変更の実行区分

### task-design内の対象成果物反映待ち

三実行file、保存形、六用途guide、表示pattern、validatorとcaller、思考標準三件を、合意済み具体本文と移行ledgerに従って反映・検証する。prototypeへの反映とproductionへの適用を区別する。

### execution plan対象

なし。今回の成果物は一つの連続した反映・validationへ具体化しているため、file数だけを理由にtasklist・roadmapを作らない。

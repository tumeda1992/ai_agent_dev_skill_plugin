# 現prototypeの母集団全体への適用結果 v3（一般化済み検証資料）

## この巡回で行ったこと

C1〜C8から得たentry骨子とproposal-section catalogを、二つの利用先から得た母集団へ一度すべて当てた。新しいgapを一件見つけるたびに合意を求めず、同じ巡回中に具体afterを作り、類似caseと既確認caseへ戻し当てした。

このfileの判定単位は、見出し名を機械的に分類できるかではない。各caseについて、現在の問い、そこへ至るfeedbackと背景、判断に必要な具体像、現在有効な決定を、現prototypeとproposal patternで省略なく示せるかである。

## 母集団の補正

初回の`evidence-matrix.md`は20 fileを母集団とした。しかし、次のfileが検索条件から漏れていた。

- legacyの`## 議題N`を使う`discussion.md`
- 現行版とは別に残る`task-design-discussion.by_sonnet.md`
- underscoreでなくhyphenを使う`implementation-review.md`

補正後の母集団は22 fileである。

- discussion系: 15 file、134 decision section
- うちiterationなし: 107 decision
- うちiterationあり: 27 decision、53 iteration
- implementation review系: 7 file、55 review事象

review fileはdiscussion entryそのものではない。合意前previewが不足した結果、実装・成果物reviewで何が未合意として現れたかを検出する反証材料として全事象を読んだ。

## discussion系15 fileの列挙

source pathは公開せず、file種別だけを残す。各行の区別と参照にはcorpus IDを使う。

| ID | source種別 | decision | iterationあり | iteration数 | 適用結果 |
| --- | --- | ---: | ---: | ---: | --- |
| D01 | discussion | 7 | 0 | 0 | 一回で閉じる提案・選択・決定。現骨子で可 |
| D02 | discussion | 12 | 3 | 11 | C1の累積契約、診断更新、proposal修正。C1・C2で可 |
| D03 | legacy discussion | 3 | 0 | 0 | 後段の全体設計変更が旧decisionを覆す。C3の再開で可 |
| D04 | discussion | 11 | 1 | 1 | tree、後続topicによる語彙置換。structure tree・C7で可 |
| D05 | discussion | 1 | 1 | 3 | UI範囲をbefore / afterで修正。complete state・局所diffで可 |
| D06 | discussion | 1 | 0 | 0 | file配置と移行方針。structure treeと必要な変更集合で可 |
| D07 | task-design discussion | 1 | 1 | 1 | runtime接続の局所修正。process flow・treeで可 |
| D08 | discussion | 7 | 0 | 0 | data、API、配置の一回決定。表・flow・treeで可 |
| D09 | discussion | 5 | 0 | 0 | 短い選択と設定判断。compact options・局所diffで可 |
| D10 | discussion | 10 | 2 | 4 | 診断深化とproposal具体化。C2、C10で可 |
| D11 | discussion | 32 | 2 | 5 | evidenceによる候補撤回、別topicのiteration混入。C3・C4で可 |
| D12 | legacy task-design discussion | 4 | 0 | 0 | 現行版以前の一回提案。履歴資料として保持し、現骨子で再現可 |
| D13 | task-design discussion | 13 | 3 | 4 | scope修正、命名、再発防止の分離。C2・C4・C8で可 |
| D14 | task-design discussion | 16 | 4 | 6 | 長いdocument改訂、UI owner変更、提案scope転化。C1・C4〜C6の組合せで可 |
| D15 | task-design discussion | 11 | 10 | 18 | decision分解、runtime・owner・配布contract。C2〜C4・C8で可 |

### discussion系で見つかった構造上の境界case

#### legacyな全体変更

D03は三つの`## 議題N`の後に、論点外の`## ⚠️ 設計変更`で前の設計を覆している。現在formatなら、同一decisionを変えるevidenceとして元論点を再開し、旧`決定`を現在結論から外してiterationを追加する。別decisionが具体語だけを変える場合はC7を使う。新しいentry骨子は要らない。

#### 別topicのiterationを物理的に入れたcase

D11の論点28には`イテレーション（論点27 続き）`が入っている。これは特殊なiteration variantではなく、decision ownerの誤りである。論点27のfeedbackとproposalは論点27へ置き、論点28は独立decisionとして分ける。C4の一leaf一decisionとfeedback routingで防げる。

#### 長い累積proposal

D14の「進化の種」caseは、各iterationでdocument全体案を再掲し、後半では今回の問いより既決部分が大きい。現prototypeでは、各proposalをその回の問いへ絞り、最終結果は`決定`に置く。新規documentの構造を問う回は`document-heading-outline`、既存fileの変更は局所diff、三fileを一decisionで変える必要がある回だけ後述の変更集合を組み合わせる。長さ専用のentry形式は要らない。

## implementation review系7 fileの列挙

| ID | source種別 | review事象 | 主に露出した未合意判断 | 適用結果 |
| --- | --- | ---: | --- | --- |
| R01 | implementation review | 9 | UI状態、日付、validation、mutation後更新 | flow、state、局所diffで可 |
| R02 | implementation review | 2 | select初期値、mutation後のcache更新 | flow、state、局所diffで可 |
| R03 | implementation review | 4 | config配置、document内容、単一fileの責務分割 | C5・C6に加えC10を作成 |
| R04 | implementation review | 15 | 外部API制約、data relation、error、抜けたphase | flow、対応表、C2〜C4で可 |
| R05 | implementation review | 16 | UI input、API境界値、error継続、response、data欠損 | options、flow、state、局所diffで可 |
| R06 | implementation review | 6 | 可逆操作のgate、UIとURL、ready反映、表示欠落、timezone | C2・C3、flow、局所diffで可 |
| R07 | implementation review | 3 | 15 fileの意味保持、固有例の一般化、PR contract | C11を作成 |

55事象のうち、UI・API・data・error・workflowの個別判断は既存patternの組合せで表示できた。新しい共通fieldは必要なかった。preview側で既存patternだけでは判断単位が定まらなかったのは、fileの配置と本文の対応が同時に変わるcase群だった。

## この巡回で追加した具体case

### C9: 一対一のdirectory移動

8 fileのsource→target、機械的なimport補正、外部consumer、旧path不在、scope外変更を一つの変更集合で示した。完成後treeだけでも、8 fileの全文before / afterでも不足または冗長になる。

### C10: 一fileから複数fileへの分割

旧fileの各責務、fallback、test、公開APIを、新しいfileへ対応させた。path対応を一対多にするだけでは足りず、対応単位を責務とcontractへ下げる必要があった。

### C11: 15 fileの意味保持移植

source→target対応を列挙し、defaultを意味保持とした。許可する一般化・host差分・context委譲だけを例外として示し、機械的でない変更はfileごとにdiff、before / after、outlineを選ぶ。全fileを同じ表示形式へ押し込まず、全fileが同じ判断gateを通る形にした。

## C9〜C11から得た共通骨子とvariation

三caseは同じ固定templateへ収斂しない。共通するのは、変更後のfile一覧を見せることではなく、合意対象となる**変更集合を閉じる**ことである。

変更集合は、今回のdecisionに含む対象を漏れなく列挙し、各対象についてbeforeの何がafterのどこへ対応するか、何を変えてよく何を維持するか、何を削除し、何をscope外にするか、どの状態なら完了かを読めるようにする。

その具体的な表示はcaseで変える。

| case | 対応の主単位 | 必要になった表示 |
| --- | --- | --- |
| C9 一対一移動 | file path | 完成後tree、source→target表、機械的置換、consumer一覧、旧path不在 |
| C10 分割 | 責務・contract | 完成後tree、旧責務→新file表、file間flow、公開API維持、旧file不在 |
| C11 意味保持移植 | fileごとの意味 | source→target台帳、default保持、許可変換、file別のdiff / before-after / outline、未許可差分0件 |

したがって、catalogへ加えるなら`file move`、`file split`、`semantic migration`という三つの完成形templateではなく、変更集合を組み立てる一つの開始形と、上表のvariation例にする。項目を常に全部出す固定formにはしない。

## 既存caseへの戻り検証

### C5: 新規document

新規documentはbeforeが存在せず、主な判断は見出し構造と各見出しの役割である。変更集合を前面に出すより、既存の`structure-tree`と`document-heading-outline`が読みやすい。複数fileを同時に新規作成する場合だけ、対象漏れを防ぐ外枠として変更集合を併用する。

### C6: 既存fileの局所修正

一file、一つの読みやすいhunkで変更集合が自明なら、完全unified diffだけで足りる。file台帳を追加すると冗長になる。離れたhunkが独立して変更可能ならC4でdecisionを分け、それぞれC6を使う。同じdecisionが複数hunkを不可分に変える時だけ、一つの変更集合内で全hunkを示す。

### C7・C8

topic間の具体語同期とowner移動は、file操作ではなくdecision relationshipである。変更集合へ吸収せず、C7の典拠同期、C8のdecision分解と内容に合うproposal patternを維持する。

### D14の三file document改訂

`documentation.md`新規作成、`project-instructions.md`と`doc-enricher/SKILL.md`修正が一つの規範導入として不可分なら、外枠に三fileの変更集合を置く。その内部は、新規documentにoutline、既存二fileに局所diffを使う。後のfeedbackがdocument構造だけを変えるなら、そのiterationは新しい問いに必要なoutlineだけを提示し、三fileの既決内容を再掲しない。

## 一巡後の判定

### entry骨子

134 decisionの一回提案、27 decisionのiteration、legacyな再開、誤ったownerへのiteration混入、長い累積proposalを含め、C1〜C8で得た現prototypeのentry骨子で扱えない意味型は残らなかった。

### proposal-section catalog

既存catalogへ追加が必要なのは、複数fileまたはfileの対応関係が一decisionを構成する時の「変更集合」patternである。C9〜C11の共通骨子を開始形にし、対応の主単位と内部表示はcaseごとに変える。

このpatternを追加すれば、prototype commentに残る次の未決範囲を整理できる。

- 大規模な既存file修正: 一decisionとして不可分な全hunkを変更集合内に示す。独立ならC4で分ける。
- 離れた多数の変更: 同上。
- 複数file変更: file actionを列挙し、各file内はoutline、diff、対応表等を使い分ける。
- file移動: C9〜C11のvariationで扱う。

新しいentry見出し、固定field、proposalを一つの表示方式へ揃える規則は追加しない。

## 合意とprototype反映

この一巡結果は`task-design-discussion.md`論点4のイテレーション20として受諾された。proposal-section catalogへ`file-change-set.md`を追加し、C9〜C11を一つの共通contractに対するvariationとして接続した。`discussion_entry.md`に残っていた大規模既存file修正、離れた多数の変更、複数file変更、file移動のTBDは、このselection条件と変更集合contractへ置換した。

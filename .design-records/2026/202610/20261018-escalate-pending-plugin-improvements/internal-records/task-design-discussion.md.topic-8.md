# 内部検討記録: 論点8 — 原文抽出・全体検査の実行手段

**discussion:** [task-design-discussion.md](../task-design-discussion/task-design-discussion-6-10.md)

**論点:** 論点8

## 開始context

分割記録は所在だけの索引と5論点単位の本文を持ち、通常進行では現在結果を原文取得し、対象の履歴を全文読む。
構造不明やsnapshot変化を見逃して書き込まないこと、設計引き継ぎの全履歴照合を維持することも決定済みである。
今回判断するのは、定型的な読取・検査を専用のread-only scriptへ集約し、議論判断と書込みをownerへ残す分担である。
現時点でscriptの実装・実行試験は行わず、既存toolとの境界と、追加する処理の入出力・停止を設計する。

<a id="iteration-0"></a>

## イテレーション0: 機械的な読取・検査だけを補助scriptへ分離する

開始時のfile一覧から、facilitate-discussionにはSKILL.md、iteration.md、record-recovery.mdとtemplate群があり、
引き継ぎ用のextract-handoff-input.mjsはtask-design/scriptsにあると確認済みである。
このinventoryは以下の調査入力を保存する前に取得した事実であり、実施前記録があったとは扱わない。

<a id="iteration-0-record-1"></a>

### 調査: 既存extractorと検証scriptから再利用できる処理・分離すべき読取境界

#### 問い・探索範囲・方法

task-design/scripts/extract-handoff-input.mjsとscripts/verification/test-task-design-handoff.mjsを読み、
実行runtime、引数・失敗の扱い、Markdownの構造認識、read-onlyの範囲を確認する。
保存先をfacilitate-discussion配下とした独立scriptが既存環境で成立するか、
既存extractorの入力境界を広げずに共通化できるかを判断する材料にする。
原文抽出と構造検査をagentの都度commandへ委ねる場合の利点・制約は、既存契約とこのfindingを使って比較する。

#### 結果・根拠・限界

extract-handoff-input.mjsはNodeの標準moduleでdesign.mdを読み、指定されたh2節だけをstdoutへ出す。
引数不足、必須節の欠落・重複・空欄を失敗として扱い、fileの作成・変更は行わない。
既存環境で、追加依存のない読取専用scriptを置く構成は成立している。

ただし、このscriptはdiscussionの論点・iterationや複数fileを扱わず、snapshot照合も行わない。
見出し認識は行頭の正規表現であり、code fence内の例示などを除外する汎用Markdown解析器ではない。
この実装をそのまま分割discussionの構造検査へ流用できるとは判断しない。
また、独立再構成前に取得できる節を限定する既存契約を、今回のために拡張する理由もない。

test-task-design-handoff.mjsは、一時fixtureからscriptを起動し、終了状態・stdoutの一致・非公開対象の非混入を確認する。
必須節の欠落・重複・空欄などの失敗caseも持つ。
これらは新scriptのfixture設計の参考になるが、discussion抽出の正しさを検証した証拠ではない。
今回行ったのは両fileの読取であり、新scriptの実装や実行試験は行っていない。

<a id="iteration-0-record-2"></a>

### 判断: 機械的な読取を専用scriptへ置き、意味判断と書込みはownerへ残す

facilitate-discussion専用の読取補助scriptを置く案を推す。
同じ論点形式の構造検査を再利用でき、保存形式のownerと、利用者の応答を解釈するownerを分けずに済む。
既存の引き継ぎ用extractorは変更せず、独立skillやcommonも新設しない。

#### 判断対象・比較方法

論点5〜7の契約と前項の調査結果から、次の境界が成立するかを検討する。
専用scriptをfacilitate-discussion配下に置く案を、agentが毎回commandを組む運用と比較する。
既存の引き継ぎ用extractorを拡張する案と、独立skillやcommonへ置く案についても、所有責任と読取制限を確認する。

専用scriptの候補処理は、本文を読まない存在確認、出典付き原文の取得、論点・索引の機械的検査、snapshot照合である。
同じ番号の重複、親論点が別範囲にある場合、例示の偽見出し、未知の旧形式、読取後のfile追加を具体caseにする。
利用者の合意の意味、提案の妥当性、再審議の必要性、Markdownの修正はscriptの判断対象から外す。
snapshot一致を排他lockや複数fileのatomic更新の保証と取り違えないことも確認する。

#### 評価と案への反映

都度commandでも原文を読むことはできるが、各回で同じ見出し除外、索引照合、親子検査を組み直すことになる。
処理が毎回変わると、ある回の検査漏れをfixtureで再現して直しても、次のcommandへ修正が引き継がれない。
専用scriptなら、定型検査を固定した実行単位へ集め、失敗caseを継続検証できる。
代償はparserとfixtureの保守であり、読めない旧形式を無理に解析成功にしない退避経路が必要になる。

既存extractorの拡張は、独立再構成前の限定入力と、本文読取後の構造検査を同じ入口へ混在させる。
新scriptでも存在確認と本文読取を分ける必要があり、既存の限定処理へ寄せる利点はない。
独立skillやcommonへ置く案も、現時点の利用者は同じ保存形式のownerだけであり、責務を分散させる。
そのため、facilitate-discussion/scripts配下で、既存二入力を受けるNodeの読取専用helperとする。

以下は実装済みscriptの試験ではなく、役割分担を具体caseへ当てた机上照合である。

| case | scriptから返すもの | ownerが行うこと |
| --- | --- | --- |
| 別範囲に同じ論点番号がある | 重複番号と両方の出典 | 書込みを停止し、不整合を報告する |
| 子と親が別の範囲本文にある | 同じ論理記録全体での親参照の照合結果 | 親の未決child集合と状態を判断する |
| code fence・引用・HTML comment内に論点の例がある | 実論点から除外した走査結果 | 実論点の採番を使う |
| 未知の旧形式で現在結果を切り出せない | 未解釈箇所と全文読取が必要な出典 | 原文全文へ広げ、意味を判断する |
| 読取後に本文が追加・変更・削除された | inventoryまたは内容digestの差 | 再取得して影響評価し、古い前提で書き込まない |
| statusは決定だが応答の意味が疑わしい | metadataと決定・応答の原文 | 合意をscriptで認定せず、履歴から判断する |

構造検査は、実論点の一意性、索引と実本文の番号・題名・所在、5論点範囲への所属、親の存在・一親・循環禁止を扱う。
索引に載っているfileだけを盲信せず、その記録の範囲本文候補との過不足も確認する。
任意の外部linkを辿って収集せず、同じ記録の保存範囲を検査する。
調査中の未完成iterationは正常な途中状態であり、提案や応答が未成立であることだけでは破損としない。

原文抽出は意味の要約ではなく、出典付きのblock取得である。
本文上の現在結果・metadata・最新iterationを構造から取り出し、その意味と不足はownerが確認する。
未解釈部分を黙って捨てず、全文へ広げる必要を返す。
機械的に確認できる重複や参照切れは、全文を読めば無視できるものではなく、解消まで書込みを止める。

snapshotは索引・全範囲本文のinventoryと内容digestを持ち、根拠として実際に読んだ内部logも加える。
関係のない全内部log本文の読取は要求しない。
読取中の変化も確認し、異なる版を混ぜた取得結果を成功扱いしない。
一致は変更を検出しなかった結果に限られ、排他lockでも同時writerへの保証でもない。
既存のsingle writer契約と、更新対象の全文再読込を引き続き必要とする。

#### 残る実装検証と次action

正常な一fileと12論点の分割記録、別範囲への親参照、古い論点の再開、偽見出し、重複、索引の欠落・不一致、
循環、未知形式への全文fallback、snapshotの追加・削除・内容変更をfixtureで検証する必要がある。
存在確認で本文が出ないことと、全操作で入力fileのbyte列が変わらないことも検証対象にする。
新scriptは未実装であり、上記を通過したとは扱わない。

次は、この責務境界、設置位置、操作の流れと異常時の例をdiscussionへ提示する。
引数・出力schemaの詳細、callerへの具体的な接続、分割・中断復帰の書込手順は未決として残す。

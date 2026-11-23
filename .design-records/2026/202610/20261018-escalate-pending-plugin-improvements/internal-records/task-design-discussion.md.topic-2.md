# 内部検討記録: 論点2 — 長大な議論の分割の適用対象

**discussion:** [task-design-discussion.md](../task-design-discussion/task-design-discussion-1-5.md)

**論点:** 論点2

## 開始context

四領域を独立して設計する骨格は論点1で合意された。
分割領域の入力要求は、10論点超で5論点単位、同じdiscussion directory内の索引、
可変の追記先pointerを持たない運用、履歴・採番・正本の保持である。
今回の問いは、それをtask-design固有にするか、pluginの議論記録に共通適用するかである。
path命名、既存fileの移行時点、内部logの保存位置の詳細は、この問いと別に残る。

<a id="iteration-0"></a>

## イテレーション0: 共通の記録ownerとconsumerの関係から適用対象を判断する

<a id="iteration-0-record-1"></a>

### 調査: 分割を適用すると影響する記録ownerと読取経路

#### 問い・探索範囲・方法

facilitate-discussionがどのcallerから使われ、discussion basenameの違いで保存・読取が分かれるかを確かめる。
plugins/tumeda-dev/skillsとscripts/verificationを対象に、facilitate-discussion、discussion_file_name、
task-design-discussion、implementation_review、readFile、readFileSyncの参照を検索する。
caller契約はtask-design/SKILL.md、steering/SKILL.md、tasklist-executor/SKILL.md、
記録ownerのfacilitate-discussion/SKILL.mdとiteration.md、
design引き継ぎのtask-design-work-handoff-contracts.mdとextract-handoff-input.mjsで照合する。
既存の作業記録全件を移行する是非は、今回の事実調査では決めない。

#### 共通の保存ownerと三種類の議論記録

facilitate-discussion/SKILL.mdの入力はdiscussion_directoryとdiscussion_file_nameであり、
callerの種類を表すfieldはない。basenameを省略するとdiscussion.mdを使う。
同fileの保存先解決は一つのfileを対象とし、全文読取、論点重複検査、親子validationを所有する。
内部logはinternal-records/{discussion basename}.topic-{論点番号}.mdへ接続する。

task-design/SKILL.mdの「task-design-discussion.mdの使い方」は、
discussion_file_name=task-design-discussion.mdを渡し、記録processをfacilitate-discussionへ委ねる。
steering/SKILL.mdの「discussion.mdの使い方」は同じdirectoryを渡してdefaultのdiscussion.mdを利用し、
「実装完了後review」はdiscussion_file_name=implementation_review.mdを明示する。
したがって三種類は内容のownerこそ違うが、保存形式、論点、応答、履歴のownerは同じである。

#### 分割後の読取と引き継ぎにも接続が必要

facilitate-discussion/SKILL.mdは、書込み直前の対象file全文と他論点の現在decisionを読むことを要求する。
分割後も全履歴fileを常に読む契約のままなら、物理的に分けても読取量は減らない。
一方、対象fileだけへ狭めると、別fileにある親子関係、番号重複、後続訂正を見逃しうる。
どの案でも読取範囲と全体検査の関係を後続設計で閉じる必要がある。

task-design-work-handoff-contracts.mdの「正本照合とcompletion gate」は、
独立再構成後に全decisionとactiveまたは停止中topicを照合し、読んだ正本のdigest一致を要求する。
分割した本文もこのcoverageとdigestから落とせない。
extract-handoff-input.mjsはdesign.mdだけを読み、元の依頼内容と上位roadmap制約を抽出する。
discussion分割だけを理由に、このextractorの入力境界を広げる必要はない。

#### 探索範囲と限界

skillsとscripts/verificationで上記の識別子を検索し、callerの引数、記録owner、
引き継ぎcontract、extractorを実体で確認した。
検索だけで任意の外部consumerや人手linkの影響がないとは断定しない。
test-task-design-handoff.mjsとvalidate-plugin.mjsにも固定path・文字列のassertionがあることを検索で確認したが、
この段階では実行も変更もしていない。
既存記録全件の移行時点、破損時の復旧手順、正確な分割pathは未設計であり、今回の適用対象とは別に残る。

#### 解釈と次action

三種類を共通に扱う案もtask-designだけに限定する案も、同じ保存ownerのまま実現できる。
前者はcallerごとの読取方式を揃え、後者は運用変更の適用範囲を絞る。
どこまで適用する意図かはsourceを増やしても確定しないため、次は両案をこの差で比較し、利用者へ採否を問う。

<a id="iteration-0-record-2"></a>

### 判断: 共通の分割運用か、task-designだけへの適用か

#### 判断対象・必須条件・根拠

今回決めるのは、facilitate-discussionが扱う議論記録のうち、自動分割を適用する対象である。
必須条件は、履歴・論点の同一性を保ち、対象外の記録や内部logまで無断で作り替えないこと。
比較するのは、同じ保存形式を使う三種類の議論への一貫性と、運用変更を実例のある範囲に限定する利点である。
根拠は同じ回の調査とhandoff-input.mdの分割要求であり、細部のpath・移行時点は今回の採否へ混ぜない。

#### 比較結果と推奨

共通適用を推す。三種類はどれも同じ論点・iteration・応答・内部logの仕組みを使っており、
読取量が増える問題は内容のownerに依存しない。
同じ記録形式の読み方を揃えることが共通化の理由であり、各callerの業務判断を一つへ集める提案ではない。

task-design限定も成立する。実測のある設計議論だけを変え、通常議論と実装後reviewは今の一file運用を維持できる。
限定を重視するならこちらへ推奨が変わる。ただし同じ記録skillに二種類の保存・読取運用が残り、
同じ長大化がreview側で起きた場合には別途適用拡大が必要になる。

#### 具体caseによる境界確認

各basenameに12論点あるcaseでは、共通適用はtask-design-discussion.md、discussion.md、implementation_review.mdの
それぞれを1〜5、6〜10、11〜15の範囲へ分ける対象にする。
task-design限定では前者だけが対象で、後二者は一fileのままである。
この違いは運用結果として観測でき、単なる名前や説明量の違いではない。

どちらの案でも10論点以下の議論は従来どおり一fileとし、design.md、tasklist.md、roadmap.md、
論点別の内部log、議論を記録していない通常のsessionは今回の分割対象にしない。
すべての過去記録を直ちに移すか、更新時にだけ移すかは、適用範囲と別の問いとして残す。

#### 材料充足と残る判断

保存ownerとcallerは確認できている。適用対象を選ぶための追加の実装調査は不要である。
運用を揃えることと実例のある範囲に限定することのどちらを重視するかは、利用者の判断として残る。
scopeを選んだ後、物理構造、読取・検査の保証、既存記録の移行時点を具体化する。

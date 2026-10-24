# 内部検討記録: 論点4 — 分割前の入口を残すか

**discussion:** [task-design-discussion.md](../task-design-discussion/task-design-discussion-1-5.md)

**論点:** 論点4

## 開始context

facilitate-discussionの論点形式の記録は、個別に10論点を超えた場合だけ5論点単位へ分割する。
元fileが{stem}.mdなら、分割後は同階層の{stem}/内に同じbasenameの索引と、stemへ範囲を付けた本文を置く。
短い記録は移動せず、内部logも現行の配置を保つ。可変の追記先pointerは作らない。
今回決めるのは旧入口を残すかであり、索引内容、分割後の読取範囲、移行時点そのものは別途設計する。

<a id="iteration-0"></a>

## イテレーション0: 旧入口の互換性と正本の見つけ方

旧fileをなくす場合と案内だけ残す場合では、既存linkの扱いと正本探索の接続が変わる。
旧入口の互換性が現行契約から必須なのか、利用者が選ぶ保守方針なのかを確認する。

<a id="iteration-0-record-1"></a>

### 調査: 元の入口pathを前提にするconsumerと引き継ぎ判定

#### 問い・探索範囲・方法

plugins/tumeda-dev/skills/全体で、task-design-discussion.md、discussion_file_name、implementation_review.md、
discussion存在判定を検索し、関連するfacilitate-discussion、task-design、steeringと引き継ぎ契約の箇所を読む。
分割後の入口を発見できない分岐、新規file作成へ誤進入する条件、旧link互換性の既定があるかを調べる。
facilitate-discussionとtask-designの読取済み本文は既存evidenceとして使い、未読のcallerと引き継ぎ契約を追加確認する。

#### 入口の存否と新規作成が結び付いている

facilitate-discussion/SKILL.mdの「discussion fileを解決する」は、入力directoryとbasenameから一fileを特定し、
そのfileがなければ新規作成する。分割先を探す分岐はこの手順にない。
task-design/SKILL.mdの「既存designのhandoff gate」とtask-design-work-handoff-contracts.mdの「起動gateと読取境界」は、
元のdesignまたはdiscussionの存在だけを見て既存設計かを判定する。
designが残っていれば既存扱いになるが、discussionだけが分割先に残るcaseは現行の存在判定だけでは拾えない。
分割配置を導入する場合は、どちらの旧入口方針でも、分割先の存在確認を新規作成より前へ接続する必要がある。
handoff前の本文読取禁止は維持し、分割を理由に索引本文を先読みする設計にはしない。

#### callerは議論の名前を渡し、物理pathは共通ownerが解決する

task-designはdiscussion_directoryとdiscussion_file_name=task-design-discussion.mdを渡す。
steering/SKILL.mdの「実装・review後のfeedback」とtask-design/templates/tasklist.mdは、
同じ形式でimplementation_review.mdを指定する。
従って、callerごとに分割先directoryを入力させる必要はなく、既存の二入力から保存形を解決できる。
steeringのroot成果物一覧は現行の一file配置を記述しており、分割配置導入時には表現を追随させる必要がある。

#### 旧linkを案内することと、元の見出しへ到達することは違う

引き渡し入力は参照の保持を要求する。移行時に確認・更新できる参照は、索引または担当範囲本文へ付け替える必要がある。
一方、調査したskill本文と共有handoff契約には、外部に保存された旧URLの転送契約はない。
旧pathへ移転案内を置けばfileを開く導線は残せるが、旧URLの見出しfragmentまで自動転送できるとは言えない。
外部linkの利用頻度と旧pathの残置をどこまで重視するかは、このrepositoryの検索では確定しない利用者の方針である。

task-design/scripts内のdiscussion・canonical・digestという語の検索は一致なしだった。
これは当該文字列の範囲内の結果であり、別名の処理の不在や、plugin全体の互換性を実証する結果ではない。
存在しないsteering/scriptsも一度検索対象へ含めたが、取得失敗を契約不存在の根拠には使わない。
入口方針の判断には読取済みskillと共有契約で足り、scriptの全文分析や他repositoryのlink棚卸しは今回実施しない。

<a id="iteration-0-record-2"></a>

### 判断: 旧pathへ固定の移転案内を残す価値があるか

#### 判断対象・必須条件・根拠

元のroot fileを残さない案と、新しい索引への固定linkだけを旧pathへ残す案を比較する。
必須条件は、論点3の正本配置、短い記録への無変更、参照可能な履歴の保持、新規議論の誤作成防止である。
比較軸はrootに互換fileを増やさない簡潔さと、外部に保存された旧file URLからの到達性である。
どちらの案でも変更時に確認できる参照を新しい正本へ更新し、旧pathへ本文・索引・可変の追記先を複製しない。
根拠は上の入口・caller・旧linkの調査結果と、論点3の配置決定である。
設計議論が分割された直後、同じ二入力で再開する時、旧file URLを開く時、旧見出しfragmentを開く時を検算する。

#### 比較結果と具体case

aは分割後の正本だけを残す。旧root fileはなくなり、同じ二入力での再開は、
共通ownerが元pathと{stem}/{stem}.mdを確認して正本を解決することで成立させる。
変更時に確認できる参照は新しい索引または範囲本文へ付け替える。
外部に保存された旧file URLには案内が残らず、更新できないlinkは切れる。

bは正本とは別に、旧root fileへ新しい索引への固定linkだけを置く。
旧file URLを開いた人は案内を経由して正本へ到達できる。
案内に論点一覧やstatusを写さなければ、通常の追記時に二箇所を同期する必要はない。
反面、分割記録ごとに互換fileが一つ残り、agentはその案内を議論本文と誤認せず、正本へ接続する必要がある。

両案とも、まだ10論点以下の記録には変更しない。
再開時は分割先を確認してから新規作成を判断し、元pathと分割先に実体本文が併存した場合は勝手に一方を選ばない。
存在確認だけで引き継ぎの要否を判断し、catch-upの読取解禁前に索引や案内の本文を読む設計にはしない。
旧見出しfragmentは、bの案内を残すだけでも元の論点へ自動到達する保証がない。
そのため、確認できる見出し付きlinkは両案とも担当範囲本文の該当見出しへ更新する必要がある。

前の調査記録で説明用に示したsteeringの節は、正確には「実装完了後review」である。
同節が二入力でimplementation_review.mdを指定するというfindingは変わらない。

#### 推奨と残る設計

aを推す。既決のdirectory内に索引と本文を揃え、更新可能な参照とcallerを同時に接続すれば、
恒久的なrootの互換fileを増やさずに通常運用を成立させられる。
ただし、外部の旧file URLから辿る導線を残したいならbに実益があり、その優先順位は自力調査では決められない。
今回は旧入口の残置だけを選び、resolverの全case、索引内容、参照棚卸しと移行の時点は後続で設計する。

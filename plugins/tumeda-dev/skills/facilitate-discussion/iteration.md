# 共通イテレーション

[SKILL.md](SKILL.md) で対象fileと論点を解決した後、同じownerが次の手順を実行する。

#### 2.2 新規論点を作るvariant

`2.1`で新しいdecisionと判定した場合だけ入る。新規entryには`templates/discussion_entry.md`を使い、template全文を`SKILL.md`へ複製しない。

1. fileを再読込し、canonical h2とlegacy h3の最大番号を再計算する。新しい番号は最大値+1とし、既存論点がなければ`論点1`とする。
2. `templates/discussion_entry.md`の新規entry骨子を使い、`イテレーション0`を作る。
3. `提案0`には、その回の問いを判断できる内容を書く。完全状態そのものが判断対象の時だけ完全版を示す。`templates/proposal-sections/README.md`を確認し、判断対象に合うpatternがあれば内容に合わせて使い、必要なら組み合わせる。該当patternがなければ内容固有の構成を使う。
4. `提案背景`には、最初のuser input、finding、既存状態を必要な範囲で示し、提案0が満たす必要のある条件と、提案0のどの内容がそれを満たすかを書く。原因追跡、discussion scopeへ属する理由、別decisionとして分けた理由等は、proposalを評価するために必要な時だけ内容固有の見出しや段落で示す。
5. `提案0へのフィードバック`見出しを置き、可視本文は空にする。`未回答`等を表示せず、feedbackを推測しない。
6. childまたは後発parentを作る場合は、論点levelの親子契約を検証する。
7. canonicalな`## 論点N: タイトル`としてfile末尾へ追加する。childを追加した場合だけparent statusを同期する。
8. 保存後にdiscussion file名、論点番号、提案番号または見出し、判断対象をchatで具体的に示し、合意を求める。

review起点の最上位論点では、ユーザーの言葉を提案0の背景へ変更せず保存する。独立したfeedback ledgerや`FB-N`を作らない。一つのfeedbackから複数decisionが生じる場合は、原文と分解自体の実質的なdecisionを持つparentを作り、leafごとにchildへ分ける。複数feedbackが一つのdecisionへ収束する場合は、一つの論点内に複数の原文を保持できる。

新しい一decisionについて、判断可能な提案0、提案背景、空のfeedback見出しがactiveな論点として保存され、具体的な合意確認をchatへ返した時点で、このvariantを抜ける。

#### 2.3 選択した一つの論点を進める

`2.1`で既存論点を選んだ後に入る。論点の現在stateと到着したeventに応じて、このscope内の処理を選ぶ。

##### 2.3.1 feedbackをiterationとして扱う

`2.1`でactiveな既存論点を選び、その論点へのfeedbackを処理するときだけ入る。feedbackを受けた時は、iterationを追加する前に必ずこの分類をやり直す。ここでいう分類は所属論点の判定であり、原因ownerの分類（`2.1.1`）とは別のものである。両方を通る。

###### iterationの入口gate

| feedbackの判定 | 遷移 |
| --- | --- |
| 選択中のactive論点と同じdecisionの原因・提案・検証を変える | 同じ論点へiterationを追記する |
| child・sibling・後発parent・独立論点にあたる別decision | iterationを追加せず、一段上の`2.1 対象論点を選ぶ`へ戻る |
| 選択中の論点が決定済みで、同じdecisionを変更する | `決定済み論点を再開するvariant`へ進む |
| 作成済み論点自体がdiscussion scope外と判明した | iterationを追加せず、`scope外の既存論点を取り下げる`へ進む |
| discussion目的へ影響しない別事項 | activeな論点を作らず、chatでscope外と示す |

このgateはiterationの所属先を決める。skill起動済みという前提やtarget fileの解決を毎回分岐させない。

###### 同じdecisionへiterationを追記する

activeな論点に`再開条件`があり、その条件を満たすevent、evidence、actionを受けた場合は、その結果を新しいiterationの`提案背景`へ接続し、現在stateである`再開条件`を外す。条件が未成立なら、再開したようにiterationを進めない。

1. feedbackを受ける直前の末尾iterationに、対象proposalと同じ番号の`提案Nへのフィードバック`見出しがあり、本文が空であることを確認する。空でなければ同じ評価結果を上書きせず、再開または別decisionへのroutingを判定する。
2. そのfeedback欄へ、固定候補ではなくその回の結果が分かる短い`結果`、必要な原文、原文だけでは分からない評価内容を保存する。proposalと提案背景は変更しない。
3. feedbackがproposalを受諾した場合は、新しいiterationを作らず`2.3.2 合意したdecisionを確定する`へ進む。
4. 同じdecisionの修正が必要なら、番号を一つ増やしたiterationを追加し、`提案N`へ今回の問いを判断できる修正案を書く。既決内容を完全性のためだけに再掲せず、完全状態そのものが判断対象の時だけ完全版を示す。
5. 新しい`提案背景`へ、直前のfeedbackと今回の調査から今回満たす必要が生じた条件、その条件を導いたfindingとその整理、新proposalのどの内容が条件を満たすかを書く。feedback原文と評価結果は直前iterationが所有するため複製しない。原因診断または修正scopeが変わった時は、前の診断の何を維持、置換、拡張したかを読み分けられるようにする。
6. 新proposalと背景に続けて、可視本文が空の`提案Nへのフィードバック`見出しを置く。
7. fileへ保存してから、discussion file名、論点番号、提案番号または見出し、判断対象をchatで具体的に示し、合意を求める。

feedback確定後の過去iteration、却下理由、誤っていた認識は変更・削除せず、`ここまでの議論`等で再要約しない。複数decisionを一つのiterationへ混ぜない。同じdecision scopeの判断可能な修正案、提案背景、空のfeedback見出しが保存された時点で、このprocedureを抜ける。

###### 決定済み論点を再開するvariant

1. feedbackが以前のdecisionと同じscopeを変更することを確認する。別decisionならiterationを追加せず`2.1 対象論点を選ぶ`へ戻る。
2. 以前の決定を現在結論として表示する末尾の`決定`を外し、statusをactiveな状態へ戻す。旧決定に至った過去iterationは変更しない。
3. 新しいiterationの`提案背景`へ、再開させたfeedbackまたはevidence、無効になった判断、置換に必要な条件を保存し、`提案N`へ今回判断する案を書く。
4. 新proposalの末尾へ空のfeedback見出しを置いてから、具体的に合意を求める。

過去iterationを上書きして旧決定へ至った判断を失わせない。再開用iterationとfeedback用iterationを同じfeedbackから二重に作らない。旧判断を履歴に残したまま論点がactiveな合意待ちへ戻った時点で、このvariantを抜ける。


# 内部検討記録: 論点18 — 訂正で前提が変わった別の問いの回答を再評価する

**discussion:** [implementation_review.md](../implementation_review/implementation_review-16-20.md)

**論点:** 論点18

## 開始context

実行安定性レビューの指摘3を、利用者の明示指示で修正する。
訂正の影響を先に評価し、前提が変わった選択だけを未確定へ戻す。独立回答は再確認させない。
本体修正・必要な回帰確認までが今回の範囲。公開・commit・導入や旧論点53の独立整理は含めない。
修正前の実物と内容識別はartifacts/harness-repair-20261025/beforeとbefore-sources.jsonに保存した。

<a id="iteration-0"></a>

## イテレーション0: 既決条件を実行手順へ接続する

<a id="iteration-0-record-1"></a>

### 検証: 指摘の発生条件を本体だけで処理できるか

#### claim・合格条件・方法

変更前の該当契約と実物の欠落を比較し、訂正の影響を先に評価し、前提が変わった選択だけを未確定へ戻す。独立回答は再確認させない。
読取・判断・保存・停止・再開を机上で追い、helperの挙動変更は既存自己testと欠落時／正常時の対照で実行確認する。
形式を満たす文字列の有無だけで合格にしない。結果は取得後に追記する。

#### 本体反映と初回確認

derived-change.mdに、訂正が後続の問いの前提へ与える影響を選択確定前に評価する順序を追加した。iteration.mdの通常応答入口から同じ処理へ接続し、独立回答は通常処理、前提の変わった回答だけを再評価する。

attempt1のCheck 4は判断経路が整合した。ただし保存境界の問題へ依存するため、全体成功へはせず、共通保存境界の修復後にattempt2で依存解消を確認する。

初回の全体結果は[attempt1結果](../artifacts/harness-repair-20261025/test-run-1/result.md)に保存され、failedを成功へ書き換えていない。
再修復3文書以外の9本は初回版と実解決先・SHA-256が一致する。現行の内容識別はsource-at-request-2.json。
追加確認は[attempt2 request](../artifacts/harness-repair-20261025/test-request-2.json)へ渡した。実際の外部引渡し・公開・導入は行っていない。

<a id="iteration-0-record-2"></a>

### 検証: 再修復後の現物と結果を消費する

#### 対象と合格条件

対象は本論点の本体修復と、それが利用する保存・通知経路。
初回・第2回の未達を残した上で、修復した条件が現物へ反映され、最終requestの版と結果の対象版が一致することを確認する。

#### 期待と実際の結果

attempt2は既存fileごとの起点更新とcallback順序を解消したが、新規logをsnapshot取得後に指定へ加える反例が残りfailedだった。
read-discussion.mdの一段落だけを、新規log込みの候補指定でsnapshotを取得・検査し、その指定とsnapshotを組で次起点へ採用する形へ修復した。
attempt3は限定机上照合でpassed。12本の実解決先・SHA-256がrequestと一致し、他11本はattempt2から不変だった。

helperの実測はattempt1の24成功・0失敗・1既存環境依存skipを、不変の本体/testに対して再利用した。
再実行したことにはせず、指示経路は机上照合、DISCUSSION_REAL_DIRECTORY未指定の実在記録testは未検証と区別する。
本論点の修復と対応確認は完了した。全14構造合格・全52分岐証明・元作業全体完了へは広げない。

#### 保存先と返却

[最終の対象確認](../artifacts/harness-repair-20261025/test-run-3/result.md)、
[構造・文書レビュー](../artifacts/harness-repair-20261025/structure-document-review.md)、
[最終内容識別](../artifacts/harness-repair-20261025/source-final.json)へ接続する。
既存のtasklistに本修復の完了を反映し、Phase11以降の未完を残してcallerへ返す。

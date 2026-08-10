### 操作フロー

<!--
動的な視点: 「actorが何かしたとき、何が起きるか」を完成後の状態から記述する。

なぜ必要か:
- mutation名、引数、呼出順序、呼出回数を実装中に決める余地を残さないため。
- 「画面に表示される」「外部URLを保存する」のような結果だけでは、frontendとserverの責務、data変化、再取得が合意できないため。

NG:
「外部URLを受け取って保存する」

ケース選択のMUST:
- 作成だけでなく、今回影響する削除、更新、再取得caseも含める。
  FKを追加した場合は削除時、mutationを追加した場合は影響画面の再取得まで確認する。
- actorが何回tap・click・選択するか分かる粒度で書く。「画面に表示される」で止めない。
- frontend validationはbackendのnullable / required定義と照合する。
- frontendが何を何回呼ぶか、serverで何が起きるか、dataがどう変わるか、actorが何を観測するかを一続きで書く。

失敗・操作中断・境界caseの選択gate:
- 今回の変更で新しく到達可能になるcaseを含める。
- 既存caseでも、停止step、data／system state、actorへの見え方、次に可能な操作のいずれかが変わるなら含める。
- success pathだけでは、今回追加・変更するcallやstateの安全性を一意に判断できないcaseを含める。
- 今回変わらない一般的なnetwork error、全入力値、隣接機能の既存failureを機械的に列挙しない。
- 該当caseがなければ専用blockごと差し込まず、「なし」という空blockを作らない。

owner境界:
- interaction flowはsuccess flowからの分岐、callの到達、data／system state、actorの観測と次の操作を所有する。
- error type、status、payload等のcaller-facing表現はcaller contract、画面の配置・強調・操作可否はscreen、validation rule自体はRequirements、data、caller contract等の正本を参照する。
- 参照のためだけに別outcome sectionを追加せず、実在する正本を参照する。

具体的な記述例:
① ユーザーが外部URLを入力して [インポート] ボタンを押す
② フロントが importDocument({ url: "https://example.com/articles/42" }) を呼ぶ
③ サーバーで DocumentSourceClient.fetchDocument(documentId) → SourceDocument を取得する
④ DocumentRecordBuilder.build(sourceDocument) → 保存用レコードを組み立てる
⑤ DocumentRepository.upsert(record) → データストアへ保存する
⑥ { savedDocumentId } をフロントへ返す
⑦ UI に「保存しました」と表示する

判断基準:
- public call、引数、回数、順序をcodeを読まずに追えるか。
- 各stepのownerと、次stepへ渡す値が一意か。
- 実装者がerror、操作中断、境界条件、再取得をその場で決める余地が残っていないか。
-->

**ケース: {actorの操作名}**

1. {actor}が{tap回数・選択内容を含む具体的な操作}を行う
2. {frontendまたはcaller}が`{mutation / public API}({arg}: {value})`を{回数}回呼ぶ
3. {serverまたは受信owner}が`{Command / function}`を呼び、{主要な責務連携}を行う
4. {repository / external service / state owner}で{dataまたは状態}が{具体値}へ変わる
5. {必要な再取得、通知、後続call}が行われる
6. {actor}が{成功時に観測する表示・返却値・利用可能な操作}を確認できる

**失敗・操作中断・境界case:**

| case | success flowからの分岐 | call・stateへの影響 | actorの観測と次の操作 | 参照するcontract |
| --- | --- | --- | --- | --- |
| {条件} | {step Nの前／途中／後で停止} | {未呼出／呼出済み、data不変／具体的な変化} | {表示・返却と、再試行／修正／戻る等} | {caller contract、data、screen、Requirements等の実在する正本} |

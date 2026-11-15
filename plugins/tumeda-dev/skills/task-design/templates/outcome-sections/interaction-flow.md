### 操作フロー

<!--
動的な視点: 「操作する人が何かした時、何が起きるか」を完成後の状態から書く。

なぜ必要か:
- mutation名、引数、呼び出しの順序、呼び出しの回数を、実装中に決める余地を残さないため。
- 「画面に表示される」「外部URLを保存する」のような結果だけでは、frontendとserverの責務、dataの変化、再取得が合意できないため。

NG:
「外部URLを受け取って保存する」

ケース選択のMUST:
- 作成だけでなく、今回影響する削除、更新、再取得のcaseも含める。
  FKを追加した場合は削除時、mutationを追加した場合は影響する画面の再取得まで確認する。
- 操作する人が何回tap・click・選択するか分かる粒度で書く。「画面に表示される」で止めない。
- frontendの入力checkは、backendのnullable / requiredの定義と照合する。
- frontendが何を何回呼ぶか、serverで何が起きるか、dataがどう変わるか、操作する人に何が見えるかを一続きで書く。

失敗・操作中断・境界caseを書く条件:
- 今回の変更で新しく起こりうるようになるcaseを含める。
- 既存のcaseでも、止まる段階、dataやsystemの状態、操作する人への見え方、次にできる操作のどれかが変わるなら含める。
- 成功時の流れだけでは、今回追加・変更する呼び出しや状態の安全性を一意に判断できないcaseを含める。
- 今回変わらない一般的なnetwork error、全ての入力値、隣の機能の既存の失敗を機械的に並べない。
- 該当するcaseがなければ専用の欄ごと差し込まず、「なし」という空の欄を作らない。

このsectionに書くこと・書かないこと:
- このsectionには、成功時の流れから分かれる点、呼び出しがどこまで届くか、dataやsystemの状態、操作する人に見えることと次の操作を書く。
- error type、status、payload等の呼び出し元から見える表し方は`caller-contracts.md`、画面の配置・強調・操作できるかどうかは`screen.md`に書く。入力checkの決まりそのものは、要件、`data.md`、`caller-contracts.md`等の、それを正として書いた箇所を参照する。
- 参照のためだけに別の完成後の姿のsectionを足さず、実在する記述を参照する。

具体的な記述例:
① ユーザーが外部URLを入力して [インポート] ボタンを押す
② フロントが importDocument({ url: "https://example.com/articles/42" }) を呼ぶ
③ サーバーで DocumentSourceClient.fetchDocument(documentId) → SourceDocument を取得する
④ DocumentRecordBuilder.build(sourceDocument) → 保存用レコードを組み立てる
⑤ DocumentRepository.upsert(record) → データストアへ保存する
⑥ { savedDocumentId } をフロントへ返す
⑦ UI に「保存しました」と表示する

判断基準:
- 公開された呼び出し、引数、回数、順序をcodeを読まずに追えるか。
- 各stepを誰（人、server、componentのどれ）が受け持つかと、次のstepへ渡す値が一意か。
- 実装者がerror、操作中断、境界条件、再取得をその場で決める余地が残っていないか。
-->

**ケース: {操作する人の操作名}**

1. {操作する人}が{tapの回数・選択内容を含む具体的な操作}を行う
2. {frontendまたは呼び出し元}が`{mutation / public API}({arg}: {value})`を{回数}回呼ぶ
3. {serverまたは受け取るcomponent}が`{Command / function}`を呼び、{主な責務の連携}を行う
4. {repository / external service / 状態を持つcomponent}で{dataまたは状態}が{具体値}へ変わる
5. {必要な再取得、通知、後続の呼び出し}が行われる
6. {操作する人}が{成功時に見える表示・返り値・できるようになる操作}を確認できる

**失敗・操作中断・境界case:**

| case | 成功時の流れから分かれる点 | 呼び出しと状態への影響 | 操作する人に見えることと次の操作 | 関係する呼び出し方 |
| --- | --- | --- | --- | --- |
| {条件} | {step Nの前／途中／後で停止} | {未呼び出し／呼び出し済み、dataは変わらない／具体的な変化} | {表示・返り値と、再試行／修正／戻る等} | {`caller-contracts.md`、`data.md`、`screen.md`、要件等の実在する記述} |

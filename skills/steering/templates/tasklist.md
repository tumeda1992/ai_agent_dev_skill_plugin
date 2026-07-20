# タスクリスト

各task完了時に、その場で`[ ]`を`[x]`へ更新する。利用者動作確認が終わるまで、commit・push・PR作成を実行しない。

## フェーズN: {利用者操作または独立状態}

### DoD

{利用者が一つの操作で確認できる完成状態}

- [ ] {実装task}
- [ ] {変更した挙動を担保するtest作成/変更}
- [ ] {test実行または、実行できない理由}
- [ ] {UI影響がある時だけvisual-inspectorによる確認}

## 動作確認

- [ ] 利用者に動作確認を依頼する
- [ ] feedbackがあれば`implementation_review.md`へ原文を記録する
- [ ] feedbackがなければ、その旨を記録する

## 完了後action

<!-- `steering/GitHub`がavailableの時だけ以下を生成する。無い時はsummary更新だけ。 -->

- [ ] GitHub preflight
- [ ] 意味単位でcommit
- [ ] current branchをpush
- [ ] adapterで既存PRを取得またはPR作成
- [ ] summaryを完了へ更新

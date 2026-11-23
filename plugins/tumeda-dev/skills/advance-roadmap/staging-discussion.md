# 段取りの議論（discussion.md）

`advance-roadmap`と、`tasklist-executor`を起動する側（[`caller-contract.md`](../tasklist-executor/caller-contract.md)の「段取りの議論」）が読む。以下の「このskill」は`advance-roadmap`を指す。

`tasklist-executor`を起動する側は、次のとおり読み替える。

- 「このskill」は起動する側自身、`roadmap.md`は`tasklist.md`と読む。
- 子phaseのtask-design起動の前後で始めどきを分ける条件は、`advance-roadmap`だけに当てはまる。`tasklist-executor`を起動する側は、`caller-contract.md`の「段取りの議論」の条件で始める。
- 「子phaseの結果」は「executorが止まって返った結果」と読む。

`advance-roadmap`がphaseの中で`tasklist-executor`を起動した時の段取りの議論は、`caller-contract.md`のとおり、`tasklist.md`がある設計の記録の`discussion.md`へ置く。

`discussion.md`は特定phaseへ縛らず、子phaseのtask-design起動後に記録価値のある段取り上の思考が生じた時に随時追記する。ユーザーが段取り上の論点・質問・要議論を提起した場合、またはこのskill自身の段取り上の判断についてユーザーへ問いを出そうとしている場合に通常discussionを開始する。往復回数の予測、assistantが既に結論を持っているか、論点が選択肢へ畳めるかは、開始しない理由にならない。子phaseのtask-design起動前には開始しない。設計上の曖昧さや方向性はtask-designへ渡し、task-design固有の議論として扱う。

議論開始後はこのskill自身が次を渡してpluginの`facilitate-discussion` skillを明示適用し、議論だけを別child agentへ再委譲しない。

```text
discussion_directory=<roadmap.mdがある設計の記録のdirectory>
```

discussion fileの解決、entry形式、合意対象保存、採番、親子validation、feedback routing、履歴と現在状態の更新は`facilitate-discussion`が所有する。このskill内へtemplate全文、採番、feedback iteration、原因追跡、種別等の内部processを複製しない。決定後はこのskillがdesign、plan、調査、文書改善review等の適切なphaseへ戻す。

主な用途:

- 段取り中に生じた疑問・背景: designやplanへ入らないが捨てない思考
- 子phaseの結果の後の進行判断: 進み具合、起動、再開位置について複数往復で検討した過程
- design、investigation、plan、implementation reviewのいずれにも属さないこぼれ話

`investigation.md`は、事実を集めなければ設計方針が決まらない時のfact収集logである。`discussion.md`は、どう考えたかという推論・議論のlogであり、目的、確認方法、実測結果を持つ調査の正本にしない。

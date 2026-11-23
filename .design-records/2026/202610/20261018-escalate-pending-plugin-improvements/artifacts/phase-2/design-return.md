# task-designへの差戻し

停止理由: blocked（合意済みscope外の構造整理に設計判断が必要）。

Phase 1は全checkboxとDoDが確定済み。Phase 2の最初のtaskから未着手であり、本体・source・fixture・既存議論を編集していない。未完了を取消完了にしない。

差戻し対象はsteeringのBlocker resolutionの配置。根拠・解消方向・保持contractはpreimplementation-structure-review.mdとblocker-preservation-contracts.json。新skillの構造判定を緩めたり、steeringの未変更処理を対象外にしたりして回避しない。

Phase 2の準備として、議論保存/読取の詳細、旧handler・iteration・回復・template、handoff契約と回帰script、steering実物を調査した。現行の二層ledgerとbaselineは維持している。親から、synthetic fixtureに加えて同じ作業の実在52論点の分割記録をread-onlyでcheck/current/full/snapshotへ使う指示を受領済み。移行や自動修復には使わず、source不変・取得不能・needs_full_readを確認する条件を保持する。

新しいchild request/resultのpendingはない。直近のphase-1-callers-validation-2/attempt2/passedは消費済み。再開は設計/planの再合意と開始条件を親が渡した後、Phase 2の最初の未完了から行う。

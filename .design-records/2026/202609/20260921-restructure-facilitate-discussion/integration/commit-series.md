# Commit系列と最終検証

承認済みの22分割計画に従い、固定baseline `a6e24853800fcb75eb6a7bdd91479a633f740d4a` から履歴を作成した。
branchは `20260921-restructure-facilitate-discussion` とし、`main` への直接commit、push、PR作成は行わない。
元worktreeの完成形をsnapshotへ保全し、隔離worktreeで中間版を構成した。完成形の意味を変更するための再設計ではない。

## 分割と検査の対応

設計・合意、baseline・ledger、prototypeを先に記録し、次に実行fileの抽出と各進化を載せる。
二層化とcaller・catch-up・digestは同じcommitへ収め、思考標準三件、検証補助、version、適用完了をそれぞれ分ける。
versionは21本目だけで宣言4箇所と検査期待値1箇所を `8.0.2` へ揃える。中間commit単独をreleaseしない。

1. `8776292` — 再構成の目的・設計・合意を記録する
2. `3957cbc` — 移行baselineと旧契約の対応表を固定する
3. `857dd61` — prototype・比較案・レビュー結果を保存する
4. `db7a8a0` — 共通iterationを独立fileへ抽出する
5. `b9a356d` — 記録回復をhandlerから分離する
6. `28206e2` — entry templateから適用制御を実行fileへ移す
7. `8bdee5b` — 保存見出しへ論点・回の所属を明示する
8. `facc246` — 判断材料確認と認識合わせの提示・応答を導入する
9. `758834f` — discussionと内部logの二層保存を導入する
10. `be13a0f` — 内部検討の六用途formatと共通入口を追加する
11. `f89de9b` — 入力保存→実施→結果保存→再判定の内部loopを接続する
12. `6876fec` — discussion背景と内部logの独立可読性を規定する
13. `49ec5ee` — 二層の保存境界からの中断復帰を整える
14. `f808794` — 表示patternの理解共有と正式な認識合わせを区別する
15. `c11e2ee` — origin-reviewを共通の検討記録手順へ接続する
16. `dee3c02` — 独立decisionの判定を「別の問いへの結論」で行う
17. `79498a2` — 思考標準の場面名を「〜とき」に統一する
18. `c5610be` — 選択肢標準の補助二見出しを明示する
19. `6949d27` — 思考標準の維持規律を具体化する
20. `1216634` — 移行検証補助のHEAD依存を整理する
21. `0efab1e` — plugin versionを8.0.2へ更新する
22. 本番移行証拠・検証結果・適用完了を記録する（この記録を含むcommit）

[各commitの実測結果](commit-validation/per-commit-checks.json) は、1〜21本目のrevision、command、exit codeと出力を持つ。
各段階でplugin validator、handoff test、`git diff --check` を実行し、本番skillのrelative Markdown参照先の存在も確認した。
これらの静的検査を、各中間版の全潜在経路の動作保証とは扱わない。最終本文の全量対応は既存ledgerとproduction投影の検査が担う。

各段階の `git diff --check` は当時のworktree差分が対象であり、未追跡fileの全内容までは検査していない。
commit後に系列全体へ同じ検査を適用すると、`plugins/`・`scripts/`・`.claude-plugin/` の本番範囲はexit 0、記録を含む全範囲はexit 2となった。
警告は13行で、discussionに保存したunified diffの空context行11行と、出力が無い二つのraw logの末尾空行だけである。
前者の空白はdiffの構文として必要であり、後者も取得時の記録を保持するため、そのまま残した。
この全範囲の結果を、上のworktree検査や本番範囲の成功へ読み替えない。

## 独立最終検査と修正

[attempt 1](commit-validation/attempt-1/result.md) は4成功・2失敗だった。
保存形を中間版から組み立てる処理が承認済み本文の先頭空行を落とし、許可投影の全文一致検査で停止した。
空行除去を新しい許可へ加えず、生成処理を直して完成形とbyte単位で一致させた。
またreconcile-ledgerは、prototype比較用の旧sourceを反映後productionから読んでいた。
固定baselineを一時fileへ復元してprototypeとの差分を取得するように変更し、production-KEEPのbaseline一致guardは維持した。
実production本文の許可投影との一致はproject-production-evidenceが検査する。旧source・auditを再生成して不一致を消すことはしていない。

修正は未公開の一時履歴の担当commitへ収めた。初回失敗はそのまま保持し、同じ6commandを別attemptで再実行した。
[attempt 2](commit-validation/attempt-2/result.md) は6件すべてexit 0となった。

- plugin validatorとtask-design handoff test
- 固定baselineとprototypeのledger照合: source686、entry114、追加306、pending 0、unlinked 0
- productionの許可投影と実diff: 適合756、合意追加306、合意変更44、errors 0
- 補助21fileの期待全文と限定frontmatter検査
- `git diff --check`

公式quick_validateのPyYAML不足は既存のblockedとして残る。今回の6件成功へ混ぜず、全agent経路の動作保証にも広げない。

## 共有記録と最終完成形

元の `.local.md` はlocalに保持し、公開repository内の設計過程だけを共有用の通常fileへ複製した。
共有文書のlinkは複製先へ接続し、移管元repositoryの非公開handoffはtracking対象へ加えていない。
本番成果物36fileは保全した承認済み完成形と一致する。検証補助の固定baseline化、共有link、commit許可と検証結果の記録だけをcommit準備として追加した。
document-reviewの作成時・更新時観点を適用し、検証の成功・失敗・未実測、旧能力の保持、commitと公開操作の許可範囲を区別した。

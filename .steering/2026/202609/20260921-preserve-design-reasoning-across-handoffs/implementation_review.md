# 議論記録

## 論点1: behavior smokeで得た知見の保存先

**ステータス:** 決定

**種別:** レビュー指摘

### イテレーション0: README追記候補を評価する

#### 提案0

repository rootの`README.md`に、agent behavior smokeの再発防止として次の二点を追記する。

- 期待値はcontractで定義済みの観測可能な意味条件を検証し、未定義のstatus literalを固定しない。
- 同一contractの複数caseでprocess isolation自体が受け入れ条件でなければ、fixtureを分離しつつ単一fresh agent processを使い、skillとcontextの重複読込を避ける。process分離を検証するcaseだけ別processにする。

#### 提案背景

この記録は、Phase 4完了後の`doc-enricher`提案と、その後のユーザー判断を保存し忘れていたことへ気づいたために作成した事後記録である。

Phase 3 attempt 1では、handoff contractが規定していないstatus literalをsmokeの期待値へ固定したため、本質的な停止条件を満たしていてもfailureになった。また、四caseを四つのfresh processへ分け、各processがlocal `task-design`と関連contextを完全に読み直したため、利用上限へ到達して二caseを実行できなかった。

attempt 2では、status literalではなくignore不成立、attempt未作成、canonical本文未読という意味条件へ検査を変更した。四fixtureの分離は維持しつつ、一つのfresh processで全caseを処理した結果、10/10 checksがpassした。この差分から、上記二点をrepository横断で再利用できる検証知識としてREADMEへ保存する案が生じた。

#### 提案0へのフィードバック

**結果:** READMEへは反映せず、提案が生じた経緯と判断をdiscussionへ保存する

> ok。readmeの修正は、経緯覚えておきたいからdisscussionに書いておいて

ユーザーは変更後contractとsmoke結果の動作確認を承認した。README追記案については規範として反映するのでなく、なぜ案が生じ、なぜ採用しなかったかを後から追えるよう、このdiscussionに保存する判断を示した。

### 決定

repository rootの`README.md`は変更しない。

Phase 3 attempt 1からattempt 2へ至った次の知見は、今回の実装reviewで生じた経緯としてこのdiscussionに保持する。

- behavior smokeでは、contractに定義されていないstatus literalを受け入れ条件にしない。観測可能な意味条件で判定する。
- process isolation自体が受け入れ条件でない複数caseでは、fixture分離とagent process分離を同一視しない。今回の再試験ではfixtureを分離し、単一fresh processで重複context読込を避けた。

これらはrepository全体へ適用する新しい規範として確定していない。将来READMEまたはdocsへ一般則として昇格させる場合は、この論点を起点に改めて適用範囲と反例を検証する。

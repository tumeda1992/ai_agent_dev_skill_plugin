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

### イテレーション1: README追記を承認する

#### 提案1

repository rootの`README.md`にある「変更時の検証と前提」へ、提案0の二点をagent behavior smokeの検証規則として追記する。

- 期待値はcontractで定義済みの観測可能な意味条件を検証し、未定義のstatus literalを固定しない。
- 同一contractの複数caseでprocess isolation自体が受け入れ条件でなければ、fixtureを分離しつつ単一fresh agent processを使い、skillとcontextの重複読込を避ける。process分離を検証するcaseだけ別processにする。

#### 提案背景

イテレーション0では、知見をdiscussionだけに残してREADMEを変更しない決定となった。その後、ユーザーからREADME更新を許可するfeedbackがあり、保存先の判断が変わった。

discussionはproposalが生じた経緯と判断の変遷を保持する。READMEは将来のbehavior smokeで直接使う現在有効な検証規則だけを持つ。両者をこの役割で分ければ、経緯を失わず、次の実行者が同じ失敗を避けられる。

#### 提案1へのフィードバック

**結果:** README追記を承認

> readme更新して良いよ。pushもマージもして良い

### 決定

Phase 3 attempt 1からattempt 2へ至った経緯と保存先判断の変遷は、このdiscussionに保持する。そのうえで、現在有効な次の検証規則をrepository rootの`README.md`「変更時の検証と前提」へ反映する。

- behavior smokeでは、contractに定義されていないstatus literalを受け入れ条件にしない。観測可能な意味条件で判定する。
- process isolation自体が受け入れ条件でない複数caseでは、fixture分離とagent process分離を同一視しない。fixtureを分離したまま単一fresh processを使い、重複context読込を避ける。process分離を検証するcaseだけ別processにする。

READMEの反映後にvalidatorとdiff checkを再実行し、feature branchのpushと`main`へのmergeを進める。

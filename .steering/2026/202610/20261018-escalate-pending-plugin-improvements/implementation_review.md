# 実装review

## 既存合意の反映: skill構造判定の一般条件

直接受領したexecutorがfacilitate-discussionを明示適用して保存する。新たな採否を決めるものではなく、design-details/skill-update-review.mdの既存合意と実物を一対一で照合した適用記録である。未提示案へのokや新しい利用者の合意は作らない。

### 受領したreview

> 新設3指示の現物を読んだ。設計の一般判定で明示していた2条件が薄く見えるので、構造案/設計との差として確認してほしい。(1)固有の判断・状態・完了条件と独立改訂/検証を持つ工程は、混線実績がなくても一fileへ抱え込むなら不合格。(2)別skill独立には現在の単独利用・他callerの具体要求が必要、将来予測だけでは独立させない。現物は復旧の具体例や『判断から決める』に留まり、(2)は明示を見つけられなかった。合意済み設計の条件を保持する範囲で全文と照合し、欠落なら既存担当として修復・記録してから独立検証へ。新しい設計判断や毎回の別agent reviewを追加する意図はない。

### 原因と知識の所在

具体例を残しただけでは一般判定の強度・境界を保持できない。原因ownerは今回の成果物であり、共有された設計には一般条件が既に存在する。repository知識や恒久skill規範の新しい不足へ広げない。

executorの設計全文との再照合でも同じ不足を確認したため、review受領時点ではassess-structure.mdへ一般条件を既に補っていた。混線の実績を要しない不合格、内部指示の読む条件・状態・返却、現在の外部利用要求と別skill独立、既存の未編集不合格も解消する条件を実物へ保持した。原文の意味を設計より弱めない修復であり、構造案・planの再設計は行っていない。

### 結果と限界

新skillのdocument-reviewは指摘なし。根拠と内容識別はartifacts/phase-1/document-review-new-skill.md。独立した挙動検証requestはphase-1-skill-update-review-behavior-1でpending。文書の照合を挙動検証の通過には扱わない。

doc-enricherを提案modeで適用し、既存README・設計・migration規範と照合した。一般条件を具体例だけへ薄めない規律は既にfunction_migration_policy.mdにある。今回の作業への具体的反映はこの記録で辿れ、別の恒久文書へ重複提案する候補はない。READMEへの追加承認待ちはない。

## 検証前提の不足: skill-creator公式validatorのPyYAML

executorがtest-runnerのattempt 1を直接受領し、facilitate-discussionの既存合意の機械的適用として記録する。新しい設計decisionはない。

> ModuleNotFoundError: No module named 'yaml'

behaviorは12件passed、構文検証は公式quick_validate.pyのimportで終了した。検査対象の構文不良やcommand拒否ではなく、起動したPythonに必要依存がないという環境前提の不足である。原因を確かめるため公式script全文と既存package cacheのmetadataを読んだ。新しい恒久skill規範の不足として扱わない。

合意済みの検証を実行できるよう、既存cacheのPyYAML 6.0.3を配布RECORD照合後、隔離tmp venvへ用意した。グローバル設定、外部skill、対象skill、fixtureは変更していない。準備の確認と公式validatorの通過を区別し、attempt 1のblockedは保存したままにする。

証跡はartifacts/phase-1/validation-environment.md。独立挙動観測と現物の集合・hash・解決先が不変であることを再照合し、behavior-request-attempt-2.jsonへ引き継いだ。attempt 2のresultを受領するまで検証taskは未完とする。

doc-enricherの候補判定では、この環境の配置・版は調査snapshotに属し、6か月後の安定した設計知識ではないためDROPした。新たなREADME提案や承認待ちはない。

## 構文修復: descriptionのYAML継続行

直接受領したattempt 2はfailedであり、独立挙動12件のpassedを全体合格へ読み替えない。原因はexecutorの長行改行処理がYAML scalarのindentを壊したことである。文書reviewの指摘なしは履歴として保持し、構文失敗・局所修復・再reviewへ接続した。

修正内容はdescriptionをfolded scalarへ直すことだけで、合意済みの説明・本文・依存・file集合を保持した。新しいYAML metadataにも同じ処理が入っていないことを確認した。詳細はartifacts/phase-1/document-review-frontmatter-fix.mdとfrontmatter-fix.diff。旧観測の再利用条件と公式validator/UI metadata再検証をattempt 3 requestへ記録した。

この不良は新たな構造案や要件変更を要しない成果物の構文不良である。一般の『対象形式の構文を保持する』以上の恒久知識はなく、doc-enricherの非自明性条件を満たす追加提案はない。

## 保存先誤りと、実物読取を欠いたreviewの是正

executorがvalidation-run-1のfailedと親reviewを直接受領し、facilitate-discussionの既存合意への適合修復として記録する。

> template実物の先頭が能力migration ledgerとなっており、保存内容の不整合が直接根拠。旧guardは変更せず、編集担当の復旧と再検証が必要。

根本原因はledger保存先とloop変数の共有である。さらに生成したはずの本文に依存してreviewし、実物のtemplateを読まずにhash集合を記録したため、既存review規則が求める実物確認を満たさなかった。規範の知識は既存skillにあり、今回の成果物・実行の不備である。

破損版を保存した後、誤出力内の原文A1行から22行templateを復元し、既存独立観測のhashと一致させた。予定ledger出力は正しい作業記録へ保存した。保存先は役割ごとの不変変数へ分け、loop変数を再利用しない局所修復を行った。失効reviewとcheckbox差戻しを記録し、実物の全文再読・文書/構造review・最終集合と内容識別をfinal-structure-review.md、final-document-review.md、final-review-identifiers.jsonへ保存した。

構造や利用者要件を変更する修復ではなく、guardも弱めていない。doc-enricherで候補を判定したが、『実物の読取をhashや記憶で代替しない』は既存skillの明示規則であり、今回の具体的な失敗はこの実装reviewで追跡する。新しい恒久知識の追加提案はない。

## Phase 2着手前の構造reviewから設計へ返す事項

executorがskill-update-reviewを明示適用し、更新対象steeringの未変更処理を含む全体を確認した。Blocker resolutionが固有の成立判定・承認・復旧・回復確認・再開・完了と独立した改訂/検証を持ちながら、同じSKILL.mdへ置かれているため不合格とした。根拠はartifacts/phase-2/preimplementation-structure-review.md。

これは新しい汎用判定基準の不足ではなく、合意済みの全体構造reviewを既存対象へ適用した結果である。現行designが定める議論読取接続だけでは内部指示分割の完成構成・差分を確定できないため、具体的な変更案と合意を同じ作業のtask-designへ返す。本体編集やplanの勝手な変更、未解消の除外は行っていない。

既存contractの原文・理由・強度を保持し、現行の承認と停止・再開・checkbox ownerを変更しないことを差戻し材料へ含めた。未合意の整理を実装済み/決定済みにはしていない。

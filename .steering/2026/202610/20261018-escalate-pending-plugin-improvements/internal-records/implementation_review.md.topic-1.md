# 内部検討記録: 論点1 — 構造reviewの一般条件が実装で弱まった

**discussion:** [implementation_review.md](../implementation_review/implementation_review.md)

**論点:** 論点1

## 開始context

旧記録の一般条件の不足を、合意済み設計との照合で補った。
assess-structure.mdへ、独立工程の判定、内部分割の受渡し、現在の具体要求による別skill化を明記した。

<a id="iteration-0"></a>

## イテレーション0: 旧記録からの事後回復

<a id="iteration-0-record-1"></a>

### 診断: 過去の記録と現在の保存結果を区別する

旧fileはcommit 1259528とartifacts/record-recovery-20261025/に保存した。
以下は旧記録に実際にあった経過であり、今回新たに調査・実施した履歴とは扱わない。
過去の「読んだ」「適用した」という記述自体を、その実行の独立した証明とも扱わない。

#### 当時保存されていた経過

直接受領したexecutorがfacilitate-discussionを明示適用して保存する。新たな採否を決めるものではなく、design-details/skill-update-review.mdの既存合意と実物を一対一で照合した適用記録である。未提示案へのokや新しい利用者の合意は作らない。

### 受領したreview

> 新設3指示の現物を読んだ。設計の一般判定で明示していた2条件が薄く見えるので、構造案/設計との差として確認してほしい。(1)固有の判断・状態・完了条件と独立改訂/検証を持つ工程は、混線実績がなくても一fileへ抱え込むなら不合格。(2)別skill独立には現在の単独利用・他callerの具体要求が必要、将来予測だけでは独立させない。現物は復旧の具体例や『判断から決める』に留まり、(2)は明示を見つけられなかった。合意済み設計の条件を保持する範囲で全文と照合し、欠落なら既存担当として修復・記録してから独立検証へ。新しい設計判断や毎回の別agent reviewを追加する意図はない。

### 原因と知識の所在

具体例を残しただけでは一般判定の強度・境界を保持できない。原因ownerは今回の成果物であり、共有された設計には一般条件が既に存在する。repository知識や恒久skill規範の新しい不足へ広げない。

executorの設計全文との再照合でも同じ不足を確認したため、review受領時点ではassess-structure.mdへ一般条件を既に補っていた。混線の実績を要しない不合格、内部指示の読む条件・状態・返却、現在の外部利用要求と別skill独立、既存の未編集不合格も解消する条件を実物へ保持した。原文の意味を設計より弱めない修復であり、構造案・planの再設計は行っていない。

### 結果と限界

新skillのdocument-reviewは指摘なし。根拠と内容識別はartifacts/phase-1/document-review-new-skill.md。独立した挙動検証requestはphase-1-skill-update-review-behavior-1でpending。文書の照合を挙動検証の通過には扱わない。

doc-enricherを提案modeで適用し、既存README・設計・migration規範と照合した。一般条件を具体例だけへ薄めない規律は既にfunction_migration_policy.mdにある。今回の作業への具体的反映はこの記録で辿れ、別の恒久文書へ重複提案する候補はない。READMEへの追加承認待ちはない。

#### 今回の接続と限界

後発の保存結果: phase-1-skill-update-review-behavior-3 / attempt 3 / passed。
新しい機能検証は実行していない。保存済み結果への接続と記録先の修正である。

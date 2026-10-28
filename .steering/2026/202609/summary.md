# 2026年09月 Steering サマリー

## [20260903-remove-steering-effort-model-directives](./20260903-remove-steering-effort-model-directives/)

**概要:** `plugins/tumeda-dev/skills/steering/SKILL.md` のfrontmatterにある `model: sonnet` と `effort: high` は、hostのdefault modelがSonnetだった時代に、default運用を明示し `task-design` だけをOpusへ上げる差分を成立させるために置かれた宣言である。当時は意図どおり機能していた。defaultがOpusへ移った現在、同じ宣言は効く経路ではdefaultから下げる指定として働き、効かない経路では「Sonnet前提のskill」という実態と食い違う契約を読ませる。当初の目的を果たさず制約としてだけ残っているため外す。

**ステータス:** 完了

---

## [20260905-absorb-document-review-skill](./20260905-absorb-document-review-skill/)

**概要:** 利用先 repository で md 成果物の emit 前ゲートとして運用している `document-review` を、この plugin へ取り込む。plugin には現在この位置づけの skill が無く、`doc-enricher` は既存 README への追記提案を担うが md 成果物一般の品質ゲートは担っていない。doc を書く skill が増えるほど、品質基準を各自が持つことになる。

**ステータス:** 未完了

---

## [20260909-apply-infrastructure-steering-feedback](./20260909-apply-infrastructure-steering-feedback/)

**概要:** このpluginは、利用先の作業で表面化した四つの欠落をまだ持っている。designの受け入れ基準が「動くこと」だけで運用の引き継ぎを見ていないこと、実行しなければ確定しない論点を机上で決めさせ続けること、hookの注入文面がskill未起動を正常に見せること、そしてこのrepositoryが自身を文脈なく「正本」と名乗ることである。この四つを、それぞれ規範・進行契約・注入文面・用語として直す。終了時には、infrastructure構築を含むsteeringが運用の引き継ぎを受け入れ基準として持ち、実行して初めて確定する論点を後の段階へ回す判断基準が進行契約に載り、hookの注入が自身を要約と名乗り、このrepositoryが自身を相対語で呼ばない状態になる。

**ステータス:** 未完了

---

## [20260910-add-publish-branch-diff-skill](./20260910-add-publish-branch-diff-skill/)

**概要:** 作業中の branch の内容を、依頼者が GitHub 上で読める状態にする手段が skill として存在しない。現状は commit、push、PR 作成を毎回その場で組み立てており、commit が無い場合や PR が既にある場合の扱いも都度判断になっている。`share-work-in-progress` は「今いる branch の内容が GitHub 上で見える」という結果を一つの起動で成立させる。終了時には、skill 本体と、二つの skill が共用する PR 作成 script の配置が揃う。

**ステータス:** 未完了

---

## [20260911-make-skill-references-and-conditions-explicit](./20260911-make-skill-references-and-conditions-explicit/)

**概要:** 4 件はどれも個別 skill の機能不足ではなく、**skill が依拠している参照先と条件を、skill 自身から辿れない**という同じ形の不備である。読み手である agent は、条件文の空白を自分の推測で埋め、存在する標準を想起できず、存在しない blocker を作った。

**ステータス:** 未完了

---

## [20260913-add-naming-process-standards](./20260913-add-naming-process-standards/)

**概要:** 既存の `naming/` は「どういう名前が良いか」の判断基準を持つが、「良い名前へどう辿り着くか」を持たない。そのため命名が詰まったとき、assistantは場当たりに案を出しては落とすことを繰り返し、13イテレーションを要した。

**ステータス:** 完了

---

## [20260913-detect-rushed-design-decisions](./20260913-detect-rushed-design-decisions/)

**概要:** 設計を急ぐ衝動が構造の選択を歪める二つの失敗が実際に起き、既存の`task-design`はどちらも検知できなかった。一つ目はWHYの記述はあるが合意がない状態で下位へ進む失敗、二つ目は分割可能性を検証せずに対象を区間へ切る失敗である。既存の違反シグナルは前者を「WHYが欠けている」形でしか検出せず、後者に対応する記述を持たない。この作業の終了時、どちらの失敗も実行中のagentが自己診断でき、相手から引き出すべき情報を自分の推論で埋めた時点で止まる状態になる。

**ステータス:** 完了

---

## [20260919-add-confidentiality-standard-and-fix-state-notation](./20260919-add-confidentiality-standard-and-fix-state-notation/)

**概要:** `document-review` は md を emit する前のゲートでありながら、「書いてはいけないものが入っていないか」を見る観点を持たない。機密情報の標準を `documentation_standards/` へ設け、観点として `document-review` へ組み込む。

**ステータス:** 不明

---

## [20260921-apply-escalated-skill-fixes](./20260921-apply-escalated-skill-fixes/)

**概要:** 利用先 repository での実作業から、この plugin の skill が持つ穴が見つかった。引き渡し時点で 5 件、作業中に 1 件が加わり 6 件である。いずれも「skill の記述が足りていたのに守らなかった」ではなく、**skill の記述自体に判断の段が無い**ことに起因する。放置すると同じ誤りが利用先を問わず再発し、特に提案4 は既定 branch への merge が本番適用を起こす repository で事故へ直結する。

**ステータス:** 完了

---

## [20260921-concretize-verification-dod](./20260921-concretize-verification-dod/)

**概要:** 動作確認の DoD は「何を変更し、何を観測できれば満たすか」で書く。書けない場合は、実行前に提案して合意する段を通る。

**ステータス:** 不明

---

## [20260921-escalate-at-proposal-time](./20260921-escalate-at-proposal-time/)

**概要:** escalate のために session を新規作成しない。修正後の skill で動きたい場合は resume する。resume なら context を保ったまま skill が読み直される。

**ステータス:** 不明

---

## [20260921-guard-premature-decisions](./20260921-guard-premature-decisions/)

**概要:** 提案を出す側が自信を持っているとき、既存の思考標準はどれも発火しない。`choosing_between_options.md` は選べないと感じたときに、`presenting_options.md` の補助は畳めた後の記録判断に効く。**自信を持って畳んだ提案が、実は前提を疑っていない**という場面を覆う記述が無い。

**ステータス:** 不明

---

## [20260921-keep-branch-pr-issue-correspondence](./20260921-keep-branch-pr-issue-correspondence/)

**概要:** merge は branch と issue の終了を意味する。この対応を保つため、検証のための merge には別の経路を用意する。

**ステータス:** 不明

---

## [20260921-preserve-design-reasoning-across-handoffs](./20260921-preserve-design-reasoning-across-handoffs/)

**概要:** 引き継ぎ失敗の原因は情報不足だけではない。正本を最初に読むと、後任は既存の切り分けと結論を前提として受け取り、自分でTBD全体を構成したかのように錯覚できる。

**ステータス:** 未完了

---

## [20260921-restructure-facilitate-discussion](./20260921-restructure-facilitate-discussion/)

**概要:** 提案を作る前に判断材料が枯れているかを確かめ、提案を出せない段階では認識合わせとして議論を進められるようにする。 この進化を現行構造へ載せようとした際、最も頻繁に回すイテレーションの共通動作が新規・継続・再開の箇条書きへ分散しており、標準参照の置き場を複数案試しても収束しなかった。 移行前の約400行の `SKILL.md` も、問題の発見と構造の変更を難しくしていた。 今回と以後の進化を載せられる構造へrefactoringし、明示した意味変更以外の既存能力は全量保存する。

**ステータス:** 不明

---

## [20260921-scope-proposal-background](./20260921-scope-proposal-background/)

**概要:** `提案背景` の定義が iteration 側で「直前の feedback から生じた条件」に限定されているため、提案へ至った調査結果と思考記録の置き場が無く、`提案N` へ流れ込んで判断対象を曖昧にしている。定義へ「提案自体の背景」を含め、イテレーション背景は `提案N-1へのフィードバック` が持つことを明示する。

**ステータス:** 完了

---

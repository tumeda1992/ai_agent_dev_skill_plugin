# 内部検討記録: 論点8 — escalate-plugin-skill-fix の取り込みの節と、context の Git 運用の記述をどうそろえるか

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点8

## 開始context

steering の `discussion.md` 論点2 で、利用者が「a」（この作業で直す。task-design の論点8 として設計する）を選んだ（2026-10-31）。
案を作る前に、二つの記述の出どころを確かめた。

<a id="iteration-0"></a>

## イテレーション0: 取り込みに PR を経由するか

<a id="iteration-0-record-1"></a>

### 調査: 二つの記述の出どころ

#### 入力

- 問い: escalate の 4 step と、context の「commitとpushをdefault branchへ直接行わない」は、それぞれ誰の判断で入ったか。
- 方法: 2026-10-31 に次を確かめた。
    - `git log -S` で、二つの文を足した commit を探した。
    - 4 step を足した steering の task-design-discussion と、context の一文を足した commit の message を読んだ。
    - `git log --merges main` で、`main` への取り込み方の実績を見た。

#### 結果

- 4 step: commit `38a11af`（2026-09-01）が足した。
    - 2026-08-31 の steering（`20260831-add-incident-flow-and-subagent-boundary`）の task-design-discussion 論点8 で、利用者が手順と理由を指示し、提案0 に「ok」と答えた。
    - 利用者の理由の原文は、discussion の提案0 に引いた。
- context の一文: commit `07bf921`（2026-09-01、同じ時刻）が足した。
    - commit message は「instanceへは今回のsteeringで検証した実factを記載済み」と書く。空だった instance を、assistant が埋めた。
    - 過去の steering の記録に、この一文についての議論は見つからなかった。
- `main` の取り込みの実績: PR を経由しない merge（`Merge branch '20260831-add-incident-flow-and-subagent-boundary'` など）と、PR の merge（#8）の両方がある。

<a id="iteration-0-record-2"></a>

### 訂正: 論点2 の示し方と推奨

#### 入力

- 問い: steering の `discussion.md` 論点2 の示し方と推奨は、確かめた事実と標準に合っていたか。
- 方法: 上の調査結果と、`development_flow/work_scope.md` を照らした。

#### 結果

- 示し方: 論点2 は、context の一文を「main への直接の commit・push を禁じている」決まりとして、4 step と同じ重みで示した。出どころを確かめていなかった。
- 推奨: b（別の作業にする）を、「この作業の目的の決定・実装範囲は、この判断で変わらない」という理由で推奨した。
    - `work_scope.md` は、目的の外であることを切り出す理由にしない。既定は今の作業で拾い、切り出すのは、大きすぎる、単体で revert しやすい、本番への適用が遅れる、のどれかに当たる時だけである。
    - b の理由はどれにも当たらなかった。利用者の「a」は標準に沿う。
- 論点2 の決定（この作業は PR #9 を利用者が merge する）は、この訂正で変わらない。

<a id="iteration-0-record-3"></a>

### 判断: 提案0 の選択肢と推奨

#### 入力

- 問い: どちらへそろえるか。その時、直す file はどれか。
- 方法: 上の結果から、各選択肢で変わる file と、利用者の既存の理由との関係を比べた。

#### 結果

- 食い違いは、context の一文の「直接」の読み方から来る。二通りに読める。
    - 「`main` の上で commit しない」: 4 step と両立する。
    - 「`main` へ push しない」: 両立しない。
- a（PR を経由しない取り込みを続ける）: escalate は変えない。context の一文を、前者の読み方に直し、escalate の取り込みを指す子の項目を足す。
- b（PR を経由する取り込みに変える）: escalate の取り込みの節を、PR を作り利用者が merge する形に置き換える。context は変えない。
- 推奨は a とした。
    - 08-31 の利用者の理由を取り下げる発言は、記録に無い。
    - この作業で PR を開いたのは、設計の途中の diff を見るため（利用者「セッションだけじゃよくわからない。prで見たい」）であり、取り込みの review のためではなかった。
- 制約: a の一文は context file の template にも入る。この file は配布する template と、この repository の instance を兼ねる。
    - template がこの repository 固有の事実を持つことは、この論点の前からある（remote、version bump など）。
    - a と b のどちらを選ぶかは、この制約で変わらない。

<a id="iteration-1"></a>

## イテレーション1: 提案0 の取り下げと、導いた変更の報告

<a id="iteration-1-record-1"></a>

### 調査: この作業で利用者へ出した問いの出どころ

#### 入力

- 問い: この作業で出した問いは、どこから来たか。問う前に、実際に誤りが起きていたか、答えが既にあったか。
    - 契機は利用者の発言（2026-10-31）。「なんか、それでそんな問題起きる？みたいなことで何度か答えさせられてる感じがする。skill-updatereviewがうるさいせいからか？」
- 方法: 2026-10-31 に次を読み直した。
    - task-design-discussion の論点1〜8、steering の `discussion.md` の論点1・2、`artifacts/skill-structure-review.md`
    - skill-update-review の元の目的: `.steering/2026/202610/20261018-escalate-pending-plugin-improvements/` の論点31、skill の git の履歴

#### 結果

| 問い | 出どころ | 問う前の状態 |
| --- | --- | --- |
| 論点1（提案1 を取り込む理由） | assistant | 答えは利用者の「1:b」で引用できた |
| 論点3 の変更内容4（確認環境へ載せる task） | skill-update-review の 1 回目の指摘2 | 実際に欠けていた。tasklist に task が無ければ、executor は確認環境へ載せない |
| 論点5（既存の commit を書き換えない） | assistant（利用者の説明を書き残す提案） | 実際に起きていた。assistant が書き換えを二度既定にした |
| 論点6（share-work-in-progress の一文） | skill-update-review の 3 回目の指摘1 | 実際に効いていた。steering の論点1 で、assistant が作り直しを推す根拠にした |
| 論点7（合意した範囲を引き渡す） | assistant（steering の Step 4 の再発防止 review） | 実際に起きていた。提案の中身を合意済みと取り違えた |
| steering の論点2 と論点8 | assistant（commit の計画中に、二つの文の食い違いを見つけた） | 答えは 08-31 の利用者の指示から一つに決まった |
| template がこの repository 固有の事実を持つ件（chat だけで問うた） | assistant | 誤りは起きていない。利用先の instance に、この repository 固有の事実は入っていない |

- 答えが既にあった問いと、誤りが起きていない問いは、論点1、steering の論点2 と論点8、template の件である。どれも assistant が起こした。
- skill-update-review から来た二つは、どちらも実際に欠けていた、または効いていた。
- skill-update-review の元の目的は、論点31（20261018）の提案0 に「skillを変更する時に、処理を一つのSKILL.mdへ抱え込みすぎていないかを調べる役」とある。利用者の記憶（切り出せるものの通知）と合う。
    - 今の description は「全体の責務・判断・状態・受渡しをreviewする」である。受渡しや二重管理の確認は、同じ steering の後の論点（論点46 の script の確認など）で足された。
    - この作業の 3 件の指摘（句の不一致、確認環境へ載せる task、share-work-in-progress の一文）は、どれも切り出しの指摘ではなかった。

<a id="iteration-1-record-2"></a>

### 判断: 提案0 を取り下げ、a を導いた変更として報告する

#### 入力

- 問い: 論点8 は、利用者の採否が要る問いか。
- 方法: 上の結果と、facilitate-discussion の `derived-change.md` の「変更の種類を判定する」を照らした。

#### 結果

- 要らない。08-31 の利用者の指示が残っており、取り下げる発言は無い。そこから a が一つに決まる。提案0 自身が、それを推奨の理由に挙げていた。
- 「既決事項からAIが一意に導出した変更」にあたる。変更内容と根拠を報告し、次の実応答を確かめてから反映する。
- template の件の問い（chat で出した「2」）も取り下げる。誤りは起きておらず、論点8 の結論も変えない。

<a id="iteration-1-record-3"></a>

### 判断: 決定の後の doc-enricher の提案 review（origin: 論点8 の決定）

#### 入力

- 問い: 論点8 の決定から、README や既存 docs に足すべき、再利用価値の高い知識があるか。
- 方法: 2026-10-31 に、決定と反映した context file の一文、root `README.md` の context の説明を照らした。

#### 結果

- 候補なし。context file が配布する template とこの repository の instance を兼ねることは、この作業で root `README.md` に足した（利用者が承認した追記）。取り込みの手順は escalate の skill が正本であり、context はそれを指すだけである。

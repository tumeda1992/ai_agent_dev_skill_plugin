# 内部検討記録: 論点8 — 分割候補作成後の通常compareで切替不能になった

**discussion:** [implementation_review.md](../implementation_review/implementation_review.md)

**論点:** 論点8

## 開始context

原文と候補の共存を通常compareが拒否し、正しい候補でも旧入口除去へ進めなかった。
通常の共存停止を保ち、明示移行中だけ既知の旧集合を直接照合する経路へ直した。分割後追記と参照追随も接続した。

<a id="iteration-0"></a>

## イテレーション0: 旧記録からの事後回復

<a id="iteration-0-record-1"></a>

### 診断: 過去の記録と現在の保存結果を区別する

旧fileはcommit 1259528とartifacts/record-recovery-20261025/に保存した。
以下は旧記録に実際にあった経過であり、今回新たに調査・実施した履歴とは扱わない。
過去の「読んだ」「適用した」という記述自体を、その実行の独立した証明とも扱わない。

#### 当時保存されていた経過

初回の独立02/03は、候補作成とcheck-candidate成功後、通常compareが新旧共存を拒否して旧入口除去へ到達しなかった。
actorは原文を残して中断し、この観測をfailedのまま保持した。
新しい仕様の不足ではなく、通常継続のgateを明示移行中にも使った接続誤りである。

通常resolve/compareの共存停止を維持し、明示移行中だけ既知の旧集合のexact path・実体・SHAを直接照合する経路へ直した。
既splitへの追記、内部log往復/本文内/designからのhref追随、分割前の応答原文保存も明示した。
同じ原文を保持した新attemptで02/03/15は切替完遂を実測した。
証跡は[議論 attempt1](../artifacts/phase-3/behavior-run-1/result.json)と[attempt2](../artifacts/phase-3/behavior-run-2/result.json)。

#### 今回の接続と限界

後発の保存結果: phase-2-4-discussion-behavior-2 / attempt 2 / failed。
新しい機能検証は実行していない。保存済み結果への接続と記録先の修正である。

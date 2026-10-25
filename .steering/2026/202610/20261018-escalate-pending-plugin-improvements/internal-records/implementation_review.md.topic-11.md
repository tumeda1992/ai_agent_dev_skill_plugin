# 内部検討記録: 論点11 — 旧basename入力を.md必須へ狭めた

**discussion:** [implementation_review.md](../implementation_review/implementation_review.md)

**論点:** 論点11

## 開始context

従来許された別拡張子・拡張子なしを、新helperが追加拒否していた。
最後の拡張子からstemを求め、拡張子なしはpath種別で解決する。同path移行には明示candidateを使い、検査後に切り替える指示へ直した。

<a id="iteration-0"></a>

## イテレーション0: 旧記録からの事後回復

<a id="iteration-0-record-1"></a>

### 診断: 過去の記録と現在の保存結果を区別する

旧fileはcommit 1259528とartifacts/record-recovery-20261025/に保存した。
以下は旧記録に実際にあった経過であり、今回新たに調査・実施した履歴とは扱わない。
過去の「読んだ」「適用した」という記述自体を、その実行の独立した証明とも扱わない。

#### 当時保存されていた経過

全scope照合で、新helper/resolveが旧入力にない.md必須を追加していたことを確認した。
原因は実装起因の制約追加であり、利用者に新しい命名方針を選ばせる問題ではない。
最後の拡張子からstemを求め、拡張子なしは同pathの実種別で入口を解決するようにした。
同path移行だけ明示candidateで原文を保持し、検査後に旧入口を最後に外して最終pathへ切り替える。

新しい入力field/CLI操作/恒久命名規約は増やさず、別pathの共存停止は維持した。
23自己testは成功し、新freshの非.md/無suffix操作は結果待ちである。
修復前source89fileを保存して旧観測を旧版で採点し、後発指示を遡及適用していない。
証跡は[互換照合](../artifacts/phase-10/compatibility-audit.md)と[凍結版](../artifacts/phase-10/pre-compat-repair-source/source-identity.json)。

#### 今回の接続と限界

後発の保存結果: phase-2-4-discussion-behavior-3 / attempt 3 / passed。
新しい機能検証は実行していない。保存済み結果への接続と記録先の修正である。

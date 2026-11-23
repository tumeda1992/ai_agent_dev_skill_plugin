# 内部検討記録: 論点10 — 追加部品と見出し順序のvalidatorが誤検出した

**discussion:** [implementation_review.md](../implementation_review/implementation_review.md)

**論点:** 論点10

## 開始context

旧部品と新部品を別々に全量一致検査したことと、inline引用を見出しとみなしたことが原因だった。
全12部品を一度に照合し、新しい見出し順序だけ行境界へ限定した。旧禁止guardは維持した。

<a id="iteration-0"></a>

## イテレーション0: 旧記録からの事後回復

<a id="iteration-0-record-1"></a>

### 診断: 過去の記録と現在の保存結果を区別する

旧fileはcommit 1259528とartifacts/record-recovery-20261025/に保存した。
以下は旧記録に実際にあった経過であり、今回新たに調査・実施した履歴とは扱わない。
過去の「読んだ」「適用した」という記述自体を、その実行の独立した証明とも扱わない。

#### 当時保存されていた経過

追加部品2つを旧10部品と別々に全量一致検査したこと、inline引用へ新しい見出し順序検査が一致したことをstatic1が検出した。
旧12部品の厳密一致へ統合し、新順序だけ行境界へ限定した。
状態候補・templateの実例・所属表記も揃えた。
旧forbidText27呼出しは変更していない。

static2/3の成功後、basename互換修復を含むstatic4は23自己testと7commandが成功した。
14skill YAML parseは不変のfrontmatterについてstatic3で成功している。
証跡は[static1](../artifacts/phase-10/static-run-1/result.json)、[static3](../artifacts/phase-10/static-run-3/result.json)、[static4](../artifacts/phase-10/static-run-4/result.json)。

#### 今回の接続と限界

後発の保存結果: phase-10-static-validation-4 / attempt 4 / passed。
新しい機能検証は実行していない。保存済み結果への接続と記録先の修正である。

# 内部検討記録: 論点10 — 見本2 fileの書き直しを、残りの書き方の基準にしてよいか

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点10

## 開始context

- 問題: 論点9で、`caller-contracts.md`と`contract-preservation.md`を見本として先に書き直し、合意を得てから残りを書くと決めた。
- 決める範囲: 見本2 fileの書き直しが、残りの書き方の基準として合意できるか。
- 開始時の既決条件: 論点1（見分ける問い）、論点3（書き直し方）、論点4（見出し・label）。

<a id="iteration-0"></a>

## イテレーション0: 見本2 fileを書き直す

<a id="iteration-0-record-1"></a>

### 確認: 書き直した見本に、言い換え対象の表現と、判断能力の欠落が残っていないか

#### 確かめること・方法・合格条件

- 確かめること1: 両fileに、論点1の型に当たる表現が残っていないか。
  - 方法: `grep -noiE "owner|contract|caller|gate|ledger|baseline|scope|evidence|closed|handoff|outcome|所有|正本|明示差分|全量|citation|classification|procedure|finding|actor|side effect|identifier"`。
  - 合格条件: 出現が、意図して残したもの（同policyの語との対応、file名）だけである。
- 確かめること2: 元の記入の手引きの項目が全て残っているか。
  - 方法: 元のfileと書き直したfileの小見出しと箇条を並べて照合した。
  - 合格条件: 項目の削除・統合が無い。
- 確かめること3: validatorが通るか。
  - 方法: `node scripts/verification/validate-plugin.mjs`。

#### 結果

- 確かめること1: `contract-preservation.md`の9〜11行（同policyのbaseline、ledger、contractとの対応を示す行）と98行（file名`function-migration-ledger.md`）だけが当たった。25行の当たりは「refactoring」の部分一致である。`caller-contracts.md`は当たり無し。
- 確かめること2: 両fileとも、なぜ必要か、NG、記述例、書く条件、書くこと・書かないこと、MUST、判断基準の全ての箇条を残した。
- 確かめること3: `plugin validation passed`。

#### 支持できる範囲

grepの語は論点1の例と、両fileにあった語に限る。語の一覧に無い表現の見落としは、利用者のreviewで確かめる。

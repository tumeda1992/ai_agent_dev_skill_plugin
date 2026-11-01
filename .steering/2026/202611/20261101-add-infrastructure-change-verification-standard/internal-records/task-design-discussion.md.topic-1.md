# 内部検討記録: 論点1 — 基盤を変えた後の確かめの標準を、どこに、どう書くか

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点1

## 開始context

利用先 repository の作業から引き渡された（2026-11-01）。利用者は、ログの書き込みの欠落に今まで気付かなかったことを、上澄みの結果で良しとした結果だと指摘し、変えた component の影響下の動きをすべて見に行くことを必須とし、plugin の infrastructure の文書に失敗事例とともに書くよう指示した。

<a id="iteration-0"></a>

## イテレーション0: 置き場所と本文

<a id="iteration-0-record-1"></a>

### 調査: 失敗事例の事実と、影響下の動きの例

#### 入力

- 問い: 失敗事例として何が起きたか。影響下の動きには何があったか。
- 方法（2026-11-01）: 利用先の app を作った時の design の受け入れ基準を読んだ。今回の変更（app 全体に付く service role）で影響を受ける動きを、利用先の作業で列挙した。

#### 結果

- app を作った時の受け入れ基準は、機能が使えること、認証、再適用で差分が出ないことであり、ログは含んでいなかった。
- 今回の変更の影響下の動き: 本番のログ、確認用環境のログ（同じ app の別 branch）、build（service role は build にも使われる）、画面、定期実行とそのログ、apply・plan。
- role を付けた後、apply は成功し画面も開いたが、log group は作られていなかった。

<a id="iteration-0-record-2"></a>

### 判断: file を分けるか、名前

#### 入力

- 問い: `log_retention.md` に足すか、別の file にするか。
- 方法: 扱う判断で比べた。

#### 結果

- `log_retention.md` は「ログをどれだけ残すか」、新しい標準は「基盤を変えた後に何を確かめるか」で、別の判断である。ログ以外（権限、build、定期実行）にも及ぶ。file を分ける。
- 名前の逆翻訳: `development_standards/infrastructure/change_verification.md` を見た人は「基盤の変更をどう確かめるかの標準」を予想する。実態と一致する。

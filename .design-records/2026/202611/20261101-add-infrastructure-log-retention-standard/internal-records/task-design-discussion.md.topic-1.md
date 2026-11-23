# 内部検討記録: 論点1 — ログの保存方針を、開発標準のどこに、どう書くか

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点1

## 開始context

利用先 repository の作業から引き渡された（2026-11-01）。利用者は、ログの保存期間の推奨（90 日）を却下し、方針を示したうえで、plugin の開発方針にも書くよう指示した。file か directory か、文面、MUST の粒度は未合意である。

<a id="iteration-0"></a>

## イテレーション0: 置き場所と本文

<a id="iteration-0-record-1"></a>

### 調査: 開発標準の構成と置き方

#### 入力

- 問い: 開発標準のどこに、どの形で置くか。
- 方法（2026-11-01）: `development_standards/README.md` 全文、`naming/README.md`・`core.md`・`file.md` 全文、`naming/` の他の file・`entity_modeling/`・`development_flow/` の見出しを読んだ。

#### 結果

- 置き方: 開発そのもの（何を作るか、どう名付けるか、どう進めるか）は開発標準の配下。既存の群に当たらなければ新設する。
- 既存の群の形: README を持つ directory（`naming/`、`entity_modeling/`）と、README を持たず索引だけ親 README に置く directory（`development_flow/`、2 file）。
- 維持規律: 「配下をすべて読む」契約のため、file を増やす時は分量を確かめる。README は「13 file・約 57KB」と書く。`wc -c` の実測は 58035 byte。
- 命名: docs は snake_case。親が語ることを file 名に重ねない（`file.md`）。

<a id="iteration-0-record-2"></a>

### 判断: file か directory か、file 名

#### 入力

- 問い: `infrastructure.md` 一つか、`infrastructure/` の下に file を置くか。
- 方法: 既存の群の形と、今後増えうる標準で比べた。

#### 結果

- infrastructure は分野の名前で、ログ以外の標準（権限、費用）も同じ分野に入りうる。`infrastructure.md` 一つにすると、増えた時に file を分け直すことになる。
- 1 file の間は README を持つ必要が無い。`development_flow/` と同じく、索引を親 README に置く directory にする。
- file 名の逆翻訳: `development_standards/infrastructure/log_retention.md` を見た人は「基盤のログをどれだけ残すかの標準」を予想する。実態（application のログは無期限、service のログは service と消えてよい）と一致する。保存期間の具体的な日数が並ぶと予想される点だけが実態とずれるが、本文の冒頭で判断基準と分かる。

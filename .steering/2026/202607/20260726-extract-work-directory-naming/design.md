# Design: 作業ディレクトリ命名の skill 切り出し

## 目的

作業成果物を格納するディレクトリの basename を決める責務を、特定の消費側から独立した `name-work-directory` skill として提供する。
ディレクトリの内容を人が識別でき、日付順にも探索できる安定した名前を、複数の workflow から再利用可能にする。

## 完了条件

- [x] 新 skill の名前が、切り出し元ではなく「作業ディレクトリを命名する」という目的を表している
- [x] `YYYYMMDD-slug` の生成規則と、branch を含めない規則が一箇所に定義されている
- [x] 新 skill と消費側の責務境界が明確である
- [x] steering が `.steering/YYYY/YYYYMM/` の管理を継続する
- [x] 既存 steering の履歴を改名せず、新規作成時だけ新形式を使う
- [x] plugin の配布 metadata と skill metadata の検証方法が確定している

## 決定事項

### D1. skill 名と目的

新 skill の名前は `name-work-directory` とする。

この skill は、作業・検討・調査などの成果物を格納するディレクトリの basename を命名する。特定の workflow や切り出し元には所属しない。

### D2. 入出力と命名規則

入力は「ディレクトリに格納する作業内容」と実行時のローカル日付とする。出力は次の basename 一つとする。

```text
YYYYMMDD-slug
```

- `YYYYMMDD` は実行日
- `slug` は作業内容を英語で要約した lowercase kebab-case
- slug は英数字とハイフンだけを使い、3〜8語程度を目安にする
- 作業を表す場合は動詞＋目的語を優先し、冠詞は省略してよい
- 一度採用した basename は同じ作業中に変更しない
- branch 名は取得せず、basename に含めない

### D3. 新 skill の責務境界

`name-work-directory` は basename の決定だけを担う。

親ディレクトリの構成、ディレクトリ作成、既存ディレクトリとの衝突確認、月次集計などは消費側が担う。新 skill は Git repository や steering の存在を前提にしない。

### D4. steering との連携

steering は `name-work-directory` を呼び、返された basename の日付部分から `YYYY` と `YYYYMM` を得て、次のパスを作成する。

```text
.steering/YYYY/YYYYMM/YYYYMMDD-slug/
```

steering は親パスの作成と前月 summary の生成を引き続き担当する。branch の取得処理と旧形式の説明は削除する。roadmap template の子 steering パスも月階層を含む新形式へ揃える。

### D5. 既存成果物の扱い

既存の `.steering/` 配下にある branch 込みのディレクトリは履歴としてそのまま残す。移行・一括改名は行わない。

### D6. skill packaging と配布 version

`skill-creator` の初期化・検証手順を使い、`SKILL.md` と `agents/openai.yaml` を持つ skill として作成する。

新しい再利用可能な skill の追加に加え、既存 steering の命名契約から branch を除く破壊的変更を含むため、`tumeda-dev` を `1.1.1` から `2.0.0` へ上げる。Codex、Claude、marketplace の四つの version 宣言を同じ値に揃える。

### D7. 検証

- `quick_validate.py` で `name-work-directory` の構造と frontmatter を検証する
- repository 全体を検索し、現行の steering 規約・template に旧 `YYYYMMDD-branch-slug` 形式が残っていないことを確認する
- JSON parser で配布 manifest を検証し、四つの version 宣言が一致することを確認する

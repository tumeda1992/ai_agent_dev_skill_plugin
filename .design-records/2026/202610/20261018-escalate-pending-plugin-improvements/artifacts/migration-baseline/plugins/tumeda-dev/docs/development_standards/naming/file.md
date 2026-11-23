# ファイル名

ファイル名に固有の規則。どの対象にも効く原則は [core.md](./core.md) が持つ。

## 同階層の存在と足並みを揃える

同じディレクトリのファイルと、表面（接頭辞など）も抽象度も揃える。1 つだけ足並みを乱す抽象度・表記にしない。

- 表面: 周りが接頭辞を使っているなら合わせる。表記（snake / kebab 等）も所属ツリーの慣習に従う（例: skills は kebab `domain-research-with-code-reading`、docs は snake `business_specification.md`。どちらが正しいではなく、周囲に合わせる）
- 抽象度: 周りが広い標準の粒度なら広く、具体トピックの粒度なら具体で揃える

## 全体を説明する一員として名付ける

「間違っていない名前」を単体で付けることを恐れるより、同階層のファイル群と合わせて**ディレクトリ全体を説明する役割**を担っている、と意識する。

## 直上ディレクトリのコンテキストを継承する

そのディレクトリ配下のファイルは、直上ディレクトリの文脈をそのまま引き継ぐ。親が語ることを、ファイル名に重複して持たせない。

- ○ `documentation_standards/business_specification.md` — 親が「ドキュメンテーション標準」を語るので、ファイルは `business_specification` で足りる（`documentation_standard_for_business_spec.md` としない）

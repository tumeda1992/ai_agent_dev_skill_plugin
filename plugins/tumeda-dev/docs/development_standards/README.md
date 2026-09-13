# 開発標準

命名規約とエンティティ設計の判断基準を置く場所。

## 収録している標準

- **[naming/](./naming/README.md)** — 名前を付けるあらゆる場面で守る標準。判断基準（対象を問わない原則の core、対象種別ごとの file・method）と、手段（索引の what_to_try、検算の reverse_translation、レビューの review）を持つ。
- **[entity_modeling/](./entity_modeling/README.md)** — エンティティ設計の判断基準。

## この群の引き方

- `task-design` は、設計判断へ入る前にこの群の配下をすべて読む。「今回は命名判断を含むか」「entity 設計に該当するか」を skill 側で判定しない。
- `name-work-directory` は `naming/README.md` を入口とし、そこの引き方に従う。個別 file を名指ししない。

## この群の置き方

新しい標準をどこへ置くかは、次の問いで判断する。

**この標準は、名前を付ける場面・entity を設計する場面のどちらかで、判断基準として使われるか。**

- 使われる → この群の配下（`naming/` または `entity_modeling/`、あるいは新設する群）
- 使われない → この群の外。対象領域を持つ別の docs 群（例: `documentation_standards/`、`think_standards/`）

## 維持規律

「配下をすべて読む」契約は、配下の file 数と分量に依存する。file を増やすときは、増やした後もこの契約が成立し続けるかを確認する。

判断の問い: **「増やした後の file 数と分量で、設計前調査の一段階として読み切れるか」**

読み切れないなら、file を増やす前に参照契約自体を見直す。数値上限は置かない。分量が file 数に比例しないためである。

現在は 11 file・約 56KB である（`naming/` に README・core・file・method・what_to_try・reverse_translation・review、`entity_modeling/` に README・core・evacuation、この README）。

このうち `naming/` の手段（`what_to_try.md`、`reverse_translation.md`、`review.md`）は、名前を作る場面・評価する場面でのみ引く。判断基準（`core.md`、`file.md`、`method.md`）とは使う場面が違うが、**「詰まったときだけ読む」という例外を設けない**。例外を設けると「詰まっているか」の判定が入り、詰まっていることに気づいていない状態で標準に触れないまま進む経路ができる。判定を挟まないことがこの契約の目的である。

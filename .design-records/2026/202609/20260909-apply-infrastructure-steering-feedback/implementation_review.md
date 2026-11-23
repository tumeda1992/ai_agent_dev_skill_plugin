# 議論記録

## 論点1: design.mdの付録「正本」自称箇所調査が1件を見落としていた原因と対処

**ステータス:** 決定

**種別:** レビュー指摘

### イテレーション0: 見落としの原因分類と再発防止要否の判断

#### 提案0

**発見した事実**

`tasklist.md` Phase 3実行中、`README.md`の`## 運用契約`内に次の一文があることを発見した。

> hostごとのmodel差は`plugins/tumeda-dev/skills/runtime-model-profiles.md`の能力profileで吸収する。provider固有model名はskill手順の正本にしない。

`design.md`の付録「「正本」の自称箇所」は`AGENTS.md:9`、`README.md:7/11/15`、`escalate-plugin-skill-fix/SKILL.md`の5箇所を列挙しており、この一文は含まれていない。付録「「正本」の相対用法（対象外候補）」にも列挙されていない。つまりdesign調査時点でのgrepまたは目視確認が、この1箇所を洩らしていた。

一方でPhase 3のDoDは「`README.md`に「正本」が無い」を無条件で定め、検証taskも`grep -n 正本 AGENTS.md README.md`が空であることを求めていた。この文言は自称ではなく「provider固有model名がskill手順の判断基準として扱われない」という相対用法に近いが、DoDの文言上は除外されない。

**実施した対処**

このtasklist実行中に、「provider固有model名はskill手順の正本にしない。」→「provider固有model名をskill手順が直接参照する基準にしない。」と言い換えて反映した。`tasklist.md`のPhase 3該当taskへも「（設計時未列挙）」として実測による追加を記録済み。

**原因分類（`2.1.1`の判定）**

このfeedback相当の事象は、提案の選好を変えたのではなく、設計時点の調査网羅性が不足していたことに起因する。「正本」という語のrepository全体grepが、付録作成時に徹底されていなかった。

| 原因owner候補 | 該当性 |
| --- | --- |
| 成果物固有 | 該当しない。今回の成果物（README.md）だけの特殊事情ではない |
| repository知識 | 該当しない。codeを読めば機械的に見つかる種類の見落としであり、知らないドメイン知識が原因ではない |
| skill | 該当する可能性がある。`task-design`の付録作成processに「対象語の repository 全体grepで洩れがないか」を確認するself-review項目が明示されていない |

**論点**

再発防止のための恒久策として、次のいずれかを提案する。

- 案A: `task-design/SKILL.md`のPhase的な付録作成箇所（本件では相当する外部steering運用のdesign作成process）に、「自称・禁止語を洗い出す設計では、対象語のrepository全体grep結果を付録の根拠として明示する」という一般則を追加する。
- 案B: 恒久策を設けず、今回のように「実装時点でDoDの無条件grepが失敗した場合はその場で言い換えて補い、tasklistへ実測差分として記録する」という現状のtasklist-executorの挙動で十分とする。

#### 提案背景

design.mdの付録調査はtask-design側の責務であり、tasklist-executor側では合意済み内容を実行するだけである。今回のように「無条件grepをDoDに含む」設計では、設計時網羅性の抜けが実装時に顕在化しやすい。この抜けをskill process不足として恒久対処するか、実装時の実測補完で十分とするかは、再発頻度と対処コストのトレードオフであり、ユーザー判断が必要な論点である。

#### 提案0へのフィードバック

**結果:** 案A を採用。案B は反証された。

> 全部オッケー

提案0 が案A・案B を提示した後、task-design 側の検証で二件目の見落としが見つかった。`plugins/tumeda-dev/skills/README.md:35` の「利用先repositoryで生じたこのpluginの成果物への修正提案を、正本repositoryの `steering` へ引き渡すrouting skill。」である。これは相対用法ではなく自称であり、論点5 の決定の対象にあたる。

この一件は案B を否定する。案B は「実装時点でDoDの無条件grepが失敗した場合はその場で言い換えて補う」ことで足りるとしていたが、`plugins/tumeda-dev/skills/README.md` は Phase 3 の DoD にも検証taskにも含まれておらず、tasklist-executor の実測補完では拾えなかった。実測補完が働くのは DoD が対象fileを名指ししている範囲だけである。設計時点の網羅が抜けると、その file 自体が実装の視界へ入らない。

見落としの原因も特定できた。design 作成時の調査で `grep -rn 正本 --include="*.md" | head -30` を使い、出力が30件で切れていたことに気づかないまま全体として扱った。件数の集計にも `grep -c` を使い、これが行数を数えることを見落としていた。

### 決定

`plugins/tumeda-dev/skills/task-design/SKILL.md` の Step 4 の自己レビューへ、対象語の網羅を確認する項目を追加する。

自称や禁止語のように「対象語を洗い出して置き換える」設計では、`design.md` の付録へ列挙した箇所が repository 全体の網羅であることを、grep の全出力で確認する。出力を打ち切らず、件数を数える command の意味（行数か出現数か）を確認する。

あわせて、実測で見つかった二件を反映する。

- `plugins/tumeda-dev/skills/README.md:35` の自称を言い換える。この file は配布物であり、`escalate-plugin-skill-fix/SKILL.md` を `plugin repository` へ言い換えた結果と記述が食い違っている
- 同 file を `forbidText` の対象へ加える

`README.md` の `provider固有model名はskill手順の正本にしない` は相対用法だったが、Phase 3 の DoD が file 単位の無条件 grep を求めていたため言い換えられた。言い換え後の文は意味を保っており、戻さない。DoD と論点5 の決定が衝突していたのは設計側の分類誤りであり、この決定の網羅確認項目が同じ誤りを防ぐ。

## 論点2: 三件目の自称を直すかどうか

**ステータス:** 決定

**種別:** レビュー指摘

### イテレーション0: 全数を確定させたうえで、直すか残すか

<!-- chat 上で合意が先に成立したものを記録している。 -->

#### 提案0

Phase 6 完了後、`head` を付けずに repository 全体の grep を取り直した。`.steering` を除く `*.md` の「正本」は80行あり、「正本」の直後の文字で分類すると次のようになる。

```
正本と 28 / 正本は 10 / 正本に 9 / 正本で 7 / 正本を 6 / 正本へ 2 / 正本。5 / 正本、5 ...
```

助詞以外が続く複合語は13行あるが、`二重正本`、`正本ルール`、`既存正本`、`状態の正本`、`読む正本` など、いずれも何の正本かが同じ文にある相対用法である。

自称の複合語は一件だけ残っている。

```
plugins/tumeda-dev/skills/maintenance-plugin-context/SKILL.md:16
「修正の議論と変更は正本repositoryで行う。」
```

四件目は存在しない。全数が確定した。

- **案 a: これを直し、`正本repository` の per-file 禁止を repository 全体の禁止へ置き換える。** `正本repository` という複合語に正当な用法は無く、必ず自称になるため全体で禁止できる
- **案 b: これを直し、per-file 禁止を一件足す。** 現行の形を維持する
- **案 c: 直さない**

案 a を推した。見落としが三回続いた原因は禁止の単位が file であることにあり、file を足していく限り同じことが起きる。

#### 提案0へのフィードバック

**結果:** 案 c を採用。

> c。そんなに神経質になることじゃ無い。phase7へ

### 決定

`plugins/tumeda-dev/skills/maintenance-plugin-context/SKILL.md:16` の「正本repository」は残す。追加の phase を作らない。

全数は確定しており、残るのはこの一件だけである。配布物の中に自称が一つ残るが、`escalate-plugin-skill-fix/SKILL.md` の本体は言い換え済みであり、読み手が判定を誤る箇所ではない。

repository 全体の禁止へ置き換える案も採らない。per-file の禁止は `AGENTS.md`、`README.md`、`escalate-plugin-skill-fix/SKILL.md`、`plugins/tumeda-dev/skills/README.md` の四件のまま残す。

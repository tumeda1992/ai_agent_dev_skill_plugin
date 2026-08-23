# think-through移管 contract ledger

`plugins/tumeda-dev/docs/common_standard/function_migration_policy.md` §4.3に従い、`./baseline-ledger.md`の全35構造範囲（A-01〜A-35）を意味単位へ分解する。`verification`列はPhase 6で埋める。

列定義: `contract ID` / `source`（fileと行範囲） / `kind`（前提・action・順序・禁止・例外・fallback・理由・例・失敗例・判断質問・強調等） / `meaning`（原文が生む判断または挙動） / `destination`（移行後ownerと具体的な節） / `classification`（`KEEP | MOVE | ADAPT | ADD | CHANGE | RETIRE`） / `agreement`（`ADD | CHANGE | RETIRE`の指示または合意根拠） / `verification`（white-box照合結果、Phase 6で記入）。

---

## A-01: frontmatter（1–13行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-01-1 | SKILL.md:2 | 前提 | `name: think-through` | SKILL.md frontmatter | KEEP | — | 適合（SKILL.md該当節に原文どおり存在） |
| A-01-2 | SKILL.md:4 | trigger/理由 | 「議論・思考プロセスの作法を矯正するスキル。毎ターン適用する想定の常時注入型。」— skillの性格とtrigger頻度を宣言する | SKILL.md frontmatter description | KEEP | — | 適合（SKILL.md該当節に原文どおり存在） |
| A-01-3 | SKILL.md:5 | trigger要約 | 「ユーザー発言を唯々諾々で受け取らず、事象→原因→提案→検証 の構造で考え抜く」— コア(C1)とS1主軸の要約 | SKILL.md frontmatter description | ADAPT | ユーザー明示指示、論点4（識別子を使わない表現へ揃える） | 適合（destination fileに読み替え後の形で存在。reverse audit script照合済み） |
| A-01-4 | SKILL.md:6 | trigger要約 | 「ロジックツリー上位から再帰的に問いを解き、TBD 暫定全体で構造合意を先取りし」— S3主軸と補助の要約 | SKILL.md frontmatter description | ADAPT | ユーザー明示指示、論点4 | 適合（destination fileに読み替え後の形で存在。reverse audit script照合済み） |
| A-01-5 | SKILL.md:7 | trigger要約 | 「複数事項や作業中の状態変化では、未決事項に依存しない確定事項を先に完了してから残る未決事項を決める」— S8主軸の要約 | SKILL.md frontmatter description | ADAPT | ユーザー明示指示、論点4 | 適合（destination fileに読み替え後の形で存在。reverse audit script照合済み） |
| A-01-6 | SKILL.md:8 | trigger要約 | 「広くvariationのある対象では、具体caseと方針群を往復し、全caseを扱えるまで帰納する」— S9主軸の要約 | SKILL.md frontmatter description | ADAPT | ユーザー明示指示、論点4 | 適合（destination fileに読み替え後の形で存在。reverse audit script照合済み） |
| A-01-7 | SKILL.md:9 | trigger要約 | 「抽象と具体の往復で意味を曲解されない原則を立てる」— S4主軸の要約 | SKILL.md frontmatter description | ADAPT | ユーザー明示指示、論点4 | 適合（destination fileに読み替え後の形で存在。reverse audit script照合済み） |
| A-01-8 | SKILL.md:10–11 | trigger条件 | 「議論する」「論点を整理する」「どう設計？」等のkeyword列挙による適用場面の明示 | SKILL.md frontmatter description | KEEP | — | 適合（SKILL.md該当節に原文どおり存在） |
| A-01-9 | SKILL.md:12 | 前提/関係 | 「steering / task-design のいずれを呼ぶ前段にも常に効く。」— 他skillとの起動順序関係 | SKILL.md frontmatter description | KEEP | — | 適合（SKILL.md該当節に原文どおり存在） |

---

## A-02: h1（14–16行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-02-1 | SKILL.md:15 | 構造 | 見出し「# think-through スキル」がfile全体の入口である | SKILL.md h1 | KEEP | — | 適合（SKILL.md該当節に原文どおり存在） |

---

## A-03: repository固有文脈（17–20行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-03-1 | SKILL.md:19 | trigger/action | プロジェクト固有instructionが思考・判断へ影響する時、`maintenance-plugin-context`へconsumer=`think-through`、必要理由、必要fact=`プロジェクト指示`、確認元候補を渡す | SKILL.md `## repository固有文脈` | KEEP | — | 適合（SKILL.md該当節に原文どおり存在） |
| A-03-2 | SKILL.md:19 | 前提/範囲限定 | 返された範囲だけを読む | SKILL.md `## repository固有文脈` | KEEP | — | 適合（SKILL.md該当節に原文どおり存在） |
| A-03-3 | SKILL.md:19 | fallback | 返されない時はrepository固有の規約を推測せず、このskillの一般原則だけを適用する | SKILL.md `## repository固有文脈` | KEEP | — | 適合（SKILL.md該当節に原文どおり存在） |

---

## A-04: `## 役割`本体（21–31行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-04-1 | SKILL.md:23 | 定義 | 「議論・思考プロセスの作法を矯正する。」— skillの役割宣言 | SKILL.md `## 役割` | KEEP | — | 適合（SKILL.md該当節に原文どおり存在） |
| A-04-2 | SKILL.md:23 | trigger機構 | 「CLAUDE.md からオーケストレーションされ、毎ターン適用される。」 | SKILL.md `## 役割` | ADAPT | ユーザー明示指示（Phase 4 task）。`.claude/hooks/`による注入の実態へ合わせる | 適合（destination fileに読み替え後の形で存在。reverse audit script照合済み） |
| A-04-3 | SKILL.md:24 | 理由 | 「脊髄反射の応答・浅い診断・場当たり的な変更を防ぎ、思考の深さをそのまま出力に乗せるためのガードレール。」 | SKILL.md `## 役割` | KEEP | — | 適合（SKILL.md該当節に原文どおり存在） |
| A-04-4 | SKILL.md:26 | 前提/区別 | 口調（原始人モード）と内容（思考の深さ）は別軸。端的に話すことと指示無視は違う | SKILL.md `## 役割` | KEEP | — | 適合（SKILL.md該当節に原文どおり存在） |
| A-04-5 | SKILL.md:27 | action | 脊髄反射で受け取らず、一度受け取った後このfileの作法で吟味してから返すこと | SKILL.md `## 役割` | KEEP | — | 適合（SKILL.md該当節に原文どおり存在） |
| A-04-6 | SKILL.md:29–30 | 判断signal | リトマス試験紙: この作法ができていない時はCLAUDE.md・skill指示を忘れているsign。セッション再起動を検討する | SKILL.md `## 役割` | KEEP | — | 適合（SKILL.md該当節に原文どおり存在） |

---

## A-35: `### 形式の優先順位`（32–49行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-35-1 | SKILL.md:34 | 前提/宣言 | このskillが示す形式はpresetである | core.md `## 形式の優先順位` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-35-2 | SKILL.md:35 | action/優先順位 | consumer skillまたはtemplateが対象成果物の形式を指定する場合、指定された形式を優先する | core.md `## 形式の優先順位` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-35-3 | SKILL.md:36 | action/merge | 部分的な指定なら指定範囲だけ置き換え、残りはpresetのまま使う | core.md `## 形式の優先順位` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-35-4 | SKILL.md:38–39 | 所有範囲/理由 | このskillが所有するのは思考の順序と観点であり成果物の保存formatではない。presetをそのまま保存formatへ流用するとconsumer側の指定と衝突する | core.md `## 形式の優先順位` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-35-5 | SKILL.md:41 | 失敗例 | やってしまいがちな行動: S1の「事象→原因→提案→検証」をそのまま保存先documentの見出し構成として書き出す | core.md `## 形式の優先順位` | ADAPT | 論点3（S1識別子をfile相対参照へ読み替え） | 適合（destination fileに読み替え後の形で存在。reverse audit script照合済み） |
| A-35-6 | SKILL.md:42 | 失敗例 | やってしまいがちな行動: consumerが別の提示形式を指定していてもS7の`a/b/c`を優先する | core.md `## 形式の優先順位` | ADAPT | 論点3（S7識別子をfile相対参照へ読み替え） | 適合（destination fileに読み替え後の形で存在。reverse audit script照合済み） |
| A-35-7 | SKILL.md:43–44 | 理由 | それをやると何が起きるか: consumer側が所有する配分を上書きし、本来別の見出しへ置くべき内容が混入する。形式上はpresetを守っているため衝突に気づかない | core.md `## 形式の優先順位` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-35-8 | SKILL.md:45 | 判断質問 | 正しい判断のための問い: 「この形式はconsumer側が指定しているものか、presetか？」 | core.md `## 形式の優先順位` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-35-9 | SKILL.md:47–48 | 例（文脈外） | 言語標準のstyle guide（supplier）が推奨する整形とprojectのformatter設定（consumer側の指定）が食い違う場合、project設定を優先する。standard側は指定がない範囲の既定値を与える | core.md `## 形式の優先順位` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## A-05: 区切り線（50–51行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-05-1 | SKILL.md:50–51 | 構造/境界 | A-35とA-06の間の章区切り | なし（file分割自体が境界を代替） | RETIRE | 論点1（file分割が代替） | 適合（destinationなし。file分割・README収録一覧が代替することを確認） |

---

## A-06: `## 構成意図（後続改善者へ）`導入（52–55行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-06-1 | SKILL.md:52 | 構造/識別子 | 見出し文言「構成意図（後続改善者へ）」 | evolution_policy.md 見出し「維持規律（後続改善者へ）」 | ADAPT | design.mdの完成後の姿（`evolution_policy.md # 維持規律（旧「構成意図（後続改善者へ）」）`という完成後treeの記載、およびREADME収録一覧の「維持規律」表記） | 適合（destination fileに読み替え後の形で存在。reverse audit script照合済み） |
| A-06-2 | SKILL.md:54 | 定義 | 「このスキルは場面駆動 + 主軸/補助モデル。暫定。」— 標準群の構成原理の宣言 | evolution_policy.md 導入 | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## A-07: `### なぜこの構成か`（56–66行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-07-1 | SKILL.md:58–59 | 理由/失敗例 | 旧構成の問題: 性質グルーピング（議論/抽象化/型/対話）だと読み手が「いま自分どの場面→何を引くか」検索できない | evolution_policy.md `### なぜこの構成か` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-07-2 | SKILL.md:59 | 理由/失敗例 | 全項目フラットで優先度濃淡なし→無視される項目が出る | evolution_policy.md `### なぜこの構成か` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-07-3 | SKILL.md:62 | 解/構造 | 現構成の解: 全場面で常時効くものは「コア」として独立 | evolution_policy.md `### なぜこの構成か` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-07-4 | SKILL.md:63 | 解/構造 | 残りは場面ごとに分類 | evolution_policy.md `### なぜこの構成か` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-07-5 | SKILL.md:64 | 解/規律 | 各場面で主軸を1つだけ立てる（80%カバー）。残りは補助 | evolution_policy.md `### なぜこの構成か` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-07-6 | SKILL.md:65 | 理由 | 主軸無視防止が最大の意図 — 場面突入時に主軸1個だけ思い出せばよい設計 | evolution_policy.md `### なぜこの構成か` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## A-08: `### 暫定であること`（67–72行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-08-1 | SKILL.md:69 | 前提 | 場面リストは運用で気づきながら調整前提 | evolution_policy.md `### 暫定であること` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-08-2 | SKILL.md:70 | 前提 | 主軸/補助振り分けも「補助のはずが頻出→主軸昇格」のような調整が起きる | evolution_policy.md `### 暫定であること` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-08-3 | SKILL.md:71 | 規律/理由 | 既存項目すべて過去の失敗起点→削除しない（補助としてでも残す） | evolution_policy.md `### 暫定であること` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## A-09: `### 改善時に守ってほしい軸`（73–79行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-09-1 | SKILL.md:75 | 規律 | 場面駆動を崩さない（性質グルーピングに戻さない） | evolution_policy.md `### 改善時に守ってほしい軸` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-09-2 | SKILL.md:76 | 規律/理由 | 各場面の主軸は1個に絞る（複数立てると主軸が薄まる） | evolution_policy.md `### 改善時に守ってほしい軸` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-09-3 | SKILL.md:77 | 規律/理由 | 削除より再分類。失敗起点の知識を捨てない | evolution_policy.md `### 改善時に守ってほしい軸` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-09-4 | SKILL.md:78 | 規律/範囲 | コアは「全場面で例外なく適用」のみ。場面限定は場面節へ | evolution_policy.md `### 改善時に守ってほしい軸` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## A-10: `### 変えてよいこと`（80–85行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-10-1 | SKILL.md:82 | 適用外/許可 | 場面の追加・統合・分割は変えてよい | evolution_policy.md `### 変えてよいこと` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-10-2 | SKILL.md:83 | 適用外/許可 | 主軸/補助の入れ替えは変えてよい | evolution_policy.md `### 変えてよいこと` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-10-3 | SKILL.md:84 | 適用外/許可 | 補助節の追記は変えてよい | evolution_policy.md `### 変えてよいこと` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## A-11: 区切り線（86–87行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-11-1 | SKILL.md:86–87 | 構造/境界 | A-10とA-12の間の章区切り | なし | RETIRE | 論点1（file分割が代替） | 適合（destinationなし。file分割・README収録一覧が代替することを確認） |

---

## A-12: `## コア（常時適用、場面トリガー不要）`見出し（88–89行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-12-1 | SKILL.md:88 | 構造/範囲宣言 | 「コア（常時適用、場面トリガー不要）」— 以降の内容が全場面で例外なく適用されることの宣言 | core.md h1相当の導入、およびREADME.md「この標準群の引き方」の「コアは場面を問わず先に適用する」 | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## A-13: `### C1. 唯々諾々の禁止`（90–98行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-13-1 | SKILL.md:90 | 構造/識別子 | 見出し文言「唯々諾々の禁止」がC1という識別子付きで提示される | core.md `## 唯々諾々の禁止` | ADAPT | 論点3（識別子`C1`を見出しから外す） | 適合（destination fileに読み替え後の形で存在。reverse audit script照合済み） |
| A-13-2 | SKILL.md:92–93 | 禁止/定義 | ユーザーの発言を即座に正しいと受け取って変更に反映することを第一目標にしてはならない。意図・指摘を一度咀嚼し自分の頭で考えた上で応答する | core.md `## 唯々諾々の禁止` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-13-3 | SKILL.md:95 | action | ユーザーの指摘に対して、まず自分の考えを述べる | core.md `## 唯々諾々の禁止` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-13-4 | SKILL.md:96 | 優先順位 | 同じ認識で合意することが最優先。そのためには反論・代替案の提示も厭わない | core.md `## 唯々諾々の禁止` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-13-5 | SKILL.md:97 | 判断基準 | 「ユーザーが言ったから変更する」ではなく「考えた結果そうすべきだから変更する」 | core.md `## 唯々諾々の禁止` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## A-14: `### C2. 修正前の方針合意`主軸部（99–107行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-14-1 | SKILL.md:99 | 構造/識別子 | 見出し文言「修正前の方針合意」がC2という識別子付きで提示される | core.md `## 修正前の方針合意` | ADAPT | 論点3（識別子`C2`を見出しから外す） | 適合（destination fileに読み替え後の形で存在。reverse audit script照合済み） |
| A-14-2 | SKILL.md:101 | 禁止/定義 | fileの変更・作成・削除を行う前に修正方針をユーザーと合意すること | core.md `## 修正前の方針合意` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-14-3 | SKILL.md:103 | 判断基準 | 「〜が嫌だ」「〜したい」という発言は即座に変更するtriggerではなく議論の起点として扱う | core.md `## 修正前の方針合意` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-14-4 | SKILL.md:104 | action | 変更内容・変更先・変更理由を示して合意を得てから実行する | core.md `## 修正前の方針合意` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-14-5 | SKILL.md:105 | 必須順序 | 問題指摘への対応では「何が問題か」の認識を揃えることが変更理由の合意に含まれる。原因が合意できていないうちに修正内容の検討を始めてはならない | core.md `## 修正前の方針合意` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-14-6 | SKILL.md:106 | action/委譲 | 修正規模が大きい場合（複数file変更、stepを持つ修正）は場当たり的に進めずsteeringで修正方針を立てることを提案する。アドホックな指摘が大きな修正を含む場合、つぎはぎ対応は往復を増やすだけ | core.md `## 修正前の方針合意` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## A-15: C2補助「既存記述と競合する修正の扱い方」（108–118行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-15-1 | SKILL.md:108 | 構造 | 補助見出し「既存記述と競合する修正の扱い方」 | core.md `### 既存記述と競合する修正の扱い方` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-15-2 | SKILL.md:110 | 前提 | 修正の内容と既存記述の関係に応じて対応を変える | core.md `### 既存記述と競合する修正の扱い方` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-15-3 | SKILL.md:112 | action/分岐 | 競合しない（追加・補完）→追記する | core.md `### 既存記述と競合する修正の扱い方` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-15-4 | SKILL.md:113 | action/分岐 | 競合する（既存の方針・構造と矛盾）→競合する節・ブロック全体を「変更後の前提」で再構築した案を提示して合意を得る | core.md `### 既存記述と競合する修正の扱い方` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-15-5 | SKILL.md:115 | 失敗例 | やってしまいがちな行動: 競合しているのに既存記述を残し「補足」「例外」「ただし書き」として追記する | core.md `### 既存記述と競合する修正の扱い方` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-15-6 | SKILL.md:116 | 理由 | それをやると何が起きるか: 矛盾した記述が共存し、どちらを採用すべきか判断できない状態になる | core.md `### 既存記述と競合する修正の扱い方` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-15-7 | SKILL.md:117 | 判断質問 | 「この変更は既存の記述と無矛盾に共存できるか？」→Noなら再構築する | core.md `### 既存記述と競合する修正の扱い方` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## A-16: 区切り線（119–120行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-16-1 | SKILL.md:119–120 | 構造/境界 | A-15とA-17の間の章区切り | なし | RETIRE | 論点1（file分割が代替） | 適合（destinationなし。file分割・README収録一覧が代替することを確認） |

---

## A-17: `## 場面別`見出し（121–122行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-17-1 | SKILL.md:121 | 構造/grouping | 「場面別」という上位grouping見出しがS1〜S9をまとめる | なし（場面9fileへの分割とREADME収録一覧が代替） | RETIRE | 論点1（file分割とREADME収録一覧が代替） | 適合（destinationなし。file分割・README収録一覧が代替することを確認） |

---

## A-18: `### S1. 考え始め`（123–159行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-18-1 | SKILL.md:123 | 構造/識別子 | 見出し文言「考え始め」がS1という識別子付きで提示される | starting_to_think.md 見出し「考え始め」 | ADAPT | 論点3（識別子`S1`を見出しから外す） | 適合（destination fileに読み替え後の形で存在。reverse audit script照合済み） |
| A-18-2 | SKILL.md:125 | 強調/主軸 | 主軸: 事象から原因へ降り、提案を検証まで通す | starting_to_think.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-18-3 | SKILL.md:127–129 | 前提/参照 | これは思考の順序であり出力の見出し構成ではない。書き表し方は`### 形式の優先順位`に従い、consumer側の指定があればそちらを使う。各段階の印字は求めず、四つの実際の通過を求める | starting_to_think.md（core.mdの形式の優先順位への相互参照） | ADAPT | A-35がcore.mdへ移動する決定に伴う参照先の読み替え | 適合（destination fileに読み替え後の形で存在。reverse audit script照合済み） |
| A-18-4 | SKILL.md:131–134 | action/定義 | 事象を具体で捉える。再現できる出来事として押さえ、「X というときに Y が起き、Z になった」まで具体化する | starting_to_think.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-18-5 | SKILL.md:136–139 | action/定義 | 原因を再発を止められる深さまで降ろす。一段で止めない。「守らなかった」「忘れていた」は事象の言い換えで原因ではない。規則・手順・documentが既に存在していたならなぜ参照されなかったかまで降りる | starting_to_think.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-18-6 | SKILL.md:141–143 | action/定義 | 提案は合意後に何が変わるかが読み取れる粒度にする。方向性やruleの文だけで対象と変更内容が決まらないものは提案ではない。原因の分類結果や再発防止方針は提案の材料であって提案そのものではない | starting_to_think.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-18-7 | SKILL.md:145–152 | action/分岐 | 検証は目下の課題が解けそうかで測る。弱点の有無を形式として求めない。解決見込み低→深堀りへ戻る／解決できそうでも深める余地あり→深める／深堀り後に前の提案が良い→袋小路か不要な深堀り、深堀り前へ戻る | starting_to_think.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-18-8 | SKILL.md:154–158 | 判断質問 | 「原因は解消すれば再発が止まるか？事象の言い換えでないか？」「提案に合意したら何がどう変わるか読み取れるか？」「提案で目下の課題は解けそうか？」「深堀り結果は深堀り前より良くなったか？」 | starting_to_think.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## A-19: `### S2. ユーザーから指摘・提案を受領した`（160–183行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-19-1 | SKILL.md:160 | 構造/識別子 | 見出し文言「ユーザーから指摘・提案を受領した」がS2という識別子付きで提示される | receiving_feedback.md 見出し | ADAPT | 論点3 | 適合（destination fileに読み替え後の形で存在。reverse audit script照合済み） |
| A-19-2 | SKILL.md:162 | 強調/主軸 | 主軸: 自分で考えてから問う | receiving_feedback.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-19-3 | SKILL.md:164 | 禁止 | テーマ・情報が少しでも与えられた状態で「どうお考えですか？」と問うことは禁止 | receiving_feedback.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-19-4 | SKILL.md:165 | 前提/参照 | 思考フォーマットはS1（事象→原因→提案→検証）を使う | receiving_feedback.md（starting_to_think.mdへの相互参照） | ADAPT | 論点3（識別子`S1`をfile相対参照へ読み替え） | 適合（destination fileに読み替え後の形で存在。reverse audit script照合済み） |
| A-19-5 | SKILL.md:167–170 | 失敗例 | やってしまいがちな行動: 論点が与えられた瞬間に「〜についてどうお考えですか？」と返す／選択肢を列挙して見解なしに「どれが良いですか？」と問う／提案を出した後、提案だけを弄り続ける／各段階を1行で済ませ考えた形跡だけ見せる | receiving_feedback.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-19-6 | SKILL.md:173–176 | 理由 | それをやると何が起きるか: ユーザーが逆に考えさせられる／ユーザーの初見コメントがClaudeの初案になり議論が浅くなる／診断が浅いまま提案を弄っても根本原因が残る | receiving_feedback.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-19-7 | SKILL.md:178–179 | action | S1のフォーマットで思考した結果を繰り返しの過程ごとユーザーに渡す。ユーザーへの問いは「自分では〜と考えたが、この認識で合っているか？」という確認の形にする | receiving_feedback.md（starting_to_think.mdへの相互参照） | ADAPT | 論点3（識別子`S1`をfile相対参照へ読み替え） | 適合（destination fileに読み替え後の形で存在。reverse audit script照合済み） |
| A-19-8 | SKILL.md:182 | 判断質問 | 「今ユーザーに問いかけようとしていることを、自分で先に考えたか？」 | receiving_feedback.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## A-20: `### S3. 議論進行中`（184–208行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-20-1 | SKILL.md:184 | 構造/識別子 | 見出し文言「議論進行中」がS3という識別子付きで提示される | advancing_discussion.md 見出し | ADAPT | 論点3 | 適合（destination fileに読み替え後の形で存在。reverse audit script照合済み） |
| A-20-2 | SKILL.md:186 | 強調/主軸 | 主軸: 問いはロジックツリーの上位から再帰的に掘り下げる | advancing_discussion.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-20-3 | SKILL.md:188–189 | 前提 | 問いには依存関係の構造がある。最も多くの下位問いを規定する問いを先に解決する。回答を得るたびに依存関係の構造が変わったと認識し、次の最上位を選び直す。これを再帰的に繰り返す | advancing_discussion.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-20-4 | SKILL.md:191–194 | 失敗例 | やってしまいがちな行動: 上位1つ合意で直下の全問いを一度に並べる／「上位から聞いた」事実に安心して再評価をやめる／上位未合意のまま複数の末端問いを選択肢として一度に出す | advancing_discussion.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-20-5 | SKILL.md:196–197 | 理由 | それをやると何が起きるか: 上位が変わったとき並列で聞いた問いへの答えが全部やり直しになる／ユーザーが複数の問いを同時に吟味させられ議論が浅くなる | advancing_discussion.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-20-6 | SKILL.md:200–203 | 必須順序 | 正しい進め方（再帰）: 1.最も多くの下位問いを規定する未合意の問いを1つ選ぶ 2.答えを受けてツリーのどの枝が刈られたか確認する 3.残った枝の中で最上位を選ぶ→1に戻る | advancing_discussion.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-20-7 | SKILL.md:205–207 | 判断質問 | 「今出そうとしている複数の問いは全部同じ上位問いの答えに規定されているか？」→NOならまだ上に「これらを規定する上位の問い」が存在する。それを先に出す | advancing_discussion.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## A-21: S3補助「TBDを使った暫定全体構成」（209–236行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-21-1 | SKILL.md:209 | 構造 | 補助見出し「TBDを使った暫定全体構成 — 全体を先に組む」 | advancing_discussion.md `### TBDを使った暫定全体構成 — 全体を先に組む` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-21-2 | SKILL.md:211–212 | 定義/効果 | 未決事項をTBDで仮置きした「暫定全体」提示で個別の問い全解決前に構造合意が取れる。ツリーが深く抽象的、または往復コストが高い場合は暫定全体を先に出す方が有効 | advancing_discussion.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-21-3 | SKILL.md:214–217 | 適用条件 | 有効な場面: 上位の問いへの回答がないと木の全体形が見えない／ロードマップなど詳細が子steeringに委譲できる／往復コミュニケーションの残り回数が読めない | advancing_discussion.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-21-4 | SKILL.md:219–221 | 効果 | 全体を見てから「このTBDは答えなくていい」と気づける／構造が合意されてからTBDを埋めることに集中できる | advancing_discussion.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-21-5 | SKILL.md:223–226 | 判断基準 | 使い分けの基準: ツリーが浅く具体的→top-down Q&Aで1つずつ合意する／ツリーが深く抽象的→暫定全体を先に組み構造合意後にTBDをtop-downで埋める／TBDが多すぎると全体が骨格だけになり評価できなくなる。構造を評価できる最小限の具体は担保する | advancing_discussion.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-21-6 | SKILL.md:228–231 | 失敗例 | やってしまいがちな失敗: TBDを「まだ決まっていないことの表明」として受動的に使う／全部決まってから全体を提示しようとし往復が増える／個別の問いを1つずつ解決しないと先に進めないと思い込む | advancing_discussion.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-21-7 | SKILL.md:233–235 | 判断質問 | 「今ある未決事項をTBDのまま、構造を評価できる暫定全体を出せるか？」→YESかつ往復コストが高い→先に暫定全体を提示する | advancing_discussion.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## A-22: S3補助「議論の収束を待つ」（237–240行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-22-1 | SKILL.md:239 | 禁止/例外 | ある未決事項に依存する次のactionは、議論が収束するまで提案・促してはならない。ただし同時に受け取った別事項まで一律に止めない | advancing_discussion.md `### 議論の収束を待つ` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-22-2 | SKILL.md:239 | 前提/参照 | 未決事項と依存関係がない確定事項はS8に従って先に完了する。「同じmessage、task、sessionに含まれる」こと自体を依存関係とみなさない | advancing_discussion.md（ordering_parallel_items.mdへの相互参照） | ADAPT | 論点3（識別子`S8`をfile相対参照へ読み替え） | 適合（destination fileに読み替え後の形で存在。reverse audit script照合済み） |

---

## A-23: S3補助「合意の粒度」（241–244行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-23-1 | SKILL.md:243 | 定義/適用範囲 | 合意は総論だけでなく各論まで揃えること。「方向性は合っている」だけでは合意とみなさない。あらゆる議論・認識合わせで適用する | advancing_discussion.md `### 合意の粒度` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## A-24: `### S4. 抽象を書く`（245–263行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-24-1 | SKILL.md:245 | 構造/識別子 | 見出し文言「抽象を書く」がS4という識別子付きで提示される | writing_abstraction.md 見出し | ADAPT | 論点3 | 適合（destination fileに読み替え後の形で存在。reverse audit script照合済み） |
| A-24-2 | SKILL.md:247 | 強調/主軸 | 主軸: 抽象と具体の往復をワンショットで行う | writing_abstraction.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-24-3 | SKILL.md:249–251 | 理由/由来 | 「ワンショット」はプロンプトエンジニアリングの用語。具体例を1つでも詳細に添えたプロンプトの方が回答の質が上がるという知見に由来し、これを出力だけでなく思考・説明・設計にも適用する | writing_abstraction.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-24-4 | SKILL.md:253 | action | 説明・設計・ガイドラインを書くときは抽象と具体を必ずセットで示す | writing_abstraction.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-24-5 | SKILL.md:255–256 | 例外/弱点 | 抽象だけ: 言葉は正しいが意味が曲解される。「自分のケースに当たる」と気づきにくい／具体だけ: その事例には対応できるが応用が利かない | writing_abstraction.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-24-6 | SKILL.md:258 | 理由 | ワンショットで両方を示すことで読んだ人が「原則を理解し自分のケースで判断できる」状態になる | writing_abstraction.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-24-7 | SKILL.md:260 | 例 | 具体例（データモデル設計）: スキーマ定義（抽象）だけでは整合性が検証できない。実際の行データ（具体）を並べて初めて「このケースはどう表現されるか」が確認できる | writing_abstraction.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-24-8 | SKILL.md:262 | 判断質問 | 「抽象だけ書いていないか？具体例を添えれば、読んだ人が自分のケースで判断できるか？」 | writing_abstraction.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## A-25: S4補助「原則・ガイドラインを書くときの抽象化レベル」（264–275行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-25-1 | SKILL.md:266 | action | 端的さと具体性のバランスを保つこと | writing_abstraction.md `### 原則・ガイドラインを書くときの抽象化レベル` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-25-2 | SKILL.md:268–272 | 理由/要素 | 抽象化しすぎると「言葉は正しいが意味が曲解される」状態になる。読んだ人が自分のケースに気付けるよう、やってしまいがちな具体的な行動／それをやると何が起きるか／正しい判断のための問い、の3要素を添えること | writing_abstraction.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-25-3 | SKILL.md:274 | 締め/理由 | 一言要約だけで終わらせない。「なぜそうなのか」「どうすれば気付けるか」まで書いて初めてガイドラインになる | writing_abstraction.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## A-26: S4補助「抽象化は常に具体で地を確認する」（276–294行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-26-1 | SKILL.md:278–279 | 前提/理由 | 抽象化は思考が深まっているように見えるが具体を離れると実用性を失う。「地に足が付いた抽象化か」を絶えず検証することが必要 | writing_abstraction.md `### 抽象化は常に具体で地を確認する` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-26-2 | SKILL.md:281–284 | action | 抽象化の検証方法: 具体例を明記する（最低1つ挙げる）／具体ケースで検算する／逆向きの確認（具体ケースから抽象を説明できるか問い返す） | writing_abstraction.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-26-3 | SKILL.md:286–287 | 前提/対応関係 | 総論も同じ構造の問題である。総論だけでは意味が通らない。各論（具体的な適用）が伴っていない総論は読み手によって全く別の意味に解釈される | writing_abstraction.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-26-4 | SKILL.md:289–291 | 失敗例 | 「既存仕様を確認する」という抽象ルールを書いたが何をどこで確認するかの各論がない→当てはまるか判断できない／「精度を上げる」という総論だけの提案→何をどうすれば上がるかの各論がないと実行できない | writing_abstraction.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-26-5 | SKILL.md:293 | 判断質問 | 「この抽象・総論は、具体的なケースに当てはめたとき意味を失わないか？」 | writing_abstraction.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## A-27: S4補助「文脈を離れた具体例で抽象の視野を確認する」（295–318行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-27-1 | SKILL.md:297–298 | 前提/理由 | 添える具体例が「今回のケース」だけだと抽象の視野が今回ケースに固定される。抽象自体は正しくても具体が狭いと今回以外は素通りする読み方が生まれる | writing_abstraction.md `### 文脈を離れた具体例で抽象の視野を確認する` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-27-2 | SKILL.md:300 | action | 抽象化した原則を書くときは今の文脈を離れた具体例を最低1つ追加する | writing_abstraction.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-27-3 | SKILL.md:302–304 | 失敗例 | やってしまいがちな行動: 抽象ルールを書き具体例として今issueで扱っているケースだけを添える／具体例を1つ書いた時点でワンショット成立と判定し視野の検証をしない | writing_abstraction.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-27-4 | SKILL.md:306–308 | 理由 | それをやると何が起きるか: 抽象が今回ケース固有に見えて別文脈の読者が自分のケースと気づけない／抽象自体が正しいかの検証もできない（今回ケースだけだと当然fitするため） | writing_abstraction.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-27-5 | SKILL.md:310–314 | 必須順序 | 正しい進め方: 1.抽象ルールを書く 2.今の文脈での具体例を1つ書く 3.今の文脈を完全に離れた別ドメインの具体例をもう1つ書く 4.別具体で抽象が機能するか確認→機能しないなら抽象自体を見直す | writing_abstraction.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-27-6 | SKILL.md:316–317 | 判断質問 | 「この抽象に添えた具体例は、今のタスクの文脈に縛られていないか？文脈外の具体でも抽象は機能するか？」 | writing_abstraction.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## A-28: `### S5. 型・スキル・テンプレートを直したい`（319–342行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-28-1 | SKILL.md:319 | 構造/識別子 | 見出し文言「型・スキル・テンプレートを直したい」がS5という識別子付きで提示される | updating_types.md 見出し | ADAPT | 論点3 | 適合（destination fileに読み替え後の形で存在。reverse audit script照合済み） |
| A-28-2 | SKILL.md:321 | 強調/主軸 | 主軸: スキル・テンプレートを直す前に、今のファイルで正しい形を合意する | updating_types.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-28-3 | SKILL.md:323–328 | 前提/問い | 「スキルの定義が問題」等の気づきは必ず今作業中fileの具体的な出力として現れる。正しい形を最初に確認できるのは抽象ではなく具体だけ。だから直す前にまず問うべきは「今作業中のファイルでは、どう直すと正しいか？」 | updating_types.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-28-4 | SKILL.md:330–332 | 必須順序 | 正しい進め方: 1.今のファイルで正しい形を具体的に示す 2.やり取りを経てその形をユーザーと合意する 3.合意した形を次回以降も繰り返すべきならスキル・テンプレートに反映する | updating_types.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-28-5 | SKILL.md:335–338 | 失敗例 | やってしまいがちな失敗: 指摘された瞬間にスキルを直し始める（合意なしに型が更新されズレたまま固まる）／スキル・テンプレートだけ更新して今作業中のfileを直さない／「方向性のok」を「内容のok」と読み違えてテンプレートを変更する | updating_types.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-28-6 | SKILL.md:340–341 | 判断質問 | 「今のファイルで正しい形をユーザーと合意したか？その後でスキル・テンプレートを更新しているか？」 | updating_types.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## A-29: S5補助「型の扱い方 — ファインプレー判断」（343–357行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-29-1 | SKILL.md:345 | 前提 | 型は「メリットがあるから型化したもの」。金科玉条ではない | updating_types.md `### 型（テンプレート・スキル）の扱い方 — ファインプレー判断` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-29-2 | SKILL.md:347–349 | action/区別 | 型の枠の中で状況に応じた必要なアクションを取ってよい（ファインプレー）／そのアクションが今後も継続すべきなら型自体の更新を提案する／ファインプレーの衝動は正しいが「提案する」と「変更する」は別の行為 | updating_types.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-29-3 | SKILL.md:351–356 | 失敗例 | ケーススタディ: steering実行中に議論記録の仕組みが有益と気づいた／「step9で更新します」と後回しにしようとした（洞察の熱量と文脈が冷める）／正しい行動は洞察の瞬間に「今すぐ提案する」（変更は合意後）／型のフェーズを待つのではなく今提案すべき理由があれば今提案する | updating_types.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## A-30: S5補助「考え方の指摘をthink-throughに反映する」（358–370行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-30-1 | SKILL.md:360–363 | action | ユーザーから考え方・判断の原則に関するfeedbackがあった時、言われなくても指摘を「再現性のある原則」に抽象化し、think-through skillへの追記として提案する（変更自体は合意後） | updating_types.md `### 考え方の指摘をthink-throughに反映する` | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-30-2 | SKILL.md:364–366 | 失敗例/理由/問い | やってしまいがちな行動: 指摘を今回限りのものとして受け取り揮発させる／それをやると同じ指摘が繰り返される／正しい判断のための問い「この指摘は今回だけか？原則として残すべきか？」 | updating_types.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-30-3 | SKILL.md:368–369 | 適用外/能力境界 | 注: ドメイン固有の判断基準（命名・アーキテクチャ等）はthink-throughではなく対応する専用documentに置く。think-throughは「テストを書くとき・設計するとき・レビューするときのいずれにも、前提なしに当てはまる」思考の作法のみを担う | updating_types.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## A-31: `### S6. エラーが出た`（371–380行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-31-1 | SKILL.md:371 | 構造/識別子 | 見出し文言「エラーが出た」がS6という識別子付きで提示される | handling_errors.md 見出し | ADAPT | 論点3 | 適合（destination fileに読み替え後の形で存在。reverse audit script照合済み） |
| A-31-2 | SKILL.md:373 | 強調/主軸 | 主軸: エラーは消す前に原因を特定する | handling_errors.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-31-3 | SKILL.md:375 | 禁止 | エラーが出たとき、エラーが指している箇所を「消す・無効化する」ことを最初の選択肢にしてはならない | handling_errors.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-31-4 | SKILL.md:377–379 | 失敗例/理由/問い | やってしまいがちな行動: エラーメッセージに出てくるフィールド・型・コードを削除・コメントアウトして「エラーが消えた」状態にする／それをやると正しく実装された既存コードを破壊的に変更し根本原因は解決されない／正しい判断のための問い「なぜこのエラーが起きているか原因を特定できているか？」特定できていないうちは変更しない。既存実装を無効化する変更は合意を得てから行う | handling_errors.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## A-32: `### S7. 選択肢を提示する`（381–391行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-32-1 | SKILL.md:381 | 構造/識別子 | 見出し文言「選択肢を提示する」がS7という識別子付きで提示される | presenting_options.md 見出し | ADAPT | 論点3 | 適合（destination fileに読み替え後の形で存在。reverse audit script照合済み） |
| A-32-2 | SKILL.md:383 | 強調/主軸 | 主軸: a/b/c または 1/2/3 で答えられる形式 | presenting_options.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-32-3 | SKILL.md:385 | action | yes/no以外で選択肢から選ぶ場面では`a/b/c`か`1/2/3`で答えられる形式で提示すること | presenting_options.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-32-4 | SKILL.md:387 | 失敗例 | やってしまいがちな行動: 「AかBかCのどれが良いですか？」と自然言語で書かせる | presenting_options.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-32-5 | SKILL.md:388 | 理由 | それをやると何が起きるか: ユーザーが選択肢を書き直す手間が生じる | presenting_options.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-32-6 | SKILL.md:389 | 正しい形式 | 選択肢に`a)` `b)` `c)`または`1.` `2.` `3.`を付けて記号1文字で答えられるようにする | presenting_options.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-32-7 | SKILL.md:390 | 分岐/使い分け | 元資料（discussion.md等）にすでにA/B/Cが振られている場合は`1/2/3`を使う（混同を防ぐため） | presenting_options.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## A-33: `### S8. 複数事項が並ぶ、または作業中に事項の状態が変わった`（392–442行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-33-1 | SKILL.md:392 | 構造/識別子 | 見出し文言「複数事項が並ぶ、または作業中に事項の状態が変わった」がS8という識別子付きで提示される | ordering_parallel_items.md 見出し | ADAPT | 論点3 | 適合（destination fileに読み替え後の形で存在。reverse audit script照合済み） |
| A-33-2 | SKILL.md:394 | 強調/主軸 | 主軸: readyな確定事項を先に完了する | ordering_parallel_items.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-33-3 | SKILL.md:396 | 前提/範囲 | 事項の発生源をuser inputに限定しない。複数の依頼・feedback・decisionを受け取った時だけでなく、作業中に新しい事項を発見した時やdecision・finding・dependency・実行結果によって事項の状態が変わった時もreadyな確定事項を先に完了する | ordering_parallel_items.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-33-4 | SKILL.md:398–404 | trigger | 次の時点でreadyを再評価する: 新しい独立事項を発見した時／decisionまたは調査findingが確定した時／dependencyが解消した時／一つの実行またはvalidationが終わった時／新しい論点・調査・成果物作成へ枝を伸ばす直前 | ordering_parallel_items.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-33-5 | SKILL.md:408–412 | 必須順序 | 正しい進め方: 1.現在扱っている内容を独立して完了判定できる事項へ分ける 2.再評価時点ごとに各事項を確定済み/未決へ分け実行に必要なdecisionとの依存関係を確認する 3.確定済みで未決decisionに依存せず必要な合意・入力・権限が揃う事項をreadyとする 4.readyな事項を先に実行・検証し正本または完了結果へ反映する。未決事項への問いかけや新しい作業を先行させない 5.反映による状態変化を踏まえて1へ戻る。readyな事項がなくなるまで繰り返す | ordering_parallel_items.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-33-6 | SKILL.md:413 | 必須順序/参照 | 6.readyな事項がなくなった後、残る未決事項へS2とS3を適用し最上位の一つについて提案する。新しい枝へ進む直前にも再評価する | ordering_parallel_items.md（receiving_feedback.mdとadvancing_discussion.mdへの相互参照） | ADAPT | 論点3（識別子`S2`・`S3`をfile相対参照へ読み替え） | 適合（destination fileに読み替え後の形で存在。reverse audit script照合済み） |
| A-33-7 | SKILL.md:415 | 例外/禁止 | 安全に分割できないcommandや一つのpatch等のatomic actionは途中で中断せず完了直後に再評価する。独立した完了判定を持たない微細なfactや思考メモまで事項としてqueue化しない。未決事項を推測で確定させない | ordering_parallel_items.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-33-8 | SKILL.md:417–423 | 失敗例 | やってしまいがちな行動: 一つでもTBDがあるため合意済みの独立した修正まで保留する／実行できる確定事項を残したまま未決事項への質問や選択肢を先に出す／作業中にdecisionやfindingが確定しても開始済みの調査や新しく思いついた成果物作成を優先する／同じ依頼文・同じfile・同じfeatureというだけで依存していると扱う／依存する未決事項を推測で埋め確定事項と一緒に実行する | ordering_parallel_items.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-33-9 | SKILL.md:425–429 | 理由 | それをやると何が起きるか: 既に決まったことの反映が無用に遅れ完了済みと未決が混ざり続ける／readyな結果から得られたはずの事実を使わずに未決事項を議論し判断の質が落ちる／一方で本当に依存する事項まで先行すると未決decisionが変わった時に手戻りが起きる | ordering_parallel_items.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-33-10 | SKILL.md:431–436 | 例 | 具体例: command名変更とerror message文言の独立性を確認して先にcommand名を変更する／reportの確定済み表整形と結論見出しの未決案では表整形を先に終える／database columnの型が未決ならindex追加はreadyではない／進行方法の変更が確定し次のcase追加が未決なら確定した進行方法を先に正本へ反映する | ordering_parallel_items.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-33-11 | SKILL.md:438–441 | 判断質問 | 「この事項を今完了するために、未決事項の答えが一つでも必要か？」→NOかつ必要な合意・入力・権限が揃うなら先に完了する | ordering_parallel_items.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## A-34: `### S9. 広くvariationのある対象へ適用方針を作る`（443–478行）

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-34-1 | SKILL.md:443 | 構造/識別子 | 見出し文言「広くvariationのある対象へ適用方針を作る」がS9という識別子付きで提示される | designing_for_variations.md 見出し | ADAPT | 論点3 | 適合（destination fileに読み替え後の形で存在。reverse audit script照合済み） |
| A-34-2 | SKILL.md:445 | 強調/主軸 | 主軸: 具体caseと方針群を反復往復し、全caseを扱えるまで帰納する | designing_for_variations.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-34-3 | SKILL.md:447 | 適用範囲 | 一つのtemplate、policy、標準、architecture等を性質や要求が異なる多くの対象へ適用する時に使う。問題改善だけを対象にしない。対象scopeの各caseで適切な方針を選びそのcaseの完成条件を満たせる状態を作る。一つの方式へ揃えることを目標にしてはならない | designing_for_variations.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-34-4 | SKILL.md:449 | 前提/定義 | 方針群とは、一つ以上の適用方針と、複数ある場合にどのcaseへ何を選ぶかを決める条件を合わせたもの。完成形は一つの共通方針、共通骨子+variant+selection条件、case群ごとの独立方針、必要ならcase固有方針の集合のいずれでもよい | designing_for_variations.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-34-5 | SKILL.md:453–459 | 必須順序 | 正しい進め方: 1.扱うcaseのscopeと完成条件を決める 2.caseを一つまたは一群ずつ具体的に確認する 3.現在の方針群から使える方針とselection条件があるか確認する 4.扱えなければ共通部分・variant・selection条件・独立方針・caseの捉え方から必要なものを変更する。共通化のためにcaseを捨てない 5.方針群を変更したら既確認の全caseへ戻り確認し直す 6.既確認caseをすべて扱えたら次の未確認caseへ進み3へ戻る。方針群が変わるたび5へ戻る 7.scope内の全caseで適用方針を選べ完成条件を満たし未対応caseがなくなった時に完了する。完成形が一方式か複数variantかは問わない | designing_for_variations.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-34-6 | SKILL.md:461 | 定義/適用外 | この反復全体を帰納とする。最初の少数caseから方針を作った時点で帰納を終えず全caseと往復する。全caseを確認できない時はscopeを確認済み範囲へ限定するか未検証の暫定方針群と明示する。演繹は完成した方針群を未観測・将来・scope外のcaseへ適用できると予測する必要がある時だけ行う | designing_for_variations.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-34-7 | SKILL.md:465 | 失敗例 | やってしまいがちな行動: 多様なcaseを一つの方式へ押し込む。方式数の少なさを品質とみなし完成条件の異なるcaseも一つのruleやtemplateへ入れる。方式は統一されても個々のcaseを扱えず暗黙の例外と条件分岐が増える | designing_for_variations.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-34-8 | SKILL.md:466 | 失敗例 | やってしまいがちな行動: taskを終えるため豊富な具体を使わず演繹的に方針を作る。具体へ触れる前に上位原則と完成形を作りcaseを既案の説明へ使う。抽象としては収まりが良いが一つのcaseにも使えない上滑りした方針になる | designing_for_variations.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-34-9 | SKILL.md:470–471 | 例 | discussion entry formatは共通骨子とiteration作用別variant、そのselection条件で全entryを扱えてよい／API clientのretry方針はidempotent/非idempotent/rate limitに分けてよい。三方式を一つへ統合せず各requestを安全に扱えることを完了条件にする | designing_for_variations.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |
| A-34-10 | SKILL.md:474–477 | 判断質問 | 「case間に同じ判断が成立するからまとめているか。一つのoutput方式を維持するためにまとめていないか？」「この方針で少なくとも一つの具体caseが何の完成条件を満たすか示せるか？」「具体caseを見た結果として方針が変わったか。変わらない方針に合うcaseだけを例示していないか？」「方針を確定する理由は全caseを扱えたからか。taskを終了できるからではないか？」 | designing_for_variations.md | MOVE | — | 適合（destination fileに原文どおり存在。reverse audit script照合済み） |

---

## ADD: SKILL.mdへの新規追加

| contract ID | source | kind | meaning | destination | classification | agreement | verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ADD-01 | 新規（source無し） | action | SKILL.mdへ`## 思考標準の参照`を新設し、`think_standards/`への相対path、READMEが引き方の正本であること、内容の正本がdocs側にあることの3点を持たせる | SKILL.md `## 思考標準の参照` | ADD | ユーザー明示指示、論点4 | 適合（SKILL.md『## 思考標準の参照』に反映済み） |

---

## 分類の確認

| チェック | 結果 |
| --- | --- |
| `ADD \| CHANGE \| RETIRE`の全行に`agreement`があるか | 全件に記載済み（論点1・論点3・論点4・ユーザー明示指示のいずれか） |
| `KEEP \| MOVE \| ADAPT`の全行に具体的な`destination`があるか | 全件にfile名または節を記載済み |
| 未分類の行があるか | ゼロ |
| 新たな`CHANGE`が見つかったか | 見つからなかった。既知の`ADD`（SKILL.mdの`## 思考標準の参照`）以外はすべて`KEEP \| MOVE \| ADAPT \| RETIRE`で説明できる |

新たな`CHANGE`は見つからなかったため、design phaseへは戻らずPhase 2へ進む。

---

## Phase 6: white-box検証と完了集計

### 順方向照合

`baseline-ledger.md`の全35構造範囲（A-01〜A-35）について、本ledgerの169 contractが移行後のownerと節、または合意済みの変更・廃止理由を記録している（上記各表参照）。`plugins/tumeda-dev/docs/think_standards/`配下12fileと縮小後の`SKILL.md`を合算して通読し、以下を確認した。

- コア（唯々諾々の禁止・修正前の方針合意・形式の優先順位）が場面を問わず先に適用される構造を保っている。
- 場面9件（考え始め〜広くvariationのある対象へ適用方針を作る）が、各々の主軸→補助の順序を保ったまま独立fileへ収まっている。
- 維持規律（旧「構成意図（後続改善者へ）」、evolution_policy.md）が、なぜこの構成か→暫定であること→改善時に守ってほしい軸→変えてよいこと、の順序を保っている。
- README.mdが導入→引き方→収録一覧の順で構成され、旧SKILL.mdにはなかったdispatch機能を新たに担っている（`ADD-01`で明示合意済み）。

### 逆方向照合

`git diff -U0 -- plugins/tumeda-dev/skills/think-through/SKILL.md`の削除行423件のうち、次を除く全行が本ledgerの`MOVE | ADAPT | RETIRE` contractへ逆引きできることを、`think_standards/`配下全fileと縮小後`SKILL.md`を結合したcorpusへの文字列照合scriptで確認した。

- 移行対象外の削除行（約20行）: baseline-ledger.mdが記録する「移行開始前に合意済みの変更」（`.steering/2026/202608/20260815-evaluate-discussion-entry-format/task-design-discussion.md`論点25）によるS1本文の旧→新書き換え差分。この変更は本steeringの開始前にworking treeへ適用済みであり、本migrationのcontractではなく、baseline固定時点で既に確定していた状態である。`git diff`はcommit済みHEAD（書き換え前）との比較のため、この旧baseline差分もあわせて表示される。

追加側は、SKILL.mdへの追加4行（frontmatter description 2箇所のADAPT、`## 役割`冒頭のADAPT、`## 思考標準の参照`のADD）がすべて本ledgerの該当contractへ対応する。`think_standards/`配下12fileは新規untracked fileのため`git diff`の追加行としては表示されないが、内容は全件が本ledgerの`destination`と一致することをfile単位で確認した。

ledgerに載らない削除・追加は見つからなかった。

### 境界照合

SKILL.mdと`think_standards/`配下を合算して通読し、以下を確認した。

- 起動条件の判定（frontmatter description）は識別子を使わない表現へ揃えつつ、trigger keywordと他skillとの起動順序関係を保っている。
- `maintenance-plugin-context`への委譲（`## repository固有文脈`）はSKILL.md側に残り、変更していない。
- `think_standards/`への参照（`## 思考標準の参照`）が、path・READMEの位置付け・正本の所在の3点を持つ。
- READMEからの場面dispatchが、コア先読み→場面判定→複数該当時の全読み→consumer指定優先、の順に読める。
- 形式のprecedence（旧`### 形式の優先順位`）がcore.mdへ移り、`starting_to_think.md`と`core.md`自身から場面名リンクとして正しく参照される。

### 情報量signalの監査

移行前SKILL.md全478行に対し、移行後は縮小後`SKILL.md`（34行）+ `think_standards/`配下12file（459行、README.mdの新規収録一覧を含む）の合計493行であり、減少していない。減少ではなく増加している主因は、frontmatterやfile分割による見出し・空行の増加、および新設した`README.md`（ADD-01と一体のdispatch文書）である。意味単位の減少はなく、章を薄い箇条書きへ畳んだ範囲もない。

### 完了集計

```text
適合 164 / 合意済み追加 1 / 合意済み変更 0 / 明示廃止 4 / 未監査 0 / 未分類削除 0 / 未分類追加 0
```

内訳: `KEEP` 13 + `MOVE` 126 + `ADAPT` 25 = 適合164。`ADD` 1（ADD-01）。`CHANGE` 0（新たなCHANGEは発生しなかった）。`RETIRE` 4（A-05-1、A-11-1、A-16-1、A-17-1の区切り線・見出し、いずれも論点1「file分割が代替」で合意済み）。

### black-box scenario

- 選択肢を提示する場面でどの形式を使うか: `think_standards/README.md`の引き方→`core.md`の形式の優先順位→`presenting_options.md`の順でたどり着ける。
- 修正前の方針合意: `README.md`の「コアは場面を問わず先に適用する」→`core.md`の`## 修正前の方針合意`へ、場面非依存でたどり着ける。
- 複数場面が同時に該当する場合: `README.md`引き方の「複数の場面が同時に該当するなら該当分をすべて読む」へ到達できる。
- consumer側が形式を指定した場合: `README.md`引き方の「形式はconsumer側の指定が優先される」→`core.md`の`## 形式の優先順位`で、部分指定時のmerge規則までたどれる。

Phase 6完了。`未監査 0 / 未分類削除 0 / 未分類追加 0`を満たしたため、Phase 7へ進む。

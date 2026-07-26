# タスクリスト

## 実行ルール

- 各タスクが終わるたびに `[ ]` を `[x]` へ更新する
- 未完了タスクを残したまま完了扱いにしない
- 既存の `.steering/` ディレクトリは改名しない
- commit、push、PR 作成は今回の依頼範囲に含めない

## フェーズ1: `name-work-directory` skill を利用可能にする

### DoD

実行日が 2026-07-26、作業内容が「作業ディレクトリの命名を skill として切り出す」の場合、`name-work-directory` が `20260726-extract-work-directory-naming` のような basename を決められる。出力には親パスと branch 名が含まれない。

### タスク

- [x] `skill-creator` の `init_skill.py` で `plugins/tumeda-dev/skills/name-work-directory/` を初期化する
    - [x] UI metadata に `display_name`、`short_description`、`default_prompt` を指定する
    - [x] 不要な `scripts/`、`references/`、`assets/` は作らない
- [x] `SKILL.md` に作業ディレクトリ命名の契約を書く
    - [x] 入力を「作業内容」と実行時のローカル日付に限定する
    - [x] 出力を `YYYYMMDD-slug` の basename 一つにする
    - [x] slug の英語要約、lowercase kebab-case、3〜8語、動詞＋目的語優先の規則を書く
    - [x] 同じ作業中は名前を固定する規則を書く
    - [x] branch、親パス、ディレクトリ作成、衝突確認を責務外として明記する
    - [x] steering に依存しない一般例を含める
- [x] skill metadata と内容を検証する
    - [x] `agents/openai.yaml` が `SKILL.md` の目的と一致することを確認する
    - [x] `quick_validate.py` を実行して成功を確認する
    - [x] 実行コードを持たない instruction skill のため、テストコードは追加せず、代表入力と期待 basename の照合を regression check とする

## フェーズ2: steering を新しい命名 skill の消費側にする

### DoD

steering が `20260726-extract-work-directory-naming` を受け取った場合、`.steering/2026/202607/20260726-extract-work-directory-naming/` を作る手順になっており、branch の取得や埋め込みを行わない。

### タスク

- [x] `plugins/tumeda-dev/skills/steering/SKILL.md` の責務境界を更新する
    - [x] 固定の命名規則を `name-work-directory` の呼び出し契約へ置き換える
    - [x] `.steering/YYYY/YYYYMM/` の管理責務を steering に残す
    - [x] ディレクトリ作成手順を `YYYYMMDD-slug` 前提へ更新する
    - [x] branch 取得手順と `unknown-branch` fallback を削除する
- [x] `plugins/tumeda-dev/skills/steering/templates/roadmap.md` を更新する
    - [x] 子 steering のパスを `.steering/{YYYY}/{YYYYMM}/{YYYYMMDD}-{slug}/` に揃える
- [x] steering 配下の静的 regression check を行う
    - [x] `[branch]`、`{branch}`、`unknown-branch`、branch 取得 command が残っていないことを確認する
    - [x] 新形式の具体例から year と month の配置が一意に読めることを確認する
    - [x] instruction と template の変更で実行コードを持たないため、テストコードは追加せず静的参照検査を regression check とする

## フェーズ3: plugin の破壊的変更を version metadata に反映する

### DoD

Codex、Claude、marketplace が `tumeda-dev` version `2.0.0` を同じ値として読み取れる。

### タスク

- [x] 四つの version 宣言を `2.0.0` に更新する
    - [x] `plugins/tumeda-dev/.codex-plugin/plugin.json`
    - [x] `plugins/tumeda-dev/.claude-plugin/plugin.json`
    - [x] `.claude-plugin/marketplace.json` の root version
    - [x] `.claude-plugin/marketplace.json` の `tumeda-dev` plugin version
- [x] JSON parser で二つの plugin manifest と marketplace を読み込めることを確認する
- [x] 四つの version がすべて `2.0.0` で一致することを機械的に確認する

## フェーズ4: repository 全体の整合性を確認する

### DoD

新 skill が validator を通過し、現行の skill・template・manifest に旧命名契約や version 不整合が残っていない。変更差分が design の決定事項だけに対応している。

### タスク

- [x] `name-work-directory` に `quick_validate.py` を再実行する
- [x] repository 全体の関連参照を検索する
    - [x] 現行 skill と template に旧 `YYYYMMDD-branch-slug` 形式が残っていないことを確認する
    - [x] `.steering/` の既存履歴は検索結果に現れても改名対象にしない
    - [x] `name-work-directory` の参照元と責務境界を確認する
- [x] 配布 metadata の最終検証を行う
    - [x] JSON syntax が有効であることを確認する
    - [x] version 一致を再確認する
- [x] repository context に全体 test/lint command が未登録であることを確認し、未確認 command を推測実行していないことを記録する
- [x] `git diff --check` と差分通読を行い、空白エラー・意図しない変更・旧契約の残存がないことを確認する

## 動作確認

### DoD

ユーザーが `name-work-directory` の内容と steering の連携例を確認し、意図した責務分離と命名形式になっていると判断する。

### タスク

- [x] ユーザーに変更内容の確認を依頼する
- [x] フィードバックがある場合は `implementation_review.md` に収集する
- [x] フィードバックがない場合は、フィードバックありのため打ち消し完了とする

## フェーズ5: ドキュメント本文の日本語記述規則を適用する

### DoD

root `AGENTS.md` に repository 内のドキュメント本文をファイル種別・配置にかかわらず日本語で記述する規則と技術要素の原文維持例外がある。`name-work-directory/SKILL.md` は frontmatter description、見出し、説明、例の説明が日本語であり、命名契約と責務境界を維持する。`agents/openai.yaml`、既存ドキュメント、配布 version `2.0.0` は変更しない。

### タスク

- [x] root `AGENTS.md` に、repository 内ドキュメント本文の日本語記述規則を追加する
    - [x] ファイル種別・配置を限定しないことを明記する
    - [x] コード、command、path、識別子、規定された出力形式、固有名詞は原文維持とする
- [x] `plugins/tumeda-dev/skills/name-work-directory/SKILL.md` を日本語化する
    - [x] frontmatter description、見出し、説明、例の説明を日本語にする
    - [x] skill 名、`YYYYMMDD-slug`、basename 例、その他の技術的リテラルを原文維持する
    - [x] basename の命名規則と責務境界を変更しない
- [x] 対象外を維持する
    - [x] `agents/openai.yaml` を変更しない
    - [x] 既存ドキュメントの一括書き換えを行わない
    - [x] version `2.0.0` を追加 bump しない
- [x] `name-work-directory` に `quick_validate.py` を再実行する
- [x] 静的 regression check を行う
    - [x] 対象 `SKILL.md` に英語の説明文が残っていないことを確認する
    - [x] 技術要素の原文維持と翻訳前後の命名結果・責務境界の意味保存を確認する

## 完了後のアクション

今回の依頼には commit、push、PR 作成が含まれず、repository context に GitHub 公開契約も登録されていないため、外部状態を変更するアクションは行わない。

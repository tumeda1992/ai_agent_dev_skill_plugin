# Implementation Review: 作業ディレクトリ命名 skill 実装後レビュー

---

## 1. フィードバック収集

- **FB-1:** plugins/tumeda-dev/skills/name-work-directory/SKILL.md が英語で書かれている。 トップの AGENTS.md に日本語で書くよう記載して、今回のskillも日本語で書くようにして
- **FB-2:** plugins/tumeda-dev/skills/**/SKILL.md に限らず、ドキュメントの中身はすべて日本語。

---

## 2. 認識合わせ

### 論点1: 日本語で記述する対象範囲（FB-1、FB-2）

**提起の背景:** `name-work-directory/SKILL.md` が英語になった直接原因だけでなく、repository のどの成果物を日本語で統一するかという上位規則が root `AGENTS.md` に存在しなかった。最初の認識では対象を `plugins/tumeda-dev/skills/**/SKILL.md` に限定したため、ユーザーが求める repository 全体のドキュメント言語規則より狭かった。

**議論の変遷:**
- [前提] 新規 skill の `SKILL.md` が、frontmatter の `description` と本文を含めて英語で作成された。
- [フィードバック] ユーザーは、root `AGENTS.md` に日本語で書く規則を追加し、今回の skill も日本語にするよう求めた。
- [応答] `plugins/tumeda-dev/skills/**/SKILL.md` を規則の対象とし、技術的識別子を例外にする案を提示した。
- [疑問/反論] ユーザーは、対象を `SKILL.md` に限定せず、ドキュメントの中身はすべて日本語にするよう修正した。
- [変化点] 規則の軸はファイルパスやドキュメント種別ではなく、「repository 内のドキュメント本文」全体であると確定した。

**決定:** repository 内のドキュメント本文は、ファイル種別や配置場所を限定せず日本語で記述する。コード、command、path、識別子、規定された出力形式、固有名詞のように原文を保つ必要がある技術要素は翻訳対象外とする。

**決定理由:** `SKILL.md` だけを対象にすると、README、設計資料、template などで同じ問題が再発する。対象を「ドキュメント本文」に置けば、成果物の種類が増えても一つの規則で判断できる。一方、技術要素まで日本語化すると実行可能性・検索性・契約の正確性を損なうため、本文の説明言語と技術的リテラルを分ける。

---

## 3. 設計

### 完成後の姿

#### 操作フロー

**ケース1: 新しいドキュメントを作成・更新する**
```text
① agent が root AGENTS.md を読む
② repository 内のドキュメント本文を日本語で記述する
③ コード、command、path、識別子、規定された出力形式、固有名詞は原文を維持する
④ 読み返して、説明文が英語のまま残っていないことを確認する
```

**ケース2: `name-work-directory/SKILL.md` 修正後**
```text
① frontmatter の description を日本語で読む
② 見出し、説明、箇条書き、例の説明を日本語で読む
③ skill 名、YYYYMMDD-slug、basename の具体値などの技術的識別子は元の形式で読める
④ 英語版と同じ責務境界・命名結果を維持したまま skill を利用できる
```

---

## 4. 追加実装フェーズ

### フェーズ5: ドキュメント本文の日本語記述規則を適用する

#### DoD

- root `AGENTS.md` が、repository 内のドキュメント本文をファイル種別・配置にかかわらず日本語で記述する規則を定めている。
- コード、command、path、識別子、規定された出力形式、固有名詞を原文のまま維持する例外が規則に含まれる。
- `plugins/tumeda-dev/skills/name-work-directory/SKILL.md` の frontmatter description、見出し、説明、例の説明が日本語であり、basename の命名契約と責務境界は変わらない。
- `agents/openai.yaml` は今回の対象外として変更しない。既存ドキュメントの一括書き換えも行わず、配布 version は `2.0.0` のままとする。

#### タスク

- [ ] root `AGENTS.md` に repository 内ドキュメント本文の日本語記述規則と技術要素の原文維持例外を追加する。
- [ ] `plugins/tumeda-dev/skills/name-work-directory/SKILL.md` の frontmatter description、見出し、説明、例の説明を日本語化し、技術的リテラルと命名・責務契約を維持する。
- [ ] `agents/openai.yaml`、既存ドキュメント、配布 version を変更しないことを確認する。
- [ ] `quick_validate.py` を再実行する。
- [ ] 英語の説明文が対象 `SKILL.md` に残っていないこと、技術要素は原文維持されていること、翻訳前後で命名結果と責務境界が同じであることを静的確認する。

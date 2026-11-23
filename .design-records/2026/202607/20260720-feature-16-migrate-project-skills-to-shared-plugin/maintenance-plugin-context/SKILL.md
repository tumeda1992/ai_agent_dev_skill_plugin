---
name: maintenance-plugin-context
description: tumeda-dev pluginのrepository contextを探索・作成・最小更新・選択的解決する。plugin skillがリポジトリ固有の文書、command、規約を必要とする時、または`.agents/skills/tumeda-dev-plugin-context.md`を新規作成・更新する時に使う。文脈が不要な通常作業には使わない。
---

# Plugin context maintenance

repository contextのlifecycleはこのskillだけが管理する。consumer skillはinstanceを直接作成・更新しない。

## 入力

consumerから、自由なMarkdownで次を受け取る。

- consumer skill名
- repository固有文脈が必要な理由
- 必要な事実または対象section
- 確認元候補（文書path、設定、remoteなど）

入力が不足しても、必要なsectionを推測しない。consumerに不足を返す。

## 解決とmaintenance

1. Git rootを取得する。`git rev-parse --show-toplevel`が失敗したら、cwdをrootとみなさない。`unavailable`を返す。
2. `<git-root>/.agents/skills/tumeda-dev-plugin-context.md` を探す。
3. instanceがあれば構造を読む。構造を読めない時は修復・再生成せず`unavailable`を返す。読める時だけ、consumerのsectionと、このskillが定めた対象`共通`項目を解決する。
4. instanceがなく、repository固有文脈が必要なら、現在実行中のこのskillの`SKILL.md`から親の親directory（pluginの`skills/` root）にある`tumeda-dev-plugin-context.md`をtemplateとして読む。template sourceを特定または読取できなければ、独自形式のfileを作らず`unavailable`を返す。
5. `.agents/skills/`を必要最小限に作り、templateをinstanceへコピーする。確認元から検証できる安定factだけを、要求されたsectionへ最小限に書く。
6. 既存instanceを更新する時も、要求されたsectionだけを追記または修正する。他skillのsection、未要求の`共通`項目、既存の利用者記載を消去・再生成しない。
7. 保存後に同じinstanceを読み直す。書込み結果と選択的読取範囲を確認してから返す。

書込み権限がない、確認元がない、または事実を検証できない時は、推測・空欄の補完・部分templateの自作をしない。既存instanceから安全に読める範囲だけを返し、必須factがなければ`unavailable`にする。

## 選択的読取

返す実効文脈は次だけにする。

```text
consumer固有情報 ∪ (共通情報 ∩ consumerが直接使う項目)
```

`共通`には、2つ以上のconsumerが同じ意味・粒度で直接使うrepository factだけを置く。1つのconsumerだけが使うfactは、そのconsumerのH2へ置く。session中の議論、TBD、task状態、skill手順はinstanceへ書かない。

この移行での直接参照項目は次の通り。

| consumer | `共通`から返す項目 |
| --- | --- |
| `think-through` | プロジェクト指示 |
| `design-consult` | アーキテクチャ文書 |
| `doc-enricher` | プロジェクト指示、アーキテクチャ文書 |
| `task-design` | プロジェクト指示、アーキテクチャ文書、開発規約、テスト方針 |
| `steering` | プロジェクト指示、アーキテクチャ文書、開発規約、テスト方針、全体 test command、全体 lint command |
| `visual-inspector` | プロジェクト指示 |
| `tasklist-executor` | プロジェクト指示、アーキテクチャ文書、開発規約、テスト方針、全体 test command、全体 lint command |
| `test-runner` | プロジェクト指示、テスト方針、全体 test command |

consumerのH2以外と、表にない`共通`項目は返さない。新しいconsumerまたは新しい共有項目は、consumerが必要理由を添えて明示した時だけ追加する。

## 返却形式

consumerへ次を短く返す。

```markdown
status: available | unavailable
repository root: <path または unavailable>
context instance: <path または unavailable>
allowed context:
- <H2 / H3 と確認済みfact>
changed:
- <作成・更新した対象sectionと確認元。変更なしならその旨>
unresolved:
- <不足fact。なければなし>
fallback:
- <一般手順を続行 / 必要入力を求める>
```

`available`でも、返却した`allowed context`以外をconsumerが読まないことを明示する。

## consumerの境界

repository固有文脈が不要なら、このskillを呼ばず一般手順を続ける。必要ならこのskillへ委譲し、返された範囲だけを読む。

必須文脈が`unavailable`なら、consumerは推測しない。repository固有文脈なしで安全に完結できる一般手順へ縮退するか、repository root・確認元・必要factの提示を求める。

---
name: maintenance-plugin-context
description: tumeda-dev pluginのrepository contextと配布version規約を管理する。plugin skillがリポジトリ固有の文書、command、規約を必要とする時、`.agents/skills/tumeda-dev-plugin-context.md`を新規作成・更新する時、またはplugin versionを変更・検証する時に使う。文脈もversionも不要な通常作業には使わない。
---

# Plugin context maintenance

repository contextのlifecycleとpluginの配布version規約はこのskillだけが管理する。consumer skillはinstanceを直接作成・更新しない。

## Maintenance policies

このpluginのskill保守で従う規約は `maintenance_policies/` に置く。

- [`../../docs/common_standard/function_migration_policy.md`](../../docs/common_standard/function_migration_policy.md) — 配置やownerを変えても挙動と意味を全量維持するfunction migrationの共通規範。baseline、二層ledger、個別合意、white-box検証、完了gateの正本。function migrationを始める前に必ず読む。
- `maintenance_policies/migration.md` — skillを参考元（移植元 upstream）や参照先リポジトリと行き来させる（新規移植・追随・逆輸入）時の追加規約。**取り込む内容から参照元リポジトリ固有の情報を抜き、汎用知識だけをpluginへ記載する**。skill本体・`.steering/` 成果物・docs・slugすべてに適用する。共通規範とこのfileを移植・追随作業の前に必ず読む。
- 利用先repositoryでこのpluginの成果物への修正提案が生じた場合の引き渡しは`escalate-plugin-skill-fix`が所有する。修正の議論と変更は正本repositoryで行う。

## Plugin version

`tumeda-dev`の配布versionはSemVerに従い、**release versionとして`MAJOR.MINOR.PATCH`だけ**を使う。`1.0.0`のように3つの非負整数を`.`で結ぶ。SemVerで許されるpre-release/build metadataも、このpluginでは使わない。

- 禁止: `1.0.0+codex.20260720074613`、`1.0.0-dev`、日時・host名・cachebusterを足した形式
- 破壊的変更はMAJOR、後方互換な機能追加はMINOR、後方互換な修正・文書変更はPATCHを上げる
- MINORとPATCHの境界は「consumerが新たに呼べるものが増えたか」で判定する。新しいskill、新しいparameter等、利用側の呼び出し方が増えるならMINOR。既存skillの内容修正、docsの追加・変更はPATCH。新規fileの追加それ自体はMINORの根拠にならない。区別しているのは機能追加か文書変更かであり、file数の増減ではない
- 配布する変更には、変更内容に見合うversion bumpを一度だけ行う。cacheを更新したいだけのsuffix追加や同一releaseの再versioningはしない
- Codexのcache更新に`update_plugin_cachebuster.py`を使わない。必要なら正式にPATCH以上を上げてから、通常の再install / reload手順を使う

versionを変更または配布前に検証する時は、`tumeda-dev`の次の宣言値が同じ`MAJOR.MINOR.PATCH`であることを確認する。

- `plugins/tumeda-dev/.codex-plugin/plugin.json` の `version`
- `plugins/tumeda-dev/.claude-plugin/plugin.json` の `version`
- rootの`.claude-plugin/marketplace.json` の `version`
- rootの`.claude-plugin/marketplace.json` の `plugins[]` 内、`name: tumeda-dev` の `version`

いずれかにsuffixがある、または値がずれる時は、そのままinstall / releaseしない。変更の互換性を判定して正しいrelease versionへ揃える。

宣言値に加えて、`scripts/verification/validate-plugin.mjs` の `expectedRelease` を同じ値へ更新する。これは配布manifestの宣言値ではなく検査側の期待値であり、四つの宣言値が揃っていることに加えて、意図したrelease versionであることを確かめる。更新しないと`plugin validation failed`になる。version bumpは宣言値四箇所と期待値一箇所の計五箇所を一度に変える作業である。

`expectedRelease`を宣言値から動的に読ませない。四つが揃ってさえいれば通る状態になり、意図しないversion変更を検知できなくなる。

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
| `doc-enricher` | プロジェクト指示、アーキテクチャ文書 |
| `task-design` | プロジェクト指示、アーキテクチャ文書、開発規約、テスト方針、全体 test command、全体 lint command |
| `steering` | プロジェクト指示、アーキテクチャ文書、開発規約、テスト方針 |
| `visual-inspector` | プロジェクト指示 |
| `tasklist-executor` | プロジェクト指示、アーキテクチャ文書、開発規約、テスト方針、全体 test command、全体 lint command |
| `test-runner` | プロジェクト指示、テスト方針、全体 test command |

consumerのH2以外と、表にない`共通`項目は返さない。新しいconsumerまたは新しい共有項目は、consumerが必要理由を添えて明示した時だけ追加する。

task-designがexecution planを設計する時は、全体test/lint commandに加え、`## task-design`内のUI確認環境とGit/GitHub公開条件を必要factとして要求できる。これらはtasklistへ検証・公開actionを含めるか判断するためのcontextであり、steering固有情報として返さない。

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

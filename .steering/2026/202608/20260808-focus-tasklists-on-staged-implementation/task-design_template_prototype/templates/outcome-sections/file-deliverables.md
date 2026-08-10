### documentation以外のfile deliverable

<!--
skill、prompt、template、manifest等、documentation以外のfile成果物の「中身」を完成後の姿として設計する。documentationは`documentation.md`、runtime設定と環境構築は`runtime-and-configuration.md`が所有する。

なぜ必要か:
- 「skillを更新する」「templateを作る」というlistingだけでは、実装者が内容、配置、形式を独自判断するため。
- fileの役割と実行workflowを混ぜ、source artifactとruntime contractのownerが曖昧になることを防ぐため。

NG:
- skillを更新する
- prompt templateを追加する

具体的な記述例:
skills/review-workflow/SKILL.md:
- 構成: (1) triggerと非trigger (2) ownerと入力 (3) workflow (4) failureとhandoff
- 形式: Markdown、frontmatterを既存skill schemaに合わせる
- 配置: skills/review-workflow/
- 実行時のgateと状態遷移は`workflow.md`で設計し、このsectionへ複製しない

記述のMUST:
- 対象file、主な読者、読後にできる判断またはactionを示す。
- 完成後の見出し、section、entry、template構造を示す。
- 書く原則だけでなく、今回の具体例を示す。
- 配置と形式を、既存正本・重複防止・既存patternとの関係で説明する。
- 該当するdeliverableがない場合だけ「なし」と明記する。

判断基準:
- このdeliverableを渡された実装者が、中身について独自判断せず作れるか。
- このdeliverableを読んだ将来の利用者が、source artifactの目的と使い方を判断できるか。
- file名だけでなく、内容と責務境界が完成後の状態として読めるか。
- documentationの知識体系やruntime条件をこのsectionへ重複させていないか。
-->

**対象と読者:**

| file | 主な読者 | 読後または利用後にできること |
| --- | --- | --- |
| `{path}` | {読者} | {判断・実行できること} |

**完成後の内容と構造:**

```text
{見出し、section、entry、template、設定file等の具体構造}
```

**記載する原則と例:**

- {原則}
  - 今回の具体例: {このtaskでの適用}
  - 意図に反する薄い記述: {禁止する書き方と、なぜ判断能力が落ちるか}

**配置・形式:**

- 配置: `{path}`
- 形式: {Markdown、config形式、既存template等}
- 参照する既存pattern: `{pathまたは正本}`
- 正本と重複防止: {他fileへ同じ内容を複製しない境界}

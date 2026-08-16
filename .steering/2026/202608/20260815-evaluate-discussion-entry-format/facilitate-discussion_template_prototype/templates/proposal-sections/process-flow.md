# process・workflow・思考手順を図示する

## 使用条件

process、workflow、思考手順の順序、分岐、戻り先、循環について認識を合わせる時に使う。手順名の列挙ではなく、どこからどこへ進み、何を条件に枝分かれまたは遡及するかが判断対象になる場合を扱う。

discussionの提案はfileだけでなくchatにも提示されるため、render済みMarkdownとraw textの両方で判断対象を読める記法を選ぶ。

## template

````markdown
{この図で判断するprocessの範囲を一文で示す。}

```text
{順序、分岐、戻り先、循環を、矢印、罫線、indent等で図示する。}
```

{図だけでは分からない分岐条件、意味、例外があれば必要な分だけ説明する。}
````

短いflowは、sourceのまま読める`text`表現を第一選択にする。Mermaidは、textでは関係を保ったまま表せない複雑さがあり、かつ実際に判断するchatまたはviewerでinline renderされる場合だけ使う。Mermaidを見るために読者が別の表示modeへ切り替える必要がある場合は使わない。

単独の認識合わせにも、complete stateや重い選択肢の内部にも使える。図示する関係に合う記法を選び、特定caseの文言やnodeを固定templateとして複製しない。

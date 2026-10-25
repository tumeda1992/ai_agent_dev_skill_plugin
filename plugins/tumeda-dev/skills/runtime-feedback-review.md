# 実装feedbackの記録と返却

steeringまたはtasklist-executorが、実装・review・validation・利用者確認のfeedbackを直接受領した時に読む。
直接受領したworkflow ownerが記録からdecisionの返却までを持つ。呼出し元のwriter・実装開始権限・完了条件は変更しない。
通常の成功したreview結果をtask検証記録へ保存するだけの場合は、新しい議論を作らない。
不合格・不足・訂正・漏れ・追加要件・計画からの意味ある逸脱を扱う場合に、次の既存手順へ入る。

実装、review、validation、ユーザー動作確認でfeedback・漏れ・追加要件・不具合が判明したら、同じworking directoryでpluginの`facilitate-discussion`を適用する。ユーザーから受け取ったものも、agent自身が見つけたものも同じ扱いにする。

適用するのは、それを直接受領したworkflow ownerである。steeringが直接受領した場合はsteering自身が行い、議論だけを別childへ再委譲しない。

```text
discussion_directory=<呼出し元のworking directory>
discussion_file_name=implementation_review.md
```

feedback原文、関連する実装、`design.md`、排他的plan、原因、採用方針、決定を渡す。既に修正済みのfeedbackでも記録を省略しない。`implementation_review.md`はfeedback議論の正本だけを担い、designまたはplanの正本を複製しない。

各feedbackについて、次の三問を順に扱う。

1. 根本原因となる未共有知識は何か。
2. codeから分かるか、設計意図か、process不足か。
3. どこへ保存すれば次回の議論を不要にできるか。変更は合意後だけ行う。

decision後、直接受領したworkflow ownerはcallerへdecisionを返し、次の戻り先を一意に選ぶ。

- 完成後の姿、要件、設計根拠、公開API、module境界が変わる: 同じworking directoryでtask-designのdesign phaseへ戻す。
- task順、task粒度、検証手順が変わる: task-designのtasklist plan phaseへ戻す。
- roadmapのphase identity、目的、scope、scope外、DoD、依存、親DoD coverageが変わる: task-designのroadmap plan構造へ戻し、親designへの影響を判定する。親designが変わる場合だけdesign phaseへ戻す。
- roadmapの子path、status、完了日だけが変わる: steering runtimeで更新する。
- repository知識の永続化だけが必要: doc-enricher等のwriter contractに従い、承認後だけ既存READMEまたは既存docsへ反映する。
- 認識合わせだけで完了する: designとplanを変更しない。

設計判断が必要な変更では、design合意前にtaskを作らない。reviewのdecisionやtask追加後も実装を自動再開しない。同じfeatureの追加taskは合意済みdesign・planへ戻した後、既存tasklistへ追加する。

計画からの意味ある逸脱も`implementation_review.md`で扱う。roadmapの`全フェーズ完了日`または`計画と実績の差分`fieldは作らない。全体完了は各phaseのstatusと完了日から導出する。

処理後は、呼出し元の元のtask・phaseへ記録とdecision、未完範囲、必要な戻り先を返す。
設計・planの差戻しや利用者の確認を待つ場合は、影響するtaskを未完に保つ。
無関係な確定taskの実行可否は既存planと権限で判断し、feedbackがあることだけで全作業を停止しない。

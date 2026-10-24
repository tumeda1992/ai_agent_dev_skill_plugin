### 調査・比較・技術検証によるfindings

<!--
移行元:
- task-design/SKILL.md「不確実性のためならcodeを書く」
- task-design/SKILL.md「investigation.mdのlifecycle」
- task-design/SKILL.md「技術検証実装の配置・運用」

調査、比較、技術検証によって未知だった問いを確定すること自体がsteeringの主成果である場合だけ使う。別artifactを設計する途中で得た事実は、そのartifactのoutcome sectionへ根拠として書き戻す。

なぜ必要か:
- external API、auth、environment依存の挙動を推測で埋めることを防ぐため。
- 「調べた」「動いた」という活動報告ではなく、evidenceから何が言え、何はまだ言えないかを成果にするため。
- environmentやversionが変わった後も、findingの適用可否と再検証時期を判断できるようにするため。

NG:
- APIはこのresponseを返すはず
- spikeを実装した
- testしたら動いた
- command出力やreading logをそのまま貼る
- 一つの具体ケースから標準や運用規律を直接作る。それは`documentation.md`が所有する
- 技術検証codeをそのままproduction実装として継続する

具体的な記述例:
- 未知だった問い: 404 responseでbodyがJSONか空か
- 推測で決められない理由: official schemaがerror bodyを規定していない
- 確認方法: sandbox endpointへ存在しないdocumentIdを送信
- evidence: API version v2でHTTP 404、bodyは{"error":"not_found"}
- finding: version v2のsandboxでは404 bodyにerror fieldが存在する
- 可能になった判断: parserはerror fieldを読める
- まだ言えないこと: productionも同じbodyを返すこと
- 再検証trigger: API versionまたはofficial error schemaの変更

記述のMUST:
- 未知だった問い、推測で決められなかった理由、調査sourceまたは再現方法、evidence、findingを分ける。
- comparison条件、command、environment、version等、別の実行者が追試できる条件を示す。
- evidenceから直接言えるfindingと、findingにより可能になった判断を混同しない。
- findingの適用範囲、確度、反証条件、まだ言えないこと、再検証triggerを示す。
- raw logと試行錯誤は`investigation.md`または`spike/`へ置き、このsectionには結論へ必要なevidenceだけを残す。
- spikeは不確実性解消の手段であり、production変更としてexecution planへ載せない。

判断基準:
- 同じ条件で別の実行者がevidenceを再確認できるか。
- evidenceを超えた一般化をfindingとして書いていないか。
- findingが変わった時、どの判断を再検討すべきか追えるか。
- 調査活動ではなく、未知だった問いに対する再利用可能な答えになっているか。
-->

**未知だった問い:**

- {確定したい問い}
- 推測で決められなかった理由: {source不足、環境依存、選択肢間の未比較等}

**調査・再現条件:**

| source / method | comparison条件・environment・version | 再現方法 |
| --- | --- | --- |
| {公式source / reading / spike} | {条件} | {commandまたは手順} |

**evidenceとfinding:**

| evidence | evidenceから直接言えるfinding | 確度・適用範囲 |
| --- | --- | --- |
| {観測結果またはsource} | {過剰一般化しない結論} | {確度、environment、version、前提} |

**可能になった判断と限界:**

- 可能になった判断: {findingにより一意になった判断}
- まだ言えないこと: {未検証の範囲、残る不確実性}
- 反証条件: {何が観測されたらfindingを撤回するか}
- 再検証trigger: {API、dependency、environment、前提の変更}

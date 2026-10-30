# Runtime model profiles

skillが要求するのはprovider固有のmodel名ではなく、必要な推論強度profileである。Claude CodeとCodexのadapterは、このprofileをそれぞれのhostで選べるmodelへ変換する。

## 推論強度の基準

main sessionで適用するskillはhostのdefaultで動かし、frontmatterで`model`と`effort`を宣言しない。現在のdefaultはOpus相当である。

childとして委譲する先はSonnet相当で足りる。`delegated-execution`がこれを表す。

## delegated-execution

tasklist実行、test失敗分析、UI確認など、手順遵守と実装・調査を主とする作業用。

- Claude Code: frontmatterは`model: sonnet`。
- Codex: child modelを選べるruntimeでは、利用可能な標準のCodex coding modelを選ぶ。選択面がなければ親sessionのmodelを継承する。
- 返却: parentは必要なら、選択したmodelまたは親model継承をsummaryへ残す。

使用skill: `visual-inspector`、`tasklist-executor`、`test-runner`。

## adapter規則

- skill本文はprofile名を参照し、provider固有model名を判断根拠にしない。
- Claude Codeではprofileに対応する`model` frontmatterを使う。
- Codexでは各skillの`## Codex`がprofileを読み、直近parentへchild起動時のmodel選択または親model継承を指示する。
- hostがprofile相当のmodelを選べない時、存在しないmodel名を指定して失敗させない。親model継承をfallbackとし、必要なら返却summaryで明示する。

## release確認

- 各profileを使うClaude Code skillのfrontmatterが、このfileのClaude selectorと一致することを確認する。
- Codexでchild model選択面がある時はprofile相当のmodel選択を、ない時は親model継承をsmoke testする。
- hostのmodel提供が変わった時は、profileの目的を保ったままこのfileのhost adapterだけを更新する。

## high-reasoning-review

全体の契約、認可、データ整合性、異常系、設計境界を横断して判断するレビュー用。
main sessionでは利用者が選択した高推論モデルを使い、frontmatterでmodel/effortを固定しない。

- Claude Code: 利用者指定を優先し、選択可能ならOpus相当を使う。
- Codex: 利用者指定を優先し、選択可能ならAstra相当の高推論モデルを使う。
- 選択面がない場合は親モデルを継承し、制約を明示する。存在しないモデルを指定しない。
- モデル名だけを品質の証拠にせず、対象スナップショットと指摘の根拠を残す。

使用skill: `high-reasoning-audit`。

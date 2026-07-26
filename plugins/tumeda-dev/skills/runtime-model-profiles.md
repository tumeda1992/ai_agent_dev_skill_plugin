# Runtime model profiles

skillが要求するのはprovider固有のmodel名ではなく、必要な推論強度profileである。Claude CodeとCodexのadapterは、このprofileをそれぞれのhostで選べるmodelへ変換する。

## deep-design

設計選択、型・責務境界、複数案のトレードオフなど、深い推論を必要とする相談用。

- Claude Code: frontmatterは`model: opus`。
- Codex: child modelを選べるruntimeでは、利用可能な最高推論のCodex modelを選ぶ。選択面がなければ親sessionのmodelを継承する。
- 返却: childを起動したparentは、選択したmodelまたは親model継承をsummaryへ残す。

使用skill: `design-consult`。

## standard-execution

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

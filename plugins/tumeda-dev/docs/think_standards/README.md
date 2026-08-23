# think_standards

## 導入

この標準群は、議論・思考プロセスの作法を扱う。`think-through` skillからの入口であり、このrepositoryにおける思考標準の内容の正本である。何をどの場面で参照するかのハンドリング方針は、この`README.md`が持つ。

対象は、思考・議論プロセスが絡む全場面である。ドメイン固有の判断基準（命名、architecture等）は対象外であり、対応する専用documentが持つ。

## この標準群の引き方

- コアは場面を問わず先に適用する。
- 該当する場面を判定し、その場面のfileを読む。
- 複数の場面が同時に該当するなら、該当分をすべて読む。
- 形式はconsumer側の指定が優先される（[core.mdの形式の優先順位](./core.md#形式の優先順位)を参照）。

## 収録一覧

- **[core.md](./core.md)** — 唯々諾々の禁止、修正前の方針合意、形式の優先順位。場面を問わず常時適用する
- **[考え始め](./starting_to_think.md)** — 事象から原因へ降り、提案を検証まで通す
- **[ユーザーから指摘・提案を受領した](./receiving_feedback.md)** — 自分で考えてから問う
- **[議論進行中](./advancing_discussion.md)** — 問いはロジックツリーの上位から再帰的に掘り下げる
- **[抽象を書く](./writing_abstraction.md)** — 抽象と具体の往復をワンショットで行う
- **[型・スキル・テンプレートを直したい](./updating_types.md)** — スキル・テンプレートを直す前に、今のファイルで正しい形を合意する
- **[エラーが出た](./handling_errors.md)** — エラーは消す前に原因を特定する
- **[選択肢を提示する](./presenting_options.md)** — a/b/c または 1/2/3 で答えられる形式
- **[複数事項が並ぶ、または作業中に事項の状態が変わった](./ordering_parallel_items.md)** — readyな確定事項を先に完了する
- **[広くvariationのある対象へ適用方針を作る](./designing_for_variations.md)** — 具体caseと方針群を反復往復し、全caseを扱えるまで帰納する
- **[evolution_policy.md](./evolution_policy.md)** — 維持規律。標準群を変える後続改善者が場面の追加・統合・分割時に読む

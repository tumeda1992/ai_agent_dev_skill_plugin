# plugins/tumeda-dev/skills/

## このREADMEの位置付け

このディレクトリは Claude Code / Codex 用の skill を格納している。

AI は各 skill の `SKILL.md` 冒頭の description を読めば、
いつ起動すべきか・何をする skill かを把握できる。
したがって **このREADMEは AI 向けではなく、人間が skill 群の全体像を俯瞰するための目次** として用意した。

このpluginは「リポジトリ横断でよく使う開発 skill 集」であり、
repository固有のfactは各利用先の `.agents/skills/tumeda-dev-plugin-context.md` に置く
（本文の作成・更新・読取範囲は `maintenance-plugin-context` が管理する）。

## このREADMEを書くときの方針

- **個々の skill の詳細は書かない**。詳細は各 skill ディレクトリの `SKILL.md` を見れば足りる。
  ここでは1行程度の概略にとどめる。
- **「トップ階層に何があるか」を一目で把握できること** を最優先する。
- そのために、オーケストレータ skill が呼び出す下位 skill は **階層構造で表現** する。
- 注意点として、階層配下の skill も単独起動可能であり、特定のオーケストレータ専用ではない。
  ただし「トップ階層を見渡す」という観点では、配下を畳んだ方が見通しがよいため、便宜上ぶら下げて表示している。
- skill が増減したらこのREADMEも更新する。詳細は書かず、見出し1行の追加・削除で済むように保つ。

## 階層構造

- **think-through** — 議論・思考プロセスの作法。毎ターン適用する想定の常時注入型。steering / task-design / design-consult を呼ぶ前段にも効く。
- **steering** — Spec-driven plan を `.steering/` に落とす計画フェーズのオーケストレータ。Design 合意 → Tasklist 合意で終了し、実装は別コマンドに渡す。
  - **task-design** — 実装前の不確実性をゼロにする設計プロセス。steering が設計フェーズで委譲する。
- **tasklist-executor** — steering が生成した `tasklist.md` を上から順に実装・テスト・更新する実行フェーズのオーケストレータ。未完了タスクがなくなるまで繰り返す。
  - **test-runner** — テスト実行と失敗分析。executor が共通契約で child 委譲する。
  - **visual-inspector** — Playwright で UI をスクリーンショット目視確認。executor が委譲する（steering も現状のファクト確認に使う）。
- **design-consult** — Opus サブエージェントで設計の選択肢・トレードオフ・ドメインモデルを深く相談する。
- **doc-enricher** — コードリーディング/タスク遂行後、永続性が高い知識をディレクトリ README に提案する（デフォルトは提案のみ）。
- **maintenance-plugin-context** — plugin の repository context と配布 version 規約を管理するメタ skill。

## 共有リファレンス（skill ではない）

直下に置く、skill 本文から参照される host 非依存の共通ドキュメント。

- **runtime-execution-contracts.md** — tasklist-executor が visual-inspector / test-runner へ child 委譲する時の共通契約（状態の正本・single writer・停止理由）。
- **runtime-model-profiles.md** — skill が要求する推論強度 profile を、各 host の実 model へ変換する対応表。
- **tumeda-dev-plugin-context.md** — 利用先 repository に置く context ファイルのテンプレート雛形。

## 詳細を知りたいとき

各 skill ディレクトリ配下の `SKILL.md` を参照する。

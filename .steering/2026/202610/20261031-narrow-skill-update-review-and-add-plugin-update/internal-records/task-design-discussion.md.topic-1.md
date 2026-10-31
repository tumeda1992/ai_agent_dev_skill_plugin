# 内部検討記録: 論点1 — escalate-plugin-skill-fix の取り込みの手順に、plugin の update を足す

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点1

## 開始context

元の作業（`.steering/2026/202610/20261031-adopt-escalated-commit-practice-improvements/`）で、assistant は取り込みと plugin の update を利用者へ依頼し、利用者に「え、escalateがやること終わってから私の作業じゃない？」「updateもあなたでしょ」と正された（2026-10-31）。
assistant は「次の steering で一緒に扱う」と報告し、利用者の次の応答（「打った」）に異論は無かった。手順として足す中身は assistant が書いたものである。

<a id="iteration-0"></a>

## イテレーション0: 変更の中身と置き場所

<a id="iteration-0-record-1"></a>

### 調査: 今の手順と、実際に行った update

#### 入力

- 問い: 今の escalate の手順はどこで終わるか。update の手順と session への反映は、実際にどう動いたか。
- 方法: 2026-10-31 に `escalate-plugin-skill-fix/SKILL.md` の全体を読んだ。元の作業で実際に行った update の結果を見直した。利用先 repository の指示（plugin の local 開発の手順）を読んだ。plugin repository の `README.md` を「marketplace」「install」「update」「reload」で検索した。

#### 結果

- 今の手順: 「plugin repositoryでの作業完了後の取り込み」は 4 step（作業 branch の push、`main` への切替、merge、`main` の push）で終わる。update への言及は無い。
- 実際の update（2026-10-31）:
    - marketplace の update の後、plugin の update で 8.2.0 から 8.2.1 になった。CLI は「Restart to apply changes」と出した。
    - install した plugin の記録の commit は `main` の先端と一致した。install された file の中身も source と一致した。
    - 利用者が `/reload-plugins` を打つと、同じ session で新しい version の skill が読み込まれた（以後の skill の base directory が 8.2.1 になった）。
    - `claude` の CLI は、shell の PATH に無い場所にあった。場所は環境ごとに違うため、plugin へは書かない。
- 利用先 repository の指示は、plugin の source を更新した後、同じ marketplace 経由で reinstall・reload すると書く。agent を名指ししない。
- plugin repository の `README.md` に、install・update の手順は無い。
- 「引き渡し後」は「修正したskillは、今実行中のsessionへは反映されない。…修正後のskillで動きたい場合は、sessionをresumeする」と書く。reload で反映できることと合わない。

<a id="iteration-0-record-2"></a>

### 判断: 中身と置き場所

#### 入力

- 問い: 手順として何を書き、どこに置くか。利用者の採否が要るか。
- 方法: 上の結果を、利用者の発言、20261018 の論点38 の決定、`skill-update-review/assess-structure.md` の切り出しの基準、facilitate-discussion の `derived-change.md` に照らした。

#### 結果

- 中身: update（5）、commit の確認（6）、session への反映の案内（7）。利用者へ依頼するのは、agent から実行できない 7 だけとする。
    - command は Claude Code の例として、marketplace 名と plugin 名を変数にして書く。使用中の agent が違えば、その agent の marketplace 経由で行う。
- 置き場所: escalate の内部指示 `integrate-plugin-changes.md` へ分ける。
    - 取り込みと反映は、始まる時点（plugin repository の steering の完了）、完了条件（install した plugin が `main` と一致する）、改訂理由（agent の update の手段、Git の運用）が、引渡しと別である。
    - 20261018 の論点38 は、別々に改訂する内部処理を、絡み合いの負担が無くても file に分けると決めた。
    - `SKILL.md` に見出しを残し、context file の参照（見出しの名前）を保つ。
- 利用者の採否は要らない。担い手は利用者の発言で、中身は利用先の指示と実際の手順で、置き場所は既決の基準で決まる。導出変更として報告し、次の実応答を確かめてから反映する。
- skill-update-review（設計時）: 元の作業の論点9 の決定に従い、切り出しの判断だけを当てた。結果は上の置き場所の判断である。内容 hash の記録と、切り出し以外の照合は行わない。

<a id="iteration-0-record-3"></a>

### 判断: 決定の後の doc-enricher の提案 review（origin: 論点1 の決定）

#### 入力

- 問い: 論点1 の決定から、README や既存 docs に足すべき、再利用価値の高い知識があるか。
- 方法: 2026-10-31 に、決定と plugin repository の `README.md`（運用契約、変更時の検証と前提）を照らした。

#### 結果

- 候補なし。取り込みと反映の手順は escalate の内部指示が正本であり、`README.md` へ写すと二か所になる。

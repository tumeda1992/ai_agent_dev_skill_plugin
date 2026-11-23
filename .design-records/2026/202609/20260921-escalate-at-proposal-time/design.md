# Design: escalate 後の context 喪失を止める

## 元の依頼内容

利用先 repository から `escalate-plugin-skill-fix` で引き渡された提案のうち、提案6 を扱う。

> escalateスキルについて基本的に提案されたリポジトリのセッションで直す。提案したリポジトリの目下の課題解決してから、と後回しにされることもおおいから、長くなったセッションで別トピックだけど、それでも、問題があったからescalateされているわけで、その問題をわざわざ説明しなくても同じ視点で見てる人と解決を図りたいから長くなっても同じセッションで片付ける方針にしたい

**この発言は一貫して session の話である。** 「提案されたリポジトリのセッションで直す」「長くなっても同じセッションで片付ける」はどちらも、session を切り替えないことを求めている。

実際に起きていたのは次である。escalate は同じ session 内で行われた。その後、assistant が session の新規作成を繰り返し促した。

---

## 上位roadmap制約

- 親roadmap: `.steering/2026/202609/20260921-apply-escalated-skill-fixes/roadmap.md`
- 親phase identity: `escalation-without-context-loss`
- 親phaseの目的: escalate 後に session の新規作成を促され、context が失われる状態を解消する
- 親phaseのscope: 「引き渡し後」の記述 / session の新規作成と resume の区別 / 元 task をどう続けるかの選択
- 親phaseのscope外: escalate の起動タイミング / 後回し中の提案の記録先 / 他の 5 phase が扱う skill の内容
- 親phaseのDoD: 下記「受け入れ基準」へ展開する
- 依存phase: なし

**この phase 定義は、設計中に訂正した。** 当初は `escalation-without-deferral`（提案が溜まってから一括で引き渡される状態を解消する）として定義されていたが、起点の発言を「いつ escalate するか」というタイミングの話として誤読したものであった。誤読は親 steering で assistant が書いたものであり、この phase の設計を四度やり直す原因になった。訂正の経緯は `task-design-discussion.md` の論点1・2（取下げ）と論点4 にある。

---

## 調査で確定した事実

**促している出典は skill 自身にある。**

```text
## 引き渡し後（変更前）

- 利用先repository側の元taskは中断したまま残る。plugin repository側の作業が終わってから、
  その続きに戻る。
- plugin repositoryで対象のskillを修正しても、それは今実行中のsessionには反映されない。
  skill内容はsession開始時にcacheされるため、
  修正後のskillで動くには新しいsessionを開始する必要がある。
- 元taskを旧版のskillのまま続けるか、新しいsessionを開始して修正後のskillで再開するかは、
  ユーザーが選ぶ。このskillが代わりに決めない。
```

二つ目が「新しいsessionを開始する必要がある」と述べる。三つ目が選択を利用者へ委ねているが、「必要がある」が先に来る。加えて、修正を行った直後は、その修正を活かしたいという動機が働く。

**resume が落ちている。** session は resume でき、resume すれば skill も読み直される。既存記述は新規作成だけを挙げており、context を捨てる経路しか示していない。

**context は session をまたがなくても失われる。** この steering では、同じ session 内で compaction が起き、summary から再構成した。session の新規作成では確実に失われる。

---

## 失敗の分析

| 起きたこと | 何が問題だったか | どこでどうすればよかったか |
| --- | --- | --- |
| escalate 後、assistant が session の新規作成を促した | **context を捨てる経路しか示されていない。** resume という選択肢が skill に無い | resume を示し、新規作成を避ける |
| 促された利用者が、繰り返し断った | 断るたびに同じ提案が出る。skill が既定を持たない | 新規作成しないことを skill が明示する |
| 元 task をどう続けるかが、切替の是非と混ざった | **二つは別の判断である。** escalate の実行方法と、元 task の続け方 | 分けて書く |

**共有されていなかった前提。** escalate は提案が生じた session の中で行う。修正後の skill で動きたいかどうかは、その後の別の判断である。

---

## TL;DR

escalate のために session を新規作成しない。修正後の skill で動きたい場合は resume する。resume なら context を保ったまま skill が読み直される。

終了時には、新規作成を促す経路が塞がれ、resume が選択肢として示されている。

---

## 完成後の姿

### workflow

`escalate-plugin-skill-fix` の「引き渡し後」を、三つの記述へ分担させる。

```text
一つ目   修正したskillは今のsessionへ反映されない。
         修正後のskillで動きたい場合はresumeする。resumeならcontextを保ったまま読み直される
二つ目   escalateのためにsessionを新規作成しない。新規作成するとcontextが失われ、
         元taskと進行中の議論の両方を説明し直すところから始まる
三つ目   元taskを旧版のまま続けるか、resumeして修正後で続けるかは利用者が選ぶ
```

二つ目を独立させるのは、これが escalate の実行に関する禁止であり、元 task の続け方とは別の判断だからである。

「旧版のまま続ける」を既定にしない。resume が使えるため、旧版で続けることが唯一の context 保持手段ではない。

### documentation以外のfile deliverable

| file | 変わる内容 |
| --- | --- |
| `skills/escalate-plugin-skill-fix/SKILL.md` | 「引き渡し後」の三項目 |

```diff
-- plugin repositoryで対象のskillを修正しても、それは今実行中のsessionには反映されない。skill内容はsession開始時にcacheされるため、修正後のskillで動くには新しいsessionを開始する必要がある。
-- 元taskを旧版のskillのまま続けるか、新しいsessionを開始して修正後のskillで再開するかは、ユーザーが選ぶ。このskillが代わりに決めない。
+- 修正したskillは、今実行中のsessionへは反映されない。skill内容はsession開始時にcacheされるためである。修正後のskillで動きたい場合は、sessionをresumeする。resumeならcontextを保ったままskillが読み直される。
+- **escalateのためにsessionを新規作成しない。** 新規作成するとcontextが失われ、元taskと進行中の議論の両方を説明し直すところから始まる。escalateは、提案が生じたsessionの中で行う。
+- 元taskを旧版のskillのまま続けるか、resumeして修正後のskillで続けるかは、ユーザーが選ぶ。このskillが代わりに決めない。
```

---

## 要件（Requirements）

### MUST（必達）

- 「引き渡し後」に、escalate のために session を新規作成しないことが明示されている
- resume が context を保ったまま skill を読み直す手段として示されている
- 元 task をどう続けるかの選択が利用者に残されている

### SHOULD（できれば）

- 修正で増える記述を最小に留める

### 非目標

- escalate の起動タイミング。後回しにするかどうかは利用側の判断であり、この skill が縛る対象ではない
- 後回し中の提案の記録先。利用側が保留するだけで、その間この skill は起動されない
- 他の 5 phase が扱う skill の内容

### 受け入れ基準

- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出力する
- この phase 完了時点で `escalate-plugin-skill-fix` が単独で利用可能である
- 起点となった実例以外の具体 case を二つ以上当て、session を新規作成するかしないかが判定できることを確認する

#### 検証結果

四つの case を、変更後の記述へ当てた。

**新規作成しない三件。**

1. **escalate して skill を直し、元 task へ戻る。** 二つ目が直接当たる。escalate は提案が生じた session の中で行う。
2. **直した skill で元 task を続けたい。** resume する。一つ目が resume を示す。新規作成は不要。
3. **直した skill を使わず元 task を続けたい。** 旧版のまま続ける。三つ目が選択を残す。

**新規作成しうる一件。**

4. **元 task が完了し、別の作業を始める。** これは escalate の文脈ではない。二つ目の禁止は「escalate のために」新規作成しないことであり、作業の切れ目での新規作成を禁じない。

四件とも判定できた。4 が禁止の対象外であることは、二つ目の「escalateのために」という限定から読み取れる。

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 修正を活かしたい動機が、既定より強く働く | 新規作成で失うものを書く。事実（反映されない）だけでなくコストを並べる |
| resume で skill が読み直されない環境がある | 「resumeならcontextを保ったまま読み直される」は事実として書く。読み直されない場合は利用者が判断する |

---

## テスト方針

- `node scripts/verification/validate-plugin.mjs` を実行する
- この repository は自動 test framework を持たないため、skill 本文の内容は人の review で担保する
- `document-review` skill を md の emit 前ゲートとして適用する

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

- `skills/escalate-plugin-skill-fix/SKILL.md` の「引き渡し後」三項目。`plugin validation passed` を確認済み。

### task-design内の対象成果物反映待ち

なし。

### execution plan対象

なし。対象は skill 一 file の修正であり、合意済み内容から一意に反映でき、他の未決事項へ依存せず、一つの連続した反映・validation で完了できる。

### 分類保留（設計中のみ）

なし。

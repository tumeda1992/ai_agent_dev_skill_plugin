# 新skillのdocument-review

対象はskill-update-reviewの四Markdown全文。UI metadataも整合を確認した。document-reviewを明示適用し、作成時・更新時の両観点を通した。内容の濃さ、表現記法、命名、指示対象、既存記述の直し方、機密性の標準を読んで照合した。

材料収集は読取集合・比較元・取得不能から材料不足を返すまで、全体評価は固有工程・重複正本・欠落・独立問題から根拠付き判定を返すまでを実行できる。帳票形式の値切替と復旧工程の固有状態を対照にし、分ける場合と分けない場合を区別している。対象全体と未確認を一緒に返すため、見出しがあるだけで合格にする構造にはしていない。

新設の入口は進行と境界、材料収集は読取・版、全体評価は判断・返却を所有する。例を一般条件の代用にせず、独立工程と別skill化の条件を明示した。標準の内容を無関係なworkflowへ複写せず、過去版の弁明や未確認の理由は持ち込んでいない。file名は既存skillsのkebab-caseと合意済みfile構成へ合わせた。公開成果物へ利用先固有の情報を追加していない。

現時点の文書上の指摘はなし。独立挙動検証・構造review・caller接続・全体validatorは別の未完了gateであり、文書reviewの通過で代替しない。

## 内容識別

- `plugins/tumeda-dev/skills/skill-update-review/SKILL.md`: SHA-256 `518617f819c06b7684dfb826faf950c0b5ed0f2140dee5146351880abe1455a7`、全文。
- `plugins/tumeda-dev/skills/skill-update-review/agents/openai.yaml`: SHA-256 `d7214906c3ae44ede3d61f07309bff0a19b7a2df21fac68db0c6dcae540eb7a7`、全文。
- `plugins/tumeda-dev/skills/skill-update-review/assess-structure.md`: SHA-256 `3309e35279c99db4103c893e87a04add7968016f01d5977842a88508070679af`、全文。
- `plugins/tumeda-dev/skills/skill-update-review/collect-review-material.md`: SHA-256 `8874aaba39d2cfd4e20c7c63371d37716c9e64328166881bd2d41877706f33ed`、全文。
- `plugins/tumeda-dev/skills/skill-update-review/templates/review-result.md`: SHA-256 `0809158eba573a0e846a66f6fd2c7f7f6490c34a9a82f0c69e64d214f1c2225f`、全文。

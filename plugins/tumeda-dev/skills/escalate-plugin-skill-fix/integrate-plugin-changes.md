# plugin repositoryでの作業の取り込みと反映

この内部指示は、plugin repositoryでのsteeringがcommitまで終わった後に、作業を`main`へ取り込み、利用者の環境のpluginへ反映するまでを所有する。
plugin repositoryでのsteeringが完了した時に読む。

## mainへ取り込む

PRを経由せず次の4stepで`main`へ取り込む。

1. 作業branchをpushする。
2. `main`へ切り替える。
3. 作業branchを`main`へmergeする。
4. `main`をpushする。

PRを経由しないのは、plugin repositoryが利用先repositoryから見てsubであり、pluginの更新がメインの作業を再開するための前段だからである。PRを開いてreviewを待つ相手がいないため、review単位としてのPRが機能しない。変更の妥当性はplugin repositoryでのsteeringがdesign合意とtasklist合意で担保しており、PRはその上に別のgateを重ねるものではない。

## pluginをupdateする

`main`をpushしたら、続けて次を行う。利用者の作業として依頼しない。

5. 使用中のAI agentのmarketplaceをupdateし、pluginをupdateする。Claude Codeでは、`claude plugin marketplace update <marketplace名>`と`claude plugin update <plugin名>@<marketplace名>`である。
6. installされたpluginのcommitが`main`の先端と一致することを確かめる。
7. 実行中のsessionへ反映する操作を、利用者へ案内する。Claude Codeでは利用者が`/reload-plugins`を打つ。sessionの中で使うcommandであり、agentからは実行できない。reloadの手段が無いagentでは、sessionをresumeする。

利用者へ依頼するのは、agentから実行できない7の操作だけである。

- やってしまいがちな行動: `main`のpushで手順が終わったとみなし、pluginのupdateを利用者へ依頼する
- それをやると何が起きるか: plugin repositoryの作業の後始末が利用者へ渡り、利用者がメインの作業へ戻るのが遅れる
- 正しい判断のための問い: 「この操作は、agentから実行できないか」

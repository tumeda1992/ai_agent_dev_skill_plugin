# plugin repositoryでの作業の取り込みと反映

この内部指示は、escalate経由でplugin repositoryへ移った作業について、steeringがcommitまで終わった後に、作業を`main`へ取り込み、利用者の環境のpluginへ反映するまでを所有する。
escalate経由の作業で、plugin repositoryでのsteeringが完了した時に読む。escalate経由でないplugin repositoryの作業は、この流れに従わない。

## mainへ取り込む

PRを記録として作り、mergeは手元で行う。次の5stepで`main`へ取り込む。

1. 作業branchをpushする。
2. PRを作る。`Closes`は[`branch_pr_issue.md`](../../docs/development_standards/development_flow/branch_pr_issue.md)に従い、このPRのmergeでissueの作業が終わる時だけ付ける。
3. `main`へ切り替える。
4. `git merge --no-ff <作業branch>`で、作業branchを`main`へmergeする。merge commitのmessageは「Merge pull request #<PR番号>: <PRの題名>」にする。
5. `main`をpushする。GitHubは、PRの変更が`main`に入ったことから、PRをmerge済みとして扱う。

PRを作るのは、どの変更がひとまとまりかを記録するためである。escalate経由でない作業はPR経由でmergeし（squash merge）、PRがひとまとまりを示す。escalate経由の作業は手元で`main`へmergeするため、PRが無いとひとまとまりが分からない。`--no-ff`でmerge commitを必ず作るのも同じ理由である。fast-forwardになると、`main`の履歴からひとまとまりの境目が消える。merge commitにPR番号を入れ、`main`の履歴からPRを引けるようにする。

GitHub上でPRをmergeする操作は、assistantが行わない。PRのmergeはAIに任せない。mergeを手元で行うのは、plugin repositoryが利用先repositoryから見てsubであり、pluginの更新がメインの作業を再開するための前段だからである。GitHubを開いてmergeする往復は、メインの作業へ戻るまでの時間をそのぶん延ばす。変更の妥当性はplugin repositoryでのsteeringがdesign合意とtasklist合意で担保しており、PRはその上に別のgateを重ねるものではない。

- やってしまいがちな行動: PRを作ったので、GitHub上でPRをmergeする
- それをやると何が起きるか: AIに任せないPRのmergeを、assistantが行う。squash mergeになれば、作業branchのcommitが一つにまとまり、手元のmergeで残すはずの履歴と形が変わる
- 正しい判断のための問い: 「このPRは、mergeの手段か、ひとまとまりの記録か」

実行環境が、利用者の明示の指示なしのPRの作成や`main`へのpushを禁じる時（cloud sessionの指示等）は、その指示に従い、その操作の前に利用者へ確認する。

## pluginをupdateする

`main`をpushしたら、続けて次を行う。利用者の作業として依頼しない。

6. 使用中のAI agentのmarketplaceをupdateし、pluginをupdateする。Claude Codeでは、`claude plugin marketplace update <marketplace名>`と`claude plugin update <plugin名>@<marketplace名>`である。
7. installされたpluginのcommitが`main`の先端と一致することを確かめる。
8. 実行中のsessionへ反映する操作を、利用者へ案内する。Claude Codeでは利用者が`/reload-plugins`を打つ。sessionの中で使うcommandであり、agentからは実行できない。reloadの手段が無いagentでは、sessionをresumeする。

利用者へ依頼するのは、agentから実行できない8の操作だけである。実行環境から利用者の環境のpluginをupdateできない時（cloud session等）は、5までを行い、6からを利用者の環境で行うことを報告する。

- やってしまいがちな行動: `main`のpushで手順が終わったとみなし、pluginのupdateを利用者へ依頼する
- それをやると何が起きるか: plugin repositoryの作業の後始末が利用者へ渡り、利用者がメインの作業へ戻るのが遅れる
- 正しい判断のための問い: 「この操作は、agentから実行できないか」

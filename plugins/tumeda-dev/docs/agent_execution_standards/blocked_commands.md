# 実行環境に止められた command

この規範には、command を実行しうる任意のskill（`tasklist-executor`、`steering`のBlocker resolution、`task-design`の技術検証実装等）が共通して従う。

agentがcommandを実行してよいとtask levelで判定したことは、実行環境がそのcommandを通すことを意味しない。task levelでの許可判定と、実行環境がcommandを実際に通すかどうかは別の層である。

実行環境に止められた場合、agentは迂回せず停止し、利用者へ返す。別のcommandで同じ結果を得ようとしない。

特定の実行基盤（infrastructure-as-code toolなど）に依存する手順はこのfileへ書かない。利用先repository側で有効な具体手順が必要な場合は、repository固有のcontextとして別途持たせる。

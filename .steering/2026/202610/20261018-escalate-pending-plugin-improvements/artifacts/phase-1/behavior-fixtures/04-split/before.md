---
name: restore
description: 障害を復旧する。
---

# 復旧

失敗時は承認待ちrecordを保存する。利用者が復旧を承認するまで実行しない。再開時もrecordの承認を確認する。承認済みなら直近の正常artifactへ戻し、測定成功後に結果を返す。

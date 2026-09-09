#!/usr/bin/env bash
# think-through skill の UserPromptSubmit 注入
# 漂流防止用の短いリマインダ（毎ターン）

CTX="think-through 要約（起動ではない）。唯々諾々禁止 / 修正前合意 / 事象→原因→提案→検証 / 上位から再帰 / 抽象と具体ワンショット / 型更新前に今のファイルで合意 / エラー消す前に原因特定 / 工程の切れ目で ready 再評価。.steering/ を扱うなら Skill で tumeda-dev:task-design を起動する。"

jq -nc --arg ctx "$CTX" '{hookSpecificOutput: {hookEventName: "UserPromptSubmit", additionalContext: $ctx}}'

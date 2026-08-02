# 2026年07月 Steering サマリー

## [20260720-feature-16-migrate-project-skills-to-shared-plugin](./20260720-feature-16-migrate-project-skills-to-shared-plugin/)

**概要:** `x_favorites/.agents/skills/` の 5 スキルと、`.claude/agents/` の 3 agent 由来 skill を、`ai_agent_dev_skill_plugin` の `tumeda-dev` plugin を唯一の正本として管理する。共有可能な手順は skill 本文に残し、X/Notion、MealFrame、固定ファイルパス、固定実行コマンドなどのリポジトリ文脈は一般例または repository 内の context instance へ分離する。

**ステータス:** 未完了

---

## [20260720-main-backport-upstream-skill-growth](./20260720-main-backport-upstream-skill-growth/)

**概要:** 移植元（本家・独自進化中）が移植後に得た成長のうち、汎用性があり plugin 配布版にも価値がある差分だけを、plugin repo の該当 skill に反映する。移植元固有の具体例・環境依存は汎用表現に言い換えたうえで取り込む。

**ステータス:** 未完了

---

## [20260726-extract-work-directory-naming](./20260726-extract-work-directory-naming/)

**概要:** 作業成果物を格納するディレクトリの basename を決める責務を、特定の消費側から独立した `name-work-directory` skill として提供する。

**ステータス:** 完了

---

## [20260726-main-move-plugin-into-plugins-directory](./20260726-main-move-plugin-into-plugins-directory/)

**概要:** repository rootがmarketplace catalog、plugin配布物、開発用ファイルを同時に担っている状態を解消し、配布境界を明確にする。repository rootはmarketplace/development root、`plugins/tumeda-dev/`はinstallable plugin rootとし、既存のmanifestとskills treeだけをplugin rootへ移す。marketplace、ローカル開発用symlink、検証script、文書内path、release versionを新しい境界に同期し、現在存在しない任意directoryは作らない。

**ステータス:** 完了

---

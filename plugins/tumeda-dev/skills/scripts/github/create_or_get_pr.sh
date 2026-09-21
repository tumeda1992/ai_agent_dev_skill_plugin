#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "usage: $0 [--base <branch>] [--head <branch>] [--title <title>] [--body <body>]" >&2
  exit 2
}

base=""
head=""
title=""
body=""
body_is_set=false

error() {
  echo "ERROR: $*" >&2
  exit 1
}

current_branch() {
  git branch --show-current 2>/dev/null || true
}

git_root() {
  git rev-parse --show-toplevel 2>/dev/null || true
}

branch_contract_section() {
  local root context

  root="$(git_root)"
  [[ -n "$root" ]] || return 1
  context="$root/.agents/skills/tumeda-dev-plugin-context.md"
  [[ -f "$context" ]] || return 1

  awk '
    /^### Branch \/ issue 契約$/ { in_section=1; next }
    in_section && /^### / { exit }
    in_section { print }
  ' "$context"
}

# head branch から issue 番号と種別を解決する。
# 出力は "<issue番号> <main|derived>"。宣言された形式に当たらなければ 1 を返す。
resolve_issue_ref() {
  local head="$1" section="$2"

  if [[ "$section" == *'issue-<番号>'* ]]; then
    if [[ "$head" =~ ^issue-([0-9]+)$ ]]; then
      printf '%s main' "${BASH_REMATCH[1]}"
      return 0
    fi
    if [[ "$head" =~ ^issue-([0-9]+)- ]]; then
      printf '%s derived' "${BASH_REMATCH[1]}"
      return 0
    fi
  fi

  # 旧形式。派生の概念を持たないため常に本線として扱う。
  if [[ "$section" == *'feature-<issue番号>'* ]] && [[ "$head" =~ ^feature-([0-9]+)$ ]]; then
    printf '%s main' "${BASH_REMATCH[1]}"
    return 0
  fi

  return 1
}

default_branch() {
  gh repo view --json defaultBranchRef --jq '.defaultBranchRef.name'
}

open_pr_url() {
  gh pr list --head "$1" --state open --json url --jq '.[0].url // empty'
}

issue_title() {
  gh issue view "$1" --json title --jq .title
}

default_title_from_branch() {
  printf '%s' "$1" | sed -E 's/[-_]+/ /g; s/^ +| +$//g'
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --base) base="${2:-}"; shift 2 ;;
    --head) head="${2:-}"; shift 2 ;;
    --title) title="${2:-}"; shift 2 ;;
    --body) body="${2:-}"; body_is_set=true; shift 2 ;;
    *) usage ;;
  esac
done

if [[ -z "$head" ]]; then
  head="$(current_branch)"
fi
[[ -n "$head" ]] || error "failed to get current branch"

if [[ -z "$base" ]]; then
  base="$(default_branch)"
fi
[[ -n "$base" ]] || error "failed to get repository default branch"

if pr_url="$(open_pr_url "$head")" && [[ -n "$pr_url" ]]; then
  printf '%s\n' "$pr_url"
  exit 0
fi

contract_section="$(branch_contract_section || true)"

if issue_ref="$(resolve_issue_ref "$head" "$contract_section")"; then
  issue_id="${issue_ref%% *}"
  issue_kind="${issue_ref##* }"

  if [[ "$issue_kind" == main ]]; then
    title="${title:-$(issue_title "$issue_id")}"
  else
    # 派生branchへissueのタイトルを付けると本線のPRと見分けがつかない。
    title="${title:-$(default_title_from_branch "$head")}"
  fi

  # Closes はissueを閉じる宣言であり、branch名からは判定できない。
  # 付けるかどうかは --body で明示する。
  if [[ "$body_is_set" == false ]]; then
    body="参照: #${issue_id}"
  fi
else
  title="${title:-$(default_title_from_branch "$head")}"
fi

[[ -n "$title" ]] || error "failed to derive PR title"

gh pr create --base "$base" --head "$head" --title "$title" --body "$body"

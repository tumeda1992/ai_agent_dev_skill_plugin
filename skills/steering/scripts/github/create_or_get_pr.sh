#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "usage: $0 --base <branch> --head <branch> --title <title> --body <body>" >&2
  exit 2
}

base=""
head=""
title=""
body=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --base) base="${2:-}"; shift 2 ;;
    --head) head="${2:-}"; shift 2 ;;
    --title) title="${2:-}"; shift 2 ;;
    --body) body="${2:-}"; shift 2 ;;
    *) usage ;;
  esac
done

[[ -n "$base" && -n "$head" && -n "$title" ]] || usage

if pr_url="$(gh pr view "$head" --json url --jq .url 2>/dev/null)" && [[ -n "$pr_url" ]]; then
  printf '%s\n' "$pr_url"
  exit 0
fi

gh pr create --base "$base" --head "$head" --title "$title" --body "$body"

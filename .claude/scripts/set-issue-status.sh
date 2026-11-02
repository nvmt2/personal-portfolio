#!/usr/bin/env bash
# Sets the Status of an issue on the "my-portfolio" project board: set-issue-status.sh <issue-number> "<status>"
set -euo pipefail

OWNER=toinguyen-agilityio
PROJECT=3
REPO=toinguyen-agilityio/my-portfolio
issue=${1:?usage: set-issue-status.sh <issue-number> "<status>"}
status=${2:?usage: set-issue-status.sh <issue-number> "<status>"}
[[ $issue =~ ^[0-9]+$ ]] || { echo "Issue must be a number, got '$issue'" >&2; exit 1; }

# Only QA moves issues to Done, on the board itself (see "Issue status" in CONTRIBUTING.md)
case "$status" in
  Done | Released)
    echo "Only QA moves issues to '$status'. Move it to 'QA' instead." >&2
    exit 1
    ;;
esac

project_id=$(gh project view "$PROJECT" --owner "$OWNER" --format json -q .id)
fields=$(gh project field-list "$PROJECT" --owner "$OWNER" --format json)
# tr drops the CR that jq prints on Windows
ids=$(jq -r --arg s "$status" \
  '.fields[] | select(.name == "Status") | "\(.id) \(.options[] | select(.name == $s) | .id)"' <<<"$fields" | tr -d '\r')
if [ -z "$ids" ]; then
  echo "Unknown status '$status'" >&2
  exit 1
fi
read -r field_id option_id <<<"$ids"

# item-add returns the existing item when the issue is already on the board
item_id=$(gh project item-add "$PROJECT" --owner "$OWNER" --url "https://github.com/$REPO/issues/$issue" --format json -q .id)
gh project item-edit --project-id "$project_id" --id "$item_id" --field-id "$field_id" --single-select-option-id "$option_id" >/dev/null
echo "#$issue -> $status"

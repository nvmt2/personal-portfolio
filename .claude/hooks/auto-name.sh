input=$(cat)
name=$(echo "$input" | jq -r '.session_name // empty')
[ -n "$name" ] && { echo '{}'; exit 0; }   # đã có tên thì tha cho nó

cwd=$(echo "$input" | jq -r '.cwd // empty')
project=$(basename "$(git -C "$cwd" rev-parse --show-toplevel 2>/dev/null || echo "$cwd")")
branch=$(git -C "$cwd" branch --show-current 2>/dev/null)
title="${project}${branch:+:$branch} · $(date +%m%d-%H%M)"

jq -n --arg t "$title" \
  '{hookSpecificOutput:{hookEventName:"UserPromptSubmit",sessionTitle:$t}}'

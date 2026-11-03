# Hooks

Scripts that Claude Code runs on events such as `PreToolUse`, `PostToolUse` or `Stop`. Current hooks:

- `auto-name.sh` (`UserPromptSubmit`): if the session has no name yet, sets it to `project:branch · MMDD-HHMM`. Needs `jq`.

## Add a hook

1. Put the script here, for example `.claude/hooks/format-on-edit.sh`. Keep it fast and make it exit non-zero only to block an action on purpose.
2. Register it in `.claude/settings.json`:

   ```json
   {
     "hooks": {
       "PostToolUse": [
         {
           "matcher": "Edit|Write",
           "hooks": [
             { "type": "command", "command": "bash .claude/hooks/format-on-edit.sh" }
           ]
         }
       ]
     }
   }
   ```

3. Open a PR. Hooks run on every dev's machine, so describe what the script does in the PR.

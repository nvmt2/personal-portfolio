# Scripts

Helper scripts that agents and skills call, for example to fetch issue data or check a result.

- `set-issue-status.sh <issue> "<status>"`: sets the issue's Status on the project board.

- Hook scripts go in `.claude/hooks/`, not here.
- Name scripts in kebab-case and start each with a one-line comment that says what it does.
- Reference a script from the agent or skill by its path from the repo root, for example `bash .claude/scripts/<name>.sh`.
- Never put tokens or keys in a script. Read them from environment variables.

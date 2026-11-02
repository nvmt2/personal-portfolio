# Claude config

How the team shares Claude Code config in this repo. Shared files are committed and reviewed through PRs. Personal files are gitignored.

## Layout

```
CLAUDE.md                  # shared: project context and rules for Claude
CLAUDE.local.md            # personal, gitignored
.mcp.json                  # shared MCP servers, if any (no secrets)
.claude/
├── README.md              # this file
├── settings.json          # shared: permissions, hooks, non-secret env
├── settings.local.json    # personal, gitignored
├── agents/                # subagents, one file per role (ba-agent.md, po-agent.md, teamlead-agent.md, dev-agent-01.md, qa-agent.md)
├── references/<agent>/    # templates and formats an agent reads on demand
├── skills/<name>/         # reusable workflows: SKILL.md + references/
├── rules/                 # rules scoped to parts of the codebase
├── hooks/                 # scripts that settings.json hooks call
└── scripts/               # helper scripts that agents and skills call
```

`skills/`, `hooks/` and `scripts/` each have a README that explains how to add the first file. `rules/` has only a `.gitkeep`, because every `.md` file there is loaded as a rule. To add a rule, create `.claude/rules/<topic>.md` with a `paths` frontmatter that lists the files it applies to.

## Rules for changing Claude config

- Put anything the whole team relies on in the shared files. Put personal preferences, machine paths and keys in `*.local.*` files or `~/.claude/`.
- Keep `CLAUDE.md` about the project: context, commands and coding rules. It is loaded into every session, so do not put config docs there.
- Never commit secrets. Use GitHub secrets for workflows and environment variables (for example `${GITHUB_TOKEN}`) in `.mcp.json`.
- Name agents and skills in kebab-case, one job each, with a `description` that says when to use it.
- Keep agent files short. Move templates and long formats to `.claude/references/<agent>/` and link them from the agent.
- Open a PR for every change under `.claude/`, `CLAUDE.md`, `.mcp.json` or the Claude workflow. `CODEOWNERS` requires the repo owner's review.

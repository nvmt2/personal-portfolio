# Contributing

Every dev, and every Claude session, follows these rules. Reviewers check branch names, PR titles and PR descriptions before they approve.

## Types

Branches, commits and PR titles share one list of types:

| Type | Use for |
|------|---------|
| `feat` | A new feature or user-visible behavior |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `style` | Formatting or visual polish with no logic change |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or fixing tests |
| `chore` | Tooling, config, dependencies, Claude config |
| `ci` | GitHub Actions and other CI config |

## Branch names

```
<type>/<issue>-<short-description>
```

- Lowercase kebab-case, for example `feat/12-dark-mode-toggle` or `fix/18-contact-link-target`.
- Include the issue number when there is one. Without an issue, use `<type>/<short-description>`, for example `chore/update-readme`.
- Always branch from the latest `main`.

Branches made by the Claude GitHub Action (`claude/...`) and Dependabot (`dependabot/...`) are exempt.

## Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org):

```
<type>(<optional-scope>): <subject>

<optional body: what changed and why>
```

- The subject is in the imperative mood, starts with a lowercase letter, has no trailing period, and the whole first line is at most 72 characters.
- The scope is the area you touched, in lowercase kebab-case, for example `contact`, `layout` or `agents`.
- Add `!` after the type or scope for a breaking change, for example `feat(layout)!: drop legacy grid`.

Examples:

```
feat(contact): add mailto link and visible email
fix(theme): prevent flash of wrong theme on load
docs: add install steps to README
chore(agents): move BA templates into reference files
```

## Pull requests

- **Title:** uses the commit message format above. PRs are squash-merged, so the title becomes the commit on `main`.
- **Description:** follow the [PR template](.github/pull_request_template.md): `Why`, `Summary`, `Evidence`, `How to test` and `Refer`. Do not delete the headings.
- **Evidence:** show that the change works, for example test output or screenshots. If something was not checked, say so and say why.
- **Refer:** write `Refs #<number>` under `Refer`. Do not use `Closes`, `Fixes` or `Resolves`: they close the issue on merge, and only QA closes issues (see [Issue status](#issue-status)). Delete that line if there is no issue.
- **Size:** keep one story or one fix per PR.
- **Review:** at least one approval before merge. Changes covered by `.github/CODEOWNERS` need the repo owner's approval.

## Issue status

Track issues on the [my-portfolio project board](https://github.com/users/toinguyen-agilityio/projects/3). The board's `Status` field is the source of truth.

| When | Move the issue to | Who |
|------|-------------------|-----|
| You start work on it | `In Progress` | Dev or dev's agent |
| You open its PR | `In Review` | Dev or dev's agent |
| Its PR is merged | `QA` | Whoever merges the PR, or their agent |
| QA has checked it and posted a comment with screenshots or a video | `Done`, and close the issue | QA only |

- Devs and their agents never move an issue to `Done` and never close it. When the work is finished, it goes to `QA`.
- The board `Status` field is the only place for status. Do not add status labels to issues.
- Change the status with `bash .claude/scripts/set-issue-status.sh <issue-number> "<status>"`, for example `bash .claude/scripts/set-issue-status.sh 12 "QA"`. The script refuses `Done` and `Released`; QA sets those on the board. It needs a `gh` login with the `project` scope (`gh auth refresh -s project`).

### Blocked issues

An issue is blocked only when it cannot be built in parallel with another one: feature A has to be finished before feature B can be implemented. Then B is blocked by A. Sharing an area or touching the same file is not a block.

- Add a "Blocked by" link only for that kind of dependency.
- A blocker counts as finished once its PR is merged, even while it waits in `QA`. Whoever merges the PR removes its "Blocked by" links from the issues it blocks, so GitHub stops showing the "Blocked" badge on them. The "Blocked by" line in each issue body stays as the record.

## Working with Claude

Claude follows this file through `CLAUDE.md`. To create a branch, commit or open a PR with Claude, run `/git-workflow` or just ask, for example "commit this" or "open a PR for issue 12".

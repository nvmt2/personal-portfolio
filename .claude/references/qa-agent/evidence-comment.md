# Evidence and comment format

## Where the evidence goes

GitHub's API cannot attach images to a comment, so the evidence lives on one orphan branch per ticket:

- Name it `chore/<issue>-qa-evidence`, which follows the branch rules in `CONTRIBUTING.md`. It holds only evidence files, under `qa-evidence/<issue>/<YYYY-MM-DD>/`. It is never merged and has no PR.
- Create it in a temporary worktree (`git worktree add --detach <dir>`, then `git switch --orphan chore/<issue>-qa-evidence` inside it), commit the files and push. On a later pass, add a new date folder to the same branch.
- Keep one pass under about 5 MB: viewport screenshots rather than full pages where that is enough, and one short `.webm` walkthrough.
- Embed images with `https://github.com/toinguyen-agilityio/my-portfolio/blob/chore/<issue>-qa-evidence/<path>?raw=true`. Link the video, because it does not play inline.

## Comment

Post one comment per ticket with `gh issue comment <n> --body-file <file>`. Write the file outside the repo tree.

```markdown
## QA pass: <ticket title>

**Tested:** `<short sha>` on `main` · <YYYY-MM-DD> · local production build (`out/`) · <OS>, Node <version>, Playwright <version>

### Checklist

| Item                                    | Result     | Notes                                           |
| --------------------------------------- | ---------- | ----------------------------------------------- |
| <acceptance criterion or test-plan item> | ✅ / ❌ / ⏳ | <what you saw, or why a person must check it> |

### Automated checks

- `pnpm lint`: <result>
- `pnpm format:check`: <result>
- `pnpm typecheck`: <result>
- `pnpm test:e2e`: <passed>/<total>, <each failure and whether it is an environment issue>

### Screenshots

|      | Light      | Dark       |
| ---- | ---------- | ---------- |
| 375  | ![](<url>) | ![](<url>) |
| 1280 | ![](<url>) | ![](<url>) |

Video: [walkthrough](<url>)

### Findings

- **F1 (<High | Medium | Low>):** <title>. Steps: <...>. Expected: <...>. Actual: <...>.

### Verdict

<Passed, moved to Done | Not passed, stays in QA: what is missing | Waiting on #<n>>
```

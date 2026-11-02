# Working notes for qa-agent

Things learned on this repo. Update this file when one of them stops being true.

## Environment failures on Windows (not app bugs)

- `pnpm format:check` fails on most files when `core.autocrlf` turns line endings into CRLF. The files in git are LF. Confirm with `pnpm exec prettier --check --end-of-line auto .`.
- The skip-link tests fail on the WebKit and iPhone 13 projects, because WebKit on Windows does not move focus with Tab by default. They fail on the previous `main` too. Real Safari stays ⏳ for a person.
- An axe check can fail once while the theme is switching. Run it again with `--repeat-each=3` before you call it a bug.
- On a new machine, the first `pnpm test:e2e` fails hundreds of tests if Firefox and WebKit are missing. Run `pnpm exec playwright install firefox webkit` once.
- Port 4173 (the Playwright web server) may already be taken by another session. Serve your own build on another port.

## Board

- `.claude/scripts/set-issue-status.sh` sets every status except `Done` and `Released`. QA sets `Done` on board 3 directly, then closes the issue. Run each command on its own and copy the ids it prints into the next one:

  ```bash
  gh project view 3 --owner toinguyen-agilityio --format json -q .id   # <project-id>
  gh project field-list 3 --owner toinguyen-agilityio --format json -q '.fields[] | select(.name == "Status") | "\(.id) \(.options[] | select(.name == "Done") | .id)"'   # <field-id> <done-option-id>
  gh project item-add 3 --owner toinguyen-agilityio --url https://github.com/toinguyen-agilityio/my-portfolio/issues/<n> --format json -q .id   # <item-id>
  gh project item-edit --project-id <project-id> --id <item-id> --field-id <field-id> --single-select-option-id <done-option-id>
  gh issue close <n> --reason completed
  ```

- The board `Status` field is the only place for status. Do not add `status: ...` labels.
- When the CI workflow is disabled, a merged commit has no `ci` check run. Say so in the comment instead of counting it as green.

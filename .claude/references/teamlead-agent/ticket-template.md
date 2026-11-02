# Ticket template

## How to split a milestone

- **Size.** One ticket is at most about one dev-day, which means one PR. Split anything bigger.
- **Foundation first.** Pull what many tickets need (tokens, content model, test harness) into the setup story, even if the plan listed it later. Say so in the summary.
- **Parallel work.** After the shell or layout ticket, sections should not depend on each other.
- **Tests travel with features.** Each ticket adds its own Playwright checks. A separate regression ticket locks in the cross-cutting rules (widths, anchors, external links).
- **Real blocks only.** List a ticket under "Blocked by" only when it must be finished before this one can be built (see "Blocked issues" in `CONTRIBUTING.md`).
- **End with a gate.** The last ticket is the QA pass and milestone sign-off, blocked by everything else.
- **Title:** `[<story id>] <imperative summary>`, for example `[T6] Build Contact section`.

## Body

```markdown
**Story:** <id> · **Milestone:** <name> · **Priority:** P0|P1|P2 · **Estimate:** XS|S|M (<time>)
**Plan:** #<plan> · **Design rules:** [TeamLead design comment](<link>) · **Prototype:** <link>

## Why
<1–2 sentences, with a pointer to the plan section or decision>

## Scope
- <concrete items: files, components, values from the design>

## Acceptance criteria
- [ ] <checkable outcome, preferably an automated test>
- [ ] <for UI tickets: the plan's Definition of Done applies>

## Out of scope
<what the next tickets cover, optional>

## Dependencies
- **Blocked by:** #<n>, #<n> | none, can start now.
- **Blocks:** #<n> | nothing (end of a chain)

---
_TeamLead [Claude Code](https://claude.ai/code)_
```

## Summary comment on the plan

A table (`# | Story | Ticket | Priority | Size | Blocked by`), the critical path as a chain of numbers, what can run in parallel and when, a rough effort estimate, any change from the plan's story list, and the label and pick-up rules.

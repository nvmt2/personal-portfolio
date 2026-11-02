# Review checklist

## Plan

- **Testable criteria.** Replace vague words ("acceptable", "readable", "fast") with a standard or a number, for example WCAG 2.1 AA, or "no horizontal scroll at 320px".
- **Dependency chains.** Follow each "depends on" to its end. Look for a ticket that waits on something outside the team (content, accounts) and drags others with it, for example QA waiting on content. Break the chain with milestones.
- **Missing work.** Every acceptance criterion needs a task that makes it true. A common gap is "replace placeholders with real content".
- **Conflicting goals.** For example "public URL first" against "no placeholders at launch". Fix it with separate milestones and exit criteria.
- **Formats that break tools.** For example `[` `]` in URLs are encoded as `%5B` `%5D`, so a plain search misses them. Fix the exact format and the search.
- **Bundled tasks.** Split a task with different owners or sizes, and move parts that can start early.
- **Accessibility built in.** Put a shared Definition of Done in every UI story, and keep the audit as a separate, final task.
- **Tech stack.** Decide it, with a reason for each layer: framework, styling, theme approach, where content lives, tooling, tests, CI.
- **Things outside the team.** Turn each one into a separate ticket that blocks nothing else, and record it under dependencies and risks.

## Prototype / design

- Read the token board and every screen board source (desktop, tablet, mobile, smallest width, 404).
- **Contrast.** Compute WCAG ratios for every token pair that is actually used together, in both themes: text, muted and accent on bg and surface, on-accent on accent, and control borders on every background they sit on (3:1).
- **Sticky header and anchor links.** Does the header change height at breakpoints? Do anchors land below it? Is it static on short landscape screens?
- **Semantics.** Toggle state (`aria-pressed` with a fixed label), landmarks, one H1, heading order, label-in-name for links with an `aria-label`.
- **Hover and affordance.** Non-clickable cards must not get hover states.
- **Placeholder rules.** Does the prototype copy follow the plan's placeholder marker and link formats?
- **Prototype-only links.** Links pointing at board files must point at real routes.
- **Fonts and images.** Self-host fonts at build time. Inline SVG when it must follow the theme. Fixed aspect ratios. Static-export image settings.
- Output: tokens table, type scale, layout rules, component list, numbered fixes, impact per story.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A single-page personal portfolio template (Next.js App Router, TypeScript, Tailwind v4), with a live demo deployed to GitHub Pages (`.github/workflows/deploy.yml`). Anyone can clone or "Use this template" and personalise it. See `README.md` for scope and status.

## Commands

```bash
pnpm dev                 # dev server on :3000
pnpm build               # static export to out/
pnpm lint                # ESLint (includes jsx-a11y)
pnpm format:check        # Prettier; pnpm format fixes
pnpm typecheck           # tsc --noEmit
pnpm test:e2e            # builds, serves out/ on :4173, runs Playwright on 5 browser projects
pnpm test:e2e tests/theme.spec.ts --project=chromium   # one file, one browser
pnpm test:e2e -g "ExternalLink opens a new tab"        # one test by name
```

## Code style

- Components are function components with named exports (`export function Button`), one per file in `src/components/`.
- Import from `src` with the `@/` alias, for example `@/components/Button` or `@/content`.
- Prettier and `.editorconfig` handle formatting, so do not format code by hand.

## Architecture and key constraints

```text
src/app/        # layout, page, 404, globals.css (design tokens)
src/components/ # UI components, read text from content.ts
src/content.ts  # all copy and links
src/lib/        # client logic (theme)
tests/          # Playwright specs and helpers
```

- **Static export only.** `next.config.ts` sets `output: 'export'` and unoptimized images. Do not use features that need a server (route handlers, server actions, ISR, `next/image` optimization).
- **Content is separate from components.** All copy, links, alt text and SEO strings live in `src/content.ts`, typed with `satisfies`. Components read from it and never hard-code text. The demo content (the fictional persona Jordan Ellis, and its `example.com` links) is marked `// DEMO-CONTENT`, and is expected to stay in the template's own demo; a cloner replaces it with their own content. A leftover `[PLACEHOLDER]` string is always a bug, demo or not: it means a file was never filled in.
- **Colors come from design tokens.** `src/app/globals.css` is the only place colors are defined (CSS variables mapped to Tailwind colors such as `bg-bg` and `text-muted`). Toggling `dark` on `<html>` swaps the whole set, so components must not use `dark:` variants.
- **Dark mode logic is spread across three places that must agree:**
  - the inline pre-paint script in `src/app/layout.tsx`, which prevents a flash of the wrong theme;
  - `src/lib/theme.ts`, which handles the toggle, the `localStorage` key `theme` and following system changes;
  - the `--bg` values in `globals.css`.

  The `theme-color` hex values (`#ffffff` and `#0f1117`) are duplicated in all three, so change them together.
- **Sticky header offset.** `--header-h` in `globals.css` changes with viewport width and height. Anchor scroll padding depends on it, so update it whenever the header layout changes.

## Workflow

- Before opening a PR, run the same checks as CI (`.github/workflows/ci.yml`): `pnpm lint`, `pnpm format:check`, `pnpm typecheck` and `pnpm test:e2e`.

## Testing

- Playwright runs against the production build in `out/`, never against `next dev`.
- Use the shared helpers in `tests/helpers/index.ts`: `expectNoA11yViolations` (axe, WCAG 2.1 AA, fails on serious or critical issues), `expectNoHorizontalScroll` and `setTheme`.
- `tests/components.spec.tsx` tests components on their own. It renders them with `renderToStaticMarkup` and loads the result with `page.setContent`.

## Git and pull requests

Follow `CONTRIBUTING.md` for branch names, commit messages and PR descriptions. Use the `git-workflow` skill when you create a branch, commit or open a PR.

Shared agents, skills, rules and scripts live in `.claude/`. Read `.claude/README.md` before changing them. As that file says, every change under `.claude/` or to `CLAUDE.md` goes through a PR, and `CODEOWNERS` requires the repo owner's review.

## Environment setup

- Node 22 (`.nvmrc`). pnpm is pinned in `packageManager`; run `corepack enable` to install it.
- Run `pnpm exec playwright install` once to download the test browsers.
- No environment variables yet.

## Gotchas and warnings

- `pnpm test:e2e` always rebuilds before testing (`reuseExistingServer: false`), so expect each run to take a while.
- To test on a phone with `pnpm dev --hostname 0.0.0.0`, you may need to add your IP to `allowedDevOrigins` in `next.config.ts`. Do not commit that change.

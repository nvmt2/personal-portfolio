<div align="center">

# My Portfolio

**A clean, minimal, single-page personal portfolio template, with a live demo you can clone and personalise.**

Demo: <https://toinguyen-agilityio.github.io/my-portfolio/> · [Report a bug](https://github.com/toinguyen-agilityio/my-portfolio/issues) · [Request a feature](https://github.com/toinguyen-agilityio/my-portfolio/issues)

</div>

---

## 📑 Table of Contents

- [About](#-about)
- [Use this template](#-use-this-template)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Configuration](#-configuration)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Content Placeholders](#-content-placeholders)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧐 About

A single-page portfolio template: an intro, projects, skills and a way to get in touch, built to be cloned and personalised. The live demo shows a fictional persona, Jordan Ellis, so you can see it fully filled in before you swap in your own content. It is a single English page.

Scope and requirements come from the plan in [#3](https://github.com/toinguyen-agilityio/my-portfolio/issues/3).

<!-- Add a screenshot once the first version is deployed. -->

## 🧑‍💻 Use this template

Click **Use this template** on GitHub (or just clone the repo), then edit:

- `src/content.ts` — every piece of copy, every link, alt text and the SEO title/description. This is the only file with text in it; components never hard-code copy.
- `src/app/icon.svg` — the favicon.
- The portrait and project thumbnail SVGs in `src/components/` (for example `Portrait.tsx` and `src/components/thumbnails/`) — they are inline React components so they pick up the color tokens, not static images.
- The color tokens in `src/app/globals.css` — the only place colors are defined. If you change `--bg`, also update the matching `theme-color` hex values in the three places `CLAUDE.md` lists, so the browser toolbar color still matches the page.

Blocks still marked `// DEMO-CONTENT` in `src/content.ts` are the fictional demo persona (Jordan Ellis) and the `example.com` links; replace or remove them with your own content.

## ✨ Features

- 🚧 **Sections:** About, Projects, Skills, Contact.
- 🚧 **Language:** English only.
- 🚧 **Dark mode:** manual toggle. Follows the system preference on first visit, remembers the choice across reloads, and shows no flash of the wrong theme on load.
- 🚧 **Contact:** visible email address with a `mailto:` link, plus GitHub and LinkedIn links that open in a new tab. No contact form.
- 🚧 **Responsive:** works from 320px wide, with no horizontal scroll.
- 🚧 **Accessibility and SEO:** keyboard navigation, acceptable contrast, alt text, accessible link names, page title, meta description and a 404 page.

**Supported browsers:** the last 2 versions of Chrome, Safari and Firefox, plus iOS Safari and Android Chrome.

## 🛠 Tech Stack

| Layer     | Technology                                                  |
|-----------|-------------------------------------------------------------|
| Framework | [Next.js](https://nextjs.org) (App Router, static export) with TypeScript |
| Styling   | [Tailwind CSS](https://tailwindcss.com) v4, colors as CSS variables |
| Testing   | [Playwright](https://playwright.dev) with [axe-core](https://github.com/dequelabs/axe-core) |
| Hosting   | GitHub Pages (demo), or any static host                    |

## 🚀 Getting Started

### Prerequisites

- Node.js 22 (see `.nvmrc`)
- [pnpm](https://pnpm.io) (the exact version is pinned in `packageManager` in `package.json`; `corepack enable` installs it)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/toinguyen-agilityio/my-portfolio.git
cd my-portfolio

# 2. Install dependencies
pnpm install
```

### Run it

```bash
pnpm dev     # dev server with hot reload
pnpm build   # production build, written to out/
pnpm start   # serve out/ (run pnpm build first)
```

Open <http://localhost:3000> and you should see the portfolio page.

**Check it on your phone (optional).** Run `pnpm dev --hostname 0.0.0.0` and open `http://<your-computer-ip>:3000` on a phone on the same Wi-Fi. Next.js blocks dev requests from other origins, so if the page does not respond to taps, add your computer's IP to `allowedDevOrigins` in `next.config.ts` while you test (do not commit it).

## ⚙️ Configuration

_TBD. List environment variables here if the app needs any._

| Variable | Required | Default | Description |
|----------|:--------:|---------|-------------|
| TBD      |          |         |             |

> ⚠️ Never commit your `.env` file.

## 📁 Project Structure

```text
my-portfolio/
├── .claude/       # shared Claude Code config (see .claude/README.md)
├── .github/       # workflows and CODEOWNERS
├── src/
│   ├── app/       # Next.js App Router: layout, page, global CSS, icons
│   ├── components/ # React components
│   └── content.ts # all copy, links and image references
├── tests/         # Playwright tests and helpers
└── README.md
```

## 🧪 Testing

```bash
pnpm lint            # ESLint
pnpm format:check    # Prettier (pnpm format fixes it)
pnpm typecheck       # tsc --noEmit
pnpm exec playwright install               # once: download the browsers (Linux: add --with-deps, needs sudo)
pnpm test:e2e        # build, serve out/ and run the Playwright tests
pnpm exec playwright show-report           # open the HTML report of the last run
```

`pnpm test:e2e` runs against the production build in `out/` on Chromium, WebKit, Firefox and two mobile emulations.

## 📦 Deployment

**Demo:** the `main` branch auto-deploys to GitHub Pages at <https://toinguyen-agilityio.github.io/my-portfolio/> via `.github/workflows/deploy.yml`. It builds the static export with `pnpm build`, with `PAGES_BASE_PATH` set to the Pages sub-path (`actions/configure-pages` provides it), then publishes `out/` with `actions/upload-pages-artifact` and `actions/deploy-pages`. A push to `main`, or `workflow_dispatch`, triggers a deploy. The repo's Pages source is set to **GitHub Actions** (Settings → Pages).

`PAGES_BASE_PATH` only matters for a sub-path deploy: it sets `basePath`/`assetPrefix` in `next.config.ts` so root-relative links and `/_next/*` assets resolve under the sub-path. Local dev, CI and the Playwright tests never set it, so they keep building and serving from `/`.

**Deploy your own copy:**

- **GitHub Pages (fork or template copy):** enable Pages with source "GitHub Actions" in the repo settings, then push to `main`. The workflow deploys to `https://<you>.github.io/<repo>/` automatically; no manual base path setup is needed.
- **Vercel, or any static host at the domain root:** `pnpm build` with no `PAGES_BASE_PATH` set, and upload `out/`. No sub-path handling is needed at the root.

```bash
pnpm build   # static export to out/, root path unless PAGES_BASE_PATH is set
```

## 🏷 Content Placeholders

`src/content.ts` holds the demo content: a fictional persona, Jordan Ellis, with demo projects, skills and contact details. Every link points to the reserved `example.com` domain, including the `mailto:` address. Each demo block is marked with a `// DEMO-CONTENT: replace with your own content` comment, so a search for `DEMO-CONTENT` finds everything to personalise. Stable UI labels such as `View projects` carry no marker, since they are not content to replace.

The demo persona and its `example.com` links are expected to stay in the template's own demo; they are not a bug and not something a regression check should flag. A leftover `[PLACEHOLDER]` string is still a bug: it means a file was never filled in at all, demo or not.

## 🗺 Roadmap

**v1 (M1)**

- [x] Project setup and static export
- [x] Layout and dark mode
- [x] About, Projects, Skills and Contact sections
- [x] Accessibility, page title and meta, 404 page
- [x] Demo content and regression QA
- [ ] `v1.0.0` release, published as a GitHub template repository, with a public GitHub Pages deploy

**Phase 2**

- [ ] Experience and Education sections
- [ ] Contact form
- [ ] Vietnamese version
- [ ] Custom domain
- [ ] Open Graph social preview
- [ ] Performance budget

See [open issues](https://github.com/toinguyen-agilityio/my-portfolio/issues) for the full list.

## 🤝 Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before you start. It sets the format for branch names, commit messages and pull requests.

1. Pick a story from the [issues](https://github.com/toinguyen-agilityio/my-portfolio/issues).
2. Create a branch from `main`, for example `git switch -c feat/12-dark-mode-toggle`.
3. Commit with [Conventional Commits](https://www.conventionalcommits.org) messages and push the branch.
4. Open a pull request to `main` and fill in the PR template.

With Claude Code, run `/git-workflow` to do these steps in the right format.

Mention `@claude` on a PR or issue to ask Claude for help or a review (allowed users only).

## 📄 License

[MIT](LICENSE).

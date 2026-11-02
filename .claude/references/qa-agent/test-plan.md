# QA test plan

Run these on every pass, as well as the ticket's own acceptance criteria. Capture a screenshot of each section at 375 and 1280 wide, in light and dark.

## Content

- No `[PLACEHOLDER]` (or `%5BPLACEHOLDER%5D`) in visible text, `<title>`, meta tags, alt text, `aria-*` or `href`, on the home page and the 404 page.
- The demo persona (Jordan Ellis) and its `example.com` links are expected on the demo; they are not a `[PLACEHOLDER]` and not a bug on their own.
- Every section renders: header, About, Projects, Skills, Contact and footer.
- Copy, links and alt text match `src/content.ts`.

## Navigation and links

- The header anchor links scroll to each section, and the heading is not hidden under the sticky header.
- External links open in a new tab with `rel="noopener noreferrer"`, and `mailto:` links are well formed.
- An unknown URL shows the 404 page with a 404 status, and its link goes back home.

## Theme

- The first load follows the system theme. The toggle switches it, and the choice survives a reload.
- The page still works when `localStorage` is blocked.
- `dark` is on `<html>` before first paint. A person checks "no flash" by eye with CPU throttling.

## Accessibility

- The skip link is the first Tab stop and moves focus to the main content.
- Every Tab stop shows a visible focus ring, in a logical order.
- axe reports no serious or critical violations in light or dark (`expectNoA11yViolations`).

## Layout

- No horizontal scroll at 320, 375, 768 and 1280 (`expectNoHorizontalScroll`).
- No console errors and no failed requests. The `example.com` demo links are never fetched.

## Browsers

- Chromium, Firefox and WebKit through the Playwright projects, plus the Pixel 7 and iPhone 13 emulation.
- Real Safari, real phones and the side-by-side check with the prototype are for a person, so mark them ⏳.

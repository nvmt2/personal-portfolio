import { expect, test, type Page } from '@playwright/test';
import { expectNoHorizontalScroll } from './helpers';

// Cross-cutting rules that later content changes must not break (plan §5, design comment §7).
// The rules read the page itself, so new sections and links are covered without editing this file.

// Smooth scrolling would make us measure mid-scroll.
test.use({ reducedMotion: 'reduce' });

const sizes = [
  { name: '320', width: 320, height: 640 },
  { name: '375', width: 375, height: 667 },
  { name: '768', width: 768, height: 1024 },
  { name: '1280', width: 1280, height: 800 },
  { name: '667x375 landscape', width: 667, height: 375 },
  { name: '812x375 landscape', width: 812, height: 375 },
];

// The part of the header still on screen, 0 once a static header has scrolled away.
const headerBottom = (page: Page) =>
  page
    .locator('header')
    .evaluate((el) => Math.max(0, el.getBoundingClientRect().bottom));

for (const size of sizes) {
  test.describe(size.name, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto('/');
    });

    test('no horizontal scroll', async ({ page }) => {
      await expectNoHorizontalScroll(page);
    });

    test('no heading is clipped sideways', async ({ page }) => {
      const clipped = await page
        .locator('h1, h2, h3')
        .evaluateAll((hs) =>
          hs
            .filter((h) => h.scrollWidth > h.clientWidth)
            .map((h) => h.textContent?.trim()),
        );
      expect(clipped).toEqual([]);
    });

    test('every nav anchor lands with its heading below the header', async ({
      page,
    }) => {
      const hrefs = await page
        .getByRole('navigation', { name: 'Sections' })
        .getByRole('link')
        .evaluateAll((as) =>
          as
            .map((a) => a.getAttribute('href')!)
            // Only real section anchors: "#" or an off-page link has no section to land on.
            .filter((href) => /^#.+/.test(href)),
        );
      expect(hrefs.length).toBeGreaterThan(0);
      for (const href of hrefs) {
        await page
          .getByRole('navigation', { name: 'Sections' })
          .locator(`a[href="${href}"]`)
          .click();
        // The first heading of the target section: the H1 for the hero, the H2 elsewhere.
        const heading = page
          .locator(`[id="${href.slice(1)}"] :is(h1, h2)`)
          .first();
        await expect(heading).toBeInViewport({ ratio: 1 });
        const top = await heading.evaluate(
          (el) => el.getBoundingClientRect().top,
        );
        expect(top, `${href} heading`).toBeGreaterThanOrEqual(
          await headerBottom(page),
        );
      }
    });
  });
}

test('every link that opens a new tab is marked noopener and noreferrer', async ({
  page,
}) => {
  await page.goto('/');
  const rels = await page
    .locator('a[target="_blank"]')
    .evaluateAll((as) => as.map((a) => a.getAttribute('rel') ?? ''));
  // Without this a changed selector would turn the rule into a silent no-op.
  expect(rels.length).toBeGreaterThan(0);
  for (const rel of rels) {
    expect(rel.split(/\s+/)).toEqual(
      expect.arrayContaining(['noopener', 'noreferrer']),
    );
  }
});

test('every in-page link points to an element that exists', async ({
  page,
}) => {
  await page.goto('/');
  const missing = await page.locator('a[href^="#"]').evaluateAll((as) =>
    as
      .map((a) => a.getAttribute('href')!)
      // "#" and "#top" scroll to the top of the page without needing an element.
      .filter((href) => href !== '#' && href !== '#top')
      .filter((href) => !document.getElementById(href.slice(1))),
  );
  expect(missing).toEqual([]);
});

test('demo example.com links are never fetched', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (req) => {
    const { hostname } = new URL(req.url());
    if (hostname === 'example.com' || hostname.endsWith('.example.com'))
      requests.push(req.url());
  });
  await page.goto('/');
  // Bring every demo link on screen, which is when a prefetch would start.
  const links = page.locator('a[href*="example.com"]');
  for (let i = 0; i < (await links.count()); i++) {
    await links.nth(i).scrollIntoViewIfNeeded();
  }
  expect(requests).toEqual([]);
});

// T7d: M1 ships mock demo content, never a leftover placeholder marker.
for (const path of ['/', '/does-not-exist']) {
  test(`no placeholder text anywhere on ${path}`, async ({ page }) => {
    await page.goto(path);
    const found = await page.evaluate(() => {
      const meta =
        document
          .querySelector('meta[name="description"]')
          ?.getAttribute('content') ?? '';
      const attrs = [
        ...document.querySelectorAll('[alt], [aria-label], [href]'),
      ].flatMap((el) =>
        ['alt', 'aria-label', 'href'].map((a) => el.getAttribute(a) ?? ''),
      );
      return {
        text: document.body.innerText,
        title: document.title,
        meta,
        attrs,
      };
    });
    // Without content the checks below would pass on an empty page.
    expect(found.title).not.toBe('');
    expect(found.meta).not.toBe('');
    expect(found.attrs.length).toBeGreaterThan(0);
    const marker = /placeholder/i;
    expect(found.text).not.toMatch(marker);
    expect(found.title).not.toMatch(marker);
    expect(found.meta).not.toMatch(marker);
    expect(found.attrs.filter((v) => marker.test(v))).toEqual([]);
  });
}

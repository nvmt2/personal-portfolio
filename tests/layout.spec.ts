import { expect, test, type Page } from '@playwright/test';
import {
  disableTransitions,
  expectNoA11yViolations,
  expectNoHorizontalScroll,
  setTheme,
} from './helpers';
import { profile } from '../src/content';

// Smooth scrolling would make us measure mid-scroll.
test.use({ reducedMotion: 'reduce' });

const sizes = [
  { name: '320', width: 320, height: 640 },
  { name: '375', width: 375, height: 667 },
  { name: '768', width: 768, height: 1024 },
  { name: '1280', width: 1280, height: 800 },
  { name: '667x375 landscape', width: 667, height: 375 },
];

// About is the hero: its heading is the page's H1, so the nav test looks at that one.
const sections = [
  { name: 'About', level: 1 },
  { name: 'Projects', level: 2 },
  { name: 'Skills', level: 2 },
  { name: 'Contact', level: 2 },
];

// The part of the header that is still on screen, 0 when it has scrolled away.
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

    test('nav links put the section heading below the header', async ({
      page,
    }) => {
      for (const { name, level } of sections) {
        await page
          .getByRole('navigation', { name: 'Sections' })
          .getByRole('link', { name })
          .click();
        const heading =
          level === 1
            ? page.locator('#about h1')
            : page.getByRole('heading', { level: 2, name });
        await expect(heading).toBeInViewport({ ratio: 1 });
        const top = await heading.evaluate(
          (el) => el.getBoundingClientRect().top,
        );
        expect(top).toBeGreaterThanOrEqual(await headerBottom(page));
      }
    });

    test('no horizontal scroll', async ({ page }) => {
      await expectNoHorizontalScroll(page);
    });
  });
}

test('the 5 nav links fit on one row at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/');
  const boxes = await page
    .getByRole('navigation', { name: 'Sections' })
    .getByRole('link')
    .evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top, right: r.right };
      }),
    );
  expect(boxes).toHaveLength(5);
  expect(new Set(boxes.map((b) => b.top)).size).toBe(1);
  expect(Math.max(...boxes.map((b) => b.right))).toBeLessThanOrEqual(320);
});

test('header is sticky at 1280x800 and static at 667x375', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const position = () =>
    page.locator('header').evaluate((el) => getComputedStyle(el).position);
  expect(await position()).toBe('sticky');
  await page.setViewportSize({ width: 667, height: 375 });
  expect(await position()).toBe('static');
});

test('anchors still clear a header that grows', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await page.locator('header').evaluate((el) => {
    el.style.paddingBottom = '60px';
  });
  await expect
    .poll(() =>
      page.evaluate(() =>
        parseFloat(
          document.documentElement.style.getPropertyValue('--header-h'),
        ),
      ),
    )
    .toBeGreaterThan(130);
});

test('name link goes to the top', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/#contact');
  await page.getByRole('link', { name: profile.name }).first().click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

for (const theme of ['light', 'dark'] as const) {
  for (const width of [320, 1280]) {
    test(`no serious a11y violations, ${theme}, ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');
      // Disable transitions before the switch: Button's transition-colors would otherwise
      // animate, and a check right after could sample an in-between color at random.
      await disableTransitions(page);
      await setTheme(page, theme);
      await expectNoA11yViolations(page);
    });
  }
}

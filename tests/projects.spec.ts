import { expect, test, type Page } from '@playwright/test';
import { projects } from '../src/content';
import { expectNoA11yViolations, expectNoHorizontalScroll } from './helpers';

const section = (page: Page) => page.locator('#projects');
const cards = (page: Page) =>
  section(page)
    .locator('ul > li')
    .filter({ has: page.getByRole('heading', { level: 3 }) });

test('renders every project from content.ts with its thumbnail alt', async ({
  page,
}) => {
  await page.goto('/');
  await expect(cards(page)).toHaveCount(projects.length);
  for (const project of projects) {
    await expect(
      section(page).getByRole('heading', { level: 3, name: project.title }),
    ).toBeVisible();
    await expect(
      section(page).getByRole('img', { name: project.thumbnailAlt }),
    ).toBeVisible();
  }
});

test('every card link opens a new tab safely and has a unique accessible name', async ({
  page,
}) => {
  await page.goto('/');
  for (const project of projects) {
    for (const [prefix, href] of [
      ['Live demo of', project.demoUrl],
      ['Source code of', project.sourceUrl],
    ]) {
      const link = section(page).getByRole('link', {
        name: `${prefix} ${project.title} (opens in a new tab)`,
        exact: true,
      });
      await expect(link).toHaveAttribute('href', href);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  }
  const all = section(page).locator('a');
  expect(await all.count()).toBe(projects.length * 2);
  for (const rel of await all.evaluateAll((as) =>
    as.map((a) => a.getAttribute('rel')),
  )) {
    expect(rel).toBe('noopener noreferrer');
  }
});

test('cards are not links and have no hover state', async ({ page }) => {
  await page.goto('/');
  const card = cards(page).first();
  const read = () =>
    card.evaluate((el) => {
      const s = getComputedStyle(el);
      return [
        s.backgroundColor,
        s.borderTopColor,
        s.boxShadow,
        s.cursor,
        s.transform,
      ];
    });
  const before = await read();
  await card.hover({ position: { x: 5, y: 5 } });
  expect(await read()).toEqual(before);
  expect(before[3]).not.toBe('pointer');
  expect(await card.evaluate((el) => el.closest('a'))).toBeNull();
});

test('cards stack in one column at 320px and 375px', async ({ page }) => {
  for (const width of [320, 375]) {
    await page.setViewportSize({ width, height: 700 });
    await page.goto('/');
    await expectNoHorizontalScroll(page);
    const lefts = await cards(page).evaluateAll((els) =>
      els.map((e) => Math.round(e.getBoundingClientRect().left)),
    );
    expect(new Set(lefts).size).toBe(1);
  }
});

for (const width of [768, 1280]) {
  test(`cards fill rows with equal heights at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const rects = await cards(page).evaluateAll((els) =>
      els.map((e) => {
        const r = e.getBoundingClientRect();
        return {
          top: Math.round(r.top + window.scrollY),
          height: Math.round(r.height),
        };
      }),
    );
    const rows = new Map<number, number[]>();
    for (const r of rects)
      rows.set(r.top, [...(rows.get(r.top) ?? []), r.height]);
    expect(
      Math.max(...[...rows.values()].map((h) => h.length)),
    ).toBeGreaterThan(1);
    for (const heights of rows.values()) {
      expect(new Set(heights).size).toBe(1);
    }
  });
}

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`system ${colorScheme}`, () => {
    test.use({ colorScheme });
    test('no serious a11y violations on the page', async ({ page }) => {
      await page.goto('/');
      await expectNoA11yViolations(page);
    });
  });
}

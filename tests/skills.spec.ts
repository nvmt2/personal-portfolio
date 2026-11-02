import { expect, test } from '@playwright/test';
import { skillGroups } from '../src/content';
import { expectNoA11yViolations, expectNoHorizontalScroll } from './helpers';

const skills = (page: import('@playwright/test').Page) =>
  page.locator('#skills');

test('renders every skill group and item from content.ts', async ({ page }) => {
  await page.goto('/');
  for (const group of skillGroups) {
    await expect(
      skills(page).getByRole('heading', { level: 3, name: group.name }),
    ).toBeVisible();
    for (const item of group.items) {
      const chip = skills(page).getByRole('listitem').getByText(item, {
        exact: true,
      });
      await expect(chip).toBeVisible();
    }
  }
});

test('heading order is H2 then H3 inside the section', async ({ page }) => {
  await page.goto('/');
  const levels = await skills(page)
    .getByRole('heading')
    .evaluateAll((hs) => hs.map((h) => h.tagName));
  expect(levels[0]).toBe('H2');
  expect(levels.slice(1).every((l) => l === 'H3')).toBe(true);
  expect(levels.length).toBe(1 + skillGroups.length);
});

test('groups sit in a grid that stacks at 320px and has no horizontal scroll', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/');
  await expectNoHorizontalScroll(page);
  const tops = await skills(page)
    .getByRole('heading', { level: 3 })
    .evaluateAll((hs) =>
      hs.map((h) => Math.round(h.getBoundingClientRect().top)),
    );
  expect(new Set(tops).size).toBe(tops.length);
});

test('groups share a row at 1280px', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const tops = await skills(page)
    .getByRole('heading', { level: 3 })
    .evaluateAll((hs) =>
      hs.map((h) => Math.round(h.getBoundingClientRect().top)),
    );
  expect(new Set(tops).size).toBe(1);
});

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`system ${colorScheme}`, () => {
    test.use({ colorScheme });
    test('no serious a11y violations on the page', async ({ page }) => {
      await page.goto('/');
      await expectNoA11yViolations(page);
    });
  });
}

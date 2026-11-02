import { expect, test } from '@playwright/test';
import { profile } from '../src/content';
import { expectNoHorizontalScroll } from './helpers';

test('the page has exactly one H1, and it is in About', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('#about h1')).toHaveText(profile.headline);
  await expect(page.locator('#about')).toContainText(profile.greeting);
  await expect(page.locator('#about')).toContainText(profile.bio);
});

test('buttons go to Projects and Contact', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('link', { name: 'View projects' }),
  ).toHaveAttribute('href', '#projects');
  await expect(page.getByRole('link', { name: 'Contact me' })).toHaveAttribute(
    'href',
    '#contact',
  );
});

test('portrait is an image with the label from content.ts, 220px', async ({
  page,
}) => {
  await page.goto('/');
  const portrait = page.getByRole('img', { name: profile.portraitAlt });
  await expect(portrait).toBeVisible();
  const box = await portrait.boundingBox();
  // Firefox reports 220.0000153 when the portrait sits at a fractional y (float rounding of
  // its layout units), so compare to 2 decimals: still fails for any real size change.
  expect(box?.width).toBeCloseTo(220, 2);
  expect(box?.height).toBeCloseTo(220, 2);
});

test('a long headline wraps at 320px without clipping', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/');
  await page.locator('#about h1').evaluate((el) => {
    el.textContent = 'Extraordinarily'.repeat(8);
  });
  const { scrollWidth, clientWidth } = await page
    .locator('#about h1')
    .evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }));
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  await expectNoHorizontalScroll(page);
});

test('text and portrait sit side by side on desktop, stacked on mobile', async ({
  page,
}) => {
  const box = (selector: string) =>
    page.locator(selector).evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
    });
  const text = '#about div.flex-1';
  const portrait = '#about svg[role="img"]';

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  let t = await box(text);
  let p = await box(portrait);
  expect(p.left).toBeGreaterThanOrEqual(t.right);
  const centre = (p.top + p.bottom) / 2;
  expect(centre).toBeGreaterThan(t.top);
  expect(centre).toBeLessThan(t.bottom);

  await page.setViewportSize({ width: 375, height: 667 });
  t = await box(text);
  p = await box(portrait);
  expect(p.top).toBeGreaterThanOrEqual(t.bottom);
});

import { expect, test } from '@playwright/test';
import { expectNoHorizontalScroll } from './helpers';

// Header behaviour on the home page: link order, the My Story link and the 320px fit.
// The /story page itself is covered by its own spec once it exists.

const navNames = ['About', 'Projects', 'Skills', 'My Story', 'Contact'];

test('the nav lists the five sections in order on home', async ({ page }) => {
  await page.goto('/');
  const links = page
    .getByRole('navigation', { name: 'Sections' })
    .getByRole('link');
  await expect(links).toHaveText(navNames);
});

test('My Story is not the current page on home', async ({ page }) => {
  await page.goto('/');
  const story = page
    .getByRole('navigation', { name: 'Sections' })
    .getByRole('link', {
      name: 'My Story',
    });
  await expect(story).toHaveAttribute('href', '/story');
  await expect(story).not.toHaveAttribute('aria-current', 'page');
});

const sizes = [
  { name: '320', width: 320, height: 640 },
  { name: '375', width: 375, height: 667 },
  { name: '400', width: 400, height: 700 },
  { name: '420', width: 420, height: 700 },
  { name: '440', width: 440, height: 700 },
  { name: '480', width: 480, height: 700 },
  { name: '640', width: 640, height: 800 },
];

for (const size of sizes) {
  test(`all five nav links are visible and at least 44px high at ${size.name}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: size.width, height: size.height });
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Sections' });
    const navBox = await nav.boundingBox();
    expect(navBox).not.toBeNull();
    const links = nav.getByRole('link');
    await expect(links).toHaveCount(5);
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const box = await links.nth(i).boundingBox();
      expect(box, `link ${i}`).not.toBeNull();
      // Each link sits inside the nav: no overflow hidden or pushed off the row.
      expect(box!.x).toBeGreaterThanOrEqual(navBox!.x - 0.5);
      expect(box!.x + box!.width).toBeLessThanOrEqual(
        navBox!.x + navBox!.width + 0.5,
      );
      expect(box!.height, `link ${i} height`).toBeGreaterThanOrEqual(44);
    }
    await expectNoHorizontalScroll(page);
  });
}

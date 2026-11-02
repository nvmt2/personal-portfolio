import { expect, test } from '@playwright/test';
import { expectNoA11yViolations, expectNoHorizontalScroll } from './helpers';

const widths = [320, 375, 768, 1280];
const pages = [
  { name: 'home', path: '/' },
  { name: '404', path: '/does-not-exist' },
];

// 2 pages x 2 themes x 4 widths = 16 combinations.
for (const { name, path } of pages) {
  for (const colorScheme of ['light', 'dark'] as const) {
    for (const width of widths) {
      test.describe(`${name}, ${colorScheme}, ${width}px`, () => {
        test.use({ colorScheme, viewport: { width, height: 800 } });

        test('axe finds no serious or critical issues', async ({ page }) => {
          await page.goto(path);
          await expectNoA11yViolations(page);
          await expectNoHorizontalScroll(page);
        });
      });
    }
  }
}

for (const { name, path } of pages) {
  test.describe(`skip link on ${name}`, () => {
    test('is the first focusable element and shows only on focus', async ({
      page,
    }) => {
      await page.goto(path);
      const skip = page.getByRole('link', { name: 'Skip to content' });
      const first = await page.evaluate(() => {
        const el = document.querySelector(
          'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        return el?.textContent?.trim();
      });
      expect(first).toBe('Skip to content');
      // Hidden: clipped to a 1px box until focused.
      expect((await skip.boundingBox())!.width).toBeLessThanOrEqual(1);
      // Focus directly rather than pressing Tab: Playwright's WebKit build on Windows does not
      // move focus into <a> elements on Tab (unlike its Linux/macOS builds, observed on this
      // machine), which is unrelated to what this assertion checks, the show-on-focus CSS.
      await skip.focus();
      await expect(skip).toBeFocused();
      const box = (await skip.boundingBox())!;
      expect(box.width).toBeGreaterThan(40);
      expect(box.y).toBeGreaterThanOrEqual(0);
      // The accent background comes from the token: resolve --accent the same way and compare.
      const accent = await page.evaluate(() => {
        const probe = document.createElement('div');
        probe.style.backgroundColor = 'var(--accent)';
        document.body.append(probe);
        const color = getComputedStyle(probe).backgroundColor;
        probe.remove();
        return color;
      });
      await expect(skip).toHaveCSS('background-color', accent);
    });

    test('moves focus past the header to the main landmark', async ({
      page,
    }) => {
      await page.goto(path);
      // Focus directly: the behavior under test is the jump to #main on activation, not
      // whether Tab reaches the link (see the comment in the test above).
      await page.getByRole('link', { name: 'Skip to content' }).focus();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/#main$/);
      // The hash changes even if focus stays put, so check that <main> really has focus.
      await expect(page.locator('main#main')).toBeFocused();
    });
  });
}

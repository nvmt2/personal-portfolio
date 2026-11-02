import { expect, test, type Page } from '@playwright/test';
import { contact, contactSection, socials } from '../src/content';
import { expectNoA11yViolations, expectNoHorizontalScroll } from './helpers';

const section = (page: Page) => page.locator('#contact');

test('the email is visible text inside a mailto link from content.ts', async ({
  page,
}) => {
  await page.goto('/');
  const link = section(page).getByRole('link', { name: contact.email });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', contact.mailtoHref);
  // The shared text-link class keeps the tap target at least 44px tall.
  expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await expect(
    section(page).getByText(contactSection.emailLabel, { exact: true }),
  ).toBeVisible();
});

test('social links open a new tab safely and say so in their name', async ({
  page,
}) => {
  await page.goto('/');
  for (const social of socials) {
    const link = section(page).getByRole('link', {
      name: `${social.label} (opens in a new tab)`,
    });
    await expect(link).toHaveAttribute('href', social.href);
    await expect(link).toHaveAttribute('target', '_blank');
    expect(await link.getAttribute('rel')).toBe('noopener noreferrer');
  }
});

test('a 60-character email wraps at 320px with no horizontal scroll', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/');
  await section(page)
    .getByRole('link', { name: contact.email })
    .evaluate((a) => {
      a.textContent = `${'a'.repeat(60)}@example.com`;
    });
  await expectNoHorizontalScroll(page);
});

test('social button borders reach 3:1 on the surface in light mode', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const [border, surface] = await section(page)
    .getByRole('link', { name: /opens in a new tab/ })
    .first()
    .evaluate((a) => [
      getComputedStyle(a).borderTopColor,
      getComputedStyle(a.closest('section')!).backgroundColor,
    ]);
  // Let the browser resolve any CSS color syntax: paint it on a canvas and read the pixel.
  const toRgb = (css: string) =>
    page.evaluate((c) => {
      const ctx = document.createElement('canvas').getContext('2d')!;
      ctx.fillStyle = c;
      ctx.fillRect(0, 0, 1, 1);
      return Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3));
    }, css);
  const lum = ([r, g, b]: number[]) => {
    const f = (c: number) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const [hi, lo] = [lum(await toRgb(border)), lum(await toRgb(surface))].sort(
    (x, y) => y - x,
  );
  expect((hi + 0.05) / (lo + 0.05)).toBeGreaterThanOrEqual(3);
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

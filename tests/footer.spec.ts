import { expect, test } from '@playwright/test';
import { expectNoHorizontalScroll, setTheme } from './helpers';
import { footer, profile } from '../src/content';

test('footer shows the built-with, demo notice and template link copy', async ({
  page,
}) => {
  await page.goto('/');
  const footerLocator = page.getByRole('contentinfo');
  await expect(footerLocator).toContainText(profile.name);
  await expect(footerLocator).toContainText(footer.builtWith);
  await expect(footerLocator).toContainText(footer.demoNotice);
  const link = footerLocator.getByRole('link', {
    name: `${footer.templateLabel} (opens in a new tab)`,
  });
  await expect(link).toHaveAttribute('href', footer.templateHref);
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
});

for (const theme of ['light', 'dark'] as const) {
  test(`footer wraps at 320px with no horizontal scroll, ${theme}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/');
    await setTheme(page, theme);
    await expectNoHorizontalScroll(page);
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });
}

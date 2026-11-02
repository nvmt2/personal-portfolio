import { expect, test } from '@playwright/test';

const toggle = (page: import('@playwright/test').Page) =>
  page.getByRole('button', { name: 'Dark theme' });
const isDark = (page: import('@playwright/test').Page) =>
  page.evaluate(() => document.documentElement.classList.contains('dark'));

test.describe('system dark, empty storage', () => {
  test.use({ colorScheme: 'dark' });

  test('html is dark before the first paint', async ({ page }) => {
    // DOMContentLoaded fires before the first paint of a parsed page; the class must already be there.
    await page.addInitScript(() => {
      document.addEventListener('DOMContentLoaded', () => {
        (window as unknown as { darkAtDcl: boolean }).darkAtDcl =
          document.documentElement.classList.contains('dark');
      });
    });
    await page.goto('/');
    expect(
      await page.evaluate(
        () => (window as unknown as { darkAtDcl: boolean }).darkAtDcl,
      ),
    ).toBe(true);
    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true');
  });
});

test.describe('system light', () => {
  test.use({ colorScheme: 'light' });

  test('toggle switches the theme and the choice persists after reload', async ({
    page,
  }) => {
    await page.goto('/');
    expect(await isDark(page)).toBe(false);
    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'false');

    await toggle(page).click();
    expect(await isDark(page)).toBe(true);
    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true');

    await page.reload();
    expect(await isDark(page)).toBe(true);
    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true');
  });

  test('the stored choice wins over a later system change', async ({
    page,
  }) => {
    await page.goto('/');
    await toggle(page).click();
    // Reload drops the in-memory session choice, so only the stored value can win now.
    await page.reload();
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.emulateMedia({ colorScheme: 'light' });
    expect(await isDark(page)).toBe(true);
  });

  test('a stored choice sets the theme-color metas on load', async ({
    page,
  }) => {
    await page.goto('/');
    await toggle(page).click();
    await page.reload();
    const colors = await page
      .locator('meta[name="theme-color"]')
      .evaluateAll((metas) => metas.map((m) => (m as HTMLMetaElement).content));
    expect(new Set(colors)).toEqual(new Set(['#0f1117']));
  });

  test('follows live system changes until a choice is made', async ({
    page,
  }) => {
    await page.goto('/');
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect.poll(() => isDark(page)).toBe(true);
    await page.emulateMedia({ colorScheme: 'light' });
    await expect.poll(() => isDark(page)).toBe(false);
  });

  test('theme-color metas follow the choice', async ({ page }) => {
    await page.goto('/');
    await toggle(page).click();
    const colors = await page
      .locator('meta[name="theme-color"]')
      .evaluateAll((metas) => metas.map((m) => (m as HTMLMetaElement).content));
    expect(colors.length).toBeGreaterThan(0);
    expect(new Set(colors)).toEqual(new Set(['#0f1117']));
  });

  test('works when localStorage throws', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new DOMException('blocked', 'SecurityError');
        },
      });
    });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    expect(await isDark(page)).toBe(false);

    await toggle(page).click();
    expect(await isDark(page)).toBe(true);
    // The session choice still wins over system changes.
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.emulateMedia({ colorScheme: 'light' });
    expect(await isDark(page)).toBe(true);
  });

  test('toggle has a fixed accessible name', async ({ page }) => {
    await page.goto('/');
    await toggle(page).click();
    await expect(toggle(page)).toHaveAccessibleName('Dark theme');
  });
});

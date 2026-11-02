import { expect, test } from '@playwright/test';

test('home page loads and has an h1', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1').first()).toBeVisible();
});

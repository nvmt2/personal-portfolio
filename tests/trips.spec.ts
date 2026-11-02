import { expect, test } from '@playwright/test';
import {
  expectNoA11yViolations,
  expectNoHorizontalScroll,
  setTheme,
} from './helpers';
import { tripsSection } from '../src/content';
import { getAllTrips } from '../src/lib/trips';

// The demo trips in content/trips/ drive these tests, so they read them through the same
// loader the build uses instead of hard-coding titles.
const trips = getAllTrips();
const withTikTok = trips.find((t) => t.tiktok);
const withoutTikTok = trips.find((t) => !t.tiktok);

test('the demo content covers a trip with and without TikTok', () => {
  expect(trips.length).toBeGreaterThanOrEqual(2);
  expect(withTikTok).toBeDefined();
  expect(withoutTikTok).toBeDefined();
});

test('the trips list shows one card per trip, newest first', async ({
  page,
}) => {
  await page.goto('/trips');
  await expect(
    page.getByRole('heading', { level: 1, name: tripsSection.title }),
  ).toBeVisible();
  const titles = page.getByRole('heading', { level: 3 });
  await expect(titles).toHaveText(trips.map((t) => t.title));
});

test('a card shows difficulty, beauty and a link to the story', async ({
  page,
}) => {
  await page.goto('/trips');
  const trip = trips[0];
  const card = page.getByRole('listitem').filter({ hasText: trip.title });
  await expect(card).toContainText(
    new RegExp(`Difficulty\\s*${trip.difficulty}/5`),
  );
  await expect(card).toContainText(new RegExp(`Beauty\\s*${trip.beauty}/5`));
  await card.getByRole('link', { name: /Read the story/ }).click();
  await expect(page).toHaveURL(new RegExp(`/trips/${trip.slug}$`));
  await expect(
    page.getByRole('heading', { level: 1, name: trip.title }),
  ).toBeVisible();
});

test('the trip page shows photos, story, itinerary and the Zalo button', async ({
  page,
}) => {
  const trip = trips[0];
  await page.goto(`/trips/${trip.slug}`);
  for (const photo of trip.photos) {
    const img = page.getByRole('img', { name: photo.alt });
    await expect(img).toBeVisible();
    // The file really loads, not just the tag.
    expect(
      await img.evaluate((el: HTMLImageElement) => el.naturalWidth),
    ).toBeGreaterThan(0);
  }
  const firstWords = trip.storyHtml
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 30);
  await expect(page.getByText(firstWords)).toBeVisible();
  const steps = page
    .getByRole('list')
    .filter({ hasText: 'Day 1' })
    .getByRole('listitem');
  await expect(steps).toHaveCount(trip.itinerary.length);
  const zalo = page.getByRole('link', { name: /Join me on Zalo/ });
  await expect(zalo).toHaveAttribute('href', tripsSection.zaloHref);
  await expect(zalo).toHaveAttribute('target', '_blank');
  await expect(zalo).toHaveAttribute('rel', 'noopener noreferrer');
});

test('the TikTok button only shows on trips that have a link', async ({
  page,
}) => {
  await page.goto(`/trips/${withTikTok!.slug}`);
  await expect(
    page.getByRole('link', { name: /Watch on TikTok/ }),
  ).toHaveAttribute('href', withTikTok!.tiktok!);
  await page.goto(`/trips/${withoutTikTok!.slug}`);
  await expect(page.getByRole('link', { name: /Watch on TikTok/ })).toHaveCount(
    0,
  );
});

test('an unknown trip is a 404', async ({ page }) => {
  const response = await page.goto('/trips/no-such-trip');
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Page not found' }),
  ).toBeVisible();
});

test('the header links to Trips and marks it current on trips pages', async ({
  page,
}) => {
  await page.goto('/');
  const link = page.getByRole('banner').getByRole('link', { name: 'Trips' });
  await expect(link).toHaveAttribute('href', '/trips');
  await expect(link).not.toHaveAttribute('aria-current', 'page');
  await link.click();
  await expect(page).toHaveURL(/\/trips$/);
  await expect(
    page.getByRole('banner').getByRole('link', { name: 'Trips' }),
  ).toHaveAttribute('aria-current', 'page');
  // Section links point back to the home page.
  await expect(
    page
      .getByRole('navigation', { name: 'Sections' })
      .getByRole('link', { name: 'About' }),
  ).toHaveAttribute('href', '/#about');
});

const pages = [
  ['list', '/trips'],
  ['trip', `/trips/${trips[0].slug}`],
  ['trip without TikTok', `/trips/${withoutTikTok!.slug}`],
] as const;

for (const colorScheme of ['light', 'dark'] as const) {
  for (const [name, url] of pages) {
    test(`the ${name} page passes axe in ${colorScheme}`, async ({ page }) => {
      await page.goto(url);
      await setTheme(page, colorScheme);
      await expectNoA11yViolations(page);
    });
  }
}

for (const width of [320, 375, 1280]) {
  for (const [name, url] of pages) {
    test(`the ${name} page does not scroll sideways at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(url);
      await expectNoHorizontalScroll(page);
    });
  }
}

test('the header still fits at 320px with the Trips link', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/');
  const header = page.getByRole('banner');
  const trips = header.getByRole('link', { name: 'Trips' });
  const toggle = header.getByRole('button');
  const [t, b] = [await trips.boundingBox(), await toggle.boundingBox()];
  expect(t!.x + t!.width).toBeLessThanOrEqual(b!.x + 0.5);
  expect(t!.height).toBeGreaterThanOrEqual(44);
  await expectNoHorizontalScroll(page);
});

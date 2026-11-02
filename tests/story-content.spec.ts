import { expect, test } from '@playwright/test';
import { navLinks, storySection, type StoryImage } from '../src/content';

// Checks the My Story content model in src/content.ts. These read the data directly, so they
// fail when the demo data drifts from the shape the /story components expect.

const images = (): StoryImage[] => [
  ...storySection.journey.entries.flatMap((entry) =>
    entry.image ? [entry.image] : [],
  ),
  ...storySection.hobbies.items.flatMap((item) =>
    item.image ? [item.image] : [],
  ),
];

test('the journey has four entries in year order', () => {
  expect(storySection.journey.entries.map((entry) => entry.year)).toEqual([
    '2015',
    '2018',
    '2021',
    '2024',
  ]);
});

test('the hobbies have three items', () => {
  expect(storySection.hobbies.items).toHaveLength(3);
});

test('the journey has one entry without an image and one with an image', () => {
  const entries = storySection.journey.entries;
  expect(entries.some((entry) => entry.image === undefined)).toBe(true);
  expect(entries.some((entry) => entry.image !== undefined)).toBe(true);
});

test('every image has non-empty alt text', () => {
  const all = images();
  expect(all.length).toBeGreaterThan(0);
  for (const image of all) {
    expect(image.alt.trim(), `alt for ${image.kind}`).not.toBe('');
  }
});

test('no story or nav copy is a leftover placeholder', () => {
  const text = JSON.stringify({ storySection, navLinks });
  expect(text).not.toContain('[PLACEHOLDER]');
});

test('My Story is in the nav and points to /story', () => {
  expect(navLinks).toContainEqual({ label: 'My Story', href: '/story' });
});

test('the CTA labels and SEO strings are filled in', () => {
  expect(storySection.cta.contactLabel.trim()).not.toBe('');
  expect(storySection.cta.projectsLabel.trim()).not.toBe('');
  expect(storySection.seo.title.trim()).not.toBe('');
  expect(storySection.seo.description.trim()).not.toBe('');
});

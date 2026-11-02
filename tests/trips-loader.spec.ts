import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { expect, test } from '@playwright/test';
import { getAllTrips } from '../src/lib/trips';

// The loader runs at build time, so it is tested on the Node side against throwaway fixture
// folders. No page is involved.

const valid = {
  title: 'A trip',
  date: '2025-05-01',
  days: 2,
  summary: 'Short summary.',
  difficulty: 3,
  beauty: 4,
  cover: 'a.svg',
  photos: [{ file: 'a.svg', alt: 'A photo' }],
  itinerary: [{ day: 1, title: 'Start', place: 'Here', lat: 10, lng: 20 }],
};

function writeTrip(
  root: string,
  slug: string,
  overrides: Record<string, unknown> = {},
  body = 'Once upon a trip.',
  files: string[] = ['a.svg'],
) {
  const dir = path.join(root, slug);
  fs.mkdirSync(dir, { recursive: true });
  const data = { ...valid, ...overrides };
  fs.writeFileSync(
    path.join(dir, 'index.md'),
    `---\n${JSON.stringify(data)}\n---\n${body}\n`,
  );
  for (const file of files) fs.writeFileSync(path.join(dir, file), '<svg/>');
}

function withRoot(fn: (root: string) => void) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'trips-'));
  try {
    fn(root);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

test('loads a valid trip and renders the story to HTML', () => {
  withRoot((root) => {
    writeTrip(root, 'one', {}, 'Hello **world**.');
    const [trip] = getAllTrips(root);
    expect(trip.slug).toBe('one');
    expect(trip.cover.alt).toBe('A photo');
    expect(trip.storyHtml).toContain('<strong>world</strong>');
  });
});

test('sorts trips newest first and itinerary by day', () => {
  withRoot((root) => {
    writeTrip(root, 'old', { date: '2024-01-01' });
    writeTrip(root, 'new', {
      date: '2025-06-01',
      itinerary: [
        { day: 2, title: 'B', place: 'B', lat: 1, lng: 1 },
        { day: 1, title: 'A', place: 'A', lat: 1, lng: 1 },
      ],
    });
    const trips = getAllTrips(root);
    expect(trips.map((t) => t.slug)).toEqual(['new', 'old']);
    expect(trips[0].itinerary.map((s) => s.day)).toEqual([1, 2]);
  });
});

test('accepts an unquoted YAML date', () => {
  withRoot((root) => {
    const dir = path.join(root, 'yaml');
    fs.mkdirSync(dir);
    fs.writeFileSync(
      path.join(dir, 'index.md'),
      `---\ntitle: T\ndate: 2025-10-12\ndays: 1\nsummary: S\ndifficulty: 1\nbeauty: 1\ncover: a.svg\nphotos:\n  - { file: a.svg, alt: A }\nitinerary:\n  - { day: 1, title: T, place: P, lat: 1, lng: 1 }\n---\nBody\n`,
    );
    fs.writeFileSync(path.join(dir, 'a.svg'), '<svg/>');
    expect(getAllTrips(root)[0].date).toBe('2025-10-12');
  });
});

const invalid: [string, Record<string, unknown>, RegExp][] = [
  ['difficulty above 5', { difficulty: 7 }, /difficulty/],
  ['beauty below 1', { beauty: 0 }, /beauty/],
  ['fractional rating', { beauty: 3.5 }, /beauty/],
  ['bad date', { date: '12/10/2025' }, /date/],
  [
    'latitude out of range',
    { itinerary: [{ day: 1, title: 'A', place: 'A', lat: 91, lng: 0 }] },
    /itinerary\.0\.lat/,
  ],
  [
    'longitude out of range',
    { itinerary: [{ day: 1, title: 'A', place: 'A', lat: 0, lng: 181 }] },
    /itinerary\.0\.lng/,
  ],
  ['empty itinerary', { itinerary: [] }, /itinerary/],
  [
    'photo without alt',
    { photos: [{ file: 'a.svg', alt: '' }] },
    /photos\.0\.alt/,
  ],
  ['non-TikTok link', { tiktok: 'https://example.com/v/1' }, /tiktok/],
  [
    'photo that does not exist',
    { cover: 'b.svg', photos: [{ file: 'b.svg', alt: 'B' }] },
    /does not exist/,
  ],
  [
    'cover not in photos',
    { cover: 'a.svg', photos: [{ file: 'c.svg', alt: 'C' }] },
    /cover|does not exist/,
  ],
  [
    'path traversal in a photo name',
    { cover: '../a.svg', photos: [{ file: '../a.svg', alt: 'A' }] },
    /cover|file/,
  ],
];

for (const [name, overrides, message] of invalid) {
  test(`fails the build for ${name}`, () => {
    withRoot((root) => {
      writeTrip(root, 'bad', overrides);
      expect(() => getAllTrips(root)).toThrow(message);
    });
  });
}

test('the error names the trip file', () => {
  withRoot((root) => {
    writeTrip(root, 'bad', { difficulty: 9 });
    expect(() => getAllTrips(root)).toThrow(/bad[\\/]index\.md/);
  });
});

test('accepts a tiktok.com link', () => {
  withRoot((root) => {
    writeTrip(root, 'ok', { tiktok: 'https://www.tiktok.com/@me/video/1' });
    expect(getAllTrips(root)[0].tiktok).toBe(
      'https://www.tiktok.com/@me/video/1',
    );
  });
});

test('rejects links in the story', () => {
  withRoot((root) => {
    writeTrip(root, 'link', {}, 'See [this](https://example.com).');
    expect(() => getAllTrips(root)).toThrow(/links/);
  });
});

test('returns no trips when the folder is missing', () => {
  expect(getAllTrips(path.join(os.tmpdir(), 'no-such-trips-folder'))).toEqual(
    [],
  );
});

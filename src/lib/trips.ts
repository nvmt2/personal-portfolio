import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import { z } from 'zod';

// Reads content/trips/<slug>/index.md at build time. Build-time only: it uses `fs`, so never
// import it from a client component. Any invalid trip throws, which fails `pnpm build` with a
// message naming the file and the field, instead of rendering a broken page.

export const TRIPS_DIR = path.join(process.cwd(), 'content', 'trips');

// Photos over this size trigger a build warning. There is no image pipeline yet (see README).
export const PHOTO_WARN_BYTES = 500 * 1024;

const IMAGE_FILE = /^[\w.-]+\.(jpe?g|png|webp|avif|gif|svg)$/i;

const rating = z.number().int().min(1).max(5);

// YAML turns an unquoted 2025-10-12 into a Date, so accept both and keep a YYYY-MM-DD string.
const isoDate = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'must be a date like 2025-10-12')
    .refine((s) => !Number.isNaN(Date.parse(s)), 'is not a real date'),
);

const imageFile = z
  .string()
  .regex(
    IMAGE_FILE,
    'must be a plain file name (jpg, png, webp, avif, gif or svg)',
  );

const stopSchema = z.object({
  day: z.number().int().min(1),
  title: z.string().min(1),
  place: z.string().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

const frontmatterSchema = z.object({
  title: z.string().min(1),
  date: isoDate,
  days: z.number().int().min(1),
  summary: z.string().min(1),
  difficulty: rating,
  beauty: rating,
  tiktok: z
    .string()
    .url()
    .refine((value) => {
      const host = new URL(value).hostname;
      return host === 'tiktok.com' || host.endsWith('.tiktok.com');
    }, 'must be a tiktok.com URL')
    .optional(),
  cover: imageFile,
  photos: z.array(z.object({ file: imageFile, alt: z.string().min(1) })).min(1),
  itinerary: z.array(stopSchema).min(1),
});

export type TripStop = z.infer<typeof stopSchema>;
export type TripPhoto = { file: string; alt: string };

export type Trip = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  days: number;
  summary: string;
  difficulty: number;
  beauty: number;
  tiktok?: string;
  cover: TripPhoto;
  photos: TripPhoto[];
  itinerary: TripStop[];
  storyHtml: string;
};

function fail(file: string, problems: string[]): never {
  throw new Error(
    `Invalid trip ${file}:\n${problems.map((p) => `  - ${p}`).join('\n')}`,
  );
}

function renderStory(markdown: string): string {
  // remark-html sanitizes by default, so raw HTML in the story is dropped.
  return String(remark().use(remarkHtml).processSync(markdown));
}

// A story is plain prose. Off-site links must go through ExternalLink (the only way to link
// off-site in this codebase), so links in the story body are rejected; put them in frontmatter.
const LINK_IN_BODY = /\]\(|<a[\s>]|https?:\/\//i;

function loadTrip(root: string, slug: string): Trip {
  const dir = path.join(root, slug);
  const file = path.join(dir, 'index.md');
  const label = path.relative(process.cwd(), file) || file;

  if (!fs.existsSync(file)) fail(label, ['index.md is missing']);

  const parsed = matter(fs.readFileSync(file, 'utf8'));
  const result = frontmatterSchema.safeParse(parsed.data);
  if (!result.success) {
    fail(
      label,
      result.error.issues.map(
        (issue) =>
          `${issue.path.join('.') || '(frontmatter)'}: ${issue.message}`,
      ),
    );
  }
  const data = result.data;

  const problems: string[] = [];
  const photoFiles = [data.cover, ...data.photos.map((p) => p.file)];
  for (const name of new Set(photoFiles)) {
    const photoPath = path.join(dir, name);
    if (!fs.existsSync(photoPath)) {
      problems.push(`photo "${name}" does not exist in ${slug}/`);
      continue;
    }
    const { size } = fs.statSync(photoPath);
    if (size > PHOTO_WARN_BYTES) {
      console.warn(
        `[trips] ${slug}/${name} is ${Math.round(size / 1024)} KB. Resize it below ${PHOTO_WARN_BYTES / 1024} KB so the page stays light.`,
      );
    }
  }
  // The cover must be one of the photos, so it always has alt text.
  const cover = data.photos.find((p) => p.file === data.cover);
  if (!cover)
    problems.push(`cover "${data.cover}" must also be listed in photos`);
  if (LINK_IN_BODY.test(parsed.content)) {
    problems.push(
      'the story must not contain links; put the TikTok link in frontmatter',
    );
  }
  if (problems.length > 0 || !cover) fail(label, problems);

  return {
    slug,
    title: data.title,
    date: data.date,
    days: data.days,
    summary: data.summary,
    difficulty: data.difficulty,
    beauty: data.beauty,
    tiktok: data.tiktok,
    cover,
    photos: data.photos,
    itinerary: [...data.itinerary].sort((a, b) => a.day - b.day),
    storyHtml: renderStory(parsed.content),
  };
}

// All trips, newest first. `root` is a parameter only so tests can point at a fixture folder.
export function getAllTrips(root: string = TRIPS_DIR): Trip[] {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => loadTrip(root, entry.name))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getTrip(
  slug: string,
  root: string = TRIPS_DIR,
): Trip | undefined {
  return getAllTrips(root).find((trip) => trip.slug === slug);
}

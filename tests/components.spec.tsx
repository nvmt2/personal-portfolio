import { expect, test } from '@playwright/test';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { ExternalLink } from '@/components/ExternalLink';
import { Header } from '@/components/Header';
import { Section } from '@/components/Section';
import { Tag } from '@/components/Tag';

// Components are rendered to static HTML on the Node side and loaded into the page,
// so no route has to use them yet.
test('ExternalLink opens a new tab safely and says so in its name', async ({
  page,
}) => {
  await page.setContent(
    renderToStaticMarkup(
      <ExternalLink href="https://example.com/">GitHub</ExternalLink>,
    ),
  );
  const link = page.getByRole('link', {
    name: 'GitHub (opens in a new tab)',
  });
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
});

test('Button is a plain in-page link', async ({ page }) => {
  await page.setContent(
    renderToStaticMarkup(
      <Button href="#projects" variant="secondary">
        View
      </Button>,
    ),
  );
  const button = page.getByRole('link', { name: 'View' });
  await expect(button).toHaveAttribute('href', '#projects');
});

test('Button prefixes a root-relative href with NEXT_PUBLIC_BASE_PATH', async ({
  page,
}) => {
  const original = process.env.NEXT_PUBLIC_BASE_PATH;
  process.env.NEXT_PUBLIC_BASE_PATH = '/my-portfolio';
  try {
    await page.setContent(
      renderToStaticMarkup(<Button href="/">Back to home</Button>),
    );
  } finally {
    // Never leak into another test, whichever branch runs.
    if (original === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH;
    else process.env.NEXT_PUBLIC_BASE_PATH = original;
  }
  const button = page.getByRole('link', { name: 'Back to home' });
  await expect(button).toHaveAttribute('href', '/my-portfolio/');
});

test('Button leaves a root-relative href as-is with no base path set', async ({
  page,
}) => {
  const original = process.env.NEXT_PUBLIC_BASE_PATH;
  delete process.env.NEXT_PUBLIC_BASE_PATH;
  try {
    await page.setContent(
      renderToStaticMarkup(<Button href="/">Back to home</Button>),
    );
  } finally {
    if (original !== undefined) process.env.NEXT_PUBLIC_BASE_PATH = original;
  }
  const button = page.getByRole('link', { name: 'Back to home' });
  await expect(button).toHaveAttribute('href', '/');
});

test('Button does not prefix a protocol-relative href', async ({ page }) => {
  const original = process.env.NEXT_PUBLIC_BASE_PATH;
  process.env.NEXT_PUBLIC_BASE_PATH = '/my-portfolio';
  try {
    await page.setContent(
      renderToStaticMarkup(<Button href="//example.com">Away</Button>),
    );
  } finally {
    if (original === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH;
    else process.env.NEXT_PUBLIC_BASE_PATH = original;
  }
  const button = page.getByRole('link', { name: 'Away' });
  await expect(button).toHaveAttribute('href', '//example.com');
});

test('Section is a landmark named by its H2', async ({ page }) => {
  await page.setContent(
    renderToStaticMarkup(
      <Section id="skills" title="Skills" intro="What I use" tone="surface">
        <ul>
          <Chip>React</Chip>
          <Tag>a11y</Tag>
        </ul>
      </Section>,
    ),
  );
  await expect(page.getByRole('region', { name: 'Skills' })).toHaveAttribute(
    'id',
    'skills',
  );
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('Skills');
  await expect(page.getByRole('listitem')).toHaveText(['React', 'a11y']);
});

test('Header on home keeps bare section hashes and a root-relative My Story link', async ({
  page,
}) => {
  const original = process.env.NEXT_PUBLIC_BASE_PATH;
  delete process.env.NEXT_PUBLIC_BASE_PATH;
  try {
    await page.setContent(renderToStaticMarkup(<Header />));
  } finally {
    if (original !== undefined) process.env.NEXT_PUBLIC_BASE_PATH = original;
  }
  const nav = page.getByRole('navigation', { name: 'Sections' });
  await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute(
    'href',
    '#about',
  );
  await expect(nav.getByRole('link', { name: 'Contact' })).toHaveAttribute(
    'href',
    '#contact',
  );
  await expect(nav.getByRole('link', { name: 'My Story' })).toHaveAttribute(
    'href',
    '/story',
  );
  await expect(
    page.getByRole('link', { name: 'Jordan Ellis' }),
  ).toHaveAttribute('href', '#top');
});

test('Header on /story points sections home and My Story at the base path', async ({
  page,
}) => {
  const original = process.env.NEXT_PUBLIC_BASE_PATH;
  process.env.NEXT_PUBLIC_BASE_PATH = '/my-portfolio';
  try {
    await page.setContent(renderToStaticMarkup(<Header current="story" />));
  } finally {
    if (original === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH;
    else process.env.NEXT_PUBLIC_BASE_PATH = original;
  }
  const nav = page.getByRole('navigation', { name: 'Sections' });
  await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute(
    'href',
    '/my-portfolio/#about',
  );
  await expect(nav.getByRole('link', { name: 'Contact' })).toHaveAttribute(
    'href',
    '/my-portfolio/#contact',
  );
  const story = nav.getByRole('link', { name: 'My Story' });
  await expect(story).toHaveAttribute('href', '/my-portfolio/story');
  await expect(story).toHaveAttribute('aria-current', 'page');
  await expect(nav.getByRole('link', { name: 'About' })).not.toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(
    page.getByRole('link', { name: 'Jordan Ellis' }),
  ).toHaveAttribute('href', '/my-portfolio/');
});

test('Header on /story without a base path uses /story and /#projects', async ({
  page,
}) => {
  const original = process.env.NEXT_PUBLIC_BASE_PATH;
  delete process.env.NEXT_PUBLIC_BASE_PATH;
  try {
    await page.setContent(renderToStaticMarkup(<Header current="story" />));
  } finally {
    if (original !== undefined) process.env.NEXT_PUBLIC_BASE_PATH = original;
  }
  const nav = page.getByRole('navigation', { name: 'Sections' });
  await expect(nav.getByRole('link', { name: 'Projects' })).toHaveAttribute(
    'href',
    '/#projects',
  );
  await expect(nav.getByRole('link', { name: 'My Story' })).toHaveAttribute(
    'href',
    '/story',
  );
});

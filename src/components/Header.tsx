import { navLinks, profile } from '@/content';
import { getBasePath } from '@/lib/base-path';
import { ThemeToggle } from './ThemeToggle';
import { Container } from './Container';
import { HeaderOffset } from './HeaderOffset';

type HeaderProps = {
  // The page the header sits on. On /story, section links point back to the home page.
  current?: 'story';
};

// Five links must fit one row from 320px up to 480px, so the padding and size drop below 481px.
// Labels never wrap.
const navLinkBase =
  'inline-flex min-h-11 items-center whitespace-nowrap rounded-md px-3 text-[15px] font-medium no-underline max-[480px]:px-0.5 max-[480px]:text-[14px]';

const navLink = `text-text hover:text-accent ${navLinkBase}`;

// The current page gets accent text and a 2px inset underline, so it does not rely on color alone.
const navLinkCurrent = `text-accent shadow-[inset_0_-2px_0_0_var(--color-accent)] ${navLinkBase}`;

// Sticky, except on short screens. At 640px and below the nav moves to its own row and
// the toggle stays next to the name. HeaderOffset sets --header-h from its real height; globals.css has the fallback.
export function Header({ current }: HeaderProps = {}) {
  const base = getBasePath();
  const onStory = current === 'story';
  const brandHref = onStory ? `${base}/` : '#top';

  // Root-relative links get the base path (GitHub Pages serves from a sub-path). Section
  // hashes stay bare on home and point to the home page when the header sits on /story.
  const hrefFor = (href: string) => {
    if (href.startsWith('/')) return `${base}${href}`;
    return onStory ? `${base}/${href}` : href;
  };

  return (
    <header className="border-line bg-bg sticky top-0 z-10 border-b [@media(max-height:480px)]:static">
      <Container>
        <div className="flex flex-wrap items-center gap-x-2 py-3.5 max-[640px]:py-3">
          <a
            href={brandHref}
            className="text-text mr-auto inline-flex min-h-11 items-center text-[18px] font-bold no-underline"
          >
            {profile.name}
          </a>
          <nav
            aria-label="Sections"
            className="flex items-center max-[640px]:order-last max-[640px]:w-full max-[640px]:-ml-1.5"
          >
            {navLinks.map((link) => {
              const isCurrent = onStory && link.href === '/story';
              return (
                <a
                  key={link.href}
                  href={hrefFor(link.href)}
                  className={isCurrent ? navLinkCurrent : navLink}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </Container>
      <HeaderOffset />
    </header>
  );
}

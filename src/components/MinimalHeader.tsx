import Link from 'next/link';
import { profile } from '@/content';
import { Container } from './Container';

// Header for pages with no sections to navigate (the 404 page): the name links home, and there
// is no theme toggle. The theme still comes from the pre-paint script in layout.tsx.
// next/link's <Link> prefixes "/" with basePath itself, unlike the plain <a> in Button.
export function MinimalHeader() {
  return (
    <header className="border-line bg-bg border-b">
      <Container>
        <div className="flex items-center py-3.5">
          <Link
            href="/"
            className="text-text inline-flex min-h-11 items-center text-[18px] font-bold no-underline"
          >
            {profile.name}
          </Link>
        </div>
      </Container>
    </header>
  );
}

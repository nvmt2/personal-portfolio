import type { ReactNode } from 'react';

// Text-link look: accent colour, underline that thickens on hover, 44px tall hit area.
export const textLinkClasses =
  'inline-flex min-h-11 items-center text-accent underline decoration-1 underline-offset-4 hover:decoration-2';

type ExternalLinkProps = {
  href: string;
  children: ReactNode;
  // Replaces the text-link look, for example with buttonClasses('secondary').
  className?: string;
};

// The only way to link off-site. It always opens a new tab safely and says so in the
// accessible name. The visible text stays first so the name still starts with it.
export function ExternalLink({ href, children, className }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? textLinkClasses}
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

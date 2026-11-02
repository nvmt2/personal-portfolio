import type { ReactNode } from 'react';
import { Container } from './Container';

type SectionProps = {
  id: string;
  title: string;
  intro?: string;
  tone?: 'default' | 'surface';
  children?: ReactNode;
};

// A page section labelled by its own H2, so it shows up as a landmark.
export function Section({
  id,
  title,
  intro,
  tone = 'default',
  children,
}: SectionProps) {
  const titleId = `${id}-title`;
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={`py-[clamp(48px,8vw,96px)] ${tone === 'surface' ? 'bg-surface' : 'bg-bg'}`}
    >
      <Container>
        <h2 id={titleId}>{title}</h2>
        {intro ? (
          <p className="text-muted mt-3 max-w-[56ch] [overflow-wrap:anywhere]">
            {intro}
          </p>
        ) : null}
        {children ? <div className="mt-10">{children}</div> : null}
      </Container>
    </section>
  );
}

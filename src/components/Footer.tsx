import { footer, profile } from '@/content';
import { Container } from './Container';
import { ExternalLink } from './ExternalLink';

export function Footer() {
  return (
    <footer className="border-line text-muted border-t py-8 text-[15px]">
      <Container>
        <div className="flex flex-wrap justify-between gap-x-6 gap-y-2">
          <span>{profile.name}</span>
          <span className="flex flex-wrap items-center gap-x-2">
            <span>{footer.builtWith}</span>
            <span aria-hidden="true">{footer.separator}</span>
            <span>{footer.demoNotice}</span>
            <span aria-hidden="true">{footer.separator}</span>
            <ExternalLink href={footer.templateHref}>
              {footer.templateLabel}
            </ExternalLink>
          </span>
        </div>
      </Container>
    </footer>
  );
}

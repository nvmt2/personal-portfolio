import { profile } from '@/content';
import { Button } from './Button';
import { Container } from './Container';
import { Portrait } from './Portrait';

// The hero. It owns the page's only H1, so it does not use Section (which renders an H2).
export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="bg-bg py-[clamp(48px,8vw,96px)]"
    >
      <Container>
        <div className="flex flex-wrap items-center gap-x-16 gap-y-10">
          <div className="min-w-0 flex-1 basis-[320px]">
            <p className="text-accent text-[15px] font-semibold [overflow-wrap:anywhere]">
              {profile.greeting}
            </p>
            <h1 id="about-title" className="mt-3 [overflow-wrap:anywhere]">
              {profile.headline}
            </h1>
            <p className="text-muted mt-5 max-w-[56ch] text-[clamp(17px,2vw,19px)] [overflow-wrap:anywhere]">
              {profile.bio}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#projects">{profile.projectsCta}</Button>
              <Button href="#contact" variant="secondary">
                {profile.contactCta}
              </Button>
            </div>
          </div>
          <Portrait label={profile.portraitAlt} />
        </div>
      </Container>
    </section>
  );
}

import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Footer } from '@/components/Footer';
import { MinimalHeader } from '@/components/MinimalHeader';
import { notFound } from '@/content';

// Exported as out/404.html. Links point at "/" so they also work from any unknown path.
export default function NotFound() {
  return (
    <>
      <MinimalHeader />
      <main
        id="main"
        tabIndex={-1}
        className="py-[clamp(48px,8vw,96px)] outline-none"
      >
        <Container>
          <p className="text-accent text-[15px] font-semibold">
            {notFound.eyebrow}
          </p>
          <h1 className="mt-2">{notFound.title}</h1>
          <p className="text-muted mt-4 max-w-[56ch] [overflow-wrap:anywhere]">
            {notFound.text}
          </p>
          <div className="mt-8">
            <Button href="/">{notFound.backLabel}</Button>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

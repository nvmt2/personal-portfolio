import type { Metadata } from 'next';
import { Container } from '@/components/Container';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { TripCard } from '@/components/TripCard';
import { tripsSection } from '@/content';
import { getAllTrips } from '@/lib/trips';

export const metadata: Metadata = {
  title: tripsSection.pageTitle,
  description: tripsSection.intro,
};

export default function TripsPage() {
  const trips = getAllTrips();
  return (
    <>
      <Header current="trips" />
      <main
        id="main"
        tabIndex={-1}
        className="py-[clamp(48px,8vw,96px)] outline-none"
      >
        <Container>
          <h1>{tripsSection.title}</h1>
          <p className="text-muted mt-3 max-w-[56ch] [overflow-wrap:anywhere]">
            {tripsSection.intro}
          </p>
          {trips.length > 0 ? (
            <ul className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,290px),1fr))] gap-6">
              {trips.map((trip) => (
                <TripCard key={trip.slug} trip={trip} />
              ))}
            </ul>
          ) : (
            <p className="text-muted mt-10">{tripsSection.empty}</p>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}

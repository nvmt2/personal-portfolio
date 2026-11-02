import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buttonClasses } from '@/components/Button';
import { Container } from '@/components/Container';
import { ExternalLink } from '@/components/ExternalLink';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Rating } from '@/components/Rating';
import { TripPhoto } from '@/components/TripPhoto';
import { profile, tripsSection } from '@/content';
import { formatTripDate } from '@/lib/format';
import { getAllTrips, getTrip } from '@/lib/trips';

type Params = { slug: string };

// Static export: only the slugs below exist, anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getAllTrips().map((trip) => ({ slug: trip.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const trip = getTrip((await params).slug);
  if (!trip) return {};
  return {
    title: `${trip.title} - ${profile.name}`,
    description: trip.summary,
  };
}

export default async function TripPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const trip = getTrip((await params).slug);
  if (!trip) notFound();

  return (
    <>
      <Header current="trips" />
      <main
        id="main"
        tabIndex={-1}
        className="py-[clamp(48px,8vw,96px)] outline-none"
      >
        <Container>
          <Link
            href="/trips"
            className="text-accent inline-flex min-h-11 items-center underline decoration-1 underline-offset-4 hover:decoration-2"
          >
            <span aria-hidden="true">← </span>
            {tripsSection.backLabel}
          </Link>
          <h1 className="mt-4 max-w-[24ch] [overflow-wrap:anywhere]">
            {trip.title}
          </h1>
          <p className="text-muted mt-3">
            {formatTripDate(trip.date)} · {trip.days} {tripsSection.daysLabel}
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5">
            <Rating
              label={tripsSection.difficultyLabel}
              value={trip.difficulty}
            />
            <Rating label={tripsSection.beautyLabel} value={trip.beauty} />
          </div>

          <section aria-labelledby="photos-title" className="mt-10">
            <h2 id="photos-title" className="sr-only">
              {tripsSection.photosTitle}
            </h2>
            <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,290px),1fr))] gap-4">
              {trip.photos.map((photo, index) => (
                <li key={photo.file}>
                  <TripPhoto
                    slug={trip.slug}
                    photo={photo}
                    eager={index === 0}
                    className="rounded-lg"
                  />
                </li>
              ))}
            </ul>
          </section>

          <div
            className="mt-10 max-w-[65ch] [overflow-wrap:anywhere] [&_p]:mt-4 [&_p:first-child]:mt-0 [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: trip.storyHtml }}
          />

          <section aria-labelledby="itinerary-title" className="mt-12">
            <h2 id="itinerary-title">{tripsSection.itineraryTitle}</h2>
            <ol className="mt-6 flex max-w-[65ch] flex-col gap-4">
              {trip.itinerary.map((stop) => (
                <li
                  key={stop.day}
                  className="border-line flex gap-4 border-l-2 pl-4"
                >
                  <span className="text-accent shrink-0 font-semibold">
                    {tripsSection.dayLabel} {stop.day}
                  </span>
                  <span className="[overflow-wrap:anywhere]">
                    {stop.title}
                    <span className="text-muted block text-[14px]">
                      {stop.place}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <div className="mt-12 flex flex-wrap gap-3">
            <ExternalLink
              href={tripsSection.zaloHref}
              className={buttonClasses('primary')}
            >
              {tripsSection.zaloLabel}
            </ExternalLink>
            {trip.tiktok ? (
              <ExternalLink
                href={trip.tiktok}
                className={buttonClasses('secondary')}
              >
                {tripsSection.tiktokLabel}
              </ExternalLink>
            ) : null}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

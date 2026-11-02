import Link from 'next/link';
import { tripsSection } from '@/content';
import { formatTripDate } from '@/lib/format';
import type { Trip } from '@/lib/trips';
import { Rating } from './Rating';
import { TripPhoto } from './TripPhoto';

// A trip card. Renders an <li>, so put it inside a <ul>. Only the title link is interactive.
// next/link prefixes "/" with basePath itself.
export function TripCard({ trip }: { trip: Trip }) {
  return (
    <li className="border-line bg-bg flex flex-col overflow-hidden rounded-lg border">
      <TripPhoto slug={trip.slug} photo={trip.cover} />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-muted text-[14px]">
          {formatTripDate(trip.date)} · {trip.days} {tripsSection.daysLabel}
        </p>
        <h3 className="[overflow-wrap:anywhere]">{trip.title}</h3>
        <p className="text-muted [overflow-wrap:anywhere]">{trip.summary}</p>
        <div className="flex flex-col gap-1.5">
          <Rating
            label={tripsSection.difficultyLabel}
            value={trip.difficulty}
          />
          <Rating label={tripsSection.beautyLabel} value={trip.beauty} />
        </div>
        <div className="mt-auto pt-2">
          <Link
            href={`/trips/${trip.slug}`}
            className="text-accent inline-flex min-h-11 items-center underline decoration-1 underline-offset-4 hover:decoration-2"
          >
            {tripsSection.readStoryLabel}
            <span className="sr-only">: {trip.title}</span>
          </Link>
        </div>
      </div>
    </li>
  );
}

// "2025-10-12" -> "Oct 2025". Fixed locale and UTC, so the build gives the same text everywhere.
export function formatTripDate(isoDate: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

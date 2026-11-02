import { tripsSection } from '@/content';

type RatingProps = {
  label: string;
  value: number;
};

// A 1-5 rating shown as text ("Difficulty 4/5") plus five dots. The dots are decoration, so the
// rating never relies on color or shape alone and screen readers get one clear sentence.
export function Rating({ label, value }: RatingProps) {
  return (
    <span className="inline-flex items-center gap-2 text-[14px]">
      <span className="text-muted font-medium">{label}</span>
      <span aria-hidden="true" className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={`size-2.5 rounded-full ${n <= value ? 'bg-accent' : 'border-ctl border'}`}
          />
        ))}
      </span>
      <span className="text-text font-semibold">
        {value}/5<span className="sr-only"> {tripsSection.ratingScale}</span>
      </span>
    </span>
  );
}

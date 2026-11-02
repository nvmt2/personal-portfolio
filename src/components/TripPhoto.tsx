import { getBasePath } from '@/lib/base-path';
import type { TripPhoto as TripPhotoData } from '@/lib/trips';

type TripPhotoProps = {
  slug: string;
  photo: TripPhotoData;
  // Only the first image on a page should skip lazy loading.
  eager?: boolean;
  className?: string;
};

// Photos are copied to /trip-photos/<slug>/ by scripts/copy-trip-photos.mjs. The 4:3 box and the
// width/height reserve the space before the image loads, so the page does not jump.
export function TripPhoto({ slug, photo, eager, className }: TripPhotoProps) {
  return (
    // next/image optimization is off in a static export, so a plain <img> is the right tool.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${getBasePath()}/trip-photos/${slug}/${photo.file}`}
      alt={photo.alt}
      width={1200}
      height={900}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={`bg-surface aspect-[4/3] w-full object-cover ${className ?? ''}`}
    />
  );
}

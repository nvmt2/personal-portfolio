import type { ThumbnailKind } from '@/content';
import { Components } from './Components';
import { Dashboard } from './Dashboard';
import { Kanban } from './Kanban';

const illustrations = {
  kanban: Kanban,
  dashboard: Dashboard,
  components: Components,
} satisfies Record<ThumbnailKind, () => React.JSX.Element>;

// Fixed 16:9 slot so the card never shifts; the card wrapper provides the accessible name.
export function Thumbnail({ kind }: { kind: ThumbnailKind }) {
  const Illustration = illustrations[kind];
  return (
    <div className="aspect-video w-full overflow-hidden rounded-md">
      <Illustration />
    </div>
  );
}

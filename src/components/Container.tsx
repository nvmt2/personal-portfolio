import type { ReactNode } from 'react';

// Centers content in a 1080px column with a 24px gutter on each side.
export function Container({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[calc(var(--container-max)+2*var(--gutter))] px-[var(--gutter)]">
      {children}
    </div>
  );
}

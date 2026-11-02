import type { ReactNode } from 'react';

// A project tag. Renders an <li>, so put it inside a <ul>.
export function Tag({ children }: { children: ReactNode }) {
  return (
    <li className="border-line bg-surface border text-muted rounded-full px-3 py-1 text-[13px] font-medium">
      {children}
    </li>
  );
}

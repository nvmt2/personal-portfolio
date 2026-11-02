import type { ReactNode } from 'react';

// A skill. Renders an <li>, so put it inside a <ul>.
export function Chip({ children }: { children: ReactNode }) {
  return (
    <li className="border-line bg-surface border text-text rounded-md px-3.5 py-2 text-[15px] font-medium">
      {children}
    </li>
  );
}

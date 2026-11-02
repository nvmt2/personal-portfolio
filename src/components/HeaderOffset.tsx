'use client';

import { useEffect } from 'react';

// Sets --header-h from the real header height, so anchors still land below it when text zoom
// or a wrapped link makes the header taller. The px values in globals.css are the fallback
// until this runs.
export function HeaderOffset() {
  useEffect(() => {
    const header = document.querySelector('header');
    if (!header) return;
    const update = () => {
      const sticky = getComputedStyle(header).position === 'sticky';
      const height = header.getBoundingClientRect().height;
      document.documentElement.style.setProperty(
        '--header-h',
        sticky ? `${height}px` : '0px',
      );
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(header, { box: 'border-box' });
    // The header can switch between sticky and static without changing size.
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
      document.documentElement.style.removeProperty('--header-h');
    };
  }, []);

  return null;
}

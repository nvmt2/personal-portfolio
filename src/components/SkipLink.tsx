// First focusable element on every page: hidden until it has focus, then jumps past the header.
export function SkipLink() {
  return (
    <a
      href="#main"
      className="bg-accent text-on-accent sr-only rounded-md font-semibold no-underline focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2"
    >
      Skip to content
    </a>
  );
}

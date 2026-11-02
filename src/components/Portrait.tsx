// Placeholder portrait: head and shoulders on a circle. It reads the theme tokens, so it
// follows light and dark, which an <img> could not. `label` is the accessible name.
export function Portrait({ label }: { label: string }) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 220 220"
      width="220"
      height="220"
      className="shrink-0 rounded-full"
    >
      <circle cx="110" cy="110" r="110" fill="var(--surface)" />
      <circle cx="110" cy="88" r="38" fill="var(--accent)" />
      <path
        d="M30 196c8-42 42-62 80-62s72 20 80 62a110 110 0 0 1-160 0z"
        fill="var(--accent)"
        opacity="0.85"
      />
      <circle
        cx="110"
        cy="110"
        r="109"
        fill="none"
        stroke="var(--line)"
        strokeWidth="2"
      />
    </svg>
  );
}

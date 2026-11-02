export function Dashboard() {
  const bars = [38, 56, 44, 72, 60, 88, 66];
  return (
    <svg
      viewBox="0 0 320 180"
      width="100%"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="320" height="180" fill="var(--surface)" />
      <rect
        x="16"
        y="16"
        width="288"
        height="148"
        rx="10"
        fill="var(--bg)"
        stroke="var(--line)"
      />
      <rect x="30" y="28" width="60" height="6" rx="3" fill="var(--text)" />
      <rect x="30" y="40" width="36" height="5" rx="2.5" fill="var(--muted)" />
      <rect x="236" y="28" width="54" height="18" rx="9" fill="var(--accent)" />
      {[90, 110, 130].map((y) => (
        <line key={y} x1="30" x2="290" y1={y} y2={y} stroke="var(--line)" />
      ))}
      {bars.map((h, i) => (
        <rect
          key={i}
          x={36 + i * 36}
          y={150 - h}
          width="20"
          height={h}
          rx="4"
          fill={i === 5 ? 'var(--accent)' : 'var(--ctl)'}
        />
      ))}
    </svg>
  );
}

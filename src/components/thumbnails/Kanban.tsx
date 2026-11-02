export function Kanban() {
  const cols = [12, 116, 220];
  return (
    <svg
      viewBox="0 0 320 180"
      width="100%"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="320" height="180" fill="var(--surface)" />
      <rect x="0" y="0" width="320" height="22" fill="var(--bg)" />
      <rect x="12" y="8" width="48" height="6" rx="3" fill="var(--accent)" />
      {cols.map((x, i) => (
        <g key={x}>
          <rect
            x={x}
            y="32"
            width="88"
            height="136"
            rx="8"
            fill="var(--bg)"
            stroke="var(--line)"
          />
          <rect
            x={x + 8}
            y="40"
            width="32"
            height="5"
            rx="2.5"
            fill="var(--muted)"
          />
          {Array.from({ length: 3 - (i === 2 ? 1 : 0) }).map((_, j) => (
            <g key={j}>
              <rect
                x={x + 8}
                y={54 + j * 38}
                width="72"
                height="30"
                rx="6"
                fill="var(--surface)"
                stroke="var(--line)"
              />
              <rect
                x={x + 14}
                y={61 + j * 38}
                width="44"
                height="4"
                rx="2"
                fill="var(--text)"
              />
              <rect
                x={x + 14}
                y={71 + j * 38}
                width={j === 0 ? 24 : 34}
                height="4"
                rx="2"
                fill={j === 0 ? 'var(--accent)' : 'var(--muted)'}
              />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

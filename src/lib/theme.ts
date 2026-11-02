export type Theme = 'light' | 'dark';

// Keep in sync with --bg in globals.css. Browsers need a literal color for <meta name="theme-color">.
const THEME_COLORS: Record<Theme, string> = {
  light: '#ffffff',
  dark: '#0f1117',
};

// The choice made in this tab. It wins over the system theme even when storage is blocked.
let sessionChoice: Theme | null = null;

function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem('theme');
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  // Both metas get the same color, so the browser bar follows the choice, not the system.
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => {
      meta.content = THEME_COLORS[theme];
    });
}

export function chooseTheme(theme: Theme) {
  sessionChoice = theme;
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // Storage is blocked: the choice lasts for this tab only.
  }
  applyTheme(theme);
}

// Follows live system changes until the user picks a theme. Returns a cleanup function.
export function followSystemTheme() {
  const query = matchMedia('(prefers-color-scheme: dark)');
  // Re-apply once on mount: hydration can reset the theme-color metas, and the system theme
  // may have changed since the pre-paint script ran.
  applyTheme(
    sessionChoice ?? readStoredTheme() ?? (query.matches ? 'dark' : 'light'),
  );
  const onChange = (event: MediaQueryListEvent) => {
    if (sessionChoice || readStoredTheme()) return;
    applyTheme(event.matches ? 'dark' : 'light');
  };
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

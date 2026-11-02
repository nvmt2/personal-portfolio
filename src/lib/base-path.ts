// The `basePath` from `next.config.ts`, exposed through its `env: { NEXT_PUBLIC_BASE_PATH }` entry
// so server and client components read the same value. Only the GitHub Pages deploy workflow sets
// PAGES_BASE_PATH, so local dev, CI and Playwright keep building and serving from "/".
// A function, not a frozen constant, so a test can set the env var and observe a fresh read.
export function getBasePath() {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? '';
}

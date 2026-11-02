import type { NextConfig } from 'next';

// Set only by the GitHub Pages deploy workflow, to "/my-portfolio". Local dev, CI and Playwright
// never set it, so they keep building and serving from "/". assetPrefix must match basePath,
// otherwise /_next/* assets would still resolve at the site root under the sub-path.
// src/lib/base-path.ts reads it back through the NEXT_PUBLIC_BASE_PATH env entry below.
const basePath = process.env.PAGES_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath,
  // Inlined at build time so client components get the same value as basePath.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;

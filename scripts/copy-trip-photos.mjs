// Copies the photos in content/trips/<slug>/ to public/trip-photos/<slug>/ so Next.js serves them.
// Runs before `pnpm dev` and `pnpm build`. The target folder is generated and git-ignored.
// It is not public/trips/ on purpose: out/trips/<slug>.html is the page, and a folder with the
// same name next to it would make GitHub Pages redirect /trips/<slug> to a missing index.html.
import fs from 'node:fs';
import path from 'node:path';

const source = path.join(process.cwd(), 'content', 'trips');
const target = path.join(process.cwd(), 'public', 'trip-photos');

fs.rmSync(target, { recursive: true, force: true });

if (fs.existsSync(source)) {
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);
    fs.mkdirSync(to, { recursive: true });
    for (const file of fs.readdirSync(from)) {
      if (file.toLowerCase().endsWith('.md')) continue;
      fs.copyFileSync(path.join(from, file), path.join(to, file));
    }
  }
}

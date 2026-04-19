#!/usr/bin/env node
/**
 * Copy the self-hosted WOFF2 fonts from @gh/gh-ds into the portal's public/
 * tree so Astro serves them at `/fonts/...`. Runs before `astro build`.
 *
 * Kept zero-dep and synchronous for simplicity.
 */

import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, '..', '..', '..', 'packages', 'gh-ds', 'fonts');
const target = join(here, '..', 'public', 'fonts');

mkdirSync(target, { recursive: true });

let copied = 0;
for (const file of readdirSync(source)) {
  if (!file.endsWith('.woff2')) continue;
  copyFileSync(join(source, file), join(target, file));
  copied += 1;
}

// eslint-disable-next-line no-console
console.log(`@gh/portal prebuild: copied ${copied} WOFF2 file(s) to public/fonts/`);

if (copied === 0) {
  // eslint-disable-next-line no-console
  console.error(
    'No WOFF2 files found. Run `pnpm --filter @gh/gh-ds fonts` first.',
  );
  process.exit(1);
}

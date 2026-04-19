#!/usr/bin/env node
/**
 * Measure the gzipped transfer weight of the built `/` page and every asset
 * it loads synchronously. Hard-fails if the total exceeds 80 KB gzipped —
 * `docs/doctrine/week-0.md §4` PR 3 DoD. The §1 ceiling of 300 KB total page
 * weight is the ultimate limit; `/` has a tighter budget because it is the
 * first page every citizen sees.
 */

import { readFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { JSDOM } from 'jsdom';

const here = dirname(fileURLToPath(import.meta.url));
const distDir = join(here, '..', 'dist');

const BUDGET_GZIP_BYTES = 80 * 1024;

async function sizeOf(path) {
  const buf = await readFile(path);
  return { raw: buf.length, gzip: gzipSync(buf).length };
}

async function main() {
  const indexPath = join(distDir, 'index.html');
  try {
    await stat(indexPath);
  } catch {
    console.error(`measure-weight: ${indexPath} not found. Run \`pnpm build\` first.`);
    process.exit(1);
  }

  const html = await readFile(indexPath, 'utf8');
  const dom = new JSDOM(html, { url: 'https://gov.gh/' });
  const doc = dom.window.document;

  /** @type {{ name: string; raw: number; gzip: number }[]} */
  const rows = [];
  const htmlSize = await sizeOf(indexPath);
  rows.push({ name: 'index.html', ...htmlSize });

  // Collect synchronous CSS + preloaded fonts + any <script>.
  /** @type {string[]} */
  const assets = [];
  for (const l of doc.querySelectorAll('link[rel="stylesheet"]')) {
    const href = l.getAttribute('href');
    if (href && !href.startsWith('http')) assets.push(href);
  }
  for (const l of doc.querySelectorAll('link[rel="preload"][as="font"]')) {
    const href = l.getAttribute('href');
    if (href && !href.startsWith('http')) assets.push(href);
  }
  for (const s of doc.querySelectorAll('script[src]')) {
    const src = s.getAttribute('src');
    if (src && !src.startsWith('http')) assets.push(src);
  }

  for (const asset of assets) {
    const assetPath = join(distDir, asset.startsWith('/') ? asset.slice(1) : asset);
    try {
      const size = await sizeOf(assetPath);
      rows.push({ name: asset, ...size });
    } catch {
      console.warn(`  ! could not stat ${assetPath}`);
    }
  }

  const total = rows.reduce((acc, r) => ({ raw: acc.raw + r.raw, gzip: acc.gzip + r.gzip }), {
    raw: 0,
    gzip: 0,
  });

  console.log(`measure-weight: transfer of / (with preloaded fonts)\n`);
  console.log('  asset'.padEnd(48) + 'raw'.padStart(10) + 'gzip'.padStart(10));
  console.log('  '.padEnd(48) + '---'.padStart(10) + '----'.padStart(10));
  for (const r of rows) {
    console.log('  ' + r.name.padEnd(46) + String(r.raw).padStart(10) + String(r.gzip).padStart(10));
  }
  console.log('  '.padEnd(48) + '----'.padStart(10) + '----'.padStart(10));
  console.log(
    '  ' + 'TOTAL'.padEnd(46) + String(total.raw).padStart(10) + String(total.gzip).padStart(10),
  );
  console.log(`\n  budget: ${BUDGET_GZIP_BYTES} bytes gzipped`);

  if (total.gzip > BUDGET_GZIP_BYTES) {
    console.error(`\n❌ / exceeds 80 KB gzipped budget (${total.gzip} > ${BUDGET_GZIP_BYTES})`);
    process.exit(1);
  }
  console.log(`\n✅ under budget — ${BUDGET_GZIP_BYTES - total.gzip} bytes headroom`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

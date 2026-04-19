#!/usr/bin/env node
/**
 * Verifies every URL required by the v1 spec §3.1 exists in the build output.
 * Reads `dist/` and asserts each expected path has an `index.html` file.
 *
 * Why this exists: catches regressions where a route file is accidentally
 * deleted, renamed, or fails to compile without manifesting as a 404 until
 * production.
 */
import { readFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, '..', 'dist');

// URLs that must exist even when content collections are empty (stubs OK).
const REQUIRED = [
  '/',
  '/services/',
  '/services/live/',
  '/services/work/',
  '/services/business/',
  '/services/visit/',
  '/services/a-z/',
  '/services/diaspora/',
  '/news/',
  '/ministries/',
  '/about/',
  '/accessibility/',
  '/privacy/',
  '/contact/',
  '/search/',
];

async function check(url) {
  const file = join(dist, url.replace(/\/$/, '/index.html').replace(/^\//, ''));
  try {
    const s = await stat(file);
    if (!s.isFile()) throw new Error('not a file');
    const html = await readFile(file, 'utf8');
    if (!html.includes('<html')) throw new Error('not valid HTML');
    return { url, ok: true };
  } catch (err) {
    return { url, ok: false, reason: err.message };
  }
}

const results = await Promise.all(REQUIRED.map(check));
const failed = results.filter((r) => !r.ok);

for (const r of results) {
  console.log(`  ${r.ok ? '✓' : '✗'} ${r.url}${r.ok ? '' : ' — ' + r.reason}`);
}

if (failed.length > 0) {
  console.error(`\nroutes-test: ${failed.length} missing — FAIL`);
  process.exit(1);
}
console.log(`\nroutes-test: ${results.length} routes resolved — PASS`);

#!/usr/bin/env node
/**
 * axe-core static audit over dist/. Same semantics as apps/portal's
 * version — jsdom + axe-core over every emitted HTML file.
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import axe from 'axe-core';

const here = dirname(fileURLToPath(import.meta.url));
const distDir = join(here, '..', 'dist');

async function listHtmlFiles(dir) {
  const out = [];
  async function walk(current) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.name.endsWith('.html')) {
        out.push(full);
      }
    }
  }
  await walk(dir);
  return out;
}

async function run() {
  try {
    await stat(distDir);
  } catch {
    console.error(`axe-check: ${distDir} not found. Run \`pnpm build\` first.`);
    process.exit(1);
  }

  const files = await listHtmlFiles(distDir);
  if (files.length === 0) {
    console.error('axe-check: no HTML files found under dist/.');
    process.exit(1);
  }

  console.log(`axe-check: scanning ${files.length} HTML file(s)…`);

  let failingViolations = 0;
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    const dom = new JSDOM(html, {
      url: 'https://design.gov.gh/',
      runScripts: 'dangerously',
    });
    const script = dom.window.document.createElement('script');
    script.textContent = axe.source;
    dom.window.document.head.appendChild(script);
    dom.window.console.error = () => {};

    const results = await dom.window.axe.run(dom.window.document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
      },
      resultTypes: ['violations'],
    });

    const scoped = file.replace(distDir, '.').replaceAll('\\', '/');
    if (results.violations.length === 0) {
      console.log(`  ✓ ${scoped} — 0 violations`);
      continue;
    }

    for (const v of results.violations) {
      const blocking = v.impact !== 'minor';
      if (blocking) failingViolations += 1;
      const marker = blocking ? '✗' : '!';
      console.log(`  ${marker} ${scoped} — [${v.impact}] ${v.id}: ${v.help}`);
      for (const node of v.nodes.slice(0, 3)) {
        console.log(`      ${node.target.join(', ')}`);
        if (node.failureSummary) {
          console.log(`      ${node.failureSummary.split('\n').join(' ')}`);
        }
      }
      if (v.nodes.length > 3) {
        console.log(`      … +${v.nodes.length - 3} more node(s)`);
      }
    }
  }

  if (failingViolations > 0) {
    console.error(`\naxe-check: ${failingViolations} violation(s) at impact > minor — FAIL`);
    process.exit(1);
  }
  console.log('\naxe-check: 0 blocking violations — PASS');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

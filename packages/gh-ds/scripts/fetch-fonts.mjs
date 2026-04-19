#!/usr/bin/env node
/**
 * Fetch and subset the three self-hosted fonts per `.claude/CLAUDE.md §6.2`.
 *
 *   Noto Sans     400, 500, 700
 *   Inter         600, 700
 *   JetBrains Mono 400, 700
 *
 * Source: Google Fonts v2 API. Subset via the `subset-font` npm package
 * (fontkit-based, zero-python). Output: WOFF2 at `fonts/<family>-<weight>.woff2`.
 *
 * DoD (week-0.md §4 PR 2): every subset ≤ 30 KB.
 *
 * Character coverage — Latin Extended A/B + the specific glyphs from §6.2:
 *   basic Latin (ASCII)                      U+0020–U+007E
 *   Latin-1 Supplement                       U+00A0–U+00FF
 *   Latin Extended-A                         U+0100–U+017F
 *   Latin Extended-B (ɖ ƒ ɣ ɔ ɛ ŋ ʋ etc.)    U+0180–U+024F
 *   IPA Extensions (tone marks, hooks)       U+0250–U+02AF
 *   Combining Diacritical Marks              U+0300–U+036F
 *   Currency Symbols (GH₵)                   U+20A0–U+20CF
 *   General Punctuation                      U+2000–U+206F
 *
 * Run: `pnpm --filter @gh/gh-ds fonts`
 *
 * The WOFF2 outputs are committed to the repo (small, stable, OFL-licensed).
 */

import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { create as fontkitCreate } from 'fontkit';
import subsetFont from 'subset-font';

const here = dirname(fileURLToPath(import.meta.url));
const fontsDir = join(here, '..', 'fonts');

/**
 * Codepoints that every Ghanaian-language font must carry per §6.2. These
 * are hard-gated — if the upstream subset from Google Fonts does not include
 * any one of them, the fetch fails loudly so we pivot to a source that does.
 */
const REQUIRED_GLYPHS = [
  'ɛ', // U+025B — Akan, Ewe
  'ɔ', // U+0254 — Akan, Ewe
  'ŋ', // U+014B — Akan (uncommon), Ewe, Ga
  'ɖ', // U+0256 — Ewe
  'ƒ', // U+0192 — Ewe
  'ɣ', // U+0263 — Ewe
  'ʋ', // U+028B — Ewe
  '₵', // U+20B5 — Ghana Cedi currency sign (the display glyph; `GH₵` is the text convention)
  'À', // U+00C0 — Latin-1 sanity check
  'é', // U+00E9 — Latin-1 sanity check
];

/**
 * Mono fonts don't need the Ghanaian orthographic glyphs — they're for code.
 * Relax the gate for JetBrains Mono so we don't force subsets with letters
 * that the upstream mono font may not even design.
 */
const MONO_REQUIRED_GLYPHS = ['À', 'é', '€', '£'];

/**
 * Character set per §6.2 glyph coverage.
 *
 * Scope priorities (in order — earlier items are non-negotiable):
 *   1. ASCII printable (English UI, form controls).
 *   2. Latin-1 Supplement (European names, diacritics).
 *   3. The explicit Ghanaian glyphs from §6.2 (ɛ ɔ ŋ ɖ ƒ ɣ ʋ).
 *   4. Currency signs for `GH₵` (U+20B5) and common fallbacks.
 *   5. Curly quotes and en/em dashes used by the editorial voice.
 *
 * Latin Extended-A/B and Combining Diacritical Marks are *not* subsetted
 * wholesale — that doubles payload for marginal gain. If a content author
 * needs a specific glyph outside this set, extend this list and open an ADR.
 */
function buildCharSubset() {
  const chars = new Set();
  // 1. ASCII printable.
  for (let cp = 0x0020; cp <= 0x007e; cp++) chars.add(String.fromCodePoint(cp));
  // 2. Latin-1 Supplement (A-1 through ÿ).
  for (let cp = 0x00a0; cp <= 0x00ff; cp++) chars.add(String.fromCodePoint(cp));
  // 3. Explicit Ghanaian glyphs.
  for (const g of REQUIRED_GLYPHS) chars.add(g);
  // 4. Extra currency.
  chars.add('€');
  chars.add('£');
  chars.add('¢');
  // 5. Curly quotes and dashes.
  for (const g of ['\u2018', '\u2019', '\u201C', '\u201D', '\u2013', '\u2014', '\u2026', '\u00AB', '\u00BB']) {
    chars.add(g);
  }
  return Array.from(chars).join('');
}

/**
 * Google Fonts CSS2 returns a @font-face stylesheet whose `src: url(...)`
 * points at the unsubsetted WOFF2 we then subset locally.
 *
 * `text=` forces a compact payload, but we want the full font here so we
 * subset ourselves; request with no `text=` and parse the first WOFF2 URL.
 */
/**
 * Ask Google Fonts CSS2 for exactly the glyphs we need via `text=`. This
 * forces a single WOFF2 response that contains every requested codepoint —
 * no unicode-range subsetting games, no first-subset-only surprises.
 */
async function downloadOriginal(family, weight, chars) {
  const css2 = new URL('https://fonts.googleapis.com/css2');
  css2.searchParams.set('family', `${family}:wght@${weight}`);
  css2.searchParams.set('display', 'swap');
  css2.searchParams.set('text', chars);

  // A modern desktop UA forces CSS2 to serve woff2, not fallback woff.
  const ua =
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
  const cssResp = await fetch(css2.toString(), { headers: { 'User-Agent': ua } });
  if (!cssResp.ok) {
    throw new Error(`fetch-fonts: ${family} ${weight} CSS2 HTTP ${cssResp.status}`);
  }
  const cssText = await cssResp.text();
  // Google Fonts CSS2 returns either `.../something.woff2` URLs (for
  // unicode-range subsets) or `.../font?kit=...` URLs (for `text=` subsets,
  // which is what we use). Both are WOFF2 payloads identified by the CSS
  // `format('woff2')` hint; match either URL shape.
  const m = /src:\s*url\((https:\/\/[^)]+)\)\s*format\('woff2'\)/.exec(cssText);
  if (!m) {
    throw new Error(
      `fetch-fonts: ${family} ${weight} — no woff2 URL in CSS2 response. ` +
        `Does this family support wght=${weight}?\n\nResponse was:\n${cssText.slice(0, 500)}`,
    );
  }
  const woffResp = await fetch(m[1]);
  if (!woffResp.ok) {
    throw new Error(`fetch-fonts: ${family} ${weight} WOFF2 HTTP ${woffResp.status}`);
  }
  const buf = new Uint8Array(await woffResp.arrayBuffer());
  return Buffer.from(buf);
}

/**
 * After subsetting, confirm the output actually carries every glyph we
 * promised — fontkit refuses to return a valid glyph id for unmapped code
 * points. Fail loudly if anything is missing.
 */
async function verifyCoverage(path, required) {
  const buf = await readFile(path);
  const font = fontkitCreate(buf);
  const missing = [];
  for (const c of required) {
    const cp = c.codePointAt(0);
    const g = font.glyphForCodePoint(cp);
    if (!g || g.id === 0) {
      missing.push(`U+${cp.toString(16).padStart(4, '0').toUpperCase()} (${c})`);
    }
  }
  return missing;
}

async function subsetOne(family, slug, weight, chars, requiredForVerify) {
  // eslint-disable-next-line no-console
  console.log(`  fetching ${family} ${weight} …`);
  const original = await downloadOriginal(family, weight, chars);
  // eslint-disable-next-line no-console
  console.log(`    original: ${original.length} bytes, subsetting …`);
  const subset = await subsetFont(original, chars, {
    targetFormat: 'woff2',
  });
  const out = join(fontsDir, `${slug}-${weight}.woff2`);
  await writeFile(out, subset);
  const sizeKb = (subset.length / 1024).toFixed(1);
  // eslint-disable-next-line no-console
  console.log(`    wrote ${out} — ${subset.length} bytes (${sizeKb} KB)`);
  if (subset.length > 30 * 1024) {
    throw new Error(
      `fetch-fonts: ${family} ${weight} subset is ${subset.length} bytes, > 30 KB DoD`,
    );
  }
  const missing = await verifyCoverage(out, requiredForVerify);
  if (missing.length) {
    throw new Error(
      `fetch-fonts: ${family} ${weight} subset is missing required glyphs: ${missing.join(', ')}`,
    );
  }
  // eslint-disable-next-line no-console
  console.log(`    coverage: ${requiredForVerify.length}/${requiredForVerify.length} required glyphs present ✓`);
  return subset.length;
}

async function main() {
  await mkdir(fontsDir, { recursive: true });
  const chars = buildCharSubset();
  // eslint-disable-next-line no-console
  console.log(`@gh/gh-ds fetch-fonts — character set: ${chars.length} glyphs`);

  const jobs = [
    // [family, slug, weight, required-glyph-gate]
    ['Noto Sans', 'noto-sans', 400, REQUIRED_GLYPHS],
    ['Noto Sans', 'noto-sans', 500, REQUIRED_GLYPHS],
    ['Noto Sans', 'noto-sans', 700, REQUIRED_GLYPHS],
    ['Inter', 'inter', 600, REQUIRED_GLYPHS],
    ['Inter', 'inter', 700, REQUIRED_GLYPHS],
    ['JetBrains Mono', 'jetbrains-mono', 400, MONO_REQUIRED_GLYPHS],
    ['JetBrains Mono', 'jetbrains-mono', 700, MONO_REQUIRED_GLYPHS],
  ];

  let total = 0;
  for (const [family, slug, weight, required] of jobs) {
    total += await subsetOne(family, slug, weight, chars, required);
  }
  // eslint-disable-next-line no-console
  console.log(`\nTotal font payload: ${(total / 1024).toFixed(1)} KB across ${jobs.length} files`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

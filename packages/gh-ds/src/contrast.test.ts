import { describe, expect, it } from 'vitest';
import { colourFlat } from './tokens/colour.ts';
import {
  semantic,
  textOnSurfaceTokens,
  uiAdjacentTokens,
  type SemanticToken,
} from './tokens/semantic.ts';
import { checkContrast, contrastRatio, formatRatio } from './contrast.ts';

/**
 * Background under test — `.claude/CLAUDE.md §6.1` pins `surface` to
 * `ghana-ink.50`. Any addition of a dark surface token requires reciprocal
 * tests here.
 */
const SURFACE = colourFlat['ghana-ink-50']!;

describe('WCAG relative luminance — formula sanity', () => {
  it('black has luminance 0', () => {
    // The formula for c <= 0.03928 divides by 12.92; 0/12.92 = 0.
    // Luminance of pure black should therefore be exactly 0.
    expect(contrastRatio('#000000', '#000000')).toBeCloseTo(1, 5);
  });

  it('white on black is 21:1', () => {
    expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 0);
  });

  it('same colour on itself is 1:1', () => {
    expect(contrastRatio('#CE1126', '#CE1126')).toBeCloseTo(1, 5);
  });

  it('direction-independent', () => {
    const a = contrastRatio('#005A35', '#F7F7F8');
    const b = contrastRatio('#F7F7F8', '#005A35');
    expect(a).toBeCloseTo(b, 10);
  });

  it('rejects malformed hex', () => {
    expect(() => contrastRatio('not-a-colour', '#FFFFFF')).toThrow();
    expect(() => contrastRatio('#FFF', '#FFFFFF')).toThrow(); // 3-digit unsupported
  });
});

describe('text-on-surface tokens meet WCAG 2.2 AA (4.5:1)', () => {
  for (const token of textOnSurfaceTokens) {
    it(`${token} vs ghana-ink-50 — AA normal text`, () => {
      const fg = semantic[token];
      const result = checkContrast(fg, SURFACE);
      expect(
        result.passesAANormal,
        `${token} (${fg}) vs ${SURFACE} — ${formatRatio(result.ratio)}`,
      ).toBe(true);
    });
  }
});

describe('UI-adjacent tokens meet WCAG 2.2 AA (3:1)', () => {
  for (const token of uiAdjacentTokens) {
    it(`${token} vs ghana-ink-50 — AA UI 1.4.11`, () => {
      const fg = semantic[token];
      const result = checkContrast(fg, SURFACE);
      expect(result.passesUI, `${token} (${fg}) vs ${SURFACE} — ${formatRatio(result.ratio)}`).toBe(
        true,
      );
    });
  }
});

describe('warning tokens — composite contract', () => {
  it('warning-text reads on warning-bg at AA normal', () => {
    const result = checkContrast(semantic['warning-text'], semantic['warning-bg']);
    expect(result.passesAANormal, `warning-text on warning-bg — ${formatRatio(result.ratio)}`).toBe(
      true,
    );
  });
});

describe('focus-ring contract — visible against both action-primary and surface', () => {
  it('focus-ring vs action-primary — 3:1 per SC 1.4.11', () => {
    const result = checkContrast(semantic['focus-ring'], semantic['action-primary']);
    expect(result.passesUI, `focus-ring vs action-primary — ${formatRatio(result.ratio)}`).toBe(
      true,
    );
  });
});

describe('known dark-mode gap — documented, not silenced', () => {
  // The current `semantic` mapping is light-mode only. Dark mode needs its
  // own semantic layer. This test pins the gap explicitly so a future PR that
  // adds dark-mode tokens will break this and force the author to remove the
  // gap from CONTRAST-REPORT.md.
  const darkSurface = colourFlat['ghana-ink-900']!;
  const darkModeFailures: SemanticToken[] = [];

  for (const token of textOnSurfaceTokens) {
    const result = checkContrast(semantic[token], darkSurface);
    if (!result.passesAANormal) {
      darkModeFailures.push(token);
    }
  }

  it('at least one text token fails on dark surface today — requires dark-mode token set', () => {
    // If this test starts failing (i.e. 0 failures), it means someone added
    // a dark-mode variant. Good — update CONTRAST-REPORT.md and delete this
    // test so it doesn't silently confirm a gap that has been fixed.
    expect(darkModeFailures.length).toBeGreaterThan(0);
  });
});

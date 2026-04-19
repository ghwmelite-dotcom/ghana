/**
 * WCAG 2.2 contrast utilities.
 *
 * Implements the relative-luminance and contrast-ratio formulas from
 * WCAG 2.2 §1.4.3 (text) and §1.4.11 (non-text UI).
 *
 *   AA text        — 4.5:1 minimum
 *   AA large text  — 3.0:1 minimum  (≥ 18.66px bold or ≥ 24px regular)
 *   AA UI / focus  — 3.0:1 minimum
 *   AAA text       — 7.0:1 (aspirational for body copy)
 *
 * Ref: https://www.w3.org/TR/WCAG22/#dfn-relative-luminance
 *
 * Not using `@adobe/leonardo-contrast-colors` for this check — that library
 * is for generating colour scales, and its contrast function pulls in colorjs
 * and a large sRGB->OKLCH dependency chain. WCAG's formula is a dozen lines;
 * keeping it local means one fewer dependency in the gh-ds supply chain.
 */

export type Hex = `#${string}`;

export interface ContrastResult {
  ratio: number;
  passesAANormal: boolean; // 4.5:1
  passesAALarge: boolean; // 3.0:1
  passesAAA: boolean; // 7.0:1
  passesUI: boolean; // 3.0:1 (alias of AA large, semantic name)
}

/**
 * Convert a `#RRGGBB` hex string to linearised sRGB channel values in [0, 1].
 * 3-digit hex (`#RGB`) is intentionally unsupported — our tokens are always
 * 6-digit to avoid ambiguity.
 */
function hexToLinearRgb(hex: string): readonly [number, number, number] {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m || !m[1]) {
    throw new Error(
      `contrast: expected 6-digit hex colour like "#CE1126", received: ${JSON.stringify(hex)}`,
    );
  }
  const value = m[1];
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;

  // sRGB gamma → linear per WCAG 2.2.
  const toLinear = (c: number): number =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return [toLinear(r), toLinear(g), toLinear(b)] as const;
}

/**
 * WCAG relative luminance in [0, 1].
 */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToLinearRgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * WCAG contrast ratio between two colours. Always returns a value in [1, 21].
 * Direction-independent: `contrastRatio(a, b) === contrastRatio(b, a)`.
 */
export function contrastRatio(foreground: string, background: string): number {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Compute a WCAG 2.2 contrast check against the four standard thresholds.
 */
export function checkContrast(foreground: string, background: string): ContrastResult {
  const ratio = contrastRatio(foreground, background);
  return {
    ratio,
    passesAANormal: ratio >= 4.5,
    passesAALarge: ratio >= 3,
    passesAAA: ratio >= 7,
    passesUI: ratio >= 3,
  };
}

/**
 * Format a ratio for reports: `7.86:1`.
 */
export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}

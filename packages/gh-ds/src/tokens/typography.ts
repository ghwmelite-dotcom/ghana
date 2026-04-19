/**
 * Ghana Design System — typography tokens.
 *
 * Source: `.claude/CLAUDE.md §6.2`.
 *
 * Body + UI uses **Noto Sans** specifically because it covers the glyphs
 * every major Ghanaian language needs: `ɛ`, `ɔ`, `ŋ`, `ɖ`, `ƒ`, `ɣ`, `ʋ`,
 * hooked Hausa, combining tone marks. Inter is display-only; JetBrains Mono
 * is code-only. All three ship SIL OFL, self-hosted WOFF2, `font-display: swap`,
 * subset aggressively — see `../../scripts/fetch-fonts.mjs`.
 */

export const fontFamily = {
  body: [
    'Noto Sans',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    'sans-serif',
  ].join(', '),
  display: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'].join(', '),
  mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'].join(', '),
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

/**
 * Type scale from `.claude/CLAUDE.md §6.2` — expressed in rem with a 16px root.
 * The values are fixed (no fluid clamps) because government services prize
 * predictable typography over decorative responsiveness.
 */
export const fontSize = {
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  base: '1rem', // 16px
  lg: '1.125rem', // 18px
  xl: '1.25rem', // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '2rem', // 32px
  '4xl': '2.5rem', // 40px
  '5xl': '3rem', // 48px
  '6xl': '4rem', // 64px
} as const;

export const lineHeight = {
  display: 1.2,
  heading: 1.35,
  body: 1.5,
} as const;

export type FontFamilyToken = keyof typeof fontFamily;
export type FontWeightToken = keyof typeof fontWeight;
export type FontSizeToken = keyof typeof fontSize;
export type LineHeightToken = keyof typeof lineHeight;

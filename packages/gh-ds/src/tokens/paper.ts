/**
 * Paper surface tokens — the "Refined warmth" visual direction from
 * docs/superpowers/specs/2026-04-19-ghana-gov-v1-design.md §4.1.
 *
 * `paper` is the page background — a warm off-white that sets the whole
 * portal's tone. `paperLine` is the hairline border used on card edges and
 * dividers. `paperRaised` is pure white for elevated cards that need to lift
 * above the paper ground.
 */
export const paper = {
  DEFAULT: '#FAF7F2', // page background
  line: '#E5E0D6', // hairline borders
  raised: '#FFFFFF', // elevated cards
} as const;

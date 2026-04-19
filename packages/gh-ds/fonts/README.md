# Self-hosted fonts

Generated WOFF2 subsets for the three typefaces pinned in
`.claude/CLAUDE.md §6.2`.

## Files

The WOFF2 files in this directory are **generated** by
`../scripts/fetch-fonts.mjs`. They are committed to the repo because they are
small, stable, OFL-licensed, and reproducing them requires outbound network
access to Google Fonts that CI does not always have.

| Family         | Weights     | File pattern                    |
| -------------- | ----------- | ------------------------------- |
| Noto Sans      | 400 500 700 | `noto-sans-<weight>.woff2`      |
| Inter          | 600 700     | `inter-<weight>.woff2`          |
| JetBrains Mono | 400 700     | `jetbrains-mono-<weight>.woff2` |

## Regenerating

```bash
pnpm --filter @gh/gh-ds fonts
```

The script downloads the upstream WOFF2 from the Google Fonts v2 API, subsets
each to the glyph ranges documented at the top of `../scripts/fetch-fonts.mjs`,
and writes the result here. Every output must be ≤ 30 KB per
`docs/doctrine/week-0.md §4` PR 2 DoD — the script hard-fails if any subset
exceeds that.

## Glyph coverage

Aligned with §6.2 — Noto Sans specifically because it covers the Ghanaian
languages:

- `ɛ` `ɔ` `ŋ` (Akan, Ewe)
- `ɖ` `ƒ` `ɣ` `ʋ` (Ewe)
- hooked Hausa letters
- combining tone marks for tonal orthographies
- plus Latin, Latin-1, Latin Extended-A/B, IPA Extensions, Combining
  Diacriticals, Punctuation, Currency Symbols (for `GH₵`).

## Licence

All three fonts are SIL Open Font Licence 1.1. See `OFL.txt`. Subsetting does
not change the licence.

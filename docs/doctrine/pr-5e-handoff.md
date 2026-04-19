# PR 5e — Handoff & verification

`feat(gh-ds): ship Textarea — multi-line text entry` — green locally against
every `.claude/CLAUDE.md §5` Weeks 3–6 DoD clause.

## Measured DoD

| DoD clause                                   | Evidence                                                   |
| -------------------------------------------- | ---------------------------------------------------------- |
| Component in `packages/gh-ds`                | `packages/gh-ds/src/components/Textarea/Textarea.astro`    |
| axe-core zero blocking violations            | 6 dist pages scanned, 0 violations on each                 |
| Consumed from apps/portal                    | Gallery at `/internal/textarea/` — 7 sections              |
| EN + Twi fixtures                            | "Kyerɛw wo nsɛm" with "Di nokware. Gyina wo bɔ so." hint   |
| Label/hint/error composite parity            | Same structure as TextInput — consistent author ergonomics |
| Progressive enhancement                      | Native `<textarea>`, no JavaScript                         |
| Resize vertical by default, disabled on lock | `resize: vertical` / `resize: none` on `:disabled`         |
| `/` weight still < 80 KB gzipped             | **28.0 KB unchanged**                                      |

## Five-gate pipeline

```
pnpm typecheck   → 20/20 ✓  exit 0
pnpm lint        → 20/20 ✓  exit 0
pnpm test        → 21 successful (18 contrast + axe sweep of 6 dist pages)
pnpm build       → 20/20 ✓  exit 0
pnpm format:check → All matched files use Prettier code style ✓
```

## What shipped

- **`packages/gh-ds/src/components/Textarea/Textarea.astro`** — label + hint +
  error + native `<textarea>`. Props cover every native affordance: `name`,
  `label`, `id`, `hint`, `error`, `value`, `placeholder`, `rows` (default 5),
  `required`, `disabled`, `readonly`, `autocomplete`, `spellcheck`,
  `autocapitalize`, `minlength`, `maxlength`. Forwards ARIA automatically
  (`aria-describedby`, `aria-invalid`, `aria-required`).
- **`packages/gh-ds/package.json`** — `@gh/gh-ds/Textarea` exported.
- **`apps/portal/src/pages/internal/textarea.astro`** — gallery at
  `/internal/textarea/` with seven sections: basic, hint + rows=8, required +
  maxlength, error state with prefilled short value, prefilled long bio,
  disabled, Twi fixture.

## Design-system state after PR 5e

- ✅ Button (PR 4)
- ✅ Text input (PR 5a)
- ✅ Form label/hint/error composite (PR 5a)
- ✅ Error summary (PR 5c)
- ✅ Radio (PR 5d)
- ✅ Checkboxes (PR 5d)
- ✅ Textarea (PR 5e — this)
- ⬜ Select
- ⬜ Date input (D/M/Y)
- ⬜ Header (still inline in apps/portal)
- ⬜ Footer (still inline in apps/portal)
- ⬜ Skip-link (still inline in apps/portal)
- ⬜ Back link (Sankofa)

**7 of 13 Tier-1 components shipped.**

## Your next step — commit

```bash
git add -A
git commit -m "feat(gh-ds): ship Textarea — multi-line text entry

- packages/gh-ds/src/components/Textarea/Textarea.astro
- same label/hint/error composite as TextInput; default 5 rows, vertical resize
- resize: none when disabled; ARIA wired automatically
- exports @gh/gh-ds/Textarea via exports map
- apps/portal /internal/textarea/ gallery: 7 sections incl. Twi fixture
- axe 0 violations on 6 built pages; / weight unchanged at 28 KB

Delivers Tier-1 Textarea per .claude/CLAUDE.md §5 Weeks 3–6.
See also: docs/doctrine/pr-5e-handoff.md."
```

## Next PR

Remaining Tier-1 form controls: **Select**, **Date input (D/M/Y)**.

**5f — Select + Date input.** The last two composite fields. Select is a
light-weight wrapper around `<select>` with the same label/hint/error pattern.
Date input is the most involved Tier-1 piece — three narrow TextInputs inside a
fieldset, with grouped error state and per-part hints.

**5g — Header + Footer + Skip-link + Back link** extracted from apps/portal into
`packages/gh-ds`. Unblocks the `design.gov.gh` Storybook deliverable.

Recommendation: **5f (Select + Date input)** completes the Tier-1 form inputs.
Then **5g** moves the layout pieces over and Tier-1 closes.

Say "PR 5f" to proceed.

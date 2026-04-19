# PR 5c — Handoff & verification

`feat(gh-ds): ship ErrorSummary — the top-of-page form-rejection banner` — green
locally against every `.claude/CLAUDE.md §5` Weeks 3–6 DoD clause.

## Measured DoD

| DoD clause                                | Evidence                                                                                                                                 |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Component in `packages/gh-ds` per ADR-003 | `packages/gh-ds/src/components/ErrorSummary/ErrorSummary.astro`                                                                          |
| axe-core zero blocking violations         | 4 dist pages scanned, 0 violations on each                                                                                               |
| Consumed from apps/portal                 | Gallery at `/internal/error-summary/` — 6 scenarios including a realistic submitted-form-rejected flow coupling ErrorSummary + TextInput |
| EN + Twi fixtures                         | "Nsɛm bi ho asɛm wɔ hɔ" with Twi error messages in `lang="tw"` block                                                                     |
| `role="alert"` + `aria-labelledby`        | Banner announces on mount; `tabindex="-1"` set for future JS focus call                                                                  |
| Colour never the only error indicator     | "There is a problem" title + enumerated errors + underlined links                                                                        |
| Progressive enhancement                   | Native `<a href="#fieldId">` jump-links — 0 JS required                                                                                  |
| Renders nothing when `errors=[]`          | Verified in gallery section "No errors — component renders nothing"                                                                      |
| `/` transfer weight still < 80 KB gzipped | **28.0 KB unchanged** (ErrorSummary does not load on `/`)                                                                                |

## Five-gate pipeline

```
pnpm typecheck   → 20/20 ✓  exit 0
pnpm lint        → 20/20 ✓  exit 0
pnpm test        → 21 successful (18 contrast + axe sweep of 4 dist pages)
pnpm build       → 20/20 ✓  exit 0   (4 pages built)
pnpm format:check → All matched files use Prettier code style ✓
```

## What shipped

- **`packages/gh-ds/src/components/ErrorSummary/ErrorSummary.astro`** — banner
  with `role="alert"`, `tabindex="-1"`, `aria-labelledby` on the title, and
  per-error `<a href="#fieldId">` jump-links. Props: `title` (default "There is
  a problem"), `description` (optional paragraph), `errors` (array of
  `{ fieldId, message }`), `id` (default "error-summary"), `class`. Renders
  **nothing** when `errors=[]` so pages can always include the component without
  conditional wrapping logic.
- **`packages/gh-ds/package.json`** — `@gh/gh-ds/ErrorSummary` added to the
  exports map.
- **`apps/portal/src/pages/internal/error-summary.astro`** — gallery at
  `/internal/error-summary/` with six sections: default, multi-error, custom
  title + description, Twi fixture, empty-state, and a realistic submitted-
  form-rejected flow where clicking a banner link jumps to a TextInput in error
  state below. The last section is the one reviewers should poke.

## Form-rejection pattern now complete

Together, TextInput (PR 5a) + ErrorSummary (this PR) + Button (PR 4) deliver the
minimum viable server-validated form:

1. User fills fields, submits.
2. Server returns page with the same form plus `error=` props on failing fields
   and an `<ErrorSummary>` at the top.
3. Screen reader announces "There is a problem" (via `role="alert"`) and the 3
   errors.
4. Sighted user clicks each banner link → focus lands on the field.
5. Corrects, resubmits, repeats until clean.

No JavaScript required on the happy path. JS enhancement in a later PR will (a)
autofocus the banner on page load for more reliable SR announcement and (b)
optionally live-validate before submit — both strictly additive.

## Design-system state after PR 5c

Tier-1 foundation list:

- ✅ Button (PR 4)
- ✅ Text input (PR 5a)
- ✅ Form label/hint/error composite (PR 5a)
- ✅ Error summary (PR 5c — this one)
- ⬜ Textarea
- ⬜ Radio
- ⬜ Checkboxes
- ⬜ Select
- ⬜ Date input (D/M/Y)
- ⬜ Header (still inline in apps/portal)
- ⬜ Footer (still inline in apps/portal)
- ⬜ Skip-link (still inline in apps/portal)
- ⬜ Back link (Sankofa)

**4 of 13 shipped.**

## Your next step — commit

```bash
git add -A
git commit -m "feat(gh-ds): ship ErrorSummary — top-of-page form-rejection banner

- packages/gh-ds/src/components/ErrorSummary/ErrorSummary.astro
- role=alert + tabindex=-1 + aria-labelledby, native <a> jump-links
- renders nothing when errors=[] so pages include unconditionally
- exports @gh/gh-ds/ErrorSummary via package.json exports map
- apps/portal /internal/error-summary/ gallery: 6 scenarios including
  realistic ErrorSummary + TextInput coupled flow
- axe 0 violations on 4 built pages; / weight unchanged at 28 KB

Delivers Tier-1 Error summary per .claude/CLAUDE.md §5 Weeks 3–6.
Combined with PRs 4 and 5a, the minimum viable form-rejection pattern
is now complete. See also: docs/doctrine/pr-5c-handoff.md."
```

## Next PR

Remaining Tier-1 form controls: **Textarea**, **Radio**, **Checkboxes**,
**Select**, **Date input (D/M/Y)**.

**5d — Radio + Checkboxes** is the most impactful single PR. They share
`<fieldset><legend>` patterns, share the same "choice" semantics, and unlock
every yes/no and multi-select service form in Phase 1.

**5e — Textarea** is small (same props as TextInput, different element). Slot in
anywhere.

**5f — Select + Date input** groups the last two composite fields.

Recommendation: **5d (Radio + Checkboxes)** — highest per-PR unlock. Say "PR 5d"
or propose another.

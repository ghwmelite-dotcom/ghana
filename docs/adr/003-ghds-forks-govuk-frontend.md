# ADR-003 — GH-DS forks GOV.UK Frontend

**Status.** Accepted

**Date.** 2026-04-18

**Authors.** Ozzy (OHCS digital lead), lead engineer agent

**Reviewers.** TBD — must include the GFD test panel lead and one designer with
accessibility expertise.

## Context

`.claude/CLAUDE.md §5` Weeks 3–6 mandates a 25-component design system shipped
as Tier 1 (foundation), Tier 2 (content + nav), and Tier 3 (service flow). Every
component must pass axe-core with zero violations, Percy visual regression,
keyboard-only E2E, NVDA + VoiceOver, and EN + Twi fixtures.

§6.1 pins the colour palette to the flag-derived Ghana reds, golds, greens, and
inks. §6.2 pins typography to Noto Sans (body + UI) and Inter (display) — Noto
Sans specifically because it covers `ɛ`, `ɔ`, `ŋ`, `ɖ`, `ƒ`, `ɣ`, `ʋ`, hooked
Hausa, and combining tone marks. §6.3 constrains Adinkra and Kente usage to
dignified, specific, licence-cleared motifs.

We need a design system that:

1. Has been audited by a national disability-rights panel in production and
   survived.
2. Ships HTML-first, progressive-enhancement components — not a React or Vue
   runtime requirement.
3. Has a 6+ year track record of evolving under public-sector constraints (WCAG
   revisions, translation workflows, form discipline).
4. Is MIT or permissively licensed and modifiable.

Building 25 accessible components from scratch in four weeks is not realistic.
The industry has already done the hardest work. We should stand on it.

## Decision

**GH-DS forks GOV.UK Frontend and rebrands it Ghana.** The fork lives in
`packages/gh-ds/`. The upstream component markup, ARIA patterns, progressive-
enhancement JavaScript, Nunjucks macros, and Sass structure are preserved. Only
tokens, brand, type, and any Ghana-specific components (coat-of-arms header,
2-line Twi/EN language switcher, Sankofa back link, mobile money payment form
variants) diverge.

**Tokens are replaced wholesale.** The spec's §6.1 palette and §6.2 typography
override GOV.UK Frontend's `govuk-colour(...)` and `govuk-font-family` values.
Contrast against both `ghana-ink.50` and `ghana-ink.900` backgrounds is verified
at build time; a failing token is a red CI.

**Components are replaced selectively, not wholesale.** Where a GOV.UK Frontend
component works as-is with token overrides (button, text input, textarea, radio,
checkboxes, select, error summary, breadcrumb, pagination, tabs, accordion,
notification banner, step indicator, summary list, confirmation template), we
keep upstream markup and swap tokens.

Ghana-specific divergences are scoped and named:

- **Header** — coat-of-arms, the Black Star, EN / Twi language toggle baked in.
  Not a drop-in upstream replacement; ships as `GhHeader`.
- **Footer** — footer identifier block per `.claude/CLAUDE.md §5` Weeks 11–14:
  About, Privacy, Accessibility, RTI, Anti-Corruption Hotline, parent ministry.
- **Date input** — keeps upstream DD/MM/YYYY UI, adds Ghanaian-English labels.
- **Most-requested band** — new component (§5 Tier 3), analytics-seeded links.
- **Sankofa back link** — new component replacing GOV.UK's back link, with the
  Sankofa motif per the §6.3 allowlist.
- **Nyansapo help** — new component for help/FAQ triggers.
- **Mpatapo feedback** — new component for feedback and complaints flows.

**Upstream synchronisation is explicit, not drive-by.** A quarterly PR titled
`chore(gh-ds): sync with govuk-frontend vX.Y.Z` merges upstream's security
fixes, ARIA corrections, and progressive-enhancement improvements. Any upstream
change that contradicts a §1 non-negotiable or a §6.3 cultural rule is rejected
in the sync PR with a commented-out line and a reference to the rule.

**Licensing is honoured.** GOV.UK Frontend ships under MIT. GH-DS ships under
MIT. Upstream copyright notices are preserved in `packages/gh-ds/NOTICE`. Fonts
(Noto Sans, Inter, JetBrains Mono) are SIL OFL; `packages/gh-ds/fonts/ OFL.txt`
attributes each.

## Alternatives considered

- **Build GH-DS from scratch.** Rejected. A 14-week Phase 1 with four weeks
  allocated for 25 components cannot produce a design system that matches GOV.UK
  Frontend's audit history. We would ship shallower accessibility at higher
  cost.
- **Fork USWDS (US Web Design System).** Respected alternative. Rejected because
  GOV.UK Frontend's progressive-enhancement discipline and HTML-first philosophy
  map more cleanly onto our §1 "every form works without JavaScript" rule.
  USWDS's recent direction has added more JS-required components than we want.
- **Fork Canada.ca's design system.** Respected, and closer culturally to
  Ghana's service patterns than GOV.UK in some ways. Rejected because its
  component library is smaller and its maintenance cadence is slower. GOV.UK
  Frontend's 6+ years of quarterly releases and open backlog are the better base
  to iterate from.
- **Adopt shadcn/ui or Material.** Rejected. Neither is a government design
  system; neither has a public-sector accessibility track record; both assume a
  JavaScript runtime.
- **Hybrid: shadcn for interactive, GOV.UK for forms.** Rejected. Two design
  systems is zero design systems. A single vocabulary across every ministry is a
  service to citizens.

## Consequences

### Positive

- We inherit 25 components with a 6-year audit trail against WCAG, a published
  defect history, and a peer-review discipline we could not match in-house.
- Editorial workflow (Keystatic content → GH-DS components in Astro) stays
  HTML-first. Progressive enhancement is free.
- Upstream's quarterly releases give us a cadence for applying security and
  accessibility fixes without surprise breakage.
- The cultural divergence is scoped and named — Ghana's motifs are additive, not
  layered on top of a UK identity pretending to be Ghanaian.

### Negative / costs accepted

- GOV.UK Frontend's build uses Sass + Nunjucks. We compile these to plain CSS
  and to Astro components in `packages/gh-ds/`; the Sass → CSS pipeline is part
  of our build, which adds a step per component change.
- Upstream API changes (e.g. a renamed macro) create sync-PR churn. Mitigation:
  the quarterly sync PR is a small named task, not a drive-by commit.
- Some citizens recognise GOV.UK's visual language. Mitigation: the §6.1
  palette, §6.3 Adinkra motifs, and Ghanaian voice (`DD Month YYYY`, `GH₵`,
  `+233 XX XXX XXXX`, second-person plain English) make the divergence
  unambiguous at a glance.

### Neutral / follow-up work

- `docs/research/govuk-frontend-audit.md` — document which 25 spec components
  map to which upstream components, which are replaced, which are new. Due
  before Week 3 PR 2 (gh-ds tokens) merges.
- `docs/runbooks/govuk-frontend-sync.md` — quarterly sync procedure.
- Clearance with the National Commission on Culture + Folklore Board for each
  Adinkra symbol used in GH-DS, per §6.3 and the Copyright Act 690. Due before
  any Adinkra-bearing component ships.
- File a public thank-you note to the GOV.UK Design System team at
  `design.gov.gh/acknowledgements` on launch.

## References

- `.claude/CLAUDE.md §5` Weeks 3–6 — 25-component scope.
- `.claude/CLAUDE.md §6.1` — Ghana colour tokens.
- `.claude/CLAUDE.md §6.2` — Noto Sans + Inter typography with multi-language
  glyph coverage.
- `.claude/CLAUDE.md §6.3` — Adinkra / Kente use rules.
- GOV.UK Frontend source —
  [https://github.com/alphagov/govuk-frontend](https://github.com/alphagov/govuk-frontend)
- GOV.UK Design System —
  [https://design-system.service.gov.uk/](https://design-system.service.gov.uk/)
- MIT licence terms for GOV.UK Frontend — preserved in `packages/gh-ds/NOTICE`.
- SIL Open Font Licence for Noto Sans, Inter, JetBrains Mono.

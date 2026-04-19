# v1 content — complete · 2026-04-19

Plan 2 (content bulk-fill) finished. Branch: `feat/v1-foundation`. Tag:
`v1-content-complete`. No remote push.

## What the site is right now

A 79-page static Ghana.gov portal, axe-clean across every page, buildable with
`pnpm build`, deployable to Cloudflare Pages:

- **30 service pages** — the soft-launch target (Live 8, Work 8, Business 8, Visit 6)
- **21 ministry pages** — every Executive-branch ministry with mandate, departments, contact
- **8 news articles** — realistic Jan–Apr 2026 items across Finance, Education, Interior, Food & Agriculture, Communications, Foreign Affairs
- **4 long-form boilerplate pages** — About (mission + MIT/CC-BY), Accessibility (WCAG 2.2 AA statement), Privacy (DPA 2012 aligned), Contact (RTI + Anti-Corruption Hotline)
- **Curated landing pages** — A–Z services index with letter jumps, Diaspora landing with Year of Return framing, populated /ministries/ and /news/
- **5 Twi stubs** — homepage + 4 life-stage landings under `/tw/`, each with "English fallback" notice

## Plan 2 commits

| PR  | Scope                                                   | Commit    |
| --- | ------------------------------------------------------- | --------- |
| P1  | 19 more service files (reaches 30-total target)         | `a67b385` |
| P2  | 21 ministry files + keyServices cross-linking           | `fb8b5c9` (folded in with P3) |
| P3  | 8 news + 4 real boilerplate + rewire of /about etc.     | `fb8b5c9` |
| —   | Schema fix — strip `slug` from news/ministries/pages    | `9a6aeb4` |
| P4  | MinistryDirectoryEntry + /ministries/ index            | bundled in `<see below>` |
| P5  | /services/a-z alphabetical + topic chips                | bundled   |
| P6  | /services/diaspora curated landing                      | bundled   |
| P7  | /news/ index newest-first                               | bundled   |
| P8  | 5 Twi stubs under /tw/                                  | bundled   |

The combined P4–P8 commit is the most recent on the branch.

## Five-gate at tag

- pnpm typecheck — PASS (2/2 packages)
- pnpm lint — PASS (2/2 packages)
- pnpm build — PASS (79 HTML pages + Pagefind index)
- pnpm test — PASS (routes-test 15/15 · axe-check 79/79 pages clean)
- pnpm format:check — PASS

## Known caveats documented elsewhere

- Hero ships with CSS-gradient placeholder — real cultural-close-up photography is a launch-prep task per `apps/portal/src/assets/hero/CREDITS.md`.
- Twi content is stubs only — v1.1 target is full translation.
- Real minister names use `Hon. Minister` / `Hon. Deputy Minister` placeholders — swap when office-holder details are confirmed.
- 10 ministries have empty `keyServices: []` — populate as more services are authored.

## Deferred to plan 3 (launch prep)

- Lighthouse CI sweep against Cloudflare Pages preview.
- External WCAG 2.2 AA audit.
- DNS + custom domain cutover (`gov.gh`).
- Cloudflare Web Analytics wired.
- CSA CII registration (Act 1038).
- DPC controller registration (Act 843).
- Real hero photography sourced.
- Current Minister names confirmed and substituted.

## Running the site locally

```bash
pnpm --filter @gh/portal build
pnpm --filter @gh/portal preview --host --port 4322
# then open http://localhost:4322/
```

## Merging back

```bash
# From main checkout
git merge feat/v1-foundation --no-ff -m "feat: v1 foundation + content (plans 1+2)"
```

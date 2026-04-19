# Archived — Legacy v0 static prototype

This directory holds the pre-monorepo static HTML/CSS/JS prototype of gov.gh as of
2026-04-18, preserved verbatim for content migration reference.

**Do not edit these files.** They are frozen. Content migrates into Keystatic
during Week 7 (OHCS reference implementation) per `docs/doctrine/week-0.md §4`
PR 1 and subsequent roadmap steps in `.claude/CLAUDE.md §5`.

**What was archived here**

- `README.md` — the pre-monorepo README with the "Sovereign Elegance" design note.
- `index.html`, `contact.html`, `offline.html` — static pages.
- `css/`, `js/`, `assets/` — style, script, and asset bundles.
- `business/`, `government/`, `help/`, `services/`, `tourism/` — content page trees.
- `manifest.json`, `sw.js` — PWA shell.

**What was deleted**

- `index_original.html` — dead redesign snapshot, not retained.

**Why this was archived rather than kept as the live site**

See `docs/adr/001-stack.md`, `docs/adr/002-cloudflare-native-doctrine.md`, and
`docs/adr/003-ghds-forks-govuk-frontend.md` for the full architectural pivot.
The short version: the legacy prototype cannot pass the `.claude/CLAUDE.md §1`
non-negotiables on page weight, accessibility enforcement, security headers, or
progressive enhancement. It remains useful only as reference for information
architecture and content copy.

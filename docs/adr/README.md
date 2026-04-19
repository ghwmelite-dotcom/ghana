# Architecture Decision Records

> "Every design call traces to a user-research finding, an analytics number, or
> a cited best-practice peer. No gut calls in PRs." — `.claude/CLAUDE.md §1`

This directory is the canonical record of every architectural decision made on
gov.gh. An ADR captures the context, alternatives considered, decision,
consequences, and the peer precedents or evidence cited — so the next engineer,
auditor, or administration can understand _why_, not just _what_.

## Index

- [ADR-001 — Stack: Astro 5 + Hono + D1 + Cloudflare Pages + Workers](./001-stack.md)
- [ADR-002 — Cloudflare-native doctrine with workerd-Docker DR target](./002-cloudflare-native-doctrine.md)
- [ADR-003 — GH-DS forks GOV.UK Frontend](./003-ghds-forks-govuk-frontend.md)

## When to write an ADR

Write one when the decision:

- Shapes the stack, a protocol, a data model, or a cross-service contract.
- Overturns an earlier ADR.
- Commits the platform to a vendor primitive or open-source dependency that is
  costly to reverse.
- Has a defensible alternative you considered and rejected. (If there's no
  alternative worth naming, it's not architectural.)

If in doubt, write one. ADRs are cheap; lost context is expensive.

## Template

Copy this block into `docs/adr/NNN-kebab-title.md`, replacing `NNN` with the
next number.

```markdown
# ADR-NNN — <decision in one line>

**Status.** Proposed | Accepted | Superseded by ADR-XXX | Deprecated

**Date.** YYYY-MM-DD

**Authors.** <names>

**Reviewers.** <names, one must be outside the authoring team>

## Context

What forces shape this decision? Cite the doctrine principle
(`.claude/CLAUDE.md §X`), the research finding, the analytics number, or the
peer precedent (GOV.UK, Canada.ca, Singpass, Irembo, Estonia, Denmark). No gut
calls.

## Decision

One paragraph. Active voice. "We use X because Y."

## Alternatives considered

- **Option A** — summary. Rejected because …
- **Option B** — summary. Rejected because …

## Consequences

### Positive

- …

### Negative / costs accepted

- …

### Neutral / follow-up work

- …

## References

- `.claude/CLAUDE.md §X` — the non-negotiable or doctrine this serves.
- External: <link> — peer precedent or standards body.
```

## Process rules

- ADRs are never edited after acceptance, only **superseded** by a new ADR that
  explicitly references them.
- Numbers are sequential, never reused.
- Filename format: `NNN-kebab-title.md`. Three-digit zero-padded.
- Every PR that would contradict an accepted ADR must update the ADR's status to
  "Superseded by ADR-XXX" in the same commit as the new ADR lands.

# ADR-002 — Cloudflare-native doctrine with workerd-Docker DR target

**Status.** Accepted

**Date.** 2026-04-18

**Authors.** Ozzy (OHCS digital lead), lead engineer agent

**Reviewers.** TBD — must include one external reviewer with public-sector
architecture experience.

## Context

`.claude/CLAUDE.md §2` commits the platform to Cloudflare primitives end-to-end
for Phase 1: Pages, Workers, Durable Objects, D1, KV, R2, Queues, Workers AI,
Vectorize, Stream, Images, Email Workers, Turnstile, Access, WAF/Bot Management,
Web Analytics, Workers Analytics Engine, Observability + Logpush, DNS, Secrets.

Two forces pull against that commitment:

1. **Regulatory.** Act 843 (DPA 2012) permits processing outside Ghana under
   §30(4) with safeguards; Act 1038 (Cybersecurity 2020) designates government
   systems as CII requiring CSA registration and licensed providers; a June 2024
   Ministerial directive toward local hosting is policy, not statute, but
   signals drift. A future administration could tighten this to hard residency.
2. **Vendor concentration.** Committing to one vendor's primitives is an
   operational and negotiation risk. The Auditor-General and civil society will
   reasonably ask: "What is your exit plan?"

The spec's §2.3 answers force (2): **every Worker in this repo must run under
workerd in Docker unchanged.** D1 → SQLite file or Postgres. R2 → MinIO. KV →
Redis. Durable Objects → workerd's open-source DO support. Queues → Redis
Streams. Vectorize → Qdrant. A nightly CI `workerd-docker-build` job keeps this
path continuously green.

The spec's §2.9 answers force (1): Cloudflare's Accra PoP terminates TLS and
runs edge compute in-country; R2 Jurisdictions (EU) pin at-rest data to
GDPR-adequate DCs; application-layer AES-256-GCM on PII columns means Cloudflare
cannot decrypt without keys held in Workers Secrets by the Government of Ghana;
a formal Act 843 §30(4) processor agreement is documented and published; CSA CII
registration documents the posture under Act 1038.

## Decision

**Cloudflare is the primary target for every capability in
`.claude/CLAUDE.md §2.1`.** No feature is built against an external SaaS for any
capability for which a Cloudflare primitive exists. The only `fetch()` calls to
non-Cloudflare hosts are to authoritative Government of Ghana APIs (NIA IVSP,
GRA, SSNIT, DVLA, NHIS, Hubtel, theTeller, Flutterwave, GhIPSS) or to published
standards endpoints (OIDC discovery for federated clients).

**workerd-in-Docker is a continuously-exercised DR target, not an aspiration.**
`infra/workerd-docker/` contains a `Dockerfile` and `docker-compose.yml` that
run every service in this repo against open-source substitutes for the CF
bindings. A GitHub Actions job named `workerd-docker-build` runs nightly and on
every PR that touches `services/*` or `infra/workerd-docker/**`. A red build
blocks merge. A monthly DR drill switches a staging subdomain to the Docker
target for 60 minutes and measures delta.

**CI enforces portability boundaries.** An ESLint rule and a CI grep forbid
`import ... from 'cloudflare:*'` outside `services/` and outside the binding
declaration in each service's `src/bindings.ts`. Business logic imports only
binding _interfaces_, never Cloudflare types directly.

**Residency posture per `.claude/CLAUDE.md §2.9` is adopted verbatim.** R2
pinned to EU jurisdictions. D1 writer region documented. Application-layer
AES-256-GCM on every PII column identified in `docs/doctrine/pii-schedule.md`
(to be written in Week 3). Keys held in Workers Secrets, rotated quarterly via
Secrets Store, public JWKS served from `/oidc/jwks` with 90-day `kid` overlap.

**Processor agreement and CSA registration are legal blockers.** Code can ship
to staging without them. Code cannot ship to production until both are in place.
The `deploy-production` GitHub Action checks for a file
`docs/compliance/cloudflare-processor-agreement.signed` and the presence of
`CSA_CII_REGISTRATION_ID` in production secrets; absent either, the job fails.

## Alternatives considered

- **Multi-cloud from day one (AWS + CF, or GCP + CF).** Rejected for Phase 1.
  Doubles the operational surface, requires two sets of bindings, two IAM
  models, two cost profiles. The stated insurance — "vendor risk" — is already
  addressed by workerd-Docker DR at much lower carrying cost.
- **Hosted on the NITA National Data Centre (NDC) primary.** Rejected for Phase
  1 on two counts: (1) edge latency to Tamale and the north-east is materially
  worse than Cloudflare's Accra PoP for terminating TLS and caching; (2) DDoS
  and bot defence at NDC's capacity is unmatched against the Cloudflare network.
  NDC remains the DR target via workerd-Docker and a warm standby.
- **Leave workerd-Docker unexercised.** Rejected. An unexercised DR target is an
  unbuilt DR target. Nightly CI plus monthly drill keeps the claim honest to the
  Auditor-General.
- **Skip application-layer encryption; rely on R2/D1 at-rest encryption.**
  Rejected. At-rest encryption protects against disk theft; it does not protect
  against operator access, compromised admin credentials, or compelled
  disclosure. Act 843 §§20–24's protection principles are better served by keys
  held by the Government of Ghana that Cloudflare cannot access.

## Consequences

### Positive

- Single runtime (workerd), single binding surface, single secret store, single
  observability pipeline. Junior engineers learn the platform once.
- The workerd-Docker escape hatch is defensible to the Auditor-General,
  defensible to civil society, defensible to a future administration.
- R2 zero-egress cost model makes the annual budget for document storage
  predictable; citizens' submitted PDFs do not generate egress bills when
  ministries review them.
- Application-layer PII encryption turns operator-access breach scenarios into
  cryptographic problems, not policy ones.

### Negative / costs accepted

- A nightly workerd-Docker build is minutes-long CI overhead on every PR that
  touches services. Accepted — it is the price of the portability claim.
- We forgo any Cloudflare-adjacent feature that has no open-source workerd
  substitute. Concretely: if a CF-only AI model has no Ollama equivalent, the
  feature is not built until one exists or we accept that specific feature's
  loss under DR. Each such trade-off is its own ADR.
- Key rotation ceremonies (quarterly) are engineering + legal overhead. Runbook
  at `docs/runbooks/key-rotation.md` (to be written Week 3).

### Neutral / follow-up work

- `docs/doctrine/pii-schedule.md` — canonical list of columns that must be
  application-layer encrypted. Due before any D1 schema that touches citizen
  data ships.
- `docs/runbooks/workerd-docker-dr-drill.md` — monthly DR drill procedure.
- `infra/terraform/` — OpenTofu declarations for every long-lived CF resource so
  rollback is `tofu apply` against a prior state.
- Publish `gov.gh/legal/data-processing` page citing this ADR and the processor
  agreement once signed.

## References

- `.claude/CLAUDE.md §2` — Cloudflare-native architecture.
- `.claude/CLAUDE.md §2.3` — portability boundaries enforced in CI.
- `.claude/CLAUDE.md §2.9` — data residency and Act 843 reconciliation posture.
- Act 843 (Data Protection Act, 2012) §§20–24, §30(4).
- Act 1038 (Cybersecurity Act, 2020) §31(e) — Cybersecurity Fund levy.
- Ministerial directive, June 2024, on local hosting (policy, not statute).
- Cloudflare processor agreement template under DPA §30(4).
- workerd runtime —
  [https://github.com/cloudflare/workerd](https://github.com/cloudflare/workerd)

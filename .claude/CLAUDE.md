# gov.gh — Flagship National Government Portal of Ghana

> **Repo purpose.** Build the world's best national government portal for the
> Republic of Ghana, under the Office of the Head of Civil Service (OHCS)
> digital leadership mandate. Citizen-first services, trust-and-transparency
> hub, unified identity, and service aggregator — in one platform.
>
> **North star.** Beat `gov.rw` on every dimension it does well, and fix every
> dimension it does poorly. Set the African benchmark that other governments are
> forced to study.
>
> **Infrastructure doctrine.** This platform is built **end-to-end on
> Cloudflare**. Every capability — compute, storage, identity, CMS, payments
> edge, search, analytics, observability, security, AI, video, email — runs on a
> Cloudflare primitive. No external SaaS dependencies for core services. This is
> a deliberate choice, not a constraint to work around.

---

## 1. Mission & non-negotiables

You are the lead engineer on a public-interest national platform. Treat every
decision as if it will be audited by the Auditor-General, scrutinised by civil
society, inherited by the next administration, and used tomorrow morning by a
trader in Tamale on a Tecno Spark over 3G. These are your hard constraints:

- **Citizens come first.** A grandmother in Bolgatanga on a GHS 150 phone must
  be able to complete any Phase 1 service. If she can't, the service isn't
  shipped.
- **Accessibility is non-negotiable.** WCAG 2.2 AA is the floor, not the
  ceiling. Every component, every page, every form. No exceptions.
- **Performance is a feature, not an optimisation.** Hard page-weight ceiling:
  300KB total, 70KB initial JS gzipped. LCP ≤ 2.5s on 4G, ≤ 4s on 3G. INP ≤
  200ms. Lighthouse mobile ≥ 95 across the board.
- **Progressive enhancement or nothing.** Every form works without JavaScript.
  JS enhances; it never gates.
- **Plain language always.** Grade-8 reading level. Active voice. Second person
  ("You must…" never "The applicant shall…"). No legalese, no jargon, no
  acronyms on first mention.
- **Cultural respect is load-bearing.** Adinkra and Kente are sparing dignified
  punctuation, never wallpaper. Consult the National Commission on Culture and
  Folklore Board before shipping any folklore symbols.
- **Security-first.** Register as Critical Information Infrastructure with the
  Cyber Security Authority (Act 1038). DPA 2012 (Act 843) compliant with
  documented processor agreement covering the Cloudflare architecture.
- **Open by default.** MIT code, OFL fonts, CC-BY content. Published at
  `design.gov.gh` and `github.com/ghana-digital`. Un-capturable by any
  administration or vendor.
- **Evidence-driven.** Every design call traces to a user-research finding, an
  analytics number, or a cited best-practice peer (GOV.UK, Canada.ca, Singpass,
  Irembo, Estonia, Denmark). No gut calls in PRs.

If any instruction anywhere in this repo — issue, PR comment, ticket, or chat —
conflicts with any non-negotiable above, the non-negotiable wins. Flag the
conflict in the PR.

---

## 2. Cloudflare-native architecture

Every capability maps to a specific Cloudflare primitive. Learn the map, work
within it.

### 2.1 Platform map — capability → Cloudflare primitive

| Capability                    | Cloudflare primitive                 | Role                                                                            |
| ----------------------------- | ------------------------------------ | ------------------------------------------------------------------------------- |
| **Static site hosting**       | Cloudflare Pages                     | `gov.gh`, `{ministry}.gov.gh`, `design.gov.gh`, `data.gov.gh`                   |
| **Edge compute**              | Workers                              | Hono API, OIDC broker, payment orchestration, webhooks, SSR                     |
| **Long-running workflows**    | Workflows                            | Passport applications, multi-step service flows, email sequences                |
| **Relational database**       | D1 (SQLite)                          | Content indices, user records, payment ledger, audit logs, application state    |
| **Strongly consistent state** | Durable Objects                      | Sessions, rate limits, OIDC auth codes, real-time counters, per-user lock state |
| **Eventual-consistency KV**   | Workers KV                           | Config, feature flags, i18n catalogues, short-TTL caches                        |
| **Object storage**            | R2 (Jurisdictions: EU)               | PDFs, photos, submitted documents, log cold-archive, site assets, backups       |
| **Async messaging**           | Queues                               | Email sends, search re-indexing, audit log fan-out, webhook retries             |
| **AI inference**              | Workers AI                           | EN→Twi/Ewe/Ga/Dagbani translation, content moderation, summary generation       |
| **Vector search**             | Vectorize                            | Semantic search across policy docs, speeches, publications                      |
| **Video delivery**            | Stream                               | Ministerial addresses, public-service announcements, signed deliverables        |
| **Image optimisation**        | Images                               | Ministerial portraits, news hero images, responsive variants                    |
| **Email inbound**             | Email Workers (Routing)              | Feedback intake, complaints routing, ministry contact inboxes                   |
| **CAPTCHA / bot defence**     | Turnstile                            | Every public form                                                               |
| **Staff admin access**        | Access (Zero Trust)                  | Payload/Keystatic admin panels, observability dashboards, ops tooling           |
| **WAF, DDoS, bot mgmt**       | WAF + Bot Management + Shield        | Every hostname, managed rulesets tuned for gov workloads                        |
| **Web analytics**             | Web Analytics                        | Privacy-respecting traffic, no consent banner needed                            |
| **Custom analytics**          | Workers Analytics Engine             | KPI dashboards (applications processed, completion rate, service SLAs)          |
| **Logs & tracing**            | Workers Observability + Logpush      | Live ops + cold archive to R2 for Act 1038 audit retention                      |
| **Third-party tag mgmt**      | Zaraz                                | Only if unavoidable — prefer no third-party tags on citizen pages               |
| **DNS & certificates**        | Cloudflare DNS + Universal SSL / ACM | All `.gov.gh` zones under NITA delegation                                       |
| **Secret management**         | Workers Secrets + Secrets Store      | Merchant keys, signing keys, IVSP credentials                                   |

### 2.2 Architectural patterns

**Edge-first, SQLite-everywhere, zero-egress.** Every request resolves at
Cloudflare's Accra PoP when possible. Every database is SQLite (D1 or Durable
Object storage) sharded by domain. Every blob sits in R2 — no S3, no MinIO, no
external object store, no egress fees.

**Workers as the only runtime.** Everything compiles to the Workers runtime
(workerd). Pages Functions, Workers, Durable Objects, Queue consumers — same
runtime, same code conventions, same TypeScript.

**Durable Objects for state; D1 for records.** Anywhere we need strong
consistency (authentication codes, sessions, rate limits, per-user counters,
in-flight payment state) → Durable Object. Anywhere we need relational queries
(citizens, applications, transactions, audit) → D1.

**Application-layer crypto for PII.** Sensitive columns (Ghana Card number, DOB,
address, biometric references) are encrypted with AES-256-GCM at the application
layer using keys held in Workers Secrets (rotated quarterly via Secrets Store).
D1 stores only ciphertext for those columns. This is orthogonal to R2's at-rest
encryption; it protects against operator access and satisfies Act 843 §§20-24
principles.

**Portability via workerd-Docker.** If future regulation tightens beyond what
Cloudflare's Jurisdictions and Accra PoP satisfy, every Worker in this repo runs
under **workerd in Docker** unchanged. D1 → SQLite file or Postgres via Drizzle
driver swap. R2 → MinIO (same S3 API). KV → Redis. Durable Objects → workerd's
DO support (open source). The nightly CI `workerd-docker-build` job keeps this
path continuously green.

### 2.3 Portability boundaries enforced in CI

```ts
// services/api/src/bindings.ts
export interface Env {
  DB: D1Database; // swap target: SQLite file or Postgres under workerd-Docker
  SESSIONS: DurableObjectNamespace;
  CACHE: KVNamespace; // swap target: Redis under workerd-Docker
  DOCS: R2Bucket; // swap target: MinIO under workerd-Docker
  APPLICATIONS: Queue; // swap target: Redis Streams under workerd-Docker
  AI: Ai; // swap target: local Ollama optional
  VECTORS: VectorizeIndex; // swap target: Qdrant under workerd-Docker
  CAPTCHA_SECRET: string;
  IVSP_MERCHANT_KEY: string;
  JWT_SIGNING_KEY: string; // Ed25519 private key
}
```

CI forbids importing `cloudflare:*` outside `services/`. Type-check + Wrangler
build + workerd-Docker build all gate every PR.

### 2.4 GhanaConnect — a Workers-native OIDC broker

Purpose-built identity provider. Lives in `services/identity/`.

- **OIDC server endpoints** in Hono: `/oidc/.well-known/openid-configuration`,
  `/oidc/authorize`, `/oidc/token`, `/oidc/userinfo`, `/oidc/jwks`,
  `/oidc/end-session`.
- **Authorization codes** live in a Durable Object keyed by `client_id:code`,
  TTL 60 seconds, single-use.
- **Sessions** live in a Durable Object keyed by `user_id`, with SameSite=Lax,
  HttpOnly, Secure cookies; short idle TTL (15 min) and long absolute TTL (8
  hrs).
- **Token signing:** Ed25519 keypair, private key in Workers Secrets, public
  JWKS served from `/oidc/jwks`. Quarterly rotation via `kid` header, old keys
  retained 90 days.
- **User store:** D1 `citizens` table, PII columns encrypted.
- **Primary IdP — Ghana Card via NIA IVSP:** citizen enters Ghana Card PIN on a
  GhanaConnect form. Worker calls
  `fetch('https://verifyid.nia.gov.gh/persus/verify', ...)` with merchant key
  from Secrets. Step-up with biometric (NIA app callback when live; SMS-OTP
  fallback via Hubtel).
- **Secondary IdPs:** MTN/Telecel/AirtelTigo MSISDN KYC, bank logins (GCB,
  Ecobank, Absa, Fidelity, Stanbic), GhanaPay. Each is a Worker sub-route doing
  the partner's verification protocol, issuing GhanaConnect sessions on success.
- **Start-without-account:** email/phone OTP for anonymous applications —
  tracked via ARN (Application Reference Number).
- **Business login** via TIN tied to same citizen account.
- **GhanaConnect is itself an OIDC provider** — private-sector RPs (banks,
  telcos, universities) register as clients and receive
  `client_id`/`client_secret`. India Stack network effect.

### 2.5 MyInfoGH — consent-driven data reuse

`services/myinfo-gateway/` is a Worker that fans out to base-register REST APIs.

- Citizen authenticates via GhanaConnect, consents to specific attribute scopes
  (`ghana-card.basic`, `gra.tin`, `ssnit.status`, `dvla.licence`, `nhis.card`).
- Worker validates the consent token, fetches each attribute from its
  authoritative source (NIA IVSP, GRA, SSNIT, DVLA, NHIS — all via outbound
  `fetch()`), caches short-TTL responses in KV keyed by consent-hash, returns a
  signed payload to the relying party.
- Every consent grant, every fetch, every release is written to a D1
  `consent_audit` table and mirrored to R2 via Logpush for the Act 1038 7-year
  audit window.
- Phase 2 MVP: direct fetch to agency APIs. Phase 4 target: migrate to an
  X-Road-equivalent bus if/when agencies standardise — citizen-facing contract
  stays identical.

### 2.6 CMS architecture

**Keystatic git-backed** is the source of truth for content. This repo's
`content/` directory is its filesystem; every edit is a commit, audit-perfect.

Ministry editors don't touch git. The solution is a **Workers + D1 collaboration
layer** sitting between editors and git:

- `services/cms-admin/` hosts a Workers-based admin UI (React island in Pages,
  behind Cloudflare Access).
- Editors draft in the UI → writes land in D1 `drafts` table.
- On publish, a Worker commits the markdown/JSON to the git repo via the GitHub
  API and triggers a Pages rebuild.
- i18n workflows use Workers AI for EN→Twi/Ewe/Ga/Dagbani first-pass translation
  with mandatory human review before publish.
- RBAC per ministry via Cloudflare Access groups mapped to workspaces in D1.

Payload's editor UX, Cloudflare-only infrastructure, git's auditability.

### 2.7 Payment abstraction

```ts
export interface PaymentGateway {
  initiate(req: PaymentRequest): Promise<PaymentSession>;
  verify(ref: string): Promise<PaymentStatus>;
  webhook(body: unknown, headers: Headers): Promise<WebhookEvent>;
}
```

- **Primary:** Hubtel (existing Ghana.GOV incumbent, deepest MoMo/USSD/SMS).
  Outbound `fetch()` from Workers.
- **Fallback:** theTeller/ExpressPay (gh-link cards, redundancy).
- **Diaspora:** Flutterwave (FX).
- **Settlement:** all rails land in the **Treasury Single Account (TSA)** at
  Bank of Ghana via GhIPSS. Revenue never leaves the country.
- **Channels:** MoMo Push (MTN/Telecel/AirtelTigo), unified USSD shortcode
  `*711*ARN#`, inline card form, GhQR for in-person.
- **Webhooks** land on Workers `/webhooks/*` routes, are signature-verified,
  write to a Durable Object for idempotency, enqueue settlement reconciliation
  to Queues.
- **Fees absorbed by government** — never passed to citizens.

### 2.8 Search architecture

Single `services/search/` Worker, two indices, one API.

- **Keyword:** D1 FTS5 virtual tables per content type, updated via Queues
  consumer on content changes.
- **Semantic:** Vectorize indices with Workers AI embeddings
  (`@cf/baai/bge-large-en-v1.5`), useful for policy-document and speech
  discovery.
- **Multilingual:** separate FTS5 tables per language; query dispatcher routes
  by UI locale; Workers AI translates the query when cross-lingual search is
  requested.
- **Federated:** one index scope per ministry; global search scope unions all,
  per-ministry scopes filter. Same Worker, same client.

### 2.9 Data residency & Act 843 reconciliation

**Act 843 (DPA 2012) does not mandate hard residency;** §30(4) permits
processing outside Ghana with appropriate safeguards. **Act 1038
(Cybersecurity 2020)** designates government systems as CII requiring CSA
registration, licensed providers only, incident reporting, and the Cybersecurity
Fund levy on paid e-services. The **June 2024 Ministerial directive** toward
local hosting is policy, directional, not yet statute.

**Our posture:**

1. **Cloudflare's Accra PoP** handles terminating TLS, edge compute, caching,
   WAF, DDoS — network edge is in-country.
2. **R2 Jurisdictions (EU)** pins at-rest data to European DCs equivalent to
   GDPR-adequate processing under Act 843 §30(4).
3. **D1 writer region** is configurable; we pin to the nearest available region
   and document round-trip latency as acceptable for non-interactive writes.
4. **Application-layer encryption** (AES-256-GCM) on PII columns means
   data-at-rest is ciphertext; Cloudflare cannot decrypt it without a key held
   by the Government of Ghana in Workers Secrets.
5. **Formal processor agreement** with Cloudflare under Act 843 §30(4),
   published on `gov.gh/legal/data-processing`.
6. **CSA registration** as CII under Act 1038, documenting the edge +
   Jurisdictions architecture, licensed-provider compliance, incident
   notification paths.
7. **Workerd-Docker DR target** at NITA National Data Centre — not in
   production, exercised monthly so the migration path is warm if regulation
   tightens.
8. **Cybersecurity Fund levy** remitted on every paid service per §31(e).

This posture is defensible, auditable, and already used by `ghana.gov.gh`,
`gra.gov.gh`, `mfa.gov.gh`, and other live `.gov.gh` hostnames today.

---

## 3. Monorepo layout

```
gov-gh/
├── apps/
│   ├── portal/              # Astro 5 → Cloudflare Pages — gov.gh root
│   ├── ministries/          # Astro 5 → Pages — {ministry}.gov.gh
│   ├── dashboard/           # Astro + React islands → Pages — my.gov.gh
│   ├── data-portal/         # Astro + React → Pages — data.gov.gh
│   └── design-system/       # Astro + Storybook → Pages — design.gov.gh
├── services/
│   ├── api/                 # Hono Worker — single edge API, routes by path
│   ├── identity/            # Hono Worker — GhanaConnect OIDC broker + DOs
│   ├── myinfo-gateway/      # Hono Worker — consent-driven data reuse
│   ├── payments/            # Hono Worker — Hubtel/theTeller/Flutterwave + TSA
│   ├── cms-admin/           # Hono Worker — multi-ministry editorial admin
│   ├── search/              # Hono Worker — D1 FTS5 + Vectorize
│   ├── webhooks/            # Hono Worker — inbound webhook receivers
│   └── workflows/           # Cloudflare Workflows — long-running services
├── packages/
│   ├── gh-ds/               # Ghana Design System — tokens, 25 components
│   ├── schemas/             # Drizzle schemas — D1 targets + Postgres twins (DR)
│   ├── i18n/                # ICU MessageFormat catalogues
│   ├── identity-client/     # GhanaConnect OIDC client SDK
│   ├── payment-client/      # PaymentGateway SDK
│   ├── myinfo-client/       # MyInfoGH consent UX components
│   └── telemetry/           # Workers Analytics Engine + OpenTelemetry helpers
├── infra/
│   ├── terraform/           # OpenTofu for all Cloudflare resources
│   ├── wrangler/            # wrangler.toml fragments per service
│   └── workerd-docker/      # DR target; nightly CI build
├── content/                 # Keystatic-authored root content
├── docs/
│   ├── adr/                 # Architecture Decision Records
│   ├── doctrine/            # Non-negotiables, perf budget, a11y checklist, residency posture
│   ├── research/            # Research artefacts, user-testing transcripts
│   └── runbooks/            # On-call, incident, security, DPC breach-notification
└── .claude/
    ├── CLAUDE.md            # This file
    └── skills/              # Project-specific SKILL.md files
```

---

## 4. Ghana-specific context — facts that shape every decision

- **Ghana Card.** 18.95M enrolled, 17.75M issued, instant issuance live, 292
  centres. Ghana Card PIN is the legal TIN at GRA. NIA IVSP at
  `verifyid.nia.gov.gh/persus` is consumed by ~95 institutions already — REST
  API, not OIDC. **L.I. 2111 (2012)** mandates the card for passport, bank, SIM,
  voter registration.
- **Payments.** 74.1M MoMo accounts, GHS 270B transacted monthly, 59.7% adult
  active. GhIPSS runs wallet interoperability, GhanaPay (`*707#`), instant-pay,
  GhQR. MTN 73% market share.
- **Connectivity.** 26.3M internet users (74.6% penetration). Fixed broadband
  under 0.7%. Median fixed speed 49.5 Mbps. Average data cost GHS 6.30/GB. 5G
  launched March 2026 in Accra/Kumasi/Tamale.
- **Devices.** Tecno, Infinix, other Transsion Androids with 2–4GB RAM dominate.
- **Law.** DPA 2012 (Act 843), Cybersecurity Act 2020 (Act 1038), Electronic
  Transactions Act 2008 (Act 772), NITA Act 2008 (Act 771), Persons with
  Disability Act 2006 (Act 715, under revision).
- **Languages & literacy.** English official. ~46% adult bi-literacy in
  English + a Ghanaian language. 30.2% non-literate in any language. Literacy:
  87.9% Greater Accra → 32.8% Savannah. Launch English + Akan (Twi/Fante). USSD
  and IVR in Twi/Ewe/Dagbani/Ga from Phase 1.
- **Cloudflare presence.** Accra PoP since March 2022. Many `.gov.gh` domains
  already on CF.

---

## 5. Phased roadmap — Phase 1 scope (14 weeks)

Execute Phase 1 first. Do not build Phase 2+ unless explicitly instructed.

### Weeks 0–2: Foundation

- Monorepo per §3.
- GH-DS v1 tokens shipped (colour, type, spacing).
- Astro → Pages; Hono → Workers wired. Staging at `staging.gov.gh`.
- D1, KV, R2, Durable Objects, Queues, Turnstile, Access all provisioned via
  OpenTofu.
- CI green: typecheck, lint, test, Wrangler build, workerd-Docker build,
  Lighthouse budget, axe-core a11y.
- ADR-001 (the stack). ADR-002 (Cloudflare-native doctrine). ADR-003 (GH-DS
  forks GOV.UK Frontend).

### Weeks 3–6: GH-DS v1 (the 25 components)

Fork GOV.UK Frontend, rebrand Ghana, publish at `design.gov.gh` (Pages).

**Tier 1 — foundation (12):** Button, Text input, Textarea, Radio, Checkboxes,
Select, Date input (D/M/Y), Error summary, Form label/hint/error composite,
Header (coat-of-arms + language switcher), Footer, Skip-link, Back link
(Sankofa).

**Tier 2 — content & nav (7):** Breadcrumb, Pagination, Tabs, Accordion,
Responsive table, Card, Notification banner.

**Tier 3 — service flow (6):** Step indicator, Summary list /
check-your-answers, Confirmation template, Search, Cookie banner, Most-requested
band.

Every component: Storybook entry, axe-zero-violations, Percy visual snapshot,
keyboard-only E2E, NVDA + VoiceOver pass, EN + Twi fixtures.

### Weeks 7–10: OHCS reference implementation

Rebuild OHCS on the stack — prove the pattern end-to-end.

- Pages: Home, About, Directorates (RTDD/RSIMD/CMD/F&A/PBMED), Units
  (IAU/Estate/CSC/RCU), News, Publications, Services, Contact.
- Content in Keystatic, EN + Twi.
- Site-scoped D1 FTS5 search.
- "Most requested" band with 8 analytics-seeded links.
- Feedback widget → Queue → D1 → Access-gated admin view.
- Cloudflare Web Analytics on every page.

### Weeks 11–14: gov.gh root + launch

- Astro portal at `gov.gh`: homepage, Government mega-menu
  (Exec/Legis/Judic/Indep/Publications), Ministries directory (21 with
  short-code phone, email, minister, deputy), News, "I am looking for…" hero
  with 6 outbound links.
- USWDS-style trust banner. Footer identifier (About / Privacy / Accessibility /
  RTI / Anti-Corruption Hotline / parent ministry).
- Published accessibility statement + privacy notice (DPA 2012 aligned) +
  data-processing notice (CF processor agreement).
- CSA CII registration initiated. DPC controller registration initiated.
- Load test: 10k concurrent users, P95 ≤ 1s, zero 5xx.
- External a11y audit (GFD test panel + automated).
- Public launch.

### Phase 1 KPIs

- Lighthouse Mobile: Performance ≥ 95, Accessibility 100, Best Practices ≥ 95,
  SEO 100.
- WCAG 2.2 AA automated ≥ 95%, manual audit no blocker findings.
- LCP on 3G (WebPageTest Accra origin) ≤ 4s.
- Total page transfer ≤ 300KB gzipped.
- Uptime ≥ 99.9% (measured by Cloudflare Radar + external poll).
- GH-DS adopted by OHCS + 5 pilot ministries.
- `design.gov.gh` live and public.

---

## 6. Design system — GH-DS spec summary

### 6.1 Colour tokens

```ts
export const colour = {
  'ghana-red': {
    50: '#FDECEE',
    500: '#CE1126',
    600: '#A80E1F',
    700: '#820B18',
    900: '#36050A',
  },
  'ghana-gold': {
    50: '#FFFBE6',
    400: '#FCD116',
    500: '#E0B912',
    600: '#B8960C',
    700: '#8A7008',
  },
  'ghana-green': {
    50: '#E6F4EE',
    500: '#006B3F',
    600: '#005A35',
    700: '#004527',
    900: '#001A0E',
  },
  'ghana-ink': {
    50: '#F7F7F8',
    500: '#5B5F68',
    600: '#3E424A',
    700: '#2B2E34',
    900: '#000000',
  },
};

export const semantic = {
  'action-primary': 'var(--ghana-green-600)',
  'action-danger': 'var(--ghana-red-700)',
  link: 'var(--ghana-green-700)',
  'focus-ring': 'var(--ghana-gold-400)',
  success: 'var(--ghana-green-600)',
  'warning-bg': 'var(--ghana-gold-50)',
  error: 'var(--ghana-red-700)',
  info: '#1D70B8',
};
```

**Rule:** never encode meaning with red vs green alone. Always pair with icon +
text label. Test every semantic state against Coblis/Stark before merge.

### 6.2 Typography

- **Body & UI:** Noto Sans 400/500/700 — covers `ɛ`, `ɔ`, `ŋ`, `ɖ`, `ƒ`, `ɣ`,
  `ʋ`, hooked Hausa, combining tone marks.
- **Display:** Inter 600/700.
- **Mono:** JetBrains Mono.
- All SIL OFL, self-hosted WOFF2, `font-display: swap`, subset aggressively.
- **Scale (rem, 16px root):**
  `12 / 14 / 16 / 18 / 20 / 24 / 32 / 40 / 48 / 64 px`.
- **Line-height:** `1.2` display, `1.35` headings, `1.5` body.

### 6.3 Adinkra + Kente (tasteful, not kitschy)

100-cedi note energy (Dwennimmen corner motif) — not tourist t-shirt.

**Allowed mapping:** Sankofa → back/history; Nyansapo → help/FAQ; Dwennimmen →
security/auth; Nkyinkyim → loading/progress; Mpatapo → feedback/complaints;
Fihankra → privacy; Akoma → accessibility; Funtunfunefu-Denkyemfunefu →
inclusion.

**Absolute rules:**

- **Never Gye Nyame as hero brandmark** — Ghana is constitutionally secular and
  religiously plural.
- **Never tile Adinkra as wallpaper.** One symbol per page max. No stretch /
  skew / recolour / 3D.
- **Kente:** thin horizontal brand-rule strip (8–12px flag colours) only, or
  muted low-opacity on empty states and success. Never behind body text. **Never
  on bereavement** — funerals use adinkra on russet, never colourful Kente.
- Clearance from National Commission on Culture + Folklore Board (Copyright
  Act 690) before ship.

### 6.4 Tone

Plain Ghanaian English, active voice, ≤20-word sentences, Grade-8 reading,
second person, gender-neutral. Dates `DD Month YYYY`. Currency `GH₵` prefix.
Phone `+233 XX XXX XXXX`. No Pidgin in transactional services.

---

## 7. Skills & agent operating procedure

Invoke existing skills proactively:

- **Planning:** `brainstorming`, `subagent-driven-development`.
- **Implementation:** `tdd`, `systematic-debugging`.
- **Parallelism:** `git-worktrees` + `parallel-agents` — especially for GH-DS
  components.
- **Stack-specific:** `cloudflare-stack`, `react-best-practices`.

**Before any task:** read relevant ADRs, check doctrine, search research
findings, spawn a plan if ≥2 hours of work, write failing tests first for
anything touching payments, identity, or PII.

**Commit discipline:** Conventional Commits scoped by package/app. Every PR
links to an issue; every issue links to a KPI, doctrine principle, or research
finding. No merge on failing Lighthouse/a11y/workerd-Docker build. Ever.

**Definition of Done (every PR):**

- [ ] Typecheck, lint, unit tests green.
- [ ] axe-core zero violations + manual NVDA/VoiceOver pass for visual surfaces.
- [ ] Lighthouse budget green on preview URL.
- [ ] Works without JavaScript (demonstrate in PR description).
- [ ] EN + Twi fixtures present.
- [ ] workerd-Docker build green (DR portability proven).
- [ ] Wrangler deploy dry-run succeeds.
- [ ] ADR written if architectural.
- [ ] Accessibility statement / privacy notice updated if surface changed.

---

## 8. Performance budget (CI-enforced)

```yaml
# .lighthouserc.yml
assertions:
  'categories:performance': ['error', { minScore: 0.95 }]
  'categories:accessibility': ['error', { minScore: 1.00 }]
  'categories:best-practices': ['error', { minScore: 0.95 }]
  'categories:seo': ['error', { minScore: 1.00 }]
  'largest-contentful-paint': ['error', { maxNumericValue: 2500 }]
  'interaction-to-next-paint': ['error', { maxNumericValue: 200 }]
  'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }]
  'total-byte-weight': ['error', { maxNumericValue: 307200 }]
  'unused-javascript': ['error', { maxNumericValue: 20000 }]
throttling:
  cpuSlowdownMultiplier: 4
  throughputKbps: 1638
```

PR blocked on budget break. No "we'll optimise later."

---

## 9. Security & privacy checklist (every PR)

- [ ] CSP headers set (`default-src 'self'`; no inline JS without nonce).
- [ ] HSTS preload, `Referrer-Policy: strict-origin-when-cross-origin`, locked
      `Permissions-Policy`, SRI on all CDN assets.
- [ ] Turnstile on every public form. Rate limit at Worker edge via Durable
      Object.
- [ ] CSRF token on every state-changing request.
- [ ] PII never logged. Never in URLs. Never in error messages. Never in Workers
      Observability traces.
- [ ] Sensitive D1 columns encrypted at application layer (AES-256-GCM, key in
      Secrets Store).
- [ ] Audit log entry for every auth, payment, admin action → D1 `audit_log` +
      Logpush to R2 7-year archive.
- [ ] Signed tokens: Ed25519, keys in Workers Secrets, quarterly rotation with
      `kid`-based overlap.
- [ ] Secrets via Workers Secrets + Secrets Store. Zero plaintext in repo, zero
      in wrangler.toml.
- [ ] DPA 2012 check: legal basis, data-subject rights notice, retention period
      documented.
- [ ] Act 1038 check: is this a CII touchpoint? If yes, CSA notification pathway
      documented.
- [ ] Cybersecurity Fund levy configured for any paid-service webhook.

---

## 10. First task

On fresh session:

1. **Read `docs/adr/*.md`**. If absent, repo is uninitialised — begin Week 0–2
   (§5) and write ADR-001/002/003.
2. **Run
   `pnpm install && pnpm typecheck && pnpm test && pnpm build && pnpm wrangler:dry`**
   to baseline repo health.
3. **Open current Phase 1 milestone** (ccpm skill if in use). Pick top unblocked
   issue.
4. **Write the plan** as an issue comment: approach, files touched, failing
   tests first, ADR if architectural, KPI served.
5. **Ship the slice.** Conventional commit, PR to `main`, link issue, tick every
   §7 DoD box.

If no ADRs and no issues: first output is `docs/doctrine/week-0.md` — one page
on repo state, §5 Week 0–2 gaps, three next concrete PRs. Wait for go-ahead
before coding.

**Never** ship anything contradicting §1. If asked to, reply with the specific
non-negotiable violated and propose a compliant alternative.

---

## 11. Operating norms

- GitHub: `ghwmelite-dotcom`, commit email `ozzy@ohcs.gov.gh` unless told
  otherwise.
- Timezone: **Africa/Accra (UTC+0)**. UI dates `DD Month YYYY`. Logs: ISO 8601
  UTC.
- Cost discipline: stay within Cloudflare's free/paid tier boundaries. Every
  Workers/D1/R2/KV size estimate goes in the PR description.
- Never push to `main`. Always PR. Always review (self-review catches what the
  author missed).
- Blocked on external (NIA IVSP creds, Hubtel merchant key, CSA registration):
  stub the adapter with realistic fake, TODO-BLOCKED comment, file unblock
  issue. Don't freeze.

---

## 12. The restraint principle

When in doubt, do less. Rwanda's `gov.rw` is world-class because it resists
putting everything on the homepage. Three-item navigation is not a limitation —
it is a statement of confidence. Every element that earns its place must pay its
cost in bytes, in cognitive load, and in accessibility surface.

Ship small. Ship fast. Ship dignified. Let the platform earn its ambition one
unshakable feature at a time.

Ghana first. Always.

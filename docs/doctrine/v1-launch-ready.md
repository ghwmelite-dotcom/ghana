# v1 launch ready · 2026-04-19

Plan 3 (launch prep, engineering portion) finished. Branch:
`feat/v1-foundation`. Tag: `v1-launch-ready`. No remote push.

## The site right now

**80 HTML pages + sitemap + RSS + Pagefind index.** Builds cleanly with
`pnpm build`, deploys to Cloudflare Pages as a single static drop. Homepage
transfer: **31.6 KB gzipped** (budget: 80 KB). Every page axe-clean; the
five-gate pipeline is green end-to-end.

## Plan 3 engineering — what shipped

| Task | Scope | Location |
| --- | --- | --- |
| L1 | Security headers (CSP + HSTS + Referrer-Policy + Permissions-Policy + X-Frame-Options + X-Content-Type-Options + COOP + per-path cache) | `apps/portal/public/_headers` |
| L2 | Sitemap integration with i18n en/tw | `apps/portal/astro.config.mjs` → `/sitemap-index.xml`, `/sitemap-0.xml` |
| L3 | robots.txt + humans.txt | `apps/portal/public/` |
| L4 | Ghana-branded 404 page | `apps/portal/src/pages/404.astro` → `/404.html` |
| L5 | News RSS 2.0 feed | `apps/portal/src/pages/news/feed.xml.js` → `/news/feed.xml` |
| L6 | Canonical URLs, Open Graph, Twitter summary_large_image, OG image stub | `apps/portal/src/layouts/BaseLayout.astro` |
| L7 | Cloudflare Web Analytics beacon (conditional on env) | `apps/portal/src/layouts/BaseLayout.astro` |
| L8 | `.well-known/security.txt` (RFC 9116) | `apps/portal/public/.well-known/security.txt` |

## Still to do — hand to human

These are launch-prep tasks I can't do in a code environment. Each is a real
blocker for production cutover; document status when actioned.

### High priority — before go-live

- [ ] **Source 3 cultural close-up hero images** per `apps/portal/src/assets/hero/CREDITS.md`. Swap Hero placeholder per the restore procedure in that file. Without this the homepage ships a solid-colour backdrop.
- [ ] **Create the OG image** at `apps/portal/public/og-image.png` — 1200×630 px, Kente stripe + coat of arms + "Government of Ghana" in Georgia serif. Currently referenced by BaseLayout but the file is a 404.
- [ ] **Confirm current Minister names** for all 21 ministry files (currently placeholder `Hon. Minister` / `Hon. Deputy Minister`). Swap in real office-holders from the Office of the President.
- [ ] **External WCAG 2.2 AA audit.** Automated axe is gating at 0 blocking violations across 80 pages, but a human panel (Ghana Federation of Disability Organisations or equivalent) must sign off per the accessibility statement.
- [ ] **Register the portal as CII under Act 1038** with the Cyber Security Authority. Documented security architecture: Cloudflare edge + application-layer encryption (none needed in v1 — no PII collected) + RFC 9116 disclosure at `/.well-known/security.txt`.
- [ ] **Register as Data Controller under Act 843** with the Data Protection Commission. Collected data: Cloudflare Web Analytics only (anonymous, no cookies). Processor agreement with Cloudflare under §30(4) referenced in `/privacy/`.
- [ ] **Replace the placeholder email addresses** in `/about/`, `/accessibility/`, `/privacy/`, `/contact/`, `/.well-known/security.txt`. Currently `accessibility@gov.gh`, `dpo@gov.gh`, `feedback@gov.gh`, `security@gov.gh` — these need real MX records + inboxes.
- [ ] **DNS cutover.** Point `gov.gh` at Cloudflare Pages. Create the Pages project, configure `PUBLIC_CF_ANALYTICS_TOKEN` env var, connect custom domain.
- [ ] **Lighthouse CI against the deployed preview.** Thresholds per spec §8: Performance ≥ 0.95, Accessibility = 1.00, BP ≥ 0.95, SEO = 1.00, LCP ≤ 2500 ms, CLS ≤ 0.1, INP ≤ 200 ms, total-byte weight ≤ 307200 per page.

### Medium priority — within first month post-launch

- [ ] **Cybersecurity Fund levy** configuration per Act 1038 §31(e) — only applicable once any paid service is added (none in v1).
- [ ] **10 ministries still carry `keyServices: []`** — populate as more services are authored: Defence, Justice, Roads, Energy, Works & Housing, Sanitation, Tourism, Information, Youth & Sports, Gender.
- [ ] **Twi expansion.** Current 5 stubs → full parity on services/ministries/news is a v1.1 programme.
- [ ] **Commissioned people-centric photography** (v2 upgrade from cultural close-ups per brainstorming session).

## Five-gate at tag

- pnpm typecheck — PASS (2/2 packages)
- pnpm lint — PASS (2/2 packages)
- pnpm build — PASS (80 HTML pages + sitemap + RSS feed + Pagefind index)
- pnpm test — PASS (routes-test 15/15 · axe-check 80/80 pages clean)
- pnpm format:check — PASS

## Homepage weight — final

- Total first-paint transfer: **31.6 KB gzipped** (HTML + CSS + preloaded fonts)
- Budget: **80 KB gzipped**
- Headroom: **~50 KB** — ample runway for the hero image + any future enhancements

## Running the site locally

```bash
pnpm --filter @gh/portal build
pnpm --filter @gh/portal preview --host --port 4322
# then open http://localhost:4322/
```

## Merging back to main

```bash
# From main checkout (the primary worktree at the repo root)
git merge feat/v1-foundation --no-ff -m "feat: v1 (plans 1+2+3)"
# optional: clean up the worktree when done
git worktree remove .worktrees/v1-foundation
```

## Cloudflare Pages deploy checklist

1. Create a Pages project linked to the GitHub repo.
2. Build command: `pnpm install && pnpm --filter @gh/portal build`
3. Build output directory: `apps/portal/dist`
4. Environment variables (production):
   - `PUBLIC_CF_ANALYTICS_TOKEN` — from Cloudflare Web Analytics dashboard
5. Custom domain: `gov.gh` (apex) + `www.gov.gh` redirect.
6. Node version: 22.
7. First deploy — verify `/sitemap-index.xml`, `/news/feed.xml`, `/.well-known/security.txt`, and `/_headers` are all served correctly.

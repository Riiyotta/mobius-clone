# Design-repo: design-studio template clone

AI-ready design-repo extracted from the clone in the parent folder (a design-faithful rebuild of a commercial
no-code design-studio template). It describes what the site renders and how it behaves: tokens, primitives,
components, semantic section contracts, page templates, a PageSpec schema, a semantic validator and an
adversarial suite. Status: `design-review-pending`, `productionApproved: false`.

## Counts (recomputed from disk by `extraction/verify_all.py`)

<!-- counts:start -->
| item | count |
|---|---|
| tokens | 76 |
| primitives | 10 |
| components | 13 |
| sections | 45 |
| retrievableSections | 38 |
| templates | 9 |
| routes | 31 |
| assetRoles | 18 |
| motionPatterns | 31 |
| graphRules | 12 |
| examplePageSpecs | 5 |
<!-- counts:end -->

## Category and design policy

Category: `portfolio` (product domain `creative-design-studio-portfolio`). `registry.manifest.json` binds the repo to the
common policy `n0-design-constraints-common` 0.1.0 (Common IR 0.5, `hard-and-soft`) through `designPolicy`, with the local
extension `policy/design-policy.json` (`portfolio-site-web` 1.0.0). `designPolicy.contentHash` covers the enforcing files
(`tokens/llm/token-policy.json`, `compatibility/graph.json`, `schema/pagespec.schema.json`, `schema/semantic_validate.py`);
refresh it with `python3 extraction/policy_hash.py --write` after editing any of them (`verify_all` check `design-policy`
recomputes it).

Status: the policy decision is `defined-pending-architecture-review` and `architectureDecisionRecorded` is `false`. The
category label and the classification (surfaces, audiences) were derived by the extraction agent from the clone; they are
not human-reviewed and not owner-ratified. The clone's real `pricing.packages` section is allowed only as the service-packages
block as it appears in the clone.

## Not-built stand-in

`src/pages/Pending.jsx` is a "being rebuilt" stand-in rendered by the default branch of the switch in `src/App.jsx`. The router
(`src/lib/router.js`) only yields home, work, project, feed, post, studio, contacts, legal and 404, all handled explicitly, so
no served route renders it. The 31 routes and 9 templates counted here are all implemented pages.

## Templates (`?` optional, `*` repeatable)

| template | routes | node sequence |
|---|---|---|
| home | 1 | shell.nav-layer -> hero.studio-wordmark -> content.statement-scatter -> media.showreel? -> features.services-index -> social-proof.studio-numbers? -> social-proof.awards-list? -> team.founders? -> social-proof.partner-logos? -> features.process-timeline? -> testimonial.client-reflections? -> pricing.packages? -> editorial.studio-notes-teaser? -> conversion.contact-form -> faq.questions-answered? -> shell.site-footer |
| work-index | 1 | shell.nav-layer -> hero.index-title -> listing.project-index -> shell.site-footer? |
| case-detail | 12 | shell.nav-layer -> hero.case-intro -> content.marked-chapter -> content.pull-quote -> content.marked-chapter -> media.case-gallery -> content.marked-chapter -> content.case-results -> content.case-credits -> navigation.case-teaser? -> shell.site-footer |
| studio | 1 | shell.nav-layer -> hero.studio-intro -> team.studio-team -> content.principles -> media.studio-image-strip? -> listing.career-openings? -> navigation.case-teaser? -> shell.site-footer |
| contacts | 1 | shell.nav-layer -> conversion.contact-form -> content.contact-details -> editorial.studio-notes-teaser? -> shell.site-footer |
| feed-index | 1 | shell.nav-layer -> hero.index-title -> editorial.notes-index -> shell.site-footer? |
| feed-post | 11 | shell.nav-layer -> hero.article-header -> media.article-cover -> content.marked-chapter -> content.pull-quote -> content.marked-chapter -> editorial.read-more -> shell.site-footer |
| legal | 2 | shell.nav-layer -> hero.legal-header -> content.legal-clause* -> faq.questions-answered -> shell.site-footer |
| not-found | 1 | shell.nav-layer -> hero.not-found -> faq.questions-answered -> shell.site-footer |

Every served route (30 sitemap routes + `/404`) is mapped exactly once in `templates/routes.json`; unknown URLs
fall back to `not-found` (except unknown `/feed/<slug>`, which renders an empty page in the clone; recorded).

## Modes (R1/R2)

Every PageSpec declares `mode`:
- `reference` reconstructs the clone (its brand, copy and photography are allowed as evidence);
- `generated` is a new page for someone else: `schema/semantic_validate.py` rejects the source brand and its
  variants, domains and emails, CTA strings, marketing copy (6-word shingles of `schema/reference-copy-corpus.json`),
  people, client companies, award names, pricing figures, source slugs, non-placeholder URLs and every
  non-generation-safe asset role (`GENERATED_MODE_*`). Patterns live in `schema/source-brand.json` and are checked
  against the real source by `verify_all` (none invented).

Asset availability (`assets/asset-roles.json`) is pinned in code in both `verify_all.py` and the validator. The
template's photography, partner logos, people's photos, showreel and copy are proprietary: generated output must
never reproduce real logos, real people's photos or proprietary content.

## Runtime UI (R8)

`retrievalEligible: false` (pinned): custom cursor, cursor image trail, location clock, decorative text bands,
menu overlay, reel lightbox, form success state. Templates list them under `runtimeOverlays`; they are never nodes.
The home "loader" is the hero's own appear sequence, not a preloader.

## Measured evidence (R9, R11, R12)

- Section heights at 1440x900 for all 31 routes: `extraction/measured-values.json#/sectionHeights`
  (re-measure: `PLAYWRIGHT_MODULE=<playwright> CLONE_URL=<url> node extraction/measure_sections.mjs --out <file>`).
  Wrapper gate: 0 errors; no whitelist entries needed (max HERO 911.9px; max share 34.8%).
- Doc heights at 1000 and 390 for every route: `responsiveDocHeights`.
- Live-original vs clone parity at 1440x900, same scroll offsets, per-section gate 0.80 (`extraction/parity_harness.mjs`):
  mean section score 0.970 over 53 sections on 9 routes;
  3 sections below the gate.

| route | average | min section | per-section gate |
|---|---|---|---|
| / | 0.952 | 0.625 | FAIL: media.showreel#0 |
| /work | 0.998 | 0.998 | pass |
| /work/soma-studio | 0.989 | 0.966 | pass |
| /studio | 0.942 | 0.670 | FAIL: media.studio-image-strip#0 |
| /contacts | 0.990 | 0.976 | pass |
| /feed | 0.795 | 0.795 | FAIL: editorial.notes-index#0 |
| /feed/beyond-function | 0.992 | 0.987 | pass |
| /legal/privacy-policy | 0.997 | 0.991 | pass |
| /404 | 0.987 | 0.973 | pass |

The below-gate sections are continuously animating media (video + text bands, image strip, auto-scrolling
columns) that the harness does not freeze. Not measured: parity at tablet/phone widths, the other CMS routes,
interaction states.

## Verify

```bash
python3 extraction/verify_all.py          # schema, semantic, parity, citations, pins, tokens, routes, counts, gate
python3 schema/tests/adversarial_test.py  # every mutation rejected, every control passes
python3 extraction/prove_drift.py         # every drift check proven to fail on injected defects
python3 schema/semantic_validate.py schema/example.pagespec.json schema/examples/*.json
```

Requires Python 3 + `jsonschema` (Draft-07 layer). Citation, token-source, route and source-brand drift checks run
against the clone tree that contains this folder and degrade to WARN when the folder stands alone. The clone
itself installs with its lockfile (`npm ci && npm run build`); this repo ships no dependency folders.

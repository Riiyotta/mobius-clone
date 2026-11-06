# Changelog

## 1.1.2

- "fix mobius": the four weakest 1.1.1 sections were diagnosed from live / clone / diff images, the real causes fixed, and the parity that
  1.1.1 had skipped was measured: tablet 768x1024, phone 390x844 and desktop 1440 for every remaining route. Everything uses the same
  symmetric freeze and the same 0.80 per-section gate; every run was made twice and the repeat is pinned too.
- 1440 weak sections (before 1.1.1 -> now): `/404 hero.not-found` 0.880 -> 0.998 (harness artefact: the live gradient shapes are script-driven
  and were never frozen; the harness now pins rotating elements symmetrically, no src change), `/ testimonial.client-reflections`
  0.927 -> 0.991 and `/ features.process-timeline` 0.945 -> 0.990 (real mismatch: the original's 10 s slideshow only plays while on screen, the clone
  started it at mount and was one slide ahead; fixed in `src/components/home/Testimonials.jsx`), `/ team.founders` 0.965 -> 0.995 (real mismatch:
  the original always draws a 50% black backdrop masked by a bottom-up gradient over each portrait, the clone only on hover; fixed in
  `.hs-tc-bd`). Mean over the 53 sections 0.9889 -> 0.9937, lowest section 0.880 -> 0.976, two runs within 0.0021.
- Tablet 768 (56 sections): first measurement 20 sections below the gate, mean 0.842 (lowest 0.454); now 0, mean 0.997 (lowest 0.973).
  Phone 390 (56 sections): first measurement 5 below the gate, mean 0.950 (lowest 0.708); now 0, mean 0.995 (lowest 0.974).
  Desktop 1440 remaining 22 routes (183 sections): 0 below the gate, mean 0.9945, lowest 0.975 (no src change needed). Every one of the
  31 routes now has a desktop measurement; all 31 have a live counterpart (live and clone document heights equal on all 22 remaining routes).
- Real src fixes found by those runs (all responsive, `src/` only, no copy changed): the home hero intro now fades out on scroll at tablet/phone
  widths exactly like the original (the page is 32 px shorter after the first scroll there; every phone section below it was 32 px off);
  phone-layout paragraphs take the original's max-widths (480 / 400 px, the clone had 100%: `.hs-scr-p`, `.hs-fd-p`, `.hs-pc-p`, `.hs-pc-text`,
  `.hs-ts-p`, `.hs-pr-p`, `.hs-bn-p`, `.pj-body`, `.pj-cr-p`, `.pj-services p`, `.st-intro-p`); numbers/awards text blocks are centred as on the
  original; case-study stats use a two-column `1fr 1fr` grid instead of fixed 185 px columns. Harness: wrap-offset release for tickers
  (studio image strip 0.614 -> 0.997 at 768), rotation pins, documented in the harness header and `cloneParity.captureState`.
- Per-section before/after numbers: `cloneParity.weakSections`, `cloneParityRuns.runs[].sectionsFixed` / `beforeAfterSummary`; the pre-fix result files
  are tracked and pinned (`*-before-fix.json`). No parity exception recorded; nothing is waiting for approval.
- Source line citations moved by the edits to Hero.jsx, Testimonials.jsx, home-sections.css (and token evidence lines) were re-pointed with a
  line-mapping script and re-verified by `citations` / `tokens-vs-source`; 1440 section heights and the 1000 / 390 document heights were re-measured
  and are unchanged; 768 document heights were added. Motion pattern `slideshow-autoplay` and the hero contract detail now describe the new behaviour.
  Tokens, token policy, copy corpus and source-brand registries did not change (no token value, no copy).
- New `verify_all` check `parity-runs` (25 checks now): pins, re-derived scores / heights / gates, viewport, freeze, unfiltered coverage, repeat tolerance,
  exceptions, full 1440 route coverage, 768 and 390 coverage of the representative routes, and an honest `notMeasured` list. 19 new `prove_drift` cases.
- Still unmeasured (listed in `cloneParityRuns.notMeasured`): the 22 non-representative routes at 768 and 390, 1000 and 1280 wide parity
  (document heights only), hover / drag states, motion timing curves. The open mobile menu overlay was compared once on /studio at 390 and 768
  (similarity 0.9999), not as a pinned run.
- IR left untouched by request; no IR field depends on the changed numbers.

## 1.1.1

- Parity harness (`extraction/parity_harness.mjs`): symmetric capture freeze applied identically to the live page and the clone before
  every screenshot (videos paused and seeked to 0 ms with the seek awaited; CSS/WAAPI animations paused or finished; script-driven
  marquees and auto-scrolling columns pinned to the same start state; fonts and visible images decoded). Documented in the harness header
  and in `cloneParity.captureState`. New options: `--freeze on|off`, `--phase`, `--skew` (diagnostic), `--only`, `--geometry` (text-free
  box / text-row matching), `--dump` (local diff images). Two harness artefacts found and fixed on the way: a plain "track translate 0" pin
  left the live wrap-style ticker with a blank first item (strip scored 0.26 on some runs), and lazy live images appear only after the pin.
- Result: the three sections that were below the 0.80 gate (`media.showreel` 0.625, `media.studio-image-strip` 0.670, `editorial.notes-index`
  0.795) were animation timing, not layout: unfrozen they do not reproduce (0.58-0.81 across re-runs), frozen they score 0.996 / 0.999 / 0.994.
  All 53 sections on the 9 routes are now at or above the gate (lowest 0.880), mean 0.9889 (was 0.9699), two full runs within 0.0038.
  Phase evidence (clone deliberately 1000/2500 ms out of phase falls to 0.81/0.66, 0.60/0.49, 0.78/0.67) and geometry match numbers are in
  `cloneParity.animationHypothesis` and `cloneParity.geometry`.
- No `src/` change, no section contract or height change, no parity exception recorded (`cloneParity.exceptions` is empty; exceptions can
  only be `pending human approval` with `approvedBy: null`).
- New tracked evidence `extraction/parity-results/` (official + repeat full runs, unfrozen before runs, phase runs) and the new `verify_all`
  check `parity-evidence` (24 checks now): recorded numbers must equal the sha256-pinned official result file, the repeat run must agree
  within the recorded tolerance, the freeze must be on, exceptions can only be pending/unapproved and only for sections below the gate.
  7 new `prove_drift` cases for it. Live screenshots are not committed.
- IR left untouched by request; no IR field depends on the changed numbers.

## 1.1.0

- Category `portfolio` and productDomain `creative-design-studio-portfolio` added to the manifest, with a `designPolicy` binding to
  `n0-design-constraints-common` 0.1.0 (Common IR 0.5, hard-and-soft) and the local extension `policy/design-policy.json`.
  `designPolicy.contentHash` is computed by the new `extraction/policy_hash.py`; both files are registered entryPoints.
- New `verify_all` check `design-policy` (23 checks now) and 9 `prove_drift` cases for it (hash drift, tampered hash, category
  removed/changed, binding removed, version drift, policy file missing, approval overstated, hash script unregistered).
  `prove_drift` accepts `--scratch <empty dir>`.
- Approval is NOT claimed: policyDecision `defined-pending-architecture-review`, architectureDecisionRecorded `false`. The
  category and classification are agent-derived and not human-reviewed.
- README documents that `src/pages/Pending.jsx` is unreachable (no served route renders it); counts are unchanged.
- Counts unchanged (recomputed from disk): 45 sections, 9 templates, 31 routes.

## 1.0.0 (initial build)

- Built from scratch against the current clone source and the recon specs (CLONE_SPEC.md, .recon/specs/*).
- 45 section contracts (38 retrievable, 7 pinned runtime UI), 9 templates, 31 routes mapped once.
- 76 catalogued tokens with token policy; 18 asset roles with three-way availability pinned in code.
- Generated-mode leakage rules, 4 generation-safe example PageSpecs + 1 reference example.
- Measured section heights (1440) for every route, responsive doc heights (1000/390), live parity harness results.
- Legal documents decomposed into one clause node per heading-bounded part (R6).
- Groundwork claims that did not hold are listed in extraction/measured-values.json#/groundworkChecks.
- Section citations were re-resolved after the concurrent layout fixes to project/studio/legal/feed files landed.

# Changelog

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

# Changelog

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

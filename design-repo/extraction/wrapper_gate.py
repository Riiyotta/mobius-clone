#!/usr/bin/env python3
"""R9 whole-page-wrapper quality gate over MEASURED section heights.

    python3 extraction/wrapper_gate.py [--measured path/to/measured-values.json]

Inputs: extraction/measured-values.json -> sectionHeights (headless browser, 1440px) and wrapperWhitelist;
sections/*.json for each contract's category; templates/routes.json for the routes that must be measured.
Thresholds are pinned here in code (not read from JSON):
  HERO > 1800px warn, > 3000px error (unless whitelisted)
  one in-flow section > 50% of its page warn, > 60% error (unless whitelisted);
  pages with < 3 in-flow non-shell sections are skipped; shell rows and inFlow=false rows take no share
  missing measurement, wrong viewport, stale/over-cap/unjustified whitelist entries: error
  a row may lack a height only when it is marked optional and renderedAtViewport=false (not rendered at 1440)
A whitelisted hit still warns. Exit 1 on any error.
"""
import json, os, sys
sys.dont_write_bytecode = True

HERO_WARN_PX = 1800
HERO_FAIL_PX = 3000
SHARE_WARN = 0.50
SHARE_FAIL = 0.60
MIN_SECTIONS_FOR_SHARE = 3
REQUIRED_VIEWPORT = 1440
AGENT_ATTESTATION = "agent attestation, not a human sign-off"

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def _load(p):
    with open(p, encoding="utf-8") as f:
        return json.load(f)

def gate(repo=REPO, measured=None):
    errs, warns = [], []
    mv = measured if isinstance(measured, dict) else _load(measured or os.path.join(repo, "extraction/measured-values.json"))
    contracts = {}
    for fn in os.listdir(os.path.join(repo, "sections")):
        if fn.endswith(".json"):
            c = _load(os.path.join(repo, "sections", fn)); contracts[c["id"]] = c
    routes = _load(os.path.join(repo, "templates/routes.json"))["routes"]
    sh = mv.get("sectionHeights")
    if not sh or not sh.get("pages"):
        return [("MISSING_MEASUREMENT", "measured-values.json has no sectionHeights")], warns
    if sh.get("viewportWidth") != REQUIRED_VIEWPORT:
        errs.append(("WRONG_VIEWPORT", f"sectionHeights measured at {sh.get('viewportWidth')}px; the gate requires {REQUIRED_VIEWPORT}px"))
    pages = {p["route"]: p for p in sh["pages"]}
    for r in routes:
        if r["route"] not in pages:
            errs.append(("MISSING_MEASUREMENT", f"route {r['route']} has no measured section heights"))
    measured_sections = set()
    for p in sh["pages"]:
        for s in p["sections"]:
            if not isinstance(s.get("heightPx"), (int, float)):
                if not (s.get("optional") and s.get("renderedAtViewport") is False):
                    errs.append(("MISSING_MEASUREMENT", f"{p['route']} {s.get('section')}: no measured height"))
                continue
            measured_sections.add(s.get("section"))
    for sid, c in contracts.items():
        if c["retrievalEligible"] and c["semantic"]["category"] != "SHELL" and sid not in measured_sections:
            errs.append(("MISSING_MEASUREMENT", f"section {sid} is never measured on a served route"))
    wl_index = {}
    for i, e in enumerate(mv.get("wrapperWhitelist", [])):
        miss = [k for k in ("route", "section", "reviewedBy", "justification", "maxHeightPx") if k not in e]
        if miss:
            errs.append(("WHITELIST_INVALID", f"whitelist[{i}] missing {miss}")); continue
        if len(e["justification"].strip()) < 30:
            errs.append(("WHITELIST_INVALID", f"whitelist[{i}] justification shorter than 30 characters"))
        rb = e["reviewedBy"].lower()
        if any(w in rb for w in ("agent", "claude", "ai ", "assistant", "bot")) and AGENT_ATTESTATION not in rb:
            errs.append(("WHITELIST_INVALID", f"whitelist[{i}] reviewedBy is an agent but does not say '{AGENT_ATTESTATION}'"))
        wl_index[(e["route"], e["section"])] = (i, e)
    used = set()
    for p in sh["pages"]:
        doc = p["docHeightPx"]
        rows = [s for s in p["sections"] if isinstance(s.get("heightPx"), (int, float))]
        inflow = [s for s in rows if s.get("inFlow", True)]
        for s in rows:
            h = s["heightPx"]
            c = contracts.get(s["section"])
            if c is None:
                errs.append(("UNKNOWN_SECTION", f"{p['route']}: measured section {s['section']} has no contract")); continue
            key = (p["route"], s["section"])
            w = wl_index.get(key)
            if w:
                used.add(key)
                if h > w[1]["maxHeightPx"]:
                    errs.append(("WHITELIST_STALE", f"{p['route']} {s['section']}: measured {h}px exceeds whitelisted maxHeightPx {w[1]['maxHeightPx']}"))
            if c["semantic"]["category"] == "HERO":
                if h > HERO_FAIL_PX and not w:
                    errs.append(("HERO_TOO_TALL", f"{p['route']} {s['section']}: HERO {h}px > {HERO_FAIL_PX}px"))
                elif h > HERO_WARN_PX:
                    warns.append(("HERO_TALL", f"{p['route']} {s['section']}: HERO {h}px > {HERO_WARN_PX}px" + (" (whitelisted)" if w else "")))
            if len(inflow) >= MIN_SECTIONS_FOR_SHARE and s.get("inFlow", True):
                share = h / doc
                if share > SHARE_FAIL and not w:
                    errs.append(("SECTION_DOMINATES_PAGE", f"{p['route']} {s['section']}: {share:.1%} of the page > {SHARE_FAIL:.0%}"))
                elif share > SHARE_WARN:
                    warns.append(("SECTION_LARGE_SHARE", f"{p['route']} {s['section']}: {share:.1%} of the page > {SHARE_WARN:.0%}" + (" (whitelisted)" if w else "")))
    for key, (i, e) in wl_index.items():
        if key not in used:
            errs.append(("WHITELIST_STALE", f"whitelist[{i}] {key} matches no measurement"))
    return errs, warns

def main(argv):
    m = argv[argv.index("--measured") + 1] if "--measured" in argv else None
    errs, warns = gate(REPO, m)
    for c, msg in errs:
        print(f"ERROR {c}: {msg}")
    for c, msg in warns:
        print(f"warn  {c}: {msg}")
    print(f"wrapper gate: {len(errs)} error(s), {len(warns)} warning(s)")
    return 1 if errs else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

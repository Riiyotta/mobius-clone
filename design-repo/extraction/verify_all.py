#!/usr/bin/env python3
"""One-shot verification of the design-repo. Exit 1 on any FAIL.

    python3 extraction/verify_all.py

Checks (each prints PASS/FAIL/WARN with evidence):
  self-containment   entryPoints exist inside the repo; no absolute machine paths; no junk files
  json               every *.json parses
  schema-*           Draft-07 check_schema for both schemas; every section contract and every example validates
  semantic-examples  every example passes schema/semantic_validate.py with zero errors
  allowlist-parity   component-allowlist <-> sections/, components/, primitives/, schema node/style/page properties,
                     asset roles, motion patterns; allowlistVersion == manifest
  citations          every path:line-line citation resolves in the sibling clone tree (repo/..) and stays in range; for
                     {file, tag, lines} objects the tag text is on the cited start line. Re-read from the CURRENT files on
                     every run. WARN-only when the sibling tree is absent (standalone copy).
  contracts          semantic.id == id == filename, source.id != semantic.id, retrieval pin (RETRIEVAL_INELIGIBLE),
                     runtime-UI name heuristic, motion fallbacks, asset roles, maxWords on every text field
  asset-pins         asset-roles.json == PINNED_AVAILABILITY here == PINNED_AVAILABILITY in the validator; pinned
                     generationPolicy values; substitutes are generation-safe; licensing rule present
  tokens             token-catalog.json == recomputation from tokens/00-foundation + 10-semantic; policy references
                     resolve; policy keys are catalog types; themes resolve; catalog version == manifest
  tokens-vs-source   every foundation value still appears on its cited source line (sibling)
  source-brand       every literal identity pattern occurs in the real source/specs (sibling): patterns are never invented
  routes             routes.json == the route set derived from the sibling router + CMS slugs; mapped exactly once
  graph-parity       compatibility/graph.json rule ids == semantic_validate.GRAPH_RULE_IDS
  design-policy      category == portfolio; manifest designPolicy bound to n0-design-constraints-common 0.1.0 (Common IR 0.5,
                     hard-and-soft) with the policy/design-policy.json local extension; contentHash recomputed over the
                     enforcing files (extraction/policy_hash.py); enforcedBy files exist; policy file and hash script are
                     registered entryPoints; approval must stay defined-pending-architecture-review (never overstated)
  manifest-counts / readme-counts   recomputed from disk
  wrapper-gate       extraction/wrapper_gate.py (R9) has zero errors
  clone-parity       recorded parity numbers are internally consistent (averages, minima and gate flags re-derived)
  parity-evidence    every recorded parity number is pinned to a tracked harness result file (sha256); the recorded routes,
                     sections, scores and overall figures equal the official result file; the repeat run agrees within the
                     recorded tolerance; the freeze is on; parity exceptions can only be pending/unapproved and only for
                     sections that really are below the gate
  parity-runs        the extra parity runs (tablet 768x1024, phone 390x844, desktop 1440 for every remaining route) are each pinned to
                     an official + repeat result file by sha256; recorded routes/sections/scores/doc heights equal the official file;
                     viewport, symmetric freeze at phase 0 and unfiltered coverage are re-checked; the repeat agrees within the
                     tolerance; every route of templates/routes.json is covered at desktop; exceptions only pending/unapproved and
                     only for sections really below the gate; what stays unmeasured is listed, never silently absent
  generated-examples a generation-safe example exists for home and at least one non-home template family
"""
import glob, hashlib, json, os, re, sys
from collections import Counter
sys.dont_write_bytecode = True

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
SRC_ROOT = os.path.dirname(REPO)          # the clone project that contains design-repo/ (optional)
sys.path.insert(0, os.path.join(REPO, "schema"))
sys.path.insert(0, HERE)
import semantic_validate as SV            # noqa: E402
import wrapper_gate                       # noqa: E402

PINNED_AVAILABILITY = {
    "brand.source-wordmark": "reference-only", "brand.placeholder-mark": "generation-safe", "brand.user-supplied-mark": "generation-safe",
    "logo.source-partner": "blocked-for-generation", "logo.fictional-partner": "generation-safe",
    "photo.source-project": "reference-only", "photo.source-editorial": "reference-only", "photo.source-person": "blocked-for-generation",
    "person.fictional-portrait": "generation-safe", "media.source-reel": "blocked-for-generation", "media.video-placeholder": "generation-safe",
    "photo.generated-scene": "generation-safe", "illustration.gradient-shape": "reference-only", "illustration.generated-abstract": "generation-safe",
    "icon.ui-glyph": "generation-safe", "rating.placeholder": "generation-safe", "url.placeholder": "generation-safe", "copy.original": "generation-safe",
}
RETRIEVAL_INELIGIBLE = {"utility.custom-cursor", "utility.cursor-image-trail", "utility.berlin-clock", "utility.text-ticker",
                        "overlay.menu-overlay", "overlay.reel-lightbox", "feedback.form-success"}
RUNTIME_UI = re.compile(r"overlay|modal|dialog|drawer|cookie|consent|toast|lightbox|preloader|cursor|popover|tooltip|ticker|clock|trail|success|feedback", re.I)
# Built from fragments so this file never contains a literal machine-path prefix itself.
_U, _H = "/" + "Users/", "(?:^|[\\s\"'(=])/" + "home/"
ABS_PATH = re.compile(_U + r"[A-Za-z0-9._-]+/|" + _H + r"[A-Za-z0-9._-]+/|[A-Za-z]:\\" + r"Users\\|/" + "private/(tmp|var)/")
CITE = re.compile(r"((?:src|public)/[A-Za-z0-9_./-]+\.(?:jsx|js|css|json|html)|\.recon/specs/[A-Za-z0-9_.-]+\.md|CLONE_SPEC\.md|index\.html|tailwind\.config\.js|package\.json):(\d+)-(\d+)")
GATE = 0.8

RESULTS = []
def rec(check, ok, msg, warn=False):
    RESULTS.append((check, "WARN" if (warn and ok) else ("PASS" if ok else "FAIL"), msg))

def load(rel):
    with open(os.path.join(REPO, rel), encoding="utf-8") as f:
        return json.load(f)

def files(pattern):
    return sorted(glob.glob(os.path.join(REPO, pattern), recursive=True))

def rel(p):
    return os.path.relpath(p, REPO)

SIBLING = os.path.isfile(os.path.join(SRC_ROOT, "src", "App.jsx")) and os.path.isfile(os.path.join(SRC_ROOT, "src", "lib", "router.js"))
def src_text(r):
    with open(os.path.join(SRC_ROOT, r), encoding="utf-8") as f:
        return f.read()

# ------------------------------------------------------------------------------------------------
def check_self_containment(man):
    eps = []
    def coll(v):
        if isinstance(v, str): eps.append(v)
        elif isinstance(v, list): [coll(x) for x in v]
        elif isinstance(v, dict): [coll(x) for x in v.values()]
    coll(man.get("entryPoints", {}))
    bad = [e for e in eps if e.startswith("..") or os.path.isabs(e) or not os.path.exists(os.path.join(REPO, e))]
    rec("self-containment", not bad, f"{len(eps)} entryPoints, all inside the repo and present" if not bad else f"outside/missing: {bad[:5]}")
    hits = []
    for p in files("**/*"):
        if os.path.isfile(p) and not p.endswith(".zip"):
            try:
                t = open(p, encoding="utf-8").read()
            except UnicodeDecodeError:
                continue
            for m in ABS_PATH.finditer(t):
                line = t[:m.start()].count("\n") + 1
                if "ABS_PATH = re.compile" in t.split("\n")[line - 1] or "re.search(r\"/Users" in t.split("\n")[line - 1]:
                    continue
                hits.append(f"{rel(p)}:{line}")
    rec("no-absolute-paths", not hits, "no absolute machine paths" if not hits else f"found: {hits[:5]}")
    junk = sorted({rel(p) for p in glob.glob(os.path.join(REPO, "**/*"), recursive=True) if os.path.basename(p) in (".DS_Store", "Thumbs.db", "desktop.ini") or "__MACOSX" in p or "__pycache__" in p}
                  | {rel(p) for p in glob.glob(os.path.join(REPO, "**/.DS_Store"), recursive=True)})
    rec("no-junk-files", not junk, "no __MACOSX/.DS_Store/__pycache__/Thumbs.db" if not junk else f"junk: {junk[:5]}")

def check_json():
    bad = []
    for p in files("**/*.json"):
        try:
            json.load(open(p, encoding="utf-8"))
        except Exception as e:
            bad.append(f"{rel(p)}: {e}")
    rec("json", not bad, f"{len(files('**/*.json'))} JSON files parse" if not bad else bad[:5])

def check_schema(contracts, examples, man):
    try:
        import jsonschema
    except ImportError:
        rec("schema", False, "jsonschema not installed: Draft-07 layer cannot run (pip install jsonschema)")
        return
    ps, cs = load("schema/pagespec.schema.json"), load("schema/section-contract.schema.json")
    jsonschema.Draft7Validator.check_schema(ps); jsonschema.Draft7Validator.check_schema(cs)
    cv = jsonschema.Draft7Validator(cs)
    bad = []
    for sid, c in contracts.items():
        for e in cv.iter_errors(c):
            bad.append(f"{sid}: {'/'.join(map(str, e.absolute_path))}: {e.message[:120]}")
        try:
            jsonschema.Draft7Validator.check_schema(c["content"])
        except Exception as e:
            bad.append(f"{sid}: content is not a valid Draft-07 schema: {str(e)[:120]}")
    rec("schema-contracts", not bad, f"{len(contracts)} section contracts valid against schema/section-contract.schema.json" if not bad else bad[:5])
    pv = jsonschema.Draft7Validator(ps)
    errs = {rel(p): [e.message[:160] for e in pv.iter_errors(s)] for p, s in examples}
    n = sum(len(v) for v in errs.values())
    rec("schema-examples", n == 0, f"{len(examples)} example PageSpecs, 0 Draft-07 errors" if n == 0 else {k: v[:3] for k, v in errs.items() if v})
    rec("pagespec-version", man["pageSpecVersion"] == ps["properties"]["pageSpecVersion"]["const"], f"manifest pageSpecVersion {man['pageSpecVersion']} == schema const {ps['properties']['pageSpecVersion']['const']}")

def check_semantic(examples):
    out = []
    for p, s in examples:
        e, w = SV.validate(s)
        if e:
            out.append(f"{rel(p)}: {e[:3]}")
    rec("semantic-examples", not out, f"{len(examples)} examples, 0 semantic errors" if not out else out)

def check_allowlist(contracts, man):
    al = load("tokens/llm/component-allowlist.json")
    problems = []
    al_ids = {s["id"] for s in al["sections"]}
    if al_ids - set(contracts): problems.append(f"phantom allowlist sections: {sorted(al_ids - set(contracts))}")
    if set(contracts) - al_ids: problems.append(f"contracts missing from allowlist: {sorted(set(contracts) - al_ids)}")
    for s in al["sections"]:
        c = contracts.get(s["id"])
        if c and (s["retrievalEligible"] != c["retrievalEligible"] or s["category"] != c["semantic"]["category"] or s.get("variants") != c.get("variants")):
            problems.append(f"allowlist entry {s['id']} disagrees with its contract (retrievalEligible/category/variants)")
        if (s["id"] in RETRIEVAL_INELIGIBLE) != (s["retrievalEligible"] is False):
            problems.append(f"allowlist {s['id']} retrievalEligible={s['retrievalEligible']} violates the pinned RETRIEVAL_INELIGIBLE set")
    known = set(al["components"]) | set(al["primitives"])
    for kind in ("components", "primitives"):
        disk = {f"{kind[:-1]}.{os.path.splitext(os.path.basename(p))[0]}" for p in files(f"{kind}/*.json")}
        if set(al[kind]) != disk:
            problems.append(f"{kind}: phantom {sorted(set(al[kind]) - disk)} orphan {sorted(disk - set(al[kind]))}")
        for p in files(f"{kind}/*.json"):
            d = json.load(open(p, encoding="utf-8"))
            if d["id"] != f"{kind[:-1]}.{os.path.splitext(os.path.basename(p))[0]}":
                problems.append(f"{rel(p)} id mismatch")
            for u in d.get("composes", []):
                if u not in known: problems.append(f"{rel(p)} composes unknown {u}")
    ps = load("schema/pagespec.schema.json")
    if sorted(ps["definitions"]["node"]["properties"]) != sorted(al["nodeProperties"]): problems.append("nodeProperties != schema node properties")
    if sorted(ps["properties"]) != sorted(al["pageSpecProperties"]): problems.append("pageSpecProperties != schema properties")
    if sorted(ps["definitions"]["style"]["properties"]) != sorted(al["styleFields"]): problems.append("styleFields != schema style properties")
    if sorted(ps["definitions"]["node"]["properties"]["type"]["enum"]) != sorted(contracts): problems.append("schema node type enum != section contracts")
    roles = [r["id"] for r in load("assets/asset-roles.json")["roles"]]
    if sorted(al["assetRoles"]) != sorted(roles) or sorted(ps["definitions"]["media"]["properties"]["assetRole"]["enum"]) != sorted(roles):
        problems.append("assetRoles: allowlist / schema enum / asset-roles.json disagree")
    mp = [p["id"] for p in load("tokens/00-foundation/motion-patterns.json")["patterns"]]
    if sorted(al["motionPatterns"]) != sorted(mp): problems.append("motionPatterns: allowlist != motion-patterns.json")
    if sorted(ps["definitions"]["node"]["allOf"][0]["then"]["properties"]["motion"]["properties"]) != sorted(al["motionProperties"]): problems.append("motionProperties != schema motion properties")
    if man["allowlistVersion"] != al["version"]: problems.append(f"allowlistVersion {man['allowlistVersion']} != allowlist version {al['version']}")
    for sid, c in contracts.items():
        for u in c.get("composes", []):
            if u not in known: problems.append(f"section {sid} composes unknown {u}")
    rec("allowlist-parity", not problems, f"{len(al_ids)} sections, {len(al['components'])} components, {len(al['primitives'])} primitives, node/style/asset/motion vocabularies in parity; allowlistVersion {al['version']}" if not problems else problems[:6])

def iter_citations():
    """Yield (where, file, start, end, tag|None) for every citation in the repo."""
    for p in files("**/*.json"):
        if p.endswith("reference-copy-corpus.json"):
            continue
        d = json.load(open(p, encoding="utf-8"))
        def walk(o, path):
            if isinstance(o, dict):
                if {"file", "tag", "lines"} <= set(o) and isinstance(o["lines"], str):
                    s, e = map(int, o["lines"].split("-"))
                    yield (f"{rel(p)}{path}", o["file"], s, e, o["tag"])
                    if o.get("citation") and o["citation"] != f"{o['file']}:{o['lines']}":
                        yield (f"{rel(p)}{path}.citation", o["file"], -1, -1, "__MISMATCH__")
                    for k in ("alsoImplementedBy",):
                        for i, v in enumerate(o.get(k, [])):
                            yield from walk(v, f"{path}.{k}[{i}]")
                    return
                for k, v in o.items():
                    yield from walk(v, f"{path}.{k}")
            elif isinstance(o, list):
                for i, v in enumerate(o):
                    yield from walk(v, f"{path}[{i}]")
            elif isinstance(o, str):
                for m in CITE.finditer(o):
                    yield (f"{rel(p)}{path}", m.group(1), int(m.group(2)), int(m.group(3)), None)
        yield from walk(d, "")

def check_citations():
    cites = list(iter_citations())
    if not SIBLING:
        rec("citations", True, f"{len(cites)} citations found; sibling clone tree absent (standalone copy), range/tag checks skipped", warn=True)
        return
    bad, cache = [], {}
    for where, f, s, e, tag in cites:
        if tag == "__MISMATCH__":
            bad.append(f"{where}: citation string disagrees with file/lines"); continue
        fp = os.path.join(SRC_ROOT, f)
        if not os.path.isfile(fp):
            bad.append(f"{where}: {f} does not exist"); continue
        if f not in cache:
            cache[f] = src_text(f).split("\n")
        L = cache[f]
        if s < 1 or e < s or e > len(L):
            bad.append(f"{where}: {f}:{s}-{e} out of range (file has {len(L)} lines)"); continue
        if tag is not None and tag not in L[s - 1]:
            bad.append(f"{where}: tag {tag!r} not on {f}:{s}")
    tagged = sum(1 for c in cites if c[4] not in (None, "__MISMATCH__"))
    rec("citations", not bad, f"{len(cites)} citations ({tagged} tagged) re-read from the current sibling files: all in range, every tag on its cited start line" if not bad else bad[:8])

def check_contracts(contracts):
    problems = []
    roles = {r["id"]: r for r in load("assets/asset-roles.json")["roles"]}
    mp = {p["id"]: p for p in load("tokens/00-foundation/motion-patterns.json")["patterns"]}
    def no_maxwords(s, path=""):
        out = []
        if isinstance(s, dict):
            if s.get("type") == "string" and "enum" not in s and "pattern" not in s and "maxWords" not in s:
                out.append(path)
            for k, v in s.items():
                if isinstance(v, (dict, list)):
                    out += no_maxwords(v, f"{path}.{k}")
        elif isinstance(s, list):
            for i, v in enumerate(s):
                out += no_maxwords(v, f"{path}[{i}]")
        return out
    for p in files("sections/*.json"):
        c = json.load(open(p, encoding="utf-8")); sid = c["id"]
        if os.path.splitext(os.path.basename(p))[0] != sid: problems.append(f"{rel(p)}: filename != id")
        if c["semantic"]["id"] != sid: problems.append(f"{sid}: semantic.id != id")
        if c["source"]["id"] == c["semantic"]["id"]: problems.append(f"{sid}: source.id must differ from semantic.id")
        pinned_false = sid in RETRIEVAL_INELIGIBLE
        if pinned_false != (c["retrievalEligible"] is False):
            problems.append(f"{sid}: retrievalEligible={c['retrievalEligible']} contradicts RETRIEVAL_INELIGIBLE pin")
        if RUNTIME_UI.search(sid + " " + c["title"]) and not pinned_false:
            problems.append(f"{sid}: looks like runtime UI but is not in the RETRIEVAL_INELIGIBLE pin")
        if c["retrievalEligible"] is False and len(c.get("retrievalIneligibleReason", "")) < 30:
            problems.append(f"{sid}: retrievalIneligibleReason must be >= 30 chars")
        if set(c["motion"]["allowedPatterns"]) - set(mp): problems.append(f"{sid}: unknown motion pattern")
        fbs = {mp[x]["reducedMotionFallback"] for x in c["motion"]["allowedPatterns"] if x in mp}
        if c["motion"]["reducedMotionFallback"] not in fbs: problems.append(f"{sid}: fallback not one of its patterns' fallbacks")
        for sl in c["assetSlots"]:
            for r in sl["assetRoles"]:
                if r not in roles: problems.append(f"{sid}: unknown asset role {r}")
        for r in c["generatedAssetRoles"]:
            if PINNED_AVAILABILITY.get(r) != "generation-safe": problems.append(f"{sid}: generatedAssetRoles has non-generation-safe {r}")
        miss = no_maxwords(c["content"])
        if miss: problems.append(f"{sid}: text fields without maxWords {miss[:3]}")
    for sid in RETRIEVAL_INELIGIBLE:
        if sid not in contracts: problems.append(f"pinned runtime UI {sid} has no contract")
    if set(SV.RETRIEVAL_INELIGIBLE) != RETRIEVAL_INELIGIBLE:
        problems.append("RETRIEVAL_INELIGIBLE pin differs between verify_all.py and semantic_validate.py")
    n_false = sum(1 for c in contracts.values() if not c["retrievalEligible"])
    rec("contracts", not problems, f"{len(contracts)} contracts: ids, source/semantic split, retrieval pins ({n_false} ineligible), motion fallbacks, asset roles, maxWords on every text field" if not problems else problems[:8])

def check_asset_pins():
    ar = load("assets/asset-roles.json")
    problems = []
    reg = {r["id"]: r for r in ar["roles"]}
    if set(reg) != set(PINNED_AVAILABILITY): problems.append(f"registry roles != verify_all pins: {sorted(set(reg) ^ set(PINNED_AVAILABILITY))}")
    if SV.PINNED_AVAILABILITY != PINNED_AVAILABILITY: problems.append(f"semantic_validate PINNED_AVAILABILITY != verify_all PINNED_AVAILABILITY: {sorted(set(SV.PINNED_AVAILABILITY.items()) ^ set(PINNED_AVAILABILITY.items()))}")
    for rid, r in reg.items():
        if r["availability"] not in ar["availabilityEnum"]: problems.append(f"{rid}: availability not in closed enum")
        if PINNED_AVAILABILITY.get(rid) != r["availability"]: problems.append(f"{rid}: registry availability '{r['availability']}' != pin '{PINNED_AVAILABILITY.get(rid)}'")
        if rid in SV.PINNED_POLICY and r["generationPolicy"] != SV.PINNED_POLICY[rid]: problems.append(f"{rid}: generationPolicy '{r['generationPolicy']}' != pinned '{SV.PINNED_POLICY[rid]}'")
        if r["availability"] != "generation-safe":
            subs = r.get("generationSafeSubstitutes") or []
            if not subs: problems.append(f"{rid}: non-generation-safe role without generationSafeSubstitutes")
            for s in subs:
                if PINNED_AVAILABILITY.get(s) != "generation-safe": problems.append(f"{rid}: substitute {s} is not generation-safe")
        if rid.startswith("brand.source") and r["generationPolicy"] == "must-reuse-exact": problems.append(f"{rid}: a real wordmark may never be must-reuse-exact")
    lic = ar.get("licensing", {}).get("rule", "")
    if not ("logos" in lic and "photos" in lic and "proprietary content" in lic and "never be reproduced" in lic):
        problems.append("licensing rule must explicitly forbid reproducing real logos, people's photos and proprietary content")
    rec("asset-pins", not problems, f"{len(reg)} roles; availability pinned identically in verify_all.py and semantic_validate.py; {len(SV.PINNED_POLICY)} pinned policies; substitutes generation-safe" if not problems else problems[:6])

def recompute_catalog():
    found = {}
    col = load("tokens/00-foundation/color.json")["tokens"]
    for k, v in col.items(): found[k] = ("color", v["value"])
    for k, v in load("tokens/10-semantic/semantic.json")["tokens"].items(): found[k] = ("color", {m: x["ref"] for m, x in v.items()})
    for k, v in load("tokens/00-foundation/gradient.json")["tokens"].items(): found[k] = ("gradient", v["value"])
    ty = load("tokens/00-foundation/typography.json")
    for k, v in ty["fontFamily"].items(): found[k] = ("fontFamily", v["value"])
    for k, v in ty["fontSize"].items(): found[k] = ("fontSize", {b: v[b] for b in ("desktop", "tablet", "phone")})
    for f, t in (("spacing", "space"), ("radius", "radius"), ("elevation", "elevation"), ("breakpoint", "breakpoint")):
        for k, v in load(f"tokens/00-foundation/{f}.json")["tokens"].items(): found[k] = (t, v["value"])
    mo = load("tokens/00-foundation/motion.json")
    for k, v in mo["easing"].items(): found[k] = ("easing", v["value"])
    for k, v in mo["spring"].items(): found[k] = ("spring", v["value"])
    return found, col

def check_tokens(man):
    problems = []
    cat = load("tokens/llm/token-catalog.json"); pol = load("tokens/llm/token-policy.json")
    found, col = recompute_catalog()
    ct = cat["tokens"]
    for k, (t, v) in found.items():
        if k not in ct: problems.append(f"catalog missing {k}")
        elif ct[k]["type"] != t or ct[k]["value"] != v: problems.append(f"catalog {k} drifted from the foundation/semantic files")
    if set(ct) - set(found): problems.append(f"catalog has tokens not in the token files: {sorted(set(ct) - set(found))[:5]}")
    if cat["total"] != len(ct): problems.append("catalog total != number of tokens")
    if dict(Counter(v["type"] for v in ct.values())) != cat["counts"]: problems.append("catalog counts by type are stale")
    approved = {k for k, v in ct.items() if v["approvedForPageSpec"]}
    referenced = set(sum(pol["themeSurfaces"].values(), [])) | set(pol["sectionRhythm"]) | set(pol["approvedFonts"])
    for k in referenced:
        if k not in ct: problems.append(f"policy references unknown token {k}")
    if approved != referenced: problems.append(f"approvedForPageSpec set != tokens referenced by token-policy ({sorted(approved ^ referenced)[:5]})")
    types = {v["type"] for v in ct.values()}
    for k in pol["rawValueRestrictions"]:
        if k not in types: problems.append(f"policy rawValueRestrictions key '{k}' is not a catalog type")
    sem = load("tokens/10-semantic/semantic.json")["tokens"]
    for th in ("light", "inverse"):
        for k, v in load(f"tokens/themes/{th}.json")["tokens"].items():
            want = sem[k].get(th, sem[k]["light"])["ref"]
            if v["ref"] != want or v["ref"] not in col or col[v["ref"]]["value"] != v["value"]: problems.append(f"theme {th} {k} does not resolve to its semantic/foundation value")
    if man["tokenCatalogVersion"] != cat["version"]: problems.append("tokenCatalogVersion != token-catalog version")
    rec("tokens", not problems, f"catalog of {len(ct)} tokens == tokens/00-foundation + 10-semantic; policy references resolve; {len(approved)} approved for PageSpecs; light+inverse themes resolve" if not problems else problems[:6])
    if not SIBLING:
        rec("tokens-vs-source", True, "sibling clone tree absent (standalone copy): source drift check skipped", warn=True); return
    drift = []
    norm = lambda s: s.lower().replace(" ", "")
    def line(e):
        m = CITE.search(e); L = src_text(m.group(1)).split("\n"); s = int(m.group(2))
        return "\n".join(L[s - 1:int(m.group(3))]) if s <= len(L) else ""
    for k, v in col.items():
        if norm(v["value"]) not in norm(line(v["evidence"])): drift.append(f"{k}: {v['value']} no longer on {v['evidence']}")
    for k, v in load("tokens/00-foundation/typography.json")["fontSize"].items():
        if f"{v['desktop']['fontSize']}px" not in line(v["evidence"]): drift.append(f"{k}: {v['desktop']['fontSize']}px no longer on {v['evidence']}")
    for f in ("spacing", "radius"):
        for k, v in load(f"tokens/00-foundation/{f}.json")["tokens"].items():
            if v["value"] not in line(v["evidence"]): drift.append(f"{k}: {v['value']} no longer on {v['evidence']}")
    for k, v in load("tokens/00-foundation/motion.json")["easing"].items():
        if "cubic" in v["value"] and norm(v["value"]) not in norm(line(v["evidence"])): drift.append(f"{k}: {v['value']} no longer on {v['evidence']}")
    root = dict(re.findall(r"--(black|white|body|label):\s*(#[0-9a-f]+)", src_text("src/index.css")))
    for name, tok in (("black", "color.black"), ("white", "color.white"), ("body", "color.gray.body"), ("label", "color.gray.label")):
        if root.get(name) != col[tok]["value"]: drift.append(f"{tok}: index.css --{name} is {root.get(name)}")
    rec("tokens-vs-source", not drift, f"{len(col)} colours, type roles, spacing, radii and easing still on their cited source lines; :root vars equal" if not drift else drift[:6])

def check_source_brand():
    sb = load("schema/source-brand.json")
    if not SIBLING:
        rec("source-brand", True, "sibling clone tree absent: literal-pattern provenance check skipped", warn=True); return
    blob = "\n".join(open(p, encoding="utf-8", errors="ignore").read() for p in glob.glob(os.path.join(SRC_ROOT, "src", "**", "*.*"), recursive=True)
                     + glob.glob(os.path.join(SRC_ROOT, ".recon", "specs", "*.md")) + [os.path.join(SRC_ROOT, "CLONE_SPEC.md")])
    blob += "\n" + "\n".join(os.path.basename(p) for p in glob.glob(os.path.join(SRC_ROOT, "public", "assets", "**", "*.*"), recursive=True))
    low = blob.lower().replace(" ", " ")
    missing = []
    for k in sb["literalLists"]:
        for x in sb["patterns"][k]:
            if x.lower() not in low: missing.append(f"{k}:{x}")
    for x in sb["patterns"]["rating"]:
        if not any(ch in x for ch in "\\[(") and x.lower() not in low: missing.append(f"rating:{x}")
    for x in sb["patterns"]["pricingFigures"]:
        if str(x) not in blob: missing.append(f"pricing:{x}")
    n = sum(len(sb["patterns"][k]) for k in sb["literalLists"])
    rec("source-brand", not missing, f"{n} literal identity patterns + {len(sb['patterns']['pricingFigures'])} pricing figures all occur in the real source/specs (none invented)" if not missing else f"patterns not found in source: {missing[:6]}")

def derive_routes():
    rt = src_text("src/lib/router.js")
    static = set(re.findall(r"if \(path === '([^']+)'\)", rt))
    out = set(static)
    pj = json.loads(src_text("src/content/projects.json"))["projects"]
    fd = json.loads(src_text("src/content/feed.json"))["posts"]
    lg = re.findall(r"'([^']+)'", src_text("src/lib/legalSlugs.js"))
    if "\\/work\\/" in rt: out |= {f"/work/{p['slug']}" for p in pj}
    if "\\/feed\\/" in rt: out |= {f"/feed/{p['slug']}" for p in fd}
    if "\\/legal\\/" in rt: out |= {f"/legal/{s}" for s in lg}
    if "name: '404'" in rt: out.add("/404")
    return out

def check_routes(contracts):
    problems = []
    tpls = load("templates/templates.json")["templates"]
    routes = load("templates/routes.json")["routes"]
    seen = Counter(r["route"] for r in routes)
    for r in routes:
        if r["template"] not in tpls: problems.append(f"{r['route']}: unknown template {r['template']}")
    dup = [k for k, v in seen.items() if v > 1]
    if dup: problems.append(f"routes mapped more than once: {dup}")
    for tid, t in tpls.items():
        if sorted(t["routes"]) != sorted(r["route"] for r in routes if r["template"] == tid): problems.append(f"template {tid} routes list != routes.json")
        for n in t["nodes"]:
            sid = n["section"]
            if sid not in contracts: problems.append(f"template {tid} references unknown section {sid}")
            elif not contracts[sid]["retrievalEligible"]: problems.append(f"template {tid} places runtime UI {sid} as a node")
        for o in t.get("runtimeOverlays", []):
            if o not in RETRIEVAL_INELIGIBLE: problems.append(f"template {tid} runtimeOverlay {o} is not pinned runtime UI")
    if SIBLING:
        live = derive_routes()
        if live - set(seen): problems.append(f"route drift: served but not mapped: {sorted(live - set(seen))}")
        if set(seen) - live: problems.append(f"mapped routes no longer served: {sorted(set(seen) - live)}")
        msg = f"{len(routes)} served routes mapped exactly once to {len(tpls)} templates; == route set derived from the sibling router + CMS slugs"
    else:
        msg = f"{len(routes)} routes mapped exactly once to {len(tpls)} templates (sibling router absent: drift check skipped)"
    rec("routes", not problems, msg if not problems else problems[:6])

def check_graph():
    g = load("compatibility/graph.json")
    ids = [r["id"] for r in g["rules"]]
    ok = sorted(ids) == sorted(SV.GRAPH_RULE_IDS) and all(r["severity"] in ("error", "warn") for r in g["rules"])
    rec("graph-parity", ok, f"{len(ids)} graph rules == semantic_validate.GRAPH_RULE_IDS, each with severity" if ok else f"graph/validator mismatch {sorted(set(ids) ^ set(SV.GRAPH_RULE_IDS))}")

def recount(contracts):
    return {"tokens": len(load("tokens/llm/token-catalog.json")["tokens"]), "primitives": len(files("primitives/*.json")), "components": len(files("components/*.json")),
            "sections": len(contracts), "retrievableSections": sum(1 for c in contracts.values() if c["retrievalEligible"]),
            "templates": len(load("templates/templates.json")["templates"]), "routes": len(load("templates/routes.json")["routes"]),
            "assetRoles": len(load("assets/asset-roles.json")["roles"]), "motionPatterns": len(load("tokens/00-foundation/motion-patterns.json")["patterns"]),
            "graphRules": len(load("compatibility/graph.json")["rules"]), "examplePageSpecs": len(files("schema/example*.json")) + len(files("schema/examples/*.json"))}

def check_counts(man, contracts):
    real = recount(contracts)
    diff = {k: (man["counts"].get(k), v) for k, v in real.items() if man["counts"].get(k) != v}
    if set(man["counts"]) - set(real): diff["unknown-keys"] = sorted(set(man["counts"]) - set(real))
    rec("manifest-counts", not diff, f"manifest counts == disk {real}" if not diff else f"stale (manifest, disk): {diff}")
    readme = open(os.path.join(REPO, "README.md"), encoding="utf-8").read()
    m = re.search(r"<!-- counts:start -->(.*?)<!-- counts:end -->", readme, re.S)
    bad = []
    if not m:
        bad.append("README counts block missing")
    else:
        for k, v in real.items():
            mm = re.search(rf"\|\s*{k}\s*\|\s*(\d+)\s*\|", m.group(1))
            if not mm or int(mm.group(1)) != v: bad.append(f"{k}: README {mm.group(1) if mm else None} vs disk {v}")
    rec("readme-counts", not bad, "README counts block == disk" if not bad else bad[:5])

def check_gate():
    e, w = wrapper_gate.gate(REPO)
    rec("wrapper-gate", not e, f"0 errors, {len(w)} warnings (HERO >{wrapper_gate.HERO_WARN_PX}/{wrapper_gate.HERO_FAIL_PX}px, share >{wrapper_gate.SHARE_WARN:.0%}/{wrapper_gate.SHARE_FAIL:.0%}, viewport {wrapper_gate.REQUIRED_VIEWPORT})" if not e else e[:5])

def check_parity():
    cp = load("extraction/measured-values.json").get("cloneParity")
    if not cp or not cp.get("routes"):
        rec("clone-parity", False, "no cloneParity record (R12): run extraction/parity_harness.mjs or record 'not measured' explicitly"); return
    bad = []
    allsec = []
    for r in cp["routes"]:
        sc = [s["score"] for s in r["sections"]]
        allsec += sc
        avg = round(sum(sc) / len(sc), 4)
        if abs(avg - r["average"]) > 1e-3: bad.append(f"{r['route']}: average {r['average']} != mean of sections {avg}")
        if abs(min(sc) - r["minSection"]) > 1e-4: bad.append(f"{r['route']}: minSection stale")
        below = [f"{s['section']}#{s['instance']}" for s in r["sections"] if s["score"] < GATE]
        if r["belowGate"] != below or r["perSectionGatePass"] != (not below) or r["averageGatePass"] != (avg >= GATE): bad.append(f"{r['route']}: gate flags do not match the scores")
    o = cp["overall"]
    if o["sections"] != len(allsec) or o["sectionsBelowGate"] != sum(1 for s in allsec if s < GATE): bad.append("overall counts stale")
    passing = sum(1 for r in cp["routes"] if r["perSectionGatePass"] and r["averageGatePass"])
    rec("clone-parity", not bad, f"{len(cp['routes'])} routes / {len(allsec)} sections recorded; mean section {o['meanSectionScore']}; {o['sectionsBelowGate']} sections below {GATE}; {passing}/{len(cp['routes'])} routes pass both gates (numbers re-derived, consistent)" if not bad else bad[:5])

def check_parity_evidence():
    cp = load("extraction/measured-values.json").get("cloneParity") or {}
    ev = cp.get("evidence")
    if not ev:
        rec("parity-evidence", False, "cloneParity.evidence missing: recorded parity numbers are not pinned to tracked result files"); return
    bad = []
    def pinned(entry, what):
        path = os.path.join(REPO, entry.get("path", "")) if entry.get("path") else None
        if not path or not os.path.isfile(path):
            bad.append(f"{what}: result file {entry.get('path')!r} missing"); return None
        raw = open(path, "rb").read()
        if hashlib.sha256(raw).hexdigest() != entry.get("sha256"):
            bad.append(f"{what}: {entry['path']} sha256 does not match the recorded pin"); return None
        return json.loads(raw)
    off = pinned(ev.get("official", {}), "official")
    rep = pinned(ev.get("repeat", {}), "repeat")
    for k in ("beforeUnfrozen", "phaseEvidence"):
        for i, e in enumerate(ev.get(k, [])):
            pinned(e, f"{k}[{i}]")
    key = lambda r, s: (r["route"], s["section"], s["instance"])
    if off:
        if not (off.get("captureState") or {}).get("freeze") or off["captureState"].get("phaseMs") != 0 or off["captureState"].get("cloneSkewMs"):
            bad.append("official result file is not a symmetric freeze at phase 0 without skew")
        if off.get("captureState", {}).get("only"):
            bad.append("official result file is a filtered run (--only); it must cover every section")
        have = {key(r, s): s["score"] for r in cp["routes"] for s in r["sections"]}
        want = {key(r, s): s["score"] for r in off["routes"] for s in r["sections"]}
        if have != want:
            bad.append(f"recorded section scores differ from the official result file in {len([k for k in set(have) | set(want) if have.get(k) != want.get(k)])} sections")
        for r in cp["routes"]:
            orr = next((x for x in off["routes"] if x["route"] == r["route"]), None)
            if orr is None or orr["docHeightOriginal"] != r["docHeightOriginal"] or orr["docHeightClone"] != r["docHeightClone"]:
                bad.append(f"{r['route']}: doc heights differ from the official result file")
        o = cp["overall"]
        if o != off["overall"]:
            bad.append("cloneParity.overall differs from the official result file")
        if rep:
            tol = ev.get("repeatTolerance")
            if not isinstance(tol, (int, float)) or tol > 0.05:
                bad.append("repeatTolerance missing or looser than 0.05")
            else:
                rv = {key(r, s): s["score"] for r in rep["routes"] for s in r["sections"]}
                far = [k for k in want if abs(rv.get(k, -9) - want[k]) > tol]
                if far:
                    bad.append(f"repeat run disagrees beyond {tol} in {len(far)} sections, e.g. {far[0]}")
                if {k for k, v in rv.items() if v < GATE} != {k for k, v in want.items() if v < GATE}:
                    bad.append("repeat run and official run disagree on which sections are below the gate")
    below = {(r["route"], s["section"], s["instance"]) for r in cp["routes"] for s in r["sections"] if s["score"] < GATE}
    exc = cp.get("exceptions", [])
    for e in exc:
        if e.get("status") != "pending human approval" or e.get("approvedBy") is not None:
            bad.append(f"exception {e.get('section')}: must be status 'pending human approval' with approvedBy null")
        if (e.get("route"), e.get("section"), e.get("instance", 0)) not in below:
            bad.append(f"exception {e.get('section')} is for a section that is not below the gate (exceptions are never added to pass)")
    rec("parity-evidence", not bad, f"{len(ev.get('beforeUnfrozen', []))} before + {len(ev.get('phaseEvidence', []))} phase result files + official + repeat pinned by sha256; recorded scores == official result file; repeat within {ev.get('repeatTolerance')}; {len(exc)} exceptions" if not bad else bad[:6])

def check_parity_runs():
    mv = load("extraction/measured-values.json")
    runs = mv.get("cloneParityRuns")
    if not runs:
        rec("parity-runs", False, "cloneParityRuns missing: tablet / phone / remaining-route parity is neither measured nor listed as unmeasured"); return
    bad = []
    key = lambda r, s: (r["route"], s["section"], s["instance"])
    covered = {}                                   # route -> viewports it was measured at
    for run in runs["runs"]:
        rid = run.get("id", "?")
        def pinned(entry, what):
            path = os.path.join(REPO, entry.get("path", "")) if entry.get("path") else None
            if not path or not os.path.isfile(path):
                bad.append(f"{rid} {what}: result file {entry.get('path')!r} missing"); return None
            raw = open(path, "rb").read()
            if hashlib.sha256(raw).hexdigest() != entry.get("sha256"):
                bad.append(f"{rid} {what}: {entry['path']} sha256 does not match the recorded pin"); return None
            return json.loads(raw)
        off, rep = pinned(run.get("official", {}), "official"), pinned(run.get("repeat", {}), "repeat")
        if run.get("beforeFix"):
            pinned(run["beforeFix"], "beforeFix")
        if not off:
            continue
        cs = off.get("captureState") or {}
        if not cs.get("freeze") or cs.get("phaseMs") != 0 or cs.get("cloneSkewMs") or cs.get("only"):
            bad.append(f"{rid}: official result file is not an unfiltered symmetric freeze at phase 0 without skew")
        if off.get("viewport") != run.get("viewport"):
            bad.append(f"{rid}: recorded viewport {run.get('viewport')} != result file viewport {off.get('viewport')}")
        if off.get("gate", {}).get("perSectionMin") != GATE:
            bad.append(f"{rid}: result file gate is not {GATE}")
        have = {key(r, s): s["score"] for r in run["routes"] for s in r["sections"]}
        want = {key(r, s): s["score"] for r in off["routes"] for s in r["sections"]}
        if have != want:
            bad.append(f"{rid}: recorded section scores differ from the official result file in {len([k for k in set(have) | set(want) if have.get(k) != want.get(k)])} sections")
        for r in run["routes"]:
            orr = next((x for x in off["routes"] if x["route"] == r["route"]), None)
            if orr is None or (orr["docHeightOriginal"], orr["docHeightClone"]) != (r["docHeightOriginal"], r["docHeightClone"]):
                bad.append(f"{rid} {r['route']}: doc heights differ from the official result file")
                continue
            sc = [s["score"] for s in r["sections"]]
            if abs(round(sum(sc) / len(sc), 4) - r["average"]) > 1e-3 or abs(min(sc) - r["minSection"]) > 1e-4:
                bad.append(f"{rid} {r['route']}: average/minSection not re-derivable from its sections")
            below = [f"{s['section']}#{s['instance']}" for s in r["sections"] if s["score"] < GATE]
            if r["belowGate"] != below or r["perSectionGatePass"] != (not below) or r["averageGatePass"] != (r["average"] >= GATE):
                bad.append(f"{rid} {r['route']}: gate flags do not match the scores")
            covered.setdefault(r["route"], set()).add(run["viewport"]["width"])
        if len(run["routes"]) != len(off["routes"]):
            bad.append(f"{rid}: recorded routes ({len(run['routes'])}) != official file routes ({len(off['routes'])})")
        allsc = list(want.values())
        o = run["overall"]
        if o.get("sections") != len(allsc) or o.get("sectionsBelowGate") != sum(1 for v in allsc if v < GATE) or abs(o.get("meanSectionScore", -1) - round(sum(allsc) / len(allsc), 4)) > 1e-4:
            bad.append(f"{rid}: overall counts / mean not re-derivable")
        if rep:
            tol = run.get("repeatTolerance")
            if not isinstance(tol, (int, float)) or tol > 0.05:
                bad.append(f"{rid}: repeatTolerance missing or looser than 0.05")
            else:
                rv = {key(r, s): s["score"] for r in rep["routes"] for s in r["sections"]}
                far = [k for k in want if abs(rv.get(k, -9) - want[k]) > tol]
                if far:
                    bad.append(f"{rid}: repeat run disagrees beyond {tol} in {len(far)} sections, e.g. {far[0]}")
                if {k for k, v in rv.items() if v < GATE} != {k for k, v in want.items() if v < GATE}:
                    bad.append(f"{rid}: repeat run and official run disagree on which sections are below the gate")
                if (rep.get("captureState") or {}).get("freeze") is not True or rep.get("viewport") != run.get("viewport"):
                    bad.append(f"{rid}: repeat result file is not the same frozen viewport")
        below_all = {key(r, s) for r in run["routes"] for s in r["sections"] if s["score"] < GATE}
        for e in run.get("exceptions", []):
            if e.get("status") != "pending human approval" or e.get("approvedBy") is not None:
                bad.append(f"{rid}: exception {e.get('section')} must be status 'pending human approval' with approvedBy null")
            if (e.get("route"), e.get("section"), e.get("instance", 0)) not in below_all:
                bad.append(f"{rid}: exception {e.get('section')} is for a section that is not below the gate (never added to pass)")
    # coverage: desktop 1440 must cover every served route (the 9 representative routes live in cloneParity)
    cp = mv.get("cloneParity") or {}
    for r in cp.get("routes", []):
        covered.setdefault(r["route"], set()).add(cp.get("viewport", {}).get("width"))
    served = [r["route"] for r in load("templates/routes.json")["routes"]]
    missing = [r for r in served if 1440 not in covered.get(r, set())]
    if missing:
        bad.append(f"routes with no desktop parity measurement: {missing[:5]}")
    for r in cp.get("routes", []):
        for w in (768, 390):
            if w not in covered.get(r["route"], set()):
                bad.append(f"representative route {r['route']} has no {w}px parity measurement")
    # honesty: what is not measured must be listed and must really be unmeasured
    un = runs.get("notMeasured")
    if not isinstance(un, list) or not un:
        bad.append("cloneParityRuns.notMeasured must list what is still unmeasured")
    else:
        for u in un:
            w = u.get("viewportWidth")
            hit = [r for r in u.get("routes", []) if w in covered.get(r, set())]
            if hit:
                bad.append(f"notMeasured lists {hit[:3]} at {w}px but they are measured")
    exc = sum(len(r.get("exceptions", [])) for r in runs["runs"])
    n_sec = sum(r["overall"]["sections"] for r in runs["runs"])
    rec("parity-runs", not bad, f"{len(runs['runs'])} extra runs ({', '.join(r['id'] for r in runs['runs'])}), {n_sec} sections, each pinned to official + repeat result files; scores/doc heights == result files; every one of {len(served)} routes measured at 1440; {len(cp.get('routes', []))} representative routes also at 768 and 390; {exc} exceptions; unmeasured listed ({len(un or [])})" if not bad else bad[:6])

def check_generated_examples(examples):
    gen = {s["template"] for p, s in examples if s.get("mode") == "generated"}
    ok = "home" in gen and len(gen - {"home"}) >= 1
    rec("generated-examples", ok, f"generation-safe examples for templates {sorted(gen)}" if ok else f"missing generated examples (have {sorted(gen)})")

BOUND_POLICY = {"policyId": "n0-design-constraints-common", "policyVersion": "0.1.0", "commonIrVersion": "0.5", "enforcementMode": "hard-and-soft"}
LOCAL_EXTENSION = {"ref": "policy/design-policy.json", "policyId": "portfolio-site-web", "policyVersion": "1.0.0"}
POLICY_DOMAIN = "creative-design-studio-portfolio"

def check_design_policy(man):
    """Portfolio category + common-policy binding. Approval is pending: the check fails if any file claims a recorded decision."""
    import importlib.util
    spec = importlib.util.spec_from_file_location("policy_hash", os.path.join(REPO, "extraction", "policy_hash.py"))
    errs = []
    ph = None
    if not os.path.isfile(os.path.join(REPO, "extraction", "policy_hash.py")):
        errs.append("extraction/policy_hash.py missing")
    else:
        ph = importlib.util.module_from_spec(spec); spec.loader.exec_module(ph)
    eps = man.get("entryPoints", {})
    if eps.get("designPolicy") != LOCAL_EXTENSION["ref"]:
        errs.append("entryPoints.designPolicy must be policy/design-policy.json")
    if eps.get("policyHash") != "extraction/policy_hash.py":
        errs.append("entryPoints.policyHash must be extraction/policy_hash.py (hash script unregistered)")
    dp = man.get("designPolicy") or {}
    if man.get("category") != "portfolio":
        errs.append(f"manifest category is {man.get('category')!r}, expected 'portfolio'")
    if not dp:
        errs.append("manifest has no designPolicy binding")
    for k, v in BOUND_POLICY.items():
        if dp.get(k) != v:
            errs.append(f"designPolicy.{k} is {dp.get(k)!r}, expected {v!r}")
    if dp.get("category") != "portfolio" or dp.get("domain") != POLICY_DOMAIN or man.get("productDomain") != dp.get("domain"):
        errs.append(f"designPolicy category/domain must be portfolio / {POLICY_DOMAIN} and match the manifest")
    ext = dp.get("localExtension") or {}
    for k, v in LOCAL_EXTENSION.items():
        if ext.get(k) != v:
            errs.append(f"designPolicy.localExtension.{k} is {ext.get(k)!r}, expected {v!r}")
    if not os.path.isfile(os.path.join(REPO, LOCAL_EXTENSION["ref"])):
        errs.append("policy/design-policy.json does not exist")
    else:
        pol = load(LOCAL_EXTENSION["ref"])
        cls = pol.get("classification") or {}
        if pol.get("policyId") != LOCAL_EXTENSION["policyId"] or pol.get("policyVersion") != LOCAL_EXTENSION["policyVersion"]:
            errs.append("policy file id/version disagree with designPolicy.localExtension")
        if (pol.get("extends") or {}).get("policyId") != BOUND_POLICY["policyId"] or (pol.get("extends") or {}).get("policyVersion") != BOUND_POLICY["policyVersion"]:
            errs.append("policy file must extend n0-design-constraints-common 0.1.0")
        if cls.get("productCategory") != "portfolio" or cls.get("productDomain") != dp.get("domain"):
            errs.append("policy classification must be portfolio with the manifest domain")
        ap = pol.get("approval") or {}
        if ap.get("policyDecision") != "defined-pending-architecture-review" or ap.get("architectureDecisionRecorded") is not False:
            errs.append("policy approval must stay defined-pending-architecture-review / architectureDecisionRecorded false")
        if (dp.get("decision") or {}).get("architectureDecisionRecorded") is not False:
            errs.append("designPolicy.decision must not claim a recorded decision")
        for r in pol.get("enforcedBy", []):
            if not os.path.exists(os.path.join(REPO, r)):
                errs.append(f"policy enforcedBy {r} missing")
    if ph is not None:
        if dp.get("contentHashFiles") != ph.POLICY_FILES:
            errs.append("designPolicy.contentHashFiles != extraction/policy_hash.py POLICY_FILES")
        want = ph.compute(REPO)
        if dp.get("contentHash") != want:
            errs.append(f"designPolicy.contentHash {dp.get('contentHash')!r} != recomputed {want!r}")
    rec("design-policy", not errs, "category portfolio; bound to n0-design-constraints-common 0.1.0 (Common IR 0.5, hard-and-soft); contentHash recomputed over %d enforcing files; approval pending" % len(dp.get("contentHashFiles", [])) if not errs else errs[:6])

def main():
    man = load("registry.manifest.json")
    contracts = {}
    for p in files("sections/*.json"):
        c = json.load(open(p, encoding="utf-8")); contracts[c["id"]] = c
    examples = [(p, json.load(open(p, encoding="utf-8"))) for p in files("schema/example*.json") + files("schema/examples/*.json")]
    for name, fn in (("self-containment", lambda: check_self_containment(man)), ("json", check_json), ("schema", lambda: check_schema(contracts, examples, man)),
                     ("semantic-examples", lambda: check_semantic(examples)), ("allowlist-parity", lambda: check_allowlist(contracts, man)), ("citations", check_citations),
                     ("contracts", lambda: check_contracts(contracts)), ("asset-pins", check_asset_pins), ("tokens", lambda: check_tokens(man)), ("source-brand", check_source_brand),
                     ("routes", lambda: check_routes(contracts)), ("graph-parity", check_graph), ("counts", lambda: check_counts(man, contracts)), ("wrapper-gate", check_gate),
                     ("clone-parity", check_parity), ("parity-evidence", check_parity_evidence), ("parity-runs", check_parity_runs), ("generated-examples", lambda: check_generated_examples(examples)), ("design-policy", lambda: check_design_policy(man))):
        try:
            fn()
        except Exception as e:
            rec(name, False, f"crashed: {type(e).__name__}: {e}")
    for c, r, m in RESULTS:
        print(f"{r:4}  {c:20} {m}")
    fails = sum(1 for _, r, _ in RESULTS if r == "FAIL")
    print(f"\nverify_all: {sum(1 for _, r, _ in RESULTS if r == 'PASS')} pass, {sum(1 for _, r, _ in RESULTS if r == 'WARN')} warn, {fails} fail"
          + ("" if SIBLING else "  (standalone: sibling clone tree not present)"))
    return 1 if fails else 0

if __name__ == "__main__":
    sys.exit(main())

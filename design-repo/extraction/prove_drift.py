#!/usr/bin/env python3
"""Prove that verify_all.py catches drift: copy the repo to an OS temp dir, inject one defect per case,
run the copy's own verify_all.py, and require a non-zero exit with the expected check FAILing.

    python3 extraction/prove_drift.py [--scratch <empty dir>]

--scratch holds the throwaway copies in a directory you choose (must be empty or absent); the default is an OS temp dir.

When the clone's source tree sits next to this repo (repo/..), the scratch parent gets read-only symlinks to
it so citation, token-source, source-brand and route drift can be proven too; standalone, those cases are
reported as SKIP (the checks themselves degrade to WARN without a sibling). Never writes outside the temp dir.
Exit 1 if any case goes undetected or the unmutated copy fails.
"""
import json, os, re, shutil, subprocess, sys, tempfile
sys.dont_write_bytecode = True

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_ROOT = os.path.dirname(REPO)
SIBLING = os.path.isfile(os.path.join(SRC_ROOT, "src", "App.jsx")) and os.path.isfile(os.path.join(SRC_ROOT, "src", "lib", "router.js"))
LINKS = ("src", "public", ".recon", "CLONE_SPEC.md", "package.json", "index.html", "tailwind.config.js")

def jl(root, rel):
    with open(os.path.join(root, rel), encoding="utf-8") as f:
        return json.load(f)
def jw(root, rel, d):
    with open(os.path.join(root, rel), "w", encoding="utf-8") as f:
        json.dump(d, f, indent=2, ensure_ascii=False)
def edit(root, rel, old, new):
    p = os.path.join(root, rel); t = open(p, encoding="utf-8").read()
    if old not in t:
        raise RuntimeError(f"mutation anchor not found in {rel}: {old[:50]}")
    open(p, "w", encoding="utf-8").write(t.replace(old, new, 1))
def al_set(r, sid, **kw):
    a = jl(r, "tokens/llm/component-allowlist.json")
    for s in a["sections"]:
        if s["id"] == sid: s.update(kw)
    jw(r, "tokens/llm/component-allowlist.json", a)
def sec_set(r, sid, fn):
    d = jl(r, f"sections/{sid}.json"); fn(d); jw(r, f"sections/{sid}.json", d)
def role_set(r, rid, **kw):
    d = jl(r, "assets/asset-roles.json")
    for x in d["roles"]:
        if x["id"] == rid: x.update(kw)
    jw(r, "assets/asset-roles.json", d)

def mj(rel, fn):
    def m(r):
        d = jl(r, rel); fn(d); jw(r, rel, d)
    return m
def m_policy_hash_drift(r):
    with open(os.path.join(r, "schema", "semantic_validate.py"), "a", encoding="utf-8") as f:
        f.write("\n# drift\n")

def m_phantom(r):
    a = jl(r, "tokens/llm/component-allowlist.json"); a["sections"].append({"id": "features.phantom", "category": "FEATURES", "retrievalEligible": True}); jw(r, "tokens/llm/component-allowlist.json", a)
def m_orphan(r):
    a = jl(r, "tokens/llm/component-allowlist.json"); a["sections"] = [s for s in a["sections"] if s["id"] != "faq.questions-answered"]; jw(r, "tokens/llm/component-allowlist.json", a)
def m_alver(r):
    d = jl(r, "registry.manifest.json"); d["allowlistVersion"] = "9.9.9"; jw(r, "registry.manifest.json", d)
def m_cite_range(r):
    sec_set(r, "faq.questions-answered", lambda d: d["source"].update(lines="99990-99999", citation=d["source"]["file"] + ":99990-99999"))
def m_cite_wrongline(r):
    def f(d):
        s, e = map(int, d["source"]["lines"].split("-")); d["source"].update(lines=f"{s + 3}-{e}", citation=f"{d['source']['file']}:{s + 3}-{e}")
    sec_set(r, "listing.career-openings", f)
def m_cite_string(r):
    sec_set(r, "content.case-credits", lambda d: d["source"].update(citation=d["source"]["file"] + ":1-2"))
def m_count(r):
    d = jl(r, "registry.manifest.json"); d["counts"]["sections"] += 1; jw(r, "registry.manifest.json", d)
def m_readme(r):
    p = os.path.join(r, "README.md"); t = open(p, encoding="utf-8").read()
    open(p, "w", encoding="utf-8").write(re.sub(r"\| templates \| (\d+) \|", lambda m: f"| templates | {int(m.group(1)) + 3} |", t))
def m_avail(r):
    role_set(r, "photo.source-person", availability="generation-safe")
def m_unpin(r):
    edit(r, "schema/semantic_validate.py", '    "logo.source-partner": "blocked-for-generation",\n', "")
def m_policy(r):
    role_set(r, "photo.source-person", generationPolicy="may-generate-new")
def m_flip_overlay(r):
    def f(d):
        d["retrievalEligible"] = True; d.pop("retrievalIneligibleReason", None)
    sec_set(r, "overlay.menu-overlay", f); al_set(r, "overlay.menu-overlay", retrievalEligible=True)
def m_content_ineligible(r):
    sec_set(r, "faq.questions-answered", lambda d: d.update(retrievalEligible=False, retrievalIneligibleReason="Marked ineligible to test that a content section cannot be hidden."))
    al_set(r, "faq.questions-answered", retrievalEligible=False)
def m_runtime_name(r):
    sec_set(r, "editorial.read-more", lambda d: d.update(title="Read more ticker"))
def m_catalog(r):
    d = jl(r, "tokens/llm/token-catalog.json"); d["tokens"]["color.gray.body"]["value"] = "#454545"; jw(r, "tokens/llm/token-catalog.json", d)
def m_token_source(r):
    d = jl(r, "tokens/00-foundation/color.json"); d["tokens"]["color.gray.caption"]["value"] = "#757576"; jw(r, "tokens/00-foundation/color.json", d)
    d = jl(r, "tokens/llm/token-catalog.json"); d["tokens"]["color.gray.caption"]["value"] = "#757576"; jw(r, "tokens/llm/token-catalog.json", d)
def m_policy_key(r):
    d = jl(r, "tokens/llm/token-policy.json"); d["rawValueRestrictions"]["typography"] = "no raw fonts"; jw(r, "tokens/llm/token-policy.json", d)
def m_tokver(r):
    d = jl(r, "registry.manifest.json"); d["tokenCatalogVersion"] = "2.0.0"; jw(r, "registry.manifest.json", d)
def m_graph(r):
    d = jl(r, "compatibility/graph.json"); d["rules"] = [x for x in d["rules"] if x["id"] != "QUOTE_FOLLOWS_CHAPTER"]; jw(r, "compatibility/graph.json", d)
def m_route_drop(r):
    d = jl(r, "templates/routes.json"); d["routes"] = [x for x in d["routes"] if x["route"] != "/studio"]; jw(r, "templates/routes.json", d)
    t = jl(r, "templates/templates.json"); t["templates"]["studio"]["routes"] = []; jw(r, "templates/templates.json", t)
def m_route_extra(r):
    d = jl(r, "templates/routes.json"); d["routes"].append({"route": "/work/not-a-project", "template": "case-detail", "status": "mounted", "inSitemap": False, "evidence": "src/lib/router.js:1-1"}); jw(r, "templates/routes.json", d)
    t = jl(r, "templates/templates.json"); t["templates"]["case-detail"]["routes"].append("/work/not-a-project"); jw(r, "templates/templates.json", t)
def m_invented_person(r):
    d = jl(r, "schema/source-brand.json"); d["patterns"]["person"].append("Hans Invented"); jw(r, "schema/source-brand.json", d)
def m_wl_just(r):
    d = jl(r, "extraction/measured-values.json")
    d["wrapperWhitelist"] = [{"route": "/", "section": "hero.studio-wordmark", "maxHeightPx": 1000, "reviewedBy": "design-repo extraction agent (agent attestation, not a human sign-off)"}]
    jw(r, "extraction/measured-values.json", d)
def m_viewport(r):
    d = jl(r, "extraction/measured-values.json"); d["sectionHeights"]["viewportWidth"] = 1280; jw(r, "extraction/measured-values.json", d)
def m_unmeasured(r):
    d = jl(r, "extraction/measured-values.json"); d["sectionHeights"]["pages"] = [p for p in d["sectionHeights"]["pages"] if p["route"] != "/legal/terms-of-service"]; jw(r, "extraction/measured-values.json", d)
def m_parity(r):
    d = jl(r, "extraction/measured-values.json"); d["cloneParity"]["routes"][0]["average"] = 0.999; jw(r, "extraction/measured-values.json", d)
def _ev(r, which="official"):
    return jl(r, "extraction/measured-values.json")["cloneParity"]["evidence"][which]["path"]
def m_result_tamper(r):
    p = os.path.join(r, _ev(r)); d = jl(r, _ev(r)); d["routes"][0]["sections"][0]["score"] = 0.5; jw(r, _ev(r), d)
def m_score_consistent_edit(r):
    # a hand edit that keeps averages / minima / counts / gate flags internally consistent: only the pin can catch it
    d = jl(r, "extraction/measured-values.json"); cp = d["cloneParity"]; x = cp["routes"][0]
    x["sections"][0]["score"] = round(x["sections"][0]["score"] - 0.01, 4)
    sc = [q["score"] for q in x["sections"]]; x["average"] = round(sum(sc) / len(sc), 4); x["minSection"] = min(sc)
    allsc = [q["score"] for rr in cp["routes"] for q in rr["sections"]]; cp["overall"]["meanSectionScore"] = round(sum(allsc) / len(allsc), 4)
    jw(r, "extraction/measured-values.json", d)
def m_pin_removed(r):
    d = jl(r, "extraction/measured-values.json"); d["cloneParity"].pop("evidence"); jw(r, "extraction/measured-values.json", d)
def m_result_missing(r):
    os.unlink(os.path.join(r, _ev(r, "repeat")))
def m_freeze_off(r):
    d = jl(r, "extraction/measured-values.json"); e = d["cloneParity"]["evidence"]["official"]; f = jl(r, e["path"]); f["captureState"]["freeze"] = False
    import hashlib; jw(r, e["path"], f); e["sha256"] = hashlib.sha256(open(os.path.join(r, e["path"]), "rb").read()).hexdigest(); jw(r, "extraction/measured-values.json", d)
def m_exc_selfapproved(r):
    d = jl(r, "extraction/measured-values.json"); d["cloneParity"].setdefault("exceptions", []).append({"route": "/", "section": "media.showreel", "instance": 0, "status": "approved", "approvedBy": "agent"}); jw(r, "extraction/measured-values.json", d)
def m_exc_to_pass(r):
    d = jl(r, "extraction/measured-values.json"); d["cloneParity"].setdefault("exceptions", []).append({"route": "/", "section": "media.showreel", "instance": 0, "status": "pending human approval", "approvedBy": None}); jw(r, "extraction/measured-values.json", d)
def m_parity_gate(r):
    d = jl(r, "extraction/measured-values.json"); x = d["cloneParity"]["routes"][0]; x["belowGate"] = ["media.showreel#0"]; x["perSectionGatePass"] = False; jw(r, "extraction/measured-values.json", d)
def m_abspath(r):
    with open(os.path.join(r, "CHANGELOG.md"), "a", encoding="utf-8") as f:
        f.write("\nbuilt from " + "/Us" + "ers/someone/project\n")
def m_entry(r):
    d = jl(r, "registry.manifest.json"); d["entryPoints"]["spec"] = "../CLONE_SPEC.md"; jw(r, "registry.manifest.json", d)
def m_example(r):
    d = jl(r, "schema/examples/generated-home.pagespec.json"); d["template"] = "legal"; jw(r, "schema/examples/generated-home.pagespec.json", d)
def m_semantic_id(r):
    sec_set(r, "faq.questions-answered", lambda d: d["source"].update(id=d["semantic"]["id"]))
def m_maxwords(r):
    sec_set(r, "faq.questions-answered", lambda d: d["content"]["properties"]["heading"].pop("maxWords"))
def m_junk(r):
    open(os.path.join(r, "sections", ".DS_Store"), "w").write("x")

CASES = [  # (name, mutation, expected failing check, needs sibling source)
    ("phantom allowlist entry", m_phantom, "allowlist-parity", False),
    ("orphan contract (allowlist entry removed)", m_orphan, "allowlist-parity", False),
    ("allowlistVersion drift", m_alver, "allowlist-parity", False),
    ("citation out of range", m_cite_range, "citations", True),
    ("citation in range but wrong line (tag not on start line)", m_cite_wrongline, "citations", True),
    ("citation string disagrees with lines", m_cite_string, "citations", True),
    ("manifest count hand-bumped", m_count, "manifest-counts", False),
    ("README count stale", m_readme, "readme-counts", False),
    ("registry availability loosened", m_avail, "asset-pins", False),
    ("pin removed from the semantic validator", m_unpin, "asset-pins", False),
    ("pinned policy changed to another valid value", m_policy, "asset-pins", False),
    ("runtime UI flipped eligible in contract + allowlist together", m_flip_overlay, "contracts", False),
    ("content section marked ineligible", m_content_ineligible, "contracts", False),
    ("runtime-looking title on an eligible section", m_runtime_name, "contracts", False),
    ("token catalog value drift", m_catalog, "tokens", False),
    ("foundation + catalog drift from the real source line", m_token_source, "tokens-vs-source", True),
    ("token policy key not a catalog type", m_policy_key, "tokens", False),
    ("tokenCatalogVersion drift", m_tokver, "tokens", False),
    ("graph rule removed (validator still has it)", m_graph, "graph-parity", False),
    ("served route dropped from routes + template", m_route_drop, "routes", True),
    ("route mapped that the clone does not serve", m_route_extra, "routes", True),
    ("invented identity pattern in source-brand", m_invented_person, "source-brand", True),
    ("whitelist entry without justification", m_wl_just, "wrapper-gate", False),
    ("heights recorded at the wrong viewport", m_viewport, "wrapper-gate", False),
    ("served route missing from sectionHeights", m_unmeasured, "wrapper-gate", False),
    ("parity average hand-edited", m_parity, "clone-parity", False),
    ("parity gate flag hand-flipped", m_parity_gate, "clone-parity", False),
    ("parity result file edited (sha256 pin)", m_result_tamper, "parity-evidence", False),
    ("parity score hand-edited consistently (averages re-derived)", m_score_consistent_edit, "parity-evidence", False),
    ("parity evidence pins removed", m_pin_removed, "parity-evidence", False),
    ("parity repeat result file missing", m_result_missing, "parity-evidence", False),
    ("official parity run re-labelled as unfrozen and re-pinned", m_freeze_off, "parity-evidence", False),
    ("parity exception self-approved", m_exc_selfapproved, "parity-evidence", False),
    ("parity exception added for a passing section", m_exc_to_pass, "parity-evidence", False),
    ("absolute machine path in a doc", m_abspath, "no-absolute-paths", False),
    ("entryPoint outside the package", m_entry, "self-containment", False),
    ("junk file in the package", m_junk, "no-junk-files", False),
    ("example declares the wrong template", m_example, "semantic-examples", False),
    ("source.id equals semantic.id", m_semantic_id, "contracts", False),
    ("text field without maxWords", m_maxwords, "contracts", False),
    ("enforcing file edited without refreshing the policy hash", m_policy_hash_drift, "design-policy", False),
    ("contentHash tampered", mj("registry.manifest.json", lambda d: d["designPolicy"].update(contentHash="sha256:" + "0" * 64)), "design-policy", False),
    ("category changed away from portfolio", mj("registry.manifest.json", lambda d: d.update(category="marketplace")), "design-policy", False),
    ("category removed", mj("registry.manifest.json", lambda d: d.pop("category")), "design-policy", False),
    ("designPolicy binding removed", mj("registry.manifest.json", lambda d: d.pop("designPolicy")), "design-policy", False),
    ("bound policy version drift", mj("registry.manifest.json", lambda d: d["designPolicy"].update(policyVersion="0.2.0")), "design-policy", False),
    ("policy file missing", lambda r: os.unlink(os.path.join(r, "policy", "design-policy.json")), "design-policy", False),
    ("approval overstated as ratified", mj("policy/design-policy.json", lambda d: d["approval"].update(policyDecision="ratified", architectureDecisionRecorded=True)), "design-policy", False),
    ("policy_hash script unregistered", mj("registry.manifest.json", lambda d: d["entryPoints"].pop("policyHash")), "design-policy", False),
]

def run(root):
    p = subprocess.run([sys.executable, "-B", os.path.join(root, "design-repo", "extraction", "verify_all.py")], capture_output=True, text=True, timeout=600)
    return p.returncode, p.stdout + p.stderr

def fresh(tmp):
    root = tempfile.mkdtemp(dir=tmp)
    shutil.copytree(REPO, os.path.join(root, "design-repo"), ignore=shutil.ignore_patterns("__pycache__", "*.zip", ".DS_Store"))
    if SIBLING:
        for name in LINKS:
            if os.path.exists(os.path.join(SRC_ROOT, name)):
                os.symlink(os.path.join(SRC_ROOT, name), os.path.join(root, name))
    return root

def main():
    scratch = None
    if "--scratch" in sys.argv:
        scratch = os.path.abspath(sys.argv[sys.argv.index("--scratch") + 1])
        if os.path.isdir(scratch) and os.listdir(scratch):
            sys.exit("--scratch directory must be empty")
        os.makedirs(scratch, exist_ok=True)
    tmp = tempfile.mkdtemp(prefix="drift-", dir=scratch)
    bad = 0
    try:
        code, out = run(fresh(tmp))
        print(f"{'ok  ' if code == 0 else 'FAIL'}  baseline copy passes verify_all (exit {code})")
        if code:
            print(out[-2000:])
        bad += code != 0
        for name, fn, check, needs in CASES:
            if needs and not SIBLING:
                print(f"SKIP  {name:62} (needs the sibling clone tree)")
                continue
            root = fresh(tmp)
            fn(os.path.join(root, "design-repo"))
            code, out = run(root)
            hit = code != 0 and re.search(rf"^FAIL\s+{re.escape(check)}\b", out, re.M)
            print(f"{'ok  ' if hit else 'MISS'}  {name:62} -> {check} {'FAIL' if hit else 'not detected'} (exit {code})")
            bad += not hit
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    print(f"\nprove_drift: {len(CASES)} cases, {bad} undetected" + ("" if SIBLING else " (standalone: sibling-dependent cases skipped)"))
    return 1 if bad else 0

if __name__ == "__main__":
    sys.exit(main())

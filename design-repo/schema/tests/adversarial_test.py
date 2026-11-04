#!/usr/bin/env python3
"""Adversarial suite: every mutation must be rejected with the expected rule, every control must pass.

    python3 schema/tests/adversarial_test.py

Layers exercised: Draft-07 schema (code SCHEMA), semantic validator (rule codes), wrapper gate (R9).
Controls: every bundled example PageSpec, one synthesized generated-mode PageSpec per template (built
generically from each template's own node list, so a new template is covered automatically), and the
real measured heights through the gate. Exit 1 if any mutation is accepted or any control fails.
"""
import copy, json, os, sys
sys.dont_write_bytecode = True

HERE = os.path.dirname(os.path.abspath(__file__))
SCHEMA_DIR = os.path.dirname(HERE)
REPO = os.path.dirname(SCHEMA_DIR)
sys.path.insert(0, SCHEMA_DIR)
sys.path.insert(0, os.path.join(REPO, "extraction"))
import semantic_validate as SV  # noqa: E402
import wrapper_gate as WG       # noqa: E402

def load(rel):
    with open(os.path.join(REPO, rel), encoding="utf-8") as f:
        return json.load(f)

def codes(spec):
    out = set()
    if SV.validate_schema(spec):
        out.add("SCHEMA")
    e, _ = SV.validate(spec)
    return out | {c for c, _ in e}

PASSED, FAILED = [], []
def expect_reject(name, spec, expected):
    got = codes(spec)
    hit = got & set(expected)
    (PASSED if hit else FAILED).append(name)
    print(f"{'ok  ' if hit else 'MISS'}  reject  {name:62} expected {sorted(expected)} got {sorted(got)[:6]}")

def expect_pass(name, spec):
    se = SV.validate_schema(spec)
    e, w = SV.validate(spec)
    ok = not se and not e
    (PASSED if ok else FAILED).append(name)
    print(f"{'ok  ' if ok else 'FAIL'}  control {name:62} schema_errors={len(se)} semantic_errors={len(e)} warnings={len(w)}" + ("" if ok else f"  {se[:2]} {e[:3]}"))

# ---- generic synthesis of a generation-safe control per template --------------------------------
CTX = SV.ctx()
CONTRACTS, TEMPLATES = CTX["contracts"], CTX["templates"]
WORDS = ["quillon", "marrowby", "sablefen", "otterkin", "vellum", "brisket", "cindral", "tamsin", "orrery", "plinth"]
_n = [0]
def text(maxw):
    _n[0] += 1
    return " ".join(WORDS[(_n[0] + i) % len(WORDS)] for i in range(max(1, min(3, maxw)))).capitalize()

DEFS = load("schema/pagespec.schema.json")["definitions"]
def synth(schema):
    if "$ref" in schema:
        name = schema["$ref"].split("/")[-1]
        if name == "media":
            role = next(r for r in (schema.get("x-assetRoles") or ["photo.generated-scene"]) if SV.PINNED_AVAILABILITY[r] == "generation-safe")
            return {"assetRole": role, "assetRef": "generate:sample artwork", "alt": "Sample image"}
        if name == "cta": return {"label": "Open sample", "href": "https://brand.example/start", "style": "pill"}
        if name == "link": return {"label": "Sample link", "href": "https://brand.example/more"}
        if name == "url": return "https://brand.example/page"
        if name == "person": return {"name": "Rowan Vale", "role": "Sample role", "fictional": True}
    if "oneOf" in schema:
        return synth(schema["oneOf"][0])
    if "enum" in schema: return schema["enum"][0]
    t = schema.get("type")
    if "pattern" in schema and t == "string": return "12" if "1,2" in schema["pattern"] else "404"
    if t == "string": return text(schema.get("maxWords", 3))
    if t == "boolean": return True
    if t == "integer": return 3
    if t == "array": return [synth(schema["items"]) for _ in range(schema.get("minItems", 0))]
    if t == "object": return {k: synth(schema["properties"][k]) for k in schema.get("required", [])}
    raise ValueError(schema)

def make_node(sid, variant, i):
    c = CONTRACTS[sid]
    content = synth(c["content"])
    for f in c.get("variantRequirements", {}).get(variant, []):
        content[f] = synth(c["content"]["properties"][f])
    nd = {"id": f"n{i}", "type": sid}
    if variant: nd["variant"] = variant
    nd["content"] = content
    nd["motion"] = {"patterns": [c["motion"]["allowedPatterns"][0]], "reducedMotionFallback": c["motion"]["reducedMotionFallback"]}
    return nd

def synth_page(tid):
    t = TEMPLATES[tid]
    nodes = []
    for tn in t["nodes"]:
        if tn["required"]:
            v = (tn.get("variants") or CONTRACTS[tn["section"]].get("variants") or [None])[0]
            nodes.append(make_node(tn["section"], v, len(nodes)))
    mark = {"assetRole": "brand.placeholder-mark", "assetRef": "generate:neutral text mark", "alt": "Sample brand"}
    return {"pageSpecVersion": "1.0.0", "mode": "generated", "template": tid, "route": "/" if tid == "home" else f"/sample-{tid}",
            "brand": {"name": "Sample brand", "mark": mark, "fictional": True}, "meta": {"title": "Sample page", "description": "Synthesized control page."}, "nodes": nodes}

# ---- controls ----------------------------------------------------------------------------------
EX = {p.split(".")[0]: load(f"schema/examples/{p}") for p in sorted(os.listdir(os.path.join(REPO, "schema/examples")))}
EX["reference-home"] = load("schema/example.pagespec.json")
print("== controls")
for k, s in EX.items():
    expect_pass(f"example:{k}", s)
for tid in TEMPLATES:
    expect_pass(f"synth-generated:{tid}", synth_page(tid))

GH, GP, GL, GC, RH = EX["generated-home"], EX["generated-feed-post"], EX["generated-legal"], EX["generated-case-detail"], EX["reference-home"]
def m(base, fn):
    s = copy.deepcopy(base); fn(s); return s
def nid(s, i):
    return next(n for n in s["nodes"] if n["id"] == i)
def ctn(s, i):
    return nid(s, i)["content"]

print("== schema layer")
expect_reject("wrong enum: mode=draft", m(GH, lambda s: s.update(mode="draft")), ["SCHEMA"])
expect_reject("missing required field: meta", m(GH, lambda s: s.pop("meta")), ["SCHEMA"])
expect_reject("invented section type alias", m(GH, lambda s: nid(s, "hero").update(type="hero.invented")), ["SCHEMA", "SECTION_UNKNOWN"])
expect_reject("missing reducedMotionFallback", m(GH, lambda s: nid(s, "hero")["motion"].pop("reducedMotionFallback")), ["SCHEMA", "MOTION_MISSING_FALLBACK"])
expect_reject("invented motion field", m(GH, lambda s: nid(s, "hero")["motion"].update(inventedAnimation="spin")), ["SCHEMA", "MOTION_UNKNOWN_FIELD"])
expect_reject("wrong reducedMotionFallback value", m(GH, lambda s: nid(s, "hero")["motion"].update(reducedMotionFallback="hidden")), ["SCHEMA", "MOTION_FALLBACK_MISMATCH"])
expect_reject("motion pattern not allowed for section", m(GH, lambda s: nid(s, "hero")["motion"]["patterns"].append("auto-scroll-columns")), ["SCHEMA", "MOTION_PATTERN_NOT_ALLOWED"])
expect_reject("invented assetRole", m(GH, lambda s: ctn(s, "hero")["stack"][0].update(assetRole="image")), ["SCHEMA", "ASSET_ROLE_UNKNOWN"])
expect_reject("asset role not allowed for field", m(GH, lambda s: ctn(s, "hero")["stack"][0].update(assetRole="person.fictional-portrait")), ["SCHEMA", "ASSET_ROLE_NOT_ALLOWED_FOR_FIELD"])
expect_reject("extra content property", m(GH, lambda s: ctn(s, "hero").update(sparkle="x")), ["SCHEMA"])
expect_reject("pageSpecVersion drift", m(GH, lambda s: s.update(pageSpecVersion="0.9.0")), ["SCHEMA"])
expect_reject("variant on a variant-less section", m(GH, lambda s: nid(s, "hero").update(variant="tall")), ["SCHEMA", "VARIANT_UNKNOWN"])

print("== structure (template cross-reference + graph)")
expect_reject("declared template contradicts nodes (home nodes, template=legal)", m(GH, lambda s: s.update(template="legal")), ["TEMPLATE_MISSING_REQUIRED", "TEMPLATE_ORDER", "TEMPLATE_UNEXPECTED_NODE"])
expect_reject("required template node removed (services)", m(GH, lambda s: s["nodes"].remove(nid(s, "services"))), ["TEMPLATE_MISSING_REQUIRED"])
expect_reject("duplicate one-per-page hero", m(GH, lambda s: s["nodes"].insert(2, dict(copy.deepcopy(nid(s, "hero")), id="hero-2"))), ["ONE_HERO", "TEMPLATE_REPEAT_NOT_ALLOWED", "ONE_PER_PAGE"])
expect_reject("fixed-position sections reordered", m(GH, lambda s: s["nodes"].__setitem__(slice(2, 4), [s["nodes"][3], s["nodes"][2]])), ["TEMPLATE_ORDER", "TEMPLATE_MISSING_REQUIRED"])
expect_reject("footer not last", m(GH, lambda s: s["nodes"].append(s["nodes"].pop(-2))), ["SHELL_POSITION", "TEMPLATE_ORDER"])
expect_reject("nav layer not first", m(GH, lambda s: s["nodes"].insert(1, s["nodes"].pop(0))), ["SHELL_POSITION", "TEMPLATE_MISSING_REQUIRED"])
expect_reject("footer dropped on a template that requires it", m(GP, lambda s: s["nodes"].pop()), ["SHELL_POSITION", "TEMPLATE_MISSING_REQUIRED"])
expect_reject("home-only hero on another route", m(GH, lambda s: s.update(route="/landing")), ["HOME_ROUTE_ONLY"])
expect_reject("variant not allowed by template (page-title form on home)", m(GH, lambda s: nid(s, "contact").update(variant="page-title")), ["TEMPLATE_VARIANT_NOT_ALLOWED"])
expect_reject("variant-required field missing (work title without hint)", m(synth_page("work-index"), lambda s: s["nodes"][1]["content"].pop("hint")), ["VARIANT_FIELDS"])
expect_reject("pull quote not after a chapter", m(GP, lambda s: s["nodes"].insert(2, s["nodes"].pop(4))), ["QUOTE_FOLLOWS_CHAPTER", "TEMPLATE_ORDER"])
expect_reject("legal clauses split by another node", m(GL, lambda s: s["nodes"].insert(3, dict(copy.deepcopy(nid(s, "faq")), id="faq-2"))), ["LEGAL_CLAUSES_FOLLOW_HEADER", "TEMPLATE_ORDER", "ONE_PER_PAGE"])
expect_reject("runtime overlay placed as a node", m(GH, lambda s: s["nodes"].insert(2, dict(make_node("overlay.menu-overlay", None, 98), id="menu"))), ["OVERLAY_NOT_A_NODE"])
expect_reject("cursor placed as a node", m(GH, lambda s: s["nodes"].insert(2, dict(make_node("utility.custom-cursor", None, 97), id="cur"))), ["OVERLAY_NOT_A_NODE"])
expect_reject("reference page on a route its template does not serve", m(RH, lambda s: s.update(route="/studio")), ["ROUTE_TEMPLATE_MISMATCH"])
expect_reject("hero added to a heroless template (contacts)", m(synth_page("contacts"), lambda s: s["nodes"].insert(1, make_node("hero.legal-header", None, 96))), ["ONE_HERO", "TEMPLATE_UNEXPECTED_NODE", "TEMPLATE_ORDER", "TEMPLATE_MISSING_REQUIRED"])
expect_reject("duplicate node id", m(GH, lambda s: s["nodes"][2].update(id=s["nodes"][1]["id"])), ["NODE_ID_DUPLICATE"])
expect_reject("too many marked chapters", m(GC, lambda s: s["nodes"].insert(3, dict(copy.deepcopy(nid(s, "ch-1")), id="ch-x"))), ["ONE_PER_PAGE", "TEMPLATE_ORDER", "NO_CONSECUTIVE_SAME_SECTION"])

print("== runtime word budgets")
expect_reject("maxWords overflow: hero intro", m(GH, lambda s: ctn(s, "hero").update(intro=" ".join(["word"] * 60))), ["MAX_WORDS"])
expect_reject("maxWords overflow: nested FAQ answer", m(GH, lambda s: ctn(s, "faq")["items"][0].update(answer=" ".join(["word"] * 80))), ["MAX_WORDS"])
expect_reject("maxWords overflow: CTA label", m(GH, lambda s: ctn(s, "faq")["cta"].update(label="Please write to us about anything at all")), ["MAX_WORDS"])
expect_reject("maxWords overflow: legal list item", m(GL, lambda s: ctn(s, "clause-1")["blocks"][1]["listItems"].append(" ".join(["term"] * 40))), ["MAX_WORDS"])

print("== generated-mode leakage (R2)")
expect_reject("source brand in copy", m(GH, lambda s: ctn(s, "statement").update(headline="Mobius builds calm rooms for everyone.")), ["GENERATED_MODE_BRAND"])
expect_reject("source brand with diacritic and mark", m(GH, lambda s: ctn(s, "nav").update(logoText="Möbius®")), ["GENERATED_MODE_BRAND"])
expect_reject("source brand as page brand", m(GH, lambda s: s["brand"].update(name="MÖBIUS")), ["GENERATED_MODE_BRAND"])
expect_reject("brand not marked fictional", m(GH, lambda s: s["brand"].update(fictional=False)), ["GENERATED_MODE_BRAND"])
expect_reject("source wordmark asset role", m(GH, lambda s: s["brand"]["mark"].update(assetRole="brand.source-wordmark")), ["GENERATED_MODE_ASSET", "GENERATED_MODE_BRAND"])
expect_reject("template platform/author credit", m(GH, lambda s: ctn(s, "footer").update(legalLine="Template by Anton Drukarov.")), ["GENERATED_MODE_BRAND", "GENERATED_MODE_PERSON"])
expect_reject("partner logo asset (blocked)", m(GH, lambda s: ctn(s, "hero")["stack"][0].update(assetRole="logo.source-partner")), ["GENERATED_MODE_ASSET", "SCHEMA"])
expect_reject("store mark + store URL", m(GH, lambda s: ctn(s, "faq")["cta"].update(label="Get it on Google Play", href="https://play.google.com/store/apps")), ["GENERATED_MODE_STORE", "GENERATED_MODE_URL"])
expect_reject("source award claim", m(GH, lambda s: ctn(s, "statement").update(headline="Winner of Red Dot and Site of the Day.")), ["GENERATED_MODE_RATING"])
expect_reject("rating claim", m(GH, lambda s: ctn(s, "statement").update(headline="Rated 4.9 out of 5 by our clients.")), ["GENERATED_MODE_RATING"])
expect_reject("source team member name", m(GH, lambda s: ctn(s, "reflections")["slides"][0]["person"].update(name="Jonas Richter")), ["GENERATED_MODE_PERSON"])
expect_reject("source testimonial client + company", m(GH, lambda s: ctn(s, "reflections")["slides"][0]["person"].update(name="Clara Jensen", role="Vela Studio")), ["GENERATED_MODE_PERSON", "GENERATED_MODE_BRAND"])
expect_reject("person not marked fictional", m(GH, lambda s: ctn(s, "reflections")["slides"][0]["person"].update(fictional=False)), ["GENERATED_MODE_PERSON"])
expect_reject("real person photo asset", m(GH, lambda s: ctn(s, "reflections")["slides"][0]["photo"].update(assetRole="photo.source-person")), ["GENERATED_MODE_PERSON", "GENERATED_MODE_ASSET"])
expect_reject("source domain URL", m(GH, lambda s: ctn(s, "faq")["cta"].update(href="https://mobius.framer.website/contacts")), ["GENERATED_MODE_URL", "GENERATED_MODE_BRAND"])
expect_reject("author link shortener URL", m(GH, lambda s: ctn(s, "footer")["columns"][0]["links"][0].update(href="https://framer.link/drukarov")), ["GENERATED_MODE_URL", "GENERATED_MODE_BRAND"])
expect_reject("non-placeholder domain", m(GH, lambda s: ctn(s, "faq")["cta"].update(href="https://tallowreed.com/hello")), ["GENERATED_MODE_URL"])
expect_reject("source CMS slug reused", m(GP, lambda s: ctn(s, "more")["cards"][0].update(href="/journal/the-logic-of-emotion")), ["GENERATED_MODE_URL"])
expect_reject("source email", m(GC, lambda s: ctn(s, "credits")["liveCta"].update(href="mailto:hello@mobius.studio")), ["GENERATED_MODE_URL", "GENERATED_MODE_CONTACT", "GENERATED_MODE_BRAND"])
expect_reject("source address / location", m(GL, lambda s: ctn(s, "clause-3")["blocks"][0].update(paragraph="Visit us at Schwedter Straße 112 in Berlin.")), ["GENERATED_MODE_CONTACT"])
expect_reject("source copy reused verbatim (6-word run)", m(GH, lambda s: ctn(s, "statement")["paragraphs"].__setitem__(0, "We stay small by choice, keeping the process open and honest.")), ["GENERATED_MODE_COPY"])
expect_reject("source marketing phrase", m(GH, lambda s: ctn(s, "reflections").update(heading="Client reflections")), ["GENERATED_MODE_COPY"])
expect_reject("source project name", m(GC, lambda s: ctn(s, "intro").update(name="Golden Hour")), ["GENERATED_MODE_COPY"])
expect_reject("source post title", m(GP, lambda s: ctn(s, "header").update(title="Systems with Soul")), ["GENERATED_MODE_COPY"])
expect_reject("source pricing figure", m(GH, lambda s: ctn(s, "pricing")["plans"][0].update(monthly=6500)), ["GENERATED_MODE_COPY"])
expect_reject("source CTA", m(GH, lambda s: ctn(s, "faq")["cta"].update(label="Join Us")), ["GENERATED_MODE_CTA"])
expect_reject("brand-bearing CTA", m(GH, lambda s: ctn(s, "contact")["fields"][0].update(leadIn="Hey Möbius, I am")), ["GENERATED_MODE_CTA", "GENERATED_MODE_BRAND"])
expect_reject("proprietary media reuse (ref: assetRef)", m(GH, lambda s: ctn(s, "hero")["stack"][0].update(assetRole="photo.source-project", assetRef="ref:public/assets/img/91tSqsa2UCoJo8t9Pw7JOunYw.jpg")), ["GENERATED_MODE_ASSET"])
expect_reject("source asset id behind a generation-safe role", m(GH, lambda s: ctn(s, "hero")["stack"][0].update(assetRef="generate:recolour ZdoJlTXzsfF4jck8jdi8x8jmQN8")), ["GENERATED_MODE_ASSET"])
expect_reject("source reel video", m(GH, lambda s: s["nodes"].insert(3, {"id": "reel", "type": "media.showreel", "content": {"tickerText": "Rooms in Light.", "video": {"assetRole": "media.source-reel", "assetRef": "ref:public/assets/video/k5BuF5agb7jRFUwK2jzQ0zjqjro.mp4", "alt": "Reel"}, "poster": {"assetRole": "photo.generated-scene", "assetRef": "generate:poster", "alt": "Poster"}}, "motion": {"patterns": ["video-autoplay"], "reducedMotionFallback": "paused-first-frame"}})), ["GENERATED_MODE_ASSET"])
print("== reference mode still accepts real content (control)")
expect_pass("reference home with real brand, people, assets", RH)

print("== token policy (R10)")
def sty(i, **kw):
    return lambda s: nid(s, i).setdefault("style", {}).update(**kw)
expect_reject("unknown token", m(GH, sty("services", surface="color.brand.9000")), ["TOKEN_UNKNOWN"])
expect_reject("raw hex colour", m(GH, sty("services", surface="#ff0000")), ["TOKEN_RAW_COLOR"])
expect_reject("raw rgb colour in copy", m(GH, lambda s: ctn(s, "statement").update(headline="Rooms in rgb(255,0,0)")), ["TOKEN_RAW_COLOR"])
expect_reject("arbitrary spacing (px)", m(GH, sty("services", paddingTop="37px")), ["TOKEN_ARBITRARY_SPACING"])
expect_reject("spacing token outside section rhythm", m(GH, sty("services", paddingBottom="space.15")), ["TOKEN_ARBITRARY_SPACING"])
expect_reject("unsupported font (catalogued, not approved)", m(GH, sty("services", headingFont="font.text")), ["TOKEN_UNSUPPORTED_FONT"])
expect_reject("unsupported font (not in catalog)", m(GH, sty("services", headingFont="font.comic")), ["TOKEN_UNSUPPORTED_FONT"])
expect_reject("invalid theme/token combination (black surface on light)", m(GH, sty("services", surface="color.black")), ["TOKEN_THEME_MISMATCH"])
expect_reject("token not approved for PageSpecs", m(GH, sty("services", surface="color.gray.numeral")), ["TOKEN_NOT_APPROVED"])
expect_reject("theme not allowed for section", m(GH, sty("services", theme="inverse", surface="color.black")), ["THEME_NOT_ALLOWED_FOR_SECTION"])
expect_pass("control: approved surface + rhythm + font", m(GH, sty("services", surface="color.surface.field", paddingTop="space.200", headingFont="font.display")))

print("== wrapper gate (R9)")
MV = load("extraction/measured-values.json")
def gate(mut):
    mv = copy.deepcopy(MV); mut(mv); return WG.gate(REPO, mv)
def page(mv, route):
    return next(p for p in mv["sectionHeights"]["pages"] if p["route"] == route)
def sec(mv, route, sid, inst=0):
    return next(s for s in page(mv, route)["sections"] if s["section"] == sid and s["instance"] == inst)
WL = {"route": "/", "section": "hero.studio-wordmark", "maxHeightPx": 3300, "reviewedBy": "design-repo extraction agent (agent attestation, not a human sign-off)",
      "justification": "Synthetic test entry: a pinned scroll-runway hero would legitimately exceed 3000px of scroll distance."}
def tall_wl(mv, **kw):
    sec(mv, "/", "hero.studio-wordmark").update(heightPx=3100); mv["wrapperWhitelist"] = [dict(WL, **kw)]
def expect_gate(name, mut, err=None, warn=None, match=None):
    e, w = gate(mut)
    ec, wc = {c for c, _ in e}, {c for c, _ in w}
    ok = (err in ec) if err else (not e and (warn in wc if warn else True))
    if ok and match:
        ok = any(match in msg for _, msg in (e if err else w))
    (PASSED if ok else FAILED).append(name)
    print(f"{'ok  ' if ok else 'MISS'}  gate    {name:62} errors={sorted(ec)} warnings={sorted(wc)}")
expect_gate("control: real measured heights", lambda mv: None)
expect_gate("HERO 1900px warns only", lambda mv: sec(mv, "/", "hero.studio-wordmark").update(heightPx=1900), warn="HERO_TALL", match="/ hero.studio-wordmark")
expect_gate("HERO 3100px fails", lambda mv: sec(mv, "/", "hero.studio-wordmark").update(heightPx=3100), err="HERO_TOO_TALL")
expect_gate("whitelisted tall HERO still warns", tall_wl, warn="HERO_TALL", match="(whitelisted)")
expect_gate("section holding 65% of a page fails", lambda mv: sec(mv, "/studio", "team.studio-team").update(heightPx=0.65 * page(mv, "/studio")["docHeightPx"]), err="SECTION_DOMINATES_PAGE")
expect_gate("section holding 55% of a page warns", lambda mv: sec(mv, "/studio", "team.studio-team").update(heightPx=0.55 * page(mv, "/studio")["docHeightPx"]), warn="SECTION_LARGE_SHARE", match="/studio team.studio-team")
expect_gate("whitelist entry missing justification", lambda mv: (tall_wl(mv), mv["wrapperWhitelist"][0].pop("justification")), err="WHITELIST_INVALID")
expect_gate("whitelist justification under 30 chars", lambda mv: tall_wl(mv, justification="tall but fine"), err="WHITELIST_INVALID")
expect_gate("agent reviewer without attestation", lambda mv: tall_wl(mv, reviewedBy="extraction agent"), err="WHITELIST_INVALID")
expect_gate("stale whitelist (cap below measured)", lambda mv: tall_wl(mv, maxHeightPx=3000), err="WHITELIST_STALE")
expect_gate("whitelist entry matching no measurement", lambda mv: mv.update(wrapperWhitelist=[dict(WL, route="/nowhere")]), err="WHITELIST_STALE")
expect_gate("missing measurement for a served route", lambda mv: mv["sectionHeights"]["pages"].remove(page(mv, "/contacts")), err="MISSING_MEASUREMENT")
expect_gate("height removed from a required row", lambda mv: sec(mv, "/404", "hero.not-found").update(heightPx=None), err="MISSING_MEASUREMENT")
expect_gate("measured at the wrong viewport", lambda mv: mv["sectionHeights"].update(viewportWidth=1280), err="WRONG_VIEWPORT")

print(f"\nadversarial: {len(PASSED)} passed, {len(FAILED)} failed")
if FAILED:
    print("FAILED:", FAILED)
sys.exit(1 if FAILED else 0)

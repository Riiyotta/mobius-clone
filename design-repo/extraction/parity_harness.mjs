// Live-original vs clone visual parity harness (R12). Optional tool: verify_all.py reads its recorded output
// (extraction/measured-values.json -> cloneParity) but never runs it.
//
//   PLAYWRIGHT_MODULE=<playwright> ORIGINAL_URL=https://mobius.framer.website CLONE_URL=http://localhost:5194 \
//     node extraction/parity_harness.mjs --out <file.json> [--routes /,/studio] [--width 1440 --height 900]
//       [--freeze on|off] [--phase <ms>] [--skew <ms>] [--only <section ids, comma separated>] [--geometry] [--dump <dir>]
//
// Method: both sites at the same viewport. Section boundaries come from the CLONE (section-selectors.json).
// Each section is sampled at the same scroll offsets on both sites (its top, then +1 viewport, max 3 shots per
// section). Scrolling is stepped (450px) so in-view effects fire on both; each shot waits for motion to settle
// (3.5s at offset 0 for the hero entrance, 1.8s otherwise). Similarity = share of pixels whose max RGB channel
// difference is <= 40 (0..1). Section score = mean of its shots; page score = mean of its sections.
// Gate: every section >= 0.80 AND page average >= 0.80.
//
// Capture state (--freeze on, the default; --freeze off reproduces the pre-1.1.1 unfrozen capture). After the scroll
// + settle wait and immediately before each screenshot, the SAME freeze runs on the live page and on the clone:
//   0. wait for fonts, every <img> and every CSS background image to finish loading and decoding (8 s cap each, viewport-visible elements only); repeated after
//      the pins below (400 ms later, then polled until every visible <img> has pixels) because pinning moves lazy-loaded marquee images into view.
//   1. every <video>: paused, loop off, seeked to PHASE ms (default 0 = first frame) and the 'seeked' event awaited
//      (plus two animation frames so the decoded frame is presented). Nothing is hidden or masked.
//   2. CSS animations / transitions / WAAPI (document.getAnimations()): infinite ones are paused at currentTime = PHASE,
//      finite ones are finished (their end state, the same state the settle wait already reaches).
//   3. (re-done at every shot) script-driven marquees / tickers / auto-scrolling columns: any element whose computed translation keeps changing
//      across three samples 250 ms apart (the page is stationary, so only time-based motion qualifies) is pinned to
//      translate(vx*PHASE, vy*PHASE) with !important, i.e. its start position (PHASE 0 = translate 0) shifted by the
//      velocity measured on that same side, after aligning the track's first item (DOM order) with the track's start edge.
//      That alignment is translate 0 for a plain track; the live site's wrap-style tickers move items that left the view
//      to the far end with per-item offsets, so for them "translate 0" alone would show a blank/rotated strip.
//      Content is not removed or replaced.
// Not frozen: the 10 s testimonial autoplay carousel (it does not move continuously; if its slide advanced between
// the two captures the score drops honestly) and hover/drag states. The consent banner / Framer badge are
// position-fixed overlays; the badge is hidden on both sides, no banner is ever clicked.
// --phase <ms> selects a different freeze phase (used to show the score depends on animation phase, not layout).
// --skew <ms> is a diagnostic: it puts the clone side that many ms out of phase (never used for the recorded numbers).
// --geometry also records text-free geometry (media rects, text rows) per section and reports how well it matches.
// --dump <dir> writes live / clone / diff PNGs per shot for diagnosis (local scratch only; never commit them).
import { createRequire } from 'module'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const HERE = path.dirname(fileURLToPath(import.meta.url))
const REPO = path.dirname(HERE)
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d }
const W = +arg('--width', 1440), H = +arg('--height', 900)
const ORIG = process.env.ORIGINAL_URL || 'https://mobius.framer.website'
const CLONE = process.env.CLONE_URL || 'http://localhost:5194'
const OUT = arg('--out', null)
const FREEZE = arg('--freeze', 'on') !== 'off', PHASE = +arg('--phase', 0)
const ONLY = (arg('--only', null) || '').split(',').filter(Boolean)
const SKEW = +arg('--skew', 0) // DIAGNOSTIC ONLY: extra phase applied to the clone side so the two sides are deliberately out of phase
const GEO = process.argv.includes('--geometry')
const DUMP = arg('--dump', null)
const DEFAULT = ['/', '/work', '/work/soma-studio', '/studio', '/contacts', '/feed', '/feed/beyond-function', '/legal/privacy-policy', '/404']
const ROUTES = (arg('--routes', null) || DEFAULT.join(',')).split(',')
const SEL = JSON.parse(fs.readFileSync(path.join(HERE, 'section-selectors.json')))
const RT = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(REPO, 'templates/routes.json'))).routes.map((r) => [r.route, r.template]))
const THRESH = 40, GATE = 0.8

const b = await chromium.launch()
const cmp = await b.newPage()
async function similarity(A, B) {
  return cmp.evaluate(async ([a, z, T, wantDiff]) => {
    const load = (s) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = s })
    const [ia, ib] = await Promise.all([load(a), load(z)])
    const w = Math.min(ia.width, ib.width), h = Math.min(ia.height, ib.height)
    const c = document.createElement('canvas'); c.width = w; c.height = h
    const x = c.getContext('2d'); x.drawImage(ia, 0, 0); const da = x.getImageData(0, 0, w, h).data
    x.clearRect(0, 0, w, h); x.drawImage(ib, 0, 0); const db = x.getImageData(0, 0, w, h).data
    let same = 0
    const out = x.createImageData(w, h)
    for (let i = 0; i < da.length; i += 4) {
      const ok = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2])) <= T
      if (ok) same++
      out.data[i] = ok ? db[i] * 0.3 + 178 : 255; out.data[i + 1] = ok ? db[i + 1] * 0.3 + 178 : 0; out.data[i + 2] = ok ? db[i + 2] * 0.3 + 178 : 0; out.data[i + 3] = 255
    }
    let diff = null
    if (wantDiff) { x.putImageData(out, 0, 0); diff = c.toDataURL('image/png').split(',')[1] }
    return { score: same / (w * h), diff }
  }, ['data:image/png;base64,' + A.toString('base64'), 'data:image/png;base64,' + B.toString('base64'), THRESH, !!DUMP])
}

async function open(base, route) {
  const p = await b.newPage({ viewport: { width: W, height: H } })
  await p.goto(base + route, { waitUntil: 'networkidle', timeout: 90000 })
  await p.addStyleTag({ content: '#__framer-badge-container{display:none!important}' }).catch(() => {})
  p.__y = 0
  return p
}
async function goTo(p, y) {
  const step = y >= p.__y ? 450 : -450
  for (let v = p.__y; step > 0 ? v < y : v > y; v += step) { await p.evaluate((v) => scrollTo(0, v), v); await p.waitForTimeout(90) }
  await p.evaluate((y) => scrollTo(0, y), y)
  p.__y = y
}

// Symmetric freeze (see header). Runs inside the page; returns what it pinned so the result file can record it.
async function freezePage(p, phase) {
  return p.evaluate(async (ph) => {
    const info = { videos: 0, videoSeeks: [], animsPaused: 0, animsFinished: 0, movers: [] }
    const raf = () => new Promise((r) => requestAnimationFrame(() => r()))
    // fonts, <img> elements and CSS background images must be loaded and decoded (8 s cap each, viewport-visible elements only). Runs once before sampling
    // and again after the pins are applied: pinning moves marquee items into view, and lazy-loaded images start loading
    // only then (a live-site image that had not painted yet scored a section 0.26 before this second pass existed).
    const cap = (pr) => Promise.race([pr, new Promise((r) => setTimeout(r, 8000))])
    const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth }
    const assets = async () => { // only what is in the viewport: that is all the screenshot contains
      await cap(document.fonts.ready)
      await cap(Promise.all([...document.images].filter(vis).map((i) => (i.complete ? i.decode().catch(() => {}) : new Promise((r) => { i.onload = i.onerror = r })))))
      const bg = new Set()
      for (const e of document.body.querySelectorAll('*')) { const m = vis(e) && /url\("?([^")]+)"?\)/.exec(getComputedStyle(e).backgroundImage); if (m && !m[1].startsWith('data:')) bg.add(m[1]) }
      await cap(Promise.all([...bg].map((u) => new Promise((r) => { const i = new Image(); i.onload = i.onerror = r; i.src = u }))))
    }
    await assets()
    // 3. movers. Pins from an earlier shot are released first: the page's own ticker code keeps running underneath a pin, so an old
    // pin goes stale (items wrapped to the far end meanwhile). Sample translations of every element three times, 250 ms apart
    for (const e of document.querySelectorAll('[data-parity-frozen]')) { e.removeAttribute('data-parity-frozen'); e.style.removeProperty('--pf-x'); e.style.removeProperty('--pf-y') }
    const els = [...document.querySelectorAll('body *')]
    const sample = () => els.map((e) => { const m = new DOMMatrix(getComputedStyle(e).transform); return [m.m41, m.m42] })
    const stamp = (f) => { const a = performance.now(), r = f(); return [(a + performance.now()) / 2, r] } // midpoint of the sampling pass
    const [t0, s0] = stamp(sample)
    await new Promise((r) => setTimeout(r, 250)); const [t1, s1] = stamp(sample)
    await new Promise((r) => setTimeout(r, 250)); const [t2, s2] = stamp(sample)
    if (!document.getElementById('parity-freeze-css')) {
      const st = document.createElement('style'); st.id = 'parity-freeze-css'
      st.textContent = '[data-parity-frozen]{transform:translate(var(--pf-x,0px),var(--pf-y,0px))!important;transition:none!important}'
      document.head.appendChild(st)
    }
    const pins = []
    let n = 0
    els.forEach((e, i) => {
      const d1 = [s1[i][0] - s0[i][0], s1[i][1] - s0[i][1]], d2 = [s2[i][0] - s1[i][0], s2[i][1] - s1[i][1]]
      const mv = (d) => Math.abs(d[0]) > 1 || Math.abs(d[1]) > 1
      if (!(mv(d1) && mv(d2))) return
      const v1 = d1.map((x) => x * 1000 / (t1 - t0)), v2 = d2.map((x) => x * 1000 / (t2 - t1))
      const v = Math.hypot(...v1) <= Math.hypot(...v2) ? v1 : v2 // the smaller one is never a loop wrap
      e.setAttribute('data-parity-frozen', String(++n)); e.style.setProperty('--pf-x', '0px'); e.style.setProperty('--pf-y', '0px')
      pins.push([e, v])
    })
    // Start state of a track: its FIRST item (DOM order) sits on the track's own start edge along the motion axis. Wrap-style
    // tickers (the live site's) move items that left the view to the far end with per-item offsets, so "track translate 0"
    // alone is not a start state there; aligning the first item is, and it is also translate 0 for a plain track.
    const base = pins.map(([e, v]) => { const r = e.getBoundingClientRect(), f = e.firstElementChild?.getBoundingClientRect(); return [Math.abs(v[0]) > Math.abs(v[1]) && f ? r.left - f.left : 0, Math.abs(v[1]) >= Math.abs(v[0]) && f ? r.top - f.top : 0] })
    pins.forEach(([e, v], k) => {
      e.style.setProperty('--pf-x', (base[k][0] + v[0] * ph / 1000).toFixed(2) + 'px'); e.style.setProperty('--pf-y', (base[k][1] + v[1] * ph / 1000).toFixed(2) + 'px')
      const r = e.getBoundingClientRect()
      info.movers.push({ el: e.tagName.toLowerCase() + '.' + String(e.className).split(' ')[0], vx: +v[0].toFixed(1), vy: +v[1].toFixed(1), firstItemAlignPx: [+base[k][0].toFixed(1), +base[k][1].toFixed(1)], widthPx: Math.round(r.width), heightPx: Math.round(r.height) })
    })
    // 2. CSS / WAAPI
    for (const a of document.getAnimations()) {
      try {
        if (a.effect && a.effect.getComputedTiming().iterations === Infinity) { a.pause(); a.currentTime = ph; info.animsPaused++ } else { a.finish(); info.animsFinished++ }
      } catch {}
    }
    // 1. videos
    for (const v of document.querySelectorAll('video')) {
      info.videos++
      v.loop = false; v.pause()
      if (v.readyState < 1) await new Promise((r) => { v.addEventListener('loadedmetadata', r, { once: true }); v.load(); setTimeout(r, 6000) })
      const t = Math.min(ph / 1000, Math.max(0, (v.duration || 1) - 0.05))
      await new Promise((r) => { const done = () => r(); v.addEventListener('seeked', done, { once: true }); v.currentTime = t; setTimeout(done, 6000) })
      if (v.readyState < 2) await new Promise((r) => { v.addEventListener('loadeddata', r, { once: true }); setTimeout(r, 4000) })
      info.videoSeeks.push({ requestedS: t, atS: +v.currentTime.toFixed(3), paused: v.paused, readyState: v.readyState })
    }
    await new Promise((r) => setTimeout(r, 400)); await assets()
    // lazy images that the pins moved into view get their src from an in-view observer: an <img> with no src yet reports
    // complete = true, so poll until every viewport-visible <img> really has pixels (6 s cap, then it is what it is)
    for (const t0 = performance.now(); performance.now() - t0 < 6000;) {
      if (![...document.images].some((i) => vis(i) && (!i.complete || i.naturalWidth === 0))) break
      await new Promise((r) => setTimeout(r, 100))
    }
    await assets()
    await raf(); await raf()
    return info
  }, phase)
}
// Text-free geometry of one vertical band: media rects (img, video, canvas, background-image boxes) and text line rects.
async function geometry(p, top, h) {
  return p.evaluate(([top, h]) => {
    const sy = scrollY, rect = (r) => ({ x: Math.round(r.left), y: Math.round(r.top + sy - top), w: Math.round(r.width), h: Math.round(r.height) })
    const inBand = (r) => r.width > 2 && r.height > 2 && r.top + sy < top + h && r.bottom + sy > top
    const media = [], text = []
    for (const e of document.body.querySelectorAll('*')) {
      const r = e.getBoundingClientRect(); if (!inBand(r) || r.width * r.height < 2000) continue
      const cs = getComputedStyle(e)
      if (/^(IMG|VIDEO|CANVAS)$/.test(e.tagName) || (cs.backgroundImage && cs.backgroundImage !== 'none' && !/gradient/.test(cs.backgroundImage))) media.push(rect(r))
    }
    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    for (let n; (n = tw.nextNode());) {
      if (!n.nodeValue.trim() || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(n.parentElement?.tagName)) continue
      const rg = document.createRange(); rg.selectNodeContents(n)
      for (const r of rg.getClientRects()) if (inBand(r) && r.height > 4) text.push(rect(r))
    }
    return { media, text }
  }, [top, h])
}
function iou(a, b) {
  const x = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)), y = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y))
  return x * y / (a.w * a.h + b.w * b.h - x * y)
}
function matchGeo(A, B, thr) {
  const used = new Set(); let m = 0, sum = 0; const d = []
  for (const a of A) {
    let best = -1, bi = 0
    B.forEach((b, i) => { if (!used.has(i)) { const v = iou(a, b); if (v > best) { best = v; bi = i } } })
    if (best >= thr) { used.add(bi); m++; sum += best; const b = B[bi]; d.push(Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.w - b.w), Math.abs(a.h - b.h))) }
  }
  d.sort((p, q) => p - q)
  return { live: A.length, clone: B.length, matched: m, matchedShare: +(m / Math.max(A.length, B.length, 1)).toFixed(4), meanIoU: +(sum / Math.max(m, 1)).toFixed(4), medianMaxEdgeDeltaPx: d.length ? d[d.length >> 1] : null }
}

const results = []
for (const route of ROUTES) {
  const tpl = RT[route]
  const [o, c] = await Promise.all([open(ORIG, route), open(CLONE, route)])
  const secs = await c.evaluate((body) => {
    const first = (sel) => { for (const s of sel.split(',')) { const e = document.querySelector(s.trim()); if (e) return e } return null }
    const out = []
    for (const d of [...body, { section: 'shell.site-footer', selector: 'footer' }]) {
      const els = d.all ? [...document.querySelectorAll(d.selector)] : [first(d.selector)].filter(Boolean)
      for (const e of els) { const r = e.getBoundingClientRect(); if (r.height > 0) out.push({ section: d.section, top: Math.round(r.top + scrollY), h: Math.round(r.height) }) }
    }
    return out.sort((a, z) => a.top - z.top)
  }, SEL.templates[tpl] || [])
  const docO = await o.evaluate(() => document.documentElement.scrollHeight)
  const docC = await c.evaluate(() => document.documentElement.scrollHeight)
  const maxY = Math.max(0, Math.min(docO, docC) - H)
  const inst = {}
  for (let i = secs.length - 1; i >= 0 && ONLY.length; i--) if (!ONLY.includes(secs[i].section)) secs.splice(i, 1)
  if (!secs.length) { await Promise.all([o.close(), c.close()]); continue }
  for (const s of secs) {
    inst[s.section] = (inst[s.section] ?? -1) + 1; s.instance = inst[s.section]
    s.offsets = []
    for (let k = 0; k < 3 && s.top + k * H < s.top + s.h; k++) s.offsets.push(Math.min(maxY, s.top + k * H))
  }
  const offsets = [...new Set(secs.flatMap((s) => s.offsets))].sort((a, z) => a - z)
  const shot = {}, freezeInfo = {}
  for (const y of offsets) {
    await Promise.all([goTo(o, y), goTo(c, y)])
    await Promise.all([o.waitForTimeout(y === 0 ? 3500 : 1800), c.waitForTimeout(y === 0 ? 3500 : 1800)])
    if (FREEZE) { const [fo, fc] = await Promise.all([freezePage(o, PHASE), freezePage(c, PHASE + SKEW)]); if (fo.movers.length || fc.movers.length || fo.videos || fc.videos || fo.animsPaused || fc.animsPaused) freezeInfo[y] = { original: fo, clone: fc } }
    const [A, B] = await Promise.all([o.screenshot(), c.screenshot()])
    const r = await similarity(A, B)
    shot[y] = r.score
    if (DUMP) {
      fs.mkdirSync(DUMP, { recursive: true }); const tag = `${route.replace(/\W+/g, '_')}_${y}_p${PHASE}`
      fs.writeFileSync(path.join(DUMP, `${tag}_live.png`), A); fs.writeFileSync(path.join(DUMP, `${tag}_clone.png`), B); fs.writeFileSync(path.join(DUMP, `${tag}_diff.png`), Buffer.from(r.diff, 'base64'))
    }
    if (GEO) for (const s of secs) if (s.offsets.includes(y) && s.geoRaw === undefined) {
      const [go, gc] = await Promise.all([geometry(o, s.top, s.h), geometry(c, s.top, s.h)])
      s.geoRaw = { go, gc, y }
    }
  }
  const sections = secs.map((s) => ({ section: s.section, instance: s.instance, topPx: s.top, heightPx: s.h, offsets: s.offsets, score: +(s.offsets.reduce((a, y) => a + shot[y], 0) / s.offsets.length).toFixed(4), shotScores: s.offsets.map((y) => +shot[y].toFixed(4)),
    ...(GEO && s.geoRaw ? { geometry: { note: 'text-free; boxes relative to the section top, from the shot at the section top offset', media: matchGeo(s.geoRaw.go.media, s.geoRaw.gc.media, 0.8), textRows: matchGeo(s.geoRaw.go.text, s.geoRaw.gc.text, 0.5) } } : {}) }))
  const avg = +(sections.reduce((a, s) => a + s.score, 0) / (sections.length || 1)).toFixed(4)
  const fails = sections.filter((s) => s.score < GATE).map((s) => `${s.section}#${s.instance}`)
  results.push({ route, template: tpl, docHeightOriginal: docO, docHeightClone: docC, average: avg, minSection: Math.min(...sections.map((s) => s.score)), perSectionGatePass: fails.length === 0, averageGatePass: avg >= GATE, belowGate: fails, ...(FREEZE ? { frozenAt: freezeInfo } : {}), sections })
  process.stderr.write(`${route} avg ${avg} min ${Math.min(...sections.map((s) => s.score)).toFixed(3)} below ${fails.join(' ')}\n`)
  await Promise.all([o.close(), c.close()])
}
await b.close()
const all = results.flatMap((r) => r.sections)
const out = { tool: 'extraction/parity_harness.mjs', measuredAt: new Date().toISOString(), captureState: { freeze: FREEZE, phaseMs: PHASE, cloneSkewMs: SKEW, only: ONLY.length ? ONLY : null }, viewport: { width: W, height: H }, originalUrl: ORIG, cloneUrl: CLONE, pixelThreshold: THRESH, gate: { perSectionMin: GATE, pageAverageMin: GATE },
  overall: { routes: results.length, sections: all.length, meanSectionScore: +(all.reduce((a, s) => a + s.score, 0) / (all.length || 1)).toFixed(4), sectionsBelowGate: all.filter((s) => s.score < GATE).length }, routes: results }
if (OUT) fs.writeFileSync(path.resolve(OUT), JSON.stringify(out, null, 1)); else console.log(JSON.stringify(out, null, 1))

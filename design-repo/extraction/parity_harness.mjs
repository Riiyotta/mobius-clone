// Live-original vs clone visual parity harness (R12). Optional tool: verify_all.py reads its recorded output
// (extraction/measured-values.json -> cloneParity) but never runs it.
//
//   PLAYWRIGHT_MODULE=<playwright> ORIGINAL_URL=https://mobius.framer.website CLONE_URL=http://localhost:5194 \
//     node extraction/parity_harness.mjs --out <file.json> [--routes /,/studio] [--width 1440 --height 900]
//
// Method: both sites at the same viewport. Section boundaries come from the CLONE (section-selectors.json).
// Each section is sampled at the same scroll offsets on both sites (its top, then +1 viewport, max 3 shots per
// section). Scrolling is stepped (450px) so in-view effects fire on both; each shot waits for motion to settle
// (3.5s at offset 0 for the hero entrance, 1.8s otherwise). Similarity = share of pixels whose max RGB channel
// difference is <= 40 (0..1). Section score = mean of its shots; page score = mean of its sections.
// Gate: every section >= 0.80 AND page average >= 0.80. Autoplaying media (video, tickers, auto-scrolling
// columns, 10s testimonial autoplay) is not frozen, so it lowers scores honestly instead of being masked.
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
const DEFAULT = ['/', '/work', '/work/soma-studio', '/studio', '/contacts', '/feed', '/feed/beyond-function', '/legal/privacy-policy', '/404']
const ROUTES = (arg('--routes', null) || DEFAULT.join(',')).split(',')
const SEL = JSON.parse(fs.readFileSync(path.join(HERE, 'section-selectors.json')))
const RT = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(REPO, 'templates/routes.json'))).routes.map((r) => [r.route, r.template]))
const THRESH = 40, GATE = 0.8

const b = await chromium.launch()
const cmp = await b.newPage()
async function similarity(A, B) {
  return cmp.evaluate(async ([a, z, T]) => {
    const load = (s) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = s })
    const [ia, ib] = await Promise.all([load(a), load(z)])
    const w = Math.min(ia.width, ib.width), h = Math.min(ia.height, ib.height)
    const c = document.createElement('canvas'); c.width = w; c.height = h
    const x = c.getContext('2d'); x.drawImage(ia, 0, 0); const da = x.getImageData(0, 0, w, h).data
    x.clearRect(0, 0, w, h); x.drawImage(ib, 0, 0); const db = x.getImageData(0, 0, w, h).data
    let same = 0
    for (let i = 0; i < da.length; i += 4) {
      if (Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2])) <= T) same++
    }
    return same / (w * h)
  }, ['data:image/png;base64,' + A.toString('base64'), 'data:image/png;base64,' + B.toString('base64'), THRESH])
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
  for (const s of secs) {
    inst[s.section] = (inst[s.section] ?? -1) + 1; s.instance = inst[s.section]
    s.offsets = []
    for (let k = 0; k < 3 && s.top + k * H < s.top + s.h; k++) s.offsets.push(Math.min(maxY, s.top + k * H))
  }
  const offsets = [...new Set(secs.flatMap((s) => s.offsets))].sort((a, z) => a - z)
  const shot = {}
  for (const y of offsets) {
    await Promise.all([goTo(o, y), goTo(c, y)])
    await Promise.all([o.waitForTimeout(y === 0 ? 3500 : 1800), c.waitForTimeout(y === 0 ? 3500 : 1800)])
    const [A, B] = await Promise.all([o.screenshot(), c.screenshot()])
    shot[y] = await similarity(A, B)
  }
  const sections = secs.map((s) => ({ section: s.section, instance: s.instance, topPx: s.top, heightPx: s.h, offsets: s.offsets, score: +(s.offsets.reduce((a, y) => a + shot[y], 0) / s.offsets.length).toFixed(4) }))
  const avg = +(sections.reduce((a, s) => a + s.score, 0) / (sections.length || 1)).toFixed(4)
  const fails = sections.filter((s) => s.score < GATE).map((s) => `${s.section}#${s.instance}`)
  results.push({ route, template: tpl, docHeightOriginal: docO, docHeightClone: docC, average: avg, minSection: Math.min(...sections.map((s) => s.score)), perSectionGatePass: fails.length === 0, averageGatePass: avg >= GATE, belowGate: fails, sections })
  process.stderr.write(`${route} avg ${avg} min ${Math.min(...sections.map((s) => s.score)).toFixed(3)} below ${fails.join(' ')}\n`)
  await Promise.all([o.close(), c.close()])
}
await b.close()
const all = results.flatMap((r) => r.sections)
const out = { tool: 'extraction/parity_harness.mjs', measuredAt: new Date().toISOString(), viewport: { width: W, height: H }, originalUrl: ORIG, cloneUrl: CLONE, pixelThreshold: THRESH, gate: { perSectionMin: GATE, pageAverageMin: GATE },
  overall: { routes: results.length, sections: all.length, meanSectionScore: +(all.reduce((a, s) => a + s.score, 0) / (all.length || 1)).toFixed(4), sectionsBelowGate: all.filter((s) => s.score < GATE).length }, routes: results }
if (OUT) fs.writeFileSync(path.resolve(OUT), JSON.stringify(out, null, 1)); else console.log(JSON.stringify(out, null, 1))

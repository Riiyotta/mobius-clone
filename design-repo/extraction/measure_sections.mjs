// Re-measure section heights on the running clone (R9). Optional tool: verify_all.py never runs it.
//
//   PLAYWRIGHT_MODULE=<path-or-name-of-playwright> CLONE_URL=http://localhost:5194 \
//     node extraction/measure_sections.mjs --out extraction/.measured-sections.json [--width 1440 --height 900] [--routes /,/studio]
//
// The browser library is resolved ONLY through the PLAYWRIGHT_MODULE env var (default: the bare package
// name "playwright"), never an absolute path. Routes come from templates/routes.json, selectors from
// extraction/section-selectors.json. Every match is recorded with its document top, height and whether it is
// in normal flow (absolute/fixed boxes take no page height in the wrapper gate). Output is the
// sectionHeights block that extraction/measured-values.json carries.
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
const BASE = process.env.CLONE_URL || 'http://localhost:5194'
const OUT = arg('--out', null)
const only = arg('--routes', null)
const routes = JSON.parse(fs.readFileSync(path.join(REPO, 'templates/routes.json'))).routes.filter((r) => r.status === 'mounted')
const SEL = JSON.parse(fs.readFileSync(path.join(HERE, 'section-selectors.json')))

const b = await chromium.launch()
const pages = []
for (const r of routes) {
  if (only && !only.split(',').includes(r.route)) continue
  const p = await b.newPage({ viewport: { width: W, height: H } })
  await p.goto(BASE + r.route, { waitUntil: 'networkidle' })
  await p.waitForTimeout(1500)
  const res = await p.evaluate(({ shell, body }) => {
    const first = (sel) => { for (const s of sel.split(',')) { const e = document.querySelector(s.trim()); if (e) return e } return null }
    const box = (e) => { const r = e.getBoundingClientRect(); return { top: +(r.top + scrollY).toFixed(1), h: +r.height.toFixed(1) } }
    const flow = (e) => !['absolute', 'fixed'].includes(getComputedStyle(e).position)
    const out = []
    for (const d of body) {
      if (d.splitBy) {
        const c = first(d.selector); if (!c) continue
        const heads = [...c.querySelectorAll(d.splitBy)]
        const end = c.getBoundingClientRect().bottom + scrollY
        heads.forEach((hd, i) => {
          const t = hd.getBoundingClientRect().top + scrollY
          const n = i + 1 < heads.length ? heads[i + 1].getBoundingClientRect().top + scrollY : end
          out.push({ section: d.section, variant: d.variant || null, topPx: +t.toFixed(1), heightPx: +(n - t).toFixed(1), inFlow: true, selector: `${d.selector} ${d.splitBy}:nth(${i})`, heading: hd.textContent.trim().slice(0, 60) })
        })
        continue
      }
      const els = d.all ? [...document.querySelectorAll(d.selector)] : [first(d.selector)].filter(Boolean)
      if (!els.length) { out.push({ section: d.section, variant: d.variant || null, missing: true, optional: !!d.optional, selector: d.selector }); continue }
      for (const e of els) { const x = box(e); out.push({ section: d.section, variant: d.variant || null, topPx: x.top, heightPx: x.h, inFlow: flow(e) && x.h > 0, selector: d.selector }) }
    }
    const sh = shell.map((d) => { const e = first(d.selector); return e ? { section: d.section, heightPx: box(e).h, inFlow: flow(e) } : { section: d.section, missing: true } })
    return { docHeightPx: document.documentElement.scrollHeight, sections: out, shell: sh }
  }, { shell: SEL.shell, body: SEL.templates[r.template] || [] })
  res.sections.sort((a, z) => (a.topPx ?? 1e9) - (z.topPx ?? 1e9))
  const inst = {}
  res.sections.forEach((s) => { inst[s.section] = (inst[s.section] ?? -1) + 1; s.instance = inst[s.section] })
  pages.push({ route: r.route, template: r.template, ...res })
  await p.close()
  process.stderr.write(`${r.route} ${res.docHeightPx}\n`)
}
await b.close()
const out = { viewportWidth: W, viewportHeight: H, measuredAt: new Date().toISOString(), tool: 'extraction/measure_sections.mjs (headless Chromium via Playwright)', baseUrl: BASE, pages }
if (OUT) fs.writeFileSync(path.resolve(REPO, OUT), JSON.stringify(out, null, 1)); else console.log(JSON.stringify(out, null, 1))

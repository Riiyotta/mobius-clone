// §4.1 Scramble (home.md). Static layout only: every word sits at its resting offset (0, 0).
// MOTION (Animation pass): desktop word scatter, seed 117 / spread 1000, progress from the h3 top
// (see home.md §4.1). Each word is a `.hs-scr-w` span with `data-i` = word index. Tablet/phone: spread 0.
// Paragraph staggered-lines reveal (600 / 120 / 100) is also left for Animation.
import { useRef } from 'react'
import { Lines, useScrollLoop } from './Motion'

// Measured on the original (1440): word i offset (cos θ·r, sin θ·r), θ = rand(117+2i+1)·2π,
// r = rand(117+2i+2)·1000, rand(s) = frac(sin(s)·1e4) — reproduces word 0 = (−950.1, 130.3) exactly.
// a = 1 at h3 top ≤ vh/2, 0 at ≥ vh; translate(x(1−a), y(1−a)). Paragraph: lines 600ms
// cubic-bezier(.4,1,.4,1), 120ms/line counted across both paragraphs (last word starts +1.54s), delay 100.
const rand = (s) => { const x = Math.sin(s) * 1e4; return x - Math.floor(x) }
const OFFS = Array.from({ length: 14 }, (_, i) => {
  const th = rand(117 + 2 * i + 1) * 2 * Math.PI
  const r = rand(117 + 2 * i + 2) * 1000
  return [Math.cos(th) * r, Math.sin(th) * r]
})
const HEAD = 'Möbius® brings ideas and design together, turning imagination into clarity and connection into beauty.'
const P1 = 'At Möbius®, we keep our process clear, collaborative, and focused. We work closely as a small team, shaping each project with intention and care. Every idea is explored from multiple angles, refined together, and guided by a shared sense of purpose. Nothing is added without reason, and nothing essential is left behind. The result is work that feels thoughtful, precise, and built to last beyond trends.'
const P2 = 'Our way of working is straightforward. We stay small by choice, keeping the process open and honest so decisions remain meaningful. Dialogue is constant, feedback is collective, and the direction becomes sharper with every step. We believe clarity comes from collaboration, and that strong ideas emerge when the team thinks as one.'

export default function Scramble({ desktop }) {
  const h3 = useRef(null)
  const last = useRef(-1)
  useScrollLoop(h3, (y, vh) => {
    const el = h3.current
    const T = el.getBoundingClientRect().top
    const a = T <= vh / 2 ? 1 : T >= vh ? 0 : (vh - T) / (vh / 2)
    if (a === last.current) return
    last.current = a
    el.querySelectorAll('.hs-scr-w').forEach((w) => {
      const [x, yy] = OFFS[+w.dataset.i] || [0, 0]
      w.style.transform = a === 1 ? 'none' : `translate(${(x * (1 - a)).toFixed(2)}px, ${(yy * (1 - a)).toFixed(2)}px)`
    })
  }, { enabled: desktop, margin: '0px' })
  return (
    <div className="hs-scr">
      <section className="hs-scr-spacer" />
      <div className="hs-scr-c">
        <h3 className="hs-scr-h3" ref={h3}>
          {HEAD.split(' ').map((w, i) => (
            <span key={i} className="hs-scr-w" data-i={i}>{w}</span>
          ))}
        </h3>
      </div>
      <div className="hs-scr-tc">
        <section className="hs-scr-side" />
        <div className="hs-scr-mid">
          {desktop ? (
            <p className="hs-scr-pw"><Lines paras={[P1, P2]} delay={100} className="hs-scr-p" /></p>
          ) : (
            <div className="hs-scr-p">
              <p>{P1}</p>
              <p>{P2}</p>
            </div>
          )}
        </div>
        <section className="hs-scr-side" />
      </div>
    </div>
  )
}

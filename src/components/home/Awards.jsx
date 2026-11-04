import { useRef } from 'react'
import ButtonB from '../legal/ButtonB'
import { Lines, Rise, docTop, makeSpring, useScrollLoop } from './Motion'

// Row link: target p = clamp((vh − rowTop)/rowHeight, 0, 1) (untransformed top), followed by a spring
// {stiffness 500, damping 100, mass 3.3}; y = 100(1 − p), opacity = p. Desktop only.
const SPRING = { stiffness: 500, damping: 100, mass: 3.3 }
function useRows(ref, enabled) {
  const springs = useRef([])
  useScrollLoop(ref, (y, vh, dt, settle) => {
    ref.current.querySelectorAll('.hs-aw-item').forEach((row, i) => {
      const cur = springs.current[i]
      const ty = cur ? 100 * (1 - cur.x) : 0
      const top = docTop(row, ty) - y
      const p = Math.min(1, Math.max(0, (vh - top) / row.offsetHeight))
      const s = cur || (springs.current[i] = makeSpring(SPRING, p))
      // Framer's spring sees the new scroll value one frame later than this loop (measured ~17ms).
      const v = settle ? (s.x = s.p = p, s.v = 0, p) : s.step(s.p ?? p, dt)
      s.p = p
      row.style.transform = v >= 1 ? 'none' : `translateY(${(100 * (1 - v)).toFixed(3)}px)`
      row.style.opacity = v >= 1 ? '' : v.toFixed(4)
    })
  }, { enabled, margin: '100% 0px' })
}

// §4.5 Our Awards (home.md). Static layout: rows at their resting state (y 0, opacity 1).
// MOTION (Animation pass): per-row scroll link on `.hs-aw-item` — y 100 → 0, opacity 0 → 1,
// p = clamp((vh − rowTop)/rowHeight, 0, 1) on the untransformed top, smoothed by spring
// {stiffness 500, damping 100, mass 3.3}. Plus the H2 char rise.
// Caption: desktop + phone. CTA: desktop only. Tablet shows neither (dump).
const ROWS = [
  ['Red Dot', 'Brand & Communication Design', 'x3'],
  ['European Design Awards', 'Visual Identity', 'x1'],
  ['ADC Europe', 'Branding & Typography', 'x2'],
  ['D&AD', 'Digital Design', 'x3'],
  ['Tokyo TDC', 'Typography Excellence', 'x1'],
  ['Awwwards', 'Site of the Day', 'x2'],
  ['Awwwards', 'Honorable Mention', 'x3'],
  ['FWA', 'Site of the Day', 'x1'],
]

export default function Awards({ desktop, phone }) {
  const tablet = !desktop && !phone
  const list = useRef(null)
  useRows(list, desktop)
  return (
    <div className="hs-aw" id="awards">
      <div className="hs-aw-head">
        <div className="hs-aw-hc">
          <div className="hs-aw-titles">
            <div className="hs-aw-tc"><h2 className="hs-h2"><Rise text="Our" enabled={desktop} delay={0.1} /></h2></div>
            <div className="hs-aw-tc"><h2 className="hs-h2"><Rise text="Awards" enabled={desktop} delay={0.2} /></h2></div>
          </div>
          {!tablet && (
            <div className="hs-aw-tb">
              <p className="hs-cap hs-aw-cap"><Lines paras="Selected moments where our work was acknowledged by others." enabled={desktop} /></p>
              {desktop && <ButtonB label="Our Work" href="./work" desktop />}
            </div>
          )}
        </div>
      </div>
      <div className="hs-aw-list" ref={list}>
        {ROWS.map(([name, cat, count], i) => (
          <div key={i} className="hs-aw-item">
            <div className="hs-aw-col hs-aw-c1">
              <div className="hs-aw-in">
                {phone ? <h5 className="hs-aw-name">{name}</h5> : <p className="hs-aw-p"><strong>{name}</strong></p>}
              </div>
            </div>
            <div className="hs-aw-col hs-aw-c2"><div className="hs-aw-in"><p className="hs-aw-p">{cat}</p></div></div>
            <div className="hs-aw-col hs-aw-c3"><div className="hs-aw-in"><p className="hs-aw-p hs-aw-count"><strong>{count}</strong></p></div></div>
            <section className="hs-aw-border" />
          </div>
        ))}
      </div>
    </div>
  )
}

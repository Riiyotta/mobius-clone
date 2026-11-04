import { useEffect, useRef, useState } from 'react'
import { springEase } from '../../lib/spring'

// "Big Number 404" (legal-404.md §B.3).
// Desktop: mounts in variant A (columns offset, opacity 0) and switches to B right after mount;
// `top` + `opacity` animate with a 1.6s spring, bounce 0. Tablet/phone render B directly.
// Gradient shapes loop at every breakpoint (notfound.css) and pause while the box is off-screen.
const S16 = springEase(1.6)
const DIGITS = '0\n1\n2\n3\n4\n5\n6\n7\n8\n9'

// DOM order matches the source: col 1 is the right "4", col 3 the left "4".
const COLS = [
  { left: '83%', topA: '-307%', topB: '100%', vw: 224.769, vh: 2605 },
  { left: '50%', topA: '304%', topB: '498%', vw: 224.769, vh: 2605 },
  { left: '17%', topA: '448%', topB: '100%', vw: 224.748, vh: 2599 },
]

const SHAPE_B = {
  id: 'nf-grad-b', w: 657, h: 860, x: -144, y: -188, viewBox: '0 0 656.923 859.463',
  g: { x1: 1, x2: 0, y1: 0.6134505089099256, y2: 0.3865494910900744, stops: ['rgb(66, 119, 128)', 'rgb(60, 59, 92)'] },
  d: 'M 278.224 668.787 C 300.449 406.209 606.411 469.108 654.315 246.451 C 702.219 23.794 75.028 -229.613 9.107 382.981 C -56.814 995.576 255.998 931.366 278.224 668.787 Z',
}
const SHAPE_A = {
  id: 'nf-grad-a', w: 645, h: 844, x: -137, y: -180, viewBox: '0 0 644.93 843.473',
  g: { x1: 0.49751243781094523, x2: 0.5024875621890548, y1: 0, y2: 1, stops: ['rgb(102, 170, 204)', 'rgb(179, 237, 255)'] },
  d: 'M 273.145 656.345 C 294.964 398.652 595.341 460.38 642.37 241.866 C 689.4 23.351 73.659 -225.341 8.941 375.856 C -55.777 977.054 251.325 914.038 273.145 656.345 Z',
}

function Shape({ s, className }) {
  return (
    <div className={`nf-shape ${className}`}>
      <svg className="nf-shape-svg" viewBox={s.viewBox} width={s.w} height={s.h} style={{ left: s.x, top: s.y }} aria-hidden="true">
        <defs>
          <linearGradient id={s.id} x1={s.g.x1} x2={s.g.x2} y1={s.g.y1} y2={s.g.y2}>
            <stop offset="0" stopColor={s.g.stops[0]} />
            <stop offset="1" stopColor={s.g.stops[1]} />
          </linearGradient>
        </defs>
        <path d={s.d} fill={`url(#${s.id})`} />
      </svg>
    </div>
  )
}

export default function BigNumber404({ desktop }) {
  const [b, setB] = useState(!desktop)
  const [paused, setPaused] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!desktop) { setB(true); return }
    // two frames so variant A is painted before the switch
    let r2 = 0
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setB(true)) })
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2) }
  }, [desktop])

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setPaused(!e.isIntersecting))
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`nf-num ${paused ? 'is-paused' : ''}`} aria-label="404" role="img">
      {COLS.map((c, i) => (
        <div
          key={i}
          className="nf-col"
          style={{
            left: c.left,
            top: b ? c.topB : c.topA,
            opacity: b ? 1 : 0,
            transition: desktop && b ? `top 1.6s ${S16}, opacity 1.6s ${S16}` : 'none',
          }}
        >
          <svg viewBox={`0 0 ${c.vw} ${c.vh}`} aria-hidden="true">
            <foreignObject width={c.vw} height={c.vh}>
              <p xmlns="http://www.w3.org/1999/xhtml" className="nf-digits">{DIGITS}</p>
            </foreignObject>
          </svg>
        </div>
      ))}
      <div className="nf-grad-wrap">
        <div className="nf-grad">
          <Shape s={SHAPE_B} className="nf-shape-b" />
          <Shape s={SHAPE_A} className="nf-shape-a" />
        </div>
      </div>
    </div>
  )
}

import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Lines, Rise, useScrollLoop } from './Motion'
import ButtonA from '../legal/ButtonA'
import ButtonB from '../legal/ButtonB'
import { springEase } from '../../lib/spring'

// §4.4 Möbius® In Numbers (home.md).
// Desktop: one sticky number box (state A/B/C) behind three 100vh rows. The state → digits/photo
// transition (spring 1.6 bounce 0) is built here; the SCROLL TRIGGER is not:
// MOTION (Animation pass): switch `state` when a `.hs-bn-marker` crosses the viewport centre
// (markers: a = top 200 of row A, b/c = top of rows B/C); scrolling back reverses. Also the H2 char rise.
// Tablet/phone: no sticky; every row has its own static box showing its own number.
const S16 = springEase(1.6)
// CSS transitions measured ~40ms behind Framer's scroll-handler start; a small negative delay realigns them.
const LEAD = '-0.04s'
const IMGS = ['LdGkrvu5WSmHSae6OpKl2jDoOo.jpg', 'VaocDJ3f201Z2fVP3ikqnrJjaI.jpg', 'gk68gxIIuKf4YZpReHW8qPEWUf4.jpg']
const ROWS = [
  {
    k: 'a', n: '25', l1: 'International', l2: 'Awards', digits: [2, 5], btn: 'Our Awards', href: './#awards',
    p: 'Recognized across global juries for clarity, craft, and concept. Every award reflects the same commitment: creating work with intention, designing with purpose, and shaping ideas that resonate far beyond their launch.',
  },
  {
    // Copy is verbatim from the original, including its template bug ("…who they are.n, designing…").
    k: 'b', n: '42', l1: 'Clients', l2: 'Worldwide', digits: [4, 2], btn: 'Our Clients', href: './#client-logotypes',
    p: 'Built on relationships, not transactions. We partner with teams who value dialogue, trust, and shared ambition — working together to create brands and digital experiences that feel true to who they are.n, designing with purpose, and shaping ideas that resonate far beyond their launch.',
  },
  {
    k: 'c', n: '83', l1: 'Completed', l2: 'Projects', digits: [8, 3], btn: 'Our Work', href: './work',
    p: 'Each project becomes a part of the studio’s rhythm — ideas shaped, stories refined, and systems brought to life. Every collaboration deepens our perspective and strengthens the work that follows.',
  },
]

// Digit column: SVG "0…9", viewBox 224.77 x 2606 (from the dump), one cell = 260.6 units.
// The window shows cell d when the column is shifted by (5 − d) cells from centre
// (= the original's `top: (5−d)·~99%` + translate(−50%, −50%)).
// Glyph size/baseline inside a cell is NOT in the dump (the dumped 210.68px / lh 168.54 do not add up
// to the 2606 viewBox); FONT and the vertical centring below are approximated from sheetA — see handoff.
const CELL = 260.6
const FONT = 330
const CAP = 0.727 // Inter cap/figure height in em
function DigitColumn({ d }) {
  return (
    <svg
      className="hs-nb-col"
      viewBox="0 0 224.77 2606"
      aria-hidden="true"
      style={{ transform: `translate(-50%, ${-50 + (5 - d) * 10}%)`, transition: `transform 1.6s ${S16} ${LEAD}` }}
    >
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
        <text key={n} x="112.385" y={n * CELL + CELL / 2 + (CAP * FONT) / 2} textAnchor="middle" fontSize={FONT}>
          {n}
        </text>
      ))}
    </svg>
  )
}

function NumberBox({ state }) {
  const [tens, ones] = ROWS[state].digits
  return (
    <div className="hs-nb" aria-label={ROWS[state].n}>
      <div className="hs-nb-digit hs-nb-ones"><DigitColumn d={ones} /></div>
      <div className="hs-nb-digit hs-nb-tens"><DigitColumn d={tens} /></div>
      {IMGS.map((src, i) => (
        <div key={src} className="hs-nb-img" style={{ opacity: i === state ? 1 : 0, transition: `opacity 1.6s ${S16} ${LEAD}` }}>
          <img src={`/assets/img/${src}`} alt="" draggable={false} />
        </div>
      ))}
    </div>
  )
}

function Row({ r, i, desktop }) {
  return (
    <nav className={`hs-bn-row hs-bn-row-${r.k}`}>
      <section className="hs-bn-sec">
        <div className="hs-bn-tc">
          <div className="hs-bn-c">
            <div className="hs-bn-text">
              <h4 className="hs-bn-h4">{desktop ? <Lines paras={[`${r.n} ${r.l1}`, r.l2]} /> : <>{r.n} {r.l1}<br />{r.l2}</>}</h4>
              <p className="hs-body hs-bn-p"><Lines enabled={desktop} paras={r.p} delay={200} /></p>
            </div>
            <ButtonA label={r.btn} href={r.href} desktop={desktop} />
          </div>
          {!desktop && <NumberBox state={i} />}
        </div>
      </section>
      {desktop && <section className={`hs-bn-marker hs-bn-marker-${r.k}`} data-marker={r.k} />}
      {desktop && <section className="hs-bn-right" />}
    </nav>
  )
}

export default function Numbers({ desktop, phone }) {
  // Desktop sticky box state (0 = A/25, 1 = B/42, 2 = C/83). Animation wires the marker trigger to this.
  // Measured: B switches between scrollY 7200 and 7250 (marker top 452 → 402) = marker top < vh/2.
  const [state, setState] = useState(0)
  const bn = useRef(null)
  const cur = useRef(0)
  useScrollLoop(bn, (y, vh) => {
    let n = 0
    bn.current.querySelectorAll('.hs-bn-marker').forEach((m, i) => { if (i > 0 && m.getBoundingClientRect().top < vh / 2) n = i })
    // flushSync: commit inside this rAF so the 1.6s transitions start this frame (Framer animates
    // from its scroll handler; a deferred React render measured ~40ms late).
    if (n !== cur.current) { cur.current = n; flushSync(() => setState(n)) }
  }, { enabled: desktop, margin: '0px' })
  const tablet = !desktop && !phone
  return (
    <div className="hs-num">
      <div className="hs-num-head">
        <div className="hs-num-hc">
          <div className="hs-num-titles">
            <div className="hs-num-tc"><h2 className="hs-h2"><Rise text="Möbius®" enabled={desktop} delay={0.1} /></h2></div>
            <div className="hs-num-tc"><h2 className="hs-h2"><Rise text="In Numbers" enabled={desktop} delay={0.2} /></h2></div>
          </div>
          {!tablet && (
            <div className="hs-num-right">
              <div className="hs-num-tb">
                <p className="hs-cap hs-num-cap"><Lines enabled={desktop} paras="A closer look at the milestones and collaborations that define our ongoing practice." /></p>
                {desktop && <ButtonB label="Let's work together" href="./contacts" desktop />}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="hs-bn" ref={bn}>
        {desktop && (
          <nav className="hs-bn-sticky">
            <NumberBox state={state} />
          </nav>
        )}
        {ROWS.map((r, i) => <Row key={r.k} r={r} i={i} desktop={desktop} />)}
      </div>
    </div>
  )
}

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { springEase } from '../../lib/spring'

// Home hero = the "loader" (home.md §1–2). No separate preloader: the hero + nav layer
// appear (opacity .001→1, scale 1.6→1, 0.8s spring), then the card stack rises (In B),
// the intro lines reveal, and "© 2018-26" rises char by char. Desktop only; tablet/phone static.
const IMG = (id) => `/assets/img/${id}.jpg`
// Paint order bottom → top: D, C, B, A.
const CARDS = [
  { k: 'D', src: IMG('ZdoJlTXzsfF4jck8jdi8x8jmQN8'), rot: -5, hover: 0, inDur: 1.4, inDelay: 0, outDelay: 0.3, pos: '50% 50%' },
  { k: 'C', src: IMG('JZNaIjPNcrDF3IgxsRH6Azc8'), rot: -20, hover: -30, inDur: 1.3, inDelay: 0.1, outDelay: 0.2, pos: '50% 50%' },
  { k: 'B', src: IMG('TgD2gKSlOfhH9eJku8ilavEy2Vs'), rot: -10, hover: -15, inDur: 1.2, inDelay: 0.2, outDelay: 0.1, pos: '50% 50%' },
  { k: 'A', src: IMG('91tSqsa2UCoJo8t9Pw7JOunYw'), rot: 5, hover: 15, inDur: 1.1, inDelay: 0.3, outDelay: 0, pos: '46.6% 26%' },
]
const INTRO = '— a design studio shaping brands and digital experiences through motion, clarity, and timeless craft. Based online, working globally, we help ambitious teams express who they are and what they stand for.'
const YEAR = `© 2018-${String(new Date().getFullYear()).slice(-2)}`
const SPRING_08 = springEase(0.8)

// Cold-load offsets from the hero appear start (home.md §1.1 clone recipe).
const T_STACK = 950, T_INTRO = 1180, T_YEAR = 1570, T_MAIN = 1400 // spec offsets minus ~50ms React effect latency (measured)
const OUT_EASE = 'cubic-bezier(.8, 0, 1, .7)'

function Intro({ animate, state }) {
  // state: 'wait' | 'go' | 'outro' | 'empty'
  const ref = useRef(null)
  const [lines, setLines] = useState([])
  const words = INTRO.split(/(?<= )/)
  useLayoutEffect(() => {
    if (!animate || !ref.current) return
    const measure = () => {
      const els = [...ref.current.querySelectorAll('.hm-w')]
      let line = 0, top = null
      setLines(els.map((e) => {
        const t = e.getBoundingClientRect().top
        if (top !== null && Math.abs(t - top) > 5) line++
        top = t
        return line
      }))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [animate])

  if (state === 'empty') return <div className="hm-intro hm-intro-empty" />
  if (!animate) return <p className={`hm-intro hm-intro-static ${state === 'outro' ? 'is-outro' : ''}`}>{' ' + INTRO}</p>
  const go = state === 'go' || state === 'outro'
  return (
    <p ref={ref} className={`hm-intro hm-intro-anim ${state === 'outro' ? 'is-outro' : ''}`}>
      {words.map((w, i) => (
        <span key={i} className="hm-wm">
          <span
            className="hm-w"
            style={{
              marginLeft: i === 0 ? 90 : 0,
              transform: go ? 'translateY(0%)' : 'translateY(100%)',
              transition: go ? `transform 600ms cubic-bezier(.4,1,.4,1) ${(lines[i] || 0) * 120}ms` : 'none',
            }}
          >
            {w}
          </span>
        </span>
      ))}
    </p>
  )
}

export default function Hero({ desktop }) {
  // stack phase: 'inA' (pushed +100vh, no transition) | 'inB' | 'main' (hover enabled) | 'out'
  const [phase, setPhase] = useState(desktop ? 'inA' : 'main')
  const [intro, setIntro] = useState(desktop ? 'wait' : 'go')
  const [year, setYear] = useState(!desktop)
  const [hover, setHover] = useState(false)
  const timers = useRef([])

  useEffect(() => {
    const T = timers.current
    const later = (fn, ms) => T.push(setTimeout(fn, ms))
    const clear = () => { T.forEach(clearTimeout); T.length = 0 }
    if (!desktop) {
      // Tablet/phone: no entrance, but the intro leaves on scroll exactly like the original (measured at 390 and 768 wide: past ~30px
      // the intro fades out and its box drops from 9 lines (288px) to the 256px placeholder, so the page is 32px shorter; back at the top it returns).
      setPhase('main'); setIntro('go'); setYear(true)
      let gone = false
      const onScrollSmall = () => {
        const y = window.scrollY
        if (!gone && y > 30) { gone = true; clear(); setIntro('outro'); later(() => setIntro('empty'), 600) }
        else if (gone && y <= 10) { gone = false; clear(); setIntro('go') }
      }
      window.addEventListener('scroll', onScrollSmall, { passive: true })
      return () => { clear(); window.removeEventListener('scroll', onScrollSmall) }
    }
    const enter = (first) => {
      clear()
      setPhase('inA')
      setIntro('wait')
      later(() => setPhase('inB'), first ? T_STACK : 200)
      later(() => setPhase('main'), (first ? T_STACK : 200) + T_MAIN)
      later(() => setIntro('go'), first ? T_INTRO : 400)
      if (first) later(() => setYear(true), T_YEAR)
    }
    let out = false
    const onScroll = () => {
      const y = window.scrollY
      if (!out && y > 30) {
        out = true; clear(); setHover(false)
        setPhase('out'); setIntro('outro')
        later(() => setIntro('empty'), 600)
      } else if (out && y <= 10) {
        out = false; enter(false)
      }
    }
    enter(true)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { clear(); window.removeEventListener('scroll', onScroll) }
  }, [desktop])

  const cardStyle = (c) => {
    if (!desktop) return {}
    if (phase === 'inA') return { transform: 'translateY(100vh)', transition: 'none' }
    if (phase === 'out') return { transform: 'translateY(-100vh)', transition: `transform 0.8s ${OUT_EASE} ${c.outDelay}s` }
    return { transform: 'translateY(0)', transition: `transform ${c.inDur}s ${springEase(c.inDur)} ${c.inDelay}s` }
  }
  const rotStyle = (c) => ({
    transform: `translate(-50%, -50%) rotate(${hover && phase === 'main' ? c.hover : c.rot}deg)`,
    transition: desktop ? `transform 0.8s ${SPRING_08}` : 'none',
  })

  return (
    <div className={`hm-hero ${desktop ? 'nav-in' : ''}`}>
      <nav className="hm-introrow">
        <section className="hm-s1">
          <div className="hm-tc">
            <Intro animate={desktop} state={intro} />
          </div>
        </section>
        <section className="hm-s2" />
      </nav>

      <div className="hm-name">
        <div className="hm-name-row">
          <div className="hm-mark">
            <svg viewBox="0 0 924 180" aria-label="Möbius®">
              <foreignObject width="924" height="180">
                <p xmlns="http://www.w3.org/1999/xhtml">Möbius®</p>
              </foreignObject>
            </svg>
          </div>
          <div className="hm-year">
            <h5>
              {!desktop ? YEAR : [...YEAR].map((ch, i) => (
                <span
                  key={i}
                  className="hm-yc"
                  style={{
                    transform: year ? 'none' : 'translateY(50px)',
                    transition: year ? `transform 0.8s ${SPRING_08} ${i * 0.025}s` : 'none',
                  }}
                >
                  {ch === ' ' ? '\u00a0' : ch}
                </span>
              ))}
            </h5>
          </div>
        </div>
      </div>
      <div className="hm-stack">
        {CARDS.map((c) => (
          <div key={c.k} className="hm-push" style={cardStyle(c)}>
            <div className="hm-card" style={rotStyle(c)}>
              <section className="hm-img">
                <img src={c.src} alt="Möbius" draggable={false} style={{ objectPosition: c.pos }} />
              </section>
            </div>
          </div>
        ))}
        <a
          href="/work"
          className="hm-link"
          data-cursor="arrow"
          aria-label="Work"
          onMouseEnter={() => desktop && setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
      </div>

    </div>
  )
}

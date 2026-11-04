import { useEffect, useLayoutEffect, useRef } from 'react'
import { useInViewOnce } from '../../lib/useInViewOnce'
import { springEase } from '../../lib/spring'

// Home-section motion helpers (Animation pass). Values are the ones measured on the original
// (see each component's MOTION comment).

// rAF loop that runs only while `ref` is within `margin` of the viewport (IntersectionObserver),
// calling fn(scrollY, vh, dt). Lenis drives the native scroll, so window.scrollY is the source.
export function useScrollLoop(ref, fn, { enabled = true, margin = '200px 0px' } = {}) {
  const fnRef = useRef(fn)
  fnRef.current = fn
  useEffect(() => {
    const el = ref.current
    if (!enabled || !el) return
    let raf = 0
    let last = 0
    let on = false
    fnRef.current(window.scrollY, window.innerHeight, 1 / 60, true) // initial state before first intersection
    const tick = (t) => {
      const dt = last ? Math.min(0.064, (t - last) / 1000) : 1 / 60
      last = t
      fnRef.current(window.scrollY, window.innerHeight, dt)
      raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !on) { on = true; last = 0; raf = requestAnimationFrame(tick) }
      else if (!e.isIntersecting && on) {
        on = false; cancelAnimationFrame(raf)
        fnRef.current(window.scrollY, window.innerHeight, 1 / 60, true) // final settle when leaving
      }
    }, { rootMargin: margin })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [ref, enabled, margin])
}

// Damped spring follower (Framer useSpring {stiffness, damping, mass}), semi-implicit Euler, 1ms substeps.
export function makeSpring({ stiffness, damping, mass }, x0 = 0) {
  const s = { x: x0, v: 0 }
  s.step = (target, dt) => {
    const n = Math.max(1, Math.round(dt * 1000))
    const h = dt / n
    for (let i = 0; i < n; i++) {
      const a = (stiffness * (target - s.x) - damping * s.v) / mass
      s.v += a * h
      s.x += s.v * h
    }
    if (Math.abs(target - s.x) < 1e-4 && Math.abs(s.v) < 1e-3) { s.x = target; s.v = 0 }
    return s.x
  }
  return s
}

// Untransformed document top of an element whose own translateY we set (ty).
export const docTop = (el, ty = 0) => el.getBoundingClientRect().top + window.scrollY - ty

// Framer character/word text effect: each token translateY(from) → 0 (opacity optionally .001 → 1),
// spring `dur` bounce 0, per-token `stagger`, start `delay` (s), once in view (IO threshold 0, margin 0).
// `by` = 'char' | 'word'. Desktop only: `enabled` false renders plain text.
export function Rise({ text, enabled = true, from = 200, dur = 0.6, delay = 0, stagger = 0.025, by = 'char', fade = false }) {
  const [ref, seen] = useInViewOnce()
  if (!enabled) return text
  const ease = springEase(dur)
  // Framer starts its appear in the IO callback; ours waits for a React commit (measured ~30ms later).
  const d0 = Math.max(0, delay - 0.03)
  const tokens = by === 'word' ? text.split(/(\s+)/) : [...text]
  let k = -1
  return (
    <span ref={ref} className="hs-rise">
      {tokens.map((c, i) => {
        if (by === 'word' && /^\s+$/.test(c)) return c
        k++
        return (
          <span
            key={i}
            className="hs-rise-c"
            style={{
              transform: seen ? 'none' : `translateY(${from}px)`,
              opacity: fade && !seen ? 0.001 : undefined,
              transition: seen ? `transform ${dur}s ${ease} ${d0 + k * stagger}s${fade ? `, opacity ${dur}s ${ease} ${d0 + k * stagger}s` : ''}` : 'none',
            }}
          >
            {c}
          </span>
        )
      })}
    </span>
  )
}

// Framer "Staggered Text" by lines (home.md §1.3): words rise translateY(100%) → 0 inside
// overflow:hidden masks, 600ms cubic-bezier(.4,1,.4,1); line n starts at delay + n*lineDelay.
// Trigger useInView(once, margin "-10% 0px") then setTimeout(delay). `paras` = array of strings:
// each paragraph is its own flex-wrap span; the line counter runs across paragraphs (one component).
// `step` > 0 staggers per word instead of per line (Services statements: 60ms per word).
export function Lines({ paras, enabled = true, delay = 100, lineDelay = 120, step = 0, indent = 0, className = 'hs-lines', paraClass = 'hs-lines-par' }) {
  const [ref, seen] = useInViewOnce({ margin: '-10% 0px' })
  const list = Array.isArray(paras) ? paras : [paras]
  useLayoutEffect(() => {
    if (!enabled || step) return
    const el = ref.current
    const assign = () => {
      let line = -1
      let top = null
      el.querySelectorAll('.ws-mask').forEach((m) => {
        const t = m.getBoundingClientRect().top
        if (top === null || Math.abs(t - top) > 5) { line++; top = t }
        m.firstChild.style.transitionDelay = `${delay + line * lineDelay}ms`
      })
    }
    assign()
    if (document.fonts) document.fonts.ready.then(assign)
    window.addEventListener('resize', assign)
    return () => window.removeEventListener('resize', assign)
  }, [enabled, step, delay, lineDelay, ref])
  if (!enabled) return list.length === 1 ? list[0] : list.map((t, i) => <span key={i} className={paraClass}>{t}</span>)
  let k = -1
  return (
    <span ref={ref} className={className}>
      {list.map((t, pi) => (
        <span key={pi} className={paraClass}>
          {t.split(/(?<=\s)/).map((w, i) => {
            k++
            return (
              <span key={i} className="ws-mask">
                <span
                  className="ws-word"
                  style={{
                    marginLeft: pi === 0 && i === 0 && indent ? indent : undefined,
                    transform: seen ? 'translateY(0%)' : 'translateY(100%)',
                    transition: 'transform 600ms cubic-bezier(.4,1,.4,1)',
                    transitionDelay: step ? `${delay + k * step}ms` : undefined,
                  }}
                >
                  {w}
                </span>
              </span>
            )
          })}
        </span>
      ))}
    </span>
  )
}

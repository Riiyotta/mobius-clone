import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useInViewOnce } from '../../lib/useInViewOnce'

// Studio-only motion helpers (studio.md §2, §4.1, §4.2, §4.5).

// Framer "Staggered Text" (shared-lib): words in overflow:hidden inline-block masks, inner span
// translateY(100%) → 0 via CSS transition 600ms cubic-bezier(.4,1,.4,1). Trigger: useInView(once,
// margin "-10% 0px") then setTimeout(initialDelay). by="lines": delay = lineIndex × lineDelay, lines
// measured across ALL paragraphs from word tops (>5px change = new line). by="words": delay = i × step.
// `paras` renders one <ParaTag> per string inside the root (intro: flex column, gap 32 from CSS).
export function StaggerText({
  as: Tag = 'span', paraAs: ParaTag, paras, text, className, paraClassName,
  by = 'lines', lineDelay = 120, step = 60, initialDelay = 0, enabled = true,
}) {
  const [ref, seen] = useInViewOnce({ margin: '-10% 0px' })
  const [go, setGo] = useState(false)
  const [lines, setLines] = useState([])
  const list = paras || [text]

  useEffect(() => {
    if (!seen) return
    const t = setTimeout(() => setGo(true), initialDelay)
    return () => clearTimeout(t)
  }, [seen, initialDelay])

  useLayoutEffect(() => {
    if (!enabled || by !== 'lines' || !ref.current) return
    const root = ref.current
    const measure = () => {
      let line = 0, top = null
      setLines([...root.querySelectorAll('.ws-mask')].map((m) => {
        const t = m.getBoundingClientRect().top
        if (top !== null && Math.abs(t - top) > 5) line++
        top = t
        return line
      }))
    }
    measure()
    let alive = true
    document.fonts?.ready.then(() => alive && measure())
    window.addEventListener('resize', measure)
    return () => { alive = false; window.removeEventListener('resize', measure) }
  }, [enabled, by, ref])

  if (!enabled) {
    if (!ParaTag) return <Tag className={className}>{list.join('\n')}</Tag>
    return <Tag className={className}>{list.map((t, i) => <ParaTag key={i} className={paraClassName}>{t}</ParaTag>)}</Tag>
  }

  let k = 0
  const renderWords = (t) => t.split(/(?<=\s)/).map((w) => {
    const i = k++
    const delay = by === 'lines' ? (lines[i] || 0) * lineDelay : i * step
    return (
      <span key={i} className="ws-mask">
        <span
          className="ws-word"
          style={{
            transform: go ? 'translateY(0%)' : 'translateY(100%)',
            transition: `transform 600ms cubic-bezier(.4,1,.4,1) ${delay}ms`,
            willChange: 'transform',
          }}
        >
          {w}
        </span>
      </span>
    )
  })

  return (
    <Tag ref={ref} className={className}>
      {ParaTag
        ? list.map((t, i) => <ParaTag key={i} className={paraClassName}>{renderWords(t)}</ParaTag>)
        : renderWords(list[0])}
    </Tag>
  )
}

// Text-reveal word order (§4.1): seeded shuffle (seed 300), first word forced first.
// Returns rank[i] = order.indexOf(i).
export function revealRanks(n, seed = 300) {
  let s = seed
  const rnd = () => ((s = (s * 9301 + 49297) % 233280), s / 233280)
  const order = [...Array(n).keys()]
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  const z = order.indexOf(0)
  if (z > 0) { order.splice(z, 1); order.unshift(0) }
  return [...Array(n).keys()].map((i) => order.indexOf(i))
}

// Framer useSpring follower ({stiffness, damping, mass}); integrated in 1ms substeps.
export function makeSpring({ stiffness = 340, damping = 60, mass = 1 } = {}) {
  const s = { x: 0, v: 0, init: false }
  s.snap = (to) => { s.x = to; s.v = 0; s.init = true }
  s.step = (to, dtMs) => {
    if (!s.init) { s.snap(to); return s.x }
    const n = Math.max(1, Math.round(dtMs))
    const h = dtMs / n / 1000
    for (let i = 0; i < n; i++) {
      const a = (-stiffness * (s.x - to) - damping * s.v) / mass
      s.v += a * h
      s.x += s.v * h
    }
    if (Math.abs(s.x - to) < 1e-4 && Math.abs(s.v) < 1e-3) { s.x = to; s.v = 0 }
    return s.x
  }
  return s
}

// rAF loop that only runs while `el` is within `rootMargin` of the viewport.
export function useVisibleLoop(elRef, frame, { rootMargin = '200px', onLeave, enabled = true } = {}) {
  const frameRef = useRef(frame)
  frameRef.current = frame
  const leaveRef = useRef(onLeave)
  leaveRef.current = onLeave
  useEffect(() => {
    const el = elRef.current
    if (!enabled || !el) return
    let raf = 0, last = 0
    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      const dt = last ? Math.min(64, now - last) : 0
      last = now
      frameRef.current(dt)
    }
    const io = new IntersectionObserver((es) => {
      if (es[es.length - 1].isIntersecting) {
        if (!raf) { last = 0; raf = requestAnimationFrame(tick) }
      } else {
        cancelAnimationFrame(raf); raf = 0
        leaveRef.current && leaveRef.current()
      }
    }, { rootMargin })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [elRef, enabled, rootMargin])
}

// Framer appear "onInView" trigger (once, threshold 0, no margin). Measured on the original: it fires
// in the scroll frame itself, ~55ms ahead of an IntersectionObserver callback, so this checks the
// element's rect synchronously on every scroll event (plus once on mount) instead of using IO.
export function useScrollInViewOnce(enabled = true) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    if (!enabled || seen) return
    const check = () => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight && r.bottom > 0 && r.right > 0 && r.left < window.innerWidth) setSeen(performance.now())
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => { window.removeEventListener('scroll', check); window.removeEventListener('resize', check) }
  }, [enabled, seen])
  // seen = detection timestamp (truthy), so JS appears can start their clock at the trigger frame
  return [ref, seen]
}

// JS-driven Framer appear (critically damped spring, bounce 0), per-token stagger. Framer runs these on
// the main thread from the trigger frame; a CSS transition on transform starts ~50ms later in Chromium
// (compositor start-time resolution), so these are stepped in rAF to match the measured onset.
// split: 'chars' (H6 char appear) | 'words' (principle index word appear). fade: opacity 0.001 → 1.
const SPRING_U = 9.233
const springAt = (t, dur) => (t <= 0 ? 0 : t >= dur ? 1 : 1 - Math.exp(-(t / dur) * SPRING_U) * (1 + (t / dur) * SPRING_U))
export function JsAppear({ text, go, split = 'chars', from = 50, dur = 0.8, delay = 0, stagger = 0.025, fade = false }) {
  const els = useRef([])
  useEffect(() => {
    if (!go) return
    const t0 = typeof go === 'number' ? go : performance.now()
    let raf = 0
    const tick = (now) => {
      const t = Math.max(0, now - t0) / 1000
      let done = true
      els.current.forEach((el, i) => {
        if (!el) return
        const p = springAt(t - delay - i * stagger, dur)
        if (p < 1) done = false
        el.style.transform = p >= 1 ? 'none' : `translateY(${(from * (1 - p)).toFixed(3)}px)`
        if (fade) el.style.opacity = p >= 1 ? '1' : String(0.001 + 0.999 * p)
      })
      if (!done) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [go, from, dur, delay, stagger, fade])
  const tokens = split === 'chars' ? [...text] : text.split(' ')
  const hidden = { display: 'inline-block', whiteSpace: 'pre', transform: `translateY(${from}px)`, opacity: fade ? 0.001 : undefined }
  return tokens.map((tk, i) => (
    <span key={i}>
      {split === 'words' && i > 0 && ' '}
      <span ref={(e) => { els.current[i] = e }} style={hidden}>{tk}</span>
    </span>
  ))
}

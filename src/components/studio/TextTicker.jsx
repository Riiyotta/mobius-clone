import { useEffect, useRef } from 'react'

// "Featured Project." InfiniteTicker row (studio.md §3.6, §4.4): base 100 px/s, gap 0,
// frame dt capped at 64ms, x wraps modulo the copy width. Paused when >200px off-screen; stopped
// under reduced motion.
const TEXT = 'Featured Project. '
const COPIES = 4
const SPEED = 100
const DT_CAP = 64
const BOOST_MAX = 1000

export default function TextTicker({ direction = 'left', color }) {
  const rowRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const row = rowRef.current
    const track = trackRef.current
    const sign = direction === 'left' ? -1 : 1
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let x = 0, last = 0, raf = 0
    // Scroll boost (InfiniteTicker scrollToSpeed, §4.4): each scroll event schedules one rAF that reads
    // window.scrollY and sets boost = min(1000, |Δy| / max(1, Δt) * 1000); the ticker frame decays it.
    let boost = 0, sy = window.scrollY, st = performance.now(), sraf = 0
    const onScroll = () => {
      if (sraf) return
      sraf = requestAnimationFrame(() => {
        sraf = 0
        const y = window.scrollY, now = performance.now()
        boost = Math.min(BOOST_MAX, (Math.abs(y - sy) / Math.max(1, now - st)) * 1000)
        sy = y; st = now
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(DT_CAP, last ? now - last : 0) / 1000
      last = now
      if (boost > 0) { boost *= Math.exp(-6 * dt); if (boost < 0.5) boost = 0 }
      const speed = SPEED + boost
      x += sign * speed * dt
      const p = track.firstChild.offsetWidth
      if (p > 0) x = ((x % p) - p) % p
      track.style.transform = `translate3d(${x}px, 0, 0)`
    }
    const start = () => { if (!raf && !reduced) { last = 0; raf = requestAnimationFrame(tick) } }
    const stop = () => { cancelAnimationFrame(raf); raf = 0 }

    const io = new IntersectionObserver((es) => {
      if (es[es.length - 1].isIntersecting) start()
      else stop()
    }, { rootMargin: '200px' })
    io.observe(row)
    return () => { io.disconnect(); stop(); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(sraf) }
  }, [direction])

  return (
    <div ref={rowRef} className="st-tk-row">
      <div ref={trackRef} className="st-tk-track">
        {Array.from({ length: COPIES }, (_, i) => (
          <h2 key={i} className="st-tk-h" style={{ color }} aria-hidden={i > 0 || undefined}>{TEXT}</h2>
        ))}
      </div>
    </div>
  )
}

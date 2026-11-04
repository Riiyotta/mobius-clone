import { useEffect, useRef } from 'react'
import { img } from './projectData'

// §7.4 InfiniteTicker: 100 px/s, gap 0, x wrapped into (−itemWidth, 0], dt clamp 64 ms.
// scrollToSpeed: F = min(1000, |Δscroll|/Δt·1000), decays F *= exp(−6·dt), zeroed < 0.5.
// Paused off-screen (IO rootMargin 200px 0px) and while the tab is hidden.
function Ticker({ dir, className }) {
  const rowRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const row = rowRef.current
    const track = trackRef.current
    const first = track.firstElementChild
    let iw = first.offsetWidth
    let x = 0, F = 0, last = 0, raf = 0, visible = false
    let lastY = window.scrollY, lastT = performance.now(), sraf = 0

    const frame = (now) => {
      const dt = last ? Math.min(64, now - last) / 1000 : 0
      last = now
      F *= Math.exp(-6 * dt)
      if (F < 0.5) F = 0
      x += dir * (100 + F) * dt
      if (iw > 0) {
        x %= iw
        if (x > 0) x -= iw
      }
      track.style.transform = `translateX(${x}px)`
      raf = requestAnimationFrame(frame)
    }
    const sync = () => {
      const run = visible && !document.hidden
      if (run && !raf) { last = 0; track.style.willChange = 'transform'; raf = requestAnimationFrame(frame) }
      else if (!run && raf) { cancelAnimationFrame(raf); raf = 0; track.style.willChange = '' }
    }
    const onScroll = () => {
      if (sraf) return
      sraf = requestAnimationFrame(() => {
        sraf = 0
        const now = performance.now()
        const y = window.scrollY
        const dt = now - lastT
        if (dt > 0) F = Math.min(1000, (Math.abs(y - lastY) / dt) * 1000)
        lastY = y
        lastT = now
      })
    }

    const io = new IntersectionObserver((es) => { visible = es[es.length - 1].isIntersecting; sync() }, { rootMargin: '200px 0px' })
    io.observe(row)
    const ro = new ResizeObserver(() => { iw = first.offsetWidth })
    ro.observe(first)
    document.addEventListener('visibilitychange', sync)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(sraf)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', sync)
      window.removeEventListener('scroll', onScroll)
    }
  }, [dir])

  return (
    <div ref={rowRef} className={`pj-tk-row ${className}`}>
      <div ref={trackRef} className="pj-tk-track">
        {[0, 1, 2].map((i) => (
          <h2 key={i} className="pj-tk-t" aria-hidden={i > 0 || undefined} inert={i > 0 ? '' : undefined}>{'Next Project. '}</h2>
        ))}
      </div>
    </div>
  )
}

// §4.7 Next Case. Card = shared Project Card styles (.card*, CLONE_SPEC §3.5/§5.2):
// Desktop variant hovers (image ×1.2, name char rise); below 1200 the Touch variant shows the name statically.
export default function NextCase({ next }) {
  return (
    <div className="pj-next">
      <div className="pj-tk">
        <Ticker dir={-1} className="pj-tk-a" />
        <Ticker dir={1} className="pj-tk-b" />
      </div>
      <div className="pj-next-row">
        <section className="pj-u4 pj-hide-phone" />
        <div className="pj-u4 pj-next-col">
          <section className="pj-backdrop" />
          <a href={next.href} className="pj-next-link" data-cursor="arrow">
            {/* Phone card is 466.7 tall for 3:4 next images and 465.1 for the others (measured on the original). */}
            <div className={next.imageNatural && next.imageNatural[0] * 4 !== next.imageNatural[1] * 3 ? 'card pj-next-card pj-next-card-alt' : 'card pj-next-card'}>
              <section className="card-img">
                <img src={img(next.image)} alt="Möbius" draggable={false} style={{ objectPosition: next.objectPosition }} />
              </section>
              <div className="card-name">
                <h4 style={{ color: next.nameColor }}>
                  <strong>
                    {[...next.name].map((c, i) => (
                      <span key={i} className="name-char" style={{ animationDelay: `${i * 0.025}s` }}>
                        {c === ' ' ? ' ' : c}
                      </span>
                    ))}
                  </strong>
                </h4>
              </div>
            </div>
          </a>
        </div>
        <section className="pj-u4 pj-hide-phone" />
      </div>
    </div>
  )
}

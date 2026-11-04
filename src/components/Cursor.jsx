import { useEffect, useRef } from 'react'

// Framer "Custom Cursor" (§5.1): fixed 20px black dot following on a spring
// {stiffness 340, damping 60, mass 1}; 120px + white arrow over cards; hidden over nav.
const K = 340, C = 60, M = 1

export default function Cursor() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const p = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 }
    let raf = 0, last = 0, seen = false, variant = ''
    let px = -1, py = -1

    const setVariant = (v) => {
      if (v === variant) return
      variant = v
      el.dataset.variant = v
    }
    const resolve = () => {
      if (px < 0) return
      const t = document.elementFromPoint(px, py)
      const hit = t && t.closest('[data-cursor]')
      setVariant(hit ? hit.dataset.cursor : 'black')
    }
    const step = (now) => {
      const dt = Math.min((now - (last || now)) / 1000, 1 / 30)
      last = now
      const n = Math.max(1, Math.ceil(dt / 0.004))
      const h = dt / n
      for (let i = 0; i < n; i++) {
        p.vx += ((-K * (p.x - p.tx) - C * p.vx) / M) * h
        p.vy += ((-K * (p.y - p.ty) - C * p.vy) / M) * h
        p.x += p.vx * h
        p.y += p.vy * h
      }
      el.style.transform = `translateX(${p.x}px) translateY(${p.y}px)`
      const done = Math.abs(p.x - p.tx) < 0.05 && Math.abs(p.y - p.ty) < 0.05 &&
        Math.abs(p.vx) < 0.05 && Math.abs(p.vy) < 0.05
      if (done) { p.x = p.tx; p.y = p.ty; el.style.transform = `translateX(${p.x}px) translateY(${p.y}px)`; raf = 0; last = 0 }
      else raf = requestAnimationFrame(step)
    }
    const onMove = (e) => {
      if (e.pointerType === 'touch') return
      px = e.clientX; py = e.clientY
      p.tx = px; p.ty = py
      if (!seen) { seen = true; p.x = px; p.y = py; el.dataset.on = '1' }
      resolve()
      if (!raf) raf = requestAnimationFrame(step)
    }
    const onLeave = () => { el.dataset.on = '0'; seen = false }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('canvas:move', resolve)
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('canvas:move', resolve)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div ref={ref} className="cursor" data-variant="black" data-on="0" aria-hidden="true">
      <section className="cursor-bg" />
      <div className="cursor-icon cursor-icon-arrow">
        <svg viewBox="0 0 256 256" width="32" height="32" fill="#fff">
          <path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z" />
        </svg>
      </div>
      <div className="cursor-icon cursor-icon-drag">
        <svg viewBox="0 0 256 256" width="32" height="32" fill="#fff">
          <path d="M240.49,136.49l-32,32a12,12,0,0,1-17-17L203,140H53l11.52,11.51a12,12,0,0,1-17,17l-32-32a12,12,0,0,1,0-17l32-32a12,12,0,1,1,17,17L53,116H203l-11.52-11.51a12,12,0,0,1,17-17l32,32A12,12,0,0,1,240.49,136.49Z" />
        </svg>
      </div>
      <div className="cursor-icon cursor-icon-play">
        <svg viewBox="0 0 256 256" width="40" height="40" fill="#fff">
          <path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z" />
        </svg>
      </div>
    </div>
  )
}

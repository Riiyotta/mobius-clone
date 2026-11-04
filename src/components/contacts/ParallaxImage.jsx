import { useEffect, useRef, useState } from 'react'

// "Parallax Image" (contacts.md §2.2, §4). P = 300 desktop / 200 tablet / 0 phone.
// prog = clamp((vh - top) / (vh + h), 0, 1); img translateY(-(P - prog*P)); written only when the
// change is > 0.1px. top is derived from window.scrollY every frame (works under Lenis).
export default function ParallaxImage({ src, alt = 'Parallax Image', P }) {
  const wrap = useRef(null)
  const img = useRef(null)
  const [mounted, setMounted] = useState(false) // the original mounts the img only after its effect runs
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted || !P) return
    const el = wrap.current
    let docTop = 0
    let h = 0
    let last = null
    let raf = 0
    const measure = () => {
      const r = el.getBoundingClientRect()
      docTop = r.top + window.scrollY
      h = r.height
      last = null
    }
    const tick = () => {
      const vh = window.innerHeight
      const top = docTop - window.scrollY
      const prog = Math.min(1, Math.max(0, (vh - top) / (vh + h)))
      const p = P - prog * P
      if (last === null || Math.abs(p - last) > 0.1) {
        last = p
        img.current.style.transform = `translateY(${-p}px)`
      }
      raf = requestAnimationFrame(tick)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    ro.observe(el)
    window.addEventListener('resize', measure)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [mounted, P])

  return (
    <div ref={wrap} className="ct-par">
      {mounted && (
        <img
          ref={img}
          src={src}
          alt={alt}
          draggable={false}
          style={{ height: `calc(100% + ${P}px)`, transform: `translateY(${-P}px)` }}
        />
      )}
    </div>
  )
}

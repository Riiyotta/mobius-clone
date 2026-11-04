import { useEffect, useRef } from 'react'

// Cursor Image Trail (studio.md §3.1.1). Frequency 10 → spawn distance 200 − 9*199/49 = 163.45px.
// Each spawn: 300x400 div centred on the pointer, background cycled through `images` (contain, centred).
// Enter opacity 0 → 1 (0.4s cubic-bezier(.44,0,.56,1)); exit after 1s with the same tween; removed after 10s.
const DIST = 200 - (9 * 199) / 49
const VISIBLE_MS = 1000
const REMOVE_MS = 10000

export default function CursorTrail({ images }) {
  const ref = useRef(null)

  useEffect(() => {
    const layer = ref.current
    const timers = new Set()
    const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); fn() }, ms); timers.add(id) }
    let last = null
    let n = 0

    // Preload once the layer is >= 10% in view.
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) {
        images.forEach((src) => { const im = new Image(); im.src = src })
        io.disconnect()
      }
    }, { threshold: 0.1 })
    io.observe(layer)

    const spawn = (x, y) => {
      const el = document.createElement('div')
      el.className = 'st-trail-img'
      el.style.left = `${x - 150}px`
      el.style.top = `${y - 200}px`
      el.style.backgroundImage = `url("${images[n++ % images.length]}")`
      layer.appendChild(el)
      void el.offsetWidth // commit opacity 0 before the enter transition
      el.classList.add('is-in')
      later(() => el.classList.remove('is-in'), VISIBLE_MS)
      later(() => el.remove(), REMOVE_MS)
    }

    const onEnter = () => { last = null }
    const onMove = (e) => {
      if (e.pointerType === 'touch') return
      const r = layer.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      if (last && Math.hypot(x - last.x, y - last.y) <= DIST) return
      last = { x, y }
      spawn(x, y)
    }

    layer.addEventListener('pointerenter', onEnter)
    layer.addEventListener('pointermove', onMove)
    return () => {
      io.disconnect()
      timers.forEach(clearTimeout)
      layer.removeEventListener('pointerenter', onEnter)
      layer.removeEventListener('pointermove', onMove)
      layer.replaceChildren()
    }
  }, [images])

  return <div ref={ref} className="st-trail" aria-hidden="true" />
}

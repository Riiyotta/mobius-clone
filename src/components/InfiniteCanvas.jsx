import { useEffect, useRef } from 'react'
import { cards, TILE_W, TILE_H } from '../data'
import ProjectCard from './ProjectCard'

// Framer "Infinite Canvas" (§4). scrollSpeed 0.4 → 0.73333, dragSpeed 0.8 → 1.57778, ease 0.2 → lerp 0.048.
const WHEEL = 0.1 + ((0.4 - 0.1) / 0.9) * 1.9
const DRAG = 0.1 + ((0.8 - 0.1) / 0.9) * 1.9
const LERP = 0.01 + 0.2 * 0.19
const PERIOD_X = TILE_W * 2
const PERIOD_Y = TILE_H * 2
const CULL = 1000

// Originals first (12 → 01), then 3 copies of each, like the original DOM.
const OFFSETS = [[-TILE_W, 0], [0, -TILE_H], [-TILE_W, -TILE_H]]
const copies = [
  ...cards.map((c) => ({ card: c, ox: 0, oy: 0 })),
  ...cards.flatMap((c) => OFFSETS.map(([ox, oy]) => ({ card: c, ox, oy }))),
]

export default function InfiniteCanvas() {
  const rootRef = useRef(null)
  const els = useRef([])

  useEffect(() => {
    const root = rootRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lerp = reduced ? 1 : LERP
    const s = { x: 0, y: 0, tx: 0, ty: 0, lastX: 0, lastY: 0, dx: 0, dy: 0 }
    const st = copies.map((c) => ({
      ...c, ex: 0, ey: 0, v: Math.random() * 0.5 + 0.5, vis: null,
    }))
    let vw = window.innerWidth, vh = window.innerHeight
    let raf = 0, dragging = false, drag = null

    const place = () => {
      const orgX = (vw - TILE_W) / 2, orgY = (vh - TILE_H) / 2
      const mvx = s.x - s.lastX, mvy = s.y - s.lastY
      for (let i = 0; i < st.length; i++) {
        const c = st[i], el = els.current[i]
        if (!el) continue
        const { w, h } = c.card
        const vel = reduced ? 0 : 5 * c.v
        let cx = c.card.x + c.ox + s.x + c.ex + vel * s.dx
        let cy = c.card.y + c.oy + s.y + c.ey + vel * s.dy
        if (mvx > 0 && cx > TILE_W) { c.ex -= PERIOD_X; cx -= PERIOD_X }
        else if (mvx < 0 && cx + w < 0) { c.ex += PERIOD_X; cx += PERIOD_X }
        if (mvy > 0 && cy > TILE_H) { c.ey -= PERIOD_Y; cy -= PERIOD_Y }
        else if (mvy < 0 && cy + h < 0) { c.ey += PERIOD_Y; cy += PERIOD_Y }
        el.style.transform = `translate(${cx}px, ${cy}px)`
        const sx = orgX + cx, sy = orgY + cy
        const vis = sx + w > -CULL && sx < vw + CULL && sy + h > -CULL && sy < vh + CULL
        if (vis !== c.vis) {
          c.vis = vis
          el.style.opacity = vis ? '1' : '0'
          el.style.pointerEvents = vis ? 'auto' : 'none'
        }
      }
    }

    const tick = () => {
      s.x += (s.tx - s.x) * lerp
      s.y += (s.ty - s.y) * lerp
      s.dx += (s.x - s.lastX - s.dx) * 0.08
      s.dy += (s.y - s.lastY - s.dy) * 0.08
      place()
      s.lastX = s.x; s.lastY = s.y
      window.dispatchEvent(new Event('canvas:move'))
      const moving = Math.abs(s.tx - s.x) > 0.02 || Math.abs(s.ty - s.y) > 0.02 ||
        Math.abs(s.dx) > 0.01 || Math.abs(s.dy) > 0.01
      raf = moving || dragging ? requestAnimationFrame(tick) : 0
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick) }

    const onWheel = (e) => {
      e.preventDefault()
      s.tx -= e.deltaX * WHEEL
      s.ty -= e.deltaY * WHEEL
      kick()
    }
    const onDown = (e) => {
      if (e.button !== 0) return
      dragging = true
      drag = { x: e.clientX, y: e.clientY, sx: s.tx, sy: s.ty }
      kick()
    }
    const onMove = (e) => {
      if (!dragging) return
      e.preventDefault()
      s.tx = drag.sx + (e.clientX - drag.x) * DRAG
      s.ty = drag.sy + (e.clientY - drag.y) * DRAG
      kick()
    }
    const onUp = () => { dragging = false }
    let rt = 0
    const onResize = () => {
      clearTimeout(rt)
      rt = setTimeout(() => { vw = window.innerWidth; vh = window.innerHeight; place() }, 100)
    }

    place()
    root.addEventListener('wheel', onWheel, { passive: false })
    root.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(rt)
      root.removeEventListener('wheel', onWheel)
      root.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div ref={rootRef} className="canvas" data-cursor="black">
      <div className="tile">
        {copies.map((c, i) => (
          <ProjectCard key={i} card={c.card} ref={(el) => (els.current[i] = el)} />
        ))}
      </div>
    </div>
  )
}

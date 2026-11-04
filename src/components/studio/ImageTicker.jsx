import { useEffect, useRef } from 'react'

// Image Ticker (studio.md §3.4, §4.4, §5.5): 100 px/s leftward, no hover slow-down, draggable 1:1.
// On release the drag velocity decays back to the base speed.
const img = (id) => `/assets/img/${id}.jpg`
const ITEMS = [
  ['uRGiLtgI5zZUR189HzAdcLcS3E', 2464 / 1856],
  ['qIAz9adFiLA0mb3195WsiTZjG8', 1392 / 1856],
  ['k0V30JNeHj4BUCaCPkC8p2qTp5o', 2464 / 1856],
  ['nuX4yxFg5l3eeENclb1OpZqsoc', 1],
]
const COPIES = 3
const BASE = -100 // px/s
// ASSUMPTION (spec §8: decay constant not documented): exponential decay of the extra velocity,
// k chosen so a −500 px/s release is back to −100 px/s within ~1.8s as measured.
const DECAY = 2.5
const VEL_WINDOW = 100 // ms of pointer samples used for the release velocity

export default function ImageTicker() {
  const boxRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const box = boxRef.current
    const track = trackRef.current
    let x = 0, extra = 0, last = 0, raf = 0
    let drag = null
    let samples = []

    const period = () => {
      const kids = track.children
      return kids[ITEMS.length].offsetLeft - kids[0].offsetLeft
    }
    const render = () => {
      const p = period()
      if (p > 0) x = ((x % p) - p) % p
      track.style.transform = `translate3d(${x}px, 0, 0)`
    }
    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      const dt = last ? (now - last) / 1000 : 0
      last = now
      if (!drag) {
        x += (BASE + extra) * dt
        extra *= Math.exp(-DECAY * dt)
        if (Math.abs(extra) < 0.5) extra = 0
      }
      render()
    }
    raf = requestAnimationFrame(tick)

    const onDown = (e) => {
      if (e.button !== 0) return
      drag = { px: e.clientX, x0: x }
      samples = [{ t: e.timeStamp, x: e.clientX }]
      extra = 0
      box.setPointerCapture(e.pointerId)
    }
    const onMove = (e) => {
      if (!drag) return
      x = drag.x0 + (e.clientX - drag.px)
      drag.x0 = x; drag.px = e.clientX
      samples.push({ t: e.timeStamp, x: e.clientX })
      while (samples.length > 2 && e.timeStamp - samples[0].t > VEL_WINDOW) samples.shift()
    }
    const onUp = (e) => {
      if (!drag) return
      drag = null
      const a = samples[0]
      const b = samples[samples.length - 1]
      const dt = (e.timeStamp - a.t) / 1000
      const v = dt > 0 && e.timeStamp - b.t < VEL_WINDOW ? (b.x - a.x) / dt : 0
      extra = v - BASE
    }
    box.addEventListener('pointerdown', onDown)
    box.addEventListener('pointermove', onMove)
    box.addEventListener('pointerup', onUp)
    box.addEventListener('pointercancel', onUp)
    return () => {
      cancelAnimationFrame(raf)
      box.removeEventListener('pointerdown', onDown)
      box.removeEventListener('pointermove', onMove)
      box.removeEventListener('pointerup', onUp)
      box.removeEventListener('pointercancel', onUp)
    }
  }, [])

  return (
    <div ref={boxRef} className="st-gal-ticker" data-cursor="drag">
      <ul ref={trackRef} className="st-gal-track">
        {Array.from({ length: COPIES }, (_, c) =>
          ITEMS.map(([id, ar]) => (
            <li key={`${c}-${id}`} className="st-gal-li" style={{ aspectRatio: ar }} aria-hidden={c > 0 || undefined}>
              <section className="st-gal-img" style={{ backgroundImage: `url("${img(id)}")` }} />
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { PlayFill, X } from './HomeIcons'
import { useScrollLoop } from './Motion'

// §4.2 Reel (home.md). Tickers are rendered STATIC (translateX 0).
// MOTION (Animation pass): ticker A moves left, B right, 100 px/s + scroll-velocity boost
// (min 1000, decay e^(-6dt)), wrap modulo item width, dt cap 64ms, pause off-screen (IO 200px).
// Drive `.hs-tk-track` transform. Phone: tickers are not rendered.
const VIDEO = '/assets/video/k5BuF5agb7jRFUwK2jzQ0zjqjro.mp4'
const POSTER = '/assets/img/NpmO2eWasqY9hCe8AtNpjN8Is0.jpg'
const TEXT = 'Ideas in Motion. '
// Measured: base 100 px/s (100.0); plus a boost from |scroll velocity| (capped 1000); wrap modulo the
// item width; dt cap 64ms; loop paused off-screen (IO rootMargin 200px). A moves left, B right.
const BASE = 100
// Empirical: the original's boost reads ~0.9× (Lenis) / ~0.8× (native wheel) of this event velocity.
const GAIN = 0.88

// Boost: on every scroll EVENT, boost = min(1000, |Δy| / Δt since the previous scroll event); every frame
// boost ×= e^(−6·dt). This one model fits both measured cases: Lenis on desktop (boost ≈ scroll velocity,
// e.g. 547 / 629 px/s ticker speed at 500 / 585 px/s scroll) and native wheel steps on tablet (boost holds and
// decays ×0.3 per 200ms after the last step).
function useTickers(ref, enabled) {
  const st = useRef({ pos: 0, boost: 0, lastY: null, lastT: 0 })
  useEffect(() => {
    if (!enabled) return
    const s = st.current
    const onScroll = () => {
      const t = performance.now()
      const y = window.scrollY
      if (s.lastY !== null) {
        const dt = Math.max(1 / 240, (t - s.lastT) / 1000)
        s.boost = Math.min(1000, GAIN * Math.abs(y - s.lastY) / dt)
      }
      s.lastY = y
      s.lastT = t
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [enabled])
  useScrollLoop(ref, (y, vh, dt, settle) => {
    const s = st.current
    const root = ref.current
    if (settle && s.pos) return
    if (!settle) {
      s.pos += (BASE + s.boost) * dt
      s.boost *= Math.exp(-6 * dt)
    }
    root.querySelectorAll('.hs-tk-track').forEach((t) => {
      const W = t.firstChild.offsetWidth || 1
      const m = s.pos % W
      t.style.transform = `translateX(${(t.dataset.dir === 'left' ? -m : -W + m).toFixed(2)}px)`
    })
  }, { enabled, margin: '200px 0px' })
}

function Ticker({ variant }) {
  return (
    <div className={`hs-tk hs-tk-${variant}`}>
      <div className="hs-tk-track" data-dir={variant === 'a' ? 'left' : 'right'}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="hs-tk-item">
            <h2 className="hs-tk-h2">{TEXT}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

// Lightbox: fixed overlay z 10. Backdrop opacity 0.001 → 1 (spring 0.6); close button enters from
// translate(110px, -110px), spring 0.8, delay 1.2s. Cursor over the overlay = White variant.
// The original layer is named "Sound On Play", so the lightbox video plays with sound.
function Lightbox({ onClose }) {
  return createPortal(
    <div className="hs-lb" data-cursor="white" role="dialog" aria-modal="true" aria-label="Möbius reel">
      <div className="hs-lb-bg" />
      <video className="hs-lb-video" src={VIDEO} poster={POSTER} autoPlay loop playsInline />
      <button type="button" className="hs-lb-close" onClick={onClose} aria-label="Close">
        <X className="hs-lb-x" />
      </button>
    </div>,
    document.body,
  )
}

export default function Reel({ desktop, phone }) {
  const [open, setOpen] = useState(false)
  const videoRef = useRef(null)
  const tickers = useRef(null)
  useTickers(tickers, !phone)
  // Pause the inline reel while the lightbox plays (so two copies don't run at once).
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (open) v.pause()
    else v.play().catch(() => {})
  }, [open])

  return (
    <div className="hs-reel">
      {!phone && (
        <div className="hs-tickers" ref={tickers}>
          <Ticker variant="a" />
          <Ticker variant="b" />
        </div>
      )}
      <div className="hs-reel-c">
        <section className="hs-reel-side" />
        <div className="hs-reel-mid">
          <div
            className="hs-reel-vc"
            data-cursor={desktop ? 'play' : undefined}
            onClick={() => setOpen(true)}
          >
            <video
              ref={videoRef}
              className="hs-reel-video"
              src={VIDEO}
              poster={POSTER}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
            {!desktop && (
              <div className="hs-reel-play" aria-hidden="true">
                <section className="hs-reel-play-bg" />
                <PlayFill className="hs-reel-play-ic" />
              </div>
            )}
          </div>
        </div>
        <section className="hs-reel-side" />
      </div>
      {open && <Lightbox onClose={() => setOpen(false)} />}
    </div>
  )
}

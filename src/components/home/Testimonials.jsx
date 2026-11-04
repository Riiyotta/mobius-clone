import { useEffect, useRef, useState } from 'react'
import ImageReveal from '../fx/ImageReveal'
import { Lines, Rise } from './Motion'

// §4.9 Client reflections (home.md).
// Desktop: one slide visible, 10s autoplay; change = wrapper opacity 1 → 0 (.3s ease-in-out),
// swap at 300ms, 0 → 1. Prev/next 52x52 image buttons (no hover). Slides are stacked in one grid
// cell so the slideshow is as tall as its tallest slide; each slide has min-height 66vh.
// Tablet/phone: horizontal carousel (one slide per view, snap) with 5 dot buttons.
// MOTION (Animation pass): Image Reveal wipe on `.hs-sl-img` (1.2s cubic-bezier(.6,0,.4,1), on view);
// H2 char rise. Images are rendered fully visible here.
const SLIDES = [
  { q: '“Möbius® turned our complex ideas into something clear and elegant. They understood our goals quickly and shaped a design language that feels natural to us.”', name: 'Clara Jensen', co: 'Vela Studio', img: 'JUqCPovcIKHCGuuLShMUORkvJI.jpg' },
  { q: '“They delivered a level of clarity we’d been missing for years. Möbius® took our scattered thoughts and shaped them into a cohesive identity that finally feels right.”', name: 'Jonas Berg', co: 'Arcton Labs', img: '8s1d41G36Gw3wKjdAqv9BP0vZo.jpg' },
  { q: '“Möbius® turned our complex ideas into something clear and elegant. They understood our goals quickly and shaped a design language that feels natural to us.”', name: 'Sophie Adler', co: 'Norrhaven Collective', img: 'dsv8pyXntSx7GoSgWObJlj2AfI.jpg' },
  { q: '“Working with Möbius® was refreshingly straightforward. Strong ideas, precise execution, and a calm process from start to finish. The result speaks for itself.”', name: 'Markus Lehn', co: 'Lumen Technologies', img: 'wO8Iq3rw5mv83TUR6LomHKgu0.jpg' },
  { q: '“Möbius® brought clarity to a project that had lost direction. They listened, understood our needs, and delivered a system that feels modern and grounded.”', name: 'Daniel Weiss', co: 'Helio Projects', img: 'WnrOxsOsaOPvCTyZrMzybh6jck.jpg' },
]
const AUTOPLAY_MS = 10000
const FADE_MS = 300

const Text = ({ s, anim = false }) => (
  <div className="hs-sl-tc">
    <div className="hs-sl-q"><h4 className="hs-sl-quote">{anim ? <Lines paras={s.q} delay={300} /> : s.q}</h4></div>
    <div className="hs-sl-info">
      <p className="hs-sl-name"><strong>{s.name}</strong></p>
      <p className="hs-sl-co">{s.co}</p>
    </div>
  </div>
)

function Slideshow() {
  const [idx, setIdx] = useState(0)
  const [fading, setFading] = useState(false)
  const swap = useRef(0)

  const go = (next) => {
    if (fading) return
    setFading(true)
    swap.current = setTimeout(() => {
      setIdx((next + SLIDES.length) % SLIDES.length)
      setFading(false)
    }, FADE_MS)
  }
  // 10s autoplay; the countdown restarts after every change (manual or automatic).
  useEffect(() => {
    const t = setTimeout(() => go(idx + 1), AUTOPLAY_MS)
    return () => clearTimeout(t)
  }, [idx]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => clearTimeout(swap.current), [])

  return (
    <div className="hs-ss">
      <div className="hs-ss-wrap" style={{ opacity: fading ? 0 : 1 }}>
        {SLIDES.map((s, i) => (
          <nav key={i} className={`hs-sl ${i === idx ? 'is-active' : ''}`} aria-hidden={i !== idx}>
            <div className="hs-sl-c1">
              <div className="hs-sl-num"><h3 className="hs-sl-n">/</h3><h3 className="hs-sl-n">{i + 1}</h3></div>
            </div>
            <div className="hs-sl-c2">
              <div className="hs-sl-imgw">
                <ImageReveal className="hs-sl-img" src={`/assets/img/${s.img}`} alt={s.name} />
              </div>
            </div>
            <section className="hs-sl-c3" />
            <div className="hs-sl-c4"><Text s={s} anim /></div>
            <section className="hs-sl-c3" />
          </nav>
        ))}
      </div>
      <div className="hs-ss-btns">
        <button type="button" className="hs-ss-btn" onClick={() => go(idx - 1)} aria-label="Previous">
          <img src="/assets/img/Y2CbMz6nMvzORpEeUWKNPoJjl0o.svg" alt="" draggable={false} />
        </button>
        <button type="button" className="hs-ss-btn" onClick={() => go(idx + 1)} aria-label="Next">
          <img src="/assets/img/dhOQBZ3XWETUqBdaK3jfSA2HOPw.svg" alt="" draggable={false} />
        </button>
      </div>
    </div>
  )
}

function Carousel() {
  const track = useRef(null)
  const [active, setActive] = useState(0)
  const onScroll = () => {
    const el = track.current
    if (el) setActive(Math.round(el.scrollLeft / el.clientWidth))
  }
  const goTo = (i) => {
    const el = track.current
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }
  return (
    <div className="hs-car">
      <div className="hs-car-track" ref={track} onScroll={onScroll}>
        {SLIDES.map((s, i) => (
          <nav key={i} className="hs-cs">
            <section className="hs-cs-side" />
            <div className="hs-cs-c">
              <div className="hs-cs-imgw">
                <section className="hs-cs-img"><img src={`/assets/img/${s.img}`} alt={s.name} draggable={false} /></section>
              </div>
              <div className="hs-cs-tw"><Text s={s} /></div>
            </div>
            <section className="hs-cs-side" />
          </nav>
        ))}
      </div>
      <div className="hs-car-dots">
        {SLIDES.map((s, i) => (
          <button
            key={i}
            type="button"
            className={`hs-car-dot ${i === active ? 'is-active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          >
            <span />
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Testimonials({ desktop }) {
  return (
    <div className="hs-ts">
      <div className="hs-ts-head">
        <section className="hs-ts-side" />
        <div className="hs-ts-mid">
          <div className="hs-ts-tc"><h2 className="hs-h2"><Rise text="Client reflections" enabled={desktop} delay={0.1} /></h2></div>
          <div className="hs-ts-tc"><p className="hs-body hs-ts-p"><Lines enabled={desktop} delay={200} paras="Honest impressions from the teams we’ve collaborated with across brand and digital work." /></p></div>
        </div>
        <section className="hs-ts-side" />
      </div>
      {desktop ? (
        <Slideshow />
      ) : (
        <>
          <section className="hs-ts-bar" />
          <Carousel />
        </>
      )}
    </div>
  )
}

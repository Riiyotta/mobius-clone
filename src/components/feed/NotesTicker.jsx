import { useEffect, useRef } from 'react'
import { posts, imgSrc, aspect } from './feedData'

// A1.1 card. First card of each column uses the 16px preset, the rest 14px.
function TickerCard({ post, first }) {
  const href = `/feed/${post.slug}`
  return (
    <div className="fd-card">
      <a href={href} className="fd-card-img" data-cursor="arrow" style={{ aspectRatio: aspect(post.cover) }}>
        <img src={imgSrc(post.cover)} alt={post.cover.alt} draggable={false} style={{ objectPosition: post.cover.objectPosition }} />
      </a>
      <div className="fd-card-text">
        <p className="fd-t-small fd-t-date">{post.date}</p>
        <div className="fd-card-inner">
          <h6 className="fd-t-card">
            <a href={href} data-cursor="hidden"><strong>{post.title}</strong></a>
          </h6>
          <p className={first ? 'fd-t-body fd-card-ex fd-card-ex-first' : 'fd-t-small fd-card-ex'}>{post.excerpt}</p>
        </div>
      </div>
    </div>
  )
}

const List = ({ items, hidden }) => (
  <div aria-hidden={hidden || undefined}>
    {items.map((p, i) => <TickerCard key={p.slug} post={p} first={i === 0} />)}
  </div>
)

// A3: y += dt * v * dir, v = (speed/100)*0.25 px/ms; wrap at n = scrollHeight/2.
// Wheel: boost = -deltaY*0.05, persistent direction flips to the wheel's sign,
// |boost|>0.1 drives at |boost|/2 px/ms, decays *0.95/frame once 100ms past the last wheel.
function TickerColumn({ items, speed, direction }) {
  const colRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const col = colRef.current
    const track = trackRef.current
    const v = (speed / 100) * 0.25
    let dir = direction === 'up' ? -1 : 1
    let y = 0, boost = 0, lastWheel = 0, last = 0, raf = 0

    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      if (!last) { last = now; return }
      const dt = now - last
      last = now
      if (Math.abs(boost) > 0.1) y += dt * (boost / 2)
      else y += dt * v * dir
      if (now - lastWheel > 100) boost *= 0.95
      const n = track.scrollHeight / 2
      if (n > 0) {
        if (y <= -n) y = 0
        else if (y >= 0) y = -n
      }
      track.style.transform = `translateY(${y}px)`
    }
    raf = requestAnimationFrame(tick)

    const onWheel = (e) => {
      e.preventDefault()
      boost = -e.deltaY * 0.05
      lastWheel = performance.now()
      dir = boost < 0 ? -1 : 1
    }
    const reset = () => { boost = 0 }
    col.addEventListener('wheel', onWheel, { passive: false })
    col.addEventListener('mouseleave', reset)
    const winEvents = ['mouseleave', 'mouseout', 'blur', 'mouseup']
    winEvents.forEach((t) => window.addEventListener(t, reset))
    return () => {
      cancelAnimationFrame(raf)
      col.removeEventListener('wheel', onWheel)
      col.removeEventListener('mouseleave', reset)
      winEvents.forEach((t) => window.removeEventListener(t, reset))
    }
  }, [speed, direction])

  return (
    <div className="fd-col" ref={colRef}>
      <div className="fd-col-view">
        <div className="fd-col-track" ref={trackRef}>
          <List items={items} />
          <List items={items} hidden />
        </div>
      </div>
    </div>
  )
}

// Column membership is round-robin by CMS index (A: 1,4,7,10 / B: 2,5,8,11 / C: 3,6,9).
const COLUMNS = [
  { speed: 20, direction: 'up' },
  { speed: 30, direction: 'down' },
  { speed: 10, direction: 'up' },
]

export default function NotesTicker() {
  return (
    <div className="fd-ticker">
      {COLUMNS.map((c, k) => (
        <TickerColumn key={k} items={posts.filter((_, i) => i % 3 === k)} speed={c.speed} direction={c.direction} />
      ))}
    </div>
  )
}

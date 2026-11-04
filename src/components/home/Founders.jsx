import { useRef } from 'react'
import ButtonA from '../legal/ButtonA'
import { Lines, Rise, docTop, makeSpring, useScrollLoop } from './Motion'

// Card link (measured): p = clamp((vh − top)/565.7, 0, 1) on the untransformed card-container top,
// cc1 y = −200(1 − p), cc2 y = −50(1 − p), spring {stiffness 340, damping 60, mass 1}. Desktop only.
const SPRING = { stiffness: 340, damping: 60, mass: 1 }
const FROM = { 'hs-fd-cc1': -200, 'hs-fd-cc2': -50 }
function useCards(ref, enabled) {
  const st = useRef([])
  useScrollLoop(ref, (y, vh, dt, settle) => {
    ref.current.querySelectorAll('.hs-fd-cc').forEach((el, i) => {
      const from = FROM[el.classList[1]] || 0
      const s0 = st.current[i]
      const top = docTop(el, s0 ? s0.x : 0) - y
      const target = from * (1 - Math.min(1, Math.max(0, (vh - top) / 565.7)))
      const s = s0 || (st.current[i] = makeSpring(SPRING, target))
      // Framer's spring sees the new scroll value one frame after this loop does (measured ~17ms).
      const v = settle ? (s.x = s.p = target, s.v = 0, target) : s.step(s.p ?? target, dt)
      s.p = target
      el.style.transform = v === 0 ? 'none' : `translateY(${v.toFixed(3)}px)`
    })
  }, { enabled, margin: '100% 0px' })
}

// §4.6 Founders (home.md). Card containers render at rest (y 0).
// MOTION (Animation pass): `.hs-fd-cc1` y −200 → 0 and `.hs-fd-cc2` y −50 → 0 with
// p = clamp((vh − top)/565.7, 0, 1) on the untransformed top, spring {340, 60, 1}; H6 char effect.
// Built here: the desktop Team Card hover (image 120%, backdrop, name/role char rise, spring 0.6).
const CARDS = [
  { cls: 'hs-fd-cc1', img: 'k1yRftQfPk4lIWxRe2Tfq5h4ZEk.jpg', name: 'Jonas Richter', role: 'Founder & Creative Director' },
  { cls: 'hs-fd-cc2', img: 'YVYiW8vzXkPuMM5MMZ5eURVsRKQ.jpg', name: 'Tobias Keller', role: 'Founder & Strategy Director' },
]

// Desktop: each char rises y 200 → 0 on hover (stagger .025, spring 0.6). Touch: plain text.
const Chars = ({ text, on }) =>
  on
    ? [...text].map((c, i) => (
        <span key={i} className="hs-tc-ch" style={{ animationDelay: `${i * 0.025}s` }}>{c}</span>
      ))
    : text

function TeamCard({ c, desktop }) {
  return (
    <a href="./studio" className={`hs-tc ${desktop ? 'hs-tc-desk' : ''}`} data-cursor="arrow">
      <div className="hs-tc-img"><img src={`/assets/img/${c.img}`} alt={c.name} draggable={false} /></div>
      <div className="hs-tc-bd" />
      <div className="hs-tc-txt">
        <div className="hs-tc-clip"><h4 className="hs-tc-name"><strong><Chars text={c.name} on={desktop} /></strong></h4></div>
        <div className="hs-tc-clip"><p className="hs-tc-role"><Chars text={c.role} on={desktop} /></p></div>
      </div>
    </a>
  )
}

export default function Founders({ desktop }) {
  const imgs = useRef(null)
  useCards(imgs, desktop)
  return (
    <div className="hs-fd">
      <section className="hs-bar" />
      <div className="hs-fd-cards">
        <div className="hs-fd-text">
          <div className="hs-fd-hc">
            <div className="hs-fd-h6c"><h6 className="hs-h6"><strong><Rise text="Our Founders" enabled={desktop} from={50} dur={0.8} delay={0.1} /></strong></h6></div>
          </div>
          <div className="hs-fd-pc">
            <p className="hs-body hs-fd-p"><Lines enabled={desktop} delay={200} paras="Founded by Jonas Richter and Tobias Keller, Möbius® began as a shared belief in how design should feel: clear, thoughtful, and human. What started as a focused partnership has grown into a small team with a strong collective mindset, bringing structure, imagination, and craft to every project we take on." /></p>
          </div>
          <div className="hs-fd-bc">
            <ButtonA label="Meet the Team" href="./studio" desktop={desktop} />
          </div>
        </div>
        <div className="hs-fd-imgs" ref={imgs}>
          {CARDS.map((c) => (
            <div key={c.img} className="hs-fd-sec">
              <div className={`hs-fd-cc ${c.cls}`}><TeamCard c={c} desktop={desktop} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

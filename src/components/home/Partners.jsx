import { useRef } from 'react'
import { makeSpring, useScrollLoop } from './Motion'
// §4.7 Our Partners (home.md). Static layout: heading at opacity 1, image at translateY 0.
// MOTION (Animation pass):
//  - heading fade `.hs-pt-h2` opacity 1 → 0.02 while `.hs-pt-marker` (240px, top of the logo grid)
//    goes from marker top = vh to vh − 240 (desktop).
//  - parallax `.hs-pt-img img`: translateY = −300 + (scrollY − (imageTop − vh))/6, clamped [−300, 0]
//    (desktop; the tablet dump shows the same rest offset with a 200px overflow, phone has none).
// Built here: Partner Logo hover (image scale → 1.6, spring 0.4), desktop only.
//
// Logo box: p% of a (cell width, capped at 320px) x (cell height) box, centred in the cell. This fits all
// 12 logos at 1440 and 1280 exactly; p is per logo, and differs on phone. Grid order differs per breakpoint.
const L = {
  '6KUB': ['6KUBJx1dbqL2lxMP2u9Fzuiwk', 0.5, 0.7],
  NIbu: ['NIbuhT0QGj7fz0t7jXI6Gk6J1c', 0.65, 0.75],
  '6QEz': ['6QEz8kJbwqWFzbNDcgcMwaBk7Jk', 0.5, 0.65],
  yJJE: ['yJJEeKpFDSGeb3f2rZJDTMuwQ', 0.35, 0.45],
  av9j: ['av9jNJI3hHXZ6T1DdxDCPoRrdbY', 0.35, 0.5],
  kurr: ['kurrL4pv84sniLEt0JYjzeBZq58', 0.45, 0.65],
  RgTo: ['RgToa1Q7FVIjrJV0tHApD9hInTU', 0.35, 0.45],
  Rsaj: ['RsaJCL4Sj4fVM9spQ7bKyrgyngo', 0.45, 0.7],
  '3Y1x': ['3Y1x3Iz9CnzoCeLjfRflZMOiF0', 0.4, 0.65],
  qc6W: ['qc6WiaOLMJCgLjRA2nE1Poq3zLk', 0.35, 0.5],
  G901: ['G901ZjDCZB5sKU1V2zrEUrdGKis', 0.4, 0.55],
  WLPK: ['WLPKtH14Ct7v2NfwWdkFssnvloU', 0.32, 0.5],
}

// Measured: heading opacity = 1 − 0.98·clamp((vh − markerTop)/240, 0, 1) (.833 @11000, .424 @11100,
// .02 from 11200); image translateY = clamp(−300 + (scrollY − (imageTop − vh))/6, −300, 0). Desktop.
const ORDER_DESK = ['6KUB', 'NIbu', '6QEz', 'yJJE', 'av9j', 'kurr', 'RgTo', 'Rsaj', '3Y1x', 'qc6W', 'G901', 'WLPK']
const ORDER_TAB = ['6KUB', 'NIbu', 'yJJE', '6QEz', 'av9j', 'kurr', 'RgTo', 'Rsaj', 'qc6W', '3Y1x', 'WLPK', 'G901']
const ORDER_PHONE = ['6KUB', 'yJJE', 'av9j', 'NIbu', 'kurr', 'RgTo', 'qc6W', '6QEz', 'Rsaj', 'WLPK', 'G901', '3Y1x']
const CAPTION = 'Here are some of the brands we’ve had the privilege to collaborate with.'

export default function Partners({ desktop, phone }) {
  const order = desktop ? ORDER_DESK : phone ? ORDER_PHONE : ORDER_TAB
  const root = useRef(null)
  const fade = useRef(makeSpring({ stiffness: 340, damping: 60, mass: 1 }, 1))
  useScrollLoop(root, (y, vh, dt, settle) => {
    const el = root.current
    const h2 = el.querySelector('.hs-pt-h2')
    const m = el.querySelector('.hs-pt-marker').getBoundingClientRect().top
    const f = Math.min(1, Math.max(0, (vh - m) / 240))
    // Smoothed like the founder cards: spring {340, 60, 1} (sampled 1 → .424: .39 @100ms, .68 @200, .91 @400).
    const s = fade.current
    const tgt = 1 - 0.98 * f
    const o = settle ? (s.x = s.p = tgt, s.v = 0, tgt) : s.step(s.p ?? tgt, dt) // one-frame lag, as Framer
    s.p = tgt
    h2.style.opacity = o >= 1 ? '' : o.toFixed(4)
    const box = el.querySelector('.hs-pt-img')
    const img = box.firstChild
    const imgTop = box.getBoundingClientRect().top + y
    const ty = Math.min(0, Math.max(-300, -300 + (y - (imgTop - vh)) / 6))
    img.style.transform = `translateY(${ty.toFixed(2)}px)`
  }, { enabled: desktop, margin: '0px' })
  const heading = (
    <div className="hs-pt-tc"><h2 className="hs-pt-h2">Our Partners</h2></div>
  )
  return (
    <div className="hs-pt" ref={root}>
      <section className="hs-bar" />
      <div className="hs-pt-stc">
        <div className="hs-pt-sticky">
          {heading}
          <p className="hs-cap hs-pt-cap">{CAPTION}</p>
        </div>
      </div>
      {desktop && <section className="hs-pt-sp1" />}
      <div className="hs-pt-logos" id="client-logotypes">
        <section className="hs-pt-marker" />
        <div className="hs-pt-grid">
          {order.map((k) => {
            const [id, p, pPhone] = L[k]
            return (
              <div key={k} className={`hs-pt-cell ${desktop ? 'hs-pt-cell-desk' : ''}`}>
                <div className="hs-pt-box">
                  <img
                    src={`/assets/img/${id}.svg`}
                    alt="Logo"
                    draggable={false}
                    style={{ width: `${(phone ? pPhone : p) * 100}%`, height: `${(phone ? pPhone : p) * 100}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {desktop && <section className="hs-pt-sp2" />}
      <div className="hs-pt-img">
        <img src="/assets/img/mMQQ0cROfRI2YAj8D9bHashl4.jpg" alt="Möbius" draggable={false} />
      </div>
    </div>
  )
}

import { useEffect, useRef } from 'react'
import RollingLetters from './RollingLetters'
import SpringChars from './legal/SpringChars'
import { useMedia } from '../lib/useMedia'
import { useInViewOnce } from '../lib/useInViewOnce'

// Shared Footer (home.md §7, §7b): Desktop (≥1200) / Tablet (810–1199) / Mobile (≤809).
// /work forces the Tablet variant at every width (force="tablet").
const ARROW = 'M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z'
const social = [['LinkedIn', 'https://framer.link/drukarov'], ['X (Twitter)', 'https://framer.link/drukarov'], ['Instagram', 'https://framer.link/drukarov']]
const legal = [['Privacy Policy', '/legal/privacy-policy'], ['Terms of Service', '/legal/terms-of-service'], ['404', '/404']]
const YEAR = String(new Date().getFullYear()).slice(-2)

function FooterLink({ text, href, desktop }) {
  const [ref, seen] = useInViewOnce({ threshold: 0.5 })
  const Tag = desktop ? 'h5' : 'h6'
  return (
    <a ref={ref} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="ft-link" data-cursor="hidden">
      <Tag><strong><SpringChars text={text} animate={desktop} go={seen} from={50} dur={0.8} delay={0.2} /></strong></Tag>
      <div className="ft-line" />
    </a>
  )
}

const Links = ({ title, items, desktop }) => (
  <div className="ft-col">
    <div className="ft-col-inner">
      <p className="ft-label">{title}</p>
      <div className="ft-links">
        {items.map(([t, h]) => <FooterLink key={t} text={t} href={h} desktop={desktop} />)}
      </div>
    </div>
  </div>
)

// Blinds (desktop): 6 slats over the wordmark, each with a white bar anchored to its bottom whose
// height goes 100% → 0 as the slat's progress goes 0 → 1 (offset "start 75%" → "end center").
function Blinds() {
  const ref = useRef(null)
  useEffect(() => {
    const slats = [...ref.current.children]
    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      for (const s of slats) {
        const r = s.getBoundingClientRect()
        const start = r.top - 0.75 * vh // 0 when slat top at 75% vh
        const end = r.bottom - 0.5 * vh // 0 when slat bottom at 50% vh
        const p = Math.min(1, Math.max(0, start / (start - end)))
        s.firstChild.style.height = `${(1 - p) * 100}%`
      }
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('resize', kick)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', kick); window.removeEventListener('resize', kick) }
  }, [])
  return (
    <div ref={ref} className="ft-blinds" aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => <div key={i} className="ft-slat"><div className="ft-slat-bar" /></div>)}
    </div>
  )
}

export default function Footer({ force }) {
  const isDesk = useMedia('(min-width: 1200px)')
  const isPhone = useMedia('(max-width: 809.98px)')
  const v = force || (isDesk ? 'desktop' : isPhone ? 'mobile' : 'tablet')
  const desktop = v === 'desktop'
  return (
    <footer className={`ft ft-${v}`}>
      <div className="ft-name">
        <div className="ft-name-row">
          <div className="ft-mark">
            <svg viewBox="0 0 924 180" aria-label="Möbius®">
              <foreignObject width="924" height="180">
                <p xmlns="http://www.w3.org/1999/xhtml">Möbius®</p>
              </foreignObject>
            </svg>
            {desktop && <Blinds />}
          </div>
          <h5>© 2018-{YEAR}</h5>
        </div>
      </div>
      <section className="ft-gap" />
      <div className="ft-body">
        <div className="ft-news">
          <p>Join our studio newsletter for thoughts on design, brand systems, and creative direction — sent occasionally, when there’s something worth saying.</p>
          <form className="ft-form" onSubmit={(e) => e.preventDefault()} data-cursor="hidden">
            <label className="ft-field">
              <input type="email" name="email" placeholder="YOUR EMAIL HERE" />
              <button type="submit" aria-label="Subscribe">
                <svg viewBox="0 0 256 256"><path d={ARROW} /></svg>
                <svg viewBox="0 0 256 256"><path d={ARROW} /></svg>
              </button>
            </label>
          </form>
        </div>
        <div className="ft-cols">
          <Links title="Social" items={social} desktop={desktop} />
          <Links title="Legal" items={legal} desktop={desktop} />
        </div>
      </div>
      <section className="ft-gap" />
      <div className="ft-bottom">
        <div className="ft-row">
          <div className="ft-credit">
            <a href="https://framer.link/drukarov" target="_blank" rel="noreferrer" data-cursor="hidden"><RollingLetters text="FRAMER" height={16.1} /></a>
            <p className="ft-muted">Template handcrafted by</p>
            <a href="https://templatoria.com/" target="_blank" rel="noreferrer" data-cursor="hidden"><RollingLetters text="ANTON DRUKAROV" height={16.1} /></a>
          </div>
        </div>
        <div className="ft-row">
          <p className="ft-muted ft-copy">© 20{YEAR} Möbius. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

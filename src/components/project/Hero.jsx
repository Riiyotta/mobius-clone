import { useEffect, useRef } from 'react'
import ImageReveal from '../fx/ImageReveal'
import { img } from './projectData'

// §4.1 Intro. Desktop: 1.6→1 appear (§7.1) + 0.34·scrollY parallax on the image wrapper (§7.2).
export default function Hero({ project, desktop }) {
  const parRef = useRef(null)

  useEffect(() => {
    const el = parRef.current
    if (!el) return
    if (!desktop) { el.style.transform = ''; return }
    let raf = 0
    const apply = () => { raf = 0; el.style.transform = `translateY(${0.34 * window.scrollY}px)` }
    const on = () => { if (!raf) raf = requestAnimationFrame(apply) }
    apply()
    window.addEventListener('scroll', on, { passive: true })
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on) }
  }, [desktop])

  const { hero } = project
  return (
    <nav className={desktop ? 'pj-intro pj-appear' : 'pj-intro'}>
      <section className="pj-u2 pj-hide-phone" />
      <div className="pj-intro-c">
        <div className="pj-intro-imgc">
          <section className="pj-backdrop" />
          <div className="pj-intro-img" data-cursor="hidden">
            <div ref={parRef} className="pj-par">
              <ImageReveal className="pj-fill" src={img(hero.url)} pos={hero.objectPosition} />
            </div>
          </div>
        </div>
        <section className="pj-u1" />
        <div className="pj-info">
          <div className="pj-info-text">
            <h1 className="pj-h1">{project.name}</h1>
            {project.description.map((t, i) => <p key={i} className="pj-body">{t}</p>)}
          </div>
          <div className="pj-info-bottom">
            <div className="pj-services">
              <p>{project.services}</p>
            </div>
          </div>
        </div>
      </div>
      <section className="pj-u1 pj-hide-phone pj-intro-r" />
    </nav>
  )
}

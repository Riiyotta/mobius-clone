import { navLinks } from '../data'
import RollingLetters from './RollingLetters'
import BerlinClock from './BerlinClock'

// Fixed 100vh wrapper with mix-blend-mode:difference; text is white (§1, §3.1).
export default function Nav({ onMenu, animate, clock }) {
  return (
    <div className={animate ? 'nav-wrap nav-in' : 'nav-wrap'}>
      <nav className="nav">
        <section className="nav-col">
          <div className="nav-logo" data-cursor="hidden">
            <p className="logo"><a href="/">Möbius®</a></p>
          </div>
        </section>
        <section className="nav-col nav-spacer" />
        <section className="nav-col nav-menu">
          <div className="desk-menu">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className="nav-link" data-cursor="hidden">
                <RollingLetters text={l.label} />
              </a>
            ))}
          </div>
          <button className="menu-btn" onClick={onMenu} data-cursor="hidden">Menu</button>
        </section>
      </nav>
      {clock && <BerlinClock />}
    </div>
  )
}

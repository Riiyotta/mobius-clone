import { navLinks } from '../data'

// Tablet/phone full-screen black menu. The original opens/closes instantly (sampled: no tween).
export default function MenuOverlay({ open, onClose }) {
  if (!open) return null
  return (
    <div className="menu-overlay">
      <section className="menu-panel">
        <nav className="nav menu-nav">
          <section className="nav-col">
            <div className="nav-logo"><p className="logo"><a href="/">Möbius®</a></p></div>
          </section>
          <section className="nav-col nav-menu">
            <button className="menu-btn" onClick={onClose}>Close</button>
          </section>
        </nav>
        <div className="menu-links">
          {navLinks.map((l) => (
            <a key={l.label} href={l.href}>{l.menu}</a>
          ))}
        </div>
      </section>
    </div>
  )
}

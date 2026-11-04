import { useLayoutEffect, useRef, useState } from 'react'
import content from '../../content/legal.json'
import ButtonA from '../legal/ButtonA'
import ButtonB from '../legal/ButtonB'
import { Plus } from '../legal/Icons'
import SpringChars from '../legal/SpringChars'
import { useInViewOnce } from '../../lib/useInViewOnce'
import '../../styles/faq.css'

const faq = content.faqSection
// Word reveal has disableForSafari:true (§C.4): Safari shows static text.
const SAFARI = typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

// "Questions, answered." desktop char rise (§C.4): translateY 50 → 0, spring 0.8, stagger 0.025s, start 0.1s.
function Heading({ desktop }) {
  const [ref, seen] = useInViewOnce()
  return (
    <h6 ref={ref} className="faq-h6">
      <strong><SpringChars text={faq.heading} animate={desktop} go={seen} delay={0.1} /></strong>
    </h6>
  )
}

// Learn-more word reveal, staggerBy 'lines' (§C.4): each word translateY(100%) → 0,
// 600ms cubic-bezier(.4,1,.4,1), delay = 100ms + line × 120ms; in view once, margin -10%.
// Line grouping as in home/Hero.jsx: a word whose top differs by > 5px starts a new line.
function LearnMore({ desktop }) {
  const animate = desktop && !SAFARI
  const [ref, seen] = useInViewOnce({ margin: '-10% 0px' })
  const pRef = useRef(null)
  const [lines, setLines] = useState([])
  const words = faq.learnMore.split(/(?<= )/)
  useLayoutEffect(() => {
    if (!animate || !pRef.current) return
    const measure = () => {
      let line = 0, top = null
      setLines([...pRef.current.querySelectorAll('.faq-w')].map((e) => {
        const t = e.getBoundingClientRect().top
        if (top !== null && Math.abs(t - top) > 5) line++
        top = t
        return line
      }))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [animate])
  if (!animate) return <p className="faq-learn">{faq.learnMore}</p>
  return (
    <p ref={(el) => { pRef.current = el; ref.current = el }} className="faq-learn">
      {words.map((w, i) => (
        <span key={i} className="faq-wm">
          <span
            className="faq-w"
            style={{
              transform: seen ? 'translateY(0%)' : 'translateY(100%)',
              transition: seen ? `transform 600ms cubic-bezier(.4,1,.4,1) ${100 + (lines[i] || 0) * 120}ms` : 'none',
            }}
          >
            {w}
          </span>
        </span>
      ))}
    </p>
  )
}

// FAQ item (legal-404.md §C.1–§C.4). Desktop: plus column left, hover bg, cursor pointer.
// Touch (tablet/phone): question first, plus on the right, no hover bg. Toggle is a 0.8s tween everywhere.
function Item({ q, a, open, onToggle, desktop }) {
  return (
    <div className={`faq-item ${open ? 'is-open' : ''}`} onClick={onToggle} data-cursor="hidden">
      {desktop && <section className="faq-item-bg" />}
      <div className="faq-plus-col">
        <h4 className="faq-q faq-plus-ph" aria-hidden="true">A</h4>
        <Plus className="faq-plus" />
      </div>
      <div className="faq-qa">
        <h4 className="faq-q">{q}</h4>
        <div className="faq-a-wrap">
          <div className="faq-a-clip">
            <p className="faq-a" dangerouslySetInnerHTML={{ __html: a }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Accordion({ desktop }) {
  // Desktop: item 1 Open, 2–4 Closed. Touch: every item starts "Touch Close". Items toggle independently.
  const [open, setOpen] = useState(() => faq.items.map((it) => !!(desktop && it.openByDefaultDesktop)))
  const toggle = (i) => setOpen((s) => s.map((v, j) => (j === i ? !v : v)))
  return (
    <div className="faq-acc">
      {faq.items.map((it, i) => (
        <Item key={i} q={it.q} a={it.a} open={open[i]} onToggle={() => toggle(i)} desktop={desktop} />
      ))}
    </div>
  )
}

export default function Faq({ desktop }) {
  return (
    <div className={`faq ${desktop ? 'faq-desk' : 'faq-touch'}`}>
      <div className="faq-left">
        <div className="faq-sticky">
          <div className="faq-text">
            <section className="faq-spacer" />
            <Heading desktop={desktop} />
          </div>
          <LearnMore desktop={desktop} />
          <div className="faq-about">
            <ButtonB label={faq.aboutLink.label} href={faq.aboutLink.href} desktop={desktop} />
          </div>
        </div>
      </div>
      <div className="faq-right">
        <section className="faq-spacer" />
        {/* Remount on breakpoint change so the initial open state follows the variant. */}
        <Accordion key={desktop ? 'd' : 't'} desktop={desktop} />
        <div className="faq-cta">
          <section className="faq-cta-side" />
          <div className="faq-cta-col">
            <p className="faq-cta-text">{faq.cta.text}</p>
            <ButtonA label={faq.cta.button.label} href={faq.cta.button.href} desktop={desktop} />
          </div>
        </div>
      </div>
    </div>
  )
}

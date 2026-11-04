import Footer from '../components/Footer'
import ButtonA from '../components/legal/ButtonA'
import ButtonB from '../components/legal/ButtonB'
import CursorTrail from '../components/studio/CursorTrail'
import TeamCard from '../components/studio/TeamCard'
import ImageTicker from '../components/studio/ImageTicker'
import TextTicker from '../components/studio/TextTicker'
import CareerAccordion from '../components/studio/CareerAccordion'
import { useSmoothScroll } from '../lib/useSmoothScroll'
import { useRef } from 'react'
import WordStagger from '../components/fx/WordStagger'
import { StaggerText, revealRanks, makeSpring, useVisibleLoop, useScrollInViewOnce, JsAppear } from '../components/studio/StudioMotion'
import '../styles/studio.css'

// /studio — .recon/specs/studio.md. Layout per breakpoint is in studio.css; `desktop` (>=1200) picks
// component variants (Button hovers, Project Card Desktop vs Touch, text-reveal h3 vs static h4).
const img = (id) => `/assets/img/${id}.jpg`

// Cursor Image Trail sources (studio-assets.json → cursorImageTrail). NOTE: not yet in public/assets/img.
const TRAIL = [
  'IbeDG1tYDKBEKF6vM7TnKNz2cdU', 'nKd7QNIQwJpboPhCvHWSIknx0', 'DejJvWQ8KSpfyIWulD4sPenz34',
  'rMsvlVp8eyDZLtTb7WAv1CQ8z6U', 'Ik5wfOmIgAiBJo81MDKDMJeQPJk', 'D7TB6p9zARQleEiLdoeWbQvtw',
].map(img)

const INTRO = [
  'Möbius® is a design studio built around clarity, intention, and craft. We believe that strong ideas come from thoughtful collaboration, steady focus, and an honest approach to problem-solving. Every project starts with understanding — the people, the context, and the possibilities — before anything is designed.',
  'We work as a small, dedicated team, shaping brands and digital experiences that feel precise, adaptable, and meaningful. Our goal is simple: create work that lasts, grows, and continues to make sense long after launch. This is how we think, how we build, and how we show up for the people we work with.',
]

const REVEAL = 'Möbius® brings the missing pieces together — the gaps in your brand, the breaks in your story, the places where clarity slips. We connect strategy, design, and digital execution into one continuous system, so nothing feels scattered or out of place.'

// Three columns (desktop) / rows (tablet) / sections (phone), two cards each, DOM order.
const TEAM = [
  [['Jonas Richter', 'Founder & Creative Director', 'k1yRftQfPk4lIWxRe2Tfq5h4ZEk'], ['Markus Vogt', 'Brand Strategy Manager', '6DZMR1xEPM39KDNzCq98kTlMk']],
  [['Tobias Keller', 'Founder & Strategy Director', 'YVYiW8vzXkPuMM5MMZ5eURVsRKQ'], ['Elias Krüger', 'Senior Brand & Digital Designer', 'mP3z1asn1KrsKxc0DEhZSvQML4']],
  [['Lena Hartmann', 'Operations & Project Manager', '5OwsyGg2p3GhQCQVI7MyikNA'], ['Niko Stein', 'Technical Lead', 'bQvw7y6z0yBwIdbHPxdbwWDaQ0']],
]

const PRINCIPLES = [
  ['A /', 'We remove the unnecessary and focus on what moves the work forward. Simple beats complicated every time.'],
  ['B /', 'Good work comes from good relationships. We collaborate with people we respect — clients and teammates alike.'],
  ['C /', 'Ideas get sharper when we shape them as a team. No egos, no walls, just shared ownership.'],
]

const CAREER = [
  'At Möbius®, we believe meaningful work comes from teams who care about clarity, craft, and the ideas behind the work. We’ve shaped our studio around these principles, keeping the team small so the thinking stays sharp and the output stays strong.',
  'Every project is handled with intention. We collaborate closely, give space for good ideas to grow, and treat design as a discipline that deserves patience and precision. It’s this focus that allows us to create work that feels refined, thoughtful, and built to last.',
]

const QUOTE = 'We’re a small team of designers and thinkers guided by clarity, craft, and a shared approach to meaningful work.'

const CASE = { slug: 'golden-hour', name: 'Golden Hour', src: img('70P7DlHOLA5V6H0shE8MTQZ5XW0') }

// "Join Us" → ./studio#career. The router swallows same-path clicks, so scroll here with the same
// 2s expo-out Lenis uses for anchors (§1). Lenis follows native scroll while it is idle.
const expoOut = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
function scrollToId(e, id) {
  const el = document.getElementById(id)
  if (!el) return
  e.preventDefault()
  const from = window.scrollY
  const to = el.getBoundingClientRect().top + from
  const t0 = performance.now()
  const step = (now) => {
    const t = Math.min(1, (now - t0) / 2000)
    window.scrollTo(0, from + (to - from) * expoOut(t))
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

function Intro({ desktop }) {
  return (
    <section className="st-intro">
      <CursorTrail images={TRAIL} />
      <div className="st-intro-sticky">
        {desktop && (
          <div className="st-intro-btns">
            {/* staggered text by lines: initialDelay 600, line delay 120, 600ms cubic-bezier(.4,1,.4,1), §2 */}
            <StaggerText as="h4" className="st-intro-q" text="Do you feel ready to become part of our growing team?" initialDelay={600} />
            {/* Button B desktop appear (arrows y 30 → 0 delay 0.6; label chars y 50 → 0, stagger 0.025,
                delay 0.2, threshold 0.5) is built into ButtonB, §2 */}
            <div className="st-btn-row" onClick={(e) => scrollToId(e, 'career')}>
              <ButtonB label="Join Us" href="/studio#career" desktop={desktop} />
            </div>
          </div>
        )}
      </div>
      <div className="st-intro-main">
        <div className="st-h1-wrap">
          <h1 className="st-h1">We are<br />Möbius®</h1>
        </div>
        <div className="st-intro-text">
          {/* desktop staggered text by lines across both paragraphs (initialDelay 100, line delay 120, 600ms), §2 */}
          <StaggerText as="div" className="st-intro-p" paraAs="p" paraClassName="st-p" paras={INTRO} initialDelay={100} enabled={desktop} />
        </div>
      </div>
      <div className="st-sp2 st-intro-side" />
    </section>
  )
}

const REVEAL_WORDS = REVEAL.split(' ')
const REVEAL_RANK = revealRanks(REVEAL_WORDS.length)
const COL_FROM = [-150, -300, 0]
const SPRING_CFG = { stiffness: 340, damping: 60, mass: 1 }

// §4.1 + §4.2, desktop only. One rAF loop (running while the section is within 200px of the viewport)
// reads window.scrollY and drives: the word reveal thresholds, the reveal block's spring-smoothed
// fade-out, and the spring-smoothed column parallax.
function useTeamMotion(desktop, refs) {
  const st = useRef(null)
  if (!st.current) st.current = { fade: makeSpring(SPRING_CFG), par: makeSpring(SPRING_CFG), on: [] }
  const allOff = () => {
    const ws = refs.h.current?.children
    if (!ws) return
    for (let i = 0; i < ws.length; i++) if (st.current.on[i]) { ws[i].classList.remove('is-on'); st.current.on[i] = false }
  }
  useVisibleLoop(refs.sec, (dt) => {
    const { sec, bar, h, reveal, cards, marker, cols } = refs
    if (!sec.current || !h.current || !cards.current || !marker.current) return
    const y = window.scrollY, vh = window.innerHeight
    const S = st.current
    // 4.1 words
    const n = sec.current.getBoundingClientRect().top + y + bar.current.offsetHeight + h.current.offsetTop
    const start = n - vh + (vh / 2) * 0.4
    const end = n - (vh / 2) * 0.4
    const hr = h.current.getBoundingClientRect()
    const visible = hr.bottom > 0 && hr.top < vh
    const ws = h.current.children
    const stepW = (end - start) / ws.length
    for (let i = 0; i < ws.length; i++) {
      const want = visible && y >= start + stepW * REVEAL_RANK[i]
      if (want !== !!S.on[i]) { ws[i].classList.toggle('is-on', want); S.on[i] = want }
    }
    // 4.1 block fade-out
    const mt = marker.current.getBoundingClientRect().top + y
    const mh = marker.current.offsetHeight
    const fT = 1 - Math.min(1, Math.max(0, (y - (mt - vh)) / mh))
    reveal.current.style.opacity = String(+S.fade.step(fT, dt).toFixed(4))
    // 4.2 parallax
    const ct = cards.current.getBoundingClientRect().top + y
    const ch = cards.current.offsetHeight
    const pT = Math.min(1, Math.max(0, (y + vh - ct) / ch))
    const p = S.par.step(pT, dt)
    cols.forEach((c, i) => {
      if (c.current && COL_FROM[i]) c.current.style.transform = `translateY(${(COL_FROM[i] * (1 - p)).toFixed(2)}px)`
    })
  }, { enabled: desktop, onLeave: allOff })
}

function OurTeam({ desktop }) {
  const Tag = desktop ? 'h3' : 'h4'
  const refs = {
    sec: useRef(null), bar: useRef(null), h: useRef(null), reveal: useRef(null),
    cards: useRef(null), marker: useRef(null), cols: [useRef(null), useRef(null), useRef(null)],
  }
  useTeamMotion(desktop, refs)
  return (
    <section ref={refs.sec} className="st-team" id="our-team">
      <section ref={refs.bar} className="st-bar" />
      <div ref={refs.reveal} className="st-reveal">
        {/* desktop: scroll-driven word reveal (seeded shuffle) + block fade-out from .st-fade-marker, §4.1 */}
        <Tag ref={refs.h} className={`st-reveal-h ${desktop ? 'is-anim' : ''}`}>
          {REVEAL_WORDS.map((w, i) => <span key={i} className="st-word">{w}</span>)}
        </Tag>
      </div>
      <div className="st-team-wrap">
        <div ref={refs.cards} className="st-cards">
          {/* desktop parallax: col 1 translateY −150 → 0, col 2 −300 → 0, col 3 static, §4.2 */}
          {TEAM.map((col, i) => (
            <div key={i} ref={refs.cols[i]} className="st-col" style={desktop && COL_FROM[i] ? { transform: `translateY(${COL_FROM[i]}px)` } : undefined}>
              {col.map(([name, role, id]) => <TeamCard key={name} name={name} role={role} src={img(id)} desktop={desktop} />)}
            </div>
          ))}
          {desktop && <div ref={refs.marker} className="st-fade-marker" aria-hidden="true" />}
        </div>
      </div>
    </section>
  )
}

// Index "A /": Framer appear, onInView threshold 0 with no margin (measured: fires as the item top
// crosses the viewport bottom). Sentence: staggered text, useInView margin -10% (top crosses 0.9·vh).
function PrincipleItem({ idx, text, desktop }) {
  const [ref, seen] = useScrollInViewOnce(desktop)
  return (
    <div className="st-pi">
      <div ref={ref} className="st-pi-idx"><h4 className="st-pi-h">{desktop ? <JsAppear text={idx} go={seen} split="words" from={60} dur={0.4} delay={0.2} stagger={0.075} fade /> : idx}</h4></div>
      <div className="st-pi-txt">
        <StaggerText as="h4" className="st-pi-h" text={text} by="words" step={60} initialDelay={200} enabled={desktop} />
      </div>
    </div>
  )
}

function Principles({ desktop }) {
  const [h6Ref, h6Seen] = useScrollInViewOnce(desktop)
  return (
    <section className="st-pr">
      <div className="st-pr-left">
        <div className="st-pr-sticky">
          <div className="st-pr-top">
            <div className="st-pr-spacer" />
            {/* desktop char appear y 50 → 0, spring 0.8, stagger 0.025, delay 0.1, §4.5 */}
            <h6 ref={h6Ref} className="st-pr-h6"><strong>{desktop ? <JsAppear text="Our Principles." go={h6Seen} from={50} dur={0.8} delay={0.1} stagger={0.025} /> : 'Our Principles.'}</strong></h6>
          </div>
          {/* desktop staggered text by lines (initialDelay 100, line delay 120), §3.3 */}
          <StaggerText as="p" className="st-note" text="If you feel aligned with our principles, let’s build something together." initialDelay={100} enabled={desktop} />
          <div className="st-btn-row">
            <ButtonB label="Work With Us" href="/contacts" desktop={desktop} />
          </div>
        </div>
      </div>
      <div className="st-pr-right">
        <div className="st-pr-spacer" />
        <div className="st-pr-list">
          {/* desktop in-view appears per item (index word appear + sentence word stagger), §4.5 */}
          {PRINCIPLES.map(([idx, text]) => <PrincipleItem key={idx} idx={idx} text={text} desktop={desktop} />)}
        </div>
      </div>
    </section>
  )
}

function Gallery() {
  return (
    <section className="st-gal">
      <section className="st-bar" />
      <ImageTicker />
    </section>
  )
}

function Career({ desktop }) {
  return (
    <section className="st-career" id="career">
      <div className="st-row">
        <div className="st-sp2" />
        <div className="st-cr-head">
          <h2 className="st-cr-h2">Careers</h2>
          <div className="st-cr-text">
            {CAREER.map((t, i) => <p key={i} className="st-p">{t}</p>)}
          </div>
        </div>
        <div className="st-sp4" />
      </div>
      <div className="st-quote">
        <div className="st-quote-sp" />
        <div className="st-quote-box">
          {/* desktop staggered text by words (60ms, 600ms) when top < 0.9·vh, §4.5; indent comes from CSS */}
          <h4 className="st-quote-h">{desktop ? <WordStagger text={QUOTE} step={0.06} /> : QUOTE}</h4>
        </div>
      </div>
      <div className="st-row st-cr-note-row">
        <div className="st-sp2" />
        <div className="st-cr-note">
          <p className="st-p">If you feel aligned with our approach, share your application with us. Tell us a bit about yourself, your experience, and what you’re excited to create. We’re always open to meeting new talent and growing the Möbius® team.</p>
        </div>
      </div>
      <div className="st-row st-acc-row">
        <div className="st-sp1" />
        <div className="st-acc-sec">
          <CareerAccordion />
          <div className="st-cr-more">
            <div className="st-cr-more-sp" />
            <div className="st-cr-more-col">
              {/* "amessage" typo is verbatim from the source. */}
              <p className="st-p"><strong>Don’t see a role that fits you?</strong> Send us amessage on LinkedIn and tell us why you think you’d be a strong addition to the team.</p>
              <ButtonA label="Our LinkedIn Page" href="https://framer.link/drukarov" desktop={desktop} />
            </div>
            <div className="st-cr-more-sp" />
          </div>
        </div>
        <div className="st-sp4" />
      </div>
    </section>
  )
}

function SelectedCase({ desktop }) {
  const href = `/work/${CASE.slug}`
  return (
    <section className="st-case">
      <div className="st-tickers">
        <TextTicker direction="left" color="#f7f7f7" />
        <TextTicker direction="right" color="#000" />
      </div>
      <div className="st-case-row">
        <div className="st-sp4" />
        {desktop ? (
          <a href={href} className="st-case-a" data-cursor="arrow" draggable={false}>
            <div className="card">
              <section className="card-img">
                <img src={CASE.src} alt="Möbius" draggable={false} style={{ objectPosition: 'center' }} />
              </section>
              <div className="card-name">
                <h4>
                  <strong>
                    {[...CASE.name].map((c, i) => (
                      <span key={i} className="name-char" style={{ animationDelay: `${i * 0.025}s` }}>{c === ' ' ? ' ' : c}</span>
                    ))}
                  </strong>
                </h4>
              </div>
            </div>
          </a>
        ) : (
          <a href={href} className="st-case-a">
            <div className="st-case-sticky" />
            <div className="st-pc">
              <img className="st-pc-img" src={CASE.src} alt="Möbius" draggable={false} />
              <div className="st-pc-name"><h4><strong>{CASE.name}</strong></h4></div>
            </div>
          </a>
        )}
        <div className="st-sp4" />
      </div>
    </section>
  )
}

export default function Studio({ desktop }) {
  useSmoothScroll(desktop)
  return (
    <div className="st-page">
      <Intro desktop={desktop} />
      <OurTeam desktop={desktop} />
      <Principles desktop={desktop} />
      <Gallery />
      <Career desktop={desktop} />
      <SelectedCase desktop={desktop} />
      <Footer />
    </div>
  )
}

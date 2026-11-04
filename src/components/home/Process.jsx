import { useInViewOnce } from '../../lib/useInViewOnce'
import { Lines, Rise } from './Motion'
// §4.8 The Process (home.md). Bars render at full width.
// MOTION (Animation pass): per bar on view, `.hs-pc-bar` width 1px (left-anchored) → full,
// tween 1.2s cubic-bezier(.4,0,0,1); label x −20 → 0 over the same time; H2/H5 rises.
// Grid columns: 12 desktop / 6 tablet / 4 phone. Number labels sit at opacity .5 (also at the end of
// the sampled entrance).

// Bar entrance (measured, per bar on view, IO threshold 0): backdrop width 1px → full and label x −20 → 0,
// tween 1.2s cubic-bezier(.4,0,0,1). Desktop only.
const BAR_EASE = '1.2s cubic-bezier(.4,0,0,1) -0.03s' // −30ms = measured React commit latency vs Framer
function Bar({ s, desktop }) {
  const [ref, seen] = useInViewOnce()
  const go = !desktop || seen
  return (
    <div className="hs-pc-sec" ref={ref}>
      <div className="hs-pc-bar" data-step={s.k}>
        {/* The black backdrop grows (the white label is invisible on the white page outside it). */}
        <section
          className="hs-pc-bd"
          style={desktop ? { right: 'auto', width: go ? '100%' : 1, transition: `width ${BAR_EASE}` } : undefined}
        />
        <p
          className="hs-pc-label"
          style={desktop ? { transform: go ? 'none' : 'translateX(-20px)', transition: `transform ${BAR_EASE}` } : undefined}
        >
          <strong>{s.name}</strong>
        </p>
      </div>
    </div>
  )
}

const STEPS = [
  { k: 'a', name: 'Discovery', text: 'We start by listening. This phase is about understanding your goals, audience, and challenges — finding clarity before we begin designing.' },
  { k: 'b', name: 'Strategy', text: 'We translate insights into direction. Here, we define the concept, structure, and creative approach that shape your brand or digital product.' },
  { k: 'c', name: 'Design & Build', text: 'Ideas take form. From visual identity to interactive experience, we design, prototype, and develop with precision and care.' },
  { k: 'd', name: 'Launch & Beyond', text: 'Delivery is only the beginning. We test, refine, and support long after launch — ensuring the work performs and evolves over time.' },
]

export default function Process({ desktop, phone }) {
  const cols = desktop ? 12 : phone ? 4 : 6
  const nums = Array.from({ length: cols }, (_, i) => String(i + 1).padStart(2, '0'))
  return (
    <div className="hs-pc">
      <div className="hs-pc-head">
        <div className="hs-pc-tc"><h2 className="hs-h2"><Rise text="The Process" enabled={desktop} delay={0.2} /></h2></div>
        <div className="hs-pc-tc"><p className="hs-body hs-pc-p"><Lines enabled={desktop} paras="Honest impressions from the teams we’ve collaborated with across brand and digital work." /></p></div>
      </div>
      <div className="hs-pc-tl">
        <div className="hs-pc-nums">
          {nums.map((n) => <p key={n} className="hs-label hs-pc-num">{n}</p>)}
        </div>
        <div className="hs-pc-grid">
          {nums.map((n) => <section key={n} className="hs-pc-line" />)}
        </div>
        {STEPS.map((s) => (
          <div key={s.k} className={`hs-pc-row hs-pc-row-${s.k}`}>
            <section className="hs-pc-pre" />
            <Bar s={s} desktop={desktop} />
            <section className="hs-pc-post" />
          </div>
        ))}
      </div>
      <div className="hs-pc-list">
        {STEPS.map((s, i) => (
          <div key={s.k} className="hs-pc-item">
            <div className="hs-pc-itc">
              <div className="hs-pc-name"><h5 className="hs-pc-h5"><Rise text={s.name} by="word" enabled={desktop} dur={0.8} delay={0.1 * (i + 1)} /></h5></div>
              <p className="hs-pc-text"><Lines enabled={desktop} delay={200} paras={s.text} /></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

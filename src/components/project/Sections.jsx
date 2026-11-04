import WordStagger from '../fx/WordStagger'
import CharRise from '../fx/CharRise'
import { useInViewOnce } from '../../lib/useInViewOnce'
import { ARROW_RIGHT } from './projectData'

const Rich = ({ paragraphs }) => (
  <div className="pj-rich">
    {paragraphs.map((t, i) => <p key={i} className="pj-body">{t}</p>)}
  </div>
)

// §4.2 Challenge rows "/ 1" "/ 2" "/ 3". The grey marker is desktop-only.
export function Challenge({ block }) {
  return (
    <div className="pj-row pj-ch">
      <section className="pj-u2" />
      <div className="pj-u4 pj-col">
        <div className="pj-ch-text"><Rich paragraphs={block.paragraphs} /></div>
      </div>
      <section className="pj-u1 pj-ch-gap" />
      <div className="pj-u5 pj-col pj-desk">
        <h3 className="pj-grey">{block.marker}</h3>
      </div>
    </div>
  )
}

// §4.3 Quote: word reveal on desktop (§7.3), plain text below 1200.
export function Quote({ text, desktop }) {
  return (
    <div className="pj-row pj-q">
      <section className="pj-u2 pj-hide-phone" />
      <div className="pj-u10 pj-col">
        {desktop ? (
          <h4 className="pj-quote pj-quote-anim">
            <WordStagger text={text} firstIndent={160} className="pj-quote-line" />
          </h4>
        ) : (
          <h4 className="pj-quote">{text}</h4>
        )}
      </div>
    </div>
  )
}

// §7.3 Stats: chars rise 80px → 0 and fade 0.001 → 1, spring 0.8, stagger 0.075, start delay i·0.1.
function Stat({ stat, i, desktop }) {
  const [ref, seen] = useInViewOnce()
  return (
    <div className="pj-stat">
      {desktop ? (
        <h3 ref={ref} className={seen ? 'pj-stat-v pj-anim pj-in' : 'pj-stat-v pj-anim'}>
          <CharRise text={stat.value} from={80} delay={i * 0.1} stagger={0.075} now={seen} />
        </h3>
      ) : (
        <h3 className="pj-stat-v">{stat.value}</h3>
      )}
      <p className="pj-stat-l">{stat.label}</p>
    </div>
  )
}

// §4.5 Numbers.
export function Numbers({ numbers, desktop }) {
  return (
    <div className="pj-row pj-num">
      <section className="pj-u2 pj-hide-phone" />
      <div className="pj-u10 pj-num-c">
        <div className="pj-col"><h6 className="pj-num-h"><strong>{numbers.heading}</strong></h6></div>
        <div className="pj-stats">
          {numbers.stats.map((s, i) => <Stat key={i} stat={s} i={i} desktop={desktop} />)}
        </div>
      </div>
    </div>
  )
}

const Arrow = ({ className }) => (
  <svg className={className} viewBox="0 0 256 256" width="16" height="16" aria-hidden="true"><path d={ARROW_RIGHT} /></svg>
)

// §4.6 Credits + Button A ("Live Project"); hover morph is desktop-only (§7.5).
export function Credits({ credits, live }) {
  return (
    <div className="pj-row pj-cr">
      <section className="pj-u2" />
      <div className="pj-u4 pj-col">
        <div className="pj-cr-text">
          <p className="pj-body pj-cr-p">{credits}</p>
          <a href={live.href} className="pj-btn" data-cursor="hidden">
            <section className="pj-btn-bg" />
            <span className="pj-btn-t">{live.label}</span>
            <Arrow className="pj-btn-a1" />
            <Arrow className="pj-btn-a2" />
          </a>
        </div>
      </div>
      <section className="pj-u6 pj-cr-r" />
    </div>
  )
}

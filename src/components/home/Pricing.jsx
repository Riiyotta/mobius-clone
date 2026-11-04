import { useLayoutEffect, useRef, useState } from 'react'
import ButtonB from '../legal/ButtonB'
import { CheckCircle } from './HomeIcons'
import { Lines } from './Motion'

// §4.10 Pricing (home.md). Default = Yearly. Toggle pill slides right:4 ↔ left:4 and the label colours
// cross-fade, spring 0.4 bounce 0 (measured ~380ms). Prices swap instantly here: the original rolls the
// digits with NumberFlow (spring 0.75) — NOT sampled, left for the Animation pass.
// Caption + "Let's Talk" CTA are desktop only (absent from the tablet/phone dumps).
const PLANS = [
  {
    name: 'Foundation Package',
    desc: 'For early-stage companies or brands in need of a clear visual foundation.',
    cols: [['Discovery session', 'Brand direction', 'Logo & mark'], ['Visual system', 'Color & typography', 'Basic brand guidelines']],
    yearly: 5200, monthly: 6500,
  },
  {
    name: 'Studio Package',
    desc: 'For websites, platforms, or digital-first brands.',
    cols: [['UX structure & sitemap', 'UI design', 'Component system'], ['Responsive layouts', 'Interaction & motion direction']],
    yearly: 6400, monthly: 8000,
  },
  {
    name: 'Signature Package',
    desc: 'For teams that want everything aligned, from identity to digital presence.',
    cols: [['Brand identity', 'Digital design', 'Visual language'], ['Motion direction', 'Guidelines']],
    yearly: 11200, monthly: 14000,
  },
]
const usd = (n) => `$${n.toLocaleString('en-US')}`

// NumberFlow digit roll, measured in the original's shadow DOM (Foundation 5,200 → 6,500; Signature
// 11,200 → 14,000): per digit delta = (new − old) mod 10 in the trend direction, and a full 10-step spin
// when a digit is unchanged but a digit to its left changed. Carousel position c = new − trend·delta·(1 − e);
// num n sits at translateY(clamp(−1, wrap(n − c), 1)·100%) (NumberFlow's own formula).
// e(t) = the measured --_number-flow-d progress, 1169ms total, piecewise linear between samples.
const ROLL = [[0, 0], [55, 0.171], [105, 0.327], [155, 0.474], [205, 0.599], [255, 0.695], [305, 0.775], [356, 0.836],
  [421, 0.891], [471, 0.922], [521, 0.944], [571, 0.959], [621, 0.971], [671, 0.979], [721, 0.985], [771, 0.99],
  [838, 0.993], [904, 0.996], [1054, 0.999], [1169, 1]]
const rollEase = (ms) => {
  for (let i = 1; i < ROLL.length; i++) {
    const [t1, v1] = ROLL[i]
    if (ms <= t1) { const [t0, v0] = ROLL[i - 1]; return v0 + ((v1 - v0) * (ms - t0)) / (t1 - t0) }
  }
  return 1
}
const mod = (a, n) => ((a % n) + n) % n
// The original's roll starts ~70ms after the click (vs ~40ms for a plain React update here).
const ROLL_DELAY = 30
const isDigit = (ch) => ch >= '0' && ch <= '9'

function RollNumber({ value, className }) {
  const text = usd(value)
  const ref = useRef(null)
  const prev = useRef(text)
  useLayoutEffect(() => {
    const old = prev.current
    prev.current = text
    const el = ref.current
    if (!el || old === text || old.length !== text.length) return
    const trend = Math.sign(value - Number(old.replace(/[^0-9]/g, '')))
    const digits = [...el.querySelectorAll('.hs-nf-d')]
    let left = false
    const deltas = []
    ;[...text].forEach((ch, i) => {
      if (!isDigit(ch)) return
      let d = mod(trend * (+ch - +old[i]), 10)
      if (d === 0 && left) d = 10
      if (d !== 0) left = true
      deltas.push(d)
    })
    const t0 = performance.now()
    let raf = 0
    const frame = (now) => {
      const e = rollEase(Math.max(0, now - t0 - ROLL_DELAY))
      digits.forEach((dg, k) => {
        const cur = +dg.dataset.v
        const c = cur - trend * deltas[k] * (1 - e)
        dg.classList.toggle('is-spinning', e < 1 && deltas[k] !== 0)
        dg.querySelectorAll('.hs-nf-n').forEach((n) => {
          const raw = mod(10 + +n.dataset.n - mod(c, 10), 10)
          const off = raw - 10 * Math.floor(raw / 5)
          const y = Math.max(-1, Math.min(1, off)) * 100
          n.style.transform = `${+n.dataset.n === cur ? '' : 'translateX(-50%) '}translateY(${y.toFixed(3)}%)`
        })
      })
      if (e < 1) raf = requestAnimationFrame(frame)
    }
    frame(t0) // first frame synchronously, before paint
    return () => cancelAnimationFrame(raf)
  }, [text, value])
  const chars = [...text]
  return (
    <span className={`${className} hs-nf`} ref={ref} aria-label={text}>
      <span className="hs-nf-s" aria-hidden="true">{chars[0]}</span>
      <span className="hs-nf-num" aria-hidden="true">
        {chars.slice(1).map((ch, i) =>
          isDigit(ch) ? (
            <span key={i} className="hs-nf-d" data-v={ch}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <span key={n} className={`hs-nf-n${n === +ch ? ' is-cur' : ''}`} data-n={n}>{n}</span>
              ))}
            </span>
          ) : (
            <span key={i} className="hs-nf-s">{ch}</span>
          ),
        )}
      </span>
    </span>
  )
}

function Toggle({ yearly, set }) {
  return (
    <div className={`hs-tg ${yearly ? 'is-yearly' : 'is-monthly'}`} role="group" aria-label="Billing period">
      <div className="hs-tg-pill" />
      <button type="button" className="hs-tg-opt" aria-pressed={!yearly} onClick={() => set(false)}>
        <p className="hs-tg-p"><strong>Monthly</strong></p>
      </button>
      <button type="button" className="hs-tg-opt" aria-pressed={yearly} onClick={() => set(true)}>
        <p className="hs-tg-p"><strong>Yearly –20%</strong></p>
      </button>
    </div>
  )
}

function Plan({ p, yearly }) {
  return (
    <div className="hs-plan">
      <div className="hs-plan-name">
        <h3 className="hs-plan-h3">{p.name}</h3>
        <p className="hs-plan-desc">{p.desc}</p>
      </div>
      <div className="hs-plan-lists">
        {p.cols.map((col, i) => (
          <div key={i} className="hs-plan-list">
            {col.map((it) => (
              <div key={it} className="hs-plan-item">
                <CheckCircle className="hs-plan-ic" />
                <p className="hs-plan-it">{it}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="hs-plan-price">
        <p className="hs-label">Starting from</p>
        <div className="hs-plan-pc">
          <div className="hs-plan-pm">
            <RollNumber className="hs-plan-amt" value={yearly ? p.yearly : p.monthly} />
            <h4 className="hs-plan-mo">/month</h4>
          </div>
          {/* Strike stays in layout (its value never changes); Monthly fades its container out
              (measured opacity 1 → .666 → .259 → .054 → 0 over ~0.2s). */}
          <div className={`hs-plan-oldc ${yearly ? '' : 'is-off'}`} aria-hidden={!yearly}>
            <span className="hs-plan-old">{usd(p.monthly)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Pricing({ desktop }) {
  const [yearly, setYearly] = useState(true)
  return (
    <div className="hs-pr">
      <div className="hs-pr-left">
        <div className="hs-pr-sticky">
          <div className="hs-pr-sec">
            <div className="hs-pr-title">
              <h2 className="hs-h2">Pricing</h2>
              <Toggle yearly={yearly} set={setYearly} />
            </div>
            <div className="hs-pr-tc">
              <p className="hs-body hs-pr-p"><Lines enabled={desktop} delay={200} paras="Choose a plan that fits your pace, your team, and your goals. From startups to scaling brands, our monthly options give you the design support you need." /></p>
            </div>
          </div>
          {desktop && <p className="hs-cap hs-pr-cap"><Lines paras="Not sure where to start? Let’s figure it out together." /></p>}
          {desktop && <ButtonB label="Let's Talk" href="./contacts" desktop />}
        </div>
      </div>
      <div className="hs-pr-right">
        <section className="hs-pr-sp" />
        {PLANS.map((p, i) => (
          <div key={p.name} className="hs-pr-plan">
            {i > 0 && <div className="hs-pr-border"><section /></div>}
            <Plan p={p} yearly={yearly} />
          </div>
        ))}
      </div>
    </div>
  )
}

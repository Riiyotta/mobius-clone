import ButtonB from '../legal/ButtonB'
import { Lines, Rise } from './Motion'

// §4.3 Our Services (home.md). Static layout.
// MOTION (Animation pass): statement H4 appear (opacity .001 → 1, spring 0.6, delay 0.4s, on view);
// "Our Services" H6 char effect (y50, startDelay .1). Caption/CTA are desktop+tablet only (phone dump has none).
const ITEMS = [
  {
    k: 'A',
    text: 'We create identity systems that bring clarity and distinction to brands — thoughtful visuals, cohesive structure, and design that lasts.',
    tags: ['Brand Strategy', 'Visual Identity System', 'Logo & Mark Development', 'Typography & Color System', 'Guidelines & Asset Library'],
  },
  {
    k: 'B',
    text: 'We design intuitive, expressive digital experiences shaped by strong visual direction and seamless interaction across all screens.',
    tags: ['Website & Platform Design', 'Interaction & Motion Guidelines', 'UI Systems', 'Component Libraries', 'Responsive Layouts'],
  },
  {
    k: 'C',
    text: 'We guide ideas from concept to execution, shaping visual and narrative direction for consistent expression across every touchpoint.',
    tags: ['Visual Direction', 'Campaign Concepts', 'Art Direction for Photo & Film', 'Tone & Narrative Guidance', 'Style Frameworks'],
  },
  {
    k: 'D',
    text: 'We help teams make confident decisions by defining direction, sharpening positioning, and building the foundation for meaningful growth.',
    tags: ['Brand Positioning', 'Market & Audience Insights', 'Naming & Messaging', 'Design Audits', 'Roadmaps & Recommendations'],
  },
]

export default function Services({ desktop, phone }) {
  return (
    <div className="hs-svc">
      <div className="hs-svc-left">
        <div className="hs-svc-sticky">
          <div className="hs-svc-tc">
            <section className="hs-svc-sp" />
            <h6 className="hs-h6"><strong><Rise text="Our Services" enabled={desktop} from={50} dur={0.8} delay={0.1} /></strong></h6>
          </div>
          {!phone && <p className="hs-cap hs-svc-cap"><Lines enabled={desktop} paras="If you’re looking for clarity in design, let’s build it together." /></p>}
          {!phone && <ButtonB label="Get Started" href="./contacts" desktop={desktop} />}
        </div>
      </div>
      <div className="hs-svc-right">
        <section className="hs-svc-sp" />
        <div className="hs-svc-list">
          {ITEMS.map((it) => (
            <div key={it.k} className="hs-svc-item">
              <div className="hs-svc-idx">
                <div className="hs-svc-idx-in"><h4 className="hs-svc-h4 hs-svc-k"><Rise text={`${it.k} /`} by="word" enabled={desktop} from={60} dur={0.4} delay={0.2} fade /></h4></div>
              </div>
              <div className="hs-svc-text">
                <h4 className="hs-svc-h4"><Lines enabled={desktop} paras={it.text} delay={200} step={60} /></h4>
                <div className="hs-tags">
                  {it.tags.map((t) => (
                    <div key={t} className="hs-tag"><p><strong>{t}</strong></p></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

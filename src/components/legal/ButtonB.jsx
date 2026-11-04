import { ArrowRight } from './Icons'
import SpringChars from './SpringChars'
import { useInViewOnce } from '../../lib/useInViewOnce'
import { springEase } from '../../lib/spring'
import '../../styles/faq.css'

// Button B (p2KKNkdQo), text link with arrows + underline. legal-404.md §B.5.
// Desktop variant: hover (spring 0.6) + in-view appear (threshold 0.5): chars translateY 50 → 0,
// spring 0.8, 0.025s stagger, start 0.2s; arrows row translateY 30 → 0, spring 0.8, delay 0.6.
// Touch variant (tablet/phone): no appear, no hover, cursor unset.
const S08 = springEase(0.8)

export default function ButtonB({ label, href, desktop }) {
  const [ref, seen] = useInViewOnce({ threshold: 0.5 })
  const arrowsStyle = desktop ? {
    transform: seen ? 'none' : 'translateY(30px)',
    // keep the hover transitions from faq.css alongside the appear transform
    transition: `transform 0.8s ${S08} ${seen ? 0.6 : 0}s, left 0.6s var(--spring-06), right 0.6s var(--spring-06)`,
  } : undefined
  return (
    <a ref={ref} href={href} className={`faq-btnb ${desktop ? 'faq-btnb-desk' : ''}`} data-cursor="hidden">
      <h6 className="faq-btnb-text">
        <SpringChars text={label} animate={desktop} go={seen} delay={0.2} />
      </h6>
      <div className="faq-btnb-arrows" style={arrowsStyle}>
        <ArrowRight className="faq-btnb-arrow" />
        <ArrowRight className="faq-btnb-arrow" />
      </div>
      <div className="faq-btnb-line" />
    </a>
  )
}

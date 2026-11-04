import { ArrowRight } from './Icons'
import '../../styles/faq.css'

// Button A (XOF_jk7P8), black pill. project.md §4.6 / §7.5.
// Desktop variant has the hover (spring 0.4); Tablet/Mobile variants have none.
export default function ButtonA({ label, href, desktop }) {
  return (
    <a href={href} className={`faq-btna ${desktop ? 'faq-btna-desk' : ''}`} data-cursor="hidden">
      <section className="faq-btna-bg" />
      <p className="faq-btna-text">{label}</p>
      <ArrowRight className="faq-btna-arrow faq-btna-arrow1" />
      <ArrowRight className="faq-btna-arrow faq-btna-arrow2" />
    </a>
  )
}

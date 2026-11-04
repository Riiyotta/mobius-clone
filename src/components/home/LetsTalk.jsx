import ButtonB from '../legal/ButtonB'
import { Lines } from './Motion'
import ContactForm from '../contacts/ContactForm'
import '../../styles/contacts.css'

// §4.12 Let’s Talk (home.md). Same section as /contacts §2.1 at all four widths (boxes match the
// home dumps: 2/6/4, 200/40 padding, gap 120; tablet 1/4/1, 160 top, gap 80; phone 120 top, gap 64),
// so it reuses the contacts classes and the shared Contact Form. Home renders the title as an <h2>.
// MOTION (Animation pass): "Do you feel ready…" staggered-lines reveal on view (desktop) — static here.
export default function LetsTalk({ desktop }) {
  return (
    <section className="ct-talk">
      <div className="ct-sticky">
        {desktop && (
          <div className="ct-btnc">
            <h4 className="ct-ready"><Lines delay={600} paras="Do you feel ready to become part of our growing team?" /></h4>
            <ButtonB label="Join Us" href="./studio#career" desktop />
          </div>
        )}
      </div>
      <div className="ct-talk-main">
        <div className="ct-pad">
          <h2 className="ct-h1">Let’s Talk!</h2>
        </div>
        <div className="ct-pad ct-formc">
          <ContactForm desktop={desktop} />
        </div>
      </div>
      <div className="ct-talk-side" />
    </section>
  )
}

import { useEffect } from 'react'
import Footer from '../components/Footer'
import ButtonB from '../components/legal/ButtonB'
import LineStagger from '../components/contacts/LineStagger'
import ContactForm from '../components/contacts/ContactForm'
import ContactImage from '../components/contacts/ContactImage'
import StudioNotes from '../components/contacts/StudioNotes'
import { useMedia } from '../lib/useMedia'
import { useSmoothScroll } from '../lib/useSmoothScroll'
import '../styles/contacts.css'

// /contacts — built against .recon/specs/contacts.md. Desktop >= 1200, tablet 810–1199.98, phone <= 809.98.
const DESCRIPTION = 'Möbius® is a modern agency Framer template built around a unique grid system, dynamic and immersive interactions, and a creative approach to every single page.'

export default function Contacts({ desktop }) {
  const phone = useMedia('(max-width: 809.98px)')
  useSmoothScroll(desktop)

  useEffect(() => {
    document.title = 'Möbius'
    let meta = document.querySelector('meta[name="description"]')
    const created = !meta
    if (created) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    const prev = meta.content
    meta.content = DESCRIPTION
    return () => { if (created) meta.remove(); else meta.content = prev }
  }, [])

  return (
    <div className={`ct${desktop ? ' ct-desk' : ''}`}>
      {/* §2.1 Let's Talk */}
      <section className="ct-talk">
        <div className="ct-sticky">
          {desktop && (
            <div className="ct-btnc">
              <h4 className="ct-ready">
                <LineStagger text="Do you feel ready to become part of our growing team?" initialDelay={600} />
              </h4>
              <ButtonB label="Join Us" href="./studio#career" desktop />
            </div>
          )}
        </div>
        <div className="ct-talk-main">
          <div className="ct-pad">
            <h1 className="ct-h1">Let’s Talk!</h1>
          </div>
          <div className="ct-pad ct-formc">
            <ContactForm desktop={desktop} />
          </div>
        </div>
        <div className="ct-talk-side" />
      </section>

      {/* §2.2 Image + contact card */}
      <ContactImage desktop={desktop} phone={phone} />

      {/* §2.3 Studio Notes */}
      <StudioNotes desktop={desktop} phone={phone} />

      <Footer />
    </div>
  )
}

import { useEffect } from 'react'
import content from '../content/legal.json'
import BigNumber404 from '../components/legal/BigNumber404'
import ButtonB from '../components/legal/ButtonB'
import Faq from '../components/shared/Faq'
import Footer from '../components/Footer'
import { useSmoothScroll } from '../lib/useSmoothScroll'
import '../styles/notfound.css'

const nf = content.notFound

// /404 and every unknown URL, built against .recon/specs/legal-404.md §B.
export default function NotFound({ desktop }) {
  useSmoothScroll(desktop)
  useEffect(() => { document.title = nf.documentTitle }, [])

  return (
    <div className="nf-main">
      <div className="nf-hero">
        <div className="nf-num-wrap">
          <BigNumber404 desktop={desktop} />
        </div>
        <div className="nf-text">
          <p className="nf-copy">{nf.copy}</p>
          <ButtonB label={nf.link.label} href={nf.link.href} desktop={desktop} />
        </div>
      </div>
      <Faq desktop={desktop} />
      {/* TODO: desktop footer variant is still being measured by another agent; this is the shared tablet/phone footer. */}
      <Footer />
    </div>
  )
}

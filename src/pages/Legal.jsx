import { useEffect } from 'react'
import content from '../content/legal.json'
import RichText from '../components/legal/RichText'
import Faq from '../components/shared/Faq'
import Footer from '../components/Footer'
import { useSmoothScroll } from '../lib/useSmoothScroll'
import '../styles/legal.css'

// /legal/<slug>, built against .recon/specs/legal-404.md §A.
// Datetime attribute is from the spec (§A.3); legal.json only carries the display date.
const DATETIME = '2026-05-22T22:23:24.528Z'

export default function Legal({ slug, desktop }) {
  const page = content.pages.find((p) => p.slug === slug)
  useSmoothScroll(desktop && !!page)
  useEffect(() => { if (page) document.title = page.documentTitle }, [page])
  if (!page) return null

  return (
    <>
      <div className="lg-frame">
        {/* Desktop: absolute overlay over the whole frame with a sticky 100vh text box.
            Tablet/phone: an in-flow row after the Intro (CSS order). */}
        <div className="lg-lu">
          {/* Desktop appear: opacity 0.001 → 1, scale 1.6 → 1, spring 0.8 (§A.5, project.md §7.1) — shared .nav-in */}
          <div className={desktop ? 'lg-lu-text nav-in' : 'lg-lu-text'}>
            <p className="lg-lu-label">{page.lastUpdated.label}</p>
            <p className="lg-lu-date"><time dateTime={DATETIME}>{page.lastUpdated.date}</time></p>
          </div>
          <section className="lg-lu-rest" />
        </div>

        <div className="lg-intro">
          <section className="lg-side lg-intro-l" />
          <div className="lg-intro-text">
            <h1 className="lg-h1">{page.h1}</h1>
            <p className="lg-intro-p">{page.intro}</p>
          </div>
          <section className="lg-side lg-intro-r" />
        </div>

        <div className="lg-content">
          <section className="lg-side lg-content-l" />
          <div className="lg-content-box">
            <div className="lg-content-text">
              <RichText blocks={page.body} />
            </div>
          </div>
          <section className="lg-side lg-content-r" />
        </div>
      </div>

      <Faq desktop={desktop} />
      {/* TODO: desktop footer variant is still being measured by another agent; this is the shared tablet/phone footer. */}
      <Footer />
    </>
  )
}

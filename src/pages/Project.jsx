import { useEffect } from 'react'
import Footer from '../components/Footer'
import Hero from '../components/project/Hero'
import Gallery from '../components/project/Gallery'
import NextCase from '../components/project/NextCase'
import { Challenge, Quote, Numbers, Credits } from '../components/project/Sections'
import { findProject } from '../components/project/projectData'
import { useSmoothScroll } from '../lib/useSmoothScroll'
import '../styles/project.css'

// /work/<slug> template (.recon/specs/project.md §1).
export default function Project({ slug, desktop }) {
  const project = findProject(slug)

  // §7.7 Lenis, desktop only.
  useSmoothScroll(!!project && desktop)

  useEffect(() => {
    if (project) document.title = 'Möbius'
  }, [project])

  if (!project) return null
  const s = project.sections

  return (
    <div className="pj-page">
      <div className="pj-case">
        {/* §7.2 sticky "'25" year, desktop only; shares the Intro appear (§7.1). */}
        {desktop && (
          <div className="pj-year">
            <div className="pj-year-t pj-appear">
              <h3 className="pj-grey">{project.year}</h3>
            </div>
          </div>
        )}
        <Hero project={project} desktop={desktop} />
        <Challenge block={s.challenge} />
        <Quote text={s.quote} desktop={desktop} />
        <Challenge block={s.approach} />
        <Gallery gallery={project.gallery} />
        <Challenge block={s.outcome} />
        <Numbers numbers={s.numbers} desktop={desktop} />
        <Credits credits={s.credits} live={project.liveProject} />
      </div>
      {project.next && <NextCase next={project.next} />}
      {/* TODO: desktop footer variant is still being measured by another agent; the shared footer renders on all sizes for now. */}
      <Footer />
    </div>
  )
}

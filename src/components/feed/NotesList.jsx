import ImageReveal from '../fx/ImageReveal'
import { posts, imgSrc } from './feedData'

const INTRO = 'Our thoughts on design, direction, and digital craft — reflections on how brands, systems, and stories find their form.'

// A2: tablet/phone "Notes List". Images are a 60vh hidden sizer + absolute Image Reveal layer.
export default function NotesList() {
  return (
    <div className="fd-notes">
      <section className="fd-notes-side" />
      <section className="fd-notes-main">
        <div className="fd-notes-spacer" />
        <div className="fd-notes-text">
          <div className="fd-notes-title">
            <h1 className="fd-t-h1">Studio Notes</h1>
            <p className="fd-t-body">{INTRO}</p>
          </div>
        </div>
        <div>
          <div className="fd-sticky" />
          <div className="fd-notes-items">
            {posts.map((p) => (
              <a key={p.slug} href={`/feed/${p.slug}`} className="fd-note">
                <div className="fd-note-img" data-cursor="arrow">
                  <section className="fd-note-sizer" />
                  <ImageReveal className="fd-note-reveal" src={imgSrc(p.cover)} alt={p.cover.alt} pos={p.cover.objectPosition} />
                </div>
                <div className="fd-note-text">
                  <p className="fd-t-small fd-t-date">{p.date}</p>
                  <div className="fd-note-inner">
                    <h6 className="fd-t-card" data-cursor="hidden"><strong>{p.title}</strong></h6>
                    <p className="fd-t-body">{p.excerpt}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="fd-notes-side" />
    </div>
  )
}

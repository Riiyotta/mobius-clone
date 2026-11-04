import ImageReveal from '../fx/ImageReveal'
import ButtonB from '../legal/ButtonB'
import LineStagger from './LineStagger'

// Studio Notes (contacts.md §2.3; tablet §6; phone §7). Tablet/phone show only the first note.
const NOTES = [
  {
    slug: 'the-logic-of-emotion',
    date: 'April 26, 2026',
    title: 'The Logic of Emotion',
    img: 'drBPvfLZfwnmhTDHHQbPmsfGe1I.jpg',
    pos: '63.9% 28.8%',
    excerpt: 'In design, clarity isn’t about simplicity for its own sake. It’s about removing what doesn’t serve meaning — until what remains feels inevitable.',
  },
  {
    slug: 'precision-over-perfection',
    date: 'March 29, 2026',
    title: 'Precision Over Perfection',
    img: '3wAhbBL8w69xQSppPtvRjJX8.jpg',
    pos: 'center',
    excerpt: 'Design isn’t about getting everything right — it’s about making the right things matter.',
  },
]

const THOUGHTS = 'Our thoughts on how brands, systems, and stories find their form.'

function Note({ n }) {
  const href = `./feed/${n.slug}`
  return (
    <div className="ct-note">
      <div className="ct-note-imgc">
        <div className="ct-bar" />
        <a href={href} className="ct-note-img" data-cursor="arrow">
          <ImageReveal className="ct-note-reveal" src={`/assets/img/${n.img}`} alt="Möbius" pos={n.pos} />
        </a>
      </div>
      <div className="ct-note-text">
        <p className="ct-date">{n.date}</p>
        <div className="ct-note-inner">
          <h6 className="ct-note-title"><a href={href}><strong>{n.title}</strong></a></h6>
          <p className="ct-excerpt">{n.excerpt}</p>
        </div>
      </div>
    </div>
  )
}

export default function StudioNotes({ desktop, phone }) {
  const notes = desktop ? NOTES : NOTES.slice(0, 1)
  const showSide = desktop || phone // tablet: left column present but empty
  return (
    <section className="ct-notes">
      <div className="ct-notes-left">
        {showSide && (
          <div className="ct-notes-sticky">
            <p className="ct-thoughts">
              {/* desktop: lines, delay 120, duration 600, initialDelay 100; phone: static */}
              <LineStagger text={THOUGHTS} initialDelay={100} enabled={desktop} />
            </p>
            <ButtonB label="Read All" href="./feed" desktop={desktop} />
          </div>
        )}
      </div>
      <div className="ct-notes-mid">
        <div className="ct-notes-sp" />
        <div className="ct-pad">
          <h2 className="ct-h2">Studio Notes</h2>
        </div>
        <div className="ct-notes-c">
          <div className="ct-blog">
            {notes.map((n) => <Note key={n.slug} n={n} />)}
          </div>
        </div>
      </div>
      <div className="ct-notes-right" />
    </section>
  )
}

// Legal rich text (legal-404.md §A.3–§A.4). Blocks come verbatim from legal.json; html strings only
// contain <strong>, <br> and <a href> (mailto href is literally hello@world.com — source quirk, kept).
// Spacer paragraphs (<p><br></p>) get .lg-spacer so a following h5 can take margin-top:40px.
export default function RichText({ blocks }) {
  return (
    <div className="lg-rt">
      {blocks.map((b, i) => {
        if (b.type === 'h5') return <h5 key={i} dangerouslySetInnerHTML={{ __html: b.html }} />
        if (b.type === 'ul')
          return (
            <ul key={i}>
              {b.items.map((li, j) => <li key={j} dangerouslySetInnerHTML={{ __html: li }} />)}
            </ul>
          )
        return <p key={i} className={b.html === '<br>' ? 'lg-spacer' : undefined} dangerouslySetInnerHTML={{ __html: b.html }} />
      })}
    </div>
  )
}

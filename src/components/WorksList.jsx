import { listOrder, listCopy, intro } from '../data'
import ImageReveal from './fx/ImageReveal'

// Tablet (810–1199) / phone (<810) layout (§8, §9).
export default function WorksList() {
  return (
    <div className="works">
      <section className="works-side" />
      <section className="works-main">
        <div className="works-spacer" />
        <div className="works-text">
          <div className="works-title">
            <h1>Work</h1>
            <p>{intro}</p>
          </div>
        </div>
        <div className="works-sticky" />
        <div className="works-items">
          {listOrder.map((c) => (
            <a key={c.id} href={`/work/${c.slug}`} className="works-item">
              <ImageReveal className="works-img" src={c.src} pos={c.pos} />
              <div className="works-meta">
                <h6><strong>{c.name}</strong></h6>
                <p>{listCopy}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
      <section className="works-side" />
    </div>
  )
}

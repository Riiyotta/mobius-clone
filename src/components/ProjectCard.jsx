import { forwardRef } from 'react'

// Project Card (§3.5 / §5.2): image zooms to 120% on hover, name rises letter by letter.
const ProjectCard = forwardRef(function ProjectCard({ card }, ref) {
  return (
    <div ref={ref} className="card-wrap" style={{ width: card.w }}>
      <a href={`/work/${card.slug}`} className="card-link" draggable={false} data-cursor="arrow">
        <div className="card" style={{ height: card.h }}>
          <section className="card-img">
            <img src={card.src} alt="Möbius" draggable={false} style={{ objectPosition: card.pos }} />
          </section>
          <div className="card-name">
            <h4 style={{ color: card.color }}>
              <strong>
                {[...card.name].map((c, i) => (
                  <span key={i} className="name-char" style={{ animationDelay: `${i * 0.025}s` }}>
                    {c === ' ' ? ' ' : c}
                  </span>
                ))}
              </strong>
            </h4>
          </div>
        </div>
      </a>
    </div>
  )
})
export default ProjectCard

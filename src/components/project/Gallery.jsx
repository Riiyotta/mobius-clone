import { img, ratio } from './projectData'

// §4.4 Gallery: sticky white bar + two W/2 columns. A/D are "small" (u·4 image container
// beside a u·2 spacer), B/C are "large" (full column). Height = width × natural aspect.
function Slot({ g }) {
  const pic = (
    <div className="pj-g-img" data-cursor="hidden">
      <img src={img(g.url)} alt="Möbius" draggable={false} style={{ aspectRatio: ratio(g.natural), objectPosition: g.objectPosition }} />
    </div>
  )
  if (g.size === 'large') return pic
  const spacer = <section className="pj-g-sp" />
  return (
    <div className="pj-g-small">
      {g.column === 'left' && spacer}
      {pic}
      {g.column === 'right' && spacer}
    </div>
  )
}

export default function Gallery({ gallery }) {
  const left = gallery.filter((g) => g.column === 'left')
  const right = gallery.filter((g) => g.column === 'right')
  return (
    <div className="pj-gc">
      <section className="pj-g-sticky" />
      <div className="pj-g">
        <div className="pj-g-col">{left.map((g) => <Slot key={g.slot} g={g} />)}</div>
        <div className="pj-g-col">{right.map((g) => <Slot key={g.slot} g={g} />)}</div>
      </div>
    </div>
  )
}

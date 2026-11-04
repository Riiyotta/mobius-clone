import ImageReveal from '../fx/ImageReveal'
import CharRise from '../fx/CharRise'
import { posts, imgSrc, aspect } from './feedData'

// B2.7 card selection. `desk` cards (Previous / 3rd) are hidden below 1200 (B3).
//   first post  → Next (left) + 3rd (right)
//   middle post → Previous (left) + Next (right)
//   last post   → Previous (left) + 1st (right)
export function pickReadMore(index) {
  const last = posts.length - 1
  if (index === 0) return [{ post: posts[1], desk: false }, { post: posts[2], desk: true }]
  if (index === last) return [{ post: posts[index - 1], desk: true }, { post: posts[0], desk: false, first: true }]
  return [{ post: posts[index - 1], desk: true }, { post: posts[index + 1], desk: false }]
}

// The "1st" card on the last post is a different instance on the original: its sticky bar stays 80px at every size.
function Card({ post, desk, first }) {
  const href = `/feed/${post.slug}`
  return (
    <div className={`fd-rm-card${desk ? ' fd-rm-desk' : ''}${first ? ' fd-rm-first' : ''}`}>
      <div className="fd-rm-imgc">
        <div className="fd-sticky" />
        <a href={href} className="fd-rm-img" data-cursor="arrow">
          <ImageReveal
            className="fd-rm-reveal"
            src={imgSrc(post.cover)}
            alt={post.cover.alt}
            pos={post.cover.objectPosition}
            style={{ aspectRatio: aspect(post.cover) }}
          />
        </a>
      </div>
      <div className="fd-rm-text">
        <p className="fd-t-small fd-t-date">{post.date}</p>
        <div className="fd-rm-inner">
          <h6 className="fd-t-card">
            <a href={href} data-cursor="hidden"><strong>{post.title}</strong></a>
          </h6>
          <p className="fd-t-body">{post.excerpt}</p>
        </div>
      </div>
    </div>
  )
}

export default function ReadMore({ index, desktop }) {
  const cards = pickReadMore(index)
  return (
    <div className="fd-row fd-rm">
      <section className="fd-rm-side" />
      <div className="fd-rm-main">
        <div className="fd-rm-spacer" />
        <div className="fd-pad">
          <h4 className="fd-t-rm fd-rm-title">
            <strong>{desktop ? <CharRise text="Read More" delay={0.2} /> : 'Read More'}</strong>
          </h4>
        </div>
        <div className="fd-rm-cards">
          {cards.map((c) => <Card key={c.post.slug} {...c} />)}
        </div>
      </div>
      <section className="fd-rm-side" />
    </div>
  )
}

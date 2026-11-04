import { useEffect } from 'react'
import Footer from '../components/Footer'
import ImageReveal from '../components/fx/ImageReveal'
import WordStagger from '../components/fx/WordStagger'
import ReadMore from '../components/feed/ReadMore'
import { posts, imgSrc, aspect } from '../components/feed/feedData'
import { useSmoothScroll } from '../lib/useSmoothScroll'
import '../styles/feed.css'

// CMS content only contains <p> (feed.md §1); render every block as a 1uqjdsf paragraph.
const Rich = ({ blocks }) => (
  <div className="fd-rich">
    {blocks.map((b, i) => <p key={i} className="fd-t-body">{b.text}</p>)}
  </div>
)

function Content({ which, blocks, children }) {
  return (
    <div className={`fd-row fd-ct fd-ct-${which.toLowerCase()}`}>
      <section className="fd-ct-left" />
      <div className="fd-ct-text">
        <div className="fd-ct-inner">
          <Rich blocks={blocks} />
          {children}
        </div>
      </div>
      <section className="fd-ct-gap" />
      <div className="fd-ct-label">
        <h3 className="fd-t-num">/ {which}</h3>
      </div>
    </div>
  )
}

export default function Post({ slug, desktop }) {
  const index = posts.findIndex((p) => p.slug === slug)
  const post = posts[index]

  // B5.5: Lenis only on post pages at >=1200.
  useSmoothScroll(!!post && desktop)

  useEffect(() => {
    if (post) document.title = `${post.title} - My Framer Site`
  }, [post])

  if (!post) return null
  const total = posts[0].articleNumber

  return (
    <>
      <article className="fd-post">
        {/* B2.1 Article Number: pinned bottom-left on desktop/tablet, static first row on phone. */}
        <div className="fd-num-layer">
          <div className={`fd-num-box${desktop ? ' nav-in' : ''}`}>
            <div className="fd-num-row">
              <h3 className="fd-t-num">{post.articleNumber}</h3>
              <h3 className="fd-t-num">/</h3>
              <h3 className="fd-t-num">{total}</h3>
            </div>
          </div>
          <div className="fd-num-rest" />
        </div>

        {/* B2.2 Intro */}
        <div className="fd-row fd-intro">
          <section className="fd-side2" />
          <div className={`fd-main8 fd-intro-text${desktop ? ' nav-in' : ''}`}>
            <div className="fd-pad">
              <p className="fd-t-small fd-t-date">{post.date}</p>
            </div>
            <div className="fd-pad fd-intro-block">
              <h1 className="fd-t-h1">{post.title}</h1>
              <p className="fd-t-body">{post.excerpt}</p>
            </div>
          </div>
          <section className="fd-side2" />
        </div>

        {/* B2.3 Cover: no data-cursor (default black dot). */}
        <div className="fd-row fd-cover-row">
          <section className="fd-side2" />
          <div className="fd-main8">
            <div className="fd-cover-wrap">
              <div className="fd-sticky" />
              <ImageReveal
                className="fd-cover"
                src={imgSrc(post.cover)}
                alt={post.cover.alt}
                pos={post.cover.objectPosition}
                style={{ aspectRatio: aspect(post.cover) }}
              />
            </div>
          </div>
          <section className="fd-side2" />
        </div>

        <Content which="A" blocks={post.contentA} />

        {/* B2.5 Quote: Staggered Text on desktop, plain h4 below 1200. */}
        <div className="fd-row fd-q">
          <section className="fd-side2" />
          <div className="fd-q-main">
            <div className="fd-pad">
              {desktop ? (
                <h4 className="fd-quote fd-quote-anim">
                  <WordStagger text={post.quote} firstIndent={160} className="fd-quote-line" />
                </h4>
              ) : (
                <h4 className="fd-quote">{post.quote}</h4>
              )}
            </div>
          </div>
        </div>

        <Content which="B" blocks={post.contentB}>
          <p className="fd-t-small fd-t-date">{post.author}</p>
        </Content>

        <ReadMore index={index} desktop={desktop} />
      </article>
      {/* TODO: desktop footer variant is still being measured by another agent; the shared footer renders on all sizes for now. */}
      <Footer />
    </>
  )
}

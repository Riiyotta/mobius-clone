import { useInViewOnce } from '../../lib/useInViewOnce'

// Framer "Image Reveal": hard-edged left→right mask wipe, 1.2s cubic-bezier(0.6,0,0.4,1), once in view.
// mask: linear-gradient(90deg, #000 P%, transparent P%), P 0 → 100 (animated via @property --reveal).
export default function ImageReveal({ src, alt = 'Möbius', pos = 'center', className = '', style, imgStyle, loading }) {
  const [ref, seen] = useInViewOnce()
  return (
    <div ref={ref} className={`reveal ${seen ? 'is-in' : ''} ${className}`} style={style}>
      <img src={src} alt={alt} draggable={false} loading={loading} style={{ objectPosition: pos, ...imgStyle }} />
    </div>
  )
}

import { useInViewOnce } from '../../lib/useInViewOnce'

// Framer "Staggered Text": each word rises translateY(100%) → 0 inside an overflow:hidden wrapper,
// CSS transition 600ms cubic-bezier(.4,1,.4,1), i*60ms stagger; useInView(once, margin "-10% 0px").
export default function WordStagger({ text, step = 0.06, firstIndent = 0, className = '', style, enabled = true }) {
  const [ref, seen] = useInViewOnce({ margin: '-10% 0px' })
  const go = !enabled || seen
  const words = text.split(/(?<=\s)/)
  return (
    <span ref={ref} className={`word-stagger ${className}`} style={style}>
      {words.map((w, i) => (
        <span key={i} className="ws-mask">
          <span
            className="ws-word"
            style={{
              marginLeft: i === 0 ? firstIndent : 0,
              transform: go ? 'translateY(0%)' : 'translateY(100%)',
              transition: enabled ? `transform 600ms cubic-bezier(.4,1,.4,1) ${i * step}s` : 'none',
            }}
          >
            {w}
          </span>
        </span>
      ))}
    </span>
  )
}

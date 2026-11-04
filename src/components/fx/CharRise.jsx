import { useInViewOnce } from '../../lib/useInViewOnce'

// Framer character appear: each char translateY(from) → 0, spring 0.6s bounce 0,
// stagger 0.025s, optional start delay; triggers once in view (or immediately with `now`).
export default function CharRise({ text, from = 200, delay = 0, stagger = 0.025, now = false, className = '' }) {
  const [ref, seen] = useInViewOnce()
  const go = now || seen
  return (
    <span ref={ref} className={`char-rise ${className}`}>
      {[...text].map((c, i) => (
        <span
          key={i}
          className="char-rise-c"
          style={{
            transform: go ? 'none' : `translateY(${from}px)`,
            transition: go ? `transform 0.6s var(--spring-06) ${delay + i * stagger}s` : 'none',
          }}
        >
          {c === ' ' ? ' ' : c}
        </span>
      ))}
    </span>
  )
}

import { springEase } from '../../lib/spring'

// Framer char appear: each char translateY(from) → 0 (opacity stays 1), spring `dur` bounce 0,
// per-char `stagger`, plus `delay`. `animate` false = static text; `go` triggers the rise.
export default function SpringChars({ text, animate, go, from = 50, dur = 0.8, delay = 0, stagger = 0.025 }) {
  if (!animate) return text
  const ease = springEase(dur)
  return [...text].map((c, i) => (
    <span
      key={i}
      className="faq-ch"
      style={{
        transform: go ? 'none' : `translateY(${from}px)`,
        transition: go ? `transform ${dur}s ${ease} ${delay + i * stagger}s` : 'none',
      }}
    >
      {c}
    </span>
  ))
}

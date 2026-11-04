import { useLayoutEffect, useRef } from 'react'
import WordStagger from '../fx/WordStagger'

// Framer staggered-text, staggerBy "lines" (studio.md §2): every word on line n starts at
// initialDelay + n*lineDelay. WordStagger staggers per word, so it is rendered with step 0 and each
// word's transition-delay is set from its measured line (new line when top differs by > 5px).
export default function LineStagger({ text, lineDelay = 120, initialDelay = 0, enabled = true }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    if (!enabled) return
    const el = ref.current
    const assign = () => {
      let line = -1
      let top = null
      el.querySelectorAll('.ws-mask').forEach((m) => {
        const t = m.getBoundingClientRect().top
        if (top === null || Math.abs(t - top) > 5) { line++; top = t }
        m.firstChild.style.setProperty('transition-delay', `${initialDelay + line * lineDelay}ms`, 'important')
      })
    }
    assign()
    if (document.fonts) document.fonts.ready.then(assign)
    window.addEventListener('resize', assign)
    return () => window.removeEventListener('resize', assign)
  }, [text, lineDelay, initialDelay, enabled])

  return (
    <span ref={ref}>
      <WordStagger text={text} step={0} enabled={enabled} />
    </span>
  )
}

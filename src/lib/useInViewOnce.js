import { useEffect, useRef, useState } from 'react'

// Framer appear/animateOnce: fires once when the element first intersects.
export function useInViewOnce({ margin = '0px', threshold = 0 } = {}) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect() }
    }, { rootMargin: margin, threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [seen, margin, threshold])
  return [ref, seen]
}

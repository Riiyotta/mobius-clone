import { useEffect } from 'react'
import Lenis from 'lenis'

// Framer smooth-scroll component = Lenis({ duration: 2.0, easing: expo-out }), desktop (>=1200) only.
export function useSmoothScroll(enabled) {
  useEffect(() => {
    if (!enabled) return
    const lenis = new Lenis({
      smoothWheel: true,
      duration: 2.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1,
      autoRaf: true,
      anchors: true,
      stopInertiaOnNavigate: true,
    })
    window.__lenis = lenis
    return () => { if (window.__lenis === lenis) window.__lenis = null; lenis.destroy() }
  }, [enabled])
}

import { useEffect, useState } from 'react'
import { SPRING_06 } from '../../lib/spring'

// Team Card, "Touch" variant at every width (studio.md §3.2.4). <a> with no href, no hover.
// Name is split into per-character inline-block spans (grouped per word so lines only break at spaces).
// Desktop on-mount appear (studio.md §2): name chars translateY 200 → 0 (spring 0.6, bounce 0,
// 0.025s stagger across the name's characters); role opacity 0.001 → 1 (spring 0.6, delay 0.4).
// Measured on the original, the char effect (Framer text effect, trigger onMount) starts after
// hydration, so its onset relative to the role fade (0.4s from mount) varied from -110ms to +110ms
// across runs. CHAR_START = 0.35 puts the first char ~50ms before the role, inside that range.
const CHAR_START = 0.35
export default function TeamCard({ name, role, src, desktop }) {
  const [go, setGo] = useState(!desktop)
  useEffect(() => {
    if (!desktop) { setGo(true); return }
    setGo(false)
    // two frames so the hidden state is committed before the transition target is set
    let r2 = 0
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setGo(true)) })
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2) }
  }, [desktop])

  const words = name.split(' ')
  let k = 0
  const charStyle = () => {
    if (!desktop) return undefined
    const i = k++
    return {
      transform: go ? 'none' : 'translateY(200px)',
      transition: go ? `transform 0.6s ${SPRING_06} ${(CHAR_START + i * 0.025).toFixed(3)}s` : 'none',
    }
  }
  const roleStyle = desktop ? {
    opacity: go ? 1 : 0.001,
    transition: go ? `opacity 0.6s ${SPRING_06} 0.4s` : 'none',
  } : undefined
  return (
    <a className="st-tc">
      <img className="st-tc-img" src={src} alt="Möbius" draggable={false} />
      <div className="st-tc-shade" />
      <div className="st-tc-text">
        <h4 className="st-tc-name">
          <strong>
            {words.map((w, i) => (
              <span key={i}>
                {i > 0 && ' '}
                <span className="st-tc-word">
                  {[...w].map((c, j) => <span key={j} className="st-tc-char" style={charStyle()}>{c}</span>)}
                </span>
              </span>
            ))}
          </strong>
        </h4>
        <p className="st-tc-role" style={roleStyle}>{role}</p>
      </div>
    </a>
  )
}

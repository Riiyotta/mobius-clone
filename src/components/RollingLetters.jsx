import { useRef, useState } from 'react'

// Framer "Rolling Letters": every letter rolls up one line on hover.
// 0.4s, cubic-bezier(0.8,0,0.4,1), 0.03s stagger, desktop (>=1200) only, no roll-back on leave.
export default function RollingLetters({ text, height = 14 }) {
  const [rolling, setRolling] = useState(false)
  const busy = useRef(false)
  const chars = [...text]

  const onEnter = () => {
    if (busy.current || window.innerWidth < 1200) return
    busy.current = true
    setRolling(true)
  }
  const onEnd = (i) => {
    if (i !== chars.length - 1) return
    setRolling(false) // remount at y 0 for the next hover
    busy.current = false
  }

  return (
    <div className="relative inline-block cursor-pointer" onMouseEnter={onEnter}>
      <div className="flex">
        {chars.map((c, i) => (
          <div key={i} className="relative inline-block overflow-visible" style={{ height }}>
            <div className="relative h-full" style={{ clipPath: 'inset(0px -8px 0px -8px)' }}>
              <div
                className="relative h-full"
                style={{
                  transform: rolling ? 'translateY(-100%)' : 'translateY(0)',
                  transition: rolling ? `transform 0.4s cubic-bezier(0.8,0,0.4,1) ${i * 0.03}s` : 'none',
                }}
                onTransitionEnd={() => onEnd(i)}
              >
                <div className="relative inline-block">{c === ' ' ? ' ' : c}</div>
                <div className="absolute left-0 top-full inline-block">{c === ' ' ? ' ' : c}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'

// Layout-template clock (desktop only): "BERLIN, DE hh:mm AM", Europe/Berlin, refreshed every 1000ms.
const fmt = () => new Date().toLocaleTimeString('en-US', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', hour12: true })

export default function BerlinClock() {
  const [t, setT] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="clock">
      <span className="clock-city">{'BERLIN, DE'}</span>
      <span>{t}</span>
    </div>
  )
}

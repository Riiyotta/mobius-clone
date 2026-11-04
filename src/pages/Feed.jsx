import { useEffect } from 'react'
import NotesTicker from '../components/feed/NotesTicker'
import NotesList from '../components/feed/NotesList'
import Footer from '../components/Footer'
import '../styles/feed.css'

// Desktop: non-scrolling 3-column ticker, no footer (A1). Tablet/phone: Notes List + footer (A2).
export default function Feed({ desktop }) {
  useEffect(() => { document.title = 'Möbius' }, [])
  return desktop ? (
    <div className="fd-desk">
      <NotesTicker />
    </div>
  ) : (
    <>
      <NotesList />
      <Footer />
    </>
  )
}

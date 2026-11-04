import Hero from '../components/home/Hero'
import Footer from '../components/Footer'
import Scramble from '../components/home/Scramble'
import Reel from '../components/home/Reel'
import Services from '../components/home/Services'
import Numbers from '../components/home/Numbers'
import Awards from '../components/home/Awards'
import Founders from '../components/home/Founders'
import Partners from '../components/home/Partners'
import Process from '../components/home/Process'
import Testimonials from '../components/home/Testimonials'
import Pricing from '../components/home/Pricing'
import LetsTalk from '../components/home/LetsTalk'
import StudioNotes from '../components/contacts/StudioNotes'
import Faq from '../components/shared/Faq'
import { useSmoothScroll } from '../lib/useSmoothScroll'
import { useMedia } from '../lib/useMedia'
import '../styles/home.css'
import '../styles/home-sections.css'

// Home (.recon/specs/home.md): hero/loader (built), sections §4.1–§4.13, footer.
// Desktop >= 1200 (`desktop` prop), tablet 810–1199.98, phone <= 809.98.
export default function Home({ desktop }) {
  const phone = useMedia('(max-width: 809.98px)')
  useSmoothScroll(desktop)
  return (
    <>
      <Hero desktop={desktop} />
      <div className="hs">
        <Scramble desktop={desktop} />
        <Reel desktop={desktop} phone={phone} />
        <Services desktop={desktop} phone={phone} />
        <Numbers desktop={desktop} phone={phone} />
        <Awards desktop={desktop} phone={phone} />
        <Founders desktop={desktop} />
        <Partners desktop={desktop} phone={phone} />
        <Process desktop={desktop} phone={phone} />
        <Testimonials desktop={desktop} />
        <Pricing desktop={desktop} />
        <StudioNotes desktop={desktop} phone={phone} />
        <LetsTalk desktop={desktop} />
        <Faq desktop={desktop} />
      </div>
      <Footer />
    </>
  )
}

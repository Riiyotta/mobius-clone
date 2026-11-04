import WorkTitle from '../components/WorkTitle'
import InfiniteCanvas from '../components/InfiniteCanvas'
import WorksList from '../components/WorksList'
import Footer from '../components/Footer'

export default function Work({ desktop }) {
  return desktop ? (
    <div className="page-desk">
      <WorkTitle />
      <InfiniteCanvas />
    </div>
  ) : (
    <>
      <WorksList />
      <Footer force="tablet" />
    </>
  )
}

import { useState, useEffect } from 'react'
import Nav from './components/Nav'
import MenuOverlay from './components/MenuOverlay'
import Cursor from './components/Cursor'
import Work from './pages/Work'
import Pending from './pages/Pending'
import Feed from './pages/Feed'
import Home from './pages/Home'
import Studio from './pages/Studio'
import Contacts from './pages/Contacts'
import Project from './pages/Project'
import projects from './content/projects.json'
import feed from './content/feed.json'
import Legal from './pages/Legal'
import NotFound from './pages/NotFound'
import { legalSlugs } from './lib/legalSlugs'
import Post from './pages/Post'
import { useMedia } from './lib/useMedia'
import { usePath, match } from './lib/router'

export default function App() {
  const desktop = useMedia('(min-width: 1200px)')
  const path = usePath()
  const route = match(path)
  const [menu, setMenu] = useState(false)
  useEffect(() => setMenu(false), [path])

  let page
  switch (route.name) {
    case 'home': page = <Home desktop={desktop} />; break
    case 'work': page = <Work desktop={desktop} />; break
    case 'project': page = (Array.isArray(projects) ? projects : projects.projects).some((p) => p.slug === route.slug) ? <Project slug={route.slug} desktop={desktop} /> : <NotFound desktop={desktop} />; break
    case 'contacts': page = <Contacts desktop={desktop} />; break
    case 'studio': page = <Studio desktop={desktop} />; break
    case 'feed': page = <Feed desktop={desktop} />; break
    case 'post': page = (Array.isArray(feed) ? feed : feed.posts || []).some((p) => p.slug === route.slug) ? <Post slug={route.slug} desktop={desktop} /> : <NotFound desktop={desktop} />; break
    case 'legal': page = legalSlugs.includes(route.slug) ? <Legal slug={route.slug} desktop={desktop} /> : <NotFound desktop={desktop} />; break
    case '404': page = <NotFound desktop={desktop} />; break
    default: page = <Pending name={route.name} />
  }

  return (
    <div className="page" key={path}>
      {page}
      <Nav onMenu={() => setMenu(true)} animate={desktop} clock={desktop && !['work', 'feed'].includes(route.name)} />
      {!desktop && <MenuOverlay open={menu} onClose={() => setMenu(false)} />}
      {desktop && <Cursor />}
    </div>
  )
}

import { useEffect, useState } from 'react'

// Tiny client-side router. The original swaps routes instantly (no transitions),
// so same-origin link clicks just pushState and re-render.
// Scroll to an in-page anchor the way the original does (Lenis, 2s expo-out on desktop).
export function scrollToHash(hash) {
  const el = hash && document.getElementById(decodeURIComponent(hash.slice(1)))
  if (!el) return false
  if (window.__lenis) window.__lenis.scrollTo(el)
  else el.scrollIntoView()
  return true
}

export function navigate(to, hash = '') {
  if (to === location.pathname) {
    if (hash) { history.replaceState({}, '', to + hash); scrollToHash(hash) }
    return
  }
  history.pushState({}, '', to + hash)
  window.scrollTo(0, 0)
  window.dispatchEvent(new Event('route'))
  // cross-page anchor (e.g. ./studio#career): wait for the new page to mount
  if (hash) setTimeout(() => scrollToHash(hash), 300)
}

export function usePath() {
  const [path, setPath] = useState(location.pathname)
  useEffect(() => {
    const on = () => setPath(location.pathname)
    const click = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest && e.target.closest('a[href]')
      if (!a || a.target === '_blank') return
      const url = new URL(a.href, location.href)
      if (url.origin !== location.origin) return
      e.preventDefault()
      navigate(url.pathname.replace(/\/+$/, '') || '/', url.hash)
    }
    window.addEventListener('popstate', on)
    window.addEventListener('route', on)
    document.addEventListener('click', click)
    return () => {
      window.removeEventListener('popstate', on)
      window.removeEventListener('route', on)
      document.removeEventListener('click', click)
    }
  }, [])
  return path.replace(/\/+$/, '') || '/'
}

export function match(path) {
  let m
  if (path === '/') return { name: 'home' }
  if (path === '/work') return { name: 'work' }
  if ((m = path.match(/^\/work\/([^/]+)$/))) return { name: 'project', slug: m[1] }
  if (path === '/feed') return { name: 'feed' }
  if ((m = path.match(/^\/feed\/([^/]+)$/))) return { name: 'post', slug: m[1] }
  if (path === '/studio') return { name: 'studio' }
  if (path === '/contacts') return { name: 'contacts' }
  if ((m = path.match(/^\/legal\/([^/]+)$/))) return { name: 'legal', slug: m[1] }
  return { name: '404' }
}

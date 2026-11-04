// Card table from CLONE_SPEC.md §3.4. x/y = top-left inside the 2600x2300 tile.
const img = (id) => `/assets/img/${id}.jpg`

export const TILE_W = 2600
export const TILE_H = 2300

// DOM/paint order on the original is 12 → 01.
export const cards = [
  { id: '12', slug: 'orbit-404', name: 'Orbit 404', x: 252, y: 45.668, w: 380, h: 506.664, src: img('i5EVAPbSjFlbPcvvbXVwzln3BY'), color: '#fff', pos: 'center' },
  { id: '11', slug: 'axis-point', name: 'Axis Point', x: 1336, y: 42.5, w: 500, h: 375, src: img('0vnxbbxLjIiUePXnIzdt69Rk'), color: '#fff', pos: 'center' },
  { id: '10', slug: 'echoform', name: 'Echoform', x: 1986, y: 1813.5, w: 500, h: 375, src: img('hT3qlH9GjIZn0XY4ES3pI2A8LU'), color: '#fff', pos: 'center' },
  { id: '09', slug: 'golden-hour', name: 'Golden Hour', x: 2098, y: 160.668, w: 380, h: 506.664, src: img('70P7DlHOLA5V6H0shE8MTQZ5XW0'), color: '#fff', pos: 'center' },
  { id: '08', slug: 'after-light', name: 'After Light', x: 148, y: 1518.762, w: 380, h: 504.477, src: img('DsGJvT1AjWPpAnwaISwENoGk'), color: '#000', pos: 'center' },
  { id: '07', slug: 'forma-nine', name: 'Forma Nine', x: 2046, y: 1034.668, w: 380, h: 506.664, src: img('aHAP7xg5ONNK4g1WeQC34kBsVs'), color: '#fff', pos: 'center' },
  { id: '06', slug: 'pulse', name: 'Pulse', x: 798, y: 1793.668, w: 380, h: 506.664, src: img('wvQDwJd4SD2wngQjJZQMGAI'), color: '#fff', pos: '52.3% 16.3%' },
  { id: '05', slug: 'zero-parallel', name: 'Zero Parallel', x: 88, y: 847.5, w: 500, h: 375, src: img('5jd5VWBN8ZG85MGXuhQfHfdV3M'), color: '#fff', pos: 'center' },
  { id: '04', slug: 'north-layer', name: 'North Layer', x: 798, y: 321.668, w: 380, h: 506.664, src: img('ZdoJlTXzsfF4jck8jdi8x8jmQN8'), color: '#fff', pos: 'center' },
  { id: '03', slug: 'wavehouse', name: 'Wave 124', x: 1396, y: 1379.668, w: 380, h: 506.664, src: img('JZNaIjPNcrDF3IgxsRH6Azc8'), color: '#fff', pos: 'center' },
  { id: '02', slug: 'bright-matter', name: 'Bright Matter', x: 772, y: 1126.668, w: 380, h: 506.664, src: img('TgD2gKSlOfhH9eJku8ilavEy2Vs'), color: '#fff', pos: 'center' },
  { id: '01', slug: 'soma-studio', name: 'Soma Studio', x: 1526, y: 643.668, w: 380, h: 506.664, src: img('91tSqsa2UCoJo8t9Pw7JOunYw'), color: '#fff', pos: '46.6% 26%' },
]

// Tablet/phone list order is 01 → 12.
export const listOrder = [...cards].reverse()

export const navLinks = [
  { label: 'WORK', href: '/work', menu: 'Work' },
  { label: 'STUDIO', href: '/studio', menu: 'Studio' },
  { label: 'FEED', href: '/feed', menu: 'Feed' },
  { label: 'CONTACT', href: '/contacts', menu: 'Contact' },
]

export const listCopy =
  'This project was about redefining identity and digital presence to communicate quiet confidence, heritage, and timeless refinement. Möbius focused on creating a brand expression that balances clarity with enduring elegance.'

export const intro =
  "A look at the projects we've crafted with teams around the world, each shaped by clarity and collaboration."

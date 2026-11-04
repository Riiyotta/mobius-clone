import data from '../../content/projects.json'

export const projects = data.projects
export const findProject = (slug) => projects.find((p) => p.slug === slug)

// Images are mirrored to /public/assets/img/<framerusercontent filename>.
export const img = (url) => `/assets/img/${url.split('/').pop()}`

// fitImageDimension:height → the box keeps the image's natural aspect (§4.4).
export const ratio = ([w, h]) => `${w} / ${h}`

// Phosphor ArrowRight bold (project-assets.json icons[0]).
export const ARROW_RIGHT = 'M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z'

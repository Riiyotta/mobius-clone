import data from '../../content/feed.json'

// CMS index order (date desc), see feed.md §A.
export const posts = data.posts

// Covers are downloaded to /assets/img/<same filename as the framerusercontent URL>.
export const imgSrc = (cover) => `/assets/img/${cover.src.split('/').pop()}`
export const aspect = (cover) => `${cover.width} / ${cover.height}`

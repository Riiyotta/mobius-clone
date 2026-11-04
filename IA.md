# https://mobius.framer.website: sitemap.xml (30 routes) + /404

Source: https://mobius.framer.website: sitemap.xml (30 routes) + /404
Status: **measured-from-live-site**
31 routes · 10 templates · 51 unique sections

> Generated from `ia.json` by `build.mjs`. Edit the JSON, not this file.

## Shape of the site

The largest 3 templates (Project case study, Feed post, Legal document) account for 24 of 31 routes (77%). The remaining 7 routes span 7 templates.

| template | routes | share |
|---|---:|---:|
| Project case study | 11 | 35% |
| Feed post | 11 | 35% |
| Legal document | 2 | 6% |
| Home | 1 | 3% |
| Work index | 1 | 3% |
| Project case study (last, no next project) | 1 | 3% |
| Studio | 1 | 3% |
| Contacts | 1 | 3% |
| Feed index | 1 | 3% |
| 404 | 1 | 3% |

## Page chrome

**29 routes carry chrome = `nav+footer`** — Home, Project case study, Project case study (last, no next project), Studio, Contacts, Feed post, Legal document, 404.

**2 routes carry chrome = `nav, footer below 1200 only`** — Work index, Feed index.

## Sections by reuse

How widely a section is shared determines whether it belongs in a shared
component library or stays local to its page.

| section | category | templates | routes | implementation | scope |
|---|---|---:|---:|---|---|
| `shell.nav` | SHELL | 10 | 31 | `src/components/Nav.jsx (+ RollingLetters.jsx)` | Present on all 31 routes. |
| `shell.menu-overlay` | SHELL | 10 | 31 | `src/components/MenuOverlay.jsx` | Available on all 31 routes below 1200px only. |
| `shell.cursor` | SHELL | 10 | 31 | `src/components/Cursor.jsx` | Present on all 31 routes at >=1200px only. |
| `shell.footer` | SHELL | 10 | 31 | `src/components/Footer.jsx` | Present on all 31 routes, but /work and /feed render it only below 1200px. |
| `shell.clock` | SHELL | 8 | 29 | `src/components/BerlinClock.jsx` | Present on 29 routes at >=1200px: every route except /work and /feed. |
| `hero.project-intro` | HERO | 2 | 12 | `src/components/project/Hero.jsx` | On the 12 /work/<slug> routes. |
| `work.project-year` | WORK | 2 | 12 | `src/pages/Project.jsx (pj-year)` | On the 12 /work/<slug> routes, >=1200px. |
| `work.project-text-block` | WORK | 2 | 12 | `src/components/project/Sections.jsx > Challenge` | On the 12 /work/<slug> routes. |
| `work.project-quote` | WORK | 2 | 12 | `src/components/project/Sections.jsx > Quote` | On the 12 /work/<slug> routes. |
| `work.project-gallery` | WORK | 2 | 12 | `src/components/project/Gallery.jsx` | On the 12 /work/<slug> routes. |
| `work.project-credits` | WORK | 2 | 12 | `src/components/project/Sections.jsx > Credits` | On the 12 /work/<slug> routes. |
| `proof.project-numbers` | PROOF | 2 | 12 | `src/components/project/Sections.jsx > Numbers` | On the 12 /work/<slug> routes. |
| `hero.post-intro` | HERO | 1 | 11 | `src/pages/Post.jsx (intro block)` | On the 11 /feed/<slug> routes. |
| `work.next-project` | WORK | 1 | 11 | `src/components/project/NextCase.jsx` | On 11 of the 12 /work/<slug> routes (not on the last project, orbit-404). |
| `editorial.post-number` | EDITORIAL | 1 | 11 | `src/pages/Post.jsx (fd-num-layer)` | On the 11 /feed/<slug> routes. |
| `editorial.post-cover` | EDITORIAL | 1 | 11 | `src/pages/Post.jsx (fd-cover)` | On the 11 /feed/<slug> routes. |
| `editorial.post-body` | EDITORIAL | 1 | 11 | `src/pages/Post.jsx > Content` | On the 11 /feed/<slug> routes. |
| `editorial.post-quote` | EDITORIAL | 1 | 11 | `src/pages/Post.jsx (fd-q)` | On the 11 /feed/<slug> routes. |
| `editorial.read-more` | EDITORIAL | 1 | 11 | `src/components/feed/ReadMore.jsx` | On the 11 /feed/<slug> routes. |
| `support.faq` | SUPPORT | 3 | 4 | `src/components/shared/Faq.jsx` | On 4 routes: /, both /legal/<slug> pages and /404. |
| `conversion.lets-talk` | CONVERSION | 2 | 2 | `src/pages/Contacts.jsx (ct-talk) and src/components/home/LetsTalk.jsx, both using contacts/ContactForm.jsx` | On 2 routes: /contacts (title as h1) and / (title as h2). |
| `editorial.studio-notes` | EDITORIAL | 2 | 2 | `src/components/contacts/StudioNotes.jsx` | On 2 routes: / and /contacts. |
| `hero.legal-intro` | HERO | 1 | 2 | `src/pages/Legal.jsx (lg-intro)` | On the 2 /legal/<slug> routes. |
| `editorial.legal-updated` | EDITORIAL | 1 | 2 | `src/pages/Legal.jsx (lg-lu)` | On the 2 /legal/<slug> routes. |
| `editorial.legal-body` | EDITORIAL | 1 | 2 | `src/components/legal/RichText.jsx` | On the 2 /legal/<slug> routes. |
| `hero.home-card-stack` | HERO | 1 | 1 | `src/components/home/Hero.jsx` | Only on / (1 route). |
| `hero.work-canvas-title` | HERO | 1 | 1 | `src/components/WorkTitle.jsx` | Only on /work (1 route), >=1200px. |
| `hero.works-list-intro` | HERO | 1 | 1 | `src/components/WorksList.jsx` | Only on /work (1 route), below 1200px. |
| `hero.studio-intro` | HERO | 1 | 1 | `src/pages/Studio.jsx > Intro (+ studio/CursorTrail.jsx)` | Only on /studio (1 route). |
| `hero.feed-list-intro` | HERO | 1 | 1 | `src/components/feed/NotesList.jsx` | Only on /feed (1 route), below 1200px. |
| `hero.not-found` | HERO | 1 | 1 | `src/pages/NotFound.jsx (+ legal/BigNumber404.jsx)` | Only on /404 (1 route); also rendered for any unknown URL. |
| `work.infinite-canvas` | WORK | 1 | 1 | `src/components/InfiniteCanvas.jsx (+ ProjectCard.jsx)` | Only on /work (1 route), >=1200px. |
| `work.works-list` | WORK | 1 | 1 | `src/components/WorksList.jsx` | Only on /work (1 route), below 1200px. |
| `work.home-reel` | WORK | 1 | 1 | `src/components/home/Reel.jsx` | Only on / (1 route). |
| `work.studio-gallery` | WORK | 1 | 1 | `src/pages/Studio.jsx > Gallery (+ studio/ImageTicker.jsx)` | Only on /studio (1 route). |
| `work.featured-project` | WORK | 1 | 1 | `src/pages/Studio.jsx > SelectedCase (+ studio/TextTicker.jsx)` | Only on /studio (1 route). |
| `about.home-scramble` | ABOUT | 1 | 1 | `src/components/home/Scramble.jsx` | Only on / (1 route). |
| `about.services` | ABOUT | 1 | 1 | `src/components/home/Services.jsx` | Only on / (1 route). |
| `about.founders` | ABOUT | 1 | 1 | `src/components/home/Founders.jsx` | Only on / (1 route). |
| `about.process` | ABOUT | 1 | 1 | `src/components/home/Process.jsx` | Only on / (1 route). |
| `about.studio-team` | ABOUT | 1 | 1 | `src/pages/Studio.jsx > OurTeam (+ studio/TeamCard.jsx)` | Only on /studio (1 route). |
| `about.principles` | ABOUT | 1 | 1 | `src/pages/Studio.jsx > Principles` | Only on /studio (1 route). |
| `about.careers` | ABOUT | 1 | 1 | `src/pages/Studio.jsx > Career (+ studio/CareerAccordion.jsx)` | Only on /studio (1 route). |
| `proof.numbers` | PROOF | 1 | 1 | `src/components/home/Numbers.jsx` | Only on / (1 route). |
| `proof.awards` | PROOF | 1 | 1 | `src/components/home/Awards.jsx` | Only on / (1 route). |
| `proof.partners` | PROOF | 1 | 1 | `src/components/home/Partners.jsx` | Only on / (1 route). |
| `proof.testimonials` | PROOF | 1 | 1 | `src/components/home/Testimonials.jsx` | Only on / (1 route). |
| `commerce.pricing` | COMMERCE | 1 | 1 | `src/components/home/Pricing.jsx` | Only on / (1 route). |
| `conversion.contact-details` | CONVERSION | 1 | 1 | `src/components/contacts/ContactImage.jsx (+ ParallaxImage.jsx, ContactInfo.jsx)` | Only on /contacts (1 route). |
| `editorial.feed-columns` | EDITORIAL | 1 | 1 | `src/components/feed/NotesTicker.jsx` | Only on /feed (1 route), >=1200px. |
| `editorial.feed-list` | EDITORIAL | 1 | 1 | `src/components/feed/NotesList.jsx` | Only on /feed (1 route), below 1200px. |

**15 shared sections** appear in more than one template and belong in a component library.

**36 single-use sections** appear in exactly one template. Building these
as "reusable" components up front would be speculative — keep them page-local
until a second caller actually appears.

## Templates

### Home — `template.home`

1 route · `/` · chrome: **nav+footer**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.nav` | shared ×10 |
| 2 | SHELL | `shell.menu-overlay` | shared ×10 |
| 3 | SHELL | `shell.cursor` | shared ×10 |
| 4 | SHELL | `shell.clock` | shared ×8 |
| 5 | HERO | `hero.home-card-stack` | page-local |
| 6 | ABOUT | `about.home-scramble` | page-local |
| 7 | WORK | `work.home-reel` | page-local |
| 8 | ABOUT | `about.services` | page-local |
| 9 | PROOF | `proof.numbers` | page-local |
| 10 | PROOF | `proof.awards` | page-local |
| 11 | ABOUT | `about.founders` | page-local |
| 12 | PROOF | `proof.partners` | page-local |
| 13 | ABOUT | `about.process` | page-local |
| 14 | PROOF | `proof.testimonials` | page-local |
| 15 | COMMERCE | `commerce.pricing` | page-local |
| 16 | EDITORIAL | `editorial.studio-notes` | shared ×2 |
| 17 | CONVERSION | `conversion.lets-talk` | shared ×2 |
| 18 | SUPPORT | `support.faq` | shared ×3 |
| 19 | SHELL | `shell.footer` | shared ×10 |

### Work index — `template.work-index`

1 route · `/work` · chrome: **nav, footer below 1200 only**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.nav` | shared ×10 |
| 2 | SHELL | `shell.menu-overlay` | shared ×10 |
| 3 | SHELL | `shell.cursor` | shared ×10 |
| 4 | HERO | `hero.work-canvas-title` | page-local |
| 5 | WORK | `work.infinite-canvas` | page-local |
| 6 | HERO | `hero.works-list-intro` | page-local |
| 7 | WORK | `work.works-list` | page-local |
| 8 | SHELL | `shell.footer` | shared ×10 |

### Project case study — `template.project`

11 routes · `/work/soma-studio`, `/work/bright-matter`, `/work/wavehouse`, `/work/north-layer`, `/work/zero-parallel`, `/work/pulse`, `/work/after-light`, `/work/forma-nine`, `/work/golden-hour`, `/work/echoform`, `/work/axis-point` · chrome: **nav+footer**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.nav` | shared ×10 |
| 2 | SHELL | `shell.menu-overlay` | shared ×10 |
| 3 | SHELL | `shell.cursor` | shared ×10 |
| 4 | SHELL | `shell.clock` | shared ×8 |
| 5 | WORK | `work.project-year` | shared ×2 |
| 6 | HERO | `hero.project-intro` | shared ×2 |
| 7 | WORK | `work.project-text-block` | shared ×2 |
| 8 | WORK | `work.project-quote` | shared ×2 |
| 9 | WORK | `work.project-text-block` | shared ×2 |
| 10 | WORK | `work.project-gallery` | shared ×2 |
| 11 | WORK | `work.project-text-block` | shared ×2 |
| 12 | PROOF | `proof.project-numbers` | shared ×2 |
| 13 | WORK | `work.project-credits` | shared ×2 |
| 14 | WORK | `work.next-project` | page-local |
| 15 | SHELL | `shell.footer` | shared ×10 |

### Project case study (last, no next project) — `template.project-last`

1 route · `/work/orbit-404` · chrome: **nav+footer**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.nav` | shared ×10 |
| 2 | SHELL | `shell.menu-overlay` | shared ×10 |
| 3 | SHELL | `shell.cursor` | shared ×10 |
| 4 | SHELL | `shell.clock` | shared ×8 |
| 5 | WORK | `work.project-year` | shared ×2 |
| 6 | HERO | `hero.project-intro` | shared ×2 |
| 7 | WORK | `work.project-text-block` | shared ×2 |
| 8 | WORK | `work.project-quote` | shared ×2 |
| 9 | WORK | `work.project-text-block` | shared ×2 |
| 10 | WORK | `work.project-gallery` | shared ×2 |
| 11 | WORK | `work.project-text-block` | shared ×2 |
| 12 | PROOF | `proof.project-numbers` | shared ×2 |
| 13 | WORK | `work.project-credits` | shared ×2 |
| 14 | SHELL | `shell.footer` | shared ×10 |

### Studio — `template.studio`

1 route · `/studio` · chrome: **nav+footer**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.nav` | shared ×10 |
| 2 | SHELL | `shell.menu-overlay` | shared ×10 |
| 3 | SHELL | `shell.cursor` | shared ×10 |
| 4 | SHELL | `shell.clock` | shared ×8 |
| 5 | HERO | `hero.studio-intro` | page-local |
| 6 | ABOUT | `about.studio-team` | page-local |
| 7 | ABOUT | `about.principles` | page-local |
| 8 | WORK | `work.studio-gallery` | page-local |
| 9 | ABOUT | `about.careers` | page-local |
| 10 | WORK | `work.featured-project` | page-local |
| 11 | SHELL | `shell.footer` | shared ×10 |

### Contacts — `template.contacts`

1 route · `/contacts` · chrome: **nav+footer**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.nav` | shared ×10 |
| 2 | SHELL | `shell.menu-overlay` | shared ×10 |
| 3 | SHELL | `shell.cursor` | shared ×10 |
| 4 | SHELL | `shell.clock` | shared ×8 |
| 5 | CONVERSION | `conversion.lets-talk` | shared ×2 |
| 6 | CONVERSION | `conversion.contact-details` | page-local |
| 7 | EDITORIAL | `editorial.studio-notes` | shared ×2 |
| 8 | SHELL | `shell.footer` | shared ×10 |

### Feed index — `template.feed-index`

1 route · `/feed` · chrome: **nav, footer below 1200 only**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.nav` | shared ×10 |
| 2 | SHELL | `shell.menu-overlay` | shared ×10 |
| 3 | SHELL | `shell.cursor` | shared ×10 |
| 4 | EDITORIAL | `editorial.feed-columns` | page-local |
| 5 | HERO | `hero.feed-list-intro` | page-local |
| 6 | EDITORIAL | `editorial.feed-list` | page-local |
| 7 | SHELL | `shell.footer` | shared ×10 |

### Feed post — `template.post`

11 routes · `/feed/the-logic-of-emotion`, `/feed/precision-over-perfection`, `/feed/the-language-of-shape`, `/feed/designing-the-invisible`, `/feed/the-architecture-of-meaning`, `/feed/one-idea-many-forms`, `/feed/beyond-function`, `/feed/the-human-algorithm`, `/feed/the-clarity-paradox`, `/feed/systems-with-soul`, `/feed/thinking-in-motion` · chrome: **nav+footer**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.nav` | shared ×10 |
| 2 | SHELL | `shell.menu-overlay` | shared ×10 |
| 3 | SHELL | `shell.cursor` | shared ×10 |
| 4 | SHELL | `shell.clock` | shared ×8 |
| 5 | EDITORIAL | `editorial.post-number` | page-local |
| 6 | HERO | `hero.post-intro` | page-local |
| 7 | EDITORIAL | `editorial.post-cover` | page-local |
| 8 | EDITORIAL | `editorial.post-body` | page-local |
| 9 | EDITORIAL | `editorial.post-quote` | page-local |
| 10 | EDITORIAL | `editorial.post-body` | page-local |
| 11 | EDITORIAL | `editorial.read-more` | page-local |
| 12 | SHELL | `shell.footer` | shared ×10 |

### Legal document — `template.legal`

2 routes · `/legal/privacy-policy`, `/legal/terms-of-service` · chrome: **nav+footer**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.nav` | shared ×10 |
| 2 | SHELL | `shell.menu-overlay` | shared ×10 |
| 3 | SHELL | `shell.cursor` | shared ×10 |
| 4 | SHELL | `shell.clock` | shared ×8 |
| 5 | EDITORIAL | `editorial.legal-updated` | page-local |
| 6 | HERO | `hero.legal-intro` | page-local |
| 7 | EDITORIAL | `editorial.legal-body` | page-local |
| 8 | SUPPORT | `support.faq` | shared ×3 |
| 9 | SHELL | `shell.footer` | shared ×10 |

### 404 — `template.not-found`

1 route · `/404` · chrome: **nav+footer**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.nav` | shared ×10 |
| 2 | SHELL | `shell.menu-overlay` | shared ×10 |
| 3 | SHELL | `shell.cursor` | shared ×10 |
| 4 | SHELL | `shell.clock` | shared ×8 |
| 5 | HERO | `hero.not-found` | page-local |
| 6 | SUPPORT | `support.faq` | shared ×3 |
| 7 | SHELL | `shell.footer` | shared ×10 |

## Section reference

### SHELL

_Site chrome and runtime UI present across routes: blended nav, menu overlay, custom cursor, live clock, footer._

**`shell.nav`** — Fixed full-viewport nav layer blended with mix-blend-mode:difference (white text that inverts over imagery): 'Möbius®' wordmark link left; at >=1200 four rolling-letter links WORK/STUDIO/FEED/CONTACT, below 1200 a single MENU button. Zooms in (scale 1.6 to 1, 0.8s spring) on desktop load.

· Present on all 31 routes. · appears on 31 routes · implemented by `src/components/Nav.jsx (+ RollingLetters.jsx)`

**`shell.menu-overlay`** — Full-screen black menu opened from MENU below 1200: logo + CLOSE row and four centred 44px links (Work, Studio, Feed, Contact). Opens and closes instantly, no transition. Runtime UI, not page content.

· Available on all 31 routes below 1200px only. · appears on 31 routes · implemented by `src/components/MenuOverlay.jsx`

**`shell.cursor`** — Custom spring-following cursor dot (stiffness 340, damping 60) that swaps variant by hovered region: 20px black dot, 120px dot with arrow / drag / play icon, white, or hidden. Runtime UI.

· Present on all 31 routes at >=1200px only. · appears on 31 routes · implemented by `src/components/Cursor.jsx`

**`shell.clock`** — Live 'BERLIN, DE hh:mm AM' Europe/Berlin clock fixed bottom-right inside the difference-blend nav layer, refreshed every second. Runtime UI.

· Present on 29 routes at >=1200px: every route except /work and /feed. · appears on 29 routes · implemented by `src/components/BerlinClock.jsx`

**`shell.footer`** — Shared footer: fit-width 'Möbius®' wordmark (scroll-linked 6-slat 'blinds' reveal on desktop) with '© 2018-YY', newsletter field with arrow button, Social and Legal link columns with grow-in underline hovers, and the template credit + copyright row. Desktop / Tablet / Mobile variants by breakpoint; /work forces the Tablet variant at every width.

· Present on all 31 routes, but /work and /feed render it only below 1200px. · appears on 31 routes · implemented by `src/components/Footer.jsx`

### HERO

_The page-opening composition of a route (or of one breakpoint's layout of it)._

**`hero.home-card-stack`** — Home opening composition that doubles as the site's 'loader': whole hero fades in from 0.001 and shrinks from scale 1.6 with the nav, then four rotated project cards (−5/−20/−10/+5°) rise 100vh on staggered 1.4–1.1s springs, the intro paragraph reveals line by line and '© 2018-26' rises per character. Cards fan out on hover, fly up on scroll past 30px and replay on return to the top.

· Only on / (1 route). · appears on 1 routes · implemented by `src/components/home/Hero.jsx`

**`hero.work-canvas-title`** — Centred 240px 'Work' title whose letters rise 300px inside a clip after ~1.1s, with 'scroll / drag' fading in beneath; sits under the infinite canvas cards.

· Only on /work (1 route), >=1200px. · appears on 1 routes · implemented by `src/components/WorkTitle.jsx`

**`hero.works-list-intro`** — Touch-layout page header for the works list: large 'Work' h1 plus a one-sentence intro in grey, followed by a sticky white masking bar.

· Only on /work (1 route), below 1200px. · appears on 1 routes · implemented by `src/components/WorksList.jsx`

**`hero.project-intro`** — Project case-study opening: hero image with left-to-right mask wipe and 0.34x scroll parallax beside the project name, description and services list; scales in from 1.6 on desktop.

· On the 12 /work/<slug> routes. · appears on 12 routes · implemented by `src/components/project/Hero.jsx`

**`hero.studio-intro`** — Studio opening: sticky 'Do you feel ready…' prompt with Join Us anchor link, two intro paragraphs revealed line by line, and a cursor-image trail that spawns 300x400 photos along the pointer path.

· Only on /studio (1 route). · appears on 1 routes · implemented by `src/pages/Studio.jsx > Intro (+ studio/CursorTrail.jsx)`

**`hero.feed-list-intro`** — Touch-layout header for the notes list: 'Studio Notes' h1 and balanced intro paragraph with a sticky white bar.

· Only on /feed (1 route), below 1200px. · appears on 1 routes · implemented by `src/components/feed/NotesList.jsx`

**`hero.post-intro`** — Article header: date, large title and lead paragraph, zooming in with the nav on desktop.

· On the 11 /feed/<slug> routes. · appears on 11 routes · implemented by `src/pages/Post.jsx (intro block)`

**`hero.legal-intro`** — Legal document header: 104px document title and a grey summary paragraph.

· On the 2 /legal/<slug> routes. · appears on 2 routes · implemented by `src/pages/Legal.jsx (lg-intro)`

**`hero.not-found`** — 404 composition: three 900-weight digit columns that roll into '404' on a 1.6s spring, coloured by a blurred gradient layer with two continuously rotating shapes (14s / 10s), plus a grey explanation line and an arrow 'Go back home' link.

· Only on /404 (1 route); also rendered for any unknown URL. · appears on 1 routes · implemented by `src/pages/NotFound.jsx (+ legal/BigNumber404.jsx)`

### WORK

_Portfolio/case-study presentation: project canvases, lists, galleries, teasers and case-study rows._

**`work.infinite-canvas`** — Full-viewport draggable/scrollable infinite canvas of the 12 project cards in a 2600x2300 tile repeated 2x2 so it wraps: wheel x0.733 and drag x1.578 with 0.048 per-frame lerp, velocity lag offsets, image zoom to 120% and letter-by-letter project name on hover.

· Only on /work (1 route), >=1200px. · appears on 1 routes · implemented by `src/components/InfiniteCanvas.jsx (+ ProjectCard.jsx)`

**`work.works-list`** — Vertical list of the 12 projects (01 to 12) for touch layouts: image with left-to-right mask wipe, bold name and a description paragraph per item.

· Only on /work (1 route), below 1200px. · appears on 1 routes · implemented by `src/components/WorksList.jsx`

**`work.home-reel`** — Home showreel band: two opposite-direction text tickers with scroll-velocity boost above a video with the 'play' cursor that opens a full-screen sound-on lightbox.

· Only on / (1 route). · appears on 1 routes · implemented by `src/components/home/Reel.jsx`

**`work.project-year`** — Large grey sticky "'25" year label pinned bottom-left over the case study on desktop. Decorative.

· On the 12 /work/<slug> routes, >=1200px. · appears on 12 routes · implemented by `src/pages/Project.jsx (pj-year)`

**`work.project-text-block`** — Numbered case-study prose row: paragraphs in a 4-column text column with a large grey '/ n' marker to the right on desktop. Appears three times per case study (challenge, approach, outcome).

· On the 12 /work/<slug> routes. · appears on 12 routes · implemented by `src/components/project/Sections.jsx > Challenge`

**`work.project-quote`** — Case-study pull quote: 56px hanging-indent quote (first line indented 160px, letter-spacing −0.04em) revealed word by word on desktop.

· On the 12 /work/<slug> routes. · appears on 12 routes · implemented by `src/components/project/Sections.jsx > Quote`

**`work.project-gallery`** — Four-image case-study gallery in two columns (slots A and D narrower with spacers, B and C full column), heights following each image's orientation, with a sticky white bar.

· On the 12 /work/<slug> routes. · appears on 12 routes · implemented by `src/components/project/Gallery.jsx`

**`work.project-credits`** — Credits paragraph (team roles) with the 'Live Project' pill button whose backdrop collapses to a circle on hover.

· On the 12 /work/<slug> routes. · appears on 12 routes · implemented by `src/components/project/Sections.jsx > Credits`

**`work.next-project`** — 'Next Project.' teaser: two opposite-direction 100px/s tickers that speed up with scroll, under the next case's card with hover zoom and letter-by-letter name.

· On 11 of the 12 /work/<slug> routes (not on the last project, orbit-404). · appears on 11 routes · implemented by `src/components/project/NextCase.jsx`

**`work.studio-gallery`** — Draggable image ticker of studio photos moving at 100px/s with drag inertia and the 'drag' cursor.

· Only on /studio (1 route). · appears on 1 routes · implemented by `src/pages/Studio.jsx > Gallery (+ studio/ImageTicker.jsx)`

**`work.featured-project`** — 'Featured Project.' teaser on the studio page: two opposite-direction scroll-boosted tickers under the Golden Hour case card.

· Only on /studio (1 route). · appears on 1 routes · implemented by `src/pages/Studio.jsx > SelectedCase (+ studio/TextTicker.jsx)`

### ABOUT

_Studio, team, services, principles, process and careers content._

**`about.home-scramble`** — Home studio statement whose words fly in from seeded random offsets (seed 117, spread 1000) as the heading scrolls from viewport bottom to centre, with supporting paragraphs revealed line by line.

· Only on / (1 route). · appears on 1 routes · implemented by `src/components/home/Scramble.jsx`

**`about.services`** — Services block: sticky intro column with 'Get Started', a lettered services list with word-staggered statements and service tags.

· Only on / (1 route). · appears on 1 routes · implemented by `src/components/home/Services.jsx`

**`about.founders`** — Founders cards with scroll-linked column offsets (−200 / −50 to 0) and hover image zoom plus rising name/role.

· Only on / (1 route). · appears on 1 routes · implemented by `src/components/home/Founders.jsx`

**`about.process`** — Process timeline: four steps on a dashed grid whose black bars grow over 1.2s on view, with rising step names and line-revealed texts.

· Only on / (1 route). · appears on 1 routes · implemented by `src/components/home/Process.jsx`

**`about.studio-team`** — Studio statement revealed one word at a time in a seeded random order (41 words) across a scroll window, then faded out, followed by three team-card columns with scroll parallax (−150 / −300 to 0).

· Only on /studio (1 route). · appears on 1 routes · implemented by `src/pages/Studio.jsx > OurTeam (+ studio/TeamCard.jsx)`

**`about.principles`** — 'Our Principles.' block: sticky heading with 'Work With Us' link and three lettered principle statements (A/B/C) that appear as they enter the viewport.

· Only on /studio (1 route). · appears on 1 routes · implemented by `src/pages/Studio.jsx > Principles`

**`about.careers`** — Careers section (#career): heading and paragraph, an accordion of open roles (independent toggles, 0.8s tween, plus icon rotates 45°) and a closing hanging-indent studio quote.

· Only on /studio (1 route). · appears on 1 routes · implemented by `src/pages/Studio.jsx > Career (+ studio/CareerAccordion.jsx)`

### PROOF

_Credibility content: numbers, awards, partner logos, testimonials, case results._

**`proof.numbers`** — 'In Numbers' sticky digit odometer: a 60%-wide box pinned over three 100vh rows whose 1.6s-spring digit columns and photo crossfade switch state as each row's marker crosses the viewport centre.

· Only on / (1 route). · appears on 1 routes · implemented by `src/components/home/Numbers.jsx`

**`proof.awards`** — Awards list (#awards) whose rows rise and fade in, scroll-linked through a heavy spring, with an 'Our Work' link.

· Only on / (1 route). · appears on 1 routes · implemented by `src/components/home/Awards.jsx`

**`proof.partners`** — 'Our Partners' sticky logo grid (#client-logotypes): the heading fades to 0.02 as the grid arrives, logos scale to 1.6 on hover, followed by a full-width image with 1/6-speed parallax.

· Only on / (1 route). · appears on 1 routes · implemented by `src/components/home/Partners.jsx`

**`proof.testimonials`** — 'Client reflections' testimonials: desktop slideshow with 0.3s fade and 10s autoplay plus prev/next; touch layouts use a scroll-snap carousel with dots.

· Only on / (1 route). · appears on 1 routes · implemented by `src/components/home/Testimonials.jsx`

**`proof.project-numbers`** — Case-study results row: four statistics whose characters rise in sequence on desktop (2x2 grid on phone).

· On the 12 /work/<slug> routes. · appears on 12 routes · implemented by `src/components/project/Sections.jsx > Numbers`

### COMMERCE

_Pricing and plan comparison._

**`commerce.pricing`** — Pricing plans with a Monthly/Yearly pill toggle (0.4s spring), digit-rolling prices, struck-through yearly comparison and a 'Let's Talk' link.

· Only on / (1 route). · appears on 1 routes · implemented by `src/components/home/Pricing.jsx`

### CONVERSION

_Contact and enquiry blocks that turn a visitor into a lead._

**`conversion.lets-talk`** — 'Let's Talk!' fill-in-the-sentence contact form (inline name/email/budget/service fields, select chevrons, 2px focus underline, submit pill with simulated loading then 'Thank you'), beside a sticky 'Do you feel ready…' prompt with Join Us.

· On 2 routes: /contacts (title as h1) and / (title as h2). · appears on 2 routes · implemented by `src/pages/Contacts.jsx (ct-talk) and src/components/home/LetsTalk.jsx, both using contacts/ContactForm.jsx`

**`conversion.contact-details`** — Contact image with scroll parallax (300 / 200 / 0 px by breakpoint) and an overlaid card with address lines rising per character, email and phone links with grow-in underlines.

· Only on /contacts (1 route). · appears on 1 routes · implemented by `src/components/contacts/ContactImage.jsx (+ ParallaxImage.jsx, ContactInfo.jsx)`

### EDITORIAL

_Notes/blog and legal prose: listings, article parts and document bodies._

**`editorial.studio-notes`** — 'Studio Notes' teaser: sticky 'Our thoughts' text with Read All, and the latest two notes (one on tablet/phone) as image cards with mask-wipe reveal and arrow cursor.

· On 2 routes: / and /contacts. · appears on 2 routes · implemented by `src/components/contacts/StudioNotes.jsx`

**`editorial.feed-columns`** — Non-scrolling desktop notes wall: three columns of note cards auto-scrolling at different speeds and directions (A up, B down, C up) with wheel boost that permanently flips a column's direction.

· Only on /feed (1 route), >=1200px. · appears on 1 routes · implemented by `src/components/feed/NotesTicker.jsx`

**`editorial.feed-list`** — Touch-layout list of all 11 notes: 60vh mask-wiped image, date, title and excerpt per item.

· Only on /feed (1 route), below 1200px. · appears on 1 routes · implemented by `src/components/feed/NotesList.jsx`

**`editorial.post-number`** — Large grey 'N / 11' article index pinned bottom-left of the viewport for the length of the article on desktop and tablet; a static first row on phone.

· On the 11 /feed/<slug> routes. · appears on 11 routes · implemented by `src/pages/Post.jsx (fd-num-layer)`

**`editorial.post-cover`** — Article cover image at its natural aspect ratio under a sticky white bar, revealed with the left-to-right mask wipe.

· On the 11 /feed/<slug> routes. · appears on 11 routes · implemented by `src/pages/Post.jsx (fd-cover)`

**`editorial.post-body`** — Article prose row: plain paragraphs (max 480px) in a 4-column text column with a grey '/ A' or '/ B' marker on desktop; part B ends with the author line. Appears twice per article.

· On the 11 /feed/<slug> routes. · appears on 11 routes · implemented by `src/pages/Post.jsx > Content`

**`editorial.post-quote`** — Article pull quote: 56px hanging-indent quote (first line indented 160px, letter-spacing −0.03em) revealed word by word on desktop.

· On the 11 /feed/<slug> routes. · appears on 11 routes · implemented by `src/pages/Post.jsx (fd-q)`

**`editorial.read-more`** — 'Read More' related-notes block: title rising per character on desktop and two note cards (one below 1200) chosen by position: next and 3rd on the first post, previous and next in the middle, previous and 1st on the last.

· On the 11 /feed/<slug> routes. · appears on 11 routes · implemented by `src/components/feed/ReadMore.jsx`

**`editorial.legal-updated`** — 'Last updated' date block: a sticky 100vh box pinned bottom-left over the whole document on desktop, a normal row after the intro on tablet and phone.

· On the 2 /legal/<slug> routes. · appears on 2 routes · implemented by `src/pages/Legal.jsx (lg-lu)`

**`editorial.legal-body`** — Legal rich-text body: numbered h5 headings, sub-headings, paragraphs and disc lists with fixed 32/40/12px spacing.

· On the 2 /legal/<slug> routes. · appears on 2 routes · implemented by `src/components/legal/RichText.jsx`

### SUPPORT

_Help content: the FAQ accordion._

**`support.faq`** — 'Questions, answered.' FAQ: sticky left column with learn-more text and About us link, an accordion of questions (item 1 open on desktop, 0.8s tween, plus rotates to 135°, #f7f7f7 hover backdrop) and an 'Ask a question' button.

· On 4 routes: /, both /legal/<slug> pages and /404. · appears on 4 routes · implemented by `src/components/shared/Faq.jsx`

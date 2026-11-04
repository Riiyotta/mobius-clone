Source: https://mobius.framer.website/feed

# Möbius — /feed and /feed/<slug> (recon 2026-11-04)

How this was measured: headless Chromium, DPR 1, `#__framer-badge-container` hidden. Values come from computed styles and rects, and motion was sampled per rAF.
- Code references: page module `3awql2NhM…BXbpkOwc.mjs` (/feed), `0d0ARNlzxYjP…8yeNFrUv.mjs` (post template), `oIgKW6opR.D1HPAAAZ.mjs` (Image Reveal), `Lenis.DvMIc7tT.mjs`, `shared-lib.CbKaJb3Q.mjs` (Staggered Text = `Ke`, Custom Cursor), collection `KgNVRPcOZ` (CMS "Feed"). Items marked *(code)* were read from source and not sampled.
- Shared nav, cursor and footer: see `/Users/riyaghosh/portfolio/Möbius/CLONE_SPEC.md` and `.recon/specs/home.md`. The bottom-right "BERLIN, DE hh:mm AM" clock (fixed layer; at 1440x900 its box is (1259.5, 845, 140.5x23)) appears on **post pages** but **not** on the /feed index.
- Data: `/Users/riyaghosh/portfolio/Möbius/src/content/feed.json`. Images: `feed-assets.json`.
- Screenshots in this folder:
  - `feed-index-1440.png`
  - `feed-index-1000-full.png`
  - `feed-post-1440-full.png`
  - `feed-post-390-full.png`

Breakpoints are the same as the rest of the site: Desktop ≥1200, Tablet 810–1199.98, Phone ≤809.98. Text presets switch again at 1600.

## 0. Tokens / colours (computed)

| token | value | used for |
|---|---|---|
| `--token-349d8be3…` | #000 | titles, quote |
| `--token-c4d2a39c…` | #fff | page bg, sticky white bars |
| `--token-475fa16f…` | **#444** = rgb(68,68,68) | body / excerpt text (preset fallback says #555; **use #444**) |
| `--token-be5a43ee…` | #999 = rgb(153,153,153) | dates, author |
| `--token-3bd3b765…` | **#eee** = rgb(238,238,238) | the big "11 / 11", "/ A", "/ B" labels |

Font everywhere: `"Inter Display", "Inter Display Placeholder", sans-serif` (500/700/800 files, see `.recon/assets.json`).
- No borders, radii, shadows or dividers anywhere on these routes.
- Links have no hover colour or underline change (preset `cofl3d` is empty).

## 1. Text presets (Framer styles, from CSS)

Columns are size / weight (bold) / letter-spacing / line-height / paragraph-spacing per range: **≥1600 | 1200–1599 | 810–1199 | <810**.

| preset | role | ≥1600 | 1200–1599 | 810–1199 | <810 | weight | ls | lh | para gap | colour |
|---|---|---|---|---|---|---|---|---|---|---|
| `d483nc` (p) | date / author / small excerpt | 14 | 14 | 14 | 14 | 500 (b 700) | 0 | 170% (23.8px) | 24 | inline #999 for dates/author, else #444 |
| `1uqjdsf` (p) | body / lead / excerpt | 16 | 16 | 16 | 16 | 500 (b 700) | 0 | 160% (25.6px) | **32** | #444 |
| `1kqwn6r` (h6) | card title (always wrapped in `<strong>`, so 700) | 28 | 26 | 25 | 24 | 500 (b 700) | −0.01em | 140% | 40 (20 at 1200–1599) | #000 |
| `1f2cdjh` (h4) | "Read More" (in `<strong>`, so 700) | 56 | 48 | 44 | 36 | 500 (b 700) | −0.02em | 120% | 40 | #000 |
| `1ir0dak` (h1 on page) | post title, "Studio Notes" | 120 | 104 | 80 | 64 | 700 (b 900) | −0.04em | 100% | 40 | #000 |
| `1xrh7u1` (h3) | "11 / 11", "/ A", "/ B" | 80 | 64 | 54 | 44 | 700 (b 900) | −0.03em | 120% | 40 | inline #eee |
| `dvoacl` (rich h1) | unused in content | 200 | 160 | 120 | 80 | 800 | −0.05em | 100% | 0 | #000 |
| `cpdidx` (rich h5) | unused in content | 36 | 32 | 30 | 28 | 700 | −0.01em | 130% | 40 | #000 |

Rich-text mapping for Content A/B *(code)*:

| tag | preset |
|---|---|
| a | `cofl3d` |
| h1 | `dvoacl` |
| h2 | `1ir0dak` |
| h3 | `1xrh7u1` |
| h4 | `1f2cdjh` |
| h5 | `cpdidx` |
| h6 | `1kqwn6r` |
| p | `1uqjdsf` |

**Actual CMS content uses only `<p>`.** No h2/h3/lists/blockquote/img/captions or inline bold/italic/links exist in any of the 11 posts (verified live). Paragraph gap is 32px (measured p→p: 153.6 + 31.9).

Measured computed text at 1440 (1200–1599 range):

| role | computed |
|---|---|
| date | 14 / 500 / 23.8, ls normal, #999 |
| card title strong | 26 / 700 / 36.4, ls −0.26px, #000 |
| post h1 | 104 / 700 / 104, ls −4.16px |
| lead | 16 / 500 / 25.6, #444 |
| h3 numbers | 64 / 700 / 76.8, ls −1.92px, #eee |
| Read More | 48 / 700 / 57.6, ls −0.96px |
| quote h4 | 56 / 500 / 67.2, ls −1.68px (−0.03em), #000 |

Tablet (1000) and phone (390):

| role | tablet (1000) | phone (390) |
|---|---|---|
| card title | 25/700/35, ls −0.25 | 24/700/33.6, ls −0.24 |
| h1 | 80/700/80, ls −3.2 | 64/700/64, ls −2.56 |
| numbers | 54/700/64.8, ls −1.62 | 44/700/52.8, ls −1.32 |
| Read More | 44/700/52.8, ls −0.88 | 36/700/43.2, ls −0.72 |
| quote | 44/500/52.8, ls −1.76 (−0.04em) | 36/500/43.2, ls −1.44 (−0.04em) |

---

# A. /feed (index)

Data order is CMS index order, which is the slug list in feed.json (date desc). Document `<title>` is "Möbius".

## A1. Desktop (≥1200): "Notes Ticker", 3 auto-scrolling vertical columns

- **Page does not scroll.** docH = vh (900 at 1440x900, 800 at 1280x800). There is no footer, no page title and no "Studio Notes" heading on desktop.
- Ticker wrapper: `position:fixed; top:0; left:0; width:100%; height:100vh; z-index:1; display:flex; flex-direction:row; justify-content:center; align-items:flex-start; gap:40px; padding:80px 40px 0`. The nav's difference-blend layer sits on top (z 5).
- 3 columns: each `flex:1 0 0; height:100%` (= vh − 80). Inner ticker viewport is `overflow:hidden; position:relative; height:100%`.

| vw x vh | column x positions | column w | column h |
|---|---|---|---|
| 1600x900 | 40 / 560 / 1080 | 480 | 820 |
| 1440x900 | 40 / 506.7 / 973.3 | 426.7 | 820 |
| 1280x800 | 40 / 453.3 / 866.7 | 373.3 | 720 |

- **Column membership** is round-robin by 1-based CMS index:

| column | CMS indexes | posts |
|---|---|---|
| A | 1, 4, 7, 10 | Logic of Emotion, Designing the Invisible, Beyond Function, Systems with Soul |
| B | 2, 5, 8, 11 | Precision Over Perfection, Architecture of Meaning, Human Algorithm, Thinking in Motion |
| C | 3, 6, 9 | Language of Shape, One Idea Many Forms, Clarity Paradox |

  The template uses 17 filtered lists per column (1,4,…,49 / 2,…,50 / 3,…,51). Empty lists render as 0-height divs, so just render the real items.
- Each column's content = [list, duplicate list (aria-hidden)] stacked in an absolutely positioned div (`top:0; left:0; width:100%`), translated in Y (see A3).

### A1.1 Card (item)

Card = `div{flex column; gap:40px; padding:0 0 120px; width:100%}`, so cards are separated by 120px of bottom padding.
1. `a` image (href `./feed/<slug>`, `data-framer-cursor` → **Big Black Arrow Right** cursor). `width:100%; height:auto`, height from the image aspect (`width * pixelH/pixelW`). The img is absolute, fill, `object-fit:cover`, object-position per post (feed.json). No radius.
2. Text Container: `flex column; gap:16px; align-items:center`, then:
   - date `p` (d483nc, #999), width 100%.
   - inner Text Container `flex column; gap:8px; align-items:flex-start`:
     - `h6 > a[href] > strong` title (width 100%; `data-framer-cursor` → **Hidden** cursor).
     - excerpt `p`, `width:90%; max-width:400px`.
     - **The first card of each column** uses preset `1uqjdsf` (16/25.6). **All other cards** use `d483nc` (14/23.8), colour #444.

Measured card heights per column, as (card total, image h). The sum is one list height (= wrap distance).

| vw | col A list h | A items | col B list h | B items | col C list h | C items |
|---|---|---|---|---|---|---|
| 1600 | 3609.8 | (961, 637.2) (955.6, 637.2) (894.8, 576.4) (798.4, 480) | 3312.3 | (935.4, 637.2) (774.6, 480) (807, 512.4) (795.3, 500.7) | 2641.8 | (935.4, 637.2) (774.6, 480) (931.8, 637.2) |
| 1440 | 3339.6 | (887.4, 566.4) (882, 566.4) (827.9, 512.3) (742.3, 426.7) | 3064.5 | (861.8, 566.4) (718.5, 426.7) (747.3, 455.5) (736.9, 445.1) | 2438.5 | (861.8, 566.4) (718.5, 426.7) (858.2, 566.4) |
| 1280 | 3106.2 | (842.2, 495.6) (811.2, 495.6) (763.9, 448.3) (688.9, 373.3) | 2827.8 | (791, 495.6) (665.1, 373.3) (690.4, 398.6) (681.2, 389.4) | 2269.2 | (816.6, 495.6) (665.1, 373.3) (787.4, 495.6) |

Excerpt widths:

| vw | first card | others |
|---|---|---|
| 1440 | 384 | 400 |
| 1280 | 336 | 373.3 |
| 1600 | 400 | 400 |

Vertical layout inside a card at 1440 (first card of A, image top = 0):
- image 0–566.4
- date at 606.4 (h 23.8)
- title h6 at 646.2 (h 36.4; strong glyph box +2, h 31)
- excerpt at 690.6 (h 76.8 for 3 lines)
- then 120 padding

## A2. Tablet (810–1199) and Phone (<810): "Notes List" (vertical list + footer)

Same structure as /work's Works List.

### Tablet (measured 1000x800)

- docH 9661. The Notes List is 0–8641, followed by the footer (tablet footer per CLONE_SPEC).
- Row `padding:0 15px`. Side sections are flex 1, centre is flex 4: side x 15, w 161.7; centre x 176.7, w 646.7.
- Centre column:
  - 160px spacer.
  - Text Container `padding:0 15px; gap:24px`. Title Container `gap:16px`:
    - h1 "Studio Notes" (191.7, 160, 616.7x80).
    - p (1uqjdsf, `text-wrap:balance`) "Our thoughts on design, direction, and digital craft — reflections on how brands, systems, and stories find their form." at y 256, h 51.2.
  - Notes Container:
    - **sticky white bar** `position:sticky; top:0; height:72px; bg #fff; z-index:1` at y 307.2.
    - list `flex column; gap:120px; padding:0 15px`.
- Items (`a[href=./feed/<slug>]`, `flex column; gap:32px`) at x 191.7, w 616.7. First at y 379.2, **pitch 761.9 to 762** (item 642 + 120). Last item (Thinking in Motion) at y 7999.
  - Image box: Image Container (overflow clip) → hidden sizer `section{opacity:0; width:100%; height:60vh}` (= **480**) + absolute "Image Reveal" layer (inset 0) with the cover, `object-fit:cover`, per-post object-position. **All tablet images are 616.7x480** regardless of aspect.
  - Text Container `flex column; gap:12px`:
    - date p (w 90% = 555).
    - inner `gap:8px`: h6 > strong (25/700/35, w 555), then excerpt p (1uqjdsf 16/25.6, `width:90%; max-width:640px` → 555).
  - Measured item boxes: date at +512, title at +547.8, excerpt at +590.8 (2 lines, 51.2).
- Cursor attrs: same as desktop (image → arrow, title → hidden). No hover visuals.

### Phone (measured 390x844)

- docH 10102. Notes List 0–8914.2: column, `gap:40px; padding:0 10px`. The side section is moved below (order 1, height 0), so the extra 40 gap sits before the footer.
- Centre column x 10, w 370:
  - 120 spacer.
  - Text Container `padding:0 10px`: h1 "Studio Notes" 64px at (20, 120, 350x128, 2 lines); intro p at y 264, h 76.8.
  - Sticky white bar **64px** at y 340.8.
  - list `gap:80px; padding:0 10px`.
- Items at x 20, w 350, first at y 404.8.
  - Image 350x**506.4** (60vh of 844).
  - Text: date w 315; title 24/700/33.6, w 315; excerpt w 315.
  - Item heights vary with excerpt lines: 718.2 (4 lines) / 692.6 (3) / 667 (2). Pitch = height + 80.
  - Item y's: 404.8, 1202.9, 1949.9, 2722.5, 3520.6, 4293.2, 5065.8, 5863.9, 6636.5, 7383.4, 8181.6 (last ends 8874.2).

## A3. Motion — /feed

### Desktop ticker (component K in the feed module) *(code + sampled)*

- Props (speed, direction):

| column | speed | direction |
|---|---|---|
| A | 20 | **up** |
| B | 30 | **down** |
| C | 10 | **up** |

- Velocity = `(speed/100)*0.25` px/ms:
  - **A 50 px/s** (measured −10.0 px per 200ms).
  - **B 75 px/s** (measured +15.0 per 200ms).
  - **C 25 px/s** (measured −5.0 per 200ms).
- Framerate-independent: `y += dtMs * v * dir` each `useAnimationFrame`.
- State `y` starts at 0. Wrap with `n = content.scrollHeight/2` (= one list height): `y <= -n → 0; y >= 0 → -n`. So "down" columns start at −n on the first frame.
  - Measured at 1440: B first sample −3061.06 with n = 3064.5.
  - Motion starts at hydration (~1.0–1.1s after navigation start). Before that, all columns sit at translateY 0.
- **Wheel over a column** (React `onWheel` on that column only, `preventDefault`):
  - `boost = -deltaY*0.05`, and `lastWheel = now`.
  - Persistent direction is set to the sign of the wheel (`boost<0 → 'up'`, else 'down'). **The column keeps that new direction afterwards.** Measured: B flipped to moving up at 75px/s after a +300 wheel, and back to down after a −600 wheel.
  - While `|boost|>0.1`: speed = `|boost|/2` px/ms in boost's direction, replacing the base speed.
  - Once more than 100ms has passed since the last wheel, `boost *= 0.95` **per frame**.
  - `boost=0` on the column's mouseleave and on window `mouseleave`/`mouseout`/`blur`/`mouseup`. `mouseout` bubbles, so crossing any element edge cancels the boost.
  - Measured: a +300 wheel jumped B by −275px within about 60ms, then base speed resumed.
- Hover does **not** pause the ticker (column C kept moving at 25px/s while hovered).
- Cards have no entrance animation and no Image Reveal on desktop.
- Nav (difference layer) entrance as CLONE_SPEC: opacity 0.001→1, scale 1.6→1, spring 0.8s bounce 0. Measured 0.045 / 1.574 at 511ms, through 0.74 / 1.156 at 716ms and 0.958 / 1.025 at 911ms, to 1 at ~1310ms.

### Tablet and phone list

- Native scroll. **No Lenis** (a 700px wheel moved scrollY instantly).
- **Image Reveal** on every list image (also used on the post page):
  - Hidden sizer section + absolute reveal layer.
  - Reveal layer `section` has `mask: linear-gradient(90deg, rgba(0,0,0,1) P%, rgba(0,0,0,0) P%) add` (same for -webkit-mask). P animates **0 → 100**, so it is a hard-edged left-to-right wipe.
  - Tween **1.2s, ease cubic-bezier(0.6, 0, 0.4, 1)**, delay 0. Triggered once when it enters the viewport (threshold 0, animateOnce).
  - Measured P at ms after trigger: 0.5 (0), 3.1 (115), 8 (216), 16.5 (316), 30.2 (416), 52.9 (532), 71.8 (632), 84.8 (733), 93.8 (849), 97.9 (949), 99.7 (1049), 100 (~1150).
  - First visible item triggers ~1.0s after navigation start (after hydration). A 700px scroll triggered item 2 at once.
- Nav wrapper on tablet: measured opacity only, 0.30 (646ms) → 0.66 (746) → 0.85 (847) → 1 (947), no scale. On phone it snapped to 1 at hydration. Treat it as an opacity fade in the 0.8s spring with no scale, or none.
- "Studio Notes" and the intro have no entrance animation.
- Note: /work tablet list images were also seen running this same mask reveal. CLONE_SPEC §6.5 says there is none there, so **CLONE_SPEC is wrong on that point**.

### Hover / cursor (desktop)

- Cursor variants (spring stiffness 340, damping 60, mass 1, same as /work):
  - Image hover → **Big Black Arrow Right** (dot 120px + white arrow; measured 108px at +50ms, 119 at +200, 120 at +450).
  - Title hover → **Hidden** (2px, opacity 0).
  - Elsewhere → Black 20px dot.
- No image zoom, opacity, filter or colour change on cards or titles. Click navigates (client-side, no transition).

---

# B. /feed/<slug> (CMS post template)

`<title>`: "<Title> - My Framer Site". og:image = cover.

## B1. CMS fields → template

| field | template slot |
|---|---|
| Article Number | `N` in "N / 11"; the second number = Article Number of CMS item #1 = 11 |
| Title | h1 |
| Date | small p |
| Author | small p under Content B |
| Image | cover (Image Reveal) |
| Lead Text | excerpt p under h1 (also the card excerpt) |
| Content A | rich text |
| Quote | plain string → Staggered Text |
| Content B | rich text |
| Slug | URL |

There are **no categories or tags**. Content A/Quote/Content B/Author are the same filler text on all 11 posts.

## B2. Desktop structure (1440x900; 1280x800 in brackets)

The page is a 12-column flex grid with `padding:0 20px` per row. Column = (vw−40)/12 = 116.67 [103.33]. Columns have no gaps; text blocks carry their own `padding:0 20px`. docH 5129 [5106]; article ends at 4211.3 [4219.6], then the desktop footer.

1. **Article Number** (absolute layer, `inset:0` over the whole Article, row `padding:0 20px`):
   - Left part `flex:2` (233.3 [206.7]) is a **`position:sticky; top:0; height:100vh`** box, `flex column; justify-content:flex-end; z-index:1`.
   - Inside: row `gap:6px; padding:0 20px 40px` with h3 "N", h3 "/", h3 "11" (#eee, 64px).
   - So it is pinned to the bottom-left of the viewport for the whole article scroll. At 1440x900: "11" at (40, 783.2, 46x76.8), "/" at (92, …, 21.4), "11" at (119.4, …, 46). Text row bottom = vh − 40.
   - Rest `flex:10`. Paints above the content (z 1).
2. **Intro** (`padding:160px 20px 0; z-index:2`), columns 2 | 8 | 2:
   - Text Container (x 253.3 [226.7], w 933.3 [826.7]) `flex column; gap:40px; justify-content:flex-end`.
   - Date row `padding:0 20px` → p at (273.3 [246.7], 160).
   - Then block `gap:24px; padding:0 20px`: h1 at y 223.8 (h 208 = 2 lines at 104), then lead p at y 455.8, `max-width:640px` (640x51.2).
   - Intro box 0–507.
3. **Image** (`nav` element; row `padding:0 20px`, columns 2 | 8 | 2):
   - Image Container (x 253.3, w 933.3) holds an inner wrapper `padding:0 20px`.
   - **Sticky white bar** `position:sticky; top:0; height:80px; bg #fff; z-index:1` at y 507. It travels with the scroll inside this container, masking the image top under the nav.
   - Then the image box at (273.3, 587, **893.3x1186**) [(246.7, 587, 786.7x1044.3)]. Height = width x pixelH/pixelW (no max). Cover `object-fit:cover` + post object-position. Image Reveal wipe (below).
   - Section ends at 1773 [1631.3]. The cover has **no** cursor attribute (Black dot).
4. **Content A** (`padding:120px 20px 0`):
   - Columns: 2 (empty), 4 (text), 1 (empty), 5 ("/ A").
   - Text column x 253.3 w 466.7 [226.7 / 413.3]. Text Container `padding:0 20px; gap:40px`. Rich text `max-width:480px` → width 426.7 [373.3].
   - Measured: p1 at y 1893 (h 153.6 [179.2]), p2 at 2078.5 (h 128 [153.6]).
   - "/ A" h3 (#eee) at (856.7, 1893) [(763.3, 1751.3)], 76.9x76.8.
5. **Quote** (`nav`, `padding:120px 20px 0; align-items:flex-end`), columns 2 | 10:
   - Text Container `padding:0 20px`.
   - h4 (Staggered Text component) styles: 56px / 500 / lh 120% / ls −0.03em / #000; `display:flex; flex-direction:column; transform:translateX(-160px)` (shiftBlock); textIndent 160.
   - Every word is `span{display:inline-block; overflow:hidden; vertical-align:bottom}` > `span{display:inline-block; white-space:pre; transform:translateY(0|100%)}`. Text = word + trailing space.
   - The **first word's inner span has `margin-left:160px`**. Net effect: line 1 starts at the column's text edge (x 273.3), and lines 2+ hang 160px further left (x 113.3).
   - Per-paragraph line = `span{display:flex; flex-wrap:wrap; align-items:flex-end; justify-content:flex-start; width:100%}`.
   - h4 box (113.3, 2326.5, 1126.7x268.8) = 4 lines of 67.2. [1280: (86.7, 2236, 993.3x336), 5 lines.]
6. **Content B** (`padding:120px 20px 0`):
   - Same columns as A. The left spacer is `height:100px` (not stretch).
   - Text Container `gap:48px`: rich text (3 p, 32px apart) at y 2715.3, then the author p (#999) at 3160.
   - "/ B" h3 at (856.7, 2715.3), 72.5x76.8.
7. **Read More** (`padding:0 20px 40px`), columns 1 | 4 | 1 (233.3 | 933.3 | 233.3):
   - Centre: 120 spacer.
   - Title Container `padding:0 20px`: h4 > strong "Read More" (48/700, char-split) at y 3303.8.
   - Then a `Container` row with 2 cards, each `flex:1` (466.7 wide). Each card = `flex column; gap:32px; padding:0 20px`:
     - Image Container: sticky white 80px bar ("Sticky Section"/"Sticky Backdrop", sticky top 0, z 1), then `a[href=./<slug>]` image box (`max-height:100vh`, width 426.7, height by aspect, e.g. 566.4 for 1856x2464). Image Reveal. Cursor → arrow.
     - Text Container `gap:12px`: date (w 90% = 384); inner `gap:8px` with h6 > a > strong title (26/700, cursor → Hidden, w 384) and excerpt (1uqjdsf, `width:90%; max-width:480px` → 384).
   - Read More hrefs are relative to /feed/: `./<slug>`.
   - **Which 2 cards** (desktop):

| post | cards shown |
|---|---|
| first post | **Next** (CMS idx 2) + **"3rd"** = CMS item at offset 2 (The Language of Shape) |
| middle posts | **Previous** (idx−1, the newer post) + **Next** (idx+1) |
| last post | **Previous** + **"1st"** = CMS item #1 (The Logic of Emotion) |

     Previous is always left and Next/1st right, except on the first post where Next is left and 3rd right.
   - Measured on the first post at 1440: Next (253.3, 3361.4); its image at (273.3, 3441.4, 426.7x566.4); 3rd at x 720. At 1280: images 373.3x495.6.

## B3. Tablet structure (1000x800)

Row padding is 15. Column ratios: Article Number 1 | 5. Intro, Image, Content A/B and Read More are 1 | 4 | 1 → side 161.7, centre 646.7. Inner text padding is `0 15px`. docH 4749; article ends 3728.5.

- Article Number:
  - Still an absolute layer with the sticky 100vh box (x 15, w 161.7). Row `padding:0 15px 30px`; numbers are 54px.
  - At 1000x800: "11" (30, 705.2), "/" (74.8), "11" (98.9); h 64.8.
  - No appear animation.
- Intro:
  - `padding:120px 15px 0`. Text block x 176.7, w 646.7.
  - Date at y 120; h1 80px at 183.8 (h 160, 2 lines); lead at 367.8 (616.7 wide).
- Image:
  - Sticky bar **72px** at y 419, then image (191.7, 491, **616.7x818.7**). Section ends 1309.6.
- Content A:
  - `padding:80px 15px 0 16px` (note the 16px left).
  - Text column x 177.5, w 646; rich text max 480 → 480 wide.
  - p1 y 1389.6 (h 128), p2 y 1549.6. **"/ A" and "/ B" are hidden on tablet and phone.**
- Quote:
  - `padding:80px 15px 0`. **No animation** (plain h4).
  - 44px / 500 / lh 120% / ls −0.04em; `text-indent:120px; white-space:pre-wrap; transform:translateX(-120px)`.
  - Box (71.7, 1732, 778.3x211.2) = 4 lines of 52.8.
- Content B:
  - `padding:80px 15px 0`. Text x 191.7, w 480, p at y 2023.2; author y 2467.9.
- Read More:
  - `padding:0 15px 30px`. "Read More" 44px at y 2611.7.
  - **Only one card** (Next, or 1st on the last post; Previous and 3rd are hidden), full centre width.
  - Card at x 191.7, w 616.7: sticky bar 72; then the image anchor 616.7x**800** (`max-height:100vh` caps it). The inner image is 818.7 tall, centred in the anchor (top −9.3).
  - Date at y 3568.5; title 25/700 at 3604.3; excerpt (w 480) at 3647.3. Article ends 3728.5 (30 bottom pad).
- No Lenis on tablet.

## B4. Phone structure (390x844)

Single column, row padding 10, inner padding `0 10px`. **Order changes:** Article Number → Image → Intro → Content A → Quote → Content B → Read More. docH 4562; article ends 3374.1.

- Article Number: static (not sticky), `padding:120px 10px 0`. Row at y 120: "11" (20, 120, 31.7x52.8), "/" (57.7), "11" (78.3); 44px #eee.
- Image:
  - Starts y 172.8. Sticky bar **64px**, then the image (20, 236.8, 350x464.6).
- Intro:
  - `padding:40px 10px 0`; Text Container `gap:32px`.
  - Date y 741.4; h1 64px at 797.2 (350x128); lead at 949.2 (h 76.8).
- Content A:
  - `padding:80px 10px 0`. p at y 1106 (w 350): h 179.2, then 1317.2 (h 153.6).
- Quote:
  - `padding:80px 10px 0`. Not animated. 36px / 500 / lh 43.2 / ls −1.44.
  - `text-indent:80px`, **no translateX** (shiftBlock off). Box (20, 1550.7, 350x345.6) = 8 lines.
- Content B: p at y 1976.4; author at 2497.9.
- Read More:
  - "Read More" 36px at y 2641.7. One card (column).
  - Sticky bar 64 at 2684.9; image anchor (20, 2748.9, 350x464.6).
  - Date at 3245.5 (w 315); title 24/700 at 3281.3; excerpt at 3322.9 (w 315).

## B5. Motion — post page

1. **Entrance (desktop only):**
   - **Intro** and the **Article Number sticky box** both use the same appear as the nav: from `opacity:0.001; scale:1.6` → `opacity:1; scale:1`, spring 0.8s bounce 0, in sync with the nav. Transform origin is centre.
   - Measured: t=511ms → 0.045 / 1.574; 581 → 0.301 / 1.420; 644 → 0.557 / 1.266; 716 → 0.740 / 1.156; 777 → 0.854 / 1.088; 844 → 0.920 / 1.048; 911 → 0.958 / 1.025; 977 → 0.978 / 1.013; 1043 → 0.989 / 1.007; 1177 → 0.997 / 1.002; ≈1310 → 1 / 1.
   - On tablet and phone the SSR opacity 0.001 snaps to 1 at hydration (no animation).
2. **Cover Image Reveal**:
   - Mask wipe 0→100%, 1.2s, cubic-bezier(0.6,0,0.4,1), once in view.
   - On load at 1440 it began at ~750ms: 0.04% (777), 4.1 (977), 12.5 (1111), 29.1 (1244), 54.8 (1377), 78.2 (1510), 88.8 (1610), 95.1 (1710), 98.5 (1810), 100 (~1950).
   - The same reveal applies to the Read More card images when they scroll into view: 0.06% at +59ms after entering, 10.3 (+359), 49.4 (+625), 87.8 (+875), 100 (~+1250).
3. **Quote (desktop only):** Staggered Text `Ke` *(code + sampled)*.
   - Trigger: `useInView(once, margin "-10% 0px")`, initialDelay 0.
   - Each word's inner span: `transform: translateY(100%)` → `translateY(0%)` with CSS `transition: transform 600ms cubic-bezier(.4,1,.4,1) ${i*60}ms`, word index i = 0…24 (25 words).
   - Measured word 0 (67.2px tall): 53.2 at +80ms, 35.3 (+147), 19.7 (+213), 9.0 (+280), 3.5 (+347), 1.1 (+413), 0 (~+550). Each next word lags 60ms. Last word done at ~+2010ms.
   - Opacity stays 1; the overflow:hidden wrapper masks the rise.
4. **"Read More" title (desktop only):** character appear.
   - Each char is an inline-block from `translateY(200px)` → 0, opacity 1.
   - Spring 0.6s bounce 0, **startDelay 0.2s**, stagger 0.025s per char, trigger onInView (once).
   - Measured char 0: 200 until +209ms, 182.4 (+259), 128.1 (+309), 79.5 (+359), 46.2 (+409), 25.7 (+459), 13.9 (+509), 6.0 (+574), 1.6 (+675), 0.2 (+825), 0 (~+875).
   - The h4 line box (overflow per Framer text effect) clips the chars.
   - Tablet/phone: static.
5. **Lenis smooth scroll (desktop only; container hidden <1200):**
   - `new Lenis({smoothWheel:true, duration: intensity/10 = 2.0, easing: t => Math.min(1, 1.001 - 2**(-10*t)), lerp 0.1 (ignored because duration+easing win), wheelMultiplier 1, touchMultiplier 1, infinite:false, orientation:'vertical', gestureOrientation:'vertical', autoRaf:true, autoToggle:true, anchors:true, allowNestedScroll:true, syncTouch:false, stopInertiaOnNavigate:true})` *(code)*.
   - `<html class="lenis lenis-autoToggle">`.
   - Each wheel event retargets `targetScroll += deltaY` and restarts a 2.0s expo-out tween from the current position.
   - Measured, one wheel of 200: scrollY 50 (116ms), 94 (216), 125 (316), 150 (432), 165 (532), 175 (633), 184 (749), 192 (949), 196 (1165), 199 (1466), 200 (~1680).
   - Three wheels of 500 at 16ms intervals (target +1500): 567 (162), 1027 (312), 1300 (462), 1463 (612), 1560 (762), 1617 (912), 1671 (1212), 1695 (1662), 1700 (~2140).
   - Lenis is **not** on /feed (desktop doesn't scroll) or on tablet/phone (native).
6. **Sticky elements while scrolling:**
   - The desktop number box stays bottom-left (sticky in an absolute full-article column).
   - White bars (80/72/64px) stick to the viewport top inside each image container until that container scrolls past, so images look cut below the nav band.
   - No parallax, scale-on-scroll or progress bars.
7. **Hover:**
   - Read More images → arrow cursor (120px dot); Read More titles → Hidden cursor.
   - Cover → black dot.
   - No visual hover change on any element.
   - Navigation is instant (no page transition).

## B6. Not measured / caveats

- **Touch:** ticker wheel behaviour on touch devices, and Lenis touch, weren't tested. Lenis ignores intensity on mobile, and its container isn't rendered below 1200 anyway.
- **Tablet nav opacity fade:** I couldn't separate it cleanly from hydration timing. One run showed a 0.3→1 fade over ~300ms; the phone run snapped.
- **Read More char clipping:** the exact clip element for the Read More char rise (Framer text-effect wrapper) wasn't inspected. Use `overflow:hidden` on the h4 line.
- **Quote paragraphs:** behaviour with multi-paragraph quotes (paragraphGap 0) is code-only. The CMS quotes are single-paragraph.
- **Rich text:** styles for h2/h3/lists/images/captions inside articles **don't exist in the content**. Only the preset mapping above is known; ul/ol/blockquote/img/figcaption have no defined presets.
- **Desktop footer:** documented by another agent.

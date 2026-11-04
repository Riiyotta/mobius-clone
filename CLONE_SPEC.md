Source: https://mobius.framer.website/work

# Möbius — CLONE_SPEC

Framer template, recon run 2026-11-04 with Playwright (Chromium, DPR 1). I measured every value below from computed styles or rect sampling on the live site, or read it from the site's own JS modules: `DUu_B6HiRI1…DDl-OLAj.mjs` (page + Infinite Canvas), `IW5FwLyQy.Vo7M-LQ8.mjs` (Project Card), `shared-lib.CbKaJb3Q.mjs` (Custom Cursor, Rolling Letters), `script_main.D8sS51K5.mjs` (layout template/nav). If a value comes from code and I didn't sample it at runtime, it is marked *(code)*.

Assets: `.recon/assets.json` (local recon output). Screenshots: `.recon/*.png` (local recon captures, not committed).

---

## /work

### 0. Breakpoints (Framer)

| name | media query | what /work shows |
|---|---|---|
| Desktop | `(min-width: 1200px)` | Full-viewport **infinite canvas** + centered "Work" title + top nav with 4 links. No footer. Document height = 100vh (1440x900 → 900, 1280x800 → 800). |
| Tablet | `(min-width: 810px) and (max-width: 1199.98px)` | Canvas and title **not rendered** (`hidden-dnn7s`). A vertical **Works List** + footer instead. Nav shows logo + MENU. docH at 1000x800 = 12568. |
| Phone | `(max-width: 809.98px)` | Same Works List as tablet but single column, plus footer. docH at 390x844 = 10680. |

Text presets also switch at 1600px: the `h6` "scroll / drag" preset is 28px at ≥1600, 26px at 1200–1599, 25px at 810–1199 and 24px below 810. The card-name `h4` preset is 56 / 48 / 44 / 36 on the same ranges.

Rolling-letter nav hover only fires when `window.innerWidth >= 1200` *(code)*.

### 1. Global colour, tokens, z-order

- Tokens: `--token-349d8be3… = #000` (black) and `--token-c4d2a39c… = #fff` (white).
- `html body { background: rgb(255,255,255) }`. Text selection: `--selection-background-color:#e3e3e3; --selection-color:#000`.
- Body copy grey `rgb(68,68,68)` (#444). Label grey `rgb(153,153,153)` (#999).
- **Nav colour/blend:** the nav sits in a `position:fixed; inset:0 0 auto 0; height:100vh; pointer-events:none; z-index:5; mix-blend-mode:difference` wrapper ("Viewport Container"). The nav itself is `pointer-events:auto`. All nav text is **white `rgb(255,255,255)`**. Difference blending makes it black on the white page and colour-inverted over images: over the orange card it renders blue (verified in screenshot `mobius-work-1440-b.png`).
- Stacking, bottom to top (desktop):
  1. Page root (white).
  2. "Text Container" ("Work" + "scroll / drag"): `position:absolute; z-index:0; pointer-events:none` on the text.
  3. "Infinite Canvas Container" (`position:relative`, later in DOM). **Cards paint OVER the "Work" title** (verified: the yellow card covers the "W").
  4. Nav wrapper, z 5, difference blend.
  5. 12-column grid overlay, z 10. It is a dev tool (`isVisible:false`, toggled with Ctrl+G). **Do not build it.**
  6. Custom cursor, `position:fixed; z-index:13; pointer-events:none`.
  7. The "Made in Framer" badge (`#__framer-badge-container`) is Framer chrome. **Exclude it.**

### 2. Typography (computed)

Family stack everywhere: `"Inter Display", "Inter Display Placeholder", sans-serif`. The placeholder is `local("Arial")`. Font URLs are in assets.json. Loaded files: 800 `9Nu9BRcGkRrLnJCGqVdSUXJt2Ig.woff2`, 700 `qITWJ2WdG0wrgQPDb8lvnYnTXDg.woff2`, 500 `iwWTDc49ENF2tCHbqlNARXw6Ug.woff2` (latin subset).

| role | size | weight | line-height | letter-spacing | colour | other |
|---|---|---|---|---|---|---|
| Logo "Möbius®" (`<p><a href="./">`) | 20px | 800 | 32px (160%) | normal | #fff (in difference layer) | `white-space:pre`; anchor box 83.14x24.5 |
| Nav link (WORK/STUDIO/FEED/CONTACT) | 14px | 700 | 14px (1em) | 0.28px (0.02em) | #fff | text is literally uppercase; `text-transform:none` |
| Tablet/phone "MENU" / "CLOSE" | 14px | 700 | 22.4px | 0.28px | #fff | `text-transform:uppercase` (source text "Menu") |
| Desktop title "Work" (h1) | 240px | 800 | 264px (110%) | -12px (-0.05em) | #000 | `white-space:pre` |
| "scroll / drag" (h6) at 1200–1599 | 26px | 500 | 36.4px (1.4) | -0.26px (-0.01em) | #000 | 28px at ≥1600 |
| Card hover name (h4 > strong) at 1200–1599 | 48px | 700 (strong) | 57.6px (1.2) | -0.96px (-0.02em) | per-project, see card table | preset weight 500, `<strong>` makes it 700 |
| Tablet list title "Work" (h1) | 120px | 800 | 120px | -6px | #000 | |
| Phone list title "Work" (h1) | 80px | 800 | 80px | -4px | #000 | |
| List intro / item paragraph (p) | 16px | 500 | 25.6px | normal | #444 | |
| List item name (h6), tablet | 25px | 500 | 35px | -0.25px | #000 | |
| List item name (h6), phone | 24px | 500 | 33.6px | -0.24px | #000 | |
| Mobile menu links | 44px | 700 | 52.8px | -1.32px | #fff | on black overlay |

### 3. Desktop layout (≥1200)

#### 3.1 Nav (measured at 1440 and 1280)

- `<nav>` is full-width (Framer variant width is 1200, stretched). `display:flex; padding:32px 20px 0`; height 64. Three `section`s, each `flex:1 0 0`. At 1440 each is 466.66 wide (x = 20 / 486.66 / 953.34). At 1280 each is 413.33.
  1. Logo section: flex-start. Logo container `padding:0 20px` puts the logo `<p>` at x 40, y 32, size 83.14x32. The anchor rect is (40, 35.5, 83.14, 24.5).
  2. Empty spacer section.
  3. Menu section: the "Desktop Menu" row has `padding:0 20px; justify-content:space-between; align-items:center`. Links are at y 40.5, height 15 (the letter row is 14px tall).
     - 1440: WORK x 973.34 (w 44.26), STUDIO x 1091.63 (w 53.49), FEED x 1219.14 (w 36.12), CONTACT x 1329.29 (w 70.71). CONTACT's right edge = 1400 = vw − 40.
     - 1280: WORK 866.7, STUDIO 967.2, FEED 1076.9, CONTACT 1169.3 (right edge 1240).
- hrefs: logo `./`, `./work` (has `data-framer-page-link-current="true"`; no visual active state was measured), `./studio`, `./feed`, `./contacts`.
- Letter structure per link (Rolling Letters component). Outer `div{display:inline-block; position:relative; cursor:pointer}`, then a flex row. For each character:
  ```
  div{position:relative; display:inline-block; height:14px; overflow:visible}
    div{position:relative; height:100%; clip-path:inset(0px -8px 0px -8px)}
      div{position:relative; display:inline-block}            ← visible letter
      div{position:absolute; top:100%; left:0; display:inline-block} ← duplicate below
  ```
  Measured letter widths for WORK: 14.23 / 10.75 / 9.39 / 9.88.

#### 3.2 "Work" title block

- Text Container: `position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); display:flex; flex-direction:column; align-items:flex-end; z-index:0`. Box at 1440x900: (427.5, 299.8, 585, 300.4). At 1280x800: (347.5, 249.8, 585, 300.4).
- Big Text Container: `display:flex; padding:0 16px 0 0; overflow:clip`, size 585x264. **The clip is what masks the letter-rise entrance.**
- h1 is 569x264. Character spans are each `display:inline-block`: W 231.87, o 130.38, r 82.45, k 124.29 wide.
- "scroll / drag" sits directly under it, right-aligned to the container's right edge. At 1440: (881.3, 563.8, 131.2, 36.4).
- Both text nodes are `user-select:none; pointer-events:none`, so drag passes through.

#### 3.3 Infinite canvas container

- "Infinite Canvas Container": `width:100%; height:100vh; overflow:clip; display:flex; align-items:center; justify-content:center; cursor:grab; position:relative`.
- Child `.framer-14ckpjf-container` is 2600x2300, flex-centered, and holds "Primary" (`position:relative; width:2600px; height:2300px; overflow:clip`).
- **Tile origin in viewport** = `((vw − 2600)/2, (vh − 2300)/2)`. Measured −580,−700 at 1440x900 and −660,−750 at 1280x800. Primary itself never transforms. Only cards are translated.
- All card wrappers are `position:absolute; left:0; top:0; margin:0; touch-action:none; user-select:none` with `transform: translate(Xpx, Ypx)` written every frame.
- The canvas's initial translate is the 0/0 scroll offset, so cards start at their tile positions.

#### 3.4 Card list (tile coords = top-left inside the 2600x2300 tile, scroll offset 0)

The CSS places each card by its centre (`left:L%; top:T%` plus `translate(-50%,-50%)`). Top-left = centre − size/2. Card width is fixed; height comes from the image aspect ratio (Image Placeholder `aspect-ratio`). Every href is relative `./work/<slug>`. The name shows only on hover.

| DOM name | tile L%/T% | top-left x, y | size | href | hover name | name colour | image (pixel size) | object-position |
|---|---|---|---|---|---|---|---|---|
| 12 | 17 / 13 | 252, 45.668 | 380x506.664 | ./work/orbit-404 | Orbit 404 | #fff | https://framerusercontent.com/images/i5EVAPbSjFlbPcvvbXVwzln3BY.jpg (1800x2400) | center |
| 11 | 61 / 10 | 1336, 42.5 | 500x375 | ./work/axis-point | Axis Point | #fff | https://framerusercontent.com/images/0vnxbbxLjIiUePXnIzdt69Rk.jpg (2400x1800) | center |
| 10 | 86 / 87 | 1986, 1813.5 | 500x375 | ./work/echoform | Echoform | #fff | https://framerusercontent.com/images/hT3qlH9GjIZn0XY4ES3pI2A8LU.jpg (2400x1800) | center |
| 09 | 88 / 18 | 2098, 160.668 | 380x506.664 | ./work/golden-hour | Golden Hour | #fff | https://framerusercontent.com/images/70P7DlHOLA5V6H0shE8MTQZ5XW0.jpg (1800x2400) | center |
| 08 | 13 / 77 | 148, 1518.762 | 380x504.477 | ./work/after-light | After Light | **#000** | https://framerusercontent.com/images/DsGJvT1AjWPpAnwaISwENoGk.jpg (1856x2464) | center |
| 07 | 86 / 56 | 2046, 1034.668 | 380x506.664 | ./work/forma-nine | Forma Nine | #fff | https://framerusercontent.com/images/aHAP7xg5ONNK4g1WeQC34kBsVs.jpg (1800x2400) | center |
| 06 | 38 / 89 | 798, 1793.668 | 380x506.664 | ./work/pulse | Pulse | #fff | https://framerusercontent.com/images/wvQDwJd4SD2wngQjJZQMGAI.jpg (1800x2400) | 52.3% 16.3% |
| 05 | 13 / 45 | 88, 847.5 | 500x375 | ./work/zero-parallel | Zero Parallel | #fff | https://framerusercontent.com/images/5jd5VWBN8ZG85MGXuhQfHfdV3M.jpg (2400x1800) | center |
| 04 | 38 / 25 | 798, 321.668 | 380x506.664 | ./work/north-layer | North Layer | #fff | https://framerusercontent.com/images/ZdoJlTXzsfF4jck8jdi8x8jmQN8.jpg (1800x2400) | center |
| 03 | 61 / 71 | 1396, 1379.668 | 380x506.664 | ./work/wavehouse | **Wave 124** (slug differs) | #fff | https://framerusercontent.com/images/JZNaIjPNcrDF3IgxsRH6Azc8.jpg (1800x2400) | center |
| 02 | 37 / 60 | 772, 1126.668 | 380x506.664 | ./work/bright-matter | Bright Matter | #fff | https://framerusercontent.com/images/TgD2gKSlOfhH9eJku8ilavEy2Vs.jpg (1800x2400) | center |
| 01 | 66 / 39 | 1526, 643.668 | 380x506.664 | ./work/soma-studio | Soma Studio | #fff | https://framerusercontent.com/images/91tSqsa2UCoJo8t9Pw7JOunYw.jpg (1800x2400) | 46.6% 26% |

DOM/paint order in the tile is 12, 11, 10, …, 01. All copies have z-index auto, so later DOM nodes paint on top.

**The "thin pink vertical bar" at the left edge (1440: x 0–8, y 148–523) is not a separate element.** It is the right 8px of card **05 Zero Parallel**: screen x = 88 − 580 = −492, width 500, so the right edge lands at x 8; y = 847.5 − 700 = 147.5, height 375. At 1280 the same card sits at x −572 and is fully off-screen.

Initial visible cards at 1440x900 (screen top-left): 02 (192, 426.7), 03 (816, 679.7), 01 (946, −56.3), 06 (218, 1093.7, i.e. below the fold), 04 (218, −378.3, partly visible at top), 11 (756, −657.5), 05 (−492, 147.5, the 8px sliver). At 1280x800: 04 (138, −428.3), 03 (736, 629.7), 02 (112, 376.7), 01 (866, −106.3).

#### 3.5 Card internals (Project Card, `framer-aUTKC`, variant Desktop)

```
div.card-wrapper (abs, translated; flex column, gap 20px, width 380|500)
  a[href]  (flex row, width 100%, no text-decoration)
    div container (flex 1, width 100%)
      div "Desktop" (position:relative; overflow:clip; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; cursor:pointer)
        section "Main Image"  position:absolute; width:100%; height:100%; left:calc(50% - 100%/2); top:calc(50.0469% - 100.0937%/2); overflow:clip
            img  object-fit:cover; width/height 100%; object-position per table
        div "Name"  position:absolute; left:24px; right:24px; bottom:24px; min-height:65px; overflow:clip; display:flex; align-items:center; justify-content:center   ← empty until hover
        section "Image Placeholder" position:relative; width:100%; height:auto; aspect-ratio:<img ratio>; opacity:0   ← invisible; only sizes the card
            img (same image)
```

- No border radius, no shadow, no background.
- Alt text is "Möbius" on every image.

### 4. Desktop canvas mechanics (Infinite Canvas code component + runtime samples)

Instance props *(code)*: `scrollSpeed 0.4, dragSpeed 0.8, ease 0.2, enableDrag true, parallax {enabled:true, general:0, child:0}`.

Derived constants:
- `mapSpeed(v) = 0.1 + ((clamp(v,0.1,1) − 0.1)/0.9) * 1.9`. Wheel multiplier = mapSpeed(0.4) = **0.73333**. Drag multiplier = mapSpeed(0.8) = **1.57778**.
- Lerp per frame = `0.01 + ease*0.19` = **0.048**. It is frame-based with no dt correction.

State: `scroll = {x, y, targetX, targetY, lastX, lastY, deltaX, deltaY}`, all starting at 0.

- **Wheel** (listener on the Primary tile, `passive:false`, `preventDefault`): `targetX -= deltaX*0.73333; targetY -= deltaY*0.73333`.
  - Measured: one `deltaY:+100` event moved every card **−73.32px in Y** (content moves up for scroll-down; trackpad horizontal maps to X the same way). Frame 1 Δ ≈ −4.4. It reaches −56 at 478ms, −70.3 at 1012ms, and settles at −73.32 by ~2.6s. That is pure exponential approach, no overshoot.
- **Drag** (pointerdown on Primary with button 0; pointermove/up/cancel on window): `targetX = startScrollX + (clientX − startX)*1.57778` (same for Y). Pointermove calls `preventDefault`.
  - Measured: a 100px drag right gave **+157.77px**, settling by ~2.5s.
  - **No inertia/momentum**: on release the canvas just finishes lerping to the last target.
  - The cursor stays `grab` while dragging (no `grabbing`).
  - Click suppression after a drag: none *(code)*. A drag released over a card will still fire the link click. I didn't test this live.
- **Per-frame update** for each of the 4 copies of each card:
  ```
  x += (targetX - x) * 0.048; y += ...                       // lerp
  deltaX += ((x - lastX) - deltaX) * 0.08                     // smoothed velocity
  cx = copy.baseX + x + copy.extraX + 5*deltaX*copy.variation // velocity "lag" offset
  cy = copy.baseY + y + copy.extraY + 5*deltaY*copy.variation
  ```
  `variation = Math.random()*0.5 + 0.5`, chosen once per copy at init. This velocity term is the only parallax: cards spread slightly while moving and re-converge at rest (in the wheel sample, cards differed by ~0.5–3px mid-motion). Pointer parallax is off (`general:0`, `child:0`). There is **no scale and no inner-image translate**.
- **Copies / wrap:** each card has 4 positions, base + {0, 2600} in x and {0, 2300} in y, so the period is 5200x4600 (tileWidth = 2·2600, tileHeight = 2·2300). Wrap is evaluated against the tile box (0..2600, 0..2300 in tile coords):
  - moving +x and `cx > 2600` → `extraX -= 5200`
  - moving −x and `cx + w < 0` → `extraX += 5200`
  - moving +y and `cy > 2300` → `extraY -= 4600`
  - moving −y and `cy + h < 0` → `extraY += 4600`

  Measured initial copies confirm this: card 12 sits at (252, 45.67), (−2348, 45.67), (252, −2254.33) and (−2348, −2254.33).
- **Culling:** a copy is "visible" if its viewport rect is within 1000px of the viewport on every side. Visible → `opacity:1; pointer-events:auto`, else `opacity:0; pointer-events:none`.
- **Active copy:** the original React element is moved to whichever copy contains the pointer, falling back to the previous active copy if visible, else the copy nearest the viewport centre. The other 3 copies are static `cloneNode` DOM and have no React hover state. **For the clone, just render 4 real React copies of each card and give each its own hover.** The visual result is the same.
- The loop runs only while moving. It stops when |target−pos| < 0.02, |delta| < 0.01 and no drag is active.
- `prefers-reduced-motion: reduce`: lerp = 1 and no velocity offset.
- A ResizeObserver re-measures with a 100ms debounce. An IntersectionObserver pauses the loop off-screen, as does `visibilitychange`.
- Original-site bug: after hydration, React briefly resets the active cards to `translate(-50%,-50%)` at tile 0,0. The visible cards vanish until the first pointermove or resize re-runs the layout. **Do not replicate this.** Render the cards at their positions from the first frame.

### 5. Hover states (desktop)

#### 5.1 Custom cursor (Framer "Custom Cursor" component)

- DOM: `div` `position:fixed; top:0; left:0; z-index:13; pointer-events:none; transform:translateX(px) translateY(px)`, 20x20, overflow visible. Its top-left sits at the pointer.
  - Child `section` "Background": black `#000`, border-radius 999px, `transform:translate(-50%,-50%)`, so it is centred on the pointer.
  - Three icon containers, each centred on the pointer: ArrowRight 32x32, ArrowsHorizontal 32x32 (always opacity 0 here), Play 40x40 (always opacity 0 here). Icons are white Phosphor icons (paths in assets.json).
- Opacity 0 until the first pointer move. Measured fade 1↔0 on the Background uses a 400ms spring.
- **Follow:** spring `{stiffness:340, damping:60, mass:1}` *(code)*. Measured: moving 720,450 → 382,663 reached 90% in ~0.45s and was within 1px by ~1.0s, with no overshoot (overdamped).
- Variants by hovered region (`data-framer-cursor`):
  - page background / canvas gaps → **Black**: 20px black dot.
  - cards → **Big Black Arrow Right**: dot grows to **120px**, white bold ArrowRight 32px fades in.
  - nav links and logo → **Hidden**: 2px, opacity 0.
- Variant transition: spring, duration 0.4, bounce 0. Measured dot width 20→33.7 (16ms after enter) → 103 (+130ms) → 117 (+230ms) → 120 (+330ms).
- The OS cursor is **not** hidden. Computed `cursor` is `grab` on the canvas, `pointer` on cards and `auto` elsewhere, so the system cursor shows alongside the dot.

#### 5.2 Card hover (Desktop variant → `.hover`)

- **Main Image** grows to `width:120%; height:120%`, centred (`left:calc(50% - 120%/2); top:calc(50.0469% - 120%/2)`), clipped by the card's `overflow:clip`. This is a zoom of 1.2.
  - Layout spring, duration 0.6, bounce 0.
  - Measured on card 02: 380x506.7 → 385.3x513.8 (+16ms), 428x571 (+130ms), 447x596 (+230ms), 454.7x606 (+380ms), 456x608 (≈+630ms).
- **Name** is mounted on hover only (unmounted instantly on leave):
  - `h4 > strong`, 48px/700, colour per card table.
  - Sits in the 24px-inset bottom box (at 1440: (216, 851.7, 332, 57.6) for a 380 card).
  - Character split: each char is an inline-block that rises from `translateY(200px)` to 0. Spring 0.6s, bounce 0, **stagger 0.025s per character**, opacity stays 1. The "Name" box `overflow:clip` masks the rise.
  - Measured: char0 190px→0 between +16ms and +630ms; char1/2 lag by ~25ms each.
- Placeholder stays opacity 0. No scale on the card frame. No dimming of other cards.
- On leave: the image springs back to 100% (0.6s), the name disappears immediately, and the cursor returns to Black.

#### 5.3 Nav link hover: Rolling Letters *(code + DOM)*

On `mouseenter` (ignored while a roll is in progress, and only when innerWidth ≥ 1200):
- Every letter's two copies animate `y: 0 → -100%` (14px). The duplicate slides up from below while the original exits through the `clip-path:inset(0 -8px)` top.
- Tween, **duration 0.4s, ease cubic-bezier(0.8, 0, 0.4, 1), stagger 0.03s per letter** (left to right).
- When the last letter completes, the next hover remounts the letters at y 0 and rolls again. There is no roll-back on mouseleave.
- There is no colour change.

#### 5.4 Logo hover

None. The link preset `framer-styles-preset-cofl3d` is empty. The only change is that the cursor switches to Hidden.

### 6. Entrance animations (sampled per rAF; t = ms from navigation start)

1. **Nav wrapper** (Viewport Container, `mix-blend-mode:difference`): WAAPI from `opacity:0.001; scale:1.6` → `opacity:1; scale:1`.
   - Spring 0.8s, bounce 0 (`linear(...)` easing generated from the spring). Starts at ~188ms, done by ~1000ms.
   - Samples: t=299 → opacity 0.36, scale 1.383; t=399 → 0.70, 1.182; t=500 → 0.87, 1.077; t=600 → 0.95, 1.031; t=800 → 0.99, 1.004.
   - Transform origin is the default centre of the 100vh wrapper, so the nav zooms down from 1.6x.
2. **"Work" h1** characters: `translateY(300px) → 0`. Opacity is 1 throughout; the Big Text Container's clip hides them.
   - Spring 0.6s, bounce 0; startDelay 1s after mount; stagger 0.025s.
   - Measured: W starts moving at ~1320ms, o at ~1345, r at ~1370, k at ~1395. Each settles ~600ms after its start (all done ~2000ms).
   - W samples: 286 (t1341), 214 (1387), 135 (1439), 80 (1488), 45 (1539), 20 (1605), 8.5 (1671), 2.9 (1756), 0 (1922).
3. **"scroll / drag"**: WAAPI opacity 0.001 → 1, tween **600ms, delay 1600ms, ease cubic-bezier(0.44, 0, 0.56, 1)**, from page start (~188ms). Visible from ~1790ms, full at ~2390ms. No movement.
4. **Cards: no entrance animation** (opacity 1 from first paint).
5. Phone/tablet: none on the nav wrapper (overridden off). The list "Work" h1 is a separate element with no appear effect, and there are no scroll-reveal animations in the list (no `data-framer-appear-id` there).

### 7. Page transitions (outgoing)

**None.** Clicking card 02 changed the route to `/work/bright-matter` by client-side navigation. Sampling every frame, nothing on /work changed opacity or transform before the swap: the canvas element was removed and the new page root appeared in the same frame. The site has no route transition config and no View Transitions. Nav links behave the same way (shared mechanism, not individually sampled). The clone should simply navigate (or swap instantly).

### 8. Tablet layout (810–1199.98; measured at 1000x800)

- **Nav** (variant czmpn1): padding 27px 15px 0, height 59.
  - Logo container `padding:0 15px`, so the logo is at x 30, y 27 (anchor y 30.5).
  - Right side has a single **MENU** button (container `padding:0 15px`, cursor pointer). Text 14/700/22.4, uppercase, white, ends at x 970 (box 927.8, 31.8, 42.2x22.4).
  - Still in the fixed difference-blend layer.
- **Works List** (`.framer-8tqy32`, flex row, `padding:0 20px`, measured columns imply 15px at this width): three columns with flex 1 / 4 / 1.
  - Side columns are empty sections (x 15 and x 823.3, w 161.7).
  - Centre column x 176.7, w 646.7, flex column.
- Centre column contents:
  - 160px top spacer.
  - Text Container `padding:0 15px; gap 24px`. Title Container `gap:16px`:
    - h1 "Work" at (191.7, 160, 616.7x120).
    - Intro p "A look at the projects we've crafted with teams around the world, each shaped by clarity and collaboration." at y 296, h 51.2, #444, `text-wrap:balance`.
  - **Sticky white bar**: `position:sticky; top:0; height:72px; background:#fff; z-index:1`, full column width. In flow at y 347.2. When stuck it masks list items scrolling under the nav.
  - Items list is inset 15px inside the centre column (same as the text container). Items at x 191.7, w 616.7, starting y 419.2, **pitch 937.4** (item 817.4 + 120 gap).
  - Item = `a[href=./work/<slug>]`, flex column:
    - Image box 616.7x**640**, object-fit cover, object-position per card table.
    - 32px gap, then h6 name (25/500/35, #000, width 555 = 90%).
    - 8px gap, then p (16/500/25.6, #444; same lorem paragraph for every project: "This project was about redefining identity and digital presence to communicate quiet confidence, heritage, and timeless refinement. Möbius focused on creating a brand expression that balances clarity with enduring elegance.").
  - Order: Soma Studio, Bright Matter, Wave 124, North Layer, Zero Parallel, Pulse, After Light, Forma Nine, Golden Hour, Echoform, Axis Point, Orbit 404 (01→12). No hover effect was measured on list items.
- List ends at y 11548.1. Then the **footer** (layout template, "Tablet" variant, `padding-top:160px`, white):
  - Wordmark "Möbius®": fit-text SVG `viewBox 0 0 924 180` at (25, 11708, 767.8x149.6), Inter Display 800, ls −0.05em, lh 75%, #000.
  - "© 2018-26" h5 30/700/39 (ls −0.3) right-aligned to x 970.
  - Newsletter p (16/500 #444, w 400, x 30, y 11937.6).
  - Email input "YOUR EMAIL HERE" (16/700 #000) with a 24x40 arrow button.
  - Labels SOCIAL (x 30) / LEGAL (x 515): 14/700 uppercase #999, ls .28.
  - Links 25/700/35, ls −0.25, #000, 43px pitch: LinkedIn / X (Twitter) / Instagram → https://framer.link/drukarov; Privacy Policy ./legal/privacy-policy, Terms of Service ./legal/terms-of-service, 404 ./404.
  - Bottom row y ~12443: "FRAMER" (rolling-letter link 14/700) + "TEMPLATE HANDCRAFTED BY" (#999) + "ANTONDRUKAROV" rolling-letter link → https://templatoria.com/.
  - "© 2026 MÖBIUS. ALL RIGHTS RESERVED." 14/700 #999 at y 12481.8.
  - Footer detail is shared with other pages. Recon the homepage for its full spec.

### 9. Phone layout (<810; measured at 390x844)

- **Nav** (variant jhgf8r): padding 22px 10px 0, height 54. Logo at x 20, MENU right edge at x 370.
- **Works List**: `padding:0 10px`, single centre column (x 10, w 370; side columns hidden).
  - Top spacer 120. Text container padding 0 15: h1 "Work" 80px at (25, 120, 340x80); intro at y 216, h 76.8 (3 lines).
  - Sticky 72px white bar.
  - Items at x 20, w 350, starting y 364.8, **pitch 787.2** (item 707.2 + 80 gap). Image 350x**480**, h6 24/500/33.6 (w 315), p 6 lines (h 153.6).
  - Last item ends at 9731.3. Footer follows (wordmark SVG at x 25, w 167.6; "© 2018-26" h5 28/700/36.4 at x 222.6). Doc height 10680.
- **MENU overlay** (tablet and phone):
  - Fixed full-screen layer z 10 containing a black (`rgb(0,0,0)`) panel 390x844.
  - Top row: logo "Möbius®" white at (20, 22) and "CLOSE" (14/700 uppercase white) right-aligned at x 322.9–370.
  - Centred links Work / Studio / Feed / Contact: 44/700/52.8, ls −1.32, white, at y 275.6 / 355.6 / 435.6 / 515.6 (80px pitch, horizontally centred).
  - Backdrop exit is an opacity-0 tween with duration 0 *(code)*.
  - **Open/close animation timing was not captured** (the sampler ran before the real click). Screenshot: `.recon/mobius-work-390-menu.png`.

### 10. Not measured / caveats

- Menu overlay open/close motion (timing, easing): not sampled.
- Tablet/phone list items: no hover was tested. They are touch layouts and probably have none.
- Play icon path: not captured (unused on /work).
- Visual active state of the current nav link (WORK on /work): none observed in computed styles.
- Behaviour on real touch devices (pointer events on mobile) wasn't tested, because the canvas doesn't render below 1200px.
- Clicking after a drag: from code only (no click guard), not tested live.
- The full-page tablet screenshot (`mobius-work-1000-full.png`) shows blank list images only because lazy images hadn't loaded. Scrolled screenshots show them loaded at opacity 1 with no reveal effect.

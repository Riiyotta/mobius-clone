Source: https://mobius.framer.website/legal/privacy-policy (also /legal/terms-of-service and /404)

# Legal template (/legal/<slug>) and 404 page

Recon run 2026-11-04 with headless Chromium at DPR 1, at 1440x900, 1280x800, 1000x800 and 390x844. Sources:
- Legal page module: `7BP91jb-…COuC1Ye0.mjs` (component "Legal", CMS collection `TBKkMyqX4`).
- 404 page module: `u6n87antF1-…BfriJxwO.mjs` (components "Page", "Big Number 404", "Gradient Animation").
- Shared FAQ: `KXLrbWFD0` ("FAQ Section" / "FAQ Accordion" / "FAQ item").
- Buttons: `XOF_jk7P8` (Button A, pill) and `p2KKNkdQo` (Button B, text link).

Nav, cursor, spring maths and the tablet/phone footer are in `/Users/riyaghosh/portfolio/Möbius/CLONE_SPEC.md`. The desktop footer is documented by another agent. The Berlin clock in the nav layer is in `project.md` §9. Verbatim copy is in `/Users/riyaghosh/portfolio/Möbius/src/content/legal.json` (both legal bodies, FAQ, 404 copy).

Family everywhere: `"Inter Display", "Inter Display Placeholder", sans-serif`. W = vw − 40 and u = W/12 on desktop (116.67 at 1440, 103.33 at 1280).

---

## A. Legal template: /legal/privacy-policy, /legal/terms-of-service

### A.1 Structure

```
page root (bg #fff)
  "<Title>" frame (Privacy Policy / Terms of service)
    Last Updated  — desktop: absolute overlay over the whole frame (like the project "'25" year), padding 0 20px
       Text Container (sticky top 0, 100vh, width u·2, flex column justify-end, pad 0 20 40, z1)  → "Last updated:" + <time>
       Section (rest, empty)
    Intro    (z2)  → h1 + intro p
    Content        → rich text
  FAQ Section (shared component, §C)
  Footer (shared)
  Nav layer + Berlin clock (fixed, difference)   |  Lenis (desktop only, same config as project.md §7.7)
```

Document titles: "Privacy Policy - Möbius" and "Terms of service - Möbius". HTTP 200.

### A.2 Boxes (document y)

| item | 1440x900 | 1280x800 | 1000x800 | 390x844 |
|---|---|---|---|---|
| Intro padding | 200 20 0 | 200 20 0 | 160 15 0 | 120 10 0 |
| Intro columns | Section u·2 / Text u·6 (700) / Section u·4 | 206.7 / 620 / 413.3 | 161.7 / 646.7 / 161.7 | 370 |
| h1 (PP) | 273.3, 200, 660x104 (1 line) | 246.7, 200, 580x208 (2 lines) | 191.7, 160, 616.7x80 | 20, 120, 350x128 (2 lines) |
| h1 (ToS) | 273.3, 200, 660x208 (2 lines) | 246.7, 200, 580x208 | 191.7, 160, 616.7x80 | 20, 120, 350x128 |
| intro p (PP) | 273.3, 336, 640x96 | 246.7, 440, 580x96 | 191.7, 272, 616.7x96 | 20, 280, 350x160 |
| Intro height (PP / ToS) | 432 / 536 | 536 / 536 | 368 / 368 | 440 / 440 |
| Last updated | sticky, bottom-left: p1 (40, vh−87.6), p2 +23.8 | (40, 712.4) | in flow below the Intro: row pad 40 15 0, Section 161.7 + text at x 191.7, y 408 | in flow: pad 40 10 0, x 20, y 480 |
| Content padding | 120 20 0 | 120 20 0 | 100 15 0 16 | 80 10 0 |
| Content columns | Section u·2 / Container u·4 (466.7, pad-bottom 40; text pad 0 20) / Section u·6 | 206.7 / 413.3 / 620 | 161.5 / 646 / 161.5 | 370 (text 350) |
| rich-text width | 426.7 | 373.3 | 480 (max-width 480) | 350 |
| Content start y (PP) | 552 | 656 | 555.6 | 607.6 |
| FAQ section top (PP) | 3749.1 | 4022.7 | 3559.8 | 3880.8 |
| footer top PP / ToS | 5219.4 / 4829.9 | 5493 / 4957.9 | 4623.4 / 4171.5 | 5096.2 / 4659.1 |
| docH PP / ToS | 6137 / 5748 | 6380 / 5845 | 5644 / 5192 | 6284 / 5847 |

- The intro p has `max-width:640px` and the rich text `max-width:480px` (computed).
- On desktop the "Last Updated" overlay spans the whole frame height (PP 3749.1 at 1440). Its sticky text sits at viewport y 812.4 (900 tall) and stays there until the frame ends: measured y at scroll 0 / 500 / 1500 = 812, at 3000 = 662, at 3600 = 62.
- On tablet/phone the Last Updated row comes after the Intro (CSS `order:1`) and before Content.

### A.3 Typography (computed)

| role | desktop | tablet | phone | colour |
|---|---|---|---|---|
| h1 | 104/700/104, ls −4.16 | 80/700/80, ls −3.2 | 64/700/64, ls −2.56 | #000 |
| intro p | 20/500/32 | same | same | #444 |
| "Last updated:" p | 14/500/23.8 | same | same | #999 |
| date `<time datetime="2026-05-22T22:23:24.528Z">May 22, 2026</time>` | 14/500/23.8 | same | same | #000 |
| rich-text h5 | 32/700/41.6, ls −0.32 | same (h5 preset doesn't change in this range) | same | #000 |
| rich-text p / li | 16/500/25.6 | same | same | #444 |
| strong | 16/700 | same | same | #444 (inside the mailto link: #000) |
| link `a` (mailto) | inherits 16, `<strong>` inside → 700 | same | same | #000, no underline (`text-decoration:none`) |

### A.4 Rich-text spacing (measured block margins)

- Every `p` and `h5` after the first block has `margin-top:32px`. An `h5` that follows a spacer `<p><br></p>` gets `margin-top:40px`. The first h5 has 0.
- `ul` has `margin-top:12px; padding:0; list-style:disc`. Each `li` has `padding-left:20.0156px` (≈1.25em) and no gap between items (25.6 pitch). The marker is the default disc in #444.
- The source contains empty paragraphs (`<p><br></p>`, 25.6 tall) between sections. Keep them; they are in legal.json as `{type:"p", html:"<br>"}`.
- The last li of PP's first list ends with `<br><br>` (renders 3 lines tall).

### A.5 Motion

- **Last Updated sticky container** (desktop only) has the same appear as the project hero *(code `Y`→`at`)*: `opacity 0.001 → 1, scale 1.6 → 1`, spring 0.8, bounce 0, plus the nav layer's own appear. In headless it had already settled at the first sampled frame (452 ms), so I could not capture its timing. Use project.md §7.1 for the curve.
- Intro, h1 and Content have no entrance animation and no scroll effects. The only scroll behaviour is the sticky Last Updated block.
- Lenis smooth scroll on desktop (duration 2, easeOutExpo, as on project pages). Cursor: Black dot (the mailto link uses the default dot).
- FAQ section motion is in §C.4.

---

## B. 404 page (/404 and every unknown URL)

- Any unknown path (tested `/some-unknown-url`) renders the same page with docH 3288 at 1440. `/404` returns **HTTP 404**. `document.title` "Möbius".

### B.1 Structure

```
Main Container (flex column)
  "404" section: height 100vh, flex column, justify/align center, gap 56px (phone: padding 0 20px)
     Big Number container (aspect-ratio 2.4691358; desktop height 50% of the section; tablet width 80%; phone width 100%)
        Big Number 404 box (bg #fff, overflow clip)
          3 digit columns (fit-text SVG) + Gradient overlay (mix-blend lighten)
     Text Container (flex column, gap 16, centred): p + Button B "Go back home" → "/"
  FAQ Section (shared, §C) — desktop/tablet/phone variants
  Footer (shared)
Nav layer + Berlin clock; Lenis (desktop)
```

### B.2 Boxes

| item | 1440x900 | 1280x800 | 1000x800 | 390x844 |
|---|---|---|---|---|
| 404 section | 0, 0, 1440x900 | 1280x800 | 1000x800 | 390x844 (pad 0 20) |
| number box | 164.4, 156.9, 1111.1x450 | 146.2, 131.9, 987.6x400 | 100, 170.3, 800x324.6 | 20, 284.3, 350x142 |
| p (centred, full width) | y 662.9, h 23.8 | 587.9 | 550.9 | 482.3 (x 20, w 350) |
| Button B | 617.7, 702.7, 204.6x40.4 | 537.7, 627.7 | 400.8, 590.7, 198.3x39 (Touch) | 99, 522.1, 192x37.6 (Touch) |
| FAQ section top | 900 | 800 | 800 | 844 |
| footer top / docH | 2370.3 / 3288 | 2270.3 / 3157 | 1863.6 / 2884 | 2059.4 / 3247 |

Vertical centring: number + 56 + text block (80.2) is centred in 100vh. At 1440: (900 − 586.2)/2 = 156.9.

### B.3 Big Number 404 (the digits)

- Box: white `#fff`, `overflow:clip`.
- **Three columns**, each a rich-text `<p>` containing "0⏎1⏎2⏎3⏎4⏎5⏎6⏎7⏎8⏎9":
  - Inter Display **900** (font `x8eJ5VkmPMHVhVbF0E8JYFJmwc.woff2`), `line-height:80%`, `letter-spacing:-0.03em`, centred, #000.
  - Rendered as a fit-text SVG: `<svg viewBox="0 0 224.769 2605"><foreignObject>…</foreignObject></svg>`. The third column's viewBox is `0 0 224.748 2599`.
  - Column width = **35% of the box**. Height = width × 2605/224.77 (388.9x4507 at 1440, 345.7x4006 at 1280, 280x3245 at 1000, 122.5x1419.7 at 390). One digit cell ≈ height/10 ≈ the box height.
  - Each column is positioned by `left`/`top` percentages of the box plus `transform:translate(-50%,-50%)`.

| column (DOM order) | left | top in variant A (initial) | top in variant B (final) | final digit |
|---|---|---|---|---|
| 1 (`1t0a3ej`) | 83% | −307% | 100% | 4 (right) |
| 2 (`1dpm9wx`) | 50% | 304% | 498% | 0 (middle) |
| 3 (`1fptpix`) | 17% | 448% | 100% | 4 (left) |

  - In variant A all three columns have `opacity:0`. In B they have `opacity:1`.
- **Roll animation** (desktop only):
  - The component mounts in variant A and immediately switches to B (`activeVariantCallback` on mount). Layout spring **1.6s, bounce 0**, applied to both position and opacity *(code `ke`)*.
  - Measured column top relative to the box at 1440 (A → B): col1 −3635 → −1803.5 (moves down), col2 −885 → −12.5 (down), col3 −232 → −1798 (up). In headless the switch started at ~860 ms.
  - col2 samples: −822 (t949), −687 (1029), −542 (1110), −413 (1190), −305 (1268), −226 (1347), −164 (1425), −120 (1501), −67 (1648), −39 (1795), −22 (2013), −15 (2299), −12.5 (≈2500).
  - Opacity (all columns): .08 (949), .24 (1029), .40 (1110), .55 (1190), .67 (1268), .76 (1347), .83 (1425), .88 (1501), .94 (1648), .97 (1795), .99 (2013), 1 (2158).
  - Tablet/phone render variant **B directly** (no roll, digits visible at once).
- **Gradient overlay** (all breakpoints): this is what colours the black digits.
  - Wrapper: `position:absolute; top:-30px; left:-30px; right:-36px; bottom:-30px; mix-blend-mode:lighten; filter:blur(10px)`. At 1440 it measures (134.4, 126.9, 1177.1x510).
  - Inside, the "Gradient Animation" frame: `background:rgb(232,247,255); overflow:clip`.
  - Two shapes, each `position:absolute; width:493px; height:644px; left:calc(50% − 246.5px); top:calc(50% − 321.8px); mix-blend-mode:hard-light; filter:blur(53px); overflow:visible`:
    - **Shape B**: inner SVG 657x860 at (−144, −188), `rotate:-265deg`. Gradient rgb(66,119,128) → rgb(60,59,92). Wrapper starts at `rotate:-171deg`.
    - **Shape A**: inner SVG 645x844 at (−137, −180). Gradient rgb(102,170,204) → rgb(179,237,255).
    - The SVG paths are in `project-assets.json` → `svgs`.
  - Loops *(code)*, measured:
    - Shape B rotates **+360° every 14s**, linear, infinite. Measured −49.32° → −23.66° in 1003 ms = 25.6°/s.
    - Shape A rotates **−360° every 10s**, linear, infinite. Measured −36°/s.
    - Both pause off-screen (`loopPauseOffscreen`).
  - Visual result (screenshot `/Users/riyaghosh/portfolio/Möbius/.recon/404-1440.png`): the white box stays white (lighten). The black digits take the blurred, slowly rotating gradient: deep blue-violet top-left, cyan right, pale #e8f7ff in places.

### B.4 Copy and text

| item | style | colour / notes |
|---|---|---|
| p "This page doesn’t exist, but the rest of the site does." | 14/500/23.8, centred | #757575 (rgb 117,117,117) |
| Button B "Go back home" (h6) | 26/500/36.4, ls −0.26 on desktop; 25/500/35 on tablet; 24/500/33.6 on phone | #000; href "/" |

### B.5 Button B (text link with arrows, `p2KKNkdQo`)

- `a`: `display:flex; gap:16px; padding:2px 40px 2px 0; overflow:clip; cursor:pointer`, auto width (204.6x40.4 for "Go back home").
- "Arrows" row: `position:absolute; left:-40px; right:0; height:100%; justify-content:space-between`, z1. It holds two Phosphor ArrowRight **bold** icons, black, each `width:11%; height:64%` (≈26.9x25.9 here; 20x25.9 on "About us").
  - Left arrow is off-canvas at −40 (clipped).
  - Right arrow sits in the 40px right padding.
- "Line": a black (#000) bar, `position:absolute; bottom:0; left:-1px; width:1px; height:2px`.
- **Hover** (Desktop variant only), spring 0.6, bounce 0. Values are x offsets inside the button:
  - padding 2 40 2 0 → 2 0 2 40: the text slides right 40 (0 → 40).
  - Arrows row → `left:0; right:-40px`: the left arrow comes in to x 0 and the right arrow leaves to 217.7.
  - Line → `right:0; width:auto`: the underline grows from 1 → 205.6 px.
  - Samples: t142 text 18, line 93.1; t265 34.1 / 175.6; t390 38.8 / 199.3; t511 39.8 / 204.3; settled ~630 ms. Leave reverses (t256 5.5 / 28.9; t470 0.4 / 2.8; t677 rest).
- **Appear** (Desktop variant; in view, once):
  - Text chars go from `translateY(50px)` to 0 (opacity stays 1; clipped by the button). Spring 0.8, bounce 0, per-char delay 0.025s, startDelay 0.2s, threshold 0.5.
  - The Arrows row goes from `translateY(30px)` to 0, spring 0.8, delay 0.6.
  - Measured on /404: chars start ~1300 ms (c0 30 → 13 → 5 → 2 → 0 by ~2000 ms, ~17 ms apart). Arrows start ~1650 ms: 27.3 (1704) → 15.3 (1804) → 7.0 (1903) → 2.8 (2005) → 1.1 (2108) → 0.
- "Touch" variant (tablet/phone): no appear, no hover, `cursor:unset`.
- Cursor over the button: Hidden variant.

---

## C. FAQ Section (shared component; rendered on both legal pages and the 404)

Content (verbatim, in legal.json → `faqSection`).

### C.1 Desktop ("Desktop" variant; 1440 boxes, y relative to the section top, which is 3749.1 on PP and 900 on 404)

- The section is 1470.3 tall at 1440 and 1280: flex row, `padding:0 20px`.
- **Left column** u·5 (583.3 / 516.7) contains the **Button Sticky Container**: `position:sticky; top:0; height:100vh; flex column; justify-content:flex-end; gap:40px; padding:0 20px 40px; z1`. Its children:
  - Text Container (668.2 tall at 1440): a 240px spacer, then h6 "Questions, answered." (h6>strong 26/700/36.4, ls −0.26, #000) at y 240.
  - p "Learn more about the people and principles behind Learn more about the people and principles behind Möbius®." (the duplication is in the source; an NBSP sits before "Möbius®"). 14/500/23.8, #757575, width 280, 3 lines (71.4). At y 708.2, i.e. viewport y 708.2 while stuck.
  - Button B "About us" → `/studio`, 141.6x40.4 at y 819.6 (bottom = 100vh − 40).
- **Right column** u·7 (816.7 / 723.3), `padding-bottom:40px`:
  - 240 spacer.
  - **FAQ Accordion** (939.1 tall when item 1 is open): item 1 forms its own group (233.6), then gap 120, then a group of items 2–4, each 115.2 closed, with 120 gaps. Item tops at 1440: 240, 593.6, 828.8, 1064.
  - CTA container, `padding-top:120px`: Section u (116.7) | column 583.3 (`gap:32px; padding:0 20px`):
    - p "Still have questions? Let’s talk about your project and how we can help." (16/500/25.6, #444, width 320, 2 lines).
    - Button A "Ask a question" → `/contacts`: 206.7x48, Desktop pill variant, same as Live Project (project.md §4.6/§7.5).
- **FAQ item** (desktop "Open"/"Close" variants), flex row, `cursor:pointer`:
  - **Plus column** u (116.7) with `padding:0 20px`. The Plus icon (Phosphor Plus regular, 32x32, #000) is centred horizontally, at `top:13.33px`. A hidden 48px "A" placeholder gives the column its 57.6 height.
  - **Q&A column** u·6 (700), `padding:0 20px`:
    - h4 question: 48/700/57.6, ls −0.96, #000, 2 lines at 660 wide (115.2), `text-wrap:balance`.
    - 16 gap.
    - Answer p: 16/500/25.6, #444, `max-width:480px`, 4 lines (102.4).
  - Open item height 233.6. Closed 115.2 (question only; the answer is clipped by the column's `overflow:clip`). An opacity-0 placeholder copy sizes the item and the visible Q&A copy is absolutely positioned on top.
  - Hover background "bg": a `section`, `position:absolute; top:-60px; bottom:-60px; left:-20px; right:-20px; background:#f7f7f7; opacity:0`. On hover it goes to opacity 1. It is clickable (tapping the bg toggles too).
- Initial state on desktop: **item 1 Open**, items 2–4 Closed. Items toggle independently (opening one does not close another).

### C.2 Tablet (1000; "Tablet" variant, section 1063.6 tall, `padding:0 15px`)

- Left column 323.3: sticky container with `height:100vh` (800) and `padding:0 15px 30px`.
  - 160 spacer, then h6 at 25/700/35.
  - Learn-more p (static, no reveal).
  - "About us" Touch variant (137.7x39, h6 25/500/35).
- Right column 646.7 (`padding-bottom:30px`): 160 spacer, then the FAQ Accordion in the "Touch" variant (`padding:0 15px`, `gap:80px` between items).
  - Every item starts **"Touch Close"**.
  - Item row: question column (566.2, no padding, h4 44/700/52.8, ls −0.88, 2 lines = 105.6) first; **plus column on the right** (50.5 wide, `padding-left:20px`, icon 32x32 at top 10.9).
  - Open height = 224 (105.6 + 16 + 102.4).
  - No hover background. Tapping anywhere on the item toggles.
- CTA `padding-top:80px`, column 646.7 (`padding:0 15px`), Button A "Tablet" variant 206.7x48.

### C.3 Phone (390; "Mobile" variant, section 1215.4 tall, flex column, `padding-top:120px`)

- Sticky container is static here (185 tall, `padding:0 20px 40px`): h6 24/700/33.6, then the learn-more p (350 wide). **No "About us" button.**
- Accordion (`padding:0 20px`, Touch variant, `gap:80px`):
  - Question column 305 (h4 36/700/43.2, ls −0.72); plus column 45 on the right (icon at top 6).
  - Closed heights 86.4 / 129.6 / 129.6 / 129.6. Open = question + 16 + answer (e.g. item 1: 281.6).
- CTA `padding-top:64px`, `padding:0 20px`. Button A "Mobile" variant at full width 350x48.

### C.4 FAQ motion

- **Toggle** (all variants): all item transitions are a tween **0.8s, ease cubic-bezier(0.6,0,0.4,1)** *(code `kn`)*.
  - The item height animates (115 → 234 on desktop).
  - The Plus icon rotates 0 → **135°** when open (making an ×; its bounding box goes 32 → 45.3) and back to 0 when closed.
  - Measured on a click of item 2 at 1440 (height / rotation): t93 116/1°, t176 121/7°, t260 132/19°, t343 151/41°, t426 180/74°, t509 206/104°, t593 222/121°, t675 230/131°, t759 233/134°, t842 234/135°.
  - Content below moves with the layout (Framer layout animation).
- **Hover bg** (desktop): opacity 0 → 1, same 0.8s tween. Measured: .04 (t233), .14 (332), .35 (433), .65 (533), .86 (633), .96 (732), 1 (833).
- **"Questions, answered."** (desktop only) char appear on in-view: each char goes from `translateY(50px)` to 0, opacity stays 1, clipped by the Text Container. Spring 0.8, bounce 0, per-char delay 0.025s, startDelay 0.1s *(code `rr`)*. Measured: chars ~17 ms apart; char 0 31 → 19 → 9 → 4 → 1 → 0 over ~500 ms.
- **Learn-more p** (desktop only; static on tablet/phone): word-reveal component with `staggerBy:'lines'`.
  - Each word span starts at `translateY(100%)` (24px) and transitions to 0 with `600ms cubic-bezier(.4,1,.4,1)`. Delay = lineIndex × 120ms. `initialDelay:100ms`. In-view `once`, margin −10%.
  - Note `disableForSafari:true`: Safari shows static text.
- Cursor over FAQ items: **Hidden** variant (2px, opacity 0) with the OS `pointer` cursor.

---

## D. Could not measure / caveats

- Legal "Last Updated" scale-in timing: it had already settled before the first sampled frame, so this is code-derived only.
- 404 digit roll start time is hydration-dependent (~860 ms headless). The curve was measured.
- Gradient overlay colours are approximate in the screenshot because of blur plus blend; implement the exact SVGs, blurs and blend modes from §B.3.
- FAQ tablet/phone tap behaviour comes from code (variant `onTap` handlers). I did not tap-sample it.
- The `mailto` href on both legal pages is literally `mailto:hello@world.com` while the text reads hello@mobius.studio. Reproduce it as is.

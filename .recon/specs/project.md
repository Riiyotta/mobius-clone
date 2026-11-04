Source: https://mobius.framer.website/work/soma-studio (template for every /work/<slug>)

# Work detail template: /work/<slug>

Recon run 2026-11-04 with headless Chromium at DPR 1, at 1440x900, 1280x800, 1000x800 and 390x844. Every number is either a computed style or rect, or it comes from the page module `E8CaOAT1kgboT60GYpLkFwLgL3nshGgnjGpRzTr84R4.B1K5IJZs.mjs` and its components (marked *(code)*). Shared parts (nav, cursor, spring maths, tablet/phone footer) are in `/Users/riyaghosh/portfolio/Möbius/CLONE_SPEC.md`. The desktop footer is documented by another agent. Content lives in `/Users/riyaghosh/portfolio/Möbius/src/content/projects.json` and image URLs in `project-assets.json`.

- Breakpoints are the same as the rest of the site: Desktop ≥1200, Tablet 810–1199.98, Phone <810.
- `document.title` = "Möbius". `html body{background:#fff}`.
- W = content width = vw − 40 on desktop (page side padding 20). Column unit u = W/12: 116.67 at 1440 and 103.33 at 1280. Every block below is built from flex rows of empty "Section" spacers plus content columns, and every content column has an inner `padding:0 20px` (15 on tablet, 10 on phone).

## 1. Document structure (top to bottom)

```
page root (flex column, bg #fff)
  Case Study (flex column)  ← also carries a dead lightbox override, see §7.6
    Year Container   (absolute, inset top 0, full Case Study height, z2, pointer-events:none) — desktop only
      Text Container (sticky top 0, height 100vh, flex row align-end, padding 0 40px 40px) → h3 "'25"
    Intro            (nav element; 100vh on desktop)
    Challenge        "/ 1"  (paragraph column + grey marker)
    Quote            (word-reveal h4)
    Challenge        "/ 2"  (2 paragraphs)
    Gallery Container (Sticky Section + 2-column Gallery)
    Challenge        "/ 3"  (2 paragraphs)
    Numbers          (heading + 4 stats)
    Challenge        (credits + "Live Project" button)
  Next Case          (tickers + next-project card). NOT rendered for orbit-404 (no next item).
  Footer             (shared layout component)
  Nav layer          (fixed, mix-blend-mode:difference, z5): see CLONE_SPEC
  Lenis              (desktop only)
```

## 2. Measured section boxes (y = document y; soma-studio)

| block | 1440x900 | 1280x800 | 1000x800 | 390x844 |
|---|---|---|---|---|
| Intro | 0 / h900 | 0 / h800 | 0 / h1166 | 0 / h1023.6 |
| Challenge /1 | 900 / 248 | 800 / 273.6 | 1166 / 182.4 | 1023.6 / 245.6 |
| Quote | 1148 / 388.8 | 1073.6 / 456 | 1348.3 / 344 | 1269.1 / 468.8 |
| Challenge /2 | 1536.8 / 407.9 | 1529.6 / 433.5 | 1692.3 / 342.3 | 1738 / 431.1 |
| Gallery Container | 1944.7 / 1348.9 | 1963.1 / 1197.8 | 2034.7 / 948.1 | 2169.1 / 1757.3 |
| Challenge /3 | 3293.6 / 459.1 | 3160.9 / 484.7 | 2982.8 / 367.9 | 3926.4 / 482.3 |
| Numbers | 3752.7 / 314.8 | 3645.6 / 314.8 | 3350.7 / 287 | 4408.7 / 467.2 |
| Credits | 4067.5 / 348.8 | 3960.4 / 348.8 | 3637.7 / 298.8 | 4875.9 / 298.4 |
| Next Case | 4416.3 / 886.9 | 4309.2 / 816.1 | 3936.5 / 1139.4 | 5174.2 / 530.7 |
| Footer top | 5303.3 (h917.9) | 5125.3 (h886.8) | 5075.8 (h1020.2) | 5704.9 (h1187.8) |
| docH | 6221 | 6012 | 6096 | 6893 |

Section paddings: desktop `120px 20px 0` (the credits row is `120px 20px 40px`), tablet `80px 15px 0` (credits `80 15 30`), phone `80px 10px 0`.

docH at 1440 for each project (only the gallery height varies; see §5.4): 6221 for soma, wavehouse, north-layer, zero-parallel, pulse, forma-nine and golden-hour; 6079 for bright-matter and echoform; 6435 for after-light; 6299 for axis-point; 5169 for orbit-404 (no Next Case, gallery 1183.9).

## 3. Typography (computed; family `"Inter Display", "Inter Display Placeholder", sans-serif`)

| role | desktop (≥1200) | tablet | phone | colour |
|---|---|---|---|---|
| Project name h1 | 104/700, lh 104 (1.0), ls −4.16 (−0.04em) | 80/700/80, ls −3.2 | 64/700/64, ls −2.56 | #000 |
| Description p | 16/500/25.6 | same | same | #444 |
| Services p | 14/500/23.8 (1.7), inside wrapper `opacity:0.6`; width 400 | same, width 400 | same, width 350 | #444 at 0.6 |
| Year "'25" h3 | 64/700/76.8, ls −1.92 | hidden | hidden | #eee (rgb 238,238,238) |
| Section markers "/ 1" "/ 2" "/ 3" h3 | 64/700/76.8, ls −1.92 | hidden | hidden | #eee |
| Body paragraphs | 16/500/25.6, normal ls; paragraph gap 32 (2 paragraphs: 128 + 32 + 128) | same | same | #444 |
| Quote h4 | 56/500/67.2 (120%), ls −2.24 (−0.04em) | 44/500/52.8, ls −1.76 | 36/500/43.2, ls −1.44 | #000 |
| Numbers heading h6>strong | 26/700/36.4, ls −0.26 | 25/700/35, ls −0.25 | 24/700/33.6, ls −0.24 | #000 |
| Stat value h3 | 64/700/76.8, ls −1.92 | 54/700/64.8, ls −1.62 | 44/700/52.8, ls −1.32 | #000 |
| Stat label p | 16/500/25.6 | same | same | #999 |
| Credits p | 16/500/25.6 | same | same | #444 |
| "Live Project" (Button A) | 20/500/32 | same | same | #fff (hover #000) |
| Ticker "Next Project." h2 | 160/800/160, ls −8 (−0.05em) | 120/800/120, ls −6 | not rendered | A #000, B #f7f7f7 |
| Next card name h4>strong | 48/700/57.6, ls −0.96 (hover only) | 44/700/52.8, ls −0.88 (always visible) | 36/700/43.2, ls −0.72 (always visible) | per project (§8) |

Max widths: on tablet, description and body paragraphs measure 480 wide (column 616.7). On desktop and phone they fill the column (426.7 at 1440, 373.3 at 1280, 350 at 390).

## 4. Layout per block

### 4.1 Intro (hero)

**Desktop.** `nav` flex row, `align-items:flex-end`, `padding:40px 20px`, height 100vh, so the image height is vh − 80: 820 at 900 and 720 at 800.
- Columns: Section u·2 (233.3 / 206.7) | Container u·9 (1050 / 930) | Section u (116.7 / 103.3).
- Inside the Container: Image Container u·4 (466.7 / 413.3) | Section u (116.7) | Project Info u·4.
- **Image**: an "Image" div (`padding:0 20px; overflow:clip`) holds the parallax wrapper and the "Image Reveal" section. Image box (273.3, 40, 426.7x820) at 1440 and (246.7, 40, 373.3x720) at 1280. `object-fit:cover`, `object-position` per project (soma 46.6% 26%, pulse 52.3% 16.3%, others 50% 50%). Landscape heroes (zero-parallel, echoform, axis-point) are centre-cropped into the same portrait box.
- **Project Info** (flex column, `justify-content:flex-end`, height = image height):
  - Text Container (`padding:0 20px; gap:24px; justify-content:flex-end`) takes the top 2/3 (546.7 / 480): h1 (2 lines for "Soma Studio": 208 tall, y 252.3 at 1440 and 160 at 1280), then the description p (y 484.3, h 102.4 at 1440).
  - Bottom Container (`gap:40px; justify-content:center; padding:0 20px`) takes the bottom 1/3 (273.3 / 240). The services p is vertically centred in it (y 699.5 at 1440, 616.2 at 1280; 400x47.6).

**Tablet (1000).**
- `padding:160px 15px 0`, columns Section 161.7 | Container 646.7 | Section 161.7.
- The Container is a column and **text comes first**: h1 at y 160 (616.7x80); 24 gap; description (480 wide, y 264); 48 gap; services (y 414.4).
- Then the Image Container: a **Sticky Backdrop** `section` (white #fff, height 64, `position:sticky; top:0; z-index:2`, y 462), then the image 616.7x640 at y 526.
- Intro height 1166.

**Phone (390).**
- `padding:120px 10px 0`, single Container 370 wide.
- h1 at y 120 (350x128, 2 lines), 24 gap, description (350x128, y 272), 32 gap, services (y 432).
- Then a 64px sticky white backdrop (y 479.6) and the image 350x480 at y 543.6.

### 4.2 Challenge rows ("/ 1", "/ 2", "/ 3")

- Desktop: Section u·2 | Container u·4 (paragraphs; Text Container `gap:40px; padding:0 20px`) | Section u | Container u·5 holding the grey marker h3 (top aligned with the first paragraph line, x 856.7 at 1440 and 763.3 at 1280).
- Tablet: Section 161.7 | Container 646.7 (paragraphs 480 wide) | Section 161.7. No marker.
- Phone: flex column, `gap:12px`, empty 0-height section, then paragraphs 350 wide. No marker.

### 4.3 Quote

- Desktop: Section u·2 | Quote Container u·10.
- The h4 is the "word reveal" text component (§7.3) with `textIndent:160, shiftBlock:true`. The whole h4 is `transform:translateX(-160px)` and the first word gets `margin-left:160px`. Result: **line 1 starts at the column's content x (273.3 at 1440, 246.7 at 1280) and lines 2+ hang 160px to the left (113.3 / 86.7)**. The h4 keeps the column width (1126.7 / 993.3), so its right edge sits 160 left of the column edge.
  - 1440: 4 lines, h 268.8.
  - 1280: 5 lines, h 336.
- Tablet: plain text, `transform:translateX(-120px); text-indent:120px`. Line 1 starts at x 191.7, lines 2+ at 71.7. 5 lines, h 264.
- Phone: plain text, `text-indent:80px`, no shift. Line 1 at x 100, lines 2+ at x 20. 9 lines, h 388.8.

### 4.4 Gallery Container

- First child: **Sticky Section**, a white `#fff` bar, `position:sticky; top:0; z-index:1`, full width. Height 80 on desktop, 72 on tablet, 64 on phone. While the gallery scrolls under the nav, this bar masks the top 80px of the viewport. The Year "'25" (z2) stays above it.
- Gallery (flex row, `padding:0 20px`, 15 on tablet, 10 on phone; on phone it is a column with `gap:20px`): two "Image Container" columns of W/2 each (700 at 1440, 620 at 1280, 485 at 1000), each a flex column with `gap:40px` (30 on tablet, 20 on phone).
- Slot pattern (identical for all 12 projects; CMS slots A, B, C, D are filled and the template's 6 other slots are empty):

| slot | column | geometry (desktop) | 1440 box (x, y−galleryTop, w) | 1280 | 1000 | 390 |
|---|---|---|---|---|---|---|
| A (small) | left, top | Section spacer u·2 then image container u·4; image = u·4 − 40 wide, right-aligned in the column | 273.3, 80, 426.7 | 246.7, 80, 373.3 | 191.7, 72, 293.3 | 20, 64, 350 |
| B (large) | left, below A | full column; image = W/2 − 40 | 40, 80 + hA + 40, 660 | 40, 580 | 30, 455 | 20, 350 |
| C (large) | right, top | full column | 740, 80, 660 | 660, 580 | 515, 455 | 20, 350 |
| D (small) | right, below C | image container u·4, then spacer u·2 on the right; image left-aligned | 740, 80 + hC + 40, 426.7 | 660, 373.3 | 515, 293.3 | 20, 350 |

- Image **height = width × natural aspect** (`fitImageDimension:height`), so gallery height = 80 + max(hA + 40 + hB, hC + 40 + hD). For soma at 1440: A 426.7x568.9, B 660x660, C 660x660, D 426.7x568.9, giving 80 + 1268.9 = 1348.9.
- Phone order: A, B, C, D stacked, all 350 wide (A and D 466.7 tall when portrait).
- No border radius, shadow or hover. Images are not links. Cursor over them = Hidden variant (§7.5).

### 4.5 Numbers

- Desktop: Section u·2 | Container u·10, a column with `gap:40px`: the h6 heading (pad 0 20), then a row of 4 "Text Container"s, each u·10/4 (291.7 at 1440, 258.3 at 1280) with `padding:0 20px`.
  - Each stat: h3 value, 16 gap, label p.
  - Stat x at 1440: 273.3 / 565 / 856.7 / 1148.3.
- Tablet: 4 in a row, each 202.1 wide (pad 0 15). Labels wrap ("Increase in online orders" takes 2 lines, 51.2).
- Phone: `display:grid; grid-template-columns:185px 185px; gap:40px 0`. 2x2, each cell 185 (pad 0 10).

### 4.6 Credits + Live Project

- Desktop: Section u·2 | Container u·4 (Text Container `gap:64px; padding:0 20px`: credits p 76.8 tall, then the button) | Section u·6.
- **Button A** (`XOF_jk7P8`, "Desktop" variant): an `a` to https://framer.link/drukarov (same tab, no target).
  - `display:flex; gap:16px; padding:8px 58px 8px 18px; overflow:clip`, 179.6x48.
  - Absolute "Backdrop" section: black #000, radius 999, fills the button.
  - Text "Live Project" (white).
  - Arrow 1: Phosphor ArrowRight bold, 16x16 white, `right:14px`, vertically centred.
  - Arrow 2: same icon at `left:-32px` (hidden by the clip).
- Tablet/phone use the "Mobile" variant: width 193 on tablet and 100% (350) on phone, text `flex:1`, no hover. Phone gap is 56.

### 4.7 Next Case (all projects except orbit-404)

- Desktop: `padding:160px 0`, flex column centred. Height = 320 + card height (886.9 at 1440).
- **Tickers** (`position:absolute; top:50%; transform:translateY(-50%)`, full width, flex column `gap:16px`, 336 tall at 160px type). Two rows, each `overflow:hidden; height:160`. Each row's track is `position:absolute; display:flex; gap:0` and holds 3 copies of the h2 "Next Project." (item width 890.7 at 160px, 668.1 at 120px).
  - Ticker A text #000.
  - Ticker B text #f7f7f7.
  - The tickers paint **below** the card (earlier in the DOM, no z-index).
- **Card row** "Image": flex row, `padding:0 20px`: Section u·4 | card column u·4 (a link with `padding:0 20px`, so the card is u·4 − 40 wide) | Section u·4.
  - Card box 426.7x566.9 at 1440 (x 506.7) and 373.3x496.1 at 1280. The height does not change with the next image's orientation (landscape next images are cover-cropped).
  - The card is the shared **Project Card** component (`IW5FwLyQy`), the same as the /work canvas cards (see CLONE_SPEC §3.5 and §5.2), with the "Desktop" variant. Image = next project's hero image + object-position. The name appears on hover in the next project's name colour.
  - href `./<next-slug>` (relative to /work/).
- Tablet (1000): Next Case 1139.4 tall, `padding:160px 0`.
  - Tickers at 120px. Each ticker row is 810 wide, centred (x 95–905); the strip is 256 tall with 16 gap.
  - Card column Section 161.7 | 646.7 | 161.7. Card 616.7x819.4, "Touch" variant: the name h4 is **always visible**, left-aligned, box (24 inset, bottom 24): x 215.7, w 568.7, h 52.8.
- Phone: no tickers.
  - The Next Case is just the card column (`padding:0 10px`; the link has `padding:0 10px`).
  - It starts with a 64px white **sticky backdrop** (`position:sticky; top:0; z2`), then the card 350x466.7 (Touch, name 36px visible, box x 44, w 302, bottom inset 24).

## 5. Per-project differences

### 5.1 Copy

The body copy is identical for all 12. Only these change:
- Name. `wavehouse` displays as **"Wave 124"**.
- Stats 3 and 4. soma-studio has "+18% Brand recognition" and "+52% Conversion rate". All others have "+78% Brand recognition in key markets" plus their own 4th value (see projects.json).
- Hero and gallery images.
- Next link.

The year is the literal `'25` everywhere.

### 5.2 Hero orientation

Portrait 1800x2400 except:
- zero-parallel, echoform, axis-point: landscape 2400x1800.
- after-light: 1856x2464.

The box is always portrait (426.7x820 at 1440).

### 5.3 Gallery orientations (A / B / C / D)

| project | A | B | C | D | gallery h @1440 |
|---|---|---|---|---|---|
| soma-studio, wavehouse, north-layer, zero-parallel, pulse, forma-nine, golden-hour | portrait 3:4 | square | square | portrait 3:4 | 1348.9 |
| bright-matter, echoform | square | square | square | square | 1206.7 |
| after-light | portrait 1856x2464 | portrait | portrait | portrait | 1562.6 |
| axis-point | square | portrait 3:4 (660x880) | portrait 3:4 | square | 1426.7 |
| orbit-404 | portrait 3:4 | landscape 4:3 (660x495) | landscape 4:3 | portrait 3:4 | 1183.9 |

### 5.4 Other differences

- orbit-404 has no Next Case. Its docH is 5169 at 1440, and the footer follows the credits row directly.
- Next-card name colour: #fff for all except **After Light (#000)**, which shows on /work/pulse.

## 6. Colours

| use | value |
|---|---|
| Page, Sticky Section, sticky backdrops | #fff |
| Headings, stat values, ticker A, button hover text | #000 |
| Body copy | #444 |
| Stat labels | #999 |
| Year and markers | #eee |
| Ticker B | #f7f7f7 |
| Button A backdrop | #000 |
| Button A text and arrows | #fff |

No borders, radii (except the button's 999) or shadows anywhere in this template.

## 7. Motion

The spring notation follows CLONE_SPEC: "spring d s, bounce 0" is critically damped with ω = 9.233/d.

### 7.1 Entrance (desktop; t = ms from navigation start, headless)

- **Intro** (the whole hero row), **Year Text Container** and the nav **Viewport Container** run the same appear animation:
  - From `opacity:0.001; scale:1.6` to `opacity:1; scale:1`, spring 0.8, bounce 0 *(code `K`→`Kt`)*. Transform origin is the element centre (Intro centre = vw/2, vh/2).
  - Sampled together (identical values): t758 op .041 / s1.576; t808 .224 / 1.466; t858 .431 / 1.342; t907 .605 / 1.237; t958 .736 / 1.158; t1010 .828 / 1.103; t1057 .890 / 1.066; t1107 .931 / 1.041; t1208 .974 / 1.016; t1308 .990 / 1.006; t1507 .999 / 1.001; t1574 settled (`transform:none`).
  - Because the Intro scales, the hero image top travels from y −206 to y 40 during this.
- **Hero Image Reveal** (`oIgKW6opR`, "Image Reveal"): the image `section` has `mask: linear-gradient(90deg, #000 P%, transparent P%)` and P animates 0 → 100.
  - It is a left-to-right hard-edged wipe. Tween **1.2s, ease cubic-bezier(0.6,0,0.4,1)** *(code)*, triggered on in-view once (threshold 0) after hydration.
  - Measured start ~1050 ms, 50% at ~1663, 100% at ~2264.
  - Samples of P: 1197 → 1.33, 1314 → 5.29, 1414 → 11.8, 1513 → 23.0, 1614 → 39.8, 1714 → 60.2, 1814 → 77.2, 1913 → 88.2, 2014 → 94.7, 2147 → 99.0.
- Tablet/phone: no scale-in. The Intro sits at opacity 0.001 from SSR and pops to 1 at hydration (~740 ms). The nav layer fades opacity only, with no scale (t533 .043, t584 .228, t634 .434, t683 .608). The image wipe runs the same 1.2s (start ~760 ms on phone).

### 7.2 Scroll-linked effects (desktop)

- **Hero parallax** *(code `__framer__speed:66`; measured)*. The wrapper around the hero image gets `translateY(+0.34 × scrollY)`, linear and unclamped: sy 100 → 34, 200 → 68, 400 → 136, 900 → 306, 1200 → 408. The image therefore moves at 66% of scroll speed and is clipped at the bottom by the "Image" div's `overflow:clip`. Disabled on tablet/phone.
- **Year "'25"** is sticky in a 100vh box, so it stays at viewport (40, vh − 116.8) (y 783.2 at 900, 683.2 at 800) over the whole Case Study. It scrolls away once the Case Study bottom passes (scrollY > CaseStudyHeight − vh, i.e. 3516 at 1440). z2, over the gallery and its sticky bar.
- **Sticky Section** in the gallery and the tablet/phone **Sticky Backdrops**: pure `position:sticky`, no animation.
- No other scroll transforms. The gallery images, numbers rows and paragraphs have no parallax or scale.

### 7.3 In-view reveals

- **Quote** (desktop only; static on tablet/phone). This is the shared "word reveal" text component, used by the footer newsletter too.
  - Each word is `span{display:inline-block; overflow:hidden; vertical-align:bottom} > span{display:inline-block; transform:translateY(100%)}`.
  - When the h4 is in view (IntersectionObserver `once`, `margin:-10% 0px`), each inner span gets `translateY(0%)` via **CSS transition `transform 600ms cubic-bezier(.4,1,.4,1) ${i*60}ms`** (i = word index, 22 words → the last starts at 1260 ms).
  - Measured, word 0 dy: 67.2 → 62.5 (t44) → 48.6 (94) → 31 (160) → 16.5 (227) → 7.2 (294) → 2.7 (360) → 0.6 (444) → 0 (≈540). The next word starts +60 ms.
- **Stats** (desktop only; static on tablet/phone). Framer text effect, `tokenization:character`:
  - Each char goes from `translateY(80px); opacity:0.001` to 0 / 1, spring 0.8 bounce 0. Per-char delay 0.075 s *(code)*; the measured char-to-char spacing is ≈ 0.065–0.07 s.
  - startDelay per stat: 0, 0.1, 0.2, 0.3 s. Trigger: in view, once.
  - Chars are hidden (op 0.001, y 80) until then.
  - Measured stat 1 char 1: y 67 / op .16 (t71), 45 / .43 (137), 27 / .66 (204), 16 / .80 (270), 9 / .89 (337), 5 / .94 (404), 2 / .97 (470), 0 (≈670). Stat 4's last char settles at ≈1200 ms.

### 7.4 Next Project tickers (desktop and tablet)

- InfiniteTicker *(code)*: `speed:100` px/s, gap 0. Ticker A moves **left**, ticker B **right**. `x = wrap(x ± v·dt, itemWidth)` into (−itemWidth, 0]. The dt clamp is 64 ms.
  - Measured at rest: A −298.5 → −348.5 → −398.5 at +0 / 500 / 1000 ms (100 px/s). B moves +100 px/s.
  - Both start at x 0 on mount and run continuously, paused when off-screen (IO `rootMargin:200px 0px`) or when the tab is hidden.
- `scrollToSpeed:true`: on every window scroll event (rAF-throttled), boost F = min(1000, |Δscroll| / Δt · 1000) px/s. Each frame F *= exp(−6·dt) and is zeroed below 0.5. Effective speed = 100 + F, direction unchanged (`scrollToReverse:false`).
  - Measured after one wheel of +300 (Lenis-smoothed): A went −401.8 (t29) → −425.4 (108) → −502.6 (207) → −559.5 (308) → −603.2 (408) → −636.5 (507) → −685.5 (708) → −720.1 (907) → −744.2 (1107), so peak ≈ 770 px/s, decaying to ~120 px/s by 1.1 s.
- `will-change:transform` while running. Copies are `inert`/`aria-hidden`.

### 7.5 Hover and cursor (desktop only)

- **Custom cursor** variants (same component as CLONE_SPEC §5.1):
  - Hero image, gallery images and Live Project button → **Hidden** (2px, opacity 0). The OS cursor stays: `auto` on images, `pointer` on the button.
  - Next card → **Big Black Arrow Right**: 20 → 63 (t77) → 100 (143) → 114 (210) → 118 (277) → 120 (343).
  - Everything else → Black 20px dot.
- **Live Project (Button A) hover**, spring 0.4, bounce 0 *(code; measured)*. Box stays 179.6x48. Offsets below are relative to the button.

  | element | at rest | hover |
  |---|---|---|
  | padding | 8 58 8 18 | 8 76 8 0 |
  | Backdrop | (0, 0, 179.6x48) | 28x28 circle at right: `top:10; bottom:10; right:1; aspect-ratio:1` → (150.6, 10, 28x28) |
  | text x / colour | 18, #fff | 0, #000 (passes rgb(105) around 15 ms on leave) |
  | Arrow 1 | `right:14` (x 149.6) | `right:−120` (x 283.6, clipped) |
  | Arrow 2 | `left:−32` | `right:7` (x 156.6, centred in the circle, white on black) |

  Samples (backdrop x / w, text x): t60 45.8/133.5, 12.5; t109 99.5/79.5, 6.1; t159 128.8/50, 2.6; t209 141.9/36.7, 1; t309 149.4/29.3, 0.1; settled ~460 ms. Leave reverses in ~400 ms.
- **Next card hover**: the Project Card hover from CLONE_SPEC §5.2. Main image 100% → 120%, spring 0.6: 427x567 → 449x596 (t77) → 478x635 (143) → 495x658 (210) → 505x670 (277) → 511x679 (410) → 512x680. The name mounts with per-char rise from 200px, stagger 0.025 s, spring 0.6, at 48/700, colour = next project's name colour.

### 7.6 Lightbox (present in code, inert live)

The "Case Study" frame carries a lightbox override (`vt`). Its intended behaviour:
- Click a gallery or hero `img` to open a fixed overlay `rgba(0,0,0,.95)` (z 999999). Image `object-fit:contain` inside 20px insets. Close button top-right: 12px padding, round, `rgba(0,0,0,.5)`.
- Prev/next pill at bottom 40 with a "n / N" counter (14px bold, ls .02em). Slide transitions x ±1.05·vw, 0.4 s easeInOut. Esc/arrow keys, drag to swipe.

On the live site, though, the handlers never attach: `img.style.cursor` stays empty and clicking a gallery image at 1440 opened nothing. **Do not build it** (or build it disabled); the visible behaviour is "images are not clickable".

### 7.7 Smooth scroll (Lenis 1.3.25, desktop only)

- The Lenis instance is rendered only when the breakpoint is Desktop (hidden on tablet/phone, which use native scroll). `new Lenis({ smoothWheel:true, duration:2 /* intensity 20 / 10 */, easing:t=>Math.min(1, 1.001 - 2**(-10*t)), orientation:'vertical', gestureOrientation:'vertical', syncTouch:false, autoRaf:true, autoToggle:true, anchors:true, allowNestedScroll:true, stopInertiaOnNavigate:true })`. Wheel multiplier 1.
- Because `duration` is set, Lenis uses duration+easing and **not** its default `lerp:0.1`. Each wheel event re-targets from the current animated position.
- Measured, one wheel of deltaY 100: scrollY 0 → 29 (t112) → 50 (212) → 65 (312) → 75 (412) → 82 (512) → 88 (612) → 91 (712) → 94 (812) → 96 (911) → 98 (1111) → 99 (1212) → 100 (1512).
- Lenis CSS it injects: `html.lenis, html.lenis body{height:auto}`, `.lenis:not(.lenis-autoToggle).lenis-stopped{overflow:clip}`, `.lenis.lenis-smooth iframe{pointer-events:none}`.

### 7.8 Page transitions

None (instant client-side swap, as on /work). The next-card link is a normal SPA route change; scroll resets to the top.

## 8. Reference values per breakpoint (soma-studio)

| item | 1440 | 1280 | 1000 | 390 |
|---|---|---|---|---|
| hero image | 273.3, 40, 426.7x820 | 246.7, 40, 373.3x720 | 191.7, 526, 616.7x640 | 20, 543.6, 350x480 |
| h1 | 856.7, 252.3, 426.7x208 | 763.3, 160, 373.3x208 | 191.7, 160, 616.7x80 | 20, 120, 350x128 |
| year "'25" | 40, vh−116.8 | 40, 683.2 | — | — |
| quote h4 box | 113.3, 1268, 1126.7x268.8 | 86.7, 1193.6, 993.3x336 | 71.7, 1428.3, 778.3x264 | 20, 1349.1, 350x388.8 |
| stat row y | 3949.1 | 3842 | 3505.7 | 4595.9 (2x2) |
| Live Project | 273.3, 4328.3, 179.6x48 | 246.7, 4221.2 | 191.7, 3858.5, 193x48 | 20, 5126.2, 350x48 |
| tickers strip | y 4691.8, h 336 (1440 wide) | 4549.2 | 4378.2, h 256 (810 wide) | — |
| next card | 506.7, 4576.3, 426.7x566.9 | 453.3, 4469.2, 373.3x496.1 | 191.7, 4096.5, 616.7x819.4 | 20, 5238.2, 350x466.7 |

## 9. Layout-template extra seen on this page: Berlin clock (desktop only)

This is not in CLONE_SPEC. It is part of the shared nav layer and shows on /work/<slug>, /legal/* and /404 at ≥1200. It was not found on /work, and is hidden at 1000 and 390.
- Inside the fixed difference-blend "Viewport Container": `position:absolute; right:40px; bottom:32px`, a flex row with `gap:7px`. Box at 1440x900: (1257.7, 845, 142.3x23).
- City span "BERLIN, DE": 14/700/22.4 (160%), ls 0.28 (0.02em), colour **rgb(102,102,102)**, which shows as #999 on white through the difference blend.
- Time span: same font, colour #fff (shows black).
- Text = `new Date().toLocaleTimeString('en-US', {timeZone:'Europe/Berlin', hour:'2-digit', minute:'2-digit', hour12:true})`, e.g. "11:46 AM". It updates every 1000 ms *(code, script_main)*.
- It shares the nav layer's entrance (scale 1.6 → 1 with the Viewport Container).

## 10. Could not measure / caveats

- The exact appear start time depends on hydration; the headless numbers are relative. The ordering is reliable: scale-in first, then the mask wipe starts as the scale settles.
- Tablet/phone stat and quote reveals are disabled *(code overrides)*. I did not sample them because they are static.
- Touch hover states on tablet/phone are not tested (touch variants have no hover).
- Lightbox: code only (inert live), see §7.6.

Source: https://mobius.framer.website/

# Möbius HOME (`/`): recon spec

Measured 2026-11-04 with headless Chromium (DPR 1) via Playwright node scripts. Values come from computed styles, rects and per-rAF sampling. *(code)* marks values read from the page module `jzUJT5CYfwZXZcsqmNVY6EWolmtzMuI9HemtmXS-Qac.DI2e0ALH.mjs` (home) or `shared-lib.CbKaJb3Q.mjs` / `script_main.D8sS51K5.mjs`. Shared nav, cursor, spring maths and tablet/phone footer: see `/Users/riyaghosh/portfolio/Möbius/CLONE_SPEC.md`. This file lists only what home adds or does differently.

Breakpoints (Framer): Desktop ≥1200, Tablet 810–1199.98, Phone ≤809.98. Spring "duration d, bounce 0" = critically damped, ω = 9.233/d (see CLONE_SPEC).

Document height: 1440x900 → 23544; 1280x800 → 22987; 1000x800 → 20070; 390x844 → 22998.

---

## 1. LOADER = hero appear (there is no separate loader component)

There is no preloader element. **The "loader" is the Hero's own appear animation.** It runs together with the nav layer's appear animation, which is already in CLONE_SPEC §6.1 and uses the identical spring.

- **Storage:** none. localStorage, sessionStorage and cookies are all empty after load. **The sequence replays on every load and reload, and on every client-side navigation back to `/`.** I measured this: after `/work → logo click → /`, the hero started at opacity 0.001 / scale 1.6 again, ~150ms after the click. **Tablet and phone have no hero animation at all**: everything is static from first paint (§2.6).
- The "grey wordmark darkening to black" is the opacity fade (0.001 → 1) of the whole white Hero over the white page. The wordmark's colour never changes: it is always `#000`. The "rise from the bottom" is the Hero's scale 1.6 → 1 about its centre. The wordmark sits below centre, so as the scale shrinks it travels up and in.

### 1.1 Cold-load timeline, desktop 1440x900 (ms from navigation start, per-rAF samples)

| t (ms) | what happens |
|---|---|
| 0–712 | Blank white (no paint). First paint at ~712. The Hero is already in the DOM at opacity 0.001, scale 1.6. |
| **842** | **Hero + nav layer appear starts.** Both: `opacity 0.001→1` and `scale 1.6→1`. Spring 0.8s, bounce 0, `transform-origin: 50% 50%` of each 100vh box. One spring drives both opacity and scale, so opacity = progress p and scale = 1.6 − 0.6p. |
| ~1690 | Hero appear done (opacity 1, transform none). |
| ~1855 | Clock text populates ("BERLIN, DE" → "BERLIN, DE11:25 AM"). |
| **~1840** | **Card stack "In B" starts.** Cards rise from +100vh below. Card D starts first; C, B and A follow at +100ms steps. On a client-side nav the same step happens ~200ms after mount. |
| **~2075** | Intro paragraph line 0 starts its rise. Each later line follows +120ms. |
| **~2465** | "© 2018-26" characters start rising, 25ms per character. |
| ~3290 | Card A settled. Intro last line settled ~3290. "©" last char settled ~3450. Stack switches to variant "Main" at ~3240 (In B + 1400ms), which enables hover. |

Hero appear samples (opacity / scale; the nav layer is identical):

| t | 855 | 888 | 922 | 955 | 1005 | 1072 | 1155 | 1238 | 1339 | 1505 | 1650 | 1691 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| op | .003 | .068 | .193 | .333 | .527 | .72 | .864 | .937 | .976 | .995 | .999 | 1 |
| scale | 1.599 | 1.560 | 1.485 | 1.401 | 1.284 | 1.168 | 1.082 | 1.038 | 1.015 | 1.003 | 1.0007 | 1 |

Wordmark SVG rect (viewport) along the path: t676 (−392, 741, 1905x371) → t955 (−253, 705, 1667x325) → t1072 (−92, 666, 1375x268) → t1238 (−1, 642, 1222x238) → t1505 (23, 635, 1180x230) → final (25, 634.7, 1177.2x229.3).

**Clone recipe:**
1. Render the Hero at `opacity:0.001; transform:scale(1.6)`.
2. On mount (choose a start, e.g. ~130ms after first paint to match), animate both the Hero and the nav layer to `opacity:1; scale:1` with spring {duration 0.8, bounce 0}.
3. At **+1000ms** set the stack to In B (§1.2).
4. Start the intro reveal at **+1230ms** (§1.3).
5. Start the "©" reveal at **+1620ms** (§1.4).

On client-side nav the original fires the stack after only ~200ms. Using the cold-load offsets every time is acceptable.

### 1.2 Card stack entrance (Framer component "Main", variants In A → In B → Main)

Variant machine *(code, timings confirmed by sampling)*:
- `In A` on mount: push frames are 100%, so every card sits exactly **+100vh (900px at 1440x900)** below its rest position. Rotation is **already final**, opacity 1. The cards are simply off-screen below; there is no fan-out rotation.
- After 200ms *(code)*, `In B`: push frames go to 0. On cold load the measured start was ~1000ms after the hero start, because of hydration.
- 1400ms after In B, `Main`: same layout, but hover is now enabled.

In B transitions (y only; there is no rotate, scale or opacity change):

| card (paint order bottom→top) | image | rest rotate | spring | delay | measured movement start (cold) | settled |
|---|---|---|---|---|---|---|
| D (bottom) | `ZdoJlTXzsfF4jck8jdi8x8jmQN8.jpg` (North Layer, grey/b&w) | **−5°** | 1.4s bounce 0 | 0 | ~1840 | ~3290 |
| C | `JZNaIjPNcrDF3IgxsRH6Azc8.jpg` (Wave 124) | **−20°** | 1.3s bounce 0 | 0.1s | ~1955 | ~3290 |
| B | `TgD2gKSlOfhH9eJku8ilavEy2Vs.jpg` (Bright Matter) | **−10°** | 1.2s bounce 0 | 0.2s | ~2055 | ~3290 |
| A (top) | `91tSqsa2UCoJo8t9Pw7JOunYw.jpg` (Soma Studio, orange portrait) | **+5°** | 1.1s bounce 0 | 0.3s | ~2155 | ~3290 |

Card D bounding-box top y during In B (rest = 132; offset = y − 132): 1855: 1029 · 1922: 948 · 1988: 810 · 2055: 669 · 2122: 541 · 2189: 436 · 2255: 354 · 2322: 292 · 2388: 246 · 2455: 212 · 2521: 188 · 2588: 171 · 2655: 159 · 2722: 150 · 2788: 144 · 2855: 140 · 2955: 136 · 3055: 134 · 3155: 133 · 3288: 132.
Card A (rest 132): 2189: 983 · 2255: 816 · 2322: 638 · 2388: 485 · 2455: 372 · 2521: 290 · 2588: 234 · 2655: 197 · 2722: 173 · 2822: 152 · 2955: 139 · 3088: 134 · 3255: 132.

The images come from the Projects CMS collection, items at offsets 0/1/2/3 → A/B/C/D: Soma Studio, Bright Matter, Wave 124, North Layer. That is the same order as /work 01–04.

### 1.3 Intro paragraph reveal ("Hero Text", staggered-lines text component)

*(code, matches samples)* The text is split into words. Each word is:
```
<span style="display:inline-block; overflow:hidden; vertical-align:bottom">
  <span style="display:inline-block; white-space:pre; will-change:transform;
               transform: translateY(100%) → translateY(0%);
               transition: transform 600ms cubic-bezier(.4,1,.4,1) {lineIndex*120}ms">word </span>
</span>
```
- Words are grouped into lines by measured `getBoundingClientRect().top` (|Δ| > 5px starts a new line). **Stagger 120ms per line**; all words in a line move together. Duration 600ms, ease `cubic-bezier(.4,1,.4,1)`.
- Trigger: `useInView(once, margin "-10% 0px")`, then `setTimeout(initialDelay = 400ms)`. The first word gets `margin-left: 90px` (textIndent 90).
- Measured at 1440 (translateY in px; 100% = 32px): line 0 starts at ~2075 (29.8 @2088, 12.9 @2222, 4.3 @2322, 0.55 @2455, 0 @2689). Lines 1–5 start at ~2195 / 2315 / 2435 / 2555 / 2675.
- The `p` is `display:flex; flex-direction:column`. Each paragraph is a `span{display:flex; flex-wrap:wrap; align-items:flex-end}`.
- **Desktop only.** At tablet and phone, `animate=false`: a plain `<p>` with `text-indent:90px; white-space:pre-wrap`, no motion.

### 1.4 "© 2018-26" reveal

- Framer text effect *(code)*: tokenization `character`, from `y:50` (opacity 1) → 0. Spring 0.8 bounce 0, **stagger 0.025s per char**, startDelay 0.8s, trigger onInView, not repeated.
- The wrapping "Text Container" has `overflow:clip`, height 41.6, so chars rise from fully hidden.
- Measured: char index 3 ("1") moved from 2540 (48.6 → 23.3 @2689 → 7.8 @2822 → 1.6 @2988 → 0.08 @3288). Index 7 ("6") started ~2640.
- Source text is `© 2018-YY`; YY renders as the current 2-digit year ("26").
- Desktop only. Tablet and phone have no effect.

### 1.5 Clock (desktop only)

- Lives **inside the fixed nav difference layer** ("Viewport Container", z 5, `mix-blend-mode:difference`), so it fades and scales in with the nav.
- Element "On": `display:flex; align-items:center; overflow:clip`, gap 7px between the two spans *(code)*.
- 1440x900: box (1258.5, 845, 141.5x23). Right edge x 1400 (= vw − 40). Bottom 868 (= vh − 32).
- 1280x800: (1098.5, 745, 141.5x23).
- City span `"BERLIN, DE"`: 14px / 700 / line-height 22.4px (160%) / letter-spacing 0.28px (0.02em), Inter Display, colour `rgb(102,102,102)`. Box 75.3x22.4.
- Time span `"11:23 AM"`: same font, colour `rgb(255,255,255)`. Box 59.1x22.4 at x 1340.9.
- In the difference layer over white, the time renders black and the city renders #999.
- Format *(code)*: `new Date().toLocaleTimeString('en-US', {timeZone:'Europe/Berlin', hour:'2-digit', minute:'2-digit', hour12:true})` → `"11:23 AM"` (2-digit hour, so "09:05 AM"). City string = `${"Berlin".toUpperCase()}, ${"DE".toUpperCase()}`.
- Updated by `setInterval(…, 1000)`. Empty string until hydration.
- Not rendered at tablet or phone.

### 1.6 Hero hover (desktop, only in variant Main)

- Hover target: the transparent link **`a[href="./work"]`** ("Button").
  - Position: absolute; left 0; right 0 (= stack width H/2); `top:50%; transform:translateY(-50%)`; `aspect-ratio:0.8` → **H/2 x 0.625H**. At 1440x900: (495, 168.75, 450x562.5). `overflow:clip`.
  - It sits above all cards. `data-framer-cursor` → **Big Black Arrow Right** (120px dot plus arrow, as on /work cards).
- `mouseenter` → variant **Main Hover**: rotations go A 5→**15°**, B −10→**−15°**, C −20→**−30°**, D −5→**0°**. Spring 0.8s bounce 0 *(code)*. No translate, scale or opacity change.
  - Measured A: 5.6 (+30ms), 8.7 (+100), 12.1 (+200), 13.8 (+300), 14.7 (+450), 14.9 (+600), 15.0 (+800).
- `mouseleave` → back to Main, same spring. Measured A: 11.2 (+100), 6.2 (+300), 5.1 (+600).
- Hover is ignored during In A, In B and Out. On the Touch variant (tablet/phone) there is no hover at all.
- Click goes to `/work` (client-side).
- The stack has no mouse-follow or parallax.

### 1.7 Hero scroll behaviour (desktop only; scroll-triggered variants, not scroll-linked)

- Two invisible markers sit in the Hero: "Level 1" (`position:absolute; top:10px; left:0; 10x10; opacity:0`) and "Level 2" (`top:30px`, same box). The stack and the intro each map **Level 1 → entrance variant** and **Level 2 → exit variant** (`animateOnce:false`, threshold 0).
- Measured: scrollY 5 / 15 / 25 still shows **Main**. At scrollY **40** (Level 2 has left the top of the viewport) the stack switches to **Out** and the intro to **Outro**. Back at scrollY 0, the stack goes to **In A** instantly (duration 0), then In B after 200ms, then Main after 1400ms. The intro remounts and the line reveal replays (it starts ~400ms after return).
  - Practical clone rule: `scrollY > 30 → exit`; `scrollY ≤ 10 → replay entrance`. The upper bound of the return threshold wasn't pinned; see the caveats.
- **Out** *(code + samples)*: the second Push Frame of each card goes 0 → 100% and the containers switch to `justify-content:flex-end`, so each card moves **−100vh (up)**.
  - Tween 0.8s, ease **cubic-bezier(.8, 0, 1, .7)** (accelerating).
  - Delays: A 0, B 0.1s, C 0.2s, D 0.3s (reverse of the entrance order).
  - Samples at scrollY 40, card A top y: 92 → 83 (+150ms) → −65 (+500) → −808 (+1100, final = rest − 40 − 900). D at +500ms is still 75 (delayed).
- **Outro**: the intro wrapper opacity 1 → 0, spring 0.6 bounce 0 (0.469 at +150ms, 0.006 at +500ms). After 600ms the variant becomes **Empty**: the text unmounts and the container keeps `min-height:256px`.
- The Hero itself is not sticky and has no parallax: its rect y = −scrollY. Its nav "Text Container" child is `position:sticky; top:0; z-index:1` inside the 100vh Hero.

---

## 2. HERO layout (static, after the entrance)

Hero = `div[data-framer-name=Hero]`:
- Desktop: `height:100vh; display:flex; flex-direction:column; justify-content:space-between; align-items:flex-start; background:#fff; position:relative; z-index:2; will-change:transform`.
- Tablet: `height:90vh`.
- Phone: `height:min-content; padding:0 20px; gap:24px; align-items:center; justify-content:center`.

### 2.1 Desktop 1440x900 / 1280x800

**Intro row** (`nav.Text Container`, sticky top 0, z 1): `display:flex; padding:32px 20px 0; align-items:flex-start`.
- Section 1: `flex: 1 0 0`. Width (vw−40)/4: 350 @1440, 310 @1280.
- Section 2: `flex: 3 0 0`, empty, `overflow:clip`. 1050 @1440, 930 @1280.
- Section 1 holds Text Container `padding:0 20px`, then **Intro** box: `width = (vw−40)/4 − 40` (310 @1440, 270 @1280), max-width 360, `overflow:clip`, at (40, 32).
  - Row height: 256 @1440 (7 lines), 288 @1280 (8 lines).
- Text: **20px / 500 / 32px (160%) / letter-spacing normal / #000**, Inter Display. First-line indent 90px; the fixed nav logo "Möbius®" (x 40, y 32, 83.2x32) fills the indent visually.
- Copy (verbatim, ` ` marked as `~`), preceded visually by the nav logo:
  `Möbius®` + ` — a design studio shaping brands and digital experiences through motion, clarity, and timeless craft. Based online, working globally, we~help ambitious teams express who they are and~what they stand~for.`
- Line breaks at 1440 (y = 32 + 32·n):
  1. "— a design studio" (x starts 130)
  2. "shaping brands and digital"
  3. "experiences through motion,"
  4. "clarity, and timeless craft. Based"
  5. "online, working globally, we help"
  6. "ambitious teams express who"
  7. "they are and what they stand for."
- Line breaks at 1280:
  1. "— a design studio"
  2. "shaping brands and digital"
  3. "experiences through motion,"
  4. "clarity, and timeless craft."
  5. "Based online, working"
  6. "globally, we help ambitious"
  7. "teams express who they are"
  8. "and what they stand for."

**Name block** ("Name"): `position:absolute; left:0; right:0; bottom:36px; z-index:1; padding:0 40px 0 25px; display:flex; flex-direction:column; align-items:center`.
- Inner row: `display:flex; gap:40px; align-items:flex-start`.
- Wordmark container `flex:1`. It holds a **fit-to-width SVG text** `viewBox="0 0 924 180"` with text "Möbius®": Inter Display 800, font-size 240 (in viewBox units), letter-spacing −0.05em, line-height 75%, fill #000. Rendered size:
  - 1440: (25, 634.7, **1177.2x229.3**)
  - 1280: (25, 565.8, 1017.2x198.2)
- "© 2018-26" container: `overflow:clip`. `h5` preset: **32px / 700 / 41.6px / −0.32px (−0.01em) / #000**, Inter Display ("Inter" in the font list; computed family is the Inter Display stack).
  - 1440: (1242.2, 634.7, 157.8x41.6), right edge 1400.
  - 1280: (1082.2, 565.8, 157.8x41.6).
  - Char widths @32px: © 28.2 (+space), 2 18.8, 0 20.5, 1 12.2, 8 19.3, - 13.9, 2 18.8, 6 19.4.
- Wordmark bottom = vh − 36. The © top aligns with the wordmark top.

**Card stack** (`.framer-6cw0b3-container`): `position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); height:100vh; width:auto (= 50vh via aspect 0.5); z-index:1; user-select:none`.
- Inside "Main" (`display:flex; column; center; overflow:visible`), let H = 100vh:

```
Card Container D/C/B: position:absolute; left:50%; top:50%; translate(-50%,-50%); height:100%; width:min-content;
                      display:flex; flex-direction:column; justify-content:flex-start; align-items:center
  section "Push Frame"   align-self:stretch; height:0%  (In A: 100%)   overflow:clip
  div "Card X"           aspect-ratio:.5; height:100%  → H/2 x H; position:relative; overflow:visible
    div "Card"           position:absolute; left:50%; top:50%; width:100%; transform: translate(-50%,-50%) rotate(R)
                         display:flex; column; gap:20px
      div (row, width 100%)
        section (image)  aspect-ratio:.75; flex:1 → H/2 x 2H/3; img object-fit:cover
  section "Push Frame"   height:0% (Out: 100%)
Card Container A: same but position:relative (in flow, centred by Main); its Card uses left:0; transform: translateY(-50%) rotate(R)
a "Button" (link) — see 1.6
```
- DOM / paint order: D, C, B, A, Button.
- **Card image size:** 1440x900 → **450x600**; 1280x800 → **400x533.3**. Stack box 1440: (495, 0, 450x900); 1280: (440, 0, 400x800).
- Rotated bounding boxes at rest, 1440:
  - A (469.7, 131.5, 500.6x636.9) +5°
  - B (446.3, 115.5, 547.4x669) −10°
  - C (406, 91.1, 628.1x717.7) −20°
  - D (469.7, 131.5, 500.6x636.9) −5°
- Same at 1280: A/D (417.5, 116.9, 445x566.2); B (396.7, 102.7, 486.5x594.7); C (360.9, 81, 558.3x638).
- Object-position: A `46.6% 26%`; B, C, D `50% 50%`.
- No radius, shadow or border. Alt "Möbius".
- srcset pixel sizes: 1800x2400 originals (natural size served 1439x1919 @1440 via `scale-down-to`).

### 2.2 Tablet 1000x800 (810–1199)

- Hero 1000x**720** (90vh). Nav: tablet variant, MENU (CLONE_SPEC §8).
- Intro row: `padding:27px 15px 0; width:810px (fixed!)`. Section 1 `flex:2` (x 15, w 520). Section 2 `flex:1` (x 535, w 260). Text Container `padding:0 15px`.
  - Intro box (30, 27, **360x192**), max-width 360. Plain text 20/500/32 #000, `text-indent:90px` (logo at x 30 fills it). No animation.
- Name block: `position:relative` (bottom of the space-between column), `padding:0 30px 0 25px`, row gap 40.
  - SVG (25, 572.4, **757.8x147.6**).
  - © h5 **30px / 700 / 39px / −0.3px** at (822.8, 572.4, 147.2x39), right edge 970.
- Stack: container `aspect-ratio:.5; height:66%` (of 720 = 475.2) → 237.6 wide; `top:53%` (381.6); translate(−50%,−50%). Variant **Touch**: Main is 650 tall by default, but here the card containers are `height:123%` → 584.5.
  - Cards **292.2 wide** (Card X box 292.2x584.5).
  - Images **292.2x389.6**.
  - Rotated boxes: A/D (337.4, 174.8, 325.1x413.6); B (322.3, 164.4, 355.5x434.5); C (296, 148.5, 407.9x466.1).
  - Same rotations as Main (+5/−10/−20/−5).
  - Link box (353.9, 199, 292.2x365.3).
- No entrance, no hover, no scroll variants. No clock. Static from first paint.

### 2.3 Phone 390x844 (≤809)

- Hero: column, centred, `padding:0 20px; gap:24px`, height 998.6.
- Order:
  1. Intro row: sticky, `padding-top:22px`, x 20, w 350, h 310.
     - Section 1 `flex:2` → 233.3 wide; Section 2 `flex:1` → 116.7.
     - Intro (20, 22, 233.3x288): 9 lines, 20/500/32 #000, `text-indent:90px`, static.
  2. **Stack** (order 1): `position:relative; width:72%` (252), `aspect-ratio:.5` → 252x504, at (69, 334).
     - Touch variant: card containers 619.9 tall, cards **310 wide**, images **310x413.3**.
     - Rotated boxes: A/D (22.6, 366.6, 344.8x438.7); B (6.5, 355.6, 377x460.8); C (−21.3, 338.8, 432.6x494.4). C overflows the viewport by 21px each side, which the page clips (Main Container `overflow:clip`).
     - Link box (69, 428.5, 252x315).
  3. Level markers (orders 2–3, invisible).
  4. **Name** (order 4): position relative, column, **gap 32**.
     - SVG (20, 862, **350x68.2**).
     - © h5 **28px / 700 / 36.4px / −0.28px** at (20, 962.2, 137.4x36.4), left-aligned.
- No entrance, hover, scroll variants or clock. Static.

### 2.4 Hero colours
Hero background `#fff`; all hero text `#000`; clock city `rgb(102,102,102)` and time `#fff` inside the difference layer.

### 2.5 Hero assets
- Card images: `https://framerusercontent.com/images/91tSqsa2UCoJo8t9Pw7JOunYw.jpg`, `.../TgD2gKSlOfhH9eJku8ilavEy2Vs.jpg`, `.../JZNaIjPNcrDF3IgxsRH6Azc8.jpg`, `.../ZdoJlTXzsfF4jck8jdi8x8jmQN8.jpg` (all 1800x2400 originals).
- Font: Inter Display 800 (wordmark), 700 (©, clock), 500 (intro). Files are listed in CLONE_SPEC.

### 2.6 Tablet/phone load (sampled)
First paint ~476ms (1000) / ~464ms (390). The Hero is at opacity 1, transform none, and the cards are at rest from first paint. There is no hero appear and no nav-layer appear. Nothing animates in the hero.

---


## 3. Page-wide systems

### 3.1 Grid, gutters, global
- **Desktop grid:** sections use `padding:0 20px`. Content is split into flex "Section" columns whose widths are multiples of **col = (vw − 40)/12** (116.67 @1440, 103.33 @1280). Every text container inside a column has `padding:0 20px`, so text starts 20px inside its column (x 40 at the left edge).
- Common splits:
  - 2/8/2: 233.3 / 933.3 / 233.3 @1440
  - 5/7: 583.3 / 816.7
  - 6/6: 700 / 700
  - 1/6/5 (Services list row): 116.7 index + 700 text
- **Tablet:** `padding:0 15px`, inner `0 15px`; Framer content width is fixed at 810 in several containers (see dumps).
- **Phone:** `padding:0 10px`, inner `0 10px`.
- Section vertical rhythm @1440:
  - Headline sections: `padding-top:200px`
  - Tablet: 160
  - Phone: 120
- Page bg `#fff`. Main Container `overflow:clip`.
- Colours used on home:
  - `#000`
  - `#fff`
  - `#444` (body)
  - `#757575` (small captions next to CTAs)
  - `#999` (labels, dates, testimonial company)
  - `#eee` (index "A /", "/1", "/month", award row borders, tags bg)
  - `#f7f7f7` (ticker B text, toggle track)
  - `#666` (clock city)
  - `rgba(0,0,0,.5)` (founder card backdrop on hover)
- **Copy is verbatim from DOM** (see `home-raw/copy-1440.json` and `home-raw/text-<w>.txt`). Two oddities exist in the original and should be kept or decided by Build:
  - the "42 Clients Worldwide" paragraph textContent ends `…true to who they are.n, designing with purpose, and shaping ideas that resonate far beyond their launch.` (template bug; visible text at 1440 is 5 lines, 128px tall);
  - the "About us" caption reads `Learn more about the people and principles behind Learn more about the people and principles behind Möbius®.`
- **Raw measurement data** (boxes for every element at all 4 widths, computed fonts, motion samples) is in `/Users/riyaghosh/portfolio/Möbius/.recon/specs/home-raw/`. Use `dom-<w>.txt` for any box not listed here. Format: `[tag, framerName, ownText, [x, docY, w, h], {f: size/weight/lh/ls color, pos, tf, op, bg, lay, ov, br, src, fit, href, cur}]`. Doc Y was measured at scrollY≈1. Sticky elements show their natural position.

### 3.2 Typography presets (computed; Inter Display stack everywhere; 1440 = 1280)
| role | ≥1200 | 810–1199 | ≤809 |
|---|---|---|---|
| Section H2 (Möbius® In Numbers, Our Awards, The Process, Client reflections, Pricing, Studio Notes) | 104/700/104/−4.16 | 80/700/80/−3.2 | 64/700/64/−2.56 |
| Display H2 (Ideas in Motion., Our Partners, Let’s Talk!) | 160/800/160/−8 | 120/800/120/−6 (Our Partners: 80/700) | Let’s Talk! 80/800/80/−4; Our Partners 64/700 |
| Scramble words (h3 > span) | 80/700/88 (110%)/−2.4 (−0.03em) | 54/700/64.8/−1.62 | 44/700/52.8/−1.32 |
| Services statement H4 / big-number H4 | 56/700/67.2/−1.68 (numbers rows: lh 64.4) | 44/700/52.8/−1.32 (numbers: 50.6/−1.76) | 36/700/43.2/−1.08 (numbers 41.4/−1.44) |
| Index "A /" | 56/700/67.2/−1.68 #eee | 44 | 36 |
| Testimonial quote H4 | 48/500/57.6/−1.44 | 44/500/52.8/−1.32 | 36/500/43.2/−1.08 |
| FAQ question H4, founder name | 48/500/57.6/−0.96 | 44/500/52.8/−0.88 | 36/500/43.2/−0.72 |
| Price package H3 | 64/700/76.8/−1.92 | 54/700/64.8/−1.62 | 44/700/52.8/−1.32 |
| "/month" H4 | 56/700/67.2/−1.68 #eee | 44/52.8 | 28/33.6/−0.84 |
| H5 (process names, footer links, ©) | 32/700/41.6/−0.32 | 30/700/39/−0.3 | 28/700/36.4/−0.28 |
| H6 (Our Services, Our Founders, underline CTAs) | 26/500/36.4/−0.26 | 25/500/35/−0.25 | 24/500/33.6/−0.24 |
| Hero intro / form sentence / pill-button label | 20/500/32/normal | same | same |
| Body p | 16/500/25.6 #444 | same | same |
| Caption p (next to CTAs) | 14/500/23.8 (170%) #757575 | same | same |
| Process step p | 14/500/22.4 #444 | same | same |
| Label (SOCIAL, LEGAL, STARTING FROM, 01–12, clock, footer bottom) | 14/700/22.4/0.28 uppercase #999 | same | same |
| Tag pill text | 14/700 (strong)/23.8 #000 | same | same |
| Big-number digits | 210.68/900/168.54/−6.32 (in an SVG fit box) | same | same |

## 4. Sections top → bottom (1440x900; 1280 is the same structure scaled by col width; tablet/phone notes at the end of each)

Doc Y values are page coordinates. Section heights @1440 / 1280 / 1000 / 390 are listed under each section.

### 4.1 Scramble (y 900 → 2736.7; h 1836.7 / 1836.7 / 952.7 / 1171.1)
1. **Spacer** section 1440x800 (desktop only, `hidden` on tablet/phone).
2. **Scramble Container** (0, 1700, 1440x352), `padding:0 40px`.
   - Content is `h3` "Möbius® brings ideas and design together, turning imagination into clarity and connection into beauty." (1360 wide, 4 lines @1440).
   - Rendered as a flex-wrap row of word spans, each `display:inline-block; margin-right:0.25em`. The first word has `text-indent = 17% × h3 width` (231.2px @1440).
   - Font 80/700/110%/−0.03em #000.
   - Lines @1440:
     1. "Möbius® brings ideas and" (indented)
     2. "design together, turning imagination"
     3. "into clarity and connection into"
     4. "beauty."
3. **Text Container** (0, 2052, 1440x684.7), `padding:120px 20px 200px`, 2/8/2 split.
   - p at (273.3, 2172, 480x364.7): 16/500/25.6 #444, paragraph gap 32.
   - Two paragraphs: "At Möbius®, we keep our process clear, collaborative, and focused. … built to last beyond~trends." and "Our way of working is straightforward. … when the team thinks as~one."

**Motion: scroll-linked word scatter** *(code + samples)*
- Each word i has a fixed offset `(cos θ·r, sin θ·r)`, where `rand(s)=frac(sin(s)·1e4)`, `seed=117`, `θ_i = rand(seed+2i+1)·2π` and `r_i = rand(seed+2i+2)·spread`, with **spread 1000**.
- Progress `a` comes from the h3 top T (viewport) with vh = innerHeight: `T ≤ vh/2 → 1`, `T ≥ vh → 0`, otherwise `(vh − T)/(vh/2)`.
- `transform: translate(x·(1−a), y·(1−a))`, applied via a rAF-throttled scroll listener. There is no smoothing beyond Lenis.
- Measured first word: (−739, 101) at scrollY 900; (−422, 58) at 1050; (−106, 14) at 1200; (0, 0) from ≈1250.
- Tablet/phone: spread 0, so the words are static.
- The paragraph uses the staggered-lines reveal (§1.3 mechanics) with duration 600, line stagger 120, initialDelay 100, color #444, on view. Desktop + tablet only; disabled for Safari *(code)*.

### 4.2 Reel (y 2736.7 → 3239.2; h 502.5 / 442.5 / 372.8 / 196.9)
- **Tickers** (behind the video): `position:absolute; top:50%; translateY(-50%)`, column, gap 16, 1440x336.
  - Ticker A: h2 "Ideas in Motion. " 160/800/160/−8 **#000**, item width 1078.5, gap 0, 3 copies. Direction **left**.
  - Ticker B: same text in **#f7f7f7**, direction **right**.
  - Speed **100 px/s** (measured 100.7). With scrollToSpeed, a boost = min(1000, |scroll velocity px/s|) is added and decays `×e^(−6·dt)`; measured 670 px/s while wheeling.
  - Position wraps modulo item width. dt is capped at 64ms. Pauses off-screen (IO rootMargin 200px).
  - Tablet: 120/800 text, item 808.8. Phone: tickers not rendered.
- **Reel Container**: row, `padding:0 20px; align-items:flex-end`, 2/8/2.
  - Video Container (253.3, 2736.7, 933.3x502.5), `padding:0 20px`, `overflow:clip`, cursor **Play**.
  - `<video>` 893.3x**502.5** (16:9), object-fit cover, `autoplay muted loop playsinline preload=auto`, poster `NpmO2eWasqY9hCe8AtNpjN8Is0.jpg`.
  - 1280: video 1240×(… ) 442.5 tall. 1000: (168.6, 662.9x372.8). 390: (20, 350x196.9).
- **Click → lightbox** (fixed overlay, z 10):
  - Backdrop `#000`: opacity 0.001→1, spring 0.6 bounce 0 (measured 0.51 @144ms, 0.91 @295, 1 @526).
  - Video 1440x810 centred (y 45).
  - Close button: white 60x60 circle, `border-radius:999px`, at (1348, 32) (right 32, top 32). It enters from `x:110, y:−110` with spring 0.8 bounce 0, **delay 1.2s** *(code)*.
  - Cursor over the overlay = **White** variant (see §7).
  - The player has sound/play variants ("Sound On Play/Off Play/Off Pause"). Their internals were not measured.

### 4.3 Our Services (y 3239.2 → 6343.7; h 3104.5 / 3306.1 / 2977.9 / 3104)
- Row `padding:0 20px`, 5/7 split.
- **Left: Sticky Container** (20, 3239.2, 583.3x900), `position:sticky; top:0; z-index:1`, `display:flex; flex-direction:column; justify-content:flex-end; gap:40px; padding:0 20px 40px`. It holds:
  - 230px spacer, then H6 **"Our Services"** at (40, 3469.2) (bold via `<strong>`; char text effect y50 startDelay .1);
  - at the bottom, caption "If you’re looking for clarity in design, let’s build it together." (14/500/23.8 #757575, w 240) at y 3971.2;
  - **underline CTA "Get Started"** → `./contacts` (Button B, §6.2) at (40, 4058.8, 170.4x40.4).
- **Right: List** at x 603.3, column, **gap 180**. 4 items, each a row:
  - index column 116.7 (H4 "A /", "B /", "C /", "D /" #eee, right-aligned via `padding:0 20px; justify-content:flex-end`);
  - text column 700 (`padding:0 20px`, gap 16): H4 statement 56/700 (403.2 tall, 6 lines; D is 470.4, 7 lines), then **Tags** row (`padding-top:40px; gap:10px; flex-wrap:wrap`).
  - Tag = `bg #eee; border-radius:99px; padding:10px 20px`, height 43.8, text 14/700.
  - Item tops: 3469.2, 4206, 4942.8, 5679.7 (pitch 736.8).
- Statements and tags (verbatim):
  - **A**: "We create identity systems that bring clarity and distinction to brands — thoughtful visuals, cohesive structure, and design that lasts." Tags: Brand Strategy · Visual Identity System · Logo & Mark Development · Typography & Color System · Guidelines & Asset Library
  - **B**: "We design intuitive, expressive digital experiences shaped by strong visual direction and seamless interaction across all screens." Tags: Website & Platform Design · Interaction & Motion Guidelines · UI Systems · Component Libraries · Responsive Layouts
  - **C**: "We guide ideas from concept to execution, shaping visual and narrative direction for consistent expression across every touchpoint." Tags: Visual Direction · Campaign Concepts · Art Direction for Photo & Film · Tone & Narrative Guidance · Style Frameworks
  - **D**: "We help teams make confident decisions by defining direction, sharpening positioning, and building the foundation for meaningful growth." Tags: Brand Positioning · Market & Audience Insights · Naming & Messaging · Design Audits · Roadmaps & Recommendations
- Motion: the statement H4 words have an appear (`y 1.9 / opacity .968` seen for 1 frame). This is the Principles-Services Card appear: opacity .001→1, spring 0.6 bounce 0, **delay 0.4s** *(code `ye`)*, on view. Treat it as a fade-in.
- Tablet: 1/2 split (323.3 / 646.7), H4 44px, tags wrap to 2 per row, sticky column 800 tall with `padding-bottom:30px`. Phone: single column, no sticky CTA.

### 4.4 Möbius® In Numbers (y 6343.7 → 9451.7; h 3108 / 2808 / 1725 / 2572.4)
- **Headline** (`padding-top:200px`), row 9/3:
  - H2 lines "Möbius®" / "In Numbers" (40, 6543.7 / 6647.7, 1010x104). Char rise y200 → 0, spring 0.6, stagger .025, startDelay .1 (Wf) / .2 (Gf).
  - Right column (1090): caption "A closer look at the milestones and collaborations that define our ongoing practice." (w 310), then underline CTA **"Let's work together"** → `./contacts` at (1090, 6623.3, 259.4x40.4).
- **Big Numbers** (0, 6751.7, 1440x2700): three 900-tall rows **A/B/C** (`nav`, `padding:0 20px`, 5/7 split).
  - Left: text container centred vertically, gap 56: H4 + p (w 480) + pill CTA.
    - A "25 International Awards" / "Recognized across global juries for clarity, craft, and concept. Every award reflects the same commitment: creating work with intention, designing with purpose, and shaping ideas that resonate far beyond their launch." / pill **"Our Awards"** → `./#awards`.
    - B "42 Clients Worldwide" / "Built on relationships, not transactions. We partner with teams who value dialogue, trust, and shared ambition — working together to create brands and digital experiences that feel true to who they are." / pill **"Our Clients"** → `./#client-logotypes`.
    - C "83 Completed Projects" / "Each project becomes a part of the studio’s rhythm — ideas shaped, stories refined, and systems brought to life. Every collaboration deepens our perspective and strengthens the work that follows." / pill **"Our Work"** → `./work`.
  - H4 tops: 7026.1 / 7913.3 / 8826.1.
- **Sticky number** (`nav` "Sticky", sticky top 0, 1440x900, z 1). Box "A" (576, 7012.1, **864x639.6**): white bg, `overflow:clip`, aspect 1.3508.
  - Two digit windows, each `width:53%` (457.9) and `aspect-ratio:.855` (535.3 tall), `overflow:clip`:
    - tens = "Digit A": `left:0; top:58%`
    - ones = "Digit B": `right:0; top:43%`
    - both `translateY(-50%)`.
  - Each window holds an SVG column of the digits "0 1 2 3 4 5 6 7 8 9": 457.9 wide, ~5307 tall, one digit cell ≈ 530.7px. Font Inter Display 900, ls −0.03em, #000.
  - Over them, 3 photo layers (inset 1px, `mix-blend-mode:lighten`) with crossfaded opacity. The photo shows only through the black digits (white bg stays white).
  - States: **A=25** (img `LdGkrvu5…`), **B=42** (img `VaocDJ3f…`), **C=83** (img `gk68gx…`).
  - Implementation: `translateY = −digit·cell` per column (equivalently, the CSS `top` values A: ones 0% / tens 298%; B: ones 298% / tens 100%; C: ones 198% / tens −297%, then translate(−50%,−50%)).
  - Transition between states: **spring 1.6s bounce 0** for both digit columns and image opacity.
- **Trigger:** markers big-number-a (top 200 of row A), b (top of row B), c (top of row C). **The state switches when a marker crosses the viewport centre** (measured: B between scrollY 7200 and 7250, marker top 452 → 402). Scrolling back reverses.
- Tablet: number block 420 / 500 layout, H4 44. Phone: stacked, number block 370 wide (see `dom-390`).

### 4.5 Our Awards (y 9451.7 → 10240.4; h 788.8 / 814.3 / 956.8 / 1571.6)
- `padding:200px 20px 0`, 6/6 split.
- **Left:** H2 "Our" / "Awards" (104, two lines, char rise). At the bottom (`space-between`): caption "Selected moments where our work was acknowledged by others." (w 240) and underline CTA **"Our Work"** → `./work` at (40, 10200, 149x40.4).
- **Right: List** of 8 rows (720, w 700), each `padding:24px 0`, height 73.6, columns 2/3/1 (233.3 / 350 / 116.7), text 16/500/25.6 #444. A 1px `#eee` border sits at the row bottom (absolute, x 740, w 660).
- Rows:

  | award | category | count |
  |---|---|---|
  | Red Dot | Brand & Communication Design | x3 |
  | European Design Awards | Visual Identity | x1 |
  | ADC Europe | Branding & Typography | x2 |
  | D&AD | Digital Design | x3 |
  | Tokyo TDC | Typography Excellence | x1 |
  | Awwwards | Site of the Day | x2 |
  | Awwwards | Honorable Mention | x3 |
  | FWA | Site of the Day | x1 |
- **Motion (scroll-linked, per row):** `y: 100→0`, `opacity: 0→1` with progress `p = clamp((vh − rowTop)/rowHeight, 0, 1)`, where rowTop is the untransformed top. So each row animates while its own 73.6px enters from the bottom.
  - Smoothed by spring {stiffness 500, damping 100, mass 3.3}.
  - Measured row 4 at p≈.37: y 63.5, opacity .365.
- Phone: rows stack (count 20/500/32).

### 4.6 Founders (y 10240.4 → 11186.1; h 945.7 / 875 / 1102.3 / 1456.9)
- Column, gap 300.
- **Sticky Section**: white bar 1440x80, sticky top 0, z 3. Tablet 72, phone 64. It masks content under the nav.
- **Cards Container** (`padding:0 20px`, 4/8):
  - Left text: H6 "Our Founders" (40, 10744.3) (char effect); p (w 384) "Founded by Jonas Richter and Tobias Keller, Möbius® began as a shared belief in how design should feel: clear, thoughtful, and human. What started as a focused partnership has grown into a small team with a strong collective mindset, bringing structure, imagination, and craft to every project we take on."; pill CTA **"Meet the Team"** → `./studio` at (40, 11138.1, 208.7x48).
  - Right: two **Team Cards** `a[href=./studio]` **426.7x565.7** (container `padding:0 20px`). Bg `#999` behind the image, image object-fit cover:
    - card 1 at x 506.7 (`k1yRftQf…`, Jonas Richter, "Founder & Creative Director"), aligned flex-end;
    - card 2 at x 973.3 (`YVYiW8vz…`, Tobias Keller, "Founder & Strategy Director"), aligned flex-start.
- **Scroll motion:** Card Container 1 `y: −200→0`, Card Container 2 `y: −50→0`, with `p = clamp((vh − top)/565.7, 0, 1)` on the untransformed top (10620.4).
  - Spring {stiffness 340, damping 60, mass 1}.
  - Measured card 1: −136.4 @9900, −101.1 @10000, −65.7 @10100, −30.4 @10200, 0 @10300.
- **Card hover** (Team Card, desktop):
  - Image grows to 120% (426.7x565.7 → 512x678.8), centred, layout spring 0.6 bounce 0.
  - Backdrop `rgba(0,0,0,.5)` covers the card.
  - Name text block appears at the bottom (`left/right 24, top 473.7`, 378.7x68): name H4 48/500/57.6 #fff + role p 20/500/32 #fff. Each line's chars rise from y ≈ 200 → 0 (char stagger ≈ .025, spring 0.6) inside `overflow:clip`.
  - Cursor **Big Black Arrow Right**.
  - Measured image width 438 (+50ms), 469 (+120), 502 (+250), 510.5 (+400), 512 (+700).
  - On leave it reverses: image back to 100% (spring 0.6) and the text hides.
  - Tablet/phone: the name/role is always visible (white on the image, 44px / 36px), the cards are 455x603.3 at tablet, and there is no hover.

### 4.7 Our Partners (y 11186.1 → 13957.1; h 2771 / 2472 / 1601.8 / 1822.8)
- Column, `padding:0 20px`. White sticky bar 80 (z 3).
- **Sticky Container** absolute over the whole section (2771 tall) holds **Sticky** (1440x900, sticky top 0, `padding:40px; justify-content:flex-end; gap:24`):
  - **"Our Partners"** H2 160/800 centred (`position:absolute; top:50%` → y 11511.1, translateY(−80));
  - bottom-left caption "Here are some of the brands we’ve had the privilege to collaborate with." (w 240, #757575).
- **Heading fade (scroll-linked):** opacity 1 → **0.02** as the 240px marker "our-partners-fade-out" (absolute, top of the logo grid, doc y 11860) scrolls in: from marker top = vh (900) to vh − 240. Measured .833 @11000, .424 @11100, .02 from 11200 on.
- **client-logotypes** (20, 11860.1, 1400x900), `position:sticky; top:0; z-index:1`: a 4x3 grid of cells **340x225** at x 40/380/720/1060, y 11973 / 12198 / 12423. Logos are `object-fit:contain`, centred.
  - Logo sizes (row-major): 160x113, 208x146, 160x113, 112x79 / 112x79, 144x101, 112x79, 144x101 / 128x90, 112x79, 128x90, 102x72.
  - Files in assets.json, in order 6KUB…, NIbu…, 6QEz…, yJJE…, av9j…, kurr…, RgTo…, Rsaj…, 3Y1x…, qc6W…, G901…, WLPK….
  - **Logo hover** (Partner Logo): image scale **→1.6×** (measured from a resting 1.239 on the hovered cell up to 1.6), spring 0.4 bounce 0. The resting 1.239 contradicts the static map (scale 1); see caveats. The cursor stays Black.
- Spacer section 297. Then **Image** (20, 13057.1, 1400x900, `padding:0 20px`, `overflow:clip`): img `mMQQ0cRO…` **1360x1200**, object-fit cover.
  - **Parallax:** `translateY = −300 + (scrollY − (imageTop − vh))/6`, clamped to [−300, 0], i.e. −300 at container top = viewport bottom and 0 when the container bottom reaches the viewport top (an 1800px range).
  - Measured: −292.9 @12200, −242.9 @12500, −159.5 @13000, −76.2 @13500, 0 @14000.
- Phone: no sticky heading; logos 2-column; image 370x546.4.

### 4.8 The Process (y 13957.1 → 14912.9; h 955.8 / 997.4 / 1053 / 1255.1)
- `padding:200px 20px 0`, gap 64.
- H2 "The Process" (40, 14157.1) + p (w 400) "Honest impressions from the teams we’ve collaborated with across brand and digital work."
- **Timeline** (20, 14392.3, 1400x309.4, `padding:32px 0 56px`, gap 13):
  - background grid of 12 "Line" columns (76.7 wide, gap 40, opacity 0.3, full height; light vertical lines);
  - "Numbers" row 01…12 (14/700 #999 uppercase, each 116.7 wide, at y 14679.3);
  - 4 bars ("Time Block") `bg #000`, height 45.6, `padding:10px 18px`, label 16/500 #fff:
    - Discovery x 40 w 310
    - Strategy x 273.3 w 368.3
    - Design & Build x 506.7 w 660
    - Launch & Beyond x 973.3 w 426.7
    - rows at y 14424.3 / 14482.9 / 14541.5 / 14600.1 (pitch 58.6).
- **Bar entrance (on view, per bar):** width from 1px (left-anchored) → full. **Tween 1.2s cubic-bezier(.4,0,0,1)** *(code `Lu`, matches samples: 25% @277ms, 64% @410, 80% @544, 92% @744, 98.7% @1010)*. Label chars move x −20→0 over the same time. Numbers sit at opacity .5 during the entrance.
- **List** (4 columns of 350): H5 names (word rise y200; startDelay .1 / .2 / .3 / .4 for 1–4) + p 14/500/22.4 #444 (w 248). Copy is in copy-1440.json.
- Tablet: 6 grid columns, list 2x2. Phone: stacked.

### 4.9 Client reflections (testimonials) (y 14912.9 → 15966.1; h 1053.2)
- `padding:200px 20px 0`, gap 80.
- Headline 2/8/2: H2 "Client reflections" at x 273.3 + p (w 400) "Honest impressions from the teams we’ve collaborated with across brand and digital work."
- **Slideshow** (20, 15372.1, 1400x594): custom component:
  - one slide visible; **autoplay every 10s**;
  - change = wrapper `opacity 1→0` (CSS `transition: opacity .3s ease-in-out`), swap at 300ms, `opacity 0→1`;
  - prev/next buttons **52x52** images (`Y2CbMz…svg` prev, `dhOQ…svg` next) at top-left `left:20`, gap 12 → (40, 15372.1) and (104, 15372.1). Buttons are transparent, no hover.
- Slide layout (row, 2/3/1/5 cols):
  - number "/" + "1".."5" H3 64/700 #eee at the bottom-left (40, 15889.3);
  - image 310x**594** (x 273.3, object-fit cover) with an **Image Reveal** (mask `linear-gradient(90deg, #000 0%, transparent 0%)` → `100%/100%`, left-to-right wipe, tween 1.2s cubic-bezier(.6,0,.4,1), on view);
  - quote H4 48/500 at x 740 (w 543.3); name p 20/500 #000; company p 14/500 #999.
- Slides:
  1. Clara Jensen, Vela Studio
  2. Jonas Berg, Arcton Labs
  3. Sophie Adler, Norrhaven Collective (repeats quote 1)
  4. Markus Lehn, Lumen Technologies
  5. Daniel Weiss, Helio Projects
  - Quotes are verbatim in copy-1440.json.
- Tablet/phone: horizontal carousel (all 5 laid out, 970px pitch at 1000) with 5 dot buttons.

### 4.10 Pricing (y 15966.1 → 18268.5; h 2302.3)
- 6/6 split.
- **Left Sticky Container** (700x900, sticky, `justify-content:flex-end; padding:0 20px 40px; gap:64`) contains:
  - H2 "Pricing" (40, 16189.7);
  - **Toggle** (233x40, bg #f7f7f7, radius 999, padding 4) with "Monthly" / "Yearly –20%" (14/500, 112.5 wide each) and a black pill;
  - p "Choose a plan that fits your pace, your team, and your goals. From startups to scaling brands, our monthly options give you the design support you need." (w 400);
  - bottom: caption "Not sure where to start? Let’s figure it out together." + underline CTA **"Let's Talk"** → `./contacts`.
- **Toggle:** default = **Yearly**. The pill slides `right:4 ↔ left:4`, spring 0.4 bounce 0. Label colours cross-fade: selected white, other black; measured 380ms to finish.
- Right: 3 **Price Cards** (x 740, w 660, pitch 644.8; separated by a light rule visible in screenshots). Each card has:
  - H3 name;
  - p #999 description;
  - 2 columns of 3 check items (16/500 #000, check-circle icon 16px, x 772 / ~1012);
  - "STARTING FROM" label;
  - price (Number Flow, 56/700, prefix "$", thousands separators);
  - "/month" #eee;
  - strikethrough old price.

  | package | description | yearly (default) | monthly |
  |---|---|---|---|
  | Foundation Package | For early-stage companies or brands in need of a clear visual foundation. | $5,200 (strike $6,500) | $6,500 |
  | Studio Package | For websites, platforms, or digital-first brands. | $6,400 (strike $8,000) | $8,000 |
  | Signature Package | For teams that want everything aligned, from identity to digital presence. | $11,200 (strike $14,000) | $14,000 |

  Items: Foundation = Discovery session, Brand direction, Logo & mark | Visual system, Color & typography, Basic brand guidelines. Studio = UX structure & sitemap, UI design, Component system | Responsive layouts, Interaction & motion direction. Signature = Brand identity, Digital design, Visual language | Motion direction, Guidelines.
- Price change animates digits by rolling (NumberFlow, spring 0.75 bounce 0 default). **Not sampled.** I couldn't read the shadow-DOM digits, and whether the strike hides on Monthly wasn't verified.

### 4.11 Studio Notes (y 18268.5 → 19447.9; h 1179.4)
- 2/8/2.
- Left: sticky "Button Sticky Container" (233.3x900, `justify-content:flex-end; padding:0 20px 40px`) with caption "Our thoughts on how brands, systems, and stories find their form." (w 193.3) + underline CTA **"Read All"** → `./feed`.
- Centre: H2 "Studio Notes" (273.3, 18468.5), then 2 cards (426.7 wide, x 273.3 / 740), each with an 80px white sticky bar on top (z 1):
  - **image link** 426.7x**566.4** (object-fit cover, Image Reveal wipe 1.2s on view, cursor Big Black Arrow Right, no zoom);
  - date p 14/500 #999 ("April 26, 2026" / "March 29, 2026");
  - H6 title;
  - p excerpt (w 384).
- Cards:
  - `./feed/the-logic-of-emotion` "The Logic of Emotion", excerpt "In design, clarity isn’t about simplicity for its own sake. It’s about removing what doesn’t serve meaning — until what remains feels inevitable."
  - `./feed/precision-over-perfection` "Precision Over Perfection", "Design isn’t about getting everything right — it’s about making the right things matter."

### 4.12 Let’s Talk (contact form) (y 19447.9 → 21155.7; h 1707.8)
- 2/6/4 split.
- Left: sticky (233.3x900) with H4-styled caption "Do you feel ready to become part of our growing team?" (14/500 #757575, w 160) + underline CTA **"Join Us"** → `./studio#career`.
- Centre: H2 **"Let’s Talk!"** (273.3, 19647.9, 160/800), then a **sentence form** (20/500/32 #000):
  - "Hey Möbius®, my name is [Your Name *] and I’m writing from [Company Name] . I’m getting in touch because I’d like to [Message *] My budget is roughly [Select a Budget *] and I'd like to start [Choose a Timeframe *] . You can contact me at [Email *] . Looking forward to your reply!"
  - Fields: text 404x32 with grey bg in screenshots and placeholder #999; textarea 660x240 (`padding:18px`); selects 222x68 / 462x68 (`padding:18px`, #999). Options: Budget "$5,000 - $10,000 / $10,000 - $20,000 / $20,000 +"; Timeframe "As soon as possible / Next month / Whenever you’re available".
  - Hidden honeypot inputs exist (website, company, message, subject…, 0x0). Don't render them visibly.
  - Legal line "By submitting, you agree to our Terms and Privacy Policy." (14/500 #999; Terms/Privacy are bold #000 links).
  - Submit **"Get in Touch"** (pill, 200x48, Button Contact Form = same hover as Button A, but hover padding is 8 104 8 0).

### 4.13 FAQ (y 21155.7 → 22626; h 1470.3)
- 5/7 split.
- Left sticky (583.3x900): H6 "Questions, answered." top; bottom caption + underline CTA **"About us"** → `./studio`.
- Right: accordion items (816.7 wide); index "A" H4 48/500 in the 116.7 column; question H4 at x 740 (w 660); answer p 16/500/25.6 #444 (w 480). A **plus icon** (Phosphor Plus, 32px) sits in the left column. **Open = rotated 135° (×)**; closed = 0°.
- Item heights: open 233.6 / closed 115.2. First item open by default. Clicking toggles.
- Transition **tween 0.8s cubic-bezier(.6,0,.4,1)** for height, icon rotation and answer fade. Measured close: rotate 135→90 @355ms → 20 @556 → 0 @806; height 234→115.
- Below the list (x 740): p "Still have questions? Let’s talk about your project and how we can help." (w 320) + pill **"Ask a question"** → `./contacts`.
- Questions/answers are verbatim in copy-1440.json:
  - How do you start a new project?
  - Can you help with strategy, not just design?
  - How long does a typical project take?
  - What if I don’t know exactly what I need?
- The cursor over FAQ rows is **Hidden**.

## 5. Smooth scroll (Lenis) and scroll behaviour
- Framer Lenis component *(code)*: `new Lenis({ smoothWheel:true, duration: intensity/10 = **2.0s**, infinite:false, orientation:'vertical', autoRaf:true, autoToggle:true, anchors:true, allowNestedScroll:true, syncTouch:false, stopInertiaOnNavigate:true })`. Lenis default easing is `t => min(1, 1.001 − 2^(−10t))`.
  - `html` gets classes `lenis lenis-autoToggle` and `style="overscroll-behavior-x:none"`.
- Measured one wheel of deltaY 100 (scrollY): 6 @48ms, 25 @111, 50 @226, 67 @343, 80 @493, 89 @659, 94 @826, 97 @993, 99 @1226, 100 @1509. Five wheels of 100 in 80ms → 500 total, 79% at 400ms.
- Touch uses native scrolling.
- Anchor links `./#awards` and `./#client-logotypes` scroll via Lenis anchors. The ids exist on the Awwards section and the logo grid.

## 6. Shared interactive components (hover, desktop ≥1200; touch variants have none)

### 6.1 Button A — black pill CTA (Our Awards / Our Clients / Our Work / Meet the Team / Ask a question; Get in Touch uses the same with bigger padding)
- `a{display:flex; gap:16; padding:8px 58px 8px 18px; overflow:clip; height 48}`. Label p 20/500/32 **#fff**.
- Backdrop `section{position:absolute; inset:0; background:#000; border-radius:999px}`.
- Arrow 1: Phosphor ArrowRight 16x16 white at `right:14px`, vertically centred. Arrow 2: same at `left:-32px` (hidden by the clip).
- Widths: Our Awards 179.7, Our Clients 175.3, Our Work 160.2, Meet the Team 208.7, Ask a question 206.7.
- **Hover** (spring **0.4** bounce 0):
  - padding → `8px 76px 8px 0` (label slides left 18px);
  - label colour → **#000**;
  - Backdrop collapses to a **28x28 circle** at `right:1px; top:10px; bottom:10px`;
  - Arrow 1 → `right:-120px` (exits right);
  - Arrow 2 → `right:7px` (sits inside the circle).
  - Measured backdrop: 140x42.8 (+50ms), 70.4x33.6 (+120), 31.7x28.5 (+250), 28.2x28 (+400). Label colour black by +50ms. Leave reverses (label back to white by ~400ms).
- Cursor over all CTAs = **Hidden**.

### 6.2 Button B — underline text CTA (Get Started / Let's work together / Our Work / Let's Talk / Read All / Join Us / About us)
- `a{display:flex; padding:2px 40px 2px 0; overflow:clip}`; label H6 26/500.
- "Arrows" row is absolute `left:-40px; right:0; height:100%; justify-content:space-between` with two ArrowRight icons (11% width × 64% height of the link, e.g. 23.1x25.9). The first is hidden left, the second visible at the right end.
- "Line" is absolute `left:-1px; bottom:0; height:2px; width:1px; background:#000`.
- **Hover** (spring **0.6** bounce 0):
  - padding → `2px 0 2px 40px` (label slides right 40);
  - Arrows → `left:0; right:-40px` (left arrow slides in, right arrow exits);
  - Line → `left:-1px; right:0` (full width).
  - Measured "Get Started": line 26 (+50ms), 87 (+120), 152 (+250), 169 (+400), 171.4 (+700); label x +40.
- On appear (in view), the Arrows row rises `y:30→0`, spring 0.8, **delay 0.6** *(code)*. The label chars rise (char effect).

## 7. DESKTOP FOOTER (≥1200) (y 22626 → 23543.9; h 917.9 @1440; 886.8 @1280)
- `footer` "Desktop": bg #fff, `display:flex; flex-direction:column; justify-content:space-between; padding-top:200px`.
- **Name row** (0, 22826, 1440x228.3), `padding:0 40px 0 30px`, row gap 40:
  - wordmark fit-SVG "Möbius®" (`viewBox 0 0 924 180`, 800, ls −0.05em, lh 75%, #000) at (30, 22826, **1172.2x228.3**);
  - "© 2018-26" h5 32/700/41.6/−0.32 at (1242.2, 22826, 157.8x41.6), right edge 1400. YY is the current year via the code override.
  - 1280: wordmark (30, 22099.8+200, 1012.2…) scales with width.
- **Blinds wordmark reveal (scroll-linked):** over the wordmark, the "Blinds" box (absolute `top:0; bottom:-3px; left:0; right:-17px` → 1189.2x231.3, z 1) holds **6 equal horizontal slats** (`flex:1`, ≈38.55 tall).
  - Each slat contains a **white (#fff) bar** anchored to its bottom whose height goes **100% → 0%** as the slat's own scroll progress goes 0 → 1, with offset `["start 75%", "end center"]`: progress 0 when the slat top is at 75% of vh, 1 when the slat bottom is at 50% vh.
  - The wordmark appears top-to-bottom, slat by slat.
  - Measured slat heights: @22200 [31.4, 37.1, 38.5…]; @22300 [16.8, 22.5, 28, 33.7, 38.6, 38.6]; @22400 [2.2, 7.9, 13.4, 19.1, 24.7, 30.4]; @22500 [0, 0, 0, 4.5, 10.1, 15.8]; @22644 (page bottom) all 0.
  - Not rendered on tablet/phone.
- 120px spacer.
- **Footer Links row** (0, 23174.3, 1440x195.2), `padding:0 20px`, 6/3/3:
  - **Newsletter column** (20, w 700; `padding:0 20px; justify-content:space-between`):
    - p 16/500/25.6 #444 (w 400): "Join our studio newsletter for thoughts on design, brand systems, and creative direction — sent occasionally, when there’s something worth saying.";
    - **form** (40, 23311.1, **480x58.4**), `overflow:hidden`, cursor Hidden, light grey field in the screenshot. Email input placeholder **"YOUR EMAIL HERE"** 14/700/22.4 (placeholder #999-ish) at (58, 23329.1, 444x22.4) (left padding 18);
    - **submit button 24x40** at (480, 23320.3), overflow clip, holding two ArrowRight 24px icons (regular weight, #000): icon 1 at `top:8px` (centred), icon 2 at `top:48px` (= 150% − 12, one button height below).
    - **Hover** (spring **0.6** bounce 0): icon 1 → `top:−32px`, icon 2 → `top:8px`, so both slide up 40px. Measured icon 1 y: 684.3 → 678.4 (+50ms) → 663.9 (+120) → 648.8 (+250) → 645 (+400) → 644.3 (+700). Leave reverses (683.7 @+400).
    - States *(code)*: Disabled (opacity .5), Loading (icon → Spinner rotating 360° every 4s linear), Success (CheckCircle), Error (Warning).
  - **SOCIAL** column (720, w 350, `padding:0 20px`; gap 32 between label and links): label "SOCIAL" (14/700 #999, w 310) at y 23174.3, then links column gap 8: **LinkedIn**, **X (Twitter)**, **Instagram** (all → `https://framer.link/drukarov`), h5 32/700/41.6, at y 23228.7 / 23278.3 / 23327.9 (pitch 49.6). Widths 123.6 / 154.8 / 147.4.
  - **LEGAL** column (1070): label "LEGAL"; **Privacy Policy** → `./legal/privacy-policy` (203.4), **Terms of Service** → `./legal/terms-of-service` (246.4), **404** → `./404` (61.9).
- **Footer link (Button C)**: `a{display:flex; padding:0; overflow:clip; cursor:pointer}`, h5 text, plus "Line" `position:absolute; left:-1px; bottom:0; height:2px; width:1px; background:#000; z-index:1`.
  - **Hover → Line `left:-1px; right:0`** (grows to full width + 1), layout **spring 0.6 bounce 0**. Measured LinkedIn line width: 20.6 (+50ms), 64.5 (+120), 111.2 (+250), 122.6 (+400), 124.6 (+700). Leave shrinks back (61.1 @+120, 3 @+400, 1 @+1000).
  - No colour change. Cursor **Hidden**.
  - Appear: link text chars rise y50 → 0, spring 0.8, stagger .025, startDelay .2, threshold .5, on view (desktop).
- 120px spacer.
- **Bottom row** (0, 23489.5, 1440x54.4), `padding:0 20px 32px`, 6/6:
  - Left "Created By" (x 40, gap 4): rolling-letter link **"FRAMER"** → `https://framer.link/drukarov` (59.1x16.1, 14/700 #000), "TEMPLATE HANDCRAFTED BY" (14/700/22.4/0.28 #999 uppercase), rolling-letter link **"ANTON DRUKAROV"** → `https://templatoria.com/` (134.5x16.1, #000).
  - Right (x 740): "© 20" + "26" + " MÖBIUS. ALL RIGHTS RESERVED." (14/700 #999 uppercase; source "Möbius. All rights reserved.").
  - The rolling letters are the nav mechanism (clip-path `inset(0 -8px)`, 0.4s cubic-bezier(.8,0,.4,1), stagger .03).
- The fixed clock "BERLIN, DE  hh:mm AM" stays visible bottom-right over the footer (difference layer).

## 8. Cursor variants on home (beyond CLONE_SPEC: Black / Big Black Arrow Right / Hidden)
| variant | where on home | look |
|---|---|---|
| **Play** (`ouofdt`) | Reel Video Container | Background dot grows to **120px** black; Phosphor **Play (fill)** 40x40 white fades in. Spring 0.4 (measured 48 @50ms, 93 @120, 118 @250, 120 @400). |
| **White** (`1htczjg`) | video lightbox overlay ("Sound On Play" layer) | Background becomes **#fff** (20px dot), for use over the black backdrop. |
| **Hidden** (`15fzu3i`) | all Button A/B/C CTAs, footer links, newsletter form, FAQ rows | 2px, opacity 0 (as in CLONE_SPEC). |
| **Big Black Arrow Right** (`97rtuy`) | hero stack link, founder cards, Studio Notes images | as CLONE_SPEC (120px + ArrowRight). |
| **Drag** (`IjA494eWi`) | not used on home (exists in the component: ArrowsHorizontal 32px white on a 120px dot) | — |

Cursor follow on home uses spring {stiffness 340, damping 60, mass 1} (`ep`), the same as /work.

## 9. Links / shared content
- **Home has no project cards linking to `/work/<slug>`.** All links on home: `./contacts`, `./#awards`, `./#client-logotypes`, `./work` (hero stack, "Our Work" ×2, nav), `./studio` (founder cards, Meet the Team, About us), `./studio#career`, `./feed`, `./feed/the-logic-of-emotion`, `./feed/precision-over-perfection`, `./`, `./legal/privacy-policy`, `./legal/terms-of-service`, `./404`, `https://framer.link/drukarov`, `https://templatoria.com/`. The hero card stack shows 4 CMS project images, but the whole stack links to `./work`.
- Shared components likely reused on other pages: Footer (Desktop/Tablet/Mobile variants), Button A, Button B, Button C, Contact Form + Button Contact Form, Blog Section (Studio Notes), FAQ Section, Testimonials Section, Pricing Section, Team Card, Principles-Services Card, Partner Logo, Custom Cursor, Navbar, Clock (in the nav layer on every page, desktop). The template's "CTA block" equivalent is the Let’s Talk contact-form section + FAQ.

## 10. Not measured / caveats
- **Loader timing offsets** depend on Framer hydration (cold load: stack In B ~1000ms after the hero appear; client-nav: ~200ms). Section 1 gives both.
- Hero stack **return-to-entrance threshold**: exit confirmed between scrollY 25 and 40; re-entry confirmed at 0, but the exact upper bound wasn't bisected.
- Pricing **NumberFlow digit roll** (shadow DOM) timing, and whether the strikethrough price hides in Monthly: not sampled. The values come from code.
- Testimonial slide change: next-button click produced no measurable change in my sampler (the overlapping hidden "measure" copies were sampled). The mechanism (0.3s ease-in-out fade-out → swap → fade-in, 10s autoplay) is from code.
- Partner logo resting scale: the hover sampler read 1.239 at rest → 1.6 on hover, but the static scroll map read scale 1 on the same grid. The hover target is certain; the resting value is not.
- Lightbox player controls (sound toggle, play/pause variants) and close-button hover: not measured.
- Services statement appear and the per-word H2/H6 char effects: values from code (y200 / y50 rises, springs, stagger .025). Only a few frames were confirmed in the scan.
- Tablet/phone boxes for sections 4.x are summarised only. Full per-element boxes are in `home-raw/dom-1000.txt` and `dom-390.txt`. Tablet/phone have no text/scroll effects (they are explicitly disabled in code), no hero animation, no Scramble scatter, no tickers on phone, and no Blinds.
- Founders "Backdrop" `rgba(0,0,0,.5)` is in the DOM at rest on desktop, but the rest-state screenshot shows undarkened photos. Treat the backdrop as hover-only (opacity 0 at rest).

## 7b. MAIN FOOTER: all four sizes, and which routes use which variant

**Component:** shared `Footer` (`framer-tB0pW`), variants **Desktop / Tablet / Mobile**. The home page picks the variant by breakpoint: ≥1200 Desktop, 810–1199 Tablet, ≤809 Mobile. The footer on /work is the same component, but **/work renders the Tablet variant even at 390** (that page overrides the variant). So the two "variants" the coordinator saw are really Tablet and Mobile.

| route | 1440 | 1000 | 390 |
|---|---|---|---|
| `/` (home), `/studio`, `/contacts`, `/feed/<slug>` (e.g. beyond-function), `/legal/privacy-policy`, `/404` | Desktop (917.9 tall, pad-top 200) | Tablet (1020.2, pad-top 160) | **Mobile** (1187.8, pad-top 120) |
| `/work` | **no footer** (canvas page) | Tablet | **Tablet** (948.5 tall: wordmark 167.6x32.6 at x 25 and © 28px at x 222.6 on the same row) |
| `/feed` (index) | **no footer** at 1440 | Tablet | Mobile |

(The rows were checked with `footer` data-framer-name plus wordmark/© boxes on each route at 390/1000/1440. At 1440, /work and /feed have no `<footer>` in the DOM.)

All colours: footer bg #fff; text #000; labels #999; newsletter field bg **#f7f7f7**; placeholder #999. Font: Inter Display stack.

### Desktop (≥1200). Values @1440 / @1280 (doc Y is relative to footer top F: 1440 F=22626, 1280 F=22099.8)
- footer `display:flex; flex-direction:column; justify-content:space-between; align-items:center; padding:200px 0 0`. Height 917.9 / 886.8.
- **Name row** at F+200: `padding:0 40px 0 30px`; inner row gap 40, align flex-start.
  - Wordmark SVG (viewBox 924x180, "Möbius®", 800, ls −0.05em, lh 75%, #000): **(30, F+200, 1172.2x228.3)** / (30, F+200, 1012.2x197.2). Width = vw − 30 − 40 − 40 − 157.8.
  - Blinds overlay: 1189.2x231.3 / 1029.2x200.2 (see §7).
  - "© 2018-26" h5 **32/700/41.6/−0.32** #000: (1242.2, F+200, 157.8x41.6) / (1082.2, …). Right edge = vw − 40.
- Spacer 120.
- **Footer Links** at F+548.3 (1440) / F+517.2 (1280): row `padding:0 20px`; columns 6/3/3 (700/350/350 @1440; 620/310/310 @1280); each column `padding:0 20px`.
  - Newsletter column (`justify-content:space-between`, height 195.2):
    - p 16/500/25.6 #444 w 400 (3 lines, 76.8) at (40, +0);
    - **field** 480x58.4 at (40, +136.8): wrapper div bg #f7f7f7, `padding:18px`, radius 0. Input 444x22.4 at x 58, text **14/700/22.4**, placeholder "YOUR EMAIL HERE" #999.
    - **submit button 24x40** at x 480 (16px inside the field's right edge), vertically centred (y +146). Contains 2 ArrowRight 24px icons (regular, #000) at top 8 / 48.
  - SOCIAL (x 740 / 660) and LEGAL (x 1090 / 970), each `padding:0 20px`, inner column gap 32:
    - label 14/700/22.4/0.28 #999 uppercase at +0;
    - links column gap 8 at +54.4. Links are h5 **32/700/41.6/−0.32** #000, each **41.6 tall**, pitch 49.6 (y +54.4 / +104 / +153.6).
    - Widths: LinkedIn 123.6, X (Twitter) 154.8, Instagram 147.4; Privacy Policy 203.4, Terms of Service 246.4, 404 61.9.
    - Each link has a Line `left:-1; bottom:0; 2x1 #000` (at y +39.6 inside the link).
- Spacer 120.
- **Bottom row** (height 54.4) at F+863.5 / F+832.4: `padding:0 20px 32px`; 6/6, `align-items:flex-end`.
  - Left (x 40, gap 4): "FRAMER" link (59.1x16.1), "TEMPLATE HANDCRAFTED BY" (x 103.1, 208.3x22.4, #999), "ANTON DRUKAROV" link (x 315.4, 134.5x16.1). The links are 14/700 #000 rolling letters.
  - Right: "© 20" (x 740 / 660) + "26" + "MÖBIUS. ALL RIGHTS RESERVED.", 14/700/22.4/0.28 #999 uppercase. Bottom padding 32.
- **Hovers (desktop only):**
  - **Link Line:** width 1 → full (`left:-1; right:0`), spring 0.6 bounce 0. Measured on LinkedIn: 20.6 / 64.5 / 111.2 / 122.6 / 124.6 px at +50 / 120 / 250 / 400 / 700ms. It retracts on leave (61.1 @120, 3 @400). No colour change; cursor Hidden.
  - **Arrow button:** icon 1 top 8 → −32 and icon 2 top 48 → 8 (both −40px), spring 0.6 bounce 0. Icon 1 y offset measured: −5.9 (+50ms), −20.4 (+120), −35.5 (+250), −39.3 (+400), −40 (+700). It reverses on leave.
  - Appear: link text chars rise y50, spring 0.8, stagger .025, delay .2, threshold .5 (desktop only).

### Tablet (810–1199) @1000 (F = footer top; home F=19049.5, height 1020.2)
- `padding-top:160px`.
- Name row at F+160: `padding:0 30px 0 25px`, row **gap 30**. Wordmark **(25, F+160, 767.8x149.6)**; © h5 **30/700/39/−0.3** at (822.8, F+160, 147.2x39), right edge 970. No Blinds.
- Spacer 80.
- Footer Links at F+389.5: **column**, gap 80.
  - Newsletter block `padding:0 30px`, gap 40: p (30, +0, 400x76.8); field (30, +116.8, **480x61.6**). Input 444x25.6 at x 48, text **16/700/25.6**. Button 24x40 at x 470 ("Touch" variant: no hover).
  - Links row at F+647.9: `padding:0 15px`, two columns 485 each (`padding:0 15px`):
    - SOCIAL label at x 30, LEGAL at x 515; label → links gap 24;
    - links are **h6 25/700 (strong) /35/−0.25**, 35 tall, pitch 43.
    - Widths: LinkedIn 96, X (Twitter) 117.8, Instagram 115.4; Privacy Policy 156.8, Terms of Service 189.9, 404 48.4.
- Spacer 80.
- Bottom at F+895.3: **column**, gap 16, `padding:0 15px 64px`, align flex-end... content left: "FRAMER / TEMPLATE HANDCRAFTED BY / ANTON DRUKAROV" row at x 30 (y +895.3); "© 2026 MÖBIUS. ALL RIGHTS RESERVED." at x 30 (y +933.7).
- No hovers (Touch variants).

### Mobile (≤809) @390 (home F=21778.1, height 1187.8)
- `padding-top:120px`.
- Name block at F+120: `padding:0 20px`, **column gap 32**. Wordmark **(20, F+120, 350x68.2)** full width; © h5 **28/700/36.4/−0.28** at (20, F+220.2, 137.4x36.4), **below** the wordmark, left-aligned.
- Spacer 64.
- Footer Links at F+320.6: column gap 80.
  - Newsletter `padding:0 20px`, gap 40: p (20, +0, 350x102.4, 4 lines); field (20, +142.4, **350x61.6**, #f7f7f7, padding 18); input 314x25.6 at x 38, 16/700; button 24x40 at x 330.
  - Links section at F+604.6: column gap 48, `padding:0 10px`; Social then Legal stacked, each container `padding:0 10px` (text x 20); label → links gap 24.
  - Links are **h6 24/700 (strong) /33.6/−0.24**, 33.6 tall, pitch 41.6. Widths: 92.1, 113.1, 110.8; 150.5, 182.3, 46.4.
  - SOCIAL label y +604.6, LEGAL label y +815.8.
- Spacer 64.
- Bottom at F+1043: column gap 16, `padding:0 10px 64px`.
  - "FRAMER" + "TEMPLATE HANDCRAFTED BY" on one row (x 20 / 83.1), "ANTON DRUKAROV" wraps to the next line (x 20, +26.4);
  - "© 2026 MÖBIUS. ALL RIGHTS RESERVED." at (20, F+1101.5).
- No hovers. No Blinds.

### /work's Tablet-at-390 rendering (for contrast)
- Footer 390x948.5, pad-top 160.
- Wordmark (25, F+160, **167.6x32.6**) and © 28px at (222.6, F+160, 137.4x36.4) on the same row: Tablet structure with 25/30 insets squeezed to 390.
- This is what CLONE_SPEC §9 documents. Every other route uses Mobile at ≤809.

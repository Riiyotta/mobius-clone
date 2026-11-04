Source: https://mobius.framer.website/studio

# /studio — build spec

Recon run 2026-11-04 with headless Chromium at DPR 1. Values come from computed styles and rects, per-rAF sampling, or the page modules (`fQzlOmmBYu6…EColfz8V.mjs` = page, `XL3JUDILf` = Team Card + Principle Item, `p2KKNkdQo` = "Button B", `XOF_jk7P8` = "Button A", `IW5FwLyQy` = Project Card, `InfiniteTicker.UwsirTup.mjs`, `Lenis.DvMIc7tT.mjs`, `shared-lib` = staggered-text component). Anything marked *(code)* was read from source and not sampled.

Out of scope here (see `/Users/riyaghosh/portfolio/Möbius/CLONE_SPEC.md`):
- Nav: the fixed difference-blend layer, rolling letters and the MENU overlay below 1200.
- Custom cursor: the base dot.
- Spring maths.
- Footer.

**Footer:** identical to the home footer at every width, so build nothing page-specific. Measured boxes: Desktop `footer` with padding-top 200 and height 917.9 at 1440 / 886.8 at 1280; Tablet padding-top 160, h 1020.2; Mobile padding-top 120, h 1187.8. It starts at y 8743 / 8465.2 / 7903 / 8662.2. Its "Blinds" wordmark reveal is scroll-linked, as on home.

**Nav clock:** shared, and not covered in CLONE_SPEC. It lives in the nav difference layer at ≥1200 only, box (1258.8, 845, 141.2x23) at 1440 and (1097.7, 745) at 1280, i.e. right edge = vw−40, bottom = vh−32. Two texts, both 14/700/22.4, ls 0.28px:
- "BERLIN, DE" in rgb(102,102,102), which renders as #999 on white through the difference blend.
- The live time "11:42 AM" (h:mm AM/PM, Europe/Berlin) in #fff, which renders black.
- 4px gap between them.

Assets: `/Users/riyaghosh/portfolio/Möbius/.recon/specs/studio-assets.json`. Reference screenshots: `/Users/riyaghosh/portfolio/Möbius/.recon/shots/studio-<w>-<scrollY>.png`.

---

## 0. Page frame, grid, breakpoints

- Breakpoints: Desktop ≥1200, Tablet 810–1199.98, Phone ≤809.98. Typography presets do not change between 1200 and 1599: every 1280 value equals the 1440 value.
- Page root: `#fff`, flex column, `overflow:clip`. Document height: 1440x900 → 9661, 1280x800 → 9352, 1000x800 → 8923, 390x844 → 9850.
- **Column grid** (desktop): content width `C = vw − 40` (20px side padding), split into 12 equal columns with **no gutters**. `col = C/12` = 116.67 at 1440, 103.33 at 1280. Each text block sits in a column span and has its own `padding: 0 20px`.
  - Tablet: side padding 15, so `C = vw − 30` (1000 → 970), and blocks use `padding: 0 15px`.
  - Phone: side padding 10 (`C = vw − 20`), blocks use `padding: 0 10px`. Some phone sections use 20px instead; noted where it applies.
- Colours:
  - Text: #000. Body #444. Muted label #757575 (token 3f454fb8). Grey #999. Hairline #eee.
  - Input / light fill #f7f7f7. Card fallback bg #999.
  - Index letters #eee. Ticker ghost text #f7f7f7.
- Font everywhere: `"Inter Display", "Inter Display Placeholder", sans-serif`, at weights 500/700/800 (font files in assets.json).
- Body paragraph preset (all widths): 16/500/25.6, ls normal, #444.

## 1. Smooth scrolling (desktop only)

- Lenis 1.3.25, `intensity 20` → options `{ duration: 2, easing: t => Math.min(1, 1.001 - 2**(-10*t)), smoothWheel: true, anchors: true, allowNestedScroll: true, autoRaf: true }`. Lenis' default `lerp` is ignored because duration and easing are set *(code)*. Every wheel event retargets and restarts a 2s expo-out from the current position.
  - Measured, one `deltaY:+100` wheel: scrollY 16 @66ms, 29 @114, 41 @164, 50 @213, 58 @263, 70 @364, 82 @514, 90 @663, 94 @813, 97 @1013, 99 @1214, 100 @1516.
  - Identical on /contacts.
- Anchor links are smooth too. Clicking "Join Us" (`./studio#career`) scrolled 0 → 5984 (Career top) as 1507 @100ms, 2998 @216, 4406 @401, 5242 @617, 5616 @815, 5803 @1016, 5957 @1517, 5984 @2000. That is the same 2s expo-out.
- Tablet/phone: no Lenis (`window.lenis` undefined; the component is `hidden` below 1200). Native scroll.

## 2. Entrance (load) — desktop, t = ms after navigation start

- Nav wrapper: as documented in CLONE_SPEC (opacity 0.001 → 1, scale 1.6 → 1, 0.8s spring). Started at t≈480 in this run.
- Intro paragraph (staggered-text component, `staggerBy:"lines"`, `delay 120`, `duration 600`, `initialDelay 100`):
  - Each word is an `inline-block; overflow:hidden; vertical-align:bottom` span holding an inner span.
  - The inner span goes `transform: translateY(100%) → translateY(0%)` via a **CSS transition**: `transform 600ms cubic-bezier(.4,1,.4,1) <lineIndex*120>ms`.
  - It is triggered by `useInView(once, margin "-10% 0px")` followed by `setTimeout(initialDelay)`.
  - Lines are computed from the words' `getBoundingClientRect().top`: a word starts a new line when its top differs by more than 5px.
  - Paragraphs split on `\n` and are stacked as a flex column with gap 32 (`paragraphGap`).
  - Measured: line 0 starts moving at t≈965 (≈485ms after the nav starts), line 1 at ≈1085, line 2 at ≈1200, line 3 at ≈1320. Each takes ~600ms; 25.6px → 0.
- "Do you feel ready…" (same component, 14px, `initialDelay 600`, line delay 120): line 0 starts at ≈1465, line 1 at ≈1585, line 2 at ≈1700. 23.8px → 0.
- H1 "We are Möbius®": static (no split, no animation).
- "Join Us" button (Button B, desktop variant):
  - Its Arrows row has an appear effect: `y 30 → 0`, spring 0.8 s bounce 0, delay 0.6, once, threshold 0 *(code)*.
  - Its label characters: `y 50 → 0` per character, spring 0.8 bounce 0, stagger 0.025, startDelay 0.2, trigger onInView, threshold 0.5 *(code)*.
  - Text and arrows are clipped by the button's `overflow:clip`.
- Team-card names and roles also animate on mount (onMount, so off-screen at load): name characters `y 200 → 0` (spring 0.6, bounce 0, stagger 0.025); role opacity 0.001 → 1 (spring 0.6, delay 0.4) *(code)*.
- Reduced motion: the staggered-text component is static on Safari when `disableForSafari` is set (intro and "Do you feel" have it set; the quote and principles do not).

## 3. Sections — DESKTOP (1440x900; 1280x800 in braces where it differs)

All boxes are `[x, y(document), w, h]`.

### 3.1 Intro `[0,0,W,911.9]` — row, `padding 0 20`, overflow clip

1. **Cursor Image Trail** layer: `position:absolute; z-index:2`, box `[0,0,1439,594]` {1279x528}. It covers the top of the intro, so trail images paint **over** the H1.
   - Every `distance > 163.45px` of mouse movement inside the layer (frequency 10 → `200 − 9*199/49`) spawns a 300x400 div centred on the pointer: `background-image` cycled in order through the 6 trail images, `background-size: contain`, position center, no-repeat, pointer-events none. The first move after mouseenter always spawns.
   - Enter: opacity 0 → 1, tween 0.4s `cubic-bezier(.44,0,.56,1)`, scale 1, no blur.
   - After 1s (`visibleFor 1`) it switches to exit: opacity → 0 with the same tween. The node is removed after 10s.
   - Measured: fully visible at +~360ms after spawn; fade-out begins at +1000ms and reaches 0 at ~+1350ms.
   - Images preload once the layer is ≥10% in view.
2. **Sticky Section**: 2 cols (233.3 {206.7}) wide, `position:sticky; top:0; height:100vh; z-index:1`.
   - Inside it, the Button Container: flex column, `justify-content:flex-end`, gap 64, `padding:0 20px 40px`.
     - H4 "Do you feel ready to become part of our growing team?": 14/500/23.8 (170%), ls 0, #757575, width 160, 3 lines. Box `[40,684.2,160,71.4]` {`[40,584.2]`}.
     - "Join Us" Button B (§5.1), `[40,819.6,124.4,40.4]` {y 719.6}, `href="./studio#career"`, cursor variant Hidden.
   - It stays pinned until the intro ends: it scrolls away from scrollY = 911.9 − vh.
3. **Container**: 8 cols (933.3 {826.7}), flex column, gap 64, `padding:200px 0 40px`.
   - H1 container (`padding 0 20`): H1 "We are" / "Möbius®" (a `<br>` between them) at 160/800/160px, ls −8px (−0.05em), #000, left-aligned. Box `[273.3,200,607.8,320]` {x 246.7}.
   - Paragraph container (`padding 0 20`, gap 24): staggered-text `<p>`, width 480, 16/500/25.6 #444, two paragraphs with gap 32, box `[273.3,584,480,287.9]`. Copy, verbatim:
     > Möbius® is a design studio built around clarity, intention, and craft. We believe that strong ideas come from thoughtful collaboration, steady focus, and an honest approach to problem-solving. Every project starts with understanding — the people, the context, and the possibilities — before anything is designed.
     >
     > We work as a small, dedicated team, shaping brands and digital experiences that feel precise, adaptable, and meaningful. Our goal is simple: create work that lasts, grows, and continues to make sense long after launch. This is how we think, how we build, and how we show up for the people we work with.
4. Right spacer: 2 cols, empty.

### 3.2 Our Team `[0,911.9,W,2451.4]` {h 2210}, `id="our-team"` — flex column, align center, `padding 0 20`

1. **White mask bar**: `<section>` `[20,911.9,C,80]`, `position:sticky; top:0; z-index:3; background:#fff`. It stays pinned for the whole section (until scrollY = sectionBottom − 80) and hides content under the nav as it scrolls by. **The same 80px white sticky bar pattern recurs in §3.4 and on /contacts.**
2. **Text Reveal** block: `[20,991.9,C,100vh]`, `position:sticky; top:0`, row, `padding:120px 20px`, overflow clip.
   - H3 at 64/700/76.8 (120%), ls −2.56px (−0.04em), #000, left. Box `[40,1111.9,1360,460.8]` (6 lines) {`[40,1111.9,1200,537.6]`, 7 lines}.
   - Each word is a separate `inline-block` span with `margin-right:0.3em` (no literal spaces). The **first word has `margin-left: 17%` of the wrapper width** (231.2px at 1440, 204 at 1280).
   - Copy: "Möbius® brings the missing pieces together — the gaps in your brand, the breaks in your story, the places where clarity slips. We connect strategy, design, and digital execution into one continuous system, so nothing feels scattered or out of place." (41 words.)
   - It is pinned from scrollY ≈ 991.9 until 2463.4 (= sectionBottom − vh), then scrolls off.
3. **Team** wrapper: `padding-top:300`. Cards Container `[20,2191.9,C,1171.4]` {h 1030}: row, `justify-content:space-evenly`, align center.
   - Three columns, each 4 cols (466.7 {413.3}), `padding 0 20`, flex column, gap 40, two cards per column:
     - col 1: Jonas Richter / "Founder & Creative Director"; Markus Vogt / "Brand Strategy Manager"
     - col 2: Tobias Keller / "Founder & Strategy Director"; Elias Krüger / "Senior Brand & Digital Designer"
     - col 3: Lena Hartmann / "Operations & Project Manager"; Niko Stein / "Technical Lead"
   - The role string for Jonas in the source is "Founder & Creative Director". It renders on one line.
   - Card size 426.7x565.7 {373.3x495}. Height = width x 1.3259 (image 1393x1847).
   - Untransformed card tops: col1 2191.9 / 2797.7; col2 2191.9 / 2797.7; col3 2191.9 / 2797.7. Columns 1 and 2 carry parallax offsets (§4.2).
4. **Team Card** ("Touch" variant, used at every width):
   - `<a>` with **no href**, `cursor:auto`, `background:#999`, overflow clip, flex column centred.
   - Main Image: absolute, 100% x 100%, `object-fit:cover` center.
   - Backdrop: absolute `inset:0`, `background: rgba(0,0,0,.5)` masked by `mask: linear-gradient(0deg, #000 0%, transparent 50%)`. This darkens the bottom half only.
   - Text Container: absolute, `left:24; right:24; bottom:24`, flex column centred:
     - Name: `<h4><strong>` 48/**700**/57.6, ls −0.96px (−0.02em), #fff, split into per-character spans.
     - Role: `<p>` 20/500/32, #fff.
     - At 1440 the name sits at y = cardBottom − 24 − 89.6. Lena wraps to 2 lines at 1280 (h 115.2).
   - No hover effect, and the cursor stays the 20px Black dot.
5. `our-team-fade-out` marker: invisible (`opacity:0`), absolute `[20,2191.9,10,585.7]` {h 515}. It sits at the Cards Container top with height = card height + 20 and drives the reveal fade-out (§4.1).

### 3.3 Our Principles `[0,3363.4,W,1720.8]` — row, `padding:0 20px 120px`

1. Left Section: 5 cols (583.3 {516.7}), height 1600.8.
   - Sticky Container: `position:sticky; top:0; height:100vh; z-index:1`, flex column, `justify-content:flex-end`, gap 40, `padding:0 20px 40px`.
   - Top text block (column, gap 0): 300px spacer, then H6 "**Our Principles.**" as `<h6><strong>` at 26/700/36.4, ls −0.26px, #000. Box `[40,3663.4,543.3,36.4]`.
   - Bottom (because of flex-end):
     - Staggered-text `<p>` "If you feel aligned with our principles, let’s build something together.": 14/500/23.8 #757575, width 240, `[40,4095.4,240,47.6]`, initialDelay 100, line delay 120.
     - "Work With Us" Button B, `[40,4183,196.3,40.4]`, `href="./contacts"`.
   - Pinned from scrollY 3363.4 to 4064.2.
2. Right Section: 7 cols (816.7 {723.3}), `padding-bottom 40`: a 300px spacer, then List (flex column, gap 160). Three Principle Items, each a row:
   - Index cell: 1 col (116.7 {103.3}), `padding 0 20`, right-aligned. H4 "A /", "B /", "C /" at 56/700/67.2, ls −1.68px (−0.03em), **#eee**.
   - Text cell: 6 cols (700 {620}), `padding 0 20`. Staggered-text `<h4>` 56/700/67.2, ls −1.68px, #000, width 660 {580}.
   - Items: A at y 3663.4 (h 336) {h 403.2}, B at 4159.4 (h 336), C at 4655.4 (h 268.8).
   - Copy:
     - A / "We remove the unnecessary and focus on what moves the work forward. Simple beats complicated every time."
     - B / "Good work comes from good relationships. We collaborate with people we respect — clients and teammates alike."
     - C / "Ideas get sharper when we shape them as a team. No egos, no walls, just shared ownership."

### 3.4 Image Gallery `[0,5084.2,W,100vh]` — column, `padding 0 40`

- 80px white sticky mask bar `[40,5084.2,C−40,80]`, z 3.
- **Image Ticker** (Framer native ticker): `[40,5164.2,1360,820]` {`[40,5057.2,1200,720]`}.
  - Height = vh − 80. Row, gap 40, overflow clip, `cursor:grab`, cursor variant **Drag**.
  - Images are `<section>` elements with a background image, `fit:fill` (cover), height = ticker height. Order:
    1. `uRGiLtgI5zZUR189HzAdcLcS3E` 1088.6x820 {955.9x720}
    2. `qIAz9adFiLA0mb3195WsiTZjG8` 615x820 {540x720}
    3. `k0V30JNeHj4BUCaCPkC8p2qTp5o` 1088.6x820 {955.9x720}
    4. `nuX4yxFg5l3eeENclb1OpZqsoc` 820x820 {720x720}
  - The set is repeated; the loop period is 3772.2 at 1440 (Σw + 4x40).
  - The `<ul>` is translated; there is no mask or fade on the edges.

### 3.5 Career `[0,5984.2,W,1871.9]`, `id="career"` — column, `padding:200px 20px 0`

1. Text row:
   - 2-col spacer, then Container (6 cols = 700 {620}), column, gap 32:
     - H2 "Careers" at 104/700/104, ls −4.16px (−0.04em), #000, box `[273.3,6184.2,660,104]`.
     - Text Container (`padding 0 20`): two `<p>` elements, 480 wide, 16/500/25.6 #444, 32 apart (y 6320.2 and 6454.6, h 102.4 each):
       > At Möbius®, we believe meaningful work comes from teams who care about clarity, craft, and the ideas behind the work. We’ve shaped our studio around these principles, keeping the team small so the thinking stays sharp and the output stays strong.
       >
       > Every project is handled with intention. We collaborate closely, give space for good ideas to grow, and treat design as a discipline that deserves patience and precision. It’s this focus that allows us to create work that feels refined, thoughtful, and built to last.
   - 4-col spacer.
2. Quote (`<nav>` element): row, `justify-content:center; align-items:flex-end`, `padding:120px 20px 0`.
   - Spacer 226.7 {200} (= 2 cols − 20).
   - Quote Container (9.7 cols = 1133.3 {1000}), `padding 0 20`.
   - Staggered-text `<h4>`, `staggerBy:"words"`, word delay 60ms, duration 600, initialDelay 0, `shiftBlock:true`, `textIndent:160`:
     - Style 56/500/67.2, ls −2.24px (−0.04em), #000. Box `[126.7,6677,1093.3,201.6]` {`[100,6470,960,201.6]`}, 3 lines.
     - The whole h4 has `transform: translateX(-160px)` and its first word `margin-left:160px`. Line 1 therefore starts at the column edge and lines 2+ hang 160px to the left.
   - Copy: "We’re a small team of designers and thinkers guided by clarity, craft, and a shared approach to meaningful work."
3. Text: `padding-top 120`, 2-col spacer, `<p>` 480 wide at `[273.3,6998.6,480,102.4]`:
   > If you feel aligned with our approach, share your application with us. Tell us a bit about yourself, your experience, and what you’re excited to create. We’re always open to meeting new talent and growing the Möbius® team.
4. Accordion row: `padding-top 120`, then 1-col spacer | Section 7 cols (816.7 {723.3}) column gap 80 | 4-col spacer.
   - **Career Accordion** (desktop variant): a flex column of 3 **Career Items**, gap 80. Closed rows sit at y 7221 / 7358.5 / 7496.1, with heights 57.6 / 57.6 / 115.2 (item 3's title wraps).
   - Item row: flex row, `align-items:flex-start`:
     - Plus cell: 1 col (116.7), `padding 0 20`. It holds a Phosphor **Plus** icon, 32x32, #000, centred (x 178.7), plus an invisible "A" 48px h4 used only to give the row its height.
     - Role cell: 6 cols (700), overflow clip, `padding 0 20`. Role `<h4><strong>` 48/700/57.6, ls −0.96px, #000, width 660.
   - Expanded content: the Q&A Container is `position:absolute` at the role cell's top, width 700, `padding 0 20`, flex column, gap 40. The row's **clip height** animates (§5.4). Contents:
     - role h4
     - description `<p>` 480 wide
     - three blocks (column, gap 8). Each block: an `<h6><strong>` heading at 26/700/36.4, ls −0.26, then a `<ul>` 480 wide with `list-style: disc outside`, `li { padding-left: 20px }`, marker #444 16px, and `<p>` 16/500/25.6 #444 per item.
     - Border Container, 40 high, with a 1px #eee line at its bottom.
     - Expanded heights: item 1 840.3, item 2 840.3, item 3 897.9.
   - "How to apply" copy is identical for all three roles: "Submit your PDF portfolio and CV (max 10MB) to hello@wearemobis.com to be considered for the role." The address is `<a href="mailto:hello@world.com"><strong>hello@wearemobis.com</strong></a>` (#000, 700, no underline). Note the href and the visible text differ.
   - Roles, copy verbatim:
     - **Brand Designer**
       - Description: "We’re looking for a Brand Designer who can shape visual systems with clarity and intentionality. You’ll work on identity projects from early exploration to final delivery, helping define how brands look, feel, and communicate. This role is for someone who values structure, refined aesthetics, and thoughtful craft."
       - What you’ll do: Develop visual identities and design systems / Create logos, marks, typographic setups, and color directions / Build brand guidelines and asset libraries / Work closely with the team on concepts and refinements / Present ideas clearly and confidently to the team and clients
       - What we’re looking for: Strong visual sense and attention to detail / Ability to think conceptually / Experience with branding projects / Comfort working in a small, collaborative environment
     - **Digital Product Designer**
       - Description: "As a Digital Product Designer, you’ll help shape websites, platforms, and digital experiences that feel intentional and intuitive. You’ll work across UX and UI, creating structure, flow, and polished visual interfaces that reflect the Möbius® approach to clarity and craft."
       - What you’ll do: Design page structures, flows, and interactions / Develop UI systems, components, and responsive layouts / Collaborate on motion direction and microinteractions / Work with developers or Framer builders to ensure accurate implementation / Participate in reviews and push the work toward clarity
       - What we’re looking for: Experience across UX and UI / Strong typography and layout skills / Understanding of interaction and responsive design / Ability to simplify complex ideas into clear interfaces
     - **Creative Developer (Framer Focus)**
       - Description: "We’re looking for a Creative Developer with strong Framer skills to help bring our digital work to life. You’ll collaborate closely with designers to translate interfaces, motion, and structure into smooth, reliable interactions. This role is perfect for someone who loves mixing creativity with technical execution."
       - What you’ll do: Build websites and interactive experiences in Framer / Implement animations, transitions, and motion systems / Maintain performance and clean structure across pages / Translate design assets into functional components / Work directly with the design team to refine details
       - What we’re looking for: Strong Framer experience (React knowledge is a plus) / Good understanding of layout, spacing, and visual detail / Ability to problem-solve and adapt designs into real interactions / Interest in motion, micro-interactions, and creative development
   - Below the accordion (80 gap): a row of 1-col spacer | 5-col (583.3) column, gap 40, `padding 0 20` | 1-col spacer.
     - `<p>` 320 wide: "**Don’t see a role that fits you?** Send us amessage on LinkedIn and tell us why you think you’d be a strong addition to the team." The bold run is #000/700, the rest #444. The typo "amessage" is in the source; keep it verbatim. Box `[273.3,7691.3,320,76.8]`.
     - Button A "Our LinkedIn Page" `[273.3,7808.1,238.2,48]`, `href="https://framer.link/drukarov"` (§5.2).

### 3.6 Selected Case `[0,7856.1,W,886.9]` {h 816.1} — column centred, `padding:160px 0`

- **Tickers**: absolute, vertically centred (`top:50%; transform:translateY(-50%)`, 336 tall), width W, column, gap 16. Two 160px rows, each an InfiniteTicker with gap 0 (§4.4):
  - Row "Ticker A" (top): `<h2>` "Featured Project. " (trailing space) at 160/800/160, ls −8px, **#f7f7f7**, each copy 1188.6 wide. Direction **left**.
  - Row "Ticker B" (bottom): same text in **#000**. Direction **right**.
  - Painted **under** the card.
- Card row: `padding 0 20`, 4-col spacer | `<a href="./work/golden-hour">` 4 cols (466.7 {413.3}), `padding 0 20` | 4-col spacer.
  - The `<a>` contains a **Project Card** (Desktop variant) 426.7x566.9 {373.3x496.1}, image `70P7DlHOLA5V6H0shE8MTQZ5XW0` cover center. This is the same component as /work (CLONE_SPEC §3.5 and §5.2).
  - Name: "Golden Hour", `h4 strong` 48/700/57.6, #fff, appears on hover only. Cursor variant "Big Black Arrow Right" (120px).
  - The CMS item is the collection item at offset 8.

## 4. Scroll-driven effects (desktop; sampled at settled positions with Lenis `immediate:true` plus a 900ms wait)

### 4.1 Text reveal (words fade in, randomly ordered, tied to scroll position)

- Word timing *(code, verified)*:
  - When the wrapper first enters view, record `n` = wrapper document top. The wrapper is the H3's box: 1111.9 at 1440 and 1280.
  - `start = n − vh + (vh/2)*(scrollStart/50)` and `end = n − (vh/2)*(scrollEnd/50)`, with scrollStart = scrollEnd = 20.
  - 1440x900: start = 391.9, end = 931.9.
  - Word with **order index k** gets threshold `start + (end−start)/41 * k`. When `scrollY ≥ threshold` it animates opacity 0 → 1 (tween 0.4s, `easeOut`); when scrollY drops below it fades back 1 → 0.
  - Words reset to 0 when the block leaves the viewport (at 3150 all were 0) and re-reveal on re-entry.
- Order: a seeded shuffle with the first word forced first. Replicate exactly:
  ```js
  let s = 300; const rnd = () => ((s = (s * 9301 + 49297) % 233280), s / 233280);
  const order = [...Array(41).keys()];
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  const z = order.indexOf(0); if (z > 0) { order.splice(z, 1); order.unshift(0); }
  // word i uses k = order.indexOf(i)
  ```
- Measured visible-word counts at 1440: scrollY 300 → 0/41, 450 → 5, 600 → 16, 750 → 28, 900 → 39, 1050 → 41.
- **Block fade-out:** the sticky Text Reveal wrapper's opacity goes 1 → 0, linear in scroll, while the `our-team-fade-out` marker crosses the viewport bottom: from `scrollY = markerTop − vh` (1291.9) to `markerTop + markerH − vh` (1877.6). Framer `onScrollTarget` with spring {stiffness 340, damping 60} smoothing *(code)*.
  - Measured opacity: 1 at 1200, 0.899 at 1350, 0.644 at 1500, 0.388 at 1650, 0.132 at 1800, 0 at 1950.
  - At 1280 the window is 1291.9 → 1806.9 (marker h 515).

### 4.2 Team column parallax

- Col 1 `translateY` goes −150 → 0 and col 2 goes −300 → 0. Col 3 is static. Linear in `p = clamp((scrollY + vh − cardsTop) / cardsH, 0, 1)` with cardsTop = 2191.9 and cardsH = 1171.4 (1280: 2091.9 / 1030). Smoothed by a spring (stiffness 340, damping 60, mass 1, overdamped, settles in about 0.7s) *(code)*.
- Measured col 1 / col 2: −150/−300 at scrollY ≤ 1300; −136.2/−272.4 @1400; −110.6/−221.2 @1600; −85/−169.9 @1800; −59.3/−118.7 @2000; −33.7/−67.4 @2200; −8.1/−16.2 @2400; 0/0 from 2463.
- At page load (scrollY 0) the columns already sit at −150 / −300.

### 4.3 Pinning summary (1440)

| element | pinned scrollY range |
|---|---|
| Intro sticky button column | 0 → 11.9 |
| Our Team white bar | 911.9 → 3283.4 |
| Text Reveal | 991.9 → 2463.4 |
| Principles sticky column | 3363.4 → 4064.2 |
| Gallery white bar | 5084.2 → 5904.2 |

### 4.4 Tickers

- **"Featured Project." rows** (InfiniteTicker *(code + measured)*):
  - Base speed 100 px/s; frame dt is capped at 64ms; x wraps modulo (copy width + gap).
  - Scroll boost: `boost = min(1000, |ΔscrollY| / Δt * 1000)` px/s, recomputed on every scroll event and decaying by `exp(−6·dt)` each frame (dropped to 0 below 0.5). Speed = 100 + boost.
  - Measured idle: exactly −200 / +200px over 2.0s. After a 300px wheel scroll, the peak was ≈ +910 px/s at ~150ms, falling back to ~100 px/s by ~1.5s.
  - Paused when more than 200px off-screen (IntersectionObserver, rootMargin 200px). Stopped under reduced motion.
- **Image Ticker** (Framer native):
  - 100 px/s leftward. Hover does **not** change speed (hoverModifier 100%).
  - `tickerEffectDraggable`: dragging moves it 1:1. On release, the momentum decays back to the base speed: after a −200px drag, the release velocity was ~−500 px/s, decaying to −100 px/s over ~1.8s.

### 4.5 In-view appears (once)

- Principle items:
  - Index "A /" uses a word-token appear: opacity 0.001 → 1 with `y 60 → 0`, spring 0.4 bounce 0, word stagger 0.075, startDelay 0.2, trigger onInView, threshold 0 *(code)*.
  - The sentence uses the staggered-text component: words, delay 60ms, duration 600, initialDelay 200, `cubic-bezier(.4,1,.4,1)`.
  - Each item fires when its top crosses 90% of vh. Measured: A started between scrollY 2800 and 2900 (item top 863 → 763); B at ~3400; C at ~3900.
- "Our Principles." H6: character appear `y 50 → 0`, opacity 1, spring 0.8 bounce 0, char stagger 0.025, startDelay 0.1, onInView threshold 0 *(code)*. Overflow clip on its container masks the rise.
- Quote: words animate in when the h4 top is above 0.9·vh (measured start at scrollY ≈ 5900).

## 5. Hover / interaction states (desktop)

All cursor sizes refer to the shared custom cursor (CLONE_SPEC §5.1). Variant transition: spring 0.4, bounce 0.

### 5.1 Button B ("Join Us", "Work With Us"; also "Read All" on /contacts)

- Structure: `<a>` flex row, `padding:2px 40px 2px 0`, overflow clip.
  - Label: `<h6>` 26/500/36.4, ls −0.26, #000.
  - Arrows row: absolute, `left:-40px; right:0`, full height, `justify-content:space-between`, z 1. Two Phosphor **ArrowRight** (bold) icons, each 11% wide x 64% tall.
  - Underline "Line": absolute `bottom:0; left:-1px; width:1px; height:2px; background:#000`.
- Hover:
  - The `<a>` padding becomes `2px 0 2px 40px`, so the label moves +40.
  - Arrows row becomes `left:0; right:-40px`: the left arrow slides into view at the start and the right arrow exits.
  - Line becomes `left:-1; right:0; width:auto`: the full-width underline grows from the left.
  - Spring 0.6 s, bounce 0.
- Measured on mouse-out (label x 80 → 40, line 122.9 → 1):
  - label x: 79.2 @45ms, 69.9 @94, 56.2 @161, 47.9 @227, 43.6 @293, 41.0 @394, 40.3 @493, 40.0 @627
  - line width: 122.9 / 93.9 / 51.5 / 25.5 / 12.1 / 4.1 / 1.8 / 1.1 at the same times
- Cursor: Hidden (2px, invisible) over the button.

### 5.2 Button A ("Our LinkedIn Page"; also the contact-form submit on /contacts)

- Structure: `<a>` `padding:8px 58px 8px 18px`, gap 16, overflow clip, min-content width (238.2x48 here).
  - Backdrop `<section>`: absolute `inset:0`, `background:#000`, `border-radius:999px`.
  - Label `<p>`: 20/500/32, #fff, `pointer-events:none`.
  - Arrow 1: ArrowRight 16x16, #fff, absolute `right:14px`, vertically centred.
  - Arrow 2: same icon, absolute `left:-32px` (hidden).
- Hover (spring **0.4**, bounce 0):
  - Padding becomes `8px 76px 8px 0`, so the label moves −18 and lands at x 273.3.
  - Label colour goes #fff → #000.
  - Backdrop collapses to a **28x28 circle**: `top:10; bottom:10; right:1; left:auto; aspect-ratio:1`. It ends at x 482.5 → 510.5, y +10.
  - Arrow 1 exits to `right:-120px`. Arrow 2 enters at `left:auto; right:7px`, centred in the circle.
- Measured hover-in (backdrop x/w):
  - x 313.9/w 197.4 @85ms; 408/102.9 @145; 459/51.7 @212; 475.9/34.7 @279; 481.6/28.9 @379; settled 482.5/28 at ~450ms.
  - Label colour: 255 → 0 by ~85ms on hover-in. On hover-out it returns 0 → 255 over ~370ms (56 @47, 141 @79, 190 @113, 236 @179, 252 @279, 255 @380).
- Cursor: Hidden over the button.

### 5.3 Project Card (Golden Hour)

Identical to /work (CLONE_SPEC §5.2), re-measured here:
- Main Image grows to 120% (426.7x566.9 → 512x680, centred) on a 0.6s spring: 433x575 @106ms, 456x605 @155, 491x653 @255, 509x676 @406, 512x680 @~550.
- Name characters rise from translateY 200: 186 @106ms, 82.9 @206, 27.3 @305, 7.9 @406, 0 @~700 (stagger 0.025).
- Cursor grows 20 → 120 with the ArrowRight icon fading in: 34.5 @106, 99.8 @206, 116.8 @305, 120 @~500.
- On mouse-out the name unmounts instantly and the image springs back over ~0.5s.

### 5.4 Career accordion

- Click on either cell (`onTap`) toggles that item between Close and Open. Items are **independent**: several can be open at once.
- Transition: **tween 0.8s, ease `cubic-bezier(0.6, 0, 0.4, 1)`** *(code)*, applied to the row's clip height and the Plus icon rotation 0 → 45° (the icon's bounding box goes 32 → 45.3px).
- Measured heights, item 1, open 57.6 → 840.3: 59 @69ms, 78 @158, 139 @258, 275 @358, 500 @458, 693 @557, 792 @658, 832 @758, 840 @~850.
- Close is the mirror: 836 @104, 767 @253, 540 @403, 306 @504, 155 @603, 84 @703, 59 @804.
- Rows below are pushed by layout (y follows).
- Content is not faded: it is revealed purely by the clip.
- Cursor: Hidden (2px) with CSS `cursor:pointer`.

### 5.5 Image ticker

- Cursor becomes the **"Drag"** variant: 120px black dot with the white Phosphor **ArrowsHorizontal** icon at opacity 1 (measured w 104.7 @179ms, 119.4 @345, 120 @512).
- CSS cursor: grab.

### 5.6 Other targets

- Team cards: no hover, Black 20px cursor, no link.
- Intro text, H1, principles: none.
- The email link inside the accordion: no hover effect measured; it is a bold text link.

## 6. TABLET (1000x800)

`C = 970`; side padding 15; columns are 1/6 of C = 161.7. The intro Sticky Section is present but empty: the "Do you feel ready" text and Join Us are removed.

- **Intro** `[0,0,1000,745.5]`: Container (4/6 = 646.7) at x 176.7, `padding-top:160`, gap 64.
  - H1 120/800/120, ls −6px, `[191.7,160,616.7,240]`.
  - Intro `<p>` `[191.7,464,480,281.5]`, **static** (no line animation).
  - The trail layer is present, `[0,0,999,528]`.
- **Our Team** `[0,745.5,1000,2498.6]`, `padding 0 15`:
  - White sticky bar **72**px.
  - Text Reveal (not sticky): `padding:80px 15px 0`. The text is an `<h4>` at 44/700/52.8, ls −1.76px, **reveal disabled**: all words visible, no fade-out. Box `[30,897.5,940,316.8]`; the 17% indent is kept.
  - Team: `padding-top:160`. Cards Container is a column, gap 30, of three rows. Each row is `padding 0 15`, gap 30, with 2 cards of **455x603.3**. Rows sit at y 1374.3 / 2007.6 / 2640.9, in DOM order (Jonas, Markus / Tobias, Elias / Lena, Niko).
  - Names are 44/700/52.8, ls −0.88. Roles 20/500/32. **No parallax.**
- **Principles** `[0,3244.2,1000,1142]`:
  - Left 2/6 (323.3) Sticky Container is `100vh` tall, `padding:0 15px 30px`, gap 40. It holds: a 160 spacer; H6 25/700/35 (ls −0.25); the "If you feel aligned…" `<p>` `[30,3887.6,240,47.6]`; and the Work With Us button (Touch variant, `[30,3975.2,189,39]`, 25px label).
  - Right 4/6: `padding 0 15`, 160 spacer, list gap **80**. Item row = index 154.2 wide (H4 44/700/52.8, ls −1.32, #eee, `padding-left 20`, right-aligned) + text 462.5 wide (44/700/52.8, static).
- **Gallery** `[0,4386.1,1000,792]`: `padding:80px 30px 0`; 72 white sticky bar; ticker `[30,4538.1,940,640]`, gap **30**. Images 849.6 / 480 / 849.6 / 640 wide x 640 tall.
- **Career** `[0,5178.1,1000,1585.5]`: `padding:160px 15px 0`.
  - H2 80/700/80, ls −3.2px, `[196.7,5338.1]`. Paragraphs 480 wide, 40 apart. Note the text containers use `padding 0 20` here.
  - Quote: `padding:80px 15px 0`; spacer 156.7; h4 44/500/52.8, ls −1.76, **static**, `text-indent:120px` plus `translateX(-120px)`. Box `[81.7,5766.9,753.3,158.4]`.
  - Text: `padding-top 80`.
  - Accordion: `padding-top 80`; middle column 4/6 (646.7), gap 72.
    - Items use the "Touch" variants with list gap **64**. Rows are 616.7 wide, `[191.7,6187.6]`.
    - The role cell (566.1) is on the **left** and the plus cell (50.5 wide, `padding-left 20`) on the **right**.
    - Role h4 44/700/52.8.
    - Closed rows at y 6187.6 / 6304.4 / 6421.2 (third is 105.6 tall). Same 0.8s tween.
  - LinkedIn Button A, Tablet variant, `[191.7,6715.6,238.2,48]`.
- **Selected Case** `[0,6763.6,1000,1139.4]`: Tickers **are shown**, 120px rows (h2 120/800, ls −6), copy width 891.4, gap 16, centred (translateY −128). Card `<a>` `[176.7,6923.6,646.7,819.4]`, Touch-variant card **616.7x819.4**, with the name "Golden Hour" **always visible** (44/700/52.8, #fff).
- Footer: Tablet variant (shared).

## 7. PHONE (390x844)

Side padding 10; most blocks are `padding 0 10`, which gives a text width of 350.

- **Intro** `[0,0,390,727.9]`: column, `padding 0 10`. Container `padding-top 120`, gap 64.
  - H1 80/800/80, ls −4px, `[20,120,350,160]` (2 lines).
  - Intro `<p>` `[20,344,350,383.9]`, static.
  - Trail layer `[0,0,389,557]` (touch: effectively inert).
- **Our Team** `[0,727.9,390,3737.2]`:
  - White sticky bar **64**px.
  - Text Reveal: `padding:64px 10px 0`, `<h4>` 36/700/43.2, ls −1.44, static, `[20,855.9,350,604.8]`.
  - Team: `padding-top 120`. Cards Container column, gap 20, of three sections. Each section is a column, gap 20, `padding 0 10`, with 2 cards of **350x464.1**. Cards at y 1580.8, 2064.8, 2548.9, 3032.9, 3517, 4001.1.
  - Names 36/700/43.2, ls −0.72. Roles 20/500/32.
- **Principles** `[0,4465.1,390,1284.1]`: column, `padding-top 120`, gap 40.
  - Sticky header H6 "Our Principles." 24/700/33.6, `[20,4585.1,350,33.6]`. Its container is `position:sticky; top:0` but only 33.6 tall, so it does not visibly pin.
  - There is **no** "If you feel aligned…" text and no button.
  - List `padding 0 20`, gap 40. Item = column, gap 20: index H4 36/700/43.2, ls −1.08, #eee, left-aligned; then the text h4 36/700/43.2, static.
  - Items at 4658.7 / 5064.3 / 5470.
- **Gallery** `[0,5749.2,390,584]`: `padding:40px 20px 0`; 64 bar; ticker `[20,5853.2,350,480]`, gap **20**. Images 637.2 / 360 / 637.2 / 480 x 480.
- **Career** `[0,6333.2,390,1798.3]`: `padding-top 120`.
  - H2 64/700/64, ls −2.56, `[20,6453.2]`.
  - Paragraphs 350 wide, 40 apart.
  - Quote: `padding:80px 10px 0`, h4 36/500/43.2, ls −1.44, static, `text-indent:80px`, **no** translateX. Box `[20,6968.3,350,259.2]`.
  - Text `padding-top 80`.
  - Accordion `padding-top 80`, `padding 0 20`, gap 64. Rows 350 wide: role 305 wide (36/700/43.2) on the left, plus cell 45 on the right. Rows at 7515.5 / 7622.7 / 7773.1.
  - LinkedIn button, Mobile variant: **full width 350x48** `[20,8083.5]`, label 274 wide (flex 1).
- **Selected Case** `[0,8131.5,390,530.7]`: **no tickers**.
  - The `<a>` `[10,8131.5,370,530.7]` (`padding 0 10`) starts with a 64px white **sticky** "Sticky Backdrop" (`top:0; z:2`).
  - Then the Touch card **350x466.7** at y 8195.5, with the name always visible (36/700/43.2).
- Footer: Mobile variant (shared).

## 8. Not measured / caveats

- Image-ticker drag inertia: only the coarse curve was sampled. The exact decay constant (Framer native ticker) is not documented.
- The trail images' `contain` fit leaves a slight letterbox: 864x1184 inside 300x400, ≈7px total, top and bottom. This comes from code and was not visually verified.
- Touch-device behaviour (tap on accordion Touch variants, ticker drag by touch) was not tested. Tablet/phone values come from viewport emulation with a mouse.
- The text-reveal re-entry from below (scrolling back up) was not sampled frame-by-frame. From code, each word fades back out (0.4s easeOut) as scrollY drops below its threshold.
- The hover state of the "hello@wearemobis.com" accordion link: no change observed. I did not test `:active` or `:focus` styles.

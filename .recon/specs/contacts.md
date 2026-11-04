Source: https://mobius.framer.website/contacts

# /contacts — build spec

Recon run 2026-11-04 with headless Chromium at DPR 1. Sources:
- Measurements: computed styles and rects, plus per-rAF sampling.
- Modules: `2tZ_kDphZCdkVrVB07X04yYjqU4msoi…DSEXjFHt.mjs` (page), `s7mZ8C7tU.fAkse9VT.mjs` (Contact Form, Button Contact Form, Parallax Image, Blog Section), `oIgKW6opR` (Image Reveal), `p2KKNkdQo` (Button B), `XOF_jk7P8` (Button A), `Lenis.DvMIc7tT.mjs`.

*(code)* marks values read from source and not sampled.

**The form was never submitted.** I did not click the submit button or press Enter, and all `/forms` traffic was route-blocked as a safeguard. The submit-flow states (Loading/Success/Error/Disabled) therefore come from the component code only (§5.3).

Shared pieces live in `/Users/riyaghosh/portfolio/Möbius/CLONE_SPEC.md` (nav, cursor, springs, tablet/phone footer). The nav clock, the "Do you feel ready / Join Us" sticky column, Lenis, the staggered-text component, Button A and Button B are specified in `/Users/riyaghosh/portfolio/Möbius/.recon/specs/studio.md` §1, §2, §3.1 and §5. They are identical here unless noted.

**Footer:** identical to home at every width (Desktop h 917.9 at 1440 / 886.8 at 1280, padding-top 200; Tablet h 1020.2, padding-top 160; Mobile h 1187.8, padding-top 120). It starts at y 3987.2 (1440) / 3894 (1280) / 4095.6 (1000) / 3776.4 (390). Nothing page-specific to build.

Assets: `/Users/riyaghosh/portfolio/Möbius/.recon/specs/contacts-assets.json`. Screenshots: `/Users/riyaghosh/portfolio/Möbius/.recon/shots/contacts-<w>-<scrollY>.png`, plus `/private/tmp/claude-504/-Users-riyaghosh-portfolio-M-bius/c69f16fd-ee06-4962-9e5a-85c21a9a2430/scratchpad/sc/select-big.png` (select chevron, 4x).

---

## 0. Frame

- Document height: 1440x900 → 4905, 1280x800 → 4781, 1000x800 → 5116, 390x844 → 4964.
- Grid and colours are the same as /studio §0: `C = vw−40` split into 12 columns with no gutters (col 116.67 at 1440, 103.33 at 1280); tablet 15px sides; phone 10px.
- Page title "Möbius". Meta description: "Möbius® is a modern agency Framer template built around a unique grid system, dynamic and immersive interactions, and a creative approach to every single page."
- Smooth scroll: Lenis is identical to /studio (2s expo-out per wheel event; measured 50% at 200ms, 82% at 500, 97% at 1000, 100 by 1500). Desktop only.

## 1. Entrance (desktop)

- Nav wrapper as in CLONE_SPEC. It started at t≈482ms in this run.
- "Do you feel ready…" lines: translateY 23.8 → 0, 600ms `cubic-bezier(.4,1,.4,1)`, line stagger 120ms. Line 0 starts at t≈1433, i.e. +950ms after the nav starts (same as /studio).
- H1 "Let’s Talk!" and the form are static at load: no split, no appear.

## 2. Sections — DESKTOP (1440x900; {1280x800})

Boxes are `[x, y(document), w, h]`.

### 2.1 "Let's Talk" `[0,0,W,1707.8]` {h 1759.8} — row, `justify-content:center`, `padding:0 20px`, overflow clip, **z-index 2**

1. Sticky Section: 2 cols (233.3 {206.7}), `sticky; top:0; height:100vh; z:1`. It contains the same Button Container as /studio §3.1: flex-end, gap 64, `padding 0 20 40`.
   - H4 "Do you feel ready to become part of our growing team?" `[40,684.2,160,71.4]` {y 584.2}.
   - Join Us Button B `[40,819.6,124.4,40.4]`, `href="./studio#career"`.
   - Pinned until scrollY 807.8 (= 1707.8 − 900).
2. Section: 6 cols (700 {620}), flex column, `justify-content:flex-end`, gap 120, `padding:200px 0 40px`.
   - Text Container (`padding 0 20`): H1 "Let’s Talk!" (typographic apostrophe) at 160/800/160, ls −8px, #000, single line. Box `[273.3,200,657.7,160]`. At 1280 it overflows its 580 column to 657.7 wide; keep `white-space` as is and allow the overflow.
   - Form Container (`padding 0 20`, overflow clip): the **Contact Form** (§3).
3. Right spacer: 4 cols.

### 2.2 Image + contact card `[0,1707.8,W,1100]` {`[0,1759.8,W,1000]`} — row, `padding:120px 20px 0`, overflow clip

- Inner Section: `[20,1827.8,C,980]` {h 880}, column.
  1. 80px white sticky mask bar: `sticky; top:0; z:1; bg #fff`, `[20,1827.8,1400,80]`. It is pinned until scrollY 2727.8 and wipes the image's top edge under the nav.
  2. Image Container `[20,1907.8,1400,900]` {800 = 100vh}. Inner wrapper `padding 0 20`, so the parallax box is `[40,1907.8,1360,900]` {`[40,1959.8,1200,800]`}.
- **Parallax Image** (custom component):
  - Wrapper div: `overflow:hidden; position:relative; background:#fff`.
  - `<img alt="Parallax Image" src=uFUviw9ZrPHHXKTg0Uk6Ceg3IM.jpg>` with `width:100%; height:calc(100% + Ppx); object-fit:cover; will-change:transform; transform:translateY(-p px)`.
  - P = **300** desktop, **200** tablet, **0** phone. The image is 1360x1200 at 1440 {1200x1100}, 940x840 at 1000, 350x480 at 390.
  - The img is only mounted after the effect runs, so there is no SSR image.
- **Contact Info** overlay: `position:absolute` over the Image Container, same box `[20,1907.8,1400,900]`. Row, centred. Layout: 7-col spacer (700) | Section 5 cols (583.3 {516.7}), column centred | 1-col spacer.
  - Text Section `padding 0 20` contains the **card**: `[740,2092.2,543.3,531.2]` {`[660,2094.2,476.7,531.2]`}, `background:#fff`, `padding:56px`, flex column, gap 56. No radius, no shadow. Vertically centred in the 900 box. Three blocks (flex column, gap 8):
    - Label `<p>` 14/700/22.4, ls 0.28px, **#999**, `text-transform:uppercase`. Source text is "Email", "Phone", "Address".
    - EMAIL: Button-C link `<a href="mailto:hello@world.com">` with `<h5>` "hello@mobius.com" at 32/700/41.6, ls −0.32px, #000, box `[796,2178.6,279.9,41.6]`. The visible address and the href differ in the source.
    - PHONE: `<a href="tel:00000000">` `<h5>` "+49 30 648 92 770" `[796,2306.6,279.8,41.6]`.
    - ADDRESS: three `<h5>` lines with gap 4, each in an overflow-clip container: "Möbius® Studio" / "Schwedter Straße 112" / "10437 Berlin, Germany". They sit at y 2434.6 / 2480.2 / 2525.8, inside a column 431.3 {364.7} wide.
  - The label column is 431.3 wide, but the ADDRESS label box is 250 wide (fixed).

### 2.3 Studio Notes `[0,2807.8,W,1179.4]` {`[0,2759.8,W,1134.2]`} — row, `padding 0 20`

1. Left Section: 2 cols. **Button Sticky Container**: `sticky; top:0; height:100vh; z:1`, flex column, `justify-content:flex-end`, gap 64, `padding 0 20 40`.
   - Staggered-text `<p>` "Our thoughts on how brands, systems, and stories find their form.": 14/500/23.8 #757575, lines, delay 120, duration 600, initialDelay 100. Box `[40,3492,193.3,71.4]` {`[40,3344,166.7,71.4]`}.
   - "Read All" Button B (`href="./feed"`) `[40,3627.4,132.6,40.4]`, label 26/500/36.4.
   - Pinned from scrollY 2807.8 to 3087.2.
2. Middle Section: 8 cols (933.3 {826.7}). It holds a 200 spacer, then:
   - Title Container (`padding 0 20`): `<h2>` "Studio Notes" 104/700/104, ls −4.16, `[273.3,3007.8,893.3,104]`.
   - Notes Container (`padding-bottom 40`) holding the **Blog Section**: a row of 2 columns, each 4 cols (466.7 {413.3}), flex column, gap 50, `padding 0 20`.
   - Each note:
     - Image Container (column, overflow clip) = 80px white sticky mask bar (`sticky; top:0; z:1`), then `<a href="./feed/<slug>">` with the image 426.7x566.4 {373.3x495.6} (ratio 1.3274), `object-fit:cover`.
     - Text Container (column, gap 12):
       - date `<p>` 14/500/23.8 #999, width 384 (90%)
       - title `<h6>` 26/500/36.4, ls −0.26, holding `<a><strong>` at weight 700, #000, no underline
       - excerpt `<p>` 16/500/25.6 #444, width 384
       - gap 8 between title and excerpt
   - Note 1: date "April 26, 2026"; title "The Logic of Emotion" → `./feed/the-logic-of-emotion`; image `drBPvfLZfwnmhTDHHQbPmsfGe1I` with **object-position 63.9% 28.8%**. Excerpt: "In design, clarity isn’t about simplicity for its own sake. It’s about removing what doesn’t serve meaning — until what remains feels inevitable."
   - Note 2: date "March 29, 2026"; title "Precision Over Perfection" → `./feed/precision-over-perfection`; image `3wAhbBL8w69xQSppPtvRjJX8`, center. Excerpt: "Design isn’t about getting everything right — it’s about making the right things matter."
   - Image tops at y 3191.8 {3143.8}; text at 3790.2; column heights 835.4 / 809.8.
3. Right spacer: 2 cols.

## 3. Contact Form (Framer form, `<form>` variant "Desktop")

- Element: `<form>` with `action="https://api.framer.com/forms/v1/forms/e149820d-cb29-4f28-967e-b0ad68b671ad/submit"` *(code)*. For the clone, wire it to your own handler.
- Box `[273.3,480,660,1187.8]` {`[246.7,480,580,1239.8]`}. Flex column, gap **80** (tablet 72, phone 64).
- **Mad-lib layout**: the form holds three "sentence" groups, each `display:flex; flex-direction:row; flex-wrap:wrap; row-gap:20px` (tablet/phone 16) and `column-gap:6px`, `align-items:center`.
  - Every word is its own `<p>` at 20/500/32, #000. Fields sit inline between the words.
  - Groups at 1440: G1 `[273.3,480,660,208]`, G2 `[273.3,768,660,468]`, G3 `[273.3,1316,660,120]`. Then the terms `<p>` at y 1516 and the button at y 1619.8.
- Copy, in order (`[field]` marks an input). Keep the source's curly vs straight apostrophes exactly:
  1. "Hey Möbius®, my name is" **[Name]** "and I’m writing from" **[Company Name]** "."
  2. "I’m getting in touch because I’d like to" **[Message]** "My budget is roughly" **[Budget]** "and I'd like to start" **[Timeframe]** "." (the second "I'd" uses a straight apostrophe in the source)
  3. "You can contact me at" **[Email]** "." "Looking forward to your reply!"
  4. Terms (own block, 23.8 tall): "By submitting, you agree to our Terms and Privacy Policy." at 14/500/23.8, **#999**. "Terms" and "Privacy Policy." are `<a href="./">` in #000, weight 500, no underline.
  5. Submit button (§5.3).
- Fields: all share font 20/500/32 (160%), Inter Display, colour #000, `--framer-input-padding:18px`. Wrapper `background:#f7f7f7`, radius 0, no border, no shadow.

| name | element | required | placeholder / first option | wrapper size (1440) | notes |
|---|---|---|---|---|---|
| Name | `input type=text` | yes | "Your Name *" | 440x68, inner input 404x32 | |
| Company Name | `input type=text` | no | "Company Name" | 440x68 | |
| Message | `textarea` | yes | "Message *" | 100% x 240 (min-height 240) | `resize: vertical`; padding 18 on the textarea itself; webkit resizer = 14px #999 diagonal-lines SVG |
| Budget | `select` | yes | "Select a Budget *" (disabled, value "") then "$5,000 - $10,000", "$10,000 - $20,000", "$20,000 +" | 240x68 | |
| Timeframe | `select` | yes | "Choose a Timeframe *" (disabled) then "As soon as possible", "Next month", "Whenever you’re available" | 480x68 | |
| Email | `input type=email` | yes | "Email *" | 440x68 | |

- Widths: 440 / 240 / 480 at desktop and tablet; **332.5 (95%) for every input and select on phone**.
- Placeholder colour #999. A select with no value shows its text in #999; after a choice the text turns **#000** (measured).
- Select: `appearance:none`. The wrapper has `padding-right:18px` and the select `padding:18px`. The chevron is a `::before` on the wrapper: `background:#999` masked by an SVG chevron path `M 3.5 6 L 8 10.5 L 12.5 6`, stroke 1.5, round caps, mask-size 16px auto, mask-position 10px 50%. Visually it is a 9x4.5px chevron centred at x = wrapperRight − 26, vertically centred.
- **Focus** (measured): `:focus-within` adds a **2px solid #000 bottom border** via the wrapper's `::after` overlay (`border-width:0 0 2px 0`, inset, so no layout shift). The background stays #f7f7f7. The change is instant, with no transition. The input itself has `outline:none`. Caret #000. Blur removes the border instantly.
- Hover on fields: no change.
- Cursors: text / default (select).
- **Validation**: native HTML constraint validation only. Messages seen without submitting: Message → "Please fill out this field.", Timeframe → "Please select an item in the list.", Email → "Please fill out this field." No custom invalid styling: an invalid email kept text #000 and no shadow. `--framer-input-invalid-text-color:#999` is set on the selects *(code)*. The browser's own validation bubble would appear on submit (not triggered).
- Honeypots: 11 hidden 0x0 text inputs named website, company, message, subject, title, description, feedback, notes, details, remarks, comments. These are Framer spam traps; they are optional in the clone.

## 4. Scroll-driven effects (desktop)

- **Parallax image** *(code, verified)*: on every scroll (rAF-throttled, no smoothing), with `r = wrapper.getBoundingClientRect()`:
  - `prog = clamp((vh − r.top) / (vh + r.height), 0, 1)`; `p = P − prog·P`; the img gets `translateY(−p)`. The state only updates when the change is more than 0.1px.
  - Measured at 1440 (P 300, box top 1907.8, h 900): −300 for scrollY ≤ 1007.8; −293 @1050; −268 @1200; −243 @1350; −218 @1500; −193 @1650; −168 @1800; −143 @1950; −118 @2100; −93 @2250; −68 @2400; −43 @2550; −18 @2700; 0 from 2807.8.
- **Pinning** (1440):

| element | pinned scrollY range |
|---|---|
| "Do you feel / Join Us" column | 0 → 807.8 |
| Image white bar | 1827.8 → 2727.8 |
| Notes left column | 2807.8 → 3087.2 |
| Each note’s 80px bar | 3111.8 → 3678.2 (end of its 646.4 container); it wipes the image top as the image scrolls under it |

- **Note image reveal** ("Image Reveal", variant appear, once, threshold 0) *(code + measured)*:
  - The image section is masked by `linear-gradient(90deg, #000 X%, transparent X%)`.
  - On first entering the viewport it animates X 0% → 100% (a left-to-right wipe) with a **tween 1.2s, ease `cubic-bezier(0.6,0,0.4,1)`**.
  - Measured X: 0.18 @112ms, 1.05 @180, 2.69 @246, 5.43 @313, 9.34 @379, 15.1 @445, 23.3 @514, 34.1 @580, 47.3 @647, 60.6 @712, 72.7 @780, 81.9 @847, 88.4 @914, 93.0 @978, 96.3 @1045, 98.4 @1112, 99.6 @1180, 100 @~1300.
  - Both notes trigger together. It does not replay on re-entry.
- **Address lines**: per-character appear, `y 50 → 0`, opacity 1, spring 0.8 bounce 0, char stagger 0.025. startDelay 0.2 / 0.3 / 0.4 for lines 1 / 2 / 3. Trigger onInView, threshold 0.5, once *(code)*. They are clipped by each line's overflow-clip container. This is not visible at load because it is below the fold; it had already completed when sampled at scrollY 0–4000.
- No team-style parallax, tickers or text reveal on this page.

## 5. Hover / interaction states (desktop)

### 5.1 Email / phone links (Button C)

- `<a>`: flex row, overflow clip. Label `<h5>` 32/700/41.6.
- Underline "Line": absolute `bottom:0; left:-1px; height:2px; width:1px; background:#000`.
- Hover: the line grows to full label width. 1 → 281px for the email link, anchored left. No text movement, no colour change. Cursor: Hidden.
- Measured width:
  - In: 30 @88ms, 67 @112, 142 @162, 197 @211, 234 @262, 255 @311, 267 @362, 274 @412, 279 @511, 281 @~600 (spring ≈0.6s, bounce 0).
  - Out: 264 @58, 190 @108, 119 @158, 70 @208, 40 @258, 22 @308, 12 @357, 4 @458, 1 @~600.

### 5.2 Read All / Join Us (Button B)

Identical to /studio §5.1.

### 5.3 Submit button "Button Contact Form" (`<button type=submit>`, width **200 fixed**, h 48)

- Structure: like Button A. `padding:8px 58px 8px 18px`.
  - Backdrop `<section>` #000, radius 999, `inset:0`.
  - Label `<p>` "Get in Touch" 20/500/32, #fff.
  - ArrowRight 16 (bold, white) at `right:14px`. A second icon sits at `left:-32px`.
  - Cursor: pointer.
- **Hover / pressed** (spring 0.4, bounce 0, measured):
  - Padding becomes `8px 104px 8px 0`, so the label moves −18.
  - Label colour #fff → #000 (234 @79ms, 150 @146, 85 @212, 45 @280, 17 @379, 0 @~480).
  - Backdrop collapses to a 28x28 circle at `right:1; top:calc(50% − 14px)`: x 273→444 and w 200→28 (178 @79, 131 @112, 90 @146, 48 @212, 31 @313, 28 @~410).
  - Arrow 1 exits to `right:-120px`. Arrow 2 enters at `right:7px`.
  - Cursor: Hidden.
  - Hover-out mirrors this (label back to #fff by ~380ms).
- Other variants *(code only; not triggered)*: all share the hover's collapsed-circle geometry, `padding 8px 104px 8px 0`, backdrop 28x28 at `right:1; top:50%; translateY(-50%)`, label #000, and `cursor:unset`.
  - **Loading**: label "Get in Touch". Icon 2 becomes a Phosphor **Spinner** that loops `rotate: 0 → 360`, tween **6s linear** (`ease [0,0,1,1]`), infinite, paused off-screen.
  - **Success**: label "**Thank you**", icon **Check**.
  - **Error**: label "**Error**", icon **X**.
  - **Disabled**: default geometry at **opacity 0.3**.
  - Touch: default look with `cursor:unset`.
  - Variant transition: spring 0.4, bounce 0.

### 5.4 Studio Notes cards

- Hovering the image `<a>` changes only the cursor: **Big Black Arrow Right** (20 → 120px; 33.7 @61ms, 73.7 @111, 99 @160, 111.5 @210, 118.8 @311, 120 @~460; icon opacity 0.14 → 1).
- The image does not change (no zoom or wipe on hover).
- The title link: no underline or colour change on hover; the cursor stays the Black 20 dot.

### 5.5 Cursor over the form

- Black 20px dot over fields and words.
- Hidden over the submit button and the email/phone links.

## 6. TABLET (1000x800)

`C = 970`; sides 15; 1/6 columns = 161.7.

- **Let's Talk** `[0,0,1000,1539.8]`:
  - The Sticky Section (161.7) is present but **empty**.
  - Section 4/6 (646.7) at x 176.7: column flex-end, gap 80, `padding-top 160`.
  - H1 "Let’s Talk!" 120/800/120, ls −6, `[191.7,160,616.7,120]`.
  - Form (variant "Tablet") `[191.7,360,616.7,1179.8]`, gap 72, groups row-gap 16:
    - G1 at y 360; Name `[191.7,408,440,68]`; Company `[239.1,492,440,68]`.
    - G2 at 632; Message `[191.7,680,616.7,240]`; Budget `[387.9,936,240,68]`; Timeframe `[191.7,1020,480,68]`.
    - G3 at 1160; Email `[191.7,1208,440,68]`; "Looking forward…" at 1292.
    - Terms at 1396. Button (Touch variant) `[191.7,1491.8,200,48]`.
- **Image** `[0,1539.8,1000,1226.2]`: `padding:80px 15px 0`.
  - 72px white sticky bar `[15,1619.8,970,72]`.
  - Image Container is a **column**, gap 64: the parallax box `[30,1691.8,940,640]` (P 200; img 940x840, translateY −200 at rest) and, **below it (not overlaid)**, the Contact Info row.
  - Contact Info row: spacer 161.7 | 4/6 card | spacer. Card `[191.7,2395.8,616.7,370.2]`, white, **no padding**, gap 48. Labels 14/700/22.4 #999 uppercase. Values are `<h6>` at 25/500/35, ls −0.25 (not h5 32/700). Email `[191.7,2426.2,218.6,35]`; phone at 2539.6; address lines at 2653 / 2692 / 2731.
- **Notes** `[0,2766,1000,1329.6]`:
  - Left 161.7 column is empty: no "Our thoughts" text and no Read All.
  - Middle 4/6 holds a 160 spacer, then H2 "Studio Notes" 80/700/80, ls −3.2, `[191.7,2926,616.7,80]`.
  - **Only one note** (The Logic of Emotion): 72px sticky bar, image `<a>` `[191.7,3078,616.7,800]`, date at 3910, title h6 25/500/35 (link strong 700) at 3945.8, excerpt 480 wide at 3988.8. Notes Container `padding-bottom 30`.
- No Lenis on tablet; the parallax still runs (P 200).

## 7. PHONE (390x844)

- **Let's Talk** `[0,0,390,1579.6]`: no sticky column. Section `padding:120px 0 0`, `padding 0 10`, gap 64.
  - H1 80/800/80, ls −4, `[20,120,350,80]`.
  - Form (variant "Mobile") `[20,264,350,1315.6]`, gap 64, groups row-gap 16. Every field and select is **332.5 wide** (95%):
    - G1 at 264: Name `[20,312]`, Company `[20,444]`.
    - G2 at 576: Message `[20,624,332.5,240]`, Budget `[20,928]`, Timeframe `[20,1060]`.
    - G3 at 1192: Email `[20,1240]`, "Looking forward…" at 1324.
    - Terms `[20,1420,350,47.6]` (2 lines). Button **full width 350x48** `[20,1531.6]`.
- **Image** `[0,1579.6,390,1011.2]`: `padding:40px 10px 0`; 64px sticky bar.
  - Parallax box `[20,1683.6,350,480]` with **P 0**, so the image is static (translateY 0) and 350x480.
  - Contact card below, gap 64: `[20,2227.6,350,363.2]`, gap 48. Values `<h6>` 24/500/33.6, ls −0.24. Email `[20,2258,209.8,33.6]`; phone at 2370; address at 2482 / 2519.6 / 2557.2.
- **Notes** (variant "Phone") `[0,2590.8,390,1185.6]`: column, `padding 0 10`, gap 40.
  - 120 spacer; H2 "Studio Notes" 64/700/64, ls −2.56, `[20,2710.8,350,128]` (2 lines).
  - One note: 64px sticky bar; image `[20,2902.8,350,464.6]`; date at 3399.4; title h6 24/500/33.6; excerpt `[20,3476.8,315,102.4]`.
  - **Then** the "Our thoughts on how brands, systems, and stories find their form." `<p>` (static on phone) `[20,3639.2,350,47.6]` and the Read All button `[20,3718.8,125,37.6]` (label 24/500/33.6). These sit inside a 137.2-tall container, `padding 0 10 20`, gap 32, that is nominally `sticky top:0` but does not visibly pin.
- No Lenis.

## 8. Not measured / caveats

- **The submit flow was not exercised**: no request, no Loading, Success or Error states rendered. Those states come from code (§5.3), including the spinner's 6s linear rotation and the variant spring 0.4. Whether Framer resets the form or redirects after success is unknown. The Framer form handler has no redirect configured in the props I read.
- The native validation bubble UI and the `:user-invalid` timing after a submit attempt were not tested.
- The clock text in the nav reflects live Berlin time and was not verified on other pages beyond 1440 / 1280.
- Touch behaviour (pressed state on tap, Touch variants) was emulated with a mouse only.
- The address-line char appear was not sampled frame-by-frame (it had completed before sampling). Its timing is from code.

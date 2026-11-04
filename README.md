# Möbius clone

A pixel-and-motion replica of the Framer template site https://mobius.framer.website, rebuilt in React 18 + Vite + Tailwind v3.

```bash
npm ci
npm run dev      # http://localhost:5194
npm run build
```

## Information architecture

`ia.json` is the only IA file to hand-edit. `IA.md` and `matrix.csv` are **generated** from it; never edit them directly.

```bash
node validate.mjs   # hard checks: route totals, section references, categories
node build.mjs      # regenerates IA.md and matrix.csv
```

### What the data shows

- **31 routes, 10 templates, 51 sections.** The two CMS collections, Project case study (12 routes across 2 templates) and Feed post (11), make up 23 of the 31 routes (74%). The other 8 routes are one-off pages, and that's where most of the build effort and most of the motion sits.
- **15 sections are shared and 36 are page-local.** The shared set is the five shell pieces, which are on every route:
  - nav
  - menu overlay
  - cursor
  - footer
  - clock (on 29 routes; not /work or /feed)
  The rest of the shared set is the case-study and article building blocks, plus three cross-page blocks:
  - the FAQ (4 routes)
  - Studio Notes (`/` and `/contacts`)
  - the Let's Talk form (`/` and `/contacts`)
- **The project template is split in two:** `template.project` (11 routes) and `template.project-last` (orbit-404). That's because the last case study has no "Next Project" block.
- **/work and /feed swap their whole layout at 1200px.**
  - Desktop shows a canvas or column wall with no footer.
  - Below 1200 it's a vertical list with the footer.
  Both layouts are listed in those templates, and each section's scope says which width it renders at.

### Things to know before "fixing" the data

- **The validator's notes are expected.** Its scope-vs-count notes fire on numbers that aren't route counts: breakpoints ("1200px"), "404" in paths, and "h1/h2". Every route count actually written in a scope matches the computed value.
- **Repeated sections inflate the "templates" column.** `work.project-text-block` (3× per case study) and `editorial.post-body` (2× per article) each appear more than once in their template, so the validator's per-occurrence reuse counter shows "6 templates" and "2 templates" for them. The route counts (12 and 11) are correct.
- **Look-alike sections that are deliberately separate:**
  - The three hanging-indent pull quotes (project, post, and the one inside studio careers) look alike but measure differently (e.g. letter-spacing −0.04em vs −0.03em).
  - The "Next Project." and "Featured Project." ticker teasers share a layout, but each has its own implementation.
  Both are candidates to merge into one component with props, but they aren't the same section today.
- **The Let's Talk form has two implementations.** It's rendered by `src/pages/Contacts.jsx` and by `src/components/home/LetsTalk.jsx`, both wrapping `contacts/ContactForm.jsx`. It's one section in the IA, so consolidate it into a single component before it drifts.

## Other docs

- `CLONE_SPEC.md`: /work page and shared nav, cursor and spring measurements.
- `.recon/specs/*.md`: per-template measurements of the live original (layout, typography, motion).

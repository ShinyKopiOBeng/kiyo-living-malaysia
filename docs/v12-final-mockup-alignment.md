# V12 — Final Mockup alignment

Six rounds of feedback against `FinalMockup.png`. The common thread is scale:
several chapters were built to fit rather than to fill, which left small assets
floating in large bands and made the page read as separate sections stacked
together rather than one document. This pass fixes the sizing, restores the
retail flyout, and rebuilds two chapters whose arrangement did not match the
mockup.

Everything below has to survive tablet, mobile and off-100% browser zoom. The
existing CDP harness is extended to check that.

---

## 1. UMRAH and Corporate — the set inspector and the lead plate

**What is wrong.** The inspector opens as a wide panel that is not optically
centred, and the lead photograph sits in a boxed column with a visible edge
against the section background instead of blending into it.

**What I will do.**

- Centre the inspector on both axes. A native `<dialog>` is centred by the UA,
  but ours takes `width: min(64rem, 100vw - 2rem)` with a tall media column, so
  on short viewports it anchors top and drifts. I will constrain the surface to
  `min(72rem, 94vw)` by `min(88vh, 46rem)`, centre it explicitly, and let the
  detail column scroll inside rather than growing the dialog.
- Widen the lead plate and dissolve its edge. The mockup runs the lifestyle
  image wider and lets it fade into the band. I will drop the container's hard
  edge, widen the column, and add a soft horizontal mask on the inner edge so
  the photograph melts into the sand/paper rather than stopping at a line.
- The mask is a `mask-image` gradient, which degrades to a hard edge in browsers
  that do not support it. That is an acceptable fallback, not a broken one.

## 2. Section 5 — Choose your luggage

**What is wrong.** Cards are quarter-width in a wide band, so the product shots
are small and the two action buttons wrap. The "Selected" badge is clipped by
the card frame. The catalogue still includes four bags. "Buy retail" is a bare
Shopee link. The header "Retail stores" is also a bare link, having lost the
right-side flyout it used to open.

**What I will do.**

- **Scale up.** Three cards in view instead of four on desktop, which is roughly
  a third more width each. Product image, name, swatches and both buttons scale
  with it: card padding, name size, swatch diameter and button height all go up.
- **Fix the clipped badge.** The badge is absolutely positioned at `top: -0.7rem`
  and the card has no room above it. I will give the rail top padding and let the
  badge sit inside the card's own bounds, so nothing can crop it at any zoom.
- **Luggage only.** Remove `business-backpack`, `flap-commuter-backpack`,
  `slim-laptop-brief` and `weekender-duffel` from the chooser, leaving the six
  cases and sets. The catalogue file is generated, so the filter goes in the
  component, not in generated data — re-running the asset tool must not undo it.
  The four bags stay in `productCatalogue.ts` and on disk; only the chooser
  stops offering them.
- **Buy retail opens the flyout.** It becomes a button that opens the same
  right-side panel as the header link, rather than jumping straight to Shopee.
  The visitor picks Shopee or TikTok Shop there.
- **Restore the retail flyout.** Recovered from `8137852`, which already had the
  behaviour asked for: hover opens it on a mouse, a tap or click pins it, Escape
  and an outside click dismiss it, and it locks the page behind it on small
  screens only. It gets its own component file this time instead of living
  inside `KiyoExperience`.

Because the chooser drops to six products, the test asserting ten cards changes
to assert six, and asserts the four bag names are absent.

## 3. Section 6 — Customise your logo

**What is wrong.** The current four-column grid makes the branded case small and
puts it in the second column. The mockup has it large and hard against the left
edge of the content column. "Continue to delivery" is stranded mid-row, and the
detail mosaic does not line up with anything.

**What I will do.** Rebuild the chapter on an explicit two-column grid:

```
┌───────────────────────────┬──────────────────────┐
│  heading                  │  company / programme │
│                           │  customisation chips │
│  BRANDED CASE  (large,    │  logo controls       │
│  flush left)              ├──────────────────────┤
│                           │  detail mosaic       │
│                           ├──────────────────────┤
│                           │  CONTINUE TO DELIVERY│
└───────────────────────────┴──────────────────────┘
```

- The case fills the left column and is the largest object in the chapter.
- The form, the mosaic and the button all share the right column, so they are
  the same width by construction rather than by hand-tuned values. That is what
  makes "matching same width as the delivery button" hold at every viewport.
- The button is the last row of the right column, directly under the mosaic.

## 4. Section 7 — Delivery

**What is wrong.** Six pipeline stages sit in a narrow middle column at roughly
120px each, which is where the "fragmented and unbalanced" feeling comes from.

**What I will do.** Give the pipeline the full content width as its own row
above the form, at three columns of two rows rather than six of one, so each
stage is roughly double its current size. The heading, the form and the enquiry
card keep their relationship; only the pipeline is promoted out of the cramped
middle column.

## 5. Section 8 — Clients and partner stories

**What is wrong.** Twelve logos across one static row makes each one tiny. The
partner story tiles are small enough to look like an afterthought.

**What I will do.**

- **Marquee.** Replace the twelve-column grid with a continuous right-to-left
  loop, sized so exactly **seven marks are in view** at desktop. The track holds
  the twelve marks twice so the wrap has no visible seam, and it is translated by
  exactly half the track width, which is the only offset that loops cleanly.
- It must not be scrollable by the user, per the request, so the container is
  `overflow: hidden` with no scroll affordance and the track is
  `pointer-events: none` apart from the links.
- Animation is CSS, not JS, so it costs nothing and keeps running if JS fails.
  It pauses under `prefers-reduced-motion`, where an infinite loop is exactly the
  kind of motion that rule exists to stop; there it falls back to a static wrap.
- Fewer marks fit on smaller screens, so the count steps down to five at tablet
  and three at mobile by changing one custom property.
- **Partner stories** get their own full-width row beneath the video and quotes
  instead of a cramped third column, which roughly triples each tile.

## 6. Section 9 — Samantha and recognition

**What is wrong.** The chapter is three side-by-side panels with the shelving
photograph confined to the left one. The mockup treats the whole band as one
photographed room.

**What I will do.**

- `backgroundBookshelf.png` becomes the **section background**, full-bleed and
  cover-fitted across the entire chapter.
- Samantha's transparent cut-out is pinned to the far left, bottom-aligned, so
  she stands in the room rather than in a box.
- The name, role and quote sit in the clean wall area to her right.
- `section-9-awards-display-hd.png` is positioned over the shelving on the right
  of the plate. This is the fragile part: it is aligned to a feature of a
  photograph, so it needs checking at several widths rather than trusting one
  value. I will place it with percentage offsets against the same background
  box, so the two move together as the band resizes.
- Text on a photograph needs a contrast floor, so a soft scrim sits under the
  copy only — not over the whole plate, which would grey out the shelving.

---

## Responsive and zoom

The request calls out distortion at non-100% zoom and squished or scattered
layouts at narrow widths. Both come from the same root cause: layouts pinned to
viewport units or to fixed pixel counts that stop being true when the CSS pixel
ratio changes.

Rules I will hold to:

- Card and tile widths come from `flex-basis` percentages and grid fractions, not
  from fixed `px`, so a zoom change re-flows instead of overflowing.
- The marquee is driven by a `--marks-in-view` custom property, so its geometry
  is derived rather than hard-coded per breakpoint.
- Anything absolutely positioned over a photograph (the awards shelf, the logo
  plate, the Selected badge) is positioned in percentages of its own container.
- Every new rule keeps the stylesheet flat: one authoritative rule per selector,
  which `npm test` enforces.

### Verification

The existing harness already checks fonts, decoded images, invisible reveals,
horizontal overflow, chapter order and the showcase interaction at 1440 / 834 /
390. I will extend it to cover:

- **Zoom.** Re-run every check at `deviceScaleFactor` 1.25 and 1.5, and at a
  1280x800 desktop, to catch layouts that only work at one ratio.
- **Overlap.** Assert that the Selected badge, the awards shelf and the marquee
  marks are inside their containers' bounds, which is what "blocked by the frame"
  means in a form a machine can check.
- **Marquee.** Assert seven marks are within the visible box at desktop and that
  the track is exactly twice the mark count.
- **Flyout.** Assert hover opens it, Escape closes it, and "Buy retail" opens the
  same panel.

A note on honesty: image reads are blocked for the rest of this session, so I
cannot eyeball the result. Everything above is verified structurally and
behaviourally, and Section 9's alignment of artwork to a photograph is the one
item that most warrants a human look before sign-off.


---

## Outcome

All six items implemented. Verified over CDP at eight viewport and zoom
combinations - 1440, 1280, 834, 390 and 360 wide, plus 125% and 150% zoom on
desktop and 125% on tablet:

| Check | Result |
| --- | --- |
| Cormorant Garamond on headings, Montserrat on UI | pass at every size |
| No image broken, no failed request | pass |
| No reveal target left invisible | pass |
| No horizontal overflow | pass at every size |
| Eleven chapters present and in order | pass |
| No overlay escapes its container (badge, awards, logo plate) | pass |
| Chooser offers six cases, no bags | pass |
| Marquee: two identical 12-mark runs, animating | pass |
| Section 9 shelving spans the full band | pass |
| Showcase: hover highlights, click inspects, arrows walk, Escape closes | pass |
| Retail slider: hover opens, Escape closes, Buy retail opens the same panel | pass |

`npm test` 16/16, lint and typecheck clean.

Two harness bugs were found and fixed along the way, both of which had been
reporting false failures rather than real ones:

- A lazy image that has not been fetched reports `complete === false`, not a
  broken load. The check now only counts images that tried and failed.
- React implements `onPointerEnter` by delegating `pointerover` at the root, so
  a synthetic `pointerenter` never reaches the handler. The hover test now
  dispatches what React actually listens for.

### Still worth a human look

Image reads were unavailable for this pass, so nothing below was seen, only
measured:

- **Section 9.** The awards artwork is positioned against a feature of a
  photograph. It is placed as a share of its column so the two resize together,
  but whether it lands on the shelf is the one thing a measurement cannot tell.
- **Section 3 and 4 lead plates.** The soft edge is a `mask-image` gradient;
  worth confirming the blend reads as intended rather than as a fade.
- **Sections 4, 6 and 7 plate order**, which is still the numeric export order
  of opaque filenames.

Full-page renders and per-section crops are written to
`C:/Users/Admin/Downloads/KiyoScreens` for exactly this comparison.

# V16 - The scrolling motion layer

**Status:** Approved in scope on 2026-09-18 and built the same day. Section 9
records what shipped.

**Kean's decisions on record (2026-09-18)**

- The hero keeps the airport photograph, the copy and its load-in exactly as
  they are. The picture is not replaced, not re-cropped by hand, and not
  animated. The "departure stage" concept (cut-out cases, colourways, rotating
  payoff) from the first draft of this document is **rejected** and not
  built. The prototype that showed it stays online only as a record of the
  scrolling behaviour Kean approved:
  https://claude.ai/artifact/QiroVR3dHzuWkcaWtphvZq
- No video, generated or shot.
- What ships is the **scrolling** side of that prototype: smooth scroll, the
  band sliding over the hero, photograph parallax and clip reveals on the
  openers, headline and paragraph line masks, magnetic buttons.
- The hero should be **bigger than the other chapters**: it fills the first
  screen instead of stopping at the photograph's own 2.33 : 1 height.
- Three React Bits components, asked for during the build: **ClickSpark** on
  every click, **ScrollFloat** on the warehouse claim (one line per scroll
  step with the photograph pinned behind it), and **Masonry** on the client
  handover wall, with more photographs from the client archive.
- On a phone the header drops its quote button (the menu sheet already
  carries one) and the menu sits in the right corner.
- The warehouse band's photograph is replaced, at every width, by
  `ChatGPT Image Sep 14, 2026, 12_45_27 PM.png` from the Drive folder: the
  open bay, the teal office and the lorry at dusk. The Deliver chapter's
  "Deliver to You" panel is replaced by `deliver-to-you-kiyo-logo.png`
  (Kean's 2026-09-18 render, the same scene with the KIYO mark on the boxes
  and the lorry).
- On a phone every banner shows its subject, never the cream fade baked into
  the photograph: the openers crop to a square on the subject's side, the
  band shows the office and the whole lorry above the copy, and the
  Samantha chapter becomes her portrait, then the awards shelves, then the
  copy, down the middle of the screen.

**Sources, in priority order**

1. `KIYO Branding Guideline.pdf`: unchanged, the V15 rules stand
2. The current repository (V15.1, `2da7206`)
3. `vita-travel.webflow.io`, read at source: GSAP `ScrollSmoother.create({
   smooth: 1.2, effects: true })`, `SplitText` line and character reveals,
   `fade-up-big` entrances. That is the feel Kean asked for.

---

## 1. What changes, chapter by chapter

| # | Chapter | Before | After |
| --- | --- | --- | --- |
| 1 | Hero | The photograph's own height (2.33 : 1, about two thirds of a laptop screen). Scrolls away like any block. | **Fills the first screen** at every width, the photograph covering on its existing focal point. **Sticky**: it stays where it is and the warehouse band slides over it. The photograph, the scrim, the copy and the load-in are untouched. |
| 2 | Warehouse band | Pushes the hero up. | Slides **over** the hero with a soft shadow along its top edge, then **pins** for two screen heights while the claim arrives: *Designed here.* floats up character by character, then *Prepared here.*, then *Delivered from here.*, then the place and the four capabilities. The photograph holds still throughout. The band is a full screen tall so the pin has nothing empty under it. |
| 2b | Proof numbers | Fade-up, count-up. | Unchanged. |
| 9 | Client wall | Six handovers on a fixed four-by-two grid, two spanning rows by hand. | **Twelve** handovers on a masonry: every frame at its own proportions, packed into four, three or two columns by width. The tiles float up from below, blurred to sharp, staggered, when the wall is reached; they reflow with an easing when the width changes; a tile eases in a little under the pointer. |
| 3, 4, 5, 6, 7, 9 | The six openers | Fade-up on the copy; the split opener slides its photograph in. | Bleed openers: the photograph opens from a soft inset frame the first time it enters, then moves at about 90 % of scroll speed. Headline lines and the sentence rise out of masks. The split opener (corporate) keeps its slide-in and gains the line masks. |
| 8 | Quotation | Fade-up. | The title takes the line mask; the form is unchanged. |
| 10 | Samantha and Awards | Fade-up. | The name takes the line mask; the photograph is unchanged. |
| 11 | Closing band | Fade-up. | "Ready to start?" takes the line mask; the two buttons are magnetic. |
| Page | Scroll | Native. | **Smooth**: the page eases toward where the wheel sent it (Lenis, `lerp 0.09`, about 1.2 s to settle). Keyboard, scrollbar and touch stay native. |
| Page | Click | Nothing. | A burst of eight short coral lines from the click point (ClickSpark), 420 ms, on one viewport-sized canvas. |

Nothing is added to the drifting carousels, the header, the WhatsApp dock, the
dialogs or the form.

---

## 2. Smooth scroll

**Library:** [Lenis](https://github.com/darkroomengineering/lenis) 1.3, 16 KB.

**Why Lenis and not ScrollSmoother** (which vita-travel uses, and which our
`gsap` package already contains): ScrollSmoother moves the page with a
transform inside a wrapper, so everything `position: fixed` (the header, the
WhatsApp dock) must live outside the wrapper, the native `<dialog>`s and the
native scroll carousels need special handling, and `scrollToSection` and the
chapter observer would have to be rewritten against the smoother's own scroll
position. Lenis keeps the browser's scroll and only eases it: the header
trigger, the IntersectionObservers, the sticky hero, the dock and the
carousels keep working exactly as they are.

**How it is wired**

- `app/components/smoothScroll.ts` owns one instance. `startSmoothScroll()`
  creates it (skipped under `prefers-reduced-motion`), ticks it from
  `gsap.ticker`, and feeds `ScrollTrigger.update` on every scroll.
  `getSmoothScroll()` hands the instance to whoever needs it.
- `scrollToSection` scrolls through the instance when there is one, with the
  same header offset, and falls back to `window.scrollTo` when there is not.
- `html { scroll-behavior: smooth }` is removed. It fights any script-driven
  scroll, and every anchor on the site already goes through `scrollToSection`.
- Horizontal gestures are ignored by Lenis by design, so the carousels keep
  their native horizontal scroll. The two dialogs carry
  `data-lenis-prevent`, so a wheel inside them never reaches the page.
- Touch is native (`syncTouch` off): phones do not get the smoothing, which is
  correct; smoothed touch scrolling feels sluggish.

---

## 3. The hero

Two CSS changes and one wrapper; no markup inside the hero changes.

- `min-height: max(100svh, calc(100vw / ratio))`, at every width. A laptop
  gets a full screen, the photograph covering the taller box on the focal
  point already set in `imageSlots.ts` (`74% center`), which keeps the
  traveller and the cases in frame and lets the cream fade on the left carry
  the copy as it does now; a screen wider than 2.33 : 1 gets the whole
  photograph. The `aspect-ratio` the band used to carry is gone: next to a
  `min-height`, Chrome transfers that height into the width and the box ends
  up wider than the screen (section 9).
- `position: sticky; top: 0`, at every width. Everything after the hero sits
  in one positioned wrapper (`.chapters`, `z-index: 1`, paper ground), so the
  chapters paint over the sticky hero instead of under it. The wrapper is
  the only markup change around the hero in `KiyoExperience`.
- The warehouse band gets a shadow along its top edge so the slide reads as a
  sheet coming over the picture.

---

## 4. Openers and bands

In `ChapterOpener` (bleed variant):

- **Clip reveal**, once, through the existing IntersectionObserver reveal
  system as a new variant `data-reveal="clip"`: the photograph's frame goes
  from `inset(8% 6% round 24px)` at scale 1.06 to `inset(0)` at scale 1 over
  1.1 s. Using the observer rather than a scroll trigger keeps the guarantee
  the README makes: nothing can be left invisible by a stale measurement.
- **Parallax**, scrubbed: the photograph runs from `yPercent -6` to `6` across
  the chapter's travel through the viewport, with 12 % overscan so no edge
  shows. Desktop only; under 1024 px the bleed opener's photograph is a
  static block above the copy and would show its edges. A stale start on a
  scrubbed tween only shifts the parallax by a few pixels, so this one is
  safe on ScrollTrigger.

The split opener (corporate) keeps its slide-in; parallax on a contained,
rounded photograph looks wrong. The warehouse band's photograph does not
parallax: it is pinned (section 4b).

### 4b. The warehouse band

`WarehouseBand.tsx` owns one paused timeline. Each line of the claim is a
`ScrollFloat` that joins the timeline at its own start (0, 1.5, 3 s of
timeline time); the place and the four capabilities follow at 4.2 s; a hold of
0.8 s keeps everything on screen before the band lets go. One ScrollTrigger
pins the band from `top top` for `+=200%` and scrubs the timeline over that
travel. The place and the capabilities are on the timeline rather than on the
page's observer reveals because, while the band is pinned, nothing under it
moves and the observer would never reach them.

`ScrollFloat` is React Bits' component with three changes: the characters are
split on the client by SplitText after hydration, so the served markup keeps
`<em>Designed</em> here.` and the test that checks it; the element and class
are the caller's; and a float can join a parent's timeline instead of making
its own trigger. The motion is theirs unchanged: each character starts below
the line, stretched tall and narrow, and settles with `back.inOut(2)`.

### 4b2. The phone

- **Header.** `.header-actions { margin-left: auto }` under 1024 px: with the
  nav gone, nothing pushed the menu across. Under 768 px `.header-cta` is
  hidden.
- **Openers.** Each bleed slot carries a `mobileFocalPoint` (a new optional
  field on `ImageSlot`, emitted as `--slot-mobile-position`), and under
  1024 px the bleed photograph is a 1:1 crop held on that point: `100%
  center` for the pictures whose fade is on the left (UMRAH, Choose,
  Deliver), `0% center` for the two whose fade is on the right (Personalise,
  Clients). A square keeps half the picture's width, which is the half
  without the fade on every one of them.
- **Band.** New plate, `focalPoint: "100% center"` at every width: on a
  laptop the crop keeps the bay, the office and the whole lorry. Under
  1024 px the band is a 4:5 crop of the plate's right (the whole lorry with
  the office behind it), and the copy floats on it as it does on a wide
  screen: the claim over the sky, the place under it, the four capabilities
  in one row over the tarmac (`flex-wrap: nowrap`, a smaller face). The band
  is shorter than the screen there, so the pin's spacer (`.chapters >
  .pin-spacer`) takes the navy ground and nothing cream shows under the
  pinned band; the proof strip rises into that ground as the pin ends.
- **Samantha.** Under 768 px the chapter is three rows down the middle: her
  portrait (the plate held on its left, 3:4, `mobileFocalPoint: "0% center"`),
  the shelves (`aboutAwardsSlot`, the same file a second time, zoomed by CSS
  into the shelf region so both rows of awards read), then the copy. On
  wider screens the second picture is `display: none` and the band is as it
  was.

### 4c. The client wall

`Masonry.tsx` is React Bits' Masonry with the layout turned around: the tiles
are the caller's markup (a picture and a caption) measured at their natural
height, rather than pictures given a height, so a caption can be any length
and a photograph keeps its proportions. The served markup is a plain grid,
which is also the wall with JavaScript off; a layout effect places the tiles
absolutely before the first paint. The entrance (from 160 px below, `blur(10px)`
to sharp, 0.8 s, 0.05 s apart) plays when the wall scrolls into view, through
an IntersectionObserver like the page's other reveals. Widths are written
before heights are read, so a relayout costs one reflow. Hover scale is 0.96
on a fine pointer only.

Six more photographs came out of the client archive on Drive (the same
folder as the first six; `KIYO-Clients-Picks/SOURCE.txt` records each one's
origin): Al-Waqar Travel's delivered order, the HRM team at their office,
guests at the KIYO Living grand opening, two presentations (sample cases in
a lobby, a client in the Kajang warehouse) and a container of stock being
unloaded. Captions say what the folder or the picture establishes and no
more. Two 9:16 frames are cropped to 3:4 in `imageSlots.ts` so they do not
tower over the rest. A seventh candidate, a donation to a school, was
downloaded and then dropped when its boxes turned out to be solar lights,
not luggage.

### 4d. ClickSpark

React Bits' component with two changes: the canvas is fixed to the viewport
rather than sized to its parent (the original would make a page-tall bitmap
and clear it sixty times a second), and the draw loop runs only while sparks
are alive. Brand coral, eight sparks, 18 px radius, 420 ms. It wraps the page
shell in `KiyoExperience`.

---

## 5. Line masks

`useLineReveal` in `KiyoExperience` runs once over every element marked
`data-lines`: `SplitText.create(el, { type: "lines", mask: "lines", autoSplit:
true })`, and the lines rise out of their masks (`yPercent 110 → 0`, 1 s,
0.1 s apart) the first time the element enters the viewport. `autoSplit`
re-splits when the width changes, and `onSplit` returns the tween so the
re-split reverts it cleanly.

Marked: the six opener titles and sentences, the quotation title, Samantha's
name, and "Ready to start?". The hero is not marked, and the warehouse claim
floats by character instead (section 4b). The SSR markup is unchanged (SplitText works on the client after
hydration), so `tests/rendered-html.test.mjs`'s exact-markup assertions on
the opener titles still hold.

An element that carries `data-lines` is skipped by the fade-up reveal groups
it sits in, so nothing animates twice.

---

## 6. Magnetic buttons

`data-magnet` on the hero's two buttons and the closing band's two. On a
fine pointer the button follows the pointer by a fraction of its offset
(`x * 0.18`, `y * 0.22`, at most a few pixels) through `gsap.quickTo`, and
returns when the pointer leaves. Touch devices get the plain button. The
`:hover` lift stays for every other button.

---

## 7. Guardrails

**Performance.** Only `transform`, `opacity` and `clip-path` animate. Lenis is
16 KB; SplitText is 8 KB, loaded with the page's existing GSAP. No image
changes, no new images.

**Reduced motion.** No smoother, no parallax, no clip reveal, no line masks,
no magnets. The page renders at rest and scrolls natively, as it does with
JavaScript off.

**Tests.** `tests/rendered-html.test.mjs` keeps every hero and opener markup
assertion unchanged. Three assertions are updated to describe the new
architecture (the reveal's `clearProps` also clears `clipPath`; Samantha's
heading carries `data-lines`; the band's teal verb is on a direct-child
selector), and new ones pin it down: the smoother exists and respects reduced
motion, the stylesheet does not smooth on its own, the served markup carries
no split wrappers, the one `pin` is in `WarehouseBand.tsx`, the hero is sticky
and a full screen, and `.chapters` exists. No `pin: true`, no
`ScrollTrigger.batch`, no `window.addEventListener("scroll")` enter
`KiyoExperience.tsx`.

**Brand.** No colour, type or logo change.

---

## 8. What changes in the repository

| Path | Change |
| --- | --- |
| `package.json` | `lenis` added. |
| `app/components/smoothScroll.ts` | New. The Lenis instance and its GSAP wiring. |
| `app/components/scroll.ts` | Scrolls through the instance when there is one. |
| `app/components/WarehouseBand.tsx` | New. The band, moved out of the page shell: the pin, the timeline, the claim. |
| `app/components/ScrollFloat.tsx` | New. React Bits' ScrollFloat, adapted (4b). |
| `app/components/ClickSpark.tsx` | New. React Bits' ClickSpark, adapted (4d). |
| `app/components/Masonry.tsx` | New. React Bits' Masonry, adapted (4c). |
| `app/components/TrustSections.tsx` | The handover wall is the masonry. |
| `app/components/imageSlots.ts`, `sectionAssets.ts`, `tools/build-section-assets.mjs`, `public/images/kiyo/sections/client*.webp` | Six more handover plates; `mobileFocalPoint` on the slots; the new band plate; `aboutAwardsSlot`. |
| `app/components/ImagePlaceholder.tsx` | Emits `--slot-mobile-position`. |
| `app/KiyoExperience.tsx` | Starts the smoother; wraps the shell in ClickSpark; the `.chapters` wrapper; the `clip` reveal variant; the line reveal; the magnets; `data-lines` and `data-magnet` on its own headings and buttons. |
| `app/components/ChapterOpener.tsx` | Client component now. Parallax and clip reveal on the bleed photograph; `data-lines` on the title and sentence. |
| `app/components/QuoteSection.tsx` | `data-lines` on the heading (TrustSections likewise). |
| `app/components/KiyoInteractiveSections.tsx` | `data-lenis-prevent` on the set inspector. |
| `app/globals.css` | Hero height and sticky; `.chapters`; band height, shadow and line masks; `scroll-behavior` removed; parallax overscan on the bleed media; `.line-mask`; the spark canvas; `.opener__title > span`; `.masonry`; the wall's grid rules retired; the phone rules of 4b2. |
| `README.md`, `tests/rendered-html.test.mjs` | Updated as in section 7. |

---

## 9. As built (2026-09-18)

Built as specified above, with these findings from the run in a real browser
(headless Edge, 1440 x 900 and 390 x 844, driven over the DevTools protocol
through the hero, the pinned band, the proof strip and the UMRAH opener):

- **The ratio bug.** The first cut kept `aspect-ratio` on the hero and the
  band and added `min-height: 100svh`. Chrome transfers a min-height through
  an aspect ratio into the width, so the hero measured 2100 px wide on a
  1440 px screen and the pinned band 2160 px: both photographs were cropped
  to the wrong region and the band's truck and sign were off screen. Both
  boxes now use one `min-height: max(100svh, calc(100vw / ratio))` and no
  `aspect-ratio`; the 1023 px override that reset the ratio went with it.
- **The capabilities never showed.** As observer reveals, the four labels sat
  under the observer's bottom margin for the whole pin and never moved into
  it. They and the place are on the band's timeline now (4b).
- **One word per line.** `.opener__title span { display: block }` also
  reached the spans SplitText wraps each word in while it measures line
  breaks, so "Your Jemaah." measured as two lines and the UMRAH title came
  out as seven. The rule is `.opener__title > span` now.
- Everything else behaved first time: sticky hero, `.chapters` over it, the
  pin and the three lines, 34 line masks on desktop, no console errors, phone
  layout intact with the pin working there too.

- **The wall**, checked the same way after the masonry went in: 12 tiles,
  4 columns at 1440 px and 2 at 390 px, every tile placed and visible after
  the entrance, no console errors; the phone header shows the logo and the
  menu only.
- **The phone pass** (4b2), checked at 390 x 844 on every banner: menu in
  the right corner; the band's claim and capability row floating on the 4:5
  crop with the office and the whole lorry in frame, one row each at 390 and
  360 px wide; the five bleed openers square on their subjects with no fade
  in frame;
  Samantha's portrait, the shelves and the copy centred in three rows; and
  the new band plate at 1440 x 900 with the bay, the office and the whole
  lorry in frame.

Verification: `npm run lint` clean, `tsc --noEmit` clean, `npm test` 16 of 16.

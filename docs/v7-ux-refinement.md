# KIYO V7 — UX Refinement Spec

Scope: seven requested changes across Hero, About, Corporate, UMRAH, Footer, the
WhatsApp float, and the header. This document is the contract for the
implementation that follows it.

Baseline: branch `codex/kiyo-v5-portfolio-alignment`, commit `967ca21`.

Files in play:

| File | Role |
| --- | --- |
| [app/KiyoExperience.tsx](app/KiyoExperience.tsx) | Page shell, header, hero, about, UMRAH, footer, WhatsApp float |
| [app/components/KiyoInteractiveSections.tsx](app/components/KiyoInteractiveSections.tsx) | Corporate gift gallery + dialog, UMRAH gallery |
| [app/globals.css](app/globals.css) | All styling (4161 lines, layered V4.2 → V5 → V6; V7 appends a final layer) |
| [tests/rendered-html.test.mjs](tests/rendered-html.test.mjs) | SSR assertions — must be updated where markup intentionally changes |

A note on the CSS: the stylesheet is built as successive override layers
(`V4.2 hybrid`, `V5 portfolio alignment`, `V6 refinement`). Rather than editing
rules scattered across three layers and risking a rule further down winning,
V7 edits the *authoritative* rule in place where one clearly exists, and appends
a `V7` layer for genuinely new behaviour. Every V7 rule states which earlier
rule it supersedes.

---

## 1. Home — hero

### 1a. The proof bar escapes the hero

`.hero__proofs` is currently absolutely positioned with `bottom: -4.25rem`
([globals.css:3043-3057](app/globals.css#L3043-L3057)), which deliberately
straddles the hero/about seam. That is the bug in the screenshot: the TOP 3 /
NATIONWIDE / PREMIUM row sits half outside its section.

**Change:** the proof bar becomes the last row *inside* the hero.

- `.hero` becomes a grid: `grid-template-rows: 1fr auto`.
- `.hero__copy` occupies row 1, `.hero__proofs` row 2.
- `.hero__proofs` drops `position: absolute` / `bottom: -4.25rem` and instead
  sits in flow with a bottom margin of `clamp(2rem, 4vw, 3.5rem)` so it clears
  the hero's lower edge without crossing it.
- Keep the card treatment (white surface, hairline border, drop shadow) — only
  the positioning changes.
- The existing test guard `assert.doesNotMatch(css, /\.hero \{[^}]*margin-bottom: 4\.25rem/)`
  stays satisfied; we are removing the straddle, not reintroducing it.

### 1b. Hero responsiveness — tablet

At `max-width: 1023px` the copy column is `min(38rem, 56vw)` over a full-bleed
image. That holds. Adjustments only:

- Proof bar keeps 3 columns down to 768px but tightens padding and drops the
  icon tile to `2.6rem`.
- Below 900px the proof `strong` scale steps down so "NATIONWIDE" stops wrapping.

### 1c. Hero responsiveness — mobile (the split-composition bug)

Current mobile rule ([globals.css:3701-3767](app/globals.css#L3701-L3767)) turns
the hero into three stacked grid rows — image band, then a `var(--paper)` copy
block, then the proofs. That is the "description and background divided into
above and bottom" the screenshot shows.

**Change:** on mobile the hero returns to a *single overlaid composition*.

- `.hero` stays `position: relative`, image absolutely fills it (`inset: 0`).
- `.hero__scrim` is re-enabled on mobile (currently `display: none`) with a
  **vertical** gradient — near-opaque paper at the top fading to transparent at
  ~70% — so the headline and body copy read against the image while the luggage
  stays visible at the bottom.
- `.hero__copy` sits on top of the image (`position: relative; z-index: 2`),
  no `background: var(--paper)`.
- `.hero__proofs` stays in flow as the final row: a 3-up compact row (icon
  stacked over the label, centred) at every mobile width. Stacking it one card
  per row was the original plan, but three rows push the bar out of the first
  screen, which is the thing this change exists to stop.
- Type scale reduced so the whole composition fits one viewport height:
  `h1` → `clamp(2.9rem, 12.5vw, 4.2rem)`, body → `0.88rem`, and the hero uses
  `min-height: 100svh` with the proof bar allowed to extend past it.

Acceptance: on a 390×844 viewport the headline, paragraph, both CTAs and the
airport image are visible in one composition with no paper-coloured band
splitting them.

---

## 2. About — Samantha on mobile

Current mobile rules ([globals.css:2725-2755](app/globals.css#L2725-L2755)):

```
.about        { min-height: 64rem }        /* fixed height → bottom gap */
.about__copy  { position: absolute; top: 6.4rem }
.about__portrait { right: -3.5rem; width: min(84vw, 30rem); height: 55svh }
```

Three defects follow from this: the portrait is pinned right instead of centred,
`right: -3.5rem` pushes it past the viewport edge (the dark strip on the right),
and the fixed `64rem` height leaves dead space under the portrait.

**Change:** at `max-width: 767px` the about section becomes a flow layout.

- `.about` → `min-height: auto`, `display: flex; flex-direction: column`, with
  section padding top/bottom. The background image and scrim stay absolute.
- `.about__copy` → `position: static`, full width inside the page padding,
  `transform: none`. Copy renders first.
- `.about__portrait` → `position: static`, `margin: <gap> auto 0`,
  `width: min(78vw, 26rem)`, `align-self: center`, `object-position: center bottom`.
  Zero negative offsets — this removes the right-edge strip.
- The section ends flush with the portrait's base: portrait gets
  `margin-bottom: 0` and `.about` gets `padding-bottom: 0`, so the founder image
  grounds on the section edge rather than floating above a gap.
- Scrim gradient re-aimed vertically on mobile (dark at top for the copy,
  clearing through the middle, dark again at the base behind the signature).

Acceptance: on 390×844, Samantha is horizontally centred, sits directly under
the blockquote, touches the bottom edge of the section, and there is no dark
strip on either side.

---

## 3. Corporate — clean gift covers

Today each panel's cover carries the bullets, MOQ, lead time and an "Inspect
set" button rendered *over the photograph*
([KiyoInteractiveSections.tsx:181-193](app/components/KiyoInteractiveSections.tsx#L181-L193)),
duplicating what the dialog already shows.

**Change:**

| Surface | Shows |
| --- | --- |
| Cover (rest) | Gift set name only, over a bottom scrim |
| Cover (hover/focus) | Panel expands; "See details" button fades in |
| Dialog | Everything: summary, bullets, MOQ, lead time, WhatsApp CTA, prev/next |

- `corporate-panel__details` (the `<ul>`, `<dl>` and inspect button on the
  cover) is **removed** from the cover markup entirely.
- The cover button gets a `corporate-panel__cta` ("See details") revealed on
  hover/focus, plus the set name which is always visible.
- **Expansion moves to hover.** `onMouseEnter` / `onFocus` on the panel sets
  `activeIndex`; panel 1 stays expanded by default so the row does not read as
  four uniform strips at rest. Under `@media (hover: none)` the expansion is
  disabled and all panels sit at equal width.
- **Click opens the dialog.** Clicking the cover image *or* the "See details"
  button calls `setDialogIndex(index)`. One `<button>` wraps the image and
  carries the click; the "See details" affordance is a `<span>` inside it, so
  there is no nested-interactive-element problem.
- `aria-expanded` / `aria-controls` are dropped (nothing expands in place any
  more); the button gets `aria-haspopup="dialog"` instead.
- `GiftCommercialDetails` is now used only by the dialog.

**Test impact:** `Premium mini luggage with travel essentials`, `MOQ`,
`100 sets`, `Lead time`, `6-8 weeks` and `Inspect set` currently assert against
*rendered HTML*. Once the details live only in the on-demand dialog, they are no
longer server-rendered. Those assertions move to the component-source test
(second test block, which already reads `KiyoInteractiveSections.tsx`), and the
rendered-HTML test instead asserts the four gift names plus `See details`.

---

## 4. UMRAH — remove the process row, tidy alignment

- Delete the `agency-process` block from
  [KiyoExperience.tsx](app/KiyoExperience.tsx) (the
  `['Select','Brand','Approve','Deliver']` strip) and its CSS
  ([globals.css:972-995](app/globals.css#L972-L995), plus the V4.2 override at
  2288).
- Delete the corresponding `for (const step of [...])` assertion from the test.
- Realignment, now that the trailing rule is gone:
  - `.umrah__layout` gets `align-items: stretch` so the copy column and the
    card gallery share one baseline top and bottom.
  - The UMRAH `<h2>`, paragraph, checklist and CTA are set on one left edge with
    a consistent vertical rhythm (`1.5rem` between blocks, `1.15rem` between
    list items) instead of the current mixed margins.
  - `.umrah-gallery__detail` caption aligns to the left edge of the first card
    rather than the gallery's outer padding.
  - The section closes on the standard `--section-space` bottom padding like
    every other chapter — no extra trailing margin where the strip used to be.

---

## 5. Footer — complete it

The current footer is a logo, a tagline, four anchors and a copyright line.

**New structure** (4 columns desktop → 2 columns tablet → 1 column mobile):

```
┌──────────────────────────────────────────────────────────────────┐
│  [KIYO logo]            EXPLORE      SERVICES        CONTACT     │
│  Practical travel,      About        Corporate       Shah Alam,  │
│  presented with         At a Glance  Gifting         Selangor    │
│  purpose.               Products     UMRAH Sets      hello@…     │
│  [social icons]         Location     Wholesale       WhatsApp    │
│                                      Live Commerce   Shopee ↗    │
├──────────────────────────────────────────────────────────────────┤
│  © 2026 KIYO Living. All rights reserved.                        │
│  Terms & Conditions · Privacy Policy · Shipping & Returns        │
└──────────────────────────────────────────────────────────────────┘
```

Added content: business address line, email, WhatsApp, marketplace links,
a services column, and a legal row.

**Legal pages.** The three legal links need destinations. Implementation adds
real routes so the links are crawlable and shareable:

- `app/terms/page.tsx` — Terms & Conditions
- `app/privacy/page.tsx` — Privacy Policy
- `app/shipping-returns/page.tsx` — Shipping & Returns

Each is a plain typographic document page sharing the site header/footer chrome,
with its own `metadata` export. Content will be standard, factual commercial
terms for a Malaysian retail/wholesale business (parties, orders, pricing, MOQ
and lead-time terms for corporate gifting, delivery, returns window, IP,
governing law = Malaysia; PDPA-aligned privacy notice).

> These are drafts written to a normal commercial template. KIYO should have
> them reviewed before the site goes live — flagged here so it is not assumed
> they are legally vetted.

**Outcome:** the vinext build resolves all three App Router routes. `/`, `/terms`,
`/privacy` and `/shipping-returns` each return 200 from the built worker with the
shared footer, so the in-page `<dialog>` fallback was not needed.

---

## 6. WhatsApp button — round and draggable

Current: a fixed 3.4rem square with a hairline border
([globals.css:1285-1312](app/globals.css#L1285-L1312)).

**Change:**

- `border-radius: 50%`, no border, a soft shadow, white glyph on `#25d366`,
  size `3.5rem` (`3.25rem` on mobile).
- **Draggable** via Pointer Events on a wrapping `<div class="whatsapp-dock">`:
  - `pointerdown` captures the pointer and records the offset.
  - `pointermove` translates the dock, clamped to the viewport with an 8px
    inset so it can never be dragged off-screen.
  - `pointerup` releases. If total movement stayed under **6px**, the gesture is
    treated as a tap and the WhatsApp link opens; beyond that it was a drag and
    the click is suppressed. This is what keeps a round button both movable and
    clickable.
  - `touch-action: none` on the dock so dragging does not scroll the page.
  - Position persists to `localStorage` under `kiyo:wa-dock` (wrapped in
    try/catch — private-mode browsers throw on access).
  - On `resize`, the stored position is re-clamped so it cannot end up outside a
    smaller viewport.
  - Keyboard users are unaffected: the anchor keeps its native focus and
    activation; drag is pointer-only.
  - `prefers-reduced-motion` removes the hover lift, not the drag.

---

## 7. Header — Rimowa-style blending

Rimowa's header is transparent over the hero image and resolves to a solid bar
once the hero is behind you. `SmartHeader` already tracks three modes
(`hero` / `solid` / `hidden`) — only the `hero` mode's appearance is wrong: the
V4.2 layer paints it solid paper
([globals.css:1959-1967](app/globals.css#L1959-L1967)).

**Change:**

- `.site-header--hero` → `background: transparent`, `border-color: transparent`,
  `backdrop-filter: none`, colour `var(--ink)` (the hero image is bright, so ink
  reads; the logo keeps its full-colour treatment, no invert filter).
- A soft top-down gradient veil (`transparent → rgb(249 246 239 / 0.55)`
  reading upward) is painted *behind* the header content via `::before` so the
  nav stays legible against the brightest part of the airport image without
  looking like a bar.
- `.site-header--solid` keeps the existing near-opaque paper background, hairline
  bottom border and ink text, and gains a small shadow so the transition reads.
- `--hidden` behaviour (slide up on scroll-down past the hero, return on
  scroll-up) is unchanged — it already matches the requested "appears back when
  the user scrolls".
- Transition on `background-color`, `border-color`, `box-shadow` at 260ms.

The scroll logic in `SmartHeader` needs no change; only the CSS for the `hero`
mode.

---

## Verification

1. `npm run lint` — clean.
2. `npm run test` — builds and runs the SSR assertions, updated per §3 and §4.
3. Browser check via the DevTools Protocol at 1440, 1280, 834 and 390 px wide:
   - proof bar inside the hero at every width;
   - mobile hero is one composition;
   - Samantha centred with no side strip and no bottom gap;
   - gift covers show name + "See details" only, hover expands, click opens;
   - no Select→Brand→Approve→Deliver row;
   - footer columns collapse cleanly and every legal link resolves;
   - WhatsApp button is round, drags, stays on-screen, and still opens the chat
     on a tap;
   - header is transparent on load and solid after scrolling past the hero.

## Corrections found during verification

These were caught by driving the built page in a real browser, not by the tests.

1. **Hero still used the old two-column grid.** The V4.2 layer sets
   `grid-template-columns: minmax(26rem, 0.78fr) minmax(0, 1.22fr)` on `.hero`,
   which survived V5's `display: block`. Re-declaring `display: grid` in V7
   revived it and squeezed the proof bar into the left track. V7 now sets an
   explicit `grid-template-columns: minmax(0, 1fr)`.
2. **About copy and portrait lost their stacking order on mobile.** Switching
   them to `position: static` silently dropped their `z-index`, putting them
   under the absolutely positioned scrim. They are `position: relative` instead.
3. **The "See details" chip inherited a stale coral rule.** Two layers styled
   `.corporate-panel__heading > span`, written for a gift-set label that no
   longer exists. Both are removed rather than out-specified.
4. **Legal modifier classes lost to `.legal-page p`.** A single class (0,1,0)
   cannot beat a class plus element (0,1,1), so the eyebrow, lede, updated line
   and note all rendered as plain body text. They are qualified as
   `.legal-page p.<modifier>`.
5. **A drag opened WhatsApp, then a tap stopped opening it.** Pointer capture on
   the wrapper retargets the follow-up `click` to the wrapper, so the anchor
   never saw it. Capturing on the anchor itself keeps `click` on the link, and
   the travel threshold decides whether to cancel it. Deferring capture until
   after the threshold was tried and rejected: a fast flick leaves the button
   before the first `pointermove`, so the drag never starts.
6. **The float covered the last footer link.** The footer's bottom padding now
   clears the button's default corner.

## Out of scope

- The 18 `npm audit` findings (assessed separately — dev-toolchain only).
- Copywriting changes outside the new footer and legal pages.
- Any change to the product, pillars, location or contact sections beyond what
  the shared heading/rhythm rules already apply.

---

# V8 addendum — UMRAH visibility and the Shop flyout

## 8. UMRAH cards cut off on mobile and tablet

Measured before the change, with all three cards on the page:

| Viewport | Row width | Content width | Card widths | Result |
| --- | --- | --- | --- | --- |
| 390 px | 353 | **935** | 304 / 304 / 304 | cards 2 and 3 off-screen |
| 430 px | 393 | **951** | 310 / 310 / 310 | cards 2 and 3 off-screen |
| 768 px | 707 | 707 | 365 / **159** / **159** | inactive cards are strips |
| 1024 px | 529 | 529 | 270 / **118** / **118** | worst case |
| 1440 px | 778 | 778 | 403 / 176 / 176 | fine |

Two separate causes:

- **Below 768 px** the row was a `overflow-x: auto` scroll-snap carousel with
  `width: 72vw` cards and `scrollbar-width: none`. It works if you know to
  swipe, but there is no scrollbar, no arrows and no peeking affordance, so it
  reads as broken.
- **768 to 1199 px** the flex ratios (`0.72` inactive against `1.65` active)
  squeeze the two unselected cards into 118-174 px strips. At 1024-1199 the
  two-column section layout makes it worse by giving the gallery only 529 px.

**Change:**

- `.umrah__layout` goes single-column below **1200 px** (was 1024), so the
  gallery gets the full section width instead of a 1.35fr slice.
- Below 1200 px `.umrah-gallery__cards` becomes a three-column grid: equal
  widths, `aspect-ratio: 3 / 4`, no carousel, no flex expansion.
- Below **640 px** it stacks to one column, because three columns on a phone
  would be 112 px thumbnails.
- **Card frames match the source ratio.** The three photographs are 900x1125,
  i.e. exactly `4 / 5`. The first pass framed the phone stack at `16 / 10`,
  which is twice as wide relative to its height as the source, so `cover`
  discarded half the image height; the tablet grid at `3 / 4` lost about 6%.
  Both are now `4 / 5`, so 100% of every photograph survives on both axes.
- Since every card is now the same size, the selected one carries a coral bar
  along its bottom edge tying it to the caption below.
- 1200 px and up is untouched: the expanding accordion stays as designed.

After the change: 390/430 px stack full-width, 768 px gives 3 x 228, 834 px
gives 3 x 248, 1024 px gives 3 x 304, and 1440 px is unchanged.

## 9. Shop: hover-expand flyout from the right

The Shop button opened a centred modal dialog, and `.shop-trigger` was
`display: none` below 1024 px, so the stores were unreachable on tablet and
phone entirely.

**Change:** `ShopDialog` becomes `ShopFlyout`, a panel fixed to the right edge
that slides in on `transform: translateX(100% -> 0)` over 420 ms, with the
content cascading in behind it.

Two modes:

| Mode | Opened by | Closes on |
| --- | --- | --- |
| `hover` | mouse entering the trigger | pointer leaving trigger and panel, after a 220 ms grace period |
| `press` | click or tap | clicking the trigger again, the close button, outside the panel, or Escape |

- The grace period exists so the pointer can cross the gap from the trigger to
  the panel without it snapping shut underneath.
- `visibility: hidden` keeps the closed panel out of the tab order; its
  transition is delayed by the slide duration so the exit is still visible.
- The scrim only exists below 1024 px. On a wide screen it would sit above the
  header and steal the pointer, and a hover panel should not dim the page.
- A pinned panel is dismissed by a `pointerdown` outside it, since there is no
  scrim on desktop to catch that click.
- Tapping locks body scroll only below 1024 px, where the panel is a sheet.
  A hover panel must never move the page under the pointer.
- `.shop-trigger` is now visible at every width, so the stores are reachable on
  tablet and phone.

**The panel is anchored below the header (`top: var(--header-height)`).** A
full-height drawer covers the Shop trigger the moment it opens, which swallows
the click meant to pin it and leaves no way to toggle it shut. This was caught
by driving real pointer events, not by inspection.

Verified with scripted pointer input at 1440 px (hover opens, travel into the
panel holds it, leaving closes it, click pins it, Escape closes it) and with
touch input at 390 px (tap opens the sheet with a dismissible scrim).

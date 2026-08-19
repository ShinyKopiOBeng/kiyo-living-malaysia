# KIYO V4.1 UI Layout Repair Spec

Status: proposed for approval before implementation

## Design read

KIYO is a premium Malaysian corporate travel portfolio for retail customers, corporate buyers and UMRAH agencies. The repair should preserve the existing brand, content order, navigation labels and real imagery while making the interface calmer, shorter and easier to read.

- `DESIGN_VARIANCE: 6`
- `MOTION_INTENSITY: 4`
- `VISUAL_DENSITY: 3`
- Foundation: existing Next.js, native CSS and GSAP. No new UI or animation library is required.
- Redesign mode: targeted repair, not another visual overhaul.

## Browser audit evidence

The following measurements were taken from `http://localhost:3000/#home`.

### 1920 x 900

| Area | Current measurement | Problem |
| --- | ---: | --- |
| Shared section heading | 120 to 144px | Oversized and frequently wraps into 4 to 5 lines |
| KIYO at a Glance | 1147px tall | Longer than one desktop viewport |
| Product | 1454px tall | About 1.6 viewports |
| Corporate Gifts | 1489px tall | About 1.65 viewports |
| UMRAH | 1350px tall | About 1.5 viewports |
| Contact heading | 144px, 507px tall | The headline becomes the entire composition |
| Warehouse intro | 458px tall | Consumes more than half of the visible viewport |
| Warehouse track | Starts at y=458 and ends at y=1106 | Image and caption extend below the 900px viewport |
| Warehouse pin spacer | 5462px tall | Horizontal chapter feels excessively long |
| Gift dialog | 1536 x 774 at x=0, y=0 | Anchored to the top-left instead of centered |
| Gift details column | 492px wide with 72px padding | Usable text width is too narrow and the title wraps excessively |

### 1440 x 900

- Product: 1355px tall.
- Corporate Gifts: 1413px tall.
- UMRAH: 1291px tall.
- Contact headline: 122px and 431px tall.

This confirms that the stretched feeling is caused by the shared layout scale, not only the Warehouse chapter.

## Root causes

1. `.chapter` adds up to 160px padding at both the top and bottom.
2. Shared section headings use `7.4vw` and can reach 120px.
3. Several headings have very narrow `ch` limits, forcing too many lines.
4. Product, Corporate and UMRAH combine large headings, large media stages and large section padding without a viewport budget.
5. Warehouse uses a 28svh intro plus a 72svh gallery. Track bottom padding and captions push the actual content beyond 100svh.
6. Warehouse pin distance equals the full oversized track width, producing 4356px of additional vertical scroll at 1920px.
7. The native gift dialog has width and height but no explicit centered fixed-position contract.
8. The gift dialog uses a 68/32 split. The narrow details side then loses another 144px to horizontal padding.
9. Contact uses an editorial poster scale even though it should be a practical closing CTA.

## Required changes

### 1. Repair the global chapter scale

Files:

- `app/globals.css`

Changes:

- Replace the shared desktop chapter padding with a viewport-aware vertical rhythm.
- Target approximately 72 to 96px top padding and 56 to 80px bottom padding on a 900px-high desktop.
- Reduce shared section headlines to approximately 64 to 88px on large desktop.
- Use a line height around `0.94` instead of `0.88` for non-hero headings.
- Widen headline measures where the current `7ch` or `8ch` limit creates four or five lines.
- Keep Hero and Samantha About as special compositions. Do not apply the generic section-heading scale to them.

Desktop height targets:

| Section | Target |
| --- | --- |
| KIYO at a Glance | 100 to 115svh |
| Product | 100 to 115svh |
| Corporate Gifts | 100 to 115svh |
| UMRAH | 100 to 120svh |
| Contact | 72 to 88svh before footer |

The goal is not to force clipping. The goal is to give every chapter a deliberate viewport budget.

### 2. Repair Warehouse pinning and visibility

Files:

- `app/KiyoExperience.tsx`
- `app/globals.css`

Desktop structure:

- Pin the Warehouse chapter below the 72px fixed navigation, not underneath it.
- Use a pinned content height of `calc(100svh - var(--header-height))`.
- Reduce the intro to approximately 200 to 240px at 900px viewport height.
- Set the Warehouse headline to a maximum of two lines on wide desktop.
- Give the gallery the remaining height instead of a separate hard-coded `72svh`.
- Make the complete image and caption visible inside the pinned viewport.
- Keep the first image wider, but reduce card widths to shorten the total horizontal distance.

Recommended desktop proportions:

- First card: 60 to 64vw.
- Cards 2 to 5: 44 to 48vw.
- Address card: 28 to 32vw.
- Gallery gap: 16 to 20px.
- Caption height: 96 to 120px.

GSAP requirements:

- Keep `ScrollTrigger` because the horizontal narrative is meaningful.
- Calculate distance from the actual viewport wrapper, not the full section including the intro.
- Refresh after fonts and images are ready.
- Add `anticipatePin: 1`.
- Keep exact order `1 -> 2 -> 3 -> 4 -> 5 -> address`.
- Disable pinning when viewport height is too short to show the image and caption clearly.
- Continue using native horizontal scroll snap on mobile and tablet.

Acceptance test at 1920 x 900 and 1440 x 900:

- Header remains visible.
- Warehouse heading remains readable.
- At least 75 percent of the active image is visible.
- The active card title and description are visible without extra vertical scrolling.
- Horizontal motion begins only after the chapter is correctly positioned.
- The transition from the address card into Contact does not jump.

### 3. Rebuild the Corporate Gift dialog geometry

Files:

- `app/components/KiyoInteractiveSections.tsx`
- `app/globals.css`

Dialog frame:

- Explicitly center the native dialog with fixed positioning, `inset: 0` and `margin: auto`.
- Desktop width: `min(90vw, 1200px)`.
- Desktop height: `min(82dvh, 720px)`.
- Keep at least 24px viewport clearance on every side.
- Use a 58/42 or 60/40 image-to-details split.
- Keep the whole dialog surface inside the viewport.

Details layout:

- Align details from the top instead of vertically centering a tall block.
- Reduce desktop padding from 72px to approximately 40 to 48px.
- Reduce title size to approximately 44 to 60px with a maximum of three lines.
- Keep summary and three benefit bullets.
- Remove MOQ and Lead time from both the UI and the corporate gift data model.
- Place the WhatsApp CTA and previous/next controls in one stable footer area.
- Avoid an independent details scrollbar on normal desktop sizes.
- Allow one dialog-level vertical scroll only on short screens and mobile.

Accessibility to preserve:

- Native `<dialog>`.
- Escape closes the dialog.
- Backdrop click closes the dialog.
- Focus moves to Close when opened and returns to the original trigger when closed.
- Previous and next controls retain accessible labels.

### 4. Compact Product, Corporate and UMRAH chapters

Files:

- `app/components/KiyoInteractiveSections.tsx`
- `app/KiyoExperience.tsx`
- `app/globals.css`

Product:

- Keep the image stage visually dominant.
- Reduce intro height and keep the headline to two or three lines.
- Reduce the stage from 62vh to approximately 48 to 54vh on a 900px-high desktop.
- Keep selectors, detail title, description and Shop link visible in the same chapter view where practical.

Corporate:

- Reduce the intro margin and headline line count.
- Keep the accordion at approximately 50 to 56vh rather than 66vh.
- Preserve the four-panel interaction.
- Do not reintroduce dashboard boxes or additional metadata.

UMRAH:

- Widen the copy column enough to prevent a five-line headline.
- Reduce the gallery to approximately 50 to 54vh.
- Keep all three service cards and the compact `Select -> Brand -> Approve -> Deliver` process in one coherent chapter.

### 5. Replace the oversized Contact poster

Files:

- `app/KiyoExperience.tsx`
- `app/globals.css`

Recommended layout:

- Use a restrained two-column closing composition on desktop.
- Left: headline, maximum two or three lines at approximately 72 to 88px.
- Right: the short enquiry description, WhatsApp, email and social links.
- Remove the giant centered poster treatment.
- Keep the faint KIYO mark only if it does not reduce text contrast.
- Let the footer follow naturally without a full extra empty viewport.

Mobile:

- Stack the two columns.
- Headline approximately 44 to 56px.
- Full-width WhatsApp and email actions.
- Keep social links readable and allow wrapping.

### 6. Preserve existing product and brand decisions

Do not change:

- Navigation labels or anchor IDs.
- Samantha background composition.
- Product selector names.
- Corporate gift image order.
- The three UMRAH images and services.
- Warehouse order and address-last rule.
- WhatsApp, email and social destinations.
- KIYO coral, teal, navy and warm-white palette.

Do not add:

- Another animation library.
- More oversized typography.
- Extra metadata in the gift dialog.
- Decorative scrolling effects.
- E-commerce prices, cart or product routes.

## Implementation sequence

1. Add regression tests for removed MOQ and Lead time content.
2. Adjust global chapter spacing and heading scale.
3. Repair Product, Corporate and UMRAH viewport budgets.
4. Center and simplify the Corporate Gift dialog.
5. Recalculate Warehouse layout and ScrollTrigger pinning.
6. Replace the Contact poster layout.
7. Run responsive browser QA and perform one visual refinement pass.

## Required responsive QA

- 1920 x 900
- 1440 x 900
- 1366 x 768
- 1024 x 768
- 768 x 1024
- 390 x 844
- 320 x 720

For every size verify:

- No horizontal page overflow.
- No section heading is clipped by the navigation.
- No readable content is hidden to preserve a fixed height.
- Gift dialog remains centered and fully operable.
- Warehouse images and captions are visible.
- Mobile Warehouse uses native swipe without pinning.
- WhatsApp button does not cover content or dialog controls.

## Definition of done

- Browser measurements show the repaired desktop chapters within their target height ranges.
- Gift dialog is centered and has no MOQ or Lead time content.
- Warehouse images and captions remain visible throughout the pinned sequence.
- Contact reads as a clear closing CTA rather than an oversized poster.
- `npm run lint` passes.
- `npm test` passes.
- `git diff --check` passes.
- Visual QA is completed at all required viewport sizes.

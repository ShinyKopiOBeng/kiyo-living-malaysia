# KIYO V4.2 Hybrid Design Implementation

Status: approved for implementation on 19 August 2026

## Design direction

Combine the clean, image-led composition of the current `kiyo.com.my` presentation with the stronger responsive structure and interactions already built in the local site.

- Audience: retail travellers, corporate buyers and UMRAH agencies.
- Tone: premium Malaysian travel brand; editorial, assured and practical.
- Visual system: warm white, navy, KIYO coral and teal; restrained motion; real photography.
- Technical foundation: existing Next.js/Vinext, native CSS and GSAP only.
- Do not reproduce the live site as fixed image slides. Borrow its composition, hierarchy and density.

## Page sequence

1. Home
2. About Samantha
3. KIYO at a Glance
4. Products
5. Corporate Gifts
6. UMRAH
7. Warehouse / Location
8. Contact and footer

Navigation keeps the existing `About` label and anchor.

## Section decisions

### Home

- Replace the dark full-bleed treatment with a clean 40/60 split composition.
- Use warm-white brand copy on the left and the existing traveller-and-luggage image on the right.
- Keep the headline to two or three compact lines, with one coral phrase.
- Keep one primary CTA and a short supporting line; remove the decorative scroll cue.
- Keep the existing smart header and responsive menu.

### About Samantha

- Preserve the current warehouse background, Samantha portrait and signature treatment.
- Use the stronger company story from the live site, adapted to include UMRAH.
- Keep copy on the left and Samantha on the right.
- Do not add metric cards or a bottom feature header.

### KIYO at a Glance

- Convert the oversized visual chapter into a compact proof strip.
- Use four concise pillars: Product Design, Nationwide Wholesale, Corporate Gifting and UMRAH Programmes.
- Remove the dedicated Live Commerce pillar. Live commerce may remain in company-history copy only.

### Products

- Preserve the interactive luggage inspector and real transparent product assets.
- Reduce the visual scale and keep the selector, product image and detail copy readable in one desktop chapter.
- Use a clean neutral stage without decorative image backgrounds.

### Corporate Gifts

- Replace the stretched accordion with four equal image-led cards.
- Cards remain individually clickable and open an accessible centred dialog.
- Dialog contains title, summary, three useful benefits, WhatsApp CTA and previous/next controls.
- Remove MOQ and lead-time content from the UI and data model.
- Mobile cards use native horizontal scrolling.

### UMRAH

- Keep the three approved UMRAH images and service concepts.
- Use a compact editorial composition with one clear copy column and a three-card gallery.
- Keep the Select, Brand, Approve, Deliver process as a compact supporting row.

### Warehouse

- Remove desktop pinned horizontal scrolling.
- Use an ordered photo mosaic: image 1 is dominant, images 2 through 5 follow in filename order.
- Keep all images visible and understandable without a scroll trap.
- Place Shah Alam operating context and the appointment CTA beside or below the mosaic.
- Mobile stacks the ordered images vertically.

### Contact

- Replace the oversized centred poster with a practical split closing section.
- Left: concise headline, short enquiry message and actions.
- Right: warehouse/location image and operating details.
- Keep the existing navy footer and social destinations.

## Interaction and accessibility

- Motion must communicate entrance, state or navigation feedback; no decorative scroll pinning.
- GSAP effects use scoped contexts and always clean up.
- Honour `prefers-reduced-motion`.
- Native dialogs remain keyboard operable, closable with Escape and centred within the viewport.
- Preserve semantic headings, meaningful alt text, visible focus states and adequate contrast.

## Responsive acceptance

Verify at 1920x900, 1440x900, 1366x768, 1024x768, 768x1024, 390x844 and 320x720.

- No horizontal page overflow.
- No section is clipped under the navigation.
- Home CTA is visible without scrolling on common desktop sizes.
- Product images have no unintended visual background.
- Gift cards and dialog are fully operable.
- Warehouse images appear in exact 1-to-5 order and are not hidden by pinning.
- Contact remains readable and actions do not collide with the floating WhatsApp control.

## Definition of done

- Approved hybrid composition is implemented across all eight sections.
- `npm run lint` passes.
- `npm test` passes.
- `git diff --check` passes.
- Responsive browser QA and one visual refinement pass are complete.

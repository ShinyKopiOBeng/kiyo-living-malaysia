# KIYO Website — August 2026 Asset Revision Design

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Status:** Approved by KIYO on 18 August 2026 — implementation authorised.

**Goal:** Replace the disposable review imagery with KIYO's supplied assets and turn the four affected areas into a more credible, editorial brand experience while keeping the existing navigation and conversion routes intact.

**Architecture:** This is an asset and presentation revision of the existing single-page React experience. The implementation extends the existing `KiyoExperience` component, GSAP/ScrollTrigger lifecycle, Embla carousel, CSS design tokens, and native dialogs; it does not add a CMS, commerce flow, additional page routes, or a competing animation/carousel library.

**Tech stack:** React 19, TypeScript, CSS custom properties/Grid/Flexbox, GSAP 3 + ScrollTrigger, Lenis (desktop fine-pointer only), Embla Carousel, Lucide React, React Icons, Sharp (one-time supplied-image optimization).

**Spec:** `design.md` (this approval brief and implementation plan).

## Global constraints

- Preserve the current single-page navigation and its exact order: Home, **About**, Products, Corporate, Services, Location, Contact. `About` remains named **About**.
- Reuse existing GSAP, Lenis, Embla, Lucide, and dialog patterns. Do not add Framer Motion, Swiper, another scroll library, or a UI kit.
- Use only the supplied folder assets for the revised Samantha, luggage, UMRAH, and warehouse imagery; optimise them into production WebP files under `public/images/kiyo/`.
- Keep external retail actions routed only to Shopee and TikTok, and service enquiries routed to the existing WhatsApp URL.
- Preserve `prefers-reduced-motion`, keyboard accessibility, visible focus styles, valid image alternatives, lazy loading below the hero, and mobile reading order.
- Do not introduce product specifications or founder claims that are not already supplied or verified. Proposed display copy below is subject to KIYO content approval.

---

## 1. Approved design direction

The existing dark navy, coral, teal, editorial type, and cinematic scroll language stay in place. The revision replaces the previous generated/review images with an intentional visual narrative:

| Area | New role | Desktop composition | Mobile composition |
| --- | --- | --- | --- |
| About | Founder portfolio | Warehouse background with Samantha's transparent portrait overlapping the right edge; copy occupies the left half. | Background at the top, portrait then copy in natural document order. |
| Products | KIYO luggage lookbook | Five-image editorial grid followed by a three-slide Embla carousel. | One-column image story followed by swipe carousel. |
| UMRAH | Respectful three-part story | Three vertical cards, gently staggered with equal visual importance. | Cards stack 01 → 02 → 03 without overlap. |
| Location | Real operational proof | Current horizontal scroll gallery expanded to five photographs in filename order, then the appointment card. | Native horizontal swipe/snap gallery in the same 1 → 5 order. |

### 1.1 About — Samantha founder portfolio

`About` remains the navigation label and anchor (`#about`). It becomes a full-bleed dark chapter rather than the current light manifesto.

- Background: `samantha/kiyo_warehouse_background.png`, with a navy gradient wash that keeps the copy readable.
- Foreground: `samantha/samantha_kiyo_transparent.png` anchored at the lower right; no AI retouching, crop, or signature removal.
- Copy treatment:
  - Eyebrow: `Behind KIYO`
  - Heading: `A thoughtful journey starts with people.`
  - Founder line: `Samantha Ng · Founder`
  - Support copy: a short approved description of KIYO's retail, corporate, custom-branding, and UMRAH focus.
- Proof points stay as the existing three concise chips: practical product thinking, brand-ready presentation, Shah Alam, Selangor.
- The portrait, founder line, and content must be readable when motion is off; it is not an animation-only reveal.

### 1.2 Products — luggage lookbook

The current repeated crops of one review image are replaced with an editorial lookbook. The section is visual-first and deliberately avoids adding unverified technical feature claims.

| Lookbook sequence | Supplied luggage source | Planned visual role |
| --- | --- | --- |
| 01 | `03_14_42 PM (1).png` | Wide opening image: the signature navy case. |
| 02 | `03_14_43 PM (2).png` | Tall cabin-case portrait. |
| 03 | `03_14_45 PM (4).png` | Wheels close-up: movement/detail moment. |
| 04 | `03_14_46 PM (6).png` | Handle close-up: tactile detail moment. |
| 05 | `03_14_45 PM (5).png` | Wide colour-lineup conclusion. |
| Carousel 01 | `03_14_44 PM (3).png` | Studio pedestal view. |
| Carousel 02 | `03_14_46 PM (7).png` | Airport / travel-ready scene. |
| Carousel 03 | `03_14_47 PM (8).png` | Gift-ready / corporate bridge. |

The grid uses one large landscape visual, one tall portrait, two smaller details, and a colour-lineup strip. Each image has a short caption only; images remain the primary message. The existing `Shop KIYO` chooser remains below the carousel.

### 1.3 UMRAH — three images, one calm narrative

Replace both existing UMRAH images with the supplied files, in this exact order:

1. `umrah/umrah1.png` — Journey set.
2. `umrah/umrah2.png` — Included essentials.
3. `umrah/umrah3.png` — Custom presentation.

The three figures sit beside the existing UMRAH copy on desktop. They use gentle masked reveals or opacity/transform entrances only. No rapid zooming, 3D tilting, or religious-item animation is permitted. On mobile, all three become full-width stacked cards and retain their 01–03 labels.

### 1.4 Location — warehouse sequence

Use the photos exactly in numerical filename order and do not interleave the address card between them:

1. `warehouse/warehouse 1.png` — exterior / warehouse and showroom.
2. `warehouse/warehouse 2.png` — organised stock.
3. `warehouse/warehouse 3.png` — product showroom.
4. `warehouse/warehouse 4.png` — office and client-discussion space.
5. `warehouse/warehouse 5.png` — packing and dispatch.

On desktop, image 01 is the widest opening card, images 02–05 use the existing horizontal GSAP progression, and the coral appointment card follows image 05. On touch layouts, GSAP pinning is removed in favour of the existing CSS horizontal snap behaviour.

### 1.5 Button and navigation motion

The goal is a premium, controlled response—not continuous decorative animation.

- **Shop and CTA buttons:** retain current button sizes and focus rings; add a fast coral/teal/light gradient sweep and a small arrow translation on hover/focus for fine-pointer devices only.
- **Menu trigger:** retain the accessible `button`, `aria-expanded`, and native dialog. Add a restrained background sweep and 2–3 px lift on hover/focus.
- **Full-screen menu:** when opened, use one scoped GSAP timeline: header first, links slide/fade in with a 70 ms stagger, then the enquiry CTA. Every link remains immediately present in the DOM and keyboard reachable. Closing never waits for an animation.
- **Reduced motion:** retain the full menu and content but set all optional entrance/scrub durations to zero; Lenis remains disabled as it is today.

## 2. Asset delivery plan

The zip source stays untouched at `C:\Users\Admin\Downloads\KiyoWebsiteAssets.zip`. Before implementation, the supplied PNGs will be converted once using installed Sharp into these committed, web-safe names:

| Destination | Source | Target treatment |
| --- | --- | --- |
| `public/images/kiyo/samantha-warehouse.webp` | `samantha/kiyo_warehouse_background.png` | Wide background, max 1200 px. |
| `public/images/kiyo/samantha-founder.webp` | `samantha/samantha_kiyo_transparent.png` | Alpha-preserving portrait, max 640 px. |
| `public/images/kiyo/product-{hero,cabin,pedestal,wheels,colours,handle,airport,gift}.webp` | Eight `luggage/*.png` files in the sequence above | 760 px for portrait/detail images, 1440 px for landscapes. |
| `public/images/kiyo/umrah-{journey,essentials,custom}.webp` | `umrah/umrah1.png` through `umrah3.png` | Vertical images, max 800 px. |
| `public/images/kiyo/warehouse-{1,2,3,4,5}.webp` | `warehouse/warehouse 1.png` through `warehouse 5.png` | Landscapes, max 1440 px. |

All below-the-fold `<img>` elements will use explicit source dimensions, `loading="lazy"`, and `decoding="async"`. The transparent Samantha image remains WebP with alpha; it is never flattened onto a white background.

## 3. File responsibilities

| File | Responsibility after approval |
| --- | --- |
| `app/KiyoExperience.tsx` | Typed data arrays for the new assets; semantic image/caption markup; About founder chapter; Product lookbook/carousel content; three-card UMRAH mapping; ordered warehouse mapping; scoped menu-open GSAP timeline. |
| `app/globals.css` | Founder overlay, product editorial grid, three-card UMRAH layout, five-card Location sizing, responsive breakpoints, and fine-pointer button/menu motion. |
| `public/images/kiyo/*` | Optimised supplied production assets only. |
| `tests/rendered-html.test.mjs` | Server-rendered checks for the founder, three UMRAH labels, all five warehouse images, and retained About navigation. |
| `design.md` | This approved source of truth plus the original baseline specification below. |

No package change is planned. The project already includes the appropriate stable libraries: GSAP for timelines/ScrollTrigger, Embla for carousel selection and touch drag, Lenis for desktop-only smooth scroll, and Lucide/React Icons for interface and brand icons.

## 4. Implementation plan — execute only after approval

### Task 1: Import the supplied production assets

**Files:**
- Create: `public/images/kiyo/*.webp`
- Modify: `tests/rendered-html.test.mjs`

- [x] Optimise the 18 supplied images with Sharp according to the asset-delivery table, preserving alpha for `samantha-founder.webp`.
- [x] Verify that every image opens successfully, is substantially smaller than its PNG source, and that the Samantha portrait still has transparent corners.
- [x] Add a failing asset-presence test using `access()` for `samantha-founder.webp`, `product-hero.webp`, `umrah-custom.webp`, and `warehouse-5.webp`.
- [x] Run `npm test`; confirm the new test fails before files are added and passes once all assets exist.

### Task 2: Replace the section data and semantic markup

**Files:**
- Modify: `app/KiyoExperience.tsx` (imports, `MenuDialog`, `ProductCarousel`, About through Location sections)
- Modify: `tests/rendered-html.test.mjs`

- [ ] Add typed `umrahStories` and `warehouseGallery` arrays. The warehouse array must list `warehouse-1.webp` through `warehouse-5.webp` without reordering.
- [ ] Replace the About manifesto markup with the founder composition while keeping `id="about"` and the menu label `About`.
- [ ] Replace the product bento with the mapped five-image lookbook and update the existing Embla carousel to the remaining three images.
- [ ] Render UMRAH from the three-item sequence with descriptive alternative text and labels 01–03.
- [ ] Render the five warehouse figures before the appointment card, using captions matching the approved sequence.
- [ ] Extend the rendered HTML test to assert `/images/kiyo/samantha-founder.webp`, `/images/kiyo/umrah-custom.webp`, `/images/kiyo/warehouse-1.webp`, `/images/kiyo/warehouse-5.webp`, and `About` exist in the page output.
- [ ] Run `npm test` and confirm the server-rendered content passes.

### Task 3: Implement the approved responsive visual system

**Files:**
- Modify: `app/globals.css` (About styles near the current about block; Product styles near the current product bento; UMRAH styles; Location styles; existing tablet/mobile media queries)

- [ ] Create the desktop founder background/portrait overlay with copy contrast that passes readable visual review.
- [ ] Replace product bento layout rules with the five-image editorial grid. At `max-width: 1023px`, reduce it to two columns; at `max-width: 700px`, switch to one column with no overlaps.
- [ ] Change UMRAH gallery from two to three columns on large screens and a one-column 01–03 stack below 700 px.
- [ ] Keep image 01 wide in the Location desktop rail. Ensure all five cards are swipable and snap-aligned below 1024 px.
- [ ] Check a 320 px viewport for horizontal overflow, clipped captions, and inaccessible CTAs.

### Task 4: Add controlled navigation and button interaction

**Files:**
- Modify: `app/KiyoExperience.tsx` (`MenuDialog` effect only)
- Modify: `app/globals.css` (existing `.button`, `.text-button`, `.menu-trigger`, and `.mobile-menu` rules)

- [ ] Add a scoped GSAP menu timeline that only runs after the native dialog opens; use `gsap.context()` scoped to the dialog and call `revert()` in cleanup.
- [ ] Add the documented gradient sweep and arrow treatment through CSS transitions under `@media (hover: hover) and (pointer: fine)`.
- [ ] Preserve button focus visibility, native dialog Escape handling, dialog focus placement, and the existing `aria-expanded` state.
- [ ] Verify the `prefers-reduced-motion: reduce` path skips the timeline and does not initialise smooth scrolling.

### Task 5: Validate the finished revision

**Files:**
- Modify only when a failing validation identifies a necessary correction.

- [ ] Run `npm run lint`.
- [ ] Run `npm test` (production build plus rendered HTML tests).
- [ ] Inspect desktop at 1440 px and mobile at 390 px: founder contrast, full product gallery, 3 UMRAH figures, warehouse order 1–5, Shop dialog, mobile menu, and WhatsApp link.
- [ ] Inspect a reduced-motion emulation: content is static but complete, and no pinned/horizontal scroll trap remains.
- [ ] Run `git diff --check` and review only the intentional assets, component, stylesheet, test, and `design.md` changes.

## 5. Approval checklist

Approve this design if all statements below reflect KIYO's intention:

- [x] `About` stays named **About** and becomes the Samantha founder chapter.
- [x] The Samantha assets, eight luggage images, three UMRAH images, and five warehouse images are used exactly as mapped above.
- [x] Warehouse imagery is shown in numerical filename order from 1 to 5.
- [x] Product presentation becomes an editorial lookbook rather than a technical specification grid.
- [x] The full-screen menu and buttons use refined, reduced-motion-safe interaction rather than aggressive animation.
- [x] Proposed founder and image-caption copy is acceptable, or KIYO will provide replacement wording before implementation.

---

## Existing baseline specification

## 1. Project Summary

KIYO will be a single-page, English-first corporate portfolio website with a polished, cinematic animated-scroll experience. It is not an online store.

The website must:

- Generate corporate gifting, UMRAH-set, customization, wholesale, and partnership enquiries.
- Present KIYO as a credible Malaysian travel brand and business partner.
- Showcase KIYO products, facilities, warehouse, showroom, team, and operational capabilities.
- Present only a small curated luggage collection and route consumers to Shopee or TikTok.
- Route service enquiries to WhatsApp or email.
- Contain no database, admin panel, authentication, cart, checkout, stored form submissions, CMS, or customer accounts.
- Exclude Lazada entirely.

The existing KIYO presentation at `https://kiyo.com.my/#page-3` is the main reference for the brand palette, framed visual language, and corporate positioning. The new website must rebuild that direction as responsive, accessible HTML rather than displaying entire pages as images.

## 2. Approved Navigation

The sticky single-page navigation must contain these anchors in this order:

1. Home
2. About
3. Products
4. Corporate
5. Services
6. Location
7. Contact

Section responsibilities:

- **Home:** Cinematic interactive hero and primary positioning.
- **About:** KIYO company story, mission, leadership, and verified credibility.
- **Products:** A small visual selection of luggage with Shopee and TikTok links.
- **Corporate:** Corporate gifts, bulk orders, and branded luggage programmes.
- **Services:** UMRAH sets and custom-logo services.
- **Location:** Warehouse, showroom, premises, operations, and location gallery.
- **Contact:** WhatsApp, email, social media, and shopping-platform links.

The navigation is transparent over the hero and changes into a compact light header after the visitor leaves the hero. Mobile navigation uses an accessible full-screen menu.

## 3. Brand System

### Logo

Use `Copy of For Kiyo Tiktok.png` as the authoritative KIYO logo.

Production treatment:

- Remove only the white and near-white background.
- Preserve the teal suitcase-shaped `K` icon and coral `KIYO` lettering exactly.
- Trim unnecessary empty canvas without changing proportions.
- Export a transparent production PNG.
- Create an icon-only favicon from the suitcase-shaped `K` mark.
- Keep the original source file unchanged.
- Do not redraw or regenerate the logo with AI.

Over the dark hero, the logo may sit inside a subtle frosted treatment for contrast. After the navigation changes to its light state, display the transparent logo directly on the header.

### Color palette

- Deep navy: `#092033`
- Near-black blue: `#04111E`
- Coral: `#F05A43`
- KIYO teal: `#72BEC2`
- Pale aqua: `#DDF4F3`
- Warm UMRAH gold: `#C98922`
- Warm white: `#F8F9F7`
- Charcoal: `#17212B`

### Typography

- Use **Barlow Condensed** for major corporate headings.
- Use **Manrope** for navigation, body copy, labels, and controls.
- Large all-caps headings should be used selectively, matching the current KIYO corporate presentation.
- Supporting copy must remain concise and readable even when animation is disabled.

## 4. Global Interaction Principles

- Use cinematic but controlled motion.
- Use animation to explain products and guide the story, not merely decorate the page.
- Use GSAP and ScrollTrigger for section reveals, pinned narratives, and controlled gallery movement.
- Apply smooth-scroll enhancement only on capable desktop devices.
- Preserve native scrolling on touch devices.
- Use CSS transforms and opacity for continuous movement.
- Avoid WebGL, heavy real-time 3D, custom cursors, long loaders, elastic bouncing, and scroll traps.
- Respect `prefers-reduced-motion` by disabling smooth scrolling, parallax, automatic sweeps, scrubbed movement, and pinned transitions.
- The complete page must remain readable and usable if animation is unavailable.

The attached nine-second MP4 is a motion and pacing reference only. It must not be embedded in the finished website.

## 5. Home — Cinematic Hero

### Source assets

Use the two supplied 1448×1086 hero images:

- `ChatGPT Image Jul 25, 2026, 10_48_27 PM.png`: dark base layer.
- `ChatGPT Image Jul 25, 2026, 10_54_24 PM.png`: illuminated reveal layer.

The images have identical dimensions and composition and must be registered precisely.

Create these derived assets:

- Dark environment plate with the man and luggage removed.
- Light environment plate with the man and luggage removed.
- Transparent man cutout.
- Transparent silver-luggage cutout.
- Optimized desktop and mobile versions.

Keep all original files unchanged.

### Hero copy

- Eyebrow: `KIYO · MALAYSIA`
- Headline: `Designed for every journey. Built for business.`
- Primary CTA: `Explore Corporate Solutions`
- Secondary CTA: `Shop KIYO`

The primary CTA scrolls to Corporate. The secondary CTA opens a compact choice between Shopee and TikTok.

### Torch-light interaction

The dark environment is always visible. The light environment is stacked directly above it and revealed through a feathered radial mask.

Desktop behavior:

- Pointer movement updates CSS position variables through `requestAnimationFrame`.
- The light follows with gentle interpolation instead of snapping to the pointer.
- Use a responsive spotlight diameter equivalent to `clamp(180px, 22vw, 360px)`.
- Use a broad feathered edge so the circular mask is never obvious.
- When the pointer exits the hero, ease the light toward the suitcase and reduce its intensity.
- The effect must remain inside the hero and must not obscure text or controls.

Touch behavior:

- Run one short automatic light sweep after entry.
- Allow the visitor to drag a finger across the hero to move the light.
- After inactivity, settle the light around the luggage.

Reduced-motion behavior:

- Use a fixed blended spotlight between the man and luggage.
- Disable pointer tracking, automatic sweeps, floating, and parallax.
- Keep all copy and CTAs immediately visible.

### Floating subjects

The man and luggage must be separate alpha layers.

- Man: approximately 5.8-second vertical drift, no more than 10px, with less than one degree of rotation.
- Luggage: approximately 4.6-second vertical drift, no more than 14px, offset from the man's movement.
- Pointer parallax: maximum 8px for the man and 14px for the luggage.
- Movement must feel suspended and premium, not playful or cartoon-like.

Cutouts must be inspected carefully around hair, hands, suit fabric, luggage wheels, and reflective metal. If a clean production cutout cannot be produced, do not ship visible halos or damaged edges.

### Responsive composition

- Desktop: full-bleed 16:9 art direction.
- Tablet: preserve the supplied 4:3 composition.
- Mobile: prepare a dedicated 4:5 composition so both the man and suitcase remain visible.
- Move the headline below the focal subjects on narrow screens rather than covering the face, hands, or luggage.
- Target a complete initial hero visual payload below 1.1 MB on desktop and 700 KB on mobile.

## 6. About

Headline:

`Malaysia-born. Journey-minded.`

Content:

- Concise KIYO company story.
- Mission and service philosophy.
- Approved founder or leadership profile.
- Team or workplace photography.
- Verified corporate, wholesale, distribution, and live-commerce experience.

Only confirmed rankings, figures, customer logos, and partner badges may be published. Unverified claims must be omitted rather than presented as placeholders.

Suggested transition statement:

`More than luggage. A travel partner for brands, teams, and meaningful journeys.`

Supporting proof items:

- Malaysia-based
- Corporate customization
- UMRAH travel solutions
- Nationwide capability

## 7. Products

Headline:

`Engineered for the journey ahead.`

Products are a supporting visual showcase, not a catalogue.

Show three campaign-quality luggage directions inspired by KIYO Premium Series 2:

- Midnight navy studio hero.
- Ice-blue or silver travel campaign.
- Coral or warm-gold lifestyle composition.
- An optional four-color lineup using KIYO's established palette.

Official reference product:

`https://shopee.com.my/【KIYO】-Premium-Series-2-Luggage-PC-ABS-360°-Wheels-TSA-Lock-USB-Port-Cup-Holder-i.145726523.23868198917`

Only verified features may be shown:

- PC+ABS construction
- 360-degree spinner wheels
- TSA lock
- USB port
- Cup holder

Interaction:

- Subtle hover tilt and lighting response on desktop.
- A small draggable lineup may be used on desktop.
- Use a simple swipe carousel on mobile.
- Reveal short feature labels on hover or focus.
- Do not display prices, stock, discount percentages, reviews, filters, or variants.

CTAs:

- `Shop on Shopee` → `https://shopee.com.my/kiyoliving`
- `Discover on TikTok` → `https://www.tiktok.com/@kiyoliving`

## 8. Corporate

Headline:

`Corporate gifts that travel further.`

Corporate includes corporate gifts, branded luggage, and bulk orders.

Show four solution panels:

1. Branded Luggage Sets
2. Executive Travel Kits
3. Event and Team Gifts
4. Custom Packaging and Branding

Desktop behavior:

- Use a pinned scroll sequence.
- Display a visible `01–04` progress indicator.
- Change the featured image and copy as the visitor advances.
- Use controlled depth movement rather than large rotations.

Mobile behavior:

- Use ordinary stacked cards.
- Do not use pinned or sideways scrolling.

Primary CTA:

`Discuss Corporate Gifts` → WhatsApp.

Do not publish MOQs, lead times, partner logos, or customer claims until KIYO confirms them.

## 9. Services

Services contains two clearly separated offerings:

### UMRAH sets

Headline:

`A complete travel set for a meaningful journey.`

Use the approved images:

- `Umrah-Travel.jpg`: emotional section opener.
- `UMRAH-Free-Gift.jpg`: detailed set reveal.

Sequence:

1. Transition from KIYO's cool-blue world into warm sand, amber, and gold.
2. Reveal `Umrah-Travel.jpg` as a full-height editorial photograph.
3. Place copy beside the person without covering the traveller or luggage.
4. Transition gently into `UMRAH-Free-Gift.jpg`.
5. Identify only confirmed set categories:
   - Coordinated luggage
   - Travel essentials
   - Identity and organization
   - Custom group packaging
6. CTA: `Plan an UMRAH Set` → WhatsApp.

Use restrained and respectful motion:

- Gentle image reveal and scale only.
- No 3D tilt on the prayer mat, Qur'an, or religious content.
- No playful hover effects.
- Do not alter the person, religious items, or set contents.

### Custom-logo services

Headline:

`Your logo. Their journey.`

Present a clear four-step service flow:

1. Select
2. Brand
3. Approve
4. Deliver

Show approved customization methods such as logo placement, color matching, packaging, printing, or embossing only when KIYO confirms that each method is available.

CTA:

`Discuss Custom Branding` → WhatsApp.

## 10. Location

Headline:

`Built to deliver, across Malaysia.`

Location must function as a professional operational portfolio rather than only a map.

Gallery content:

- Building exterior
- Public-facing location
- Showroom
- Warehouse
- Factory or fulfilment environment
- Inventory and packing operations
- Team and workplace environment
- Nationwide distribution capability

Desktop behavior:

- Use a vertical-scroll-controlled horizontal gallery.
- Provide clear captions for each facility area.
- End with the general location and contact action.

Mobile behavior:

- Use a swipeable gallery followed by stacked cards.
- Avoid horizontal page overflow.

Display location as:

`Shah Alam, Selangor, Malaysia`

Do not add a map, Waze link, or precise marker until KIYO confirms the exact public address.

## 11. Contact

Headline:

`Let's build your next journey together.`

Contact destinations:

- WhatsApp: `+60 13-276 7887`
- Email: `hello@kiyo.com.my`
- Location: `Shah Alam, Selangor, Malaysia`

Retail and social links:

- Shopee: `https://shopee.com.my/kiyoliving`
- TikTok: `https://www.tiktok.com/@kiyoliving`
- Instagram: `https://www.instagram.com/kiyoliving_`
- Facebook: `https://www.facebook.com/kiyoliving`
- YouTube: `https://www.youtube.com/@kiyoliving`

All service buttons lead to WhatsApp. All retail buttons lead to Shopee or TikTok. There is no stored contact form.

## 12. Floating WhatsApp Button

Display a persistent WhatsApp action in the bottom-right corner on every section.

Destination:

`https://wa.me/60132767887?text=Hi%20KIYO%2C%20I%27m%20interested%20in%20your%20products%20or%20services.`

Behavior and appearance:

- Use the recognizable WhatsApp icon.
- Desktop diameter: approximately 64px.
- Mobile diameter: approximately 56px.
- Respect device safe-area insets.
- Maintain sufficient contrast over both light and dark sections.
- Include a soft restrained glow, not a continuously pulsing animation.
- On hover or keyboard focus, reveal the label `Chat with KIYO`.
- Provide an accessible name such as `Chat with KIYO on WhatsApp`.
- Open WhatsApp in a new tab.
- Hide or reposition temporarily if it would cover an open mobile menu.

## 13. Generated Asset Plan

The website may use generated campaign assets where existing product photography is not visually strong enough.

Generate or derive:

1. Dark hero environment plate without subjects.
2. Light hero environment plate without subjects.
3. Transparent man cutout.
4. Transparent silver-luggage cutout.
5. Three product campaign scenes.
6. Product feature close-ups.
7. One corporate branded-luggage scene.
8. One executive travel-kit scene.
9. One KIYO social-sharing card.

Rules:

- Use the supplied KIYO assets and official Shopee product as references.
- Use one generation request per distinct asset.
- Do not generate foreign logos, watermarks, text, or fake partner branding.
- Generate blank product badges and apply the approved KIYO logo separately.
- Reject extra wheels, broken handles, impossible locks, malformed zippers, or inaccurate ports and cup holders.
- Keep generated luggage visually faithful to the actual KIYO product.
- Do not use generated technical imagery to claim unsupported specifications.
- Require visual approval before publishing generated product imagery.
- Preserve original and full-resolution files and ship optimized WebP or AVIF derivatives.

## 14. Technical Architecture

- Initialize the empty workspace with the Sites-supported website starter.
- Provide one public route: `/`.
- Use semantic anchors for all seven navigation destinations.
- Isolate pointer and spotlight logic inside one client-side hero component.
- Keep the remaining portfolio content static and data-driven.
- Use structured local configuration for navigation, solution cards, product previews, gallery items, and external links.
- Do not add authentication, APIs, persistence, a database, an admin panel, a CMS, checkout, or stored form handling.
- Use responsive image elements with explicit dimensions and meaningful alternative text.
- Preload only the correct hero image size and primary fonts.
- Lazy-load media below the initial viewport.
- Add `en-MY` metadata, a canonical URL, Organization structured data, and a KIYO-specific social card.
- Publish a private Sites preview after a successful production build.
- Move to public-domain publication only after KIYO approves the content and generated images.

## 15. Component and Animation Stack Matrix

### Core stack

| Layer | Selected tool or stack | Role |
| --- | --- | --- |
| Website runtime | Sites-supported Vinext starter, React, and TypeScript | Single-page component structure, typed content configuration, and Sites-compatible output. |
| Styling | Vanilla CSS, CSS custom properties, CSS Grid, Flexbox, container queries, and media queries | Precise art direction, responsive layouts, brand tokens, masks, transitions, and reduced-motion behavior without a utility-framework dependency. |
| Scroll animation | `gsap` with `ScrollTrigger` | Pinned narratives, scrubbed sequences, horizontal gallery movement, section entrances, and coordinated timelines. |
| Smooth scrolling | `lenis` | Desktop-only scroll interpolation and coordination with ScrollTrigger; disabled on touch-first and reduced-motion configurations. |
| Carousels | Stable `embla-carousel-react` release | Accessible dragging, snapping, mobile swiping, product lineup, and location gallery fallback. Do not use a release-candidate version. |
| Brand icons | `@fortawesome/react-fontawesome` with `@fortawesome/free-brands-svg-icons` | WhatsApp, TikTok, Shopee where an approved icon is available, Instagram, Facebook, and YouTube. Import only used icons. |
| Interface icons | `lucide-react` | Menu, close, arrow, luggage, lock, warehouse, map-pin, email, and other non-brand interface symbols. |
| Image generation | Built-in image-generation workflow | Hero plate edits, approved luggage campaign scenes, feature close-ups, corporate visuals, and social card. |
| Image preparation | `sharp` as a development-only asset processor | Resizing, cropping, white-background removal for the logo, alpha checks, and AVIF/WebP derivatives. |
| Transparent generated cutouts | Image generation on a removable chroma-key background plus the installed chroma-removal helper | Man and suitcase alpha assets; outputs require edge inspection before use. |
| Deployment | Sites packaging and hosting workflow | Private preview deployment followed by approved production publication. |

Preserve the starter's package manager and lockfile. Add only the selected dependencies, and use the current stable release compatible with the initialized project rather than hard-coding versions in advance.

### Component-by-component mapping

| Component or effect | Implementation stack | Exact responsibility |
| --- | --- | --- |
| Page shell | React + TypeScript + semantic HTML | Render the one-page structure and typed content arrays for navigation, products, corporate solutions, services, gallery items, and external links. |
| Responsive layout | CSS Grid, Flexbox, `clamp()`, container queries, and media queries | Control desktop, tablet, and mobile composition without JavaScript breakpoint logic. |
| Sticky navigation | React + native `IntersectionObserver` + CSS transitions | Detect whether the hero is visible and switch between transparent and light header states. No scroll polling. |
| Anchor navigation | Lenis `scrollTo` on enhanced desktop; native `scrollIntoView` fallback | Scroll to Home, About, Products, Corporate, Services, Location, and Contact while preserving keyboard and URL-anchor behavior. |
| Mobile menu | React state + CSS transform/opacity transitions | Open and close the full-screen menu, lock background scrolling, restore focus, close on Escape, and expose correct `aria-expanded` state. |
| Shop chooser | React state + CSS transitions | Show only Shopee and TikTok destinations; support click, keyboard, outside-click, and Escape dismissal. |
| Hero image composition | Native `<picture>` elements + absolutely positioned CSS layers | Stack responsive dark plate, light plate, man cutout, and luggage cutout without canvas or WebGL. |
| Cursor torch | Native Pointer Events + `requestAnimationFrame` + CSS custom properties + CSS `mask-image` radial gradient | Track the pointer once per frame, interpolate spotlight coordinates, reveal the light layer, and ease to the luggage after pointer exit. GSAP is not required for this continuous effect. |
| Touch torch | Pointer Events + CSS mask variables + a small GSAP one-time timeline | Run one automatic sweep, permit finger dragging, and settle the light after inactivity. |
| Hero entrance | GSAP timeline | Reveal the header, hero copy, CTAs, environment, man, and luggage in a coordinated opening sequence inspired by the supplied MP4. |
| Floating man and luggage | GSAP timelines using `x`, `y`, and `rotation` transforms | Run separate phase-offset floating loops; pause or remove them for reduced-motion users and hidden tabs. |
| Hero pointer parallax | Pointer Events + `requestAnimationFrame` + GSAP `quickTo` or equivalent setters | Apply small independent movement to the man and luggage without triggering React renders on every pointer event. |
| Hero scroll departure | GSAP ScrollTrigger | Reduce hero depth, move copy, and transition into the light About section without pinning the visitor unnecessarily. |
| About statement reveal | GSAP ScrollTrigger + line-level spans | Reveal headings and supporting lines as groups. Do not add a separate text-splitting library or animate every character. |
| Proof items | CSS Grid + GSAP stagger | Reveal approved proof blocks when they enter the viewport; keep them static when motion is reduced. |
| Product lineup | Embla Carousel + CSS transforms + GSAP entrance timeline | Provide drag/swipe, snap points, focusable navigation, and subtle card depth. Embla controls navigation; GSAP only controls decorative entrance and hover emphasis. |
| Product card hover | CSS transitions and pointer media query | Apply tilt, scale, border, and lighting changes only on devices that support hover. Touch users receive the same content without tilt. |
| Product feature story | GSAP ScrollTrigger timeline | Pin on large screens, change the feature image and copy by scroll progress, and replace the pinned layout with stacked content on mobile. |
| Corporate `01–04` sequence | GSAP ScrollTrigger + React-rendered data | Pin the visual stage, update progress, crossfade approved imagery, and move copy. Use `gsap.matchMedia()` to remove pinning below the desktop breakpoint. |
| Corporate cards on mobile | CSS Grid or vertical flow | Present all four solutions without ScrollTrigger pinning or sideways scrolling. |
| UMRAH chapter transition | GSAP ScrollTrigger + CSS color variables | Transition the page from cool navy/teal to warm sand/gold while keeping the supplied images unchanged. |
| UMRAH image reveals | GSAP timeline + CSS `clip-path` or overflow masks | Reveal the two approved photographs gently; no 3D tilt, rapid zoom, or animation of religious items. |
| Custom-logo process | React-rendered four-step list + CSS Grid + GSAP stagger | Present Select, Brand, Approve, and Deliver with a progressive line and accessible static fallback. |
| Location desktop gallery | GSAP ScrollTrigger horizontal translation | Translate a wide gallery in response to vertical scrolling, calculate distance responsively, and release cleanly at the end. |
| Location mobile gallery | Embla Carousel | Replace horizontal ScrollTrigger with native-feeling swipe and snap controls on touch layouts. |
| Optional gallery expansion | Native `<dialog>` + React state | Show a larger approved facility image with focus containment, Escape close, and no separate modal library. |
| Floating WhatsApp action | Semantic `<a>` + Font Awesome `faWhatsapp` + fixed CSS positioning | Link directly to the approved `wa.me` URL, respect safe-area insets, expose an accessible name, and reveal `Chat with KIYO` on hover or focus. |
| WhatsApp glow | CSS `box-shadow` and transition | Provide a restrained static glow and hover emphasis. Do not use an infinite pulse animation. |
| Contact and footer | Semantic HTML + CSS Grid + Font Awesome brand icons + Lucide interface icons | Present WhatsApp, email, location, social profiles, Shopee, and TikTok with correct external-link behavior. |
| Reduced-motion mode | CSS `prefers-reduced-motion`, `gsap.matchMedia()`, ScrollTrigger cleanup, and Lenis shutdown | Remove interpolation, parallax, spotlight tracking, floating loops, scrubbed movement, and pinning while retaining the complete reading order. |
| Responsive images | `<picture>`, `srcset`, `sizes`, native lazy loading, and Sharp-generated derivatives | Serve the correct AVIF/WebP size for each viewport and avoid loading desktop media on mobile. |
| Social sharing card | Built-in image generation + site metadata | Produce one approved KIYO-specific Open Graph image after final copy and visual direction are locked. |
| SEO | Framework metadata + JSON-LD | Provide `en-MY` metadata, canonical URL, Organization schema, and approved social-profile references. |

### Animation ownership rules

- GSAP owns timeline-based, scroll-linked, pinned, entrance, and floating animation.
- Lenis owns only desktop scroll interpolation and must not animate individual components.
- Embla owns dragging, swiping, snapping, and carousel selection state.
- Native browser APIs own visibility detection, pointer input, animation-frame scheduling, anchors, dialogs, and accessibility state.
- CSS owns layout, masks, responsive art direction, hover/focus transitions, color themes, and reduced-motion defaults.
- React owns content composition and discrete UI state; it must not rerender on every pointer or scroll frame.
- Do not add Framer Motion, Locomotive Scroll, Swiper, Three.js, or another overlapping animation/carousel system.

### Official implementation references

- GSAP ScrollTrigger: `https://gsap.com/docs/v3/Plugins/ScrollTrigger/`
- Lenis: `https://www.lenis.dev/`
- Embla stable API: `https://www.embla-carousel.com/docs/v8/api/options/`
- Font Awesome React: `https://docs.fontawesome.com/web/use-with/react/`

## 16. Accessibility and Fallbacks

- Navigation, mobile menu, shop chooser, and all CTAs must be keyboard operable.
- Every control must have a visible focus state.
- The floating WhatsApp icon must include an accessible text label.
- Maintain logical heading hierarchy and semantic landmarks.
- Provide descriptive alternative text for product, facility, corporate, and UMRAH imagery.
- Do not encode essential information only through animation, color, hover, or pointer position.
- Reduced-motion mode must show the complete experience without smooth scrolling, parallax, spotlight tracking, or pinned transitions.
- Touch devices must not depend on hover.
- If JavaScript fails, all content, navigation links, and external destinations must remain accessible.

## 17. Performance Targets

- Initial hero visual bundle: below 1.1 MB desktop and 700 KB mobile.
- Avoid loading all gallery and generated assets during the initial viewport.
- Use AVIF or WebP for photographs and alpha WebP or optimized PNG for transparent cutouts.
- Keep continuous animation to transforms, masks, and opacity.
- Run pointer calculations at most once per animation frame.
- Avoid large animation libraries beyond the selected scroll and motion system.
- Do not autoplay unnecessary video or background media.

## 18. Acceptance Criteria

The website is complete when:

- The navigation contains Home, About, Products, Corporate, Services, Location, and Contact in the approved order.
- All navigation anchors scroll to the correct sections.
- The transparent KIYO logo is clean and undistorted.
- Dark and light hero layers align without ghosting.
- The torch edge is soft and does not reveal a rectangular or circular seam.
- The torch follows the pointer smoothly and stays inside the hero.
- Man and luggage cutouts have no visible halos or damaged edges.
- Floating motion remains subtle and smooth.
- Mobile presents a usable hero without covering the main subjects.
- Reduced-motion mode disables nonessential movement.
- Corporate includes corporate gifts and bulk-order content.
- Services includes UMRAH sets and custom-logo services.
- Location includes warehouse, showroom, premises, and operational gallery content.
- Product imagery accurately reflects KIYO luggage and routes visitors to Shopee or TikTok.
- The floating WhatsApp button remains visible, accessible, and links to `+60 13-276 7887`.
- All service CTAs lead to WhatsApp.
- Email, Shopee, TikTok, Instagram, Facebook, and YouTube links are correct.
- No Lazada, database, admin interface, stored form, checkout, cart, pricing, account, or dead button exists.
- Mobile has no horizontal overflow or scroll trapping.
- Production build succeeds.
- A private Sites preview is ready for KIYO's final content review.

## 19. Final Locked Decisions

- Single-page portfolio website.
- English-only first release.
- Cinematic, controlled smooth-scroll experience.
- KIYO main design remains the brand and layout foundation.
- The supplied logo is authoritative and will use a transparent background.
- The supplied dark and light hero artwork powers the torch effect.
- The man and luggage float independently when clean production cutouts are available.
- The attached MP4 is a reference only.
- The two supplied UMRAH images are approved section assets.
- Products are a curated visual preview rather than an e-commerce catalogue.
- Corporate covers corporate gifts and bulk orders.
- Services covers UMRAH and logo customization.
- Location covers facilities, warehouse, showroom, operations, and general location.
- All enquiries go to WhatsApp or email.
- All consumer shopping goes to Shopee or TikTok.
- No database, admin panel, CMS, authentication, cart, checkout, or stored forms.
- A persistent WhatsApp button appears at the bottom-right throughout the page.

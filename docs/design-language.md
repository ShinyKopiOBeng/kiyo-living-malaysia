# KIYO V5 — Portfolio Alignment Design

**Status:** Draft for KIYO approval

**Date:** 19 August 2026
**Implementation gate:** No page code or production assets are to be changed until this document is approved.

## 1. Design intent

V5 aligns the current responsive website with the clarity of the original KIYO corporate portfolio without rebuilding the whole experience again.

> **Original KIYO corporate clarity + modern portfolio UI + selective premium interaction.**

The first four business-facing chapters must read as one coherent narrative:

`Home → Core Business Pillars → Premium Luggage Collection → Corporate Gifting`

The remaining accepted chapters continue naturally afterward:

`About Samantha → UMRAH → Warehouse / Location → Contact`

### Design read

- **Audience:** retail travellers, corporate buyers, wholesale partners and UMRAH agencies.
- **Brand character:** established Malaysian travel company; premium, credible and practical rather than experimental.
- **Visual intensity:** 6/10 — strong editorial scale and photography, with disciplined spacing.
- **Motion intensity:** 4/10 — short entrances and useful state transitions only.
- **Information density:** 3/10 — concise portfolio storytelling rather than a catalogue or product configurator.

The site must not resemble an e-commerce storefront, SaaS dashboard, product-feature microsite or UI-effects showcase.

## 2. Source priority and locked scope

Decisions follow this order:

1. `KIYO_V5_Portfolio_Alignment_Codex_Prompt.md`
2. `KiyoWebsiteAssets (3).zip`
3. Original `kiyo.com.my` positioning and copy direction
4. Latest repository implementation
5. V4/V3 material only where it does not conflict with V5

V5 meaningfully redesigns only:

- Home
- At a Glance
- Product
- Corporate Gifts

The following are locked and may receive only small spacing, overflow or accessibility repairs:

- About / Samantha composition
- UMRAH architecture and its three approved images
- Warehouse / Location architecture and image order `1 → 2 → 3 → 4 → 5 → address`
- Contact composition
- SmartHeader behavior
- mobile menu and Shop KIYO dialog
- existing WhatsApp, Shopee and TikTok destinations

This document supersedes the conflicting V4.2 decisions for Product, At a Glance and Corporate Gifts. In particular, V5 removes Product Inspector, restores five business pillars, and restores MOQ / lead-time content for corporate gift sets.

## 3. Page structure and navigation

The single-page flow remains:

1. Home
2. About
3. At a Glance
4. Products
5. Corporate Gifts
6. UMRAH
7. Warehouse / Location
8. Contact

The navigation label **About** and its current anchor remain unchanged.

### SmartHeader

- At the Hero: transparent and visually integrated with the banner.
- Scrolling down: hidden to protect viewing space.
- Scrolling up below the Hero: warm-white solid header.
- Returning to the Hero: transparent again.
- Do not return to separated floating logo/menu cards.
- Header and mobile controls retain 44px minimum targets, visible focus, and clear contrast over both bright and dark regions.

## 4. Visual system

### Palette roles

| Role | Treatment |
| --- | --- |
| Deep navy / dark teal | Primary typography, dark chapters, modal text |
| KIYO teal | Icons, rules, eyebrows, focus accents |
| KIYO coral | Selected headline words, primary CTAs, numbering |
| Warm white | Main page canvas and pale cards |
| Light neutral grey | Dividers, secondary text and quiet surfaces |

Coral is reserved for `YOUR JOURNEY`, `COLLECTION`, `SOLUTIONS`, CTA emphasis and small numbering. Teal is reserved for icons, section labels and structural accents. No new accent color is introduced.

### Typography and spacing

- Use the current editorial display face for major headings and the current sans-serif body system.
- Headings use deliberate line breaks, not viewport-driven oversized wrapping.
- Body copy uses comfortable line lengths of roughly 45–70 characters.
- Desktop sections use generous vertical rhythm but must not force every chapter to a fixed viewport height.
- Images preserve their natural story and are never stretched to fill arbitrary containers.
- Radius and shadows stay restrained; this is a portfolio, not a card-heavy product UI.

## 5. Home

### Purpose

The opening should establish KIYO as a Malaysian travel brand with product, live-commerce, wholesale and corporate-gifting capability—not advertise one suitcase alone.

### Asset and composition

- Source: `banner/herobanner.png` (`1916 × 821`).
- Production target: `/images/kiyo/home-hero-airport.webp` with responsive derivatives as needed.
- Full-bleed banner, with copy occupying approximately the left 38–42% and the traveller/luggage scene protected on the right 58–62%.
- The source already provides left-side negative space. Add only a subtle warm-white-to-transparent readability gradient if required.
- Hero content must sit below the header safe area and remain visible at common 768–900px desktop heights.
- No torch, radial reveal, floating surreal elements, marquee, glass panel or competing second headline.

### Copy

Headline:

```text
DESIGNED FOR
YOUR JOURNEY
```

`DESIGNED FOR` uses deep navy; `YOUR JOURNEY` uses KIYO coral.

Body:

> KIYO is a Malaysia-based premium brand specialising in travel, live-commerce, wholesale distribution, and corporate gifting solutions. We deliver quality, innovation, and reliability for every journey.

Actions:

- Primary: `DISCOVER KIYO →` → `#about`
- Secondary: `WATCH OUR STORY` → `#about` unless an approved story video exists; no fake player is added.

### Proof strip

Three pale proof boxes overlap the lower Hero boundary without covering the luggage or traveller:

| No. | Icon | Title | Copy |
| --- | --- | --- | --- |
| 01 | Trophy | `TOP 3` | `TikTok Luggage` / `Live Selling Brand` |
| 02 | Truck | `NATIONWIDE` | `Wholesale` / `Distribution` |
| 03 | Gift | `PREMIUM` | `Corporate` / `Gifting Solutions` |

Treatment: teal icon container, navy type, subtle dividers, small radius and quiet shadow. Desktop uses three columns. Mobile uses a readable stacked layout rather than a clipped horizontal strip.

## 6. About / Samantha — preserve

No redesign is approved for this chapter.

- Keep the warehouse background, Samantha portrait, signature position and founder composition.
- Preserve readable copy on the left and Samantha on the right.
- Do not add a lower feature header or metric strip.
- Only correct spacing, crop or overflow if V5 changes around it expose a regression.

## 7. At a Glance — Our Core Business Pillars

### Composition

Replace the current light four-card presentation with a dark, icon-led corporate chapter:

```text
| INTRO | 01 | 02 | 03 | 04 | 05 |
```

- Deep KIYO navy with a restrained tonal gradient.
- Intro column on the left; five capability columns to the right.
- Thin vertical dividers instead of large card containers.
- Teal line icons, white headings, muted supporting copy and small teal rules.
- No capability photographs and no empty 2×2 white grid.

Intro:

- Eyebrow: `OUR CORE`
- Heading: `BUSINESS PILLARS`
- Support: `Five pillars. One mission. Delivering excellence at every touchpoint.`
- CTA: `EXPLORE OUR SOLUTIONS →` → Products

### Exact pillars

| No. | Icon | Title | Description |
| --- | --- | --- | --- |
| 01 | Smartphone | Viral TikTok Campaigns | Powering brand growth through content, live engagement, and community. |
| 02 | Truck | Nationwide Wholesale Distribution | Strong supply chain and warehouse capacity across Malaysia for seamless delivery. |
| 03 | Gift | Premium Corporate Gifting Solutions | Customised premium gifts for businesses, events, and institutions. |
| 04 | TrendingUp | Live-Commerce Ecosystem | Empowering hosts, affiliates and creators to grow together through live commerce. |
| 05 | Globe2 or Handshake | Strategic Partnerships | Collaborating with brands and organisations for long-term success and shared growth. |

UMRAH is not a pillar here because it retains its own dedicated chapter.

On mobile, the intro appears first and the five pillars stack in document order. This is preferred over a horizontal swipe because it avoids hiding essential business positioning.

## 8. Product — Premium Luggage Collection

### Architecture decision

Remove Product Inspector from the rendered experience. Do not retain hidden tabs or state for Overview, Colours, Handle, 360 Wheels, Security Lock, Studio or Travel.

The new chapter is a concise portfolio overview:

- Heading: `PREMIUM LUGGAGE COLLECTION`
- `PREMIUM LUGGAGE` in deep navy; `COLLECTION` in coral.
- Support: `Curated travel solutions designed for style, durability, and every journey.`

### Desktop composition

- Left 64%: large product banner.
- Right 36%: retail/wholesale proof, showroom image and CTA.

Product banner:

- Source: `banner/product banner.png` (`1586 × 992`).
- Production target: `/images/kiyo/product-collection-hero.webp`.
- Show the complete navy case with handle and wheels protected from accidental crop.
- The beige studio scene is part of the approved source artwork. No additional stage background, decorative panel or text overlay is placed behind/on top of it.

Proof column:

- Teal retail/wholesale line icon.
- Heading: `RETAIL & WHOLESALE READY`
- Copy: `From individual travellers to global partners, KIYO delivers premium quality, reliable supply, and exceptional value.`
- Reuse the approved current showroom image.
- CTA: `EXPLORE PRODUCTS →` opens the existing Shop KIYO destination dialog.

Tablet may stack the content if the 64/36 split becomes cramped. Mobile order is heading → product banner → proof copy → showroom → CTA. No Handle/Wheels/Lock feature cards return.

## 9. Corporate Gifts

### Framing

- Heading: `CORPORATE GIFTING SOLUTIONS`
- `CORPORATE GIFTING` in deep navy; `SOLUTIONS` in coral.
- Support: `Custom logo printing, thoughtful event gifting, and premium brand experiences — designed to leave a lasting impression.`
- CTA: `ENQUIRE FOR CORPORATE GIFTS →` → existing corporate WhatsApp URL.

### Gallery behavior

Keep the four approved gift images, selectable gallery, inspect dialog and WhatsApp flow. Desktop uses a four-panel accordion:

- Inactive panels show image, number and set title.
- Active panel expands and exposes the title, three details, MOQ / lead time and `INSPECT SET`.
- Important offering details are visible before opening the dialog.
- The dialog is an enlarged inspection layer, not the only source of information.

Mobile uses four stacked disclosure panels. Titles and key details remain readable without hover or modal interaction.

### Exact content

| Set | Title | Details | Commercial line |
| --- | --- | --- | --- |
| 01 | Branded Luggage + Travel Amenities Set | Premium mini luggage with travel essentials; Neck pillow, wireless fan & headphones; Custom logo printing available | MOQ 100 sets · Lead time 6–8 weeks |
| 02 | Team Building Outdoor Kit | Handpicked outdoor & team bonding items; Durable, practical & adventure-ready; Custom logo printing available | MOQ 100 sets · Lead time 6–8 weeks |
| 03 | Mini Luggage Travel Kit | Compact luggage with everyday travel must-haves; Organized, lightweight & easy to carry; Custom logo printing available | MOQ 100 sets · Lead time 6–8 weeks |
| 04 | A5 Notebook Gift Set | A5 notebook, pen & thermos bottle (300ml); Elegant gift box packaging; Custom logo printing available | MOQ 100 sets · Lead time 6–8 weeks |

The inspect dialog contains the enlarged image, the same details, MOQ, lead time, previous/next controls and WhatsApp CTA. It must fit within the viewport, scroll internally only when needed, close with Escape and return focus to its trigger.

## 10. Preserved chapters

### UMRAH

- Keep the current three-image interactive composition and existing service architecture.
- Keep the approved image order and content.
- Only repair spacing/overflow regressions; do not restyle it into a new chapter.

### Warehouse / Location

- Keep the current accepted story architecture.
- Preserve strict sequence `warehouse 1 → 2 → 3 → 4 → 5 → address`.
- Images must stay visible and understandable at the sticky/fixed reading position.
- Small scroll-offset repairs are permitted if a header or viewport change clips the media.

### Contact

- Keep the accepted closing composition and existing destinations.
- Ensure the floating WhatsApp control does not overlap actions at narrow widths.

## 11. Asset plan

Only two new V5 production assets are mandatory for the redesigned chapters:

| Role | ZIP source | Production target | Status |
| --- | --- | --- | --- |
| Home hero | `banner/herobanner.png` | `/images/kiyo/home-hero-airport.webp` | Final after optimization |
| Product hero | `banner/product banner.png` | `/images/kiyo/product-collection-hero.webp` | Final after optimization |

Existing approved gift, Samantha, UMRAH and warehouse assets remain in use. The extra luggage images in the ZIP are retained for future work but are not required in the V5 rendered Product chapter.

`imageSlots.ts` will:

- point `heroSlot` to the final airport asset with accurate dimensions, alt text and focal point;
- add a simple `productCollectionSlot` for the final Product banner;
- reuse the current final showroom slot;
- stop rendering capability image slots;
- retain old product files until references and tests confirm they are safe to remove.

Alt direction:

- Hero: describe the KIYO luggage group and travellers in a bright airport terminal.
- Product: describe the premium navy KIYO case in a warm studio setting.
- Avoid marketing claims in alt text.

## 12. Component and library decisions

Use the existing React/Next/Vinext stack. No new library is required.

| Concern | Decision |
| --- | --- |
| Product | Replace rendered `ProductInspector` with `ProductCollectionOverview` |
| At a Glance | Replace `capabilities` with exact five-item `businessPillars` data |
| Corporate | Refine existing `CorporateGiftGallery`; keep native dialog behavior |
| Icons | Existing `lucide-react` and, only if needed, current React Icons |
| Motion | Existing GSAP + ScrollTrigger, scoped and cleaned up |
| Layout | Native CSS Grid/Flexbox; no UI framework or card library |
| Dialogs | Existing accessible native dialog pattern |

Remove dead Product Inspector, feature-tab and obsolete capability-image CSS after the replacement is verified. Do not remove active Corporate, UMRAH, Warehouse or SmartHeader styling.

## 13. Motion

- Home: one entrance sequence—banner fade/scale, headline stagger, proof-strip stagger.
- At a Glance: icon and copy stagger once when the chapter enters.
- Product: one light image/copy reveal; no switching or tab animation.
- Corporate: retain accordion and dialog transitions as the main interactive moment.
- No looping animation, decorative pinning, pointer-follow effect or auto-advancing content.
- `prefers-reduced-motion` shows the full final state immediately and disables scrubbed or interpolated movement.

## 14. Responsive rules

Review at `1920×1080`, `1440×900`, `1280×800`, `1024×768`, `768×1024`, `390×844` and `320×720`.

- No horizontal page overflow at 320px.
- No chapter is cut off by a fixed viewport height or header.
- Hero text stays readable and its proof boxes do not cover the luggage subjects.
- Five pillars remain legible without compressed desktop columns leaking into tablet.
- Product handle and wheels remain visible; no artificial background is added.
- Corporate details are readable before opening the dialog.
- Dialog never renders partly outside the viewport.
- Locked Samantha, UMRAH, Warehouse and Contact layouts do not regress.

## 15. Accessibility and performance

- Semantic section headings and landmarks.
- Real buttons for accordion and dialog controls.
- Visible keyboard focus and 44px minimum targets.
- Escape closes dialogs; focus returns to the initiating control.
- No important information depends on hover, color or animation.
- Meaningful alt text and native lazy loading below the Hero.
- Responsive WebP/AVIF derivatives where beneficial; do not load unused gallery media above the fold.
- Animate only transform and opacity where possible.
- Preserve functional navigation and external destinations without animation.

## 16. Implementation acceptance checklist

### Home

- [ ] New airport-derived production hero is used; old generated flying-model hero is absent.
- [ ] `DESIGNED FOR / YOUR JOURNEY`, approved body and both CTAs are present.
- [ ] TOP 3, NATIONWIDE and PREMIUM proof boxes render with Trophy, Truck and Gift icons.
- [ ] SmartHeader behavior is unchanged.

### At a Glance

- [ ] Dark `OUR CORE BUSINESS PILLARS` chapter contains all five exact pillars.
- [ ] UMRAH is no longer rendered as a core pillar.
- [ ] Capability image cards and empty 2×2 grid are absent.

### Product

- [ ] Product Inspector and its feature selectors are not rendered.
- [ ] New product banner, `PREMIUM LUGGAGE COLLECTION`, proof column, showroom and CTA are present.
- [ ] The chapter reads as a portfolio overview, not a configurator.

### Corporate

- [ ] Four approved gift assets and selectable interaction remain.
- [ ] Titles, three details, custom printing, MOQ and lead time are visible before the modal.
- [ ] Enquiry CTA and inspect dialog work with keyboard and touch.

### Preserved sections and quality

- [ ] About/Samantha, UMRAH, Warehouse/Location, Contact and SmartHeader are not redesigned.
- [ ] Warehouse sequence remains `1 → 2 → 3 → 4 → 5 → address`.
- [ ] Reduced motion works and no 320px overflow exists.
- [ ] `npm run lint`, `npm test` and `git diff --check` pass.
- [ ] Desktop and mobile visual QA plus one refinement pass are complete.

## 17. Approval boundary

Approval of this document authorizes implementation of the V5 changes above. It does not authorize new routes, CMS, database, checkout, cart, pricing, authentication, extra libraries, invented product claims or redesign of the five locked systems/chapters.

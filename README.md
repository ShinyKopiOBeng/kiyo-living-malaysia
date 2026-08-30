# KIYO Living Website

A single-page corporate portfolio for KIYO Living, plus three legal document
pages. The site presents KIYO luggage and bags, corporate gifts, UMRAH travel
sets, custom-logo services, and the Shah Alam operating environment. Retail
enquiries leave the site for KIYO's official Shopee or TikTok channels; service
enquiries open a prefilled WhatsApp conversation.

The implementation is intentionally static. It has no database, CMS, account
system, cart, checkout, or admin area.

## Run locally

Node.js `>=22.13.0` is required.

```bash
npm install
npm run dev
```

The development server selects the next available local port. Validate with:

```bash
npm run lint
npm test          # builds, then runs the SSR assertions
```

## Stack

- Next.js App Router on the Cloudflare-compatible Vinext runtime
- React 19 and TypeScript
- Tailwind CSS v4 for design tokens and utilities, alongside a hand-written
  editorial stylesheet
- GSAP and ScrollTrigger for section entrances and the header scroll state
- Native Pointer Events and `requestAnimationFrame` for the product carousel and
  the draggable WhatsApp dock
- Native `<dialog>` for the mobile menu and the corporate gift inspector
- Lucide React and React Icons for interface and social marks

## Deploying

The default build (`npm run build`) targets **Cloudflare Workers** and emits
`dist/server/index.js` plus `dist/client/`. Deploy it with `npx vinext deploy`.

For a static host such as Vercel, `npm run build:static` pre-renders every route
and merges the HTML with the assets into one servable folder:

```
dist/static/
  index.html                    /
  terms/index.html              /terms
  privacy/index.html            /privacy
  shipping-returns/index.html   /shipping-returns
  404.html
  assets/  images/  media/
```

`vercel.json` already points Vercel at that command and folder with the
framework preset disabled, so no dashboard configuration is needed. Vercel would
otherwise detect `next` in the dependencies, apply its Next.js preset, and fail
looking for a `.next` directory that this build never produces.

## Routes

| Path | Contents |
| --- | --- |
| `/` | The full single-page experience |
| `/terms` | Terms & Conditions |
| `/privacy` | Privacy Policy (PDPA-aligned) |
| `/shipping-returns` | Shipping & Returns |

## Key files

| Path | Role |
| --- | --- |
| `app/KiyoExperience.tsx` | Page shell, smart header, hero, about, UMRAH, WhatsApp dock, Shop flyout |
| `app/components/ProductCarousel.tsx` | Infinite product marquee with colour swatches and the 45-degree hover |
| `app/components/productCatalogue.ts` | Generated. Product names, colour order and swatch values |
| `app/components/KiyoInteractiveSections.tsx` | Corporate gift gallery and dialog, UMRAH gallery |
| `app/components/SiteFooter.tsx` | Footer shared by the home page and the legal pages |
| `app/globals.css` | Tailwind theme tokens plus the KIYO visual system |
| `app/layout.tsx` | Metadata, social card, canonical URL, Organization structured data |
| `worker/index.ts` | Cloudflare Worker entry |

## Styling

`app/globals.css` opens with a Tailwind `@theme` block holding the brand
palette and type stack. That is what makes `text-ink`, `bg-paper`,
`border-line`, `font-display` and friends available to markup. The hand-written
rules below it reach the same values through short `--ink` style aliases in
`:root`, so both approaches stay in sync.

The stylesheet is kept flat: **one authoritative rule per selector**. It
previously grew as stacked layers that re-declared the same selectors, where
whichever copy sat last silently won, which caused several real bugs. When
changing a style, edit the existing rule rather than appending another copy.
`npm test` fails if a selector re-declares a property it already set.

```bash
node tools/flatten-css.mjs --check   # report redundancy
node tools/flatten-css.mjs           # remove it
```

## Product assets

`tools/build-product-assets.mjs` turns the source product shots into the shipped
WebP set and regenerates `app/components/productCatalogue.ts`. It normalises
every product's base onto one floor line, so the carousel reads as a single
studio photograph rather than separate cut-outs, without changing relative
sizes.

```bash
node tools/build-product-assets.mjs --source <folder of product PNGs>
```

Colour order is fixed: silver, black, white, then neutrals and chromatics. Each
product opens on the highest-ranked colour it has.

## Conversion routes

- Corporate, UMRAH, custom-logo, location and floating-chat actions use the
  approved `wa.me` deep link for `+60 13-276 7887`.
- Retail actions offer Shopee and TikTok only. No Lazada route is included.
- Email uses `hello@kiyo.com.my`.

## Documentation

Design and change specifications live in [docs/](./docs). The legal pages are
drafts written to a standard commercial template and should be reviewed before
a public launch.

## Asset note

The KIYO logo, hero plates, UMRAH images and product shots come from supplied
source artwork. The facility portfolio and social-card background are original
AI-generated review assets prepared for this preview. Replace any review asset
with final commissioned photography before a public brand launch if required.

## In-page anchors

Every `href="#section"` click is handled by a capture-phase listener in
`KiyoExperience`, not by the router, and the handler calls `preventDefault()`.

This is deliberate and load-bearing. The router treats a fragment link as a
navigation and requests an RSC payload for it. A static host has no RSC
endpoint, so the request 404s, and the router's error path assigns
`window.location.href`, which fires `popstate`, which navigates again. Each
iteration calls `scrollIntoView` on the fragment target, so the page drags
itself back to the anchor and the visitor cannot scroll away.

Measured on the deployed site before the fix: one nav click produced **195
popstate events and 193 scrollIntoView calls and was still climbing**. Locally
the 404 returns instantly so the loop burns out in under a second, which is why
it only ever looked like a production bug.

`npm test` fails if the handler is removed.

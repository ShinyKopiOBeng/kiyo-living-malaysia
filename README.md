# KIYO Living Website

A single-page B2B landing site for KIYO Living, plus three legal document
pages. The page is built to turn corporate buyers, gift agencies and UMRAH
operators into WhatsApp enquiries. Individual retail buyers are pointed at
KIYO's Shopee and TikTok Shop instead.

The implementation is intentionally static. It has no database, CMS, account
system, cart, checkout or admin area.

## Page order

| # | Chapter | Anchor |
| --- | --- | --- |
| 1 | Header and hero | `#home` |
| 2 | Warehouse scale | `#warehouse` |
| 3 | UMRAH gift sets | `#umrah` |
| 4 | Corporate gift sets | `#corporate` |
| 5 | Choose your luggage | `#build` |
| 6 | Customise your brand | `#customise` |
| 7 | Delivery and quotation | `#delivery` |
| 8 | Clients, reviews and videos | `#clients` |
| 9 | Samantha and recognition | `#about` |
| 10 | Nationwide reach and the showroom | `#visit` |
| 11 | Closing call to action and footer | `#contact` |

Chapters 3 and 4 share one shell (`GiftChapter`) so the two layouts cannot
drift apart. Their four-up showcases are interactive: hovering or focusing a set
highlights it and dims the rest, and a click opens an inspector with the
enlarged plate, the contents, the MOQ and the lead time. Arrow keys walk the
sets; Escape and a backdrop click close it. Chapters 5 to 7 are one `<form>`: pick a model, add branding, give
quantity, date and destination, then submit, which opens WhatsApp with the
whole brief pre-written. Nothing is priced, stored or uploaded.

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
- GSAP for the tweens; an IntersectionObserver drives the section entrances and
  ScrollTrigger drives only the header scroll state
- Native scroll snapping for the product chooser, and Pointer Events for the
  draggable WhatsApp dock
- Native `<dialog>` for the mobile menu
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
| `app/KiyoExperience.tsx` | Page shell, smart header, hero, warehouse band, closing CTA, WhatsApp dock, scroll reveals |
| `app/components/BuildYourSet.tsx` | Chapters 5 to 7: the guided enquiry flow and the WhatsApp handoff |
| `app/components/ProductCarousel.tsx` | The product chooser rail, with bulk and retail routes per card |
| `app/components/productCatalogue.ts` | Generated. Product names, colour order and swatch values |
| `app/components/KiyoInteractiveSections.tsx` | Chapters 3 and 4: one shared shell, plus the gift-set showcase and inspector |
| `app/components/TrustSections.tsx` | Chapters 8, 9 and 10 |
| `app/components/sectionAssets.ts` | Generated. Real dimensions for every delivered plate |
| `app/fonts.ts` | The two `next/font` declarations |
| `app/components/SiteFooter.tsx` | Footer shared by the home page and the legal pages |
| `app/globals.css` | Tailwind theme tokens plus the KIYO visual system |
| `app/fonts.css` | Generated. Self-hosted `@font-face` rules |
| `app/layout.tsx` | Metadata, social card, canonical URL, Organization structured data |
| `worker/index.ts` | Cloudflare Worker entry |

## Section assets

The approved artwork is delivered as one folder per chapter. It arrives at
1200-3200px and 1-2.7MB a file, so it is never served directly:

```bash
node tools/build-section-assets.mjs --source <SectionAssets folder>
```

The tool resizes each plate to the largest size its slot can use, encodes WebP,
and **preserves alpha** on the fifteen files that need it (the twelve client
marks, Samantha's cut-out, the branded case and the map). The client marks are
additionally trimmed to their ink and re-fitted to one box, so the wall reads at
a single optical weight instead of twelve different ones.

It writes `app/components/sectionAssets.ts` with the real `src`, `width` and
`height` of every output, so the markup can never describe the wrong box. Alt
text is deliberately not generated: it is authored in `imageSlots.ts`, where it
describes the picture rather than repeating a filename.

The Malaysia network map ships as the supplied **vector**. Its base map is
CC BY 3.0, so the credit is rendered on the page, not just left inside the file.

## Fonts

Cormorant Garamond carries the hero title and every major section heading.
Montserrat carries navigation, labels, descriptions, buttons, forms and the rest
of the UI. `app/fonts.ts` declares both through `next/font/google` with the
variables `--font-heading` and `--font-body`.

The faces are then **self-hosted from `public/fonts`**. `next/font/google`
downloads them into `.vinext/fonts`, but this Vinext build never emits the
`@font-face` rules or the variable class that go with them, so every heading
silently fell back to a system serif. `tools/build-fonts.mjs` copies the same
latin and latin-ext faces out of that cache and regenerates `app/fonts.css`,
using the same family and variable names, so both paths describe one type
system.

```bash
node tools/build-fonts.mjs
```

Keep the families and weights in `tools/build-fonts.mjs` in step with
`app/fonts.ts`.

## Scroll reveals

Sections fade in through a single `IntersectionObserver` in `KiyoExperience`,
driven by `data-reveal` and `data-reveal-group` attributes.

It deliberately does **not** use `ScrollTrigger.batch`. That measures every
start position against the page height at the moment the trigger is created, so
photographs loading below the fold grew the page underneath the triggers and
whole chapters never reached their start, staying at `autoAlpha: 0`
permanently. Because it was a race, a different set of sections went missing on
each load. An IntersectionObserver has no precomputed geometry to go stale, and
an element already on screen when it is observed fires immediately.

When a reveal finishes it clears the properties it set. A completed GSAP tween
leaves `opacity` and a transform inline, and an inline style outranks any rule,
which silently disabled every CSS hover state on a revealed element: the gift
showcase could not dim its unhovered cards.

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

- Every enquiry action uses the approved `wa.me` deep link for
  `+60 13-276 7887`. The three-step flow builds the message body from what the
  visitor entered.
- Retail actions offer Shopee and TikTok only. No Lazada route is included.
- Email uses `kiyoliving88@gmail.com`.

## Documentation

Design and change specifications live in [docs/](./docs). The legal pages are
drafts written to a standard commercial template and should be reviewed before
a public launch.

## Asset note

Every chapter now runs on the approved SectionAssets delivery. No slot is a
placeholder any more, and `status: "placeholder"` is unused.

Two things are deliberately not asserted:

- Two of the twelve client marks arrived filed only as a crest
  (`02-client-crest-green`, `05-client-cooperative-crest`). Their alt text reads
  "Client organisation logo" rather than guessing an organisation onto them.
  Add the real names to `CLIENT_NAMES` in `app/components/imageSlots.ts` when
  KIYO confirms them.
- The two review quotes in `app/components/TrustSections.tsx` are attributed to
  a role rather than a person, which is how the approved mockup carries them.
  Add the client's name to `source` once there is a quote KIYO has permission to
  attribute.

Sections 4, 6 and 7 were delivered with opaque `ChatGPT Image ...(n).png`
filenames, so their plates are taken in numeric export order. Each is a single
ordered array in `tools/build-section-assets.mjs`; if a gift set or a pipeline
stage ever looks out of place, swap two entries there and re-run.

The previous stand-in photography is still in `public/images` (about 5MB of
`warehouse-*`, `facility-*`, `corporate-gift-*`, `umrah-*` and `product-*`
plates). Nothing references it any more, so it can be deleted to cut the deploy,
but it is left in place because it is KIYO's own artwork rather than something
this project generated. The product shots under `public/images/kiyo/products`
are still live: the carousel builds those paths at runtime, so a plain search
for them finds nothing.

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

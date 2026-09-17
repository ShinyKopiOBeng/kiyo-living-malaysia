# KIYO Living Website

A single-page B2B landing site for KIYO Living, plus three legal document
pages. The page is built to turn corporate buyers, gift agencies and UMRAH
operators into quotation requests. Individual retail buyers are pointed at
KIYO's Shopee and TikTok Shop instead.

The implementation is intentionally static. It has no database, CMS, account
system, cart, checkout or admin area. The one form on the page posts to a
form-to-email relay and opens WhatsApp; see [The quotation](#the-quotation).

## Page order

| # | Chapter | Anchor |
| --- | --- | --- |
| 1 | Header and hero | `#home` |
| 2 | Warehouse band, then the four proof numbers | `#warehouse` |
| 3 | UMRAH: opener and six-set carousel | `#umrah` |
| 4 | Corporate: opener and six-set carousel | `#corporate` |
| 5 | Step 01, Choose: the luggage rail | `#choose` |
| 6 | Step 02, Personalise: the customisation portfolio | `#personalise` |
| 7 | Step 03, Deliver: the three-promise accordion | `#deliver` |
| 8 | Quotation and location | `#quote` |
| 9 | Clients: opener, logo marquee, three videos, six handovers | `#clients` |
| 10 | Samantha and Awards | `#about` |
| 11 | Closing call to action and footer | `#contact` |

Six chapters open with the same `ChapterOpener`: one photograph, a label, a
three-line headline with the last line in coral, one sentence, at most one
button. Chapters 3 and 4 share one shell (`GiftChapter`) so the two carousels
cannot drift apart; a click on a set opens an inspector with the enlarged
plate, the contents, the MOQ and the lead time, and its button goes to the
quotation. Nothing on the page is selected or priced.

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
  stylesheet
- GSAP for the tweens; an IntersectionObserver drives the section entrances and
  ScrollTrigger drives only the header scroll state
- Native scroll containers for the set carousels and the luggage rail, and
  Pointer Events for the draggable WhatsApp dock
- Native `<dialog>` for the mobile menu and the set inspector
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
  assets/  images/  fonts/
```

`vercel.json` already points Vercel at that command and folder with the
framework preset disabled, so no dashboard configuration is needed. Vercel would
otherwise detect `next` in the dependencies, apply its Next.js preset, and fail
looking for a `.next` directory that this build never produces.

The quotation form's email route uses KIYO's Web3Forms key as its default;
set `NEXT_PUBLIC_WEB3FORMS_KEY` in the host's environment before building to
override it. It is inlined at build time, so a change needs a rebuild.

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
| `app/components/ChapterOpener.tsx` | The opener the six photographic chapters share |
| `app/components/KiyoInteractiveSections.tsx` | Chapters 3 and 4: the shared gift shell and the set inspector |
| `app/components/DriftCarousel.tsx` | The drifting, seamlessly looping carousel both the sets and the luggage use |
| `app/components/SetCarousel.tsx` | The six-set card on that carousel |
| `app/components/giftSets.ts` | The twelve sets: names, contents, MOQ, lead time |
| `app/components/HowItWorks.tsx` | Steps 01 to 03: rail, portfolio bento, accordion |
| `app/components/ProductCarousel.tsx` | The whole collection on the carousel: front shot at rest, three-quarter shot on hover |
| `app/components/productCatalogue.ts` | Generated. Product names, colour order and swatch values |
| `app/components/QuoteSection.tsx` | The quotation form, the map and the contact details |
| `app/components/TrustSections.tsx` | The proof strip, Clients and About |
| `app/components/clientProof.ts` | The four figures and the three client videos |
| `app/components/programme.ts` | The event the gift chapters use to pre-select the form's programme |
| `app/components/scroll.ts` | The one in-page scroll used by anchors and buttons alike |
| `app/components/sectionAssets.ts` | Generated. Real dimensions for every delivered plate |
| `app/components/imageSlots.ts` | Alt text, crops and focal points for every plate |
| `app/components/SiteFooter.tsx` | Footer shared by the home page and the legal pages, and the WhatsApp messages |
| `app/globals.css` | Tailwind theme tokens plus the KIYO visual system |
| `app/fonts.css` | Generated. Self-hosted `@font-face` rules |
| `app/layout.tsx` | Metadata, social card, canonical URL, Organization structured data |
| `worker/index.ts` | Cloudflare Worker entry |

## Brand

Everything visual comes from `KIYO Branding Guideline.pdf`.

- **Colour.** The `@theme` block in `globals.css` carries the guide's own
  hexes: teal `#72b7bd`, coral `#e66047`, navy `#002f3d`, light teal
  `#83c1c8`, salmon `#f58c86`, on the guide's page ground `#f4efea`. Teal is
  never used for small text (2:1 on cream); small coral text takes the deeper
  `#b23f26`. Buttons sit on the exact brand coral by KIYO's decision.
- **Type.** Work Sans for every heading and Montserrat for everything else.
  The guide names "Gontserrat", a Montserrat derivative that is not on Google
  Fonts; Montserrat stands in until KIYO supplies the files.
- **Logo.** The lockups are vectors extracted from the PDF:
  `public/images/kiyo-logo.svg` (header), `kiyo-logo-white.svg` (the
  white-on-navy variant from page 7, footer), `kiyo-mark.svg` (the icon) and
  `public/favicon.svg` (the circular badge from page 4).

## The quotation

One form is the whole enquiry. One press sends it two ways:

1. **Email**, through [Web3Forms](https://web3forms.com), a form-to-inbox
   relay that needs no server of ours. The access key was created with the
   KIYO inbox and is the default in `QuoteSection.tsx`; a Web3Forms key is
   made to sit in client-side code and can only deliver to the inbox it was
   created with. `NEXT_PUBLIC_WEB3FORMS_KEY` overrides it at build time.
   Web3Forms only accepts requests from real browsers, so it cannot be
   exercised with curl or a headless user agent.
2. **WhatsApp**, opened with the whole brief written in. A browser can only
   open the chat with the text ready; it cannot press send for the visitor,
   so the success panel says so and repeats the link.

The WhatsApp tab is opened first and synchronously inside the submit handler,
because browsers only allow a new tab from a direct user gesture. A honeypot
field keeps bots out. Nothing is stored on the site.

The gift chapters' buttons and the set inspector announce their programme
through `programme.ts`, so "I'm interested in" is already ticked when the
visitor arrives at the form.

## Section assets

Three deliveries feed the page: the older `SectionAssets` folder (one
directory per chapter), the `07_Website` Google Drive folder that V15 added
(the hero, six openers, twelve gift sets, three warehouse panels) and
`KIYO-Clients-Picks`, the six handover photographs chosen out of KIYO's client
archive. None is served directly:

```bash
node tools/build-section-assets.mjs --source <SectionAssets> --drive <07_Website> --clients <KIYO-Clients-Picks>
```

The tool resizes each plate to the largest size its slot can use, encodes
WebP, trims the twelve client marks to their ink and fits them to one box, and
deletes anything in `public/images/kiyo/sections` it did not write. It writes
`app/components/sectionAssets.ts` with the real `src`, `width` and `height` of
every output. Alt text is deliberately not generated: it is authored in
`imageSlots.ts`.

The three client clips are re-encoded for the web (H.264, at most 540px wide,
30fps, `faststart`) with a poster frame each by:

```bash
FFMPEG=/path/to/ffmpeg node tools/build-client-videos.mjs --source <KIYO-Clients-Picks>
```

ffmpeg is not a project dependency; point `FFMPEG` at one or have it on the
PATH. Output lands in `public/media/clients/` and `CLIENT_VIDEOS` in
`clientProof.ts` names the files.

## Fonts

Work Sans carries every heading and Montserrat carries navigation, labels,
descriptions, buttons, forms and the rest of the UI. Both are named in the
`@theme` block of `globals.css` and **self-hosted from `public/fonts`** through
the `@font-face` rules in `app/fonts.css`.

The site does not use `next/font`. The Vinext build injected its `@font-face`
rules into the HTML with the build machine's own file paths, so every visitor's
browser asked for `C:/Users/.../.vinext/fonts/...`. `tools/build-fonts.mjs`
fetches the latin and latin-ext faces from Google Fonts instead (or copies them
out of an older build's cache) and regenerates `app/fonts.css`. A variable font
answers every weight with one file, and those collapse into a single rule with a
weight range.

```bash
node tools/build-fonts.mjs
```

## Scroll reveals

Sections fade in through a single `IntersectionObserver` in `KiyoExperience`,
driven by `data-reveal` and `data-reveal-group` attributes.

It deliberately does **not** use `ScrollTrigger.batch`. That measures every
start position against the page height at the moment the trigger is created, so
photographs loading below the fold grew the page underneath the triggers and
whole chapters never reached their start, staying at `autoAlpha: 0`
permanently. An IntersectionObserver has no precomputed geometry to go stale.

When a reveal finishes it clears the properties it set. A completed GSAP tween
leaves `opacity` and a transform inline, and an inline style outranks any rule,
which silently disabled every CSS hover state on a revealed element.

## The carousels

`DriftCarousel` is a native scroll container with the list rendered twice; the
gift sets and the luggage collection are both cards on it. One
`scrollLeft` nudge a frame drifts it left; wrapping the position by one run's
width lands on identical pixels, so the loop is seamless in both directions.
The drift pauses under a pointer, on focus, while a finger or mouse button is
down, while the inspector is open, off screen, and never starts under
`prefers-reduced-motion`. A mouse can drag it; a press that moves under six
pixels is still a click. The cloned run is `aria-hidden` and its buttons are
out of the tab order.

## Styling

`app/globals.css` opens with a Tailwind `@theme` block holding the brand
palette and type stack. That is what makes `text-ink`, `bg-paper`,
`border-line`, `font-display` and friends available to markup. The hand-written
rules below it reach the same values through short `--ink` style aliases in
`:root`, so both approaches stay in sync.

The stylesheet is kept flat: **one authoritative rule per selector**. When
changing a style, edit the existing rule rather than appending another copy.
`npm test` fails if a selector re-declares a property it already set.

```bash
node tools/flatten-css.mjs --check   # report redundancy
node tools/flatten-css.mjs           # remove it
```

## Product assets

`tools/build-product-assets.mjs` turns the source product shots into the shipped
WebP set and regenerates `app/components/productCatalogue.ts`. It normalises
every product's base onto one floor line, so the rail reads as a single studio
photograph rather than separate cut-outs.

```bash
node tools/build-product-assets.mjs --source <folder of product PNGs>
```

Colour order is fixed: silver, black, white, then neutrals and chromatics. Each
product opens on the highest-ranked colour it has. The rail shows cases and
sets only; the four bags stay in the catalogue but are filtered out in
`ProductCarousel.tsx`.

## Conversion routes

- The quotation form is the primary route: every "Request a quote" and every
  "Build Your ... Set" button leads to `#quote`.
- Every remaining WhatsApp link uses the approved `wa.me` deep link for
  `+60 13-276 7887` with a message that says where it was pressed.
- Retail actions offer Shopee and TikTok only. Lazada appears nowhere.
- Email uses `kiyoliving88@gmail.com`.

## Documentation

Design and change specifications live in [docs/](./docs); the current one is
`docs/v15-brand-realignment.md`. The legal pages are drafts written to a
standard commercial template and should be reviewed before a public launch.

## Asset note

Two things are deliberately not asserted:

- Two of the twelve client marks arrived filed only as a crest
  (`02-client-crest-green`, `05-client-cooperative-crest`). Their alt text reads
  "Client organisation logo" rather than guessing an organisation onto them.
  Add the real names to `CLIENT_NAMES` in `app/components/imageSlots.ts` when
  KIYO confirms them.
- The client videos and handover photographs are captioned with what the
  picture or KIYO's own filing establishes, and nothing more: no view counts,
  no quotes, no names the pictures do not carry.

## In-page anchors

Every `href="#section"` click is handled by a capture-phase listener in
`KiyoExperience`, not by the router, and the handler calls `preventDefault()`
and `scrollToSection()` from `app/components/scroll.ts`.

This is deliberate and load-bearing. The router treats a fragment link as a
navigation and requests an RSC payload for it. A static host has no RSC
endpoint, so the request 404s, and the router's error path assigns
`window.location.href`, which fires `popstate`, which navigates again. Each
iteration calls `scrollIntoView` on the fragment target, so the page drags
itself back to the anchor and the visitor cannot scroll away.

`npm test` fails if the handler is removed.

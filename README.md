# KIYO Living Website

A cinematic, single-page corporate portfolio for KIYO Living. The site presents KIYO luggage, corporate gifts, UMRAH travel sets, custom-logo services, and the Shah Alam operating environment. Retail enquiries leave the site for KIYO's official Shopee or TikTok channels; service enquiries open a prefilled WhatsApp conversation.

The implementation is intentionally static. It has no database, CMS, account system, cart, checkout, or admin area.

## Run locally

Node.js `>=22.13.0` is required.

```bash
npm install
npm run dev
```

The development server selects the next available local port. Validate a production build with:

```bash
npm test
npm run lint
```

## Implementation stack

- Next.js App Router on the Sites-compatible Vinext runtime
- React 19 and TypeScript
- Tailwind CSS runtime foundation plus a custom editorial CSS system
- GSAP and ScrollTrigger for entrances, scrubbed text, image scaling, card stacking, and the desktop location pin
- Lenis for fine-pointer desktop scroll interpolation only
- Embla Carousel for the accessible product lineup
- Native Pointer Events, `requestAnimationFrame`, CSS custom properties, and `mask-image` for the hero torch
- Native `<dialog>` for the mobile menu and retail platform chooser
- Lucide React and React Icons for interface, social, WhatsApp, TikTok, and Shopee icons

The complete component-by-component animation matrix and accessibility fallbacks are documented in [design.md](./design.md).

## Key files

- `app/KiyoExperience.tsx` — page content, dialogs, carousel, pointer torch, GSAP, ScrollTrigger, and Lenis lifecycle
- `app/globals.css` — KIYO visual system, responsive chapters, interaction states, and reduced-motion fallbacks
- `app/layout.tsx` — metadata, social card, favicon, fonts, canonical URL, and Organization structured data
- `public/images/` — compressed supplied and generated campaign assets
- `public/og.png` — purpose-built KIYO social sharing card

## Conversion routes

- Corporate, UMRAH, custom-logo, location, and floating-chat actions use the approved `wa.me` deep link for `+60 13-276 7887`.
- Retail actions offer Shopee and TikTok only.
- Email uses `hello@kiyo.com.my`.
- No Lazada route is included.

## Asset note

The transparent KIYO logo, aligned dark/light hero plates, and UMRAH images come from the supplied source artwork. The product lineup, facility portfolio, and social-card background are original AI-generated review assets prepared specifically for this private website preview. Replace any review asset with final commissioned photography before a public brand launch if required.

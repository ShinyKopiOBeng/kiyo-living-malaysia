# KIYO V9 — Products carousel (Rimowa-style)

Replace the PRODUCTS section's single hero image with an infinite, slowly
drifting product carousel on one seamless studio backdrop, with colour swatches
under each product and a front / 45-degree hover switch.

Source assets: `C:\Users\Admin\Downloads\ProductView` — 70 product PNGs across
10 folders, plus one `background.png`.

---

## 1. What is actually in the asset folder

Every product PNG is **1254 x 1254** with a transparent background and its own
baked-in soft shadow. Total 73.6 MB, so they cannot ship as-is.

Each folder holds one product in several colours, each colour with a `front`
and a `45` view. Measured body colour (median of the product body, sampled from
the pixels) and how the product sits inside its 1254px frame:

| Folder | Colours (sampled) | Body width in frame | Base sits at |
| --- | --- | --- | --- |
| `Premium Series 2` | Silver `#c7c8c8`, Black `#262826`, Blue `#afd3e0`, Green `#bee0c4`, Pink `#efc3bb` | 90-93% | 93-94% |
| `Full Spec` | Black `#2f2f2e`, White `#f2ecd9`, Blue `#93b7d3`, Cyan `#bfe6e1`, DarkGreen `#034539` | 46-52% | 96-98% |
| `luggage4` | Black `#36373a`, Beige `#d7b6a8`, Green `#a6d1bf`, Orange `#f8652c`, Pink `#e4a6aa` | 49-54% | 95-97% |
| `luggage2` | White `#dbdbdb`, Blue `#8abfd2`, Pink `#dab0a9` | 45-48% | 95-97% |
| `luggage3` | White `#e4d9c5`, Green `#abc79e`, Purple `#c7a7c1`, Pink `#eab09a` | 44-49% | 95-96% |
| `Mini` | Black `#2d2e30`, Blue `#b4d1ee`, Green `#b7d4c1`, Purple `#bfafea`, Pink `#e6babd` | 84-93% | 85-90% |
| `Business Bagpack` | Black `#28282a`, Grey `#9ca1af` | 63-66% | 95-96% |
| `backpack1` | Black `#2c2c2e`, Grey `#94949a` | 63% | 94-95% |
| `Laptop Bag` | Black `#2d2d2e`, Grey `#bababd` | 88% | 91-92% |
| `Travel Bag` | Black `#38383a`, Grey `#9a9ba3` | 98% | 77-78% |

**The base line varies from 77% to 98% of the frame.** Dropped into a row
as-is, the products would float at ten different heights instead of standing on
one floor. Section 4 fixes this.

## 2. Product names

Folders already carrying a usable name keep it (tidied). The rest are named for
what the product actually is, from looking at each one:

| Folder | Name | Why |
| --- | --- | --- |
| `Premium Series 2` | **Premium Aluminium Set** | Two-piece: a check-in plus a cabin case with a front-opening laptop hatch |
| `Full Spec` | **Full Spec Aluminium Frame** | Aluminium frame with metal corner guards and a TSA dial lock |
| `luggage4` | **Sunburst Hardshell** | Radiating fan-pleat shell, KIYO badge on the front |
| `luggage2` | **Front Pocket Cabin** | Full-width zipped laptop pocket across the front panel |
| `luggage3` | **Top Access Cabin** | Separate upper front compartment with its own zip and badge |
| `Mini` | **Mini Hard Case** | Small top-handle vanity case, aluminium corners |
| `Business Bagpack` | **Business Backpack** | Structured commuter backpack, twin zipped front panels (typo fixed) |
| `backpack1` | **Flap Commuter Backpack** | Flap-over front with an orange leather pull tag |
| `Laptop Bag` | **Slim Laptop Brief** | Slim zip-top briefcase with twin rolled handles |
| `Travel Bag` | **Weekender Duffel** | Wide duffel, twin handles plus a detachable shoulder strap |

Carousel order leads with luggage, then bags:
Premium Aluminium Set, Full Spec Aluminium Frame, Sunburst Hardshell,
Front Pocket Cabin, Top Access Cabin, Mini Hard Case, Business Backpack,
Flap Commuter Backpack, Slim Laptop Brief, Weekender Duffel.

## 3. Colour order

Fixed rank, applied to every product: **Silver, Black, White**, then the rest,
neutrals before chromatics:

```
silver > black > white > grey > beige > blue > cyan > green > darkgreen > purple > pink > orange
```

The first colour in that order is what the product shows at rest. Resulting
defaults: Premium Aluminium Set opens on **Silver** (the only silver in the
set); Front Pocket Cabin and Top Access Cabin have neither silver nor black, so
they open on **White**; every other product opens on **Black**.

## 4. Asset pipeline

A build script, `tools/build-product-assets.mjs`, run once and committed:

1. Read each PNG and find its true alpha bounding box.
2. Extract that box and re-composite it onto a fresh 1254 x 1254 canvas,
   horizontally centred, with the **bottom of the box pinned to 98.5% of the
   canvas height**. Pixel scale is untouched, so the Weekender Duffel stays
   short and wide while the Full Spec stays tall — only the floor line is
   normalised. This is what makes the row read as one photograph.
3. Resize to **860 x 860** and encode WebP at `quality 80, alphaQuality 90`.
   Measured: 56-87 KB per image, against 1.0-2.0 MB as PNG.
4. Write to `public/images/kiyo/products/<product-slug>/<colour>-front.webp`
   and `<colour>-angle.webp`.
5. Emit `app/components/productCatalogue.ts` with the slugs, names, colour
   order, sampled swatch hexes and image paths, so the component has no
   hard-coded asset list to drift out of sync.

860px covers a ~420px slide at 2x DPR. Only the default colour of each product
is in the DOM at rest (20 images, ~1.3 MB, lazily fetched); other colours load
when their swatch is used.

## 5. The seamless backdrop

`background.png` is 1983 x 793: a studio sweep, dark at the top edge
(`#e5e5e4`), brightening to `#f8f7f8` at 45%, dipping to `#eaeaea` at the 72%
horizon where wall meets floor, lifting to `#f9f9f9` on the floor, then settling
to `#e6e6e6`.

**It will not be tiled.** Sampled horizontally it carries a centre vignette
(edges `#ec`, centre `#fb`), so repeating it would band the row bright-dark-
bright. Instead the same sweep is reproduced as a CSS `linear-gradient` on the
carousel viewport, using the sampled stops:

```
#e6e6e5 0%, #f0efef 15%, #f7f7f7 32%, #f8f8f8 46%,
#f1f1f1 60%, #eaeaea 72%, #f5f4f4 76%, #f9f9f9 81%,
#ededed 91%, #e6e6e6 100%
```

Seamless at any width, scales to any viewport, costs nothing to download, and
matches the sweep the products were shot against — so the cut-outs sit on it
without a visible edge. The slides themselves are fully transparent.

## 6. Component architecture

New file `app/components/ProductCarousel.tsx`:

```
section#products
  header            PREMIUM LUGGAGE / COLLECTION + one line of copy
  .product-carousel
    .product-carousel__viewport      <- the studio sweep lives here, overflow hidden
      .product-carousel__track       <- transform: translate3d(-offset,0,0)
        .product-slide  x (N x 2)    <- the list twice, for a seamless wrap
          button.product-slide__media
            img.is-front   +   img.is-angle     (crossfade on hover)
    button.product-carousel__arrow--prev / --next
  .product-carousel__rail            <- name + swatches, aligned under each slide
  .product-carousel__proof           <- retained "Retail & wholesale ready" copy + CTA
```

The name and swatch row sit **below** the sweep on the page background, the way
Rimowa does it, so the image band stays a clean unbroken strip.

## 7. Marquee mechanics

One `requestAnimationFrame` loop owning a single `offset` in px.

- **Drift:** `offset += SPEED * dt` with `SPEED = 26 px/s`. Slow enough to read
  as ambient motion rather than a slideshow.
- **Wrap:** the track renders the product list twice. Whenever
  `offset >= setWidth` subtract `setWidth`; whenever `offset < 0` add it. The
  seam is never visible because the second copy is pixel-identical.
- **Hover pause:** `pointerenter` on the viewport sets `paused`. `pointerleave`
  clears it.
- **Arrows:** hidden at rest (`opacity: 0`), revealed on hover over the
  carousel or on `:focus-within`. Always visible under `(hover: none)`, where
  there is no hover to reveal them. A click tweens `offset` by one slide pitch
  over 520ms with an ease-out curve.
- **The 3-second rule:** clicking an arrow sets an `armedCooldown` flag. On the
  next `pointerleave`, instead of resuming immediately the loop waits **3000ms**
  before drifting again. Plain hovering with no arrow use resumes at once, which
  keeps casual mouse-overs from feeling stuck.
- **Drag:** `pointerdown` on the track scrubs `offset` directly, so the carousel
  can be flicked on touch. Travel under **6px** counts as a tap and opens the
  product; beyond that the click is suppressed. Same tolerance pattern as the
  WhatsApp dock.
- **Reduced motion:** `prefers-reduced-motion: reduce` disables the drift
  entirely; arrows stay permanently visible and remain the way to move.
- The loop is also parked while the section is off-screen, via an
  `IntersectionObserver`, so it costs nothing when nobody is looking at it.

## 8. Colours and the 45-degree hover

Each slide renders the currently selected colour twice, stacked: `-front.webp`
at `opacity: 1` and `-angle.webp` at `opacity: 0`. Hovering (or focusing) the
slide crossfades to the angle view over 420ms. Because both are in the DOM the
switch has no network delay after the first paint.

Swatches sit under the product name as round buttons filled with the sampled
body colour, hairline-bordered so white and silver still read on the light page.
Selecting one swaps both image sources. `aria-pressed` marks the active swatch,
and each carries an accessible label of the form "Premium Aluminium Set in
Silver". Selection is per product and independent of hover, so the angle view
works for every colour, as asked.

Note both copies of a product in the doubled track share one colour state, so
the wrap never shows the same product in two different colours.

## 9. Clicking a product

The whole slide is a `<button>`. Activating it opens the existing **Shop
flyout** (Shopee / TikTok Shop), which is already wired for `openShop("press")`.
The carousel receives an `onShop` callback exactly like
`ProductCollectionOverview` does today, so no new navigation surface is added.

## 10. Responsive

| Width | Slides in view | Slide pitch | Notes |
| --- | --- | --- | --- |
| >= 1440px | ~4 | 25vw, max 26rem | Arrows on hover |
| 1024-1439px | ~3.2 | 30vw | Arrows on hover |
| 768-1023px | ~2.4 | 40vw | Arrows always visible |
| < 768px | ~1.6 | 62vw | Arrows always visible, drag primary, swatches wrap |

The image band's height is driven by the slide pitch (square media box), so the
sweep scales with it and the floor line stays put.

## 11. Files

| File | Change |
| --- | --- |
| `tools/build-product-assets.mjs` | New. One-shot asset normaliser and encoder |
| `public/images/kiyo/products/**` | New. 70 normalised WebP files |
| `app/components/productCatalogue.ts` | New. Generated catalogue |
| `app/components/ProductCarousel.tsx` | New. The carousel |
| `app/components/KiyoInteractiveSections.tsx` | `ProductCollectionOverview` reduced to the header plus the retained proof band |
| `app/KiyoExperience.tsx` | Render the carousel inside `#products` |
| `app/globals.css` | New V9 layer |
| `tests/rendered-html.test.mjs` | Updated per section 12 |

## 12. Test impact

The section no longer renders `PRODUCT-COLLECTION-HERO` or the warehouse
showroom image, so those two rendered-HTML assertions are replaced by
assertions on the carousel: the ten product names, the swatch buttons, the
doubled track, and that the default colour of each product follows the ranking
rule. `product-collection-hero.webp` stays on disk and in the asset-existence
test, unused by this section.

New assertions: every catalogue entry has both a front and an angle file that
exists on disk; the colour order rule holds for all ten products.

## 13. Decisions worth flagging

- **Relative scale is preserved, not equalised.** The Weekender Duffel really is
  shorter than the Full Spec, and Rimowa shows the same honest scale difference.
  Only the floor line is normalised.
- **The proof band is kept.** "Retail & wholesale ready" and the Explore CTA are
  real wholesale positioning, so they move below the carousel rather than being
  dropped.
- **Grey ranks after white.** The brief fixed silver, black and white; grey is
  the most neutral of "others", so it leads the remainder.
- Product names for the seven unnamed folders are descriptive, not marketing
  copy. If KIYO has real SKU names, they are one edit each in the catalogue.

---

## 14. Built and verified

Asset build: 70 images, **73.6 MB PNG -> 3.3 MB WebP**. Baseline normalisation
measured on the output — every product's base now sits at **98.4%** of its
frame, a spread of **0.0 percentage points** against 20.6 before, while relative
scale is untouched (the Weekender Duffel still starts 34.4% down its frame, the
Full Spec 3.6%).

Behaviour driven with real pointer input at 1440px:

| Check | Result |
| --- | --- |
| Drifts on its own | 39px in 1.5s = 26 px/s, right to left |
| Hovering a product stops it | 0px moved while hovered |
| 45-degree view on hover | front `opacity: 0`, angle `opacity: 1` |
| Arrows hidden until hovered | `0` away, `1` hovered |
| Arrow nudge | 377px, exactly one slide pitch |
| 3s rule after an arrow | 0px at 2.1s after leaving, 26px by 4.7s |
| Colour defaults | silver / white / black exactly per the ranking rule |
| Swatch switches colour | `black-front.webp -> beige-front.webp` |
| Both copies stay in sync | true, so the wrap never shows two colours |

### Corrections found while building

1. **sharp runs `resize` before `composite`** regardless of call order, so the
   canvas shrank out from under the full-size subject. The normaliser does the
   placement and the resize as two separate passes.
2. **The proof heading kept its old display scale.** It had been styled for a
   narrow column at `clamp(2.25rem, 3vw, 3.5rem)`; in a horizontal band under
   the carousel it needed `clamp(1.35rem, 1.9vw, 1.95rem)`.
3. **The band is 9% taller than the media box.** At exactly the media height the
   products ended flush with the band edge; the extra strip gives them floor to
   stand on, and the arrows re-centre on the band rather than the media.
4. **Arrow visibility on touch is backed by a width query.** `@media (hover: none)`
   cannot be verified in headless Chrome, and if it ever failed to match on a
   real device the arrows would be unreachable, since there is no hover to
   reveal them. `max-width: 1023px` now shows them too.

### Notes on the verification tooling

Screenshots taken with reduced motion emulated show the arrows permanently
visible: that is the specified behaviour under `prefers-reduced-motion`, not a
leak. Reduced motion also disables `scroll-behavior: smooth`, so captures with
motion enabled must scroll with `behavior: "instant"` or they never leave the
top of the page.

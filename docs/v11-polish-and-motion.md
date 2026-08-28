# KIYO V11 — polish and motion

Hero proof bar restyle, About gap repair, Location simplification, an animated
UMRAH process flow, and one consistent scroll-reveal system for the whole page.

**Nothing is implemented yet.** This is the plan for review.

Two answers carried over from V10: the **facility photographs stay**, and the
**corporate gift MOQ and lead times stay**. Both are treated as real going
forward.

---

## 1. Home — the hero proof bar

### What it looks like now

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ ▪ TOP 3      │ ▪ TSP        │ ▪ EST. 2022  │ ▪ NATIONWIDE │
│   TikTok…    │   OFFICIAL   │   SSM…       │   Wholesale  │
└──────────────┴──────────────┴──────────────┴──────────────┘
   square       wraps to        solid dark      square
   corners      two lines       teal tile       corners
```

Four problems, all confirmed in the current CSS:

| Issue | Cause |
| --- | --- |
| Square corners | `.hero__proofs` has no `border-radius` |
| "TSP OFFICIAL" wraps | `.hero-proof strong` is `clamp(1.7rem, 2.2vw, 2.45rem)`, too large for a quarter-width column |
| Icon style differs from Products | `.hero-proof__icon` is `background: var(--teal-dark); color: var(--white)` (solid dark), while `.product-category__icon` is `background: rgb(103 184 189 / 0.14); color: var(--teal-dark)` (light tint) |
| Icon floats beside the text | `.hero-proof` uses `align-items: center`, so the 3.35rem tile is centred against a taller text block |

### Proposed

| Property | From | To |
| --- | --- | --- |
| Container radius | none | `1rem` |
| Icon tile radius | none | `0.75rem` |
| Icon background | `var(--teal-dark)` solid | `rgb(103 184 189 / 0.14)` |
| Icon colour | `var(--white)` | `var(--teal-dark)` |
| Icon tile size | `3.35rem` | `2.75rem`, matching Products |
| Icon glyph size | inherited | `1.35rem`, matching Products |
| Title size | `clamp(1.7rem, 2.2vw, 2.45rem)` | `clamp(1.1rem, 1.45vw, 1.5rem)` |
| Icon alignment | `align-items: center` | `align-items: stretch` on the row, tile pinned to the top of the text block |

At 1440 each column is about 340px wide. Minus padding and the icon tile that
leaves roughly 210px for text; "TSP OFFICIAL" at 1.5rem in the condensed display
face measures about 150px, so it sits on one line with room to spare.

**"Icon height parallel to the description height"** — I read this as the icon
tile aligning with the text block rather than floating mid-height. The tile top
will line up with the title's cap height, and the tile will not stretch to the
full block height, because a 2.75rem glyph tile stretched to ~70px would look
distorted. If you meant the tile should literally match the block's full height,
say so and I will make it a full-height rail instead.

### The radius question, which affects more than this bar

The whole site is currently square-cornered: buttons, gift panels, product
category cards, operations cards, the shop flyout. Rounding only the proof bar
would make it the one soft element on the page.

I would rather introduce a single token and apply it to the **card family**:

```css
--radius-card: 1rem;   /* proof bar, product categories, operations cards */
--radius-tile: 0.75rem; /* icon tiles */
```

Buttons, the carousel and the image mosaic stay square, since rounding
photographs and the studio band would fight the editorial look.

**Decision needed:** cards only (my recommendation), or everything including
buttons?

---

## 2. About — the gaps

### Right-hand gap: confirmed and measured

At 1440x900 there is an **83px dark strip** between Samantha and the section
edge. Two causes stack:

```
.about__portrait  right: clamp(1rem, 4vw, 5rem)  ->  57.6px offset
img               object-fit: contain            ->  25px letterbox each side
                                                     ────────────────────────
                                                     83px of dark to her right
```

The letterbox exists because the box is `min(39vw, 37rem)` wide by `86svh`
tall, an aspect that does not match the image's 608x921. Whichever axis is
tighter wins and the other gets dead space:

| Viewport | Constraining axis | Dead space |
| --- | --- | --- |
| 1440 x 900 | height | 25px each side |
| 1440 x 1080 | width | 78px above (hidden by `object-position: center bottom`) |

### The deeper problem: eleven conflicting rules

`.about__portrait` is declared **11 times** across breakpoints, with `right`
set to nine different values:

```
right: 0 · 1vw · -4rem · -4.8rem · clamp(1rem,4vw,5rem) · -1rem · -3.5rem · -4.5rem · auto
```

At 830px the computed value is `-16px`, so the portrait is clipped off the
right edge. At 1440 it is `+57.6px`, so it floats away from it. That is not a
deliberate responsive curve, it is sediment.

### Proposed

Collapse all eleven into two rules:

```css
/* Desktop and tablet: the image reaches the section edge, and the box matches
   the image's own aspect so `contain` can never letterbox. */
.about__portrait {
  right: 0;
  bottom: 0;
  height: min(86svh, 48rem);
  width: auto;
  aspect-ratio: 608 / 921;
}

/* Phones: centred under the copy, unchanged from V7. */
@media (max-width: 767px) { ...static, centred, aspect-ratio 608/921... }
```

With the box matching the image exactly, there is no dead space on any axis at
any viewport, and `right: 0` puts her against the section edge, so both
reported gaps disappear.

### On the bottom gap

I could not reproduce it. Measured `section.bottom - portrait.bottom` at 830,
1000, 1280, 1440x900 and 1440x1080: **0 every time**, and `object-position`
computes to `50% 100%`, so any letterbox sits at the top, never the bottom.

The aspect-ratio fix removes all dead space regardless, so it should resolve
whatever you are seeing. If a gap survives, tell me your window width and
browser zoom and I will chase the exact case.

---

## 3. Location — back to just the address

You are right that it got busy. Current right rail holds four capability cards,
a two-row address and hours block, a CTA and an assurance line.

**Proposed:** the operations cards move out, the rail returns to the V9 shape
but keeps the corrected address:

```
┌─────────────────────────┐
│ ▪ MapPin                │
│                         │
│ Warehouse and showroom  │   ← eyebrow
│                         │
│ KAJANG,                 │   ← display heading
│ SELANGOR.               │
│                         │
│ No. 16, Jalan SC 1,     │   ← the full address
│ Pusat Perindustrian     │
│ Sungai Chua,            │
│ 43000 Kajang, Selangor. │
│                         │
│ ▪ Mon to Sat, 9am-6pm   │   ← hours, with a Clock icon
│   Visits by appointment │
│                         │
│ Arrange a visit  ↗      │
└─────────────────────────┘
```

**Where do the four operations cards go?** They are good content and they were
the answer to "the right side looks empty". Three options:

1. **Delete them.** Simplest, but loses real wholesale positioning.
2. **Move them under the section heading**, as a four-across row above the
   photo mosaic. Keeps the content, keeps the rail clean. **My recommendation.**
3. Move them into the Corporate or Contact chapter.

The heading also needs a decision. It currently reads "Built for scale across
Malaysia" with an operations eyebrow. If the cards move up, that heading still
works. If they are deleted, it should go back to something location-led.

---

## 4. UMRAH — animating the agency flow

The four steps are currently static text with a Lucide glyph. Making them move
is the single highest-impact motion opportunity on the page, because each step
is a small story.

### Approach

A new client component, `app/components/UmrahProcessFlow.tsx`, replacing the
static list. Each step renders a **purpose-built inline SVG scene** (roughly
120x90) driven by its own GSAP timeline. Inline SVG rather than Lottie or video
keeps it dependency-free, themeable with the brand tokens, and a few KB.

### The four scenes

**01 Consult — a conversation**

```
   ╭─────────────╮
   │ ▬▬▬▬▬       │        1. agency bubble slides in from the left
   ╰─────────────╯        2. typing dots pulse (3 dots, staggered y)
        ╭──────────────╮  3. KIYO bubble slides in from the right
        │ ▬▬▬▬▬▬▬  ✓   │  4. small tick pops on the reply
        ╰──────────────╯
```
Timeline ~1.8s. Bubbles use `scale: 0.9 -> 1` with `back.out(1.6)`.

**02 Brand — applying the identity**

```
   ┌────────┐        1. case outline draws (stroke-dashoffset 0)
   │        │        2. three colour chips slide up beneath it
   │   ██   │  ← logo 3. one chip lifts and gets a selection ring
   │        │        4. the case fill tweens to that colour
   └────────┘        5. the agency mark fades in on the case front
    ● ● ●
```
The chips use real brand colours from the catalogue, so it reads as KIYO stock.

**03 Approve — signing off the sample**

```
   ┌──────────┐      1. clipboard outline draws in
   │ ☑ ▬▬▬▬   │      2. three rows appear, staggered
   │ ☑ ▬▬▬    │      3. each tick draws along its path in sequence
   │ ☑ ▬▬▬▬▬  │      4. an "approved" seal scales in with a slight
   └──────────┘         rotation and settles
```

**04 Deliver — the handover**

```
      ▄▄▄▄            1. lorry drives in from the left, easing to a stop
   ┌──┤    ├──┐       2. a parcel drops into the bed and settles
   │  └────┘  │       3. rear panel closes
   ╰─○────○──╯        4. wheels rotate, lorry drives off right
      motion lines    5. two speed lines flick past
```

### Playback rules

- Each timeline is built inside a `gsap.context()` scoped to the section, and
  started by a `ScrollTrigger` on its own card at `start: "top 82%"`.
- **Once on scroll, then replay on hover or keyboard focus.** Continuous looping
  four times over would be noisy next to the drifting product carousel.
- Steps stagger by 0.25s so the row reads left to right as a sequence rather
  than four things firing at once.
- `prefers-reduced-motion: reduce` renders every scene in its **final state**
  with no timeline created at all, so the meaning survives without motion.
- Timelines are killed on unmount via the context, matching how the rest of the
  page handles GSAP.

### Cost

Roughly 260 lines for the component including the four SVGs, plus about 60
lines of CSS. No new dependency: GSAP and ScrollTrigger are already in use.

---

## 5. Site-wide scroll reveals

### What exists now

Seven hand-written `gsap.fromTo` calls in `KiyoExperience.tsx`, each with its
own distance, duration and stagger. One of them is **dead**: it targets
`.product-collection__layout > *`, which V9 set to `display: none`. So the
product carousel, the category cards, the corporate panels, the UMRAH content,
the operations cards and the footer currently have **no entrance animation at
all**.

### Proposed: one declarative system

Replace the seven bespoke calls with a single `ScrollTrigger.batch` driven by a
data attribute, so new markup animates without anyone remembering to add a
GSAP call:

```tsx
<div data-reveal>            {/* rise and fade, the default */}
<div data-reveal="left">     {/* slide from the left  */}
<div data-reveal="right">    {/* slide from the right */}
<div data-reveal="scale">    {/* for photographs      */}
<div data-reveal-group>      {/* stagger the children  */}
```

One set of tokens for the whole page:

| Token | Value |
| --- | --- |
| Distance | 24px (`scale` uses 1.04 -> 1) |
| Duration | 0.7s |
| Easing | `power3.out` |
| Stagger | 0.08s within a group |
| Trigger | `start: "top 82%"`, fires once |

### Where it gets applied

| Section | Treatment |
| --- | --- |
| Hero | Unchanged. It already has a bespoke intro timeline that works |
| About | Copy group rises; portrait slides from the right |
| Pillars | Existing stagger, moved onto the system |
| **Products** | **New.** Heading rises, carousel fades and scales, category cards stagger |
| **Corporate** | **New.** Intro rises, gift panels stagger from the left |
| **UMRAH** | **New.** Copy rises, gallery slides from the right, process scenes as in section 4 |
| Location | Mosaic cards stagger (existing); address rail slides from the right |
| Contact | Existing |
| **Footer** | **New.** Columns stagger |
| Images | `scale` variant on the mosaic, gift covers and UMRAH cards |

### Guardrails

- Everything sits behind the existing `prefers-reduced-motion` check, which
  already wraps the animation block.
- `once: true` throughout. Elements that re-animate on every pass get tiring on
  a long page.
- Reveals only ever touch `opacity` and `transform`, never layout properties,
  so nothing can shift the page while animating.
- **No reveal on anything above the fold** other than the hero's own timeline,
  so the first paint is never blank.

---

## 6. Files this will touch

| File | Change |
| --- | --- |
| `app/globals.css` | Proof bar restyle, radius tokens, About portrait collapse (11 rules to 2), Location rail simplification, reveal base states, UMRAH scene styles |
| `app/KiyoExperience.tsx` | Location rail markup, reveal attributes, swap the seven GSAP calls for the batch |
| `app/components/UmrahProcessFlow.tsx` | New. Four animated SVG scenes |
| `app/components/KiyoInteractiveSections.tsx` | Reveal attributes, use the new flow component |
| `app/components/ProductCarousel.tsx` | Reveal attributes |
| `app/components/SiteFooter.tsx` | Reveal attributes |
| `tests/rendered-html.test.mjs` | Location rail assertions, UMRAH scene assertions |

Verification: the computed-style snapshot tool from V10 will confirm the About
gap actually closes at 830, 1000, 1280 and 1440, and that nothing else moved.

---

## 7. Open decisions

1. **Radius scope** — card family only, or buttons too?
2. **Operations cards** — delete, or move above the mosaic (my recommendation)?
3. **Icon alignment** — tile aligned to the title's top, or a full-height rail?
4. **UMRAH replay** — once on scroll plus hover, or gentle continuous loop?

I will start once you have picked, and will assume my recommendations for
anything you do not call out.

---

## 8. Follow-up round

### New About assets

The owner supplied a transparent cut-out of the founder and a clean background
plate, replacing the single composite that had the warehouse baked in.

`tools/build-about-assets.mjs` prepares both. The portrait is trimmed to its
true opaque bounds first, because transparent padding is what lets a gap open
beside the subject:

```
portrait source 1086x1448
  transparent padding  left 19, right 65, top 12, bottom 0
  trimmed to 1002x1436  ->  about-samantha.webp 900x1290, 121 KB
background            ->  about-warehouse.webp 1916x821, 178 KB
```

65px of transparent padding on the right was part of the original gap.
Measured after the swap: right strip 0, bottom strip 0, zero letterbox at 830,
1280 and 1440. The two superseded composites are deleted.

### Proof tiles

`align-items: stretch` turns the icon into a full-height rail spanning the
title's top to the description's bottom, and the icon/text pair is centred in
its column rather than pinned left.

### UMRAH flow is now an actual sequence

Chaining the four steps through a master timeline does not work: a paused child
never advances under its parent, and each step also has to stay independently
replayable on hover. They are chained by `onComplete` callback instead, with a
`sequencing` flag so a hover replay cannot trigger the next step.

Measured by sampling `data-active` every 60ms:

| Step | Active window |
| --- | --- |
| Consult | 61 - 2700ms |
| Brand | 3067 - 6366ms |
| Approve | 6726 - 8283ms |
| Deliver | 8582 - 10860ms |

Samples with more than one step active: **0**.

The Brand scene was rebuilt to the owner's idea: the selection ring walks the
three swatches, the shell recolours to the chosen one, then `KIYO` types across
the case letter by letter with a stepping caret.

Card boxes and the tinted scene panels are gone, so the row reads as one
continuous demonstration and nothing clips the lorry as it drives out of frame.

### Location rail

Centred. Measured left/right space inside the rail: heading 35/35, address
64/64, eyebrow 62/62, CTA 112/112.

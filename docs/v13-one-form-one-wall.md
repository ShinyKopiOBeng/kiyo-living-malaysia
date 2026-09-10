# V13 — One form, one wall

Three changes, driven by one piece of user feedback and one brand request.

The feedback: people fill in **Customise**, press *Continue to delivery*, and do
not realise there are four more required fields waiting. They arrive at WhatsApp
with a half-written brief. Splitting one form across two chapters was the cause,
so V13 stops splitting it.

The brand request: the About chapter must stop assembling itself out of three
layers that drift apart at odd browser zoom, and the awards on the shelf must
become something a visitor can actually read.

Nothing in the information architecture moves. `#build`, `#customise`,
`#delivery` and `#about` keep their ids, their order and their nav labels.

---

## 0. Design read

> Reading this as: a **redesign in preserve mode** of a premium-consumer and
> B2B-hybrid enquiry flow, for Malaysian corporate buyers and UMRAH agency
> owners, with the site's existing editorial-cream language, leaning toward the
> tokens already in `globals.css` plus form-specific patterns.

Dials, read off the existing site rather than off a baseline:

| Dial | Existing | V13 | Why |
| --- | --- | --- | --- |
| `DESIGN_VARIANCE` | 6 | **5** for chapters 6 and 7, **7** for chapter 9 | The complaint is untidiness. Alignment discipline is the fix for a form. The About band is photographic and stays asymmetric. |
| `MOTION_INTENSITY` | 5 | **6** | Preserve plus one. Every new movement below is tied to feedback or state, none is decorative. |
| `VISUAL_DENSITY` | 5 | **5** | Unchanged. |

Deliberate deviations from the taste skill's defaults, each with a reason:

- **Serif display type stays.** Cormorant Garamond is the brand's shipped
  heading face, not a reach for "premium". Preserve mode keeps it.
- **The cream and coral palette stays.** `--paper #f6f1e9`, `--sand #efe7da`,
  `--ink #0e2237`, `--coral #e8552f`. These are brand tokens already in the
  stylesheet, which is the documented override to the premium-consumer palette
  ban.
- **`lucide-react` stays.** It is already a project dependency, and one icon
  family per project matters more than which family.
- **No dark mode.** The site is a single locked light theme. Introducing a
  second theme is a separate piece of work, not a side effect of this one.
- **Multi-step form patterns.** The taste skill scopes itself out of wizards, so
  chapters 6 and 7 take its layout, density and tell-avoidance rules, and take
  their form behaviour from ordinary form UX instead.

---

## 1. Assets

Three new source files, all already on disk.

| Source | Size | Becomes |
| --- | --- | --- |
| `Downloads/luggage-logo-placeholder-zoom-transparent.png` | 1200x900, alpha | `sections/brandCaseZoom.webp` |
| `Downloads/SectionAssets/Section9/section-9-samantha-awards-bookshelf-combined.png` | 1942x809, alpha | `sections/aboutBand.webp` |
| `Downloads/section-9-individual-awards-transparent-png.zip` | 14 files, alpha | `sections/awards/01..14.webp` |

Measurements taken off the sources, so the CSS below is not guesswork.

**`brandCaseZoom`.** Opaque content occupies x 22.00% to 80.00% and y 0.33% to
99.89% of the 1200x900 frame. The build trims it to its opaque bounds, which
gives a **697x897** plate at ratio **0.7770**. Inside that trimmed plate the gold
engraving plate sits at:

```
outer bounds   left 33.29%   right 67.14%   top 67.00%   bottom 77.81%
centre         50.22% across, 72.41% down
size           33.86% wide, 10.81% tall
```

The engraved text area insets that by roughly 1.5% on each edge, so the live
name renders into a box **30.8% wide by 7.8% tall** centred on `50.2% / 72.4%`.
That is **1.76x the width and 1.40x the height** of the plate on the old
`brandCase.webp`, which is the "logo placeholder 太小" complaint, fixed by the
asset rather than by CSS zoom.

**`aboutBand`.** 1942x809, ratio **2.4005**. Scanned column by column:

```
0%   to 26%    Samantha, floor to ceiling
27%  to 56%    clear cream wall, mean luminance 215, near zero variance
57%  to 100%   the shelving
upper shelf surface at 34.6% down    lower shelf surface at 66.3% down
```

The clear wall panel is where the copy goes. It is bright and flat enough that
ink type sits on it at full contrast with no wash at all, which removes the
`.founder__wash` gradient entirely.

**Awards.** The zip already contains the 14 individual cut-outs, correctly named
and in shelf order, so no cropping work is needed:

```
01 rising-star-brand-2022               08 tiktok-shop-top-merchant-2024
02 excellence-customer-experience-2023  09 tiktok-top-3-live-luggage-brand-2023
03 top-100-sme-malaysia-2023            10 tiktok-shop-top-growth-partner-2023
04 sme100-fast-moving-companies-2023    11 million-ringgit-sales-achievement-2023
05 outstanding-ecommerce-achievement-2023  12 best-live-commerce-performance-2023
06 brand-impact-award-2024              13 live-commerce-excellence-award-2022
07 malaysia-trusted-brand-award-2024    14 tiktok-shop-preferred-partner-2023
```

Items 01 to 07 stand on the upper shelf, 08 to 14 on the lower one.

---

## 2. Section 6 — Customise your brand

### What is wrong

- Three columns, and the third is a ragged five-tile grid where the first tile
  spans two columns to stop a hole opening. It reads as leftover space, not as
  composition.
- The engraved plate is 19.2% by 7.7% of a case shown at full length, so the
  visitor's own name is a few pixels tall. It is the one moment in the chapter
  where the page shows them their own brand, and it is the smallest thing on
  screen.
- Two buttons, *Upload your logo* and *Send logo later on WhatsApp*, occupy a
  third of the form column to collect a file that is never sent anywhere. The
  file is read into an object URL purely for the preview.
- The chapter ends with *Continue to delivery* and gives no hint that four
  required fields are waiting on the other side of it.

### What it becomes

One chapter, two columns, every field the enquiry needs.

```
grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr)
```

**Left column, the preview.** The zoomed case at `height: min(30rem, 46vh)`,
ratio locked to `697 / 897`. The engraved plate live-renders the company name
in the same white letterspaced caps as today, sized in container query units so
it shrinks with the case instead of spilling.

Directly beneath it, sharing its centre axis and matched to the case's own
width, sits the **Company / agency name** field. That is the alignment the brief
asks for: the input that drives the engraving sits immediately under the
engraving, on the same axis, so the cause and the effect are one object. A
hairline rule between them makes the pairing explicit without a label.

Under the input, one helper line, which is now the only place the logo story is
told:

> We print this name. Send your logo artwork on WhatsApp after you submit.

**Right column, the choices and the details.** A single vertical stack, no
sub-columns except where two short fields pair naturally:

1. **Programme.** The two existing chips, side by side at equal width.
2. **What to customise.** The four options stop being text chips and become four
   **image option cards**, in one row at desktop: `brandDetail1` to
   `brandDetail4` at 4:3, label underneath, coral check badge when selected.
   This is the change that removes the ragged tile grid: the photographs move
   into the control they were illustrating. A buyer who does not know what
   "custom packaging" means can now see it. Four items, exactly four cells, no
   filler.
3. A hairline, then **Order details** as a small group label.
4. **Estimated quantity** and **Delivery city / state**, two across.
5. **Required date** and **Additional request**, two across.
6. The forward action.

**The forward action carries live state.** Above the button, one `aria-live`
line that names what is still missing:

| State | Line |
| --- | --- |
| Nothing chosen yet | `Pick a model in step 1 to start.` |
| Company name empty | `Add your company name.` |
| Quantity empty | `Add an estimated quantity.` |
| Complete | `Ready. Review your enquiry.` |

The button label changes from *Continue to delivery* to **Review my enquiry**,
because after V13 the next chapter is a review, not more data entry.

`brandDetail5`, the finished boxed set, has no home in this arrangement. Leave
the asset in place and unused rather than forcing a fifth cell into a four-item
grid. See the open questions.

### What is deleted

- The `<input type="file">`, the `onLogo` handler, the `LOGO_MAX_BYTES` guard,
  `clearLogo`, `logoUrl`, the object-URL cleanup effect, the `logo` and
  `logoError` state, the `.brandform__logo` and `.brandform__file` blocks.
- `logoName` from `composeEnquiry`, and the `Logo file:` line from the WhatsApp
  message.
- The note "Your file stays in this browser. Nothing is uploaded to a server."
  It described a behaviour that no longer exists.
- `.branddetails`, `.branddetails__tile`, `.brandpanel`.

---

## 3. Section 7 — Delivery

### What is wrong

- The six process photographs sit inside a 2.9fr column of a 4.1fr grid, six
  across, which lands each one at roughly 8rem wide. They are the only evidence
  the page offers that KIYO runs its own production and QC, and they are the
  smallest images in the chapter.
- The chapter carries four required fields that the visitor did not expect.
- The summary card is boxed into a narrow right rail, when it is now the last
  thing the whole flow is for.

### What it becomes

The fields are gone, so the chapter can do one job properly: show the process,
then hand back a complete brief to send. The layout family changes from a split
to a **full-width rail plus a centred ticket**, which also keeps chapters 6 and
7 from reading as the same composition twice.

**1. The rail, full shell width.** Six stages across `84rem` puts each image at
roughly **12.5rem**, a 55% increase, and leaves room for a line of copy under
each label:

| | Label | Line |
| --- | --- | --- |
| 01 | Brief | We take your brief and specs |
| 02 | Sample | A physical sample is made |
| 03 | Approve | You sign off the sample |
| 04 | Production | The branded run begins |
| 05 | QC | Every unit is checked |
| 06 | Warehouse | Held and shipped from Kajang |

A hairline runs behind the row of ordinals and connects them, so the six read as
one sequence rather than six tiles.

**2. The ticket, centred, `max-width: 52rem`.** The summary stops being a rail
and becomes the object the chapter is built around. It lists all eight facts in
a two-column definition list:

```
Product        Sunburst Hardshell, Black
Programme      Corporate Gifts
Company        <company>
Branding       Logo printing, Luggage tag
Quantity       250
Delivery to    Selangor
Required by    18 Oct 2026
Notes          <notes, or omitted>
```

**Any missing value renders as a coral text button, not a dash.** Pressing it
scrolls to `#customise` and focuses the field it belongs to. The summary becomes
the checklist, which is the second half of the fix for the original complaint:
even a visitor who skips a field is shown exactly which one and taken to it.

**3. The send.** The WhatsApp button at the ticket's full width, then the
existing note about sending the logo file after WhatsApp opens. This is the last
element of the flow, which is where the primary action belongs.

---

## 4. Section 9 — About KIYO

### What is wrong

The band is assembled at runtime from three layers: a shelving photograph, a
transparent Samantha cut-out sized off the band height, and two transparent
award rows positioned by percentages measured against the shelving. Any
disagreement between the band's computed height and the plate's own ratio moves
the rows off the shelves, which is what shifts at non-100% zoom.

The awards are also decoration. There are fourteen of them, they are the
strongest trust signal on the page, and a visitor cannot read a single one.

### What it becomes

**One plate, one ratio.** `aboutBand.webp` replaces the backdrop, the cut-out
and both award rows. The band is `aspect-ratio: 1942 / 809` with a height cap,
and nothing inside it is positioned against anything but that one box. Samantha,
the shelving and all fourteen trophies are baked in, so they cannot drift, at
any zoom, on any device.

`.founder__wash` is deleted. The clear wall panel between 27% and 56% has a mean
luminance of 215 with near-zero variance, so ink type sits on it at full
contrast unaided. The copy column occupies `left: 29%; width: 24%`.

**Fourteen hotspots.** A `pointer-events: none` layer over the plate holds
fourteen `<button>` elements, each positioned as a percentage of the same box
the plate fills. Seven along the upper shelf line at 34.6%, seven along the
lower at 66.3%. Each button has a real accessible name, and they tab in shelf
order.

**The lift, on hover and on focus.** The button paints a copy of its own region
of the plate as its background:

```css
.award {
  background-image: url(aboutBand.webp);
  background-size: calc(100% * var(--band-w) / var(--award-w)) auto;
  background-position: var(--award-x) var(--award-y);
  transform-origin: bottom center;
  transition: transform 260ms var(--ease-out), filter 260ms var(--ease-out);
}

.award:hover,
.award:focus-visible {
  transform: translateY(-6px) scale(1.10);
  filter: drop-shadow(0 12px 18px rgb(14 34 55 / 0.28));
}
```

The scaled copy grows by more than it rises, so it covers the baked-in original
underneath completely and the trophy reads as lifting off the shelf toward the
viewer. No second image is loaded, and nothing can fall out of register with the
plate, because the lifted pixels **are** the plate.

The hovered award's name prints into one shared caption slot above the shelving,
where the "Recognised in live commerce" label sits today. No pill is drawn on
the image.

**The dialog, on click.** A native `<dialog>` built on the same mechanics as the
gift-set inspector in `KiyoInteractiveSections.tsx`, so the two behave
identically:

- Backdrop: `background: rgb(14 34 55 / 0.32)` with
  `backdrop-filter: blur(18px)`. This is the blurred transparent background the
  brief asks for.
- Left: the individual transparent PNG, large, on nothing.
- Right: the award name, the year, the issuing body, and a two-line summary.
- Previous and next walk all fourteen, arrow keys included. Escape closes.
  Focus returns to the trophy that opened it.

The one thing this cannot supply is the copy. Names and years come from the
filenames; issuing bodies and summaries have to come from KIYO. See the open
questions.

---

## 5. Responsive

| Band | Desktop | 1024px | 767px |
| --- | --- | --- | --- |
| Customise | 2 columns, options 4 across | 2 columns, options 2x2 | 1 column: preview, name, then the stack. Paired fields go full width. |
| Delivery | rail 6 across, ticket centred | rail 3x2 | rail becomes a scroll-snap row, one and a bit visible. Ticket full width. |
| About | the band, hotspots live | the band, hotspots live | **the band crops to a portrait hero** carrying Samantha and the copy only. The fourteen awards move below it into a scroll-snap row of the individual cut-outs, each opening the same dialog. |

The mobile About fallback is not optional. At 400px the 2.4:1 band is 167px
tall, which puts each trophy at about 30px. A 30px tap target with a 30px
picture inside it is not a control.

---

## 6. Motion and accessibility

Every movement, and the one sentence that justifies it:

| Movement | Justification |
| --- | --- |
| Name appears on the engraved plate as you type | Feedback. It is the point of the chapter. |
| Option card check badge | Feedback on selection. |
| Live "what is missing" line | State. It is the fix for the reported problem. |
| Trophy lift on hover and focus | Affordance. It is what says the trophy is a control. |
| Dialog open and close | State transition. |
| The existing scroll-reveal | Hierarchy. Unchanged. |

Nothing loops. Nothing is added that a visitor did not act on.

- Every animation above collapses under `prefers-reduced-motion: reduce`. The
  trophy keeps a non-motion focus treatment so the affordance survives.
- Hotspots are buttons, tab in shelf order, and carry the award name.
- The dialog traps focus, closes on Escape and on a backdrop click, and returns
  focus to its trigger.
- Contrast: coral `#e8552f` on cream is below AA at label sizes, so the
  "add this" buttons in the ticket and the live hint line use `--coral-deep`
  `#b8360f`, as the rest of the site already does for small type.
- The removed file input took a `required`-free path; company name and quantity
  keep `required`, and product selection keeps its hand-rolled check.

---

## 7. Work

**Assets**

1. Extend `tools/build-section-assets.mjs` with `brandCaseZoom` (trim to opaque
   bounds, alpha) and `aboutBand` (alpha, 1920 wide).
2. Add `tools/build-award-assets.mjs`: unzip the 14 cut-outs, trim, encode to
   webp at 600px, write an `awardAssets` manifest.
3. Retire `bookshelf`, `samantha`, `awardsRow1`, `awardsRow2` from
   `imageSlots.ts`. Leave the files until the band ships.

**Section 6 and 7, `BuildYourSet.tsx`**

4. Delete the logo file machinery listed in section 2.
5. Move the four delivery fields into the customise step.
6. Replace the customisation chipset with the image option cards.
7. Add the live completeness hint and relabel the forward action.
8. Rebuild the delivery step as rail plus ticket, with jump-to-field buttons on
   empty values.

**Section 9, `TrustSections.tsx`**

9. Replace the three layers with the single band.
10. Add the hotspot layer, the shared caption slot and the award dialog.
11. Add the mobile award row.

**CSS, `globals.css`**

12. Rewrite `.flow__body--customise` and `.flow__body--delivery`.
13. Replace `.brandcase*`, delete `.brandform__logo`, `.brandform__file`,
    `.branddetails*`, `.brandpanel`.
14. Replace `.founder*` and `.recognition*`.

**Tests**

15. `tests/rendered-html.test.mjs` asserts against the rendered output. Fields
    moving between chapters and the removal of the two logo buttons will move
    assertions.

---

## 8. Answered before the build

1. **Award summaries.** KIYO supplied a research pass with a confidence rating
   per award. Only SME100 came back with public, verifiable criteria, so it is
   the only award whose programme is described. The other thirteen summaries
   say what the recognition is for and stop there. In particular the "Malaysia
   Trusted Brand Award" is **not** attributed to Reader's Digest: several
   Malaysian programmes use that name and the research could not resolve which
   one this trophy is. A test asserts the attribution never creeps in.
2. **`brandDetail5`.** Retired. The plate is dropped from the asset build and
   the source file stays where it is.
3. **MOQ and lead time.** Not added. They stay attached to the corporate gift
   sets, where they were verified, rather than becoming general terms.
4. **The retired award rows.** Deleted, along with `samantha.webp`,
   `bookshelf.webp` and `brandCase.webp`, and removed from the asset build.

## 9. As built

Three numbers moved between this document and the code, all after looking at
the rendered page:

- **The case is `min(28rem, 44vh)`, not 30rem.** At 30rem the preview column
  finished about 200px below the form column and left a hole under the forward
  action. The form's own gaps went up to `clamp(1rem, 2vw, 2rem)` at the same
  time, which closed most of the rest.
- **`brandCaseZoom` ships at 701x899, not 697x897.** Sharp's trim threshold is
  not the same as the alpha floor the measurement used, so the plate was
  re-measured on the shipped file: centred on 50.21% by 72.47%, running 33.67%
  by 10.79%. That is 1.9x the width and 1.9x the height of the plate on the old
  full-length case.
- **The first trophy's box is 56.3% to 61.6%.** The edge scan clipped the left
  point of the gold star, which the hotspot overlay showed.

The About band also drops the height cap it used to carry. `min(100vw * 800 /
1920, 50rem)` let the band and the picture disagree above 1920px, which is
exactly the drift this pass exists to remove.

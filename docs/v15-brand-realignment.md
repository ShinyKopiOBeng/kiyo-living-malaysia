# V15 - Brand realignment, six-set carousels, one quotation

**Status:** Approved and built. Section 10 records what shipped and how it differs. Originally: no page code or production assets change until this
document is approved. A wireframe of every section accompanies it.

**Sources, in priority order**

1. `KIYO Branding Guideline.pdf` (colours, type, logo)
2. Google Drive `07_Website` (photography: 42 files, two gift-set folders)
3. `KIYO Website Design.docx` (section order, headers, descriptions, contact mock)
4. The current repository (V14)

**Design read:** a redesign-preserve of a B2B landing page for Malaysian corporate
buyers and UMRAH agencies, with a warm editorial-commerce language now locked to
the brand guide: Work Sans and Montserrat, teal / coral / navy on the guide's own
`#f4efea` ground. Dials: variance 6, motion 5, density 4 (the current site reads
6 / 4 / 4; one notch more motion for the two auto-scrolling carousels).

---

## 1. What I found

### 1a. Brand guide against the current site

| | Current site | Brand guide | Change |
| --- | --- | --- | --- |
| Heading face | Cormorant Garamond (serif) | Work Sans | Replace. Every heading, every button label in Work Sans. |
| Body face | Montserrat | "Gontserrat Regular" | Gontserrat is a Montserrat-derived free font. Montserrat stays as the web face unless you send the Gontserrat files, in which case I self-host them. |
| Primary teal | `#67b8bd` | `#72b7bd` | Exact hex. |
| Primary coral | `#e8552f` | `#e66047` | Exact hex. |
| Navy | `#0e2237` (blue-black) | `#002f3d` (deep teal-navy) | Exact hex. Changes the whole text colour of the site. |
| Secondary | none | `#83c1c8`, `#f58c86` | Added as tints (icon circles, hover, radio cards). |
| Ground | `#f6f1e9` | `#f4efea` (sampled from the guide's pages) | Exact. |
| Logo | 653 x 258 PNG | Vector in the PDF | Extracted as SVG: horizontal, mark only, badge (favicon), and the white-on-dark variant from page 7. |
| Corner radius | 6px cards | Rounded-rectangle luggage-tag mark | Softer system: 20px cards, 12px tiles, 10px buttons and inputs. |

### 1b. Google Drive inventory

Everything in the folder was downloaded and inspected. One file is broken.

| Drive file | Size | What it shows | Where it goes |
| --- | --- | --- | --- |
| `KIYO-6-Umrah-Gift-Sets-v2/01..06` | 1536 x 1024 | Six colour-coordinated UMRAH sets, same beige studio | UMRAH carousel |
| `KIYO-6-Corporate-Gift-Sets/01..06` | 1100 x 825 | Six corporate sets, KIYO LIVING branding on every item | Corporate carousel |
| `ChatGPT ... 12_46_21 PM.png` | 1795 x 876 | Pilgrim in ihram at the mosque, KIYO cases, fade on the left | UMRAH opener (the person is correctly sized here; this replaces the current banner) |
| `ChatGPT ... 12_46_09 PM.png` | 1774 x 887 | Black corporate set with KIYO plates, fade on the left | Corporate opener |
| `your-idea-your-budget-our-recommendation.png` | 1792 x 896 | Consultation at the showroom desk, fade left | Step 01 Choose opener |
| `ChatGPT ... 02_47_23 PM.png` | 1774 x 887 | Designer showing a logo mockup on screen, fade right | Step 02 Personalise opener |
| `store-and-deliver-on-request.png` | 1792 x 896 | Building at dusk, KIYO lorry being loaded, fade left | Step 03 Deliver opener |
| `real-clients-real-experiences.png` | 1792 x 896 | Clients opening a gift box, fade right | Clients opener |
| `ChatGPT ... 12_45_27 PM.png`, `warehouse kajang sg chua.jpg` | 1942 x 809, 1493 x 809 | Building and lorry at sunset | Not needed once the warehouse band is retired (see 2); kept on disk |
| `ChatGPT Image May 12 (1)` | 1672 x 941 | Main warehouse hall, teal racking, KIYO LIVING SDN BHD sign | Deliver: "Store Here" panel |
| `pipeline6.webp` | 800 x 551 | Rows of cases on pallets, lorry at the dock | Deliver: "Deliver to You" panel |
| `warehouse (6).png` | 1619 x 971 | Showroom, cases on shelves, KIYO sign | Deliver: "Pick Up Anytime" panel |
| `ChatGPT Image May 12 (2)(3)(4)(5)(6)(7)`, `warehouse (2)(3)(4)(5)` | | Aisles, office, reception, exterior | Spares. Not placed; see 4.7 |
| `warehouse (1).png` | | Reception counter with a **GOLVIA** sign | Not used: wrong brand name in the picture |
| `brandDetail1.webp`, `brandDetail2.webp` | 900 x 900 | Logo plate, luggage tag | Personalise portfolio (already shipped) |
| `pipeline1..5.webp` | 800 x 551 | Consultation, mockup, presentation, production, QC | Personalise portfolio uses 2 and 3 |
| `KIYO Website Design.docx` | | The layout draft, 22 embedded images | Section copy, order, contact mock |

**Broken file.** `06-coffee-wellness.png` is truncated at 622,592 bytes in **both**
copies on Drive (the folder copy and the loose copy in the root). The upload
stopped part way; only the top 45% of the picture decodes. Please re-upload it.
Until then the sixth corporate card shows a branded placeholder tile, not a
half-picture.

### 1c. What the docx asks for

The document runs UMRAH, Corporate, Step 01 Choose, Step 02 Personalise, Step 03
Deliver, Testimonials, then a contact-form mock, then a heading "SAMANTHA and
Awards" with nothing under it. Each section is a three-line headline, one
sentence, and for the two gift chapters a "Build Your ... Set" button. I follow
that copy word for word (section 4).

---

## 2. Page order

| # | Now (V14) | V15 | Anchor |
| --- | --- | --- | --- |
| 1 | Header and hero | Header and hero, **new KIYO-branded hero picture** | `#home` |
| 2 | Warehouse band | **Proof strip** (the four numbers, moved up from Clients) | none |
| 3 | UMRAH, four sets | UMRAH opener + **six-set auto-scrolling carousel** | `#umrah` |
| 4 | Corporate, four sets | Corporate opener + **six-set carousel** | `#corporate` |
| 5 | Choose (select for bulk / buy retail) | **Step 01 Choose**: opener + luggage rail, colour picks kept, one "Shop more" | `#choose` |
| 6 | Customise (form) | **Step 02 Personalise**: opener + customisation portfolio, no form | `#personalise` |
| 7 | Delivery + quotation card | **Step 03 Deliver**: opener + warehouse gallery | `#deliver` |
| 8 | - | **Quotation and location**: contact form + map, sends email and WhatsApp | `#quote` |
| 9 | Clients (numbers, proof cards, voices) | **Clients**: opener + logo marquee + three videos | `#clients` |
| 10 | Samantha, trophies you can hover and open | **Samantha and Awards**, static | `#about` |
| 11 | Nationwide reach + visit card | Retired. The map and address now live in `#quote` | - |
| 12 | Closing band, footer | Slim closing band, footer with the white logo | `#contact` |

Two things are removed rather than moved, and both are judgement calls you can
reverse:

- **The warehouse band** ("Designed here. Prepared here. Delivered from here.")
  is not in the docx, and its photograph (the building and the lorry) is now the
  Step 03 opener. Two chapters carrying the same building would read as a
  mistake. The four proof numbers take its place under the hero, which also
  stops the home hero and the UMRAH opener sitting photo-on-photo.
- **Nationwide coordination and the visit card** duplicate what the quotation
  section now carries (map, address, hours, directions). The reach map is
  retired with it.

Header navigation, one line: **UMRAH · Corporate · How it works · Clients ·
About**, then *Shop retail* (the flyout) and the primary **Request a quote**
button to `#quote`. "How it works" marks all three steps. The mobile sheet uses
the same list.

---

## 3. The brand system

### 3a. Colour

| Token | Hex | Role | Contrast on `#f4efea` |
| --- | --- | --- | --- |
| `--navy` | `#002f3d` | All text, dark bands (closing band, footer) | 12.5 |
| `--teal` | `#72b7bd` | Icons, rules, the mark, decorative only | 2.0 (never text) |
| `--teal-light` | `#83c1c8` | Icon circles, hover tints, selected radio cards | - |
| `--coral` | `#e66047` | The payoff line of each headline, buttons, hover states | 3.0 (large text only) |
| `--coral-deep` | `#b23f26` | Small coral text: eyebrow labels, links | 5.1 |
| `--salmon` | `#f58c86` | Focus rings on dark, soft highlights | - |
| `--paper` | `#f4efea` | Page ground | - |
| `--sand` | `#ebe4db` | Alternating chapter ground | - |
| `--white` | `#ffffff` | Cards, the form, product cards | - |

Buttons stay on the exact brand coral with white labels. That pair measures
3.4:1, which is under AA for 14px text; the current site ships the same
combination. If you would rather be strictly AA, the rest state moves to
`#c9482b` (4.7:1) and hover brings the brand coral back. Your call.

Teal is never used for small text anywhere: at 2:1 it is unreadable on cream.

### 3b. Type

| Role | Face | Setting |
| --- | --- | --- |
| Hero headline | Work Sans 600 | `clamp(2.6rem, 5.2vw, 4.4rem)`, line-height 1.02, tracking -0.02em |
| Chapter headlines | Work Sans 600 | `clamp(2rem, 3.6vw, 3.2rem)`, one sentence per line, last line in coral |
| Section labels | Montserrat 600 | 11px, uppercase, 0.18em tracking, `--coral-deep` |
| Body | Montserrat 400 | 16-17px, line-height 1.6, navy at 72% |
| Buttons | Montserrat 700 | 13px, uppercase, 0.08em |
| Card names, form labels | Montserrat 600 | 13-14px |

Work Sans comes in through `next/font/google` and `tools/build-fonts.mjs`, the
same way the two current faces do, so it is self-hosted from `public/fonts`.
Cormorant Garamond goes.

The three-line headline convention in the docx (*Your Jemaah. / Your Brand. /
One Complete Journey.*) is kept as written: three short sentences, each on its
own line, the last in coral. It is the one typographic device the whole page
shares, so it is used on every chapter opener and nowhere else.

### 3c. Logo

The PDF carries the logo as vector paths (page 3: three lockups; page 4: the
icon and the circular badge; page 7: white-on-teal, white-on-navy and
white-on-coral). I extract them to SVG with the same tool that read the PDF,
which gives:

| File | Use |
| --- | --- |
| `kiyo-logo.svg` | Header, mobile sheet (teal mark, coral wordmark) |
| `kiyo-logo-white.svg` | Footer and the closing band, on navy (teal mark, white wordmark, per page 7) |
| `kiyo-mark.svg` | Video placeholders, the quotation success state |
| `favicon.svg` + `favicon.png` | The teal circle badge from page 4 |
| `og.png` | Regenerated with the new hero and the vector wordmark |

The horizontal-with-tagline lockup is not used on the page; the tagline is the
hero headline.

### 3d. Shape and surface

One radius scale: cards and openers 20px, tiles and thumbnails 12px, buttons and
inputs 10px, chips full pill. Shadows are navy-tinted and quiet
(`0 18px 44px rgb(0 47 61 / 0.10)`), used only on the form card and the set
inspector. Everything else is grouped with spacing and hairlines
(`rgb(0 47 61 / 0.12)`).

---

## 4. The sections

Every chapter opener below is the same component with two variants, so the six
of them cannot drift: **full-bleed** (the photograph spans the page, copy sits
in the faded side) and **split** (copy in a column, the photograph contained in
a 20px-radius frame beside it). Which side the copy takes is decided by the
picture's own fade, which is why the page alternates left, left, left, right,
left, right without any picture being mirrored (a mirrored picture would mirror
the KIYO plates).

### 4.1 Home hero

- **Copy:** *Designed for your journey.* over two lines, one sentence under it
  (`Premium luggage, corporate gift sets and UMRAH programmes, customised and
  delivered from Kajang.`), then **Request a quote** (coral, to `#quote`) and
  **See the gift sets** (ghost, to `#umrah`). Nothing else in the hero.
- **Picture:** none of the 42 Drive files is a home hero with a KIYO plate: the
  two candidates are already the UMRAH and Corporate openers. I generate one
  with Higgsfield in the same studio language as the Drive photography (beige
  set, arch shadows, a KIYO luggage family with the gold plate, copy space on
  the left) and show you three candidates before any is used. If you would
  rather supply one, it needs to be about 1920 x 900 with the left 40% quiet.
- **Motion:** the existing entrance (picture settles, copy staggers) stays.

### 4.2 Proof strip

The four numbers from Clients (4.9 Shopee rating, 2,000+ sold on one listing,
5.0 Google from 183 reviews, 14 awards since 2022) in one row on the ground,
hairline above and below, counting up once as they arrive. Each keeps its scope
line. Please re-confirm the four figures; a moved rating is worse than none.

### 4.3 UMRAH

- **Opener:** full-bleed, copy left. Label *UMRAH PROGRAMME*. Headline *Your
  Jemaah. / Your Brand. / One Complete Journey.* Body: *Thoughtfully
  coordinated luggage and travel essentials, customised for your agency and
  prepared for every jemaah.* Button **Build Your UMRAH Set**, which scrolls to
  `#quote` with *UMRAH Sets* pre-selected.
- **Carousel:** six 3:2 cards on a track that scrolls left on its own at about
  28px a second. The track is a native scroll container, so it also drags,
  swipes and pages with the arrow buttons; the auto-scroll pauses on hover,
  on focus and while a finger is down, and resumes three seconds after the last
  interaction. The list is rendered twice and the scroll position wraps at the
  half-way point, which is the only offset that loops without a jump. Under
  `prefers-reduced-motion` it does not move on its own at all.
- **A card** is the photograph, the set name, and a *View set* affordance on
  hover. Clicking opens the existing inspector (enlarged plate, contents, MOQ,
  lead time, previous / next, **Enquire about this set**, which now scrolls to
  the quotation with the set name attached rather than opening WhatsApp).
- **The six sets**, named from the Drive files, contents read off the pictures.
  Please correct anything that is not in the physical set:

| | Set | Contents as pictured |
| --- | --- | --- |
| 01 | Navy Heritage Set | Cabin and medium cases in navy; sling bag and rolled prayer mat; tasbih, insulated bottle, document holder, luggage tag |
| 02 | Emerald Women's Telekung Set | Cabin and medium cases in emerald; telekung and prayer mat; drawstring bag, pouch, bottle, tasbih |
| 03 | Desert Terracotta Set | Cabin and medium cases in terracotta; drawstring bag, two pouches, travel slippers; rolled prayer mat, spray bottle, luggage tag |
| 04 | Dusty Rose Comfort Set | Cabin and medium cases in dusty rose; neck pillow, eye mask, tote bag; prayer mat, pouch, bottle, tasbih |
| 05 | Charcoal Teal Executive Set | Cabin and large cases in charcoal; backpack, sling bag, neck pillow; portable fan, bottle, pouch, presentation box |
| 06 | Sapphire Men's Ihram Set | Cabin and medium cases in sapphire; ihram set and drawstring bag; neck pillow, sling bag, bottle, pouch, slippers |

MOQ and lead time stay at the approved *100 sets* and *6-8 weeks* on every set.

### 4.4 Corporate

- **Opener:** split, copy **right**, the black set contained on the left
  (cropped to the cases so the fade is not in frame). Label *CORPORATE GIFTS*.
  Headline *Your People. / Your Brand. / A Lasting Impression.* Body:
  *Thoughtfully curated gifts, customised for clients, employees, partners and
  every occasion.* Button **Build Your Corporate Gift Set** to `#quote` with
  *Corporate Gifts* pre-selected.
- **Carousel:** the same component, 4:3 cards, on the sand ground so the two
  gift chapters read as siblings rather than a repeat.

| | Set | Contents as pictured |
| --- | --- | --- |
| 01 | Travel Comfort Set | Mini hard case; headphones, neck pillow, portable fan; drawstring pouch |
| 02 | Outdoor Team Retreat Set | Folding chair, cooler bag, umbrella; lantern and picnic blanket |
| 03 | Executive Desk Set | Leather notebook, card holder, pen; thermos and keychain, boxed |
| 04 | Tech Productivity Set | Backpack; speaker, power bank, wireless charger; phone stand, cables |
| 05 | Apparel Welcome Set | Polo shirt, tote bag, cap; lanyard, socks, pin badge |
| 06 | Coffee Wellness Set | Wooden gift box, French press, coffee (picture pending re-upload) |

### 4.5 Step 01 Choose

- **Opener:** full-bleed, copy left. Label *STEP 01* with *CHOOSE* beside it.
  Headline *Your Idea. / Your Budget. / Our Recommendation.* Body: *Choose from
  our collections, share your idea or simply tell us your budget. We'll curate
  the right gift set for you.*
- **Rail:** the current luggage rail, kept: cases and sets only, scroll-snap,
  arrows, one colour swatch row per card that swaps the photograph. What goes:
  *Select for bulk*, *Buy retail*, the "Selected" badge, the "pick a model"
  status line, and the step rail (the three openers now number themselves).
  What comes: one **Shop more** button on the right of the rail header, which
  opens the existing retail flyout (Shopee, TikTok Shop). I read your note as
  one button for the rail rather than one per card; say so if you meant per
  card.

### 4.6 Step 02 Personalise

- **Opener:** full-bleed, copy **right** (the fade is on the right). Label
  *STEP 02 · PERSONALISE*. Headline *YOUR BRAND. / YOUR GIFT. / YOUR WAY.* set
  in the same case as the others, so *Your Brand. / Your Gift. / Your Way.*
  Body: *Share your logo. We'll create a FREE custom design for your approval.*
- **Portfolio**, replacing the form: a five-cell bento, four columns by two
  rows, every cell filled.

```
+---------------------+----------+----------+
|                     | Luggage  | Shell    |
|   Logo printing     | tag      | colours  |
|   (brandDetail1)    | (bD2)    | (bD3)    |
|                     +----------+----------+
|                     | Branded  | Approval |
|                     | access.  | mockup   |
|                     | (bD4)    | (pipe2)  |
+---------------------+----------+----------+
```

  Captions sit under each picture, not on it. Under the bento, one line of three
  steps in plain words, no icons: **Share your logo** · **We send a free
  mockup** · **Approve, then we print.** Mobile: the large cell first, then the
  four small ones two-up.

### 4.7 Step 03 Deliver

- **Opener:** full-bleed, copy left. Label *STEP 03 · DELIVER*. Headline
  *Deliver to You. / Store Here. / Pick Up Anytime.* Body: *Delivered to your
  doorstep, stored securely at our warehouse, or picked up whenever you're
  ready.*
- **Gallery:** the headline makes three promises, so the gallery is three
  panels, one per promise, as an accordion: three strips side by side, the one
  under the pointer (or tapped) expands to about 60% and reveals its line.

| Panel | Picture | Line |
| --- | --- | --- |
| Deliver to You | `pipeline6` (cases on pallets, lorry at the dock) | Nationwide, to your office or venue |
| Store Here | `ChatGPT Image May 12 (1)` (the main hall with the KIYO sign) | Held in Kajang until you call for it |
| Pick Up Anytime | `warehouse (6)` (the showroom) | Collect from the showroom, Monday to Saturday |

  No other layout on the page uses this family. Mobile: three stacked frames,
  each 16:9, line under each.

### 4.8 Quotation and location

Built to the contact mock in the docx: two columns on the ground, the form in a
white card with the quiet shadow.

**Left column.** Label *CONTACT US*. Headline *Let's Create Something
Thoughtful.* with the full stop in coral. Sub-line *Tell us what you need.
We'll recommend the right set and prepare your quotation.* Then the Google Maps
embed (the current `MAP_EMBED`) in a 12px frame with a *View on Google Maps*
link on it, and under it four contact rows with teal icon circles: address,
WhatsApp `+60 13-276 7887`, `kiyoliving88@gmail.com`, *Monday to Saturday,
9:00am to 6:00pm*.

**Right column, the form.** Label *TELL US ABOUT YOUR GIFT*.

| Field | Type | Required |
| --- | --- | --- |
| Name | text | yes |
| Company | text | no |
| HP / WhatsApp | tel | yes |
| Email | email | no (needed for the auto-reply) |
| Estimated quantity | number | no |
| I'm interested in | two radio cards: *Corporate Gifts*, *UMRAH Sets* | yes |
| Custom logo? | three radio cards: *Yes*, *No*, *Not sure* | no |
| Set | hidden; filled when the visitor arrived from a set inspector, shown as a removable chip | no |
| Message | one optional line | no |

Button **Request a quote**, full width. Under it: *We'll only use your details
to respond to your enquiry.*

**What happens on submit.** Both routes fire from the one press:

1. **Email.** The form posts to Web3Forms, which delivers the enquiry to
   `kiyoliving88@gmail.com` and sends the visitor an auto-reply. Web3Forms is
   a form-to-email relay with no server of ours: the site stays static and
   deploys exactly as it does now. The free tier covers 250 enquiries a month.
   It needs one thing from you: create an access key at web3forms.com with the
   KIYO email (it verifies that inbox, which is why I cannot do it for you) and
   paste it into `NEXT_PUBLIC_WEB3FORMS_KEY`. Until the key exists the form
   still works through route 2.
2. **WhatsApp.** In the same press, the page opens `wa.me/60132767887` with
   the whole brief written into the message. A browser cannot send a WhatsApp
   message on someone's behalf; it can only open the chat with the text
   ready. The success panel says so and repeats the button in case a popup
   blocker ate the first tab.

The success state replaces the form: *Thanks, {name}. Your request is with
KIYO.* plus **Open WhatsApp** and the one-line reminder to press send. Sending
shows *Sending...* on the button; an email failure keeps the WhatsApp route
and says *Email did not go through. Your brief is still open in WhatsApp.* A
honeypot field and a submit-time check keep bots out.

If you later move hosting to Cloudflare, the same form can post to a Worker
that emails through Resend and stores every enquiry; nothing on the page
changes. The n8n connector in this workspace is not authorised, so I have not
planned around it.

### 4.9 Clients

- **Opener:** full-bleed, copy right. Label *OUR CLIENTS' TESTIMONIALS*.
  Headline *Real Clients. / Real Experiences. / Lasting Trust.* Body: *Hear
  from the businesses and agencies who trusted KIYO with their gifts,
  programmes and deliveries.*
- **Logo marquee:** unchanged, twelve marks, never pauses, stops under reduced
  motion.
- **Videos:** three 9:16 cards under the marquee, because KIYO's video is
  TikTok video and a landscape frame around a portrait clip is two black bars.
  Each card takes an MP4 and a poster, or a TikTok / YouTube link; a click
  plays it in place. Until the clips arrive the cards are a navy tile with the
  KIYO mark and *Video coming soon*. Nothing is invented: no view counts, no
  captions I do not have.
- **Removed:** the five proof cards and the three quotes. The docx does not
  carry them and two of the three quotes are unattributed.

### 4.10 Samantha and Awards

The photograph band stays exactly as it is, with Samantha's name, role and the
one-line quote. What goes: the fourteen hover hotspots, the caption and hint,
the award dialog, and the mobile row that listed the trophies by name. The
trophies remain in the picture and nothing on the page claims anything about
them. `awardWall.ts`, `tools/build-award-wall.mjs` and the 28 award cut-outs
are deleted with it.

### 4.11 Closing band and footer

One navy band: *Ready to start?* and the same **Request a quote** button, with
**WhatsApp** beside it. The footer carries the white logo, the B2B links
(Corporate Gifts, UMRAH Programmes, How it works, Request a quote), the two
retail stores, the address and contact, socials and legal. "Arrange a visit"
now points at `#quote`.

---

## 5. Assets

### 5a. Pipeline

`tools/build-section-assets.mjs` gets a second source root pointing at the
Drive download, and its `PLATES` list is rewritten for V15. Every picture is
resized to the largest size its slot can use and encoded as WebP, as now.

| Plate | Source | Width |
| --- | --- | --- |
| `heroHome` | generated (4.1) | 1920 |
| `umrahOpener`, `corporateOpener`, `chooseOpener`, `personaliseOpener`, `deliverOpener`, `clientsOpener` | the six Drive banners | 1920 |
| `umrahSet1..6` | Drive folder | 1200 |
| `corporateSet1..6` | Drive folder (`06` pending) | 1100 |
| `deliverShip`, `deliverStore`, `deliverCollect` | `pipeline6`, `May 12 (1)`, `warehouse (6)` | 1600 |
| `brandDetail1..4`, `pipeline2` | already shipped | as is |
| `aboutBand`, twelve client logos | already shipped | as is |

Retired from `public/images/kiyo/sections`: `heroAirport`, `warehouseTruck`,
`umrahBanner`, `umrahSet1-4`, `corporateBanner`, `corporateSet1-4`,
`brandCaseZoom`, `pipeline1,3,4,5`, `clientVideo`, `partner*`,
`reachMapFallback`, `reachMap.svg`, and the `awards/` folder. The older
`public/images/*.webp` stand-ins that nothing references (about 5MB) go too.
The product shots under `public/images/kiyo/products` stay: the rail uses them.

### 5b. The home hero

Generated with Higgsfield from three references: the current airport hero (for
the composition and the light), the corporate opener (for the KIYO plate and
the case family) and the brand guide cover. Three candidates, you choose one,
and if none is right the fallback is the corporate opener cropped wide with
the copy over its fade.

---

## 6. Motion

Every animation has one job:

| Where | What | Why |
| --- | --- | --- |
| Hero | Picture settles, copy staggers in | The one entrance on the page |
| Proof strip | Numbers count up once | Draws the eye to the figures |
| Two carousels | Constant leftward drift, pause on hover | Shows six sets in the width of three |
| Chapter openers | Fade-up on entry (existing observer) | Sequence |
| Deliver gallery | Panel expands on hover or tap | Feedback |
| Form | Button state, success panel slides in | Feedback |

`prefers-reduced-motion` stops the carousels, the marquee, the count-up and the
entrances. The IntersectionObserver reveal system and the anchor-click handler
in `KiyoExperience` are kept as they are; both are documented as load-bearing.

---

## 7. Tests

`tests/rendered-html.test.mjs` is rewritten section by section: the new chapter
order, the header (five links, retail, quote), the hero, the two carousels
(twelve set names, twelve `View set` controls, the clone marked `aria-hidden`),
the luggage rail without bulk / retail buttons and with one *Shop more*, the
Personalise bento (five figures, five captions), the Deliver accordion (three
panels), the quotation form (every field name, both radio groups, the
honeypot), the Clients marquee and three video slots, the static About band
(no hotspots, no dialog), and the footer. The architecture tests stay: the
anchor handler must exist, the stylesheet must stay flat, every referenced
picture must be shipped, and the Lazada word must not appear.

---

## 8. What I need from you

**Decisions**

1. The home hero: generate (my recommendation) or you supply one.
2. Retire the warehouse band and the nationwide / visit chapter, as in section 2.
3. Buttons on the exact brand coral (3.4:1) or the AA-safe deeper coral (4.7:1).
4. "Shop more": one button on the rail, or one per luggage card.
5. Corporate opener as a split with the copy on the right, so the page is not
   three copy-left openers in a row.

**Files**

6. Re-upload `06-coffee-wellness.png` (both Drive copies are truncated).
7. The three videos, when ready: MP4 plus a poster frame each, or links.
8. Gontserrat font files, if you have them; otherwise Montserrat stays.
9. A Web3Forms access key made with the KIYO email.

**Confirmations**

10. The twelve set names and contents in 4.3 and 4.4.
11. The four proof figures in 4.2.
12. The two client crests still described as "Client organisation logo".

---

## 9. Build order

Each step leaves the site building and the tests green.

1. **Brand tokens and type.** `globals.css` `@theme`, `fonts.ts`,
   `build-fonts.mjs`, the vector logos, favicon, OG card. Every existing
   section re-renders in the new palette and faces before any layout moves.
2. **Assets.** Download script for the Drive folder, the V15 `PLATES`,
   `sectionAssets.ts`, `imageSlots.ts` with alt text for every new plate.
3. **The opener component** and the six chapters' copy.
4. **The carousel** and the twelve sets, with the inspector re-pointed at the
   quotation.
5. **Steps 01 to 03**: rail cleanup and *Shop more*, the Personalise bento, the
   Deliver accordion.
6. **The quotation section**: form, validation, Web3Forms, WhatsApp handoff,
   states, the set chip, the programme pre-select from the gift CTAs.
7. **Clients** (opener, marquee, video cards) and **About** (static).
8. **Header, proof strip, closing band, footer**; remove the retired chapters
   and their CSS; `flatten-css --check`.
9. **Tests, lint, `npm test`, `git diff --check`**, then desktop and mobile
   screenshots at 1440, 1024, 768 and 390 for one refinement pass.

---

## 10. As built

Everything above shipped on 17 September 2026, with these decisions from KIYO
and these differences from the plan.

**Decisions taken.** The warehouse band stays, so the proof strip sits between
it and the UMRAH opener rather than replacing it. Buttons are on the exact brand
coral. One "Shop more" button, on the rail. The corporate opener is the split
with the copy on the right. The luggage rail is no longer selectable, so the
quotation carries no set chip: the gift chapters and the inspector only
pre-select the programme.

**Set names.** Chosen from the delivered filenames and tidied: Navy Heritage,
Emerald Telekung, Desert Terracotta, Dusty Rose Comfort, Charcoal Executive
and Sapphire Ihram for UMRAH; Travel Comfort, Outdoor Retreat, Executive Desk,
Tech Productivity, Apparel Welcome and Coffee Wellness for corporate. All in
`giftSets.ts`.

**Same day, the stand-ins were filled.** KIYO produced the plated airport hero
in ChatGPT (Higgsfield here is on the free plan, so nothing could be generated
from this side) and a complete square of the Coffee Wellness set; both went
through the asset tool under their existing ids. KIYO's Web3Forms key was
created and is the default in `QuoteSection`, with the environment able to
override it; a real-browser submission was verified end to end (WhatsApp opens
with the brief, Web3Forms answers `success: true`, the inbox receives it).

**The client archive.** KIYO shared a Drive archive of about 220 phone photos
and clips across sixteen client folders and asked for a selection. Every file
was reviewed by thumbnail. Three clips were chosen for the video cards, one
scene each: IIRKAZ receiving branded cases at its office, Hejira Travel
presenting its UMRAH set, AQ Travel & Tours collecting printed sets at the
KIYO grand opening. They are re-encoded for the web by
`tools/build-client-videos.mjs`. Six photographs went into a handover wall
under the videos, captioned only with what the picture or KIYO's own filing
establishes: Hejira jemaah at the airport, the PTPTN handover in front of the
Tabung Pendidikan sign, IIRKAZ jemaah at KLIA, Koperasi TNB, Manazel Mashaer
Travel, and a branded bulk order. Not used: the TikTok live screenshots, the
old-shoplot stock photos, and a reception photograph carrying another
company's sign.

**The luggage rail became the same carousel.** On KIYO's request the
collection shows all ten products, bags included, on the drifting loop the
gift sets use (`DriftCarousel` now drives both), and a hovered card fades from
the front shot to the three-quarter shot of the chosen colour.

**next/font is gone.** The Vinext build injected its `@font-face` rules into
the HTML with the build machine's own file paths, so every visitor's browser
asked for `C:/Users/.../.vinext/fonts/...`. The faces were already self-hosted;
the loader was removed and the test suite now asserts no such path is emitted.

**Retired with this release.** `BuildYourSet.tsx`, `awardWall.ts`,
`tools/build-award-wall.mjs`, `tools/build-about-assets.mjs`, the reach map,
the 28 award cut-outs, the `public/media` generated set and about 5MB of
stand-in photography in `public/images`. `public/` went from about 20MB to
7.5MB.

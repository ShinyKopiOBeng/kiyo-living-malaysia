# V14 — Proof, and six fixes

One chapter gets rebuilt and six smaller things get corrected. Nothing here is
started until it is approved.

| # | Item | Size |
| --- | --- | --- |
| 1 | Chapter 8, Clients, rebuilt around video and voices | large |
| 2 | The trophy hover lifts its background with it | medium |
| 3 | The award dialog becomes frosted glass | small |
| 4 | Nav order: UMRAH before Corporate | trivial |
| 5 | The nav marks the chapter you are in | small |
| 6 | The logo marquee stops pausing on hover | trivial |
| 7 | What the WhatsApp buttons should actually say | small |

---

## 1. Chapter 8 — Clients

### What is wrong

The chapter is one row split into three unequal regions, and each region is the
weakest possible version of itself.

- **The film is not a film.** It is a still photograph with a play badge drawn
  on it that opens TikTok in a new tab. A visitor who wanted proof leaves the
  site to get it.
- **The quotes are unattributed.** "Corporate client" and "UMRAH agency
  partner" are roles, not references. A quote with no name is close to no quote.
- **Partner stories are three thumbnails about 100px wide**, under a heading
  that opens a WhatsApp chat. Pressing something labelled "Partner stories"
  and landing in a chat window is a broken promise.
- **The logo marquee pauses on hover**, so the row stalls whenever the pointer
  crosses it, which is most of the time on a wide screen.

The section is meant to be the answer to "should I trust these people with a
250-unit order", and it is currently the thinnest chapter on the page.

### What the chapter has to work with

| Asset | State |
| --- | --- |
| 12 client marks | Real, permission granted, already shipping |
| 1 video poster (`clientVideo.webp`) | A still. No actual clip on the site |
| 2 testimonials | Real quotes, no attribution |
| 3 partner photographs | Real, currently rendered at thumbnail size |

Two of those four are strong. The other two are the reason the chapter reads
thin, and both are blocked on KIYO rather than on code. See section 8.

> **Built.** See section 9 for what changed between this plan and the shipped
> chapter: the clips did not exist, so the strip is poster-led with the
> destination printed on every card, and it gained a row of KIYO's real numbers
> at the top.

### Plan A, recommended: marquee, film strip, voices

Three stacked bands, each doing one job. The layout family is a **gallery**,
which nothing else on the page uses: chapter 6 is a split, chapter 7 is a rail
plus a ticket, chapter 9 is a full-bleed band.

**1. The marquee.** Unchanged, except it never stops. See item 6.

**2. The film strip.** Five vertical cards in one row, 9:16, scroll-snapping
below the desktop breakpoint. Vertical is not a style choice: KIYO's video is
TikTok video, and a 16:9 frame around a 9:16 clip is two black bars and a
smaller picture. At `84rem` across five cards with gaps, each card is about
`15.5rem` wide and `27.5rem` tall, which makes this the largest thing in the
chapter, as it should be.

Each card carries a poster frame, a play badge, and one line saying what it
shows. No view counts, no like counts: KIYO has not supplied any and inventing
engagement figures would be inventing evidence.

Behaviour, in order of preference:

| | On hover | On click | Needs |
| --- | --- | --- | --- |
| **A1** | A muted 3 to 5 second loop plays in the card | A lightbox plays the full clip, with a "Watch on TikTok" link inside it | Short MP4s plus poster frames from KIYO |
| **A2** | The poster scales slightly | Same lightbox | Full MP4s plus posters |
| **A3** | The poster scales slightly | Opens TikTok in a new tab | Posters only. This is today's behaviour, five times over |

A1 is what makes the chapter work. It is also the only one that keeps a visitor
on the page, and it is the pattern every video-led commerce site now uses,
so it needs no explanation. It costs KIYO five short clips.

**3. The voices.** The partner photographs and the testimonials stop being two
weak blocks and become one strong one. Three cards, each carrying the
photograph of that partner story, the quote, and the attribution underneath.

The row is deliberately not three equal cards. One quote is featured across two
columns with the photograph beside it, and the other two sit under it at half
size. Three identical cards in a row is the layout the rest of the internet
uses for this exact block, and it is worth avoiding for that reason alone.

Attribution is the whole point of the band:

```
"Reliable quality and seamless coordination from start to finish."

  <Name>, <Role>            [client mark]
  <Organisation>
```

Putting the client's own mark beside the quote ties the sentence to a logo the
visitor scrolled past thirty seconds earlier. That link is worth more than any
amount of design. It is blocked on KIYO getting permission to name people.

**4. The close.** One link, "See more on TikTok", pointing at the channel.
The "Partner stories" heading stops opening WhatsApp.

### Plan B, if the clips never arrive

Same three bands, but the film strip is one landscape card at 60% width with the
three partner photographs stacked beside it, and clicking still leaves for
TikTok. This is close to today's arrangement, correctly proportioned. It is a
fallback, not a recommendation: it leaves the chapter without the thing it
exists to provide.

### Height

Plan A is roughly twice the height of the current chapter. That is the cost of
the chapter doing its job rather than gesturing at it, and it is still shorter
than chapters 3 and 4.

---

## 2. The trophy lifts its background with it

### What is wrong

The first trophy on the upper shelf is the clearest case, and the cause applies
to all fourteen.

Each hotspot paints its own rectangle of the band as its background and scales
that rectangle. Everything inside the rectangle scales, including whatever
background happens to be in it. On a smooth wall that is invisible. On a hard
edge it is not, and the first trophy's box has two:

```
56.30%   the box's left edge          <- as measured for V13
56.67%   a vertical wall and shelf post edge, inside the box
57.26%   the star's own left edge
35.40%   the box's bottom edge
34.06%   the shelf's top surface, inside the box
```

So the box contains a vertical architectural edge and a horizontal shelf edge,
and both slide when the box scales. That is the "background floats up with it"
the feedback describes.

Tightening the box fixes this one trophy. It does not fix the technique: every
box sits on a shelf, so every box has the shelf edge in it somewhere.

### The fix: stop moving background pixels at all

The fourteen transparent cut-outs already ship, for the dialog. Use them for the
lift as well.

- The hotspot holds an `<img>` of its own cut-out, positioned to sit exactly on
  top of the trophy baked into the band. It has no background, so at rest it is
  invisible whether or not it is painted.
- On hover it scales 1.12 from its bottom edge and rises 4%. Since it grows by
  more than it rises, it fully covers the trophy underneath.
- **No background pixel moves, on any trophy, ever.** The wall and the shelf are
  the untouched photograph the whole time.

This also removes the reason the V13 boxes had to be extended down into the
shelf board, and it removes the need for edge masking.

### The registration problem, and how it gets solved

The cut-out has to land exactly on its baked-in twin or the trophy will ghost.
Measuring the trophy edges by scanning for gold and black is not accurate
enough: a test pass just now produced bounding boxes 15% to 118% off the
cut-outs' own aspect ratios, because the scan picks up neighbours and shelf
shadows.

The accurate method is to **match each cut-out against the band**: slide the
cut-out over a search window at a range of scales, score only its opaque
pixels, and take the best offset and scale. That is an offline measurement run
once; its output is the same fourteen-row table `awardWall.ts` already has, with
numbers that are correct rather than eyeballed. The run also gives a confidence
score per trophy, so a bad match is visible rather than shipped.

If any trophy cannot be matched confidently, that one keeps the current
technique with a tightened box, and the doc says which.

---

## 3. The award dialog becomes frosted glass

Today the dialog is a solid `--paper` panel and the backdrop carries an 18px
blur. That is the wrong way round: the panel is opaque, so the blur behind it is
only visible in the margins.

Inverted, it reads the way an iOS sheet does:

```css
.awarddialog {
  background: rgb(246 241 233 / 0.72);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid rgb(255 255 255 / 0.45);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.55),
    0 24px 64px rgb(9 24 39 / 0.28);
}

.awarddialog::backdrop {
  background: rgb(9 24 39 / 0.22);
  backdrop-filter: blur(6px);
}
```

The panel does the heavy blurring; the backdrop only takes the edge off the
photograph so there is still something recognisable behind the glass. Glass over
an already-flattened background does not read as glass.

Two guards, both required:

- `@supports not (backdrop-filter: blur(1px))` falls back to a solid panel.
- `@media (prefers-reduced-transparency: reduce)` does the same.

And one check to run on the built page rather than assume: the summary text is
`--ink-70` on a 72% panel, and the darkest thing that can sit behind the dialog
is Samantha's jacket. If that combination drops under AA the panel goes to 82%,
not the text darker.

---

## 4. Nav order

```
now       Corporate   UMRAH   How it works   Clients   About KIYO   Visit us
V14       UMRAH   Corporate   How it works   Clients   About KIYO   Visit us
```

The chapters themselves are already in that order on the page, so the header
has been disagreeing with the page since V12. One array in `KiyoExperience.tsx`,
used by both the desktop nav and the mobile sheet.

---

## 5. The nav marks the chapter you are in

The active item takes `--coral`, the same treatment the step rail already uses
for the active step, so the page has one idea of "you are here" rather than two.

An `IntersectionObserver` over the chapter anchors, with the header height
subtracted from the top and the lower half of the viewport ignored, so the
active chapter is the one at reading height rather than the one merely touching
the screen. The topmost intersecting chapter wins.

The mapping matters more than the mechanism. Three chapters share one nav item:

| Chapter | Marks |
| --- | --- |
| `#home`, `#warehouse` | nothing |
| `#umrah` | UMRAH |
| `#corporate` | Corporate |
| `#build`, `#customise`, `#delivery` | How it works |
| `#clients` | Clients |
| `#about` | About KIYO |
| `#visit`, `#contact` | Visit us |

Without that grouping the highlight goes blank for the whole three-step flow,
which is the longest stretch of the page.

The active item also gets `aria-current="true"`, so the state is announced and
not only coloured. The mobile sheet uses the same state.

---

## 6. The logo marquee

```css
/* deleted */
.logomarquee:hover .logomarquee__track { animation-play-state: paused; }
```

Two related changes go with it. The per-mark hover brighten goes too: it exists
so the mark being looked at comes up to full strength, and on a row that never
stops there is nothing to look at long enough for it to matter. The base opacity
comes up instead, so all twelve read properly at rest.

The one pause that has to be added is `prefers-reduced-motion: reduce`, which
currently does not stop the marquee at all. An infinite loop that cannot be
stopped is the exact case that setting exists for.

---

## 7. What the WhatsApp buttons should say

Every button on the page except the quotation opens the same message:

> Hi KIYO, I'm interested in your products or services.

That sentence tells the person answering nothing. They have to ask what the
customer was looking at, the customer has to explain, and the thread starts two
messages behind where the website already knew the answer.

### 7a. Give each entry point the context it was pressed in

The whole value of a `wa.me` deep link is that the first message can carry what
the page already knows.

| Where | Message |
| --- | --- |
| Header and float | `Hi KIYO. I have a question about your luggage and gift sets.` |
| UMRAH chapter | `Hi KIYO. I'm planning an UMRAH programme and would like to see the agency sets.` |
| Corporate chapter | `Hi KIYO. I'm looking at corporate gift sets for my company.` |
| A gift set inspector | `Hi KIYO. I'd like a quote for the {set name}.` |
| Visit us | `Hi KIYO. I'd like to arrange a visit to the Kajang showroom.` |
| Clients, partner stories | Not a WhatsApp link at all. See item 1. |

Each ends with one line naming where it came from, which is what lets KIYO see
what the website is actually converting without any analytics:

> Sent from the KIYO website, UMRAH sets.

### 7b. Reorder the quotation so the quotable facts come first

WhatsApp truncates a long first message behind a "Read more", and the current
order puts the two things a salesperson needs to quote at positions five and
six. Product, quantity and date move to the top; company and branding follow;
notes stay last.

### 7c. Say "press send"

The link opens WhatsApp with the message **typed but not sent**. A visitor who
does not notice closes the tab believing they have enquired. One line under the
button fixes it:

> This opens WhatsApp with your brief already written. Press send to deliver it.

### 7d. The desktop escape hatch, which is the important one

On a desktop without WhatsApp installed the link lands on the
"Open app / Continue to WhatsApp Web" interstitial, and a visitor who has
neither is stuck holding a brief they cannot send.

Add a second, quieter route beside the WhatsApp button on the enquiry card:

> **Email it instead** — a `mailto:` to `kiyoliving88@gmail.com` carrying the
> same brief as the body and `KIYO enquiry, {company}` as the subject.

This is the only item in this list that recovers enquiries that are currently
lost outright. It is also about twenty lines of code, since `composeEnquiry`
already produces the body.

A third option worth considering, cheaper than it sounds: a **"Copy my brief"**
button that puts the text on the clipboard. It costs nothing and covers the
visitor who wants to send it from their own phone later.

---

## 8. What KIYO has to supply

Items 1 and 7 are partly blocked. Everything else can be built as soon as this
document is approved.

1. **Five short clips for the film strip**, with poster frames. MP4, muted,
   3 to 15 seconds each for the hover loop, or the full clip if the lightbox is
   built. Without these the chapter falls back to Plan B.
2. **Permission to name two testimonials**, and ideally a third. A name, a role
   and an organisation. This is the single largest trust lever on the page and
   it costs one email.
3. **A caption per clip**, one line, saying what it shows.
4. **Confirmation of the WhatsApp copy** in item 7a, since it is the first thing
   customers will read from KIYO.

---

## 9. As built

Everything in this document shipped, with the differences below. Three more
things were added while it was being built.

### 9a. The film strip became a capability strip

The plan assumed five cut clips. What arrived was four links to video that
already exists, on three platforms, none of which offers a usable embed or a
poster we may hotlink. So the row is built from KIYO's own photography with the
destination printed on every card, and it takes a `clip` field that turns any
card into a hover-playing video the day an MP4 exists. Nothing else changes
when that happens.

Two links were checked against their own listings rather than assigned by
guesswork, because a caption on the wrong footage is a claim about footage:

| Card | Poster | Opens | Why that link |
| --- | --- | --- | --- |
| Smooth 360 degree movement | `product-wheels` | Lazada video 8000006140731 | The listing title states "360 Spinner Wheels" |
| Practical storage | `umrah-essentials` | `#umrah` | No supplied video shows an interior |
| Thoughtful details | `product-lock` | Lazada video 8000005574263 | The listing title states "USB & Cup Holder" |
| Custom-branded | `brandDetail1` | `#customise` | This is B2B; none of the consumer videos covers it |
| Stocked, checked, fulfilled | `warehouse-2` | `#delivery` | Same |

The Facebook video is a general brand film that fits none of the five captions,
so it sits in the closing line with TikTok rather than being forced onto a card
it does not illustrate.

**One thing to decide.** The site's retail routes are Shopee and TikTok only,
and there was a test asserting the word "Lazada" appears nowhere on the page.
A Lazada `videodetail` URL is a product listing, so linking two of them is
effectively a third buying route. The test is now scoped rather than deleted:
Lazada may appear only as a `videodetail` link on a proof card, never in the
retail flyout, the closing band or the footer. If the Shopee-and-TikTok-only
rule was a business decision rather than an accident, say so and the two cards
fall back to `#build` in a minute.

### 9b. The third voice is a real one

`@lily_ssi` on Lemon8 wrote a public review of KIYO luggage. It is quoted in her
own words, in Malay, with an English gloss under it, credited by handle and
linked back to the original post. That link is the whole basis on which quoting
it is fair, so the two must never be separated. A test asserts they are not.

This does not replace item 2 on the asks list. Two of the three voices are still
"Corporate client" and "UMRAH agency partner", and a role is still not a
reference.

### 9c. The trophy fix worked, with one correction

The cut-out overlay is in, `tools/build-award-wall.mjs` measures the fourteen
positions by matching each cut-out against the band, and every one scored
between 7.7 and 11.1 on a scale where anything over 20 is rejected. The floor is
around 10 rather than 0 because the band and the cut-outs were WebP-encoded
separately; re-run the tool after any re-encode of either.

The correction is the transform. The plan said `scale(1.12)` plus a 4% rise.
Scaling about the base maps every point of a trophy radially outward from that
origin, so the enlarged silhouette contains the original and nothing of it can
show. Adding a rise breaks that, and it broke it visibly on the star trophy:
its arms are thin and spiky, and a 4% rise slid the enlarged arms off the
original ones and left the original's tips showing behind them. **The lift is
scale only.** The growth reads as the lift, and a cast shadow spreading under
the base is what says the trophy came forward rather than merely got bigger.

### 9d. Three things added during the build

**The numbers, counted up.** KIYO supplied real figures, so the chapter opens
with four of them: `4.9` Shopee store rating, `2,000+` sold on one luggage
listing, `5.0` Google rating from 183 reviews, and `14` awards since 2022.

Every one prints its own scope. That is not politeness: "4.9" on its own reads
as a rating across everything KIYO sells, and "2,000+" reads as a company total.
Neither is a claim KIYO has made. The figures are in `PROOF_NUMBERS` with a note
to re-check them each release, because a rating that has moved is worse than no
rating at all.

They count up once as the row arrives. The finished number ships in the markup,
so the row is right before the animation runs and stays right if it never does,
and the count is written straight to the DOM node rather than held in React
state: it changes sixty times a second and a re-render per frame would cost the
whole subtree for a decorative effect. It does not run under
`prefers-reduced-motion`.

**Stars on the two ratings.** Two layers, outlines under filled ones clipped to
the exact score, so 4.9 is drawn as 98% and not as five full stars. They are
coral rather than the usual gold, because the page has one accent and a rating
row is not the place to introduce a second. They restate the number beside them,
so they are hidden from assistive tech and the scale goes to it as words.

**The quotes changed face.** They were set in Cormorant Garamond, italic, at
body size. That is a fine setting for one line of pull quote over a photograph
and a poor one for the thing on this page a visitor reads word for word, which
was the reported complaint. They are now Montserrat, upright, at a longer line
height. The ornamental quote mark stays in the serif, where an ornament belongs.
The founder's line in chapter 9 keeps the serif: it is one short line at display
size, which is the setting that face is for.

**And the warehouse claim takes three colours.** "Designed", "Prepared" and
"Delivered" now take sand, teal and coral, and the "here" all three share is
held at 70% white so the verbs carry the line. All three clear AA against the
scrimmed photograph at that size. It also happens to echo the KIYO mark on the
building behind it, which is teal and coral.

### 9e. Where the WhatsApp copy landed

All of item 7 shipped. `enquiry()` in `SiteFooter.tsx` appends the closing line,
and every entry point has its own message: general, UMRAH, corporate, a named
gift set, and the showroom visit. The quotation now leads with product,
quantity, required date and destination, then the company and branding.

The two additions worth knowing about:

- The card says **"Press send once WhatsApp opens"**, because the link writes
  the message but does not send it, and visitors were closing the tab believing
  they had enquired.
- **"Email it instead"** sits under the WhatsApp button, carrying the same brief
  as a `mailto:` body with `KIYO enquiry, {company}` as the subject. It is the
  only thing in this document that recovers enquiries that were being lost
  outright, on any desktop without WhatsApp installed.

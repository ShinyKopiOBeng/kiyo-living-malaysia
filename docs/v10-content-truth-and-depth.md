# KIYO V10 — content accuracy and depth

Research pass over KIYO's real public presence, a plan to replace the invented
copy with what the company actually is, and the questions I need answered before
writing any of it.

**Nothing is implemented yet.** This is the discussion document.

---

## 1. What I found, and what it contradicts

### The location is Kajang, not Shah Alam

Four independent sources agree:

| Source | Says |
| --- | --- |
| [Waze venue listing](https://www.waze.com/live-map/directions/kiyo-living-sdn.-bhd.-jalan-sc-1-20-kajang) | KIYO Living Sdn. Bhd., 20 Jalan SC 1, Kajang |
| [CariCari business listing](https://listings.caricari.my/listing/kiyo-living-sdnbhd-d89f6cc80646a524fdcd61f7c0a6af88) | "20, JALAN SC 1, PUSAT PERINDUSTRIAN SUNGAI CHUA 43000 Kajang, Selangor" |
| [Linktree](https://linktr.ee/kiyoliving88) | "20 Jalan SC 1, Kajang, Malaysia" |
| [Facebook page](https://www.facebook.com/kiyoliving/) | titled "KIYO Living \| Kajang" |

**Full address:** 20, Jalan SC 1, Pusat Perindustrian Sungai Chua, 43000 Kajang,
Selangor, Malaysia. Listed hours 9:00 AM to 6:00 PM.

The word "Shah Alam" appears in **13 places** in the codebase, including the
`Organization` structured data Google reads, and all three legal pages:

```
app/layout.tsx          addressLocality + meta description
app/KiyoExperience.tsx  location eyebrow, address card, contact card, story text
app/components/SiteFooter.tsx
app/components/imageSlots.ts   two image alt texts
app/terms/page.tsx      x2      app/privacy/page.tsx      app/shipping-returns/page.tsx
```

Note the Canva mockup **also** says Shah Alam, so this was inherited from the
design, not invented here. It is wrong in both places.

### Company registration

[CreditScan](https://www.creditscan.com.my/Malaysia-Company/KIYO-LIVING-SDN-BHD/1471904-T)
and [CTOS](https://businessreport.ctoscredit.com.my/oneoffreport_api/single-report/malaysia-company/1471904T/KIYO-LIVING-SDN-BHD-):
KIYO LIVING SDN BHD, registration **202201026207 (1471904-T)**, incorporated
**19 July 2022**, status active, activity includes retail sale over the internet.

Worth adding to the footer. Malaysian companies normally show the SSM number,
and it is a genuine trust signal for wholesale buyers.

### Contact details disagree

| Channel | Value | Source |
| --- | --- | --- |
| WhatsApp | +60 13-276 7887 | Linktree, already on the site, correct |
| Phone (mockup) | +60 3-6123 4567 | **Placeholder.** `6123 4567` is a dummy pattern |
| Email (mockup) | hello@kiyo.com.my | Canva mockup |
| Email (public) | kiyoliving88@gmail.com | public business listings |

### Lazada is an official channel, but the site excludes it

The Linktree lists a [Lazada store](https://www.lazada.com.my/shop/kiyoliving/)
alongside Shopee and TikTok. The README currently records a deliberate rule:
"Retail actions offer Shopee and TikTok only. No Lazada route is included."
Also live: a [YouTube channel](https://www.youtube.com/@kiyoliving), which the
footer does link.

### UMRAH does not appear anywhere in KIYO's public presence

Not on kiyo.com.my (whose nav is Home, About Us, Products, Corporate Gifts,
Wholesale & Partnership, Live Commerce, Contact), not in the Linktree bio, not
in the business listings. The site devotes a full chapter to it.

### The Malay-language positioning

Linktree bio: *"Pemborong luggage Top di Malaysia — HARGA PASTI ANDA MAMPU
MEMILIKI"* (top luggage wholesaler in Malaysia, at prices you can afford), and
"premium manufacturer, designer, and wholesaler... personalised logo luggage for
businesses, travel agencies, and corporations." Wholesale-first, which the
current portfolio underplays relative to retail.

---

## 2. The one thing I want to argue with you about

Your screenshot of the live-commerce page lists six "Trusted by brands &
organisations":

> Wanderlust Travel Agency · Corp Solutions Malaysia · Nexus University ·
> Urban Haul E-Commerce · Global Escapes Travel · Prime Events Malaysia

I can find no Malaysian company matching any of these names. They read as
**placeholder names a designer invented to fill a logo wall.**

Publishing them on a live site states, in KIYO's voice, that these are real
clients. That is a false-advertising exposure, and the kind of thing a wholesale
prospect checks. **I will not write invented client names onto a real company's
site.**

What I would do instead, which loses nothing:

> **TRUSTED BY** — Travel agencies · Corporates · Universities ·
> SMEs & retailers · Tour operators · Event organisers

Same reach, same six icons, entirely true, and it reads as deliberate rather
than as a thin logo wall. Swap in real names the moment you have permission
to use them.

The same question applies to three numbers on that page:

| Claim | Verifiable? |
| --- | --- |
| TOP 3 TikTok Luggage Live Selling Brand | Plausible, and already on the site |
| TSP OFFICIAL — TikTok Shop Partner | Verifiable status, safe if true |
| **MILLION-RINGGIT** Live Campaign Performance | Needs a real figure behind it |
| **100+** Live Hosts Trained | Needs a real figure behind it |

I am happy to publish all four if they are real. I need you to confirm the last
two rather than inherit them from a mockup.

---

## 3. Section-by-section plan

### 3.1 Home hero — fill the empty three-column box

The box is thin because each column is a label plus two short lines. The
live-commerce page has far stronger material. Proposal: **four proof tiles**
using the real achievements.

| Tile | Sub-line | Icon |
| --- | --- | --- |
| TOP 3 | TikTok Luggage Live Selling Brand | `Trophy` |
| MILLION-RINGGIT | Live Campaign Performance | `Gem` |
| 100+ | Live Hosts Trained | `Users` |
| TSP OFFICIAL | TikTok Shop Partner | `BadgeCheck` |

Four fills the bar properly at desktop and still works as 2x2 on mobile. If you
would rather keep three, I would drop MILLION-RINGGIT as the least verifiable.

I would also add a thin trust strip under the hero copy, since the hero
currently asserts nothing concrete:

> Est. 2022 · Kajang, Selangor · Shopee · TikTok Shop · Lazada

### 3.2 Products — retitle and widen

"Premium luggage collection" undersells a catalogue that is 6 luggage lines,
3 bags and a vanity case.

| Option | Note |
| --- | --- |
| **Travel & Lifestyle Collection** | My pick. Accurate, covers all three categories, professional |
| Our Premium Collection | Your suggestion. Safe, slightly generic |
| The KIYO Collection | Brand-forward, says least about what it is |
| What We Carry | Too casual for a wholesale audience |

**Under the carousel**, add the three real category cards from your Products
screenshot, which is exactly the "we also have accessories" point:

| Card | Copy (verbatim from the mockup) | Icon |
| --- | --- | --- |
| Cabin & Check-in Luggage | Stylish, lightweight, and engineered for smooth travel anywhere. | `Luggage` |
| Travel Accessories | Smart, functional essentials that keep you organised on the go. | `Tag` |
| Durable Everyday Travel | Built with premium materials for long-lasting performance you can trust. | `ShieldCheck` |

"Retail & wholesale ready" stays, moving beside them.

### 3.3 Location — fill the empty right-hand side

Replace the thin "Visit by appointment / Shah Alam" card with the operations
content from your warehouse screenshot, which is genuinely informative:

- Eyebrow: **OPERATIONS, WAREHOUSE & DISTRIBUTION**
- Heading: **Built for scale across Malaysia**
- Body: "KIYO's end-to-end operations ensure ready stock, efficient fulfilment
  and reliable delivery, so you can scale with confidence. From warehouse to
  doorstep, we power businesses nationwide."
- Four cards with icons:

| Card | Copy | Icon |
| --- | --- | --- |
| Warehouse Inventory | Ready stock with structured warehouse capacity. | `Warehouse` |
| Nationwide Fulfilment | Efficient distribution network across Malaysia. | `Truck` |
| Product Sourcing | Curated products, competitive pricing, trusted quality. | `ShoppingCart` |
| Live-Commerce Support | Built for TikTok Shop and live-commerce operations. | `Video` |

- CTA **Partner with KIYO**, with "Reliable. Scalable. Nationwide."

The real Kajang address and hours then move to the contact chapter and footer,
where a visitor actually looks for them, with a `MapPin` and `Clock`.

### 3.4 About — "Who We Are" and a real founder quote

- Heading gains **Who we are** above the existing display headline.
- Describe KIYO as a **travel and live-commerce brand**, matching its own words,
  rather than "travel lifestyle and live-commerce company".
- Turn the mission line into an actual attributed pull-quote:

> "To empower journeys, elevate brands and create lasting impact through
> innovation and trust."
> — Samantha Ng, Founder

  with a quote mark, a rule, and her name under it, so it reads as her words
  rather than a floating slogan.

I need her exact name and title confirmed (see questions).

### 3.5 Business pillars — use the real names

The mockup's names are stronger than the ones on the site now:

| Now | Mockup |
| --- | --- |
| TikTok Campaigns | **Viral TikTok Campaigns** |
| Nationwide Distribution | **Nationwide Wholesale Distribution** |
| Corporate Gifting | **Premium Corporate Gifting Solutions** |
| Live Commerce | **Live-Commerce Ecosystem** |
| Strategic Partnerships | Strategic Partnerships |

Plus the eyebrow **OUR CORE** and CTA **Explore our solutions**. The five
descriptions on the site already match the mockup word for word.

### 3.6 UMRAH — my suggestion, pending your answer

Since UMRAH appears nowhere in KIYO's public presence, I need to know whether it
is a real line before investing in it (see questions). **If it is real**, the
chapter is currently the thinnest on the page and I would add:

- A four-step "How an agency order works" strip with icons: Consult, Brand,
  Approve, Deliver. (This is close to the Select/Brand/Approve/Deliver row you
  had me remove; it was removed for looking stranded, not for being wrong. It
  belongs here, styled as content rather than a floating rule.)
- Concrete commercial terms, matching the corporate gift sets that already show
  MOQ and lead time.
- A trust line: group sizes handled, agencies served, turnaround.

**If it is not a real line**, the honest move is to fold it into Corporate
Gifting as "group and programme sets" and reclaim the space.

### 3.7 Icons everywhere

`lucide-react` is already a dependency and the icon language is established
(`Trophy`, `Truck`, `Gift`, `MapPin`). Every new item above has an icon
assigned. No new dependency.

---

## 4. Copy rules this must respect

- The build test forbids em and en dashes in visible copy
  (`assert.doesNotMatch(html, /[–—]/)`). The mockup copy contains them, e.g.
  "reliable delivery — so you can scale". These become commas or hyphens.
- The eyebrow count is asserted at exactly 2. New eyebrows mean updating that
  assertion deliberately, not by accident.
- British spelling throughout, matching existing copy: fulfilment, organised,
  customised, specialising.

---

## 5. What I will not do without your answer

1. Publish the six invented client names.
2. Publish MILLION-RINGGIT or 100+ hosts unless you confirm them.
3. Invest in the UMRAH chapter before knowing whether the service is real.
4. Change the retail channel policy to include Lazada.

---

## 6. Decisions (answered)

| Question | Decision |
| --- | --- |
| Invented client names | **Drop the trusted-by section entirely.** Standing rule from the owner: *"don't include any unreal/false/dummy template information."* |
| Unverified stats | **Only TOP 3 and TSP Official.** MILLION-RINGGIT and 100+ hosts are not published. |
| UMRAH | **Real. Build it out.** |
| Address | **NO:16**, Jalan SC 1, Pusat Perindustrian Sungai Chua, 43000 Kajang, Selangor. Owner-corrected; public listings say 20, the owner says 16, so 16 it is. |
| Email | **kiyoliving88@gmail.com.** `hello@kiyo.com.my` was a mockup address and is replaced site-wide. |
| SSM number | **Add to footer:** 202201026207 (1471904-T), incorporated 19 July 2022. |
| Lazada | **Not added.** Shopee and TikTok remain the only retail routes. |
| Products title | **"Travel & Lifestyle Collection"** (delegated: "or any suitable for more professional"). |

### Hero proof bar, with only verifiable claims

Four tiles, every one true and checkable:

| Tile | Sub-line | Icon |
| --- | --- | --- |
| TOP 3 | TikTok Luggage Live Selling Brand | `Trophy` |
| TSP OFFICIAL | TikTok Shop Partner | `BadgeCheck` |
| EST. 2022 | SSM 202201026207 | `ShieldCheck` |
| NATIONWIDE | Wholesale Distribution | `Truck` |

### Still outstanding, flagged not actioned

The README records that the **facility photographs are AI-generated review
assets**, and the same imagery appears in the Canva mockup. Five of them are
presented as KIYO's warehouse in the Location chapter. Under the "no unreal
information" rule this is the next thing to resolve, but removing them would
empty the section, so it needs real photographs rather than a deletion.

The corporate gift sets publish **MOQ 100 sets** and **lead time 6-8 weeks**.
Same question: are those real commercial terms?

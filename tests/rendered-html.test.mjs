import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

let cached;
async function html() {
  if (!cached) {
    const response = await render();
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
    cached = await response.text();
  }
  return cached;
}

/** The markup between one chapter anchor and the next. */
async function chapter(id, nextId) {
  const page = await html();
  const from = page.indexOf(`id="${id}"`);
  const to = nextId ? page.indexOf(`id="${nextId}"`) : page.length;
  assert.notEqual(from, -1, `the page is missing the "${id}" chapter`);
  assert.ok(to > from, `"${nextId}" does not follow "${id}"`);
  return page.slice(from, to);
}

const count = (haystack, needle) => (haystack.match(new RegExp(needle, "g")) ?? []).length;

test("renders the chapters in the order V15 sets out", async () => {
  const page = await html();

  const order = ["home", "warehouse", "umrah", "corporate", "choose", "personalise", "deliver", "quote", "clients", "about", "contact"];
  const positions = order.map((id) => {
    const at = page.indexOf(`id="${id}"`);
    assert.notEqual(at, -1, `the page is missing the "${id}" chapter`);
    return at;
  });
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b), "chapters are out of order");
  assert.ok(page.indexOf('class="site-footer"') > page.lastIndexOf('id="contact"'), "the footer must close the page");

  /* The retired chapters stay retired. */
  for (const gone of ['id="build"', 'id="customise"', 'id="delivery"', 'id="visit"']) {
    assert.ok(!page.includes(gone), `${gone} was retired in V15 and must not come back`);
  }
});

test("the header carries the brand lockup, five nav items, retail and the quote button", async () => {
  const page = await html();

  assert.match(page, /<title>KIYO Living \| Luggage, Corporate Gifts &amp; UMRAH Travel Sets<\/title>/i);
  /* The logo is the vector lockup from the brand guide, in both places it appears. */
  assert.match(page, /class="brand" href="#home"[^>]*><img src="\/images\/kiyo-logo\.svg"/);
  assert.ok(!page.includes("kiyo-logo.png"), "the raster logo was replaced by the vector");
  for (const [label, href] of [["UMRAH", "#umrah"], ["Corporate", "#corporate"], ["How it works", "#choose"], ["Clients", "#clients"], ["About", "#about"]]) {
    assert.match(page, new RegExp(`href="${href}"[^>]*>${label}<`), `the header nav is missing ${label}`);
  }
  assert.ok(!page.includes(">Visit us<"), "Visit us left the nav with its chapter");
  /* Retail is a slider with both stores behind it, not a bare link to one. */
  assert.match(page, /class="retail-trigger"/);
  assert.match(page, /aria-controls="retail-flyout"/);
  assert.match(page, /id="retail-flyout"/);
  assert.match(page, /class="retail-scrim/);
  /* One primary button, one intent, everywhere it appears. */
  assert.match(page, /class="button button--coral header-cta" href="#quote"/);
  assert.ok(!page.includes("Build your set"), "the old header call to action is gone");
});

test("the hero: two-line tagline, one sentence, two routes", async () => {
  const hero = await chapter("home", "warehouse");

  assert.match(hero, /<h1><span>Designed for<\/span><span class="hero__payoff">your journey\.<\/span><\/h1>/);
  assert.match(hero, /Premium luggage, corporate gift sets and UMRAH programmes, customised and delivered from Kajang\./);
  assert.match(hero, /class="button button--coral" href="#quote"/);
  assert.match(hero, /class="button button--ghost" href="#umrah"/);
  assert.match(hero, /data-image-slot="HOME-HERO"/);
  /* The hero stack is the headline, one sentence and the buttons: no eyebrow. */
  assert.ok(!hero.includes('class="eyebrow"'), "the hero must not carry an eyebrow");
});

test("the warehouse band states the three-line claim and the four capabilities", async () => {
  const band = await chapter("warehouse", "umrah");

  assert.match(band, /class="scale__headline"/);
  for (const verb of ["Designed", "Prepared", "Delivered"]) {
    assert.match(band, new RegExp(`<em>${verb}</em>`), `the warehouse claim is missing ${verb}`);
  }
  assert.match(band, /<em>Delivered<\/em> from here\./);
  assert.match(band, /Kajang, Selangor/);
  assert.match(band, /data-image-slot="WAREHOUSE-BAND"/);
  for (const capability of ["Warehouse", "Customisation", "QC", "Fulfilment"]) {
    assert.ok(band.includes(capability), `the capability row is missing ${capability}`);
  }

  /* The proof strip follows the band: four figures, each with its scope. */
  assert.match(band, /class="proofnumbers"/);
  for (const [value, label] of [["4.9", "Shopee store rating"], ["2,000+", "sold on one luggage listing"], ["5.0", "Google rating, from 183 reviews"], ["14", "awards since 2022"]]) {
    assert.match(band, new RegExp(`data-suffix="[^"]*">${value.replace("+", "\\+")}<`), `the proof strip is missing ${value}`);
    assert.ok(band.includes(label), `the proof strip is missing the scope "${label}"`);
  }
  assert.equal(count(band, 'class="stars"'), 2, "only the two ratings get stars");
});

test("UMRAH and corporate are the same chapter shell, twice, with six sets each", async () => {
  const umrah = await chapter("umrah", "corporate");
  const corporate = await chapter("corporate", "choose");

  for (const [name, section, opener] of [["UMRAH", umrah, "UMRAH-OPENER"], ["corporate", corporate, "CORPORATE-OPENER"]]) {
    assert.match(section, /class="opener opener--/, `${name} is not using the shared opener`);
    assert.match(section, new RegExp(`data-image-slot="${opener}"`), `${name} is missing its opener plate`);
    assert.match(section, /class="carousel"/, `${name} is missing the carousel`);
    assert.ok(section.indexOf("opener__copy") < section.indexOf('class="carousel"'), `${name} puts the carousel above the opener`);
    /* Six sets, rendered twice for the seamless loop; the clone is hidden from
       assistive tech and its buttons are out of the tab order. */
    assert.equal(count(section, 'class="setcard"'), 12, `${name} should render six sets twice`);
    assert.equal(count(section, 'class="carousel__run" aria-hidden="true"'), 1, `${name}'s second run must be aria-hidden`);
    assert.equal(count(section, 'tabindex="-1"'), 6, `${name}'s cloned cards must leave the tab order`);
    assert.equal(count(section, "View set"), 12);
    assert.match(section, /class="button button--coral" href="#quote"/, `${name}'s button must go to the quotation`);
    /* Nothing in a chapter opens WhatsApp any more; the quotation does. */
    assert.ok(!section.includes("wa.me"), `${name} must not link WhatsApp directly`);
  }

  /* UMRAH: full-bleed, copy left. Corporate: split, copy right. */
  assert.match(umrah, /class="opener opener--bleed opener--left"/);
  assert.match(corporate, /class="opener opener--split opener--right"/);

  assert.match(umrah, /<span>Your Jemaah\.<\/span><span>Your Brand\.<\/span><span class="opener__payoff">One Complete Journey\.<\/span>/);
  assert.match(umrah, /Thoughtfully coordinated luggage and travel essentials, customised for your agency and prepared for every jemaah\./);
  assert.match(umrah, /Build Your UMRAH Set/);
  for (const label of ["Navy Heritage Set", "Emerald Telekung Set", "Desert Terracotta Set", "Dusty Rose Comfort Set", "Charcoal Executive Set", "Sapphire Ihram Set"]) {
    assert.equal(count(umrah, `class="setcard__label">${label}<`), 2, `the UMRAH carousel is missing ${label}`);
  }

  assert.match(corporate, /<span>Your People\.<\/span><span>Your Brand\.<\/span><span class="opener__payoff">A Lasting Impression\.<\/span>/);
  assert.match(corporate, /Thoughtfully curated gifts, customised for clients, employees, partners and every occasion\./);
  assert.match(corporate, /Build Your Corporate Gift Set/);
  for (const label of ["Travel Comfort Set", "Outdoor Retreat Set", "Executive Desk Set", "Tech Productivity Set", "Apparel Welcome Set", "Coffee Wellness Set"]) {
    assert.equal(count(corporate, `class="setcard__label">${label}<`), 2, `the corporate carousel is missing ${label}`);
  }
  /* The sixth corporate plate is awaited, so its card is the branded tile. */
  assert.equal(count(corporate, 'class="setcard__pending"'), 2);
  assert.equal(count(corporate, "Photo coming soon"), 2);
});

test("step 01 is the luggage rail with colour picks and one Shop more", async () => {
  const choose = await chapter("choose", "personalise");

  assert.match(choose, /class="eyebrow"><span class="eyebrow__step">Step 01<\/span>Choose</);
  assert.match(choose, /<span>Your Idea\.<\/span><span>Your Budget\.<\/span><span class="opener__payoff">Our Recommendation\.<\/span>/);
  assert.match(choose, /Choose from our collections, share your idea or simply tell us your budget\. We&#x27;ll curate the right gift set for you\./);
  assert.match(choose, /data-image-slot="CHOOSE-OPENER"/);

  assert.match(choose, /class="chooser__rail"/);
  assert.match(choose, /aria-label="Previous products"/);
  assert.match(choose, /aria-label="Next products"/);
  /* Cases and sets only. */
  assert.equal(count(choose, 'class="product-card"'), 6);
  for (const bag of ["Business Backpack", "Flap Commuter Backpack", "Slim Laptop Brief", "Weekender Duffel"]) {
    assert.ok(!choose.includes(bag), `the rail must not offer the ${bag}`);
  }
  assert.ok(count(choose, 'class="product-swatch') >= 18, "every card keeps its colour swatches");
  /* Nothing is selected any more, and retail is one button for the rail. */
  for (const gone of ["Select for bulk", "Buy retail", "product-card__badge", "product-card__select", "product-card__actions", "Pick a model", "steprail"]) {
    assert.ok(!choose.includes(gone), `step 01 still carries ${gone}`);
  }
  assert.equal(count(choose, "Shop more"), 1);
  assert.match(choose, /class="button button--ghost railhead__shop" aria-haspopup="dialog" aria-controls="retail-flyout"/);
});

test("step 02 is the customisation portfolio, not a form", async () => {
  const personalise = await chapter("personalise", "deliver");

  assert.match(personalise, /class="opener opener--bleed opener--right"/);
  assert.match(personalise, /<span class="eyebrow__step">Step 02<\/span>Personalise</);
  assert.match(personalise, /<span>Your Brand\.<\/span><span>Your Gift\.<\/span><span class="opener__payoff">Your Way\.<\/span>/);
  assert.match(personalise, /Share your logo\. We&#x27;ll create a FREE custom design for your approval\./);
  assert.match(personalise, /data-image-slot="PERSONALISE-OPENER"/);

  /* Five cells, every one a photograph with a caption under it. */
  assert.equal(count(personalise, 'class="bento__cell"'), 5);
  assert.equal(count(personalise, "<figcaption>"), 5);
  for (const caption of ["Logo printing", "Luggage tag", "Shell colours", "Branded accessories", "Approval mockup"]) {
    assert.match(personalise, new RegExp(`<figcaption>${caption}</figcaption>`), `the bento is missing ${caption}`);
  }
  for (const line of ["Share your logo", "We send a free design mockup", "Approve it, then we print"]) {
    assert.ok(personalise.includes(line), `the personalise steps are missing "${line}"`);
  }
  /* No fields here: the quotation is the one form. */
  assert.ok(!/<input|<select|<textarea/.test(personalise), "step 02 must not carry form fields");
});

test("step 03 is the three-promise accordion", async () => {
  const deliver = await chapter("deliver", "quote");

  assert.match(deliver, /<span class="eyebrow__step">Step 03<\/span>Deliver</);
  assert.match(deliver, /<span>Deliver to You\.<\/span><span>Store Here\.<\/span><span class="opener__payoff">Pick Up Anytime\.<\/span>/);
  assert.match(deliver, /Delivered to your doorstep, stored securely at our warehouse, or picked up whenever you&#x27;re ready\./);
  assert.match(deliver, /data-image-slot="DELIVER-OPENER"/);

  assert.equal(count(deliver, 'class="accordion__panel'), 3);
  assert.equal(count(deliver, 'class="accordion__panel is-open"'), 1, "one panel opens at rest");
  assert.equal(count(deliver, 'aria-expanded="true"'), 1);
  for (const [title, slot] of [["Deliver to You", "DELIVER-SHIP"], ["Store Here", "DELIVER-STORE"], ["Pick Up Anytime", "DELIVER-COLLECT"]]) {
    assert.match(deliver, new RegExp(`<strong>${title}</strong>`), `the accordion is missing ${title}`);
    assert.match(deliver, new RegExp(`data-image-slot="${slot}"`), `the accordion is missing ${slot}`);
  }
  /* The six-stage pipeline and the enquiry card went with the form. */
  for (const gone of ["pipeline__step", 'class="enquiry"', "Email it instead"]) {
    assert.ok(!deliver.includes(gone), `step 03 still carries ${gone}`);
  }
});

test("the quotation is one form beside the map and the contact details", async () => {
  const quote = await chapter("quote", "clients");

  assert.match(quote, /class="eyebrow">Contact us</);
  assert.match(quote, /Let&#x27;s Create Something Thoughtful<span class="quote__stop">\.<\/span>/);
  assert.match(quote, /Tell us what you need\. We&#x27;ll recommend the right set and prepare your quotation\./);
  /* The map and the address moved here from the retired Visit chapter. */
  assert.match(quote, /<iframe title="Map showing KIYO Living in Kajang, Selangor"/);
  assert.match(quote, /View on Google Maps/);
  assert.match(quote, /No\. 16, Jalan SC 1,/);
  assert.match(quote, /43000 Kajang, Selangor\./);
  assert.match(quote, /\+60 13-276 7887/);
  assert.match(quote, /kiyoliving88@gmail\.com/);
  assert.match(quote, /Monday to Saturday/);
  assert.match(quote, /9:00am to 6:00pm/);

  assert.match(quote, /<form class="quoteform"/);
  assert.match(quote, /class="eyebrow">Tell us about your gift</);
  for (const [name, id] of [["name", "quote-name"], ["company", "quote-company"], ["phone", "quote-phone"], ["email", "quote-email"], ["quantity", "quote-quantity"], ["message", "quote-message"]]) {
    assert.match(quote, new RegExp(`id="${id}"[^>]*name="${name}"`), `the form is missing the ${name} field`);
  }
  /* Name, phone and the programme are required; the rest is optional. */
  assert.match(quote, /id="quote-name"[^>]*required/);
  assert.match(quote, /id="quote-phone"[^>]*required/);
  assert.ok(!/id="quote-email"[^>]*required/.test(quote), "email is optional");
  assert.equal(count(quote, 'name="programme"'), 2);
  assert.equal(count(quote, 'name="logo"'), 3);
  for (const choice of ["Corporate Gifts", "UMRAH Sets", "Yes", "No", "Not sure"]) {
    assert.ok(quote.includes(`</span>${choice}</label>`), `the form is missing the ${choice} choice`);
  }
  assert.match(quote, /name="botcheck"/);
  assert.match(quote, /<button class="button button--coral quoteform__send" type="submit">Request a quote/);
  assert.match(quote, /We&#x27;ll only use your details to respond to your enquiry\./);
  /* Labels sit above inputs; nothing uses its placeholder as its label. */
  assert.ok(!quote.includes("Selected set"), "the set chip was dropped with set selection");
});

test("clients: the opener, the logo marquee and three video slots", async () => {
  const clients = await chapter("clients", "about");

  assert.match(clients, /class="opener opener--bleed opener--right"/);
  assert.match(clients, /class="eyebrow">Our clients&#x27; testimonials</);
  assert.match(clients, /<span>Real Clients\.<\/span><span>Real Experiences\.<\/span><span class="opener__payoff">Lasting Trust\.<\/span>/);
  assert.match(clients, /Hear from the businesses and agencies who trusted KIYO with their gifts, programmes and deliveries\./);
  assert.match(clients, /data-image-slot="CLIENTS-OPENER"/);

  /* Twelve marks, run twice for the loop, the second run hidden. */
  assert.match(clients, /class="logomarquee"/);
  assert.equal(count(clients, 'class="logomarquee__run"'), 2);
  assert.equal(count(clients, 'class="logomarquee__run" aria-hidden="true"'), 1);
  assert.equal(count(clients, 'class="image-slot logowall__mark"'), 24);
  for (const name of ["AIA logo", "Koperasi Tenaga Nasional Berhad logo", "Universiti Kuala Lumpur logo"]) {
    assert.ok(clients.includes(`alt="${name}"`), `the marquee is missing ${name}`);
  }
  /* Three videos under the marks, honest placeholders until the clips land. */
  assert.ok(clients.indexOf('class="logomarquee"') < clients.indexOf('class="videos"'));
  assert.equal(count(clients, 'class="videocard"'), 3);
  assert.equal(count(clients, "Video coming soon"), 3);
  assert.match(clients, /See more from KIYO on/);
  assert.match(clients, /tiktok\.com\/@kiyoliving/);
  /* The numbers moved up under the hero; the proof cards and quotes went. */
  for (const gone of ["proofnumbers", "proofcard", 'class="voices"', "lily_ssi", "Lazada"]) {
    assert.ok(!clients.includes(gone), `the clients chapter still carries ${gone}`);
  }
});

test("about: the photograph, the name and nothing laid over the trophies", async () => {
  const about = await chapter("about", "contact");

  assert.match(about, /data-image-slot="ABOUT-BAND"/);
  assert.match(about, /class="eyebrow">Samantha and Awards</);
  assert.match(about, /<h2 id="about-title">Samantha Ng<\/h2>/);
  assert.match(about, /Founder, KIYO Living/);
  assert.match(about, /Built to help organisations move together\./);
  for (const gone of ["awardwall", "awardrow", "awarddialog", "recognition", "Select a trophy", "Rising Star", "TikTok Shop Top Merchant"]) {
    assert.ok(!about.includes(gone), `the about chapter still carries ${gone}`);
  }
});

test("the closing band and footer carry every business route", async () => {
  const page = await html();
  const closer = await chapter("contact");

  assert.match(closer, /Ready to start\?/);
  assert.match(closer, /Tell us your programme\./);
  assert.match(closer, /class="button button--coral" href="#quote"/);
  assert.match(closer, /wa\.me\/60132767887/);

  assert.match(closer, /class="site-footer__grid"/);
  assert.match(closer, /<img src="\/images\/kiyo-logo-white\.svg"/);
  for (const heading of ["B2B Solutions", "Retail", "Visit &amp; Contact"]) {
    assert.match(closer, new RegExp(`<h2>${heading}</h2>`), `the footer is missing the ${heading} column`);
  }
  for (const label of ["Corporate Gifts", "UMRAH Programmes", "How It Works", "Request a Quote", "Luggage Collection", "Shopee Store", "TikTok Shop", "Arrange a Visit"]) {
    assert.ok(closer.includes(label), `the footer is missing the ${label} link`);
  }
  assert.match(closer, /Designed for Your Journey\./);
  assert.match(closer, /kiyoliving88@gmail\.com/);
  assert.match(closer, /Company No\. 202201026207 \(1471904-T\)/);
  assert.match(closer, /shopee\.com\.my\/kiyoliving/);
  for (const [label, href] of [["Terms", "/terms"], ["Privacy", "/privacy"], ["Shipping &amp; Returns", "/shipping-returns"]]) {
    assert.match(closer, new RegExp(`href="${href}"[^>]*>${label}<`));
  }

  /* Retail actions offer Shopee and TikTok only: no Lazada anywhere now that
     the proof cards are gone. */
  assert.doesNotMatch(page, /lazada/i);
  /* The WhatsApp float is a draggable dock, not a bare fixed anchor. */
  assert.match(page, /class="whatsapp-dock"/);
  /* Typography house rule: hyphens only, no em or en dashes in visible copy. */
  assert.doesNotMatch(page, /[–—]/);
  assert.doesNotMatch(page, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("keeps the architecture production-ready", async () => {
  const [page, layout, packageJson, experience, quote, gifts, carousel, slots, placeholder, css, fonts] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/KiyoExperience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/QuoteSection.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/KiyoInteractiveSections.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/SetCarousel.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/imageSlots.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ImagePlaceholder.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/fonts.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /KiyoExperience/);
  assert.match(layout, /KIYO Living/);
  assert.match(layout, /application\/ld\+json/);
  assert.match(slots, /status: ImageSlotStatus/);
  assert.match(slots, /mobileSrc\?: string/);
  assert.match(placeholder, /process\.env\.NODE_ENV !== "production"/);

  /* UMRAH and corporate must keep sharing one shell, or the two layouts drift
     apart. Both carousels come from one component, and the inspector stays. */
  assert.match(gifts, /function GiftChapter/);
  assert.equal((gifts.match(/<GiftChapter/g) ?? []).length, 2);
  assert.match(gifts, /<SetCarousel/);
  assert.match(gifts, /<dialog/);
  assert.match(carousel, /aria-haspopup="dialog"/);

  /* The carousel drifts on a native scroll container and stops for a pointer,
     for focus, for a finger, off screen and under reduced motion. */
  assert.match(carousel, /requestAnimationFrame\(tick\)/);
  assert.match(carousel, /prefers-reduced-motion: reduce/);
  assert.match(carousel, /new IntersectionObserver\(/);
  assert.match(carousel, /!hovered && !focused && !held && !resting/);
  assert.doesNotMatch(carousel, /window\.addEventListener\("scroll"/);

  /* The reveal has to hand the element back to the stylesheet when it lands. */
  assert.match(experience, /clearProps: "opacity,visibility,transform"/);

  /* The quotation sends two ways from one press: WhatsApp from the gesture
     itself, then email through the relay. Nothing is read off the visitor's
     disk. */
  assert.match(quote, /window\.open\(link, "_blank", "noopener,noreferrer"\)/);
  assert.match(quote, /api\.web3forms\.com\/submit/);
  assert.match(quote, /NEXT_PUBLIC_WEB3FORMS_KEY/);
  assert.match(quote, /botcheck/);
  assert.doesNotMatch(quote, /createObjectURL|FileReader|type="file"/);
  assert.ok(quote.indexOf("window.open(") < quote.indexOf("await fetch("), "WhatsApp opens before the fetch, or the popup is blocked");

  /* Every WhatsApp button says where it was pressed, so whoever answers is not
     starting two messages behind. */
  const footer = await readFile(new URL("app/components/SiteFooter.tsx", templateRoot), "utf8");
  assert.match(footer, /Sent from the KIYO website, \$\{source\}/);
  for (const message of ["GENERAL_MESSAGE", "UMRAH_MESSAGE", "CORPORATE_MESSAGE", "VISIT_MESSAGE"]) {
    assert.match(footer, new RegExp(`export const ${message}`), `SiteFooter is missing ${message}`);
  }

  /* The display and body faces are the brand guide's, self-hosted. */
  assert.doesNotMatch(layout, /next\/font/);
  assert.match(css, /@import "\.\/fonts\.css"/);
  assert.match(css, /--font-heading: "Work Sans"/);
  assert.match(css, /--font-body: "Montserrat"/);
  assert.match(fonts, /font-family: "Work Sans"/);
  assert.match(fonts, /font-family: "Montserrat"/);
  assert.doesNotMatch(fonts, /Cormorant/);
  assert.match(fonts, /url\("\/fonts\//);
  await access(new URL("../public/fonts", import.meta.url));

  /* The palette is the brand guide's, hex for hex. */
  for (const [token, hex] of [["--color-ink", "#002f3d"], ["--color-teal", "#72b7bd"], ["--color-coral", "#e66047"], ["--color-teal-light", "#83c1c8"], ["--color-salmon", "#f58c86"], ["--color-paper", "#f4efea"]]) {
    assert.match(css, new RegExp(`${token}: ${hex};`), `${token} is not the brand guide's ${hex}`);
  }
  /* Teal is never small text. The one place it colours type is the display-size
     verb on the dark warehouse band, where it measures 6.3:1. */
  assert.equal((css.match(/(?<!border-)color: var\(--teal\);/g) ?? []).length, 1);
  assert.match(css, /\.scale__headline span:nth-child\(2\) em \{\s*color: var\(--teal\);/);

  /* ScrollTrigger still drives the header, which is scroll-position based and
     self-correcting; the reveals are an IntersectionObserver. */
  assert.match(experience, /ScrollTrigger\.create/);
  assert.match(experience, /data-reveal-group/);
  assert.doesNotMatch(experience, /ScrollTrigger\.batch/);
  assert.match(experience, /new IntersectionObserver\(/);
  assert.match(experience, /observer\.unobserve\(entry\.target\)/);
  assert.doesNotMatch(experience, /pin:\s*true/);
  assert.doesNotMatch(experience, /window\.addEventListener\("scroll"/);

  /* The WhatsApp float is a round, draggable dock. */
  assert.match(experience, /setPointerCapture/);
  assert.match(experience, /DOCK_TAP_TOLERANCE/);
  assert.match(css, /\.whatsapp-float \{[^}]*border-radius: 50%/);
  assert.match(css, /\.whatsapp-dock \{[^}]*touch-action: none/);
  /* The header is transparent over the hero and solid once past it. */
  assert.match(css, /\.site-header--hero \{[^}]*background: transparent/);

  /* One radius scale, and anchored sections clear the fixed header. */
  for (const token of ["--radius-card", "--radius-tile", "--radius-button", "--radius-pill"]) {
    assert.match(css, new RegExp(`${token}:`), `radius scale is missing ${token}`);
  }
  assert.match(css, /scroll-margin-top/);

  /* Markup the redesign removed leaves no orphaned rules behind. */
  for (const dead of ["\\.shop-flyout", "\\.business-pillar", "\\.product-collection", "\\.location-card", "\\.about__copy", "\\.corporate-accordion", "\\.umrah__process", "\\.branddetails", "\\.brandpanel", "\\.deliveryform", "\\.brandform", "\\.ghost-button", "\\.founder__wash", "\\.founder__cutout", "\\.awardwall", "\\.awarddialog", "\\.awardrow", "\\.recognition", "\\.steprail", "\\.flow__", "\\.brandstudio", "\\.brandcase", "\\.optioncard", "\\.orderfields", "\\.enquiry", "\\.pipeline", "\\.proofstrip", "\\.proofcard", "\\.voices", "\\.voice", "\\.visit", "\\.reachmap", "\\.reachrow", "\\.setstrip", "\\.gift__lead", "\\.gift__copy", "\\.gift__visual", "\\.product-card__select", "\\.product-card__retail", "\\.product-card__badge"]) {
    assert.doesNotMatch(css, new RegExp(dead), `globals.css still carries rules for ${dead}`);
  }

  // In-page anchors must be handled by the page, never by the router. Letting
  // the router see them makes it fetch an RSC payload that a static host cannot
  // serve; its 404 error path assigns window.location.href, which fires
  // popstate, which navigates again, and every iteration calls scrollIntoView
  // on the fragment target. Measured on the deployed site: one nav click gave
  // 195 popstate events and 193 scrollIntoView calls, pinning the page.
  assert.match(experience, /document\.addEventListener\("click", onDocumentClick, \{ capture: true \}\)/);
  assert.match(experience, /href\.startsWith\("#"\)/);
  assert.match(experience, /event\.preventDefault\(\)/);
  const scroll = await readFile(new URL("app/components/scroll.ts", templateRoot), "utf8");
  assert.match(scroll, /window\.history\.replaceState/);

  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview", templateRoot)));
  /* The retired modules are gone, not merely unused. */
  for (const gone of ["app/components/BuildYourSet.tsx", "app/components/awardWall.ts", "tools/build-award-wall.mjs"]) {
    await assert.rejects(access(new URL(gone, templateRoot)), `${gone} was retired in V15`);
  }
});

test("product catalogue matches the shipped assets", async () => {
  const source = await readFile(new URL("../app/components/productCatalogue.ts", import.meta.url), "utf8");
  // Anchor on the assignment: the first "[" in the file belongs to a type.
  const marker = "export const carouselProducts: CarouselProduct[] = ";
  const start = source.indexOf(marker) + marker.length;
  const products = JSON.parse(source.slice(start, source.indexOf("];", start) + 1));

  assert.equal(products.length, 10);

  // Silver, then black, then white, then the rest.
  const RANK = ["silver", "black", "white", "grey", "beige", "blue", "cyan", "green", "darkgreen", "purple", "pink", "orange"];
  for (const product of products) {
    assert.ok(product.colours.length >= 2, `${product.slug} needs at least two colours`);

    const ranks = product.colours.map((colour) => {
      const rank = RANK.indexOf(colour.id);
      assert.notEqual(rank, -1, `${product.slug}: unranked colour ${colour.id}`);
      return rank;
    });
    assert.deepEqual(ranks, [...ranks].sort((a, b) => a - b), `${product.slug}: colours are out of rank order`);

    for (const colour of product.colours) {
      assert.match(colour.swatch, /^#[0-9a-f]{6}$/, `${product.slug}/${colour.id}: swatch is not a hex colour`);
      for (const view of ["front", "angle"]) {
        await access(new URL(`../public/images/kiyo/products/${product.slug}/${colour.id}-${view}.webp`, import.meta.url));
      }
    }
  }

  // Every product opens on the highest-ranked colour it actually has.
  const defaults = Object.fromEntries(products.map((p) => [p.slug, p.colours[0].id]));
  assert.equal(defaults["premium-aluminium-set"], "silver");
  assert.equal(defaults["front-pocket-cabin"], "white");
  assert.equal(defaults["top-access-cabin"], "white");
  assert.equal(defaults["full-spec-aluminium-frame"], "black");
});

test("stylesheet stays flat: no selector re-declares a property it already set", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  // Tailwind theme tokens are what make text-ink / bg-paper / font-display
  // available to new markup; the hand-written rules alias onto them.
  assert.match(css, /@theme \{/);
  for (const token of ["--color-ink", "--color-paper", "--color-coral", "--color-line", "--font-heading"]) {
    assert.match(css, new RegExp(`${token}:`), `theme is missing ${token}`);
  }
  assert.match(css, /--ink: var\(--color-ink\)/);

  // The stylesheet used to be six stacked layers that re-declared the same
  // selectors, where whichever copy sat last silently won. This is the guard
  // against that creeping back: the flattener must find nothing to remove.
  const report = execFileSync("node", ["tools/flatten-css.mjs", "--check"], {
    cwd: new URL("../", import.meta.url),
    encoding: "utf8",
  });
  const dead = /dead declarations dropped\s+(\d+)/.exec(report);
  assert.ok(dead, `could not read the flattener report:
${report}`);
  assert.equal(
    Number(dead[1]),
    0,
    `globals.css has ${dead[1]} declarations that are overridden by the same selector later. ` +
      "Edit the existing rule instead of adding another copy, or run tools/flatten-css.mjs.",
  );
});

test("every photograph the page references is actually shipped", async () => {
  const page = await html();
  const sources = new Set(Array.from(page.matchAll(/src="(\/images\/[^"]+)"/g), (match) => match[1]));
  assert.ok(sources.size > 20, "the page stopped referencing its photography");

  await Promise.all(
    [...sources].map(async (source) => {
      try {
        await access(new URL(`../public${source}`, import.meta.url));
      } catch {
        throw new Error(`the page references ${source}, which is not in public/`);
      }
    }),
  );

  /* Nothing left on disk that the page no longer shows. */
  for (const gone of ["public/images/kiyo/sections/awards", "public/images/kiyo/sections/umrahBanner.webp", "public/images/kiyo/sections/reachMap.svg", "public/images/kiyo/warehouse-1.webp", "public/media"]) {
    await assert.rejects(access(new URL(`../${gone}`, import.meta.url)), `${gone} should have been retired`);
  }
});

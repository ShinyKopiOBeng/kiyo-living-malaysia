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

test("renders the chapters in the order the mockup sets out", async () => {
  const page = await html();

  const order = ["home", "warehouse", "umrah", "corporate", "build", "customise", "delivery", "clients", "about", "visit", "contact"];
  const positions = order.map((id) => {
    const at = page.indexOf(`id="${id}"`);
    assert.notEqual(at, -1, `the page is missing the "${id}" chapter`);
    return at;
  });
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b), "chapters are out of order");
  assert.ok(page.indexOf('class="site-footer"') > page.lastIndexOf('id="contact"'), "the footer must close the page");
});

test("the header carries the nav, the retail link and BUILD YOUR SET", async () => {
  const page = await html();

  assert.match(page, /<title>KIYO Living \| Luggage, Corporate Gifts &amp; UMRAH Travel Sets<\/title>/i);
  for (const label of ["Corporate", "UMRAH", "How it works", "Clients", "About KIYO", "Visit us"]) {
    assert.ok(page.includes(`>${label}<`), `the header nav is missing ${label}`);
  }
  /* Retail is a slider with both stores behind it, not a bare link to one. */
  assert.match(page, /class="retail-trigger"/);
  assert.match(page, /aria-controls="retail-flyout"/);
  assert.match(page, /id="retail-flyout"/);
  assert.match(page, /class="retail-scrim/);
  assert.doesNotMatch(page, /class="header-retail"/);
  assert.match(page, /class="button button--coral header-cta" href="#build"/);
  assert.match(page, /Build your set <span aria-hidden="true">↓<\/span>/);
});

test("the hero matches the mockup: eyebrow, three-line headline, two routes", async () => {
  const hero = await chapter("home", "warehouse");

  assert.match(hero, /class="eyebrow">Malaysian travel, thoughtfully made</);
  assert.match(hero, /<h1>Designed<br\/>for your<br\/>journey\.<\/h1>/);
  assert.match(hero, /Premium luggage, corporate gifting and UMRAH programmes/);
  assert.match(hero, /class="button button--coral" href="#corporate"/);
  assert.match(hero, /class="button button--ghost" href="#umrah"/);
  assert.match(hero, /data-image-slot="HOME-HERO-01"/);
});

test("the warehouse band states the three-line claim and the four capabilities", async () => {
  const band = await chapter("warehouse", "umrah");

  /* The three verbs are the claim and each takes one of the brand's colours;
     the "here" they share steps back so they can carry it. */
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
});

test("UMRAH and corporate are the same chapter shell, twice", async () => {
  const umrah = await chapter("umrah", "corporate");
  const corporate = await chapter("corporate", "build");

  for (const [name, section, lead] of [["UMRAH", umrah, "UMRAH-LEAD"], ["corporate", corporate, "CORPORATE-LEAD"]]) {
    assert.match(section, /class="gift__lead"/, `${name} is not using the shared chapter shell`);
    assert.match(section, /class="gift__copy"/, `${name} is missing the copy column`);
    assert.match(section, new RegExp(`data-image-slot="${lead}"`), `${name} is missing its lead plate`);
    assert.match(section, /class="setstrip"/, `${name} is missing the four-up showcase`);
    assert.ok(
      section.indexOf("gift__lead") < section.indexOf("setstrip"),
      `${name} puts the showcase above the lead`,
    );
    assert.equal((section.match(/class="setcard"/g) ?? []).length, 4, `${name} should show four sets`);
  }

  assert.match(umrah, /Complete UMRAH<br\/>sets, made simple\./);
  assert.match(umrah, /Plan an UMRAH programme/);
  for (const label of ["Essential Journey Set", "Comfort Travel Set", "Complete Jemaah Set", "Agency Branding Set"]) {
    assert.ok(umrah.includes(label), `the UMRAH showcase is missing ${label}`);
  }

  assert.match(corporate, /Corporate gifts<br\/>that travel further\./);
  assert.match(corporate, /Get a corporate quote/);
  for (const label of ["Branded Travel Set", "Executive Journey Set", "Team Building Kit", "Premium Welcoming Gift"]) {
    assert.ok(corporate.includes(label), `the corporate showcase is missing ${label}`);
  }
});

test("step 1 is the product chooser, with bulk and retail routes per card", async () => {
  const build = await chapter("build", "customise");

  assert.match(build, /class="steprail"/);
  assert.match(build, /Choose<br\/>your luggage\./);
  assert.match(build, /Branded designs for every journey\./);
  assert.match(build, /class="chooser__rail"/);
  assert.match(build, /Select for bulk/);
  assert.match(build, /Buy retail/);
  assert.match(build, /Previous products/);
  assert.match(build, /Next products/);

  /* Cases and sets only: a corporate or UMRAH programme is built around
     luggage, so the four bags are filtered out of this step. They stay in the
     catalogue and on disk; the chooser simply does not offer them. */
  assert.equal((build.match(/class="product-card"/g) ?? []).length, 6);
  for (const name of [
    "Premium Aluminium Set", "Full Spec Aluminium Frame", "Sunburst Hardshell",
    "Front Pocket Cabin", "Top Access Cabin", "Mini Hard Case",
  ]) {
    assert.ok(build.includes(name), `the chooser is missing ${name}`);
  }
  for (const bag of ["Business Backpack", "Flap Commuter Backpack", "Slim Laptop Brief", "Weekender Duffel"]) {
    assert.ok(!build.includes(bag), `the chooser should not offer the ${bag}`);
  }
  assert.match(build, /class="product-swatch/);
  /* Buy retail opens the shared slider rather than guessing a platform. */
  assert.match(build, /class="product-card__retail"[^>]*aria-controls="retail-flyout"|aria-controls="retail-flyout"[^>]*class="product-card__retail"/);
});

test("step 2 collects every field the enquiry needs", async () => {
  const customise = await chapter("customise", "delivery");

  assert.match(customise, /Customise<br\/>your brand\./);
  assert.match(customise, /Make it uniquely yours\./);

  /* The close crop, not the full-length case. The engraved plate is placed as
     a percentage of this exact picture, so swapping the plate moves the
     visitor's own name off it. */
  assert.match(customise, /class="brandcase"/);
  assert.match(customise, /data-image-slot="BRAND-CASE-ZOOM"/);
  assert.match(customise, /brandCaseZoom\.webp/);
  assert.match(customise, /Your name here/);

  /* React does not preserve JSX attribute order, so match the tag by the
     attributes it carries rather than by the order they were written in. */
  assert.match(customise, /<input(?=[^>]*name="company")(?=[^>]*required)[^>]*>/);

  /* Every field lives in this step now. Splitting the form across steps 2 and
     3 was what let visitors reach WhatsApp with a half-written brief. */
  for (const field of ["company", "quantity", "destination", "required-by", "notes"]) {
    assert.match(customise, new RegExp(`name="${field}"`), `step 2 is missing ${field}`);
  }
  assert.match(customise, /<input(?=[^>]*name="quantity")(?=[^>]*required)[^>]*>/);

  /* The four options carry their own photograph, so a buyer can see what an
     option means before ticking it. Four options, four plates, no fifth. */
  for (const option of ["Logo printing", "Luggage tag", "Accessories", "Custom packaging"]) {
    assert.ok(customise.includes(option), `the customisation options are missing ${option}`);
  }
  assert.equal((customise.match(/class="optioncard[ "]/g) ?? []).length, 4);
  assert.equal((customise.match(/data-image-slot="BRAND-DETAIL-0/g) ?? []).length, 4);
  for (const programme of ["Corporate Gifts", "UMRAH Programme"]) {
    assert.ok(customise.includes(programme), `the programme toggle is missing ${programme}`);
  }

  /* The engraving and the field that drives it are one object, in that order:
     what the visitor types is shown directly above where they type it. */
  assert.ok(
    customise.indexOf("brandcase") < customise.indexOf("field-company"),
    "the engraved case must sit above the field that drives it",
  );
  assert.ok(
    customise.indexOf("brandstudio") < customise.indexOf("brandform"),
    "the preview column must lead the row, on the left",
  );

  /* The live hint names the first thing still blank, next to the button the
     visitor is about to press. */
  assert.match(customise, /class="flow__status[^"]*"[^>]*aria-live="polite"|aria-live="polite"[^>]*class="flow__status/);
  assert.match(customise, /Pick a model in step 1 to start\./);
  assert.match(customise, /Review my enquiry/);

  /* Nothing is uploaded any more, so nothing may claim to be. */
  assert.doesNotMatch(customise, /type="file"/);
  assert.doesNotMatch(customise, /Upload your logo|Send logo later on WhatsApp|Nothing is uploaded to a server/);
  assert.match(customise, /Send your logo artwork on WhatsApp/);
});

test("step 3 reviews the enquiry and hands off to WhatsApp", async () => {
  const delivery = await chapter("delivery", "clients");

  assert.match(delivery, /Delivery<br\/>made simple\./);
  assert.match(delivery, /From idea to arrival\./);

  /* The six-stage pipeline, in order, each with a line of its own: six
     photographs under a one-word label said nothing about what happens
     between them. */
  assert.match(delivery, /class="pipeline"/);
  const stages = ["Brief", "Sample", "Approve", "Production", "QC", "Warehouse"];
  const at = stages.map((stage) => {
    const index = delivery.indexOf(`>${stage}<`);
    assert.notEqual(index, -1, `the pipeline is missing ${stage}`);
    return index;
  });
  assert.deepEqual(at, [...at].sort((a, b) => a - b), "pipeline stages are out of order");
  assert.equal((delivery.match(/data-image-slot="DELIVERY-0/g) ?? []).length, 6);
  assert.equal((delivery.match(/class="pipeline__line"/g) ?? []).length, 6);

  /* The chapter reviews and sends. Collecting anything here is what caused the
     half-written briefs in the first place. */
  for (const field of ["quantity", "destination", "required-by", "notes"]) {
    assert.doesNotMatch(delivery, new RegExp(`name="${field}"`), `${field} must be collected in step 2`);
  }

  assert.match(delivery, /class="enquiry"/);
  assert.match(delivery, /Your KIYO enquiry/);
  for (const row of ["Product", "Programme", "Company", "Branding", "Quantity", "Delivery to", "Required by", "Additional request"]) {
    assert.ok(delivery.includes(`<dt>${row}</dt>`), `the enquiry summary is missing ${row}`);
  }

  /* A blank value is a control that goes back to the field, not a dash: the
     summary doubles as the checklist. */
  assert.match(delivery, /class="enquiry__add is-required"/);
  assert.ok(!delivery.includes("<dd>-</dd>"), "a blank summary value must offer a way to fill it");

  assert.match(delivery, /Get my quote on WhatsApp/);
  assert.match(delivery, /type="submit"/);

  /* The link opens WhatsApp with the message written but NOT sent, which
     visitors miss: they close the tab believing they have enquired. */
  assert.match(delivery, /Press send once WhatsApp opens/);

  /* And on a desktop with no WhatsApp the deep link dead-ends on an "open the
     app" interstitial, so the same brief has to have a second way out. */
  assert.match(delivery, /Email it instead/);

  /* An enquiry, not a checkout. Quoting a price or taking payment on the page
     is out of scope; asking KIYO to quote one is the whole point. */
  assert.doesNotMatch(delivery, /add to cart|checkout|proceed to pay|card number|RM ?[0-9]/i);
});

test("chapter 8 answers the trust question with numbers, proof and voices", async () => {
  const clients = await chapter("clients", "about");

  assert.match(clients, /Trusted by leading organisations/i);
  /* The marks loop rather than wrap, so twelve can each be shown large. The
     run is rendered twice, which is what makes the wrap seamless. */
  assert.match(clients, /class="logomarquee"/);
  assert.equal((clients.match(/class="logomarquee__run"/g) ?? []).length, 2);
  assert.equal((clients.match(/logowall__mark/g) ?? []).length, 24);
  /* The duplicate run must not be read out twice. */
  assert.match(clients, /class="logomarquee__run" aria-hidden="true"|aria-hidden="true"[^>]*class="logomarquee__run"/);
  assert.equal((clients.match(/data-image-status="placeholder"/g) ?? []).length, 0);

  /* Every figure carries its own scope. A bare "4.9" would be a wider claim
     than KIYO has made, and a bare "2,000+" would read as a company total. */
  assert.match(clients, /class="proofnumbers"/);
  /* The finished number ships in the markup, so the row is right before the
     count-up runs and stays right if it never does. */
  for (const [value, scope] of [
    ["4.9", "Shopee store rating"],
    ["2,000+", "sold on one luggage listing"],
    ["5.0", "Google rating, from 183 reviews"],
    ["14", "awards since 2022"],
  ]) {
    assert.ok(
      clients.includes(`class="proofnumbers__value" data-count=`) && clients.includes(`>${value}</span>`),
      `the numbers are missing ${value}`,
    );
    assert.ok(clients.includes(`<dd>${scope}</dd>`), `the numbers are missing the scope "${scope}"`);
  }

  /* Only the two ratings get stars, and the fill is clipped to the score
     rather than rounded up, so 4.9 is not five full stars. The stars restate
     the number beside them, so the scale goes to assistive tech as words. */
  assert.equal((clients.match(/class="stars"/g) ?? []).length, 2);
  assert.match(clients, /class="stars__fill" style="width:98%"/);
  assert.match(clients, /class="stars__fill" style="width:100%"/);
  assert.equal((clients.match(/ out of <!-- -->5<\/span>/g) ?? []).length, 2);

  /* Five claims, each opening the best proof KIYO has for it, and each one
     printing where it goes: three lead into this site, two to a video. */
  assert.equal((clients.match(/class="proofcard"/g) ?? []).length, 5);
  for (const destination of ["Watch on Lazada", "UMRAH sets", "Customise", "How we deliver"]) {
    assert.ok(clients.includes(destination), `a proof card is missing the destination ${destination}`);
  }
  assert.equal((clients.match(/Watch on Lazada/g) ?? []).length, 2);
  /* Anything leaving the site says so, and says so to a screen reader too. */
  for (const external of clients.match(/<a class="proofcard"[^>]*>/g) ?? []) {
    if (!external.includes("http")) continue;
    assert.match(external, /target="_blank"/);
    assert.match(external, /rel="noreferrer"/);
  }

  /* One featured quote, two beside it. The third is a public review post, so
     it is quoted in the reviewer's words and linked back to the original,
     which is the basis on which quoting it is fair. */
  assert.equal((clients.match(/class="voice[ "]/g) ?? []).length, 3);
  assert.equal((clients.match(/class="voice voice--lead"/g) ?? []).length, 1);
  assert.match(clients, /Reliable quality and seamless coordination/);
  assert.match(clients, /Our jemaah love the sets/);
  assert.match(clients, /Berbaloi beli luggage ni/);
  assert.match(clients, /lemon8-app\.com/);
  assert.match(clients, /lily_ssi on Lemon8/);

  /* The old chapter is gone: a still photograph with a play badge that opened
     TikTok, and a "Partner stories" heading that opened a WhatsApp chat. */
  for (const dead of ["videocard", "stories__head", "class=\"quotes\""]) {
    assert.ok(!clients.includes(dead), `chapter 8 still carries ${dead}`);
  }
  assert.doesNotMatch(clients, /wa\.me/);
});

test("chapter 9 stands the awards on one plate and makes them readable", async () => {
  const about = await chapter("about", "visit");

  assert.match(about, /<h2>Samantha Ng<\/h2>/);
  assert.match(about, /Founder, KIYO Living/);
  assert.match(about, /Built to help organisations move together\./);
  assert.match(about, /Recognised in live commerce/i);

  /* One photograph, not three layers. Samantha, the room and all fourteen
     trophies are composited in the plate, so nothing has to be re-registered
     against a shelf line and nothing slides off a shelf at odd browser zoom. */
  assert.match(about, /data-image-slot="ABOUT-BAND"/);
  assert.match(about, /aboutBand\.webp/);
  for (const gone of ["ABOUT-SAMANTHA", "ABOUT-BACKDROP", "RECOGNITION-ROW-", "founder__wash", "founder__inner"]) {
    assert.ok(!about.includes(gone), `the About band no longer assembles itself from ${gone}`);
  }

  /* Fourteen controls standing where the trophies stand, each with a real
     name, positioned against the same box the plate fills. */
  assert.equal((about.match(/class="awardwall__spot"/g) ?? []).length, 14);
  assert.ok(
    about.indexOf("ABOUT-BAND") < about.indexOf('class="recognition"'),
    "the hotspots must be laid over the band, not nested in the copy column",
  );
  for (const name of [
    "Rising Star Brand", "SME100 Awards, Fast Moving Companies", "TikTok Top 3 Live Luggage Brand",
    "Million Ringgit Sales Achievement", "TikTok Shop Preferred Partner",
  ]) {
    assert.ok(about.includes(name), `the award wall is missing ${name}`);
  }

  /* Below the desktop breakpoint the awards leave the shelf, so the same
     fourteen have to exist as a row of their own. */
  assert.equal((about.match(/class="awardrow__item"/g) ?? []).length, 14);
  /* Two sizes of the same fourteen: the wall lays one over each trophy in the
     band, the row and the dialog use the larger. */
  assert.equal((about.match(/data-image-slot="AWARD-WALL-/g) ?? []).length, 14);
  assert.equal((about.match(/data-image-slot="AWARD-(?!WALL)/g) ?? []).length, 14);

  /* The lift is the cut-out itself, not a scaled rectangle of the band. That
     rectangle used to carry background with it. */
  assert.equal((about.match(/class="image-slot awardwall__lift"/g) ?? []).length, 14);
  assert.doesNotMatch(about, /awardwall__spot"[^>]*background-image/);

  /* The summaries live in the dialog, which is not rendered until a trophy is
     opened, so they are checked at the source. Only SME100 publishes its
     criteria, so it is the only award whose organiser is named: naming the
     others would invent a credential KIYO has not claimed. */
  const wall = await readFile(new URL("app/components/awardWall.ts", templateRoot), "utf8");
  assert.equal((wall.match(/^    id: "/gm) ?? []).length, 14);
  assert.match(wall, /SME100 has ranked Malaysian SMEs since 2009/);
  assert.doesNotMatch(wall, /Reader's Digest|Readers Digest/i);

  /* Two claims from the live-commerce deck were unsubstantiated and stay off.
     "Million Ringgit Sales Achievement" is now on the page, but as the name of
     a trophy KIYO holds rather than as a business statistic, so the guard
     checks that it never appears without the award's own wording. */
  const page = await html();
  assert.doesNotMatch(page, /Live Hosts Trained/i);
  for (const hit of page.match(/million[ -]ringgit[^<"]*/gi) ?? []) {
    assert.match(hit, /sales[ -]achievement/i, `million ringgit is claimed as a statistic in: ${hit}`);
  }
});

test("chapter 10 gives the reach map, the address and a real map", async () => {
  const visit = await chapter("visit", "contact");

  assert.match(visit, /Nationwide<br\/>coordination\./);
  assert.match(visit, /From our warehouse to every destination in Malaysia\./);
  assert.match(visit, /class="reachmap"[^>]*src="\/images\/kiyo\/sections\/reachMap\.svg"/);
  /* The base map is CC BY 3.0. The credit has to stay visible on the page, not
     only inside the file. */
  assert.match(visit, /class="reachmap__credit"/);
  assert.match(visit, /CC BY 3\.0/);
  for (const label of ["Stock", "Pack", "Coordinate", "Deliver"]) {
    assert.ok(visit.includes(label), `the reach row is missing ${label}`);
  }

  assert.match(visit, /Visit KIYO/);
  assert.match(visit, /Kajang, Selangor/);
  assert.match(visit, /No\. 16, Jalan SC 1, Pusat Perindustrian Sungai Chua/);
  assert.match(visit, /Monday to Saturday, 9:00am to 6:00pm/);
  assert.match(visit, /<iframe[^>]*maps\.google\.com[^>]*output=embed/);
  assert.match(visit, /title="Map showing KIYO Living in Kajang, Selangor"/);
  assert.match(visit, /Get directions/);
  assert.match(visit, /Arrange a visit/);

  /* The registered address is in Kajang. Shah Alam was inherited from a mockup. */
  const page = await html();
  assert.doesNotMatch(page, /Shah Alam/);
});

test("the closing band and footer carry every business route", async () => {
  const page = await html();

  assert.match(page, /Ready to build your set\?/);
  assert.match(page, /Tell us your programme\./);
  assert.match(page, /Talk to KIYO on WhatsApp/);

  assert.match(page, /class="site-footer__grid"/);
  for (const heading of ["B2B Solutions", "Retail", "Visit &amp; Contact"]) {
    assert.match(page, new RegExp(`<h2>${heading}</h2>`), `the footer is missing the ${heading} column`);
  }
  for (const label of ["Corporate Gifts", "UMRAH Programmes", "Customisation", "How It Works", "Product Collection", "Shopee Store", "TikTok Shop", "Arrange a Visit"]) {
    assert.ok(page.includes(label), `the footer is missing the ${label} link`);
  }
  assert.match(page, /Designed for Your Journey\./);
  assert.match(page, /kiyoliving88@gmail\.com/);
  assert.doesNotMatch(page, /hello@kiyo\.com\.my/);
  assert.match(page, /Company No\. 202201026207 \(1471904-T\)/);
  assert.match(page, /\+60 13-276 7887/);
  assert.match(page, /wa\.me\/60132767887/);
  assert.match(page, /shopee\.com\.my\/kiyoliving/);
  for (const [label, href] of [["Terms", "/terms"], ["Privacy", "/privacy"], ["Shipping &amp; Returns", "/shipping-returns"]]) {
    assert.match(page, new RegExp(`href="${href}"[^>]*>${label}<`));
  }

  /* Retail actions offer Shopee and TikTok only: no Lazada buying route.
     Chapter 8 does link two Lazada product videos as proof, which is the one
     place the name is allowed to appear, so the guard is scoped to the routes
     rather than to the whole page. */
  assert.doesNotMatch(await chapter("contact"), /lazada/i);
  const lazada = page.match(/href="[^"]*lazada[^"]*"/gi) ?? [];
  assert.equal(lazada.length, 2, "Lazada belongs only on the two proof cards");
  for (const link of lazada) {
    assert.match(link, /videodetail/, `a Lazada link that is not a product video: ${link}`);
  }
  assert.equal((page.match(/<a class="proofcard"[^>]*lazada[^>]*>/g) ?? []).length, 2);
  /* The WhatsApp float is a draggable dock, not a bare fixed anchor. */
  assert.match(page, /class="whatsapp-dock"/);
  /* Typography house rule: hyphens only, no em or en dashes in visible copy. */
  assert.doesNotMatch(page, /[–—]/);
  assert.doesNotMatch(page, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("keeps the architecture production-ready", async () => {
  const [page, layout, packageJson, experience, builder, gifts, , slots, placeholder, css, fonts] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/KiyoExperience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/BuildYourSet.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/KiyoInteractiveSections.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/TrustSections.tsx", import.meta.url), "utf8"),
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
     apart, which the mockup explicitly does not want. */
  assert.match(gifts, /function GiftChapter/);
  assert.equal((gifts.match(/<GiftChapter/g) ?? []).length, 2);
  /* Both showcases stay interactive: hover to highlight, click to inspect. */
  assert.match(gifts, /function GiftShowcase/);
  assert.match(gifts, /<dialog/);
  assert.match(gifts, /setActive\(index\)/);
  assert.match(gifts, /aria-haspopup="dialog"/);

  /* The reveal has to hand the element back to the stylesheet when it lands.
     A finished tween leaves `opacity` inline, and an inline style outranks any
     rule, which silently killed every CSS hover state on a revealed element -
     the showcase could not dim its unhovered cards. */
  assert.match(experience, /clearProps: "opacity,visibility,transform"/);

  /* The builder hands off to WhatsApp and stores nothing. */
  assert.match(builder, /whatsappLink\(message\)/);
  assert.match(builder, /window\.open\(/);
  assert.doesNotMatch(builder, /fetch\(|XMLHttpRequest|FormData\(/);
  /* Nothing is read off the visitor's disk either. The logo upload existed
     only to draw a preview, and the file it took never went anywhere. */
  assert.doesNotMatch(builder, /createObjectURL|FileReader|type="file"/);

  /* Two of the three quotes are still attributed to a role rather than to a
     person, because KIYO has not asked permission to name anyone. The third is
     a public post, and quoting it is only fair while it is credited and linked
     back, so both have to stay together. */
  const proof = await readFile(new URL("app/components/clientProof.ts", templateRoot), "utf8");
  assert.match(proof, /source: "Corporate client"/);
  assert.match(proof, /source: "lily_ssi on Lemon8"/);
  assert.match(proof, /href: "https:\/\/www\.lemon8-app\.com/);

  /* Every WhatsApp button says where it was pressed, so whoever answers is not
     starting two messages behind. */
  const footer = await readFile(new URL("app/components/SiteFooter.tsx", templateRoot), "utf8");
  assert.match(footer, /Sent from the KIYO website, \$\{source\}/);
  for (const message of ["GENERAL_MESSAGE", "UMRAH_MESSAGE", "CORPORATE_MESSAGE", "VISIT_MESSAGE"]) {
    assert.match(footer, new RegExp(`export const ${message}`), `SiteFooter is missing ${message}`);
  }

  /* The display and body faces are self-hosted: next/font downloaded them but
     the Vinext build never emitted the @font-face rules, which silently left
     every heading on the system sans. */
  assert.doesNotMatch(layout, /next\/font/);
  assert.match(css, /@import "\.\/fonts\.css"/);
  /* The variable names match app/fonts.ts, so the next/font declaration and the
     self-hosted faces describe the same two families. */
  assert.match(css, /--font-heading:/);
  assert.match(css, /--font-body:/);
  assert.match(fonts, /font-family: "Cormorant Garamond"/);
  assert.match(fonts, /font-family: "Montserrat"/);
  assert.match(fonts, /url\("\/fonts\//);
  await access(new URL("../public/fonts", import.meta.url));

  /* ScrollTrigger still drives the header, which is scroll-position based and
     self-correcting. */
  assert.match(experience, /ScrollTrigger\.create/);
  assert.match(experience, /data-reveal-group/);
  /* The reveals must NOT use ScrollTrigger.batch. It measures every start
     against the page height at creation time, so photographs loading below the
     fold grew the page underneath the triggers and stranded whole chapters at
     `autoAlpha: 0`. It was a race, so a different set of sections went missing
     on each load. An IntersectionObserver has no stale geometry to go wrong. */
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
  for (const token of ["--radius-card", "--radius-tile", "--radius-pill"]) {
    assert.match(css, new RegExp(`${token}:`), `radius scale is missing ${token}`);
  }
  assert.match(css, /scroll-margin-top/);

  /* Markup the redesign removed leaves no orphaned rules behind. */
  for (const dead of ["\\.shop-flyout", "\\.business-pillar", "\\.product-collection", "\\.location-card", "\\.about__copy", "\\.corporate-accordion", "\\.umrah__process", "\\.branddetails", "\\.brandpanel", "\\.deliveryform", "\\.brandform__logo", "\\.ghost-button", "\\.founder__wash", "\\.founder__cutout"]) {
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

  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview", templateRoot)));
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
});

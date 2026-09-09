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

  assert.match(band, /Designed here\.<br\/>Prepared here\.<br\/>Delivered from here\./);
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

test("step 2 takes the company, the programme and an optional logo", async () => {
  const customise = await chapter("customise", "delivery");

  assert.match(customise, /Customise<br\/>your brand\./);
  assert.match(customise, /Make it uniquely yours\./);
  assert.match(customise, /class="brandcase"/);
  assert.match(customise, /Your logo/);

  /* React does not preserve JSX attribute order, so match the tag by the
     attributes it carries rather than by the order they were written in. */
  assert.match(customise, /<input(?=[^>]*name="company")(?=[^>]*required)[^>]*>/);
  assert.match(customise, /<input(?=[^>]*name="logo")(?=[^>]*type="file")[^>]*>/);

  for (const option of ["Logo printing", "Luggage tag", "Accessories", "Custom packaging"]) {
    assert.ok(customise.includes(option), `the customisation chips are missing ${option}`);
  }
  for (const programme of ["Corporate Gifts", "UMRAH Programme"]) {
    assert.ok(customise.includes(programme), `the programme toggle is missing ${programme}`);
  }
  /* Three columns, in the mockup's order: the case, then the form, then the
     detail plates with the step's one forward action closing that column. The
     mosaic and the button share the panel, which is what keeps them the same
     width at every viewport rather than at one tuned value. */
  assert.match(customise, /class="brandpanel"/);
  assert.ok(
    customise.indexOf("brandcase") < customise.indexOf("brandform"),
    "the branded case must lead the row, on the left",
  );
  assert.ok(
    customise.indexOf("brandform") < customise.indexOf("brandpanel"),
    "the form is the middle column, before the panel of plates",
  );
  for (const inPanel of ["branddetails", "flow__continue"]) {
    assert.ok(
      customise.indexOf(inPanel) > customise.indexOf("brandpanel"),
      `${inPanel} must sit inside the right-hand panel`,
    );
  }
  assert.match(customise, /Send logo later on WhatsApp/);
  assert.match(customise, /Nothing is uploaded to a server/);
  assert.match(customise, /Continue to delivery/);
});

test("step 3 collects the delivery detail and hands off to WhatsApp", async () => {
  const delivery = await chapter("delivery", "clients");

  assert.match(delivery, /Delivery<br\/>made simple\./);
  assert.match(delivery, /From idea to arrival\./);

  /* The six-stage pipeline, in order. */
  assert.match(delivery, /class="pipeline"/);
  const stages = ["Brief", "Sample", "Approve", "Production", "QC", "Warehouse"];
  const at = stages.map((stage) => {
    const index = delivery.indexOf(`>${stage}<`);
    assert.notEqual(index, -1, `the pipeline is missing ${stage}`);
    return index;
  });
  assert.deepEqual(at, [...at].sort((a, b) => a - b), "pipeline stages are out of order");
  assert.equal((delivery.match(/data-image-slot="DELIVERY-0/g) ?? []).length, 6);

  for (const field of ["quantity", "destination", "required-by", "notes"]) {
    assert.match(delivery, new RegExp(`name="${field}"`), `the delivery form is missing ${field}`);
  }
  assert.match(delivery, /class="enquiry"/);
  assert.match(delivery, /Your KIYO enquiry/);
  for (const row of ["Product", "Programme", "Branding", "Quantity", "Delivery"]) {
    assert.ok(delivery.includes(`<dt>${row}</dt>`), `the enquiry summary is missing ${row}`);
  }
  assert.match(delivery, /Get my quote on WhatsApp/);
  assert.match(delivery, /You can send your logo file after WhatsApp opens\./);
  assert.match(delivery, /type="submit"/);

  /* An enquiry, not a checkout. Quoting a price or taking payment on the page
     is out of scope; asking KIYO to quote one is the whole point. */
  assert.doesNotMatch(delivery, /add to cart|checkout|proceed to pay|card number|RM ?[0-9]/i);
});

test("chapter 8 carries the client wall, the video, the quotes and partner stories", async () => {
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
  assert.match(clients, /\/images\/kiyo\/sections\/logos\/01-aia\.webp/);
  /* Two marks arrived filed only as a crest. They must stay unnamed rather
     than have an organisation guessed onto them. */
  assert.match(clients, /alt="Client organisation logo"/);
  assert.doesNotMatch(clients, /Wanderlust Travel|Corp Solutions Malaysia|Nexus University|Urban Haul|Global Escapes|Prime Events/i);

  assert.match(clients, /class="videocard"/);
  assert.match(clients, /tiktok\.com\/@kiyoliving/);
  assert.equal((clients.match(/class="quote"/g) ?? []).length, 2);
  assert.match(clients, /Reliable quality and seamless coordination from start to finish\./);
  assert.match(clients, /Our jemaah love the sets\./);
  assert.match(clients, /Partner stories/);
  assert.equal((clients.match(/data-image-slot="PARTNER-0/g) ?? []).length, 3);
});

test("chapter 9 keeps Samantha and the recognition shelf", async () => {
  const about = await chapter("about", "visit");

  assert.match(about, /data-image-slot="ABOUT-SAMANTHA"/);
  assert.match(about, /\/images\/kiyo\/sections\/samantha\.webp/);
  assert.match(about, /<h2>Samantha Ng<\/h2>/);
  assert.match(about, /Founder, KIYO Living/);
  assert.match(about, /Built to help organisations move together\./);
  assert.match(about, /Recognised in live commerce/i);
  /* Two award rows, not one composite panel: each is stood on a shelf of the
     photographed room, which is only possible while they are separate plates
     and siblings of the band rather than children of the content column. */
  assert.match(about, /data-image-slot="RECOGNITION-ROW-1"/);
  assert.match(about, /data-image-slot="RECOGNITION-ROW-2"/);
  assert.ok(
    about.indexOf("founder__inner") < about.indexOf('class="recognition"'),
    "the award rows must be laid over the band, not nested in the copy column",
  );
  /* One photographed room: the shelving is the band itself, so it comes before
     the content rather than being boxed inside a left-hand panel. */
  assert.match(about, /data-image-slot="ABOUT-BACKDROP"/);
  assert.match(about, /class="founder__wash"/);
  assert.ok(
    about.indexOf("ABOUT-BACKDROP") < about.indexOf("founder__inner"),
    "the shelving plate must span the band, behind the content",
  );
  assert.doesNotMatch(about, /founder__portrait/);

  /* Two claims from the live-commerce deck are unsubstantiated and stay off. */
  const page = await html();
  assert.doesNotMatch(page, /MILLION-RINGGIT|Live Hosts Trained/i);
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

  /* Retail actions offer Shopee and TikTok only. No Lazada route is included. */
  assert.doesNotMatch(page, /lazada/i);
  /* The WhatsApp float is a draggable dock, not a bare fixed anchor. */
  assert.match(page, /class="whatsapp-dock"/);
  /* Typography house rule: hyphens only, no em or en dashes in visible copy. */
  assert.doesNotMatch(page, /[–—]/);
  assert.doesNotMatch(page, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("keeps the architecture production-ready", async () => {
  const [page, layout, packageJson, experience, builder, gifts, trust, slots, placeholder, css, fonts] = await Promise.all([
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
  assert.match(builder, /URL\.revokeObjectURL/);
  assert.doesNotMatch(builder, /fetch\(|XMLHttpRequest|FormData\(/);

  /* Quotes stay unattributed until real, approved ones arrive. */
  assert.match(trust, /export const customerReviews: CustomerReview\[\]/);

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
  for (const dead of ["\\.shop-flyout", "\\.business-pillar", "\\.product-collection", "\\.location-card", "\\.about__copy", "\\.corporate-accordion", "\\.umrah__process"]) {
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

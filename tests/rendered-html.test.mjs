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

test("server-renders the V5 KIYO portfolio alignment experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>KIYO Living \| Luggage, Corporate Gifts &amp; UMRAH Travel Sets<\/title>/i);

  for (const label of ["About", "At a Glance", "Products", "Corporate", "UMRAH", "Location", "Contact"]) {
    assert.match(html, new RegExp(`>${label}<`));
  }

  assert.match(html, /DESIGNED FOR/i);
  assert.match(html, /YOUR JOURNEY/i);
  assert.match(html, /Malaysia-based premium brand specialising in travel, live-commerce, wholesale distribution, and corporate gifting solutions/i);
  assert.match(html, /DISCOVER KIYO/i);
  assert.match(html, /CORPORATE GIFTING/i);
  assert.match(html, /data-image-slot="HOME-HERO-01"/);
  assert.match(html, /\/images\/kiyo\/home-hero-airport\.webp/i);
  for (const proof of ["TOP 3", "TSP OFFICIAL", "EST. 2022", "NATIONWIDE", "TikTok Shop", "SSM 202201026207"]) {
    assert.ok(html.includes(proof), `hero proof bar is missing ${proof}`);
  }
  // Two claims from the deck are unsubstantiated and must stay off the site.
  assert.doesNotMatch(html, /MILLION-RINGGIT|Live Hosts Trained/i);
  // No invented client names anywhere.
  assert.doesNotMatch(html, /Wanderlust Travel|Corp Solutions Malaysia|Nexus University|Urban Haul|Global Escapes|Prime Events/i);
  assert.doesNotMatch(html, /Move to reveal|audience-marquee|torch-hint|hero-grid/i);

  assert.match(html, /<span>A Malaysian travel<\/span> <em>and live-commerce brand<\/em>/);
  assert.match(html, /KIYO Living Sdn\. Bhd\. is a Malaysia-based travel and live-commerce brand/);
  assert.match(html, /Samantha Ng<\/strong><span>Founder, KIYO Living<\/span>/);
  assert.match(html, /To empower journeys, elevate brands and create lasting impact/);
  assert.match(html, /data-image-slot="ABOUT-WAREHOUSE"/);
  assert.match(html, /data-image-slot="ABOUT-SAMANTHA"/);
  assert.doesNotMatch(html, /Founder Samantha Ng|founder badge|<figcaption><span>Founder/i);

  assert.match(html, /<h2><span>Business<\/span> <em>pillars<\/em><\/h2>/i);
  for (const title of ["Viral TikTok Campaigns", "Nationwide Wholesale Distribution", "Premium Corporate Gifting Solutions", "Live-Commerce Ecosystem", "Strategic Partnerships"]) {
    assert.match(html, new RegExp(title, "i"));
  }
  assert.doesNotMatch(html, /<h3>UMRAH Programmes<\/h3>/i);
  assert.doesNotMatch(html, /data-image-slot="CAPABILITY-/);

  assert.match(html, /TRAVEL &amp; LIFESTYLE/i);
  assert.match(html, /COLLECTION/i);
  // Scoped to the heading: "premium luggage" is still fair copy elsewhere.
  assert.doesNotMatch(html, /<span>Premium luggage<\/span>/i);
  for (const category of ["Cabin &amp; Check-in Luggage", "Bags &amp; Backpacks", "Travel Accessories", "Durable Everyday Travel"]) {
    assert.ok(html.includes(category), `products is missing the ${category} card`);
  }
  assert.match(html, /RETAIL &amp; WHOLESALE READY/i);
  assert.match(html, /EXPLORE PRODUCTS/i);
  assert.doesNotMatch(html, /aria-label="KIYO product inspector"|class="product-stage"|>360 Wheels<|>Security Lock</i);

  // V9: the section is a drifting carousel of the real product shots.
  assert.match(html, /class="product-carousel"/);
  assert.match(html, /class="product-carousel__track"/);
  for (const name of [
    "Premium Aluminium Set", "Full Spec Aluminium Frame", "Sunburst Hardshell",
    "Front Pocket Cabin", "Top Access Cabin", "Mini Hard Case",
    "Business Backpack", "Flap Commuter Backpack", "Slim Laptop Brief", "Weekender Duffel",
  ]) {
    assert.ok(html.includes(name), `carousel is missing ${name}`);
  }
  // Ten products, rendered twice so the loop wraps without a visible seam.
  assert.equal((html.match(/class="product-slide"/g) ?? []).length, 20);
  assert.match(html, /class="product-swatch/);
  assert.match(html, /Previous products/);
  assert.match(html, /Next products/);

  assert.match(html, /class="corporate-accordion"/);
  assert.match(html, /<span>Corporate<\/span> <em>gifting<\/em>/i);
  assert.match(html, /Custom logo printing, thoughtful event gifting, and premium brand experiences/i);
  for (const title of ["Branded Luggage + Travel Amenities Set", "Team Building Outdoor Kit", "Mini Luggage Travel Kit", "A5 Notebook Gift Set"]) {
    assert.ok(html.includes(title));
  }
  for (const slot of ["GIFT-SET-01", "GIFT-SET-02", "GIFT-SET-03", "GIFT-SET-04"]) {
    assert.match(html, new RegExp(`data-image-slot="${slot}"`));
  }
  // Covers show the set name and a "See details" affordance only; the bullets,
  // MOQ and lead time now live in the dialog, which mounts on demand.
  assert.match(html, /See details/i);
  assert.doesNotMatch(html, /Inspect set/i);
  assert.doesNotMatch(html, /corporate-panel__details/);

  assert.match(html, /<span>The complete<\/span> <em>UMRAH set<\/em>/);
  assert.match(html, /Journey set/);
  assert.match(html, /Essentials/);
  assert.match(html, /Agency branding/);
  for (const slot of ["UMRAH-JOURNEY", "UMRAH-ESSENTIALS", "UMRAH-BRANDING"]) {
    assert.match(html, new RegExp(`data-image-slot="${slot}"`));
  }
  assert.doesNotMatch(html, /agency-process/);
  assert.match(html, /How an agency order runs/);
  for (const step of ["Consult", "Brand", "Approve", "Deliver"]) {
    assert.ok(html.includes(`<strong>${step}</strong>`), `UMRAH process is missing ${step}`);
  }

  const locationHtml = html.slice(html.indexOf('<section id="location"'), html.indexOf('<section id="contact"'));
  const warehouseSources = Array.from(locationHtml.matchAll(/\/images\/kiyo\/warehouse-(\d)\.webp/g), (match) => Number(match[1]));
  assert.deepEqual(warehouseSources, [1, 2, 3, 4, 5]);
  assert.ok(locationHtml.indexOf("Warehouse Inventory") > locationHtml.indexOf("/images/kiyo/warehouse-5.webp"));
  for (const capability of ["Warehouse Inventory", "Nationwide Fulfilment", "Product Sourcing", "Live-Commerce Support"]) {
    assert.ok(html.includes(capability), `location is missing the ${capability} card`);
  }
  assert.match(html, /<span>Built for scale<\/span> <em>across Malaysia<\/em>/);
  assert.doesNotMatch(html, /Visit by appointment/);
  assert.match(html, /<span>Start your<\/span> <em>next journey<\/em>/);
  assert.match(html, /wa\.me\/60132767887/);
  assert.match(html, /shopee\.com\.my\/kiyoliving/);
  assert.match(html, /tiktok\.com\/@kiyoliving/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);

  // Footer carries navigation, contact detail and the legal routes.
  assert.match(html, /class="site-footer__grid"/);
  for (const heading of ["Explore", "Services", "Contact"]) {
    assert.match(html, new RegExp(`<h2>${heading}</h2>`));
  }
  assert.match(html, /kiyoliving88@gmail\.com/);
  assert.doesNotMatch(html, /hello@kiyo\.com\.my/);
  // The registered address is in Kajang. Shah Alam was inherited from a mockup.
  assert.match(html, /No\. 16, Jalan SC 1/);
  assert.match(html, /43000 Kajang, Selangor/);
  assert.doesNotMatch(html, /Shah Alam/);
  assert.match(html, /Company No\. 202201026207 \(1471904-T\)/);
  assert.match(html, /\+60 13-276 7887/);
  for (const [label, href] of [["Terms &amp; Conditions", "/terms"], ["Privacy Policy", "/privacy"], ["Shipping &amp; Returns", "/shipping-returns"]]) {
    assert.match(html, new RegExp(`href="${href}"[^>]*>${label}<`));
  }

  // The WhatsApp float is a draggable dock, not a bare fixed anchor.
  assert.match(html, /class="whatsapp-dock"/);

  // Shop is a right-edge flyout, not a centred modal.
  assert.match(html, /id="shop-flyout"/);
  assert.match(html, /class="shop-scrim/);
  assert.doesNotMatch(html, /shop-dialog/);
  assert.match(html, /aria-controls="shop-flyout"/);

  // Typography house rule: hyphens only, no em or en dashes in visible copy.
  assert.doesNotMatch(html, /[–—]/);

  // Eyebrows: hero, Who we are, Our core, UMRAH programme.
  assert.equal((html.match(/class="eyebrow"/g) ?? []).length, 4);
});

test("keeps the V5 portfolio architecture production-ready", async () => {
  const [page, layout, packageJson, experience, interactions, slots, placeholder, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/KiyoExperience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/KiyoInteractiveSections.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/imageSlots.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ImagePlaceholder.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /KiyoExperience/);
  assert.match(layout, /KIYO Living/);
  assert.match(layout, /application\/ld\+json/);
  assert.match(slots, /status: ImageSlotStatus/);
  assert.match(slots, /mobileSrc\?: string/);
  assert.match(placeholder, /process\.env\.NODE_ENV !== "production"/);
  assert.match(interactions, /<dialog/);
  assert.match(interactions, /ProductCollectionOverview/);
  assert.doesNotMatch(interactions, /ProductInspector|productScenes|productSlots/);
  // Gift detail is authored once and rendered only inside the dialog.
  assert.match(interactions, /See details/i);
  assert.match(interactions, /Premium mini luggage with travel essentials/);
  assert.match(interactions, /\bmoq\b|leadTime|<dl>/i);
  assert.match(interactions, /100 sets/);
  assert.match(interactions, /6-8 weeks/);
  // Hover expands a panel; the click opens the dialog.
  assert.match(interactions, /onMouseEnter=\{\(\) => setActiveIndex\(index\)\}/);
  assert.match(interactions, /onClick=\{\(\) => setDialogIndex\(index\)\}/);
  assert.match(experience, /businessPillars/);
  assert.doesNotMatch(experience, /const capabilities\s*=/);
  assert.match(experience, /ScrollTrigger\.create/);
  assert.doesNotMatch(experience, /pin:\s*true/);
  assert.doesNotMatch(experience, /locationTrackRef|location__track/);
  assert.doesNotMatch(experience, /window\.addEventListener\("scroll"/);
  assert.doesNotMatch(experience, /Lenis|torch|audience-marquee/i);
  assert.doesNotMatch(css, /\.hero-grid|\.torch-hint|\.product-inspector|\.product-stage/);

  // V7: the WhatsApp float is a round, draggable dock.
  assert.match(experience, /setPointerCapture/);
  assert.match(experience, /DOCK_TAP_TOLERANCE/);
  assert.match(css, /\.whatsapp-float \{[^}]*border-radius: 50%/);
  assert.match(css, /\.whatsapp-dock \{[^}]*touch-action: none/);

  // V7: the header is transparent over the hero and solid once past it.
  assert.match(css, /\.site-header--hero \{[^}]*background: transparent/);

  // V7: the proof bar sits inside the hero rather than straddling its edge.
  assert.doesNotMatch(css, /\.hero__proofs \{[^}]*bottom: -4\.25rem/);

  // V7: markup removed with the redesign leaves no orphaned rules behind.
  assert.doesNotMatch(css, /\.agency-process|\.corporate-panel__details|\.corporate-panel__inspect/);
  assert.doesNotMatch(css, /\.shop-dialog/);

  // V8: the Shop flyout slides in from the right and supports hover and press.
  assert.match(experience, /type ShopMode = "hover" \| "press"/);
  assert.match(experience, /onPointerEnter=\{\(event\) => \{ if \(event\.pointerType === "mouse"\) onShopOpen\("hover"\); \}\}/);
  assert.match(css, /\.shop-flyout \{[^}]*transform: translateX\(100%\)/);
  assert.match(css, /\.shop-flyout\.is-open \{[^}]*transform: translateX\(0\)/);
  // The panel must clear the header, or it covers the trigger that opened it.
  assert.match(css, /\.shop-flyout \{[^}]*top: var\(--header-height\)/);

  // V8: UMRAH cards are an even grid below 1200px, never an off-screen carousel.
  assert.match(css, /\.umrah-gallery__cards \{[^}]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.umrah-gallery__cards \{[^}]*scroll-snap-type: none/);
  // The source photographs are 900x1125. A card frame of any other ratio makes
  // `cover` discard part of the picture, so both breakpoints match 4 / 5.
  assert.equal((css.match(/aspect-ratio: 4 \/ 5;/g) ?? []).length, 2);
  assert.doesNotMatch(css, /\.umrah-card[^{]*\{[^}]*aspect-ratio: 16 \/ 10/);

  // AA-safe accent for label-sized text on the light surfaces.
  assert.match(css, /--coral-deep:/);
  // The hero must not reintroduce the margin that opened a dead band between
  // the hero and the about chapter; the proof bar straddles that seam.
  assert.doesNotMatch(css, /\.hero \{[^}]*margin-bottom: 4\.25rem/);
  // Anchored sections have to clear the fixed header.
  assert.match(css, /scroll-margin-top/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview", templateRoot)));
});

test("product carousel catalogue matches the shipped assets", async () => {
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
  for (const token of ["--color-ink", "--color-paper", "--color-coral", "--color-line", "--font-display"]) {
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

test("includes every approved KIYO production asset used by V5", async () => {
  const requiredAssets = [
    "../public/images/kiyo/home-hero-airport.webp",
    "../public/images/kiyo/product-collection-hero.webp",
    "../public/images/kiyo/samantha-founder.webp",
    "../public/images/kiyo/samantha-warehouse.webp",
    "../public/images/kiyo/corporate-gift-travel-amenities.webp",
    "../public/images/kiyo/corporate-gift-team-building.webp",
    "../public/images/kiyo/corporate-gift-mini-luggage.webp",
    "../public/images/kiyo/corporate-gift-notebook.webp",
    "../public/images/kiyo/umrah-journey.webp",
    "../public/images/kiyo/umrah-essentials.webp",
    "../public/images/kiyo/umrah-custom.webp",
    "../public/images/kiyo/warehouse-1.webp",
    "../public/images/kiyo/warehouse-2.webp",
    "../public/images/kiyo/warehouse-3.webp",
    "../public/images/kiyo/warehouse-4.webp",
    "../public/images/kiyo/warehouse-5.webp",
  ];

  await Promise.all(requiredAssets.map((asset) => access(new URL(asset, import.meta.url))));
});

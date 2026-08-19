import assert from "node:assert/strict";
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
  assert.match(html, /WATCH OUR STORY/i);
  assert.match(html, /data-image-slot="HOME-HERO-01"/);
  assert.match(html, /\/images\/kiyo\/home-hero-airport\.webp/i);
  for (const proof of ["TOP 3", "NATIONWIDE", "PREMIUM", "TikTok Luggage", "Wholesale", "Gifting Solutions"]) {
    assert.match(html, new RegExp(proof, "i"));
  }
  assert.doesNotMatch(html, /Move to reveal|audience-marquee|torch-hint|hero-grid/i);

  assert.match(html, /Building a Malaysian travel brand with reach\./);
  assert.match(html, /Malaysia-based travel lifestyle and live-commerce company/);
  assert.match(html, /Empower journeys, elevate brands and create lasting impact/);
  assert.match(html, /data-image-slot="ABOUT-WAREHOUSE"/);
  assert.match(html, /data-image-slot="ABOUT-SAMANTHA"/);
  assert.doesNotMatch(html, /Founder Samantha Ng|founder badge|<figcaption><span>Founder/i);

  assert.match(html, /OUR CORE/i);
  assert.match(html, /<h2>Business<br\/>Pillars<\/h2>/i);
  for (const title of ["Viral TikTok Campaigns", "Nationwide Wholesale Distribution", "Premium Corporate Gifting Solutions", "Live-Commerce Ecosystem", "Strategic Partnerships"]) {
    assert.match(html, new RegExp(title, "i"));
  }
  assert.doesNotMatch(html, /<h3>UMRAH Programmes<\/h3>/i);
  assert.doesNotMatch(html, /data-image-slot="CAPABILITY-/);

  assert.match(html, /PREMIUM LUGGAGE/i);
  assert.match(html, /COLLECTION/i);
  assert.match(html, /RETAIL &amp; WHOLESALE READY/i);
  assert.match(html, /EXPLORE PRODUCTS/i);
  assert.match(html, /data-image-slot="PRODUCT-COLLECTION-HERO"/);
  assert.match(html, /\/images\/kiyo\/product-collection-hero\.webp/i);
  assert.doesNotMatch(html, /aria-label="KIYO product inspector"|class="product-stage"|>360 Wheels<|>Security Lock</i);

  assert.match(html, /class="corporate-accordion"/);
  assert.match(html, /CORPORATE GIFTING/i);
  assert.match(html, /SOLUTIONS/i);
  assert.match(html, /Custom logo printing, thoughtful event gifting, and premium brand experiences/i);
  for (const title of ["Branded Luggage + Travel Amenities Set", "Team Building Outdoor Kit", "Mini Luggage Travel Kit", "A5 Notebook Gift Set"]) {
    assert.ok(html.includes(title));
  }
  for (const slot of ["GIFT-SET-01", "GIFT-SET-02", "GIFT-SET-03", "GIFT-SET-04"]) {
    assert.match(html, new RegExp(`data-image-slot="${slot}"`));
  }
  assert.match(html, /Inspect set/i);
  assert.match(html, /Premium mini luggage with travel essentials/i);
  assert.match(html, /MOQ/i);
  assert.match(html, /100 sets/i);
  assert.match(html, /Lead time/i);
  assert.match(html, /6–8 weeks/i);

  assert.match(html, /A complete travel set for a meaningful journey\./);
  assert.match(html, /Journey Set/);
  assert.match(html, /Included Essentials/);
  assert.match(html, /Custom Agency Branding/);
  for (const slot of ["UMRAH-JOURNEY", "UMRAH-ESSENTIALS", "UMRAH-BRANDING"]) {
    assert.match(html, new RegExp(`data-image-slot="${slot}"`));
  }
  for (const step of ["Select", "Brand", "Approve", "Deliver"]) {
    assert.match(html, new RegExp(`>${step}`));
  }

  const locationHtml = html.slice(html.indexOf('<section id="location"'), html.indexOf('<section id="contact"'));
  const warehouseSources = Array.from(locationHtml.matchAll(/\/images\/kiyo\/warehouse-(\d)\.webp/g), (match) => Number(match[1]));
  assert.deepEqual(warehouseSources, [1, 2, 3, 4, 5]);
  assert.ok(html.indexOf("Visit by appointment") > html.indexOf("/images/kiyo/warehouse-5.webp"));
  assert.match(html, /Build your next journey with KIYO\./);
  assert.match(html, /wa\.me\/60132767887/);
  assert.match(html, /shopee\.com\.my\/kiyoliving/);
  assert.match(html, /tiktok\.com\/@kiyoliving/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
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
  assert.match(interactions, /Inspect set/i);
  assert.match(interactions, /\bmoq\b|leadTime|<dl>/i);
  assert.match(experience, /businessPillars/);
  assert.doesNotMatch(experience, /const capabilities\s*=/);
  assert.match(experience, /ScrollTrigger\.create/);
  assert.doesNotMatch(experience, /pin:\s*true/);
  assert.doesNotMatch(experience, /locationTrackRef|location__track/);
  assert.doesNotMatch(experience, /window\.addEventListener\("scroll"/);
  assert.doesNotMatch(experience, /Lenis|torch|audience-marquee/i);
  assert.doesNotMatch(css, /\.hero-grid|\.torch-hint|\.product-inspector|\.product-stage/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview", templateRoot)));
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

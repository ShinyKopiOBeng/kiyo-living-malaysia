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

test("server-renders the KIYO portfolio experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>KIYO Living \| Luggage, Corporate Gifts &amp; UMRAH Travel Sets<\/title>/i);
  assert.match(html, /Designed for every journey\./);
  assert.match(html, /Built for business\./);
  assert.match(html, /Home/);
  assert.match(html, /About/);
  assert.match(html, /Products/);
  assert.match(html, /Corporate/);
  assert.match(html, /Services/);
  assert.match(html, /Location/);
  assert.match(html, /Contact/);
  assert.match(html, /Building a Malaysian travel &amp; live-commerce brand\./);
  assert.match(html, /\/images\/kiyo\/samantha-warehouse\.webp/);
  assert.match(html, /\/images\/kiyo\/samantha-founder\.webp/);
  assert.doesNotMatch(html, /<figcaption><span>Founder<\/span><strong>Samantha Ng<\/strong><\/figcaption>/);
  assert.doesNotMatch(html, /KIYO brand capabilities/);
  assert.match(html, /aria-label="KIYO product inspector"/);
  for (const label of ["Overview", "Colours", "Handle", "360 Wheels", "Security Lock", "Studio View", "Travel"]) {
    assert.match(html, new RegExp(`>${label}<`));
  }
  assert.match(html, /\/images\/kiyo\/product-lock\.webp/);
  assert.doesNotMatch(html, /Explore the lineup/);
  assert.doesNotMatch(html, /product-inspector__rail-image/);
  assert.doesNotMatch(html, /product-inspector__progress/);
  for (const title of [
    "Branded Luggage + Travel Amenities Set",
    "Team Building Outdoor Kit",
    "Mini Luggage Travel Kit",
    "A5 Notebook Gift Set",
  ]) {
    assert.ok(html.includes(title));
  }
  for (const asset of [
    "corporate-gift-travel-amenities",
    "corporate-gift-team-building",
    "corporate-gift-mini-luggage",
    "corporate-gift-notebook",
  ]) {
    assert.match(html, new RegExp(`/images/kiyo/${asset}\\.webp`));
  }
  assert.match(html, /Inspect set/);
  assert.match(html, /\/images\/kiyo\/umrah-journey\.webp/);
  assert.match(html, /\/images\/kiyo\/umrah-essentials\.webp/);
  assert.match(html, /\/images\/kiyo\/umrah-custom\.webp/);
  assert.match(html, /Custom agency logo/);
  assert.match(html, /Agency customisation/);
  assert.match(html, /wa\.me\/60132767887/);
  assert.match(html, /shopee\.com\.my\/kiyoliving/);
  assert.match(html, /tiktok\.com\/@kiyoliving/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);

  const warehouseSources = Array.from(
    html.matchAll(/\/images\/kiyo\/warehouse-(\d)\.webp/g),
    (match) => Number(match[1]),
  );
  assert.deepEqual(warehouseSources, [1, 2, 3, 4, 5]);
  assert.ok(html.indexOf("Visit by appointment") > html.indexOf("/images/kiyo/warehouse-5.webp"));
});

test("removes the disposable starter preview and keeps production metadata", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /KiyoExperience/);
  assert.match(layout, /KIYO Living/);
  assert.match(layout, /\/og\.png/);
  assert.match(layout, /application\/ld\+json/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview", templateRoot)));
});

test("includes the approved KIYO production asset set", async () => {
  const requiredAssets = [
    "../public/images/kiyo/samantha-founder.webp",
    "../public/images/kiyo/product-overview.webp",
    "../public/images/kiyo/product-lock.webp",
    "../public/images/kiyo/corporate-gift-travel-amenities.webp",
    "../public/images/kiyo/corporate-gift-team-building.webp",
    "../public/images/kiyo/corporate-gift-mini-luggage.webp",
    "../public/images/kiyo/corporate-gift-notebook.webp",
    "../public/images/kiyo/umrah-custom.webp",
    "../public/images/kiyo/warehouse-5.webp",
  ];

  await Promise.all(requiredAssets.map((asset) => access(new URL(asset, import.meta.url))));
});

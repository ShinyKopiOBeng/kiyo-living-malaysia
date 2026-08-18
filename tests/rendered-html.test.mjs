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
  assert.match(html, /wa\.me\/60132767887/);
  assert.match(html, /shopee\.com\.my\/kiyoliving/);
  assert.match(html, /tiktok\.com\/@kiyoliving/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
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
    "../public/images/kiyo/product-hero.webp",
    "../public/images/kiyo/umrah-custom.webp",
    "../public/images/kiyo/warehouse-5.webp",
  ];

  await Promise.all(requiredAssets.map((asset) => access(new URL(asset, import.meta.url))));
});

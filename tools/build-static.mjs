/**
 * Assemble a plain static site from a vinext build, for hosts that serve files
 * rather than run a Cloudflare Worker (Vercel, GitHub Pages, S3, any CDN).
 *
 * `vinext build --prerender-all` leaves the pieces in two places:
 *   dist/client/                      assets, images, media - no HTML at all
 *   dist/server/prerendered-routes/   the HTML, flat, alongside .rsc payloads
 *
 * Neither is servable alone, and the HTML references `/assets/...` and
 * `/images/...` absolutely, so this merges them into one directory and gives
 * each route its own folder, which every static host resolves without needing
 * rewrite rules.
 *
 *   npm run build:static
 */
import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const CLIENT = "dist/client";
const PRERENDERED = "dist/server/prerendered-routes";
const OUT = "dist/static";

/** A route's HTML becomes <route>/index.html so `/terms` resolves anywhere. */
function destinationFor(file) {
  const route = file.replace(/\.html$/, "");
  if (route === "index") return "index.html";
  if (route === "404") return "404.html";
  return path.join(route, "index.html");
}

/* Standalone and inline: a 404 must render even when the asset it would link to
   is the thing that is missing. vinext emits a 9-byte "Not Found" body. */
const NOT_FOUND = `<!doctype html>
<html lang="en-MY">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page not found | KIYO Living</title>
<meta name="robots" content="noindex">
<style>
  :root { color-scheme: light }
  body {
    margin: 0; min-height: 100svh; display: grid; place-items: center;
    padding: 2rem; background: #f2f3ef; color: #081b2b;
    font-family: "Helvetica Neue", Arial, sans-serif; text-align: center;
  }
  main { max-width: 32rem }
  p.code {
    margin: 0 0 1rem; color: #b03520; font-size: .72rem;
    font-weight: 800; letter-spacing: .18em; text-transform: uppercase;
  }
  h1 {
    margin: 0; font-family: "Arial Narrow", "Roboto Condensed", "Helvetica Neue", Arial, sans-serif;
    font-size: clamp(2.75rem, 9vw, 4.5rem); font-weight: 700;
    letter-spacing: -.04em; line-height: .9; text-transform: uppercase;
  }
  h1 em { display: block; font-style: normal; color: #ee5a43 }
  p.lede { margin: 1.5rem 0 2rem; color: rgb(8 27 43 / .7); line-height: 1.65 }
  a {
    display: inline-flex; min-height: 3.35rem; align-items: center; gap: .7rem;
    padding: 0 1.75rem; background: #ee5a43; color: #081b2b;
    font-size: .78rem; font-weight: 800; letter-spacing: .08em;
    text-transform: uppercase; text-decoration: none;
  }
  a:hover { background: #081b2b; color: #fbfcfa }
</style>
</head>
<body>
  <main>
    <p class="code">Error 404</p>
    <h1><span>Page not</span><em>found</em></h1>
    <p class="lede">The page you were looking for has moved or no longer exists.</p>
    <a href="/">Back to KIYO</a>
  </main>
</body>
</html>
`;

async function main() {
  for (const required of [CLIENT, PRERENDERED]) {
    if (!existsSync(required)) {
      throw new Error(`${required} is missing. Run \`vinext build --prerender-all\` first.`);
    }
  }

  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  /* Assets first: the HTML links these absolutely. */
  await cp(CLIENT, OUT, { recursive: true });

  const routes = [];
  for (const file of await readdir(PRERENDERED)) {
    if (!file.endsWith(".html")) continue;
    if (file === "404.html") continue;
    const destination = destinationFor(file);
    const target = path.join(OUT, destination);
    await mkdir(path.dirname(target), { recursive: true });
    await cp(path.join(PRERENDERED, file), target);
    routes.push({ route: file === "index.html" ? "/" : `/${file.replace(/\.html$/, "")}`, destination });
  }

  await writeFile(path.join(OUT, "404.html"), NOT_FOUND, "utf8");

  /* The .rsc payloads let client-side navigation avoid a full document fetch.
     They sit next to their route so relative resolution still works. */
  for (const file of await readdir(PRERENDERED)) {
    if (!file.endsWith(".rsc")) continue;
    await cp(path.join(PRERENDERED, file), path.join(OUT, file));
  }

  /* `_headers` is a Cloudflare and Netlify convention; caching on other hosts
     comes from vercel.json, so shipping it would only mislead. */
  await rm(path.join(OUT, "_headers"), { force: true });

  let bytes = 0;
  let files = 0;
  const walk = async (dir) => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else { files += 1; bytes += (await stat(full)).size; }
    }
  };
  await walk(OUT);

  console.log(`static site -> ${OUT}`);
  for (const { route, destination } of routes.sort((a, b) => a.route.localeCompare(b.route))) {
    const size = Math.round((await readFile(path.join(OUT, destination))).length / 1024);
    console.log(`  ${route.padEnd(20)} ${destination.padEnd(28)} ${size} KB`);
  }
  console.log(`  ${"/404".padEnd(20)} ${"404.html".padEnd(28)} ${Math.round(NOT_FOUND.length / 1024)} KB`);
  console.log(`\n${files} files, ${(bytes / 1024 / 1024).toFixed(1)} MB`);
}

await main();

/**
 * Self-host the two web fonts the design uses.
 *
 * `app/fonts.ts` declares Work Sans and Montserrat through `next/font/google`,
 * which downloads them into `.vinext/fonts`. The Vinext build then never emits
 * the `@font-face` rules or the CSS variable class that go with them, so every
 * heading silently fell back to a system face. Rather than depend on that
 * integration, this copies the same faces into `public/fonts` and writes plain
 * `@font-face` rules any host can serve.
 *
 * A family that is not in the cache yet (the cache is only filled by a build
 * that ran with network access) is fetched straight from the Google Fonts CSS
 * endpoint instead, with a browser user agent so it answers with woff2.
 *
 * The families and weights here must stay in step with `app/fonts.ts`.
 *
 * Only the latin and latin-ext subsets are kept: the site is English and Malay,
 * and shipping Cyrillic and Vietnamese would triple the font payload for
 * nothing.
 *
 *   node tools/build-fonts.mjs
 */

import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename } from "node:path";

const CACHE = new URL("../.vinext/fonts/", import.meta.url);
const PUBLIC = new URL("../public/fonts/", import.meta.url);
const OUT = new URL("../app/fonts.css", import.meta.url);

/* The brand guide names Work Sans for display and "Gontserrat" for body copy.
   Gontserrat is a Montserrat derivative that is not on Google Fonts, so
   Montserrat carries the body until KIYO supplies the files. */
const WANTED = [
  { prefix: "work-sans-", family: "Work Sans", weights: ["500", "600"] },
  { prefix: "montserrat-", family: "Montserrat", weights: ["400", "500", "600", "700"] },
];

const KEEP_SUBSETS = ["latin", "latin-ext"];

/* Google only answers with woff2 to a browser it recognises. */
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

/** Split a style.css into `{ subset, block }` pairs. */
function faces(css) {
  const out = [];
  const pattern = /\/\*\s*([a-z-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g;
  let match;
  while ((match = pattern.exec(css)) !== null) out.push({ subset: match[1], block: match[2] });
  return out;
}

const read = (block, property) => new RegExp(`${property}:\\s*([^;]+);`).exec(block)?.[1].trim();

const slug = (family) => family.toLowerCase().replace(/\s+/g, "-");

await mkdir(PUBLIC, { recursive: true });

let directories = [];
try {
  directories = await readdir(CACHE);
} catch {
  directories = [];
}

/* One entry per shipped file. A variable font answers every weight with the
   same file, and those collapse into one rule with a weight range. */
const entries = new Map();

for (const { prefix, family, weights } of WANTED) {
  const directory = directories.find((entry) => entry.startsWith(prefix));

  let css;
  let fetchFile;
  if (directory) {
    css = await readFile(new URL(`${directory}/style.css`, CACHE), "utf8");
    fetchFile = async (source) => {
      const file = basename(source);
      await copyFile(new URL(`${directory}/${file}`, CACHE), new URL(file, PUBLIC));
      return file;
    };
  } else {
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, "+")}:wght@${weights.join(";")}&display=swap`;
    const response = await fetch(url, { headers: { "user-agent": BROWSER_UA } });
    if (!response.ok) throw new Error(`Google Fonts answered ${response.status} for ${family}`);
    css = await response.text();
    fetchFile = async (source, weight, subset) => {
      /* Google serves one variable file for every requested weight, so the
         name carries the subset and the hash, not the weight. */
      const hash = basename(source).replace(/\.woff2$/, "").slice(-8).toLowerCase();
      const file = `${slug(family)}-${subset}-${hash}.woff2`;
      const body = await fetch(source, { headers: { "user-agent": BROWSER_UA } });
      if (!body.ok) throw new Error(`Could not download ${source}`);
      await writeFile(new URL(file, PUBLIC), Buffer.from(await body.arrayBuffer()));
      return file;
    };
  }

  for (const { subset, block } of faces(css)) {
    if (!KEEP_SUBSETS.includes(subset)) continue;

    const weight = read(block, "font-weight");
    if (!weight || !weights.includes(weight)) continue;

    const source = /url\(([^)]+)\)/.exec(block)?.[1]?.replace(/^['"]|['"]$/g, "");
    if (!source) continue;
    const file = await fetchFile(source, weight, subset);

    const key = `${family}|${subset}|${file}`;
    const entry = entries.get(key) ?? { family, subset, file, weights: [], range: read(block, "unicode-range") };
    entry.weights.push(Number(weight));
    entries.set(key, entry);
  }
}

const rules = [...entries.values()].map(({ family, subset, file, weights, range }) => {
  const lo = Math.min(...weights);
  const hi = Math.max(...weights);
  const weight = lo === hi ? `${lo}` : `${lo} ${hi}`;
  return [
    `/* ${family} ${weight}, ${subset} */`,
    "@font-face {",
    `  font-family: "${family}";`,
    "  font-style: normal;",
    `  font-weight: ${weight};`,
    "  font-display: swap;",
    `  src: url("/fonts/${file}") format("woff2");`,
    `  unicode-range: ${range};`,
    "}",
  ].join("\n");
});

const header = [
  "/* Generated by tools/build-fonts.mjs. Do not edit by hand. */",
  "/* Faces are served from public/fonts, so no third-party request is made at",
  "   runtime and the build needs no network access. */",
  "",
].join("\n");

await writeFile(OUT, `${header}${rules.join("\n\n")}\n`);
console.log(`wrote ${rules.length} @font-face rules to app/fonts.css`);

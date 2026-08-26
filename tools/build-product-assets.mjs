/**
 * One-shot normaliser for the ProductView source shots.
 *
 * The source PNGs are 1254x1254 with transparent surrounds, but each product
 * sits at a different height in its frame (base anywhere from 77% to 98%), so
 * dropping them into a row would leave ten products floating at ten heights.
 * This pins every product's base to one floor line without touching its scale,
 * then encodes to WebP and writes the catalogue the carousel reads.
 *
 *   node tools/build-product-assets.mjs [--source <dir>]
 */
import sharp from "sharp";
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const sourceFlag = args.indexOf("--source");
const SOURCE = sourceFlag === -1 ? "C:/Users/Admin/Downloads/ProductView" : args[sourceFlag + 1];
const OUT_DIR = "public/images/kiyo/products";
const CATALOGUE = "app/components/productCatalogue.ts";

const CANVAS = 1254;
const OUTPUT = 860;
/* Every product's base lands here. The tallest source bounding box is 1212px,
   which still clears the top of the canvas at this line. */
const BASELINE = Math.round(CANVAS * 0.985);
const ALPHA_FLOOR = 24;

/** Silver, black, white, then neutrals, then chromatics. */
const COLOUR_RANK = [
  "silver", "black", "white", "grey", "beige",
  "blue", "cyan", "green", "darkgreen", "purple", "pink", "orange",
];

const COLOUR_LABELS = {
  darkgreen: "Dark Green",
};

/** Folder name -> slug, display name, and the order it appears in the row. */
const PRODUCTS = [
  { folder: "Premium Series 2", slug: "premium-aluminium-set", name: "Premium Aluminium Set", blurb: "Two-piece set with a front-opening cabin case" },
  { folder: "Full Spec", slug: "full-spec-aluminium-frame", name: "Full Spec Aluminium Frame", blurb: "Aluminium frame, corner guards and TSA lock" },
  { folder: "luggage4", slug: "sunburst-hardshell", name: "Sunburst Hardshell", blurb: "Radiating fan-pleat shell with the KIYO badge" },
  { folder: "luggage2", slug: "front-pocket-cabin", name: "Front Pocket Cabin", blurb: "Full-width zipped laptop pocket" },
  { folder: "luggage3", slug: "top-access-cabin", name: "Top Access Cabin", blurb: "Separate upper compartment for quick access" },
  { folder: "Mini", slug: "mini-hard-case", name: "Mini Hard Case", blurb: "Top-handle vanity case with aluminium corners" },
  { folder: "Business Bagpack", slug: "business-backpack", name: "Business Backpack", blurb: "Structured commuter backpack" },
  { folder: "backpack1", slug: "flap-commuter-backpack", name: "Flap Commuter Backpack", blurb: "Flap-over front with a leather pull tag" },
  { folder: "Laptop Bag", slug: "slim-laptop-brief", name: "Slim Laptop Brief", blurb: "Slim zip-top brief with rolled handles" },
  { folder: "Travel Bag", slug: "weekender-duffel", name: "Weekender Duffel", blurb: "Wide duffel with a detachable shoulder strap" },
];

function colourRank(colour) {
  const index = COLOUR_RANK.indexOf(colour);
  return index === -1 ? COLOUR_RANK.length : index;
}

function colourLabel(colour) {
  return COLOUR_LABELS[colour] ?? colour.charAt(0).toUpperCase() + colour.slice(1);
}

/** Split "DarkGreen45.png" / "blackfront.png" into { colour, view }. */
function parseSourceName(file) {
  const base = file.replace(/\.png$/i, "");
  const angle = /45$/i.test(base);
  const colour = base.replace(/(45|front)$/i, "").toLowerCase();
  return { colour, view: angle ? "angle" : "front" };
}

async function alphaBounds(image, width, height) {
  const { data } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let minX = width, maxX = -1, minY = height, maxY = -1;
  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) {
      if (data[(row + x) * 4 + 3] <= ALPHA_FLOOR) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX < 0) throw new Error("image is fully transparent");
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

/** Median body colour, sampled away from handles, wheels and the drop shadow. */
async function bodyColour(file, box) {
  const x0 = Math.round(box.left + box.width * 0.3);
  const y0 = Math.round(box.top + box.height * 0.35);
  const w = Math.max(1, Math.round(box.width * 0.4));
  const h = Math.max(1, Math.round(box.height * 0.3));
  const { data, info } = await sharp(file)
    .extract({ left: x0, top: y0, width: w, height: h })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = [[], [], []];
  for (let i = 0; i < data.length; i += info.channels * 2) {
    if (data[i + 3] < 200) continue;
    channels[0].push(data[i]);
    channels[1].push(data[i + 1]);
    channels[2].push(data[i + 2]);
  }
  const median = (values) => {
    if (!values.length) return 255;
    values.sort((a, b) => a - b);
    return values[values.length >> 1];
  };
  return `#${channels.map((c) => median(c).toString(16).padStart(2, "0")).join("")}`;
}

async function normalise(file, destination) {
  const source = sharp(file);
  const { width, height } = await source.metadata();
  const box = await alphaBounds(sharp(file), width, height);

  const subject = await sharp(file).extract(box).png().toBuffer();
  const top = BASELINE - box.height;
  if (top < 0) throw new Error(`${file}: subject is taller than the baseline allows`);

  /* Two passes on purpose: sharp runs resize before composite within a single
     pipeline, which would shrink the canvas out from under the subject. */
  const placed = await sharp({
    create: { width: CANVAS, height: CANVAS, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: subject, left: Math.round((CANVAS - box.width) / 2), top }])
    .png()
    .toBuffer();

  await sharp(placed)
    .resize(OUTPUT, OUTPUT)
    .webp({ quality: 80, alphaQuality: 90, effort: 5 })
    .toFile(destination);

  return box;
}

async function main() {
  if (!existsSync(SOURCE)) throw new Error(`source folder not found: ${SOURCE}`);
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const catalogue = [];
  let written = 0;
  let bytes = 0;

  for (const product of PRODUCTS) {
    const dir = path.join(SOURCE, product.folder);
    if (!existsSync(dir)) throw new Error(`missing product folder: ${dir}`);
    await mkdir(path.join(OUT_DIR, product.slug), { recursive: true });

    const grouped = new Map();
    for (const file of await readdir(dir)) {
      if (!/\.png$/i.test(file)) continue;
      const { colour, view } = parseSourceName(file);
      if (!grouped.has(colour)) grouped.set(colour, {});
      grouped.get(colour)[view] = path.join(dir, file);
    }

    const colours = [];
    for (const [colour, views] of grouped) {
      if (!views.front || !views.angle) {
        throw new Error(`${product.folder}/${colour}: needs both a front and a 45 view`);
      }
      const box = await normalise(views.front, path.join(OUT_DIR, product.slug, `${colour}-front.webp`));
      await normalise(views.angle, path.join(OUT_DIR, product.slug, `${colour}-angle.webp`));
      written += 2;
      for (const view of ["front", "angle"]) {
        bytes += statSync(path.join(OUT_DIR, product.slug, `${colour}-${view}.webp`)).size;
      }
      colours.push({ id: colour, label: colourLabel(colour), swatch: await bodyColour(views.front, box) });
    }

    colours.sort((a, b) => colourRank(a.id) - colourRank(b.id) || a.id.localeCompare(b.id));
    catalogue.push({ ...product, colours });
    console.log(`${product.slug.padEnd(28)} ${colours.length} colours, leads on ${colours[0].label}`);
  }

  const file = `/* Generated by tools/build-product-assets.mjs. Do not edit by hand. */

export type ProductColour = {
  id: string;
  label: string;
  swatch: string;
};

export type CarouselProduct = {
  slug: string;
  name: string;
  blurb: string;
  colours: ProductColour[];
};

/* Colours are pre-sorted: silver, black, white, then neutrals and chromatics.
   The first entry is the colour a product shows at rest. */
export const carouselProducts: CarouselProduct[] = ${JSON.stringify(
    catalogue.map(({ slug, name, blurb, colours }) => ({ slug, name, blurb, colours })),
    null,
    2,
  )};

export function productImage(slug: string, colour: string, view: "front" | "angle") {
  return \`/images/kiyo/products/\${slug}/\${colour}-\${view}.webp\`;
}
`;

  await writeFile(CATALOGUE, file, "utf8");
  console.log(`\n${written} images, ${(bytes / 1024 / 1024).toFixed(1)} MB total`);
  console.log(`catalogue -> ${CATALOGUE}`);
}

await main();

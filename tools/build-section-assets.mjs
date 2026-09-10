/**
 * Turn the approved SectionAssets delivery into the shipped WebP set.
 *
 * The source folder holds one directory per page chapter, at 1200-3200px and
 * 1-2.7MB each. Serving those directly would push the page past 40MB, so every
 * plate is resized to the largest size its slot can actually use and encoded as
 * WebP. Transparency is preserved wherever the source has it: the client marks,
 * Samantha's cut-out, the branded case and the network map all rely on it.
 *
 * The tool also writes `app/components/sectionAssets.ts` so the real pixel
 * dimensions travel with the file. Alt text is deliberately NOT generated here:
 * it is authored by hand in `imageSlots.ts`, where it can describe the picture
 * rather than repeat a filename.
 *
 *   node tools/build-section-assets.mjs [--source <folder>]
 */

import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const args = process.argv.slice(2);
const sourceArg = args.indexOf("--source");
const SOURCE = sourceArg === -1 ? "C:/Users/Admin/Downloads/SectionAssets" : args[sourceArg + 1];

const PUBLIC_DIR = new URL("../public/images/kiyo/sections/", import.meta.url);
const MANIFEST = new URL("../app/components/sectionAssets.ts", import.meta.url);
const PUBLIC_PREFIX = "/images/kiyo/sections";

/**
 * Every plate the page uses, in the order the chapter shows them.
 *
 * Sections 4, 6 and 7 arrived with opaque `ChatGPT Image ...(n).png` names, so
 * they are taken in their numeric export order. If a set or a pipeline stage
 * ever looks out of place, swap the two entries here and re-run: nothing else
 * refers to the source filenames.
 */
const PLATES = [
  /* 01  Hero ------------------------------------------------------------- */
  { id: "heroAirport", from: "Section1/airport.png", width: 1920 },

  /* 02  Warehouse scale --------------------------------------------------- */
  { id: "warehouseTruck", from: "Section2/warehouseTruck.png", width: 1920 },

  /* 03  UMRAH ------------------------------------------------------------- */
  { id: "umrahBanner", from: "Section3/UmrahBanner.png", width: 1600 },
  { id: "umrahSet1", from: "Section3/ChatGPT Image Sep 8, 2026, 11_03_53 AM (2).png", width: 1100 },
  { id: "umrahSet2", from: "Section3/ChatGPT Image Sep 8, 2026, 11_03_54 AM (3).png", width: 1100 },
  { id: "umrahSet3", from: "Section3/ChatGPT Image Sep 8, 2026, 11_03_55 AM (4).png", width: 1100 },
  { id: "umrahSet4", from: "Section3/ChatGPT Image Sep 8, 2026, 11_03_55 AM (5).png", width: 1100 },

  /* 04  Corporate --------------------------------------------------------- */
  { id: "corporateBanner", from: "Section4/CorporateBanner.png", width: 1600 },
  { id: "corporateSet1", from: "Section4/ChatGPT Image Aug 18, 2026, 10_03_00 PM (1).png", width: 1100 },
  { id: "corporateSet2", from: "Section4/ChatGPT Image Aug 18, 2026, 10_03_00 PM (2).png", width: 1100 },
  { id: "corporateSet3", from: "Section4/ChatGPT Image Aug 18, 2026, 10_03_00 PM (3).png", width: 1100 },
  { id: "corporateSet4", from: "Section4/ChatGPT Image Aug 18, 2026, 10_03_01 PM (4).png", width: 1100 },

  /* 06  Customise --------------------------------------------------------- */
  /* The case is shown as a close crop, because the visitor's own name is
     engraved on the plate and the full-length shot rendered it a few pixels
     tall. Trimmed to its opaque bounds: the plate is placed as a percentage of
     the picture, so transparent margin around it would move the engraving. */
  { id: "brandCaseZoom", from: "Section6/luggageLogoZoom.png", width: 1000, alpha: true, trim: true },
  /* Four plates for four customisation options. The photographs now live
     inside the controls they illustrate, so there is no fifth. */
  { id: "brandDetail1", from: "Section6/ChatGPT Image Sep 8, 2026, 11_21_25 AM (2).png", width: 900 },
  { id: "brandDetail2", from: "Section6/ChatGPT Image Sep 8, 2026, 11_21_25 AM (3).png", width: 900 },
  { id: "brandDetail3", from: "Section6/ChatGPT Image Sep 8, 2026, 11_21_26 AM (4).png", width: 900 },
  { id: "brandDetail4", from: "Section6/ChatGPT Image Sep 8, 2026, 11_21_26 AM (5).png", width: 900 },

  /* 07  Delivery pipeline -------------------------------------------------- */
  { id: "pipeline1", from: "Section7/ChatGPT Image Sep 8, 2026, 11_34_23 AM (1).png", width: 800 },
  { id: "pipeline2", from: "Section7/ChatGPT Image Sep 8, 2026, 11_34_24 AM (2).png", width: 800 },
  { id: "pipeline3", from: "Section7/ChatGPT Image Sep 8, 2026, 11_34_24 AM (3).png", width: 800 },
  { id: "pipeline4", from: "Section7/ChatGPT Image Sep 8, 2026, 11_34_25 AM (4).png", width: 800 },
  { id: "pipeline5", from: "Section7/ChatGPT Image Sep 8, 2026, 11_34_25 AM (5).png", width: 800 },
  { id: "pipeline6", from: "Section7/ChatGPT Image Sep 8, 2026, 11_34_26 AM (6).png", width: 800 },

  /* 08  Clients, video and partner stories --------------------------------- */
  { id: "clientVideo", from: "Section8/trust-visuals/section-8-main-video-thumbnail.png", width: 1400 },
  { id: "partnerCorporate", from: "Section8/trust-visuals/partner-story-corporate-handover.png", width: 800 },
  { id: "partnerUmrah", from: "Section8/trust-visuals/partner-story-umrah-agency.png", width: 800 },
  { id: "partnerWarehouse", from: "Section8/trust-visuals/partner-story-warehouse-fulfilment.png", width: 800 },

  /* 09  Samantha and recognition ------------------------------------------- */
  /* One plate, not three layers.
     Samantha, the room and all fourteen trophies are composited in the source,
     so nothing has to be re-registered against a shelf line at runtime and
     nothing can slide off a shelf at odd browser zoom. The file carries an
     alpha channel but not one transparent pixel, so it flattens like any other
     photograph. */
  { id: "aboutBand", from: "Section9/section-9-samantha-awards-bookshelf-combined.png", width: 1920 },

  /* 10  Nationwide reach ---------------------------------------------------- */
  { id: "reachMapFallback", from: "Section10/section-10-malaysia-network-map-transparent-hd.png", width: 1600, alpha: true },
];

/* The client marks are one job with one treatment, so they are handled apart
   from the plates: trimmed to their ink and dropped onto a common box. */
const LOGO_DIR = "Section8/client-logos";
const LOGO_BOX = { width: 480, height: 240 };

/* The fourteen trophies again, one file each and cut out. The band above
   already shows them standing on the shelf; these are what the dialog
   enlarges, so they are trimmed to the trophy and sized for half a dialog. */
const AWARD_DIR = "Section9/awards";
/* Two sizes, because the two jobs are two orders of magnitude apart. The
   dialog shows a trophy about 380px tall. The award wall lays one over each
   trophy standing in the band, where it renders about 110px tall, and
   fourteen dialog-sized files would be a megabyte of pictures nobody sees at
   that size. */
const AWARD_WIDTH = 600;
const AWARD_SMALL_WIDTH = 260;

/* Copied through untouched. It is already 915x400 in the brand palette, and it
   carries the CC BY 3.0 credit for the base map inside its <desc>. */
const REACH_MAP_SVG = "Section10/section-10-malaysia-network-map.svg";

const camel = (value) => value.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());

await mkdir(PUBLIC_DIR, { recursive: true });
await mkdir(new URL("logos/", PUBLIC_DIR), { recursive: true });
await mkdir(new URL("awards/", PUBLIC_DIR), { recursive: true });
await mkdir(new URL("awards/small/", PUBLIC_DIR), { recursive: true });

const manifest = [];

for (const plate of PLATES) {
  const input = join(SOURCE, plate.from);
  try {
    await access(input);
  } catch {
    throw new Error(`Missing source asset: ${plate.from}`);
  }

  const meta = await sharp(input).metadata();
  /* Never upscale: the delivered file is the ceiling. */
  const width = Math.min(plate.width, meta.width);

  let pipeline = sharp(input);
  /* Trimmed plates are positioned by their content edges, so the transparent
     margin the export left around them has to go before the resize. */
  if (plate.trim) pipeline = pipeline.trim({ threshold: 1 });
  pipeline = pipeline.resize({ width, withoutEnlargement: true });
  if (!plate.alpha) pipeline = pipeline.flatten({ background: "#ffffff" });

  const file = `${plate.id}.webp`;
  const info = await pipeline
    .webp({ quality: plate.alpha ? 88 : 82, effort: 5, alphaQuality: 100 })
    .toFile(new URL(file, PUBLIC_DIR).pathname.replace(/^\//, ""));

  manifest.push({ id: plate.id, src: `${PUBLIC_PREFIX}/${file}`, width: info.width, height: info.height });
  console.log(`${plate.id.padEnd(20)} ${meta.width}x${meta.height} -> ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`);
}

/* --- Client marks -------------------------------------------------------- */

const logos = (await readdir(join(SOURCE, LOGO_DIR))).filter((f) => f.endsWith(".png")).sort();
const logoEntries = [];

for (const file of logos) {
  const id = camel(`clientLogo-${file.replace(/^\d+-/, "").replace(/-hd\.png$/, "")}`);
  const out = `logos/${file.replace(/-hd\.png$/, ".webp")}`;

  /* The marks arrive on a 1600x800 canvas with different amounts of air around
     them, which makes them read as different sizes in the wall. Trimming to the
     ink and re-fitting one box gives the row a single optical weight. */
  const info = await sharp(join(SOURCE, LOGO_DIR, file))
    .trim({ threshold: 1 })
    .resize({ ...LOGO_BOX, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 90, alphaQuality: 100, effort: 5 })
    .toFile(new URL(out, PUBLIC_DIR).pathname.replace(/^\//, ""));

  logoEntries.push({ id, src: `${PUBLIC_PREFIX}/${out}`, width: info.width, height: info.height, file });
}

console.log(`client marks         ${logoEntries.length} trimmed to ${LOGO_BOX.width}x${LOGO_BOX.height}`);

/* --- The recognition cut-outs -------------------------------------------- */

const awardFiles = (await readdir(join(SOURCE, AWARD_DIR))).filter((f) => f.endsWith(".png")).sort();
const awardEntries = [];
const awardSmallEntries = [];

for (const file of awardFiles) {
  const name = file.replace(/[.]png$/, ".webp");
  const id = camel(file.replace(/^[0-9]+-/, "").replace(/[.]png$/, ""));
  /* Trimmed once, so both sizes describe exactly the same box. The award wall
     positions the cut-out against a trophy measured in the band, and a
     different trim between the two sizes would put them out of register. */
  const trimmed = await sharp(join(SOURCE, AWARD_DIR, file)).trim({ threshold: 1 }).png().toBuffer();

  for (const [dir, width, into] of [["awards/", AWARD_WIDTH, awardEntries], ["awards/small/", AWARD_SMALL_WIDTH, awardSmallEntries]]) {
    const out = dir + name;
    const info = await sharp(trimmed)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 88, alphaQuality: 100, effort: 5 })
      .toFile(new URL(out, PUBLIC_DIR).pathname.replace(/^[/]/, ""));

    into.push({ id, src: `${PUBLIC_PREFIX}/${out}`, width: info.width, height: info.height });
  }
}

console.log(`award cut-outs       ${awardEntries.length} at ${AWARD_WIDTH}px and ${AWARD_SMALL_WIDTH}px`);

/* --- The network map ships as vector ------------------------------------- */

const svg = await readFile(join(SOURCE, REACH_MAP_SVG), "utf8");
if (!/CC BY/i.test(svg)) {
  throw new Error("The network map lost its licence credit. Do not ship it without one.");
}
await writeFile(new URL("reachMap.svg", PUBLIC_DIR), svg);
console.log(`reachMap             vector, credit preserved`);

/* --- Manifest ------------------------------------------------------------ */

const body = [
  "/* Generated by tools/build-section-assets.mjs. Do not edit by hand. */",
  "/* Alt text is NOT here on purpose: it is authored in imageSlots.ts, where it",
  "   can describe the picture rather than repeat a filename. */",
  "",
  "export type SectionAsset = { src: string; width: number; height: number };",
  "",
  "export const sectionAssets = {",
  ...manifest.map((a) => `  ${a.id}: { src: "${a.src}", width: ${a.width}, height: ${a.height} },`),
  "} satisfies Record<string, SectionAsset>;",
  "",
  "/** The client marks, in the order the wall shows them. */",
  "export const clientLogoAssets: (SectionAsset & { id: string })[] = [",
  ...logoEntries.map((a) => `  { id: "${a.id}", src: "${a.src}", width: ${a.width}, height: ${a.height} },`),
  "];",
  "",
  "/** The recognition cut-outs, in shelf order: the upper shelf first. */",
  "export const awardAssets: (SectionAsset & { id: string })[] = [",
  ...awardEntries.map((a) => `  { id: "${a.id}", src: "${a.src}", width: ${a.width}, height: ${a.height} },`),
  "];",
  "",
  "/** The same cut-outs at wall size, laid over the trophies in the band. */",
  "export const awardSmallAssets: (SectionAsset & { id: string })[] = [",
  ...awardSmallEntries.map((a) => `  { id: "${a.id}", src: "${a.src}", width: ${a.width}, height: ${a.height} },`),
  "];",
  "",
  `export const reachMapSvg = "${PUBLIC_PREFIX}/reachMap.svg";`,
  "",
].join("\n");

await writeFile(MANIFEST, body);
console.log(`\nwrote app/components/sectionAssets.ts (${manifest.length} plates, ${logoEntries.length} marks, ${awardEntries.length} awards)`);

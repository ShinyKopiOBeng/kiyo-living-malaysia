/**
 * Turn the approved photography into the shipped WebP set.
 *
 * Three deliveries feed the page. The older `SectionAssets` folder (one
 * directory per chapter) still supplies the customisation close-ups, the
 * approval mockup, the Samantha band and the twelve client marks. The
 * `07_Website` Google Drive folder supplies everything V15 added: the home
 * hero, the six chapter openers, the twelve gift sets and the three warehouse
 * panels. `KIYO-Clients-Picks` holds the six handover photographs chosen out of
 * KIYO's client archive. Nothing is served directly: every plate is resized to
 * the largest size its slot can use and encoded as WebP.
 *
 * The tool also writes `app/components/sectionAssets.ts` so the real pixel
 * dimensions travel with the file, and it deletes anything in the output folder
 * it did not write, so a retired plate cannot linger in the deploy. Alt text is
 * deliberately NOT generated here: it is authored by hand in `imageSlots.ts`,
 * where it can describe the picture rather than repeat a filename.
 *
 *   node tools/build-section-assets.mjs [--source <SectionAssets>] [--drive <07_Website>] [--clients <KIYO-Clients-Picks>]
 */

import { access, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(name);
  return at === -1 ? fallback : args[at + 1];
};
const SOURCE = flag("--source", "C:/Users/Admin/Downloads/SectionAssets");
const DRIVE = flag("--drive", "C:/Users/Admin/Downloads/KIYO-07_Website");
const CLIENTS = flag("--clients", "C:/Users/Admin/Downloads/KIYO-Clients-Picks");
const ROOTS = { source: SOURCE, drive: DRIVE, clients: CLIENTS };

const PUBLIC_DIR = new URL("../public/images/kiyo/sections/", import.meta.url);
const MANIFEST = new URL("../app/components/sectionAssets.ts", import.meta.url);
const PUBLIC_PREFIX = "/images/kiyo/sections";

const UMRAH = "KIYO-6-Umrah-Gift-Sets-v2";
const CORPORATE = "KIYO-6-Corporate-Gift-Sets";

/**
 * Every plate the page uses, in the order the chapters show them.
 *
 * `root` says which delivery a plate comes from. The Drive files keep the
 * names they were uploaded with, opaque `ChatGPT Image ...` names included; if
 * a picture ever looks out of place, swap the entry here and re-run, because
 * nothing else refers to the source filenames.
 */
const PLATES = [
  /* 01  Hero ------------------------------------------------------------- */
  { id: "heroHome", root: "drive", from: "hero-home-kiyo-plates.png", width: 1920 },

  /* 02  Warehouse band ---------------------------------------------------- */
  /* The building, the open bay and the lorry at dusk, from the Drive folder;
     replaced the older SectionAssets plate in V16 at Kean's choice. */
  { id: "warehouseTruck", root: "drive", from: "ChatGPT Image Sep 14, 2026, 12_45_27 PM.png", width: 1920 },

  /* 03  UMRAH ------------------------------------------------------------- */
  { id: "umrahOpener", root: "drive", from: "ChatGPT Image Sep 14, 2026, 12_46_21 PM.png", width: 1920 },
  { id: "umrahSet1", root: "drive", from: `${UMRAH}/01-navy-heritage.png`, width: 1200 },
  { id: "umrahSet2", root: "drive", from: `${UMRAH}/02-emerald-womens-telekung-set.png`, width: 1200 },
  { id: "umrahSet3", root: "drive", from: `${UMRAH}/03-desert-terracotta.png`, width: 1200 },
  { id: "umrahSet4", root: "drive", from: `${UMRAH}/04-dusty-rose-comfort.png`, width: 1200 },
  { id: "umrahSet5", root: "drive", from: `${UMRAH}/05-charcoal-teal-executive.png`, width: 1200 },
  { id: "umrahSet6", root: "drive", from: `${UMRAH}/06-sapphire-mens-ihram-set.png`, width: 1200 },

  /* 04  Corporate --------------------------------------------------------- */
  { id: "corporateOpener", root: "drive", from: "ChatGPT Image Sep 14, 2026, 12_46_09 PM.png", width: 1920 },
  { id: "corporateSet1", root: "drive", from: `${CORPORATE}/01-travel-comfort.png`, width: 1100 },
  { id: "corporateSet2", root: "drive", from: `${CORPORATE}/02-outdoor-team-retreat.png`, width: 1100 },
  { id: "corporateSet3", root: "drive", from: `${CORPORATE}/03-executive-desk.png`, width: 1100 },
  { id: "corporateSet4", root: "drive", from: `${CORPORATE}/04-tech-productivity.png`, width: 1100 },
  { id: "corporateSet5", root: "drive", from: `${CORPORATE}/05-apparel-welcome.png`, width: 1100 },
  /* Re-supplied square after the Drive copy arrived truncated; the card crops
     it to 4:3 like the other five. */
  { id: "corporateSet6", root: "drive", from: `${CORPORATE}/06-coffee-wellness.png`, width: 1100 },

  /* 05  Step 01, Choose --------------------------------------------------- */
  { id: "chooseOpener", root: "drive", from: "your-idea-your-budget-our-recommendation.png", width: 1920 },

  /* 06  Step 02, Personalise ---------------------------------------------- */
  { id: "personaliseOpener", root: "drive", from: "ChatGPT Image Sep 14, 2026, 02_47_23 PM.png", width: 1920 },
  { id: "brandDetail1", root: "source", from: "Section6/ChatGPT Image Sep 8, 2026, 11_21_25 AM (2).png", width: 1000 },
  { id: "brandDetail2", root: "source", from: "Section6/ChatGPT Image Sep 8, 2026, 11_21_25 AM (3).png", width: 700 },
  { id: "brandDetail3", root: "source", from: "Section6/ChatGPT Image Sep 8, 2026, 11_21_26 AM (4).png", width: 700 },
  { id: "brandDetail4", root: "source", from: "Section6/ChatGPT Image Sep 8, 2026, 11_21_26 AM (5).png", width: 700 },
  { id: "brandMockup", root: "source", from: "Section7/ChatGPT Image Sep 8, 2026, 11_34_24 AM (2).png", width: 900 },

  /* 07  Step 03, Deliver -------------------------------------------------- */
  { id: "deliverOpener", root: "drive", from: "store-and-deliver-on-request.png", width: 1920 },
  /* Kean's 2026-09-18 replacement: the same scene with the KIYO mark on the
     boxes and the lorry, copied into the Drive folder from Downloads. */
  { id: "deliverShip", root: "drive", from: "deliver-to-you-kiyo-logo.png", width: 1400 },
  { id: "deliverStore", root: "drive", from: "ChatGPT Image May 12, 2026, 12_50_49 PM (1).png", width: 1600 },
  { id: "deliverCollect", root: "drive", from: "warehouse (6).png", width: 1600 },

  /* 09  Clients ------------------------------------------------------------ */
  { id: "clientsOpener", root: "drive", from: "real-clients-real-experiences.png", width: 1920 },
  /* Twelve handovers out of KIYO's own client archive. Phone photographs, so
     the ceiling is what they were shot at; the masonry shows them at most
     about 330px wide, so 900 is plenty for a portrait and 1280 for a
     landscape. */
  { id: "clientHejira", root: "clients", from: "hejira-family-airport.jpg", width: 1024 },
  { id: "clientIrkaz", root: "clients", from: "irkaz-jemaah-klia.jpg", width: 1280 },
  { id: "clientPtptn", root: "clients", from: "ptptn-handover.jpg", width: 720 },
  { id: "clientManazel", root: "clients", from: "manazel-mashaer-team.jpg", width: 1400 },
  { id: "clientKoperasiTnb", root: "clients", from: "koperasi-tnb-team.jpg", width: 900 },
  { id: "clientBulkOrder", root: "clients", from: "branded-bulk-order.jpg", width: 1280 },
  { id: "clientAlWaqar", root: "clients", from: "al-waqar-stock-delivered.jpg", width: 900 },
  { id: "clientHrm", root: "clients", from: "hrm-team-office.jpg", width: 1280 },
  { id: "clientOpening", root: "clients", from: "grand-opening-guests.jpg", width: 810 },
  { id: "clientContainer", root: "clients", from: "container-unloading.jpg", width: 1280 },
  { id: "clientPresentationWarehouse", root: "clients", from: "presentation-warehouse.jpg", width: 900 },
  { id: "clientPresentationSamples", root: "clients", from: "presentation-sample-cases.jpg", width: 900 },

  /* 10  Samantha and Awards ------------------------------------------------ */
  /* One plate: Samantha, the room and the trophies are composited in the
     source, so nothing is laid over it at runtime any more. */
  { id: "aboutBand", root: "source", from: "Section9/section-9-samantha-awards-bookshelf-combined.png", width: 1920 },
];

/* The client marks are one job with one treatment, so they are handled apart
   from the plates: trimmed to their ink and dropped onto a common box. */
const LOGO_DIR = "Section8/client-logos";
const LOGO_BOX = { width: 480, height: 240 };

const camel = (value) => value.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
const outPath = (file) => new URL(file, PUBLIC_DIR).pathname.replace(/^\//, "");

await mkdir(PUBLIC_DIR, { recursive: true });
await mkdir(new URL("logos/", PUBLIC_DIR), { recursive: true });

const written = new Set();
const manifest = [];

for (const plate of PLATES) {
  const input = join(ROOTS[plate.root], plate.from);
  try {
    await access(input);
  } catch {
    throw new Error(`Missing source asset: ${plate.from}`);
  }

  const meta = await sharp(input).metadata();
  /* Never upscale: the delivered file is the ceiling. */
  const width = Math.min(plate.width, meta.width);

  const file = `${plate.id}.webp`;
  const info = await sharp(input)
    /* Phone photographs carry their orientation in EXIF; bake it in. */
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .webp({ quality: 82, effort: 5 })
    .toFile(outPath(file));

  written.add(file);
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
    .toFile(outPath(out));

  written.add(out);
  logoEntries.push({ id, src: `${PUBLIC_PREFIX}/${out}`, width: info.width, height: info.height, file });
}

console.log(`client marks         ${logoEntries.length} trimmed to ${LOGO_BOX.width}x${LOGO_BOX.height}`);

/* --- Retire what the page no longer uses ---------------------------------- */

const removed = [];
for (const entry of await readdir(PUBLIC_DIR, { withFileTypes: true, recursive: true })) {
  if (!entry.isFile()) continue;
  const parent = entry.parentPath ?? entry.path;
  const relative = join(parent, entry.name)
    .replace(/\\/g, "/")
    .split("/images/kiyo/sections/")[1];
  if (!written.has(relative)) {
    await rm(join(parent, entry.name));
    removed.push(relative);
  }
}
/* Empty award folders go with their files. */
for (const dir of ["awards/small/", "awards/"]) {
  await rm(new URL(dir, PUBLIC_DIR), { recursive: true, force: true });
}
if (removed.length) console.log(`retired              ${removed.length} files no plate refers to`);

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
].join("\n");

await writeFile(MANIFEST, body);
console.log(`\nwrote app/components/sectionAssets.ts (${manifest.length} plates, ${logoEntries.length} marks)`);

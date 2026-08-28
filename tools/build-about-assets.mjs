/**
 * Prepare the About chapter's two source images.
 *
 * The previous portrait had the warehouse composited into it, so the section
 * showed a dark strip wherever the image did not reach the section edge. These
 * sources separate the two: a transparent cut-out of the founder over a clean
 * background plate.
 *
 * The portrait is trimmed to its true opaque bounds, because transparent
 * padding is exactly what lets a gap open beside the subject again.
 *
 *   node tools/build-about-assets.mjs [--source <dir>]
 */
import sharp from "sharp";
import { statSync } from "node:fs";

const args = process.argv.slice(2);
const flag = args.indexOf("--source");
const SRC = flag === -1 ? "C:/Users/Admin/Downloads/KiyoWebsiteAssets/samantha" : args[flag + 1];
const OUT = "public/images/kiyo";
const ALPHA_FLOOR = 12;

async function opaqueBounds(file) {
  const image = sharp(file);
  const { width, height } = await image.metadata();
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
  if (maxX < 0) throw new Error(`${file} is fully transparent`);
  return {
    box: { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 },
    source: { width, height },
    padding: { left: minX, right: width - 1 - maxX, top: minY, bottom: height - 1 - maxY },
  };
}

const kb = (file) => Math.round(statSync(file).size / 1024);

const background = `${OUT}/about-warehouse.webp`;
await sharp(`${SRC}/Herobackground.png`).webp({ quality: 82, effort: 5 }).toFile(background);
const backgroundMeta = await sharp(background).metadata();
console.log(`about-warehouse.webp  ${backgroundMeta.width}x${backgroundMeta.height}  ${kb(background)} KB`);

const { box, source, padding } = await opaqueBounds(`${SRC}/samanthaPortrait.png`);
console.log(`\nportrait source ${source.width}x${source.height}`);
console.log(`  transparent padding  left ${padding.left}, right ${padding.right}, top ${padding.top}, bottom ${padding.bottom}`);
console.log(`  trimmed to ${box.width}x${box.height}`);

const portrait = `${OUT}/about-samantha.webp`;
await sharp(`${SRC}/samanthaPortrait.png`)
  .extract(box)
  .resize(Math.min(box.width, 900), null, { fit: "inside" })
  .webp({ quality: 84, alphaQuality: 92, effort: 5 })
  .toFile(portrait);

const portraitMeta = await sharp(portrait).metadata();
console.log(`\nabout-samantha.webp   ${portraitMeta.width}x${portraitMeta.height}  ${kb(portrait)} KB`);
console.log(`  aspect-ratio for CSS: ${portraitMeta.width} / ${portraitMeta.height}`);

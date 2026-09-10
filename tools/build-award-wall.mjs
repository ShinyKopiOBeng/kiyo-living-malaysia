/**
 * Find where each award cut-out actually sits in the About band.
 *
 * The hover lift lays a trophy's own transparent cut-out over the trophy baked
 * into `aboutBand.webp` and scales it. That only works if the two are in exact
 * register: a few pixels out and the trophy ghosts against itself.
 *
 * Measuring the trophies by scanning the band for gold and black is not good
 * enough. It was tried, and the boxes it produced were 15% to 118% away from
 * the cut-outs' own aspect ratios, because the scan picks up neighbouring
 * frames and the shadows under the shelf.
 *
 * So this matches instead. Each cut-out is scaled and slid over a search window
 * and scored on its opaque pixels only, coarse first and then refined, and the
 * best offset and scale wins. The band and the cut-outs came out of the same
 * composition, so a correct match scores near zero; a bad one does not, which
 * is why the score is printed. Anything above WARN is not fit to ship and says
 * so.
 *
 *   node tools/measure-award-wall.mjs
 *
 * Output is the fourteen-row table that goes into app/components/awardWall.ts.
 */

import { readdir } from "node:fs/promises";
import sharp from "sharp";

const BAND = "public/images/kiyo/sections/aboutBand.webp";
const AWARD_DIR = "public/images/kiyo/sections/awards";

/* The cut-outs are numbered in shelf order by the asset build, so the
   directory listing is the order the shelf runs in. */
const awardAssets = await Promise.all(
  (await readdir(AWARD_DIR))
    .filter((f) => f.endsWith(".webp"))
    .sort()
    .map(async (file) => {
      const { width, height } = await sharp(`${AWARD_DIR}/${file}`).metadata();
      return { id: file.replace(/\.webp$/, ""), path: `${AWARD_DIR}/${file}`, width, height };
    }),
);

/* Where to start looking, in percent of the band. These are the V13 numbers,
   eyeballed off the plate; they only have to be close enough to put the true
   position inside the search window. */
const SEED = [
  { left: 56.3, width: 5.3, top: 19.6, height: 15.8 },
  { left: 62.1, width: 5.2, top: 19.6, height: 15.8 },
  { left: 68.6, width: 5.1, top: 19.6, height: 15.8 },
  { left: 74.8, width: 4.4, top: 19.6, height: 15.8 },
  { left: 79.9, width: 5.2, top: 19.6, height: 15.8 },
  { left: 86.8, width: 3.9, top: 19.6, height: 15.8 },
  { left: 91.3, width: 5.4, top: 19.6, height: 15.8 },
  { left: 57.1, width: 5.5, top: 52.9, height: 14.1 },
  { left: 64.4, width: 2.6, top: 52.9, height: 14.1 },
  { left: 68.1, width: 5.2, top: 52.9, height: 14.1 },
  { left: 74.5, width: 4.5, top: 52.9, height: 14.1 },
  { left: 80.2, width: 5.4, top: 52.9, height: 14.1 },
  { left: 86.9, width: 2.8, top: 52.9, height: 14.1 },
  { left: 90.9, width: 5.6, top: 52.9, height: 14.1 },
];

/* Mean absolute channel difference, per opaque pixel, on a 0-255 scale. Below
   GOOD the match is exact enough that the cut-out is invisible at rest. */
const GOOD = 10;
const WARN = 20;

const band = sharp(BAND).removeAlpha();
const { width: BW, height: BH } = await band.metadata();
const { data: bandPx } = await band.raw().toBuffer({ resolveWithObject: true });

/** Score one placement. Lower is better. `step` samples the cut-out. */
function score(cut, cw, ch, left, top, step, best) {
  let sum = 0;
  let n = 0;
  for (let y = 0; y < ch; y += step) {
    const by = top + y;
    if (by < 0 || by >= BH) return Infinity;
    for (let x = 0; x < cw; x += step) {
      const a = cut[(y * cw + x) * 4 + 3];
      if (a < 250) continue;
      const bx = left + x;
      if (bx < 0 || bx >= BW) return Infinity;
      const ci = (y * cw + x) * 4;
      const bi = (by * BW + bx) * 3;
      sum += Math.abs(cut[ci] - bandPx[bi])
        + Math.abs(cut[ci + 1] - bandPx[bi + 1])
        + Math.abs(cut[ci + 2] - bandPx[bi + 2]);
      n += 3;
      /* Give up early once this placement cannot beat the incumbent. */
      if (n > 600 && sum / n > best * 2.5) return Infinity;
    }
  }
  return n ? sum / n : Infinity;
}

async function match(asset, seed) {
  const seedH = Math.round((seed.height / 100) * BH);
  const seedX = Math.round((seed.left / 100) * BW);
  const seedY = Math.round((seed.top / 100) * BH);

  let best = { s: Infinity };

  /* Coarse: every third height, every second pixel, sampling every third
     pixel of the cut-out. Wide enough to cover a bad seed. */
  for (let h = Math.round(seedH * 0.8); h <= Math.round(seedH * 1.25); h += 3) {
    const w = Math.max(2, Math.round((asset.width / asset.height) * h));
    const cut = await sharp(asset.path)
      .resize(w, h, { fit: "fill" })
      .ensureAlpha()
      .raw()
      .toBuffer();

    for (let dy = -22; dy <= 22; dy += 2) {
      for (let dx = -22; dx <= 22; dx += 2) {
        const s = score(cut, w, h, seedX + dx, seedY + dy, 3, best.s);
        if (s < best.s) best = { s, h, w, x: seedX + dx, y: seedY + dy };
      }
    }
  }

  /* Fine: every height and every pixel around the coarse winner, scoring every
     cut-out pixel. */
  const c = best;
  best = { s: Infinity };
  for (let h = c.h - 3; h <= c.h + 3; h += 1) {
    const w = Math.max(2, Math.round((asset.width / asset.height) * h));
    const cut = await sharp(asset.path)
      .resize(w, h, { fit: "fill" })
      .ensureAlpha()
      .raw()
      .toBuffer();

    for (let dy = -3; dy <= 3; dy += 1) {
      for (let dx = -3; dx <= 3; dx += 1) {
        const s = score(cut, w, h, c.x + dx, c.y + dy, 1, best.s);
        if (s < best.s) best = { s, h, w, x: c.x + dx, y: c.y + dy };
      }
    }
  }

  return best;
}

const rows = [];
let worst = 0;

for (let i = 0; i < awardAssets.length; i++) {
  const asset = awardAssets[i];
  const best = await match(asset, SEED[i]);
  worst = Math.max(worst, best.s);

  const row = {
    id: asset.id,
    left: (best.x / BW) * 100,
    width: (best.w / BW) * 100,
    top: (best.y / BH) * 100,
    height: (best.h / BH) * 100,
    score: best.s,
  };
  rows.push(row);

  const flag = best.s <= GOOD ? "ok" : best.s <= WARN ? "CHECK" : "REJECT";
  console.log(
    `${String(i + 1).padStart(2, "0")} ${asset.id.padEnd(36)} ` +
    `left ${row.left.toFixed(2)}  width ${row.width.toFixed(2)}  ` +
    `top ${row.top.toFixed(2)}  height ${row.height.toFixed(2)}  ` +
    `score ${best.s.toFixed(1)}  ${flag}`,
  );
}

console.log("\n/* Generated by tools/measure-award-wall.mjs. */");
console.log("const PLACES = [");
for (const r of rows) {
  console.log(
    `  { left: ${r.left.toFixed(2)}, width: ${r.width.toFixed(2)}, ` +
    `top: ${r.top.toFixed(2)}, height: ${r.height.toFixed(2)} },` +
    ` /* ${r.id}, match ${r.score.toFixed(1)} */`,
  );
}
console.log("];");

if (worst > WARN) {
  console.error(`\nA trophy scored ${worst.toFixed(1)}, above the ${WARN} limit. Do not ship that row.`);
  process.exitCode = 1;
}

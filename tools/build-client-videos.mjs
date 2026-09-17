/**
 * Turn the chosen client clips into the shipped video set.
 *
 * The clips are phone video out of KIYO's client archive: 464-576px wide,
 * 3-7MB each, some at 60fps. Each is re-encoded once for the web (H.264, at
 * most 540px wide, 30fps, AAC audio, moov atom first so playback starts before
 * the download ends) and a poster frame is taken at the moment named below,
 * because the first frame of a phone clip is usually a blur.
 *
 * ffmpeg is not a project dependency. Point `FFMPEG` at a binary, or have one
 * on the PATH:
 *
 *   FFMPEG=/path/to/ffmpeg node tools/build-client-videos.mjs [--source <KIYO-Clients-Picks>]
 */

import { execFileSync } from "node:child_process";
import { mkdir, readdir, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const args = process.argv.slice(2);
const at = args.indexOf("--source");
const SOURCE = at === -1 ? "C:/Users/Admin/Downloads/KIYO-Clients-Picks" : args[at + 1];
const FFMPEG = process.env.FFMPEG ?? "ffmpeg";
const OUT = new URL("../public/media/clients/", import.meta.url);

/** id, source file, and the second the poster is taken at. */
const CLIPS = [
  { id: "irkaz-office", from: "video-irkaz-office.mp4", poster: 1 },
  { id: "hejira-umrah", from: "video-hejira-umrah.mp4", poster: 1 },
  { id: "aq-grand-opening", from: "video-aq-grand-opening.mp4", poster: 4 },
];

await mkdir(OUT, { recursive: true });
const outPath = (file) => new URL(file, OUT).pathname.replace(/^\//, "");
const written = new Set();

for (const clip of CLIPS) {
  const input = join(SOURCE, clip.from);
  const video = `${clip.id}.mp4`;
  const poster = `${clip.id}.webp`;

  execFileSync(FFMPEG, [
    "-y", "-loglevel", "error",
    "-i", input,
    /* Never upscale; even width and height, which H.264 needs. */
    "-vf", "scale='min(540,iw)':-2,fps=30",
    "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-profile:v", "main", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "96k", "-ac", "2",
    "-movflags", "+faststart",
    outPath(video),
  ]);

  const frame = execFileSync(FFMPEG, [
    "-loglevel", "error",
    "-ss", String(clip.poster), "-i", input,
    "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-",
  ], { maxBuffer: 64 * 1024 * 1024 });
  const info = await sharp(frame).resize({ width: 540, withoutEnlargement: true }).webp({ quality: 80 }).toFile(outPath(poster));

  written.add(video);
  written.add(poster);
  const size = (await stat(outPath(video))).size;
  console.log(`${clip.id.padEnd(18)} ${(size / 1024 / 1024).toFixed(1)}MB  poster ${info.width}x${info.height}`);
}

/* Anything in the folder that no clip wrote is a leftover. */
for (const file of await readdir(OUT)) {
  if (!written.has(file)) {
    await rm(new URL(file, OUT));
    console.log(`retired            ${file}`);
  }
}

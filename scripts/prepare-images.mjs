// Prepares every image the site uses from the raw exports in /images and
// /image-based-portfolio. Re-run after adding or replacing source images:
//   bun scripts/prepare-images.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const src = (...p) => path.join(root, ...p);
const out = (...p) => {
  const file = path.join(root, "public", ...p);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  return file;
};

// Lana's cutout, trimmed to the subject so it can be positioned precisely.
await sharp(src("images/foto_lana_transparent_bg.png"))
  .extract({ left: 170, top: 190, width: 910, height: 1410 })
  .webp({ quality: 88, alphaQuality: 95 })
  .toFile(out("images/lana-cutout.webp"));

await sharp(src("images/foto_lana_with_bg.jpg"))
  .webp({ quality: 85 })
  .toFile(out("images/lana.webp"));

// Social preview: the title slide without the Canva frame.
await sharp(src("image-based-portfolio/slide_01.png"))
  .extract({ left: 10, top: 9, width: 1083, height: 607 })
  .resize(1200, 630, { fit: "cover" })
  .jpeg({ quality: 88 })
  .toFile(out("og.jpg"));

// SwapCloset brochure: 4 x 2 grid of pages (bounds measured from background gaps).
const swapCols = [
  [28, 310],
  [341, 623],
  [653, 936],
  [966, 1248],
];
const swapRows = [
  [49, 446],
  [482, 880],
];
let page = 1;
for (const [top, bottom] of swapRows) {
  for (const [left, right] of swapCols) {
    await sharp(src("images/foto_swapcloset.png"))
      .extract({ left, top, width: right - left + 1, height: bottom - top + 1 })
      .resize({ width: 566, kernel: "lanczos3" })
      .webp({ quality: 90 })
      .toFile(out(`work/swapcloset/page-${page++}.webp`));
  }
}

// Líkami training guide: 9 x 3 grid of pages. The bottom 12px of each tile is
// the overview's "01 / 27" label strip, which the site renders itself.
const likamiCols = [
  [12, 166],
  [170, 326],
  [331, 487],
  [491, 645],
  [650, 805],
  [810, 964],
  [969, 1125],
  [1129, 1283],
  [1289, 1444],
];
const likamiRows = [
  [7, 233],
  [238, 465],
  [471, 698],
];
page = 1;
for (const [top, bottom] of likamiRows) {
  for (const [left, right] of likamiCols) {
    await sharp(src("images/foto_likami.png"))
      .extract({ left, top, width: right - left + 1, height: bottom - top + 1 - 12 })
      .resize({ width: 400, kernel: "lanczos3" })
      .sharpen({ sigma: 0.6 })
      .webp({ quality: 92 })
      .toFile(out(`work/likami/page-${String(page++).padStart(2, "0")}.webp`));
  }
}

// The Líkami cover is larger on the "Selected work" slide than in the overview.
await sharp(src("image-based-portfolio/slide_04.png"))
  .extract({ left: 443, top: 201, width: 228, height: 302 })
  .resize({ width: 456, kernel: "lanczos3" })
  .webp({ quality: 92 })
  .toFile(out("work/likami/cover.webp"));

// Moodboard: original photos named images/moodboard_<n>.{jpg,jpeg,png,webp} win;
// otherwise fall back to the collage cropped from slide 7.
const moodDir = out("moodboard/.keep");
fs.rmSync(path.dirname(moodDir), { recursive: true, force: true });
const originals = fs
  .readdirSync(src("images"))
  .filter((f) => /^moo?r?dboard_.*\.(jpe?g|png|webp)$/i.test(f))
  .sort((a, b) => parseInt(a.match(/\d+/)) - parseInt(b.match(/\d+/)));
if (originals.length) {
  for (const [i, f] of originals.entries()) {
    await sharp(src("images", f))
      .rotate()
      .resize({ width: 900, height: 900, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(out(`moodboard/mood-${i + 1}.webp`));
  }
} else {
  await sharp(src("image-based-portfolio/slide_07.png"))
    .extract({ left: 626, top: 164, width: 420, height: 398 })
    .resize({ width: 840, kernel: "lanczos3" })
    .webp({ quality: 90 })
    .toFile(out("moodboard/collage.webp"));
}

console.log(
  `Done. Moodboard: ${originals.length ? `${originals.length} original photo(s)` : "collage fallback from slide 7"}.`,
);

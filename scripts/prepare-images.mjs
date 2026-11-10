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
const pad = (n) => String(n).padStart(2, "0");

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

// ---------------------------------------------------------------------------
// Project pages.
//
// High-res exports live in images/my_work/<project>/, named after the page they
// hold: "6.png" or "swapcloset_6.png". A two-page spread is named after both
// pages ("swapcloset_2_3.png") and cut in half.
//
// A project with a translated version keeps each language in its own subfolder
// (images/my_work/likami/en, .../nl). A page missing in one language falls back
// to the other language's export, then to a crop of the overview image. A
// project without language folders uses the same pages for every language.

// Keep in sync with `locales` in i18n/config.ts.
const locales = ["en", "nl"];

// Crop page n (1-based) out of an overview image laid out as a grid of pages.
const gridCrop = (file, cols, rows, trimBottom = 0) => (n) => {
  const [left, right] = cols[(n - 1) % cols.length];
  const [top, bottom] = rows[Math.floor((n - 1) / cols.length)];
  return sharp(src(file)).extract({ left, top, width: right - left + 1, height: bottom - top + 1 - trimBottom });
};

const projects = {
  swapcloset: {
    dirs: { all: "swapcloset" },
    pages: 8,
    // 4 x 2 grid of pages, bounds measured from the background gaps.
    fallback: gridCrop(
      "images/foto_swapcloset.png",
      [[28, 310], [341, 623], [653, 936], [966, 1248]],
      [[49, 446], [482, 880]],
    ),
  },
  likami: {
    dirs: { en: "likami/en", nl: "likami/nl" },
    pages: 27,
    // 9 x 3 grid; the bottom 12px of each tile is the overview's "01 / 27" label.
    fallback: gridCrop(
      "images/foto_likami.png",
      [[12, 166], [170, 326], [331, 487], [491, 645], [650, 805], [810, 964], [969, 1125], [1129, 1283], [1289, 1444]],
      [[7, 233], [238, 465], [471, 698]],
      12,
    ),
  },
};

const workDir = path.resolve(root, process.env.MY_WORK_DIR ?? "images/my_work");

// Map page number -> { file, half } where half is "left", "right" or null.
function findHighRes(dir, pages) {
  const sources = new Map();
  if (!dir) return sources;
  const folder = path.join(workDir, dir);
  if (!fs.existsSync(folder)) return sources;

  const claim = (page, source) => {
    if (page < 1 || page > pages) return console.warn(`  ! ${path.basename(source.file)}: page ${page} is out of range, skipped`);
    if (sources.has(page)) {
      console.warn(`  ! page ${page} is in both ${path.basename(sources.get(page).file)} and ${path.basename(source.file)}; using the first`);
      return;
    }
    sources.set(page, source);
  };

  for (const f of fs.readdirSync(folder).sort()) {
    const m = f.match(/(?:^|[_\s-])(\d+)(?:_(\d+))?\.(png|jpe?g|webp)$/i);
    if (!m) continue;
    const file = path.join(folder, f);
    const first = Number(m[1]);
    if (m[2]) {
      claim(first, { file, half: "left" });
      claim(Number(m[2]), { file, half: "right" });
    } else {
      claim(first, { file, half: null });
    }
  }
  return sources;
}

async function highResPage({ file, half }) {
  const image = sharp(file);
  const { width, height } = await image.metadata();
  const landscape = width > height * 1.2;
  if (!half) {
    if (landscape) console.warn(`  ! ${path.basename(file)} looks like a spread; name it after both pages (e.g. name_2_3.png) to split it`);
    return image;
  }
  if (!landscape) throw new Error(`${path.basename(file)} is named as a two-page spread but isn't landscape`);
  const leftWidth = Math.floor(width / 2);
  return image.extract(
    half === "left"
      ? { left: 0, top: 0, width: leftWidth, height }
      : { left: leftWidth, top: 0, width: width - leftWidth, height },
  );
}

fs.rmSync(path.join(root, "public", "work"), { recursive: true, force: true });
const manifest = {};

// Write one set of pages to public/work/<folder>/; sourceFor(n) picks page n's
// high-res export (or nothing, for the overview fallback).
async function renderPages(project, folder, sourceFor) {
  const entries = [];
  for (let n = 1; n <= project.pages; n++) {
    const source = sourceFor(n);
    // Extracted regions are flattened to a buffer so they can be resized twice.
    const base = source ? await highResPage(source) : project.fallback(n);
    const buffer = await base.png().toBuffer();

    const thumb = await sharp(buffer)
      .resize({ width: 600, kernel: "lanczos3" })
      .webp({ quality: 88 })
      .toFile(out(`work/${folder}/page-${pad(n)}.webp`));
    const full = source
      ? await sharp(buffer)
          .resize({ width: 1600, withoutEnlargement: true, kernel: "lanczos3" })
          .webp({ quality: 90 })
          .toFile(out(`work/${folder}/full/page-${pad(n)}.webp`))
      : thumb;

    entries.push({
      thumb: { src: `/work/${folder}/page-${pad(n)}.webp`, width: thumb.width, height: thumb.height },
      full: {
        src: source ? `/work/${folder}/full/page-${pad(n)}.webp` : `/work/${folder}/page-${pad(n)}.webp`,
        width: full.width,
        height: full.height,
      },
      hiRes: Boolean(source),
    });
  }
  return entries;
}

// notes: { "reason": [page numbers] } for pages that didn't use their own export.
function report(label, total, notes) {
  const borrowed = Object.values(notes).flat().length;
  const details = Object.entries(notes)
    .filter(([, list]) => list.length)
    .map(([reason, list]) => ` (${reason} for page ${list.join(", ")})`)
    .join("");
  console.log(`${label}: ${total - borrowed}/${total} high-res${details}`);
}

// The manifest maps project -> locale -> pages.
for (const [name, project] of Object.entries(projects)) {
  manifest[name] = {};

  if (project.dirs.all) {
    const sources = findHighRes(project.dirs.all, project.pages);
    const entries = await renderPages(project, name, (n) => sources.get(n));
    for (const locale of locales) manifest[name][locale] = entries;
    report(name, project.pages, { "overview fallback": entries.flatMap((e, i) => (e.hiRes ? [] : [i + 1])) });
    continue;
  }

  const byLocale = Object.fromEntries(locales.map((l) => [l, findHighRes(project.dirs[l], project.pages)]));
  for (const locale of locales) {
    const notes = { "other language": [], "overview fallback": [] };
    manifest[name][locale] = await renderPages(project, `${name}/${locale}`, (n) => {
      const own = byLocale[locale].get(n);
      if (own) return own;
      const other = locales.map((l) => byLocale[l].get(n)).find(Boolean);
      notes[other ? "other language" : "overview fallback"].push(n);
      return other;
    });
    report(`${name} (${locale})`, project.pages, notes);
  }
}

fs.mkdirSync(src("generated"), { recursive: true });
fs.writeFileSync(src("generated/work-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

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
  `Moodboard: ${originals.length ? `${originals.length} original photo(s)` : "collage fallback from slide 7"}.`,
);
